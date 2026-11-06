import assert from 'node:assert/strict';
import test from 'node:test';
import { CORE_CAPTURE_SPEED, CORE_MERGE_SPEED, passesThrough } from '../src/galaxy-encounter-model.ts';

test('a fast first pass between two model cores flies through; a slowed pass coalesces', () => {
  assert.equal(passesThrough(false, true, true, CORE_MERGE_SPEED + 6), true);
  assert.equal(passesThrough(false, true, true, CORE_MERGE_SPEED - 1), false);
});

test('stars of different galaxies never touch in the collisionless approximation', () => {
  for (const speed of [0, 1, 50]) assert.equal(passesThrough(false, false, false, speed), true);
});

test('a core captures only a star nearly at rest relative to it', () => {
  assert.equal(passesThrough(false, true, false, CORE_CAPTURE_SPEED + 1), true);
  assert.equal(passesThrough(false, false, true, CORE_CAPTURE_SPEED - 1), false);
  assert.equal(passesThrough(true, true, false, CORE_CAPTURE_SPEED + 1), true);
  assert.equal(passesThrough(true, true, false, 1), false);
  // Ordinary members of one galaxy still collide normally.
  assert.equal(passesThrough(true, false, false, 30), false);
});
