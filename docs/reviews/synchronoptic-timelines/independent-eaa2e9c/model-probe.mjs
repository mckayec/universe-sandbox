import vm from 'node:vm';
import { readFileSync, writeFileSync } from 'node:fs';
import assert from 'node:assert/strict';
const c = { window: {}, URLSearchParams };
c.window.window = c.window;
vm.createContext(c);
for (const p of ['judaism', 'christianity', 'islam', 'encounters', 'relationship-sources'])
  vm.runInContext(readFileSync('public/atlas/packs/abrahamic-world-religions/' + p + '.js', 'utf8'), c);
for (const p of ['packs/abrahamic-world-religions.js', 'timeline.js'])
  vm.runInContext(readFileSync('public/atlas/' + p, 'utf8'), c);
const T = c.window.AtlasTimeline,
  m = T.adaptTree(c.window.ATLAS_PACKS['abrahamic-world-religions']),
  all = T.visible(m, () => true),
  e = m.edges.find(e => e.key === 'l:jud-second-temple>ch-early-communities');
assert.equal(all.edges.length, 129);
assert.equal(all.drawnEdges.length, 95);
assert.equal(all.editorialEdges.length, 34);
e.gate.first = 999;
const gated = T.visible(m, g => g.first !== 999);
assert.equal(gated.edges.length, 128);
assert.equal(gated.drawnEdges.length, 94);
assert(!gated.edges.includes(e));
assert.equal(T.revalidate(gated, e.id), null);
assert(gated.byId.has(e.from) && gated.byId.has(e.to));
const result = {
  counts: T.coverage(all, m),
  edgeOwnGate: {
    endpointsSurvive: true,
    edges: gated.edges.length,
    sourced: gated.drawnEdges.length,
    selection: T.revalidate(gated, e.id),
  },
  jts: m.records.find(r => r.id === 'n:jud-jts'),
  masorti: m.records.find(r => r.id === 'n:jud-conservative-masorti'),
  allEdges: m.edges.map(e => ({
    key: e.key,
    label: e.label,
    type: e.type,
    locator: e.locator,
    keys: e.src.map(s => s.key),
    editorial: e.editorial,
  })),
  recordsWithoutExplicitCitation: m.records.filter(r => !r.src.length).length,
};
writeFileSync(new URL('model-results.json', import.meta.url), JSON.stringify(result, null, 2));
console.log(
  '129 mappings; own-edge gate removes edge from counts/drawing/selection while endpoints survive; ' +
    result.recordsWithoutExplicitCitation +
    ' records lack explicit src',
);
