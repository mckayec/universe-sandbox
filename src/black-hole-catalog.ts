// Black-hole reference catalog and real-unit sizes (simulator clarity item 7, slice 7a).
//
// This module is informational only. The simulator's solver, velocity clamp, contacts and display radii keep their
// legacy arbitrary model units; nothing here feeds real solar masses into them. The values below explain what real
// black holes of a given mass would measure in a simplified nonspinning (Schwarzschild) model.

/** IAU 2015 nominal solar mass parameter GM☉, m³/s². */
export const GM_SUN = 1.3271244e20;
/** Speed of light, m/s. */
export const C_LIGHT = 299_792_458;
/** One astronomical unit, km. */
export const AU_KM = 149_597_870.7;
/** Schwarzschild radius 2GM/c² per solar mass, km (≈ 2.95325). */
export const SCHWARZSCHILD_KM_PER_SOLAR_MASS = (2 * GM_SUN) / (C_LIGHT * C_LIGHT) / 1000;

export type BlackHoleClass = 'stellar-mass' | 'intermediate-mass' | 'supermassive';

/** Approximate, conventional class boundaries in solar masses; the literature uses fuzzy limits. */
export const CLASS_LIMITS = { intermediate: 100, supermassive: 100_000 } as const;

export function blackHoleClass(solarMasses: number): BlackHoleClass {
  return solarMasses >= CLASS_LIMITS.supermassive
    ? 'supermassive'
    : solarMasses >= CLASS_LIMITS.intermediate
      ? 'intermediate-mass'
      : 'stellar-mass';
}
export const CLASS_LABELS: Record<BlackHoleClass, string> = {
  'stellar-mass': 'Stellar-mass',
  'intermediate-mass': 'Intermediate-mass',
  supermassive: 'Supermassive',
};

export type BlackHolePreset = { id: string; label: string; solarMasses: number };
/**
 * Five friendly UI sizes. They are not five scientific classes: the first two are both stellar-mass and the last two
 * are both supermassive (see `blackHoleClass`).
 */
export const BLACK_HOLE_PRESETS: readonly BlackHolePreset[] = [
  { id: 'small-stellar', label: 'Small stellar', solarMasses: 5 },
  { id: 'large-stellar', label: 'Large stellar', solarMasses: 30 },
  { id: 'intermediate', label: 'Intermediate', solarMasses: 1_000 },
  { id: 'galactic-core', label: 'Galactic core', solarMasses: 1_000_000 },
  { id: 'giant-core', label: 'Giant core', solarMasses: 1_000_000_000 },
];

export type BlackHoleExample = {
  name: string;
  /** Rounded reference mass in solar masses (never an exact measurement). */
  solarMasses: number;
  /** How the number should be read: rounding, uncertainty, model dependence. */
  status: string;
  /** Observed context; disks and jets are only described where the source supports them. */
  context: string;
  source: string;
};
/** Rounded, cited reference masses from the 2026-11-09 handoff (docs/universes/HANDOFF_PLAN.md). */
export const BLACK_HOLE_EXAMPLES: readonly BlackHoleExample[] = [
  {
    name: 'Cygnus X-1',
    solarMasses: 21,
    status: 'Rounded NASA value, not an exact measured mass',
    context: 'Accreting X-ray binary; no measured disk outer size',
    source: 'https://www.nasa.gov/universe/nasas-ixpe-reveals-shape-orientation-of-hot-matter-around-black-hole/',
  },
  {
    name: 'Gaia BH3',
    solarMasses: 33,
    status: 'Rounded ESA reference value; observed estimates have uncertainty',
    context: 'Dormant: no bright disk',
    source: 'https://www.esa.int/ESA_Multimedia/Images/2024/04/Gaia_black_holes',
  },
  {
    name: 'GW190521 remnant',
    solarMasses: 142,
    status: 'Model-dependent gravitational-wave inference; 90% interval +28/−16 M☉',
    context: 'Merger remnant; no measured disk or jet',
    source: 'https://dcc.ligo.org/public/0165/P2000021/012/gw190521-implications-main_20200901.pdf',
  },
  {
    name: 'HLX-1',
    solarMasses: 20_000,
    status: 'Representative NASA estimate; uncertain',
    context: 'Candidate accreting object; any disk shown is illustrative',
    source: 'https://science.nasa.gov/missions/hubble/nasas-hubble-spots-a-relic-from-a-shredded-galaxy/',
  },
  {
    name: 'Sagittarius A*',
    solarMasses: 4_000_000,
    status: 'Rounded NASA reference value; precise estimates differ',
    context: 'Low accretion activity',
    source: 'https://science.nasa.gov/universe/black-holes/types/',
  },
  {
    name: 'M87*',
    solarMasses: 6_500_000_000,
    status: 'Rounded EHT/NASA estimate; uncertainty is not zero',
    context: 'Accretion and jet; disk size not inferable from mass',
    source:
      'https://www.jpl.nasa.gov/edu/resources/teachable-moment/how-scientists-captured-the-first-image-of-a-black-hole/',
  },
];

export type BlackHoleSizes = {
  /** Event horizon (Schwarzschild radius, 2GM/c²). */
  horizonKm: number;
  /** Photon sphere, 1.5 × horizon. */
  photonSphereKm: number;
  /** Apparent shadow radius seen from far away, √27·GM/c² ≈ 2.6 × horizon. Not the measured image size of any object. */
  shadowKm: number;
  /** Innermost stable circular orbit, 3 × horizon: the inner edge of a thin disk in this model. */
  innerDiskKm: number;
  /** A disk's outer extent is not set by mass; it depends on the gas supply. Always null here. */
  outerDiskKm: null;
};
/** Nonspinning-model sizes for a mass. Every length scales linearly with mass. */
export function blackHoleSizes(solarMasses: number): BlackHoleSizes {
  const m = Number.isFinite(solarMasses) && solarMasses > 0 ? solarMasses : 0,
    horizonKm = m * SCHWARZSCHILD_KM_PER_SOLAR_MASS;
  return {
    horizonKm,
    photonSphereKm: 1.5 * horizonKm,
    shadowKm: (Math.sqrt(27) / 2) * horizonKm,
    innerDiskKm: 3 * horizonKm,
    outerDiskKm: null,
  };
}

/** The example closest in log-mass within the same class, if the class has any examples. */
export function nearestExample(solarMasses: number): BlackHoleExample | null {
  const cls = blackHoleClass(solarMasses);
  let best: BlackHoleExample | null = null,
    bestGap = Infinity;
  for (const example of BLACK_HOLE_EXAMPLES) {
    if (blackHoleClass(example.solarMasses) !== cls) continue;
    const gap = Math.abs(Math.log10(example.solarMasses) - Math.log10(solarMasses));
    if (gap < bestGap) [best, bestGap] = [example, gap];
  }
  return best;
}

export function formatSolarMasses(solarMasses: number) {
  if (solarMasses >= 1e9) return `${trim(solarMasses / 1e9)} billion M☉`;
  if (solarMasses >= 1e6) return `${trim(solarMasses / 1e6)} million M☉`;
  return `${Math.round(solarMasses).toLocaleString('en-US')} M☉`;
}
function trim(value: number) {
  return Number(value.toFixed(1)).toString();
}
/** Kilometres below 100 million km, then astronomical units. */
export function formatLength(km: number) {
  if (km >= 1e8) {
    const au = km / AU_KM;
    return `${au < 10 ? au.toFixed(2) : au.toFixed(1)} AU`;
  }
  if (km >= 1000) return `${Math.round(km).toLocaleString('en-US')} km`;
  return `${km < 10 ? km.toFixed(1) : Math.round(km)} km`;
}

/** Mass readout for a simulated black hole: legacy solver units, never relabelled as Earth or solar masses. */
export function modelMassLabel(modelMass: number, formatted: string) {
  return Number.isFinite(modelMass) ? `${formatted} model units` : '—';
}

export type PresetRow = {
  label: string;
  mass: string;
  cls: string;
  horizon: string;
  shadow: string;
  example: string;
};
/** One row per preset for the selected-object reference table. */
export function presetRows(): PresetRow[] {
  return BLACK_HOLE_PRESETS.map(preset => {
    const sizes = blackHoleSizes(preset.solarMasses),
      example = nearestExample(preset.solarMasses);
    return {
      label: preset.label,
      mass: formatSolarMasses(preset.solarMasses),
      cls: CLASS_LABELS[blackHoleClass(preset.solarMasses)],
      horizon: formatLength(sizes.horizonKm),
      shadow: formatLength(sizes.shadowKm),
      example: example ? `${example.name} ≈ ${formatSolarMasses(example.solarMasses)}` : '—',
    };
  });
}

/** Caveat shown with the table; the simulator is a softened Newtonian toy model, not general relativity. */
export const SCALE_NOTE =
  'Real sizes for a nonspinning black hole of each mass (horizon 2GM/c², shadow ≈ 2.6× horizon). ' +
  'Disk size is not set by mass. The simulator itself uses model units and softened Newtonian gravity, which is not accurate near a horizon.';
