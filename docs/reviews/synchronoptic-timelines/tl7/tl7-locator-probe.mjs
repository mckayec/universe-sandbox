// Checkpoint 7 probe: relationship source locators in the synchronoptic timeline (Religious Traditions).
// Serve the build (pnpm build && pnpm preview --port 4195) and run: node docs/reviews/synchronoptic-timelines/tl7/tl7-locator-probe.mjs
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
const SIZES = [
  [390, 844],
  [1280, 800],
  [1440, 900],
  [3840, 2160],
];
try {
  for (const [width, height] of SIZES) {
    const phone = width === 390;
    const c = await b.newContext({ viewport: { width, height }, isMobile: phone, hasTouch: phone, reducedMotion: 'reduce' });
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
    const cov = await p.locator('.tl-cov p').first().innerText();
    check(width + ' coverage counts', /129 relationships: 95 with a source locator, 34 overview groupings/.test(cov) && /0 without/.test(cov), cov);
    check(width + ' no edge-source gap', !(await p.locator('.tl-cov li').allInnerTexts()).some(t => /no source locator/.test(t)), null);
    const paths = await p.locator('path.tl-edge').count();
    const titled = await p.locator('path.tl-edge > title').count();
    check(width + ' drawn connectors carry a title', paths > 0 && titled === paths, { paths, titled });
    if (width !== 1280) await p.screenshot({ path: out + width + '-chart.jpg', type: 'jpeg', quality: 72 });

    await p.locator('[data-mode="list"]').click();
    const lis = p.locator('.tl-list .tl-edges > li');
    const n = await lis.count();
    const cites = await p.locator('.tl-list .tl-edges .tl-cite').count();
    const eds = await p.locator('.tl-list .tl-edges .tl-ed').count();
    const gaps = await p.locator('.tl-list .tl-edges .tl-gap').count();
    check(width + ' list: every relationship cited or editorial', n === 129 && cites === 95 && eds === 34 && gaps === 0, { n, cites, eds, gaps });
    const links = await p.locator('.tl-list .tl-cite a').evaluateAll(as =>
      as.map(a => ({ h: a.getAttribute('href'), t: a.target, r: a.rel })),
    );
    check(width + ' citation links are https, new tab, noopener', links.length >= 95 && links.every(l => /^https:\/\//.test(l.h) && l.t === '_blank' && /noopener/.test(l.r)), links.length);
    const overflow = await p.evaluate(() => {
      const el = document.querySelector('#timeline');
      return [...el.querySelectorAll('.tl-cite')].filter(x => x.getBoundingClientRect().right > window.innerWidth + 1).length;
    });
    check(width + ' no citation runs off screen', overflow === 0, overflow);

    // a record's details show the located relationship
    await p.locator('.tl-it[data-id="n:jud-rabbinic"]').first().click();
    const info = await p.locator('.tl-info').innerText();
    check(width + ' details: Rabbinic Judaism cites JU-R04', /JU-R04/.test(info) && /JU03 · Harvard Pluralism Project, Post-Biblical Religion/.test(info), info.slice(0, 160));
    await p.screenshot({ path: out + width + '-details.jpg', type: 'jpeg', quality: 72 });
    // keyboard: the citation links are reachable and focus stays in the dialog
    const inDialog = [];
    for (let i = 0; i < 40; i++) {
      await p.keyboard.press('Tab');
      inDialog.push(await p.evaluate(() => !!document.activeElement.closest('#timeline')));
    }
    check(width + ' Tab x40 stays in the timeline', inDialog.every(Boolean), inDialog.filter(x => !x).length);
    await p.keyboard.press('Escape');
    await p.waitForFunction(() => document.querySelector('#timeline').hidden);
    check(width + ' Escape closes', true, null);
    await c.close();
  }
} finally {
  await b.close();
}
check('no console/request errors', errors.length === 0, errors.slice(0, 5));
writeFileSync(out + 'results.json', JSON.stringify({ results, errors }, null, 1));
const failed = results.filter(r => !r.pass).length;
console.log(results.length - failed + '/' + results.length + ' passed');
process.exit(failed ? 1 : 0);
