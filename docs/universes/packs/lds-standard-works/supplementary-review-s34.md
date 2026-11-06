# Supplementary review S34 — omission rollup and builder decisions

Implementation `29e888069f32f7e2e5cd0ea8a0b5912af5a52339`; baseline `bf86c5316f499d7f85a7e6d5aff5ede83e957895`. **Runtime unchanged; S33 count closes. Rollup has a reproducible evidence-ingestion defect and cannot yet close omission reconciliation. All 17 requested builder decisions are answered.** Claude retains code/lock/status ownership; no final acceptance.

## Exact delta and inherited evidence

No public runtime file changed. Pack and engine equality is independently asserted; the previous 1,562 cards, 447 links (39 BMC views / 66 BMC links), gates/navigation and source-copy judgments carry forward. All 1,271 SD imports / zero pending, 1,365 mapping rows, identity crosswalk and 121 typed-contract rows remain unchanged. S33-A1 closes: the new receipt explicitly supersedes its earlier 67-link count with 66.

New work is a 279-row omission rollup, generator integration and one test. It assigns 189 chapter keys to 94 no-name, 78 hits-dispositioned, seven candidate and ten reader states. Those are **generated output counts**, not certified substantive closure. The BMC ledger's 189 reason cells change; its 369 rows remain 68 implemented, 200 omitted and 101 scan rows. No new view, timeline/source-vision relation or physical evidence is added.

## S34-C1 — verse-qualified full-read rows are silently skipped

`bmc_omission_rollup.py:chapter_number_ranges` accepts a chapter or chapter range ending in digits, but does not accept a verse qualifier. `load_ledger` silently drops any full-read reference that fails that parser. The exact script parses **41 of 117 matched full-read table rows and skips 76**, covering the verse-qualified Alma 33–63, Mosiah 1–29 and Helaman 1–16 rows. Multi-link rows are outside this matched-row count and also need explicit ingestion accounting, rather than silently disappearing.

Concrete false absence: **BMC-131 / Alma 36** is marked `reconciled-no-shared-name`, with “0 full-read row(s).” Yet the saved full-read entry **Alma 36:1–30** explicitly mentions remembered **Egypt/Jerusalem deliverances**. Its omission is a parser failure, not a primary-text access limitation. [Probe and result](supplementary-review-s34/rollup-probe.py), [result JSON](supplementary-review-s34/rollup-probe-result.json), and [all 76 skipped references with saved evidence](supplementary-review-s34/skipped-fullread-rows.csv) reproduce the defect without modifying the builder's files.

Required correction:

1. Parse chapter/chapter-range independently from optional verse suffixes; recognize `Alma 36`, `Alma 36:1–30`, `1 Nephi 1–5` and the repository's multi-link references. Prefer official URL book/chapter identity plus explicit range handling where useful. Do not confuse a verse range with a chapter range.
2. Emit an ingestion inventory: every full-read table row consumed, or explicitly unsupported with a reason. An unexplained dropped row must fail validation. Include regression cases for the 76 verse-qualified rows and the combined Enos/Jarom/Omni/Words of Mormon row.
3. Rerun the rollup and inspect newly exposed hits; update affected per-chapter reasons and counts. Do not hard-code 94/78/7/10 as the acceptance condition. Specifically revisit BMC-131 and the records exposed by the corrected reader.
4. Even after parser repair, a short-name scan is a candidate index, not complete semantic reconciliation. The accepted research contains compressed prose and multi-chapter findings; preserve explicit chapter attribution and assess namesakes/context from the actual evidence. Do not certify absence from a missed token or source-coverage gap.

The proposed seven candidate views need not wait for this parser fix. Correct ingestion and continue the already supported content in parallel within Claude's workflow. No full canon reread is requested.

## Builder answers — all 17 resolved

[Exact source-linked copy, targets, gates and acceptance checks](supplementary-review-s34/builder-decisions.md):

- **Seven candidates: implement** BMC-024, 027, 057, 105, 137, 187 and 239 as attributed 3/bom source views. Preserve Eden uncertainty, Solomon temple comparison rather than recovered plans, Jacob/D&C differences without later-work disclosure, incomplete genealogy and rhetorical rather than travelled geography.
- **Three Jerusalem settings:** use the real journey entries **BXJ01** for BMC-003/004 and **BXJ02** for BMC-007; record bounded consolidation of the setting/return-trip payload, not “no entity” or complete chapter coverage. No duplicate quotation/vision card is needed.
- **BMC-048 Zion:** no equivalence to the Jerusalem-specific target is established by 2 Nephi 26:29–31. Retain its welfare/charity teaching as nonspatial explanatory content without that identity link. Exact safe copy is supplied. This official passage was freshly opened this pass; the other decisions explicitly reuse accepted research.
- **Six Israel passages:** BMC-179/195/203/204/208/210 may link the existing `OTM-israel-prophetic-community` concept, whose current description explicitly includes covenant people with passage-specific scope. Supply six attributed teaching/editorial source views, preserving distinct speakers/audiences. Do not infer modern ethnic, genetic or territorial equivalence. This resolves the question without suppressing supported covenant language.

That is 13 proposed linked source views, three bounded narrative consolidations and one no-geographic-link explanatory disposition. It is **not** 17 implemented objects or a newly reduced atlas scope. Consolidations remain contingent on the actual rendered payload and source IDs specified in the decision file. The seven candidates and ten questions are resolved on existing evidence; remaining parser-induced questions must be surfaced after repair.

## Validation and evidence limits

- **56/56 local tests pass** at the exact head: `node --test tests/lds-pack.test.ts tests/atlas-layers.test.ts`; [output](supplementary-review-s34/unit-results.txt). The new aggregate-count test passes despite S34-C1, demonstrating why it cannot certify complete ingestion.
- [Pure pack/engine equality probe](supplementary-review-s34/probe.cjs), [result](supplementary-review-s34/probe-result.json): no changed runtime behavior to retest; previous gate/focus evidence inherited with its limits.
- [Isolated accounting/generator check](supplementary-review-s34/accounting.py), [result](supplementary-review-s34/accounting-result.json): two runs of rollup then build reproduce the rollup, BMC ledger, pack, mapping and both crosswalks byte-for-byte using accepted register `9cc874c09a3686119ca6b4c17c7e16f214fd7ab6`. Reproducibility does not validate the parser's missing evidence.
- [Actual parser probe](supplementary-review-s34/rollup-probe.py): deterministic failure evidence above; no application edits, server, DOM or browser execution.
- No new screenshot, keyboard, touch or GPU evidence is supplied; builder appropriately did not repeat runtime browser checks. Inherited SwiftShader/emulation remains distinct from physical-phone/native-select, full keyboard traversal, finished-bake and real-GPU acceptance. Checkpoint 33's interrupted check-3 error-summary limitation remains. No full `test:browser` pass is newly claimed.

Exact-head implementation and final documentation CI terminal results are recorded in the main handoff after verification. A pages check is not full browser smoke or hardware acceptance.

## Next action and release gates

Claude can build the supported decisions now and repair S34-C1, then return the updated omission dispositions plus remaining timeline/source-vision integration. The rollup is useful discovery progress, but the 189 entries are not yet substantively reconciled. Preserve Church naming, concurrent research/prototypes, current ownership and separate nonblocking follow-ons. No initial ChatGPT research wait is imposed. Final content/technical/rendered evidence and specific-PR owner approval remain required. No approval, merge, deployment or release by this review.
