const { chromium } = require('playwright');
const tag = process.argv[2] || 'before';
const sizes = [[320,640],[375,667],[390,844],[430,932],[768,1024],[844,390],[1440,900]];
(async () => {
  const b = await chromium.launch({ args: ['--use-gl=swiftshader','--enable-webgl','--ignore-gpu-blocklist'] });
  const report = [];
  for (const [w,h] of sizes) {
    const ctx = await b.newContext({ viewport:{width:w,height:h}, deviceScaleFactor: w<1000?2:1, isMobile: w<1000, hasTouch: w<1000 });
    const p = await ctx.newPage();
    const errs = [];
    p.on('console', m => { if (m.type()==='error') errs.push(m.text()); });
    p.on('pageerror', e => errs.push(String(e)));
    await p.goto('http://127.0.0.1:4173/', { waitUntil: 'load' });
    await p.waitForTimeout(2500);
    await p.screenshot({ path: `shots/${tag}-${w}x${h}-home.png` });
    // measure targets
    const small = await p.evaluate(() => {
      const out = [];
      document.querySelectorAll('button, select, input[type=range]').forEach(el => {
        const r = el.getBoundingClientRect();
        const cs = getComputedStyle(el);
        if (r.width === 0 || r.height === 0 || cs.visibility==='hidden') return;
        if (el.closest('[hidden]')) return;
        if (r.bottom < 0 || r.top > innerHeight) return;
        if (r.height < 44 || r.width < 44) out.push(`${el.id || el.dataset.builder || el.dataset.choice || el.dataset.speed || el.textContent.trim().slice(0,18)} ${Math.round(r.width)}x${Math.round(r.height)}`);
      });
      const hint = document.querySelector('#hint');
      const mh = document.querySelector('#mobile-hint');
      return { under44: out, hintVisible: hint && getComputedStyle(hint).display !== 'none', mobileHint: mh ? mh.textContent : null, scrollW: document.documentElement.scrollWidth };
    });
    await p.click('#universes-button').catch(e => errs.push('click universes: '+e.message));
    await p.waitForTimeout(600);
    await p.screenshot({ path: `shots/${tag}-${w}x${h}-universes.png` });
    report.push({ size:`${w}x${h}`, ...small, errs: errs.slice(0,5) });
    await ctx.close();
  }
  console.log(JSON.stringify(report, null, 1));
  await b.close();
})();
