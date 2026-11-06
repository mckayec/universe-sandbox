# Supplementary review S38 — returned source decisions

Implementation **c3e500e0c21d619a96b296a2a4b1e23753cadca6**; baseline **102f697cd8ce55118a441d4d91e1f74542c52688**. **S37-C1/C2 close. All 18 new source views, two enriched views and three bounded consolidations conform to the supplied S37 decisions. No new runtime content defect found.** One minor provenance-reason wording correction is supplied below; final semantic/integration and release gates remain open. Claude retains ownership.

## Exact returned scope

All changed descriptions, source locators, relation labels and targets were compared with [S37's sourced builder decisions](supplementary-review-s37/builder-decisions.md). Those official passages were read in S37; this pass reuses that evidence and does not claim another primary-text or full-canon reading.

| Checked group | Disposition |
| --- | --- |
| Four candidates: BMC-053/124/172/186 | Baptism as example, distinct remembered deliverances, Samuel's local death signs and explicit Matthew 5 comparison match supplied copy. No travel to baptism, transfer of the three-day darkness to Golgotha, star identification or identical sermon setting. |
| Five reader decisions: BMC-031/113/214/188/202 | Jacob's Fall view stays unlinked; creation views link OH-C01 without garden-location claims; Matthew 7 comparison keeps settings distinct; John's ministry view preserves John 21's conditional-language caution and has no Patmos or D&C link. |
| Four read parallels: BMC-081/100/191/192 | Isaiah quotation and Jerusalem reference, bounded shepherd comparison, Jerusalem healings with unlocated lost tribes, and distinct bread/wine scene all retain qualifications. Direct quotations and thematic comparisons are not conflated. |
| Five previously card-less relations: BMC-013/051/212/094/215 | Unlinked source views retain attribution for textual transmission, records, tower and creation retrospects; no modern denomination, fixed canon, archaeological tower identity/date or new Earth point. |
| Two enriched existing views: BMV-166/187 | BMV-166 adds the exact Helaman 6:10 sentence/source while preserving Helaman 8 and the uncorroborated-genealogy caveat. BMV-187 adds the Matthew 6 sentence/link while preserving Solomon and audience qualifications. |
| Three consolidations: BMC-002/016/164 | Red Sea setting is bounded to BP01/BXP01/BJ01; river Laman is explicitly the crossed river (**S37-C1**). BXP37 carries land naming and enriched BMV-166 now carries the Helaman 6:10 descent claim (**S37-C2**). These are not whole-chapter coverage assertions. |

This is **21 resolved omission keys**, plus the BMC-187 enrichment. The S37 brief counted two bounded consolidations plus a BMC-164 enrichment/consolidation instruction; the builder's count of three consolidations includes BMC-164 and is consistent, not an extra source view.

## Accounting, citations and gates

[Disposition delta CSV](supplementary-review-s38/disposition-delta.csv), [inventory script](supplementary-review-s38/inventory.py), [result](supplementary-review-s38/inventory-result.json): exactly those 21 keys leave the default semantic set; 33 name-scan CSV rows are removed. Of the remaining 146 semantic rows, only BMC-091 and BMC-193 reasons change, to name the added Helaman 6:10 source and the BMV-191 disposition. All their other fields remain unchanged. The remaining states are **63 no-bible-relation / 62 namesake / 17 represented / four practice-or-title**. These remain summary-level screens, not freshly certified primary absences.

**76 BMC views / 98 links / 12 unlinked views**; **1,599 total cards / 479 links**. Eighteen new cards, two enriched old cards, ten new links. The other **1,579 old cards** are unchanged. Source ledger: **374 rows = 110 implemented + 163 omitted + 26 scan-accepted + 75 scan-rejected**; omissions comprise 146 default keys and 17 bespoke dispositions. All 239 chapter keys are retained.

The new EXTRA_SOURCES mechanism preserves each view's own passage first, followed by the specified comparison source. BMV-166's extra source is another Book of Mormon chapter; the six comparison additions are earlier Bible passages. The actual emitted sources have only bofm/ot/nt scripture paths, with no D&C/PGP leak at work 3. All source views independently remain 3/bom, without new dates, coordinates or routes. Existing one-way target reachability is retained and no reciprocal Bible labels are introduced. The guard's current source-path test is not a universal future spoiler validator, but no violation is present in this delta.

All **1,271 SD imports / zero pending**, the **1,365-row mapping**, 121-row typed contract, identity crosswalk, engine JS/CSS, layer helper and all non-BMC pack data remain unchanged. No timeline/source-vision runtime integration beyond these source views is claimed. Prior focus/completing-frame corrections inherit their earlier evidence limits.

## S38-A1 — small provenance-reason correction

In `supplementary-build/copy_bmc.py`, NOLINK[100] says there is “no card for that discourse”. The existing `NTC-other-sheep` card cites John 10:1–18. The chosen **unlinked runtime view is correct** under S37; the reason should describe the deliberate subject distinction rather than claim complete target absence. Replace its reason with:

> S37 decision: comparison view without a link; John 10 is cited as a source, with no shared scene or quotation claimed. NTC-other-sheep is not reused because its principal subject differs from this bounded good-shepherd comparison.

Regenerate the ledger during the next normal update. No new navigation, new source research or release-critical implementation change is required for this documentation precision item.

## Actual verification and supplied evidence

- **61/61 local exact-head tests pass:** `node --test tests/lds-pack.test.ts tests/atlas-layers.test.ts`; [output](supplementary-review-s38/unit-results.txt).
- [Pure pack/gate probe](supplementary-review-s38/probe.cjs), [result](supplementary-review-s38/probe-result.json): all 76 source views and **7,056 target-reachability cases** pass; new/changed key allowlists, unchanged old data, no new reciprocal links and allowed source paths checked. No browser/server/DOM execution.
- [Accounting/generator check](supplementary-review-s38/accounting.py), [result](supplementary-review-s38/accounting-result.json): two isolated rollup → semantic → build runs reproduce the pack, mapping, both crosswalks and all BMC inventories byte-for-byte using accepted register `9cc874c09a3686119ca6b4c17c7e16f214fd7ab6`. Repeatability does not establish semantic completeness.
- Three committed JPGs directly inspected: `shots/s38-bmv081-390x844.jpg`, `s38-bmv186-1440x900.jpg`, `s38-bmv166-3840x2160.jpg`. Phone copy/source pairs wrap inside the panel; filtered Jerusalem is visibly disabled. Desktop shows the distinct Matthew comparison and local-darkness qualification. The 4K image shows the Mulek addition and source within the narrow central panel. Partial previous/next cards at a scrolled viewport edge are not proof of inaccessible content. Images alone do not prove keyboard traversal or physical-display readability.
- Builder `s38-probe-output.txt` now supplies **three separate terminal clean summaries**, including desktop and emulated phone; this improves the S36 evidence gap. The corresponding probe uses programmatic focus/Enter, emulated touch and SwiftShader. It is builder-reported execution, not an independent real-GPU/physical-phone/native-select or full Tab/Shift-Tab acceptance result. No new full browser-smoke or completed-globe-bake acceptance is inferred.
- Exact-head implementation and final documentation CI terminal outcomes are recorded in the main handoff after verification. The pages suite is not the separate `test:browser` suite.

## Next handoff

No unanswered builder source question remains in this returned delta. Apply the minor reason correction during the next normal generator update; proceed with remaining timeline/source-vision integration, semantic disposition of remaining substantive omissions and final same-head technical/rendered evidence. Do not certify the 146 summary-level states merely because candidate/reader labels are now zero. No initial-research wait is imposed. Preserve Church naming, Claude code/lock/ownership, concurrent research/prototypes and nonblocking follow-ons. Specific-PR owner approval remains required. No approval, merge, deployment or release is given here.
