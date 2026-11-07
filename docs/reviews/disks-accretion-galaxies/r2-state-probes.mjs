// Source-only characterization; no browser, DOM, server or renderer.
// node r2-state-probes.mjs /path/to/exact-pr43-checkout
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { stripTypeScriptTypes } from 'node:module';
import { pathToFileURL } from 'node:url';
const root = process.argv[2];
const { restoreSavedInfall } = await import(pathToFileURL(path.join(root, 'src/sandbox-state.ts')));
const history = fs.readFileSync(path.join(root, 'src/state/history.ts'), 'utf8');
const fn = history.slice(history.indexOf('function restoreInfalls('), history.indexOf('function restoreBody('));
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
function restore(infall, holdStage, eater = true) {
  const body = { id: 2, kind: 'star', holdStage };
  const c = vm.createContext({ bodies: eater ? [{ id: 1, kind: 'blackhole' }, body] : [body], restoreSavedInfall });
  vm.runInContext(stripTypeScriptTypes(fn), c);
  c.restoreInfalls([{ id: 2, infall }]);
  return body;
}
let checks = 0;
for (const held of [false, true]) {
  const c = { ...capture, heldStage: held };
  const resumed = restore(c, true);
  assert.equal(resumed.infall.heldStage, held);
  assert.equal(resumed.holdStage, true);
  checks++;
  assert.equal(Boolean(restore(c, true, false).holdStage), held);
  checks++;
  assert.equal(Boolean(restore({ ...c, duration: 0 }, true).holdStage), held);
  checks++;
}
for (const raw of [false, 7, 'corrupt']) {
  const body = restore(raw, true);
  assert.equal(body.infall, undefined);
  assert.equal(body.holdStage, true);
  checks++;
}
for (const flag of [undefined, false]) {
  const body = restore(capture, flag);
  assert.ok(body.infall);
  assert.notEqual(body.holdStage, true);
  checks++;
}
for (const heldStage of [undefined, 'true']) {
  const body = restore({ ...capture, heldStage }, true, false);
  assert.equal(body.holdStage, undefined);
  checks++;
}
const legacy = restore(undefined, true);
assert.equal(legacy.infall, undefined);
assert.equal(legacy.holdStage, true);
checks++;
console.log(
  `${checks} source-state cases passed: 6 normal/cancellation, 3 malformed-record retained holds, 2 resumed missing holds, 2 unknown original holds coerced false, 1 legacy unchanged. Defects reproduced, not fixed.`,
);
