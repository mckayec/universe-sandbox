/* Regression tests for the COS-BB-001 implementation-review findings CBR-01..03 (ChatGPT review of PR48 1e588f0).
   They run the ACTUAL engine functions, cut out of public/atlas/engine.js, in a vm context with small state/DOM
   adapters (the same technique as the reviewer's reproduction, docs/reviews/cosmere-book-by-book/
   reviewer-reading-1e588f0.mjs), with the expectations inverted to the required behaviour. No GPU is involved:
   descent stops at buildPlanet. */
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

const engine = fs.readFileSync(new URL('../public/atlas/engine.js', import.meta.url), 'utf8');
const readingSrc = fs.readFileSync(new URL('../public/atlas/reading.js', import.meta.url), 'utf8');
const cut = (a: string, b: string) => {
  const i = engine.indexOf(a);
  assert.ok(i >= 0, 'marker not found: ' + a);
  const j = engine.indexOf(b, i);
  assert.ok(j > i, 'end marker not found: ' + b);
  return engine.slice(i, j);
};
const plain = (v: unknown) => JSON.parse(JSON.stringify(v));

const rc: any = { window: {}, URLSearchParams, Set, Map, WeakMap };
vm.createContext(rc);
vm.runInContext(readingSrc, rc);
const R = rc.window.AtlasReading;
const reg = R.normRegistry({
  spoilers: {
    works: [
      { id: 'a', title: 'A', bucket: 1 },
      { id: 'b', title: 'B', bucket: 2 },
    ],
  },
});

test('CBR-01: actual rdParams/storeRd persist a deliberate empty selection; reload never restores the old work', () => {
  for (const startHash of ['#read=a', '#upto=x:1:a']) {
    let stored: string | null = JSON.stringify({ mode: 'set', ids: ['a'] });
    const c: any = {
      RDG: R,
      RREG: reg,
      RD_KEY: 'test',
      lastRd: null,
      S: { rd: { mode: 'set', ids: ['a'] } },
      location: { hash: startHash },
      localStorage: { setItem: (_: string, v: string) => (stored = v) },
      URLSearchParams,
    };
    vm.createContext(c);
    vm.runInContext(cut('let RD_REJ=[];', '/* CBR-01: Back/Forward'), c);
    vm.runInContext(cut('function storeRd()', 'function readStored('), c);
    c.S.rd = R.toggleWork(c.S.rd, 'a', reg);
    c.q = new URLSearchParams();
    vm.runInContext('rdParams(q);storeRd();', c);
    const url = String(c.q);
    assert.equal(c.S.rd.mode, 'none');
    assert.equal(url, 'read=_none', 'the URL no longer carries the unticked work');
    assert.equal(stored, JSON.stringify({ mode: 'none' }), 'storage no longer holds the unticked work');
    for (const [hash, st] of [
      ['#' + url, stored],
      ['', stored],
    ]) {
      const s = R.initialState(hash, st, null, reg, 2).state;
      assert.deepEqual(plain(s), { mode: 'none' }, 'reload ' + hash);
    }
  }
});

test('CBR-01: the safe state keeps only the rejected parameters captured at start-up, never another entry’s', () => {
  const c: any = { RDG: R, S: { rd: { mode: 'safe', reason: 'x' } }, URLSearchParams };
  vm.createContext(c);
  vm.runInContext(cut('let RD_REJ=[];', '/* CBR-01: Back/Forward'), c);
  vm.runInContext('RD_REJ.push(["read","zz9"]);', c);
  c.location = { hash: '#read=a' }; // a Back/Forward entry with a positive link
  c.q = new URLSearchParams();
  vm.runInContext('rdParams(q);', c);
  assert.equal(String(c.q), 'read=zz9');
});

test('CBR-01: Back/Forward rewrites an older entry’s reading parameter to the current state, leaving others', () => {
  const calls: string[] = [];
  const c: any = {
    RDG: R,
    RREG: reg,
    urlReady: true,
    S: { rd: { mode: 'none' }, book: 0 },
    PW: () => true,
    location: { pathname: '/atlas/', search: '?pack=x', hash: '#read=a&world=w1&view=surface' },
    history: { state: { atlasSurface: true }, replaceState: (_: unknown, __: string, u: string) => calls.push(u) },
    URLSearchParams,
  };
  vm.createContext(c);
  vm.runInContext(cut('let RD_REJ=[];', 'const RD_KEY='), c);
  vm.runInContext('rdFixURL();', c);
  assert.deepEqual(calls, ['/atlas/?pack=x#read=_none&world=w1&view=surface']);
  calls.length = 0;
  c.location.hash = '#read=_none&world=w1';
  vm.runInContext('rdFixURL();', c);
  assert.deepEqual(calls, [], 'an entry already matching is not rewritten');
});

/* ---------- CBR-02 ---------- */
function eraCtx(world: any, read: string[]) {
  const c: any = {
    RDG: R,
    RREG: reg,
    RSET: new Set(read),
    CUM: true,
    EFF: () => 99,
    S: { book: 0, rd: { mode: 'set', ids: read } },
    PW: () => true,
    w: world,
    WORLD_BY: { [world.id]: world },
    WeakMap,
    Map,
    Object,
    Number,
    isFinite,
  };
  vm.createContext(c);
  c.GROUP_BY = {};
  vm.runInContext(cut('const GCACHE=new WeakMap();', 'let SITE_W=null;'), c);
  vm.runInContext('const worldChain=w=>[gateOf(w,firstOf(w))];const firstOf=w=>w.first||1;', c);
  vm.runInContext('const pvis=chain=>!!RREG&&RDG.visible(chain,RSET);', c);
  vm.runInContext(cut('const FCACHE=new WeakMap();', 'const RD_PH='), c);
  vm.runInContext(cut('function eraOn(w,k)', '/* intro copy'), c);
  vm.runInContext(cut('const eraAt=', 'function gatePW('), c);
  vm.runInContext(cut('const eraVal=', 'const realmOk='), c);
  vm.runInContext(cut('const eraKeys=', 'const bk1='), c);
  vm.runInContext(cut('function eraBlurb(w)', '/* Track A details'), c);
  const gfxSrc = cut('function gfxFor(w,book)', '\n');
  vm.runInContext(gfxSrc, c);
  return c;
}
const pick = (c: any) =>
  plain(
    vm.runInContext(
      '({blurb:eraBlurb(w),facts:eraVal(w,"facts")||null,short:eraVal(w,"short")||null,status:statusFor(w),gfx:gfxFor(w,0)})',
      c,
    ),
  );

test('CBR-02: era overrides pass world + era + world-field + era-field gates (actual selectors)', () => {
  const base = () => ({
    id: 'world',
    gate: { req: 'a' },
    blurb: 'base',
    short: 'base-short',
    status: 'base-status',
    gfx: { map: 'base' },
    eras: {} as any,
  });
  // reviewer case: era field gates restricted to B, only A read → base (or nothing) shown, never the secret
  const w1 = base();
  (w1 as any).gates = { blurb: { req: 'b' }, facts: { req: 'b' } };
  w1.eras[1] = {
    gate: { req: 'a' },
    blurb: 'SECRET-ERA',
    facts: [['k', 'SECRET-FACT']],
    gates: { blurb: { req: 'b' }, facts: { req: 'b' } },
  };
  let r = pick(eraCtx(w1, ['a']));
  assert.equal(r.blurb, '', 'parent field hidden and era field hidden');
  assert.equal(r.facts, null);
  // with B read both show
  r = pick(eraCtx(w1, ['a', 'b']));
  assert.equal(r.blurb, 'SECRET-ERA');
  assert.deepEqual(r.facts, [['k', 'SECRET-FACT']]);

  // era field gate only (world field public by inheritance): absent / invalid / public / needs controls
  const cases: [string, any, string[], string][] = [
    ['absent era field gate inherits era record gate', undefined, ['a'], 'ERA'],
    ['invalid era field gate hides only the field', { req: 'zz9' }, ['a', 'b'], 'base'],
    ['era field gate requiring B, only A read', { req: 'b' }, ['a'], 'base'],
    ['era field gate requiring B, B read', { req: 'b' }, ['a', 'b'], 'ERA'],
    ['explicit public era field under a readable era', { public: true }, ['a'], 'ERA'],
    ['needs B not met', { req: 'a', needs: 'b' }, ['a'], 'base'],
    ['needs B met', { req: 'a', needs: 'b' }, ['a', 'b'], 'ERA'],
  ];
  for (const [label, fg, read, want] of cases) {
    const w = base();
    w.eras[1] = { gate: { req: 'a' }, blurb: 'ERA', short: 'ERA', status: 'ERA', gfx: { map: 'ERA' } };
    if (fg !== undefined) w.eras[1].gates = { blurb: fg, short: fg, status: fg, gfx: fg };
    r = pick(eraCtx(w, read));
    for (const f of ['blurb', 'short', 'status'])
      assert.equal(r[f], want === 'ERA' ? 'ERA' : 'base' + (f === 'blurb' ? '' : '-' + f), label + ' ' + f);
    assert.equal(r.gfx.map, want, label + ' gfx');
  }

  // parent-hidden: a public era field never overrides a hidden world field or a hidden era record
  const w2 = base();
  (w2 as any).gates = { blurb: { req: 'b' } };
  w2.eras[1] = { gate: { req: 'a' }, blurb: 'ERA', gates: { blurb: { public: true } } };
  assert.equal(pick(eraCtx(w2, ['a'])).blurb, '', 'world field gate is an ancestor of the era field');
  const w3 = base();
  w3.eras[1] = {
    gate: { req: 'b' },
    blurb: 'ERA',
    status: 'ERA',
    gfx: { map: 'ERA' },
    gates: { blurb: { public: true } },
  };
  r = pick(eraCtx(w3, ['a']));
  assert.equal(r.blurb, 'base', 'hidden era record');
  assert.equal(r.status, 'base-status');
  assert.equal(r.gfx.map, 'base', 'gfx no longer bypasses the era record gate');
  // a hidden later era leaves the earlier visible override in place
  const w4 = base();
  w4.eras[1] = { gate: { req: 'a' }, blurb: 'ERA1' };
  w4.eras[2] = { gate: { req: 'a' }, blurb: 'ERA2', gates: { blurb: { req: 'b' } } };
  assert.equal(pick(eraCtx(w4, ['a'])).blurb, 'ERA1');
  // world status field gate hides the base status too
  const w5 = base();
  (w5 as any).gates = { status: { req: 'b' } };
  assert.equal(pick(eraCtx(w5, ['a'])).status, '');
});

test('CBR-02: legacy/All era selectors are unchanged (numeric rule)', () => {
  const w: any = {
    id: 'world',
    blurb: 'base',
    status: 's0',
    gfx: { map: 'm0' },
    eras: { 2: { blurb: 'E2', status: 's2', gfx: { map: 'm2' } } },
  };
  const c = eraCtx(w, []);
  c.PW = () => false;
  c.S.book = 1;
  c.EFF = () => 1;
  let r = plain(vm.runInContext('({b:eraBlurb(w),s:statusFor(w),g:gfxFor(w,1)})', c));
  assert.deepEqual(r, { b: 'base', s: 's0', g: { map: 'm0' } });
  c.S.book = 2;
  c.EFF = () => 2;
  r = plain(vm.runInContext('({b:eraBlurb(w),s:statusFor(w),g:gfxFor(w,2)})', c));
  assert.deepEqual(r, { b: 'E2', s: 's2', g: { map: 'm2' } });
});

/* ---------- CBR-03 ---------- */
function descendCtx(opts: { earth?: boolean } = {}) {
  const pending: (() => void)[] = [];
  const built: string[] = [];
  const ascended: number[] = [];
  const replaced: unknown[] = [];
  let hidden = false;
  let deferred: (() => void) | null = null;
  const bake = { hidden: true, querySelector: () => ({ style: {} }) };
  const d: any = {
    WORLD_BY: { w: { id: 'w', pos: {} }, v: { id: 'v', pos: {} } },
    RGEN: 0,
    RREG: {},
    S: { view: 'galaxy', book: 0, sel: null },
    MOB: false,
    urlReady: true,
    rdWorldHidden: (w: any) => hidden && w.id === 'w',
    rdNotRevealed: () => {},
    syncURL: () => {},
    noSurface: () => false,
    needRealm: () => null,
    transition: (fn: () => void) => pending.push(fn),
    hideTip: () => {},
    hint: () => {},
    UI: { hints: {} },
    $: () => bake,
    gfxFor: () => (opts.earth ? { base: 'earth' } : {}),
    loadEarth: () => ({ then: (f: () => void) => (deferred = f) }),
    orbW: { t: { set() {} }, gt: { set() {} } },
    fitDist: () => 1,
    buildPlanet: (w: any) => {
      built.push(w.id);
      throw new Error('STOP_AT_BUILD');
    },
    EARTH_TEX: null,
    GL_LBL: {},
    REGIONS: [],
    refreshAll: () => {},
    ascend: (f: () => void) => {
      ascended.push(1);
      d.S.view = 'galaxy';
      if (f) f();
    },
    urlFor: () => '#galaxy',
    history: {
      state: null as any,
      pushState(st: any) {
        this.state = st;
      },
      replaceState(st: any) {
        this.state = st;
        replaced.push(st);
      },
    },
  };
  vm.createContext(d);
  vm.runInContext(cut('/* CBR-03: a descent is a ticket', '/* Back from the surface.'), d);
  const run = (fn: () => void) => {
    try {
      fn();
    } catch (e: any) {
      if (e.message !== 'STOP_AT_BUILD') throw e;
    }
  };
  return {
    d,
    built,
    ascended,
    replaced,
    bake,
    hide: () => (hidden = true),
    commit: () => run(() => pending.shift()!()),
    finishEarth: () => run(() => deferred!()),
  };
}

test('CBR-03: pending descent re-checks generation, visibility and selection at commit', () => {
  // unchanged-state control: builds
  let t = descendCtx();
  vm.runInContext('descend("w")', t.d);
  t.commit();
  assert.deepEqual(t.built, ['w']);
  assert.equal(t.d.S.view, 'world');

  // narrowed reading state (world now hidden), selection cleared
  t = descendCtx();
  vm.runInContext('descend("w")', t.d);
  t.hide();
  t.d.RGEN++;
  t.d.S.sel = null;
  t.commit();
  assert.deepEqual(t.built, []);
  assert.equal(t.d.S.view, 'galaxy');
  assert.equal(t.d.history.state, null, 'its own pushed surface entry is neutralised');

  // invalid-link safe state entered while pending (hidden, selection kept by mistake): still cancelled
  t = descendCtx();
  vm.runInContext('descend("w")', t.d);
  t.hide();
  t.d.RGEN++;
  t.commit();
  assert.deepEqual(t.built, []);
  assert.equal(t.d.S.view, 'galaxy');
  assert.equal(t.d.S.sel, null, 'a hidden selection is dropped');

  // another world selected while pending
  t = descendCtx();
  vm.runInContext('descend("w")', t.d);
  t.d.S.sel = 'v';
  t.commit();
  assert.deepEqual(t.built, []);
  assert.equal(t.d.S.view, 'galaxy');

  // reading state changed but the world is still visible and selected: builds with the new state
  t = descendCtx();
  vm.runInContext('descend("w")', t.d);
  t.d.RGEN++;
  t.commit();
  assert.deepEqual(t.built, ['w']);

  // a newer descent supersedes an older pending one: only the newer builds
  t = descendCtx();
  vm.runInContext('descend("w");descend("v")', t.d);
  t.commit();
  t.commit();
  assert.deepEqual(t.built, ['v']);
});

test('CBR-03: deferred Earth-texture load re-checks before building', () => {
  let t = descendCtx({ earth: true });
  vm.runInContext('descend("w")', t.d);
  t.commit();
  assert.equal(t.d.S.view, 'world');
  t.finishEarth();
  assert.deepEqual(t.built, ['w'], 'control builds');

  t = descendCtx({ earth: true });
  vm.runInContext('descend("w")', t.d);
  t.commit();
  t.hide();
  t.d.RGEN++;
  t.finishEarth();
  assert.deepEqual(t.built, []);
  assert.equal(t.ascended.length, 1, 'leaves the empty surface');
  assert.equal(t.bake.hidden, true, 'its bake bar is hidden');
  assert.equal(t.d.S.view, 'galaxy');
});
