/* EL-PORT-R1 (ChatGPT implementation-review-bfaab6b.md): travelling to the world-only event e4 while a place on
   Sel's surface is selected must end at Sel — no selected place, a Sel-ending breadcrumb and no place in the URL —
   and no older pending place callback may restore a stale place afterwards. Runs the ACTUAL engine openEvent,
   laterSite (with its NAVG/RGEN guards), selectSite and renderCrumbs over the real Cosmere pack, with inert
   DOM/scene stubs and a manual timer queue. Pinned e2/e5 travel and non-travel dossier clicks are controls. */
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

const packSrc = fs.readFileSync(new URL('../public/atlas/packs/cosmere.js', import.meta.url), 'utf8');
const engine = fs.readFileSync(new URL('../public/atlas/engine.js', import.meta.url), 'utf8');

const cut = (a: string, b: string) => {
  const i = engine.indexOf(a);
  assert.ok(i >= 0, 'marker not found: ' + a);
  const j = engine.indexOf(b, i);
  assert.ok(j > i, 'end marker not found: ' + b);
  return engine.slice(i, j);
};
const pw: any = {};
vm.runInNewContext(packSrc, { window: pw });
const pack = JSON.parse(JSON.stringify(pw.ATLAS_PACKS.cosmere));
const WORLD_BY = Object.fromEntries(pack.worlds.map((w: any) => [w.id, w]));
const EV_BY = Object.fromEntries(pack.events.map((e: any) => [e.id, e]));

const harness = (start: { view: string; sel: string | null; site: string | null }) => {
  const timers: { f: () => void; ms: number }[] = [];
  const log: string[] = [];
  const crumbs = { innerHTML: '' };
  const t: any = {
    S: { ...start, ev: null },
    RGEN: 0,
    RREG: true,
    RL: null,
    MOB: false,
    PL: null,
    SITE_EL: [],
    EV_BY,
    WORLD_BY,
    UI: { galaxyCrumb: 'Galaxy', homeCrumb: 'Home' },
    RD_PH: { group: '?', world: '?', place: '?' },
    url: [] as (string | null)[],
    $: (q: string) => (q === '#crumbs' ? crumbs : null),
    esc: (x: string) => String(x),
    groupOpt: () => null,
    GROUP_NAME: () => '',
    wName: (w: any) => w.name,
    siteName: (w: any, id: string) => ((w.sites || []).find((x: any) => x.id === id) || {}).name || '',
    rdSiteHidden: (id: string) => {
      const w = WORLD_BY[t.S.sel];
      return !!id && !(w && (w.sites || []).some((x: any) => x.id === id));
    },
    syncURL: () => t.url.push(t.S.site),
    noSurface: () => false,
    setTimeout: (f: () => void, ms: number) => timers.push({ f, ms }),
    descend: (id: string) => {
      log.push('descend:' + id);
      t.S.view = 'world';
      t.S.sel = id;
      t.S.site = null;
    },
    ascend: () => log.push('ascend'),
    selectWorld: () => log.push('world'),
    orbG: { flyTo: () => log.push('fly'), gyaw: 0 },
    flyDistFor: () => 1,
    FLY_PITCH: 0,
    refreshAll: () => t.renderCrumbs(),
    renderDossier: () => {},
    renderChron: () => {},
    dos: { querySelector: () => null },
  };
  vm.createContext(t);
  vm.runInContext(cut('var NAVG=0;', 'function rdNotRevealed'), t);
  vm.runInContext(cut('function selectSite(id)', '\n  if(id&&PL)') + '}', t);
  vm.runInContext(cut('function renderCrumbs()', '\n$("#crumbs")'), t);
  vm.runInContext(cut('function openEvent(id,travel)', '\n  const it=dos') + '\n}', t);
  const flush = () => {
    while (timers.length) timers.shift()!.f();
  };
  /* breadcrumb tail: text of the last element marked "here" */
  const here = () => {
    const m = [...crumbs.innerHTML.matchAll(/class="here"[^>]*>([^<]*)</g)];
    return m.length ? m[m.length - 1][1] : '';
  };
  return { t, flush, here, log, timers, crumbs };
};
const selName = WORLD_BY.sel.name;
const siteNm = (id: string) => WORLD_BY.sel.sites.find((s: any) => s.id === id).name;

test('EL-PORT-R1 pack preconditions: e4 world-only on Sel; e2/e5 keep pins; chasm and kae exist', () => {
  assert.equal(EV_BY.e4.world, 'sel');
  assert.equal(EV_BY.e4.site, undefined);
  assert.equal(EV_BY.e2.site, 'kae');
  assert.equal(EV_BY.e5.site, 'elantris');
  for (const id of ['chasm', 'kae', 'elantris']) assert.ok(siteNm(id), id + ' exists');
});

test('EL-PORT-R1 Sel surface: e4 travel from null/chasm/kae ends at Sel with no place, crumb or URL place', () => {
  for (const site of [null, 'chasm', 'kae']) {
    const h = harness({ view: 'world', sel: 'sel', site });
    vm.runInContext('openEvent("e4",true)', h.t);
    h.flush();
    assert.equal(h.t.S.site, null, `${site}: no selected place`);
    assert.equal(h.t.S.ev, 'e4', `${site}: e4 open`);
    assert.equal(h.here(), selName, `${site}: breadcrumb ends at Sel`);
    assert.ok(!h.crumbs.innerHTML.includes(siteNm('chasm')) && !h.crumbs.innerHTML.includes(siteNm('kae')));
    if (site) assert.equal(h.t.url.at(-1), null, `${site}: URL place cleared`);
    else assert.equal(h.t.url.length, 0, 'null baseline: no extra selection');
    assert.equal(h.log.length, 0, `${site}: no descend/ascend/fly on same-world travel`);
  }
});

test('EL-PORT-R1 controls: pinned e2/e5 travel still selects their place; non-travel click keeps the place', () => {
  for (const [ev, want] of [
    ['e2', 'kae'],
    ['e5', 'elantris'],
  ]) {
    const h = harness({ view: 'world', sel: 'sel', site: 'chasm' });
    vm.runInContext(`openEvent("${ev}",true)`, h.t);
    h.flush();
    assert.equal(h.t.S.site, want, ev + ' same-world travel');
    assert.equal(h.here(), siteNm(want), ev + ' crumb');
    const g = harness({ view: 'world', sel: 'roshar', site: null });
    vm.runInContext(`openEvent("${ev}",true)`, g.t);
    assert.equal(g.timers.length, 1, ev + ' cross-world schedules one place');
    g.flush();
    assert.equal(g.t.S.site, want, ev + ' cross-world travel');
  }
  const n = harness({ view: 'world', sel: 'sel', site: 'chasm' });
  vm.runInContext('openEvent("e4",false)', n.t);
  n.flush();
  assert.equal(n.t.S.site, 'chasm', 'non-travel dossier expansion leaves the place alone');
  assert.equal(n.here(), siteNm('chasm'));
});

test('EL-PORT-R1 other entry points: from another surface and from galaxy view, e4 travel selects no place', () => {
  const a = harness({ view: 'world', sel: 'roshar', site: null });
  vm.runInContext('openEvent("e4",true)', a.t);
  a.flush();
  assert.deepEqual(a.log, ['descend:sel']);
  assert.equal(a.t.S.site, null);
  assert.equal(a.here(), selName);
  const g = harness({ view: 'galaxy', sel: null, site: null });
  vm.runInContext('openEvent("e4",true)', g.t);
  g.flush();
  assert.deepEqual(g.log, ['fly']);
  assert.equal(g.t.S.site, null);
  assert.equal(g.t.S.sel, 'sel');
});

test('EL-PORT-R1 pending callbacks: an older queued place never restores a stale selection after e4 travel', () => {
  /* control: e2 travel from another world queues kae and it lands */
  const c = harness({ view: 'world', sel: 'roshar', site: null });
  vm.runInContext('openEvent("e2",true)', c.t);
  c.flush();
  assert.equal(c.t.S.site, 'kae', 'control: pending e2 place lands');
  /* e2 travel queued, then e4 travel before the callback fires */
  const h = harness({ view: 'world', sel: 'roshar', site: null });
  vm.runInContext('openEvent("e2",true)', h.t);
  assert.equal(h.timers.length, 1);
  vm.runInContext('openEvent("e4",true)', h.t);
  h.flush();
  assert.equal(h.t.S.site, null, 'stale kae dropped');
  assert.equal(h.here(), selName);
  /* a tour/deep-link style laterSite pending, then e4 travel */
  const k = harness({ view: 'world', sel: 'sel', site: null });
  vm.runInContext('laterSite("chasm",1200)', k.t);
  vm.runInContext('openEvent("e4",true)', k.t);
  k.flush();
  assert.equal(k.t.S.site, null, 'stale tour place dropped');
  /* reading-generation guard preserved */
  const r = harness({ view: 'world', sel: 'sel', site: null });
  vm.runInContext('laterSite("chasm",900);RGEN++;', r.t);
  r.flush();
  assert.equal(r.t.S.site, null, 'RGEN change still drops a pending place');
  /* a newer laterSite supersedes an older one */
  const s = harness({ view: 'world', sel: 'sel', site: null });
  vm.runInContext('laterSite("chasm",900);laterSite("kae",900);', s.t);
  s.flush();
  assert.equal(s.t.S.site, 'kae', 'only the newest pending place lands');
});
