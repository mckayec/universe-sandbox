// Checkpoint 9 probe: TL-R08 (record details carry the full X08 citation: inspected routes and page scope)
// and TL-R09 (a visible undated-bracket legend on phones).
// Serve the build (pnpm build && pnpm preview --port 4195) and run: node docs/reviews/synchronoptic-timelines/tl9/tl9-probe.mjs
import { chromium } from 'playwright';
import { writeFileSync } from 'node:fs';

const out = new URL('.', import.meta.url).pathname;
const SIZES = [
  [390, 844],
  [1440, 900],
  [3840, 2160],
];
const results = [];
const errors = [];
const check = (name, pass, actual) => {
  results.push({ name, pass: !!pass, actual });
  console.log((pass ? 'PASS ' : 'FAIL ') + name + ' ' + JSON.stringify(actual));
};
const b = await chromium.launch({
  ...(process.env.CHROME_PATH ? { executablePath: process.env.CHROME_PATH } : {}),
  args: ['--no-sandbox', '--use-gl=swiftshader', '--enable-webgl', '--ignore-gpu-blocklist'],
});
const hasX08 = async loc => {
  const links = await loc.locator('a').evaluateAll(as => as.map(a => a.textContent + ' ' + a.getAttribute('href')));
  const text = await loc.innerText();
  return {
    proof: links.some(t => /chapter proof PDF https:\/\/maracas/.test(t)),
    scope: /Scope: .*printed pp 34–36, 44–46/.test(text),
  };
};
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
    // TL-R09: the overview legend explains the gutter brackets and is actually visible at this size
    const leg = p.locator('.tl-info .tl-undated');
    const box = await leg.boundingBox();
    const legText = box ? await leg.innerText() : '';
    check(
      width + ' overview shows the undated-bracket legend',
      (await leg.isVisible()) &&
        box &&
        box.width > 0 &&
        box.x >= 0 &&
        box.x + box.width <= width + 1 &&
        /not dated/.test(legText),
      { box, legText },
    );
    if (phone) await p.screenshot({ path: out + '390-overview.jpg', type: 'jpeg', quality: 62 });
    // relationship list keeps the inspected route and scope
    await p.locator('#timeline [data-mode="list"]').click();
    const listRow = p.locator('.tl-list .tl-edges > li', { hasText: 'X08' }).first();
    const l = await hasX08(listRow);
    check(width + ' list: X08 proof route and page scope', l.proof && l.scope, l);
    // TL-R08: Daoism record details now carry the same route and scope
    const item = p.locator('.tl-it[data-id="n:daoism-reference"]');
    if (phone) await item.tap();
    else await item.click();
    const info = p.locator('.tl-info');
    await info.locator('.tl-edges').waitFor();
    const dRow = info.locator('.tl-edges > li', { hasText: 'X08' }).first();
    const d = await hasX08(dRow);
    check(width + ' details: X08 proof route and page scope', d.proof && d.scope, d);
    const overflow = await p.evaluate(
      () =>
        [...document.querySelectorAll('#timeline .tl-info .tl-cite, #timeline .tl-info .tl-scope')].filter(
          x => x.getBoundingClientRect().right > window.innerWidth + 1,
        ).length,
    );
    check(width + ' details: no citation/scope runs off screen', overflow === 0, overflow);
    // keyboard: the proof link in details is reachable by Tab and stays inside the dialog
    const proof = dRow.locator('a', { hasText: 'chapter proof PDF' });
    await proof.focus();
    const focused = await p.evaluate(
      () => document.activeElement.textContent + '|' + !!document.activeElement.closest('#timeline'),
    );
    check(width + ' details: proof link focusable inside the dialog', /chapter proof PDF\|true/.test(focused), focused);
    await dRow.scrollIntoViewIfNeeded();
    await p.screenshot({ path: out + width + '-daoism-details.jpg', type: 'jpeg', quality: phone ? 62 : 55 });
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
