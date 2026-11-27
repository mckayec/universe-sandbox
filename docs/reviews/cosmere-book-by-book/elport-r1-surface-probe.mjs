// EL-PORT-R1 rendered surface probe. Real Cosmere pack (all books, no synthetic registry). On Sel's SURFACE with
// a place selected (null / chasm / kae), click the actual chronicle track item for e4 (track listener ->
// openEvent(id,true)), then read the selected place, breadcrumb tail, URL hash and the highlighted surface label.
// Controls: e2 travel (pinned, kae) and a non-travel dossier click on e4. Uses window.__HD=256 (existing
// test-only hook) so the HD bake finishes under software GL. Prints one JSON line per case; saves screenshots.
// Usage: node elport-r1-surface-probe.mjs <baseUrl> <shotDir>   (CHROME_PATH optional)
import { chromium } from 'playwright';
const [base = 'http://127.0.0.1:4173', shots = '.'] = process.argv.slice(2);
const browser = await chromium.launch({
  executablePath: process.env.CHROME_PATH || undefined,
  args: ['--use-gl=swiftshader', '--enable-webgl', '--ignore-gpu-blocklist'],
});
let pass = 0,
  fail = 0,
  VPN = '';
const ok = (c, msg, extra) => {
  c ? pass++ : fail++;
  console.log(JSON.stringify({ pass: !!c, case: VPN + ' ' + msg, ...(extra || {}) }));
};
async function open(site, vp, mobile) {
  const ctx = await browser.newContext({ viewport: vp, hasTouch: mobile, isMobile: mobile });
  await ctx.addInitScript(() => {
    window.__HD = 256;
  });
  const p = await ctx.newPage();
  const errors = [];
  p.on('pageerror', e => errors.push(String(e)));
  p.on('console', m => m.type() === 'error' && errors.push(m.text()));
  await p.goto(base + '/atlas/index.html?pack=cosmere#world=sel&view=surface' + (site ? '&site=' + site : ''));
  await p.waitForFunction(() => !!window.__atlas, null, { timeout: 120000, polling: 250 });
  await p.waitForFunction(() => window.__atlas.S.view === 'world' && !!window.__atlas.PL, null, {
    timeout: 180000,
    polling: 250,
  });
  await p.evaluate(() => document.querySelector('#splash')?.classList.add('out'));
  if (site) await p.waitForFunction(s => window.__atlas.S.site === s, site, { timeout: 30000, polling: 200 });
  await p.waitForTimeout(600);
  return { ctx, p, errors };
}
const read = p =>
  p.evaluate(() => {
    const here = [...document.querySelectorAll('#crumbs .here')].map(x => x.textContent);
    return {
      site: window.__atlas.S.site,
      ev: window.__atlas.S.ev,
      sel: window.__atlas.S.sel,
      view: window.__atlas.S.view,
      crumbTail: here.at(-1) || '',
      hash: decodeURIComponent(location.hash),
      selLabels: [...document.querySelectorAll('.sel')].map(x => x.textContent.trim().slice(0, 30)).filter(Boolean),
    };
  });
const clickTrack = (p, id) =>
  p.evaluate(i => {
    const b = document.querySelector('#track .ev[data-ev="' + i + '"]');
    if (!b) return false;
    b.click();
    return true;
  }, id);

for (const [vpName, vp, mobile] of [
  ['1440x900', { width: 1440, height: 900 }, false],
  ['390x844', { width: 390, height: 844 }, true],
]) {
  VPN = vpName;
  const selName = 'Sel';
  for (const site of [null, 'chasm', 'kae']) {
    const o = await open(site, vp, mobile);
    const before = await read(o.p);
    const clicked = await clickTrack(o.p, 'e4');
    await o.p.waitForTimeout(1500);
    const r = await read(o.p);
    ok(
      clicked &&
        r.ev === 'e4' &&
        r.site === null &&
        r.view === 'world' &&
        r.sel === 'sel' &&
        r.crumbTail === selName &&
        !/site=/.test(r.hash),
      `e4 track travel from site=${site}`,
      { before: before.site, after: r },
    );
    ok(o.errors.length === 0, `no page/console errors (site=${site})`, { errors: o.errors.slice(0, 3) });
    if (site === 'chasm')
      await o.p.screenshot({ path: `${shots}/el-port-r1-e4-from-chasm-${vpName}.jpg`, type: 'jpeg', quality: 70 });
    await o.ctx.close();
  }
  {
    const o = await open('chasm', vp, mobile);
    await clickTrack(o.p, 'e2');
    await o.p.waitForTimeout(1500);
    const r = await read(o.p);
    ok(r.site === 'kae' && /site=kae/.test(r.hash), 'control: pinned e2 travel selects Kae', { after: r });
    await o.ctx.close();
  }
  {
    const o = await open('chasm', vp, mobile);
    await o.p.evaluate(() => window.__atlas.openEvent('e4', false));
    await o.p.waitForTimeout(500);
    const r = await read(o.p);
    ok(r.site === 'chasm' && r.ev === 'e4', 'control: non-travel e4 dossier click keeps Chasm', { after: r });
    await o.ctx.close();
  }
}
console.log(JSON.stringify({ pass, fail }));
await browser.close();
process.exit(fail ? 1 : 0);
