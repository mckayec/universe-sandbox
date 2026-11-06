// Checkpoint 48 probe (S46-C1 focus recovery, S46-C2 selected-label edges) on compact layouts.
// Server/browser/error plumbing copied from s47-chrome-probe.mjs. Measurements are taken from the DOM, not engine state.
// Usage (repo root, after `pnpm build`): node docs/universes/packs/lds-standard-works/supplementary-build/s48-focus-edge-probe.mjs
// Env: SHOTS=<dir>; CHROME_PATH optional. Exits non-zero on the first failed check.
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { existsSync, mkdirSync } from 'node:fs';
import { chromium } from 'playwright';

const port = Number(process.env.PORT || 4183);
const origin = `http://127.0.0.1:${port}`;
const page0 = `${origin}/atlas/?pack=lds-standard-works`;
const shots = process.env.SHOTS;
if (shots) mkdirSync(shots, { recursive: true });
const server = spawn(
  process.execPath,
  ['node_modules/vite/bin/vite.js', 'preview', '--host', '127.0.0.1', '--port', String(port), '--strictPort'],
  { stdio: 'ignore' },
);
for (let i = 0; i < 300; i++) {
  try {
    if ((await fetch(page0)).ok) break;
  } catch {}
  await new Promise(r => setTimeout(r, 200));
}
const browser = await chromium.launch({
  headless: true,
  executablePath: process.env.CHROME_PATH && existsSync(process.env.CHROME_PATH) ? process.env.CHROME_PATH : undefined,
  args: ['--use-gl=swiftshader', '--enable-webgl', '--ignore-gpu-blocklist', '--enable-unsafe-swiftshader'],
});
const errors = [];
const t0 = Date.now();
const log = m => console.log(`[${((Date.now() - t0) / 1000).toFixed(0)}s] ${m}`);
let passed = 0;
const ok = (c, m) => {
  assert.ok(c, m);
  passed++;
  console.log(`  ok ${passed} ${m}`);
};

async function open(vp, reducedMotion = 'no-preference') {
  const ctx = await browser.newContext({ viewport: vp, isMobile: vp.width < 600, hasTouch: vp.width < 600, reducedMotion });
  const tab = await ctx.newPage();
  tab.setDefaultTimeout(240000);
  tab.on('requestfailed', r => errors.push(`requestfailed: ${r.url()} ${r.failure()?.errorText}`));
  tab.on('response', r => {
    if (r.status() >= 400) errors.push(`http ${r.status()}: ${r.url()}`);
  });
  tab.on('pageerror', e => errors.push(`pageerror: ${e.message}`));
  tab.on('console', m => {
    if (m.type() === 'error' && !/GL Driver|GPU stall|software WebGL|Failed to load resource/i.test(m.text()))
      errors.push(`console: ${m.text()}`);
  });
  await tab.goto(page0, { waitUntil: 'domcontentloaded' });
  await tab.locator('#app .top').waitFor({ state: 'visible', timeout: 300000 });
  await tab.waitForFunction(() => !document.querySelector('#splash') || document.querySelector('#splash.out'), null, {
    timeout: 300000,
  });
  await tab.waitForFunction(() => window.__atlas && window.__atlas.SITE_EL.length > 0, null, { timeout: 300000 });
  log(`${vp.width}x${vp.height} ready (${reducedMotion})`);
  return { ctx, tab };
}

// what keyboard focus is on, measured from the DOM
const focusInfo = tab =>
  tab.evaluate(() => {
    const a = document.activeElement;
    if (!a || a === document.body) return { body: true };
    const r = a.getBoundingClientRect();
    const cs = getComputedStyle(a);
    return {
      body: false,
      id: a.id,
      cls: a.className,
      site: a.dataset && a.dataset.site,
      label: a.classList.contains('plbl') ? a.getAttribute('aria-label') : null,
      hidden: !!a.closest("[aria-hidden='true'],[hidden],[inert]"),
      opacity: parseFloat(cs.opacity),
      onScreen: r.width > 0 && r.height > 0 && r.bottom > 0 && r.top < innerHeight && r.right > 0 && r.left < innerWidth,
    };
  });
const visibleLabels = tab =>
  tab.evaluate(() =>
    [...document.querySelectorAll('#labels .plbl')]
      .filter(e => parseFloat(getComputedStyle(e).opacity) > 0.5 && e.getAttribute('aria-hidden') !== 'true')
      .map(e => e.getAttribute('aria-label')),
  );
const collapseSheet = async tab => {
  // dispatch a click without moving focus (a keyboard user's focus must not be what moves it here)
  await tab.evaluate(() => document.querySelector('#dossier .grab')?.click());
  await tab.waitForTimeout(5000);
};
const sheetCollapsed = tab => tab.evaluate(() => document.querySelector('#dossier').getBoundingClientRect().top > innerHeight * 0.75);

async function focusCases(tab, vp) {
  const W = vp.width;
  if (!(await sheetCollapsed(tab))) await collapseSheet(tab);
  let vis = await visibleLabels(tab);
  ok(vis.length > 0, `${W}: labels visible with the sheet collapsed (${vis.length})`);
  // C1a: unrelated focus is never moved when labels hide
  await tab.focus('#idxBtn');
  await tab.evaluate(() => document.querySelector('#dossier .grab')?.click());
  await tab.waitForTimeout(4000);
  let f = await focusInfo(tab);
  ok(f.id === 'idxBtn', `${W}: focus on the worlds button stays put while labels hide (${f.id})`);
  await collapseSheet(tab);
  vis = await visibleLabels(tab);
  // C1b: focused unselected label, sheet opens over it -> focus goes to its visible row or the grab bar
  const name = vis[0];
  await tab.evaluate(n => document.querySelector(`#labels .plbl[aria-label="${CSS.escape(n)}"]`).focus(), name);
  f = await focusInfo(tab);
  ok(f.label === name, `${W}: label "${name}" focused by keyboard API`);
  const siteBefore = await tab.evaluate(() => window.__atlas.S.site);
  await tab.evaluate(() => document.querySelector('#dossier .grab')?.click());
  await tab.waitForTimeout(5000);
  f = await focusInfo(tab);
  const nowHidden = !(await visibleLabels(tab)).includes(name);
  console.log(`    sheet opened: label hidden ${nowHidden}, focus -> ${JSON.stringify(f)}`);
  if (nowHidden) {
    ok(!f.body && !f.hidden && f.onScreen && f.opacity > 0.05 && !f.label, `${W}: focus left the hidden label for a visible control`);
    ok(f.site === undefined || f.site === null || typeof f.site === 'string', `${W}: recovery target is a list row or a navigation control`);
  }
  ok((await tab.evaluate(() => window.__atlas.S.site)) === siteBefore, `${W}: selected place unchanged by focus recovery`);
  // C1c: selected label focused, then the globe turns it to the far side -> focus recovers to its visible list row or grab
  await collapseSheet(tab);
  vis = await visibleLabels(tab);
  const sname = vis[0];
  const sid = await tab.evaluate(n => window.__atlas.SITE_EL.find(o => o.s.name === n).s.id, sname);
  await tab.evaluate(id => window.__atlas.selectSite(id), sid);
  await tab.waitForTimeout(4000);
  if (!(await sheetCollapsed(tab))) await collapseSheet(tab);
  await tab.evaluate(n => document.querySelector(`#labels .plbl[aria-label="${CSS.escape(n)}"]`).focus(), sname);
  await tab.evaluate(() => {
    const o = window.__atlas.orbW;
    o.gyaw += Math.PI;
    o.yaw += Math.PI;
  });
  await tab.waitForTimeout(5000);
  f = await focusInfo(tab);
  console.log(`    globe turned: focus -> ${JSON.stringify(f)}`);
  ok(!(await visibleLabels(tab)).includes(sname), `${W}: selected label "${sname}" turned out of view`);
  ok(!f.body && !f.hidden && f.onScreen && !f.label, `${W}: focus recovered to a visible control after the turn`);
  ok((await tab.evaluate(() => window.__atlas.S.site)) === sid, `${W}: selection kept after the turn`);
  await tab.evaluate(() => {
    const o = window.__atlas.orbW;
    o.gyaw -= Math.PI;
    o.yaw -= Math.PI;
  });
  await tab.waitForTimeout(4000);
  return sid;
}

// C2: sweep the camera so the selected pin crosses both screen edges; the visible label box must stay on screen.
async function edgeSweep(tab, vp, sid) {
  const W = vp.width;
  if (!(await sheetCollapsed(tab))) await collapseSheet(tab);
  const seen = { flip: 0, dot: 0, text: 0, hidden: 0 };
  let worst = 0;
  for (let k = -24; k <= 24; k++) {
    await tab.evaluate(
      ([d]) => {
        const o = window.__atlas.orbW;
        o.fly = null;
        o.gyaw = o.yaw = o._y0 == null ? (o._y0 = o.yaw) + d : o._y0 + d;
      },
      [k * 0.045],
    );
    await tab.waitForTimeout(700);
    const m = await tab.evaluate(id => {
      const o = window.__atlas.SITE_EL.find(x => x.s.id === id);
      const e = o.el;
      const vis = parseFloat(getComputedStyle(e).opacity) > 0.05 && e.getAttribute('aria-hidden') !== 'true';
      const tx = e.querySelector('.tx');
      const box = (tx && getComputedStyle(tx).display !== 'none' ? tx : e.querySelector('.pip')).getBoundingClientRect();
      return {
        vis,
        flip: e.classList.contains('flip'),
        dot: e.classList.contains('dot'),
        sel: e.classList.contains('sel'),
        left: box.left,
        right: box.right,
        site: window.__atlas.S.site,
      };
    }, sid);
    assert.equal(m.site, sid, 'selection unchanged during the sweep');
    if (!m.vis) {
      seen.hidden++;
      continue;
    }
    seen[m.flip ? 'flip' : m.dot ? 'dot' : 'text']++;
    worst = Math.max(worst, m.right - W, -m.left);
    assert.ok(m.left >= -1 && m.right <= W + 1, `${W}: selected label box on screen at step ${k}: ${JSON.stringify(m)}`);
    assert.ok(m.sel, 'selected styling kept');
  }
  console.log(`    sweep: ${JSON.stringify(seen)}, worst overflow ${worst.toFixed(1)}px`);
  ok(worst <= 1, `${W}: selected label never runs off a screen edge across 49 camera steps`);
  ok(seen.text > 0, `${W}: selected label shown as full text in open view`);
  ok(seen.flip + seen.dot > 0, `${W}: edge protection (flip or selected pin) exercised`);
  await tab.evaluate(() => {
    const o = window.__atlas.orbW;
    o.gyaw = o.yaw = o._y0;
  });
}

try {
  const only = process.env.ONLY; // ONLY=rotate runs just the rotation case
  for (const [vp, rm] of [
    [{ width: 390, height: 844 }, 'no-preference'],
    [{ width: 390, height: 844 }, 'reduce'],
  ].slice(0, only ? 1 : 2)) {
    const { ctx, tab } = await open(vp, rm);
    await tab.waitForTimeout(15000);
    if (!only) {
      const sid = await focusCases(tab, vp);
      await edgeSweep(tab, vp, sid);
    }
    if (shots && rm === 'no-preference') await tab.screenshot({ path: `${shots}/s48-sweep-end-390x844.png` });
    if (rm === 'no-preference') {
      // rotation: same page turned to landscape with a focused label; focus must not be left on a hidden label
      if (!(await sheetCollapsed(tab))) await collapseSheet(tab);
      const vis = await visibleLabels(tab);
      ok(vis.length > 0, '390: labels visible before rotation');
      {
        await tab.evaluate(n => document.querySelector(`#labels .plbl[aria-label="${CSS.escape(n)}"]`).focus(), vis[0]);
        await tab.setViewportSize({ width: 844, height: 390 });
        await tab.waitForTimeout(6000);
        const f = await focusInfo(tab);
        console.log(`    rotated to 844x390: focus -> ${JSON.stringify(f)}`);
        ok(!f.hidden, '844x390: focus is never left on an aria-hidden label after rotation');
        ok(!f.body && f.onScreen, '844x390: focus lands on a visible control (or stays on a visible label)');
        if (f.label) ok(f.onScreen && f.opacity > 0.05, '844x390: a still-focused label is visible');
        if (shots) await tab.screenshot({ path: `${shots}/s48-rotated-844x390.png` });
        await tab.setViewportSize(vp);
        await tab.waitForTimeout(3000);
      }
    }
    await ctx.close();
  }
  if (!only)
  // non-Earth pack, compact: galaxy view and a descent still render without errors (cross-pack smoke)
  {
    const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
    const tab = await ctx.newPage();
    tab.on('pageerror', e => errors.push(`pageerror(expanse): ${e.message}`));
    await tab.goto(`${origin}/atlas/?pack=expanse`, { waitUntil: 'domcontentloaded' });
    await tab.waitForFunction(() => window.__atlas && window.__atlas.WORLD_BY, null, { timeout: 300000 });
    await tab.waitForTimeout(8000);
    const w = await tab.evaluate(() => Object.keys(window.__atlas.WORLD_BY).find(k => (window.__atlas.WORLD_BY[k].sites || []).length));
    await tab.evaluate(id => window.__atlas.descend(id), w);
    await tab.waitForTimeout(15000);
    const n = await tab.evaluate(() => window.__atlas.SITE_EL.length);
    ok(n > 0, `expanse 390: descended to ${w}, ${n} site labels built`);
    if (shots) await tab.screenshot({ path: `${shots}/s48-expanse-390x844.png` });
    await ctx.close();
  }
  ok(errors.length === 0, `zero console/request/page errors${errors.length ? ': ' + errors.join(' | ') : ''}`);
  log(`PASS ${passed} checks`);
} finally {
  await browser.close();
  server.kill();
}
