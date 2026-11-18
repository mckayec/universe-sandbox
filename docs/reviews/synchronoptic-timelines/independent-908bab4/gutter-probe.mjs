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
      viewport: { width, height: width === 390 ? 844 : width === 3840 ? 2160 : 900 },
      reducedMotion: 'reduce',
      isMobile: width === 390,
      hasTouch: width === 390,
    }),
    p = await c.newPage();
  p.on('pageerror', e => errors.push(e.message));
  p.on('console', m => m.type() === 'error' && errors.push(m.text()));
  await p.goto('http://127.0.0.1:4199/atlas/?pack=abrahamic-world-religions#world=earth');
  await p.waitForFunction(() => window.__atlas && document.querySelector('#splash.out'));
  await p.locator('#tlBtn').click();
  await p.locator('.tl-svg').waitFor();
  const stages = [];
  const geometry = async label =>
    stages.push({
      label,
      ...(await p.evaluate(() => {
        const gut = document.querySelector('.tl-gut'),
          right = Number(gut?.getAttribute('width') || 0);
        return {
          firstLane: document.querySelector('.tl-lt')?.dataset.laneT,
          legend: document.querySelector('.tl-undated')?.textContent,
          legendVisible: !!document.querySelector('.tl-undated')?.getClientRects().length,
          noteVisible: getComputedStyle(document.querySelector('.tl-note')).display !== 'none',
          gutter: right,
          paths: [...document.querySelectorAll('.tl-edge')].map(e => ({
            id: e.dataset.edge,
            title: e.textContent,
            d: e.getAttribute('d'),
            right: e.getBBox().x + e.getBBox().width,
          })),
          marks: [...document.querySelectorAll('.tl-m')].map(e => ({ id: e.dataset.id, x: e.getBBox().x })),
          overflow: document.documentElement.scrollWidth > innerWidth,
        };
      })),
    });
  await geometry('initial');
  await p.screenshot({ path: out + width + '-chart.jpg', type: 'jpeg', quality: 60 });
  await p.locator('#timeline [data-z="1"]').click();
  await p.locator('#timeline [data-z="1"]').click();
  await geometry('zoom');
  await p.locator('#timeline [data-z="0"]').click();
  await geometry('reset');
  await p.locator('.tl-lt').first().click();
  await geometry('collapsed');
  await p.locator('.tl-lt').first().click();
  await geometry('expanded');
  await p.evaluate(() => {
    location.hash = 'world=earth&tl=lane-chr';
  });
  await p.waitForTimeout(150);
  await geometry('reordered');
  await p.locator('[data-mode="list"]').click();
  const list = await p.locator('.tl-list .tl-edges').innerText();
  const alt = p.locator('.tl-list a').filter({ hasText: 'chapter proof PDF' }).first();
  await alt.focus();
  const altFocus = await p.evaluate(() => document.activeElement.textContent);
  await p.keyboard.press('Tab');
  const tabContained = await p.evaluate(() => !!document.activeElement.closest('#timeline'));
  await p.locator('.tl-it[data-id="n:daoism-reference"]').click();
  const detail = await p.locator('.tl-info').innerText();
  const proof = p.locator('.tl-info a').filter({ hasText: 'chapter proof PDF' }).first();
  await proof.focus();
  const proofState = await proof.evaluate(e => ({
    focused: document.activeElement === e,
    href: e.href,
    visible: e.getBoundingClientRect().right <= innerWidth,
  }));
  await p.screenshot({ path: out + width + '-daoism-details.jpg', type: 'jpeg', quality: 60 });
  await p.keyboard.press('Escape');
  results.push({
    width,
    stages,
    listHasProof: list.includes('chapter proof PDF'),
    listHasScope: list.includes('printed pp 34–36, 44–46'),
    detail,
    proofState,
    altFocus,
    tabContained,
    closed: await p.locator('#timeline').evaluate(e => e.hidden),
  });
  await c.close();
}
await b.close();
writeFileSync(out + 'gutter-results.json', JSON.stringify({ results, errors }, null, 2));
console.log(
  JSON.stringify({
    errors,
    results: results.map(r => ({
      width: r.width,
      stages: r.stages.map(s => ({
        label: s.label,
        paths: s.paths.length,
        outside: s.paths.filter(x => x.right > s.gutter).length,
        overflow: s.overflow,
      })),
      listHasProof: r.listHasProof,
      listHasScope: r.listHasScope,
      detailHasProof: r.detail.includes('chapter proof PDF'),
      detailHasScope: r.detail.includes('Scope:'),
      tabContained: r.tabContained,
      closed: r.closed,
    })),
  }),
);
