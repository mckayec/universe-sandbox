// SA03-DW06-PORT rendered probe (sa03-handoff-2026-11-20.md); same harness as sa02l23-probe.mjs. Real Cosmere
// pack + engine, no fixtures; Playwright + software GL, 1440x900 and 390x844 (phone sheet/chronicle opened with real taps).
//  1. Allowed (Way of Kings + all 13 bucket-7 works, legacy #book=7, All): Roshar selected; the dossier "In the
//     Chronicle" item e35 shows exactly the new journey sentence and its unchanged "Yeddaw" place label; opening it
//     with a real click/tap opens e35 on Roshar and the text wraps inside the viewport. From the Chronicle track
//     (travel path) e35 selects Roshar and opens e35. Old copy absent from the page throughout. S.site is recorded.
//  2. Withheld (Way of Kings + Edgedancer, Way of Kings + bucket 7 minus Edgedancer, legacy #book=6): no e35 item;
//     neither old nor new text anywhere on the page.
// Usage: node sa03dw06-probe.mjs <baseUrl> [shotDir]
import { chromium } from 'playwright';
const [base = 'http://127.0.0.1:4173', shotDir] = process.argv.slice(2);
const NEW = 'Lift travels to Yeddaw in Tashikk, where Darkness has been reported.';
const OLD = 'Lift crosses to Tashikk to protect a man the Herald Nale wants dead.';
const B7 = [
  'the-hope-of-elantris', 'the-emperors-soul', 'the-eleventh-metal', 'allomancer-jak-and-the-pits-of-eltania',
  'mistborn-secret-history', 'edgedancer', 'white-sand-volume-1', 'white-sand-volume-2', 'white-sand-volume-3',
  'white-sand-omnibus', 'shadows-for-silence-in-the-forests-of-hell', 'sixth-of-the-dusk',
  'arcanum-unbounded-system-essays-and-maps',
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
async function open(ctx, hash, world = true) {
  const p = await ctx.newPage();
  const errors = [];
  p.on('pageerror', e => errors.push(String(e)));
  p.on('console', m => m.type() === 'error' && errors.push(m.text()));
  await p.goto(base + '/atlas/index.html?pack=cosmere' + hash);
  await p.waitForFunction(() => !!window.__atlas, null, { timeout: 120000, polling: 250 });
  await p.waitForTimeout(600);
  if (world) {
    await p.evaluate(() => window.__atlas.selectWorld('roshar'));
    await p.waitForTimeout(400);
  }
  return { p, errors };
}
const st = p =>
  p.evaluate(() => {
    const it = document.querySelector('#dossier .evitem[data-ev="e35"]');
    return {
      sel: window.__atlas.S.sel,
      site: window.__atlas.S.site,
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
    ['wok+bucket7', '#read=the-way-of-kings,' + B7.join(',')],
    ['legacy book=7', '#book=7'],
    ['All', '#book=0'],
  ]) {
    const tag = `${name} ${label}`;
    const { p, errors } = await open(ctx, hash);
    await expand(p, mobile);
    let s = await st(p);
    ok(s.sel === 'roshar', `${tag}: Roshar selected (${s.sel})`);
    ok(s.item && s.item.ex === NEW, `${tag}: e35 dossier text = new (${s.item && s.item.ex})`);
    ok(s.item && s.item.ep === 'Yeddaw', `${tag}: e35 place label unchanged = Yeddaw (${s.item && s.item.ep})`);
    ok(!s.page.includes(OLD), `${tag}: old copy absent`);
    const b = p.locator('#dossier .evitem[data-ev="e35"]').first();
    await b.scrollIntoViewIfNeeded();
    if (mobile) await b.tap();
    else await b.click();
    await p.waitForTimeout(1200);
    await expand(p, mobile);
    s = await st(p);
    ok(s.ev === 'e35', `${tag}: e35 opened from dossier (${s.ev}; S.site=${s.site})`);
    ok(s.sel === 'roshar', `${tag}: still on Roshar (${s.sel})`);
    const v = await p.evaluate(() => {
      const el = document.querySelector('#dossier .evitem.open[data-ev="e35"] .ex');
      if (!el) return null;
      const r = el.getBoundingClientRect();
      return { text: el.innerText.trim(), w: r.width, right: r.right, vw: innerWidth, sw: el.scrollWidth, cw: el.clientWidth };
    });
    ok(v && v.text === NEW, `${tag}: visible open text = new (${v && v.text})`);
    ok(v && v.w > 0 && v.right <= v.vw && v.sw <= v.cw + 1, `${tag}: text wraps inside viewport (${JSON.stringify(v)})`);
    ok(!s.page.includes(OLD), `${tag}: old copy absent after open`);
    if (shotDir && label !== 'legacy book=7') {
      await b.scrollIntoViewIfNeeded();
      await p.waitForTimeout(300);
      await p.screenshot({ path: `${shotDir}/sa03dw06-e35-dossier-${label.replace('+', '-')}-${name}.png` });
    }
    ok(errors.length === 0, `${tag}: no errors (dossier) ${errors.join('|')}`);
    await p.close();
    const o = await open(ctx, hash, false);
    if (mobile) {
      await o.p.tap('#chronT');
      await o.p.waitForTimeout(500);
    }
    const tb = o.p.locator('#track .ev[data-ev="e35"]').first();
    ok((await tb.count()) === 1, `${tag}: e35 on the Chronicle track`);
    await tb.scrollIntoViewIfNeeded();
    // phone: the collapsed dossier sheet bar overlaps the scrolled Chronicle item, so dispatch the DOM click there
    if (mobile) await tb.dispatchEvent('click');
    else await tb.click();
    await o.p.waitForTimeout(2500);
    await expand(o.p, mobile);
    s = await st(o.p);
    ok(s.sel === 'roshar', `${tag}: Chronicle travel selects Roshar (${s.sel}; S.site=${s.site})`);
    ok(s.ev === 'e35', `${tag}: Chronicle travel opens e35 (${s.ev})`);
    ok(s.item && s.item.ex === NEW && s.item.ep === 'Yeddaw', `${tag}: travel dossier item new text, Yeddaw label`);
    ok(!s.page.includes(OLD), `${tag}: old copy absent after travel`);
    if (shotDir && label === 'wok+bucket7') await o.p.screenshot({ path: `${shotDir}/sa03dw06-e35-chronicle-${name}.png` });
    ok(o.errors.length === 0, `${tag}: no errors (chronicle) ${o.errors.join('|')}`);
    await o.p.close();
  }
  for (const [label, hash] of [
    ['WoK + Edgedancer', '#read=the-way-of-kings,edgedancer'],
    ['WoK + bucket 7 minus Edgedancer', '#read=the-way-of-kings,' + B7.filter(x => x !== 'edgedancer').join(',')],
    ['legacy book=6', '#book=6'],
  ]) {
    const tag = `${name} ${label}`;
    const { p, errors } = await open(ctx, hash);
    await expand(p, mobile);
    const s = await st(p);
    ok(s.item === null, `${tag}: no e35 item (sel=${s.sel})`);
    ok(!s.page.includes(NEW) && !s.page.includes(OLD), `${tag}: no e35 text anywhere`);
    ok(errors.length === 0, `${tag}: no errors ${errors.join('|')}`);
    await p.close();
  }
  await ctx.close();
}
await browser.close();
console.log(JSON.stringify({ pass, fail }));
process.exit(fail ? 1 : 0);
