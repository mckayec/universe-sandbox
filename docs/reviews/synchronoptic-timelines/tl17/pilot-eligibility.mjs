// Timeline checkpoint 17 dry run: the 11 pilot rows recommended for acceptance in HANDOFF_PLAN (866854c), checked for
// MECHANICAL eligibility only with the corrected module. No review entry is built or applied; nothing is promoted.
// Usage: node pilot-eligibility.mjs <lds-standard-works.js> <timeline.js> <timeline-grounding.js>
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
const U = 'https://www.churchofjesuschrist.org/study/scriptures/';
const c = (t, p) => ({ t, u: U + p + '?lang=eng' });
const rows = [
  ['x:c:DCM-dcp-shadrach-roundy>c:DCM-dre124k-bishopric-priests', 's', [c('D&C 124:141', 'dc-testament/dc/124')]],
  ['x:c:DCM-dcp-simonds-ryder>c:DCM-dcp-heman-basset', 's', [c('D&C 52:37', 'dc-testament/dc/52')]],
  ['x:c:DCM-dcp-peter-whitmer-jr>c:DCM-dre030-whitmer-cowdery', 's', [c('D&C 30:5–7', 'dc-testament/dc/30')]],
  ['x:c:DCM-dcp-william-law>c:DCM-dre124e-presidency-patriarch', 's', [c('D&C 124:126', 'dc-testament/dc/124')]],
  [
    'x:c:BMV-186-sermon-compare-matthew-5>c:NTC-sermon-mountain',
    'i',
    { from: [c('3 Nephi 12:1–12', 'bofm/3-ne/12')], to: [c('Matthew 5:1–12', 'nt/matt/5')] },
  ],
  [
    'x:c:BMV-052-isaiah-11-righteous-judge>c:OTM-c04-messianic-reception',
    'i',
    { from: [c('2 Nephi 30:9, 11–15', 'bofm/2-ne/30')], to: [c('Isaiah 11:4–9', 'ot/isa/11')] },
  ],
  ['x:c:DCM-dr09-smith-family>c:DCM-dcp-joseph-smith-sr', 's', [c('D&C 4 heading', 'dc-testament/dc/4')]],
  ['x:c:fm-person-christian-whitmer>c:FM05', 's', [c('Testimony of Eight Witnesses', 'bofm/eight')]],
  [
    'x:c:BMV-080-suffering-servant>c:OTM-c04-messianic-reception',
    'i',
    { from: [c('Mosiah 14:1–12', 'bofm/mosiah/14')], to: [c('Isaiah 53:1–12', 'ot/isa/53')] },
  ],
  [
    'x:c:BMV-039-judah-damascus-samaria>c:OTM-r02-ahaz-crisis',
    'i',
    { from: [c('2 Nephi 17:1–9', 'bofm/2-ne/17')], to: [c('Isaiah 7:1–9', 'ot/isa/7')] },
  ],
  ['x:c:DCM-dr09-smith-family>c:DCM-dcp-hyrum-smith', 's', [c('D&C 11 heading', 'dc-testament/dc/11')]],
];
const recs = new Map(m.records.map(r => [r.id, r]));
for (const [id, mode, ev] of rows) {
  const e = m.edges.find(x => x.id === id);
  if (!e) {
    console.log('MISSING', id);
    continue;
  }
  const r = mode === 's' ? G.eligibility(m, id, ev) : G.independentEligibility(m, id, ev);
  console.log((r.ok ? 'ELIGIBLE ' : 'NOT      ') + mode + ' ' + id + (r.ok ? '' : '  — ' + r.why));
  if (!r.ok)
    console.log(
      '   from:',
      (recs.get(e.from).src || []).map(x => x.t).join('; '),
      '\n   to:  ',
      (recs.get(e.to).src || []).map(x => x.t).join('; '),
    );
}
console.log('promoted', m.edges.filter(e => e.grounding).length);
