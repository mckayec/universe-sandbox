// Timeline prototype probe (checkpoint 1): opens the Religious Traditions atlas, the Timeline dialog in chart and list
// mode, checks keyboard/focus, Escape, URL state (selection written, restored after reload, unknown id ignored,
// gated id ignored), zoom/reset, and takes screenshots. Usage (repo root, after `pnpm build`):
//   SHOTS=docs/reviews/synchronoptic-timelines/shots node docs/reviews/synchronoptic-timelines/tl1-probe.mjs
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { existsSync, mkdirSync } from 'node:fs';
import { chromium } from 'playwright';

const port = 4182;
const base = `http://127.0.0.1:${port}/atlas/?pack=abrahamic-world-religions`;
const shots = process.env.SHOTS;
if (shots) mkdirSync(shots, { recursive: true });
const server = spawn(process.execPath, ['node_modules/vite/bin/vite.js', 'preview', '--host', '127.0.0.1', '--port', String(port), '--strictPort'], { stdio: 'ignore' });
for (let i = 0; i < 300; i++) {
  try { if ((await fetch(base)).ok) break; } catch {}
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
async function open(vp, hash = '') {
  const ctx = await browser.newContext({ viewport: vp, isMobile: vp.width < 600, hasTouch: vp.width < 600, reducedMotion: 'reduce' });
  const tab = await ctx.newPage();
  tab.setDefaultTimeout(300000);
  tab.on('pageerror', e => errors.push(`pageerror: ${e.message}`));
  tab.on('console', m => { if (m.type() === 'error' && !/GL Driver|GPU stall|software WebGL/i.test(m.text())) errors.push(m.text()); });
  tab.on('response', r => { if (r.status() >= 400) errors.push(`${r.status()} ${r.url()}`); });
  await tab.goto(base + hash, { waitUntil: 'domcontentloaded' });
  await tab.waitForFunction(() => window.__atlas && document.querySelector('#splash.out'), null, { timeout: 300000 });
  return { ctx, tab };
}
const shot = (tab, name) => shots && tab.screenshot({ path: `${shots}/${name}.jpg`, type: 'jpeg', quality: 72 });
try {
  const { ctx, tab } = await open({ width: 1440, height: 900 });
  log('loaded 1440x900');
  await tab.locator('#tlBtn').click();
  await tab.locator('#timeline .tl-svg').waitFor();
  const n = await tab.evaluate(() => ({ marks: document.querySelectorAll('#timeline .tl-m').length, und: document.querySelectorAll('#timeline .tl-und .tl-it').length, focus: document.activeElement?.dataset?.tl }));
  assert.ok(n.marks > 50 && n.und > 50, JSON.stringify(n));
  assert.equal(n.focus, 'close', 'focus moves into the dialog');
  await shot(tab, 'tl1-1440-chart');
  // keyboard: focus first mark, arrow down, Enter selects, URL written
  await tab.locator('#timeline .tl-m').first().focus();
  await tab.keyboard.press('ArrowDown');
  await tab.keyboard.press('Enter');
  const sel = await tab.evaluate(() => document.activeElement?.dataset?.id);
  assert.ok(sel, 'selection keeps focus on the mark');
  assert.match(decodeURIComponent(await tab.evaluate(() => location.hash)), new RegExp('tl=1&tlsel=' + sel.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
  assert.match(await tab.locator('#timeline .tl-info').innerText(), /Relationships|Source|window|date/i);
  await shot(tab, 'tl1-1440-selected');
  // zoom in, then reset
  const w0 = await tab.evaluate(() => document.querySelector('#timeline .tl-svg').getAttribute('width'));
  await tab.locator('#timeline [data-z="1"]').click();
  const w1 = await tab.evaluate(() => document.querySelector('#timeline .tl-svg').getAttribute('width'));
  await tab.locator('#timeline [data-z="0"]').click();
  assert.ok(+w1 > +w0 && (await tab.evaluate(() => document.querySelector('#timeline .tl-svg').getAttribute('width'))) === w0);
  // list mode is the same gated set
  await tab.locator('#timeline [data-mode="list"]').click();
  const li = await tab.evaluate(() => document.querySelectorAll('#timeline .tl-list .tl-it, #timeline .tl-und .tl-it').length);
  assert.equal(li, n.marks + n.und, 'list holds every charted and undated record');
  await shot(tab, 'tl1-1440-list');
  // Escape closes and restores focus to the Timeline button; reopen/close repeated
  await tab.keyboard.press('Escape');
  assert.ok(await tab.locator('#timeline').isHidden());
  assert.equal(await tab.evaluate(() => document.activeElement?.id), 'tlBtn');
  for (let i = 0; i < 3; i++) { await tab.locator('#tlBtn').click(); await tab.keyboard.press('Escape'); }
  assert.equal(await tab.evaluate(() => document.activeElement?.id), 'tlBtn');
  assert.ok(!(await tab.evaluate(() => location.hash)).includes('tl='), 'closed timeline leaves the URL');
  log('1440 checks passed');
  // URL restore, unknown id, and a layer-gated id
  await tab.goto('about:blank');
  await tab.goto(base + '#tl=1&tlsel=' + encodeURIComponent(sel)); await tab.waitForFunction(() => window.__atlas && document.querySelector('#splash.out'));
  await tab.locator('#timeline .tl-m.sel').waitFor();
  await tab.goto('about:blank');
  await tab.goto(base + '#tl=1&tlsel=n%3Anope'); await tab.waitForFunction(() => window.__atlas && document.querySelector('#splash.out'));
  await tab.locator('#timeline .tl-svg').waitFor();
  assert.equal(await tab.locator('#timeline .tl-m.sel').count(), 0, 'unknown id ignored');
  await tab.goto('about:blank');
  await tab.goto(base + '#layers=chr&tl=1&tlsel=n%3Ajud-karaite'); await tab.waitForFunction(() => window.__atlas && document.querySelector('#splash.out'));
  await tab.locator('#timeline .tl-svg').waitFor();
  assert.equal(await tab.locator('#timeline .tl-m.sel').count(), 0, 'layer-gated id ignored');
  assert.equal(await tab.locator('#timeline [data-id="n:jud-karaite"]').count(), 0, 'gated record not drawn or listed');
  log('URL checks passed');
  await ctx.close();
  for (const vp of [{ width: 3840, height: 2160 }, { width: 1280, height: 800 }, { width: 390, height: 844 }]) {
    const o = await open(vp, '#tl=1');
    await o.tab.locator('#timeline .tl-svg').waitFor();
    const fs = await o.tab.evaluate(() => Math.min(...[...document.querySelectorAll('#timeline .tl-lbl, #timeline .tl-it')].slice(0, 40).map(e => parseFloat(getComputedStyle(e).fontSize))));
    assert.ok(fs >= 12, `smallest label ${fs}px at ${vp.width}`);
    const hscroll = await o.tab.evaluate(() => document.documentElement.scrollWidth > innerWidth);
    assert.equal(hscroll, false, 'no page-level horizontal scroll');
    await shot(o.tab, `tl1-${vp.width}-chart`);
    if (vp.width < 600) { await o.tab.locator('#timeline [data-mode="list"]').click(); await shot(o.tab, 'tl1-390-list'); }
    log(`${vp.width}x${vp.height} passed (smallest label ${fs}px)`);
    await o.ctx.close();
  }
  assert.deepEqual(errors, [], 'console errors or failed resources');
  log('PASS (no console errors, no >=400 resources)');
} finally {
  await browser.close();
  server.kill();
}
