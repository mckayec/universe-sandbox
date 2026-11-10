// Pure rules for event history, quiet feedback and compact labels (item 6a). No DOM access here so every
// rule is testable from node:test; src/ui/feed.ts and src/app/loop.ts apply them.

export type FeedbackMode = 'full' | 'quiet';
/** 'simulation' = something the model did on its own; 'action' = a direct response to the visitor. */
export type EventOrigin = 'simulation' | 'action';
export type LoggedEvent = { title: string; detail: string; color: string };

export const EVENT_HISTORY_LIMIT = 8;

/** Storage only: newest first, bounded. Recording never depends on how (or whether) the event is shown. */
export function recordEvent(log: LoggedEvent[], event: LoggedEvent, limit = EVENT_HISTORY_LIMIT) {
  log.unshift({ ...event });
  log.splice(limit);
  return log;
}

export type EventPresentation = {
  /** Show the transient banner (toast). */
  banner: boolean;
  /** Play the event sound / vibration. */
  sound: boolean;
};

/**
 * Presentation only. Quiet mode drops unsolicited simulation banners and sounds; responses to the visitor's
 * own actions (including failures) are always shown. Nothing is queued for later replay.
 */
export function presentEvent(origin: EventOrigin, mode: FeedbackMode): EventPresentation {
  const show = mode === 'full' || origin === 'action';
  return { banner: show, sound: show };
}

/** The timeline region is a live region only in full feedback mode. */
export function timelineLive(mode: FeedbackMode): 'polite' | 'off' {
  return mode === 'full' ? 'polite' : 'off';
}

/** Unsolicited narration cards appear only in full feedback mode with narration enabled. */
export function narrationAllowed(mode: FeedbackMode, narration: boolean) {
  return narration && mode === 'full';
}

export function parseFeedbackMode(value: unknown, fallback: FeedbackMode = 'full'): FeedbackMode {
  return value === 'full' || value === 'quiet' ? value : fallback;
}

export const SHORT_LABEL_MAX = 14;

/** Short on-canvas label; the full name stays in the inspector heading and the label's accessible name. */
export function shortLabel(name: string, max = SHORT_LABEL_MAX) {
  const trimmed = name.trim();
  if (trimmed.length <= max) return trimmed;
  return `${trimmed.slice(0, Math.max(1, max - 1)).trimEnd()}…`;
}

export type LabelContext = {
  compact: boolean;
  selected: boolean;
  debris: boolean;
  escort: boolean;
  inFocusedStructure: boolean;
  kind: string;
  viewDistance: number;
};

/** Compact layout shows at most the selected object's label; wider layouts keep the distance rules. */
export function labelVisible(c: LabelContext) {
  if (c.selected) return true;
  if (c.compact) return false;
  if (c.debris || c.escort || !c.inFocusedStructure) return false;
  return c.viewDistance < 170 || (c.viewDistance < 650 && (c.kind === 'blackhole' || c.kind === 'nebula'));
}

/**
 * A fresh selection (a different object, or none) collapses the Details sheet; re-selecting the same object keeps
 * it. Compare object identity, not IDs: IDs restart when a scene is rebuilt.
 */
export function detailsAfterSelect<T>(expanded: boolean, previous: T | null, next: T | null) {
  if (next === null) return false;
  return previous === next ? expanded : false;
}
