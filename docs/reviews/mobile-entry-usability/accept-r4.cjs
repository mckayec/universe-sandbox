// PR #44 remaining emulated acceptance (Claude, 2026-11-07), per implementation-review-a11y-r3.md follow-ups:
// live resize compact<->desktop and text-size changes on ONE page, short-landscape panel reachability,
// rotation with sheets open, reduced motion, repeated/long-press touch, and no-WebGL resilience.
// Assertion-based: exits non-zero on any failure. Chromium emulation only, not native devices.
// Usage: node accept-r4.cjs [outdir]  (preview server on 127.0.0.1:4173)
const { chromium } = require('playwright');
const assert = require('node:assert/strict');
const URL = 'http://127.0.0.1:4173/';
const OUT = process.argv[2] || '.';
const GL = ['--use-gl=swiftshader', '--enable-webgl', '--ignore-gpu-blocklist'];
const results = [];
let failed = 0;
function check(label, fn) {
  try {
    fn();
    results.push('pass  ' + label);
  } catch (e) {
    failed++;
    results.push('FAIL  ' + label + ': ' + e.message.split('\n')[0]);
  }
}

const layout = () => {
  const vis = (id) => {
    const el = document.getElementById(id);
    if (!el) return { id, missing: true };
    const r = el.getBoundingClientRect();
    const cs = getComputedStyle(el);
    const shown = cs.display !== 'none' && cs.visibility !== 'hidden' && r.width > 0 && r.height > 0;
    const on = r.left >= -1 && r.right <= innerWidth + 1 && r.top >= -1 && r.bottom <= innerHeight + 1;
    return { id, shown, on, w: r.width, h: r.height };
  };
  return {
    w: innerWidth,
    h: innerHeight,
    scrollW: document.documentElement.scrollWidth,
    count: document.getElementById('count').textContent,
    top: ['universes-button', 'exhibits-button', 'fullscreen-button', 'count'].map(vis),
    toggle: vis('panel-toggle'),
    pause: vis('pause'),
    clear: vis('clear'),
  };
};

async function open(b, opts) {
  const ctx = await b.newContext(opts);
  const p = await ctx.newPage();
  const errs = [];
  p.on('pageerror', (e) => errs.push(String(e)));
  p.on('console', (m) => m.type() === 'error' && errs.push(m.text()));
  await p.goto(URL, { waitUntil: 'load' });
  await p.waitForTimeout(1800);
  return { ctx, p, errs };
}

function topOk(tag, L) {
  check(`${tag}: no horizontal page overflow (${L.scrollW}<=${L.w})`, () => assert.ok(L.scrollW <= L.w + 1));
  for (const t of L.top) check(`${tag}: ${t.id} visible on screen`, () => assert.ok(t.shown && t.on, JSON.stringify(t)));
  check(`${tag}: Pause reachable`, () => assert.ok(L.pause.shown, JSON.stringify(L.pause)));
}

(async () => {
  const b = await chromium.launch({ args: GL });

  // 1. Live resize and text-size changes on one page (no reload).
  {
    const { ctx, p, errs } = await open(b, { viewport: { width: 1440, height: 900 }, hasTouch: true });
    const seq = [
      [1440, 900, 100],
      [390, 844, 100],
      [390, 844, 200],
      [844, 390, 200],
      [1280, 800, 200],
      [1280, 800, 100],
      [320, 568, 150],
      [1440, 900, 100],
    ];
    for (const [w, h, pct] of seq) {
      await p.setViewportSize({ width: w, height: h });
      await p.evaluate((s) => (document.documentElement.style.fontSize = s), pct === 100 ? '' : pct + '%');
      await p.waitForTimeout(450);
      topOk(`live ${w}x${h}@${pct}%`, await p.evaluate(layout));
    }
    await p.screenshot({ path: `${OUT}/r4-live-final-1440.png` });
    check('live resize: no console/page errors', () => assert.deepEqual(errs, []));
    await ctx.close();
  }

  // 2. Short landscape: tool panel body and info sheet reachable; rotation with sheets open.
  for (const [w, h] of [
    [844, 390],
    [667, 375],
    [568, 320],
  ]) {
    const { ctx, p, errs } = await open(b, { viewport: { width: w, height: h }, isMobile: true, hasTouch: true });
    const tag = `landscape ${w}x${h}`;
    const L = await p.evaluate(layout);
    topOk(tag, L);
    check(`${tag}: tools toggle on screen`, () => assert.ok(L.toggle.shown && L.toggle.on, JSON.stringify(L.toggle)));
    await p.tap('#panel-toggle');
    await p.waitForTimeout(300);
    const body = await p.evaluate(() => {
      const el = document.getElementById('tool-panel-body');
      const r = el.getBoundingClientRect();
      const scrollable = el.scrollHeight <= el.clientHeight + 1 || ['auto', 'scroll'].includes(getComputedStyle(el).overflowY);
      const last = [...el.querySelectorAll('button')].pop();
      if (last) last.scrollIntoView({ block: 'nearest' });
      const lr = last ? last.getBoundingClientRect() : null;
      return { top: r.top, bottom: r.bottom, h: innerHeight, scrollable, lastOn: lr && lr.bottom <= innerHeight + 1 && lr.top >= 0 };
    });
    check(`${tag}: toggled tool body fits or scrolls (${JSON.stringify(body)})`, () => assert.ok(body.scrollable));
    check(`${tag}: last tool button reachable on screen`, () => assert.ok(body.lastOn, JSON.stringify(body)));
    // Rotate to portrait with the panel state as-is, then back.
    await p.setViewportSize({ width: h, height: w });
    await p.waitForTimeout(450);
    topOk(`${tag} rotated to portrait (panel toggled)`, await p.evaluate(layout));
    await p.setViewportSize({ width: w, height: h });
    await p.waitForTimeout(450);
    topOk(`${tag} rotated back`, await p.evaluate(layout));
    check(`${tag}: no console/page errors`, () => assert.deepEqual(errs, []));
    await p.screenshot({ path: `${OUT}/r4-${w}x${h}.png` });
    await ctx.close();
  }

  // 3. Universe/exhibit sheets open, then rotate: close control stays reachable.
  {
    const { ctx, p, errs } = await open(b, { viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
    await p.tap('#universes-button');
    await p.waitForTimeout(400);
    for (const [w, h] of [
      [844, 390],
      [390, 844],
    ]) {
      await p.setViewportSize({ width: w, height: h });
      await p.waitForTimeout(450);
      const c = await p.evaluate(() => {
        const el = document.getElementById('universe-close');
        const r = el.getBoundingClientRect();
        return { shown: r.width > 0, on: r.top >= 0 && r.bottom <= innerHeight + 1 && r.right <= innerWidth + 1 && r.left >= 0 };
      });
      check(`universe picker open, rotated to ${w}x${h}: close button on screen`, () => assert.ok(c.shown && c.on, JSON.stringify(c)));
    }
    await p.tap('#universe-close');
    await p.waitForTimeout(300);
    const hidden = await p.evaluate(() => {
      const el = document.getElementById('universe-picker');
      return el.hidden || getComputedStyle(el).display === 'none' || el.getBoundingClientRect().height === 0 || !el.open;
    });
    check('universe picker closes after rotation', () => assert.ok(hidden));
    check('picker rotation: no console/page errors', () => assert.deepEqual(errs, []));
    await ctx.close();
  }

  // 4. Reduced motion: page loads, no errors, transitions/animations effectively disabled on the toolbar.
  {
    const { ctx, p, errs } = await open(b, { viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, reducedMotion: 'reduce' });
    const rm = await p.evaluate(() => ({
      mq: matchMedia('(prefers-reduced-motion: reduce)').matches,
      dur: getComputedStyle(document.getElementById('panel-toggle')).transitionDuration,
    }));
    check('reduced motion: media query active', () => assert.ok(rm.mq));
    check(`reduced motion: toolbar transitions near zero (${rm.dur})`, () =>
      assert.ok(rm.dur.split(',').every((d) => parseFloat(d) <= 0.01)),
    );
    topOk('reduced motion 390x844', await p.evaluate(layout));
    check('reduced motion: no console/page errors', () => assert.deepEqual(errs, []));
    await ctx.close();
  }

  // 5. Repeated taps and a long press on the canvas in Navigate mode never add or clear objects.
  {
    const { ctx, p, errs } = await open(b, { viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
    await p.tap('#navigate-mode').catch(async () => {
      await p.tap('#panel-toggle');
      await p.tap('#navigate-mode');
    });
    const before = await p.evaluate(() => document.getElementById('count').textContent);
    for (let i = 0; i < 6; i++) await p.touchscreen.tap(195, 420);
    const cdp = await ctx.newCDPSession(p);
    await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: 200, y: 400 }] });
    await p.waitForTimeout(900);
    await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
    await p.waitForTimeout(400);
    const after = await p.evaluate(() => document.getElementById('count').textContent);
    check(`navigate: repeated taps + long press keep object count (${before} -> ${after})`, () => assert.equal(after, before));
    check('navigate long-press: no console/page errors', () => assert.deepEqual(errs, []));
    await ctx.close();
  }
  await b.close();

  // 6. No-WebGL resilience: page must not be a blank/broken screen without explanation.
  {
    const nb = await chromium.launch({ args: ['--disable-gpu', '--disable-webgl', '--disable-3d-apis', '--disable-software-rasterizer'] });
    const ctx = await nb.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
    const p = await ctx.newPage();
    const errs = [];
    p.on('pageerror', (e) => errs.push(String(e).slice(0, 160)));
    await p.goto(URL, { waitUntil: 'load' });
    await p.waitForTimeout(1500);
    const s = await p.evaluate(() => ({
      gl: !!document.createElement('canvas').getContext('webgl'),
      text: document.body.innerText.slice(0, 400),
      ui: !!document.getElementById('universes-button'),
      notice: (() => {
        const n = document.getElementById('webgl-notice');
        if (!n) return null;
        const r = n.getBoundingClientRect();
        return { text: n.innerText, on: r.top >= 0 && r.bottom <= innerHeight && r.left >= 0 && r.right <= innerWidth };
      })(),
    }));
    check('no-WebGL: explanatory notice shown on screen', () => assert.ok(s.notice && s.notice.on, JSON.stringify(s.notice)));
    check('no-WebGL: notice names WebGL', () => assert.match(s.notice?.text || '', /WebGL/));
    await p.screenshot({ path: `${OUT}/r4-nowebgl.png` });
    results.push(`info  no-WebGL: webgl=${s.gl} ui=${s.ui} pageerrors=${errs.length} ${JSON.stringify(errs.slice(0, 2))}`);
    results.push(`info  no-WebGL text: ${JSON.stringify(s.text.slice(0, 200))}`);
    await nb.close();
  }

  console.log(results.join('\n'));
  console.log(`\n${results.filter((r) => r.startsWith('pass')).length} passed, ${failed} failed`);
  process.exit(failed ? 1 : 0);
})();
