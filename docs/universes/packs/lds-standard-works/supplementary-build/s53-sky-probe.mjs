// Checkpoint 53 probe: S51-C1 (Worlds leaves Sky and opens a visible list), S51-C2 (focus recovery when the focused Sky
// button is hidden by a resize or view change; unrelated focus left alone), repeated Sky/Worlds transitions by real
// taps and by Enter/Space, and the landscape-phone header control path (signposted overflow, arrow paging, every
// header control brought wholly on screen by touch and by Tab). Plumbing and helpers are the checkpoint 52 probe's:
// Checkpoint 52 probe: compact Sky view (S50-V1). Server/browser/error plumbing and the galaxy-label measurement are
// copied from s51-acceptance-probe.mjs (same chrome selectors the engine uses).
//   S. For LDS (reached by tapping its own Space button), Sun Eater, Expanse and Hyperion on an emulated phone:
//      the state that left no open sky (LDS with the sheet expanded; every pack rotated to 844x390) is measured, the
//      Sky button is pressed by a real tap, and the freed sky is checked: open area, world names shown inside it and
//      clear of the chrome and window edge, hidden names out of the Tab order, header back link / book gate / view
//      buttons / crumbs still visible, real Tab reaching shown world names, Sky off again restores the panels, a real
//      tap on a world name selects it and turns Sky off. Desktop 1440x900: no Sky button.
// Usage (repo root, after `pnpm build`): node docs/universes/packs/lds-standard-works/supplementary-build/s52-sky-probe.mjs
// Env: SHOTS=<dir>; CHROME_PATH optional; PORT (default 4187).
import { spawn } from 'node:child_process';
import { existsSync, mkdirSync } from 'node:fs';
import { chromium } from 'playwright';

const port = Number(process.env.PORT || 4188);
const origin = `http://127.0.0.1:${port}`;
const url = pack => `${origin}/atlas/?pack=${pack}`;
const shots = process.env.SHOTS;
if (shots) mkdirSync(shots, { recursive: true });
const server = spawn(
  process.execPath,
  ['node_modules/vite/bin/vite.js', 'preview', '--host', '127.0.0.1', '--port', String(port), '--strictPort'],
  { stdio: 'ignore' },
);
for (let i = 0; i < 300; i++) {
  try {
    if ((await fetch(url('lds-standard-works'))).ok) break;
  } catch {}
  await new Promise(r => setTimeout(r, 200));
}
const browser = await chromium.launch({
  headless: true,
  executablePath: process.env.CHROME_PATH && existsSync(process.env.CHROME_PATH) ? process.env.CHROME_PATH : undefined,
  args: ['--use-gl=swiftshader', '--enable-webgl', '--ignore-gpu-blocklist', '--enable-unsafe-swiftshader'],
});
console.log(`browser ${browser.version()}`);
const errors = [];
const t0 = Date.now();
const log = m => console.log(`[${((Date.now() - t0) / 1000).toFixed(0)}s] ${m}`);
let passed = 0;
const failed = [];
const ok = (c, m) => {
  if (c) {
    passed++;
    console.log(`  ok ${passed} ${m}`);
  } else {
    failed.push(m);
    console.log(`  FAIL ${m}`);
  }
};

async function open(pack, vp) {
  const mob = vp.width < 600 || vp.height < 520;
  const ctx = await browser.newContext({ viewport: vp, isMobile: mob, hasTouch: mob });
  const tab = await ctx.newPage();
  tab.setDefaultTimeout(240000);
  tab.on('requestfailed', r => errors.push(`requestfailed(${pack}): ${r.url()} ${r.failure()?.errorText}`));
  tab.on('response', r => {
    if (r.status() >= 400) errors.push(`http ${r.status()}(${pack}): ${r.url()}`);
  });
  tab.on('pageerror', e => errors.push(`pageerror(${pack}): ${e.message}`));
  tab.on('console', m => {
    if (m.type() === 'error' && !/GL Driver|GPU stall|software WebGL|Failed to load resource/i.test(m.text()))
      errors.push(`console(${pack}): ${m.text()}`);
  });
  const t = Date.now();
  await tab.goto(url(pack), { waitUntil: 'domcontentloaded' });
  await tab.locator('#app .top').waitFor({ state: 'visible', timeout: 300000 });
  await tab.waitForFunction(() => document.querySelector('#splash.out'), null, { timeout: 300000 });
  await tab.waitForFunction(() => window.__atlas && window.__atlas.WORLD_BY, null, { timeout: 300000 });
  log(`${pack} ${vp.width}x${vp.height} ready in ${((Date.now() - t) / 1000).toFixed(1)} s`);
  return { ctx, tab };
}

const focused = tab =>
  tab.evaluate(() => {
    const e = document.activeElement;
    if (!e || e === document.body) return { id: 'BODY' };
    const r = e.getBoundingClientRect();
    const cs = getComputedStyle(e);
    const ring =
      (cs.outlineStyle !== 'none' && parseFloat(cs.outlineWidth) > 0) || (cs.boxShadow && cs.boxShadow !== 'none');
    const ids = (window.__s52ids ||= new WeakMap());
    if (!ids.has(e)) ids.set(e, (ids.n = (ids.n || 0) + 1));
    const tag = `${e.tagName.toLowerCase()}${e.id ? '#' + e.id : ''}`;
    return {
      id: e.id ? tag : `${tag}(${ids.get(e)})`,
      label: (e.getAttribute('aria-label') || e.textContent || e.value || '').trim().slice(0, 40),
      visible: e.getClientRects().length > 0 && r.width > 0 && r.height > 0,
      onscreen: r.bottom > 0 && r.right > 0 && r.top < innerHeight && r.left < innerWidth,
      ring,
      hidden: !!e.closest("[hidden],[aria-hidden='true'],[inert]"),
      inCodex: !!e.closest('#codex'),
      name: !!(e.getAttribute('aria-label') || e.textContent.trim() || e.title || e.labels?.length),
    };
  });

// ---------- B. compact non-Earth galaxy views ----------
const galaxyLabels = tab =>
  tab.evaluate(() => {
    const sel = {
      top: ['header.top', '#crumbs', '#realms', '#filters'],
      mid: ['#index', '#skyBtn'],
      bottom: ['#dossier', '#chron'],
    };
    const W = innerWidth,
      H = innerHeight;
    const rect = s => {
      const el = document.querySelector(s);
      if (!el || el.hidden || !el.getClientRects().length) return null;
      const r = el.getBoundingClientRect();
      if (r.width < 1 || r.height < 1 || r.right <= 0 || r.left >= W || r.bottom <= 0 || r.top >= H) return null;
      return r;
    };
    let top = 0,
      bottom = H;
    sel.top.forEach(s => {
      const r = rect(s);
      if (r) top = Math.max(top, r.bottom);
    });
    sel.bottom.forEach(s => {
      const r = rect(s);
      if (r) bottom = Math.min(bottom, r.top);
    });
    const mids = sel.mid.map(rect).filter(Boolean);
    const out = [];
    document.querySelectorAll('#labels .lbl').forEach(e => {
      const op = parseFloat(getComputedStyle(e).opacity);
      const r = e.getBoundingClientRect();
      const shown = op > 0.05;
      const underChrome =
        r.top < top ||
        (bottom < H && r.bottom > bottom) ||
        mids.some(m => r.left < m.right && r.right > m.left && r.top < m.bottom && r.bottom > m.top);
      // the window edge is checked separately (s51 counted the bottom edge as chrome; decorative region names are
      // clipped by the label layer at the edge, so only real chrome overlap is checked for them)
      const offscreen = r.left < 0 || r.right > W || r.top < 0 || r.bottom > H;
      out.push({
        region: e.classList.contains('region'),
        name: e.textContent,
        shown,
        tab: e.tabIndex,
        ariaHidden: e.getAttribute('aria-hidden'),
        underChrome,
        offscreen,
        r: [Math.round(r.left), Math.round(r.top), Math.round(r.right), Math.round(r.bottom)],
      });
    });
    return {
      open: [Math.round(top), Math.round(bottom)],
      view: window.__atlas.S.view,
      overflow: document.documentElement.scrollWidth > innerWidth,
      labels: out,
    };
  });

async function checkGalaxy(tab, tag) {
  const g = await galaxyLabels(tab);
  // world labels are focusable buttons; region labels (arms, core, Magellanic Clouds) are decorative divs clipped by
  // the label layer, so for them only the chrome overlap is checked
  const worlds = g.labels.filter(l => !l.region);
  const shown = worlds.filter(l => l.shown);
  const under = shown.filter(l => l.underChrome);
  const off = shown.filter(l => l.offscreen);
  const tabHidden = worlds.filter(l => !l.shown && l.tab >= 0);
  const ariaWrong = worlds.filter(l => l.shown === (l.ariaHidden === 'true'));
  const regUnder = g.labels.filter(l => l.region && l.shown && l.underChrome && l.r[2] > 0 && l.r[0] < 4000 && l.r[3] > 0);
  console.log(
    `  ${tag}: view=${g.view} open area ${g.open[0]}–${g.open[1]} px; ${shown.length}/${worlds.length} world labels shown; ` +
      `under chrome: ${under.map(l => `${l.name}@${l.r}`).join(', ') || 'none'}; off-screen: ${off.map(l => `${l.name}@${l.r}`).join(', ') || 'none'}`,
  );
  ok(g.view === 'galaxy', `${tag}: in the galaxy/space view`);
  ok(!g.overflow, `${tag}: no horizontal page overflow`);
  // when the chrome leaves no open area (sheet expanded, or a landscape phone) every name is hidden by design
  const room = g.open[1] - g.open[0];
  ok(shown.length > 0 || room < 40, `${tag}: ${room < 40 ? `no open area (${room} px): names hidden, world still listed in the sheet` : 'at least one world label shown'}`);
  ok(under.length === 0, `${tag}: no shown world label overlaps the compact chrome`);
  ok(off.length === 0, `${tag}: no shown world label extends past the viewport edge`);
  ok(tabHidden.length === 0 && ariaWrong.length === 0, `${tag}: hidden labels are out of the Tab order and aria-hidden`);
  ok(regUnder.length === 0, `${tag}: no shown region label overlaps the compact chrome${regUnder.length ? ' (' + regUnder.map(l => `${l.name}@${l.r}`).join(', ') + ')' : ''}`);
  return g;
}


// ---------- S. compact Sky view ----------
const chromeState = tab =>
  tab.evaluate(() => {
    const vis = s => {
      const e = document.querySelector(s);
      if (!e || e.hidden) return false;
      const r = e.getBoundingClientRect();
      return getComputedStyle(e).display !== 'none' && r.width > 0 && r.height > 0 && r.bottom > 0 && r.top < innerHeight;
    };
    const sky = document.querySelector('#skyBtn');
    return {
      sky: !!sky && !sky.hidden && vis('#skyBtn'),
      pressed: sky?.getAttribute('aria-pressed'),
      back: vis('.top .gl-home'),
      books: [...document.querySelectorAll('.top .seg button')].filter(b => b.getClientRects().length).length,
      views: ['#galBtn', '#webBtn', '#cxBtn'].filter(vis).length,
      crumbs: vis('#crumbs'),
      panels: ['#filters', '#index', '#dossier', '#chron'].filter(vis),
      skyBox: sky && !sky.hidden ? [sky.getBoundingClientRect().left, sky.getBoundingClientRect().right].map(Math.round) : null,
      appScroll: document.getElementById('app').scrollLeft,
      viewBtns: ['#galBtn', '#webBtn', '#cxBtn'].map(s => Math.round(document.querySelector(s)?.getBoundingClientRect().right || 0)),
      sel: window.__atlas.S.sel,
      view: window.__atlas.S.view,
    };
  });

async function tabLabels(tab) {
  await tab.evaluate(() => document.activeElement?.blur());
  let stops = 0,
    bad = 0;
  for (let i = 0; i < 50; i++) {
    await tab.keyboard.press('Tab');
    const f = await tab.evaluate(() => {
      const e = document.activeElement;
      if (!e || !e.classList.contains('lbl')) return null;
      return { op: parseFloat(getComputedStyle(e).opacity), hidden: e.getAttribute('aria-hidden') };
    });
    if (f) {
      stops++;
      if (f.op <= 0.05 || f.hidden === 'true') bad++;
    }
  }
  return { stops, bad };
}

async function skyOn(tab, tag, minRoom, shotName) {
  const before = await galaxyLabels(tab);
  const shownBefore = before.labels.filter(l => !l.region && l.shown).length;
  console.log(`  ${tag} before Sky: open area ${before.open[0]}–${before.open[1]} px, ${shownBefore} world names shown`);
  const c0 = await chromeState(tab);
  ok(c0.sky && c0.pressed === 'false', `${tag}: Sky button visible and not pressed`);
  await tab.locator('#skyBtn').tap();
  await tab.waitForTimeout(3000);
  const c = await chromeState(tab);
  console.log(`  ${tag} Sky on: ${JSON.stringify(c)}`);
  ok(c.pressed === 'true', `${tag}: Sky button pressed (aria-pressed=true)`);
  ok(
    c.skyBox && c.skyBox[0] >= 0 && c.skyBox[1] <= (await tab.evaluate(() => innerWidth)) && c.appScroll === 0,
    `${tag}: Sky button wholly on screen (${c.skyBox}) and the page was not scrolled to reach it`,
  );
  ok(c.panels.length === 0, `${tag}: filter rows, worlds list, sheet and chronicle hidden`);
  ok(c.back && c.views >= 2 && c.crumbs, `${tag}: back link, view buttons and crumbs still visible`);
  ok(c.books === c0.books, `${tag}: book/reading buttons unchanged (${c.books})`);
  const g = await checkGalaxy(tab, `${tag} Sky on`);
  const room = g.open[1] - g.open[0];
  const shown = g.labels.filter(l => !l.region && l.shown).length;
  ok(room >= minRoom && shown > 0, `${tag}: Sky frees ${room} px of open sky (>= ${minRoom}) with ${shown} world names shown`);
  if (shots) await tab.screenshot({ path: `${shots}/${shotName}.png` });
  return g;
}


const st = tab =>
  tab.evaluate(() => {
    const vis = s => {
      const e = document.querySelector(s);
      if (!e || e.hidden || !e.getClientRects().length) return false;
      const cs = getComputedStyle(e);
      const r = e.getBoundingClientRect();
      return cs.display !== 'none' && cs.visibility !== 'hidden' && r.width > 0 && r.height > 0;
    };
    const idx = document.querySelector('#index');
    return {
      sky: document.querySelector('#app').classList.contains('sky'),
      pressed: document.querySelector('#skyBtn').getAttribute('aria-pressed'),
      skyShown: vis('#skyBtn'),
      expanded: document.querySelector('#idxBtn').getAttribute('aria-expanded'),
      indexVisible: vis('#index') && idx.classList.contains('open'),
      worldButtons: [...idx.querySelectorAll('.world')].filter(b => b.getClientRects().length).length,
      view: window.__atlas.S.view,
    };
  });

async function transitions(pack, tag) {
  if (!(await tab_.locator('#idxBtn').isVisible())) return transitionsPanel(tag);
  // repeated Sky -> Worlds -> close -> Sky by real taps
  for (let i = 1; i <= 2; i++) {
    await tab_.locator('#skyBtn').tap();
    await tab_.waitForTimeout(1200);
    const a = await st(tab_);
    ok(a.sky && a.pressed === 'true' && !a.indexVisible && a.expanded === 'false', `${tag} round ${i}: Sky on hides the list (expanded=false)`);
    await tab_.locator('#idxBtn').tap();
    await tab_.waitForTimeout(1200);
    const b = await st(tab_);
    console.log(`    ${tag} round ${i} after Worlds: ${JSON.stringify(b)}`);
    ok(!b.sky && b.pressed === 'false' && b.indexVisible && b.expanded === 'true' && b.worldButtons > 0,
      `${tag} round ${i}: Worlds exits Sky and opens a visible list of ${b.worldButtons} worlds (S51-C1)`);
    await tab_.locator('#idxBtn').tap();
    await tab_.waitForTimeout(800);
    const c = await st(tab_);
    ok(!c.indexVisible && c.expanded === 'false', `${tag} round ${i}: Worlds again closes the list`);
  }
  // list open, then Sky: list hidden and reported closed
  await tab_.locator('#idxBtn').tap();
  await tab_.waitForTimeout(800);
  await tab_.locator('#skyBtn').tap();
  await tab_.waitForTimeout(1200);
  const d = await st(tab_);
  ok(d.sky && !d.indexVisible && d.expanded === 'false', `${tag}: Sky over an open list hides it and reports it closed`);
  // keyboard: Enter on Worlds while Sky is on; Enter/Space on Sky
  await tab_.locator('#idxBtn').focus();
  await tab_.keyboard.press('Enter');
  await tab_.waitForTimeout(1200);
  const e = await st(tab_);
  ok(!e.sky && e.indexVisible && e.expanded === 'true', `${tag}: Enter on Worlds while Sky is on opens the visible list`);
  ok((await focused(tab_)).id === 'button#idxBtn', `${tag}: focus stays on Worlds`);
  await tab_.keyboard.press('Enter');
  await tab_.waitForTimeout(600);
  await tab_.locator('#skyBtn').focus();
  await tab_.keyboard.press('Enter');
  await tab_.waitForTimeout(1000);
  const f = await st(tab_);
  ok(f.sky && f.pressed === 'true', `${tag}: Enter on Sky turns it on`);
  await tab_.keyboard.press('Space');
  await tab_.waitForTimeout(1000);
  const g = await st(tab_);
  ok(!g.sky && g.pressed === 'false', `${tag}: Space on Sky turns it off`);
  ok((await focused(tab_)).id === 'button#skyBtn', `${tag}: focus stays on Sky through Enter/Space`);
}

// Landscape phones use the desktop header row, where the worlds list is a standing side panel and there is no Worlds
// toggle (#idxBtn is display:none): Sky hides the panel and Sky off brings it back.
async function transitionsPanel(tag) {
  const vis = () => tab_.evaluate(() => {
    const e = document.querySelector('#index');
    return !!e.getClientRects().length && getComputedStyle(e).display !== 'none';
  });
  ok(await vis(), `${tag}: no Worlds toggle in this layout; the worlds list is a visible side panel`);
  for (let i = 1; i <= 2; i++) {
    await tab_.locator('#skyBtn').tap();
    await tab_.waitForTimeout(1200);
    const a = await st(tab_);
    ok(a.sky && a.pressed === 'true' && !(await vis()), `${tag} round ${i}: Sky on hides the side list`);
    await tab_.locator('#skyBtn').tap();
    await tab_.waitForTimeout(1200);
    const b = await st(tab_);
    ok(!b.sky && b.pressed === 'false' && (await vis()) && b.worldButtons > 0, `${tag} round ${i}: Sky off restores the side list of ${b.worldButtons} worlds`);
  }
  await tab_.locator('#skyBtn').focus();
  await tab_.keyboard.press('Enter');
  await tab_.waitForTimeout(1000);
  ok((await st(tab_)).sky, `${tag}: Enter on Sky turns it on`);
  await tab_.keyboard.press('Space');
  await tab_.waitForTimeout(1000);
  ok(!(await st(tab_)).sky && (await vis()), `${tag}: Space on Sky turns it off and the list is back`);
  ok((await focused(tab_)).id === 'button#skyBtn', `${tag}: focus stays on Sky through Enter/Space`);
}

let tab_;
async function focusRecovery(tag, phone) {
  // resize to desktop with Sky focused (Sky on): the button is hidden, focus moves to a visible control
  await tab_.locator('#skyBtn').focus();
  await tab_.keyboard.press('Enter');
  await tab_.waitForTimeout(800);
  await tab_.setViewportSize({ width: 1280, height: 800 });
  await tab_.waitForTimeout(2500);
  const a = await focused(tab_);
  const s1 = await st(tab_);
  console.log(`    ${tag} resize to 1280x800 with Sky focused: focus ${JSON.stringify(a)}`);
  ok(!s1.skyShown && !s1.sky, `${tag}: at 1280x800 Sky is gone and off`);
  ok(a.id !== 'BODY' && a.id !== 'button#skyBtn' && a.visible && a.onscreen && !a.hidden && a.name,
    `${tag}: focus recovered to visible ${a.id} "${a.label}" after resize (S51-C2)`);
  // unrelated focus is left alone across the same change
  await tab_.setViewportSize(phone);
  await tab_.waitForTimeout(2500);
  await tab_.locator('#cxBtn').focus();
  await tab_.setViewportSize({ width: 1280, height: 800 });
  await tab_.waitForTimeout(2000);
  ok((await focused(tab_)).id === 'button#cxBtn', `${tag}: unrelated focus (Codex button) left alone by the resize`);
  await tab_.setViewportSize(phone);
  await tab_.waitForTimeout(2500);
  // view change with Sky focused: descend to a world with a surface
  const w = await tab_.evaluate(() => {
    const A = window.__atlas;
    const ws = Object.values(A.WORLD_BY).filter(x => x.gfx && !x.noSurface);
    return (ws[0] || {}).id;
  });
  await tab_.locator('#skyBtn').focus();
  await tab_.evaluate(id => window.__atlas.descend(id), w);
  await tab_.waitForFunction(() => window.__atlas.S.view === 'world', null, { timeout: 120000 });
  await tab_.waitForTimeout(2500);
  const b = await focused(tab_);
  console.log(`    ${tag} view change to ${w} with Sky focused: focus ${JSON.stringify(b)}`);
  ok(b.id !== 'BODY' && b.id !== 'button#skyBtn' && b.visible && b.onscreen && !b.hidden,
    `${tag}: focus recovered to visible ${b.id} "${b.label}" after the view change (S51-C2)`);
}

const hdr = tab =>
  tab.evaluate(() => {
    const c = document.querySelector('.top .controls');
    const cr = c.getBoundingClientRect();
    const btns = [...c.querySelectorAll('button')].filter(b => !b.hidden && b.getClientRects().length);
    const vis = s => {
      const e = document.querySelector(s);
      if (!e || !e.getClientRects().length || getComputedStyle(e).display === 'none') return null;
      const r = e.getBoundingClientRect();
      return [Math.round(r.left), Math.round(r.top), Math.round(r.right), Math.round(r.bottom)];
    };
    return {
      scrollW: c.scrollWidth,
      clientW: c.clientWidth,
      left: Math.round(c.scrollLeft),
      box: [Math.round(cr.left), Math.round(cr.right)],
      moreL: vis('#ctlMoreL'),
      moreR: vis('#ctlMoreR'),
      fadeR: c.classList.contains('more-r'),
      fadeL: c.classList.contains('more-l'),
      pageScroll: [scrollX, document.documentElement.scrollWidth > innerWidth],
      inView: btns
        .filter(b => {
          const r = b.getBoundingClientRect();
          return r.left >= Math.max(0, cr.left) - 0.5 && r.right <= Math.min(innerWidth, cr.right) + 0.5;
        })
        .map(b => b.id || b.textContent.trim()),
      all: btns.map(b => b.id || b.textContent.trim()),
    };
  });

async function landscapeHeader(tag) {
  const h0 = await hdr(tab_);
  console.log(`    ${tag} header: ${JSON.stringify(h0)}`);
  ok(h0.scrollW > h0.clientW, `${tag}: header controls overflow (${h0.scrollW} > ${h0.clientW} px)`);
  ok(h0.moreR && h0.moreR[2] <= 844 && h0.fadeR && !h0.moreL, `${tag}: right arrow on screen (${h0.moreR}) and the hidden side fades`);
  ok(!h0.pageScroll[1] && h0.pageScroll[0] === 0, `${tag}: no page-level horizontal scroll`);
  const seen = new Set(h0.inView);
  let h = h0;
  for (let i = 0; i < 8 && h.moreR; i++) {
    const [l, t, r, b] = h.moreR;
    await tab_.touchscreen.tap((l + r) / 2, (t + b) / 2);
    await tab_.waitForTimeout(900);
    h = await hdr(tab_);
    h.inView.forEach(x => seen.add(x));
  }
  console.log(`    ${tag} after arrow taps: ${JSON.stringify({ left: h.left, moreL: h.moreL, moreR: h.moreR })}`);
  const missing = h0.all.filter(x => !seen.has(x));
  ok(missing.length === 0, `${tag}: arrow taps bring all ${h0.all.length} header controls wholly on screen${missing.length ? ' (missing ' + missing + ')' : ''}`);
  ok(h.moreL && !h.moreR && h.fadeL, `${tag}: at the end, the left arrow shows and the right one is gone`);
  if (shots) await tab_.screenshot({ path: `${shots}/s53-header-end-${tag.replace(/\s+/g, '-')}.png` });
  // the revealed Codex button works by a real tap
  const cx = await tab_.locator('#cxBtn').boundingBox();
  if (cx && cx.x + cx.width <= 844) {
    await tab_.touchscreen.tap(cx.x + cx.width / 2, cx.y + cx.height / 2);
    await tab_.waitForTimeout(1500);
    ok(await tab_.evaluate(() => !document.querySelector('#codex').hidden), `${tag}: tapping the revealed Codex button opens the Codex`);
    await tab_.keyboard.press('Escape');
    await tab_.waitForTimeout(800);
  } else ok(false, `${tag}: Codex button on screen after paging`);
  // back with the left arrow
  for (let i = 0; i < 8 && h.moreL; i++) {
    const [l, t, r, b] = h.moreL;
    await tab_.touchscreen.tap((l + r) / 2, (t + b) / 2);
    await tab_.waitForTimeout(900);
    h = await hdr(tab_);
  }
  ok(h.left === 0 && h.moreR && !h.moreL, `${tag}: the left arrow pages back to the start`);
  // Tab through the header controls: each focused control is scrolled wholly into view
  // start just before the header controls: on the back link, the first header stop
  await tab_.locator('.gl-home').focus();
  const bad = [];
  let n = 0;
  for (let i = 0; i < 40; i++) {
    await tab_.keyboard.press('Tab');
    await tab_.waitForTimeout(500);
    const f = await tab_.evaluate(() => {
      const e = document.activeElement;
      const c = document.querySelector('.top .controls');
      if (!e || !c.contains(e)) return null;
      const r = e.getBoundingClientRect();
      const cr = c.getBoundingClientRect();
      return {
        id: e.id || e.textContent.trim(),
        ok: r.left >= Math.max(0, cr.left) - 1 && r.right <= Math.min(innerWidth, cr.right) + 1,
        at: [Math.round(r.left), Math.round(r.right), Math.round(cr.left), Math.round(cr.right), Math.round(c.scrollLeft)],
      };
    });
    if (!f) continue;
    n++;
    if (!f.ok) bad.push(f.id + ' ' + JSON.stringify(f.at));
  }
  ok(n >= h0.all.length && bad.length === 0, `${tag}: real Tab reaches ${n} header-control stops, each wholly on screen${bad.length ? ' (not: ' + bad + ')' : ''}`);
}

async function partT() {
  const phone = { width: 390, height: 844 };
  const land = { width: 844, height: 390 };
  for (const pack of ['sun-eater', 'lds-standard-works']) {
    const { ctx, tab } = await open(pack, phone);
    tab_ = tab;
    if (pack === 'lds-standard-works') {
      await tab.waitForFunction(() => window.__atlas.S.view === 'world', null, { timeout: 300000 });
      await tab.waitForTimeout(4000);
      await tab.getByRole('button', { name: 'Space', exact: true }).tap();
      await tab.waitForFunction(() => window.__atlas.S.view === 'galaxy', null, { timeout: 120000 });
      await tab.waitForTimeout(5000);
    } else await tab.waitForTimeout(6000);
    await transitions(pack, `${pack} 390x844`);
    await tab.setViewportSize(land);
    await tab.waitForTimeout(4000);
    await transitions(pack, `${pack} 844x390`);
    await landscapeHeader(`${pack} 844x390`);
    if (shots) {
      await tab.locator('#skyBtn').tap();
      await tab.waitForTimeout(1500);
      await tab.screenshot({ path: `${shots}/s53-sky-${pack}-844x390.png` });
      await tab.locator('#skyBtn').tap();
      await tab.waitForTimeout(1000);
    }
    await tab.setViewportSize(phone);
    await tab.waitForTimeout(3000);
    await focusRecovery(`${pack} 390x844`, phone);
    await ctx.close();
  }
}

try {
  await partT();
} catch (e) {
  failed.push(`exception: ${e.message}`);
  console.error(e);
} finally {
  ok(errors.length === 0, `zero console/request/page errors${errors.length ? ': ' + errors.join(' | ') : ''}`);
  console.log(failed.length ? `FAILED ${failed.length}: ${failed.join(' || ')}` : `PASS ${passed} checks`);
  log('done');
  process.exitCode = failed.length ? 1 : 0;
  await browser.close();
  server.kill();
}
