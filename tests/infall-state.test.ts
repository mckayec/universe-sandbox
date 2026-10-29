import assert from 'node:assert/strict';
import test from 'node:test';
import { restoreSavedInfall, type SavedInfall } from '../src/sandbox-state.ts';
import { infallDuration, infallDurationFor, infallRemainingMass } from '../src/infall-model.ts';

const kinds = new Map<number, string>([
  [1, 'blackhole'],
  [2, 'pulsar'],
  [3, 'star'],
]);
const kindOf = (id: number) => kinds.get(id);
function capture(mass: number, kind: string, u: number, heldStage: boolean, eaterId = 1): SavedInfall {
  const duration = infallDuration(mass, kind);
  return { eaterId, age: u * duration, duration, startMass: mass, startRadius: 6, angle: 1.2, sense: -1, heldStage };
}

test('a mid-capture infall survives a JSON save round trip with the same remaining mass and time', () => {
  for (const [mass, kind, held] of [
    [1, 'star', false],
    [1, 'star', true],
    [0.9, 'gas', false],
  ] as const) {
    for (const u of [0.1, 0.5, 0.9]) {
      const before = capture(mass * 200, kind, u, held);
      const saved = JSON.parse(JSON.stringify({ infall: before })).infall;
      const result = restoreSavedInfall(saved, 10, kindOf);
      assert.ok(result && 'resume' in result, `${kind} held=${held} u=${u} resumes`);
      const after = result.resume;
      assert.deepEqual(after, before);
      assert.equal(after.eaterId, 1);
      assert.equal(after.heldStage, held, 'original hold flag kept, not the forced capture hold');
      assert.equal(
        infallRemainingMass(after.startMass, after.age, after.duration),
        infallRemainingMass(before.startMass, before.age, before.duration),
      );
      assert.equal(after.duration - after.age, before.duration - before.age);
    }
  }
});

test('a pulsar capture also resumes', () => {
  const result = restoreSavedInfall(capture(150, 'star', 0.4, false, 2), 10, kindOf);
  assert.ok(result && 'resume' in result);
});

test('a capture whose eater is missing or not a compact object cancels and restores the original hold flag', () => {
  for (const held of [false, true]) {
    assert.deepEqual(restoreSavedInfall(capture(200, 'star', 0.5, held, 99), 10, kindOf), { cancel: held });
    assert.deepEqual(restoreSavedInfall(capture(200, 'star', 0.5, held, 3), 10, kindOf), { cancel: held });
    assert.deepEqual(
      restoreSavedInfall(capture(200, 'star', 0.5, held, 10), 10, () => 'blackhole'),
      {
        cancel: held,
      },
    );
  }
});

test('corrupt capture numbers cancel instead of resuming', () => {
  const base = capture(200, 'star', 0.5, false);
  for (const bad of [
    { age: Number.NaN },
    { age: -1 },
    { duration: 0 },
    { duration: -5 },
    { duration: Number.NaN },
    { startMass: 0 },
    { startRadius: -1 },
    { angle: Number.POSITIVE_INFINITY },
    { sense: 0 },
    { eaterId: 'one' },
  ]) {
    assert.deepEqual(restoreSavedInfall({ ...base, ...bad }, 10, kindOf), { cancel: false }, JSON.stringify(bad));
  }
});

test('older saves without a capture record restore nothing; an overrun age is clamped', () => {
  assert.equal(restoreSavedInfall(undefined, 10, kindOf), undefined);
  assert.equal(restoreSavedInfall(null, 10, kindOf), undefined);
  const result = restoreSavedInfall({ ...capture(200, 'star', 0.5, false), age: 1e6 }, 10, kindOf);
  assert.ok(result && 'resume' in result);
  assert.equal(result.resume.age, result.resume.duration);
});

test('capture pacing is stretched by the slower realism modes', () => {
  const exhibit = infallDurationFor(200, 'star', 'exhibit'),
    educational = infallDurationFor(200, 'star', 'educational'),
    realistic = infallDurationFor(200, 'star', 'realistic');
  assert.equal(exhibit, infallDuration(200, 'star'));
  assert.ok(exhibit >= 8 && exhibit <= 42);
  assert.ok(educational > exhibit && realistic > educational);
  assert.ok(Math.abs(educational - exhibit / 0.65) < 1e-9);
  assert.ok(Math.abs(realistic - exhibit / 0.38) < 1e-9);
  assert.equal(infallRemainingMass(100, 0, 10), 100);
  assert.equal(infallRemainingMass(100, 10, 10), 0);
});
