// Timeline checkpoint 4 probe: the timeline panel uses the screen width (4K, 2560, 1440, phone), the chart fills the
// scroll area, the details column stays readable, no page sideways scroll, no console errors. Usage (repo root,
// after `pnpm build`):
//   SHOTS=docs/reviews/synchronoptic-timelines/shots node docs/reviews/synchronoptic-timelines/tl4-probe.mjs
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { existsSync, mkdirSync } from 'node:fs';
import { chromium } from 'playwright';

const port = 4185;
const base = `http://127.0.0.1:${port}/atlas/?pack=abrahamic-world-religions`;
const shots = process.env.SHOTS;
if (shots) mkdirSync(shots, { recursive: true });
const server = spawn(process.execPath, ['node_modules/vite/bin/vite.js', 'preview', '--host', '127.0.0.1', '--port', String(port), '--strictPort'], { stdio: 'ignore' });
for (let i = 0; i < 300; i++) {
  try { if ((await fetch(base)).ok) break; } catch {}
  await new Promise(r => setTimeout(r, 200));
}
const browser = await chromium.launch({
  headless: true,
  executablePath: process.env.CHROME_PATH && existsSync(process.env.CHROME_PATH) ? process.env.CHROME_PATH : undefined,
  args: ['--use-gl=swiftshader', '--enable-webgl', '--ignore-gpu-blocklist', '--enable-unsafe-swiftshader'],
});
const errors = [];
const t0 = Date.now();
const log = m => console.log(`[${((Date.now() - t0) / 1000).toFixed(0)}s] ${m}`);
const cases = [
  { name: 'tl4-3840', vp: { width: 3840, height: 2160 }, minFrac: 0.95 },
  { name: 'tl4-2560', vp: { width: 2560, height: 1440 }, minFrac: 0.95 },
  { name: 'tl4-1440', vp: { width: 1440, height: 900 }, minFrac: 0.95 },
  { name: 'tl4-390', vp: { width: 390, height: 844 }, minFrac: 0.9 },
];
let pass = 0;
try {
  for (const c of cases) {
    const phone = c.vp.width < 600;
    const ctx = await browser.newContext({ viewport: c.vp, isMobile: phone, hasTouch: phone, reducedMotion: 'reduce' });
    const tab = await ctx.newPage();
    tab.setDefaultTimeout(300000);
    tab.on('pageerror', e => errors.push(`${c.name} pageerror: ${e.message}`));
    tab.on('console', m => { if (m.type() === 'error' && !/GL Driver|GPU stall|software WebGL/i.test(m.text())) errors.push(`${c.name} ${m.text()}`); });
    tab.on('requestfailed', r => errors.push(`${c.name} requestfailed: ${r.url()} ${r.failure()?.errorText}`));
    tab.on('response', r => { if (r.status() >= 400) errors.push(`${c.name} ${r.status()} ${r.url()}`); });
    await tab.goto(base, { waitUntil: 'domcontentloaded' });
    await tab.waitForFunction(() => window.__atlas && document.querySelector('#splash.out'), null, { timeout: 300000 });
    await tab.locator('#tlBtn').click();
    await tab.locator('#timeline .tl-svg').waitFor();
    await tab.waitForTimeout(400);
    const m = await tab.evaluate(() => {
      const r = el => el.getBoundingClientRect();
      const panel = document.querySelector('#timeline .panel');
      const scroll = document.querySelector('#timeline .tl-scroll');
      const svg = document.querySelector('#timeline .tl-svg');
      const info = document.querySelector('#timeline .tl-info');
      return {
        vw: innerWidth, panel: r(panel).width, scroll: r(scroll).width, svg: r(svg).width, info: info ? r(info).width : 0,
        pageScroll: document.documentElement.scrollWidth - innerWidth,
      };
    });
    log(`${c.name} ${JSON.stringify(m)}`);
    assert.ok(m.panel >= c.vp.width * c.minFrac - 60, `${c.name}: panel uses the width (${m.panel} of ${m.vw})`);
    assert.ok(m.svg >= m.scroll * 0.9, `${c.name}: chart fills its scroll area (${m.svg} of ${m.scroll})`);
    if (!phone) assert.ok(m.info >= 330 && m.info <= 620, `${c.name}: details column readable (${m.info})`);
    assert.ok(m.pageScroll <= 0, `${c.name}: no page sideways scroll`);
    if (shots) await tab.screenshot({ path: `${shots}/${c.name}.jpg`, type: 'jpeg', quality: phone ? 72 : 60 });
    await ctx.close();
    pass++;
  }
  assert.deepEqual(errors, [], 'no console errors, failed requests or HTTP>=400');
  console.log(`tl4-probe: ${pass}/${cases.length} passed; errors: ${errors.length}`);
} finally {
  await browser.close();
  server.kill();
}
