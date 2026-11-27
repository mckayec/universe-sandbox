import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import vm from 'node:vm';

// Checkpoint 64: RES96-C01–C14, the coherent corrections for the last 20 residual chapter keys (HANDOFF_PLAN
// 2026-11-04 "Full-source decisions for all 96 residual semantic chapters"). Sixteen 3/bom source views and five
// consolidations; vision classes are set from the cited source, not from the card titles.
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
const J = ['OTM-jerusalem'];

// [view key, its sources in order, its See-also targets]
const VIEWS: [string, string[], string[]][] = [
  ['BMV-125-choose-whom-serve-scripture', ['Alma 30:7–9', 'Joshua 24:15'], ['OHR-JOSHUA-NUN']],
  ['BMV-125-korihor-reported-appearance', ['Alma 30:53'], []],
  ['BMV-063-departure-reckoning-early', ['Enos 1:25', 'Mosiah 6:4', 'Mosiah 29:46', 'Alma 28:2'], J],
  ['BMV-175-departure-reckoning-later', ['3 Nephi 1:1–2', '3 Nephi 2:5–9'], J],
  ['BMV-062-jacob-closing-lament', ['Jacob 7:26'], J],
  ['BMV-098-records-from-jerusalem', ['Alma 3:11–12'], J],
  ['BMV-111-synagogues-coming-taught', ['Alma 16:13, 19–20'], []],
  ['BMV-121-branch-of-israel', ['Alma 26:36–37'], []],
  ['BMV-008-lehi-dream-tree', ['1 Nephi 8:2–38'], []],
  ['BMV-103-angel-to-alma-and-amulek', ['Alma 8:14–21', 'Alma 38:7–8'], []],
  ['BMV-114-lamoni-abish-angels', ['Alma 19:12–16, 29–34'], []],
  ['BMV-163-names-and-prison-fire', ['Helaman 5:6, 20–50'], J],
  ['BMV-174-wise-men-angels-skeptics', ['Helaman 16:13–14, 18–20'], J],
  ['BMV-181-nephi-saw-angels', ['3 Nephi 7:15, 18'], []],
  ['BMV-193-angels-prayer-light', ['3 Nephi 19:13–15, 20–30, 35–36'], []],
  ['BMV-223-omer-dream-emer-sight', ['Ether 9:3, 21–22'], []],
];
const KEYS = [8, 62, 63, 72, 95, 98, 103, 111, 114, 121, 123, 125, 133, 163, 174, 175, 176, 181, 193, 223];
const CONSOLIDATED: [number, string][] = [
  [72, 'BMV-063-departure-reckoning-early'],
  [95, 'BMV-063-departure-reckoning-early'],
  [123, 'BMV-063-departure-reckoning-early'],
  [176, 'BMV-175-departure-reckoning-later'],
  [133, 'BMV-103-angel-to-alma-and-amulek'],
];

test('RES96-C: views carry exact locators, 3/bom gates and one-way earlier-work targets, with no dates or pins', () => {
  for (const [key, src, see] of VIEWS) {
    const v = byKey.get(key);
    assert.ok(v, key);
    assert.deepEqual(plain(v.books), [3], key);
    assert.deepEqual(plain(v.layers), ['bom'], key);
    assert.deepEqual(srcOf(key), src, key);
    assert.deepEqual(seeOf(key), see, key);
    for (const f of ['when', 'date', 'lat', 'lon', 'route', 'year']) assert.equal(v[f], undefined, `${key} ${f}`);
    for (const k of see) assert.ok(byKey.get(k).books[0] < 3, `${key} -> ${k}`);
    for (const k of see) assert.ok(!seeOf(k).includes(key), `${k} -> ${key}`);
    for (const s of v.src)
      assert.match(s.u, /^https:\/\/www\.churchofjesuschrist\.org\/study\/scriptures\/(bofm|ot)\//);
  }
  assert.match(byKey.get('BMV-125-choose-whom-serve-scripture').src[1].u, /ot\/josh\/24\?lang=eng$/);
  // no event or Chronicle item was added for any correction
  assert.ok(!P.events.some((e: any) => /RES96|checkpoint 64/.test(JSON.stringify(e))));
});

test('RES96-C: every one of the 20 keys is implemented or consolidated; the semantic ledger is empty', () => {
  const views = read('bmc-source-views.csv').split('\n');
  for (const n of KEYS) {
    const k = 'BMC-' + String(n).padStart(3, '0');
    const mine = views.filter(r => r.startsWith(k + ',') && /,(implemented|omitted),/.test(r));
    assert.ok(mine.length >= 1, k);
    const cons = CONSOLIDATED.find(c => c[0] === n);
    if (cons) {
      assert.equal(mine.length, 1, k);
      assert.match(mine[0], /,omitted,"?checkpoint 64 decision \(RES96-C0[28]\): /, k);
      assert.ok(mine[0].includes(cons[1]), k);
      assert.ok(
        srcOf(cons[1]).some(s => mine[0].includes(s)),
        `${k} cites a source of ${cons[1]}`,
      );
    } else
      assert.ok(
        mine.every(r => r.includes(',implemented,')),
        k,
      );
  }
  assert.equal(read('bmc-semantic-dispositions.csv').trim().split('\n').length, 1);
  assert.equal(read('bmc-omission-rollup.csv').trim().split('\n').length, 1);
});

test('RES96-C: attribution, scene and identity safeguards are visible in the copy', () => {
  // C01: citation and reported appearance are separate cards; no Joshua encounter; speech loss not diagnosed
  assert.match(d('BMV-125-choose-whom-serve-scripture'), /no word-for-word identity is claimed/);
  assert.match(d('BMV-125-choose-whom-serve-scripture'), /not a meeting with Joshua or a visit to Shechem/);
  assert.match(d('BMV-125-korihor-reported-appearance'), /Korihor’s own retrospective account/);
  assert.match(d('BMV-125-korihor-reported-appearance'), /loss of speech is not diagnosed/);
  // C02: the records' counts and separate clocks
  for (const n of ['179 years', 'about 476', '509 years', 'severity, not a year'])
    assert.ok(d('BMV-063-departure-reckoning-early').includes(n), n);
  assert.match(d('BMV-063-departure-reckoning-early'), /no age or date for Enos’s prayer, BCE year, filter year/);
  assert.match(d('BMV-175-departure-reckoning-later'), /six hundred[\s\S]*609 years[\s\S]*separate clocks/);
  // C03, C04, C05, C06
  assert.match(d('BMV-062-jacob-closing-lament'), /simile for passing time, not a vision/);
  assert.match(d('BMV-062-jacob-closing-lament'), /does not say Jacob was born in Jerusalem/);
  assert.match(d('BMV-098-records-from-jerusalem'), /not atlas judgments about ethnicity, archaeology, genetics/);
  assert.match(d('BMV-111-synagogues-coming-taught'), /future one to this people[\s\S]*not a Gospel scene/);
  assert.match(d('BMV-121-branch-of-israel'), /no pedigree, modern ethnic\s+mapping, branch route or patriarch link/);
  // C07: a dream account, distinct from the other two visions; the text does not identify its river (RES64-C1:
  // no identification, which is not a claim of definite nonidentity)
  assert.match(d('BMV-008-lehi-dream-tree'), /distinct from\s+Lehi’s Jerusalem vision \(1 Nephi 1\)/);
  assert.match(d('BMV-008-lehi-dream-tree'), /the text does not identify the\s+dream’s river as the river Laman/);
  assert.doesNotMatch(d('BMV-008-lehi-dream-tree'), /river is not the river/);
  // C08–C14
  assert.match(d('BMV-103-angel-to-alma-and-amulek'), /no angel is named[\s\S]*Amulek’s experience is his own/);
  assert.match(d('BMV-114-lamoni-abish-angels'), /does not say\s+whose vision it was/);
  assert.match(d('BMV-114-lamoni-abish-angels'), /foretold, not witnessed; Abish is not the queen/);
  assert.match(d('BMV-163-names-and-prison-fire'), /Aminadab’s explanation stay distinct/);
  assert.match(d('BMV-163-names-and-prison-fire'), /Aminadab is not the biblical one, and the prison is not located/);
  assert.match(d('BMV-174-wise-men-angels-skeptics'), /The argument is theirs, not the atlas’s/);
  assert.match(d('BMV-174-wise-men-angels-skeptics'), /not identified with the visitors of Matthew 2/);
  assert.match(d('BMV-181-nephi-saw-angels'), /Seeing angels, hearing the Lord’s voice and witnessing the relapse/);
  assert.match(d('BMV-193-angels-prayer-light'), /“because I am with them” \(19:22\)/);
  assert.match(d('BMV-193-angels-prayer-light'), /the comparison is his/);
  assert.match(d('BMV-223-omer-dream-emer-sight'), /form and place of Emer’s sight are not described/);
  // RES64-C2: Ether 9:21–22 gives his remaining four years, then peace, sight and death; the sight is not dated
  assert.ok(
    d('BMV-223-omer-dream-emer-sight').includes(
      'Later, Emer anoints his son Coriantum to reign in his place and lives four more years. The record says that ' +
        'he sees peace in the land, sees the Son of Righteousness, rejoices, and dies in peace (9:21–22).',
    ),
  );
  assert.doesNotMatch(d('BMV-223-omer-dream-emer-sight'), /four years after anointing/);
  assert.match(d('BMV-223-omer-dream-emer-sight'), /two men and\s+the two accounts stay distinct/);
});

test('RES96-C: vision crosswalk rows come from the cited source; old rows are kept', () => {
  const rows = read('timeline-source-vision.csv').trim().split('\n');
  assert.equal(rows.length - 1, 167);
  const row = (k: string) => rows.find(r => r.startsWith(`codex:${k},`))!;
  const expect: [string, string, string][] = [
    ['BMV-008-lehi-dream-tree', 'keyword', 'vision-content'],
    ['BMV-062-jacob-closing-lament', 'keyword', 'not-vision'],
    ['BMV-103-angel-to-alma-and-amulek', 'keyword', 'mixed'],
    ['BMV-114-lamoni-abish-angels', 'keyword', 'mixed'],
    ['BMV-223-omer-dream-emer-sight', 'keyword', 'mixed'],
    ['BMV-125-korihor-reported-appearance', 'source:Alma 30:53', 'mixed'],
    ['BMV-163-names-and-prison-fire', 'source:Helaman 5:20–50', 'mixed'],
    ['BMV-174-wise-men-angels-skeptics', 'source:Helaman 16:13–14', 'mixed'],
    ['BMV-181-nephi-saw-angels', 'source:3 Nephi 7:15, 18', 'mixed'],
    ['BMV-193-angels-prayer-light', 'source:3 Nephi 19:13–15, 20–30', 'mixed'],
  ];
  for (const [k, basis, cls] of expect) {
    const r = row(k);
    assert.ok(r, k);
    assert.ok(r.includes(`,${basis},${cls},`) || r.includes(`,"${basis}",${cls},`), `${k}: ${r}`);
    assert.ok(r.includes(',no-year,'), k);
  }
  // the non-vision views are not in the crosswalk
  for (const k of ['BMV-063-departure-reckoning-early', 'BMV-098-records-from-jerusalem', 'BMV-121-branch-of-israel'])
    assert.equal(row(k), undefined, k);
  // the earlier source-only rows are untouched
  assert.ok(row('BMV-217-fall-divine-image-spirit-body').includes('"source:Ether 3:9, 13–18",mixed,'));
  assert.ok(rows.some(r => r.startsWith('codex:NTC-heavenly-experience,')));
});

test('RES96-C: screened rows for the corrected keys are labelled checkpoint 64; screen counts unchanged', () => {
  const rows = read('bmc-textscan.csv').trim().split('\n').slice(1);
  assert.equal(rows.length, 114);
  const count = (s: string) => rows.filter(r => r.includes(`,${s},`)).length;
  assert.deepEqual([count('consistent'), count('no-hit'), count('resolved'), count('reader')], [91, 7, 16, 0]);
  for (const k of ['BMC-175', 'BMC-176', 'BMC-181', 'BMC-193', 'BMC-223'])
    for (const r of rows.filter(x => x.startsWith(k + ','))) assert.match(r, /,checkpoint-64 (view BMV-|decision)/, r);
});
