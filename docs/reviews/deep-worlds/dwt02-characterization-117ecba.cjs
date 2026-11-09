// DWT-02 characterization on 117ecba: four book/presentation mocks added; every fixture world is visible.
// Navigation slices and desired-arrival/fresh-retry checks unchanged; not a browser test.
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


const x=ctx({S:{view:'place',sel:'a',site:'a1'},history:[G,SURF('a'),PLACE('a','a1')]});
x.goEvent(x.ev('e2','a','a2'));x.advance(100);x.goEvent(x.ev('e2','a','a2'));x.drain();
console.log('repeat',JSON.stringify({entered:x.log.entered,state:x.S,history:x.H.list[x.H.i]}));
const arrived=x.log.entered.includes('a/a2');
x.goEvent(x.ev('e2','a','a2'));x.drain();
console.log('freshRetry',JSON.stringify({entered:x.log.entered,state:x.S,history:x.H.list[x.H.i]}));
console.log('desired arrival and recovery:',Number(arrived)+Number(x.log.entered.includes('a/a2'))+'/2');
