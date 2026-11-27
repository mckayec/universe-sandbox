// G2 (packet-review-420c1e7): phone-emulated keyboard/focus qualification of the integrated head.
// Playwright iPhone 13 descriptor (390x664 CSS viewport, DPR 3, isMobile, hasTouch, mobile UA), software GL.
// Real keyboard events on focused controls; asserts exact input values, readout, S.range, URL yr and focus
// after EVERY step, then keyboard open/Tab-trap/arrow/Escape of the Timeline dialog.
// Limit: no on-screen keyboard, no VoiceOver, no real touch; Playwright keyboard events go to the focused element.
// usage: node g2-phone-keyboard-probe.mjs <dist dir> <label>
import { cpSync, mkdtempSync, readFileSync } from 'node:fs';
import { createServer } from 'node:http';
import { tmpdir } from 'node:os';
import { join, extname } from 'node:path';
import { createRequire } from 'node:module';
const require = createRequire(process.cwd() + '/package.json');
const { chromium, devices } = require('playwright');

const [distDir, label = ''] = process.argv.slice(2);
const dir = mkdtempSync(join(tmpdir(), 'g2-'));
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
const base = `http://127.0.0.1:${srv.address().port}/atlas/?pack=abrahamic-world-religions`;
const browser = await chromium.launch({
  executablePath: process.env.CHROME_PATH || undefined,
  args: ['--use-gl=swiftshader', '--enable-webgl', '--ignore-gpu-blocklist'],
});
let pass = 0,
  fail = 0;
const check = (name, ok, extra = '') => {
  ok ? pass++ : fail++;
  console.log((ok ? 'PASS ' : 'FAIL ') + name + (extra ? ' — ' + extra : ''));
};
const dev = devices['iPhone 13'];
console.log('INFO device iPhone 13', JSON.stringify({ viewport: dev.viewport, dpr: dev.deviceScaleFactor, isMobile: dev.isMobile, hasTouch: dev.hasTouch }));
const ctx = await browser.newContext({ ...dev, serviceWorkers: 'block' });
const page = await ctx.newPage();
const errors = [];
page.on('pageerror', e => errors.push(e.message));
page.on('console', m => m.type() === 'error' && errors.push(m.text()));
const load = async hash => {
  await page.goto('about:blank');
  await page.goto(base + hash);
  await page.waitForFunction(() => window.__atlas && document.querySelector('#filters input[data-tl="to"]'), null, { polling: 500, timeout: 90000 });
  await page.waitForTimeout(2500);
};
const state = () =>
  page.evaluate(() => {
    const q = new URLSearchParams(location.hash.replace(/^#/, ''));
    const f = document.querySelector('#filters');
    const r = window.__atlas.S.range;
    const a = document.activeElement;
    return {
      range: r ? r.join('_') : null,
      yr: q.get('yr'),
      readout: f.querySelector('.tl-y').textContent,
      from: f.querySelector('input[data-tl="from"]').value,
      to: f.querySelector('input[data-tl="to"]').value,
      focus: a && a.dataset ? a.dataset.tl || a.id || a.tagName : null,
    };
  });
// one keyboard step with exact expectations
const step = async (name, key, want) => {
  await page.keyboard.press(key);
  await page.waitForTimeout(600);
  const s = await state();
  const ok =
    s.from === want.from &&
    s.to === want.to &&
    s.range === want.range &&
    s.yr === want.range &&
    s.focus === want.focus &&
    (want.range ? s.readout === want.readout : s.readout === 'All years');
  check(`year/${name} [${key}]`, ok, JSON.stringify(s) + ' want ' + JSON.stringify(want));
};
const W = '#world=earth&view=surface';

// Part 1: year handles, keyboard only, every step asserted
await load(W);
const s0 = await state();
check('year/initial full range', s0.from === '-799' && s0.to === '2031' && s0.range === null && s0.readout === 'All years', JSON.stringify(s0));
await page.focus('#filters input[data-tl="to"]');
const fullTo = { from: '-799', to: '2031', range: null, focus: 'to' };
await step('to-1 step', 'ArrowLeft', { from: '-799', to: '2021', range: '-800_2021', focus: 'to', readout: '800 BCE – 2021' });
await step('to back to top', 'ArrowRight', fullTo);
await step('to-1 again', 'ArrowLeft', { from: '-799', to: '2021', range: '-800_2021', focus: 'to', readout: '800 BCE – 2021' });
await step('to End', 'End', fullTo);
await page.focus('#filters input[data-tl="from"]');
await step('from+1 step', 'ArrowRight', { from: '-789', to: '2031', range: '-790_2030', focus: 'from', readout: '790 BCE – 2030' });
await step('from Home', 'Home', { ...fullTo, focus: 'from' });

await load(`${W}&yr=600_1500`);
const s1 = await state();
check('year/explicit 600_1500 loaded', s1.range === '600_1500' && s1.yr === '600_1500' && s1.from === '601' && s1.to === '1501', JSON.stringify(s1));
await page.focus('#filters input[data-tl="to"]');
await step('explicit to+1', 'ArrowRight', { from: '601', to: '1511', range: '600_1511', focus: 'to', readout: '600 CE – 1511' });
await step('explicit to-1 (back)', 'ArrowLeft', { from: '601', to: '1501', range: '600_1501', focus: 'to', readout: '600 CE – 1501' });
await step('explicit to End', 'End', { from: '601', to: '2031', range: '600_2030', focus: 'to', readout: '600 CE – 2030' });
await page.focus('#filters input[data-tl="from"]');
await step('explicit from+1', 'ArrowRight', { from: '611', to: '2031', range: '611_2030', focus: 'from', readout: '611 CE – 2030' });
await step('explicit from Home', 'Home', { from: '-799', to: '2031', range: null, focus: 'from' });

// Part 2: Timeline dialog by keyboard
await load('');
const btn = await page.evaluate(() => {
  const b = document.querySelector('#tlBtn');
  if (!b) return null;
  const r = b.getBoundingClientRect();
  return { x: Math.round(r.left), right: Math.round(r.right), w: innerWidth, inView: r.left >= 0 && r.right <= innerWidth };
});
check('dialog/Timeline button exists', !!btn, JSON.stringify(btn));
console.log('INFO G5 Timeline button initially within the 390 viewport: ' + (btn && btn.inView) + ' ' + JSON.stringify(btn));
await page.focus('#tlBtn');
await page.keyboard.press('Enter');
await page.waitForTimeout(1500);
const d0 = await page.evaluate(() => ({
  open: !document.querySelector('#timeline').hidden,
  focus: document.activeElement && document.activeElement.dataset.tl,
  hash: location.hash,
}));
check('dialog/Enter on Timeline opens it with focus on Close', d0.open && d0.focus === 'close', JSON.stringify(d0));
check('dialog/URL carries tl', /(^#|&)tl=/.test(d0.hash), d0.hash);
let outside = 0;
const seen = new Set();
for (let i = 0; i < 40; i++) {
  await page.keyboard.press('Tab');
  const r = await page.evaluate(() => {
    const a = document.activeElement;
    return { inside: !!a && document.querySelector('#timeline').contains(a) && a !== document.body, k: a ? a.outerHTML.slice(0, 60) : '' };
  });
  if (!r.inside) outside++;
  seen.add(r.k);
}
check('dialog/40 Tab presses never leave the dialog', outside === 0, `${seen.size} distinct stops, ${outside} outside`);
for (let i = 0; i < 10; i++) {
  await page.keyboard.press('Shift+Tab');
  const inside = await page.evaluate(() => document.querySelector('#timeline').contains(document.activeElement));
  if (!inside) outside++;
}
check('dialog/10 Shift+Tab presses never leave the dialog', outside === 0);
const marks = await page.evaluate(() => [...document.querySelectorAll('#timeline .tl-m')].length);
check('dialog/chart has focusable marks', marks > 0, String(marks));
await page.evaluate(() => document.querySelector('#timeline .tl-m').focus());
const m0 = await page.evaluate(() => document.activeElement.dataset.id);
await page.keyboard.press('ArrowDown');
const m1 = await page.evaluate(() => document.activeElement.dataset.id);
check('dialog/ArrowDown moves to the next mark', !!m1 && m1 !== m0, `${m0} -> ${m1}`);
await page.keyboard.press('Enter');
await page.waitForTimeout(800);
const sel = await page.evaluate(() => ({
  sel: new URLSearchParams(location.hash.replace(/^#/, '')).get('tlsel'),
  info: document.querySelector('#timeline .tl-info').textContent.slice(0, 80),
  focusInside: document.querySelector('#timeline').contains(document.activeElement),
}));
check('dialog/Enter selects the mark (tlsel in URL, details shown, focus kept inside)', sel.sel === m1 && sel.info.length > 0 && sel.focusInside, JSON.stringify(sel));
await page.keyboard.press('Escape');
await page.waitForTimeout(800);
const d1 = await page.evaluate(() => ({
  open: !document.querySelector('#timeline').hidden,
  focus: document.activeElement && document.activeElement.id,
  hash: location.hash,
}));
check('dialog/Escape closes and returns focus to the Timeline button', !d1.open && d1.focus === 'tlBtn' && !/(^#|&)tl=/.test(d1.hash), JSON.stringify(d1));
check('no page/console errors', errors.length === 0, errors.slice(0, 3).join(' | '));
await ctx.close();
await browser.close();
srv.close();
console.log(`${label} ${pass}/${pass + fail} pass, ${fail} fail`);
