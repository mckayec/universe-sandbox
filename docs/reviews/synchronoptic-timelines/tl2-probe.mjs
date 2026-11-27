// Timeline checkpoint 2 probe: browser Back/Forward. Opening the timeline pushes one history entry; Back closes it
// (focus returns to the Timeline button), Forward reopens it with the same selection; the close button and Escape step
// back over the entry, so repeated open/close does not grow history. Usage (repo root, after `pnpm build`):
//   SHOTS=docs/reviews/synchronoptic-timelines/shots node docs/reviews/synchronoptic-timelines/tl2-probe.mjs
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { existsSync, mkdirSync } from 'node:fs';
import { chromium } from 'playwright';

const port = 4183;
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
try {
  const { ctx, tab } = await open({ width: 1440, height: 900 });
  log('loaded 1440x900');
  const st = () => tab.evaluate(() => ({ len: history.length, hash: decodeURIComponent(location.hash), open: !document.querySelector('#timeline').hidden, focus: document.activeElement?.id || document.activeElement?.dataset?.tl || '' }));
  const until = (fn, arg) => tab.waitForFunction(fn, arg, { timeout: 120000 });
  const s0 = await st();
  assert.equal(s0.open, false);
  // open: one entry pushed, tl in the hash
  await tab.locator('#tlBtn').click();
  await tab.locator('#timeline .tl-svg').waitFor();
  const s1 = await st();
  assert.equal(s1.len, s0.len + 1, 'opening pushes one entry');
  assert.match(s1.hash, /(^|[#&])tl=1/);
  // select a mark: the selection replaces the entry (no extra push)
  await tab.locator('#timeline .tl-m').first().focus();
  await tab.keyboard.press('ArrowDown');
  await tab.keyboard.press('Enter');
  const sel = await tab.evaluate(() => document.activeElement?.dataset?.id);
  assert.ok(sel);
  const s2 = await st();
  assert.equal(s2.len, s1.len, 'selection does not push');
  assert.ok(s2.hash.includes('tlsel=' + sel), s2.hash);
  // Back closes it; focus returns to the Timeline button; hash has no tl
  await tab.goBack({ waitUntil: 'commit' });
  await until(() => document.querySelector('#timeline').hidden);
  const s3 = await st();
  assert.equal(s3.focus, 'tlBtn', 'focus returns to the Timeline button');
  assert.doesNotMatch(s3.hash, /(^|[#&])tl=/);
  log('check 1 passed (open pushes one entry; Back closes, focus restored)');
  // Forward reopens with the same selection
  await tab.goForward({ waitUntil: 'commit' });
  await until(() => !document.querySelector('#timeline').hidden);
  await until(id => document.activeElement?.dataset?.id === id, sel);
  assert.ok((await st()).hash.includes('tlsel=' + sel));
  await shot(tab, 'tl2-forward-restored-1440');
  log('check 2 passed (Forward reopens with the selection)');
  // close button steps back over the entry: history length unchanged, a later Back does not reopen
  await tab.locator('#timeline [data-tl="close"]').click();
  await until(() => document.querySelector('#timeline').hidden && !/[#&]tl=/.test(location.hash));
  const s4 = await st();
  assert.equal(s4.len, s1.len);
  // repeated open/close with Escape: history does not grow
  for (let i = 0; i < 3; i++) {
    await tab.locator('#tlBtn').click();
    await until(() => !document.querySelector('#timeline').hidden);
    await tab.keyboard.press('Escape');
    await until(() => document.querySelector('#timeline').hidden && !/[#&]tl=/.test(location.hash));
  }
  const s5 = await st();
  assert.equal(s5.len, s1.len, 'three open/Escape cycles leave history length unchanged');
  assert.equal(s5.focus, 'tlBtn');
  log('check 3 passed (close button and Escape step back; no history growth)');
  await ctx.close();
  // a shared link that opens the timeline directly: closing it does not navigate away from the atlas
  const r = await open({ width: 390, height: 844 }, '#tl=1');
  await r.tab.locator('#timeline .tl-svg').waitFor();
  const len0 = await r.tab.evaluate(() => history.length);
  await r.tab.locator('#timeline [data-tl="close"]').tap();
  await r.tab.waitForFunction(() => document.querySelector('#timeline').hidden && !/[#&]tl=/.test(location.hash));
  assert.equal(await r.tab.evaluate(() => history.length), len0);
  assert.match(r.tab.url(), /pack=abrahamic-world-religions/);
  log('check 4 passed (direct link at 390x844: close by tap stays on the atlas, replaces the URL)');
  await r.ctx.close();
  assert.deepEqual(errors, []);
  console.log('tl2 probe passed: 4 checks; no console errors, failed requests or HTTP errors.');
} finally {
  await browser.close();
  server.kill();
}
