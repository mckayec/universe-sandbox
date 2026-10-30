// Source/data-only checks. No DOM, renderer, browser or server is created.
// Usage: node source-checks-r4.cjs /path/to/exact-PR24-checkout
const fs = require('node:fs'),
  path = require('node:path'),
  vm = require('node:vm'),
  assert = require('node:assert/strict');
const root = path.resolve(process.argv[2] || '.'),
  read = p => fs.readFileSync(path.join(root, p), 'utf8');
const s = read('public/atlas/society.js'),
  css = read('public/atlas/society.css');
let checks = 0;
const ok = (c, m) => {
  assert.ok(c, m);
  checks++;
};
const pre = s.slice(s.indexOf('const BOOKS='), s.indexOf('/* ---- 10-noise.js ---- */'));
const ctx = vm.createContext({});
vm.runInContext(pre + ';globalThis.data={BODIES,POIS,byId,poiVisible,poiDesc,bodyF,eraVal,setEraValue:k=>ERA=k};', ctx);
const d = ctx.data;
const gates = {
  mercury: { heliopolis: 5, tyche: 5, ladon: 5, redreach: 5, polar: 5 },
  venus: { gorgon: 4, rath: 4, vdocks: 6 },
  io: { raaseat: 3, garter: 6 },
  mars: { olympia: 5 },
  phobos: { nucleus: 6 },
};
for (const [body, ps] of Object.entries(gates))
  for (const [id, first] of Object.entries(ps)) {
    const p = d.POIS[body].find(p => p.id === id);
    ok(!!p, body + '/' + id + ' exists');
    for (let k = 1; k <= 6; k++) {
      d.setEraValue(k);
      ok(d.poiVisible(p) === k >= first, body + '/' + id + ' gate ' + k);
    }
  }
d.setEraValue(1);
const base = {
  jupiter: 'A gas giant of the outer Solar System.',
  io: 'A moon of Jupiter.',
  europa: 'A moon of Jupiter.',
  ganymede: 'A moon of Jupiter.',
  kalyke: 'A small moon of Jupiter.',
  neptune: 'The outermost giant planet of the Solar System.',
  triton: 'A moon of Neptune.',
  pluto: 'A distant world beyond Neptune.',
  asteroid: 'An asteroid in the belt.',
  rhea: 'A moon of Saturn.',
};
for (const [id, text] of Object.entries(base)) {
  ok(d.bodyF(d.byId[id], 'blurb') === text, id + ' neutral blurb');
  ok(d.bodyF(d.byId[id], 'control') === 'Not specified for this reading selection', id + ' neutral control');
}
ok(d.eraVal({ 6: 'secret' }) === '', 'future-only era value withheld');
ok(d.POIS.io.find(p => p.id === 'raaseat').desc === 'Io’s capital and the seat of House Raa.', 'final Nesos override');
ok(d.POIS.io.find(p => p.id === 'garter').desc === 'A belt of farmland around Io’s equator.', 'final Garter override');
ok(/\.book\[hidden\]\s*\{\s*display\s*:\s*none\s*\}/.test(css), 'Chronicle CSS fix present (not computed layout)');
function pack(id) {
  const c = vm.createContext({ window: {} });
  vm.runInContext(read('public/atlas/packs/' + id + '.js'), c);
  return c.window.ATLAS_PACKS[id];
}
const h = pack('hyperion'),
  se = pack('sun-eater'),
  world = id => h.worlds.find(x => x.id === id),
  entry = (p, name) => p.codex.flatMap(g => g.list).find(e => e.name === name);
ok(!world('bressia').blurb.includes('provoked as the Consul later learns'), 'Bressia unsupported attribution cut');
ok(!JSON.stringify(world('deneb3')).includes('Jamnu Republic'), 'Deneb both clauses cut');
ok(world('hebron').eras[3].blurb.endsWith('In Endymion, Aenea’s party finds it empty.'), 'Hebron conservative ending');
ok(!entry(h, 'Glennon-Height rebels').more, 'rebel cells cut');
ok(!JSON.stringify(entry(h, 'Fatline')).includes('Void'), 'Fatline mechanism cut');
ok(!/Void|hides the Core/.test(JSON.stringify(entry(h, 'Farcasters'))), 'Farcasters mechanisms cut');
ok(
  entry(se, 'William XXIII').more.find(x => x[0] === 7)[1] === 'William names Hadrian Auctor of the Imperium.',
  'Auctor timing cut',
);
ok(!se.worlds.some(w => w.id === 'b7c'), 'b7c remains absent');
// Actual registration pass and late append, without constructing scene geometry.
const lev = s.slice(s.indexOf('const LEV_TEXT='), s.indexOf('let levLbl=null'));
const sceneGate = s.slice(s.indexOf('/* ---------- scene spoiler gates'), s.indexOf('/* ---- 50-fx.js ---- */'));
const latePush = s.match(/S\.landmarks\.push\(\{id:"leviathan"[^\n]+/)[0];
const late = vm.createContext({ SITES: { europa: { landmarks: [] } } });
vm.runInContext(
  'let gateLandmarks=()=>{};' +
    sceneGate +
    lev +
    ';const S=SITES.europa;' +
    latePush +
    ';gateLandmarks();gateLandmarks();',
  late,
);
for (let k = 1; k <= 6; k++) {
  d.setEraValue(k);
  const text = d.eraVal(late.SITES.europa.landmarks[0].desc);
  ok(text.includes('In Light Bringer') === (k === 6), 'late landmark gate ' + k);
  if (k < 6) ok(text === 'A sea-creature illustration on Europa.', 'neutral ' + k);
}
ok(s.includes('showBanner("Leviathans",eraVal(LEV_DESC)'), 'banner consumes same era-resolved description');
ok(
  s.lastIndexOf('gateLandmarks();') > s.lastIndexOf('S.landmarks.push('),
  'final gate pass follows final landmark append',
);
ok(world('bressia').blurb.includes('killed the Consul’s wife and son'), 'Bressia antecedent repaired');
const controls = s.slice(s.indexOf('let navGen=0;'), s.indexOf('function evListMeta('));
const enter = s.slice(s.indexOf('function enterSite('), s.indexOf('function leaveSite('));
const stopfx = s.slice(s.indexOf('function stopFx('), s.indexOf('function fxPlaying('));
const stop = new Error('stop at load');
let disposed = 0,
  removed = 0,
  tipHidden = 0;
const banner = { style: { opacity: 1 }, hidden: false };
const c = vm.createContext({
  ERA: 6,
  bookFilter: 6,
  BOOKS: { 1: { n: 'I', title: 'Red Rising' }, 6: { n: 'VI', title: 'Light Bringer' } },
  EVENTS: [{ id: 'late', book: 6 }],
  selEvent: 'late',
  SITES: { asteroid: { name: 'Asteroid', body: 'asteroid', from: 6, landmarks: [] } },
  mode: 'site',
  cur: { id: 'asteroid' },
  curSiteKey: 'neutral',
  curSite: { landmarks: [] },
  selLm: null,
  hoverSel: null,
  fxList: [
    {
      dispose() {
        disposed++;
      },
      group: {},
      scene: {
        remove() {
          removed++;
        },
      },
    },
  ],
  $(id) {
    return id === '#banner' ? banner : {};
  },
  clearTimeout() {},
  showBanner() {},
  hideTip() {
    tipHidden++;
  },
  applyEraTextures() {},
  renderIndex() {},
  buildSiteLabels() {},
  siteVisible(key) {
    return key === 'neutral' || c.ERA >= c.SITES[key].from;
  },
  leaveSite() {
    throw Error('unexpected');
  },
  clearPoiLabels() {},
  fadeTo(a, b, fn) {
    c.pending = fn;
  },
  loadSite() {
    c.loaded = true;
    throw stop;
  },
  fade: {
    classList: {
      add() {},
      remove() {
        c.fadeRemoved = true;
      },
    },
  },
});
vm.runInContext(stopfx + controls + enter, c);
function era(k) {
  c.bookFilter = k;
  c.setEra(k);
}
c.enterSite('asteroid');
era(1);
ok(c.pending() === false && !c.loaded, 'queued entry blocked on downgrade');
ok(disposed === 1 && removed === 1 && c.fxList.length === 0, 'actual stopFx disposes/removes active effect');
ok(
  banner.hidden && banner.style.opacity === 0 && tipHidden > 0 && c.selEvent === null,
  'banner tip and selected future event cleared',
);
era(6);
c.enterSite('asteroid');
const stale = c.pending;
era(1);
era(6);
ok(stale() === false && !c.loaded, 'old callback stays invalid after downgrade and return');
c.enterSite('asteroid');
try {
  c.pending();
} catch (e) {
  if (e !== stop) throw e;
}
ok(c.loaded === true, 'fresh eligible entry still reaches loadSite');
c.loaded = false;
c.curSiteKey = 'neutral';
let resolve;
c.SITES.asteroid.preload = () => ({
  then(fn) {
    resolve = fn;
  },
});
c.SITES.asteroid._ready = false;
c.enterSite('asteroid');
era(1);
resolve();
ok(!c.loaded && c.fadeRemoved, 'pending preload cannot enter after downgrade');
// Actual gotoEvent branches with scene/globe navigation replaced by callback queues.
const goto = s.slice(s.indexOf('function gotoEvent('), s.indexOf('function descendThen('));
c.FX_VIEW = { test: { view: 'globe', body: 'asteroid' } };
c.byId = { asteroid: { id: 'asteroid' } };
c.poiById = {};
c.dossier = {
  querySelector() {
    return null;
  },
};
c.renderDossier = () => {};
c.applyHL = () => {};
let plays = 0;
c.playFx = () => plays++;
c.descendThen = (id, fn) => (c.eventPending = fn);
c.switchGlobe = (b, fn) => (c.eventPending = fn);
c.selectPoi = () => plays++;
vm.runInContext(goto, c);
c.mode = 'system';
era(6);
c.gotoEvent({ id: 'late', book: 6, body: 'asteroid', fx: 'test' });
const oldEvent = c.eventPending;
era(1);
era(6);
oldEvent();
ok(plays === 0, 'queued globe event cannot revive after repeated book changes');
c.gotoEvent({ id: 'late', book: 6, body: 'asteroid', fx: 'test' });
c.eventPending();
ok(plays === 1, 'fresh event callback permitted');
c.gotoEvent({ id: 'plain', book: 6, body: 'asteroid', poi: 'x' });
era(1);
c.eventPending();
ok(plays === 1, 'queued ordinary POI event invalidated');
c.FX_VIEW.test = { view: 'site', site: 'asteroid' };
c.enterSite = (key, focus, fn) => (c.siteEventPending = fn);
era(6);
c.gotoEvent({ id: 'late', book: 6, body: 'asteroid', fx: 'test' });
era(1);
c.siteEventPending();
ok(plays === 1, 'queued site event invalidated');
// Residual source-confirmed deferred effect: the real timer statement isn't generation guarded or disposed.
let emp = 0,
  queued;
c.SITES.heliopolis = {
  _emp() {
    emp++;
  },
};
c.setTimeout = fn => {
  queued = fn;
};
const empTimer = s.match(/SITES\.heliopolis\._emp&&setTimeout\(\(\)=>SITES\.heliopolis\._emp\(\),2500\);/)[0];
era(6);
vm.runInContext(empTimer, c);
era(1);
era(6);
queued();
ok(emp === 1, 'residual defect: old EMP timer still fires after downgrade and return');
console.log(
  JSON.stringify(
    { checks, known_remaining_defect_checks: 1, scope: 'source/data and isolated callback state; no rendering' },
    null,
    2,
  ),
);
