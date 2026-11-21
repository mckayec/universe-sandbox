// AU01-THRENODY-01 rendered probe (au01-checkpoint-2-2026-11-21.md); harness adapted from au01order-probe.mjs.
// Real Cosmere pack + engine, no fixtures; Playwright + software GL, 1440x900 and 390x844 (touch; phone dossier sheet
// expanded with a real tap on #grab). Per reading state: select threnosun with __atlas.selectWorld and read the dossier;
// open the codex (#cxBtn click), choose the Shards tab, read the Ambition entry. Visible states: dossier contains the new
// blurb, Ambition paragraph starts with the new desc, and neither contains the removed clauses. Hidden states: threnosun
// not selected, no Ambition entry, and neither old nor new target text anywhere on the page.
// Usage: node au01threnody-probe.mjs <baseUrl> <packPath> [mode=head|parent] [shotDir]
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
const NEW_WORLD =
  'A red star. In the empty space of this system the Shards Ambition and Odium fought; Ambition was mortally wounded. The twisted Investiture on Threnody is at least partly a scar of that battle.';
const NEW_CODEX =
  'A Shard mortally wounded in a battle with Odium in the empty space of the Threnodite system. The battle still twists the Investiture on Threnody.';
const REMOVED = ['probably Mercy', 'planets that once orbited here were destroyed', 'destroyed planets there'];
const AU01 = 'arcanum-unbounded-system-essays-and-maps';
const ALL = pk.spoilers.works.map(w => w.id);
const B7 = pk.spoilers.works.filter(w => w.bucket === 7).map(w => w.id);
const STATES = [
  ['All', '#book=0', true],
  ['legacy7', '#book=7', true],
  ['bucket7', '#read=' + B7.join(','), true],
  ['all works', '#read=' + ALL.join(','), true],
  ['legacy6', '#book=6', false],
  ['AU01 only', '#read=' + AU01, false],
  ['bucket7 minus AU01', '#read=' + B7.filter(id => id !== AU01).join(','), false],
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
for (const [name, vp, mobile] of [
  ['1440x900', { width: 1440, height: 900 }, false],
  ['390x844', { width: 390, height: 844 }, true],
]) {
  const ctx = await browser.newContext({ viewport: vp, hasTouch: mobile, isMobile: mobile });
  for (const [label, hash, shown] of STATES) {
    const tag = `${name} ${label}`;
    const p = await ctx.newPage();
    const errors = [];
    p.on('pageerror', e => errors.push(String(e)));
    p.on('console', m => m.type() === 'error' && errors.push(m.text()));
    await p.goto(base + '/atlas/index.html?pack=cosmere' + hash);
    await p.waitForFunction(() => !!window.__atlas, null, { timeout: 120000, polling: 250 });
    await p.waitForTimeout(600);
    await p.evaluate(() => window.__atlas.selectWorld('threnosun'));
    await p.waitForTimeout(300);
    if (
      shown &&
      mobile &&
      (await p.evaluate(() => document.querySelector('#dossier')?.classList.contains('collapsed')))
    )
      await p.tap('#grab');
    const d = await p.evaluate(() => ({
      sel: window.__atlas.S.sel,
      dossier: document.querySelector('#dossier')?.textContent || '',
    }));
    if (shown) {
      ok(d.sel === 'threnosun', `${tag}: threnosun selected (${d.sel})`);
      ok(d.dossier.includes(NEW_WORLD), `${tag}: dossier shows new blurb`);
      ok(!REMOVED.some(r => d.dossier.includes(r)), `${tag}: dossier has no removed clause`);
      if (shotDir && label === 'All') {
        await p.waitForTimeout(400);
        await p.screenshot({ path: `${shotDir}/au01threnody-${mode}-sun-${name}.png` });
      }
    } else ok(d.sel !== 'threnosun', `${tag}: threnosun not selectable (${d.sel})`);
    await p.evaluate(() => document.querySelector('#cxBtn').click());
    await p.waitForTimeout(200);
    await p.click('#cxTabs [data-tab="shards"]');
    await p.waitForTimeout(200);
    const c = await p.evaluate(() => {
      const items = [...document.querySelectorAll('#cxBody .cx-item')];
      const amb = items.find(i => i.querySelector('h3')?.textContent === 'Ambition');
      return {
        open: !document.querySelector('#codex').hidden,
        amb: amb ? amb.querySelector('p')?.textContent || '' : null,
        page: document.body.textContent,
      };
    });
    ok(c.open, `${tag}: codex open`);
    if (shown) {
      ok(c.amb !== null && c.amb.startsWith(NEW_CODEX), `${tag}: Ambition desc is new text (${c.amb})`);
      ok(c.amb !== null && !REMOVED.some(r => c.amb.includes(r)), `${tag}: Ambition has no removed clause`);
      if (shotDir && label === 'All') {
        await p.evaluate(() => {
          const a = [...document.querySelectorAll('#cxBody .cx-item')].find(
            i => i.querySelector('h3')?.textContent === 'Ambition',
          );
          a && a.scrollIntoView({ block: 'center' });
        });
        await p.waitForTimeout(300);
        await p.screenshot({ path: `${shotDir}/au01threnody-${mode}-codex-${name}.png` });
      }
    } else {
      ok(c.amb === null, `${tag}: no Ambition entry`);
      ok(
        !c.page.includes(NEW_WORLD) && !c.page.includes(NEW_CODEX) && !REMOVED.some(r => c.page.includes(r)),
        `${tag}: no target text on page`,
      );
    }
    ok(
      REMOVED.every(r => !c.page.includes(r)),
      `${tag}: removed clauses absent from page`,
    );
    ok(errors.length === 0, `${tag}: no errors ${errors.join('|')}`);
    await p.close();
  }
  await ctx.close();
}
await browser.close();
console.log(`au01threnody-probe (${mode}): ${pass}/${pass + fail} pass`);
process.exit(fail ? 1 : 0);
