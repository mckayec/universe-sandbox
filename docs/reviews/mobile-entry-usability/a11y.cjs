// Emulated accessibility checks for PR #44 (Claude, 2026-11-06).
// Usage: node a11y.cjs  (preview server on 127.0.0.1:4173; writes shots/a11y-*.jpg)
const { chromium } = require('playwright');
const URL = 'http://127.0.0.1:4173/';
const ARGS = ['--use-gl=swiftshader', '--enable-webgl', '--ignore-gpu-blocklist'];
const phone = (w, h, extra = {}) => ({ viewport: { width: w, height: h }, deviceScaleFactor: 2, isMobile: true, hasTouch: true, ...extra });

async function open(b, opts) {
  const ctx = await b.newContext(opts);
  const p = await ctx.newPage();
  const errs = [];
  p.on('console', m => m.type() === 'error' && errs.push(m.text()));
  p.on('pageerror', e => errs.push(String(e)));
  await p.goto(URL, { waitUntil: 'load' });
  await p.waitForTimeout(2500);
  return { ctx, p, errs };
}

// Visible controls clipped by the viewport or overlapping another visible control.
const layoutProbe = () => {
  const els = [...document.querySelectorAll('button, select, input[type=range]')].filter(el => {
    const r = el.getBoundingClientRect();
    const cs = getComputedStyle(el);
    return r.width && r.height && cs.visibility !== 'hidden' && cs.display !== 'none' && !el.closest('[hidden]');
  });
  const name = el => el.id || el.dataset.builder || el.dataset.choice || el.dataset.speed || el.textContent.trim().slice(0, 16);
  const clipped = els
    .filter(el => {
      const r = el.getBoundingClientRect();
      return r.left < -1 || r.right > innerWidth + 1 || r.top < -1 || r.bottom > innerHeight + 1;
    })
    .filter(el => !el.closest('.tool-panel-body, .scenario-grid, .object-info, .universe-toolbar'))
    .map(name);
  const textOverflow = els
    .filter(el => el.scrollWidth > el.clientWidth + 2 && getComputedStyle(el).overflow !== 'visible')
    .map(name);
  return { clipped, textOverflow, scrollW: document.documentElement.scrollWidth, w: innerWidth };
};

async function placeAndSelect(p, x, y) {
  await p.click('#pause');
  await p.touchscreen.tap(x, y);
  await p.waitForTimeout(600);
}

(async () => {
  const b = await chromium.launch({ args: ARGS });
  const out = {};

  // 1. Reduced motion: preference reaches app and CSS; camera moves are instant.
  {
    const { ctx, p, errs } = await open(b, phone(390, 844, { reducedMotion: 'reduce' }));
    out.reducedMotion = await p.evaluate(() => ({
      mq: matchMedia('(prefers-reduced-motion: reduce)').matches,
      effectsLabel: document.querySelector('#effects-mode').textContent,
      toastTransition: getComputedStyle(document.querySelector('.toast')).transitionDuration,
    }));
    await placeAndSelect(p, 195, 330);
    out.reducedMotion.countAfterTap = await p.textContent('#count');
    out.reducedMotion.errs = errs.slice(0, 5);
    await p.screenshot({ path: 'shots/a11y-390x844-reduced-motion.jpg', quality: 60 });
    await ctx.close();
  }

  // 2. Enlarged text: root font-size 200% (approximates browser text scaling; not iOS Dynamic Type).
  for (const [w, h] of [[390, 844], [844, 390]]) {
    const { ctx, p, errs } = await open(b, phone(w, h));
    await p.addStyleTag({ content: 'html{font-size:200% !important;-webkit-text-size-adjust:200% !important}' });
    await p.waitForTimeout(500);
    const pxFonts = await p.evaluate(() => {
      const fs = [...document.querySelectorAll('button, .touch-hint, .toast, .panel-title')]
        .map(el => getComputedStyle(el).fontSize);
      return [...new Set(fs)].slice(0, 8);
    });
    out[`text200_${w}x${h}`] = { ...(await p.evaluate(layoutProbe)), sampledFontSizes: pxFonts, errs: errs.slice(0, 5) };
    await p.screenshot({ path: `shots/a11y-${w}x${h}-text200.jpg`, quality: 60 });
    await ctx.close();
  }

  // 3. Rotation with tool panel and selected-object sheet open.
  {
    const { ctx, p, errs } = await open(b, phone(390, 844));
    await placeAndSelect(p, 195, 330);
    await p.click('#inspect-mode');
    await p.waitForTimeout(300);
    const before = await p.evaluate(() => ({
      count: document.querySelector('#count').textContent,
      sheetOpen: !document.querySelector('#info-panel').classList.contains('empty'),
    }));
    // try selecting the placed body if the tap did not select it
    if (!before.sheetOpen) {
      await p.touchscreen.tap(195, 330);
      await p.waitForTimeout(500);
    }
    const rot = [];
    for (const [w, h] of [[844, 390], [390, 844], [844, 390]]) {
      await p.setViewportSize({ width: w, height: h });
      await p.waitForTimeout(800);
      const st = await p.evaluate(() => ({
        count: document.querySelector('#count').textContent,
        sheetOpen: !document.querySelector('#info-panel').classList.contains('empty'),
        toolsExpanded: document.querySelector('#panel-toggle').getAttribute('aria-expanded'),
      }));
      rot.push({ size: `${w}x${h}`, ...st, ...(await p.evaluate(layoutProbe)) });
      await p.screenshot({ path: `shots/a11y-rotate-${w}x${h}-${rot.length}.jpg`, quality: 60 });
    }
    out.rotation = { before, steps: rot, errs: errs.slice(0, 5) };
    await ctx.close();
  }

  // 4. Keyboard focus order vs visual order of the compact toolbar (Undo/Redo moved by CSS order).
  {
    const { ctx, p, errs } = await open(b, { viewport: { width: 390, height: 844 }, deviceScaleFactor: 1 });
    const order = await p.evaluate(() => {
      const items = [...document.querySelectorAll('.universe-toolbar > *')];
      const dom = items.map(el => el.id);
      const visual = items
        .map(el => ({ id: el.id, x: el.getBoundingClientRect().left, y: el.getBoundingClientRect().top }))
        .sort((a, b) => a.y - b.y || a.x - b.x)
        .map(o => o.id);
      return { dom, visual, compact: matchMedia('(max-width: 800px)').matches };
    });
    // Tab sequence from page start
    await p.keyboard.press('Tab');
    const seq = [];
    for (let i = 0; i < 24; i++) {
      seq.push(await p.evaluate(() => {
        const a = document.activeElement;
        const r = a.getBoundingClientRect();
        const inView = r.right > 0 && r.left < innerWidth && r.bottom > 0 && r.top < innerHeight;
        const ring = getComputedStyle(a).outlineStyle !== 'none' || getComputedStyle(a).boxShadow !== 'none';
        return `${a.id || a.dataset.builder || a.dataset.choice || a.tagName}${inView ? '' : '(offscreen)'}${ring ? '' : '(no-ring)'}`;
      }));
      await p.keyboard.press('Tab');
    }
    out.focusOrder = { ...order, tabSequence: seq, errs: errs.slice(0, 5) };
    await ctx.close();
  }

  console.log(JSON.stringify(out, null, 1));
  await b.close();
})();
