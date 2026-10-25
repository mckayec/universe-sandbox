// Browser smoke test of every standalone page, served the way GitHub Pages serves them: under a /universe-sandbox/
// subpath. Run after `pnpm build`: `node tests/standalone-pages.mjs`.
//
// For each page, at desktop (1440x900) and phone (390x844) sizes, it fails on:
//   - uncaught page errors and console errors (WebGL driver performance chatter is ignored);
//   - any same-origin response >= 400 (a missing file), except the browser's automatic /favicon.ico probe;
//   - any request to another host (no CDNs, fonts or trackers: the site must work offline and keep visitors private);
//   - a missing or wrongly targeted "← Gravity Lab" link;
//   - header buttons pushed past the right edge of the window (atlas packs at 1024/1280/1440).
// Env: CHROME_PATH to use a specific Chromium; SCREENSHOTS=dir to save a screenshot of each page.
import assert from 'node:assert/strict';
import { createReadStream, existsSync, mkdirSync, statSync } from 'node:fs';
import { cp, mkdtemp, rm } from 'node:fs/promises';
import { createServer } from 'node:http';
import { tmpdir } from 'node:os';
import { extname, join, normalize } from 'node:path';
import { chromium } from 'playwright';

const SUB = '/universe-sandbox/';
const dist = new URL('../dist/', import.meta.url).pathname;
if (!existsSync(join(dist, 'index.html'))) {
  console.error('standalone-pages: dist/ not found. Run `pnpm build` first.');
  process.exit(2);
}

const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json',
  '.webmanifest': 'application/manifest+json',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.woff2': 'font/woff2',
  '.txt': 'text/plain; charset=utf-8',
};

// Copy dist under a subpath folder, like the deployed site, and serve the parent folder.
const root = await mkdtemp(join(tmpdir(), 'gl-pages-'));
await cp(dist, join(root, SUB), { recursive: true });
const server = createServer((req, res) => {
  const url = new URL(req.url, 'http://x');
  let path = normalize(join(root, decodeURIComponent(url.pathname)));
  if (!path.startsWith(root)) {
    res.writeHead(403).end();
    return;
  }
  if (existsSync(path) && statSync(path).isDirectory()) path = join(path, 'index.html');
  if (!existsSync(path)) {
    res.writeHead(404).end('not found');
    return;
  }
  res.writeHead(200, { 'content-type': TYPES[extname(path)] || 'application/octet-stream' });
  createReadStream(path).pipe(res);
});
await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
const origin = `http://127.0.0.1:${server.address().port}`;
const base = origin + SUB;

const PACKS = ['sun-eater', 'hyperion', 'expanse', 'foundation', 'dune', 'cosmere'];
const PAGES = [
  { path: 'atlas/', ready: '#chooser', back: '#chooser .gl-home' },
  ...PACKS.map(id => ({
    path: `atlas/?pack=${id}`,
    ready: '#app .top',
    back: '.top .gl-home',
    header: true,
    wait: 2500,
  })),
  { path: 'atlas/?pack=nope', ready: '#chooser', back: '#chooser .gl-home' },
  { path: 'atlas/society.html', ready: '#app .top', back: '.top .gl-home', wait: 4000 },
  { path: 'atlas/solar.html', ready: '#app .top', back: '.top .gl-home', wait: 4000 },
  { path: 'powers/', ready: '#readout', back: '#readout .gl-home', wait: 3000 },
  { path: 'exoplanets/', ready: '#app .top', back: '.top .gl-home', wait: 3000 },
];
const VIEWPORTS = [
  { name: 'desktop', width: 1440, height: 900 },
  { name: 'mobile', width: 390, height: 844, isMobile: true, hasTouch: true, deviceScaleFactor: 2 },
];
// "Failed to load resource" carries no URL; the response handler reports every failed same-origin file with its URL.
const IGNORE_CONSOLE = [
  /GL Driver Message/i,
  /GPU stall due to ReadPixels/i,
  /Automatic fallback to software WebGL/i,
  /^Failed to load resource/i,
];
const shotsDir = process.env.SCREENSHOTS;
if (shotsDir) mkdirSync(shotsDir, { recursive: true });

const browser = await chromium.launch({
  headless: true,
  executablePath: process.env.CHROME_PATH && existsSync(process.env.CHROME_PATH) ? process.env.CHROME_PATH : undefined,
  args: ['--use-gl=swiftshader', '--enable-webgl', '--ignore-gpu-blocklist', '--enable-unsafe-swiftshader'],
});

const failures = [];
async function visit(page, vp) {
  const context = await browser.newContext({
    viewport: { width: vp.width, height: vp.height },
    isMobile: !!vp.isMobile,
    hasTouch: !!vp.hasTouch,
    deviceScaleFactor: vp.deviceScaleFactor || 1,
    serviceWorkers: 'block',
  });
  const tab = await context.newPage();
  const errs = [];
  const tag = `${page.path} @${vp.name}`;
  tab.on('pageerror', e => errs.push(`pageerror: ${e.message}`));
  tab.on('console', m => {
    if (m.type() === 'error' && !IGNORE_CONSOLE.some(re => re.test(m.text()))) errs.push(`console: ${m.text()}`);
  });
  tab.on('request', r => {
    const u = r.url();
    if (/^(data|blob|about|chrome-extension):/.test(u)) return;
    if (!u.startsWith(origin)) errs.push(`third-party request: ${u}`);
  });
  tab.on('response', r => {
    const u = r.url();
    if (u.startsWith(origin) && r.status() >= 400 && new URL(u).pathname !== '/favicon.ico')
      errs.push(`HTTP ${r.status()}: ${u.slice(origin.length)}`);
  });
  tab.on('requestfailed', r => {
    const u = r.url();
    if (u.startsWith(origin) && !/ERR_ABORTED/.test(r.failure()?.errorText || '')) errs.push(`request failed: ${u}`);
  });
  try {
    await tab.goto(base + page.path, { waitUntil: 'load', timeout: 90000 });
    await tab.waitForSelector(page.ready, { timeout: 60000 });
    await tab.waitForTimeout(page.wait || 1200);
    // back link: visible and resolving to the sandbox root under the subpath
    const href = await tab.$eval(page.back, a => a.href).catch(() => null);
    if (!href) errs.push(`no "← Gravity Lab" link (${page.back})`);
    else if (href !== base) errs.push(`back link goes to ${href}, expected ${base}`);
    const visible = await tab.isVisible(page.back).catch(() => false);
    if (!visible) errs.push('back link is not visible');
    // no notice overlay (three.js missing, WebGL lost) should be up
    if (await tab.$('.gl-notice')) errs.push('an error notice is showing');
    if (await tab.$('.atlas-fail')) errs.push('the atlas failure panel is showing');
    // no horizontal page scroll
    const sw = await tab.evaluate(() => document.documentElement.scrollWidth - innerWidth);
    if (sw > 1) errs.push(`page scrolls horizontally by ${sw}px`);
    if (shotsDir)
      await tab.screenshot({ path: join(shotsDir, `${page.path.replace(/[^\w-]+/g, '_')}-${vp.name}.png`) });
    // header must never be clipped at laptop widths
    if (page.header && vp.name === 'desktop') {
      for (const w of [1440, 1280, 1024]) {
        await tab.setViewportSize({ width: w, height: 800 });
        await tab.waitForTimeout(400);
        const clipped = await tab.evaluate(() =>
          [...document.querySelectorAll('.top button, .top a')]
            .filter(b => b.offsetParent !== null)
            .filter(b => {
              const r = b.getBoundingClientRect();
              return r.right > innerWidth + 0.5 || r.left < -0.5;
            })
            .map(b => b.textContent.trim() || b.id),
        );
        if (clipped.length) errs.push(`header clipped at ${w}px: ${clipped.join(', ')}`);
      }
    }
  } catch (e) {
    errs.push(`navigation: ${e.message.split('\n')[0]}`);
  }
  await context.close();
  if (errs.length) failures.push(`${tag}\n    ${errs.join('\n    ')}`);
  console.log(`${errs.length ? 'FAIL' : 'ok  '} ${tag}`);
}

try {
  for (const vp of VIEWPORTS) for (const page of PAGES) await visit(page, vp);
} finally {
  await browser.close();
  server.close();
  await rm(root, { recursive: true, force: true });
}

if (failures.length) {
  console.error(`\n${failures.length} page check(s) failed:\n  ${failures.join('\n  ')}`);
  process.exit(1);
}
assert.ok(true);
console.log(`Standalone pages passed under ${SUB}: ${PAGES.length} pages x ${VIEWPORTS.length} viewports.`);
