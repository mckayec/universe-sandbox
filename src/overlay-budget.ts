// SC6-O1 residual: at compact short heights the overlay stack (guide card, legend, …) and the bottom dock
// (selected object + tools) share one vertical band. This pure helper splits that band so they never overlap.

export interface OverlayBudgetInput {
  /** Top edge of the overlay stack, in CSS px from the top of the viewport. */
  stackTop: number;
  /** Bottom edge of the dock (its anchored position), in CSS px from the top of the viewport. */
  dockBottom: number;
  /** Natural (unconstrained) content height of the overlay stack; 0 when nothing in it is showing. */
  stackNeed: number;
  /** Natural content height of the dock; 0 when it shows nothing. */
  dockNeed: number;
  /** Minimum clear space between the stack and the dock. */
  gap?: number;
  /** Height the dock keeps (if it needs it) before the stack may take the rest of the band. */
  dockFloor?: number;
}

export interface OverlayBudget {
  /** True when both cannot be shown in full, so both receive a height limit and scroll inside it. */
  tight: boolean;
  /** Height limit for the overlay stack (null = unconstrained). */
  stackMax: number | null;
  /** Height limit for the dock (null = unconstrained). */
  dockMax: number | null;
}

const finite = (v: number) => (Number.isFinite(v) ? Math.max(0, v) : 0);

/**
 * Splits the band between the overlay stack and the dock. When both fit, nothing is limited. Otherwise the dock
 * keeps up to `dockFloor` (enough for the selected-object heading and the main tool row), the stack gets the rest,
 * and any space the stack does not need goes back to the dock. The two limits plus the gap never exceed the band.
 */
export function overlayBudget(input: OverlayBudgetInput): OverlayBudget {
  const gap = finite(input.gap ?? 8);
  const stackNeed = finite(input.stackNeed);
  const dockNeed = finite(input.dockNeed);
  const band = finite(input.dockBottom - input.stackTop - (stackNeed > 0 && dockNeed > 0 ? gap : 0));
  if (stackNeed === 0 || dockNeed === 0 || stackNeed + dockNeed <= band)
    return { tight: false, stackMax: null, dockMax: null };
  const floor = Math.min(dockNeed, finite(input.dockFloor ?? 120), band);
  const stackMax = Math.floor(Math.min(stackNeed, band - floor));
  const dockMax = Math.floor(Math.min(dockNeed, band - stackMax));
  return { tight: true, stackMax, dockMax };
}
