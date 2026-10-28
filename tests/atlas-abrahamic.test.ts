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
const PARTS = ['judaism', 'christianity'];
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
