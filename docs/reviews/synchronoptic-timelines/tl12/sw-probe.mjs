// Timeline checkpoint 12: run the isolated Standard Works adapter on the real pack (PR #33 head) and report counts.
// Usage: node sw-probe.mjs <path to public/atlas/packs/lds-standard-works.js> <path to public/atlas/timeline.js>
import { readFileSync } from 'node:fs';
import vm from 'node:vm';

const [packPath, tlPath] = process.argv.slice(2);
const ctx = { URLSearchParams };
ctx.window = ctx;
vm.createContext(ctx);
vm.runInContext(readFileSync(packPath, 'utf8'), ctx);
vm.runInContext(readFileSync(tlPath, 'utf8'), ctx);
const TL = ctx.AtlasTimeline;
const pack = ctx.ATLAS_PACKS['lds-standard-works'];
const fails = [];
const check = (ok, msg) => {
  if (!ok) fails.push(msg);
};
const model = TL.adapterFor(pack)(pack);
const v = TL.visible(model, () => true);
const cov = TL.coverage(v, model);
const count = (xs, f) => xs.reduce((m, x) => ((m[f(x)] = (m[f(x)] || 0) + 1), m), {});
const nCards = pack.codex.reduce((n, s) => n + s.list.length, 0);
const nSites = pack.worlds.reduce((n, w) => n + (w.sites || []).length, 0);
const nRoutes = pack.worlds.reduce((n, w) => n + (w.routes || []).length, 0);
check(model.records.length === pack.events.length + nSites + nRoutes + nCards, 'one record per source object');
check(new Set(model.records.map(r => r.id)).size === model.records.length, 'record ids unique');
// nothing gains a date: every dated record's year comes from the object's own numeric `when`
for (const e of pack.events)
  check((model.records.find(r => r.id === 'e:' + e.id).when || null) === null === (e.when == null), 'event ' + e.id);
for (const r of model.records) if (r.when) check(typeof r.when.from === 'number', 'numeric from ' + r.id);
check(cov.drawable === 0, 'no relationship drawn without a relationship-level source');
check(!model.edges.some(e => e.type === 'succession' || e.type === 'parent'), 'no succession or kinship invented');
const out = {
  records: model.records.length,
  bySource: count(model.records, r => r.source),
  dated: v.dated.length,
  datedBySource: count(v.dated, r => r.source),
  lanes: model.lanes.map(l => l.id + ' (' + v.records.filter(r => r.lane === l.id).length + ')'),
  edges: count(model.edges, e => e.type),
  omitted: model.omitted,
  coverage: { ...cov, gaps: cov.gaps.map(g => g.t) },
  fails,
};
console.log(JSON.stringify(out, null, 2));
process.exit(fails.length ? 1 : 0);
