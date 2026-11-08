// DWT-03 candidate repro (Claude, builder-run, 2026-11-08T16:0xZ). Reproduces the v2.1 prime() press sequence on
// Dune book 3 (Tour, Pause, then trusted Next presses each waiting only for the step label, not for the place
// entry to commit) and reports the settled state after a 20 s idle. Question: does the app end with state/URL and
// rendered place disagreeing (S.site != rendered, S.ev null) after rapid Next across different sites?
// Usage: node dwt03-dune-prime-repro.cjs <base-url> <label> [viewport WxH] [gapMs]
const { chromium } = require('playwright');
const base = process.argv[2] || 'http://127.0.0.1:4173/';
const label = process.argv[3] || base;
const [W, H] = (process.argv[4] || '1440x900').split('x').map(Number);
const gap = +(process.argv[5] || 0);
const st = p =>
  p.evaluate(() => {
    const A = window.__atlas;
    const P = A.PLACES && A.PLACES.place;
    return {
      view: A.S.view,
      sel: A.S.sel,
      site: A.S.site,
      ev: A.S.ev,
      hash: location.hash,
      rendered: P && P.site ? P.site.id : null,
      fade: document.querySelector('#fade').classList.contains('on'),
      tourN: (document.querySelector('#tourN') || {}).textContent || '',
      pause: (document.querySelector('#tourBox [data-tour="pause"]') || {}).textContent || '',
    };
  });
const b2 = s =>
  `step=${s.tourN} view=${s.view} site=${s.site} rendered=${s.rendered} ev=${s.ev} fade=${s.fade} hash=${s.hash}`;
async function click(p, sel) {
  const [x, y] = await p.evaluate(sel => {
    const r = document.querySelector(sel).getBoundingClientRect();
    return [r.x + r.width / 2, r.y + r.height / 2];
  }, sel);
  await p.mouse.click(x, y);
}
async function until(p, f, ms) {
  const t = Date.now();
  let s;
  while (Date.now() - t < ms) {
    s = await st(p);
    if (f(s)) return s;
    await p.waitForTimeout(100);
  }
  return s;
}
(async () => {
  const b = await chromium.launch({
    args: ['--use-gl=swiftshader', '--enable-webgl', '--ignore-gpu-blocklist', '--enable-unsafe-swiftshader'],
  });
  const p = await b.newPage({ viewport: { width: W, height: H } });
  const errs = [];
  p.on('pageerror', e => errs.push(String(e)));
  await p.goto(base + 'atlas/?pack=dune#book=3&world=arrakis&view=surface', { waitUntil: 'domcontentloaded' });
  await p.waitForFunction(() => window.__atlas && window.__atlas.PLACES, null, { timeout: 30000 });
  await p.waitForTimeout(3000);
  console.log('target ' + label + ' ' + W + 'x' + H + ' gap=' + gap);
  const list = await p.evaluate(() => (window.__atlas.EVENTS ? null : null));
  await click(p, '#tourBtn');
  await until(p, s => /\d+ \/ \d+/.test(s.tourN), 8000);
  await click(p, '#tourBox [data-tour="pause"]');
  await until(p, s => /Play/.test(s.pause), 1500);
  for (let k = 1; k < 12; k++) {
    await click(p, '#tourBox [data-tour="next"]');
    await until(p, s => s.tourN.startsWith(k + 1 + ' /'), 3000);
    if (gap) await p.waitForTimeout(gap);
    console.log('after Next ' + k + ': ' + b2(await st(p)));
  }
  await p.waitForTimeout(20000);
  const s = await st(p);
  const ok = s.site === s.rendered && s.ev !== null && !s.fade;
  console.log((ok ? 'PASS' : 'FAIL') + ' settled 20 s after last press: ' + b2(s));
  // settled reference: one fresh Prev then Next with full settle
  console.log('page errors: ' + (errs.length ? errs.join(' | ') : 'none'));
  await b.close();
  process.exit(ok ? 0 : 1);
})();
