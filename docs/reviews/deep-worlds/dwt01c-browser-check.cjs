// DWT-01c rendered check (SwiftShader). Serves public/ of parent and fix checkouts:
//   python3 -m http.server 4174 -d <parent>/public & python3 -m http.server 4175 -d <fix>/public &
//   CHROME_PATH=... node dwt01c-browser-check.cjs
// Opens Dune book 1 directly inside Castle Caladan (place link), then requests the same-world Paddies entry with an
// ownership check that is revoked at 100 ms (what tour Stop does), and waits 4 s. Records state, hash and the
// place actually rendered. A positive control requests Paddies with ownership kept. Uses window.__atlas only.
const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch({ executablePath: process.env.CHROME_PATH, args: ['--use-gl=swiftshader', '--enable-webgl', '--ignore-gpu-blocklist', '--no-proxy-server'] });
  for (const [port, label] of [['4174', 'PARENT 1fe00c4'], ['4175', 'FIX']]) {
    for (const mode of ['stop', 'positive']) {
      const p = await b.newPage({ viewport: { width: 1280, height: 800 } });
      const errs = []; p.on('pageerror', e => errs.push(e.message));
      await p.goto('http://127.0.0.1:' + port + '/atlas/?pack=dune#book=1&world=caladan&site=castle&view=place', { waitUntil: 'commit' });
      await p.waitForFunction(() => window.__atlas && window.__atlas.S.view === 'place', null, { timeout: 90000 });
      await p.waitForTimeout(2500);
      const r = await p.evaluate(async mode => {
        const A = window.__atlas; let owned = true; A.enterPlace('paddies', false, null, () => owned);
        if (mode === 'stop') setTimeout(() => { owned = false; }, 100);
        await new Promise(res => setTimeout(res, 4000));
        const P = A.PLACES && A.PLACES.place;
        return { view: A.S.view, site: A.S.site, hash: location.hash, histPlace: !!(history.state && history.state.atlasPlace),
          rendered: P && (P.s ? P.s.id : P.site ? P.site.id : P.id) || null, title: (document.querySelector('#dossier h2, .dossier h2') || {}).textContent || null };
      }, mode);
      await p.screenshot({ path: '/tmp/claude-0/s/' + label.split(' ')[0] + '-' + mode + '.png' });
      console.log(label, mode, JSON.stringify(r), 'pageerrors:', errs.length);
      await p.close();
    }
  }
  await b.close();
})();
