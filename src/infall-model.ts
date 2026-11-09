// Pure pacing rules for slow accretion (physics/infall.ts). These are display choices for the exhibit, not
// physical disruption times: Exhibit mode uses them as is and the slower realism modes divide by transferFactor.
import { transferFactor, type RealismMode } from './exhibit-runtime.ts';

/** Seconds a captured body takes to be stripped and swallowed at Exhibit pacing. */
export function infallDuration(foodMass: number, foodKind: string) {
  const base = foodKind === 'gas' ? 9 : 11;
  return Math.min(42, Math.max(8, base + 14 * Math.sqrt(Math.max(0, foodMass) / 200)));
}
/** Capture duration in a given realism mode (Educational and Realistic stretch the exhibit pacing). */
export function infallDurationFor(foodMass: number, foodKind: string, mode: RealismMode) {
  return infallDuration(foodMass, foodKind) / transferFactor(mode);
}
/** Mass a captured body still has after `age` of a `duration`-long infall: outer layers go first. */
export function infallRemainingMass(startMass: number, age: number, duration: number) {
  const u = Math.min(1, Math.max(0, age / duration));
  return startMass * Math.pow(1 - u, 1.35);
}
/**
 * Ends a capture without swallowing the body (eater gone, body dragged away): the hold flag goes back to what it
 * was before capture, which `infall.heldStage` alone records while the capture runs.
 */
export function releaseCapture(food: { holdStage?: boolean; infall?: { heldStage: boolean } }) {
  if (!food.infall) return;
  food.holdStage = food.infall.heldStage;
  food.infall = undefined;
}
