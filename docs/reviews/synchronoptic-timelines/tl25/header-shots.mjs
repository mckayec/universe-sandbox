// Checkpoint 25: header screenshots of the chapter selector (timeline closed), 'chapters' fixture as chapter-probe.mjs.
// usage: node header-shots.mjs <dist dir>
import { cpSync, mkdtempSync, readFileSync, appendFileSync } from 'node:fs';
import { createServer } from 'node:http';
import { tmpdir } from 'node:os';
import { join, extname } from 'node:path';
import { chromium } from 'playwright';

const dir = mkdtempSync(join(tmpdir(), 'tl25s-'));
cpSync(process.argv[2], dir, { recursive: true });
appendFileSync(
  join(dir, 'atlas/packs/abrahamic-world-religions.js'),
  "\n;(function(P){P.spoilers=Object.assign({},P.spoilers,{mode:'cumulative'});" +
    "P.books={1:{n:'I',title:'Part one',chapters:6},2:{n:'II',title:'Part two'}};})(window.ATLAS_PACKS['abrahamic-world-religions']);\n",
);
const T = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.png': 'image/png', '.woff2': 'font/woff2' };
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
const browser = await chromium.launch({ executablePath: process.env.CHROME_PATH || undefined, args: ['--use-gl=swiftshader', '--enable-webgl', '--ignore-gpu-blocklist'] });
for (const [w, h] of [
  [1440, 900],
  [390, 844],
]) {
  const page = await browser.newPage({ viewport: { width: w, height: h } });
  await page.goto(`http://127.0.0.1:${srv.address().port}/atlas/?pack=abrahamic-world-religions#book=1&ch=3`);
  await page.waitForFunction(() => !!document.querySelector('#chapterSel'), null, { timeout: 90000 });
  await page.waitForTimeout(4000);
  const r = await page.evaluate(() => {
    const b = document.querySelector('header.top').getBoundingClientRect();
    const s = document.querySelector('#chapterSel').getBoundingClientRect();
    return { h: Math.ceil(Math.max(b.bottom, s.bottom) + 8), sel: [s.x, s.y, s.width, s.height].map(Math.round) };
  });
  console.log(w, 'selector rect', JSON.stringify(r.sel));
  await page.screenshot({ path: new URL(`./header-${w}.png`, import.meta.url).pathname, clip: { x: 0, y: 0, width: w, height: r.h } });
  await page.close();
}
await browser.close();
srv.close();
