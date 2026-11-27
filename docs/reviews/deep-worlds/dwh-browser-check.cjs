const { chromium } = require('playwright');
(async () => {
  const base = process.argv[2];
  const b = await chromium.launch({ args: ['--use-gl=swiftshader','--enable-webgl','--ignore-gpu-blocklist'] });
  const out = {};
  for (const [label, vp] of [['desktop',{width:1440,height:900}],['phone',{width:390,height:844}]]) {
    const p = await b.newPage({ viewport: vp }); const errs = [];
    p.on('pageerror', e => errs.push(String(e)));
    await p.goto(base + 'atlas/?pack=hyperion#book=2&world=hyperion&site=tree&view=surface', { waitUntil: 'load' });
    await p.waitForTimeout(3500);
    const before = await p.evaluate(() => ({ state: history.state, len: history.length, url: location.hash }));
    // two superseding entries inside one 430 ms fade, dispatched via the dossier's delegated [data-act=enter] handler
    await p.evaluate(() => { const d = document.querySelector('#dossier');
      for (const id of ['tree','keats']) { const a = document.createElement('button'); a.dataset.act='enter'; a.dataset.id=id; d.appendChild(a); a.click(); a.remove(); } });
    await p.waitForTimeout(1600);
    const after = await p.evaluate(() => ({ state: history.state, len: history.length, url: location.hash }));
    await p.evaluate(() => history.back()); await p.waitForTimeout(1800);
    const back = await p.evaluate(() => ({ state: history.state, len: history.length, url: location.hash }));
    out[label] = { before, after, back, errs };
    await p.close();
  }
  console.log(JSON.stringify(out, null, 1)); await b.close();
})();
