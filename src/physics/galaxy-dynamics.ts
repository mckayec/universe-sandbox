// Galaxy dark-matter halo gravity and the bulk orbital motion of systems placed inside a galaxy.
import * as THREE from 'three';
import { G } from '../celestial-catalog.ts';
import { app, bodies, cosmicGroups } from '../state/app-state.ts';
import type { Body, CosmicGroup } from '../state/types.ts';

const scratch = new THREE.Vector3();

/** Halo mass enclosed within `radius` of a galaxy anchor (the exhibit's simplified dark-matter profile). */
export function enclosedHaloMass(haloMass: number, radius: number) {
  return haloMass * Math.pow(radius / (radius + 52), 1.45);
}
export function galaxyGroupFor(body: Body) {
  return cosmicGroups.find(group => group.kind === 'galaxy' && group.bodyIds.includes(body.id));
}
export function applyGalaxyHaloGravity(dt: number, byId: Map<number, Body>) {
  for (const group of cosmicGroups) {
    if (group.kind !== 'galaxy' || !group.haloMass || group.anchorId === undefined) continue;
    const anchor = byId.get(group.anchorId);
    if (!anchor) continue;
    for (const id of group.bodyIds) {
      if (id === anchor.id) continue;
      const body = byId.get(id);
      if (!body || body.locked || body === app.dragBody || body.hostId !== undefined) continue;
      scratch.copy(anchor.mesh.position).sub(body.mesh.position).setY(0);
      const radius = Math.max(3, scratch.length()),
        response = body.kind === 'nebula' && body.exhibitSystemId === undefined ? 0.22 : 1;
      body.velocity.addScaledVector(
        scratch.normalize(),
        ((G * app.gravity * enclosedHaloMass(group.haloMass, radius)) / (radius * radius)) * dt * response,
      );
    }
  }
}
/** Circular velocity of a galaxy member at its current position (anchor point mass + halo). */
export function galaxyOrbitVelocity(group: CosmicGroup, anchor: Body, position: THREE.Vector3) {
  const radial = position.clone().sub(anchor.mesh.position).setY(0),
    radius = Math.max(3, radial.length()),
    pull = anchor.mass + enclosedHaloMass(group.haloMass ?? 0, radius),
    speed = Math.sqrt((G * app.gravity * Math.max(0, pull)) / radius),
    tangent = new THREE.Vector3(-radial.z, 0, radial.x).normalize();
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
    tangent = new THREE.Vector3(-radial.z, 0, radial.x).normalize();
  // A visiting system is not a galaxy member, so it feels the anchor and every member star, but not the halo.
  let enclosed = anchor.mass;
  for (const id of group.bodyIds) {
    const member = bodies.find(body => body.id === id);
    if (!member || member === anchor || member.kind === 'nebula') continue;
    if (member.mesh.position.distanceTo(anchor.mesh.position) < radius) enclosed += member.mass;
  }
  return anchor.velocity.clone().addScaledVector(tangent, Math.sqrt((G * app.gravity * enclosed) / radius));
}
