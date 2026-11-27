// Checkpoint 70: exact-head technical §4 evidence for PR33 (lds-standard-works).
// Usage: node s70-technical.mjs <repo-at-head> <out-dir> <viewport-name>
// Serves <repo>/dist under /universe-sandbox/, opens atlas/?pack=lds-standard-works, and records:
// third-party requests, page/console errors, back link, notice surfaces (text, size, clipping,
// colour contrast against the rendered background), heap across navigation cycles, and a screenshot.
import { createServer } from 'node:http';
import { createReadStream, existsSync, statSync, writeFileSync, mkdirSync } from 'node:fs';
import { join, normalize, extname } from 'node:path';
import { createRequire } from 'node:module';

const [repo, out, vpName] = process.argv.slice(2);
const require = createRequire(join(repo, 'package.json'));
const { chromium } = require('playwright');
const VPS = {
  '3840': { width: 3840, height: 2160 },
  '1440': { width: 1440, height: 900 },
  '1280': { width: 1280, height: 800 },
  '390': { width: 390, height: 844, isMobile: true, hasTouch: true },
};
const vp = VPS[vpName];
mkdirSync(out, { recursive: true });
const SUB = '/universe-sandbox/';
const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
  '.woff2': 'font/woff2',
  '.webmanifest': 'application/manifest+json',
};
const dist = join(repo, 'dist');
const server = createServer((req, res) => {
  const url = new URL(req.url, 'http://x');
  if (!url.pathname.startsWith(SUB)) return res.writeHead(404).end();
  let p = normalize(join(dist, decodeURIComponent(url.pathname.slice(SUB.length))));
  if (!p.startsWith(dist)) return res.writeHead(403).end();
  if (existsSync(p) && statSync(p).isDirectory()) p = join(p, 'index.html');
  if (!existsSync(p)) return res.writeHead(404).end();
  res.writeHead(200, { 'content-type': TYPES[extname(p)] || 'application/octet-stream' });
  createReadStream(p).pipe(res);
});
await new Promise(r => server.listen(0, '127.0.0.1', r));
const origin = `http://127.0.0.1:${server.address().port}`;

const browser = await chromium.launch({
  executablePath: process.env.CHROME_PATH && existsSync(process.env.CHROME_PATH) ? process.env.CHROME_PATH : undefined,
  args: ['--use-gl=swiftshader', '--enable-webgl', '--ignore-gpu-blocklist', '--enable-unsafe-swiftshader'],
});
const ctx = await browser.newContext({ viewport: { width: vp.width, height: vp.height }, isMobile: !!vp.isMobile, hasTouch: !!vp.hasTouch, deviceScaleFactor: 1 });
const page = await ctx.newPage();
const thirdParty = [];
const errors = [];
const NOISE = [/GL Driver Message/i, /GPU stall/i, /software WebGL/i];
page.on('request', r => {
  const u = r.url();
  if (!u.startsWith(origin) && !u.startsWith('data:') && !u.startsWith('blob:')) thirdParty.push(u);
});
page.on('pageerror', e => errors.push('pageerror: ' + e.message));
page.on('console', m => {
  if (m.type() === 'error' && !NOISE.some(rx => rx.test(m.text()))) errors.push('console: ' + m.text());
});
const rec = { viewport: vpName, head: process.env.HEAD_SHA || '' };
const t0 = Date.now();
await page.goto(`${origin}${SUB}atlas/?pack=lds-standard-works`);
await page.waitForSelector('#app .top', { timeout: 300000 });
await page.waitForTimeout(6000);
rec.readyMs = Date.now() - t0;
rec.backLink = await page.$eval('.top .gl-home', a => ({ href: a.getAttribute('href'), text: a.textContent.trim(), visible: a.getBoundingClientRect().width > 0 }));

// Notice surfaces: credits strip (desktop) and the narrow-width dossier notice (<=1180px).
rec.notice = await page.evaluate(() => {
  const lum = c => {
    const m = c.match(/[\d.]+/g).map(Number);
    const ch = m.slice(0, 3).map(v => {
      v /= 255;
      return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
    });
    return { L: 0.2126 * ch[0] + 0.7152 * ch[1] + 0.0722 * ch[2], a: m[3] ?? 1, rgb: m.slice(0, 3) };
  };
  // Effective background: first ancestor with a non-transparent background colour (alpha composited onto black page).
  const bgOf = el => {
    const stack = [];
    for (let e = el; e; e = e.parentElement) {
      const b = getComputedStyle(e).backgroundColor;
      const l = lum(b);
      if (l.a > 0) stack.push(l);
      if (l.a >= 1) break;
    }
    let rgb = [0, 0, 0];
    for (const l of stack.reverse()) rgb = rgb.map((v, i) => v * (1 - l.a) + l.rgb[i] * l.a);
    return rgb;
  };
  const rel = rgb => {
    const ch = rgb.map(v => {
      v /= 255;
      return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
    });
    return 0.2126 * ch[0] + 0.7152 * ch[1] + 0.0722 * ch[2];
  };
  const info = el => {
    if (!el) return null;
    const cs = getComputedStyle(el);
    const r = el.getBoundingClientRect();
    const fg = lum(cs.color);
    const bg = bgOf(el);
    const fgc = fg.rgb.map((v, i) => v * fg.a + bg[i] * (1 - fg.a));
    const a = rel(fgc), b = rel(bg);
    return {
      display: cs.display,
      w: Math.round(r.width),
      h: Math.round(r.height),
      font: cs.fontSize,
      color: cs.color,
      bg: 'rgb(' + bg.map(Math.round).join(',') + ')',
      contrast: +((Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05)).toFixed(2),
      clipped: el.scrollWidth > el.clientWidth + 1,
      text: el.textContent.trim().slice(0, 400),
    };
  };
  return { credits: info(document.querySelector('.credits')), narrow: info(document.querySelector('.srcnote.narrow-notice')) };
});
await page.screenshot({ path: join(out, `s70-${vpName}.jpg`), type: 'jpeg', quality: 80 });
if (vpName === '390') {
  const n = await page.$('.srcnote.narrow-notice');
  if (n) {
    await n.scrollIntoViewIfNeeded();
    await page.waitForTimeout(800);
    await page.screenshot({ path: join(out, `s70-390-notice.jpg`), type: 'jpeg', quality: 85 });
  }
}

// Heap across navigation: breadcrumb home -> back to Earth, 4 cycles (skipped at 4K for time).
if (vpName !== '3840') {
  const cdp = await ctx.newCDPSession(page);
  const heap = async () => {
    await cdp.send('HeapProfiler.collectGarbage');
    const m = await cdp.send('Performance.getMetrics');
    return Math.round(m.metrics.find(x => x.name === 'JSHeapUsedSize').value / 1048576);
  };
  await cdp.send('Performance.enable');
  rec.heapMB = [await heap()];
  for (let i = 0; i < 4; i++) {
    const ok = await page.evaluate(() => {
      const home = document.querySelector('#crumbs [data-c="gal"]');
      if (!home) return false;
      home.click();
      return true;
    });
    await page.waitForTimeout(2500);
    await page.evaluate(() => {
      const w = document.querySelector('#crumbs [data-c="world"]');
      if (w) w.click();
      return !!w;
    }).then(v => (rec.descendOk = v));
    await page.waitForTimeout(4000);
    rec.navOk = ok;
    rec.heapMB.push(await heap());
  }
}
rec.thirdParty = thirdParty;
rec.errors = errors;
writeFileSync(join(out, `s70-${vpName}.json`), JSON.stringify(rec, null, 2));
console.log(JSON.stringify(rec, null, 1));
await browser.close();
server.close();
