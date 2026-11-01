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
    .filter((t: any) => ['bom-more', 'nt-more', 'ot-more', 'dc-more'].includes(t.id))
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
  // 187 parent cards + 55 child source views (SD0213 ×1, SD0214 ×12, SD0226 ×3, SD0236 ×5, SD0238 ×2, SD0240 ×17,
  // SD0270 ×15)
  assert.equal(list.length, 242);
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
  assert.equal(L.codexSplit(list, new Set(['nt']), null, true, 2, (y: any) => Math.min(...y.books)).shown.length, 242);
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
  let list = codex('ot-more');
  // 177 parent cards + 1 child source view (SD0443 stage list) + 83 SC18–SC23 cards (93 rows, 10 consolidated)
  // + 59 SC25–SC28 major-prophet cards + 73 SC24 major-prophet place cards + 6 SD0663 chapter views (S7-C1)
  // + 5 SC29 cards (SD0705 consolidated) + 2 SC29 later-work children + 20 SC30 + 5 SC33 cards
  // + 59 SC31/SC32/SC34 cards + Heshbon identity and Psalm 85 heading children (checkpoint 10)
  // + 6 SD0785 JST comparison views (S10-C3)
  assert.equal(list.length, 498);
  const keys = new Set(list.map((x: any) => x.key));
  // the cards gated at a later work (SD0706, the SD0701/SD0702 children; the SD0753 child) are checked in their own tests
  const later = new Set([
    'OTM-a06-ezekiel-37-heading',
    'OTM-a01-jesse-dc113',
    'OTM-a02-ariel-jst-introduction',
    'OTW-c06-psalm-85-heading',
  ]);
  const all = list;
  list = all.filter((x: any) => !later.has(x.key));
  assert.equal(keys.size, all.length);
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
      // S10-C2: the one exception is SD0790's source, the accepted research decision at a pinned commit
      const decision =
        x.key === 'OTW-a28-lexical-notes' && /^https:\/\/github\.com\/mckayec\/universe-sandbox\/blob\//.test(s.u);
      assert.ok(s.t && (decision || /^https:\/\/www\.churchofjesuschrist\.org\/study\/scriptures\//.test(s.u)), x.key);
    }
  }
  for (const layer of ['nt', 'bom', 'dc', 'pgp']) {
    assert.equal(L.codexSplit(list, new Set([layer]), null, false, 0).shown.length, 0, layer);
  }
  assert.equal(L.codexSplit(list, new Set(['ot']), null, true, 1, (y: any) => Math.min(...y.books)).shown.length, 494);
  assert.equal(L.codexSplit(all, new Set(['ot']), null, true, 1, (y: any) => Math.min(...y.books)).shown.length, 494);
});

test('Supplementary SC18–SC23: Chronicles–Esther rows map to ot-more cards; consolidated rows point at a real card', () => {
  const csv = readFileSync(
    new URL('../docs/universes/packs/lds-standard-works/supplementary-implementation.csv', import.meta.url),
    'utf8',
  );
  const rows = csv
    .trim()
    .split('\n')
    .filter(r => /^SD\d{4},SC(1[89]|2[0-3]),/.test(r));
  assert.equal(rows.length, 93);
  const ot = codex('ot-more');
  const keys = new Set(ot.map((x: any) => x.key));
  const merged = rows.filter(r => r.includes(',consolidated into SD'));
  assert.equal(merged.length, 10);
  const own = new Set<string>();
  for (const r of rows) {
    const m = r.match(/,imported,codex:ot-more,(OTL-[^,]+),/);
    assert.ok(m && keys.has(m[1]), r.slice(0, 40));
    if (!r.includes(',consolidated into SD')) own.add(m![1]);
  }
  assert.equal(own.size, 83);
  const by = (key: string) => ot.find((x: any) => x.key === key);
  // apparatus applied to the cards they explain, with both witnesses cited
  assert.ok(by('OTL-ornan-floor').src.some((s: any) => s.t === 'JST 1 Chronicles 21:15'));
  assert.ok(by('OTL-ramoth-gilead').src.some((s: any) => s.t === 'JST 2 Chronicles 18:22'));
  assert.ok(/Susa/.test(by('OTL-shushan-narrative').desc));
  assert.ok(by('OTL-eloth').src.some((s: any) => /\/bd\/elath/.test(s.u)));
  // ledger-id rows resolve to chapters (and verses where the row gives them)
  assert.ok(by('OTL-judah-fortress-network').src.some((s: any) => s.t === '2 Chronicles 11:5–12'));
  // SD0226 context requirement (supplementary-review-s5)
  const acts6 = codex('nt-more').find((x: any) => x.key === 'NTE-jerusalem-community-6').desc;
  assert.ok(/Nicolas as a proselyte of Antioch/.test(acts6) && /not a narrated journey by Stephen/.test(acts6));
});

test('Supplementary SC25–SC28 and S6-C1: major-prophet rows map to OTM cards; SC22 prose consolidated', () => {
  const csv = readFileSync(
    new URL('../docs/universes/packs/lds-standard-works/supplementary-implementation.csv', import.meta.url),
    'utf8',
  );
  const lines = csv.trim().split('\n');
  const rows = lines.filter(r => /^SD\d{4},SC2[5-8],/.test(r));
  assert.equal(rows.length, 59);
  const ot = codex('ot-more');
  const by = (key: string) => ot.find((x: any) => x.key === key);
  const own = new Set<string>();
  for (const r of rows) {
    const m = r.match(/,imported,codex:ot-more,(OTM-[^,]+),/);
    assert.ok(m && by(m[1]), r.slice(0, 40));
    own.add(m![1]);
  }
  assert.equal(own.size, 59);
  for (const k of own) {
    const x = by(k);
    assert.deepEqual(plain(x.layers), ['ot']);
    assert.ok(
      x.src.every((s: any) => /\/scriptures\/ot\/(isa|jer|lam|ezek)\//.test(s.u)),
      k,
    );
  }
  // verse-level locators from the rows' own links; the unlinked comparison passage is cited
  assert.ok(by('OTM-j02-moab-refugees').src.some((s: any) => s.t === 'Isaiah 16:1–4'));
  assert.ok(by('OTM-j26-fall-messenger').src.some((s: any) => s.t === 'Ezekiel 24:25–27'));
  // SD0706 gate: the Bible/Book of Mormon reading of Ezekiel 37 is not on the 1/ot card
  assert.ok(!/Book of Mormon/.test(by('OTM-c10-restoration-bones-sticks').desc));
  // S6-C1: SC22 prose view consolidated into the Megiddo card, no extra card
  const prose = lines.filter(r => r.includes(',lh-j17-josiah-return,'));
  assert.equal(prose.length, 1);
  assert.ok(/^,SC22,.*,OTL-megiddo,.*consolidated into SD0550 card \(prose-only/.test(prose[0]));
  const meg = by('OTL-megiddo');
  assert.ok(/second chariot/.test(meg.desc) && /death and burial/.test(meg.desc));
  assert.deepEqual(plain(meg.src.map((s: any) => s.t)), ['2 Chronicles 35:22–25']);
  assert.equal(ot.filter((x: any) => x.key === 'OTL-megiddo').length, 1);
});

test('Supplementary SC24 and S7-C1/C2: major-prophet places, temple chapter views, OT-only Zedekiah card', () => {
  const csv = readFileSync(
    new URL('../docs/universes/packs/lds-standard-works/supplementary-implementation.csv', import.meta.url),
    'utf8',
  );
  const lines = csv.trim().split('\n');
  const rows = lines.filter(r => /^SD\d{4},SC24,/.test(r));
  assert.equal(rows.length, 73);
  const ot = codex('ot-more');
  const by = (key: string) => ot.find((x: any) => x.key === key);
  const own = new Set<string>();
  for (const r of rows) {
    const m = r.match(/,imported,codex:ot-more,(OTM-[^,]+),/);
    assert.ok(m && by(m[1]), r.slice(0, 40));
    assert.ok(!r.includes(',consolidated into SD'), r.slice(0, 40));
    own.add(m![1]);
  }
  assert.equal(own.size, 73);
  for (const k of own) {
    const x = by(k);
    assert.deepEqual(plain(x.layers), ['ot']);
    assert.deepEqual(plain(x.books), [1]);
    assert.equal(x.lat, undefined, k);
    assert.ok(x.src.length > 0 && x.src.every((s: any) => /\/scriptures\/ot\/(isa|jer|lam|ezek)\//.test(s.u)), k);
  }
  // homonyms stay distinct from the same-named places elsewhere
  assert.ok(/not the town of the same name in Judah/.test(by('OTM-beth-shemesh-egypt').desc));
  assert.ok(/not the modern city of Tel Aviv/.test(by('OTM-tel-abib-exile').desc));
  // S7-C1: the parent no longer claims retained detail; six chapter views follow it in order
  const tour = by('OTM-j22-temple-tour');
  assert.ok(/The cited chapters describe distinct measured spaces and gate functions/.test(tour.desc));
  const keys = ot.map((x: any) => x.key);
  const at = keys.indexOf('OTM-j22-temple-tour');
  assert.deepEqual(
    plain(keys.slice(at + 1, at + 7)),
    ['40', '41', '42', '43', '44', '46'].map(n => `OTM-j22-temple-tour-${n}`),
  );
  assert.ok(/five hundred reeds/.test(by('OTM-j22-temple-tour-42').desc));
  assert.ok(/not converted to cubits/.test(by('OTM-j22-temple-tour-42').desc));
  assert.ok(/inner east gate/.test(by('OTM-j22-temple-tour-46').desc));
  assert.deepEqual(plain(by('OTM-j22-temple-tour-44').src.map((s: any) => s.t)), ['Ezekiel 44:1–5']);
  // S8-C2: the gate verse and the chapter 44 comparison are in the locators
  assert.equal(by('OTM-j22-temple-tour-46').name, 'Ezekiel 46:1, 19–24: inner gate and cooking places');
  assert.deepEqual(plain(by('OTM-j22-temple-tour-46').src.map((s: any) => s.t)), [
    'Ezekiel 46:1, 19–24',
    'Ezekiel 44:1–3',
  ]);
  // S8-C1: Samaria's city sense and the regional cultivation setting are kept apart
  assert.ok(/mountains of Samaria/.test(by('OTM-samaria').desc));
  assert.ok(/do not locate a vineyard within the city/.test(by('OTM-samaria').desc));
  // S7-C2: no later-work name on the OT-only Zedekiah card
  const z = by('OTM-r15-zedekiah-house');
  assert.ok(!/Mulek/.test(z.desc));
  assert.ok(/without harmonizing it with other accounts/.test(z.desc));
  assert.ok(!ot.some((x: any) => /Mulek/.test(x.desc)));
});

test('Supplementary SC29, SC30, SC33: apparatus rows, poetic place views and JST selections', () => {
  const csv = readFileSync(
    new URL('../docs/universes/packs/lds-standard-works/supplementary-implementation.csv', import.meta.url),
    'utf8',
  );
  const lines = csv.trim().split('\n');
  const rows = lines.filter(r => /^SD\d{4},SC(29|30|33),/.test(r));
  assert.equal(rows.length, 31);
  const ot = codex('ot-more');
  const by = (key: string) => ot.find((x: any) => x.key === key);
  for (const r of rows) {
    const m = r.match(/,imported,codex:ot-more,(OT[MW]-[^,]+),/);
    assert.ok(m && by(m[1]), r.slice(0, 40));
  }
  // SD0705 consolidates into the Ezekiel 42 child view, which keeps the reeds and cites the row's verses
  const reeds = lines.find(r => r.startsWith('SD0705,'))!;
  assert.ok(reeds.includes(',OTM-j22-temple-tour-42,') && reeds.includes('consolidated into OTM-j22-temple-tour-42'));
  const c42 = by('OTM-j22-temple-tour-42');
  assert.ok(/do not substitute cubits/.test(c42.desc));
  assert.ok(c42.src.some((s: any) => s.t === 'Ezekiel 42:15–20 and notes'));
  // later-work readings are gated at their own work and dropped from the 1/ot parent
  const jesse = by('OTM-a01-jesse');
  assert.deepEqual(plain(jesse.books), [1]);
  assert.ok(!jesse.src.some((s: any) => /dc-testament/.test(s.u)) && !/D&C|Doctrine and Covenants/.test(jesse.desc));
  const dc = by('OTM-a01-jesse-dc113');
  assert.deepEqual([plain(dc.books), plain(dc.layers)], [[4], ['dc']]);
  assert.ok(dc.src.every((s: any) => /dc-testament\/dc\/113/.test(s.u)));
  const keys = ot.map((x: any) => x.key);
  assert.equal(keys.indexOf('OTM-a01-jesse-dc113'), keys.indexOf('OTM-a01-jesse') + 1);
  for (const k of ['OTM-a02-ariel-jst-introduction', 'OTM-a06-ezekiel-37-heading']) {
    assert.deepEqual([plain(by(k).books), plain(by(k).layers)], [[3], ['bom']], k);
  }
  for (const k of ['OTM-a01-jesse', 'OTM-a02-ariel', 'OTM-a03-servant', 'OTM-a04-conditional-calamity']) {
    assert.ok(!/Book of Mormon/.test(by(k).desc), k);
  }
  const later = ['OTM-a01-jesse-dc113', 'OTM-a02-ariel-jst-introduction', 'OTM-a06-ezekiel-37-heading'];
  const otOnly = L.codexSplit(ot, new Set(['ot']), null, true, 1, (y: any) => Math.min(...y.books)).shown;
  assert.ok(!otOnly.some((x: any) => later.includes(x.key)));
  // SC30/SC33: OT layer only, sources in the wisdom books and the Twelve (or their JST selections), no geometry
  const wp = ot.filter((x: any) => /^OTW-(p|c1[1-5]|ap07)/.test(x.key) && x.key !== 'OTW-heshbon');
  assert.equal(wp.length, 25);
  for (const x of wp) {
    assert.deepEqual([plain(x.books), plain(x.layers)], [[1], ['ot']], x.key);
    assert.equal(x.lat, undefined, x.key);
    assert.equal(x.when, undefined, x.key);
    assert.ok(x.src.length > 0, x.key);
    assert.ok(
      x.src.every((s: any) =>
        /\/scriptures\/(ot\/(job|ps|song|dan|amos|jonah|micah|nahum|zech)|jst\/jst-(ps|amos))\//.test(s.u),
      ),
      x.key,
    );
  }
  assert.ok(/does not report him reaching it/.test(by('OTW-p04-tarshish-intended').desc));
  assert.ok(/identifies it with the Tigris/.test(by('OTW-p08-hiddekel').desc));
  assert.deepEqual(plain(by('OTW-p07-ulai').src.map((s: any) => s.t)), ['Daniel 8:2, 16']);
  assert.ok(/not the base text/.test(by('OTW-c11-jst-psalm-11').desc));
});

test('Supplementary SC31, SC32, SC34 and S9-C1: wisdom and Twelve events, reading limits and chapter notes', () => {
  const csv = readFileSync(
    new URL('../docs/universes/packs/lds-standard-works/supplementary-implementation.csv', import.meta.url),
    'utf8',
  );
  const lines = csv.trim().split('\n');
  const rows = lines.filter(r => /^SD\d{4},SC(31|32|34),/.test(r));
  assert.equal(rows.length, 59);
  const ot = codex('ot-more');
  const by = (key: string) => ot.find((x: any) => x.key === key);
  const keys = ot.map((x: any) => x.key);
  for (const r of rows) {
    const m = r.match(/,imported,codex:ot-more,(OTW-[^,]+),/);
    assert.ok(m && by(m[1]), r.slice(0, 40));
    const x = by(m![1]);
    if (m![1] === 'OTW-c06-psalm-85') continue;
    assert.deepEqual([plain(x.books), plain(x.layers)], [[1], ['ot']], x.key);
    assert.equal(x.lat, undefined, x.key);
    assert.equal(x.when, undefined, x.key);
    // S10-C2: SD0790 is a methodological exclusion whose source is the accepted research decision
    const audit = /^https:\/\/github\.com\/mckayec\/universe-sandbox\/blob\/9cc874c[0-9a-f]+\/docs\/universes\//;
    const okSrc = (s: any) => /\/scriptures\/ot\//.test(s.u) || (x.key === 'OTW-a28-lexical-notes' && audit.test(s.u));
    assert.ok(x.src.length > 0 && x.src.every(okSrc), x.key);
    assert.ok(!/Book of Mormon|D&C|Doctrine and Covenants/.test(x.desc), x.key);
  }
  // S9-C1: the KJV side of Psalm 24 is supplied beside the JST selection
  const ps24 = by('OTW-c13-jst-psalm-24');
  assert.ok(/everlasting doors are called to lift up/.test(ps24.desc) && !/Shown alongside/.test(ps24.desc));
  assert.deepEqual(plain(ps24.src.map((s: any) => s.t)), ['JST Psalm 24:7–10', 'Psalm 24:7–10 (KJV)']);
  assert.ok(ps24.src.some((s: any) => /\/ot\/ps\/24\?/.test(s.u)) && ps24.src.some((s: any) => /jst-ps\/24/.test(s.u)));
  assert.deepEqual(plain(by('OTW-p04-tarshish-intended').src.map((s: any) => s.t)), [
    'Jonah 1:3',
    'Psalm 48:7',
    'Psalm 72:10',
  ]);
  // S9 reading 4: Song 7:4 attaches to a nonspatial Heshbon identity card that follows it
  const hes = by('OTW-heshbon');
  assert.equal(keys.indexOf('OTW-heshbon'), keys.indexOf('OTW-p15-bathrabbim') + 1);
  assert.ok(/the card “Heshbon”/.test(by('OTW-p15-bathrabbim').desc));
  assert.equal(hes.lat, undefined);
  assert.deepEqual(plain(hes.src.map((s: any) => s.t)), ['Numbers 21', 'Joshua 12', 'Song of Solomon 7:4']);
  // Psalm 85: the verse at 1/ot; the heading's Book of Mormon reading is a child gated at the Book of Mormon
  const p85 = by('OTW-c06-psalm-85');
  assert.deepEqual([plain(p85.books), plain(p85.layers)], [[1], ['ot']]);
  assert.ok(!/Book of Mormon/.test(p85.desc));
  const h85 = by('OTW-c06-psalm-85-heading');
  assert.deepEqual([plain(h85.books), plain(h85.layers)], [[3], ['bom']]);
  assert.equal(keys.indexOf('OTW-c06-psalm-85-heading'), keys.indexOf('OTW-c06-psalm-85') + 1);
  const otOnly = L.codexSplit(ot, new Set(['ot']), null, true, 1, (y: any) => Math.min(...y.books)).shown;
  assert.ok(!otOnly.some((x: any) => x.key === 'OTW-c06-psalm-85-heading'));
  // row-specific distinctions
  assert.ok(/not the king Belshazzar/.test(by('OTW-r01-daniel-companions').desc));
  assert.ok(/not Joshua the son of Nun/.test(by('OTW-r02-zechariah-joshua').desc));
  assert.ok(/Tarshish is not reached/.test(by('OTW-j01-jonah-voyage').desc));
  assert.equal(
    by('OTW-a09-daniel-4-notes').desc.split(' — ')[1].split('. ')[0] + '.',
    'Daniel’s text uses seven times; the Church edition’s notes explain the expression with years/seasons and a seven-years gloss.',
  );
  assert.ok(/not equated with Kirjath-jearim/.test(by('OTW-a25-psalms-83-132-notes').desc));
});

test('Supplementary S3/S4 review fixes: child source views follow their parents and required details are present', () => {
  const csv = readFileSync(
    new URL('../docs/universes/packs/lds-standard-works/supplementary-implementation.csv', import.meta.url),
    'utf8',
  );
  const rows = csv.trim().split('\n');
  const kids = rows.filter(r => /^,SC\d\d,child of SD\d{4},/.test(r));
  assert.equal(kids.length, 74); // 72 + the S15-C1 Alvin JS—History view + the SD1045 Sarai view
  const want: Record<string, number> = {
    SD0213: 1,
    SD0214: 12,
    SD0226: 3,
    SD0236: 5,
    SD0238: 2,
    SD0240: 17,
    SD0270: 15,
    SD0443: 1,
    SD0663: 6,
    SD0701: 1,
    SD0702: 1,
    SD0721: 1,
    SD0753: 1,
    SD0785: 6,
  };
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

test('Supplementary S10 and S3-C1 (SD0214, SD0240): Dura, chapter sources, JST comparisons, pericope views', () => {
  const ot = codex('ot-more');
  const nt = codex('nt-more');
  const by = (list: any[], key: string) => list.find((x: any) => x.key === key);
  // S10-C1: Dura is the image's site; the furnace is not separately located
  const fur = by(ot, 'OTW-e04-furnace').desc;
  assert.ok(
    /The image is set on the plain of Dura in the province of Babylon; the furnace is not separately located\./.test(
      fur,
    ),
  );
  assert.ok(!/furnace, set on the plain/.test(fur));
  // S10-C2: no book contents pages remain as sources
  for (const k of ['OTW-r04-psalm-collections', 'OTW-a21-song-notes', 'OTW-a27-animal-instrument-notes']) {
    const x = by(ot, k);
    assert.ok(
      x.src.every((s: any) => /\/scriptures\/ot\/[a-z]+\/\d+\?/.test(s.u)),
      k,
    );
  }
  const ps = by(ot, 'OTW-r04-psalm-collections').src.map((s: any) => s.u.match(/ps\/(\d+)/)[1]);
  assert.deepEqual(plain(ps), ['3', '50', '42', '72', '90', '88', '89', '39']);
  const song = by(ot, 'OTW-a21-song-notes').src.map((s: any) => s.u.match(/song\/(\d+)/)[1]);
  assert.deepEqual(plain(song), ['1', '2', '4', '8']);
  const ani = by(ot, 'OTW-a27-animal-instrument-notes');
  assert.ok(ani.src.some((s: any) => /\/ot\/mal\/1\?/.test(s.u)) && /Malachi 1/.test(ani.desc));
  const lex = by(ot, 'OTW-a28-lexical-notes');
  assert.equal(lex.src.length, 1);
  assert.ok(/bounded-inline-apparatus-audit$/.test(lex.src[0].u));
  assert.ok(/does not display them one by one/.test(lex.desc));
  // S10-C3: six JST comparisons follow their parent in verse order, each with its own verse source
  const keys = ot.map((x: any) => x.key);
  const at = keys.indexOf('OTW-a23-psalms-jst-notes');
  const verses = ['30:5', '30:9', '32:1', '50:21', '138:8', '141:5'];
  verses.forEach((v, i) => {
    const x = ot[at + 1 + i];
    assert.equal(x.key, `OTW-a23-jst-psalm-${v.replace(':', '-')}`);
    assert.deepEqual(plain(x.src.map((s: any) => s.t)), [`Psalm ${v} (inline JST note)`]);
    assert.ok(/KJV/.test(x.desc) && /inline JST/.test(x.desc), x.key);
    assert.deepEqual([plain(x.books), plain(x.layers)], [[1], ['ot']]);
  });
  assert.ok(/no sins to be covered/.test(ot[at + 3].desc));
  assert.ok(/not read as approval of physical harm/.test(ot[at + 6].desc));
  // S3-C1: SD0214 and SD0240 pericope views follow their parents in source order, 2/nt, nonspatial
  const nk = nt.map((x: any) => x.key);
  const calls = [
    'matt-9',
    'matt-12',
    'mark-1',
    'mark-2',
    'mark-3',
    'mark-4',
    'mark-5',
    'luke-4',
    'luke-5',
    'luke-6',
    'luke-7',
    'luke-8',
  ];
  const pars = [
    'matt-18',
    'matt-20',
    'matt-21',
    'matt-22',
    'matt-25',
    'mark-4',
    'mark-12',
    'luke-8',
    'luke-10',
    'luke-12',
    'luke-13',
    'luke-14',
    'luke-15',
    'luke-16',
    'luke-18',
    'luke-19',
    'luke-20',
  ];
  for (const [parent, list] of [
    ['NTE-calls-and-healings', calls],
    ['NTC-parables', pars],
  ] as const) {
    const i0 = nk.indexOf(parent);
    list.forEach((slug, i) => {
      const x = nt[i0 + 1 + i];
      assert.equal(x.key, `${parent}-${slug}`);
      assert.deepEqual([plain(x.books), plain(x.layers)], [[2], ['nt']]);
      assert.equal(x.lat, undefined, x.key);
      assert.equal(x.src.length, x.key === 'NTE-calls-and-healings-mark-2' ? 2 : 1, x.key);
      assert.ok(new RegExp(`/nt/${slug.replace('-', '/')}\\?`).test(x.src[0].u), x.key);
    });
  }
  assert.ok(!/Each Gospel’s order of these episodes is kept/.test(by(nt, 'NTE-calls-and-healings').desc));
  assert.ok(/not assumed to be the Lazarus of John 11/.test(by(nt, 'NTC-parables-luke-16').desc));
  assert.ok(/no route is drawn/.test(by(nt, 'NTC-parables-luke-10').desc));
});

test('Supplementary S11 fixes: parable contexts, Psalm note labels and the two separate genealogies', () => {
  const nt = codex('nt-more');
  const by = (list: any[], key: string) => list.find((x: any) => x.key === key);
  assert.ok(/Additional attributed parable views follow in each Gospel’s order/.test(by(nt, 'NTC-parables').desc));
  assert.ok(!/Matthew 18–25/.test(by(nt, 'NTC-parables').desc));
  const loc: Record<string, string> = {
    'matt-21': 'Matthew 21:28–32, 33–46',
    'mark-12': 'Mark 12:1–12',
    'luke-8': 'Luke 8:4–15',
    'luke-20': 'Luke 20:9–19',
  };
  for (const [slug, t] of Object.entries(loc)) {
    assert.deepEqual(plain(by(nt, `NTC-parables-${slug}`).src.map((s: any) => s.t)), [t]);
  }
  // the tenant stories keep each Gospel's order: Mark kills then casts out; Luke casts out then kills
  assert.ok(/before the son is cast out/.test(by(nt, 'NTC-parables-mark-12').desc));
  assert.ok(/cast out his beloved son and kill him/.test(by(nt, 'NTC-parables-luke-20').desc));
  assert.deepEqual(plain(by(nt, 'NTE-calls-and-healings-mark-2').src.map((s: any) => s.t)), ['Mark 2', '1 Samuel 21']);
  const ot = codex('ot-more');
  const notes = by(ot, 'OTW-a27-animal-instrument-notes').src.map((s: any) => s.t);
  assert.ok(notes.includes('Psalm 29 (study note: bison or buffalo)'));
  assert.ok(notes.includes('Psalm 92 (study note: buffalo or bison)'));
  assert.ok(notes.includes('Psalm 22 (study note: wild ox)'));
  // SD0238: two separate ordered lists after their parent, gated to the New Testament
  const nk = nt.map((x: any) => x.key);
  const i0 = nk.indexOf('NTC-genealogies');
  assert.deepEqual(plain(nk.slice(i0 + 1, i0 + 3)), ['NTC-genealogies-matt-1', 'NTC-genealogies-luke-3']);
  const csvNames = (f: string) =>
    readFileSync(
      new URL(`../docs/universes/packs/lds-standard-works/supplementary-build/genealogy/${f}`, import.meta.url),
      'utf8',
    )
      .trim()
      .split('\n')
      .slice(1)
      .flatMap(r => r.split(',').slice(1).join(',').split(';'))
      .map(n => n.trim());
  const matt = by(nt, 'NTC-genealogies-matt-1');
  const luke = by(nt, 'NTC-genealogies-luke-3');
  for (const x of [matt, luke]) {
    assert.deepEqual([plain(x.books), plain(x.layers)], [[2], ['nt']]);
    assert.equal(x.lat, undefined, x.key);
    assert.equal(x.when, undefined, x.key);
    assert.equal(L.codexSplit([x], new Set(['ot']), null, false, 0).shown.length, 0, x.key);
    assert.equal(L.codexSplit([x], new Set(['nt']), null, true, 1, (y: any) => Math.min(...y.books)).shown.length, 0);
    assert.equal(L.codexSplit([x], new Set(['nt']), null, true, 2, (y: any) => Math.min(...y.books)).shown.length, 1);
  }
  // every occurrence survives in source order (no name deduplication within or across the accounts)
  const chain = (desc: string, a: string, b: string) =>
    desc
      .slice(desc.indexOf(a) + a.length, desc.indexOf(b))
      .split(' → ')
      .map(s => s.trim());
  const m = chain(matt.desc, 'no generation is omitted: ', '. Verse 16');
  const mn = csvNames('matt-genealogy-names.csv');
  assert.equal(m.length, 40);
  m.forEach((s, i) => assert.ok(s === mn[i] || s.startsWith(mn[i] + ' '), `${i} ${s}`));
  assert.ok(m.includes('Judas (his brethren are also named)'));
  assert.ok(m.includes('Phares (Zara is also named; both are of Thamar)'));
  // S12-C1: the chain continues Phares → Esrom; Zara and the brethren are notes, not links
  assert.equal(m[m.findIndex(s => s.startsWith('Phares')) + 1], 'Esrom');
  assert.ok(m.every(s => !/^(Zara|his brethren)/.test(s)));
  assert.ok(/parentheses give side branches or qualifications, not additional chain links/.test(matt.desc));
  assert.ok(m.includes('Booz (of Rachab)') && m.includes('Obed (of Ruth)') && m.includes('David (the king)'));
  assert.ok(m.some(s => /^Jechonias \(his brethren are also named, .*Babylon\)$/.test(s)));
  // Matthew's ending predicate differs from the chain; no Joseph-begat-Jesus edge, no Mary line
  assert.ok(/the text does not say that Joseph begat Jesus/.test(matt.desc));
  assert.ok(/the husband of Mary, of whom was born Jesus/.test(matt.desc));
  assert.ok(/three|fourteen/.test(matt.desc));
  const l = chain(luke.desc, 'the one after it: ', ', “which was the son of God.”');
  const ln = csvNames('luke-genealogy-names.csv');
  assert.deepEqual(ln.length, 77);
  assert.deepEqual(l, ln.slice(2, -1));
  assert.ok(/\(as was supposed\) the son of Joseph/.test(luke.desc));
  assert.equal(l.filter(n => n === 'Joseph').length, 3); // plus the supposed father in verse 23
  assert.ok(/not harmonized with Matthew/.test(luke.desc));
});

test('Supplementary SC35–SC39: D&C place, event, teaching and relationship rows map to dc-layer cards', () => {
  const csv = readFileSync(
    new URL('../docs/universes/packs/lds-standard-works/supplementary-implementation.csv', import.meta.url),
    'utf8',
  );
  const rows = csv
    .trim()
    .split('\n')
    .filter(r => /^SD\d{4},SC3[5-9],/.test(r));
  assert.equal(rows.length, 69);
  // later checkpoints' cards (SC40 people, SC41 relations, SC42 ancient participants, SC43 events) are excluded
  const later = new Set(
    csv
      .split('\n')
      .filter(r => /^SD\d{4},SC4[23],/.test(r))
      .map(r => (r.match(/,imported,codex:dc-more,(DCM-[^,]+),/) || [])[1]),
  );
  const dc = codex('dc-more').filter((x: any) => !/^DCM-(dcp-|dre\d|jsh-|dca-|dd\d)/.test(x.key) && !later.has(x.key));
  assert.equal(dc.length, 69);
  const keys = new Set(dc.map((x: any) => x.key));
  assert.equal(keys.size, dc.length);
  for (const r of rows) {
    const m = r.match(/,imported,codex:dc-more,(DCM-[^,]+),/);
    assert.ok(m && keys.has(m[1]), r.slice(0, 40));
  }
  for (const x of dc) {
    assert.deepEqual([plain(x.books), plain(x.layers)], [[4], ['dc']], x.key);
    assert.equal(x.lat, undefined, x.key);
    assert.equal(x.when, undefined, x.key);
    assert.ok(x.desc.startsWith('Doctrine and Covenants — '), x.key);
    assert.ok(x.src.length > 0 && x.src.every((s: any) => s.u.startsWith('https://') && s.t), x.key);
    assert.equal(new Set(x.src.map((s: any) => s.u)).size, x.src.length, `${x.key} repeats a source`);
  }
  for (const layer of ['ot', 'nt', 'bom', 'pgp']) {
    assert.equal(L.codexSplit(dc, new Set([layer]), null, false, 0).shown.length, 0, layer);
  }
  // shown at the D&C group, not before it
  assert.equal(L.codexSplit(dc, new Set(['dc']), null, true, 4, (y: any) => Math.min(...y.books)).shown.length, 69);
  assert.equal(L.codexSplit(dc, new Set(['dc']), null, true, 3, (y: any) => Math.min(...y.books)).shown.length, 0);
  const by = (k: string) => dc.find((x: any) => x.key === k);
  // place views: Perrysburg is New York, not Ohio; Zarahemla, Iowa is not a verified Book of Mormon site
  assert.match(by('DCM-dp08-perrysburg').desc, /Perrysburg, New York, not Perrysburg, Ohio/);
  assert.match(by('DCM-dp10-zarahemla-iowa').desc, /not a verified Book of Mormon site/);
  // DE06: two dated components, not one occurrence
  assert.match(by('DCM-de06-kirtland-dedication-vision').desc, /March 27, 1836.*April 3, 1836.*Two events/);
  // DX02: Enoch's two ages kept side by side
  assert.match(by('DCM-dx02-priesthood-genealogies').desc, /430 years.*365 years.*not silently harmonized/);
  // DX04: verses 61 and 65 both kept; Jacob 2 and OD1 cross-linked
  const dx04 = by('DCM-dx04-section-132-consent');
  assert.match(dx04.desc, /Verses 61 and 65 are both kept/);
  assert.ok(
    dx04.src.some((s: any) => s.u.includes('/bofm/jacob/2')) && dx04.src.some((s: any) => s.u.includes('/od/1')),
  );
  // DR23: ordination links are not father-child links
  assert.match(by('DCM-dr23-ordinations-107').desc, /not father-child links/);
  // section ranges expand to one link per section (DX09: 32 sections)
  assert.equal(by('DCM-dx09-gathering').src.length, 32);
});

test('Supplementary checkpoint 15: S14-C1–C3 copy and SC40 person cards in dc-more', () => {
  const dc = codex('dc-more');
  const by = (k: string) => dc.find((x: any) => x.key === k);
  // S14-C1: a transferred appointment, not "different documents"
  const gw = by('DCM-dr14-gause-williams').desc;
  assert.doesNotMatch(gw, /different documents/);
  assert.match(gw, /March 15, 1832.*Jesse Gause.*transferred to Frederick G\. Williams.*March 18, 1833/);
  // S14-C2: the four Salem travelers named
  assert.match(
    by('DCM-dj03-salem-journey').desc,
    /Joseph Smith, Sidney Rigdon, Hyrum Smith and Oliver Cowdery traveling from Kirtland to Salem in 1836/,
  );
  // S14-C3: the restrictive clause of 134:12 is stated, attributed to the historical declaration
  const cg = by('DCM-dx16-civil-government').desc;
  assert.match(cg, /verse 12 opposes preaching to or baptizing people held in servitude/);
  assert.match(cg, /slavery-era position; no modern policy is inferred/);
  // SC40: one card per dcp identity, coordinate-free, D&C-gated, sourced per section
  const csv = readFileSync(
    new URL('../docs/universes/packs/lds-standard-works/supplementary-implementation.csv', import.meta.url),
    'utf8',
  );
  const rows = csv
    .trim()
    .split('\n')
    .filter(r => /^SD\d{4},SC40,/.test(r));
  assert.equal(rows.length, 138);
  const people = dc.filter((x: any) => x.key.startsWith('DCM-dcp-'));
  assert.equal(people.length, 138);
  for (const r of rows) {
    const m = r.match(/,imported,codex:dc-more,(DCM-dcp-[^,]+),/);
    assert.ok(m && by(m[1]), r.slice(0, 40));
  }
  for (const x of people) {
    assert.deepEqual([plain(x.books), plain(x.layers)], [[4], ['dc']], x.key);
    assert.equal(x.lat, undefined, x.key);
    assert.ok(x.desc.startsWith('Doctrine and Covenants — Named in '), x.key);
    assert.ok(x.src.length > 0 && x.src.every((s: any) => s.u.startsWith('https://') && s.t), x.key);
    assert.equal(new Set(x.src.map((s: any) => s.u)).size, x.src.length, `${x.key} repeats a source`);
  }
  assert.equal(L.codexSplit(people, new Set(['dc']), null, true, 3, (y: any) => Math.min(...y.books)).shown.length, 0);
  // identity distinctions carried as sentences
  assert.match(by('DCM-dcp-jesse-gause').desc, /not the same person/);
  assert.match(by('DCM-dcp-joseph-f-smith').desc, /Not Joseph Smith Jr\./);
  assert.match(by('DCM-dcp-major-n-ashley').desc, /not a military rank/);
  assert.equal(by('DCM-dcp-oliver-cowdery').src.length, 5); // headings 6, 21; sections 8, 9; 20:3
});

test('Supplementary checkpoint 16: S15-C1/C2 and SC41 office and companion relations in dc-more', () => {
  const dc = codex('dc-more');
  const by = (k: string) => dc.find((x: any) => x.key === k);
  const at = (list: any[], layers: string[], group: number) =>
    L.codexSplit(list, new Set(layers), null, true, group, (y: any) => Math.min(...y.books)).shown.map(
      (x: any) => x.key,
    );
  // S15-C1: the D&C card shows only the D&C name; the surname resolution is a PGP-gated child view
  const alvin = by('DCM-dcp-alvin-smith');
  assert.equal(alvin.name, 'Alvin');
  assert.deepEqual([plain(alvin.books), plain(alvin.layers)], [[4], ['dc']]);
  assert.ok(alvin.src.every((s: any) => !s.u.includes('/pgp/') && !/History/.test(s.t)));
  assert.doesNotMatch(alvin.name + alvin.desc, /Alvin Smith/);
  const jsh = by('DCM-jsh-alvin-family');
  assert.equal(jsh.name, "Alvin in Joseph Smith's family account");
  assert.deepEqual([plain(jsh.books), plain(jsh.layers)], [[5], ['pgp']]);
  assert.match(jsh.desc, /^Pearl of Great Price — Joseph Smith—History 1:3–4 .*D&C 137:5 itself names only Alvin\.$/);
  assert.deepEqual(plain(jsh.src.map((s: any) => s.t)), ['Joseph Smith—History 1:3–4']);
  assert.ok(jsh.src[0].u.includes('/pgp/js-h/1'));
  assert.equal(dc.indexOf(jsh), dc.indexOf(alvin) + 1);
  assert.equal(by('DCM-dr06-joseph-alvin').name, 'Joseph Smith and his brother Alvin');
  const all = ['ot', 'nt', 'bom', 'dc', 'pgp'];
  assert.ok(at(dc, all, 4).includes('DCM-dcp-alvin-smith') && !at(dc, all, 4).includes('DCM-jsh-alvin-family'));
  assert.ok(at(dc, all, 5).includes('DCM-jsh-alvin-family'));
  assert.ok(!at(dc, ['dc'], 5).includes('DCM-jsh-alvin-family'));
  // S15-C2: contract (115) and stock instruction (117) kept distinct; 138 added to the section 124 label
  const foster = by('DCM-dcp-robert-d-foster');
  assert.match(
    foster.desc,
    /Verse 115 directs .* contract; verse 117 separately directs .* stock into the Nauvoo House/,
  );
  assert.match(foster.desc, /not evidence here of completed construction or payment/);
  assert.doesNotMatch(foster.desc, /stockholder|Nauvoo House contract/);
  assert.deepEqual(plain(foster.src.map((s: any) => s.t)), ['D&C 124:115–118, 138']);
  // SC41: one DCM-dre card per DRE row, D&C-gated, coordinate-free, sourced per section
  const csv = readFileSync(
    new URL('../docs/universes/packs/lds-standard-works/supplementary-implementation.csv', import.meta.url),
    'utf8',
  );
  const rows = csv
    .trim()
    .split('\n')
    .filter(r => /^SD\d{4},SC41,/.test(r));
  assert.equal(rows.length, 36);
  const rel = dc.filter((x: any) => /^DCM-dre\d/.test(x.key));
  assert.equal(rel.length, 36);
  for (const r of rows) {
    const m = r.match(/,imported,codex:dc-more,(DCM-dre[^,]+),/);
    assert.ok(m && by(m[1]), r.slice(0, 40));
  }
  for (const x of rel) {
    assert.deepEqual([plain(x.books), plain(x.layers)], [[4], ['dc']], x.key);
    assert.equal(x.lat, undefined, x.key);
    assert.ok(x.desc.startsWith('Doctrine and Covenants — '), x.key);
    assert.ok(x.src.length > 0 && x.src.every((s: any) => s.u.includes('/dc-testament/dc/')), x.key);
    assert.equal(new Set(x.src.map((s: any) => s.u)).size, x.src.length, `${x.key} repeats a source`);
  }
  assert.equal(at(rel, ['dc'], 3).length, 0);
  // constraints carried as sentences
  assert.equal((by('DCM-dre052a-companion-pairs').desc.match(/; /g) || []).length, 12); // 13 pairs
  assert.equal((by('DCM-dre075-companion-pairs').desc.match(/; /g) || []).length, 12); // 12 pairs (11 separators) + the verses 24–28 clause
  assert.match(by('DCM-dre124f-twelve').desc, /no twelfth living name is added/);
  assert.match(by('DCM-dre124g-high-council').desc, /Aaron Johnson in place of the deceased Seymour Brunson/);
  assert.match(by('DCM-dre124d-nauvoo-house-stock').desc, /not proof that payment was made/);
  assert.match(by('DCM-dre118-marsh-and-twelve').desc, /footnote 2a/);
  assert.equal(by('DCM-dre058-return-party').src.length, 3);
});

test('Supplementary checkpoint 17: SC42 ancient participants and SC43 dated events in dc-more', () => {
  const dc = codex('dc-more');
  const by = (k: string) => dc.find((x: any) => x.key === k);
  const at = (list: any[], layers: string[], group: number) =>
    L.codexSplit(list, new Set(layers), null, true, group, (y: any) => Math.min(...y.books)).shown.map(
      (x: any) => x.key,
    );
  const csv = readFileSync(
    new URL('../docs/universes/packs/lds-standard-works/supplementary-implementation.csv', import.meta.url),
    'utf8',
  );
  const lines = csv.trim().split('\n');
  for (const [sc, n] of [
    ['SC42', 17],
    ['SC43', 21],
  ] as const) {
    const rows = lines.filter(r => new RegExp(`^SD\\d{4},${sc},`).test(r));
    assert.equal(rows.length, n, sc);
    for (const r of rows) {
      const m = r.match(/,imported,codex:dc-more,(DCM-[^,]+),/);
      assert.ok(m && by(m[1]), r.slice(0, 40));
      const x = by(m![1]);
      assert.deepEqual([plain(x.books), plain(x.layers)], [[4], ['dc']], x.key);
      assert.equal(x.lat, undefined, x.key);
      assert.ok(x.desc.startsWith('Doctrine and Covenants — '), x.key);
      assert.ok(x.src.length > 0 && x.src.every((s: any) => s.u.startsWith('https://') && s.t), x.key);
      assert.ok(
        x.src.every((s: any) => !s.u.includes('/pgp/')),
        x.key,
      );
      assert.equal(new Set(x.src.map((s: any) => s.u)).size, x.src.length, `${x.key} repeats a source`);
    }
  }
  // no SC42/SC43 row is pending (overall pending count is checked per checkpoint below)
  assert.equal(lines.filter(r => /^SD\d{4},SC4[23],.*,pending,/.test(r)).length, 0);
  // SC42 identity distinctions
  assert.match(by('DCM-dca-john-peter-james').desc, /not John the Baptist and not John Whitmer/);
  assert.match(by('DCM-dca-elijah-elias-moses').desc, /left open, and Elias is not merged with Elijah/);
  assert.match(by('DCM-dca-gabriel-raphael').desc, /Gabriel is not merged with Noah/);
  assert.match(by('DCM-dca-abel-to-noah').desc, /who is not named there.*430 years.*365 years/);
  assert.match(by('DCM-dca-aaron').desc, /rests on Exodus 4:14, not on these verses/);
  assert.match(by('DCM-dca-shem-elias-transfiguration').desc, /kept separate from the Elias of section 110/);
  // SD1045: the Sarai alias is a Pearl of Great Price child view, after its parent, shown only at group 5
  const marr = by('DCM-dca-marriage-examples');
  const sarai = by('DCM-dca-sarai-abraham');
  assert.match(marr.desc, /No claim is made that every participant consented/);
  assert.deepEqual([plain(sarai.books), plain(sarai.layers)], [[5], ['pgp']]);
  assert.ok(sarai.src[0].u.includes('/pgp/abr/2'));
  assert.equal(dc.indexOf(sarai), dc.indexOf(marr) + 1);
  const all = ['ot', 'nt', 'bom', 'dc', 'pgp'];
  assert.ok(at(dc, all, 4).includes(marr.key) && !at(dc, all, 4).includes(sarai.key));
  assert.ok(at(dc, all, 5).includes(sarai.key));
  // SC43 exact accepted display sentences and date/claim limits
  assert.match(
    by('DCM-de06b-kirtland-vision').desc,
    /^Doctrine and Covenants — Smith and Cowdery report seeing Christ and receiving successive commissions from Moses, Elias and Elijah\. .*April 3, 1836.*separate from the March 27 dedication/,
  );
  assert.match(by('DCM-de11-lost-manuscript').desc, /July is not given as its day/);
  assert.match(by('DCM-de22-far-west-temple').desc, /No completed temple is claimed/);
  assert.match(by('DCM-de28-manifesto-statement').desc, /“Manifesto accepted”.*not a second Manifesto/);
  assert.match(by('DCM-de26-government-declaration').desc, /not a dictated revelation/);
  assert.equal(
    at(
      dc.filter((x: any) => x.key.startsWith('DCM-dca-') || /^DCM-de(06b|[12]\d)-/.test(x.key)),
      ['dc'],
      3,
    ).length,
    0,
  );
});

test('Supplementary checkpoint 18: S17-C1/C2 and SC45 section dossiers DD001–DD070 in dc-more', () => {
  const dc = codex('dc-more');
  const by = (k: string) => dc.find((x: any) => x.key === k);
  const at = (list: any[], layers: string[], group: number) =>
    L.codexSplit(list, new Set(layers), null, true, group, (y: any) => Math.min(...y.books)).shown.map(
      (x: any) => x.key,
    );
  const csv = readFileSync(
    new URL('../docs/universes/packs/lds-standard-works/supplementary-implementation.csv', import.meta.url),
    'utf8',
  );
  const lines = csv.trim().split('\n');
  // S17-C1: the Lord addresses John and then Peter; no John–Peter dialogue
  const jpj = by('DCM-dca-john-peter-james').desc;
  assert.doesNotMatch(jpj, /dialogue between John/);
  assert.match(jpj, /depicts the Lord speaking with John the Beloved and then addressing Peter/);
  // S17-C2: Emma's concern attributed to the current heading
  assert.match(
    by('DCM-de20-word-of-wisdom').desc,
    /current section heading links Joseph Smith’s inquiry to tobacco use at the meetings and the concern it caused his wife, Emma Smith\./,
  );
  // optional precision and the Sarai child's Genesis link
  assert.match(by('DCM-dca-abel-to-noah').desc, /lineage, ordination, offering-comparison and vision contexts/);
  assert.match(by('DCM-de19-school-of-the-prophets').desc, /The heading dates section 88 to December 27–28, 1832/);
  assert.deepEqual(plain(by('DCM-dca-sarai-abraham').src.map((s: any) => s.t)), ['Abraham 2:2', 'Genesis 17:15']);
  // SC45: DD001–DD070 imported as one dc-layer card per section, in section order, with that section's link
  const sc45 = lines.filter(r => /^SD\d{4},SC45,/.test(r));
  assert.equal(sc45.length, 140);
  const imported = sc45.filter(r => /,imported,codex:dc-more,/.test(r));
  assert.equal(imported.length, 70);
  const keys = imported.map(r => r.match(/,imported,codex:dc-more,(DCM-[^,]+),/)![1]);
  keys.forEach((k, i) => {
    const n = i + 1;
    assert.ok(k.startsWith(`DCM-dd${String(n).padStart(3, '0')}-`), k);
    const x = by(k);
    assert.ok(x, k);
    assert.deepEqual([plain(x.books), plain(x.layers)], [[4], ['dc']], k);
    assert.equal(x.lat, undefined, k);
    assert.ok(x.name.startsWith(`Section ${n}: `), k);
    assert.ok(x.desc.startsWith(`Doctrine and Covenants — Section ${n}. `), k);
    assert.deepEqual(
      plain(x.src.map((s: any) => s.u)),
      [`https://www.churchofjesuschrist.org/study/scriptures/dc-testament/dc/${n}?lang=eng`],
      k,
    );
  });
  assert.deepEqual(plain(dc.filter((x: any) => /^DCM-dd\d/.test(x.key)).map((x: any) => x.key)), keys);
  assert.equal(lines.filter(r => /,pending,/.test(r)).length, 130);
  // the dossier for section 7 keeps the S17-C1 reading
  assert.match(by('DCM-dd007-john-ministry').desc, /the Lord speaks with John and then addresses Peter/);
  // not shown before the D&C layer
  assert.equal(
    at(
      dc.filter((x: any) => /^DCM-dd\d/.test(x.key)),
      ['ot', 'nt', 'bom', 'dc', 'pgp'],
      3,
    ).length,
    0,
  );
  assert.equal(
    at(
      dc.filter((x: any) => /^DCM-dd\d/.test(x.key)),
      ['dc'],
      4,
    ).length,
    70,
  );
});
