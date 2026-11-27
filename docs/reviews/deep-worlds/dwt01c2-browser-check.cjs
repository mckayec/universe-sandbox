// DWT-01c(2) rendered check (SwiftShader). Serves public/ of parent 3621250 (4174) and fix (4175):
//   python3 -m http.server 4174 -d <parent>/public & python3 -m http.server 4175 -d <fix>/public &
//   SHOTS=<dir> node (run outside the repo so the preinstalled Playwright/Chromium is used; 640x400 viewport —
//   larger SwiftShader viewports starved the page in this container) dwt01c2-browser-check.cjs
// Opens Dune book 1 inside Castle Caladan, then via window.__atlas.enterPlace (API calls, NOT the Tour Stop button)
// requests Paddies (ownership A), at 100 ms requests Castle again (ownership B), at 200 ms revokes both (what Stop does).
// Asserts after 4 s: state site, hash site and the rendered place all name castle. Controls: 'chain3' adds a third
// request (Paddies) before revoking; 'positive' keeps ownership so the latest request (Castle→Paddies→Castle... ends Paddies).
const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch({ args: ['--use-gl=swiftshader', '--enable-webgl', '--ignore-gpu-blocklist', '--enable-unsafe-swiftshader'] });
  let fails = 0;
  for (const [port, label] of [['4174', 'PARENT-3621250'], ['4175', 'FIX']]) {
    for (const mode of ['overlap-stop', 'chain3-stop', 'positive']) {
      const cx = await b.newContext({ viewport: { width: 640, height: 400 }, serviceWorkers: 'block' }); const p = await cx.newPage();
      const errs = []; p.on('pageerror', e => errs.push(e.message));
      await p.goto('http://127.0.0.1:' + port + '/atlas/?pack=dune#book=1&world=caladan&site=castle&view=place', { waitUntil: 'commit' });
      await p.waitForFunction(() => window.__atlas && window.__atlas.S.view === 'place', null, { timeout: 90000 });
      await p.waitForTimeout(2500);
      const r = await p.evaluate(async mode => {
        const A = window.__atlas; const own = { a: true, b: true, c: true };
        A.enterPlace('paddies', false, null, () => own.a);
        await new Promise(res => setTimeout(res, 100));
        A.enterPlace('castle', false, null, () => own.b);
        if (mode === 'chain3-stop') { await new Promise(res => setTimeout(res, 100)); A.enterPlace('paddies', false, null, () => own.c); }
        if (mode !== 'positive') setTimeout(() => { own.a = own.b = own.c = false; }, 100);
        await new Promise(res => setTimeout(res, 4000));
        const P = A.PLACES && A.PLACES.place;
        return { view: A.S.view, site: A.S.site, hash: location.hash, histPlace: !!(history.state && history.state.atlasPlace),
          rendered: P && (P.s ? P.s.id : P.site ? P.site.id : P.id) || null };
      }, mode);
      if (process.env.SHOTS) await p.screenshot({ path: process.env.SHOTS + '/dwt01c2-' + label + '-' + mode + '.png' });
      const want = 'castle';
      const ok = r.view === 'place' && r.site === want && /site=castle/.test(r.hash) && (r.rendered == null || r.rendered === want);
      if (label === 'FIX' && !ok) fails++;
      console.log(ok ? 'CONSISTENT' : 'MISMATCH', label, mode, JSON.stringify(r), 'pageerrors:', errs.length);
      await cx.close();
    }
  }
  await b.close();
  console.log('FIX mismatches:', fails); process.exitCode = fails ? 1 : 0;
})();
