import assert from 'node:assert/strict';
import test from 'node:test';
import { advanceTidalStrain, effectiveRocheLimit, tidalStressRatio } from '../src/physics-continuity.ts';
import { G, TYPES } from '../src/celestial-catalog.ts';

const DISRUPTION_THRESHOLD = 3;
// Radius scales with cbrt(mass / birthMass), so each kind has a fixed density.
const radiusFor = (kind: keyof typeof TYPES, mass: number) => TYPES[kind].radius * Math.cbrt(mass / TYPES[kind].mass);

test('tidal stress grows with perturber mass and falls with the cube of distance', () => {
  const near = tidalStressRatio(600, 8, 1.05, 4);
  const far = tidalStressRatio(600, 8, 1.05, 8);
  assert.ok(Math.abs(near / far - 8) < 1e-9);
  assert.ok(tidalStressRatio(1200, 8, 1.05, 4) > near);
  assert.equal(tidalStressRatio(600, 8, 1.05, 0), 0);
});

test('the effective Roche limit is where stress meets the threshold', () => {
  const limit = effectiveRocheLimit(650, 14, radiusFor('rocky', 14), DISRUPTION_THRESHOLD);
  const ratio = tidalStressRatio(650, 14, radiusFor('rocky', 14), limit);
  assert.ok(Math.abs(ratio - DISRUPTION_THRESHOLD) < 1e-9);
  assert.ok(effectiveRocheLimit(650, 14, radiusFor('rocky', 14), DISRUPTION_THRESHOLD, 6) > limit);
});

test('built-in Solar System orbits stay below the disruption threshold', () => {
  const sun = 1200;
  for (const [kind, mass, orbit] of [
    ['rocky', 0.55, 7],
    ['rocky', 5.2, 10],
    ['rocky', 6.2, 13.5],
    ['rocky', 1.4, 17.5],
    ['gas', 48, 25],
    ['dwarf', 0.42, 56],
  ] as const) {
    assert.ok(
      tidalStressRatio(sun, mass, radiusFor(kind, mass), orbit) < DISRUPTION_THRESHOLD * 0.5,
      `${kind} at ${orbit}`,
    );
  }
  assert.ok(
    tidalStressRatio(6.2, 0.74, radiusFor('moon', 0.74), 2.35) < DISRUPTION_THRESHOLD * 0.1,
    'Moon around Earth',
  );
  assert.ok(G > 0);
});

test('strain accumulates only beyond the threshold and relaxes afterwards', () => {
  let strain = 0;
  for (let i = 0; i < 60; i++) strain = advanceTidalStrain(strain, 1.5, DISRUPTION_THRESHOLD, 1 / 60);
  assert.equal(strain, 0);
  for (let i = 0; i < 30; i++) strain = advanceTidalStrain(strain, 6, DISRUPTION_THRESHOLD, 1 / 60);
  assert.ok(strain > 0.5 && strain < 1);
  for (let i = 0; i < 30; i++) strain = advanceTidalStrain(strain, 12, DISRUPTION_THRESHOLD, 1 / 60);
  assert.equal(strain, 1);
  const relaxed = advanceTidalStrain(0.6, 0, DISRUPTION_THRESHOLD, 1);
  assert.ok(relaxed < 0.6);
});
