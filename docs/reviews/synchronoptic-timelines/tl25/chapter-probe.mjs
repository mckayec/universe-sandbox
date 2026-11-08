// Checkpoint 25 probe: the chapter selector in the actual atlas host, with the timeline open.
// Harness as tl23/host-layer-probe.mjs: copies the built `dist/` to a temp dir and serves it; nothing is written to
// the repository. Fixture variants (temp copy only, appended to the Religious Traditions pack, which has a tree
// timeline): the pack is made cumulative with two books; three tree nodes get synthetic gates —
//   jud-karaite            first 1, chapter 3 (dated, has relationships)
//   jud-covenant-tradition first 1, chapter 5 (undated; found by the undated search)
//   jud-ananites           first 2
// 'chapters' declares `chapters: 6` on book I; 'no-chapters' declares none (no selector, fail closed);
// 'unmodified' is the real single-mode pack (no selector at all). These synthetic gates are test fixtures only.
// Activation is DOM-level (element.click(), select value + change event): simulated input, not real pointer input.
// usage: node chapter-probe.mjs <dist dir>
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
  const dir = mkdtempSync(join(tmpdir(), 'tl25-'));
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

for (const variant of ['chapters', 'no-chapters', 'unmodified']) {
  const srv = await serve(site(variant));
  const base = `http://127.0.0.1:${srv.address().port}/atlas/?pack=${ID}`;
  for (const [w, h] of [
    [1440, 900],
    [390, 844],
  ]) {
    const tag = `${variant}/${w}`;
    const ctx = await browser.newContext({ viewport: { width: w, height: h }, serviceWorkers: 'block' });
    const page = await ctx.newPage();
    const errors = [];
    page.on('pageerror', e => errors.push(e.message));
    page.on('console', m => m.type() === 'error' && errors.push(m.text()));
    page.on('response', r => r.status() >= 400 && errors.push(r.status() + ' ' + r.url()));
    const ready = async hash => {
      await page.goto('about:blank');
      await page.goto(base + (hash ? '#' + hash : ''));
      await page.waitForFunction(() => !!document.querySelector('#tlBtn'), null, { polling: 500, timeout: 90000 });
      await page.waitForTimeout(3000);
    };
    const st = (book, chapter, layers = null) => ({ book, chapter, layers, want: WANT });
    const sel = () => page.evaluate(() => {
      const w = document.querySelector('#chapterWrap');
      const s = document.querySelector('#chapterSel');
      return { present: !!s, shown: !!w && !w.hidden && w.getBoundingClientRect().width > 0, value: s ? s.value : null, options: s ? s.options.length : 0 };
    });
    const detail = async () => (await page.textContent('#timeline .tl-info')) || '';
    const open = async () => {
      if (!(await page.evaluate(() => !!document.querySelector('#timeline .panel') && document.querySelector('#timeline .panel').offsetParent !== null)))
        await tap(page, '#tlBtn');
      await page.waitForTimeout(400);
      await tap(page, '#timeline [data-mode="list"]');
      await page.waitForTimeout(300);
    };
    const book = async b => {
      await tap(page, `#books [data-b="${b}"]`);
      await page.waitForTimeout(500);
    };
    const pick = async id => {
      await tap(page, `#timeline .tl-it[data-id="${id}"]`);
      await page.waitForTimeout(300);
    };
    const usearch = async label => {
      await tap(page, '#timeline [data-mode="chart"]');
      await page.waitForTimeout(300);
      const n = await page.evaluate(v => {
        const i = document.querySelector('#timeline [data-tl-uq]');
        if (!i) return -1;
        i.value = v;
        i.dispatchEvent(new Event('input', { bubbles: true }));
        return 0;
      }, label);
      await page.waitForTimeout(200);
      const hits = n < 0 ? -1 : await page.evaluate(() => document.querySelectorAll('#timeline .tl-uhits [data-uhit]').length);
      await page.evaluate(() => {
        const i = document.querySelector('#timeline [data-tl-uq]');
        if (i) {
          i.value = '';
          i.dispatchEvent(new Event('input', { bubbles: true }));
        }
      });
      await tap(page, '#timeline [data-mode="list"]');
      await page.waitForTimeout(300);
      return hits;
    };

    if (variant === 'unmodified') {
      await ready('');
      const s = await sel();
      check(`${tag} real single-mode pack: no chapter selector in the page`, !s.present);
      await open();
      setEqual(tag, 'real pack, All', await compare(page, st(0, null)), { [K]: true, [C]: true, [A]: true });
      check(`${tag} no runtime errors`, errors.length === 0, errors.slice(0, 3).join(' | '));
      await ctx.close();
      continue;
    }
    await ready('');
    await open();
    let s = await sel();
    check(`${tag} All: selector ${variant === 'chapters' ? 'present but hidden' : 'absent'}`, variant === 'chapters' ? s.present && !s.shown : !s.present);
    setEqual(tag, 'All', await compare(page, st(0, null)), { [K]: true, [C]: true, [A]: true });
    await book(1);
    s = await sel();
    let q = await hq(page);
    if (variant === 'no-chapters') {
      check(`${tag} book I without declared chapters: no selector, no ch in URL`, !s.present && q.ch == null);
      setEqual(tag, 'book I, no selector (fail closed)', await compare(page, st(1, null)), { [K]: false, [C]: false, [A]: false });
      await ready('book=1&ch=3&tl=1');
      q = await hq(page);
      check(`${tag} link ch=3 on a book with no chapters is ignored and dropped from the URL`, q.ch == null && q.book === '1', JSON.stringify(q));
      await open();
      setEqual(tag, 'book I via link with ch=3 (ignored)', await compare(page, st(1, null)), { [K]: false, [C]: false, [A]: false });
      check(`${tag} no runtime errors`, errors.length === 0, errors.slice(0, 3).join(' | '));
      await ctx.close();
      continue;
    }
    check(`${tag} book I: selector shown, Not set + 6 chapters, value Not set, no ch in URL`, s.shown && s.options === 7 && s.value === '' && q.ch == null, JSON.stringify(s));
    info(`${tag} selector reachability with the timeline open`, JSON.stringify(await page.evaluate(() => {
      const b = document.querySelector('#chapterSel').getBoundingClientRect();
      const top = document.elementFromPoint(b.x + b.width / 2, b.y + b.height / 2);
      return { onScreen: b.width > 0 && b.x >= 0 && b.right <= innerWidth && b.y >= 0 && b.bottom <= innerHeight, topIsSelect: top === document.querySelector('#chapterSel') };
    })));
    setEqual(tag, 'book I, chapter not set', await compare(page, st(1, null)), { [K]: false, [C]: false, [A]: false });
    await setCh(page, '3');
    await page.waitForTimeout(400);
    q = await hq(page);
    const ann = await page.textContent('#announce');
    check(`${tag} chapter 3: URL ch=3, announcement names the chapter`, q.ch === '3' && /through chapter 3/.test(ann || ''), `ch=${q.ch} ann=${ann}`);
    setEqual(tag, 'book I, chapter 3', await compare(page, st(1, 3)), { [K]: true, [C]: false, [A]: false });
    await pick(K);
    q = await hq(page);
    check(`${tag} Karaite selected at chapter 3 (tlsel + detail)`, q.tlsel === K && (await detail()).includes('Karaite'), `tlsel=${q.tlsel}`);
    // chapter downgrade
    await setCh(page, '2');
    await page.waitForTimeout(400);
    q = await hq(page);
    check(`${tag} chapter 3 → 2: selection, detail and URL tlsel removed; ch=2`, !q.tlsel && !(await detail()).includes('Karaite') && q.ch === '2', JSON.stringify(q));
    setEqual(tag, 'book I, chapter 2', await compare(page, st(1, 2)), { [K]: false, [C]: false, [A]: false });
    check(`${tag} chapter 2: undated search does not find Covenant tradition`, (await usearch('Covenant tradition')) === 0);
    // chapter upgrade to 5, undated search and selection
    await setCh(page, '5');
    await page.waitForTimeout(400);
    setEqual(tag, 'book I, chapter 5', await compare(page, st(1, 5)), { [K]: true, [C]: true, [A]: false });
    check(`${tag} chapter 5: undated search finds Covenant tradition`, (await usearch('Covenant tradition')) >= 1);
    await pick(C);
    q = await hq(page);
    check(`${tag} Covenant tradition selected at chapter 5`, q.tlsel === C, `tlsel=${q.tlsel}`);
    // layer downgrade and restore keep the chapter
    const layers = await page.evaluate(() => [...document.querySelectorAll('#filters [data-layer]')].map(b => b.dataset.layer));
    await tap(page, '#filters [data-layer="jud"]');
    await page.waitForTimeout(500);
    q = await hq(page);
    const off = layers.filter(l => l !== 'jud');
    check(`${tag} jud layer off: selection removed, chapter kept (ch=5)`, !q.tlsel && q.ch === '5' && (await sel()).value === '5', JSON.stringify(q));
    setEqual(tag, 'book I, chapter 5, jud off', await compare(page, st(1, 5, off)), { [K]: false, [C]: false, [A]: false });
    await tap(page, '#filters [data-layer="jud"]');
    await page.waitForTimeout(500);
    setEqual(tag, 'book I, chapter 5, jud back on', await compare(page, st(1, 5)), { [K]: true, [C]: true, [A]: false });
    // invalid selector value is "not set"
    await setCh(page, '');
    await page.waitForTimeout(300);
    q = await hq(page);
    check(`${tag} Not set again: ch removed from the URL`, q.ch == null);
    setEqual(tag, 'book I, chapter reset', await compare(page, st(1, null)), { [K]: false, [C]: false, [A]: false });
    // book changes reset the chapter
    await setCh(page, '5');
    await page.waitForTimeout(300);
    await book(2);
    s = await sel();
    q = await hq(page);
    check(`${tag} book II (no chapters): selector hidden, ch dropped`, !s.shown && q.ch == null, JSON.stringify(q));
    setEqual(tag, 'book II', await compare(page, st(2, null)), { [K]: true, [C]: true, [A]: true });
    await book(1);
    s = await sel();
    check(`${tag} back to book I: chapter Not set again (fail closed)`, s.shown && s.value === '' && (await hq(page)).ch == null);
    setEqual(tag, 'book I after book II', await compare(page, st(1, null)), { [K]: false, [C]: false, [A]: false });
    await setCh(page, '6');
    await page.waitForTimeout(300);
    await book(0);
    s = await sel();
    check(`${tag} All: selector hidden, ch dropped`, !s.shown && (await hq(page)).ch == null);
    // same-document hash navigation (popstate)
    await book(1);
    await setCh(page, '3');
    await page.waitForTimeout(300);
    await page.evaluate(() => (location.hash = location.hash.replace(/ch=3/, 'ch=2')));
    await page.waitForTimeout(600);
    check(`${tag} same-document link ch=2 applied`, (await sel()).value === '2' && (await hq(page)).ch === '2');
    await page.evaluate(() => (location.hash = location.hash.replace(/ch=2/, 'ch=abc')));
    await page.waitForTimeout(600);
    check(`${tag} same-document link ch=abc: Not set, ch dropped`, (await sel()).value === '' && (await hq(page)).ch == null);
    setEqual(tag, 'book I after ch=abc', await compare(page, st(1, null)), { [K]: false, [C]: false, [A]: false });
    // fresh loads
    await ready(`book=1&ch=3&tl=1&tlsel=${encodeURIComponent(K)}`);
    q = await hq(page);
    check(`${tag} fresh load book=1&ch=3&tlsel=Karaite: chapter 3 and selection restored`, (await sel()).value === '3' && q.ch === '3' && q.tlsel === K, JSON.stringify(q));
    await ready(`book=1&ch=9&tl=1&tlsel=${encodeURIComponent(K)}`);
    q = await hq(page);
    check(`${tag} fresh load ch=9 (out of range): Not set, Karaite selection not restored`, (await sel()).value === '' && q.ch == null && q.tlsel !== K, JSON.stringify(q));
    await ready(`book=2&ch=3`);
    q = await hq(page);
    check(`${tag} fresh load book=2&ch=3 (book without chapters): ch dropped`, q.ch == null && q.book === '2', JSON.stringify(q));
    await ready(`ch=3&tl=1&tlsel=${encodeURIComponent(K)}`);
    q = await hq(page);
    check(`${tag} fresh load ch=3 without a book (remembered book ${q.book}): ch ignored, Karaite not selected`, q.ch == null && q.tlsel !== K, JSON.stringify(q));
    if (w === 1440 || w === 390) await page.screenshot({ path: new URL(`./shot-${w}.png`, import.meta.url).pathname, scale: 'css' }).catch(() => {});
    check(`${tag} no runtime errors`, errors.length === 0, errors.slice(0, 3).join(' | '));
    await ctx.close();
  }
  srv.close();
}
await browser.close();
console.log(`chapter probe: ${pass} pass, ${fail} fail`);
process.exit(fail ? 1 : 0);
