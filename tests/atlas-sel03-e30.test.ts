/* SEL03-E30-01 (ChatGPT sel03-e30-handoff-2026-11-17.md): one-field precision correction of e30.text in the
   Cosmere pack. id, book, world, roseempire site, title and array position unchanged; no gate/gates/lm/fx added;
   the existing restrictive Sel → roseempire → e30 chain (bucket fallback) is unchanged, so visibility is identical
   before and after. These tests run the ACTUAL engine selectors cut out of public/atlas/engine.js with the real
   Cosmere pack and reading helper. */
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

const read = (p: string) => fs.readFileSync(new URL('../' + p, import.meta.url), 'utf8');
const engine = read('public/atlas/engine.js');
const readingSrc = read('public/atlas/reading.js');
const packSrc = read('public/atlas/packs/cosmere.js');
const cut = (a: string, b: string) => {
  const i = engine.indexOf(a);
  assert.ok(i >= 0, 'marker not found: ' + a);
  const j = engine.indexOf(b, i);
  assert.ok(j > i, 'end marker not found: ' + b);
  return engine.slice(i, j);
};
const J = (x: unknown) => JSON.parse(JSON.stringify(x));

const E30_TEXT =
  'A condemned Forger, Shai, has ninety-eight days to recreate Emperor Ashravan’s soul; his body has been healed, but his mind remains blank.';
const E30_OLD = 'A condemned Forger is given a hundred days to rebuild the soul of a dying emperor.';
const E30 = {
  id: 'e30',
  book: 7,
  world: 'sel',
  site: 'roseempire',
  title: 'The Emperor’s Soul',
  text: E30_TEXT,
};
const NEIGHBOURS = {
  e29: {
    id: 'e29',
    book: 6,
    world: 'scadrial',
    site: 'southcontinent',
    title: 'News from the south',
    text: 'The southern Scadrians are real, and ahead of the Basin in some technologies.',
  },
  e31: {
    id: 'e31',
    book: 7,
    world: 'firstsun',
    site: 'patji',
    title: 'Sixth of the Dusk',
    text: 'Dusk the trapper meets Vathi, a scholar who has seen the ships of the Ones Above.',
  },
};
const ROSE = {
  id: 'roseempire',
  name: 'The Imperial Seat (Rose Empire)',
  lat: 58.0,
  lon: -45.0,
  books: [7],
  desc: 'Capital of the Rose Empire on the northern continent, built on seven hills with the Rose Palace on the centre one. Here Shai rebuilds the emperor’s soul in The Emperor’s Soul.',
};
const TES = 'the-emperors-soul';

type St = { mode: 'set' | 'legacy' | 'all'; ids?: string[]; book?: number };

function setup(st: St, src = packSrc) {
  const c: any = { window: {}, Set, Map, WeakMap, URLSearchParams };
  vm.createContext(c);
  vm.runInContext(readingSrc, c);
  vm.runInContext(src, c);
  const p = c.window.ATLAS_PACKS.cosmere;
  const R = c.window.AtlasReading;
  const reg = R.normRegistry(p);
  assert.ok(reg.ok, 'registry valid');
  const pw = st.mode === 'set';
  Object.assign(c, {
    RDG: R,
    RREG: reg,
    RSET: new Set(st.ids || []),
    WORLDS: p.worlds,
    WORLD_BY: Object.fromEntries(p.worlds.map((x: any) => [x.id, x])),
    EVENTS: p.events,
    PW: () => pw,
    CUM: true,
    S: { book: st.mode === 'legacy' ? st.book : 0 },
  });
  vm.runInContext(cut('const GCACHE=new WeakMap();', '/* intro copy'), c);
  vm.runInContext(cut('const firstOf=w=>', '\n'), c);
  vm.runInContext(cut('const evOk=', '\n'), c);
  return { c, p };
}
const bucket = (k: number) => {
  const { p } = setup({ mode: 'all' });
  return p.spoilers.works.filter((w: any) => w.bucket === k).map((w: any) => w.id) as string[];
};
const evVisible = (st: St, src = packSrc) => {
  const { c, p } = setup(st, src);
  c.__e = p.events.find((e: any) => e.id === 'e30');
  return {
    ok: vm.runInContext('evOk(__e)', c) as boolean,
    chain: J(vm.runInContext('evChain(__e)', c)),
  };
};
/* the parent pack: only the e30 text differs */
const parentSrc = packSrc.replace(E30_TEXT, E30_OLD);

test('SEL03-E30-01 payload: exact e30 record, no gate/gates/lm/fx; neighbours, order, site and Sel unchanged; old wording gone', () => {
  const { p } = setup({ mode: 'all' });
  const ids = p.events.map((e: any) => e.id);
  const i = ids.indexOf('e30');
  assert.deepEqual(J(ids.slice(i - 1, i + 2)), ['e29', 'e30', 'e31']);
  assert.deepEqual(J(p.events[i]), E30);
  for (const k of ['gate', 'gates', 'lm', 'fx']) assert.ok(!(k in p.events[i]), 'e30 has no ' + k);
  for (const [id, want] of Object.entries(NEIGHBOURS)) {
    assert.deepEqual(J(p.events.find((e: any) => e.id === id)), want, id);
  }
  const sel = p.worlds.find((w: any) => w.id === 'sel');
  assert.deepEqual(J(sel.books), [1, 7]);
  assert.equal(sel.first, 1);
  assert.ok(!('gate' in sel), 'Sel has no record gate');
  assert.deepEqual(J(sel.sites.find((s: any) => s.id === 'roseempire')), ROSE);
  assert.ok(!packSrc.includes(E30_OLD), 'old e30 wording absent from pack');
  assert.ok(!packSrc.includes('dying emperor'), 'no residual dying-emperor wording');
  assert.ok(!packSrc.includes('given a hundred days'), 'no residual hundred-days wording');
  assert.equal(packSrc.split(E30_TEXT).length, 2, 'new wording appears exactly once');
});

test('SEL03-E30-01 visibility: identical to the parent pack across All, legacy, sufficient and incomplete sets', () => {
  const b1 = bucket(1);
  const b7 = bucket(7);
  assert.ok(b7.includes(TES), 'TES is a bucket-7 work');
  const states: [string, St, boolean][] = [
    ['All', { mode: 'all' }, true],
    ['legacy #book=7', { mode: 'legacy', book: 7 }, true],
    ['legacy #book=10', { mode: 'legacy', book: 10 }, true],
    ['legacy #book=6', { mode: 'legacy', book: 6 }, false],
    ['legacy #book=1', { mode: 'legacy', book: 1 }, false],
    ['sufficient: bucket 1 + bucket 7', { mode: 'set', ids: [...b1, ...b7] }, true],
    ['TES only', { mode: 'set', ids: [TES] }, false],
    ['bucket 7 without bucket 1', { mode: 'set', ids: b7 }, false],
    ['bucket 1 + TES only', { mode: 'set', ids: [...b1, TES] }, false],
    ['bucket 1 + bucket 7 minus TES', { mode: 'set', ids: [...b1, ...b7].filter(x => x !== TES) }, false],
    ['other work only (mistborn-the-final-empire)', { mode: 'set', ids: ['mistborn-the-final-empire'] }, false],
    ['nothing read', { mode: 'set', ids: [] }, false],
  ];
  for (const [label, st, want] of states) {
    const head = evVisible(st);
    const parent = evVisible(st, parentSrc);
    assert.equal(head.ok, want, label);
    assert.equal(parent.ok, head.ok, label + ': same as parent');
    assert.deepEqual(head.chain, parent.chain, label + ': chain unchanged');
  }
});
