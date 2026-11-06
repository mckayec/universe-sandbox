// Checkpoint 8 probe: TL-R07 — relationship connectors are undated brackets outside the time axis; X08 inspected route.
// Serve the build (pnpm build && pnpm preview --port 4195) and run: node docs/reviews/synchronoptic-timelines/tl8/tl8-connector-probe.mjs
import { chromium } from 'playwright';
import { writeFileSync } from 'node:fs';

const out = new URL('.', import.meta.url).pathname;
const results = [];
const errors = [];
const b = await chromium.launch({
  ...(process.env.CHROME_PATH ? { executablePath: process.env.CHROME_PATH } : {}),
  args: ['--no-sandbox', '--use-gl=swiftshader', '--enable-webgl', '--ignore-gpu-blocklist'],
});
const check = (name, pass, actual) => {
  results.push({ name, pass: !!pass, actual });
  console.log((pass ? 'PASS ' : 'FAIL ') + name + ' ' + JSON.stringify(actual));
};
/* geometry of every connector against the gutter, the time axis and the endpoint rows */
const geometry = p =>
  p.evaluate(() => {
    const svg = document.querySelector('.tl-svg');
    const gut = svg.querySelector('.tl-gut');
    const gw = gut ? Number(gut.getAttribute('width')) + 2 : 0;
    const nums = d => [...d.matchAll(/[MHV]\s*([-\d.]+)(?:\s+([-\d.]+))?/g)];
    const paths = [...svg.querySelectorAll('path.tl-edge')].map(e => {
      const d = e.getAttribute('d');
      const xs = [];
      const ys = [];
      nums(d).forEach(m => {
        if (m[0][0] === 'M') (xs.push(+m[1]), ys.push(+m[2]));
        else if (m[0][0] === 'H') xs.push(+m[1]);
        else ys.push(+m[1]);
      });
      return { id: e.dataset.edge, xs, ys, title: e.querySelector('title')?.textContent || '' };
    });
    const markX = [...svg.querySelectorAll('.tl-m')].map(g => g.getBBox().x);
    const laneX = [...svg.querySelectorAll('.tl-lane')].map(t => +t.getAttribute('x'));
    const tickX = [...svg.querySelectorAll('.tl-tick')].map(t => +t.getAttribute('x1'));
    const rowY = id => {
      const g = svg.querySelector('.tl-m[data-id="' + id + '"]');
      if (!g) return null;
      const r = g.querySelector('rect.tl-win, rect.tl-bar, path.tl-pt').getBBox();
      return r.y + r.height / 2;
    };
    return {
      gw,
      paths,
      minMark: Math.min(...markX),
      minLane: Math.min(...laneX),
      minTick: Math.min(...tickX),
      jts: rowY('n:jud-jts'),
      cons: rowY('n:jud-conservative-masorti'),
    };
  });
const SIZES = [
  [390, 844],
  [1280, 800],
  [1440, 900],
  [3840, 2160],
];
try {
  for (const [width, height] of SIZES) {
    const phone = width === 390;
    const c = await b.newContext({
      viewport: { width, height },
      isMobile: phone,
      hasTouch: phone,
      reducedMotion: 'reduce',
    });
    const p = await c.newPage();
    p.setDefaultTimeout(60000);
    p.on('pageerror', e => errors.push(width + ' ' + e.message));
    p.on('console', m => m.type() === 'error' && errors.push(width + ' ' + m.text()));
    p.on('requestfailed', r => errors.push(width + ' failed ' + r.url()));
    p.on('response', r => r.status() >= 400 && errors.push(width + ' ' + r.status() + ' ' + r.url()));
    await p.goto((process.env.BASE || 'http://127.0.0.1:4195/atlas/?pack=abrahamic-world-religions') + '#world=earth');
    await p.waitForFunction(() => window.__atlas && document.querySelector('#splash.out'));
    await p.locator('#tlBtn').click();
    await p.locator('.tl-svg').waitFor();
    const verify = async tag => {
      const g = await geometry(p);
      check(width + ' ' + tag + ': connectors drawn', g.paths.length > 0, g.paths.length);
      check(
        width + ' ' + tag + ': every connector stays in the undated gutter',
        g.paths.every(q => Math.max(...q.xs) < g.gw && Math.min(...q.xs) > 0),
        { gutter: g.gw, maxX: Math.max(...g.paths.flatMap(q => q.xs)) },
      );
      check(
        width + ' ' + tag + ': marks, lane titles and ticks start right of the gutter',
        g.minMark >= g.gw && g.minLane >= g.gw && (!isFinite(g.minTick) || g.minTick >= g.gw),
        { mark: g.minMark, lane: g.minLane, tick: g.minTick, gutter: g.gw },
      );
      check(
        width + ' ' + tag + ': titles say the relationship is not dated',
        g.paths.every(q => /not dated/.test(q.title)),
        null,
      );
      return g;
    };
    const g = await verify('default');
    check(width + ' nine connectors', g.paths.length === 9, g.paths.length);
    const jts = g.paths.find(q => q.id === 'l:6:jud-jts>jud-conservative-masorti');
    check(
      width + ' JTS → Conservative/Masorti joins exactly those two rows, at no year',
      jts &&
        Math.abs(Math.min(...jts.ys) - Math.min(g.jts, g.cons)) < 0.5 &&
        Math.abs(Math.max(...jts.ys) - Math.max(g.jts, g.cons)) < 0.5,
      jts && { ys: [...new Set(jts.ys)], jts: g.jts, cons: g.cons },
    );
    if (width !== 1280) await p.screenshot({ path: out + width + '-chart.jpg', type: 'jpeg', quality: 72 });
    // zoom in twice, then reset
    await p.locator('#timeline .tl-zoom [data-z="1"]').click();
    await p.locator('#timeline .tl-zoom [data-z="1"]').click();
    const gz = await verify('zoom x2.5');
    check(width + ' zoom keeps nine connectors', gz.paths.length === 9, gz.paths.length);
    await p.locator('#timeline .tl-zoom [data-z="0"]').click();
    // collapse the first lane: its connectors go, the rest stay in the gutter
    const lane = p.locator('#timeline .tl-lt').first();
    await lane.click();
    const gc = await verify('first lane collapsed');
    check(width + ' collapse removes connectors whose rows are hidden', gc.paths.length < 9, gc.paths.length);
    await p.locator('#timeline .tl-lt').first().click();
    const ge = await verify('re-expanded');
    check(width + ' re-expanded: nine again', ge.paths.length === 9, ge.paths.length);
    // list equivalence and the X08 inspected route + scope
    await p.locator('#timeline [data-mode="list"]').click();
    const n = await p.locator('.tl-list .tl-edges > li').count();
    check(width + ' list still has all 129 relationships', n === 129, n);
    const x08 = p.locator('.tl-list .tl-edges > li', { hasText: 'X08' }).first();
    const x08Links = await x08
      .locator('a')
      .evaluateAll(as => as.map(a => a.textContent + ' ' + a.getAttribute('href')));
    const x08Text = await x08.innerText();
    check(
      width + ' X08 keeps the inspected proof route and page scope',
      x08Links.some(t => /chapter proof PDF https:\/\/maracas/.test(t)) && /Scope: .*pp ?34–36/.test(x08Text),
      x08Links.length,
    );
    const overflow = await p.evaluate(
      () =>
        [...document.querySelectorAll('#timeline .tl-cite')].filter(
          x => x.getBoundingClientRect().right > window.innerWidth + 1,
        ).length,
    );
    check(width + ' no citation/scope runs off screen', overflow === 0, overflow);
    await p.keyboard.press('Escape');
    await p.waitForFunction(() => document.querySelector('#timeline').hidden);
    await c.close();
  }
} finally {
  await b.close();
}
check('zero console/page/request errors', errors.length === 0, errors.slice(0, 5));
const pass = results.filter(r => r.pass).length;
console.log('PASS ' + pass + '/' + results.length);
writeFileSync(out + 'results.json', JSON.stringify({ results, errors }, null, 2));
process.exit(pass === results.length ? 0 : 1);
