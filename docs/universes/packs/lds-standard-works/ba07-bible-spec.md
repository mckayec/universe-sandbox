# BA07 tranche4 — remaining Bible event/explanatory source views

2026-10-31. **Proposed specification, not implemented correction or release approval.** Fresh PR33 remains open/unmerged at `c59c9bc13d848bbf0c4b3f3c64810bfa187749f0`; PR34 baseline `5b9fa0ddc22222a2d39543f70f775a04700c669e`. Main's LDS status still says built/chatgpt and PR33's discussion returned no comments. The checked implementation head, status and discussion provide **no evidence of Claude pickup**; unpublished/private work cannot be inferred either way. Recent main handoff notes already supply the published review pointers.

## Finite deliverable

The [nine-row crosswalk](ba07-spec/bible-content-crosswalk.csv) specifies AE01/02/03/09/10/14 and AC01–03: **seven omitted and two partial** records. These are all remaining non-represented or partial entries in the primary AE/AC registries. Eight AE entries are already represented and are deliberately not re-specified. Their other audit findings are not waived.

Each row includes exact minimum neutral copy, passage and official/institutional source URLs, current representation, existing build targets, work/layer/date fields, source-row hash, prior support-audit location, proposed disposition and an acceptance check. This adds nine disjoint views to the previous53: **62proposed views across four tranches**, not62implemented objects or a completed Bible/BA07 audit. AP place inventories, AJ journeys and supplementary Bible families remain separate outstanding scope.

The accepted evidence comes from `bible-inventory.md` and `bible-record-audit.md`, which distinguish the source-qualified narrative from modern site evidence. Source passages were not freshly reopened in this specification pass. Current spelling/chronology constraints and prior qualifications are reused, not newly certified. Source IDs A1–A21 resolve locally to that inventory, not another pack's register.

## Prioritized implementation and consolidation

| Order | IDs | Concrete minimum and consolidation rule |
|---|---|---|
| 1 — Exodus uncertainty/context | AE01,AE02,AC01 | Show Exodus13guidance and Exodus19Sinai arrival as separately sourced narrative views, with the Church teaching map's possible-route qualifier. AC01 is a reference explanation, not an imported map/image or recovered road. A single sectioned Exodus card is acceptable if each ID, source and proposition maps explicitly. |
| 1 — Jordan and evidence types | AE03,AC02 | Keep Joshua3crossing narrative distinct from Joshua6Jericho and the modern Tell es-Sultan archaeological property. AC02 is an editorial evidence-type distinction supported by separate source classes, not a quotation of UNESCO's assessment of Joshua. It may accompany the existing AE04 heritage-context presentation without creating another point. |
| 2 — Matthew Passion source views | AE09,AE10 | Existing `codex:Gethsemane` and `codex:Golgotha` are partial contexts. Expand or consolidate their entries only with visible Matthew-attributed prayer/arrest and crucifixion source views. No duplicate physical identity or chosen modern candidate is needed. A source-qualified expansion can satisfy a row; merely renaming the existing place cannot. |
| 2 — Revelation setting/vision | AE14,AC03 | Existing AE13Patmos setting does not import the descending-city vision or explain the evidence distinction. Retain the geographically named setting separately from vision imagery. One labeled Revelation reference card can cover both new views while preserving Revelation1 and21locators. |

## Runtime/gate contract

Use current codex fields `name`, `books:[1]`, `layers:["ot"]` for AE01–03/AC01–02, and `books:[2]`, `layers:["nt"]` for AE09/10/14/AC03. The research's generic Bible terminology does not authorize a nonexistent `bible` layer or an OR-layer joining later PGP/BoM claims. Chapter/passages identify source context; the work selector is not publication chronology or a chapter-level spoiler promise.

The minimum implementation is a **nonspatial narrative/reference view for all nine rows**, even though some related entities already have Earth markers. Do not create new sites, `lat/lon`, `rel`, route geometry, event-site links or a modern New Jerusalem. Any later Chronicle representation with an exact event location would require its own evidence/implementation review; it is not required to unblock this tranche.

Omit numeric `when`. AE02's third month is relative to departure, not a BCE date or a guessed March. Do not compute an Exodus year, harmonized crucifixion date or eschatological fulfillment year. Label AE14 as John's vision; avoid flattening visionary imagery into either verified geographic history or a blanket “fiction” category. Jerusalem, New Jerusalem in Revelation and Independence/Zion are not one entity merely because labels overlap.

Visible source locators and safe accessible source links must accompany each subsection. Hidden custom source fields are not visitor-visible evidence. The CSV provides retrieval URLs, not license to embed untrusted HTML or trace the Church map. Source dates and archaeological property descriptions must not be converted into dates/locations for scriptural episodes.

## Record-specific safeguards and tests

- AE01/02/AC01: test distinct Exodus13and19claims, source locators, “third month after leaving” and possible-route language. Assert no asserted crossing coordinate, verified Sinai identification or copied map geometry.
- AE03/AC02: preserve the narrative water-stopping claim as attributed scripture. Existing Tell es-Sultan coordinates mark a heritage property, not proof of the Jordan crossing or Joshua's destruction date. No old wall becomes “Joshua's wall” through this card.
- AE09/10: require the additional episode proposition/source, not only a place name. Preserve Matthew attribution, prayer before arrest and crucifixion at named Golgotha. No imported modern candidate, merged Gospel calendar or reconstructed micro-location. Existing place identity remains singular.
- AE14/AC03: require Revelation21city imagery and Revelation1setting distinction; assert no new Earth pin, distance, astronomical position, future year or claim that John physically toured every addressed church.

Builder returns nine IDs mapped to actual runtime list/item/subsection, disposition and exact changed implementation SHA. Use actual assembled-pack codex/layer predicates to test matching group/layer, prior group where applicable, layer disabled, other layers only and all-works. For OTgroup1 there is no prior canonical group0 test to invent; use disabled-layer and other-source assertions. Verify expanded Gethsemane/Golgotha views do not leak into unrelated layers. Evaluate source visibility with prose, not merely list eligibility.

Check rendered source reachability, card length and desktop/mobile filtering in the permitted technical environment. This document provides no rendered claim or browser/server workaround. Return the changed head for ChatGPT content recheck and Claude's same-head technical evidence; no test count or nine-row mapping alone grants release approval.

## Remaining decisions and blockers

No inaccessible evidence prevents these nine minimal attributed views. Unknown crossing, Sinai, garden and crucifixion micro-locations remain unknown and are intentionally unused. No new investigation is needed merely to create a safe reference view. A04's dense-display deferral does not waive these ordinary narrative/explanatory rows; any proposed omission needs explicit scope disposition.

This tranche completes specification of the missing **primary AE/AC subset**, not the66-book Bible, the remaining primary place/journey inventories or supplementary source views. BA01–07, the full import/consolidation/omission crosswalk, source-specific safeguards, technical/rendered checks and owner release gates stay open. The separate owner archaeology/LiDAR artifacts and approved BoM schematic are not dependencies here.

Run `python docs/universes/packs/lds-standard-works/ba07-spec/build-bible-crosswalk.py`: validates exact nine-row set against the primary accounting, seven omitted/two partial counts, all eight otherAE entries represented, no overlap with previous53views, source-row hashes, URLs and support-audit locations. Run prior tranche validators and the unchanged96/256validator. These establish specification integrity, not new source reading or implemented behavior.
