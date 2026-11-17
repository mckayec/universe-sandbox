// SEL03-E30-01 rendered probe (sel03-e30-handoff-2026-11-17.md); adapted from k2e11-probe.mjs. Real Cosmere pack +
// engine, no fixtures; Playwright + software GL, 1440x900 and 390x844 (phone dossier sheet expanded with a real tap).
//  1. Allowed: sufficient per-work set (bucket 1 + every bucket-7 work), legacy #book=7, #book=10 and All (#book=0):
//     Sel selected, e30 opened (window.__atlas.openEvent, no travel) — the open dossier item shows the title and exactly
//     the new text; the old wording is absent from the whole page. In All, Sel's e1–e5 texts are unchanged.
//  2. Withheld: TES only, bucket 7 without bucket 1, bucket 1 + TES only, other work only (MB1), legacy #book=6:
//     no e30 dossier item and neither the old nor new text anywhere in the page. (The title equals the work title,
//     which the reading picker lists, so it is not used as a withheld marker.)
// Usage: node sel03e30-probe.mjs <baseUrl> <packPath> [shotDir]
import { chromium } from 'playwright';
import fs from 'node:fs';
import vm from 'node:vm';
const [base = 'http://127.0.0.1:4173', packPath = 'public/atlas/packs/cosmere.js', shotDir] = process.argv.slice(2);
const cv = { window: {} };
vm.createContext(cv);
vm.runInContext(fs.readFileSync(packPath, 'utf8'), cv);
const PACK = cv.window.ATLAS_PACKS.cosmere;
const bucket = k => PACK.spoilers.works.filter(w => w.bucket === k).map(w => w.id);
const TES = 'the-emperors-soul';
const TITLE = 'The Emperor’s Soul';
const NEW =
  'A condemned Forger, Shai, has ninety-eight days to recreate Emperor Ashravan’s soul; his body has been healed, but his mind remains blank.';
const OLD = 'A condemned Forger is given a hundred days to rebuild the soul of a dying emperor.';
const OTHERS = Object.fromEntries(PACK.events.filter(e => e.world === 'sel' && e.id !== 'e30').map(e => [e.id, e.text]));
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
  await p.evaluate(() => window.__atlas.selectWorld('sel'));
  await p.waitForTimeout(400);
  return { p, errors };
}
const st = p =>
  p.evaluate(() => ({
    sel: window.__atlas.S.sel,
    page: document.body.innerText + '\n' + document.body.textContent,
    has: !!document.querySelector('#dossier [data-ev="e30"]'),
    item: document.querySelector('#dossier [data-ev="e30"]')?.innerText || '',
    ex: document.querySelector('#dossier [data-ev="e30"] .ex')?.textContent ?? null,
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
    ['sufficient', '#read=' + [...bucket(1), ...bucket(7)].join(',')],
    ['legacy book=7', '#book=7'],
    ['legacy book=10', '#book=10'],
    ['All', '#book=0'],
  ]) {
    const tag = `${name} ${label}`;
    const { p, errors } = await open(ctx, hash);
    await p.evaluate(() => window.__atlas.openEvent('e30'));
    await p.waitForTimeout(500);
    if (mobile && (await p.evaluate(() => document.querySelector('#dossier')?.classList.contains('collapsed'))))
      await p.click('#grab');
    await p.waitForTimeout(300);
    const s = await st(p);
    ok(s.sel === 'sel', `${tag}: Sel selected (${s.sel})`);
    ok(s.item.includes(TITLE), `${tag}: e30 item shows title`);
    ok(s.ex === NEW, `${tag}: e30 text = new wording (${s.ex})`);
    ok(!s.page.includes(OLD), `${tag}: old e30 wording absent from page`);
    if (label === 'All') {
      for (const [id, t] of Object.entries(OTHERS)) ok(s.items[id] === t, `${tag}: ${id} text unchanged`);
    }
    if (shotDir && (label === 'sufficient' || label === 'All')) {
      await p.locator('#dossier [data-ev="e30"]').scrollIntoViewIfNeeded();
      await p.waitForTimeout(300);
      await p.screenshot({ path: `${shotDir}/sel03e30-${label.toLowerCase()}-${name}.png` });
    }
    ok(errors.length === 0, `${tag}: no errors ${errors.join('|')}`);
    await p.close();
  }
  for (const [label, hash] of [
    ['TES only', '#read=' + TES],
    ['bucket 7 only', '#read=' + bucket(7).join(',')],
    ['bucket 1 + TES', '#read=' + [...bucket(1), TES].join(',')],
    ['other work only', '#read=mistborn-the-final-empire'],
    ['legacy book=6', '#book=6'],
  ]) {
    const tag = `${name} ${label}`;
    const { p, errors } = await open(ctx, hash);
    await p.evaluate(() => window.__atlas.openEvent('e30'));
    await p.waitForTimeout(500);
    const s = await st(p);
    ok(!s.has, `${tag}: no e30 dossier item (sel=${s.sel})`);
    ok(!s.page.includes(NEW) && !s.page.includes(OLD), `${tag}: no e30 text anywhere`);
    if (shotDir && label === 'TES only') await p.screenshot({ path: `${shotDir}/sel03e30-withheld-${name}.png` });
    ok(errors.length === 0, `${tag}: no errors ${errors.join('|')}`);
    await p.close();
  }
  await ctx.close();
}
await browser.close();
console.log(JSON.stringify({ pass, fail }));
process.exit(fail ? 1 : 0);
