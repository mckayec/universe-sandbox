// One fixed physics step: gravity, halo gravity, evolution, interactions and collisions.
import * as THREE from 'three';
import { barnesHutAccelerations, spatialCandidatePairs, type GravityParticle } from '../gravity-engine.ts';
import { capPlanarVelocity } from '../physics-continuity.ts';
import { G } from '../celestial-catalog.ts';
import { removeBody } from '../bodies/lifecycle.ts';
import { spinRate } from './body-math.ts';
import { collisions } from './collisions.ts';
import { updateLife } from './life.ts';
import { updateNebulaInteractions, updateNebulaMergers } from './nebula.ts';
import { advanceStar, spawnProtostar, updateProto } from './stellar-evolution.ts';
import { sameExhibitSystem, updateSatellite, updateTidalInteractions } from './tidal.ts';
import { updateTidalDisruption } from './tidal-disruption.ts';
import { isCompact } from '../scene/setup.ts';
import { app, bodies, cosmicGroups } from '../state/app-state.ts';

export const SIM_STEP = 1 / 60,
  MAX_SIM_STEPS = isCompact ? 18 : 22;
const physicsDelta = new THREE.Vector3();
function gravityParticles(): GravityParticle[] {
  return bodies.map(body => ({
    id: body.id,
    x: body.mesh.position.x,
    z: body.mesh.position.z,
    mass: body.mass,
    radius: body.radius,
    softening: body.kind === 'nebula' ? body.radius * 1.34 : body.radius * 0.42,
    sourceFactor: body.kind === 'nebula' ? 0.22 : 1,
    responseFactor: body.kind === 'nebula' ? 0.14 : 1,
    locked: body.locked || body === app.dragBody,
    hosted: body.hostId !== undefined || body.satelliteHostId !== undefined,
  }));
}
function applyGalaxyHaloGravity(dt: number) {
  for (const group of cosmicGroups) {
    if (group.kind !== 'galaxy' || !group.haloMass || group.anchorId === undefined) continue;
    const anchor = bodies.find(body => body.id === group.anchorId);
    if (!anchor) continue;
    for (const id of group.bodyIds) {
      if (id === anchor.id) continue;
      const body = bodies.find(candidate => candidate.id === id);
      if (!body || body.locked || body === app.dragBody || body.hostId !== undefined) continue;
      const delta = anchor.mesh.position.clone().sub(body.mesh.position),
        radius = Math.max(3, delta.length()),
        enclosed = group.haloMass * Math.pow(radius / (radius + 52), 1.45),
        response = body.kind === 'nebula' ? 0.22 : 1;
      body.velocity.addScaledVector(
        delta.normalize(),
        ((G * app.gravity * enclosed) / (radius * radius)) * dt * response,
      );
    }
  }
}
export function simulate(dt: number) {
  if (bodies.length > 64) {
    const accelerations = barnesHutAccelerations(gravityParticles(), G * app.gravity);
    for (const body of bodies) {
      const acceleration = accelerations.get(body.id);
      if (acceleration && !body.locked && body !== app.dragBody) {
        body.velocity.x += acceleration.x * dt;
        body.velocity.z += acceleration.z * dt;
      }
    }
  } else
    for (let i = 0; i < bodies.length; i++)
      for (let j = i + 1; j < bodies.length; j++) {
        const a = bodies[i],
          b = bodies[j];
        if (a.hostId || b.hostId || a.satelliteHostId !== undefined || b.satelliteHostId !== undefined) continue;
        if (sameExhibitSystem(a, b) && a.kind !== 'star' && b.kind !== 'star') continue;
        physicsDelta.copy(b.mesh.position).sub(a.mesh.position);
        const extendedSoftening =
            (a.kind === 'nebula' ? a.radius * a.radius * 1.8 : 0) +
            (b.kind === 'nebula' ? b.radius * b.radius * 1.8 : 0),
          d2 = Math.max(physicsDelta.lengthSq() + extendedSoftening, (a.radius + b.radius) ** 2 * 0.35);
        if (d2 < 0.0001) continue;
        physicsDelta.normalize();
        const anchored = sameExhibitSystem(a, b),
          aResponse = anchored && a.kind === 'star' ? 0 : a.kind === 'nebula' ? 0.14 : 1,
          bResponse = anchored && b.kind === 'star' ? 0 : b.kind === 'nebula' ? 0.14 : 1,
          aSource = a.kind === 'nebula' ? 0.22 : 1,
          bSource = b.kind === 'nebula' ? 0.22 : 1;
        if (!a.locked && a !== app.dragBody)
          a.velocity.addScaledVector(physicsDelta, ((G * app.gravity * b.mass * bSource * aResponse) / d2) * dt);
        if (!b.locked && b !== app.dragBody)
          b.velocity.addScaledVector(physicsDelta, ((-G * app.gravity * a.mass * aSource * bResponse) / d2) * dt);
      }
  applyGalaxyHaloGravity(dt);
  for (const b of [...bodies]) {
    b.age += dt;
    b.collisionCooldown = Math.max(0, b.collisionCooldown - dt);
    b.habitabilityShock = Math.max(0, b.habitabilityShock - dt * 0.022);
    if (b.kind === 'star') advanceStar(b, dt);
    capPlanarVelocity(b.velocity, b.artificial ? 140 : b.kind === 'nebula' ? 1.35 : b.kind === 'comet' ? 42 : 32);
    if (b.kind === 'nebula') {
      if (!b.locked && b !== app.dragBody) {
        b.velocity.multiplyScalar(Math.exp(-dt * 0.055));
        b.mesh.position.addScaledVector(b.velocity, dt);
      }
      b.nebulaTimer += dt;
      const hosted = bodies.filter(x => x.hostId === b.id).length,
        maxSeeds = isCompact ? 2 : 3;
      if (b.nebulaTimer >= 12 && hosted < maxSeeds) {
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
  const collisionParticles = gravityParticles();
  collisions(bodies.length > 50 ? spatialCandidatePairs(collisionParticles, 12) : undefined);
  for (const b of [...bodies]) if (b.mesh.position.length() > 1700) removeBody(b);
}
