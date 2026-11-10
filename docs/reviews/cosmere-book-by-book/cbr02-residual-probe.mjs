// COS-BB-001 CBR-02 residual rendered probe (after implementation-review-6d36f0c.md): base world graphics and group
// names obey their field/record gates in the running atlas. Real Cosmere pack + IN-MEMORY SYNTHETIC registry and
// gates (fixture IDs fx-*, never written to the pack), same injection as cbr-fix-probe.mjs.
//  gfx: scadrial's base gfx carries harmless marker keys (cbrMarker, sw). The rendered surface's cache key
//       (PL.key = world id + JSON of the exact gfx object handed to the surface builder) must contain the marker
//       only when the gfx field gate passes, and otherwise the neutral fallback (type "barren"); the world-list
//       swatch must not use the protected colour. This distinguishes the protected resource from its fallback.
//  group: the Scadrian group's base name / era name are replaced by markers with name / record gates; DOM text
//       (document.body.textContent, including collapsed sheets and labels) must contain them only when allowed.
// Lighter test-only surface: window.__HD=256 (existing engine hook), as in cbr-fix-probe.mjs.
// Usage: node cbr02-residual-probe.mjs <baseUrl> [1440x900|390x844|all]   (CHROME_PATH optional)
import { chromium } from 'playwright';
const [base = 'http://127.0.0.1:4173', onlyVp = 'all'] = process.argv.slice(2);
const browser = await chromium.launch({
  executablePath: process.env.CHROME_PATH || undefined,
  args: ['--use-gl=swiftshader', '--enable-webgl', '--ignore-gpu-blocklist'],
});
const REG = `var P=window.ATLAS_PACKS.cosmere;var w=[];for(var k=1;k<=12;k++)w.push({id:'fx-'+k,title:'Fixture '+k,bucket:k});
P.spoilers=Object.assign({},P.spoilers,{works:w,presets:[{id:'pub',label:'Fixture order',versions:[{v:1,seq:w.map(function(x){return x.id;})}]}]});
var W=function(id){return P.worlds.find(function(x){return x.id===id;});};
var G=function(id){return P.groups.find(function(x){return x.id===id;});};
W('scadrial').gate={req:'fx-1'};`;
const results = [];
const ok = (c, msg, value) => {
  results.push({ pass: !!c, case: msg, value });
  console.log(JSON.stringify({ pass: !!c, case: msg, value }));
};
async function open(hash, { extra = '', vp, mobile }) {
  const ctx = await browser.newContext({ viewport: vp, hasTouch: mobile, isMobile: mobile, deviceScaleFactor: 1 });
  await ctx.addInitScript(() => {
    window.__HD = 256;
  });
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

const GFX = `W('scadrial').gfx.cbrMarker='CBR2-SECRET-GFX';W('scadrial').gfx.sw='#ab12cd';`;
const gfxCases = [
  ['gfx field needs fx-2, only fx-1 read', `W('scadrial').gates={gfx:{req:'fx-2'}};`, '#read=fx-1', false],
  ['invalid gfx field gate, all fixtures read', `W('scadrial').gates={gfx:{req:'zz9'}};`, '#upto=pub:1:fx-12', false],
  ['control: gfx field met (fx-1,fx-2)', `W('scadrial').gates={gfx:{req:'fx-2'}};`, '#read=fx-1,fx-2', true],
  ['control: public gfx field', `W('scadrial').gates={gfx:{public:true}};`, '#read=fx-1', true],
  ['control: absent gfx field gate inherits the visible world', '', '#read=fx-1', true],
];
const GRP = `var g=G('scadrian');g.name='CBR2-SECRET-GROUP';`;
const groupCases = [
  ['base name gate needs fx-2, only fx-1', `g.gates={name:{req:'fx-2'}};`, '#read=fx-1', 'CBR2-SECRET-GROUP', false],
  ['invalid base name gate, all read', `g.gates={name:{req:'zz9'}};`, '#upto=pub:1:fx-12', 'CBR2-SECRET-GROUP', false],
  ['control: base name gate met', `g.gates={name:{req:'fx-2'}};`, '#read=fx-1,fx-2', 'CBR2-SECRET-GROUP', true],
  ['control: ungated group name', '', '#read=fx-1', 'CBR2-SECRET-GROUP', true],
  [
    'era record gate fx-2 unmet while bucket 1 read',
    `g.eras={1:{name:'CBR2-SECRET-GROUPERA',gate:{req:'fx-2'}}};`,
    '#read=fx-1',
    'CBR2-SECRET-GROUPERA',
    false,
  ],
  [
    'invalid era record gate, all read',
    `g.eras={1:{name:'CBR2-SECRET-GROUPERA',gate:{req:'zz9'}}};`,
    '#upto=pub:1:fx-12',
    'CBR2-SECRET-GROUPERA',
    false,
  ],
  [
    'control: era record gate met',
    `g.eras={1:{name:'CBR2-SECRET-GROUPERA',gate:{req:'fx-2'}}};`,
    '#read=fx-1,fx-2',
    'CBR2-SECRET-GROUPERA',
    true,
  ],
];

for (const [vpName, vp, mobile] of [
  ['1440x900', { width: 1440, height: 900 }, false],
  ['390x844', { width: 390, height: 844 }, true],
]) {
  if (onlyVp !== 'all' && onlyVp !== vpName) continue;
  for (const [label, extra, hash, shown] of gfxCases) {
    const { p, ctx, errors } = await open(hash, { extra: GFX + extra, vp, mobile });
    const sw = await p.evaluate(() =>
      Array.from(document.querySelectorAll('.world[data-id="scadrial"] .sw')).map(e => e.getAttribute('style')),
    );
    await p.evaluate(() => window.__atlas.descend('scadrial'));
    await p.waitForFunction(() => !!window.__atlas.PL, null, { timeout: 60000, polling: 250 }).catch(() => {});
    await p.waitForTimeout(600);
    const key = await p.evaluate(() => (window.__atlas.PL ? window.__atlas.PL.key : null));
    ok(key !== null, `gfx ${vpName} ${label}: surface built`, key && key.slice(0, 80));
    const has = !!key && key.includes('CBR2-SECRET-GFX');
    ok(has === shown, `gfx ${vpName} ${label}: surface gfx ${shown ? 'is the protected base' : 'is not the protected base'}`);
    if (!shown) ok(!!key && key.includes('"type":"barren"'), `gfx ${vpName} ${label}: neutral fallback surface`);
    ok(
      sw.length > 0 && sw.every(s => s.includes('#ab12cd') === shown),
      `gfx ${vpName} ${label}: list swatch ${shown ? 'uses' : 'does not use'} the protected colour`,
      sw,
    );
    ok(!errors.length, `gfx ${vpName} ${label}: no page errors`, errors);
    if (vpName === '390x844' && label.startsWith('gfx field needs'))
      await p.screenshot({ path: 'shots/cbr02-gfx-hidden-390x844.jpg', quality: 60 }).catch(() => {});
    await ctx.close();
  }
  for (const [label, extra, hash, marker, shown] of groupCases) {
    const { p, ctx, errors } = await open(hash, { extra: GRP + extra, vp, mobile });
    await p.evaluate(() => window.__atlas.selectWorld('scadrial', false));
    await p.waitForTimeout(500);
    const text = await p.evaluate(() => document.body.textContent);
    ok(text.includes(marker) === shown, `group ${vpName} ${label}: ${marker} ${shown ? 'shown' : 'absent from DOM'}`);
    if (!shown && marker === 'CBR2-SECRET-GROUPERA')
      ok(text.includes('CBR2-SECRET-GROUP'), `group ${vpName} ${label}: earlier visible base name stays`);
    if (!shown && marker === 'CBR2-SECRET-GROUP')
      ok(text.includes('Unrevealed group'), `group ${vpName} ${label}: neutral group label in the list`);
    ok(!errors.length, `group ${vpName} ${label}: no page errors`, errors);
    await ctx.close();
  }
}
await browser.close();
const pass = results.filter(r => r.pass).length;
results.filter(r => !r.pass).forEach(r => console.log('FAIL', r.case));
console.log(JSON.stringify({ pass, total: results.length }));
process.exit(pass === results.length ? 0 : 1);
