// Satellite capture and tidal interactions between pairs of bodies.
import * as THREE from 'three';
import { tidalTransferRate } from '../physics-continuity.ts';
import { transferFactor } from '../exhibit-runtime.ts';
import { type Kind } from '../celestial-catalog.ts';
import { updateScale } from '../bodies/lifecycle.ts';
import { addBody } from '../bodies/registry.ts';
import { seeded } from './body-math.ts';
import { canEat, priority } from './collisions.ts';
import { ensureMatterStream } from './matter-streams.ts';
import { accreteMomentum, applyGrowthProgression } from './stellar-evolution.ts';
import { debrisIds } from './tidal-disruption.ts';
import { isCompact } from '../scene/setup.ts';
import { app, bodies, bodyGroupIds, cosmicGroups } from '../state/app-state.ts';
import type { Body } from '../state/types.ts';
import { museumEvent } from '../ui/feed.ts';
import { particleBurst } from '../visuals/effects.ts';

/** Members of a preset exhibit system (e.g. Our Solar System) do not tidally shred or strip one another;
 * the exhibit's compressed scale would otherwise destroy them within seconds. Outsiders still interact fully. */
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
  b.velocity.copy(host.velocity).add(new THREE.Vector3(-s, 0, c).multiplyScalar(r * (b.satelliteRate ?? 1)));
}
export function sameExhibitSystem(a: Body, b: Body) {
  return a.exhibitSystemId !== undefined && a.exhibitSystemId === b.exhibitSystemId;
}
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
  let receiver =
      priority(a.kind) > priority(b.kind) ? a : priority(b.kind) > priority(a.kind) ? b : a.mass >= b.mass ? a : b,
    donor = receiver === a ? b : a;
  if (receiver.kind === 'blackhole' && donor.kind === 'blackhole') return null;
  if (!['brown', 'star', 'pulsar', 'blackhole'].includes(receiver.kind) || !canEat(receiver, donor)) return null;
  const ratio = receiver.mass / Math.max(1, donor.mass);
  if (receiver.kind !== 'blackhole' && receiver.kind !== 'pulsar' && ratio < 1.12) return null;
  return [donor, receiver];
}
export function updateTidalInteractions(dt: number) {
  const activeDonors = new Set<number>();
  for (const body of bodies) body.tidalStretch = Math.max(0, body.tidalStretch - dt * 0.32);
  for (let i = 0; i < bodies.length; i++)
    for (let j = i + 1; j < bodies.length; j++) {
      const pair = tidalPair(bodies[i], bodies[j]);
      if (!pair) continue;
      const [donor, receiver] = pair,
        delta = receiver.mesh.position.clone().sub(donor.mesh.position),
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
          (donor.radius + receiver.radius) *
          reachFactor *
          THREE.MathUtils.clamp(Math.cbrt(Math.max(1, ratio)), 1, 1.55);
      if (distance >= reach || distance <= contact * 0.72) continue;
      const proximity = THREE.MathUtils.clamp((reach - distance) / Math.max(0.2, reach - contact), 0, 1);
      if (proximity < 0.025) continue;
      activeDonors.add(donor.id);
      const rocheFill = THREE.MathUtils.smoothstep(proximity, 0.18, 0.92),
        deformability = ['star', 'brown', 'protostar'].includes(donor.kind)
          ? 1
          : donor.kind === 'gas'
            ? 0.74
            : ['rocky', 'dwarf', 'moon'].includes(donor.kind)
              ? 0.2
              : 0.3,
        tidalSeverity = receiver.kind === 'blackhole' ? 1 : receiver.kind === 'pulsar' ? 0.86 : 0.68;
      donor.tidalStretch = Math.max(donor.tidalStretch, rocheFill * deformability * tidalSeverity);
      receiver.tidalStretch = Math.max(receiver.tidalStretch, rocheFill * 0.025);
      donor.tidalAngle = Math.atan2(delta.z, delta.x);
      receiver.tidalAngle = donor.tidalAngle;
      if (donor.tidalPartnerId !== receiver.id) {
        donor.tidalPartnerId = receiver.id;
        const title = receiver.kind === 'blackhole' ? 'Tidal stream' : 'Mass transfer begins',
          material = ['asteroid', 'comet', 'moon', 'dwarf', 'rocky'].includes(donor.kind)
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
        if (!debrisIds.has(donor.id) && donor.kind !== 'asteroid' && donor.kind !== 'comet')
          museumEvent(title, detail, receiver.kind === 'blackhole' ? '#ffae69' : '#ffd59a', receiver);
      }
      if (
        donor.kind === 'star' &&
        receiver.kind === 'star' &&
        proximity > 0.28 &&
        (['giant', 'hypergiant'].includes(donor.stage!) || ['giant', 'hypergiant'].includes(receiver.stage!)) &&
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
        ['asteroid', 'comet', 'moon', 'dwarf', 'rocky'].includes(donor.kind) &&
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
      const baseRate: Record<Kind, number> = {
          asteroid: 0.08,
          comet: 0.14,
          moon: 0.11,
          dwarf: 0.1,
          rocky: 0.12,
          gas: 0.45,
          brown: 0.8,
          star: 1,
          protostar: 0.68,
          pulsar: 0,
          blackhole: 0,
          nebula: 0,
        },
        minimum: Record<Kind, number> = {
          asteroid: 0.01,
          comet: 0.02,
          moon: 0.08,
          dwarf: 0.3,
          rocky: 0.6,
          gas: 5,
          brown: 18,
          star: 28,
          protostar: 5,
          pulsar: 180,
          blackhole: 400,
          nebula: 4,
        },
        receiverMultiplier =
          (receiver.kind === 'blackhole' ? 1.15 : receiver.kind === 'pulsar' ? 1.25 : 1) *
          (receiver.buildLocked ? 1.2 : 1) *
          transferFactor(app.realismMode),
        rate = tidalTransferRate(baseRate[donor.kind], proximity, ratio, receiverMultiplier),
        transfer = Math.min(Math.max(0, donor.mass - minimum[donor.kind]), rate * dt);
      if (transfer <= 0) continue;
      const receiverMass = receiver.mass;
      donor.mass -= transfer;
      receiver.mass += transfer;
      accreteMomentum(receiver, donor.velocity, transfer, receiverMass);
      const material = ['asteroid', 'comet', 'moon', 'dwarf', 'rocky'].includes(donor.kind)
        ? 'debris'
        : donor.kind === 'gas'
          ? 'atmosphere'
          : donor.kind === 'nebula'
            ? 'gas'
            : 'plasma';
      donor.lastEvent = `Losing ${material} to ${receiver.name} through tidal stripping`;
      receiver.lastEvent = `Accreting ${material} from ${donor.name} through a luminous disk`;
      ensureMatterStream(
        donor,
        receiver,
        receiver.kind === 'blackhole' || ['asteroid', 'comet', 'moon', 'dwarf', 'rocky'].includes(donor.kind)
          ? 'debris'
          : 'plasma',
        Math.max(0.28, Math.pow(proximity, 0.68)),
      );
      donor.accretionFx -= dt;
      receiver.accretionFx -= dt;
      if (donor.accretionFx <= 0 || receiver.accretionFx <= 0) {
        donor.accretionFx = receiver.accretionFx = 0.18;
        updateScale(donor);
        applyGrowthProgression(receiver);
      }
    }
  for (const body of bodies)
    if (body.tidalPartnerId !== undefined && !activeDonors.has(body.id)) {
      body.tidalPartnerId = undefined;
      if (body.lastEvent.includes('plasma') || body.lastEvent.includes('debris'))
        body.lastEvent = 'Tidal transfer ended as the bodies separated';
    }
}
