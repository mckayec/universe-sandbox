/* Independent SA04-BOND review at 766f7a75d6825b4de88bb3667fde49ab971cbca6.
Node 24+: SA04_INPUT_DIR=<inputs> node --test reviewer-sa04-766f7a7.ts.
Inputs: head.js, parent.js, engine.js, reading.js, test.ts fetched from GitHub.
SA04_NEGATIVE=1 substitutes actual parent; payload must fail, visibility pass.
Adapted submitted test with actual fetched parent, not reconstruction. */

import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import crypto from 'node:crypto';
import path from 'node:path';

const dir = process.env.SA04_INPUT_DIR || '.';
const manifest: Record<string,string> = {
  "head.js": "583abc7a47935530b160c7c7be43f8257cff0cd2",
  "parent.js": "ae2a877eb9a667c332e0f5b96ea22c89b5c91f35",
  "engine.js": "0bc5357a2043f3939512bc5b091eb4ffbbf1c5d0",
  "reading.js": "4d9bc177294e5e33accf6f19825ef467f0bb90d4",
  "test.ts": "a66e7641c725704b2721ec230c9f25d617f6e4c7"
};
for (const [n, expected] of Object.entries(manifest)) {
  const b=fs.readFileSync(path.join(dir,n));
  const actual=crypto.createHash('sha1').update(Buffer.from('blob '+b.length+'\0')).update(b).digest('hex');
  assert.equal(actual,expected,n+' Git blob');
}
console.log('Verified 5/5 exact Git blobs');
const names: Record<string,string> = {'public/atlas/engine.js':'engine.js','public/atlas/reading.js':'reading.js','public/atlas/packs/cosmere.js':process.env.SA04_NEGATIVE?'parent.js':'head.js'};
const read=(p:string)=>fs.readFileSync(path.join(dir,names[p]),'utf8');
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

/* Independent comparison uses the actual fetched parent, 0d7637e. */
const parentSrc = fs.readFileSync(path.join(dir,'parent.js'),'utf8');

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

test('SA04 source delta and two independent old-parent negative controls', () => {
  const actualHead=fs.readFileSync(path.join(dir,'head.js'),'utf8');
  assert.equal(parentSrc.replace(ev(E40_OLD),ev(E40_NEW)).replace(mo(MORE_OLD),mo(MORE_NEW)),actualHead,'only two source-string replacements');
  const {p:pp}=setup({mode:'all'},parentSrc);
  assert.notEqual(pp.events.find((e:any)=>e.id==='e40').text,E40_NEW,'parent fails new event copy');
  assert.notEqual(dal(pp).more[0][1],MORE_NEW,'parent fails new codex copy');
});
