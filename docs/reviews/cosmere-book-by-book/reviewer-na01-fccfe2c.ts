// ChatGPT independent rerun: actual parent fetched at 52534d0975af39e620e05a43c2f4f05dc6b4b1fc.
// Adapted from tests/atlas-na01-geo.test.ts at fccfe2c7023b93a91b52df1f812a17f0e94e3ed3.
// Place pinned inputs head.js, parent.js, engine.js and reading.js beside this file.
// node --experimental-strip-types --test reviewer-na01-fccfe2c.ts
// NEGATIVE=1 runs the unchanged old pack as candidate; expect payload fail and visibility pass.
/* NA01-GEO-01/02 (ChatGPT na01-geo-handoff-2026-11-19.md): two conservative site-description narrowings in the
   Cosmere pack (ttelir.desc, denir.desc). ids, names, coordinates, books, site order, Nalthis parent, events and
   every other field are unchanged; no gate/mapping added. Visibility is checked with the ACTUAL engine selectors cut
   out of public/atlas/engine.js against the parent pack in every reading state. */
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

const read = (p: string) => fs.readFileSync(new URL(({'public/atlas/engine.js':'engine.js','public/atlas/reading.js':'reading.js','public/atlas/packs/cosmere.js':process.env.NEGATIVE ? 'parent.js' : 'head.js'})[p], import.meta.url), 'utf8');
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

const TT_NEW =
  'Hallandren’s capital curves around a bay on the Bright Sea, with painted buildings and warrior statues at street corners.';
const TT_OLD =
  'Hallandren’s capital, built in a crescent around a sheltered bay on the Bright Sea, with markets, merchant mansions, slums and docks, and Awakened statues everywhere.';
const DD_NEW = 'A quiet grassy field in T’Telir, filled with hundreds of weathered warrior statues.';
const DD_OLD = 'A quiet field of hundreds of old warrior statues in the north of the city.';
const WB = 'warbreaker';
const IDS = [
  'ttelir',
  'courtofgods',
  'denir',
  'brightsea',
  'edglipool',
  'bevalis',
  'passes',
  'pahnkahl',
  'tedradel',
  'kuth',
];

/* the parent pack (52534d0): only the two descriptions differ */
const parentSrc = fs.readFileSync(new URL('parent.js', import.meta.url), 'utf8');

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
      `(()=>{const w=WORLD_BY.nalthis;return {world:typeof rdWorldHidden==='function'?!rdWorldHidden(w):null,` +
        `sites:w.sites.map(s=>[s.id,siteSeen(s)])};})()`,
      c,
    ),
  );
};

test('NA01-GEO-01/02 payload: exact two Nalthis descriptions; whole pack otherwise equal to the parent', () => {
  const { p } = setup({ mode: 'all' });
  const { p: pp } = setup({ mode: 'all' }, parentSrc);
  const n = p.worlds.find((w: any) => w.id === 'nalthis');
  assert.deepEqual(J(n.books), [3, 5, 7]);
  assert.equal(n.first, 3);
  assert.ok(!('gate' in n), 'Nalthis has no record gate');
  assert.deepEqual(J(n.sites.map((s: any) => s.id)), IDS, 'site ids and order');
  const tt = n.sites.find((s: any) => s.id === 'ttelir');
  const dd = n.sites.find((s: any) => s.id === 'denir');
  assert.deepEqual(J(tt), { id: 'ttelir', name: 'T’Telir', lat: 11.2, lon: 5.6, books: [3], desc: TT_NEW });
  assert.deepEqual(J(dd), { id: 'denir', name: 'D’Denir garden', lat: 11.7, lon: 5.55, books: [3], desc: DD_NEW });
  const strip = (pk: any) => {
    const x = J(pk);
    const w = x.worlds.find((w: any) => w.id === 'nalthis');
    for (const s of w.sites) if (s.id === 'ttelir' || s.id === 'denir') delete s.desc;
    return x;
  };
  assert.deepEqual(strip(p), strip(pp), 'whole pack minus the two desc fields equals the parent');
  const pn = pp.worlds.find((w: any) => w.id === 'nalthis');
  assert.equal(pn.sites.find((s: any) => s.id === 'ttelir').desc, TT_OLD, 'parent control has old ttelir');
  assert.equal(pn.sites.find((s: any) => s.id === 'denir').desc, DD_OLD, 'parent control has old denir');
  assert.ok(!packSrc.includes('Awakened statues everywhere'), 'universal Awakening phrase absent');
  assert.ok(!packSrc.includes('in the north of the city'), 'unsupported direction absent');
  assert.equal(packSrc.split(TT_NEW).length, 2, 'new ttelir desc once');
  assert.equal(packSrc.split(DD_NEW).length, 2, 'new denir desc once');
});

test('NA01-GEO-01/02 visibility: Nalthis and its sites identical to the parent across All, legacy, eligible and insufficient sets', () => {
  const b3 = bucket(3);
  assert.ok(b3.includes(WB), 'Warbreaker is a bucket-3 work');
  const states: [string, St][] = [
    ['All', { mode: 'all' }],
    ['legacy #book=3', { mode: 'legacy', book: 3 }],
    ['legacy #book=10', { mode: 'legacy', book: 10 }],
    ['legacy #book=2', { mode: 'legacy', book: 2 }],
    ['legacy #book=1', { mode: 'legacy', book: 1 }],
    ['Warbreaker only', { mode: 'set', ids: [WB] }],
    ['bucket 3', { mode: 'set', ids: b3 }],
    ['bucket 1 + 2 (no Warbreaker)', { mode: 'set', ids: [...bucket(1), ...bucket(2)] }],
    ['other work only (mistborn-the-final-empire)', { mode: 'set', ids: ['mistborn-the-final-empire'] }],
    ['nothing read', { mode: 'set', ids: [] }],
  ];
  for (const [label, st] of states) {
    assert.deepEqual(seen(st), seen(st, parentSrc), label + ': same as parent');
  }
  const pick = (r: any, id: string) => r.sites.find((x: [string, boolean]) => x[0] === id)[1];
  for (const st of [{ mode: 'all' }, { mode: 'set', ids: [WB] }, { mode: 'legacy', book: 3 }] as St[]) {
    const r = seen(st);
    assert.ok(pick(r, 'ttelir') && pick(r, 'denir'), JSON.stringify(st) + ' shows both sites');
  }
  for (const st of [
    { mode: 'set', ids: [] },
    { mode: 'set', ids: ['mistborn-the-final-empire'] },
  ] as St[]) {
    const r = seen(st);
    assert.ok(!pick(r, 'ttelir') && !pick(r, 'denir'), JSON.stringify(st) + ' withholds both sites');
  }
});
