// NA01-GEO-01/02 rendered probe (na01-geo-handoff-2026-11-19.md); adapted from na01geo-probe.mjs. Real Cosmere
// pack + engine, no fixtures; Playwright + software GL, 1440x900 and 390x844 (phone dossier sheet expanded with a real tap).
//  1. Allowed (Warbreaker only, legacy #book=3, #book=10, All): Nalthis selected; the Places list shows T’Telir and the
//     D’Denir garden with exactly the new descriptions; removed phrases ("Awakened statues everywhere", "in the north of
//     the city") absent from the page; courtofgods/brightsea descriptions unchanged.
//  2. Withheld (buckets 1+2 without Warbreaker, other work only, legacy #book=2): no ttelir/denir place button and
//     neither old nor new description anywhere on the page.
// Usage: node na01geo-probe.mjs <baseUrl> <packPath> [shotDir]
import { chromium } from 'playwright';
import fs from 'node:fs';
import vm from 'node:vm';
const [base = 'http://127.0.0.1:4173', packPath = 'public/atlas/packs/cosmere.js', shotDir] = process.argv.slice(2);
const cv = { window: {} };
vm.createContext(cv);
vm.runInContext(fs.readFileSync(packPath, 'utf8'), cv);
const PACK = cv.window.ATLAS_PACKS.cosmere;
const bucket = k => PACK.spoilers.works.filter(w => w.bucket === k).map(w => w.id);
const WB = 'warbreaker';
const NEW = {
  ttelir: 'Hallandren’s capital curves around a bay on the Bright Sea, with painted buildings and warrior statues at street corners.',
  denir: 'A quiet grassy field in T’Telir, filled with hundreds of weathered warrior statues.',
};
const OLD = {
  ttelir:
    'Hallandren’s capital, built in a crescent around a sheltered bay on the Bright Sea, with markets, merchant mansions, slums and docks, and Awakened statues everywhere.',
  denir: 'A quiet field of hundreds of old warrior statues in the north of the city.',
};
const REMOVED = ['Awakened statues everywhere', 'in the north of the city'];
const NAL = PACK.worlds.find(w => w.id === 'nalthis');
const KEEP = Object.fromEntries(
  NAL.sites.filter(s => ['courtofgods', 'brightsea'].includes(s.id)).map(s => [s.id, s.desc]),
);
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
  await p.evaluate(() => window.__atlas.selectWorld('nalthis'));
  await p.waitForTimeout(400);
  return { p, errors };
}
const st = p =>
  p.evaluate(() => ({
    sel: window.__atlas.S.sel,
    page: document.body.innerText + '\n' + document.body.textContent,
    places: Object.fromEntries(
      [...document.querySelectorAll('#dossier .place[data-site]')].map(b => [
        b.dataset.site,
        b.querySelector('.pd')?.textContent ?? null,
      ]),
    ),
  }));
const expand = async (p, mobile) => {
  if (mobile && (await p.evaluate(() => document.querySelector('#dossier')?.classList.contains('collapsed'))))
    await p.click('#grab');
  await p.waitForTimeout(300);
};
for (const [name, vp, mobile] of [
  ['1440x900', { width: 1440, height: 900 }, false],
  ['390x844', { width: 390, height: 844 }, true],
]) {
  const ctx = await browser.newContext({ viewport: vp, hasTouch: mobile, isMobile: mobile });
  for (const [label, hash] of [
    ['warbreaker', '#read=' + WB],
    ['legacy book=3', '#book=3'],
    ['legacy book=10', '#book=10'],
    ['All', '#book=0'],
  ]) {
    const tag = `${name} ${label}`;
    const { p, errors } = await open(ctx, hash);
    await expand(p, mobile);
    const s = await st(p);
    ok(s.sel === 'nalthis', `${tag}: Nalthis selected (${s.sel})`);
    for (const id of ['ttelir', 'denir']) ok(s.places[id] === NEW[id], `${tag}: ${id} desc = new (${s.places[id]})`);
    for (const [id, d] of Object.entries(KEEP)) ok(s.places[id] === d, `${tag}: ${id} desc unchanged`);
    for (const r of REMOVED) ok(!s.page.includes(r), `${tag}: "${r}" absent from page`);
    // open each corrected site with a real click/tap and read the visible (selected) description
    for (const id of ['ttelir', 'denir']) {
      const b = p.locator(`#dossier .place[data-site="${id}"]`).first();
      await b.scrollIntoViewIfNeeded();
      if (mobile) await b.tap();
      else await b.click();
      await p.waitForTimeout(900);
      await expand(p, mobile);
      const v = await p.evaluate(sid => {
        const el = document.querySelector(`#dossier .place.sel[data-site="${sid}"] .pd`);
        if (!el) return null;
        const r = el.getBoundingClientRect();
        return {
          site: window.__atlas.S.site,
          text: el.innerText.trim(),
          w: r.width,
          right: r.right,
          vw: innerWidth,
          sw: el.scrollWidth,
          cw: el.clientWidth,
        };
      }, id);
      ok(v && v.site === id, `${tag}: ${id} opened (${v && v.site})`);
      ok(v && v.text === NEW[id], `${tag}: ${id} visible desc = new (${v && v.text})`);
      ok(
        v && v.w > 0 && v.right <= v.vw && v.sw <= v.cw + 1,
        `${tag}: ${id} desc wraps inside viewport (${JSON.stringify(v)})`,
      );
      if (shotDir && (label === 'warbreaker' || label === 'All')) {
        await p.locator(`#dossier .place[data-site="${id}"]`).first().scrollIntoViewIfNeeded();
        await p.waitForTimeout(300);
        await p.screenshot({ path: `${shotDir}/na01geo-${id}-${label.toLowerCase()}-${name}.png` });
      }
    }
    for (const r of REMOVED) ok(!(await st(p)).page.includes(r), `${tag}: "${r}" absent after opening`);
    ok(errors.length === 0, `${tag}: no errors ${errors.join('|')}`);
    await p.close();
  }
  for (const [label, hash] of [
    ['buckets 1+2 (no Warbreaker)', '#read=' + [...bucket(1), ...bucket(2)].join(',')],
    ['other work only', '#read=mistborn-the-final-empire'],
    ['legacy book=2', '#book=2'],
  ]) {
    const tag = `${name} ${label}`;
    const { p, errors } = await open(ctx, hash);
    await expand(p, mobile);
    const s = await st(p);
    for (const id of ['ttelir', 'denir']) {
      ok(!(id in s.places), `${tag}: no ${id} place (sel=${s.sel})`);
      ok(!s.page.includes(NEW[id]) && !s.page.includes(OLD[id]), `${tag}: no ${id} desc anywhere`);
    }
    if (shotDir && label === 'other work only') await p.screenshot({ path: `${shotDir}/na01geo-withheld-${name}.png` });
    ok(errors.length === 0, `${tag}: no errors ${errors.join('|')}`);
    await p.close();
  }
  await ctx.close();
}
await browser.close();
console.log(JSON.stringify({ pass, fail }));
process.exit(fail ? 1 : 0);
