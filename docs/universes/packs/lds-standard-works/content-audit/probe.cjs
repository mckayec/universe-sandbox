// node probe.cjs /path/to/exact-build; pure data/helper checks only.
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');
const assert = require('node:assert/strict');
const root = process.argv[2];
const c = { window: {} };
vm.createContext(c);
for (const file of ['packs/lds-standard-works.js', 'layers.js']) {
  vm.runInContext(fs.readFileSync(path.join(root, 'public/atlas', file), 'utf8'), c);
}
const p = c.window.ATLAS_PACKS['lds-standard-works'];
const L = c.window.AtlasLayers;
const cards = p.codex.flatMap(t => t.list);
const cases = [
  ['Haran', 'ot', 'Pearl of Great Price:'],
  ['Ur of the Chaldees', 'ot', 'Pearl of Great Price:'],
  ['Mount of Olives', 'ot', 'New Testament:'],
  ['Enoch’s city (Zion)', 'dc', 'Pearl of Great Price:'],
  ['First Vision account', 'dc', 'Pearl of Great Price'],
  ['Woods near the Smith home', 'dc', 'Pearl of Great Price:'],
  ['Shechem (Sichem)', 'pgp', 'Old Testament:'],
  ['Camp between Bethel and Hai', 'pgp', 'Old Testament:'],
  ['Egypt', 'pgp', 'Old Testament:'],
].map(([name, activeLayer, text]) => {
  const item = cards.find(x => x.name === name);
  assert(item);
  const shown = L.codexSplit([item], new Set([activeLayer]), null, false, 1).shown;
  assert.equal(shown.length, 1);
  assert(shown[0].desc.includes(text));
  return { name, activeLayer, retainedOtherWorkText: text, reproduced: true };
});
const fayette = p.worlds[0].sites.find(x => x.id === 'fayette');
const event = p.events.find(x => x.id === 'translation-fayette');
const route = p.worlds[0].routes.find(x => x.id === 'dictation-move');
assert.equal(L.timeOk(fayette, [1829, 1829]), false);
assert.equal(L.timeOk(event, [1829, 1829]), true);
assert.equal(L.timeOk(route, [1829, 1829]), true);
const jerusalem = p.worlds[0].sites.find(x => x.id === 'jerusalem');
assert.equal(L.visibleNotes(jerusalem.notes, new Set(['ot']), null, false, 1).length, 1);
assert(!L.visibleNotes(jerusalem.notes, new Set(['ot']), null, false, 1)[0].t.includes('Nephi'));
console.log(
  JSON.stringify(
    {
      implementation: 'c59c9bc13d848bbf0c4b3f3c64810bfa187749f0',
      counts: {
        sites: p.worlds[0].sites.length,
        events: p.events.length,
        routes: p.worlds[0].routes.length,
        codex: cards.length,
      },
      crossLayerCases: cases,
      year1829: { fayetteMatches: false, dictationEventMatches: true, dictationRouteMatches: true },
      positiveControl: 'Jerusalem note-level filtering excludes BoM text under OT-only',
      limit: 'Actual pure helper outputs; no rendered/server/browser or historical verification',
    },
    null,
    2,
  ),
);
