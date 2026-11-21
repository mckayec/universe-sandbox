/* EL08-PORT-A..E (ChatGPT docs/reviews/cosmere-book-by-book/el08-portability-handoff-2026-11-21.md): on PR48
   only, port five previously accepted EL08 omissions to public/atlas/packs/cosmere.js — Sel status, the base "Order"
   fact, the whole Sel-specific Cognitive bundle with its now-empty realms container, the Pool name and its final
   sentence, and the codex Shards entries "Devotion and Dominion" and "Adonalsium". The parent source is rebuilt by
   reversing exactly these text operations; the parsed packs must then differ only at the seven logical targets.
   The realm checks run the ACTUAL engine realm span on Sel: card and appearance now fall back to the generic
   Cognitive card and colours, and the realm stays closed at legacy book 1. */
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

const read = (p: string) => fs.readFileSync(new URL('../' + p, import.meta.url), 'utf8');
const packSrc = read('public/atlas/packs/cosmere.js');
const engine = read('public/atlas/engine.js');
const readingSrc = read('public/atlas/reading.js');

const OLD_COG =
  'realms: {cognitive: {name: "Expanse of the Densities", style: "plasma", c1: "#ff6a2a", c2: "#7a2ab8", c3: "#200a10", blurb: "Sel’s subastral is all but uninhabitable. The power of the splintered Shards Devotion and Dominion was forced into the Cognitive Realm, where it forms the Dor: a pressurised, plasma-like storm. A few guides can lead travellers through it."}}';
const OLD_STATUS = '2nd from Mashe · Shardworld of Devotion and Dominion';
const OLD_POOL = 'The Pool (Devotion’s perpendicularity)';
const POOL_TAIL = ' It opens into Sel’s Cognitive Realm.';
const POOL_DESC =
  'A small, deep pool of thick, crystalline blue liquid in the Atad Mountains south-east of Elantris, reached by tunnel or switchbacks.';
const ADON_LINE =
  '        {name: "Adonalsium", first: 1, desc: "The single power behind creation, shattered long before the books into sixteen Shards.", more: [[7, "It was destroyed on Yolen by a group that included Hoid."]]},';
const DEV_LINE =
  '        {name: "Devotion and Dominion", books: [1, 7], desc: "The Shards of Sel. Their broken power lingers in the land and drives Sel’s many magics."},';

const once = (src: string, s: string) => assert.equal(src.split(s).length, 2, 'occurs once: ' + s.slice(0, 60));
const swap = (src: string, a: string, b: string) => {
  once(src, a);
  return src.replace(a, b);
};
function rebuildParent(src: string) {
  let s = swap(src, 'aka: ["Seol"], group: "selish"', 'aka: ["Seol"], ' + OLD_COG + ', group: "selish"');
  s = swap(s, 'status: "World of Elantris",', `status: "${OLD_STATUS}",`);
  s = swap(
    s,
    'facts: [["Moon", "Oem"], ["Continents"',
    'facts: [["Order", "2nd from Mashe"], ["Moon", "Oem"], ["Continents"',
  );
  s = swap(s, '{id: "pool", name: "The Pool", lat: 32.6', `{id: "pool", name: "${OLD_POOL}", lat: 32.6`);
  s = swap(s, `"${POOL_DESC}"`, `"${POOL_DESC}${POOL_TAIL}"`);
  const shardsOpen = '{id: "shards", title: "Shards", list: [\n';
  s = swap(s, shardsOpen, shardsOpen + ADON_LINE + '\n');
  const harmony = s.indexOf('{name: "Harmony", first: 2, books: [2, 6, 10]');
  assert.ok(harmony > 0, 'Harmony anchor');
  const eol = s.indexOf('\n', harmony) + 1;
  return s.slice(0, eol) + DEV_LINE + '\n' + s.slice(eol);
}

const parse = (src: string) => {
  const w: any = {};
  vm.runInNewContext(src, { window: w });
  return JSON.parse(JSON.stringify(w.ATLAS_PACKS.cosmere));
};
const sel = (p: any) => p.worlds.find((w: any) => w.id === 'sel');
const shards = (p: any) => p.codex.find((t: any) => t.id === 'shards').list;

test('EL08-PORT-A..E: the seven logical targets hold the handoff values', () => {
  const p = parse(packSrc);
  const w = sel(p);
  assert.equal(w.status, 'World of Elantris');
  assert.deepEqual(w.facts, [
    ['Moon', 'Oem'],
    ['Continents', 'Opelon (Sycla) and a northern continent'],
    ['Magic', 'AonDor, drawn from the shape of the land'],
  ]);
  assert.ok(!('realms' in w), 'Sel realms container removed with its only member');
  const pool = w.sites.filter((s: any) => s.id === 'pool');
  assert.equal(pool.length, 1);
  assert.equal(pool[0].name, 'The Pool');
  assert.equal(pool[0].desc, POOL_DESC);
  const names = shards(p).map((x: any) => x.name);
  assert.ok(!names.includes('Devotion and Dominion'));
  assert.ok(!names.includes('Adonalsium'));
  // retained holds (no scope inflation): era-7 facts keep Order/Shards rows; Odium's more[7] line unchanged
  assert.deepEqual(w.eras[7].facts[0], ['Order', '2nd from Mashe']);
  assert.ok(w.eras[7].facts.some((f: string[]) => f[0] === 'Shards'));
  const od = shards(p).find((x: any) => x.name === 'Odium');
  assert.ok(od.more.some((m: any) => m[0] === 7 && /Devotion and Dominion/.test(m[1])));
});

test('EL08-PORT: the rebuilt parent differs from the head only at the seven targets', () => {
  const head = parse(packSrc);
  const parent = parse(rebuildParent(packSrc));
  const pw = sel(parent);
  assert.equal(pw.realms.cognitive.name, 'Expanse of the Densities');
  assert.equal(pw.status, OLD_STATUS);
  // apply the seven operations to the parsed parent; the result must equal the parsed head exactly
  delete pw.realms; // B (member + container)
  pw.status = 'World of Elantris'; // A1
  assert.deepEqual(pw.facts.shift(), ['Order', '2nd from Mashe']); // A2
  const pool = pw.sites.find((s: any) => s.id === 'pool');
  pool.name = 'The Pool'; // C1
  assert.ok(pool.desc.endsWith(POOL_TAIL));
  pool.desc = pool.desc.slice(0, -POOL_TAIL.length); // C2
  const tab = parent.codex.find((t: any) => t.id === 'shards');
  const before = tab.list.length;
  tab.list = tab.list.filter((x: any) => x.name !== 'Devotion and Dominion' && x.name !== 'Adonalsium'); // D, E
  assert.equal(before - tab.list.length, 2);
  assert.deepEqual(parent, head);
});

/* the actual engine realm span (as in atlas-realms-gate.test.ts) on Sel, legacy and all-books modes */
const cut = (a: string, b: string) => {
  const i = engine.indexOf(a);
  assert.ok(i >= 0, 'marker not found: ' + a);
  const j = engine.indexOf(b, i);
  assert.ok(j > i, 'end marker not found: ' + b);
  return engine.slice(i, j);
};
function realmHarness(src: string, book: number) {
  const c: any = { window: {}, Set, Map, WeakMap, URLSearchParams };
  vm.createContext(c);
  vm.runInContext(readingSrc, c);
  vm.runInContext(src, c);
  const p = c.window.ATLAS_PACKS.cosmere;
  const R = c.window.AtlasReading;
  const reg = R.normRegistry(p);
  assert.ok(reg.ok, 'registry valid');
  const w = p.worlds.find((x: any) => x.id === 'sel');
  Object.assign(c, {
    RDG: R,
    RREG: reg,
    RSET: new Set(),
    WORLDS: p.worlds,
    WORLD_BY: Object.fromEntries(p.worlds.map((x: any) => [x.id, x])),
    PW: () => false,
    CUM: true,
    S: { realm: 'cognitive', book },
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
  return {
    card: String(vm.runInContext('realmCard(world)', c)),
    look: JSON.parse(JSON.stringify(vm.runInContext('realmLook(world)', c))),
    open: vm.runInContext('realmOpen("cognitive")', c),
  };
}

test('EL08-PORT-B: Sel realm card and appearance fall back to generic Cognitive (parent used the Sel bundle)', () => {
  for (const book of [0, 7]) {
    const h = realmHarness(packSrc, book);
    const p = realmHarness(rebuildParent(packSrc), book);
    assert.equal(h.open, true, `cognitive open at book ${book}`);
    assert.ok(!/Expanse of the Densities|Dor: a pressurised/.test(h.card), 'no Sel-specific card text');
    assert.match(p.card, /Expanse of the Densities/, 'parent control shows Sel card');
    assert.notEqual(h.look.c1, '#ff6a2a');
    assert.equal(p.look.c1, '#ff6a2a', 'parent control uses Sel colours');
    assert.equal(h.look.c1, '#1e1a2c', 'generic Cognitive colour (as CBR-04 GEN)');
    assert.notDeepEqual(h.look, p.look);
  }
  const l1 = realmHarness(packSrc, 1);
  assert.equal(l1.open, false, 'cognitive realm stays closed at legacy book 1');
});
