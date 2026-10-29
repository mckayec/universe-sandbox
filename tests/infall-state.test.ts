import assert from 'node:assert/strict';
import test from 'node:test';
import {
  applySavedInfall,
  assertSavedInfalls,
  restoreSavedInfall,
  SavedInfallError,
  savedInfallProblem,
  type SavedInfall,
} from '../src/sandbox-state.ts';
import { infallDuration, infallDurationFor, infallRemainingMass, releaseCapture } from '../src/infall-model.ts';

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

// R2-C1: a present but malformed record has lost the body's original hold flag; it must not pass as "no capture"
// or be guessed as unheld. The snapshot is refused so restoreUniverse keeps the previous universe.
const MALFORMED: Array<[string, (held: boolean) => unknown]> = [
  ['number', () => 7],
  ['zero', () => 0],
  ['false', () => false],
  ['true', () => true],
  ['string', () => 'captured'],
  ['empty array', () => []],
  ['array of a record', held => [capture(200, 'star', 0.5, held)]],
  ['empty object', () => ({})],
  ['missing heldStage', held => ({ ...capture(200, 'star', 0.5, held), heldStage: undefined })],
  ['string heldStage', held => ({ ...capture(200, 'star', 0.5, held), heldStage: String(held) })],
  ['numeric heldStage', held => ({ ...capture(200, 'star', 0.5, held), heldStage: held ? 1 : 0 })],
  ['null heldStage', held => ({ ...capture(200, 'star', 0.5, held), heldStage: null })],
  ['missing heldStage, missing eater', held => ({ ...capture(200, 'star', 0.5, held, 99), heldStage: undefined })],
];

test('malformed capture records are rejected, never treated as absent or as an unheld original', () => {
  for (const held of [false, true])
    for (const [label, make] of MALFORMED) {
      const record = JSON.parse(JSON.stringify({ infall: make(held) })).infall;
      assert.ok(savedInfallProblem(record), `${label} (originally held=${held}) is a problem`);
      const result = restoreSavedInfall(record, 10, kindOf);
      assert.ok(result && 'reject' in result, `${label} rejects`);
      for (const top of [true, false, undefined]) {
        const body: { id: number; holdStage?: boolean; infall?: SavedInfall } = { id: 10, holdStage: top };
        assert.throws(() => applySavedInfall(body, record, kindOf), SavedInfallError, label);
        assert.equal(body.holdStage, top, `${label}: body untouched when rejected`);
        assert.equal(body.infall, undefined);
      }
      assert.throws(
        () => assertSavedInfalls([{ id: 4 }, { id: 10, infall: record }]),
        (error: unknown) => error instanceof SavedInfallError && /object 10/.test(error.message),
        `${label}: whole snapshot refused`,
      );
    }
});

test('absent and null capture records stay legacy no-ops; well-formed records pass the snapshot check', () => {
  for (const record of [undefined, null]) {
    assert.equal(savedInfallProblem(record), undefined);
    for (const top of [true, false, undefined]) {
      const body: { id: number; holdStage?: boolean; infall?: SavedInfall } = { id: 10, holdStage: top };
      applySavedInfall(body, record, kindOf);
      assert.equal(body.holdStage, top, 'legacy save keeps its own flag (no information to repair it)');
      assert.equal(body.infall, undefined);
    }
  }
  assert.doesNotThrow(() =>
    assertSavedInfalls([
      { id: 1 },
      { id: 2, infall: null },
      { id: 3, infall: capture(200, 'star', 0.5, true) },
      { id: 4, infall: capture(200, 'star', 0.5, false, 99) },
    ]),
  );
});

// R2-C2: a resumed capture must hold evolution like beginInfall does, whatever the separately saved top-level flag
// says, and releasing it must return each body to its own original flag.
test('a resumed capture always holds evolution and releases to the original flag', () => {
  for (const original of [false, true])
    for (const top of [true, false, undefined]) {
      const record = JSON.parse(JSON.stringify(capture(200, 'star', 0.5, original)));
      const body: { id: number; holdStage?: boolean; infall?: SavedInfall } = { id: 10, holdStage: top };
      applySavedInfall(body, record, kindOf);
      const tag = `original=${original} top=${top}`;
      assert.equal(body.holdStage, true, `${tag}: held while captured`);
      assert.equal(body.infall?.heldStage, original, `${tag}: original kept only in the capture`);
      releaseCapture(body);
      assert.equal(body.holdStage, original, `${tag}: release restores the original`);
      assert.equal(body.infall, undefined);
    }
});

test('a cancelled capture restores the original flag regardless of the saved top-level flag', () => {
  for (const original of [false, true])
    for (const top of [true, false, undefined])
      for (const eaterId of [99, 3]) {
        const body: { id: number; holdStage?: boolean; infall?: SavedInfall } = { id: 10, holdStage: top };
        applySavedInfall(body, capture(200, 'star', 0.5, original, eaterId), kindOf);
        assert.equal(body.holdStage ?? false, original, `original=${original} top=${top} eater=${eaterId}`);
        assert.equal(body.infall, undefined);
      }
});
