// SC6-K1 / SC6-K2 regressions. The real handler bodies are extracted from pointer.ts, kids.ts and controls.ts and run
// with DOM/render adapters only, so a held touch is exercised through the same code the page runs.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { stripTypeScriptTypes } from 'node:module';
import vm from 'node:vm';
import {
  cancelArm,
  consumePlacement,
  dialogClickAllowed,
  newDialogPresses,
  notePointerCancel,
  notePointerDown,
  notePointerUp,
  pendingPlacementValid,
  resetDialogPresses,
  toggleArm,
} from '../src/kids-mode.ts';

const pointer = readFileSync('src/ui/pointer.ts', 'utf8');
const kids = readFileSync('src/ui/kids.ts', 'utf8');
const controls = readFileSync('src/ui/controls.ts', 'utf8');

function body(source: string, marker: string) {
  const start = source.indexOf(marker);
  assert.ok(start >= 0, marker);
  const open = source.indexOf('{', start + marker.length);
  let depth = 1,
    end = open + 1;
  while (depth) {
    if (source[end] === '{') depth++;
    if (source[end] === '}') depth--;
    end++;
  }
  return source.slice(open + 1, end - 1);
}
function expression(source: string, marker: string) {
  const start = source.indexOf(marker);
  assert.ok(start >= 0, marker);
  return source.slice(start + marker.length, source.indexOf(';\n', start));
}

const handlers = [
  `function placementGate() {${body(pointer, 'function placementGate()')}}`,
  `function beginTouchGesture() {${body(pointer, 'function beginTouchGesture()')}}`,
  `function onMove(e) {${body(pointer, "addEventListener('pointermove', e =>")}}`,
  `function onUp(e) {${body(pointer, "addEventListener('pointerup', e =>")}}`,
  `function onCancel(e) {${body(pointer, "addEventListener('pointercancel', e =>")}}`,
  `function cancelPendingPlacement() {${body(controls, 'export function cancelPendingPlacement()')}}`,
  `function setInteractionMode(add) {${body(controls, 'export function setInteractionMode(add: boolean)')}}`,
  `function setNavigationMode() {${body(controls, 'export function setNavigationMode()')}}`,
  `function setArmed(armed) {${body(kids, 'function setArmed(armed: boolean)')}}`,
  `function kidsPlacementDone() {${body(kids, 'export function kidsPlacementDone()')}}`,
  `function onEscape(e) {${body(kids, "document.addEventListener('keydown', e =>")}}`,
  `function onAdd() {${expression(kids, "'#kids-add')!.onclick = () =>")}}`,
  `function onGrownups() {${body(kids, "'#kids-grownups')!.onclick = () =>")}}`,
].join('\n');
const code = stripTypeScriptTypes(handlers);

type Step = 'escape' | 'add' | 'grownups' | 'rearm' | 'cancel' | 'second-finger' | 'inspect' | 'navigate' | 'drag';

function run(steps: Step[], options: { kids?: boolean; release?: boolean } = {}) {
  const kidsOn = options.kids ?? true;
  let placed = 0;
  const element = () => ({
    classList: { toggle() {}, add() {}, remove() {} },
    hidden: false,
    textContent: '',
    setAttribute() {},
    querySelector: () => ({ textContent: '' }),
  });
  const dialog = { hidden: true };
  const vec = () => ({ x: 0, y: 0, copy: () => vec(), clone: () => vec(), set: () => vec() });
  const app = {
    kidsMode: kidsOn,
    kidsArmed: kidsOn,
    placementMode: true,
    navigationMode: false,
    selectedBuilder: 'body',
    pendingTouchPlacement: null as unknown,
    placementEpoch: 0,
    touchGesture: null as unknown,
    longPressTimer: 0,
    longPressBody: null,
    longPressTriggered: false,
    panning: false,
    dragBody: null as unknown,
    historyBeforeDrag: null,
    didDrag: false,
    orbitMode: false,
    paused: false,
    kidsDialogPresses: newDialogPresses(),
  };
  const activePointers = new Map([[7, { x: 100, y: 100, type: 'touch' }]]);
  const ctx = vm.createContext({
    app,
    activePointers,
    dialog,
    container: element(),
    document: { querySelector: element },
    renderer: { domElement: { hasPointerCapture: () => false, releasePointerCapture() {} } },
    world: vec(),
    dragStart: vec(),
    dragPoint: vec(),
    camera: { position: vec() },
    viewTarget: vec(),
    setPointer() {},
    placeSelected() {
      placed++;
      return { mesh: { position: vec() } };
    },
    clearGuides() {},
    closeObjectMenu() {},
    showGuides() {},
    liveDragBody: () => null,
    syncKidsBar() {},
    showDialog(d: { hidden: boolean }) {
      d.hidden = false;
    },
    clearTimeout,
    consumePlacement,
    cancelArm,
    toggleArm,
    pendingPlacementValid,
    resetDialogPresses,
    THREE: { Vector2: function () {} },
  });
  vm.runInContext(code, ctx);
  // Touch down in Add mode: the pointerdown branch records a pending placement under the current epoch.
  app.pendingTouchPlacement = { pointerId: 7, screen: { x: 100, y: 100 }, world: vec(), epoch: app.placementEpoch };
  for (const step of steps) {
    if (step === 'escape') vm.runInContext("onEscape({ key: 'Escape' })", ctx);
    if (step === 'add') vm.runInContext('onAdd()', ctx);
    if (step === 'grownups') vm.runInContext('onGrownups()', ctx);
    if (step === 'rearm') {
      dialog.hidden = true;
      vm.runInContext('onAdd()', ctx);
    }
    if (step === 'cancel') vm.runInContext('onCancel({ pointerId: 7 })', ctx);
    if (step === 'second-finger') {
      activePointers.set(8, { x: 140, y: 140, type: 'touch' });
      vm.runInContext('beginTouchGesture()', ctx);
      activePointers.delete(8);
      app.touchGesture = null;
    }
    if (step === 'inspect') vm.runInContext('setInteractionMode(false)', ctx);
    if (step === 'navigate') vm.runInContext('setNavigationMode()', ctx);
    if (step === 'drag')
      vm.runInContext("onMove({ pointerType: 'touch', pointerId: 7, clientX: 130, clientY: 100 })", ctx);
  }
  if (options.release ?? true) vm.runInContext("onUp({ pointerType: 'touch', pointerId: 7 })", ctx);
  return { placed, app };
}

test('SC6-K1: a normal Kids tap places exactly one object and consumes the arm', () => {
  const { placed, app } = run([]);
  assert.equal(placed, 1);
  assert.equal(app.kidsArmed, false);
  assert.equal(app.pendingTouchPlacement, null);
});

test('SC6-K1: every cancellation during a held touch places nothing on release', () => {
  const cases: [string, Step[]][] = [
    ['Escape during held touch', ['escape']],
    ['Add toggle cancels', ['add']],
    ['grown-up dialog cancels', ['grownups']],
    ['stale release after cancel and re-arm (Escape)', ['escape', 'rearm']],
    ['stale release after cancel and re-arm (Add)', ['add', 'rearm']],
    ['stale release after grown-up dialog and re-arm', ['grownups', 'rearm']],
    ['pointercancel', ['cancel']],
    ['second finger', ['second-finger']],
    ['Escape then drag past 8 px', ['escape', 'drag']],
  ];
  for (const [name, steps] of cases) {
    const { placed, app } = run(steps);
    assert.equal(placed, 0, name);
    assert.equal(app.pendingTouchPlacement, null, name);
    assert.equal(app.kidsMode, true, `${name}: Kids mode stays on`);
  }
  // A re-armed Add is still armed after the stale release: the next real tap places one object.
  assert.equal(run(['escape', 'rearm']).app.kidsArmed, true);
  assert.equal(run(['cancel']).app.kidsArmed, true, 'interrupted gesture leaves the arm in place');
});

test('SC6-K1: an armed drag past 8 px places one object; adult Add is preserved', () => {
  assert.equal(run(['drag'], { release: false }).placed, 1, 'Kids drag places on the move');
  assert.equal(run(['drag']).placed, 1, 'and the release does not place again');
  assert.equal(run([], { kids: false }).placed, 1, 'adult held tap places on release');
  assert.equal(run(['drag'], { kids: false }).placed, 1, 'adult drag places once');
  assert.equal(run(['inspect'], { kids: false }).placed, 0, 'adult switch to Inspect cancels the held touch');
  assert.equal(run(['navigate'], { kids: false }).placed, 0, 'adult switch to Navigate cancels the held touch');
});

test('SC6-K1: placement gate rejects stale epochs and unarmed Kids', () => {
  const gate = { epoch: 3, placementMode: true, kidsMode: true, kidsArmed: true };
  assert.equal(pendingPlacementValid({ epoch: 3 }, gate), true);
  assert.equal(pendingPlacementValid({ epoch: 2 }, gate), false);
  assert.equal(pendingPlacementValid(null, gate), false);
  assert.equal(pendingPlacementValid({ epoch: 3 }, { ...gate, kidsArmed: false }), false);
  assert.equal(pendingPlacementValid({ epoch: 3 }, { ...gate, placementMode: false }), false);
  assert.equal(pendingPlacementValid({ epoch: 3 }, { ...gate, kidsMode: false, kidsArmed: false }), true);
});

test('SC6-K2: query-driven Kids start runs after the adult startup defaults', () => {
  const main = readFileSync('src/main.ts', 'utf8');
  const adult = main.indexOf('setInteractionMode(true);'),
    kidsStart = main.indexOf('startKidsFromQuery();'),
    bind = main.indexOf('bindKidsMode();');
  assert.ok(bind >= 0 && adult >= 0 && kidsStart >= 0);
  assert.ok(kidsStart > adult, 'Kids query applies after setInteractionMode(true)');
  assert.ok(kidsStart > main.indexOf('applyExhibitPreferences();'), 'and after exhibit preferences');
  assert.ok(!body(kids, 'export function bindKidsMode()').includes('kidsFromQuery'), 'binding no longer applies it');
});

test('grown-up dialog: a click counts only if the press began in the dialog or came from the keyboard', () => {
  const s = newDialogPresses();
  assert.equal(dialogClickAllowed(s, { detail: 0, pointerId: -1 }), true, 'keyboard activation');
  notePointerDown(s, 8, true);
  notePointerUp(s, 8);
  assert.equal(dialogClickAllowed(s, { detail: 1, pointerId: 8 }), true, 'tap or click that began on the dialog');
  notePointerDown(s, 7, false);
  notePointerUp(s, 7);
  assert.equal(dialogClickAllowed(s, { detail: 1, pointerId: 7 }), false, 'held canvas touch released over Leave');
  const kidsSource = readFileSync('src/ui/kids.ts', 'utf8');
  const press = kidsSource.indexOf("window.addEventListener('pointerdown', notePress, { capture: true })"),
    gates = kidsSource.indexOf('window.addEventListener(type, gate, { capture: true })');
  assert.ok(press >= 0 && press < gates, 'press tracking runs before the gate');
  assert.ok(kidsSource.includes("window.addEventListener('pointerup', noteRelease, { capture: true })"));
  assert.ok(kidsSource.includes("window.addEventListener('pointercancel', noteCancel, { capture: true })"));
});

test('SC6-K3: dialog authorization belongs to the originating pointer, not the latest press', () => {
  // 1. Pointer 7 held on the canvas; pointer 8 presses inside the dialog; pointer 7's click must not be authorized.
  let s = newDialogPresses();
  notePointerDown(s, 7, false);
  notePointerDown(s, 8, true);
  notePointerUp(s, 7);
  assert.equal(dialogClickAllowed(s, { detail: 1, pointerId: 7 }), false, 'other contact cannot grant');
  notePointerUp(s, 8);
  assert.equal(dialogClickAllowed(s, { detail: 1, pointerId: 8 }), true, 'dialog contact still allowed');
  // 2. Pointer 7 presses a dialog button; pointer 8 presses the canvas; pointer 7's click stays authorized.
  s = newDialogPresses();
  notePointerDown(s, 7, true);
  notePointerDown(s, 8, false);
  notePointerUp(s, 7);
  assert.equal(dialogClickAllowed(s, { detail: 1, pointerId: 7 }), true, 'other contact cannot revoke');
  // Interleaved without a pointerup (click resolved while still recorded down).
  s = newDialogPresses();
  notePointerDown(s, 7, false);
  notePointerDown(s, 8, true);
  assert.equal(dialogClickAllowed(s, { detail: 1, pointerId: 7 }), false);
  assert.equal(dialogClickAllowed(s, { detail: 1, pointerId: 8 }), true);
});

test('SC6-K3: canceled, consumed and reused gestures keep no stale permission', () => {
  const s = newDialogPresses();
  notePointerDown(s, 7, true);
  notePointerCancel(s, 7);
  assert.equal(dialogClickAllowed(s, { detail: 1, pointerId: 7 }), false, 'canceled gesture');
  notePointerDown(s, 7, true);
  notePointerUp(s, 7);
  assert.equal(dialogClickAllowed(s, { detail: 1, pointerId: 7 }), true);
  assert.equal(dialogClickAllowed(s, { detail: 1, pointerId: 7 }), false, 'authorization consumed by its click');
  notePointerDown(s, 1, true);
  notePointerUp(s, 1);
  notePointerDown(s, 1, false); // mouse id reused by a new canvas press before any click
  notePointerUp(s, 1);
  assert.equal(dialogClickAllowed(s, { detail: 1, pointerId: 1 }), false, 'reused id takes the new press origin');
  notePointerDown(s, 9, true);
  resetDialogPresses(s); // dialog closed or reopened
  notePointerUp(s, 9);
  assert.equal(dialogClickAllowed(s, { detail: 1, pointerId: 9 }), false, 'dialog lifetime ends authorization');
  notePointerDown(s, 3, true);
  notePointerUp(s, 3);
  assert.equal(dialogClickAllowed(s, { detail: 1 }), true, 'click without pointer id uses the releasing pointer');
  notePointerDown(s, 4, false);
  notePointerUp(s, 4);
  assert.equal(dialogClickAllowed(s, { detail: 1, pointerId: undefined }), false);
  assert.equal(dialogClickAllowed(s, { detail: 0 }), true, 'keyboard still allowed');
});

test('SC6-K3: the dialog resets press authorization when it opens and closes', () => {
  const kidsSource = readFileSync('src/ui/kids.ts', 'utf8');
  const grown = body(kidsSource, "document.querySelector<HTMLButtonElement>('#kids-grownups')!.onclick = () =>");
  assert.ok(
    grown.indexOf('resetDialogPresses') >= 0 && grown.indexOf('resetDialogPresses') < grown.indexOf('showDialog'),
  );
  assert.ok(body(kidsSource, "'#kids-exit-cancel')!.onclick = () =>").includes('resetDialogPresses'));
  assert.ok(body(kidsSource, "'#kids-exit-confirm')!.onclick = () =>").includes('resetDialogPresses'));
  const notePress = body(kidsSource, 'function notePress(e: PointerEvent)');
  assert.ok(notePress.includes('e.pointerId'), 'presses are recorded per pointer');
});

test('SC6-O2: irrelevant and completed pointer records stay bounded', async () => {
  const { MAX_TRACKED_POINTERS } = await import('../src/kids-mode.ts');
  // 1,000 distinct presses/releases with no dialog press recorded leave nothing behind.
  const s = newDialogPresses();
  for (let id = 0; id < 1000; id++) notePointerUp(s, id);
  assert.equal(s.released.size, 0);
  assert.equal(s.down.size, 0);
  // Fallback stays: an identity-less click resolves against the last release and is refused.
  assert.equal(dialogClickAllowed(s, { detail: 1 }), false);
  // Recorded presses whose clicks never arrive are capped, oldest first; the newest dialog press stays authorized.
  for (let id = 0; id < 1000; id++) {
    notePointerDown(s, id, id === 999);
    notePointerUp(s, id);
  }
  assert.ok(s.released.size <= MAX_TRACKED_POINTERS && s.down.size === 0);
  assert.equal(dialogClickAllowed(s, { detail: 1, pointerId: 999 }), true);
  // Held pointers that never release are capped too, without losing the latest held dialog press.
  const held = newDialogPresses();
  for (let id = 0; id < 1000; id++) notePointerDown(held, id, id === 999);
  assert.ok(held.down.size <= MAX_TRACKED_POINTERS);
  assert.equal(dialogClickAllowed(held, { detail: 1, pointerId: 999 }), true);
  assert.equal(dialogClickAllowed(held, { detail: 0 }), true, 'keyboard activation unchanged');
  resetDialogPresses(held);
  assert.equal(held.down.size + held.released.size, 0);
});

test('SC6-O2: presses are recorded only while Kids mode shows the grown-up dialog', () => {
  const press = body(kids, 'function notePress(e: PointerEvent)');
  assert.match(press, /if \(!app\.kidsMode \|\| !dialog \|\| dialog\.hidden\) return;/);
  const run = (kidsMode: boolean, hidden: boolean) => {
    const app = { kidsMode, kidsDialogPresses: newDialogPresses() };
    const ctx = vm.createContext({
      app,
      document: { querySelector: () => ({ hidden }) },
      notePointerDown,
      regionOf: () => 'kids-dialog',
    });
    vm.runInContext(
      `${stripTypeScriptTypes(`function notePress(e: PointerEvent) {${press}}`)}\nnotePress({ pointerId: 4, target: null });`,
      ctx,
    );
    return app.kidsDialogPresses.down.size;
  };
  assert.equal(run(true, false), 1, 'open dialog in Kids mode records');
  assert.equal(run(true, true), 0, 'closed dialog records nothing');
  assert.equal(run(false, false), 0, 'adult mode records nothing');
});
