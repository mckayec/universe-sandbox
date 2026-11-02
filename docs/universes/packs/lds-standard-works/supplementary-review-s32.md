# Supplementary review S32 — BMC source views

Implementation `bd7bdeec1cf302ae10e243dd08ad56c4a594a244`; baseline `dc36cd0653c33439b4f2e31ee71cbf4b5b7a1b47`. Bounded parallel audit; Claude retains code, lock and ownership. **Representation safeguards pass; citation and omission accounting corrections remain. Not final acceptance.**

## Checked scope and inherited evidence

All **35 new source views**, their copy against the accepted BMC findings/exclusions, and **60 directed target identities/labels** were inspected. The [61-row relation inventory](supplementary-review-s32/relation-review.csv) includes the one unlinked BMC-011 view. Copy is attributed, nonspatial and distinguishes quotation/vision/teaching from travel. Targets do not merge Book of Mormon namesakes with biblical people or places. BMC-102 retains the Jerusalem/Bethlehem distinction beside the Luke link; BMC-108 preserves Salem uncertainty beside the Hebrews reference. This is accepted-research conformity, not 35 newly read primary chapters.

The previous **1,523 cards** and all non-codex pack fields are byte-equivalent after removing the new tab. Total cards: **1,558**; total links: **441** (381 inherited + 60 new). All **1,271 SD imports / zero pending**, the 1,365-row mapping, identity crosswalk and 121-row typed contract remain unchanged. Engine JS/CSS and layer helper are unchanged; prior focus/completing-frame closures carry forward. Timeline/source-vision integration and the global omission/consolidation rollup did not change.

The new generated ledger mechanically covers **239 chapter keys**: 35 represented / 204 omitted; 61 implemented rows, 204 omission rows and 101 scan rows = 366. The scan records 26 accepted / 75 rejected hits. All scan dispositions were inspected for namesake/formula safeguards; acceptance is at chapter-view level, not necessarily one separate link per scan hit. Fourteen bespoke omission reasons were read; the remaining 190 are generated defaults, **not independently certified absence findings**. The [204-row omission inventory](supplementary-review-s32/omission-review.csv) exposes this distinction and the three targeted primary checks. No new full-canon pass is claimed.

## S31 structural safeguards — pass

Actual 3/bom entries replace the unsafe nested-child/per-edge-metadata proposal. No old Bible card gains a reciprocal label or link. No `site:` target, coordinate, date or route is added. All 60 targets exist with earlier work gates; navigation respects their actual layer/work reachability. BoM-only views may name their filtered biblical targets but cannot navigate them; that is the existing documented filter behavior. OT-only/NT-only modes exclude the source views themselves. No BoM-specific reciprocal disclosure was introduced on Bible cards.

Independent pure-function probes verify **4,320 target-reachability cases** plus all source-view gates across cumulative/single-work and layer combinations. This tests the actual helpers and immutable data, not a rendered page or asynchronous focus behavior. Existing source tests cover the unchanged cancellation code; no duplicate browser review was run.

## S32-C1 — broaden four source locators to cover the displayed copy

The S31 short locators were for short example copy. The expanded builder copy now needs broader sources. Apply through `copy_bmc.py`, regenerate the card/CSV and update matching tests/probe expectations:

| View | Current locator | Required locator with current copy preserved |
| --- | --- | --- |
| BMV-011-nazareth-jerusalem-vision | 1 Nephi 11:13, 32 | **1 Nephi 11:1, 13, 32** — the unnamed high mountain is in verse 1. |
| BMV-014-john-revelation-vision | 1 Nephi 14:27 | **1 Nephi 14:18–27** — John’s name is in 27, but his future writing/vision context precedes it. |
| BMV-039-judah-damascus-samaria | 2 Nephi 17:1–9 | **2 Nephi 17:1–14** — current copy adds the Immanuel sign, given in verse 14. |
| BMV-042-assyrian-advance-oracle | 2 Nephi 20:28–32 | **2 Nephi 20:5–19, 28–32** (or 1–34) — Assyria as an instrument subsequently judged is outside the town-sequence range. |

No source-content reversal is required. These locators follow the accepted full-chapter entries; the [official 2 Nephi 17 body](https://www.churchofjesuschrist.org/study/scriptures/bofm/2-ne/17?lang=eng) was reopened on 2026-11-02 to verify the newly noticed verse-14 gap. The other three use inherited accepted passage evidence. Acceptance: all displayed claims have an applicable visible locator, while retaining keys, modes and gates.

## S32-C2 — correct false absence/prohibition reasons; provide useful source views

A missing match in the short-name scan or condensed finding is not evidence that a chapter has no shared-entity relation. Nor does prohibiting harmonized geography prohibit a properly attributed textual comparison. The following are actionable now; no owner scope decision or initial ChatGPT research wait is needed.

| Key | Evidence and exact minimum proposed copy | Safe implementation/disposition |
| --- | --- | --- |
| **BMC-017** | [1 Nephi 17:23–32, 40–42](https://www.churchofjesuschrist.org/study/scriptures/bofm/1-ne/17?lang=eng): “Book of Mormon — Nephi recalls Moses leading Israel out of Egypt and Israel’s wilderness experiences while addressing his brothers. These are scriptural recollections, not stops on Nephi’s voyage.” | 3/bom teaching source view → `OHR-MOSES`, label **“recalled by Nephi”**. Replace the generated “no relation” reason. |
| **BMC-166** | [Helaman 8:11–22](https://www.churchofjesuschrist.org/study/scriptures/bofm/hel/8?lang=eng): “Book of Mormon — Nephi recalls Moses and Abraham as witnesses and says that Mulek survived the killing of Zedekiah’s sons. The survival and descent are this text’s claims, not an independently established genealogy or migration.” | 3/bom teaching view may link `OHR-MOSES` / `OHR-ABRAHAM` as recalled witnesses and `OHR-ZEDEKIAH` with **“Mulek survival claim concerning his sons”**. Do not create an unqualified genealogical edge. The current assertion that any link would imply forbidden harmonization is incorrect; the accepted exclusion forbids *silent harmonization*, not comparison. |
| **BMC-227** | [Ether 13:4–11](https://www.churchofjesuschrist.org/study/scriptures/bofm/ether/13?lang=eng): “Book of Mormon — Ether’s prophecy distinguishes the Jerusalem from which Lehi would come from a New Jerusalem promised on this land. It recalls Joseph and his father in Egypt; the promised cities are not presented as completed Jaredite construction.” | 3/bom prophecy view → `OTM-jerusalem`, **“Jerusalem of old in Ether’s prophecy”**; optional `OHR-JOSEPH-JACOB`, **“Joseph recalled in the prophecy”**. Keep New Jerusalem unpinned and distinct. Future mode is a reason to label a relation, not omit the biblical reference. |

These three official bodies were opened/read for the bounded missing-relation questions on 2026-11-02; other chapters were not freshly reread. No ancient route, modern identity, calibrated date or historical corroboration is inferred.

**BMC-022:** the claimed consolidation into BMC-020/021 views currently has no visible 1 Nephi 22 locator or interpretive payload on those views. Either add a 3/bom interpretation reference preserving 22:4’s unknown tribal locations, or identify the actual existing source-view ID carrying that chapter and safeguard. Do not certify consolidation solely from adjacent chapter numbers. This uses the accepted BMC-022 finding, not a new primary reading.

The other explicit omissions can remain bounded non-link choices where no suitable target exists, identities are unresolved or content is formulaic, **provided the underlying chapter-reference payload remains accessible/accounted**. Missing Noah/Malachi/John-10 target cards do not require inventing links, but are not proof those source chapters have no content. The global rollup must distinguish represented/consolidated, no-link-with-reference, and still-unrepresented. Review the 190 generated defaults against existing fuller research before claiming exhaustive absence; this audit’s three counterexamples are not an exhaustive new inventory.

## S32-A1 — count modes accurately (documentation)

The receipt’s purported per-link counts total 61 because the unlinked BMC-011 row is included. There are **60 links**: quotation 41, teaching 11, vision **4**, mention 3, prophecy 1. Separately describe the unlinked vision view. Keep 61 implemented *ledger rows* distinct from 60 links and 35 views; no application behavior fix is needed.

## S32-A2 — correct one rejected-scan identity (documentation)

BMC-224 / Aaron is correctly rejected as a link to Moses’ brother, but its default reason incorrectly identifies the alternative as Mosiah’s son or the city Aaron. [Ether 10:31](https://www.churchofjesuschrist.org/study/scriptures/bofm/ether/10?lang=eng), opened on 2026-11-02 for this specific check, names Aaron as Heth’s son and Amnigaddah’s father in the Jaredite genealogy. Add a `SCAN_ROW` override: **“Jaredite Aaron, son of Heth and father of Amnigaddah, who lived in captivity; not Moses’ brother, Mosiah’s son or the city Aaron.”** Regenerate the ledger; rejection status and runtime views need not change.

## Validation and supplied rendering evidence

- **55/55 exact-head local tests pass:** `node --test tests/lds-pack.test.ts tests/atlas-layers.test.ts`; [output](supplementary-review-s32/unit-results.txt).
- [Pinned pure-function probe](supplementary-review-s32/probe.cjs), [result](supplementary-review-s32/probe-result.json): 35 source views, 60 targets, 4,320 target-gate cases, unchanged old data/engine/mappings.
- [Accounting/generator check](supplementary-review-s32/accounting.py), [result](supplementary-review-s32/accounting-result.json): two isolated runs reproduce the pack, mapping, both crosswalks **and new BMC ledger** byte-for-byte. Accepted input register remains `9cc874c09a3686119ca6b4c17c7e16f214fd7ab6`.
- Three committed JPGs inspected as pixels: desktop BMV-039 has readable separate relation labels but visibly retains the short citation; BoM-only image shows disabled filtered targets (lower content is outside the captured viewport, not proof of inaccessible content); phone BMV-108 wraps both links within the panel. The native section selector label is visually truncated at this width; its opening/options are not shown. No globe finished-bake or real-GPU result is established by these card captures.
- Builder S32 logs report six passing checks in three split runs: programmatically focused Enter activation, event click, BoM-only/OT-only filters, live layer removal and emulated 390×844 tap. The script collects request failures and HTTP errors but filters some console error patterns. These are builder-run SwiftShader checks, not reviewer browser execution, complete Tab/Shift-Tab traversal, physical-phone input or native-select acceptance. No fresh full `test:browser` result is supplied.

Exact-head implementation and final documentation CI terminal results are recorded in the main handoff after verification. A passing standalone-pages step is not full browser smoke or hardware evidence.

## Next handoff

Claude: apply S32-C1’s four locators, implement/account for S32-C2’s three supported views and BMC-022 consolidation, correct the mode count and BMC-224 scan reason, then continue timeline/source-vision and the global omission rollup. Return changed head for proportionate audit; unchanged sources/import accounting are inherited. Final same-head rendered/keyboard/finished-bake, real-GPU/physical-phone/native-select evidence, final content/technical acceptance and specific-PR owner approval remain open. Preserve Church naming and parallel research/prototypes; all basemap/timeline/Cosmere follow-ons remain nonblocking. No application/status/lock edits, approval, merge, deployment or release by this review.
