// DWT-01 browser check (rendered app, SwiftShader). Serves public/ of a parent and a fix checkout:
//   python3 -m http.server 4174 -d <parent>/public & python3 -m http.server 4175 -d <fix>/public &
//   CHROME_PATH=... node dwt-browser-check.cjs
// Dune book 1: start the tour with a real mouse click, press Next 6x (real mouse clicks, 1.5 s apart), then wait 25 s.
// Records: main-frame navigations away from /atlas/ (document exit), hashes whose world/site pair is mismatched,
// whether the page is still alive, and final hash vs the tour box's current event label.
const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch({ executablePath: process.env.CHROME_PATH, args: ['--use-gl=swiftshader', '--enable-webgl', '--ignore-gpu-blocklist'] });
  const runs = (process.env.RUNS || '4174,4175,4174,4175').split(',');
  for (const port of runs) {
    const label = port === '4174' ? 'PARENT aea2347' : 'FIX';
    const urls = [], errs = [];
    const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
    p.on('framenavigated', f => { if (f === p.mainFrame()) urls.push(f.url()); });
    p.on('pageerror', e => errs.push(e.message));
    await p.goto(`http://localhost:${port}/atlas/?pack=dune#book=1`, { waitUntil: 'domcontentloaded' });
    await p.waitForFunction(() => window.__atlas); await p.waitForTimeout(2500);
    await p.click('#tourBtn');
    let left = 'no';
    for (let i = 0; i < 6; i++) {
      try { await p.click('[data-tour="next"]', { timeout: 5000 }); } catch (e) { left = 'step ' + i + ': ' + e.message.split('\n')[0]; break; }
      await p.waitForTimeout(1500);
    }
    let fin = null;
    try {
      await p.waitForTimeout(25000);
      fin = await p.evaluate(() => ({ hash: location.hash, path: location.pathname, tour: document.querySelector('#tourE') && document.querySelector('#tourE').textContent, n: document.querySelector('#tourN') && document.querySelector('#tourN').textContent }));
    } catch (e) { fin = { error: e.message.split('\n')[0] }; }
    const mism = urls.filter(u => /world=arrakis&site=castle|world=caladan&site=arrakeen/.test(u));
    const out = urls.filter(u => !u.includes('/atlas/'));
    console.log(label, '| click failure:', left, '| mismatched world/site urls:', mism.length, '| non-atlas navigations:', out.length ? out.join(',') : 'none', '| pageerrors:', errs.length, '| final:', JSON.stringify(fin));
    await p.close();
  }
  await b.close();
})();
