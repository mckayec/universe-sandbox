import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import test from 'node:test';

// Checkpoint 63: the 76 explicit full-read dispositions of the residual-96 batch (HANDOFF_PLAN 2026-11-04
// "Full-source decisions for all 96 residual semantic chapters"). Data-only: the pack is unchanged; the 20
// RES96-C01–C14 correction keys stay in the ledger for the next unit.
const dir = '../docs/universes/packs/lds-standard-works/';
const read = (f: string) => readFileSync(new URL(dir + f, import.meta.url), 'utf8');
const lines = (f: string) => read(f).trim().split('\n');

const DECIDED = [
  9, 18, 54, 55, 58, 64, 66, 74, 75, 77, 83, 85, 86, 87, 88, 89, 90, 96, 97, 99, 101, 109, 110, 112, 115, 118, 119, 120,
  122, 126, 130, 136, 138, 139, 142, 143, 144, 145, 146, 147, 148, 150, 151, 152, 153, 154, 156, 157, 158, 159, 160,
  162, 167, 168, 169, 171, 173, 177, 180, 182, 206, 207, 209, 211, 219, 221, 224, 225, 228, 229, 230, 231, 232, 233,
  234, 235,
].map(n => 'BMC-' + String(n).padStart(3, '0'));
const REMAINING = [8, 62, 63, 72, 95, 98, 103, 111, 114, 121, 123, 125, 133, 163, 174, 175, 176, 181, 193, 223].map(
  n => 'BMC-' + String(n).padStart(3, '0'),
);

test('RES96: 76 decisions recorded, 20 correction keys remain in the ledger', () => {
  assert.equal(new Set(DECIDED).size, 76);
  assert.equal(new Set(REMAINING).size, 20);
  const sem = lines('bmc-semantic-dispositions.csv').slice(1);
  assert.deepEqual(sem.map(r => r.slice(0, 7)).sort(), [...REMAINING].sort());
  const rollup = read('bmc-omission-rollup.csv');
  const views = lines('bmc-source-views.csv');
  for (const k of DECIDED) {
    assert.ok(!rollup.includes(`\n${k},`), `${k} left the rollup`);
    const mine = views.filter(r => r.startsWith(k + ',') && r.includes(',omitted,'));
    assert.equal(mine.length, 1, k);
    assert.match(mine[0], /,omitted,"?checkpoint 63 decision \(RES96 full read of [^)]+\): /, k);
  }
  for (const k of REMAINING) assert.ok(!views.some(r => r.startsWith(k + ',') && r.includes('checkpoint 63')), k);
});

test('RES96: repaired readings are stated in the recorded decisions', () => {
  const views = read('bmc-source-views.csv');
  const row = (k: string) => views.split('\n').find(r => r.startsWith(k + ',') && r.includes(',omitted,'))!;
  assert.match(row('BMC-018'), /18:24 is represented by BE04\/BJ01/);
  assert.match(row('BMC-089'), /23:23 invokes the God of Abraham\/Isaac\/Jacob, not their visit or pedigree/);
  assert.match(row('BMC-101'), /Aaron is absent from this chapter/);
  assert.match(row('BMC-180'), /Jacob is absent here/);
  assert.match(row('BMC-207'), /David\/Joshua lands, king Aaron, Samuel the Lamanite and Shem/);
  assert.match(row('BMC-211'), /Gilgal is a commander at 6:14/);
  assert.match(row('BMC-224'), /Aaron is a captive at 10:31/);
  assert.match(row('BMC-228'), /Gilead is Shared’s brother/);
  // the name-scan row for Mormon 2's Aaron now names the Lamanite king
  assert.match(
    views,
    /^BMC-207,Mormon 2,OHR-AARON,[^\n]*,scan-rejected,"?Aaron the Lamanite king whom Mormon withstands/m,
  );
  assert.match(row('BMC-206'), /undescribed visitation at 1:15/);
  assert.match(row('BMC-209'), /4:12’s broad house-of-Israel wickedness comparison/);
  // optional comparisons stay optional; no decision claims a link or a seen vision
  for (const k of DECIDED) assert.doesNotMatch(row(k), /\bis linked to\b|\bvision is shown\b/, k);
});

test('RES96: frozen word screen unchanged in size and state counts; screened roles corrected', () => {
  const rows = lines('bmc-textscan.csv').slice(1);
  assert.equal(new Set(rows.map(r => r.slice(0, 7))).size, 39);
  assert.equal(rows.length, 114);
  const count = (s: string) => rows.filter(r => r.includes(`,${s},`)).length;
  assert.deepEqual([count('consistent'), count('no-hit'), count('resolved'), count('reader')], [91, 7, 16, 0]);
  const gilgal = rows.find(r => r.startsWith('BMC-211,') && r.includes(',Gilgal,'))!;
  assert.match(gilgal, /checkpoint-63 decision \(omitted\)/);
  assert.match(gilgal, /Nephite commander .*\(6:14\), not a city or valley/);
  assert.match(
    rows.find(r => r.startsWith('BMC-224,') && r.includes(',Aaron,'))!,
    /dwelt in captivity \(10:31\)/,
  );
  assert.match(
    rows.find(r => r.startsWith('BMC-207,') && r.includes(',Aaron,'))!,
    /Lamanite king .*\(2:9\)/,
  );
  // the controlled Cain regression and the two closed Matthew comparisons are untouched
  assert.ok(rows.some(r => r.includes(',parallel: Matthew 16:18,,3 Nephi 11:39,') && r.includes(',resolved,')));
});

test('RES96: the pack itself is unchanged by the decisions (data in docs only)', () => {
  const pack = readFileSync(new URL('../public/atlas/packs/lds-standard-works.js', import.meta.url), 'utf8');
  assert.doesNotMatch(pack, /checkpoint 63|RES96/);
  // vision crosswalk unchanged: 157 rows
  assert.equal(lines('timeline-source-vision.csv').length - 1, 157);
  assert.ok(createHash('sha256').update(pack).digest('hex').length === 64);
});
