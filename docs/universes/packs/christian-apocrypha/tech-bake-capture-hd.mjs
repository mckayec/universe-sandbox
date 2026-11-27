import { createRequire } from 'module'; const { chromium } = createRequire('/home/claude/universe-sandbox/package.json')('playwright');
const base = process.argv[2], out = process.argv[3], shrink = process.argv[4] === 'shrink';
const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1243/chrome-linux64/chrome', args: ['--use-gl=swiftshader','--enable-webgl','--ignore-gpu-blocklist'] });
const page = await browser.newPage({ viewport: { width: +process.argv[5], height: +process.argv[6] }, deviceScaleFactor: 1 }); await page.addInitScript(hd => { window.__HD = hd; }, +process.argv[7]);
const errs = [], third = [];
page.on('console', m => { if (m.type() === 'error') errs.push(m.text()); });
page.on('pageerror', e => errs.push('pageerror ' + e.message));
page.on('request', r => { const u = new URL(r.url()); if (!['127.0.0.1','localhost'].includes(u.hostname) && u.protocol.startsWith('http')) third.push(r.url()); });
const t0 = Date.now();
await page.goto(base + '?pack=christian-apocrypha', { waitUntil: 'load' });
await page.waitForSelector('#bake', { state: 'attached', timeout: 300000 });
await page.waitForTimeout(4000);
if (shrink) await page.setViewportSize({ width: 480, height: 270 });
let last = '';
for (;;) {
  const st = await page.evaluate(() => { const b = document.querySelector('#bake'); return { hidden: b.hidden, w: b.querySelector('i').style.width }; });
  const s = ((Date.now() - t0) / 1000).toFixed(0);
  if (st.w !== last) { console.log(s + 's', JSON.stringify(st)); last = st.w; }
  if (st.w === '100%' || (st.hidden && last)) break;
  if (Date.now() - t0 > 30 * 60000) { console.log('TIMEOUT'); break; }
  await page.waitForTimeout(5000);
}
if (shrink) await page.setViewportSize({ width: +process.argv[5], height: +process.argv[6] });
await page.waitForTimeout(8000);
await page.screenshot({ path: out + '-full.png' });
console.log('elapsed', ((Date.now() - t0) / 1000).toFixed(0), 's; console errors', errs.length, JSON.stringify(errs.slice(0,5)), '; third-party', third.length, JSON.stringify(third.slice(0,5)));
await browser.close();
