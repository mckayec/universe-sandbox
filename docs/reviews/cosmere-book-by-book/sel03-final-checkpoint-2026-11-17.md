# SEL03 final bounded source checkpoint and conservative copy handoff

ChatGPT — 2026-11-17 UTC. **Checkpoint 2/2; full SEL03 audit deferred with Known gaps.** This closes the planned research window, not the book's canon audit.

## Decision and immediate work

The e30 correction is accepted separately in [implementation-review-17efc26.md](implementation-review-17efc26.md). Do not reopen it.

Hand **two finite PR48 description edits** to Claude. These are conservative reductions of unsupported specificity, not findings that the omitted claims are proven false:

| ID / severity | Field | Exact replacement | Basis and limit |
| --- | --- | --- | --- |
| SEL03-GEO-01 / Medium | sel.sites.mulladil.desc | A mountainous region of the Rose Empire whose people are known as Strikers. | Remove the specific Teod-pass guard duty. Published Day Two [P1] supports the people's identity and imperial incorporation; [S2] supports mountainous region at secondary level and points to Day 42. No opened evidence supports the asserted pass duty. Mountains remain secondary-supported, not newly primary-certified. |
| SEL03-GEO-02 / Low | sel.sites.maipon.desc | Shai’s homeland and the heart of Forgery. | Remove the unqualified assertion that its position is not given. [P1] identifies Shai's people; [S4] supports the existing homeland/Forgery association and points to Days 30/98. A limited excerpt cannot establish a universal absence claim. No new location claim or coordinate is supplied. |

Preserve ids, names, coordinates, books, site order, Sel parent, all gates and every other field. Keep e30 exactly as accepted. Do not add scenes, landmarks, events, effects or new mappings. The unchanged numeric placements are **held schematic placements, not certified coordinates**.

## Reconciled revisions

Fetched actual current PR heads and packs through GitHub in this run:

| PR / branch | Exact head | Pack blob |
| --- | --- | --- |
| PR48 / feature/cosmere-reading-state | 17efc26c276594fa00b9775515a433bcf9bb9e87 | 8f755a2192d354836b9cd59361fc060f43ca8dbc |
| PR24 / fix/lore-corrections | cf25cda66e91c573c421a0f3712623db72737a3b | 3ff0aab059fa54e00f6e2ccc7b849d4bd206d958 |
| PR37 / atlas/deep-worlds | 03394c32816fcb5c95261bf6a9ea4520381a5838 | 5a74e300eaf88b2d3c81fa9bc957584cd4708e33 |

**3/3 pack hashes verified** before Node vm parsing. **8/8 four-site comparisons** (PR24 and PR37 versus PR48) match after excluding only PR37's added scene property. The four descriptions remain identical across the three branches. PR24/37 still have old e30 copy; PR37 also has e30.lm=chamber. This does not supersede prior corrections on other branches or authorize importing their stale fields.

The previous [six-record inventory](sel03-inventory-d228437.json) remains useful historical evidence; its PR48 e30 snapshot is superseded by the accepted correction. It is not silently relabeled as the new head.

## Four-site dispositions

These are **4/4 record-level dispositions**, not an exhaustive atomic-claim denominator.

| Site | Source result | Disposition |
| --- | --- | --- |
| roseempire | [S1] describes the capital, seven hills and central palace, citing Day 101. [P2] supports a palace workroom, not the city layout or ending. Northern-continent placement and precise geography were not verified in opened primary text. | Retain existing copy provisionally; **held** for complete-record certification. Seven hills is secondary-supported, not disproved by absence from the opening sample. Need the Day 101 text and identified map edition before promoting geometry or completed-outcome claims. |
| mulladil | [P1] supports identity/incorporation; [S2] supports mountains and names Day 42, plus a border with Dzhamar. Neither opened source establishes guards protecting passes to Teod. | Apply GEO-01. Preserve region identity and secondary-supported terrain; omit the unsupported specific duty. Coordinates and complete record remain held. |
| dzhamar | [S3] describes swamps and Bloodsealing association, citing Day 42. That passage was not independently opened in a lawful primary preview. | Retain provisionally at **secondary-supported / primary-unverified** scope. No invented corrective geography. Coordinates and whole record remain held. |
| maipon | [P1] supports Shai's people; [S4] gives homeland/Forgery leads to Days 30/98. Its linked later magic explanation is commentary, not automatically an earliest novella reveal. | Apply GEO-02. Remove the unsupported global absence assertion. Retained associations are not a primary geography audit; coordinates, JinDo relationship and shared magic/system gates remain held. |

[P3], official author commentary, explicitly cautions that the commissioned in-world Derethi map is not an accurate world representation. That supports continuing schematic qualification. It validates **0/4 numeric site placements** and supplies no replacement map or coordinates. Do not infer exact geometry from that commentary.

## PR37 additions: separate reconciliation, no current branch assignment

PR37/deep-worlds remains outside this folder's current owned implementation task. **Do not edit PR24/37 or advance their review statuses in this return.** The following is a future integration checklist, not a new release approval or an instruction to take ownership.

| Addition | Assessment and disposition |
| --- | --- |
| roseempire.scene | Capital style/layout is a representation. Its eastern architecture, size, time/weather and exact spatial design were not verified here; keep schematic/held. |
| mulladil.scene | Mountain theme has secondary support [S2]; size/time/weather are not verified story facts. Held. |
| dzhamar.scene | Swamp-region association has secondary support [S3]; wilds/mist/size settings are not validated scene observations. Held. |
| maipon.scene | Wilds/eastern architecture and other visual settings not checked against a primary map or scene. Held. |
| palace landmark | Central-hill association has secondary support [S1, cited Day 101]. Exact at=[0,.2], h=1.5 and complete description remain unverified. Held. |
| chamber landmark | [P2, Days Three/Five] supports a guarded palace workroom and Gaotona's visits. It does **not** support spending a full hundred days in that room or continuous supervision by Gaotona. Future conservative wording: “A guarded palace workroom where Shai studies and carves soulstamps; Gaotona observes her work when he can.” Keep exact placement/height held. |
| e30.lm=chamber | Not imported to PR48. The narrowed e30 premise is introduced at the bedside in Day Two [P1]; the workroom is described subsequently [P2]. No exact single-landmark certification for the combined premise. Reconcile or omit this attachment during a separately authorized integration. |

**7/7 identified additions dispositioned, 0/7 complete additions newly canon-certified.** Do not silently bring PR37's old e30 sentence back when integrating accepted PR48 work. The chamber duration concern is carried forward concretely; it does not require changing another owner's stage now.

## Opened sources and access limits

Fresh source-based web research; separate Deep Research product not invoked. Searches were discovery only.

| Tag | Source / access in this run | Evidence type and useful locator |
| --- | --- | --- |
| P1 | [Author-hosted Emperor's Soul excerpt](https://www.brandonsanderson.com/blogs/blog/the-emperors-soul-excerpt) — readable | Published narrative, copyright 2012: Prologue/Day Two; Striker/MaiPon passage, bedside scene and deadline negotiation. Partial novella only. |
| P2 | [Reactor authorized excerpt](https://reactormag.com/the-emperors-soul-brandon-sanderson-excerpt/) — fresh public Firecrawl retrieval, HTTP 200 | Published 2016-10-24 for Arcanum Unbounded; Prologue through Day Five. Day Three's opening room description and supervision discussion; Day Five's confinement and visits. Same work, not independent canon corroboration. |
| P3 | [Official FAQ: how TES fits with Elantris](https://faq.brandonsanderson.com/knowledge-base/how-does-the-emperors-soul-fit-in-with-elantris/) — readable | Author commentary on Sel and deliberately imperfect in-world mapping; not published scene text or a coordinate reference. |
| S1 | [Coppermind Imperial Seat](https://coppermind.net/wiki/Imperial_Seat?oldid=180568) | Secondary article; retrieved page identifies revision 180568 and cites Day 101 for hills/palace. Primary passage not opened. |
| S2 | [Coppermind Mulla'dil](https://coppermind.net/wiki/Mulla%27dil?oldid=180622) | Secondary article; revision 180622; geography cites Day 42, identity cites Day Two. |
| S3 | [Coppermind Dzhamar](https://coppermind.net/wiki/Dzhamar?oldid=183426) | Secondary article; revision 183426; swamp/association lead to Day 42. |
| S4 | [Coppermind MaiPon](https://coppermind.net/wiki/MaiPon?oldid=208335) | Secondary article; revision 208335; homeland/Forgery leads to Days 30/98. Later commentary link not treated as book text. |
| B1 | [Google Books edition record](https://books.google.com/books/about/The_Emperor_s_Soul.html?id=V1JqAgAAQBAJ) and its linked preview | Bibliography: Dragonsteel, 2012, ISBN 9781938570025. Preview retrieval returned cover/navigation only; targeted search-within URLs were inaccessible via the web tool. No later-scene verification obtained. |

The four Coppermind normal page opens returned 403 in web retrieval. Fresh public Firecrawl basic retrieval returned HTTP 200 and readable article prose/citations for **4/4** pages; revision numbers above are from their retrieved footers. No login or access-control bypass. Their “complete article” labels do not certify this audit.

Searches also surfaced unofficial full-book uploads and altered text. Those were not opened or adopted as primary evidence. Search snippets are not a substitute for the cited later passages. A lawful, readable later primary scene/map was **not obtained** in this bounded pass.

## Builder acceptance checks

For **GEO-01 and GEO-02 only**, on current PR48:

1. Re-read this handoff/status and exact current head. If moved, reconcile the actual delta. Apply the two exact desc replacements; preserve all other pack bytes/properties, especially e30, roseempire, dzhamar, coordinates and gates. Return exact head and parent SHA.
2. Supply an actual diff limited to those two fields plus focused regression coverage. Verify complete site payloads/order and unchanged parents. A parent negative control must fail the two corrected descriptions, not unrelated accepted fields.
3. Verify site visibility is unchanged using actual engine/reading logic: All, legacy 7/10, sufficient bucket-1+bucket-7 state and incomplete/TES-only/other-work states. No new per-work reveal guarantee is being requested.
4. Open both site descriptions at desktop and phone dimensions; confirm wrapping and absent removed phrases in those descriptions. Distinguish source checks, builder rendering and independent review evidence. Run appropriate repository validations and retain the unresolved Save/Load smoke limitation unless actually resolved with independent evidence.
5. Save the return/evidence before status last; return **implementation-review/chatgpt**. No PR24/37 changes, merge or deployment.

## Known gaps and post-return continuation

| Gap | Impact | Blocks these two conservative edits? |
| --- | --- | --- |
| Days 30/42/98/101 primary text and full ending not read | Secondary geography leads remain unverified; no full-book approval | No; edits reduce unsupported specificity |
| Map edition, exact positions, routes and complete missing-content inventory | 0/4 sites/placements certified; no parent promotion | No; preserve held schematic geometry |
| Shai codex completed-emperor implication, JinDo relationship and Sel/AU01 shared facts | Existing source/gate holds persist | No; outside this two-field return |
| PR37 scenes/landmarks and stale e30 | Must reconcile in its separately owned integration before treating branches as equivalent | No; do not import them here |
| Save/Clear/Load smoke timeout | Release validation remains incomplete | No bounded copy certification of the release |

**2/2 planned SEL03 source checkpoints now used.** After reviewing this finite implementation return, mark SEL03 **deferred with these gaps**, and move to the next untouched individual-work unit (MB04, The Eleventh Metal, initial claim inventory), subject to current status/priority checks. Do not schedule a third open-ended SEL03 source pass or cycle the accepted e30/key-2 prose again without new evidence or a new assignment.

Counts: **2/2 new description dispositions requested, 0/2 implemented in this checkpoint**; prior **1/1 e30 correction accepted**; **0 new gates/mappings; 0/4 complete sites; 0/1 full SEL03 audit; 0/33 full-work approvals**. Prior **5/5 key-2 prose dispositions, 2/7 key-2 mappings and 0/2 Scadrial parent promotions** remain unchanged.

No app-code/PR-branch edit, merge, deployment or release approval. Hand off **content-review/chatgpt → fixing/claude** for this finite two-field PR48 return.
