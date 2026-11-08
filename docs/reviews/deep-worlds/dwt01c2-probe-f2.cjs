// DWO-E2-F2 adaptation of dwt01c2-probe.cjs: identical except four context mocks the F2 head needs (hideUnseen as
// identity, selHidden false and worldBookOk true, since this harness mocks every world/site as visible; announce as a no-op). Usage unchanged.
// DWT-01c(2) builder regression: ChatGPT's dwt-review-probe-3621250.cjs harness unchanged (T1-T22) plus T23-T26.
// T23 chained 3-request cancellation; T24 newer successful manual entry over pending tour entries; T25 stale-baseline
// control after a committed switch; T26 baseline refresh after a rollback. VM only; renderer/DOM mocked; no browser claim.
// Expected: 3621250 fails T21 (and T23); the overlapping-baseline fix passes 26/26.
// Run: node dwt-review-probe-3621250.cjs <checkout-root>
// Adds a location.href getter to model rollback URLs; DOM/renderer remain mocked.
// Independent extension at 3621250: T21 overlapping-switch cancellation and T22 positive control; VM only.
// DWT-01c builder regression: the independent dwt-review-probe-1fe00c4.cjs harness unchanged, plus T17-T20.
// T17/T18 cancellation superseded by a newer entry (newer navigation must win, no rollback over it); T19 fresh travel
// after a rolled-back Stop; T20 landmark/event state restored with the rendered place. VM model only; no browser claim.
// Expected: parent 1fe00c4 fails T15, T19, T20 (17/20); the DWT-01c fix passes 20/20.
// DWT-01a/b builder regression (extends the independent dwt-review-probe-469a83c.cjs harness unchanged; T9-T14 added).
// Run: node dwt01ab-probe.cjs <checkout-root>. VM model only: renderer/DOM mocked, chronological fake timers, async history.
// Expected: parent 469a83c fails T6, T7, T8, T12, T13, T14 (8/14); the DWT-01a/b fix passes 14/14.
// Independent extension: chronological fake timers and async history; T6-T8 are new. Renderer/DOM remain mocked; no browser claim.
// DWT-01 regression: stale tour/event travel continuations and double in-app Back.
// Run: node dwt-tour-probe.cjs <checkout-root>
// Executes the checkout's actual engine.js source slices: transition, urlFor/parseHash/syncURL, ascend/doAscend,
// selectSite, canEnter, placeGen/evEligible, enterPlace/cancelEntry/leavePlace/doLeavePlace/evInPlace, goEvent,
// tourList..goEvent (incl. any declarations between them), tourStop, and the popstate handler body. Mocked: chronological timer/transition queue, a history stack whose back()
// is asynchronous (popstate delivered later, as in browsers), DOM, renderer and planet building.
// "Document exit" = back() past the first atlas history entry. Not a browser or rendered-visibility claim.
// Expected characterization: parent aea2347 passes 2/8; 469a83c passes 5/8. T6-T8 fail both.
// Fake clock starts at 100000 ms, orders timers by due time, and models delayed popstate.
// T8 uses 3000 ms traversal latency. It proves a second Back, not a browser document exit.
const fs = require('node:fs'), path = require('node:path'), vm = require('node:vm');
const root = process.argv[2];
const eng = fs.readFileSync(path.join(root, 'public/atlas/engine.js'), 'utf8');
const cut = (a, b) => {
  const i = eng.indexOf(a), j = eng.indexOf(b, i + 1);
  if (i < 0 || j < 0) throw new Error('slice not found: ' + a + ' .. ' + b);
  return eng.slice(i, j);
};
const line = a => cut(a, '\n');
const mk = id => ({ id, name: id, sites: [{ id: id + '1', name: id + '1' }, { id: id + '2', name: id + '2' }] });
const WORLDS = { a: mk('a'), b: mk('b'), c: mk('c') };

function ctx(start) {
  let now=100000, timerId=0; const schedule=(fn,delay=0)=>{q.push({fn,at:now+delay,id:++timerId});return timerId;};
  const q = [], log = { entered: [], backs: 0, exits: 0, played: [] };
  const H = { list: start.history.map(h => ({ st: h.st, hash: h.hash })), i: start.history.length - 1 };
  const loc = { pathname: '/atlas/', search: '?pack=t', hash: H.list[H.i].hash };
  Object.defineProperty(loc, 'href', {get:()=> 'https://atlas.example'+loc.pathname+loc.search+loc.hash});
  let popHandler = null;
  const x = vm.createContext({
    S: Object.assign({ book: 0, realm: null, site: null, ev: null, lm: null }, start.S),
    WORLD_BY: WORLDS, BOOKS: {}, CUM: true, MOB: false, LY: null, TRV: null, urlReady: true, location: loc,
    URLSearchParams, Date: {now:()=>now}, console,
    siteSeen: () => true, hideUnseen: o => o, selHidden: () => false, worldBookOk: () => true, announce() {}, filterOk: () => true, realmOk: () => true, seen: () => true, noSurface: () => false,
    needRealm: () => false, setRealm() {}, surfaceSite: w => ({ id: '__surface', surface: true }),
    hideTip() {}, SITE_EL: [], GL_LBL: {}, REGIONS: [], gfxFor() {}, K: { raw: {} }, lmOk: () => true,
    viewOffset() {}, refreshAll() { x.syncURL(); }, hint() {}, UI: { hints: {} }, AUD: null, soundOn: false,
    renderDossier() {}, renderCrumbs() {}, renderChron() {}, buildSiteLabels() {}, clearPlanet() {}, freeMaps() {},
    flyDistFor: () => 1, orbG: { t: { copy() {} }, gt: { copy() {} } }, descend: id => { x.S.sel = id; x.S.view = 'world'; },
    openEvent: id => { x.S.ev = id; },
    PLACES: {
      enter: (w, s) => log.entered.push(w.id + '/' + s.id), exit() {}, setIdle() {}, landmarks: () => [], focus() {},
      overview() {}, stopFx() {}, play: fx => log.played.push(fx), place: { sc: {} },
    },
    fade: { classList: { add() {}, remove() {} } }, requestAnimationFrame: fn => fn(),
    setTimeout:schedule, clearTimeout(id){const i=q.findIndex(t=>t.id===id);if(i>=0)q.splice(i,1);},
    $: s => (s === '#tourBox' ? { hidden: false } : s === '#tourBtn' ? { setAttribute() {} } : { hidden: false, dataset: {} }),
    document: { body: { classList: { remove() {} } } },
    addEventListener: (t, fn) => { if (t === 'popstate') popHandler = fn; },
    history: {
      get state() { return H.list[H.i].st; },
      pushState(st, t, u) { H.list.splice(H.i + 1); H.list.push({ st, hash: '#' + u.split('#')[1] }); H.i++; loc.hash = H.list[H.i].hash; },
      replaceState(st, t, u) { H.list[H.i] = { st, hash: '#' + u.split('#')[1] }; loc.hash = H.list[H.i].hash; },
      back() {
        log.backs++;
        schedule(() => { // traversal + popstate are asynchronous
          if (H.i === 0) { log.exits++; return; } // would leave the atlas document
          H.i--; loc.hash = H.list[H.i].hash; if (popHandler) popHandler();
        },start.backDelay||0);
      },
    },
  });
  Object.defineProperty(x, 'PL', { get: () => (x.S.view === 'galaxy' ? null : { w: WORLDS[x.S.sel] }) });
  const src =
    line('function transition(') + '\n' +
    cut('function urlFor(', '/* nothing is written to the address bar') +
    cut('let afterAscend=null;', 'function selectSite(') +
    cut('function selectSite(', '/* ===================== PLACES:') +
    cut('function canEnter(', 'function enterBtn(') +
    'const siteOf=(w,id)=>w&&(w.sites||[]).find(z=>z.id===id);\n' +
    cut('let afterLeave=null', 'const AUD=') +
    cut('function enterPlace(', 'const PLACE_KIND=') +
    cut('function tourList(', 'function tourShow(') +
    'const TOUR={on:true,timer:0};\n' + line('function tourStop(') + '\n' +
    cut('addEventListener("popstate"', 'function restoreFromURL(');
  vm.runInContext(src, x);
  x.log = log; x.H = H; x.enterPlace = x.enterPlace || vm.runInContext('enterPlace', x);
  x.advance = ms => {const end=now+ms;let n=0;while(q.length&&n++<500){q.sort((a,b)=>a.at-b.at||a.id-b.id);if(q[0].at>end)break;const t=q.shift();now=t.at;t.fn();}now=end;};
  x.drain=()=>x.advance(20000);
  x.ev = (id, world, site) => ({ id, world, site, book: 1 });
  return x;
}
// history entries as the engine itself writes them
const G = { st: null, hash: '#' }, SURF = w => ({ st: { atlasSurface: true }, hash: '#world=' + w + '&view=surface' });
const PLACE = (w, s) => ({ st: { atlasSurface: true, atlasPlace: true, atlasEntry: 1 }, hash: '#world=' + w + '&site=' + s + '&view=place' });

const results = [];
function test(name, fn) {
  try { fn(); results.push(['PASS', name]); } catch (e) { results.push(['FAIL', name + ' :: ' + e.message]); }
}
const eq = (a, b, m) => { if (JSON.stringify(a) !== JSON.stringify(b)) throw new Error(m + ': got ' + JSON.stringify(a) + ' expected ' + JSON.stringify(b)); };

test('T1 positive: single step from a place on world a to event in b/b1 arrives there', () => {
  const x = ctx({ S: { view: 'place', sel: 'a', site: 'a1' }, history: [G, SURF('a'), PLACE('a', 'a1')] });
  x.goEvent(x.ev('e1', 'b', 'b1')); x.drain();
  eq([x.S.view, x.S.sel, x.S.site, x.S.ev], ['place', 'b', 'b1', 'e1'], 'final state');
  eq(x.log.entered, ['b/b1'], 'places built'); eq(x.log.exits, 0, 'document exits');
});
test('T2 two rapid steps from a surface (Back pending): no second Back, no document exit, newest wins', () => {
  const x = ctx({ S: { view: 'world', sel: 'a', site: null }, history: [G, SURF('a')] });
  x.goEvent(x.ev('e1', 'b', 'b1')); x.goEvent(x.ev('e2', 'c', 'c1')); x.drain();
  eq(x.log.exits, 0, 'document exits'); eq(x.log.backs, 1, 'history.back calls');
  eq([x.S.view, x.S.sel, x.S.site, x.S.ev], ['place', 'c', 'c1', 'e2'], 'final state');
  eq(x.log.entered, ['c/c1'], 'places built');
});
test('T3 stale ascend continuation after a newer same-world step must not overwrite world/site', () => {
  // surface reached from a restored link (no atlasSurface marker): ascend runs directly, its continuation is delayed
  const x = ctx({ S: { view: 'world', sel: 'a', site: null }, history: [{ st: {}, hash: '#world=a&view=surface' }] });
  x.goEvent(x.ev('e1', 'b', 'b1')); x.goEvent(x.ev('e2', 'a', 'a2')); x.drain();
  eq([x.S.sel, x.S.site, x.S.ev], ['a', 'a2', 'e2'], 'final world/site/event');
  eq(x.log.entered.filter(p => p.startsWith('b/')), [], 'older target built');
  eq(x.log.exits, 0, 'document exits');
});
test('T4 tour Stop supersedes an in-flight step', () => {
  const x = ctx({ S: { view: 'world', sel: 'a', site: null }, history: [{ st: {}, hash: '#world=a&view=surface' }] });
  x.goEvent(x.ev('e1', 'b', 'b1')); x.tourStop(); x.drain();
  eq(x.log.entered, [], 'places built after Stop'); eq(x.S.sel, 'a', 'world after Stop');
});
test('T5 two rapid steps from inside a place: one Back, newest wins, no exit', () => {
  const x = ctx({ S: { view: 'place', sel: 'a', site: 'a1' }, history: [G, SURF('a'), PLACE('a', 'a1')] });
  x.goEvent(x.ev('e1', 'b', 'b1')); x.goEvent(x.ev('e2', 'c', 'c2')); x.drain();
  eq(x.log.exits, 0, 'document exits');
  eq([x.S.view, x.S.sel, x.S.site, x.S.ev], ['place', 'c', 'c2', 'e2'], 'final state');
  eq(x.log.entered, ['c/c2'], 'places built');
});

test('T6 Stop before a same-world place-entry fade commits builds nothing',()=>{
 const x=ctx({S:{view:'world',sel:'a',site:null},history:[G,SURF('a')]});
 x.goEvent(x.ev('e1','a','a1'));x.advance(100);x.tourStop();x.drain();
 eq(x.log.entered,[],'places built after Stop');
});
test('T7 Stop cancels a not-yet-played event effect',()=>{
 const x=ctx({S:{view:'place',sel:'a',site:'a1'},history:[G,SURF('a'),PLACE('a','a1')]});
 x.goEvent({...x.ev('e1','a','a1'),fx:'burst'});x.advance(100);x.tourStop();x.drain();
 eq(x.log.played,[],'effects played after Stop');
});
test('T8 Back still pending after 2 seconds must not permit another Back',()=>{
 const x=ctx({S:{view:'world',sel:'a',site:null},history:[G,SURF('a')],backDelay:3000});
 x.goEvent(x.ev('e1','b','b1'));x.advance(2100);x.goEvent(x.ev('e2','c','c1'));x.drain();
 eq(x.log.exits,0,'document exits');eq(x.log.backs,1,'back calls');
 eq([x.S.sel,x.S.site,x.S.ev],['c','c1','e2'],'newest destination');
});

test('T9 positive: after Stop, a fresh event navigation to the same place builds it and plays its effect',()=>{
 const x=ctx({S:{view:'world',sel:'a',site:null},history:[G,SURF('a')]});
 x.goEvent(x.ev('e1','a','a1'));x.advance(100);x.tourStop();x.drain();
 x.goEvent({...x.ev('e1','a','a1'),fx:'burst'});x.drain();
 eq(x.log.entered,['a/a1'],'places built');eq(x.log.played,['burst'],'effects played');
 eq([x.S.view,x.S.sel,x.S.site,x.S.ev],['place','a','a1','e1'],'final state');
 eq(x.H.list[x.H.i].hash,'#world=a&site=a1&view=place','final history entry');
});
test('T10 Stop does not cancel a manual (non-tour) place entry',()=>{
 const x=ctx({S:{view:'world',sel:'a',site:'a1'},history:[G,SURF('a')]});
 x.enterPlace('a1');x.advance(100);x.tourStop();x.drain();
 eq(x.log.entered,['a/a1'],'places built');eq(x.S.view,'place','view');
});
test('T11 positive: one step needing a slow (3000 ms) Back completes once, at the destination',()=>{
 const x=ctx({S:{view:'world',sel:'a',site:null},history:[G,SURF('a')],backDelay:3000});
 x.goEvent(x.ev('e1','b','b1'));x.drain();
 eq(x.log.backs,1,'back calls');eq(x.log.exits,0,'document exits');
 eq([x.S.view,x.S.sel,x.S.site,x.S.ev],['place','b','b1','e1'],'final state');eq(x.log.entered,['b/b1'],'places built');
});
test('T12 slow Back (3000 ms) + newer request at 2100 ms: one Back, newest wins, final history is its place',()=>{
 const x=ctx({S:{view:'world',sel:'a',site:null},history:[G,SURF('a')],backDelay:3000});
 x.goEvent(x.ev('e1','b','b1'));x.advance(2100);x.goEvent(x.ev('e2','c','c1'));x.drain();
 eq(x.log.backs,1,'back calls');eq(x.log.exits,0,'document exits');eq(x.log.entered,['c/c1'],'places built');
 eq(x.H.list[x.H.i].hash,'#world=c&site=c1&view=place','final history entry');
 eq(!!(x.H.list[x.H.i].st&&x.H.list[x.H.i].st.atlasPlace),true,'final entry carries the place marker');
});
test('T13 Stop mid-entry drops the place history marker that entry pushed',()=>{
 const x=ctx({S:{view:'world',sel:'a',site:null},history:[G,SURF('a')]});
 x.goEvent(x.ev('e1','a','a1'));x.advance(100);x.tourStop();x.drain();
 const st=x.H.list[x.H.i].st;eq(!!(st&&st.atlasPlace),false,'current entry still marked as a place');eq(x.S.view,'world','view');
});
test('T14 very slow Back (8000 ms) + newer request at 6000 ms: still one Back, newest wins',()=>{
 const x=ctx({S:{view:'world',sel:'a',site:null},history:[G,SURF('a')],backDelay:8000});
 x.goEvent(x.ev('e1','b','b1'));x.advance(6000);x.goEvent(x.ev('e2','c','c1'));x.drain();
 eq(x.log.backs,1,'back calls');eq(x.log.exits,0,'document exits');
 eq([x.S.view,x.S.sel,x.S.site,x.S.ev],['place','c','c1','e2'],'final state');
});


test('T15 Stop before switching places preserves the currently rendered place and its history',()=>{
 const x=ctx({S:{view:'place',sel:'a',site:'a1'},history:[G,SURF('a'),PLACE('a','a1')]});
 x.goEvent(x.ev('e2','a','a2'));x.advance(100);x.tourStop();x.drain();
 console.log('T15 observed',JSON.stringify({entered:x.log.entered,state:x.S,history:x.H.list[x.H.i]}));
 eq(x.log.entered,[],'new place construction');
 eq([x.S.view,x.S.sel,x.S.site],['place','a','a1'],'state must still name rendered a1');
 eq(x.H.list[x.H.i].hash,'#world=a&site=a1&view=place','history must still name rendered a1');
});

test('T16 positive uninterrupted switch constructs and selects the new place',()=>{
 const x=ctx({S:{view:'place',sel:'a',site:'a1'},history:[G,SURF('a'),PLACE('a','a1')]});
 x.goEvent(x.ev('e2','a','a2'));x.drain();
 eq(x.log.entered,['a/a2'],'new place construction');
 eq([x.S.view,x.S.sel,x.S.site,x.S.ev],['place','a','a2','e2'],'final state');
 eq(x.H.list[x.H.i].hash,'#world=a&site=a2&view=place','final history');
});
test('T17 cancelled entry superseded by a newer manual entry: newer entry wins, no rollback over it',()=>{
 const x=ctx({S:{view:'place',sel:'a',site:'a1'},history:[G,SURF('a'),PLACE('a','a1')]});
 x.goEvent(x.ev('e2','a','a2'));x.advance(100);x.tourStop();x.enterPlace('a2');x.drain();
 eq(x.log.entered,['a/a2'],'places built');eq([x.S.view,x.S.sel,x.S.site],['place','a','a2'],'final state');
 eq(x.H.list[x.H.i].hash,'#world=a&site=a2&view=place','final history');
});
test('T18 tour step superseded by a newer step on another world: newest wins, history not restored to a1',()=>{
 const x=ctx({S:{view:'place',sel:'a',site:'a1'},history:[G,SURF('a'),PLACE('a','a1')]});
 x.goEvent(x.ev('e2','a','a2'));x.advance(100);x.goEvent(x.ev('e3','c','c2'));x.drain();
 eq(x.log.exits,0,'document exits');eq(x.log.entered,['c/c2'],'places built');
 eq([x.S.view,x.S.sel,x.S.site,x.S.ev],['place','c','c2','e3'],'final state');
 eq(x.H.list[x.H.i].hash,'#world=c&site=c2&view=place','final history');
});
test('T19 positive: after a rolled-back Stop, fresh travel to the same destination builds it',()=>{
 const x=ctx({S:{view:'place',sel:'a',site:'a1'},history:[G,SURF('a'),PLACE('a','a1')]});
 x.goEvent(x.ev('e2','a','a2'));x.advance(100);x.tourStop();x.drain();
 x.goEvent(x.ev('e2','a','a2'));x.drain();
 eq(x.log.entered,['a/a2'],'places built');eq([x.S.view,x.S.sel,x.S.site,x.S.ev],['place','a','a2','e2'],'final state');
 eq(x.H.list[x.H.i].hash,'#world=a&site=a2&view=place','final history');
});
test('T20 Stop restores the rendered place\'s landmark and event selection',()=>{
 const x=ctx({S:{view:'place',sel:'a',site:'a1',lm:'L1',ev:'e0'},history:[G,SURF('a'),PLACE('a','a1')]});
 x.goEvent(x.ev('e2','a','a2'));x.advance(100);x.tourStop();x.drain();
 eq([x.S.view,x.S.site,x.S.lm,x.S.ev],['place','a1','L1','e0'],'restored selection');eq(x.log.entered,[],'places built');
});

test('T21 two pending same-world switches then Stop restore the committed rendered place',()=>{
 const x=ctx({S:{view:'place',sel:'a',site:'a1'},history:[G,SURF('a'),PLACE('a','a1')]});
 x.goEvent(x.ev('e2','a','a2'));x.advance(100);
 x.goEvent(x.ev('e1','a','a1'));x.advance(100);x.tourStop();x.drain();
 console.log('T21 observed',JSON.stringify({entered:x.log.entered,state:x.S,history:x.H.list[x.H.i]}));
 eq(x.log.entered,[],'no cancelled place built');
 eq([x.S.view,x.S.sel,x.S.site],['place','a','a1'],'state names rendered place');
 eq(x.H.list[x.H.i].hash,'#world=a&site=a1&view=place','history names rendered place');
});
test('T22 positive: latest overlapping same-world entry completes without Stop',()=>{
 const x=ctx({S:{view:'place',sel:'a',site:'a1'},history:[G,SURF('a'),PLACE('a','a1')]});
 x.goEvent(x.ev('e2','a','a2'));x.advance(100);x.goEvent(x.ev('e1','a','a1'));x.drain();
 eq(x.log.entered,['a/a1'],'only latest builds');
 eq([x.S.site,x.S.ev],['a1','e1'],'latest state');
});
test('T23 three chained pending switches then Stop restore the committed place with its landmark/event',()=>{
 const x=ctx({S:{view:'place',sel:'a',site:'a1',lm:'L1',ev:'e0'},history:[G,SURF('a'),PLACE('a','a1')]});
 x.goEvent(x.ev('e2','a','a2'));x.advance(100);x.goEvent(x.ev('e1','a','a1'));x.advance(100);
 x.goEvent(x.ev('e2','a','a2'));x.advance(100);x.tourStop();x.drain();
 eq(x.log.entered,[],'no cancelled place built');
 eq([x.S.view,x.S.sel,x.S.site,x.S.lm,x.S.ev],['place','a','a1','L1','e0'],'state names rendered place');
 eq(x.H.list[x.H.i].hash.replace(/&lm=L1$/,''),'#world=a&site=a1&view=place','history names rendered place (syncURL may append its restored lm)');
});
test('T24 newer manual entry during a pending tour switch commits; later Stop does not roll it back',()=>{
 const x=ctx({S:{view:'place',sel:'a',site:'a1'},history:[G,SURF('a'),PLACE('a','a1')]});
 x.goEvent(x.ev('e2','a','a2'));x.advance(100);x.enterPlace('a2');x.advance(100);x.tourStop();x.drain();
 eq(x.log.entered,['a/a2'],'manual entry built');eq([x.S.view,x.S.sel,x.S.site],['place','a','a2'],'final state');
 eq(x.H.list[x.H.i].hash,'#world=a&site=a2&view=place','final history');
});
test('T25 after a committed switch, a new pending switch + Stop restores the new place (no stale baseline)',()=>{
 const x=ctx({S:{view:'place',sel:'a',site:'a1'},history:[G,SURF('a'),PLACE('a','a1')]});
 x.goEvent(x.ev('e1','a','a1'));x.advance(100);x.goEvent(x.ev('e2','a','a2'));x.drain();
 x.goEvent(x.ev('e1','a','a1'));x.advance(100);x.tourStop();x.drain();
 eq(x.log.entered,['a/a2'],'only committed switch built');eq([x.S.view,x.S.site,x.S.ev],['place','a2','e2'],'state names a2');
 eq(x.H.list[x.H.i].hash,'#world=a&site=a2&view=place','history names a2');
});
test('T26 after an overlapping rollback, a further pending switch + Stop still restores a1; fresh travel then builds',()=>{
 const x=ctx({S:{view:'place',sel:'a',site:'a1'},history:[G,SURF('a'),PLACE('a','a1')]});
 x.goEvent(x.ev('e2','a','a2'));x.advance(100);x.goEvent(x.ev('e1','a','a1'));x.advance(100);x.tourStop();x.drain();
 x.goEvent(x.ev('e2','a','a2'));x.advance(100);x.tourStop();x.drain();
 eq(x.log.entered,[],'nothing built');eq([x.S.view,x.S.site],['place','a1'],'state a1');
 eq(x.H.list[x.H.i].hash,'#world=a&site=a1&view=place','history a1');
 x.goEvent(x.ev('e2','a','a2'));x.drain();
 eq(x.log.entered,['a/a2'],'fresh travel builds');eq(x.H.list[x.H.i].hash,'#world=a&site=a2&view=place','history a2');
});
for (const [r, m] of results) console.log(r + ' ' + m);
const f = results.filter(r => r[0] === 'FAIL').length;
console.log((results.length - f) + '/' + results.length + ' passed');
process.exitCode = f ? 1 : 0;
