// Independent DWT-03 review, ChatGPT, 2026-11-08.
// Actual engine action/transition/entry/history slices; deterministic timers; mock DOM/3D.
// Reuses the inspected dwt02-fix-probe.cjs ctx fixture, adds real descend/goPlace/openEvent.
// No browser, pixel, device or canon certification. node reviewer-dwt03-5bfde31.cjs <checkout-root>
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
    WORLD_BY: WORLDS, BOOKS: {}, RL: null, EV_BY: {e1:{id:"e1",world:"a",site:"a1",book:1}}, dos:{querySelector(){return null;}}, CUM: true, MOB: false, LY: null, TRV: null, urlReady: true, location: loc,
    URLSearchParams, Date: {now:()=>now}, console,
    siteSeen: () => true, hideUnseen: o => o, selHidden: () => false, worldBookOk: () => true, announce() {}, filterOk: () => true, realmOk: () => true, seen: () => true, noSurface: () => false,
    needRealm: () => false, setRealm() {}, surfaceSite: w => ({ id: '__surface', surface: true }),
    hideTip() {}, SITE_EL: [], GL_LBL: {}, REGIONS: [], gfxFor(){return {base:"test"};}, K: { raw: {} }, lmOk: () => true,
    viewOffset() {}, refreshAll() { x.syncURL(); }, hint() {}, UI: { hints: {} }, AUD: null, soundOn: false,
    renderDossier() {}, renderCrumbs() {}, renderChron() {}, buildSiteLabels() {}, clearPlanet() {}, freeMaps() {},
    buildPlanet(){}, fitDist:()=>1, orbW:{t:{set(){}},gt:{set(){}}}, flyDistFor: () => 1, orbG: { t: { copy() {} }, gt: { copy() {} } }, descend: id => { x.S.sel = id; x.S.view = 'world'; },
    openEvent: id => { x.S.ev = id; },
    PLACES: {
      enter: (w, s) => log.entered.push(w.id + '/' + s.id), exit() {}, setIdle() {}, landmarks: () => [], focus() {},
      overview() {}, stopFx() {}, play: fx => log.played.push(fx), place: { sc: {} },
    },
    fade: { classList: { add() {}, remove() {} } }, requestAnimationFrame: fn => fn(),
    setTimeout:schedule, clearTimeout(id){const i=q.findIndex(t=>t.id===id);if(i>=0)q.splice(i,1);},
    $: s => (s === '#tourBox' ? { hidden: false } : s === '#tourBtn' ? { setAttribute() {} } : { hidden: false, dataset: {}, querySelector(){return {style:{}};} }),
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
  Object.defineProperty(x, 'PL', { get: () => (x.forceNoPL || x.S.view === 'galaxy' ? null : { w: WORLDS[x.S.sel] }) });
  const src =
    line('function transition(') + '\n' +
    cut('function goPlace(', 'TRV=') +
    cut('function descend(', '/* Back from the surface.') +
    cut('function openEvent(', '/* book filter */') +
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

const G={st:null,hash:'#'}, SURF=w=>({st:{atlasSurface:true},hash:'#world='+w+'&view=surface'});
const PLACE=(w,s)=>({st:{atlasSurface:true,atlasPlace:true,atlasEntry:1},hash:'#world='+w+'&site='+s+'&view=place'});
const tests=[];
function test(name,fn){try{const result=fn();tests.push({name,pass:!!result.ok,observed:result});}catch(e){tests.push({name,pass:false,error:String(e.stack)});}}
const state=x=>({view:x.S.view,world:x.S.sel,site:x.S.site,hash:x.H.list[x.H.i].hash,entered:[...x.log.entered]});
const galaxy=()=>ctx({S:{view:'galaxy',sel:'a'},history:[G]});
function setup(route){
 const x=route==='openEvent'?ctx({S:{view:'world',sel:'b'},history:[G,SURF('b')]}):route==='doLeavePlace'?ctx({S:{view:'place',sel:'a',site:'a1'},history:[G,SURF('a'),PLACE('a','a1')]}):galaxy();
 if(route==='goPlace')x.goPlace('a','a1');
 else if(route==='openEvent')x.openEvent('e1',true);
 else {x.forceNoPL=true;x.doLeavePlace();x.forceNoPL=false;}
 return x;
}
for(const route of ['goPlace','openEvent','doLeavePlace']){
 test(route+' positive: delayed selection completes without newer navigation',()=>{
  const x=setup(route);x.drain();const s=state(x);return {ok:s.view==='world'&&s.world==='a'&&s.site==='a1',...s};});
 for(const time of [450,800])test(route+' stale timer cannot rename '+(time===450?'committed':'pending')+' newer entry',()=>{
  const x=setup(route);x.advance(time);x.enterPlace('a2');x.drain();const s=state(x);
  return {ok:s.view==='place'&&s.world==='a'&&s.site==='a2'&&s.entered.join()==='a/a2'&&s.hash==='#world=a&site=a2&view=place',...s};});
}
for(const gap of [0,150,429,430,1000])test('tree last request wins: a1 then a2 at '+gap+'ms',()=>{
 const x=galaxy();x.goPlace('a','a1');x.advance(gap);x.goPlace('a','a2');x.drain();const s=state(x);
 return {ok:s.view==='world'&&s.world==='a'&&s.site==='a2'&&s.hash==='#world=a&site=a2&view=surface',...s};});
test('tree A/B/A during descent: last A site wins',()=>{
 const x=galaxy();x.goPlace('a','a1');x.advance(100);x.goPlace('b','b1');x.advance(100);x.goPlace('a','a2');x.drain();const s=state(x);
 return {ok:s.world==='a'&&s.site==='a2'&&s.hash==='#world=a&site=a2&view=surface',...s};});
for(const t of tests)console.log((t.pass?'PASS ':'FAIL ')+t.name+' '+JSON.stringify(t.observed||t.error));
console.log(JSON.stringify({passed:tests.filter(t=>t.pass).length,total:tests.length}));
process.exitCode=tests.every(t=>t.pass)?0:1;
