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
    '\nthis.labelPlacement = labelPlacement; this.dotTip = dotTip; this.RING = LBL_RING; this.DOTW = LBL_DOTW;' +
    ' this.compactOffsetY = compactOffsetY; this.compactFit = compactFit; this.MARGIN = LBL_MARGIN;',
  ctx,
);
const { labelPlacement, dotTip, RING, DOTW, compactOffsetY, compactFit, MARGIN } = ctx;
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

// G55-O1: compact framing centres in any open strip that still holds the selected label (measured height), its focus
// ring and a margin on both sides; the old 120 px step is gone.
const centred = (H: number, a: number, b: number) => Math.max(-H * 0.3, Math.min(H * 0.3, H / 2 - (a + b) / 2));

test('compact framing: the fit is the measured label height plus ring and margin on both sides', () => {
  assert.equal(compactFit(24), 24 + 2 * (RING + MARGIN));
  assert.equal(compactFit(24), 48);
  assert.equal(compactFit(30), 54);
});

test('compact framing: the former 119/120/121 px boundary now centres on all three (no 171 px jump)', () => {
  const H = 608;
  const a = 373;
  const fit = compactFit(26);
  const at = (gap: number) => compactOffsetY(H, a, a + gap, fit);
  for (const gap of [119, 120, 121]) assert.equal(at(gap), centred(H, a, a + gap), `gap ${gap}`);
  assert.ok(Math.abs(at(120) - at(119)) <= 0.5 + 1e-9);
  assert.ok(Math.abs(at(121) - at(120)) <= 0.5 + 1e-9);
});

test('compact framing: below the fit keeps the fixed shift; at and above it centres', () => {
  const H = 844;
  const a = 380;
  for (const lh of [24, 26, 30]) {
    const fit = compactFit(lh);
    assert.equal(compactOffsetY(H, a, a + fit - 1, fit), H * 0.07, `label ${lh}: fit-1`);
    for (const gap of [fit, fit + 1]) {
      const oy = compactOffsetY(H, a, a + gap, fit);
      assert.equal(oy, centred(H, a, a + gap), `label ${lh}: gap ${gap}`);
      // the selected label (at the view centre) with ring and margin lies inside the strip
      const c = H / 2 - oy;
      assert.ok(c - lh / 2 - RING - MARGIN >= a - 1e-9 && c + lh / 2 + RING + MARGIN <= a + gap + 1e-9);
    }
  }
});

test('compact framing: the default fit (no label measured) is 48 px', () => {
  const H = 844;
  assert.equal(compactOffsetY(H, 400, 447), H * 0.07);
  assert.equal(compactOffsetY(H, 400, 448), centred(H, 400, 448));
});

test('compact framing: the centring shift is clamped to 30 % of the height both ways', () => {
  const H = 844;
  assert.equal(compactOffsetY(H, 0, 130), H * 0.3);
  assert.equal(compactOffsetY(H, 714, 844), -H * 0.3);
  // a symmetric open area needs no shift
  assert.equal(compactOffsetY(H, 100, 744), 0);
});

test('compact framing: one px more open area moves the view by half a px throughout the open regime', () => {
  const H = 844;
  const fit = compactFit(26);
  for (let gap = fit; gap < 400; gap++) {
    const d = compactOffsetY(H, 300, 301 + gap, fit) - compactOffsetY(H, 300, 300 + gap, fit);
    assert.ok(Math.abs(d) <= 0.5 + 1e-9, `gap ${gap}: step ${d}`);
  }
});
