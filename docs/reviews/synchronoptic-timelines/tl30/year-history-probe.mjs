// Checkpoint 30: rendered year-filter (`yr`) restoration in the actual atlas host (built dist, temp copy; nothing
// written to the repo). Same synthetic chapter fixture as tl26/tl28 (Karaite ch 3, Covenant ch 5; test fixtures only).
// Navigation: same-document link input (location.hash) plus real browser Back/Forward (page.goBack/goForward).
// Entries carry an explicit `yr` or omit it. Each entry asserts, together:
//   - URL `yr` and the engine range S.range;
//   - the rendered host year controls: both range inputs' values (axis years), aria-valuetext, the readout text,
//     and the "All years" reset button (present only when a range is set);
//   - the rendered Chronicle events (#track): exactly the full-range baseline events (same book, chapter, layers)
//     whose `when` overlaps the range, by an independent overlap rule (undated events always show), and at least one
//     hidden by each explicit range;
//   - the rendered site labels on the Earth surface: exactly the sites of the full-range baseline (same book, chapter,
//     layers) whose `when` overlaps the range, by an independent overlap rule (undated sites always show);
//   - when the timeline is open: open state, `tlsel`, and exact list-id set equality against an independent copy of
//     the host timeline gate (book/chapter/layers; the timeline view itself is not year-filtered, so `yr` must not
//     change its ids).
// usage: node year-history-probe.mjs <dist dir> <label>
import { cpSync, mkdtempSync, readFileSync, appendFileSync } from 'node:fs';
import { createServer } from 'node:http';
import { tmpdir } from 'node:os';
import { join, extname } from 'node:path';
import { chromium } from 'playwright';

const [distDir, label = ''] = process.argv.slice(2);
const ID = 'abrahamic-world-religions';
const K = 'n:jud-karaite';
const C = 'n:jud-covenant-tradition';
const FIX = {
  'jud-karaite': { first: 1, chapter: 3 },
  'jud-covenant-tradition': { first: 1, chapter: 5 },
  'jud-ananites': { first: 2 },
};

function site() {
  const dir = mkdtempSync(join(tmpdir(), 'tl30-'));
  cpSync(distDir, dir, { recursive: true });
  appendFileSync(
    join(dir, `atlas/packs/${ID}.js`),
    `\n;(function(P){P.spoilers=Object.assign({},P.spoilers,{mode:'cumulative'});` +
      `P.books={1:{n:'I',title:'Part one', chapters: 6},2:{n:'II',title:'Part two'}};` +
      `var F=${JSON.stringify(FIX)};P.tree.nodes.forEach(function(n){if(F[n.id])Object.assign(n,F[n.id]);});` +
      `})(window.ATLAS_PACKS['${ID}']);\n`,
  );
  return dir;
}
const TYPES = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.woff2': 'font/woff2',
  '.svg': 'image/svg+xml',
  '.jpg': 'image/jpeg',
};
function serve(dir) {
  return new Promise(res => {
    const s = createServer((q, a) => {
      let p = decodeURIComponent(q.url.split('?')[0]);
      if (p.endsWith('/')) p += 'index.html';
      try {
        const b = readFileSync(join(dir, p));
        a.writeHead(200, { 'content-type': TYPES[extname(p)] || 'application/octet-stream' });
        a.end(b);
      } catch {
        a.writeHead(404);
        a.end();
      }
    }).listen(0, () => res(s));
  });
}
const browser = await chromium.launch({
  executablePath: process.env.CHROME_PATH || undefined,
  args: ['--use-gl=swiftshader', '--enable-webgl', '--ignore-gpu-blocklist'],
});
let pass = 0;
let fail = 0;
const check = (name, ok, extra = '') => {
  ok ? pass++ : fail++;
  console.log((ok ? 'PASS ' : 'FAIL ') + name + (extra ? ' — ' + extra : ''));
};
const info = (name, extra) => console.log('INFO ' + name + (extra ? ' — ' + extra : ''));
const tap = (page, sel) => page.evaluate(s => document.querySelector(s).click(), sel);
const toAxis = y => (y < 0 ? y + 1 : y);

/* exact timeline list comparison with an INDEPENDENT copy of the host timeline gate (no year term) */
const compare = (page, st) =>
  page.evaluate(
    ([st, ID]) => {
      const P = window.ATLAS_PACKS[ID];
      const model = window.AtlasTimeline.adapterFor(P)(P);
      const active = st.layers ? new Set(st.layers) : null;
      const first = g =>
        g.first != null ? g.first : g.book != null ? g.book : g.books && g.books.length ? Math.min(...g.books) : null;
      const bookOk = g => {
        if (g.first != null && st.book < g.first) return false;
        if (g.books && g.books.length) return Math.min(...g.books) <= st.book;
        return true;
      };
      const chapterOk = g => {
        if (g.chapter == null) return true;
        const f = first(g);
        if (f == null || f > st.book) return false;
        return f < st.book || st.chapter >= g.chapter;
      };
      const layerOk = g => !active || !(g.layers || []).length || g.layers.some(l => active.has(l));
      const ok = g => bookOk(g || {}) && chapterOk(g || {}) && layerOk(g || {});
      const ids = new Set(model.records.filter(r => ok(r.gate)).map(r => r.id));
      const dom = [
        ...document.querySelectorAll('#timeline .tl-list .tl-it[data-id], #timeline .tl-und .tl-it[data-id]'),
      ].map(x => x.dataset.id);
      const domSet = new Set(dom);
      return {
        expected: ids.size,
        rows: dom.length,
        distinct: domSet.size,
        missingN: [...ids].filter(i => !domSet.has(i)).length,
        extraN: [...domSet].filter(i => !ids.has(i)).length,
        has: Object.fromEntries(st.want.map(i => [i, domSet.has(i)])),
      };
    },
    [st, ID],
  );

const state = page =>
  page.evaluate(ID => {
    if (!window.__atlas) return { gone: true, href: location.href };
    const p = document.querySelector('#timeline .panel');
    const q = new URLSearchParams(location.hash.replace(/^#/, ''));
    const A = window.__atlas;
    const S = A.S;
    const f = document.querySelector('#filters');
    const from = f && f.querySelector('input[data-tl="from"]');
    const to = f && f.querySelector('input[data-tl="to"]');
    const read = f && f.querySelector('.tl-y');
    const w = A.WORLD_BY.earth;
    const whenOf = s =>
      s.when == null
        ? null
        : Array.isArray(s.when)
          ? [+s.when[0], +(s.when[1] ?? s.when[0])].sort((a, b) => a - b)
          : [+s.when, +s.when];
    return {
      open: !!p && p.offsetParent !== null,
      hash: location.hash,
      yrQ: q.get('yr'),
      range: S.range ? S.range.join('_') : null,
      view: S.view,
      sel: S.sel,
      tlsel: q.get('tlsel'),
      from: from
        ? { v: from.value, min: from.min, max: from.max, step: from.step, vt: from.getAttribute('aria-valuetext') }
        : null,
      to: to ? { v: to.value, vt: to.getAttribute('aria-valuetext') } : null,
      readout: read ? read.textContent : null,
      allBtn: !!(f && f.querySelector('[data-tl="all"]')),
      fillA: f && f.querySelector('.tl-track') ? f.querySelector('.tl-track').style.getPropertyValue('--a') : null,
      fillB: f && f.querySelector('.tl-track') ? f.querySelector('.tl-track').style.getPropertyValue('--b') : null,
      siteIds: S.view === 'world' ? A.SITE_EL.map(x => x.s.id).sort() : null,
      siteWhen: Object.fromEntries((w.sites || []).map(s => [s.id, whenOf(s)])),
      evIds: [...document.querySelectorAll('#track .ev[data-ev]')].map(b => b.dataset.ev).sort(),
      evWhen: Object.fromEntries((window.ATLAS_PACKS[ID].events || []).map(e => [e.id, whenOf(e)])),
    };
  }, ID);

const srv = await serve(site());
const base = `http://127.0.0.1:${srv.address().port}/atlas/?pack=${ID}`;
const enc = s => encodeURIComponent(s);
const W = 'book=1&ch=5&world=earth&view=surface';
// entries: hash, expected range ([lo, hi] or null = full), layers, open, tlsel
const E = [
  {
    hash: `#${W}`,
    range: null,
    layers: null,
    open: false,
    tlsel: null,
    label: 'start: full range, timeline closed (site baseline)',
  },
  {
    hash: `#${W}&yr=-500_100&tl=1&tlsel=${enc(K)}`,
    range: [-500, 100],
    layers: null,
    open: true,
    tlsel: K,
    label: 'explicit yr 500 BC–AD 100, Karaite selected',
  },
  {
    hash: `#${W}&yr=600_1500&tl=1&tlsel=${enc(C)}`,
    range: [600, 1500],
    layers: null,
    open: true,
    tlsel: C,
    label: 'explicit yr 600–1500, Covenant selected',
  },
  {
    hash: `#${W}&tl=1&tlsel=${enc(K)}`,
    range: null,
    layers: null,
    open: true,
    tlsel: K,
    label: 'yr omitted: full range again, Karaite selected',
  },
  {
    hash: `#${W}&layers=jud&tl=1&tlsel=${enc(K)}`,
    range: null,
    layers: ['jud'],
    open: true,
    tlsel: K,
    label: 'only Judaism, yr omitted (Judaism site baseline)',
  },
  {
    hash: `#${W}&layers=jud&yr=1800_1950&tl=1&tlsel=${enc(K)}`,
    range: [1800, 1950],
    layers: ['jud'],
    open: true,
    tlsel: K,
    label: 'explicit yr 1800–1950 with only Judaism',
  },
  {
    hash: `#${W}&yr=-500_100`,
    range: [-500, 100],
    layers: null,
    open: false,
    tlsel: null,
    label: 'explicit yr 500 BC–AD 100, timeline closed',
  },
  { hash: `#${W}`, range: null, layers: null, open: false, tlsel: null, label: 'yr omitted, timeline closed' },
];
const overlaps = (r, R) => !r || (r[1] >= R[0] && r[0] <= R[1]);

for (const [w, h] of [
  [1440, 900],
  [390, 844],
]) {
  const tag = `yr/${w}`;
  const ctx = await browser.newContext({ viewport: { width: w, height: h }, serviceWorkers: 'block' });
  const page = await ctx.newPage();
  const errors = [];
  page.on('pageerror', e => errors.push(e.message));
  page.on('console', m => m.type() === 'error' && errors.push(m.text()));
  page.on('response', r => r.status() >= 400 && errors.push(r.status() + ' ' + r.url()));
  await page.goto(base + E[0].hash);
  await page.waitForFunction(() => !!document.querySelector('#tlBtn') && window.__atlas, null, {
    polling: 500,
    timeout: 90000,
  });
  await page.waitForTimeout(4000);
  const s0 = await state(page);
  const AMIN = +s0.from.min;
  const AMAX = +s0.from.max;
  const STEP = +s0.from.step || 1;
  info(
    `${tag} year axis`,
    `min ${AMIN} max ${AMAX} step ${s0.from.step}; view ${s0.view}; ${s0.siteIds ? s0.siteIds.length : 'no'} site labels`,
  );
  const baseline = {}; // layers key -> full-range site ids
  const verify = async (i, how) => {
    const e = E[i];
    const s = await state(page);
    if (s.gone) {
      check(`${tag} ${how} entry ${i} (${e.label}): atlas document still loaded`, false, s.href);
      return false;
    }
    const lk = e.layers ? e.layers.join(',') : 'ALL';
    const wantQ = e.range ? e.range.join('_') : null;
    /* <input type=range> sanitizes its value to min + n*step (and <= max): expect the snapped axis value, and check
       the unsnapped range separately on the track fill (--a/--b) */
    const snap = a => {
      let v = AMIN + Math.round((a - AMIN) / STEP) * STEP;
      if (v > AMAX) v -= STEP;
      return v;
    };
    const ax0 = e.range ? toAxis(e.range[0]) : AMIN;
    const ax1 = e.range ? toAxis(e.range[1]) : AMAX;
    const lo = snap(ax0);
    const hi = snap(ax1);
    const pct = v => (((v - AMIN) / (AMAX - AMIN)) * 100).toFixed(2) + '%';
    const fillOk = s.fillA === pct(ax0) && s.fillB === pct(ax1);
    const ctlOk =
      fillOk &&
      !!s.from &&
      !!s.to &&
      +s.from.v === lo &&
      +s.to.v === hi &&
      s.allBtn === !!e.range &&
      (e.range
        ? s.readout !== 'All years' &&
          s.readout.includes(String(Math.abs(e.range[0]))) &&
          s.readout.includes(String(Math.abs(e.range[1]))) &&
          s.from.vt.includes(String(Math.abs(e.range[0]))) &&
          s.to.vt.includes(String(Math.abs(e.range[1])))
        : s.readout === 'All years');
    const stOk = s.yrQ === wantQ && s.range === wantQ && s.open === e.open && s.tlsel === e.tlsel;
    check(
      `${tag} ${how} entry ${i} (${e.label}): URL yr + S.range + rendered year controls + timeline open/tlsel`,
      ctlOk && stOk,
      JSON.stringify({
        yrQ: s.yrQ,
        range: s.range,
        fill: [s.fillA, s.fillB],
        wantFill: [pct(ax0), pct(ax1)],
        wantInputs: [lo, hi],
        from: s.from && s.from.v,
        to: s.to && s.to.v,
        readout: s.readout,
        allBtn: s.allBtn,
        fromVT: s.from && s.from.vt,
        toVT: s.to && s.to.vt,
        open: s.open,
        tlsel: s.tlsel,
      }),
    );
    /* rendered Chronicle events (#track): full-range baseline for the same layers, then baseline ∩ overlap(yr) */
    const ek = 'ev:' + lk;
    if (!e.range) {
      if (!baseline[ek]) baseline[ek] = s.evIds;
      check(
        `${tag} ${how} entry ${i}: full-range Chronicle events == baseline for layers ${lk}`,
        JSON.stringify(s.evIds) === JSON.stringify(baseline[ek]),
        `${s.evIds.length} vs ${baseline[ek].length}`,
      );
    } else if (baseline[ek]) {
      const want = baseline[ek].filter(id => overlaps(s.evWhen[id], e.range));
      const missing = want.filter(x => !s.evIds.includes(x));
      const extra = s.evIds.filter(x => !want.includes(x));
      check(
        `${tag} ${how} entry ${i}: Chronicle events == baseline ∩ overlap(yr), and yr hides at least one`,
        missing.length === 0 && extra.length === 0 && want.length < baseline[ek].length,
        `want ${want.length}/${baseline[ek].length} (hidden by yr ${baseline[ek].length - want.length}); DOM ${s.evIds.length}; missing ${missing.slice(0, 4)}; extra ${extra.slice(0, 4)}`,
      );
    } else check(`${tag} ${how} entry ${i}: Chronicle baseline available for layers ${lk}`, false);
    /* rendered site labels on the Earth surface (the Earth sites in this pack carry no dates, so this only shows
       that yr hides none of them) */
    if (s.siteIds) {
      if (!e.range) {
        if (!baseline[lk]) baseline[lk] = s.siteIds;
        check(
          `${tag} ${how} entry ${i}: full-range site labels == baseline for layers ${lk}`,
          JSON.stringify(s.siteIds) === JSON.stringify(baseline[lk]),
          `${s.siteIds.length} vs ${baseline[lk].length}`,
        );
      } else if (baseline[lk]) {
        const want = baseline[lk].filter(id => overlaps(s.siteWhen[id], e.range));
        const missing = want.filter(x => !s.siteIds.includes(x));
        const extra = s.siteIds.filter(x => !want.includes(x));
        check(
          `${tag} ${how} entry ${i}: site labels == baseline ∩ overlap(yr)`,
          missing.length === 0 && extra.length === 0,
          `want ${want.length}/${baseline[lk].length} (hidden by yr ${baseline[lk].length - want.length}); DOM ${s.siteIds.length}; missing ${missing.slice(0, 4)}; extra ${extra.slice(0, 4)}`,
        );
      } else {
        info(
          `${tag} ${how} entry ${i}: no full-range baseline yet for layers ${lk}`,
          `${s.siteIds.length} site labels`,
        );
        if (!baseline['pending:' + lk + ':' + wantQ]) baseline['pending:' + lk + ':' + wantQ] = s.siteIds;
      }
    } else check(`${tag} ${how} entry ${i}: Earth surface view held`, false, `view ${s.view}`);
    if (e.open) {
      await tap(page, '#timeline [data-mode="list"]');
      await page.waitForTimeout(300);
      const c = await compare(page, { book: 1, chapter: 5, layers: e.layers, want: [K, C] });
      check(
        `${tag} ${how} entry ${i}: timeline list ids == gated model ids (not year-filtered), rows distinct`,
        c.missingN === 0 && c.extraN === 0 && c.distinct === c.expected && c.rows === c.distinct,
        `expected ${c.expected}; DOM ${c.distinct} distinct (${c.rows} rows), missing ${c.missingN}, extra ${c.extraN}`,
      );
      const sel = await page.evaluate(() => {
        const x = document.querySelector(
          '#timeline [aria-current="true"][data-id], #timeline .tl-it.sel[data-id], #timeline [aria-selected="true"][data-id]',
        );
        return x ? x.dataset.id : null;
      });
      check(`${tag} ${how} entry ${i}: rendered timeline selection == ${e.tlsel}`, sel === e.tlsel, `rendered ${sel}`);
    }
    return true;
  };
  await verify(0, 'load');
  for (let i = 1; i < E.length; i++) {
    await page.evaluate(h => (location.hash = h), E[i].hash);
    await page.waitForTimeout(1200);
    if (!(await verify(i, 'link to'))) break;
  }
  for (let i = E.length - 2; i >= 0; i--) {
    await page.goBack();
    await page.waitForTimeout(1200);
    if (!(await verify(i, 'Back to'))) break;
  }
  for (let i = 1; i < E.length; i++) {
    await page.goForward();
    await page.waitForTimeout(1200);
    if (!(await verify(i, 'Forward to'))) break;
  }
  check(`${tag} no runtime errors`, errors.length === 0, errors.slice(0, 3).join(' | '));
  await ctx.close();
}
srv.close();
await browser.close();
console.log(`TL30 year history probe ${label}: ${pass} pass, ${fail} fail`);
process.exit(fail ? 1 : 0);
