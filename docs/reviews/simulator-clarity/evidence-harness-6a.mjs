// Item 6a (compact labels, Details reset, quiet feedback) rendered evidence.
// Usage (from a PR checkout after `pnpm install --frozen-lockfile && pnpm build`):
//   [CHROME_PATH=...] node <this file> <outDir> [port]
// Serves ./dist with `vite preview`, opens `?probe=1`, runs the same scenario at 1440x900 and 390x844 in Chromium
// with SwiftShader (software GL, not a real GPU; emulated viewport, not a device). One JSON line per check group;
// exits 1 on any failed check.
import { spawn } from 'node:child_process';
import { mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { chromium } from 'playwright';

const [outDir = 'shots', portArg = '4196'] = process.argv.slice(2);
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
async function openExhibit(page, id) {
  await page.locator('#exhibits-button').click();
  await page.locator(`[data-exhibit="${id}"]`).click();
  await sleep(600);
}
/** Visible on-canvas labels: CSS2DRenderer sets display:none on invisible ones. */
const visibleLabels = page =>
  page.evaluate(() =>
    [...document.querySelectorAll('.object-label')]
      .filter(el => el.style.display !== 'none')
      .map(el => ({
        text: el.querySelector('strong').textContent,
        aria: el.getAttribute('aria-label'),
        metricsShown: getComputedStyle(el.querySelector('span')).display !== 'none',
      })),
  );
async function startToastLog(page) {
  await page.evaluate(() => {
    window.__toasts = [];
    new MutationObserver(() => window.__toasts.push(document.querySelector('#toast').textContent)).observe(
      document.querySelector('#toast'),
      { childList: true, characterData: true, subtree: true },
    );
  });
}
const takeToasts = page => page.evaluate(() => window.__toasts.splice(0));

async function run(browser, width, height) {
  const tag = `${width}x${height}`,
    compact = width <= 800,
    context = await browser.newContext({ viewport: { width, height } }),
    page = await context.newPage(),
    errors = [],
    results = [];
  page.on('pageerror', e => errors.push(String(e)));
  page.on('console', m => m.type() === 'error' && errors.push(m.text()));
  await page.goto(base);
  await page.evaluate(() => localStorage.clear());
  await page.reload();
  await page.waitForFunction(() => typeof window.__sandboxProbe === 'function');
  await sleep(800);

  // A: defaults.
  check(results, 'default banners on', (await page.locator('#feedback-mode').textContent()) === 'Banners: on');
  check(results, 'timeline live polite', (await page.locator('#event-feed').getAttribute('aria-live')) === 'polite');
  const idle = await visibleLabels(page);
  check(results, compact ? 'compact: no labels without selection' : 'desktop: labels shown', compact ? idle.length === 0 : idle.length > 0, idle.length);

  // B: selection labels.
  await openExhibit(page, 'binary-stars');
  const s1 = await probe(page),
    labels = await visibleLabels(page),
    selected = s1.bodies.find(b => b.id === s1.selectedId);
  check(results, 'exhibit selects an object', s1.selectedId !== null, s1.selectedId);
  if (compact) {
    check(results, 'compact: exactly one label (selected)', labels.length === 1 && labels[0].aria === selected?.name, labels);
    check(results, 'compact: label hides metrics', labels.length === 1 && !labels[0].metricsShown, labels);
  } else check(results, 'desktop: label metrics shown', labels.some(l => l.metricsShown), labels.length);
  check(results, 'labels carry full accessible names', labels.every(l => l.aria && l.aria.length >= l.text.replace('…', '').length));
  await page.screenshot({ path: join(outDir, `sc6a-labels-${tag}.jpg`), quality: 70, type: 'jpeg' });

  // C: Details resets on a fresh selection.
  // Desktop hides the sheet buttons (panel is always full); there the handler is invoked directly.
  if (await page.locator('#info-expand').isVisible()) await page.locator('#info-expand').click();
  else await page.locator('#info-expand').evaluate(el => el.click());
  check(results, 'Details opens', (await page.locator('#info-expand').getAttribute('aria-expanded')) === 'true');
  await openExhibit(page, 'feed-black-hole');
  const s2 = await probe(page),
    name1 = selected?.name,
    name2 = s2.bodies.find(b => b.id === s2.selectedId)?.name;
  // IDs restart when an exhibit rebuilds the scene, so compare the selected object's name.
  check(results, 'fresh selection is a different object', s2.selectedId !== null && name1 !== name2, [name1, name2]);
  check(
    results,
    'Details collapsed after fresh selection',
    (await page.locator('#info-expand').getAttribute('aria-expanded')) === 'false' &&
      !(await page.locator('#info-panel').evaluate(el => el.classList.contains('expanded'))),
  );

  // D: quiet mode.
  await page.locator('#feedback-mode').click();
  check(results, 'quiet label', (await page.locator('#feedback-mode').textContent()) === 'Banners: quiet');
  check(results, 'quiet aria-pressed', (await page.locator('#feedback-mode').getAttribute('aria-pressed')) === 'true');
  check(results, 'quiet timeline not live', (await page.locator('#event-feed').getAttribute('aria-live')) === 'off');
  await startToastLog(page);
  await openExhibit(page, 'collision-lab');
  const actionToasts = await takeToasts(page);
  check(results, 'quiet still shows action banner', actionToasts.includes('Guided exhibit'), actionToasts);
  const before = await page.locator('#event-items article').count();
  await page.locator('[data-speed="10"]').click();
  await takeToasts(page);
  await sleep(9000);
  const quietToasts = await takeToasts(page),
    after = await page.locator('#event-items article').count(),
    titles = await page.locator('#event-items article strong').allTextContents();
  check(results, 'quiet: no unsolicited banners while running 10x', quietToasts.length === 0, quietToasts);
  log({ tag, quietTimeline: { before, after, titles } });
  await page.screenshot({ path: join(outDir, `sc6a-quiet-${tag}.jpg`), quality: 70, type: 'jpeg' });

  // E: leaving quiet does not replay suppressed events.
  await page.locator('[data-speed="1"]').click();
  await page.locator('#pause').click();
  await takeToasts(page);
  await page.locator('#feedback-mode').click();
  await sleep(400);
  const exitToasts = await takeToasts(page);
  check(
    results,
    'exit quiet: only the mode confirmation, no replay',
    exitToasts.every(t => t === 'Event banners and sounds on'),
    exitToasts,
  );
  await page.locator('#feedback-mode').click();
  await page.reload();
  await page.waitForFunction(() => typeof window.__sandboxProbe === 'function');
  check(results, 'quiet preference persists across reload', (await page.locator('#feedback-mode').textContent()) === 'Banners: quiet');
  check(results, 'no page/console errors', errors.length === 0, errors.slice(0, 5));
  log({ tag, passed: results.filter(r => r.ok).length, total: results.length, results });
  await context.close();
}

try {
  await waitForServer();
  const browser = await chromium.launch({
    executablePath: process.env.CHROME_PATH || undefined,
    args: ['--use-gl=swiftshader', '--enable-webgl', '--ignore-gpu-blocklist'],
  });
  for (const [w, h] of [
    [1440, 900],
    [390, 844],
  ])
    await run(browser, w, h);
  await browser.close();
} finally {
  server.kill();
}
process.exit(failures ? 1 : 0);
