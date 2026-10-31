# BA07 implementation specification: PGP and front-matter source views

2026-10-31. **Builder-ready specification, not a remediation signoff.** PR33 remains `c59c9bc13d848bbf0c4b3f3c64810bfa187749f0`; review baseline is PR34 `7539ff4e84478f11361736bfc0f1ad4d6c915278`. This finite slice translates accepted evidence into implementation decisions rather than repeating the96-object audit or62-category accounting. No new primary reading is claimed.

## Deliverable and exact scope

[minimum-content-crosswalk.csv](ba07-spec/minimum-content-crosswalk.csv) specifies **21/21 selected records**: PE02/03/06/08, PC01–08 and FM01–09. Every row contains priority, present representation, exact accepted research line/hash, proposed title, minimal neutral copy, engine work/layer fields, source URLs, disposition and a record-specific acceptance check. Twelve PGP records were already classified `not-represented-as-record` in the256-entry accounting; the nine FM views are supplementary and overlap existing identities. These are21 source-view specifications, not21 newly discovered entities, new sources or required map points.

Selection rationale: this closes clear PGP component/concept gaps and the front-matter source/gate ambiguity without requiring Earth coordinates, speculative geography, artwork or new engine capability. It does not close BA07's other Bible, BoM, Restoration or supplementary omissions. The original96/256 inventories and all BA01–07 findings remain unchanged.

## Implement in this order

1. **Nine priority1 rows:** FM01/04/05/06 and PC01–05. First separate publication/witness/plates views from later work-specific copy and keep facsimile/essay claims correctly attributed. Implement PC05 with the facsimile group so the explanation/translation distinction is visible, not hidden behind a general disclaimer.
2. **Twelve priority2 rows:** PE02/03/06/08, PC06–08, FM02/03/07/08/09. Preserve the separate creation accounts, Moses8's endpoint, all missing Articles-of-Faith groups, editorial ancestry qualification and collection histories.

The `minimal_neutral_copy` field is the minimum reviewed proposition, not a requirement to reproduce punctuation verbatim. Keep its attribution, source and limitations. Broader prose is permissible only with matching accepted evidence. Consolidation is permitted when the builder crosswalk maps each research ID to a reachable source-qualified subsection and preserves its gate; a generic work card or shared place name alone is insufficient.

## Concrete serialization contract

Use the existing codex shape `{name, books:[n], layers:[work], desc}`. The research `first` value maps to this pack's `books` array; do not assume a research-only `first` field controls the runtime. `n=3/work=bom` for FM01–07, `n=4/work=dc` for FM08, and `n=5/work=pgp` for FM09 and the12PGP entries. These are work-group gates, not publication chronology. Each view has **one work layer**. Do not place all claims in a combined `layers:["bom","dc","pgp"]` description: BA05's any-layer predicate would expose unrelated text.

Put the four PE narrative cards in a nonspatial narrative/reference list; put PC and FM entries in a clearly titled reference/explanatory list. An existing list may be reused. Keep source attribution and passage labels visible with the copy. The CSV provides exact source URLs; use a renderer-supported safe link mechanism if available, or visible source locator text with an accessible reference link. Do not inject unchecked HTML or assume that arbitrary added `source` fields are rendered.

**For all21 views:** no new `world.sites` object, `lat/lon`, `rel`, route geometry or pin-linked Chronicle event is required. Omit numeric `when` on these codex source views: their dates, where present, describe distinct reported episodes or publication milestones inside attributed copy, not a continuous time-filter span. Do not infer a date merely to satisfy serialization. Existing independently sourced dated events remain intact.

**FM01 / Palmyra:** reuse the existing Palmyra entity; no second city or new coordinate. Permit the neutral city/publication-setting facet from BoM3 with `bom` access. Separate detailed RE04 D&C publication history into its DC4 source view/notes rather than lowering all existing Palmyra prose to3. If the chosen source-view implementation uses a codex card first, explicitly retain the site-gate change as still open; adding the card alone does not close the supplementary Palmyra requirement. Do not import the current low-confidence coordinate as newly verified; BA02/03 anchor corrections still apply.

**FM04/05 / witness identities:** Three: Oliver Cowdery, David Whitmer, Martin Harris. Eight: Christian Whitmer, Jacob Whitmer, Peter Whitmer Jr., John Whitmer, Hiram Page, Joseph Smith Sr., Hyrum Smith, Samuel H. Smith. Preserve testimony-signatory/reports-seeing or handling roles; surname is not evidence of kinship. Reuse existing `dcp-` identities from3 for neutral names; add the already accepted `fm-person-christian-whitmer` and `fm-person-jacob-whitmer` identities only if structured people are implemented. No new people interface is required to display the names and roles in these two cited cards. D&C relationships remain4; no date or venue is invented for the testimonies.

**FM06 / plates:** reuse PP07/PE09 neutral hill/episode identities, not a second reported receipt. Separate BoM testimony at3 from JS—History at5. A statement about Moroni/plates does not unlock E08 First Vision or P11 woods details. Preserve “reports” and the source's reported1827date; no battlefield identification or archaeological claim. This slice does not add a modern hill pin.

**PC01–05 / facsimiles:** the source is the published explanation or Church essay. Preserve those words in the visible card. No image import, claim that the surviving fragments contain the Abraham narrative, independent Egyptological consensus claim or figure-by-figure scholarly comparison is justified by this slice. PC02 is not fulfilled by the existing C05 Kolob card. PC04's prophecy is not fulfilled by the P20 Mount-of-Olives setting.

**PC06–08 / Articles of Faith:** retain C06's article4 and C07's articles8–9. The new groups cover1–3,5–7,10–13 and can be separate source views or an explicitly sectioned PGP-only entry. All13 articles then have a declared grouping; that grouping does not certify a new full-text reading. Future hopes remain beliefs, not dated forecast events.

## Builder acceptance checklist

- Supply a21-row result crosswalk: research ID → exact runtime list/item or source-qualified subsection, disposition, source locator and implemented head SHA. If combined, list every covered ID; do not count the same generic paragraph as full coverage for unrelated claims.
- Evaluate the assembled pack and assert21source-view mappings resolve (not necessarily21new UI objects); preserve original identities, no duplicate Palmyra/receipt, no new coordinates, and required copy/attribution/source locators.
- Use actual `AtlasLayers`/codex eligibility behavior: with all time filters cleared, test a matching work layer at its group, that layer disabled, other layers only, prior group, and all-works. FM01–07 must not require4/5; the12PGP views and FM09 must not appear before5 or through `dc` alone. FM08 stays4/`dc`. Test Palmyra neutral visibility separately from its later notes.
- Assert account differences and negative claims: no completed Flood in PE06, no common creation epoch, no coming date in PC04, no new physical/palace/facsimile identification, and no exclusive ancestry statement in FM03. These are content assertions, not merely key/count tests.
- Test actual rendered card reachability, sources, readability and desktop/mobile filtering in the permitted technical environment. This documentation pass has not performed rendered checks and does not authorize a browser restriction workaround.
- Return the new exact implementation head and test results to ChatGPT. BA01–06 and remaining BA07 scope stay open until their own criteria are met; do not use21/21specifications as whole-atlas approval.

## Evidence, deferral and unresolved dependencies

The CSV copies or minimally prefixes already accepted paraphrases from `pgp-inventory.md` and `frontmatter-inventory.md`. Existing `core-pgp-audit.md`, `coverage-pgp.md`, front-matter witnesses and source registers supply prior evidence and qualifications; hashes here verify source-row identity only. No source was inaccessible for **this specification**, because it reuses accepted evidence rather than claiming new retrieval. The independent Ritner figure-by-figure comparison remains unavailable/uncompleted and is **not necessary for accurately attributed published-caption copy**.

A04's dense contextual display deferral does not cover wholesale omission of these21material source views. There is no unresolved content question that prevents the conservative specification above. If the builder proposes dropping a row, record the exact ID and reason for an explicit scope decision; do not manufacture an evidence blocker or silently call it dense. The owner-approved schematic and separate three archaeology/LiDAR artifacts are not dependencies for this slice.

Remaining independent ChatGPT work after this slice: prepare other bounded BA07 source-view specifications if needed, and review actual changed implementation when available. Remaining Claude work is concrete implementation plus same-head technical checks. The existing full-scope crosswalk remains necessary; this document is not a smaller release scope approved by implication.

Validation: `python docs/universes/packs/lds-standard-works/ba07-spec/build-crosswalk.py` reproduces/checks all21source rows, hashes, resolved source URLs, gates and prior12omission dispositions. Existing inventory validator still checks the96built payloads and256primary rows against the unchanged PR33 checkout. Neither validator certifies rendered behavior or fresh source reading.
