import assert from 'node:assert/strict';
import test from 'node:test';
import {
  advanceTracers,
  circularSpeed,
  fieldAcceleration,
  haloFraction,
  type FieldSource,
  type Tracers,
} from '../src/galaxy-field.ts';
import { diskPlaneHeight, diskSpinFromOrbit, keplerConstant } from '../src/visuals/disk-flow.ts';

const core = (x = 0, z = 0): FieldSource => ({ x, z, gm: 10000, soft2: 324, haloGM: 9450, haloScale: 66 });
function tracers(n: number): Tracers {
  return { n, x: new Float32Array(n), z: new Float32Array(n), vx: new Float32Array(n), vz: new Float32Array(n) };
}
/** A ring of tracers on circular orbits around `source` (orbiting so atan2(z, x) decreases, like the galaxies). */
function ring(source: FieldSource, radius: number, n: number, vx = 0, vz = 0) {
  const t = tracers(n);
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2,
      x = source.x + Math.cos(a) * radius,
      z = source.z + Math.sin(a) * radius,
      v = circularSpeed([source], source.x, source.z, x, z);
    t.x[i] = x;
    t.z[i] = z;
    t.vx[i] = vx + Math.sin(a) * v;
    t.vz[i] = vz - Math.cos(a) * v;
  }
  return t;
}
const radiusOf = (t: Tracers, i: number, cx = 0, cz = 0) => Math.hypot(t.x[i] - cx, t.z[i] - cz);

test('halo fraction grows toward the whole halo', () => {
  assert.equal(haloFraction(0, 66), 0);
  assert.ok(haloFraction(66, 66) > 0.3 && haloFraction(66, 66) < 0.4);
  assert.ok(haloFraction(5000, 66) > 0.97);
});

test('a core pulls with the same softened law as the body gravity engine', () => {
  const out: [number, number] = [0, 0],
    source = { ...core(), haloGM: 0 };
  fieldAcceleration([source], 40, 0, out);
  // G·M / (r² + softening) toward the core.
  assert.ok(Math.abs(out[0] + 10000 / (1600 + 324)) < 1e-6);
  assert.ok(Math.abs(out[1]) < 1e-9);
});

test('an undisturbed galaxy keeps its stars on circular orbits', () => {
  const source = core();
  for (const radius of [30, 90, 170]) {
    const t = ring(source, radius, 24);
    for (let s = 0; s < 600; s++) advanceTracers(t, [source], 1 / 30, 1);
    for (let i = 0; i < t.n; i++) assert.ok(Math.abs(radiusOf(t, i) - radius) < radius * 0.03, `r=${radius}`);
  }
});

test('stride updates only the chosen subset', () => {
  const source = core(),
    t = ring(source, 80, 10),
    before = Float32Array.from(t.x);
  advanceTracers(t, [source], 0.5, 4, undefined, 1, 2);
  for (let i = 0; i < t.n; i++) assert.equal(t.x[i] === before[i], i % 2 === 0);
});

test('a passing galaxy tears tidal tails out of a disk', () => {
  const home = core(),
    disk = ring(home, 150, 400);
  // A second galaxy flies past on a prograde path 230 units away.
  let px = -900,
    pz = -230;
  const vx = 14;
  for (let s = 0; s < 1800; s++) {
    const intruder = core(px, pz);
    advanceTracers(disk, [home, intruder], 1 / 30, 1);
    px += vx / 30;
  }
  let flung = 0;
  for (let i = 0; i < disk.n; i++) if (radiusOf(disk, i) > 150 * 1.6) flung++;
  assert.ok(flung > disk.n * 0.1, `only ${flung} of ${disk.n} stars were pulled into tails`);
});

test('friction slows the bound core of a galaxy but not stars far out in its tails', () => {
  const source = core(),
    t = tracers(2);
  t.x[0] = 5;
  t.x[1] = 600;
  const friction = { ax: -1, az: 0, cx: 0, cz: 0, radius: 90 };
  advanceTracers(t, [{ ...source, gm: 0, haloGM: 0 }], 1, 1, friction);
  assert.ok(t.vx[0] < -0.9);
  assert.ok(t.vx[1] > -0.01);
});

test('disk orbit sense follows the infalling gas', () => {
  // Gas at +x moving toward −z orbits so atan2(z, x) decreases: angular momentum about +Y is positive.
  assert.equal(diskSpinFromOrbit(10, 0, 0, -3), -1);
  assert.equal(diskSpinFromOrbit(10, 0, 0, 3), 1);
  assert.ok(Math.abs(keplerConstant(2, 3) - 3 * Math.pow(2, 1.5)) < 1e-9);
  // A disk tilted by π/2 about X lies flat in XZ.
  assert.ok(Math.abs(diskPlaneHeight(Math.PI / 2, 4)) < 1e-9);
});
