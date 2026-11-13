# Supplementary checkpoint 15: D&C person roster

PR33 exact head **a136f70aec3a7ff7c47c020b06205cf2d4587506**, compared with **0b8c8f8c5419712ac096fb7c72fd1dc96758361b**. Accepted register baseline **9cc874c09a3686119ca6b4c17c7e16f214fd7ab6**. Published under PR34's existing documentation branch; Claude retains fixing ownership. No application, status or lock changes.

## Verdict and finite coverage

**S14-C1, S14-C2 and S14-C3 close.** Their three replacement descriptions match the supplied review text after normalizing straight/curly apostrophes only. Optional DP06 distance qualification and DR13 person-specific locators are also correct. Five older cards changed; **1,125 prior cards unchanged**, and all other pack data remain identical after removing the 138 new cards and restoring those five descriptions.

All **138 SC40 person cards / SD0860–SD0997** were compared with accepted name, locator and identity constraints: **136 have no new minimum-copy finding; two require S15-C1/C2 below**. The 102 shared-rule rows retain name/locators without inventing biographies or relationships; the other 36 carry individual constraints. All 138 names, stable keys and section-level source sets match the accepted register. Matching a register does not establish every assertion independently; the Robert Foster correction demonstrates why source review remains necessary.

[Row inventory](supplementary-review-s15/row-comparison.csv) contains each accepted context and actual copy/source/gate/disposition. Eight targeted official pages were inspected in this turn, alongside reuse of the retained research and S14 source checks. This is not a repeated full-canon reading or verification of every biography.

## S15-C1 — retain Alvin's surname resolution at its supported work gate

**SD0864 / DCM-dcp-alvin-smith** uses only D&C 137:5–6 at `4/dc`, while the accepted row explicitly resolves the surname through JS—History 1:3–4. Omitting that source does not solve the gate issue: the visible title still supplies “Alvin Smith.” The relevant [JS—History family passage](https://www.churchofjesuschrist.org/study/scriptures/pgp/js-h/1?lang=eng) is accessible. No access hold or owner decision is needed.

Builder-ready disposition:

- Keep the stable identity key, but use the `4/dc` title **“Alvin”** and the existing D&C-only description. The key is internal identity bookkeeping, not a displayed surname claim.
- Retain the accepted resolution in a **`5/pgp` source view**, consolidated into an existing matching JS—History family view if available, otherwise as one child after SD0864. Proposed title: **“Alvin in Joseph Smith's family account”**. Minimum copy: **“Pearl of Great Price — Joseph Smith—History 1:3–4 places Alvin in Joseph Smith's family account. This supplies the family context for the roster identity Alvin Smith; D&C 137:5 itself names only Alvin.”** Cite JS—History 1:3–4. Do not add further death dates or family biography from memory.
- Apply the same display rule to the existing `DCM-dr06-joseph-alvin` title, currently “Joseph and Alvin Smith: brothers”: use **“Joseph Smith and his brother Alvin”** at `4/dc`. Its body already preserves the parents-in-vision qualification. This is a related pre-existing title, not counted among the 138 new cards.

Acceptance: group 4/D&C exposes the D&C name and relation, while the added source resolution appears only with PGP enabled and group 5 reached. All-combined mode must still respect the work gate. Test displayed titles, description and source labels, not just source URLs. Do not duplicate the underlying person or delete the accepted surname evidence. This is source attribution/gating, not a dispute about the historical person's identity.

## S15-C2 — distinguish Foster's contract from the stock instruction

**SD0962 / DCM-dcp-robert-d-foster** says he is named “in the Nauvoo House contract and as a stockholder.” [D&C 124:115–118](https://www.churchofjesuschrist.org/study/scriptures/dc-testament/dc/124?lang=eng) separately directs him to build a house for Joseph according to their contract (115) and to pay stock into the Nauvoo House (117). Neither instruction alone proves completed construction or actual payment. The accepted shorthand was “housecontract/stockholder,” not proof that the contracted house was the Nauvoo House.

Replace the description with:

> Doctrine and Covenants — Named in 124:115–118. Verse 115 directs Robert D. Foster to build a house for Joseph according to their contract; verse 117 separately directs him to pay stock into the Nauvoo House. These are instructions, not evidence here of completed construction or payment. He is distinct from James Foster, named among the Seventy in verse 138.

Keep the existing 115–118 source and add **D&C 124:138** to that same section's merged source label for the explicit James comparison. Acceptance: two instructions remain distinct; no house identity, completion, transaction or biography is inferred. Same `4/dc`, no geometry/year. This also refines the accepted shorthand for future consumers; preserve the original register/hash and cite this corrective disposition rather than silently rewriting historical research accounting.

## Four builder readings

1. **Alvin:** agree that JS—History resolution belongs at `5/pgp`; apply S15-C1 to visible labels as well as sources. Retain the evidence through a gated view rather than dropping it.
2. **Identity graph:** short codex records are useful named-person references, not a working typed relationship graph. Shared keys avoid a second person identity, but prose references are not clickable edges. Keep DRE sets, DD052/075/124 and other dossier/role integration open. No new engine feature is demanded by this bounded copy review.
3. **Short cards:** the 102 name/locator-only rows need no invented biography. They satisfy the roster minimum, provided SC41 roles and later dossier/prose obligations are still completed. Those obligations are not superseded by these imported rows.
4. **Councils:** the generic descriptions are supported, but precise optional copy is available. [102 heading and 1–3](https://www.churchofjesuschrist.org/study/scriptures/dc-testament/dc/102?lang=eng) describes the Kirtland high council and names John S. Carter and John Smith among those chosen. [124:131–132](https://www.churchofjesuschrist.org/study/scriptures/dc-testament/dc/124?lang=eng) names George W. Harris in the high council for the cornerstone of Zion. Do not merge these councils or infer permanent tenure. This clarification is optional, not an additional counted correction.

## Source checks and limits

Freshly inspected on 2026-11-01: official D&C **35 heading, 39 heading, 49 heading, 75:13–36, 89 heading, 102 heading/1–3, 124:115–118/131–138**, and **JS—History 1:3–4**. These eight pages support targeted uncertainty checks, not all 138 biographies. D&C 137 and the S14 replacement sources were reused from actual prior checks, not claimed newly retrieved.

Sensitive samples passed: the current [89 heading](https://www.churchofjesuschrist.org/study/scriptures/dc-testament/dc/89?lang=eng) really names Emma; the [35 heading](https://www.churchofjesuschrist.org/study/scriptures/dc-testament/dc/35?lang=eng) really names Edward Partridge in its historical preface. [39's heading](https://www.churchofjesuschrist.org/study/scriptures/dc-testament/dc/39?lang=eng) uses James Covel and Methodist, consistent with the card; the older alternative is retained research context, not freshly authenticated by that current heading. [75:15,17](https://www.churchofjesuschrist.org/study/scriptures/dc-testament/dc/75?lang=eng) preserves Calves Wilson and Major N. Ashley as printed. “Not a military rank” is read as the card's label convention, not a researched claim about Ashley's entire biography; optional clearer wording is “The printed label is retained without assigning a military rank.” [49's heading](https://www.churchofjesuschrist.org/study/scriptures/dc-testament/dc/49?lang=eng) provides Church editorial description of Shaker beliefs; it is not an independent Shaker self-description or an atlas assertion of Christ identity.

No person/date/coordinate expansion from memory. Current headings and canonical bodies remain distinct evidence strata. No inaccessible primary source blocks S15-C1/C2.

## Accounting and reproducibility

**997 imported / 274 pending SD rows**; 138 new imports, no new children or consolidations. Mapping **1,351 rows / 1,077 imported mappings**; **1,065 supplementary cards**, 72 children, seven standalone prose cards and one consolidated prose view. Whole pack **1,268 cards / 1,235 unique keyed cards**. `dc-more` has 207 cards, 138 of them new person references.

**Correction to S14 audit/handoff:** the previous total of 412 pending was correct, but its split was wrong. It was **352 D&C rows and 60 later rows**, not 348/64. Current pending SD counts are derived directly from the mapping: SC41 36, SC42 17, SC43 21, SC45 140; SC46 16, SC47 13, SC48 11, SC50 9, SC52 3, SC53 4, SC54 4. Thus **214 D&C + 60 later = 274**. Zero SD rows in another category do not certify its prose requirements complete.

[Accounting script/results](supplementary-review-s15/accounting.py) reconciles all 1,271 research identities/locations/hashes, all unchanged mapping rows, every new title/key and section-level URL set, and category totals. The 36 individual constraints were also compared as prose. Source-label verse detail appears in the CSV for review; the automated URL-set test alone cannot prove every verse assertion. Isolated generation including `copy_dcp.py` recreates pack/mapping byte for byte.

[Actual-function probe](supplementary-review-s15/probe.cjs): **3,575 single-layer/group combinations**, **429 pre-D&C all-layer exclusions**, nonspatial/year-free cards, unique sources/keys, and full prior-pack/engine/layer regression pass. The work gate helpers pass on current data, but cannot detect S15-C1's missing later-work attribution; human source review found that issue. **35/35** exact-head targeted tests pass. Standing coverage/source-witness/reference validators pass, with saved outputs. One initial review-probe comparison flagged curly versus straight apostrophes; normalizing that punctuation only established the exact S14 text match. No implementation test failure was concealed.

Reproduce from a checkout containing the pinned revisions:

```sh
node docs/universes/packs/lds-standard-works/supplementary-review-s15/probe.cjs
python docs/universes/packs/lds-standard-works/supplementary-review-s15/accounting.py
node --test /workspace/universe-pr33-s15/tests/lds-pack.test.ts /workspace/universe-pr33-s15/tests/atlas-layers.test.ts
```

The final command uses this audit's detached exact-head checkout; substitute an equivalent checkout path. No local full pnpm check or browser/server workaround was run.

## Rendered evidence and next handoff

Builder reports 109/109 checks and captures at 1440/1280/390 with 207 cards; 4K capture was not obtained in its allotted time. ChatGPT inspected the supplied 390×844 pixels: the end of the prior priesthood-line card, Aaron Johnson, and Algernon Sidney Gilbert with source links are visible and wrap within the panel. This is limited static evidence, not validation of all person cards, scrolling, native-select, keyboard, focus, link activation or real-GPU behavior. The receipt's DOM counts and no-console-error claims remain builder evidence. Final-head implementation CI **41335668965** was running during drafting; terminal results follow in the main handoff.

Claude can apply S15-C1/C2 and continue SC41–45, followed by the remaining 60 later rows. Full typed-role/dossier, mandatory prose, shared-identity and vision-mode integration, 4K evidence and final same-head technical/rendered/owner release gates remain open. Q03 schematic remains approved; separate archaeology/LiDAR artifacts do not block these Earth corrections. No approval, merge, deployment, release or scope reduction.
