// Per-body black-hole reference scale and the scene-wide unit mapping (simulator clarity item 7, slice 7b).
//
// The solver works in legacy model units: model mass, scene length units and simulation seconds. None of them is tied
// to SI, so the scene has no fixed length unit L0 or time unit T0 and no physical gravitational parameter enters the
// solver. A visitor may instead give one black hole a *reference scale*: "read this body's model mass as N solar
// masses". That stores a mass-only conversion factor on the body. Everything here is explanatory: it never changes
// mass, velocity, radius, contacts, picking or display size.
import {
  BLACK_HOLE_PRESETS,
  blackHoleClass,
  blackHoleSizes,
  CLASS_LABELS,
  formatLength,
  formatSolarMasses,
  GM_SUN,
} from './black-hole-catalog.ts';

/**
 * A black hole's reference scale. `solarMassPerModelUnit` is fixed when the visitor picks a preset, so later growth
 * (accretion, infall, merger) scales the referenced mass, and therefore the horizon, linearly with model mass.
 * `origin` is the chosen preset id, or `merged` once two referenced holes have combined.
 */
export type BlackHoleReference = { origin: string; solarMassPerModelUnit: number };

/** The documented scene-wide unit mapping, shown to reviewers and in code comments; the solver does not use it. */
export const SCENE_UNIT_MAPPING = {
  mass: 'Model units. A black hole may carry a per-body reference scale (solar masses per model unit); nothing else does.',
  length: 'Scene units (u). Not tied to kilometres: a horizon radius in km is reported, never drawn to scale.',
  time: 'Simulation seconds. Not tied to physical time.',
  gravity:
    'If a length unit L0 (m) and time unit T0 (s) were fixed, a physical gravitational parameter would map as ' +
    'mu_sim = mu_SI · T0² / L0³. The scene fixes neither, so no physical mu enters the softened Newtonian solver.',
} as const;

/** mu_sim = mu_SI · T0² / L0³ for a chosen length unit L0 (metres) and time unit T0 (seconds). */
export function gravitationalParameterSim(muSI: number, timeUnitSeconds: number, lengthUnitMetres: number) {
  return (muSI * timeUnitSeconds * timeUnitSeconds) / lengthUnitMetres ** 3;
}
/** Solar gravitational parameter in simulation units for a chosen L0/T0 (reference only). */
export function solarMuSim(timeUnitSeconds: number, lengthUnitMetres: number) {
  return gravitationalParameterSim(GM_SUN, timeUnitSeconds, lengthUnitMetres);
}

const PRESET_IDS = new Set(BLACK_HOLE_PRESETS.map(preset => preset.id));
const validFactor = (value: unknown): value is number =>
  typeof value === 'number' && Number.isFinite(value) && value > 0;

/** The reference for a preset applied to a body's current model mass, or undefined for "none"/unknown/invalid. */
export function referenceForPreset(presetId: string, modelMass: number): BlackHoleReference | undefined {
  const preset = BLACK_HOLE_PRESETS.find(entry => entry.id === presetId);
  if (!preset || !validFactor(modelMass)) return undefined;
  return { origin: preset.id, solarMassPerModelUnit: preset.solarMasses / modelMass };
}

/** Referenced mass in solar masses: model mass × fixed factor, so it grows linearly with model mass. */
export function referenceSolarMasses(modelMass: number, reference: BlackHoleReference) {
  return validFactor(modelMass) ? modelMass * reference.solarMassPerModelUnit : 0;
}

/**
 * Reference record of a merger survivor. Each referenced hole contributes its own referenced mass; mass without a
 * reference (a star, gas, an unreferenced hole) is read at the survivor's factor, or at the only referenced
 * partner's factor. With no reference on either side there is none afterwards.
 */
export function mergeReferences(
  eaterMass: number,
  eaterRef: BlackHoleReference | undefined,
  foodMass: number,
  foodRef: BlackHoleReference | undefined,
): BlackHoleReference | undefined {
  const total = eaterMass + foodMass;
  if (!validFactor(total)) return eaterRef;
  if (eaterRef && foodRef) {
    const solar = referenceSolarMasses(eaterMass, eaterRef) + referenceSolarMasses(foodMass, foodRef);
    return { origin: 'merged', solarMassPerModelUnit: solar / total };
  }
  if (eaterRef) return { ...eaterRef };
  if (foodRef) return { origin: 'merged', solarMassPerModelUnit: foodRef.solarMassPerModelUnit };
  return undefined;
}

/** A saved reference if it is usable on this kind of body; anything malformed is dropped (older saves have none). */
export function sanitizeReference(saved: unknown, kind: string): BlackHoleReference | undefined {
  if (kind !== 'blackhole' || !saved || typeof saved !== 'object' || Array.isArray(saved)) return undefined;
  const raw = saved as Partial<BlackHoleReference>;
  if (!validFactor(raw.solarMassPerModelUnit)) return undefined;
  if (raw.origin !== 'merged' && !PRESET_IDS.has(raw.origin as string)) return undefined;
  return { origin: raw.origin as string, solarMassPerModelUnit: raw.solarMassPerModelUnit };
}

/** Inspector text for a referenced hole: mass, class and horizon radius, labelled as a reference reading. */
export function describeReference(modelMass: number, reference: BlackHoleReference | undefined) {
  if (!reference) return 'None · model units only';
  const solar = referenceSolarMasses(modelMass, reference),
    horizon = blackHoleSizes(solar).horizonKm;
  return (
    `≈ ${formatSolarMasses(solar)} · ${CLASS_LABELS[blackHoleClass(solar)]} · ` +
    `horizon radius ${formatLength(horizon)} (not drawn to scale)`
  );
}

/** Value of the inspector's reference picker: a preset id, `merged`, or `none`. */
export function referencePickerValue(reference: BlackHoleReference | undefined) {
  return reference ? reference.origin : 'none';
}
