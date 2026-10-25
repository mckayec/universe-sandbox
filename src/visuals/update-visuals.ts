// Per-frame visual updates for bodies, galaxies, trails and tidal deformation.
import * as THREE from 'three';
import { updateNebulaPart } from '../nebula-hd.ts';
import { STAGES, TYPES } from '../celestial-catalog.ts';
import { galaxyUniforms } from '../galaxy-visuals.ts';
import { bodyBaseScale } from '../bodies/lifecycle.ts';
import { composer, isCompact } from '../scene/setup.ts';
import { app, bodies, galaxyVisuals, trails } from '../state/app-state.ts';
import type { Body } from '../state/types.ts';
import { animateRelativisticJets } from './jets.ts';

function tidalFrameFor(b: Body) {
  const g = b.mesh,
    existing = g.getObjectByName('tidalFrame');
  if (existing) return existing;
  const surface = g.getObjectByName('bodySurface');
  if (!surface || surface.parent !== g) return undefined;
  const frame = new THREE.Group();
  frame.name = 'tidalFrame';
  g.add(frame);
  frame.add(surface);
  for (const child of [...g.children]) if (child.name === 'planetAtmosphere') frame.add(child);
  return frame;
}
function setTidalVisualScale(b: Body, base: number) {
  const strain = THREE.MathUtils.clamp(b.tidalStretch, 0, 0.88),
    elongation = strain * 0.42,
    compression = strain * 0.11;
  b.mesh.scale.setScalar(base);
  if (!b.artificial) b.mesh.rotation.y = b.kind === 'pulsar' ? (b.spinAngle ?? 0) : 0;
  const frame = tidalFrameFor(b),
    surface = b.mesh.getObjectByName('bodySurface');
  if (!frame || !surface) return;
  const target = -b.tidalAngle,
    current = b.tidalVisualAngle ?? target,
    delta = Math.atan2(Math.sin(target - current), Math.cos(target - current)),
    angle = strain > 0.004 ? current + delta * 0.12 : current;
  b.tidalVisualAngle = angle;
  frame.rotation.y = angle;
  frame.scale.set(1 + elongation, 1 - compression, 1 - compression * 0.72);
  surface.rotation.y = (b.artificial ? 0 : (b.spinAngle ?? 0)) - angle;
}

// Module-scope temporaries for per-frame work.
const tmpAway = new THREE.Vector3(),
  tmpQuat = new THREE.Quaternion(),
  X_AXIS = new THREE.Vector3(1, 0, 0),
  bodyById = new Map<number, Body>(),
  visibleZoneStars = new Set<number>();
// Names of parts that the per-frame update animates; anything else is skipped without a string compare chain.
const ANIMATED_PARTS = new Set([
  'nebulaVolume',
  'nebulaRaymarch',
  'protoDisk',
  'protoGlow',
  'protoJets',
  'lensingArc',
  'blackHoleJets',
  'pulsarBeams',
  'prominence',
  'stellarCorona',
  'stellarShell',
  'nebulaDust',
  'accretionDiskHot',
  'accretionDiskMid',
  'accretionDiskDust',
]);
type PartCache = { childCount: number; parts: THREE.Object3D[] };
/**
 * The descendants of a body visual that need per-frame work, collected once per visual and rebuilt only when
 * its top-level structure changes (e.g. a worldship hull is attached).
 */
function animatedParts(b: Body) {
  const cache = b.mesh.userData.partCache as PartCache | undefined;
  if (cache && cache.childCount === b.mesh.children.length) return cache.parts;
  const parts: THREE.Object3D[] = [];
  b.mesh.traverse(o => {
    if (o === b.mesh) return;
    const material = (o as THREE.Mesh).material;
    if (
      ANIMATED_PARTS.has(o.name) ||
      o.userData.nebulaHD ||
      o instanceof THREE.Sprite ||
      (material instanceof THREE.ShaderMaterial && (material.uniforms.time || material.uniforms.tidal))
    )
      parts.push(o);
  });
  b.mesh.userData.partCache = { childCount: b.mesh.children.length, parts } satisfies PartCache;
  return parts;
}

function updateCometVisual(b: Body) {
  const tail = b.mesh.getObjectByName('cometTail') as THREE.Points | undefined,
    coma = b.mesh.getObjectByName('cometComa') as THREE.Sprite | undefined;
  if (!tail) return;
  let source: Body | undefined,
    distance = Infinity;
  for (const candidate of bodies) {
    if (candidate === b || !['star', 'brown', 'protostar'].includes(candidate.kind)) continue;
    const d = b.mesh.position.distanceTo(candidate.mesh.position);
    if (d < distance) {
      distance = d;
      source = candidate;
    }
  }
  const away = source
    ? tmpAway.copy(b.mesh.position).sub(source.mesh.position)
    : b.velocity.lengthSq() > 0.01
      ? tmpAway.copy(b.velocity).multiplyScalar(-1)
      : tmpAway.set(1, 0, 0);
  if (away.lengthSq() < 0.001) away.set(1, 0, 0);
  away.normalize().applyQuaternion(tmpQuat.copy(b.mesh.quaternion).invert());
  tail.quaternion.setFromUnitVectors(X_AXIS, away);
  const activity = source ? THREE.MathUtils.clamp(1 - distance / 80, 0.18, 1) : 0.2;
  tail.scale.set(0.45 + activity * 0.95, 0.62 + activity * 0.5, 0.62 + activity * 0.5);
  const material = tail.material as THREE.PointsMaterial;
  material.opacity = (tail.userData.baseOpacity ?? 0.7) * (0.35 + activity * 0.65);
  if (coma) {
    const comaMaterial = coma.material as THREE.SpriteMaterial;
    comaMaterial.opacity = 0.07 + activity * 0.2;
    coma.scale.setScalar(0.7 + activity * 0.75);
  }
}
export function updateVisuals(dt: number) {
  galaxyUniforms.uViewportH.value = composer.renderTarget1.height;
  if (galaxyVisuals.size) {
    bodyById.clear();
    for (const body of bodies) bodyById.set(body.id, body);
  }
  for (const visual of galaxyVisuals.values()) {
    const anchor = visual.anchorId === undefined ? undefined : bodyById.get(visual.anchorId);
    if (anchor) {
      visual.object.position.copy(anchor.mesh.position);
      visual.object.rotation.y += dt * (visual.style === 'globular' ? 0.003 : 0.008);
    }
  }
  // Life zones show around the stars nearest a dragged planet, or (so touch visitors can find them without
  // dragging) around the selected star / the stars nearest a selected world.
  const isWorld = (kind: string) => kind === 'rocky' || kind === 'dwarf' || kind === 'moon' || kind === 'gas',
    planetFocus =
      app.dragBody && isWorld(app.dragBody.kind)
        ? app.dragBody
        : app.selectedBody && isWorld(app.selectedBody.kind)
          ? app.selectedBody
          : null;
  visibleZoneStars.clear();
  if (app.habitabilityGuides) {
    if (planetFocus)
      for (const star of bodies
        .filter(candidate => candidate.kind === 'star')
        .sort(
          (a, b) =>
            a.mesh.position.distanceToSquared(planetFocus.mesh.position) -
            b.mesh.position.distanceToSquared(planetFocus.mesh.position),
        )
        .slice(0, 3))
        visibleZoneStars.add(star.id);
    else if (app.selectedBody?.kind === 'star') visibleZoneStars.add(app.selectedBody.id);
  }
  for (const b of bodies) {
    if (b.kind === 'comet') updateCometVisual(b);
    if (b.kind === 'nebula') {
      const base = Math.cbrt(Math.max(0.05, b.mass / b.birthMass)),
        tidal = b.nebulaTidal,
        compression = b.nebulaCompression;
      b.mesh.scale.set(
        base * (1 + tidal * 0.26 + compression * 0.12),
        base * (1 - tidal * 0.06 - compression * 0.12),
        base * (1 + tidal * 0.08 + compression * 0.16),
      );
      b.mesh.rotation.y = b.nebulaAngle + app.elapsed * 0.025;
    } else setTidalVisualScale(b, bodyBaseScale(b));
    if (b.stageTransition) {
      const transition = b.stageTransition,
        raw = THREE.MathUtils.clamp(transition.age / transition.duration, 0, 1),
        p = raw * raw * (3 - 2 * raw),
        from = STAGES.find(s => s.stage === transition.from)!,
        to = STAGES.find(s => s.stage === transition.to)!,
        massScale = Math.cbrt(Math.max(0.05, b.mass / b.birthMass)),
        base = massScale * THREE.MathUtils.lerp(from.scale, to.scale, p);
      setTidalVisualScale(b, base);
      b.radius = TYPES.star.radius * base;
      const color = new THREE.Color(from.color).lerp(new THREE.Color(to.color), p),
        hot = new THREE.Color(from.color)
          .lerp(new THREE.Color(0xffffff), from.temperature > 9000 ? 0.9 : 0.72)
          .lerp(new THREE.Color(to.color).lerp(new THREE.Color(0xffffff), to.temperature > 9000 ? 0.9 : 0.72), p);
      b.mesh.traverse(o => {
        const mat = (o as THREE.Mesh).material;
        if (mat instanceof THREE.ShaderMaterial && mat.uniforms.base) {
          mat.uniforms.base.value.copy(color);
          mat.uniforms.hot.value.copy(hot);
          mat.uniforms.granules.value = THREE.MathUtils.lerp(from.granules, to.granules, p);
          mat.uniforms.turbulence.value = THREE.MathUtils.lerp(from.turbulence, to.turbulence, p);
          mat.uniforms.spotStrength.value = THREE.MathUtils.lerp(from.spots, to.spots, p);
          mat.uniforms.brightness.value = THREE.MathUtils.lerp(from.brightness, to.brightness, p);
        }
        if (o.name === 'stellarCorona' && mat instanceof THREE.ShaderMaterial) {
          mat.uniforms.color.value.copy(color);
          mat.uniforms.frequency.value = THREE.MathUtils.lerp(from.granules, to.granules, p) * 0.75;
          mat.uniforms.activity.value = THREE.MathUtils.lerp(0.7 + from.turbulence * 4, 0.7 + to.turbulence * 4, p);
        }
        if ((o.name === 'prominence' || o.name === 'stellarShell') && mat instanceof THREE.MeshBasicMaterial) {
          mat.color.copy(color);
          mat.opacity *= 0.985;
        }
      });
    }
    const showHabitableZone = visibleZoneStars.has(b.id),
      habitableZone = b.mesh.getObjectByName('habitableZone'),
      habitableZoneLabel = b.mesh.getObjectByName('habitableZoneLabel');
    if (habitableZone) habitableZone.visible = showHabitableZone;
    if (habitableZoneLabel) habitableZoneLabel.visible = showHabitableZone;
    for (const o of animatedParts(b)) {
      const material = (o as THREE.Mesh).material;
      if (material instanceof THREE.ShaderMaterial && material.uniforms.tidal)
        material.uniforms.tidal.value = b.tidalStretch;
      if (
        material instanceof THREE.ShaderMaterial &&
        material.uniforms.time &&
        o.name !== 'jetSheath' &&
        o.name !== 'jetSpine'
      )
        material.uniforms.time.value += dt;
      const name = o.name;
      if (name === 'nebulaVolume' && material instanceof THREE.ShaderMaterial) {
        material.uniforms.density.value =
          (o.userData.baseDensity ?? 0.6) *
          (0.48 + 0.52 * Math.sqrt(THREE.MathUtils.clamp(b.mass / b.birthMass, 0.05, 1)));
        material.uniforms.compression.value = b.nebulaCompression;
        material.uniforms.tidal.value = b.nebulaTidal;
        o.rotation.y += dt * (0.018 + (o.id % 5) * 0.004);
        o.rotation.z += dt * 0.006;
      }
      if (o.userData.nebulaHD)
        updateNebulaPart(o, b.nebulaCompression, THREE.MathUtils.clamp(b.mass / b.birthMass, 0.05, 1));
      if (name === 'nebulaRaymarch' && material instanceof THREE.ShaderMaterial) {
        material.uniforms.density.value = 0.64 + 0.24 * Math.sqrt(THREE.MathUtils.clamp(b.mass / b.birthMass, 0.05, 1));
        material.uniforms.compression.value = b.nebulaCompression;
        material.uniforms.tidal.value = b.nebulaTidal;
        // cameraLocal is set in the volume's onBeforeRender (nebula-hd.ts) with the final matrices.
      }
      if (name.startsWith('accretionDisk') || name === 'protoDisk')
        o.rotation.z += dt * (name.startsWith('accretionDisk') ? (o.userData.spin ?? 1.8) : 1.2);
      if (name === 'protoDisk' && b.kind === 'protostar') {
        const formation = THREE.MathUtils.smoothstep(b.age, 0.7, 9);
        if (material instanceof THREE.ShaderMaterial && material.uniforms.formation)
          material.uniforms.formation.value = formation * formation;
        else if (material instanceof THREE.MeshBasicMaterial)
          material.opacity = (o.userData.baseOpacity ?? 0.62) * formation * formation;
        o.scale.setScalar(0.06 + formation * 0.94);
      }
      if (name === 'protoGlow' && b.kind === 'protostar' && material instanceof THREE.SpriteMaterial) {
        const formation = THREE.MathUtils.smoothstep(b.age, 0.25, 7);
        material.opacity = (o.userData.baseOpacity ?? 0.5) * (0.15 + 0.85 * formation);
        o.scale.setScalar(0.18 + 0.82 * formation);
      }
      if (name === 'protoJets' && b.kind === 'protostar') {
        const formation = THREE.MathUtils.smoothstep(b.age, 3.5, 11);
        o.scale.setScalar(0.05 + formation * 0.95);
        o.children.forEach(c => {
          const m = (c as THREE.Mesh).material;
          if (m instanceof THREE.MeshBasicMaterial) m.opacity = formation * 0.16;
        });
      }
      if (name === 'lensingArc') o.rotation.z += dt * 0.09;
      if (name === 'blackHoleJets') animateRelativisticJets(o, b, dt);
      if (name === 'pulsarBeams') animateRelativisticJets(o, b, dt, true);
      if (name === 'prominence') o.rotation.z += dt * (o.userData.spin ?? 0.16);
      if (name === 'stellarCorona') o.rotation.y += dt * 0.035;
      if (name === 'stellarShell') o.scale.setScalar(1 + Math.sin(app.elapsed * 0.9 + b.id + o.id) * 0.018);
      if (name === 'nebulaDust') o.rotation.y += dt * 0.06;
      if (o instanceof THREE.Sprite && b.kind === 'nebula') {
        o.position.y += Math.sin(app.elapsed * 0.18 + o.id) * 0.0008;
        const m = o.material as THREE.SpriteMaterial,
          baseOpacity = o.userData.baseOpacity;
        if (typeof baseOpacity === 'number')
          m.opacity = baseOpacity * (0.58 + 0.42 * Math.sqrt(THREE.MathUtils.clamp(b.mass / b.birthMass, 0.06, 1)));
        if (name === 'nebulaCloud' || name === 'nebulaHaze') m.rotation += dt * (o.userData.drift ?? 0.012);
      }
    }
    const inflow = b.mesh.getObjectByName('inflow') as THREE.Points | undefined;
    if (inflow) {
      const attr = inflow.geometry.getAttribute('position') as THREE.BufferAttribute;
      for (let i = 0; i < attr.count; i++) {
        let x = attr.getX(i),
          z = attr.getZ(i),
          r = Math.hypot(x, z),
          a = Math.atan2(z, x) + dt * (1.6 + 4 / r);
        r -= dt * 0.5;
        if (r < TYPES.blackhole.radius * 1.5) r = TYPES.blackhole.radius * (3.8 + Math.random() * 0.7);
        attr.setXYZ(i, Math.cos(a) * r, attr.getY(i) * 0.98, Math.sin(a) * r);
      }
      attr.needsUpdate = true;
    }
    const trail = trails.get(b.id);
    if (trail) {
      trail.line.visible = app.trailsEnabled;
      trail.accumulator += dt;
      if (trail.accumulator > 0.11 && (!b.locked || b.kind === 'pulsar')) {
        trail.accumulator = 0;
        const p = b.mesh.position.clone();
        if (!trail.points.length || p.distanceToSquared(trail.points[trail.points.length - 1]) > 0.04) {
          trail.points.push(p);
          const capacity = isCompact ? 42 : 72;
          if (trail.points.length > capacity) trail.points.shift();
          const attribute = trail.line.geometry.getAttribute('position') as THREE.BufferAttribute,
            ageAttribute = trail.line.geometry.getAttribute('trailAge') as THREE.BufferAttribute,
            denominator = Math.max(1, trail.points.length - 1);
          for (let i = 0; i < trail.points.length; i++) {
            attribute.setXYZ(i, trail.points[i].x, trail.points[i].y, trail.points[i].z);
            ageAttribute.setX(i, i / denominator);
          }
          trail.line.geometry.setDrawRange(0, trail.points.length);
          attribute.needsUpdate = true;
          ageAttribute.needsUpdate = true;
        }
      }
    }
  }
}
