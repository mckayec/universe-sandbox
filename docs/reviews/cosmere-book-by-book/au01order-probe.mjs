// AU01-ORDER-01 rendered probe (au01-checkpoint-1-2026-11-21.md); harness adapted from ca01dest-probe.mjs.
// Real Cosmere pack + engine, no fixtures; Playwright + software GL, 1440x900 and 390x844 (touch; phone dossier sheet
// expanded with a real tap on #grab). Each of the ten Rosharan gas giants is selected programmatically
// (__atlas.selectWorld) in each reading state. Visible states: the dossier shows "Gas giant · Nth from the sun" and the
// Order fact "Nth from the sun (k of the ten gas giants)" with N = k + 3 (4th..13th) and never the old N = k + 4.
// Hidden states: no gas-giant ordinal text appears and the world is not selected.
// Usage: node au01order-probe.mjs <baseUrl> <packPath> [mode=head|parent] [shotDir]
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
const AU01 = 'arcanum-unbounded-system-essays-and-maps';
const ALL = pk.spoilers.works.map(w => w.id);
const B7 = pk.spoilers.works.filter(w => w.bucket === 7).map(w => w.id);
const GIANTS = [
  ['jes', 'Jes'],
  ['nan', 'Nan'],
  ['chach', 'Chach'],
  ['vev', 'Vev'],
  ['palah', 'Palah'],
  ['shash', 'Shash'],
  ['betab', 'Betab'],
  ['kak', 'Kak'],
  ['tanat', 'Tanat'],
  ['ishi', 'Ishi'],
];
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
    const p = await ctx.newPage();
    const errors = [];
    p.on('pageerror', e => errors.push(String(e)));
    p.on('console', m => m.type() === 'error' && errors.push(m.text()));
    await p.goto(base + '/atlas/index.html?pack=cosmere' + hash);
    await p.waitForFunction(() => !!window.__atlas, null, { timeout: 120000, polling: 250 });
    await p.waitForTimeout(600);
    for (let k = 0; k < GIANTS.length; k++) {
      const [id, nm] = GIANTS[k];
      const tag = `${name} ${label} ${id}`;
      await p.evaluate(i => window.__atlas.selectWorld(i), id);
      await p.waitForTimeout(250);
      if (mobile && (await p.evaluate(() => document.querySelector('#dossier')?.classList.contains('collapsed'))))
        await p.tap('#grab');
      const s = await p.evaluate(() => ({
        sel: window.__atlas.S.sel,
        dossier: document.querySelector('#dossier')?.textContent || '',
        facts: [...document.querySelectorAll('#dossier dl.facts dt')].map(dt => [
          dt.textContent,
          dt.nextElementSibling?.textContent,
        ]),
        page: document.body.textContent,
      }));
      const n = k + 4;
      const old = k + 5;
      if (shown) {
        ok(s.sel === id, `${tag}: selected (${s.sel})`);
        ok(s.dossier.includes(`Gas giant · ${n}th from the sun`), `${tag}: status ${n}th shown`);
        const order = s.facts.find(f => f[0] === 'Order');
        ok(
          order && order[1] === `${n}th from the sun (${k + 1} of the ten gas giants)`,
          `${tag}: Order fact (${order && order[1]})`,
        );
        ok(
          !s.dossier.includes(`Gas giant · ${old}th`) && !(order && order[1].startsWith(`${old}th`)),
          `${tag}: old ${old}th absent`,
        );
        if (shotDir && label === 'All' && (id === 'jes' || id === 'ishi')) {
          await p.waitForTimeout(400);
          await p.screenshot({ path: `${shotDir}/au01order-${mode}-${id}-${name}.png` });
        }
      } else {
        ok(s.sel !== id, `${tag}: not selectable (${s.sel})`);
        ok(
          !/th from the sun \(\d+ of the ten gas giants\)/.test(s.page) && !s.page.includes('Gas giant · '),
          `${tag}: no gas-giant ordinal on page`,
        );
      }
    }
    ok(errors.length === 0, `${name} ${label}: no errors ${errors.join('|')}`);
    await p.close();
  }
  await ctx.close();
}
await browser.close();
console.log(`au01order-probe (${mode}): ${pass}/${pass + fail} pass`);
process.exit(fail ? 1 : 0);
