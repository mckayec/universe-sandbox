// Satellite capture and tidal interactions between pairs of bodies.
import * as THREE from 'three';
import { tidalTransferRate } from '../physics-continuity.ts';
import { transferFactor } from '../exhibit-runtime.ts';
import { type Kind } from '../celestial-catalog.ts';
import { updateScale } from '../bodies/lifecycle.ts';
import { addBody } from '../bodies/registry.ts';
import { sameExhibitSystem, seeded } from './body-math.ts';
import { canEat, priority } from './collisions.ts';
import { ensureMatterStream } from './matter-streams.ts';
import { accreteMomentum, applyGrowthProgression, demoteStrippedStar } from './stellar-evolution.ts';
import { isCompact } from '../scene/setup.ts';
import { app, bodies, bodyGroupIds, cosmicGroups } from '../state/app-state.ts';
import type { Body } from '../state/types.ts';
import { museumEvent } from '../ui/feed.ts';
import { particleBurst } from '../visuals/effects.ts';

export { sameExhibitSystem };

const satelliteTangent = new THREE.Vector3();
/** Carries a kinematic moon (satelliteHostId) on a fixed circular orbit around its planet. */
export function updateSatellite(b: Body, dt: number) {
  const host = bodies.find(x => x.id === b.satelliteHostId);
  if (!host || b === app.dragBody || b.locked || host.kind !== 'rocky') {
    b.satelliteHostId = undefined;
    return;
  }
  b.satelliteAngle = (b.satelliteAngle ?? 0) + dt * (b.satelliteRate ?? 1);
  const r = b.satelliteOrbit ?? 2.35,
    c = Math.cos(b.satelliteAngle),
    s = Math.sin(b.satelliteAngle);
  b.mesh.position.set(host.mesh.position.x + c * r, host.mesh.position.y, host.mesh.position.z + s * r);
  b.velocity.copy(host.velocity).add(satelliteTangent.set(-s, 0, c).multiplyScalar(r * (b.satelliteRate ?? 1)));
}
/** Minimum seconds between "Mass transfer begins"/"Tidal stream" announcements for one donor→receiver pair. */
export const TIDAL_ANNOUNCE_INTERVAL = 6;
const RECEIVER_KINDS = new Set<Kind>(['brown', 'star', 'pulsar', 'blackhole']),
  SOLID_KINDS = new Set<Kind>(['asteroid', 'comet', 'moon', 'dwarf', 'rocky']),
  /** Tidal stripping rate and the mass floor a donor can't be stripped below. Nebulae, pulsars and black holes
   * never donate (see tidalPair). */
  BASE_RATE: Partial<Record<Kind, number>> = {
    asteroid: 0.08,
    comet: 0.14,
    moon: 0.11,
    dwarf: 0.1,
    rocky: 0.12,
    gas: 0.45,
    brown: 0.8,
    star: 1,
    protostar: 0.68,
  },
  MINIMUM: Partial<Record<Kind, number>> = {
    asteroid: 0.01,
    comet: 0.02,
    moon: 0.08,
    dwarf: 0.3,
    rocky: 0.6,
    gas: 5,
    brown: 18,
    star: 28,
    protostar: 5,
  },
  /** Largest reach factor (black hole) times the largest mass-ratio boost, for a cheap squared-distance reject. */
  MAX_REACH_FACTOR = 4.15 * 1.55,
  tidalDelta = new THREE.Vector3();
function tidalPair(a: Body, b: Body): [Body, Body] | null {
  if (sameExhibitSystem(a, b)) return null;
  if (
    a.artificial ||
    b.artificial ||
    a.kind === 'nebula' ||
    b.kind === 'nebula' ||
    a.hostId === b.id ||
    b.hostId === a.id
  )
    return null;
  if (a.buildLocked !== b.buildLocked) {
    const receiver = a.buildLocked ? a : b,
      donor = receiver === a ? b : a;
    return canEat(receiver, donor) && donor.kind !== 'blackhole' ? [donor, receiver] : null;
  }
  const pa = priority(a.kind),
    pb = priority(b.kind),
    receiver = pa > pb ? a : pb > pa ? b : a.mass >= b.mass ? a : b,
    donor = receiver === a ? b : a;
  if (receiver.kind === 'blackhole' && donor.kind === 'blackhole') return null;
  if (!RECEIVER_KINDS.has(receiver.kind) || !canEat(receiver, donor)) return null;
  const ratio = receiver.mass / Math.max(1, donor.mass);
  if (receiver.kind !== 'blackhole' && receiver.kind !== 'pulsar' && ratio < 1.12) return null;
  return [donor, receiver];
}
/** Candidate index pairs for tidal interactions: all pairs in small scenes, a coarse spatial grid otherwise. */
function tidalCandidates(): Array<[number, number]> {
  const pairs: Array<[number, number]> = [];
  if (bodies.length <= 50) {
    for (let i = 0; i < bodies.length; i++) for (let j = i + 1; j < bodies.length; j++) pairs.push([i, j]);
    return pairs;
  }
  let maxRadius = 0;
  for (const body of bodies) if (body.kind !== 'nebula') maxRadius = Math.max(maxRadius, body.radius);
  const cell = Math.max(40, maxRadius * 2 * MAX_REACH_FACTOR),
    grid = new Map<string, number[]>();
  bodies.forEach((body, index) => {
    if (body.kind === 'nebula' || body.artificial) return;
    const key = `${Math.floor(body.mesh.position.x / cell)},${Math.floor(body.mesh.position.z / cell)}`,
      bucket = grid.get(key);
    if (bucket) bucket.push(index);
    else grid.set(key, [index]);
  });
  for (const [key, bucket] of grid) {
    const [cx, cz] = key.split(',').map(Number);
    for (let dx = -1; dx <= 1; dx++)
      for (let dz = -1; dz <= 1; dz++) {
        const other = dx === 0 && dz === 0 ? bucket : grid.get(`${cx + dx},${cz + dz}`);
        if (!other || dx < 0 || (dx === 0 && dz < 0)) continue;
        for (let i = 0; i < bucket.length; i++)
          for (let j = other === bucket ? i + 1 : 0; j < other.length; j++)
            pairs.push(bucket[i] < other[j] ? [bucket[i], other[j]] : [other[j], bucket[i]]);
      }
  }
  return pairs;
}
const isGiant = (b: Body) => b.stage === 'giant' || b.stage === 'hypergiant';
function announceTransfer(donor: Body, receiver: Body) {
  const announced = (donor.tidalAnnounced ??= new Map()),
    last = announced.get(receiver.id);
  if (last !== undefined && app.elapsed - last < TIDAL_ANNOUNCE_INTERVAL && app.elapsed >= last) {
    announced.set(receiver.id, app.elapsed);
    return;
  }
  announced.set(receiver.id, app.elapsed);
  if (donor.debris || donor.kind === 'asteroid' || donor.kind === 'comet') return;
  const title = receiver.kind === 'blackhole' ? 'Tidal stream' : 'Mass transfer begins',
    material = SOLID_KINDS.has(donor.kind)
      ? 'rocky and icy debris'
      : donor.kind === 'gas'
        ? 'atmosphere'
        : donor.kind === 'star' || donor.kind === 'brown'
          ? 'plasma'
          : 'hot gas',
    detail =
      receiver.kind === 'blackhole'
        ? `${receiver.name} is stretching ${donor.name} into a hot debris stream.`
        : donor.kind === 'star' || donor.kind === 'brown'
          ? `${donor.name} has filled its simplified Roche lobe; ${material} is flowing toward ${receiver.name}.`
          : `Tidal forces are stripping ${material} from ${donor.name} toward ${receiver.name}.`;
  museumEvent(title, detail, receiver.kind === 'blackhole' ? '#ffae69' : '#ffd59a', receiver);
}
export function updateTidalInteractions(dt: number) {
  const activeDonors = new Map<number, { receiver: Body; proximity: number }>();
  for (const body of bodies) body.tidalStretch = Math.max(0, body.tidalStretch - dt * 0.32);
  for (const [i, j] of tidalCandidates()) {
    const a = bodies[i],
      b = bodies[j];
    if (!a || !b || a.removed || b.removed) continue;
    const roughReach = (a.radius + b.radius) * MAX_REACH_FACTOR;
    tidalDelta.copy(b.mesh.position).sub(a.mesh.position);
    if (tidalDelta.lengthSq() >= roughReach * roughReach) continue;
    const pair = tidalPair(a, b);
    if (!pair) continue;
    const [donor, receiver] = pair,
      delta = tidalDelta.copy(receiver.mesh.position).sub(donor.mesh.position),
      distance = delta.length(),
      contact = (donor.radius + receiver.radius) * 0.76,
      ratio = receiver.mass / Math.max(1, donor.mass),
      reachFactor =
        receiver.kind === 'blackhole'
          ? 4.15
          : receiver.kind === 'pulsar'
            ? 3.1
            : receiver.kind === 'star'
              ? donor.kind === 'star' || donor.kind === 'brown'
                ? 2.5
                : donor.kind === 'gas'
                  ? 1.75
                  : 1.4
              : 1.95,
      reach =
        (donor.radius + receiver.radius) * reachFactor * THREE.MathUtils.clamp(Math.cbrt(Math.max(1, ratio)), 1, 1.55);
    if (distance >= reach || distance <= contact * 0.72) continue;
    const proximity = THREE.MathUtils.clamp((reach - distance) / Math.max(0.2, reach - contact), 0, 1);
    if (proximity < 0.025) continue;
    // A donor caught between two receivers keeps the strongest one as its partner instead of flip-flopping.
    const strongest = activeDonors.get(donor.id);
    if (!strongest || proximity > strongest.proximity) activeDonors.set(donor.id, { receiver, proximity });
    announceTransfer(donor, receiver);
    const rocheFill = THREE.MathUtils.smoothstep(proximity, 0.18, 0.92),
      deformability =
        donor.kind === 'star' || donor.kind === 'brown' || donor.kind === 'protostar'
          ? 1
          : donor.kind === 'gas'
            ? 0.74
            : donor.kind === 'rocky' || donor.kind === 'dwarf' || donor.kind === 'moon'
              ? 0.2
              : 0.3,
      tidalSeverity = receiver.kind === 'blackhole' ? 1 : receiver.kind === 'pulsar' ? 0.86 : 0.68;
    donor.tidalStretch = Math.max(donor.tidalStretch, rocheFill * deformability * tidalSeverity);
    receiver.tidalStretch = Math.max(receiver.tidalStretch, rocheFill * 0.025);
    donor.tidalAngle = Math.atan2(delta.z, delta.x);
    receiver.tidalAngle = donor.tidalAngle;
    if (
      donor.kind === 'star' &&
      receiver.kind === 'star' &&
      proximity > 0.28 &&
      (isGiant(donor) || isGiant(receiver)) &&
      donor.mesh.userData.commonEnvelopePartner !== receiver.id
    ) {
      donor.mesh.userData.commonEnvelopePartner = receiver.id;
      receiver.mesh.userData.commonEnvelopePartner = donor.id;
      donor.tidalStretch = Math.max(donor.tidalStretch, 0.58);
      receiver.tidalStretch = Math.max(receiver.tidalStretch, 0.2);
      particleBurst(
        donor.mesh.position.clone().lerp(receiver.mesh.position, 0.5),
        0xff8f63,
        isCompact ? 50 : 110,
        2.2,
        3.8,
      );
      museumEvent(
        'Common envelope',
        `${donor.name} and ${receiver.name} are orbiting inside shared stellar gas; drag may pull them into a merger.`,
        '#ff9f76',
        receiver,
      );
    }
    if (
      proximity > 0.62 &&
      SOLID_KINDS.has(donor.kind) &&
      bodies.length < (isCompact ? 90 : 160) &&
      app.elapsed - (donor.mesh.userData.lastTidalFragment ?? -10) > 1.8
    ) {
      donor.mesh.userData.lastTidalFragment = app.elapsed;
      const fragmentMass = Math.min(0.06, Math.max(0.012, donor.mass * 0.0015));
      if (donor.mass > fragmentMass + 0.08) {
        donor.mass -= fragmentMass;
        const away = donor.mesh.position.clone().sub(receiver.mesh.position).setY(0).normalize(),
          side = new THREE.Vector3(-away.z, 0, away.x),
          fragment = addBody(
            'asteroid',
            donor.mesh.position
              .clone()
              .addScaledVector(away, donor.radius * 1.12)
              .addScaledVector(side, (seeded(donor.id, Math.floor(app.elapsed)) - 0.5) * donor.radius),
            donor.velocity.clone().addScaledVector(side, (seeded(donor.id, Math.floor(app.elapsed) + 4) - 0.5) * 1.4),
            { mass: fragmentMass, collisionCooldown: 1.1, lastEvent: `Torn from ${donor.name} by ${receiver.name}` },
          );
        const groupId = bodyGroupIds.get(donor.id);
        if (groupId !== undefined) {
          bodyGroupIds.set(fragment.id, groupId);
          cosmicGroups.find(group => group.id === groupId)?.bodyIds.push(fragment.id);
        }
        particleBurst(fragment.mesh.position.clone(), 0xff9d55, isCompact ? 12 : 24, 0.8, 1.5);
      }
    }
    const receiverMultiplier =
        (receiver.kind === 'blackhole' ? 1.15 : receiver.kind === 'pulsar' ? 1.25 : 1) *
        (receiver.buildLocked ? 1.2 : 1) *
        transferFactor(app.realismMode),
      rate = tidalTransferRate(BASE_RATE[donor.kind] ?? 0, proximity, ratio, receiverMultiplier),
      transfer = Math.min(Math.max(0, donor.mass - (MINIMUM[donor.kind] ?? donor.mass)), rate * dt);
    if (transfer <= 0) continue;
    const receiverMass = receiver.mass;
    donor.mass -= transfer;
    receiver.mass += transfer;
    accreteMomentum(receiver, donor.velocity, transfer, receiverMass);
    const material = SOLID_KINDS.has(donor.kind) ? 'debris' : donor.kind === 'gas' ? 'atmosphere' : 'plasma';
    donor.lastEvent = `Losing ${material} to ${receiver.name} through tidal stripping`;
    receiver.lastEvent = `Accreting ${material} from ${donor.name} through a luminous disk`;
    ensureMatterStream(
      donor,
      receiver,
      receiver.kind === 'blackhole' || SOLID_KINDS.has(donor.kind) ? 'debris' : 'plasma',
      Math.max(0.28, Math.pow(proximity, 0.68)),
    );
    donor.accretionFx -= dt;
    receiver.accretionFx -= dt;
    if (donor.accretionFx <= 0 || receiver.accretionFx <= 0) {
      donor.accretionFx = receiver.accretionFx = 0.18;
      if (!demoteStrippedStar(donor)) updateScale(donor);
      applyGrowthProgression(receiver);
    }
  }
  for (const body of bodies) {
    const active = activeDonors.get(body.id);
    if (active) body.tidalPartnerId = active.receiver.id;
    else if (body.tidalPartnerId !== undefined && !body.tidalStrain) {
      body.tidalPartnerId = undefined;
      if (body.lastEvent.includes('plasma') || body.lastEvent.includes('debris'))
        body.lastEvent = 'Tidal transfer ended as the bodies separated';
    }
    if (body.tidalAnnounced)
      for (const [receiverId, time] of body.tidalAnnounced)
        if (app.elapsed - time > TIDAL_ANNOUNCE_INTERVAL || app.elapsed < time) body.tidalAnnounced.delete(receiverId);
  }
}
