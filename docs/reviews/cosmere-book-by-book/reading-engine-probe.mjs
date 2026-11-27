// COS-BB-001 checkpoint 2 probe (rendered, Playwright + software GL).
// Family 1: legacy parity — for #book=0..12 on the real Cosmere pack, the rendered text of the world list,
//   every world dossier, the chronicle, every codex tab, the legend and the realm bar must be identical between
//   the baseline engine (BASE_ENGINE file) and the working-tree engine.
// Per-work smoke: the real pack plus an IN-MEMORY SYNTHETIC registry (fixture IDs fx-*, not research, never
//   written to the pack) exercises preset/set/safe links, the conservative bucket fallback and storage.
// Usage: node reading-engine-probe.mjs <baseUrl> <baselineEngine.js>
import { chromium } from 'playwright';
import { readFileSync } from 'node:fs';
const [base = 'http://localhost:5179', baseEngine] = process.argv.slice(2);
const browser = await chromium.launch({
  executablePath: process.env.CHROME_PATH || undefined,
  args: ['--use-gl=swiftshader', '--enable-webgl', '--ignore-gpu-blocklist'],
});
const SYN = `;(function(){var P=window.ATLAS_PACKS.cosmere;var w=[];for(var k=1;k<=12;k++){if(k===2){w.push({id:'fx-2a',title:'Fixture 2a',bucket:2},{id:'fx-2b',title:'Fixture 2b',bucket:2},{id:'fx-2c',title:'Fixture 2c',bucket:2});}else w.push({id:'fx-'+k,title:'Fixture '+k,bucket:k});}
P.spoilers=Object.assign({},P.spoilers,{works:w,presets:[{id:'pub',label:'Fixture order',versions:[{v:1,seq:w.map(function(x){return x.id;})}]}]});})();`;
async function page(engineSrc, hash, { synthetic = false, storage = null } = {}) {
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  if (engineSrc)
    await ctx.route('**/atlas/engine.js', r => r.fulfill({ contentType: 'text/javascript', body: engineSrc }));
  if (synthetic)
    await ctx.route('**/atlas/packs/cosmere.js', async r => {
      const res = await r.fetch();
      r.fulfill({ response: res, body: (await res.text()) + SYN });
    });
  if (storage) await ctx.addInitScript(s => Object.entries(s).forEach(([k, v]) => localStorage.setItem(k, v)), storage);
  const p = await ctx.newPage();
  const errors = [];
  p.on('pageerror', e => errors.push(String(e)));
  p.on('console', m => m.type() === 'error' && errors.push(m.text()));
  await p.goto(base + '/atlas/index.html?pack=cosmere' + hash);
  await p.waitForFunction(() => window.__atlas, null, { timeout: 30000 });
  return { ctx, p, errors };
}
const snap = p =>
  p.evaluate(async () => {
    const A = window.__atlas,
      out = {};
    const t = s => (document.querySelector(s) || {}).innerText || '';
    out.list = t('#dos');
    out.chron = t('#track');
    out.legend = t('#legend');
    out.realms = [...document.querySelectorAll('#realms button')].map(b => b.dataset.r + ':' + b.disabled).join(',');
    out.codex = [];
    for (const b of document.querySelectorAll('#cxTabs [data-tab]')) {
      b.click();
      out.codex.push(t('#cxBody') + '|' + t('#cxNote'));
    }
    out.worlds = {};
    for (const w of A.pack.worlds) {
      A.selectWorld(w.id, true);
      out.worlds[w.id] = t('#dos');
    }
    return out;
  });
let fails = 0,
  checked = 0;
const ok = (c, m) => {
  checked++;
  if (!c) {
    fails++;
    console.log('FAIL', m);
  }
};
// ---- family 1: legacy parity
if (baseEngine) {
  const B = readFileSync(baseEngine, 'utf8');
  for (let n = 0; n <= 12; n++) {
    const a = await page(B, '#book=' + n),
      b = await page(null, '#book=' + n);
    const sa = await snap(a.p),
      sb = await snap(b.p);
    for (const k of Object.keys(sa))
      ok(JSON.stringify(sa[k]) === JSON.stringify(sb[k]), `parity book=${n} surface=${k}`);
    ok(!b.errors.length, `errors book=${n}: ${b.errors.join(' | ')}`);
    console.log(`book=${n} parity surfaces=${Object.keys(sa).length} worlds=${Object.keys(sa.worlds).length}`);
    await a.ctx.close();
    await b.ctx.close();
  }
}
// ---- per-work smoke with the synthetic registry
const cases = [
  ['#read=fx-1', 'set {fx-1}'],
  ['#read=fx-2a', 'set {fx-2a}: key-2 bucket incomplete'],
  ['#read=fx-1,fx-2a,fx-2b,fx-2c', 'set key1+key2 complete'],
  ['#upto=pub:1:fx-3', 'preset through fx-3'],
  ['#read=fx-1&book=2', 'conflict -> safe'],
  ['#read=zz9', 'unknown id -> safe'],
  ['#book=2&book=3', 'repeated -> safe'],
  ['#upto=pub:9:fx-3', 'unknown version -> safe'],
];
const res = {};
for (const [h, label] of cases) {
  const { ctx, p, errors } = await page(null, h, { synthetic: true });
  const s = await p.evaluate(() => ({
    rd: JSON.stringify(window.__atlas.S.rd),
    book: window.__atlas.S.book,
    chronEvents: document.querySelectorAll('#track .ev').length,
    worlds: document.querySelectorAll('#dos .world').length,
    hash: location.hash,
    stored: Object.keys(localStorage)
      .filter(k => k.startsWith('atlas-read'))
      .map(k => k + '=' + localStorage.getItem(k))
      .join(';'),
  }));
  res[h] = s;
  ok(!errors.length, `errors ${h}: ${errors.join(' | ')}`);
  console.log(label.padEnd(40), JSON.stringify(s));
  await ctx.close();
}
const all = await page(null, '#book=0', { synthetic: true });
const allEv = await all.p.evaluate(() => document.querySelectorAll('#track .ev').length);
await all.ctx.close();
const one = await page(null, '#book=1', { synthetic: true });
const oneEv = await one.p.evaluate(() => document.querySelectorAll('#track .ev').length);
const oneSnap = await snap(one.p);
await one.ctx.close();
const two = await page(null, '#book=2', { synthetic: true });
const twoEv = await two.p.evaluate(() => document.querySelectorAll('#track .ev').length);
await two.ctx.close();
ok(res['#read=fx-1'].chronEvents === oneEv, 'set {fx-1} shows exactly legacy book 1 events');
ok(res['#read=fx-2a'].chronEvents === 0, 'set {fx-2a} alone shows nothing (no key-1, key-2 incomplete)');
ok(res['#read=fx-1,fx-2a,fx-2b,fx-2c'].chronEvents === twoEv, 'complete key1+key2 set equals legacy book 2');
ok(
  res['#upto=pub:1:fx-3'].chronEvents > twoEv && res['#upto=pub:1:fx-3'].chronEvents < allEv,
  'preset through fx-3 between book 2 and All',
);
for (const h of ['#read=fx-1&book=2', '#read=zz9', '#book=2&book=3', '#upto=pub:9:fx-3']) {
  ok(JSON.parse(res[h].rd).mode === 'safe', 'safe state for ' + h);
  ok(res[h].chronEvents === 0 && res[h].worlds === 0, 'safe state renders no gated events/worlds for ' + h);
  ok(res[h].stored === '', 'safe state writes no storage for ' + h);
  ok(
    decodeURIComponent(res[h].hash).includes(h.slice(1).split('&')[0]),
    'safe state keeps the rejected parameter for ' + h,
  );
}
ok(res['#read=fx-1'].stored === '', 'a link is not written to storage before an interaction (same as legacy #book)');
{
  const s1 = await page(null, '#read=fx-1', { synthetic: true });
  const snap1 = await snap(s1.p);
  // set {fx-1} = every work of bucket 1 read, so every surface must equal legacy book 1 except the reading-state wording
  const strip = v =>
    JSON.stringify(v).replace(
      /Custom selection: 1 read[^"|]*|Showing <b>[^<]*<\/b>[^"|]*|Reading through [^"|]*|[A-Z][^.|"]*?\. Only what those books reveal is shown\.|Showing [^.]*\. Worlds, events and fates from later books are hidden\./g,
      '',
    );
  // expected wording-only differences: lock line ("mark it read") and the per-book colour legend label (no book named)
  const lock = t => t.replace(/Hidden until you (mark it read|reach it)/g, 'LOCK');
  ok(lock(snap1.chron) === lock(oneSnap.chron), 'set {fx-1} equals legacy book 1 on chron (lock wording normalised)');
  ok(snap1.realms === oneSnap.realms, 'set {fx-1} equals legacy book 1 on realms');
  ok(
    snap1.legend.split('\n').length === oneSnap.legend.split('\n').length,
    'set {fx-1} legend has the same entries as legacy book 1',
  );
  let same = 0,
    tot = 0;
  for (const w of Object.keys(oneSnap.worlds)) {
    tot++;
    if (strip(snap1.worlds[w]) === strip(oneSnap.worlds[w])) same++;
    else console.log('world differs', w);
  }
  ok(same === tot, `set {fx-1} world dossiers equal legacy book 1 (${same}/${tot})`);
  await s1.p.evaluate(() => document.querySelector('#books [data-b="0"]').click());
  const after = await s1.p.evaluate(() => ({
    rd: window.__atlas.S.rd.mode,
    hash: location.hash,
    st: localStorage.getItem('atlas-read:v2:cosmere'),
  }));
  ok(
    after.rd === 'all' && !after.hash.includes('read=') && after.st === '{"mode":"all"}',
    'choosing All in the bar leaves the set mode, rewrites hash and stores v2: ' + JSON.stringify(after),
  );
  await s1.ctx.close();
}
// stored v2 restores without a URL parameter; invalid stored v2 -> safe
for (const [val, want] of [
  ['{"mode":"set","ids":["fx-1"]}', 'set'],
  ['{"mode":"set","ids":["nope"]}', 'safe'],
  ['not json', 'safe'],
]) {
  const { ctx, p } = await page(null, '', { synthetic: true, storage: { 'atlas-read:v2:cosmere': val } });
  const m = await p.evaluate(() => window.__atlas.S.rd.mode);
  ok(m === want, `stored ${val} -> ${want} (got ${m})`);
  await ctx.close();
}
console.log(`\n${checked - fails}/${checked} checks passed`);
await browser.close();
process.exit(fails ? 1 : 0);
