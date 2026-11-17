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
const SH_UNKNOWN =
  'No world-specific description is provided in this view. The appearance is an illustration, not a verified map.';

/* MB05 bounded Elendel setting (ChatGPT era6-handoff-2026-11-16.md): three nested era-6 fields with their own gates */
const AOL = 'the-alloy-of-law';
const MB05_GATE = { in: [AOL], req: AOL };
const MB05 = {
  status: 'The Alloy of Law · industrial Elendel',
  blurb:
    'In The Alloy of Law, Elendel has railways, canals, electric street lighting and steel-framed towers under construction. Horseless carriages share its streets with horse-drawn vehicles.',
  facts: [['Era', 'About 300 years after the original Mistborn trilogy']],
};
const MB05_FACT = 'Era: About 300 years after the original Mistborn trilogy';
/* MB10 one-field era-10 status (ChatGPT era10-handoff-2026-11-16.md) with its own the-lost-metal gate */
const TLM = 'the-lost-metal';
const MB10_GATE = { in: [TLM], req: TLM };
const MB10_STATUS = 'The Lost Metal · Elendel and the Outer Cities in tension';
const OLD_ERA10 = 'Harmony’s world · under threat from outside';
const OLD_ERA6 = [
  'Harmony’s world · the Elendel Basin',
  'Sazed holds both Ruin and Preservation',
  'Seran, Faleast and Channerel',
  'near the south pole',
  'Industrial, about 300 years after Mistborn',
];

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
  vm.runInContext('const K={hooks:{}};const HOOK_API={};', c);
  vm.runInContext(cut('function distText(w){', '\ndos.addEventListener'), c);
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
  assert.deepEqual(w.realms, {}, 'SH-D1: world-specific Cognitive bundle omitted (empty container kept)');
  assert.equal(p.realms.cognitive.unknown, SH_UNKNOWN, 'SH-D3: neutral global fallback');
  assert.deepEqual(Object.keys(w.eras), ['6', '10']);
  assert.equal(w.eras[6].status, MB05.status);
  assert.deepEqual(w.eras[6].facts, MB05.facts);
  assert.equal(w.eras[10].status, MB10_STATUS);
  assert.deepEqual(w.eras[10].gates, { status: MB10_GATE });
  assert.equal(w.eras[6].gate, undefined);
  assert.equal(w.eras[10].gate, undefined);
  const own = JSON.stringify({ s: w.status, f: w.facts, e: w.eras });
  for (const x of REMOVED) assert.ok(!own.includes(x), 'removed from base/eras: ' + x);
  const lu = w.sites.find((s: any) => s.id === 'luthadel');
  assert.deepEqual([lu.gates.name, lu.gates.desc, lu.until, lu.lat, lu.lon], [MB01_GATE, MB01_GATE, 6, 70, 0]);
  const sub = p.realms.cognitive.subastrals.find((s: any) => s.world === 'scadrial');
  assert.equal(sub.first, 7, 'subastral threshold unchanged');
  assert.deepEqual(
    sub,
    { world: 'scadrial', color: 'rgba(220,225,235,.5)', r: 1.4, first: 7 },
    'SH-D2: only name removed',
  );
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
  assert.equal(s.status, MB05.status);
  assert.deepEqual(s.facts, [MB05_FACT]);
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
  [6, 'The Alloy of Law · industrial Elendel', ['Era: About 300 years after the original Mistborn trilogy']],
  [10, MB10_STATUS, ['Era: About 300 years after the original Mistborn trilogy']],
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
  assert.equal(s.status, 'The Final Empire → ' + MB10_STATUS);
  assert.deepEqual(s.facts, [MB05_FACT]);
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

/* SCR-01: Scadrial's own Distance row must not attribute planet order to the (unverified) system chart.
   Only Scadrial's local distText changes; other records keep their explicit holds (no site-wide assertion). */
const SCAD_DIST = 'Illustrative system layout; distances and orbital order are not verified here.';
const CHART_ATTR = 'planet order from the system chart';
for (const [label, st] of [
  ['set: original trilogy read', { mode: 'set', ids: MB }],
  ['set: nothing read', { mode: 'set', ids: [] }],
  ['legacy #book=2', { mode: 'legacy', book: 2 }],
  ['legacy #book=6', { mode: 'legacy', book: 6 }],
  ['legacy #book=10', { mode: 'legacy', book: 10 }],
  ['All', { mode: 'all' }],
] as [string, St][]) {
  for (const realm of ['physical', 'cognitive']) {
    test('SCR-01 ' + label + ' / ' + realm + ': Scadrial Distance row is the exact qualifier', () => {
      const { c } = setup(st);
      vm.runInContext('S.realm=' + JSON.stringify(realm), c);
      const d = vm.runInContext('distText(world)', c) as string;
      assert.equal(d, SCAD_DIST);
      assert.ok(!d.includes(CHART_ATTR));
      assert.ok(!/light-years/.test(d), 'no generic light-year substitution');
    });
  }
}

test('SCR-01 scope: only Scadrial changed; ORR constant and other Scadrial-system records keep their distText', () => {
  const { p } = setup({ mode: 'all' });
  assert.ok(packSrc.includes('var ORR = "System drawn enlarged; planet order from the system chart";'));
  const others = p.worlds.filter((x: any) => x.id !== 'scadrial' && x.distText === SCAD_DIST);
  assert.equal(
    others.length,
    0,
    'other records with the Scadrial qualifier: ' + others.map((x: any) => x.id).join(','),
  );
  assert.ok(p.worlds.filter((x: any) => /planet order from the system chart/.test(x.distText || '')).length > 0);
});

let REG: any = null;
function reg0() {
  if (!REG) REG = setup({ mode: 'all' }).reg;
  return REG;
}

/* MB05 (era6-handoff-2026-11-16.md): only eras[6].status/blurb/facts change, each with its own MB05 field gate.
   Ancestor restrictions (world chain, era-6 numeric bucket record gate, the world's own MB01 blurb/facts gates)
   still apply, era 10's status override is untouched, and no world or era record gate is added. */
const BASE_BLURB =
  'In the Final Empire, ash falls beneath a red sun. Skaa labor in the fields under the Lord Ruler’s rule, brown-leaved crops struggle to grow, and mists gather as evening falls.';

test('MB05 payload: exact three fields and three own gates; no record gate; era 10 and gfx preserved', () => {
  const { w: w0 } = setup({ mode: 'all' });
  const w = J(w0);
  const e6 = w.eras[6];
  assert.equal(e6.status, MB05.status);
  assert.equal(e6.blurb, MB05.blurb);
  assert.deepEqual(e6.facts, MB05.facts);
  assert.deepEqual(e6.gates, { status: MB05_GATE, blurb: MB05_GATE, facts: MB05_GATE });
  assert.equal(Object.prototype.hasOwnProperty.call(e6, 'gate'), false, 'no era record gate');
  assert.equal(Object.prototype.hasOwnProperty.call(w, 'gate'), false, 'no world record gate');
  assert.deepEqual(Object.keys(e6).sort(), ['blurb', 'facts', 'gates', 'gfx', 'status']);
  assert.ok(Array.isArray(e6.gfx.map) || typeof e6.gfx.map === 'object', 'era gfx map kept');
  assert.deepEqual(e6.gfx.pal, ['#0a2240', '#2a6aa0', '#5a8a40', '#6f9a52', '#7a7468', '#f0f0f0']);
  assert.deepEqual(w.eras[10], { status: MB10_STATUS, gates: { status: MB10_GATE } });
  assert.equal(w.distText, SCAD_DIST, 'SCR-01 qualifier kept');
  assert.equal(w.model, MODEL, 'model note kept');
  const own = JSON.stringify(w.eras);
  for (const x of OLD_ERA6) assert.ok(!own.includes(x), 'old era-6 copy removed: ' + x);
  for (const x of REMOVED) assert.ok(!own.includes(x), 'no restored claim: ' + x);
});

const B6 = () => [...reg0().buckets.get(6)] as string[];
for (let m = 0; m < 8; m++) {
  for (let n = 0; n < 8; n++) {
    for (const realm of ['physical', 'cognitive']) {
      const ot = MB.filter((_, i) => m & (1 << i));
      const b6 = B6().filter((_, i) => n & (1 << i));
      test('MB05 per-work OT' + m + ' B6' + n + ' / ' + realm + ': era-6 fields only with every ancestor', () => {
        const { c } = setup({ mode: 'set', ids: [...ot, ...b6] });
        vm.runInContext('S.realm=' + JSON.stringify(realm), c);
        const s = surfaces(c);
        const otFull = ot.length === 3;
        const eligible = otFull && b6.length === B6().length;
        assert.equal(s.visible, otFull, 'world visibility unchanged');
        assert.equal(vm.runInContext('distText(world)', c), SCAD_DIST);
        for (const x of [...OLD_ERA6, ...REMOVED]) assert.ok(!text(s).includes(x), 'absent: ' + x);
        if (eligible) {
          assert.deepEqual([s.status, s.blurb, s.facts], [MB05.status, MB05.blurb, [MB05_FACT]]);
        } else if (otFull) {
          assert.deepEqual([s.status, s.blurb, s.facts], ['The Final Empire', BASE_BLURB, ['Ruler: The Lord Ruler']]);
        } else {
          assert.deepEqual([s.status, s.blurb, s.facts], ['', '', []]);
        }
        if (otFull) assert.equal(s.model, '<p class="srcnote model">' + MODEL + '</p>');
      });
    }
  }
}

for (const [label, st, status] of [
  ['legacy #book=2', { mode: 'legacy', book: 2 }, 'The Final Empire'],
  ['legacy #book=6', { mode: 'legacy', book: 6 }, MB05.status],
  ['legacy #book=10', { mode: 'legacy', book: 10 }, MB10_STATUS],
  ['All', { mode: 'all' }, 'The Final Empire → ' + MB10_STATUS],
] as [string, St, string][]) {
  test('MB05 ' + label + ': numeric rule, candidate copy from era 6, era-10 status override kept', () => {
    const { c } = setup(st);
    const s = surfaces(c);
    assert.equal(s.status, status);
    const early = st.mode === 'legacy' && st.book === 2;
    assert.equal(s.blurb, early ? BASE_BLURB : MB05.blurb);
    assert.deepEqual(s.facts, early ? ['Ruler: The Lord Ruler'] : [MB05_FACT]);
    assert.ok(s.model.includes(MODEL));
    for (const x of OLD_ERA6) assert.ok(!text(s).includes(x));
  });
}

test('MB05 field gates fail closed: an invalid or unmet era-6 field gate keeps the earlier value', () => {
  for (const g of [{}, { req: 'mistborn-secret-history' }]) {
    const { c, w } = setup({ mode: 'set', ids: [...MB, ...B6()] });
    w.eras[6].gates = { ...w.eras[6].gates, blurb: g };
    const s = surfaces(c);
    assert.equal(s.blurb, BASE_BLURB, JSON.stringify(g));
    assert.equal(s.status, MB05.status, 'sibling field gate independent');
    assert.deepEqual(s.facts, [MB05_FACT]);
  }
});

/* MB10 one-field era-10 status (ChatGPT era10-handoff-2026-11-16.md): only eras[10].status changes and it carries
   its own the-lost-metal field gate. The world chain, the era numeric bucket rule and the world's own MB01 gates
   still apply; era-6 candidate/gates, every other field, registry and presets are unchanged. */
test('MB10 payload: one nested field and one own gate; no record gate; era 6, distText and model preserved', () => {
  const { w: w0 } = setup({ mode: 'all' });
  const w = J(w0);
  assert.deepEqual(w.eras[10], { status: MB10_STATUS, gates: { status: MB10_GATE } });
  assert.deepEqual(Object.keys(w.eras[10]).sort(), ['gates', 'status']);
  assert.equal(Object.prototype.hasOwnProperty.call(w.eras[10], 'gate'), false, 'no era-10 record gate');
  assert.equal(Object.prototype.hasOwnProperty.call(w, 'gate'), false, 'no world record gate');
  assert.equal(w.eras[6].status, MB05.status);
  assert.equal(w.eras[6].blurb, MB05.blurb);
  assert.deepEqual(w.eras[6].facts, MB05.facts);
  assert.deepEqual(w.eras[6].gates, { status: MB05_GATE, blurb: MB05_GATE, facts: MB05_GATE });
  assert.equal(w.distText, SCAD_DIST);
  assert.equal(w.model, MODEL);
  assert.ok(!JSON.stringify(w.eras).includes(OLD_ERA10), 'old era-10 status replaced');
});

for (let m = 0; m < 8; m++) {
  for (let n = 0; n < 8; n++) {
    for (const tlm of [false, true]) {
      for (const realm of ['physical', 'cognitive']) {
        const ot = MB.filter((_, i) => m & (1 << i));
        const b6 = B6().filter((_, i) => n & (1 << i));
        const label = 'MB10 per-work OT' + m + ' B6' + n + (tlm ? ' +TLM' : ' -TLM') + ' / ' + realm;
        test(label + ': era-10 status only with the trilogy and The Lost Metal', () => {
          const ids = [...ot, ...b6, ...(tlm ? [TLM] : [])];
          const base = setup({ mode: 'set', ids: [...ot, ...b6] });
          vm.runInContext('S.realm=' + JSON.stringify(realm), base.c);
          const s0 = surfaces(base.c);
          const { c } = setup({ mode: 'set', ids });
          vm.runInContext('S.realm=' + JSON.stringify(realm), c);
          const s = surfaces(c);
          const otFull = ot.length === 3;
          const b6Full = b6.length === B6().length;
          assert.equal(s.visible, otFull, 'world visibility unchanged');
          assert.equal(vm.runInContext('distText(world)', c), SCAD_DIST);
          assert.ok(!text(s).includes(OLD_ERA10), 'old era-10 status absent');
          for (const x of [...OLD_ERA6, ...REMOVED]) assert.ok(!text(s).includes(x), 'absent: ' + x);
          let want = '';
          if (otFull) want = tlm ? MB10_STATUS : b6Full ? MB05.status : 'The Final Empire';
          assert.equal(s.status, want);
          /* every non-status surface equals the same state without The Lost Metal */
          assert.deepEqual(
            [s.name, s.blurb, s.facts, s.star, s.model, s.card, s.visible],
            [s0.name, s0.blurb, s0.facts, s0.star, s0.model, s0.card, s0.visible],
          );
        });
      }
    }
  }
}

for (const [label, st, status] of [
  ['legacy #book=2', { mode: 'legacy', book: 2 }, 'The Final Empire'],
  ['legacy #book=6', { mode: 'legacy', book: 6 }, MB05.status],
  ['legacy #book=10', { mode: 'legacy', book: 10 }, MB10_STATUS],
  ['All', { mode: 'all' }, 'The Final Empire → ' + MB10_STATUS],
] as [string, St, string][]) {
  for (const realm of ['physical', 'cognitive']) {
    test('MB10 ' + label + ' / ' + realm + ': status per numeric rule', () => {
      const { c } = setup(st);
      vm.runInContext('S.realm=' + JSON.stringify(realm), c);
      const s = surfaces(c);
      assert.equal(s.status, status);
      assert.ok(!text(s).includes(OLD_ERA10));
      assert.ok(s.model.includes(MODEL));
    });
  }
}

test('MB10 status gate fails closed: an invalid or unmet era-10 gate falls back to the earlier status', () => {
  for (const realm of ['physical', 'cognitive']) {
    for (const g of [{}, { req: 'mistborn-secret-history' }]) {
      const { c, w } = setup({ mode: 'set', ids: [...MB, ...B6(), TLM] });
      vm.runInContext('S.realm=' + JSON.stringify(realm), c);
      w.eras[10].gates = { status: g };
      const s = surfaces(c);
      assert.equal(s.status, MB05.status, JSON.stringify(g) + ' ' + realm);
      assert.equal(s.blurb, MB05.blurb);
      assert.deepEqual(s.facts, [MB05_FACT]);
    }
  }
});

/* SH-D1–03 (ChatGPT secret-history-omission-handoff-2026-11-17.md): the world-specific Cognitive bundle, its separate
   subastral name and the old "books have not described" fallback are omitted in every mode. The Cognitive card for
   Scadrial shows the global title with the neutral fallback and the look is the generic global look. */
const SH = 'mistborn-secret-history';
const OLD_COG_BLURB = 'Scadrial’s subastral is a world of mist.';
const OLD_UNKNOWN = 'The books have not described this world’s subastral.';
{
  const reg0 = setup({ mode: 'all' }).reg;
  const B4: string[] = [...reg0.buckets.get(4)];
  const states: [string, St][] = [];
  for (const sub of SUBSETS)
    for (const sh of [false, true])
      for (const b4 of [false, true]) {
        const ids = [...sub, ...(sh ? [SH] : []), ...(b4 ? B4 : [])];
        states.push([`set ${sub.length}/3 OT${sh ? ' +SH' : ''}${b4 ? ' +B4' : ''}`, { mode: 'set', ids }]);
      }
  states.push(['set later-era only (B6 + TLM)', { mode: 'set', ids: [...reg0.buckets.get(6), TLM] }]);
  for (const book of [2, 4, 7, 10]) states.push([`legacy ${book}`, { mode: 'legacy', book }]);
  states.push(['All', { mode: 'all' }]);
  for (const [label, st] of states) {
    test('SH-D1–03: ' + label, () => {
      const { c, p } = setup(st);
      const R = p.realms.cognitive;
      const card: string = vm.runInContext('realmCard(world)', c);
      const look = vm.runInContext('realmLook(world)', c);
      assert.equal(
        card,
        '<div class="realmcard"><p class="eyebrow">' + R.title + '</p><p>' + SH_UNKNOWN + '</p></div>',
        'global title + neutral fallback',
      );
      for (const x of [COG_NAME, OLD_COG_BLURB, OLD_UNKNOWN]) assert.ok(!card.includes(x), 'absent: ' + x);
      assert.deepEqual([look.st, look.c1, look.c2, look.c3], [4, R.look.c1, R.look.c2, R.look.c3], 'generic look');
      assert.equal(vm.runInContext('realmCard(null)', c).includes(R.text), true, 'home card keeps global text (held)');
    });
  }
}
