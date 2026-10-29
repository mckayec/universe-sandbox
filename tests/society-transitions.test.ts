import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import vm from 'node:vm';

// Book changes on the Society Atlas must not let navigation or effects from another book land late
// (Deep Worlds review DW02, PR36 R3-C2). The page is one plain script, so the functions under test are
// cut out of it and run in a sandbox with stubs; nothing is rendered.
const src = readFileSync(new URL('../public/atlas/society.js', import.meta.url), 'utf8');
const cut = (from: string, to: string) => {
  const a = src.indexOf(from);
  const b = src.indexOf(to, a);
  assert.ok(a >= 0 && b > a, `could not find ${from}`);
  return src.slice(a, b);
};
const eraBlock = cut('let navGen=0;', 'function evListMeta(');
const fadeBlock = cut('function fadeTo(', 'function goBody(');
const enterBlock = cut('function enterSite(', 'function leaveSite(');

function sandbox(extra: Record<string, unknown>) {
  const timers: Array<() => void> = [];
  const el = () => ({ textContent: '', hidden: false, style: {}, classList: { add() {}, remove() {} } });
  const ctx: Record<string, unknown> = {
    ERA: 6,
    bookFilter: 6,
    BOOKS: { 1: { n: 'I', title: 'Red Rising' }, 6: { n: 'VI', title: 'Light Bringer' } },
    EV: { late: { book: 6 }, early: { book: 1 } },
    mode: 'system',
    cur: null,
    curSite: null,
    curSiteKey: null,
    selPoi: null,
    selLm: null,
    selEvent: null,
    hoverSel: null,
    fxList: [] as unknown[],
    stopped: 0,
    loaded: null,
    POIS: {},
    SITES: {},
    fade: el(),
    dossier: el(),
    window: {},
    document: { getElementById: () => null, querySelectorAll: () => [], body: { classList: { remove() {} } } },
    $: () => el(),
    showBanner: { _t: 0 },
    clearTimeout() {},
    setTimeout(fn: () => void) {
      timers.push(fn);
      return timers.length;
    },
    hideTip() {},
    stopFx() {
      (ctx.stopped as number)++;
      ctx.fxList = [];
    },
    applyEraTextures() {},
    renderIndex() {},
    buildGlobe() {},
    buildPoiLabels() {},
    setModeLabels() {},
    buildSiteLabels() {},
    leaveSite() {},
    poiVisible: () => true,
    lmVisible: () => true,
    clearPoiLabels() {},
    loadSite(k: string) {
      ctx.loaded = k;
    },
    renderDossier() {},
    renderSiteHud() {},
    showNavHint() {},
    applyHL() {},
    renderCrumbs() {},
    resize() {},
    siteLms: () => [],
    sFly() {},
    byId: {},
    ...extra,
  };
  ctx.siteVisible = (k: string) => {
    const S = (ctx.SITES as Record<string, { from?: number }>)[k];
    return !!S && (S.from == null || (ctx.ERA as number) >= S.from);
  };
  vm.createContext(ctx);
  vm.runInContext(eraBlock + fadeBlock + enterBlock, ctx);
  return { ctx, timers };
}

test('a scene entry still fading in is dropped when the book changes to one that hides it', () => {
  const { ctx, timers } = sandbox({
    SITES: { asteroid: { name: 'Asteroid', body: 'asteroid', from: 6, landmarks: [] } },
  });
  vm.runInContext('enterSite("asteroid")', ctx);
  ctx.bookFilter = 1;
  vm.runInContext('setEra(1)', ctx);
  timers.shift()!(); // the fade's delayed commit
  assert.equal(ctx.loaded, null);
});

test('the commit step itself rechecks visibility even without a book-change counter', () => {
  const { ctx, timers } = sandbox({
    SITES: { asteroid: { name: 'Asteroid', body: 'asteroid', from: 6, landmarks: [] } },
  });
  vm.runInContext('enterSite("asteroid")', ctx);
  ctx.ERA = 1; // as if the era moved without going through setEra
  timers.shift()!();
  assert.equal(ctx.loaded, null);
});

test('a visible scene still opens when nothing changes', () => {
  const { ctx, timers } = sandbox({ SITES: { agea: { name: 'Agea', body: 'mars', landmarks: [] } } });
  vm.runInContext('enterSite("agea")', ctx);
  timers.shift()!();
  assert.equal(ctx.loaded, 'agea');
});

test('going back to an earlier book stops playing effects and clears a later event', () => {
  const { ctx } = sandbox({
    fxList: [{ name: 'ironrain' }],
    selEvent: 'late',
    mode: 'site',
    curSite: { landmarks: [] },
  });
  ctx.bookFilter = 1;
  vm.runInContext('setEra(1)', ctx);
  assert.equal(ctx.stopped, 1);
  assert.deepEqual(ctx.fxList, []);
  assert.equal(ctx.selEvent, null);
});

test('moving to a later book keeps a running effect', () => {
  const { ctx } = sandbox({ ERA: 1, bookFilter: 1, fxList: [{ name: 'passage' }], selEvent: 'early' });
  ctx.bookFilter = 6;
  vm.runInContext('setEra(6)', ctx);
  assert.equal(ctx.stopped, 0);
  assert.equal(ctx.selEvent, 'early');
});

test('set pieces switched on are switched off when going back a book', () => {
  const offs: string[] = [];
  const site = {
    landmarks: [],
    _tog: { duel: true, war: false },
    onToggle: (k: string, on: boolean) => !on && offs.push(k),
  };
  const { ctx } = sandbox({ mode: 'site', curSite: site });
  ctx.bookFilter = 1;
  vm.runInContext('setEra(1)', ctx);
  assert.deepEqual(offs, ['duel']);
  assert.equal(site._tog.duel, false);
});

test('the Europa Leviathan text keeps its Light Bringer clause behind Book VI (DW01)', () => {
  const era = cut('function eraVal(', 'function bodyF(');
  const lev = cut('const LEV_BASE=', 'let levLbl=null');
  const ctx: Record<string, unknown> = { ERA: 1 };
  vm.createContext(ctx);
  vm.runInContext(era + lev + ';globalThis.value=()=>eraVal(LEV_TEXT);', ctx);
  for (let k = 1; k <= 6; k++) {
    ctx.ERA = k;
    assert.equal((vm.runInContext('value()', ctx) as string).includes('In Light Bringer'), k === 6, `book ${k}`);
  }
});
