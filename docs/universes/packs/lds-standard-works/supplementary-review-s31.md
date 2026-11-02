# Supplementary review S31 — Brunson closure and BMC representation

Audited implementation: `dc36cd0653c33439b4f2e31ee71cbf4b5b7a1b47`; baseline: `6295f7243d2fb4495544e804fc2ad011053f975c`. Bounded parallel review; Claude retains implementation ownership. No release approval.

## Disposition and coverage

**S30 Brunson source enrichment is closed.** Exactly one of 1,523 cards changes: `DCM-dcp-seymour-brunson` now says “Doctrine and Covenants — Named in 75:33; 124:132.” and directly links both official chapters. The 4/dc gates and Aaron Johnson/high-council links are unchanged. SD0969 is the only changed mapping row; generator input and provenance preserve the correction. This reuses the official D&C 124:132 reading documented in [S30](supplementary-review-s30.md), rather than claiming another primary-source pass. [Official section 124](https://www.churchofjesuschrist.org/study/scriptures/dc-testament/dc/124?lang=eng) supplies the high-council replacement context.

The other 1,522 cards, all non-codex pack data, 381 links, engine JS/CSS, layer helper and both crosswalks are unchanged. All 1,271 SD imports / zero pending remain accounted in 1,365 mapping rows. No new integration relations or omission rollup are implemented. Prior source judgments and focus/completing-frame code closures carry forward only for unchanged code/data.

## Builder answer — proceed with independently gated BMC source views

The builder is correct: **BMC-001–239 are chapter-reference research keys, not 239 existing runtime cards and not a requirement to invent 239 new places or events.** Earlier loose references to “239 BMC cards” must be read against the explicit [chapter coverage contract](coverage-bom.md#full-book-of-mormon-review-coverage-ledger). The contract is in the paragraph beginning “Chapter coverage contract”; preserve the full chapter ledger and its exclusions regardless of runtime representation.

Proceed with selected, independently gateable **3/bom codex source-view entries** for actual shared-entity quotation/vision/mention relations, with stable identity derived from chapter key, entity and mode. Consolidate only when the chapter locator, mode and entity remain recoverable. This is an implementation answer, not a new research prerequisite or scope reduction.

**Do not implement the proposed edge gates as ignored metadata.** At this head `cxSeeRef` reads only `k` and `r`. An edge's `books` or `layers` fields do not constrain it. A layer-filtered target still exposes its name and relationship label; only a work-locked target hides them. `cxItem` does not render independently gated nested child records, and `more` gates on work position only. Therefore:

1. Put the BoM-specific copy and source link on an actual 3/bom source-view entry. Safe initial direction: source-view → existing biblical codex entity. Preserve the target's own gates and distinguish vision, quotation, teaching and mention.
2. Do not put a revealing reciprocal BoM label on an OT-only parent unless separately implemented edge gating covers label, preview and navigation. Adding metadata alone is not a fix. Do not put this content in `more` and assume layer isolation.
3. The current See-also resolver supports codex keys and `ev:` event IDs, **not a `site:` prefix**. For Nazareth/Jerusalem, keep the source view nonspatial and cited, or link an existing appropriate codex/event target. Do not fabricate an event solely to navigate a site. A genuine site-navigation extension needs its own semantics and gate tests.
4. The helper's 101 name hits are discovery leads, not an exhaustive or accepted relation inventory. Check each ledger finding and exclusion; reject namesakes explicitly. Preserve biblical Jerusalem versus the BoM city, and namesake Jacob/Ammon/Aaron/Gideon/Sidon/Jordan/Gilgal identities.

### Minimum source-grounded examples

These reuse the accepted BMC ledger; no fresh reading or implementation is claimed. Use precise locators in visible source links, not just an unlabeled chapter URL.

| Research key | Minimum attributed copy and relation | Official locator / safeguard |
| --- | --- | --- |
| BMC-011 | “In Nephi's vision, he sees Nazareth and Jerusalem.” Mode: vision, not travel. | [1 Nephi 11:13,32](https://www.churchofjesuschrist.org/study/scriptures/bofm/1-ne/11?lang=eng). Do not locate the vision's high mountain or claim Nephi visited these cities. |
| BMC-039 | “This chapter quotes Isaiah's account concerning Judah, Damascus and Samaria.” Mode: quotation. | [2 Nephi 17:1–9](https://www.churchofjesuschrist.org/study/scriptures/bofm/2-ne/17?lang=eng). No Nephite journey, local pin or imported modern chronology. |
| BMC-108 | “Alma's teaching recalls Melchizedek, king of Salem, and Abraham's tithes.” Mode: teaching/mention. | [Alma 13:14–18](https://www.churchofjesuschrist.org/study/scriptures/bofm/alma/13?lang=eng). Not Alma's travel; preserve Salem identification uncertainty. |

For acceptance, publish a reproducible ledger of chapter key/verse, entity identity, mode, target ID, actual rendered source-view ID, source, and implemented/consolidated/omitted reason. Explicitly account for rejected scan hits and relevant ledger rows outside the scan. Test BoM-only, OT-only, mixed layers and work downgrade: no BoM-specific copy/label exposed in an excluded layer, no navigation bypass, no invented spatial edge. Preserve unknown dates and geometry. The examples above are not a substitute for the complete selected-relations inventory.

## Reproducible validation and evidence limits

- [Pure VM probe](supplementary-review-s31/probe.cjs), [result](supplementary-review-s31/probe-result.json): exact one-card delta, preserved other pack fields/engine/crosswalks; demonstrates ignored per-edge gate fields, visible filtered relationship label and unsupported `site:` prefix. Uses actual pure functions, no DOM/browser/server.
- [Accounting and isolated generator check](supplementary-review-s31/accounting.py), [result](supplementary-review-s31/accounting-result.json): two runs reproduce pack, mapping and both crosswalks byte-for-byte against accepted register `9cc874c09a3686119ca6b4c17c7e16f214fd7ab6`.
- **53/53 exact-head local tests pass:** `node --test tests/lds-pack.test.ts tests/atlas-layers.test.ts`; [output](supplementary-review-s31/unit-results.txt).
- Exact-head implementation [CI 41433074963](https://github.com/mckayec/universe-sandbox/actions/runs/41433074963) completed **success**; build, unit tests, distribution check and standalone pages step passed; deploy skipped. This resolves the previous head's missing exact-head CI at this successor, without retroactively claiming the skipped head had a run. `test:pages` is not `test:browser`.

No new screenshots or device evidence are supplied in this delta. Prior SwiftShader/emulated input evidence remains automation, not physical-phone/native-select or real-GPU acceptance. No new independent rendered result or full browser-smoke result is claimed.

## Remaining release handoff

Claude can proceed now with BMC quotation/vision source views, timeline/source-vision relations and the explicit omission/consolidation rollup. Imports are complete; integration is not. Return the resulting exact head and final same-head 4K/laptop/phone, full keyboard traversal, touch/native-select, settled finished-bake and real-GPU evidence, clearly separating actual hardware from emulation. Final content/technical acceptance and specific-PR owner approval remain open. The Church display naming stays intact. Basemap, synchronoptic timelines and Cosmere diagrams remain separate nonblocking follow-on work. No status/lock edits, application edits, approval, merge, deployment or release occurred in this review.
