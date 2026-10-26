# Related-traditions integration audit

Scope: `related-pseudepigrapha.md`, `marian-research.md`, and `pseudo-matthew-research.md` only. This is a finite index of their existing material records, not an audit of the entire pack or all manuscript traditions. No new primary-text research or expanded narrative scope was needed for this integration pass.

## Delivered inventory

`related-traditions-integration.csv` contains **156 unique records**: 39 places, 74 event/topic cards, 21 journeys, and 22 codex cards. Counts by primary work key are 33 Ascension of Isaiah, 25 4 Baruch, 27 Greek Pseudo-John Dormition, and 71 Pseudo-Matthew. Jerusalem RPP01 also has a 4 Baruch gate; its shared record is counted once.

The index preserves every existing dossier ID and points back to that ID instead of repeating the card body. Each row supplies type, work key, source tag and URL, passage, earliest local unit, typed links, and disposition. Dossier-local source namespaces remain explicit. The three source registers together contain 21 entries; mirror URLs and scholarly discussions are not 21 independent ancient witnesses.

`earliest_unit` means the first supporting local chapter or editorial unit, **not permission to disclose every later detail in a multi-passage card**. Preserve the passage-level gates from the dossier when rendering such cards; global numeric navigator mapping and full-card spoiler policy remain root integration work. Marian MU01–MU12 are editorial reading units defined in its coverage ledger, not manuscript chapter numbers. `additional_work_gates` contains the primary gate as well as any secondary work gate.

## Source and identity checks

- Ascension entries use the Charles translation actually read; heavenly stages remain visionary literary spaces. The fullest Ethiopic preservation does not establish a canon claim or geographical/astronomical location.
- 4 Baruch entries use the longer nine-chapter text actually read. The attribution correction remains visible in the dossier: the longer translation is Kraft and Ann Elizabeth Purintun, whereas William Newby is associated with the shorter form. The mirror's broad title must not replace that distinction.
- Marian entries use only the first Greek Pseudo-John account on New Advent 0832, ending before the Latin accounts. Thomas is already present in this account; no late-arrival or girdle episode has been imported. Peter's departure from Rome and Paul's Tiberia near Rome remain source-specific; Tiberia is not silently equated with Galilean Tiberias. Jephonias's attack belongs to the funeral procession.
- Pseudo-Matthew entries use the displayed Walker text on New Advent 0848. Chapters 26–42 are explicitly marked as the displayed later childhood continuation, not a uniform original core. Zelomi/Zahel and Affrodosius/Afrodisius are edition/name variants, not additional people. Sotinen/Sohennen remains an unresolved modern identification.
- Guardian Joseph (PMC02) and rich Joseph revived at Capernaum (PMC05) have explicit `distinct_person` links. Mary of Cleophas (PMC07) is not collapsed into Mary, mother of Jesus (MC03); the chapter 42 genealogy remains unreconciled with the opening parentage wording. No extra marriage or genealogical solution is invented.
- Cross-work Mary/Joseph card links are typed `related_character_portrayal_not_identity`: they identify related portrayals, not interchangeable biographies or a merge of a multi-person card into one person. No Thomas identity edge is inferred merely from a work's Thomas attribution or an apostle's appearance. Attribution names are not narrative character evidence.
- Bethlehem birth cave, stable, desert dragons' cave, and lions' cave retain distinct site records. Tomb, paradise, and heavenly soul reception remain distinct in the Marian account. Baruch's tomb and the eagle's destination outside Babylon are not merged.

## Link and disposition semantics

`mentions_place` is a passage association, not proof that an event happens at every mentioned place. `route_mentions_place` is likewise a set of cited route associations; the ordered journey and whether a leg is narrated, instructed, inferred, or visionary must be taken from the dossier. A mentioned or proposed route is not automatically a completed journey. RPJ02 explicitly retains its instruction-only disposition. The chapter 36 Jordan crossing has no asserted cave-location edge based solely on the preceding chapter.

No coordinates, modern gazetteer equivalences, historical proof, universal doctrinal claims, or canon status are inferred from these links. The record dispositions are ready for attributed textual integration under the chosen editions. They do not claim final canon-wide completeness or authorization to flatten distinct recensions.

## Validation and remaining work

Validation checked exact set equality between all dossier material IDs and CSV IDs, uniqueness, 156 rows, required fields, valid JSON link/gate values, closure of internal record links, and local gate bounds (11 / 9 / 12 / 42). All passed. Existing coverage ledgers remain unchanged: 20 related-pseudepigrapha chapters, 12 Marian editorial units, and 42 Pseudo-Matthew chapters plus three prefatory units. No dossier bodies were edited by this integration pass.

Remaining: root global navigator mapping, downstream schema conversion, passage-aware spoiler rendering, and any separately commissioned manuscript/edition comparison. No blocked read or denied action occurred in this integration pass. Earlier source-access limitations remain documented in the underlying dossiers; this index does not upgrade inaccessible editions into examined evidence.
