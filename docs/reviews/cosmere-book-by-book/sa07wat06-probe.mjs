// SA07-WAT06-OMIT rendered probe (sa07-wat06-handoff-2026-11-20.md); harness adapted from sa07text-probe.mjs.
// Real Cosmere pack + engine, no fixtures; Playwright + software GL, 1440x900 and 390x844 (phone sheet opened with a
// real tap on #grab). Roshar is selected programmatically (__atlas.selectWorld). For each reading state:
//  - world facts: the dossier "Moons" <dd> (direct DOM read) equals the expected value when Roshar is visible;
//  - site list: the pool place button's .pd (direct DOM read) equals the retained text when the pool is listed,
//    then a REAL click (desktop) / tap (phone) on that button selects the site; page text re-checked afterwards;
//  - the two omitted clauses ("fourth broke up", "Cultivation left") never appear in page text.
// Expectations per state come from the 14-state selector evidence (sa07-wat06-evidence.json).
// Usage: node sa07wat06-probe.mjs <baseUrl> <repoDir> [mode=head|parent] [shotDir]
import { chromium } from 'playwright';
import fs from 'node:fs';
import vm from 'node:vm';
const [base = 'http://127.0.0.1:4173', repo = '.', mode = 'head', shotDir] = process.argv.slice(2);
const pk = (() => {
  const c = { window: {} };
  vm.runInNewContext(fs.readFileSync(repo + '/public/atlas/packs/cosmere.js', 'utf8'), c);
  return c.window.ATLAS_PACKS.cosmere;
})();
const ALL = pk.spoilers.works.map(w => w.id);
const MOON = 'Salas, Nomon, Mishim';
const POOL =
  'A crater lake in the Horneater Peaks: Roshar’s stable doorway into Shadesmar and the usual way worldhoppers arrive.';
const BAD = ['fourth broke up', 'Cultivation left'];
// [label, hash, rosharVisible, poolListed]
const STATES = [
  ['All', '#book=0', true, true],
  ['legacy4', '#book=4', true, false],
  ['legacy9', '#book=9', true, true],
  ['legacy11', '#book=11', true, true],
  ['WoK only', '#read=the-way-of-kings', true, false],
  ['all minus WaT', '#read=' + ALL.filter(x => x !== 'wind-and-truth').join(','), true, true],
  ['all works', '#read=' + ALL.join(','), true, true],
  ['WaT only', '#read=wind-and-truth', false, false],
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
const look = p =>
  p.evaluate(() => {
    const dts = [...document.querySelectorAll('#dossier dl.facts dt')];
    const m = dts.find(d => d.textContent === 'Moons');
    const pool = document.querySelector('#dossier .place[data-site="pool"] .pd');
    return {
      sel: window.__atlas.S.sel,
      site: window.__atlas.S.site,
      moons: m ? m.nextElementSibling.textContent : null,
      pool: pool ? pool.textContent : null,
      page: document.body.innerText + '\n' + document.body.textContent,
    };
  });
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
  for (const [label, hash, vis, listed] of STATES) {
    const tag = `${name} ${label}`;
    const p = await ctx.newPage();
    const errors = [];
    p.on('pageerror', e => errors.push(String(e)));
    p.on('console', m => m.type() === 'error' && errors.push(m.text()));
    await p.goto(base + '/atlas/index.html?pack=cosmere' + hash);
    await p.waitForFunction(() => !!window.__atlas, null, { timeout: 120000, polling: 250 });
    await p.waitForTimeout(600);
    await p.evaluate(() => window.__atlas.selectWorld('roshar'));
    await p.waitForTimeout(400);
    await expand(p, mobile);
    let s = await look(p);
    for (const b of BAD) ok(!s.page.includes(b), `${tag}: "${b}" absent`);
    if (vis) {
      ok(s.sel === 'roshar', `${tag}: roshar selected (${s.sel})`);
      ok(s.moons === MOON, `${tag}: Moons = ${JSON.stringify(s.moons)}`);
    } else ok(s.moons === null, `${tag}: no Roshar facts (${JSON.stringify(s.moons)})`);
    ok((s.pool !== null) === listed, `${tag}: pool listed=${listed} (${s.pool !== null})`);
    if (s.pool !== null) {
      ok(s.pool === POOL, `${tag}: pool text = retained (${s.pool})`);
      const btn = p.locator('#dossier .place[data-site="pool"]').first();
      await btn.scrollIntoViewIfNeeded();
      if (mobile) await btn.tap();
      else await btn.click();
      await p.waitForTimeout(1000);
      await expand(p, mobile);
      s = await look(p);
      ok(s.site === 'pool', `${tag}: pool selected by real ${mobile ? 'tap' : 'click'} (${s.site})`);
      for (const b of BAD) ok(!s.page.includes(b), `${tag}: "${b}" absent after selecting pool`);
      if (shotDir && label === 'all works') await p.screenshot({ path: `${shotDir}/sa07wat06-${mode}-${name}.png` });
    }
    ok(errors.length === 0, `${tag}: no errors ${errors.join('|')}`);
    await p.close();
  }
  await ctx.close();
}
await browser.close();
console.log(`sa07wat06-probe (${mode}): ${pass}/${pass + fail} pass`);
process.exit(fail ? 1 : 0);
