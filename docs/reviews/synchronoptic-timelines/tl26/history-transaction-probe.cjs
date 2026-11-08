// TL25-R1 combined history regression (isolated host transaction; NOT a browser test).
// Run: node history-transaction-probe.cjs <checkout>
// Extracts the actual host function bodies from public/atlas/engine.js (same markers as the reviewer's
// tl25/reviewer-chapter-history.cjs) and calls the registered popstate callback. Rendering, storage and the
// timeline view are test doubles; the view double gates a selection by chapter and keeps lane order/collapse.
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const crypto = require('node:crypto');
const root = process.argv[2] || process.cwd();
const read = p => fs.readFileSync(path.join(root, p), 'utf8');
const engine = read('public/atlas/engine.js');
const timeline = read('public/atlas/timeline.js');
const blob = s => crypto.createHash('sha1').update('blob ' + Buffer.byteLength(s) + '\0').update(s).digest('hex');
console.log('engine blob ' + blob(engine) + ' / timeline blob ' + blob(timeline));
function between(a, b) {
  const start = engine.indexOf(a), end = engine.indexOf(b, start);
  assert.ok(start >= 0 && end > start, 'source markers exist: ' + a);
  return engine.slice(start, end);
}
const source = [
  between('let tlWasOpen=false,tlFromHistory=false;', '/* ===================== CHAPTER SELECTOR'),
  between('function chapterPosOf(', 'if(TLV)$("#tlBtn")'),
  between('function refreshAll(){', '/* the realm a world'),
  between('function urlFor(o){', 'function restoreFromURL(){'),
].join('\n');
// simulated gates: record-b from chapter 3, record-late from chapter 5 (fixture input, not canon)
const GATE = { 'record-a': 1, 'record-b': 3, 'record-late': 5 };
const LANES = ['x', 'y', 'z'];
function makeEnv(start) {
  const location = { pathname: '/atlas/', search: '', hash: '' };
  const writes = [], restores = [], listeners = {};
  const S = { book: 1, chapter: start.chapter, sel: null, site: null, realm: 'physical', view: 'galaxy' };
  const TLV = {
    open: !!start.open, sel: start.sel || null, order: (start.order || LANES).slice(), collapsed: new Set(start.collapsed || []),
    get laneParams() { const o = this.order.join(','); return { tl: o === LANES.join(',') ? '1' : o, tlc: [...this.collapsed].join(',') }; },
    refresh() { if (this.sel && (S.chapter == null || S.chapter < GATE[this.sel])) this.sel = null; },
    restore(hash) {
      restores.push(hash);
      const q = new URLSearchParams(hash.replace(/^#/, ''));
      const tl = q.get('tl');
      this.order = tl && tl !== '1' ? tl.split(',').filter(x => LANES.includes(x)) : LANES.slice();
      this.collapsed = new Set((q.get('tlc') || '').split(',').filter(Boolean));
      if (q.has('tl')) { this.open = true; const s = q.get('tlsel'); this.sel = s && GATE[s] && S.chapter != null && S.chapter >= GATE[s] ? s : null; }
    },
    close() { this.open = false; this.sel = null; },
  };
  const ctx = {
    window: {}, URLSearchParams, console, location, S, TLV,
    BOOKS: { 1: { title: 'Fixture', chapters: 6 } }, CUM: true, WORLD_BY: {}, LY: null, TRV: null,
    $: () => null, storeBook: () => {},
    addEventListener: (n, fn) => (listeners[n] = fn),
    history: { state: null, replaceState: (st, t, url) => { writes.push(url); location.hash = url.includes('#') ? '#' + url.split('#')[1] : ''; } },
  };
  for (const n of ['renderRealmBar', 'renderFilters', 'renderIndex', 'renderDossier', 'renderChron', 'renderCrumbs', 'renderLegend', 'applyBookToScene']) ctx[n] = () => {};
  vm.createContext(ctx);
  vm.runInContext(timeline, ctx);
  vm.runInContext(source + '\nurlReady=true;lastBook=S.book;', ctx);
  // the address bar starts as the normalized URL of the starting state
  location.hash = (ctx.urlFor ? vm.runInContext('urlFor()', ctx) : '').split('#')[1] ? '#' + vm.runInContext('urlFor()', ctx).split('#')[1] : '';
  return { ctx, location, writes, restores, pop(hash) { location.hash = hash; writes.length = 0; restores.length = 0; listeners.popstate(); } };
}
function state(e) { const T = e.ctx.TLV; return { chapter: e.ctx.S.chapter, open: T.open, sel: T.sel, order: T.order.join(','), collapsed: [...T.collapsed].join(','), hash: e.location.hash }; }
const cases = [
  // controls (unchanged chapter)
  { name: 'control: same chapter, open, restore selection', start: { chapter: 3, open: true }, hash: '#book=1&ch=3&tl=1&tlsel=record-b', want: { chapter: 3, open: true, sel: 'record-b', hash: '#book=1&ch=3&tl=1&tlsel=record-b' } },
  { name: 'control: same chapter, closed, open + select', start: { chapter: 3 }, hash: '#book=1&ch=3&tl=1&tlsel=record-b', want: { chapter: 3, open: true, sel: 'record-b', hash: '#book=1&ch=3&tl=1&tlsel=record-b' } },
  // reviewer's three failing cases
  { name: 'chapter change, open, restore selection', start: { chapter: 2, open: true }, hash: '#book=1&ch=3&tl=1&tlsel=record-b', want: { chapter: 3, open: true, sel: 'record-b', hash: '#book=1&ch=3&tl=1&tlsel=record-b' } },
  { name: 'chapter change, closed, open + select', start: { chapter: 2 }, hash: '#book=1&ch=3&tl=1&tlsel=record-b', want: { chapter: 3, open: true, sel: 'record-b', hash: '#book=1&ch=3&tl=1&tlsel=record-b' } },
  { name: 'chapter change closes timeline', start: { chapter: 2, open: true }, hash: '#book=1&ch=3', want: { chapter: 3, open: false, sel: null, hash: '#book=1&ch=3' } },
  // gating: chapter is applied before the selection
  { name: 'chapter change gates selection out (later record)', start: { chapter: 6, open: true, sel: 'record-late' }, hash: '#book=1&ch=3&tl=1&tlsel=record-late', want: { chapter: 3, open: true, sel: null, hash: '#book=1&ch=3&tl=1' } },
  { name: 'chapter raised admits selection gated at old chapter', start: { chapter: 2 }, hash: '#book=1&ch=5&tl=1&tlsel=record-late', want: { chapter: 5, open: true, sel: 'record-late', hash: '#book=1&ch=5&tl=1&tlsel=record-late' } },
  // lane order / collapse
  { name: 'chapter change + lane order/collapse restored', start: { chapter: 2, open: true }, hash: '#book=1&ch=4&tl=z%2Cx%2Cy&tlc=y&tlsel=record-b', want: { chapter: 4, open: true, sel: 'record-b', order: 'z,x,y', collapsed: 'y', hash: '#book=1&ch=4&tl=z%2Cx%2Cy&tlc=y&tlsel=record-b' } },
  { name: 'chapter change + default order replaces custom order', start: { chapter: 4, open: true, order: ['z', 'x', 'y'], collapsed: ['y'] }, hash: '#book=1&ch=2&tl=1', want: { chapter: 2, open: true, sel: null, order: 'x,y,z', collapsed: '', hash: '#book=1&ch=2&tl=1' } },
  // missing / invalid chapter → Not set (fail closed)
  { name: 'missing ch → Not set, selection gated out', start: { chapter: 4, open: true, sel: 'record-b' }, hash: '#book=1&tl=1&tlsel=record-b', want: { chapter: null, open: true, sel: null, hash: '#book=1&tl=1' } },
  { name: 'invalid ch → Not set, timeline closes', start: { chapter: 4, open: true }, hash: '#book=1&ch=99', want: { chapter: null, open: false, sel: null, hash: '#book=1' } },
];
let pass = 0, total = 0;
for (const c of cases) {
  const e = makeEnv(c.start); e.pop(c.hash);
  const got = state(e); const ok = Object.keys(c.want).every(k => got[k] === c.want[k]);
  total++; if (ok) pass++;
  console.log((ok ? 'PASS ' : 'FAIL ') + c.name + ' ' + JSON.stringify({ got, writes: e.writes.length, restores: e.restores.length }));
}
// Back/Forward traversal through a sequence of history entries on one page
{
  const e = makeEnv({ chapter: 2 });
  const seq = [
    ['#book=1&ch=2', { chapter: 2, open: false }],
    ['#book=1&ch=3&tl=1&tlsel=record-b', { chapter: 3, open: true, sel: 'record-b' }],
    ['#book=1&ch=5&tl=y%2Cz%2Cx&tlc=x&tlsel=record-late', { chapter: 5, open: true, sel: 'record-late', order: 'y,z,x', collapsed: 'x' }],
  ];
  const walk = [0, 1, 2, 1, 0, 1, 2]; // forward, forward, back, back, forward, forward
  let okAll = true;
  for (const i of walk) {
    const [h, w] = seq[i]; e.pop(h); const got = state(e);
    const ok = Object.keys(w).every(k => got[k] === w[k]) && got.hash === h;
    if (!ok) { okAll = false; console.log('  traversal step to entry ' + i + ' FAIL ' + JSON.stringify(got)); }
  }
  total++; if (okAll) pass++;
  console.log((okAll ? 'PASS ' : 'FAIL ') + 'Back/Forward traversal over 3 entries, 7 steps (each lands on its own URL, unchanged)');
}
console.log(pass + '/' + total + ' history transaction checks pass');
process.exitCode = pass === total ? 0 : 1;
