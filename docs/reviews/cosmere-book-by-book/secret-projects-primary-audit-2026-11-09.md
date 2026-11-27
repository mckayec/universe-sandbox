# Tress, Yumi and The Sunlit Man — primary-text checkpoint and builder handoff

Date: 2026-11-09. Requested by Mckay for the Cosmere atlas, connection map and interactive magic experience.

## Scope and evidence

All extracted text of the three supplied ebooks was retrieved. This checkpoint reads targeted passages in context; it is **not a complete sequential reading or an exhaustive easter-egg audit**. No full-book certification is added. Art, maps and extraction fidelity against rendered pages remain unchecked. Do not equate text retrieval with reading.

Primary sources (Brandon Sanderson):
- T: *Tress of the Emerald Sea*, ISBN 978-1-938570-34-6.
- Y: *Yumi and the Nightmare Painter*, ISBN 978-1-938570-40-7.
- S: *The Sunlit Man*, ISBN 978-1-938570-41-4.

Tress has usable chapter headings in the extraction. Yumi and Sunlit references below use unique scene anchors rather than invented chapter numbers. Source text remains private; this handoff contains paraphrases only.

Implementation compared: main ae35afd46c983e10b2bbee16c20ccf3d8231375b and PR37 08d10e1736d3e6916d7a061d311ddb13f444bb05. Before publication, main pack blob remained 0ca2f3eedf23bd6b453240c3e047e8c50671e5d2; PR37 advanced to 2f04e416696f0fe32ab5eca7be5d8b578cd129cd but its pack was byte-identical to the inspected snapshot (blob 5a74e300eaf88b2d3c81fa9bc957584cd4708e33). Main advanced through other documentation work; preserve those additions.

(C) is narrow primary-text support, including explicitly attributed character reports. (L) is inference. (U) is unresolved and withheld. The companion [connection ledger](secret-projects-connections-2026-11-09.json) separates primary findings from cross-book candidates that still need the other book checked. It is research input, not the application's production schema.

## Required corrections and dispositions

| ID | Target in public/atlas/packs/cosmere.js | Disposition | Evidence |
|---|---|---|---|
| SP01 | e51; Komashi blurb (PR37 lines 1357, 1164) | Remove “across time” and “In one age… In another.” Suggested event text: “A stone-stacker and a nightmare painter become linked and investigate the cause.” The spoiler-expanded account must describe simultaneous locations, reconstructed towns and erased memories, not travel into the past. | Y01, Y03 (C) |
| SP02 | Komashi blurb and globe scale explanation | Replace “a few hundred miles across.” The map-overlay scene gives **each nation less than fifty miles across**, and Kilahito/current village less than five miles apart. Do not turn these into a precise planet radius or combined inhabited-area diameter. Recalculate or remove the unsupported six-times enlargement claim; preserve schematic geography. | Y02 (C) |
| SP03 | books[11], every affected event/landmark/codex/edge | Separate the three works using accepted COS-BB-001/D08 infrastructure. Reading Tress must not unlock Yumi or Sunlit reveals. Do not create a second incompatible spoiler system. | Existing grouped key 11; existing accepted design |
| SP04 | Nomad more[12], Canticle eras[12] | Sigzil's identity is disclosed in Sunlit itself; it must be available to a Sunlit-complete reader without requiring Wind and Truth. Gate cross-book backstory separately. Do not move every key-12 fact wholesale. | S06 (C) |
| SP05 | Canticle eras[12] destination | Replace definite “then Skips on to UTol” with “then Skips to an unnamed ocean world inhabited by Sho Del.” UTol identification is a plausible optional theory, not confirmed by this ending. | S10 (C); secondary UTol page explicitly says likely |
| SP06 | Canticle environmental copy | Replace “sunset firestorm” with a powerful cooling storm with rain and lightning. Qualify blanket sunlight danger: explain the observed surface/core interaction and high-altitude exception instead of asserting all light at all heights kills. | S02, S05 (C) |
| SP07 | Union/Beacon markers and routes | Label moving-city positions illustrative. Do not imply stationary settlements or canonical fixed coordinates. Keep the persistent broad terrain distinguishable from daily surface changes. | S02 (C) |
| SP08 | PR37 Lumar scenes water:true | Inspect actual renderer behavior before deciding a code fix. Spores are dry particles fluidized during the seethe, not liquid water. If the flag renders water, separate that material/behavior; if merely a generic surface selector, document and verify its output. This is an untested rendering risk, not a confirmed visual failure. | T01 (C) |
| SP09 | Torio/steamwell scene and ritual copy | Separate apparent intact town from actual ruins and the machine's projected reconstruction. Opening spirit manifestations cannot all be presented as genuine: the explanation reveals fabricated village spirits except the one freed spirit. The depicted count of 37 is not a universal stacking output formula. | Y03, Y04 (C) |
| SP10 | Hoid codex and connection overlay | Add Yumi narration and frozen/coatrack participation; distinguish Sunlit remote projection from physical presence on Canticle. Tress narration and on-world intervention are separate relationships. | T09, Y05, S03 (C) |
| SP11 | Magic explanations and character states | Preserve Auxiliary as a highspren and his terminal sacrifice. Do not identify him as Sigzil's earlier honorspren or restore his personality with ordinary recharge. Nomad no longer carries the Dawnshard; residual changes remain. | S04, S08 (C) |
| SP12 | Graph semantics | Distinguish appearance, narration, identity, technology provenance, reported migration, comparison, mention and proposed travel. Generic worldhopping arcs must not imply every referenced world was visited. | Companion ledger |

These are finite implementation units, not a claim that every other atlas statement has passed.

## Primary evidence register

- T01 — Chapters 1–2: twelve moons/spore seas; salt and silver; Iriali departure story attributed to Charlie. His invented history for a cup is not a documentary migration account.
- T02 — Chapter 15: Fort's Nalthian tablet, Awakened predictive Connection circuitry; supplier is not identified as Hoid.
- T03 — Chapters 18, 22 and 42: Ulaam's bodily adaptations; Hoid invited him to the planet; Sazed released his people. Preserve evidence granularity for kandra identity and Scadrian history.
- T04 — Chapters 23–24: twelve spore kinds; bone-spore story disputed; Linji/Aviar mention.
- T05 — Chapters 26, 28 and 31: iron attracts/steel repels roseite growth; water catalyzes access to Spiritual Investiture; moon aethers differ from ordinary symbiosis; Luhel bond exchanges physical matter/water; silver touching Midnight Essence harms it.
- T06 — Chapters 28, 31 and 52: Crow's direct moon-aether connection, fatal thirst condition, and remaining with Xisis. Infection cause is not known.
- T07 — Chapters 37, 40–44: composite spore mechanisms, wax isolation, roseite and silver, sunlight-spore heat/light, crimson growth and zephyr air.
- T08 — Chapters 51 and 56: Xisis; Threnody's Lilting Abyss comparison; Hoid's sixteen-companions allusion. Identifying the latter with the Shattering is interpretation unless supplemented.
- T09 — Chapters 60–64 and epilogue: Riina's Aonic devices; Huck/Charlie identity; Fort bargaining with Midnight entities; Breath-powered metal guards; Hoid's Aons and invitation; departing spacecraft.
- Y01 — Design's hion-powered soul-examination conversation: no pastward time travel; same world; Yumi's extraordinary Investiture compared with Returned and Elantrians; Nikaro is not an equivalent highly Invested being. Comparison is not species identity or an exact BEU measurement.
- Y02 — Masaka's reconnaissance and subsequent map-overlay scene: Sleepless/hordeling reveal; spatial overlap, less-than-fifty-mile nations and less-than-five-mile proximity.
- Y03 — Narrator's father-machine explanation after the revelations: badly Awakened machine, human souls becoming shroud, later spirit exploitation, fourteen surviving yoki-hijo and prison towns, nightly memory erasure, about 1,700 years. Skills persist; this is not time resetting.
- Y04 — Finale: stone-stacking outside the machine's shielding, diversion of spirits, Nikaro painting people as themselves, actual Torio ruins. Yumi's return depends on this specific situation and her choice, not a universal resurrection recipe.
- Y05 — Design's noodle-shop introduction and closing explanation: Cryptic, wireframe/Lightweaving/force-projection presentation rather than a true human body; Hoid frozen by protective protocols. The “three years” statement uses Rosharan years.
- Y06 — Introduction, spirit discussions and epilogue: Virtuosity's self-Splintering; hion/paired spirit functions; UTol named as twin; willing spirits maintain hion afterward; historical dramas also interest spirits.
- Y07 — Spacebus/daystar scenes and ending: four-armed inhabitants; Hoid's planned theft at Iron Seven Waystation. A plan is not completed travel.
- S01 — Early Investiture calculations and later limitations: 1,500 BEU less than 8% Skip; roughly 1,000 BEU/5% strength estimate; low-charge healing and new Connection restrictions. Approximate character-specific accounting, not a universal energy law.
- S02 — Early storm and travel explanations, later diameter estimate: sunrise in west, cities racing east, cooling-storm behavior, changing surface; roughly 200-mile maximum diameter is Nomad's estimate.
- S03 — Rain conversation with Wit's projection: remote interaction; Yolen childhood reference. Not proof Wit physically visits Canticle.
- S04 — Dawnshard/Torment explanations and Night Brigade pursuit: former bearer, residual changes, consumed Auxiliary; highspren identification; threatened spike-based tracking is an intended tactic, not an accomplished event.
- S05 — Mountain/high-altitude sunlight experiment: core-associated Investiture circuit, heat filament and altitude-dependent survival.
- S06 — Naming/Connection scenes: Sigzil identity, Zellion name, genuine local Connection following belonging; language access alone is insufficient.
- S07 — Scadrian lab: Dor supply, Awakened steelmind, metal glove/Push, Radiant-oath questions; priming drained sunhearts using local warmth before sunlight recharge. Do not assign every device an unconfirmed exact art.
- S08 — Auxiliary's voluntary final sacrifice: temporary restored capabilities, later loss of personality while the usable object remains.
- S09 — Chorus and ancestry explanations; rebellion finale: Threnodite ancestors, unusual shades retaining memories/cooperation, Rebeke and Elegy's agency. Do not copy every Threnody shade rule unqualified.
- S10 — Ending: ocean world, Sho Del, no explicit UTol name. Author postscript's abandoned Shai concept is not an alternate canonical event.

## Interactive magic requirements

Three work-specific modules should join the shared Cosmere magic experience. No dedicated Cosmere magic page was found in the inspected main tree or PR37 pack; public/powers is a science scale exhibit, not this feature. These are builder specifications, not pages already implemented.

### Lumar: spore laboratory

Controls: choose a **documented** spore type, wet/dry state, seethe/still state, salt/silver contact, and appropriate iron/steel manipulation. Use a compact animation with a textual causal explanation.

Show verdant growth, crimson spikes, roseite formation, zephyr air, sunlight heat/light, and Midnight Essence as distinct behaviors. The universe contains twelve kinds; leave insufficiently documented types unknown instead of inventing outputs. Water is the catalyst and bond resource, not the total source of the manifested matter/energy.

Separate ordinary spore activation, a spore-eater's dangerous direct link, and a temporary Luhel bond. Midnight entities can negotiate and resist; a water slider is not guaranteed mind control. Distinguish touching silver from mere proximity. Offer composite wax-separated mechanisms as story examples, not exact engineering recipes. Sources T01, T04–T07, T09.

### Komashi: art, perception and spirit technology

Provide two gated views: story-start understanding and post-reveal explanation. Show attention/art attracting spirits and paired technological functions; do not impose an invented numerical stacking score or make stone-stacking the only accepted art.

Explain why painting an innocuous form constrains a nightmare, and contrast the finale's restoration of a remembered person. The brush/pigment is not independently magical. Separate spirit energy, human souls/shroud and machinery; no generic “all ghosts are fuel” model.

A finite story-state diagram should show machine awakening, soul consumption/shroud, false towns and memory erasure, freeing spirits, and willing post-finale hion supply. Do not animate travel backward in time. Design's projection, Nikaro's art, Yumi's Investiture and Hoid's freeze are distinct mechanisms. Sources Y01–Y06.

### Canticle: sunlight, warmth and Connection

Show rotation, westward sunrise/eastward city flight, the surface/core circuit, high-altitude exception and cooling storm. This is a narrated magical system, not a physically validated astronomical simulation.

A sunheart state sequence should distinguish spent, locally primed and sunlight-recharged states. Separate sunhearts from invasive cinderheart control. Keep local Connection and the residents' role visible; Nomad cannot solve everything by merely learning the language.

Use optional Nomad-only approximate BEU/Skip indicators. Never expose a mathematically exact universal 20,000-BEU maximum derived from rounded estimates. Separate remaining Dawnshard effects, Torment restrictions and Auxiliary's sacrifice; no refill button resurrects Auxiliary. Sources S01–S09.

## Builder acceptance and routing

Owner for implementation remains Claude under the existing cosmere-book-by-book fixing status. This supplemental handoff does not overwrite D08 ownership, restart its design, alter Elantris closures, or supersede concurrent Fires of December/Emberdark work.

Next bounded return:
1. Reconcile SP01–SP12 against the then-current branch; implement confirmed text corrections first.
2. Import reviewed ledger records through the accepted work registry and graph schema. Map research work labels to canonical IDs; do not treat them as finalized application IDs.
3. Confirm both sides of cross-book identities before publishing the full cross-book edge. Partial book-local facts can ship independently.
4. Return exact head and per-ID applied/held dispositions. Magic modules can be a separate implementation unit without delaying factual fixes.

Required checks:
- Yumi-only state never implies time travel or reveals Tress/Sunlit endings.
- Sunlit-only state can reveal Sigzil without unlocking unrelated Wind and Truth facts.
- Counts, search, labels, tooltips, URLs, scene details, saved state and delayed callbacks honor individual work gates.
- Hoid projection, BEU reference, technology provenance and Iron Seven plan do not become physical-travel edges.
- Nomad→UTol remains explicitly inferred or omitted from confirmed mode.
- Lumar rendering shows dry spores; Torio knowledge states and mobile-city markers match their labels.
- Keyboard, touch, reduced motion and text alternatives work for every module.
- Return browser and automated verification appropriate to changed code. This docs-only checkpoint does not supply those passes.

## Remaining coverage

Full sequential reading and a chapter-by-chapter ledger remain outstanding for all three books. Minor characters, every easter egg, artwork/maps, full chronology, and earlier/later books' sides of crossover claims are not certified. Read target books for Riina/Ire and Ulaam/Lost Metal before changing secondary candidates to primary-confirmed. Reconcile Crow/Xisis with the independently prepared Emberdark checkpoint without assuming simultaneous events.

Secondary pages consulted for candidate triage on 2026-11-09:
- https://coppermind.net/wiki/Riina
- https://coppermind.net/wiki/Ulaam
- https://coppermind.net/wiki/Masaka
- https://coppermind.net/wiki/UTol

No application edit, merge, deployment, exhaustive-coverage claim or release approval occurs in this handoff.
