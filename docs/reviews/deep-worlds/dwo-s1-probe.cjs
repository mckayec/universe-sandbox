// DWO-S1: a site id the selected world does not have (stale link, or removed site) must not stay in state or URL.
// Usage: node dwo-s1-probe.cjs http://localhost:4173/  [VP=1440|390]. Exits 1 on any FAIL.
// Positive (must hold at the fix head, fails at parent 68d47ce): stale site=sphinx links (surface + place) and a
// direct selectSite of an unknown id leave S.site null and no site= in the hash. Negative control: a valid site
// (tombs) is kept in state and hash, and a valid place link still selects it.
const { chromium } = require('playwright');
const base = process.argv[2] || 'http://localhost:4173/';
let fails = 0; const log = (ok, m) => { console.log((ok ? 'PASS ' : 'FAIL ') + m); if (!ok) fails++; };
const st = p => p.evaluate(() => { const A = window.__atlas; return { view: A.S.view, sel: A.S.sel, site: A.S.site, lm: A.S.lm, hash: location.hash,
  dossier: (document.querySelector('#dossier') || {}).textContent || '' }; });
async function open(b, vp, url) { const p = await b.newPage({ viewport: vp }); const errs = [];
  p.on('pageerror', e => errs.push(String(e))); p.on('console', m => { if (m.type() === 'error') errs.push(m.text()); });
  await p.goto(base + url, { waitUntil: 'domcontentloaded', timeout: 30000 }); await p.waitForFunction(() => window.__atlas, null, { timeout: 30000 });
  return { p, errs }; }
const waitSite = (p, ms) => p.waitForFunction(() => window.__atlas.S.view === 'world' && window.__atlas.S.sel === 'hyperion', null, { timeout: 15000 })
  .then(() => p.waitForTimeout(ms), () => false);
(async () => {
  const b = await chromium.launch({ executablePath: process.env.CHROME_PATH || undefined, args: ['--use-gl=swiftshader', '--enable-webgl', '--ignore-gpu-blocklist'] });
  const vps = process.env.VP === '390' ? [['390x844', { width: 390, height: 844 }]] : process.env.VP === '1440' ? [['1440x900', { width: 1440, height: 900 }]]
    : [['1440x900', { width: 1440, height: 900 }], ['390x844', { width: 390, height: 844 }]];
  for (const [L, vp] of vps) {
    for (const view of ['surface', 'place']) {
      const { p, errs } = await open(b, vp, `atlas/?pack=hyperion#book=1&world=hyperion&site=sphinx&view=${view}`);
      await waitSite(p, 3500); const s = await st(p);
      log(s.sel === 'hyperion' && s.view === 'world', `${L} stale site=sphinx view=${view}: lands on hyperion surface (view=${s.view}, sel=${s.sel})`);
      log(s.site == null, `${L} stale site=sphinx view=${view}: S.site cleared (site=${s.site})`);
      log(!/site=sphinx/.test(s.hash), `${L} stale site=sphinx view=${view}: hash has no site=sphinx (${s.hash})`);
      log(errs.length === 0, `${L} stale site=sphinx view=${view}: 0 page errors (${errs.length})`);
      // direct API call with an unknown id, then a valid one (negative control in the same page)
      await p.evaluate(() => window.__atlas.selectSite('no-such-site')); await p.waitForTimeout(300); const s2 = await st(p);
      log(s2.site == null && !/site=no-such-site/.test(s2.hash), `${L} selectSite(unknown) keeps no id (site=${s2.site}, hash=${s2.hash})`);
      await p.evaluate(() => window.__atlas.selectSite('tombs')); await p.waitForTimeout(300); const s3 = await st(p);
      log(s3.site === 'tombs' && /site=tombs/.test(s3.hash), `${L} CONTROL selectSite(tombs) kept (site=${s3.site}, hash=${s3.hash})`);
      await p.close();
    }
    const { p, errs } = await open(b, vp, 'atlas/?pack=hyperion#book=1&world=hyperion&site=tombs&view=surface');
    await waitSite(p, 3500); const s = await st(p);
    log(s.site === 'tombs' && /site=tombs/.test(s.hash) && errs.length === 0, `${L} CONTROL valid site=tombs link kept (site=${s.site}, hash=${s.hash}, errors=${errs.length})`);
    await p.close();
  }
  await b.close(); console.log(fails ? `RESULT ${fails} FAIL` : 'RESULT all pass'); process.exit(fails ? 1 : 0);
})().catch(e => { console.error('HARNESS ERROR', e); process.exit(2); });
