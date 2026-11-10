// COS-BB-001 checkpoint 4 probe (rendered, Playwright + software GL): field-level gates (design §1/§2a) on
// rendered fields and the intro copy, plus negative-control text at 1440x900 and 390x844.
// Uses the real Cosmere pack plus an IN-MEMORY SYNTHETIC registry and SYNTHETIC field gates (fixture IDs fx-*,
// not research, never written to the pack). Only the galaxy view is used (no planet bake).
// Usage: node reading-fields-probe.mjs <baseUrl> [shotDir]
import { chromium } from 'playwright';
const [base = 'http://127.0.0.1:5173', shotDir] = process.argv.slice(2);
const browser = await chromium.launch({
  executablePath: process.env.CHROME_PATH || undefined,
  args: ['--use-gl=swiftshader', '--enable-webgl', '--ignore-gpu-blocklist'],
});
const REG = `var P=window.ATLAS_PACKS.cosmere;var w=[];for(var k=1;k<=12;k++){if(k===2){w.push({id:'fx-2a',title:'Fixture 2a',bucket:2},{id:'fx-2b',title:'Fixture 2b',bucket:2},{id:'fx-2c',title:'Fixture 2c',bucket:2});}else w.push({id:'fx-'+k,title:'Fixture '+k,bucket:k});}
P.spoilers=Object.assign({},P.spoilers,{works:w,presets:[{id:'pub',label:'Fixture order',versions:[{v:1,seq:w.map(function(x){return x.id;})}]}]});`;
// Synthetic field gates: Sel name needs fx-3, Sel blurb has an INVALID gate (empty clause), Sel era 7 has its own
// gate fx-5 (replaces the bucket-7 fallback); Mashe name names an unknown work (invalid); Adonalsium desc needs
// fx-2a and its more[0] line needs fx-3 (instead of bucket 7).
const FG = `var W=function(id){return P.worlds.find(function(x){return x.id===id;});};
W('sel').gates={name:{req:'fx-3'},blurb:{req:[[]]}};W('sel').eras[7].gate={req:'fx-5'};
W('mashe').gates={name:{req:'zz-unknown'}};W('sel').gates.star={req:'fx-4'};
var A=P.codex[0].list.find(function(x){return x.name==='Adonalsium';});A.gates={desc:{req:'fx-2a'},more:[{req:'fx-3'}]};`;
const PUBINTRO = `P.intro=Object.assign({},P.intro,{gates:{text:{public:true},legend:{req:'fx-4'}}});`;
let pass = 0,
  fail = 0;
const ok = (c, msg) => {
  if (c) pass++;
  else {
    fail++;
    console.log('FAIL', msg);
  }
};
async function open(hash, { fields = true, pubIntro = false, vp = { width: 1440, height: 900 }, mobile = false } = {}) {
  const ctx = await browser.newContext({ viewport: vp, hasTouch: mobile, isMobile: mobile });
  const inj = ';(function(){' + REG + (fields ? FG : '') + (pubIntro ? PUBINTRO : '') + '})();';
  await ctx.route('**/atlas/packs/cosmere.js', async r => {
    const res = await r.fetch();
    r.fulfill({ response: res, body: (await res.text()) + inj });
  });
  const p = await ctx.newPage();
  const errors = [];
  p.on('pageerror', e => errors.push(String(e)));
  p.on('console', m => m.type() === 'error' && errors.push(m.text()));
  await p.goto(base + '/atlas/index.html?pack=cosmere' + hash);
  await p.waitForFunction(() => !!window.__atlas, null, { timeout: 120000, polling: 250 });
  await p.waitForTimeout(400);
  return { ctx, p, errors };
}
const txt = (p, sel) => p.$eval(sel, e => e.innerText);
const label = (p, id) => p.$eval('#labels .lbl[data-id="' + id + '"]', e => e.textContent);
const select = async (p, id) => {
  await p.evaluate(id => window.__atlas.selectWorld(id, false), id);
  await p.waitForTimeout(300);
};
const codex = async p => {
  await p.evaluate(() => document.querySelector('#cxBtn').click());
  await p.waitForTimeout(200);
  return txt(p, '#cxBody');
};
const ADON_DESC = 'The single power behind creation';
const ADON_MORE = 'destroyed on Yolen';

// 1. legacy parity: the same synthetic field gates change nothing in legacy and All modes
for (const h of ['#book=1', '']) {
  const { ctx, p, errors } = await open(h);
  ok((await label(p, 'sel')) === 'Sel', 'legacy/All Sel label (' + h + ')');
  ok((await label(p, 'mashe')) === 'Mashe', 'legacy/All Mashe label (' + h + ')');
  ok((await txt(p, '#dossier')).includes('Adonalsium was shattered'), 'legacy/All intro text shown (' + h + ')');
  ok((await txt(p, '#dossier')).includes('Threnody, Taldain, Roshar'), 'legacy/All intro legend shown (' + h + ')');
  ok(/go to roshar/i.test(await txt(p, '#dossier')), 'legacy/All Go to Roshar shown (' + h + ')');
  await select(p, 'sel');
  const d = await txt(p, '#dossier');
  ok(d.includes('Once the city of Elantris'), 'legacy/All Sel blurb shown (' + h + ')');
  const cx = await codex(p);
  ok(cx.includes(ADON_DESC), 'legacy/All Adonalsium desc (' + h + ')');
  ok(errors.length === 0, 'no errors (legacy ' + h + ') ' + errors.join('|'));
  await ctx.close();
}
// 2. per-work, fx-1 only
{
  const { ctx, p, errors } = await open('#read=fx-1');
  ok((await label(p, 'sel')) === 'An unrevealed world', 'Sel label placeholder (name needs fx-3)');
  ok((await label(p, 'mashe')) === 'An unrevealed world', 'Mashe label placeholder (invalid name gate)');
  const idx = await txt(p, '#index');
  ok(!/\bSel\b/.test(idx) && !idx.includes('Mashe') && idx.includes('An unrevealed world'), 'index shows placeholders only');
  ok(!(await txt(p, '#dossier')).includes('Adonalsium'), 'intro copy hidden without intro.gates.text');
  await select(p, 'sel');
  const d = await txt(p, '#dossier');
  ok(!/\bSel\b/.test(d) && d.includes('An unrevealed world'), 'dossier heading placeholder');
  ok(!d.includes('Once the city of Elantris'), 'Sel blurb hidden (invalid field gate)');
  ok(d.includes('Seol'), 'absent aka gate inherits the record (aka shown)');
  ok(!/Star\s+Mashe/.test(d), 'star field hidden (needs fx-4)');
  ok(!d.includes('Fjordell Empire'), 'era 7 facts hidden at fx-1');
  ok(!/\bSel\b/.test(await txt(p, '#crumbs')), 'crumbs placeholder');
  const cx = await codex(p);
  ok(cx.includes('Adonalsium'), 'codex name inherits (shown)');
  ok(!cx.includes(ADON_DESC), 'codex desc hidden (needs fx-2a)');
  ok(!cx.includes(ADON_MORE), 'codex more[0] hidden (needs fx-3)');
  ok(errors.length === 0, 'no errors (fx-1) ' + errors.join('|'));
  await ctx.close();
}
// 3. widening: field gates open exactly at their own works; invalid gates never open
{
  const { ctx, p, errors } = await open('#read=fx-1,fx-3');
  ok((await label(p, 'sel')) === 'Sel', 'Sel name shown with fx-3');
  ok((await label(p, 'mashe')) === 'An unrevealed world', 'Mashe stays placeholder (invalid)');
  await select(p, 'sel');
  const d = await txt(p, '#dossier');
  ok(!d.includes('Once the city of Elantris'), 'invalid blurb gate still hides with fx-3');
  const cx = await codex(p);
  ok(cx.includes(ADON_MORE), 'more[0] own gate fx-3 replaces the bucket-7 fallback');
  ok(!cx.includes(ADON_DESC), 'desc still hidden without fx-2a');
  ok(errors.length === 0, 'no errors (fx-1,fx-3) ' + errors.join('|'));
  await ctx.close();
}
for (const [h, want] of [
  ['#read=fx-1,fx-5', true],
  ['#read=fx-1,fx-7', false],
  ['#read=fx-5', false],
]) {
  const { ctx, p } = await open(h);
  await select(p, 'sel');
  const d = await txt(p, '#dossier').catch(() => '');
  const sel = await p.evaluate(() => window.__atlas.S.sel);
  ok(d.includes('Fjordell Empire') === want && (sel === 'sel') === h.includes('fx-1'), 'era 7 own gate ' + h + ' → ' + want + ' (sel ' + sel + ')');
  await ctx.close();
}
{
  const { ctx, p } = await open('#read=fx-1,fx-2a');
  const cx = await codex(p);
  ok(cx.includes(ADON_DESC), 'desc shown with fx-2a');
  await ctx.close();
}
// 4. explicit public intro marker
{
  const { ctx, p, errors } = await open('#read=fx-1', { pubIntro: true });
  ok((await txt(p, '#dossier')).includes('Adonalsium was shattered'), 'intro shown with intro.gates.text public');
  ok(!/roshar/i.test(await txt(p, '#dossier')), 'intro legend and Go to Roshar hidden at fx-1');
  ok(errors.length === 0, 'no errors (public intro) ' + errors.join('|'));
  await ctx.close();
}
// 5. negative-control text at 1440x900 and 390x844 (no synthetic field gates): with only part of bucket 2 read,
//    nothing grouped in bucket 2 (Harmony/Sazed revelations) or later appears in the visible text
for (const [vp, mobile, tag] of [
  [{ width: 1440, height: 900 }, false, '1440'],
  [{ width: 390, height: 844 }, true, '390'],
]) {
  for (const h of ['#read=fx-1', '#read=fx-1,fx-2a']) {
    const { ctx, p, errors } = await open(h, { fields: false, vp, mobile });
    const body = await p.evaluate(() => document.body.innerText);
    const cx = await codex(p);
    ok(!/Harmony/i.test(body + cx), 'no Harmony text ' + tag + ' ' + h);
    ok(!/Adonalsium was shattered/.test(body), 'no ungated intro ' + tag + ' ' + h);
    ok(!/Roshar|Scadrial|Nalthis|Taldain|Threnody/i.test(body + cx), 'no later world names ' + tag + ' ' + h);
    if (shotDir && h === '#read=fx-1,fx-2a') {
      await p.evaluate(() => document.querySelector('#cxClose').click());
      await p.waitForTimeout(300);
      await p.screenshot({ path: shotDir + '/reading-negative-' + tag + '.jpg', type: 'jpeg', quality: 70 });
    }
    ok(errors.length === 0, 'no errors (neg ' + tag + ' ' + h + ') ' + errors.join('|'));
    await ctx.close();
  }
}
await browser.close();
console.log('reading-fields probe: ' + pass + '/' + (pass + fail) + ' passed');
process.exit(fail ? 1 : 0);
