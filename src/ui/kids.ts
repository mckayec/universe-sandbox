// Kids mode (item 6b): Add, Pause/Play, Undo and Home, plus Explore (tap to select, drag to pan). Adult controls
// are gated at the event (capture listeners below), not only hidden by CSS. Leaving needs the grown-up dialog.
import {
  consumePlacement,
  dialogClickAllowed,
  notePointerCancel,
  notePointerDown,
  notePointerUp,
  resetDialogPresses,
  effectiveFeedbackMode,
  kidsAllowsControl,
  kidsAllowsKey,
  kidsFromQuery,
  toggleArm,
  cancelArm,
  KIDS_REGION_IDS,
} from '../kids-mode.ts';
import { timelineLive } from '../feedback.ts';
import { fitAllObjects } from '../scene/camera.ts';
import { app, undoStack } from '../state/app-state.ts';
import { undoUniverse } from '../state/history.ts';
import { chooseBuilder, setInteractionMode, setNavigationMode } from './controls.ts';
import { hideDialog, showDialog } from './dialogs.ts';
import { toast } from './feed.ts';
import { closeObjectMenu } from './inspector.ts';

const ADD_HINT = 'KIDS · TAP SPACE TO ADD ONE OBJECT',
  EXPLORE_HINT = 'KIDS · TAP AN OBJECT TO SEE IT · DRAG TO LOOK AROUND';

function regionOf(target: EventTarget | null) {
  if (!(target instanceof Element)) return null;
  const region = target.closest(KIDS_REGION_IDS.map(id => `#${id}`).join(','));
  return region?.id ?? null;
}
/** Records, per pointer, whether its press began inside the open grown-up dialog (SC6-K3). */
function notePress(e: PointerEvent) {
  // A hidden dialog receives no presses, and opening/closing it resets every record, so only presses on the open
  // dialog can authorize its clicks.
  notePointerDown(app.kidsDialogPresses, e.pointerId, regionOf(e.target) === 'kids-dialog');
}
function noteRelease(e: PointerEvent) {
  notePointerUp(app.kidsDialogPresses, e.pointerId);
}
function noteCancel(e: PointerEvent) {
  notePointerCancel(app.kidsDialogPresses, e.pointerId);
}
/** Blocks an event aimed at an adult control while Kids mode is on. Canvas input is handled in pointer.ts. */
function gate(e: Event) {
  if (!app.kidsMode) return;
  if (e.type === 'click' && e.target instanceof Element && regionOf(e.target) === 'kids-dialog') {
    if (dialogClickAllowed(app.kidsDialogPresses, e as MouseEvent & { pointerId?: number })) return;
    e.preventDefault();
    e.stopImmediatePropagation();
    return;
  }
  const target = e.target;
  if (!(target instanceof Element) || target.closest('canvas')) return;
  if (!target.closest('button, select, input, textarea, [data-speed], #event-feed, [role="dialog"]')) return;
  if (kidsAllowsControl(true, regionOf(target))) return;
  e.preventDefault();
  e.stopImmediatePropagation();
}
function gateKey(e: KeyboardEvent) {
  if (kidsAllowsKey(app.kidsMode, e)) return;
  e.preventDefault();
  e.stopImmediatePropagation();
}

function syncKidsBar() {
  const add = document.querySelector<HTMLButtonElement>('#kids-add')!,
    pause = document.querySelector<HTMLButtonElement>('#kids-pause')!;
  add.setAttribute('aria-pressed', String(app.kidsArmed));
  add.classList.toggle('active', app.kidsArmed);
  add.querySelector('span')!.textContent = app.kidsArmed ? 'Tap space' : 'Add';
  pause.querySelector('span')!.textContent = app.paused ? 'Play' : 'Pause';
  pause.setAttribute('aria-label', app.paused ? 'Play' : 'Pause');
  document.querySelector<HTMLButtonElement>('#pause')!.textContent = app.paused ? 'Resume' : 'Pause';
  if (app.kidsMode) document.querySelector('#hint')!.textContent = app.kidsArmed ? ADD_HINT : EXPLORE_HINT;
}
/** Arms or disarms Add. Disarmed Kids mode is Explore: tap selects, drag on empty space pans. */
function setArmed(armed: boolean) {
  app.kidsArmed = armed;
  setInteractionMode(armed);
  // Explore pans on empty-space drags (navigation), so a child cannot fling objects by accident.
  if (!armed) {
    app.placementMode = false;
    app.navigationMode = false;
  }
  syncKidsBar();
}
/** Called by pointer.ts after a canvas placement: one placement per armed Add. */
export function kidsPlacementDone() {
  if (!app.kidsMode) return;
  setArmed(consumePlacement({ armed: app.kidsArmed }).next.armed);
}
export function setKidsMode(on: boolean) {
  if (on === app.kidsMode) return;
  const shell = document.querySelector('.shell')!;
  if (on) {
    app.kidsRestore = {
      placementMode: app.placementMode,
      navigationMode: app.navigationMode,
      builder: app.selectedBuilder,
    };
    closeObjectMenu();
    for (const dialog of document.querySelectorAll<HTMLElement>('.scenario-picker:not(#kids-dialog)'))
      hideDialog(dialog, false);
    app.kidsMode = true;
    if (app.selectedBuilder !== 'body') chooseBuilder('body');
    setArmed(false);
  } else {
    app.kidsMode = false;
    app.kidsArmed = false;
    const restore = app.kidsRestore;
    app.kidsRestore = null;
    if (restore && restore.builder !== app.selectedBuilder) chooseBuilder(restore.builder);
    if (restore?.navigationMode) setNavigationMode();
    else setInteractionMode(restore?.placementMode ?? true);
  }
  shell.classList.toggle('kids-mode', on);
  document.querySelector<HTMLElement>('#kids-bar')!.hidden = !on;
  document.querySelector<HTMLButtonElement>('#kids-mode')!.setAttribute('aria-pressed', String(on));
  document
    .querySelector('#event-feed')!
    .setAttribute('aria-live', timelineLive(effectiveFeedbackMode(app.feedbackMode, app.kidsMode)));
  syncKidsBar();
  toast(on ? 'Kids mode: Add, Pause, Undo and Home' : 'Grown-up controls restored');
}

export function bindKidsMode() {
  // Window capture runs before the document-level and element handlers, so gated events never reach them.
  // Press tracking is registered first so a gated pointerdown is still recorded for its own pointer.
  window.addEventListener('pointerdown', notePress, { capture: true });
  window.addEventListener('pointerup', noteRelease, { capture: true });
  window.addEventListener('pointercancel', noteCancel, { capture: true });
  for (const type of ['click', 'pointerdown', 'input', 'change', 'dblclick', 'contextmenu'])
    window.addEventListener(type, gate, { capture: true });
  window.addEventListener('keydown', gateKey, { capture: true });
  const dialog = document.querySelector<HTMLElement>('#kids-dialog')!;
  document.querySelector<HTMLButtonElement>('#kids-mode')!.onclick = () => setKidsMode(true);
  document.querySelector<HTMLButtonElement>('#kids-add')!.onclick = () =>
    setArmed(toggleArm({ armed: app.kidsArmed }).armed);
  document.querySelector<HTMLButtonElement>('#kids-pause')!.onclick = () => {
    app.paused = !app.paused;
    if (app.paused) app.simAccumulator = 0;
    syncKidsBar();
  };
  document.querySelector<HTMLButtonElement>('#kids-undo')!.onclick = () => {
    if (!undoStack.length) toast('Nothing to undo yet');
    else undoUniverse();
  };
  document.querySelector<HTMLButtonElement>('#kids-home')!.onclick = fitAllObjects;
  document.querySelector<HTMLButtonElement>('#kids-grownups')!.onclick = () => {
    setArmed(cancelArm().armed);
    resetDialogPresses(app.kidsDialogPresses);
    showDialog(dialog);
  };
  document.querySelector<HTMLButtonElement>('#kids-exit-cancel')!.onclick = () => {
    resetDialogPresses(app.kidsDialogPresses);
    hideDialog(dialog);
  };
  document.querySelector<HTMLButtonElement>('#kids-exit-confirm')!.onclick = () => {
    resetDialogPresses(app.kidsDialogPresses);
    hideDialog(dialog, false);
    setKidsMode(false);
    document.querySelector<HTMLButtonElement>('#kids-mode')!.focus({ preventScroll: true });
  };
  // Escape cancels an armed Add without leaving Kids mode.
  document.addEventListener('keydown', e => {
    if (app.kidsMode && e.key === 'Escape' && app.kidsArmed && dialog.hidden) setArmed(false);
  });
}
/** Applies `?kids=1`. Called by main.ts after the adult startup defaults so they cannot overwrite Kids state (SC6-K2). */
export function startKidsFromQuery() {
  if (kidsFromQuery(location.search)) setKidsMode(true);
}
