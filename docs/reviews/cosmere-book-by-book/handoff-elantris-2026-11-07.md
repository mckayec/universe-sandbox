# Elantris — bounded correction handoff and source holds

2026-11-07 · ChatGPT · **For Claude implementation, not canon or release approval.**

This packages the existing ten review units in [audit-2026-11-06.md](audit-2026-11-06.md), adds one duplicate-copy finding, and resolves the pending residual inventory into finite edits or explicit holds. It answers Claude's 2026-11-07T14:57Z STALL request without representing incomplete research as complete. The original audit and 32-work ledger remain historical evidence.

## Exact current implementations inspected

| Branch | Audited head | Cosmere blob |
|---|---|---|
| PR24, fix/lore-corrections | a4a6ea0ff5bd1d2a5bcb53d4c58f6d87738aa065 | 3ff0aab059fa54e00f6e2ccc7b849d4bd206d958 |
| PR37, atlas/deep-worlds | d902c8a7092e5e1f2597af800b11f0f7f63dc901 | 84a992ba4e7695458420c9cf3078d09d97f649ec |

Both complete files were fetched from GitHub and evaluated as data in an isolated VM. PR37 engine blob: 590dd51911c34903e5f0f6228b44bded12fe6991. EL01–04 defects persist in both packs; PR37 alone adds the EL05 palace attachment, four extra book-1 events, and the scene landmarks below. No correction listed here is already fixed at those heads. PR24 already lacks e2's precise palace attachment: preserve that absence.

Preserve all prior lore-corrections/Deep Worlds closures. Claude should choose the appropriate active implementation branch and document how common changes reach the other unmerged branch; do not apply a stale whole-file replacement or reopen previously accepted records. This handoff authorizes no merge or release.

## Counts and evidence boundary

- **10/10 existing EL01–EL10 units dispositioned**, plus **1 new Medium duplicate-copy correction (EL11)**.
- **7 finite correction units** ready: EL01–05, EL10, EL11. EL06–07 retained within their limited claim scope; EL08 is a source/gate hold; EL09 a map qualification.
- **4/4 residual PR37 book-1 events inventoried:** e64–66 unresolved; e67 partly supported by commentary, precise location/actions unresolved. They are not four confirmed events.
- **12/12 PR37 book-1 Sel landmark records dispositioned:** one supported short description, two partial/narrowing options, one correction, eight unresolved holds. This denominator excludes the two Rose Empire/book-7 landmarks and every rendered geographic coordinate.
- **7 author-hosted source pages reopened:** 3 chapter excerpts and 4 author annotations. Annotations are commentary, not novel text or independent corroboration.
- **3/3 actual-source display/order paths retain e67 before e5** (Chronicle, tour, world dossier). This confirms the old conditional EL10 order issue in source execution; it is not a rendered browser test.
- **0/32 individual-work units receive full book/canon approval.** SEL01's bounded handoff is ready; exhaustive SEL01 work is deferred with gaps. SEL02 remains selected-passages-only; the other work-ledger entries keep their prior pending/hold status.

No separate Deep Research product was invoked. No full copyrighted novel or independently sourced second-pass top-ten verification was completed.

## Exact corrections

All paths below are in public/atlas/packs/cosmere.js. Preserve IDs and existing book keys during the narrow copy fixes; the cross-book schema problem needs a separate reviewed migration.

| ID | Severity | Target / current issue | Exact replacement or operation | Evidence / scope |
|---|---|---|---|---|
| EL01 | Medium | sel.sites.elantris.desc says streets trace Aon Ela | Delete exactly the sentence “Its streets trace Aon Ela.” and its separating extra space. Do not add the ending's city-scale solution to base copy merely to replace it. | [S4] distinguishes the city and its outer cities' Aon Rao. No support for streets alone tracing Ela or Rao. Other geographic clauses are not certified by this deletion. |
| EL02 | Medium | sel.sites.widor.desc sends Hrathen east | Replace “whose Derethi church sends gyorns like Hrathen east.” with **“whose Derethi church sends Hrathen west to Arelon.”** | [S3], Wyrn's written westward orders. Existing capital/port details remain outside this check. |
| EL03 | Medium | e4 discovery located at chasm, PR37 lm:crack | Set text to **“Raoden discovers that adding a line for the Chasm lets his Aons function again.”** Remove site:chasm and, where present, lm:crack. Keep world:sel, book:1, ID/title. | [S5], commentary on ch.49. The geographic feature being understood is not proof the character is physically standing there. No guessed replacement pin. |
| EL04 | Medium | e5 conflates restoration and invasion defeat, PR37 lm:gate | Set text to **“Raoden adds the missing Chasm line to the city-scale Aon, restoring Elantris.”** Remove lm:gate where present. Keep site:elantris as broad city association, not exact drawing position. | [S4], with later rescue distinguished by [S6]. Do not recast this as a battle at the city gate. |
| EL05 | Medium | e2 arrival/widow scene pinned to palace on PR37 | Set text to **“Sarene reaches Kae and learns that Raoden is reported dead; their contract makes her his widow.”** Remove lm:palace on PR37; retain site:kae. | [S2], arrival from ship before palace journey. Do not invent a named dock. |
| EL10 | Medium | e67 confrontation precedes e5 restoration in PR37's array | After narrowing e5, place e5 before e67 in the narrative order. If e67 is omitted under its hold, preserve this ordering requirement for reinstatement. Leave unrelated events' order alone. | [S4], [S6], [S7]; actual order functions now checked below. |
| EL11 (new) | Medium | sel.sites.kae.scene.landmarks[palace].desc repeats “where Sarene arrives to find Raoden declared dead”; coronation sentence not verified here | Replace entire description with **“King Iadon’s palace in Kae. Sarene meets him here after arriving from Teod.”** | [S2] distinguishes arrival news, carriage journey and palace meeting. This also removes an unverified coronation clause; removal is not a finding that it is false. |

EL01 full resulting description (other inherited claims remain on the original audit's geography hold):
> The shining city of the Elantrians in north-east Arelon, near the coast and the northern end of the Atad Mountains. After the Reod its walls hold the Shaod’s victims; Raoden is thrown in here at the start of the book.

EL02 full resulting description (only the mission direction is newly supported):
> Capital of Fjorden and of the Fjordell Empire, a northern port and the seat of the Wyrn, whose Derethi church sends Hrathen west to Arelon.

### Retentions and map qualification

- **EL06:** retain e1's transformation/confinement sequence, supported by [S1] and reported death in [S2]. The gate represents confinement only, not the bedroom transformation.
- **EL07:** retain e3's threatened three-month conversion deadline; [S3] locates the threat in Wyrn's orders. Do not present a narrator-confirmed divine forecast.
- **EL09:** retain schematic geometry only with a visible qualification, exact suggested copy: **“Site positions and local layouts are schematic, not measured coordinates.”** Record the map edition actually used. [S5] discusses historical map/text mismatch; that does not validate current coordinates or later editions. Do not fabricate an edition citation.

## EL08: five precise source/gate holds

These are **unverified earliest-reveal/edition claims**, not proven falsehoods. A book-1 numeric association is not evidence that an original-edition Elantris reader knows these details. Before canon approval Claude must return, for each group, either a source-backed work/edition gate or an explicit omission. Do not invent a later numeric gate to make the hold disappear.

| Group | Current field(s) | Conservative finite disposition available now |
|---|---|---|
| EL08-A | sel.status: “2nd from Mashe · Shardworld of Devotion and Dominion” | Narrow status to **“World of Elantris”**. System order and named-Shard explanation remain in the evidence backlog, not newly certified. |
| EL08-B | sel.realms.cognitive name/blurb and specific plasma/Dor presentation | Omit the Sel-specific cosmological explanation/presentation from the unsupported book-1 scope. Return an actual render/search/realm disposition; deleting only text must not leave an equally asserted named scene. If the current engine cannot scope it safely, propose temporary omission of the Sel-specific override, with fallback behavior documented. |
| EL08-C | sel.sites.pool name and final description sentence | Rename to **“The Pool”** and remove exactly **“It opens into Sel’s Cognitive Realm.”** Preserve other wording only as explicitly unaudited physical-description material. Do not claim its direction, tunnel or switchbacks were verified here. |
| EL08-D | codex[shards].list entry “Devotion and Dominion”, books:[1,7], broken-power explanation | Temporarily omit this entry from the unsupported Elantris scope, or provide the exact published source/edition and tested gate. A blanket move to anthology key 7 does not resolve the per-work problem. |
| EL08-E (related field now identified) | codex[shards].list “Adonalsium”, first:1 | Same source/edition/gate-or-omit requirement. Its current first:1 is a repository observation, not a verified Elantris reveal. This is an extension of EL08's cosmology inventory, not a claim that the cosmology is false. |

These holds block shipping the affected unsupported claims, not applying EL01–05/10/11. Broader global realm text and other systems still need their own coverage; this is not an exhaustive spoiler inventory.

## Residual PR37 event inventory (4/4)

| Event | Evidence disposition | Builder action |
|---|---|---|
| e64, New Elantris | Unresolved full composite: friendship, gang-leader sequence and community claims were not all checked in the reopened excerpts. | Hold the existing composite; provide exact published passages and gate, or omit it for this bounded scope. Do not count the optional Hope entry as verification of every clause. |
| e65, The king's secret | Unresolved discovery, arrest/death sequence and exact palace attachment. | Source each sequence/attachment or omit the event; do not move it to a guessed room. |
| e66, The Dakhor strike | Unresolved tents/market detail and precise battle placement. | Source or omit; an effect labeled battle does not establish its location. |
| e67, Hrathen's choice | [S7] supports the published final Hrathen/Dilaf confrontation while separating discarded drafts. It does not establish every current city/street/action clause. | Conservative optional replacement: **“Hrathen confronts Dilaf.”**, world:sel/book:1, remove site:teoras, lm:streets and fx:battle pending support. Place after narrowed e5. Otherwise omit pending scene evidence. This does not validate the original composite. |

Omissions must be listed in the return; never silently label these records confirmed.

## Residual PR37 landmark inventory (12/12)

All are scene.landmarks under the indicated Sel site and currently have books:[1]. These rows concern prose, not synthetic placement, camera paths, architecture or weather.

| Site / landmark | Status | Precise disposition |
|---|---|---|
| elantris / walls | Supported short claim | Retain “Elantris’s high walls now serve to keep its people in.” [S1]. Geometry remains schematic. |
| elantris / gate | Partial | [S1] supports confinement; Sarene's later food delivery was not checked here. Conservative whole-description replacement: **“Those taken by the Shaod are confined within Elantris; Raoden enters through this gate.”** Otherwise source the additional clause. |
| chasm / crack | Partial | [S5] supports the missing-line discovery, not a discovery scene at the crack or every earthquake clause. Conservative whole-description replacement: **“The Chasm is the feature whose missing line Raoden adds to his Aons.”** Keep e4 unpinned per EL03. |
| kae / palace | Correction | EL11 exact replacement above; do not fix only e2 and leave this duplicate. |
| elantris / newelantris | Unresolved | Community participants, gardens and roofs need scene evidence or omission of the description/landmark. |
| elantris / barrows | Unresolved | Burial location, collective heroes and Sarene's request need the published ending, not assumptions from the annotation. Source or omit. |
| kae / kiin | Unresolved | Opposition-meeting and barricade assertions need text. Source or omit. |
| kae / roial | Unresolved | House/duke/alliance description not independently checked in these sources. Source or omit. |
| kae / market | Unresolved | Same tents/market location dependency as e66. Source or omit together. |
| pool / pool | Unresolved | Vanishing, physical description, named carriers and condition of Raoden require scene evidence. Source or omit; the parent naming repair alone does not verify the landmark. |
| teoras / harbour | Unresolved | Home-port and command-of-sea statement need source support; Sarene's chapter-2 navy concern is not proof of this exact port. Source or omit. |
| teoras / streets | Unresolved | Precise setting/arrival sequence tied to e67 remains unverified. Source or omit alongside e67's unpinning. |

No full 19-site geography pass, journey audit or atomic-claim total has been completed. These 12 records must not be inflated into 12 verified paragraphs.

## EL10 actual-source order check

Attached elantris-order-probe.cjs evaluates the exact current pack and engine's renderChron, tourList and evFor in an inert VM. At d902c8a, each of the three paths produces:

`e1, e2, e3, e64, e65, e4, e66, e67, e5`

All three put the confrontation before the restoration. The script reports this defect rather than claiming a passing acceptance test. It verifies the old audit's runtime-order condition at function level; it does not certify the complete event chronology, interaction or browser tour. On return, verify narrowed e5 before e67 in all retained paths and confirm the UI order at the exact head.

## Source register (reopened 2026-11-07)

| Tag | Source | Type and used scope |
|---|---|---|
| S1 | https://www.brandonsanderson.com/blogs/blog/elantris-chapter-one | Author-hosted chapter text: transformation, confinement, walls. |
| S2 | https://www.brandonsanderson.com/blogs/blog/elantris-chapter-two | Author-hosted chapter text: arrival and widow clause, subsequent palace journey/meeting. |
| S3 | https://www.brandonsanderson.com/blogs/blog/elantris-chapter-three | Author-hosted chapter text: Wyrn's orders, westward mission, deadline. |
| S4 | https://www.brandonsanderson.com/blogs/blog/annotation-elantris-61-3 | Author commentary: city-scale Aon and missing line. Not the full climax text. |
| S5 | https://www.brandonsanderson.com/blogs/blog/annotation-elantris-49-1 | Author commentary: discovery and historical map mismatch. Does not establish the character's exact mapped position. |
| S6 | https://www.brandonsanderson.com/blogs/blog/annotation-elantris-62-2 | Author commentary: later rescue/teleportation, separate from restoration. |
| S7 | https://www.brandonsanderson.com/blogs/blog/annotation-elantris-62-3 | Author commentary: published confrontation vs discarded ending. Draft mechanics are not imported into canon. |

The original audit's other sources and Hope proposal are carried as historical evidence, not falsely dated as reopened here. The three excerpt pages and four annotations are all from the same author; this is not a two-independent-source pass.

## Known gaps

| Gap | Impact | Blocks what? |
|---|---|---|
| Full novel/anniversary additions, remaining 19-site prose, journeys and atomic inventory not completed | Remaining text cannot be called fully verified | Full SEL01 canon approval; not the finite sourced edits |
| EL08 five field groups lack earliest published reveal/edition validation | Book-1 scope can expose unsupported later cosmology | Those claims unless omitted or given accepted evidence-backed gates |
| e64–66, e67 detailed attachment/actions and eight landmark holds | Specific narrative/setting claims remain unverified | Affected records; omission/narrowing is available |
| Independent second-source top-ten pass missing | Evidence breadth remains limited | Full book-audit completion |
| Exact maps and scene geometry not validated | Schematic reconstruction only | Any claim of canonical measured positions |
| COS-BB-001: six shared numeric buckets still combine multiple works | Cannot select one completed novel independently | A claim of book-by-book spoiler safety |
| SEL02/HO01 has only prior selected-passage research | Hope is not a fully audited new work | Adding it under a generic anthology key; defer until a separate work gate is available |

## Finite next action for Claude

1. Apply the seven correction units and preserve EL06–07. Address EL09's visible schematic qualification.
2. Return per-group EL08 and per-record event/landmark dispositions: sourced retain, exact narrowing, or explicit omission. Do not delay the safe copy fixes for open-ended research.
3. For COS-BB-001, return a **design proposal** with stable work IDs, prerequisites, legacy URL/save migration and exposure-surface inventory (search, codex, tours, landmarks, events). Do not silently renumber or claim a working per-book system. Keep this proposal separable from the finite copy patch.
4. Return exact implementation SHA(s), changed-field crosswalk, automated validations and targeted UI ordering/gating evidence. Then set implementation-review/owner chatgpt.

SEL01 is now a bounded implementation handoff with deferred research, **not a completed book audit**. The original 32-work ledger remains the continuation index; no new series is opened by this handoff.

**Verdict: implement the sourced corrections; narrow or omit explicitly unresolved claims; canon approval withheld.**
