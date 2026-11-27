// SH-D1–03 rendered probe (secret-history-omission-handoff-2026-11-17.md). Real Cosmere pack + engine, no fixtures;
// Playwright + software GL. Per viewport (1440x900, 390x844 with the dossier sheet expanded):
//  1. OT + The Way of Kings (bucket 4 = the Cognitive opening threshold): Cognitive selected, Scadrial dossier shows the
//     global realm title with the neutral fallback, no old name/blurb/fallback; descend to Scadrial (if the software-GL
//     surface finishes) and read the planet realm uniforms = generic global look; back to Physical: accepted parent copy.
//  2. The same + Secret History, legacy #book=4/#book=10 and All (#book=0): omission stays, no restoration.
//  3. Incomplete trilogy + WoK and later-era only (bucket 6 + TLM): Scadrial withheld; narrowing an open OT+WoK selection
//     by a real untick of The Hero of Ages in the Reading panel clears the selected world.
//  4. Galaxy labels in Cognitive (All): no "Expanse of the Vapors" label element; the other six subastral labels exist.
// Navigation is programmatic (window.__atlas.selectWorld / setRealm / descend); the phone sheet grab, the Reading
// button and the checklist untick are real clicks; the panel closes with a real Escape key press.
// Usage: node sh-omission-probe.mjs <baseUrl> <packPath> [shotDir]
import { chromium } from 'playwright';
import fs from 'node:fs';
import vm from 'node:vm';
const [base = 'http://127.0.0.1:4173', packPath = 'public/atlas/packs/cosmere.js', shotDir] = process.argv.slice(2);
const ctxv = { window: {} };
vm.createContext(ctxv);
vm.runInContext(fs.readFileSync(packPath, 'utf8'), ctxv);
const PACK = ctxv.window.ATLAS_PACKS.cosmere;
const WORKS = PACK.spoilers.works;
const bucket = k => WORKS.filter(w => w.bucket === k).map(w => w.id);
const OT = ['mistborn-the-final-empire', 'mistborn-the-well-of-ascension', 'mistborn-the-hero-of-ages'];
const B4 = bucket(4),
  B6 = bucket(6);
const SH = 'mistborn-secret-history';
const TLM = 'the-lost-metal';
const NEUTRAL =
  'No world-specific description is provided in this view. The appearance is an illustration, not a verified map.';
const OLD = [
  'Expanse of the Vapors',
  'Scadrial’s subastral is a world of mist.',
  'The books have not described this world’s subastral.',
];
const GTITLE = 'The Cognitive Realm';
const GLOOK = { c1: '#1e1a2c', c2: '#5a5088', c3: '#0e0c14' };
const BASE_BL = 'In the Final Empire, ash falls beneath a red sun.';
const ST10 = 'The Lost Metal · Elendel and the Outer Cities in tension';
const OTHER_SA = PACK.realms.cognitive.subastrals.filter(s => s.world !== 'scadrial').map(s => s.name);
const browser = await chromium.launch({
  executablePath: process.env.CHROME_PATH || undefined,
  args: ['--use-gl=swiftshader', '--enable-webgl', '--ignore-gpu-blocklist'],
});
let pass = 0,
  fail = 0;
const notRun = [];
const ok = (c, msg) => {
  if (c) pass++;
  else {
    fail++;
    console.log('FAIL', msg);
  }
  if (c && process.env.VERBOSE) console.log('ok  ', msg);
};
async function open(ctx, hash, select = true) {
  const p = await ctx.newPage();
  const errors = [];
  p.on('pageerror', e => errors.push(String(e)));
  p.on('console', m => m.type() === 'error' && errors.push(m.text()));
  await p.goto(base + '/atlas/index.html?pack=cosmere' + hash);
  await p.waitForFunction(() => !!window.__atlas, null, { timeout: 120000, polling: 250 });
  await p.waitForTimeout(600);
  if (select) {
    await p.evaluate(() => window.__atlas.selectWorld('scadrial'));
    await p.waitForTimeout(400);
  }
  return { p, errors };
}
const st = p =>
  p.evaluate(() => ({
    sel: window.__atlas.S.sel,
    realm: window.__atlas.S.realm,
    view: window.__atlas.S.view,
    dossier: document.querySelector('#dossier')?.textContent || '',
    chips: [...document.querySelectorAll('#dossier .chips .chip')].map(e => e.textContent),
    card: document.querySelector('#dossier .realmcard')?.innerHTML || '',
    cogOpen: !document.querySelector('#realms [data-r="cognitive"]')?.disabled,
  }));
const crop = async (p, file, mobile) => {
  if (mobile) {
    const collapsed = await p.evaluate(() => document.querySelector('#dossier')?.classList.contains('collapsed'));
    if (collapsed) await p.click('#grab');
    await p.waitForTimeout(400);
  }
  await p.evaluate(() => document.querySelector('#dossier')?.scrollTo(0, 0));
  await p.waitForTimeout(300);
  await p.locator('#dossier').screenshot({ path: file });
};
const none = (s, a) => a.every(x => !s.includes(x));
const neutralCard = (s, tag) => {
  ok(s.sel === 'scadrial' && s.realm === 'cognitive', `${tag}: Scadrial selected in Cognitive (${s.sel}/${s.realm})`);
  ok(
    s.card === `<p class="eyebrow">${GTITLE}</p><p>${NEUTRAL}</p>`,
    `${tag}: realm card = global title + neutral fallback (${s.card.slice(0, 90)})`,
  );
  ok(none(s.dossier, OLD), `${tag}: no old Cognitive name/blurb/fallback in dossier`);
};
const physical = (s, tag) => {
  ok(s.realm === 'physical' && s.card === '', `${tag}: Physical, no realm card`);
  ok(s.dossier.includes(BASE_BL), `${tag}: accepted MB01 blurb`);
  ok(none(s.dossier, OLD), `${tag}: no old Cognitive copy`);
};
const labels = p =>
  p.evaluate(() =>
    [...document.querySelectorAll('.lbl.region')].map(e => ({
      t: e.textContent,
      vis: getComputedStyle(e).display !== 'none' && getComputedStyle(e).visibility !== 'hidden' && +getComputedStyle(e).opacity > 0,
    })),
  );
for (const [name, vp, mobile] of [
  ['1440x900', { width: 1440, height: 900 }, false],
  ['390x844', { width: 390, height: 844 }, true],
]) {
  const ctx = await browser.newContext({ viewport: vp, hasTouch: mobile, isMobile: mobile });
  {
    const tag = `${name} OT+WoK`;
    const { p, errors } = await open(ctx, '#read=' + [...OT, ...B4].join(','));
    let s = await st(p);
    ok(s.cogOpen, `${tag}: Cognitive button enabled`);
    await p.evaluate(() => window.__atlas.setRealm('cognitive'));
    await p.waitForTimeout(500);
    s = await st(p);
    neutralCard(s, tag + ' galaxy');
    if (shotDir) await crop(p, `${shotDir}/sh-cognitive-${name}.png`, mobile);
    // descend in Cognitive: the planet material should carry the generic global look
    await p.evaluate(() => window.__atlas.descend('scadrial'));
    const got = await p
      .waitForFunction(() => window.__atlas.PL && window.__atlas.PL.w && window.__atlas.PL.w.id === 'scadrial', null, {
        timeout: 240000,
        polling: 500,
      })
      .then(() => true)
      .catch(() => false);
    if (got) {
      await p.waitForTimeout(800);
      const u = await p.evaluate(() => {
        const U = window.__atlas.PL.mat.uniforms;
        const hex = v => '#' + v.clone().convertLinearToSRGB().getHexString(); // CL() stores linear
        return { realm: U.uRealm.value, style: U.uRStyle.value, c1: hex(U.uRC1.value), c2: hex(U.uRC2.value), c3: hex(U.uRC3.value) };
      });
      ok(u.realm === 1 && u.style === 4, `${tag}: surface uniforms Cognitive + generic "unsea" style (${JSON.stringify(u)})`);
      ok(u.c1 === GLOOK.c1 && u.c2 === GLOOK.c2 && u.c3 === GLOOK.c3, `${tag}: surface colours = global look`);
      s = await st(p);
      neutralCard(s, tag + ' surface');
      if (shotDir) await p.screenshot({ path: `${shotDir}/sh-surface-${name}.png` });
    } else notRun.push(`${tag}: descend did not finish within 240 s under software GL`);
    await p.evaluate(() => window.__atlas.setRealm('physical'));
    await p.waitForTimeout(600);
    s = await st(p);
    physical(s, tag);
    ok(errors.length === 0, `${tag}: no errors ${errors.join('|')}`);
    await p.close();
  }
  for (const [label, hash] of [
    ['OT+WoK+SH', '#read=' + [...OT, ...B4, SH].join(',')],
    ['legacy book=4', '#book=4'],
    ['legacy book=10', '#book=10'],
    ['All', '#book=0'],
  ]) {
    const tag = `${name} ${label}`;
    const { p, errors } = await open(ctx, hash);
    await p.evaluate(() => window.__atlas.setRealm('cognitive'));
    await p.waitForTimeout(500);
    const s = await st(p);
    neutralCard(s, tag);
    if (shotDir && label === 'All') await crop(p, `${shotDir}/sh-all-${name}.png`, mobile);
    if (label === 'All') {
      const L = await labels(p);
      const T = L.map(x => x.t);
      ok(!T.includes('Expanse of the Vapors'), `${tag}: no Scadrial subastral label element`);
      ok(
        OTHER_SA.every(n => T.includes(n)),
        `${tag}: other ${OTHER_SA.length} subastral labels exist (${OTHER_SA.filter(n => !T.includes(n)).join('|')})`,
      );
      if (shotDir) await p.screenshot({ path: `${shotDir}/sh-galaxy-cognitive-${name}.png` });
    }
    ok(errors.length === 0, `${tag}: no errors ${errors.join('|')}`);
    await p.close();
  }
  for (const [label, ids] of [
    ['incomplete OT+WoK', [OT[0], OT[1], ...B4]],
    ['later-era only', [...B6, TLM]],
  ]) {
    const tag = `${name} ${label}`;
    const { p, errors } = await open(ctx, '#read=' + ids.join(','));
    const s = await st(p);
    ok(s.sel !== 'scadrial' && !s.dossier.includes('Scadrial'), `${tag}: Scadrial withheld (sel=${s.sel})`);
    ok(none(s.dossier, OLD) && !s.dossier.includes(NEUTRAL), `${tag}: no Cognitive copy`);
    ok(errors.length === 0, `${tag}: no errors ${errors.join('|')}`);
    await p.close();
  }
  {
    const tag = `${name} narrow OT+WoK → untick Hero of Ages`;
    const { p, errors } = await open(ctx, '#read=' + [...OT, ...B4].join(','));
    await p.evaluate(() => window.__atlas.setRealm('cognitive'));
    await p.waitForTimeout(500);
    neutralCard(await st(p), tag + ' before');
    await p.click('#rdBtn');
    await p.waitForTimeout(300);
    await p.locator('#rdPanel input[data-work="mistborn-the-hero-of-ages"]').click();
    await p.waitForTimeout(600);
    await p.keyboard.press('Escape');
    await p.waitForTimeout(400);
    const s = await st(p);
    ok(s.sel !== 'scadrial' && !s.dossier.includes('Scadrial'), `${tag}: selection cleared (sel=${s.sel})`);
    ok(none(s.dossier, OLD) && !s.dossier.includes(ST10), `${tag}: no Cognitive or later copy`);
    ok(errors.length === 0, `${tag}: no errors ${errors.join('|')}`);
    await p.close();
  }
  await ctx.close();
}
await browser.close();
for (const n of notRun) console.log('NOT RUN', n);
console.log(JSON.stringify({ pass, fail, notRun: notRun.length }));
process.exit(fail ? 1 : 0);
