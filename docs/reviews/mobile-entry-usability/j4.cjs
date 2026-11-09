const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch({ args: ['--use-gl=swiftshader','--enable-webgl','--ignore-gpu-blocklist'] });
  const ctx = await b.newContext({ viewport:{width:932,height:430}, deviceScaleFactor:2, isMobile:true, hasTouch:true });
  const p = await ctx.newPage();
  await p.goto('http://127.0.0.1:4173/'); await p.waitForTimeout(2500);
  const s = async l => console.log(l, await p.evaluate(() => { const r=document.querySelector('#clear').getBoundingClientRect(); return document.querySelector('#count').textContent+' clear@'+Math.round(r.x)+','+Math.round(r.y)+' collapsed='+document.querySelector('.shell').classList.contains('tools-collapsed') + ' toast='+document.querySelector('#toast').textContent; }));
  await s('start'); await p.tap('#pause'); await s('paused');
  await p.tap('#panel-toggle'); await p.waitForTimeout(300); await s('open');
  await p.screenshot({ path: 'shots/after-932x430-tools-open.png' });
  await p.tap('[data-builder="binary"]'); await p.waitForTimeout(300); await s('builder'); await p.tap('#panel-toggle'); await p.waitForTimeout(300); await s('closed'); console.log(await p.evaluate(() => { const e=document.elementFromPoint(280,150); return e.tagName+'#'+e.id+'.'+e.className; }));await p.touchscreen.tap(280,150); await p.waitForTimeout(500); await s('canvas tap');
  await b.close();
})();
