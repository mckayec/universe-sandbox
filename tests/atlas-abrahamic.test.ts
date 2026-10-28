import assert from 'node:assert/strict';
import { mkdtempSync, readFileSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import test from 'node:test';
import vm from 'node:vm';
// @ts-expect-error plain JS helper without type declarations
import { validatePacks } from './atlas-pack-validator.mjs';

// Build rules for the religious-traditions atlas (docs/universes/packs/abrahamic-world-religions/build-contract.md).
const ctx: { window: Record<string, any> } = { window: {} };
ctx.window.window = ctx.window;
vm.createContext(ctx);
const PARTS = ['judaism', 'christianity', 'islam', 'encounters'];
for (const part of PARTS)
  vm.runInContext(
    readFileSync(new URL(`../public/atlas/packs/abrahamic-world-religions/${part}.js`, import.meta.url), 'utf8'),
    ctx,
  );
vm.runInContext(
  readFileSync(new URL('../public/atlas/packs/abrahamic-world-religions.js', import.meta.url), 'utf8'),
  ctx,
);
const pack = ctx.window.ATLAS_PACKS['abrahamic-world-religions'];
const earth = pack.worlds.find((w: { id: string }) => w.id === 'earth');
const research = new URL('../docs/universes/packs/abrahamic-world-religions/', import.meta.url);

function csv(file: string): Record<string, string>[] {
  const text = readFileSync(new URL(file, research), 'utf8').trim();
  const rows: string[][] = [];
  let row: string[] = [];
  let cell = '';
  let quoted = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (quoted) {
      if (c === '"' && text[i + 1] === '"') {
        cell += '"';
        i++;
      } else if (c === '"') quoted = false;
      else cell += c;
    } else if (c === '"') quoted = true;
    else if (c === ',') {
      row.push(cell);
      cell = '';
    } else if (c === '\n') {
      row.push(cell);
      rows.push(row);
      row = [];
      cell = '';
    } else if (c !== '\r') cell += c;
  }
  row.push(cell);
  rows.push(row);
  const head = rows.shift() as string[];
  return rows.map(r => Object.fromEntries(head.map((h, i) => [h, r[i] ?? ''])));
}

test('only the ten approved anchors are map pins, at their source coordinates', () => {
  const gaz = csv('gazetteer-evidence.csv');
  const expected: Record<string, [number, number]> = {
    jerusalem: [31.777778, 35.231667],
    'jud-babylon': [32.541969, 44.420833],
  };
  for (const g of gaz) expected[g.id] = [Number(g.latitude), Number(g.longitude)];
  assert.equal(Object.keys(expected).length, 10);
  assert.deepEqual([...earth.sites.map((s: { id: string }) => s.id)].sort(), Object.keys(expected).sort());
  for (const s of earth.sites) {
    assert.ok(Math.abs(s.lat - expected[s.id][0]) < 1e-6, `${s.id} lat`);
    assert.ok(Math.abs(s.lon - expected[s.id][1]) < 1e-6, `${s.id} lon`);
  }
});

test('heritage markers say they are heritage references, not event sites', () => {
  for (const s of earth.sites.filter((x: { id: string }) => x.id.startsWith('gaz-')))
    assert.ok(
      s.notes.some((n: { t: string }) => /Heritage reference/.test(n.t)),
      `${s.id} lacks the heritage note`,
    );
});

test('every researched place is either a pin or a reference card without coordinates', () => {
  const cards = pack.codex.find((t: { id: string }) => t.id === 'places').list;
  const ids = new Set<string>([
    ...earth.sites.map((s: { id: string }) => s.id),
    ...cards.map((c: { id: string }) => c.id),
  ]);
  assert.equal(ids.size, earth.sites.length + cards.length, 'duplicate place ids');
  for (const c of cards) assert.ok(c.lat == null && c.lon == null, `${c.id} has coordinates`);
  const places = csv('identity-and-edges.csv').filter(r => r.record_kind === 'identity' && r.entity_type === 'place');
  for (const p of places) assert.ok(ids.has(p.canonical_id), `missing place ${p.canonical_id} (${p.source_id})`);
});

test('reference cards and world links are checked by the pack validator', () => {
  const dir = mkdtempSync(path.join(tmpdir(), 'atlas-ref-'));
  writeFileSync(path.join(dir, 'registry.js'), 'window.ATLAS_REGISTRY=[{id:"refs",title:"Refs"}];');
  writeFileSync(
    path.join(dir, 'refs.js'),
    `(window.ATLAS_PACKS=window.ATLAS_PACKS||{}).refs={id:"refs",meta:{title:"Refs"},books:{1:{n:"I",title:"One"}},
      worlds:[{id:"w",name:"W",group:"g",books:[1],map:[0,26],blurb:"x",gfx:{type:"terran"},refPlaces:"nope"}],
      events:[{id:"e1",book:1,world:"w",title:"E",text:"t",ref:"missing"},{id:"e2",book:1,world:"w",title:"E",text:"t",ref:"a"}],
      codex:[{id:"places",title:"Places",list:[{id:"a",name:"A",desc:"d"},{id:"a",name:"B",desc:"d"}]}]};`,
  );
  const r = validatePacks(dir)['refs.js'];
  assert.ok(r.issues.some((i: string) => /ref -> missing codex entry "missing"/.test(i)));
  assert.ok(r.issues.some((i: string) => /refPlaces -> missing codex tab "nope"/.test(i)));
  assert.ok(r.issues.some((i: string) => /duplicate entry id a/.test(i)));
  assert.ok(!r.issues.some((i: string) => /e2/.test(i)));
});

// Checkpoint 3: Judaism (judaism-research.md §4–§6, §8)
const judRows = csv('identity-and-edges.csv').filter(
  r => r.record_kind === 'identity' && r.source_file === 'judaism-research.md',
);
const tab = (id: string) => pack.codex.find((t: { id: string }) => t.id === id).list as { id: string }[];
const nodeBy = new Map<string, any>(pack.tree.nodes.map((n: { id: string }) => [n.id, n]));

test('every Judaism record in the crosswalk is built as an event, node, journey or person', () => {
  const evIds = new Set(pack.events.map((e: { id: string }) => e.id));
  const journeys = new Set(tab('journeys').map(c => c.id));
  const people = new Set(tab('people').map(c => c.id));
  const nodeTypes = ['tradition-or-concept', 'historical-movement', 'intellectual-context', 'institution'];
  for (const r of judRows) {
    const id = r.canonical_id;
    if (r.entity_type === 'event') assert.ok(evIds.has(id), `event ${id}`);
    else if (r.entity_type === 'journey-or-network') assert.ok(journeys.has(id), `journey ${id}`);
    else if (r.entity_type === 'person') assert.ok(people.has(id), `person ${id}`);
    else if ([...nodeTypes, 'organization', 'overview-container'].includes(r.entity_type)) {
      // jud-pluralism is an explanatory entry, folded into the Judaism hub's notes
      if (id === 'jud-pluralism')
        assert.ok(nodeBy.get('judaism').notes.some((n: { t: string }) => /no denominational label/.test(n.t)));
      else assert.ok(nodeBy.has(id), `node ${id}`);
    }
  }
});

test('Judaism dates never claim more precision than the research', () => {
  const e = new Map<string, any>(pack.events.map((x: { id: string }) => [x.id, x]));
  for (const id of ['jud-e00', 'jud-e00b', 'jud-e05']) assert.equal(e.get(id).when, undefined, `${id} has a year`);
  for (const x of pack.events.filter((v: { id: string }) => v.id.startsWith('jud-')))
    assert.ok(x.whenText, `${x.id} lacks the source wording`);
  assert.equal(e.get('jud-e11').site, undefined, 'SAJ location is withheld (JA01)');
  assert.equal(e.get('jud-e11').ref, undefined, 'SAJ location is withheld (JA01)');
  for (const id of ['judaism', 'jud-rabbinic', 'jud-orthodox', 'jud-renewal']) assert.ok(nodeBy.get(id).undated, id);
  assert.deepEqual([...nodeBy.get('jud-hasidic').emerge], [1701, 1800]);
});

test('Judaism ties follow the typed ledger: no forbidden ancestry, mergers keep both predecessors', () => {
  const parentOf = (id: string) => nodeBy.get(id).parent;
  assert.notEqual(parentOf('jud-karaite'), 'jud-sadducees');
  assert.notEqual(parentOf('jud-karaite'), 'jud-ananites');
  assert.notEqual(parentOf('jud-rabbinic'), 'jud-pharisees');
  assert.notEqual(parentOf('jud-haredi'), 'jud-hasidic');
  assert.deepEqual([...nodeBy.get('jud-aleph').merge], ['jud-pnai-or', 'jud-shalom-center']);
  assert.deepEqual(
    [...nodeBy.get('jud-progressive-uk').merge],
    ['jud-liberal-uk-historical', 'jud-reform-uk-historical'],
  );
  assert.ok(nodeBy.get('jud-karaite').notSame.some((n: { id?: string }) => n.id === 'jud-sadducees'));
  const has = (from: string, to: string, type: string) =>
    pack.tree.links.some((l: any) => l.from === from && l.to === to && l.type === type);
  assert.ok(has('jud-aleph', 'jud-renewal', 'within'));
  assert.ok(has('jud-ananites', 'jud-karaite', 'contact'));
  assert.ok(has('jud-hasidic', 'jud-haredi', 'overlap'));
});

test('event whenText is shown instead of the year, and the validator checks it', () => {
  const ly: { window: Record<string, any> } = { window: {} };
  vm.runInNewContext(readFileSync(new URL('../public/atlas/layers.js', import.meta.url), 'utf8'), ly);
  const LY = ly.window.AtlasLayers || ly.window.ATLAS_LAYERS;
  assert.ok(LY, 'layers helper');
  const html = LY.itemMeta(null, { style: 'BCE/CE' }, { when: [1701, 1800], whenText: 'Eighteenth century' });
  assert.match(html, /Eighteenth century/);
  assert.doesNotMatch(html, /1701/);
});

test('the registry lists the data parts in the order the pack expects', () => {
  const reg: { window: Record<string, any> } = { window: {} };
  vm.runInNewContext(readFileSync(new URL('../public/atlas/packs/registry.js', import.meta.url), 'utf8'), reg);
  const entry = reg.window.ATLAS_REGISTRY.find((r: { id: string }) => r.id === 'abrahamic-world-religions');
  assert.deepEqual([...entry.parts], PARTS);
});

test('the validator reports a missing or unloadable data part', () => {
  const dir = mkdtempSync(path.join(tmpdir(), 'atlas-parts-'));
  writeFileSync(path.join(dir, 'registry.js'), 'window.ATLAS_REGISTRY=[{id:"p",title:"P",parts:["gone"]}];');
  writeFileSync(path.join(dir, 'p.js'), '(window.ATLAS_PACKS=window.ATLAS_PACKS||{}).p={id:"p"};');
  assert.match(validatePacks(dir)['p.js'].error, /part p\/gone\.js is missing/);
});

// Checkpoint 4: Christianity (christianity-research.md §3–§6a)
const chrRows = csv('identity-and-edges.csv').filter(r => r.source_file === 'christianity-research.md');

test('every Christianity record in the crosswalk is built', () => {
  const evIds = new Set(pack.events.map((e: { id: string }) => e.id));
  const journeys = new Set(tab('journeys').map(c => c.id));
  const contexts = ['historical-context', 'historical-movement', 'communion-association', 'overview-container'];
  for (const r of chrRows.filter(x => x.record_kind === 'identity')) {
    const id = r.canonical_id;
    if (r.entity_type === 'event') assert.ok(evIds.has(id), `event ${id}`);
    else if (r.entity_type === 'journey-or-network') assert.ok(journeys.has(id), `journey ${id}`);
    else if (['tradition-or-concept', ...contexts].includes(r.entity_type)) assert.ok(nodeBy.has(id), `node ${id}`);
  }
  assert.equal(pack.events.filter((e: { id: string }) => e.id.startsWith('che-')).length, 22);
  assert.equal(tab('journeys').filter(c => c.id.startsWith('ch-spread-')).length, 4);
});

test('Christian families get no invented founding year', () => {
  for (const id of ['christianity', 'ch-catholic', 'ch-eastern-orthodox', 'ch-oriental-orthodox', 'ch-east-syriac'])
    assert.ok(nodeBy.get(id).undated, `${id} should be undated`);
  assert.ok(nodeBy.get('ch-african-instituted').undated, 'AIC family has no family-wide period (audit correction)');
  assert.deepEqual([...nodeBy.get('ch-lutheran').emerge], [1501, 1600]);
  assert.deepEqual([...nodeBy.get('ch-anglican').emerge], [1501, 1700]);
  for (const x of pack.events.filter((v: { id: string }) => v.id.startsWith('che-')))
    assert.ok(x.whenText && x.when != null, `${x.id} needs the source wording and a filter year`);
  const e = new Map<string, any>(pack.events.map((x: { id: string }) => [x.id, x]));
  for (const id of ['che-methodist-us', 'che-african-church']) {
    assert.equal(e.get(id).site, undefined, `${id}: no venue in the source`);
    assert.equal(e.get(id).ref, undefined, `${id}: regional context only`);
  }
});

test('Christianity ties follow the research: context not parentage, successors not aliases', () => {
  const has = (from: string, to: string, type: string) =>
    pack.tree.links.some((l: any) => l.from === from && l.to === to && l.type === type);
  assert.ok(has('jud-second-temple', 'ch-early-communities', 'context'), 'AI290');
  assert.notEqual(nodeBy.get('ch-early-communities').parent, 'jud-second-temple');
  assert.ok(has('ch-catholic', 'ch-eastern-orthodox', 'history'));
  assert.ok(has('ch-anglican', 'ch-african-church', 'division'));
  assert.deepEqual([...nodeBy.get('ch-stone-campbell').merge], ['ch-stone-movement', 'ch-campbell-movement']);
  assert.notEqual(nodeBy.get('ch-baptist').parent, 'ch-anabaptist');
  assert.notEqual(nodeBy.get('ch-jehovahs-witnesses').parent, 'ch-adventist');
  assert.notEqual(nodeBy.get('ch-community-christ').parent, 'ch-lds-utah');
  const notSame = (a: string, b: string) => (nodeBy.get(a).notSame || []).some((n: { id?: string }) => n.id === b);
  for (const r of chrRows.length ? csv('identity-and-edges.csv').filter(x => x.record_kind === 'nonmerge') : [])
    if (nodeBy.has(r.canonical_id) && nodeBy.has(r.target_id))
      assert.ok(
        notSame(r.canonical_id, r.target_id) || notSame(r.target_id, r.canonical_id),
        `${r.row_id}: ${r.canonical_id} / ${r.target_id}`,
      );
});

// Checkpoint 5: Islam (islam-research.md §2–§6, islam-record-audit.md)
const islRows = csv('identity-and-edges.csv').filter(r => r.source_file === 'islam-research.md');

test('every Islam record in the crosswalk is built as a node, event, journey, person or card', () => {
  const evIds = new Set(pack.events.map((e: { id: string }) => e.id));
  const journeys = new Set(tab('journeys').map(c => c.id));
  const people = new Set(tab('people').map(c => c.id));
  const places = new Set(tab('places').map(c => c.id));
  const nodeTypes = ['tradition-or-concept', 'tradition', 'legal-school', 'concept', 'devotional-order', 'movement'];
  for (const r of islRows.filter(x => x.record_kind === 'identity')) {
    const id = r.canonical_id;
    if (r.entity_type === 'event') assert.ok(evIds.has(id), `event ${id}`);
    else if (['journey-or-network', 'scholarly-network'].includes(r.entity_type))
      assert.ok(journeys.has(id), `journey ${id}`);
    else if (r.entity_type === 'person') assert.ok(people.has(id), `person ${id}`);
    else if (r.entity_type === 'place')
      assert.ok(places.has(id) || earth.sites.some((s: { id: string }) => s.id === id), `place ${id}`);
    else if (nodeTypes.includes(r.entity_type)) assert.ok(nodeBy.has(id.toLowerCase()), `node ${id}`);
  }
  assert.equal(pack.events.filter((e: { id: string }) => /^ISE\d+$/.test(e.id)).length, 15);
  assert.equal(tab('people').filter(c => /^ISH\d+$/.test(c.id)).length, 14);
});

test('Islam is its own tradition, and no school, order or tradition gets an invented year', () => {
  const islam = nodeBy.get('islam');
  assert.equal(islam.parent, undefined, 'not a child of Judaism or Christianity');
  assert.ok(islam.undated);
  for (const id of ['ist02', 'ist03', 'ist05', 'ist06', 'ist07', 'isc01', 'ism02', 'ism04', 'ism05'])
    assert.ok(nodeBy.get(id).undated, `${id} has no single founding date`);
  for (let i = 1; i <= 8; i++) assert.ok(nodeBy.get('isl0' + i).undated, `isl0${i}`);
  for (let i = 1; i <= 6; i++) assert.ok(nodeBy.get('iso0' + i).undated, `iso0${i}`);
  assert.deepEqual([...nodeBy.get('ist04').emerge], [601, 700]);
  assert.equal(nodeBy.get('ist08').when, 1094);
  for (const x of pack.events.filter((v: { id: string }) => /^ISE/.test(v.id))) {
    assert.ok(x.whenText, `${x.id} needs the source wording`);
    assert.ok(x.site == null, `${x.id}: no coordinates in the Islam dossier`);
    assert.ok(x.ref || x.side, `${x.id}: a reference card or a reason for no place`);
  }
  const e = new Map<string, any>(pack.events.map((x: { id: string }) => [x.id, x]));
  assert.match(e.get('ISE14').whenText, /1866/);
  assert.match(e.get('ISE14').whenText, /1867/, 'Deoband date discrepancy kept visible');
  assert.match(e.get('ISE05').whenText, /January 740/, 'month precision kept');
});

test('Islam ties follow the ledger: within, succession, overlap, and attributed Ahmadi identity', () => {
  const up = (id: string) => [nodeBy.get(id).parent, nodeBy.get(id).parentType];
  for (const id of ['ist02', 'ist03', 'ist04']) assert.deepEqual(up(id), ['islam', 'within']);
  for (const id of ['ist05', 'ist06', 'ist07']) assert.deepEqual(up(id), ['ist03', 'within']);
  for (const id of ['ist08', 'ist09']) assert.deepEqual(up(id), ['ist06', 'division']);
  for (const id of ['ist10', 'ist11']) assert.deepEqual(up(id), ['ist09', 'division']);
  for (const id of ['isl01', 'isl02', 'isl03', 'isl04']) assert.deepEqual(up(id), ['ist02', 'within']);
  for (let i = 1; i <= 6; i++) assert.equal(nodeBy.get('iso0' + i).parent, 'isc01');
  assert.notEqual(nodeBy.get('isc01').parentType, 'branch', 'Sufism is not a fourth branch');
  const has = (from: string, to: string, type: string) =>
    pack.tree.links.some((l: any) => l.from === from && l.to === to && l.type === type);
  assert.ok(has('ism02', 'ism03', 'overlap'));
  assert.ok(has('ism04', 'isc01', 'overlap'));
  assert.ok(has('ism05', 'isl01', 'overlap'));
  assert.ok(has('isc04', 'jud-covenant-tradition', 'context'), 'AI302 is a textual reference, not descent');
  const ahm = nodeBy.get('ism01');
  assert.ok(
    ahm.notes.some((n: { k: string }) => n.k === 'self'),
    'self-description field',
  );
  assert.ok(
    ahm.notes.some((n: { t: string }) => /1974/.test(n.t) && /not this atlas/.test(n.t)),
    'external classification field',
  );
  const isj3 = tab('journeys').find(c => c.id === 'ISJ03') as any;
  assert.match(isj3.desc, /no route geometry/);
});

// Checkpoint 6: Encounters and population estimates (comparative-evidence.md; AI210–AI250, AI292–AI301)
const cmpRows = csv('identity-and-edges.csv').filter(r => r.source_file === 'comparative-evidence.md');
const codexIds = new Set<string>(pack.codex.flatMap((t: { list: { id?: string }[] }) => t.list.map(c => c.id)));
const evById = new Map<string, any>(pack.events.map((x: { id: string }) => [x.id, x]));

test('every comparative record in the crosswalk is built', () => {
  for (const r of cmpRows.filter(x => x.record_kind === 'identity')) {
    const id = r.canonical_id;
    if (r.entity_type === 'event') assert.ok(evById.has(id), `event ${id}`);
    else if (r.entity_type === 'region-context')
      continue; // Iran: named in XJ01's text, not a place card
    else assert.ok(codexIds.has(id) || nodeBy.has(id) || nodeBy.has(id.toLowerCase()), `${r.entity_type} ${id}`);
  }
  assert.match((tab('journeys').find(c => c.id === 'XJ01') as any).desc, /Iran/);
  assert.equal(pack.events.filter((e: { id: string }) => /^XE\d+$/.test(e.id)).length, 6);
});

test('every identity in the crosswalk resolves to one built record', () => {
  const sites = new Set<string>(earth.sites.map((s: { id: string }) => s.id));
  const textOnly = ['region-context', 'jurisdiction-context'];
  for (const r of csv('identity-and-edges.csv').filter(x => x.record_kind === 'identity')) {
    const id = r.canonical_id;
    if (textOnly.includes(r.entity_type) || id === 'jud-pluralism') continue;
    assert.ok(
      evById.has(id) || codexIds.has(id) || sites.has(id) || nodeBy.has(id) || nodeBy.has(id.toLowerCase()),
      `${r.row_id} ${id} (${r.entity_type})`,
    );
  }
});

test('encounters are contacts, never branches', () => {
  const enc = pack.tree.nodes.filter((n: { layers: string[] }) => n.layers.includes('enc'));
  assert.equal(enc.length, 7);
  for (const n of enc) {
    assert.equal(n.parent, undefined, `${n.id} has no parent`);
    assert.equal(n.merge, undefined);
    assert.ok(n.undated, `${n.id}: no invented year`);
  }
  const encIds = new Set(enc.map((n: { id: string }) => n.id));
  for (const l of pack.tree.links.filter((x: any) => encIds.has(x.from) || encIds.has(x.to)))
    assert.equal(l.type, 'contact', `${l.from} → ${l.to}`);
  const has = (from: string, to: string) => pack.tree.links.some((l: any) => l.from === from && l.to === to);
  for (const to of ['daoism-reference', 'buddhism-reference', 'confucian-reference']) assert.ok(has('islam', to));
  assert.ok(has('hindu-philosophy', 'isc01'), 'Dara Shikoh’s comparison (AI293/AI294)');
  for (const id of ['sikh-tradition', 'bahai-faith'])
    assert.ok(!pack.tree.links.some((l: any) => l.from === id || l.to === id), `${id}: no tradition tie`);
});

test('encounter dates keep different kinds of evidence apart', () => {
  assert.match(evById.get('XE01').whenText, /781/);
  assert.match(evById.get('XE01').whenText, /635/);
  assert.equal(evById.get('XE01').when, 781, 'the inscription is the dated event');
  assert.equal(evById.get('XE03').when, 1655);
  assert.equal(evById.get('XE04').when, 1657);
  assert.equal(evById.get('XE05').when, 1863);
  assert.equal(evById.get('XE06').when, 1963);
  for (const id of ['XE01', 'XE02', 'XE03', 'XE04', 'XE05', 'XE06']) {
    const x = evById.get(id);
    assert.ok(x.site == null, `${id}: no coordinates`);
    assert.ok(x.ref || x.side, `${id}: a card or a reason`);
  }
  const bahai = nodeBy.get('bahai-faith');
  assert.ok(
    bahai.notes.some((n: { k: string }) => n.k === 'self'),
    'Bahá’í claims attributed',
  );
  assert.match(bahai.whenText, /1844/);
});

test('population estimates carry their year and measure and are never summed', () => {
  const pop = tab('population') as any[];
  assert.match(pack.codex.find((t: { id: string }) => t.id === 'population').title, /2020.*2025/);
  const rows = pop.filter(c => /^XD0\d$/.test(c.id));
  assert.equal(rows.length, 7);
  for (const c of rows) {
    assert.match(c.role, /2020/);
    assert.match(c.role, /2025/);
    assert.match(c.desc, /2020/);
  }
  assert.match(pop.find(c => c.id === 'XD07').desc, /not assigned to any one tradition/);
  assert.match(pop.find(c => c.id === 'xd-about').desc, /not added together/);
  assert.ok(!pop.some(c => /total|combined world/i.test(c.name) && c.id !== 'XD07'));
});
