// Checkpoint 36 probe: the five S35-answer source views (bom-bible tab, one-way See-also, layer gating, phone).
// Usage (repo root, after `pnpm build`): node docs/universes/packs/lds-standard-works/supplementary-build/s36-probe.mjs
// Real keyboard/click/touch input. Writes PNGs to $SHOTS (optional). Exits non-zero on the first failed check.
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { existsSync, mkdirSync } from 'node:fs';
import { chromium } from 'playwright';

const port = Number(process.env.PORT || 4179);
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

try {
  const focused = (tab, key) =>
    tab.waitForFunction(k => document.activeElement?.closest('.cx-item')?.dataset.key === k, key);
  const rels = async (tab, key) => (await item(tab, key).locator('.cx-rel').allTextContents()).map(s => s.trim());

  let ctx, tab;
  if (from <= 1 && to >= 1) {
    // 1. all layers, desktop, keyboard: Alma 36 carries both recollections with bounded labels; Enter on Egypt
    //    reaches the Old Testament card, which carries no Book of Mormon label back; Mary reaches NTE-annunciations
    ({ ctx, tab } = await open('', { width: 1440, height: 900 }));
    log('desktop loaded');
    await tab.locator('#cxBtn').click({ noWaitAfter: true });
    await section(tab, 'bom-bible');
    assert.equal(await tab.locator('#cxBody .cx-item').count(), 58);
    const v131 = item(tab, 'BMV-131-egypt-jerusalem-alma');
    await v131.scrollIntoViewIfNeeded();
    assert.deepEqual(await rels(tab, 'BMV-131-egypt-jerusalem-alma'), [
      'deliverance recalled by Alma:',
      'ancestral departure recalled:',
    ]);
    assert.equal(await v131.locator('.cx-src a').textContent(), 'Alma 36:28–29');
    if (shots) await tab.screenshot({ path: `${shots}/s36-bmv131-1440x900.png` });
    await v131.locator('.cx-see').first().focus();
    await tab.keyboard.press('Enter', { noWaitAfter: true });
    await focused(tab, 'OTS-P04-egypt');
    const eg = await item(tab, 'OTS-P04-egypt').innerText();
    assert.ok(!/Book of Mormon|recalled by Alma|Alma 36/.test(eg), eg);
    await section(tab, 'bom-bible');
    const v069 = item(tab, 'BMV-069-mary-benjamin-angel');
    await v069.scrollIntoViewIfNeeded();
    assert.deepEqual(await rels(tab, 'BMV-069-mary-benjamin-angel'), ['Mary, also named in Luke:']);
    await v069.locator('.cx-see').first().focus();
    await tab.keyboard.press('Enter', { noWaitAfter: true });
    await focused(tab, 'NTE-annunciations');
    const an = await item(tab, 'NTE-annunciations').innerText();
    assert.ok(!/Book of Mormon|Benjamin|Mosiah 3/.test(an), an);
    log('check 1 passed (58 views, keyboard, one-way Egypt and Mary links)');
    await ctx.close();
  }

  if (from <= 2 && to >= 2) {
    // 2. phone, Book of Mormon layer only, touch: the new views are shown, their Bible targets named but not linked
    ({ ctx, tab } = await open('#layers=bom', { width: 390, height: 844 }));
    log('phone loaded');
    await tab.locator('#cxBtn').tap({ noWaitAfter: true });
    await section(tab, 'bom-bible');
    assert.equal(await tab.locator('#cxBody .cx-item').count(), 58);
    for (const k of [
      'BMV-073-egypt-jerusalem-limhi',
      'BMV-079-sinai-moses-comparison',
      'BMV-131-egypt-jerusalem-alma',
      'BMV-141-joseph-garment-moroni',
      'BMV-069-mary-benjamin-angel',
    ]) {
      const v = item(tab, k);
      assert.equal(await v.locator('.cx-see').count(), 0, k);
      assert.ok((await v.locator('.cx-off', { hasText: 'hidden by the layer or year filter' }).count()) >= 1, k);
    }
    const v079 = item(tab, 'BMV-079-sinai-moses-comparison');
    await v079.scrollIntoViewIfNeeded();
    const sw = await tab.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    assert.ok(sw <= 0, `page scrolls sideways by ${sw}px`);
    if (shots) await tab.screenshot({ path: `${shots}/s36-bmv079-390x844.png` });
    log('check 2 passed (phone, BoM-only: targets not navigable, no sideways scroll)');
    await ctx.close();
  }

  if (from <= 3 && to >= 3) {
    // 3. 4K, all layers: the Alma 46 view renders its caveat and link
    ({ ctx, tab } = await open('', { width: 3840, height: 2160 }));
    log('4K loaded');
    await tab.locator('#cxBtn').click({ noWaitAfter: true });
    await section(tab, 'bom-bible');
    const v141 = item(tab, 'BMV-141-joseph-garment-moroni');
    await v141.scrollIntoViewIfNeeded();
    assert.match(await v141.innerText(), /not a quotation found in the Genesis text/);
    assert.deepEqual(await rels(tab, 'BMV-141-joseph-garment-moroni'), ['garment recalled by Moroni:']);
    if (shots) await tab.screenshot({ path: `${shots}/s36-bmv141-3840x2160.png` });
    log('check 3 passed (4K)');
    await ctx.close();
  }
  console.log(`S36 probe passed: checks ${from}–${to}; no console errors, failed requests or HTTP errors.`);
} finally {
  if (errors.length) console.log(errors.join('\n'));
  await browser.close();
  server.kill();
}
assert.deepEqual(errors, []);
