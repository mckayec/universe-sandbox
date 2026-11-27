// O-1 (checkpoint 28): same-document layer restoration together with chapter and timeline state, in the actual atlas
// host (built dist, temp copy; nothing written to the repo). Same synthetic fixture as tl26/history-browser-probe.mjs
// (chapter gates: Karaite ch 3, Covenant ch 5; test fixtures only). Navigation is same-document link input
// (location.hash) plus real browser Back/Forward (page.goBack/goForward). Each entry asserts, together: the URL
// `layers`, the engine's active layer set, the host layer chips (aria-pressed), chapter, timeline open/tl/tlsel, and
// exact list-id/relationship set equality against an independent copy of the host gate for that entry's
// {book, chapter, layers}.
// usage: node history-browser-probe.mjs <dist dir>
import { cpSync, mkdtempSync, readFileSync, appendFileSync } from 'node:fs';
import { createServer } from 'node:http';
import { tmpdir } from 'node:os';
import { join, extname } from 'node:path';
import { chromium } from 'playwright';

const [distDir] = process.argv.slice(2);
const ID = 'abrahamic-world-religions';
const K = 'n:jud-karaite';
const C = 'n:jud-covenant-tradition';
const A = 'n:jud-ananites';
const FIX = { 'jud-karaite': { first: 1, chapter: 3 }, 'jud-covenant-tradition': { first: 1, chapter: 5 }, 'jud-ananites': { first: 2 } };

function site(variant) {
  const dir = mkdtempSync(join(tmpdir(), 'tl28-'));
  cpSync(distDir, dir, { recursive: true });
  if (variant !== 'unmodified') {
    const chapters = variant === 'chapters' ? ', chapters: 6' : '';
    appendFileSync(
      join(dir, `atlas/packs/${ID}.js`),
      `\n;(function(P){P.spoilers=Object.assign({},P.spoilers,{mode:'cumulative'});` +
        `P.books={1:{n:'I',title:'Part one'${chapters}},2:{n:'II',title:'Part two'}};` +
        `var F=${JSON.stringify(FIX)};P.tree.nodes.forEach(function(n){if(F[n.id])Object.assign(n,F[n.id]);});` +
        `})(window.ATLAS_PACKS['${ID}']);\n`,
    );
  }
  return dir;
}
const TYPES = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.png': 'image/png', '.woff2': 'font/woff2', '.svg': 'image/svg+xml', '.jpg': 'image/jpeg' };
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
const hq = async page =>
  Object.fromEntries(await page.evaluate(() => [...new URLSearchParams(location.hash.replace(/^#/, ''))]));
const tap = (page, sel) => page.evaluate(s => document.querySelector(s).click(), sel);
const setCh = (page, v) =>
  page.evaluate(v => {
    const s = document.querySelector('#chapterSel');
    s.value = v;
    s.dispatchEvent(new Event('change', { bubbles: true }));
  }, v);
/* exact list/model comparison with an INDEPENDENT copy of the host gate for a probe-known {book, chapter, layers} */
const compare = (page, st) =>
  page.evaluate(
    ([st, ID]) => {
      const P = window.ATLAS_PACKS[ID];
      const cum = !(P.spoilers && P.spoilers.mode === 'single');
      const model = window.AtlasTimeline.adapterFor(P)(P);
      const active = st.layers ? new Set(st.layers) : null;
      const first = g =>
        g.first != null ? g.first : g.book != null ? g.book : g.books && g.books.length ? Math.min(...g.books) : null;
      const bookOk = g => {
        if (!st.book) return true;
        if (g.first != null && st.book < g.first) return false;
        if (g.books && g.books.length) return cum ? Math.min(...g.books) <= st.book : g.books.includes(st.book);
        return true;
      };
      const chapterOk = g => {
        if (g.chapter == null || !st.book || !cum) return true;
        const f = first(g);
        if (f == null || f > st.book) return false;
        return f < st.book || (st.chapter != null && st.chapter >= g.chapter);
      };
      const layerOk = g => !active || !(g.layers || []).length || g.layers.some(l => active.has(l));
      const ok = g => bookOk(g || {}) && chapterOk(g || {}) && layerOk(g || {});
      const ids = new Set(model.records.filter(r => ok(r.gate)).map(r => r.id));
      const edges = model.edges.filter(e => ids.has(e.from) && ids.has(e.to) && ok(e.gate));
      const lib = window.AtlasTimeline.visible(model, ok);
      const dom = [...document.querySelectorAll('#timeline .tl-list .tl-it[data-id], #timeline .tl-und .tl-it[data-id]')].map(
        x => x.dataset.id,
      );
      const domSet = new Set(dom);
      const relHead = [...document.querySelectorAll('#timeline .tl-list h3')].find(h => /^Relationships/.test(h.textContent));
      return {
        expected: ids.size,
        rows: dom.length,
        distinct: domSet.size,
        missingN: [...ids].filter(i => !domSet.has(i)).length,
        extraN: [...domSet].filter(i => !ids.has(i)).length,
        libAgrees: lib.records.length === ids.size && lib.records.every(r => ids.has(r.id)) && lib.edges.length === edges.length,
        edgesExpected: edges.length,
        relN: relHead ? +relHead.textContent.replace(/\D+/g, '') : -1,
        /* list-section relationships only: a selected record's own details panel has its own .tl-edges list */
        relLi: document.querySelectorAll('#timeline .tl-list .tl-edges > li').length,
        detailLi: document.querySelectorAll('#timeline .tl-edges > li').length - document.querySelectorAll('#timeline .tl-list .tl-edges > li').length,
        has: Object.fromEntries(st.want.map(i => [i, domSet.has(i)])),
      };
    },
    [st, ID],
  );
const setEqual = (tag, what, c, want) => {
  check(
    `${tag} ${what}: list ids == gated model ids (rows distinct), relationships == gated edges`,
    c.missingN === 0 && c.extraN === 0 && c.distinct === c.expected && c.rows === c.distinct && c.libAgrees && c.relN === c.edgesExpected && c.relLi === c.edgesExpected,
    `expected ${c.expected}/${c.edgesExpected}; DOM ${c.distinct} distinct (${c.rows} rows), missing ${c.missingN}, extra ${c.extraN}; rel ${c.relN}/${c.relLi}; lib ${c.libAgrees}`,
  );
  const got = Object.entries(want).filter(([i, v]) => c.has[i] !== v);
  check(`${tag} ${what}: fixture records ${JSON.stringify(want)}`, got.length === 0, JSON.stringify(c.has));
};
const WANT = [K, C, A];
const ALL = ['jud', 'chr', 'isl', 'enc'];
const state = page =>
  page.evaluate(() => {
    const p = document.querySelector('#timeline .panel');
    const q = new URLSearchParams(location.hash.replace(/^#/, ''));
    const S = window.__atlas.S;
    const chips = Object.fromEntries(
      [...document.querySelectorAll('#filters [data-layer]')].map(b => [b.dataset.layer, b.getAttribute('aria-pressed') === 'true']),
    );
    return {
      open: !!p && p.offsetParent !== null,
      ch: document.querySelector('#chapterSel').value,
      hash: location.hash,
      layersQ: q.get('layers'),
      active: S.layers ? [...S.layers].sort().join(',') : 'ALL',
      chips,
      tl: q.get('tl'),
      tlsel: q.get('tlsel'),
    };
  });
const srv = await serve(site('chapters'));
const base = `http://127.0.0.1:${srv.address().port}/atlas/?pack=${ID}`;
const enc = s => encodeURIComponent(s);
// entries: hash, expected chapter, expected layers (null = all), expected open/tlsel
const E = [
  { hash: '#book=1&ch=5', ch: '5', layers: null, open: false, tlsel: null, label: 'start: ch 5, all layers, timeline closed' },
  { hash: `#book=1&ch=5&tl=1&tlsel=${enc(K)}`, ch: '5', layers: null, open: true, tlsel: K, label: 'open + select Karaite, all layers' },
  { hash: `#book=1&ch=5&layers=chr,isl,enc&tl=1&tlsel=${enc(K)}`, ch: '5', layers: ['chr', 'enc', 'isl'], open: true, tlsel: null, label: 'Judaism layer off: Karaite gated out, tlsel dropped' },
  { hash: `#book=1&ch=5&layers=jud&tl=1&tlsel=${enc(K)}`, ch: '5', layers: ['jud'], open: true, tlsel: K, label: 'only Judaism: Karaite selected' },
  { hash: `#book=1&ch=2&layers=jud&tl=1&tlsel=${enc(K)}`, ch: '2', layers: ['jud'], open: true, tlsel: null, label: 'only Judaism, ch 2: chapter gates Karaite out' },
  { hash: `#book=1&ch=5&layers=isl`, ch: '5', layers: ['isl'], open: false, tlsel: null, label: 'only Islam, timeline closed' },
  { hash: `#book=1&ch=5&tl=1&tlsel=${enc(C)}`, ch: '5', layers: null, open: true, tlsel: C, label: 'all layers again (no key) + select Covenant' },
];
for (const [w, h] of [
  [1440, 900],
  [390, 844],
]) {
  const tag = `layers/${w}`;
  const ctx = await browser.newContext({ viewport: { width: w, height: h }, serviceWorkers: 'block' });
  const page = await ctx.newPage();
  const errors = [];
  page.on('pageerror', e => errors.push(e.message));
  page.on('console', m => m.type() === 'error' && errors.push(m.text()));
  page.on('response', r => r.status() >= 400 && errors.push(r.status() + ' ' + r.url()));
  await page.goto(base + E[0].hash);
  await page.waitForFunction(() => !!document.querySelector('#tlBtn'), null, { polling: 500, timeout: 90000 });
  await page.waitForTimeout(3000);
  const verify = async (i, how) => {
    const e = E[i];
    const s = await state(page);
    const wantActive = e.layers ? e.layers.slice().sort().join(',') : 'ALL';
    const wantQ = e.layers ? ALL.filter(l => e.layers.includes(l)).join(',') : null;
    const chipsOk = ALL.every(l => s.chips[l] === (!e.layers || e.layers.includes(l)));
    const ok = s.ch === e.ch && s.open === e.open && s.tlsel === e.tlsel && s.active === wantActive && s.layersQ === wantQ && chipsOk;
    check(`${tag} ${how} entry ${i} (${e.label}): layers+chips+URL+chapter+timeline`, ok, JSON.stringify(s));
    if (e.open) {
      await tap(page, '#timeline [data-mode="list"]');
      await page.waitForTimeout(300);
      const want = { [K]: e.ch >= '3' && (!e.layers || e.layers.includes('jud')), [C]: e.ch >= '5' && (!e.layers || e.layers.includes('jud')) };
      setEqual(tag, `${how} entry ${i}`, await compare(page, { book: 1, chapter: +e.ch, layers: e.layers, want: [K, C] }), want);
    }
  };
  await verify(0, 'load');
  for (let i = 1; i < E.length; i++) {
    await page.evaluate(h => (location.hash = h), E[i].hash);
    await page.waitForTimeout(900);
    await verify(i, 'link to');
  }
  for (let i = E.length - 2; i >= 0; i--) {
    await page.goBack();
    await page.waitForTimeout(900);
    await verify(i, 'Back to');
  }
  for (let i = 1; i < E.length; i++) {
    await page.goForward();
    await page.waitForTimeout(900);
    await verify(i, 'Forward to');
  }
  check(`${tag} no runtime errors`, errors.length === 0, errors.slice(0, 3).join(' | '));
  await ctx.close();
}
srv.close();
await browser.close();
console.log(`O-1 layer history probe: ${pass} pass, ${fail} fail`);
process.exit(fail ? 1 : 0);
