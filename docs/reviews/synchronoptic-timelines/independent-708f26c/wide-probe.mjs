// Run at reviewed implementation head after build; BASE may override running preview.
import { chromium } from 'playwright';
import { writeFileSync } from 'node:fs';
const out = new URL('.', import.meta.url).pathname;
const browser = await chromium.launch({
  executablePath: process.env.CHROME_PATH || '/usr/bin/chromium',
  args: ['--no-sandbox', '--use-gl=swiftshader', '--enable-unsafe-swiftshader'],
});
const base = process.env.BASE || 'http://127.0.0.1:4191/atlas/?pack=abrahamic-world-religions';
const results = [],
  errors = [];
const record = (name, actual) => {
  results.push({ name, actual });
  console.log(name, JSON.stringify(actual));
};
try {
  for (const width of [3840]) {
    const ctx = await browser.newContext({
      viewport: { width, height: width === 3840 ? 2160 : width === 390 ? 844 : 900 },
      isMobile: width === 390,
      hasTouch: width === 390,
      reducedMotion: 'reduce',
    });
    const p = await ctx.newPage();
    p.setDefaultTimeout(180000);
    p.on('pageerror', e => errors.push(e.message));
    p.on('requestfailed', r => errors.push(r.url() + ':' + r.failure()?.errorText));
    p.on('response', r => {
      if (r.status() >= 400) errors.push(r.status() + ' ' + r.url());
    });
    await p.goto(base + '#world=earth');
    await p.waitForFunction(() => window.__atlas && document.querySelector('#splash.out'));
    const open = async () => {
      await p.locator('#tlBtn').click();
      await p.locator('#timeline [data-mode="chart"]').click();
      await p.locator('.tl-svg').waitFor();
    };
    const close = async () => {
      await p.keyboard.press('Escape');
      await p.waitForFunction(() => document.querySelector('#timeline').hidden && !/[#&]tl=/.test(location.hash));
    };
    await open();
    record(
      width + ' overview',
      await p.evaluate(() => ({
        marks: document.querySelectorAll('.tl-m').length,
        undated: document.querySelectorAll('.tl-und .tl-it').length,
        overflow: document.documentElement.scrollWidth > innerWidth,
        coverage: document.querySelector('.tl-cov').textContent,
        reduced: matchMedia('(prefers-reduced-motion: reduce)').matches,
      })),
    );
    await p.screenshot({ path: out + width + '-chart.png' });
    const ids = await p.locator('.tl-lt').evaluateAll(es => es.map(e => e.dataset.laneT));
    const before = await p.locator('.tl-svg').getAttribute('width');
    await p.locator('#timeline [data-z="1"]').click();
    const zoom = await p.locator('.tl-svg').getAttribute('width');
    await p.locator('#timeline [data-z="0"]').click();
    record(width + ' zoom/reset', { before, zoom, reset: await p.locator('.tl-svg').getAttribute('width') });
    await p.locator('.tl-m').first().focus();
    await p.keyboard.press('Enter');
    const sel = await p.evaluate(() => document.activeElement.dataset.id);
    await p.goBack();
    await p.waitForFunction(() => document.querySelector('#timeline').hidden);
    record(width + ' Back focus', await p.evaluate(() => document.activeElement.id));
    await p.goForward();
    await p.waitForFunction(() => !document.querySelector('#timeline').hidden);
    record(width + ' Forward selection', { sel, restored: await p.evaluate(() => document.activeElement.dataset.id) });
    await close();
    const len = await p.evaluate(() => history.length);
    for (let i = 0; i < 3; i++) {
      await open();
      await close();
    }
    record(width + ' repeated Escape', {
      len,
      after: await p.evaluate(() => history.length),
      focus: await p.evaluate(() => document.activeElement.id),
    });
    await open();
    await p.locator('.tl-lt').first().focus();
    await p.keyboard.press('Enter');
    await p.locator(`[data-lane="${ids[1]}"][data-lane-mv="-1"]`).click();
    record(
      width + ' lane controls',
      await p.evaluate(() => ({
        first: document.querySelector('.tl-lt').dataset.laneT,
        summaries: document.querySelectorAll('.tl-sum').length,
        hash: location.hash,
        focus: document.activeElement.outerHTML,
      })),
    );
    await p.locator('[data-mode="list"]').click();
    record(
      width + ' collapsed list',
      await p.evaluate(() => ({
        dated: document.querySelectorAll('.tl-list:first-child .tl-it').length,
        undated: document.querySelectorAll('.tl-und .tl-it').length,
        controls: document.querySelectorAll('.tl-lt').length,
        collapsedText: [...document.querySelectorAll('.tl-und h4')]
          .map(e => e.textContent)
          .filter(x => x.includes('collapsed')),
      })),
    );
    await p.screenshot({ path: out + width + '-list-collapsed.png' });
    await close();
    // Toggle actual atlas filters, then inspect independently recomputed gated model and DOM.
    for (let i = 0; i < 2; i++) {
      await p.locator('[data-layer="jud"]').click();
      await open();
      record(
        width + ' filter cycle ' + i,
        await p.evaluate(() => ({
          layers: window.__atlas.S.layers,
          judMarks: document.querySelectorAll('.tl-m[data-id^="n:jud"]').length,
          hash: location.hash,
        })),
      );
      await close();
    }
    await p.goto(base + '#tl=bogus&tlc=bogus&tlsel=n:nope&tlt=-600,0');
    await p.locator('.tl-svg').waitFor();
    record(
      width + ' invalid URL',
      await p.evaluate(() => ({
        hash: location.hash,
        selected: document.querySelectorAll('.tl-m.sel').length,
        lanes: document.querySelectorAll('.tl-lt').length,
      })),
    );
    if (width === 1440) {
      await p.locator('[data-mode="list"]').click();
      await p.locator('.tl-it[data-id="e:jud-e08"]').click();
      record('event provenance', await p.locator('.tl-info').innerText());
      record('source anchors', await p.locator('.tl-info a').count());
      await p.locator('[data-tl="clear"]').click();
      record(
        'clear focus',
        await p.evaluate(() => ({
          tag: document.activeElement.tagName,
          id: document.activeElement.id,
          inside: !!document.activeElement.closest('#timeline'),
        })),
      );
    }
    await ctx.close();
  }
  record('errors', errors);
} finally {
  writeFileSync(out + 'wide-results.json', JSON.stringify(results, null, 2));
  await browser.close();
}
