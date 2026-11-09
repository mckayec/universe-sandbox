// Independent F2 source-slice checks. Run: node dwo-e2-f2-source-review-117ecba.cjs <checkout-root>
// Actual host book guards, dossier renderer, crumbs, announcement, URL and popstate callback.
// Minimal DOM/pack/renderer/history fixtures; no browser, 3D, timing or full-pack acceptance.
const fs = require('node:fs'), path = require('node:path'), vm = require('node:vm');
const assert = require('node:assert/strict');
const eng = fs.readFileSync(path.join(process.argv[2], 'public/atlas/engine.js'), 'utf8');
const cut = (a, b) => { const i = eng.indexOf(a), j = eng.indexOf(b, i + 1); assert(i >= 0 && j > i, a); return eng.slice(i, j); };
const line = a => cut(a, '\n');
const hasF2 = eng.includes('function hideUnseen(');
function context(state = {}, worldMods = {}, siteMods = {}) {
  const site = Object.assign({ id: 'later-site', name: 'LaterSite', books: [2], desc: 'SITE_DESCRIPTION' }, siteMods);
  const w = Object.assign({ id: 'later-world', name: 'LaterWorld', first: 2, books: [2], blurb: 'WORLD_DESCRIPTION', sites: [site], group: 'g' }, worldMods);
  const nodes = { '#crumbs': { innerHTML: '' }, '#announce': { textContent: '' } };
  const dos = { innerHTML: '', classList: { toggle() {} }, scrollTop: 0 };
  const hs = { atlasSurface: true, atlasPlace: true, atlasEntry: 42 };
  const loc = { pathname: '/atlas/', search: '?pack=fixture', hash: '#book=2&world=later-world&site=later-site&view=place' };
  let pop;
  const x = vm.createContext({
    S: Object.assign({ sel: w.id, site: site.id, view: 'place', book: 1, lm: null, ev: null, realm: 'physical' }, state),
    WORLD_BY: { [w.id]: w }, CUM: true, LY: null, TRV: null, URLSearchParams,
    PLACES: { place: { site }, landmarks: () => [] },
    K: { meta: { title: 'Series', series: 'Series' }, intro: {} },
    BOOKS: { 1: { title: 'BookOne' }, 2: { title: 'BookTwo' }, 3: { title: 'BookThree' } }, BOOK_IDS: [1, 2, 3], nBooksWord: 'three',
    UI: { galaxyCrumb: 'Galaxy', homeCrumb: 'Cluster', homeAction: 'Explore', homeLink: 'Cluster' },
    dos, MOB: false, dosCollapsed: false,
    $: id => nodes[id] || null, ARR: v => v == null ? [] : Array.isArray(v) ? v : [v], esc: v => String(v ?? ''),
    realmOk: () => true, filterOk: () => true, groupOpt: () => null, GROUP_NAME: () => 'Group',
    grab: title => '<div>' + title + '</div>', realmCard: () => '', fanNotice: () => '',
    statusFor: () => '', noSurface: () => false, bks: () => '', eraBlurb: z => z.blurb, eraVal: () => [],
    distText: () => '', placeMeta: () => '', siteExtra: () => '', enterBtn: () => '', evFor: () => [],
    placeDossier() { return '<h2>' + site.name + '</h2>SITE_DESCRIPTION'; },
    siteOf: (z, id) => (z.sites || []).find(s => s.id === id),
    siteName: (z, id) => ((z.sites || []).find(s => s.id === id) || {}).name || '',
    location: loc, history: { state: hs, replaceState(st, _, url) { assert.equal(st, hs); loc.hash = url.includes('#') ? '#' + url.split('#')[1] : ''; } },
    storeBook() {}, backPending: true, popNav() {}, navKick() {},
    addEventListener(type, fn) { if (type === 'popstate') pop = fn; },
  });
  let src = line('const firstOf=') + '\n' +
    cut('const siteEraOk=', hasF2 ? '/* DWO-E2-F2:' : 'const evFor=') +
    (hasF2 ? cut('const worldBookOk=', 'const evFor=') : '') +
    cut('function renderDossier(', 'function eraBlurb(') +
    cut('function renderCrumbs(', '$("#crumbs").addEventListener') +
    cut('function urlFor(', '/* nothing is written to the address bar') +
    cut('let urlReady=false', 'addEventListener("popstate"') +
    cut('addEventListener("popstate"', 'addEventListener("pageshow"');
  vm.runInContext(src, x); vm.runInContext('urlReady=true', x);
  x.paint = () => { x.renderDossier(); x.renderCrumbs(); x.afterRefresh(); };
  x.out = () => ({ dossier: dos.innerHTML, crumbs: nodes['#crumbs'].innerHTML, ann: nodes['#announce'].textContent, hash: loc.hash });
  x.pop = () => pop(); x.world = w; x.site = site;
  return x;
}
const results = [];
function test(name, fn) { try { fn(); results.push({ name, pass: true }); } catch (e) { results.push({ name, pass: false, error: e.message }); } }
const snap = x => JSON.stringify(x.S);
function neutralWorld(x) {
  const before = snap(x); x.paint(); const r = x.out();
  assert(!/LaterWorld|LaterSite|WORLD_DESCRIPTION|SITE_DESCRIPTION/.test(r.dossier + r.crumbs + r.ann), 'hidden copy must not render');
  assert.equal(r.hash, '#book=1'); assert.equal(snap(x), before, 'presentation must preserve navigation state');
}
for (const view of ['place', 'world', 'galaxy']) test('Hidden world neutral through ' + view + ' phase', () => neutralWorld(context({ view })));
test('Hidden site retains visible world dossier and URL', () => {
  const x = context({}, { first: 1 }); const before = snap(x); x.paint(); const r = x.out();
  assert(!/LaterSite|SITE_DESCRIPTION/.test(r.dossier + r.crumbs + r.ann)); assert(r.dossier.includes('LaterWorld'));
  assert.equal(r.hash, '#book=1&world=later-world&view=surface'); assert.equal(snap(x), before);
});
test('Hidden site in world phase is not announced or written', () => {
  const x = context({ view: 'world' }, { first: 1 }); x.paint(); const r = x.out();
  assert(!/LaterSite|SITE_DESCRIPTION/.test(r.dossier + r.crumbs + r.ann)); assert(!r.hash.includes('site='));
});
test('Site since gate is enforced', () => {
  const x = context({}, { first: 1 }, { books: [], since: 2 }); x.paint(); assert(!x.out().crumbs.includes('LaterSite')); assert(!x.out().hash.includes('site='));
});
test('Site until gate is enforced', () => {
  const x = context({ book: 2 }, { first: 1 }, { books: [1], until: 2 }); x.paint(); assert(!x.out().crumbs.includes('LaterSite')); assert(!x.out().hash.includes('site='));
});
test('Visible place positive keeps dossier, announcement and URL', () => {
  const x = context({ book: 2 }); const before = snap(x); x.paint(); const r = x.out();
  assert(r.dossier.includes('SITE_DESCRIPTION')); assert(r.crumbs.includes('LaterSite')); assert(r.ann.includes('LaterSite'));
  assert.equal(r.hash, '#book=2&world=later-world&site=later-site&view=place'); assert.equal(snap(x), before);
});
test('All-books positive keeps visible place', () => {
  const x = context({ book: 0 }); x.paint(); assert(x.out().crumbs.includes('LaterSite')); assert(x.out().hash.includes('site=later-site'));
});
test('Noncumulative positive keeps existing selection', () => {
  const x = context(); x.CUM = false; x.paint(); assert(x.out().crumbs.includes('LaterSite')); assert(x.out().hash.includes('site=later-site'));
});
test('A later book restores previously hidden presentation without changing selection', () => {
  const x = context(); neutralWorld(x); x.S.book = 2; x.paint(); assert(x.out().dossier.includes('SITE_DESCRIPTION')); assert(x.out().hash.includes('view=place'));
});
test('Popped later-book entry is rewritten immediately and retains history marker', () => {
  const x = context(); const old = x.history.state; x.pop();
  assert.equal(x.out().hash, '#book=1'); assert.equal(x.history.state, old);
});
test('Visible-world popstate control does not remove the destination', () => {
  const x = context({ book: 2 }); x.pop(); assert(x.out().hash.includes('site=later-site'));
});
test('URL writes for a pending hidden destination exclude its later-book identity', () => {
  const x = context({ sel: null, site: null, view: 'galaxy' });
  assert.equal(x.urlFor({ sel: 'later-world', site: 'later-site', view: 'place' }), '/atlas/?pack=fixture#book=1');
});
if (hasF2) {
  test('asVisible restores all temporary selection fields after a throw', () => {
    const x = context(), before = snap(x); assert.throws(() => x.asVisible(() => { throw Error('probe'); })); assert.equal(snap(x), before);
  });
  test('Nested asVisible restores the original transition state', () => {
    const x = context(), before = snap(x); x.asVisible(() => x.asVisible(() => assert.equal(x.S.sel, null))); assert.equal(snap(x), before);
  });
}
for (const r of results) console.log((r.pass ? 'PASS ' : 'FAIL ') + r.name + (r.error ? ': ' + r.error : ''));
console.log(JSON.stringify({ hasF2, pass: results.filter(r => r.pass).length, total: results.length }));
process.exitCode = results.every(r => r.pass) ? 0 : 1;
