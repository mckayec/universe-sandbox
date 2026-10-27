// Moving galaxy pictures. An undisturbed galaxy is drawn as one rigid, slowly turning picture that follows its
// core (cheap, and its spiral pattern stays crisp). Once another galaxy or a loose black hole comes close, or the
// galaxy loses its core, the picture "goes live": every rendered star becomes a tracer that orbits in the summed
// gravity of all galaxy cores and halos (see galaxy-field.ts), so encounters throw out tidal tails and bridges,
// and a merger scatters the stars instead of freezing them or making them vanish.
import * as THREE from 'three';
import { G } from '../celestial-catalog.ts';
import { advanceTracers, haloFraction, substepsFor, type FieldSource } from '../galaxy-field.ts';
import {
  DEFAULT_HALO_SCALE,
  GALAXY_CORE_SOFTENING,
  galaxyExtent,
  galaxyFriction,
  galaxySpinTangent,
} from '../physics/galaxy-dynamics.ts';
import { scene } from '../scene/setup.ts';
import { app, bodies, cosmicGroups, galaxyVisuals } from '../state/app-state.ts';
import type { Body, GalaxyLive, GalaxyVisual } from '../state/types.ts';

/** Loose black holes at least this massive stir up a galaxy they pass through. */
const PERTURBER_MASS = 150,
  LIVE_LAYERS = new Set(['galaxyStarField', 'galaxyNursery', 'galaxyHaze']),
  /** Seconds over which the painted disk hands its light over to the moving stars and haze. */
  HANDOVER = 5;

let lastElapsed = 0;
const byId = new Map<number, Body>(),
  tangent = new THREE.Vector3();

type Source = FieldSource & { body: Body; groupId?: number; extent: number };
function fieldSources(): Source[] {
  const list: Source[] = [],
    cores = new Set<number>(),
    g = G * app.gravity;
  for (const group of cosmicGroups) {
    if (group.kind !== 'galaxy' || group.anchorId === undefined) continue;
    const anchor = byId.get(group.anchorId);
    if (!anchor) continue;
    cores.add(anchor.id);
    list.push({
      body: anchor,
      groupId: group.id,
      extent: group.extent ?? galaxyExtent(group.style),
      x: anchor.mesh.position.x,
      z: anchor.mesh.position.z,
      gm: g * anchor.mass,
      soft2: GALAXY_CORE_SOFTENING,
      haloGM: g * (group.haloMass ?? 0),
      haloScale: group.haloScale ?? DEFAULT_HALO_SCALE,
    });
  }
  for (const body of bodies)
    if (body.kind === 'blackhole' && !cores.has(body.id) && body.mass >= PERTURBER_MASS)
      list.push({
        body,
        extent: 0,
        x: body.mesh.position.x,
        z: body.mesh.position.z,
        gm: g * body.mass,
        soft2: Math.max(4, body.radius * body.radius * 4),
        haloGM: 0,
        haloScale: DEFAULT_HALO_SCALE,
      });
  return list;
}
function disturbed(visual: GalaxyVisual, anchor: Body, sources: Source[]) {
  if (visual.anchorId !== visual.originalAnchorId) return true;
  for (const source of sources) {
    if (source.body === anchor) continue;
    const distance = source.body.mesh.position.distanceTo(anchor.mesh.position),
      reach = source.groupId !== undefined ? visual.extent + source.extent : visual.extent * 1.1;
    if (distance < reach) return true;
  }
  return false;
}
/** Release the picture's stars into world space, each on a circular orbit of its own galaxy. */
function goLive(visual: GalaxyVisual, anchor: Body, sources: Source[]) {
  const root = visual.object;
  root.updateMatrixWorld(true);
  const layers = root.children.filter(
    (child): child is THREE.Points => child instanceof THREE.Points && LIVE_LAYERS.has(child.name),
  );
  let n = 0;
  for (const points of layers) n += points.geometry.getAttribute('position').count;
  const live: GalaxyLive = {
      n,
      x: new Float32Array(n),
      z: new Float32Array(n),
      vx: new Float32Array(n),
      vz: new Float32Array(n),
      y: new Float32Array(n),
      layers: [],
      holder: new THREE.Group(),
      age: 0,
      phase: 0,
      pending: new Array(MAX_STRIDE).fill(0),
    },
    own = sources.find(source => source.body === anchor),
    g = G * app.gravity,
    gm = own ? own.gm : g * anchor.mass,
    soft2 = own ? own.soft2 : GALAXY_CORE_SOFTENING,
    haloGM = own ? own.haloGM : 0,
    haloScale = own ? own.haloScale : DEFAULT_HALO_SCALE,
    e = root.matrixWorld.elements;
  live.holder.name = 'galaxyLiveStars';
  let offset = 0;
  for (const points of layers) {
    const attribute = points.geometry.getAttribute('position') as THREE.BufferAttribute,
      count = attribute.count;
    for (let i = 0; i < count; i++) {
      const lx = attribute.getX(i),
        ly = attribute.getY(i),
        lz = attribute.getZ(i),
        x = e[0] * lx + e[4] * ly + e[8] * lz + e[12],
        y = e[1] * lx + e[5] * ly + e[9] * lz + e[13],
        z = e[2] * lx + e[6] * ly + e[10] * lz + e[14],
        dx = x - anchor.mesh.position.x,
        dz = z - anchor.mesh.position.z,
        r = Math.max(0.5, Math.hypot(dx, dz)),
        // Same pulls the tracers will feel: softened core plus the enclosed halo.
        speed = Math.sqrt(Math.max(0, (gm * r) / (r * r + soft2) + (haloGM * haloFraction(r, haloScale)) / r)),
        dir = galaxySpinTangent(dx, dz, tangent),
        j = offset + i;
      live.x[j] = x;
      live.y[j] = y;
      live.z[j] = z;
      live.vx[j] = anchor.velocity.x + dir.x * speed;
      live.vz[j] = anchor.velocity.z + dir.z * speed;
    }
    root.remove(points);
    points.position.set(0, 0, 0);
    points.rotation.set(0, 0, 0);
    points.frustumCulled = false;
    live.holder.add(points);
    live.layers.push({ points, offset, count });
    offset += count;
  }
  scene.add(live.holder);
  visual.live = live;
  writePositions(live);
}
/** Draw every star where it is now: subsets still waiting for their update are carried forward on their velocity. */
function writePositions(live: GalaxyLive) {
  const { pending } = live;
  for (const layer of live.layers) {
    const attribute = layer.points.geometry.getAttribute('position') as THREE.BufferAttribute,
      array = attribute.array as Float32Array;
    for (let i = 0; i < layer.count; i++) {
      const j = layer.offset + i,
        wait = stride > 1 ? pending[j % stride] : 0;
      array[i * 3] = live.x[j] + live.vx[j] * wait;
      array[i * 3 + 1] = live.y[j];
      array[i * 3 + 2] = live.z[j] + live.vz[j] * wait;
    }
    attribute.needsUpdate = true;
  }
}
type Friction = Parameters<typeof advanceTracers>[4];
/** Advance one live galaxy: the next subset of its stars by the time that subset has been waiting. */
function advanceLive(live: GalaxyLive, sources: Source[], simDt: number, friction: Friction) {
  for (let p = 0; p < stride; p++) live.pending[p] += simDt;
  const p = live.phase % stride,
    dt = live.pending[p];
  live.phase = (live.phase + 1) % stride;
  live.pending[p] = 0;
  advanceTracers(live, sources, dt, substepsFor(dt), friction, p, stride);
}
/** Bring every subset up to date (before the stride changes). */
function flush(live: GalaxyLive, sources: Source[], friction: Friction) {
  for (let p = 0; p < stride; p++) {
    const dt = live.pending[p];
    live.pending[p] = 0;
    if (dt > 0) advanceTracers(live, sources, dt, substepsFor(dt), friction, p, stride);
  }
  live.phase = 0;
}
/**
 * How many frames a full update of all live stars is spread over. It adapts to keep tracer work within about
 * 5 ms a frame: 1 on a fast computer with one encounter, more for several big galaxies or a slow device.
 */
let stride = 1,
  costEstimate = 0,
  lastStrideChange = 0;
const MAX_STRIDE = 6;
function adaptStride(ms: number, now: number) {
  costEstimate = costEstimate ? costEstimate * 0.85 + ms * 0.15 : ms;
  if (now - lastStrideChange < 0.6) return stride;
  if (costEstimate > 5.5 && stride < MAX_STRIDE) {
    lastStrideChange = now;
    return stride + 1;
  }
  if (costEstimate < 2 && stride > 1) {
    lastStrideChange = now;
    return stride - 1;
  }
  return stride;
}
function setUniform(object: THREE.Object3D | undefined, name: string, value: number) {
  const material = (object as THREE.Mesh | THREE.Points | undefined)?.material;
  if (material instanceof THREE.ShaderMaterial && material.uniforms[name]) material.uniforms[name].value = value;
}
function handOver(visual: GalaxyVisual, live: GalaxyLive, realDt: number) {
  const p = THREE.MathUtils.smoothstep(live.age, 0, HANDOVER);
  setUniform(visual.object.getObjectByName('galaxyDisk'), 'uFade', 1 - p);
  for (const layer of live.layers)
    setUniform(layer.points, 'uGain', layer.points.name === 'galaxyHaze' ? p : 1 + 0.3 * p);
  // A galaxy whose core was swallowed no longer has a bulge of its own: its glow fades into the survivor's.
  if (visual.anchorId === visual.originalAnchorId) return;
  const bulge = visual.object.getObjectByName('galaxyBulge') as THREE.Mesh | undefined,
    material = bulge?.material;
  if (!(material instanceof THREE.ShaderMaterial) || !material.uniforms.uIntensity) return;
  bulge!.userData.baseIntensity ??= material.uniforms.uIntensity.value;
  bulge!.userData.orphanAge = Number(bulge!.userData.orphanAge ?? 0) + realDt;
  material.uniforms.uIntensity.value =
    bulge!.userData.baseIntensity * (1 - THREE.MathUtils.smoothstep(bulge!.userData.orphanAge, 0, 8));
}
/** Per frame: follow cores, wake disturbed galaxies, and advance every live galaxy's stars by simulated time. */
export function updateGalaxyMotion(realDt: number) {
  if (!galaxyVisuals.size) {
    lastElapsed = app.elapsed;
    return;
  }
  let simDt = app.elapsed - lastElapsed;
  lastElapsed = app.elapsed;
  if (simDt < 0 || simDt > 2) simDt = 0;
  byId.clear();
  for (const body of bodies) byId.set(body.id, body);
  const sources = fieldSources(),
    started = performance.now();
  let worked = false;
  for (const visual of galaxyVisuals.values()) {
    const anchor = byId.get(visual.anchorId);
    if (anchor) {
      visual.object.position.copy(anchor.mesh.position);
      if (!visual.live) {
        visual.object.rotation.y += realDt * (visual.style === 'globular' ? 0.003 : 0.008);
        if (disturbed(visual, anchor, sources)) goLive(visual, anchor, sources);
      }
    }
    const live = visual.live;
    if (!live) continue;
    live.age += realDt;
    handOver(visual, live, realDt);
    if (simDt <= 0) continue;
    const friction = galaxyFriction.get(visual.groupId);
    advanceLive(
      live,
      sources,
      simDt,
      friction && anchor
        ? {
            ax: friction.ax,
            az: friction.az,
            cx: anchor.mesh.position.x,
            cz: anchor.mesh.position.z,
            radius: visual.extent * 0.5,
          }
        : undefined,
    );
    writePositions(live);
    worked = true;
  }
  if (!worked) return;
  const next = adaptStride(performance.now() - started, performance.now() / 1000);
  if (next !== stride) {
    for (const visual of galaxyVisuals.values()) if (visual.live) flush(visual.live, sources, undefined);
    stride = next;
  }
}
