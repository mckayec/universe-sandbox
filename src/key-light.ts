// Star-relative lighting for planets, moons and dwarf worlds (simulator item 5).
//
// Teaching model, not radiative transfer:
// - Every star-like body is a light source with a relative luminosity L ∝ R² T⁴ (Stefan–Boltzmann), using the
//   simulator's display radius and the catalog surface temperature. Units cancel because only ratios are used.
// - A world is lit by the source with the largest flux L / d² (the "key"). The second-largest source adds a
//   "fill" in its own direction, weighted by its flux relative to the key (0..1). When two stars swap order the
//   key and fill swap at equal weight, so the terminator never pops.
// - No eclipses or shadows; black-hole disks, pulsars and nebulae do not light worlds.
// - With no source in the scene, worlds use NO_STAR_LIGHT, a fixed direction in world (scene) space. It does
//   not follow the camera or the body's spin, so orbiting the camera reveals the night side and spin carries
//   surface features under a fixed terminator, exactly as with a real star.

export type Vec3 = { x: number; y: number; z: number };
export type LightSource = { id: number; position: Vec3; luminosity: number };
export type KeyLight = {
  /** Unit vector from the world toward its key source, in scene space. */
  key: Vec3;
  /** Unit vector toward the second source (equals key when there is none). */
  fill: Vec3;
  /** Fill flux / key flux, in [0, 1]. */
  fillAmount: number;
  /** ID of the key source, or null when the no-star fallback is used. */
  keyId: number | null;
};

const fallbackLength = Math.hypot(0.62, 0.25, 0.74);
/** Documented no-star fallback: the same upper-front-right direction the old body-local light used, but fixed in scene space. */
export const NO_STAR_LIGHT: Vec3 = Object.freeze({
  x: 0.62 / fallbackLength,
  y: 0.25 / fallbackLength,
  z: 0.74 / fallbackLength,
});
const SUN_TEMPERATURE = 5800;

/** Relative luminosity from display radius and surface temperature (Stefan–Boltzmann ratio). */
export function relativeLuminosity(radius: number, temperature: number) {
  if (!(radius > 0) || !(temperature > 0) || !Number.isFinite(radius) || !Number.isFinite(temperature)) return 0;
  const t = temperature / SUN_TEMPERATURE;
  return radius * radius * t * t * t * t;
}

function unit(x: number, y: number, z: number): Vec3 | null {
  const length = Math.hypot(x, y, z);
  if (!(length > 1e-9) || !Number.isFinite(length)) return null;
  return { x: x / length, y: y / length, z: z / length };
}

/**
 * Picks the key and fill light for a world at `target`. Sources at the world's own position, with no
 * luminosity, or listed under `excludeId` are ignored. Ties in flux keep the earlier source as key.
 */
export function keyLightFor(target: Vec3, sources: readonly LightSource[], excludeId?: number): KeyLight {
  let best: { flux: number; dir: Vec3; id: number } | null = null,
    second: { flux: number; dir: Vec3; id: number } | null = null;
  for (const source of sources) {
    if (source.id === excludeId || !(source.luminosity > 0)) continue;
    const dx = source.position.x - target.x,
      dy = source.position.y - target.y,
      dz = source.position.z - target.z,
      dir = unit(dx, dy, dz);
    if (!dir) continue;
    const flux = source.luminosity / (dx * dx + dy * dy + dz * dz);
    if (!Number.isFinite(flux)) continue;
    const entry = { flux, dir, id: source.id };
    if (!best || flux > best.flux) {
      second = best;
      best = entry;
    } else if (!second || flux > second.flux) second = entry;
  }
  if (!best) return { key: NO_STAR_LIGHT, fill: NO_STAR_LIGHT, fillAmount: 0, keyId: null };
  if (!second) return { key: best.dir, fill: best.dir, fillAmount: 0, keyId: best.id };
  return { key: best.dir, fill: second.dir, fillAmount: Math.min(1, second.flux / best.flux), keyId: best.id };
}

/**
 * CPU mirror of the shader's day-side term: the brighter of the key light and the weighted fill, each a
 * smooth terminator over the cosine `cosKey` / `cosFill` between surface normal and light direction.
 */
export function daylight(cosKey: number, cosFill: number, fillAmount: number, low = -0.18, high = 0.28) {
  const step = (x: number) => {
    const t = Math.min(1, Math.max(0, (x - low) / (high - low)));
    return t * t * (3 - 2 * t);
  };
  return Math.max(step(cosKey), step(cosFill) * Math.min(1, Math.max(0, fillAmount)));
}
