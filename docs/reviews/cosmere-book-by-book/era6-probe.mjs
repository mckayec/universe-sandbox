// MB05 era-6 rendered probe (era6-handoff-2026-11-16.md). Real Cosmere pack + engine, no fixtures; Playwright +
// software GL. Per viewport (1440x900, 390x844 with the dossier sheet expanded):
//  - eligible OT + bucket 6 (Physical): candidate status chip, blurb and Era fact; Distance qualifier; model note;
//  - eligible OT + bucket 4 + bucket 6 with realm switching (Cognitive then Physical, selection kept): candidate copy
//    in both realms, held Cognitive card unchanged;
//  - partial: OT + The Alloy of Law only (bucket 6 incomplete): era-6 fields denied, base copy stays;
//  - legacy #book=6, #book=10 (era-10 status override kept with era-6 blurb/facts) and All (#book=0);
//  - every state: none of the old era-6 copy in the dossier, whole-parent "not yet sorted" note present in per-work
//    states (read by a real click on the Reading button; the parent remains unreviewed), 0 page/console errors.
// Navigation is programmatic (window.__atlas.selectWorld / setRealm); the phone sheet grab and the Reading button
// are real clicks.
// Usage: node era6-probe.mjs <baseUrl> <packPath> [shotDir]
import { chromium } from 'playwright';
import fs from 'node:fs';
import vm from 'node:vm';
const [base = 'http://127.0.0.1:4173', packPath = 'public/atlas/packs/cosmere.js', shotDir] = process.argv.slice(2);
const ctxv = { window: {} };
vm.createContext(ctxv);
vm.runInContext(fs.readFileSync(packPath, 'utf8'), ctxv);
const WORKS = ctxv.window.ATLAS_PACKS.cosmere.spoilers.works;
const bucket = k => WORKS.filter(w => w.bucket === k).map(w => w.id);
const OT = ['mistborn-the-final-empire', 'mistborn-the-well-of-ascension', 'mistborn-the-hero-of-ages'];
const B4 = bucket(4),
  B6 = bucket(6);
const ST6 = 'The Alloy of Law · industrial Elendel';
const BL6 =
  'In The Alloy of Law, Elendel has railways, canals, electric street lighting and steel-framed towers under construction. Horseless carriages share its streets with horse-drawn vehicles.';
const ERA6 = 'About 300 years after the original Mistborn trilogy';
const ST10 = 'Harmony’s world · under threat from outside';
const BASE_BL = 'In the Final Empire, ash falls beneath a red sun.';
const OLD = [
  'Harmony’s world · the Elendel Basin',
  'Sazed holds both Ruin and Preservation',
  'Seran, Faleast and Channerel',
  'near the south pole',
  'Industrial, about 300 years after Mistborn',
];
const MODEL = 'Artist’s model: this surface and the colour of its sun are illustrations';
const COG = 'Expanse of the Vapors';
const SCAD_DIST = 'Illustrative system layout; distances and orbital order are not verified here.';
const NOTE = 'Some details in this series are only grouped, not yet sorted by book.';
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
  if (c && process.env.VERBOSE) console.log('ok  ', msg);
};
async function open(ctx, hash) {
  const p = await ctx.newPage();
  const errors = [];
  p.on('pageerror', e => errors.push(String(e)));
  p.on('console', m => m.type() === 'error' && errors.push(m.text()));
  await p.goto(base + '/atlas/index.html?pack=cosmere' + hash);
  await p.waitForFunction(() => !!window.__atlas, null, { timeout: 120000, polling: 250 });
  await p.waitForTimeout(600);
  await p.evaluate(() => window.__atlas.selectWorld('scadrial'));
  await p.waitForTimeout(400);
  return { p, errors };
}
const st = p =>
  p.evaluate(() => {
    const dd = n => {
      const dt = [...document.querySelectorAll('#dossier dl.facts dt')].find(e => e.textContent === n);
      return dt && dt.nextElementSibling ? dt.nextElementSibling.textContent : null;
    };
    return {
      sel: window.__atlas.S.sel,
      realm: window.__atlas.S.realm,
      dossier: document.querySelector('#dossier')?.textContent || '',
      chips: [...document.querySelectorAll('#dossier .chips .chip')].map(e => e.textContent),
      facts: [...document.querySelectorAll('#dossier dl.facts dt')].map(e => e.textContent),
      era: dd('Era'),
      dist: dd('Distance'),
      model: document.querySelector('#dossier .srcnote.model')?.textContent || '',
      card: document.querySelector('#dossier .realmcard')?.textContent || '',
    };
  });
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
// real click on the Reading button (the panel renders on open), read the whole-parent note, close with Escape
const rdNote = async (p, tag) => {
  await p.click('#rdBtn');
  await p.waitForTimeout(300);
  const t = await p.evaluate(() => document.querySelector('#rdPanel .rd-note')?.textContent || '');
  await p.keyboard.press('Escape');
  await p.waitForTimeout(200);
  ok(t === NOTE, `${tag}: whole-parent "not yet sorted by book" note present in Reading panel (${t})`);
};
const none = (s, a) => a.every(x => !s.includes(x));
const common = (s, tag) => {
  ok(s.sel === 'scadrial', `${tag}: selected`);
  ok(s.dist === SCAD_DIST, `${tag}: Distance qualifier kept (${s.dist})`);
  ok(s.model.startsWith(MODEL), `${tag}: model note kept`);
  ok(none(s.dossier, OLD), `${tag}: no old era-6 copy in dossier`);
};
const cand = (s, tag, status) => {
  ok(s.chips.includes(status), `${tag}: status chip "${status}" (${s.chips.join('|')})`);
  ok(s.dossier.includes(BL6), `${tag}: candidate blurb`);
  ok(s.era === ERA6, `${tag}: Era fact (${s.era})`);
  ok(s.facts.join('|') === 'Star|Era|Distance', `${tag}: facts Star|Era|Distance (${s.facts.join('|')})`);
};
for (const [name, vp, mobile] of [
  ['1440x900', { width: 1440, height: 900 }, false],
  ['390x844', { width: 390, height: 844 }, true],
]) {
  const ctx = await browser.newContext({ viewport: vp, hasTouch: mobile, isMobile: mobile });
  {
    const tag = `${name} OT+B6 physical`;
    const { p, errors } = await open(ctx, '#read=' + [...OT, ...B6].join(','));
    const s = await st(p);
    common(s, tag);
    cand(s, tag, ST6);
    if (shotDir) await crop(p, `${shotDir}/era6-dossier-physical-${name}.png`, mobile);
    await rdNote(p, tag);
    ok(errors.length === 0, `${tag}: no errors ${errors.join('|')}`);
    await p.close();
  }
  {
    const tag = `${name} OT+B4+B6 realm switch`;
    const { p, errors } = await open(ctx, '#read=' + [...OT, ...B4, ...B6].join(','));
    await p.evaluate(() => window.__atlas.setRealm('cognitive'));
    await p.waitForTimeout(500);
    let s = await st(p);
    ok(s.realm === 'cognitive', `${tag}: Cognitive (${s.realm})`);
    common(s, tag + ' cognitive');
    cand(s, tag + ' cognitive', ST6);
    ok(s.card.includes(COG), `${tag}: held Cognitive card unchanged`);
    if (shotDir) await crop(p, `${shotDir}/era6-dossier-cognitive-${name}.png`, mobile);
    await p.evaluate(() => window.__atlas.setRealm('physical'));
    await p.waitForTimeout(500);
    s = await st(p);
    ok(s.realm === 'physical', `${tag}: back to Physical`);
    common(s, tag + ' physical');
    cand(s, tag + ' physical', ST6);
    await rdNote(p, tag);
    ok(errors.length === 0, `${tag}: no errors ${errors.join('|')}`);
    await p.close();
  }
  {
    const tag = `${name} OT+AoL only (partial)`;
    const { p, errors } = await open(ctx, '#read=' + [...OT, 'the-alloy-of-law'].join(','));
    const s = await st(p);
    common(s, tag);
    ok(s.chips.includes('The Final Empire') && !s.chips.includes(ST6), `${tag}: base status (${s.chips.join('|')})`);
    ok(!s.dossier.includes(BL6) && s.dossier.includes(BASE_BL), `${tag}: base blurb, candidate denied`);
    ok(s.era === null && s.facts.join('|') === 'Star|Ruler|Distance', `${tag}: base facts (${s.facts.join('|')})`);
    if (shotDir) await crop(p, `${shotDir}/era6-dossier-partial-${name}.png`, mobile);
    await rdNote(p, tag);
    ok(errors.length === 0, `${tag}: no errors ${errors.join('|')}`);
    await p.close();
  }
  for (const [label, hash, chip] of [
    ['legacy book=6', '#book=6', ST6],
    ['legacy book=10', '#book=10', ST10],
    ['All', '#book=0', 'The Final Empire → ' + ST10],
  ]) {
    const tag = `${name} ${label}`;
    const { p, errors } = await open(ctx, hash);
    const s = await st(p);
    common(s, tag);
    cand(s, tag, chip);
    if (shotDir && label === 'legacy book=10') await crop(p, `${shotDir}/era6-dossier-legacy10-${name}.png`, mobile);
    ok(errors.length === 0, `${tag}: no errors ${errors.join('|')}`);
    await p.close();
  }
  await ctx.close();
}
await browser.close();
console.log(JSON.stringify({ pass, fail }));
process.exit(fail ? 1 : 0);
