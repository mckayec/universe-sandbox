# Integration, identity and navigation contract

2026-10-26. [work-gates.csv](work-gates.csv) assigns 39 stable navigation slots to the explicitly named work families. This is a browsing order, not a canon, composition chronology, or claim that all slots have accessible text. The number is a work-family count: distinct recensions, fragments and editorial sections remain identified within each slot.

## Gate conversion

The CSV maps `ledger` plus `ledger_work` to the global integer `first`. A deuterocanonical local gate is already 1–9. Expanded-OT `work:chapter`, related-tradition work keys and NT short keys must be converted through this table. NT ledger `first:1` is a provisional root value, **not** permission to expose all NT facts at the first work. The global mapping supersedes that provisional value. Preserve chapter/saying/codex-page locators as a separate unit field; never convert a codex-page gap into an unread chapter.

Every candidate record inherits its work's slot; a later revelation remains attached to its later local unit. For a shared geographic identity, the neutral label may use the earliest supported slot, while each source-specific event, description and era retains its own gate. Meqabyan slots with unresolved translation support remain disabled/audit-only; access does not upgrade U claims into buildable evidence. The 2 Esdras supplement overlaps the main expanded-OT chapter ledger; it is evidence for completion of those rows, not another twelve chapters in aggregate counts.

## Shared identities and deliberate nonmerges

| Identity case | Implementation rule and existing evidence |
|---|---|
| Jerusalem, Bethlehem, Babylon, Rome, Nazareth | Optional shared geographic anchor from [geography-reuse.md](geography-reuse.md). Dossier statements remain work-scoped. No event-site precision is inherited. |
| Jerusalem / visionary Zion | `vision-refers-to` where the text interprets the vision; never one geometrical polygon. See XE2-E01/P02 and XO-P05. |
| Babylon / Babylonia; Egypt / a city in Egypt | City and region retain distinct IDs; a region list is not a journey. See XE2-C04 and related-pseudepigrapha places. |
| Joseph / Joseph of Arimathea | Separate people: the infancy household and burial witness are not one biography. See PG parentage discussion versus PG9–15. |
| Mary the mother of Jesus / Gospel Mary's named Mary | Separate work-scoped identities; a scholarly identification is a typed interpretation, not a new name supplied by a damaged primary text. See NT `nta-gm-scene`. |
| Thomas in sayings / infancy title / apostolic Acts | Three distinct works and source-specific persons. A title is not authenticated authorship; Acts Thomas's brother claim is attributed narrative. |
| Peter's Gospel / Acts / Apocalypse | Distinct work records. Neither a shared title nor a narrator's attribution proves one author. |
| Eleazar in 3 Maccabees / martyr Eleazar in 4 Maccabees | No automatic identity link. See XO-R04 and XO-E07. |
| Greek Maccabees / Meqabyan | Distinct corpora, not translated aliases. See expanded-OT XO10 and work identity table. |
| English 2 Esdras / 4 Ezra core / Ethiopian Ezra Sutuel | Textual overlap crosswalk with differing contents and divisions, not interchangeable chapter citations. See XO10/11/13 and supplement. |
| Enoch in a story / attributed author / surviving manuscript | Person, authorship claim and document are different entities; manuscript dating does not date the narrated event. See expanded-OT chronology discussion. |
| Pseudo-Matthew / James infancy narrative / Infancy Thomas | `adapts` only with PM2's scholarly support; later expanded material is not evidence that every recension contained it. |
| Paradise / Hades / visionary heaven across works | Separate source-scoped settings, linked as comparison topics only. No shared surveyed location or physical altitude. |

These rules are grounded in the cited dossiers, not a fresh independent source-reading pass. No unlabeled historical kinship is inferred. Useful edge types are `narrates`, `travels-to`, `interprets-for`, `collaborates-with`, `related-as-in-text`, `tradition-identifies-with`, `adapts`, `variant-of`, and `preserved-by`. The source passage and attribution travel with the edge.

## Record/source accounting and acceptance

Chapter ledgers are evidence bundles. They retain many material associations beyond the selected display cards; they are not already serialized app records. Stable dossier card IDs, their exact passages, people/places and typed sequences constitute the research input. The builder must not generate additional unsourced propositions by splitting a bundle. Reference-only material can remain in the codex instead of receiving a globe pin.

An acceptable record has a stable source-scoped ID, type, work/first gate, exact passage and edition, supported display copy, explicit speaker/evidence kind, and a render disposition. Material places and journey endpoints need stable reference targets; unknown position is a valid research result. Numeric timeline dates require independent support beyond literary regnal names or bracketed editor calculations. Chronological disagreements stay visible.

The current research is not yet research-ready: remaining body access, extraction completeness, material cross-link resolution and prominent-claim checks must be accounted for separately. This contract closes navigation and identity policy, not all record-level acceptance.

## Current engine: work gates versus passage provenance

PACK_FORMAT §6 gates by book/work, not by chapter. For this proposed layer, selecting a work permits that work's complete selected-witness content; the UI should say so. Local chapter/saying/page values are evidence locators and ordering metadata, not an assertion that a chapter-level control already exists. A card spanning several units of the **same work** can appear at that work's global gate with an explicitly retrospective summary. A shared card spanning **different works** must separate later-work additions into `more`/eras with the corresponding global gate, or use separate source-specific cards. This implements the repository's earliest-book rule without requiring an invented chapter-navigation feature. Dossier warnings about later local clauses remain instructions to preserve provenance and avoid premature disclosure if finer controls are subsequently added.

[record-work-index.csv](record-work-index.csv) resolves every current integration-row ID to its source registry and global work slot. This join is structural: typed edges, mention references, thematic cards and narrative clusters remain different record kinds, not independent fact counts. The source registry controls confidence; U rows remain excluded even though their navigation slot resolves.
