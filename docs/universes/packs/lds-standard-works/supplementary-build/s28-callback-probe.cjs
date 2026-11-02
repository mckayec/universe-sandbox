// Checkpoint 28 callback probe: the reviewer's S27 isolated-function method (supplementary-review-s27/callback-probe.cjs,
// PR34 at 3c0fe71) run against the working tree, with case 8 expecting the restored Codex button and extra cases for
// repeated reopen/close and competing event navigations. No browser, DOM or server.
// Usage (repo root): node docs/universes/packs/lds-standard-works/supplementary-build/s28-callback-probe.cjs [git-rev]
const cp = require('node:child_process'),
  fs = require('node:fs'),
  vm = require('node:vm'),
  assert = require('node:assert/strict');
const rev = process.argv[2];
const en = rev
  ? cp.execFileSync('git', ['show', rev + ':public/atlas/engine.js'], { encoding: 'utf8' })
  : fs.readFileSync('public/atlas/engine.js', 'utf8');
const start = en.indexOf('function cxGoEvent(id)'),
  end = en.indexOf('\n$("#cxBody").addEventListener', start);
const openStart = en.indexOf('function openCodex()'),
  openEnd = en.indexOf('\n$("#cxBtn").addEventListener', openStart);
function scenario(name, mutate, want) {
  const queue = [],
    modal = { hidden: false },
    state = { ev: null };
  let focus = 'source',
    reach = 'ok',
    exists = true;
  const ctx = {
    S: state,
    EV_BY: { e: { id: 'e' }, f: { id: 'f' } },
    evReach: () => reach,
    renderCodex: () => {},
    $: s => (s === '#codex' ? modal : { focus: () => (focus = s) }),
    // the real openEvent starts with cancelEvFocus(); mirror that so competing navigations are modelled faithfully
    openEvent: id => {
      vm.runInContext('cancelEvFocus()', ctx);
      state.ev = id;
    },
    dos: { querySelector: q => (exists ? { focus: () => (focus = 'event:' + q.match(/"(.+)"/)[1]) } : null) },
    setTimeout: f => queue.push(f),
  };
  vm.createContext(ctx);
  vm.runInContext(en.slice(start, end) + '\n' + en.slice(openStart, openEnd), ctx);
  vm.runInContext('cxGoEvent("e")', ctx);
  mutate({ ctx, state, setReach: r => (reach = r), setExists: r => (exists = r), run: c => vm.runInContext(c, ctx) });
  queue.forEach(f => f());
  assert.equal(focus, want, name);
  return { name, observedFocus: focus };
}
const cases = [
  scenario('normal event activation', () => {}, 'event:e'),
  scenario('codex reopened', ({ run }) => run('openCodex()'), '#cxClose'),
  scenario('event replaced', ({ state }) => (state.ev = 'other'), 'source'),
  scenario('event cleared', ({ state }) => (state.ev = null), 'source'),
  scenario('layer or year filters reject target', ({ setReach }) => setReach('filtered'), 'source'),
  scenario('work gate locks target', ({ setReach }) => setReach('locked'), 'source'),
  scenario('target removed', ({ setExists }) => setExists(false), 'source'),
  scenario('reopen then close keeps the restored Codex button', ({ run }) => run('openCodex();closeCodex()'), '#cxBtn'),
  scenario('reopen/close three times', ({ run }) => run('for(let i=0;i<3;i++){openCodex();closeCodex();}'), '#cxBtn'),
  scenario('navigation (cancelEvFocus) with state unchanged', ({ run }) => run('cancelEvFocus()'), 'source'),
  // a second event link before the first callback runs: only the newest activation may focus
  scenario('competing event link e then f', ({ run }) => run('cxGoEvent("f")'), 'event:f'),
  scenario('competing e, f, then back to e', ({ run }) => run('cxGoEvent("f");cxGoEvent("e")'), 'event:e'),
  scenario('competing link then reopen/close', ({ run }) => run('cxGoEvent("f");openCodex();closeCodex()'), '#cxBtn'),
];
console.log(JSON.stringify({ rev: rev || 'working tree', cases, passed: cases.length, browserExecuted: false }, null, 2));
