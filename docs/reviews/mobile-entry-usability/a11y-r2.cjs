// PR #44 accessibility return 2 (Claude, 2026-11-07): A11Y-1 enlarged-label availability and
// A11Y-2 enabled Undo/Redo keyboard order. Assertion-based: exits non-zero on any failure.
// Usage: node a11y-r2.cjs [outdir]  (preview server on 127.0.0.1:4173)
// Text scaling is approximated by root font-size + -webkit-text-size-adjust; not native Dynamic Type.
const { chromium } = require('playwright');
const assert = require('node:assert/strict');
const URL = 'http://127.0.0.1:4173/';
const OUT = process.argv[2] || '.';
const ARGS = ['--use-gl=swiftshader', '--enable-webgl', '--ignore-gpu-blocklist'];
const phone = (w, h) => ({ viewport: { width: w, height: h }, deviceScaleFactor: 1, isMobile: true, hasTouch: true });
const results = [];
const fails = [];
function check(label, fn) {
  try { fn(); results.push(['pass', label]); } catch (e) { fails.push(label); results.push(['FAIL', label + ': ' + e.message.split('\n')[0]]); }
}

async function open(b, opts) {
  const ctx = await b.newContext(opts);
  const p = await ctx.newPage();
  const errs = [];
  p.on('pageerror', (e) => errs.push(String(e)));
  p.on('console', (m) => m.type() === 'error' && errs.push(m.text()));
  await p.goto(URL, { waitUntil: 'load' });
  await p.waitForTimeout(2000);
  return { ctx, p, errs };
}

// Label availability and layout of the top bar and the first toolbar row.
const probe = () => {
  const box = (el) => el.getBoundingClientRect();
  const out = { labels: {}, overlaps: [], offscreen: [], scrollW: document.documentElement.scrollWidth, w: innerWidth };
  for (const id of ['universes-button', 'exhibits-button']) {
    const el = document.getElementById(id);
    const r = box(el);
    const range = document.createRange();
    range.selectNodeContents(el);
    const t = [...range.getClientRects()];
    const inside = t.every((q) => q.left >= r.left - 0.5 && q.right <= r.right + 0.5 && q.top >= r.top - 0.5 && q.bottom <= r.bottom + 0.5);
    out.labels[id] = {
      text: el.textContent,
      lines: new Set(t.map((q) => Math.round(q.top))).size,
      textInside: inside,
      noScrollClip: el.scrollWidth <= el.clientWidth + 1 && el.scrollHeight <= el.clientHeight + 1,
      ellipsis: getComputedStyle(el).textOverflow === 'ellipsis',
      w: Math.round(r.width),
      h: Math.round(r.height),
    };
  }
  const ctrls = ['universes-button', 'exhibits-button', 'fullscreen-button', 'universe-home', 'undo', 'redo'].map((id) => document.getElementById(id));
  for (const el of [...ctrls, document.getElementById('clear'), document.getElementById('pause')].filter(Boolean)) {
    const r = box(el);
    if (r.width && (r.left < -1 || r.right > innerWidth + 1 || r.top < -1 || r.bottom > innerHeight + 1)) {
      // Toolbar entries may scroll horizontally inside the toolbar; only the top bar must be fully on screen.
      if (!el.closest('.universe-toolbar')) out.offscreen.push(el.id);
    }
  }
  const tb = box(document.querySelector('.universe-toolbar'));
  for (const id of ['universes-button', 'exhibits-button', 'fullscreen-button']) {
    const r = box(document.getElementById(id));
    if (r.bottom > tb.top + 0.5) out.overlaps.push(id + '/universe-toolbar');
  }
  const a = box(document.getElementById('clear'));
  const toolsBtn = document.querySelector('#tools-toggle, .tools-toggle, [data-tools-toggle]');
  if (toolsBtn) {
    const t = toolsBtn.getBoundingClientRect();
    if (t.width && a.width && !(a.right <= t.left || t.right <= a.left || a.bottom <= t.top || t.bottom <= a.top)) out.overlaps.push('clear/tools');
  }
  return out;
};

async function textScale(b) {
  const cases = [[390, 844], [844, 390], [320, 568]];
  for (const [w, h] of cases) {
    for (const pct of [100, 150, 200]) {
      const { ctx, p, errs } = await open(b, phone(w, h));
      await p.addStyleTag({ content: `html{font-size:${pct}% !important;-webkit-text-size-adjust:${pct}% !important}` });
      await p.waitForTimeout(400);
      const r = await p.evaluate(probe);
      const tag = `${w}x${h}@${pct}%`;
      for (const [id, l] of Object.entries(r.labels)) {
        check(`${tag} ${id} full label visible (${l.lines} line(s), ${l.w}x${l.h})`, () => {
          assert.ok(l.textInside && l.noScrollClip && !l.ellipsis, JSON.stringify(l));
          assert.ok(l.w >= 44 && l.h >= 44, 'target under 44 px');
        });
        if (w >= 390) check(`${tag} ${id} label on one line`, () => assert.equal(l.lines, 1));
      }
      check(`${tag} no top-bar control off screen`, () => assert.deepEqual(r.offscreen, []));
      check(`${tag} no overlap`, () => assert.deepEqual(r.overlaps, []));
      check(`${tag} no horizontal page overflow`, () => assert.ok(r.scrollW <= r.w, `${r.scrollW} > ${r.w}`));
      // Activation: each labelled control still opens its sheet at this scale.
      for (const id of ['universes-button', 'exhibits-button']) {
        await p.tap('#' + id);
        await p.waitForTimeout(400);
        const opened = await p.evaluate(() => [...document.querySelectorAll('.drawer, .sheet, dialog, [role=dialog], .universe-picker, .exhibit-panel')].some((el) => el.getBoundingClientRect().height > 0 && getComputedStyle(el).visibility !== 'hidden' && !el.hidden));
        check(`${tag} ${id} activates`, () => assert.ok(opened));
        await p.keyboard.press('Escape');
        await p.waitForTimeout(300);
      }
      check(`${tag} no page errors`, () => assert.deepEqual(errs, []));
      if (pct !== 100) await p.screenshot({ path: `${OUT}/a11y-r2-${w}x${h}-text${pct}.jpg`, quality: 60, clip: { x: 0, y: 0, width: w, height: Math.min(h, 200) } });
      await ctx.close();
    }
  }
}

async function undoRedoKeyboard(b) {
  const cases = [['compact portrait', phone(390, 844)], ['compact landscape', phone(844, 390)], ['desktop', { viewport: { width: 1440, height: 900 } }]];
  for (const [label, opts] of cases) {
    const { ctx, p, errs } = await open(b, opts);
    const domOrder = await p.evaluate(() => [...document.querySelector('.universe-toolbar').children].slice(0, 4).map((e) => e.id));
    check(`${label}: DOM order`, () => assert.deepEqual(domOrder, ['universe-home', 'undo', 'redo', 'group-select']));
    const visual = await p.evaluate(() => ['universe-home', 'undo', 'redo', 'group-select'].map((id) => Math.round(document.getElementById(id).getBoundingClientRect().left)));
    check(`${label}: visual order matches DOM (${visual})`, () => assert.deepEqual([...visual].sort((a, b) => a - b), visual));
    // Disabled at start: Tab skips Undo/Redo.
    await p.focus('#universe-home');
    await p.keyboard.press('Tab');
    const skip = await p.evaluate(() => document.activeElement.id);
    check(`${label}: disabled Undo/Redo skipped (next=${skip})`, () => assert.equal(skip, 'group-select'));
    // Make an edit: Clear all enables Undo.
    const before = await p.textContent('#count');
    await p.click('#clear');
    await p.waitForTimeout(400);
    const undoEnabled = await p.evaluate(() => !document.getElementById('undo').disabled);
    check(`${label}: Undo enabled after Clear all`, () => assert.ok(undoEnabled));
    await p.focus('#universe-home');
    const seq = [];
    for (let i = 0; i < 2; i++) {
      await p.keyboard.press('Tab');
      seq.push(await p.evaluate(() => document.activeElement.id));
    }
    check(`${label}: forward Tab All space -> ${seq}`, () => assert.deepEqual(seq, ['undo', 'group-select']));
    await p.keyboard.press('Shift+Tab');
    const back = await p.evaluate(() => document.activeElement.id);
    check(`${label}: Shift+Tab returns to Undo`, () => assert.equal(back, 'undo'));
    const vis = await p.evaluate(() => {
      const el = document.activeElement;
      const r = el.getBoundingClientRect();
      const tb = document.querySelector('.universe-toolbar').getBoundingClientRect();
      const cs = getComputedStyle(el);
      return { on: r.left >= tb.left - 1 && r.right <= tb.right + 1, ring: cs.outlineStyle !== 'none' || cs.boxShadow !== 'none' };
    });
    check(`${label}: focused Undo visible with focus style`, () => assert.ok(vis.on && vis.ring, JSON.stringify(vis)));
    await p.keyboard.press('Enter');
    await p.waitForTimeout(500);
    const afterUndo = await p.evaluate(() => ({ count: document.getElementById('count').textContent, undo: !document.getElementById('undo').disabled, redo: !document.getElementById('redo').disabled, focus: document.activeElement.id }));
    check(`${label}: Enter on Undo restores scene (${before} -> ${afterUndo.count})`, () => assert.equal(afterUndo.count, before));
    // Focus stays on Undo while it is enabled; when that was the last Undo it moves to the now-enabled Redo.
    check(`${label}: Redo enabled, focus retained (${afterUndo.focus}, undo enabled=${afterUndo.undo})`, () => assert.ok(afterUndo.redo && afterUndo.focus === (afterUndo.undo ? 'undo' : 'redo'), JSON.stringify(afterUndo)));
    if (afterUndo.focus === 'undo') await p.keyboard.press('Tab');
    const toRedo = await p.evaluate(() => document.activeElement.id);
    check(`${label}: keyboard reaches Redo`, () => assert.equal(toRedo, 'redo'));
    await p.keyboard.press('Space');
    await p.waitForTimeout(500);
    const afterRedo = await p.evaluate(() => ({ count: document.getElementById('count').textContent, focus: document.activeElement.id, redo: !document.getElementById('redo').disabled, undo: !document.getElementById('undo').disabled }));
    check(`${label}: Space on Redo re-applies Clear all (count ${afterRedo.count})`, () => assert.equal(afterRedo.count, '0'));
    check(`${label}: focus retained after last Redo (${afterRedo.focus || 'body'})`, () => assert.ok(!afterRedo.redo && afterRedo.undo && afterRedo.focus === 'undo', JSON.stringify(afterRedo)));
    await p.keyboard.press('Shift+Tab');
    const prev = await p.evaluate(() => document.activeElement.id);
    check(`${label}: Shift+Tab from Undo -> All space`, () => assert.equal(prev, 'universe-home'));
    check(`${label}: no page errors`, () => assert.deepEqual(errs, []));
    await p.screenshot({ path: `${OUT}/a11y-r2-${label.replace(/ /g, '-')}-focus.jpg`, quality: 60, clip: { x: 0, y: 0, width: opts.viewport.width, height: 200 } });
    await ctx.close();
  }
}

(async () => {
  const b = await chromium.launch({ args: ARGS });
  await textScale(b);
  await undoRedoKeyboard(b);
  await b.close();
  for (const [s, l] of results) console.log(s, l);
  console.log(`${results.length - fails.length}/${results.length} pass`);
  process.exit(fails.length ? 1 : 0);
})();
