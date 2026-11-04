import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import vm from 'node:vm';

// Checkpoint 58: the residual Book of Mormon semantic batch (HANDOFF_PLAN 2026-11-04, "Semantic review assignment:
// residual Book of Mormon dispositions"). Views, consolidations and recorded decisions, plus the Cain screen fix.
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

// [view key, its sources in order, its See-also targets]
const VIEWS: [string, string[], string[]][] = [
  ['BMV-015-abraham-covenant-isaiah-restoration', ['1 Nephi 15:18, 20'], ['OHR-ABRAHAM']],
  ['BMV-052-isaiah-11-righteous-judge', ['2 Nephi 30:9, 11–15', 'Isaiah 11:4–9'], ['OTM-c04-messianic-reception']],
  ['BMV-059-abraham-isaac-similitude', ['Jacob 4:5'], ['OHR-ABRAHAM', 'OHR-ISAAC']],
  ['BMV-065-zedekiah-captivity-tower-stone', ['Omni 1:15, 20–22'], ['OHR-ZEDEKIAH']],
  ['BMV-067-jerusalem-ancestral-benjamin', ['Mosiah 1:6, 11'], ['OTM-jerusalem']],
  ['BMV-082-first-parents-fall-abinadi', ['Mosiah 16:3'], []],
  ['BMV-104-jerusalem-deliverance-alma', ['Alma 9:9, 22'], ['OTM-jerusalem']],
  ['BMV-117-creation-fall-aaron', ['Alma 22:9–13'], ['OTM-jerusalem', 'OH-C01']],
  ['BMV-140-moses-comparison-alma-departure', ['Alma 45:18–19'], ['OHR-MOSES']],
  ['BMV-161-abraham-isaac-jacob-fellowship', ['Helaman 3:29–30'], ['OHR-ABRAHAM', 'OHR-ISAAC', 'OHR-JACOB']],
  ['BMV-185-crucified-christ-wounds-bountiful', ['3 Nephi 11:11–15'], []],
  ['BMV-201-lifted-up-cross', ['3 Nephi 27:14'], ['AE10']],
  ['BMV-205-jerusalem-persecution-comparison', ['4 Nephi 1:31'], []],
  ['BMV-220-barges-like-noahs-ark', ['Ether 6:7'], []],
  ['BMV-222-cain-oaths-first-parents', ['Ether 8:15–17, 25'], ['OH-R01']],
  ['BMV-236-charity-compare-1-corinthians-13', ['Moroni 7:45–46', '1 Corinthians 13:4–8'], []],
  ['BMV-237-curse-of-adam-children', ['Moroni 8:8'], ['OH-E01']],
];

test('Checkpoint 58: residual semantic views carry exact locators, 3/bom gates and earlier-work targets only', () => {
  for (const [key, src, see] of VIEWS) {
    const v = byKey.get(key);
    assert.ok(v, key);
    assert.deepEqual(plain(v.books), [3], key);
    assert.deepEqual(plain(v.layers), ['bom'], key);
    assert.deepEqual(srcOf(key), src, key);
    assert.deepEqual(seeOf(key), see, key);
    // no invented coordinates, dates or routes
    for (const f of ['when', 'lat', 'lon', 'route', 'year']) assert.equal(v[f], undefined, `${key} ${f}`);
    for (const k of see) assert.ok(byKey.get(k).books[0] < 3, `${key} -> ${k}`);
    // one-way: no target links back
    for (const k of see) assert.ok(!seeOf(k).includes(key), `${k} -> ${key}`);
  }
  // attribution and safeguards in the visible copy
  const d = (k: string) => byKey.get(k).desc as string;
  assert.match(d('BMV-059-abraham-isaac-similitude'), /kept distinct from the Genesis narrative/);
  assert.match(d('BMV-065-zedekiah-captivity-tower-stone'), /no route, tower site or date/);
  assert.ok(!/Mulek/.test(d('BMV-065-zedekiah-captivity-tower-stone')));
  assert.match(d('BMV-082-first-parents-fall-abinadi'), /distinct from Jacob’s teaching in 2 Nephi 9/);
  assert.match(d('BMV-117-creation-fall-aaron'), /not the Book of Mormon city of Alma 21; this is Aaron’s teaching/);
  assert.match(d('BMV-140-moses-comparison-alma-departure'), /explicitly uncertain; no death event/);
  assert.match(d('BMV-161-abraham-isaac-jacob-fellowship'), /not a vision, journey or genealogy/);
  assert.match(d('BMV-205-jerusalem-persecution-comparison'), /does not identify the crucifixion/);
  assert.match(d('BMV-236-charity-compare-1-corinthians-13'), /neither is presented as a quotation/);
  assert.match(d('BMV-237-curse-of-adam-children'), /kept distinct from the Genesis narrative/);
  // no later-work (4/dc, 5/pgp) source or target at this gate
  for (const [key] of VIEWS) {
    for (const s of byKey.get(key).src) assert.ok(!/dc-testament|\/pgp\//.test(s.u), key);
    assert.ok(!seeOf(key).some((k: string) => /^P[A-Z]\d/.test(k)), key);
  }
});

test('Checkpoint 58: consolidations add exact locators to existing views; decisions are recorded', () => {
  assert.deepEqual(srcOf('BMV-057-david-solomon-rebuke'), ['Jacob 2:1–35', 'Jacob 1:15']);
  assert.match(byKey.get('BMV-057-david-solomon-rebuke').desc, /In Jacob 1:15 the narrative first says/);
  assert.deepEqual(srcOf('BMV-128-moses-wilderness-type'), ['Alma 33:1–23', 'Alma 34:7']);
  assert.match(byKey.get('BMV-128-moses-wilderness-type').desc, /Amulek, speaking next, recalls/);
  assert.deepEqual(seeOf('BMV-128-moses-wilderness-type'), ['OHR-MOSES']);
  assert.deepEqual(srcOf('BMV-048-zion-welfare-teaching'), ['2 Nephi 26:29–31', '2 Nephi 28:21, 24']);
  assert.equal(seeOf('BMV-048-zion-welfare-teaching').length, 0);
  assert.deepEqual(srcOf('BMV-199-horeb-elijah-malachi'), ['3 Nephi 25:1–6', '3 Nephi 26:1–2']);
  assert.match(byKey.get('BMV-199-horeb-elijah-malachi').desc, /that chapter does not name Malachi/);
  const views = read('bmc-source-views.csv');
  for (const [n, view] of [
    ['056', 'BMV-057'],
    ['129', 'BMV-128'],
    ['050', 'BMV-048'],
    ['200', 'BMV-199'],
    ['116', 'BXP14'],
    ['213', 'Isaiah'],
    ['178', 'divine-title'],
    ['093', 'Isaiah 52:7'],
    ['226', 'John 14:2–3'],
  ])
    assert.match(views, new RegExp(`^BMC-${n},[^\\n]*,omitted,"?checkpoint 58 decision[^\\n]*${view}`, 'm'), n);
  // the 26 keys left the semantic ledger and the rollup
  const sem = read('bmc-semantic-dispositions.csv');
  const rollup = read('bmc-omission-rollup.csv');
  const keys = [...VIEWS.map(v => v[0].slice(4, 7)), '056', '129', '050', '200', '116', '213', '178', '093', '226'];
  assert.equal(keys.length, 26);
  for (const n of keys) {
    assert.ok(!sem.includes(`BMC-${n},`), n);
    assert.ok(!rollup.includes(`BMC-${n},`), n);
  }
});

test('Checkpoint 58: the text screen finds Cain in Ether 8:15 despite the combined OH-R01 alias', () => {
  const rows = read('bmc-textscan.csv').trim().split('\n');
  const cain = rows.filter(r => r.startsWith('BMC-222,') && r.includes(',Cain,'));
  assert.equal(cain.length, 1);
  assert.match(cain[0], /,Ether 8:15,resolved,/);
  // the card-name parser still yields the combined alias, which is why the controlled cue exists
  assert.ok(byKey.get('OH-R01').name.startsWith('Cain, Abel, Seth'));
  // screen scope stays the 39 checkpoint-56 chapters; nothing is left untriaged
  assert.equal(new Set(rows.slice(1).map(r => r.slice(0, 7))).size, 39);
  assert.ok(!rows.some(r => r.includes(',untriaged,')));
});
