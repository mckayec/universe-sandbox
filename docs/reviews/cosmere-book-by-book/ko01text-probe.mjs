// KO01-TEXT-01 rendered probe (ko01-handoff-2026-11-20.md); harness adapted from th01rules-probe.mjs.
// Real Cosmere pack + engine, no fixtures; Playwright + software GL, 1440x900 and 390x844 (touch; phone dossier sheet
// expanded with a real tap on #grab). Komashi is selected programmatically (__atlas.selectWorld).
//  - eligible states: dossier p.blurb equals the new Komashi blurb; the e51 event row (.ex) equals the new text and
//    sits inside the viewport after scrolling; removed wording ("across time", "few hundred miles") absent from page;
//  - denied states: neither the old nor the new blurb / e51 text anywhere in page text.
// Eligibility per state comes from the focused selector test (tests/atlas-ko01-text.test.ts, parent exposure 5/13).
// Usage: node ko01text-probe.mjs <baseUrl> <packPath> [mode=head|parent] [shotDir]
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
const B11 = pk.spoilers.works.filter(w => w.bucket === 11).map(w => w.id);
const ALL = pk.spoilers.works.map(w => w.id);
const YUMI = 'yumi-and-the-nightmare-painter';
const NEW_BLURB =
  'Yumi stacks stones in rituals honoring the spirits. In Kilahito, Nikaro works as a nightmare painter beneath glowing hion lines. Their lives become connected.';
const NEW_E51 = 'Yumi, a stone-stacker, and Nikaro, a nightmare painter, become linked.';
const OLD_BITS = [
  'across time and must work out why',
  'few hundred miles',
  'six times larger',
  'Half of a double planet',
];
const STATES = [
  ['All', '#book=0', true],
  ['legacy11', '#book=11', true],
  ['legacy10', '#book=10', false],
  ['bucket11', '#read=' + B11.join(','), true],
  ['all works', '#read=' + ALL.join(','), true],
  ['Yumi only', '#read=' + YUMI, false],
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
    const b = document.querySelector('#dossier p.blurb');
    const e = document.querySelector('#dossier [data-ev="e51"] .ex');
    return {
      sel: window.__atlas.S.sel,
      blurb: b ? b.textContent : null,
      e51: e ? e.textContent : null,
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
    await p.evaluate(() => window.__atlas.selectWorld('komashi'));
    await p.waitForTimeout(500);
    await expand(p, mobile);
    const s = await look(p);
    for (const bit of OLD_BITS) ok(!s.page.includes(bit), `${tag}: old wording absent (${bit})`);
    if (vis) {
      ok(s.sel === 'komashi', `${tag}: komashi selected (${s.sel})`);
      ok(s.blurb === NEW_BLURB, `${tag}: blurb = replacement (${s.blurb})`);
      ok(s.e51 === NEW_E51, `${tag}: e51 text = replacement (${s.e51})`);
      const ev = p.locator('#dossier [data-ev="e51"]').first();
      await ev.scrollIntoViewIfNeeded();
      await p.waitForTimeout(300);
      const r = await p.evaluate(() => {
        const el = document.querySelector('#dossier [data-ev="e51"] .ex').getBoundingClientRect();
        return { w: el.width, right: el.right, bottom: el.bottom, vw: innerWidth, vh: innerHeight };
      });
      ok(r.w > 0 && r.right <= r.vw && r.bottom <= r.vh, `${tag}: e51 inside viewport (${JSON.stringify(r)})`);
      if (shotDir && (label === 'All' || label === 'bucket11'))
        await p.screenshot({ path: `${shotDir}/ko01text-${mode}-${label.replace(/\s/g, '')}-${name}.png` });
    } else {
      ok(s.blurb !== NEW_BLURB && !s.page.includes(NEW_BLURB), `${tag}: new blurb not on page`);
      ok(!s.page.includes(NEW_E51), `${tag}: new e51 not on page`);
    }
    ok(errors.length === 0, `${tag}: no errors ${errors.join('|')}`);
    await p.close();
  }
  await ctx.close();
}
await browser.close();
console.log(`ko01text-probe (${mode}): ${pass}/${pass + fail} pass`);
process.exit(fail ? 1 : 0);
