# The Eye of the World — source intake and build requirements

Recorded: 2026-11-09. Scope: an initial, targeted primary-text review of Robert Jordan, The Eye of the World (The Wheel of Time, book 1), from the owner-supplied ebook. This is required input to the Wheel of Time pack's research and build, not a completed full-book audit or release approval.

## Source and coverage

Source tag: WOT-EOTW-OWNER-01. Use book/chapter or glossary-entry locators below; edition-specific page numbers have not been verified. The supplied edition includes "Ravens" and a preview of The Great Hunt. Do not publish the ebook, extracted text, private file identifiers or private download links in this public repository.

Reviewed material includes selected opening passages, chapter 4's stories, chapter 12's channeling explanation, chapter 23's wolf communication, chapter 52's revelations and artifacts, and glossary material. Narrative coverage is selective; all 53 chapters have NOT been read and audited in full. No live implementation was compared.

Evidence notation: (C) = directly supported as a statement or event in the cited text; this does not turn an in-world belief into omniscient fact. Design requirements below are requirements, not additional canon.

## Required build scope and acceptance ledger

Every row requires a disposition in research-review.md and a mapping to implemented records/components in build-report.md. Allowed dispositions: implemented with evidence, explicitly deferred with reason and follow-up, or excluded with an evidence-backed explanation. Silence does not close a row.

| ID | Requirement | Source / acceptance |
|---|---|---|
| WOT-EOTW-01 | Separate book 1, its glossary, the edition's Ravens opening, and the appended book-2 preview in source ingestion. | (C) These sections are present in the supplied edition. The Great Hunt preview must never inherit a book-1 spoiler gate. Preserve edition provenance for Ravens. |
| WOT-EOTW-02 | Provide an interactive magic reference covering saidin/saidar, the Five Powers, channeling/training/risks and angreal. | (C) Ch. 12 and glossary entries Five Powers, channel, angreal, gentling. Distinguish source-era explanations from later-book refinements. Do not invent numerical strength, power costs, universal recipes, or unsupported cross-system interactions. |
| WOT-EOTW-03 | Model wolf communication separately from One Power channeling. | (C) Ch. 23: Elyas explicitly rejects the channeling explanation; communication uses feelings/impressions and names resist exact verbal translation. Do not implement wolves as ordinary talking pets or channeling summons. |
| WOT-EOTW-04 | Build chapter/book-gated character, affiliation, encounter, object and revelation connections. | Design requirement: every edge needs source, evidence type, first appearance and meaning-revealed gate. Research must populate actual relationships; this intake does not certify an exhaustive graph. |
| WOT-EOTW-05 | Preserve calendar provenance and uncertainty on the timeline. | (C) Glossary opening distinguishes AB, FY, FF and NE and explains disputed/lost records and calendar changes. Do not fabricate exact conversions or dates for undated travel. |
| WOT-EOTW-06 | Include an optional Easter-egg/reference layer for Lenn, Salya, Mosk, Elsbet, Anla and Materese. | (C) Ch. 4 contains these story references. Specific real-world identifications remain unverified here and need separate evidence plus interpretation labels. Do not label literary parallels as literal cross-universe travel. |
| WOT-EOTW-07 | Include source-linked artifact entries for the Horn of Valere, Dragon banner and broken seal. | (C) Ch. 52. Separate discovery, characters' explanations and demonstrated behavior. Later uses or identities need their own later-book evidence/gates. |
| WOT-EOTW-08 | Preserve character belief and uncertainty rather than presenting every statement as world truth. | (C) Ch. 52: Rand claims the Dark One is dead; record this as his claim. Glossary Ba'alzamon entry qualifies the identification as believed. Do not silently resolve identity with later-book knowledge. |
| WOT-EOTW-09 | Test first-appearance versus meaning-revealed gates across all information surfaces. | Acceptance: locked relationships/identities must not leak through map edges, search, tooltips, labels, counts, accessible text or deep links. Downgrading reader progress must remove now-ineligible content. |
| WOT-EOTW-10 | Integrate findings into the world-only atlas, not only a disconnected reading report. | Acceptance: research/source records -> graph/timeline/artifact/magic components -> evidence-mapped build report -> exact-revision canon and technical reviews. Unverified geometry remains schematic; no invented coordinates, journey durations or astronomy. |

## Known gaps

| Gap | Impact | Blocks build? |
|---|---|---|
| Full chapter-by-chapter evidence and connection inventory unfinished | No claim of exhaustive characters, events, appearances or Easter eggs | Blocks exhaustive-content sign-off; not an honestly scoped initial build |
| Later Wheel of Time volumes not reviewed here | No later revelations, confirmations or advanced magic may be sourced to this intake | Blocks those additions until separately sourced |
| Real-world Easter-egg identifications unverified | Names may be listed as textual references; interpretations remain unconfirmed | Blocks confirmed-identification claims |
| Maps, distances, detailed travel chronology and character visual specifications not audited | Atlas needs its own primary-source evidence pass | Blocks unsupported precision/assets, not schematic UI work |
| No implementation branch/head, rendered checks or builder receipt yet | This document proves source intake only | Blocks claims of incorporation, canon approval or deployment |

## Required next actions

1. ChatGPT: on queue activation, read this intake first and carry WOT-EOTW-01 through WOT-EOTW-10 into research.md and sources.md using the repository template. Finish a bounded evidence checkpoint and follow the research cap with explicit Known gaps.
2. Claude: at research-ready pickup, acknowledge this intake's exact revision in research-review.md, disposition every ID, and implement supported portions. The magic page and connection map are explicit requested scope, not optional omissions.
3. Claude: return the implementation branch/head and per-ID content/component/check mapping in build-report.md. Record any deferred requirement and concrete next action.
4. ChatGPT: verify incorporation and spoiler behavior against that exact returned revision; preserve separate technical and owner release gates.

This intake does not change queue order, certify full-book reading, transfer builder ownership, or approve release.
