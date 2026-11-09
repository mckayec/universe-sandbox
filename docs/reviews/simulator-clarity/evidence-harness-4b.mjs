// Slice 4b enforced rendered evidence (SC4-E1): black-hole disk companion response, merger selection handoff.
// Usage (from a checkout of the PR head, after `pnpm install --frozen-lockfile && pnpm build`):
//   [CHROME_PATH=/path/to/chrome] node docs/reviews/simulator-clarity/evidence-harness-4b.mjs [outDir]
// Serves the production build with `vite preview`, drives Chromium with SwiftShader software GL (not a real GPU).
// Prints one JSON line per scenario with every assertion result; exits 1 if any assertion fails.
import { spawn } from 'node:child_process';
import { mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { chromium } from 'playwright';

const outDir = process.argv[2] || mkdtempSync(join(tmpdir(), 'sc4b-'));
const port = 4182;
const base = `http://127.0.0.1:${port}`;
const server = spawn(process.execPath, ['node_modules/vite/bin/vite.js', 'preview', '--host', '127.0.0.1', '--port', String(port)], { stdio: 'ignore' });
const sleep = ms => new Promise(r => setTimeout(r, ms));
const log = row => console.log(JSON.stringify(row));
let failures = 0;

async function waitForServer() {
  for (let i = 0; i < 300; i++) {
    try {
      if ((await fetch(base)).ok) return;
    } catch {}
    await sleep(200);
  }
  throw new Error('preview server not ready');
}

async function setTools(page, open) {
  const toggle = page.locator('#panel-toggle');
  if (!(await toggle.isVisible())) return;
  const expanded = (await toggle.getAttribute('aria-expanded')) === 'true';
  if (expanded !== open) await toggle.click();
}

async function place(page, x, y) {
  await setTools(page, true);
  await page.locator('[data-choice="blackhole"]').click();
  // Compact layouts cover the playfield with the tool sheet; collapse it before the placement click.
  if (page.viewportSize().width < 700) await setTools(page, false);
  await page.mouse.click(x, y);
}

const text = (page, sel) => page.locator(sel).textContent();
const count = async page => Number(await text(page, '#count'));
const cutOf = s => Number((/cut to (\d+)%/.exec(s ?? '') || [])[1] ?? NaN);

async function run(browser, viewport, gap, label, expectMerge) {
  const page = await browser.newPage({ viewport });
  page.setDefaultTimeout(15000);
  const errors = [];
  const glMessages = [];
  const checks = [];
  const check = (name, ok, detail) => {
    checks.push({ name, ok: !!ok, detail });
    if (!ok) failures++;
  };
  page.on('pageerror', e => errors.push(e.message));
  page.on('console', m => {
    if (m.type() === 'error') errors.push(m.text());
    if (/GL Driver Message \(OpenGL, Performance/.test(m.text())) return;
    if (/WebGL|shader|GL_|program/i.test(m.text())) glMessages.push(m.text());
  });
  const tag = `${label}-${viewport.width}x${viewport.height}`;
  await page.goto(base, { waitUntil: 'networkidle' });
  await page.waitForFunction(() => document.querySelector('#count')?.textContent === '4');
  await setTools(page, true);
  await page.locator('#clear').click();
  check('cleared to 0 bodies', (await count(page)) === 0, await count(page));
  await page.locator('#pause').click();
  const cx = viewport.width * 0.5,
    cy = viewport.height * 0.45;
  await place(page, cx - gap / 2, cy);
  await sleep(1500);
  const first = { count: await count(page), name: await text(page, '#info-name'), type: await text(page, '#info-type') };
  check('first black hole placed and selected', first.count === 1 && /black hole/i.test(first.type), first);
  const isolated = await text(page, '#info-disk');
  check('isolated disk undisturbed', isolated === 'Undisturbed', isolated);
  await place(page, cx + gap / 2, cy);
  await sleep(2500);
  const second = { count: await count(page), name: await text(page, '#info-name'), type: await text(page, '#info-type') };
  check('second black hole placed and selected', second.count === 2 && /black hole/i.test(second.type) && second.name !== first.name, second);
  const pairPaused = await text(page, '#info-disk');
  check('paired disk responds, names companion, labelled heuristic', /(Perturbed|Truncated|Strongly truncated) by .+heuristic estimate/.test(pairPaused) && pairPaused.includes(first.name), pairPaused);
  await page.screenshot({ path: join(outDir, `sc4b-${tag}-paused.jpg`), quality: 70 });
  await page.locator('#pause').click();
  await page.locator('[data-speed="10"]').click();
  check('10x selected', /active/.test((await page.locator('[data-speed="10"]').getAttribute('class')) ?? ''), null);
  await sleep(expectMerge ? 6000 : 3000);
  const after = {
    count: await count(page),
    name: await text(page, '#info-name'),
    panelEmpty: await page.locator('#info-panel').evaluate(el => el.classList.contains('empty')),
    disk: await text(page, '#info-disk'),
  };
  await page.screenshot({ path: join(outDir, `sc4b-${tag}-10x.jpg`), quality: 70 });
  if (expectMerge) {
    check('pair merged to one body', after.count === 1, after);
    check('selection handed to the surviving body (panel shown)', !after.panelEmpty && [first.name, second.name].includes(after.name), after);
    check('surviving disk undisturbed after merger', after.disk === 'Undisturbed', after.disk);
  } else {
    check('wide pair still two bodies', after.count === 2, after);
    check('wide pair still responds at 10x', /(Perturbed|Truncated|Strongly truncated) by /.test(after.disk), after.disk);
  }
  check('no page/console errors', errors.length === 0, errors);
  check('no shader/WebGL program messages', glMessages.length === 0, glMessages);
  log({ tag, gap, pairCut: cutOf(pairPaused), checks });
  await page.close();
  return cutOf(pairPaused);
}

try {
  await waitForServer();
  const browser = await chromium.launch({
    executablePath: process.env.CHROME_PATH || undefined,
    args: ['--use-gl=swiftshader', '--enable-webgl', '--ignore-gpu-blocklist'],
  });
  const close = await run(browser, { width: 1440, height: 900 }, 150, 'close', true);
  const wide = await run(browser, { width: 1440, height: 900 }, 700, 'wide', false);
  await run(browser, { width: 390, height: 844 }, 90, 'close', true);
  const ordered = close < wide;
  if (!ordered) failures++;
  log({ check: 'closer pair is cut deeper than wide pair', ok: ordered, close, wide });
  await browser.close();
  log({ outDir, failures });
} finally {
  server.kill();
}
process.exit(failures ? 1 : 0);
