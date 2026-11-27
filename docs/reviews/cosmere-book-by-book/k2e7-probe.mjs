// K2-E7-01 rendered probe (key2-e7-handoff-2026-11-17.md); adapted from k2e8-probe.mjs. Real Cosmere pack + engine, no fixtures;
// Playwright + software GL, 1440x900 and 390x844 (phone dossier sheet expanded with a real tap on the grab).
//  1. Allowed: full original trilogy (#read=OT), legacy #book=2, #book=10 and All (#book=0): Scadrial selected,
//     event e7 opened (window.__atlas.openEvent, no travel) — the open dossier item shows the title
//     "The survivor of Hathsin" and exactly the new text; the old wording is absent from the whole page.
//  2. Withheld: two-of-three trilogy subsets and later-era only (bucket 6 + TLM): Scadrial withheld, and neither the
//     e7 title nor the old or new text appears anywhere in the page (unchanged chain, no parent promotion).
//  3. The other key-2 texts (accepted e8, held e9–e11, mapped e6/e12) still render unchanged in All.
// Usage: node k2e7-probe.mjs <baseUrl> <packPath> [shotDir]
import { chromium } from 'playwright';
import fs from 'node:fs';
import vm from 'node:vm';
const [base = 'http://127.0.0.1:4173', packPath = 'public/atlas/packs/cosmere.js', shotDir] = process.argv.slice(2);
const cv = { window: {} };
vm.createContext(cv);
vm.runInContext(fs.readFileSync(packPath, 'utf8'), cv);
const PACK = cv.window.ATLAS_PACKS.cosmere;
const bucket = k => PACK.spoilers.works.filter(w => w.bucket === k).map(w => w.id);
const OT = ['mistborn-the-final-empire', 'mistborn-the-well-of-ascension', 'mistborn-the-hero-of-ages'];
const TITLE = 'The survivor of Hathsin';
const NEW = 'Kelsier is known as the Survivor of Hathsin; scars cover his hands and arms.';
const OLD = 'Kelsier’s past: he lived through the Pits when his wife did not, and came out with every Allomantic power.';
const OTHERS = {
  e6: 'In Luthadel, Kelsier meets Vin and recognizes her as Mistborn.',
  e8: 'The Lord Ruler is defeated and dies.',
  e9: 'Elend Venture tries to rule a free city while three armies camp outside the walls.',
  e10: 'Vin reaches the Well and gives up its power, freeing the thing that had been tricking her.',
  e11: 'Searching for the Lord Ruler’s storehouses, the crew lays siege to Fadrex as the world falls apart.',
  e12: 'Sazed ascends and remakes the world.',
};
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
  p.evaluate(() => ({
    sel: window.__atlas.S.sel,
    page: document.body.innerText + '\n' + document.body.textContent,
    item: document.querySelector('#dossier [data-ev="e7"]')?.innerText || '',
    ex: document.querySelector('#dossier [data-ev="e7"] .ex')?.textContent ?? null,
    items: Object.fromEntries(
      [...document.querySelectorAll('#dossier [data-ev]')].map(b => [b.dataset.ev, b.querySelector('.ex')?.textContent]),
    ),
  }));
for (const [name, vp, mobile] of [
  ['1440x900', { width: 1440, height: 900 }, false],
  ['390x844', { width: 390, height: 844 }, true],
]) {
  const ctx = await browser.newContext({ viewport: vp, hasTouch: mobile, isMobile: mobile });
  for (const [label, hash] of [
    ['OT', '#read=' + OT.join(',')],
    ['legacy book=2', '#book=2'],
    ['legacy book=10', '#book=10'],
    ['All', '#book=0'],
  ]) {
    const tag = `${name} ${label}`;
    const { p, errors } = await open(ctx, hash);
    await p.evaluate(() => window.__atlas.openEvent('e7'));
    await p.waitForTimeout(500);
    if (mobile && (await p.evaluate(() => document.querySelector('#dossier')?.classList.contains('collapsed'))))
      await p.click('#grab');
    await p.waitForTimeout(300);
    const s = await st(p);
    ok(s.sel === 'scadrial', `${tag}: Scadrial selected (${s.sel})`);
    ok(s.item.includes(TITLE), `${tag}: e7 item shows title`);
    ok(s.ex === NEW, `${tag}: e7 text = new wording (${s.ex})`);
    ok(!s.page.includes(OLD), `${tag}: old e7 wording absent from page`);
    if (label === 'All') {
      for (const [id, t] of Object.entries(OTHERS)) ok(s.items[id] === t, `${tag}: ${id} text unchanged`);
    }
    if (shotDir && (label === 'OT' || label === 'All')) {
      await p.locator('#dossier [data-ev="e7"]').scrollIntoViewIfNeeded();
      await p.waitForTimeout(300);
      await p.screenshot({ path: `${shotDir}/k2e7-${label.toLowerCase()}-${name}.png` });
    }
    ok(errors.length === 0, `${tag}: no errors ${errors.join('|')}`);
    await p.close();
  }
  for (const [label, ids] of [
    ['MB1+MB2', [OT[0], OT[1]]],
    ['MB1+MB3', [OT[0], OT[2]]],
    ['MB2+MB3', [OT[1], OT[2]]],
    ['later-era only', [...bucket(6), 'the-lost-metal']],
  ]) {
    const tag = `${name} ${label}`;
    const { p, errors } = await open(ctx, '#read=' + ids.join(','));
    await p.evaluate(() => window.__atlas.openEvent('e7'));
    await p.waitForTimeout(500);
    const s = await st(p);
    ok(s.sel !== 'scadrial', `${tag}: Scadrial withheld (sel=${s.sel})`);
    ok(!s.page.includes(TITLE) && !s.page.includes(NEW) && !s.page.includes(OLD), `${tag}: no e7 title/text anywhere`);
    if (shotDir && label === 'MB1+MB2') await p.screenshot({ path: `${shotDir}/k2e7-withheld-${name}.png` });
    ok(errors.length === 0, `${tag}: no errors ${errors.join('|')}`);
    await p.close();
  }
  await ctx.close();
}
await browser.close();
console.log(JSON.stringify({ pass, fail }));
process.exit(fail ? 1 : 0);
