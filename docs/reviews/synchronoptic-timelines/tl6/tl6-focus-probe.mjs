// TL-R03 residual: Tab / Shift+Tab containment from programmatic focus targets (Overview heading, scroll pane)
// after a gate refresh, a resize and a lane collapse, at 390/1440/3840. Run against `pnpm preview --port 4195`.
import { chromium } from 'playwright';
const BASE = process.env.BASE || 'http://127.0.0.1:4195/atlas/?pack=abrahamic-world-religions';
const browser = await chromium.launch({
  executablePath: process.env.CHROME_PATH,
  args: ['--use-gl=swiftshader', '--enable-webgl', '--ignore-gpu-blocklist'],
});
let pass = 0,
  fail = 0;
const errors = [];
function check(name, ok, info = '') {
  ok ? pass++ : fail++;
  console.log((ok ? 'PASS ' : 'FAIL ') + name + (info ? ' ' + info : ''));
}
const inside = p => p.evaluate(() => !!document.activeElement.closest('#timeline'));
async function walk(p, label, key, n) {
  for (let i = 0; i < n; i++) {
    await p.keyboard.press(key);
    if (!(await inside(p))) {
      const at = await p.evaluate(() => document.activeElement.outerHTML.slice(0, 80));
      return check(label + ' ' + key + ' x' + n, false, 'escaped at press ' + (i + 1) + ': ' + at);
    }
  }
  check(label + ' ' + key + ' x' + n, true);
}
async function fromHeading(p, label) {
  for (const key of ['Tab', 'Shift+Tab']) {
    await p.evaluate(() => document.querySelector('#timeline .tl-ov')?.focus());
    const onH = await p.evaluate(() => document.activeElement.matches('.tl-ov'));
    if (!onH) await p.evaluate(() => document.querySelector('#timeline .tl-scroll').focus());
    await walk(p, label + (onH ? ' [heading]' : ' [scroll]'), key, 60);
  }
}
for (const [w, h] of [
  [390, 844],
  [1440, 900],
  [3840, 2160],
]) {
  const ctx = await browser.newContext({ viewport: { width: w, height: h }, hasTouch: w === 390 });
  const p = await ctx.newPage();
  p.on('pageerror', e => errors.push(e.message));
  p.on('console', m => m.type() === 'error' && errors.push(m.text()));
  await p.goto(BASE + '#world=earth');
  await p.waitForFunction(() => window.__atlas && document.querySelector('#splash.out'));
  await p.evaluate(() => document.querySelector('#tlBtn').click());
  await p.waitForFunction(() => !document.querySelector('#timeline').hidden);
  await p.evaluate(() => document.querySelector('[data-mode="list"]').click());
  await p.evaluate(() => document.querySelector('.tl-it[data-id="n:jud-karaite"]').click());
  // gate refresh: host filter removes the selected record while the modal is open
  await p.evaluate(() => document.querySelector('[data-layer="jud"]').click());
  check(w + ' gate: focus inside', await inside(p));
  check(w + ' gate: fallback is heading', await p.evaluate(() => document.activeElement.matches('.tl-ov')));
  await walk(p, w + ' gate', 'Tab', 1);
  await p.evaluate(() => document.querySelector('#timeline .tl-ov')?.focus());
  await walk(p, w + ' gate', 'Shift+Tab', 1);
  await fromHeading(p, w + ' gate');
  await p.evaluate(() => document.querySelector('[data-layer="jud"]').click());
  // resize
  await p.evaluate(() => document.querySelector('[data-mode="chart"]').click());
  await p.setViewportSize({ width: Math.max(390, w - 200), height: h });
  await p.waitForTimeout(150);
  await fromHeading(p, w + ' resize');
  await p.setViewportSize({ width: w, height: h });
  // collapse a lane, then walk from the heading and from the scroll pane
  const lane = await p.evaluate(() => {
    const b = document.querySelector('#timeline [data-lane-t]');
    b && b.click();
    return b && b.dataset.laneT;
  });
  check(w + ' collapse: lane toggled', !!lane, lane || '');
  await fromHeading(p, w + ' collapse');
  await p.evaluate(() => document.querySelector('#timeline .tl-scroll').focus());
  await walk(p, w + ' collapse [scroll]', 'Tab', 5);
  await p.evaluate(() => document.querySelector('#timeline .tl-scroll').focus());
  await walk(p, w + ' collapse [scroll]', 'Shift+Tab', 5);
  // Escape still closes and returns focus out of the dialog
  await p.keyboard.press('Escape');
  check(w + ' Escape closes', await p.evaluate(() => document.querySelector('#timeline').hidden));
  await ctx.close();
}
check('no console/page errors', errors.length === 0, JSON.stringify(errors));
console.log(pass + '/' + (pass + fail) + ' passed');
await browser.close();
process.exit(fail ? 1 : 0);
