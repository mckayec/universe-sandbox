const fs = require('node:fs'),
  vm = require('node:vm'),
  a = require('node:assert/strict');
const c = { window: {}, URLSearchParams };
vm.createContext(c);
for (const file of [
  'packs/abrahamic-world-religions/judaism.js',
  'packs/abrahamic-world-religions/christianity.js',
  'packs/abrahamic-world-religions/islam.js',
  'packs/abrahamic-world-religions/encounters.js',
  'packs/abrahamic-world-religions.js',
  'timeline.js',
])
  vm.runInContext(fs.readFileSync('public/atlas/' + file, 'utf8'), c);
const T = c.window.AtlasTimeline,
  p = c.window.ATLAS_PACKS['abrahamic-world-religions'],
  m = T.adaptTree(p),
  plain = x => JSON.parse(JSON.stringify(x));
let notes = 0,
  guards = 0;
for (const r of m.records) {
  const o = (r.source === 'tree' ? p.tree.nodes : p.events).find(o => o.id === r.sourceId);
  a.equal(r.text, (r.source === 'tree' ? o.blurb : o.text) || null);
  a.equal(r.whenText, o.whenText || null);
  a.deepEqual(
    plain(r.notes),
    plain((o.notes || []).filter(n => n && n.t).map(n => ({ k: n.k || null, t: n.t, loc: n.ref || null }))),
  );
  a.deepEqual(
    plain(r.notSame),
    plain((o.notSame || []).filter(n => n && n.t).map(n => ({ id: n.id || null, t: n.t }))),
  );
  notes += r.notes.length;
  guards += r.notSame.length;
  if (r.source === 'events') {
    a.equal(r.atlasRef, o.ref || null);
    a.equal(r.gate.first, o.book);
  }
}
a.equal(T.yearsBetween(-1, 1), 1);
a.equal(T.yearsBetween(-515, 70), 584);
const v = T.visible(m, () => true);
console.log(
  JSON.stringify(
    {
      checkedRecords: m.records.length,
      checkedNotes: notes,
      checkedGuards: guards,
      narrativeCovenant: m.records.find(r => r.id === 'n:jud-covenant-tradition').chron,
      explicitSourceRecords: m.records.filter(r => r.src.length).length,
      coverage: T.coverage(v, m),
    },
    null,
    2,
  ),
);
