// TH01-RULES-01 rendered probe (th01-handoff-2026-11-20.md); harness adapted from sa01geo-probe.mjs / ta01kenton-probe.mjs.
// Real Cosmere pack + engine, no fixtures; Playwright + software GL, 1440x900 and 390x844 (touch; phone dossier sheet
// expanded with a real tap on #grab). Threnody is selected programmatically (__atlas.selectWorld); the Forests of Hell
// place is then opened with a real click (desktop) / tap (phone) on its Places button.
//  - eligible states: the Places list and the opened forests description equal "<preserved sentence> <replacement>";
//    the replacement occurs once; "keep you alive" is absent from page text;
//  - denied states: no forests place button; neither old nor new sentence anywhere in page text.
// Eligibility per state comes from the focused selector test (tests/atlas-th01-rules.test.ts, parent exposure 5/13).
// Usage: node th01rules-probe.mjs <baseUrl> <packPath> [mode=head|parent] [shotDir]
import { chromium } from 'playwright';
import fs from 'node:fs';
import vm from 'node:vm';
const [base = 'http://127.0.0.1:4173', packPath = 'public/atlas/packs/cosmere.js', mode = 'head', shotDir] =
  process.argv.slice(2);
const pk = (() => {
  const c = { window: {} };
  vm.runInNewContext(fs.readFileSync(packPath, 'utf8'), c);
  return c.window.ATLAS_PACKS.cosmere;
})();
const B7 = pk.spoilers.works.filter(w => w.bucket === 7).map(w => w.id);
const ALL = pk.spoilers.works.map(w => w.id);
const SFS = 'shadows-for-silence-in-the-forests-of-hell';
const KEEP = 'The smaller continent, almost wall-to-wall forest, unnaturally silent and haunted by shades.';
const NEW =
  'To avoid drawing shades, the Simple Rules prohibit kindling flame, shedding another’s blood, and running at night.';
const OLD = 'No fire, no blood: the Simple Rules keep you alive.';
const WANT = KEEP + ' ' + NEW;
// [label, hash, eligible]
const STATES = [
  ['All', '#book=0', true],
  ['legacy7', '#book=7', true],
  ['legacy6', '#book=6', false],
  ['bucket7', '#read=' + B7.join(','), true],
  ['all works', '#read=' + ALL.join(','), true],
  ['Shadows for Silence only', '#read=' + SFS, false],
];
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
const expand = async (p, mobile) => {
  if (mobile && (await p.evaluate(() => document.querySelector('#dossier')?.classList.contains('collapsed'))))
    await p.tap('#grab');
  await p.waitForTimeout(300);
};
const look = p =>
  p.evaluate(() => {
    const b = document.querySelector('#dossier .place[data-site="forests"] .pd');
    return {
      sel: window.__atlas.S.sel,
      list: b ? b.textContent : null,
      page: document.body.innerText + '\n' + document.body.textContent,
    };
  });
for (const [name, vp, mobile] of [
  ['1440x900', { width: 1440, height: 900 }, false],
  ['390x844', { width: 390, height: 844 }, true],
]) {
  const ctx = await browser.newContext({ viewport: vp, hasTouch: mobile, isMobile: mobile });
  for (const [label, hash, vis] of STATES) {
    const tag = `${name} ${label}`;
    const p = await ctx.newPage();
    const errors = [];
    p.on('pageerror', e => errors.push(String(e)));
    p.on('console', m => m.type() === 'error' && errors.push(m.text()));
    await p.goto(base + '/atlas/index.html?pack=cosmere' + hash);
    await p.waitForFunction(() => !!window.__atlas, null, { timeout: 120000, polling: 250 });
    await p.waitForTimeout(600);
    await p.evaluate(() => window.__atlas.selectWorld('threnody'));
    await p.waitForTimeout(500);
    await expand(p, mobile);
    let s = await look(p);
    ok(!s.page.includes('keep you alive'), `${tag}: old wording absent`);
    if (vis) {
      ok(s.sel === 'threnody', `${tag}: threnody selected (${s.sel})`);
      ok(s.list === WANT, `${tag}: places list desc = preserved + replacement (${s.list})`);
      const b = p.locator('#dossier .place[data-site="forests"]').first();
      await b.scrollIntoViewIfNeeded();
      if (mobile) await b.tap();
      else await b.click();
      await p.waitForTimeout(900);
      await expand(p, mobile);
      const v = await p.evaluate(() => {
        const el = document.querySelector('#dossier .place.sel[data-site="forests"] .pd');
        if (!el) return { site: window.__atlas.S.site, text: null };
        const r = el.getBoundingClientRect();
        return { site: window.__atlas.S.site, text: el.innerText.trim(), right: r.right, vw: innerWidth, w: r.width };
      });
      ok(v.site === 'forests', `${tag}: forests opened (${v.site})`);
      ok(v.text === WANT, `${tag}: opened desc = preserved + replacement (${v.text})`);
      ok(v.w > 0 && v.right <= v.vw, `${tag}: desc inside viewport (${v.right}/${v.vw})`);
      s = await look(p);
      ok(s.page.split(NEW).length - 1 >= 1 && !s.page.includes(OLD), `${tag}: page has replacement, no old sentence`);
      if (shotDir && (label === 'All' || label === 'bucket7')) {
        await p.locator('#dossier .place[data-site="forests"]').first().scrollIntoViewIfNeeded();
        await p.waitForTimeout(300);
        await p.screenshot({ path: `${shotDir}/th01rules-${mode}-${label.replace(/\s/g, '')}-${name}.png` });
      }
    } else {
      ok(s.list === null, `${tag}: no forests place button (sel=${s.sel})`);
      ok(!s.page.includes(NEW) && !s.page.includes(OLD), `${tag}: neither sentence on page`);
    }
    ok(errors.length === 0, `${tag}: no errors ${errors.join('|')}`);
    await p.close();
  }
  await ctx.close();
}
await browser.close();
console.log(`th01rules-probe (${mode}): ${pass}/${pass + fail} pass`);
process.exit(fail ? 1 : 0);
