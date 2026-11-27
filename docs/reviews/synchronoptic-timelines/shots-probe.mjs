// Screenshots of the integrated head: Timeline dialog open (keyboard-opened), plus the atlas host behind it.
// usage: node shots-probe.mjs <dist dir> <out dir> <sha>
import { cpSync, mkdtempSync, readFileSync } from 'node:fs';
import { createServer } from 'node:http';
import { tmpdir } from 'node:os';
import { join, extname } from 'node:path';
import { createRequire } from 'node:module';
const require = createRequire(process.cwd() + '/package.json');
const { chromium } = require('playwright');
const [distDir, out, sha] = process.argv.slice(2);
const dir = mkdtempSync(join(tmpdir(), 'shots-'));
cpSync(distDir, dir, { recursive: true });
const TYPES = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json' };
const srv = await new Promise(res => {
  const s = createServer((q, a) => {
    let p = decodeURIComponent(q.url.split('?')[0]);
    if (p.endsWith('/')) p += 'index.html';
    try {
      a.writeHead(200, { 'content-type': TYPES[extname(p)] || 'application/octet-stream' });
      a.end(readFileSync(join(dir, p)));
    } catch {
      a.writeHead(404);
      a.end();
    }
  }).listen(0, () => res(s));
});
const base = `http://127.0.0.1:${srv.address().port}/atlas/?pack=abrahamic-world-religions`;
const browser = await chromium.launch({
  executablePath: process.env.CHROME_PATH || undefined,
  args: ['--use-gl=swiftshader', '--enable-webgl', '--ignore-gpu-blocklist'],
});
const sizes = (process.argv[5] || '1440x900,390x844,1280x800,3840x2160').split(',').map(x => x.split('x').map(Number));
for (const [w, h] of sizes) {
  const ctx = await browser.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: 1, serviceWorkers: 'block' });
  const page = await ctx.newPage();
  const errors = [];
  page.on('pageerror', e => errors.push(e.message));
  page.on('console', m => m.type() === 'error' && errors.push(m.text()));
  await page.goto(base);
  await page.waitForFunction(() => window.__atlas && document.querySelector('#tlBtn'), null, { polling: 500, timeout: 90000 });
  await page.waitForTimeout(5000);
  if (w <= 1440) await page.screenshot({ path: `${out}/atlas-${w}x${h}-${sha}.png` });
  await page.focus('#tlBtn');
  await page.keyboard.press('Enter');
  await page.waitForTimeout(2000);
  await page.screenshot({ path: `${out}/timeline-${w}x${h}-${sha}.png` });
  console.log(`${w}x${h} timeline open=${await page.evaluate(() => !document.querySelector('#timeline').hidden)} errors=${errors.length} ${errors.slice(0, 3).join(' | ')}`);
  await ctx.close();
}
await browser.close();
srv.close();
