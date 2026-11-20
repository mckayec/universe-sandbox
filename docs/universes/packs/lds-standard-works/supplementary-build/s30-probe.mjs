// Checkpoint 30 probe: DRE office appointment, succession and revision links (typed {k, r} See-also) on the LDS atlas.
// Usage (repo root, after `pnpm build`): node docs/universes/packs/lds-standard-works/supplementary-build/s30-probe.mjs
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

  // 1. desktop, keyboard: William Law's succession link reaches Hyrum Smith, whose card links back with both roles
  let { ctx, tab } = await open('', { width: 1440, height: 900 });
  log('desktop loaded');
  await tab.locator('#cxBtn').click({ noWaitAfter: true });
  await section(tab, 'dc-more');
  const law = item(tab, 'DCM-dcp-william-law');
  await law.scrollIntoViewIfNeeded();
  assert.deepEqual(await rels(tab, 'DCM-dcp-william-law'), ['counselor in the Presidency:', 'succeeds as counselor:']);
  await law.locator('.cx-ref', { hasText: 'Hyrum Smith' }).locator('.cx-see').focus();
  await tab.keyboard.press('Enter', { noWaitAfter: true });
  await focused(tab, 'DCM-dcp-hyrum-smith');
  const hy = await rels(tab, 'DCM-dcp-hyrum-smith');
  assert.ok(hy.includes('patriarch and seer:') && hy.includes('succeeded as counselor by:'), hy.join(' | '));
  if (shots) await tab.screenshot({ path: `${shots}/s30-dre-hyrum-1440x900.png` });
  log('check 1 passed (succession both ways, keyboard)');

  // 2. office card: eleven role links; click the president of the Twelve; revision link between section cards
  const tw = item(tab, 'DCM-dre124f-twelve');
  await tw.scrollIntoViewIfNeeded();
  const twr = await rels(tab, 'DCM-dre124f-twelve');
  assert.equal(twr.filter(r => r === 'member of the Twelve:').length, 10);
  assert.ok(twr.includes('earlier appointments to it:'));
  if (shots) await tab.screenshot({ path: `${shots}/s30-dre-twelve-1440x900.png` });
  await tw.locator('.cx-ref', { hasText: 'president of the Twelve' }).locator('.cx-see').click({ noWaitAfter: true });
  await focused(tab, 'DCM-dcp-brigham-young');
  const rv = item(tab, 'DCM-dre056-revisions').locator('.cx-ref', { hasText: 'revises the section 52 pairs' });
  await rv.scrollIntoViewIfNeeded();
  await rv.locator('.cx-see').click({ noWaitAfter: true });
  await focused(tab, 'DCM-dre052a-companion-pairs');
  log('check 2 passed (office roles, click, revision link)');
  await tab.keyboard.press('Escape');
  await tab.waitForFunction(() => document.querySelector('#codex').hidden && document.activeElement?.id === 'cxBtn');
  log('check 3 passed (Escape closes the codex, focus returns to the Codex button)');
  await ctx.close();

  // 4. phone, touch: the high council card names the deceased Seymour Brunson; tap reaches his card
  ({ ctx, tab } = await open('', { width: 390, height: 844 }));
  await tab.locator('#cxBtn').tap({ noWaitAfter: true });
  await section(tab, 'dc-more');
  const hc = item(tab, 'DCM-dre124g-high-council')
    .locator('.cx-ref', { hasText: 'replaced, deceased' })
    .locator('.cx-see');
  await hc.scrollIntoViewIfNeeded();
  const box = await hc.boundingBox();
  assert.ok(box && box.height >= 24 && box.x + box.width <= 390, 'target size and fit');
  await hc.tap({ noWaitAfter: true });
  await focused(tab, 'DCM-dcp-seymour-brunson');
  const br = await rels(tab, 'DCM-dcp-seymour-brunson');
  assert.ok(
    br.includes('succeeded in his calling by:') && br.includes('replaced on the high council:'),
    br.join(' | '),
  );
  if (shots) await tab.screenshot({ path: `${shots}/s30-dre-brunson-390x844.png` });
  log('check 4 passed (touch on phone)');
  await ctx.close();

  assert.deepEqual(errors, []);
  console.log('S30 probe passed: 4 checks; no console errors, failed requests or HTTP errors.');
} finally {
  await browser.close();
  server.kill();
}
