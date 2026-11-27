// SCR-01 (Scadrial distText qualifier) rendered probe, extending the reduced-parent probe: every selected state also
// asserts the dossier Distance row is exactly the Scadrial qualifier with no system-chart order attribution, in both
// realms, galaxy and surface; and saves readable desktop + expanded-phone dossier crops.
// Based on: Scadrial reduced-parent rendered probe (Playwright + software GL), for the finite disposition of 2026-11-16.
// Real Cosmere pack, real engine, no fixtures. Per viewport (1440x900, 390x844):
//  - none selected + the seven incomplete original-trilogy subsets: Scadrial not selectable, galaxy label falls back
//    to the neutral placeholder, no removed claim anywhere on the page;
//  - all three original-trilogy works: reduced status chip, only the ruler fact, the artist's-model note in the galaxy
//    dossier and on the surface; desktop tooltip without removed claims;
//  - later-era-only (bucket 6 works without the trilogy): parent and Elendel-era children stay hidden;
//  - trilogy + bucket 6: era-6 status/facts reduced;
//  - realm switching with retained selection (trilogy + bucket 4 so the Cognitive realm is open): selection kept,
//    removed claims absent in both realms, the held Cognitive card unchanged;
//  - legacy #book=2/6/10 and All (#book=0): reduced payloads, numeric rules unchanged.
// Usage: node scadrial-reduced-probe.mjs <baseUrl> <packPath> [shotDir]
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
const REMOVED = [
  'First planet',
  '1st from the sun',
  'no moon',
  'Preservation and Ruin',
  'Harmony (Ruin and Preservation)',
  'Allomancy, Feruchemy, Hemalurgy',
];
const MODEL = 'Artist’s model: this surface and the colour of its sun are illustrations';
const ERA6S = 'Harmony’s world · the Elendel Basin';
const ERA10S = 'Harmony’s world · under threat from outside';
const ERAF = 'Industrial, about 300 years after Mistborn';
const COG = 'Expanse of the Vapors';
const SCAD_DIST = 'Illustrative system layout; distances and orbital order are not verified here.';
const CHART_ATTR = 'planet order from the system chart';
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
  return { p, errors };
}
const st = p =>
  p.evaluate(() => ({
    sel: window.__atlas.S.sel,
    view: window.__atlas.S.view,
    realm: window.__atlas.S.realm,
    dossier: document.querySelector('#dossier')?.textContent || '',
    chips: [...document.querySelectorAll('#dossier .chips .chip')].map(e => e.textContent),
    facts: [...document.querySelectorAll('#dossier dl.facts dt')].map(e => e.textContent),
    model: document.querySelector('#dossier .srcnote.model')?.textContent || '',
    card: document.querySelector('#dossier .realmcard')?.textContent || '',
    dist: (() => {
      const dt = [...document.querySelectorAll('#dossier dl.facts dt')].find(e => e.textContent === 'Distance');
      return dt && dt.nextElementSibling ? dt.nextElementSibling.textContent : null;
    })(),
    body: document.body.innerText,
    label: document.querySelector('#labels button[data-id="scadrial"]')?.textContent ?? null,
  }));
const tip = p =>
  p.evaluate(() => {
    const b = document.querySelector('#labels button[data-id="scadrial"]');
    if (!b) return '';
    b.dispatchEvent(new MouseEvent('mouseenter', { clientX: 200, clientY: 200 }));
    return document.querySelector('#tip')?.textContent || '';
  });
const distOk = (s, tag) => {
  ok(s.dist === SCAD_DIST, `${tag}: Distance row is the Scadrial qualifier (${s.dist})`);
  ok(!s.dossier.includes(CHART_ATTR), `${tag}: no system-chart order attribution in Scadrial dossier`);
};
const crop = async (p, file, mobile) => {
  if (mobile) {
    const collapsed = await p.evaluate(() => document.querySelector('#dossier')?.classList.contains('collapsed'));
    if (collapsed) await p.click('#grab');
    await p.waitForTimeout(400);
  }
  await p.evaluate(() => {
    const dt = [...document.querySelectorAll('#dossier dl.facts dt')].find(e => e.textContent === 'Distance');
    dt && dt.scrollIntoView({ block: 'center' });
  });
  await p.waitForTimeout(300);
  await p.locator('#dossier').screenshot({ path: file });
};
const none = (s, a) => a.every(x => !s.includes(x));
const select = async p => {
  await p.evaluate(() => window.__atlas.selectWorld('scadrial'));
  await p.waitForTimeout(400);
};
const tagOf = ids => (ids.length ? ids.map(x => 'MB0' + (OT.indexOf(x) + 1)).join('+') : 'none');
for (const [name, vp, mobile] of [
  ['1440x900', { width: 1440, height: 900 }, false],
  ['390x844', { width: 390, height: 844 }, true],
]) {
  const ctx = await browser.newContext({ viewport: vp, hasTouch: mobile, isMobile: mobile });
  // 1. none + incomplete original-trilogy subsets
  for (let m = 0; m < 7; m++) {
    const ids = OT.filter((_, i) => m & (1 << i));
    const tag = `${name} ${tagOf(ids)}`;
    const { p, errors } = await open(ctx, ids.length ? '#read=' + ids.join(',') : '#read=_none');
    await select(p);
    const s = await st(p);
    ok(s.sel !== 'scadrial', `${tag}: Scadrial not selectable`);
    ok(s.label === null || s.label === 'An unrevealed world', `${tag}: label placeholder (${s.label})`);
    ok(none(s.body + s.dossier, REMOVED), `${tag}: no removed claim on page`);
    ok(!s.body.includes(MODEL) && !s.body.includes(COG), `${tag}: no model note / subastral name`);
    await p.evaluate(() => window.__atlas.selectSite('luthadel'));
    await p.waitForTimeout(200);
    ok((await st(p)).sel !== 'scadrial', `${tag}: child site cannot open the held parent`);
    ok(errors.length === 0, `${tag}: no errors ${errors.join('|')}`);
    await p.close();
  }
  // 2. full original trilogy: reduced copy, galaxy + surface
  {
    const tag = `${name} OT set`;
    const { p, errors } = await open(ctx, '#read=' + OT.join(','));
    await select(p);
    let s = await st(p);
    ok(s.sel === 'scadrial', `${tag}: selected`);
    ok(s.chips.includes('The Final Empire'), `${tag}: status chip reduced (${s.chips.join('|')})`);
    ok(s.facts.join('|') === 'Star|Ruler|Distance', `${tag}: facts = Star, Ruler, Distance (${s.facts.join('|')})`);
    ok(s.dossier.includes('The Lord Ruler'), `${tag}: ruler fact`);
    distOk(s, tag);
    ok(s.model.startsWith(MODEL), `${tag}: model note in dossier`);
    ok(none(s.dossier, REMOVED), `${tag}: no removed claim in dossier`);
    if (!mobile) ok(none(await tip(p), REMOVED), `${tag}: tooltip clean`);
    if (shotDir) await crop(p, `${shotDir}/scr01-dossier-galaxy-${name}.png`, mobile);
    await p.evaluate(() => window.__atlas.descend('scadrial'));
    await p.waitForTimeout(2500);
    s = await st(p);
    ok(s.view === 'world' && s.sel === 'scadrial', `${tag}: surface open`);
    ok(s.model.startsWith(MODEL) && none(s.dossier, REMOVED), `${tag}: surface dossier reduced + model note`);
    distOk(s, tag + ' surface');
    if (shotDir) await crop(p, `${shotDir}/scr01-dossier-surface-${name}.png`, mobile);
    ok(errors.length === 0, `${tag}: no errors ${errors.join('|')}`);
    await p.close();
  }
  // 3. later-era-only
  {
    const tag = `${name} bucket-6 only`;
    const { p, errors } = await open(ctx, '#read=' + B6.join(','));
    await select(p);
    const s = await st(p);
    ok(s.sel !== 'scadrial', `${tag}: Scadrial not selectable`);
    ok(none(s.body, [...REMOVED, ERA6S, ERAF, MODEL]), `${tag}: no parent/era payload on page`);
    ok(errors.length === 0, `${tag}: no errors ${errors.join('|')}`);
    await p.close();
  }
  // 4. trilogy + bucket 6
  {
    const tag = `${name} OT+bucket6`;
    const { p, errors } = await open(ctx, '#read=' + [...OT, ...B6].join(','));
    await select(p);
    const s = await st(p);
    ok(s.chips.includes(ERA6S), `${tag}: era-6 status reduced (${s.chips.join('|')})`);
    ok(s.facts.join('|') === 'Star|Era|Distance', `${tag}: era-6 facts reduced (${s.facts.join('|')})`);
    distOk(s, tag);
    ok(none(s.dossier, REMOVED) && s.model.startsWith(MODEL), `${tag}: no removed claim; model note`);
    ok(errors.length === 0, `${tag}: no errors ${errors.join('|')}`);
    await p.close();
  }
  // 5. realm switching with retained selection
  {
    const tag = `${name} realm switch`;
    const { p, errors } = await open(ctx, '#read=' + [...OT, ...B4].join(','));
    await select(p);
    await p.evaluate(() => window.__atlas.setRealm('cognitive'));
    await p.waitForTimeout(500);
    let s = await st(p);
    ok(s.realm === 'cognitive' && s.sel === 'scadrial', `${tag}: Cognitive, selection kept (${s.realm}/${s.sel})`);
    ok(none(s.dossier, REMOVED) && s.model.startsWith(MODEL), `${tag}: Cognitive dossier reduced + model note`);
    ok(s.card.includes(COG), `${tag}: held Cognitive card unchanged (absent gate inherits)`);
    distOk(s, tag + ' cognitive');
    if (shotDir) await crop(p, `${shotDir}/scr01-dossier-cognitive-${name}.png`, mobile);
    await p.evaluate(() => window.__atlas.setRealm('physical'));
    await p.waitForTimeout(500);
    s = await st(p);
    ok(s.realm === 'physical' && s.sel === 'scadrial', `${tag}: back to Physical, selection kept`);
    ok(none(s.dossier, REMOVED) && s.chips.includes('The Final Empire'), `${tag}: Physical dossier reduced`);
    distOk(s, tag + ' physical');
    ok(errors.length === 0, `${tag}: no errors ${errors.join('|')}`);
    await p.close();
  }
  // 6. legacy and All
  for (const [label, hash, chip, facts] of [
    ['legacy book=2', '#book=2', 'The Final Empire', 'Star|Ruler|Distance'],
    ['legacy book=6', '#book=6', ERA6S, 'Star|Era|Distance'],
    ['legacy book=10', '#book=10', ERA10S, 'Star|Era|Distance'],
    ['All', '#book=0', 'The Final Empire → ' + ERA10S, 'Star|Era|Distance'],
  ]) {
    const tag = `${name} ${label}`;
    const { p, errors } = await open(ctx, hash);
    await select(p);
    const s = await st(p);
    ok(s.sel === 'scadrial', `${tag}: selected`);
    ok(s.chips.includes(chip), `${tag}: status "${chip}" (${s.chips.join('|')})`);
    ok(s.facts.join('|') === facts, `${tag}: facts ${facts} (${s.facts.join('|')})`);
    distOk(s, tag);
    ok(none(s.dossier, REMOVED) && s.model.startsWith(MODEL), `${tag}: no removed claim; model note`);
    ok(errors.length === 0, `${tag}: no errors ${errors.join('|')}`);
    await p.close();
  }
  await ctx.close();
}
await browser.close();
console.log(JSON.stringify({ pass, fail }));
process.exit(fail ? 1 : 0);
