// SC7-O1 rendered evidence: with a black hole selected, the tools collapsed and the selected-object sheet EXPANDED,
// every dock control is reachable and operable by pointer and keyboard, and the dock's action row (Pause/Resume,
// Clear all, Show tools; followed by the three interaction modes) keeps a reserved strip that the sheet never covers. 667x375 is checked at normal and
// "200% text" (every element inside the dock gets twice its computed font-size, a text-only resize; not browser
// zoom); 844x390, 390x844 and 1440x900 at normal text. Enforced: exits 1 on any failed check.
// Usage (from a checkout of the PR head after `pnpm build`):
//   [CHROME_PATH=...] node docs/reviews/simulator-clarity/evidence-harness-7d.mjs [outDir]
import { spawn } from 'node:child_process';
import { mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { chromium } from 'playwright';

const outDir = process.argv[2] || mkdtempSync(join(tmpdir(), 'sc7d-'));
const port = 4195;
const base = `http://127.0.0.1:${port}`;
const server = spawn(
  process.execPath,
  ['node_modules/vite/bin/vite.js', 'preview', '--host', '127.0.0.1', '--port', String(port)],
  { stdio: ['pipe', 'pipe', 'pipe'] },
);
server.stdout.resume();
server.stderr.resume();
const sleep = ms => new Promise(r => setTimeout(r, ms));
let failed = 0;
const check = (tag, name, pass, detail) => {
  if (!pass) failed++;
  console.log(JSON.stringify({ tag, check: name, pass, detail }));
};
async function waitForServer() {
  for (let i = 0; i < 300; i++) {
    try {
      if ((await fetch(base)).ok) return;
    } catch {}
    await sleep(200);
  }
  throw new Error('preview server not ready');
}
const ROW = ['panel-toggle', 'pause', 'clear'];
const MODES = ['add-mode', 'inspect-mode', 'navigate-mode'];
const SHEET = ['info-expand', 'info-close', 'bh-reference', 'lock', 'build-lock'];
const probe = page => page.evaluate(() => window.__sandboxProbe());

/** Geometry of each control against the viewport and every clipping ancestor; hit-tests its centre and 4 points
 *  inset 3 px from its corners (topmost element must be the control or inside it). */
function geometry(page, ids) {
  return page.evaluate(ids => {
    const out = {};
    for (const id of ids) {
      const el = document.getElementById(id);
      if (!el || !el.getClientRects().length) {
        out[id] = { rendered: false };
        continue;
      }
      const r = el.getBoundingClientRect();
      let clip = { top: 0, bottom: innerHeight, left: 0, right: innerWidth };
      for (let p = el.parentElement; p; p = p.parentElement) {
        const cs = getComputedStyle(p);
        if (/(auto|scroll|hidden)/.test(cs.overflowY + cs.overflowX)) {
          const pr = p.getBoundingClientRect();
          clip = {
            top: Math.max(clip.top, pr.top),
            bottom: Math.min(clip.bottom, pr.bottom),
            left: Math.max(clip.left, pr.left),
            right: Math.min(clip.right, pr.right),
          };
        }
      }
      const pts = [
        [(r.left + r.right) / 2, (r.top + r.bottom) / 2],
        [r.left + 3, r.top + 3],
        [r.right - 3, r.top + 3],
        [r.left + 3, r.bottom - 3],
        [r.right - 3, r.bottom - 3],
      ];
      const hits = pts.map(([x, y]) => {
        const h = document.elementFromPoint(x, y);
        return !!h && (h === el || el.contains(h));
      });
      out[id] = {
        rendered: true,
        rect: [r.left, r.top, r.right, r.bottom].map(v => Math.round(v)),
        clip: [clip.left, clip.top, clip.right, clip.bottom].map(v => Math.round(v)),
        fullyVisible:
          r.height > 0 &&
          r.top >= clip.top - 0.5 &&
          r.bottom <= clip.bottom + 0.5 &&
          r.left >= clip.left - 0.5 &&
          r.right <= clip.right + 0.5,
        unobstructed: hits.every(Boolean),
        hits,
        font: getComputedStyle(el).fontSize,
      };
    }
    return out;
  }, ids);
}
const allOk = (g, ids) => ids.every(id => g[id].rendered && g[id].fullyVisible && g[id].unobstructed);

/** 200% text: every element inside the dock gets twice its computed font-size (inline). */
async function doubleText(page) {
  return page.evaluate(() => {
    const els = [document.querySelector('.dock'), ...document.querySelectorAll('.dock *')];
    const sizes = els.map(el => parseFloat(getComputedStyle(el).fontSize));
    els.forEach((el, i) => (el.style.fontSize = sizes[i] * 2 + 'px'));
    return els.length;
  });
}

async function setup(browser, viewport, text2x) {
  const page = await browser.newPage({ viewport });
  page.setDefaultTimeout(15000);
  const errors = [];
  page.on('pageerror', e => errors.push(e.message));
  page.on('console', m => m.type() === 'error' && errors.push(m.text()));
  await page.goto(`${base}/?probe=1`, { waitUntil: 'networkidle' });
  await page.waitForFunction(() => Number(document.querySelector('#count')?.textContent) > 0);
  const t = page.locator('#panel-toggle');
  const compact = await t.isVisible();
  if (compact && (await t.getAttribute('aria-expanded')) !== 'true') await t.click();
  await page.locator('#clear').click();
  await page.locator('[data-choice="blackhole"]').click();
  if (compact) await t.click(); // collapse the tools
  await page.mouse.click(viewport.width * 0.42, viewport.height * 0.4);
  await sleep(700);
  const ex = page.locator('#info-expand');
  if (await ex.isVisible()) {
    await ex.focus();
    await page.keyboard.press('Enter');
    await sleep(300);
  }
  if (text2x) {
    await doubleText(page);
    await sleep(400);
  }
  await page.evaluate(() => document.activeElement && document.activeElement.blur());
  return { page, errors, compact };
}

async function run(browser, viewport, text2x) {
  const tag = `${viewport.width}x${viewport.height}${text2x ? '@200%text' : ''}`;
  const need667 = viewport.width === 667;
  // ---------- pass 1: layout + keyboard ----------
  let { page, errors, compact } = await setup(browser, viewport, text2x);
  let snap = await probe(page);
  check(tag, 'black hole selected', snap.bodies.length === 1 && snap.selectedId === snap.bodies[0].id, snap.bodies.length);
  const state = await page.evaluate(() => ({
    collapsed: document.querySelector('.shell').classList.contains('tools-collapsed'),
    expanded: document.querySelector('#info-panel').classList.contains('expanded'),
    tight: document.body.classList.contains('overlay-tight'),
  }));
  if (compact) check(tag, 'tools collapsed and sheet expanded (keyboard)', state.collapsed && state.expanded, state);
  const ids = [...ROW, ...MODES, ...SHEET];
  let g = await geometry(page, ids);
  const required = ids.filter(id => need667 || g[id].rendered);
  if (need667) check(tag, 'all 11 dock controls rendered', ids.every(id => g[id].rendered), ids.filter(id => !g[id].rendered));
  const row = ROW.filter(id => required.includes(id));
  // Enforced on the compact dock (SC7-O1). The desktop tool panel is a separate scrolling panel; reported only.
  if (compact)
    check(tag, 'action row fully visible and unobstructed (centre + 4 corners) without scrolling', allOk(g, row), Object.fromEntries(row.map(id => [id, g[id]])));
  else console.log(JSON.stringify({ tag, observe: 'desktop action row visible without scrolling', value: allOk(g, row), detail: Object.fromEntries(row.map(id => [id, g[id]])) }));
  const overlap = await page.evaluate(() => {
    const a = document.querySelector('#tool-panel').getBoundingClientRect();
    const b = document.querySelector('#info-panel').getBoundingClientRect();
    const sp = document.querySelector('.speed').getBoundingClientRect();
    const zm = document.querySelector('.zoom-controls').getBoundingClientRect();
    const inter = (p, q) => Math.max(0, Math.min(p.bottom, q.bottom) - Math.max(p.top, q.top)) * Math.max(0, Math.min(p.right, q.right) - Math.max(p.left, q.left));
    const vis = r => r.width > 0 && r.height > 0;
    return {
      toolVsSheet: vis(a) && vis(b) ? inter(a, b) : 0,
      dockVsSpeed: Math.max(vis(a) ? inter(a, sp) : 0, vis(b) ? inter(b, sp) : 0),
      dockVsZoom: Math.max(vis(a) ? inter(a, zm) : 0, vis(b) ? inter(b, zm) : 0),
      sheetClip: [Math.round(b.top), Math.round(b.bottom)],
      toolRect: [Math.round(a.top), Math.round(a.bottom)],
    };
  });
  if (compact)
    check(tag, 'no overlap: action row vs sheet, dock vs time row, dock vs zoom column', overlap.toolVsSheet < 1 && overlap.dockVsSpeed < 1 && overlap.dockVsZoom < 1, overlap);
  // Keyboard: Tab from the first dock control through every required control; each, when focused, is fully visible
  // in its scroll window and unobstructed, and the action row is still fully visible at that moment.
  // Start one control before the first dock control and Tab into it, so focus is keyboard-initiated.
  const first = required[0];
  await page.locator('#' + first).focus();
  await page.keyboard.press('Shift+Tab');
  await page.keyboard.press('Tab');
  const seen = new Set();
  const path = [];
  let tabs = 0;
  let focusFail = [];
  for (; tabs < 80 && seen.size < required.length; tabs++) {
    const id = await page.evaluate(() => document.activeElement?.id || document.activeElement?.tagName);
    path.push(id);
    if (required.includes(id) && !seen.has(id)) {
      seen.add(id);
      await sleep(80);
      const gg = await geometry(page, [id, ...row]);
      const fv = await page.evaluate(() => document.activeElement.matches(':focus-visible'));
      if (!(gg[id].fullyVisible && gg[id].unobstructed && fv && (!compact || allOk(gg, row)))) focusFail.push({ id, gg, fv });
    }
    await page.keyboard.press('Tab');
    await sleep(40);
  }
  check(tag, 'every dock control reached by Tab', seen.size === required.length, { tabs, missing: required.filter(i => !seen.has(i)), path: path.slice(0, 40) });
  check(tag, compact ? 'each focused control fully visible, unobstructed, :focus-visible, with the action row still visible' : 'each focused control fully visible, unobstructed, :focus-visible', focusFail.length === 0, focusFail);
  // Keyboard operation (Enter on buttons, arrows on the select); each is undone again where reversible.
  const kb = async id => {
    await page.locator('#' + id).focus();
    await page.keyboard.press('Enter');
    await sleep(250);
  };
  const results = {};
  if (required.includes('pause')) {
    const p0 = (await probe(page)).paused;
    await kb('pause');
    const p1 = (await probe(page)).paused;
    await kb('pause');
    results.pause = p1 === !p0 && (await probe(page)).paused === p0;
  }
  if (required.includes('panel-toggle')) {
    await kb('panel-toggle');
    const open = await page.locator('#panel-toggle').getAttribute('aria-expanded');
    await kb('panel-toggle');
    const closed = await page.locator('#panel-toggle').getAttribute('aria-expanded');
    results['panel-toggle'] = open === 'true' && closed === 'false';
  }
  if (required.includes('inspect-mode')) {
    await kb('inspect-mode');
    const a = await page.locator('#inspect-mode').evaluate(e => e.classList.contains('active'));
    await kb('navigate-mode');
    const b = await page.locator('#navigate-mode').evaluate(e => e.classList.contains('active'));
    await kb('add-mode');
    const c = await page.locator('#add-mode').evaluate(e => e.classList.contains('active'));
    results['add-mode'] = results['inspect-mode'] = results['navigate-mode'] = a && b && c;
  }
  if (required.includes('info-expand')) {
    await kb('info-expand');
    const a = await page.locator('#info-expand').getAttribute('aria-expanded');
    await kb('info-expand');
    const b = await page.locator('#info-expand').getAttribute('aria-expanded');
    results['info-expand'] = a === 'false' && b === 'true';
  }
  for (const id of ['lock', 'build-lock'].filter(i => required.includes(i))) {
    await kb(id);
    const on = await page.locator('#' + id).evaluate(e => e.classList.contains('active'));
    await kb(id);
    const off = await page.locator('#' + id).evaluate(e => e.classList.contains('active'));
    results[id] = on && !off;
  }
  if (required.includes('bh-reference')) {
    await page.locator('#bh-reference').focus();
    const v0 = await page.locator('#bh-reference').inputValue();
    await page.keyboard.press('ArrowDown');
    await sleep(150);
    const v1 = await page.locator('#bh-reference').inputValue();
    await page.keyboard.press('ArrowUp');
    await sleep(150);
    results['bh-reference'] = v1 !== v0 && (await page.locator('#bh-reference').inputValue()) === v0;
  }
  if (required.includes('info-close')) {
    await kb('info-close');
    results['info-close'] = (await probe(page)).selectedId == null;
  }
  if (required.includes('clear')) {
    await kb('clear');
    results.clear = (await probe(page)).bodies.length === 0;
  }
  check(tag, 'keyboard operates every dock control', required.every(id => results[id] === true), results);
  check(tag, 'no page/console errors (keyboard pass)', errors.length === 0, errors);
  await page.close();
  // ---------- pass 2: pointer ----------
  ({ page, errors } = await setup(browser, viewport, text2x));
  if (need667 || text2x) await page.screenshot({ path: join(outDir, `sc7d-${tag.replace('@200%text', '-200text')}.png`) });
  const pr = {};
  const click = async id => {
    await page.locator('#' + id).click({ timeout: 5000 }); // actionability: visible, stable, receives the event
    await sleep(250);
  };
  try {
    if (required.includes('pause')) {
      const p0 = (await probe(page)).paused;
      await click('pause');
      const p1 = (await probe(page)).paused;
      await click('pause');
      pr.pause = p1 === !p0 && (await probe(page)).paused === p0;
    }
    if (required.includes('panel-toggle')) {
      await click('panel-toggle');
      const open = await page.locator('#panel-toggle').getAttribute('aria-expanded');
      await click('panel-toggle');
      pr['panel-toggle'] = open === 'true' && (await page.locator('#panel-toggle').getAttribute('aria-expanded')) === 'false';
    }
    if (required.includes('inspect-mode')) {
      await click('inspect-mode');
      const a = await page.locator('#inspect-mode').evaluate(e => e.classList.contains('active'));
      await click('navigate-mode');
      const b = await page.locator('#navigate-mode').evaluate(e => e.classList.contains('active'));
      await click('add-mode');
      const c = await page.locator('#add-mode').evaluate(e => e.classList.contains('active'));
      pr['add-mode'] = pr['inspect-mode'] = pr['navigate-mode'] = a && b && c;
    }
    if (required.includes('info-expand')) {
      await click('info-expand');
      const a = await page.locator('#info-expand').getAttribute('aria-expanded');
      await click('info-expand');
      pr['info-expand'] = a === 'false' && (await page.locator('#info-expand').getAttribute('aria-expanded')) === 'true';
    }
    for (const id of ['lock', 'build-lock'].filter(i => required.includes(i))) {
      await click(id);
      const on = await page.locator('#' + id).evaluate(e => e.classList.contains('active'));
      await click(id);
      pr[id] = on && !(await page.locator('#' + id).evaluate(e => e.classList.contains('active')));
    }
    if (required.includes('bh-reference')) {
      const v0 = await page.locator('#bh-reference').inputValue();
      await page.locator('#bh-reference').click({ timeout: 5000 }); // pointer reaches the select
      await page.keyboard.press('Escape');
      await page.locator('#bh-reference').selectOption('large-stellar');
      await sleep(150);
      pr['bh-reference'] = (await page.locator('#bh-reference').inputValue()) === 'large-stellar' && v0 !== 'large-stellar';
    }
    if (required.includes('info-close')) {
      await click('info-close');
      pr['info-close'] = (await probe(page)).selectedId == null;
    }
    if (required.includes('clear')) {
      await click('clear');
      pr.clear = (await probe(page)).bodies.length === 0;
    }
  } catch (e) {
    pr.error = String(e).split('\n')[0];
  }
  check(tag, 'pointer operates every dock control', required.every(id => pr[id] === true), pr);
  check(tag, 'no page/console errors (pointer pass)', errors.length === 0, errors);
  await page.close();
}
try {
  await waitForServer();
  const browser = await chromium.launch({
    executablePath: process.env.CHROME_PATH || undefined,
    args: ['--use-gl=swiftshader', '--enable-webgl', '--ignore-gpu-blocklist'],
  });
  for (const [viewport, text2x] of [
    [{ width: 667, height: 375 }, false],
    [{ width: 667, height: 375 }, true],
    [{ width: 844, height: 390 }, false],
    [{ width: 390, height: 844 }, false],
    [{ width: 1440, height: 900 }, false],
  ])
    await run(browser, viewport, text2x);
  await browser.close();
} finally {
  server.kill();
}
console.log(JSON.stringify({ summary: failed ? 'FAIL' : 'PASS', failed }));
process.exit(failed ? 1 : 0);
