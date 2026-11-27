// Item 6b (Kids mode) + SC6-O1 (overlay stack) rendered evidence.
// Usage (from a PR checkout after `pnpm install --frozen-lockfile && pnpm build`):
//   [CHROME_PATH=...] node <this file> <outDir> [port]
// Serves ./dist with `vite preview`, opens `?probe=1` in Chromium with SwiftShader (software GL, not a real GPU;
// emulated viewports, not devices). One JSON line per check group; exits 1 on any failed check.
// "200% text" is emulated as 200% browser zoom of the 1440x900 desktop (a 720x450 CSS-pixel viewport) plus the
// 320 CSS-pixel reflow width. A 390x844 phone at 200% zoom (195 CSS px) is reported separately, not asserted.
import { spawn } from 'node:child_process';
import { mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { chromium } from 'playwright';

const [outDir = 'shots', portArg = '4197'] = process.argv.slice(2);
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
let failures = 0;
const check = (results, name, ok, value) => {
  results.push({ name, ok: !!ok, value });
  if (!ok) failures++;
};
async function waitForServer() {
  for (let i = 0; i < 300; i++) {
    try {
      if ((await fetch(base)).ok) return;
    } catch {}
    await sleep(200);
  }
  throw new Error('preview server not ready');
}
const probe = page => page.evaluate(() => window.__sandboxProbe());
const visible = (page, sel) =>
  page.evaluate(s => {
    const el = document.querySelector(s);
    return !!el && !el.closest('[hidden]') && getComputedStyle(el).display !== 'none' && el.getClientRects().length > 0;
  }, sel);
const rect = (page, sel) =>
  page.evaluate(s => {
    const r = document.querySelector(s).getBoundingClientRect();
    return { x: r.x, y: r.y, w: r.width, h: r.height };
  }, sel);
const overlap = (a, b) => a.x < b.x + b.w && b.x < a.x + a.w && a.y < b.y + b.h && b.y < a.y + a.h;
/** The element actually hit at a control's centre: proves nothing overlays it for the pointer. */
const hitIs = (page, sel) =>
  page.evaluate(s => {
    const el = document.querySelector(s),
      r = el.getBoundingClientRect(),
      hit = document.elementFromPoint(r.x + r.width / 2, r.y + r.height / 2);
    return !!hit && (hit === el || el.contains(hit));
  }, sel);
async function clickToolbar(page, sel) {
  await page.locator(sel).scrollIntoViewIfNeeded();
  await page.locator(sel).click();
}
async function openExhibit(page, id) {
  await clickToolbar(page, '#exhibits-button');
  await page.locator(`[data-exhibit="${id}"]`).click();
  await sleep(700);
}
async function newPage(browser, viewport, extra = {}) {
  const context = await browser.newContext({ viewport, deviceScaleFactor: 1, ...extra });
  const page = await context.newPage(),
    errors = [];
  page.on('pageerror', e => errors.push(String(e)));
  page.on('console', m => m.type() === 'error' && errors.push(m.text()));
  await page.goto(base);
  await page.waitForFunction(() => typeof window.__sandboxProbe === 'function');
  await sleep(800);
  return { context, page, errors };
}
/** Marks the current timeline cards; a Restart rebuilds the timeline, so the marks disappear. */
const markTimeline = page =>
  page.evaluate(() => document.querySelectorAll('#event-items > *').forEach(el => (el.dataset.mark = '1')));
const reloaded = page =>
  page.evaluate(() => {
    const items = [...document.querySelectorAll('#event-items > *')];
    return (
      items.length > 0 &&
      !items.some(el => el.dataset.mark) &&
      items.some(el => el.querySelector('strong')?.textContent === 'Guided exhibit')
    );
  });

/** SC6-O1: guide card + science legend visible together never overlap; Restart / Exit work by pointer and key. */
async function overlayCase(browser, tag, viewport, exhibit) {
  const results = [],
    { context, page, errors } = await newPage(browser, viewport);
  await openExhibit(page, exhibit);
  while (!(await visible(page, '#science-legend'))) await clickToolbar(page, '#science-mode');
  const g = await rect(page, '#guide-card'),
    l = await rect(page, '#science-legend');
  check(results, 'guide and legend both visible', (await visible(page, '#guide-card')) && l.h > 0, { g, l });
  check(results, 'legend does not overlap guide card', !overlap(g, l), { g, l });
  const restart = await rect(page, '#guide-restart'),
    exit = await rect(page, '#guide-exit');
  check(results, 'buttons inside viewport', restart.y + restart.h <= viewport.height && exit.y >= 0, { restart, exit });
  check(results, 'Restart is the hit target at its centre', await hitIs(page, '#guide-restart'));
  check(results, 'Exit guide is the hit target at its centre', await hitIs(page, '#guide-exit'));
  await page.screenshot({ path: join(outDir, `o1-${exhibit}-${tag}.jpg`), quality: 70 });
  await markTimeline(page);
  await page.mouse.click(restart.x + restart.w / 2, restart.y + restart.h / 2);
  await sleep(500);
  check(results, 'pointer Restart reloads exhibit', await reloaded(page));
  await markTimeline(page);
  await page.locator('#guide-restart').focus();
  await page.keyboard.press('Enter');
  await sleep(500);
  check(results, 'keyboard Restart reloads exhibit', await reloaded(page));
  const e2 = await rect(page, '#guide-exit');
  await page.mouse.click(e2.x + e2.w / 2, e2.y + e2.h / 2);
  await sleep(200);
  check(results, 'pointer Exit guide hides guide', !(await visible(page, '#guide-card')));
  await openExhibit(page, exhibit);
  await page.locator('#guide-exit').focus();
  await page.keyboard.press('Enter');
  await sleep(200);
  check(results, 'keyboard Exit guide hides guide', !(await visible(page, '#guide-card')));
  check(results, 'no page errors', errors.length === 0, errors);
  log({ group: 'sc6-o1', tag, exhibit, viewport, results });
  await context.close();
}

async function kidsCase(browser, tag, viewport, touch) {
  const results = [],
    { context, page, errors } = await newPage(browser, viewport, touch ? { hasTouch: true } : {});
  const prefsBefore = await page.evaluate(() => JSON.stringify(Object.entries(localStorage).sort()));
  const feedbackLabel = await page.locator('#feedback-mode').textContent();
  await clickToolbar(page, '#kids-mode');
  await sleep(300);
  let s = await probe(page);
  check(results, 'kids mode on, explore (unarmed)', s.kidsMode && !s.kidsArmed && !s.placementMode, s);
  check(results, 'kids bar visible', await visible(page, '#kids-bar'));
  for (const sel of ['#tool-panel', '.universe-toolbar', '#exhibits-button', '.speed', '#zoom-in'])
    check(results, `${sel} hidden`, !(await visible(page, sel)));
  // Handler-level gating: programmatic activation of hidden adult controls does nothing.
  const count0 = s.bodies.length;
  await page.evaluate(() => {
    for (const id of ['clear', 'exhibits-button', 'universes-button', 'add-mode', 'feedback-mode', 'undo'])
      document.getElementById(id).click();
  });
  await sleep(200);
  s = await probe(page);
  check(results, 'gated clicks: no clear, no picker, no mode change', s.bodies.length === count0 && !s.placementMode, {
    count: s.bodies.length,
  });
  check(results, 'gated clicks: pickers stay closed', !(await visible(page, '#scenario-picker')));
  check(results, 'gated clicks: adult feedback label unchanged', (await page.locator('#feedback-mode').textContent()) === feedbackLabel);
  await page.locator('#kids-home').focus();
  for (const key of ['b', 'n', '0', 'f']) await page.keyboard.press(key);
  s = await probe(page);
  check(results, 'gated keys: b/n/0/f do not arm or change mode', !s.placementMode && !s.kidsArmed, s.placementMode);
  // Context menu on an object never opens change/remove.
  const target = s.bodies.find(b => b.kind !== 'debris') ?? s.bodies[0];
  await page.mouse.click(target.screen[0], target.screen[1], { button: 'right' });
  await sleep(200);
  check(results, 'right-click does not open object menu', !(await visible(page, '#object-menu')));
  // Pause / Play
  await page.locator('#kids-pause').click();
  s = await probe(page);
  check(results, 'Pause pauses', s.paused);
  await page.keyboard.press('Enter'); // focus stays on the Pause button
  s = await probe(page);
  check(results, 'keyboard Play resumes', !s.paused);
  await page.locator('#kids-pause').click();
  // Explore tap selects; drag pans without moving objects.
  s = await probe(page);
  const pick = s.bodies.find(b => b.kind !== 'debris') ?? s.bodies[0];
  if (touch) await page.touchscreen.tap(pick.screen[0], pick.screen[1]);
  else await page.mouse.click(pick.screen[0], pick.screen[1]);
  await sleep(200);
  s = await probe(page);
  check(results, 'tap selects an object', s.selectedId !== null, s.selectedId);
  const positions = JSON.stringify(s.bodies.map(b => b.position));
  const cx = viewport.width * 0.5,
    cy = viewport.height * 0.22;
  await page.mouse.move(cx, cy);
  await page.mouse.down();
  await page.mouse.move(cx + 60, cy + 30, { steps: 6 });
  await page.mouse.up();
  await sleep(150);
  s = await probe(page);
  check(results, 'explore drag moves no object (paused)', JSON.stringify(s.bodies.map(b => b.position)) === positions);
  check(results, 'explore drag adds nothing', s.bodies.length === count0, s.bodies.length);
  // Exactly one placement per armed Add.
  const tap = async (x, y) => (touch ? page.touchscreen.tap(x, y) : page.mouse.click(x, y));
  const empty = [viewport.width * 0.2, viewport.height * 0.25];
  await page.locator('#kids-add').click();
  s = await probe(page);
  check(results, 'Add arms', s.kidsArmed && (await page.locator('#kids-add').getAttribute('aria-pressed')) === 'true');
  await tap(...empty);
  await sleep(250);
  s = await probe(page);
  check(results, 'one tap places exactly one', s.bodies.length === count0 + 1 && !s.kidsArmed, s.bodies.length);
  await tap(empty[0] + 30, empty[1] + 20);
  await tap(empty[0] + 60, empty[1] + 10);
  await sleep(250);
  s = await probe(page);
  check(results, 'repeated taps place nothing more', s.bodies.length === count0 + 1, s.bodies.length);
  // Cancel: Add twice; Escape.
  await page.locator('#kids-add').click();
  await page.locator('#kids-add').click();
  await tap(...empty);
  await sleep(200);
  s = await probe(page);
  check(results, 'Add twice cancels', !s.kidsArmed && s.bodies.length === count0 + 1, s.bodies.length);
  await page.locator('#kids-add').click();
  await page.keyboard.press('Escape');
  s = await probe(page);
  check(results, 'Escape cancels armed Add', !s.kidsArmed && s.kidsMode);
  // Interruption (real CDP touch input): an armed touch that is cancelled, or turned into a two-finger gesture,
  // places nothing and stays armed.
  if (touch) {
    const cdp = await context.newCDPSession(page),
      [x, y] = empty;
    await page.locator('#kids-add').click();
    await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x, y, id: 1 }] });
    await cdp.send('Input.dispatchTouchEvent', { type: 'touchCancel', touchPoints: [] });
    await sleep(200);
    s = await probe(page);
    check(results, 'cancelled touch places nothing, stays armed', s.bodies.length === count0 + 1 && s.kidsArmed, s.bodies.length);
    await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x, y, id: 1 }] });
    await cdp.send('Input.dispatchTouchEvent', {
      type: 'touchStart',
      touchPoints: [{ x, y, id: 1 }, { x: x + 80, y: y + 40, id: 2 }],
    });
    await cdp.send('Input.dispatchTouchEvent', {
      type: 'touchMove',
      touchPoints: [{ x: x - 10, y, id: 1 }, { x: x + 100, y: y + 50, id: 2 }],
    });
    await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
    await sleep(250);
    s = await probe(page);
    check(results, 'two-finger interruption places nothing, stays armed', s.bodies.length === count0 + 1 && s.kidsArmed, s.bodies.length);
    await page.keyboard.press('Escape');
  }
  // Undo and Home.
  await page.locator('#kids-undo').click();
  await sleep(250);
  s = await probe(page);
  check(results, 'Undo removes the placement', s.bodies.length === count0, s.bodies.length);
  await page.locator('#kids-home').click();
  await sleep(300);
  s = await probe(page);
  check(results, 'Home keeps the scene', s.bodies.length === count0 && s.kidsMode, s.bodies.length);
  await page.screenshot({ path: join(outDir, `kids-${tag}.jpg`), quality: 70 });
  // Grown-up exit: dialog, Stay keeps Kids mode, Leave restores, preferences untouched.
  await page.locator('#kids-grownups').click();
  check(results, 'grown-up dialog opens', await visible(page, '#kids-dialog'));
  await page.screenshot({ path: join(outDir, `kids-dialog-${tag}.jpg`), quality: 70 });
  await page.keyboard.press('Escape');
  s = await probe(page);
  check(results, 'Escape closes dialog, still Kids', !(await visible(page, '#kids-dialog')) && s.kidsMode);
  await page.locator('#kids-grownups').click();
  await page.locator('#kids-exit-confirm').focus();
  await page.keyboard.press('Enter');
  await sleep(200);
  s = await probe(page);
  check(results, 'Leave restores adult mode', !s.kidsMode && !(await visible(page, '#kids-bar')), s.kidsMode);
  check(results, 'adult toolbar back', await visible(page, '.universe-toolbar'));
  check(results, 'adult Add mode restored', s.placementMode);
  check(results, 'redo history preserved', !(await page.locator('#redo').isDisabled()));
  check(results, 'adult feedback label unchanged', (await page.locator('#feedback-mode').textContent()) === feedbackLabel);
  const prefsAfter = await page.evaluate(() =>
    JSON.stringify(Object.entries(localStorage).filter(([k]) => !/recover|autosave|session/i.test(k)).sort()),
  );
  const prefsBeforeFiltered = JSON.stringify(
    JSON.parse(prefsBefore).filter(([k]) => !/recover|autosave|session/i.test(k)),
  );
  check(results, 'stored preferences unchanged', prefsAfter === prefsBeforeFiltered, { prefsBeforeFiltered, prefsAfter });
  check(results, 'no page errors', errors.length === 0, errors);
  log({ group: 'kids-6b', tag, viewport, touch, results });
  await context.close();
}

async function kidsQuery(browser) {
  const results = [],
    context = await browser.newContext({ viewport: { width: 390, height: 844 } }),
    page = await context.newPage();
  await page.goto(`${base}&kids=1`);
  await page.waitForFunction(() => typeof window.__sandboxProbe === 'function');
  await sleep(500);
  const s = await probe(page);
  check(results, '?kids=1 starts in Kids mode', s.kidsMode);
  check(results, 'kids buttons have accessible names', await page.evaluate(() =>
    [...document.querySelectorAll('#kids-bar button')].every(b => (b.getAttribute('aria-label') || b.textContent).trim()),
  ));
  log({ group: 'kids-query', results });
  await context.close();
}

try {
  await waitForServer();
  const browser = await chromium.launch({
    executablePath: process.env.CHROME_PATH || undefined,
    args: ['--use-gl=swiftshader', '--enable-webgl', '--ignore-gpu-blocklist'],
  });
  for (const exhibit of ['binary-stars', 'collision-lab']) {
    await overlayCase(browser, '390x844', { width: 390, height: 844 }, exhibit);
    await overlayCase(browser, '1440x900', { width: 1440, height: 900 }, exhibit);
    await overlayCase(browser, '844x390', { width: 844, height: 390 }, exhibit);
    await overlayCase(browser, 'zoom200-1440x900', { width: 720, height: 450 }, exhibit);
    await overlayCase(browser, 'reflow-320x568', { width: 320, height: 568 }, exhibit);
  }
  await kidsCase(browser, '390x844', { width: 390, height: 844 }, true);
  await kidsCase(browser, '1440x900', { width: 1440, height: 900 }, false);
  await kidsCase(browser, '844x390', { width: 844, height: 390 }, true);
  await kidsQuery(browser);
  await browser.close();
} catch (e) {
  failures++;
  log({ fatal: String(e?.stack || e) });
} finally {
  server.kill();
}
log({ failures });
process.exit(failures ? 1 : 0);
