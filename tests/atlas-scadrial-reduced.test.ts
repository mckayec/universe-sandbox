/* Scadrial reduced-parent disposition (ChatGPT finite disposition, 2026-11-16): the unverified orbital-order,
   moon, named-Shard and magic-system payloads are removed from Scadrial's base status/facts AND from the era
   overrides that would otherwise reintroduce them; the facts field carries its own MB01 gate (only the ruler
   fact remains); a `model` qualifier labels the drawn surface and sun colour as an artist's model. No record
   gate, books, first/until, realm payload or accepted field changes. These tests run the ACTUAL engine
   selectors cut out of public/atlas/engine.js with the real Cosmere pack and reading helper, and check the
   existing gate contract (no new canon threshold) across reading states. */
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

const MB = ['mistborn-the-final-empire', 'mistborn-the-well-of-ascension', 'mistborn-the-hero-of-ages'];
const MB01_GATE = { in: [MB[0]], req: MB[0] };
const REMOVED = [
  'First planet',
  '1st from the sun',
  'no moon',
  'Preservation and Ruin',
  'Harmony (Ruin and Preservation)',
  'Allomancy, Feruchemy, Hemalurgy',
];
const MODEL =
  'Artist’s model: this surface and the colour of its sun are illustrations made for the atlas, not a verified map or measurement from the books.';
const COG_NAME = 'Expanse of the Vapors';

const J = (x: unknown) => JSON.parse(JSON.stringify(x));
type St = { mode: 'set' | 'legacy' | 'all'; ids?: string[]; book?: number };

function setup(st: St) {
  const c: any = { window: {}, Set, Map, WeakMap, URLSearchParams };
  vm.createContext(c);
  vm.runInContext(readingSrc, c);
  vm.runInContext(packSrc, c);
  const p = c.window.ATLAS_PACKS.cosmere;
  const R = c.window.AtlasReading;
  const reg = R.normRegistry(p);
  assert.ok(reg.ok, 'registry valid');
  const w = p.worlds.find((x: any) => x.id === 'scadrial');
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
    LY: null,
    S: { realm: 'cognitive', book: st.mode === 'legacy' ? st.book : 0 },
    RL: p.realms,
    RCOG: p.realms.cognitive,
    RSPI: p.realms.spiritual,
    SHARDS: p.realms.spiritual.shards,
    world: w,
    esc: (s: unknown) => String(s),
  });
  vm.runInContext('const EFF=()=>S.book||99;', c);
  vm.runInContext(cut('const GCACHE=new WeakMap();', '/* intro copy'), c);
  vm.runInContext(cut('const firstOf=w=>', '\n'), c);
  vm.runInContext(cut('const eraVal=', '\nconst realmOk'), c);
  vm.runInContext(cut('const eraKeys=', '\n'), c);
  vm.runInContext(cut('function statusFor(w)', 'const bk1='), c);
  vm.runInContext(cut('function modelNote(w)', '/* Track A details'), c);
  vm.runInContext(cut('const STYLE_IX=', 'function applyRealmToPlanet'), c);
  vm.runInContext(cut('const realmFirst=r=>', 'function renderRealmBar'), c);
  vm.runInContext(cut('function realmCard(w)', 'if($("#realms"))'), c);
  return { c, w, reg, p };
}

/* every surface the dossier/tooltip builds from the parent record */
function surfaces(c: any) {
  const r = (x: string) => vm.runInContext(x, c);
  const facts = r('eraVal(world,"facts")') || [];
  return {
    name: r('wName(world)') as string,
    status: r('statusFor(world)') as string,
    facts: Array.from(facts, (f: string[]) => f[0] + ': ' + f[1]) as string[],
    blurb: r('eraBlurb(world)') as string,
    star: r('!!(world.star&&world.star.name&&fOk(world,"star",worldChain(world)))') as boolean,
    model: r('modelNote(world)') as string,
    card: r('realmCard(world)') as string,
    visible: r('!PW()||pvis(worldChain(world))') as boolean,
  };
}
const text = (s: ReturnType<typeof surfaces>) =>
  [s.name, s.status, s.facts.join('|'), s.blurb, s.model, s.card].join('\n');

test('payload: removed claims are gone from base and every era override; no record gate or threshold change', () => {
  const { w: w0, p: p0 } = setup({ mode: 'all' });
  const w = J(w0);
  const p = J({ realms: p0.realms });
  assert.equal(w.status, 'The Final Empire');
  assert.deepEqual(w.facts, [['Ruler', 'The Lord Ruler']]);
  assert.deepEqual(w.gates.facts, MB01_GATE);
  assert.deepEqual(w.gates.blurb, MB01_GATE, 'accepted blurb gate unchanged');
  assert.deepEqual(w.gates.short, MB01_GATE, 'accepted short gate unchanged');
  assert.equal(w.model, MODEL);
  assert.equal(Object.prototype.hasOwnProperty.call(w, 'gate'), false, 'no record gate');
  assert.deepEqual([w.books, w.first, w.name, w.group], [[2, 6, 7, 10, 12], 2, 'Scadrial', 'scadrian']);
  assert.deepEqual(w.star, { name: 'Scadrial’s sun', col: '#ffd8a0' }, 'star object unchanged (held)');
  assert.equal(w.realms.cognitive.name, COG_NAME, 'Cognitive payload held unchanged');
  assert.deepEqual(Object.keys(w.eras), ['6', '10']);
  assert.equal(w.eras[6].status, 'Harmony’s world · the Elendel Basin');
  assert.deepEqual(w.eras[6].facts, [['Era', 'Industrial, about 300 years after Mistborn']]);
  assert.equal(w.eras[10].status, 'Harmony’s world · under threat from outside');
  assert.equal(w.eras[6].gate, undefined);
  assert.equal(w.eras[10].gate, undefined);
  const own = JSON.stringify({ s: w.status, f: w.facts, e: w.eras });
  for (const x of REMOVED) assert.ok(!own.includes(x), 'removed from base/eras: ' + x);
  const lu = w.sites.find((s: any) => s.id === 'luthadel');
  assert.deepEqual([lu.gates.name, lu.gates.desc, lu.until, lu.lat, lu.lon], [MB01_GATE, MB01_GATE, 6, 70, 0]);
  const sub = p.realms.cognitive.subastrals.find((s: any) => s.world === 'scadrial');
  assert.equal(sub.first, 7, 'subastral threshold unchanged');
  assert.equal(p.realms.cognitive.first, 4, 'global Cognitive threshold unchanged');
});

/* the eight subsets of the original trilogy (empty included) */
const SUBSETS: string[][] = [];
for (let m = 0; m < 8; m++) SUBSETS.push(MB.filter((_, i) => m & (1 << i)));

for (const ids of SUBSETS) {
  const label = ids.length ? ids.map(x => 'MB0' + (MB.indexOf(x) + 1)).join('+') : 'none selected';
  test('per-work ' + label + ': parent stays held unless all three are read; reduced copy only', () => {
    const { c } = setup({ mode: 'set', ids });
    const s = surfaces(c);
    const full = ids.length === 3;
    assert.equal(s.visible, full, 'world chain (bucket fallback) unchanged');
    for (const x of REMOVED) assert.ok(!text(s).includes(x), 'no removed claim: ' + x);
    if (full) {
      assert.equal(s.name, 'Scadrial');
      assert.equal(s.status, 'The Final Empire');
      assert.deepEqual(s.facts, ['Ruler: The Lord Ruler']);
      assert.equal(s.model, '<p class="srcnote model">' + MODEL + '</p>');
      assert.equal(s.star, true);
    } else {
      assert.equal(s.name, 'An unrevealed world', 'label falls back without the name');
      assert.equal(s.status, '');
      assert.deepEqual(s.facts, []);
      assert.equal(s.blurb, '');
      assert.equal(s.model, '');
      assert.equal(s.star, false);
      assert.ok(!text(s).includes('Scadrial') && !text(s).includes(COG_NAME), 'no name or subastral leak');
    }
  });
}

test('per-work later-era-only (bucket 6 works without the original trilogy): parent and children stay hidden', () => {
  const { c, reg } = setup({ mode: 'set', ids: [...reg0().buckets.get(6)] });
  void reg;
  const s = surfaces(c);
  assert.equal(s.visible, false);
  assert.equal(s.name, 'An unrevealed world');
  assert.equal(s.status, '');
  assert.deepEqual(s.facts, []);
  assert.equal(s.blurb, '');
  assert.equal(s.model, '');
  for (const x of REMOVED) assert.ok(!text(s).includes(x));
  assert.equal(vm.runInContext('eraOn(world,6)', c), false, 'era 6 child cannot bypass the held parent');
});

test('per-work OT + bucket 6: era-6 status/facts appear only through the MB01 facts gate and stay reduced', () => {
  const { c } = setup({ mode: 'set', ids: [...MB, ...reg0().buckets.get(6)] });
  const s = surfaces(c);
  assert.equal(s.visible, true);
  assert.equal(s.status, 'Harmony’s world · the Elendel Basin');
  assert.deepEqual(s.facts, ['Era: Industrial, about 300 years after Mistborn']);
  for (const x of REMOVED) assert.ok(!text(s).includes(x));
});

test('descendants (sites, events) cannot bypass the held parent', () => {
  for (const ids of SUBSETS.filter(x => x.length < 3)) {
    const { c, w, p } = setup({ mode: 'set', ids });
    for (const st of w.sites) {
      vm.runInContext('globalThis.__s=null', c);
      c.__s = st;
      assert.equal(vm.runInContext('pvis(siteChain(__s))', c), false, 'site ' + st.id);
      assert.equal(vm.runInContext('sName(__s)', c), 'An unrevealed place', 'site name ' + st.id);
    }
    for (const e of p.events.filter((x: any) => x.world === 'scadrial')) {
      c.__e = e;
      assert.equal(vm.runInContext('pvis(evChain(__e))', c), false, 'event ' + e.id);
    }
  }
});

for (const [book, status, facts] of [
  [2, 'The Final Empire', ['Ruler: The Lord Ruler']],
  [6, 'Harmony’s world · the Elendel Basin', ['Era: Industrial, about 300 years after Mistborn']],
  [10, 'Harmony’s world · under threat from outside', ['Era: Industrial, about 300 years after Mistborn']],
] as [number, string, string[]][]) {
  test('legacy #book=' + book + ': numeric rule unchanged, reduced payload shown', () => {
    const { c } = setup({ mode: 'legacy', book });
    const s = surfaces(c);
    assert.equal(s.name, 'Scadrial');
    assert.equal(s.status, status);
    assert.deepEqual(s.facts, facts);
    assert.ok(s.model.includes(MODEL));
    for (const x of REMOVED) assert.ok(!text(s).includes(x));
  });
}

test('All: reduced payload in the base → latest-era status and the era facts', () => {
  const { c } = setup({ mode: 'all' });
  const s = surfaces(c);
  assert.equal(s.status, 'The Final Empire → Harmony’s world · under threat from outside');
  assert.deepEqual(s.facts, ['Era: Industrial, about 300 years after Mistborn']);
  assert.ok(s.model.includes(MODEL));
  for (const x of REMOVED) assert.ok(!text(s).includes(x));
});

test('model note obeys a present gates.model (fixture) and an invalid one fails closed', () => {
  for (const [g, want] of [
    [{ req: 'mistborn-secret-history' }, false],
    [{}, false],
    [MB01_GATE, true],
  ] as [unknown, boolean][]) {
    const { c, w } = setup({ mode: 'set', ids: MB });
    w.gates = { ...w.gates, model: g };
    assert.equal(vm.runInContext('modelNote(world)', c) !== '', want, JSON.stringify(g));
  }
});

let REG: any = null;
function reg0() {
  if (!REG) REG = setup({ mode: 'all' }).reg;
  return REG;
}
