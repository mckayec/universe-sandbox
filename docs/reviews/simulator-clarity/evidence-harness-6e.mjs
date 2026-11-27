// SC6-K3 rendered evidence (6e). Real CDP touch input against a production build at 390x844 and 844x390:
// grown-up dialog clicks must be authorized by the click's own originating pointer. Each case records an event trace
// (pointer identity/type, target, click detail, and whether the click reached document-level handlers) captured by an
// init-script logger that is registered before the app's own window-capture gate.
// Usage (from a PR checkout after `pnpm install --frozen-lockfile && pnpm build`):
//   [CHROME_PATH=...] node <this file> <outDir> [port] [viewports, e.g. 390x844,844x390]
// One page per viewport; state is reset (dialog closed, Kids on, trace cleared) between cases.
// SwiftShader software GL, emulated viewports (not devices). One JSON line per case; exits 1 on any failed check.
import { spawn } from 'node:child_process';
import { mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { chromium } from 'playwright';

const [outDir = 'shots', portArg = '4199', vpArg = '390x844,844x390', onlyArg = ''] = process.argv.slice(2);
const only = onlyArg ? onlyArg.split(',') : null;
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

// Registered before any app script: window-capture listeners run in registration order, so this sees every event
// before the Kids gate; a document-capture listener (runs after window capture) records whether a click got through.
function installTrace() {
  const name = t => (t instanceof Element ? t.id || t.closest('[id]')?.id || t.tagName.toLowerCase() : String(t));
  window.__trace = [];
  for (const type of ['pointerdown', 'pointerup', 'pointercancel', 'click'])
    window.addEventListener(
      type,
      e => window.__trace.push({ phase: 'window', type, pointerId: e.pointerId, pointerType: e.pointerType, target: name(e.target), detail: e.detail }),
      { capture: true },
    );
  document.addEventListener(
    'click',
    e => window.__trace.push({ phase: 'reached-document', type: 'click', pointerId: e.pointerId, target: name(e.target) }),
    { capture: true },
  );
}

async function open(browser, viewport) {
  const context = await browser.newContext({ viewport, deviceScaleFactor: 1, hasTouch: true });
  const page = await context.newPage(),
    errors = [];
  await page.addInitScript(installTrace);
  page.on('pageerror', e => errors.push(String(e)));
  page.on('console', m => m.type() === 'error' && errors.push(m.text()));
  await page.goto(base);
  await page.waitForFunction(() => typeof window.__sandboxProbe === 'function');
  await sleep(800);
  await page.locator('#kids-mode').scrollIntoViewIfNeeded();
  await page.locator('#kids-mode').click();
  await page.locator('#kids-pause').click();
  await sleep(200);
  return { context, page, errors, cdp: await context.newCDPSession(page) };
}
const state = page =>
  page.evaluate(() => ({
    kidsMode: window.__sandboxProbe().kidsMode,
    dialogOpen: !document.querySelector('#kids-dialog').hidden,
  }));
const center = b => ({ x: Math.round(b.x + b.width / 2), y: Math.round(b.y + b.height / 2) });
const touch = (cdp, type, points) => cdp.send('Input.dispatchTouchEvent', { type, touchPoints: points });
async function openDialog(page) {
  await page.locator('#kids-grownups').click();
  await sleep(200);
}
async function closeDialogIfOpen(page) {
  if ((await state(page)).dialogOpen) await page.locator('#kids-exit-cancel').click();
  await sleep(150);
}
// Returns button centres and a dialog point that is not a button, plus a canvas point outside the dialog.
async function geometry(page, viewport) {
  await openDialog(page);
  const leave = center(await page.locator('#kids-exit-confirm').boundingBox()),
    stay = center(await page.locator('#kids-exit-cancel').boundingBox()),
    copy = center(await page.locator('.kids-dialog-copy').boundingBox()),
    d = await page.locator('#kids-dialog').boundingBox();
  // a canvas point that is still canvas while the dialog is open
  const canvas = await page.evaluate(vp => {
    for (const fy of [0.55, 0.6, 0.5, 0.65, 0.45, 0.7])
      for (const fx of [0.15, 0.85, 0.5]) {
        const p = { x: Math.round(vp.width * fx), y: Math.round(vp.height * fy) };
        if (document.elementFromPoint(p.x, p.y)?.tagName === 'CANVAS') return p;
      }
    return null;
  }, viewport);
  if (!canvas) throw new Error('no canvas point outside the open dialog');
  void d;
  await closeDialogIfOpen(page);
  return { leave, stay, copy, canvas };
}

async function reset(page) {
  await closeDialogIfOpen(page);
  if (!(await state(page)).kidsMode) {
    await page.locator('#kids-mode').scrollIntoViewIfNeeded();
    await page.locator('#kids-mode').click();
    await page.locator('#kids-pause').click();
  }
  await sleep(150);
  await page.evaluate(() => (window.__trace.length = 0));
}
async function runCase(env, tag, viewport, id, expect, body) {
  const { page, errors, cdp, g } = env;
  if (only && !only.includes(id)) return;
  await reset(page);
  const before = errors.length;
  await body({ page, cdp, g });
  await sleep(300);
  const s = await state(page),
    trace = await page.evaluate(() => window.__trace);
  const results = [];
  for (const [name, ok, value] of expect(s, trace)) {
    results.push({ name, ok: !!ok, value });
    if (!ok) failures++;
  }
  const errs = errors.slice(before);
  results.push({ name: 'no console/page errors', ok: errs.length === 0, value: errs });
  if (errs.length) failures++;
  if (['held-release', 'mixed-grant'].includes(id))
    await page.screenshot({ path: join(outDir, `6e-${id}-${tag}.jpg`), quality: 70 });
  log({ group: 'kids-dialog-6e', tag, viewport, case: id, state: s, trace, results });
}
const reached = (trace, target) => trace.some(t => t.phase === 'reached-document' && t.target === target);

async function cases(browser, tag, viewport) {
  const { context, page, errors, cdp } = await open(browser, viewport);
  const g = await geometry(page, viewport);
  const env = { page, errors, cdp, g };
  log({ group: 'kids-dialog-6e-geometry', tag, viewport, g, canvasTarget: await page.evaluate(p => document.elementFromPoint(p.x, p.y)?.tagName, g.canvas) });
  // 1. Held-release: touch 1 held on the spot where Leave will appear; a grown-up opens the dialog with the mouse;
  //    touch 1 releases over Leave. Must stay in Kids mode with the dialog open.
  await runCase(env, tag, viewport, 'held-release', (s, t) => [
    ['still Kids', s.kidsMode, s],
    ['dialog still open', s.dialogOpen, s],
    ['no click reached Leave', !reached(t, 'kids-exit-confirm'), null],
  ], async ({ page, cdp, g }) => {
    await touch(cdp, 'touchStart', [{ ...g.leave, id: 1 }]);
    await sleep(120);
    await openDialog(page);
    await touch(cdp, 'touchEnd', []);
  });
  // 2. Cross-pointer grant: touch 1 held at Leave's spot from before the dialog opened; touch 2 presses inside the
  //    open dialog (non-button copy); touch 1 releases, then touch 2. Touch 2 must not authorize touch 1.
  await runCase(env, tag, viewport, 'cross-grant', (s, t) => [
    ['still Kids', s.kidsMode, s],
    ['no click reached Leave', !reached(t, 'kids-exit-confirm'), null],
  ], async ({ page, cdp, g }) => {
    await touch(cdp, 'touchStart', [{ ...g.leave, id: 1 }]);
    await sleep(120);
    await openDialog(page);
    await touch(cdp, 'touchStart', [{ ...g.leave, id: 1 }, { ...g.copy, id: 2 }]);
    await sleep(80);
    await touch(cdp, 'touchEnd', [{ ...g.copy, id: 2 }]);
    await sleep(80);
    await touch(cdp, 'touchEnd', []);
  });
  // 3. Cross-pointer revoke: dialog open; touch 1 presses Stay; touch 2 presses the canvas; touch 1 releases.
  //    Touch 2 must not revoke touch 1. Chrome may suppress a click for a multi-touch sequence; if it emits one for
  //    touch 1 it must close the dialog. Recorded either way; the check is "no click blocked by the gate for touch 1".
  await runCase(env, tag, viewport, 'cross-revoke', (s, t) => {
    const clicks = t.filter(e => e.phase === 'window' && e.type === 'click' && e.target === 'kids-exit-cancel');
    const through = reached(t, 'kids-exit-cancel');
    return [
      ['still Kids', s.kidsMode, s],
      ['every Stay click from the dialog press reached its handler', clicks.length === 0 || through, { clicks: clicks.length, through }],
      ['dialog closed iff Stay click delivered', s.dialogOpen === !through, s],
    ];
  }, async ({ page, cdp, g }) => {
    await openDialog(page);
    await touch(cdp, 'touchStart', [{ ...g.stay, id: 1 }]);
    await sleep(60);
    await touch(cdp, 'touchStart', [{ ...g.stay, id: 1 }, { ...g.canvas, id: 2 }]);
    await sleep(60);
    await touch(cdp, 'touchEnd', [{ ...g.canvas, id: 2 }]);
    await sleep(60);
    await touch(cdp, 'touchEnd', []);
  });
  // 3b. Cross-pointer revoke, release order that lets Chrome emit the click: touch 2 (canvas) lifts first.
  await runCase(env, tag, viewport, 'cross-revoke-ordered', (s, t) => [
    ['still Kids', s.kidsMode, s],
    ['Stay click not blocked when emitted', !t.some(e => e.phase === 'window' && e.type === 'click' && e.target === 'kids-exit-cancel') || reached(t, 'kids-exit-cancel'), null],
  ], async ({ page, cdp, g }) => {
    await openDialog(page);
    await touch(cdp, 'touchStart', [{ ...g.canvas, id: 2 }]);
    await sleep(40);
    await touch(cdp, 'touchStart', [{ ...g.canvas, id: 2 }, { ...g.stay, id: 1 }]);
    await sleep(40);
    await touch(cdp, 'touchEnd', [{ ...g.stay, id: 1 }]);
    await sleep(40);
    await touch(cdp, 'touchEnd', []);
  });
  // 3c. Mixed pointers, cross-pointer GRANT (the browser emits the touch click): touch held at Leave's spot from
  //     before the dialog opened; the mouse opens the dialog, then presses and releases on the dialog copy; the touch
  //     releases over Leave. Under a latest-press boolean the mouse press would authorize the touch click.
  await runCase(env, tag, viewport, 'mixed-grant', (s, t) => [
    ['touch click on Leave was emitted by the browser', t.some(e => e.phase === 'window' && e.type === 'click' && e.pointerType === 'touch' && e.target === 'kids-exit-confirm'), null],
    ['still Kids', s.kidsMode, s],
    ['no click reached Leave', !reached(t, 'kids-exit-confirm'), null],
    ['dialog still open', s.dialogOpen, s],
  ], async ({ page, cdp, g }) => {
    await touch(cdp, 'touchStart', [{ ...g.leave, id: 1 }]);
    await sleep(120);
    await openDialog(page);
    await page.mouse.move(g.copy.x, g.copy.y);
    await page.mouse.down();
    await page.mouse.up();
    await sleep(80);
    await touch(cdp, 'touchEnd', []);
  });
  // 3d. Mixed pointers, cross-pointer REVOKE: the mouse presses Stay and holds; a touch presses the canvas and stays
  //     down; the mouse releases on Stay (Chrome emits its click); then the touch lifts. The touch press must not
  //     revoke the mouse's own authorization. (A completed touch tap before the mouse release makes Chrome drop the
  //     mouse click entirely via touch-compatibility mouse events, so the touch is held across the mouse release.)
  await runCase(env, tag, viewport, 'mixed-revoke', (s, t) => [
    ['touch press landed on the canvas', t.some(e => e.type === 'pointerdown' && e.pointerType === 'touch' && e.target === 'viewport'), null],
    ['mouse click on Stay emitted', t.some(e => e.phase === 'window' && e.type === 'click' && e.pointerType === 'mouse' && e.target === 'kids-exit-cancel'), null],
    ['mouse Stay click reached its handler', reached(t, 'kids-exit-cancel'), null],
    ['dialog closed, still Kids', !s.dialogOpen && s.kidsMode, s],
  ], async ({ page, cdp, g }) => {
    await openDialog(page);
    await page.mouse.move(g.stay.x, g.stay.y);
    await page.mouse.down();
    await sleep(60);
    await touch(cdp, 'touchStart', [{ ...g.canvas, id: 1 }]);
    await sleep(60);
    await page.mouse.up();
    await sleep(60);
    await touch(cdp, 'touchEnd', []);
  });
  // 4. Single-touch cancellation on Leave: no activation, and a fresh tap on Stay still works.
  await runCase(env, tag, viewport, 'cancel-then-stay', (s, t) => [
    ['still Kids', s.kidsMode, s],
    ['no click reached Leave', !reached(t, 'kids-exit-confirm'), null],
    ['fresh Stay tap closed the dialog', !s.dialogOpen && reached(t, 'kids-exit-cancel'), s],
  ], async ({ page, cdp, g }) => {
    await openDialog(page);
    await touch(cdp, 'touchStart', [{ ...g.leave, id: 1 }]);
    await sleep(60);
    await touch(cdp, 'touchCancel', []);
    await sleep(120);
    await page.touchscreen.tap(g.stay.x, g.stay.y);
  });
  // 5. Normal touch Stay, then normal touch Leave.
  await runCase(env, tag, viewport, 'touch-stay-leave', (s, t) => [
    ['Stay then Leave both delivered', reached(t, 'kids-exit-cancel') && reached(t, 'kids-exit-confirm'), null],
    ['left Kids mode', !s.kidsMode, s],
  ], async ({ page, g }) => {
    await openDialog(page);
    await page.touchscreen.tap(g.stay.x, g.stay.y);
    await sleep(200);
    await openDialog(page);
    await page.touchscreen.tap(g.leave.x, g.leave.y);
  });
  // 6. Keyboard activation of Leave (detail 0).
  await runCase(env, tag, viewport, 'keyboard-leave', (s, t) => [
    ['keyboard Leave delivered', reached(t, 'kids-exit-confirm'), null],
    ['left Kids mode', !s.kidsMode, s],
  ], async ({ page }) => {
    await openDialog(page);
    await page.locator('#kids-exit-confirm').focus();
    await page.keyboard.press('Enter');
  });
  // 7. Mouse Leave (pointer 1) still works.
  await runCase(env, tag, viewport, 'mouse-leave', (s, t) => [
    ['left Kids mode', !s.kidsMode, s],
  ], async ({ page }) => {
    await openDialog(page);
    await page.locator('#kids-exit-confirm').click();
  });
  await context.close();
}

try {
  await sleep(700);
  const browser = await chromium.launch({
    executablePath: process.env.CHROME_PATH || undefined,
    args: ['--use-gl=swiftshader', '--enable-webgl', '--ignore-gpu-blocklist'],
  });
  for (const vp of vpArg.split(',')) {
    const [width, height] = vp.split('x').map(Number);
    await cases(browser, vp, { width, height });
  }
  await browser.close();
} catch (e) {
  failures++;
  log({ fatal: String(e?.stack || e) });
} finally {
  server.kill();
}
log({ failures });
process.exit(failures ? 1 : 0);
