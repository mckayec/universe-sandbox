import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import vm from 'node:vm';

// Checkpoint 60: the next bounded semantic tranche (HANDOFF_PLAN 2026-11-04, "Next bounded semantic tranche: 20 of
// the 116 residual records, full primary reading"). Views, the BC14 enrichment and recorded decisions.
const ctx: { window: Record<string, any> } = { window: {} };
vm.runInNewContext(readFileSync(new URL('../public/atlas/layers.js', import.meta.url), 'utf8'), ctx);
vm.runInNewContext(readFileSync(new URL('../public/atlas/packs/lds-standard-works.js', import.meta.url), 'utf8'), ctx);
const P = ctx.window.ATLAS_PACKS['lds-standard-works'];
const plain = (v: unknown) => (v === undefined ? v : JSON.parse(JSON.stringify(v)));
const all = P.codex.flatMap((t: any) => t.list);
const byKey = new Map<string, any>(all.filter((x: any) => x.key).map((x: any) => [x.key, x]));
const dir = '../docs/universes/packs/lds-standard-works/';
const read = (f: string) => readFileSync(new URL(dir + f, import.meta.url), 'utf8');
const seeOf = (key: string) => plain((byKey.get(key).see || []).map((s: any) => s.k));
const srcOf = (key: string) => plain(byKey.get(key).src.map((s: any) => s.t));
const d = (k: string) => byKey.get(k).desc as string;

// [view key, its sources in order, its See-also targets]
const VIEWS: [string, string[], string[]][] = [
  ['BMV-068-jerusalem-thanksgiving-benjamin', ['Mosiah 2:3–4, 34'], ['OTM-jerusalem']],
  ['BMV-076-jerusalem-tradition-zeniff-reports', ['Mosiah 10:12–16'], ['OTM-jerusalem']],
  ['BMV-084-abinadi-words-taught-by-alma', ['Mosiah 18:1–2'], []],
  ['BMV-106-nephite-reckoning-jews-jerusalem', ['Alma 11:4'], ['OTM-jerusalem']],
  ['BMV-135-resurrection-ascension-alma-opinion', ['Alma 40:16–21'], []],
  ['BMV-149-zoram-jerusalem-ammoron-claim', ['Alma 54:23'], ['OTM-jerusalem']],
  ['BMV-155-inward-vessel-compare-matthew-23', ['Alma 60:23–24', 'Matthew 23:25–26'], []],
  ['BMV-165-first-nephi-departure-recalled', ['Helaman 7:7'], ['OTM-jerusalem']],
  ['BMV-183-voice-creation-life-laid-down', ['3 Nephi 9:15–22'], []],
  ['BMV-216-nimrod-valley-named', ['Ether 2:1', 'Genesis 10:8–9'], []],
  ['BMV-217-fall-divine-image-spirit-body', ['Ether 3:2, 9, 13–18'], ['OHC-CREATION']],
];

test('Checkpoint 60: tranche views carry exact locators, 3/bom gates and one-way earlier-work targets', () => {
  for (const [key, src, see] of VIEWS) {
    const v = byKey.get(key);
    assert.ok(v, key);
    assert.deepEqual(plain(v.books), [3], key);
    assert.deepEqual(plain(v.layers), ['bom'], key);
    assert.deepEqual(srcOf(key), src, key);
    assert.deepEqual(seeOf(key), see, key);
    for (const f of ['when', 'lat', 'lon', 'route', 'year']) assert.equal(v[f], undefined, `${key} ${f}`);
    for (const k of see) assert.ok(byKey.get(k).books[0] < 3, `${key} -> ${k}`);
    for (const k of see) assert.ok(!seeOf(k).includes(key), `${k} -> ${key}`);
    for (const s of v.src) assert.ok(!/dc-testament|\/pgp\//.test(s.u), key);
  }
  assert.match(byKey.get('BMV-216-nimrod-valley-named').src[1].u, /ot\/gen\/10\?lang=eng$/);
  assert.match(byKey.get('BMV-155-inward-vessel-compare-matthew-23').src[1].u, /nt\/matt\/23\?lang=eng$/);
});

test('Checkpoint 60: speaker, scene and claim distinctions are visible in the copy', () => {
  assert.match(
    d('BMV-068-jerusalem-thanksgiving-benjamin'),
    /narrator’s description and Benjamin’s words are kept distinct/,
  );
  assert.match(d('BMV-068-jerusalem-thanksgiving-benjamin'), /sacrifice is a practice, not a link to Moses/);
  assert.match(
    d('BMV-076-jerusalem-tradition-zeniff-reports'),
    /Zeniff’s report of another people’s tradition, not an independently verified history/,
  );
  assert.match(d('BMV-084-abinadi-words-taught-by-alma'), /not an eyewitness recollection/);
  assert.match(
    d('BMV-084-abinadi-words-taught-by-alma'),
    /distinct from the later Alma’s counsel to Corianton in Alma 40/,
  );
  assert.match(d('BMV-106-nephite-reckoning-jews-jerusalem'), /not presented as minted coins, no modern conversion/);
  assert.match(d('BMV-135-resurrection-ascension-alma-opinion'), /gives it as his opinion/);
  assert.match(
    d('BMV-135-resurrection-ascension-alma-opinion'),
    /does not say whether it is at his resurrection or after/,
  );
  assert.match(
    d('BMV-149-zoram-jerusalem-ammoron-claim'),
    /Ammoron’s claims in a hostile letter, not established fact/,
  );
  assert.match(
    d('BMV-155-inward-vessel-compare-matthew-23'),
    /neither a quotation from Matthew nor a shared Gospel scene/,
  );
  assert.match(d('BMV-165-first-nephi-departure-recalled'), /The speaker is the later Nephi/);
  assert.match(
    d('BMV-183-voice-creation-life-laid-down'),
    /kept distinct from the bodily appearance at Bountiful in 3 Nephi 11/,
  );
  assert.match(d('BMV-183-voice-creation-life-laid-down'), /not a quoted crucifixion account/);
  assert.match(
    d('BMV-216-nimrod-valley-named'),
    /not identified with Shinar or Babel, Nimrod is not said to have built the tower/,
  );
  const ether3 = d('BMV-217-fall-divine-image-spirit-body');
  assert.match(ether3, /Adam is not named/);
  assert.ok(!/Mahonri|Moriancumer/.test(ether3));
  // BXC01 keeps its visible law-fulfilled coverage
  assert.match(d('BXC01'), /law of Moses fulfilled/);
});

test('Checkpoint 60: BC14 carries Moroni 9:25 without a new citation; decisions recorded; ledger at 96', () => {
  assert.deepEqual(srcOf('BC14'), ['Moroni 9:1–6,7–19,25–26']);
  assert.match(d('BC14'), /^Book of Mormon — Mormon reports severe violence/);
  assert.match(d('BC14'), /the showing of his body unto their fathers/);
  assert.match(d('BC14'), /not a Gospel appearance/);
  const views = read('bmc-source-views.csv');
  for (const [n, cue] of [
    ['238', 'BC14'],
    ['070', 'fall of Adam'],
    ['071', '1 Corinthians 15:58'],
    ['091', 'BMV-166'],
    ['092', 'Matthew 7:23'],
    ['127', 'Luke 8:4–15'],
    ['132', 'Numbers 21:4–9'],
    ['134', 'Alma 39:15–19'],
    ['170', 'John 5:28–29'],
  ])
    assert.match(views, new RegExp(`^BMC-${n},[^\\n]*,omitted,"?checkpoint 60 decision[^\\n]*${cue}`, 'm'), n);
  const sem = read('bmc-semantic-dispositions.csv');
  const rollup = read('bmc-omission-rollup.csv');
  const keys = [...VIEWS.map(v => v[0].slice(4, 7)), '238', '070', '071', '091', '092', '127', '132', '134', '170'];
  assert.equal(keys.length, 20);
  for (const n of keys) {
    assert.ok(!sem.includes(`BMC-${n},`), n);
    assert.ok(!rollup.includes(`BMC-${n},`), n);
  }
  assert.equal(sem.trim().split('\n').length - 1, 96);
  // the two 3 Nephi 11 Matthew reader leads stay open
  const reader = read('bmc-textscan.csv')
    .trim()
    .split('\n')
    .filter(r => r.includes(',reader,'));
  assert.equal(reader.length, 2);
  assert.ok(reader.every(r => r.startsWith('BMC-185,')));
});
