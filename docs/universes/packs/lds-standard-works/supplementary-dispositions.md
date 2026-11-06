# Supplementary retention and implementation dispositions

2026-10-31. Accepted research is the preserved 62-category inventory in `supplementary-accounting.md`; primary specifications now cover all 160 originally omitted/partial primary IDs. Implementation reference remains PR33 `5a9711eb2676e0b421fb093211fc0be97ae2b368`. These are **research-side retention/consolidation decisions**, not a claim of 1,271 newly verified facts or implemented records.

## Completed disposition scope

[Category dispositions](supplementary-dispositions/category-dispositions.csv) provide explicit, family-specific builder requirements for all **62 categories**: 54 bounded Markdown sections retained and eight dense CSV families subject to the existing display-only deferral. [Declaration dispositions](supplementary-dispositions/declaration-dispositions.csv) resolve all **1,271 table source-view declarations** to an action, exact accepted text/locator/hash, work gate policy, source-resolution instruction and required builder response. Five prose-only sections remain mandatory bounded content; they do not disappear for lack of rows. All prose surrounding tables is also retained as constraints.

This closes the *research-side disposition backlog for this accepted inventory*: nothing is silently rejected, no additional deferral is invented, and every listed category has an actionable requirement. It does **not** close record-by-record build conformity, unresolved historical identifications or all possible future corpus research. The declaration inventory is deliberately a source-view ledger; it is not a deduplicated entity roster. Nineteen rows directly re-declare primary IDs, and 16 rows match IDs in the 169-view specification union. Those overlapping measures must not be added to a universe content count.

The [rule table](supplementary-dispositions/category-rules.tsv) contains substantive category decisions; [reproducer](supplementary-dispositions/build-dispositions.py) verifies all original section/row hashes, expands the decisions without changing source text and retains the original source predicates/qualifiers. Hash agreement proves repository provenance only. No new primary reading or individual fresh truth certification is claimed in this pass; accepted source audits and their limitations remain controlling.

## Binding builder dispositions

| Families | Required delivery, not optional omission |
|---|---|
| SC01–07 BoM | Retain all supplementary place, journey, event, people and explanatory source views as nonspatial content. Reuse established identities such as Irreantum and the Jaredite settings, while keeping homonyms and actor-specific journeys distinct. Custody, parentage, office and descent are different predicates. Ether son/descendant and spelling tensions remain visible. |
| SC08–12 NT | Reuse supported OT base identities but gate NT claims separately. Keep Gospel-specific event children, attributed journeys, epistolary/visionary entries and typed relationships. A shared place or parallel account is not permission to harmonize chronology. |
| SC13–34 OT | Retain structured place/person/journey/explanatory families and apparatus constraints. Legal, poetic, prophetic and visionary content stays source-labelled; it need not become Earth geometry. Apparatus and JST comparisons are reference constraints, not extra events or a claim of complete JST coverage. |
| SC35–45 D&C | Retain place settings, events, journeys, teachings, resolved people and typed relationships. Preserve commanded versus completed actions, document versus event dates, ancient versus modern identities and the two DE06 dates. All 140 dossier rows remain accessible; a dash means no additional specialized event, not deletion of the dossier. Unresolved people retain source wording rather than guessed identities. |
| SC46–49 PGP | Retain QG families, all Articles of Faith subviews, source-specific people/material details and JS–History prose. Consolidate PC/PE/PP identities rather than counting duplicates. The reported failed silver-mine search and relayed Harris testimony may not be dropped to simplify the narrative. The Cowdery reminiscence remains retrospective apparatus, not verse 76. |
| SC50–51 front matter | Consolidate the existing nine FM specifications; enforce neutral witness/Palmyra visibility at group 3 while gating D&C/PGP details at 4/5. These are not nine further new entities. |
| SC52–54 geography | Retain the three attributed model summaries and criticism without endorsement or drawn model geometry. Reuse Arabian and Jaredite source identities, keeping Nahom burial distinct from death location and Shelem's excursion distinct from the company voyage. Owner archaeology/LiDAR artifact review remains a separate evidence dependency. |
| SC55–62 dense payloads | Apply only the already accepted A04/Q04/RR06 display deferral. Preserve cited payloads and essential people/place/relationship facets. Do not delete their evidence, count overlapping rows as unique entities, or infer uniformly biological chains. |

“Retain as reference” means a cited, discoverable source view in the atlas/content handoff, with a concrete builder target. For ordinary SC01–54 material it is **not** satisfied by saying the research exists somewhere in GitHub while removing its substantive content from the product. Current codex source cards can carry nonspatial content; separate specialist graph UI is not a prerequisite. Compact consolidation is permitted when it preserves all required meaning, sources and gates. Display-only dense deferral allows the specifically named payloads to remain cited research/reference material without thousands of default map/codex objects; essential relationships are not thereby deferred.

## Precise implementation contract

For each SD row, Claude supplies a target runtime card, episode/source facet, person/relationship record, or specifically named retained reference section. Multiple SD rows may share one target only with a per-row mapping and retained distinctions. Source rows containing several people or statements may require multiple facets; SD identifiers are audit handles, not proposed engine IDs. No automatic slug matching or shared spelling proves identity.

Each row carries its full accepted content and source locators. Where the row cites a source key or verse range instead of a direct URL, resolve it through the original section, accepted source register and chapter ledger before publishing a link. A regex URL extraction is a convenience, not proof of citation completeness. Keep source access limits and distinctions between text, editorial apparatus, institutional teaching, historical synthesis and proposed geography. Do not infer absence of support merely because the URL column is empty; do not fabricate a source when resolution is uncertain.

Work gates in the category rules are defaults for the *claim*, not a license to override a more precise accepted source gate. Neutral shared identities use the earliest supported appearance; later source-specific relationships retain their later work/layer. Apparatus cross-references do not unlock later scripture early. No new coordinates, date conversions, routes or kinship edges arise from these dispositions.

## Deferred, rejected and unresolved evidence

- **Eight approved display deferrals only:** SC55–62. Authority is `research-addendum.md` A04/Q04/RR06, not a new owner decision. Their file names and exact hashes are in the category CSV. No new rejection of accepted research was made.
- **Unknown real-world identification:** retain nonspatial text; no missing coordinate blocks an attributed reference card. Naming a proposed archaeological parallel is not identity evidence.
- **Source-sensitive aliases, genealogy, apparatus and actor ambiguities:** retain the accepted wording and non-merge constraints. They block stronger assertions, not the conservative reference view.
- **Model precision and owner's three comparison artifacts:** existing access/provenance limitations remain. Those block endorsement or reconstruction of the optional archaeology/LiDAR comparison, not these minimum source views or current Earth corrections.
- **Current build coverage:** intentionally not certified by this disposition pass. Claude's mapping/import work, ChatGPT exact-head copy/gate verification, technical/rendered checks and owner release approval remain required. There is no newly identified primary-source access blocker to the conservative retained content.

## Validation

Run the existing primary specification generators and historical 96/256 validator, the preserved `content-audit/supplementary-accounting.py`, and `supplementary-dispositions/build-dispositions.py`. The new primary generator proves that the 13-ID remainder is exhausted; the supplementary validator proves all 62 category decisions and 1,271 original declaration rows are retained with exact source provenance. Neither proves historical truth or rendering. Preserve prior audit files rather than rewriting their baseline counts to appear current.
