// Interaction probe for codex See-also links (PACK_FORMAT 20.5) on the LDS atlas, against the built site.
// Usage (repo root, after `pnpm build`): node docs/universes/packs/lds-standard-works/supplementary-build/see-also-probe.mjs
// Checks, with keyboard and touch input rather than DOM-assisted selection:
//   1. all layers: FM04's See-also buttons name the three witnesses' identity cards; Enter on one switches the codex
//      section and focuses that card's heading; Escape closes the codex and returns focus to the Codex button.
//   2. Book of Mormon layer only (#layers=bom): FM04 names the D&C identity cards as hidden by the filter, with no link.
//   3. PGP layer only (#layers=pgp): the JS—History family view names its D&C targets as filtered, never linked.
//   4. phone (390x844, touch): tapping a See-also button from FM05 opens the Christian Whitmer card.
// Writes PNGs to $SHOTS (optional). Exits non-zero on the first failed check.
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { existsSync, mkdirSync } from 'node:fs';
import { chromium } from 'playwright';

const port = 4176;
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
  // 1. all layers, desktop, keyboard
  let { ctx, tab } = await open('', { width: 1440, height: 900 });
  log('desktop loaded');
  await tab.locator('#cxBtn').click({ noWaitAfter: true });
  await section(tab, 'reference-views');
  const fm04 = item(tab, 'FM04');
  assert.deepEqual(await fm04.locator('.cx-see').allTextContents(), ['Oliver Cowdery', 'David Whitmer', 'Martin Harris']);
  await fm04.locator('.cx-see', { hasText: 'Oliver Cowdery' }).focus();
  await tab.keyboard.press('Enter', { noWaitAfter: true });
  await tab.waitForFunction(() => document.activeElement?.closest('.cx-item')?.dataset.key === 'DCM-dcp-oliver-cowdery');
  assert.equal(await tab.locator('#cxTabs [aria-pressed="true"]').getAttribute('data-tab'), 'dc-more');
  const hub = item(tab, 'DCM-dcp-oliver-cowdery');
  assert.ok((await hub.locator('.cx-see').count()) === 8);
  assert.ok(await hub.isVisible());
  if (shots) await tab.screenshot({ path: `${shots}/s24-see-also-dc-1440x900.png` });
  await tab.keyboard.press('Escape', { noWaitAfter: true });
  assert.equal(await tab.locator('#codex').isHidden(), true);
  assert.equal(await tab.evaluate(() => document.activeElement?.id), 'cxBtn');
  log('check 1 passed (keyboard navigation, focus, Escape)');
  await ctx.close();

  // 2. Book of Mormon layer only
  ({ ctx, tab } = await open('#layers=bom', { width: 1440, height: 900 }));
  await tab.locator('#cxBtn').click({ noWaitAfter: true });
  await section(tab, 'reference-views');
  assert.equal(await item(tab, 'FM04').locator('.cx-see').count(), 0);
  assert.equal(await item(tab, 'FM04').locator('.cx-off').count(), 3);
  assert.match(await item(tab, 'FM04').locator('.cx-also').textContent(), /hidden by the layer or year filter/);
  log('check 2 passed (later-work targets named, not linked, under a BoM-only filter)');
  await ctx.close();

  // 3. PGP layer only
  ({ ctx, tab } = await open('#layers=pgp', { width: 1440, height: 900 }));
  await tab.locator('#cxBtn').click({ noWaitAfter: true });
  await section(tab, 'pgp-more');
  const fam = item(tab, 'PGM-jsh-family');
  assert.equal(await fam.locator('.cx-see').count(), 0);
  assert.equal(await fam.locator('.cx-off').count(), 4);
  if (shots) await tab.screenshot({ path: `${shots}/s24-see-also-pgp-filter-1440x900.png` });
  log('check 3 passed (PGP-only filter keeps D&C targets unlinked)');
  await ctx.close();

  // 4. phone, touch
  ({ ctx, tab } = await open('', { width: 390, height: 844 }));
  await tab.locator('#cxBtn').tap({ noWaitAfter: true });
  await section(tab, 'reference-views');
  const fm05 = item(tab, 'FM05');
  await fm05.locator('.cx-see', { hasText: 'Christian Whitmer' }).scrollIntoViewIfNeeded();
  const box = await fm05.locator('.cx-see', { hasText: 'Christian Whitmer' }).boundingBox();
  assert.ok(box && box.height >= 24, 'target height');
  await fm05.locator('.cx-see', { hasText: 'Christian Whitmer' }).tap({ noWaitAfter: true });
  await tab.waitForFunction(() => document.activeElement?.closest('.cx-item')?.dataset.key === 'fm-person-christian-whitmer');
  assert.equal(await tab.locator('#cxPick').inputValue(), 'bom-more');
  if (shots) await tab.screenshot({ path: `${shots}/s24-see-also-390x844.png` });
  log('check 4 passed (touch on phone)');
  await ctx.close();

  assert.deepEqual(errors, []);
  console.log('See-also probe passed: 4 checks, no console errors.');
} finally {
  await browser.close();
  server.kill();
}
