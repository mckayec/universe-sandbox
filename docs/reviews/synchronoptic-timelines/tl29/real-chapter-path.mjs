// Checkpoint 29: real close → chapter change → reopen with real input only (TL22-E2 / independent-review-daeaf39.md).
// Fixture as tl25/chapter-probe.mjs 'chapters' variant (temp copy only): Religious Traditions made cumulative with two
// books, book I declares 6 chapters; n:jud-karaite gated {first 1, chapter 3}. Synthetic test gates, not canon data.
// Every activation is real CDP input: page.mouse.click at the element centre (after a hit test that the element is
// on top there) and page.keyboard. No element.click(), no dispatched events, no selectOption. Scrolling a list row
// into view uses element.scrollIntoView (programmatic scroll; the click itself is real); a target off-screen in
// a horizontal scroll strip (#controls at phone width) is reached with real mouse-wheel input over that strip.
// usage: node real-chapter-path.mjs <dist dir> <label>
import { cpSync, mkdtempSync, readFileSync, appendFileSync } from 'node:fs';
import { createServer } from 'node:http';
import { tmpdir } from 'node:os';
import { join, extname } from 'node:path';
import { chromium } from 'playwright';
const [distDir, label] = process.argv.slice(2);
const ID = 'abrahamic-world-religions';
const K = 'n:jud-karaite';
const FIX = {
  'jud-karaite': { first: 1, chapter: 3 },
  'jud-covenant-tradition': { first: 1, chapter: 5 },
  'jud-ananites': { first: 2 },
};
const dir = mkdtempSync(join(tmpdir(), 'tl29c-'));
cpSync(distDir, dir, { recursive: true });
appendFileSync(
  join(dir, `atlas/packs/${ID}.js`),
  `\n;(function(P){P.spoilers=Object.assign({},P.spoilers,{mode:'cumulative'});` +
    `P.books={1:{n:'I',title:'Part one', chapters: 6},2:{n:'II',title:'Part two'}};` +
    `var F=${JSON.stringify(FIX)};P.tree.nodes.forEach(function(n){if(F[n.id])Object.assign(n,F[n.id]);});` +
    `})(window.ATLAS_PACKS['${ID}']);\n`,
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
const base = `http://127.0.0.1:${srv.address().port}/atlas/?pack=${ID}`;
const browser = await chromium.launch({
  executablePath: process.env.CHROME_PATH,
  args: ['--use-gl=swiftshader', '--enable-webgl', '--ignore-gpu-blocklist'],
});
let pass = 0,
  fail = 0;
const check = (n, ok, x = '') => {
  ok ? pass++ : fail++;
  console.log(`${ok ? 'PASS' : 'FAIL'} ${label} ${n}${x ? ' — ' + x : ''}`);
};
const W = { timeout: 60000, polling: 250 };
for (const [w, h] of process.env.ONLY390
  ? [[390, 844]]
  : [
      [1440, 900],
      [390, 844],
    ]) {
  const tag = String(w);
  const ctx = await browser.newContext({ viewport: { width: w, height: h }, serviceWorkers: 'block' });
  const page = await ctx.newPage();
  const errors = [];
  page.on('pageerror', e => errors.push(e.message));
  page.on('console', m => m.type() === 'error' && errors.push(m.text()));
  const hq = async () =>
    Object.fromEntries(await page.evaluate(() => [...new URLSearchParams(location.hash.replace(/^#/, ''))]));
  const isOpen = () =>
    page.evaluate(() => {
      const p = document.querySelector('#timeline .panel');
      return !!p && p.offsetParent !== null;
    });
  const real = async (sel, what) => {
    const loc = page.locator(sel).first();
    // programmatic scroll (no actionability wait: Playwright's stability wait starves under software GL, see diagnosis)
    await page.evaluate(s => {
      const e = document.querySelector(s);
      const r = e.getBoundingClientRect();
      if (r.top < 0 || r.bottom > innerHeight) e.scrollIntoView({ block: 'center' });
    }, sel);
    await page.waitForTimeout(300);
    // off-screen inside a horizontal scroll strip (#controls at phone width): real wheel input over the strip
    for (let i = 0; i < 8; i++) {
      const g = await page.evaluate(s => {
        const e = document.querySelector(s);
        const r = e.getBoundingClientRect();
        if (r.x >= 0 && r.right <= innerWidth) return null;
        let p = e.parentElement;
        while (p && !(p.scrollWidth > p.clientWidth + 1 && /auto|scroll/.test(getComputedStyle(p).overflowX)))
          p = p.parentElement;
        if (!p) return null;
        const q = p.getBoundingClientRect();
        return { x: q.x + q.width / 2, y: q.y + q.height / 2, dx: r.x < 0 ? -200 : 200 };
      }, sel);
      if (!g) break;
      await page.mouse.move(g.x, g.y);
      await page.mouse.wheel(g.dx, 0);
      await page.waitForTimeout(400);
      if (i === 0) console.log(`.. ${label} ${tag} wheel-scrolled the strip to reach ${what}`);
    }
    console.log(`.. ${label} ${tag} real click: ${what}`);
    const hit = await page.evaluate(s => {
      const e = document.querySelector(s);
      if (!e) return { ok: false, top: 'target missing' };
      const r = e.getBoundingClientRect();
      const t = document.elementFromPoint(r.x + r.width / 2, r.y + r.height / 2);
      const d = x =>
        x
          ? x.id
            ? '#' + x.id
            : x.tagName.toLowerCase() +
              (x.className && typeof x.className === 'string' ? '.' + x.className.split(' ').join('.') : '')
          : 'none';
      return {
        ok: !!t && (t === e || e.contains(t)),
        top: d(t) + ' < ' + d(t && t.parentElement) + ' < ' + d(t && t.closest('[id]')),
        box: [r.x, r.y, r.width, r.height].map(Math.round),
      };
    }, sel);
    if (!hit.ok) {
      check(
        `${tag} ${what}: target on top at its centre`,
        false,
        sel + ' covered by ' + hit.top + ' box ' + JSON.stringify(hit.box),
      );
      return false;
    }
    const b = await loc.boundingBox();
    await page.mouse.click(b.x + b.width / 2, b.y + b.height / 2);
    return true;
  };
  const chapterByKeys = async n => {
    // real pointer focuses the select; real keys choose: Home = "Not set", ArrowDown×n = "Through n", Enter commits
    if (!(await real('#chapterSel', `chapter select → ${n || 'Not set'}`))) return;
    await page.waitForTimeout(300);
    await page.keyboard.press('Home');
    for (let i = 0; i < n; i++) await page.keyboard.press('ArrowDown');
    await page.keyboard.press('Enter');
    await page
      .waitForFunction(v => document.querySelector('#chapterSel').value === v, n ? String(n) : '', W)
      .catch(() => {});
  };
  const rowIn = id =>
    page.evaluate(
      i =>
        [...document.querySelectorAll('#timeline .tl-list .tl-it, #timeline .tl-und .tl-it')].some(
          x => x.dataset.id === i,
        ),
      id,
    );
  const detail = async () => (await page.textContent('#timeline .tl-info').catch(() => '')) || '';
  await page.goto(base);
  await page.waitForFunction(() => !!document.querySelector('#tlBtn'), null, { timeout: 90000 });
  await page.waitForTimeout(3000);

  await real('#books [data-b="1"]', 'book I');
  await page
    .waitForFunction(
      () => {
        const w = document.querySelector('#chapterWrap');
        return w && !w.hidden;
      },
      null,
      W,
    )
    .catch(() => {});
  check(
    `${tag} real click on book I shows the chapter selector`,
    await page.evaluate(() => !document.querySelector('#chapterWrap').hidden),
  );
  await chapterByKeys(3);
  let q = await hq();
  check(
    `${tag} real keys set chapter 3 (select value, URL ch=3)`,
    q.ch === '3' && (await page.inputValue('#chapterSel')) === '3',
    JSON.stringify(q),
  );

  if (process.env.SHOT) await page.screenshot({ path: process.env.SHOT + '-' + tag + '-after-chapter.png' });
  await real('#tlBtn', 'Timeline button');
  await page
    .waitForFunction(
      () => {
        const p = document.querySelector('#timeline .panel');
        return !!p && p.offsetParent !== null;
      },
      null,
      W,
    )
    .catch(() => {});
  check(
    `${tag} real click opens the timeline; focus moves into it`,
    (await isOpen()) && (await page.evaluate(() => !!document.activeElement.closest('#timeline'))),
  );
  await real('#timeline [data-mode="list"]', 'List mode');
  await page.waitForTimeout(500);
  check(`${tag} chapter 3: gated row ${K} listed`, await rowIn(K));
  await real(`#timeline .tl-it[data-id="${K}"]`, 'Karaite row');
  await page.waitForFunction(k => new URLSearchParams(location.hash.slice(1)).get('tlsel') === k, K, W).catch(() => {});
  q = await hq();
  check(
    `${tag} real click selects Karaite (tlsel + detail)`,
    q.tlsel === K && (await detail()).includes('Karaite'),
    `tlsel=${q.tlsel}`,
  );

  await page.keyboard.press('Escape');
  await page
    .waitForFunction(
      () => {
        const p = document.querySelector('#timeline .panel');
        return !p || p.offsetParent === null;
      },
      null,
      W,
    )
    .catch(() => {});
  check(
    `${tag} real Escape closes; focus returns to the Timeline button`,
    !(await isOpen()) && (await page.evaluate(() => document.activeElement && document.activeElement.id)) === 'tlBtn',
  );

  await chapterByKeys(0);
  q = await hq();
  check(
    `${tag} closed: real keys reset chapter to Not set; ch and tlsel leave the URL`,
    q.ch == null && q.tlsel == null,
    JSON.stringify(q),
  );

  await real('#tlBtn', 'Timeline button (reopen)');
  await page
    .waitForFunction(
      () => {
        const p = document.querySelector('#timeline .panel');
        return !!p && p.offsetParent !== null;
      },
      null,
      W,
    )
    .catch(() => {});
  q = await hq();
  check(
    `${tag} real reopen: Karaite row absent, not selected, no detail`,
    (await isOpen()) && !(await rowIn(K)) && q.tlsel == null && !(await detail()).includes('Karaite'),
    JSON.stringify(q),
  );

  await page.keyboard.press('Escape');
  await page
    .waitForFunction(
      () => {
        const p = document.querySelector('#timeline .panel');
        return !p || p.offsetParent === null;
      },
      null,
      W,
    )
    .catch(() => {});
  await chapterByKeys(3);
  await real('#tlBtn', 'Timeline button (reopen at chapter 3)');
  await page
    .waitForFunction(
      () => {
        const p = document.querySelector('#timeline .panel');
        return !!p && p.offsetParent !== null;
      },
      null,
      W,
    )
    .catch(() => {});
  q = await hq();
  check(
    `${tag} chapter 3 again, real reopen: row listed again, selection not resurrected`,
    (await rowIn(K)) && q.tlsel == null && q.ch === '3',
    JSON.stringify(q),
  );
  check(`${tag} no page/console errors`, errors.length === 0, errors.slice(0, 3).join(' | '));
  await ctx.close();
}
await browser.close();
srv.close();
console.log(`${label}: ${pass}/${pass + fail} real-input checks passed`);
process.exit(fail ? 1 : 0);
