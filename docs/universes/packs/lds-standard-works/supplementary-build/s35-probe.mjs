// Checkpoint 35 probe: the 14 S34-decision source views (bom-bible tab, one-way See-also, layer gating).
// Usage (repo root, after `pnpm build`): node docs/universes/packs/lds-standard-works/supplementary-build/s35-probe.mjs
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
  const focused = (tab, key) =>
    tab.waitForFunction(k => document.activeElement?.closest('.cx-item')?.dataset.key === k, key);
  const rels = async (tab, key) => (await item(tab, key).locator('.cx-rel').allTextContents()).map(s => s.trim());
  const bodyText = tab => tab.locator('#cxBody').innerText();

  let ctx, tab;
  if (from <= 1 && to >= 1) {
    // 1. all layers, desktop, keyboard: Jacob 2 names David and Solomon; Enter reaches Solomon's card, which carries
    //    no Book of Mormon label back; the 2 Nephi 26 Zion view has no link at all
    ({ ctx, tab } = await open('', { width: 1440, height: 900 }));
    log('desktop loaded');
    await tab.locator('#cxBtn').click({ noWaitAfter: true });
    await section(tab, 'bom-bible');
    assert.equal(await tab.locator('#cxBody .cx-item').count(), 53);
    const z = item(tab, 'BMV-048-zion-welfare-teaching');
    assert.equal(await z.locator('.cx-see').count(), 0);
    assert.equal(await z.locator('.cx-src a').textContent(), '2 Nephi 26:29–31');
    const v57 = item(tab, 'BMV-057-david-solomon-rebuke');
    await v57.scrollIntoViewIfNeeded();
    assert.deepEqual(await rels(tab, 'BMV-057-david-solomon-rebuke'), [
      'named in Jacob’s rebuke:',
      'named in Jacob’s rebuke:',
    ]);
    if (shots) await tab.screenshot({ path: `${shots}/s35-bmv057-1440x900.png` });
    await v57.locator('.cx-ref', { hasText: 'Solomon' }).locator('.cx-see').focus();
    await tab.keyboard.press('Enter', { noWaitAfter: true });
    await focused(tab, 'OHR-SOLOMON');
    const so = await item(tab, 'OHR-SOLOMON').innerText();
    assert.ok(!/Book of Mormon|Jacob’s rebuke|Jacob 2/.test(so), so);
    log('check 1 passed (53 views, keyboard, one-way link, no-link Zion view)');
    await ctx.close();
  }

  if (from <= 2 && to >= 2) {
    // 2. Book of Mormon layer only: the Israel views are shown, their Old Testament target named but not linked
    ({ ctx, tab } = await open('#layers=bom', { width: 1440, height: 900 }));
    await tab.locator('#cxBtn').click({ noWaitAfter: true });
    await section(tab, 'bom-bible');
    assert.equal(await tab.locator('#cxBody .cx-item').count(), 53);
    for (const k of ['BMV-179-israel-gathering-editorial', 'BMV-210-israel-lament-restoration']) {
      const v = item(tab, k);
      assert.equal(await v.locator('.cx-see').count(), 0, k);
      assert.equal(await v.locator('.cx-off', { hasText: 'hidden by the layer or year filter' }).count(), 1, k);
    }
    log('check 2 passed (BoM-only: Israel targets not navigable)');
    await ctx.close();
  }
  console.log(`S35 probe passed: checks ${from}–${to}; no console errors, failed requests or HTTP errors.`);
} finally {
  if (errors.length) console.log(errors.join('\n'));
  await browser.close();
  server.kill();
}
assert.deepEqual(errors, []);
