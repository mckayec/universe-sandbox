// Independent source-slice review of DWO-E2-F1. Node VM, not a rendered-browser test.
// Executes the exact checkout's #books click handler. Navigation, DOM and renderer are mocks.
// Tests immediate state/text cleanup before asynchronous leave, with positive branch controls.
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const eng = fs.readFileSync(path.join(process.argv[2], 'public/atlas/engine.js'), 'utf8');
const start = eng.indexOf('/* book filter */');
const end = eng.indexOf('/* compact work picker', start);
assert(start >= 0 && end > start, 'book handler markers exist');
const src = eng.slice(start, end);

function context(opts = {}) {
  const world = { id: 'w', first: 2, sites: [{ id: 's', books: [2] }] };
  const counts = { stop: 0, tourStop: 0, enter: 0, leave: 0, ascend: 0, refresh: 0, chron: 0 };
  const dossier = { innerHTML: 'later event and place copy' };
  const crumbs = { innerHTML: 'later place breadcrumb' };
  const button = { dataset: { b: String(opts.nextBook ?? 1) }, setAttribute() {} };
  let click;
  const books = {
    addEventListener(_, fn) { click = fn; },
    querySelectorAll() { return [button]; },
  };
  const x = vm.createContext({
    S: { view: opts.view || 'place', sel: 'w', site: 's', book: 2, ev: 'e70', lm: 'lm' },
    WORLD_BY: { w: world },
    placeGen: 0, evNav: 0, navNext: { id: 'pending' },
    TOUR: { on: !!opts.tour },
    PLACES: {
      stopFx() { counts.stop++; },
      enter() { counts.enter++; },
      landmarks() { return opts.landmarkVisible ? [{ id: 'lm' }] : []; },
    },
    $: sel => sel === '#books' ? books : crumbs,
    dos: dossier, UI: { galaxyCrumb: 'The galaxy' }, esc: s => s,
    seen: () => opts.worldVisible ?? false,
    siteOf: () => opts.missingSite ? undefined : world.sites[0],
    siteSeen: () => opts.siteVisible ?? true,
    renderChron() { counts.chron++; },
    leavePlace(after) {
      counts.leave++;
      x.atLeave = { book: x.S.book, ev: x.S.ev, lm: x.S.lm, dossier: dossier.innerHTML, crumbs: crumbs.innerHTML, chron: counts.chron };
      x.leaveContinuation = after;
    },
    ascend(after) { counts.ascend++; x.ascendContinuation = after; },
    refreshAll() { counts.refresh++; },
    tourStop() { counts.tourStop++; x.TOUR.on = false; },
    gfxFor() {}, K: { raw: {} }, lmOk: () => true, viewOffset() {},
    selectLandmark(id) { x.S.lm = id; },
    cacheKey: () => 'key', PL: { key: 'key' }, descend() {},
  });
  vm.runInContext(src, x, { filename: 'actual-book-handler.js' });
  x.press = () => click({ target: { closest: () => opts.noButton ? null : button } });
  x.counts = counts; x.dossier = dossier; x.crumbs = crumbs;
  return x;
}

const results = [];
function test(name, f) {
  try { f(); results.push({ name, pass: true }); }
  catch (e) { results.push({ name, pass: false, error: e.message }); }
}
function blankBeforeLeave(x) {
  x.press();
  assert.equal(x.counts.leave, 1);
  assert.equal(x.atLeave.ev, null, 'event must clear before leave is requested');
  assert.equal(x.atLeave.lm, null, 'landmark must clear before leave is requested');
  assert.equal(x.atLeave.dossier, '', 'later place copy must clear before leave');
  assert.equal(x.atLeave.crumbs, '<button data-c="gal">The galaxy</button>');
  assert.equal(x.atLeave.chron, 1, 'chronicle rebuild before leave');
  assert.equal(x.atLeave.book, 1);
}
test('F1 hidden world: event, landmark and place copy cleared before leave', () => blankBeforeLeave(context()));
test('F1 hidden site on visible world: same immediate cleanup', () => blankBeforeLeave(context({ worldVisible: true, siteVisible: false })));
test('F1 missing current site: same immediate cleanup', () => blankBeforeLeave(context({ worldVisible: true, missingSite: true })));
test('F1 active tour: stop, discard queued travel, clear before leave', () => {
  const x = context({ tour: true }); blankBeforeLeave(x);
  assert.equal(x.counts.tourStop, 1); assert.equal(x.navNext, null); assert.equal(x.evNav, 1); assert.equal(x.placeGen, 1);
});
test('Positive: still-visible place rebuilt and eligible landmark retained', () => {
  const x = context({ worldVisible: true, landmarkVisible: true }); x.press();
  assert.equal(x.counts.enter, 1); assert.equal(x.counts.leave, 0); assert.equal(x.S.ev, null); assert.equal(x.S.lm, 'lm'); assert.equal(x.counts.refresh, 1);
});
test('Positive: still-visible place drops ineligible landmark', () => {
  const x = context({ worldVisible: true }); x.press();
  assert.equal(x.counts.enter, 1); assert.equal(x.S.lm, null); assert.equal(x.S.ev, null);
});
test('Positive: All books continues visible place branch', () => {
  const x = context({ nextBook: 0, worldVisible: true, landmarkVisible: true }); x.press();
  assert.equal(x.S.book, 0); assert.equal(x.counts.enter, 1); assert.equal(x.counts.leave, 0); assert.equal(x.S.lm, 'lm');
});
test('Positive: unrelated click leaves current state unchanged', () => {
  const x = context({ noButton: true }); x.press(); assert.equal(x.S.book, 2); assert.equal(x.S.ev, 'e70'); assert.equal(x.counts.leave, 0);
});
// Characterization, not a desired-behavior pass: this other branch remains untouched.
const residual = context({ view: 'world' }); residual.press();
console.log('WORLD_ASCEND_CHARACTERIZATION', JSON.stringify({ book: residual.S.book, event: residual.S.ev, dossier: residual.dossier.innerHTML, crumbs: residual.crumbs.innerHTML, ascend: residual.counts.ascend, refresh: residual.counts.refresh }));
for (const r of results) console.log((r.pass ? 'PASS ' : 'FAIL ') + r.name + (r.error ? ': ' + r.error : ''));
console.log(JSON.stringify({ pass: results.filter(r => r.pass).length, fail: results.filter(r => !r.pass).length, total: results.length }));
process.exitCode = results.every(r => r.pass) ? 0 : 1;
