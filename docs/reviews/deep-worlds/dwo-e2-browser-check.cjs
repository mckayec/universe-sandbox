// DWO-E2 rendered matrix (SwiftShader) for PR37 atlas/deep-worlds.
// Usage: node dwo-e2-browser-check.cjs http://127.0.0.1:4173/   (built dist served by vite preview)
// Strict predicates: every scenario waits for the exact expected state (or reports a timeout as FAIL),
// requires the rendered place (AtlasPlaces.place.site.id) and rendered landmark focus to match state,
// requires zero page errors, and detects document navigation with a per-document marker so a Back that
// leaves the app fails instead of being skipped. Exits 1 on any FAIL, 2 on harness error.
const { chromium } = require('playwright');
const base = process.argv[2] || 'http://127.0.0.1:4173/';
let fails = 0,
  passes = 0;
const log = (ok, m) => {
  console.log((ok ? 'PASS ' : 'FAIL ') + m);
  if (ok) passes++;
  else fails++;
};

const st = p =>
  p.evaluate(() => {
    const A = window.__atlas;
    const P = A.PLACES && A.PLACES.place;
    return {
      mark: window.__dwoMark || null,
      view: A.S.view,
      sel: A.S.sel,
      site: A.S.site,
      lm: A.S.lm,
      ev: A.S.ev,
      book: A.S.book,
      hash: location.hash,
      hs: history.state,
      rendered: P && P.site ? P.site.id : null,
      renderedLm: P ? P.sel || null : null,
      lmIds: P && P.lms ? P.lms.map(l => l.id) : null,
      dossier: (document.querySelector('#dossier') || {}).textContent || '',
      tourN: (document.querySelector('#tourN') || {}).textContent || '',
      tourT: (document.querySelector('#tourT') || {}).textContent || '',
      evs: [...document.querySelectorAll('#track .ev')].map(b => b.dataset.ev),
      // chronicle is cumulative (books <= current); the tour is the current book only (engine tourList)
      evsCur: document.querySelectorAll('#track .book:not(.past):not(.locked) .ev').length,
    };
  });

// wait until fn(state) is true; returns [ok, lastState]
async function until(p, fn, ms = 20000) {
  const t0 = Date.now();
  let s = null;
  while (Date.now() - t0 < ms) {
    try {
      s = await st(p);
      if (fn(s)) return [true, s];
    } catch (e) {
      s = { error: String(e) };
    }
    await p.waitForTimeout(250);
  }
  return [false, s];
}
const brief = s =>
  s && !s.error
    ? `view=${s.view} sel=${s.sel} site=${s.site} lm=${s.lm} ev=${s.ev} book=${s.book} rendered=${s.rendered} renderedLm=${s.renderedLm} hash=${s.hash}`
    : JSON.stringify(s);

async function open(b, vp, url) {
  const p = await b.newPage({ viewport: vp });
  const errs = [];
  p.on('pageerror', e => errs.push(String(e)));
  p.on('console', m => {
    if (m.type() === 'error') errs.push(m.text());
  });
  await p.goto(base + url, { waitUntil: 'domcontentloaded', timeout: 30000 });
  await p.waitForFunction(() => window.__atlas, null, { timeout: 30000 });
  await p.evaluate(() => {
    window.__dwoMark = 'doc-' + Math.random().toString(36).slice(2);
  });
  await p.waitForTimeout(4000); // splash + intro flight settle before the first click
  return { p, errs, mark: (await st(p)).mark };
}
const clickEv = (p, id) =>
  p.evaluate(id => {
    const b = document.querySelector('#track .ev[data-ev="' + id + '"]');
    if (!b) throw new Error('no chronicle button ' + id);
    b.click();
  }, id);
const clickLm = (p, id) =>
  p.evaluate(id => {
    const b = document.querySelector('#dossier [data-lm="' + id + '"]');
    if (!b) throw new Error('no dossier landmark button ' + id);
    b.click();
  }, id);
const errLine = (L, tag, errs) =>
  log(errs.length === 0, `${L} ${tag} page errors: ${errs.length ? errs.join(' | ') : 'none'}`);

async function duneDirect(b, L, vp) {
  // D1 stale lm=conservatory link -> Arrakeen place renders, no conservatory copy, residency selectable
  const { p, errs, mark } = await open(b, vp, 'atlas/?pack=dune#book=1&world=arrakis&site=arrakeen&view=place&lm=conservatory');
  const [ok, s] = await until(p, s => s.view === 'place' && s.site === 'arrakeen' && s.rendered === 'arrakeen', 60000);
  log(ok, `${L} D1 stale conservatory link renders Arrakeen place (${brief(s)})`);
  log(ok && s.lm == null && s.renderedLm == null, `${L} D1 stale lm dropped in state and render (lm=${s.lm}, renderedLm=${s.renderedLm})`);
  log(ok && !/conservatory|Margot/i.test(s.dossier) && !/lm=conservatory/.test(s.hash), `${L} D1 no conservatory/Margot copy or URL`);
  const ids = s.lmIds || [];
  log(ids.length > 0 && !ids.includes('conservatory') && ids.includes('residency'), `${L} D1 rendered Arrakeen landmarks exclude conservatory, include residency (${ids.join(',')})`);
  if (ok) {
    await clickLm(p, 'residency');
    const [ok2, s2] = await until(p, s => s.lm === 'residency' && s.renderedLm === 'residency', 8000);
    log(ok2 && /The Residency/.test(s2.dossier) && /lm=residency/.test(s2.hash), `${L} D1 residency positive control via dossier click (${brief(s2)})`);
  } else log(false, `${L} D1 residency positive control not reached`);
  log((await st(p)).mark === mark, `${L} D1 same document`);
  errLine(L, 'D1', errs);
  await p.close();
  // D2 valid residency direct link (positive control for the lm restore path)
  const o2 = await open(b, vp, 'atlas/?pack=dune#book=1&world=arrakis&site=arrakeen&view=place&lm=residency');
  const [ok3, s3] = await until(o2.p, s => s.view === 'place' && s.rendered === 'arrakeen' && s.lm === 'residency' && s.renderedLm === 'residency', 60000);
  log(ok3, `${L} D2 residency direct link restores place + landmark (${brief(s3)})`);
  errLine(L, 'D2', o2.errs);
  await o2.p.close();
}

async function duneNav(b, L, vp) {
  // D3 chronicle/tour exclusion at book 1, tour Stop, Back after an in-app event entry, All books
  // start on the Arrakis surface so a chronicle click enters the place and pushes an app history entry
  const { p, errs, mark } = await open(b, vp, 'atlas/?pack=dune#book=1&world=arrakis&view=surface');
  const [ok0, s] = await until(p, s => s.view === 'world' && s.sel === 'arrakis', 60000);
  log(ok0, `${L} D3 surface link settles on Arrakis (${brief(s)})`);
  log(!s.evs.includes('d15') && !s.evs.includes('d16') && s.evs.includes('d14') && s.evs.includes('d17'), `${L} D3 book1 chronicle: no d15/d16, d14/d17 present (${s.evs.length})`);
  await clickEv(p, 'd4');
  const [ok, s1] = await until(p, s => s.view === 'place' && s.rendered === 'arrakeen' && s.ev === 'd4' && s.lm === 'residency' && s.renderedLm === 'residency', 60000);
  log(ok, `${L} D3 chronicle d4 enters Arrakeen at the Residency (${brief(s1)})`);
  await p.evaluate(() => history.back());
  const [ok2, s2] = await until(p, s => s.view === 'world' && s.sel === 'arrakis' && /view=surface/.test(s.hash), 15000);
  log(ok2 && s2.mark === mark && s2.rendered == null, `${L} D3 Back returns to Arrakis surface in the same document (${brief(s2)})`);
  await p.evaluate(() => document.querySelector('#tourBtn').click());
  const [ok3, s3] = await until(p, s => /\d+ \/ \d+/.test(s.tourN), 8000);
  const total = ok3 ? parseInt(s3.tourN.split('/')[1], 10) : -1;
  log(total === s.evs.length, `${L} D3 tour length ${total} equals chronicle ${s.evs.length}`);
  const seen = [];
  for (let i = 0; i < Math.max(0, total); i++) {
    const t = await st(p);
    seen.push(t.tourT);
    if (i < total - 1) await p.evaluate(() => document.querySelector('[data-tour="next"]').click());
    await p.waitForTimeout(150);
  }
  log(seen.length === total && seen.every(x => x && !/hunter-seeker|hidden warning/i.test(x)), `${L} D3 all ${seen.length} tour steps exclude d15/d16 titles`);
  await p.evaluate(() => document.querySelector('[data-tour="stop"]').click());
  const settled = await until(p, s => s.mark === mark && (s.view !== 'place' || s.rendered === s.site), 15000);
  log(settled[0], `${L} D3 tour Stop settles with render matching state (${brief(settled[1])})`);
  await p.evaluate(() => window.__atlas.setBook(0));
  const [ok5, s5] = await until(p, s => s.book === 0, 8000);
  log(ok5 && !s5.evs.includes('d15') && !s5.evs.includes('d16'), `${L} D3 All-books chronicle has no d15/d16 (${s5.evs.length})`);
  log((await st(p)).mark === mark, `${L} D3 same document`);
  errLine(L, 'D3', errs);
  await p.close();
}

const CASES = [
  ['e70', 2, 1, 'scadrial', 'luthadel', 'Elend is deposed'],
  ['e102', 8, 7, 'roshar', 'kholinar', 'The Cult of Moments'],
];
async function cosmere(b, L, vp, [id, bk, below, world, site, title]) {
  // start on the world surface: a chronicle click there enters the place (from the galaxy it only selects)
  const { p, errs, mark } = await open(b, vp, `atlas/?pack=cosmere#book=${bk}&world=${world}&view=surface`);
  const [ok0, s0] = await until(p, s => s.view === 'world' && s.sel === world, 60000);
  log(ok0, `${L} ${id} surface link settles on ${world} (${brief(s0)})`);
  log(s0.evs.includes(id), `${L} ${id} at gate book${bk}: chronicle lists it`);
  await clickEv(p, id);
  const [ok, s1] = await until(p, s => s.view === 'place' && s.sel === world && s.site === site && s.rendered === site && s.ev === id, 60000);
  log(ok && s1.dossier.includes(title) && s1.lm == null && s1.renderedLm == null && !/lm=/.test(s1.hash), `${L} ${id} chronicle click renders ${site} place, no landmark (${brief(s1)})`);
  await p.evaluate(() => history.back());
  const [ok2, s2] = await until(p, s => s.view === 'world' && s.sel === world && /view=surface/.test(s.hash), 15000);
  log(ok2 && s2.mark === mark && s2.rendered == null, `${L} ${id} Back returns to ${world} surface in the same document (${brief(s2)})`);
  // tour at gate reaches the event, rendered at the right place
  await p.evaluate(() => document.querySelector('#tourBtn').click());
  const [okT, sT] = await until(p, s => /\d+ \/ \d+/.test(s.tourN), 8000);
  const total = okT ? parseInt(sT.tourN.split('/')[1], 10) : -1;
  let hit = -1;
  for (let i = 0; i < Math.max(0, total); i++) {
    if ((await st(p)).tourT === title) {
      hit = i;
      break;
    }
    await p.evaluate(() => document.querySelector('[data-tour="next"]').click());
    await p.waitForTimeout(120);
  }
  log(total === s0.evsCur && hit >= 0, `${L} ${id} tour (${total} steps = current-book chronicle ${s0.evsCur}) reaches "${title}" at step ${hit + 1}`);
  if (hit >= 0) {
    await p.evaluate(() => document.querySelector('[data-tour="pause"]').click());
    const [ok3, s3] = await until(p, s => s.view === 'place' && s.site === site && s.rendered === site && s.ev === id, 60000);
    log(ok3 && s3.lm == null && s3.renderedLm == null, `${L} ${id} tour step renders ${site} with no landmark (${brief(s3)})`);
  } else log(false, `${L} ${id} tour step render not reached`);
  await p.evaluate(() => document.querySelector('[data-tour="stop"]').click());
  // downgrade below gate while the event is open
  await p.evaluate(b => window.__atlas.setBook(b), below);
  const [ok4, s4] = await until(p, s => s.book === below, 8000);
  await p.waitForTimeout(1500);
  const s4b = await st(p);
  log(ok4 && !s4b.evs.includes(id) && !s4b.dossier.includes(title) && s4b.ev !== id, `${L} ${id} downgrade to book${below}: gone from chronicle, dossier and state (${brief(s4b)})`);
  log(s4b.mark === mark, `${L} ${id} same document`);
  errLine(L, id + ' chronicle/tour/Back/downgrade', errs);
  await p.close();
  // direct place links: at gate resolves; below gate opens the site without the event copy
  const o = await open(b, vp, `atlas/?pack=cosmere#book=${bk}&world=${world}&site=${site}&view=place`);
  const [ok5, s5] = await until(o.p, s => s.view === 'place' && s.sel === world && s.site === site && s.rendered === site, 60000);
  log(ok5 && s5.lm == null, `${L} ${id} direct place link at gate renders ${site} (${brief(s5)})`);
  errLine(L, id + ' direct link', o.errs);
  await o.p.close();
  const o2 = await open(b, vp, `atlas/?pack=cosmere#book=${below}&world=${world}&site=${site}&view=place`);
  const [, s6] = await until(o2.p, s => s.view === 'place' && s.rendered === site, 60000);
  log(!s6.dossier.includes(title) && !s6.evs.includes(id), `${L} ${id} below-gate direct link (book${below}) shows no ${id} copy (${brief(s6)})`);
  errLine(L, id + ' below-gate link', o2.errs);
  await o2.p.close();
}

(async () => {
  const b = await chromium.launch({
    executablePath: process.env.CHROME_PATH || undefined,
    args: ['--use-gl=swiftshader', '--enable-webgl', '--ignore-gpu-blocklist', '--enable-unsafe-swiftshader'],
  });
  for (const [L, vp] of [
    ['1440x900', { width: 1440, height: 900 }],
    ['390x844', { width: 390, height: 844 }],
  ]) {
    await duneDirect(b, L, vp);
    await duneNav(b, L, vp);
    for (const c of CASES) await cosmere(b, L, vp, c);
  }
  await b.close();
  console.log(fails ? `FAILED ${fails} (passed ${passes})` : `ALL PASS ${passes}`);
  process.exit(fails ? 1 : 0);
})().catch(e => {
  console.error('HARNESS ERROR', e);
  process.exit(2);
});
