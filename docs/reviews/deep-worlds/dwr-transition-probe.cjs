// DWR-B residual remediation probe (Claude). Derived from ChatGPT's dwr-residual-probe-232fef1.cjs fixture
// (same engine slices + actual selectSite/openEvent), with the two reproductions inverted into remediation
// assertions and entered-place/state checks added. VM fixture with inert renderer; not a browser run.
// Usage: node dwr-transition-probe.cjs <exact-checkout-root>   (exit 0 = all assertions pass)
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


const out=[];
function run(label, change, after){
 const x=engCtx(2); const entered=[];
 x.PL=null; x.renderChron=()=>{};
 vm.runInContext(eng.slice(eng.indexOf("function selectSite("),eng.indexOf("/* ===================== PLACES:")) + eng.slice(eng.indexOf("function openEvent("),eng.indexOf("/* book filter */")),x);
 x.PLACES.enter=(w,s)=>entered.push(s.id);
 x.open(); change(x); x.drain(); if(after){after(x); x.drain();}
 const r={label,entered,view:x.S.view,site:x.S.site,event:x.S.ev,effects:x.played.slice()};
 console.log(JSON.stringify(r)); return r;
}
function check(c,m){assert.ok(c,m);out.push(m);}
let r=run("T1 positive uninterrupted",()=>{});
check(r.entered.length===1&&r.entered[0]===s.id&&r.view==="place"&&r.site===s.id,"T1 uninterrupted entry builds the intended place, view=place, site matches");
check(r.event===e.id&&r.effects.length===1,"T1 uninterrupted entry plays the event effect once");
r=run("T2 generation invalidated before transition (openEvent(null))",x=>x.openEvent(null,false));
check(r.entered.length===0,"T2 invalidated generation: no place built");
check(r.view!=="place"&&r.event===null&&r.effects.length===0,"T2 invalidated generation: view stays out of place, no event/effect");
r=run("T3 site changed before transition (selectSite other)",x=>x.selectSite(other.id));
check(r.entered.length===0,"T3 site change: stale place not built");
check(r.view!=="place"&&r.site===other.id&&r.effects.length===0,"T3 site change: state keeps the newly selected site, view not place, no effect");
r=run("T4 away-and-back selection before transition",x=>{x.selectSite(other.id);x.selectSite(s.id);});
check(r.entered.length===0&&r.view!=="place"&&r.site===s.id&&r.effects.length===0,"T4 away-and-back: pending entry invalidated even though site id matches again");
r=run("T5 fresh navigation after cancellation",x=>x.openEvent(null,false),x=>x.open());
check(r.entered.length===1&&r.entered[0]===s.id&&r.view==="place"&&r.site===s.id,"T5 fresh entry after a cancelled one enters the intended place once");
check(r.event===e.id&&r.effects.length===1,"T5 fresh entry plays its event effect once");
r=run("T6 world changed before transition",x=>{x.S.sel="__elsewhere";});
check(r.entered.length===0&&r.view!=="place","T6 world change: nothing built");
r=run("T7 book downgrade before transition",x=>x.bookClick(1));
check(r.entered.length===0&&r.view!=="place"&&r.effects.length===0,"T7 book change: pending entry invalidated");
console.log(JSON.stringify({pass:out.length,total:out.length,assertions:out},null,1));
