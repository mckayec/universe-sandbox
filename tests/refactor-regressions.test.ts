import assert from 'node:assert/strict';
import test from 'node:test';
import { stellarBirthStage, stellarTrackForMass, stellarTrackLabel } from '../src/simulation-model.ts';
import { tidalStressRatio } from '../src/physics-continuity.ts';
import { formatMass, habitableRange, ignitionStage, lifeFromScore, seeded } from '../src/physics/body-math.ts';

test('the built-in Sun mass sits on the sun-like track and 1200 is massive', () => {
  assert.equal(stellarTrackForMass(230), 'sun-like');
  assert.equal(stellarBirthStage(230), 'yellow star');
  assert.equal(stellarTrackForMass(1200), 'massive');
  assert.equal(stellarTrackLabel(1200), 'Massive supernova track');
  assert.equal(ignitionStage(1200), 'blue star');
});

test('stellar track boundaries are stable', () => {
  assert.equal(stellarTrackForMass(169.9), 'low-mass');
  assert.equal(stellarTrackForMass(170), 'sun-like');
  assert.equal(stellarTrackForMass(240), 'hot-intermediate');
  assert.equal(stellarTrackForMass(320), 'massive');
});

test('tidal stress ratio basics: zero for invalid input, linear in mass and boost', () => {
  assert.equal(tidalStressRatio(0, 8, 1, 4), 0);
  assert.equal(tidalStressRatio(600, 0, 1, 4), 0);
  assert.equal(tidalStressRatio(600, 8, 0, 4), 0);
  assert.equal(tidalStressRatio(600, 8, 1, -1), 0);
  const base = tidalStressRatio(600, 8, 1, 4);
  assert.ok(Math.abs(tidalStressRatio(1200, 8, 1, 4) / base - 2) < 1e-9);
  assert.ok(Math.abs(tidalStressRatio(600, 8, 1, 4, 3) / base - 3) < 1e-9);
  assert.ok(Math.abs(tidalStressRatio(600, 16, 1, 4) / base - 0.5) < 1e-9);
  assert.equal(tidalStressRatio(600, 8, 1, 4, -2), 0);
});

test('seeded noise is deterministic and stays in [0, 1)', () => {
  assert.equal(seeded(7, 3), seeded(7, 3));
  assert.notEqual(seeded(7, 3), seeded(8, 3));
  for (let i = 0; i < 200; i++) {
    const v = seeded(i, i % 5);
    assert.ok(v >= 0 && v < 1);
  }
});

test('mass formatting and life levels follow their thresholds', () => {
  assert.equal(formatMass(0.456), '0.46');
  assert.equal(formatMass(4.56), '4.6');
  assert.equal(formatMass(230.4), '230');
  assert.deepEqual([0, 0.25, 0.3, 3, 12, 28, 55].map(lifeFromScore), [
    'none',
    'none',
    'habitable',
    'microbial',
    'simple',
    'complex',
    'technological',
  ]);
});

test('habitable zone scales with stellar mass within clamped bounds', () => {
  const star = (mass: number, stage: string) => ({ mass, stage }) as unknown as Parameters<typeof habitableRange>[0];
  const sun = habitableRange(star(210, 'yellow star'));
  assert.ok(Math.abs(sun.inner - 9) < 1e-9 && Math.abs(sun.outer - 15) < 1e-9);
  const heavy = habitableRange(star(210 * 100, 'yellow star'));
  assert.ok(Math.abs(heavy.inner - 18) < 1e-9);
  const light = habitableRange(star(1, 'red dwarf'));
  assert.ok(Math.abs(light.inner - 5.2 * 0.7) < 1e-9);
});
