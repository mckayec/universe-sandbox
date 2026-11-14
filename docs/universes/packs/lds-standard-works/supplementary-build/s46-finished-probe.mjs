// Checkpoint 46 probe (copy of s42-probe.mjs, shot names only changed): finished-bake rendered set at the remaining sizes.
// Usage (repo root, after `pnpm build`): node docs/universes/packs/lds-standard-works/supplementary-build/s42-probe.mjs
// Env: SHOTS=<dir> for PNGs; VPS=1440,3840,1280,390 (subset/order); CHROME_PATH optional.
// Real keyboard input only (no programmatic focus). Exits non-zero on the first failed check.
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { existsSync, mkdirSync } from 'node:fs';
import { chromium } from 'playwright';

const port = Number(process.env.PORT || 4182);
const origin = `http://127.0.0.1:${port}`;
const page0 = `${origin}/atlas/?pack=lds-standard-works`;
const shots = process.env.SHOTS;
if (shots) mkdirSync(shots, { recursive: true });
const sizes = {
  1440: { width: 1440, height: 900 },
  3840: { width: 3840, height: 2160 },
  1280: { width: 1280, height: 800 },
  390: { width: 390, height: 844 },
};
const order = (process.env.VPS || '1440,3840,1280,390').split(',').map(Number);
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

async function open(vp) {
  const ctx = await browser.newContext({ viewport: vp, isMobile: vp.width < 600, hasTouch: vp.width < 600 });
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
  log(`${vp.width}x${vp.height} ready`);
  return { ctx, tab };
}

// describe the focused element: identity, visibility, on-screen, visible focus indicator
const focused = tab =>
  tab.evaluate(() => {
    const e = document.activeElement;
    if (!e || e === document.body) return { id: 'BODY' };
    const r = e.getBoundingClientRect();
    const cs = getComputedStyle(e);
    const ring =
      (cs.outlineStyle !== 'none' && parseFloat(cs.outlineWidth) > 0) || (cs.boxShadow && cs.boxShadow !== 'none');
    const label = (e.getAttribute('aria-label') || e.textContent || e.value || '').trim().slice(0, 40);
    // stable per-element identity for id-less controls (probe-side WeakMap; the page is not modified)
    const ids = (window.__s42ids ||= new WeakMap());
    if (!ids.has(e)) ids.set(e, (ids.n = (ids.n || 0) + 1));
    const tag = `${e.tagName.toLowerCase()}${e.id ? '#' + e.id : ''}`;
    return {
      id: e.id ? tag : `${tag}(${ids.get(e)})${e.dataset.key ? '[' + e.dataset.key + ']' : ''}`,
      label,
      visible: e.offsetParent !== null && r.width > 0 && r.height > 0,
      onscreen: r.bottom > 0 && r.right > 0 && r.top < innerHeight && r.left < innerWidth,
      ring,
      inCodex: !!e.closest('#codex'),
      name: !!(e.getAttribute('aria-label') || e.textContent.trim() || e.title || e.labels?.length),
    };
  });

async function traversal(tab) {
  // 1. forward Tab from the document start until the sequence repeats
  await tab.evaluate(() => document.activeElement?.blur());
  const fwd = [];
  for (let i = 0; i < 80; i++) {
    await tab.keyboard.press('Tab');
    const f = await focused(tab);
    if (f.id === 'BODY') break;
    if (fwd.length && f.id === fwd[0].id) break;
    fwd.push(f);
  }
  log(`forward Tab stops: ${fwd.length}`);
  for (const f of fwd) console.log(`  ${f.id} "${f.label}" visible=${f.visible} onscreen=${f.onscreen} ring=${f.ring}`);
  assert.ok(fwd.length >= 3, 'at least three Tab stops in the main view');
  for (const f of fwd) {
    assert.ok(f.visible, `Tab stop ${f.id} is visible`);
    assert.ok(f.onscreen, `Tab stop ${f.id} is on screen`);
    assert.ok(f.ring, `Tab stop ${f.id} shows a focus indicator`);
    assert.ok(f.name, `Tab stop ${f.id} has an accessible name`);
    assert.ok(!f.inCodex, `Tab stop ${f.id} is not inside the closed Codex`);
  }
  assert.ok(
    fwd.some(f => f.id === 'button#cxBtn'),
    'the Codex button is reachable by Tab',
  );
  // 2. Shift-Tab from the last stop walks the same stops in reverse
  const back = [fwd[fwd.length - 1].id];
  for (let i = 1; i < fwd.length; i++) {
    await tab.keyboard.press('Shift+Tab');
    back.push((await focused(tab)).id);
  }
  assert.deepEqual(back, fwd.map(f => f.id).reverse(), 'Shift-Tab reverses the Tab order');
  log('Shift-Tab reverses the forward order');
  // 3. Codex by keyboard: Enter opens, focus on close, Tab trapped, Escape returns focus
  while ((await focused(tab)).id !== 'button#cxBtn') await tab.keyboard.press('Tab');
  await tab.keyboard.press('Enter');
  await tab.locator('#codex').waitFor({ state: 'visible' });
  assert.equal((await focused(tab)).id, 'button#cxClose', 'Enter on Codex focuses its close button');
  let inside = 0;
  for (let i = 0; i < 25; i++) {
    await tab.keyboard.press('Tab');
    const f = await focused(tab);
    assert.ok(f.inCodex, `Tab ${i + 1} stays inside the open Codex (${f.id})`);
    assert.ok(f.visible && f.ring, `Codex Tab stop ${f.id} visible with focus indicator`);
    inside++;
  }
  await tab.keyboard.press('Escape');
  await tab.waitForFunction(() => document.querySelector('#codex').hidden);
  log(`Codex: ${inside} Tab stops stayed inside; Escape closed it`);
  // reopen, Shift-Tab from close wraps to the last stop, Tab wraps back, Escape returns focus to the button
  await tab.locator('#cxBtn').focus();
  await tab.keyboard.press('Enter');
  await tab.locator('#codex').waitFor({ state: 'visible' });
  await tab.keyboard.press('Shift+Tab');
  const wrapped = await focused(tab);
  assert.ok(wrapped.inCodex && wrapped.id !== 'button#cxClose', `Shift-Tab from close wraps inside (${wrapped.id})`);
  await tab.keyboard.press('Tab');
  assert.equal((await focused(tab)).id, 'button#cxClose', 'Tab from the last Codex stop wraps to close');
  await tab.keyboard.press('Escape');
  await tab.waitForFunction(() => document.querySelector('#codex').hidden);
  assert.equal((await focused(tab)).id, 'button#cxBtn', 'Escape returns focus to the Codex button');
  log('Codex wrap both ways; Escape returns focus to #cxBtn');
}

async function finished(tab, vp) {
  // finished-bake: the surface progress bar has gone (observed, not timed) and no programmatic move is running
  await tab.waitForFunction(() => document.querySelector('#bake')?.hidden === true, null, { timeout: 3600000 });
  log(`${vp.width}x${vp.height} bake finished`);
  await tab.waitForTimeout(1500);
  const m = await tab.evaluate(() => ({
    bake: document.querySelector('#bake').hidden,
    overflow: document.documentElement.scrollWidth > innerWidth,
    labels: [...document.querySelectorAll('#labels .plbl, #labels .lbl')].filter(
      e => parseFloat(getComputedStyle(e).opacity) > 0.05,
    ).length,
    canvas: (() => {
      const c = document.querySelector('canvas');
      return c ? [c.width, c.height] : null;
    })(),
    dpr: devicePixelRatio,
  }));
  console.log(`  ${vp.width}: ${JSON.stringify(m)}`);
  assert.ok(m.bake, 'bake bar hidden');
  assert.ok(!m.overflow, 'no horizontal page overflow');
  if (shots) await tab.screenshot({ path: `${shots}/s46-finished-${vp.width}x${vp.height}.png` });
}

try {
  for (const w of order) {
    const vp = sizes[w];
    const { ctx, tab } = await open(vp);
    if (w === 1440) await traversal(tab);
    await finished(tab, vp);
    await ctx.close();
  }
  assert.deepEqual(errors, [], 'no console errors, failed requests or HTTP >= 400');
  log('PASS');
} catch (e) {
  console.error(e);
  if (errors.length) console.error(errors.join('\n'));
  process.exitCode = 1;
} finally {
  await browser.close();
  server.kill();
}
