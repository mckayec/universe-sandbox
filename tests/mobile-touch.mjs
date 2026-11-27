// Touch regression checks for the compact (phone) layout, run in Chromium with touch emulation.
// Covers the accidental "Clear all" after a placing tap (B6), the Navigate focus instruction (M1),
// touch pan / pinch / cancelled gestures around the canvas touchend suppression, and desktop
// mouse double-click focus. Chromium emulation only: it does not stand in for iOS Safari or a real device.
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { existsSync } from 'node:fs';
import { chromium } from 'playwright';

const port = 4175;
const baseURL = `http://127.0.0.1:${port}`;
const server = spawn(
  process.execPath,
  ['node_modules/vite/bin/vite.js', 'preview', '--host', '127.0.0.1', '--port', String(port)],
  { cwd: process.cwd(), stdio: ['ignore', 'pipe', 'pipe'] },
);

async function waitForServer() {
  for (let attempt = 0; attempt < 450; attempt++) {
    try {
      const response = await fetch(baseURL);
      if (response.ok) return;
    } catch {}
    await new Promise(resolve => setTimeout(resolve, 200));
  }
  throw new Error('Preview server did not become ready');
}

const count = page => page.evaluate(() => Number(document.querySelector('#count').textContent));
const toastText = page => page.evaluate(() => document.querySelector('#toast').textContent);

/** Opens the app paused (so object counts are deterministic) and counts every click that reaches Clear all. */
async function openPaused(browser, viewport, touch) {
  const context = await browser.newContext({
    viewport,
    deviceScaleFactor: touch ? 2 : 1,
    isMobile: touch,
    hasTouch: touch,
  });
  const page = await context.newPage();
  const failures = [];
  page.on('pageerror', error => failures.push(`pageerror: ${error.message}`));
  page.on('console', message => {
    if (message.type() === 'error') failures.push(`console: ${message.text()}`);
  });
  await page.goto(baseURL, { waitUntil: 'networkidle' });
  await page.waitForFunction(() => document.querySelector('#count')?.textContent === '4');
  await page.evaluate(() => {
    window.__clearClicks = 0;
    document.querySelector('#clear').addEventListener('click', () => window.__clearClicks++, true);
  });
  if (touch) await page.tap('#pause');
  else await page.click('#pause');
  assert.equal(await page.locator('#pause').textContent(), 'Resume');
  return { context, page, failures };
}

async function assertCanvasAt(page, x, y, label) {
  const target = await page.evaluate(([px, py]) => document.elementFromPoint(px, py)?.tagName, [x, y]);
  assert.equal(target, 'CANVAS', `${label}: the tap point must be on the canvas, got ${target}`);
}

/** Drives a raw touch sequence through CDP (Playwright's touchscreen only taps). */
async function touch(cdp, type, points) {
  await cdp.send('Input.dispatchTouchEvent', {
    type,
    touchPoints: points.map(([x, y], id) => ({ x, y, id, radiusX: 4, radiusY: 4, force: 1 })),
  });
}
async function drag(cdp, from, to, steps = 8) {
  await touch(cdp, 'touchStart', [from]);
  for (let i = 1; i <= steps; i++)
    await touch(cdp, 'touchMove', [
      [from[0] + ((to[0] - from[0]) * i) / steps, from[1] + ((to[1] - from[1]) * i) / steps],
    ]);
  await touch(cdp, 'touchEnd', []);
}

/** B6: a placing tap must place while paused and never become a click on Clear all; Clear/Undo still work. */
// The tap point is calibrated to where Clear all sits once the selected-object sheet is open, so the
// test aims exactly at the hazard: canvas under the finger at touchstart, Clear all under it at click time.
async function placingTapNeverClears(browser, viewport, fixedPoint = null) {
  const label = `${viewport.width}x${viewport.height}`;
  const { context, page, failures } = await openPaused(browser, viewport, true);
  await page.tap('#panel-toggle'); // open tools (collapsed by default on compact layouts)
  await page.tap('[data-builder="binary"]');
  await page.tap('#panel-toggle');
  // Calibrate: select the star in Inspect, measure Clear all with the sheet open, then deselect.
  await page.tap('#inspect-mode');
  await page.touchscreen.tap(viewport.width / 2, Math.round(viewport.height / 2));
  await page.waitForTimeout(300);
  assert.equal(await page.locator('#info-name').textContent(), 'Helios 01', `${label}: calibration selects the star`);
  const clearBox = await page.locator('#clear').boundingBox();
  const tapPoint = fixedPoint ?? [
    Math.round(clearBox.x + clearBox.width / 2),
    Math.round(clearBox.y + clearBox.height / 2),
  ];
  await page.tap('#info-close');
  await page.tap('#add-mode');
  await page.waitForTimeout(300);
  assert.equal(await page.locator('#touch-hint').textContent(), 'Tap empty space to build two stars');
  await assertCanvasAt(page, ...tapPoint, label);
  const before = await count(page);
  await page.touchscreen.tap(...tapPoint);
  await page.waitForTimeout(600);
  assert.equal(await page.evaluate(() => window.__clearClicks), 0, `${label}: the placing tap reached Clear all`);
  assert.doesNotMatch(await toastText(page), /cleared/i, `${label}: simulation was cleared`);
  const placed = await count(page);
  assert.ok(placed > before, `${label}: placing tap should add objects (${before} -> ${placed})`);
  if (!fixedPoint) {
    // Proves the test aimed at the hazard: Clear all is now under the finger that placed the binary.
    const under = await page.evaluate(([x, y]) => document.elementFromPoint(x, y)?.id, tapPoint);
    assert.equal(under, 'clear', `${label}: after placing, Clear all should sit under the tap`);
  }
  // Explicit Clear all and Undo still work.
  await page.tap('#clear');
  await page.waitForTimeout(300);
  assert.equal(await count(page), 0, `${label}: explicit Clear all`);
  assert.equal(await page.evaluate(() => window.__clearClicks), 1);
  await page.tap('#undo');
  await page.waitForTimeout(500);
  assert.equal(await count(page), placed, `${label}: Undo restores the scene`);
  assert.deepEqual(failures, []);
  await context.close();
}

/** M1: follow the Navigate instruction, with no selection and with another object already selected. */
async function navigateFocusInstruction(browser) {
  const viewport = { width: 390, height: 844 };
  const { context, page, failures } = await openPaused(browser, viewport, true);
  const center = [viewport.width / 2, Math.round(viewport.height * 0.42)];
  const cdp = await context.newCDPSession(page);

  for (const preselect of [false, true]) {
    const label = preselect ? 'other object selected' : 'no selection';
    if (preselect) {
      // Place a planet away from the star; placing selects it.
      await page.tap('#panel-toggle');
      await page.tap('[data-choice="rocky"]');
      await page.tap('#panel-toggle');
      await page.tap('#add-mode');
      await page.touchscreen.tap(70, 200);
      await page.waitForTimeout(400);
      const other = await page.locator('#info-name').textContent();
      assert.notEqual(other, 'Helios 01', `${label}: setup should select the new planet`);
    }
    await page.tap('#navigate-mode');
    assert.equal(await page.locator('#navigate-mode').getAttribute('aria-pressed'), 'true');
    const hint = await page.locator('#touch-hint').textContent();
    assert.match(hint, /Inspect, tap an object, then Focus/, `${label}: hint must name the real sequence`);
    assert.doesNotMatch(hint, /^Drag to pan · pinch to zoom · tap an object/);

    // In Navigate, a drag across the star pans and must not select, place or clear anything.
    const selectedBefore = await page.locator('#info-name').textContent();
    const emptyBefore = await page.locator('#info-panel').evaluate(el => el.classList.contains('empty'));
    const objects = await count(page);
    await drag(cdp, [center[0] - 60, center[1]], [center[0] + 60, center[1] + 40]);
    await page.waitForTimeout(300);
    assert.equal(await count(page), objects, `${label}: pan changed the object count`);
    assert.equal(await page.locator('#info-name').textContent(), selectedBefore, `${label}: pan changed selection`);
    assert.equal(await page.locator('#info-panel').evaluate(el => el.classList.contains('empty')), emptyBefore);
    // Pan back so the star is under the tap point again.
    await drag(cdp, [center[0] + 60, center[1] + 40], [center[0] - 60, center[1]]);
    await page.waitForTimeout(300);

    // Follow the instruction: Inspect, tap the star, then Focus.
    await page.tap('#inspect-mode');
    await assertCanvasAt(page, ...center, label);
    await page.touchscreen.tap(...center);
    await page.waitForTimeout(300);
    assert.equal(await page.locator('#info-name').textContent(), 'Helios 01', `${label}: tap selects the star`);
    assert.equal(await page.locator('#zoom-selected').isEnabled(), true);
    await page.tap('#zoom-selected');
    await page.waitForTimeout(300);
    assert.equal(await page.locator('#frame-name').textContent(), 'HELIOS 01', `${label}: Focus targets the star`);
    await page.tap('#zoom-fit');
    await page.waitForTimeout(1200);
  }
  assert.equal(await page.evaluate(() => window.__clearClicks), 0);
  assert.deepEqual(failures, []);
  await context.close();
}

/** Pinch zooms, and a cancelled touch leaves no stuck drag or pan: the next tap still places. */
async function pinchAndCancel(browser) {
  const viewport = { width: 390, height: 844 };
  const { context, page, failures } = await openPaused(browser, viewport, true);
  const cdp = await context.newCDPSession(page);
  const [cx, cy] = [195, 360];
  await page.tap('#navigate-mode');
  const scaleBefore = await page.locator('#scale').textContent();
  await touch(cdp, 'touchStart', [
    [cx - 30, cy],
    [cx + 30, cy],
  ]);
  for (let i = 1; i <= 8; i++)
    await touch(cdp, 'touchMove', [
      [cx - 30 - i * 10, cy],
      [cx + 30 + i * 10, cy],
    ]);
  await touch(cdp, 'touchEnd', []);
  await page.waitForTimeout(500);
  assert.notEqual(await page.locator('#scale').textContent(), scaleBefore, 'pinch should change the scale');
  assert.equal(await count(page), 4, 'pinch changed the object count');

  await page.tap('#add-mode');
  // Stay under the 8 px slop: a longer drag in Add mode intentionally places and launches a body.
  await touch(cdp, 'touchStart', [[cx, cy]]);
  await touch(cdp, 'touchMove', [[cx + 3, cy + 3]]);
  await touch(cdp, 'touchCancel', []);
  await page.waitForTimeout(300);
  assert.equal(await count(page), 4, 'a cancelled touch must not place');
  await assertCanvasAt(page, 120, 300, 'after cancel');
  await page.touchscreen.tap(120, 300);
  await page.waitForTimeout(400);
  assert.equal(await count(page), 5, 'the next tap after a cancelled gesture should place');
  assert.equal(await page.evaluate(() => window.__clearClicks), 0);
  assert.deepEqual(failures, []);
  await context.close();
}

/** Desktop mouse double-click still focuses an object (the touchend suppression is touch-only). */
async function mouseDoubleClickFocus(browser) {
  const { context, page, failures } = await openPaused(browser, { width: 1440, height: 900 }, false);
  await page.click('#inspect-mode');
  await page.mouse.dblclick(720, 450);
  await page.waitForTimeout(300);
  assert.equal(await page.locator('#frame-name').textContent(), 'HELIOS 01');
  assert.match(await toastText(page), /Focused Helios 01/);
  assert.deepEqual(failures, []);
  await context.close();
}

let browser;
try {
  await waitForServer();
  const chromePath = [process.env.CHROME_PATH, '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'].find(
    candidate => candidate && existsSync(candidate),
  );
  browser = await chromium.launch({
    headless: true,
    executablePath: chromePath,
    args: ['--use-gl=swiftshader', '--enable-webgl', '--ignore-gpu-blocklist'],
  });
  // B6 (implementation.md §1) in portrait and landscape.
  await placingTapNeverClears(browser, { width: 390, height: 844 });
  // In the landscape-phone layout the sheet opens beside the dock, so Clear all no longer moves; keep the
  // baseline's exact landscape tap (j4.cjs) as a guard against the layout regressing.
  await placingTapNeverClears(browser, { width: 932, height: 430 }, [280, 150]);
  console.log('B6 ok');
  await navigateFocusInstruction(browser);
  console.log('M1 ok');
  await pinchAndCancel(browser);
  console.log('pinch ok');
  await mouseDoubleClickFocus(browser);
  console.log('mobile touch checks passed (Chromium touch emulation)');
} finally {
  await browser?.close();
  server.kill();
}
