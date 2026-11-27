// Checkpoint 29: where is #tlBtn at 390x844 before/after a chapter-declaring book is chosen, and can it be scrolled to?
// Same fixture as real-chapter-path.mjs. Measurement only (DOM-level book click; no state assertions).
// usage: node header-reach-390.mjs <dist dir>
import { cpSync, mkdtempSync, readFileSync, appendFileSync } from 'node:fs';
import { createServer } from 'node:http';
import { tmpdir } from 'node:os';
import { join, extname } from 'node:path';
import { chromium } from 'playwright';
const [distDir] = process.argv.slice(2);
const ID = 'abrahamic-world-religions';
const dir = mkdtempSync(join(tmpdir(), 'tl29h-'));
cpSync(distDir, dir, { recursive: true });
appendFileSync(
  join(dir, `atlas/packs/${ID}.js`),
  `\n;(function(P){P.spoilers=Object.assign({},P.spoilers,{mode:'cumulative'});P.books={1:{n:'I',title:'Part one', chapters: 6},2:{n:'II',title:'Part two'}};})(window.ATLAS_PACKS['${ID}']);\n`,
);
const T = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.woff2': 'font/woff2',
  '.svg': 'image/svg+xml',
  '.jpg': 'image/jpeg',
};
const srv = await new Promise(res => {
  const s = createServer((q, a) => {
    let p = decodeURIComponent(q.url.split('?')[0]);
    if (p.endsWith('/')) p += 'index.html';
    try {
      const b = readFileSync(join(dir, p));
      a.writeHead(200, { 'content-type': T[extname(p)] || 'application/octet-stream' });
      a.end(b);
    } catch {
      a.writeHead(404);
      a.end();
    }
  }).listen(0, () => res(s));
});
const browser = await chromium.launch({
  executablePath: process.env.CHROME_PATH,
  args: ['--use-gl=swiftshader', '--enable-webgl', '--ignore-gpu-blocklist'],
});
const page = await (
  await browser.newContext({ viewport: { width: 390, height: 844 }, serviceWorkers: 'block' })
).newPage();
await page.goto(`http://127.0.0.1:${srv.address().port}/atlas/?pack=${ID}`);
await page.waitForFunction(() => !!document.querySelector('#tlBtn'), null, { timeout: 90000 });
await page.waitForTimeout(3000);
const m = () =>
  page.evaluate(() => {
    const b = document.querySelector('#tlBtn');
    const r = b.getBoundingClientRect();
    let sc = null;
    for (let e = b.parentElement; e; e = e.parentElement) {
      const cs = getComputedStyle(e);
      if (e.scrollWidth > e.clientWidth + 1 && /auto|scroll/.test(cs.overflowX)) {
        sc = {
          el: e.id || e.className,
          scrollWidth: e.scrollWidth,
          clientWidth: e.clientWidth,
          overflowX: cs.overflowX,
        };
        break;
      }
    }
    const row = b.parentElement;
    return {
      box: [r.x, r.y, r.width, r.height].map(Math.round),
      inViewport: r.right <= innerWidth && r.x >= 0,
      docScrollW: document.documentElement.scrollWidth,
      row: row.id || row.className,
      rowWrap: getComputedStyle(row).flexWrap,
      scroller: sc,
    };
  });
console.log('390 initial (All):', JSON.stringify(await m()));
await page.evaluate(() => document.querySelector('#books [data-b="1"]').click());
await page.waitForTimeout(1500);
console.log('390 book I (chapter selector shown):', JSON.stringify(await m()));
await page.evaluate(() => document.querySelector('#books [data-b="2"]').click());
await page.waitForTimeout(1500);
console.log('390 book II (no chapters):', JSON.stringify(await m()));
await browser.close();
srv.close();
