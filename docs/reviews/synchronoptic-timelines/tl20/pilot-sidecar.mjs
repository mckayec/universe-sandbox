// Timeline checkpoint 20: build the PROPOSED-ONLY twelve-row pilot sidecar (review version 1) and its provenance
// manifest revision from the exact bindings in HANDOFF_PLAN.md "2026-11-04 — Twelve-row relationship-source pilot".
// Every row and support item has state "proposed" (row 10 "deferred"). Nothing is accepted, applied or promoted.
// Usage: node pilot-sidecar.mjs <pinned-pack.js> <current-pack.js> <timeline.js> <timeline-grounding.js> <out.json>
import { readFileSync, writeFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import vm from 'node:vm';

const [pinnedPath, currentPath, tlPath, grPath, outPath] = process.argv.slice(2);
const gitBlob = buf => createHash('sha1').update(`blob ${buf.length}\0`).update(buf).digest('hex');
const PACKS = {
  pinned: { commit: '4ea873875f73746a754bd537deaaebb1a58d586b', path: pinnedPath },
  current: { commit: '3e3701ffcc4131200f0993e52f8f14a509016ced', path: currentPath },
};
const MANIFEST_ID = 'lds-standard-works/timeline-pilot';
const MANIFEST_REV = 1;

function load(p) {
  const bytes = readFileSync(p.path);
  const ctx = { URLSearchParams };
  ctx.window = ctx;
  vm.createContext(ctx);
  for (const f of [p.path, tlPath, grPath]) vm.runInContext(readFileSync(f, 'utf8'), ctx);
  const P = ctx.ATLAS_PACKS['lds-standard-works'];
  const model = ctx.AtlasTimeline.adapterFor(P)(P);
  const blob = gitBlob(bytes);
  model.sourceVersion = `${MANIFEST_ID}@r${MANIFEST_REV};pack-blob:${blob}`;
  return { model, G: ctx.AtlasTimelineGrounding, blob };
}
const pinned = load(PACKS.pinned);
const current = load(PACKS.current);
const G = current.G;

const U = 'https://www.churchofjesuschrist.org/study/scriptures/';
const c = (t, p) => ({ t, u: U + p + '?lang=eng' });
const sup = (id, purpose, claim, src) => ({ id, role: 'support', state: 'proposed', purpose, claim, src });

/* [n, edge id, recommendation, mode, claim, scope, basis, src|evidence, supportRequired, support[]] — wording from
   the handoff; nothing here is new research. */
const ROWS = [
  [
    1,
    'x:c:DCM-dcp-shadrach-roundy>c:DCM-dre124k-bishopric-priests',
    'accept',
    'shared',
    'D&C 124:141 names Shadrach Roundy with the bishopric group, conditionally ("if he will receive it").',
    'Conditional assignment only; no acceptance, installation, tenure or succession; verse 141 only, not the 141–142 span.',
    'Shared verse 141 names Roundy with the bishopric and qualifies his participation.',
    [c('D&C 124:141', 'dc-testament/dc/124')],
    false,
    [],
  ],
  [
    2,
    'x:c:DCM-dcp-simonds-ryder>c:DCM-dcp-heman-basset',
    'accept',
    'shared',
    'D&C 52:37 takes what had been bestowed on Heman Basset and places it on Simonds Ryder.',
    'The expressly transferred charge only; no named office, general succession, kinship or identity.',
    'Shared verse 37 supports the existing Ryder → Basset direction.',
    [c('D&C 52:37', 'dc-testament/dc/52')],
    false,
    [],
  ],
  [
    3,
    'x:c:DCM-dcp-peter-whitmer-jr>c:DCM-dre030-whitmer-cowdery',
    'accept',
    'shared',
    'D&C 30:5–7 assigns Peter Whitmer Jr. to accompany Oliver Cowdery.',
    'Companion assignment only; "brother" is not biological kinship; no route completion or missing stop inferred.',
    'Shared verses 5–7 carry the assignment; full names come from the section heading, held as separate support.',
    [c('D&C 30:5–7', 'dc-testament/dc/30')],
    true,
    [
      sup(
        's3-dc30-heading',
        'identity: resolves the full names Peter Whitmer Jr. and Oliver Cowdery',
        'The D&C 30 section heading names Peter Whitmer Jr. as a recipient of the revelation.',
        [c('D&C 30 heading', 'dc-testament/dc/30')],
      ),
    ],
  ],
  [
    4,
    'x:c:DCM-dcp-william-law>c:DCM-dre124e-presidency-patriarch',
    'accept',
    'shared',
    'D&C 124:126 names William Law as a counselor in the Presidency.',
    'Verse 126 only, not the broader 91–97 overlap; no succession or identity with Hyrum Smith.',
    'Shared verse 126 expressly names Law as counselor.',
    [c('D&C 124:126', 'dc-testament/dc/124')],
    false,
    [],
  ],
  [
    5,
    'x:c:BMV-186-sermon-compare-matthew-5>c:NTC-sermon-mountain',
    'accept',
    'independent',
    '3 Nephi 12:1–12 and Matthew 5:1–12 present the beatitudes in the same order; the discourses are compared.',
    'Comparison/context only: not identical quotation, the same event or place; wording, audience and setting differ; direction is navigational, not causal.',
    'Independently paired bodies of both texts; the shared Matthew citation alone does not prove a parallel.',
    { from: [c('3 Nephi 12:1–12', 'bofm/3-ne/12')], to: [c('Matthew 5:1–12', 'nt/matt/5')] },
    false,
    [],
  ],
  [
    6,
    'x:c:BMV-052-isaiah-11-righteous-judge>c:OTM-c04-messianic-reception',
    'accept',
    'independent',
    '2 Nephi 30:9, 11–15 parallels Isaiah 11:4–9 (30:9 ~ 11:4; 30:11–15 ~ 11:5–9) within Nephi’s prophecy.',
    'Only the Isaiah 11 component of the composite target; verse 10 excluded; no harmonized wording; not 2 Nephi 21.',
    'Independently paired passages; Nephi’s framing is 30:1–3, 8, 10, 16–18.',
    { from: [c('2 Nephi 30:9, 11–15', 'bofm/2-ne/30')], to: [c('Isaiah 11:4–9', 'ot/isa/11')] },
    false,
    [],
  ],
  [
    7,
    'x:c:DCM-dr09-smith-family>c:DCM-dcp-joseph-smith-sr',
    'accept',
    'shared',
    'The D&C 4 historical heading names the recipient as the Prophet’s father, Joseph Smith Sr.',
    'This context/identity binding only, not every family-card assertion; Sr. stays distinct from Jr. and Joseph F. Smith; heading is its own component.',
    'Shared editorial section heading of D&C 4.',
    [c('D&C 4 heading', 'dc-testament/dc/4')],
    false,
    [],
  ],
  [
    8,
    'x:c:fm-person-christian-whitmer>c:FM05',
    'accept',
    'shared',
    'Christian Whitmer is a named signatory of the Testimony of Eight Witnesses.',
    'Printed testimonial attribution only; not verification of the narrated event, testing, date, venue or kinship; document bofm/eight, not chapter 0.',
    'Shared document: declaration paragraphs and the signatory list.',
    [c('Testimony of Eight Witnesses', 'bofm/eight')],
    false,
    [],
  ],
  [
    9,
    'x:c:BMV-080-suffering-servant>c:OTM-c04-messianic-reception',
    'accept',
    'independent',
    'Mosiah 14:1–12 represents Isaiah 53:1–12 as quoted by Abinadi (Mosiah 14:1 attributes it to Isaiah).',
    'Represented literary quotation with variants, not byte-identical; Isaiah 53 only, not the target’s Isaiah 9/11; no witnessed events or fulfilment.',
    'Independently paired passages; Abinadi continuity comes from Mosiah 13, held as separate support.',
    { from: [c('Mosiah 14:1–12', 'bofm/mosiah/14')], to: [c('Isaiah 53:1–12', 'ot/isa/53')] },
    true,
    [
      sup(
        's9-mosiah13-abinadi',
        'attribution: Abinadi/discourse continuity into Mosiah 14',
        'Mosiah 13:1–6, 33–35 places the quotation inside Abinadi’s discourse.',
        [c('Mosiah 13:1–6, 33–35', 'bofm/mosiah/13')],
      ),
    ],
  ],
  [
    10,
    'x:c:BMV-020-babylon-quotation>c:OTM-babylon',
    'defer',
    'independent',
    '1 Nephi 20:1–22 (esp. 20:20) parallels Isaiah 48:1–22 (esp. 48:20); 1 Nephi 19:23–24 frames the quotation.',
    'DEFERRED UNCHANGED: the destination cites Isaiah 13:1, Jeremiah 51:59–64 and Ezekiel 17:12 (Babylon context), not the quoted passage; meaning of the edge must be distinguished first. No Lehite visit.',
    'Recorded for completeness; no acceptance is recommended.',
    { from: [c('1 Nephi 20:1–22', 'bofm/1-ne/20')], to: [c('Isaiah 48:1–22', 'ot/isa/48')] },
    false,
    [],
  ],
  [
    11,
    'x:c:BMV-039-judah-damascus-samaria>c:OTM-r02-ahaz-crisis',
    'accept',
    'independent',
    '2 Nephi 17:1–9 and Isaiah 7:1–9 name the same participants, attack and centres: the same crisis referent.',
    'Same crisis referent only, not record equality; not the Immanuel sign (verses 10–14); no dates transferred; no Nephite geography.',
    'Independently paired passages, not shared containment.',
    { from: [c('2 Nephi 17:1–9', 'bofm/2-ne/17')], to: [c('Isaiah 7:1–9', 'ot/isa/7')] },
    false,
    [],
  ],
  [
    12,
    'x:c:DCM-dr09-smith-family>c:DCM-dcp-hyrum-smith',
    'accept',
    'shared',
    'The D&C 11 historical heading identifies Hyrum Smith as the Prophet’s brother.',
    'This identity binding only; verse 1 alone does not identify Hyrum; no additional genealogy.',
    'Both cards cite the D&C 11 heading (shared-heading component).',
    [c('D&C 11 heading', 'dc-testament/dc/11')],
    false,
    [],
  ],
];

const strip = s => s && { edge: s.edge, from: s.from, to: s.to };
const allUrls = new Set();
const rows = {};
const report = [];
for (const [n, id, rec, mode, claim, scope, basis, ev, supportRequired, support] of ROWS) {
  const e = current.model.edges.find(x => x.id === id);
  const pe = pinned.model.edges.find(x => x.id === id);
  if (!e) {
    report.push(`row ${n} MISSING in current pack: ${id}`);
    continue;
  }
  const entry = {
    v: G.REVIEW_VERSION,
    pilotRow: n,
    state: rec === 'defer' ? 'deferred' : 'proposed',
    recommendation: rec,
    from: e.from,
    to: e.to,
    type: e.type,
    label: e.label || '',
    mode,
    claim,
    scope,
    basis,
    sourceVersion: current.model.sourceVersion,
    supportRequired,
    support,
  };
  if (mode === 'shared') entry.src = ev;
  else entry.evidence = ev;
  [].concat(entry.src || [], ev.from || [], ev.to || [], ...support.map(s => s.src)).forEach(x => allUrls.add(x.u));
  const snapNow = JSON.stringify(strip(G.currentSnapshot(current.model, id)));
  const snapPinned = pe ? JSON.stringify(strip(pinned.G.currentSnapshot(pinned.model, id))) : null;
  entry.endpointsUnchangedSincePinned = snapNow === snapPinned;
  entry.binding = G.bindingFor(current.model, id, entry);
  support.forEach(s => (s.fingerprint = G.supportFingerprint(current.model, id, entry, s)));
  const mech =
    mode === 'shared' ? G.eligibility(current.model, id, ev) : G.independentEligibility(current.model, id, ev);
  report.push(
    `row ${String(n).padStart(2)} ${entry.state.padEnd(8)} ${mode.padEnd(11)} mech=${mech.ok ? 'eligible' : 'NOT (' + mech.why + ')'} ` +
      `endpoints-unchanged=${entry.endpointsUnchangedSincePinned} support=${support.length} ${id}`,
  );
  rows[id] = entry;
}

const manifest = {
  id: MANIFEST_ID,
  revision: MANIFEST_REV,
  status: 'proposed — documented provenance for review; not an approval and not a source-reviewed label for the pack',
  sourceVersion: current.model.sourceVersion,
  pack: {
    path: 'public/atlas/packs/lds-standard-works.js',
    boundCommit: PACKS.current.commit,
    boundBlob: current.blob,
    pilotReviewedCommit: PACKS.pinned.commit,
    pilotReviewedBlob: pinned.blob,
  },
  ledger: {
    path: 'docs/reviews/synchronoptic-timelines/tl15/see-grounding.csv',
    commit: '85ccb8eac2df8e07284e60a62933e449a39f28fc',
    blob: 'b4b9f10630eee5ae1ec439e8caaece6819ba299d',
  },
  sources: [...allUrls].sort().map(u => ({
    url: u,
    lang: 'eng',
    publisher: 'The Church of Jesus Christ of Latter-day Saints, official online scriptures',
    edition: 'unknown — the page exposes no immutable edition identifier',
    inspected: '2026-11-04 (ChatGPT pilot reading, HANDOFF_PLAN.md)',
    snapshot: 'live page; no local snapshot or content hash retained',
    contentHash: null,
  })),
  limits: [
    'Current official English online pages as inspected on 2026-11-04; not an original-manuscript, first-edition or historical collation.',
    'Headings are editorial apparatus; front matter is a document, not chapter 0.',
    'A page refresh or any substantive source/pack change needs explicit revalidation; bindings go stale by design.',
    'Twelve rows only: the pack is not source-reviewed as a whole.',
  ],
};

const sidecar = {
  kind: 'atlas-timeline-review-sidecar',
  reviewVersion: G.REVIEW_VERSION,
  pack: 'lds-standard-works',
  state: 'proposed',
  note: 'Proposed only. Bindings and support fingerprints are current-content consistency checks, not authorization. Acceptance needs explicit per-row review; applying this file promotes nothing because no row is accepted.',
  manifest,
  rows,
};
writeFileSync(outPath, JSON.stringify(sidecar, null, 2) + '\n');

/* dry run against the actual module: proposed/deferred rows must never promote */
const res = G.applyEdgeSources(current.model, rows);
console.log(`pinned pack blob ${pinned.blob}  current pack blob ${current.blob}`);
console.log(`sourceVersion ${current.model.sourceVersion}`);
report.forEach(l => console.log(l));
console.log(`manifest sources ${manifest.sources.length}`);
console.log(`dry-run promoted ${res.promoted.length}, rejected ${res.rejected.length}, revoked ${res.revoked.length}`);
res.rejected.forEach(r => console.log(`  rejected eligible=${r.eligible} ${r.id} — ${r.why}`));
console.log('model edges with grounding', current.model.edges.filter(e => e.grounding).length);
