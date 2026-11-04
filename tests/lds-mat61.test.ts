import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import vm from 'node:vm';

// Checkpoint 62: MAT61-C1 (HANDOFF_PLAN 2026-11-04 "Separate bounded closure of the two 3 Nephi 11 Matthew reader
// leads"). One source-only 3/bom comparison card closes both leads; nothing else in the screen or ledger moves.
const ctx: { window: Record<string, any> } = { window: {} };
vm.runInNewContext(readFileSync(new URL('../public/atlas/layers.js', import.meta.url), 'utf8'), ctx);
vm.runInNewContext(readFileSync(new URL('../public/atlas/packs/lds-standard-works.js', import.meta.url), 'utf8'), ctx);
const P = ctx.window.ATLAS_PACKS['lds-standard-works'];
const plain = (v: unknown) => (v === undefined ? v : JSON.parse(JSON.stringify(v)));
const all = P.codex.flatMap((t: any) => t.list);
const byKey = new Map<string, any>(all.filter((x: any) => x.key).map((x: any) => [x.key, x]));
const dir = '../docs/universes/packs/lds-standard-works/';
const read = (f: string) => readFileSync(new URL(dir + f, import.meta.url), 'utf8');
const KEY = 'BMV-185-doctrine-foundations-matthew';
const S = 'https://www.churchofjesuschrist.org/study/scriptures/';

test('MAT61-C1: one source-only 3/bom comparison card with exact locators and no target', () => {
  const v = byKey.get(KEY);
  assert.ok(v);
  assert.equal(v.name, 'Rock and sand compared with Matthew (3 Nephi 11)');
  assert.deepEqual(plain(v.books), [3]);
  assert.deepEqual(plain(v.layers), ['bom']);
  assert.deepEqual(plain(v.src), [
    { t: '3 Nephi 11:31–40', u: S + 'bofm/3-ne/11?lang=eng' },
    { t: 'Matthew 16:13–20', u: S + 'nt/matt/16?lang=eng' },
    { t: 'Matthew 7:21–29', u: S + 'nt/matt/7?lang=eng' },
  ]);
  assert.equal(v.see, undefined);
  for (const f of ['when', 'lat', 'lon', 'route', 'year']) assert.equal(v[f], undefined, f);
  // the card is in the bom-bible tab and nothing links back to it
  assert.ok(P.codex.find((t: any) => t.id === 'bom-bible').list.includes(v));
  for (const x of all) assert.ok(!(x.see || []).some((s: any) => (typeof s === 'string' ? s : s.k) === KEY), x.key);
});

test('MAT61-C1: the copy keeps the condition, the distinct applications and the comparison boundary', () => {
  const d = byKey.get(KEY).desc as string;
  assert.ok(d.startsWith('Book of Mormon — '));
  assert.match(d, /declaring more or less and establishing it as his doctrine is a sandy foundation/);
  assert.match(d, /Matthew 16 addresses Peter/);
  assert.match(d, /Matthew 7 contrasts hearing and doing/);
  assert.match(d, /not one setting, audience or event/);
  assert.doesNotMatch(d, /Bountiful|flood of|Noah|source of Third Nephi|quotes Matthew/);
});

test('MAT61-C1: neighbouring views are unchanged', () => {
  const w = byKey.get('BMV-185-crucified-christ-wounds-bountiful');
  assert.deepEqual(plain(w.src.map((s: any) => s.t)), ['3 Nephi 11:11–15']);
  assert.equal(w.see, undefined);
  const m7 = byKey.get('BMV-188-sermon-compare-matthew-7');
  assert.deepEqual(plain(m7.src.map((s: any) => s.t)), ['3 Nephi 14:1–14', 'Matthew 7:1–14']);
  assert.deepEqual(plain(m7.see.map((s: any) => s.k)), ['NTC-sermon-mountain']);
});

test('MAT61-C1: exactly the two BMC-185 reader cues resolve; screen and ledger accounting unchanged', () => {
  const rows = read('bmc-textscan.csv').trim().split('\n').slice(1);
  assert.equal(rows.length, 114);
  const state = (r: string) => (r.match(/,(consistent|no-hit|resolved|reader|note),/) || [])[1];
  const count: Record<string, number> = {};
  for (const r of rows) count[state(r)!] = (count[state(r)!] || 0) + 1;
  assert.deepEqual(count, { consistent: 91, 'no-hit': 7, resolved: 16 });
  const lead = rows.filter(r => r.startsWith('BMC-185,') && r.includes(',parallel: Matthew '));
  assert.equal(lead.length, 2);
  for (const r of lead) {
    assert.equal(state(r), 'resolved', r);
    assert.ok(r.includes(KEY), r);
  }
  assert.ok(lead.some(r => r.includes(',parallel: Matthew 16:18,,3 Nephi 11:39,')));
  assert.ok(lead.some(r => r.includes(',parallel: Matthew 7:26-27,,3 Nephi 11:40,')));
  // the other BMC-185 hits keep the wounds view as the chapter's first view
  for (const r of rows.filter(x => x.startsWith('BMC-185,') && !lead.includes(x)))
    assert.ok(r.includes('view BMV-185-crucified-christ-wounds-bountiful'), r);
  // semantic ledger 96 at checkpoint 62, 20 after the checkpoint 63 RES96 decisions; source-view decision recorded
  assert.equal(read('bmc-semantic-dispositions.csv').trim().split('\n').length - 1, 20);
  const sv = read('bmc-source-views.csv')
    .split('\n')
    .filter(r => r.includes(',' + KEY + ','));
  assert.equal(sv.length, 1);
  assert.match(sv[0], /^BMC-185,3 Nephi 11:31–40,,,teaching,/);
  assert.match(sv[0], /MAT61-C1/);
});
