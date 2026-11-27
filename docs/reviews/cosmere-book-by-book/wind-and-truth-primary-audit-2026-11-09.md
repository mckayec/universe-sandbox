# Wind and Truth — primary-text checkpoint and implementation handoff

Recorded 2026-11-09 UTC. **Major spoilers for Wind and Truth.**

This packet supplies finite corrections, a connection ledger, and an interactive magic-page specification for the existing Cosmere build. It does **not** certify a complete book audit or a live implementation.

- [Connection research data](wind-and-truth-connections-2026-11-09.json): **73 relationships, 89 nodes, 33 source-scene records**. Includes physical appearances, remote contact, family/identity revelations, references, historical testimony, intentions and stated uncertainties.
- [Interactive magic-page specification](wind-and-truth-magic-spec-2026-11-09.md).
- Existing lane: [COS-BB-001 implementation handoff](implementation-handoff-2026-11-09.md). Its accepted D08 infrastructure/control work remains first; this packet does not replace its owner, priority or gates.

## Source, revision and coverage

Book: Brandon Sanderson, *Wind and Truth*, Stormlight Archive book five; audit ledger **SA07**. The supplied ebook identifies eISBN **9781250319173**, copyright 2024, and “First Tor Trade Paperback Edition: 2026” in its back matter. This is the supplied edition's metadata, not a claim that all editions and illustrations are interchangeable.

The full parsed textual payload was retrieved and indexed. Selected scenes were then read directly, including the prologue, five named interludes, historical visions, several climaxes, aftermath, epilogue and postlude. **Full retrieval and indexing are not a full semantic reading.** Chapter headings and illustrations were not reliably represented by the extraction; source locators therefore use named interludes and distinctive scene descriptions instead of invented chapter/page numbers.

Snapshot comparison:
- Main Cosmere pack blob: `0ca2f3eedf23bd6b453240c3e047e8c50671e5d2`.
- Initially inspected PR37 head: `08d10e1736d3e6916d7a061d311ddb13f444bb05`.
- Rechecked PR37 head: **`2f04e416696f0fe32ab5eca7be5d8b578cd129cd`**, open/unmerged.
- Cosmere pack blob remained **`5a74e300eaf88b2d3c81fa9bc957584cd4708e33`** at both PR heads. Relevant findings still apply to that exact pack.
- Files inspected: `public/atlas/packs/cosmere.js` and the existing Powers page data. The latter is the science-scale Powers of Ten experience, not a dedicated Cosmere magic lab.

| Surface | Checked scope | Disposition |
|---|---|---|
| WaT-tagged current events | All 14 relevant records within the 20-record legacy key-12 bucket | All receive a disposition below; some remain partial |
| Other key-12 works | Not audited by this packet | Preserve their own review lanes |
| Primary-source scene register | 33 bounded scene groups | Supports individual claims, not every detail in those scenes |
| Connection ledger | 73 explicit, attributed relationships | Research data; no claim of exhaustive Easter-egg coverage |
| Whole novel, all epigraphs and all minor references | Not completely read/reconciled | Open |
| Artwork, official maps and exact physical geometry | Not visually inspected | Open; retain schematic labels |
| Runtime graph/magic page, tests and browser behavior | Not implemented or run here | Requires builder return |

No ebook, full-text extract, reader account information or private file identifier belongs in the public repository.

## Finite correction units

These dispositions are additive to prior accepted reviews. Reconcile against the current implementation before applying; do not overwrite concurrent fixes.

| ID | Actual target | Source-backed action | Source |
|---|---|---|---|
| WAT-01 | Narak landmarks `narakone`, `naraktwo`, `narakthree`, `narakprime`; event `e123` | The defensive set is **Prime, Two, Three, Four**. Replace the invented “Narak One” position with Four. Two is the **Oathgate plateau**, not a fallback fortress after One. Outer Four/Three are sacrificed in the plan; do not imply all four fall in a simple chain. Preserve valid deep links through an explicit migration if renaming IDs. | S07 |
| WAT-02 | `e58`; Roshar era-12 summary | Correct the order: Dalinar takes Honor, renounces his oaths/contracts, loses that power; **Odium destroys the Stormfather before absorbing Honor** and becoming Retribution. | S20 |
| WAT-03 | `e60`; Hoid codex/route | Separate **regeneration on Scadrial in Ulaam's care** from **employment by the Ladrian household in the epilogue**, and from his **future intention** to find Valor. Do not call all three one epilogue journey. | S26, S31 |
| WAT-04 | `e121`; Shinovar Bondsmith landmark; new Oathpact event | **Keep Kaladin's Fifth Ideal. It is supported.** Add the later Herald oath and renewed Oathpact as a distinct event. The new Honor spear is not simply Syl transformed. Removing the Fifth Ideal would introduce an error. | S18, S21, S32 |
| WAT-05 | `e120`; Nale/Syl character links | Preserve the initial duel, then show the flute, Wind and Wandersail story as the turning point. “Kaladin duels Nale” alone loses the encounter's resolution; “they never duel” would also be wrong. | S13 |
| WAT-06 | `SITES_ROSHAR.shatteredplains.desc`; Roshar base facts; `pool.desc` | Move the fourth-moon reveal and the disappearance of Cultivation's perpendicularity into WaT-gated fields/eras. Those current shared descriptions can expose late revelations through earlier book selections. Retain the familiar pre-Stormfall pool in earlier eras. | S08, S22, S28 |
| WAT-07 | Dalinar/Blackthorn codex, graph and aftermath | Create separate entity states. Dalinar's soul departs into the Beyond. The later Blackthorn is a nascent legend/spren given memories, not Dalinar resurrected or his soul forced into service. | S23 |
| WAT-08 | Stormfall/Roshar state and magic rules | Avoid “all magic stops.” Ordinary Stormlight/Oathgate access is lost, while Urithiru's Towerlight protection, Fused powers, seons and the Unoathed require explicit exceptions. Show locations and times, not one global power switch. | S22, S27–S29 |
| WAT-09 | Kelsier codex, worldhopping paths, Ghostblood relations | Distinguish projected/seon contact from physical arrival. The later truce is between Kelsier and Shallan, not universal peace between organizations. Ala consents to her new employment. | S01, S02, S29 |
| WAT-10 | Dawnshard/Hoid/Sigzil and future Sunlit links | Hoid holds a Dawnshard again during the Rysn meeting and later transfers it to Sigzil. A highspren formerly bonded to Szeth subsequently meets Sigzil. The latter is not explicitly named Auxiliary in that scene; keep cross-book identity completion separate. | S12, S24, S28 |
| WAT-11 | Time controls, seon animation, chronology | Roshar's rate changes. Kelsier's seventy-to-eighty-years versus roughly-a-decade estimate is attributed and approximate, not an 8:1 physical law. Herald mind-vision time is a distinct context. | S26, S29, S32 |
| WAT-12 | Shard identities and historical states | Add the attested Reason/Euridrius, Invention/Chan Ko Sar and Valor/Medelantorius relationships. Preserve Tanavast's historical viewpoint and uncertainty about missing Shards. “Not found” does not mean “killed.” | S14 |
| WAT-13 | Shallan family and spren graph; Stormfather identity | Gate Chana's identity as Shallan's mother. Keep Testament and Pattern distinct. Preserve the partial nature of Tanavast's soul/memories in the Stormfather, rather than equating two whole persons. | S15, S16 |
| WAT-14 | Kharbranth map/realm states | Distinguish the destroyed Physical city from the artificial Spiritual city containing actual surviving inhabitants with altered memories. Do not describe everyone as dead, all residents as illusions, or the physical city as still standing. | S30 |
| WAT-15 | `e124`; Thaylen government/scene location | Describe negotiated submission after the debate, followed by council vote and Fen's ratification. Do not reduce the debate to merely the contest terms. The existing palace landmark is not cleared by this source checkpoint: the debate is at a temple; remove/narrow the location anchor until the actual landmark is reconciled. | S33 |

## All 14 current WaT event dispositions

“Supported core” does not approve every adjective, route coordinate, effect, implied date or ancestor field.

| Record | Disposition | Bounded replacement or remaining check |
|---|---|---|
| `e55` A contest of champions | Narrow | Present the **existing ten-day countdown** as the opening situation, not a newly negotiated agreement in WaT. Earliest-agreement scene belongs in the prior-work audit. |
| `e118` Into the Spiritual Realm | Supported core; narrow | The cistern trial with Dalinar/Navani and a historical anchor is attested (S04). Distinguish that rehearsal from the subsequent extended expedition and its participants; do not combine them in a physical time-travel scene. |
| `e56` Kaladin and Szeth in Shinovar | Partial | The mission and confrontation with Ishar are attested in the checked climax. Precise journey sequence, pass geometry and “find … behind its silence” summary remain outside this checkpoint's complete verification. |
| `e119` Taln's Honorblade | Supported core; narrow | Szeth kills Rit and recovers Talmut's blade at the Stoneward monastery (S06). Preserve the blade identity. Do not let “first of the stolen Honorblades” imply a verified theft history for every blade. |
| `e122` The defence of Azimir | Hold detailed sign-off | Broad defence premise and later Azir survival were checked, but all dome, thunderclast, injury and choreography details were not reconciled scene by scene. Keep previous applicable holds; this row is not newly approved. |
| `e123` Bridge Four on Narak | Correct | Apply WAT-01. A precise timeline of every withdrawal and the listeners' final entry still needs the battle-sequence follow-through; no blanket “all four fell” animation. |
| `e57` Fronts falling | Narrow or replace with sourced entries | Distinguish Thaylen negotiated submission, the Narak/listener outcome and Azir's survival. A generic multi-front entry must not imply all three capitals were finally conquered. |
| `e124` Fen's choice | Supported outcome; correct context | Use WAT-15; S33 verifies negotiation, council action and ratification. Hold the palace landmark. |
| `e120` Kaladin and Nale | Expand/narrow | Initial duel is supported; include the musical/story resolution (S13). Do not certify the existing precise blade-transfer sequence without checking that portion separately. |
| `e121` The Fifth Ideal | Preserve; add separate later event | Supported by S18. Distinguish clearing Odium's influence from curing all accumulated Herald trauma. Add S21/S32 as a separate Oathpact event. |
| `e125` Cusicesh speaks | Supported core; narrow absolute | Cusicesh speaks and opens departure gates in I-11 (S10). Remove the unbounded “for the first time” unless qualified to the witnessed/documented context. Do not name an unverified destination planet. |
| `e58` Retribution | Correct | Apply WAT-02. |
| `e59` Stormfall | Supported core; qualify | Changing storms and altered time are supported. Apply WAT-08/WAT-11; distinguish access disruption from an absolute impossibility of travel or all magic. |
| `e60` Hoid seeks help | Split/correct | Apply WAT-03. |

Suggested additional event records: Shallan's mother revelation; Mishram's release; Dalinar's brief holding of Honor; the renewed Oathpact; Hoid's transfer to Sigzil; Hoid's Scadrian regeneration; the Ladrian job; the protected Herald vision. These need stable production IDs and source-gated captions. Their appearance in this list does not validate every surrounding sequence.

## Connection-map contract

The JSON is a **research packet**, not a ready-to-import production pack. Its node IDs and relation vocabulary require mapping to the builder's actual interface. SA07 is an existing review-ledger identifier, not an invented approved runtime registry key.

The 73 entries distinguish demonstrated facts from attributed testimony. Keep each entry's constraint when writing public copy. Major prevented errors include:
- Baon is not Nale; an initial mistaken identification must not merge them.
- Naming Vivenna/Yesteel is not a physical appearance.
- A character's plan to seek Valor is not a completed meeting.
- Olo being asked to go to Azimir is not confirmed arrival.
- The Iriali departure does not establish a named final world.
- The full Feruchemist identification is Zahel's statement; the exact metalmind inventory is not supplied.
- The cell-culture regeneration is particular to Hoid and this plan.
- A protective oath does not grant universal invulnerability.

For cross-book connections, compare **both ends** of the bridge. WaT can establish a name or event without establishing where an earlier novel first revealed it. The JSON includes eight bridge-hold groups covering Mistborn, Elantris, White Sand, Warbreaker, Dawnshard, The Sunlit Man, Tress and relevant Stormlight appearances. None should silently inherit the legacy bucket-12 gate.

Supplementary author remarks: [Sanderson's Galladon-tagged Q&A archive](https://wob.coppermind.net/adv_search/?tags=galladon) identifies Galladon, Baon and Captain Demoux in the earlier Purelake scene. This is author commentary hosted by a third-party archive, not a substitute for reading the counterpart novels or deriving field-level spoiler gates.

## Packet validation

Nine structural checks passed on the research packet: expected relationship/node counts, unique edge IDs, resolved endpoints, resolved sources, explicit work gates, nonempty claims/constraints, research-only status and exclusion of private identifiers. These validate the handoff data structure; they are not independent canon verification, app tests or browser results.

## Builder pickup and return

1. Preserve Claude's current D08 infrastructure/control unit and the accepted prior Elantris closures. This packet adds a bounded SA07 content unit; it does not change `status.md`.
2. Reconcile the current main/PR37 pack, then implement WAT-01–15. Return a per-ID applied/held disposition, exact commit, and any changed stable IDs.
3. Map the research ledger to the graph's actual node/edge/field schema. Retain the distinction between shown, reported, inferred, intended and requested actions. Complete bilateral source checks before promoting the eight cross-work hold groups.
4. Implement the magic specification in bounded modules using the existing atlas design and D08 visibility helper. The initial finite module is **Stormfall: what still works, and where**; then Connections/Nightblood and Dawnshards.
5. Return exact-head data integrity and spoiler tests plus rendered desktop/mobile evidence. Re-review touched facts against the source register. Do not count static inventory as a browser test or full canon approval.
6. Keep the existing independent review and separate release decision. This research packet is not merge or deployment authorization.

## Known gaps and next source unit

The remaining full-book audit must cover all chapters and epigraphs, intervening battle/vision sequences, all named minor worldhoppers and technologies, exact cross-series callbacks, and artwork/maps. The narrower next unit is **the complete Azimir/Narak battle sequence plus the eight cross-work bridge groups**, with each group scoped and returned independently.

Mishram's emergence and the immediate departure from the Spiritual Realm were directly checked; the complete causal chain, every contributor and all later effects on deadeyes need a dedicated follow-through. Likewise, finding Tanavast's explanation of Honor's withdrawal does not clear every older “Honor was Splintered” summary elsewhere in the app.

No claim is made that every Easter egg has been found. No application code, deployment or global canon status was changed. The whole-book ledger remains unapproved.
