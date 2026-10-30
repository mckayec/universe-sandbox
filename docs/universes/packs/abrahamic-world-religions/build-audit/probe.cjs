// Documentation-only independent data assertions; node probe.cjs /path/to/exact-build
const fs = require('node:fs'),
  vm = require('node:vm'),
  assert = require('node:assert/strict'),
  path = require('node:path');
const root = process.argv[2];
if (!root) throw Error('Supply exact build checkout');
const c = { window: {} };
vm.createContext(c);
for (const f of ['judaism', 'christianity', 'islam', 'encounters'])
  vm.runInContext(
    fs.readFileSync(path.join(root, 'public/atlas/packs/abrahamic-world-religions', f + '.js'), 'utf8'),
    c,
  );
vm.runInContext(fs.readFileSync(path.join(root, 'public/atlas/packs/abrahamic-world-religions.js'), 'utf8'), c);
const p = c.window.ATLAS_PACKS['abrahamic-world-religions'],
  nodes = p.tree.nodes,
  by = new Map(nodes.map(n => [n.id, n])),
  cards = p.codex.flatMap(t => t.list),
  ids = new Set(cards.map(n => n.id));
assert.equal(nodes.length, 109);
assert.equal(p.tree.links.length, 27);
assert.equal(p.events.length, 60);
assert.equal(new Set(nodes.map(n => n.id)).size, 109);
for (const l of p.tree.links) {
  assert(by.has(l.from));
  assert(by.has(l.to));
  assert(l.type);
  assert(l.rel);
}
for (const n of nodes) {
  if (n.parent) assert(by.has(n.parent));
  for (const id of n.merge || []) assert(by.has(id));
  for (const x of n.notSame || []) if (x.id) assert(by.has(x.id));
}
for (const e of p.events) if (e.ref) assert(ids.has(e.ref));
const places = p.codex.find(t => t.id === 'places').list;
assert.equal(places.length, 59);
for (const x of places) {
  assert.equal(x.lat, undefined);
  assert.equal(x.lon, undefined);
}
const sites = p.worlds.flatMap(w => w.sites || []);
assert.equal(sites.length, 10);
for (const s of sites) {
  assert(Number.isFinite(s.lat));
  assert(Number.isFinite(s.lon));
}
for (const id of ['judaism', 'christianity', 'islam', 'sikh-tradition', 'bahai-faith'])
  assert.equal(by.get(id).undated, true);
for (const id of ['sikh-tradition', 'bahai-faith']) assert.equal(by.get(id).parent, undefined);
for (const n of nodes.filter(n => /^isl0[1-8]$|^iso0[1-6]$/.test(n.id))) assert.equal(n.undated, true);
assert.equal(by.get('isc01').parentType, 'overlap');
assert.match(by.get('ism01').parentRel, /self-identifies-with/);
assert.match(
  by
    .get('ism01')
    .notes.map(n => n.t)
    .join(' '),
  /1974/,
);
// Defect reproduction, deliberately separate from passing invariants.
const defects = [
  ['ch-baptist', 1601, 1630],
  ['ch-pentecostal', 1901, 1930],
].map(([id, a, b]) => ({ id, unsupportedWindow: JSON.stringify(by.get(id).emerge) === JSON.stringify([a, b]) }));
const classification = ['isl05', 'isl06'].map(id => ({
  id,
  misleadingSourceLabel: /no further classification given/.test(by.get(id).parentRel),
}));
const structuralResult = {
  result: 'structural assertions pass; not a source or rendered certification',
  nodes: nodes.length,
  typedLinks: p.tree.links.length,
  events: p.events.length,
  pins: sites.length,
  codex: p.codex.map(t => ({ id: t.id, count: t.list.length })),
  emergenceWindows: nodes.filter(n => n.emerge).map(n => ({ id: n.id, emerge: n.emerge, whenText: n.whenText })),
  defects,
  classification,
};
// Actual pure engine semantics: no DOM, server, browser or GPU.
for (const f of ['tree-rel', 'tree', 'layers'])
  vm.runInContext(fs.readFileSync(path.join(root, 'public/atlas', f + '.js'), 'utf8'), c);
const T = c.window.AtlasTree.normTree(p, { min: -1000, max: 2026 }, null),
  LY = c.window.AtlasLayers;
const timelineCases = [
  ['jud-ananites', 801],
  ['ch-early-communities', 101],
  ['ch-stone-campbell', 1833],
  ['ch-strang-movement', 1848],
].map(([id, later]) => {
  const n = T.by[id];
  assert.equal(LY.timeOk(n, [later, later]), false);
  return {
    id,
    normalizedFrom: n.from,
    normalizedTo: n.to,
    ongoing: n.ongoing,
    laterFilterYear: later,
    matches: LY.timeOk(n, [later, later]),
  };
});
const eventCases = [
  ['ISE07', 942],
  ['ISE11', 1131],
].map(([id, y]) => {
  const e = p.events.find(x => x.id === id);
  assert.equal(LY.timeOk(e, [y, y]), false);
  return { id, when: e.when, whenText: e.whenText, laterFilterYear: y, matches: LY.timeOk(e, [y, y]) };
});
console.log(
  JSON.stringify(
    {
      ...structuralResult,
      timelineCases,
      eventCases,
      interpretation: 'Reproduces source/data semantic concerns; no assertion of rendered behavior',
    },
    null,
    2,
  ),
);
