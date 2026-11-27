// Timeline checkpoint 15: class every Standard Works relationship by what its two endpoint cards cite, and write the
// review ledger. Nothing is promoted here; a class is evidence for a reviewer, not a relationship source.
// Usage: node grounding-ledger.mjs <lds-standard-works.js> <timeline.js> <timeline-grounding.js> <out.csv>
import { readFileSync, writeFileSync } from 'node:fs';
import vm from 'node:vm';

const [packPath, tlPath, grPath, outPath] = process.argv.slice(2);
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
const lines = [['edge', 'type', 'label', 'from', 'to', 'class', 'from_cites', 'to_cites', 'shared_passage'].join(',')];
const tally = {};
for (const r of rows) {
  tally[r.cls] = (tally[r.cls] || 0) + 1;
  const shared = r.shared
    .map(s => s.key.replace('#', ' ') + (s.verses ? ':' + s.verses.join(',') : s.heading ? ' heading' : ' (whole)'))
    .join('; ');
  lines.push(
    [r.edge.id, r.edge.type, r.edge.label, r.from.label, r.to.label, r.cls, cites(r.from.src), cites(r.to.src), shared]
      .map(q)
      .join(','),
  );
}
writeFileSync(outPath, lines.join('\n') + '\n');
const byType = {};
for (const r of rows) byType[r.cls + ' / ' + r.edge.type] = (byType[r.cls + ' / ' + r.edge.type] || 0) + 1;
const drawable = TL.coverage(TL.visible(model, () => true), model).drawable;
console.log(JSON.stringify({ relationships: rows.length, classes: tally, byClassAndType: byType, drawable }, null, 2));
