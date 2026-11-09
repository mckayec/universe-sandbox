const { chromium } = require("playwright");
const vp = JSON.parse(process.env.VP);
(async () => {
  const br = await chromium.launch({ executablePath: process.env.CHROME_PATH, args: ["--use-gl=swiftshader","--enable-webgl","--ignore-gpu-blocklist"] });
  const mobile = vp.width < 1000;
  const p = await br.newPage({ viewport: vp, isMobile: mobile, hasTouch: mobile });
  p.setDefaultTimeout(60000);
  const errs = []; p.on("pageerror", e => errs.push(e.message)); p.on("console", m => { if (m.type()==="error") errs.push(m.text()); });
  await p.goto("http://localhost:8811/atlas/society.html");
  await p.waitForFunction(() => window.__atlas && window.__atlas.SITES); await p.waitForTimeout(800);
  const r = {};
  // Book V by keyboard
  await p.focus('.seg button[data-book="5"]'); await p.keyboard.press("Enter"); await p.waitForTimeout(300);
  const count = () => p.evaluate(() => window.__empCalls || 0);
  const wrap = () => p.evaluate(() => { const S = window.__atlas.SITES.heliopolis; if (S._emp && !S._emp.__w) { const o = S._emp; const w = () => { window.__empCalls = (window.__empCalls||0)+1; (window.__log=window.__log||[]).push('emp@'+Math.round(performance.now())); o(); }; w.__w = 1; S._emp = w; } return !!S._emp; });
  // Event d12 by keyboard (first visible timeline button)
  const sel = '.ev[data-id="d12"], .evitem[data-id="d12"]';
  const vis = await p.evaluate(s => [...document.querySelectorAll(s)].some(b => b.getClientRects().length), sel);
  if (vis) { await p.evaluate(s => [...document.querySelectorAll(s)].find(b => b.getClientRects().length).focus(), sel); await p.keyboard.press("Enter"); r.entry = "keyboard"; }
  else { await p.evaluate(() => window.__atlas.gotoEvent(window.__atlas.EV ? (window.__atlas.EV.find?window.__atlas.EV.find(e=>e.id==="d12"):window.__atlas.EV.d12) : null)); r.entry = "gotoEvent"; }
  await p.waitForFunction(() => window.__atlas.curSite === window.__atlas.SITES.heliopolis, null, { timeout: 30000 }).catch(() => {});
  r.inHeliopolis = await p.evaluate(() => window.__atlas.curSite === window.__atlas.SITES.heliopolis);
  await p.waitForFunction(() => window.__atlas.fx.length === 0, null, { timeout: 60000 }).catch(()=>{}); await p.waitForTimeout(3000); r.handler = await wrap();
  // 1) uninterrupted playback
  await p.evaluate(() => { window.__empCalls = 0; (window.__log=window.__log||[]).push('play@'+Math.round(performance.now())); window.__atlas.playFx("heliofall"); });
  await p.waitForTimeout(4000); r.uninterrupted = await count();
  await p.screenshot({ path: `probe/heliopolis-${vp.width}x${vp.height}.png` });
  // 2) interrupt at ~1s by Escape / stop, then replay
  await p.evaluate(() => { window.__empCalls = 0; (window.__log=window.__log||[]).push('play@'+Math.round(performance.now())); window.__atlas.playFx("heliofall"); });
  await p.waitForTimeout(900);
  r.fxBeforeStop = await p.evaluate(() => window.__atlas.fx.map(f => f.name));
  await p.evaluate(() => window.__atlas.playFx("heliofall")); // replay interrupts the running instance
  await p.waitForTimeout(4000); r.interruptedThenReplay = await count();
  // 3) downgrade to Book IV during playback
  await p.evaluate(() => { window.__empCalls = 0; (window.__log=window.__log||[]).push('play@'+Math.round(performance.now())); window.__atlas.playFx("heliofall"); });
  await p.waitForTimeout(800);
  await p.evaluate(() => (window.__log=window.__log||[]).push('down@'+Math.round(performance.now()))); await p.evaluate(() => { window.__log.push('sel4@'+Math.round(performance.now())); document.querySelector('.seg button[data-book="4"]').click(); window.__log.push('sel4done@'+Math.round(performance.now())); }); await p.evaluate(() => window.__log.push('downDone@'+Math.round(performance.now())+' site='+(window.__atlas.curSite===window.__atlas.SITES.heliopolis)));
  await p.waitForTimeout(3500); r.afterDowngrade = await count();
  r.fxAfterDowngrade = await p.evaluate(() => window.__atlas.fx.map(f => f.name));
  r.scrollW = await p.evaluate(() => document.documentElement.scrollWidth); r.vw = vp.width;
  r.log = await p.evaluate(() => window.__log); r.errs = errs.slice(0, 5);
  console.log(JSON.stringify(r));
  await br.close();
})();
