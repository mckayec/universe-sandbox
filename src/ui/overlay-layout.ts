// SC6-O1 residual: on compact screens the overlay stack and the bottom dock share one height budget, so the
// guide card / legend never cover the selected-object sheet or the tool row (720x450 at 200% zoom, 320x568).
import { overlayBudget } from '../overlay-budget.ts';

// Same condition as the compact overlay-stack CSS in style.css, including landscape phones wider than 800px.
const COMPACT = '(max-width: 800px), (max-height: 500px) and (pointer: coarse)';
const GAP = 8;
const DOCK_FLOOR = 72;
// Landscape phones (PR44 two-column dock): the dock keeps both rows of the tool panel and the sheet heading (Pause /
// Clear all / Show tools, Add / Inspect / Navigate, Details / ×); the guide card (Restart / Exit beside its text)
// fits in the rest, and the legend and navigation help scroll inside the stack's share below it.
const LANDSCAPE = '(max-height: 500px) and (pointer: coarse) and (min-width: 601px)';
const LANDSCAPE_DOCK_FLOOR = 124;

function visibleChildren(parent: HTMLElement) {
  return [...parent.children].filter(
    (el): el is HTMLElement => el instanceof HTMLElement && el.getClientRects().length > 0,
  );
}

/** Natural content height of a flex column: children's full content (scrollHeight) plus borders and gaps. */
function columnNeed(parent: HTMLElement) {
  const kids = visibleChildren(parent);
  if (!kids.length) return 0;
  const gap = parseFloat(getComputedStyle(parent).rowGap) || 0;
  let total = gap * (kids.length - 1);
  for (const el of kids) {
    const style = getComputedStyle(el);
    total += el.scrollHeight + (parseFloat(style.borderTopWidth) || 0) + (parseFloat(style.borderBottomWidth) || 0);
  }
  return total;
}

function apply(stack: HTMLElement, dock: HTMLElement, compact: MediaQueryList, landscape: MediaQueryList) {
  const root = document.documentElement;
  const budget = compact.matches
    ? overlayBudget({
        stackTop: stack.getBoundingClientRect().top,
        dockBottom: dock.getBoundingClientRect().bottom,
        stackNeed: columnNeed(stack),
        dockNeed: columnNeed(dock),
        gap: GAP,
        dockFloor: landscape.matches ? LANDSCAPE_DOCK_FLOOR : DOCK_FLOOR,
      })
    : { tight: false, stackMax: null, dockMax: null };
  document.body.classList.toggle('overlay-tight', budget.tight);
  if (budget.tight) {
    root.style.setProperty('--overlay-stack-max', `${budget.stackMax}px`);
    root.style.setProperty('--dock-max', `${budget.dockMax}px`);
  } else {
    root.style.removeProperty('--overlay-stack-max');
    root.style.removeProperty('--dock-max');
  }
}

export function bindOverlayBudget() {
  const stack = document.querySelector<HTMLElement>('#overlay-stack');
  const dock = document.querySelector<HTMLElement>('.dock');
  if (!stack || !dock) return;
  const compact = matchMedia(COMPACT);
  const landscape = matchMedia(LANDSCAPE);
  let queued = 0;
  const schedule = () => {
    if (queued) return;
    queued = requestAnimationFrame(() => {
      queued = 0;
      apply(stack, dock, compact, landscape);
    });
  };
  // Children (not the containers) are observed: showing/hiding a card, Details/Collapse and wrapping text all
  // change a child's box, while the limits this sets only change the containers, so it cannot feed back on itself.
  const resize = new ResizeObserver(schedule);
  for (const el of [...stack.children, ...dock.children]) resize.observe(el);
  addEventListener('resize', schedule);
  compact.addEventListener('change', schedule);
  landscape.addEventListener('change', schedule);
  schedule();
}
