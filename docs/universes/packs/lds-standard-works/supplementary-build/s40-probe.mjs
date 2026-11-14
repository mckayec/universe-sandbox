// Checkpoint 40 probe: the narrated First Vision date label and the year filter (timeline/source-vision crosswalk).
// Usage (repo root, after `pnpm build`): node docs/universes/packs/lds-standard-works/supplementary-build/s40-probe.mjs
// Real keyboard/click/touch input. Writes PNGs to $SHOTS (optional). Exits non-zero on the first failed check.
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { existsSync, mkdirSync } from 'node:fs';
import { chromium } from 'playwright';

const port = Number(process.env.PORT || 4180);
// FROM=n starts at check n (software WebGL is slow; checks 1–2 share one page)
const from = Number(process.env.FROM || 1);
const to = Number(process.env.TO || 3);
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

async function open(hash, vp) {
  const ctx = await browser.newContext({ viewport: vp, isMobile: vp.width < 600, hasTouch: vp.width < 600 });
  const tab = await ctx.newPage();
  // software WebGL (SwiftShader) keeps the main thread busy drawing the Earth surface, so input waits are long
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
  await tab.goto(page0 + hash, { waitUntil: 'domcontentloaded' });
  await tab.locator('#app .top').waitFor({ state: 'visible', timeout: 300000 });
  await tab.waitForFunction(() => !document.querySelector('#splash') || document.querySelector('#splash.out'), null, {
    timeout: 300000,
  });
  return { ctx, tab };
}
async function section(tab, id) {
  if (await tab.locator('#cxPick').isVisible()) await tab.locator('#cxPick').selectOption(id);
  else await tab.locator(`#cxTabs [data-tab="${id}"]`).click({ noWaitAfter: true });
}
const item = (tab, key) => tab.locator(`#cxBody .cx-item[data-key="${key}"]`);
const fv = tab => tab.locator('#cxBody .cx-item', { hasText: 'First Vision account' });

try {
  let ctx, tab;
  const check = async (hash, vp, expectShown, shot) => {
    ({ ctx, tab } = await open(hash, vp));
    await tab.locator('#cxBtn').click({ noWaitAfter: true });
    await section(tab, 'unmapped-narratives');
    const n = await fv(tab).count();
    assert.equal(n, expectShown, `${hash} ${vp.width}: ${n} First Vision cards`);
    for (let i = 0; i < n; i++) {
      const meta = (await fv(tab).nth(i).locator('.lwhen').allTextContents()).map(s => s.trim());
      assert.deepEqual(meta, ['spring 1820, as narrated']);
    }
    if (n) await fv(tab).first().scrollIntoViewIfNeeded();
    if (shots && shot) await tab.screenshot({ path: `${shots}/${shot}.png` });
    await ctx.close();
  };
  if (from <= 1 && to >= 1) {
    // 1. all layers, all years, desktop: both accounts show the narrated wording, not a bare year
    await check('', { width: 1440, height: 900 }, 2, 's40-first-vision-1440x900');
    log('check 1 passed (two cards, narrated label)');
  }
  if (from <= 2 && to >= 2) {
    // 2. year filter 1830–1840: the 1820 cards are filtered out by `when`
    await check('#yr=1830_1840', { width: 1440, height: 900 }, 0, null);
    log('check 2 passed (year filter still uses when)');
  }
  if (from <= 3 && to >= 3) {
    // 3. phone, year filter 1815–1825: both cards shown with the label
    await check('#yr=1815_1825', { width: 390, height: 844 }, 2, 's40-first-vision-390x844');
    log('check 3 passed (phone, 1815–1825)');
  }
  console.log(`S40 probe passed: checks ${from}–${to}; no console errors, failed requests or HTTP errors.`);
} finally {
  if (errors.length) console.log(errors.join('\n'));
  await browser.close();
  server.kill();
}
assert.deepEqual(errors, []);
