# Comprehensive research acceptance audit — in progress

2026-10-26. Baseline main `cd85ea8dcb36d4d5b54afd5ec05bc03c2c173d79`; earlier published research checkpoint `f13e28a3fbe53bd2b57ef4b5799e628984251cb3`. This audit concerns the subsequent working-tree continuation, not a release sign-off. The owner chose comprehensive standard-works coverage. No Deep Research capability was available or claimed.

## Evidence and coverage contract

The coverage universe is1,587 units: Bible1,189 chapters, Book of Mormon239, D&C138 sections plus2Official Declarations, PGP16 chapters plus3published facsimile explanations. Each unit has a distinct ledger row with source, depth, substantive disposition/exclusion and remaining work. Articles of Faith's13 statements, JS—History's appended account, D&C declaration appendices and relevant front matter are handled inside the companion research files, not silently excluded by chapter arithmetic. Bible superscriptions and edition-specific apparatus require explicit review where the fallback witness omits them.

`inspected` means the complete unit body was actually read in the disclosed witness. It does not imply an official-edition comparison, independent historical corroboration, all possible atomic claims extracted, or implementation approval. `text-partial`, `heading-only`, `pending` and `access-blocked` remain visibly incomplete. The CSV source URL can identify the target official page while the evidence column identifies the actual fallback witness. Read both. Source copies and repeated editions are not independent corroboration.

Run `python docs/universes/packs/lds-standard-works/validate-coverage.py` for current counts and structural failures. Its unit check detects duplicates and omissions; it deliberately cannot certify research-ready. Chapter summaries and record families must not be added to the earlier264 structured content records as if they were unique entities.

## Open acceptance findings

| ID | Severity | Location | Finding and evidence | Required disposition | Resolution |
|---|---|---|---|---|---|
| CA01 | High | `coverage-*.csv`, companion MD | All1587 unit bodies are now fully read, with substantive chapter/section dispositions; explicit nonspatial and repeated-material exclusions are retained. | Complete actual body reading and substantive place/journey/event/chronology/people/concept screening; retain honest exclusions for nonspatial or repeated material. | Body-screening complete; integration and official apparatus checks remain CA02–03 |
| CA02 | High | Bible coverage evidence/remaining columns | Disclosed third-party KJV bodies enabled systematic reading; all1189 numbered Bible bodies are now compared with official captures. Material headings/superscriptions/JST/footnotes have separate bounded audits; edition apparatus must not be inferred from body equality. | Review atlas-relevant omitted apparatus; cite official source for doctrinal/editorial interpretations; preserve witness distinction for each unit. | Numbered-body comparison complete; bounded material-apparatus and source-specific integration review continues |
| CA03 | High | `research.md`, inventories, new chapter families | New chapter findings are not yet fully reconciled with stable existing records, aliases, earliest reading gates and typed relationships. | Produce a deduplicated integration disposition for every material finding, including additions and deliberate reference-only exclusions; verify all cross-links. | Partial; integration-reconciliation.md supplies shared aliases/typed links/gates, while final per-record checks continue |
| CA04 | High | Historical and proposed-geography assertions | Complete textual screening would establish textual claims, not archaeological or historical truth. The ten-claim source/independence matrix is in `prominent-claims-audit.md`; whole-corpus low-confidence/prominent-claim totals required by AUDIT_CHECKLIST remain incomplete. | Complete whole-corpus checks beyond the bounded ten-claim matrix; distinguish primary textual statements, Church teachings, scholarly interpretations and independent historical evidence; label inaccessible evidence. | Partial; core-pgp-audit.md now rechecks73/73 records; whole-corpus shard ledgers continue. Ten selected claims have honest independence dispositions, not ten independently verified events |
| CA05 | Medium | `build-handoff.md`; baseline engine989–991,1071–1072,1118–1121 | Unlocated-site coordinate fallback and ungated notes/codex can misrepresent location or leak layer-specific content. | No unlocated `world.sites`; neutral shared base copy; global reference notice; no invented route geometry. Resolve navigator design and eventual builder implementation before content approval. | Safe documentation recipe supplied; implementation not performed |

These five research findings are separate from the five PR24 re-review blocker groups in `docs/reviews/lore-corrections/implementation-review-r2.md`. That completed review remains unchanged and is not superseded by this research audit.

## Corrections already incorporated

- Bethlehem now has earliest OT navigator1 through Ruth1; its Nativity marker remains a modern commemorative anchor, not Ruth's arrival point.
- Ur now has OT navigator1 through Genesis11; Abraham's PGP narrative stays separately attributed.
- Mount of Olives now has OT navigator1 through Zechariah14:4; Matthew and JS—Matthew material retains its own work gates.
- Enoch’s city now has D&C navigator4 through38:4; Zion is already named there at4; the PGP City of Holiness name and additional community details remain navigator5.
- J03 now separates reached Abraham2 settings from the intended continuation toward Egypt; the chapter does not narrate a completed arrival in Egypt.
- D&C collection description includes section7's translated-record attribution, not only modern revelation genres.
- Facsimile1's deliverance narrative cites Abraham1 as well as the published explanation; an image caption alone is not substituted for narrative evidence.
- Priesthood restriction wording now specifies the midnineteenth century–1978 rather than asserting an undifferentiated pre1978 rule.
- Four representative scholarly settlement anchors are documented in `gazetteer-evidence.md`, bringing the researched anchor count to10. Their location supports a settlement marker, not an exact biblical event point. Eight coordinate components were checked for six-decimal rounding.

## Tensions that must survive integration

The companion ledgers preserve source differences rather than reconciling them by inference. Examples already identified include Genesis/Abraham departure ages; Genesis/Moses/D&C Enoch ages; Numbers/Deuteronomy Aaron death place and itinerary; Chronicles/Kings royal ages and chronology; Gospel genealogies, anointings and resurrection sequences; Acts conversion-account differences and speech-versus-narration; Alma's retrospective chronology and inconsistent city-capture notices. None authorizes fabricated dates, locations or merged travel episodes. Prophecy, parable, vision, intention, accusation and actual narrated travel must remain distinct record types.

## Source limits versus unfinished work

Official scripture access is generally available through the web tool; temporary rate limits are managed by pacing. Shell retrieval403 is a tooling route limitation, not evidence that the scripture is inaccessible. Full scholarly books/excavation reports and some model websites remain unavailable or uninspected as specified in existing source registers. They restrict those particular historical/model claims, not the rest of the canonical reading pass. Absence of independent corroboration is reported; it is not repaired with another copy of the same scripture.

No `research-ready`, canon, technical or release sign-off is issued here. The subsequent universe queue starts only after substantive LDS completion and audit, as the owner directed.
