// SC6-K1 / SC6-K2 rendered evidence (6d). Real CDP touch input against a production build: a held armed touch that
// is cancelled by Escape, the Add toggle, or the grown-up dialog (and a stale release after cancel-and-re-arm)
// places nothing; normal tap, pointercancel and second-finger controls are kept. Plus `?kids=1` complete startup state.
// Usage (from a PR checkout after `pnpm install --frozen-lockfile && pnpm build`):
//   [CHROME_PATH=...] node <this file> <outDir> [port]
// SwiftShader software GL, emulated viewports (not devices). One JSON line per group; exits 1 on any failed check.
import { spawn } from 'node:child_process';
import { mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { chromium } from 'playwright';

const [outDir = 'shots', portArg = '4198'] = process.argv.slice(2);
mkdirSync(outDir, { recursive: true });
const port = Number(portArg),
  base = `http://127.0.0.1:${port}/?probe=1`,
  server = spawn(
    process.execPath,
    ['node_modules/vite/bin/vite.js', 'preview', '--host', '127.0.0.1', '--port', String(port), '--strictPort'],
    { stdio: 'ignore' },
  ),
  sleep = ms => new Promise(r => setTimeout(r, ms)),
  log = row => console.log(JSON.stringify(row));
let failures = 0,
  current = null;
const check = (results, name, ok, value) => {
  current = results;
  results.push({ name, ok: !!ok, value });
  if (!ok) failures++;
};
const probe = page => page.evaluate(() => window.__sandboxProbe());
const ui = page =>
  page.evaluate(() => ({
    hint: document.querySelector('#hint').textContent,
    placing: document.querySelector('.placing') !== null,
    addPressed: document.querySelector('#kids-add').getAttribute('aria-pressed'),
    dialogOpen: !document.querySelector('#kids-dialog').hidden,
  }));
const EXPLORE_HINT = 'KIDS · TAP AN OBJECT TO SEE IT · DRAG TO LOOK AROUND';

async function open(browser, viewport, query = '') {
  const context = await browser.newContext({ viewport, deviceScaleFactor: 1, hasTouch: true });
  const page = await context.newPage(),
    errors = [];
  page.on('pageerror', e => errors.push(String(e)));
  page.on('console', m => m.type() === 'error' && errors.push(m.text()));
  await page.goto(base + query);
  await page.waitForFunction(() => typeof window.__sandboxProbe === 'function');
  await sleep(800);
  return { context, page, errors, cdp: await context.newCDPSession(page) };
}

async function cancelCase(browser, tag, viewport) {
  const results = [],
    { context, page, errors, cdp } = await open(browser, viewport);
  await page.locator('#kids-mode').scrollIntoViewIfNeeded();
  await page.locator('#kids-mode').click();
  await sleep(300);
  // Paused, so merges or escapes cannot change the body count between steps.
  await page.locator('#kids-pause').click();
  const [x, y] = [viewport.width * 0.2, viewport.height * 0.25];
  const down = () => cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x, y, id: 1 }] });
  const up = () => cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
  const count = async () => (await probe(page)).bodies.length;
  let n = await count(),
    s,
    u;
  // Control: a normal armed touch places exactly one.
  await page.locator('#kids-add').click();
  await down();
  await sleep(120);
  await up();
  await sleep(250);
  s = await probe(page);
  check(
    results,
    'control: normal armed tap places one, disarms',
    s.bodies.length === n + 1 && !s.kidsArmed,
    s.bodies.length,
  );
  n = s.bodies.length;
  // Escape while the touch is held.
  await page.locator('#kids-add').click();
  await down();
  await sleep(120);
  await page.keyboard.press('Escape');
  await up();
  await sleep(250);
  s = await probe(page);
  check(results, 'Escape during held touch: release places nothing', s.bodies.length === n, s.bodies.length);
  check(results, 'Escape during held touch: unarmed, still Kids', !s.kidsArmed && s.kidsMode && !s.placementMode);
  // Add toggle while the touch is held.
  await page.locator('#kids-add').click();
  await down();
  await sleep(120);
  await page.locator('#kids-add').click();
  await up();
  await sleep(250);
  s = await probe(page);
  check(
    results,
    'Add toggle during held touch: release places nothing',
    s.bodies.length === n && !s.kidsArmed,
    s.bodies.length,
  );
  // Grown-up dialog while the touch is held.
  await page.locator('#kids-add').click();
  await down();
  await sleep(120);
  await page.locator('#kids-grownups').click();
  await up();
  await sleep(250);
  s = await probe(page);
  u = await ui(page);
  check(
    results,
    'grown-up dialog during held touch: release places nothing',
    s.bodies.length === n && !s.kidsArmed && u.dialogOpen,
    s.bodies.length,
  );
  await page.screenshot({ path: join(outDir, `6d-dialog-held-${tag}.jpg`), quality: 70 });
  check(results, 'grown-up dialog during held touch: release does not tap Leave, still Kids', s.kidsMode, s.kidsMode);
  // A real tap that begins on a dialog button still works (touch).
  const stay = await page.locator('#kids-exit-cancel').boundingBox();
  await page.touchscreen.tap(stay.x + stay.width / 2, stay.y + stay.height / 2);
  await sleep(200);
  u = await ui(page);
  check(
    results,
    'touch tap on Stay closes dialog, still Kids',
    !u.dialogOpen && (await probe(page)).kidsMode,
    u.dialogOpen,
  );
  // Stale release after cancel-and-re-arm: the old gesture must not consume the new arm.
  await page.locator('#kids-add').click();
  await down();
  await sleep(120);
  await page.keyboard.press('Escape');
  await page.locator('#kids-add').click();
  await up();
  await sleep(250);
  s = await probe(page);
  check(
    results,
    'stale release after Escape + re-arm places nothing, stays armed',
    s.bodies.length === n && s.kidsArmed,
    s.bodies.length,
  );
  await page.touchscreen.tap(x + 40, y + 30);
  await sleep(250);
  s = await probe(page);
  check(results, 'next real tap after re-arm places one', s.bodies.length === n + 1 && !s.kidsArmed, s.bodies.length);
  n = s.bodies.length;
  // Retained controls: pointercancel and second finger leave the arm in place and place nothing.
  await page.locator('#kids-add').click();
  await down();
  await cdp.send('Input.dispatchTouchEvent', { type: 'touchCancel', touchPoints: [] });
  await sleep(200);
  s = await probe(page);
  check(results, 'pointercancel places nothing, stays armed', s.bodies.length === n && s.kidsArmed, s.bodies.length);
  await down();
  await cdp.send('Input.dispatchTouchEvent', {
    type: 'touchStart',
    touchPoints: [
      { x, y, id: 1 },
      { x: x + 80, y: y + 40, id: 2 },
    ],
  });
  await cdp.send('Input.dispatchTouchEvent', {
    type: 'touchMove',
    touchPoints: [
      { x: x - 10, y, id: 1 },
      { x: x + 100, y: y + 50, id: 2 },
    ],
  });
  await up();
  await sleep(250);
  s = await probe(page);
  check(results, 'second finger places nothing, stays armed', s.bodies.length === n && s.kidsArmed, s.bodies.length);
  await page.keyboard.press('Escape');
  await page.screenshot({ path: join(outDir, `6d-kids-${tag}.jpg`), quality: 70 });
  check(results, 'no console/page errors', errors.length === 0, errors);
  log({ group: 'kids-cancel-6d', tag, viewport, results });
  await context.close();
}

async function adultCase(browser) {
  const results = [],
    viewport = { width: 390, height: 844 },
    { context, page, errors, cdp } = await open(browser, viewport);
  const [x, y] = [viewport.width * 0.2, viewport.height * 0.25];
  await page.locator('#pause').scrollIntoViewIfNeeded();
  await page.locator('#pause').click();
  let n = (await probe(page)).bodies.length;
  await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x, y, id: 1 }] });
  await sleep(120);
  await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
  await sleep(250);
  let s = await probe(page);
  check(
    results,
    'adult Add: held touch places one on release',
    s.bodies.length === n + 1 && s.placementMode,
    s.bodies.length,
  );
  n = s.bodies.length;
  await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: x + 30, y, id: 1 }] });
  for (let i = 1; i <= 4; i++)
    await cdp.send('Input.dispatchTouchEvent', {
      type: 'touchMove',
      touchPoints: [{ x: x + 30 + i * 10, y: y + i * 6, id: 1 }],
    });
  await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
  await sleep(250);
  s = await probe(page);
  check(results, 'adult Add: touch drag places exactly one', s.bodies.length === n + 1, s.bodies.length);
  check(results, 'no console/page errors', errors.length === 0, errors);
  log({ group: 'adult-touch-6d', results });
  await context.close();
}

async function queryCase(browser, tag, viewport) {
  const results = [],
    { context, page, errors } = await open(browser, viewport, '&kids=1');
  const s = await probe(page),
    u = await ui(page);
  check(results, 'Kids on after complete startup', s.kidsMode, s.kidsMode);
  check(results, 'unarmed', !s.kidsArmed && u.addPressed === 'false', u.addPressed);
  check(results, 'placementMode false', s.placementMode === false, s.placementMode);
  check(results, 'Kids Explore hint', u.hint === EXPLORE_HINT, u.hint);
  check(results, 'no placing class', !u.placing, u.placing);
  const n = s.bodies.length;
  await page.touchscreen.tap(viewport.width * 0.2, viewport.height * 0.25);
  await sleep(250);
  check(results, 'unarmed tap places nothing', (await probe(page)).bodies.length === n);
  await page.screenshot({ path: join(outDir, `6d-query-${tag}.jpg`), quality: 70 });
  check(results, 'no console/page errors', errors.length === 0, errors);
  log({ group: 'kids-query-6d', tag, viewport, results });
  await context.close();
}

try {
  await sleep(700);
  const browser = await chromium.launch({
    executablePath: process.env.CHROME_PATH || undefined,
    args: ['--use-gl=swiftshader', '--enable-webgl', '--ignore-gpu-blocklist'],
  });
  await cancelCase(browser, '390x844', { width: 390, height: 844 });
  await cancelCase(browser, '844x390', { width: 844, height: 390 });
  await adultCase(browser);
  await queryCase(browser, '390x844', { width: 390, height: 844 });
  await queryCase(browser, '1440x900', { width: 1440, height: 900 });
  await browser.close();
} catch (e) {
  failures++;
  log({ fatal: String(e?.stack || e), partialResults: current });
} finally {
  server.kill();
}
log({ failures });
process.exit(failures ? 1 : 0);
