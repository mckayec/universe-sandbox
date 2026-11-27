const { chromium } = require('playwright');
const [w,h] = (process.argv[2]||'390x844').split('x').map(Number);
(async () => {
  const b = await chromium.launch({ args: ['--use-gl=swiftshader','--enable-webgl','--ignore-gpu-blocklist'] });
  const ctx = await b.newContext({ viewport:{width:w,height:h}, deviceScaleFactor:2, isMobile:true, hasTouch:true });
  const p = await ctx.newPage(); const errs=[];
  p.on('pageerror', e => errs.push(String(e))); p.on('console', m => { if (m.type()==='error') errs.push(m.text()); });
  await p.goto('http://127.0.0.1:4173/'); await p.waitForTimeout(2500);
  const c = () => p.evaluate(() => document.querySelector('#count').textContent);
  await p.tap('#pause'); // freeze evolution so counts are deterministic
  console.log('paused count', await c());
  await p.tap('#panel-toggle'); await p.tap('[data-builder="binary"]'); await p.tap('#panel-toggle');
  console.log('hint', await p.evaluate(() => document.querySelector('#touch-hint').textContent));
  await p.touchscreen.tap(Math.round(w*0.3), Math.round(h*0.35)); await p.waitForTimeout(600);
  console.log('after placing binary', await c());
  await p.screenshot({ path: `shots/after-${w}x${h}-placed.png` });
  await p.tap('#clear'); await p.waitForTimeout(300);
  const undoBox = await p.locator('#undo').boundingBox();
  console.log('after clear', await c(), 'undo box', JSON.stringify(undoBox), 'in view:', undoBox.x+undoBox.width<=w);
  await p.screenshot({ path: `shots/after-${w}x${h}-cleared.png` });
  await p.tap('#undo'); await p.waitForTimeout(500);
  console.log('after undo', await c());
  await p.tap('#pause'); await p.tap('[data-speed="10"]'); await p.waitForTimeout(1500);
  console.log('running 10x ok, count', await c(), 'errors', errs);
  await b.close();
})();
