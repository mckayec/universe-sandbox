// COS-BB-001 CBR-01..03 rendered regression probe (Playwright + software GL), for the fixes after
// implementation-review-1e588f0.md. Real Cosmere pack + IN-MEMORY SYNTHETIC registry and gates (fixture IDs fx-*,
// never written to the pack). Cases:
//  CBR-01 last untick from URL / stored set / preset via the actual Reading panel → reload, Back/Forward, share;
//  CBR-02 era blurb override gates (absent, invalid, public, needs, parent-hidden) in the rendered dossier;
//  CBR-03 a pending descent (fade transition) while the reading state narrows / another world is selected /
//         unchanged control, read from the actual engine state and bake bar (lightweight: no bake is awaited).
// Usage: node cbr-fix-probe.mjs <baseUrl>   (CHROME_PATH optional)
import { chromium } from 'playwright';
const [base = 'http://127.0.0.1:4173/universe-sandbox'] = process.argv.slice(2);
const browser = await chromium.launch({
  executablePath: process.env.CHROME_PATH || undefined,
  args: ['--use-gl=swiftshader', '--enable-webgl', '--ignore-gpu-blocklist'],
});
const REG = `var P=window.ATLAS_PACKS.cosmere;var w=[];for(var k=1;k<=12;k++)w.push({id:'fx-'+k,title:'Fixture '+k,bucket:k});
P.spoilers=Object.assign({},P.spoilers,{works:w,presets:[{id:'pub',label:'Fixture order',versions:[{v:1,seq:w.map(function(x){return x.id;})}]}]});
var W=function(id){return P.worlds.find(function(x){return x.id===id;});};`;
const results = [];
const ok = (c, msg) => results.push({ pass: !!c, case: msg });
async function open(hash, { extra = '', vp = { width: 1440, height: 900 }, mobile = false, ctx = null } = {}) {
  ctx =
    ctx ||
    (await browser.newContext({ viewport: vp, hasTouch: mobile, isMobile: mobile, deviceScaleFactor: 1 }));
  const inj = ';(function(){' + REG + extra + '})();';
  await ctx.route('**/atlas/packs/cosmere.js', async r => {
    const res = await r.fetch();
    r.fulfill({ response: res, body: (await res.text()) + inj });
  });
  const p = await ctx.newPage();
  const errors = [];
  p.on('pageerror', e => errors.push(String(e)));
  p.on('console', m => m.type() === 'error' && !/WebGL|GPU stall/i.test(m.text()) && errors.push(m.text()));
  await p.goto(base + '/atlas/index.html?pack=cosmere' + hash);
  await p.waitForFunction(() => !!window.__atlas, null, { timeout: 120000, polling: 250 });
  await p.waitForTimeout(400);
  return { ctx, p, errors };
}
const hashOf = p => p.evaluate(() => location.hash);
const rd = p => p.evaluate(() => JSON.stringify(window.__atlas.S.rd));
async function untickAll(p) {
  // every start below has exactly one work selected, so one click on the actual checklist is the last untick
  await p.evaluate(() => {
    if (document.querySelector('#rdPanel').hidden) document.querySelector('#rdBtn').click();
  });
  await p.waitForTimeout(200);
  await p.evaluate(() => {
    const c = Array.from(document.querySelectorAll('#rdPanel input[data-work]')).filter(x => x.checked);
    if (c.length !== 1) throw new Error('expected exactly one ticked work, got ' + c.length);
    c[0].click();
  });
}

for (const [vpName, vp, mobile] of [
  ['1440x900', { width: 1440, height: 900 }, false],
  ['390x844', { width: 390, height: 844 }, true],
]) {
  /* ---------- CBR-01 ---------- */
  for (const [start, hash, pre] of [
    ['url', '#read=fx-1', null],
    ['stored set', '', JSON.stringify({ mode: 'set', ids: ['fx-1'] })],
    ['preset', '#upto=pub:1:fx-1', null],
  ]) {
    const ctx = await browser.newContext({ viewport: vp, hasTouch: mobile, isMobile: mobile });
    if (pre) await ctx.addInitScript(v => localStorage.setItem('atlas-read:v2:cosmere', v), pre);
    const { p, errors } = await open(hash, { ctx, extra: `W('scadrial').gate={req:'fx-1'};` });
    ok(JSON.parse(await rd(p)).mode !== 'safe', `CBR-01 ${vpName} ${start}: starts in a valid per-work state`);
    await p.evaluate(() => window.__atlas.descend('scadrial'));
    await p.waitForTimeout(1500);
    await untickAll(p);
    await p.waitForTimeout(1200);
    const st = JSON.parse(await rd(p));
    ok(st.mode === 'none', `CBR-01 ${vpName} ${start}: last untick → none (${st.mode})`);
    const h = await hashOf(p);
    ok(/read=_none/.test(h) && !/fx-1/.test(h), `CBR-01 ${vpName} ${start}: URL ${h}`);
    const stored = await p.evaluate(() => localStorage.getItem('atlas-read:v2:cosmere'));
    ok(stored === '{"mode":"none"}', `CBR-01 ${vpName} ${start}: stored ${stored}`);
    // Back / Forward never restores the unticked work. Unticking hid the world, so the engine already went Back
    // from the surface entry (which still carried read=fx-1); Forward re-enters that entry, then Back again.
    await p.goForward().catch(() => {});
    await p.waitForTimeout(1200);
    const fh = await hashOf(p);
    ok(JSON.parse(await rd(p)).mode === 'none' && !/fx-1/.test(fh), `CBR-01 ${vpName} ${start}: Forward to the old surface entry keeps none (${fh})`);
    await p.goBack().catch(() => {});
    await p.waitForTimeout(1200);
    const bh = await hashOf(p);
    ok(JSON.parse(await rd(p)).mode === 'none' && !/fx-1/.test(bh), `CBR-01 ${vpName} ${start}: Back keeps none (${bh})`);
    // reload
    await p.reload();
    await p.waitForFunction(() => !!window.__atlas, null, { timeout: 120000 });
    ok(JSON.parse(await rd(p)).mode === 'none', `CBR-01 ${vpName} ${start}: reload → none`);
    // share: the current URL in a fresh context (no storage)
    const shared = await p.evaluate(() => location.hash);
    const s2 = await open(shared, { vp, mobile });
    ok(JSON.parse(await rd(s2.p)).mode === 'none', `CBR-01 ${vpName} ${start}: shared link ${shared} → none`);
    ok(!errors.length && !s2.errors.length, `CBR-01 ${vpName} ${start}: no page errors ${errors.concat(s2.errors).join(' | ')}`);
    await s2.ctx.close();
    await ctx.close();
  }
  // negative controls preserved
  for (const bad of ['#read=', '#read=zz9', '#read=_none,fx-1', '#read=_none&book=1']) {
    const { p, ctx } = await open(bad, { vp, mobile });
    const st = JSON.parse(await rd(p));
    const stored = await p.evaluate(() => localStorage.getItem('atlas-read:v2:cosmere'));
    ok(st.mode === 'safe' && stored === null, `CBR-01 ${vpName} negative ${bad}: safe, nothing stored`);
    await ctx.close();
  }

  /* ---------- CBR-02 ---------- */
  const SEL = `W('sel').gate={req:'fx-1'};var E=W('sel').eras[7];E.gate={req:'fx-1'};E.blurb='CBR2-SECRET-ERA';`;
  const eraCases = [
    ['absent era field gate, era readable', '', '#read=fx-1', true],
    ['era field needs fx-2, only fx-1', `E.gates={blurb:{req:'fx-2'}};`, '#read=fx-1', false],
    ['era field needs fx-2, fx-2 read', `E.gates={blurb:{req:'fx-2'}};`, '#read=fx-1,fx-2', true],
    ['invalid era field gate, all fixtures read', `E.gates={blurb:{req:'zz9'}};`, '#upto=pub:1:fx-12', false],
    ['public era field, era readable', `E.gates={blurb:{public:true}};`, '#read=fx-1', true],
    ['needs fx-3 unmet', `E.gates={blurb:{req:'fx-1',needs:'fx-3'}};`, '#read=fx-1', false],
    ['world field hidden, public era field', `W('sel').gates={blurb:{req:'fx-2'}};E.gates={blurb:{public:true}};`, '#read=fx-1', false],
    ['era record hidden, public era field', `E.gate={req:'fx-2'};E.gates={blurb:{public:true}};`, '#read=fx-1', false],
  ];
  for (const [label, extra, hash, shown] of eraCases) {
    const { p, ctx, errors } = await open(hash, { extra: SEL + extra, vp, mobile });
    await p.evaluate(() => window.__atlas.selectWorld('sel', false));
    await p.waitForTimeout(400);
    const d = await p.$eval('#dossier', e => e.innerText).catch(() => '');
    const tip = await p.evaluate(() => document.body.innerText);
    ok(d.includes('CBR2-SECRET-ERA') === shown && (shown || !tip.includes('CBR2-SECRET-ERA')), `CBR-02 ${vpName} ${label}: ${shown ? 'shown' : 'hidden'}`);
    ok(!errors.length, `CBR-02 ${vpName} ${label}: no page errors ${errors.join(' | ')}`);
    await ctx.close();
  }

  /* ---------- CBR-03 ---------- */
  const DESC = `W('scadrial').gate={req:'fx-1'};W('nalthis').gate={req:'fx-1'};`;
  const pend = [
    ['unchanged control', '', 'world', 'scadrial'],
    ['narrowed while pending', 'untick', 'galaxy', null],
    ['invalid-link safe state analogue: hidden by panel All→none', 'none', 'galaxy', null],
    ['another world selected while pending', 'other', 'galaxy', 'nalthis'],
  ];
  for (const [label, act, wantView, wantSel] of pend) {
    const { p, ctx, errors } = await open('#read=fx-1', { extra: DESC, vp, mobile });
    await p.evaluate(act => {
      const A = window.__atlas;
      A.descend('scadrial');
      if (act === 'untick' || act === 'none') {
        if (document.querySelector('#rdPanel').hidden) document.querySelector('#rdBtn').click();
        const c = Array.from(document.querySelectorAll('#rdPanel input[data-work]')).find(
          x => x.checked,
        );
        if (c) c.click();
      } else if (act === 'other') A.selectWorld('nalthis', false);
    }, act);
    await p.waitForTimeout(2500);
    const s = await p.evaluate(() => ({ view: window.__atlas.S.view, sel: window.__atlas.S.sel, pl: !!window.__atlas.PL, bake: document.querySelector('#bake').hidden }));
    ok(
      s.view === wantView && s.sel === wantSel && (wantView === 'world' ? s.pl : !s.pl) && (wantView === 'world' || s.bake),
      `CBR-03 ${vpName} ${label}: ${JSON.stringify(s)}`,
    );
    ok(!errors.length, `CBR-03 ${vpName} ${label}: no page errors ${errors.join(' | ')}`);
    await ctx.close();
  }
}
await browser.close();
const pass = results.filter(r => r.pass).length;
results.filter(r => !r.pass).forEach(r => console.log('FAIL', r.case));
console.log(JSON.stringify({ pass, total: results.length }));
process.exit(pass === results.length ? 0 : 1);
