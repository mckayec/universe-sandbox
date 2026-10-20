import assert from 'node:assert/strict';
import test from 'node:test';
import {
  barnesHutAccelerations,
  spatialCandidatePairs,
  type GravityParticle,
} from '../src/gravity-engine.ts';

function particle(id: number, x: number, z: number, mass = 10, radius = 1): GravityParticle {
  return {
    id,
    x,
    z,
    mass,
    radius,
    softening: 0.2,
    sourceFactor: 1,
    responseFactor: 1,
    locked: false,
    hosted: false,
  };
}

test('Barnes-Hut gravity accelerates a two-body pair toward one another', () => {
  const result = barnesHutAccelerations([
    particle(1, -5, 0, 20),
    particle(2, 5, 0, 10),
  ], 1);
  assert.ok(result.get(1)!.x > 0);
  assert.ok(result.get(2)!.x < 0);
  assert.ok(Math.abs(result.get(1)!.z) < 1e-9);
  assert.ok(Math.abs(result.get(2)!.z) < 1e-9);
});

test('locked particles remain gravity sources but receive no acceleration', () => {
  const locked = { ...particle(1, 0, 0, 100), locked: true };
  const result = barnesHutAccelerations([locked, particle(2, 10, 0)], 1);
  assert.deepEqual(result.get(1), { x: 0, z: 0 });
  assert.ok(result.get(2)!.x < 0);
});

test('spatial hashing returns nearby candidate pairs without duplicates', () => {
  const pairs = spatialCandidatePairs([
    particle(1, 0, 0, 1, 2),
    particle(2, 2.5, 0, 1, 2),
    particle(3, 100, 100, 1, 1),
  ], 8);
  assert.deepEqual(pairs, [[1, 2]]);
});
