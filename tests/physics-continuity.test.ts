import assert from 'node:assert/strict';
import test from 'node:test';
import {
  capPlanarVelocity,
  orbitalSpeed,
  rocheLobeRadius,
  runFixedSteps,
  tidalTransferRate,
} from '../src/physics-continuity.ts';

test('fixed-step runner advances deterministically and caps catch-up work', () => {
  let simulated = 0;
  const ordinary = runFixedSteps(0, 0.1, 1, 0.02, 10, dt => (simulated += dt));
  assert.equal(ordinary.steps, 4);
  assert.ok(Math.abs(simulated - 0.08) < 1e-9);
  assert.equal(ordinary.dropped, false);

  const overloaded = runFixedSteps(0, 0.4, 10, 0.02, 5, () => undefined);
  assert.equal(overloaded.steps, 5);
  assert.equal(overloaded.dropped, true);
  assert.ok(overloaded.accumulator <= 0.01);
});

test('orbital and Roche helpers react to mass and separation', () => {
  assert.ok(orbitalSpeed(0.82, 1, 200, 10) > orbitalSpeed(0.82, 1, 100, 10));
  assert.equal(orbitalSpeed(0.82, 0, 200, 10), 0);
  const close = rocheLobeRadius(10, 10, 100);
  const wide = rocheLobeRadius(20, 10, 100);
  assert.ok(close > 0);
  assert.ok(wide > close);
});

test('tidal transfer rises smoothly near a massive receiver', () => {
  const faint = tidalTransferRate(2, 0.2, 2);
  const strong = tidalTransferRate(2, 0.9, 20);
  assert.ok(strong > faint);
  assert.equal(tidalTransferRate(2, 0, 20), 0);
});

test('velocity caps preserve direction while limiting unstable impulses', () => {
  const velocity = { x: 30, z: 40 };
  capPlanarVelocity(velocity, 10);
  assert.ok(Math.abs(Math.hypot(velocity.x, velocity.z) - 10) < 1e-9);
  assert.ok(Math.abs(velocity.x / velocity.z - 0.75) < 1e-9);
});
