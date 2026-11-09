# Isles of the Emberdark — primary-text checkpoint and builder handoff

Date: 2026-11-09. Mckay identified this as the next supplied book for the Cosmere accuracy, connection-map and interactive-magic review.

## Evidence and scope

Source IE: Brandon Sanderson, *Isles of the Emberdark: A Cosmere Novel*, Dragonsteel, first edition September 2025, ISBN 978-1-938570-51-3, as stated by the supplied ebook’s copyright page.

The preface explicitly says the book incorporates *Sixth of the Dusk* as flashback chapters, with slight mythology/worldbuilding revisions. Preserve this edition identity. Do not treat all incorporated text as identical to the earlier standalone novella or count reused events twice.

This is a targeted primary-text checkpoint, not a complete sequential read or exhaustive connection audit. All extracted text was retrieved; relevant passages were searched and read in context. Retrieval alone is not full reading. Artwork and maps have not been visually audited. The full-book certification count remains unchanged.

Implementation comparison: PR37 / atlas/deep-worlds at 08d10e1736d3e6916d7a061d311ddb13f444bb05, public/atlas/packs/cosmere.js. Main was observed at ae35afd46c983e10b2bbee16c20ccf3d8231375b. The existing cosmere-book-by-book status still assigns COS-BB-001 implementation to Claude; this addendum does not change that ownership or replace its accepted design.

(C) means narrow support in the cited text. Character explanations and beliefs remain attributed. (L) denotes inference; (U) denotes unsupported claims withheld from publication.

## Correction and enrichment dispositions

| ID | Target | Required disposition | Evidence |
|---|---|---|---|
| IE01 | work registry, timeline, e31/e61/e62 | Give this novel its own work ID and separate its present story from incorporated novella flashbacks. Do not unlock Wind and Truth or Fires of December merely because all currently share key 12. | Preface; approved COS-BB-001 v3 |
| IE02 | silverlight/slcity | Add a novel-gated era/dossier for the city above the bright Silverlight Nexus, glassy transparent ground, tall dragonsteel-supported towers and walkways. The older “mostly through scholars and rules” description is no longer adequate at this reading level. Retain schematic geometry. | 30 (C) |
| IE03 | Silverlight travel graph | Nexus connects three Physical destinations, one explicitly Yolen. Do not invent the other two. The Yolen exit is a greatstar in the upper atmosphere with flying-city infrastructure; access is regulated. | 30 (C) |
| IE04 | Silverlight time tools | One day in the city is currently ten outside, as this narrative states. Show direction and era qualification; do not apply this ratio to every perpendicularity or all periods. | 30 (C) |
| IE05 | emberdark/hiddengate and e62 | Existing small-central-island gate wording must be labeled as the crew’s hypothesis. The inner cavern actually contains Cakoban’s remains. Do not give visitors a functional portal at that hypothesis location. Preserve Dusk’s real Patji’s Eye crossing separately. | 60; compare 35–38 (C) |
| IE06 | Dakwara landmark | A fixed “giant serpent” description is incomplete: she is also encountered as a many-armed negative-Investiture horror, and the relationship between myth, perception and embodiment is central. Add scene/knowledge states instead of universalizing one shape. | 53–54, 59–60 (C) |
| IE07 | Dusk / Aviar magic | Do not make “eat worm paste” a universal talent grant. Dusk gains Current perception; later trials succeed for many, not all, trappers and only trappers in that sample. Ed’s proximity-to-perpendicularity explanation is a hypothesis, not a proven eligibility formula. | 33, epilogue (C observation; attributed explanation) |
| IE08 | Starling finale state | Do not mark the manacles removed or her freedom achieved. She reinforces them during the Intensifier attack; they hold. Whether they would have broken without her help remains unknown. The crew’s next goal is her freedom. | 58, epilogue (C) |
| IE09 | Frost character status | Do not turn Xisis’s statement that Frost is dead into settled fact. Hoid subsequently suspects Frost is hiding; disappearance remains unresolved in these passages. | 32 versus 51 (C for conflicting statements) |
| IE10 | Aditil / Scadrian faction records | A cracked bud does not erase all of Aditil’s abilities: she can still address aether spores. Do not publish “no aetherbound serve the Malwish” as fact; that crew assumption is explicitly disproved. | 46, 48 (C) |
| IE11 | Dynamic machinery and world links | It combines Rosharan antigrav, Dhatrian-network aether propulsion/power and a Scadrian composite hull. It specifically lacks an Awakened metalmind at introduction. Distinguish technology provenance from the ship’s travel history. | 22 (C) |
| IE12 | ship escape event | Keep the actual solution distinct from the earlier proposed aether-fuel sabotage. The Intensifier overload blacks out the camp; Nazh’s prison retains local backup and is physically broken after its surrounding pod/field loses power. | 58, 60 (C) |
| IE13 | Patji / Aviar text | Explain worms ingested from fruit at the pool as the source of talents; travel to the island alone is not the mechanism. Keep traditional migration observations and later industrial use distinct. | 18; compare 11 (C) |
| IE14 | h-dusk and travel/connection overlay | Split Dusk’s actual First-of-the-Sun crossing from Starling’s Yolen origin. A combined unlabeled path can wrongly imply Dusk visited Yolen. Display historical origin, present travel and alliances as distinct edge types. | Prologue, 21–22, 38, 61 (C source distinction; UI risk not rendered-tested) |

Fourteen disposition units reviewed. This is not a count of every claim in the pack.

## Proposed connection records

All are additions or mapping dispositions requiring implementation; none is claimed to exist in the rendered map. Gate each novel-derived fact by this work. Cross-book identity comparisons require the other work’s evidence and appropriate field-level spoiler gate.

| ID | Nodes | Relationship / limits | Source |
|---|---|---|---|
| IEC01 | Starling — Illistandrista — Yolen | Named identity and origin; prologue directly shows her home world and first transformation day. | Prologue (C) |
| IEC02 | Starling — Frost | Uncle/mentor; physical appearance in prologue. Do not place him physically with her present-day crew. | Prologue; 27, 51 (C) |
| IEC03 | Starling — Hoid | Apprentice relationship; Hoid later appears to her at the Spirit Shores. | 22, 44, 51 (C) |
| IEC04 | Hoid — Design | Design is present as a spren pattern during the Spirit Shores encounter. Contrast with her off-page mention in Fires of December. | 51 (C) |
| IEC05 | Hoid — Nohadon — Roshar | Hoid tells a story about Nohadon. It is a narrated historical reference, not a present-day Nohadon appearance. | 51 (C) |
| IEC06 | Hoid — Cephandrius Maxtori — Dynamic | Chrysalis links the ship to this Silverlight outlaw identity; exact alias crosswalk should retain attribution and independent identity sourcing. | 28 (C statement; full alias mapping requires evidence) |
| IEC07 | Nazh — Khriss — Taldain | Nazh refers to working for Khriss and says she has returned to Taldain. She is mentioned, not shown aboard the ship. | 30 (C) |
| IEC08 | Nazh — shade / Cognitive entity | He is now a ghost/shade, passes through materials except silver/aluminum, and can be imprisoned. Do not backdate this state to all earlier appearances. | 22–23, 48, 60 (C) |
| IEC09 | Xisis — Dynamic — Crow | Xisis owns the ship after Hoid’s disappearance and installs Crow as captain; later Starling leads the crew. Preserve sequence. | 22, 25, 28, 32 (C) |
| IEC10 | Crow — unnatural aether | She bears an unnatural aether and manifests dangerous vines. Connection to her earlier-book story needs that source before importing its details. | 28 (C) |
| IEC11 | Leonore — Malwish — Scadrial | Former Malwish military pilot/deserter; her expertise matters to the crew. | 28 (C) |
| IEC12 | Ones Above — Malwish empire — Scadrial | Explicit identification in the later narrative. Do not unlock this merely through Sixth of the Dusk. | 45 (C) |
| IEC13 | Aditil — Dhatri — aetherbound | Dhatrian origin, cracked bud, continuing expertise with spores. No automatic loss of every magical capability. | 22, 46, 48 (C) |
| IEC14 | Dhatri — Physical FTL routes | Its perpendicularity is gone; travel to it requires Physical-space transport in this account. Do not draw an available Cognitive-to-Physical exit there. | 22 (C) |
| IEC15 | Chrysalis — Sleepless / Clemaxin’s Hordes | Crew doctor, collective body, Connection-dependent sapience; she has sworn not to harm others. Do not make the whole species share her oath. | 35, 51, 60 (C) |
| IEC16 | ZeetZi — Grand Apparatus | His homeworld is named in the epilogue; he has escaped its oppression. Species identity and further lore need separate checked passages. | Epilogue (C) |
| IEC17 | Ed — Silverlight — Vaxilian heritage | Born and raised in Silverlight, with Vaxilian heritage. Heritage is not proof of his personal travel to Vax. | 25 (C) |
| IEC18 | Iriali — ancient tapestry — navigation | An old tapestry/map uses historical number/letter forms; Ed corrects the coordinate reading. Keep cultural artifact provenance distinct from modern ship navigation. | 30 (C) |
| IEC19 | Silverlight Nexus — Yolen | Multi-destination perpendicularity; only one of three destinations named here. | 30 (C) |
| IEC20 | Knell — Threnody — Current | Beacon near Threnody supplies a navigation reference; Allomantic bronze is one stated means of sensing its waves. | 25 (C) |
| IEC21 | Dynamic — Roshar / Dhatrian network / Scadrial | Mixed technology provenance: antigrav, aether engine, composite hull. | 22 (C) |
| IEC22 | Lumar — Drominad-area route — aether trade | The new access route would enable sublight travel for harvesting that currently requires expensive FTL; the narrator qualifies travel as perhaps under a year. No exact coordinates or guaranteed duration. | 36 (C qualified estimate) |
| IEC23 | Scadrian fighters — steelfield — Push/Pull | Dajer describes maneuvering through anchors; his claim of invincibility is propaganda, not neutral performance data. | 38 (C attributed mechanism) |
| IEC24 | Shield technologies — Allomantic / Awakened / Aonic | Dajer names three technologies when describing the guardian’s attacks. Do not invent full engineering specifications. | 39 (C attributed report) |
| IEC25 | Yolish vault — Dawnshard — Intensifier | Former Dawnshard vault opened by an Investiture device; identity and present location of that Dawnshard are not established here. | 40 (C) |
| IEC26 | Dakwara — negative Investiture — Odium’s slain sibling | Starling explains the category and origin but is uncertain about its classification number. Do not publish a definite numbered type from her uncertain recollection. | 54 (C attributed explanation) |
| IEC27 | Cakoban — Dakwara — Eelakin history | Myth, trials, remains and the later service relationship connect. Keep Dusk’s interpretation distinguished from an omniscient documentary account. | 3, 54, 59–60 (C with attribution) |
| IEC28 | First of the Sun — Xisis — Navigator trade | Negotiated future trade/tariff interests and Navigator services create leverage; not a guarantee of permanent safety or independence. | Epilogue (C) |
| IEC29 | Ed — Argent / Jess / Huio | Named proposed consultation with arcanists. No on-page appearance established by that mention; do not invent biographies or equate real people from name resemblance. | 30 (C mention) |
| IEC30 | Dajer’s Scadrial claim — Taldain / Invention’s planets | Starling internally challenges his technological-supremacy claim by invoking these alternatives. Invention’s planets remain unnamed in the passage. | 40 (C thought/reference) |
| IEC31 | Emberdark entities — Fires of December’s Megalith | Cross-book comparison of negative-Investiture entities: the two texts support a mechanism/category comparison, not an identity claim, shared event or proven migration route. | IE 54; FD XXIV, XXVII; both work gates required (C comparison, identity U) |

Thirty-one candidate connection records classified; full coverage of easter eggs is not certified.

## Interactive magic: recommended modules

Use the same per-work reading-state helper as the atlas. Extend the shared Cosmere magic experience rather than a disconnected spoiler-unsafe page.

### A. Aviar, worms and navigation

A sequence showing the pool-associated ecosystem, worms in fruit, bird ingestion and talents. Separate Kokerlii-style concealment and Sak’s death warnings rather than treating all birds identically. A later-work toggle introduces worm paste, Dusk’s Current perception and the epilogue’s actual tested outcomes.

Required limits:
- Not all consumers or trappers acquire navigation.
- Ed’s explanation is visibly attributed.
- Future death warnings are possible outcomes, not guaranteed death timers.
- Worm paste used on a hull enables floating on the unsea; this is not ordinary water buoyancy or automatic physical-space flight.

Sources: 6–7, 11, 18, 33, epilogue. Bird-by-bird full ability catalog remains a separate coverage task.

### B. The Dynamic’s systems

Clickable diagram of Rosharan antigrav, zephyr-aether pressure/thrust/air, Scadrian hull and crew control interfaces. Mark the absent Awakened metalmind explicitly as a comparison, not installed hardware. Show source-world links as technology links.

Aditil’s cracked-bud state must retain the ability to address spores. Distinguish the crew’s proposed fuel-hibernation sabotage from the actual escape solution. Sources: 22, 46, 48, 58, 60.

### C. Realmatic travel and time

A topology map with Physical routes, subastrals, unsea, portals and the Spirit Shores separated. Silverlight’s Nexus sits beneath the city and leads to three destinations, two unnamed. Dhatri has no usable perpendicularity in this period. The ring-island search is a mistaken portal-location hypothesis, not a confirmed exit.

An optional time comparison can show 1 local day / 10 outside for Silverlight in this narrative, clearly marked as the stated current ratio. Do not use it to invent synchronized dates for other books.

Sources: 22, 25, 30, 35–36, 49, 51, 60.

### D. Perception, stories and the Dakwara

Explain how the community’s structured stories influence untethered Investiture, and why Dusk’s understanding of the trials changes the available response. Switch among observed forms and narrative knowledge states; no invented numeric power levels or universal “belief creates anything” rule.

The cave’s manifestations and central grave must be separate from the actual perpendicularity. Do not show control of the Dakwara as making her safe to touch. Sources: 54–60.

### E. Starling’s manacles and the Intensifier

Story-state explainer: restriction, overload attempt, temporary access to her powers, deliberate reinforcement, camp blackout, manacles still present. Include her ethical decision rather than making the outcome a simple failed machine test.

The text says dragons do not breathe fire in this explanation; do not attach a generic fire-breathing animation to her. Her available powers and the brief access are described in chapter 58. Do not assert the machine would certainly have freed her without intervention.

## Required acceptance checks

1. All nodes, text, search hits, counts, deep links and pending animation callbacks obey work-level gates.
2. Six-of-the-Dusk-only state hides the novel’s Malwish identity, later character states and outcomes. Novel flashbacks do not generate duplicate events.
3. Hoid/Design’s Spirit Shores appearance is not a Physical journey edge; Frost’s current status stays unresolved.
4. Technology links, mentions, lineage, narrated history, personal travel and uncertain hypotheses have distinct labels.
5. The supposed central gate is not presented as a working portal after the truth is unlocked.
6. Aditil’s remaining abilities, the actual blackout/prison sequence and Starling’s retained manacles match the text.
7. Navigator eligibility is not universalized; Silverlight’s ratio is directional and era-qualified.
8. Test keyboard, phone/touch and reduced motion, with textual equivalents for diagrams.
9. Return exact implementation branch/head and per-ID disposition, then independent content and technical review. No release authorized by this document.

## Known gaps and next action

- Sequential chapter reading, every minor easter egg, art/map inspection, and all species/ability details remain incomplete.
- Earlier appearances of returning characters need their source books checked before combining identities and backstories.
- Exact world coordinates, full inter-book chronology and the unidentified Nexus destinations are not established.
- No code, rendered-page or device testing occurred in this documentation checkpoint.
- Existing Claude-owned spoiler implementation continues; do not restart the accepted design or alter its ownership.

Claude: integrate confirmed corrections/additions in a bounded return and explicitly hold unresolved identities and geography. Reconcile against the current branch before editing; preserve the earlier Elantris and Fires of December work.

ChatGPT continuation: complete sequential coverage with a chapter ledger, then verify the cross-book sides of returning-character and magic-system edges. Do not convert these targeted findings into a full-book sign-off.
