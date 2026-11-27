// DWR-A/B callback-lifecycle controls on an exact checkout. Executes the real source slices of
// society.js (stopFx, clearForBook, the heliofall EMP statement) and engine.js (placeGen/evEligible,
// canEnter, enterPlace, doLeavePlace-less paths, evInPlace) in inert vm fixtures. No browser/renderer.
// Usage: node dwr-probe.cjs <repo-root>
const fs = require('node:fs'), path = require('node:path'), vm = require('node:vm'), assert = require('node:assert/strict');
const root = process.argv[2], read = p => fs.readFileSync(path.join(root, p), 'utf8');
const results = [];
const ok = (c, m) => { assert.ok(c, m); results.push(m); };

/* ---------- DWR-A: Society EMP timer ---------- */
const soc = read('public/atlas/society.js');
const empStart = soc.indexOf('/* DWR-A:');
assert.ok(empStart > 0, 'DWR-A guard present');
const empStmt = soc.slice(soc.indexOf('if(SITES.heliopolis._emp)', empStart), soc.indexOf('},2500));}', empStart) + 10);
function socCtx() {
  let id = 0; const pending = new Map();
  const c = vm.createContext({
    navGen: 0, fxList: [], emp: 0,
    setTimeout: fn => { pending.set(++id, fn); return id; },
    clearTimeout: t => pending.delete(t),
  });
  c.SITES = { heliopolis: { _emp() { c.emp++; } } };
  vm.runInContext(soc.slice(soc.indexOf('function stopFx('), soc.indexOf('function fxPlaying(')), c);
  // play(): mimic playFx's instance registration around the real EMP statement
  c.play = () => { vm.runInContext('stopFx()', c); const g = { userData: {} }; c.__g = g;
    vm.runInContext('(function(g){' + empStmt + '})(__g)', c); /* g is FX.heliofall's own parameter */ c.fxList.push({ group: g, name: 'heliofall' }); return g; };
  c.drain = () => { const fns = [...pending.values()]; pending.clear(); fns.forEach(f => f()); };
  c.pending = pending;
  return c;
}
let c = socCtx(); c.play(); c.drain();
ok(c.emp === 1, 'A1 positive: uninterrupted heliofall fires EMP once');
c = socCtx(); c.play(); vm.runInContext('navGen++;stopFx();', c); // clearForBook(earlier): navGen++ then stopFx
ok(c.pending.size === 0, 'A2 downgrade: stopFx cancels the pending EMP timer');
c.drain(); ok(c.emp === 0, 'A2 downgrade: EMP does not fire');
c = socCtx(); c.play(); vm.runInContext('navGen++;stopFx();navGen++;', c); c.drain();
ok(c.emp === 0, 'A3 downgrade then return: stale EMP stays cancelled');
c.play(); c.drain(); ok(c.emp === 1, 'A3 fresh replay after return fires once');
c = socCtx(); c.play(); const keep = [...c.pending.values()][0]; vm.runInContext('stopFx()', c); keep();
ok(c.emp === 0, 'A4 same-book stop: even a leaked callback re-checks the live instance');
c = socCtx(); c.play(); const old = [...c.pending.values()][0]; c.play(); old();
ok(c.emp === 0, 'A5 replay: old instance callback is inert');
c.drain(); ok(c.emp === 1, 'A5 replay: new instance fires once');
c = socCtx(); c.play(); const t = [...c.pending.values()][0]; vm.runInContext('navGen++', c); t();
ok(c.emp === 0, 'A6 generation change without stopFx: callback rejects');
// real clearForBook increments navGen and calls stopFx for earlier books
const cfb = soc.slice(soc.indexOf('function clearForBook('), soc.indexOf('function setEra('));
ok(/^function clearForBook\(earlier\)\{navGen\+\+;/.test(cfb) && cfb.includes('stopFx();'), 'A7 clearForBook bumps navGen and stops effects');

/* ---------- DWR-B: engine place continuation ---------- */
const eng = read('public/atlas/engine.js');
const packs = {};
for (const id of ['hyperion']) { const k = { window: {} }; vm.runInNewContext(read('public/atlas/packs/' + id + '.js'), k); packs[id] = k.window.ATLAS_PACKS[id]; }
const P = packs.hyperion, e = P.events.find(x => x.id === 'b2n');
const w = P.worlds.find(x => x.id === e.world), s = w.sites.find(x => x.id === e.site);
const other = w.sites.find(x => x.id !== s.id && Math.min(...(x.books || [1])) <= 2 && x.scene);
function engCtx(book) {
  let q = []; const played = [];
  const x = vm.createContext({
    S: { sel: w.id, view: 'world', book, site: null, ev: null, lm: null }, WORLD_BY: { [w.id]: w },
    siteOf: (ww, id) => (ww.sites || []).find(z => z.id === id), CUM: true, filterOk: () => true, realmOk: () => true,
    seen: () => true, noSurface: () => false, needRealm: () => false, MOB: false, urlReady: false, $: () => null,
    transition: fn => q.push(fn), hideTip() {}, SITE_EL: [], GL_LBL: {}, REGIONS: [],
    PLACES: { enter() {}, setIdle() {}, landmarks: () => [], focus() {}, overview() {}, stopFx() {}, play: fx => played.push(fx), place: { sc: {} } },
    gfxFor() {}, K: { raw: {} }, lmOk: () => true, viewOffset() {}, refreshAll() {}, hint() {}, UI: { hints: {} },
    AUD: null, soundOn: false, setTimeout: fn => q.push(fn), renderDossier() {}, renderCrumbs() {}, syncURL() {},
  });
  vm.runInContext(
    eng.slice(eng.indexOf('const siteEraOk='), eng.indexOf('const evFor=')) +
    eng.slice(eng.indexOf('function canEnter('), eng.indexOf('function enterBtn(')) +
    eng.slice(eng.indexOf('let placeGen=0;'), eng.indexOf('const AUD=')) +
    eng.slice(eng.indexOf('function enterPlace('), eng.indexOf('function leavePlace(')) +
    eng.slice(eng.indexOf('function evInPlace('), eng.indexOf('const PLACE_KIND=')), x);
  x.played = played; x.step = () => { const f = q.shift(); if (f) f(); return !!f; }; x.drain = () => { while (x.step()); };
  x.bookClick = b => vm.runInContext('placeGen++;S.book=' + b + ';S.ev=null;', x); // book handler's added bump + its state change
  x.open = () => { vm.runInContext('placeGen++;', x); x.S.ev = e.id; x.enterPlace(s.id, false, () => x.evInPlace(e)); };
  return x;
}
let x = engCtx(2); x.open(); x.drain();
ok(x.played.includes(e.fx) && x.S.ev === e.id, 'B1 positive: uninterrupted book-II event plays at ' + s.id);
x = engCtx(2); x.open(); x.bookClick(1); x.drain();
ok(!x.played.length && x.S.ev === null, 'B2 II→I during the place transition: no effect, b2n not restored');
x = engCtx(2); x.open(); x.step(); x.bookClick(1); x.drain();
ok(!x.played.length && x.S.ev === null, 'B3 II→I inside the 500 ms continuation window: cancelled');
x = engCtx(2); x.open(); x.step(); x.step(); x.bookClick(1); x.drain();
ok(!x.played.length, 'B4 II→I after evInPlace scheduled the effect: playback cancelled');
x = engCtx(2); x.open(); x.step(); x.S.book = 1; x.drain();
ok(!x.played.length && x.S.ev !== e.id, 'B5 defence in depth: ineligible event rejected even without a generation bump');
x = engCtx(2); x.open(); x.bookClick(1); x.bookClick(2); x.drain();
ok(!x.played.length, 'B6 repeated downgrade/return: stale continuation stays cancelled');
x.open(); x.drain(); ok(x.played.includes(e.fx), 'B6 fresh entry after return plays');
x = engCtx(2); x.open(); x.step(); x.S.site = other ? other.id : 'elsewhere'; x.drain();
ok(!x.played.length, 'B7 destination/site change: continuation rejected');
x = engCtx(2); x.open(); x.step(); vm.runInContext('placeGen++;S.sel="__other";', x); x.drain();
ok(!x.played.length, 'B8 world change: continuation rejected');
ok(/function selectWorld\(id,fly\)\{if\(!WORLD_BY\[id\]\)return;if\(id!==S\.sel\)placeGen\+\+;/.test(eng), 'B8 selectWorld bumps generation');
ok(/if\(\+b\.dataset\.b!==S\.book\)\{placeGen\+\+;/.test(eng), 'B9 book handler bumps generation');
ok(/function doLeavePlace\(after\)\{placeGen\+\+;/.test(eng) && /function openEvent\(id,travel\)\{placeGen\+\+;/.test(eng), 'B10 leave/openEvent bump generation');
console.log(JSON.stringify({ checks: results.length, pass: results.length, fail: 0, engine_event: { id: e.id, book: e.book, site: s.id, siteBooks: s.books }, results }, null, 2));
