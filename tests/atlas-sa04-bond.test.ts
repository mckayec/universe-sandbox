/* SA04-BOND-01/02 (ChatGPT sa04-handoff-2026-11-20.md): on PR48 only, replace events.e40.text and the text
   element of Dalinar Kholin's existing numeric-key-8 codex `more` entry. id, book, world, site, title, array
   order, the key 8, the entry position and every other value are unchanged; no landmark, effect, coordinate,
   parent metadata, gate or mapping added. Event and codex-line visibility are checked with the ACTUAL engine
   selectors cut out of public/atlas/engine.js against the parent pack in the 11 enumerated reading states. */
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

const E40_NEW = 'At the Battle of Thaylen Field, Dalinar brings the three Realms together.';
const E40_OLD =
  'Odium sends his champion. Dalinar refuses to give in, binds the realms together and becomes the Bondsmith.';
const MORE_NEW = 'Brings the three Realms together at Thaylen City.';
const MORE_OLD = 'Becomes the Bondsmith.';
const ev = (t: string) => 'title: "The Battle of Thaylen Field", text: "' + t + '"}';
const mo = (t: string) => 'more: [[8, "' + t + '"], [12,';
const WOK = 'the-way-of-kings';
const OB = 'oathbringer';
const DS = 'dawnshard';

/* the actual parent pack (0d7637e): only these two strings differ */
assert.equal(packSrc.split(ev(E40_NEW)).length, 2, 'new e40 text occurs once');
assert.equal(packSrc.split(mo(MORE_NEW)).length, 2, 'new Dalinar key-8 text occurs once');
const parentSrc = packSrc.replace(ev(E40_NEW), ev(E40_OLD)).replace(mo(MORE_NEW), mo(MORE_OLD));

type St = { mode: 'set' | 'legacy' | 'all'; ids?: string[]; book?: number };
const dal = (p: any) => p.codex.find((g: any) => g.id === 'people').list.find((x: any) => x.name === 'Dalinar Kholin');

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
    __d: dal(p),
  });
  vm.runInContext(cut('const ARR=', '\n'), c);
  vm.runInContext(cut('const EFF=', '\n'), c);
  vm.runInContext(cut('const GCACHE=new WeakMap();', '/* intro copy'), c);
  vm.runInContext(cut('const firstOf=w=>', '\n'), c);
  vm.runInContext(cut('const evOk=', '\n'), c);
  vm.runInContext(cut('function cxMoreGate(', 'function renderCodex('), c);
  return { c, p };
}
/* entry and per-line predicates copied verbatim from renderCodex's list/more filters */
const seen = (st: St, src = packSrc) => {
  const { c } = setup(st, src);
  return J(
    vm.runInContext(
      `(()=>{const x=__d;
        const entry=PW()?pvis([gateOf(x,cxFirst(x))]):!CUM||!S.book||cxFirst(x)<=S.book;
        const lines=ARR(x.more).map((m,i)=>!!(m&&(PW()?pvis([gateOf(x,cxFirst(x)),cxMoreGate(x,m,i)]):m[0]<=EFF())));
        return {ev:EVENTS.filter(e=>e.world==='roshar').map(e=>[e.id,!!evOk(e)]),entry:!!entry,lines};})()`,
      c,
    ),
  );
};

test('SA04-BOND-01/02 payload: exact e40 and Dalinar key-8 texts; whole pack otherwise equal to the parent', () => {
  const { p } = setup({ mode: 'all' });
  const { p: pp } = setup({ mode: 'all' }, parentSrc);
  const e = p.events.find((x: any) => x.id === 'e40');
  assert.deepEqual(J(e), {
    id: 'e40',
    book: 8,
    world: 'roshar',
    site: 'thaylen',
    title: 'The Battle of Thaylen Field',
    text: E40_NEW,
  });
  assert.ok(!('lm' in e) && !('effect' in e), 'no lm/effect');
  assert.equal(pp.events.find((x: any) => x.id === 'e40').text, E40_OLD, 'parent control old e40 text');
  assert.deepEqual(J(dal(p).more), [
    [8, MORE_NEW],
    [12, 'Dies after renouncing Honor’s power.'],
  ]);
  assert.equal(dal(pp).more[0][1], MORE_OLD, 'parent control old codex text');
  assert.deepEqual(J(p.events.map((x: any) => x.id)), J(pp.events.map((x: any) => x.id)), 'event order unchanged');
  const strip = (pk: any) => {
    const x = J(pk);
    delete x.events.find((y: any) => y.id === 'e40').text;
    dal(x).more[0][1] = null;
    return x;
  };
  assert.deepEqual(strip(p), strip(pp), 'whole pack minus the two masked fields equals the parent');
  for (const x of ['Odium sends his champion', 'becomes the Bondsmith', MORE_OLD])
    assert.ok(!packSrc.includes(x), 'old copy absent: ' + x);
});

test('SA04-BOND-01/02 visibility: e40 and the key-8 line identical to the parent in the 11 enumerated states', () => {
  const { p } = setup({ mode: 'all' });
  const b8 = p.spoilers.works.filter((w: any) => w.bucket === 8).map((w: any) => w.id) as string[];
  assert.deepEqual(J(b8), [OB, DS], 'bucket 8 = Oathbringer + Dawnshard');
  const states: [string, St, boolean][] = [
    ['All', { mode: 'all' }, true],
    ['legacy #book=8', { mode: 'legacy', book: 8 }, true],
    ['legacy #book=12', { mode: 'legacy', book: 12 }, true],
    ['legacy #book=7', { mode: 'legacy', book: 7 }, false],
    ['nothing read', { mode: 'set', ids: [] }, false],
    ['Oathbringer only', { mode: 'set', ids: [OB] }, false],
    ['Dawnshard only', { mode: 'set', ids: [DS] }, false],
    ['WoK + Oathbringer', { mode: 'set', ids: [WOK, OB] }, false],
    ['bucket 8 only', { mode: 'set', ids: b8 }, false],
    ['WoK + Oathbringer + Dawnshard', { mode: 'set', ids: [WOK, OB, DS] }, true],
    ['WoK + Dawnshard', { mode: 'set', ids: [WOK, DS] }, false],
  ];
  for (const [label, st, want] of states) {
    const a = seen(st);
    assert.deepEqual(a, seen(st, parentSrc), label + ': same as parent');
    const e40 = a.ev.find((x: [string, boolean]) => x[0] === 'e40')[1];
    assert.equal(e40, want, label + ': e40 ' + (want ? 'shown' : 'withheld'));
    assert.equal(a.entry && a.lines[0], want, label + ': Dalinar key-8 line ' + (want ? 'shown' : 'withheld'));
  }
});
