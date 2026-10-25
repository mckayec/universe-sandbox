import assert from 'node:assert/strict';
import test from 'node:test';
import {
  barnesHutAccelerations,
  pairwiseAccelerations,
  softenedDistanceSq,
  type GravityParticle,
} from '../src/gravity-engine.ts';
import { fragmentKicks, mergeSurvivorIndex, stellarBirthStage } from '../src/simulation-model.ts';
import { validateSavedBodies, type SavedBody } from '../src/sandbox-state.ts';

function particle(
  id: number,
  x: number,
  z: number,
  mass: number,
  extra: Partial<GravityParticle> = {},
): GravityParticle {
  return {
    id,
    x,
    z,
    mass,
    radius: 1,
    softening: 0,
    sourceFactor: 1,
    responseFactor: 1,
    locked: false,
    hosted: false,
    ...extra,
  };
}
// A Sun-anchored exhibit system plus enough distant outsiders to push Barnes–Hut well past its threshold.
function scene() {
  const particles = [
    particle(1, 0, 0, 230, { systemId: 9, anchor: true }),
    particle(2, 13.5, 0, 1.2, { systemId: 9, frameX: 0, frameZ: 0 }),
    particle(3, 0, 25, 9.2, { systemId: 9, frameX: 0, frameZ: 0 }),
    particle(4, -40, -3, 30),
  ];
  for (let i = 0; i < 70; i++)
    particles.push(particle(100 + i, 600 + (i % 10) * 3, 600 + Math.floor(i / 10) * 3, 0.01));
  return particles;
}

test('exhibit anchors ignore their members and members ignore each other on both gravity paths', () => {
  for (const accelerations of [pairwiseAccelerations(scene(), 1), barnesHutAccelerations(scene(), 1)]) {
    const sun = accelerations.get(1)!,
      earth = accelerations.get(2)!;
    // The Sun only feels the outsider at (-40, -3) and the far asteroids, never Earth or Jupiter.
    assert.ok(sun.x < 0 && Math.abs(sun.z) < 0.01, JSON.stringify(sun));
    // Earth feels the Sun (and the outsider) but not Jupiter: no +z pull from Jupiter at (0, 25).
    assert.ok(earth.x < 0);
    assert.ok(Math.abs(earth.z) < 0.01, JSON.stringify(earth));
  }
});

test('Barnes-Hut agrees with the exact path, including softening, above 64 bodies', () => {
  const exact = pairwiseAccelerations(scene(), 1.05),
    tree = barnesHutAccelerations(scene(), 1.05);
  for (const id of [1, 2, 3, 4]) {
    const a = exact.get(id)!,
      b = tree.get(id)!,
      size = Math.hypot(a.x, a.z);
    assert.ok(Math.hypot(a.x - b.x, a.z - b.z) <= size * 0.02 + 1e-9, `body ${id}`);
  }
  assert.equal(softenedDistanceSq(0.01, 0, 0, 1, 1), 4 * 0.35);
});

test('another exhibit system is felt through the member frame, so a preset moves as one unit', () => {
  const galaxy = particle(50, 400, 0, 9600, { systemId: 2, anchor: true }),
    sun = particle(1, 0, 0, 230, { systemId: 9, anchor: true }),
    planet = particle(2, 13.5, 0, 1.2, { systemId: 9, frameX: 0, frameZ: 0 }),
    accelerations = pairwiseAccelerations([galaxy, sun, planet], 1);
  const sunPull = accelerations.get(1)!.x,
    planetPull = accelerations.get(2)!.x - (-1 * 230) / (13.5 * 13.5);
  assert.ok(Math.abs(sunPull - planetPull) < 1e-9);
});

test('fragment kicks are balanced by remnant recoil, conserving momentum', () => {
  for (const pieces of [1, 2]) {
    const { pieces: kicks, recoil } = fragmentKicks(pieces, 4.3, 15.4, 3.7, 0.8);
    let px = recoil[0] * 15.4,
      pz = recoil[1] * 15.4;
    for (const [kx, kz] of kicks) {
      px += kx * 4.3;
      pz += kz * 4.3;
    }
    assert.ok(Math.abs(px) < 1e-9 && Math.abs(pz) < 1e-9);
  }
});

test('equal-priority mergers keep the heavier body, then the older id', () => {
  const big = { buildLocked: false, priority: 6, mass: 400, id: 1 },
    small = { buildLocked: false, priority: 6, mass: 120, id: 2 };
  assert.equal(mergeSurvivorIndex(small, big), 1);
  assert.equal(mergeSurvivorIndex(big, small), 0);
  assert.equal(mergeSurvivorIndex({ ...small, mass: 400 }, big), 1);
  assert.equal(mergeSurvivorIndex({ ...small, buildLocked: true }, big), 0);
  assert.equal(mergeSurvivorIndex({ ...small, priority: 8 }, big), 0);
});

test('galaxy member masses sit on the track their names describe', () => {
  // Mirrors GALAXY_MEMBER_MASSES in src/builders/galaxy.ts (which imports DOM modules).
  const masses = { red: 120, yellow: 210, white: 270, blue: 360 } as const;
  assert.equal(stellarBirthStage(masses.red), 'red dwarf');
  assert.equal(stellarBirthStage(masses.yellow), 'yellow star');
  assert.equal(stellarBirthStage(masses.white), 'white star');
  assert.equal(stellarBirthStage(masses.blue), 'blue star');
});

test('save validation drops unrestorable bodies and bad stage transitions', () => {
  const base = {
    id: 1,
    kind: 'star',
    name: 'Sun',
    variant: 0,
    mass: 230,
    birthMass: 230,
    radius: 2,
    position: [0, 0, 0],
    velocity: [0, 0, 0],
    locked: false,
    buildLocked: false,
    age: 0,
    stage: 'yellow star',
    stageAge: 0,
    nebulaTimer: 0,
    protoAngle: 0,
    protoOrbit: 1,
    protoDrift: 0,
    lifeScore: 0,
    lifeLevel: 'none',
    habitabilityShock: 0,
    habitatStatus: '',
    lastEvent: '',
  } as SavedBody;
  const kinds = new Set(['star', 'rocky']),
    stages = new Set(['yellow star', 'giant']),
    result = validateSavedBodies(
      [
        base,
        { ...base, id: 2, kind: 'quasar' },
        { ...base, id: 3, stage: 'purple star' },
        { ...base, id: 4, mass: Number.NaN },
        { ...base, id: 5, position: [0, 0] as unknown as [number, number, number] },
        { ...base, id: 1 },
        { ...base, id: 6, stageTransition: { from: 'yellow star', to: 'giant', age: 1, duration: 5.5 } },
        { ...base, id: 7, stageTransition: { from: 'yellow star', to: 'nova', age: 1, duration: 5.5 } },
      ],
      kinds,
      stages,
    );
  assert.deepEqual(
    result.bodies.map(body => body.id),
    [1, 6, 7],
  );
  assert.equal(result.dropped, 5);
  assert.ok(result.bodies[1].stageTransition);
  assert.equal(result.bodies[2].stageTransition, undefined);
});
