// TL25-R1 combined history regression in the actual atlas host (built dist, temp copy; nothing written to the repo).
// Same fixture as tl25/chapter-probe.mjs (synthetic chapter gates: Karaite ch 3, Covenant ch 5; test fixtures only).
// Navigation is same-document link input (location.hash) plus real browser Back/Forward (page.goBack/goForward).
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
  const dir = mkdtempSync(join(tmpdir(), 'tl26-'));
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
        relLi: document.querySelectorAll('#timeline .tl-edges > li').length,
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

const tlState = page =>
  page.evaluate(() => {
    const p = document.querySelector('#timeline .panel');
    const q = new URLSearchParams(location.hash.replace(/^#/, ''));
    return { open: !!p && p.offsetParent !== null, ch: document.querySelector('#chapterSel').value, hash: location.hash, tl: q.get('tl'), tlc: q.get('tlc'), tlsel: q.get('tlsel') };
  });
const srv = await serve(site('chapters'));
const base = `http://127.0.0.1:${srv.address().port}/atlas/?pack=${ID}`;
for (const [w, h] of [
  [1440, 900],
  [390, 844],
]) {
  const tag = `history/${w}`;
  const ctx = await browser.newContext({ viewport: { width: w, height: h }, serviceWorkers: 'block' });
  const page = await ctx.newPage();
  const errors = [];
  page.on('pageerror', e => errors.push(e.message));
  page.on('console', m => m.type() === 'error' && errors.push(m.text()));
  page.on('response', r => r.status() >= 400 && errors.push(r.status() + ' ' + r.url()));
  await page.goto(base + '#book=1&ch=2');
  await page.waitForFunction(() => !!document.querySelector('#tlBtn'), null, { polling: 500, timeout: 90000 });
  await page.waitForTimeout(3000);
  const lanes = await page.evaluate(([ID, K]) => {
    const P = window.ATLAS_PACKS[ID];
    const m = window.AtlasTimeline.adapterFor(P)(P);
    const used = new Set(m.records.map(r => r.lane));
    const kl = (m.records.find(r => r.id === K) || {}).lane;
    return { all: m.lanes.map(l => l.id), used: m.lanes.map(l => l.id).filter(id => used.has(id) && id !== kl) };
  }, [ID, K]);
  const collapseLane = lanes.used[0];
  const custom = lanes.all.slice().reverse().join(',');
  const enc = s => encodeURIComponent(s);
  // collapse a lane other than the selection's (showing a selection expands its own lane, by design)
  // same-document navigations, each pushing a history entry (simulated link input; real browser history)
  const E = [
    { hash: '#book=1&ch=2', want: { open: false, ch: '2', tlsel: null }, label: 'start: chapter 2, timeline closed' },
    { hash: `#book=1&ch=3&tl=1&tlsel=${enc(K)}`, want: { open: true, ch: '3', tl: '1', tlsel: K }, label: 'chapter 2→3 + open + select Karaite (gated at ch 3)' },
    { hash: `#book=1&ch=2&tl=1&tlsel=${enc(K)}`, want: { open: true, ch: '2', tl: '1', tlsel: null }, label: 'chapter 3→2 gates Karaite selection out; tlsel dropped' },
    { hash: `#book=1&ch=5&tl=${enc(custom)}&tlc=${enc(collapseLane)}&tlsel=${enc(K)}`, want: { open: true, ch: '5', tl: custom, tlc: collapseLane, tlsel: K }, label: 'chapter 2→5 + lane order/collapse + selection' },
    { hash: '#book=1&ch=4', want: { open: false, ch: '4', tlsel: null }, label: 'chapter 5→4 closes timeline' },
    { hash: `#book=1&ch=abc&tl=1&tlsel=${enc(K)}`, want: { open: true, ch: '', tl: '1', tlsel: null }, label: 'invalid ch → Not set; Karaite gated out' },
  ];
  const verify = async (i, how) => {
    const s = await tlState(page);
    const ok = Object.entries(E[i].want).every(([k, v]) => s[k] === v);
    check(`${tag} ${how} entry ${i} (${E[i].label})`, ok, JSON.stringify(s));
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
  await tap(page, '#timeline [data-mode="list"]');
  await page.waitForTimeout(400);
  setEqual(tag, 'final state (Not set)', await compare(page, { book: 1, chapter: null, layers: null, want: WANT }), { [K]: false, [C]: false, [A]: false });
  check(`${tag} no runtime errors`, errors.length === 0, errors.slice(0, 3).join(' | '));
  await ctx.close();
}
srv.close();
await browser.close();
console.log(`history browser probe: ${pass} pass, ${fail} fail`);
process.exit(fail ? 1 : 0);
