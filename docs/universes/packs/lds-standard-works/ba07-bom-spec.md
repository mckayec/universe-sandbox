# BA07 tranche3 — Book of Mormon nonspatial codex

2026-10-31. PR33 remains `c59c9bc13d848bbf0c4b3f3c64810bfa187749f0`, open/unmerged. Review baseline `0d8308caf5b8c319454083395293bc2e0319f887`. **Twenty proposed source-view specifications, not implemented corrections or canon/release approval.** This covers the complete BC01–BC20 registry in `bom-inventory.md`, all previously classified `not-represented-as-record`. It is a finite content specification, not another complete BoM reading or a new geographic model.

The [exact crosswalk](ba07-spec/bom-content-crosswalk.csv) provides every ID, current disposition, proposed title, minimum neutral copy, passage, official source URL, work/layer/date treatment, consolidation group, source-row hash, prior support-register reference and individual acceptance check. [Tranche1](ba07-remediation-spec.md) covers21PGP/front-matter views and [tranche2](ba07-restoration-spec.md) covers12Restoration views. This adds20nonoverlapping views: **53specified views total**, not53new entities, implemented objects or independent source validations.

## Why this slice and what can be built now

The existing BoM work is concentrated around migration, baptism at Mormon and appearance at Bountiful. The omitted BC registry supplies short-book narrative, record custody and theological/ethical teaching without requiring a modern location. Its whole20-record scope is supported by the existing accepted `bom-record-support.csv` and passage-qualified inventory. There is no missing coordinate or newly inaccessible source that blocks these attributed minimum descriptions. Source reading and support judgments are reused, not redated or presented as new primary verification.

## Ordered content plan

| Priority / IDs | Required content distinction | Safe consolidation |
|---|---|---|
| 1 — BC01–07 | Jacob/Sherem/Enos, Enos’s prayer, Jarom/Omni, Mormon’s editorial bridge, Alma preserving Abinadi, FourthNephi’s change from sharing to division, Moroni’s safety/farewell | A clearly sectioned “Records and communities” reference list. Keep seven labeled source views with their individual passages. Do not equate separate narrators or reorder narrative events as a global timeline. |
| 2 — BC08–14 | Holy Ghost instruction, ordination roles, sacrament prayers, baptism/community care, faith/hope/charity, children/baptism, Mormon’s wartime letter | A Moroni teaching/letters group is allowed. Preserve the distinction between Moroni recording and Mormon teaching/writing. BC10 needs both Moroni4 and5 sources; BC14 retains suffering and hope without added graphic detail. |
| 2 — BC15–20 | Blessings/discipleship, bread/wine action, covenant/gathering, scriptural study/record amendment, church/gospel teaching, three disciples’ desire | A3Nephi teaching group is allowed. Existing E07 Jesus-at-Bountiful copy does not implement these six claims. Future teachings stay prophecy/teaching; no newly located New Jerusalem or modern identities for the disciples. |

The CSV's `minimal_neutral_copy` is accepted paraphrase prefixed with “Book of Mormon” for visible attribution. Implement the proposition and its qualification; punctuation need not be identical. A combined card must have explicit source-labeled subsections and a crosswalk mapping all covered IDs. Merely listing a work name, shared actor or location does not import the view. Do not add all this copy to a generic place description.

## Exact implementation contract

Use the existing codex shape `name`, `books:[3]`, `layers:["bom"]`, `desc`. Research `first:3` is provenance; serialize to the current runtime `books` field. Keep numeric `when` absent for these reference views. No BC row supplies a numeric universal chronology for its complete prose; source chapter/verse and narrative succession remain visible instead. Text-order grouping is not archaeological dating or publication order.

All20views are **nonspatial**: no new `world.sites`, `lat/lon`, `rel`, route line, distance, archaeological reconstruction or pin-linked Chronicle event. An unnamed forest in BC02 does not need a guessed site. BC17's gathering is teaching about a future hope, not an executed itinerary. Narrative promises in BC20 do not establish observed modern persons or biology. Withholding these unsupported fields resolves the representation decision; it is not a research failure.

Use visible source locators and the official URLs supplied in each row. Resolve B-source keys through `bom-inventory.md`; local IDs in other registers are not interchangeable. Use only renderer-supported citation/link mechanisms. A hidden custom property or a broken application link to a research ID is not visitor-accessible sourcing. Do not inject unchecked HTML to create links.

### Avoid these false consolidations

- **BC10 vs BC16:** Moroni4–5 prayer text and3Nephi18 narrated bread/wine action are different source views. They may share a theme, but neither substitutes for the other; preserve both URLs and labels.
- **BC11/BC13 vs C03/E06:** community care and children/baptism teaching are not the already built Mosiah18 baptism episode. Do not imply one episode proves compliance with all later norms.
- **BC04/BC18 vs FM02/FM07:** Mormon’s editorial explanation, Jesus’ instruction to amend a record, and later published front-matter provenance are different claims/evidence levels. Preserve scripture narrative versus editorial framing even though all are BoM-group3.
- **BC05:** Alma who preserves Abinadi’s words in Mosiah17 is not automatically the later Alma appearing elsewhere. A neutral named reference need not create a new duplicate person object, but actor relations must remain source-specific.
- **BC08/BC09:** named office/discipleship roles are textual roles, not proof of perpetual tenure or identity with every same-titled group. The12disciples in Moroni2 are not automatically the Jerusalem Twelve.
- **BC06/BC14:** narrative reports of division, violence and suffering remain attributed. Do not convert polemical descriptions into the atlas’s judgments about modern peoples. BC14’s supplied paraphrase is deliberately non-graphic; embellishment is unsupported.
- **BC07/BC12/BC13:** spiritual invitation, charity and baptism doctrine are the text’s claims. Visitors are not instructed that the atlas independently verifies a religious test or adjudicates another tradition’s practice.

## Acceptance tests and returned evidence

1. Return a20-row mapping from BC ID to runtime list/item/subsection, visible source locator and implemented SHA. If consolidated, verify each proposition separately. Keep existing C03/E06/E07 and earlier53-view bookkeeping distinct from newly imported content; an ID count is not a content test.
2. Evaluate actual assembled-pack codex eligibility at group3 with `bom` enabled, prior group2, `bom` disabled/other layers only, and all-works. No BoM claim should appear solely because `nt`, `dc` or `pgp` is enabled. Test citation/subsection visibility together with its prose, not just the parent list.
3. Assert no new site/coordinate/route/time span for any BC ID. Test source/actor distinctions in BC04/05/08/12/14, both chapter sources in BC10, both Moroni1/10 sources in BC07, and distinct BC10/BC16 and BC04/BC18 coverage. Verify the BC17/20 future promises have no calculated fulfillment dates or modern geographic identities.
4. Test visible copy and source reachability, card length, reading/layer filters and desktop/mobile readability in the permitted technical environment. This specification has not run rendered checks and does not authorize a restricted browser/server workaround.
5. Give the changed exact implementation head to ChatGPT for content recheck, followed by Claude’s same-head technical evidence. BA01–07 and the remaining full-scope import/consolidation/omission crosswalk remain open.53specified views is not53fixed findings or whole-atlas readiness.

## Deferral and remaining dependencies

A04 permits dense contextual display deferral; these20short material codex views are not approved for blanket omission. All have sufficient accepted evidence for the conservative content above. If the builder proposes dropping IDs or materially narrowing copy, report the exact IDs and rationale for explicit scope disposition; do not relabel absence of geometry as inaccessible evidence.

Remaining external questions about archaeological correspondence, precise ancient dates and modern geography are intentionally not answered by these narratives. They do not block this nonspatial slice. Original source-capture limitations remain in the accepted provenance documents; no new capture/reading evidence is invented here. Other BoM place/event/journey inventories and supplementary BX families remain outside this tranche, as do the still-needed OT/NT and other BA07 dispositions. The separately requested owner archaeology/LiDAR artifacts and already-approved internal schematic are not prerequisites for implementing BC01–20.

Validation: `python docs/universes/packs/lds-standard-works/ba07-spec/build-bom-crosswalk.py` checks all20source rows/hashes, official URL agreement with the prior support register, gate3, prior omitted status and nonoverlap with the earlier33views. Prior tranche validators and original96/256inventory validator remain applicable. These are specification-integrity checks, not fresh source verification or implementation approval.
