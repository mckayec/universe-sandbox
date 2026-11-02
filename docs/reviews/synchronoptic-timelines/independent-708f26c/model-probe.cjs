// Run from the implementation repository root. No modifications to pack or engine.
const fs = require('node:fs'),
  vm = require('node:vm'),
  assert = require('node:assert/strict');
const c = { window: {}, URLSearchParams };
vm.createContext(c);
for (const f of [
  'packs/abrahamic-world-religions/judaism.js',
  'packs/abrahamic-world-religions/christianity.js',
  'packs/abrahamic-world-religions/islam.js',
  'packs/abrahamic-world-religions/encounters.js',
  'packs/abrahamic-world-religions.js',
  'timeline.js',
])
  vm.runInContext(fs.readFileSync('public/atlas/' + f, 'utf8'), c);
const T = c.window.AtlasTimeline,
  p = c.window.ATLAS_PACKS['abrahamic-world-religions'],
  m = T.adaptTree(p),
  v = T.visible(m, () => true);
assert.equal(T.yearsBetween(-1, 1), 1);
assert.equal(T.yearsBetween(-515, 70), 584);
for (const n of p.tree.nodes) {
  const r = m.records.find(r => r.id === 'n:' + n.id);
  assert.equal(r.whenText, n.whenText || null);
  if (n.emerge) {
    assert.deepEqual(Array.from(r.when.window), Array.from(n.emerge));
    assert.equal(r.when.toOpen, !!n.ongoing && n.until == null);
  }
  if (n.undated) assert.equal(r.when, null);
}
for (const e of p.events) {
  const r = m.records.find(r => r.id === 'e:' + e.id);
  assert.equal(r.whenText, e.whenText || null);
  if (e.when == null) assert.equal(r.when, null);
}
const noJud = T.visible(m, g => !g.layers.includes('jud'));
assert.equal(T.search(noJud, 'Karaite').length, 0);
assert.equal(T.parseState('#tl=1&tlsel=n:jud-karaite', noJud, p.timeline).sel, null);
assert(noJud.edges.every(e => noJud.byId.has(e.from) && noJud.byId.has(e.to)));
const edgeGate = {
  ...m,
  edges: [
    {
      id: 'private',
      from: m.records[0].id,
      to: m.records[1].id,
      src: [{ t: 'fixture' }],
      gate: { layers: ['denied'] },
    },
  ],
};
assert.equal(T.visible(edgeGate, g => !g.layers.includes('denied')).edges.length, 0);
const later = T.adaptTree({
  tree: { nodes: [] },
  events: [{ id: 'later', title: 'Later revelation', book: 5, chapter: 9, layers: ['x'], when: 1900 }],
}).records[0];
console.log(
  JSON.stringify(
    {
      coverage: T.coverage(v, m),
      sourceRecords: m.records.filter(r => r.src.length).length,
      allSourcesAreRefs: m.records.every(r => r.src.every(s => s.ref)),
      nodesWithNotes: p.tree.nodes.filter(n => n.notes?.length).length,
      nodesWithIdentityGuards: p.tree.nodes.filter(n => n.notSame?.length).length,
      syntheticLaterEventGate: later.gate,
      proof:
        'calendar, all 169 record date-wording mappings, emergence/ongoing separation, endpoint/own-edge gate, search and selected URL gate passed; future book/chapter gate fields lost',
    },
    null,
    2,
  ),
);
