// Timeline checkpoint 17: re-class every Standard Works relationship with the fail-closed parser and complete
// intersection (TL-R14/TL-R15), write the review ledger, and diff classes against the checkpoint-15 ledger.
// Nothing is promoted here; a class is evidence for a reviewer, not a relationship source.
// Usage: node grounding-ledger.mjs <lds-standard-works.js> <timeline.js> <timeline-grounding.js> <out.csv> [tl15.csv]
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import vm from 'node:vm';

const [packPath, tlPath, grPath, outPath, prevPath] = process.argv.slice(2);
const ctx = { URLSearchParams };
ctx.window = ctx;
vm.createContext(ctx);
for (const p of [packPath, tlPath, grPath]) vm.runInContext(readFileSync(p, 'utf8'), ctx);
const TL = ctx.AtlasTimeline;
const G = ctx.AtlasTimelineGrounding;
const pack = ctx.ATLAS_PACKS['lds-standard-works'];
const model = TL.adapterFor(pack)(pack);
const rows = G.ledger(model);
const q = v => '"' + String(v == null ? '' : v).replace(/"/g, '""') + '"';
const cites = src => (src || []).map(c => c.t).join('; ');
const part = s =>
  s.key.replace('#', ' ') +
  [
    s.heading && ' heading',
    s.doc && ' (document)',
    s.chapter && ' (whole)',
    s.verses && s.verses.length && ':' + s.verses.join(','),
  ]
    .filter(Boolean)
    .join('');
const head = [
  'edge',
  'type',
  'label',
  'from',
  'to',
  'class',
  'from_cites',
  'to_cites',
  'shared_passage',
  'invalid_cites',
];
const lines = [head.join(',')];
const tally = {};
const invalidWhy = {};
for (const r of rows) {
  tally[r.cls] = (tally[r.cls] || 0) + 1;
  for (const i of r.invalid)
    invalidWhy[i.why.replace(/".*"/, '"…"')] = (invalidWhy[i.why.replace(/".*"/, '"…"')] || 0) + 1;
  lines.push(
    [
      r.edge.id,
      r.edge.type,
      r.edge.label,
      r.from.label,
      r.to.label,
      r.cls,
      cites(r.from.src),
      cites(r.to.src),
      r.shared.map(part).join('; '),
      r.invalid.map(i => i.side + ': ' + i.t + ' (' + i.why + ')').join('; '),
    ]
      .map(q)
      .join(','),
  );
}
writeFileSync(outPath, lines.join('\n') + '\n');
const changed = [];
if (prevPath && existsSync(prevPath)) {
  const prev = new Map();
  for (const l of readFileSync(prevPath, 'utf8').trim().split('\n').slice(1)) {
    const f = l.match(/"((?:[^"]|"")*)"/g).map(x => x.slice(1, -1));
    prev.set(f[0], f[5]);
  }
  for (const r of rows)
    if (prev.get(r.edge.id) !== r.cls) changed.push(r.edge.id + ': ' + prev.get(r.edge.id) + ' -> ' + r.cls);
}
const drawable = TL.coverage(
  TL.visible(model, () => true),
  model,
).drawable;
const promoted = model.edges.filter(e => e.grounding).length;
console.log(
  JSON.stringify(
    {
      relationships: rows.length,
      classes: tally,
      invalidCitationsByReason: invalidWhy,
      classChanges: changed,
      drawable,
      promoted,
    },
    null,
    2,
  ),
);
