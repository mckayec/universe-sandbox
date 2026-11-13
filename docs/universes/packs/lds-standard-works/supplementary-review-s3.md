# LDS supplementary checkpoint 3 — bounded NT content audit

Reviewed 2026-11-01. PR33 implementation **7b7a3da6154aceb1e279775a5805e5e287df4194**, baseline **47debcfdb86a3e41a023a30e04c6fcd5bd7209b0**. Accepted supplementary register: **9cc874c09a3686119ca6b4c17c7e16f214fd7ab6**, unchanged from the completed research checkpoint. Previous review: **f7548a50fa945fe44ec1f1cd3a1c825cd259da58**. Main read at **0ebf15e3e61e1875fd97f8262b37bddb0f8dc925** assigns fixing/claude and SC13–34 next. This parallel review was explicitly requested; it does not change ownership or imply a full-stage handoff.

**Verdict: retain the NT import, with four bounded findings covering ten parent rows.** All 187 new parent cards have the expected source/work/layer structure. Seven parent rows still lack required child/reference content; one lacks the accepted AJ05 timing; two need precise copy changes. No additional discrepancy was identified in the other 177 parent comparisons. This is accepted-research conformity review, not fresh primary confirmation of all 187 records or approval of the entire atlas. Claude can continue the OT import while addressing these findings.

## Coverage and reproducible accounting

The [187-row comparison inventory](supplementary-review-s3/comparison.csv) preserves each accepted context, exact built copy, source list and disposition. Category counts are SC08 places 73, SC09 journeys 26, SC10 events 27, SC11 explanatory entries 33, SC12 relationships 28. These are source-view parents, not unique people/events or proof that every required child is implemented.

All **1,271 SD mapping rows** were compared with the accepted metadata; all **1,278 mapping rows** were compared with baseline. Exactly SD0112–SD0298 changed from pending to imported. Totals are **298 imported SD parents + seven prose cards**, **973 pending SD parents**. The 973 count does not include the child-content deficiencies below. Every prior mapping row and all seven prose rows are unchanged.

All **321 pre-existing codex cards** and the entire prior pack outside the new `nt-more` section are deep-equal to baseline. There are now **508 codex cards**. Engine JS/CSS and layer helpers are byte-identical. BXJ12 and SC04.4 fixes therefore carry forward unchanged, as do Salamis attribution, Palmyra's BoM gate, the 169 specified research IDs / 170 primary cards, existing coordinates/routes and prior limitations.

The actual layer helper passes **4,675** new-card single-layer/reading-group combinations, plus 187 all-layer pre-NT exclusions. All new cards use `books:[2]`, `layers:['nt']`, source links, and no coordinates or numeric dates. This does not impose a new within-NT chronology or reinterpret the canon's narrative as established history.

Every accepted row URL is retained; additional URLs are explicitly listed in builder `copy_nt.EXTRA_SRC`. All NT link labels have chapter numbers matching their URL. The current generator, run in a disposable tree against the exact accepted CSV, reproduces both pack and mapping byte-for-byte. The generator checks book labels, not chapter equality itself; the independent audit supplies the latter. Its unused calculated hash is not provenance verification. This review compares the actual accepted metadata and content; it does not claim a summary hash proves source reading.

## S3-C1 — required children/reference payload remain incomplete (seven rows)

**Priority: content completeness before final acceptance.** Builder already raised SD0226, SD0236 and SD0270; the same audit also identifies SD0213, SD0214, SD0238 and SD0240. Current parent summaries generally avoid harmonization, but statements that accounts/lists are “kept” do not expose the required content. Source links alone do not fulfill an explicit child-entry requirement.

| SD / existing parent key | Exact accepted requirement and minimum remediation |
|---|---|
| SD0213 / `NTE-temptations` | Retain Matthew's parent and add the specified `NTE-temptations-luke` source variant, Luke 4:1–13: wilderness, mountain, Jerusalem order. No merged journey or mountain location. The existing sentence correctly distinguishes order but no separately addressable child exists. |
| SD0214 / `NTE-calls-and-healings` | Retain Matthew 8, then expose attributed pericope children from the existing Matthew 9/12, Mark 1–5 and Luke 4–8 chapter ledger. Give each its own locator and source order. “Each Gospel's order ... is kept” presently points to no such content. Gergesenes wording itself is supported in the Church's Matthew 8:28 witness. |
| SD0226 / `NTE-jerusalem-community` | Supply the accepted `NTE-jerusalem-community-4`, `-5`, `-6` children: Acts 4 arrests/address and shared possessions; Acts 5 Ananias/Sapphira and apostolic arrest/release; Acts 6 distribution dispute and seven appointed servants, retaining the ledger's distinctions. Do not count three source episodes as three versions of the temple healing. |
| SD0236 / `NTE-arrest-hearings` | Expose Acts 22–26 source-specific defense, escort and hearing children, retaining Felix/Festus/Agrippa distinctions and the two-year custody interval. Reuse Paul/person/place identities; do not invent a verdict or Agrippa conversion. Parent copy names these topics but does not implement their source-specific entries. |
| SD0238 / `NTC-genealogies` | Retain Matthew 1 and Luke 3 as separately accessible, attributed lineage/reference payloads, with their literal names/predicates and no inferred Mary-line harmonization. Dense graphical genealogy UI need not be built: SC61 permits dense UI deferral, not loss of cited reference payload. The current “kept as separate lists” sentence supplies no lists. |
| SD0240 / `NTC-parables` | Expose the accepted Luke 10/14–16/18–19 and Synoptic pericope references with attributed minimum descriptions from the existing ledger. Preserve fictional settings as nonspatial. “Other parables keep their own Gospel and passage” currently supplies neither those entries nor their passages. |
| SD0270 / `NTC-vision-sequence` | Retain the parent; expose the 15 required nonspatial child groups listed below. A comma-separated topic list is not the specified scene/reference payload. Reuse AP34 for the city/river view; do not duplicate a place or attach symbols to modern enemies. |

SD0270 groups, in source order: Revelation 5 Lamb/scroll; 6 seals; 7 tribes/multitude; 8–9 trumpets; 10 book; 11 witnesses; 12 woman/dragon; 13 beasts; 14 Zion/harvest; 15 sanctuary; 16 bowls/Armageddon; 17–18 Babylon; 19 rider/supper; 20 millennium/judgment; 21–22 AP34 city/river. Each needs a stable mapping, attributed minimal description and its own locator. These are 15 grouped source views, not 15 Earth events with inferred dates.

**Acceptance:** add a reproducible parent-to-child/reference crosswalk with exact source-ledger locations; implement accessible content and source links, `2/nt`, no invented dates/pins; reuse existing IDs where available. Keep imported-parent and completed-child accounting separate. Category rules SC10/SC11 and the seven SD rows already supply the authority; no new owner scope choice is needed. SC55–62's approved dense-display deferrals do not authorize dropping ordinary pericope content. Do not invent a total child count for the broader chapter groups before mapping their actual ledger entries.

## S3-C2 — SD0190 ambiguous antecedent (new copy finding)

Location: `supplementary-build/copy_nt.py:95`, key `NTJ-luke-jerusalemward` and generated pack card. “includes a Samaritan village's refusal, and later returns to it” can imply a return to that village. The accepted row concerns continuing Jerusalem-bound narrative passages.

Replace the description after the existing `New Testament — ` prefix with:

> Luke begins an extended Jerusalem-bound sequence that includes a Samaritan village's refusal. Later passages (Luke 13:22; 17:11; 18:35; 19:1, 28) continue the Jerusalem-bound narrative, including unnamed villages and a healing on the approach to Jericho. This is a literary journey, not a reconstructed continuous road.

Keep current links and `2/nt` gate. Evidence is the existing accepted SD0190 context and chapter-ledger reading, reused rather than claimed freshly reread.

## S3-C3 — SD0260 turns a mapping safeguard into an overbroad textual claim

Location: `copy_nt.py:167`, key `NTC-sanctuary-covenant`. “No location or architecture is given to the heavenly sanctuary” overstates the accepted instruction not to invent coordinates or dimensions. Hebrews uses sanctuary/tabernacle imagery and contrasts handmade sanctuaries with heaven; [Hebrews 9:11–12, 23–24](https://www.churchofjesuschrist.org/study/scriptures/nt/heb/9?lang=eng) was freshly inspected.

Replace only the last sentence with:

> This atlas supplies no Earth coordinate or reconstructed architectural dimensions for the heavenly sanctuary.

Keep the preceding attributed summary and current sources. This corrects the distinction between text imagery and our spatial representation; it does not settle theological interpretation.

## S3-C4 — SD0206 / AJ05 timing is absent, despite the receipt (new verified omission)

Location: `copy_nt.py:111`, key `NTJ-voyage-to-melita`; pack AJ05 `italy-segment` at lines 710–725; Syracuse/Rhegium/Puteoli site notes at lines 397–433. Builder question 6 says AJ05 already carries the timings. The exact pack does not: its route lists stops, and site notes say only stops/continues/stays. The new card's named cross-reference is plain text, not a navigable link.

Minimum fix: append to SD0206 (or an accessible, clearly referenced AJ05 source view) and add Acts 28:12–14 to its sources:

> In the continuation in Acts 28:12–14, the company stays three days at Syracuse. At Rhegium, a south wind follows after one day, and they reach Puteoli the next day. They stay seven days with believers at Puteoli.

This is source-relative duration, not a numeric calendar date, and assigns seven days only to Puteoli. [Acts 28:12–14](https://www.churchofjesuschrist.org/study/scriptures/nt/acts/28?lang=eng) was freshly inspected. Preserve the uncertain Melita identification and undrawn storm track. Correct receipt question 6 and map where the timing is actually retained; no new Earth pin is needed.

## Nine builder readings resolved

| Receipt question | Disposition |
|---|---|
| 1 / SD0115 Bethany | The distinction conforms to the accepted variant-place caution; no asserted beyond-Jordan coordinate. Prefer “kept distinct from the beyond-Jordan Bethany name found in variant textual traditions” if revising, so traditions are not mistaken for a newly verified settlement. The current John 11 link supports the Jerusalem-side village, not the transmission history; that qualification is inherited research, not freshly verified manuscript evidence. |
| 2 / SD0116 Bethphage | Supported: [Matthew 21:1](https://www.churchofjesuschrist.org/study/scriptures/nt/matt/21?lang=eng) associates Bethphage with the Mount of Olives. No precise road or site supplied. |
| 3 / SD0144 Joppa | Accepted shared identity retained without a new pin. “Gated here” is implementation jargon; optional reader wording: “The Acts account concerns the same place called Joppa in the Old Testament; no house or rooftop location is identified.” This is not a new historical-coordinate validation. |
| 4 / SD0186 Mary | Nazareth is supported as the narrative starting context by [Luke 1:26–27, 39](https://www.churchofjesuschrist.org/study/scriptures/nt/luke/1?lang=eng), alongside accepted P06. Preserve unnamed Judaean destination and no Ein Karem assertion. A specific road and a named return destination are not established by this card. |
| 5 / SD0191 John | Supported by freshly inspected [John 10:40](https://www.churchofjesuschrist.org/study/scriptures/nt/john/10?lang=eng). The card does not silently name the earlier baptism location or select a modern Bethabara site. |
| 6 / SD0206 AJ05 | **Not resolved by the existing route. S3-C4.** |
| 7 / SD0214 Gergesenes | Supported in the Church KJV [Matthew 8:28](https://www.churchofjesuschrist.org/study/scriptures/nt/matt/8?lang=eng); preserve attribution to this witness, no automatic harmonization with Mark/Luke or precise town/cliff. Separate child coverage remains S3-C1. |
| 8 / SD0270 Revelation | **Partial: S3-C1.** Fifteen scene groups required; existing parent may remain. |
| 9 / SD0226, SD0236 Acts | **Partial: S3-C1.** Expose the already-required source-specific children. |

## Validation, provenance and rendering limits

Run from a repository containing the pinned commits:

```sh
node docs/universes/packs/lds-standard-works/supplementary-review-s3/probe.cjs
python docs/universes/packs/lds-standard-works/supplementary-review-s3/accounting.py
node --test /path/to/7b7a3da/tests/lds-pack.test.ts /path/to/7b7a3da/tests/atlas-layers.test.ts
```

Saved [probe result](supplementary-review-s3/probe-result.json), [accounting result](supplementary-review-s3/accounting-result.json), [24/24 actual targeted tests](supplementary-review-s3/targeted-tests.txt). Probe uses actual pack/layer functions in Node VM, no DOM/browser/server. During harness development, an incorrect assumption that `row_sha256` hashed stripped context (it hashes original source-row text) and an overrestrictive label regex were corrected; neither was an implementation failure. The passing audit compares the pinned original metadata and generated output. The unchanged coverage, source-witness and reference-disposition validators also pass; the historical 96/256 inventory validator passes against its original c59c9bc checkout, not against this expanded build. Its first invocation lacked the required checkout argument and was corrected. No claim of independently rerunning pnpm build or rendered tests is made.

Primary passages freshly inspected on 2026-11-01: Matthew 21:1; Matthew 8:28; Luke 1:26–27, 39; John 10:40; Acts 28:12–14; Hebrews 9:11–12, 23–24. Their links and narrow conclusions appear above. A John 1 footnote window was also retrieved but did not establish the Bethany variant; it is not counted as confirmation. All other copy comparisons reuse the accepted source register and ledger. No raw copyrighted source captures were uploaded and no full-source reading is inferred from artifact hashes.

Independently inspected the builder's committed 390×844 and 1440×900 S3 screenshots. Phone chooser, Close and source-labelled NT cards are visible; desktop tabs wrap to four rows, consistent with the receipt. Static images cannot establish keyboard, native-select, resize, screen-reader, real-GPU or full-list behavior. Builder reports 98 unit tests, build/check:dist, 13 pages × two viewports, four screenshots, 187 cards, no errors and Escape/focus return; those are builder-reported tests unless separately corroborated above. Prior real-device/native-select gates remain. No prohibited browser/server route was used.

Exact-head implementation CI [41285293411](https://github.com/mckayec/universe-sandbox/actions/runs/41285293411) is **completed success**: build, unit and standalone-pages jobs passed; deployment was skipped. Documentation CI is reported with the published head in the main handoff. Passing CI does not close S3-C1–C4, remaining 973 SD imports, dense-reference retention, final same-head content/technical/rendered gates or owner release decision. Claude retains active fixing ownership and can proceed SC13 onward immediately; return changed content for exact-head recheck. No application change, approval, merge, deployment or release is performed by this review.
