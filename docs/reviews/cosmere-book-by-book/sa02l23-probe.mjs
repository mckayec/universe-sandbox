// SA02-L23-PORT rendered probe (sa02-final-handoff-2026-11-20.md); same harness as sa01geo-probe.mjs. Real Cosmere
// pack + engine, no fixtures; Playwright + software GL, 1440x900 and 390x844 (phone sheet/chronicle opened with real taps).
//  1. Allowed (Way of Kings + Words of Radiance, legacy #book=5, All): Roshar selected; the dossier "In the Chronicle"
//     item e24 shows exactly the new qualified text and no place label; opening it with a real click/tap keeps
//     S.site null (no Narak, no invented palace) and the text wraps inside the viewport. From the Chronicle track
//     (travel path) e24 selects Roshar and leaves S.site null. Old copy absent from the page throughout.
//  2. Withheld (Way of Kings only, Words of Radiance only, legacy #book=4): no e24 item; neither old nor new text.
// Usage: node sa02l23-probe.mjs <baseUrl> [shotDir]
import { chromium } from 'playwright';
const [base = 'http://127.0.0.1:4173', shotDir] = process.argv.slice(2);
const NEW =
  'At the king’s palace in the warcamps, Kaladin speaks his Third Ideal while protecting Elhokar. Location is provisional, based on Tor.com’s chapter rereads rather than a checked edition of the novel.';
const OLD = 'Kaladin swears to protect even those he hates, and flies.';
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
    const it = document.querySelector('#dossier .evitem[data-ev="e24"]');
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
    ['wok+wor', '#read=the-way-of-kings,words-of-radiance'],
    ['legacy book=5', '#book=5'],
    ['All', '#book=0'],
  ]) {
    const tag = `${name} ${label}`;
    // dossier path
    const { p, errors } = await open(ctx, hash);
    await expand(p, mobile);
    let s = await st(p);
    ok(s.sel === 'roshar', `${tag}: Roshar selected (${s.sel})`);
    ok(s.item && s.item.ex === NEW, `${tag}: e24 dossier text = new (${s.item && s.item.ex})`);
    ok(s.item && s.item.ep === null, `${tag}: e24 has no place label (${s.item && s.item.ep})`);
    ok(!s.page.includes(OLD), `${tag}: old copy absent`);
    const b = p.locator('#dossier .evitem[data-ev="e24"]').first();
    await b.scrollIntoViewIfNeeded();
    if (mobile) await b.tap();
    else await b.click();
    await p.waitForTimeout(1200);
    await expand(p, mobile);
    s = await st(p);
    ok(s.ev === 'e24', `${tag}: e24 opened from dossier (${s.ev})`);
    ok(s.site === null, `${tag}: no site selected after dossier open (${s.site})`);
    ok(s.sel === 'roshar', `${tag}: still on Roshar (${s.sel})`);
    const v = await p.evaluate(() => {
      const el = document.querySelector('#dossier .evitem.open[data-ev="e24"] .ex');
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
    });
    ok(v && v.text === NEW, `${tag}: visible open text = new (${v && v.text})`);
    ok(
      v && v.w > 0 && v.right <= v.vw && v.sw <= v.cw + 1,
      `${tag}: text wraps inside viewport (${JSON.stringify(v)})`,
    );
    ok(!s.page.includes(OLD), `${tag}: old copy absent after open`);
    if (shotDir && label !== 'legacy book=5') {
      await b.scrollIntoViewIfNeeded();
      await p.waitForTimeout(300);
      await p.screenshot({ path: `${shotDir}/sa02l23-e24-dossier-${label.replace('+', '-')}-${name}.png` });
    }
    ok(errors.length === 0, `${tag}: no errors (dossier) ${errors.join('|')}`);
    await p.close();
    // chronicle (travel) path from the galaxy view, nothing selected first
    const o = await open(ctx, hash, false);
    if (mobile) {
      await o.p.tap('#chronT');
      await o.p.waitForTimeout(500);
    }
    const tb = o.p.locator('#track .ev[data-ev="e24"]').first();
    ok((await tb.count()) === 1, `${tag}: e24 on the Chronicle track`);
    await tb.scrollIntoViewIfNeeded();
    // phone: the collapsed dossier sheet bar overlaps the scrolled Chronicle item, so dispatch the DOM click there
    if (mobile) await tb.dispatchEvent('click');
    else await tb.click();
    await o.p.waitForTimeout(2500);
    await expand(o.p, mobile);
    s = await st(o.p);
    ok(s.sel === 'roshar', `${tag}: Chronicle travel selects Roshar (${s.sel})`);
    ok(s.site === null, `${tag}: Chronicle travel selects no site (${s.site})`);
    ok(s.ev === 'e24', `${tag}: Chronicle travel opens e24 (${s.ev})`);
    ok(s.item && s.item.ex === NEW && s.item.ep === null, `${tag}: travel dossier item new text, no place label`);
    if (shotDir && label === 'wok+wor') await o.p.screenshot({ path: `${shotDir}/sa02l23-e24-chronicle-${name}.png` });
    ok(o.errors.length === 0, `${tag}: no errors (chronicle) ${o.errors.join('|')}`);
    await o.p.close();
  }
  for (const [label, hash] of [
    ['Way of Kings only', '#read=the-way-of-kings'],
    ['Words of Radiance only', '#read=words-of-radiance'],
    ['legacy book=4', '#book=4'],
  ]) {
    const tag = `${name} ${label}`;
    const { p, errors } = await open(ctx, hash);
    await expand(p, mobile);
    const s = await st(p);
    ok(s.item === null, `${tag}: no e24 item (sel=${s.sel})`);
    ok(!s.page.includes(NEW) && !s.page.includes(OLD), `${tag}: no e24 text anywhere`);
    ok(errors.length === 0, `${tag}: no errors ${errors.join('|')}`);
    await p.close();
  }
  await ctx.close();
}
await browser.close();
console.log(JSON.stringify({ pass, fail }));
process.exit(fail ? 1 : 0);
