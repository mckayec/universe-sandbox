import { chromium } from 'playwright';
import { writeFileSync } from 'node:fs';
const b = await chromium.launch({
  executablePath: process.env.CHROME_PATH || '/usr/bin/chromium',
  args: ['--no-sandbox', '--use-gl=swiftshader', '--enable-unsafe-swiftshader'],
});
const c = await b.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
const p = await c.newPage();
p.setDefaultTimeout(10000);
const result = {};
try {
  await p.goto((process.env.BASE || 'http://127.0.0.1:4191/atlas/?pack=abrahamic-world-religions') + '#world=earth');
  await p.waitForFunction(() => window.__atlas && document.querySelector('#splash.out'));
  result.initial = await p.evaluate(() => {
    const e = document.querySelector('[data-layer="jud"]'),
      f = document.querySelector('#filters'),
      r = e.getBoundingClientRect();
    return {
      button: r.toJSON(),
      filters: f.getBoundingClientRect().toJSON(),
      filterWidth: getComputedStyle(f).width,
      hit: document.elementFromPoint(r.x + r.width / 2, r.y + r.height / 2)?.outerHTML.slice(0, 200),
    };
  });
  try {
    await p.locator('[data-layer="jud"]').tap();
    result.tap = 'passed';
  } catch (e) {
    result.tap = e.message;
  }
  await p.screenshot({ path: new URL('390-filters.png', import.meta.url).pathname });
} finally {
  writeFileSync(new URL('mobile-filter-results.json', import.meta.url), JSON.stringify(result, null, 2));
  console.log(JSON.stringify(result, null, 2));
  await b.close();
}
