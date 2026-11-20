// Checkpoint 64 rendered captures: six RES96-C cards in the bom-bible codex tab (desktop viewport shots) and one phone
// viewport capture, with source-link, See-also and no-sideways-scroll checks.
// Usage (repo root, after `pnpm build`): SHOTS=dir node docs/universes/packs/lds-standard-works/supplementary-build/s64-card-captures.mjs
// Exits non-zero on the first failed check.
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { existsSync, mkdirSync } from 'node:fs';
import { chromium } from 'playwright';

const port = Number(process.env.PORT || 4181);
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
  const ctx = await browser.newContext({
    viewport: vp,
    deviceScaleFactor: vp.width < 600 ? 2 : 1,
    isMobile: vp.width < 600,
    hasTouch: vp.width < 600,
  });
  const tab = await ctx.newPage();
  tab.setDefaultTimeout(240000);
  tab.on('pageerror', e => errors.push(`pageerror: ${e.message}`));
  tab.on('response', r => {
    if (r.status() >= 400) errors.push(`http ${r.status()}: ${r.url()}`);
  });
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
const S = 'https://www.churchofjesuschrist.org/study/scriptures/';

// key -> [short file name, has See-also]
const CARDS = {
  'BMV-125-choose-whom-serve-scripture': ['c01-choose', true],
  'BMV-125-korihor-reported-appearance': ['c01-korihor', false],
  'BMV-063-departure-reckoning-early': ['c02-early', true],
  'BMV-175-departure-reckoning-later': ['c02-later', true],
  'BMV-163-names-and-prison-fire': ['c10-prison-fire', true],
  'BMV-008-lehi-dream-tree': ['c07-dream-tree', false],
};

try {
  let { ctx, tab } = await open('', { width: 1440, height: 900 });
  log('desktop loaded');
  await tab.locator('#cxBtn').click({ noWaitAfter: true });
  await section(tab, 'bom-bible');
  assert.equal(await tab.locator('#cxBody .cx-item').count(), 124);
  for (const [key, [name, see]] of Object.entries(CARDS)) {
    const v = item(tab, key);
    assert.equal(await v.count(), 1, `${key} missing`);
    // centre the card so the sticky codex header does not cover its title
    await v.evaluate(el => el.scrollIntoView({ block: 'center' }));
    await tab.waitForTimeout(300);
    const hrefs = await v.locator('.cx-src a').evaluateAll(as => as.map(a => a.href));
    assert.ok(hrefs.length >= 1, `${key} has no source link`);
    for (const h of hrefs) assert.ok(h.startsWith(S) && h.endsWith('?lang=eng'), `${key} source ${h}`);
    assert.equal((await v.locator('.cx-see').count()) > 0, see, `${key} See-also presence`);
    const srcText = (await v.locator('.cx-src a').allTextContents()).map(s => s.trim()).join('; ');
    const seeText = see ? (await v.locator('.cx-see').innerText()).replace(/\s+/g, ' ').trim() : '—';
    console.log(`${key}: sources [${srcText}] see-also [${seeText}]`);
    // viewport capture (the codex header is sticky, so an element crop would include it over the card)
    if (shots) await tab.screenshot({ path: `${shots}/s64-${name}-1440x900.png` });
  }
  log('desktop checks passed');
  await ctx.close();

  ({ ctx, tab } = await open('#layers=bom', { width: 390, height: 844 }));
  log('phone loaded');
  await tab.locator('#cxBtn').tap({ noWaitAfter: true });
  await section(tab, 'bom-bible');
  assert.equal(await tab.locator('#cxBody .cx-item').count(), 124);
  const v = item(tab, 'BMV-125-choose-whom-serve-scripture');
  await v.evaluate(el => el.scrollIntoView({ block: 'center' }));
  await tab.waitForTimeout(300);
  const sw = await tab.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  assert.ok(sw <= 0, `page scrolls sideways by ${sw}px`);
  if (shots) await tab.screenshot({ path: `${shots}/s64-c01-choose-phone-390x844.png` });
  log('phone checks passed');
  await ctx.close();
  if (errors.length) throw new Error(errors.join('\n'));
  console.log('s64 card captures: all checks passed');
} finally {
  await browser.close();
  server.kill();
}
