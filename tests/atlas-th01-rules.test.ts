/* TH01-RULES-01 (ChatGPT th01-handoff-2026-11-20.md): on PR48 only, the last sentence of the Threnody
   forests site description is replaced with the three Simple Rules. Nothing else changes. Visibility is checked
   with the ACTUAL engine selectors cut out of public/atlas/engine.js (evOk, siteSeen/sDesc, rdWorldHidden, eraBlurb,
   eraVal) against the parent pack (built by reversing only the sentence) in 13 reading states. */
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

const OLD = 'No fire, no blood: the Simple Rules keep you alive.';
const NEW =
  'To avoid drawing shades, the Simple Rules prohibit kindling flame, shedding another’s blood, and running at night.';
const KEEP = 'The smaller continent, almost wall-to-wall forest, unnaturally silent and haunted by shades.';
assert.equal(packSrc.split(NEW).length, 2, 'new sentence occurs once');
assert.equal(packSrc.split(OLD).length, 1, 'old sentence absent');
assert.ok(!packSrc.includes('keep you alive'), 'survival-guarantee wording absent from source');
const parentSrc = packSrc.replace(NEW, OLD);
assert.equal(parentSrc.replace(OLD, NEW), packSrc, 'whole-source reversal');

const EXPOSED = ['All', 'legacy7', 'legacy12', 'bucket7', 'all works']; // parent exposure 5/13 (whole-bucket fallback)
const SFS = 'shadows-for-silence-in-the-forests-of-hell';
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
      `(()=>{const w=WORLD_BY.threnody,hidden=rdWorldHidden(w);` +
        `return {worldHidden:!!hidden,blurb:hidden?null:eraBlurb(w),facts:hidden?null:eraVal(w,'facts'),` +
        `events:EVENTS.map(e=>[e.id,!!evOk(e),evOk(e)?eText(e):null]),` +
        `sites:w.sites.map(s=>[s.id,!!siteSeen(s),siteSeen(s)?sDesc(s):null])};})()`,
      c,
    ),
  );
};

test('TH01-RULES-01 payload: one forests sentence replaced; whole pack otherwise equal to the parent', () => {
  const { p } = setup({ mode: 'all' });
  const { p: pp } = setup({ mode: 'all' }, parentSrc);
  const forests = (pk: any) =>
    pk.worlds.find((x: any) => x.id === 'threnody').sites.find((s: any) => s.id === 'forests');
  assert.equal(forests(p).desc, KEEP + ' ' + NEW, 'preceding sentence preserved exactly');
  assert.equal(forests(pp).desc, KEEP + ' ' + OLD, 'parent control');
  const head = J(p);
  const f = forests(head);
  f.desc = f.desc.replace(NEW, OLD);
  assert.deepEqual(head, J(pp), 'whole parsed pack with the sentence reversed equals the parent');
});

test('TH01-RULES-01 visibility: 13 states identical to parent except the sentence; old wording never returned', () => {
  const { p } = setup({ mode: 'all' });
  const all = p.spoilers.works.map((w: any) => w.id) as string[];
  const b7 = p.spoilers.works.filter((w: any) => w.bucket === 7).map((w: any) => w.id) as string[];
  assert.ok(b7.includes(SFS), 'Shadows for Silence in bucket 7');
  const states: [string, St][] = [
    ['All', { mode: 'all' }],
    ...[6, 7, 12].map(book => ['legacy' + book, { mode: 'legacy', book }] as [string, St]),
    ['none', { mode: 'none' }],
    ['Shadows for Silence only', { mode: 'set', ids: [SFS] }],
    ['Sixth of the Dusk only', { mode: 'set', ids: ['sixth-of-the-dusk'] }],
    ['system essays only', { mode: 'set', ids: ['arcanum-unbounded-system-essays-and-maps'] }],
    ['bucket7', { mode: 'set', ids: b7 }],
    ['bucket7 minus Shadows for Silence', { mode: 'set', ids: b7.filter(id => id !== SFS) }],
    ['all works minus Shadows for Silence', { mode: 'set', ids: all.filter(id => id !== SFS) }],
    ['all works', { mode: 'set', ids: all }],
    ['all works minus bucket7', { mode: 'set', ids: all.filter(id => !b7.includes(id)) }],
  ];
  assert.equal(states.length, 13);
  const exposed: string[] = [];
  let ev = 0;
  let si = 0;
  for (const [label, st] of states) {
    const now = observe(st);
    const old = observe(st, parentSrc);
    assert.equal(now.events.length, 63);
    assert.equal(now.sites.length, 7);
    ev += now.events.length;
    si += now.sites.length;
    assert.deepEqual(now.events, old.events, label + ': events');
    assert.equal(now.worldHidden, old.worldHidden, label + ': world');
    assert.equal(now.blurb, old.blurb, label + ': blurb');
    assert.deepEqual(now.facts, old.facts, label + ': facts');
    for (let i = 0; i < now.sites.length; i++) {
      const [id, seen, desc] = now.sites[i];
      const [oid, oseen, odesc] = old.sites[i];
      assert.equal(id, oid);
      assert.equal(seen, oseen, label + ': ' + id + ' visibility');
      if (id === 'forests' && odesc) assert.equal(desc, odesc.replace(OLD, NEW), label + ': forests desc');
      else assert.equal(desc, odesc, label + ': ' + id + ' desc');
    }
    assert.ok(!JSON.stringify(now).includes('keep you alive'), label + ': old wording never returned');
    if (JSON.stringify(old).includes(OLD)) {
      exposed.push(label);
      assert.ok(JSON.stringify(now).includes(NEW), label + ': replacement returned');
    } else assert.ok(!JSON.stringify(now).includes(NEW), label + ': replacement withheld');
  }
  assert.equal(ev, 13 * 63);
  assert.equal(si, 13 * 7);
  assert.deepEqual(exposed, EXPOSED, 'parent exposure');
});
