# Supplementary checkpoint 18: DD001–DD070 and S17 fixes

Implementation **e1d56505d17425128364dd75a1faa09ccc2f57ca**, baseline **1b55cc853c11a86340a3baf21913bc311ddfbadc**, accepted register **9cc874c09a3686119ca6b4c17c7e16f214fd7ab6**, prior review **58328be138db4fa3ccf941048a7cd057ef5291c3**. This parallel audit preserves Claude's fixing ownership and code. No stage transition or release approval.

**S17-C1/C2 close.** Actual generated descriptions match the supplied dialogue correction and Emma sentence. All three optional improvements also landed: Sarai's Genesis link, Cain's offering-comparison context, and section 88 heading-level date attribution. The Sarai child remains `5/pgp`, and the other corrected views remain `4/dc`. DD007 independently uses the corrected speakers rather than reintroducing the old shorthand.

**New tranche: 70/70 dossier rows compared; 66 have no new minimum-copy finding, four require the three dispositions below.** The [70-row inventory](supplementary-review-s18/row-comparison.csv) includes each accepted matrix context, its full accepted coverage-ledger row and the actual generated copy. These are source-reference cards, not 70 independently corroborated historical events. No new child cards were added.

## S18-C1 — distinguish section 52 pairs from the larger party

**SD1123 / DD052 / DCM-dd052-missouri-companions.** The list begins “Pairs:” but includes “Edward Partridge and Martin Harris to join Smith”. The existing SC41 DRE052b card correctly treats them as joining Smith and Rigdon's party, not an additional independent pair. [D&C 52:24](https://www.churchofjesuschrist.org/study/scriptures/dc-testament/dc/52?lang=eng&id=p24#p24) names that larger party. The new dossier must preserve the distinction.

Minimal changes in `copy_dd.py`, followed by regeneration:

- Replace **“Pairs:”** with **“Assignments include:”**.
- Replace **“Edward Partridge and Martin Harris to join Smith”** with **“Edward Partridge and Martin Harris to travel with Joseph Smith and Sidney Rigdon as one party”**.
- Preserve all other named assignments, the Detroit-only qualifier for Murdock/Hyrum, the eastern assignment and the final instruction-versus-completed-itinerary limit. Do not infer a fourteenth independent pair.

Acceptance: no list heading categorizes every item as a two-person pair; the four-person party agrees with the already-reviewed DRE052b view. This is an ambiguity introduced by expanding the ledger's compact list, not a new missing primary source.

## S18-C2 — keep promised or commanded actions distinct from completion

Two cards expand compact research wording into unqualified action statements. The mandatory SC44 disposition explicitly retains commands/proposed missions as unfulfilled unless evidence records completion. Preserve this distinction even within document summaries.

**SD1107 / DD036 / DCM-dd036-edward-partridge:** replace **“Edward Partridge is called and Sidney Rigdon lays hands on him; instruction on priesthood and mission.”** with:

> Edward Partridge is called to preach; verse 2 promises that the Lord will lay his hand on him through Sidney Rigdon and that he will receive the Holy Ghost. The section gives priesthood and mission instructions.

[D&C 36:1–2](https://www.churchofjesuschrist.org/study/scriptures/dc-testament/dc/36?lang=eng) uses prospective language; it does not date a completed laying-on-of-hands act. Keep the date, location, source and existing boundary against inferring an office.

**SD1125 / DD054 / DCM-dd054-colesville-onward:** change the title to **“Section 54: The Colesville migrants directed onward”**. Replace **“Newel Knight leads the Colesville migrants after the agreement for Leman Copley’s farm breaks down, and they leave for Missouri.”** with:

> The heading identifies Newel Knight as leader of the community at Thompson after Leman Copley's farm agreement broke down. The revelation commands that community to leave the farm and journey to Missouri; it does not itself record their completed departure or arrival.

[D&C 54 heading and 7–9](https://www.churchofjesuschrist.org/study/scriptures/dc-testament/dc/54?lang=eng) supplies the command and setting. Keep the failed-settlement boundary and distinguish the document at Kirtland from the addressed Thompson community. Existing DE15 already says “directed”; no extra journey or date is necessary.

Acceptance: neither card presents its cited instruction/promise as proof of execution. These refinements also supersede the respective ledger shorthand for future implementations. Preserve the original register/hash provenance; do not silently rewrite historical accepted hashes.

## S18-C3 — make DD070's retained named roles discoverable

**SD1141 / DD070 / DCM-dd070-publication-stewards** says only that stewards are appointed and points to Hiram and the general publication explanation. The matrix explicitly requires named roles retained in DD; accepted DRE070 (`coverage-dc.md:626`) resolves six names. They already exist in **SD1060 / DCM-de17-publication-stewards, “Revelation publication assigned”**. This is an integration gap, not six missing person records or a need for fresh biography.

Either add that exact existing card title to the dossier's See-also references and verify the target, or insert this source-supported sentence:

> Section 70:1–5 names Joseph Smith Jr., Martin Harris, Oliver Cowdery, John Whitmer, Sidney Rigdon and William W. Phelps as stewards of the revelations and their publication.

[D&C 70:1–5](https://www.churchofjesuschrist.org/study/scriptures/dc-testament/dc/70?lang=eng) supports the list. Reusing the existing view is sufficient; do not create another identity or count the same role payload twice. Retain the distinction between stewardship and ownership of every manuscript. Acceptance: the dossier visibly names or explicitly directs the reader to all six assigned stewards. Merely marking DD070 imported is not this consolidation evidence.

## Six builder readings and scope limits

1. **Place codes without their own card:** retaining a named source setting without inventing a point is correct. Textual names are not clickable relationships. DD013 may refer to the existing Harmony site without creating a new forest coordinate. Omitted specialized cross-links remain part of final integration accounting, not automatically implemented edges.
2. **Full names:** expanded names match the accepted earlier participant/companion records; no new person identity is needed here. Presence of a string elsewhere in the pack is only a mechanical reuse check, not proof of identity by itself. Maintain the accepted name-resolution evidence. DD052 needs S18-C1 despite all its names being present.
3. **DD007:** correct; S17's actual speaker distinction is retained.
4. **DD032/049/057:** endpoints, Shaker site uncertainty and town-versus-temple distinctions remain explicit. No new coordinate precision is warranted.
5. **Named roles:** the ledger is a screening summary, not an exhaustive replacement for the matrix plus resolved roles. DD070 is a concrete case requiring explicit consolidation (S18-C3). No claim that every possible role in all 70 bodies was newly re-extracted follows from this review.
6. **DD072:** remains pending. Its three-part content and regional offices must arrive with the next tranche; neither the old summary nor these 70 imports close it.

The section 27 two-stage writing context and section 42 two-part dates agree with the current official headings. DD060's St. Louis/Cincinnati instructions do occur in section 60:5–8; no extra section 61 citation is needed for those claims. Its funding sentence stays in the surrounding instruction context; for consistency, **“Edward Partridge is directed to supply travel money”** is a useful optional refinement. No claim of completed transport is authorized. Other mandates summarized in historical present must remain read within their explicitly stated instruction boundaries.

## Evidence and reproducible validation

Fresh official-page checks on 2026-11-01 inspected D&C **36:1–2; 52:3–10, 22–38; 54 heading/7–9; 60:5–11; 70:1–5; 27 heading; 42 heading**. Seven targeted pages, not seven newly completed full-section readings. All 70 dossiers were compared to the accepted matrix and coverage-ledger content, with prior role/source research reused. S17 fixes use already-read evidence. No raw captures or invented source hashes are committed. Official text/heading claims are distinguished from independent historical corroboration.

Run from a checkout containing the pinned commits:

```sh
node docs/universes/packs/lds-standard-works/supplementary-review-s18/probe.cjs
python docs/universes/packs/lds-standard-works/supplementary-review-s18/accounting.py
```

[Probe](supplementary-review-s18/probe-result.json): 70 added cards, five changed prior cards, **1,339 unchanged prior cards**. All other pack data and engine JS/CSS/layer functions are identical to baseline. Each new dossier has the correct numbered-section title and one matching official section URL; no fabricated coordinates or date fields. **1,875 work/layer combinations and 225 pre-D&C all-layer exclusions pass**, including the unchanged PGP child gate. There are **1,414 total cards / 1,381 unique keyed cards**, with 353 in `dc-more`.

[Accounting](supplementary-review-s18/accounting-result.json): all 1,271 SD rows reconcile to accepted location/declaration/hash metadata; prior SD mapping rows remain unchanged. All imported/consolidated targets resolve. The source-only generator reproduces both pack and mapping byte-for-byte. Its new `PARTIAL={'SC45'}` behavior leaves unsupported rows pending instead of falsely marking the whole category imported; the existing-title assertions pass.

- **1,141 imported / 130 pending SD rows:** SC45 70 (DD071–DD138 and both Official Declarations), then SC46 16, SC47 13, SC48 11, SC50 9, SC52 3, SC53 4, SC54 4.
- **74 children**, seven standalone prose cards and one consolidated prose mapping; **1,353 mapping rows, 1,223 imported mappings, 1,211 distinct supplementary cards**. Import counts do not close findings, prose-only categories, timeline behavior, typed links or identity/vision integration.
- **38/38 local exact-implementation tests passed** (`lds-pack.test.ts`, `atlas-layers.test.ts`); [output](supplementary-review-s18/unit-results.txt). Coverage, source-witness and reference-disposition checks pass; outputs retained. These validate ledger/capture/reference integrity, not new canon reading.
- Implementation [CI 41350672568](https://github.com/mckayec/universe-sandbox/actions/runs/41350672568) was running at report preparation; terminal implementation/review results belong in the main handoff.

## Supplied rendering and next handoff

Inspected supplied `s18-codex-dc-more-390x844.jpg` pixels: section 1 and the start of section 2 display wrapped dossier text/source links without apparent horizontal overlap. This sample does not show the corrected or flagged cards. The other three supplied sizes were not independently inspected here. Builder reports SwiftShader/CDP, four sizes, 112 tests, distribution and 13 pages twice; keep that report distinct from independently executed probes and observed CI. Reported readiness time of 121–347 seconds does not establish responsive native interaction. No reviewer browser, DOM or server was run.

Claude: apply S18-C1/C2 and the S18-C3 consolidation while continuing the remaining 70 dossiers and later 60 rows. Keep required prose and exact source context. Return the changed head for recheck; final same-head native-select/keyboard, real-GPU, rendered/technical and owner-release gates remain. Q03 remains approved; separate archaeology/LiDAR artifacts do not block these corrections. No code/status/lock change, PR approval, merge, deployment or release by this review.
