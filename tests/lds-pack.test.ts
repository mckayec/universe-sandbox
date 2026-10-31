import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import vm from 'node:vm';

// Regression tests for the LDS build-audit findings BA01, BA05 and BA06 (docs/universes/packs/lds-standard-works).
const ctx: { window: Record<string, any> } = { window: {} };
vm.runInNewContext(readFileSync(new URL('../public/atlas/layers.js', import.meta.url), 'utf8'), ctx);
vm.runInNewContext(readFileSync(new URL('../public/atlas/packs/lds-standard-works.js', import.meta.url), 'utf8'), ctx);
const L = ctx.window.AtlasLayers;
const P = ctx.window.ATLAS_PACKS['lds-standard-works'];
const plain = (v: unknown) => (v === undefined ? v : JSON.parse(JSON.stringify(v)));
const earth = P.worlds.find((w: any) => (w.sites || []).length);
const sites = new Map<string, any>(earth.sites.map((s: any) => [s.id, s]));
const route = (id: string) => earth.routes.find((r: any) => r.id === id);
const codex = (tab: string) => P.codex.find((t: any) => t.id === tab).list;
const shown = (tab: string, layer: string, name: string) =>
  L.codexSplit(codex(tab), new Set([layer]), null, false, 0).shown.filter((x: any) => x.name === name);

test('BA01: Lystra and South Pass are held as named unplaced stops, not pins', () => {
  assert.equal(sites.has('lystra'), false);
  assert.equal(sites.has('south-pass'), false);
  const placed = (id: string) => sites.has(id);
  const mission = plain(L.routeLegs(route('paul-first-mission'), placed)) as string[][];
  const trek = plain(L.routeLegs(route('valley-migration'), placed)) as string[][];
  for (const leg of [...mission, ...trek]) {
    assert.ok(!leg.includes('lystra') && !leg.includes('south-pass'), String(leg));
  }
  // no bridge across the unknown stops: Iconium never joins Iconium, Chimney Rock never joins Fort Bridger
  assert.ok(!trek.some(([a, b]) => a === 'chimney-rock' && b === 'fort-bridger'));
  const names = (r: any) => r.stops.filter((s: any) => s && s.name).map((s: any) => s.name);
  assert.equal(names(route('paul-first-mission')).filter((n: string) => n === 'Lystra').length, 2);
  assert.ok(names(route('valley-migration')).includes('South Pass'));
});

test('BA05: each codex account follows only its own layer', () => {
  const offLayer: [string, string, string, RegExp][] = [
    ['unmapped-places', 'ot', 'Haran', /Pearl of Great Price/],
    ['unmapped-places', 'ot', 'Ur of the Chaldees', /Pearl of Great Price/],
    ['unmapped-places', 'ot', 'Mount of Olives', /New Testament|Pearl of Great Price/],
    ['unmapped-places', 'dc', 'Enoch’s city (Zion)', /Pearl of Great Price|Moses/],
    ['unmapped-narratives', 'dc', 'First Vision account', /Pearl of Great Price|woods/],
    ['unmapped-places', 'dc', 'Woods near the Smith home', /./],
    ['unmapped-places', 'pgp', 'Shechem (Sichem)', /./],
    ['unmapped-places', 'pgp', 'Camp between Bethel and Hai', /./],
    ['unmapped-places', 'pgp', 'Egypt', /./],
  ];
  for (const [tab, layer, name, bad] of offLayer) {
    for (const x of shown(tab, layer, name)) assert.doesNotMatch(x.desc, bad, `${name} under ${layer}`);
  }
  // all layers on keeps every account
  const all = L.codexSplit(codex('unmapped-places'), null, null, false, 0).shown;
  assert.equal(all.filter((x: any) => x.name === 'Mount of Olives').length, 3);
  assert.equal(all.filter((x: any) => x.name === 'Enoch’s city (Zion)').length, 2);
  assert.equal(shown('unmapped-places', 'pgp', 'Haran').length, 1);
  assert.equal(shown('unmapped-narratives', 'pgp', 'First Vision account').length, 1);
});

test('BA05 control: Jerusalem keeps its separately layered notes', () => {
  const notes = sites.get('jerusalem').notes;
  const ot = L.visibleNotes(notes, new Set(['ot']), null, false, 0);
  assert.ok(ot.length > 0);
  for (const n of ot) assert.ok(L.layerOk(n, new Set(['ot'])));
  assert.ok(L.visibleNotes(notes, null, null, false, 0).length > ot.length);
});

test('BA06: the Fayette reference point agrees with its 1829 episodes under time filtering', () => {
  const r: [number, number] = [1829, 1829];
  assert.equal(sites.get('fayette').when, undefined);
  assert.equal(L.timeOk(sites.get('fayette'), r), true);
  assert.equal(L.timeOk(route('dictation-move'), r), true);
  const ev = P.events.find((e: any) => e.id === 'translation-fayette');
  assert.equal(L.timeOk(ev, r), true);
});

test('BA02/BA03: register coordinates and visible qualifications are applied', () => {
  const repl: Record<string, [number, number]> = {
    'antioch-sending': [36.2, 36.165],
    seleucia: [36.1222, 35.9347],
    salamis: [35.179951, 33.903053],
    paphos: [34.757, 32.407],
    iconium: [37.8728, 32.4921],
    attalia: [36.8853, 30.7086],
    troas: [39.752, 26.159],
    syracuse: [37.0639, 15.293],
    rhegium: [38.109, 15.644],
    puteoli: [40.8259, 14.1253],
    patmos: [37.326, 26.5352],
  };
  for (const [id, [lat, lon]] of Object.entries(repl)) {
    const s = sites.get(id);
    assert.equal(s.lat, lat, id);
    assert.equal(s.lon, lon, id);
    assert.match(s.modern, /representative/, id);
  }
  const cond =
    'fayette independence kirtland-temple nauvoo carthage-jail harmony palmyra salt-lake-temple garden-grove mount-pisgah chimney-rock fort-bridger rome';
  for (const id of cond.split(' ')) assert.match(sites.get(id).modern, /approximate/, id);
  assert.equal(sites.get('harmony').name, 'Harmony / Priesthood Restoration Site');
  assert.match(sites.get('mount-pisgah').modern, /Thayer/);
});

test('BA07: 62 specified source views resolve, one work layer each, no dates or pins', () => {
  const ids = [
    ...'PE02 PE03 PE06 PE08 PC01 PC02 PC03 PC04 PC05 PC06 PC07 PC08'.split(' '),
    ...Array.from({ length: 9 }, (_, i) => `FM0${i + 1}`),
    ...'RE14 RE20 RC05 RE18 RE19 RC06 RE15 RE16 RC03 RC01 RC02 RC04'.split(' '),
    ...Array.from({ length: 20 }, (_, i) => `BC${String(i + 1).padStart(2, '0')}`),
    ...'AE01 AE02 AE03 AE09 AE10 AE14 AC01 AC02 AC03'.split(' '),
  ];
  const all = P.codex.flatMap((t: any) => t.list);
  const byKey = new Map<string, any>(all.filter((x: any) => x.key).map((x: any) => [x.key, x]));
  assert.equal(ids.length, 62);
  for (const id of ids) {
    const x = byKey.get(id);
    assert.ok(x, id);
    assert.equal(x.layers.length, 1, id);
    assert.equal(x.when, undefined, id);
    assert.ok(x.src.length > 0 && x.src.every((s: any) => /^https:\/\//.test(s.u) && s.t), id);
  }
  const work: Record<number, string> = { 1: 'ot', 2: 'nt', 3: 'bom', 4: 'dc', 5: 'pgp' };
  for (const id of ids) {
    const x = byKey.get(id);
    const [b] = x.books;
    assert.equal(x.layers[0], work[b], id);
    const one = (layer: string, cum: boolean, book: number) =>
      L.codexSplit([x], new Set([layer]), null, cum, book, (y: any) => Math.min(...y.books)).shown.length;
    assert.equal(one(work[b], true, b), 1, `${id} at its group`);
    assert.equal(L.codexSplit([x], null, null, false, 0).shown.length, 1, `${id} all works`);
    for (const other of Object.values(work))
      if (other !== work[b]) assert.equal(one(other, false, 0), 0, `${id} via ${other}`);
    if (b > 1) assert.equal(one(work[b], true, b - 1), 0, `${id} before its group`);
  }
  // FM01–07 at 3/bom, FM08 at 4/dc, FM09 and the PGP views at 5/pgp
  for (let i = 1; i <= 7; i++) assert.deepEqual(plain(byKey.get(`FM0${i}`).books), [3]);
  assert.deepEqual(plain(byKey.get('FM08').books), [4]);
  assert.deepEqual(plain(byKey.get('FM09').books), [5]);
  // content assertions from the specs
  assert.doesNotMatch(byKey.get('PE06').desc, /flood (came|ended)|destroyed the earth/i);
  assert.match(byKey.get('PC04').desc, /no date/);
  assert.doesNotMatch(byKey.get('FM03').desc, /\b(only|sole|exclusive)\b/i);
  assert.match(byKey.get('FM03').desc, /among the ancestors/);
  assert.match(byKey.get('RC05').desc, /transition rather than instantly/);
  assert.equal(sites.has('palmyra'), true);
  assert.equal(earth.sites.filter((s: any) => /palmyra/i.test(s.id)).length, 1);
});
