// DWO-E2 follow-up: does a below-gate e70 stay open after tour Stop + downgrade to book 1 (1440x900)?
// v2 (DWO-E2-F1 fix check): counts a TRANSIENT leak at +1.5 s as well as a persistent one at +8 s; also checks the
// dossier/breadcrumb carry no Scadrial copy while the leave is in flight.
// Usage: node dwo-e2-downgrade-repro.cjs http://127.0.0.1:4173/ [runs]. Records state at +1.5 s and +8 s.
const { chromium } = require('playwright');
const base = process.argv[2] || 'http://127.0.0.1:4173/';
const runs = +(process.argv[3] || 2);
const st = p =>
  p.evaluate(() => {
    const A = window.__atlas;
    const P = A.PLACES && A.PLACES.place;
    const d = (document.querySelector('#dossier') || {}).textContent || '';
    return { view: A.S.view, site: A.S.site, ev: A.S.ev, book: A.S.book, hash: location.hash, rendered: P && P.site ? P.site.id : null,
      dossierHasE70: d.includes('Elend is deposed'), placeCopy: /Luthadel|Scadrial/.test(d + ((document.querySelector('#crumbs') || {}).textContent || '')), chronHasE70: !!document.querySelector('#track .ev[data-ev="e70"]') };
  });
(async () => {
  const b = await chromium.launch({ executablePath: process.env.CHROME_PATH || undefined, args: ['--use-gl=swiftshader', '--enable-webgl', '--ignore-gpu-blocklist', '--enable-unsafe-swiftshader'] });
  let leaks = 0, trans = 0;
  for (let r = 0; r < runs; r++) {
    const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
    await p.goto(base + 'atlas/?pack=cosmere#book=2&world=scadrial&view=surface', { waitUntil: 'domcontentloaded' });
    await p.waitForFunction(() => window.__atlas && window.__atlas.S.view === 'world', null, { timeout: 60000 });
    await p.evaluate(() => document.querySelector('#tourBtn').click());
    for (let i = 0; i < 30 && (await p.evaluate(() => document.querySelector('#tourT').textContent)) !== 'Elend is deposed'; i++) {
      await p.evaluate(() => document.querySelector('[data-tour="next"]').click());
      await p.waitForTimeout(120);
    }
    await p.evaluate(() => document.querySelector('[data-tour="pause"]').click());
    await p.waitForFunction(() => { const A = window.__atlas; const P = A.PLACES.place; return A.S.view === 'place' && A.S.ev === 'e70' && P && P.site && P.site.id === 'luthadel'; }, null, { timeout: 60000 });
    await p.evaluate(() => document.querySelector('[data-tour="stop"]').click());
    await p.evaluate(() => window.__atlas.setBook(1));
    await p.waitForTimeout(1500);
    const a = await st(p);
    await p.waitForTimeout(6500);
    const c = await st(p);
    for (let k = 0; k < 10; k++) { await p.waitForTimeout(2000); const z = await p.evaluate(() => ({ t: 10 + 0, view: window.__atlas.S.view, sel: window.__atlas.S.sel, hash: location.hash, crumbs: document.querySelector('#crumbs').textContent })); console.log('  +' + (10 + 2 * k) + 's', JSON.stringify(z)); }
    const leak = c.ev === 'e70' || c.dossierHasE70 || c.chronHasE70;
    if (leak) leaks++;
    const tl = a.ev === 'e70' || a.dossierHasE70 || a.chronHasE70 || a.placeCopy;
    if (tl) trans++;
    console.log(`run ${r + 1} +1.5s ${JSON.stringify(a)}\nrun ${r + 1} +8s   ${JSON.stringify(c)} ${leak ? 'LEAK' : 'clean'}`);
    await p.close();
  }
  await b.close();
  console.log(`persistent leaks ${leaks}/${runs}; transient leaks ${trans}/${runs}`);
  if (leaks || trans) process.exitCode = 1;
})().catch(e => { console.error('HARNESS ERROR', e); process.exit(2); });
