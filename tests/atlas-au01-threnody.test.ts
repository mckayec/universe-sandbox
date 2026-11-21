/* AU01-THRENODY-01 (ChatGPT au01-checkpoint-2-2026-11-21.md): on PR48 only, two anthology-level base fields drop
   the Mercy-participation and destroyed-planets clauses (worlds[threnosun].blurb and codex shards/Ambition.desc).
   The parent pack is rebuilt by reversing exactly these two replacements; everything else must be identical.
   Visibility is checked with the ACTUAL engine reading/world selectors and codex renderer cut out of
   public/atlas/engine.js (same harness as au01threnody-proposal-probe.mjs) in eight reading states. */
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

const read = (p: string) => fs.readFileSync(new URL('../' + p, import.meta.url), 'utf8');
const engine = read('public/atlas/engine.js');
const readingSrc = read('public/atlas/reading.js');
const packSrc = read('public/atlas/packs/cosmere.js');
const J = (x: unknown) => JSON.parse(JSON.stringify(x));

const OLD_WORLD =
  'A red star. In the empty space of this system the Shards Ambition, Odium and probably Mercy fought; Ambition was mortally wounded, and planets that once orbited here were destroyed. The twisted Investiture on Threnody is at least partly a scar of that battle.';
const NEW_WORLD =
  'A red star. In the empty space of this system the Shards Ambition and Odium fought; Ambition was mortally wounded. The twisted Investiture on Threnody is at least partly a scar of that battle.';
const OLD_CODEX =
  'A Shard mortally wounded in a battle with Odium, and probably Mercy, in the empty space of the Threnodite system. The battle destroyed planets there and still twists the Investiture on Threnody.';
const NEW_CODEX =
  'A Shard mortally wounded in a battle with Odium in the empty space of the Threnodite system. The battle still twists the Investiture on Threnody.';

assert.equal(packSrc.split(NEW_WORLD).length, 2, 'new world blurb occurs once');
assert.equal(packSrc.split(NEW_CODEX).length, 2, 'new Ambition desc occurs once');
assert.ok(!packSrc.includes(OLD_WORLD) && !packSrc.includes(OLD_CODEX), 'old strings gone');
const parentSrc = packSrc.replace(NEW_WORLD, OLD_WORLD).replace(NEW_CODEX, OLD_CODEX);
assert.equal(parentSrc.replace(OLD_WORLD, NEW_WORLD).replace(OLD_CODEX, NEW_CODEX), packSrc, 'whole-source reversal');

const parse = (src: string) => {
  const w: any = {};
  vm.runInNewContext(src, { window: w });
  return J(w.ATLAS_PACKS.cosmere);
};

function selectors(pack: any) {
  const a = engine.indexOf('var RDG=window.AtlasReading');
  const b = engine.indexOf('buildGalaxy();buildMarkers();buildTerritories();localField();', a);
  const c = engine.indexOf('let cxTab=K.codex.length');
  const d = engine.indexOf('function openCodex()', c);
  assert.ok(a >= 0 && b > a && c > b && d > c, 'engine markers');
  const harness =
    'const K={raw:PK,codex:PK.codex,intro:PK.intro};const WORLDS=PK.worlds,WORLD_BY=Object.fromEntries(WORLDS.map(w=>[w.id,w]));' +
    'const CUM=true,S={book:0,rd:{mode:"all"},realm:"physical"};const ARR=x=>Array.isArray(x)?x: x==null?[]:[x];' +
    'const filterOk=()=>true;const EFF=()=>S.book||12;const G={},GROUP_BY={};const BOOKS=PK.books,BOOK_IDS=Object.keys(BOOKS),nBooksWord="books";' +
    'const esc=x=>String(x??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");' +
    'const nodes={};const $=id=>(nodes[id]??={addEventListener(){}});\n' +
    engine.slice(a, b) +
    '\n' +
    engine.slice(c, d) +
    '\ncxTab="shards";return (state)=>{setRd(state);renderCodex();const w=WORLD_BY.threnosun;' +
    'const txt=seen(w)?eraVal(w,"blurb"):null;const body=nodes["#cxBody"].innerHTML;' +
    'const found=body.match(/<h3>Ambition<\\/h3>[\\s\\S]*?<p>(.*?)<\\/p>/);return {world:txt,codex:found?found[1]:null}};';
  const window: any = {};
  vm.runInNewContext(readingSrc, { window });
  return new Function('window', 'PK', harness)(window, pack);
}

test('AU01-THRENODY-01 payload: two fields changed; whole parsed pack otherwise equal to the parent', () => {
  const head = parse(packSrc);
  const parent = parse(parentSrc);
  const w = head.worlds.find((x: any) => x.id === 'threnosun');
  const amb = head.codex.find((x: any) => x.id === 'shards').list.find((x: any) => x.name === 'Ambition');
  assert.equal(w.blurb, NEW_WORLD);
  assert.equal(amb.desc, NEW_CODEX);
  assert.equal(w.first, 7);
  assert.equal(amb.first, 7);
  assert.ok(!/Mercy|destroyed/.test(w.blurb + amb.desc), 'clauses removed');
  w.blurb = OLD_WORLD;
  amb.desc = OLD_CODEX;
  assert.deepEqual(head, parent, 'restoring the two fields reproduces the parent');
});

test('AU01-THRENODY-01 visibility: eight reading states match the parent; visible text is the new text', () => {
  const head = parse(packSrc);
  const pre = selectors(parse(parentSrc));
  const post = selectors(head);
  const AU = 'arcanum-unbounded-system-essays-and-maps';
  const all = head.spoilers.works.map((x: any) => x.id) as string[];
  const b7 = head.spoilers.works.filter((x: any) => x.bucket === 7).map((x: any) => x.id) as string[];
  assert.ok(b7.includes(AU));
  const states: [string, any, boolean][] = [
    ['All', { mode: 'all' }, true],
    ['legacy6', { mode: 'legacy', book: 6 }, false],
    ['legacy7', { mode: 'legacy', book: 7 }, true],
    ['empty', { mode: 'none' }, false],
    ['AU01-only', { mode: 'set', ids: [AU] }, false],
    ['bucket7', { mode: 'set', ids: b7 }, true],
    ['bucket7-minus-AU01', { mode: 'set', ids: b7.filter(x => x !== AU) }, false],
    ['all-works', { mode: 'set', ids: all }, true],
  ];
  let pairs = 0;
  for (const [name, st, vis] of states) {
    const before = pre(st);
    const after = post(st);
    for (const key of ['world', 'codex'] as const) {
      assert.equal(before[key] !== null, vis, name + ' parent ' + key);
      assert.equal(after[key] !== null, vis, name + ' head ' + key);
      if (vis) {
        assert.equal(before[key], key === 'world' ? OLD_WORLD : OLD_CODEX, name + ' parent text ' + key);
        assert.equal(after[key], key === 'world' ? NEW_WORLD : NEW_CODEX, name + ' head text ' + key);
      }
      pairs++;
    }
  }
  assert.equal(pairs, 16);
});
