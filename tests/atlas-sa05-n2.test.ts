/* SA05-N2-PORT (ChatGPT sa05-handoff-2026-11-20.md): on PR48 only, legacy bucket 8 year books[8].y changes from
   the number 2017 to the string "2017–2020" (Oathbringer 2017, Dawnshard ebook 2020). Bucket id, title, colour,
   the separate Dawnshard work year 2020, registry, presets, gates and all prose are unchanged. Event visibility
   is checked with the ACTUAL engine selectors cut out of public/atlas/engine.js against the parent pack in the
   11 enumerated reading states; the button title uses the engine's own expression, asserted present verbatim. */
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

const NEW_LINE = '8: {n: "VIII", title: "Oathbringer & Dawnshard", y: "2017–2020", c: BOOKC[8]},';
const OLD_LINE = '8: {n: "VIII", title: "Oathbringer & Dawnshard", y: 2017, c: BOOKC[8]},';
assert.equal(packSrc.split(NEW_LINE).length, 2, 'new bucket-8 line occurs once');
const parentSrc = packSrc.replace(NEW_LINE, OLD_LINE);

/* the engine's legacy book-button title expression (engine.js book segment), copied verbatim */
const TITLE_EXPR = 'K.books[b].title+(K.books[b].y?" ("+K.books[b].y+")":"")';
const titleOf = (bk: any) => {
  const K = { books: { 8: bk } };
  const b = 8;
  return K.books[b].title + (K.books[b].y ? ' (' + K.books[b].y + ')' : '');
};

const WOK = 'the-way-of-kings';
const OB = 'oathbringer';
const DS = 'dawnshard';
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
  vm.runInContext(cut('const EFF=', '\n'), c);
  vm.runInContext(cut('const GCACHE=new WeakMap();', '/* intro copy'), c);
  vm.runInContext(cut('const firstOf=w=>', '\n'), c);
  vm.runInContext(cut('const evOk=', '\n'), c);
  return { c, p };
}
const evs = (st: St, src = packSrc) => {
  const { c } = setup(st, src);
  return J(vm.runInContext(`EVENTS.map(e=>[e.id,!!evOk(e)])`, c));
};

test('SA05-N2-PORT payload: bucket 8 year range; whole pack otherwise equal to the parent', () => {
  const { p } = setup({ mode: 'all' });
  const { p: pp } = setup({ mode: 'all' }, parentSrc);
  assert.equal(p.books[8].y, '2017–2020');
  assert.equal(pp.books[8].y, 2017, 'parent control: old numeric year');
  assert.equal(p.books[8].title, 'Oathbringer & Dawnshard');
  const ds = p.spoilers.works.find((w: any) => w.id === DS);
  assert.deepEqual(J(ds), { id: DS, title: 'Dawnshard', y: 2020, bucket: 8 }, 'separate Dawnshard work year 2020');
  assert.equal(p.spoilers.works.find((w: any) => w.id === OB).bucket, 8);
  const strip = (pk: any) => {
    const x = J(pk);
    x.books[8].y = null;
    return x;
  };
  assert.deepEqual(strip(p), strip(pp), 'whole parsed pack minus books[8].y equals the parent');
});

test('SA05-N2-PORT title: legacy bucket-8 button title shows the range, not 2017 alone', () => {
  assert.ok(engine.includes(TITLE_EXPR), 'engine title expression unchanged');
  const { p } = setup({ mode: 'all' });
  const { p: pp } = setup({ mode: 'all' }, parentSrc);
  assert.equal(titleOf(p.books[8]), 'Oathbringer & Dawnshard (2017–2020)');
  assert.equal(titleOf(pp.books[8]), 'Oathbringer & Dawnshard (2017)', 'parent control: old title');
  for (const k of Object.keys(p.books).filter(k => k !== '8'))
    assert.equal(titleOf(p.books[k]), titleOf(pp.books[k]), 'book ' + k + ' title unchanged');
});

test('SA05-N2-PORT visibility: every event identical to the parent; e42 per the 11-state table', () => {
  const { p } = setup({ mode: 'all' });
  const b8 = p.spoilers.works.filter((w: any) => w.bucket === 8).map((w: any) => w.id) as string[];
  assert.deepEqual(J(b8), [OB, DS], 'bucket 8 = Oathbringer + Dawnshard');
  const states: [string, St, boolean][] = [
    ['All', { mode: 'all' }, true],
    ['legacy #book=8', { mode: 'legacy', book: 8 }, true],
    ['legacy #book=12', { mode: 'legacy', book: 12 }, true],
    ['legacy #book=7', { mode: 'legacy', book: 7 }, false],
    ['nothing read', { mode: 'set', ids: [] }, false],
    ['Dawnshard only', { mode: 'set', ids: [DS] }, false],
    ['Oathbringer only', { mode: 'set', ids: [OB] }, false],
    ['WoK + Dawnshard', { mode: 'set', ids: [WOK, DS] }, false],
    ['WoK + Oathbringer', { mode: 'set', ids: [WOK, OB] }, false],
    ['bucket 8 only', { mode: 'set', ids: b8 }, false],
    ['WoK + Oathbringer + Dawnshard', { mode: 'set', ids: [WOK, OB, DS] }, true],
  ];
  for (const [label, st, want] of states) {
    const a = evs(st);
    assert.deepEqual(a, evs(st, parentSrc), label + ': all events same as parent');
    const e42 = a.find((x: [string, boolean]) => x[0] === 'e42');
    assert.ok(e42, 'e42 present');
    assert.equal(e42[1], want, label + ': e42 ' + (want ? 'eligible' : 'withheld'));
  }
});
