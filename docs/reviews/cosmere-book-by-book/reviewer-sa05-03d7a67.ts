// Independent reviewer adaptation: actual fetched parent replaces builder's reconstructed parent; hashes, Akinah and parent visibility, and source equality added. Node 24+: node reviewer-sa05-03d7a67.ts INPUT_DIR. SA05_PARENT_NEGATIVE=1 tests actual parent as candidate.
/* SA05-N2-PORT (ChatGPT sa05-handoff-2026-11-20.md): on PR48 only, legacy bucket 8 year books[8].y changes from
   the number 2017 to the string "2017–2020" (Oathbringer 2017, Dawnshard ebook 2020). Bucket id, title, colour,
   the separate Dawnshard work year 2020, registry, presets, gates and all prose are unchanged. Event visibility
   is checked with the ACTUAL engine selectors cut out of public/atlas/engine.js against the parent pack in the
   11 enumerated reading states; the button title uses the engine's own expression, asserted present verbatim. */
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

import crypto from 'node:crypto';
import path from 'node:path';
const dir=process.argv[2] || '.';
const files: Record<string,string>={'public/atlas/engine.js':'engine.js','public/atlas/reading.js':'reading.js','public/atlas/packs/cosmere.js':process.env.SA05_PARENT_NEGATIVE ? 'parent.js' : 'head.js'};
const manifest={"head.js":"715b658363a852af635c7988ac5b5958874788bf","parent.js":"583abc7a47935530b160c7c7be43f8257cff0cd2","engine.js":"0bc5357a2043f3939512bc5b091eb4ffbbf1c5d0","reading.js":"4d9bc177294e5e33accf6f19825ef467f0bb90d4","test.ts":"86a5eb18b7c45d889006f588b5bb6eeef0d88de0"};
for(const [n,sha] of Object.entries(manifest)){const b=fs.readFileSync(path.join(dir,n));assert.equal(crypto.createHash('sha1').update('blob '+b.length+'\0').update(b).digest('hex'),sha,n);}
const read = (p: string) => fs.readFileSync(path.join(dir,files[p]),'utf8');
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

const parentSrc = fs.readFileSync(path.join(dir,'parent.js'),'utf8');

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
  for(const a of ['const filterOk=','const realmOk=','const siteEraOk=','const siteSeen=','function rdWorldHidden('])vm.runInContext(cut(a,'\n'),c);
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
    const site=(src:string)=>{const {c}=setup(st,src);return J(vm.runInContext("(()=>{const w=WORLD_BY.roshar;return [!!siteSeen(w.sites.find(s=>s.id==='akinah')),!!rdWorldHidden(w)]})()",c));};
    assert.deepEqual(site(packSrc),site(parentSrc),label+': Akinah and parent visibility');
    assert.equal(site(packSrc)[0],want,label+': Akinah expectation');
    const e42 = a.find((x: [string, boolean]) => x[0] === 'e42');
    assert.ok(e42, 'e42 present');
    assert.equal(e42[1], want, label + ': e42 ' + (want ? 'eligible' : 'withheld'));
  }
});

test('actual source equality and negative control',()=>{assert.equal(parentSrc.replace(OLD_LINE,NEW_LINE),packSrc);assert.notEqual(parentSrc,packSrc);});
