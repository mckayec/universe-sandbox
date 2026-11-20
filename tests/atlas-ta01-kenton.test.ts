/* TA01-KENTON-01 (ChatGPT ta01-handoff-2026-11-20.md): on PR48 only, the last sentence of the Taldain world blurb
   is qualified as Kenton's belief. Nothing else changes. Visibility is checked with the ACTUAL engine selectors
   cut out of public/atlas/engine.js (eraBlurb, evOk, siteSeen, rdWorldHidden, eraVal) against the parent pack
   (built by reversing only the sentence) in the 16 handoff states. */
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

const OLD = 'Kenton, son of their leader, is left as the only master after a massacre.';
const NEW = 'After a massacre of the Sand Masters, Kenton believes himself to be the only survivor.';
assert.equal(packSrc.split(NEW).length, 2, 'new sentence occurs once');
assert.equal(packSrc.split(OLD).length, 1, 'old sentence absent');
assert.ok(!packSrc.includes('only master'), 'sole-master claim absent from source');
const parentSrc = packSrc.replace(NEW, OLD);
assert.equal(parentSrc.replace(OLD, NEW), packSrc, 'whole-source reversal');

const WS = ['white-sand-volume-1', 'white-sand-volume-2', 'white-sand-volume-3', 'white-sand-omnibus'];
type St = { mode: 'set' | 'legacy' | 'all' | 'none'; ids?: string[]; book?: number };

function setup(st: St, src = packSrc) {
  const c: any = { window: {}, Set, Map, WeakMap, URLSearchParams };
  vm.createContext(c);
  vm.runInContext(readingSrc, c);
  vm.runInContext(src, c);
  const p = c.window.ATLAS_PACKS.cosmere;
  const R = c.window.AtlasReading;
  const reg = R.normRegistry(p);
  assert.ok(reg.ok, 'registry valid');
  const pw = st.mode === 'set' || st.mode === 'none';
  Object.assign(c, {
    RDG: R,
    RREG: reg,
    RSET: new Set(st.ids || []),
    WORLDS: p.worlds,
    WORLD_BY: Object.fromEntries(p.worlds.map((x: any) => [x.id, x])),
    EVENTS: p.events,
    PW: () => pw,
    CUM: true,
    S: { book: st.mode === 'legacy' ? st.book : 0, realm: 'physical' },
    LY: null,
  });
  const marks: [string, string][] = [
    ['const ARR=', '\n'],
    ['const EFF=', '\n'],
    ['const eraVal=', 'const realmOk='],
    ['const eraKeys=', '\n'],
    ['const filterOk=', '\n'],
    ['const GCACHE=new WeakMap();', '/* intro copy'],
    ['const firstOf=w=>', '\n'],
    ['const evOk=', '\n'],
    ['const realmOk=', '\n'],
    ['const siteEraOk=', '\n'],
    ['const siteSeen=', '\n'],
    ['function rdWorldHidden(', '\n'],
    ['function eraBlurb(', '\n'],
  ];
  for (const [a, b] of marks) vm.runInContext(cut(a, b), c);
  return { c, p };
}

const observe = (st: St, src = packSrc) => {
  const { c } = setup(st, src);
  return J(
    vm.runInContext(
      `(()=>{const w=WORLD_BY.taldain,hidden=rdWorldHidden(w);` +
        `return {worldHidden:!!hidden,blurb:hidden?null:eraBlurb(w),facts:hidden?null:eraVal(w,'facts'),` +
        `events:EVENTS.map(e=>[e.id,!!evOk(e),evOk(e)?eText(e):null]),` +
        `sites:w.sites.map(s=>[s.id,!!siteSeen(s),siteSeen(s)?sDesc(s):null])};})()`,
      c,
    ),
  );
};

test('TA01-KENTON-01 payload: one Taldain sentence replaced; whole pack otherwise equal to the parent', () => {
  const { p } = setup({ mode: 'all' });
  const { p: pp } = setup({ mode: 'all' }, parentSrc);
  const tal = (pk: any) => pk.worlds.find((x: any) => x.id === 'taldain');
  assert.ok(tal(p).blurb.endsWith(' ' + NEW));
  assert.ok(tal(pp).blurb.endsWith(' ' + OLD), 'parent control');
  const head = J(p);
  tal(head).blurb = tal(head).blurb.replace(NEW, OLD);
  assert.deepEqual(head, J(pp), 'whole parsed pack with the sentence reversed equals the parent');
});

test('TA01-KENTON-01 visibility: 16 states identical to parent except the sentence; old claim never returned', () => {
  const { p } = setup({ mode: 'all' });
  const all = p.spoilers.works.map((w: any) => w.id) as string[];
  const b7 = p.spoilers.works.filter((w: any) => w.bucket === 7).map((w: any) => w.id) as string[];
  for (const id of WS) assert.ok(b7.includes(id), id + ' in bucket 7');
  const states: [string, St][] = [
    ['All', { mode: 'all' }],
    ...[6, 7, 12].map(book => ['legacy' + book, { mode: 'legacy', book }] as [string, St]),
    ['none', { mode: 'none' }],
    ...WS.map(id => [id + ' only', { mode: 'set', ids: [id] }] as [string, St]),
    ['original three volumes', { mode: 'set', ids: WS.slice(0, 3) }],
    ['all White Sand entries', { mode: 'set', ids: WS }],
    ['system essays only', { mode: 'set', ids: ['arcanum-unbounded-system-essays-and-maps'] }],
    ['bucket7', { mode: 'set', ids: b7 }],
    ['bucket7 minus omnibus', { mode: 'set', ids: b7.filter(id => id !== 'white-sand-omnibus') }],
    ['all works minus White Sand', { mode: 'set', ids: all.filter(id => !WS.includes(id)) }],
    ['all works', { mode: 'set', ids: all }],
  ];
  assert.equal(states.length, 16);
  const exposed: string[] = [];
  let ev = 0;
  let si = 0;
  for (const [label, st] of states) {
    const now = observe(st);
    const old = observe(st, parentSrc);
    assert.equal(now.events.length, 63);
    assert.equal(now.sites.length, 9);
    ev += now.events.length;
    si += now.sites.length;
    assert.deepEqual(now.events, old.events, label + ': events');
    assert.deepEqual(now.sites, old.sites, label + ': sites');
    assert.equal(now.worldHidden, old.worldHidden, label + ': world');
    assert.deepEqual(now.facts, old.facts, label + ': facts');
    if (old.blurb) assert.equal(now.blurb, old.blurb.replace(OLD, NEW), label + ': blurb');
    else assert.equal(now.blurb, old.blurb, label + ': blurb');
    assert.ok(!JSON.stringify(now).includes('only master'), label + ': old claim never returned');
    if (old.blurb?.includes(OLD)) {
      exposed.push(label);
      assert.ok(now.blurb.endsWith(NEW), label + ': replacement returned');
    }
  }
  assert.equal(ev, 1008);
  assert.equal(si, 144);
  assert.deepEqual(exposed, ['All', 'legacy7', 'legacy12', 'bucket7', 'all works'], 'parent exposure 5/16');
});
