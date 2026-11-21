/* SA07-OPEN-01 + SA07-HOID-01 (ChatGPT sa07-handoff-2026-11-20.md): on PR48 only, the text of e55 (contest of
   champions) and e60 (Hoid on Scadrial) is replaced. id, title, book 12, world, site and every other field are
   unchanged. Visibility is checked with the ACTUAL engine selectors cut out of public/atlas/engine.js against the
   parent pack in the 12 handoff states: all 63 events, Urithiru site eligibility (siteSeen) and Roshar/Scadrial
   reading-hidden state (rdWorldHidden). */
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

const CHANGES = [
  {
    id: 'e55',
    old: 'Dalinar and Odium agree on a contest, with ten days for both sides to prepare.',
    now: 'The agreed contest of champions approaches; its ten-day countdown is already underway.',
    keys: { id: 'e55', book: 12, world: 'roshar', site: 'urithiru', title: 'A contest of champions' },
  },
  {
    id: 'e60',
    old: 'In the epilogue Hoid travels to Scadrial to look for allies against Retribution.',
    now: 'Hoid recovers on Scadrial in Ulaam’s care. Later, he is hired by the Ladrian household and plans to seek Valor.',
    keys: { id: 'e60', book: 12, world: 'scadrial', title: 'Hoid seeks help' },
  },
];
let parentSrc = packSrc;
for (const x of CHANGES) {
  assert.equal(packSrc.split(x.now).length, 2, x.id + ' new text occurs once');
  assert.equal(packSrc.split(x.old).length, 1, x.id + ' old text absent');
  parentSrc = parentSrc.replace(x.now, x.old);
}

const WOK = 'the-way-of-kings';
const WOR = 'words-of-radiance';
const ROW = 'rhythm-of-war';
const WAT = 'wind-and-truth';
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
        `site:!!siteSeen(w.sites.find(s=>s.id==='urithiru')),worldHidden:!!rdWorldHidden(w),` +
        `scadrialHidden:!!rdWorldHidden(WORLD_BY.scadrial)}})()`,
      c,
    ),
  );
};

test('SA07 payload: e55/e60 text replaced; whole pack otherwise equal to the parent', () => {
  const { p } = setup({ mode: 'all' });
  const { p: pp } = setup({ mode: 'all' }, parentSrc);
  for (const x of CHANGES) {
    const e = p.events.find((y: any) => y.id === x.id);
    const pe = pp.events.find((y: any) => y.id === x.id);
    assert.equal(e.text, x.now);
    assert.equal(pe.text, x.old, x.id + ' parent control: old text');
    assert.deepEqual(J({ ...e, text: null }), J({ ...x.keys, text: null }), x.id + ' keeps exactly its other keys');
  }
  assert.equal(p.events.length, 63);
  const strip = (pk: any) => {
    const x = J(pk);
    for (const c of CHANGES) x.events.find((y: any) => y.id === c.id).text = null;
    return x;
  };
  assert.deepEqual(strip(p), strip(pp), 'whole parsed pack minus e55/e60 text equals the parent');
});

test('SA07 visibility: events, Urithiru site, Roshar and Scadrial identical to the parent in 12 states', () => {
  const { p } = setup({ mode: 'all' });
  const allWorks = p.spoilers.works.map((w: any) => w.id) as string[];
  const b12 = p.spoilers.works.filter((w: any) => w.bucket === 12).map((w: any) => w.id) as string[];
  const states: [string, St, boolean][] = [
    ['All', { mode: 'all' }, true],
    ['legacy9', { mode: 'legacy', book: 9 }, false],
    ['legacy11', { mode: 'legacy', book: 11 }, false],
    ['legacy12', { mode: 'legacy', book: 12 }, true],
    ['empty', { mode: 'set', ids: [] }, false],
    ['WaT only', { mode: 'set', ids: [WAT] }, false],
    ['WoK+WaT', { mode: 'set', ids: [WOK, WAT] }, false],
    ['WoK+WoR+WaT', { mode: 'set', ids: [WOK, WOR, WAT] }, false],
    ['WoK+WoR+RoW+WaT', { mode: 'set', ids: [WOK, WOR, ROW, WAT] }, false],
    ['bucket12 only', { mode: 'set', ids: b12 }, false],
    ['all minus WaT', { mode: 'set', ids: allWorks.filter(id => id !== WAT) }, false],
    ['all works', { mode: 'set', ids: allWorks }, true],
  ];
  for (const [label, st, want] of states) {
    const a = seen(st);
    assert.deepEqual(a, seen(st, parentSrc), label + ': events/site/worlds same as parent');
    assert.equal(a.events.length, 63);
    for (const id of ['e55', 'e60']) {
      const ev = a.events.find((x: [string, boolean]) => x[0] === id);
      assert.equal(ev[1], want, label + ': ' + id + (want ? ' eligible' : ' withheld'));
    }
  }
});
