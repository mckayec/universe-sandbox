# LDS atlas — build contract and remaining acceptance criteria

2026-10-26. Research baseline: main `cd85ea8dcb36d4d5b54afd5ec05bc03c2c173d79`. This document integrates completed research records and identifies the actual gates to `research-ready`. It does not change the agreed scope or authorize a content build. The user authorized publication of the documentation branch and one draft PR; merge, deployment and contacting Claude remain excluded.

## What the agreement actually requires

| Requirement | Authority | Current disposition |
|---|---|---|
| One atlas with Bible, Book of Mormon, D&C/history and Pearl of Great Price layers; no transfer after only one layer | HANDOFF_PLAN.md §1.4.2, line41 | All four now have substantial selected records. Coverage is still uneven; full stage transition is not justified solely by the presence of four files |
| Major places, events, journeys and concepts across the works in scope | PROMPTS.md §1.4, line30 | This is a real breadth requirement, not a demand to index every verse. The owner subsequently chose comprehensive standard-works coverage. The individual-unit CSV ledgers now govern the omission sweep; a row alone does not establish full reading or integration |
| Citations, confidence, reading gates, structured entries and explicit exclusions | RESEARCH_TEMPLATE.md rules and §§1–8 | Each supplement supplies keyed records and sources. Cross-file integration and a final omission/gate pass remain; coarse work gates are an explicitly proposed navigation design |
| Unknown/model geography must not become factual coordinates | HANDOFF_PLAN.md §1.3; RESEARCH_TEMPLATE.md line13 | Satisfied by withholding geometry and separating narrative/proposed locations. A site does **not** need a fabricated coordinate to count as researched |
| Text / belief / scholarship distinguished | HANDOFF_PLAN.md §1.3; RESEARCH_TEMPLATE.md §8 | Narrative claims are attributed. Independent archaeology is not required to establish what scripture says; any historical/archaeological assertion still requires suitable evidence |
| Self-audit, independent second-source checks, builder review, technical checks and final joint approval | AUDIT_CHECKLIST.md §§1–4; WORKFLOW.md stages2–6 | These are later evidence/release gates. They should not be falsely reported as completed, nor all misrepresented as prerequisites for the first research handoff |

The owner explicitly selected **comprehensive** coverage on2026-10-26. A smaller overview is no longer an unresolved scope choice. Complete substantive screening, source qualification and integration before the research-ready transition. Keep `stage:research / owner:chatgpt`.

## Completed artifact manifest

| Artifact | Role / record namespace |
|---|---|
| `research.md` | Template-ordered core: P01–P20, E01–E13, J01–J03, C01–C07; common layers, framing and date policy |
| `sources.md` | Core S-source register and access limits; index to all supplemental registers |
| `geography-evidence.md` | Official Church position, three attributed model families, Arabian/Jaredite textual anchors; G sources and eight `bom-*` places |
| `bible-inventory.md` | AP/AE/AJ/AC records; 66-book coverage ledger; A sources; modern UNESCO anchors |
| `bom-inventory.md` | BP/BE/BJ/BC records; 15-book ledger; B sources; internal relations without Earth coordinates |
| `restoration-inventory.md` | RP/RE/RJ/RC records; R sources; documents, reported experiences, Missouri/Liberty, migration and declarations |
| `pgp-inventory.md` | PP/PE/PJ/PC records; PG sources; all five components, grouped unlocatable regions/rivers, facsimile attribution |
| `checkpoint-validation.md` | Historical validation of checkpoint1 only; its hashes deliberately identify that earlier version |
| `continuation-validation.md` | Historical validation and counts for the earlier integrated continuation |
| `coverage-*.md` / `coverage-*.csv` | Comprehensive per-chapter/section dispositions, witnesses, exclusions and unresolved work |
| `validate-coverage.py` | Reproducible canonical coverage and ledger-integrity check; not a research-ready certificate |
| `gazetteer-evidence.md` | Four additional scholarly representative settlement anchors, attribution and geometry limits |
| `comprehensive-audit.md` | Current research acceptance gates and integration audit |
| `identity-register.md` | Shared-place/person collisions and deliberate non-merges |
| `prominent-claims-audit.md` | Ten prominent claims with honest second-source dispositions |

The short uppercase IDs are research keys; the lowercase slug next to a place ID is its proposed engine ID. Never serialize `P08` as one site and `jerusalem` as a second site. Sources named in another file remain references to that file's register, not claims of a second independent source.

## Exact engine dispositions

Inspected `public/atlas/engine.js` at the baseline above:

- Lines989–991 turn missing site coordinates into zero, then may snap to land. Validator `tests/atlas-pack-validator.mjs:174–175` rejects that condition. **Do not put unlocated places in `world.sites`.** Merely omitting `lat/lon` is unsafe despite PACK_FORMAT §20.3's general wording.
- Lines919,929–931 apply layers/time to worlds, sites and events. A record can therefore have a verified modern marker and a separately labelled narrative event.
- Lines1071–1072 render all notes on a selected site without individual layer/time gates. Keep a shared site's base description and notes geographically neutral; put layer-specific claims in events or clearly titled reference entries.
- Lines1118–1121 gate codex entries by reading selection only; codex does not obey layer or time filtering. A **global reference library with an explicit notice** is a safe existing-engine option. Do not promise that disabling a layer removes its codex text. Fully synchronized codex filtering would require a separately reviewed engine change.
- PACK_FORMAT §12 allows `world:"earth"` events without `site`. A world-level event must say its narrative location is unlocated; it must never jump to an unrelated known city. Because PLAN.md's quality bar says every event points to a real place, the conservative default here is to keep unlocated episodes in the reference library until the builder/owner explicitly accepts a nonspatial Chronicle design. This is a design-policy conflict, not permission to invent a pin.

**Exact proposed global reference notice:** “This reference library includes all atlas layers. Work labels identify each source tradition. Entries without verified locations are not placed on the Earth map.” If cumulative work gating is retained, append: “The reading selection also limits which entries appear.”

**Known-place recipe:** use the cited heritage/visitor anchor; `modern` identifies the present place; `desc` describes what the marker actually locates; notes distinguish textual association from history. Do not attach an approximate city or visitor-center coordinate to a specific miraculous appearance as if it were surveyed.

**Unknown-place recipe:** codex item with `name`, `first`, and `desc` beginning with the work attribution; no `world.sites` item; no coordinate, `rel`, or imported route geometry. A cited internal relation can be shown as a text sequence or a separate schematic explicitly labelled unlocated. A model-specific graphic is not an Earth factual layer.

**Temporal recipe:** numeric `when` only for the cited year/interval. Uncertain ancient chronology stays in display text and omits `when`; `approx:true` means an approximate proposed date, not that evidence has become established history. Document-production/canonization dates must not replace narrated event dates. Year0 is prohibited by the validator.

**Route recipe:** all supplied J/AJ/BJ/RJ/PJ paths are ordered research references. No straight-line route geometry is approved merely by having endpoints. Distinguish travelers and intermediate delegations; do not animate a whole refugee group along a delegation's exploratory trip or an entire party along one individual's mountain ascent.

## Cross-file corrections and deduplication

1. P08 Jerusalem now has an OT anchor from 2 Samuel5 (bible-inventory A5). Its minimum navigator is1. Keep Luke and Lehi passages separately labelled; do not expose the BoM paragraph through the Bible-only base.
2. P20 Mount of Olives has an OT anchor in Zechariah14:4 (S30), so its minimum navigator is1, with `bible` and `pgp` affiliations. Its PGP-specific discourse text remains identified as such.
3. Reuse P12 Fayette, P14 Kirtland Temple and P15 Nauvoo in restoration records. A modern mailing address does not rename a historical township or prove an exact event point.
4. P10 American Bountiful is distinct from `bom-bountiful-arabia`; P19 Abraham's Jershon is distinct from the BoM Jershon; PP05 Cainan is not the similarly spelled biblical Canaan. New York's plates hill is not silently identified as the Book of Mormon battle hill.
5. Retain separate Abraham/Genesis journey accounts and their differing ages at Haran. Do not construct one harmonized age/date from both.
6. P17 Enoch’s city uses earliest navigator4 from D&C38:4; PGP-only name/detail labels remain navigator5.
7. Reuse one conceptual Eden record with source-specific descriptions if the Bible inventory expands it; never choose a physical garden location from name matching alone.

## Remaining work, without inflated blockers

**Needed for the comprehensive research-ready scope:** retain completed full-body coverage and close the remaining per-row evidence qualifications; review edition-specific headings, superscriptions and relevant footnotes omitted by fallback transcriptions; integrate chapter findings into stable place/event/journey/people/concept records; consolidate aliases, IDs, relationships and earliest reading gates; resolve cross-source discrepancies by attribution rather than harmonization; audit support and rendering dispositions. `comprehensive-audit.md` tracks these gates. This is unfinished accessible work, not an inaccessible-source claim.

**Rendering decision:** supplied anchors can be mapped; other locations have safe nonspatial reference dispositions. A builder must implement the explicit global-reference notice or obtain a separately reviewed filtering change. Exact coordinates for uncertain ancient names are neither feasible nor an acceptance requirement.

**Needed before final canon/release approval:** the agreed self-audit and independent corroboration of appropriate historical claims, resolution of unsupported `(L)`/`(U)` assertions, builder implementation review, exact-SHA technical and content sign-offs, then owner release approval. No draft PR, status note or research count substitutes for those steps.

**Genuine evidence/access limitations:** current Heartland primary pages returned503; a Maxwell Institute page returned403; independent excavation reports and the full Ritner scholarly edition have not been inspected. These constrain detailed modern model geometry and specific scholarly claims, not the ability to publish clearly attributed scriptural summaries. The date of the Peter/James/John priesthood appearance remains unknown in the documentary account; no additional search licenses guessing it. The NPS Winter Quarters sources differ on the month, so the researched copy uses autumn1846.
