# Supplementary checkpoint 19: remaining D&C dossiers and S18 fixes

Implementation **c95e948d05887862ff39e32810d5795a9ba0710c**, baseline **e1d56505d17425128364dd75a1faa09ccc2f57ca**, accepted register **9cc874c09a3686119ca6b4c17c7e16f214fd7ab6**, prior review **e85b2b254120e0f85aa49f8fe53e15d7164d1eec**. This is a bounded parallel content audit, preserving Claude's fixing ownership, lock and code. It does not approve release or change stage.

**S18-C1/C2/C3 close.** The generated cards now distinguish the four-person section 52 party; retain section 36's promise and section 54's commanded rather than completed journey; and name all six section 70 publication stewards with the existing view referenced. The optional section 60 instruction refinement also landed. Five prior cards changed, with only DD054's display name changed in the prior mapping.

**70/70 new dossier rows compared; 67 have no new minimum-copy finding, three need the corrections below.** The [row comparison](supplementary-review-s19/row-comparison.csv) preserves each accepted matrix context and coverage-ledger row beside actual generated copy, source and gate. DD071–DD138 and DDO1–DDO2 make all 140 SC45 dossiers discoverable as reference cards. That closes their import count, not all content/integration acceptance. These are not 70 independently corroborated historical events or fresh full-section readings.

## S19-C1 — DD137 reintroduces the resolved surname before its gate

**SD1208 / DD137 / DCM-dd137-alvin-vision**, `copy_dd2.py` section 137, says **“A vision including Alvin Smith”** at `4/dc`, citing only D&C 137. The displayed title correctly says Alvin. The existing family-resolution child remains `5/pgp`, as required by S15-C1 and verified in S16; this new sentence bypasses that earlier fix.

Replace **“A vision including Alvin Smith:”** with **“A vision including Joseph Smith's brother Alvin:”**. Keep the remainder, stable key, D&C source and `4/dc` gate. Reuse `DCM-jsh-alvin-family` at `5/pgp` for the surname resolution; do not add a duplicate child or silently move a PGP source into the earlier gate. The dossier already points to the correctly titled DR06 view.

[D&C 137:5–6](https://www.churchofjesuschrist.org/study/scriptures/dc-testament/dc/137?lang=eng) identifies the brother by his given name. The separately accepted [JS—History 1:3–4](https://www.churchofjesuschrist.org/study/scriptures/pgp/js-h/1?lang=eng) supplies the family resolution. This is a source/work-gate issue, not a claim that Alvin's historical surname is unknown. The old ledger's compact “Alvin Smith” summary must be read subject to the subsequent explicit S15 disposition.

Acceptance: group 4/D&C shows no surname added by DD137; the existing group 5/PGP source view remains intact. The isolated probe demonstrates that the current new sentence really is visible at group 4, rather than merely finding an internal key string.

## S19-C2 — correct research-derived ward/stake terminology

**SD1195 / DD124 / DCM-dd124-nauvoo** ends with **“ward presidents are unnamed”**. This follows erroneous shorthand in `coverage-dc.md:140`; it is not solely a builder invention. [D&C 124:142](https://www.churchofjesuschrist.org/study/scriptures/dc-testament/dc/124?lang=eng&id=p142#p142) concerns the teachers' and deacons' presidencies and the stake presidency, alongside the named priests' leader. It does not call these ward presidents.

Replace **“ward presidents are unnamed”** with **“the teachers' and deacons' presidents and the stake president, with their counselors, are not named in verse 142”**. Preserve the named priests' leader and the conditional Roundy appointment. No new person identity or inferred office-holder name is needed.

This finding explicitly supersedes that ledger phrase for implementation. Preserve the immutable accepted register and hashes as provenance rather than changing them retroactively. Acceptance: the new dossier's terminology agrees with verse 142 and keeps unnamed offices unnamed. Its extensive named roster otherwise agrees with the earlier accepted resolved-role research; no claim of fresh independent biographies for every named person follows.

## S19-C3 — attach the historical source to the Manifesto qualification

**SD1210 / DDO1 / DCM-ddo1-manifesto** appropriately preserves the accepted qualification about plural marriages after 1890, but its sole source is Official Declaration 1. Neither that source nor the listed DX04/05 and DE28 cards supplies the later institutional historical account cited by the sentence. This is a citation gap, not an instruction to erase the qualification or flatten the history into an instantaneous end.

Keep the current wording and add a source entry titled **“Church historical essay: The Manifesto and the End of Plural Marriage — After the Manifesto”**, URL:

<https://www.churchofjesuschrist.org/study/manual/gospel-topics-essays/the-manifesto-and-the-end-of-plural-marriage?lang=eng>

That institutional essay explicitly discusses continued families and new plural marriages after 1890, including uncertainty about approvals and counts. It supports the existing narrow claim without importing its entire narrative or an exact count into the card. Retain the separate date/settings for statement, conference acceptance and later addresses. Keep attribution to the Church's later historical account, distinct from the 1890 document and from independent historical corroboration.

Acceptance: regeneration gives DDO1 both its declaration source and the historical essay; no extra date, location, family, event or child is required. Do not generalize the diagnostic probe's present one-source assertion into a rule forbidding this correction.

## Other checked substance and consolidation limits

All 70 generated descriptions were compared with accepted dossier matrix and section-ledger content, reusing previous participant/role research. Among the retained distinctions: DD072's three revelations and regional bishops; DD075's two parts and twelve companionship assignments; DD081's Gause/Williams editorial substitution; DD094's current August date; DD102's later additions; DD107's mixed dates and ordination-versus-parenthood; DD110's distinct Elias and Elijah; DD116's May/June uncertainty; DD121–123's separate epistle dates and conditional language; DD125's Iowa city distinct from Book of Mormon geography; DD132's consent/refusal tension; DD135's attributed estimates; DD136's unnamed destination and Omaha limits; DD138's vision/acceptance distinction; and OD2's June 1, June 8 and September 30 distinctions. These are accepted-research conformity findings, not newly established historical facts.

Every added card stays nonspatial: no new coordinate, numeric event date or journey geometry. Modern document origins, addressed destinations, visions, prophecies and commands remain distinguished. Existing child cards are byte-identical, including the Alvin and Sarai resolution gates. No newly required child emerged from this bounded comparison; that does not settle every later prose/relationship category.

The generator checks referenced displayed titles against existing cards. See-also text is a discoverability aid, not proof of typed clickable links, entity merging or graph behavior. Long DD124 remains one reference card; its complete roster payload is present, but its readability at supported viewports is not established by this source audit.

## Evidence and reproducibility

On 2026-11-01, targeted official-source checks inspected D&C 124:142 and D&C 137:5–6, plus the Church historical essay's “After the Manifesto” section. Three pages, not 70 new primary-section readings. The latter is an institutional secondary historical account with cited evidence, not an original 1890 source. Other source findings reuse the accepted ledger and earlier reviews. No raw copyrighted captures, retrospective access hashes or claims of independently verifying all historical events are added.

```sh
node docs/universes/packs/lds-standard-works/supplementary-review-s19/probe.cjs
python docs/universes/packs/lds-standard-works/supplementary-review-s19/accounting.py
```

- [Probe](supplementary-review-s19/probe-result.json): **70 added, five changed and 1,409 unchanged prior cards**; **1,484 total / 1,451 unique keyed cards**, including 423 in `dc-more`. All other pack data, engine JS/CSS and layer functions are identical to baseline. **1,875 work/layer combinations and 225 pre-D&C exclusions pass.** Matching section/OD sources and titles checked for every new card. Mechanical success does not erase the three content findings.
- [Accounting](supplementary-review-s19/accounting-result.json): all **1,271 SD rows** retain accepted location/declaration/hash metadata; one prior display-name change reconciled. Every imported/consolidated target resolves. The generator, including new `copy_dd2.py`, reproduces pack and mapping **byte-for-byte** in an isolated temporary directory. No implementation file was edited.
- **1,211 imported / 60 pending SD rows.** Pending: SC46 16, SC47 13, SC48 11, SC50 9, SC52 3, SC53 4, SC54 4. SC45 has zero pending rows. **74 children**, seven standalone prose cards and one consolidated prose mapping remain; **1,353 mapping rows, 1,293 imported mappings, 1,281 distinct supplementary cards**. Prose-only requirements, omissions and final integration cannot be inferred from the pending-row count.
- **39/39 exact-head local tests pass** (`lds-pack.test.ts` and `atlas-layers.test.ts`); [output](supplementary-review-s19/unit-results.txt). Coverage, source-witness and reference-disposition validators pass; outputs retained. They check ledger/capture/reference integrity, not fresh reading.
- Exact implementation [CI 41355183265](https://github.com/mckayec/universe-sandbox/actions/runs/41355183265) was running during preparation. Terminal implementation and review CI results will be recorded in the main handoff; no CI result substitutes for rendered acceptance.

## Builder handoff and remaining gates

At this exact head, the builder receipt still ends at checkpoint 18; no new S19 screenshots or same-head rendered receipt are present in the delta. Main status likewise remains fixing/claude and describes the earlier tranche. This is a parallel interim published-code audit, not a final handback. No reviewer browser, DOM or server was run. Prior screenshots cannot validate the new 70 cards, native selects, keyboard behavior or real-GPU performance.

Claude: apply S19-C1/C2 and attach the S19-C3 source, regenerate, preserve earlier fixes, and continue the remaining 60 rows plus mandatory prose/integration. Supply a current receipt and same-head technical/rendered evidence. Return the changed implementation for exact-head recheck. Final native-select/keyboard, real-GPU, rendered/technical and owner-release gates remain. The schematic is already approved; separate archaeology/LiDAR artifacts do not block these Earth-atlas corrections. No code/status/lock change, PR approval, merge, deployment or release is made by this review.
