/* SA01-GEO-01/02 (ChatGPT sa01-final-handoff-2026-11-20.md): two conservative Roshar site-description reductions
   in the Cosmere pack (shatteredplains.desc, warcamps.desc). ids, names, coordinates, books, site order, Roshar parent,
   events and every other field are unchanged; no gate/mapping added. Visibility is checked with the ACTUAL engine
   selectors cut out of public/atlas/engine.js against the parent pack in every reading state. */
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

const SP_NEW =
  'An expanse of rocky plateaus divided by deep chasms, east of the Alethi warcamps. Kaladin is brought here as a slave.';
const SP_OLD =
  'Plateaus split by deep chasms, where the Alethi warcamps hunt chasmfiends for gemhearts. The fragments of a fourth moon that fell long ago lie beneath. Kaladin runs bridges here as a slave.';
const WC_NEW =
  'The armies of Alethkar’s ten highprinces camp in enormous craterlike rock formations west of the Shattered Plains.';
const WC_OLD =
  'Ten craters along the western rim, one per highprince. North to south: Roion, Sadeas, Aladar, Kholin, Vamah, Ruthar, Thanadal, Hatham, Bethab, Sebarial.';
const WOK = 'the-way-of-kings';
const REMOVED = ['fourth moon', 'chasmfiends for gemhearts', 'North to south', 'Thanadal', 'runs bridges here'];

/* the parent pack (fccfe2c): only the two descriptions differ */
const parentSrc = packSrc.replace(SP_NEW, SP_OLD).replace(WC_NEW, WC_OLD);

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
  vm.runInContext(cut('const ARR=', '\n'), c);
  vm.runInContext(cut('const filterOk=', '\n'), c);
  vm.runInContext(cut('const GCACHE=new WeakMap();', '/* intro copy'), c);
  vm.runInContext(cut('const firstOf=w=>', '\n'), c);
  vm.runInContext(cut('const evOk=', '\n'), c);
  for (const m of ['const realmOk=', 'const siteEraOk=', 'const siteSeen=', 'function rdWorldHidden(']) {
    vm.runInContext(cut(m, '\n'), c);
  }
  return { c, p };
}
const bucket = (k: number) => {
  const { p } = setup({ mode: 'all' });
  return p.spoilers.works.filter((w: any) => w.bucket === k).map((w: any) => w.id) as string[];
};
const seen = (st: St, src = packSrc) => {
  const { c } = setup(st, src);
  return J(
    vm.runInContext(
      `(()=>{const w=WORLD_BY.roshar;return {world:typeof rdWorldHidden==='function'?!rdWorldHidden(w):null,` +
        `sites:w.sites.map(s=>[s.id,siteSeen(s)])};})()`,
      c,
    ),
  );
};

test('SA01-GEO-01/02 payload: exact two Roshar descriptions; whole pack otherwise equal to the parent', () => {
  const { p } = setup({ mode: 'all' });
  const { p: pp } = setup({ mode: 'all' }, parentSrc);
  const r = p.worlds.find((w: any) => w.id === 'roshar');
  const rp = pp.worlds.find((w: any) => w.id === 'roshar');
  assert.deepEqual(J(r.books), [4, 5, 7, 8, 9, 12]);
  assert.equal(r.first, 4);
  assert.ok(!('gate' in r), 'Roshar has no record gate');
  assert.deepEqual(J(r.sites.map((s: any) => s.id)), J(rp.sites.map((s: any) => s.id)), 'site ids and order');
  assert.deepEqual(J(r.sites.slice(0, 2).map((s: any) => s.id)), ['shatteredplains', 'warcamps']);
  assert.equal(r.hero, 'shatteredplains');
  const sp = r.sites.find((s: any) => s.id === 'shatteredplains');
  const wc = r.sites.find((s: any) => s.id === 'warcamps');
  assert.deepEqual(J(sp), {
    id: 'shatteredplains',
    name: 'The Shattered Plains',
    lat: -12,
    lon: 58,
    books: [4, 5, 8, 9, 12],
    desc: SP_NEW,
  });
  assert.deepEqual(J(wc), {
    id: 'warcamps',
    name: 'The warcamps',
    lat: -11.5,
    lon: 55.5,
    books: [4, 5, 8],
    desc: WC_NEW,
  });
  const strip = (pk: any) => {
    const x = J(pk);
    const w = x.worlds.find((w: any) => w.id === 'roshar');
    for (const s of w.sites) if (s.id === 'shatteredplains' || s.id === 'warcamps') delete s.desc;
    return x;
  };
  assert.deepEqual(strip(p), strip(pp), 'whole pack minus the two desc fields equals the parent');
  const pick = (w: any, id: string) => w.sites.find((s: any) => s.id === id).desc;
  assert.equal(pick(rp, 'shatteredplains'), SP_OLD, 'parent control has old shatteredplains');
  assert.equal(pick(rp, 'warcamps'), WC_OLD, 'parent control has old warcamps');
  for (const x of REMOVED) assert.ok(!packSrc.includes(x), 'removed phrase absent: ' + x);
  assert.equal(packSrc.split(SP_NEW).length, 2, 'new shatteredplains desc once');
  assert.equal(packSrc.split(WC_NEW).length, 2, 'new warcamps desc once');
});

test('SA01-GEO-01/02 visibility: Roshar and its sites identical to the parent across All, legacy, eligible and insufficient sets', () => {
  const b4 = bucket(4);
  assert.ok(b4.includes(WOK), 'The Way of Kings is a bucket-4 work');
  const states: [string, St][] = [
    ['All', { mode: 'all' }],
    ['legacy #book=4', { mode: 'legacy', book: 4 }],
    ['legacy #book=10', { mode: 'legacy', book: 10 }],
    ['legacy #book=3', { mode: 'legacy', book: 3 }],
    ['legacy #book=1', { mode: 'legacy', book: 1 }],
    ['Way of Kings only', { mode: 'set', ids: [WOK] }],
    ['bucket 4', { mode: 'set', ids: b4 }],
    ['buckets 1-3 (no Way of Kings)', { mode: 'set', ids: [...bucket(1), ...bucket(2), ...bucket(3)] }],
    ['other work only (mistborn-the-final-empire)', { mode: 'set', ids: ['mistborn-the-final-empire'] }],
    ['nothing read', { mode: 'set', ids: [] }],
  ];
  for (const [label, st] of states) {
    assert.deepEqual(seen(st), seen(st, parentSrc), label + ': same as parent');
  }
  const pick = (r: any, id: string) => r.sites.find((x: [string, boolean]) => x[0] === id)[1];
  for (const st of [{ mode: 'all' }, { mode: 'set', ids: [WOK] }, { mode: 'legacy', book: 4 }] as St[]) {
    const r = seen(st);
    assert.ok(pick(r, 'shatteredplains') && pick(r, 'warcamps'), JSON.stringify(st) + ' shows both sites');
  }
  for (const st of [
    { mode: 'set', ids: [] },
    { mode: 'set', ids: ['mistborn-the-final-empire'] },
  ] as St[]) {
    const r = seen(st);
    assert.ok(!pick(r, 'shatteredplains') && !pick(r, 'warcamps'), JSON.stringify(st) + ' withholds both sites');
  }
});
