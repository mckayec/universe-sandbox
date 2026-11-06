// Interaction probe for typed codex See-also links (PACK_FORMAT 20.5 {k, r} and "ev:" targets) on the LDS atlas.
// Usage (repo root, after `pnpm build`): node docs/universes/packs/lds-standard-works/supplementary-build/typed-links-probe.mjs
// Real keyboard/click/touch input. Writes PNGs to $SHOTS (optional). Exits non-zero on the first failed check.
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { existsSync, mkdirSync } from 'node:fs';
import { chromium } from 'playwright';

const port = 4177;
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
  // 1. all layers, desktop, keyboard: a contained setting links to its city, labelled; Enter navigates
  let { ctx, tab } = await open('', { width: 1440, height: 900 });
  log('desktop loaded');
  await tab.locator('#cxBtn').click({ noWaitAfter: true });
  await section(tab, 'nt-more');
  const sil = item(tab, 'NTP-siloam');
  await sil.scrollIntoViewIfNeeded();
  const ref = sil.locator('.cx-ref', { hasText: 'Jerusalem in Samuel and Kings' });
  assert.equal((await ref.locator('.cx-rel').textContent()).trim(), 'within:');
  await ref.locator('.cx-see').focus();
  await tab.keyboard.press('Enter', { noWaitAfter: true });
  await tab.waitForFunction(() => document.activeElement?.closest('.cx-item')?.dataset.key === 'OTS-P08-jerusalem');
  assert.equal(await tab.locator('#cxTabs [aria-pressed="true"]').getAttribute('data-tab'), 'ot-more');
  const jer = item(tab, 'OTS-P08-jerusalem');
  const labels = (await jer.locator('.cx-rel').allTextContents()).map(s => s.trim());
  assert.deepEqual(labels.slice(0, 3), ['same city:', 'same city:', 'called Zion:']);
  assert.ok((await jer.locator('.cx-see').allTextContents()).includes('Siloam'));
  if (shots) await tab.screenshot({ path: `${shots}/s25-typed-links-ot-1440x900.png` });
  log('check 1 passed (labelled link, keyboard navigation and focus)');

  // 2. a dossier's "describes" link opens the Chronicle event and closes the codex
  await section(tab, 'dc-more');
  const dd = item(tab, 'DCM-dd109-dedication-prayer');
  await dd.scrollIntoViewIfNeeded();
  const evb = dd.locator('[data-see-ev="kirtland-dedication"]');
  assert.equal((await evb.textContent()).trim(), 'In the Chronicle: Kirtland dedication prayer');
  await evb.click({ noWaitAfter: true });
  await tab.waitForFunction(() => document.querySelector('#codex').hidden);
  await tab.waitForFunction(() => !!document.querySelector('#dossier [data-ev="kirtland-dedication"].open'), null, {
    timeout: 300000,
  });
  if (shots) await tab.screenshot({ path: `${shots}/s25-typed-links-event-1440x900.png` });
  log('check 2 passed (event link opens the Chronicle entry)');
  await ctx.close();

  // 3. New Testament layer only: the Old Testament city is named as filtered, not linked
  ({ ctx, tab } = await open('#layers=nt', { width: 1440, height: 900 }));
  await tab.locator('#cxBtn').click({ noWaitAfter: true });
  await section(tab, 'nt-more');
  const sil3 = item(tab, 'NTP-siloam');
  assert.equal(await sil3.locator('.cx-see').count(), 0);
  assert.match(await sil3.locator('.cx-also').textContent(), /within: Jerusalem in Samuel and Kings \(hidden by the layer or year filter\)/);
  log('check 3 passed (filtered typed target named, not linked)');
  await ctx.close();

  // 4. phone, touch: tap a labelled link
  ({ ctx, tab } = await open('', { width: 390, height: 844 }));
  await tab.locator('#cxBtn').tap({ noWaitAfter: true });
  await section(tab, 'nt-more');
  const dam = item(tab, 'NTP-damascus');
  const b4 = dam.locator('.cx-see', { hasText: 'Damascus (Kings)' });
  await b4.scrollIntoViewIfNeeded();
  const box = await b4.boundingBox();
  assert.ok(box && box.height >= 24 && box.x + box.width <= 390, 'target size and fit');
  await b4.tap({ noWaitAfter: true });
  await tab.waitForFunction(() => document.activeElement?.closest('.cx-item')?.dataset.key === 'OHP-DAMASCUS');
  if (shots) await tab.screenshot({ path: `${shots}/s25-typed-links-390x844.png` });
  log('check 4 passed (touch on phone)');
  await ctx.close();

  assert.deepEqual(errors, []);
  console.log('Typed-link probe passed: 4 checks, no console errors.');
} finally {
  await browser.close();
  server.kill();
}
