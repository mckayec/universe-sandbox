# Supplementary review S36 — five source-view answers implemented

Implementation **57486b2e44c58e908db3f2f71f2992ed09c4760d**, baseline **a89df3ee1ee97d713790ef7f999c305befc54604**. **All five S35 proposals conform; S35-A1/A2 close. No new content defect found in this delta.** This is bounded content acceptance, not final atlas approval. Claude retains implementation ownership.

## Source-copy and relation coverage: five of five

The five additions were read copy-by-copy against [S35's sourced replacement text](supplementary-review-s35.md). Their sources were read in S35; this review inherits that evidence, not a new canon reread. Implementation changes only five runtime cards, with seven one-way links. Existing cards and their citations are unchanged.

| Source view | Checked citation and meaning | Disposition |
| --- | --- | --- |
| BMV-073-egypt-jerusalem-limhi | [Mosiah 7:19–20](https://www.churchofjesuschrist.org/study/scriptures/bofm/mosiah/7?lang=eng): Limhi recalls Egypt/Red Sea and ancestral Jerusalem departure, not his own journeys. Egypt and Jerusalem labels preserve that distinction. | Conforms |
| BMV-079-sinai-moses-comparison | [Mosiah 13:5, 11–24](https://www.churchofjesuschrist.org/study/scriptures/bofm/mosiah/13?lang=eng): narrator's Moses/Sinai comparison is distinguished from Abinadi continuing the commandments. No local Sinai or Abinadi travel invented. | Conforms |
| BMV-131-egypt-jerusalem-alma | [Alma 36:28–29](https://www.churchofjesuschrist.org/study/scriptures/bofm/alma/36?lang=eng): ancestral deliverance, no new Alma travel. The Jerusalem target is OTM-jerusalem, not BXJ01 (return for plates). | Conforms; S35-A1 closes |
| BMV-141-joseph-garment-moroni | [Alma 46:23–27](https://www.churchofjesuschrist.org/study/scriptures/bofm/alma/46?lang=eng): Moroni invokes Joseph's garment and words attributed to Jacob. The accepted caveat about the quotation not appearing in Genesis is retained. No speaker conflation. | Conforms |
| BMV-069-mary-benjamin-angel | [Mosiah 3:1–8](https://www.churchofjesuschrist.org/study/scriptures/bofm/mosiah/3?lang=eng): Benjamin reports the angel's prophecy. NTE-annunciations is labelled “Mary, also named in Luke”; neither the same announcement nor Visitation is asserted. | Conforms; S35-A2 closes |

Each view is independently 3/bom, nonspatial and undated. Targets retain their own work/layer availability. No reciprocal Bible labels disclose later source views. No new coordinates, routes, chronology, kinship or historical corroboration is asserted. The corrected proposed reasons remain in `supplementary-build/bmc_omission_rollup.py` as provenance rather than being silently erased.

## Accounting and unchanged evidence

- **58 BMC views / 88 links / three unlinked views**. Five additions / seven links; **1,581 total cards / 469 links**, with all 1,576 earlier cards unchanged.
- **373 BMC ledger rows:** 91 implemented, 181 omitted, 26 scan-accepted, 75 scan-rejected; all 239 chapter keys retained. Of the 181 omissions, 14 are bespoke and 167 are rollup chapter keys.
- Rollup **172 → 167 keys**, now **88 no-name / 79 hits-dispositioned / zero candidate / zero reader**. [All seven removed CSV rows](supplementary-review-s36/removed-rollup-rows.csv) belong to exactly the five implemented keys. All remaining 236 CSV rows are unchanged; multiple hit rows explain why CSV row count differs from chapter-key count. Reasons in the source-view ledger merely receive the checkpoint stamp apart from these five dispositions.
- **1,271 SD imports / zero pending**, 1,365 mapping rows and 121 typed-contract rows unchanged. Identity/typed crosswalks, non-codex data, engine JS/CSS and layer helper unchanged. Previous focus/completing-frame corrections carry forward with their prior evidence limits.
- S34-C1 current-corpus parser closure remains inherited. The absence of candidate/reader labels does **not** close semantic omission review. No additional timeline/source-vision integration was returned in this delta; the builder explicitly leaves it open.

## Independent validation and supplied rendering evidence

[Pure pack/gate probe](supplementary-review-s36/probe.cjs), [result](supplementary-review-s36/probe-result.json): all 58 source-view gates and **6,336 target-reachability cases** pass. Old cards, non-BMC data, engine and mappings are invariant. No DOM, server or browser was executed.

[Local test output](supplementary-review-s36/unit-results.txt): **59/59 pass**, `node --test tests/lds-pack.test.ts tests/atlas-layers.test.ts`, run from the exact implementation checkout. [Accounting script](supplementary-review-s36/accounting.py) and [result](supplementary-review-s36/accounting-result.json) reproduce the generated pack, mapping, crosswalks, source ledger, omission rollup and ingestion inventory in two isolated runs, using accepted register `9cc874c09a3686119ca6b4c17c7e16f214fd7ab6`. Determinism is not source certification.

Three committed JPGs were inspected directly: `shots/s36-bmv079-390x844.jpg`, `s36-bmv131-1440x900.jpg`, `s36-bmv141-3840x2160.jpg`. The phone capture shows wrapped Sinai copy and visibly disabled filtered targets; the desktop capture shows Alma's two bounded labels and Moroni's caveat. The 4K capture shows the narrow central reference panel with substantial unused width, matching the builder's usability note. This does not establish physical display legibility or justify silently redesigning the panel during a content review. Content continuing beyond a scrolled viewport is not proof it is inaccessible.

Builder log: checks 1 and 2 report desktop Enter navigation and emulated-phone filtered behavior, but their process timed out before its final console/request summary. Check 3 was rerun separately and supplies a terminal clean summary. Do not combine those into an independently verified complete clean run. The images/logs do not establish complete Tab/Shift-Tab traversal, native-select interaction, physical phone, real GPU, finished globe bake or full `test:browser` acceptance. CI's standalone-pages check is a different suite. Exact-head implementation/review CI terminal results are recorded in the main handoff after verification.

## Next action and remaining release gates

No unanswered builder content question is present in checkpoint 36, and no further correction is required for these five views. Proceed directly with the already-open timeline/source-vision relations and semantic omission/consolidation work; no new initial-research wait or owner scope decision is introduced. For the remaining 167 keys, record an explicit evidence-based retained/represented/omitted disposition, its research locator and any scope limits; a name-index classification alone is insufficient. Return the actual changed mapping/copy, not merely a zero-candidate count. Reuse the accepted research and existing views rather than duplicating them.

Then supply final same-head technical/browser and rendered/keyboard/device evidence, resolving the incomplete desktop/phone terminal summaries and documenting real hardware limits. Preserve Church naming, implementation ownership/lock, parallel research/prototypes and separate nonblocking follow-ons. Specific-PR owner approval remains required. No approval, merge, deployment or release is given here.
