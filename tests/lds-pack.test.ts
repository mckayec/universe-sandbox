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

test('R1-C1: Salamis credits its active ToposText point', () => {
  assert.equal(
    sites.get('salamis').desc,
    'Representative city-site point for Salamis/Konstantia on Cyprus from the ToposText gazetteer. No synagogue is located.',
  );
  assert.doesNotMatch(sites.get('salamis').desc, /Pleiades/);
});

test('R1 BA07: Palmyra has a neutral BoM facet; printing history stays with D&C', () => {
  const pal = sites.get('palmyra');
  assert.equal(L.layerOk(pal, new Set(['bom'])), true);
  assert.equal(L.layerOk(pal, new Set(['dc'])), true);
  assert.equal(L.layerOk(pal, new Set(['ot'])), false);
  assert.equal(Math.min(...pal.books), 3);
  assert.doesNotMatch(pal.desc, /March|Grandin|Restoration|Joseph Smith/);
  const ev = P.events.find((e: any) => e.id === 'book-mormon-publication');
  assert.equal(ev.book, 4);
  assert.deepEqual(plain(ev.layers), ['dc']);
});

test('BA07 round 2: 108 further source views (107 research IDs) resolve with their own gates', () => {
  const ids = [
    'BP01',
    'BP02',
    'BP03',
    'BP04',
    'BP05',
    'BP06',
    'BP07',
    'BP08',
    'BP09',
    'BP10',
    'BP11',
    'BP12',
    'BP13',
    'BP14',
    'BP15',
    'BP16',
    'BP17',
    'BP18',
    'BP19',
    'BP20',
    'BP21',
    'BP22',
    'BP23',
    'BP24',
    'BP25',
    'BP26',
    'BP27',
    'BP28',
    'BP29',
    'BP30',
    'AP01',
    'AP02',
    'AP03',
    'AP04',
    'AP05',
    'AP34',
    'AJ01',
    'BE01',
    'BE02',
    'BE03',
    'BE04',
    'BE05',
    'BE06',
    'BE07',
    'BE08',
    'BE09',
    'BE10',
    'BE11',
    'BE12',
    'BE13',
    'BE14',
    'BE15',
    'BE16',
    'BE17',
    'BE18',
    'BE19',
    'BE20',
    'BE21',
    'BE22',
    'BE23',
    'BJ01',
    'BJ02',
    'BJ03',
    'BJ04',
    'BJ05',
    'BJ06',
    'BJ07',
    'BJ08',
    'BJ09',
    'BJ10',
    'BJ11',
    'PP01',
    'PP02',
    'PP03',
    'PP04',
    'PP05',
    'PP06',
    'PP07',
    'PP08',
    'PP09',
    'PE01',
    'PE04',
    'PE05',
    'PE07',
    'PE09',
    'PJ01',
    'PJ02',
    'PC09',
    'PC10',
    'RE02',
    'RE05',
    'RE06',
    'RE07',
    'RE13',
    'J01',
    'J03',
    'AP09',
    'AP09.NT',
    'AP20',
    'AP23',
    'AP24',
    'AP26',
    'AP30',
    'AP31',
    'RP02',
    'RP04',
    'RP06',
    'RP08',
  ];
  assert.equal(ids.length, 108);
  const all = P.codex.flatMap((t: any) => t.list);
  const keys = all.filter((x: any) => x.key).map((x: any) => x.key);
  assert.equal(new Set(keys).size, keys.length, 'keys are unique');
  // 170 primary source views plus the supplementary tab(s), counted separately
  const supp = P.codex
    .filter((t: any) => ['bom-more', 'nt-more', 'ot-more'].includes(t.id))
    .flatMap((t: any) => t.list).length;
  assert.equal(keys.length - supp, 170);
  const byKey = new Map<string, any>(all.filter((x: any) => x.key).map((x: any) => [x.key, x]));
  const work: Record<number, string> = { 1: 'ot', 2: 'nt', 3: 'bom', 4: 'dc', 5: 'pgp' };
  for (const id of ids) {
    const x = byKey.get(id);
    assert.ok(x, id);
    assert.equal(x.books.length, 1, id);
    assert.equal(x.layers.length, 1, id);
    assert.equal(x.when, undefined, id);
    assert.equal(x.lat, undefined, id);
    const [b] = x.books;
    assert.equal(x.layers[0], work[b], id);
    assert.ok(x.src.length > 0 && x.src.every((s: any) => /^https:\/\//.test(s.u) && s.t), id);
    const one = (layer: string, cum: boolean, book: number) =>
      L.codexSplit([x], new Set([layer]), null, cum, book, (y: any) => Math.min(...y.books)).shown.length;
    assert.equal(one(work[b], true, b), 1, `${id} at its group`);
    for (const other of Object.values(work))
      if (other !== work[b]) assert.equal(one(other, false, 0), 0, `${id} via ${other}`);
    if (b > 1) assert.equal(one(work[b], true, b - 1), 0, `${id} before its group`);
  }
  // BP/BE/BJ are Book of Mormon only, in their own tab
  const bom = P.codex.find((t: any) => t.id === 'bom-geography').list;
  assert.equal(bom.length, 64);
  assert.ok(bom.every((x: any) => x.layers[0] === 'bom'));
  // AP09: one identity, two separately gated source views (never one OR-layer card)
  assert.deepEqual(plain(byKey.get('AP09').layers), ['ot']);
  assert.deepEqual(plain(byKey.get('AP09.NT').layers), ['nt']);
  assert.doesNotMatch(byKey.get('AP09').desc, /fishermen/);
  assert.equal(byKey.get('AP09.NT').desc, 'Matthew places the call of fishermen beside this sea.');
  // J03 does not claim arrival in Egypt; AJ01 labels its gap
  assert.match(byKey.get('J03').desc, /not a completed Egyptian arrival/);
  assert.match(byKey.get('AJ01').desc, /intervening itinerary is not supplied/);
  // Restoration episodes keep their attributed dates as text, not as timeline years
  const dated: Record<string, string> = {
    RE02: 'May 15, 1829, as reported',
    RE05: 'October 27, 1838',
    RE06: 'December 1, 1838 to April 6, 1839',
    RE07: 'March 20 and approximately March 22, 1839',
    RE13: 'July 24, 1847',
  };
  for (const [id, d] of Object.entries(dated)) {
    assert.equal(byKey.get(id).date, d, id);
    assert.match(L.itemMeta(null, null, byKey.get(id)), new RegExp(d.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')), id);
    assert.equal(L.timeOk(byKey.get(id), [1500, 1600]), true, `${id} has no year for the filter`);
  }
});

test('Supplementary SC01–SC07: every Book of Mormon SD row maps to one bom-layer card with sources', () => {
  const csv = readFileSync(
    new URL('../docs/universes/packs/lds-standard-works/supplementary-implementation.csv', import.meta.url),
    'utf8',
  );
  const sd = csv
    .trim()
    .split('\n')
    .filter(r => /^SD\d{4},/.test(r));
  assert.equal(sd.length, 1271);
  const bom = sd.filter(r => /^SD\d{4},SC0[1-7],/.test(r));
  assert.equal(bom.length, 111);
  const list = codex('bom-more');
  const keys = new Set(list.map((x: any) => x.key));
  assert.equal(keys.size, list.length);
  for (const r of bom) {
    const m = r.match(/,imported,codex:bom-more,([^,]+),/);
    assert.ok(m && keys.has(m[1]), r.slice(0, 40));
  }
  for (const x of list) {
    assert.deepEqual(plain(x.layers), ['bom']);
    assert.deepEqual(plain(x.books), [3]);
    assert.ok(x.src.length > 0 && x.src.every((s: any) => s.u.startsWith('https://')), x.key);
  }
  // hidden under every other single layer
  for (const layer of ['ot', 'nt', 'dc', 'pgp']) {
    assert.equal(L.codexSplit(list, new Set([layer]), null, false, 0).shown.length, 0, layer);
  }
});

test('Supplementary SC08–SC12: every New Testament SD row maps to one nt-layer card with sources', () => {
  const csv = readFileSync(
    new URL('../docs/universes/packs/lds-standard-works/supplementary-implementation.csv', import.meta.url),
    'utf8',
  );
  const nt = csv
    .trim()
    .split('\n')
    .filter(r => /^SD\d{4},SC(0[89]|1[0-2]),/.test(r));
  assert.equal(nt.length, 187);
  const list = codex('nt-more');
  // 187 parent cards + 24 child source views (SD0213 ×1, SD0226 ×3, SD0236 ×5, SD0270 ×15)
  assert.equal(list.length, 211);
  const keys = new Set(list.map((x: any) => x.key));
  assert.equal(keys.size, list.length);
  for (const r of nt) {
    const m = r.match(/,imported,codex:nt-more,([^,]+),/);
    assert.ok(m && keys.has(m[1]), r.slice(0, 40));
  }
  for (const x of list) {
    assert.deepEqual(plain(x.layers), ['nt']);
    assert.deepEqual(plain(x.books), [2]);
    assert.equal(x.lat, undefined, x.key);
    assert.equal(x.when, undefined, x.key);
    assert.ok(x.src.length > 0 && x.src.every((s: any) => s.u.startsWith('https://') && s.t), x.key);
  }
  for (const layer of ['ot', 'bom', 'dc', 'pgp']) {
    assert.equal(L.codexSplit(list, new Set([layer]), null, false, 0).shown.length, 0, layer);
  }
  // shown at the New Testament group, not before it
  assert.equal(L.codexSplit(list, new Set(['nt']), null, true, 2, (y: any) => Math.min(...y.books)).shown.length, 211);
  assert.equal(L.codexSplit(list, new Set(['nt']), null, true, 1, (y: any) => Math.min(...y.books)).shown.length, 0);
});

test('Supplementary SC13–SC17: every Old Testament history SD row maps to one ot-layer card with sources', () => {
  const csv = readFileSync(
    new URL('../docs/universes/packs/lds-standard-works/supplementary-implementation.csv', import.meta.url),
    'utf8',
  );
  const ot = csv
    .trim()
    .split('\n')
    .filter(r => /^SD\d{4},SC1[3-7],/.test(r));
  assert.equal(ot.length, 177);
  const list = codex('ot-more');
  // 177 parent cards + 1 child source view (SD0443 stage list)
  assert.equal(list.length, 178);
  const keys = new Set(list.map((x: any) => x.key));
  assert.equal(keys.size, list.length);
  for (const r of ot) {
    const m = r.match(/,imported,codex:ot-more,([^,]+),/);
    assert.ok(m && keys.has(m[1]), r.slice(0, 40));
  }
  for (const x of list) {
    assert.deepEqual(plain(x.layers), ['ot']);
    assert.deepEqual(plain(x.books), [1]);
    assert.equal(x.lat, undefined, x.key);
    assert.equal(x.when, undefined, x.key);
    assert.ok(x.src.length > 0, x.key);
    for (const s of x.src) {
      assert.ok(s.t && /^https:\/\/www\.churchofjesuschrist\.org\/study\/scriptures\//.test(s.u), x.key);
    }
  }
  for (const layer of ['nt', 'bom', 'dc', 'pgp']) {
    assert.equal(L.codexSplit(list, new Set([layer]), null, false, 0).shown.length, 0, layer);
  }
  assert.equal(L.codexSplit(list, new Set(['ot']), null, true, 1, (y: any) => Math.min(...y.books)).shown.length, 178);
});

test('Supplementary S3/S4 review fixes: child source views follow their parents and required details are present', () => {
  const csv = readFileSync(
    new URL('../docs/universes/packs/lds-standard-works/supplementary-implementation.csv', import.meta.url),
    'utf8',
  );
  const rows = csv.trim().split('\n');
  const kids = rows.filter(r => /^,SC\d\d,child of SD\d{4},/.test(r));
  assert.equal(kids.length, 25);
  const want: Record<string, number> = { SD0213: 1, SD0226: 3, SD0236: 5, SD0270: 15, SD0443: 1 };
  for (const [sd, n] of Object.entries(want)) {
    assert.equal(kids.filter(r => r.includes(`child of ${sd},`)).length, n, sd);
  }
  const nt = codex('nt-more');
  const ot = codex('ot-more');
  const by = (list: any[], key: string) => list.find((x: any) => x.key === key);
  // each child sits right after its parent (or its previous sibling)
  const ntKeys = nt.map((x: any) => x.key);
  const seq = ntKeys.indexOf('NTC-vision-sequence');
  for (let i = 1; i <= 15; i++) {
    assert.equal(ntKeys[seq + i], `NTC-vision-sequence-${String(i).padStart(2, '0')}`);
  }
  assert.equal(ntKeys[ntKeys.indexOf('NTE-temptations') + 1], 'NTE-temptations-luke');
  assert.equal(ntKeys[ntKeys.indexOf('NTE-jerusalem-community') + 3], 'NTE-jerusalem-community-6');
  const otKeys = ot.map((x: any) => x.key);
  assert.equal(otKeys[otKeys.indexOf('OHJ-12') + 1], 'OHJ-12-stages');
  // S3-C2–C4
  assert.ok(!/later returns to it/.test(by(nt, 'NTJ-luke-jerusalemward').desc));
  assert.ok(/supplies no Earth coordinate/.test(by(nt, 'NTC-sanctuary-covenant').desc));
  const voyage = by(nt, 'NTJ-voyage-to-melita');
  assert.ok(/three days at Syracuse/.test(voyage.desc) && /seven days with believers at Puteoli/.test(voyage.desc));
  assert.ok(voyage.src.some((s: any) => s.t === 'Acts 28:1, 12–14'));
  // S4-C1–C4
  assert.ok(!/The same Eden as the other accounts/.test(by(ot, 'OH-P01').desc));
  const beth = by(ot, 'OTS-P07-bethlehem');
  assert.ok(/does not specify its region/.test(beth.desc));
  assert.ok(['Joshua 19:15', 'Judges 12:8–10'].every(t => beth.src.some((s: any) => s.t === t)));
  const stages = by(ot, 'OHJ-12-stages').desc;
  for (const stop of ['Rameses', 'Dophkah', 'Ije-abarim', 'Abel-shittim']) assert.ok(stages.includes(stop), stop);
  assert.ok(stages.indexOf('Rameses') < stages.indexOf('Abel-shittim'));
  const refuge = by(ot, 'OHC-REFUGE').desc;
  for (const c of ['Kedesh', 'Shechem', 'Kirjath-arba', 'Bezer', 'Ramoth', 'Golan']) assert.ok(refuge.includes(c), c);
  assert.ok(/son of Raguel the Midianite/.test(by(ot, 'OHR-JETHRO').desc));
  const moses = by(ot, 'OHJ-11');
  assert.ok(/Exodus 18:2–6/.test(moses.desc) && moses.src.some((s: any) => s.t === 'Exodus 18:2–6'));
  const ahaz = by(ot, 'OHR-AHAZIAH').desc;
  assert.ok(!/ages at accession/.test(ahaz) && /without stating his age/.test(ahaz));
});
