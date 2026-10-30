// Exact-source delta checks. No browser/server/renderer.
const fs = require('node:fs'),
  path = require('node:path'),
  vm = require('node:vm'),
  assert = require('node:assert/strict');
const { stripTypeScriptTypes } = require('node:module');
const root = process.argv[2],
  read = p => fs.readFileSync(path.join(root, p), 'utf8');
let checks = 0;
const ok = (c, m) => {
  assert.ok(c, m);
  checks++;
};
const packs = {};
for (const id of ['sun-eater', 'hyperion', 'expanse', 'dune', 'foundation', 'cosmere']) {
  const c = { window: {} };
  vm.runInNewContext(read('public/atlas/packs/' + id + '.js'), c);
  packs[id] = c.window.ATLAS_PACKS[id];
}
const site = (p, w, s) => packs[p].worlds.find(x => x.id === w).sites.find(x => x.id === s);
const lm = (p, w, s, id) => site(p, w, s).scene.landmarks.find(x => x.id === id);
const ev = (p, id) => packs[p].events.find(x => x.id === id);
ok(!packs.hyperion.worlds.find(w => w.id === 'bressia').blurb.includes('wife and son'), 'DW03 conservative cut');
ok(lm('sun-eater', 'delos', 'devilsrest', 'castle').desc.includes('wants an heir rather than a child'), 'DW04');
ok(!JSON.stringify(packs['sun-eater']).includes('heir his father does not want'), 'DW04 inverted clause absent');
ok(ev('dune', 'd1').text.startsWith('Before the move to Arrakis'), 'DW05 event');
ok(!lm('dune', 'caladan', 'castle', 'keep').desc.includes('On the eve'), 'DW05 landmark');
ok(
  lm('dune', 'arrakis', 'tabr', 'entrance').desc === 'A concealed way into the rock, sealed against moisture loss.',
  'DW07',
);
ok(!lm('sun-eater', 'emesh', 'borosevo', 'dungeons'), 'dungeon removed');
for (const id of ['b1j', 'b1n']) ok(!ev('sun-eater', id).lm, id + ' untied');
ok(!/Liliana|Balian/.test(JSON.stringify(packs['sun-eater'])), 'disputed names removed');
ok(!lm('foundation', 'terminus', 'termcity', 'board'), 'board removed');
for (const id of ['f1d', 'f1h3', 'f7g']) ok(!ev('foundation', id).lm, id + ' untied');
ok(
  lm('foundation', 'trantor', 'hotel', 'terminal').desc ===
    'Gaal arrives at Trantor and takes a taxi to the Luxor; another figure follows.',
  'S06 narrowing',
);
ok(!lm('cosmere', 'roshar', 'yeddaw', 'orphanage'), 'orphanage removed');
ok(
  !ev('cosmere', 'e35').lm &&
    !ev('cosmere', 'e35').fx &&
    ev('cosmere', 'e35').text === 'Lift travels to Yeddaw in Tashikk, where Darkness has been reported.',
  'e35 S03 narrowing',
);
ok(
  !lm('expanse', 'ceres', 'govhall', 'conference') && !ev('expanse', 'b6i').site && !ev('expanse', 'b6i').lm,
  'conference untied',
);
ok(!lm('hyperion', 'jungle', 'raft', 'shiprest').desc.includes('repaired'), 'return clause removed');
let refs = 0;
for (const p of Object.values(packs))
  for (const e of p.events) {
    if (!e.lm) continue;
    const w = p.worlds.find(w => w.id === e.world),
      s = w?.sites?.find(s => s.id === e.site);
    assert.ok(
      s?.scene?.landmarks?.some(l => l.id === e.lm),
      p.id + ':' + e.id,
    );
    refs++;
  }
const src = read('public/atlas/society.js');
// Reuse builder's inert sandbox fixture, but run additional repeated-selection and cleanup scenarios.
const tests = read('tests/society-transitions.test.ts');
const helper = tests.slice(tests.indexOf('const cut ='), tests.indexOf("test('a scene entry"));
const h = vm.createContext({ src, assert, vm });
vm.runInContext(stripTypeScriptTypes(helper) + ';globalThis.make=sandbox;', h);
const banner = { style: { opacity: 1 }, hidden: false };
let capRemoved = 0,
  tourEnded = 0,
  disposed = 0;
const { ctx, timers } = h.make({
  SITES: { asteroid: { name: 'Asteroid', body: 'asteroid', from: 6, landmarks: [] } },
  $(id) {
    return id === '#banner' ? banner : { textContent: '' };
  },
  document: {
    getElementById() {
      return {
        classList: {
          remove() {
            capRemoved++;
          },
        },
      };
    },
    querySelectorAll: () => [],
    body: { classList: { remove() {} } },
  },
  window: {
    __tour: {
      end() {
        tourEnded++;
      },
    },
  },
  fxList: [
    {
      dispose() {
        disposed++;
      },
    },
  ],
});
vm.runInContext(src.slice(src.indexOf('function stopFx('), src.indexOf('function fxPlaying(')), ctx);
const era = k => {
  ctx.bookFilter = k;
  vm.runInContext('setEra(' + k + ')', ctx);
};
vm.runInContext('enterSite("asteroid")', ctx);
era(1);
era(6);
timers.shift()();
ok(ctx.loaded === null, 'old fade canceled even after return to VI');
ok(
  disposed === 1 && banner.hidden && capRemoved === 1 && tourEnded === 1,
  'actual stopFx plus banner caption/tour cleanup',
);
vm.runInContext('enterSite("asteroid")', ctx);
timers.shift()();
ok(ctx.loaded === 'asteroid', 'fresh eligible scene entry');
ctx.mode = 'system';
ctx.curSite = null;
ctx.curSiteKey = null;
let emp = 0;
ctx.SITES.heliopolis = {
  _emp() {
    emp++;
  },
};
const timer = src.match(/SITES\.heliopolis\._emp&&setTimeout\(\(\)=>SITES\.heliopolis\._emp\(\),2500\);/)[0];
vm.runInContext(timer, ctx);
const empCallback = timers.pop();
era(1);
era(6);
empCallback();
ok(emp === 1, 'DW02 residual: EMP timer survives cancellation');
// Engine can admit the same early site after a downgrade, then execute an old later-book event continuation.
const engine = read('public/atlas/engine.js');
let queue = [],
  played = [];
const later = Object.values(packs)
  .flatMap(p => p.events.map(e => ({ p, e })))
  .find(
    ({ p, e }) =>
      e.book > 1 &&
      e.fx &&
      p.worlds.find(w => w.id === e.world)?.sites?.some(s => s.id === e.site && Math.min(...(s.books || [1])) === 1),
  );
assert.ok(later);
const e = later.e,
  w = later.p.worlds.find(w => w.id === e.world),
  s = w.sites.find(s => s.id === e.site);
const x = vm.createContext({
  S: { sel: w.id, view: 'world', book: e.book },
  WORLD_BY: { [w.id]: w },
  siteOf: () => s,
  CUM: true,
  filterOk: () => true,
  realmOk: () => true,
  noSurface: () => false,
  needRealm: () => false,
  MOB: false,
  urlReady: false,
  $: () => null,
  transition: fn => queue.push(fn),
  hideTip() {},
  SITE_EL: [],
  GL_LBL: {},
  REGIONS: [],
  PLACES: {
    enter() {},
    setIdle() {},
    landmarks: () => [],
    focus() {},
    overview() {},
    stopFx() {},
    play: fx => played.push(fx),
  },
  gfxFor() {},
  K: { raw: {} },
  lmOk: () => true,
  viewOffset() {},
  refreshAll() {},
  hint() {},
  UI: { hints: {} },
  AUD: null,
  soundOn: false,
  setTimeout: fn => queue.push(fn),
  renderDossier() {},
  renderCrumbs() {},
  syncURL() {},
});
vm.runInContext(
  engine.slice(engine.indexOf('const siteEraOk='), engine.indexOf('const evFor=')) +
    engine.slice(engine.indexOf('function canEnter('), engine.indexOf('function canEnterEv(')) +
    engine.slice(engine.indexOf('function enterPlace('), engine.indexOf('function leavePlace(')) +
    engine.slice(engine.indexOf('function evInPlace('), engine.indexOf('const PLACE_KIND=')),
  x,
);
x.enterPlace(s.id, false, () => x.evInPlace(e));
x.S.book = 1;
x.S.ev = null;
while (queue.length) queue.shift()();
ok(
  played.includes(e.fx) && x.S.ev === e.id,
  'DW02 engine residual: old event starts after downgrade at still-eligible site',
);
console.log(
  JSON.stringify(
    {
      checks,
      reference_links_checked: refs,
      residual_defects: 2,
      engine_event: { pack: later.p.id, id: e.id, book: e.book, site: s.id },
      scope: 'delta source/state only',
    },
    null,
    2,
  ),
);
