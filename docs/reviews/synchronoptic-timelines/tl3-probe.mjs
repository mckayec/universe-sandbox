// Timeline checkpoint 3 probe: lane collapse/expand and reorder (keyboard, click, touch), URL state for the lane
// arrangement (tl = order, tlc = collapsed; restored from a shared link), era labels on their own row, and no console
// errors. Usage (repo root, after `pnpm build`):
//   SHOTS=docs/reviews/synchronoptic-timelines/shots node docs/reviews/synchronoptic-timelines/tl3-probe.mjs
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { existsSync, mkdirSync } from 'node:fs';
import { chromium } from 'playwright';

const port = 4184;
const base = `http://127.0.0.1:${port}/atlas/?pack=abrahamic-world-religions`;
const shots = process.env.SHOTS;
if (shots) mkdirSync(shots, { recursive: true });
const server = spawn(process.execPath, ['node_modules/vite/bin/vite.js', 'preview', '--host', '127.0.0.1', '--port', String(port), '--strictPort'], { stdio: 'ignore' });
for (let i = 0; i < 300; i++) {
  try { if ((await fetch(base)).ok) break; } catch {}
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
async function open(vp, hash = '') {
  const ctx = await browser.newContext({ viewport: vp, isMobile: vp.width < 600, hasTouch: vp.width < 600, reducedMotion: 'reduce' });
  const tab = await ctx.newPage();
  tab.setDefaultTimeout(300000);
  tab.on('pageerror', e => errors.push(`pageerror: ${e.message}`));
  tab.on('console', m => { if (m.type() === 'error' && !/GL Driver|GPU stall|software WebGL/i.test(m.text())) errors.push(m.text()); });
  tab.on('requestfailed', r => errors.push(`requestfailed: ${r.url()} ${r.failure()?.errorText}`));
  tab.on('response', r => { if (r.status() >= 400) errors.push(`${r.status()} ${r.url()}`); });
  await tab.goto(base + hash, { waitUntil: 'domcontentloaded' });
  await tab.waitForFunction(() => window.__atlas && document.querySelector('#splash.out'), null, { timeout: 300000 });
  return { ctx, tab };
}
const shot = (tab, name) => shots && tab.screenshot({ path: `${shots}/${name}.jpg`, type: 'jpeg', quality: 72 });
const lanesNow = tab => tab.evaluate(() => [...document.querySelectorAll('#timeline .tl-lt')].map(b => b.dataset.laneT + (b.getAttribute('aria-expanded') === 'false' ? '-' : '')));
const hashOf = tab => tab.evaluate(() => decodeURIComponent(location.hash));
let pass = 0;
try {
  // 1. 1440 keyboard: collapse the first lane, move the second lane up, check URL and focus
  {
    const { ctx, tab } = await open({ width: 1440, height: 900 });
    log('loaded 1440x900');
    await tab.locator('#tlBtn').click();
    await tab.locator('#timeline .tl-svg').waitFor();
    const l0 = await lanesNow(tab);
    assert.ok(l0.length >= 3, 'lane bar lists the lanes');
    const marks0 = await tab.locator('#timeline .tl-m').count();
    await tab.locator('#timeline .tl-lt').first().focus();
    await tab.keyboard.press('Enter');
    const l1 = await lanesNow(tab);
    assert.equal(l1[0], l0[0] + '-', 'first lane collapsed');
    assert.equal(await tab.evaluate(() => document.activeElement?.dataset?.laneT), l0[0], 'focus stays on the lane control');
    assert.ok((await tab.locator('#timeline .tl-m').count()) < marks0, 'collapsed lane draws no rows');
    assert.equal(await tab.locator('#timeline .tl-sum').count(), 1, 'one summary band');
    assert.match(await hashOf(tab), new RegExp('tlc=' + l0[0]));
    await shot(tab, 'tl3-1440-collapsed');
    await tab.locator(`#timeline [data-lane="${l0[1]}"][data-lane-mv="-1"]`).focus();
    await tab.keyboard.press('Enter');
    const l2 = await lanesNow(tab);
    assert.equal(l2[0], l0[1], 'second lane moved to the top');
    const h = await hashOf(tab);
    assert.match(h, new RegExp('tl=' + l0[1] + ',' + l0[0]));
    const firstSvgLane = await tab.locator('#timeline .tl-lane').first().textContent();
    assert.ok(firstSvgLane && !/collapsed/.test(firstSvgLane), 'chart follows the new order');
    // expand from the band itself (click)
    await tab.locator('#timeline .tl-sum .tl-sum-bar').click();
    assert.equal((await lanesNow(tab)).filter(x => x.endsWith('-')).length, 0, 'band click expands');
    await tab.locator('#timeline [data-lanes="reset"]').click();
    assert.deepEqual(await lanesNow(tab), l0, 'reset restores default order');
    assert.ok(!/tlc=/.test(await hashOf(tab)) && /tl=1/.test(await hashOf(tab)), 'reset clears lane params');
    // era label row does not overlap the tick labels
    const ov = await tab.evaluate(() => {
      const r = s => [...document.querySelectorAll('#timeline ' + s)].map(e => e.getBoundingClientRect());
      const era = r('.tl-era-t'), tk = r('.tl-tick-t');
      return era.some(a => tk.some(b => a.left < b.right && b.left < a.right && a.top < b.bottom && b.top < a.bottom));
    });
    assert.equal(ov, false, 'era labels clear of tick labels');
    await ctx.close();
    pass++;
    log('1440 keyboard/click pass');
  }
  // 2. shared link restores order and collapsed lanes; a stale id is dropped
  {
    const { ctx, tab } = await open({ width: 1440, height: 900 });
    await tab.locator('#tlBtn').click();
    await tab.locator('#timeline .tl-svg').waitFor();
    const ids = await lanesNow(tab);
    await ctx.close();
    const link = `#tl=${ids[2]},bogus&tlc=${ids[0]},bogus`;
    const r = await open({ width: 1440, height: 900 }, link);
    await r.tab.locator('#timeline .tl-svg').waitFor();
    const l = await lanesNow(r.tab);
    assert.equal(l[0], ids[2], 'order restored');
    assert.ok(l.includes(ids[0] + '-'), 'collapsed restored');
    assert.equal(l.length, ids.length, 'stale id dropped, no lane lost');
    await r.ctx.close();
    pass++;
    log('shared link pass');
  }
  // 3. 3840 chart (dense rows, era labels) and 390 touch
  {
    const { ctx, tab } = await open({ width: 3840, height: 2160 });
    await tab.locator('#tlBtn').click();
    await tab.locator('#timeline .tl-svg').waitFor();
    await shot(tab, 'tl3-3840-chart');
    await ctx.close();
    const m = await open({ width: 390, height: 844 });
    await m.tab.locator('#tlBtn').tap();
    await m.tab.locator('#timeline .tl-svg').waitFor();
    const b = m.tab.locator('#timeline .tl-lt').nth(1);
    const box = await b.boundingBox();
    assert.ok(box && box.height >= 44, 'lane toggle is a 44px target');
    await b.tap();
    assert.ok((await lanesNow(m.tab))[1].endsWith('-'), 'tap collapses');
    const sw = await m.tab.evaluate(() => document.documentElement.scrollWidth <= innerWidth);
    assert.ok(sw, 'no horizontal page scroll');
    await shot(m.tab, 'tl3-390-collapsed');
    await m.ctx.close();
    pass++;
    log('3840 + 390 touch pass');
  }
  assert.deepEqual(errors, []);
  pass++;
  console.log(`tl3 probe: ${pass}/4 passed; console errors, requestfailed, HTTP>=400: ${errors.length}`);
} catch (e) {
  console.error('FAIL', e.message, errors);
  process.exitCode = 1;
} finally {
  await browser.close();
  server.kill();
}
