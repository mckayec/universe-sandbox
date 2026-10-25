export type StellarStage =
  'red dwarf' | 'yellow star' | 'white star' | 'blue star' | 'giant' | 'hypergiant' | 'white dwarf';

export type StellarTrack = 'low-mass' | 'sun-like' | 'hot-intermediate' | 'massive';
export type StellarStep =
  | { action: 'stable'; track: StellarTrack }
  | { action: 'evolve'; track: StellarTrack; next: StellarStage }
  | { action: 'supernova'; track: StellarTrack };

export type CollisionRegime = 'accrete' | 'grazing' | 'fragment' | 'strip';

export function momentumWeightedVelocity(
  receiverVelocity: readonly [number, number, number],
  receiverMass: number,
  donorVelocity: readonly [number, number, number],
  transferredMass: number,
): [number, number, number] {
  const total = receiverMass + transferredMass;
  if (total <= 0) return [0, 0, 0];
  return receiverVelocity.map(
    (component, index) => (component * receiverMass + donorVelocity[index] * transferredMass) / total,
  ) as [number, number, number];
}

const TRACKS: Record<StellarTrack, readonly StellarStage[]> = {
  'low-mass': ['red dwarf'],
  'sun-like': ['yellow star', 'giant', 'white dwarf'],
  'hot-intermediate': ['white star', 'giant', 'white dwarf'],
  massive: ['blue star', 'giant', 'hypergiant'],
};

export function stellarTrackForMass(mass: number): StellarTrack {
  if (mass < 170) return 'low-mass';
  if (mass < 240) return 'sun-like';
  if (mass < 320) return 'hot-intermediate';
  return 'massive';
}

export function stellarTrackLabel(mass: number): string {
  const track = stellarTrackForMass(mass);
  return {
    'low-mass': 'Low-mass stable track',
    'sun-like': 'Sun-like track',
    'hot-intermediate': 'Hot intermediate track',
    massive: 'Massive supernova track',
  }[track];
}

export function stellarBirthStage(mass: number): StellarStage {
  return TRACKS[stellarTrackForMass(mass)][0];
}

export function nextStellarStep(mass: number, current: StellarStage): StellarStep {
  const track = stellarTrackForMass(mass);
  const path = TRACKS[track];
  const index = path.indexOf(current);

  // Accretion can move a main-sequence star onto a hotter, more massive track.
  if (index < 0 && !['giant', 'hypergiant', 'white dwarf'].includes(current)) {
    return { action: 'evolve', track, next: path[0] };
  }
  if (index >= 0 && index < path.length - 1) {
    return { action: 'evolve', track, next: path[index + 1] };
  }
  if (track === 'massive' && current === 'hypergiant') {
    return { action: 'supernova', track };
  }
  return { action: 'stable', track };
}

export function collisionRegime(
  a: 'rocky' | 'gas' | 'brown' | 'star' | 'protostar' | 'pulsar' | 'blackhole',
  b: 'rocky' | 'gas' | 'brown' | 'star' | 'protostar' | 'pulsar' | 'blackhole',
  relativeSpeed: number,
  tangentialFraction: number,
): CollisionRegime {
  if (relativeSpeed > 2.4 && tangentialFraction > 0.72) return 'grazing';
  if (a === 'rocky' && b === 'rocky' && relativeSpeed > 6.2) return 'fragment';
  if ((a === 'gas' || b === 'gas') && relativeSpeed > 5.2) return 'strip';
  return 'accrete';
}

export type MergeCandidate = { buildLocked: boolean; priority: number; mass: number; id: number };

/** Which of two merging bodies survives: build lock, then kind priority, then higher mass, then the older id. */
export function mergeSurvivorIndex(a: MergeCandidate, b: MergeCandidate): 0 | 1 {
  if (a.buildLocked !== b.buildLocked) return a.buildLocked ? 0 : 1;
  if (a.priority !== b.priority) return a.priority > b.priority ? 0 : 1;
  if (a.mass !== b.mass) return a.mass > b.mass ? 0 : 1;
  return a.id <= b.id ? 0 : 1;
}

/**
 * Planar velocity kicks for `count` equal fragments ejected from a collision, evenly spread from `angle`, plus the
 * recoil the remnant takes so the net momentum of remnant and fragments is unchanged.
 */
export function fragmentKicks(count: number, pieceMass: number, remnantMass: number, speed: number, angle: number) {
  const pieces: Array<[number, number]> = [];
  let px = 0,
    pz = 0;
  for (let i = 0; i < count; i++) {
    const a = angle + (i / count) * Math.PI * 2,
      kick: [number, number] = [Math.cos(a) * speed, Math.sin(a) * speed];
    pieces.push(kick);
    px += kick[0] * pieceMass;
    pz += kick[1] * pieceMass;
  }
  const recoil: [number, number] = remnantMass > 0 ? [-px / remnantMass, -pz / remnantMass] : [0, 0];
  return { pieces, recoil };
}

export type HabitabilityInput = {
  planetMass: number;
  variant: number;
  stellarQuality: number;
  stellarHazard: number;
  compactStarPenalty: number;
  impactShock: number;
};

export function habitabilityQuality(input: HabitabilityInput): { quality: number; summary: string } {
  const surfaceFactors = [0.08, 0.34, 0.28, 1, 0.32, 0];
  const surface = surfaceFactors[input.variant % surfaceFactors.length];
  const retention = Math.max(0, Math.min(1, 1 - Math.abs(input.planetMass - 11) / 24));
  const safety = Math.max(0, 1 - input.stellarHazard - input.compactStarPenalty - input.impactShock);
  const quality = Math.max(0, Math.min(1, input.stellarQuality * surface * (0.35 + retention * 0.65) * safety));

  if (input.impactShock > 0.35) return { quality, summary: 'Recovering from a major impact' };
  if (input.compactStarPenalty > 0.35) return { quality, summary: 'Sterilizing compact-object radiation' };
  if (input.stellarHazard > 0.45) return { quality, summary: 'Unstable stellar radiation' };
  if (input.stellarQuality <= 0) return { quality, summary: 'Outside a temperate orbit' };
  if (surface <= 0.1) return { quality, summary: 'Hostile surface conditions' };
  if (retention < 0.25) return { quality, summary: 'Atmosphere retention is unlikely' };
  if (quality > 0.58) return { quality, summary: 'Stable liquid-water conditions' };
  if (quality > 0.18) return { quality, summary: 'Marginally habitable conditions' };
  return { quality, summary: 'Severe climate stress' };
}
