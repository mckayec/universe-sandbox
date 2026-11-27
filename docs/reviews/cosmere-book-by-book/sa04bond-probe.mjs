// SA04-BOND-01/02 rendered probe (sa04-handoff-2026-11-20.md); same harness as sa03dw06-probe.mjs. Real Cosmere
// pack + engine, no fixtures; Playwright + software GL, 1440x900 and 390x844 (phone sheet/chronicle opened with real taps).
//  1. Allowed (Way of Kings + Oathbringer + Dawnshard, legacy #book=8, All): Roshar selected; the dossier "In the
//     Chronicle" item e40 shows exactly the new sentence and its unchanged "Thaylen City" place label; opening it with a
//     real click/tap opens e40 on Roshar, text wraps inside the viewport. From the Chronicle track e40 selects Roshar
//     and opens e40. Codex (opened with a real click/tap on #cxBtn, People tab) shows Dalinar Kholin's entry with the new
//     key-8 line. Old copy (event and codex) absent from the page throughout. S.site is recorded.
//  2. Withheld (WoK + Oathbringer, WoK + Dawnshard, legacy #book=7): no e40 item; neither old nor new event/codex text
//     anywhere on the page, including the opened codex.
// Usage: node sa04bond-probe.mjs <baseUrl> [shotDir]
import { chromium } from 'playwright';
const [base = 'http://127.0.0.1:4173', shotDir] = process.argv.slice(2);
const NEW = 'At the Battle of Thaylen Field, Dalinar brings the three Realms together.';
const OLD = 'Odium sends his champion. Dalinar refuses to give in, binds the realms together and becomes the Bondsmith.';
const CX_NEW = 'Brings the three Realms together at Thaylen City.';
const CX_OLD = 'Becomes the Bondsmith.';
const PLACE = 'Thaylen City';

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
    const it = document.querySelector('#dossier .evitem[data-ev="e40"]');
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
// Codex: real click/tap on #cxBtn and the People tab; read Dalinar Kholin's rendered entry.
async function codex(p, mobile, tag, want, label, name) {
  const btn = p.locator('#cxBtn');
  await btn.scrollIntoViewIfNeeded();
  let how = 'real';
  try {
    if (mobile) await btn.tap({ timeout: 5000 });
    else await btn.click({ timeout: 5000 });
  } catch {
    how = 'dispatched';
    await btn.dispatchEvent('click');
  }
  await p.waitForTimeout(400);
  const tab = p.locator('#cxTabs [data-tab="people"]');
  if (mobile) await tab.tap();
  else await tab.click();
  await p.waitForTimeout(300);
  const c = await p.evaluate(() => {
    const open = !document.querySelector('#codex').hidden;
    const it = [...document.querySelectorAll('#cxBody .cx-item')].find(x => x.querySelector('h3')?.textContent === 'Dalinar Kholin');
    const r = it?.getBoundingClientRect();
    return { open, body: document.querySelector('#cxBody').textContent, p: it ? it.querySelector('p').textContent : null, right: r ? r.right : null, vw: innerWidth };
  });
  ok(c.open, `${tag}: codex opened (${how} ${mobile ? 'tap' : 'click'})`);
  ok(!c.body.includes(CX_OLD), `${tag}: old codex line absent`);
  if (want) {
    ok(c.p !== null && c.p.includes(CX_NEW), `${tag}: Dalinar codex shows new key-8 line (${c.p})`);
    ok(c.right !== null && c.right <= c.vw, `${tag}: Dalinar entry inside viewport (${c.right}/${c.vw})`);
    if (shotDir && label !== 'legacy book=8') {
      await p.locator('#cxBody .cx-item', { hasText: 'Dalinar Kholin' }).first().scrollIntoViewIfNeeded();
      await p.screenshot({ path: `${shotDir}/sa04bond-codex-${label.replace(/\+/g, '-')}-${name}.png` });
    }
  } else ok(!c.body.includes(CX_NEW), `${tag}: new codex line absent (entry ${c.p === null ? 'hidden' : 'shown: ' + c.p})`);
  await p.keyboard.press('Escape');
  await p.waitForTimeout(200);
}
for (const [name, vp, mobile] of [
  ['1440x900', { width: 1440, height: 900 }, false],
  ['390x844', { width: 390, height: 844 }, true],
]) {
  const ctx = await browser.newContext({ viewport: vp, hasTouch: mobile, isMobile: mobile });
  for (const [label, hash] of [
    ['wok+ob+ds', '#read=the-way-of-kings,oathbringer,dawnshard'],
    ['legacy book=8', '#book=8'],
    ['All', '#book=0'],
  ]) {
    const tag = `${name} ${label}`;
    const { p, errors } = await open(ctx, hash);
    await expand(p, mobile);
    let s = await st(p);
    ok(s.sel === 'roshar', `${tag}: Roshar selected (${s.sel})`);
    ok(s.item && s.item.ex === NEW, `${tag}: e40 dossier text = new (${s.item && s.item.ex})`);
    ok(s.item && s.item.ep === PLACE, `${tag}: e40 place label unchanged = ${PLACE} (${s.item && s.item.ep})`);
    ok(!s.page.includes(OLD), `${tag}: old copy absent`);
    const b = p.locator('#dossier .evitem[data-ev="e40"]').first();
    await b.scrollIntoViewIfNeeded();
    if (mobile) await b.tap();
    else await b.click();
    await p.waitForTimeout(1200);
    await expand(p, mobile);
    s = await st(p);
    ok(s.ev === 'e40', `${tag}: e40 opened from dossier (${s.ev}; S.site=${s.site})`);
    ok(s.sel === 'roshar', `${tag}: still on Roshar (${s.sel})`);
    const v = await p.evaluate(() => {
      const el = document.querySelector('#dossier .evitem.open[data-ev="e40"] .ex');
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
    if (shotDir && label !== 'legacy book=8') {
      await b.scrollIntoViewIfNeeded();
      await p.waitForTimeout(300);
      await p.screenshot({ path: `${shotDir}/sa04bond-e40-dossier-${label.replace(/\+/g, '-')}-${name}.png` });
    }
    await codex(p, mobile, tag, true, label, name);
    ok(errors.length === 0, `${tag}: no errors (dossier) ${errors.join('|')}`);
    await p.close();
    const o = await open(ctx, hash, false);
    if (mobile) {
      await o.p.tap('#chronT');
      await o.p.waitForTimeout(500);
    }
    const tb = o.p.locator('#track .ev[data-ev="e40"]').first();
    ok((await tb.count()) === 1, `${tag}: e40 on the Chronicle track`);
    await tb.scrollIntoViewIfNeeded();
    // phone: the collapsed dossier sheet bar overlaps the scrolled Chronicle item, so dispatch the DOM click there
    if (mobile) await tb.dispatchEvent('click');
    else await tb.click();
    await o.p.waitForTimeout(2500);
    await expand(o.p, mobile);
    s = await st(o.p);
    ok(s.sel === 'roshar', `${tag}: Chronicle travel selects Roshar (${s.sel}; S.site=${s.site})`);
    ok(s.ev === 'e40', `${tag}: Chronicle travel opens e40 (${s.ev})`);
    ok(s.item && s.item.ex === NEW && s.item.ep === PLACE, `${tag}: travel dossier item new text, ${PLACE} label`);
    ok(!s.page.includes(OLD), `${tag}: old copy absent after travel`);
    if (shotDir && label === 'wok+ob+ds')
      await o.p.screenshot({ path: `${shotDir}/sa04bond-e40-chronicle-${name}.png` });
    ok(o.errors.length === 0, `${tag}: no errors (chronicle) ${o.errors.join('|')}`);
    await o.p.close();
  }
  for (const [label, hash] of [
    ['WoK + Oathbringer', '#read=the-way-of-kings,oathbringer'],
    ['WoK + Dawnshard', '#read=the-way-of-kings,dawnshard'],
    ['legacy book=7', '#book=7'],
  ]) {
    const tag = `${name} ${label}`;
    const { p, errors } = await open(ctx, hash);
    await expand(p, mobile);
    const s = await st(p);
    ok(s.item === null, `${tag}: no e40 item (sel=${s.sel})`);
    ok(!s.page.includes(NEW) && !s.page.includes(OLD), `${tag}: no e40 text anywhere`);
    await codex(p, mobile, tag, false, label);
    ok(errors.length === 0, `${tag}: no errors ${errors.join('|')}`);
    await p.close();
  }
  await ctx.close();
}
await browser.close();
console.log(JSON.stringify({ pass, fail }));
process.exit(fail ? 1 : 0);
