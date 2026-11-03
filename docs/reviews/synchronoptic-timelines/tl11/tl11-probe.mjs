// Checkpoint 11 probe: drag-to-reorder of timeline lanes by the grip on each lane chip (mouse at every size,
// real touch events at 390), with the ↑/↓ buttons still working and the order carried into the URL.
// Serve the build (pnpm build && pnpm preview --port 4195) and run: node docs/reviews/synchronoptic-timelines/tl11/tl11-probe.mjs
import { chromium } from 'playwright';
import { writeFileSync } from 'node:fs';

const out = new URL('.', import.meta.url).pathname;
const SIZES = [
  [390, 844],
  [1280, 800],
  [1440, 900],
  [3840, 2160],
];
const results = [];
const errors = [];
const check = (name, pass, actual) => {
  results.push({ name, pass: !!pass, actual });
  console.log((pass ? 'PASS ' : 'FAIL ') + name + ' ' + JSON.stringify(actual));
};
const b = await chromium.launch({
  ...(process.env.CHROME_PATH ? { executablePath: process.env.CHROME_PATH } : {}),
  args: ['--no-sandbox', '--use-gl=swiftshader', '--enable-webgl', '--ignore-gpu-blocklist'],
});
const laneIds = p => p.locator('.tl-lanes .tl-lb').evaluateAll(bs => bs.map(x => x.dataset.laneBox));
const centre = async loc => {
  const r = await loc.boundingBox();
  return { x: r.x + r.width / 2, y: r.y + r.height / 2 };
};
async function touchDrag(p, from, to) {
  const s = await p.context().newCDPSession(p);
  const pt = q => [{ x: q.x, y: q.y, id: 1, radiusX: 4, radiusY: 4, force: 1 }];
  await s.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: pt(from) });
  for (let k = 1; k <= 8; k++) {
    const q = { x: from.x + ((to.x - from.x) * k) / 8, y: from.y + ((to.y - from.y) * k) / 8 };
    await s.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: pt(q) });
    await p.waitForTimeout(30);
  }
  await s.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
}
try {
  for (const [width, height] of SIZES) {
    const phone = width === 390;
    const c = await b.newContext({ viewport: { width, height }, isMobile: phone, hasTouch: phone, reducedMotion: 'reduce' });
    const p = await c.newPage();
    p.setDefaultTimeout(60000);
    p.on('pageerror', e => errors.push(width + ' ' + e.message));
    p.on('console', m => m.type() === 'error' && errors.push(width + ' ' + m.text()));
    p.on('response', r => r.status() >= 400 && errors.push(width + ' ' + r.status() + ' ' + r.url()));
    await p.goto((process.env.BASE || 'http://127.0.0.1:4195/atlas/?pack=abrahamic-world-religions') + '#world=earth');
    await p.waitForFunction(() => window.__atlas && document.querySelector('#splash.out'));
    await p.locator('#tlBtn').click();
    await p.locator('.tl-svg').waitFor();
    const before = await laneIds(p);
    check(width + ' every lane chip has a grip', (await p.locator('.tl-lanes .tl-grip').count()) === before.length, before.length);
    const g0 = p.locator('.tl-lanes .tl-grip').first();
    const grip = await g0.boundingBox();
    check(width + ' grip is at least 32x44 px', grip.width >= 31.5 && grip.height >= 43.5, grip);
    const from = await centre(g0);
    const target = await centre(p.locator('.tl-lanes .tl-lb').nth(2));
    if (phone) await touchDrag(p, from, target);
    else {
      await p.mouse.move(from.x, from.y);
      await p.mouse.down();
      for (let k = 1; k <= 8; k++)
        await p.mouse.move(from.x + ((target.x - from.x) * k) / 8, from.y + ((target.y - from.y) * k) / 8);
      check(width + ' drop target is marked while dragging', (await p.locator('.tl-lb.tl-drop').count()) === 1, null);
      await p.screenshot({ path: out + width + '-dragging.jpg', type: 'jpeg', quality: 70 });
      await p.mouse.up();
    }
    const after = await laneIds(p);
    const want = [before[1], before[2], before[0], ...before.slice(3)];
    check(width + ' dragged first lane lands in slot 3', JSON.stringify(after) === JSON.stringify(want), after);
    const hash = await p.evaluate(() => location.hash);
    check(width + ' URL carries the new order', hash.includes('tl=' + encodeURIComponent(want.join(',')).replace(/%2C/g, ',')) || decodeURIComponent(hash).includes('tl=' + want.join(',')), hash);
    check(width + ' focus on the moved lane toggle', await p.evaluate(id => document.activeElement && document.activeElement.dataset.laneT === id, before[0]), null);
    check(width + ' no drag marks left behind', (await p.locator('.tl-drop, .tl-drag, .tl-dragging').count()) === 0, null);
    // the ↑ button still works and agrees with drag order
    await p.locator('.tl-mv[data-lane="' + before[0] + '"][data-lane-mv="-1"]').click();
    const up = await laneIds(p);
    check(width + ' ↑ button still moves the lane', up[1] === before[0], up);
    // a drag released on its own slot changes nothing
    const g = await centre(p.locator('.tl-lanes .tl-grip').first());
    if (phone) await touchDrag(p, g, { x: g.x + 3, y: g.y });
    else {
      await p.mouse.move(g.x, g.y);
      await p.mouse.down();
      await p.mouse.move(g.x + 3, g.y);
      await p.mouse.up();
    }
    check(width + ' drop on own place is a no-op', JSON.stringify(await laneIds(p)) === JSON.stringify(up), null);
    await p.locator('[data-lanes="reset"]').click();
    check(width + ' reset restores default order', JSON.stringify(await laneIds(p)) === JSON.stringify(before), null);
    if (phone) await p.screenshot({ path: out + width + '-after-reset.jpg', type: 'jpeg', quality: 70 });
    await c.close();
  }
} finally {
  await b.close();
}
check('no console/page errors', errors.length === 0, errors);
writeFileSync(out + 'results.json', JSON.stringify({ results, errors }, null, 2));
const failed = results.filter(r => !r.pass).length;
console.log(failed ? failed + ' FAILED of ' + results.length : 'PASS ' + results.length);
process.exit(failed ? 1 : 0);
