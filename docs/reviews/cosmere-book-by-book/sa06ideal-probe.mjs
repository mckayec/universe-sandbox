// SA06-IDEAL-01 rendered probe (sa06-handoff-2026-11-20.md); harness adapted from sa04bond-probe.mjs. Real Cosmere
// pack + engine, no fixtures; Playwright + software GL, 1440x900 and 390x844 (phone sheet opened with real taps).
//  1. Allowed (WoK + WoR + RoW, legacy #book=9, All): Roshar selected; the dossier "In the Chronicle" item e44 shows
//     exactly the new sentence and its unchanged "Urithiru" place label; opening it with a real click/tap opens e44,
//     the text wraps inside the viewport. Old copy absent from the page throughout.
//  2. Withheld (RoW only, WoK + OB + DS + RoW, legacy #book=8): no e44 item; neither old nor new text anywhere.
// DOM assertions + actual pointer clicks/taps on the dossier item; no surface-route render.
// Usage: node sa06ideal-probe.mjs <baseUrl> [shotDir]
import { chromium } from 'playwright';
const [base = 'http://127.0.0.1:4173', shotDir] = process.argv.slice(2);
const NEW = 'Kaladin accepts that there are people he cannot protect and swears the Fourth Ideal.';
const OLD = 'Alone in the captured tower, Kaladin learns he cannot save everyone and keeps going anyway.';
const PLACE = 'Urithiru';
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
  await p.evaluate(() => window.__atlas.selectWorld('roshar'));
  await p.waitForTimeout(400);
  return { p, errors };
}
const st = p =>
  p.evaluate(() => {
    const it = document.querySelector('#dossier .evitem[data-ev="e44"]');
    return {
      sel: window.__atlas.S.sel,
      ev: window.__atlas.S.ev,
      page: document.body.innerText + '\n' + document.body.textContent,
      item: it
        ? { ex: it.querySelector('.ex')?.textContent ?? null, ep: it.querySelector('.ep')?.textContent ?? null }
        : null,
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
  for (const [label, hash] of [
    ['wok+wor+row', '#read=the-way-of-kings,words-of-radiance,rhythm-of-war'],
    ['legacy book=9', '#book=9'],
    ['All', '#book=0'],
  ]) {
    const tag = `${name} ${label}`;
    const { p, errors } = await open(ctx, hash);
    await expand(p, mobile);
    let s = await st(p);
    ok(s.sel === 'roshar', `${tag}: Roshar selected (${s.sel})`);
    ok(s.item && s.item.ex === NEW, `${tag}: e44 dossier text = new (${s.item && s.item.ex})`);
    ok(s.item && s.item.ep === PLACE, `${tag}: e44 place label unchanged = ${PLACE} (${s.item && s.item.ep})`);
    ok(!s.page.includes(OLD), `${tag}: old copy absent`);
    const b = p.locator('#dossier .evitem[data-ev="e44"]').first();
    await b.scrollIntoViewIfNeeded();
    if (mobile) await b.tap();
    else await b.click();
    await p.waitForTimeout(1200);
    await expand(p, mobile);
    s = await st(p);
    ok(s.ev === 'e44', `${tag}: e44 opened from dossier (${s.ev})`);
    const v = await p.evaluate(() => {
      const el = document.querySelector('#dossier .evitem.open[data-ev="e44"] .ex');
      if (!el) return null;
      const r = el.getBoundingClientRect();
      return { text: el.innerText.trim(), w: r.width, right: r.right, vw: innerWidth, sw: el.scrollWidth, cw: el.clientWidth };
    });
    ok(v && v.text === NEW, `${tag}: visible open text = new (${v && v.text})`);
    ok(v && v.w > 0 && v.right <= v.vw && v.sw <= v.cw + 1, `${tag}: text wraps inside viewport (${JSON.stringify(v)})`);
    ok(!s.page.includes(OLD), `${tag}: old copy absent after open`);
    if (shotDir && label === 'wok+wor+row') {
      await b.scrollIntoViewIfNeeded();
      await p.waitForTimeout(300);
      await p.screenshot({ path: `${shotDir}/sa06ideal-e44-dossier-${name}.png` });
    }
    ok(errors.length === 0, `${tag}: no errors ${errors.join('|')}`);
    await p.close();
  }
  for (const [label, hash] of [
    ['RoW only', '#read=rhythm-of-war'],
    ['WoK+OB+DS+RoW', '#read=the-way-of-kings,oathbringer,dawnshard,rhythm-of-war'],
    ['legacy book=8', '#book=8'],
  ]) {
    const tag = `${name} ${label}`;
    const { p, errors } = await open(ctx, hash);
    await expand(p, mobile);
    const s = await st(p);
    ok(s.item === null, `${tag}: no e44 item (sel=${s.sel})`);
    ok(!s.page.includes(NEW) && !s.page.includes(OLD), `${tag}: no e44 text anywhere`);
    ok(errors.length === 0, `${tag}: no errors ${errors.join('|')}`);
    await p.close();
  }
  await ctx.close();
}
await browser.close();
console.log(`sa06ideal-probe: ${pass}/${pass + fail} pass`);
process.exit(fail ? 1 : 0);
