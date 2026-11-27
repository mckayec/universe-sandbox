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

const port = Number(process.env.PORT || 4187);
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

async function partS() {
  const phone = { width: 390, height: 844 };
  const land = { width: 844, height: 390 };
  for (const pack of ['lds-standard-works', 'sun-eater', 'expanse', 'hyperion']) {
    const { ctx, tab } = await open(pack, phone);
    if (pack === 'lds-standard-works') {
      await tab.waitForFunction(() => window.__atlas.S.view === 'world', null, { timeout: 300000 });
      await tab.waitForTimeout(4000);
      ok(!(await chromeState(tab)).sky, `${pack} 390x844 surface view: no Sky button`);
      await tab.getByRole('button', { name: 'Space', exact: true }).tap();
      await tab.waitForFunction(() => window.__atlas.S.view === 'galaxy', null, { timeout: 120000 });
      await tab.waitForTimeout(6000);
      // the state that left no sky in checkpoint 51: the sheet expanded by a real tap on its grab bar
      await tab.locator('#grab').tap();
      await tab.waitForTimeout(2500);
    } else await tab.waitForTimeout(8000);
    await skyOn(tab, `${pack} 390x844`, 250, `s52-sky-${pack}-390x844`);
    const t = await tabLabels(tab);
    ok(t.stops > 0 && t.bad === 0, `${pack} 390x844 Sky on: real Tab reaches ${t.stops} shown world names, none hidden`);
    await tab.locator('#skyBtn').tap();
    await tab.waitForTimeout(2000);
    const off = await chromeState(tab);
    ok(off.pressed === 'false' && off.panels.includes('#dossier'), `${pack} 390x844: Sky off restores the sheet`);
    // landscape phone: no open sky without Sky
    await tab.setViewportSize(land);
    await tab.waitForTimeout(5000);
    const g = await skyOn(tab, `${pack} 844x390`, 120, `s52-sky-${pack}-844x390`);
    // a real tap on a shown world name selects it and brings the panels back
    const target = g.labels.find(l => !l.region && l.shown);
    if (target) {
      await tab.touchscreen.tap((target.r[0] + target.r[2]) / 2, (target.r[1] + target.r[3]) / 2);
      await tab.waitForTimeout(2500);
      const c = await chromeState(tab);
      ok(
        c.pressed === 'false' && c.panels.includes('#dossier') && c.sel,
        `${pack} 844x390: tapping "${target.name}" selects ${c.sel} and turns Sky off`,
      );
    } else ok(false, `${pack} 844x390: a world name to tap`);
    await ctx.close();
  }
  const { ctx, tab } = await open('sun-eater', { width: 1440, height: 900 });
  await tab.waitForTimeout(3000);
  ok(!(await chromeState(tab)).sky, 'sun-eater 1440x900 desktop: no Sky button');
  await ctx.close();
}

try {
  await partS();
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
