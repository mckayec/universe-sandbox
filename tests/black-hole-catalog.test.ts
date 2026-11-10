// Item 7a: black-hole reference catalog, real-unit sizes and honest model-unit labelling.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import {
  BLACK_HOLE_EXAMPLES,
  BLACK_HOLE_PRESETS,
  SCHWARZSCHILD_KM_PER_SOLAR_MASS,
  blackHoleClass,
  blackHoleSizes,
  formatLength,
  formatSolarMasses,
  modelMassLabel,
  nearestExample,
  presetRows,
} from '../src/black-hole-catalog.ts';

test('Schwarzschild radius is about 2.95325 km per solar mass', () => {
  assert.ok(Math.abs(SCHWARZSCHILD_KM_PER_SOLAR_MASS - 2.95325) < 5e-5, String(SCHWARZSCHILD_KM_PER_SOLAR_MASS));
});

test('five presets: 5, 30, 1,000, 1 million, 1 billion; not five classes', () => {
  assert.deepEqual(
    BLACK_HOLE_PRESETS.map(p => p.solarMasses),
    [5, 30, 1_000, 1_000_000, 1_000_000_000],
  );
  const classes = BLACK_HOLE_PRESETS.map(p => blackHoleClass(p.solarMasses));
  assert.deepEqual(classes, ['stellar-mass', 'stellar-mass', 'intermediate-mass', 'supermassive', 'supermassive']);
  assert.equal(new Set(classes).size, 3);
});

test('reference examples carry the handoff masses, status labels and sources', () => {
  const masses = Object.fromEntries(BLACK_HOLE_EXAMPLES.map(e => [e.name, e.solarMasses]));
  assert.deepEqual(masses, {
    'Cygnus X-1': 21,
    'Gaia BH3': 33,
    'GW190521 remnant': 142,
    'HLX-1': 20_000,
    'Sagittarius A*': 4_000_000,
    'M87*': 6_500_000_000,
  });
  for (const e of BLACK_HOLE_EXAMPLES) {
    assert.match(e.source, /^https:\/\//, e.name);
    assert.ok(e.status.length > 10 && e.context.length > 10, e.name);
  }
  assert.match(BLACK_HOLE_EXAMPLES.find(e => e.name === 'Gaia BH3')!.context, /Dormant/);
});

test('sizes scale linearly with mass and keep horizon, shadow and disk distinct', () => {
  const one = blackHoleSizes(1),
    ten = blackHoleSizes(10);
  for (const key of ['horizonKm', 'photonSphereKm', 'shadowKm', 'innerDiskKm'] as const)
    assert.ok(Math.abs(ten[key] / one[key] - 10) < 1e-12, key);
  assert.ok(one.horizonKm < one.photonSphereKm && one.photonSphereKm < one.shadowKm && one.shadowKm < one.innerDiskKm);
  assert.ok(Math.abs(one.shadowKm / one.horizonKm - 2.598076) < 1e-5);
  assert.equal(one.outerDiskKm, null, 'disk outer size is never derived from mass');
  assert.equal(blackHoleSizes(-3).horizonKm, 0);
  assert.equal(blackHoleSizes(Number.NaN).horizonKm, 0);
});

test('nearest example stays inside the same class', () => {
  assert.equal(nearestExample(30)!.name, 'Gaia BH3');
  assert.equal(nearestExample(5)!.name, 'Cygnus X-1');
  assert.equal(nearestExample(1_000)!.name, 'GW190521 remnant');
  assert.equal(nearestExample(1e6)!.name, 'Sagittarius A*');
  assert.equal(nearestExample(1e9)!.name, 'M87*');
});

test('formatting: masses, km and AU', () => {
  assert.equal(formatSolarMasses(5), '5 M☉');
  assert.equal(formatSolarMasses(1_000), '1,000 M☉');
  assert.equal(formatSolarMasses(4_000_000), '4 million M☉');
  assert.equal(formatSolarMasses(6_500_000_000), '6.5 billion M☉');
  assert.equal(formatLength(14.77), '15 km');
  assert.equal(formatLength(2_953), '2,953 km');
  assert.equal(formatLength(2.95325e9), '19.7 AU');
  const rows = presetRows();
  assert.equal(rows.length, 5);
  assert.equal(rows[3].horizon, '2,953,250 km');
  assert.equal(rows[0].horizon, '15 km');
  assert.match(rows[4].example, /M87\*/);
});

test('simulated black holes are labelled in model units, never solar or Earth masses', () => {
  assert.equal(modelMassLabel(600, '600'), '600 model units');
  assert.equal(modelMassLabel(Number.NaN, 'NaN'), '—');
  assert.match(readFileSync('src/physics/body-math.ts', 'utf8'), /b\.kind === 'blackhole' \? modelMassLabel/);
  const inspector = readFileSync('src/ui/inspector.ts', 'utf8');
  assert.equal((inspector.match(/massText\(b\)/g) ?? []).length, 2, 'info and menu readouts share the label');
  assert.match(readFileSync('src/bodies/registry.ts', 'utf8'), /\$\{massText\(b\)\} · Ø/, 'canvas label too');
  const template = readFileSync('src/ui/template.ts', 'utf8');
  assert.match(template, /id="scale-row"/);
  assert.match(template, /blackHoleScalesHtml\(\)/);
});

test('the reference catalog never feeds the solver', () => {
  for (const file of [
    'src/gravity-engine.ts',
    'src/physics/simulate.ts',
    'src/physics/collisions.ts',
    'src/celestial-catalog.ts',
  ])
    assert.ok(!readFileSync(file, 'utf8').includes('black-hole-catalog'), file);
});
