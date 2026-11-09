// Checkpoint 31: R30-1 year-handle endpoints in the actual atlas host (built dist served from a temp copy).
// Real keyboard input on the focused range inputs (ArrowLeft/ArrowRight/End/Home fire native input+change).
// Asserts S.range, URL `yr`, the readout and the inputs after each step.
//   A full range: "to" ArrowLeft then ArrowRight (a change that ends where it started) -> still All years
//   B full range: "to" End -> All years (the last year is reachable); Home on "from" -> All years
//   D explicit yr=600_1500: "from" ArrowRight then ArrowLeft -> 601..1500 (the moved handle lands on its snapped
//     grid year 601; the untouched "to" end stays exactly 1500)
//   E explicit yr=600_1500: one ArrowRight on "to" -> 600..1511, the "from" end untouched
//   F explicit yr=600_1500: "to" End -> 600..2030 (top reachable from an explicit range)
// usage: node year-handle-probe.mjs <dist dir> <label>
import { cpSync, mkdtempSync, readFileSync } from 'node:fs';
import { createServer } from 'node:http';
import { tmpdir } from 'node:os';
import { join, extname } from 'node:path';
import { chromium } from 'playwright';

const [distDir, label = ''] = process.argv.slice(2);
const ID = 'abrahamic-world-religions';
const dir = mkdtempSync(join(tmpdir(), 'tl31-'));
cpSync(distDir, dir, { recursive: true });
const TYPES = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json' };
const srv = await new Promise(res => {
  const s = createServer((q, a) => {
    let p = decodeURIComponent(q.url.split('?')[0]);
    if (p.endsWith('/')) p += 'index.html';
    try {
      const b = readFileSync(join(dir, p));
      a.writeHead(200, { 'content-type': TYPES[extname(p)] || 'application/octet-stream' });
      a.end(b);
    } catch {
      a.writeHead(404);
      a.end();
    }
  }).listen(0, () => res(s));
});
const base = `http://127.0.0.1:${srv.address().port}/atlas/?pack=${ID}`;
const browser = await chromium.launch({
  executablePath: process.env.CHROME_PATH || undefined,
  args: ['--use-gl=swiftshader', '--enable-webgl', '--ignore-gpu-blocklist'],
});
let pass = 0;
let fail = 0;
const check = (name, ok, extra = '') => {
  ok ? pass++ : fail++;
  console.log((ok ? 'PASS ' : 'FAIL ') + name + (extra ? ' — ' + extra : ''));
};
const state = page =>
  page.evaluate(() => {
    const q = new URLSearchParams(location.hash.replace(/^#/, ''));
    const f = document.querySelector('#filters');
    const from = f.querySelector('input[data-tl="from"]');
    const to = f.querySelector('input[data-tl="to"]');
    const r = window.__atlas.S.range;
    return {
      range: r ? r.join('_') : null,
      yr: q.get('yr'),
      readout: f.querySelector('.tl-y').textContent,
      from: from && from.value,
      to: to && to.value,
      max: to && to.max,
    };
  });
const settle = page => page.waitForTimeout(600);
const focusInput = (page, which) => page.focus(`#filters input[data-tl="${which}"]`);
const expectState = async (page, tag, name, want) => {
  await settle(page);
  const s = await state(page);
  const ok = s.range === want && s.yr === want && (want ? s.readout !== 'All years' : s.readout === 'All years');
  check(`${tag} ${name}: S.range = URL yr = ${want ?? 'none'}`, ok, JSON.stringify(s));
};

const sizes = (process.argv[4] || '1440x900,390x844').split(',').map(x => x.split('x').map(Number));
for (const [w, h] of sizes) {
  const tag = `yr-handles/${w}`;
  const ctx = await browser.newContext({ viewport: { width: w, height: h }, serviceWorkers: 'block' });
  const page = await ctx.newPage();
  const errors = [];
  page.on('pageerror', e => errors.push(e.message));
  page.on('console', m => m.type() === 'error' && errors.push(m.text()));
  const load = async hash => {
    await page.goto('about:blank');
    await page.goto(base + hash);
    await page.waitForFunction(() => window.__atlas && document.querySelector('#filters input[data-tl="to"]'), null, {
      polling: 500,
      timeout: 90000,
    });
    await page.waitForTimeout(2500);
  };
  const W = '#world=earth&view=surface';

  await load(W);
  const s0 = await state(page);
  console.log(`INFO ${tag} axis to.max ${s0.max}, to.value ${s0.to}, from.value ${s0.from}`);
  await focusInput(page, 'to');
  await page.keyboard.press('ArrowLeft');
  await page.keyboard.press('ArrowRight');
  await expectState(page, tag, 'A full range, "to" left+right (change ends where it started)', null);

  await load(W);
  await focusInput(page, 'to');
  await page.keyboard.press('ArrowLeft');
  await page.keyboard.press('End');
  await expectState(page, tag, 'B full range, "to" left then End (last year reachable)', null);
  await focusInput(page, 'from');
  await page.keyboard.press('ArrowRight');
  await page.keyboard.press('Home');
  await expectState(page, tag, 'B full range, "from" right then Home', null);

  const X = `${W}&yr=600_1500`;
  await load(X);
  await focusInput(page, 'from');
  await page.keyboard.press('ArrowRight');
  await page.keyboard.press('ArrowLeft');
  await expectState(page, tag, 'D yr=600_1500, "from" right+left (moved end on grid, other end exact)', '601_1500');

  await load(X);
  await focusInput(page, 'to');
  await page.keyboard.press('ArrowRight');
  await expectState(page, tag, 'E yr=600_1500, one step right on "to" (from end untouched)', '600_1511');

  await load(X);
  await focusInput(page, 'to');
  await page.keyboard.press('End');
  await expectState(page, tag, 'F yr=600_1500, "to" End (top reachable)', '600_2030');

  check(`${tag} focus stays on the year handle after a change`, await page.evaluate(() => document.activeElement && document.activeElement.dataset.tl === 'to'));
  check(`${tag} no page/console errors`, errors.length === 0, errors.slice(0, 3).join(' | '));
  await ctx.close();
}
await browser.close();
srv.close();
console.log(`${label} ${pass}/${pass + fail} pass, ${fail} fail`);
