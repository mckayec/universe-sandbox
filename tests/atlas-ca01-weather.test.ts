/* CA01-WEATHER-01 (ChatGPT ca01-handoff-2026-11-21.md): on PR48 only, one sentence of the Canticle world blurb is
   replaced (sunset firestorm -> storm with wind, rain and lightning). Nothing else changes. Visibility is checked with
   the ACTUAL engine selectors cut out of public/atlas/engine.js (rdWorldHidden, eraBlurb, eraVal, evOk/eText,
   siteSeen/sDesc) against the parent pack (built by reversing only this sentence) in 13 reading states. */
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

const OLD = 'It spins backwards, rings light its night side, and a firestorm sweeps the sunset line.';
const NEW =
  'It spins backwards, and rings light its night side. A powerful storm follows sunset, bringing wind, rain, and lightning.';
assert.equal(packSrc.split(NEW).length, 2, 'new sentence occurs once');
assert.equal(packSrc.split(OLD).length, 1, 'old sentence absent');
assert.ok(!packSrc.includes('firestorm'), 'removed wording absent from source: firestorm');
const parentSrc = packSrc.replace(NEW, OLD);
assert.equal(parentSrc.replace(OLD, NEW), packSrc, 'whole-source reversal');

const EVENTS_N = 63;
const SUNLIT = 'the-sunlit-man';
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
      `(()=>{const w=WORLD_BY.canticle,hidden=rdWorldHidden(w);` +
        `return {worldHidden:!!hidden,blurb:hidden?null:eraBlurb(w),facts:hidden?null:eraVal(w,'facts'),` +
        `status:hidden?null:eraVal(w,'status'),` +
        `events:EVENTS.map(e=>[e.id,!!evOk(e),evOk(e)?eText(e):null]),` +
        `sites:w.sites.map(s=>[s.id,!!siteSeen(s),siteSeen(s)?sDesc(s):null])};})()`,
      c,
    ),
  );
};

test('CA01-WEATHER-01 payload: one leaf replaced; whole pack otherwise equal to the parent', () => {
  const { p } = setup({ mode: 'all' });
  const { p: pp } = setup({ mode: 'all' }, parentSrc);
  const can = (pk: any) => pk.worlds.find((x: any) => x.id === 'canticle');
  assert.ok(can(p).blurb.includes(NEW) && !can(p).blurb.includes(OLD));
  assert.ok(can(pp).blurb.includes(OLD), 'parent control');
  assert.equal(can(p).blurb, can(pp).blurb.replace(OLD, NEW), 'rest of blurb unchanged');
  const head = J(p);
  can(head).blurb = can(pp).blurb;
  assert.deepEqual(head, J(pp), 'whole parsed pack with the sentence reversed equals the parent');
});

test('CA01-WEATHER-01 visibility: 13 states identical to parent except the sentence; old wording never returned', () => {
  const { p } = setup({ mode: 'all' });
  const all = p.spoilers.works.map((w: any) => w.id) as string[];
  const b11 = p.spoilers.works.filter((w: any) => w.bucket === 11).map((w: any) => w.id) as string[];
  assert.ok(b11.includes(SUNLIT), 'Sunlit Man in bucket 11');
  const states: [string, St][] = [
    ['All', { mode: 'all' }],
    ...[10, 11, 12].map(book => ['legacy' + book, { mode: 'legacy', book }] as [string, St]),
    ['none', { mode: 'none' }],
    ['Sunlit only', { mode: 'set', ids: [SUNLIT] }],
    ['bucket11', { mode: 'set', ids: b11 }],
    ['bucket11 minus Sunlit', { mode: 'set', ids: b11.filter(id => id !== SUNLIT) }],
    ['all works minus Sunlit', { mode: 'set', ids: all.filter(id => id !== SUNLIT) }],
    ['all works', { mode: 'set', ids: all }],
    ['all works minus bucket11', { mode: 'set', ids: all.filter(id => !b11.includes(id)) }],
    ['first work only', { mode: 'set', ids: [all[0]] }],
    ['legacy1', { mode: 'legacy', book: 1 }],
  ];
  assert.equal(states.length, 13);
  const exposed: string[] = [];
  let ev = 0;
  for (const [label, st] of states) {
    const now = observe(st);
    const old = observe(st, parentSrc);
    ev += now.events.length;
    assert.equal(now.worldHidden, old.worldHidden, label + ': world');
    assert.deepEqual(now.facts, old.facts, label + ': facts');
    assert.equal(now.status, old.status, label + ': status');
    assert.deepEqual(now.sites, old.sites, label + ': sites');
    assert.deepEqual(now.events, old.events, label + ': events (visibility + text)');
    if (old.blurb && old.blurb.includes(OLD)) assert.equal(now.blurb, old.blurb.replace(OLD, NEW), label + ': blurb');
    else assert.equal(now.blurb, old.blurb, label + ': blurb');
    assert.ok(!JSON.stringify(now).includes('firestorm'), label + ': old wording never returned');
    if (old.blurb && old.blurb.includes(OLD)) exposed.push(label);
  }
  console.log('CA01 exposure', exposed.length + '/13', exposed.join(', '), 'events compared', ev);
  // parent exposure 2/13: All/legacy12/all works show eras[12].blurb; Sunlit alone does not unlock bucket 11
  assert.deepEqual(exposed, ['legacy11', 'bucket11'], 'parent exposure');
  assert.equal(ev, 13 * EVENTS_N);
});
