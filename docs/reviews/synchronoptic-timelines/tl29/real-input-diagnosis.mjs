// TL22-E2 diagnosis (checkpoint 29): why does a real Playwright click on #tlBtn time out at 1440 and not at 390?
// Harness as tl23/host-layer-probe.mjs (temp copy of dist + PR33 pack + registry line; nothing written to the repo).
// Per width: frame cadence, hit test at the button centre, Playwright's own actionability call log for page.click,
// then real CDP pointer input (page.mouse.click at the centre, no actionability wait) and real keyboard input.
// usage: node diag.mjs <lds-standard-works.js> <dist dir> <label>
import { cpSync, mkdtempSync, readFileSync, writeFileSync } from 'node:fs';
import { createServer } from 'node:http';
import { tmpdir } from 'node:os';
import { join, extname } from 'node:path';
import { chromium } from 'playwright';
const [packPath, distDir, label] = process.argv.slice(2);
const dir = mkdtempSync(join(tmpdir(), 'tl29-'));
cpSync(distDir, dir, { recursive: true });
writeFileSync(join(dir, 'atlas/packs/lds-standard-works.js'), readFileSync(packPath));
const reg = join(dir, 'atlas/packs/registry.js');
writeFileSync(
  reg,
  readFileSync(reg, 'utf8').replace(
    /\n\];\s*$/,
    ',\n  {id: "lds-standard-works", title: "Standard Works", blurb: "probe", accent: "#e4cf9a"}\n];\n',
  ),
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
const base = `http://127.0.0.1:${srv.address().port}/atlas/?pack=lds-standard-works`;
const browser = await chromium.launch({
  executablePath: process.env.CHROME_PATH,
  args: ['--use-gl=swiftshader', '--enable-webgl', '--ignore-gpu-blocklist'],
});
const out = (k, v) => console.log(`${label} ${k}: ${typeof v === 'string' ? v : JSON.stringify(v)}`);
for (const [w, h] of [
  [1440, 900],
  [390, 844],
]) {
  const tag = `${w}`;
  const ctx = await browser.newContext({ viewport: { width: w, height: h } });
  const page = await ctx.newPage();
  const errs = [];
  page.on('pageerror', e => errs.push(String(e)));
  await page.goto(base);
  await page.waitForFunction(() => !!document.querySelector('#tlBtn'), null, { timeout: 90000 });
  await page.waitForTimeout(3500);
  // frame cadence: rAF callbacks in 3 s, and the longest gap
  const fr = await page.evaluate(
    () =>
      new Promise(r => {
        let n = 0,
          last = performance.now(),
          max = 0;
        const t0 = last;
        const f = t => {
          n++;
          max = Math.max(max, t - last);
          last = t;
          if (t - t0 < 3000) requestAnimationFrame(f);
          else r({ frames: n, maxGapMs: Math.round(max), meanMs: Math.round((t - t0) / n) });
        };
        requestAnimationFrame(f);
      }),
  );
  out(`${tag} frame cadence`, fr);
  const hit = await page.evaluate(() => {
    const b = document.querySelector('#tlBtn');
    const r = b.getBoundingClientRect();
    const e = document.elementFromPoint(r.x + r.width / 2, r.y + r.height / 2);
    return {
      box: [Math.round(r.x), Math.round(r.y), Math.round(r.width), Math.round(r.height)],
      top: e && (e.id ? '#' + e.id : e.tagName + '.' + e.className),
      isBtn: e === b,
      visible: !b.hidden && r.width > 0,
    };
  });
  out(`${tag} hit test`, hit);
  // is the button's box actually changing between frames? (Playwright "stable" = same box on consecutive frames)
  const stab = await page.evaluate(
    () =>
      new Promise(r => {
        const b = document.querySelector('#tlBtn');
        const boxes = [];
        const f = () => {
          const q = b.getBoundingClientRect();
          boxes.push([q.x, q.y, q.width, q.height].join(','));
          if (boxes.length < 6) requestAnimationFrame(f);
          else r({ samples: boxes.length, distinct: new Set(boxes).size });
        };
        requestAnimationFrame(f);
      }),
  );
  out(`${tag} button box over 6 frames`, stab);
  // 1) Playwright actionability click: keep the whole call log
  let t0 = Date.now();
  try {
    await page.click('#tlBtn', { timeout: 15000 });
    out(`${tag} page.click`, `returned in ${Date.now() - t0} ms`);
  } catch (e) {
    const lines = String(e.message)
      .split('\n')
      .filter(l => l.trim());
    out(`${tag} page.click`, `failed after ${Date.now() - t0} ms`);
    const uniq = [...new Set(lines.map(l => l.trim()))];
    uniq.slice(0, 14).forEach(l => out(`${tag}   log`, l));
  }
  await page.waitForTimeout(500);
  let open = await page.isVisible('#timeline .panel');
  out(`${tag} panel open after page.click`, open);
  if (open) {
    await page.keyboard.press('Escape');
    await page.waitForTimeout(800);
  }
  // 2) real CDP pointer input at the centre (no actionability wait)
  const b = await page.locator('#tlBtn').boundingBox();
  t0 = Date.now();
  await page.mouse.click(b.x + b.width / 2, b.y + b.height / 2);
  const tc = Date.now() - t0;
  await page
    .waitForFunction(
      () => {
        const p = document.querySelector('#timeline .panel');
        return p && p.offsetParent !== null;
      },
      null,
      { timeout: 15000 },
    )
    .catch(() => {});
  open = await page.isVisible('#timeline .panel');
  const foc = await page.evaluate(() => {
    const a = document.activeElement;
    return {
      inTimeline: !!(a && a.closest && a.closest('#timeline')),
      el: a && (a.id ? '#' + a.id : a.tagName + '.' + (a.className || '')),
    };
  });
  out(`${tag} mouse.click`, { dispatchMs: tc, openMs: Date.now() - t0, open, focus: foc });
  // 3) real keyboard: Escape closes, focus returns
  if (open) {
    t0 = Date.now();
    await page.keyboard.press('Escape');
    await page
      .waitForFunction(
        () => {
          const p = document.querySelector('#timeline .panel');
          return !p || p.offsetParent === null;
        },
        null,
        { timeout: 15000 },
      )
      .catch(() => {});
    const f2 = await page.evaluate(
      () => document.activeElement && (document.activeElement.id || document.activeElement.tagName),
    );
    out(`${tag} Escape`, {
      closeMs: Date.now() - t0,
      closed: !(await page.isVisible('#timeline .panel')),
      focusAfter: f2,
    });
    // keyboard open: focus is on the button after close, press Enter
    t0 = Date.now();
    await page.keyboard.press('Enter');
    await page
      .waitForFunction(
        () => {
          const p = document.querySelector('#timeline .panel');
          return p && p.offsetParent !== null;
        },
        null,
        { timeout: 15000 },
      )
      .catch(() => {});
    out(`${tag} Enter on focused button`, { openMs: Date.now() - t0, open: await page.isVisible('#timeline .panel') });
  }
  // controlled comparison: the same actionability click with a 90 s budget instead of 15 s
  if (await page.isVisible('#timeline .panel')) {
    await page.keyboard.press('Escape');
    await page
      .waitForFunction(
        () => {
          const p = document.querySelector('#timeline .panel');
          return !p || p.offsetParent === null;
        },
        null,
        { timeout: 30000 },
      )
      .catch(() => {});
  }
  t0 = Date.now();
  try {
    await page.click('#tlBtn', { timeout: 90000 });
    await page.waitForFunction(
      () => {
        const p = document.querySelector('#timeline .panel');
        return p && p.offsetParent !== null;
      },
      null,
      { timeout: 30000 },
    );
    out(`${tag} page.click (90 s budget)`, `opened in ${Date.now() - t0} ms`);
  } catch (e) {
    out(`${tag} page.click (90 s budget)`, `failed after ${Date.now() - t0} ms: ` + String(e.message).split('\n')[0]);
  }
  out(`${tag} page errors`, errs.length);
  await ctx.close();
}
await browser.close();
srv.close();
