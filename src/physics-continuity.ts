export type FixedStepResult = { accumulator: number; steps: number; dropped: boolean };

export function runFixedSteps(
  accumulator: number,
  realDelta: number,
  speed: number,
  step: number,
  maxSteps: number,
  simulate: (delta: number) => void,
): FixedStepResult {
  let remaining = Math.min(.45, accumulator + realDelta * speed);
  let steps = 0;
  while (remaining >= step && steps < maxSteps) {
    simulate(step);
    remaining -= step;
    steps++;
  }
  const dropped = steps === maxSteps && remaining >= step;
  if (dropped) remaining = Math.min(remaining, step * .5);
  return { accumulator: remaining, steps, dropped };
}

export function orbitalSpeed(gravityConstant: number, gravityScale: number, centralMass: number, radius: number) {
  if (gravityScale <= 0 || centralMass <= 0 || radius <= 0) return 0;
  return Math.sqrt(gravityConstant * gravityScale * centralMass / radius);
}

export function rocheLobeRadius(separation: number, donorMass: number, companionMass: number) {
  if (separation <= 0 || donorMass <= 0 || companionMass <= 0) return 0;
  const q = Math.max(.001, donorMass / companionMass);
  const q13 = Math.pow(q, 1 / 3);
  const q23 = q13 * q13;
  return separation * (.49 * q23) / (.6 * q23 + Math.log(1 + q13));
}

export function tidalTransferRate(baseRate: number, proximity: number, massRatio: number, receiverMultiplier = 1) {
  return baseRate
    * Math.pow(Math.max(0, Math.min(1, proximity)), 1.55)
    * Math.max(1, Math.min(2.25, Math.sqrt(Math.max(1, massRatio))))
    * Math.max(0, receiverMultiplier);
}

export function capPlanarVelocity<T extends { x: number; z: number }>(velocity: T, maximum: number) {
  const speed = Math.hypot(velocity.x, velocity.z);
  if (speed > maximum && speed > 0) {
    velocity.x *= maximum / speed;
    velocity.z *= maximum / speed;
  }
  return velocity;
}

/**
 * Tidal stress on a self-gravitating body: the ratio of the differential pull
 * across its radius (2·G·M·R / d³) to its own surface gravity (G·m / R²).
 * Values above 1 mean the classic rigid-body Roche limit has been crossed.
 * `boost` lets fictional effects (e.g. a warp wake) amplify the stress without
 * adding real mass to the perturber.
 */
export function tidalStressRatio(primaryMass: number, donorMass: number, donorRadius: number, distance: number, boost = 1) {
  if (primaryMass <= 0 || donorMass <= 0 || donorRadius <= 0 || distance <= 0) return 0;
  return 2 * primaryMass * Math.pow(donorRadius, 3) * Math.max(0, boost) / (donorMass * Math.pow(distance, 3));
}

/** Distance at which `tidalStressRatio` reaches `threshold` (the exhibit's effective Roche limit). */
export function effectiveRocheLimit(primaryMass: number, donorMass: number, donorRadius: number, threshold = 1, boost = 1) {
  if (primaryMass <= 0 || donorMass <= 0 || donorRadius <= 0 || threshold <= 0) return 0;
  return donorRadius * Math.cbrt(2 * primaryMass * Math.max(0, boost) / (donorMass * threshold));
}

/**
 * Accumulates structural strain while a body sits beyond the disruption
 * threshold and lets it relax afterwards, so a fast graze stretches a world
 * while a slow or deep pass tears it apart. Returns strain in [0, 1].
 */
export function advanceTidalStrain(strain: number, ratio: number, threshold: number, dt: number, growthRate = 1.6, relaxRate = .35) {
  const excess = ratio / Math.max(1e-6, threshold) - 1;
  const next = excess > 0
    ? strain + Math.min(4, excess) * growthRate * dt
    : strain - relaxRate * dt;
  return Math.max(0, Math.min(1, next));
}
