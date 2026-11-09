// Checkpoint 23 probe (TL22-E1, TL22-E3, TL22-E2 attempt): the actual Standard Works atlas host with its timeline.
// Same harness as tl22/actual-host-probe.mjs: copies `dist/` to a temp dir, adds the PR33 pack file and one registry
// line there only, serves it, drives atlas/?pack=lds-standard-works at 1440x900 and 390x844, variants not-opted-in
// and opted-in (harness appends the committed tl20 proposed sidecar). Nothing is written to the repository.
//
// E3: the expected record-ID set is computed in the page from the actual adapter model with an INDEPENDENT copy of
//     the host gate (book gate, chapter gate, layer gate) for the state the probe has set; it must EQUAL the set of
//     list-row ids (`.tl-list` dated rows + `.tl-und` undated rows, `.tl-it[data-id]`), and the rendered relationship count must equal the expected edge
//     count. It is also cross-checked against AtlasTimeline.visible() with the same predicate.
// E1: a real host layer chip (`#filters [data-layer]`, the atlas's own layer bar) is switched off and on while the
//     timeline is open with an NT selection, and the layer state is restored from the URL on a fresh load.
// E2: one bounded attempt at real Playwright pointer/keyboard input per width; reported as INFO, never as a pass
//     unless it actually completes.
// usage: CHROME_PATH=... node host-layer-probe.mjs <lds-standard-works.js at PR33> <dist dir>
import { createHash } from 'node:crypto';
import { cpSync, mkdtempSync, readFileSync, writeFileSync, appendFileSync } from 'node:fs';
import { createServer } from 'node:http';
import { tmpdir } from 'node:os';
import { join, extname } from 'node:path';
import { chromium } from 'playwright';

const here = new URL('.', import.meta.url);
const [packPath, distDir] = process.argv.slice(2);
const bytes = readFileSync(packPath);
const blob = createHash('sha1')
  .update(Buffer.concat([Buffer.from('blob ' + bytes.length + '\0'), bytes]))
  .digest('hex');
const hostVersion = 'lds-standard-works/timeline-pilot@r1;pack-blob:' + blob;
const sidecar = readFileSync(new URL('../tl20/pilot-sidecar.v1.json', here), 'utf8');
const TARGET = 's:capernaum';
const LABEL = 'Capernaum';
const ALL = ['ot', 'nt', 'bom', 'dc', 'pgp'];

function site(optIn) {
  const dir = mkdtempSync(join(tmpdir(), 'tl23-'));
  cpSync(distDir, dir, { recursive: true });
  const pack = join(dir, 'atlas/packs/lds-standard-works.js');
  writeFileSync(pack, bytes);
  if (optIn)
    appendFileSync(
      pack,
      `\n;(function(P){P.timelineReview=${sidecar.trim()};P.timelineSourceVersion=${JSON.stringify(hostVersion)};})(window.ATLAS_PACKS['lds-standard-works']);\n`,
    );
  const reg = join(dir, 'atlas/packs/registry.js');
  const r = readFileSync(reg, 'utf8').replace(
    /\n\];\s*$/,
    ',\n  {id: "lds-standard-works", title: "Standard Works", blurb: "probe", accent: "#e4cf9a"}\n];\n',
  );
  writeFileSync(reg, r);
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
  executablePath: process.env.CHROME_PATH,
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
/* DOM-level activation (see TL22-E2): element.click() */
const tap = (page, sel) => page.evaluate(s => document.querySelector(s).click(), sel);

/* Exact comparison of the rendered list against the gated model for a probe-known state {book, layers}. The gate is
   re-implemented here (not taken from the view): book gate as engine.js treeNodeSeen, chapter gate with no chapter
   selector, layer gate as layers.js layerOk. */
const compare = (page, state) =>
  page.evaluate(st => {
    const P = window.ATLAS_PACKS['lds-standard-works'];
    const cum = !!(P.spoilers && P.spoilers.mode === 'cumulative');
    const model = window.AtlasTimeline.adapterFor(P)(P);
    const active = st.layers ? new Set(st.layers) : null;
    const bookOk = g => {
      if (!st.book) return true;
      if (g.first != null && st.book < g.first) return false;
      if (g.books && g.books.length) return cum ? Math.min(...g.books) <= st.book : g.books.includes(st.book);
      return true;
    };
    const chapterOk = g => {
      if (!g || g.chapter == null || !st.book || !cum) return true;
      const f =
        g.first != null ? g.first : g.book != null ? g.book : g.books && g.books.length ? Math.min(...g.books) : null;
      if (f == null) return false;
      return f < st.book; /* no chapter selector: a chapter of the current book stays hidden */
    };
    const layerOk = g => {
      const ls = (g && g.layers) || [];
      return !active || !ls.length || ls.some(l => active.has(l));
    };
    const ok = g => bookOk(g || {}) && chapterOk(g || {}) && layerOk(g || {});
    const recs = model.records.filter(r => ok(r.gate));
    const ids = new Set(recs.map(r => r.id));
    const edges = model.edges.filter(e => ids.has(e.from) && ids.has(e.to) && ok(e.gate));
    const lib = window.AtlasTimeline.visible(model, ok);
    const dom = [
      ...document.querySelectorAll('#timeline .tl-list .tl-it[data-id], #timeline .tl-und .tl-it[data-id]'),
    ].map(x => x.dataset.id);
    const domSet = new Set(dom);
    const missing = [...ids].filter(i => !domSet.has(i));
    const extra = [...domSet].filter(i => !ids.has(i));
    const relHead = [...document.querySelectorAll('#timeline .tl-list h3')].find(h =>
      /^Relationships/.test(h.textContent),
    );
    const relN = relHead ? +relHead.textContent.replace(/\D+/g, '') : -1;
    const relLi = document.querySelectorAll('#timeline .tl-edges > li').length;
    return {
      expected: ids.size,
      rows: dom.length,
      distinct: domSet.size,
      missing: missing.slice(0, 5),
      missingN: missing.length,
      extraN: extra.length,
      extra: extra.slice(0, 5),
      libAgrees:
        lib.records.length === ids.size && lib.records.every(r => ids.has(r.id)) && lib.edges.length === edges.length,
      edgesExpected: edges.length,
      relN,
      relLi,
      ntEdges: edges.filter(e => (e.gate.layers || []).includes('nt')).length,
    };
  }, state);
const setEqual = (tag, what, c) =>
  check(
    `${tag} ${what}: list ids == gated model ids, relationships == gated edges`,
    c.missingN === 0 &&
      c.extraN === 0 &&
      c.distinct === c.expected &&
      // TL23-E1: every rendered row is a distinct id (a duplicated row fails even when the id sets match)
      c.rows === c.distinct &&
      c.libAgrees &&
      c.relN === c.edgesExpected &&
      c.relLi === c.edgesExpected,
    `expected ${c.expected} records/${c.edgesExpected} edges; DOM ${c.distinct} distinct (${c.rows} rows), missing ${c.missingN}${c.missingN ? ' ' + c.missing : ''}, extra ${c.extraN}${c.extraN ? ' ' + c.extra : ''}; relationships ${c.relN}/${c.relLi} li; library visible() agrees ${c.libAgrees}`,
  );

for (const variant of ['not-opted-in', 'opted-in']) {
  const srv = await serve(site(variant === 'opted-in'));
  const base = `http://127.0.0.1:${srv.address().port}/atlas/?pack=lds-standard-works`;
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
    page.on('requestfailed', r => errors.push('request failed ' + r.url()));
    page.on('response', r => r.status() >= 400 && errors.push(r.status() + ' ' + r.url()));
    /* a real document load each time: going to a URL that differs only in its hash would be a same-document
       navigation, which the atlas host does not treat as a fresh load (see checkpoint-23.md, observation O-1) */
    const ready = async url => {
      await page.goto('about:blank');
      await page.goto(url);
      await page
        .waitForFunction(() => !!document.querySelector('#tlBtn'), null, { polling: 500, timeout: 90000 })
        .catch(async () => {
          const st = await page.evaluate(
            () =>
              location.href +
              ' AT=' +
              !!window.AtlasTimeline +
              ' P=' +
              !!(window.ATLAS_PACKS || {})['lds-standard-works'],
          );
          throw new Error(tag + ' never offered #tlBtn: ' + errors.join(' | ') + ' page: ' + st);
        });
      await page.waitForTimeout(3500);
    };
    /* undated search is offered in chart mode (folded per-work panels); switch there and back to list */
    const hits = async () => {
      await tap(page, '#timeline [data-mode="chart"]');
      await page.waitForTimeout(300);
      await page.evaluate(v => {
        const i = document.querySelector('#timeline [data-tl-uq]');
        i.value = v;
        i.dispatchEvent(new Event('input', { bubbles: true }));
      }, LABEL);
      await page.waitForTimeout(200);
      const n = await page.evaluate(() => document.querySelectorAll('#timeline .tl-uhits [data-uhit]').length);
      await page.evaluate(() => {
        const i = document.querySelector('#timeline [data-tl-uq]');
        i.value = '';
        i.dispatchEvent(new Event('input', { bubbles: true }));
      });
      await page.waitForTimeout(150);
      await tap(page, '#timeline [data-mode="list"]');
      await page.waitForTimeout(300);
      return n;
    };
    const inList = () =>
      page.evaluate(
        id =>
          [...document.querySelectorAll('#timeline .tl-list .tl-it, #timeline .tl-und .tl-it')].some(
            x => x.dataset.id === id,
          ),
        TARGET,
      );
    const detail = async () => (await page.textContent('#timeline .tl-info')) || '';
    const chip = id => page.getAttribute(`#filters [data-layer="${id}"]`, 'aria-pressed');
    const listMode = async () => {
      await tap(page, '#timeline [data-mode="list"]');
      await page.waitForTimeout(300);
    };

    // ---- E3: All books, every layer on
    await ready(base);
    await tap(page, '#tlBtn');
    await page.waitForTimeout(400);
    await listMode();
    setEqual(tag, 'All books, all layers', await compare(page, { book: 0, layers: null }));

    // ---- E1: select the NT place from its list row, then switch the NT layer off with the host's own chip
    await tap(page, `#timeline .tl-und .tl-it[data-id="${TARGET}"]`);
    await page.waitForTimeout(300);
    let q = await hq(page);
    check(
      `${tag} NT place selected from its list row`,
      q.tlsel === TARGET && (await detail()).includes(LABEL),
      `tlsel=${q.tlsel}`,
    );
    const hit = await page.evaluate(() => {
      const b = document.querySelector('#filters [data-layer="nt"]');
      const r = b.getBoundingClientRect();
      const top = document.elementFromPoint(r.x + r.width / 2, r.y + r.height / 2);
      return {
        onScreen: r.width > 0 && r.x >= 0 && r.right <= innerWidth && r.y >= 0 && r.bottom <= innerHeight,
        topIsChip: !!top && b.contains(top),
      };
    });
    info(`${tag} layer chip reachability while the timeline is open`, JSON.stringify(hit));
    check(`${tag} NT chip starts pressed`, (await chip('nt')) === 'true');
    await tap(page, '#filters [data-layer="nt"]');
    await page.waitForTimeout(500);
    q = await hq(page);
    const off = ALL.filter(l => l !== 'nt');
    check(
      `${tag} NT layer off: chip unpressed, URL layers=${off.join(',')}`,
      (await chip('nt')) === 'false' && q.layers === off.join(','),
      `layers=${q.layers}`,
    );
    check(
      `${tag} NT layer off: selection, record, detail and URL tlsel removed`,
      !q.tlsel && !(await inList()) && !(await detail()).includes(LABEL),
      `tlsel=${q.tlsel}`,
    );
    check(`${tag} NT layer off: search no longer finds ${LABEL}`, (await hits()) === 0);
    const cOff = await compare(page, { book: 0, layers: off });
    setEqual(tag, 'NT layer off', cOff);
    check(`${tag} NT layer off: the timeline stayed open`, (await page.isVisible('#timeline .panel')) && q.tl != null);

    // ---- E1: switch it back on
    await tap(page, '#filters [data-layer="nt"]');
    await page.waitForTimeout(500);
    q = await hq(page);
    check(
      `${tag} NT layer on: chip pressed, URL layers removed`,
      (await chip('nt')) === 'true' && !('layers' in q),
      `layers=${q.layers}`,
    );
    check(`${tag} NT layer on: record and search restored`, (await inList()) && (await hits()) >= 1);
    check(
      `${tag} NT layer on: earlier selection not resurrected (as for a book downgrade)`,
      !q.tlsel && !(await detail()).includes(LABEL),
      `tlsel=${q.tlsel}`,
    );
    const cOn = await compare(page, { book: 0, layers: null });
    setEqual(tag, 'NT layer back on', cOn);
    check(
      `${tag} edge removal exercised (NT-gated edges ${cOn.ntEdges}; ${cOn.edgesExpected} on vs ${cOff.edgesExpected} off)`,
      cOn.edgesExpected > cOff.edgesExpected,
    );

    // ---- E1: layer state restored from the URL on a fresh load (selection to an NT place is revalidated away)
    await ready(base + '#tl=1&layers=' + off.join(',') + '&tlsel=' + encodeURIComponent(TARGET));
    q = await hq(page);
    await listMode();
    check(
      `${tag} fresh load with layers=${off.join(',')}: chip unpressed, tlsel dropped, record absent`,
      (await page.isVisible('#timeline .panel')) &&
        (await chip('nt')) === 'false' &&
        !q.tlsel &&
        !(await inList()) &&
        !(await detail()).includes(LABEL),
      `layers=${q.layers} tlsel=${q.tlsel}`,
    );
    setEqual(tag, 'fresh load, NT layer off', await compare(page, { book: 0, layers: off }));

    // ---- E3 under the book gate: Old Testament only (pack mode "single")
    await ready(base + '#tl=1');
    await page.evaluate(() => document.querySelector('#books button[data-b="1"]').click());
    await page.waitForTimeout(500);
    await listMode();
    setEqual(tag, 'Old Testament only', await compare(page, { book: 1, layers: null }));

    // ---- E2: one bounded real-input attempt (Playwright pointer + keyboard), reported, not counted
    await ready(base);
    const t0 = Date.now();
    let realClick = 'not attempted';
    try {
      await page.click('#tlBtn', { timeout: 15000 });
      await page.waitForTimeout(400);
      realClick = (await page.isVisible('#timeline .panel'))
        ? `opened in ${Date.now() - t0} ms`
        : 'click returned, panel not visible';
    } catch (e) {
      realClick = 'timed out: ' + String(e.message).split('\n')[0];
    }
    let realKey = 'not attempted (panel not open)';
    if (await page.isVisible('#timeline .panel')) {
      const t1 = Date.now();
      try {
        await page.keyboard.press('Escape', { timeout: 15000 });
        await page.waitForTimeout(400);
        realKey = !(await page.isVisible('#timeline .panel'))
          ? `Escape closed in ${Date.now() - t1} ms`
          : 'Escape returned, panel still open';
      } catch (e) {
        realKey = 'timed out: ' + String(e.message).split('\n')[0];
      }
    }
    info(`${tag} TL22-E2 real pointer click on Timeline button`, realClick);
    info(`${tag} TL22-E2 real keyboard Escape`, realKey);

    check(`${tag} no page/console errors`, errors.length === 0, errors.slice(0, 3).join(' | '));
    await ctx.close();
  }
  srv.close();
}
await browser.close();
console.log(`pack blob ${blob}`);
console.log(`${pass}/${pass + fail} checks passed`);
process.exit(fail ? 1 : 0);
