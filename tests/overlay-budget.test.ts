import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { overlayBudget } from '../src/overlay-budget.ts';

test('overlay budget leaves both unconstrained when they fit', () => {
  const b = overlayBudget({ stackTop: 112, dockBottom: 778, stackNeed: 200, dockNeed: 220, gap: 8 });
  assert.deepEqual(b, { tight: false, stackMax: null, dockMax: null });
});

test('overlay budget is inactive when either side shows nothing', () => {
  for (const [stackNeed, dockNeed] of [
    [0, 500],
    [500, 0],
  ])
    assert.equal(overlayBudget({ stackTop: 112, dockBottom: 384, stackNeed, dockNeed }).tight, false);
});

test('overlay budget never lets the two exceed the band (720x450 and 320x568 shapes)', () => {
  const cases = [
    { stackTop: 112, dockBottom: 384, stackNeed: 200, dockNeed: 210 },
    { stackTop: 206, dockBottom: 502, stackNeed: 230, dockNeed: 220 },
    { stackTop: 112, dockBottom: 200, stackNeed: 400, dockNeed: 400 },
    { stackTop: 112, dockBottom: 384, stackNeed: 60, dockNeed: 600 },
    { stackTop: 112, dockBottom: 384, stackNeed: 600, dockNeed: 60 },
  ];
  for (const c of cases) {
    const b = overlayBudget({ ...c, gap: 8, dockFloor: 120 });
    assert.equal(b.tight, true);
    const band = c.dockBottom - c.stackTop - 8;
    assert.ok(b.stackMax! + b.dockMax! <= band, JSON.stringify({ c, b }));
    assert.ok(b.stackMax! >= 0 && b.dockMax! >= 0);
    assert.ok(b.stackMax! <= c.stackNeed && b.dockMax! <= c.dockNeed);
  }
});

test('overlay budget keeps the dock floor and returns unused stack space to the dock', () => {
  const big = overlayBudget({ stackTop: 112, dockBottom: 384, stackNeed: 400, dockNeed: 300, gap: 8, dockFloor: 120 });
  assert.equal(big.dockMax, 120);
  assert.equal(big.stackMax, 264 - 120);
  const smallStack = overlayBudget({ stackTop: 112, dockBottom: 384, stackNeed: 60, dockNeed: 600, gap: 8 });
  assert.equal(smallStack.stackMax, 60);
  assert.equal(smallStack.dockMax, 264 - 60);
  const smallDock = overlayBudget({ stackTop: 112, dockBottom: 384, stackNeed: 600, dockNeed: 70, gap: 8 });
  assert.equal(smallDock.dockMax, 70);
  assert.equal(smallDock.stackMax, 264 - 70);
});

test('overlay budget handles invalid and inverted geometry', () => {
  const b = overlayBudget({ stackTop: 500, dockBottom: 300, stackNeed: 100, dockNeed: 100 });
  assert.deepEqual(b, { tight: true, stackMax: 0, dockMax: 0 });
  const n = overlayBudget({ stackTop: NaN, dockBottom: 300, stackNeed: Infinity, dockNeed: 100 });
  assert.equal(n.tight, false);
});

test('overlay budget is wired: bound from main.ts, applied only on compact, CSS limits both sides', () => {
  const main = readFileSync(new URL('../src/main.ts', import.meta.url), 'utf8');
  const ui = readFileSync(new URL('../src/ui/overlay-layout.ts', import.meta.url), 'utf8');
  const css = readFileSync(new URL('../src/style.css', import.meta.url), 'utf8');
  assert.match(main, /bindOverlayBudget\(\);/);
  assert.match(ui, /max-width: 800px/);
  assert.match(ui, /--overlay-stack-max/);
  assert.match(css, /\.overlay-tight \.overlay-stack \{\s*max-height: var\(--overlay-stack-max\);/);
  assert.match(css, /\.overlay-tight \.dock \{\s*max-height: var\(--dock-max\);/);
});
