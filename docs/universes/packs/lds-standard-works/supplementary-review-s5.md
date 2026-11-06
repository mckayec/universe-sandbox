# LDS supplementary checkpoint 5 — corrections and child-view recheck

Reviewed 2026-11-01 at PR33 **6067a78b1da53224026f7cd8ae0273a36c7f54b5**, against **665f82590881ee8664b70bb88543e71a0965b7d1**. Prior review: **f571cb96d3aa06a947a98aeec8e52348574d6c0c**; accepted source register/ledgers: **9cc874c09a3686119ca6b4c17c7e16f214fd7ab6**. Main status read at `d03abe4` retains **fixing/claude**, welcomes this parallel recheck and assigns SC18–34 next. Commit ancestry/content, not inconsistent API timestamps, determine the comparison. Repository guidance was reread; no relevant checkout `.agents/skills` files were found. Claude's code, status and lock state were not changed.

**Verdict: S3-C2–C4 and all S4-C1–C4 close at source/data level. S3-C1 is partially resolved.** Its SD0213, SD0236 and SD0270 child families now meet the bounded accepted requirements. SD0226 has all three children, with one small retained-context gap below. SD0214, SD0238 and SD0240 remain unimplemented as the builder discloses. This is substantive remediation progress, not full supplementary/canon/technical acceptance.

## What changed and what was checked

- **17 existing parent cards changed**, each compared with the prior required/optional correction. All required wording and source additions are present; seven optional reader improvements are applied. [Before/after inventory](supplementary-review-s5/parent-corrections.csv).
- **25 child views added**, each compared with its accepted chapter-ledger or review context, source list, gate, mapping and placement: one Luke temptation variant; three Acts 4–6 children; five Acts 22–26 children; 15 Revelation groups; one complete Numbers 33 stage list. [25-row child comparison](supplementary-review-s5/child-comparison.csv): **24 conform to the accepted context; one is partial** for the specific omitted context below. This is reused-research comparison, not 25 newly read primary texts.
- **668 prior cards are unchanged**. Removing the 25 children and restoring the 17 changed parent payloads makes the entire pack deep-equal to baseline. Total **710 codex cards**, **677 unique keyed cards**. Sites, coordinates, dates, routes, primary 169-ID / 170-card mapping, Salamis provenance, Palmyra BoM gate and prior BoM corrections carry forward unchanged.
- **No new SD parent imports:** all 1,271 SD rows reconcile with accepted metadata, still **475 imported / 796 pending**, plus seven prose rows and now 25 separate child rows. Mapping total **1,303 rows**, including **507 imported mapping rows**. Child rows are not new SDs or new historical entities. The 315 remaining OT SD parents within SC18–34 are still pending. Child deficiencies remain additional work beyond those counts.
- Only four parent mapping rows change, all locator strings: SD0206, SD0311, SD0354 and SD0441. The seven prose rows are unchanged. NT now has **187 parents + 24 children = 211 cards**; OT history has **177 parents + one child = 178 cards**. The receipt's SC17 count is corrected to 18.

## Closed findings and exact disposition

| Finding | Disposition at 6067a78 |
|---|---|
| S3-C2 / SD0190 | Closed. The continuation refers to Luke's Jerusalem-bound narrative, not a return to the refusing village. Prior replacement applied. |
| S3-C3 / SD0260 | Closed. The limitation is now on the atlas's coordinates/reconstructed dimensions, not a denial of heavenly-sanctuary imagery in Hebrews. |
| S3-C4 / SD0206 | Closed. Syracuse three days; south wind after one day at Rhegium; next-day arrival at Puteoli; seven days at Puteoli are all retained on the voyage card. Acts 28 source label includes 1, 12–14. The new receipt explicitly corrects its earlier assertion that AJ05 already held the timings. AJ05 itself is unchanged; the source view supplies the required context. |
| S4-C1 / SD0300, SD0311 | Closed. Eden is conceptual reuse, not asserted geographic equivalence; Ibzan's Bethlehem remains unassigned rather than a third identified town. Joshua 19:15 and Judges 12:8–10 citations are added. |
| S4-C2 / SD0443, SD0468 | Closed. `OHJ-12-stages` retains the **entire accepted ordered sequence**, checked segment by segment, final camp extent and Deuteronomy distinction. The six Joshua 20 refuge cities and their source contexts are now named. No new route or pin is created. |
| S4-C3 / SD0395, SD0441 | Closed. Hobab's literal source wording replaces a promise to preserve it; Zipporah/family participation and the unstated separation point are explicit, with Exodus 18:2–6 added. |
| S4-C4 / SD0424 | Closed. The card distinguishes Israel's Ahaziah's regnal synchronism from Judah's Ahaziah's stated age 22, without inventing an age for the former. |

These closures reuse the targeted primary evidence and exact replacements in [S3](supplementary-review-s3.md) and [S4](supplementary-review-s4.md); no repeat full-corpus reading is claimed. Optional changes to Bethany, Joppa, Kirjath-jearim, Olivet, Boaz, Bath-sheba and Habor/Gozan match those reviews. The Kirjath-jearim comparison adds its 1 Chronicles 13:5–6 source. No broader modern geographic identification follows.

## S3-C1 child coverage: three parents closed, four still open

| Parent SD | New content | Disposition |
|---|---|---|
| SD0213 | `NTE-temptations-luke` | Closed for the specified child requirement. Luke's wilderness/mountain/Jerusalem ordering remains separate from Matthew; no merged road or mountain pin. |
| SD0226 | `NTE-jerusalem-community-4`, `-5`, `-6` | Acts 4/5 conform; Acts 6 retains the distribution dispute, seven, Philip distinction and false-witness attribution. **Partial for the Nicolas/origin context below.** All three child objects exist. |
| SD0236 | `NTE-arrest-hearings-22` through `-26` | Closed for the specified children. Retellings stay source-specific, citizenship wording and participant changes remain, Felix/Festus/Agrippa are separate, two-year custody is relative, and Agrippa is not said to convert. No inferred release or journey back to Jerusalem. |
| SD0270 | `NTC-vision-sequence-01` through `-15` | Closed for the 15 specified nonspatial groups. Correct source order and chapter links, attributed JST distinction, no modern symbolic enemy/geography identification, and AP34 is reused through the named existing city view. |
| SD0214 | No new pericope children | Open. Matthew 9/12 and Mark 1–5/Luke 4–8 attributed pericope coverage remains required. |
| SD0238 | No literal lineage payload added | Open. Retain separately attributed Matthew 1 and Luke 3 lineage/reference payloads without Mary-line harmonization. Dense graphical UI is not required. Builder says literal names need official-text reading; do not label that completed. |
| SD0240 | No new pericope children | Open. The accepted Luke 10/14–16/18–19 and Synoptic parable entries remain required, with fictional settings excluded from pins. |

The Acts 4 child preserves Barnabas's Cyprus association without locating his sold land there. Acts 5 retains Gamaliel's chronology as attributed speech. Acts 22/26 retain their wording alongside Acts 9 rather than harmonizing hearing/falling details. Acts 23 distinguishes the infantry's return and the commander's letter from narrative order. These are comparisons with already accepted ledger evidence, not claims of freshly verifying every verse this turn.

### Small remaining SD0226 context requirement — exact addition

Accepted `coverage-nt.md:140` / `NT-acts-6` explicitly includes **Nicolas as an Antioch proselyte** and the rule that **synagogue origins are not routes**. The new Acts 6 child omits those facets. The existing `NTR-seven` card already lists all seven names and distinguishes Philip, so do not duplicate those biographies or build another seven-person group; it also lacks the Antioch facet. The omission is narrower than the previous missing-child finding and is not a factual error in the retained sentences.

Append to `NTE-jerusalem-community-6` (or retain the Nicolas clause on `NTR-seven` with an explicit consolidation pointer):

> Acts 6:5 describes Nicolas as a proselyte of Antioch. The regional labels for participants in the dispute in Acts 6:9 are not a narrated journey by Stephen.

[Acts 6:5, 9](https://www.churchofjesuschrist.org/study/scriptures/nt/acts/6?lang=eng) was freshly inspected for this finite check. Keep the current chapter link, `2/nt`, no new coordinate or travel leg. Acceptance is the visible attributed facet and source distinction, not another child count. This explains why the review leaves **four S3-C1 parents open**, whereas the builder receipt lists only the three larger unimplemented families.

### Revelation appendix distinction

`NTC-vision-sequence-07` clearly separates the JST woman's church identification and 1,260 **years** from KJV **days**, links both witnesses and avoids a modern date. The official [JST Revelation 12:5, 7](https://www.churchofjesuschrist.org/study/scriptures/jst/jst-rev/12?lang=eng) was freshly inspected; the KJV contrast and accepted apparatus relationship reuse `NT-rev-12` / `NTX-revelation-woman-time`. This is an attributed Bible-appendix comparison within the accepted `2/nt` source view, not an unlabeled KJV quotation or a new historical migration claim.

## Generator, ordering, gates and regression evidence

Builder `CHILDREN` entries are emitted immediately after their parent (then previous sibling), inheriting the parent's tab, book and layer. Each child gets an empty SD field, `source_location=child of SDnnnn` and the parent's card key as `research_declaration`. The independent accounting script checks **all 25** parent/sibling positions in both runtime list and CSV, category/gate equality, exact source payloads, unique keys and parent existence. It also confirms the new modules' child dictionaries do not collide at this head. No person/event count is inferred from child objects.

The whole accepted Numbers 33 sequence is compared to the retained ledger's arrow-delimited segments; testing only four sample stops would not establish completeness. The full sequence, the final Beth-jesimoth–Abel-shittim extent and the separately attributed Deuteronomy order remain. An unchanged primary AJ01 route is not silently extended through unknown places.

Re-running the generator in a disposable tree against the pinned accepted CSV/OT ledger reproduces the pack and all 1,303 mapping rows byte-for-byte. Source/application checkouts are untouched. Engine JS/CSS and layer helpers are byte-identical to baseline. Thus the new flat cards use the existing source display and filtering; they do not introduce a new interactive child-tree feature.

Actual pack/layer functions in a Node VM pass **1,050 affected-card gate combinations** (17 changed parents + 25 children), **29 all-layer pre-NT exclusions**, undated/nonspatial assertions and key uniqueness. OT is the first reading group; no artificial pre-OT group is used. **26/26 targeted unit tests** pass. Saved artifacts:

- [Probe and result](supplementary-review-s5/probe.cjs), [JSON result](supplementary-review-s5/probe-result.json).
- [Accounting/generator script](supplementary-review-s5/accounting.py), [JSON result](supplementary-review-s5/accounting-result.json).
- [Changed parent inventory](supplementary-review-s5/parent-corrections.csv), [child source comparison](supplementary-review-s5/child-comparison.csv), [targeted test output](supplementary-review-s5/targeted-tests.txt).

Reproduce from a repository containing the pinned commits:

```sh
node docs/universes/packs/lds-standard-works/supplementary-review-s5/probe.cjs
python docs/universes/packs/lds-standard-works/supplementary-review-s5/accounting.py
node --test /path/to/6067a78/tests/lds-pack.test.ts /path/to/6067a78/tests/atlas-layers.test.ts
```

One initial harness comparison used cross-VM array prototypes and failed despite equal contents; it was normalized before recording passing results. This was a harness issue, not an application defect. Source/context inventories establish traceability, not full-primary reading or historical truth. Only Acts 6 and the JST Revelation 12 passage were newly inspected this turn; other source evidence is reused.

## Rendered evidence and remaining gates

Four of the six committed S5 images were inspected: OT 390×844, OT 1440×900, phone Numbers 33 list and phone Revelation children. They visibly show the compact phone chooser, OT cards with source labels, the full long itinerary and ordered Revelation cards. Desktop tabs now occupy five rows; keep that layout in the final same-head technical pass as more families arrive. No clipping failure is established from these static captures.

The earlier **absence of an OT-tab capture is resolved as a documentation/evidence gap** by these supplied images. It is not final rendered acceptance. The receipt says screenshots preceded the five Acts 22–26 children, which change NT only; they do not certify those children's rendering or a complete same-head interaction pass. The receipt revises its earlier stall diagnosis to pointer-click waiting on a busy SwiftShader page, reports DOM-click captures and 37–84-second readiness, and keeps native-select/keyboard/real-GPU gates open. That diagnosis/timing remains builder-reported; ChatGPT did not run a browser/server, issue DOM clicks, or use an alternate preview route. A DOM click and static capture do not substitute for keyboard or native-select testing.

Builder reports pnpm format/check, 100 unit tests, check:dist and standalone pages. Independent local verification here is limited to the explicit Node/Python checks above; remote exact-head CI [41292347678](https://github.com/mckayec/universe-sandbox/actions/runs/41292347678) and the published review's CI are followed to terminal and recorded in the main handoff. No CI pass supersedes the remaining content or rendered gates.

**Next:** Claude applies the small SD0226 addition, completes the three larger S3-C1 families and continues the 796 pending SD imports (SC18–34 next). No new owner decision or source-access block prevents the small addition. Preserve the approved dense-reference display limits, exact-source accounting and final keyboard/native-select/rendered/real-GPU, same-head technical and owner release gates. Q03 remains approved; the separate archaeology/LiDAR artifacts do not block these Earth-atlas corrections. This review does not transfer stage ownership, approve a PR, merge, deploy or release anything.
