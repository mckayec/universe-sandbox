# BA07 tranche 8 — Book of Mormon textual journeys

2026-10-31. **Proposed specification, not implemented behavior or release approval.** PR33 is still open and unmerged at `c59c9bc13d848bbf0c4b3f3c64810bfa187749f0`; PR34 baseline is `787f1e04cb71d27e3535c81dd4b9211645e4d37d`. Current main guidance and handoff were read. Claude's lock continues to declare LDS BA01–07 work, but the published implementation has not changed. The lock, code and owned status remain untouched.

## Scope and source basis

The [11-row journey crosswalk](ba07-spec/bom-journeys-content-crosswalk.csv) covers **BJ01–BJ11**, all omitted primary BoM journeys. It contains minimum attributed copy, exact accepted title, travelers, ordered research references, passage/leg constraints, source URLs, work/layer/date/geometry decisions, source-row hashes, prior support references and per-ID acceptance checks.

These are new journey source-view specifications, not new episodes or entities duplicating the BE narratives. A shared rendered card may satisfy a BE episode and a BJ sequence only if both propositions, traveler roles and source-qualified ordering are present. Eight tranches now specify **119 distinct research source views**, not 119 required UI objects or a count of independent historical events. Earlier 108 views and original audits are unchanged.

Accepted evidence is reused from `bom-inventory.md` and `bom-record-support.csv`. The new minimum prose unpacks the already accepted journey constraints; it does not add sources, dates or geography. No primary passage was freshly read or capture provenance redated. The checker confirms links to previous support, not a new mental-reading or historical-certification claim.

## Text-first implementation plan

| Priority | IDs | Required distinction |
|---|---|---|
| 1 | BJ04 | Two threads: Ammon's outbound search and the later escape of Limhi's people. Initial descent from the hill camp involves Ammon and three companions; the escape goes around Shilom. |
| 1 | BJ05–06 | Alma's community settlement/escape in Mosiah and the later Alma's ministry in Alma 8 are different travelers/contexts. Preserve Helam's settled interval, Zarahemla's rest interval and the source-local travel durations. |
| 1 | BJ07 | Refugee community and consultation delegation are separate threads. The people wait in wilderness while the delegation goes to Zarahemla and returns; no whole-community detour. |
| 1 | BJ11 | Jaredite selected stages, with compressed earlier crossings/wilderness, a coastal camp and later voyage. Shelem is the brother of Jared's side excursion, not a whole-company port. |
| 2 | BJ01–03 | Lehi's selected stops, Nephi's later withdrawal with exact origin unknown, and the earlier Mosiah's move to Zarahemla. No unbroken recovered road or same-name actor merge. |
| 2 | BJ08–10 | Selected campaign stages, northward migration and early retreat are separate source sequences. Preserve omitted intermediate places and do not extend Pahoran's participation or bridge a later route to Cumorah. |

Implement as source-labeled reference paragraphs or ordered textual lists using the current codex shape `name`, `books:[3]`, `layers:["bom"]`, `desc`. There is no requirement for a new journey engine or graphical schematic. The CSV's `ordered_research_references` preserve accepted handles for builder mapping; they are **not** automatically valid runtime IDs or coordinates. The ordinary-language minimum copy resolves the principal labels so the text can be displayed without first implementing every BP place card.

Do not pass these sequences to `world.routes`, interpolate a great-circle path, use missing-coordinate zero defaults, or attach unlocated narrative stops to the existing Jerusalem marker as if that established the rest of the route. No `lat/lon`, `rel`, distance, modern coastline, polygon or exact ocean track is supplied. An already approved internal schematic is a separate implementation with its own relation evidence; it is not necessary for these reference views.

## Dates, actor roles and source precision

Omit numeric `when`. Preserve intervals and pauses as source-relative prose; do not turn days into kilometers or inferred absolute dates. BJ05's eight-day flight, settled Helam interval and later twelve days from the valley are not one continuous trip. BJ06's three-day northward movement applies to Melek–Ammonihah, not every leg. BJ01 is selected named stops and excludes return trips/intermediate camps; it does not claim the household moved as one undivided party on every intervening action.

For BJ02, the inventory's first-landing handle is broad earlier context. **Display “exact starting site unknown,” not an arrow asserting departure from the beach.** This is a clarified presentation of the accepted qualification, not deletion of a sourced endpoint. Likewise BJ07 should be two textual threads rather than a single list that accidentally sends everyone through Zarahemla.

Keep Mosiah in Omni distinct from the later Mosiah receiving Limhi/Alma; Ammon of the search party distinct from the son of Mosiah; Alma of Mosiah's community distinct from later Alma's ministry. Place names Lehi/Moroni do not merge with named persons. Arabian Bountiful, American Bountiful and the temple setting retain their separate source identities.

BJ11's source bundle includes Ether 3 to support the Shelem excursion exclusion as well as Ether 1–2 and 6 for group stages. A reference to that source does not put Shelem into the group itinerary. Earlier water crossings and the later sea voyage remain distinct. BJ10 stops at Joshua near the western sea; no modern country or later Cumorah route is inferred. No existing model map or owner archaeology/LiDAR artifact is needed to read these textual relations.

## Consolidation and source presentation

A reference card may group BJ04 with BE08/09, BJ05 with BE10/11, BJ06 with BE12, BJ08 with BE14, BJ09 with BE15, BJ10 with BE20, or BJ11 with BE22 only if each research ID has an explicit mapping and its required content remains. An episode summary alone is not a journey sequence, and a place list alone omits traveler changes and pauses. Do not count consolidation as new independent evidence or new historical occurrences.

Keep visible scripture passage locators with each segment or labeled subsection and use safe renderer-supported links to the CSV's official URLs. B-source identifiers resolve within `bom-inventory.md`. Raw research handles, hidden source fields or broken links are not visitor-facing citations. Narrated directions and divine actions remain attributed; do not infer archaeological authentication or ethnic identities from the text.

## Acceptance tests and returned handoff

1. Return all 11 BJ IDs mapped to actual runtime list/item/subsection, source locator, traveler thread, interval treatment, disposition and changed implementation SHA. If consolidated with BE records, show which sentence/list fulfills each obligation.
2. Test actual assembled-pack eligibility at BoM group 3, prior group 2, `bom` disabled with other layers only, and all-works. Citation and sequence qualifications must remain gated with their prose. Avoid mixed-work OR-layer descriptions.
3. Assert no route geometry, new coordinate or numeric date. Test BJ02's unknown origin; BJ04's four-person descent and separate escape; BJ05/06's pauses; BJ07's separate delegation; BJ08's limited Pahoran participation; BJ10's endpoint; BJ11's side excursion exclusion. Verify actual traveler-aware content, not just source-ID counts.
4. Resolve links only to existing runtime records, otherwise retain plain named source context. Check visible sequence order, citation reachability and readability on permitted desktop/mobile rendered tests. This document grants no rendered acceptance or browser/server workaround.
5. Return the exact changed head for ChatGPT content recheck and Claude's same-head technical evidence. Whole-scope BA07 accounting and BA01–06/release gates remain open.

## Evidence limits and next useful scope

No new source-access blocker prevents the 11 minimum textual sequences. Exact ancient dates, distances and modern locations remain deliberately unknown. A04's dense-display deferral does not blanket-defer these ordinary journey records; a proposed omission needs explicit disposition. This tranche specifies all primary BJ records, not supplementary BX journeys or the entire narrative geography.

Remaining primary work includes unlocated-place inventories and the outstanding AJ01 Exodus sequence, alongside supplementary families. A newly published PR33 remediation head takes priority for exact-head audit. Do not reread completed sources merely to populate another count.

Run `python docs/universes/packs/lds-standard-works/ba07-spec/build-bom-journeys-crosswalk.py` to reproduce the 11 rows, exact source context/hashes, gate 3, prior support and nonoverlap with the previous 108 views. The earlier tranche validators and original 96/256 validator remain applicable. These verify specification integrity, not fresh primary-source reading or implemented correctness.
