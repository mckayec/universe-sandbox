# Supplementary review S35 — parser closure and returned source views

Implementation `a89df3ee1ee97d713790ef7f999c305befc54604`; baseline `29e888069f32f7e2e5cd0ea8a0b5912af5a52339`. **S34-C1 closes for the committed research corpus; all 17 S34 decisions are represented. No new defect found in the 14 added runtime views. Broader source/omission and final acceptance gates remain open.** Claude retains implementation ownership.

## Parser and accounting disposition

Independent [actual-module ingestion probe](supplementary-review-s35/ingestion-probe.py), [result](supplementary-review-s35/ingestion-result.json): **118 source table rows / 121 references consumed**, including all **76 verse-qualified references** and four references in the combined Enos/Jarom/Omni/Words of Mormon row. All current linked table body lines are accounted. Chapter identity is distinguished from verse ranges, including a cross-chapter verse example. Unparseable reference input returns unsupported rather than a guessed range. The inventory/write assertion prevents an identified unsupported linked reference from being silently accepted. This is bounded current-corpus validation, not a claim every possible future Markdown format is supported.

**BMC-131 / Alma 36 now includes the saved Egypt/Jerusalem evidence**, with one full-read row. This closes the demonstrated omission-ingestion failure. It does not certify that a short-name search finds every semantic relation in compressed research prose, or certify primary-text absence. The remaining rollup has **172 chapter keys: 88 no-name, 79 hits-dispositioned, four candidate, one reader**; Alma 36 also carries a reader hit within its candidate chapter. These are indexing/disposition states, not five new primary-confirmed absence categories.

All 1,271 SD imports / zero pending, 1,365 mapping rows and both older crosswalks are unchanged. BMC ledger: **371 rows = 84 implemented + 186 omitted + 26 scan-accepted + 75 scan-rejected**. Fourteen of the 186 omissions are bespoke, leaving 172 in the rollup. No timeline/source-vision integration beyond these source-view additions is asserted.

## All 17 S34 decisions checked

The 14 added views were compared copy-by-copy to [S34's accepted builder text](supplementary-review-s34/builder-decisions.md); all use the supplied content, attribution and source bounds. This reuses that source evidence rather than rereading unchanged passages.

| Group | Checked disposition |
| --- | --- |
| Seven candidates | BMC-024/027/057/105/137/187/239 now have source views with the intended targets. Eden is unlocated; temple comparison is not an archaeological plan; Jacob's rebuke remains attributed with no D&C details leaked into work 3; Amulek's Manasseh is not King Manasseh; sermon audience and rhetorical city references remain distinct. |
| Six Israel references | BMC-179/195/203/204/208/210 retain chapter-specific speakers/audiences and covenant-people language. Links compare that concept with `OTM-israel-prophetic-community`, without a modern demographic/territorial equivalence. |
| Zion welfare | BMC-048 is a 3/bom explanatory view citing 2 Nephi 26:29–31, with no geographic identity link. |
| Three journey consolidations | BMC-003/004 explicitly name BXJ01; BMC-007 names BXJ02. Reasons limit consolidation to Jerusalem setting/return-trip payload rather than full chapters. Existing journey cards were rechecked for the stated payload. |

**53 BMC views / 81 BMC links / three unlinked views.** Fourteen new cards and 15 new links; all previous 1,562 cards preserved, for **1,576 cards / 462 links** total. Engine JS/CSS, layer helper and all non-codex data are unchanged. No dates, Earth pins, routes, reciprocal Bible labels or ignored edge-gate metadata are added. Independent helper checks cover all 53 views and **5,832 target-reachability cases** across work/layer combinations. BoM-only targets are named but nonnavigable; excluded source views do not render. This is pure helper/data validation, not a new asynchronous/rendered acceptance claim.

## Returned builder questions — resolved now

Five chapter proposals answer the four candidate questions plus Mary; Alma 36's separate Jerusalem hit is included in its one view. All proposed entries remain **3/bom, nonspatial, source-linked, one-way**, with no numerical date. These are ready-to-build text proposals, not claims the views already exist.

The following specific official passages were opened/read on 2026-11-02 for this bounded follow-up. No full-chapter/canon reread is claimed.

| Key and source | Minimum copy (prefix “Book of Mormon — ”) | Target and relation |
| --- | --- | --- |
| BMC-073, [Mosiah 7:19–20](https://www.churchofjesuschrist.org/study/scriptures/bofm/mosiah/7?lang=eng) | Limhi recalls deliverance from Egypt through the Red Sea and the departure of his people's ancestors from Jerusalem. These are recollections in his address, not Limhi's own travels. | `OTS-P04-egypt` / “deliverance recalled by Limhi”; `OTM-jerusalem` / “ancestral departure recalled” |
| BMC-079, [Mosiah 13:5, 11–24](https://www.churchofjesuschrist.org/study/scriptures/bofm/mosiah/13?lang=eng) | The narrator compares Abinadi's shining face with Moses at Sinai; Abinadi then continues the commandments. Sinai is a biblical comparison, not another local mountain or a journey by Abinadi. | `OTS-AP04-sinai` / “Sinai in the Moses comparison”. Preserve narrator versus Abinadi attribution. |
| BMC-131, [Alma 36:28–29](https://www.churchofjesuschrist.org/study/scriptures/bofm/alma/36?lang=eng) | Alma recalls ancestral deliverance from Egypt and from Jerusalem while addressing his son. The memories are not new journeys undertaken by Alma. | `OTS-P04-egypt` / “deliverance recalled by Alma”; `OTM-jerusalem` / “ancestral departure recalled” |
| BMC-141, [Alma 46:23–27](https://www.churchofjesuschrist.org/study/scriptures/bofm/alma/46?lang=eng) | Moroni invokes Joseph's torn garment and recounts words attributed to Jacob about a preserved remnant. This quotation is presented in Alma's narrative; it is not a quotation found in the Genesis text. | `OHR-JOSEPH-JACOB` / “garment recalled by Moroni”. The Genesis comparison caveat reuses accepted full-read research; no fresh whole-Genesis search is claimed. Keep the quoted speaker Jacob distinct from Joseph and from Moroni. |
| BMC-069, [Mosiah 3:1–8](https://www.churchofjesuschrist.org/study/scriptures/bofm/mosiah/3?lang=eng) | Benjamin reports an angel's prophecy naming Mary as Jesus's mother. This does not describe Mary's visit to Elisabeth. | `NTE-annunciations` / “Mary, also named in Luke”. This earlier-work card already names Mary as Jesus's mother and is used by BMV-102; do not label this the same announcement or the Visitation event. |

**S35-A1, correct the proposed consolidation reason:** BXJ01 is the *return for the plates*, not Lehi's departure. Do not use it for Alma 36:29. The proposed source-view → `OTM-jerusalem` reference above avoids that mistake. If a separate departure comparison is later wanted, BJ01 is the migration summary; adding a link to a work-3 target must be supported by the generator's target policy, not silently forced into its current earlier-work-only BMC links.

**S35-A2, correct the target-availability reason:** the claim that the only Mary target is the Visitation journey is false at this exact head: `NTE-annunciations` (“Announcements to Zacharias and Mary”) also exists. Its reference can be used with the carefully bounded label above. No new person card or owner scope decision is required. Update the rollup reasons when implementing these answers; keep the source modes and gates, not name matching alone.

## Validation and rendering evidence

- **58/58 local exact-head tests pass:** `node --test tests/lds-pack.test.ts tests/atlas-layers.test.ts`; [output](supplementary-review-s35/unit-results.txt).
- [Pinned pack/gate probe](supplementary-review-s35/probe.cjs), [result](supplementary-review-s35/probe-result.json): 14 additions, no changed old cards, 15 links, 5,832 helper reachability cases; engine/crosswalk invariants preserved. No DOM/browser/server execution.
- [Accounting and generator](supplementary-review-s35/accounting.py), [result](supplementary-review-s35/accounting-result.json): two isolated rollup/build runs reproduce the pack, mapping, both crosswalks, BMC ledger, omission rollup and ingestion inventory byte-for-byte, using accepted input register `9cc874c09a3686119ca6b4c17c7e16f214fd7ab6`. Reproduction proves output stability, not semantic completeness of the remaining no-name categories.
- One committed 1440×900 JPG inspected: Eden, Solomon-comparison and Jacob-rebuke cards have readable copy/source/relations; a prior card's trailing link is visible above this scrolled row, and subsequent content extends below the viewport. The screenshot does not prove scrolling failure, full keyboard traversal or globe bake completion.
- Builder's two-check SwiftShader log reports successful programmatically focused Enter navigation, the no-link Zion view and BoM-only disabled Israel targets, with terminal error summaries. This is builder-run emulation; no physical phone/native-select, real GPU, complete Tab/Shift-Tab traversal, new 4K/1280/phone image set or full `test:browser` pass is supplied. Earlier unchanged-code focus/completing-frame closures carry forward with their evidence limits.

Exact-head implementation and final documentation CI terminal results are recorded in main after verification; pages CI is not full browser smoke or hardware acceptance.

## Next handoff

Claude can implement the five source-view answers and update the two inaccurate proposed reasons now, while continuing timeline/source-vision integration and final semantic omission/consolidation accounting. The parser defect is closed; do not reopen the same 76 rows as unconsumed. Equally, ingestion alone does not certify all 172 remaining chapter dispositions. Preserve Church naming, parallel research/prototypes, current ownership/lock and separate nonblocking follow-ons. Claude may perform first-pass research without waiting. Final content/technical/rendered evidence and specific-PR owner approval remain; no approval, merge, deployment or release by this review.
