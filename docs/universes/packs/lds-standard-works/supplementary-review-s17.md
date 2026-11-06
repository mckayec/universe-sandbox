# Supplementary checkpoint 17: ancient participants and dated source views

Audited implementation **1b55cc853c11a86340a3baf21913bc311ddfbadc**, baseline **1a6b94eea246a39a795d79c22204226e2d8f001e**. Accepted supplementary register **9cc874c09a3686119ca6b4c17c7e16f214fd7ab6**; prior review **cce3057ac901b8b69fff7343c502b71347029eea**. All 38 newly imported SD rows and the Sarai child were compared with their accepted source contexts, limits, locators and actual generated copy. [Row-by-row inventory](supplementary-review-s17/row-comparison.csv).

**Bounded verdict: corrections required.** Of the 38 SD rows, 36 have no new required minimum-copy correction; SD1035 requires S17-C1 and SD1063 requires S17-C2. The child's gate/content conforms, with a citation-link improvement below. S16-H1 closes: nine tracked Python caches were removed and `__pycache__/` is ignored. S15-C1/C2 closure carries forward because all prior cards are unchanged. This is not full content sign-off, historical certification or release approval. Claude retains implementation ownership.

## S17-C1 — correct the speakers in section 7

**SD1035 / DCM-dca-john-peter-james**, `supplementary-build/copy_dca.py` and generated pack: “Section 7:1–8 records a dialogue between John the Beloved and Peter” is incorrect. The accepted SD1035 shorthand “John/Peter dialogue” was ambiguous and must not be expanded this way. [D&C 7:1–8](https://www.churchofjesuschrist.org/study/scriptures/dc-testament/dc/7?lang=eng) depicts the Lord addressing John, John's reply, and then the Lord addressing Peter. It does not depict John and Peter talking to one another.

Replace the complete description with:

> Doctrine and Covenants — Section 7:1–8 depicts the Lord speaking with John the Beloved and then addressing Peter about their desires and ministry; 27:12 and 128:20 name Peter, James and John as messengers in the restoration narrative. This John is the apostle, not John the Baptist and not John Whitmer.

Keep the existing key, title, source links and `4/dc` gate. Acceptance: the card no longer asserts an exchange between John and Peter; the Lord is the speaker addressing each, and the distinct John identities remain explicit. No new biography or route is needed.

**Research erratum:** this paragraph supersedes the ambiguous relation shorthand at `coverage-dc.md:640` / SD1035 for implementation. Preserve the pinned historical register and hashes as provenance rather than silently rewriting them to make a checksum appear unchanged. Future register refreshes should cite this correction.

## S17-C2 — restore the accessible Emma heading context

**SD1063 / DCM-de20-word-of-wisdom** omits an accepted participant context because the builder had not confirmed the heading. The current official [D&C 89 heading](https://www.churchofjesuschrist.org/study/scriptures/dc-testament/dc/89?lang=eng) explicitly names Emma Smith and her concern about tobacco use at meetings. This is accessible editorial context, not an unsupported inference from the numbered verses. No owner decision or outside source is needed.

Retain the current description and insert after the Kirtland/date sentence:

> The current section heading links Joseph Smith’s inquiry to tobacco use at the meetings and the concern it caused his wife, Emma Smith.

Keep the attribution to the **current heading**, the existing heading citation, `4/dc` gate and the distinction between the 1833 introduction and later mandatory observance. Do not add cleaning anecdotes, quotations from Emma, or retrospective policy dates. Acceptance: Emma's concern is visible with editorial attribution, not presented as a direct quotation or statement in verses 1–21. This is the builder's flagged reading 2, now resolved, not a newly discovered unrelated omission.

## Five builder readings and additional precision

1. **Sarai child / SD1045:** `DCM-dca-sarai-abraham` correctly follows its parent at `5/pgp`; the D&C view remains `4/dc`. [Abraham 2:2](https://www.churchofjesuschrist.org/study/scriptures/pgp/abr/2?lang=eng) names Sarai as wife; [Genesis 17:15, 19](https://www.churchofjesuschrist.org/study/scriptures/ot/gen/17?lang=eng) supplies the rename and spousal context. Earlier-source citations on a later-work view do not require exposing the later work early. The body already cites Genesis 17:15, but the child's clickable `src` contains only Abraham: add a second source labeled **Genesis 17:15** at `https://www.churchofjesuschrist.org/study/scriptures/ot/gen/17?lang=eng` for direct access. This citation-link improvement does not require a new card, new identity or gate change.
2. **Emma:** apply S17-C2 above.
3. **Earlier OT sources on D&C cards:** correct. Exodus 4:14 supports the Aaron/Moses relationship; Genesis sources support the comparisons without relabeling the D&C view as an OT entry. The new Exodus source helper resolves correctly. SD1041 retains the Enoch age difference, Abel's unnamed brother in 84:16, and ordination/parenthood distinction. Cain actually is named at 124:75, so do not remove him as unsupported. Optional precision: change “in lineage, ordination and vision contexts” to **“in lineage, ordination, offering-comparison and vision contexts”**, since Cain occurs in an offering comparison, not as a member of the vision's righteous congregation.
4. **Settings:** accepted DP01/DP13/DP17 distinctions are retained, with no room, property boundary or new point invented. SD1053's home/grove distinction matches the current section 2 heading. SD1061's March 1832 instruction and March 18, 1833 ordination are supported by headings 81 and 90; neither is a guessed second revelation date. For SD1062, optional clearer wording is **“The heading dates section 88 to December 27–28, 1832, and January 3, 1833; verses 117–141 give these instructions.”** This avoids suggesting independently dated composition of every verse or a first class date.
5. **SD1064 committee:** [D&C 94 heading and 13–15](https://www.churchofjesuschrist.org/study/scriptures/dc-testament/dc/94?lang=eng) supports Hyrum Smith, Reynolds Cahoon and Jared Carter. Retaining the committee on this event source view is appropriate; no extra invented DRE row is needed. Keep temple and presidency/printing-house instructions distinct from construction completion.

SD1059 says the section 72 revelations' distinct content is kept separately, but **DD072 remains pending in SC45**. Treat that as an outstanding integration promise, not completed dossier coverage. Similarly these 21 dated views store dates in prose, not new timeline event fields; no claim of completed timeline filtering or typed links follows from their import. Earlier summaries, offices, source dossiers and identities still require the final crosswalk. The section 132 view preserves the no-universal-consent qualification; Elias identities remain distinct; nothing in this tranche authorizes merging them or plotting divine/visionary figures.

## Source evidence and limits

Targeted official passages/heading bodies were retrieved and inspected on 2026-11-01: D&C 7:1–8; 89 heading/1–3; 81 and 90 headings; 84:6–18; 107:40–57; 124:75; 138:38–46; 2 heading; 88 heading; 94 heading/13–15; Abraham 2:2; Genesis 17:15–19; Exodus 4:14. Fourteen page witnesses, not fourteen newly completed full-section readings. The current sources confirmed the two corrections above and the stated precision decisions. The remaining record comparisons reuse accepted research and earlier audits; they are not a fresh independent full-corpus reading. No raw source capture or invented capture hash is committed. Official scripture establishes textual and editorial claims, not independent historical occurrence. No required source access blocker remains for these two corrections.

## Reproducible checks and counts

Run from a checkout containing the pinned commits:

```sh
node docs/universes/packs/lds-standard-works/supplementary-review-s17/probe.cjs
python docs/universes/packs/lds-standard-works/supplementary-review-s17/accounting.py
```

[Probe result](supplementary-review-s17/probe-result.json): **39 added cards, zero changed prior cards; all 1,305 prior cards and other pack data unchanged**, including S15 fixes. Engine JS/CSS and layer functions are byte-identical. There are 1,344 total cards / 1,311 unique keyed cards, 283 in `dc-more`. All new cards have one work layer, official source URLs and no invented spatial/date fields. **975 gate combinations and 117 pre-D&C all-layer exclusions pass**, including the Sarai child's PGP/group-5 restriction and immediate parent adjacency.

[Accounting](supplementary-review-s17/accounting-result.json): all **1,271 SD records** reconcile to accepted location/declaration/hash provenance. All prior SD mapping rows remain unchanged. An isolated source-only generator run reproduces pack and mapping byte-for-byte, including the new Exodus helper. All imported/consolidated targets resolve.

- **1,071 imported / 200 pending SD rows**: SC45 140, SC46 16, SC47 13, SC48 11, SC50 9, SC52 3, SC53 4, SC54 4.
- **74 children**, seven standalone prose cards and one consolidated prose mapping. **1,353 mapping rows; 1,153 imported mappings; 1,141 distinct supplementary cards.** These are overlapping counts, not independent content approvals. Prose-only categories and identity/vision integration are not certified by zero pending SD rows.
- **37/37 actual implementation tests pass** (`lds-pack.test.ts`, `atlas-layers.test.ts`); [saved output](supplementary-review-s17/unit-results.txt). Coverage, source-witness and reference-disposition validators also pass; saved outputs validate existing ledger/capture/reference integrity, not fresh reading. Passing structural tests does not close S17-C1/C2.
- Exact implementation [CI 41345526175](https://github.com/mckayec/universe-sandbox/actions/runs/41345526175) completed successfully. Review publication CI and deployment-job disposition are recorded in the terminal main handoff.

## Rendered evidence and next action

Inspected the actual supplied `shots/s17-codex-dc-more-390x844.jpg` pixels: initial cards and wrapping are visible without apparent horizontal overlap, and the incorrect dialogue wording is visibly present. The other three images were not independently inspected in this pass. Builder reports SwiftShader/CDP captures at four sizes, 111 tests, distribution checks and 13 pages twice; distinguish that receipt from reviewer-run tests and observed CI. No reviewer browser, DOM or server was run. A static image cannot establish native-select operation, keyboard/focus behavior, real-GPU behavior, all-card scrolling or final same-head rendered acceptance.

Claude: apply S17-C1/C2 while continuing SC45's 140 dossiers and the later 60 rows. Consider the small citation/wording improvements above. Preserve required prose, source boundaries, aliases and unresolved identities. Return the changed head for recheck. No scope reduction, status/lock edit, formal approval, merge, deployment or release. Q03 remains owner-approved; the separate archaeology/LiDAR artifacts do not block these Earth-atlas corrections.
