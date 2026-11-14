// Checkpoint 32 probe: Book of Mormon source views for Bible texts and figures (bom-bible tab, one-way See-also).
// Usage (repo root, after `pnpm build`): node docs/universes/packs/lds-standard-works/supplementary-build/s32-probe.mjs
// Real keyboard/click/touch input. Writes PNGs to $SHOTS (optional). Exits non-zero on the first failed check.
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { existsSync, mkdirSync } from 'node:fs';
import { chromium } from 'playwright';

const port = Number(process.env.PORT || 4179);
// FROM=n starts at check n (software WebGL is slow; checks 1–2 share one page)
const from = Number(process.env.FROM || 1);
const to = Number(process.env.TO || 6);
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
  if (from <= 2 && to >= 1) {
    // 1. all layers, desktop, keyboard: the 2 Nephi 17 view names its four quoted entities; Enter reaches Damascus
    ({ ctx, tab } = await open('', { width: 1440, height: 900 }));
    log('desktop loaded');
    await tab.locator('#cxBtn').click({ noWaitAfter: true });
    await section(tab, 'bom-bible');
    assert.equal(await tab.locator('#cxBody .cx-item').count(), 39);
    const v39 = item(tab, 'BMV-039-judah-damascus-samaria');
    await v39.scrollIntoViewIfNeeded();
    assert.deepEqual(await rels(tab, 'BMV-039-judah-damascus-samaria'), [
      'same crisis, quoted:',
      'quoted from Isaiah:',
      'quoted from Isaiah:',
      'quoted from Isaiah:',
    ]);
    assert.equal(await v39.locator('.cx-src a').textContent(), '2 Nephi 17:1–14');
    if (shots) await tab.screenshot({ path: `${shots}/s32-bmv039-1440x900.png` });
    await v39.locator('.cx-ref', { hasText: 'Damascus in the prophets' }).locator('.cx-see').focus();
    await tab.keyboard.press('Enter', { noWaitAfter: true });
    await focused(tab, 'OTM-damascus');
    // the Bible card carries no Book of Mormon label or link back
    const dm = await item(tab, 'OTM-damascus').innerText();
    assert.ok(!/Book of Mormon|2 Nephi|quoted from Isaiah/.test(dm), dm);
    log('check 1 passed (keyboard, one-way link, no reciprocal label)');

    // 2. click an event link: Lehi's vision view opens the Chronicle's Jerusalem destroyed event
    await section(tab, 'bom-bible');
    const v1 = item(tab, 'BMV-001-jerusalem-destruction-vision');
    await v1.scrollIntoViewIfNeeded();
    await v1
      .locator('.cx-ref', { hasText: 'foreseen in Lehi’s vision' })
      .locator('.cx-see')
      .click({ noWaitAfter: true });
    await tab.waitForFunction(
      () => document.querySelector('#codex').hidden && window.__atlas?.S?.ev === 'jerusalem-destruction',
    );
    log('check 2 passed (click to a Chronicle event)');
    await ctx.close();
  }

  if (from <= 3 && to >= 3) {
    // 3. Book of Mormon layer only: views shown; Old Testament targets named but not linked
    ({ ctx, tab } = await open('#layers=bom', { width: 1440, height: 900 }));
    await tab.locator('#cxBtn').click({ noWaitAfter: true });
    await section(tab, 'bom-bible');
    assert.equal(await tab.locator('#cxBody .cx-item').count(), 39);
    const off = item(tab, 'BMV-039-judah-damascus-samaria');
    assert.equal(await off.locator('.cx-see').count(), 0);
    assert.equal(await off.locator('.cx-off', { hasText: 'hidden by the layer or year filter' }).count(), 4);
    if (shots) await tab.screenshot({ path: `${shots}/s32-bom-only-1440x900.png` });
    log('check 3 passed (BoM-only: no navigation bypass)');
    await ctx.close();
  }

  if (from <= 4 && to >= 4) {
    // 4. Old Testament layer only: no view, no view copy anywhere in the codex
    ({ ctx, tab } = await open('#layers=ot', { width: 1440, height: 900 }));
    await tab.locator('#cxBtn').click({ noWaitAfter: true });
    await section(tab, 'bom-bible');
    assert.equal(await tab.locator('#cxBody .cx-item').count(), 0);
    assert.match(await bodyText(tab), /39 entries are hidden by the layer or year filter\./);
    await section(tab, 'ot-more');
    assert.ok(!/BMV-|quoted by Abinadi|in Lehi’s vision|Alma’s teaching/.test(await bodyText(tab)));
    log('check 4 passed (OT-only: no BoM copy or label)');
    await ctx.close();
  }

  if (from <= 5 && to >= 5) {
    // 5. downgrade while the codex is open: turning the Book of Mormon layer off removes every view at once
    ({ ctx, tab } = await open('#layers=ot,nt,bom', { width: 1440, height: 900 }));
    await tab.locator('#cxBtn').click({ noWaitAfter: true });
    await section(tab, 'bom-bible');
    assert.equal(await tab.locator('#cxBody .cx-item').count(), 39);
    await tab.evaluate(() => document.querySelector('#filters [data-layer="bom"]').click());
    await tab.waitForFunction(() => document.querySelectorAll('#cxBody .cx-item').length === 0);
    assert.match(await bodyText(tab), /39 entries are hidden by the layer or year filter\./);
    assert.ok(!/Lehi’s vision|quoted from Isaiah/.test(await bodyText(tab)));
    log('check 5 passed (layer downgrade with the codex open)');
    await ctx.close();
  }

  if (from <= 6 && to >= 6) {
    // 6. phone, touch: Alma 13's Melchizedek link reaches Hebrews 7
    ({ ctx, tab } = await open('', { width: 390, height: 844 }));
    await tab.locator('#cxBtn').tap({ noWaitAfter: true });
    await section(tab, 'bom-bible');
    const mz = item(tab, 'BMV-108-melchizedek-salem')
      .locator('.cx-ref', { hasText: 'Melchizedek, also in Hebrews 7' })
      .locator('.cx-see');
    await mz.scrollIntoViewIfNeeded();
    const box = await mz.boundingBox();
    assert.ok(box && box.height >= 24 && box.x + box.width <= 390, 'target size and fit');
    if (shots) await tab.screenshot({ path: `${shots}/s32-bmv108-390x844.png` });
    await mz.tap({ noWaitAfter: true });
    await focused(tab, 'NTC-priesthood');
    assert.equal(await tab.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth), true);
    log('check 6 passed (touch on phone)');
    await ctx.close();
  }

  assert.deepEqual(errors, []);
  console.log(`S32 probe passed: checks ${from}–${to}; no console errors, failed requests or HTTP errors.`);
} finally {
  await browser.close();
  server.kill();
}
