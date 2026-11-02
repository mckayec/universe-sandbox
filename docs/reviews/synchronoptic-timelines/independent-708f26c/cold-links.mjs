// Cold-link validation on actual app, galaxy start to avoid unrelated surface bake cost.
import { chromium } from 'playwright';
import { writeFileSync } from 'node:fs';
const b = await chromium.launch({
  executablePath: process.env.CHROME_PATH || '/usr/bin/chromium',
  args: ['--no-sandbox', '--use-gl=swiftshader', '--enable-unsafe-swiftshader'],
});
const results = [];
const errors = [];
const base = process.env.BASE || 'http://127.0.0.1:4191/atlas/?pack=abrahamic-world-religions';
try {
  for (const hash of [
    '#world=earth&tl=bogus&tlc=bogus&tlsel=n:nope&tlt=-600,0',
    '#world=earth&layers=chr&tl=lane-jud&tlsel=n:jud-karaite',
  ]) {
    const c = await b.newContext({
      viewport: { width: 390, height: 844 },
      isMobile: true,
      hasTouch: true,
      reducedMotion: 'reduce',
    });
    const p = await c.newPage();
    p.setDefaultTimeout(180000);
    p.on('console', m => {
      if (m.type() === 'error') errors.push(m.text());
    });
    p.on('pageerror', e => errors.push(e.message));
    await p.goto(base + hash);
    await p.locator('.tl-svg').waitFor();
    await p.waitForFunction(() => document.querySelector('#splash.out'));
    results.push({
      hash,
      actual: await p.evaluate(() => ({
        url: location.hash,
        selected: document.querySelectorAll('.tl-m.sel').length,
        judMarks: document.querySelectorAll('.tl-m[data-id^="n:jud"]').length,
        lanes: [...document.querySelectorAll('.tl-lt')].map(e => e.dataset.laneT),
        transition: getComputedStyle(document.querySelector('#timeline .btn')).transitionDuration,
      })),
    });
    await p.locator('#timeline [data-z="1"]').tap();
    await p.locator('#timeline [data-z="0"]').tap();
    await p.locator('.tl-lt').first().tap();
    results.push({ touchCollapse: await p.locator('.tl-sum').count() });
    await p.locator('#timeline [data-tl="close"]').tap();
    await p.waitForFunction(() => document.querySelector('#timeline').hidden);
    results.push({
      touchClose: await p.evaluate(() => ({ url: location.href, closed: document.querySelector('#timeline').hidden })),
    });
    await c.close();
  }
  results.push({ consoleAndPageErrors: errors });
} finally {
  writeFileSync(new URL('cold-results.json', import.meta.url), JSON.stringify(results, null, 2));
  console.log(JSON.stringify(results, null, 2));
  await b.close();
}
