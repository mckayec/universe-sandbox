// Tracer-star dynamics for interacting galaxies (pure logic, no three.js; tested in tests/galaxy-field.test.ts).
//
// A galaxy's rendered stars are massless tracers, the classic Toomre & Toomre (1972) model of galaxy encounters:
// each one orbits in the summed gravity of every galaxy core (a softened point mass plus its dark-matter halo) and
// of any loose black hole, but tracers don't pull on one another. That is enough to raise tidal tails, bridges,
// shells and the scattered debris of a merger, and it costs O(stars × cores) per step.

/**
 * A source of gravity for tracers: a softened point mass plus an optional halo, already multiplied by G. The point
 * mass pulls with G·M / (r² + soft²), exactly as the body gravity engine does, so tracers and member stars agree.
 */
export type FieldSource = {
  x: number;
  z: number;
  /** G·M of the point mass (black hole or core). */
  gm: number;
  /** Softening length² of the point mass. */
  soft2: number;
  /** G·M of the dark-matter halo (0 for a loose black hole). */
  haloGM: number;
  /** Halo scale radius: enclosed fraction (r / (r + scale))^1.45. */
  haloScale: number;
};
/** Extra acceleration applied to the stars of one galaxy (dynamical friction), weighted by distance from its core. */
export type FieldFriction = { ax: number; az: number; cx: number; cz: number; radius: number };
export type Tracers = { n: number; x: Float32Array; z: Float32Array; vx: Float32Array; vz: Float32Array };

/** Halo mass enclosed within `radius`, as a fraction of the whole halo (the exhibit's simplified profile). */
export function haloFraction(radius: number, scale: number) {
  return Math.pow(radius / (radius + scale), 1.45);
}

const TABLE_STEP = 0.5,
  TABLE_SIZE = 6000,
  HALO_SOFT2 = 4,
  tables = new Map<number, Float32Array>();
/** (r/(r+s))^1.45 / (r² + soft²)^1.5 sampled every TABLE_STEP, so the inner loop avoids pow(). */
function haloTable(scale: number) {
  const key = Math.round(scale * 4) / 4;
  let table = tables.get(key);
  if (table) return table;
  table = new Float32Array(TABLE_SIZE + 2);
  for (let i = 0; i < table.length; i++) {
    const r = i * TABLE_STEP;
    table[i] = haloFraction(r, key) / Math.pow(r * r + HALO_SOFT2, 1.5);
  }
  tables.set(key, table);
  return table;
}
type PreparedSource = FieldSource & { table: Float32Array };
function prepare(sources: readonly FieldSource[]): PreparedSource[] {
  return sources.map(source => ({ ...source, table: haloTable(source.haloScale) }));
}

/** Acceleration at (x, z) from all sources, written to out[0], out[1]. */
export function fieldAcceleration(sources: readonly FieldSource[], x: number, z: number, out: [number, number]) {
  let ax = 0,
    az = 0;
  for (const s of prepare(sources)) {
    const dx = s.x - x,
      dz = s.z - z,
      r2 = dx * dx + dz * dz,
      r = Math.sqrt(r2);
    if (r < 1e-4) continue;
    let k = s.gm / ((r2 + s.soft2) * r);
    if (s.haloGM > 0) k += s.haloGM * haloLookup(s.table, r);
    ax += dx * k;
    az += dz * k;
  }
  out[0] = ax;
  out[1] = az;
  return out;
}
function haloLookup(table: Float32Array, r: number) {
  const f = r / TABLE_STEP;
  if (f >= TABLE_SIZE) return 1 / (r * r * r);
  const i = f | 0,
    t = f - i;
  return table[i] + (table[i + 1] - table[i]) * t;
}

/** Speed of a circular orbit around (cx, cz) at (x, z), from the inward pull of all sources there. */
export function circularSpeed(sources: readonly FieldSource[], cx: number, cz: number, x: number, z: number) {
  const a: [number, number] = [0, 0];
  fieldAcceleration(sources, x, z, a);
  const rx = x - cx,
    rz = z - cz,
    r = Math.hypot(rx, rz);
  if (r < 1e-6) return 0;
  const inward = -(a[0] * rx + a[1] * rz) / r;
  return Math.sqrt(Math.max(0, inward * r));
}

/**
 * Advance tracers by `dt` in `substeps` drift–kick–drift (leapfrog) steps. Sources are held fixed for the
 * interval (they move little within one frame). Friction, when given, is weighted 1 / (1 + (r / radius)^4) by
 * distance from the galaxy's core, so the bound core is slowed with its black hole while tidal tails are not.
 * With `stride` > 1 only every stride-th tracer, starting at `first`, is advanced (the caller rotates `first`
 * and passes the time that subset has accumulated), which spreads the cost of huge star fields over frames.
 */
export function advanceTracers(
  tracers: Tracers,
  sources: readonly FieldSource[],
  dt: number,
  substeps: number,
  friction?: FieldFriction,
  first = 0,
  stride = 1,
) {
  if (dt <= 0 || !tracers.n) return;
  const prepared = prepare(sources),
    count = prepared.length,
    sx = new Float64Array(count),
    sz = new Float64Array(count),
    gm = new Float64Array(count),
    soft2 = new Float64Array(count),
    halo = new Float64Array(count),
    tables: Float32Array[] = [];
  for (let k = 0; k < count; k++) {
    sx[k] = prepared[k].x;
    sz[k] = prepared[k].z;
    gm[k] = prepared[k].gm;
    soft2[k] = prepared[k].soft2;
    halo[k] = prepared[k].haloGM;
    tables.push(prepared[k].table);
  }
  const steps = Math.max(1, substeps),
    h = dt / steps,
    half = h * 0.5,
    { x, z, vx, vz } = tracers,
    fax = friction ? friction.ax : 0,
    faz = friction ? friction.az : 0,
    fcx = friction ? friction.cx : 0,
    fcz = friction ? friction.cz : 0,
    fr = friction ? 1 / Math.max(1, friction.radius) : 0,
    useFriction = !!friction && (fax !== 0 || faz !== 0),
    invStep = 1 / TABLE_STEP;
  for (let i = first; i < tracers.n; i += stride) {
    let px = x[i],
      pz = z[i],
      pvx = vx[i],
      pvz = vz[i];
    for (let step = 0; step < steps; step++) {
      px += pvx * half;
      pz += pvz * half;
      let ax = 0,
        az = 0;
      for (let k = 0; k < count; k++) {
        const dx = sx[k] - px,
          dz = sz[k] - pz,
          r2 = dx * dx + dz * dz + 1e-6,
          r = Math.sqrt(r2);
        let a = gm[k] / ((r2 + soft2[k]) * r);
        const hk = halo[k];
        if (hk > 0) {
          const f = r * invStep;
          if (f >= TABLE_SIZE) a += hk / (r2 * r);
          else {
            const table = tables[k],
              j = f | 0,
              t0 = table[j];
            a += hk * (t0 + (table[j + 1] - t0) * (f - j));
          }
        }
        ax += dx * a;
        az += dz * a;
      }
      if (useFriction) {
        const rx = (px - fcx) * fr,
          rz = (pz - fcz) * fr,
          q = rx * rx + rz * rz,
          w = 1 / (1 + q * q);
        ax += fax * w;
        az += faz * w;
      }
      pvx += ax * h;
      pvz += az * h;
      px += pvx * half;
      pz += pvz * half;
    }
    x[i] = px;
    z[i] = pz;
    vx[i] = pvx;
    vz[i] = pvz;
  }
}

/** Substeps for `dt` of simulated time: about one per 1/16 s, at most `cap` (high time speeds trade accuracy). */
export function substepsFor(dt: number, cap = 4) {
  return Math.min(cap, Math.max(1, Math.ceil(dt / 0.06)));
}
