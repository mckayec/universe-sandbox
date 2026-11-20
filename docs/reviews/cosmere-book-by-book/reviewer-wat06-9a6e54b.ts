// Reviewer: actual fetched parent rather than reversed candidate. Node24+: node reviewer-wat06-9a6e54b.ts INPUT_DIR; PARENT_NEGATIVE=1 runs parent as candidate.
/* SA07-WAT06-OMIT (ChatGPT sa07-wat06-handoff-2026-11-20.md): on PR48 only, two spoiler clauses are omitted from
   Roshar: the base facts row "Moons" loses "(a fourth broke up long ago)" and the pool site desc loses its final
   sentence about Cultivation leaving. Nothing else changes. Visibility is checked with the ACTUAL engine selectors
   cut out of public/atlas/engine.js (eraVal, sDesc via the GCACHE block, evOk, siteSeen, rdWorldHidden) against
   the actual fetched Git parent pack in the 14 handoff states. */
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

import crypto from 'node:crypto'; import path from 'node:path';
const dir=process.argv[2]||'.';
const manifest={"head.js":"0f5f5dd897f959bfa9afe4bb8af04bc95fb38f21","parent.js":"92680a69eafaea2877851db4872b58006c9a46ea","engine.js":"0bc5357a2043f3939512bc5b091eb4ffbbf1c5d0","reading.js":"4d9bc177294e5e33accf6f19825ef467f0bb90d4","test.ts":"30f5d13ac9c980faa1ef4f1c0fe5c7e08eea98a7"};
for(const [n,sha] of Object.entries(manifest)){const b=fs.readFileSync(path.join(dir,n));assert.equal(crypto.createHash('sha1').update('blob '+b.length+'\0').update(b).digest('hex'),sha,n);}
const files:Record<string,string>={'public/atlas/engine.js':'engine.js','public/atlas/reading.js':'reading.js','public/atlas/packs/cosmere.js':process.env.PARENT_NEGATIVE?'parent.js':'head.js'};
const read=(p:string)=>fs.readFileSync(path.join(dir,files[p]),'utf8');
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

const MOON_OLD = 'Salas, Nomon, Mishim (a fourth broke up long ago)';
const MOON_NEW = 'Salas, Nomon, Mishim';
const POOL_NEW =
  'A crater lake in the Horneater Peaks: Roshar’s stable doorway into Shadesmar and the usual way worldhoppers arrive.';
const POOL_OLD = POOL_NEW + ' It vanished when Cultivation left in Wind and Truth.';
const CHANGES: [string, string][] = [
  ['"' + MOON_NEW + '"', '"' + MOON_OLD + '"'],
  ['"desc": "' + POOL_NEW + '"', '"desc": "' + POOL_OLD + '"'],
];
const parentSrc=fs.readFileSync(path.join(dir,'parent.js'),'utf8');
const WOK = 'the-way-of-kings';
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
    ['const EFF=', '\n'],
    ['const eraVal=', 'const realmOk='],
    ['const eraKeys=', '\n'],
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

const observe = (st: St, src = packSrc) => {
  const { c } = setup(st, src);
  return J(
    vm.runInContext(
      `(()=>{const w=WORLD_BY.roshar,s=w.sites.find(x=>x.id==='pool'),hidden=rdWorldHidden(w);` +
        `return {worldHidden:!!hidden,poolSeen:!hidden&&!!siteSeen(s),facts:hidden?null:eraVal(w,'facts'),` +
        `poolText:!hidden&&siteSeen(s)?sDesc(s):null,events:EVENTS.map(e=>[e.id,!!evOk(e)]),` +
        `sites:w.sites.map(s=>[s.id,!!siteSeen(s)])};})()`,
      c,
    ),
  );
};

test('SA07-WAT06 payload: two Roshar fields omitted; whole pack otherwise equal to the parent', () => {
  const { p } = setup({ mode: 'all' });
  const { p: pp } = setup({ mode: 'all' }, parentSrc);
  const get = (pk: any) => {
    const w = pk.worlds.find((x: any) => x.id === 'roshar');
    return { pool: w.sites.find((s: any) => s.id === 'pool'), moon: w.facts.find((f: any) => f[0] === 'Moons') };
  };
  const a = get(p);
  const b = get(pp);
  assert.equal(a.moon[1], MOON_NEW);
  assert.equal(a.pool.desc, POOL_NEW);
  assert.equal(b.moon[1], MOON_OLD, 'parent control: moon aside');
  assert.equal(b.pool.desc, POOL_OLD, 'parent control: departure sentence');
  const head = J(p);
  const hr = get(head);
  hr.moon[1] = MOON_OLD;
  hr.pool.desc = POOL_OLD;
  assert.deepEqual(head, J(pp), 'whole parsed pack with the two fields reversed equals the parent');
});

test('SA07-WAT06 visibility: 14 states, events/sites/world/pool identical to parent; omitted claims never returned', () => {
  const { p } = setup({ mode: 'all' });
  const all = p.spoilers.works.map((w: any) => w.id) as string[];
  const bucket = (k: number) => p.spoilers.works.filter((w: any) => w.bucket === k).map((w: any) => w.id) as string[];
  const states: [string, St][] = [
    ['All', { mode: 'all' }],
    ...[4, 9, 11, 12].map(book => ['legacy' + book, { mode: 'legacy', book }] as [string, St]),
    ['empty', { mode: 'set', ids: [] }],
    ['WoK only', { mode: 'set', ids: [WOK] }],
    ['WaT only', { mode: 'set', ids: [WAT] }],
    ['RoW only', { mode: 'set', ids: [ROW] }],
    ['bucket4', { mode: 'set', ids: bucket(4) }],
    ['bucket9', { mode: 'set', ids: bucket(9) }],
    ['buckets4+9', { mode: 'set', ids: [...bucket(4), ...bucket(9)] }],
    ['all minus WaT', { mode: 'set', ids: all.filter(id => id !== WAT) }],
    ['all works', { mode: 'set', ids: all }],
  ];
  let oldMoon = 0;
  let oldPool = 0;
  for (const [label, st] of states) {
    const now = observe(st);
    const old = observe(st, parentSrc);
    assert.equal(now.events.length, 63);
    assert.equal(now.sites.length, 52);
    assert.deepEqual(now.events, old.events, label + ': events');
    assert.deepEqual(now.sites, old.sites, label + ': sites');
    assert.equal(now.worldHidden, old.worldHidden, label + ': world');
    assert.equal(now.poolSeen, old.poolSeen, label + ': pool');
    if (now.facts) {
      const want = old.facts.map((f: any) => (f[0] === 'Moons' ? ['Moons', MOON_NEW] : f));
      assert.deepEqual(now.facts, want, label + ': facts');
    }
    if (now.poolText !== null) assert.equal(now.poolText, POOL_NEW, label + ': pool text');
    const s = JSON.stringify(now);
    assert.ok(!s.includes('fourth broke up') && !s.includes('Cultivation left'), label + ': omitted');
    if (old.facts?.some((f: any) => f[1] === MOON_OLD)) oldMoon++;
    if (old.poolText === POOL_OLD) oldPool++;
  }
  assert.equal(oldMoon, 10, 'parent negative control: moon aside reachable in 10/14');
  assert.equal(oldPool, 7, 'parent negative control: departure sentence reachable in 7/14');
});


test('whole source equals actual parent with exactly two substitutions',()=>{let expected=parentSrc;for(const [now,old] of CHANGES){assert.equal(packSrc.split(now).length,2);assert.equal(packSrc.split(old).length,1);assert.equal(parentSrc.split(old).length,2);expected=expected.replace(old,now);}assert.equal(packSrc,expected);});
