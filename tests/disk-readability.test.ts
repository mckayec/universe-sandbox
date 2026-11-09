import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import {
  DISK_FLOW_GLSL,
  READABLE_MIN_OMEGA,
  diskPatternOmega,
  diskPatternPeriod,
  keplerConstant,
} from '../src/visuals/disk-flow.ts';

// Disk geometries as built in src/visuals/create-visual.ts and src/physics/matter-streams.ts (local units, R = body
// radius; black-hole disks scale by variant 0.84–1.32).
const R = 1;
const bhInner = 0.86 * R,
  bhKepler = keplerConstant(bhInner, 2.6);
const DISKS = [0.84, 1, 1.14, 1.32].flatMap(scale => [
  { name: `black hole hot ×${scale}`, kepler: bhKepler, inner: bhInner, outer: 4.9 * R * scale },
  { name: `black hole mid ×${scale}`, kepler: bhKepler, inner: 1.35 * R, outer: 7.4 * R * scale },
  { name: `black hole dust ×${scale}`, kepler: bhKepler, inner: 2.45 * R, outer: 11.8 * R * scale },
]);
DISKS.push(
  { name: 'protostar', kepler: keplerConstant(1.32, 1.8), inner: 1.32, outer: 5.1 },
  { name: 'transfer inner', kepler: keplerConstant(0.75, 2.4), inner: 0.75, outer: 3.55 },
  { name: 'transfer outer', kepler: keplerConstant(0.75, 2.4), inner: 2.1, outer: 4.75 },
);

const keplerOnlyPeriod = (kepler: number, rad: number) => (2 * Math.PI) / (kepler * Math.pow(rad, -1.5));

test('before the floor, the slowest outer edge took about 186 visual seconds (the reported problem)', () => {
  const slowest = Math.max(...DISKS.map(d => keplerOnlyPeriod(d.kepler, d.outer)));
  assert.ok(slowest > 180 && slowest < 190, String(slowest));
});

test('every disk outer edge now turns within 30 visual seconds at 1x', () => {
  for (const d of DISKS) {
    const period = diskPatternPeriod(d.kepler, d.outer);
    assert.ok(period <= 30, `${d.name}: ${period.toFixed(1)} s`);
  }
});

test('the floor keeps Keplerian shear: inner gas still outpaces outer gas by the same amount', () => {
  for (const d of DISKS) {
    const shearBefore = d.kepler * (Math.pow(d.inner, -1.5) - Math.pow(d.outer, -1.5)),
      shearAfter = diskPatternOmega(d.kepler, d.inner) - diskPatternOmega(d.kepler, d.outer);
    assert.ok(Math.abs(shearAfter - shearBefore) < 1e-12, d.name);
    assert.ok(diskPatternOmega(d.kepler, d.inner) > diskPatternOmega(d.kepler, d.outer), d.name);
  }
});

test('the innermost edge of each disk speeds up by at most 11%, so the bright inner flow looks the same', () => {
  for (const d of DISKS.filter(x => /hot|protostar|transfer inner/.test(x.name))) {
    const base = d.kepler * Math.pow(d.inner, -1.5);
    assert.ok(diskPatternOmega(d.kepler, d.inner) / base <= 1.11, d.name);
  }
});

test('the shader uses the same floor as the TypeScript helper', () => {
  assert.match(DISK_FLOW_GLSL, new RegExp(`pow\\(max\\(rad,\\.05\\),-1\\.5\\)\\+${READABLE_MIN_OMEGA.toFixed(6)};`));
});

test('transfer disks carry tide uniforms and apply the shared tide shape', () => {
  const src = readFileSync(new URL('../src/visuals/materials.ts', import.meta.url), 'utf8'),
    transfer = src.slice(src.indexOf('export function transferDiskMaterial'), src.indexOf('export function addGlow'));
  for (const u of ['tideCut', 'tideAngle', 'tideAmp']) assert.match(transfer, new RegExp(`${u}: \\{ value`));
  assert.match(transfer, /\$\{DISK_TIDE_GLSL\}/);
  assert.match(transfer, /tideShape\(atan\(vXY\.y,vXY\.x\),vRad\)/);
  assert.match(transfer, /\*tide\.x;/);
});

test('matter streams drive the transfer-disk tide from the donor, skipping black holes that keep their own disk', () => {
  const src = readFileSync(new URL('../src/physics/matter-streams.ts', import.meta.url), 'utf8');
  assert.match(src, /if \(!ownDisk\) updateTransferDiskTide\(stream, receiver, donor, diskDt > 0 \? diskDt : dt\);/);
});

test('the inspector shows a transfer-disk tide for fed stars, and the test probe is opt-in only', () => {
  const inspector = readFileSync(new URL('../src/ui/inspector.ts', import.meta.url), 'utf8');
  assert.match(inspector, /s\.receiverId === b\.id && s\.outerDisk\.visible && transferDiskEncounterOf\(s\)/);
  const probe = readFileSync(new URL('../src/ui/test-probe.ts', import.meta.url), 'utf8');
  assert.match(probe, /get\('probe'\) !== '1'\) return;/);
  assert.doesNotMatch(probe, /app\.\w+ =|bodies\.(push|splice)/);
});

test('a nebula donor feeds a transfer disk without truncating it', () => {
  const runtime = readFileSync(new URL('../src/visuals/disk-encounters.ts', import.meta.url), 'utf8');
  assert.match(runtime, /donor\.kind === 'nebula' \|\| donor\.debris\s+\? \{ \.\.\.QUIET_ENCOUNTER \}/);
});
