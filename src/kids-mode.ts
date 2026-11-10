// Pure rules for Kids mode (item 6b). No DOM access, so every gate is testable from node:test;
// src/ui/kids.ts applies them to the page's event handlers.
import type { FeedbackMode } from './feedback.ts';

/** The only controls a child can operate: Add, Pause/Play, Undo, Home, and the grown-up exit (plus its dialog). */
export const KIDS_CONTROL_IDS = [
  'kids-add',
  'kids-pause',
  'kids-undo',
  'kids-home',
  'kids-grownups',
  'kids-exit-confirm',
  'kids-exit-cancel',
] as const;

/** Containers whose controls stay operable in Kids mode. Everything else is gated at the event, not only hidden. */
export const KIDS_REGION_IDS = ['kids-bar', 'kids-dialog'] as const;

/**
 * Whether an interaction on a control is allowed. `regionId` is the id of the nearest allowed container the target
 * sits in (or null). Outside Kids mode everything is allowed.
 */
export function kidsAllowsControl(kids: boolean, regionId: string | null) {
  if (!kids) return true;
  return regionId !== null && (KIDS_REGION_IDS as readonly string[]).includes(regionId);
}

export type KeyInput = { key: string; ctrlKey?: boolean; metaKey?: boolean; shiftKey?: boolean; altKey?: boolean };

/**
 * Keys that still reach the page in Kids mode: focus movement and button activation (Tab, Enter, Space), Escape to
 * cancel an armed Add or close the grown-up dialog, and Ctrl/Cmd+Z for Undo. Every other shortcut (mode keys,
 * zoom keys, redo, focus, navigation) is swallowed.
 */
export function kidsAllowsKey(kids: boolean, e: KeyInput) {
  if (!kids) return true;
  const key = e.key.toLowerCase();
  if (['tab', 'enter', ' ', 'escape', 'shift'].includes(key)) return !e.ctrlKey && !e.metaKey && !e.altKey;
  return key === 'z' && !!(e.ctrlKey || e.metaKey) && !e.shiftKey && !e.altKey;
}

/** Kids mode always presents quietly; the adult preference itself is left untouched. */
export function effectiveFeedbackMode(mode: FeedbackMode, kids: boolean): FeedbackMode {
  return kids ? 'quiet' : mode;
}

/** The idle demonstration never replaces a child's scene. */
export function idleDemoAllowed(kids: boolean) {
  return !kids;
}

/** The long-press / right-click object menu (change, remove) is an adult tool. */
export function objectMenuAllowed(kids: boolean) {
  return !kids;
}

/**
 * Armed-Add state. Add toggles arming (pressing it again cancels); exactly one placement consumes the arm; an
 * interrupted gesture (second finger, pointer cancel) leaves it armed so nothing is placed by accident.
 */
export type KidsArm = { armed: boolean };
export function toggleArm(state: KidsArm): KidsArm {
  return { armed: !state.armed };
}
export function consumePlacement(state: KidsArm): { place: boolean; next: KidsArm } {
  return state.armed ? { place: true, next: { armed: false } } : { place: false, next: state };
}
export function cancelArm(): KidsArm {
  return { armed: false };
}

/**
 * A held touch in Add mode waits for release (or an 8 px drag) before placing. It may place only if it is still the
 * current authorized gesture: no mode change, Add cancel, Escape or grown-up dialog has happened since it began
 * (each bumps the placement epoch), Add is still on, and in Kids mode Add is still armed.
 */
export type PlacementGate = { epoch: number; placementMode: boolean; kidsMode: boolean; kidsArmed: boolean };
export function pendingPlacementValid(pending: { epoch: number } | null, gate: PlacementGate) {
  if (!pending || pending.epoch !== gate.epoch || !gate.placementMode) return false;
  return !gate.kidsMode || gate.kidsArmed;
}

/**
 * A pointer click on the grown-up dialog counts only if that same pointer's press began inside the dialog while it
 * was open (keyboard or assistive activation, `detail === 0`, always counts). A child's finger held on the canvas
 * while a grown-up opens the dialog would otherwise release as a tap on whichever dialog button appeared under it
 * (6d rendered harness). Authorization belongs to the originating pointer (SC6-K3): a different contact can neither
 * grant nor revoke it, and it ends with the gesture (release consumed by its click, cancel) or the dialog's lifetime.
 */
export type DialogPresses = {
  /** Pointers currently down: whether each press began inside the open dialog. */
  down: Map<number, boolean>;
  /** Pointers released but whose click has not arrived yet. */
  released: Map<number, boolean>;
  /** The most recently released pointer, for a click that carries no pointer identity. */
  last: number | null;
};
export function newDialogPresses(): DialogPresses {
  return { down: new Map(), released: new Map(), last: null };
}
export function notePointerDown(s: DialogPresses, pointerId: number, inDialog: boolean) {
  s.down.set(pointerId, inDialog);
  s.released.delete(pointerId);
}
export function notePointerUp(s: DialogPresses, pointerId: number) {
  s.released.set(pointerId, s.down.get(pointerId) === true);
  s.down.delete(pointerId);
  s.last = pointerId;
}
export function notePointerCancel(s: DialogPresses, pointerId: number) {
  s.down.delete(pointerId);
  s.released.delete(pointerId);
  if (s.last === pointerId) s.last = null;
}
/** Opening or closing the dialog ends every earlier authorization: only presses made on the open dialog count. */
export function resetDialogPresses(s: DialogPresses) {
  s.down.clear();
  s.released.clear();
  s.last = null;
}
/**
 * Decides one click and consumes the matching authorization. Pointer clicks carry the causing pointer's id
 * (Pointer Events 3 §4.2.12.1); a click with no usable id falls back to the most recently released pointer, which is
 * the pointer whose release dispatches that click.
 */
export function dialogClickAllowed(s: DialogPresses, click: { detail: number; pointerId?: number }) {
  if (click.detail === 0) return true;
  const id = typeof click.pointerId === 'number' && click.pointerId >= 0 ? click.pointerId : s.last;
  if (id === null) return false;
  const allowed = s.released.has(id) ? s.released.get(id) === true : s.down.get(id) === true;
  s.released.delete(id);
  if (s.last === id) s.last = null;
  return allowed;
}

/** `?kids=1` starts the exhibit in Kids mode (for a dedicated kiosk); anything else starts in the adult layout. */
export function kidsFromQuery(search: string) {
  return new URLSearchParams(search).get('kids') === '1';
}
