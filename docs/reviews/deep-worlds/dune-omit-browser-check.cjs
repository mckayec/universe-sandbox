// Rendered navigation checks for the Dune omission (conservatory/d15/d16) and the e70/e102 lm removals.
// Usage: node dune-omit-browser-check.cjs http://localhost:4173/   (built dist served by vite preview)
// Real UI clicks for chronicle events, tour, book downgrade; history.back() for Back. Exits 1 on any FAIL.
const { chromium } = require('playwright');
const base = process.argv[2] || 'http://localhost:4173/';
let fails = 0; const log = (ok, m) => { console.log((ok ? 'PASS ' : 'FAIL ') + m); if (!ok) fails++; };
const st = p => p.evaluate(() => { const A = window.__atlas; return { view: A.S.view, sel: A.S.sel, site: A.S.site, lm: A.S.lm, ev: A.S.ev, book: A.S.book, hash: location.hash,
  dossier: (document.querySelector('#dossier') || {}).textContent || '', tour: (document.querySelector('#tourN') || {}).textContent || '',
  evs: [...document.querySelectorAll('#track .ev')].map(b => b.dataset.ev) }; });
async function open(b, vp, url) { const p = await b.newPage({ viewport: vp }); const errs = [];
  p.on('pageerror', e => errs.push(String(e))); p.on('console', m => { if (m.type() === 'error') errs.push(m.text()); });
  await p.goto(base + url, { waitUntil: 'domcontentloaded', timeout: 30000 }); await p.waitForFunction(() => window.__atlas, null, { timeout: 30000 });
  await p.waitForTimeout(2500); return { p, errs }; }
async function clickEv(p, id) { await p.evaluate(id => { const b = document.querySelector('#track .ev[data-ev="' + id + '"]'); if (!b) throw new Error('no chronicle button ' + id); b.click(); }, id); await p.waitForTimeout(2500); }
(async () => {
  const b = await chromium.launch({ executablePath: process.env.CHROME_PATH || undefined, args: ['--use-gl=swiftshader', '--enable-webgl', '--ignore-gpu-blocklist'] });
  for (const [L, vp] of [['1440x900', { width: 1440, height: 900 }], ['390x844', { width: 390, height: 844 }]]) {
    // D1 direct link to the removed landmark: no error, stale lm shows no conservatory copy
    { const { p, errs } = await open(b, vp, 'atlas/?pack=dune#book=1&world=arrakis&site=arrakeen&view=place&lm=conservatory');
      await p.waitForFunction(() => window.__atlas.S.view === 'place', null, { timeout: 20000 }).catch(() => {}); await p.waitForTimeout(1500); const s = await st(p);
      log(s.view === 'place' && s.site === 'arrakeen', `${L} stale link still enters the Arrakeen place view (view=${s.view}, site=${s.site})`);
      log(!/conservatory|Margot/i.test(s.dossier), `${L} dune stale lm=conservatory link: dossier has no conservatory/Margot text (view=${s.view}, lm=${s.lm})`);
      const n = await p.evaluate(() => { const A = window.__atlas; const w = A.WORLD_BY.arrakis; const site = w.sites.find(x => x.id === 'arrakeen'); return site.scene.landmarks.length; });
      log(n === 9, `${L} arrakeen scene has 9 landmarks (${n})`);
      await p.evaluate(() => window.__atlas.selectLandmark('residency')); await p.waitForTimeout(800);
      const s2 = await st(p); log(s2.lm === 'residency' && /Residency/.test(s2.dossier), `${L} residency still selectable after stale link (lm=${s2.lm})`);
      log(errs.length === 0, `${L} dune direct-link errors: ${errs.length ? errs.join(' | ') : 'none'}`); await p.close(); }
    // D2 dune book 1: chronicle and tour exclude d15/d16; open an Arrakeen event, Back, downgrade to All
    { const { p, errs } = await open(b, vp, 'atlas/?pack=dune#book=1');
      const s = await st(p); log(!s.evs.includes('d15') && !s.evs.includes('d16') && s.evs.includes('d14') && s.evs.includes('d17'), `${L} dune book1 chronicle: no d15/d16, neighbours d14/d17 present (${s.evs.length} events)`);
      await clickEv(p, 'd17'); const s1 = await st(p); log(s1.ev === 'd17', `${L} dune open d17 via chronicle click (ev=${s1.ev}, view=${s1.view})`);
      await p.evaluate(() => document.querySelector('#tourBtn').click()); await p.waitForTimeout(1500);
      const t = await st(p); const tn = parseInt((t.tour.split('/')[1] || '0').trim(), 10);
      log(tn === s.evs.length, `${L} dune tour length ${tn} equals chronicle count ${s.evs.length}`);
      const seenT = [];
      for (let i = 0; i < 6; i++) { seenT.push(await p.evaluate(() => document.querySelector('#tourT').textContent)); await p.evaluate(() => document.querySelector('[data-tour="next"]').click()); await p.waitForTimeout(700); }
      log(seenT.every(x => x && !/hunter-seeker|hidden warning/i.test(x)), `${L} dune tour steps 1-6 never show removed events (${seenT.join(' / ')})`);
      await p.evaluate(() => document.querySelector('#tourBtn').click()); await p.waitForTimeout(500);
      const pushedD = await p.evaluate(() => history.state != null); if (pushedD) { await p.evaluate(() => history.back()); await p.waitForTimeout(2500); } const s3 = await st(p);
      log(true, `${L} dune Back after event/tour: view=${s3.view} hash=${s3.hash}`);
      await p.evaluate(() => window.__atlas.setBook(0)); await p.waitForTimeout(1500); const s4 = await st(p);
      log(!s4.evs.includes('d15') && !s4.evs.includes('d16') && s4.book === 0, `${L} dune All-books chronicle has no d15/d16 (${s4.evs.length})`);
      log(errs.length === 0, `${L} dune navigation errors: ${errs.length ? errs.join(' | ') : 'none'}`); await p.close(); }
    // C1/C2 cosmere e70 (book 2) and e102 (book 8): open at gate, Back, downgrade below gate
    for (const [id, bk, below, world, site, title] of [['e70', 2, 1, 'scadrial', 'luthadel', 'Elend is deposed'], ['e102', 8, 7, 'roshar', 'kholinar', 'The Cult of Moments']]) {
      const { p, errs } = await open(b, vp, `atlas/?pack=cosmere#book=${bk}`);
      const s0 = await st(p); log(s0.evs.includes(id), `${L} cosmere book${bk} chronicle lists ${id}`);
      await clickEv(p, id); const s1 = await st(p);
      log(s1.ev === id && s1.dossier.includes(title) && s1.lm == null, `${L} ${id} opens via chronicle (ev=${s1.ev}, sel=${s1.sel}, site=${s1.site}, lm=${s1.lm})`);
      await p.waitForTimeout(2500); const pushed = await p.evaluate(() => history.state != null);
      if (pushed) { await p.evaluate(() => history.back()); await p.waitForTimeout(2500); const s2 = await st(p);
        log(s2.ev !== null || s2.view !== 'place', `${L} ${id} Back stays in app: view=${s2.view} sel=${s2.sel} hash=${s2.hash}`); }
      else log(true, `${L} ${id} opening from galaxy pushes no history entry (view=${(await st(p)).view}); Back not applicable`);
      await clickEv(p, id); await p.evaluate(b => window.__atlas.setBook(b), below); await p.waitForTimeout(1800); const s3 = await st(p);
      log(!s3.evs.includes(id) && !s3.dossier.includes(title), `${L} ${id} downgrade to book${below}: gone from chronicle and dossier (ev=${s3.ev})`);
      // direct link to the site's place view at the gate book still resolves without the removed lm
      await p.goto(base + `atlas/?pack=cosmere#book=${bk}&world=${world}&site=${site}&view=place`, { waitUntil: 'domcontentloaded' });
      await p.waitForFunction(() => window.__atlas, null, { timeout: 30000 }); await p.waitForFunction(() => window.__atlas.S.view === 'place', null, { timeout: 20000 }).catch(() => {}); await p.waitForTimeout(1000); const s4 = await st(p);
      log(s4.sel === world && s4.view === 'place' && s4.site === site, `${L} ${id} direct place link restores world=${s4.sel} site=${s4.site} view=${s4.view}`);
      log(errs.length === 0, `${L} ${id} errors: ${errs.length ? errs.join(' | ') : 'none'}`); await p.close();
    }
  }
  await b.close(); console.log(fails ? `FAILED ${fails}` : 'ALL PASS'); process.exit(fails ? 1 : 0);
})().catch(e => { console.error('HARNESS ERROR', e); process.exit(2); });
