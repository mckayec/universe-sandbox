import { chromium } from 'playwright';
import { writeFileSync } from 'node:fs';
const out = new URL('.', import.meta.url).pathname,
  results = [],
  errors = [];
const b = await chromium.launch({
  executablePath: '/usr/bin/chromium',
  args: ['--no-sandbox', '--use-gl=swiftshader', '--enable-unsafe-swiftshader'],
});
for (const width of [390, 1440, 3840]) {
  const c = await b.newContext({
      viewport: { width, height: width === 3840 ? 2160 : width === 390 ? 844 : 900 },
      isMobile: width === 390,
      hasTouch: width === 390,
      reducedMotion: 'reduce',
    }),
    p = await c.newPage();
  p.on('pageerror', e => errors.push(e.message));
  p.on('console', m => m.type() === 'error' && errors.push(m.text()));
  await p.goto('http://127.0.0.1:4197/atlas/?pack=abrahamic-world-religions#world=earth');
  await p.waitForFunction(() => window.__atlas && document.querySelector('#splash.out'));
  await p.locator('#tlBtn').click();
  await p.locator('.tl-svg').waitFor();
  const chart = await p.evaluate(() => ({
    coverage: document.querySelector('.tl-cov').innerText,
    paths: [...document.querySelectorAll('.tl-edge')].map(e => ({ title: e.textContent, d: e.getAttribute('d') })),
    marks: [...document.querySelectorAll('.tl-m')].map(e => ({
      id: e.dataset.id,
      label: e.getAttribute('aria-label'),
      html: e.outerHTML.slice(0, 1000),
    })),
  }));
  await p.screenshot({ path: out + width + '-chart.jpg', type: 'jpeg', quality: 60 });
  await p.locator('[data-mode="list"]').click();
  const rows = await p.locator('.tl-list .tl-edges > li').allInnerTexts();
  const links = await p
    .locator('.tl-list .tl-cite a')
    .evaluateAll(es => es.map(e => ({ text: e.textContent, href: e.href, target: e.target, rel: e.rel })));
  // Reach a citation using actual keyboard navigation and read its accessible name.
  const first = p.locator('.tl-list .tl-cite a').first();
  await first.focus();
  await p.keyboard.press('Tab');
  const citationNext = await p.evaluate(() => ({
    tag: document.activeElement.tagName,
    text: document.activeElement.textContent,
    inDialog: !!document.activeElement.closest('#timeline'),
  }));
  await p.locator('.tl-it[data-id="n:isc01"]').click();
  const sufi = await p.locator('.tl-info').innerText();
  await p.screenshot({ path: out + width + '-sufi.jpg', type: 'jpeg', quality: 60 });
  await p.evaluate(() => document.querySelector('[data-layer="isl"]').click());
  const gated = await p.evaluate(() => ({
    rows: [...document.querySelectorAll('.tl-list .tl-edges>li')].map(e => e.textContent),
    info: document.querySelector('.tl-info').innerText,
    hash: location.hash,
  }));
  const tabs = [];
  for (let i = 0; i < 60; i++) {
    await p.keyboard.press(i % 2 ? 'Shift+Tab' : 'Tab');
    tabs.push(await p.evaluate(() => !!document.activeElement.closest('#timeline')));
  }
  await p.keyboard.press('Escape');
  const close = await p.evaluate(() => ({
    hidden: document.querySelector('#timeline').hidden,
    focus: document.activeElement.id,
  }));
  results.push({ width, chart, rows, links, citationNext, sufi, gated, tabs, close });
  await c.close();
}
await b.close();
writeFileSync(out + 'connectors.json', JSON.stringify({ results, errors }, null, 2));
console.log(
  JSON.stringify({
    widths: results.map(x => ({
      width: x.width,
      paths: x.chart.paths.length,
      rows: x.rows.length,
      links: x.links.length,
      gatedRows: x.gated.rows.length,
      escaped: x.tabs.filter(x => !x).length,
      close: x.close,
    })),
    errors,
  }),
);
