/* SEL03-GEO-01/02 (ChatGPT sel03-final-checkpoint-2026-11-17.md): two conservative site-description reductions in
   the Cosmere pack (mulladil.desc, maipon.desc). ids, names, coordinates, books, site order, Sel parent and every
   other field are unchanged; no gate/mapping added. Visibility is checked with the ACTUAL engine selectors cut out
   of public/atlas/engine.js against the parent pack in every reading state. */
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

const MUL_NEW = 'A mountainous region of the Rose Empire whose people are known as Strikers.';
const MUL_OLD = 'A mountainous province of the Rose Empire whose Strikers guard the passes to Teod.';
const MAI_NEW = 'Shai’s homeland and the heart of Forgery.';
const MAI_OLD = 'Shai’s homeland and the heart of Forgery; its position in the empire is not given.';

const SEL_SITES_TAIL = [
  {
    id: 'roseempire',
    name: 'The Imperial Seat (Rose Empire)',
    lat: 58.0,
    lon: -45.0,
    books: [7],
    desc: 'Capital of the Rose Empire on the northern continent, built on seven hills with the Rose Palace on the centre one. Here Shai rebuilds the emperor’s soul in The Emperor’s Soul.',
  },
  { id: 'mulladil', name: 'Mulla’dil', lat: 51.0, lon: -52.0, books: [7], desc: MUL_NEW },
  {
    id: 'dzhamar',
    name: 'Dzhamar',
    lat: 52.5,
    lon: -64.0,
    books: [7],
    desc: 'The swampy province of the Bloodsealers.',
  },
  { id: 'maipon', name: 'MaiPon', lat: 61.0, lon: -25.0, books: [7], desc: MAI_NEW },
];
const E30_TEXT =
  'A condemned Forger, Shai, has ninety-eight days to recreate Emperor Ashravan’s soul; his body has been healed, but his mind remains blank.';
const TES = 'the-emperors-soul';

/* the parent pack (17efc26): only the two descriptions differ */
const parentSrc = packSrc.replace(MUL_NEW, MUL_OLD).replace(MAI_NEW, MAI_OLD);

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
      `(()=>{const w=WORLD_BY.sel;return {world:typeof rdWorldHidden==='function'?!rdWorldHidden(w):null,` +
        `sites:w.sites.filter(s=>['roseempire','mulladil','dzhamar','maipon'].includes(s.id)).map(s=>[s.id,siteSeen(s)])};})()`,
      c,
    ),
  );
};

test('SEL03-GEO-01/02 payload: exact four Sel book-7 sites and order; only the two descriptions differ from the parent', () => {
  const { p } = setup({ mode: 'all' });
  const { p: pp } = setup({ mode: 'all' }, parentSrc);
  const sel = p.worlds.find((w: any) => w.id === 'sel');
  const psel = pp.worlds.find((w: any) => w.id === 'sel');
  assert.deepEqual(J(sel.books), [1, 7]);
  assert.equal(sel.first, 1);
  assert.ok(!('gate' in sel), 'Sel has no record gate');
  const ids = sel.sites.map((s: any) => s.id);
  const i = ids.indexOf('roseempire');
  assert.deepEqual(J(sel.sites.slice(i, i + 4)), SEL_SITES_TAIL);
  assert.equal(ids[i + 4], 'desert');
  for (const s of sel.sites.slice(i, i + 4)) {
    for (const k of ['gate', 'gates', 'rel', 'scene', 'lm']) assert.ok(!(k in s), s.id + ' has no ' + k);
  }
  /* every other world/site/event field identical to the parent */
  const strip = (pk: any) => {
    const x = J(pk);
    const w = x.worlds.find((w: any) => w.id === 'sel');
    for (const s of w.sites) if (s.id === 'mulladil' || s.id === 'maipon') delete s.desc;
    return x;
  };
  assert.deepEqual(strip(p), strip(pp));
  assert.deepEqual(J(psel.sites.map((s: any) => s.id)), J(ids), 'site order unchanged');
  assert.equal(psel.sites.find((s: any) => s.id === 'mulladil').desc, MUL_OLD, 'parent control has old mulladil');
  assert.equal(psel.sites.find((s: any) => s.id === 'maipon').desc, MAI_OLD, 'parent control has old maipon');
  /* removed phrases gone; e30 kept exactly as accepted */
  assert.ok(!packSrc.includes('passes to Teod'), 'pass-duty phrase absent');
  assert.ok(!packSrc.includes('position in the empire is not given'), 'absence assertion absent');
  assert.equal(packSrc.split(MUL_NEW).length, 2, 'new mulladil desc once');
  assert.equal(packSrc.split(MAI_NEW + '"').length, 2, 'new maipon desc once');
  assert.equal(p.events.find((e: any) => e.id === 'e30').text, E30_TEXT, 'e30 unchanged');
});

test('SEL03-GEO-01/02 visibility: Sel and its four book-7 sites identical to the parent across All, legacy, sufficient and incomplete sets', () => {
  const b1 = bucket(1);
  const b7 = bucket(7);
  assert.ok(b7.includes(TES), 'TES is a bucket-7 work');
  const states: [string, St][] = [
    ['All', { mode: 'all' }],
    ['legacy #book=7', { mode: 'legacy', book: 7 }],
    ['legacy #book=10', { mode: 'legacy', book: 10 }],
    ['legacy #book=6', { mode: 'legacy', book: 6 }],
    ['legacy #book=1', { mode: 'legacy', book: 1 }],
    ['sufficient: bucket 1 + bucket 7', { mode: 'set', ids: [...b1, ...b7] }],
    ['TES only', { mode: 'set', ids: [TES] }],
    ['bucket 7 without bucket 1', { mode: 'set', ids: b7 }],
    ['bucket 1 + TES only', { mode: 'set', ids: [...b1, TES] }],
    ['other work only (mistborn-the-final-empire)', { mode: 'set', ids: ['mistborn-the-final-empire'] }],
    ['nothing read', { mode: 'set', ids: [] }],
  ];
  for (const [label, st] of states) {
    assert.deepEqual(seen(st), seen(st, parentSrc), label + ': same as parent');
  }
  const all = seen({ mode: 'all' });
  assert.ok(
    all.sites.every((x: [string, boolean]) => x[1]),
    'All shows all four sites',
  );
});
