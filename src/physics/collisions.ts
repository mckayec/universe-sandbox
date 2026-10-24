// Collisions: separation, grazing, fragmentation, atmosphere stripping and consumption.
import * as THREE from 'three';
import { collisionRegime } from '../simulation-model.ts';
import { TYPES, type Kind } from '../celestial-catalog.ts';
import { removeBody, updateScale } from '../bodies/lifecycle.ts';
import { addBody } from '../bodies/registry.ts';
import { seeded } from './body-math.ts';
import { accreteMomentum, applyGrowthProgression } from './stellar-evolution.ts';
import { debrisIds } from './tidal-disruption.ts';
import { isCompact } from '../scene/setup.ts';
import { bodies } from '../state/app-state.ts';
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
function fragmentCollision(a: Body, b: Body, relativeSpeed: number) {
  let remnant = a.mass >= b.mass ? a : b,
    food = remnant === a ? b : a;
  const point = a.mesh.position.clone().lerp(b.mesh.position, 0.5),
    combined = a.mass + b.mass,
    ejected = combined * THREE.MathUtils.clamp(0.18 + (relativeSpeed - 6.2) * 0.025, 0.18, 0.36),
    debrisVelocity = a.velocity
      .clone()
      .multiplyScalar(a.mass)
      .addScaledVector(b.velocity, b.mass)
      .divideScalar(combined);
  remnant.mass = combined - ejected;
  remnant.habitabilityShock = 1;
  remnant.collisionCooldown = 0.8;
  removeBody(food);
  updateScale(remnant);
  const pieces = ejected >= 10 && bodies.length < 80 ? 2 : 1;
  for (let i = 0; i < pieces; i++) {
    const angle = (i / pieces) * Math.PI * 2 + seeded(remnant.id, i) * 1.4,
      direction = new THREE.Vector3(Math.cos(angle), 0, Math.sin(angle)),
      fragment = addBody(
        'rocky',
        point.clone().addScaledVector(direction, remnant.radius + 1.5),
        debrisVelocity.clone().addScaledVector(direction, 2.4 + relativeSpeed * 0.18),
        {
          mass: ejected / pieces,
          birthMass: TYPES.rocky.mass,
          collisionCooldown: 0.9,
          habitabilityShock: 1,
          lastEvent: `Fragmented from the collision involving ${remnant.name}`,
        },
      );
    fragment.velocity.y = 0;
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
export function priority(k: Kind) {
  return {
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
  }[k];
}
export function canEat(a: Body, b: Body) {
  if (a.buildLocked) return true;
  if (a.kind === 'nebula') return b.kind === 'nebula';
  if (b.kind === 'nebula') return a.kind !== 'protostar';
  if (a.kind === 'blackhole') return true;
  if (a.kind === 'pulsar') return b.kind !== 'blackhole';
  if (a.kind === 'star')
    return ['asteroid', 'comet', 'moon', 'dwarf', 'rocky', 'gas', 'brown', 'star', 'protostar'].includes(b.kind);
  if (a.kind === 'brown')
    return ['asteroid', 'comet', 'moon', 'dwarf', 'rocky', 'gas', 'brown', 'protostar'].includes(b.kind);
  if (a.kind === 'gas') return ['asteroid', 'comet', 'moon', 'dwarf', 'rocky', 'gas', 'protostar'].includes(b.kind);
  if (a.kind === 'rocky') return ['asteroid', 'comet', 'moon', 'dwarf', 'rocky'].includes(b.kind);
  if (a.kind === 'dwarf' || a.kind === 'moon') return ['asteroid', 'comet', 'moon', 'dwarf'].includes(b.kind);
  if (a.kind === 'asteroid' || a.kind === 'comet') return b.kind === 'asteroid' || b.kind === 'comet';
  return false;
}

function consume(a: Body, b: Body) {
  const foodName = b.name,
    receiverMass = a.mass,
    total = receiverMass + b.mass,
    impact = b.mesh.position.clone().lerp(a.mesh.position, 0.45);
  accreteMomentum(a, b.velocity, b.mass, receiverMass);
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
export function collisions(candidatePairs?: [number, number][]) {
  const byId = new Map(bodies.map(body => [body.id, body] as const)),
    pairs = candidatePairs ?? bodies.flatMap((a, i) => bodies.slice(0, i).map(b => [a.id, b.id] as [number, number]));
  for (const [aId, bId] of pairs) {
    const a = byId.get(aId),
      b = byId.get(bId);
    if (
      !a ||
      !b ||
      !bodies.includes(a) ||
      !bodies.includes(b) ||
      a.hostId === b.id ||
      b.hostId === a.id ||
      a.collisionCooldown > 0 ||
      b.collisionCooldown > 0
    )
      continue;
    if (a.mesh.position.distanceTo(b.mesh.position) > (a.radius + b.radius) * 0.72) continue;
    if (debrisIds.has(a.id) && debrisIds.has(b.id) && Math.min(a.age, b.age) < 30) continue;
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
    let eater: Body, food: Body;
    if (a.buildLocked !== b.buildLocked) eater = a.buildLocked ? a : b;
    else eater = priority(a.kind) >= priority(b.kind) ? a : b;
    food = eater === a ? b : a;
    if (!canEat(eater, food) && canEat(food, eater)) [eater, food] = [food, eater];
    if (canEat(eater, food)) consume(eater, food);
  }
}
