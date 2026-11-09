// Bounded companion response for accretion disks (simulator-clarity item 4, slice 4a).
//
// A labelled teaching approximation, not hydrodynamics or GRMHD. A disk around a body in a binary cannot extend
// much past its Roche lobe: gas further out is pulled into a tidal bulge, sheared into two trailing arms and
// stripped. We estimate that with the Eggleton (1983) Roche-lobe fit and the common tidal-truncation rule of
// thumb (disk radius about 0.8 of the Roche lobe). Distant companions leave the disk alone.
//
// Everything here works in the disk's own local frame (the RingGeometry plane is local XY), so mesh scale and
// tilt never change the result and the disk keeps its plane and pattern phase.

/** Fraction of the Roche lobe a tidally truncated disk can fill. */
export const TRUNCATION_FRACTION = 0.8;
/** Truncation shallower than this (as a fraction of the outer radius) counts as no encounter. */
const STRENGTH_SPAN = 0.6;

export type DiskEncounter = {
  /** 0 = undisturbed, 1 = strongly truncated. */
  strength: number;
  /** Outer cut as a fraction of the disk's own outer radius; 1 means no cut. */
  cut: number;
  /** Polar angle of the companion in the disk plane (local XY), radians. */
  angle: number;
  /**
   * Unclamped truncation radius / outer radius (smaller = deeper). Used only to rank companions, because both
   * `strength` (saturates at 1) and `cut` (floors at 0.25) stop distinguishing very close companions.
   */
  depth?: number;
  /** Identity of the companion, when known; breaks exact ranking ties deterministically. */
  companionId?: number;
};

export const QUIET_ENCOUNTER: DiskEncounter = Object.freeze({ strength: 0, cut: 1, angle: 0 });

/** Eggleton (1983): Roche-lobe radius / separation for the body of mass `host` with a companion of `companion`. */
export function rocheLobeFraction(host: number, companion: number) {
  if (!(host > 0) || !(companion > 0)) return 1;
  const q = host / companion,
    q23 = Math.cbrt(q * q),
    q13 = Math.cbrt(q);
  return (0.49 * q23) / (0.6 * q23 + Math.log(1 + q13));
}

/**
 * Encounter state for one disk and one companion.
 * `local` is the companion position in the disk's local frame (disk plane = XY), in the same units as `outer`.
 */
export function diskEncounter(
  local: { x: number; y: number; z: number },
  outer: number,
  hostMass: number,
  companionMass: number,
): DiskEncounter {
  const separation = Math.hypot(local.x, local.y, local.z);
  if (!(outer > 0) || !(separation > 0) || !Number.isFinite(separation) || !(companionMass > 0)) return QUIET_ENCOUNTER;
  const truncation = TRUNCATION_FRACTION * rocheLobeFraction(hostMass, companionMass) * separation,
    cut = clamp(truncation / outer, 0.25, 1),
    strength = clamp((1 - truncation / outer) / STRENGTH_SPAN, 0, 1);
  if (strength <= 0) return QUIET_ENCOUNTER;
  return { strength, cut, angle: Math.atan2(local.y, local.x), depth: truncation / outer };
}

function rankDepth(e: DiskEncounter) {
  return Number.isFinite(e.depth) ? (e.depth as number) : e.cut;
}

/**
 * True when `candidate` should replace `best` as the encounter shown on a disk. One rule for the helper and the
 * runtime selector: any active encounter beats a quiet one; otherwise the deeper (unclamped) truncation wins; on an
 * exact tie the smaller companion ID wins, and without IDs the earlier encounter is kept.
 */
export function outranks(candidate: DiskEncounter, best: DiskEncounter) {
  if (!(candidate.strength > 0)) return false;
  if (!(best.strength > 0)) return true;
  const a = rankDepth(candidate),
    b = rankDepth(best);
  if (a !== b) return a < b;
  return (
    candidate.companionId !== undefined && best.companionId !== undefined && candidate.companionId < best.companionId
  );
}

/** The strongest of several encounters: the deepest truncation (see `outranks`). */
export function strongestEncounter<T extends DiskEncounter>(encounters: Iterable<T>): T | DiskEncounter {
  let best: T | DiskEncounter = QUIET_ENCOUNTER;
  for (const e of encounters) if (outranks(e, best)) best = e;
  return best;
}

/**
 * Ease displayed state toward the target, timestep-aware, so a fast flyby at high speed never snaps the disk.
 * Strengthening is quicker than recovery (gas is stripped faster than a disk re-spreads).
 */
export function relaxEncounter(current: DiskEncounter, target: DiskEncounter, dt: number): DiskEncounter {
  if (!(dt > 0)) return current;
  const rising = target.strength > current.strength,
    k = 1 - Math.exp(-dt * (rising ? 2.2 : 0.55)),
    strength = current.strength + (target.strength - current.strength) * k,
    cut = current.cut + (target.cut - current.cut) * k,
    // Follow the companion's angle along the shorter arc; keep the old angle when the target is quiet.
    delta =
      target.strength > 0
        ? Math.atan2(Math.sin(target.angle - current.angle), Math.cos(target.angle - current.angle))
        : 0,
    angle = current.angle + delta * Math.min(1, k * 3);
  return { strength: strength < 1e-4 ? 0 : strength, cut: clamp(cut, 0.25, 1), angle };
}

/** Short inspector wording; null when the disk is undisturbed. */
export function describeEncounter(e: DiskEncounter, companionName?: string) {
  if (e.strength < 0.05) return null;
  const who = companionName ? ` by ${companionName}` : '';
  const level = e.strength > 0.66 ? 'Strongly truncated' : e.strength > 0.25 ? 'Truncated' : 'Perturbed';
  return `${level}${who}: outer gas cut to ${Math.round(e.cut * 100)}% (tidal estimate)`;
}

function clamp(v: number, lo: number, hi: number) {
  return Math.min(hi, Math.max(lo, v));
}
