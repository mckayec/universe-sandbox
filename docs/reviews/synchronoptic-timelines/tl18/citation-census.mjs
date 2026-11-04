// Timeline checkpoint 18: parse every citation on every Standard Works timeline record with the module and list the
// failures by reason, plus every Bible Dictionary citation and its result. Nothing is promoted.
// Usage: node citation-census.mjs <lds-standard-works.js> <timeline.js> <timeline-grounding.js>
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
const [pack, tl, gr] = process.argv.slice(2);
const ctx = { URLSearchParams };
ctx.window = ctx;
vm.createContext(ctx);
for (const p of [pack, tl, gr]) vm.runInContext(readFileSync(p, 'utf8'), ctx);
const P = ctx.ATLAS_PACKS['lds-standard-works'];
const m = ctx.AtlasTimeline.adapterFor(P)(P);
const G = ctx.AtlasTimelineGrounding;
let total = 0;
const why = {};
const bd = [];
for (const r of m.records)
  for (const c of r.src || []) {
    total++;
    const p = G.parseLocator(c);
    if (!p.ok) why[p.why] = (why[p.why] || 0) + 1;
    if (/^Bible Dictionary/i.test(c.t || '')) bd.push({ record: r.id, t: c.t, u: c.u, ok: p.ok, why: p.why || null });
  }
console.log(
  JSON.stringify({ records: m.records.length, citations: total, invalidByReason: why, bibleDictionary: bd }, null, 2),
);
