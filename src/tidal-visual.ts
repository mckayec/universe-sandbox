// Visual shape of a tidally stretched body: the tidal frame's per-axis scale for a given strain.
// Pure so the lighting tests can build the same nonuniform transform the renderer uses.

/** Largest strain the visual stretch follows; stronger tides are shown at this shape. */
export const MAX_VISUAL_STRAIN = 0.88;

/** Per-axis scale of the tidal frame: long axis along x, the other two compressed slightly unevenly. */
export function tidalVisualScale(tidalStretch: number) {
  const strain = Math.min(MAX_VISUAL_STRAIN, Math.max(0, tidalStretch)),
    elongation = strain * 0.42,
    compression = strain * 0.11;
  return { strain, x: 1 + elongation, y: 1 - compression, z: 1 - compression * 0.72 };
}
