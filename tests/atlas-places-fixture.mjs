// Deep worlds R0-1: browser lifecycle check of the dormant places engine with an ISOLATED opt-in fixture.
// Run after `pnpm build`: `node tests/atlas-places-fixture.mjs` (env: CHROME_PATH, VIEWPORTS="1440x900,390x844", CASES=regexp,
// SCREENSHOTS=dir to save mid-fade and settled shots).
//
// Nothing shipped is changed: dist/ is served as built, and tests/fixtures/places-optin-fixture.js is appended to the
// Dune pack response in the browser only (route interception). The fixture opts Dune into places and gives it two
// book-1 destinations (Arrakeen, Sietch Tabr), a later-book landmark/event (fxlater / m4, book 2) and a later-book site
// (Paul's Keep, book 2). Every case checks, during the 430 ms fade and after settling, the rendered dossier, crumbs,
// live-region announcement, URL and history state, and the selected landmark/event against the DWO/DWT expectations:
//   - the rendered place (AtlasPlaces.place.site.id) and focused landmark equal S.site / S.lm once settled;
//   - no later-book name or text (dossier, chronicle, crumbs, announcement, URL) under an earlier book, even mid-fade;
//   - a superseded or cancelled entry builds nothing and leaves no place history entry; Back stays in the document;
//   - stale place links (later-book site/landmark, unknown site) never enter a hidden place and are rewritten.
//   - R0-2: after a downgrade on the surface (direct, or during a cancelled entry) the globe's site buttons carry no
//     later-book name, tab stop or aria exposure, a real Tab walk reaches none, book-1 sites stay offered, and an
//     upgrade restores the later site's label (cases S1, B3; label checks also in B2/B4).
// Exits 1 on any FAIL.
import { createReadStream, existsSync, readFileSync, statSync, mkdirSync } from 'node:fs';
import { createServer } from 'node:http';
import { extname, join, normalize } from 'node:path';
import { chromium } from 'playwright';

const dist = new URL('../dist/', import.meta.url).pathname;
if (!existsSync(join(dist, 'atlas/index.html'))) {
  console.error('atlas-places-fixture: dist/ not found. Run `pnpm build` first.');
  process.exit(2);
}
const FIXTURE = readFileSync(new URL('./fixtures/places-optin-fixture.js', import.meta.url), 'utf8');
const SHOTS = process.env.SCREENSHOTS || '';
if (SHOTS) mkdirSync(SHOTS, { recursive: true });
const VIEWPORTS = (process.env.VIEWPORTS || '1440x900,390x844').split(',').map(v => {
  const [width, height] = v.split('x').map(Number);
  return { width, height };
});
const TYPES = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css' };
const server = createServer((req, res) => {
  const url = new URL(req.url, 'http://x');
  let p = normalize(join(dist, decodeURIComponent(url.pathname)));
  if (!p.startsWith(dist)) return res.writeHead(403).end();
  if (existsSync(p) && statSync(p).isDirectory()) p = join(p, 'index.html');
  if (!existsSync(p)) return res.writeHead(404).end('not found');
  res.writeHead(200, { 'content-type': TYPES[extname(p)] || 'application/octet-stream' });
  createReadStream(p).pipe(res);
});
await new Promise(r => server.listen(0, '127.0.0.1', r));
const BASE = `http://127.0.0.1:${server.address().port}/atlas/?pack=dune`;

// later-book copy that must never be visible under book 1
const LATER = /Fixture Later Hall|Fixture Keep Tower|Paul’s Keep|The stone burner|Hayt/;
const counts = {};
let pass = 0,
  fail = 0,
  CASE = '';
const row = (ok, msg) => {
  ok ? pass++ : fail++;
  const c = (counts[CASE] = counts[CASE] || { pass: 0, fail: 0 });
  ok ? c.pass++ : c.fail++;
  console.log((ok ? 'PASS ' : 'FAIL ') + CASE + ' ' + msg);
};

const SNAP = () => {
  const A = window.__atlas;
  const P = A.PLACES && A.PLACES.place;
  const t = q => (document.querySelector(q) || {}).textContent || '';
  return {
    mark: window.__fxMark || null,
    fade: document.querySelector('#fade').classList.contains('on'),
    view: A.S.view,
    sel: A.S.sel,
    site: A.S.site,
    lm: A.S.lm,
    ev: A.S.ev,
    book: A.S.book,
    hash: location.hash,
    hs: history.state,
    hlen: history.length,
    rendered: P && P.site ? P.site.id : null,
    renderedLm: P ? P.sel || null : null,
    lmIds: P && P.lms ? P.lms.map(l => l.id) : [],
    dossier: t('#dossier'),
    crumbs: t('#crumbs'),
    ann: t('#announce'),
    chron: t('#chron'),
    tourHidden: document.querySelector('#tourBox').hidden,
    tourT: t('#tourT'),
    // R0-2: the globe's site buttons as the reader and keyboard get them
    labels: [...document.querySelectorAll('#labels .plbl')].map(el => ({
      t: el.textContent,
      op: el.style.opacity,
      tab: el.tabIndex,
      ah: el.getAttribute('aria-hidden'),
      pe: el.style.pointerEvents,
    })),
  };
};
const brief = s =>
  `view=${s.view} sel=${s.sel} site=${s.site} lm=${s.lm} ev=${s.ev} book=${s.book} rendered=${s.rendered}/${s.renderedLm} fade=${s.fade} hash=${s.hash}`;
const sleep = ms => new Promise(r => setTimeout(r, ms));

async function open(browser, vp, hash) {
  const ctx = await browser.newContext({ viewport: vp, deviceScaleFactor: 1 });
  const p = await ctx.newPage();
  const errs = [];
  p.on('pageerror', e => errs.push(String(e)));
  p.on('console', m => {
    if (m.type() === 'error' && !/WebGL|GPU stall|GL_|swiftshader/i.test(m.text())) errs.push(m.text());
  });
  // fade sampler, installed before any page script so restore-time fades are recorded too
  await p.addInitScript(src => {
    window.__SNAP = (0, eval)('(' + src + ')');
    window.__fades = [];
    const hook = f => {
      let was = f.classList.contains('on');
      new MutationObserver(() => {
        const on = f.classList.contains('on');
        if (on && !was)
          setTimeout(() => {
            try {
              window.__fades.push(window.__SNAP());
            } catch (e) {
              window.__fades.push({ error: String(e) });
            }
          }, 150);
        was = on;
      }).observe(f, { attributes: true, attributeFilter: ['class'] });
    };
    const wait = new MutationObserver(() => {
      const f = document.querySelector('#fade');
      if (f) {
        wait.disconnect();
        hook(f);
      }
    });
    document.addEventListener('DOMContentLoaded', () =>
      wait.observe(document.body, { childList: true, subtree: true }),
    );
  }, SNAP.toString());
  await p.route('**/atlas/packs/dune.js', async route => {
    const res = await route.fetch();
    await route.fulfill({ response: res, body: (await res.text()) + '\n;' + FIXTURE });
  });
  await p.goto(BASE + (hash ? '#' + hash : ''), { waitUntil: 'load' });
  await p.waitForFunction(() => window.__atlas && window.__atlas.S, null, { timeout: 60000 });
  await p.evaluate(() => {
    window.__fxMark = 'doc-' + Math.random().toString(36).slice(2);
  });
  const mark = (await p.evaluate(SNAP)).mark;
  return { ctx, p, errs, mark };
}
const snap = p => p.evaluate(SNAP);
async function until(p, fn, ms = 25000) {
  const t0 = Date.now();
  let s = null;
  while (Date.now() - t0 < ms) {
    s = await snap(p);
    if (!s.fade && fn(s)) {
      await sleep(700); // settled: no fade and stable for a beat
      const s2 = await snap(p);
      if (!s2.fade && fn(s2)) return [true, s2];
    }
    await sleep(200);
  }
  return [false, s];
}
// render equals state (DWO-E2 strict predicate)
// a later-book site id may stay in S.site while hidden (main's surface downgrade keeps it; hideUnseen/asVisible
// present and write it as no site), so settled downgrade cases check the presented site, not the raw id
const hiddenOrNull = s => s.site == null || (s.site === 'keep' && s.book === 1 && !/site=/.test(s.hash));
const consistent = s =>
  s.view === 'place' ? s.rendered === s.site && (s.lm || null) === s.renderedLm : s.rendered === null;
const shot = async (p, vp, name) => {
  if (SHOTS) await p.screenshot({ path: join(SHOTS, `${name}-${vp.width}x${vp.height}.png`) });
};
const click = (p, sel) =>
  p.evaluate(sel => {
    const b = document.querySelector(sel);
    if (!b) throw new Error('no element ' + sel);
    b.click();
  }, sel);
// mid-fade samples are recorded in the page: whenever #fade turns on, a snapshot is taken 150 ms later (inside the
// 430 ms window before the transition commits), so slow round trips cannot miss the fade. midFade() waits for the next
// sample after the last one consumed on this page.
async function midFade(p, ms = 2500) {
  const t0 = Date.now();
  p.__fadeSeen = p.__fadeSeen || 0;
  while (Date.now() - t0 < ms) {
    const n = await p.evaluate(() => window.__fades.length);
    if (n > p.__fadeSeen) {
      const s = await p.evaluate(i => window.__fades[i], p.__fadeSeen);
      p.__fadeSeen = n;
      return s;
    }
    await sleep(40);
  }
  return { ...(await snap(p)), fade: false, missed: true };
}
// every fade sample recorded on this page so far must be free of later-book copy
const allFades = async (p, tag) => {
  const fs = await p.evaluate(() => window.__fades);
  row(fs.length > 0, `${tag}: ${fs.length} fade sample(s) recorded`);
  fs.forEach((f, i) => noLater(f, `${tag} fade #${i + 1}`));
};
const skipFades = async p => (p.__fadeSeen = await p.evaluate(() => window.__fades.length));
const noLater = (s, tag) => {
  const leak = [s.dossier, s.crumbs, s.ann, s.chron, decodeURIComponent(s.hash)].find(x => LATER.test(x)) || '';
  row(
    !leak && !/site=keep|lm=fxlater|lm=fxkeep|book=2/.test(s.hash),
    `${tag}: no later-book copy or URL${leak ? ' LEAK: ' + leak.slice(0, 120) : ''} (${s.hash})`,
  );
};
// R0-2: globe labels under book 1. No .plbl may carry later-book text at all (DOM, tab stop or accessibility tree);
// with `eligible`, the book-1 sites are still offered as labels.
const ELIGIBLE = /Arrakeen|Sietch Tabr/;
const exposed = l => l.tab >= 0 || l.ah !== 'true' || (l.op !== '0' && l.op !== '') || l.pe === 'auto';
const labelCheck = (s, tag, eligible = true) => {
  const later = (s.labels || []).filter(l => LATER.test(l.t));
  row(later.length === 0, `${tag}: globe labels carry no later-book text (${later.map(l => l.t).join(',') || 'none'})`);
  const exp = later.filter(exposed);
  row(
    exp.length === 0,
    `${tag}: no later-book label focusable or exposed (${exp.map(l => `${l.t} tab=${l.tab} aria-hidden=${l.ah} op=${l.op}`).join('; ') || 'none'})`,
  );
  if (eligible) {
    const el = (s.labels || []).filter(l => ELIGIBLE.test(l.t)).map(l => l.t);
    row(el.length > 0, `${tag}: book-1 site labels still offered (${el.join(',') || 'none'})`);
  }
};
// R0-2: real keyboard traversal. Tab from the top of the document and record every focused element; no later-book
// name may be reachable, and the walk reports which globe labels it reached.
async function tabWalk(p, n = 90) {
  await p.evaluate(() => {
    document.activeElement && document.activeElement.blur && document.activeElement.blur();
    window.scrollTo(0, 0);
  });
  const seen = [];
  for (let i = 0; i < n; i++) {
    await p.keyboard.press('Tab');
    seen.push(
      await p.evaluate(() => {
        const a = document.activeElement;
        return a
          ? {
              t: (a.getAttribute('aria-label') || a.textContent || '').trim().slice(0, 60),
              plbl: a.classList.contains('plbl'),
            }
          : null;
      }),
    );
  }
  return seen.filter(Boolean);
}
const keyCheck = async (o, tag) => {
  const walk = await tabWalk(o.p);
  const later = walk.filter(w => LATER.test(w.t));
  const lbls = [...new Set(walk.filter(w => w.plbl).map(w => w.t))];
  row(
    later.length === 0,
    `${tag}: keyboard walk (${walk.length} Tab stops) reaches no later-book name${later.length ? ' LEAK: ' + later.map(w => w.t).join(',') : ''}; globe labels reached: ${lbls.join(',') || 'none'}`,
  );
  return lbls;
};
const finish = async (o, tag) => {
  row((await snap(o.p)).mark === o.mark, `${tag}: same document`);
  row(o.errs.length === 0, `${tag}: page/console errors: ${o.errs.join(' | ') || 'none'}`);
  await o.ctx.close();
};

const ONLY = process.env.CASES ? new RegExp(process.env.CASES) : null;
async function run(browser, vp) {
  const V = `${vp.width}x${vp.height}`;

  // ---- L1 valid place link (landmark restore) ----
  CASE = `[${V} L1 valid link]`;
  if (!ONLY || ONLY.test(CASE)) {
    const o = await open(browser, vp, 'book=1&world=arrakis&site=arrakeen&view=place&lm=fxres');
    const m = await midFade(o.p, 8000);
    row(m.fade && !LATER.test(m.dossier + m.crumbs + m.ann), `entry fade sampled, no later copy (${brief(m)})`);
    const [ok, s] = await until(o.p, s => s.view === 'place' && s.rendered === 'arrakeen' && s.lm === 'fxres');
    row(ok && consistent(s), `settles in Arrakeen at fxres, render=state (${brief(s)})`);
    row(
      /Fixture Residency/.test(s.dossier) && /Arrakeen/.test(s.crumbs),
      'dossier shows the landmark; crumbs name Arrakeen',
    );
    row(/Arrakeen, inside, on Arrakis\. Reading Dune$/.test(s.ann), `announcement "${s.ann}"`);
    row(
      /view=place/.test(s.hash) && /lm=fxres/.test(s.hash) && s.hs && s.hs.atlasPlace,
      'URL view=place&lm=fxres, history marks the place',
    );
    row(!s.lmIds.includes('fxlater') && s.lmIds.includes('fxres'), `book-1 landmarks exclude fxlater (${s.lmIds})`);
    noLater(s, 'settled');
    await allFades(o.p, 'all');
    await shot(o.p, vp, 'L1-settled');
    await finish(o, 'L1');
  }

  // ---- L2 stale landmark link (later-book landmark under book 1) ----
  CASE = `[${V} L2 stale lm]`;
  if (!ONLY || ONLY.test(CASE)) {
    const o = await open(browser, vp, 'book=1&world=arrakis&site=arrakeen&view=place&lm=fxlater');
    const m = await midFade(o.p, 6000);
    noLater(m, 'mid-fade');
    const [ok, s] = await until(o.p, s => s.view === 'place' && s.rendered === 'arrakeen');
    row(ok, `place renders (${brief(s)})`);
    row(
      s.lm == null && s.renderedLm == null,
      `stale lm dropped in state and render (lm=${s.lm}, renderedLm=${s.renderedLm})`,
    );
    noLater(s, 'settled');
    await allFades(o.p, 'all');
    await finish(o, 'L2');
  }

  // ---- L3 stale site link (later-book site) and L4 unknown site ----
  for (const [tag, site] of [
    ['L3 stale later-book site', 'keep'],
    ['L4 stale unknown site', 'nosuch'],
  ]) {
    CASE = `[${V} ${tag}]`;
    if (ONLY && !ONLY.test(CASE)) continue;
    const o = await open(browser, vp, `book=1&world=arrakis&site=${site}&view=place`);
    let entered = false;
    const t0 = Date.now();
    while (Date.now() - t0 < 7000) {
      const s = await snap(o.p);
      if (s.view === 'place' || s.rendered) entered = true;
      if (LATER.test(s.dossier + s.crumbs + s.ann)) entered = true;
      await sleep(150);
    }
    row(!entered, 'never enters or shows the hidden/unknown place (sampled every 150 ms for 7 s)');
    const [ok, s] = await until(o.p, s => s.view === 'world' && s.sel === 'arrakis');
    row(
      ok && (site === 'keep' ? hiddenOrNull(s) : s.site == null) && consistent(s),
      `settles on the Arrakis surface, no visible site (${brief(s)})`,
    );
    row(!new RegExp('site=' + site).test(s.hash) && !/view=place/.test(s.hash), `URL rewritten (${s.hash})`);
    noLater(s, 'settled');
    await finish(o, tag.split(' ')[0]);
  }

  // ---- B1 downgrade in a committed place with a later-book landmark selected ----
  CASE = `[${V} B1 downgrade keeps place, drops later lm]`;
  if (!ONLY || ONLY.test(CASE)) {
    const o = await open(browser, vp, 'book=2&world=arrakis&site=arrakeen&view=place&lm=fxlater');
    const [ok0, s0] = await until(o.p, s => s.view === 'place' && s.renderedLm === 'fxlater');
    row(ok0 && /Fixture Later Hall/.test(s0.dossier), `positive control: book 2 shows fxlater (${brief(s0)})`);
    await o.p.evaluate(() => window.__atlas.setBook(1));
    const m = await snap(o.p);
    noLater(m, 'immediately after downgrade');
    const [ok, s] = await until(o.p, s => s.book === 1 && s.view === 'place');
    row(
      ok && s.rendered === 'arrakeen' && s.lm == null && s.renderedLm == null && s.ev == null,
      `stays in Arrakeen, lm/ev dropped (${brief(s)})`,
    );
    row(!s.lmIds.includes('fxlater'), `rendered landmarks exclude fxlater (${s.lmIds})`);
    row(/Arrakeen, inside, on Arrakis\. Reading Dune$/.test(s.ann), `announcement "${s.ann}"`);
    noLater(s, 'settled');
    await finish(o, 'B1');
  }

  // ---- B2 downgrade in a committed later-book place (leave fade) ----
  CASE = `[${V} B2 downgrade in later-book place]`;
  if (!ONLY || ONLY.test(CASE)) {
    const o = await open(browser, vp, 'book=2&world=arrakis&site=keep&view=surface');
    await until(o.p, s => s.view === 'world' && s.site === 'keep');
    await click(o.p, '#dossier [data-act="enter"]'); // in-app entry pushes the place history entry
    const [ok0, s0] = await until(o.p, s => s.view === 'place' && s.rendered === 'keep');
    row(
      ok0 && /Paul’s Keep/.test(s0.dossier) && s0.hs && s0.hs.atlasPlace,
      `positive control: Keep place at book 2 (${brief(s0)})`,
    );
    await skipFades(o.p);
    await o.p.evaluate(() => window.__atlas.setBook(1));
    await shot(o.p, vp, 'B2-downgrade-midfade'); // taken at once; the screenshot itself may land after the 430 ms fade
    const m = await midFade(o.p);
    row(m.fade, `leave fade sampled (${brief(m)})`);
    noLater(m, 'mid-fade');
    row(!/Paul’s Keep/.test(m.ann) && /Reading Dune$/.test(m.ann), `mid-fade announcement neutral "${m.ann}"`);
    const [ok, s] = await until(o.p, s => s.book === 1 && s.view === 'world' && s.site == null);
    row(ok && s.sel === 'arrakis' && consistent(s), `settles on the Arrakis surface (${brief(s)})`);
    row(!(s.hs && s.hs.atlasPlace), 'history no longer on a place entry');
    noLater(s, 'settled');
    labelCheck(s, 'settled');
    await shot(o.p, vp, 'B2-downgrade-settled');
    await finish(o, 'B2');
  }

  // ---- B3 downgrade while the entry fade is in flight ----
  CASE = `[${V} B3 downgrade mid-entry]`;
  if (!ONLY || ONLY.test(CASE)) {
    const o = await open(browser, vp, 'book=2&world=arrakis&site=keep&view=surface');
    await until(o.p, s => s.view === 'world' && s.site === 'keep');
    const h0 = (await snap(o.p)).hlen;
    const m = await o.p.evaluate(async () => {
      document.querySelector('#dossier [data-act="enter"]').click();
      await new Promise(r => setTimeout(r, 150));
      window.__atlas.setBook(1);
      return window.__SNAP();
    });
    noLater(m, 'mid-fade (150 ms into the entry)');
    labelCheck(m, 'immediately after downgrade (entry pending)');
    let entered = false;
    const midLeaks = new Set();
    for (let i = 0; i < 20; i++) {
      const s = await snap(o.p);
      if (s.view === 'place' || s.rendered) entered = true;
      s.labels.filter(l => LATER.test(l.t)).forEach(l => midLeaks.add(`${l.t} tab=${l.tab} op=${l.op}`));
      await sleep(100);
    }
    row(!entered, 'cancelled entry never commits or builds the Keep place');
    row(
      midLeaks.size === 0,
      `during cancellation (20 samples, 100 ms apart) no later-book globe label (${[...midLeaks].join('; ') || 'none'})`,
    );
    const [ok, s] = await until(o.p, s => s.book === 1 && s.view === 'world' && hiddenOrNull(s));
    row(ok && consistent(s), `settles on the Arrakis surface, no visible site (${brief(s)})`);
    row(
      !(s.hs && s.hs.atlasPlace) && s.hlen <= h0 + 1,
      `place history marker dropped (atlasPlace=${!!(s.hs && s.hs.atlasPlace)}, history +${s.hlen - h0})`,
    );
    noLater(s, 'settled');
    row(s.site == null, `ineligible Keep selection cleared once settled (site=${s.site})`);
    labelCheck(s, 'settled');
    await keyCheck(o, 'settled');
    await shot(o.p, vp, 'B3-downgrade-settled');
    // forward again: the Keep returns as a globe label at book 2
    await o.p.evaluate(() => window.__atlas.setBook(2));
    const [okU, sU] = await until(o.p, s => s.book === 2 && s.view === 'world');
    row(
      okU && sU.labels.some(l => /Paul’s Keep/.test(l.t)),
      `upgrade to book 2 restores the Keep label (${sU.labels.map(l => l.t).join(',')})`,
    );
    await finish(o, 'B3');
  }

  // ---- S1 direct surface downgrade on an unchanged planet mesh (R0-2) ----
  CASE = `[${V} S1 surface downgrade]`;
  if (!ONLY || ONLY.test(CASE)) {
    const o = await open(browser, vp, 'book=2&world=arrakis&site=keep&view=surface');
    const [ok0, s0] = await until(o.p, s => s.view === 'world' && s.site === 'keep');
    // let the turn toward the Keep finish so its label faces the camera and clears the compact chrome
    let s1 = await snap(o.p);
    for (let i = 0; i < 40; i++) {
      const k = s1.labels.find(l => /Paul’s Keep/.test(l.t));
      if (k && k.tab === 0) break;
      // compact layout: the open details sheet can cover the selected site; lower it as a reader would
      if (i === 15)
        await o.p.evaluate(() => {
          const d = document.querySelector('#dossier');
          if (d && !d.classList.contains('collapsed')) document.querySelector('#grab').click();
        });
      await sleep(200);
      s1 = await snap(o.p);
    }
    const keep0 = s1.labels.find(l => /Paul’s Keep/.test(l.t));
    row(
      ok0 && !!keep0 && keep0.tab === 0 && keep0.ah === 'false',
      `positive control: book 2 Keep label shown and focusable (${keep0 ? `tab=${keep0.tab} aria-hidden=${keep0.ah} op=${keep0.op}` : 'absent'})`,
    );
    await shot(o.p, vp, 'S1-book2-before');
    await o.p.evaluate(() => (window.__plRef = window.__atlas.PL));
    await skipFades(o.p);
    await o.p.evaluate(() => window.__atlas.setBook(1));
    const m = await snap(o.p);
    noLater(m, 'immediately after downgrade');
    labelCheck(m, 'immediately after downgrade');
    const [ok, s] = await until(o.p, s => s.book === 1 && s.view === 'world');
    row(
      await o.p.evaluate(() => window.__atlas.PL === window.__plRef),
      'planet mesh unchanged (no re-descent): the R0-2 path',
    );
    row(
      ok && s.sel === 'arrakis' && s.site == null && consistent(s),
      `ineligible Keep selection cleared (${brief(s)})`,
    );
    row(!/site=/.test(s.hash) && /view=surface/.test(s.hash), `URL ${s.hash}`);
    noLater(s, 'settled');
    labelCheck(s, 'settled');
    const reached = await keyCheck(o, 'settled');
    row(
      reached.every(t => !LATER.test(t)),
      `every keyboard-reached globe label is book-1 eligible (${reached.join(',') || 'none in view'})`,
    );
    await shot(o.p, vp, 'S1-downgrade-settled');
    await o.p.evaluate(() => window.__atlas.setBook(2));
    await sleep(300);
    const [okU, sU] = await until(o.p, s => s.book === 2 && s.view === 'world');
    row(
      okU && sU.labels.some(l => /Paul’s Keep/.test(l.t)),
      `upgrade to book 2 restores the Keep label (${sU.labels.map(l => l.t).join(',')})`,
    );
    await finish(o, 'S1');
  }

  // ---- B4 downgrade while a Back-to-world leave fade is in flight ----
  CASE = `[${V} B4 downgrade mid-leave]`;
  if (!ONLY || ONLY.test(CASE)) {
    const o = await open(browser, vp, 'book=2&world=arrakis&site=keep&view=surface');
    await until(o.p, s => s.view === 'world' && s.site === 'keep');
    await click(o.p, '#dossier [data-act="enter"]');
    await until(o.p, s => s.view === 'place' && s.rendered === 'keep');
    await skipFades(o.p);
    await click(o.p, '#dossier [data-act="leave"]');
    await midFade(o.p);
    await o.p.evaluate(() => window.__atlas.setBook(1));
    const m = await snap(o.p);
    noLater(m, 'mid-fade');
    const [ok, s] = await until(o.p, s => s.book === 1 && s.view === 'world' && hiddenOrNull(s));
    row(ok && s.sel === 'arrakis' && consistent(s), `settles on the Arrakis surface, no visible site (${brief(s)})`);
    noLater(s, 'settled');
    labelCheck(s, 'settled');
    await finish(o, 'B4');
  }

  // ---- T1 tour: Stop while the first entry fade is in flight (DWT-01a) ----
  CASE = `[${V} T1 tour Stop mid-entry]`;
  if (!ONLY || ONLY.test(CASE)) {
    const o = await open(browser, vp, 'book=1&world=arrakis&view=surface');
    await until(o.p, s => s.view === 'world' && s.sel === 'arrakis');
    // tour step 1 is d1 (Caladan): ascend + entry; Stop as soon as the first fade shows
    await skipFades(o.p);
    await click(o.p, '#tourBtn');
    await midFade(o.p, 3000);
    await click(o.p, '#tourBox [data-tour="stop"]');
    let entered = false;
    for (let i = 0; i < 30; i++) {
      const s = await snap(o.p);
      if (s.view === 'place' || s.rendered) entered = true;
      await sleep(100);
    }
    row(!entered, 'Stop before the entry commits: no place is entered or built');
    const [ok, s] = await until(o.p, s => s.view !== 'place');
    row(
      ok && consistent(s) && s.tourHidden && !(s.hs && s.hs.atlasPlace),
      `settled, render=state, tour hidden, no place history (${brief(s)})`,
    );
    await finish(o, 'T1');
  }

  // ---- T2 tour: repeated destination (d3 -> d4, both Arrakeen) and superseding steps ----
  CASE = `[${V} T2 tour repeated destination]`;
  if (!ONLY || ONLY.test(CASE)) {
    const o = await open(browser, vp, 'book=1');
    await sleep(3000);
    await click(o.p, '#tourBtn');
    await click(o.p, '#tourBox [data-tour="pause"]');
    // jump d1 -> d3 with two rapid Next clicks: only the latest request may land
    await click(o.p, '#tourBox [data-tour="next"]');
    await sleep(120);
    await click(o.p, '#tourBox [data-tour="next"]');
    const [ok1, s1] = await until(o.p, s => s.view === 'place' && s.ev === 'd3', 40000);
    row(
      ok1 && s1.rendered === 'arrakeen' && s1.sel === 'arrakis' && consistent(s1),
      `rapid Next lands on d3 in Arrakeen (${brief(s1)})`,
    );
    row(/House Atreides comes to Arrakis/.test(s1.tourT) && /Arrakeen/.test(s1.crumbs), 'tour box and crumbs agree');
    const h1 = s1.hlen;
    await skipFades(o.p);
    await click(o.p, '#tourBox [data-tour="next"]'); // d4: same place, has landmark fxres
    const m = await midFade(o.p, 500);
    row(!m.fade, 'repeated destination does not re-enter (no fade)');
    const [ok2, s2] = await until(o.p, s => s.ev === 'd4' && s.renderedLm === 'fxres');
    row(
      ok2 && s2.rendered === 'arrakeen' && s2.lm === 'fxres' && consistent(s2),
      `d4 selects fxres in place (${brief(s2)})`,
    );
    row(s2.hlen === h1 && /lm=fxres/.test(s2.hash), `no extra history entry (${h1} -> ${s2.hlen}); URL lm=fxres`);
    row(/Yueh’s betrayal/.test(s2.dossier) || /Fixture Residency/.test(s2.dossier), 'dossier shows d4 / its landmark');
    await shot(o.p, vp, 'T2-repeated-settled');
    // Next (d5, no site: leave in flight) then Next (d6, Tabr) queued behind it: only d6 may land
    await click(o.p, '#tourBox [data-tour="next"]');
    await sleep(150);
    await click(o.p, '#tourBox [data-tour="next"]');
    const [ok3, s3] = await until(o.p, s => s.ev === 'd6' && s.view === 'place', 40000);
    row(
      ok3 && s3.rendered === 'tabr' && s3.renderedLm === 'fxcave' && consistent(s3),
      `queued step lands on d6 in Tabr at fxcave (${brief(s3)})`,
    );
    row(
      /Sietch Tabr/.test(s3.crumbs) && /Sietch Tabr, inside, on Arrakis/.test(s3.ann),
      `crumbs and announcement name Tabr ("${s3.ann}")`,
    );
    // Prev -> d5 then Next -> d6 again before anything settles: repeated request for the same destination
    await click(o.p, '#tourBox [data-tour="prev"]');
    await sleep(100);
    await click(o.p, '#tourBox [data-tour="next"]');
    const [ok4, s4] = await until(o.p, s => s.ev === 'd6' && s.view === 'place' && s.rendered === 'tabr', 40000);
    row(
      ok4 && consistent(s4) && /Sietch Tabr/.test(s4.tourT),
      `Prev/Next back to the same destination settles once on d6 (${brief(s4)})`,
    );
    await click(o.p, '#tourBox [data-tour="stop"]');
    const [ok5, s5] = await until(o.p, s => s.tourHidden);
    row(ok5 && consistent(s5), `Stop settles with render=state (${brief(s5)})`);
    await finish(o, 'T2');
  }

  // ---- T3 tour: Stop during a leave + queued entry ----
  CASE = `[${V} T3 tour Stop mid-leave]`;
  if (!ONLY || ONLY.test(CASE)) {
    const o = await open(browser, vp, 'book=1&world=arrakis&site=arrakeen&view=surface');
    await until(o.p, s => s.view === 'world' && s.site === 'arrakeen');
    await click(o.p, '#track .ev[data-ev="d4"]'); // in-app entry (pushes the place entry)
    await until(o.p, s => s.view === 'place' && s.ev === 'd4');
    await click(o.p, '#tourBtn');
    await click(o.p, '#tourBox [data-tour="pause"]');
    await until(o.p, s => s.ev === 'd1' || s.sel === 'caladan', 40000); // tour step 0 travels to d1
    // now back to Arrakeen region: Next d2, Stop immediately while its travel is in flight
    await click(o.p, '#tourBox [data-tour="next"]');
    await sleep(150);
    await click(o.p, '#tourBox [data-tour="stop"]');
    const [ok, s] = await until(o.p, s => s.tourHidden && s.view !== 'place', 15000);
    row(ok && consistent(s) && s.ev !== 'd2', `Stop cancels the d2 travel; settled, render=state (${brief(s)})`);
    row(!/The Baron’s trap/.test(s.dossier) || s.sel === 'giedi', 'no stale d2 copy without its world');
    await finish(o, 'T3');
  }

  // ---- H1 Back during an in-place hop (Arrakeen -> Tabr fade) ----
  CASE = `[${V} H1 Back during travel]`;
  if (!ONLY || ONLY.test(CASE)) {
    const o = await open(browser, vp, 'book=1&world=arrakis&site=arrakeen&view=surface');
    await until(o.p, s => s.view === 'world' && s.site === 'arrakeen');
    await click(o.p, '#track .ev[data-ev="d4"]');
    const [ok0, s0] = await until(o.p, s => s.view === 'place' && s.ev === 'd4' && s.renderedLm === 'fxres');
    row(ok0 && s0.hs && s0.hs.atlasPlace, `chronicle d4 enters Arrakeen at fxres (${brief(s0)})`);
    // hop, then Back 100 ms later (inside the 430 ms fade); record when popstate arrives and whether Tabr is ever built
    const r = await o.p.evaluate(async () => {
      const t0 = performance.now();
      const out = { built: null, pop: null, mid: null };
      addEventListener('popstate', () => (out.pop = { t: performance.now() - t0, s: window.__SNAP() }), { once: true });
      document.querySelector('#dossier [data-act="hop"][data-id="tabr"]').click();
      await new Promise(r => setTimeout(r, 100));
      out.mid = { t: performance.now() - t0, s: window.__SNAP() };
      history.back();
      while (performance.now() - t0 < 6000) {
        const A = window.__atlas;
        const P = A.PLACES && A.PLACES.place;
        if (!out.built && P && P.site && P.site.id === 'tabr') out.built = performance.now() - t0;
        await new Promise(r => setTimeout(r, 15));
      }
      return out;
    });
    const m = r.mid.s;
    row(
      m.fade && m.rendered === 'arrakeen',
      `hop fade in flight at ${r.mid.t.toFixed(0)} ms, Arrakeen still rendered (${brief(m)})`,
    );
    const popFirst = r.pop && r.pop.s.rendered === 'arrakeen';
    row(
      !!r.pop && (popFirst ? r.built == null : true),
      `Back popstate at ${r.pop ? r.pop.t.toFixed(0) : '-'} ms, rendered then ${r.pop ? r.pop.s.rendered : '-'} (${popFirst ? 'before' : 'after'} the hop commit): Tabr ${r.built == null ? 'never built' : 'built at ' + r.built.toFixed(0) + ' ms'}`,
    );
    const [ok, s] = await until(o.p, s => s.view === 'world' && s.sel === 'arrakis');
    row(
      ok && consistent(s) && /view=surface/.test(s.hash) && !(s.hs && s.hs.atlasPlace),
      `Back settles on the Arrakis surface (${brief(s)})`,
    );
    row(/Arrakis, on the surface/.test(s.ann), `announcement "${s.ann}"`);
    await shot(o.p, vp, 'H1-back-settled');
    await finish(o, 'H1');
  }

  // ---- H2 Back after a settled place entry returns to the surface; Forward re-enters ----
  CASE = `[${V} H2 Back/Forward settled]`;
  if (!ONLY || ONLY.test(CASE)) {
    const o = await open(browser, vp, 'book=1&world=arrakis&site=tabr&view=surface');
    await until(o.p, s => s.view === 'world' && s.site === 'tabr');
    await click(o.p, '#dossier [data-act="enter"]');
    await until(o.p, s => s.view === 'place' && s.rendered === 'tabr');
    await o.p.evaluate(() => history.back());
    const [ok, s] = await until(o.p, s => s.view === 'world');
    row(ok && consistent(s) && s.sel === 'arrakis', `Back -> surface (${brief(s)})`);
    await o.p.evaluate(() => history.forward());
    const [ok2, s2] = await until(o.p, s => s.view === 'place' && s.rendered === 'tabr');
    row(ok2 && consistent(s2) && /site=tabr&view=place/.test(s2.hash), `Forward re-enters Tabr (${brief(s2)})`);
    await finish(o, 'H2');
  }
}

const browser = await chromium.launch({
  executablePath: process.env.CHROME_PATH || undefined,
  args: ['--use-gl=swiftshader', '--enable-webgl', '--ignore-gpu-blocklist'],
});
console.log(`atlas-places-fixture: ${browser.version()}`);
try {
  for (const vp of VIEWPORTS) await run(browser, vp);
} finally {
  await browser.close();
  server.close();
}
for (const [k, c] of Object.entries(counts)) console.log(`  ${k} ${c.pass}/${c.pass + c.fail}`);
console.log(`atlas-places-fixture: ${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);
