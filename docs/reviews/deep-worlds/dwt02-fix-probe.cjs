// DWT-02 builder regression probe (Claude). Harness = ChatGPT's dwt02-characterization-117ecba.cjs ctx() unchanged
// (same four presentation/book mocks, all fixture worlds visible); only the checks below are new. Node VM over the
// checkout's actual engine.js slices; renderer/DOM mocked; fake timers and async history. Not a browser test.
// Run: node dwt02-fix-probe.cjs <checkout-root>. Expected: parent 117ecba fails R1 and R5 (5/7); fix passes 7/7.
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
let pass=0,fail=0;const ok=(n,c,d)=>{c?pass++:fail++;console.log((c?'PASS ':'FAIL ')+n+(d?' '+JSON.stringify(d):''));};
const start=()=>ctx({S:{view:'place',sel:'a',site:'a1'},history:[G,SURF('a'),PLACE('a','a1')]});
const cur=x=>({site:x.S.site,ev:x.S.ev,view:x.S.view,sel:x.S.sel,hash:x.H.list[x.H.i].hash,len:x.H.list.length,entered:x.log.entered});
{ // R1 repeated identical pending destination: latest request arrives exactly once, no extra history entry
  const x=start();x.goEvent(x.ev('e2','a','a2'));x.advance(100);x.goEvent(x.ev('e2','a','a2'));x.drain();const c=cur(x);
  ok('R1 repeat of pending a/a2 arrives once with e2 selected',c.entered.join()==='a/a2'&&c.site==='a2'&&c.ev==='e2'&&c.hash==='#world=a&site=a2&view=place'&&c.len===3,c);}
{ // R2 fresh retry after settlement (the earlier recovery control)
  const x=start();x.goEvent(x.ev('e2','a','a2'));x.drain();x.goEvent(x.ev('e2','a','a2'));x.drain();const c=cur(x);
  ok('R2 committed a/a2 then same request is idempotent (no rebuild), e2 selected',c.entered.join()==='a/a2'&&c.site==='a2'&&c.ev==='e2'&&c.len===3,c);}
{ // R3 distinct newer destination in another world while a/a2 pending
  const x=start();x.goEvent(x.ev('e2','a','a2'));x.advance(100);x.goEvent(x.ev('e5','b','b1'));x.drain();const c=cur(x);
  ok('R3 newer b/b1 wins over pending a/a2; a/a2 never built',!c.entered.includes('a/a2')&&c.entered[c.entered.length-1]==='b/b1'&&c.sel==='b'&&c.site==='b1'&&c.ev==='e5',c);}
{ // R4 newer distinct request back to the committed site while a/a2 pending
  const x=start();x.goEvent(x.ev('e2','a','a2'));x.advance(100);x.goEvent(x.ev('e1','a','a1'));x.drain();const c=cur(x);
  ok('R4 newer a/a1 request while a/a2 pending: no a/a2 build, ends at a/a1 with e1',!c.entered.includes('a/a2')&&c.site==='a1'&&c.ev==='e1'&&c.hash==='#world=a&site=a1&view=place',c);}
{ // R5 three identical requests in a row: still one arrival
  const x=start();for(let i=0;i<3;i++){x.goEvent(x.ev('e2','a','a2'));x.advance(100);}x.drain();const c=cur(x);
  ok('R5 triple repeat arrives once',c.entered.join()==='a/a2'&&c.site==='a2'&&c.ev==='e2'&&c.len===3,c);}
{ // R6 committed view is not lost: repeat then Stop before commit rolls back to a/a1
  const x=start();x.goEvent(x.ev('e2','a','a2'));x.advance(100);x.goEvent(x.ev('e2','a','a2'));x.advance(100);x.tourStop();x.drain();const c=cur(x);
  ok('R6 repeat then Stop restores committed a/a1 state and URL, nothing built',c.entered.length===0&&c.site==='a1'&&c.hash==='#world=a&site=a1&view=place'&&c.len===3,c);
  x.goEvent(x.ev('e2','a','a2'));x.drain();const d=cur(x);ok('R6b fresh request after that Stop arrives',d.entered.join()==='a/a2'&&d.ev==='e2',d);}
console.log(pass+'/'+(pass+fail)+' passed');
