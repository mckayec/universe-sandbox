// Checkpoint 38 probe: the S37-decision source views (bom-bible tab, one-way See-also, layer gating, phone).
// Usage (repo root, after `pnpm build`): node docs/universes/packs/lds-standard-works/supplementary-build/s38-probe.mjs
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
  const srcs = async (tab, key) => (await item(tab, key).locator('.cx-src a').allTextContents()).map(s => s.trim());

  let ctx, tab;
  if (from <= 1 && to >= 1) {
    // 1. all layers, desktop, keyboard: 76 views; the Matthew 5 comparison cites both passages and reaches the
    //    sermon card, which carries no Book of Mormon label back; the John 21 view has no link and is not Patmos
    ({ ctx, tab } = await open('', { width: 1440, height: 900 }));
    log('desktop loaded');
    await tab.locator('#cxBtn').click({ noWaitAfter: true });
    await section(tab, 'bom-bible');
    assert.equal(await tab.locator('#cxBody .cx-item').count(), 76);
    const v202 = item(tab, 'BMV-202-three-disciples-john');
    await v202.scrollIntoViewIfNeeded();
    assert.deepEqual(await srcs(tab, 'BMV-202-three-disciples-john'), ['3 Nephi 28:4–9', 'John 21:20–23']);
    assert.equal(await v202.locator('.cx-see').count(), 0);
    assert.ok(!/Doctrine and Covenants|D&C|Patmos vision/.test(await v202.innerText()));
    const v186 = item(tab, 'BMV-186-sermon-compare-matthew-5');
    await v186.scrollIntoViewIfNeeded();
    assert.deepEqual(await srcs(tab, 'BMV-186-sermon-compare-matthew-5'), ['3 Nephi 12:1–12', 'Matthew 5:1–12']);
    assert.deepEqual(await rels(tab, 'BMV-186-sermon-compare-matthew-5'), ['compare Matthew 5:']);
    if (shots) await tab.screenshot({ path: `${shots}/s38-bmv186-1440x900.png` });
    await v186.locator('.cx-see').first().focus();
    await tab.keyboard.press('Enter', { noWaitAfter: true });
    await focused(tab, 'NTC-sermon-mountain');
    const sm = await item(tab, 'NTC-sermon-mountain').innerText();
    assert.ok(!/Book of Mormon|3 Nephi|compare Matthew/.test(sm), sm);
    log('check 1 passed (76 views, keyboard, two-source comparison, one-way sermon link, unlinked John 21 view)');
    await ctx.close();
  }

  if (from <= 2 && to >= 2) {
    // 2. phone, Book of Mormon layer only, touch: the new linked views name their Bible targets without links
    ({ ctx, tab } = await open('#layers=bom', { width: 390, height: 844 }));
    log('phone loaded');
    await tab.locator('#cxBtn').tap({ noWaitAfter: true });
    await section(tab, 'bom-bible');
    assert.equal(await tab.locator('#cxBody .cx-item').count(), 76);
    for (const k of [
      'BMV-053-baptism-example-nephi',
      'BMV-124-egypt-deliverance-alma-29',
      'BMV-172-death-signs-samuel',
      'BMV-113-creation-ammon-lamoni',
      'BMV-081-peace-messengers-jerusalem',
      'BMV-191-healings-jerusalem-recalled',
    ]) {
      const v = item(tab, k);
      assert.equal(await v.locator('.cx-see').count(), 0, k);
      assert.ok((await v.locator('.cx-off', { hasText: 'hidden by the layer or year filter' }).count()) >= 1, k);
    }
    const v081 = item(tab, 'BMV-081-peace-messengers-jerusalem');
    await v081.scrollIntoViewIfNeeded();
    const sw = await tab.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    assert.ok(sw <= 0, `page scrolls sideways by ${sw}px`);
    if (shots) await tab.screenshot({ path: `${shots}/s38-bmv081-390x844.png` });
    log('check 2 passed (phone, BoM-only: targets not navigable, no sideways scroll)');
    await ctx.close();
  }

  if (from <= 3 && to >= 3) {
    // 3. 4K, all layers: BMV-166 renders the Helaman 6:10 sentence and source (S37-C2)
    ({ ctx, tab } = await open('', { width: 3840, height: 2160 }));
    log('4K loaded');
    await tab.locator('#cxBtn').click({ noWaitAfter: true });
    await section(tab, 'bom-bible');
    const v166 = item(tab, 'BMV-166-witnesses-mulek-claim');
    await v166.scrollIntoViewIfNeeded();
    assert.match(await v166.innerText(), /Helaman 6:10 separately says that the northern land was named after Mulek/);
    assert.deepEqual(await srcs(tab, 'BMV-166-witnesses-mulek-claim'), ['Helaman 8:11–22', 'Helaman 6:10']);
    if (shots) await tab.screenshot({ path: `${shots}/s38-bmv166-3840x2160.png` });
    log('check 3 passed (4K)');
    await ctx.close();
  }
  console.log(`S38 probe passed: checks ${from}–${to}; no console errors, failed requests or HTTP errors.`);
} finally {
  if (errors.length) console.log(errors.join('\n'));
  await browser.close();
  server.kill();
}
assert.deepEqual(errors, []);
