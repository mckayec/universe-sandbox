const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch({ args: ['--use-gl=swiftshader', '--enable-webgl', '--ignore-gpu-blocklist'] });
  for (const [w, h] of [[390, 844], [320, 568], [844, 390]]) for (const pct of [100, 200]) for (const neg of [false, true]) {
    const ctx = await b.newContext({ viewport: { width: w, height: h }, isMobile: true, hasTouch: true });
    const p = await ctx.newPage(); await p.goto('http://127.0.0.1:4173/'); await p.waitForTimeout(1500);
    await p.addStyleTag({ content: `html{-webkit-text-size-adjust:${pct}% !important}` + (neg ? '.topbar{flex-wrap:nowrap!important;height:44px!important}.sim-state{flex:0 9999 auto!important;min-width:0!important;overflow:hidden!important}' : '') });
    await p.evaluate(() => { document.getElementById('pause').click(); document.getElementById('count').textContent = '1288'; document.getElementById('elapsed').textContent = '1234:56'; });
    await p.waitForTimeout(300);
    const r = await p.evaluate(() => { const ss = document.querySelector('.sim-state'); const rr = ss.getBoundingClientRect(); const e = document.getElementById('elapsed'); const g = document.createRange(); g.selectNodeContents(e); const t = [...g.getClientRects()]; return { extra: getComputedStyle(document.documentElement).getPropertyValue('--topbar-extra'), clip: ss.scrollWidth > ss.clientWidth + 1, elapsedInBox: t.every(q => q.right <= rr.right + 0.5), tbTop: Math.round(document.querySelector('.universe-toolbar').getBoundingClientRect().top) }; });
    console.log(w, h, pct, neg ? 'OLD-RULE' : 'new', JSON.stringify(r));
    await ctx.close();
  }
  await b.close();
})();
