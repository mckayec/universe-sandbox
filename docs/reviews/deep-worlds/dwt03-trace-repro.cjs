// DWT-03 candidate repro (Claude, builder-run, 2026-11-08T16:0xZ). Reproduces the v2.1 prime() press sequence on
// Dune book 3 (Tour, Pause, then trusted Next presses each waiting only for the step label, not for the place
// entry to commit) and reports the settled state after a 20 s idle. Question: does the app end with state/URL and
// rendered place disagreeing (S.site != rendered, S.ev null) after rapid Next across different sites?
// v2 (2026-11-08T16:55Z): st() bounded by a 15 s race (a busy SwiftShader main thread can starve evaluate);
// settle sampled at +5/+20/+40/+60 s so a transient pending entry is not mistaken for a split state.
// Usage: node dwt03-dune-prime-repro.cjs <base-url> <label> [viewport WxH] [gapMs]
const { chromium } = require('playwright');
const base = process.argv[2] || 'http://127.0.0.1:4173/';
const label = process.argv[3] || base;
const [W, H] = (process.argv[4] || '1440x900').split('x').map(Number);
const gap = +(process.argv[5] || 0);
const st0 = p =>
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
const st = p =>
  Promise.race([st0(p), new Promise(r => setTimeout(() => r({ tourN: '', pause: '', timeout: true }), 15000))]);
const b2 = s =>
  s.timeout ? 'EVALUATE-TIMEOUT(15s)' :
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
  await p.addInitScript(() => {
    window.__trace = [];
    for (const k of ['pushState', 'replaceState']) {
      const o = History.prototype[k];
      History.prototype[k] = function (a, b, u) {
        const st = (new Error().stack || '').split('\n').slice(2, 6).map(x => x.trim().replace(/^at /, '').replace(/https?:\/\/[^/]+/, '')).join(' < ');
        window.__trace.push(Math.round(performance.now()) + ' ' + k + ' ' + String(u).replace(/^.*#/, '#') + ' :: ' + st);
        return o.call(this, a, b, u);
      };
    }
  });
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
  let s, ok = false, waited = 0;
  for (const t of (process.env.SETTLE||'5000,15000,20000,20000').split(',').map(Number)) {
    await p.waitForTimeout(t);
    waited += t;
    s = await st(p);
    ok = !s.timeout && s.site === s.rendered && s.ev !== null && !s.fade;
    console.log('settle +' + waited / 1000 + ' s: ' + (ok ? 'consistent ' : 'NOT consistent ') + b2(s));
  }
  console.log((ok ? 'PASS' : 'FAIL') + ' final (+60 s after last press): ' + b2(s));
  try { const tr = await Promise.race([p.evaluate(() => window.__trace.slice(-25)), new Promise(r => setTimeout(() => r(['TRACE-TIMEOUT']), 20000))]); console.log('TRACE\n' + tr.join('\n')); } catch (e) { console.log('trace err ' + e); }
  // settled reference: one fresh Prev then Next with full settle
  console.log('page errors: ' + (errs.length ? errs.join(' | ') : 'none'));
  await b.close();
  process.exit(ok ? 0 : 1);
})();
