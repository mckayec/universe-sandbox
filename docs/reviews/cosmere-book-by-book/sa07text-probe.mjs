// SA07-OPEN-01 + SA07-HOID-01 rendered probe (sa07-handoff-2026-11-20.md); harness adapted from sa06ideal-probe.mjs.
// Real Cosmere pack + engine, no fixtures; Playwright + software GL, 1440x900 and 390x844 (phone sheet opened with
// real taps). For each of e55 (Roshar, place Urithiru) and e60 (Scadrial):
//  1. Allowed (all works read, legacy #book=12, All): world selected; the dossier "In the Chronicle" item shows exactly
//     the new sentence (e55 place label unchanged = Urithiru); opening it with a real click/tap opens the event and
//     the text wraps inside the viewport. Old copy absent from the page throughout.
//  2. Withheld (WaT only, all works minus WaT, legacy #book=11): no item; neither old nor new text anywhere.
// DOM assertions + actual pointer clicks/taps on the dossier item; no surface-route render.
// Usage: node sa07text-probe.mjs <baseUrl> <repoDir> [shotDir]
import { chromium } from 'playwright';
import fs from 'node:fs';
import vm from 'node:vm';
const [base = 'http://127.0.0.1:4173', repo = '.', shotDir] = process.argv.slice(2);
const pk = (() => {
  const c = { window: {} };
  vm.runInNewContext(fs.readFileSync(repo + '/public/atlas/packs/cosmere.js', 'utf8'), c);
  return c.window.ATLAS_PACKS.cosmere;
})();
const ALL = pk.spoilers.works.map(w => w.id);
const EVS = [
  {
    id: 'e55',
    world: 'roshar',
    place: 'Urithiru',
    NEW: 'The agreed contest of champions approaches; its ten-day countdown is already underway.',
    OLD: 'Dalinar and Odium agree on a contest, with ten days for both sides to prepare.',
  },
  {
    id: 'e60',
    world: 'scadrial',
    place: undefined,
    NEW: 'Hoid recovers on Scadrial in Ulaam’s care. Later, he is hired by the Ladrian household and plans to seek Valor.',
    OLD: 'In the epilogue Hoid travels to Scadrial to look for allies against Retribution.',
  },
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
async function open(ctx, hash, world) {
  const p = await ctx.newPage();
  const errors = [];
  p.on('pageerror', e => errors.push(String(e)));
  p.on('console', m => m.type() === 'error' && errors.push(m.text()));
  await p.goto(base + '/atlas/index.html?pack=cosmere' + hash);
  await p.waitForFunction(() => !!window.__atlas, null, { timeout: 120000, polling: 250 });
  await p.waitForTimeout(600);
  await p.evaluate(w => window.__atlas.selectWorld(w), world);
  await p.waitForTimeout(400);
  return { p, errors };
}
const st = (p, id) =>
  p.evaluate(id => {
    const it = document.querySelector(`#dossier .evitem[data-ev="${id}"]`);
    return {
      sel: window.__atlas.S.sel,
      ev: window.__atlas.S.ev,
      page: document.body.innerText + '\n' + document.body.textContent,
      item: it
        ? { ex: it.querySelector('.ex')?.textContent ?? null, ep: it.querySelector('.ep')?.textContent ?? null }
        : null,
    };
  }, id);
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
  for (const E of EVS) {
    for (const [label, hash] of [
      ['all works', '#read=' + ALL.join(',')],
      ['legacy book=12', '#book=12'],
      ['All', '#book=0'],
    ]) {
      const tag = `${name} ${E.id} ${label}`;
      const { p, errors } = await open(ctx, hash, E.world);
      await expand(p, mobile);
      let s = await st(p, E.id);
      ok(s.sel === E.world, `${tag}: ${E.world} selected (${s.sel})`);
      ok(s.item && s.item.ex === E.NEW, `${tag}: dossier text = new (${s.item && s.item.ex})`);
      if (E.place)
        ok(s.item && s.item.ep === E.place, `${tag}: place label unchanged = ${E.place} (${s.item && s.item.ep})`);
      else ok(!!s.item, `${tag}: place label observed = ${JSON.stringify(s.item && s.item.ep)}`);
      ok(!s.page.includes(E.OLD), `${tag}: old copy absent`);
      if (!s.item) {
        ok(false, `${tag}: item missing, open/wrap checks skipped`);
        await p.close();
        continue;
      }
      const b = p.locator(`#dossier .evitem[data-ev="${E.id}"]`).first();
      await b.scrollIntoViewIfNeeded();
      if (mobile) await b.tap();
      else await b.click();
      await p.waitForTimeout(1200);
      await expand(p, mobile);
      s = await st(p, E.id);
      ok(s.ev === E.id, `${tag}: opened from dossier (${s.ev})`);
      const v = await p.evaluate(id => {
        const el = document.querySelector(`#dossier .evitem.open[data-ev="${id}"] .ex`);
        if (!el) return null;
        const r = el.getBoundingClientRect();
        return {
          text: el.innerText.trim(),
          w: r.width,
          right: r.right,
          vw: innerWidth,
          sw: el.scrollWidth,
          cw: el.clientWidth,
        };
      }, E.id);
      ok(v && v.text === E.NEW, `${tag}: visible open text = new (${v && v.text})`);
      ok(
        v && v.w > 0 && v.right <= v.vw && v.sw <= v.cw + 1,
        `${tag}: text wraps inside viewport (${JSON.stringify(v)})`,
      );
      ok(!s.page.includes(E.OLD), `${tag}: old copy absent after open`);
      if (shotDir && label === 'all works') {
        await b.scrollIntoViewIfNeeded();
        await p.waitForTimeout(300);
        await p.screenshot({ path: `${shotDir}/sa07-${E.id}-dossier-${name}.png` });
      }
      ok(errors.length === 0, `${tag}: no errors ${errors.join('|')}`);
      await p.close();
    }
    for (const [label, hash] of [
      ['WaT only', '#read=wind-and-truth'],
      ['all minus WaT', '#read=' + ALL.filter(x => x !== 'wind-and-truth').join(',')],
      ['legacy book=11', '#book=11'],
    ]) {
      const tag = `${name} ${E.id} ${label}`;
      const { p, errors } = await open(ctx, hash, E.world);
      await expand(p, mobile);
      const s = await st(p, E.id);
      ok(s.item === null, `${tag}: no item (sel=${s.sel})`);
      ok(!s.page.includes(E.NEW) && !s.page.includes(E.OLD), `${tag}: no text anywhere`);
      ok(errors.length === 0, `${tag}: no errors ${errors.join('|')}`);
      await p.close();
    }
  }
  await ctx.close();
}
await browser.close();
console.log(`sa07text-probe: ${pass}/${pass + fail} pass`);
process.exit(fail ? 1 : 0);
