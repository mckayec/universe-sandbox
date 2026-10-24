// Nebula interactions: drag, accretion, compression and nebula mergers.
import * as THREE from 'three';
import { transferFactor } from '../exhibit-runtime.ts';
import {
  ASTEROID_TO_DWARF,
  DWARF_TO_ROCKY,
  GAS_TO_BROWN,
  PULSAR_LIMIT,
  ROCKY_TO_GAS,
  TYPES,
  type Kind,
} from '../celestial-catalog.ts';
import { removeBody, updateScale } from '../bodies/lifecycle.ts';
import { brownIgnitionMass } from './body-math.ts';
import { ensureMatterStream } from './matter-streams.ts';
import { accreteMomentum, applyGrowthProgression } from './stellar-evolution.ts';
import { isCompact } from '../scene/setup.ts';
import { app, bodies } from '../state/app-state.ts';
import { museumEvent } from '../ui/feed.ts';
import { nebulaAccretionEffect, nebulaBowShockEffect, particleBurst } from '../visuals/effects.ts';

export function updateNebulaInteractions(dt: number) {
  const rates: Record<Kind, number> = {
      asteroid: 0.32,
      comet: 0.48,
      moon: 0.52,
      dwarf: 0.58,
      rocky: 0.72,
      gas: 1.05,
      brown: 1.35,
      star: 1.7,
      protostar: 0,
      pulsar: 2.4,
      blackhole: 4.6,
      nebula: 0,
    },
    activeContacts = new Set<number>();
  for (const cloud of [...bodies]) {
    if (cloud.kind !== 'nebula') continue;
    cloud.nebulaTidal = Math.max(0, cloud.nebulaTidal - dt * 0.55);
    cloud.nebulaCompression = Math.max(0, cloud.nebulaCompression - dt * 0.28);
    let depleted = false;
    for (const target of [...bodies]) {
      if (
        target === cloud ||
        target.kind === 'nebula' ||
        target.hostId === cloud.id ||
        (target.kind === 'protostar' && target.hostId !== undefined)
      )
        continue;
      const delta = target.mesh.position.clone().sub(cloud.mesh.position),
        distance = delta.length(),
        reach = cloud.radius + Math.max(0.8, target.radius * 0.45);
      if (distance >= reach) continue;
      const density = Math.pow(1 - distance / reach, 1.45);
      if (target.kind === 'protostar') {
        target.hostId = cloud.id;
        target.protoAngle = Math.atan2(delta.z, delta.x);
        target.protoOrbit = THREE.MathUtils.clamp(distance, 1, cloud.radius * 0.82);
        target.velocity.copy(cloud.velocity);
        nebulaAccretionEffect(cloud, target, density);
        museumEvent(
          'Protostar captured',
          `${target.name} entered ${cloud.name} and began feeding on its gas.`,
          '#d58cff',
          target,
        );
        continue;
      }
      if (density <= 0.01) continue;
      activeContacts.add(target.id);
      if (target.nebulaContactId !== cloud.id) {
        target.nebulaContactId = cloud.id;
        nebulaBowShockEffect(cloud, target);
        museumEvent(
          'Entered a nebula',
          `${target.name} is experiencing gas drag and gradual accretion.`,
          '#8ee8ff',
          target,
        );
      }
      cloud.nebulaTidal = Math.max(cloud.nebulaTidal, density);
      cloud.nebulaCompression = Math.max(cloud.nebulaCompression, density * 0.26);
      cloud.nebulaAngle = Math.atan2(delta.z, delta.x);
      const relative = cloud.velocity.clone().sub(target.velocity),
        drag = 1 - Math.exp(-density * dt * (0.32 + Math.min(1.2, target.radius * 0.1)));
      if (!target.locked && target !== app.dragBody) target.velocity.addScaledVector(relative, drag);
      if (!cloud.locked && cloud !== app.dragBody)
        cloud.velocity.addScaledVector(
          relative,
          -drag * Math.min(0.18, target.mass / Math.max(1, cloud.mass + target.mass)),
        );
      const crossSection = THREE.MathUtils.clamp(target.radius * 0.62, 0.55, 2.8),
        rate = rates[target.kind] * crossSection * (target.buildLocked ? 1.8 : 1) * transferFactor(app.realismMode),
        transfer = Math.min(Math.max(0, cloud.mass - 4), rate * density * dt);
      if (transfer <= 0) continue;
      const targetMass = target.mass;
      cloud.mass -= transfer;
      target.mass += transfer;
      accreteMomentum(target, cloud.velocity, transfer, targetMass);
      cloud.lastEvent = `Gas is being drawn into ${target.name}`;
      target.lastEvent = `Accreting gas from ${cloud.name} through a luminous inflow disk`;
      ensureMatterStream(cloud, target, 'nebula', Math.max(0.24, Math.pow(density, 0.7)));
      target.accretionFx -= dt;
      if (target.accretionFx <= 0) {
        target.accretionFx = 0.2;
        updateScale(cloud);
        nebulaAccretionEffect(cloud, target, density);
        applyGrowthProgression(target);
      } else if (
        ((target.kind === 'asteroid' || target.kind === 'comet' || target.kind === 'moon') &&
          target.mass >= ASTEROID_TO_DWARF) ||
        (target.kind === 'dwarf' && target.mass >= DWARF_TO_ROCKY) ||
        (target.kind === 'rocky' && target.mass >= ROCKY_TO_GAS) ||
        (target.kind === 'gas' && target.mass >= GAS_TO_BROWN) ||
        (target.kind === 'brown' && target.mass >= brownIgnitionMass(target)) ||
        (target.kind === 'pulsar' && target.mass >= PULSAR_LIMIT)
      )
        applyGrowthProgression(target);
      if (cloud.mass <= 4.05) {
        particleBurst(cloud.mesh.position.clone(), TYPES.nebula.color, isCompact ? 45 : 90, 1.6, 2.2);
        removeBody(cloud);
        depleted = true;
        break;
      }
    }
    if (!depleted && cloud.nebulaTidal === 0 && cloud.mass !== cloud.birthMass && cloud.accretionFx <= 0) {
      cloud.accretionFx = 0.5;
      updateScale(cloud);
    }
    cloud.accretionFx -= dt;
  }
  for (const body of bodies)
    if (body.nebulaContactId !== undefined && !activeContacts.has(body.id)) {
      body.nebulaContactId = undefined;
      body.lastEvent = 'Exited the nebula; gas drag ended';
    }
}
export function updateNebulaMergers(dt: number) {
  const clouds = bodies.filter(b => b.kind === 'nebula');
  for (const cloud of clouds) cloud.mesh.userData.mergeActive = false;
  for (let i = 0; i < clouds.length; i++)
    for (let j = i + 1; j < clouds.length; j++) {
      const a = clouds[i],
        b = clouds[j];
      if (!bodies.includes(a) || !bodies.includes(b)) continue;
      const delta = b.mesh.position.clone().sub(a.mesh.position),
        distance = delta.length(),
        reach = (a.radius + b.radius) * 0.82;
      if (distance >= reach) continue;
      const overlap = THREE.MathUtils.clamp(1 - distance / reach, 0, 1);
      a.mesh.userData.mergeActive = b.mesh.userData.mergeActive = true;
      a.nebulaCompression = Math.max(a.nebulaCompression, 0.25 + overlap * 0.75);
      b.nebulaCompression = Math.max(b.nebulaCompression, 0.25 + overlap * 0.75);
      a.nebulaTidal = Math.max(a.nebulaTidal, overlap * 0.75);
      b.nebulaTidal = Math.max(b.nebulaTidal, overlap * 0.75);
      a.nebulaAngle = Math.atan2(delta.z, delta.x);
      b.nebulaAngle = a.nebulaAngle + Math.PI;
      const blend = 1 - Math.exp(-overlap * dt * 0.7),
        relative = b.velocity.clone().sub(a.velocity);
      if (!a.locked) a.velocity.addScaledVector(relative, blend * 0.5);
      if (!b.locked) b.velocity.addScaledVector(relative, -blend * 0.5);
      if (a.mesh.userData.mergePartner !== b.id) {
        a.mesh.userData.mergePartner = b.id;
        b.mesh.userData.mergePartner = a.id;
        museumEvent(
          'Nebula collision',
          `${a.name} and ${b.name} are compressing into bright star-forming knots.`,
          '#e99cff',
          a,
        );
      }
      if (overlap < 0.12) continue;
      let eater = a.mass >= b.mass ? a : b,
        food = eater === a ? b : a;
      if (food.buildLocked && !eater.buildLocked) [eater, food] = [food, eater];
      const transfer = Math.min(Math.max(0, food.mass - 4), dt * (3.5 + overlap * 13));
      if (transfer <= 0) continue;
      eater.mass += transfer;
      food.mass -= transfer;
      ensureMatterStream(food, eater, 'nebula', overlap);
      eater.accretionFx -= dt;
      if (eater.accretionFx <= 0) {
        eater.accretionFx = 0.22;
        updateScale(eater);
        updateScale(food);
        nebulaAccretionEffect(food, eater, overlap);
      }
      if (food.mass <= 4.05) {
        particleBurst(food.mesh.position.clone(), TYPES.nebula.color, isCompact ? 55 : 110, 2.1, 2.5);
        removeBody(food);
        museumEvent('Cloud merger', `${eater.name} absorbed the remaining gas and became denser.`, '#f2b0ff', eater);
      }
    }
  for (const cloud of clouds) if (!cloud.mesh.userData.mergeActive) delete cloud.mesh.userData.mergePartner;
}
