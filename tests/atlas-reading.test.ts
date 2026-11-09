import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import vm from 'node:vm';

// reading.js is a plain browser script: run it in a sandbox and read window.AtlasReading.
// The fixture pack is synthetic (see tests/fixtures/reading-demo.js); it is not researched data.
const ctx: { window: Record<string, any>; URLSearchParams: typeof URLSearchParams } = {
  window: {},
  URLSearchParams,
};
vm.runInNewContext(readFileSync(new URL('../public/atlas/reading.js', import.meta.url), 'utf8'), ctx);
vm.runInNewContext(readFileSync(new URL('./fixtures/reading-demo.js', import.meta.url), 'utf8'), ctx);
const R = ctx.window.AtlasReading;
const pack = ctx.window.ATLAS_PACKS['reading-demo'];
const reg = R.normRegistry(pack);
const MAX = 12;
const S = (...ids: string[]) => new Set(ids);
const plain = (v: unknown) => JSON.parse(JSON.stringify(v));
const g = (gate: unknown) => R.compileGate(gate, reg);

test('a pack without works has no registry; the fixture registry validates', () => {
  assert.equal(R.normRegistry({}), null);
  assert.equal(R.normRegistry({ spoilers: { mode: 'cumulative' } }), null);
  assert.equal(reg.ok, true, reg.errors.join('; '));
  assert.deepEqual(plain(reg.order), ['fx-a1', 'fx-a2', 'fx-a3', 'fx-b1', 'fx-c1']);
  assert.deepEqual(plain(reg.buckets.get(2)), ['fx-a1', 'fx-a2', 'fx-a3']);
  assert.equal(reg.presets.get('pub').latest, 2);
});

test('registry errors: duplicates, empty works, bad presets, bad explicit buckets', () => {
  assert.equal(R.normRegistry({ spoilers: { works: [] } }).ok, false);
  const dup = R.normRegistry({
    spoilers: {
      works: [
        { id: 'a', title: 'A' },
        { id: 'a', title: 'A again' },
      ],
    },
  });
  assert.equal(dup.ok, false);
  const badPreset = R.normRegistry({
    spoilers: { works: [{ id: 'a', title: 'A' }], presets: [{ id: 'p', versions: [{ v: 1, seq: ['zz'] }] }] },
  });
  assert.equal(badPreset.ok, false);
  const bk = R.normRegistry({
    spoilers: {
      works: [{ id: 'a', title: 'A' }],
      buckets: { '2': ['a'], '3': [], '4': ['a', 'zz'] },
    },
  });
  assert.equal(R.recordGate({ book: 2 }, bk).kind, 'expr');
  assert.equal(R.recordGate({ book: 3 }, bk).kind, 'invalid', 'empty bucket list → no fallback');
  assert.equal(R.recordGate({ book: 4 }, bk).kind, 'invalid', 'bucket with unknown id → no fallback');
  assert.equal(R.recordGate({ book: 5 }, bk).kind, 'invalid', 'missing bucket key → no fallback');
});

test('family 3: DNF validity table (design 2a)', () => {
  const bad = [[], [[]], [['fx-a1'], []], [['fx-a1', 'zz9'], ['fx-b1']], 'zz9', 5, [['fx-a1', 3]], [[['fx-a1']]], {}];
  for (const e of bad) {
    assert.equal(R.normExpr(e, reg), null, JSON.stringify(e));
    assert.equal(g({ req: e }).kind, 'invalid', JSON.stringify(e));
  }
  assert.deepEqual(plain(R.normExpr('fx-a1', reg)), [['fx-a1']]);
  // unknown id inside an alternative hides even when the other alternative is read
  assert.equal(R.visible([g({ req: [['fx-a1', 'zz9'], ['fx-b1']] })], S('fx-b1')), false);
});

test('family 3: AND / OR / needs narrowing / in is descriptive', () => {
  const and = g({ req: [['fx-a1', 'fx-a2']] });
  assert.equal(R.visible([and], S('fx-a1')), false);
  assert.equal(R.visible([and], S('fx-a1', 'fx-a2')), true);
  const or = g({ req: [['fx-a3'], ['fx-b1']] });
  assert.equal(R.visible([or], S('fx-b1')), true);
  assert.equal(R.visible([or], S('fx-a1')), false);
  const narrowed = g({ req: 'fx-b1', needs: [['fx-a3']] });
  assert.equal(R.visible([narrowed], S('fx-b1')), false, 'needs only narrows');
  assert.equal(R.visible([narrowed], S('fx-b1', 'fx-a3')), true);
  assert.equal(g({ req: 'fx-b1', needs: [] }).kind, 'invalid');
  assert.equal(R.visible([g({ in: ['fx-a1'], req: 'fx-b1' })], S('fx-a1')), false, 'in never grants');
  assert.equal(g({ in: ['zz9'], req: 'fx-b1' }).kind, 'invalid');
  assert.equal(g({ in: ['fx-a1'] }).kind, 'invalid', 'a gate with no req and no public is invalid');
});

test('family 3: public marker cannot be combined with req/needs; empty chain grants nothing', () => {
  assert.equal(g({ public: true }).kind, 'public');
  assert.equal(g({ public: true, req: 'fx-a1' }).kind, 'invalid');
  assert.equal(g({ public: true, needs: 'fx-a1' }).kind, 'invalid');
  assert.equal(g({ public: 'yes' }).kind, 'invalid');
  assert.equal(R.visible([], S('fx-a1')), false);
  // public field cannot override a hidden record/ancestor
  assert.equal(R.visible([g({ req: 'fx-b1' }), g({ public: true })], S()), false);
  assert.equal(R.visible([g({ public: true })], S()), true);
});

test('family 3/5: ancestor and field intersection; absent vs invalid field gates', () => {
  const world = g({ req: 'fx-a2' });
  const place = { gate: { req: 'fx-a1' }, gates: { desc: { req: 'fx-a3' }, era: { req: [] } } };
  const pg = R.recordGate(place, reg);
  // child tagged earlier than its parent stays hidden until the parent is visible
  assert.equal(R.visible([world, pg], S('fx-a1')), false);
  assert.equal(R.visible([world, pg], S('fx-a1', 'fx-a2')), true);
  // absent field gate inherits (NONE adds nothing)
  assert.equal(R.fieldGate(place, 'name', reg).kind, 'none');
  assert.equal(R.visible([world, pg, R.fieldGate(place, 'name', reg)], S('fx-a1', 'fx-a2')), true);
  // present field gate narrows; invalid field gate hides only that field
  assert.equal(R.visible([world, pg, R.fieldGate(place, 'desc', reg)], S('fx-a1', 'fx-a2')), false);
  assert.equal(R.fieldGate(place, 'era', reg).kind, 'invalid');
  assert.equal(R.visible([world, pg, R.fieldGate(place, 'era', reg)], S('fx-a1', 'fx-a2', 'fx-a3')), false);
  // record with an invalid present gate is not rescued by its bucket, and its fields cannot rescue it
  const broken = { gate: { req: [[]] }, book: 2, gates: { name: { public: true } } };
  assert.equal(R.recordGate(broken, reg).kind, 'invalid');
  assert.equal(
    R.visible([R.recordGate(broken, reg), R.fieldGate(broken, 'name', reg)], S('fx-a1', 'fx-a2', 'fx-a3')),
    false,
  );
});

test('family 4/5: whole-bucket fallback is conservative and marked unreviewed', () => {
  const grouped = R.recordGate({ book: 2 }, reg); // untagged record in bucket 2
  assert.equal(grouped.unreviewed, true);
  assert.equal(R.anyUnreviewed([grouped]), true);
  assert.equal(R.visible([grouped], S('fx-a1')), false, 'first-work-only reader does not see grouped text');
  assert.equal(R.visible([grouped], S('fx-a1', 'fx-a2')), false);
  assert.equal(R.visible([grouped], S('fx-a1', 'fx-a2', 'fx-a3')), true);
  assert.equal(R.recordGate({}, reg).kind, 'invalid', 'no gate and no bucket → hidden');
  assert.equal(R.recordGate({ book: 0 }, reg).kind, 'invalid');
  // non-prefix set: a later work alone unlocks nothing earlier
  const early = g({ req: 'fx-a1' });
  assert.equal(R.visible([early], S('fx-b1')), false);
  // publication rank is never consulted
  assert.equal(R.visible([g({ req: 'fx-a3' })], S('fx-b1', 'fx-c1')), false);
});

test('ancestry detects cycles and missing parents', () => {
  const par: Record<string, string | null> = { a: null, b: 'a', c: 'b', x: 'y', y: 'x', m: 'gone' };
  const pof = (id: string) => (id in par ? par[id] : null);
  const ex = (id: string) => id in par;
  assert.deepEqual(plain(R.ancestry('c', pof, ex)), ['a', 'b']);
  assert.equal(R.ancestry('x', pof, ex), null);
  assert.equal(R.ancestry('m', pof, ex), null);
});

const SAFE_INPUTS = [
  '#book=-1',
  '#book=13',
  '#book=',
  '#book=1e1',
  '#book=+2',
  '#book=02',
  '#book=2.0',
  '#read=',
  '#read=fx-a1,,fx-a2',
  '#read=fx-a1,zz9',
  '#read=fx-a1,fx-a1',
  '#read=other-pack-id',
  '#upto=nope:1:fx-a1',
  '#upto=pub:3:fx-a1',
  '#upto=pub:1:fx-c1',
  '#upto=pub:1:zz9',
  '#upto=pub:x:fx-a1',
  '#upto=pub:1',
  '#read=fx-a1&read=fx-a2',
  '#book=2&book=3',
  '#upto=pub:2:fx-a1&upto=pub:2:fx-a2',
  '#book=2&upto=pub:2:fx-a1',
  '#book=2&read=fx-a1',
  '#upto=pub:2:fx-a1&read=fx-a1',
  '#book=2&upto=pub:2:fx-a1&read=fx-a1',
];

test('family 6: every invalid or conflicting reading link enters the safe state, with empty storage and stored All', () => {
  let n = 0;
  for (const h of SAFE_INPUTS) {
    for (const [v2, v1] of [
      [null, null],
      [JSON.stringify({ mode: 'all' }), '0'],
    ]) {
      const r = R.initialState(h, v2, v1, reg, MAX);
      assert.equal(r.state.mode, 'safe', h);
      assert.equal(r.source, 'url');
      assert.equal(R.readSetOf(r.state, reg).size, 0);
      assert.equal(R.storeValue(r.state), null, 'safe state never writes storage');
      assert.deepEqual(plain(R.hashParams(r.state)), {}, 'safe state writes no reading parameter');
      n++;
    }
  }
  assert.equal(n, SAFE_INPUTS.length * 2);
});

test('family 6: valid links, storage and round trips', () => {
  assert.deepEqual(plain(R.initialState('#world=x', null, null, reg, MAX)), {
    state: { mode: 'all' },
    source: 'storage',
  });
  assert.equal(R.initialState('#book=0', null, '5', reg, MAX).state.mode, 'all', 'explicit book=0 is All');
  assert.deepEqual(plain(R.initialState('#book=4', null, null, reg, MAX).state), { mode: 'legacy', book: 4 });
  assert.deepEqual(plain(R.initialState('', null, '5', reg, MAX).state), { mode: 'legacy', book: 5 }, 'v1 → legacy');
  assert.equal(R.initialState('', null, 'x', reg, MAX).state.mode, 'safe', 'malformed v1 → safe');
  assert.equal(R.initialState('', null, '99', reg, MAX).state.mode, 'safe', 'out-of-range v1 → safe');
  assert.equal(R.initialState('', '{bad', null, reg, MAX).state.mode, 'safe');
  assert.equal(R.initialState('', JSON.stringify({ mode: 'set', ids: ['zz9'] }), null, reg, MAX).state.mode, 'safe');
  assert.equal(R.initialState('', JSON.stringify({ mode: 'wat' }), null, reg, MAX).state.mode, 'safe');
  // valid URL wins over storage
  const st = JSON.stringify({ mode: 'legacy', book: 7 });
  assert.equal(R.initialState('#read=fx-b1', st, null, reg, MAX).state.mode, 'set');
  // round trips through hash and storage
  for (const s of [
    { mode: 'legacy', book: 3 },
    { mode: 'set', ids: ['fx-a1', 'fx-b1'] },
    { mode: 'preset', preset: 'pub', v: 1, work: 'fx-a2' },
  ]) {
    const q = new URLSearchParams(R.hashParams(s)).toString();
    assert.deepEqual(plain(R.parseReadingParams(q, reg, MAX).state), s, q);
    assert.deepEqual(plain(R.parseStored(R.storeValue(s), null, reg, MAX)), s);
  }
  // an old preset version never gains a later-inserted work
  const old = R.readSetOf({ mode: 'preset', preset: 'pub', v: 1, work: 'fx-a3' }, reg);
  assert.equal(old.has('fx-c1'), false);
  const cur = R.readSetOf({ mode: 'preset', preset: 'pub', v: 2, work: 'fx-a3' }, reg);
  assert.equal(cur.has('fx-c1'), true);
  // registry-less packs refuse work-level links (safe), keep legacy book links
  assert.equal(R.parseReadingParams('read=fx-a1', null, MAX).state.mode, 'safe');
  assert.equal(R.parseReadingParams('book=2', null, MAX).state.mode, 'legacy');
});

test('checklist and preset controls: explicit sets, no implied ticks, unticking narrows', () => {
  let s = R.choosePreset(reg, 'pub', 'fx-a2');
  assert.deepEqual(plain(s), { mode: 'preset', preset: 'pub', v: 2, work: 'fx-a2' });
  assert.equal(R.choosePreset(reg, 'pub', 'zz9'), null);
  // ticking a later work from the preset becomes a custom set; nothing else is ticked
  s = R.toggleWork(s, 'fx-b1', reg);
  assert.deepEqual(plain(s), { mode: 'set', ids: ['fx-a1', 'fx-a2', 'fx-b1'] });
  assert.equal(R.describe(s, reg).kind, 'set');
  assert.deepEqual(plain(R.describe(s, reg).works), ['Fixture A1', 'Fixture A2', 'Fixture B1']);
  // from All, ticking a single later work selects only that work
  const solo = R.toggleWork({ mode: 'all' }, 'fx-a3', reg);
  assert.deepEqual(plain(solo), { mode: 'set', ids: ['fx-a3'] });
  // unticking narrows immediately; empty selection is the safe state, not All
  s = R.toggleWork(s, 'fx-a2', reg);
  assert.deepEqual(plain(s.ids), ['fx-a1', 'fx-b1']);
  assert.equal(R.toggleWork(solo, 'fx-a3', reg).mode, 'safe');
  assert.equal(R.toggleWork(s, 'zz9', reg), s, 'unknown id is ignored');
  assert.match(R.describe({ mode: 'preset', preset: 'pub', v: 2, work: 'fx-a2' }, reg).label, /through Fixture A2/);
  assert.match(R.describe({ mode: 'legacy', book: 2 }, reg, 'X').label, /series grouping/);
  assert.equal(R.describe({ mode: 'safe' }, reg).kind, 'safe');
});
