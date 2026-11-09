// Checkpoint 22 probe: the Standard Works atlas host (engine.js) with its timeline adapter, in a real browser.
// The SW pack is PR33's (not on this branch); the probe copies `dist/` to a temp dir, adds that pack file and one
// registry line there only, serves it, and drives atlas/?pack=lds-standard-works at 1440x900 and 390x844.
// Variants: "not-opted-in" (the pack as shipped by PR33) and "opted-in" (harness appends the committed tl20 proposed
// sidecar plus the host-derived source version; nothing is written to the repository).
// usage: CHROME_PATH=... node actual-host-probe.mjs <lds-standard-works.js at PR33> <dist dir>
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

function site(optIn) {
  const dir = mkdtempSync(join(tmpdir(), 'tl22-'));
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
const hashOf = page => page.evaluate(() => new URLSearchParams(location.hash.replace(/^#/, '')));
const hq = async page =>
  Object.fromEntries(await page.evaluate(() => [...new URLSearchParams(location.hash.replace(/^#/, ''))]));
const shotDir = process.env.TL22_SHOTS;
/* DOM-level activation: under software WebGL the 3D scene keeps the renderer too busy for Playwright's input
   pipeline to acknowledge a synthetic mouse click, so controls are activated with element.click() */
const tap = (page, sel) => page.evaluate(s => document.querySelector(s).click(), sel);

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
    await page.goto(base);
    await page
      .waitForFunction(() => !!document.querySelector('#tlBtn'), null, { polling: 500, timeout: 60000 })
      .catch(async () => {
        const body = await page.evaluate(
          () =>
            location.href +
            ' btn=' +
            !!document.querySelector('#tlBtn') +
            ' tl=' +
            !!document.querySelector('#timeline') +
            ' AT=' +
            !!window.AtlasTimeline +
            ' ATV=' +
            !!window.AtlasTimelineView +
            ' ad=' +
            (window.AtlasTimeline &&
              !!window.AtlasTimeline.adapterFor((window.ATLAS_PACKS || {})['lds-standard-works'])) +
            ' hdr=' +
            (document.querySelector('header.top .controls') || {}).innerHTML,
        );
        throw new Error(tag + ' never offered #tlBtn: ' + errors.join(' | ') + ' page: ' + body);
      });
    await page.waitForTimeout(3500);
    const btn = await page.$('#tlBtn');
    const box = await btn.boundingBox();
    check(
      `${tag} Timeline button offered and on screen`,
      !!box && box.x >= 0 && box.x + box.width <= w && box.y >= 0,
      JSON.stringify(box && { x: Math.round(box.x), y: Math.round(box.y), w: Math.round(box.width) }),
    );
    await tap(page, '#tlBtn');
    await page.waitForTimeout(400);
    let q = await hq(page);
    check(`${tag} opens (dialog visible, tl in URL)`, (await page.isVisible('#timeline .panel')) && q.tl === '1');
    const g = await page.getAttribute('#timeline', 'data-tl-grounding');
    if (variant === 'opted-in')
      check(`${tag} sidecar reconciled on the actual host: 0 promoted`, g === 'ok promoted=0', String(g));
    else check(`${tag} not opted in: no sidecar read`, g === null, String(g));
    const exp = await page.evaluate(() => {
      const P = window.ATLAS_PACKS['lds-standard-works'];
      const m = window.AtlasTimeline.adapterFor(P)(P);
      return { records: m.records.length, edges: m.edges.length, grounded: m.edges.filter(e => e.grounding).length };
    });
    check(`${tag} actual SW model behind the host`, exp.records > 1000 && exp.grounded === 0, JSON.stringify(exp));
    await tap(page, '#timeline [data-mode="list"]');
    await page.waitForTimeout(300);
    const listIds = await page.evaluate(
      () => new Set([...document.querySelectorAll('#timeline [data-id]')].map(x => x.dataset.id)).size,
    );
    check(`${tag} list mode renders records (All books)`, listIds > 100, `${listIds} distinct record ids in DOM`);
    if (shotDir) await page.screenshot({ path: `${shotDir}/tl22-${variant}-${w}-list.jpg`, quality: 70 });
    await tap(page, '#timeline [data-mode="chart"]');
    await page.waitForTimeout(300);
    if (shotDir) await page.screenshot({ path: `${shotDir}/tl22-${variant}-${w}-chart.jpg`, quality: 70 });
    // search (All books): the NT place is findable
    const hits = async () => {
      await page.evaluate(v => {
        const i = document.querySelector('#timeline [data-tl-uq]');
        i.value = v;
        i.dispatchEvent(new Event('input', { bubbles: true }));
      }, LABEL);
      await page.waitForTimeout(200);
      return page.evaluate(() => document.querySelectorAll('#timeline .tl-uhits [data-uhit]').length);
    };
    check(`${tag} search finds ${LABEL} with All books`, (await hits()) >= 1);
    // Escape closes and drops tl from the URL
    await page.evaluate(() =>
      (document.activeElement || document.body).dispatchEvent(
        new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }),
      ),
    );
    await page.waitForTimeout(300);
    q = await hq(page);
    check(`${tag} Escape closes`, !(await page.isVisible('#timeline .panel')) && !('tl' in q));
    // URL restore with a selection on a fresh load
    await page.goto(base + '#tl=1&tlsel=' + encodeURIComponent(TARGET));
    await page.waitForFunction(() => !!document.querySelector('#tlBtn'), null, { polling: 500, timeout: 60000 });
    await page.waitForTimeout(3500);
    q = await hq(page);
    const info = () => page.textContent('#timeline .tl-info');
    check(
      `${tag} URL restore opens with selection`,
      (await page.isVisible('#timeline .panel')) && q.tlsel === TARGET && (await info()).includes(LABEL),
      `tlsel=${q.tlsel}`,
    );
    if (shotDir && w === 390)
      await page.screenshot({ path: `${shotDir}/tl22-${variant}-${w}-selected.jpg`, quality: 70 });
    // downgrade: Old Testament only (pack spoilers mode "single") hides the NT place
    await page.evaluate(() => document.querySelector('#books button[data-b="1"]').click());
    await page.waitForTimeout(500);
    q = await hq(page);
    const inDom = await page.evaluate(
      id => !!document.querySelector('#timeline [data-id="' + CSS.escape(id) + '"]'),
      TARGET,
    );
    check(
      `${tag} downgrade to OT drops selection, record and URL tlsel`,
      !q.tlsel && !inDom && !(await info()).includes(LABEL),
      `tlsel=${q.tlsel} inDom=${inDom}`,
    );
    check(`${tag} downgrade: search no longer finds ${LABEL}`, (await hits()) === 0);
    // layer gate: back to All, then NT layer off hides it too (if the host exposes layer chips)
    await page.evaluate(() => document.querySelector('#books button[data-b="2"]').click());
    await page.waitForTimeout(400);
    check(`${tag} NT book restores ${LABEL} to search`, (await hits()) >= 1);
    // close with its own button, then Back/Forward
    await tap(page, '#timeline [data-tl="close"]');
    await page.waitForTimeout(300);
    await tap(page, '#tlBtn');
    await page.waitForTimeout(300);
    await page.evaluate(() => history.back());
    await page.waitForTimeout(400);
    const closedByBack = !(await page.isVisible('#timeline .panel'));
    await page.evaluate(() => history.forward());
    await page.waitForTimeout(400);
    check(`${tag} Back closes, Forward reopens`, closedByBack && (await page.isVisible('#timeline .panel')));
    check(`${tag} no page/console errors`, errors.length === 0, errors.slice(0, 3).join(' | '));
    await ctx.close();
  }
  srv.close();
}
await browser.close();
console.log(`pack blob ${blob}`);
console.log(`${pass}/${pass + fail} checks passed`);
process.exit(fail ? 1 : 0);
