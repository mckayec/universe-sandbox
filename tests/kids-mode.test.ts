import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import {
  KIDS_CONTROL_IDS,
  cancelArm,
  consumePlacement,
  effectiveFeedbackMode,
  idleDemoAllowed,
  kidsAllowsControl,
  kidsAllowsKey,
  kidsFromQuery,
  objectMenuAllowed,
  toggleArm,
} from '../src/kids-mode.ts';
import { presentEvent } from '../src/feedback.ts';

test('kids gate: only the kids bar and grown-up dialog are operable', () => {
  assert.equal(kidsAllowsControl(false, null), true);
  assert.equal(kidsAllowsControl(true, null), false);
  assert.equal(kidsAllowsControl(true, 'kids-bar'), true);
  assert.equal(kidsAllowsControl(true, 'kids-dialog'), true);
  assert.equal(kidsAllowsControl(true, 'tool-panel'), false);
  assert.deepEqual([...KIDS_CONTROL_IDS].slice(0, 4), ['kids-add', 'kids-pause', 'kids-undo', 'kids-home']);
});

test('kids keys: focus/activation/Escape and Ctrl+Z only', () => {
  for (const key of ['Tab', 'Enter', ' ', 'Escape']) assert.equal(kidsAllowsKey(true, { key }), true, key);
  assert.equal(kidsAllowsKey(true, { key: 'z', ctrlKey: true }), true);
  assert.equal(kidsAllowsKey(true, { key: 'z', metaKey: true }), true);
  assert.equal(kidsAllowsKey(true, { key: 'z', ctrlKey: true, shiftKey: true }), false, 'no redo');
  for (const key of ['b', 'v', 'n', 'f', '0', '+', '-', 'ArrowLeft', 'y', 'Delete'])
    assert.equal(kidsAllowsKey(true, { key }), false, key);
  assert.equal(kidsAllowsKey(true, { key: 'y', ctrlKey: true }), false);
  assert.equal(kidsAllowsKey(false, { key: 'b' }), true);
});

test('kids arm: exactly one placement per armed Add; cancel and repeated taps', () => {
  let arm = { armed: false };
  assert.deepEqual(consumePlacement(arm), { place: false, next: arm }, 'unarmed tap places nothing');
  arm = toggleArm(arm);
  assert.equal(arm.armed, true);
  const first = consumePlacement(arm);
  assert.equal(first.place, true);
  const second = consumePlacement(first.next);
  assert.equal(second.place, false, 'second tap does not place');
  assert.equal(toggleArm(toggleArm({ armed: false })).armed, false, 'pressing Add twice cancels');
  assert.equal(cancelArm().armed, false);
});

test('kids presentation is quiet without changing the adult preference; no idle demo or object menu', () => {
  assert.equal(effectiveFeedbackMode('full', true), 'quiet');
  assert.equal(effectiveFeedbackMode('full', false), 'full');
  assert.equal(presentEvent('simulation', effectiveFeedbackMode('full', true)).banner, false);
  assert.equal(presentEvent('action', effectiveFeedbackMode('full', true)).banner, true, 'failures still shown');
  assert.equal(idleDemoAllowed(true), false);
  assert.equal(idleDemoAllowed(false), true);
  assert.equal(objectMenuAllowed(true), false);
  assert.equal(kidsFromQuery('?kids=1'), true);
  assert.equal(kidsFromQuery('?kids=0'), false);
  assert.equal(kidsFromQuery(''), false);
});

test('kids wiring: handlers gate at the event, placements consume the arm, Home fits', () => {
  const kids = readFileSync('src/ui/kids.ts', 'utf8');
  assert.ok(kids.includes('window.addEventListener(type, gate, { capture: true })'));
  assert.ok(kids.includes("window.addEventListener('keydown', gateKey, { capture: true })"));
  for (const type of ['click', 'pointerdown', 'input', 'change', 'contextmenu']) assert.ok(kids.includes(`'${type}'`));
  assert.ok(kids.includes("'#kids-home')!.onclick = fitAllObjects"), 'Home fits the existing scene');
  assert.ok(!/resetSimulation|loadExhibit|savePreferences/.test(kids), 'no reset, exhibit load or preference write');
  const pointer = readFileSync('src/ui/pointer.ts', 'utf8');
  assert.equal(pointer.match(/placeSelected\(/g)?.length, 3);
  assert.equal(pointer.match(/kidsPlacementDone\(\)/g)?.length, 3, 'every placement path consumes the arm');
  const feed = readFileSync('src/ui/feed.ts', 'utf8');
  assert.ok(feed.includes('if (!idleDemoAllowed(app.kidsMode))'));
  const inspector = readFileSync('src/ui/inspector.ts', 'utf8');
  assert.ok(inspector.includes('if (!objectMenuAllowed(app.kidsMode)) return;'));
});
