// Stellar ignition, evolution stages, supernovae, protostars and growth by accretion.
import * as THREE from 'three';
import {
  momentumWeightedVelocity,
  nextStellarStep,
  stellarBirthStage,
  stellarTrackLabel,
} from '../simulation-model.ts';
import { evolutionFactor, transferFactor } from '../exhibit-runtime.ts';
import {
  ASTEROID_TO_DWARF,
  DWARF_TO_ROCKY,
  GAS_TO_BROWN,
  PULSAR_LIMIT,
  ROCKY_TO_GAS,
  STAGES,
  TYPES,
  type Kind,
} from '../celestial-catalog.ts';
import { removeBody, replaceVisual, transform, updateScale } from '../bodies/lifecycle.ts';
import { addBody } from '../bodies/registry.ts';
import { brownIgnitionMass, ignitionStage, protoIgnitionMass, stellarEvolutionRate } from './body-math.ts';
import { ensureMatterStream } from './matter-streams.ts';
import { isCompact } from '../scene/setup.ts';
import { app, bodies } from '../state/app-state.ts';
import type { Body, Stage } from '../state/types.ts';
import { museumEvent } from '../ui/feed.ts';
import {
  compactBirthJetEffect,
  impactEffect,
  nebulaAccretionEffect,
  particleBurst,
  planetaryNebulaEffect,
  stellarIgnitionEffect,
  supernovaEffect,
} from '../visuals/effects.ts';

function igniteBody(b: Body, source: 'brown dwarf' | 'protostar') {
  const mass = b.mass,
    stage = ignitionStage(mass),
    data = STAGES.find(s => s.stage === stage)!;
  stellarIgnitionEffect(b.mesh.position.clone(), data.color, mass);
  transform(b, 'star', mass);
  b.stage = stage;
  b.stageAge = 0;
  replaceVisual(b);
  updateScale(b);
  museumEvent(
    source === 'brown dwarf' ? 'Fusion ignition' : 'Protostar ignition',
    `${b.name} reached ${mass.toFixed(0)} M⊕ and entered the ${stellarTrackLabel(mass).toLowerCase()} as a ${stage}.`,
    data.css,
    b,
  );
}

function beginStellarTransition(b: Body, to: Stage, reason: 'evolution' | 'accretion' = 'evolution') {
  if (b.kind !== 'star' || b.stage === to || b.stageTransition) return false;
  const from = b.stage!,
    duration = to === 'white dwarf' ? 8.5 : 5.5;
  b.stageTransition = { from, to, age: 0, duration };
  b.stageAge = 0;
  if (to === 'white dwarf') planetaryNebulaEffect(b.mesh.position.clone());
  else impactEffect(b.mesh.position.clone(), STAGES.find(s => s.stage === to)!.color, 0.78);
  const target = STAGES.find(s => s.stage === to)!;
  b.lastEvent =
    to === 'white dwarf'
      ? 'Outer layers are being shed into a planetary nebula'
      : `Stellar envelope is shifting toward ${to}`;
  museumEvent(
    to === 'white dwarf'
      ? 'Envelope shedding'
      : reason === 'accretion'
        ? 'Spectral shift begins'
        : 'Stellar transition',
    to === 'white dwarf'
      ? `${b.name} is gradually exposing a hot white-dwarf core while its outer atmosphere expands away.`
      : `${b.name} is changing from ${from} to ${to}; its temperature, color, and radius will shift over several seconds.`,
    target.css,
    b,
  );
  return true;
}
function finishStellarTransition(b: Body) {
  const transition = b.stageTransition;
  if (!transition) return;
  b.stage = transition.to;
  b.stageTransition = undefined;
  b.stageAge = 0;
  replaceVisual(b);
  updateScale(b);
  const look = STAGES.find(s => s.stage === b.stage)!;
  b.lastEvent =
    b.stage === 'white dwarf'
      ? 'Settled as a white dwarf inside an expanding planetary nebula'
      : `Completed transition into ${b.stage}`;
  museumEvent(
    b.stage === 'white dwarf' ? 'White dwarf revealed' : 'Stellar transition complete',
    b.stage === 'white dwarf'
      ? `${b.name}'s compact white-dwarf core now shines through the expelled gas.`
      : `${b.name} has settled into the ${b.stage} phase.`,
    look.css,
    b,
  );
}
export function advanceStar(b: Body, dt: number) {
  const evolutionDelta = dt * evolutionFactor(app.realismMode);
  if (b.stageTransition) {
    b.stageTransition.age += evolutionDelta;
    if (b.stageTransition.age >= b.stageTransition.duration) finishStellarTransition(b);
    return;
  }
  if (b.holdStage) return;
  const step = nextStellarStep(b.mass, b.stage!);
  if (step.action === 'stable') return;
  const look = STAGES.find(s => s.stage === b.stage)!;
  b.stageAge += evolutionDelta * stellarEvolutionRate(b);
  if (b.stageAge < look.duration) return;
  if (step.action === 'supernova') {
    supernova(b);
    return;
  }
  beginStellarTransition(b, step.next, 'evolution');
}
function supernova(b: Body) {
  const p = b.mesh.position.clone(),
    v = b.velocity.clone(),
    m = b.mass,
    sourceName = b.name,
    outcome: Kind = m >= 520 ? 'blackhole' : m >= 280 ? 'pulsar' : 'nebula';
  supernovaEffect(p);
  if (outcome === 'pulsar' || outcome === 'blackhole') compactBirthJetEffect(p, outcome);
  transform(
    b,
    outcome,
    outcome === 'nebula'
      ? Math.max(90, m * 0.45)
      : outcome === 'pulsar'
        ? Math.max(330, m * 0.72)
        : Math.max(600, m * 0.82),
  );
  b.mesh.position.copy(p);
  b.velocity.copy(v).multiplyScalar(0.35);
  museumEvent('Supernova', `${sourceName} exploded and left a ${TYPES[outcome].label.toLowerCase()}.`, '#ffffff', b);
}
function typeIaSupernova(b: Body) {
  const position = b.mesh.position.clone(),
    velocity = b.velocity.clone(),
    mass = b.mass,
    source = b.name;
  supernovaEffect(position);
  transform(b, 'nebula', Math.max(80, mass * 0.34));
  b.mesh.position.copy(position);
  b.velocity.copy(velocity).multiplyScalar(0.52);
  museumEvent(
    'Type Ia supernova',
    `${source} exceeded this exhibit's white-dwarf accretion limit and detonated, dispersing its outer material.`,
    '#f7f2ff',
    b,
  );
}
export function spawnProtostar(n: Body) {
  const seedMass = 34 + Math.random() * 10;
  if (n.mass < seedMass + 22) return;
  const a = Math.random() * Math.PI * 2,
    o = 0.8 + Math.random() * 1.5,
    p = n.mesh.position.clone().add(new THREE.Vector3(Math.cos(a) * o, 0, Math.sin(a) * o));
  n.mass -= seedMass;
  updateScale(n);
  const seed = addBody('protostar', p, n.velocity, {
    hostId: n.id,
    protoAngle: a,
    protoOrbit: o,
    mass: seedMass,
    lastEvent: `A dense core is gradually condensing inside ${n.name}`,
  });
  particleBurst(p, TYPES.protostar.color, isCompact ? 16 : 30, 0.65, 2.4);
  museumEvent(
    'Dense core condensing',
    `${seed.name} is beginning as a compact gas knot; its accretion disk and jets will emerge as it contracts.`,
    '#ff9b76',
    seed,
  );
}
export function updateProto(b: Body, dt: number) {
  const h = bodies.find(x => x.id === b.hostId && x.kind === 'nebula');
  if (!h) {
    b.hostId = undefined;
    if (!b.locked && b !== app.dragBody) b.mesh.position.addScaledVector(b.velocity, dt);
    b.mesh.rotation.z += dt * 1.4;
    return;
  }
  const cloudScale = Math.cbrt(Math.max(0.05, h.mass / h.birthMass)),
    edge = Math.max(1.2, h.radius / cloudScale),
    normalized = THREE.MathUtils.clamp(b.protoOrbit / edge, 0, 1),
    density = Math.pow(1 - normalized, 0.72) * Math.sqrt(THREE.MathUtils.clamp(h.mass / h.birthMass, 0.04, 1));
  b.protoAngle += dt * (0.32 + 1.15 / (1 + b.protoOrbit * 0.35));
  b.protoOrbit = THREE.MathUtils.clamp(b.protoOrbit + b.protoDrift * dt, 1, edge * 0.9);
  if (b.protoOrbit === 1 || b.protoOrbit >= edge * 0.9) b.protoDrift *= -1;
  const r = new THREE.Vector3(Math.cos(b.protoAngle), 0, Math.sin(b.protoAngle));
  b.mesh.position.copy(h.mesh.position).addScaledVector(r, b.protoOrbit);
  b.velocity.copy(h.velocity).add(new THREE.Vector3(-r.z, 0, r.x).multiplyScalar(0.8 + 1.4 / (1 + b.protoOrbit * 0.2)));
  b.mesh.rotation.z += dt * 2.5;
  const feed = Math.min(Math.max(0, h.mass - 4), dt * (1.2 + density * 6.4) * transferFactor(app.realismMode));
  if (feed > 0) {
    b.mass += feed;
    h.mass -= feed;
    ensureMatterStream(h, b, 'nebula', Math.max(0.22, density));
    b.accretionFx -= dt;
    if (b.accretionFx <= 0) {
      b.accretionFx = 0.22;
      updateScale(b);
      updateScale(h);
      nebulaAccretionEffect(h, b, density);
    }
  }
  if (h.mass <= 4.05) {
    particleBurst(h.mesh.position.clone(), TYPES.nebula.color, isCompact ? 45 : 90, 1.6, 2.2);
    removeBody(h);
  }
  if (b.mass >= protoIgnitionMass(b)) {
    const v = b.velocity.clone();
    igniteBody(b, 'protostar');
    b.velocity.copy(v);
  }
}
function reclassifyAccretingStar(b: Body) {
  if (b.kind !== 'star' || b.stageTransition || ['giant', 'hypergiant', 'white dwarf'].includes(b.stage!)) return false;
  const next = stellarBirthStage(b.mass);
  if (next === b.stage) return false;
  return beginStellarTransition(b, next, 'accretion');
}
export function applyGrowthProgression(b: Body) {
  if (b.artificial) return false;
  if (b.kind === 'star' && b.stage === 'white dwarf' && b.mass >= 315) {
    typeIaSupernova(b);
    return true;
  }
  let changed = reclassifyAccretingStar(b);
  for (let guard = 0; guard < 6; guard++) {
    if (b.kind === 'pulsar' && b.mass >= PULSAR_LIMIT) {
      const position = b.mesh.position.clone();
      supernovaEffect(position);
      compactBirthJetEffect(position, 'blackhole');
      transform(b, 'blackhole', b.mass);
      museumEvent(
        'Gravitational collapse',
        `${b.name} crossed the pulsar mass limit and became a black hole.`,
        '#b39aff',
        b,
      );
      changed = true;
      continue;
    }
    if ((b.kind === 'asteroid' || b.kind === 'comet' || b.kind === 'moon') && b.mass >= ASTEROID_TO_DWARF) {
      impactEffect(b.mesh.position.clone(), TYPES.dwarf.color, 0.72);
      transform(b, 'dwarf', b.mass);
      museumEvent(
        'Dwarf planet assembled',
        `${b.name} accumulated enough material for gravity to pull it toward a rounded dwarf world.`,
        '#d2a181',
        b,
      );
      changed = true;
      continue;
    }
    if (b.kind === 'dwarf' && b.mass >= DWARF_TO_ROCKY) {
      impactEffect(b.mesh.position.clone(), TYPES.rocky.color, 0.9);
      transform(b, 'rocky', b.mass);
      museumEvent(
        'Planet assembled',
        `${b.name} crossed this exhibit's planetary-mass threshold and became a rocky world.`,
        '#d58b62',
        b,
      );
      changed = true;
      continue;
    }
    if (b.kind === 'rocky' && b.mass >= ROCKY_TO_GAS) {
      impactEffect(b.mesh.position.clone(), TYPES.gas.color, 1.25);
      transform(b, 'gas', b.mass);
      museumEvent('Planetary growth', `${b.name} retained enough gas to become a gas giant.`, '#78afd2', b);
      changed = true;
      continue;
    }
    if (b.kind === 'gas' && b.mass >= GAS_TO_BROWN) {
      impactEffect(b.mesh.position.clone(), TYPES.brown.color, 1.45);
      transform(b, 'brown', b.mass);
      museumEvent('Brown dwarf formed', `${b.name} compressed beyond the gas-giant regime.`, '#e07447', b);
      changed = true;
      continue;
    }
    if (b.kind === 'brown' && b.mass >= brownIgnitionMass(b)) {
      igniteBody(b, 'brown dwarf');
      changed = true;
      continue;
    }
    break;
  }
  if (!changed) updateScale(b);
  return changed;
}
export function accreteMomentum(
  receiver: Body,
  donorVelocity: THREE.Vector3,
  transferredMass: number,
  receiverMass: number,
) {
  if (receiver.locked || receiver.buildLocked || receiver === app.dragBody || transferredMass <= 0) return;
  receiver.velocity.set(
    ...momentumWeightedVelocity(
      receiver.velocity.toArray() as [number, number, number],
      receiverMass,
      donorVelocity.toArray() as [number, number, number],
      transferredMass,
    ),
  );
}
