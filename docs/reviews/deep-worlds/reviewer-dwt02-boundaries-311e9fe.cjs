// Independent DWT-02 timing/payload check, 2026-11-08 ChatGPT.
// Reuses the inspected ctx fixture from dwt02-fix-probe.cjs; actual engine slices,
// fake timers/history and mocked renderer, NOT browser or book-gate validation.
// node reviewer-dwt02-boundaries-311e9fe.cjs <checkout-root>
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

let passed=0,total=0;
function check(label,condition,x){total++;if(condition)passed++;console.log((condition?'PASS ':'FAIL ')+label+' '+JSON.stringify({site:x.S.site,event:x.S.ev,landmark:x.S.lm,entered:x.log.entered,played:x.log.played,history:x.H.list[x.H.i],length:x.H.list.length}));}
function start(){return ctx({S:{view:'place',sel:'a',site:'a1',ev:'old-event',lm:'old-landmark'},history:[G,SURF('a'),{...PLACE('a','a1'),hash:'#world=a&site=a1&view=place&lm=old-landmark'}]});}
for(const delay of [0,1,100,429,430,431,929,930]){
 const x=start();
 x.goEvent({...x.ev('first','a','a2'),fx:'first-fx'});
 x.advance(delay);
 x.goEvent({...x.ev('latest','a','a2'),fx:'latest-fx'});
 x.drain();
 check('latest different event, same destination, delay='+delay,
 x.log.entered.join()==='a/a2'&&x.S.view==='place'&&x.S.sel==='a'&&x.S.site==='a2'&&x.S.ev==='latest'&&x.log.played.join()==='latest-fx'&&x.H.list.length===3&&x.H.list[x.H.i].hash==='#world=a&site=a2&view=place',x);
}
for(const delay of [0,1,100,300]){
 const x=start();
 x.goEvent({...x.ev('first','a','a2'),fx:'first-fx'});
 x.advance(delay);
 x.goEvent({...x.ev('latest','a','a2'),fx:'latest-fx'});
 x.tourStop();x.drain();
 check('repeat then Stop restores committed fields, delay='+delay,
 x.log.entered.length===0&&x.log.played.length===0&&x.S.site==='a1'&&x.S.ev==='old-event'&&x.S.lm==='old-landmark'&&x.H.list.length===3&&x.H.list[x.H.i].hash==='#world=a&site=a1&view=place&lm=old-landmark',x);
}
console.log(passed+'/'+total+' passed');process.exitCode=passed===total?0:1;
