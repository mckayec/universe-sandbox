import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';
import {
  BROWN_DWARF_MJ,
  KEPLER_TOLERANCE,
  LY_PER_PC,
  MAX_LY,
  MJ_EARTH,
  OUT_PATH,
  applyRules,
  build,
  keplerRatio,
  loadJson,
  BASE_PATH,
  mergeArchive,
  serialize,
  validate,
} from '../tools/build_nearby.mjs';

type Star = { name: string; mass_sun: number | null };
type Planet = {
  id: string;
  name: string;
  host: string;
  status: string;
  method: string;
  transiting: boolean;
  mass_earth: number | null;
  mass_src: string | null;
  mass_kind: string | null;
  mass_ref?: string;
  radius_earth: number | null;
  radius_src: string | null;
  period_d: number | null;
  period_src: string | null;
  a_au: number | null;
  a_src: string | null;
  class: string;
  class_label: string;
  kepler_flag?: number;
  notes: string[];
  src: string[];
};
type System = { id: string; name: string; dist_pc: number; dist_ly: number; stars: Star[]; planets: Planet[] };
type Nearby = { systems: System[]; retracted: { name: string }[]; counts: Record<string, number> };

const source = readFileSync(OUT_PATH, 'utf8');
const sandbox: { window: { NEARBY?: Nearby } } = { window: {} };
runInNewContext(source, sandbox);
const data = sandbox.window.NEARBY as Nearby;
const planets = data.systems.flatMap(s => s.planets.map(p => ({ s, p })));
const byId = new Map(planets.map(x => [x.p.id, x]));
const planet = (id: string) => {
  const hit = byId.get(id);
  assert.ok(hit, `planet ${id} is in the shipped data`);
  return hit;
};

test('only one copy of the exoplanet data ships, and it matches the build', () => {
  assert.ok(!existsSync(new URL('../public/exoplanets/data/nearby.json', import.meta.url)));
  assert.equal(source, serialize(build().data), 'nearby.js is stale: run node tools/build_nearby.mjs');
});

test('the build reports no rule violations', () => {
  assert.deepEqual(validate(data), []);
});

test('every planet has the fields the atlas reads, and ids are unique', () => {
  const fields = ['id', 'name', 'host', 'status', 'method', 'transiting', 'mass_earth', 'mass_kind'];
  const more = ['radius_earth', 'radius_src', 'period_d', 'a_au', 'class', 'class_label', 'class_basis'];
  const ids = new Set<string>();
  for (const s of data.systems) {
    assert.ok(!ids.has(s.id), `duplicate id ${s.id}`);
    ids.add(s.id);
    for (const p of s.planets) {
      for (const f of [...fields, ...more, 'palette', 'locked', 'hz_candidate', 'seed', 'notes', 'src'])
        assert.ok(f in p, `${p.id} lacks ${f}`);
      assert.ok(!ids.has(p.id), `duplicate id ${p.id}`);
      ids.add(p.id);
      assert.ok(
        s.stars.some(st => st.name === p.host),
        `${p.id} host ${p.host} is a star of ${s.id}`,
      );
    }
  }
});

test('radius is measured only for transiting or directly imaged planets', () => {
  for (const { p } of planets) {
    if (p.radius_src === 'measured')
      assert.ok(p.transiting || p.method === 'imaging', `${p.id} (${p.method}) has a measured radius`);
  }
  const rvMeasured = planets.filter(({ p }) => p.method === 'RV' && !p.transiting && p.radius_src === 'measured');
  assert.equal(rvMeasured.length, 0);
});

test('radial-velocity masses are minimum masses unless a true-mass reference is recorded', () => {
  for (const { p } of planets) {
    if (p.mass_earth == null) continue;
    assert.ok(['min', 'true', 'upper', 'estimate'].includes(p.mass_kind as string), `${p.id} mass_kind`);
    if (p.mass_kind !== 'estimate') assert.equal(p.mass_src, p.mass_kind, `${p.id} mass_src agrees`);
    if (p.method === 'RV' && !p.transiting && p.mass_kind === 'true')
      assert.ok(p.mass_ref, `${p.id} true RV mass needs a reference`);
  }
  assert.equal(planet('51-peg-b').p.mass_kind, 'min');
  assert.equal(planet('proxima-centauri-b').p.mass_kind, 'min');
  assert.equal(planet('hd-69830-b').p.mass_kind, 'min');
});

test('objects of 13 Jupiter masses or more are brown dwarfs, not gas giants', () => {
  for (const { p } of planets) {
    const mj = (p.mass_earth ?? 0) / MJ_EARTH;
    if (mj >= BROWN_DWARF_MJ && p.mass_kind !== 'upper') assert.equal(p.class, 'brown-dwarf', `${p.id} ${mj} MJ`);
    if (p.class === 'brown-dwarf') assert.equal(p.class_label, 'Brown dwarf');
  }
  for (const id of ['2m-0746-20-b', 'hn-peg-b', '2m-2206-20-b', '2m-2140-16-b'])
    assert.equal(planet(id).p.class, 'brown-dwarf', id);
});

test('upper limits are never presented as masses', () => {
  const au = planet('au-mic-b').p;
  assert.ok(au.mass_earth != null && au.mass_earth < 25, 'AU Mic b uses a measured mass, not the 57 Earth-mass limit');
  assert.equal(au.mass_kind, 'true');
  assert.notEqual(planet('wd-1856-534-b').p.mass_kind, 'true', 'WD 1856+534 b 13.8 MJ is an upper limit');
  for (const { p } of planets) if (p.mass_kind === 'upper') assert.notEqual(p.class, 'brown-dwarf');
});

test("catalogue orbits obey Kepler's third law within 25% or are explicitly flagged", () => {
  for (const { s, p } of planets) {
    const r = keplerRatio(s, p);
    if (r == null) continue;
    if (Math.abs(r - 1) > KEPLER_TOLERANCE) assert.ok(p.kepler_flag != null, `${p.id} a/aKepler = ${r.toFixed(2)}`);
  }
  const close = (id: string, a: number, tol = 0.05) => {
    const got = planet(id).p.a_au as number;
    assert.ok(Math.abs(got / a - 1) < tol, `${id} a = ${got}, expected about ${a}`);
  };
  close('ltt-1445-a-c', 0.0266);
  close('hip-12961-b', 0.25);
  close('toi-198-b', 0.0675);
  close('hip-70849-b', 3.99);
});

test('no placeholder-looking round orbits remain', () => {
  for (const { p } of planets) {
    const roundP = p.period_d != null && p.period_d >= 1000 && p.period_d % 1000 === 0;
    const roundA = p.a_au != null && p.a_au >= 1 && Number.isInteger(p.a_au);
    assert.ok(!(roundP && roundA), `${p.id}: P ${p.period_d} d, a ${p.a_au} AU`);
  }
});

test('distances are Gaia/NASA values within 100 light-years', () => {
  for (const s of data.systems) {
    assert.ok(s.dist_ly <= MAX_LY, `${s.id} at ${s.dist_ly} ly`);
    assert.ok(Math.abs(s.dist_ly - s.dist_pc * LY_PER_PC) < 0.01, `${s.id} ly/pc`);
  }
  const sys = (id: string) => data.systems.find(s => s.id === id) as System;
  assert.ok(Math.abs(sys('51-peg').dist_pc - 15.46) < 0.01);
  assert.ok(Math.abs(sys('gj-1214').dist_pc - 14.64) < 0.01);
  assert.ok(Math.abs(sys('hd-189733').dist_pc - 19.76) < 0.01);
  for (const id of ['hd-89307', 'toi-1693', 'hd-8326'])
    assert.ok(!sys(id), `${id} lies beyond 100 light-years and is excluded`);
});

test('counts match the shipped systems', () => {
  const ps = planets.map(x => x.p);
  assert.equal(data.counts.systems, data.systems.length);
  assert.equal(data.counts.confirmed_planets, ps.filter(p => p.status === 'confirmed').length);
  assert.equal(data.counts.disputed_planets, ps.filter(p => p.status === 'disputed').length);
  assert.equal(data.counts.retracted_or_excluded, data.retracted.length);
});

test('archive rows (pscomppars) override distance, orbit and mass type, and drop systems beyond 100 ly', () => {
  const base = loadJson(BASE_PATH);
  const rows = [
    { pl_name: '51 Peg b', sy_dist: 15.4614, tran_flag: 0, ima_flag: 0, pl_orbper: 4.2307969, pl_orbsmax: 0.05235 },
    { pl_name: 'HD 89307 b', sy_dist: 32.0104, tran_flag: 0, ima_flag: 0 },
    { pl_name: 'GJ 1214 b', sy_dist: 14.6427, tran_flag: 1, ima_flag: 0, pl_rade: 2.733 },
  ];
  Object.assign(rows[0], { pl_bmasse: 147, pl_bmassprov: 'Msini', pl_bmasselim: 0 });
  const report = mergeArchive(base, rows);
  applyRules(base);
  assert.equal(report.matched, 3);
  assert.ok(report.beyond.includes('HD 89307'));
  const p51 = base.systems.find((s: System) => s.id === '51-peg') as System;
  assert.equal(p51.dist_pc, 15.4614);
  assert.ok(Math.abs(p51.dist_ly - 50.43) < 0.01);
  assert.equal(p51.planets[0].mass_kind, 'min');
  assert.equal(p51.planets[0].radius_src, 'estimated');
  assert.ok(!base.systems.some((s: System) => s.id === 'hd-89307'));
});
