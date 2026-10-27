// Collisions: separation, grazing, fragmentation, atmosphere stripping and consumption.
import * as THREE from 'three';
import { collisionRegime, fragmentKicks, mergeSurvivorIndex } from '../simulation-model.ts';
import { TYPES, type Kind } from '../celestial-catalog.ts';
import { removeBody, updateScale } from '../bodies/lifecycle.ts';
import { passesThroughInGalaxyCollision, transferGalaxyCore } from '../bodies/galaxy-merger.ts';
import { addBody, nameFor } from '../bodies/registry.ts';
import { spatialCandidatePairs } from '../gravity-engine.ts';
import { isExhibitAnchor, sameExhibitSystem, seeded } from './body-math.ts';
import { beginInfall, feedsSlowly } from './infall.ts';
import { accreteMomentum, applyGrowthProgression } from './stellar-evolution.ts';
import { isCompact } from '../scene/setup.ts';
import { bodies, bodyGroupIds, cosmicGroups } from '../state/app-state.ts';
import type { Body } from '../state/types.ts';
import { museumEvent, toast } from '../ui/feed.ts';
import { impactEffect, particleBurst } from '../visuals/effects.ts';

function separateCollision(a: Body, b: Body, normal: THREE.Vector3, strength: number) {
  const total = Math.max(1, a.mass + b.mass);
  if (!a.locked) {
    a.velocity.addScaledVector(normal, (-strength * b.mass) / total);
    a.mesh.position.addScaledVector(normal, -Math.max(0.2, a.radius * 0.12));
  }
  if (!b.locked) {
    b.velocity.addScaledVector(normal, (strength * a.mass) / total);
    b.mesh.position.addScaledVector(normal, Math.max(0.2, b.radius * 0.12));
  }
  a.collisionCooldown = b.collisionCooldown = 0.48;
}
function grazingCollision(a: Body, b: Body, relativeSpeed: number) {
  const normal = b.mesh.position.clone().sub(a.mesh.position);
  if (normal.lengthSq() < 0.001) normal.set(1, 0, 0);
  normal.normalize();
  separateCollision(a, b, normal, Math.max(1.2, relativeSpeed * 0.72));
  if (a.kind === 'rocky') a.habitabilityShock = Math.max(a.habitabilityShock, 0.26);
  if (b.kind === 'rocky') b.habitabilityShock = Math.max(b.habitabilityShock, 0.26);
  const point = a.mesh.position.clone().lerp(b.mesh.position, 0.5);
  impactEffect(point, 0xffc486, 0.72);
  museumEvent(
    'Grazing encounter',
    `${a.name} and ${b.name} skimmed past one another and exchanged momentum.`,
    '#ffc486',
    a,
  );
}
function joinGroupOf(source: Body, piece: Body) {
  const groupId = bodyGroupIds.get(source.id);
  if (groupId === undefined) return;
  bodyGroupIds.set(piece.id, groupId);
  cosmicGroups.find(group => group.id === groupId)?.bodyIds.push(piece.id);
}
function fragmentCollision(a: Body, b: Body, relativeSpeed: number) {
  const remnant = a.mass >= b.mass ? a : b,
    food = remnant === a ? b : a;
  const point = a.mesh.position.clone().lerp(b.mesh.position, 0.5),
    combined = a.mass + b.mass,
    ejected = combined * THREE.MathUtils.clamp(0.18 + (relativeSpeed - 6.2) * 0.025, 0.18, 0.36),
    centerOfMassVelocity = a.velocity
      .clone()
      .multiplyScalar(a.mass)
      .addScaledVector(b.velocity, b.mass)
      .divideScalar(combined),
    foodName = food.name;
  remnant.mass = combined - ejected;
  remnant.habitabilityShock = 1;
  remnant.collisionCooldown = 0.8;
  removeBody(food);
  updateScale(remnant);
  const pieces = ejected >= 10 && bodies.length < 80 ? 2 : 1,
    pieceMass = ejected / pieces,
    kickSpeed = 2.4 + relativeSpeed * 0.18,
    // Kicks are balanced by recoil on the remnant, so the collision conserves total momentum.
    kicks = fragmentKicks(pieces, pieceMass, remnant.mass, kickSpeed, seeded(remnant.id, 0) * Math.PI * 2);
  if (!remnant.locked)
    remnant.velocity.copy(centerOfMassVelocity).add(new THREE.Vector3(kicks.recoil[0], 0, kicks.recoil[1]));
  remnant.velocity.y = 0;
  for (const [kx, kz] of kicks.pieces) {
    const direction = new THREE.Vector3(kx, 0, kz).normalize(),
      fragment = addBody(
        'rocky',
        point.clone().addScaledVector(direction, remnant.radius + 1.5),
        centerOfMassVelocity.clone().add(new THREE.Vector3(kx, 0, kz)),
        {
          mass: pieceMass,
          birthMass: TYPES.rocky.mass,
          collisionCooldown: 0.9,
          habitabilityShock: 1,
          exhibitSystemId: remnant.exhibitSystemId,
          lastEvent: `Fragmented from the collision between ${remnant.name} and ${foodName}`,
        },
      );
    fragment.velocity.y = 0;
    joinGroupOf(remnant, fragment);
  }
  particleBurst(point, 0xff925c, isCompact ? 55 : 120, 4.2, 2.8);
  impactEffect(point, 0xffc17c, 1.45);
  museumEvent(
    'Planetary fragmentation',
    `${a.name} and ${b.name} struck fast enough to create persistent rocky debris.`,
    '#ff9a68',
    remnant,
  );
  applyGrowthProgression(remnant);
}
function stripAtmosphere(a: Body, b: Body, relativeSpeed: number) {
  const gas = a.kind === 'gas' ? a : b,
    other = gas === a ? b : a,
    loss = Math.min(gas.mass * 0.22, Math.max(3, other.mass * 0.14 + relativeSpeed * 0.45));
  gas.mass = Math.max(5, gas.mass - loss);
  gas.collisionCooldown = other.collisionCooldown = 0.65;
  if (other.kind === 'rocky') other.habitabilityShock = Math.max(other.habitabilityShock, 0.72);
  const normal = other.mesh.position.clone().sub(gas.mesh.position);
  if (normal.lengthSq() < 0.001) normal.set(1, 0, 0);
  separateCollision(gas, other, normal.normalize(), relativeSpeed * 0.48);
  updateScale(gas);
  const point = gas.mesh.position.clone().lerp(other.mesh.position, 0.5);
  particleBurst(point, TYPES.gas.color, isCompact ? 45 : 90, 3.5, 3.4);
  impactEffect(point, 0x9fdcff, 0.95);
  museumEvent(
    'Atmospheric stripping',
    `${other.name} tore ${loss.toFixed(0)} M⊕ of atmosphere from ${gas.name}.`,
    '#9fdcff',
    gas,
  );
}
const PRIORITY: Record<Kind, number> = {
    nebula: -1,
    protostar: 0,
    asteroid: 0,
    comet: 0,
    moon: 1,
    dwarf: 2,
    rocky: 3,
    gas: 4,
    brown: 5,
    star: 6,
    pulsar: 7,
    blackhole: 8,
  },
  SMALL_BODIES: Kind[] = ['asteroid', 'comet', 'moon', 'dwarf'],
  EDIBLE: Partial<Record<Kind, ReadonlySet<Kind>>> = {
    star: new Set<Kind>([...SMALL_BODIES, 'rocky', 'gas', 'brown', 'star', 'protostar']),
    brown: new Set<Kind>([...SMALL_BODIES, 'rocky', 'gas', 'brown', 'protostar']),
    gas: new Set<Kind>([...SMALL_BODIES, 'rocky', 'gas', 'protostar']),
    rocky: new Set<Kind>([...SMALL_BODIES, 'rocky']),
    dwarf: new Set<Kind>(SMALL_BODIES),
    moon: new Set<Kind>(SMALL_BODIES),
    asteroid: new Set<Kind>(['asteroid', 'comet']),
    comet: new Set<Kind>(['asteroid', 'comet']),
  };
export function priority(k: Kind) {
  return PRIORITY[k];
}
export function canEat(a: Body, b: Body) {
  if (a.buildLocked) return true;
  if (a.kind === 'nebula') return b.kind === 'nebula';
  if (b.kind === 'nebula') return a.kind !== 'protostar';
  if (a.kind === 'blackhole') return true;
  if (a.kind === 'pulsar') return b.kind !== 'blackhole';
  return EDIBLE[a.kind]?.has(b.kind) ?? false;
}
/** Order a merging pair: build locks first, then kind priority, then the heavier body, then the older id. */
function chooseEater(a: Body, b: Body): [Body, Body] {
  // An exhibit system's anchor always absorbs its own members (a galaxy core is never eaten by one of its stars).
  if (sameExhibitSystem(a, b) && isExhibitAnchor(a) !== isExhibitAnchor(b)) return isExhibitAnchor(a) ? [a, b] : [b, a];
  const first =
    mergeSurvivorIndex(
      { buildLocked: a.buildLocked, priority: PRIORITY[a.kind], mass: a.mass, id: a.id },
      { buildLocked: b.buildLocked, priority: PRIORITY[b.kind], mass: b.mass, id: b.id },
    ) === 0
      ? a
      : b;
  let eater = first,
    food = first === a ? b : a;
  if (!canEat(eater, food) && canEat(food, eater)) [eater, food] = [food, eater];
  return [eater, food];
}
/**
 * The survivor of a merger keeps its own identity; when it swallows a larger body it inherits that body's
 * exhibit role (lock, held stage, exhibit membership, satellites and galaxy anchor) and its custom name.
 */
function inheritIdentity(eater: Body, food: Body, foodWasDefaultName: boolean) {
  if (food.mass <= eater.mass) return;
  if (food.locked && !eater.locked) {
    eater.locked = true;
    eater.velocity.set(0, 0, 0);
  }
  if (food.holdStage && eater.kind === 'star') eater.holdStage = true;
  if (food.exhibitSystemId !== undefined && eater.exhibitSystemId === undefined) {
    eater.exhibitSystemId = food.exhibitSystemId;
    eater.exhibitAnchor = food.exhibitAnchor;
  }
  if (!foodWasDefaultName && eater.name === nameFor(eater.kind, eater.id)) eater.name = food.name;
  for (const body of bodies)
    if (body.satelliteHostId === food.id && eater.kind === 'rocky') body.satelliteHostId = eater.id;
  for (const group of cosmicGroups) if (group.anchorId === food.id) group.anchorId = eater.id;
}
export function consume(a: Body, b: Body) {
  const foodWasDefaultName = b.name === nameFor(b.kind, b.id);
  // A swallowed galaxy core hands its stars, halo and picture on before anything else changes hands.
  transferGalaxyCore(a, b);
  inheritIdentity(a, b, foodWasDefaultName);
  const foodName = b.name,
    receiverMass = a.mass,
    total = receiverMass + b.mass,
    impact = b.mesh.position.clone().lerp(a.mesh.position, 0.45);
  // An exhibit anchor isn't yanked around by its own system's members (same rule as gravity).
  if (!(isExhibitAnchor(a) && sameExhibitSystem(a, b))) accreteMomentum(a, b.velocity, b.mass, receiverMass);
  if (a.buildLocked) a.velocity.set(0, 0, 0);
  a.mass = total;
  a.collisionCooldown = 0.32;
  a.lastEvent = a.buildLocked
    ? `Build lock held position while ${foodName} was accreted`
    : `Momentum carried forward after accreting ${foodName}`;
  if (a.kind === 'rocky') a.habitabilityShock = Math.max(a.habitabilityShock, 0.82);
  impactEffect(impact, a.kind === 'blackhole' ? 0xffa14d : TYPES[a.kind].color, a.kind === 'blackhole' ? 1.8 : 1);
  removeBody(b);
  if (!applyGrowthProgression(a)) toast(`${a.name} accreted ${foodName}`);
}
function candidatePairs(): Array<[Body, Body]> {
  const pairs: Array<[Body, Body]> = [];
  if (bodies.length > 50) {
    const byId = new Map(bodies.map(body => [body.id, body] as const)),
      particles = bodies.map(body => ({
        id: body.id,
        x: body.mesh.position.x,
        z: body.mesh.position.z,
        radius: body.radius,
      }));
    for (const [aId, bId] of spatialCandidatePairs(particles, 12)) pairs.push([byId.get(aId)!, byId.get(bId)!]);
    return pairs;
  }
  for (let i = 1; i < bodies.length; i++) for (let j = 0; j < i; j++) pairs.push([bodies[i], bodies[j]]);
  return pairs;
}
export function collisions() {
  for (const [a, b] of candidatePairs()) {
    if (
      a.removed ||
      b.removed ||
      a.hostId === b.id ||
      b.hostId === a.id ||
      a.collisionCooldown > 0 ||
      b.collisionCooldown > 0 ||
      // Ships are scripted props: they never merge with worlds or debris.
      a.artificial ||
      b.artificial ||
      // A body being fed slowly into a disk is finished by updateInfall, not by contact.
      a.infall ||
      b.infall
    )
      continue;
    const reach = (a.radius + b.radius) * 0.72;
    if (a.mesh.position.distanceToSquared(b.mesh.position) > reach * reach) continue;
    if (a.debris && b.debris && Math.min(a.age, b.age) < 30) continue;
    // Exhibit-system members don't collide with one another; only the anchor can still absorb a member that falls in.
    if (sameExhibitSystem(a, b) && !isExhibitAnchor(a) && !isExhibitAnchor(b)) continue;
    if ((a.kind === 'nebula' && b.kind === 'protostar') || (b.kind === 'nebula' && a.kind === 'protostar')) {
      const cloud = a.kind === 'nebula' ? a : b,
        seed = a.kind === 'protostar' ? a : b,
        offset = seed.mesh.position.clone().sub(cloud.mesh.position);
      seed.hostId = cloud.id;
      seed.protoAngle = Math.atan2(offset.z, offset.x);
      seed.protoOrbit = THREE.MathUtils.clamp(offset.length(), 1, cloud.radius * 0.8);
      seed.velocity.copy(cloud.velocity);
      continue;
    }
    if (a.kind === 'nebula' || b.kind === 'nebula') continue;
    const aPlanet = a.kind === 'moon' ? 'rocky' : a.kind,
      bPlanet = b.kind === 'moon' ? 'rocky' : b.kind;
    if (!a.buildLocked && !b.buildLocked && ['rocky', 'gas'].includes(aPlanet) && ['rocky', 'gas'].includes(bPlanet)) {
      const normal = b.mesh.position.clone().sub(a.mesh.position);
      if (normal.lengthSq() < 0.001) normal.set(1, 0, 0);
      normal.normalize();
      const relative = b.velocity.clone().sub(a.velocity),
        relativeSpeed = relative.length(),
        normalSpeed = Math.abs(relative.dot(normal)),
        tangentialFraction =
          relativeSpeed > 0.001
            ? Math.sqrt(Math.max(0, relativeSpeed * relativeSpeed - normalSpeed * normalSpeed)) / relativeSpeed
            : 0,
        regime = collisionRegime(
          aPlanet as 'rocky' | 'gas',
          bPlanet as 'rocky' | 'gas',
          relativeSpeed,
          tangentialFraction,
        );
      if (regime === 'grazing') {
        grazingCollision(a, b, relativeSpeed);
        continue;
      }
      if (regime === 'fragment') {
        fragmentCollision(a, b, relativeSpeed);
        continue;
      }
      if (regime === 'strip') {
        stripAtmosphere(a, b, relativeSpeed);
        continue;
      }
    }
    if (passesThroughInGalaxyCollision(a, b)) continue;
    const [eater, food] = chooseEater(a, b);
    if (!canEat(eater, food)) continue;
    if (feedsSlowly(eater, food)) beginInfall(eater, food);
    else consume(eater, food);
  }
}
