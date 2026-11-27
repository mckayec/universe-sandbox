// MB06-E27-01 rendered probe (mb06-e27-handoff-2026-11-19.md); adapted from sel03e30-probe.mjs. Real Cosmere pack +
// engine, no fixtures; Playwright + software GL, 1440x900 and 390x844 (phone dossier sheet expanded with a real tap).
//  1. Allowed: sufficient per-work set (bucket 2 original trilogy + every bucket-6 work), legacy #book=6, #book=10 and
//     All (#book=0): Scadrial selected, e27 opened (window.__atlas.openEvent, no travel) — the open dossier item shows
//     the title and exactly the new text; the old wording is absent from the whole page. In All, every other Scadrial
//     event text is unchanged.
//  2. Withheld: MB06 only, bucket 6 without the trilogy, trilogy + MB06 only, trilogy only, legacy #book=5: no e27
//     dossier item and neither the old nor new text anywhere in the page. (The title equals the work title, which the
//     reading picker lists, so it is not used as a withheld marker.)
// Usage: node mb06e27-probe.mjs <baseUrl> <packPath> [shotDir]
import { chromium } from 'playwright';
import fs from 'node:fs';
import vm from 'node:vm';
const [base = 'http://127.0.0.1:4173', packPath = 'public/atlas/packs/cosmere.js', shotDir] = process.argv.slice(2);
const cv = { window: {} };
vm.createContext(cv);
vm.runInContext(fs.readFileSync(packPath, 'utf8'), cv);
const PACK = cv.window.ATLAS_PACKS.cosmere;
const bucket = k => PACK.spoilers.works.filter(w => w.bucket === k).map(w => w.id);
const SOS = 'shadows-of-self';
const TITLE = 'Shadows of Self';
const NEW = 'Wax investigates murders in Elendel as labor unrest grows.';
const OLD = 'A rogue kandra murders her way through the city’s elite, and Harmony’s quiet influence comes into the open.';
const OTHERS = Object.fromEntries(PACK.events.filter(e => e.world === 'scadrial' && e.id !== 'e27').map(e => [e.id, e.text]));
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
    has: !!document.querySelector('#dossier [data-ev="e27"]'),
    item: document.querySelector('#dossier [data-ev="e27"]')?.innerText || '',
    ex: document.querySelector('#dossier [data-ev="e27"] .ex')?.textContent ?? null,
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
    ['sufficient', '#read=' + [...bucket(2), ...bucket(6)].join(',')],
    ['legacy book=6', '#book=6'],
    ['legacy book=10', '#book=10'],
    ['All', '#book=0'],
  ]) {
    const tag = `${name} ${label}`;
    const { p, errors } = await open(ctx, hash);
    await p.evaluate(() => window.__atlas.openEvent('e27'));
    await p.waitForTimeout(500);
    if (mobile && (await p.evaluate(() => document.querySelector('#dossier')?.classList.contains('collapsed'))))
      await p.click('#grab');
    await p.waitForTimeout(300);
    const s = await st(p);
    ok(s.sel === 'scadrial', `${tag}: Scadrial selected (${s.sel})`);
    ok(s.item.includes(TITLE), `${tag}: e27 item shows title`);
    ok(s.ex === NEW, `${tag}: e27 text = new wording (${s.ex})`);
    ok(!s.page.includes(OLD), `${tag}: old e27 wording absent from page`);
    if (label === 'All') {
      for (const [id, t] of Object.entries(OTHERS)) ok(s.items[id] === t, `${tag}: ${id} text unchanged`);
    }
    if (shotDir && (label === 'sufficient' || label === 'All')) {
      await p.locator('#dossier [data-ev="e27"]').scrollIntoViewIfNeeded();
      await p.waitForTimeout(300);
      await p.screenshot({ path: `${shotDir}/mb06e27-${label.toLowerCase()}-${name}.png` });
    }
    ok(errors.length === 0, `${tag}: no errors ${errors.join('|')}`);
    await p.close();
  }
  for (const [label, hash] of [
    ['MB06 only', '#read=' + SOS],
    ['bucket 6 only', '#read=' + bucket(6).join(',')],
    ['trilogy + MB06', '#read=' + [...bucket(2), SOS].join(',')],
    ['trilogy only', '#read=' + bucket(2).join(',')],
    ['legacy book=5', '#book=5'],
  ]) {
    const tag = `${name} ${label}`;
    const { p, errors } = await open(ctx, hash);
    await p.evaluate(() => window.__atlas.openEvent('e27'));
    await p.waitForTimeout(500);
    const s = await st(p);
    ok(!s.has, `${tag}: no e27 dossier item (sel=${s.sel})`);
    ok(!s.page.includes(NEW) && !s.page.includes(OLD), `${tag}: no e27 text anywhere`);
    if (shotDir && label === 'MB06 only') await p.screenshot({ path: `${shotDir}/mb06e27-withheld-${name}.png` });
    ok(errors.length === 0, `${tag}: no errors ${errors.join('|')}`);
    await p.close();
  }
  await ctx.close();
}
await browser.close();
console.log(JSON.stringify({ pass, fail }));
process.exit(fail ? 1 : 0);
