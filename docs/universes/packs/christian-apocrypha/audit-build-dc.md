# Deuterocanonical semantic audit (slots 1–9)

Build: `8ae91333461bfeb989b570857a0aba321eaa34df`; research: `4dc7f444246ab0c5afffe90ee3fb1838b92493aa`. All line references below are `public/atlas/packs/christian-apocrypha.js` at that build head. Read-only audit; no implementation edits.

## Findings

- **Medium — line 449, `m2-01`: two letters given one date.** “They recall earlier correspondence of year 169 and are dated year 188” attaches both dates to both letters. RV 2 Maccabees 1:1–10a supplies the earlier correspondence and date for the first letter; the second salutation begins at 1:10b. Attribute 169/188 only to the first letter. [Selected RV primary](https://ebible.org/eng-rv/2MA01.htm).
- **Medium — line 332, `jdt-07`: siege duration becomes total water deprivation.** “After thirty-four days without water” overstates the text: the siege lasts 34 days, supplies fail, and water is rationed. Use “After thirty-four days of siege, water supplies fail…”. [Selected RV primary, Judith 7:20–21](https://ebible.org/eng-rv/JDT07.htm).
- **Medium — line 764, Nineveh:** “where the story begins and ends” conflicts with Tobit 14:12–15, where Tobiah settles at Ecbatana and lives out his remaining years. Remove “and ends”; the event `tob-14` already preserves the move. [Selected NABRE primary](https://bible.usccb.org/bible/tobit/14).
- **Medium — line 786, Egypt later addition, slot 6:** “Lysias is left over the lands west of the Euphrates, Egypt included” expands his remit into Egypt. RV 1 Maccabees 3:32 describes the remit as extending to Egypt’s borders. Replace “Egypt included” with “as far as Egypt’s borders”. [Selected RV primary](https://ebible.org/eng-rv/1MA03.htm).
- **Medium provenance — events lines 310–428:** 95/147 DC event side labels name no edition (14 Tobit, 16 Judith, 15 Wisdom, 44 Sirach, 6 Baruch), although source editions vary within these works. Restore the coverage-ledger edition in visitor-visible labels, particularly the RV fallback units; file comments do not identify each displayed witness. Examples: Tobit 2–6, Judith 3/6/7/8/13/14/15, Sirach 4, Baruch 1/4 use RV rather than the dominant NABRE.
- **Low clarity — line 326, `jdt-01`:** “He captures Ecbatana and summons peoples” suggests reversed order. Judith 1:7–12 has summons/refusal before conquest at 1:13–14. Reorder clauses. The conjunction is not explicitly chronological, so this is weaker than the defects above. [Primary](https://bible.usccb.org/bible/judith/1).

## Coverage actually performed

All **147 event entries**, **333 DC codex base entries** (219 places, 44 themes, 18 journeys, 52 people), and **63 later-work additions with slot ≤9** were read semantically. This is a complete displayed-content sweep of the assigned subset, not merely a count check. Compared all 147 event source-card copy fields, thematic/journey/person/relationship fields, and place descriptions against the research registry/dossier chapter inventories. Kept note-only names, recollections, nonspatial places, homonyms, and incompatible death accounts separate. Later additions were explicitly enumerated from the evaluated pack; count is 63, not an inference from total 77.

This does **not** certify an exhaustive individual disposition check of all 984 registry rows (including 482 typed edges). The 223 place-reference rows are not supposed to equal 219 place codex entries: three reused anchors and Habakkuk’s unnamed home endpoint account for the difference; the latter is represented textually in his journey. Likewise 20 journey records versus 18 journey codex entries require narrative disposition, not a simplistic missing-record finding.

## Fresh primary verification and limits

Fresh primary bodies checked: **10 distinct chapter units, 11 successful witness pages**: 2 Maccabees 1 (RV); Sirach 47,49,50 (NABRE); Judith 1,5 (NABRE), Judith 7 (NABRE and selected RV); Tobit 14 (NABRE); Baruch 1 (RV); 1 Maccabees 3 (RV). Links beyond findings: [Sirach49](https://bible.usccb.org/bible/sirach/49), [Sirach50](https://bible.usccb.org/bible/sirach/50), [Judith5](https://bible.usccb.org/bible/judith/5), [Sirach47 NABRE](https://www.biblegateway.com/passage/?search=Sirach%2047&version=NABRE), [Baruch1 RV](https://ebible.org/eng-rv/BAR01.htm).

USCCB Sirach47 returned403, but the same NABRE edition was read successfully at BibleGateway; this is an original-host access limitation, not an unresolved edition substitution. Rehoboam/Jeroboam are not in Sirach47’s versebody; note/heading distinction retained. An attempted RV Esther13 URL was unavailable and is not counted as verification (nor as a blocker: the selected Esther-B witness is different).

The remaining **137 of147 primary chapter/unit bodies were not freshly re-read in this audit**. Their rendered text was compared with the exact research handoff, not independently certified against freshly retrieved originals. Consequently §3 can claim complete assigned registry/dossier semantic sweep with targeted primary checks, **not full independent primary-source signoff**. No precise line-by-line edition/translation certification is implied.

## Research consistency question (not a confirmed builder defect)

The dossier’s stable-reference table places Babylon as early as slot1/Tobit14, whereas the integration registry and build start it at slot5. NABRE Tobit14:4 does mention Babylon. Reconcile the governing research artifacts before changing its badge; this discrepancy is inherited rather than clearly introduced by the builder.
