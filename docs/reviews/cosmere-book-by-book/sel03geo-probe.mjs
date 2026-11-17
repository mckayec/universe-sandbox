// SEL03-GEO-01/02 rendered probe (sel03-final-checkpoint-2026-11-17.md); adapted from sel03e30-probe.mjs. Real Cosmere
// pack + engine, no fixtures; Playwright + software GL, 1440x900 and 390x844 (phone dossier sheet expanded with a real tap).
//  1. Allowed (sufficient set, legacy #book=7, #book=10, All): Sel selected; the Places list shows Mulla’dil and MaiPon
//     with exactly the new descriptions; removed phrases ("passes to Teod", "position in the empire is not given") absent
//     from the page; roseempire/dzhamar descriptions and e30 text unchanged where shown.
//  2. Withheld (TES only, bucket 7 only, bucket 1 + TES, other work only, legacy #book=6): no mulladil/maipon place
//     button and neither old nor new description anywhere on the page.
// Usage: node sel03geo-probe.mjs <baseUrl> <packPath> [shotDir]
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
const NEW = {
  mulladil: 'A mountainous region of the Rose Empire whose people are known as Strikers.',
  maipon: 'Shai’s homeland and the heart of Forgery.',
};
const OLD = {
  mulladil: 'A mountainous province of the Rose Empire whose Strikers guard the passes to Teod.',
  maipon: 'Shai’s homeland and the heart of Forgery; its position in the empire is not given.',
};
const REMOVED = ['passes to Teod', 'position in the empire is not given'];
const SEL = PACK.worlds.find(w => w.id === 'sel');
const KEEP = Object.fromEntries(
  SEL.sites.filter(s => ['roseempire', 'dzhamar'].includes(s.id)).map(s => [s.id, s.desc]),
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
  await p.evaluate(() => window.__atlas.selectWorld('sel'));
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
    ['sufficient', '#read=' + [...bucket(1), ...bucket(7)].join(',')],
    ['legacy book=7', '#book=7'],
    ['legacy book=10', '#book=10'],
    ['All', '#book=0'],
  ]) {
    const tag = `${name} ${label}`;
    const { p, errors } = await open(ctx, hash);
    await expand(p, mobile);
    const s = await st(p);
    ok(s.sel === 'sel', `${tag}: Sel selected (${s.sel})`);
    for (const id of ['mulladil', 'maipon']) ok(s.places[id] === NEW[id], `${tag}: ${id} desc = new (${s.places[id]})`);
    for (const [id, d] of Object.entries(KEEP)) ok(s.places[id] === d, `${tag}: ${id} desc unchanged`);
    for (const r of REMOVED) ok(!s.page.includes(r), `${tag}: "${r}" absent from page`);
    // open each corrected site with a real click/tap and read the visible (selected) description
    for (const id of ['mulladil', 'maipon']) {
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
      if (shotDir && (label === 'sufficient' || label === 'All')) {
        await p.locator(`#dossier .place[data-site="${id}"]`).first().scrollIntoViewIfNeeded();
        await p.waitForTimeout(300);
        await p.screenshot({ path: `${shotDir}/sel03geo-${id}-${label.toLowerCase()}-${name}.png` });
      }
    }
    for (const r of REMOVED) ok(!(await st(p)).page.includes(r), `${tag}: "${r}" absent after opening`);
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
    await expand(p, mobile);
    const s = await st(p);
    for (const id of ['mulladil', 'maipon']) {
      ok(!(id in s.places), `${tag}: no ${id} place (sel=${s.sel})`);
      ok(!s.page.includes(NEW[id]) && !s.page.includes(OLD[id]), `${tag}: no ${id} desc anywhere`);
    }
    if (shotDir && label === 'TES only') await p.screenshot({ path: `${shotDir}/sel03geo-withheld-${name}.png` });
    ok(errors.length === 0, `${tag}: no errors ${errors.join('|')}`);
    await p.close();
  }
  await ctx.close();
}
await browser.close();
console.log(JSON.stringify({ pass, fail }));
process.exit(fail ? 1 : 0);
