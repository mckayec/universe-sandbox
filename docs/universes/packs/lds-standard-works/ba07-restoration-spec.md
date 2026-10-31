# BA07 tranche2 — Restoration doctrine and document chronology

2026-10-31. Implementation remains PR33 `c59c9bc13d848bbf0c4b3f3c64810bfa187749f0`; review baseline `dae61c6b632224d30e6b9045e62b06bc9aa79318`. **This is a proposed builder specification, not implemented content or approval.** It adds12 nonoverlapping source-view specifications to the [first21](ba07-remediation-spec.md): **33 specified views across two tranches**, not33 new entities or a complete BA07 solution.

## Exact builder handoff

[restoration-content-crosswalk.csv](ba07-spec/restoration-content-crosswalk.csv) covers RE14/15/16/18/19/20 and RC01–06. All12 rows have minimal neutral copy, source URLs, existing representation/targets, work/layer gates, accepted dates where applicable, consolidation links, source-row hashes, prior record-audit locations and individual acceptance checks. Existing accounting marks **10 omitted and2 partial** (RC03 via the Kirtland vision, RC04 via D&C136 journey instructions). No original96/256 audit row has been changed or freshly re-certified.

This slice was chosen because the existing build supplies a1978confirmation and a1836vision but omits crucial document distinctions and explanatory context. It can be implemented without new geography, engine features or further primary retrieval. Copy and dates reuse `restoration-inventory.md` and its completed `restoration-record-audit.md`; this pass does not claim independent contemporary source confirmation or newly opened pages.

## Ordered implementation and consolidation

| Order | Research IDs | Minimum safe presentation and reuse |
|---|---|---|
| 1 — Plural-marriage transition | RE14,RE20,RC05 | An attributed context card with separately labeled **1890-10-06 acceptance** and **1904-04-06 Second Manifesto** subsections, plus RC05's transition explanation, is sufficient. Preserve each source locator. Do not make acceptance date the issue date of the1890document; do not call1904a third numbered Official Declaration or imply every existing marriage ended immediately. |
| 2 — Racial restrictions and1978documents | RE18,RE19,RC06 | Keep existing RE17 temple-confirmation event; add linked/distinct reference sections for the **June8letter** and **September30sustaining**, with RC06 context. The existing **June1confirmation** remains a reported experience. Do not map the letter onto the temple or treat the three dates as competing dates for one action. |
| 3 — Redemption-of-the-dead account | RE15,RE16,RC03 | Preserve existing RE08 January1836Kirtland account. Add **October3,1918reported vision** and **October31,1918council acceptance** as separate cited sections, then RC03 doctrine connecting D&C137/138. Keep the1976PGP addition/1979transfer history in tranche1 FM09, not1918canonization. |
| 4 — Other doctrinal context | RC01,RC02,RC04 | Three discrete cited reference views: priesthood-restoration accounts; persuasion/authority; mutual aid in D&C136. Existing RE01 and RE11 supply partial related events, not the full conceptual distinctions. RE07 is a related still-omitted record outside this tranche; its omission does not prevent RC02's textual teaching from being implemented. |

Every ID must map to a reachable item or labeled subsection. These are12source-view obligations, not a requirement for12separate cards. Shared identity and related-ID links do not excuse omitted text. `related_research_ids` are research cross-references, **not guaranteed runtime IDs**: do not create broken application links to unimplemented RE07 or to research identifiers. Resolve against the actual builder mapping, or retain a plain source reference until the destination exists.

## Runtime contract and exact chronology

Use current codex fields `name`, `books:[4]`, `layers:["dc"]`, `desc`. `dc-history` is the research label; the current pack's layer key is `dc`. No `pgp` or `bom` OR-layer is added to these descriptions merely because a source mentions shared people or scripture. The JS—History account at PGP5 is not silently lowered by linking a D&C/JSP view at4.

All twelve minimal implementations are **nonspatial source views**. No new pins, coordinates, routes, `rel`, event-site edges or physical spirit-world position. RE16 and RE18 are explicitly unlocated document actions; RP06 city context on other records does not authorize a room/temple pin. Existing modern anchors and BA01–03 qualifications remain untouched by this specification.

Show the six accepted full dates in attributed prose, exactly as the CSV supplies them; omit numeric `when` for the codex view. This avoids manufacturing a continuous time span from multiple document milestones. If Claude separately proposes Chronicle records, source-specific event semantics and location choices need their own review; do not silently substitute a general city point or shrink all context to a single year.

- **1890-10-06**: acceptance, not the Manifesto's September24date. **1904-04-06**: stronger prohibition/discipline; no instant dissolution claim.
- **1918-10-03**: Joseph **F.** Smith's reported vision, not Joseph Smith Jr. **1918-10-31**: leadership submission/acceptance, not general-conference canonization.
- **1978-06-08**: printed letter date, not a newly verified first-publication date. **1978-09-30**: conference sustaining. Keep existing RE17 **1978-06-01** confirmation distinct.
- RC01: do not borrow **1829-05-15** from John-the-Baptist/Aaronic context to date Peter/James/John. **1835** is the earliest extant visitation record in the accepted JSP account, not an established date of that reported experience.

## Wording and evidence boundaries

RC06's accepted wording distinguishes Black men excluded from ordination from Black women and men excluded from temple endowment/sealing. Do not imply that Black members were excluded from baptism/membership, or that women were ordained in1978. The Church's stated removal/disavowal is attributed institutional history, not proof that discrimination ceased in every setting. No new demographic or lived-experience assertion is supplied by this tranche.

RC02 and RC04 state normative teachings, not proof of universal leadership or migration-company compliance. RC03 retains conditional salvation wording and D&C138's messengers, without mapping theological realms onto astronomy. RC05 is the Church's historical account of its transition, not a universal statement about all Restoration-derived movements. The source index identifies Church scripture/editorial headings, Church historical synthesis and the Church-sponsored JSP documentary edition; these are not counted as institutionally independent corroboration of one another.

Source URLs and exact accepted passages are in the CSV and original source register. Source keys R01–R20 are local to `restoration-inventory.md`; do not resolve them through another register with similar keys. Visible citations/locators must survive consolidation. Existing renderer-safe link support may be used; adding an arbitrary hidden `source` property is not evidence that visitors can find it.

## Acceptance checks for Claude, then exact-head recheck

1. Return a12-row implementation mapping with IDs, runtime list/item/subsection, source locator, gate and new implementation SHA; distinguish imported from consolidated. Verify RC03/04's previously partial content is now present, not just marked complete by association.
2. Evaluate actual pack/codex predicates for DC4 with `dc` enabled, `dc` disabled, other layers only, prior work3 and all-works. All12views must be gated coherently; they must not leak through shared BoM/PGP identity. Time filters must not fabricate lifecycle bounds for these reference cards.
3. Assert the six full dates and their distinct meanings, preserve RE17's separate date and existing RE08, and assert no additional site/route/coordinate or duplicate person/episode identity. Test “1835 record” versus unknown RC01 event date if expanded copy includes that detail.
4. Test visible attribution, citations and retained qualifiers in permitted rendered desktop/mobile checks. No browser/server workaround or rendered acceptance is claimed by this document.
5. Submit the exact changed head to ChatGPT for targeted content review and Claude's same-head technical evidence. Both tranches remain proposals until implemented and checked; whole-atlas BA01–07 and owner release gates remain intact.

## What is resolved and what is not

All12selected minimum views have sufficient accepted evidence. **No source-access blocker prevents this tranche.** No new scope approval is needed to render these attributed reference views within the existing comprehensive request. A04's dense-display deferral does not authorize dropping them. If the builder seeks omission or narrower scope, identify exact IDs and obtain an explicit disposition rather than treating absent coordinates as a blocker.

Unknown exact experience dates/venues remain unknown; they are resolved here by nonspatial representation and qualified prose, not fabricated research. Original manuscript collation, broader independent historical/lived-experience accounts, omitted other Restoration records and the rest of BA07 are outside this finite slice. The separate owner archaeology/LiDAR artifacts and approved schematic do not block it.

Run `python docs/universes/packs/lds-standard-works/ba07-spec/build-restoration-crosswalk.py` to reproduce the12source-row hashes, accepted date matches, resolved URLs, prior omission/partial status and nonoverlap with tranche1. Run the earlier spec and96/256inventory validators too. These checks verify specification integrity, not fresh reading, historical consensus or implemented behavior.
