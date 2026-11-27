// DWT-02 rendered qualification (Claude, builder-run). Real Chromium (SwiftShader) against a `pnpm build`
// served by `vite preview`; real Playwright pointer clicks on the tour controls (no programmatic goEvent).
// Usage: node dwt02-rendered-probe.cjs <base-url> <label>   e.g. http://127.0.0.1:4173/ head
//
// How the identical pending request is produced in the real UI: tourStep() clamps at the ends of the tour,
// so pressing Next on the last step re-issues goEvent() for the same last event. Cosmere book 10 has a
// two-event tour, e47 (Scadrial / Bilming) then e48 (Scadrial / Elendel): same world, different enterable
// sites. Starting on e47 (rendered), Next -> e48 pending; Next again before the 430 ms fade commits is the
// identical repeat. A second destination pair (Dune book 3, last two tour steps, Arrakis fane -> keep) is
// reached by stepping the tour to the second-to-last step first.
//
// Timing is measured in the page: capture-phase click timestamps and the #fade "on" class toggles.
// "pre-commit" = the second click landed before the first fade completed (rendered site still the old one).
const { chromium } = require('playwright');
const base = process.argv[2] || 'http://127.0.0.1:4173/';
const label = process.argv[3] || base;
// optional filter, e.g. "1440x900:cosmere-b10" (runs are slow under SwiftShader; run one browser at a time)
const only = process.argv[4] || '';
let fails = 0,
  passes = 0;
const log = (ok, m) => {
  console.log((ok ? 'PASS ' : 'FAIL ') + m);
  if (ok) passes++;
  else fails++;
};
const note = m => console.log('NOTE ' + m);

const st = p =>
  p.evaluate(() => {
    const A = window.__atlas;
    const P = A.PLACES && A.PLACES.place;
    return {
      view: A.S.view,
      sel: A.S.sel,
      site: A.S.site,
      ev: A.S.ev,
      book: A.S.book,
      hash: location.hash,
      hlen: history.length,
      rendered: P && P.site ? P.site.id : null,
      fadeOn: document.querySelector('#fade').classList.contains('on'),
      tourOn: !document.querySelector('#tourBox').hidden,
      tourN: (document.querySelector('#tourN') || {}).textContent || '',
      tourT: (document.querySelector('#tourT') || {}).textContent || '',
      enters: window.__dwtEnters ? window.__dwtEnters.slice() : [],
      enterT: window.__dwtEnterT || [],
      clicks: window.__dwtClicks ? window.__dwtClicks.slice() : [],
      fades: window.__dwtFades ? window.__dwtFades.slice() : [],
    };
  });
async function until(p, fn, ms = 20000) {
  const t0 = Date.now();
  let s = null;
  while (Date.now() - t0 < ms) {
    s = await st(p);
    if (fn(s)) return [true, s];
    await p.waitForTimeout(100);
  }
  return [false, s];
}
const brief = s =>
  `view=${s.view} sel=${s.sel} site=${s.site} rendered=${s.rendered} ev=${s.ev} hash=${s.hash} hlen=${s.hlen} tour=${s.tourOn ? s.tourN : 'off'} builds=${s.enters.join(',') || '-'}`;

async function open(b, vp, url) {
  const p = await b.newPage({ viewport: vp });
  const errs = [];
  p.on('pageerror', e => errs.push(String(e)));
  p.on('console', m => {
    if (m.type() === 'error') errs.push(m.text());
  });
  await p.goto(base + url, { waitUntil: 'domcontentloaded', timeout: 30000 });
  await p.waitForFunction(() => window.__atlas && window.__atlas.PLACES, null, { timeout: 30000 });
  await p.evaluate(() => {
    // instrumentation only: record timestamps and place builds; behaviour is untouched
    window.__dwtClicks = [];
    window.__dwtFades = [];
    window.__dwtEnters = [];
    document.addEventListener(
      'click',
      e => {
        const t = e.target.closest && e.target.closest('[data-tour],#tourBtn');
        if (t) window.__dwtClicks.push([t.dataset.tour || 'tourBtn', performance.now(), e.isTrusted]);
      },
      true,
    );
    const f = document.querySelector('#fade');
    new MutationObserver(() =>
      window.__dwtFades.push([f.classList.contains('on') ? 'on' : 'off', performance.now()]),
    ).observe(f, {
      attributes: true,
      attributeFilter: ['class'],
    });
    const P = window.__atlas.PLACES;
    const enter = P.enter.bind(P);
    P.enter = (w, s, ...r) => {
      window.__dwtEnters.push(s && s.id);
      window.__dwtEnterT = (window.__dwtEnterT || []).concat([performance.now()]);
      return enter(w, s, ...r);
    };
  });
  await p.waitForTimeout(3000); // splash + intro settle
  return { p, errs };
}
const clear = p =>
  p.evaluate(() => {
    window.__dwtClicks.length = 0;
    window.__dwtFades.length = 0;
    window.__dwtEnters.length = 0;
    window.__dwtEnterT = [];
  });
// Trusted pointer input via page.mouse at the control's centre. (page.click's actionability wait never
// resolves under SwiftShader with the render loop running, so the coordinates are read first.)
async function tourClick(p, k) {
  const sel = k === 'tourBtn' ? '#tourBtn' : `#tourBox [data-tour="${k}"]`;
  const [x, y] = await p.evaluate(sel => {
    const r = document.querySelector(sel).getBoundingClientRect();
    if (!r.width || !r.height) throw new Error('control not visible: ' + sel);
    return [r.x + r.width / 2, r.y + r.height / 2];
  }, sel);
  await p.mouse.click(x, y);
}

// Bring the tour to step `idx` (1-based) of `total`, rendered in place at `site`, then pause it so the
// auto-advance timer cannot interfere.
async function prime(p, L, tag, idx, ev, site) {
  await tourClick(p, 'tourBtn');
  await until(p, s => s.tourOn && /\d+ \/ \d+/.test(s.tourN), 8000);
  await tourClick(p, 'pause');
  for (let i = 1; i < idx; i++) {
    await tourClick(p, 'next');
    await p.waitForTimeout(150);
  }
  const [ok, s] = await until(
    p,
    s => s.view === 'place' && s.ev === ev && s.site === site && s.rendered === site && !s.fadeOn,
    60000,
  );
  log(ok, `${L} ${tag} primed: tour step ${idx} rendered in place at ${site} with ${ev} (${brief(s)})`);
  await p.waitForTimeout(800);
  return ok;
}

// timing summary for the last action burst
function timing(s) {
  const c = s.clicks;
  const on = s.fades.find(f => f[0] === 'on');
  const off = s.fades.find(f => f[0] === 'off');
  const gaps = c.map(x => (x[1] - c[0][1]).toFixed(0) + 'ms:' + x[0] + (x[2] ? '' : '(untrusted)'));
  const build = s.enterT && s.enterT.length ? s.enterT.map(t => (t - c[0][1]).toFixed(0)).join('/') : 'none';
  return {
    build,
    gaps: gaps.join(' '),
    firstFadeOn: on ? (on[1] - c[0][1]).toFixed(0) : null,
    firstFadeOff: off ? (off[1] - c[0][1]).toFixed(0) : null,
    trusted: c.every(x => x[2]),
  };
}

async function pair(b, L, vp, P) {
  const { tag, url, idx, from, fromEv, to, toEv } = P;
  // C0 positive control: a single Next arrives
  {
    const { p, errs } = await open(b, vp, url);
    if (await prime(p, L, tag + ' C0', idx, fromEv, from)) {
      const h0 = (await st(p)).hlen;
      await clear(p);
      await tourClick(p, 'next');
      const [ok, s] = await until(p, s => s.ev === toEv && s.site === to && s.rendered === to && !s.fadeOn, 20000);
      await p.waitForTimeout(1000);
      const s2 = await st(p);
      log(
        ok && s2.rendered === to && s2.enters.join() === to && new RegExp('site=' + to + '&').test(s2.hash),
        `${L} ${tag} C0 control: single Next arrives once at ${to}/${toEv} (${brief(s2)}; hlen ${h0}->${s2.hlen})`,
      );
      P.singleHlenDelta = s2.hlen - h0;
    }
    log(errs.length === 0, `${L} ${tag} C0 page errors: ${errs.join(' | ') || 'none'}`);
    await p.close();
  }
  // R1 identical repeat while pending: Next, Next (clamped at last step -> same event)
  for (const n of [2, 3]) {
    const { p, errs } = await open(b, vp, url);
    if (await prime(p, L, `${tag} R${n}x`, idx, fromEv, from)) {
      const h0 = (await st(p)).hlen;
      await clear(p);
      await tourClick(p, 'next');
      const pre = [];
      for (let i = 1; i < n; i++) {
        pre.push((await st(p)).rendered);
        await tourClick(p, 'next');
      }
      await p.waitForTimeout(3500);
      const s = await st(p);
      const tm = timing(s);
      note(
        `${L} ${tag} R${n}x timing: clicks ${tm.gaps}; first fade on +${tm.firstFadeOn}ms off +${tm.firstFadeOff}ms; place build(s) at +${tm.build}ms; rendered before repeat(s)=${pre.join(',')}; trusted=${tm.trusted}; fades=${s.fades.map(f => f[0]).join(',')}`,
      );
      const arrived =
        s.view === 'place' &&
        s.site === to &&
        s.rendered === to &&
        s.ev === toEv &&
        new RegExp('site=' + to + '&').test(s.hash) &&
        !s.fadeOn;
      log(
        pre.every(r => r === from),
        `${L} ${tag} R${n}x repeat(s) issued while first entry pending (rendered still ${from})`,
      );
      log(
        arrived && s.enters.join() === to,
        `${L} ${tag} R${n}x ${n} identical Next presses arrive exactly once at ${to}/${toEv} (${brief(s)})`,
      );
      log(
        s.hlen - h0 === P.singleHlenDelta,
        `${L} ${tag} R${n}x history length delta ${s.hlen - h0} equals single-Next control ${P.singleHlenDelta}`,
      );
    }
    log(errs.length === 0, `${L} ${tag} R${n}x page errors: ${errs.join(' | ') || 'none'}`);
    await p.close();
  }
  // R6 repeat then Stop before commit: committed place restored; then fresh retry arrives
  {
    const { p, errs } = await open(b, vp, url);
    if (await prime(p, L, tag + ' R6', idx, fromEv, from)) {
      const s0 = await st(p);
      await clear(p);
      await tourClick(p, 'next');
      await tourClick(p, 'next');
      const pre = (await st(p)).rendered;
      await tourClick(p, 'stop');
      await p.waitForTimeout(3500);
      const s = await st(p);
      const tm = timing(s);
      note(
        `${L} ${tag} R6 timing: clicks ${tm.gaps}; first fade on +${tm.firstFadeOn}ms off +${tm.firstFadeOff}ms; place build(s) at +${tm.build}ms; rendered before Stop=${pre}; trusted=${tm.trusted}`,
      );
      log(pre === from, `${L} ${tag} R6 Stop pressed while entry pending (rendered still ${from})`);
      log(
        !s.tourOn &&
          s.view === 'place' &&
          s.site === from &&
          s.rendered === from &&
          s.hash === s0.hash &&
          s.hlen === s0.hlen &&
          s.enters.length === 0 &&
          !s.fadeOn,
        `${L} ${tag} R6 Next,Next,Stop restores committed ${from} (state, render, URL, history), nothing built (${brief(s)}; ev ${s0.ev}->${s.ev})`,
      );
      // R6b fresh retry: restart the tour (step 1) and press Next once
      await clear(p);
      await tourClick(p, 'tourBtn');
      await until(p, s => s.tourOn, 8000);
      await tourClick(p, 'pause');
      for (let i = 1; i < idx; i++) {
        await tourClick(p, 'next');
        await p.waitForTimeout(150);
      }
      await until(p, s => s.ev === fromEv && s.rendered === from && !s.fadeOn, 20000);
      await p.waitForTimeout(800);
      await tourClick(p, 'next');
      const [ok, s2] = await until(p, s => s.ev === toEv && s.rendered === to && s.site === to && !s.fadeOn, 20000);
      log(ok, `${L} ${tag} R6b fresh retry after Stop arrives at ${to}/${toEv} (${brief(s2)})`);
    }
    log(errs.length === 0, `${L} ${tag} R6 page errors: ${errs.join(' | ') || 'none'}`);
    await p.close();
  }
}

const PAIRS = [
  {
    tag: 'cosmere-b10',
    url: 'atlas/?pack=cosmere#book=10&world=scadrial&view=surface',
    idx: 1,
    from: 'bilming',
    fromEv: 'e47',
    to: 'elendel',
    toEv: 'e48',
  },
  {
    tag: 'dune-b3',
    url: 'atlas/?pack=dune#book=3&world=arrakis&view=surface',
    idx: 12,
    from: 'fane',
    fromEv: 'c6',
    to: 'keep',
    toEv: 'c7',
  },
];

(async () => {
  const b = await chromium.launch({
    executablePath: process.env.CHROME_PATH || undefined,
    args: ['--use-gl=swiftshader', '--enable-webgl', '--ignore-gpu-blocklist', '--enable-unsafe-swiftshader'],
  });
  console.log('target ' + label + ' ' + base);
  for (const [L, vp] of [
    ['1440x900', { width: 1440, height: 900 }],
    ['390x844', { width: 390, height: 844 }],
  ])
    for (const P of PAIRS) if (!only || only === L + ':' + P.tag) await pair(b, L, vp, { ...P });
  await b.close();
  console.log(fails ? `FAILED ${fails} (passed ${passes})` : `ALL PASS ${passes}`);
  process.exit(fails ? 1 : 0);
})().catch(e => {
  console.error('HARNESS ERROR', e);
  process.exit(2);
});
