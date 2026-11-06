# Supplementary review S33 — returned BMC corrections

Exact implementation `bf86c5316f499d7f85a7e6d5aff5ede83e957895`, baseline `bd7bdeec1cf302ae10e243dd08ad56c4a594a244`. Bounded parallel audit; Claude keeps implementation ownership. **The specific source/copy corrections pass; broader omission reconciliation and final acceptance remain open.**

## Finding dispositions

| Prior finding | Exact-head disposition |
| --- | --- |
| S32-C1 | **Closed, 4/4 locators.** BMV-011: 1 Nephi 11:1, 13, 32; BMV-014: 1 Nephi 14:18–27; BMV-039: 2 Nephi 17:1–14; BMV-042: 2 Nephi 20:5–19, 28–32. Existing copy, gates, modes and identities unchanged. Generator now handles explicit multi-range strings. |
| S32-C2 named cases | **Closed, 4/4 requested representations.** BMV-017 → Moses, BMV-166 → Moses/Abraham/Zedekiah and BMV-227 → Jerusalem/Joseph use the supplied attributed copy and labels; BMV-022 is now an actual visible source view with 1 Nephi 22 and its unknown-tribal-location safeguard. No silent adjacency consolidation remains for BMC-022. |
| S32-C2 omission rollup | **Still open, now honestly described.** 189 generated defaults explicitly disclaim certified absence and await comparison with fuller accepted research. Eleven bespoke omissions remain unchanged. The disclaimer repairs overstatement but does not perform the outstanding comparison. No fresh certification of those 200 omitted chapters is claimed. |
| S32-A1 | Historical checkpoint 32 counts corrected. The new checkpoint repeats a different total error; see S33-A1 below. |
| S32-A2 | **Closed.** BMC-224 Aaron scan reason now identifies the Jaredite son of Heth/father of Amnigaddah and preserves rejection of the biblical namesake link. |

All four new views were compared copy-by-copy to the source-grounded replacements and accepted BMC-022 finding in [S32](supplementary-review-s32.md). This **reuses** its primary readings of [1 Nephi 17](https://www.churchofjesuschrist.org/study/scriptures/bofm/1-ne/17?lang=eng), [Helaman 8](https://www.churchofjesuschrist.org/study/scriptures/bofm/hel/8?lang=eng), [Ether 13](https://www.churchofjesuschrist.org/study/scriptures/bofm/ether/13?lang=eng) and [Ether 10:31](https://www.churchofjesuschrist.org/study/scriptures/bofm/ether/10?lang=eng), plus the inherited locator evidence. No new primary reading is claimed or needed for the exact returned wording.

The six new relation labels preserve teaching/prophecy and textual-claim attribution. Mulek's survival is not converted into a historically verified genealogy. Old Jerusalem and promised New Jerusalem remain distinct, with no new date, coordinate or route. All four views use 3/bom gates, with six one-way links to existing 1/ot targets; BMV-022 has none. No older Bible card gains a reciprocal label. Source views vanish when their layer/work is excluded; filtered targets on an allowed source view remain named but disabled, as the inherited resolver specifies. No ignored per-edge metadata or unsupported site links were introduced.

## Accounting and S33-A1

**Actual new-head totals: 39 BMC views, 66 BMC links, 68 implemented ledger rows.** Two implemented rows are unlinked views (011 and 022). Six new links join the previous 60. The receipt and main status incorrectly say **67** links, although their own mode totals sum to 66: quotation 41 + teaching 15 + vision 4 + mention 3 + prophecy 3.

Exact documentation replacement: **“39 views, 66 links, 68 implemented ledger rows (two unlinked views); 68 implemented + 200 omitted + 101 scan rows = 369 ledger rows.”** Correct the builder-owned receipt/status at its next normal update; do not alter working code or drop a link to fit the erroneous count. A regression assertion comparing nonempty implemented `target` fields with rendered `see` entries would prevent this bookkeeping drift.

Total pack: **1,562 cards / 447 links**. Four new cards, four citation-only changes, 1,554 previous cards unchanged. All 1,523 non-BMC cards, non-codex data, engine JS/CSS and layer helper are unchanged. All **1,271 SD imports / zero pending**, 1,365 mapping rows, identity crosswalk and 121 typed-contract rows are unchanged. The new BMC ledger carries these additional relations separately; typed-contract row stability does not mean the new relations are missing from their own ledger. [Changed-key ledger extract](supplementary-review-s33/delta-ledger.csv) records the specific returned changes.

## Actual validation and supplied evidence

- **55/55 local exact-head tests passed:** `node --test tests/lds-pack.test.ts tests/atlas-layers.test.ts`; [output](supplementary-review-s33/unit-results.txt). The label bound change to ≤ 40 permits the supplied 40-character label; it does not remove gate assertions.
- [Pinned probe](supplementary-review-s33/probe.cjs), [result](supplementary-review-s33/probe-result.json): four added views, four citation-only changes, six links, all inherited non-BMC data/engine preserved, **4,752 actual-helper target-reachability cases** plus source-view gate checks. Pure VM execution, no DOM/browser/server.
- [Isolated generator check](supplementary-review-s33/accounting.py), [result](supplementary-review-s33/accounting-result.json): two runs reproduce pack, mapping, both crosswalks and BMC ledger byte-for-byte from accepted register `9cc874c09a3686119ca6b4c17c7e16f214fd7ab6`; 369 rows, 200 omitted, 189 generated defaults, 101 scan dispositions.
- No new screenshots are committed. The updated builder script checks 39 entries and the expanded BMV-039 citation; it does not directly exercise the four new views individually. Split-run logs report six passing assertions, but **check 3's run was interrupted before its end-of-run error summary**. Other runs ended with reported zero console/request/HTTP errors under the script's existing filters. This supports targeted builder-run SwiftShader behavior, not a complete error-clean single run, full Tab/Shift-Tab traversal, physical phone, native-select use, real GPU or finished-bake acceptance. No new reviewer browser run or full `test:browser` pass is claimed.

Exact-head implementation and final review CI terminal outcomes are recorded in the main handoff after verification. Standalone-pages CI remains distinct from full browser smoke and hardware evidence.

## Next useful action

No new source-content blocker was found in the returned four views. Claude should correct S33-A1 while proceeding with the remaining timeline/source-vision integration and omission/consolidation rollup, including the 189 uncertified defaults. For each default, identify an actual represented source-view/link or an explicit evidence-based no-link/omission reason; an automated disclaimer is not the completed rollup. Claude may conduct initial research without waiting for ChatGPT; returned evidence gets independent audit.

Preserve Church naming, prior focus/completing-frame fixes, concurrent research/prototypes and separate nonblocking follow-ons. Final same-head content/technical/rendered evidence, keyboard/touch/native-select/real-GPU checks and specific-PR owner approval remain required. No code/status/lock edits, approval, merge, deployment or release by this review.
