// Checkpoint 13 probe (TL-R10): an active lane drag is cancelled, not committed, by Escape, Close, pointercancel,
// an unexpected loss of pointer capture, and a resize or filter rerender. Only a deliberate pointerup commits.
// Serve the build (pnpm build && pnpm preview --port 4195) and run:
//   node docs/reviews/synchronoptic-timelines/tl13/tl13-cancel-probe.mjs
import { chromium } from 'playwright';
import { writeFileSync } from 'node:fs';

const out = new URL('.', import.meta.url).pathname;
const BASE = process.env.BASE || 'http://127.0.0.1:4195/atlas/?pack=abrahamic-world-religions';
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
const marks = p => p.locator('.tl-drop, .tl-drag, .tl-dragging').count();
const open = async p => {
  if (!(await p.locator('.tl-svg').isVisible().catch(() => false))) await p.locator('#tlBtn').click();
  await p.locator('.tl-svg').waitFor();
};
// press on the first grip and move toward slot 2 (Judaism toward Christianity in this pack), still holding
async function startDrag(p) {
  // the compact lane bar keeps its sideways scroll from an earlier drag's edge nudge: start from its left edge
  await p.evaluate(() => (document.querySelector('.tl-lanes').scrollLeft = 0));
  const from = await centre(p.locator('.tl-lanes .tl-grip').first());
  const to = await centre(p.locator('.tl-lanes .tl-lb').nth(2));
  await p.mouse.move(from.x, from.y);
  await p.mouse.down();
  for (let k = 1; k <= 8; k++) await p.mouse.move(from.x + ((to.x - from.x) * k) / 8, from.y + ((to.y - from.y) * k) / 8);
  return (await p.locator('.tl-lb.tl-drop').count()) === 1;
}

const CASES = {
  async escape(p) {
    await p.keyboard.press('Escape');
    return { reopen: true };
  },
  async close(p) {
    await p.evaluate(() => document.querySelector('[data-tl="close"]').click());
    return { reopen: true };
  },
  async pointercancel(p) {
    await p.evaluate(() =>
      document
        .querySelector('.tl-lanes .tl-grip')
        .dispatchEvent(new PointerEvent('pointercancel', { pointerId: 1, bubbles: true, pointerType: 'mouse' })),
    );
    return {};
  },
  async captureloss(p) {
    await p.evaluate(() => {
      const g = document.querySelector('.tl-lanes .tl-grip');
      if (g.hasPointerCapture(1)) g.releasePointerCapture(1);
      else g.dispatchEvent(new PointerEvent('lostpointercapture', { pointerId: 1, bubbles: true, pointerType: 'mouse' }));
    });
    // lostpointercapture is delivered with the next pointer event: nudge the (still pressed) pointer
    const m = await centre(p.locator('.tl-lanes .tl-lb').nth(1));
    await p.mouse.move(m.x, m.y + 1);
    return {};
  },
  async resize(p) {
    const v = p.viewportSize();
    await p.setViewportSize({ width: v.width, height: v.height - 40 });
    await p.waitForTimeout(150);
    await p.setViewportSize(v);
    await p.waitForTimeout(150);
    return {};
  },
  async rerender(p) {
    // a host gate/filter change reaches the view through refresh(); the chart/list toggle uses the same render
    await p.evaluate(() => window.dispatchEvent(new Event('resize')));
    await p.waitForTimeout(100);
    return {};
  },
};

try {
  for (const [width, height] of [
    [390, 844],
    [1440, 900],
  ]) {
    for (const [name, act] of Object.entries(CASES)) {
      const c = await b.newContext({ viewport: { width, height }, reducedMotion: 'reduce' });
      const p = await c.newPage();
      p.setDefaultTimeout(60000);
      p.on('pageerror', e => errors.push(width + ' ' + name + ' ' + e.message));
      p.on('console', m => m.type() === 'error' && errors.push(width + ' ' + name + ' ' + m.text()));
      await p.goto(BASE + '#world=earth');
      await p.waitForFunction(() => window.__atlas && document.querySelector('#splash.out'));
      await open(p);
      const before = await laneIds(p);
      const hash0 = await p.evaluate(() => location.hash);
      const dragging = await startDrag(p);
      check(`${width} ${name}: drag in progress before the cancel`, dragging, null);
      const r = await act(p);
      check(`${width} ${name}: drag marks cleared at once`, (await marks(p)) === 0, await marks(p));
      await p.mouse.up();
      if (r.reopen) {
        check(`${width} ${name}: focus returned to the opener`, await p.evaluate(() => document.activeElement && document.activeElement.id === 'tlBtn'), await p.evaluate(() => document.activeElement && (document.activeElement.id || document.activeElement.className)));
        await open(p);
      } else {
        const inDialog = await p.evaluate(() => !!document.activeElement && !!document.activeElement.closest('.tl, [role="dialog"]'));
        check(`${width} ${name}: focus stays inside the timeline`, inDialog, null);
      }
      const after = await laneIds(p);
      check(`${width} ${name}: pre-drag order kept`, JSON.stringify(after) === JSON.stringify(before), after.slice(0, 3));
      const hash1 = await p.evaluate(() => location.hash);
      const tlOf = h => new URLSearchParams(h.replace(/^#/, '')).get('tl');
      check(`${width} ${name}: URL lane order unchanged`, tlOf(hash1) === tlOf(hash0) || (tlOf(hash0) == null && (tlOf(hash1) == null || tlOf(hash1) === '1')), tlOf(hash1));
      check(`${width} ${name}: no drag marks after release`, (await marks(p)) === 0, null);
      // a normal drag still commits afterwards, and ↑ still works
      await startDrag(p);
      await p.mouse.up();
      const moved = await laneIds(p);
      check(`${width} ${name}: a normal drop still commits`, moved[2] === before[0], moved.slice(0, 3));
      await p.locator('.tl-mv[data-lane="' + before[0] + '"][data-lane-mv="-1"]').click();
      check(`${width} ${name}: ↑ button still moves the lane`, (await laneIds(p))[1] === before[0], null);
      if (name === 'escape') await p.screenshot({ path: `${out}${width}-after-escape-cancel.jpg`, type: 'jpeg', quality: 60 });
      await c.close();
    }
  }
} finally {
  await b.close();
}
check('no page errors', errors.length === 0, errors.slice(0, 5));
const pass = results.filter(r => r.pass).length;
writeFileSync(out + 'tl13-cancel-probe.json', JSON.stringify({ pass, total: results.length, results, errors }, null, 1));
console.log(`${pass}/${results.length} passed`);
process.exit(pass === results.length ? 0 : 1);
