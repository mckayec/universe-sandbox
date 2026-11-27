// SA05-N2-PORT rendered probe (Playwright + software GL). Reads the DOM title attribute of the legacy bucket-8
// book button (#books button[data-b="8"]) at 1440x900 and 390x844 in three entry states, plus the separate
// Dawnshard registry year label in the Reading panel. DOM attribute assertions only: no hover tooltip is
// rendered or screenshotted by this probe. Usage: node sa05n2-probe.mjs <baseUrl> [shotDir]
import { chromium } from 'playwright';
const [base = 'http://127.0.0.1:4173', shotDir] = process.argv.slice(2);
const browser = await chromium.launch({
  executablePath: process.env.CHROME_PATH || undefined,
  args: ['--use-gl=swiftshader', '--enable-webgl', '--ignore-gpu-blocklist'],
});
let pass = 0,
  fail = 0;
const ok = (c, msg) => {
  if (c) pass++;
  else {
    fail++;
    console.log('FAIL', msg);
  }
};
const VP = [
  ['1440x900', { viewport: { width: 1440, height: 900 } }],
  ['390x844', { viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, deviceScaleFactor: 1 }],
];
for (const [vn, opts] of VP) {
  const ctx = await browser.newContext(opts);
  for (const hash of ['', '#book=8', '#book=7']) {
    const p = await ctx.newPage();
    const errors = [];
    p.on('pageerror', e => errors.push(String(e)));
    p.on('console', m => m.type() === 'error' && errors.push(m.text()));
    await p.goto(base + '/atlas/index.html?pack=cosmere' + hash);
    await p.waitForFunction(() => !!window.__atlas, null, { timeout: 120000, polling: 250 });
    await p.waitForTimeout(400);
    const t8 = await p.$eval('#books button[data-b="8"]', e => e.getAttribute('title'));
    const t9 = await p.$eval('#books button[data-b="9"]', e => e.getAttribute('title'));
    const lbl = vn + ' ' + (hash || 'All');
    console.log(lbl, JSON.stringify({ t8, t9 }));
    ok(t8 === 'Oathbringer & Dawnshard (2017–2020)', lbl + ' bucket-8 title range');
    ok(!/\(2017\)/.test(t8), lbl + ' old "(2017)" title absent');
    ok(t9 === 'Rhythm of War (2020)', lbl + ' bucket-9 title unchanged');
    if (hash === '') {
      if (await p.$eval('#rdPanel', e => e.hidden)) await p.click('#rdBtn');
      await p.waitForTimeout(300);
      const ds = await p.$$eval('#rdPanel [data-work="dawnshard"]', a =>
        a.map(x => (x.closest('label') || x.parentElement).textContent).join('|'),
      );
      console.log(lbl, 'dawnshard label', JSON.stringify(ds));
      ok(/2020/.test(ds) && !/2017/.test(ds), lbl + ' separate Dawnshard work label 2020');
      if (shotDir) await p.screenshot({ path: shotDir + '/sa05n2-' + vn + '.png' });
    }
    ok(errors.length === 0, lbl + ' no console/page errors: ' + errors.join(' ; '));
    await p.close();
  }
  await ctx.close();
}
await browser.close();
console.log(`sa05n2-probe: ${pass}/${pass + fail} pass`);
process.exit(fail ? 1 : 0);
