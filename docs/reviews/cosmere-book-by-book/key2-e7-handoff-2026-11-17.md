# K2-E7-01 — bounded identity narrowing; backstory details deferred

ChatGPT · 2026-11-17. Source-based web search/open research; no separate Deep Research product used.

**Finite e7 source unit completed in one checkpoint: 2/2 replacement clauses supported by opened MB01 text.** The existing combined backstory is not certified. Hand one text-only replacement to Claude; defer the detailed Mare/power-acquisition account. No new per-work mapping or parent promotion.

## Exact scope and branch reconciliation

PR48 `feature/cosmere-reading-state`: **7989e8dc8c5583d6bf5e8138f595979f74630a99**, pack **1958cee1afd4a8536f6a5a8145fbc40fb7b413b6**. e8 narrowing was independently accepted in [implementation-review-k2e8-7989e8d.md](implementation-review-k2e8-7989e8d.md); preserve it.

PR48 e7 at pack line **749**:
`id:e7, book:2, world:scadrial, site:hathsin, title:"The survivor of Hathsin"`.
Current text combines survival, his wife's fate and acquisition of every Allomantic power. No own gate/gates/lm/fx. The Hathsin site at line 162 has a mixed description including later cosmology, schematic coordinates, books:[2] and until:6; it has no own record gate. This handoff does not approve that site record or expose it earlier.

Fresh older PRs read through GitHub:
- PR24 `fix/lore-corrections`: **cf25cda66e91c573c421a0f3712623db72737a3b**, pack **3ff0aab059fa54e00f6e2ccc7b849d4bd206d958**. Same existing e7 sentence.
- PR37 `atlas/deep-worlds`: **03394c32816fcb5c95261bf6a9ea4520381a5838**, pack **5a74e300eaf88b2d3c81fa9bc957584cd4708e33**. Parsed pack confirms **e7 absent**. Its e74 is Elend's last stand, a different event. Do not restore e7 there or touch e74. This packet targets PR48 only; PR24 remains unchanged.

## Opened evidence

All URLs below were opened during this run. Primary excerpt, author commentary and publisher synopsis are distinct evidence types; multiple pages from the author are not independent witnesses.

| Tag | Source / locator | Finding and limitation |
| --- | --- | --- |
| P1 | [MB01 prologue, author-hosted sample](https://www.brandonsanderson.com/blogs/blog/mistborn-prologue), Tepper identification and Mennis conversation (retrieved lines 216, 258–259) | (C, primary excerpt) Identifies Kelsier as the Survivor and describes his scarred hands/forearms. Mennis compares his scars with those of a man sent to Hathsin. That comparison supplies context; it is not a direct account of Mare's death or the complete escape sequence. |
| P2 | [MB01 chapter 3, author-hosted sample](https://www.brandonsanderson.com/blogs/blog/mistborn-chapter-three), Camon's recognition (lines 228–233) | (C, primary excerpt) Camon uses the Hathsin title and then identifies Kelsier. This directly supports the replacement's identity clause. The recognition occurs in the crew's lair, not a newly located scene at the Pits. |
| A1 | [MB01 Part One annotation](https://www.brandonsanderson.com/blogs/blog/annotation-mistborn-part-one), lines 119–121 | (C, author commentary) Connects the part title to Kelsier. Corroborates the title's use; no full survival/Mare sequence. |
| A2 | [MB01 chapter 14 part 2 annotation](https://www.brandonsanderson.com/blogs/blog/annotation-mistborn-chapter-fourteen-part-two), lines 119–125 | (C, commentary) Discusses the failed intrusion with Mare, Kelsier's later Mistborn status and an interpretation of the Pits' psychological effects. It does not establish each clause's first reveal. |
| A3 | [MB03 chapter 17 annotation](https://www.brandonsanderson.com/blogs/blog/annotation-mistborn-3-chapter-seventeen), “Kelsier's Snapping”, lines 122–125 | (C, later-book commentary) Explicitly connects Snapping to seeing his wife killed. Supports a backstory detail as commentary, but cannot by itself establish its MB01 reveal point or certify “every” power. Do not backdate later commentary into an earliest-reader gate. |
| M1 | [Tor/Macmillan Secret History synopsis](https://us.macmillan.com/books/9781250859143/mistbornsecrethistory/), Book Details, line 51 | (C, publisher synopsis) Connects Hathsin imprisonment with later Mistborn/revolution activity. Not the original scene, no detailed Mare account, no MB01 first-reveal proof. A separate publisher page is not treated as a demonstrated independent textual witness. |

Additional discovery checks: opened author-hosted chapter 2 (no Hathsin/Mare match), chapter-17 parts 1/2 annotations, prologue-part-2 and chapter-2 annotations, and the original-trilogy portal. They did not supply the missing MB01 backstory scene. Attempting the author-hosted `/blogs/blog/mistborn-chapter-four` returned **not accessible via this tool**; that is an access limitation, not a claim that the chapter or page does not exist. Unverified full-text mirrors and Mistborn Prime/deleted versions were not used as published canon.

## Clause dispositions

| Existing component | Outcome |
| --- | --- |
| Survival of Hathsin | Supported in context by P1/A1 and retrospective M1, but no complete escape-scene audit. Replace the narrative summary with directly observed identity wording. |
| His wife did not survive | A3 supports her death as later commentary. Exact MB01 scene/reveal not retrieved; omit from this event text, defer detailed restoration. This is not a claim that it is false. |
| Came out with powers | A2/A3/M1 provide context, not a complete source-level sequence at MB01's reveal. Omit/defer. |
| “Every” Allomantic power | Exhaustive scope was not established from opened primary passages. Omit; do not equate a general Mistborn label with a verified universal quantifier. |

**4/4 existing components dispositioned, not 4/4 canon-verified.** The replacement has two small claims (identity and visible scars), both directly supported by P1/P2. Earliest verified work: MB01; full title explicitly located in chapter 3, with prologue context. This records a source locator, not permission to change the gate.

## K2-E7-01 — Medium source-precision narrowing

Change only `events[id=e7].text` to:

> Kelsier is known as the Survivor of Hathsin; scars cover his hands and arms.

Support: identity [P2] (C, primary excerpt); scars [P1] (C, primary excerpt). It deliberately does not narrate a new recognition event at Hathsin. Retain the existing title, id, book, world, site and array position; no new record or field gates, landmarks, effects, dates, journeys or power taxonomy. The retained site is a legacy association, not certification of its mixed text, location or geometry.

A local in-memory candidate changed only this property; restoring it made the entire parsed pack equal to the original. **0 application edits and 0 new implementation tests claimed for this proposal.** No change to e8, e6/e12, e9–e11, registry, presets, parent chains or previous CBR/SH/MB corrections.

## Builder return and continuation

Claude implements K2-E7-01 on PR48 and returns:
1. Exact head and one-field application diff, payload read-back and unchanged surrounding records/gates.
2. Relevant checks with actual results, separating failures and unavailable checks. Keep the existing browser-smoke line-88 failure explicit; PR47 does not repair this branch by implication.
3. Allowed and withheld e7 evidence at 1440×900 and 390×844, plus legacy/All wording parity. Preserve full-trilogy ancestor restrictions; no parent relaxation to reveal the new text. Screenshots may use the same bounded dossier approach as K2-E8.
4. implementation-review/chatgpt before further content work.

After that review, next research unit is e9's MB02 siege/three-armies claim, under the same two-checkpoint cap. Do not reopen deferred MB09 or the detailed e7 backstory without new source access or an explicit finite scope.

## Known gaps and counts

- One of the original five held prose units (e8) implemented and accepted; a second (e7) now has a finite narrowing handoff. **1/5 implemented/accepted; 2/5 with dispositions; 0/5 whole events newly certified.**
- **2/7** key-2 events mapped (e6/e12); **0** new mappings; **0/2** parent promotions; **0/33** full-work approvals.
- e7's original detailed backstory is deferred, not marked researched-complete. e8 location and e9/e10/e11 prose remain held; site descriptions and coordinates remain outside this narrowing.
- Primary excerpts support **2/2** replacement clauses; **0** full novels read, **0** independent second textual witnesses, **0** new gate authorizations.
- This closes the bounded source unit by conservative scope reduction; it does not certify incomplete research or start a new universe despite the WIP limit.
