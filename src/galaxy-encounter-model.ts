// Pure contact rule for colliding galaxies (bodies/galaxy-merger.ts). A collisionless approximation with
// illustrative speed cutoffs, not a calculation of stellar collisions or black-hole binary evolution.

/** Two model cores only coalesce below this relative speed; faster passes fly through. */
export const CORE_MERGE_SPEED = 8;
/** A core only captures a star moving slower than this relative to it. */
export const CORE_CAPTURE_SPEED = 4;

/** Whether two touching galaxy bodies should pass through each other instead of merging. */
export function passesThrough(sameGalaxy: boolean, coreA: boolean, coreB: boolean, relativeSpeed: number) {
  // A star on a plunging orbit through its own galaxy's centre is not swallowed on the way through either.
  if (sameGalaxy) return (coreA || coreB) && relativeSpeed > CORE_CAPTURE_SPEED;
  if (coreA && coreB) return relativeSpeed > CORE_MERGE_SPEED;
  if (coreA || coreB) return relativeSpeed > CORE_CAPTURE_SPEED;
  return true;
}
