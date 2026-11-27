// TA01-KENTON-01 rendered probe (ta01-handoff-2026-11-20.md); harness adapted from sa07wat06-probe.mjs.
// Real Cosmere pack + engine, no fixtures; Playwright + software GL, 1440x900 and 390x844 (phone sheet opened with a
// real tap on #grab). Taldain is selected programmatically (__atlas.selectWorld). For each reading state:
//  - world blurb: the dossier p.blurb (direct DOM read) ends with the expected sentence when Taldain is visible,
//    and no Taldain blurb is shown when the selector evidence says the world is hidden;
//  - the old sole-master claim ("only master") never appears in page text;
//  - eligible states: the tooltip first-sentence path is unchanged (sentence 1 of the blurb).
// Expectations per state come from the 16-state selector evidence (ta01-evidence-2026-11-20.json).
// Usage: node ta01kenton-probe.mjs <baseUrl> <repoDir> [mode=head|parent] [shotDir]
import { chromium } from 'playwright';
import fs from 'node:fs';
import vm from 'node:vm';
const [base = 'http://127.0.0.1:4173', repo = '.', mode = 'head', shotDir] = process.argv.slice(2);
const pk = (() => {
  const c = { window: {} };
  vm.runInNewContext(fs.readFileSync(repo + '/public/atlas/packs/cosmere.js', 'utf8'), c);
  return c.window.ATLAS_PACKS.cosmere;
})();
const B7 = pk.spoilers.works.filter(w => w.bucket === 7).map(w => w.id);
const ALL = pk.spoilers.works.map(w => w.id);
const NEW = 'After a massacre of the Sand Masters, Kenton believes himself to be the only survivor.';
const BAD = 'only master';
// [label, hash, taldainVisible]
const STATES = [
  ['All', '#book=0', true],
  ['legacy7', '#book=7', true],
  ['legacy6', '#book=6', false],
  ['bucket7', '#read=' + B7.join(','), true],
  ['all works', '#read=' + ALL.join(','), true],
  ['WS vol1 only', '#read=white-sand-volume-1', false],
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
    const b = document.querySelector('#dossier p.blurb');
    return {
      sel: window.__atlas.S.sel,
      blurb: b ? b.textContent : null,
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
    await p.evaluate(() => window.__atlas.selectWorld('taldain'));
    await p.waitForTimeout(500);
    if (mobile && (await p.evaluate(() => document.querySelector('#dossier')?.classList.contains('collapsed'))))
      await p.tap('#grab');
    await p.waitForTimeout(400);
    const s = await look(p);
    ok(!s.page.includes(BAD), `${tag}: "${BAD}" absent`);
    if (vis) {
      ok(s.sel === 'taldain', `${tag}: taldain selected (${s.sel})`);
      ok(!!s.blurb && s.blurb.endsWith(' ' + NEW), `${tag}: blurb ends with replacement (${s.blurb})`);
      ok(s.blurb?.split(NEW).length === 2, `${tag}: replacement once`);
      if (shotDir && (label === 'All' || label === 'bucket7'))
        await p.screenshot({ path: `${shotDir}/ta01kenton-${mode}-${label.replace(/\s/g, '')}-${name}.png` });
    } else {
      ok(s.sel !== 'taldain' || s.blurb === null || !s.blurb.includes('Kenton'), `${tag}: Taldain blurb withheld (sel=${s.sel})`);
      ok(!s.page.includes('Kenton believes'), `${tag}: replacement withheld`);
    }
    ok(errors.length === 0, `${tag}: no errors ${errors.join('|')}`);
    await p.close();
  }
  await ctx.close();
}
await browser.close();
console.log(`ta01kenton-probe (${mode}): ${pass}/${pass + fail} pass`);
process.exit(fail ? 1 : 0);
