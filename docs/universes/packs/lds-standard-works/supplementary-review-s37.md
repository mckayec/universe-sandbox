# Supplementary review S37 — semantic-disposition checkpoint

Implementation **102f697cd8ce55118a441d4d91e1f74542c52688**, baseline **57486b2e44c58e908db3f2f71f2992ed09c4760d**. **Useful evidence-accounting progress; two disposition corrections and the returned builder decisions remain actionable. Runtime is byte-identical. This is not final semantic or release approval.** Claude retains implementation ownership.

## What changed and what was checked

The seven-file delta adds a semantic-disposition generator/CSV, places those reasons in the existing source-view ledger, updates generator selection, tests and the receipt. The runtime pack, engine JS/CSS, layer helper, identity/typed crosswalks, 1,365-row implementation mapping, ingestion inventory and name-scan rollup are unchanged. No timeline or source-vision runtime integration has returned at this head. All 1,271 imports remain accounted, with zero pending imports; this does not close integration.

All **167 new reason rows were screened** and structurally inventoried: unique keys, exact chapter-ledger line references, covering table-row references, referenced support-record IDs and verbatim propagation into the source ledger. [Coverage inventory](supplementary-review-s37/coverage.csv), [reproducible check](supplementary-review-s37/inventory.py), [result](supplementary-review-s37/inventory-result.json). Counts match the builder: 63 no-bible-relation, 63 namesake, 17 represented, seven relation-no-card, four practice-or-title, four unstated-parallel, five reader, four candidate.

This is **not 167 fresh primary-text comparisons**. Targeted official passages were read for 21 omission keys and existing BMC-187; the other 146 retain summary-level evidence only. The script's strict-cue assertion is a finite vocabulary guard. Its generic fallback describes compressed research, not every concept in a chapter. A `represented` range-spill reason disposes of that shared-name hit, not all content of the source chapter. The disclosed lack of full-read omission rows for 3 Nephi–Moroni remains material. No “no-bible-relation” state is certified here as primary textual absence.

## Findings requiring correction

**S37-C1 — BMC-016 ambiguous crossing object.** `supplementary-build/bmc_semantic_pass.py` says river Laman empties into the Red Sea “and a later departure crosses it”. The cited [1 Nephi 16:12–14](https://www.churchofjesuschrist.org/study/scriptures/bofm/1-ne/16?lang=eng) crosses **river Laman**, then travels near the Red Sea. Make the object explicit. Existing BXP01 is correct; this is a new disposition-wording correction, not a runtime travel regression. Exact replacement and bounded BP01/BXP01 consolidation are in the decision brief.

**S37-C2 — BMC-164 namesake-only reason misses the direct relationship.** [Helaman 6:10](https://www.churchofjesuschrist.org/study/scriptures/bofm/hel/6?lang=eng) names the land Mulek and Mulek as Zedekiah's son. BXP37 represents the land; BMV-166 currently represents the descent claim using Helaman 8 only. Add the supplied Helaman 6 sentence and source to BMV-166, then record the explicit consolidation. Preserve the text-claim versus corroborated-genealogy distinction. This is primary evidence supplementing an incomplete summary, not a claim the existing Helaman 8 card is false.

## Builder questions answered

[Builder decisions with minimum copy, exact citations, targets and gates](supplementary-review-s37/builder-decisions.md) resolves all five question groups:

- Build the four candidate views with the supplied qualifications; enrich BMV-187 with an explicitly labelled Matthew 6 comparison.
- Retain Jacob's Fall teaching without forcing a garden-geography link; use bounded creation comparisons for Alma 18 and Mormon 9. Both primary texts name Adam, despite the compressed summaries.
- Add the 3 Nephi 14 / Matthew 7 comparison. For 3 Nephi 28, preserve John's desired ministry and John 21's conditional-language caution; no Patmos-event link or work-4 disclosure at work 3.
- Specific passages now support the four previously unstated-parallel decisions. Distinguish textual comparison from quotation and shared events. Mosiah 15 and 3 Nephi 17 also contain direct Jerusalem references missed by the compressed descriptions.
- Reuse existing narrative representation for the two Red Sea entries; use unlinked source views for the five tower/scriptural-record entries. A missing target card does not require an invented coordinate, new generic canon history or unsupported omission.

Together: **21 omission keys plus BMC-187**, comprising **18 proposed new views, two bounded consolidations and two existing-view enrichments**. None is counted as implemented. All specified primary passages were accessible; no owner scope decision is needed for these bounded dispositions. The other 146 reason rows are explicitly not newly source-certified. Proceed with evidence-based review of any remaining substantive relation rather than treating these generated labels as final certification.

## Actual validation and evidence limits

- **60/60 exact-head local tests pass:** `node --test tests/lds-pack.test.ts tests/atlas-layers.test.ts`; [output](supplementary-review-s37/unit-results.txt).
- [Accounting/generator script](supplementary-review-s37/accounting.py), [result](supplementary-review-s37/accounting-result.json): two isolated rollup → semantic pass → build runs reproduce the semantic CSV, source ledger, pack, mapping and crosswalks byte-for-byte, using accepted register `9cc874c09a3686119ca6b4c17c7e16f214fd7ab6`. Existing mapping and runtime equality independently checked. Generator repeatability is not semantic truth.
- Source-view count remains **58 / 88 links**; atlas remains **1,581 cards / 469 links**. Prior S35-A1/A2 and source/gate closures inherit unchanged. No repeat browser or gate sweep is claimed where the entire runtime is identical.
- No new rendering/device evidence is supplied in this delta. S36's desktop/phone process lacked its terminal error summary; only its separate 4K check supplied one. Its images/emulation are not physical-phone/native-select, full keyboard traversal or real-GPU/finished-bake acceptance. The browser/server restriction was respected; no workaround executed.
- Exact-head implementation [CI 41498211557](https://github.com/mckayec/universe-sandbox/actions/runs/41498211557) completed successfully; build passed and deployment skipped. Initial publication failed because Git could not obtain GitHub HTTPS credentials. On the authorized recovery attempt, the existing transport worked and preserved commit 8ed958d6ea78eb7f14e0f0e2b90853f2dce5c70c was pushed without force. Final documentation CI and the main handoff are verified separately; see the terminal S37 handoff entry. The workflow runs standalone-pages tests, not the separate full `test:browser` suite.

## Next action

Claude can apply S37-C1/C2 and the ready-to-build decisions immediately, continue timeline/source-vision integration, and return changed mappings/copy plus same-head final technical/rendered evidence. No initial-research wait is imposed. Preserve Church naming, current ownership/locks, parallel research/prototypes and nonblocking follow-ons. Specific-PR owner approval remains required. No approval, merge, deployment or release is given.
