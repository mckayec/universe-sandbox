# MB07 — first bounded source/inventory checkpoint

ChatGPT, 2026-11-19. The Bands of Mourning audit is **incomplete**. No full-work approval, new mapping/gate, parent promotion or implementation request.

## Revisions and finite inventory

Authenticated GitHub reads: PR48 `feature/cosmere-reading-state` at `52534d0975af39e620e05a43c2f4f05dc6b4b1fc` (pack blob `0fd66c7cca0085872e8f8a3d2154e4010356b9e6`); PR24 `fix/lore-corrections` at `cf25cda66e91c573c421a0f3712623db72737a3b` (blob `3ff0aab059fa54e00f6e2ccc7b849d4bd206d958`); PR37 `atlas/deep-worlds` at `03394c32816fcb5c95261bf6a9ea4520381a5838` (blob `5a74e300eaf88b2d3c81fa9bc957584cd4708e33`).

Evaluated the actual JavaScript packs in isolated Node vm contexts and selected e28/e29 plus Scadrial sites newseran/southcontinent: **12/12 selected record slots inventoried across 3 branches**. This is not a whole-book atomic-claim denominator.

| Record | Common payload | Additional PR37 payload / evidence boundary |
| --- | --- | --- |
| e28 | book 6; scadrial/newseran; title The Bands of Mourning; text combines a legendary-relic pursuit with proof of peoples beyond the sea | lm: falls. Neither the complete sequence's New Seran attachment nor falls pin is validated by opening train scenes. |
| e29 | book 6; scadrial/southcontinent; title News from the south; southern peoples' existence and technological comparison | No added landmark. Discovery scene location and comparative technology require later text. |
| newseran | lat -2.79, lon 2.61; books [6], since 6; terraced waterfall city, gondolas, southern Basin edge | Classical medium city scene, mist/river; falls landmark and Kelesina-framing claim. No geography/scene certification here. |
| southcontinent | lat -72, lon 10; books [6,10], since 6; near-pole/ocean/climate, towers, flying craft and Malwish assertions | Modern large city, snow scene. Neither literal coordinates nor climate/schematic scene validated here. |

PR48 and PR24's four selected records match. PR37 adds the e28 landmark and site scenes above. Preserve separately owned PR37 content; do not import it into PR48 on the strength of matching base descriptions.

Reproduce selection after evaluating each exact pack: `p.events.filter(e=>['e28','e29'].includes(e.id))` and `p.worlds.find(w=>w.id==='scadrial').sites.filter(s=>['newseran','southcontinent'].includes(s.id))`.

## Opened sources and claim disposition

Firecrawl live retrieval, HTTP 200; authorized excerpts credited to Brandon Sanderson, copyright 2016. Separate Deep Research not invoked. No claim of final-edition collation.

- [B07-I: publisher excerpt index](https://reactormag.com/columns/mistborn-the-bands-of-mourning-excerpts/) lists six excerpt posts. Navigation evidence only.
- [B07-5: Chapter Five](https://reactormag.com/excerpts-brandon-sanderson-the-bands-of-mourning-chapter-five/), published January 11, 2016. Direct chapter body: Wax's train travels south of Elendel; outer-city protests and Steris's explanation of transport/tariffs occur aboard the train. This supports that bounded journey segment, not an exact New Seran coordinate or later discovery site.
- [B07-6: Chapter Six](https://reactormag.com/excerpts-brandon-sanderson-the-bands-of-mourning-chapter-six/), published January 18, 2016. Direct chapter body: Marasi examines ReLuur's reports during the train journey, focuses on recovering his missing spike, and Wayne studies New Seran passengers' accents. ReLuur's creature report and Marasi's speculative explanations are not omniscient confirmation.
- Shared introductory synopsis on B07-5/6 describes a New Seran investigation and the reputed Bands. That is publisher promotional evidence, not chapter-body proof of the relic's true origin, abilities or final discovery. Repetition on two pages is not independent corroboration.

| Unit | Result / confidence |
| --- | --- |
| Early southbound train journey | C, direct text B07-5; bounded segment only |
| ReLuur-spike investigation during that journey | C, direct text B07-6; objective, not proof of successful recovery |
| e28 complete current sentence and discovery attachment | U for complete primary-scene validation; no falsehood finding from excerpt absence |
| e29 complete current sentence and attachment | U for complete primary-scene validation; later scenes not opened |

**4/4 selected evidence units dispositioned; 2/4 narrowly supported, not two entire atlas records approved.** Two chapter bodies read; **0/1 full novels read**. No new gate: the complete parent payloads remain held. Do not turn early narrative associations into a whole-record approval.

## Known gaps and precise continuation

This is MB07 checkpoint 1 under the two-checkpoint cap. Next bounded unit: open the authorized setup excerpt (Chapter Three/Four as routed by B07-I), then seek lawful primary evidence for the e28/e29 discovery/location claims and New Seran description. If later scenes remain inaccessible, record explicit holds or a finite conservative narrowing that does not misplace an event; do not invent a discovery pin. At the cap, defer the full work with Known gaps rather than adding repeated open-ended research runs.

Gaps: later southern encounters, relic mechanics/origin, event chronology and scene attachment; complete geography/journeys/missing-content inventory; cross-world connections and magic; final-edition and independent corroboration; rendered runtime checks. These block full-work/parent approval. Current 0/33 full-work approvals and 0/2 Scadrial parent promotions remain. No new Mckay decision is needed for this finite continuation.

MB06's 1/1 text correction is separately accepted in [implementation-review-52534d0.md](implementation-review-52534d0.md); its full-work audit is deferred with gaps. Existing Save/Load limitation and PR37 release/scene holds are unchanged.
