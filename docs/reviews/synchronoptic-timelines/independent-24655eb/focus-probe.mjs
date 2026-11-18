import { chromium } from 'playwright';
import { writeFileSync } from 'node:fs';
const b = await chromium.launch({
  executablePath: '/usr/bin/chromium',
  args: ['--no-sandbox', '--use-gl=swiftshader', '--enable-unsafe-swiftshader'],
});
const results = [];
const base = 'http://127.0.0.1:4196/atlas/?pack=abrahamic-world-religions';
try {
  for (const width of [390, 1440, 3840]) {
    const c = await b.newContext({ viewport: { width, height: width === 3840 ? 2160 : 900 }, reducedMotion: 'reduce' }),
      p = await c.newPage();
    p.setDefaultTimeout(30000);
    await p.goto(base + '#world=earth&tl=1');
    await p.locator('.tl-svg').waitFor();
    await p.waitForFunction(() => document.querySelector('#splash.out'));
    await p.locator('.tl-m[data-id="n:jud-karaite"]').focus();
    await p.keyboard.press('Enter');
    await p.evaluate(() => document.querySelector('[data-layer="jud"]').click());
    for (const phase of ['gate', 'resize', 'collapse']) {
      if (phase === 'resize') await p.setViewportSize({ width: width - 10, height: width === 3840 ? 2100 : 890 });
      if (phase === 'collapse') await p.locator('.tl-lt').first().click();
      for (const selector of ['.tl-ov', '.tl-scroll'])
        for (const key of ['Tab', 'Shift+Tab']) {
          await p.locator(selector).focus();
          let escaped = 0;
          for (let i = 0; i < 60; i++) {
            await p.keyboard.press(key);
            if (!(await p.evaluate(() => !!document.activeElement.closest('#timeline')))) escaped++;
          }
          results.push({ width, phase, selector, key, presses: 60, escaped });
        }
    }
    await p.keyboard.press('Escape');
    results.push({ width, escapeCloses: await p.locator('#timeline').evaluate(e => e.hidden) });
    await c.close();
  }
  // Compare native SVG mark-to-mark traversal at parent and target using independently built previews.
  for (const [head, port] of [
    ['312d2dd', 4195],
    ['24655eb', 4196],
  ]) {
    const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
    await p.goto(`http://127.0.0.1:${port}/atlas/?pack=abrahamic-world-religions#world=earth&tl=1`);
    await p.locator('.tl-svg').waitFor();
    const ids = await p.locator('.tl-m').evaluateAll(es => es.slice(0, 3).map(e => e.dataset.id));
    const active = () =>
      p.evaluate(() => ({
        id: document.activeElement.dataset.id || null,
        tag: document.activeElement.tagName,
        html: document.activeElement.outerHTML.slice(0, 230),
      }));
    await p.locator('.tl-m').first().focus();
    await p.keyboard.press('Tab');
    const forward = await active();
    await p.locator('.tl-m').nth(1).focus();
    await p.keyboard.press('Shift+Tab');
    const backward = await active();
    await p.locator('.tl-m').first().focus();
    await p.keyboard.press('ArrowDown');
    const arrow = await active();
    results.push({
      head,
      ids,
      forward,
      backward,
      arrow,
      svgOffsetParent: await p
        .locator('.tl-m')
        .first()
        .evaluate(e => e.offsetParent === null),
    });
    await p.close();
  }
} finally {
  writeFileSync(new URL('focus-results.json', import.meta.url), JSON.stringify(results, null, 2));
  console.log(JSON.stringify(results, null, 2));
  await b.close();
}
