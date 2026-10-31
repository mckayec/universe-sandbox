# BA07 tranche5 — Book of Mormon narrative episodes

2026-10-31. **Proposed content specification, not implemented corrections or approval.** Fresh PR33 is still open/unmerged at `c59c9bc13d848bbf0c4b3f3c64810bfa187749f0`; review baseline `504446852bf67108868a9d71976fbd8554b98101`. The remote implementation branch and main LDS status are unchanged. These checks show no new published implementation on PR33, not proof that no private work exists.

## Scope and evidence

The [23-row crosswalk](ba07-spec/bom-events-content-crosswalk.csv) covers **BE01–BE23**, the complete primary BoM event registry, all classified `not-represented-as-record` in existing accounting. It specifies minimum attributed copy, exact source chronology wording, people/place/passage context, official URLs, work/layer gates, consolidation, prior support references and per-ID acceptance checks. It does not add or recount BJ journeys, BP places, BC explanations or supplementary BX records. Alongside the previous62disjoint views, **85source views are now specified across five tranches**, not85implemented objects or independent historical confirmations.

Accepted evidence is reused from `bom-inventory.md` and `bom-record-support.csv`; no chapter was newly read or source access redated. Narrative positions and miraculous claims remain attributed to the Book of Mormon. BE08 retains its prior `corrected-supported` status: the accepted correction distinguishes initial encounter from the formal audience after imprisonment; the other22rows retain `supported-text`. The source-row hashes check repository integrity, not reading provenance. Existing capture limitations remain disclosed in the research archive/manifest documentation.

## Implement coherent groups, retaining each source view

| Order | IDs | Builder decisions |
|---|---|---|
| 1 | BE06–11 | Nephi/Zarahemla community narratives: earlier Mosiah’s movement, Benjamin’s assembly, Ammon/Limhi audience and escape, Alma’s Helam settlement and deliverance. Preserve the two independent escape threads and distinguish earlier/later Mosiah and the two Ammons. |
| 1 | BE17–19 | Destruction, healing and rebuilding are separate actions/source views, not one generic Bountiful appearance or an unchanging city description. Keep Zarahemla burning and Moroni sinking distinct; exact rebuilding year is unknown. |
| 2 | BE01–05 | Lemuel camp, Nahom burial, Arabian ship command, landing and later withdrawal/settlement. Modern locations remain unadopted; do not conflate Arabian and American Bountiful or treat landing beach as the proven departure point for later withdrawal. |
| 2 | BE12–16 | Alma’s ministry, Nephihah founding, Moroni/Pahoran campaign, northward migration and Samuel. Preserve narrative judge-years, actor roles and source-local directions, without a common CE/BCE conversion. |
| 2 | BE20–23 | Keep Mormon’s retreat/Cumorah thread separate from Ether’s arrival/final-gathering thread. Canonical reading order is not a single uninterrupted chronology; no invented route connects these episodes. |

A grouped reference list or sectioned card is acceptable, provided each BE ID maps to a reachable, source-labeled subsection and every proposition/qualification is retained. Related existing Lehi, baptism or Bountiful context does not itself import these episodes. Reuse stable narrative identities from the accepted research; no duplicate place/person objects are required. Research P/BP/BJ handles are not automatically runtime links—resolve actual targets or show plain source context instead of broken links.

## Gates, location and date policy

Use current codex shape `name`, `books:[3]`, `layers:["bom"]`, `desc`. All23minimum implementations are **nonspatial narrative/reference views**. Despite the research label “event,” this tranche does not authorize pin-linked Chronicle entries, new sites, routes, `lat/lon`, `rel`, distances or modern archaeology associations. Unlocated records must not acquire a zero coordinate or an unrelated known site. No map or schematic implementation is required to display the text.

Retain the CSV's `source_chronology_text` visibly as a labeled narrative chronology/limit alongside the attributed description. Omit numeric `when` for these reference views. This resolves the minimum implementation without selecting a scholarly chronology, assuming calendar equivalence or conflating narrative eras. Specific safeguards:

- BE08: forty-day wandering and a formal audience two days after imprisonment are different intervals; do not reduce the encounter to an immediate audience or send all16searchers into the initial encounter.
- BE10/11: eight-day flight precedes settlement at Helam; later escape is one day to a valley and twelve after leaving it. Keep the settlement/pause; do not advertise a continuous13-day route or convert travel time to kilometers.
- BE12–16: judge-year labels and Helaman’s sequence remain source-local. Different events may span years; no guessed event day or BCE arithmetic.
- BE17: year34/month1/day4 is narrative notation, not a newly established CE timestamp or correlation with a modern geological disaster. BE18 supplies no exact day; BE19 supplies no exact construction year.
- BE20/21: narrative327retreat and gathering after384years are not interchangeable battle dates. Preserve survivors in BE21; no physical identity with the New York hill or battlefield is established.
- BE22:344days belongs to Jaredite water travel. It is neither Lehi’s crossing duration nor evidence of an ocean distance, departure coast or arrival coordinate.
- BE23: Shiz camps at Ogath; Coriantumr camps at Ramah. Do not send both through one route or invent deaths beyond the scoped gathering passage. Ramah/Cumorah textual identity does not prove a modern site.

These instructions retain accepted chronology; they do not revise the source inventory. If larger narrative expansions add another date/actor/scene, cite the appropriate accepted extension and recheck it rather than inheriting approval from this minimum.

## Consolidation and uncertainty boundaries

The BE entries and existing BC tranche can share themes but remain different source views. BE18healing is not E07’s appearance or BC16bread/wine. BE19rebuilding is not BC06’s entire community/division history. BE21Mormon’s defeat is not BC07Moroni’s later farewell. Distinguish Moroni the military leader, Moroni the recorder and Moroni the city through context; do not join same-name entities mechanically.

Visible citations must identify the actual passages and source URLs from the crosswalk. BE10 has multiple chapter sources; BE18 distinguishes the3Nephi17healing passage from3Nephi11setting context. Use safe renderer-supported source links/locators; a hidden arbitrary property does not establish visible sourcing. Proposed quote-free paraphrases may be edited for clarity only if their attribution, sequence and qualifiers remain intact.

Retain narrative geography fairly without asserting archaeological proof. Nahom burial is not an excavated grave identification; Nephihah's “between” relation is not a coordinate solution. If expanded copy encounters the already documented Nephihah textual tension, preserve it rather than silently repairing scripture. These minimum views need neither the separate owner archaeology/LiDAR artifacts nor a decision about modern BoM models. The internal schematic is already approved, but this specification does not implement or certify it.

## Acceptance and returned handoff

1. Return23BE IDs mapped to actual list/item/subsection, source locator, date treatment, disposition and new implementation SHA. Verify semantic coverage separately from counts; consolidated subsections must retain each claim.
2. Evaluate actual assembled-pack eligibility at group3 with `bom`, at prior group2, with `bom` disabled/only other layers, and all-works. Sources and chronology must share their prose gate. No multi-layer shortcut that exposes later/unrelated work text.
3. Assert no new coordinate, physical route, duplicate identity or numeric date from these rows. Test source chronology strings and the separate actor/sequence guards above, particularly BE08/10/11/17–23. Resolve links only to existing runtime targets.
4. Test readable source/chronology labels, card length and desktop/mobile filter behavior in a permitted technical environment. No browser/server workaround or rendered claim comes from this docs pass.
5. Return exact changed head to ChatGPT for content recheck and Claude's same-head technical/rendered evidence.85specified views does not mean85fixed findings or release readiness; the full BA07 import/consolidation/omission crosswalk and other BA01–07gates remain open.

## Genuine remaining dependencies

There is **no new source-access blocker for these23minimum attributed views**. Unknown places, absent ancient dates and narrative travel intervals are deliberately represented without precision. A04's dense-display deferral does not permit silently omitting these ordinary narrative records; a proposed omission or scope reduction needs explicit disposition.

Remaining work includes implementation, other primary place/journey inventories, supplementary families and whole-scope acceptance. Broad historical corroboration, modern archaeological identifications and detailed map geometry would require their own evidence; they are not prerequisites for this nonspatial handoff. Existing source provenance limits remain in force; no fresh validation is invented.

Run `python docs/universes/packs/lds-standard-works/ba07-spec/build-bom-events-crosswalk.py` for23unique rows, prior omission status, exact chronology/source-row hashes, URL agreement with existing support and nonoverlap with the earlier62views. Prior tranche validators and original96/256validator remain unchanged. These verify specification integrity, not primary rereading or implemented behavior.
