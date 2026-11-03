import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import vm from 'node:vm';

// engine.js is a large browser module; run only its pure globe-label geometry helpers (S46-C2, S47-C2).
const src = readFileSync(new URL('../public/atlas/engine.js', import.meta.url), 'utf8');
const start = src.indexOf('const LBL_RING');
const end = src.indexOf('function layoutSiteLabels');
assert.ok(start > 0 && end > start, 'label geometry helpers found in engine.js');
const ctx: Record<string, any> = {};
vm.runInNewContext(
  src.slice(start, end) +
    '\nthis.labelPlacement = labelPlacement; this.dotTip = dotTip; this.RING = LBL_RING; this.DOTW = LBL_DOTW;',
  ctx,
);
const { labelPlacement, dotTip, RING, DOTW } = ctx;
const W = 390;

// the box a shown label occupies on screen, focus ring included
function extent(px: number, fw: number, sel: boolean) {
  const p = labelPlacement(px, W, fw, false, sel, true);
  if (p.edgeOut) return null;
  const dot = p.edgeDot;
  const left = dot ? px - 7 : p.x0;
  const right = dot ? px - 7 + DOTW : p.x0 + fw;
  return { left: left - RING, right: right + RING, p };
}

test('S47-C2 left edge: the reviewer case x=2 (full width 110) is no longer partly off screen', () => {
  assert.equal(labelPlacement(2, W, 110, false, true, true).edgeOut, true);
  for (let px = 0; px <= 30; px += 0.5) {
    const e = extent(px, 110, true);
    if (e) assert.ok(e.left >= 0, `px=${px} left ${e.left}`);
  }
});

test('S46-C2 right edge: the selected name still flips left of its pin', () => {
  const p = labelPlacement(385 - 20, W, 110, false, true, true);
  assert.equal(p.flip, true);
  assert.ok(p.x0 >= RING && p.x0 + 110 <= W - RING);
});

test('every shown label box, ring included, stays inside the window for short and long names, both edges', () => {
  for (const fw of [40, 110, 200, 430])
    for (const sel of [true, false])
      for (let px = -20; px <= W + 20; px += 0.5) {
        const e = extent(px, fw, sel);
        if (!e) continue;
        assert.ok(e.left >= -0.001 && e.right <= W + 0.001, `fw=${fw} sel=${sel} px=${px}: ${e.left}..${e.right}`);
      }
});

test('a name too wide for either side collapses to a selected pin (reviewer case x=195, width 430)', () => {
  const p = labelPlacement(195, W, 430, false, true, true);
  assert.equal(p.flip, false);
  assert.equal(p.edgeDot, true);
  assert.equal(p.edgeOut, false);
});

test('a collapsed pin tooltip opens on the roomier side and is no wider than that room', () => {
  for (let px = 11; px <= W - 17; px += 1) {
    const t = dotTip(px, W);
    const bl = px - 7;
    if (t.left) {
      const rightEdge = bl + DOTW - 24;
      assert.ok(rightEdge - t.room >= RING - 0.001, `px=${px}: left tooltip from ${rightEdge - t.room}`);
    } else {
      assert.ok(bl + 24 + t.room <= W - RING + 0.001, `px=${px}: right tooltip to ${bl + 24 + t.room}`);
    }
    assert.ok(t.room >= 150, `px=${px}: room ${t.room} at 390 px is at least ~40% of the window`);
  }
  assert.equal(dotTip(370, W).left, true);
  assert.equal(dotTip(20, W).left, false);
});

test('desktop (not compact) keeps the previous behaviour: no edge hiding or flipping', () => {
  const p = labelPlacement(2, 1440, 110, false, true, false);
  assert.equal(p.edgeOut, false);
  assert.equal(p.flip, false);
  assert.equal(p.edgeDot, false);
});
