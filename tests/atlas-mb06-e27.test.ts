/* MB06-E27-01 (ChatGPT mb06-e27-handoff-2026-11-19.md): one-field narrowing of e27.text in the Cosmere pack.
   id, book, world, elendel site, title and array position unchanged; no gate/gates/lm/fx added; the existing
   Scadrial → Elendel → e27 chain is unchanged, so visibility is identical before and after. These tests run the
   ACTUAL engine selectors cut out of public/atlas/engine.js with the real Cosmere pack and reading helper. */
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

const E27_TEXT = 'Wax investigates murders in Elendel as labor unrest grows.';
const E27_OLD =
  'A rogue kandra murders her way through the city’s elite, and Harmony’s quiet influence comes into the open.';
const E27 = {
  id: 'e27',
  book: 6,
  world: 'scadrial',
  site: 'elendel',
  title: 'Shadows of Self',
  text: E27_TEXT,
};
const SOS = 'shadows-of-self';

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
const vis = (st: St, src = packSrc) => {
  const { c, p } = setup(st, src);
  c.__e = p.events.find((e: any) => e.id === 'e27');
  return J(
    vm.runInContext(
      `(()=>{const w=WORLD_BY.scadrial;const s=w.sites.find(x=>x.id==='elendel');` +
        `return {ev:evOk(__e),chain:evChain(__e),world:!rdWorldHidden(w),site:siteSeen(s)};})()`,
      c,
    ),
  );
};
/* the parent pack (88dc662): only the e27 text differs */
const parentSrc = packSrc.replace(E27_TEXT, E27_OLD);

test('MB06-E27-01 payload: exact e27 record, no gate/gates/lm/fx; only e27.text differs from the parent; old wording gone', () => {
  const { p } = setup({ mode: 'all' });
  const { p: pp } = setup({ mode: 'all' }, parentSrc);
  const ids = p.events.map((e: any) => e.id);
  const i = ids.indexOf('e27');
  assert.deepEqual(J(ids.slice(i - 1, i + 2)), ['e26', 'e27', 'e28']);
  assert.deepEqual(J(p.events[i]), E27);
  for (const k of ['gate', 'gates', 'lm', 'fx']) assert.ok(!(k in p.events[i]), 'e27 has no ' + k);
  assert.equal(pp.events.find((e: any) => e.id === 'e27').text, E27_OLD, 'parent control has old e27');
  const strip = (pk: any) => {
    const x = J(pk);
    delete x.events.find((e: any) => e.id === 'e27').text;
    return x;
  };
  assert.deepEqual(strip(p), strip(pp), 'whole pack minus e27.text identical to parent');
  assert.ok(!packSrc.includes(E27_OLD), 'old e27 wording absent');
  assert.ok(!packSrc.includes('rogue kandra'), 'no residual rogue-kandra wording');
  assert.ok(!packSrc.includes('Harmony’s quiet influence'), 'no residual Harmony wording');
  assert.equal(packSrc.split(E27_TEXT).length, 2, 'new wording appears exactly once');
});

test('MB06-E27-01 visibility: identical to the parent pack; e27 never shows without its Scadrial/Elendel parent', () => {
  const b2 = bucket(2);
  const b6 = bucket(6);
  assert.ok(b6.includes(SOS), 'Shadows of Self is a bucket-6 work');
  /* [label, state, e27 visible, Scadrial visible, Elendel site visible]. Elendel carries since:6, so with the
     All/legacy era cursor below 6 the site marker is era-hidden while e27 still lists (pre-existing, same as parent). */
  const states: [string, St, boolean, boolean, boolean][] = [
    ['All', { mode: 'all' }, true, true, false],
    ['legacy #book=6', { mode: 'legacy', book: 6 }, true, true, true],
    ['legacy #book=10', { mode: 'legacy', book: 10 }, true, true, true],
    ['legacy #book=5', { mode: 'legacy', book: 5 }, false, true, false],
    ['legacy #book=2', { mode: 'legacy', book: 2 }, false, true, false],
    ['sufficient: original trilogy + bucket 6', { mode: 'set', ids: [...b2, ...b6] }, true, true, true],
    ['MB06 only (parent-held)', { mode: 'set', ids: [SOS] }, false, false, false],
    ['bucket 6 without trilogy', { mode: 'set', ids: b6 }, false, false, false],
    ['original trilogy + MB06 only', { mode: 'set', ids: [...b2, SOS] }, false, true, false],
    [
      'original trilogy + bucket 6 minus MB06',
      { mode: 'set', ids: [...b2, ...b6].filter(x => x !== SOS) },
      false,
      true,
      false,
    ],
    ['original trilogy only', { mode: 'set', ids: b2 }, false, true, false],
    ['nothing read', { mode: 'set', ids: [] }, false, false, false],
  ];
  for (const [label, st, ev, world, site] of states) {
    const head = vis(st);
    const parent = vis(st, parentSrc);
    assert.deepEqual(head, parent, label + ': same as parent (visibility and gate chain)');
    assert.deepEqual([head.ev, head.world, head.site], [ev, world, site], label);
    if (head.ev) assert.ok(head.world, label + ': e27 never visible without Scadrial');
    if (st.mode === 'set' && head.ev) assert.ok(head.site, label + ': per-work e27 never visible without Elendel');
  }
  assert.equal(vis({ mode: 'all' }).ev, true, 'All shows e27');
  assert.equal(vis({ mode: 'set', ids: [] }).ev, false, 'nothing read hides e27');
  assert.equal(vis({ mode: 'set', ids: [SOS] }).ev, false, 'MB06 alone stays parent-held');
});
