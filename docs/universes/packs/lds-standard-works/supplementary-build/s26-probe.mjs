// Checkpoint 26 probe: S25-C1 cross-account source-view links (Eden, Nod, Enoch’s city) and S25-V1 settled event frame.
// Usage (repo root, after `pnpm build`): node docs/universes/packs/lds-standard-works/supplementary-build/s26-probe.mjs
// Real keyboard/click/touch input. Writes PNGs to $SHOTS (optional). Exits non-zero on the first failed check.
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { existsSync, mkdirSync } from 'node:fs';
import { chromium } from 'playwright';

const port = 4178;
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
  // 1. all layers, desktop, keyboard: OT Eden links to the PGP Eden view, labelled; Enter navigates across tabs
  let { ctx, tab } = await open('', { width: 1440, height: 900 });
  log('desktop loaded');
  await tab.locator('#cxBtn').click({ noWaitAfter: true });
  await section(tab, 'ot-more');
  const eden = item(tab, 'OH-P01');
  await eden.scrollIntoViewIfNeeded();
  const ref = eden.locator('.cx-ref', { hasText: 'Garden in Eden' });
  assert.equal((await ref.locator('.cx-rel').textContent()).trim(), 'Eden in another account:');
  await ref.locator('.cx-see').focus();
  await tab.keyboard.press('Enter', { noWaitAfter: true });
  await tab.waitForFunction(() => document.activeElement?.closest('.cx-item')?.dataset.key === 'PP02');
  assert.equal(await tab.locator('#cxTabs [aria-pressed="true"]').getAttribute('data-tab'), 'unmapped-places');
  assert.ok((await item(tab, 'PP02').locator('.cx-see').allTextContents()).includes('Eden and its river system'));
  if (shots) await tab.screenshot({ path: `${shots}/s26-eden-link-1440x900.png` });
  log('check 1 passed (Eden link, keyboard navigation and focus)');

  // 2. click: the two keyed Enoch's city views link to each other and stay two cards
  const p17 = item(tab, 'P17-dc-enoch-city');
  await p17.scrollIntoViewIfNeeded();
  const r17 = p17.locator('.cx-ref');
  assert.equal(await r17.count(), 1);
  assert.equal((await r17.locator('.cx-rel').textContent()).trim(), 'Enoch’s city in another account:');
  await r17.locator('.cx-see').click({ noWaitAfter: true });
  await tab.waitForFunction(() => document.activeElement?.closest('.cx-item')?.dataset.key === 'P17-pgp-enoch-city');
  assert.equal(await tab.locator('#cxBody .cx-item', { hasText: 'Enoch’s city (Zion)' }).count(), 2);
  log('check 2 passed (P17 click navigation)');

  // 3. S25-V1: open a Chronicle event from a dossier link, then capture a settled frame
  await section(tab, 'dc-more');
  const dd = item(tab, 'DCM-dd109-dedication-prayer');
  await dd.scrollIntoViewIfNeeded();
  await dd.locator('[data-see-ev="kirtland-dedication"]').click({ noWaitAfter: true });
  await tab.waitForFunction(() => document.querySelector('#codex').hidden);
  await tab.waitForFunction(() => !!document.querySelector('#dossier [data-ev="kirtland-dedication"].open'), null, {
    timeout: 300000,
  });
  if (shots) await tab.screenshot({ path: `${shots}/s26-event-turning-1440x900.png` });
  await tab.waitForTimeout(45000);
  if (shots) await tab.screenshot({ path: `${shots}/s26-event-settled-1440x900.png` });
  log('check 3 captured (event frame during the turn and after 45 s)');
  await ctx.close();

  // 4. Old Testament layer only: the PGP Eden view is named as filtered, not linked
  ({ ctx, tab } = await open('#layers=ot', { width: 1440, height: 900 }));
  await tab.locator('#cxBtn').click({ noWaitAfter: true });
  await section(tab, 'ot-more');
  const e4 = item(tab, 'OH-P01');
  assert.equal(await e4.locator('.cx-see').count(), 0);
  assert.match(
    await e4.locator('.cx-also').textContent(),
    /Eden in another account: Garden in Eden \(hidden by the layer or year filter\)/,
  );
  log('check 4 passed (filtered target named, not linked)');
  await ctx.close();

  // 5. phone, touch: tap the Nod link
  ({ ctx, tab } = await open('', { width: 390, height: 844 }));
  await tab.locator('#cxBtn').tap({ noWaitAfter: true });
  await section(tab, 'ot-more');
  const nod = item(tab, 'OH-P02');
  const b5 = nod.locator('.cx-see', { hasText: 'Land of Nod' });
  await b5.scrollIntoViewIfNeeded();
  const box = await b5.boundingBox();
  assert.ok(box && box.height >= 24 && box.x + box.width <= 390, 'target size and fit');
  await b5.tap({ noWaitAfter: true });
  await tab.waitForFunction(() => document.activeElement?.closest('.cx-item')?.dataset.key === 'PP03');
  if (shots) await tab.screenshot({ path: `${shots}/s26-nod-390x844.png` });
  log('check 5 passed (touch on phone)');
  await ctx.close();

  assert.deepEqual(errors, []);
  console.log('Checkpoint 26 probe passed: 4 checks and one settled-frame capture, no console errors.');
} finally {
  await browser.close();
  server.kill();
}
