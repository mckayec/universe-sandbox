# Deep Worlds content review — bounded checkpoint 1

**Historical checkpoint:** see [checkpoint 2](audit-continuation.md) for current 210-record coverage and DW07, and [builder handoff](builder-handoff.md) for parallel fixes. Counts below describe checkpoint 1 only.

2026-10-29. **Changes required; content review incomplete. No canon, technical or release approval.**

## Exact revision and evidence boundaries

Reviewed [PR37](https://github.com/mckayec/universe-sandbox/pull/37), open/unmerged at **f778b6b6fbbeb173763f2a79cd2d8bc0ff0d6f49**, branch `atlas/deep-worlds`. Fresh main was **971ee9c** (full SHA recorded in validation.md). Main/status cites older `14f7a52`; `git diff 14f7a52 f778b6b` changes only implementation/status documentation. The reviewed application content is unchanged across those two heads, but all conclusions here apply to **f778b6b**. This resolves the target discrepancy without treating a stale short SHA as current.

Read repository AGENTS.md, CHATGPT.md, signed handoff and the Deep Worlds status/implementation report. No relevant local `.agents/skills` or nested instruction file was present. Existing Deep Worlds history contains implementation notes/screenshots, not a completed content audit. PR37 issue comments and formal reviews were empty when fetched. The earlier PR36 review at **d2fd8d9d3656a74f0930a91a665ec0973a58f15b** is evidence of findings, not implementation fixes. Its control-flow probes are adapted here, not its old verdict blindly copied.

Primary sources actually opened are listed in [sources.md](sources.md). Full novels were not available in the supplied library directory. Secondary plot summaries named by the builder are leads only. The bounded sampling below is not the requested completed 20-landmark/15-event-per-pack review.

## Findings / dispositions

`P/` below means `public/atlas/packs/`; source lines refer to the exact implementation SHA. Runtime quotations are from repository content. Sources S01–S03 are linked in sources.md.

| ID / severity | File / object / location | Current text or behavior | Verdict / evidence | Exact correction or required acceptance | Gate |
|---|---|---|---|---|---|
| DW01 / prior High narrowed closed | `public/atlas/society.js:9637–9649`; Europa `leviathan`, `LEV_TEXT` | `LEV_TEXT` now has keys 1 and 6; banner calls `eraVal(LEV_TEXT)`; late landmark receives same object. | **PR36's specific Light Bringer sentence bypass is fixed at source level.** Six era checks plus both consumer checks pass. Existing base includes Kalibar/Cyraxes age/riding lore: not newly verified as Book-I-safe. | Keep current VI gate. Independently verify or neutralize the expanded Book-I base; do not call all Europa lore approved. Rendered/click/downgrade-banner checks remain unperformed. | I base / VI plot clause |
| DW02 / High | `society.js:7819–7825,7925,7946–7953`; `setEra`, `fadeTo`, `enterSite` | Visibility checked before a 400 ms queued callback; callback does not recheck. Eligible scene downgrade does not stop `fxList`. | **PR36 transition/effect finding remains.** Isolated actual-function probes reach `loadSite('asteroid')` after VI→I and retain an active effect after II→I in eligible Agea. User-input timing and rendering not reproduced. | Invalidate queued navigation/event work on book change, recheck visibility at callback commit, stop/gate active effects and clear/refresh stale captions, banners and tips. Test these paths using final code, then permitted real keyboard/pointer interaction. | Current selected book, including downgrade |
| DW03 / Low | `P/hyperion.js:139`; `bressia.blurb` | “The Ouster attack here killed his wife and son” | **PR36 orphan pronoun remains.** New descriptions did not repair it. Prior source limitations remain. | Safest inherited cut: “Kassad fought in the Bressian campaign.” If retaining the previously accepted family clause, explicitly name the Consul and preserve its source qualification as specified in PR36. Do not restore the unsupported provocation clause. | I |
| DW04 / Medium | `P/sun-eater.js`; `delos/devilsrest.scene.landmarks[castle].desc` | “Hadrian is born and raised inside its walls, the heir his father does not want.” | **Wrong characterization in the final clause.** S01 chapter 1 distinguishes an unwanted child from a wanted heir. It supports the dark-stone home/seat relationship, not every procedural room or exact birthplace coordinate. | Replace entire description with: “The dark-stone home of House Marlowe, whose lord is Archon of Meidua. Hadrian grows up under a father who wants an heir rather than a child.” | I |
| DW05 / Low | `P/dune.js`; event `d1` | “On the eve of the move to Arrakis” | **Overprecise timing.** S02 chapter 1 places the visit in the preceding week and the test the next morning; the test itself and Paul's age are supported. | Replace the opening with **“Before the move to Arrakis”**; retain the rest of the event. Do not imply a dated departure eve. | I |
| DW06 / Medium, evidence hold | Flag register below, especially `sun-eater` b1j/dungeons, `foundation` f1d/board and `cosmere` e35/orphanage | Exact room/dungeon placements and late-story details are presented as settled despite explicitly thin source support. | **Unsupported in this checkpoint**, not proven false. Builder's own report identifies these uncertainties; authorized opening excerpts do not establish later scenes. | Until primary passages are supplied, remove disputed landmark ties and detailed clauses; retain only separately supported world-level narrative. For e35 a supported narrow replacement is “Lift travels to Yeddaw in Tashikk, where Darkness has been reported.” Drop the orphanage/Third-Ideal scene assertion pending its passage. | Existing work gates are provisional, not verified first appearance |

The suspected generic place-dossier era bypass was investigated but **not established**: both site-list and place views use `s.desc`; era-aware world copy is a different field. No extra defect is asserted from that observation. The real control-flow defects above remain independently reproducible.

## Builder-flagged items: all six groups dispositioned, source closure still open

These are finite implementation dispositions, not claims of full primary verification. “Open” means do not certify the claim; seek the listed passage or cut the unsupported detail. S01/S02/S03 are actual opened excerpts; the exact repository object is the evidence for implementation presence.

| ID | Flagged object(s), current implementation | Verdict / precise remaining action |
|---|---|---|
| F-SE1 | Codex `Lady Liliana Marlowe`, `Count Balian Mataro`; ziggurat description repeats Balian | **Open.** S01's opening does not establish these given names. Use role-only labels “Hadrian’s mother” / “Count Mataro” pending relevant Empire of Silence passages; do not claim names disproved. |
| F-SE2 | `emesh/borosevo/dungeons`: “Captured Cielcin are held beneath the arena”; b1j points to `borosevo`, lm `dungeons` | **Open / DW06.** City site remains Borosevo; the disputed precision is the Colosso dungeon landmark. Remove lm and the unsupported under-arena landmark claim pending captivity/interpreter passages. Do not substitute Castle Borosevo by guess. |
| F-SE3 | Padmurak world `books:[4]`, `first:4`; codex Commonwealth still names Padmurak at `first:1` | **Conservative world gate present, first-appearance question open.** Distinguish a name mention from revealing the world scene. Need book-I mention and book-IV visit evidence; do not interpret [4] as proof the name never occurs earlier. |
| F-HY1 | Hyperion cumulative mode; Sphinx landmark now describes Rachel's study/sickness without book-II emergence | **Structural containment change present.** Exact biography/location wording awaits Hyperion passage; no book-II emergence sentence in sampled Sphinx entry. |
| F-HY2 | Jungle `raft.books:[3,4]`; Cicero's, Stan Leweski, Cleft cruciform-caves omitted per builder | Raft gate change present; opening book-III access unchanged by adding IV in cumulative mode. **Source verification open.** Omitted disputed additions need not be invented/restored; verify actual relevant journey before assigning layout. |
| F-EX1 | b6i at `ceres/govhall/conference`: Transport Union formation and leadership | **Open.** Need Babylon's Ashes conference passage; no primary text for this ending obtained. Do not certify Ceres or a government conference room from summary repetition. Remove lm/precise site if unsupported. |
| F-EX2 | `ringstation/slowzone/railguns`, b6l; “Pinned down by Duarte’s marines” and reactor destruction | **Open.** Gate VI is explicit; hull, force allegiance and assault sequence need the book's battle passage. A slow-zone coordinate is schematic, not confirmed gun mounting. Cut unsupported details rather than silently adopt the TV version. |
| F-EX3 | b3l grenade; b6l guns; b8n Duarte/Cortázar/escape split from earlier composite events | New IDs and gates III/VI/VIII exist. **Chronology and exact site of every split remain open** without the respective passages. Splitting is not source confirmation. |
| F-DU1 | d5 credits Duncan and Liet-Kynes at ecostation; d14 separate harvester rescue | **Open.** S02 chapter one does not contain either episode. Need rescue/testing-station passages; retain no precise station claim solely from summary. |
| F-DU2 | d19 world-level Jamis duel/name change; Kynes death, son's death raid, Gurney return withheld from exact sites per builder | World-level d19 placement avoids an invented room, but **event order/name timing still open** pending the Fremen encounter passage. Do not use screen adaptation as evidence. |
| F-FO1 | f1d `terminus/termcity/board` | **Open / DW06.** Builder admits Board meeting place not given. A generic city point is less specific than a meeting chamber, but the new `lm:board` still implies one. Remove lm pending passage; clearly label schematic setting if retained. |
| F-FO2 | f7g `trantor/library/zenow`; Korell emblem/foundry; Siwenna `barr` named Barr home | Changes present in data. **Open primary comparison** for Forward the Foundation and Foundation episodes; no invented estate reinstatement. Exact Library room/emblem placement needs evidence or removal. |
| F-CO1 | e35 `roshar/yeddaw/orphanage`, storm, Third Ideal | **Partial primary context only.** S03 supports Yeddaw/Tashikk and reported Darkness presence, not the ending's target/orphanage/Ideal sequence. Use DW06 neutral replacement or obtain later novella passage. |
| F-CO2 | Yolen duplicate removal; gates on Azimir, Valley, Reshi Isles, Rall Elorim, Kasitor | Evaluated pack loads; structural validation passes. **Exact earliest-work gates not primary-certified.** Azimir [5,7,8,12], Valley [4,5,7,8,9], Reshi Isles [4,5,8,9,12], Rall Elorim [4,8,12], Kasitor [4,12] inspected; all need passage-level comparison. Duplicate-key removal is code hygiene, not canon evidence. |
| F-CO3 | The Lost Metal limited to existing events | **Scope choice, not verification.** No new completion claim; current grouped Cosmere book keys combine multiple novels. Audit against these group boundaries and disclose their coarse spoiler granularity. |

## Measured sampling coverage and next unit

[Sample ledger](sample-ledger.csv) captures **48 exact records: 5 landmarks + 3 changed/re-pointed events per pack**. Selection: prioritize Devil's Rest/Borosevo, Time Tombs, slow zone, Arrakeen, Trantor palace/library, Kholinar; then preserve source order. Events are the first three whose site/world/lm/text/book differs from c91ea29 or whose ID is new. This is purposive, not random sampling. Landmark layout kind is not a narrative evidence tag.

| Pack | Landmark content inspected / required minimum | Event content inspected / required minimum | Records compared to an actual primary excerpt |
|---|---:|---:|---:|
| Sun Eater | 5/20 | 3/15 | 2 partial/corrective comparisons: castle and b1p |
| Hyperion | 5/20 | 3/15 | 0 |
| Expanse | 5/20 | 3/15 | 0 |
| Dune | 5/20 | 3/15 | 1 corrective comparison: d1 |
| Foundation | 5/20 | 3/15 | 0 |
| Cosmere | 5/20 | 3/15 | 0 sampled; separate F-CO1 excerpt comparison is partial |

Thus **90 additional landmark samples and 72 additional event samples** remain to reach the requested minima, and **45 of these 48 inspected samples still lack primary comparison**. Even the three compared records are partial/corrective, not complete canon approvals. e35's partial comparison is outside these sampling counts. Total pack data contains 739 landmarks and 616 events; those totals are not read/verified counts. Luthadel and Medina's own interior (as distinct from the slow zone) must be prioritized in the next unit, along with the remaining flagged passages. Do not manufacture full-book access or inflate coverage using validator totals.

Society coverage in this checkpoint is the three inherited finding groups only; the new scene captions and broader ~35-scene expansion still require source sampling. Tyche's changed IV gate requires Iron Gold prologue evidence; this pass does not approve it or all Book-I Leviathan base lore.

## Acceptance and handoff

Resolve DW02–DW06 or supply an evidence-backed disposition, preserving DW01's narrow scope. Obtain authorized relevant passages/editions for each open flagged item; sources missing here are not proof no lawful copy exists. Continue the explicit sample ledger to the requested minima, then verify every resulting High/Medium issue and gate on the final implementation head. The engine's procedural layouts must remain visibly schematic, not apparent canon blueprints. Run the appropriate technical and permitted rendered/mobile/keyboard checks separately. No browser/server workaround was used. Keep stage **content-review / chatgpt** for this incomplete checkpoint; builder fixes can proceed from the published findings, but this does not signal the requested audit is finished.
