// Item 7b: per-body black-hole reference scale, scene-wide unit mapping, persistence and merger treatment.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { BLACK_HOLE_PRESETS, GM_SUN, SCHWARZSCHILD_KM_PER_SOLAR_MASS } from '../src/black-hole-catalog.ts';
import {
  describeReference,
  gravitationalParameterSim,
  mergeReferences,
  referenceForPreset,
  referencePickerValue,
  referenceSolarMasses,
  sanitizeReference,
  SCENE_UNIT_MAPPING,
  solarMuSim,
} from '../src/black-hole-reference.ts';

const close = (a: number, b: number, rel = 1e-12) => assert.ok(Math.abs(a - b) <= rel * Math.abs(b), `${a} vs ${b}`);

test('a preset reads the current model mass as that preset, for every preset', () => {
  for (const preset of BLACK_HOLE_PRESETS) {
    const ref = referenceForPreset(preset.id, 600)!;
    assert.equal(ref.origin, preset.id);
    close(referenceSolarMasses(600, ref), preset.solarMasses);
  }
  assert.equal(referenceForPreset('none', 600), undefined);
  assert.equal(referenceForPreset('unknown', 600), undefined);
  assert.equal(referenceForPreset('large-stellar', 0), undefined);
  assert.equal(referenceForPreset('large-stellar', Number.NaN), undefined);
});

test('the factor is fixed, so referenced mass and horizon grow linearly with model mass', () => {
  const ref = referenceForPreset('large-stellar', 600)!;
  close(referenceSolarMasses(1200, ref), 60);
  close(referenceSolarMasses(900, ref), 45);
  const horizon = (m: number) =>
    Number(
      describeReference(m, ref)
        .match(/horizon radius ([\d,.]+) km/)![1]
        .replace(/,/g, ''),
    );
  // 30 M☉ → 88.6 km; 60 M☉ → 177 km (rounded display).
  assert.equal(horizon(600), Math.round(30 * SCHWARZSCHILD_KM_PER_SOLAR_MASS));
  assert.equal(horizon(1200), Math.round(60 * SCHWARZSCHILD_KM_PER_SOLAR_MASS));
});

test('mergers: referenced masses add; unreferenced mass is read at the remaining factor; none stays none', () => {
  const a = referenceForPreset('large-stellar', 600)!, // 30 M☉
    b = referenceForPreset('small-stellar', 200)!; // 5 M☉
  const both = mergeReferences(600, a, 200, b)!;
  assert.equal(both.origin, 'merged');
  close(referenceSolarMasses(800, both), 35);
  const eaterOnly = mergeReferences(600, a, 300, undefined)!;
  assert.equal(eaterOnly.origin, 'large-stellar');
  close(referenceSolarMasses(900, eaterOnly), 45);
  assert.notEqual(eaterOnly, a, 'a copy, not the same record');
  const foodOnly = mergeReferences(600, undefined, 200, b)!;
  assert.equal(foodOnly.origin, 'merged');
  close(referenceSolarMasses(800, foodOnly), 20);
  assert.equal(mergeReferences(600, undefined, 200, undefined), undefined);
});

test('saved references are sanitized: black holes only, finite positive factor, known origin', () => {
  const good = { origin: 'galactic-core', solarMassPerModelUnit: 5000 };
  assert.deepEqual(sanitizeReference(good, 'blackhole'), good);
  assert.deepEqual(sanitizeReference({ origin: 'merged', solarMassPerModelUnit: 2 }, 'blackhole'), {
    origin: 'merged',
    solarMassPerModelUnit: 2,
  });
  assert.equal(sanitizeReference(good, 'star'), undefined);
  assert.equal(sanitizeReference(undefined, 'blackhole'), undefined, 'older saves have none');
  assert.equal(sanitizeReference(null, 'blackhole'), undefined);
  assert.equal(sanitizeReference([], 'blackhole'), undefined);
  assert.equal(sanitizeReference({ origin: 'galactic-core', solarMassPerModelUnit: -1 }, 'blackhole'), undefined);
  assert.equal(sanitizeReference({ origin: 'galactic-core', solarMassPerModelUnit: Infinity }, 'blackhole'), undefined);
  assert.equal(sanitizeReference({ origin: 'bogus', solarMassPerModelUnit: 1 }, 'blackhole'), undefined);
});

test('picker value and description', () => {
  assert.equal(referencePickerValue(undefined), 'none');
  assert.equal(referencePickerValue({ origin: 'merged', solarMassPerModelUnit: 1 }), 'merged');
  assert.equal(describeReference(600, undefined), 'None · model units only');
  const text = describeReference(600, referenceForPreset('galactic-core', 600));
  assert.match(text, /≈ 1 million M☉ · Supermassive · horizon radius .* \(not drawn to scale\)/);
});

test('scene-wide mapping mu_sim = mu_SI · T0² / L0³ is documented and not used by the solver', () => {
  close(gravitationalParameterSim(GM_SUN, 1, 1), GM_SUN);
  // With L0 = 1 AU and T0 = 1 year / 2π, the solar parameter is ≈ 1 (Gaussian units).
  const au = 1.495978707e11,
    year = 365.25 * 86400;
  close(solarMuSim(year / (2 * Math.PI), au), 1, 1e-3);
  assert.match(SCENE_UNIT_MAPPING.gravity, /mu_sim = mu_SI · T0² \/ L0³/);
  assert.match(SCENE_UNIT_MAPPING.length, /never drawn to scale/);
  for (const file of ['src/gravity-engine.ts', 'src/physics/simulate.ts', 'src/celestial-catalog.ts'])
    assert.ok(!readFileSync(file, 'utf8').includes('black-hole-reference'), file);
});

test('the reference never changes mass, velocity, radius, contacts or picking', () => {
  const source = readFileSync('src/black-hole-reference.ts', 'utf8');
  assert.doesNotMatch(source, /\.(mass|radius|velocity|mesh)\s*[+*-]?=/);
  // Collisions only rewrite the reference record; the contact test and display radius do not read it.
  const collisions = readFileSync('src/physics/collisions.ts', 'utf8');
  assert.equal((collisions.match(/bhReference/g) ?? []).length, 3);
  assert.match(collisions, /a\.bhReference = mergeReferences\(\s*receiverMass,\s*a\.bhReference,\s*b\.mass,/);
  for (const file of ['src/visuals/update-visuals.ts', 'src/ui/pointer.ts', 'src/physics/simulate.ts'])
    assert.ok(!readFileSync(file, 'utf8').includes('bhReference'), file);
  const registry = readFileSync('src/bodies/registry.ts', 'utf8')
    .split('\n')
    .filter(line => line.includes('bhReference'));
  assert.deepEqual(
    registry.map(line => line.trim()),
    ["bhReference: kind === 'blackhole' ? o.bhReference : undefined,"],
  );
});

test('persistence wiring: snapshot copies the record, restore sanitizes it, transform clears it', () => {
  const history = readFileSync('src/state/history.ts', 'utf8');
  assert.match(history, /bhReference: body\.bhReference \? \{ \.\.\.body\.bhReference \} : undefined/);
  assert.match(history, /bhReference: sanitizeReference\(saved\.bhReference, saved\.kind\)/);
  assert.match(
    readFileSync('src/bodies/lifecycle.ts', 'utf8'),
    /if \(kind !== 'blackhole'\) b\.bhReference = undefined/,
  );
  assert.match(
    readFileSync('src/sandbox-state.ts', 'utf8'),
    /bhReference\?: \{ origin: string; solarMassPerModelUnit: number \}/,
  );
});

test('inspector row: picker with none + 5 presets + hidden merged; undoable change', async () => {
  const { blackHoleReferenceRowHtml } = await import('../src/ui/black-hole-scales.ts');
  const html = blackHoleReferenceRowHtml(),
    options = html.match(/<option value="([^"]+)"/g)!.map(o => o.slice(15, -1));
  assert.deepEqual(options, ['none', ...BLACK_HOLE_PRESETS.map(p => p.id), 'merged']);
  assert.match(html, /<option value="merged" disabled hidden>/);
  assert.match(html, /<label for="bh-reference">/);
  const inspector = readFileSync('src/ui/inspector.ts', 'utf8');
  assert.match(inspector, /export function setBlackHoleReference[\s\S]*?recordHistory\(\);[\s\S]*?referenceForPreset/);
  assert.match(readFileSync('src/ui/template.ts', 'utf8'), /blackHoleReferenceRowHtml\(\)/);
});
