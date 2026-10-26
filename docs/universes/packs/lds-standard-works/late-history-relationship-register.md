# Late-history dense relationship and settlement payloads

2026-10-26. Integration continuation after recovery commit `d04d4c70b51ae3948f44675d2518b87a41a7f614`. This register makes the previously grouped dense lists usable as source-qualified reference content. It does not reconstruct a single historical family tree or turn settlements into modern coordinates.

## Files and exact scope

- `late-history-relationship-register.csv`: **829 verse-context records**, one for every numbered verse of the 19 selected chapters. Each retains the official KJV relationship/roster expression, ordered named labels, context, relation mode, qualification, gate1 and no geometry.
- `late-history-relationship-contexts.csv`: **145 contexts** dividing the lists into ancestral sequences, households, service divisions, settlement groups, return registers, eligibility statements, inventories and other distinct relations.
- `late-history-literal-relation-pairs.csv`: **182 literal short expressions**, overlapping the verse records. This is a conservative convenience index, **not an exhaustive graph of all parent/child edges**. In particular it originally retained only the first explicit pair in many ascending chains.
- `late-history-chain-payload.csv`: **47 ascending-chain segments**, expressing 170 source-qualified edges, including overlap with the preceding pair index. This closes the missing internal and verse-continuation links for the multi-member printed “son of” chains. Reuse the preceding segment's terminal mention where a chain continues into the next verse. Independent chains in the same verse remain separate: for example 1Chronicles9:8/12/16 and Nehemiah11:17.

| Official chapter scope | Numbered verse records |
|---|---:|
| [1Chronicles1–9](https://www.churchofjesuschrist.org/study/scriptures/ot/1-chr/1?lang=eng) | 407 |
| [1Chronicles23–27](https://www.churchofjesuschrist.org/study/scriptures/ot/1-chr/23?lang=eng) | 160 |
| [Ezra2](https://www.churchofjesuschrist.org/study/scriptures/ot/ezra/2?lang=eng), [Ezra8](https://www.churchofjesuschrist.org/study/scriptures/ot/ezra/8?lang=eng) | 106 |
| [Nehemiah7](https://www.churchofjesuschrist.org/study/scriptures/ot/neh/7?lang=eng), [11](https://www.churchofjesuschrist.org/study/scriptures/ot/neh/11?lang=eng), [12](https://www.churchofjesuschrist.org/study/scriptures/ot/neh/12?lang=eng) | 156 |

These overlapping row sets are not counts of distinct people, facts or independent sources. Non-genealogical verses within these chapters remain represented and typed rather than silently omitted.

## Integration contract

`record_id` identifies a source-verse view; `context_id` identifies its parent list. The ordered labels are **mentions**, not global identity keys. For a literal label used more than once, retain occurrence order. A roster member may be a family, collective, place, office or individual; consult `relation_mode` and the complete expression before making a person node. Place names called a person's “father” in a genealogy are not automatically city founders. Generic “sons/children of” may be a descent group, and an ancestral chain does not independently establish biological parenthood or consecutive generations.

Use the complete typed expression for plural children, sibling/spouse groups, descending “his son” sequences and lists whose pronoun referents are not unambiguous. Do not convert comma adjacency into kinship. Ambiguous pronoun attachment is a displayed source expression, not a hidden invented edge. The short-pair and ascending-chain indexes are derived views of that same expression. No additional conclusion is licensed by adding their counts.

Within an ascending chain, preserve repeated same-name occurrences separately. At a documented continuation boundary reuse the immediately preceding terminal occurrence; elsewhere identical spelling does not justify a union. Shared principal identities (David, Saul, Jerusalem, etc.) reuse the existing Bible integration registry only where its supporting identity is explicit. A source-qualified relation can attach to that shared identity without replacing conflicting relations from another text. Preserve the Pedaiah/Shealtiel parentage wording, Chronicles/Kings age differences, Ezra/Nehemiah return totals and spellings, and differing Saul-house lists. No adoption, levirate marriage, corrected total or reconstructed chronology is supplied to harmonize them.

All records have `layer:bible`, `first:1`. No coordinates, route polylines or numeric event dates are supplied. Settlements remain narrative references unless the independent gazetteer supports an Earth marker. Source bodies are KJV scripture; editorial study helps and independent historical arguments require their own attribution.

## Validation and source access

This continuation reused the retained official captures; it did not repeat full-corpus reading or fetch new source pages. All **829/829 stored expressions** match the corresponding retained official verse bodies after normalization of punctuation, spacing and case. All ordered labels and **182/182 short literal pairs** occur in their cited bodies. All145contexts resolve, and the829unit/verse keys cover each of the19chapter bodies without omissions. The47chain segments were checked against those expressions, including separate chains in a verse and preceding-verse continuations; they were not produced by concatenating all names in a verse.

The official captures are described and hashed in `ot-late-major-source-witnesses.csv`, under the private archive's `ot-late-major/unit-bundles/` directory. They are not included as raw captures in GitHub. Each CSV supplies a public official source URL and verse anchor. Capture hashes and text comparison establish witness availability and transcription consistency, not mental reading, independent history or theological truth. Earlier reading and qualification work remains documented in `coverage-ot-late-history.md` and `ot-late-major-record-audit.md`.

No missing primary body was found for these19chapters. Global identity decisions beyond supported reuse remain deliberately unresolved; they can be represented as separate source mentions rather than blocking an honest reference display. Final built-data cross-links, serialization, rendering and content approval remain later checks.
