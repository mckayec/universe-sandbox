import { readFileSync } from 'node:fs';
import { stripTypeScriptTypes } from 'node:module';
import vm from 'node:vm';
import assert from 'node:assert/strict';
// Run from an exact-head checkout root. Extract real handlers; adapters replace DOM/rendering only.
const pointer = readFileSync('src/ui/pointer.ts', 'utf8');
const kids = readFileSync('src/ui/kids.ts', 'utf8');
function body(source, marker) {
  const start = source.indexOf(marker);
  assert.ok(start >= 0, marker);
  const open = source.indexOf('{', start + marker.length);
  let depth = 1, end = open + 1;
  while (depth) { if (source[end] === '{') depth++; if (source[end] === '}') depth--; end++; }
  return source.slice(open + 1, end - 1);
}
const up = body(pointer, "addEventListener('pointerup', e =>");
const cancel = body(pointer, "addEventListener('pointercancel', e =>");
const escape = body(kids, "document.addEventListener('keydown', e =>");
const armed = body(kids, 'function setArmed(armed: boolean)');
const results = [];
for (const mode of ['normal tap', 'Escape before release', 'Add disarm before release', 'pointercancel before release']) {
  let placed = 0;
  const app = { kidsMode: true, kidsArmed: true, placementMode: true, pendingTouchPlacement: { pointerId: 7 }, touchGesture: null, longPressTimer: 0 };
  const ctx = vm.createContext({ app, activePointers: new Map([[7, {}]]), dialog: { hidden: true },
    renderer: { domElement: { hasPointerCapture: () => false } }, world: { clone: () => ({}) },
    setPointer() {}, placeSelected() { placed++; }, clearGuides() {}, liveDragBody: () => null,
    syncKidsBar() {}, setInteractionMode(v) { app.placementMode = v; }, clearTimeout,
    consumePlacement: ({armed}) => ({next:{armed:false},place:armed}),
  });
  const code = `function setArmed(armed) {${armed}}\nfunction kidsPlacementDone() {${body(kids,'export function kidsPlacementDone()')}}\nfunction onUp(e) {${up}}\nfunction onCancel(e) {${cancel}}\nfunction onEscape(e) {${escape}}`;
  vm.runInContext(stripTypeScriptTypes(code), ctx);
  if (mode.startsWith('Escape')) vm.runInContext("onEscape({key:'Escape'})", ctx);
  if (mode.startsWith('Add')) vm.runInContext('setArmed(false)', ctx);
  if (mode.startsWith('pointercancel')) vm.runInContext('onCancel({pointerId:7})', ctx);
  const armedAtRelease = app.kidsArmed;
  vm.runInContext("onUp({pointerType:'touch',pointerId:7})", ctx);
  const expectedPlacements = mode === 'normal tap' ? 1 : 0;
  results.push({name:mode, armedAtRelease, expectedPlacements, actualPlacements:placed, passes:placed===expectedPlacements});
}
// Two failures reproduce the same cancellation defect; controls distinguish normal and cancelled gestures.
assert.deepEqual(results.map(r=>r.actualPlacements), [1,1,1,0]);
console.log(JSON.stringify({head:'fb6afbb082c114a05a1ec509b9d4e6dbf4de22a4',scope:'actual extracted handlers with DOM/render adapters; no browser',results},null,2));
