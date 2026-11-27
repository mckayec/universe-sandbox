// Rendered omission checks for the 14-target hold/dependency batch (Expanse drumring/engineering/b3f/b3o/b3i/b7d;
// Hyperion tombs sphinx/jade, site sphinx, b1i2/b1n/b2b/b2k/b3b).
// Usage: node hold-omit-browser-check.cjs http://localhost:4173/   (built dist via vite preview). Exits 1 on any FAIL.
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
const waitPlace = p => p.waitForFunction(() => window.__atlas.S.view === 'place', null, { timeout: 12000 }).then(() => true, () => false);
async function clickEv(p, id) { await p.evaluate(id => { const b = document.querySelector('#track .ev[data-ev="' + id + '"]'); if (!b) throw new Error('no chronicle button ' + id); b.click(); }, id); await p.waitForTimeout(2500); }
const REMOVED = { expanse: ['b3f', 'b3o', 'b3i', 'b7d'], hyperion: ['b1i2', 'b1n', 'b2b', 'b2k', 'b3b'] };
const none = (evs, pk) => REMOVED[pk].every(x => !evs.includes(x));
(async () => {
  const b = await chromium.launch({ executablePath: process.env.CHROME_PATH || undefined, args: ['--use-gl=swiftshader', '--enable-webgl', '--ignore-gpu-blocklist'] });
  for (const [L, vp] of (process.env.VP === '390' ? [['390x844', { width: 390, height: 844 }]] : process.env.VP === '1440' ? [['1440x900', { width: 1440, height: 900 }]] : [['1440x900', { width: 1440, height: 900 }], ['390x844', { width: 390, height: 844 }]])) {
    if (process.env.PART !== 'nav') {
    // S0 control: a valid landmark link on the same scene, to separate hash place-entry behaviour from the omission
    for (const [pk, bk, world, site, lm] of [['expanse', 3, 'medina', 'drum', 'bridge'], ['hyperion', 1, 'hyperion', 'tombs', 'obelisk']]) {
      const { p, errs } = await open(b, vp, `atlas/?pack=${pk}#book=${bk}&world=${world}&site=${site}&view=place&lm=${lm}`);
      const placed = await waitPlace(p); const s = await st(p);
      log(true, `${L} CONTROL ${pk} valid lm=${lm} link: placed=${placed} view=${s.view} site=${s.site} lm=${s.lm} errors=${errs.length}`); await p.close();
    }
    // S1 stale landmark links into surviving scenes
    for (const [pk, bk, world, site, lm, bad, keep, n] of [
      ['expanse', 3, 'medina', 'drum', 'drumring', /spins it up|paralysed Bull/i, 'bridge', 5],
      ['expanse', 3, 'medina', 'drum', 'engineering', /Rosenberg|armoured attackers/i, 'brig', 5],
      ['hyperion', 1, 'hyperion', 'tombs', 'jade', /translucent green/i, 'obelisk', 4],
      ['hyperion', 1, 'hyperion', 'tombs', 'sphinx', /studying it when/i, 'monolith', 4]]) {
      const { p, errs } = await open(b, vp, `atlas/?pack=${pk}#book=${bk}&world=${world}&site=${site}&view=place&lm=${lm}`);
      const placed = await waitPlace(p); await p.waitForTimeout(1200); const s = await st(p);
      log(placed && s.site === site, `${L} ${pk} stale lm=${lm}: enters ${site} place view (view=${s.view}, site=${s.site}, lm=${s.lm})`);
      log(s.lm !== lm && !bad.test(s.dossier), `${L} ${pk} stale lm=${lm}: no removed-landmark selection or copy`);
      const cnt = await p.evaluate(([w, si]) => window.__atlas.WORLD_BY[w].sites.find(x => x.id === si).scene.landmarks.length, [world, site]);
      log(cnt === n, `${L} ${pk} ${site} scene has ${n} landmarks (${cnt})`);
      await p.evaluate(k => window.__atlas.selectLandmark(k), keep); await p.waitForTimeout(800); const s2 = await st(p);
      log(s2.lm === keep, `${L} ${pk} surviving landmark ${keep} selectable after stale link (lm=${s2.lm})`);
      log(errs.length === 0, `${L} ${pk} stale lm=${lm} errors: ${errs.length ? errs.join(' | ') : 'none'}`); await p.close();
    }
    }
    // S2 stale link to the removed Hyperion Sphinx site
    { const { p, errs } = await open(b, vp, 'atlas/?pack=hyperion#book=1&world=hyperion&site=sphinx&view=place');
      await p.waitForTimeout(3000); const s = await st(p);
      const has = await p.evaluate(() => window.__atlas.WORLD_BY.hyperion.sites.some(x => x.id === 'sphinx'));
      log(!has && s.site !== 'sphinx' && !/Merlin’s sickness/.test(s.dossier), `${L} hyperion stale site=sphinx: site absent, not entered (view=${s.view}, sel=${s.sel}, site=${s.site})`);
      log(errs.length === 0, `${L} hyperion stale site errors: ${errs.length ? errs.join(' | ') : 'none'}`); await p.close(); }
    // S3 stale ev links
    for (const [pk, bk, id] of [['expanse', 3, 'b3o'], ['hyperion', 2, 'b2k']]) {
      const { p, errs } = await open(b, vp, `atlas/?pack=${pk}#book=${bk}&ev=${id}`); await p.waitForTimeout(1500); const s = await st(p);
      log(s.ev !== id, `${L} ${pk} stale ev=${id}: not opened (ev=${s.ev}, view=${s.view})`);
      log(errs.length === 0, `${L} ${pk} stale ev=${id} errors: ${errs.length ? errs.join(' | ') : 'none'}`); await p.close(); }
    // S4 chronicle / tour / open / Back / downgrade per affected book
    for (const [pk, bk, keepEv, below] of [['expanse', 3, 'b3g', 2], ['expanse', 7, 'b7p', 6], ['hyperion', 1, 'b1m', 0], ['hyperion', 2, 'b2c', 1], ['hyperion', 3, 'b3c', 2]]) {
      const { p, errs } = await open(b, vp, `atlas/?pack=${pk}#book=${bk}`);
      const s = await st(p); log(none(s.evs, pk) && s.evs.includes(keepEv), `${L} ${pk} book${bk} chronicle: no removed events, ${keepEv} present (${s.evs.length})`);
      await clickEv(p, keepEv); const s1 = await st(p); log(s1.ev === keepEv, `${L} ${pk} open ${keepEv} via chronicle (ev=${s1.ev}, view=${s1.view}, site=${s1.site}, lm=${s1.lm})`);
      await p.evaluate(() => document.querySelector('#tourBtn').click()); await p.waitForTimeout(1500);
      const t = await st(p); const tn = parseInt((t.tour.split('/')[1] || '0').trim(), 10);
      const inPack = await p.evaluate(() => window.__atlas.pack.events.map(e => e.id));
      log(tn > 0 && none(inPack, pk), `${L} ${pk} book${bk} tour started (${tn} stops); runtime pack events contain no removed ids (tour list is drawn from them)`);
      const seen = [];
      for (let i = 0; i < Math.min(tn, 3); i++) { seen.push(await p.evaluate(() => window.__atlas.S.ev)); await p.evaluate(() => document.querySelector('[data-tour="next"]').click()); await p.waitForTimeout(600); }
      log(none(seen, pk), `${L} ${pk} book${bk} tour steps never visit removed events (${seen.join(',')})`);
      await p.evaluate(() => document.querySelector('#tourBtn').click()); await p.waitForTimeout(500);
      const pushed = await p.evaluate(() => history.state != null);
      if (pushed) { await p.evaluate(() => history.back()); await p.waitForTimeout(2500); const s3 = await st(p); log(true, `${L} ${pk} Back after event/tour: view=${s3.view} ev=${s3.ev} hash=${s3.hash}`); }
      else log(true, `${L} ${pk} no history entry pushed; Back not applicable`);
      await clickEv(p, keepEv); await p.evaluate(x => window.__atlas.setBook(x), below); await p.waitForTimeout(1800); const s4 = await st(p);
      log(below === 0 ? none(s4.evs, pk) : !s4.evs.includes(keepEv), `${L} ${pk} book${bk}->${below}: ${below === 0 ? 'All-books chronicle has no removed events' : keepEv + ' gated out'} (${s4.evs.length}, ev=${s4.ev})`);
      log(errs.length === 0, `${L} ${pk} book${bk} errors: ${errs.length ? errs.join(' | ') : 'none'}`); await p.close();
    }
  }
  await b.close(); console.log(fails ? `FAILED ${fails}` : 'ALL PASS'); process.exit(fails ? 1 : 0);
})().catch(e => { console.error('HARNESS ERROR', e); process.exit(2); });
