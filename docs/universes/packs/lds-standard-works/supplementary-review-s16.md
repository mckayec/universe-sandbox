# Supplementary checkpoint 16: SC41 and S15 corrections

Implementation reviewed: `1a6b94eea246a39a795d79c22204226e2d8f001e`, against `a136f70aec3a7ff7c47c020b06205cf2d4587506`. Accepted supplementary register: `9cc874c09a3686119ca6b4c17c7e16f214fd7ab6`. Previous review: `a59bb3dcb070ce8602019e6c91f6435acc35fa2d`. This is a bounded parallel content audit; Claude retains fixing ownership. No release approval or stage transition.

## Disposition

**36/36 new SC41 rows conform to the accepted relation/context minimum; S15-C1 and S15-C2 close at this head.** One added PGP child also conforms. No new required content correction found in this tranche. This conclusion compares every new row's copy, locators and constraints with the accepted register; it is not a fresh independent reading of every cited section or evidence that the instructed journeys/offices were historically completed. The 36-row [comparison inventory](supplementary-review-s16/row-comparison.csv) retains both the accepted context and actual built copy.

- **S15-C1:** SD0864 displays “Alvin”, retaining the stable internal key. DR06 now displays “Joseph Smith and his brother Alvin”. `DCM-jsh-alvin-family` immediately follows its parent, carries the supplied minimum copy and JS—History 1:3–4 citation, and is visible only at group 5 with PGP enabled. The parent remains group 4/D&C. The supplied copy matches the prior review exactly, apart from typographic apostrophe normalization.
- **S15-C2:** SD0962 matches the supplied replacement separating the verse 115 house contract from verse 117 stock instruction. Neither is represented as completed. The source label now includes verse 138 for the distinction from James Foster.
- **SC41:** SD0998–SD1033 are 36 source-context views, not 36 new people or a typed relationship graph. Full companion/office lists are now present in the relevant new cards, including the thirteen section 52 pairs, twelve section 75 pairs, eleven living Twelve members, separate high council, and three section 136 organizing pairs. The earlier summary cards remain unchanged. Different commission dates and offices are not collapsed; no dates, routes, coordinates or extra companions were invented by the generator.

## Builder readings and source checks

1. **SD1013:** surnames in the accepted row are sufficient for this card. Current official [D&C 78:9](https://www.churchofjesuschrist.org/study/scriptures/dc-testament/dc/78?lang=eng&id=p9#p9) explicitly names Newel K. Whitney, Joseph Smith Jr. and Sidney Rigdon for the council. “Travel as a party” follows the accepted relational interpretation; the verse itself directs council participation, not an observed travel manifest. Keep it an instruction and do not infer stops or completed co-travel. Expanding Whitney's initials is permissible from this source but not necessary.
2. **SD1012:** one section 75 URL with merged locators 6–17, 24–28 and 30–36 retains the family-support condition. All twelve accepted pairs and the last seven pairs' unspecified directions are preserved. This comparison reuses the accepted register and S15's reading of section 75; it is not a new full-section reading.
3. **SD1002/SD1012/SD1033:** preserving source-context expansions beside existing summaries is consistent with the register's consolidation rule. These are textual cross-references, not clickable identity links; the implementation does not acquire graph semantics merely by calling them typed-relation cards. SC45 source dossiers and final integration remain open.
4. **SD1022:** current official [D&C 124:12, 16, 107](https://www.churchofjesuschrist.org/study/scriptures/dc-testament/dc/124?lang=eng) supports the roles in context: Thompson's writing help, Bennett's help sending the word, and Rigdon/Law's assistance. The card preserves instruction/conditional wording. Do not expand this into a claim that a particular proclamation was distributed or completed.
5. **SD1020:** freshly inspected [D&C 118:2, 6 and footnote 2a](https://www.churchofjesuschrist.org/study/scriptures/dc-testament/dc/118?lang=eng) explicitly supports the editorial resolution of Thomas to Thomas B. Marsh and the four appointments. The card correctly identifies the footnote as the resolution source.
6. **SD1024–SD1031:** targeted rereading of official D&C 124:91–97, 102–142 confirms the Foster distinction, office lists, replacement of Brunson, and Roundy's conditional wording. No seniority ranking or unnamed counselors are supplied. Stable identity forms, including Levi W. Hancock, reuse the accepted identity resolution rather than claim every initial occurs in verse 138.

Fresh retrieval on 2026-11-01 used the three official pages above, with actual body passages/footnote inspected. No new raw captures are committed and no body hash or full-section reading is claimed. Other source comparisons reuse accepted research and earlier reviews transparently. [S15](supplementary-review-s15.md) remains the primary record for JS—History and section 75 checking. Source links establish textual/official editorial claims, not independent historical confirmation.

## Reproducible accounting and validation

Run from a checkout containing the pinned commits:

```sh
node docs/universes/packs/lds-standard-works/supplementary-review-s16/probe.cjs
python docs/universes/packs/lds-standard-works/supplementary-review-s16/accounting.py
```

The [probe](supplementary-review-s16/probe-result.json) passes 1,000 work/layer combinations for all 37 added and three changed cards, plus 120 pre-D&C all-layer exclusions. All 1,265 other prior cards, all other pack data, engine JS/CSS and layer functions are unchanged. There are 1,305 total cards / 1,272 unique keyed cards; `dc-more` has 244 cards. No browser, DOM or server was executed by this review.

The [accounting check](supplementary-review-s16/accounting-result.json) reconciles every one of the 1,271 SD rows' source location, declaration and accepted hash. Only SD0826, SD0864 and SD0962 change prior mapping display/source fields; their accepted provenance hashes remain intact. All imported/consolidated mapping targets resolve. The isolated generator, using tracked Python source only and no supplied bytecode, reproduces the pack and mapping byte-for-byte.

- **1,033 imported SD rows; 238 pending.** Pending: SC42 17, SC43 21, SC45 140, SC46 16, SC47 13, SC48 11, SC50 9, SC52 3, SC53 4, SC54 4. Thus 178 D&C rows plus 60 later rows remain.
- **73 children**, including the new Alvin child; seven standalone prose cards and one consolidated prose mapping remain. 1,352 mapping rows, 1,114 imported mappings, 1,102 distinct supplementary cards. These counts do not certify prose-only categories or full integration merely because they have no pending SD rows.
- **36/36 local tests passed** from the exact implementation's `tests/lds-pack.test.ts` and `tests/atlas-layers.test.ts`; output retained in [unit-results.txt](supplementary-review-s16/unit-results.txt).
- Coverage, source-witness and reference-disposition validators pass; outputs retained beside this report. They validate ledger/capture/reference integrity, not fresh canon reading or release readiness.
- Exact implementation CI: [41339748382](https://github.com/mckayec/universe-sandbox/actions/runs/41339748382), still running at report preparation; terminal outcome belongs in the final handoff. Builder-reported code-commit checks (110 tests, distribution, 13 pages twice) are distinct from independently observed CI.

## Supplied visual evidence and remaining gates

Inspected actual committed 390×844 and 3840×2160 `s16-codex-dc-more-*` screenshot pixels. The compact screenshot shows the native selector's shortened label and readable wrapped initial cards; the 4K screenshot shows the three-column relation-card layout and section 52 roster. No overlap is apparent in these sampled visible areas. The 4K image was displayed at 2048×1152 by the inspection tool, so this is not a native-resolution text-legibility certification. The two other supplied sizes were not independently inspected this pass. Builder reports SwiftShader/CDP captures at code commit `60e4a2e`; these are supplied static evidence, not reviewer-run interactions. This supplies the previously missing 4K capture artifact, but does not establish keyboard/focus behavior, native selector operation, all-card scrolling, real-GPU behavior or final same-head rendered acceptance.

**S16-H1 (repository hygiene, nonblocking content note):** nine generated `supplementary-build/__pycache__/*.cpython-313.pyc` files were newly tracked. Remove these generated caches from the implementation branch and keep them out of future generator commits. Their absence does not affect reproducibility: this review generated identical output from Python sources without copying them. No application or builder file was edited here.

Claude can continue SC42 onward without a content correction hold from this tranche. Retain the previous BA07 integration requirements, pending source dossiers, mandatory prose/children and final cross-links/accounting. Return each changed head for recheck; complete remaining imports and same-head technical/rendered checks before requesting release. The separate schematic is already owner-approved; archaeology/LiDAR comparison artifacts do not gate these Earth-atlas corrections. This review changes no scope, ownership or release gate.
