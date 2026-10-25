// Modal pickers (universe library, guided exhibits): open/close, focus move, focus trap and focus restore.
const openers = new WeakMap<HTMLElement, HTMLElement | null>();
const FOCUSABLE = 'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), [tabindex="0"]';

function pickers() {
  return [...document.querySelectorAll<HTMLElement>('.scenario-picker')];
}
/** The currently open picker dialog, if any. */
export function openDialog() {
  return pickers().find(dialog => !dialog.hidden) ?? null;
}
export function showDialog(dialog: HTMLElement) {
  const current = openDialog();
  // Switching between pickers keeps the original opener so focus returns to the toolbar, not the hidden picker.
  const opener = current
    ? (openers.get(current) ?? null)
    : document.activeElement instanceof HTMLElement
      ? document.activeElement
      : null;
  for (const other of pickers()) if (other !== dialog) hideDialog(other, false);
  openers.set(dialog, opener);
  dialog.hidden = false;
  const heading = dialog.querySelector<HTMLElement>('h2[tabindex]');
  (heading ?? dialog.querySelector<HTMLElement>(FOCUSABLE))?.focus({ preventScroll: true });
}
export function hideDialog(dialog: HTMLElement, restoreFocus = true) {
  if (dialog.hidden) return;
  dialog.hidden = true;
  const opener = openers.get(dialog);
  openers.delete(dialog);
  if (restoreFocus && opener?.isConnected && !opener.closest('[hidden]')) opener.focus({ preventScroll: true });
}
/** Keeps Tab / Shift+Tab inside the open picker. */
export function trapFocus(e: KeyboardEvent) {
  const dialog = openDialog();
  if (!dialog || e.key !== 'Tab') return;
  const focusable = [...dialog.querySelectorAll<HTMLElement>(FOCUSABLE)].filter(
    element => !element.closest('[hidden]') && element.offsetParent !== null,
  );
  if (!focusable.length) return;
  const first = focusable[0],
    last = focusable[focusable.length - 1],
    active = document.activeElement;
  if (!dialog.contains(active)) {
    e.preventDefault();
    first.focus();
  } else if (e.shiftKey && (active === first || active === dialog.querySelector('h2[tabindex]'))) {
    e.preventDefault();
    last.focus();
  } else if (!e.shiftKey && active === last) {
    e.preventDefault();
    first.focus();
  }
}
