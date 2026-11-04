// Checkpoint 62 probe (MAT61-C1): the rock/sand comparison card in the bom-bible tab, its three source links, no See-also, layer gating, phone.
// Usage (repo root, after `pnpm build`): node docs/universes/packs/lds-standard-works/supplementary-build/s62-probe.mjs
// Real keyboard/click/touch input. Writes PNGs to $SHOTS (optional). Exits non-zero on the first failed check.
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { existsSync, mkdirSync } from 'node:fs';
import { chromium } from 'playwright';

const port = Number(process.env.PORT || 4179);
// FROM=n starts at check n (software WebGL is slow; checks 1–2 share one page)
const from = Number(process.env.FROM || 1);
const to = Number(process.env.TO || 2);
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

try {
  const srcs = async (tab, key) => (await item(tab, key).locator('.cx-src a').allTextContents()).map(s => s.trim());
  const hrefs = async (tab, key) =>
    item(tab, key)
      .locator('.cx-src a')
      .evaluateAll(as => as.map(a => a.href));
  const KEY = 'BMV-185-doctrine-foundations-matthew';
  const S = 'https://www.churchofjesuschrist.org/study/scriptures/';
  let ctx, tab;
  if (from <= 1 && to >= 1) {
    // 1. desktop, all layers: 108 views; the card cites three passages with official links and has no See-also
    ({ ctx, tab } = await open('', { width: 1440, height: 900 }));
    log('desktop loaded');
    await tab.locator('#cxBtn').click({ noWaitAfter: true });
    await section(tab, 'bom-bible');
    assert.equal(await tab.locator('#cxBody .cx-item').count(), 108);
    const v = item(tab, KEY);
    await v.scrollIntoViewIfNeeded();
    assert.deepEqual(await srcs(tab, KEY), ['3 Nephi 11:31–40', 'Matthew 16:13–20', 'Matthew 7:21–29']);
    assert.deepEqual(await hrefs(tab, KEY), [
      S + 'bofm/3-ne/11?lang=eng',
      S + 'nt/matt/16?lang=eng',
      S + 'nt/matt/7?lang=eng',
    ]);
    assert.equal(await v.locator('.cx-see').count(), 0);
    const text = await v.innerText();
    assert.match(text, /Rock and sand compared with Matthew \(3 Nephi 11\)/);
    assert.match(text, /not one setting, audience or event/);
    // the wounds view in the same chapter is still there with its own source
    assert.deepEqual(await srcs(tab, 'BMV-185-crucified-christ-wounds-bountiful'), ['3 Nephi 11:11–15']);
    if (shots) await v.screenshot({ path: `${shots}/s62-bmv185-matthew-1440x900.png` });
    log('check 1 passed');
    await ctx.close();
  }
  if (from <= 2 && to >= 2) {
    // 2. phone: Book of Mormon layer shows it; a Bible-only selection hides it; no sideways scroll
    ({ ctx, tab } = await open('#layers=bom', { width: 390, height: 844 }));
    log('phone loaded');
    await tab.locator('#cxBtn').tap({ noWaitAfter: true });
    await section(tab, 'bom-bible');
    assert.equal(await tab.locator('#cxBody .cx-item').count(), 108);
    await item(tab, KEY).scrollIntoViewIfNeeded();
    const sw = await tab.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    assert.ok(sw <= 0, `page scrolls sideways by ${sw}px`);
    await ctx.close();
    ({ ctx, tab } = await open('#layers=ot,nt', { width: 390, height: 844 }));
    await tab.locator('#cxBtn').tap({ noWaitAfter: true });
    const tabs = await tab.locator('#cxPick option').allTextContents();
    if (tabs.length) {
      const has = await tab.locator('#cxPick option[value="bom-bible"]').count();
      if (has) {
        await section(tab, 'bom-bible');
        assert.equal(await item(tab, KEY).count(), 0);
      }
    }
    log('check 2 passed');
    await ctx.close();
  }
  if (errors.length) throw new Error(errors.join('\n'));
  console.log('s62 probe: all checks passed');
} finally {
  await browser.close();
  server.kill();
}
