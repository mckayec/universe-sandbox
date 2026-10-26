// One fixed physics step: gravity, halo gravity, evolution, interactions and collisions.
import { barnesHutAccelerations, pairwiseAccelerations, type GravityParticle } from '../gravity-engine.ts';
import { capPlanarVelocity } from '../physics-continuity.ts';
import { G } from '../celestial-catalog.ts';
import { removeBody } from '../bodies/lifecycle.ts';
import { isExhibitAnchor, spinRate } from './body-math.ts';
import { collisions } from './collisions.ts';
import { applyGalaxyHaloGravity, galaxyGroupFor } from './galaxy-dynamics.ts';
import { updateLife } from './life.ts';
import { updateNebulaInteractions, updateNebulaMergers } from './nebula.ts';
import { advanceStar, spawnProtostar, updateProto } from './stellar-evolution.ts';
import { updateSatellite, updateTidalInteractions } from './tidal.ts';
import { updateTidalDisruption } from './tidal-disruption.ts';
import { updateWarpSequence } from './warp-sequence.ts';
import { isCompact } from '../scene/setup.ts';
import { app, bodies } from '../state/app-state.ts';
import type { Body } from '../state/types.ts';

export const SIM_STEP = 1 / 60,
  MAX_SIM_STEPS = isCompact ? 18 : 22,
  /** Above this many bodies gravity switches from exact pairs to Barnes–Hut; both follow the same rules. */
  BARNES_HUT_THRESHOLD = 64,
  /** Speed limit for a free nebula; nebulae orbiting inside a galaxy are limited relative to its anchor instead. */
  NEBULA_SPEED_LIMIT = 1.35,
  GALAXY_NEBULA_SPEED_LIMIT = 20;

/** Nebulae are extended, weakly coupled media, except as galaxy members, where they orbit with the disk. */
function galaxyNebulae() {
  const ids = new Set<number>();
  for (const body of bodies)
    if (body.kind === 'nebula' && body.exhibitSystemId !== undefined && galaxyGroupFor(body)) ids.add(body.id);
  return ids;
}
function gravityParticles(byId: Map<number, Body>): GravityParticle[] {
  const diskClouds = galaxyNebulae();
  const anchors = new Map<number, Body>();
  for (const body of bodies) if (isExhibitAnchor(body)) anchors.set(body.exhibitSystemId!, body);
  return bodies.map(body => {
    const nebula = body.kind === 'nebula',
      frame = body.exhibitSystemId === undefined ? undefined : anchors.get(body.exhibitSystemId);
    return {
      id: body.id,
      x: body.mesh.position.x,
      z: body.mesh.position.z,
      mass: body.mass,
      radius: body.radius,
      softening: nebula ? body.radius * body.radius * 1.8 : 0,
      sourceFactor: nebula ? 0.22 : 1,
      responseFactor: nebula && !diskClouds.has(body.id) ? 0.14 : 1,
      locked: body.locked || body === app.dragBody,
      hosted: body.hostId !== undefined || body.satelliteHostId !== undefined,
      systemId: body.exhibitSystemId,
      anchor: isExhibitAnchor(body),
      frameX: frame && frame !== body && byId.has(frame.id) ? frame.mesh.position.x : undefined,
      frameZ: frame && frame !== body && byId.has(frame.id) ? frame.mesh.position.z : undefined,
    };
  });
}
function applyGravity(dt: number, byId: Map<number, Body>) {
  const particles = gravityParticles(byId),
    accelerations =
      bodies.length > BARNES_HUT_THRESHOLD
        ? barnesHutAccelerations(particles, G * app.gravity)
        : pairwiseAccelerations(particles, G * app.gravity);
  for (const body of bodies) {
    const acceleration = accelerations.get(body.id);
    if (acceleration && !body.locked && body !== app.dragBody) {
      body.velocity.x += acceleration.x * dt;
      body.velocity.z += acceleration.z * dt;
    }
  }
}
function limitNebula(b: Body, byId: Map<number, Body>, dt: number) {
  const group = galaxyGroupFor(b),
    anchor = group?.anchorId === undefined ? undefined : byId.get(group.anchorId);
  if (!anchor || anchor === b) {
    capPlanarVelocity(b.velocity, NEBULA_SPEED_LIMIT);
    if (!b.locked && b !== app.dragBody) b.velocity.multiplyScalar(Math.exp(-dt * 0.055));
    return;
  }
  // Inside a galaxy the cloud orbits with the disk: limit only its speed relative to the anchor, without drag.
  b.velocity.sub(anchor.velocity);
  capPlanarVelocity(b.velocity, GALAXY_NEBULA_SPEED_LIMIT);
  b.velocity.add(anchor.velocity);
}
export function simulate(dt: number) {
  const byId = new Map(bodies.map(body => [body.id, body] as const));
  applyGravity(dt, byId);
  applyGalaxyHaloGravity(dt, byId);
  for (const b of [...bodies]) {
    if (b.removed) continue;
    b.age += dt;
    b.collisionCooldown = Math.max(0, b.collisionCooldown - dt);
    b.habitabilityShock = Math.max(0, b.habitabilityShock - dt * 0.022);
    if (b.kind === 'star') advanceStar(b, dt);
    if (b.kind === 'nebula') limitNebula(b, byId, dt);
    else capPlanarVelocity(b.velocity, b.artificial ? 140 : b.kind === 'comet' ? 42 : 32);
    if (b.kind === 'nebula') {
      if (!b.locked && b !== app.dragBody) b.mesh.position.addScaledVector(b.velocity, dt);
      b.nebulaTimer += dt;
      let hosted = 0;
      for (const x of bodies) if (x.hostId === b.id) hosted++;
      if (b.nebulaTimer >= 12 && hosted < (isCompact ? 2 : 3)) {
        b.nebulaTimer = 0;
        spawnProtostar(b);
      }
    } else if (b.kind === 'protostar') updateProto(b, dt);
    else {
      if (b.satelliteHostId !== undefined) updateSatellite(b, dt);
      if (!b.locked && b !== app.dragBody && b.satelliteHostId === undefined)
        b.mesh.position.addScaledVector(b.velocity, dt);
      if (b.artificial) {
        if (b.velocity.lengthSq() > 0.01) b.mesh.rotation.y = Math.atan2(-b.velocity.z, b.velocity.x);
      } else b.spinAngle = ((b.spinAngle ?? 0) + dt * spinRate(b)) % (Math.PI * 2);
    }
  }
  for (const b of bodies) updateLife(b, dt);
  updateNebulaInteractions(dt);
  updateNebulaMergers(dt);
  updateTidalInteractions(dt);
  updateTidalDisruption(dt);
  updateWarpSequence(dt);
  collisions();
  for (const b of [...bodies]) if (b.mesh.position.length() > 1700) removeBody(b);
}
