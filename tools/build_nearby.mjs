#!/usr/bin/env node
/**
 * Build public/exoplanets/data/nearby.js (window.NEARBY) for the "Nearby Worlds" atlas.
 *
 * Inputs
 *   tools/data/nearby.base.json   Snapshot of the atlas dataset (Open Exoplanet Catalogue extraction,
 *                                 cross-checked 2026-10-23). The extractor that produced it was never
 *                                 committed; this file is the frozen starting point.
 *   tools/data/corrections.json   Hand-verified corrections, each with its source URL.
 *   NASA Exoplanet Archive TAP    Optional (--archive): table pscomppars, planets with sy_dist <= 30.66 pc
 *                                 (100 light-years). Distances, orbits, masses (with M sin i vs true mass)
 *                                 and transit/imaging flags are taken from the archive when a planet matches.
 *
 * Usage
 *   node tools/build_nearby.mjs                      base + corrections + rules -> nearby.js
 *   node tools/build_nearby.mjs --archive            also query the archive TAP service and merge
 *   node tools/build_nearby.mjs --archive-file F     merge a saved TAP JSON response instead of querying
 *   node tools/build_nearby.mjs --save-archive F     with --archive: also save the raw TAP response to F
 *   node tools/build_nearby.mjs --check              fail if nearby.js is out of date (no write)
 *
 * Data rules enforced here (and re-checked by tests/exoplanets-data.test.ts):
 *   - radius is "measured" only for transiting or directly imaged planets; otherwise it is "estimated"
 *     from the (minimum) mass with the Chen & Kipping (2017) relation and shown with "≈".
 *   - mass_kind: "min" (M sin i), "true", "upper" (upper limit) or "estimate". A radial-velocity-only
 *     planet keeps a true mass only when a reference for it is recorded in mass_ref.
 *   - objects at or above 13 Jupiter masses are classed "brown-dwarf", not "gas-giant".
 *   - Kepler's third law: a catalogue semi-major axis that disagrees with the period and the central mass
 *     by more than 25% is flagged (kepler_flag + a note) unless corrected.
 *   - systems beyond 30.66 pc (100 light-years) are excluded.
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
export const ROOT = resolve(HERE, '..');
export const BASE_PATH = resolve(HERE, 'data/nearby.base.json');
export const CORRECTIONS_PATH = resolve(HERE, 'data/corrections.json');
export const OUT_PATH = resolve(ROOT, 'public/exoplanets/data/nearby.js');

export const LY_PER_PC = 3.26156;
export const MAX_LY = 100;
export const MAX_PC = 30.66; // 100 ly
export const MJ_EARTH = 317.828;
export const MSUN_EARTH = 332946;
export const BROWN_DWARF_MJ = 13;
export const KEPLER_TOLERANCE = 0.25;
const RSUN_AU = 0.00465047;

export const TAP_URL = 'https://exoplanetarchive.ipac.caltech.edu/TAP/sync';
export const ARCHIVE_QUERY = [
  'select pl_name,hostname,sy_dist,ra,dec,discoverymethod,disc_year,',
  'tran_flag,ima_flag,rv_flag,ast_flag,ttv_flag,etv_flag,',
  'pl_orbper,pl_orbsmax,pl_orbeccen,pl_orbincl,',
  'pl_bmasse,pl_bmasselim,pl_bmassprov,pl_rade,pl_radelim,pl_eqt,',
  'st_mass,st_rad,st_teff,st_lum,sy_snum',
  ` from pscomppars where sy_dist <= ${MAX_PC}`,
].join('');
export const archiveUrl = () => `${TAP_URL}?query=${encodeURIComponent(ARCHIVE_QUERY)}&format=json`;

export const CLASS_LABEL = {
  rocky: 'Rocky planet',
  'super-earth': 'Super-Earth',
  'mini-neptune': 'Mini-Neptune',
  'ice-giant': 'Ice giant',
  'gas-giant': 'Gas giant',
  'brown-dwarf': 'Brown dwarf',
  unknown: 'Unknown',
};

const round = (v, dp) => (v == null ? v : Math.round(v * 10 ** dp) / 10 ** dp);

/** Assign a derived value only when it differs from the stored one by more than rel (keeps diffs small). */
function setIfDiff(obj, key, value, rel = 0.005) {
  const cur = obj[key];
  if (cur == null || value == null || Math.abs(value - cur) > rel * Math.max(Math.abs(value), 1e-9)) obj[key] = value;
}

/* ------------------------------------------------------------------ physics helpers */

/** Semi-major axis (AU) from period (days) and central mass (solar masses). */
export function keplerA(periodDays, centralMassSun, planetMassEarth = 0) {
  const m = centralMassSun + (planetMassEarth || 0) / MSUN_EARTH;
  return Math.cbrt((periodDays / 365.25) ** 2 * m);
}

/** Period (days) from semi-major axis (AU) and central mass (solar masses). */
export function keplerP(aAu, centralMassSun, planetMassEarth = 0) {
  const m = centralMassSun + (planetMassEarth || 0) / MSUN_EARTH;
  return Math.sqrt(aAu ** 3 / m) * 365.25;
}

/** Chen & Kipping (2017) mean mass-radius relation (Earth units). */
export function chenKipping(massEarth) {
  const r1 = 1.008 * 2.04 ** 0.279;
  if (massEarth < 2.04) return 1.008 * massEarth ** 0.279;
  const r2 = r1 * (131.6 / 2.04) ** 0.589;
  if (massEarth < 131.6) return r1 * (massEarth / 2.04) ** 0.589;
  return r2 * (massEarth / 131.6) ** -0.044;
}

export function classFromRadius(r) {
  return r < 1.25 ? 'rocky' : r < 2 ? 'super-earth' : r < 4 ? 'mini-neptune' : r < 8 ? 'ice-giant' : 'gas-giant';
}
export function classFromMass(m) {
  return m < 2 ? 'rocky' : m < 6 ? 'super-earth' : m < 15 ? 'mini-neptune' : m < 50 ? 'ice-giant' : 'gas-giant';
}

/** Mass kind from the legacy mass_src field. */
export function kindFromSrc(src) {
  return { min: 'min', true: 'true', upper: 'upper', model: 'estimate', estimated: 'estimate' }[src] ?? null;
}

export const radiusCanBeMeasured = p => !!p.transiting || p.method === 'imaging';
export const isRvOnly = p => p.method === 'RV' && !p.transiting;
export const hostOf = (s, p) => s.stars.find(st => st.name === p.host) || s.stars[0];
export const centralMass = (s, p) => p.orbit_mass_sun ?? hostOf(s, p)?.mass_sun ?? null;

/** Ratio catalogue a / Kepler a, or null when it cannot be checked. */
export function keplerRatio(s, p) {
  const M = centralMass(s, p);
  if (!p.period_d || !p.a_au || !M) return null;
  if (p.a_src !== 'catalogue' || p.period_src !== 'catalogue') return null;
  return p.a_au / keplerA(p.period_d, M, p.mass_earth);
}

/* ------------------------------------------------------------------ corrections */

function addUnique(list, items) {
  for (const it of items || []) if (!list.includes(it)) list.push(it);
}

/** Apply tools/data/corrections.json (hand-verified, sourced values). */
export function applyCorrections(data, corr, log = []) {
  const sysById = new Map(data.systems.map(s => [s.id, s]));
  const planetById = new Map();
  for (const s of data.systems) for (const p of s.planets) planetById.set(p.id, { s, p });

  for (const [id, c] of Object.entries(corr.systems || {})) {
    const s = sysById.get(id);
    if (!s) throw new Error(`correction for unknown system ${id}`);
    Object.assign(s, c.set);
    if (c.set.dist_pc != null) s.dist_changed = true;
    addUnique(s.notes, c.notes);
    log.push({ target: id, kind: 'system', set: c.set, verified: c.verified });
  }
  for (const [key, c] of Object.entries(corr.stars || {})) {
    const [sid, starName] = key.split('/');
    const st = sysById.get(sid)?.stars.find(x => x.name === starName);
    if (!st) throw new Error(`correction for unknown star ${key}`);
    Object.assign(st, c.set);
    log.push({ target: key, kind: 'star', set: c.set, verified: c.verified });
  }
  for (const [id, c] of Object.entries(corr.planets || {})) {
    const hit = planetById.get(id);
    if (!hit) throw new Error(`correction for unknown planet ${id}`);
    const { p } = hit;
    Object.assign(p, c.set);
    addUnique(p.notes, c.notes);
    addUnique(p.src, c.src);
    log.push({ target: id, kind: 'planet', set: c.set, verified: c.verified });
  }
  for (const ex of corr.exclude_systems || []) {
    const s = sysById.get(ex.id);
    if (!s) throw new Error(`exclusion for unknown system ${ex.id}`);
    data.systems = data.systems.filter(x => x !== s);
    for (const p of s.planets)
      data.retracted.push({ name: p.name, system: s.name, status: 'excluded', reason: ex.reason });
    log.push({ target: ex.id, kind: 'exclude', reason: ex.reason, verified: ex.verified });
  }
  Object.assign(data.SOURCES.cross_check, corr.sources || {});
  return log;
}

/* ------------------------------------------------------------------ archive merge */

const GREEK = {
  alf: 'alpha',
  bet: 'beta',
  gam: 'gamma',
  del: 'delta',
  eps: 'epsilon',
  zet: 'zeta',
  eta: 'eta',
  tet: 'theta',
  iot: 'iota',
  kap: 'kappa',
  lam: 'lambda',
  mu: 'mu',
  nu: 'nu',
  ksi: 'xi',
  omi: 'omicron',
  pi: 'pi',
  rho: 'rho',
  sig: 'sigma',
  tau: 'tau',
  ups: 'upsilon',
  phi: 'phi',
  chi: 'chi',
  psi: 'psi',
  ome: 'omega',
};
/** Normalise a planet or star name for matching archive rows to atlas entries. */
export function normName(n) {
  let s = String(n).toLowerCase().replace(/[‐-―]/g, '-');
  s = s.replace(/^([a-z]{2,3})\s/, (m, g) => (GREEK[g] ? GREEK[g] + ' ' : m));
  s = s.replace(/\b(gliese|gl)\b/g, 'gj');
  return s.replace(/[\s._\-+']/g, '');
}

/**
 * Merge NASA Exoplanet Archive pscomppars rows into the dataset.
 * Returns a report of what changed, what could not be matched, and which systems fall outside 100 ly.
 */
export function mergeArchive(data, rows, report = { matched: 0, unmatchedArchive: [], notInArchive: [], beyond: [] }) {
  const index = new Map();
  for (const s of data.systems)
    for (const p of s.planets) for (const n of [p.name, ...(p.aliases || [])]) index.set(normName(n), { s, p });
  const seen = new Set();
  const sysDist = new Map();
  for (const r of rows) {
    const hit = index.get(normName(r.pl_name));
    if (!hit) {
      report.unmatchedArchive.push(r.pl_name);
      continue;
    }
    const { s, p } = hit;
    seen.add(p);
    report.matched++;
    if (r.sy_dist != null) sysDist.set(s, r.sy_dist);
    p.transiting = r.tran_flag === 1;
    p.archive_name = r.pl_name;
    if (r.pl_orbper != null) Object.assign(p, { period_d: r.pl_orbper, period_src: 'catalogue' });
    if (r.pl_orbsmax != null) Object.assign(p, { a_au: r.pl_orbsmax, a_src: 'catalogue' });
    if (r.pl_orbeccen != null) Object.assign(p, { ecc: r.pl_orbeccen, ecc_src: 'catalogue' });
    if (r.pl_orbincl != null) p.incl_deg = r.pl_orbincl;
    if (r.pl_bmasse != null) {
      p.mass_earth = r.pl_bmasse;
      const prov = String(r.pl_bmassprov || '').toLowerCase();
      const kind = r.pl_bmasselim === 1 ? 'upper' : prov === 'msini' ? 'min' : 'true';
      p.mass_kind = kind;
      p.mass_src = kind;
      if (kind === 'true')
        p.mass_ref = p.mass_ref || 'NASA Exoplanet Archive pscomppars (pl_bmassprov ' + r.pl_bmassprov + ')';
    }
    const radiusMeasured = r.tran_flag === 1 || r.ima_flag === 1;
    if (radiusMeasured && r.pl_rade != null && r.pl_radelim !== 1)
      Object.assign(p, { radius_earth: r.pl_rade, radius_src: 'measured' });
    else if (!radiusMeasured) p.radius_src = 'estimated';
    if (!p.src.includes('NASA-TAP')) p.src.push('NASA-TAP');
  }
  for (const [s, d] of sysDist)
    if (Math.abs(d - s.dist_pc) > 1e-4)
      Object.assign(s, { dist_pc: round(d, 4), dist_changed: true, dist_src: 'NASA Exoplanet Archive sy_dist' });
  for (const s of data.systems)
    for (const p of s.planets) if (!seen.has(p) && p.status === 'confirmed') report.notInArchive.push(p.name);
  const keep = [];
  for (const s of data.systems) {
    if (s.dist_pc > MAX_PC) {
      report.beyond.push(s.name);
      for (const p of s.planets)
        data.retracted.push({
          name: p.name,
          system: s.name,
          status: 'excluded',
          reason: `Beyond 100 light-years (NASA Exoplanet Archive sy_dist ${s.dist_pc} pc).`,
        });
    } else keep.push(s);
  }
  data.systems = keep;
  data.SOURCES.cross_check['NASA-TAP'] =
    `NASA Exoplanet Archive TAP, table pscomppars (${TAP_URL}); queried ${new Date().toISOString().slice(0, 10)}`;
  return report;
}

/* ------------------------------------------------------------------ rules */

function galacticXyz(s) {
  const l = (s.gal_l * Math.PI) / 180;
  const b = (s.gal_b * Math.PI) / 180;
  const D = s.dist_ly;
  return [D * Math.cos(b) * Math.cos(l), D * Math.sin(b), -D * Math.cos(b) * Math.sin(l)].map(v => round(v, 3));
}

function paletteFor(cls, T) {
  if (T == null) return null;
  const rockyLike = cls === 'rocky' || cls === 'super-earth' || cls === 'unknown';
  if (rockyLike) return T >= 850 ? 'lava' : T >= 380 ? 'hot' : T >= 175 ? 'temperate' : 'frozen';
  return T >= 1000 ? 'hot' : T >= 450 ? 'warm' : T >= 160 ? 'temperate' : 'frozen';
}

function hzZone(st, a) {
  const hz = st?.hz;
  if (!hz || !a) return null;
  if (a >= hz.runaway && a <= hz.maxGreenhouse) return 'conservative';
  if (a >= hz.recentVenus && a <= hz.earlyMars) return 'optimistic';
  return null;
}

const KEPLER_NOTE = 'Kepler check: the catalogue orbit size and period disagree by more than 25% for this star mass.';

/** Re-derive every dependent field and enforce the data rules. Returns a list of rule actions. */
export function applyRules(data, actions = []) {
  for (const s of data.systems) {
    if (s.dist_changed) {
      s.dist_ly = round(s.dist_pc * LY_PER_PC, 3);
      s.xyz = galacticXyz(s);
    }
    delete s.dist_changed;
    for (const p of s.planets) rulePlanet(s, p, actions);
  }
  recount(data);
  return actions;
}

function rulePlanet(s, p, actions) {
  const st = hostOf(s, p);
  // radius: measured only for transiting / directly imaged planets
  if (p.radius_src === 'measured' && !radiusCanBeMeasured(p)) {
    p.radius_src = 'estimated';
    actions.push(`${p.id}: radius re-labelled estimated (not transiting or imaged)`);
  }
  // mass kind
  if (p.mass_kind === undefined) p.mass_kind = kindFromSrc(p.mass_src);
  if (isRvOnly(p) && p.mass_kind === 'true' && !p.mass_ref) {
    p.mass_kind = 'min';
    actions.push(`${p.id}: radial-velocity-only mass re-labelled minimum (no true-mass reference)`);
  }
  if (p.mass_kind === 'min' || p.mass_kind === 'true' || p.mass_kind === 'upper') p.mass_src = p.mass_kind;
  // derived orbit
  const M = centralMass(s, p);
  if (M && p.a_src === 'derived' && p.period_d) setIfDiff(p, 'a_au', round(keplerA(p.period_d, M), 6));
  if (M && p.period_src === 'derived' && p.a_au) setIfDiff(p, 'period_d', round(keplerP(p.a_au, M), 4));
  // estimated radius from (minimum) mass
  if (p.radius_src === 'estimated' && p.mass_earth != null)
    setIfDiff(p, 'radius_earth', round(chenKipping(p.mass_earth), 3), 0.01);
  // class
  const mj = p.mass_earth != null ? p.mass_earth / MJ_EARTH : null;
  if (mj != null && mj >= BROWN_DWARF_MJ && p.mass_kind !== 'upper') {
    p.class = 'brown-dwarf';
    p.class_basis = p.mass_kind === 'min' ? 'minimum mass' : 'mass';
  } else if (p.radius_src === 'measured' && p.radius_earth) {
    p.class = classFromRadius(p.radius_earth);
    p.class_basis = 'radius';
  } else if (p.mass_earth != null) {
    p.class = classFromMass(p.mass_earth);
    p.class_basis = p.mass_kind === 'min' ? 'minimum mass' : 'mass';
  } else if (p.radius_earth) {
    p.class = classFromRadius(p.radius_earth);
    p.class_basis = 'radius';
  } else p.class = 'unknown';
  p.class_label = CLASS_LABEL[p.class];
  // Kepler consistency
  const ratio = keplerRatio(s, p);
  delete p.kepler_flag;
  p.notes = p.notes.filter(n => !n.startsWith('Kepler check:'));
  if (ratio != null && Math.abs(ratio - 1) > KEPLER_TOLERANCE) {
    p.kepler_flag = round(ratio, 3);
    p.notes.push(KEPLER_NOTE);
    actions.push(`${p.id}: Kepler mismatch, a / a_Kepler = ${round(ratio, 2)}`);
  }
  // temperature, light, look
  const a = p.a_au;
  if (a && st?.lum_sun) setIfDiff(p, 'insolation', round(st.lum_sun / a ** 2, 4));
  if (p.teq_src === 'derived' && a && st?.teff && st?.radius_sun)
    setIfDiff(p, 'teq_k', Math.round(st.teff * Math.sqrt((st.radius_sun * RSUN_AU) / (2 * a)) * 0.7 ** 0.25));
  const pal = paletteFor(p.class === 'brown-dwarf' ? 'gas-giant' : p.class, p.teq_k);
  if (pal) p.palette = pal;
  if (a) p.locked = a < 0.06 || (a < 0.25 && (st?.teff ?? 9999) < 4000);
  p.hz = hzZone(st, a);
  const small = p.radius_src === 'measured' ? p.radius_earth < 2 : p.mass_earth != null && p.mass_earth < 10;
  p.hz_candidate = !!p.hz && small && p.class !== 'brown-dwarf';
}

function recount(data) {
  const planets = data.systems.flatMap(s => s.planets);
  const maxPc = Math.max(...data.systems.map(s => s.dist_pc));
  data.counts = {
    systems: data.systems.length,
    systems_with_confirmed: data.systems.filter(s => s.planets.some(p => p.status === 'confirmed')).length,
    confirmed_planets: planets.filter(p => p.status === 'confirmed').length,
    disputed_planets: planets.filter(p => p.status === 'disputed').length,
    brown_dwarfs: planets.filter(p => p.class === 'brown-dwarf').length,
    retracted_or_excluded: data.retracted.length,
    max_distance_pc: round(maxPc, 2),
    max_distance_ly: round(maxPc * LY_PER_PC, 1),
  };
}

/* ------------------------------------------------------------------ validation */

/** Return a list of rule violations (empty when the dataset is clean). */
export function validate(data) {
  const errs = [];
  const ids = new Set();
  for (const s of data.systems) {
    if (ids.has(s.id)) errs.push(`duplicate id ${s.id}`);
    ids.add(s.id);
    if (!(s.dist_ly <= MAX_LY)) errs.push(`${s.id}: ${s.dist_ly} ly is beyond 100 ly`);
    if (Math.abs(s.dist_ly - s.dist_pc * LY_PER_PC) > 0.01) errs.push(`${s.id}: ly/pc mismatch`);
    for (const p of s.planets) {
      if (ids.has(p.id)) errs.push(`duplicate id ${p.id}`);
      ids.add(p.id);
      if (p.radius_src === 'measured' && !radiusCanBeMeasured(p))
        errs.push(`${p.id}: measured radius without transit or imaging`);
      if (p.mass_earth != null && !['min', 'true', 'upper', 'estimate'].includes(p.mass_kind))
        errs.push(`${p.id}: bad mass_kind ${p.mass_kind}`);
      if (isRvOnly(p) && p.mass_kind === 'true' && !p.mass_ref)
        errs.push(`${p.id}: RV-only true mass without mass_ref`);
      const mj = p.mass_earth != null ? p.mass_earth / MJ_EARTH : 0;
      if (mj >= BROWN_DWARF_MJ && p.mass_kind !== 'upper' && p.class !== 'brown-dwarf')
        errs.push(`${p.id}: ${round(mj, 1)} MJ not classed brown dwarf`);
      const ratio = keplerRatio(s, p);
      if (ratio != null && Math.abs(ratio - 1) > KEPLER_TOLERANCE && p.kepler_flag == null)
        errs.push(`${p.id}: unflagged Kepler mismatch`);
      if (p.period_d >= 1000 && p.period_d % 1000 === 0 && p.a_au >= 1 && Number.isInteger(p.a_au))
        errs.push(`${p.id}: placeholder-looking orbit (P ${p.period_d} d, a ${p.a_au} AU)`);
    }
  }
  return errs;
}

/* ------------------------------------------------------------------ build */

export function loadJson(path) {
  return JSON.parse(readFileSync(path, 'utf8'));
}

export function build({ archiveRows = null, log = [] } = {}) {
  const data = loadJson(BASE_PATH);
  const corr = loadJson(CORRECTIONS_PATH);
  const report = archiveRows ? mergeArchive(data, archiveRows) : null;
  applyCorrections(data, corr, log);
  const actions = applyRules(data);
  data.SOURCES.generated_by = 'tools/build_nearby.mjs';
  data.SOURCES.base_catalogue.note =
    'Shallow clone of the main branch (nightly automated update from oec_continuity). Planets kept when the host system is within 100 light-years (30.66 pc).';
  data.SOURCES.corrections = corr.summary;
  data.SOURCES.rules = {
    radius:
      'Measured only for transiting or directly imaged planets; otherwise estimated from the (minimum) mass (Chen & Kipping 2017).',
    mass_kind:
      'min = M sin i from radial velocities or timing; true = dynamical, astrometric or transit mass (reference in mass_ref for RV planets); upper = upper limit; estimate = model or mass-radius estimate.',
    brown_dwarf: 'Objects of 13 Jupiter masses or more are classed as brown dwarfs (IAU working definition).',
    kepler: 'Catalogue semi-major axes more than 25% away from Kepler’s third law are flagged with kepler_flag.',
    distance:
      'NASA Exoplanet Archive sy_dist (Gaia DR3 parallax where available); systems beyond 100 light-years are excluded.',
  };
  if (!data.SOURCES.sources_used.includes('NASA-EA')) data.SOURCES.sources_used.push('NASA-EA');
  return { data, actions, report, log, errors: validate(data) };
}

export function serialize(data) {
  return (
    '/* Generated by tools/build_nearby.mjs from tools/data/nearby.base.json and tools/data/corrections.json - do not edit by hand. */\n' +
    'window.NEARBY=' +
    JSON.stringify(data) +
    ';\n'
  );
}

async function fetchArchive() {
  const res = await fetch(archiveUrl());
  if (!res.ok) throw new Error(`TAP request failed: HTTP ${res.status}`);
  return res.json();
}

async function main(argv) {
  const has = f => argv.includes(f);
  const arg = f => (argv.includes(f) ? argv[argv.indexOf(f) + 1] : null);
  let rows = null;
  if (arg('--archive-file')) rows = loadJson(arg('--archive-file'));
  else if (has('--archive')) {
    rows = await fetchArchive();
    if (arg('--save-archive')) writeFileSync(arg('--save-archive'), JSON.stringify(rows));
  }
  const { data, actions, report, errors } = build({ archiveRows: rows });
  for (const a of actions) console.log('rule  ', a);
  if (report) {
    console.log(
      `archive: ${report.matched} matched, ${report.unmatchedArchive.length} archive planets not in the atlas`,
    );
    if (report.unmatchedArchive.length) console.log('  not in atlas:', report.unmatchedArchive.join(', '));
    if (report.notInArchive.length) console.log('  atlas planets not in archive:', report.notInArchive.join(', '));
    if (report.beyond.length) console.log('  excluded beyond 100 ly:', report.beyond.join(', '));
  }
  if (errors.length) {
    for (const e of errors) console.error('error ', e);
    process.exit(1);
  }
  const out = serialize(data);
  if (has('--check')) {
    const cur = readFileSync(OUT_PATH, 'utf8');
    if (cur !== out) {
      console.error('nearby.js is out of date; run node tools/build_nearby.mjs');
      process.exit(1);
    }
    console.log('nearby.js is up to date');
    return;
  }
  writeFileSync(OUT_PATH, out);
  console.log(
    `wrote ${OUT_PATH} (${out.length} bytes): ${data.counts.systems} systems, ${data.counts.confirmed_planets} confirmed planets`,
  );
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main(process.argv.slice(2)).catch(e => {
    console.error(e.message);
    process.exit(1);
  });
}
