// R-A real-registry rendered probe (Playwright + software GL). Uses the REAL Cosmere pack registry
// (public/atlas/packs/cosmere.js spoilers.works/presets, from bibliography-handoff-2026-11-10.md) — no synthetic data.
// Checks per viewport (1440x900 desktop, 390x844 touch): panel counts (33 checkboxes, 12 bucket groups), year labels
// (held / catalogue-qualified), strict preset prefixes in the chronicle and world index, AU01 / White Sand
// independence, all-works = All, reload persistence, invalid preset links fail closed, e6/e12 ancestor restriction.
// Usage: node real-registry-probe.mjs <baseUrl> [shotDir]
import { chromium } from 'playwright';
const [base = 'http://127.0.0.1:4173', shotDir] = process.argv.slice(2);
const browser = await chromium.launch({
  executablePath: process.env.CHROME_PATH || undefined,
  args: ['--use-gl=swiftshader', '--enable-webgl', '--ignore-gpu-blocklist'],
});
let pass = 0,
  fail = 0;
const ok = (c, msg) => {
  if (c) pass++;
  else {
    fail++;
    console.log('FAIL', msg);
  }
};
const OT = ['mistborn-the-final-empire', 'mistborn-the-well-of-ascension', 'mistborn-the-hero-of-ages'];
const WS = ['white-sand-volume-1', 'white-sand-volume-2', 'white-sand-volume-3', 'white-sand-omnibus'];
const AU = 'arcanum-unbounded-system-essays-and-maps';
async function open(ctx, hash) {
  const p = await ctx.newPage();
  const errors = [];
  p.on('pageerror', e => errors.push(String(e)));
  p.on('console', m => m.type() === 'error' && errors.push(m.text()));
  await p.goto(base + '/atlas/index.html?pack=cosmere' + hash);
  await p.waitForFunction(() => !!window.__atlas, null, { timeout: 120000, polling: 250 });
  await p.waitForTimeout(500);
  return { p, errors };
}
const rd = p => p.evaluate(() => JSON.stringify(window.__atlas.S.rd));
const ticks = p => p.$$eval('#rdPanel input[type=checkbox]:checked', a => a.map(x => x.dataset.work));
const track = p => p.$eval('#track', e => e.textContent);
const index = p => p.evaluate(() => document.querySelector('#index') ? document.querySelector('#index').textContent : document.body.textContent);
const openPanel = async p => {
  if (await p.$eval('#rdPanel', e => e.hidden)) await p.click('#rdBtn');
};
for (const [name, vp, mobile] of [
  ['1440x900', { width: 1440, height: 900 }, false],
  ['390x844', { width: 390, height: 844 }, true],
]) {
  const ctx = await browser.newContext({ viewport: vp, hasTouch: mobile, isMobile: mobile });
  // 1. All (no hash): registry valid, Reading button, panel shape and year labels
  {
    const { p, errors } = await open(ctx, '');
    ok((await rd(p)) === '{"mode":"all"}', name + ' default All');
    ok(!!(await p.$('#rdBtn')), name + ' Reading button present (registry valid)');
    await openPanel(p);
    const n = await p.$$eval('#rdPanel input[type=checkbox]', a => a.length);
    ok(n === 33, name + ' 33 checkboxes, got ' + n);
    const g = await p.$$eval('#rdPanel .rd-group', a => a.length);
    ok(g === 12, name + ' 12 bucket groups, got ' + g);
    const sel = await p.$$eval('#rdPanel select[data-preset]', a => a.map(s => s.dataset.preset + ':' + (s.options.length - 1)));
    ok(
      JSON.stringify(sel) ===
        '["mistborn-original-trilogy:3","mistborn-wax-and-wayne:4","stormlight-with-novellas:7"]',
      name + ' 3 presets with 3/4/7 options ' + JSON.stringify(sel),
    );
    const txt = await p.$eval('#rdPanel', e => e.textContent);
    ok(txt.includes('The Hope of Elantris (publication year unverified)'), name + ' SEL02 year unverified');
    ok(txt.includes('White Sand omnibus — revisions and additions (publication year unverified)'), name + ' TA04 year unverified');
    ok(txt.includes('The Fires of December (2026, catalogue listing)'), name + ' FD01 catalogue listing');
    ok(txt.includes('Elantris (2005)'), name + ' Elantris 2005');
    const t = await track(p);
    ok(t.includes('Kelsier meets Vin') && t.includes('Sazed ascends') === false, name + ' All shows e6 title (e12 text not in track)');
    if (shotDir) await p.screenshot({ path: shotDir + '/real-registry-panel-' + name + '.png' });
    ok(errors.length === 0, name + ' no errors (All) ' + errors.join('|'));
    await p.close();
  }
  // 2. strict preset prefix: MB01 only → Scadrial and e6 hidden (unreviewed parents need MB01-03)
  {
    const { p, errors } = await open(ctx, '#upto=mistborn-original-trilogy:1:' + OT[0]);
    await openPanel(p);
    ok(JSON.stringify(await ticks(p)) === JSON.stringify([OT[0]]), name + ' MB01 prefix ticks 1');
    const t = await track(p);
    ok(!t.includes('Kelsier meets Vin'), name + ' e6 hidden with MB01 only (ancestor fallback)');
    ok(!(await index(p)).includes('Scadrial'), name + ' Scadrial hidden with MB01 only');
    ok(errors.length === 0, name + ' no errors (MB01) ' + errors.join('|'));
    await p.close();
  }
  {
    const { p, errors } = await open(ctx, '#upto=mistborn-original-trilogy:1:' + OT[2]);
    await openPanel(p);
    ok(JSON.stringify(await ticks(p)) === JSON.stringify(OT), name + ' MB03 prefix ticks MB01-03');
    ok(!(await ticks(p)).includes('mistborn-secret-history'), name + ' preset does not tick Secret History');
    const t = await track(p);
    ok(t.includes('Kelsier meets Vin') && t.includes('The Hero of Ages'), name + ' e6/e12 visible with MB01-03');
    ok(!t.includes('The survivor of Hathsin') === false, name + ' e7 (bucket 2 fallback) visible with MB01-03');
    ok((await index(p)).includes('Scadrial'), name + ' Scadrial visible with MB01-03');
    if (shotDir) await p.screenshot({ path: shotDir + '/real-registry-mb03-' + name + '.png' });
    ok(errors.length === 0, name + ' no errors (MB03) ' + errors.join('|'));
    // a deliberate choice is stored (a link alone does not overwrite stored state): pick MB03 in the select,
    // then reload without a hash and the stored preset state persists
    await p.selectOption('#rdPanel select[data-preset="mistborn-original-trilogy"]', OT[1]);
    await p.waitForTimeout(300);
    await openPanel(p);
    await p.selectOption('#rdPanel select[data-preset="mistborn-original-trilogy"]', OT[2]);
    await p.waitForTimeout(300);
    await p.goto(base + '/atlas/index.html?pack=cosmere');
    await p.waitForFunction(() => !!window.__atlas, null, { timeout: 120000, polling: 250 });
    ok(
      (await rd(p)) === JSON.stringify({ mode: 'preset', preset: 'mistborn-original-trilogy', v: 1, work: OT[2] }),
      name + ' reload restores stored preset ' + (await rd(p)),
    );
    await p.close();
  }
  // 3. AU01 and White Sand are independent
  {
    const { p, errors } = await open(ctx, '#read=' + AU);
    await openPanel(p);
    ok(JSON.stringify(await ticks(p)) === JSON.stringify([AU]), name + ' AU01 alone ticks only AU01');
    await p.click('#rdPanel input[data-work="white-sand-omnibus"]');
    ok(
      JSON.stringify(await ticks(p)) === JSON.stringify(['white-sand-omnibus', AU]),
      name + ' omnibus adds only itself ' + JSON.stringify(await ticks(p)),
    );
    ok(!(await p.evaluate(() => decodeURIComponent(location.hash))).includes('white-sand-volume'), name + ' no volume in link');
    ok(errors.length === 0, name + ' no errors (AU) ' + errors.join('|'));
    await p.close();
  }
  // 4. all 33 works = everything the All view shows (chronicle and index text)
  {
    const all = await open(ctx, '#book=0');
    const tAll = await track(all.p);
    const iAll = await index(all.p);
    await all.p.close();
    const ids = await (async () => {
      const { p } = await open(ctx, '');
      const r = await p.evaluate(() => window.__atlas.pack.spoilers.works.map(w => w.id));
      await p.close();
      return r;
    })();
    const { p, errors } = await open(ctx, '#read=' + ids.join(','));
    ok(ids.length === 33, name + ' 33 ids');
    ok((await track(p)) === tAll, name + ' all works: chronicle identical to All');
    ok((await index(p)) === iAll, name + ' all works: index identical to All');
    ok(errors.length === 0, name + ' no errors (all works) ' + errors.join('|'));
    await p.close();
  }
  // 5. invalid preset links fail closed (safe state, panel open, nothing stored)
  for (const bad of [
    '#upto=mistborn-original-trilogy:1:mistborn-secret-history',
    '#upto=mistborn-original-trilogy:2:' + OT[0],
    '#upto=stormlight-with-novellas:1:warbreaker',
    '#read=' + WS[0] + ',' + WS[0],
  ]) {
    const { p, errors } = await open(ctx, bad);
    const s = JSON.parse(await rd(p));
    ok(s.mode === 'safe', name + ' safe for ' + bad + ' got ' + s.mode);
    ok(!(await p.$eval('#rdPanel', e => e.hidden)), name + ' panel open for ' + bad);
    ok(errors.length === 0, name + ' no errors (' + bad + ') ' + errors.join('|'));
    await p.close();
  }
  await ctx.close();
}
await browser.close();
console.log(JSON.stringify({ pass, fail }));
process.exit(fail ? 1 : 0);
