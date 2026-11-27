# MB10 — e47/Bilming residual audit and bounded deferral

ChatGPT · 2026-11-19 UTC. **Second bounded MB10 source unit, following the 2026-11-16 era-status handoff.** Full-work research remains incomplete and is now deferred under R3. The accepted era-10 implementation is not reopened. This report gives a finite disposition of the remaining e47/Bilming pair, not an implementation request or whole-record approval.

## Exact repository evidence

Fetched the actual `public/atlas/packs/cosmere.js` files through GitHub at all three heads. Independently revalidated their Git blob hashes with the existing read-only inventory runner during this run, then evaluated the same files in Node VM contexts and recursively selected `id: e47`, `id: bilming` and `id: shaw`.

| PR / branch | Exact head | Pack blob |
| --- | --- | --- |
| 48 / feature/cosmere-reading-state | 52534d0975af39e620e05a43c2f4f05dc6b4b1fc | 0fd66c7cca0085872e8f8a3d2154e4010356b9e6 |
| 24 / fix/lore-corrections | cf25cda66e91c573c421a0f3712623db72737a3b | 3ff0aab059fa54e00f6e2ccc7b849d4bd206d958 |
| 37 / atlas/deep-worlds | 03394c32816fcb5c95261bf6a9ea4520381a5838 | 5a74e300eaf88b2d3c81fa9bc957584cd4708e33 |

**3/3 input hashes verified; 6/6 pair-record slots read**, plus **1/1 PR37 Shaw landmark**. PR48 and PR24 selected pairs are identical. PR37 preserves their common prose but extends the event and site scene. Parsed paths: Bilming is `pack.worlds[15].sites[23]` in all three; e47 is `events[46]` in PR48/24 and `events[87]` in PR37.

Common e47 record:

```json
{"id":"e47","book":10,"world":"scadrial","site":"bilming","title":"The Set in Bilming","text":"Wax finally confronts the secret society behind years of crimes, and its link to a power from off the world."}
```

PR37 additionally has `lm: "shaw"` and `fx: "battle"`.

Common Bilming fields:

```json
{"id":"bilming","name":"Bilming","lat":-1.17,"lon":-0.8,"books":[10],"desc":"The Basin’s other great port, on a peninsula, with the tower called the Shaw. The Set’s stronghold in The Lost Metal.","since":6}
```

PR37 additionally supplies a port/industrial/large/dusk/clear scene, west-facing coast, Shaw skyscraper and harbour. Its targeted Shaw record is:

```json
{"id":"shaw","name":"The Shaw","kind":"skyscraper","at":[0,0.2],"h":2.2,"books":[10],"desc":"The tower at the heart of Bilming, stronghold of the Set."}
```

No own `gate` or `gates` occurs on these selected records. This records payload shape, not effective visibility through all ancestor/engine conditions. The harbour and other scene values were visible within the site object but are not independently canon-approved. No map, scene rendering, selector test or application suite was executed.

## Sources actually opened

Ordinary source-based web research only; no separate Deep Research product. Firecrawl's credit refusal from the earlier MB08 unit remained in force and was not retried. Separate web retrieval remained usable.

| ID | Source and locator | Evidence class and access |
| --- | --- | --- |
| LM-R | [Authorized serialization: chapters sixteen through eighteen](https://reactormag.com/read-the-lost-metal-by-brandon-sanderson-chapters-sixteen-through-eighteen/), Brandon Sanderson, November 7, 2022 | Opened the actual page and successive body portions through its copyright footer. Read all three serialized chapter bodies, separating story from synopsis and reader comments. This is an excerpt, not the complete novel or later Bilming climax. |
| LM-P | [Macmillan/Tor book page](https://us.macmillan.com/books/9780765391193/thelostmetal/), Book Details, ISBN 9780765391193 | Opened publisher synopsis and metadata. Supports a Bilming/Set connection and outside influence at premise level; not the precise event, map geometry or chapter-by-chapter chronology. |
| LM-L | [Tor promotional page](https://read.macmillan.com/lp/the-lost-metal-by-brandon-sanderson/) | Opened; repeats publisher synopsis. Not an independent narrative witness. |
| LM-E | [Everand ebook listing](https://www.everand.com/book/747007311/The-Lost-Metal-A-Mistborn-Novel), ISBN 9780765391209 | Initial open returned catalog/synopsis; subsequent find calls returned 410. The actual [Read preview link](https://www.everand.com/read/747007311/The-Lost-Metal-A-Mistborn-Novel) returned reader shell, preview-end and failed-load messages, no story body. No reading through that route claimed. |
| LM-F | [Earlier authorized prologue/chapter 1–2 route](https://reactormag.com/read-the-lost-metal-by-brandon-sanderson-prologue-and-chapters-1-2/) | This run's open returned 403. The historical chapter-2 evidence underlying the accepted era-status field is preserved, not described as freshly reread here. |

Two secondary source leads were searched and then opened: [Independence Tower](https://coppermind.net/wiki/Independence_Tower?mobileaction=toggle_view_mobile) and [Bilming](https://coppermind.net/wiki/Bilming). Both opens returned 403. Search output suggested later chapter locators 39/58 for the tower and 61/66 for the confrontation; these are **unverified routing leads**, not opened primary passages or independently verified chapter assignments. No full-text mirror was used.

## Three narrowly supported observations

From LM-R, with character perspective retained:

1. In the Steris section, Marasi speaks of a god from another world. This is a character statement, not complete cosmological or identity verification.
2. In the concluding Marasi section, she proposes using a local gang's delivery to Bilming for a sting.
3. She says the next shipment is scheduled in three days, while Wax and Steris plan separate investigation.

**3/3 observations supported at excerpt scope.** They establish investigation context only. Do not rewrite e47 as that earlier sting while leaving its later-climax title/attachment implicit, or infer that Wax's final confrontation occurs in this excerpt. No new atlas wording or gate is proposed.

## Six residual dispositions

| Unit | Result | Reason and action |
| --- | --- | --- |
| e47's complete confrontation text | U — held | The opened excerpt and synopsis support the investigation premise, not the complete later confrontation, its participants, outcome or timing. Neither confirm nor declare the existing sentence false. |
| e47 Bilming attachment and PR37 Shaw/battle attachment | U — held | The exact later scene was not opened. Keep the location/landmark claim under the existing PR37 canon hold; no new pin approval. |
| Bilming port/peninsula/tower description | U — held | No primary geographic passage or authorized map for those clauses was obtained. |
| Bilming as the Set's stronghold | L/U — held | Publisher synopsis supports a strong connection but does not certify the exact compound site description or all its implications. |
| Coordinates and PR37 Shaw/scene details | U — held | No support for exact latitude/longitude, scene geometry, height or architectural rendering from this excerpt. |
| Record disclosure, earliest work/chapter and whole-record mapping | U — held | Existing bucket numbers and the accepted era-status field are not a source audit of these complete records. No new gate or parent promotion. |

**6/6 residual groups dispositioned as holds; 0/2 selected complete records certified; 0/1 Shaw landmark certified.** These counts are separate from the three supported excerpt observations. The source gap does not itself prove an error, justify a fabricated replacement, or grant permission to release held content.

## Known gaps and bounded stop

| Gap | Impact | Blocks build? |
| --- | --- | --- |
| Later Bilming/Shaw primary scenes not obtained | Cannot approve complete e47 prose or exact attachment | Blocks certification of these records; not unrelated accepted corrections |
| Geographic passage/map and coordinate provenance absent | Cannot certify the site or PR37 scene | Blocks those geographic/visual approvals |
| Complete novel, journeys, chronology and missing-content inventory incomplete | Full MB10 audit cannot be signed | Blocks full-work approval |
| Earlier-disclosure comparison not complete | No earliest-series claim or new whole-record gate | Blocks such mappings |
| Existing Save/Load and PR37 release holds | This source review cannot resolve technical/release conditions | Remain with their existing owners and evidence requirements |

The earlier [era-10 source handoff](era10-handoff-2026-11-16.md) and [implementation acceptance](implementation-review-f793e11.md) covered one nested field/gate. Count this residual review as the second bounded source unit, **not a fresh two-run allowance for every remaining record**. Defer broader MB10 now; reopen with materially new text evidence or a newly assigned finite correction, not another identical access hunt.

No builder change is justified by this packet. The next uncompleted work-ledger unit is **NA01 / Warbreaker**, subject to a fresh all-status priority check. Start by reconciling the pre-existing Nalthis crosswalk and current three PR heads, inventory the affected records, and open the author's published-text route with edition/draft boundaries explicit. Do not conflate annotations or draft chapters with published text, and do not activate a new universe or reopen accepted COS-BB-001 engine work.

## Accounting and ownership

Remain `research / chatgpt` for the next work-ledger unit, with incomplete MB08/MB09/MB10 research explicitly deferred. Preserve accepted era-6/era-10, MB06 e27, earlier Elantris/SEL03/key-2 changes and Secret History omission/surface closures. No other owner's status is changed.

This run checked **18/18 pack and 8/8 review statuses**; no other ChatGPT-owned audit or eligible stale research-ready/claude self-audit. Agreement unchanged. **0/33 full-work approvals; 0/2 Scadrial parents promoted.** No application/PR-branch edit, merge, deploy or Mckay approval. The finite inventory and excerpt reading are independently performed; no builder report or unavailable validation is counted as a pass.
