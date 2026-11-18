# LDS supplementary checkpoint 1 — exact-head content/accounting review

Implementation: PR33 `fe24d334731c1b25c806c2300aa7a23f930babbb`, compared with `b62bd3cf2d4c4218504b9c5b91720eacce98551f`. Accepted research: PR34 `9cc874c09a3686119ca6b4c17c7e16f214fd7ab6`; declaration register byte-identical to `3729dbb33a98705fe8117a2aa53d9d058b870d9d`. Builder receipt and mapping are on this exact implementation head. Main status at `250ccd8` retains fixing/claude and says SC08 onward is next; this parallel bounded review does not transfer ownership or certify the unfinished tranche.

**Verdict:** SC01–07 accounting and gates conform, with one small but concrete copy correction (S1-C1), one citation-strengthening recommendation, and an acknowledged mobile navigation constraint. Claude may continue the next tranche while making this correction. This is not full supplementary closure, final canon sign-off or release approval.

## Coverage and reproducibility

- Every one of the 1,271 SD mapping rows checked against the accepted register: identity, category, source location, research declaration, work gate, consolidation rule and row hash match. Exactly 111 are imported and 1,160 remain explicitly pending; pending rows have no fabricated targets. Seven additional prose rows have no SD identity and are counted separately.
- All 111 imported rows and all seven prose cards compared manually against their retained source context. The [118-row comparison](supplementary-review-s1/comparison.csv) preserves accepted context, actual copy, actual source links and disposition. **117 conform to accepted context; one needs S1-C1.** This is accepted-research conformity, not 118 freshly verified primary-source records.
- Category counts: SC01 15; SC02 18 plus one prose card; SC03 eight; SC04 six prose cards; SC05 41; SC06 17; SC07 12. Total: 118 added cards, 203 preexisting cards unchanged, 321 cards overall. These are source views, not 321 unique historical entities. Primary 169-ID / 170-card accounting remains separate.
- All existing pack data outside the new `bom-more` tab are deep-equal to baseline: prior cards, sites, coordinates, events, routes, Salamis and Palmyra remain unchanged. Engine and layer helper bytes are unchanged. No new dates, pins, geometries or route legs are introduced.
- Pure actual-function probes pass 2,950 layer/book combinations (118 × five layers × five book gates), 118 pre-BoM all-layer checks, and 118 nonspatial/undated checks. Each new view uses only `books:[3]` and `layers:['bom']`; no numeric timeline or coordinate metadata is added.
- All source URLs in the 111 accepted rows survive in the matching cards; BXP52 additionally links Ether 9, already named in accepted context. Source labels and mapping locators agree. Chapter-range links often land on one chapter with adjacent chapters named in the label; this inherited convention is not proof that every claim appears in the landing chapter alone.
- The inspected builder generator was run only in an isolated temporary tree with the exact accepted CSV. Both generated pack and full mapping are byte-identical to committed output. The generator copies the supplied row hash rather than authenticating arbitrary future inputs; the audit independently pins and compares this input revision. Future source changes require another comparison.

Reproduce from a checkout with both implementation commits and the research commit available:

```sh
node docs/universes/packs/lds-standard-works/supplementary-review-s1/probe.cjs
python docs/universes/packs/lds-standard-works/supplementary-review-s1/audit.py
node --test /path/to/fe24d33-checkout/tests/lds-pack.test.ts /path/to/fe24d33-checkout/tests/atlas-layers.test.ts
```

Results: [probe-result.json](supplementary-review-s1/probe-result.json), [accounting-result.json](supplementary-review-s1/accounting-result.json), [23/23 targeted tests](supplementary-review-s1/targeted-tests.txt). The test delta preserves the primary count by subtracting the supplementary tab and adds mapping/gate checks; the independent audit uses a CSV parser and exact input comparison rather than relying on the builder test's line matching. No browser/server was run by ChatGPT. Older full-research validators were not repeated because accepted evidence files did not change.

## S1-C1 — restore Zarahemla within the gathering region

Severity: low, required copy precision before this tranche closes. Target: `public/atlas/packs/lds-standard-works.js:1338`, key BXJ12 / SD0086, and generator `supplementary-build/copy_bom.py` (edit source and regenerate, not just generated output).

Current wording describes the region as “between Zarahemla and Bountiful”. The accepted SD0086 and [3 Nephi 3:23–24](https://www.churchofjesuschrist.org/study/scriptures/bofm/3-ne/3?lang=eng) explicitly include the land of Zarahemla itself. Minimum replacement:

> Third Nephi describes families converging from north and south on a region of the land southward that includes the land of Zarahemla and the land between Zarahemla and Bountiful, extending to the line between Bountiful and Desolation, and later returning to their separate lands. The gathering is a region, not a single point.

Keep existing source links, gate and nonspatial representation. Acceptance: regenerated BXJ12 includes Zarahemla itself; all SD mappings and gate probes still pass. No modern geography inferred.

## Sources, retained prose and consolidation

The four builder-flagged reading questions are resolved in [source-checks.md](supplementary-review-s1/source-checks.md): BXP12, BXP35, BXP62/BXJ14 and BXE05 are supported. Six targeted official chapters were inspected; all other primary evidence is transparently reused. For SC04.4, add `Mosiah 17:1–3` / `https://www.churchofjesuschrist.org/study/scriptures/bofm/mosiah/17?lang=eng` to support the already-correct priesthood clause directly. This strengthens an inherited source list rather than correcting a fabricated fact.

All six SC04 household/relationship bullets and SC02's narrow-pass note are retained. Source-sensitive genealogy tensions, homonymous people/places, unknown modern locations, army-specific journeys, retrospective letters and separate storm/appearance timing survive. Prose outside tables is not silently treated as zero content: SC05 layer/identity rules are respected, and SC06 source-relative timing is retained without numeric dates.

BXJ05/BXJ13/BXJ16, BXE03–05/BXE07 and BXC01 refer by title to existing views. This is acceptable additive reference text at this checkpoint: prior records are preserved, no duplicate engine events/routes/entities are created, and continuation wording identifies overlap. It is not a completed clickable relationship system. Irreantum is introduced once in this tranche; pending SC53 must reuse it. SC05 great tower/Nimrod/Moriancumer/Shelem and prophetic New Jerusalem must continue to reuse prior context; no new coordinates or historical identification are licensed. Broader supplementary pending rows must not be counted as imported merely because some overlap these primary/source views.

## Rendered and technical evidence limits

Inspected the four committed `shots/s1-codex-*` images at 390×844, 1280×800, 1440×900 and 3840×2160 (the viewer resized the 4K image). They visibly show the new tab, BoM badges, source links and wrapping at the sampled scroll position. The mobile tab controls occupy roughly half the dialog before the content, corroborating the builder's acknowledged constraint. Do not add more stacked family tabs without the promised narrow-screen navigation adjustment; recheck access to the list and close control at the changed head.

The screenshots are builder-supplied static evidence, not ChatGPT interaction tests or proof of all 118 cards being reachable. Builder reports focus containment on Tab, Escape closing, no console errors and SwiftShader runs; this is new reported keyboard evidence, not independent keyboard certification or real-GPU evidence. No screenshot proves a complete focus cycle, reverse Tab, focus return or real-device behavior. Those remain part of final technical acceptance.

Implementation CI `41276264879` is tracked to terminal outcome in this review's publication response. Do not confuse its page smoke checks with a full supplementary-content or GPU audit. Review-branch CI is also reported separately. No main handoff/status or implementation files changed by this audit; concurrent worker edits are preserved.

## Next handoff

Claude retains fixing ownership: apply S1-C1, strengthen SC04.4's source list, address mobile tab growth while implementing SC08 onward, and provide the next per-source mapping and exact head. ChatGPT rechecks changed copy/accounting then; no need to rerun the full canon or this unchanged tranche. Still pending: 1,160 SD rows, any remaining required prose/consolidations, SC55–62 dense-reference disposition evidence, final same-head technical/rendered and real-GPU evidence, and owner release gate. This report grants no approval, merge or deployment.
