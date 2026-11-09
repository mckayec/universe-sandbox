// Independent review regression: DWH-01 overlapping entry cancels newer history state.
// Run: node dwr-history-probe-d902c8a.cjs <exact-checkout-root>
// Expected at d902c8a: H1 and H2 pass, H3 fails. This is an intentionally failing
// remediation test, not a successful acceptance run. Derived from the committed
// dwr-transition-probe.cjs inert fixture; executes actual engine transition,
// enterPlace/cancelEntry, selectSite/openEvent, urlFor and syncURL source slices.
// Timer queue, history API, DOM and renderer are mocked; no browser claim.
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


/* Independent history fixture: exact enterPlace/cancelEntry functions, inert renderer. */
function histCtx(){
 const x=engCtx(2), entered=[], calls=[];
 x.PL=null;x.renderChron=()=>{};x.urlReady=true;x.location={pathname:"/atlas/",search:"?pack=hyperion",hash:""};x.URLSearchParams=URLSearchParams;x.LY=null;x.TRV=null;x.history={state:{atlasSurface:true},
 pushState(st,t,u){this.state=st;x.location.hash=u.includes("#")?"#"+u.split("#")[1]:"";calls.push({op:"push",st,u});},
 replaceState(st,t,u){this.state=st;x.location.hash=u.includes("#")?"#"+u.split("#")[1]:"";calls.push({op:"replace",st,u});}};
 x.fade={classList:{add(){},remove(){}}};x.requestAnimationFrame=fn=>fn();
 vm.runInContext(eng.slice(eng.indexOf("function urlFor("),eng.indexOf("function parseHash("))+
 eng.slice(eng.indexOf("function syncURL("),eng.indexOf("/* nothing is written to the address bar"))+
 eng.slice(eng.indexOf("function transition("),eng.indexOf("\n",eng.indexOf("function transition("))),x);
 x.refreshAll=()=>x.syncURL();
 x.PLACES.enter=(w,s)=>entered.push(s.id);x.entered=entered;x.calls=calls;
 vm.runInContext(eng.slice(eng.indexOf("function selectSite("),eng.indexOf("/* ===================== PLACES:"))+eng.slice(eng.indexOf("function openEvent("),eng.indexOf("/* book filter */")),x);
 return x;
}
let x=histCtx();x.enterPlace(s.id,false);x.drain();
assert.equal(x.history.state.atlasPlace,true);assert.equal(x.S.view,"place");
console.log("H1 positive: successful entry retains place history");
x=histCtx();x.enterPlace(s.id,false);x.openEvent(null,false);x.drain();
assert.equal(x.history.state.atlasPlace,undefined);assert.equal(x.entered.length,0);
console.log("H2 positive: cancelled lone entry removes its own place marker");
x=histCtx();x.enterPlace(s.id,false);x.enterPlace(other.id,false);x.drain();
assert.equal(x.S.view,"place");assert.equal(x.S.site,other.id);assert.equal(x.entered.length,1);
console.log(JSON.stringify({case:"H3 overlapping entries",entered:x.entered,state:x.S,history:x.history.state,calls:x.calls}));
assert.equal(x.history.state.atlasPlace,true,"H3 successful second entry must retain its own place-history marker");
