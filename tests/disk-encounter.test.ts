import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import {
  QUIET_ENCOUNTER,
  TRUNCATION_FRACTION,
  describeEncounter,
  diskEncounter,
  relaxEncounter,
  rocheLobeFraction,
  strongestEncounter,
} from '../src/disk-encounter.ts';

const OUTER = 10;

test('Eggleton Roche-lobe fraction matches reference values', () => {
  assert.ok(Math.abs(rocheLobeFraction(1, 1) - 0.3789) < 1e-3);
  // Heavier host keeps a larger lobe; lighter host a smaller one.
  assert.ok(rocheLobeFraction(10, 1) > rocheLobeFraction(1, 1));
  assert.ok(rocheLobeFraction(1, 10) < rocheLobeFraction(1, 1));
  assert.equal(rocheLobeFraction(0, 1), 1);
});

test('distant companions leave the disk undisturbed', () => {
  const far = diskEncounter({ x: 200, y: 0, z: 0 }, OUTER, 1, 1);
  assert.deepEqual(far, QUIET_ENCOUNTER);
});

test('equal-mass close companion truncates the outer disk toward the computed radius', () => {
  const separation = 14,
    e = diskEncounter({ x: 0, y: separation, z: 0 }, OUTER, 1, 1),
    expected = (TRUNCATION_FRACTION * rocheLobeFraction(1, 1) * separation) / OUTER;
  assert.ok(e.strength > 0.9);
  assert.ok(Math.abs(e.cut - expected) < 1e-9);
  assert.ok(Math.abs(e.angle - Math.PI / 2) < 1e-9);
});

test('strength rises monotonically as the companion closes in', () => {
  let previous = -1;
  for (const d of [120, 80, 50, 40, 32, 26, 20, 14]) {
    const s = diskEncounter({ x: d, y: 0, z: 0 }, OUTER, 1, 1).strength;
    assert.ok(s >= previous, `strength fell at separation ${d}`);
    previous = s;
  }
  assert.ok(previous > 0.9);
});

test('unequal masses: a heavier companion disturbs more than a lighter one at the same distance', () => {
  const heavy = diskEncounter({ x: 30, y: 0, z: 0 }, OUTER, 1, 5),
    light = diskEncounter({ x: 30, y: 0, z: 0 }, OUTER, 1, 0.2);
  assert.ok(heavy.strength > light.strength);
  assert.ok(heavy.cut < light.cut);
});

test('out-of-plane companions use full 3D separation', () => {
  const inPlane = diskEncounter({ x: 25, y: 0, z: 0 }, OUTER, 1, 1),
    above = diskEncounter({ x: 25, y: 0, z: 25 }, OUTER, 1, 1);
  assert.ok(above.strength < inPlane.strength);
});

test('cut is bounded and invalid inputs are quiet', () => {
  const touching = diskEncounter({ x: 0.1, y: 0, z: 0 }, OUTER, 1, 100);
  assert.ok(touching.cut >= 0.25 && touching.cut <= 1);
  assert.deepEqual(diskEncounter({ x: 0, y: 0, z: 0 }, OUTER, 1, 1), QUIET_ENCOUNTER);
  assert.deepEqual(diskEncounter({ x: NaN, y: 0, z: 0 }, OUTER, 1, 1), QUIET_ENCOUNTER);
  assert.deepEqual(diskEncounter({ x: 5, y: 0, z: 0 }, OUTER, 1, 0), QUIET_ENCOUNTER);
});

test('strongestEncounter picks the deepest cut', () => {
  const a = diskEncounter({ x: 40, y: 0, z: 0 }, OUTER, 1, 1),
    b = diskEncounter({ x: 20, y: 0, z: 0 }, OUTER, 1, 1);
  assert.equal(strongestEncounter([a, QUIET_ENCOUNTER, b]), b);
  assert.equal(strongestEncounter([]), QUIET_ENCOUNTER);
});

test('relaxation is timestep-aware, bounded and never overshoots', () => {
  const target = diskEncounter({ x: 15, y: 0, z: 0 }, OUTER, 1, 1);
  let state = { ...QUIET_ENCOUNTER };
  const big = relaxEncounter(state, target, 1000);
  assert.ok(big.strength <= target.strength + 1e-9 && big.cut >= target.cut - 1e-9);
  // Many small steps and one equivalent large step land close together.
  for (let i = 0; i < 100; i++) state = relaxEncounter(state, target, 0.01);
  const once = relaxEncounter({ ...QUIET_ENCOUNTER }, target, 1);
  assert.ok(Math.abs(state.strength - once.strength) < 1e-6);
  assert.deepEqual(relaxEncounter(state, target, 0), state);
  assert.deepEqual(relaxEncounter(state, target, NaN), state);
});

test('recovery after the companion leaves is slower than stripping', () => {
  const target = diskEncounter({ x: 15, y: 0, z: 0 }, OUTER, 1, 1),
    strip = relaxEncounter({ ...QUIET_ENCOUNTER }, target, 0.5),
    recover = relaxEncounter(target, QUIET_ENCOUNTER, 0.5);
  assert.ok(strip.strength > target.strength - recover.strength);
  // Fully recovers eventually.
  let state = target;
  for (let i = 0; i < 400; i++) state = relaxEncounter(state, QUIET_ENCOUNTER, 0.1);
  assert.equal(state.strength, 0);
});

test('angle follows the companion across the -pi/+pi seam along the short arc', () => {
  const start = { strength: 1, cut: 0.5, angle: Math.PI - 0.05 },
    target = { strength: 1, cut: 0.5, angle: -Math.PI + 0.05 },
    next = relaxEncounter(start, target, 0.1);
  assert.ok(next.angle > start.angle, 'should move forward through pi, not back through 0');
});

test('inspector wording is labelled as an estimate and hidden when quiet', () => {
  assert.equal(describeEncounter(QUIET_ENCOUNTER), null);
  const text = describeEncounter({ strength: 0.8, cut: 0.42, angle: 0 }, 'Companion');
  assert.match(text ?? '', /Strongly truncated by Companion: outer gas cut to 42% \(tidal estimate\)/);
});

test('black-hole disk shader declares and applies the tide uniforms', () => {
  const flow = readFileSync(new URL('../src/visuals/disk-flow.ts', import.meta.url), 'utf8'),
    materials = readFileSync(new URL('../src/visuals/materials.ts', import.meta.url), 'utf8');
  assert.match(flow, /uniform float tideCut;uniform float tideAngle;uniform float tideAmp;/);
  assert.match(materials, /\$\{DISK_TIDE_GLSL\}/);
  assert.match(materials, /tideCut: \{ value: 1e5 \}/);
  assert.match(materials, /\*tide\.x;/);
});
