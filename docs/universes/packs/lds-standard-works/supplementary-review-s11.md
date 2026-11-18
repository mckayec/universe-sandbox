# Supplementary checkpoint 11: correction and child-payload audit

Reviewed implementation **620df821c57be8afb86edfd8ae4ef1aab093456b** against **df8b7706d098d0e59202799c6ab430938b03f5d0**, 2026-11-01. Prior audit `6b272ba8344a45a12f6426eb5306db79eccebf40`; accepted disposition/ledger witness `9cc874c09a3686119ca6b4c17c7e16f214fd7ab6`. Main's older checkpoint-10 status is not the review target. Claude retains fixing/claude ownership and its active implementation lock; neither was changed.

**Verdict: substantial correction progress; SD0214 bounded child requirement closes, SD0240 and SD0238 remain open.** All 31 new children and eight changed prior cards reviewed. No new SD row import: **790 imported / 481 pending** remains unchanged. The new cards are 12 SD0214 children, 13 SD0240 children and six SD0785 children. All 31 displayed minimum contexts conform to the accepted ledger or supplied corrections, but that does not establish family completeness.

## Closed corrections and accounting

- **S10-C1 closes:** Dura explicitly modifies the image, with the furnace not separately located; remaining narrative attribution preserved.
- **S10-C2's source-target repair closes:** eight exact superscription chapters, four Song study-note chapters, thirteen animal/instrument chapter examples, and an accurately labelled immutable research-decision link replace book contents URLs. Two source labels need the small S11-C2 correction below; source targets and bounded copy themselves conform. Excluded lexical notes are no longer claimed individually displayed.
- **S10-C3 closes:** all six exact KJV/JST comparisons appear as ordered `1/ot` children, with individual verse labels and no geography. Prior supplied primary checks are reused, not repeated.
- **SC31 receipt count closes:** corrected to 21. Main's lagging status is left to Claude.
- **S3-C1 / SD0214 closes at the requested minimum ledger-child level:** Matthew 9/12, Mark 1–5 and Luke 4–8 are individually accessible, attributed and in source order. The important chronology/name differences survive. This is not certification that every healing in the Gospels is catalogued or all typed links are built.
- **S3-C1 / SD0240 remains open:** 13 new entries conform, but four specific source contexts are omitted (S11-C1).
- **S3-C1 / SD0238 remains open in the application:** no lists are imported. The reported source-access obstacle is resolved here; [builder-ready genealogy payload](supplementary-review-s11/genealogy-handoff.md) supplies ordered names and required predicate/branch safeguards.

[Child comparison](supplementary-review-s11/child-comparison.csv) maps every new child to its parent, accepted context, actual copy and sources. [Changed-card before/after export](supplementary-review-s11/changed-cards.json) covers all eight older cards. [Accounting script](supplementary-review-s11/accounting.py) and [actual pack/layer probe](supplementary-review-s11/probe.cjs) are pinned and reproducible.

All 1,271 SD declarations, hashes and source locations reconcile; their imported/pending states are unchanged. **1,345 mapping rows; 864 imported mappings; 66 children; seven standalone prose cards and one consolidated prose view; 852 supplementary cards.** Eleven SD consolidations and one prose consolidation explain mapping/card differences. Whole pack **1,055 cards / 1,022 unique keyed cards**; **1,016 prior cards unchanged**. No engine/layer, scene, route, timeline or coordinate changes. The generator's new full-HTTPS-URL branch preserves the single research-decision URL exactly; the independent probe permits that exact exception only. Pack and mapping regenerate byte-identically in an isolated temporary directory.

## S11-C1 — finish the specified Synoptic parable references

SD0240's receipt selects chapters largely by what the abbreviated ledger calls a parable. That is insufficient: the ledger explicitly names the vineyard parable in `NT-mark-12`, and its compressed Matthew 21/Luke 8/Luke 20 entries are not exclusions of material in those chapters. This is a limitation of the research summary as well as implementation selection; no claim that all prior ledger prose exhaustively names every episode is warranted.

Add these four nonspatial children under SD0240 in book/chapter order, `books:[2]`, `layers:['nt']`, no location/date/route. Reuse an existing actual equivalent payload if found, documenting its exact key; none is present in this reviewed delta's parable family.

| Proposed key | Minimum attributed copy | Source |
|---|---|---|
| `NTC-parables-matt-21` | Matthew 21 contrasts two sons' responses to their father's request, then tells of vineyard tenants rejecting servants and killing the owner's son. These are separate parables, not mapped estates or additional historical killings. | [Matthew 21:28–32, 33–46](https://www.churchofjesuschrist.org/study/scriptures/nt/matt/21?lang=eng) |
| `NTC-parables-mark-12` | Mark 12 tells of vineyard tenants mistreating servants and killing the owner's beloved son. Mark places the killing before casting him out; keep this account's wording beside the other Gospel accounts without harmonizing the order. | [Mark 12:1–12](https://www.churchofjesuschrist.org/study/scriptures/nt/mark/12?lang=eng) |
| `NTC-parables-luke-8` | Luke 8 gives the sower comparison and its interpretation in terms of hearing and retaining God's word. This teaching is separate from the same chapter's crossing and healings; it does not locate a farm. | [Luke 8:4–15](https://www.churchofjesuschrist.org/study/scriptures/nt/luke/8?lang=eng) |
| `NTC-parables-luke-20` | Luke 20 tells of vineyard tenants rejecting servants and killing the owner's beloved son after casting him out. Preserve Luke's sequence and audience response without treating the story as a mapped event. | [Luke 20:9–19](https://www.churchofjesuschrist.org/study/scriptures/nt/luke/20?lang=eng) |

All four primary passages were retrieved and inspected for this finding. Update the parent's range statement to **“Additional attributed parable views follow in each Gospel's order; story settings are not mapped.”** Avoid implying that a contiguous range represents every chapter. Acceptance: four source-labelled payloads (or exact equivalent crosswalk), all current 13 retained, correct book ordering and gates, no invented coordinates or harmonized tenant sequence. This is a finite completion of the named Synoptic-reference hold, not a new all-parables taxonomy project.

## S11-C2 — match two source labels to their actual edition glosses

SD0789 / `OTW-a27-animal-instrument-notes`: the new labels **“Psalm 29 (study note: wild ox)”** and **“Psalm 92 (study note: wild ox)”** misname the cited gloss. The retained official witnesses inspected in S10 have Psalm 29 **bison, buffalo** and Psalm 92 **buffalo, bison**; Psalm 22 is the one with bison/wild ox. Copy and URLs are already adequate.

Replace only those labels with **“Psalm 29 (study note: bison or buffalo)”** and **“Psalm 92 (study note: buffalo or bison)”**. Keep Psalm 22's wild-ox label. Acceptance: generated sources and mapping locators reflect those exact corrections, with no taxonomic or historical assertion. Evidence: [S10 reused-note metadata](supplementary-review-s10/reused-note-witnesses.json), privately retained `ps-029.json` line 235 and `ps-092.json` line 242; official sources [Psalm 29](https://www.churchofjesuschrist.org/study/scriptures/ot/ps/29?lang=eng), [Psalm 92](https://www.churchofjesuschrist.org/study/scriptures/ot/ps/92?lang=eng). This is a narrow source-label follow-up, not reversal of the successful book-contents repair.

## Five builder questions

1. Chapter containers are acceptable for these bounded ledger summaries; there is no blanket requirement to explode every chapter into extra cards. Each described passage must remain distinguishable and attributed. The twelve SD0214 views meet that minimum. Use the exact pericope locators supplied in S11-C1 for the missing material. Optional improvement: source the Mark 2 comparison additionally to 1 Samuel 21 rather than requiring the reader to infer the comparison source.
2. Do not omit Matthew 21/Luke 8 solely because the ledger's short summary lacks the word “parable”; S11-C1 supplies the actual source evidence. Mark 12 was also missed despite its explicit ledger wording. Luke 20 is a further directly relevant parallel.
3. Mark 4's two views are intentional context facets, not duplicate physical events. Their unique keys, family mapping and nonspatial representation are retained.
4. Mark 5's singular man is correct in this textual witness; Matthew 8's two remain visible in the existing parent. No additional merged count is needed. The different Jairus-request/death-news ordering remains explicit.
5. The animal examples are explicitly bounded and the fuller accepted research is preserved; dropping unsupported-in-this-card serpent/bird examples is acceptable. Do not claim the retained examples exhaust the edition. Apply S11-C2's precise labels.

## Source-access resolution for SD0238

The official Matthew 1 and Luke 3 pages were accessible in this audit environment. Relevant lineage passages were read, and compact source-order name payloads were transcribed into [Matthew CSV](supplementary-review-s11/matt-genealogy-names.csv) and [Luke CSV](supplementary-review-s11/luke-genealogy-names.csv). The [handoff](supplementary-review-s11/genealogy-handoff.md) specifies Matthew's side branches and changed ending predicate, Luke's qualification and repeated-name safeguards. A retained fallback independently checks each verse's name order; it is not substituted for the primary witness. No fabricated new capture hash or claim of Claude's successful access is made.

Forty main-chain occurrences through Joseph in Matthew and 77 occurrences including Jesus/God in Luke are **reference-payload counts**, not counts of proven historical generations or implemented records. Matthew's additional named branches and ending are supplied separately. The source payload is complete for this bounded handoff; application import and exact-head recheck remain required. Dense graphical genealogy UI may remain deferred under the existing rule, but these reference lists may not be silently omitted.

## Validation and remaining gates

Locally observed **32/32 targeted tests**, **975 actual helper gate combinations**, **27 pre-NT all-layer exclusions**, unique-key/nonspatial checks, source exception constraint, child ordering and complete remaining-pack regression. Isolated generator output matches both published outputs. Three standing coverage/source-witness/reference validators pass; they are integrity checks, not renewed canon certification.

New primary retrieval this turn covers the four missing parable passages plus Matthew 1/Luke 3 lineage passages. Other 31 child comparisons reuse accepted ledger/source evidence and S10's directly supplied wording. No full-canon reread or all-Gospel-pericope certification is claimed. The two source-label corrections reuse actual retained captures already inspected, not freshly retrieved chapters.

Builder reports pnpm check 106/106, dist and 13 pages × two viewports. No new screenshot is included at this head; no final-head rendered claim follows from earlier captures. No local browser, server, DOM workaround or full pnpm check was run. Final native-select/keyboard/real-GPU and same-head technical/rendered/owner-release gates remain open. Implementation CI 41319350710 was running during drafting; terminal outcomes are recorded in the main handoff.

Claude may implement the four parable contexts, two source labels and supplied genealogy payload while continuing **481 pending SD rows** (SC35–45: 417 D&C rows, then SC46–54). Keep fixing/claude ownership. Q03 schematic remains approved; separate archaeology/LiDAR artifacts do not block Earth corrections. No code/status/lock change, PR approval, merge, deployment, release or premature supplementary closure.
