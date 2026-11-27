// SC1-E1 rendered evidence harness for the simulator-clarity slice 1 timing fix.
// Usage (from a checkout of the PR head, after `pnpm install --frozen-lockfile && pnpm build`):
//   [CHROME_PATH=/path/to/chrome] node docs/reviews/simulator-clarity/evidence-harness.mjs [outDir]
// Serves the production build with `vite preview`, drives Chromium with SwiftShader software GL (not a real GPU),
// and prints one JSON line per check. Screenshots go to outDir (default: a temp directory).
import { spawn } from 'node:child_process';
import { mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { chromium } from 'playwright';

const outDir = process.argv[2] || mkdtempSync(join(tmpdir(), 'sc1-'));
const port = 4179;
const base = `http://127.0.0.1:${port}`;
const server = spawn(
  process.execPath,
  ['node_modules/vite/bin/vite.js', 'preview', '--host', '127.0.0.1', '--port', String(port)],
  {
    stdio: 'ignore',
  },
);
const sleep = ms => new Promise(r => setTimeout(r, ms));
const log = row => console.log(JSON.stringify(row));

async function waitForServer() {
  for (let i = 0; i < 300; i++) {
    try {
      if ((await fetch(base)).ok) return;
    } catch {}
    await sleep(200);
  }
  throw new Error('preview server not ready');
}

async function setHidden(page, hidden) {
  await page.evaluate(h => {
    Object.defineProperty(document, 'visibilityState', { value: h ? 'hidden' : 'visible', configurable: true });
    Object.defineProperty(document, 'hidden', { value: h, configurable: true });
    document.dispatchEvent(new Event('visibilitychange'));
  }, hidden);
}

const badge = page => page.locator('#perf-badge').textContent();
const elapsed = page => page.locator('#elapsed').textContent();

async function run(browser, viewport) {
  const page = await browser.newPage({ viewport });
  const errors = [];
  const glMessages = [];
  let perfNotices = 0;
  page.on('pageerror', e => errors.push(e.message));
  page.on('console', m => {
    if (m.type() === 'error') errors.push(m.text());
    // SwiftShader 'Performance' driver notices (e.g. ReadPixels stalls) are not errors; record them separately.
    if (/GL Driver Message \(OpenGL, Performance/.test(m.text())) perfNotices++;
    else if (/WebGL|shader|GL_|program/i.test(m.text())) glMessages.push(m.text());
  });
  const tag = `${viewport.width}x${viewport.height}`;
  await page.goto(base, { waitUntil: 'networkidle' });
  await page.waitForFunction(() => document.querySelector('#count')?.textContent === '4');
  log({ tag, step: 'loaded', renderer: 'chromium headless + swiftshader', build: 'vite preview (production)' });

  // Place a black hole (user interaction path: palette choice, then click the playfield).
  const choice = page.locator('[data-choice="blackhole"]');
  if (await choice.isVisible()) {
    await choice.click();
    await page.mouse.click(viewport.width * 0.62, viewport.height * 0.42);
  }
  await sleep(2500);
  await page.screenshot({ path: join(outDir, `blackhole-${tag}.png`) });
  log({
    tag,
    step: 'black hole placed',
    placedByUi: await choice.isVisible(),
    count: await page.locator('#count').textContent(),
    badge: await badge(page),
  });

  // Pause: mission time must not advance; resume: it must.
  await page.locator('#pause').click();
  const p0 = await elapsed(page);
  await sleep(2000);
  const p1 = await elapsed(page);
  await page.locator('#pause').click();
  await sleep(2000);
  const p2 = await elapsed(page);
  log({
    tag,
    step: 'pause/resume',
    pausedFrom: p0,
    pausedTo: p1,
    frozen: p0 === p1,
    resumedTo: p2,
    advanced: p2 !== p1,
  });

  // Accelerated time (10x).
  await page.locator('[data-speed="10"]').click();
  const s0 = await elapsed(page);
  await sleep(3000);
  log({ tag, step: '10x', from: s0, to: await elapsed(page), badge: await badge(page), errorsSoFar: errors.length });
  await page.locator('[data-speed="1"]').click();

  // Slow foreground rendering: CPU throttling makes real frames long; the badge must fall, not stay fast.
  const cdp = await page.context().newCDPSession(page);
  const before = await badge(page);
  await cdp.send('Emulation.setCPUThrottlingRate', { rate: 20 });
  await sleep(6000);
  const throttled = await badge(page);
  await cdp.send('Emulation.setCPUThrottlingRate', { rate: 1 });
  await sleep(3000);
  log({ tag, step: 'cpu-throttle x20 (slow foreground)', before, throttled, recovered: await badge(page) });

  // Visibility reset: hide for 3 s, show; the hidden interval must not appear as one huge frame.
  await setHidden(page, true);
  await sleep(3000);
  await setHidden(page, false);
  const v = [];
  for (let i = 0; i < 4; i++) {
    await sleep(800);
    v.push(await badge(page));
  }
  log({ tag, step: 'hide 3s / show', badgeTrace: v, elapsedAfter: await elapsed(page) });

  log({ tag, step: 'console', errors, glMessages, swiftshaderPerformanceNotices: perfNotices });
  await page.close();
  return errors.length + glMessages.length;
}

let failures = 0;
let browser;
try {
  await waitForServer();
  browser = await chromium.launch({
    executablePath: process.env.CHROME_PATH || undefined,
    args: ['--use-gl=swiftshader', '--enable-webgl', '--ignore-gpu-blocklist'],
  });
  for (const viewport of [
    { width: 1440, height: 900 },
    { width: 390, height: 844 },
  ])
    failures += await run(browser, viewport);
  log({ step: 'done', outDir, consoleProblems: failures });
} finally {
  await browser?.close();
  server.kill();
}
process.exitCode = failures ? 1 : 0;
