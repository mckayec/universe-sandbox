// Node source/state review only. No browser/server/renderer. Scene/UI dependencies are inert fixtures.
// node r3-state-probes.mjs /path/to/0a43a4f-checkout
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { stripTypeScriptTypes } from 'node:module';
import { pathToFileURL } from 'node:url';
const root = process.argv[2];
const state = await import(pathToFileURL(path.join(root, 'src/sandbox-state.ts')));
const { releaseCapture } = await import(pathToFileURL(path.join(root, 'src/infall-model.ts')));
const history = fs.readFileSync(path.join(root, 'src/state/history.ts'), 'utf8');
const capture = {
  eaterId: 1,
  age: 5,
  duration: 10,
  startMass: 200,
  startRadius: 6,
  angle: 1,
  sense: -1,
  heldStage: false,
};
const kinds = id => (id === 1 ? 'blackhole' : undefined);
let count = 0;
for (const bad of [
  7,
  false,
  'corrupt',
  [],
  {},
  { ...capture, heldStage: undefined },
  { ...capture, heldStage: 'true' },
]) {
  assert.throws(() => state.assertSavedInfalls([{ id: 2, infall: bad }]), state.SavedInfallError);
  const body = { id: 2, holdStage: true };
  assert.throws(() => state.applySavedInfall(body, bad, kinds), state.SavedInfallError);
  assert.equal(body.holdStage, true);
  count++;
}
for (const original of [false, true])
  for (const top of [false, true, undefined]) {
    const body = { id: 2, holdStage: top };
    state.applySavedInfall(body, { ...capture, heldStage: original }, kinds);
    assert.equal(body.holdStage, true);
    assert.equal(body.infall.heldStage, original);
    releaseCapture(body);
    assert.equal(body.holdStage, original);
    assert.equal(body.infall, undefined);
    count++;
  }
for (const original of [false, true]) {
  const body = { id: 2, holdStage: true };
  state.applySavedInfall(body, { ...capture, eaterId: 99, heldStage: original }, kinds);
  assert.equal(Boolean(body.holdStage), original);
  assert.equal(body.infall, undefined);
  count++;
}
for (const absent of [undefined, null]) {
  const body = { id: 2, holdStage: true };
  state.applySavedInfall(body, absent, kinds);
  assert.equal(body.holdStage, true);
  assert.equal(body.infall, undefined);
  count++;
}
// Actual rebuildUniverse + restoreInfalls + restoreUniverse bodies. Only scene/UI/body construction stubbed.
const rebuild = history.slice(history.indexOf('function rebuildUniverse('), history.indexOf('function restoreBody('));
const restore = history
  .slice(history.indexOf('export function restoreUniverse('), history.indexOf('export function updateHistoryButtons('))
  .replace('export function', 'function');
const vec = () => ({ fromArray() {} });
const c = vm.createContext({
  ...state,
  bodies: [],
  cosmicGroups: [],
  app: {},
  KNOWN_KINDS: new Set(['star', 'blackhole']),
  KNOWN_STAGES: new Set(),
  KNOWN_EXHIBITS: new Set(),
  camera: { position: vec(), lookAt() {} },
  viewTarget: vec(),
  document: { querySelector: () => ({}) },
  console: { warn() {} },
  toast() {},
  rebuildGalaxyVisuals() {},
  refreshGroupNavigator() {},
  updateCount() {},
  renderExhibitEvents() {},
});
c.resetSimulation = () => {
  c.bodies.length = 0;
  c.cosmicGroups.length = 0;
};
c.restoreBody = b => {
  const restored = JSON.parse(JSON.stringify(b));
  delete restored.infall;
  c.bodies.push(restored);
};
vm.runInContext(stripTypeScriptTypes(rebuild + restore), c);
const donor = {
  id: 2,
  kind: 'star',
  mass: 80,
  birthMass: 200,
  position: [1, 0, 0],
  velocity: [0, 0, 1],
  holdStage: true,
  infall: capture,
};
const eater = { id: 1, kind: 'blackhole', mass: 500, birthMass: 500, position: [0, 0, 0], velocity: [0, 0, 0] };
const snap = bodies => ({
  bodies,
  groups: [],
  nextId: 3,
  nextGroupId: 1,
  elapsed: 4,
  gravity: 1,
  camera: [0, 0, 0],
  target: [0, 0, 0],
});
const prior = snap([donor, eater]);
for (const bad of [7, {}, { ...capture, heldStage: 'true' }]) {
  assert.equal(c.restoreUniverse(snap([{ ...donor, infall: bad }, eater]), prior), false);
  const after = c.bodies.find(b => b.id === 2);
  assert.equal(after.mass, 80);
  assert.equal(after.infall.age, 5);
  assert.equal(after.infall.heldStage, false);
  assert.equal(after.holdStage, true);
  assert.equal(c.bodies.length, 2);
  assert.equal(c.app.historySuspended, false);
  count++;
}
assert.equal(c.restoreUniverse(snap([{ ...donor, holdStage: false }, eater]), prior), true);
assert.equal(c.bodies.find(b => b.id === 2).holdStage, true);
count++;
assert.equal(c.restoreUniverse(snap([{ ...donor, infall: null }]), prior), true);
assert.equal(c.bodies[0].holdStage, true);
assert.equal(c.bodies[0].infall, undefined);
count++;
console.log(
  `${count} cases passed: 7 malformed, 6 resume/release, 2 orphan cancellation, 2 legacy, 3 actual restore/rebuild fallback, 2 restore controls. Scene/UI/body construction are fixtures, not rendered acceptance.`,
);
