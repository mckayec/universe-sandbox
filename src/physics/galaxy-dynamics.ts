// Galaxy dark-matter halo gravity, galaxy–galaxy dynamical friction, and the bulk orbital motion of systems
// placed inside a galaxy.
//
// Every galaxy carries a dark-matter halo centred on its core. A halo pulls on the core, member stars and
// tracer stars of every galaxy (not only its own), which is what lets one galaxy tidally tear another. When
// halos overlap, a prescribed drag (standing in for dynamical friction) drains the cores' relative motion, so an
// encounter ends in a merger after a pass or two instead of an endless fly-by.
// Analytic halos and prescribed drag approximate encounter forces. They are not a self-consistent
// momentum-conserving simulation of stars and dark matter: halos feel no recoil from the bodies they pull,
// massive members are not counted in a galaxy's mass, and locked cores are external constraints.
import * as THREE from 'three';
import { G } from '../celestial-catalog.ts';
import { app, bodies, bodyGroupIds, cosmicGroups } from '../state/app-state.ts';
import type { Body, CosmicGroup, GalaxyStyle } from '../state/types.ts';

const scratch = new THREE.Vector3();

/** Default halo scale radius (older saves and galaxies without one). */
export const DEFAULT_HALO_SCALE = 52;
/** Squared softening length of a galaxy core: its bulge is extended, not a point. */
export const GALAXY_CORE_SOFTENING = 18 * 18;
/** Dynamical-friction strength (1/s) and reach, as a fraction of the two galaxies' summed radii. */
export const GALAXY_FRICTION = 0.1,
  GALAXY_FRICTION_RANGE = 0.3;

/** Visual and dynamical radius of a galaxy of the given style. */
export function galaxyExtent(style: GalaxyStyle | undefined) {
  return style === 'globular' ? 90 : style === 'irregular' ? 150 : 180;
}
/** Halo mass enclosed within `radius` of a galaxy anchor (the exhibit's simplified dark-matter profile). */
export function enclosedHaloMass(haloMass: number, radius: number, scale = DEFAULT_HALO_SCALE) {
  return haloMass * Math.pow(radius / (radius + scale), 1.45);
}
export function galaxyGroupFor(body: Body) {
  const id = bodyGroupIds.get(body.id),
    group = id === undefined ? undefined : cosmicGroups.find(candidate => candidate.id === id);
  return group?.kind === 'galaxy' ? group : undefined;
}
export function isGalaxyGroupId(id: number | undefined) {
  return id !== undefined && cosmicGroups.some(group => group.id === id && group.kind === 'galaxy');
}
/** Total gravitating mass of a galaxy: its core plus its whole halo. */
export function galaxyMass(group: CosmicGroup, anchor: Body) {
  return anchor.mass + (group.haloMass ?? 0);
}

/** Latest dynamical-friction acceleration per galaxy group (also applied to its tracer stars). */
export const galaxyFriction = new Map<number, { ax: number; az: number }>();

type GalaxyFrame = { group: CosmicGroup; anchor: Body; extent: number; mass: number };
function galaxyFrames(byId: Map<number, Body>) {
  const frames: GalaxyFrame[] = [];
  for (const group of cosmicGroups) {
    if (group.kind !== 'galaxy' || group.anchorId === undefined) continue;
    const anchor = byId.get(group.anchorId);
    if (anchor)
      frames.push({
        group,
        anchor,
        extent: group.extent ?? galaxyExtent(group.style),
        mass: galaxyMass(group, anchor),
      });
  }
  return frames;
}
/** Weight of the friction felt by a body at distance `r` from its own core: the bound core feels it, tails don't. */
function frictionWeight(r: number, extent: number) {
  const q = r / (extent * 0.5);
  return 1 / (1 + q * q * q * q);
}
export function applyGalaxyHaloGravity(dt: number, byId: Map<number, Body>) {
  const frames = galaxyFrames(byId);
  if (!frames.length) return;
  // Halo pulls: every halo on every body that belongs to any galaxy, except a core on itself.
  for (const body of bodies) {
    if (body.locked || body === app.dragBody || body.hostId !== undefined || body.infall) continue;
    const own = galaxyGroupFor(body);
    if (!own) continue;
    for (const frame of frames) {
      if (frame.anchor === body || !frame.group.haloMass) continue;
      scratch.copy(frame.anchor.mesh.position).sub(body.mesh.position).setY(0);
      const radius = Math.max(3, scratch.length()),
        response = body.kind === 'nebula' && body.exhibitSystemId === undefined ? 0.22 : 1;
      body.velocity.addScaledVector(
        scratch.normalize(),
        ((G * app.gravity * enclosedHaloMass(frame.group.haloMass, radius, frame.group.haloScale)) /
          (radius * radius)) *
          dt *
          response,
      );
    }
  }
  applyDynamicalFriction(dt, frames);
}
function applyDynamicalFriction(dt: number, frames: GalaxyFrame[]) {
  galaxyFriction.clear();
  for (let i = 0; i < frames.length; i++)
    for (let j = i + 1; j < frames.length; j++) {
      const a = frames[i],
        b = frames[j],
        distance = a.anchor.mesh.position.distanceTo(b.anchor.mesh.position),
        overlap = Math.exp(-Math.pow(distance / (GALAXY_FRICTION_RANGE * (a.extent + b.extent)), 2));
      if (overlap < 0.002) continue;
      const rvx = a.anchor.velocity.x - b.anchor.velocity.x,
        rvz = a.anchor.velocity.z - b.anchor.velocity.z,
        total = a.mass + b.mass,
        k = GALAXY_FRICTION * overlap;
      // Equal and opposite in momentum: each galaxy loses relative motion in proportion to the other's mass.
      addFriction(a.group.id, -k * (b.mass / total) * rvx, -k * (b.mass / total) * rvz);
      addFriction(b.group.id, k * (a.mass / total) * rvx, k * (a.mass / total) * rvz);
    }
  for (const frame of frames) {
    const friction = galaxyFriction.get(frame.group.id);
    if (!friction) continue;
    for (const id of frame.group.bodyIds) {
      const body = bodies.find(candidate => candidate.id === id);
      if (!body || body.locked || body === app.dragBody || body.hostId !== undefined || body.infall) continue;
      const w =
        body === frame.anchor
          ? 1
          : frictionWeight(body.mesh.position.distanceTo(frame.anchor.mesh.position), frame.extent);
      body.velocity.x += friction.ax * w * dt;
      body.velocity.z += friction.az * w * dt;
    }
  }
}
function addFriction(groupId: number, ax: number, az: number) {
  const current = galaxyFriction.get(groupId);
  if (current) {
    current.ax += ax;
    current.az += az;
  } else galaxyFriction.set(groupId, { ax, az });
}
/**
 * Galaxies rotate so their spiral arms trail: seen in the XZ plane, the angle atan2(z, x) decreases.
 * Returns the unit orbit direction at offset (dx, dz) from the core.
 */
export function galaxySpinTangent(dx: number, dz: number, out = new THREE.Vector3()) {
  const r = Math.hypot(dx, dz) || 1;
  return out.set(dz / r, 0, -dx / r);
}
/** Circular velocity of a galaxy member at its current position (softened core + halo). */
export function galaxyOrbitVelocity(group: CosmicGroup, anchor: Body, position: THREE.Vector3) {
  const radial = position.clone().sub(anchor.mesh.position).setY(0),
    radius = Math.max(3, radial.length()),
    // Same softened pull as the gravity engine: G·M / (r² + softening) toward the core.
    core = (anchor.mass * radius) / (radius * radius + GALAXY_CORE_SOFTENING),
    pull = core + enclosedHaloMass(group.haloMass ?? 0, radius, group.haloScale) / radius,
    speed = Math.sqrt(G * app.gravity * Math.max(0, pull)),
    tangent = galaxySpinTangent(radial.x, radial.z);
  return anchor.velocity.clone().addScaledVector(tangent, speed);
}
/**
 * Bulk velocity for a system placed at `position`: a circular orbit around the galaxy anchor that pulls on it most
 * strongly, or zero when no galaxy is nearby. Without it a placed Solar System free-falls into the galaxy's core.
 */
export function bulkOrbitVelocity(position: THREE.Vector3) {
  let best: { anchor: Body; group: CosmicGroup } | undefined,
    bestPull = 0;
  for (const group of cosmicGroups) {
    if (group.kind !== 'galaxy' || group.anchorId === undefined) continue;
    const anchor = bodies.find(body => body.id === group.anchorId);
    if (!anchor) continue;
    const distance = anchor.mesh.position.distanceTo(position);
    if (distance < 1 || distance > 1100) continue;
    const pull = anchor.mass / (distance * distance);
    if (pull > bestPull) {
      bestPull = pull;
      best = { anchor, group };
    }
  }
  if (!best) return new THREE.Vector3();
  const { anchor, group } = best,
    radial = position.clone().sub(anchor.mesh.position).setY(0),
    radius = radial.length(),
    tangent = galaxySpinTangent(radial.x, radial.z);
  // A visiting system is not a galaxy member, so it feels the anchor and every member star, but not the halo.
  let enclosed = (anchor.mass * radius * radius) / (radius * radius + GALAXY_CORE_SOFTENING);
  for (const id of group.bodyIds) {
    const member = bodies.find(body => body.id === id);
    if (!member || member === anchor || member.kind === 'nebula') continue;
    if (member.mesh.position.distanceTo(anchor.mesh.position) < radius) enclosed += member.mass;
  }
  return anchor.velocity.clone().addScaledVector(tangent, Math.sqrt((G * app.gravity * enclosed) / radius));
}
