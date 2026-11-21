/* SA06-IDEAL-01 (ChatGPT sa06-handoff-2026-11-20.md): on PR48 only, event e44 (Kaladin’s Fourth Ideal) text
   changes from the isolation/interior framing to the narrower oath paraphrase. id, title, book 9, world roshar,
   site urithiru and every other field are unchanged. Visibility is checked with the ACTUAL engine selectors cut
   out of public/atlas/engine.js against the parent pack in the 13 handoff states: all 63 events, Urithiru site
   eligibility (siteSeen) and Roshar reading-hidden state (rdWorldHidden). */
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

const NEW_TEXT = 'Kaladin accepts that there are people he cannot protect and swears the Fourth Ideal.';
const OLD_TEXT = 'Alone in the captured tower, Kaladin learns he cannot save everyone and keeps going anyway.';
assert.equal(packSrc.split(NEW_TEXT).length, 2, 'new e44 text occurs once');
assert.equal(packSrc.split(OLD_TEXT).length, 1, 'old e44 text absent');
const parentSrc = packSrc.replace(NEW_TEXT, OLD_TEXT);

const WOK = 'the-way-of-kings';
const WOR = 'words-of-radiance';
const OB = 'oathbringer';
const DS = 'dawnshard';
const ROW = 'rhythm-of-war';
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
    S: { book: st.mode === 'legacy' ? st.book : 0, realm: 'physical' },
    LY: null,
  });
  const marks: [string, string][] = [
    ['const ARR=', '\n'],
    ['const filterOk=', '\n'],
    ['const GCACHE=new WeakMap();', '/* intro copy'],
    ['const firstOf=w=>', '\n'],
    ['const evOk=', '\n'],
    ['const realmOk=', '\n'],
    ['const siteEraOk=', '\n'],
    ['const siteSeen=', '\n'],
    ['function rdWorldHidden(', '\n'],
  ];
  for (const [a, b] of marks) vm.runInContext(cut(a, b), c);
  return { c, p };
}
const seen = (st: St, src = packSrc) => {
  const { c } = setup(st, src);
  return J(
    vm.runInContext(
      `(()=>{const w=WORLD_BY.roshar;return {events:EVENTS.map(e=>[e.id,!!evOk(e)]),` +
        `site:!!siteSeen(w.sites.find(s=>s.id==='urithiru')),worldHidden:!!rdWorldHidden(w)}})()`,
      c,
    ),
  );
};

test('SA06-IDEAL-01 payload: e44 text replaced; whole pack otherwise equal to the parent', () => {
  const { p } = setup({ mode: 'all' });
  const { p: pp } = setup({ mode: 'all' }, parentSrc);
  const e = p.events.find((x: any) => x.id === 'e44');
  const pe = pp.events.find((x: any) => x.id === 'e44');
  assert.equal(e.text, NEW_TEXT);
  assert.equal(pe.text, OLD_TEXT, 'parent control: old text');
  assert.deepEqual(
    J({ ...e, text: null }),
    J({ id: 'e44', book: 9, world: 'roshar', site: 'urithiru', title: 'Kaladin’s Fourth Ideal', text: null }),
    'e44 keeps exactly id/book/world/site/title; no lm/first/req/needs/in added',
  );
  assert.equal(p.events.length, 63);
  const strip = (pk: any) => {
    const x = J(pk);
    x.events.find((y: any) => y.id === 'e44').text = null;
    return x;
  };
  assert.deepEqual(strip(p), strip(pp), 'whole parsed pack minus e44.text equals the parent');
  assert.ok(!/captured tower|Alone in the/.test(JSON.stringify(e)), 'old isolation/interior framing gone from e44');
});

test('SA06-IDEAL-01 visibility: events, Urithiru site and Roshar identical to the parent in 13 states', () => {
  const { p } = setup({ mode: 'all' });
  const allWorks = p.spoilers.works.map((w: any) => w.id) as string[];
  const states: [string, St, boolean, boolean][] = [
    ['All', { mode: 'all' }, true, true],
    ['legacy #book=8', { mode: 'legacy', book: 8 }, false, true],
    ['legacy #book=9', { mode: 'legacy', book: 9 }, true, true],
    ['legacy #book=12', { mode: 'legacy', book: 12 }, true, true],
    ['nothing read', { mode: 'set', ids: [] }, false, false],
    ['RoW only', { mode: 'set', ids: [ROW] }, false, false],
    ['WoK only', { mode: 'set', ids: [WOK] }, false, false],
    ['WoK + RoW', { mode: 'set', ids: [WOK, ROW] }, false, false],
    ['OB + RoW', { mode: 'set', ids: [OB, ROW] }, false, false],
    ['WoK + OB + DS', { mode: 'set', ids: [WOK, OB, DS] }, false, false],
    ['WoK + OB + DS + RoW', { mode: 'set', ids: [WOK, OB, DS, ROW] }, false, false],
    ['WoK + WoR + RoW', { mode: 'set', ids: [WOK, WOR, ROW] }, true, true],
    ['all works', { mode: 'set', ids: allWorks }, true, true],
  ];
  for (const [label, st, e44Want, siteWant] of states) {
    const a = seen(st);
    assert.deepEqual(a, seen(st, parentSrc), label + ': events/site/world same as parent');
    assert.equal(a.events.length, 63);
    const e44 = a.events.find((x: [string, boolean]) => x[0] === 'e44');
    assert.equal(e44[1], e44Want, label + ': e44 ' + (e44Want ? 'eligible' : 'withheld'));
    assert.equal(a.site, siteWant, label + ': Urithiru site ' + (siteWant ? 'eligible' : 'withheld'));
  }
});
