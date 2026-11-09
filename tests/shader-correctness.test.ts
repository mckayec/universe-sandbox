import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

// Source-level guards for GLSL fixes. These do not replace real shader compilation in a browser.
const diskFlow = readFileSync(new URL('../src/visuals/disk-flow.ts', import.meta.url), 'utf8');
const materials = readFileSync(new URL('../src/visuals/materials.ts', import.meta.url), 'utf8');
const effects = readFileSync(new URL('../src/visuals/effects.ts', import.meta.url), 'utf8');

test('disk vertex passes local XY instead of an interpolated polar angle', () => {
  assert.match(diskFlow, /varying vec2 vXY;/);
  assert.match(diskFlow, /vXY=position\.xy;/);
  assert.doesNotMatch(diskFlow, /varying float vA;/);
});

test('all three disk fragment shaders use the matching varying and compute the angle per fragment', () => {
  assert.equal(
    materials.match(/varying float vR;varying vec2 vXY;varying float vRad;varying float vBeam;/g)?.length,
    3,
  );
  assert.equal(materials.match(/diskFlow\(atan\(vXY\.y,vXY\.x\),/g)?.length, 3);
  assert.doesNotMatch(materials, /varying float vA;/);
});

test('no smoothstep call has reversed (undefined) edges', () => {
  for (const source of [diskFlow, materials]) {
    for (const match of source.matchAll(/smoothstep\(\s*(-?\d*\.?\d+)\s*,\s*(-?\d*\.?\d+)\s*,/g)) {
      assert.ok(Number(match[1]) < Number(match[2]), `reversed edges in ${match[0]}`);
    }
  }
});

test('angle seam: interpolating XY is continuous where interpolating atan is not', () => {
  const a = [Math.cos(3.1), Math.sin(3.1)],
    b = [Math.cos(-3.1), Math.sin(-3.1)];
  const mid = Math.atan2((a[1] + b[1]) / 2, (a[0] + b[0]) / 2);
  assert.ok(Math.abs(Math.abs(mid) - Math.PI) < 1e-9);
  assert.ok(Math.abs((3.1 + -3.1) / 2) < 1e-9); // the old interpolated angle jumped to the opposite side
});

test('stellar ignition no longer builds a geometric shell cage', () => {
  const start = effects.indexOf('export function stellarIgnitionEffect');
  const body = effects.slice(start, effects.indexOf('export function', start + 10));
  assert.doesNotMatch(body, /IcosahedronGeometry|wireframe/);
});
