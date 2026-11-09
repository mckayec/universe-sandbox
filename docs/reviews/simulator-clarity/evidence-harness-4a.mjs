// Slice 4a rendered evidence: black-hole disk companion response (tidal truncation approximation).
// Usage (from a checkout of the PR head, after `pnpm install --frozen-lockfile && pnpm build`):
//   [CHROME_PATH=/path/to/chrome] node docs/reviews/simulator-clarity/evidence-harness-4a.mjs [outDir]
// Serves the production build with `vite preview`, drives Chromium with SwiftShader software GL (not a real GPU),
// prints one JSON line per check and writes screenshots to outDir.
import { spawn } from 'node:child_process';
import { mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { chromium } from 'playwright';

const outDir = process.argv[2] || mkdtempSync(join(tmpdir(), 'sc4a-'));
const port = 4181;
const base = `http://127.0.0.1:${port}`;
const server = spawn(process.execPath, ['node_modules/vite/bin/vite.js', 'preview', '--host', '127.0.0.1', '--port', String(port)], { stdio: 'ignore' });
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

async function openTools(page) {
  const toggle = page.locator('#panel-toggle');
  if ((await toggle.isVisible()) && (await toggle.getAttribute('aria-expanded')) === 'false') await toggle.click();
}

async function place(page, x, y) {
  await openTools(page);
  const choice = page.locator('[data-choice="blackhole"]');
  if (!(await choice.isVisible())) return false;
  await choice.click();
  // Compact layouts may cover the playfield with the tool sheet; collapse it before the placement click.
  const toggle = page.locator('#panel-toggle');
  if ((await toggle.isVisible()) && (await toggle.getAttribute('aria-expanded')) === 'true' && x < 400)
    await toggle.click();
  await page.mouse.click(x, y);
  return true;
}

const disk = page => page.locator('#info-disk').textContent();

async function run(browser, viewport, gap, label) {
  const page = await browser.newPage({ viewport });
  page.setDefaultTimeout(15000);
  const errors = [];
  const glMessages = [];
  page.on('pageerror', e => errors.push(e.message));
  page.on('console', m => {
    if (m.type() === 'error') errors.push(m.text());
    if (/GL Driver Message \(OpenGL, Performance/.test(m.text())) return;
    if (/WebGL|shader|GL_|program/i.test(m.text())) glMessages.push(m.text());
  });
  const tag = `${label}-${viewport.width}x${viewport.height}`;
  await page.goto(base, { waitUntil: 'networkidle' });
  await page.waitForFunction(() => document.querySelector('#count')?.textContent === '4');
  await openTools(page);
  await page.locator('#clear').click();
  await page.locator('#pause').click();
  const cx = viewport.width * 0.5,
    cy = viewport.height * 0.45;
  const a = await place(page, cx - gap / 2, cy);
  await sleep(1500);
  const isolated = await disk(page);
  const b = await place(page, cx + gap / 2, cy);
  await sleep(2500);
  const pairPaused = await disk(page);
  await page.screenshot({ path: join(outDir, `pair-${tag}.png`) });
  await page.locator('#pause').click();
  await page.locator('[data-speed="10"]').click().catch(() => {});
  await sleep(3000);
  const pairFast = await disk(page);
  await page.screenshot({ path: join(outDir, `pair-${tag}-10x.png`) });
  log({
    tag,
    placedByUi: [a, b],
    count: await page.locator('#count').textContent(),
    selected: await page.locator('#info-name').textContent(),
    isolated,
    pairPaused,
    pairFast,
    errors,
    glMessages,
  });
  await page.close();
}

try {
  await waitForServer();
  const browser = await chromium.launch({
    executablePath: process.env.CHROME_PATH || undefined,
    args: ['--use-gl=swiftshader', '--enable-webgl', '--ignore-gpu-blocklist'],
  });
  await run(browser, { width: 1440, height: 900 }, 150, 'close');
  await run(browser, { width: 1440, height: 900 }, 700, 'wide');
  await run(browser, { width: 390, height: 844 }, 90, 'close');
  await browser.close();
  log({ outDir });
} finally {
  server.kill();
}
