/* Regression tests for CBR-04 (ChatGPT parent-surface review of PR48 7155f0a): the world-specific realm card
   (realmCard) and realm appearance (realmLook → applyRealmToPlanet uniforms) must honour the per-work "realms"
   field gate intersected with the world chain. They run the ACTUAL engine functions cut out of
   public/atlas/engine.js with the real Cosmere pack and reading helper, like docs/reviews/cosmere-book-by-book/
   reviewer-realms-7155f0a.mjs. The injected field gates are TEST FIXTURES only, not canon mappings. */
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

type Mode = 'set' | 'legacy' | 'all';

function setup(fieldGate: unknown, mode: Mode = 'set') {
  const c: any = { window: {}, Set, Map, WeakMap, URLSearchParams };
  vm.createContext(c);
  vm.runInContext(readingSrc, c);
  vm.runInContext(packSrc, c);
  const p = c.window.ATLAS_PACKS.cosmere;
  const R = c.window.AtlasReading;
  const reg = R.normRegistry(p);
  assert.ok(reg.ok, 'registry valid');
  const w = p.worlds.find((x: any) => x.id === 'scadrial');
  if (fieldGate !== undefined) w.gates = { ...w.gates, realms: fieldGate };
  const readIds = [...reg.buckets.get(2), ...reg.buckets.get(4)];
  const st = { mode };
  Object.assign(c, {
    RDG: R,
    RREG: reg,
    RSET: new Set(readIds),
    WORLDS: p.worlds,
    WORLD_BY: Object.fromEntries(p.worlds.map((x: any) => [x.id, x])),
    PW: () => st.mode === 'set',
    CUM: true,
    S: { realm: 'cognitive', book: mode === 'legacy' ? 4 : 0 },
    RL: p.realms,
    RCOG: p.realms.cognitive,
    RSPI: p.realms.spiritual,
    SHARDS: p.realms.spiritual.shards,
    world: w,
    esc: (s: unknown) => String(s),
  });
  vm.runInContext(cut('const GCACHE=new WeakMap();', '/* a world era (child record)'), c);
  vm.runInContext(cut('const firstOf=w=>', '\n'), c);
  vm.runInContext(cut('const STYLE_IX=', 'function applyRealmToPlanet'), c);
  vm.runInContext(cut('const realmFirst=r=>', 'function renderRealmBar'), c);
  vm.runInContext(cut('function realmCard(w)', 'if($("#realms"))'), c);
  return { c, w, reg };
}

const own = (c: any, w: any) => {
  const card: string = vm.runInContext('realmCard(world)', c);
  const look = vm.runInContext('realmLook(world)', c);
  const rc = w.realms.cognitive;
  return {
    card,
    look,
    ownCard: card.includes(rc.name) || card.includes(rc.blurb),
    ownLook: look.c1 === rc.c1 || look.c2 === rc.c2 || look.c3 === rc.c3,
  };
};

const CASES: [string, unknown, Mode, boolean][] = [
  ['unread valid field gate (fixture)', { req: 'mistborn-secret-history' }, 'set', false],
  ['present-invalid field gate (fixture)', {}, 'set', false],
  ['satisfied field gate (fixture)', { req: 'the-way-of-kings' }, 'set', true],
  ['absent field gate inherits the visible world', undefined, 'set', true],
  ['legacy book 4 ignores the per-work field gate', { req: 'mistborn-secret-history' }, 'legacy', true],
  ['All ignores the per-work field gate', { req: 'mistborn-secret-history' }, 'all', true],
];

for (const [label, gate, mode, expectOwn] of CASES) {
  test('CBR-04 realmCard + realmLook: ' + label, () => {
    const { c, w } = setup(gate, mode);
    const r = own(c, w);
    assert.equal(r.ownCard, expectOwn, 'realm card world-specific name/blurb');
    assert.equal(r.ownLook, expectOwn, 'realm look world-specific colours');
    if (!expectOwn) {
      const g = c.RCOG.look || {};
      assert.equal(r.look.c1, g.c1 || '#6a4ab0', 'denied look falls back to the generic Cognitive look');
      assert.equal(r.look.c2, g.c2 || '#b8a0ff');
      assert.equal(r.look.c3, g.c3 || '#121018');
      assert.ok(!r.card.includes(w.realms.cognitive.name), 'no world-specific realm name');
    }
  });
}

test('CBR-04: allowed → denied while the world is open downgrades card and look; denied → allowed restores', () => {
  // fixture gate on Warbreaker (read); unticking only that work keeps Scadrial and the Cognitive realm open
  const { c, w, reg } = setup({ req: 'warbreaker' }, 'set');
  c.RSET = new Set([...reg.buckets.get(2), ...reg.buckets.get(3), ...reg.buckets.get(4)]);
  assert.ok(own(c, w).ownCard && own(c, w).ownLook, 'starts allowed');
  const all = [...reg.buckets.get(2), ...reg.buckets.get(3), ...reg.buckets.get(4)];
  c.RSET = new Set(all.filter((id: string) => id !== 'warbreaker'));
  assert.equal(vm.runInContext('pvis(worldChain(world))', c), true, 'world stays visible');
  assert.equal(vm.runInContext('realmOpen("cognitive")', c), true, 'Cognitive realm stays open');
  const down = own(c, w);
  assert.equal(down.ownCard, false, 'card downgraded');
  assert.equal(down.ownLook, false, 'look downgraded');
  c.RSET = new Set(all);
  const up = own(c, w);
  assert.ok(up.ownCard && up.ownLook, 'restored when re-allowed');
});

test('CBR-04: applyRd re-applies the realm look to the open planet before refresh', () => {
  const src = cut('function applyRd(st){', 'function rdUnreviewed(');
  assert.match(src, /applyRealmToPlanet\(\);refreshAll\(\);\}/);
});
