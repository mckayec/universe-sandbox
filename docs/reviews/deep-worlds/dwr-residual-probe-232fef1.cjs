// Reviewer characterization at PR37 232fef155c7a76cfb9e728321f064010cbb3878a.
// Usage: node dwr-residual-probe-232fef1.cjs <exact-checkout-root>
// Assertions intentionally reproduce current defects; exit 0 is NOT a remediation pass.
// DWR-A/B callback-lifecycle controls on an exact checkout. Executes the real source slices of
// society.js (stopFx, clearForBook, the heliofall EMP statement) and engine.js (placeGen/evEligible,
// canEnter, enterPlace, doLeavePlace-less paths, evInPlace) in inert vm fixtures. No browser/renderer.
// Usage: node dwr-probe.cjs <repo-root>
const fs = require('node:fs'), path = require('node:path'), vm = require('node:vm'), assert = require('node:assert/strict');
const root = process.argv[2], read = p => fs.readFileSync(path.join(root, p), 'utf8');
const results = [];
const ok = (c, m) => { assert.ok(c, m); results.push(m); };

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

function observed(label, change) {
 const x=engCtx(2); const entered=[];
 x.PL=null; x.renderChron=()=>{};
 vm.runInContext(eng.slice(eng.indexOf("function selectSite("),eng.indexOf("/* ===================== PLACES:")) + eng.slice(eng.indexOf("function openEvent("),eng.indexOf("/* book filter */")),x);
 x.PLACES.enter=(w,s)=>entered.push(s.id);
 x.open(); change(x); x.drain();
 console.log(JSON.stringify({label,entered,view:x.S.view,site:x.S.site,event:x.S.ev,effects:x.played}));
 return {x,entered};
}
let r=observed("positive uninterrupted",()=>{});
assert.equal(r.entered.length,1);assert.equal(r.x.played.length,1);
r=observed("generation invalidated before transition",x=>x.openEvent(null,false));
assert.equal(r.entered.length,1);assert.equal(r.x.played.length,0); // reproduces uncancelled stale place build
r=observed("site changed before transition",x=>x.selectSite(other.id));
assert.deepEqual(r.entered,["tree"]);assert.equal(r.x.S.site,other.id); // built place differs from state destination
console.log("3/3 characterization cases observed (1 positive, 2 stale-transition reproductions); no browser execution.");
