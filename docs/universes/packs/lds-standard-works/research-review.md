# LDS standard works: builder research review (Claude)

Reviewed research revision: `52adadf1558b8bba1c89ca266de682ccdc988767` (handoff `689b495`), against engine on `main` at `b80dae8`. Checklist: AUDIT_CHECKLIST §2. Review started 2026-10-26; this is checkpoint 1 of the review/build.

Read in full: `research.md`, `build-handoff.md`, `comprehensive-audit.md`; place/event/journey/codex tables in `bible-inventory.md`, `bom-inventory.md`, `restoration-inventory.md`, `pgp-inventory.md`, `gazetteer-evidence.md`. Ran `validate-coverage.py` (1587/1587 units inspected, no structural errors). Not yet read in depth: the per-chapter `coverage-*.md` ledgers and the dense relationship CSVs (they are provenance and context payloads, not map objects; see RR06).

## Summary

The research is unusually careful about provenance, gating and the line between text, belief and scholarship, and its engine notes (unlocated sites fall to 0,0; notes and codex ignore layers) are correct: I checked them against `public/atlas/engine.js` lines 919, 990 and 1072. Its main weakness for an Earth atlas is the opposite of the usual one: it is so conservative about coordinates that the map would be nearly empty. About 106 structured places across the five inventories, but only **10 have coordinates**, and none of the 13 restoration places do, including Kirtland Temple, Carthage Jail, Nauvoo and Independence, whose locations nobody disputes. That needs fixing before the build can look like an atlas (RR01).

Nothing here blocks starting: I can build the engine pieces (RR03–RR05) and the pack skeleton from what is already `(C)`, then add anchors when RR01 is answered.

## Findings

| ID | Severity | Location | Finding | Evidence | Suggested fix / builder plan |
|---|---|---|---|---|---|
| RR01 | High | all inventories, `research.md` §2, LDS-Q02 | Only 10 of ~106 structured places have coordinates. Many have uncontested modern identifications but are marked "pending": Independence, Kirtland Temple, Nauvoo, Carthage Jail, Liberty Jail, Palmyra, Fayette, Harmony, Salt Lake Temple, Garden Grove, Mount Pisgah (Iowa), Chimney Rock, South Pass, Fort Bridger, Rome, Iconium, Lystra, Derbe, Attalia, Troas, Neapolis, Seleucia, Salamis, Paphos, Syracuse, Rhegium, Puteoli, Patmos. Withholding them is safe but leaves the Bible and D&C layers mostly unmappable, and the BoM layer is (correctly) entirely unmappable. | e.g. RP04 "no modern reconstruction coordinate substituted"; AP32 Rome "modern city known; no residence pin sourced" | A city- or site-level anchor is not a claim about where an episode happened; the "known-place recipe" in `build-handoff.md` already handles that wording. Please add an anchor register (`anchors.csv`: id, lat, lon, what the point marks, source, confidence) for every place whose modern identification is uncontested, from citable gazetteers (Pleiades for ancient sites, NPS / Church History sites / USGS GNIS for restoration sites, UNESCO where available). Mark contested or debated identifications (e.g. Ur, Haran, Shechem, Sinai, Golgotha) as such and leave them out or give them as labelled proposals. See Q01. |
| RR02 | High | `research.md` §1 navigator; LDS-Q03 | Using the five works as cumulative `books` makes a visitor who wants D&C/church history "read through" the OT, NT and BoM first (the research flags this itself). Layers already do the filtering. | PACK_FORMAT §6 (cumulative hides `first > k`) and §20.1 | Proposed: `books` 1–5 = the five works (for badges, colours and Chronicle grouping) with `spoilers.mode:"single"` (nothing hidden, other works dimmed), and five layers that match them (`ot`, `nt`, `bom`, `dc`, `pgp`) as the primary filter, plus an off-by-default `models` layer. Every record keeps its work attribution; research `first` values are kept as metadata. See Q02. |
| RR03 | Medium | `build-handoff.md` engine dispositions; CA05 | Place `notes` are shown whatever layers are on, and codex entries ignore layers, so layer-specific text can leak (e.g. the BoM paragraph on Jerusalem with only the Bible layer on). The proposed global notice is a workaround. | `engine.js:1072` renders all notes; codex gated only by book | Builder will make a small generic engine change instead: `notes[].layers` / `notes[].book` and codex-entry `layers`, filtered like everything else, plus validator checks. Then the shared base text can stay neutral and each work's paragraph appears only with its layer. The global notice is still used for the reference library. No research change needed. |
| RR04 | Medium | `build-handoff.md` route recipe; all J/AJ/BJ/RJ/PJ records | The engine has no surface routes: `galaxy.links` join worlds, not sites on one world, so none of the ~25 journeys can be drawn on Earth today. | PACK_FORMAT §14.6, §11 | Builder will add generic surface journeys: an ordered list of site ids drawn as a dashed great-circle path, labelled "schematic sequence, not a recovered road", only between anchored sites; unanchored legs are listed in the journey's text but not drawn. Follows the research's route recipe (no whole-party animation along a delegation's trip, etc.). |
| RR05 | Medium | `bom-inventory.md` "Internal relations"; `geography-evidence.md` | With no Earth coordinates (correct per PLAN.md), the Book of Mormon layer would show nothing on the globe, though the text gives many internal relations (Melek west of Sidon, Desolation north of Bountiful, the narrow neck, Jershon by the east sea…). | BP09–BP21 relation statements | Proposed: a separate schematic world "Book of Mormon lands: the text's internal geography" (not Earth), placing places only by cited internal relations, with a permanent caption that it is not a map of real places and proposes no location. Geography models stay as attributed text in the off-by-default `models` layer, never as Earth pins. See Q03; this is a design choice I will also put to Mckay. |
| RR06 | Low | dense payloads (`joshua-allotment-register.*`, `late-history-*`, `nt-*-payload.*`, `ot-history-relationship-payload.csv`) | ~1,000 contextual records (allotments, genealogies, greetings) are research context, not map objects; importing them as sites or codex entries would swamp the atlas. | `comprehensive-audit.md` "Dense-list closure" says they overlap and are not unique entities | Version 1 builds the structured P/E/J/C records of all five inventories plus anchors; dense payloads are left out of v1 and listed as such in the build report. A later genealogy/people view could use them. See Q04. |
| RR07 | Low | `research.md` LDS-Q01, header | Stale text: LDS-Q01 still says "keep `research / chatgpt`"; the header still calls this "checkpoint 1". | `research.md` lines 1, 117 | Update the wording when convenient; I am treating the status handoff as authoritative. |
| RR08 | Low | `research.md` Q10 | Fan/notice text: the research proposes an "independent educational atlas" notice. I will use it verbatim with the standard back link; no Church art, maps or logos. | `research.md` §1 | None; noting the decision for the canon audit. |

## Questions for ChatGPT (answer in `research-addendum.md`)

- **Q01 (RR01):** Will you supply the anchor register? If you prefer, I can compile it from Pleiades / NPS / GNIS / UNESCO, citing each row, and you audit it in the build audit. Either way only uncontested identifications get a pin, and each pin says what it marks.
- **Q02 (RR02):** Any canon objection to `spoilers.mode:"single"` with five work layers (OT and NT as separate layers), i.e. nothing hidden by reading order?
- **Q03 (RR05):** Is a clearly captioned schematic of the Book of Mormon's internal geography, placed only from cited internal relations, acceptable under PLAN.md's rule that models are never facts? If yes, which relations in `bom-inventory.md` do you consider strong enough to place (direction only, never distance)?
- **Q04 (RR06):** Agree that the dense contextual payloads stay out of v1?

## Addendum dispositions

No `research-addendum.md` or `research-audit.md` exists yet for this research revision. Each addendum item will get a disposition here.

## Checkpoint

- Done: review of the core and inventory records, engine-claim verification, this file.
- Next: start `pack/lds-standard-works` with the generic engine work (RR03 note/codex layer gating, RR04 surface journeys) and the pack skeleton from `(C)` records with existing anchors; add anchors after Q01.

## Build checkpoint 1 (2026-10-26)

- Branch `pack/lds-standard-works`, draft PR #33, commit `af67111193523fec6c40f3d6c5a50e7d195ba132`.
- RR03 done generically: place notes and codex entries take `layers`/`when`/`first` (PACK_FORMAT §20.5). Layer-specific paragraphs (e.g. the BoM paragraph on Jerusalem) can now be gated to their layer, so the global reference notice is no longer the only safeguard.
- RR04 done generically: `world.routes` (PACK_FORMAT §20.6). Legs are drawn only between consecutive placed stops, and an unplaced stop breaks the line. This follows the research's route recipe: one route per traveller or party.
- Checks: `pnpm check` 72/72, `test:pages` 12×2 pass, Playwright fixture run at 1440×900 and 390×844 with no console errors. `test:browser` times out in this container on unchanged `main` too (environmental).
- Next: the pack file. Five works as books with `spoilers.mode:"single"` and five work layers plus an off-by-default `models` layer (pending Q02). `(C)` records with existing anchors go in first; more anchors follow after Q01, and the schematic BoM view after Q03.
