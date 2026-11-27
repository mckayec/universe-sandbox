# The Fires of December — primary-text checkpoint and builder handoff

Date: 2026-11-09. Requested directly by Mckay: audit the supplied book against the Cosmere atlas, capture appearances/crossovers/easter eggs, and assess an interactive magic page.

## Scope and evidence

Source FD: Brandon Sanderson, *The Fires of December (Hoid’s Travails)*, Dragonsteel, first edition 2026, ISBN 978-1-938570-72-8. Edition and copyright were read in the supplied ebook. This establishes the edition's stated year, not the existing site's precise October release-date claim. The ebook says some premium-edition illustrations are omitted; its map/art has not been visually audited.

This is a targeted primary-text checkpoint, NOT a complete sequential reading or exhaustive connection audit. Full extracted text was retrieved, then relevant passages were searched and read in context. Retrieval is not equivalent to reading every passage. Do not promote the existing 0/33 full-book audit ledger.

Compared:
- main snapshot 6cf0920002ae1147d21349d098428b0013c8f31c, public/atlas/packs/cosmere.js.
- PR37, atlas/deep-worlds, 08d10e1736d3e6916d7a061d311ddb13f444bb05, same pack.
- PR24 metadata only: fix/lore-corrections, cf25cda66e91c573c421a0f3712623db72737a3b. No fresh content approval of that PR.
- main public/powers/index.html and powers.js: no Cosmere/Allomancy/Surge/Miral matches in this source check. This is not a rendered-route inventory.

Keep the existing Claude-owned COS-BB-001 status and accepted Elantris dispositions unchanged. Integrate this finite addendum into the existing Cosmere lane, not a replacement spoiler design. No application change, runtime test, merge or deployment is claimed.

## Corrections and dispositions

(C) below means the cited supplied text supports this narrow proposition. (L) denotes an inference needing corroboration. (U) means unsupported and held.

| ID | Existing target | Disposition / replacement | Evidence |
|---|---|---|---|
| FD01 | PR37 miral.kingseat landmark palace | Remove “and the Ever-Slaying Sword” from its name and “which keeps the Prophet’s sword” from its description. The sword/spike is in the Megalith’s heart chamber; the palace has a blood tributary, which matters to the release. Keep the palace and heart as distinct places. | FD XXV–XXVI, XXXIX (C) |
| FD02 | PR37 miral.kingseat landmark megalith | “Eight hundred years ago” describes the reported arrival/awakening, not the Prophet’s defeat of it. Chapter I places the Prophet about three centuries earlier. Prefer “The Megalith’s heart, pinned by the Prophet’s binding device” rather than conflating dates or implying its soul ceased to exist. | FD I, X, XXVI (C; early chronology attributed to local accounts) |
| FD03 | PR37 miral.kingseat landmark hexers | Replace mining “from the river” with mining demonstone from the Megalith’s body through tunnels off the heart chamber. | FD XXV, XXVII (C) |
| FD04 | PR37 event e126 and monastery library landmark | Mark December’s experienced possible lives separately from the continuing external timeline. Do not place the plague and years of monastery research on the main historical timeline without qualification. Her experience is real to her, but is not the inevitable future. | FD XXXVIII, XLI, epilogue (C) |
| FD05 | PR37 event e127 | “The king’s ministers dismiss her” is misleading as a blanket statement: Geoffrim takes her report seriously, discusses it and promises action, while concealing his agenda. Use “December delivers her warning at court and is referred to Geoffrim.” | FD XII–XIII (C) |
| FD06 | PR37 event e128 | Refine the release mechanism: the king takes the binding power and Geoffrim takes it from him; contact with demon blood and the passphrase can undo the binding. Literal extraction of the giant sword is not required. | FD XXXIX–XL (C; sequence supplied by Hoid retrospectively) |
| FD07 | main/PR37 miral blurb, Valor entry | Retain the historical Valor connection and difficult access through an irregular, Shard-unattuned perpendicularity. Do not relabel Valor as currently resident, or identify Valor as the Megalith’s power source. | FD IV, XXVII, epilogue (C) |
| FD08 | e63 publication parenthetical | The supplied edition supports 2026. Remove or hold the specific October claim pending independent publication evidence. It is unnecessary to the story event. | FD copyright page (C year; U month) |
| FD09 | SITES_MIRAL monastery/southplains and map geometry | Hold an eight-hundred-year monastery age and exact geographic dimensions/coordinates for a dedicated check. Do not turn accounts of formerly forested plains into proof of their present uniform forest cover. Existing schematic notices remain necessary. | FD X, XLI; illustration audit outstanding (U for exact geometry) |
| FD10 | all key-12 records | Give this work its own identity in the approved D08 registry. Reading this book must not automatically unlock Wind and Truth or Isles of the Emberdark. Cross-book identity conclusions need their own evidence and gates. | Existing accepted COS-BB-001 v3 contract |

These are 10 finite reviewed disposition units, not a denominator for every atlas field or every book claim.

## Connection-map additions

Each row is a proposed stable evidence ID, not an assertion that a rendered edge exists. Gate the full row by this work at minimum. Existing-character identities from other books need separately sourced, field-level gates. Use typed edges: appearance, mention, mechanism, historical influence, analogy, inference. Never draw every edge as a physical journey.

| ID | Connection / proposed edge | Kind and precise supported scope | Source / confidence |
|---|---|---|---|
| FDC01 | Hoid → Miral / December | Physical participant and narrator; present at the Rivershore inn and later speaks with December. | I, XXVII, XXXVIII (C) |
| FDC02 | Hoid → Valor | He came hunting Valor; this does not establish meeting her on Miral. | IV, XXVII, epilogue (C) |
| FDC03 | Valor → Miral religion / temple | Historical founding influence; the temple trap is implicated in Hoid’s burning. Preserve his retrospective uncertainty about the first incident. | IV, epilogue (C as narrated) |
| FDC04 | Hoid → Jasper | He refers to a religious fiasco there. No inferred coordinates or route. | IV (C mention) |
| FDC05 | Hoid → Tzendish cult | He mentions previously joining one; world identity is not established here. | XXXVIII (C mention) |
| FDC06 | Hoid → Design | Design is named as away on a quest. This is an off-page mention, not an on-page appearance. | XXXVIII (C) |
| FDC07 | Prophet → Roshar | Epilogue explicitly locates the real Prophet on Roshar; his visit to December is a directed simulacrum. | Epilogue (C) |
| FDC08 | Prophet → Vasher/Zahel candidate | Rope-belt description, engineering and Breath-related clues support a candidate identification, but the inspected passages do not name Vasher or Zahel. Do not merge character nodes as established solely from these clues. | XXVI, XXXVIII, XLI, epilogue (L; cross-book confirmation needed) |
| FDC09 | Prophet ↔ unnamed dragon | An independent dragon helped him; neither a transformation of the Prophet nor Valor. Dragon identity remains unassigned. | XXVI (C; identity U) |
| FDC10 | Megalith → Ambitional entity | Hoid explicitly describes a Splintered Ambitional entity. This is not evidence that Valor created it. Do not infer a specific journey from Threnody. | XXVII (C as Hoid’s explanation) |
| FDC11 | Ever-Slaying Sword → Hemalurgy-related mechanism | Bind-point placement plus Hoid’s later qualification “Hemalurgy-adjacent.” Do not describe conventional attribute theft as demonstrated here. | XXVI–XXVII (C) |
| FDC12 | Binding device → Aon | An Aon binds the silver spike to the entity’s Spiritual aspect. The Prophet’s access to Aons is not explained. | XXVII, XXXVIII (C) |
| FDC13 | Binding device → transformed Breath-derived power | Hoid first speculates, then explains a buffer of transformed, purified Breath-adjacent Investiture, not ordinary transferable Breath left unchanged. | XXVII versus XXXVIII (C for later explanation) |
| FDC14 | Godsflame → Ashyn / Hoid | Hoid names Godsflame and says he thought it could not leave Ashyn. Distinguish that former belief from a proven transportation rule. | XXVII, XXXVIII, epilogue (C as stated; transport mechanism U) |
| FDC15 | River bathing → Soothing analogy | Narrator explicitly compares temporary emotional damping to Soothing. Do not label the river ordinary brass Allomancy. | XXIV (C analogy) |
| FDC16 | River garments → Scadrian garment analogy | Narrator points to a similar garment on Scadrial without identifying it in this passage. A named technology or equivalence needs the other source. | XXIV (C analogy; specific identification L/U) |
| FDC17 | Kingseat → T’Telir Court of Gods | Explicit comparison of colorful environments; not evidence of travel between these cities. | IX (C comparison) |
| FDC18 | Miral transport → Scadrian canals | Explicit historical analogy to towpaths/canals. Do not render a travel route. | III (C comparison) |
| FDC19 | Hoid memory backups → earlier incidents | A deliberate allusion to multiple prior incidents, but unnamed here. Specific book/event links remain candidates until corroborated. | XXVII (C allusion; specific edges L) |
| FDC20 | Dangerous sunrise → candidate Canticle allusion | The narrator references a planet where sunrise is too much without naming it. Keep out of confirmed identity edges pending corroboration. | XXXVIII (L) |
| FDC21 | Valor trail → three dragon-ruled worlds | Hoid derives a next search lead from temple murals. Keep three unnamed destinations; no invented world names or coordinates. | Epilogue (C) |
| FDC22 | Hoid’s condition → Cognitive Shadow / Returned / Herald / Creed Wraith terminology | These are comparisons he explicitly rejects for his current state. A vocabulary link is valid; membership edges are false. | XXVII (C negative relationship) |
| FDC23 | December ↔ Beautiful / Megalith core | Bonding, individuality and the later containment of the core belong in the late-book graph. Do not collapse all southern demons into Megalith fragments. | XXXIV, XLI–XLIII, epilogue (C) |
| FDC24 | December’s possible lives → Spiritual Realm / Connection | Her experienced life is not dismissed as unreal; contact with the Prophet persists in his recollection. Avoid presenting unrestricted time travel as the demonstrated mechanism. | XXXVIII, XLI, epilogue (C) |
| FDC25 | Witchcraft → Zuhel bond | Hoid names the bond but is interrupted before explaining it. Preserve that limit; no invented complete rule set. | XXVII (C term; complete theory U) |

Count: 25 candidate connection records classified; none implemented by this handoff. This is not an exhaustive count of the book’s easter eggs. Confirmed textual mentions do not by themselves confirm an inferred cross-book identity.

## Interactive magic page: buildable content specification

Recommendation: extend the Cosmere experience with a linked magic page/panel using the same reading-state helper as the map. The source check found no Cosmere material in the current generic powers files, but route/layout implementation remains Claude’s responsibility.

### 1. Explore the binding device

A selectable schematic with four linked elements:
1. Megalith soul and Physical shell.
2. Silver spike placed at the bind point.
3. Aon lock.
4. Transformed Breath-derived buffer between the lock and silver.

Selecting each element explains its function, chapter citation, uncertainty, and related connection-map nodes. Provide states for intact binding, power withdrawn, released core, and later outcome. Frame transitions as this book’s observed case, not a universal executable magic calculator.

Key facts: silver alone would damage rather than securely pin this entity; the buffer enables the binding; withdrawing its power heals the recipient as a side effect; the power is no longer ordinary Breath; the blood-contact route matters. Passphrase actions include putting in, taking out, and dispersing power; full instructions and exact limits remain source-qualified. See XXVI–XXVII, XXXVIII–XL, XLIII and epilogue.

### 2. Demon bond and its cost

Show December / Beautiful / power use / bodily-spiritual cost together. The prison escape demonstrates heating metal and depletion. Her exceptional protection must not become a property assigned to all witches. Separate small Megalith fragments, the core, and southern entities. See XXXIV and XLI–XLIII.

### 3. Hoid’s regeneration loop

Explain body destruction → healing fuel → continuing fire, then suppression of healing/Spiritual access → fire starved → recovery. Do not label him dead, Returned or a Cognitive Shadow. Treat the Ashyn origin statement and temple mechanism at their actual evidential strength. See XXVII, XXXVIII and epilogue.

### 4. Experienced lives

A toggle between the external sequence and December’s experienced possible lives. Use visually distinct tracks and explicit labels. Do not feed possible-future plague/curdling events into the main history as accomplished facts. No invented calendar synchronization with Roshar.

### Acceptance checks

- Per-work gate protects nodes, labels, edges, tooltips, search, counts, deep links and animation callbacks; unchecking this work removes its information immediately.
- Cross-work identity labels obey combined reveal requirements; reading this book alone cannot auto-select another book.
- Confirmed, narrator-qualified, analogy and theory edges are visually and textually distinct; theories hidden by default.
- No unnamed-world or unnamed-dragon placeholder acquires invented coordinates/identity.
- Palace and heart are separate; mining is in the body; arrival and defeat chronology are not conflated.
- Possible-life tracks do not contaminate actual-event timelines.
- Keyboard, touch and reduced-motion operation; text equivalent for each interactive state.
- Return exact branch/head, changes, source-to-record mapping and desktop/mobile evidence. Independent content and technical review, then owner release approval remain.

## Known gaps and next action

| Gap | Effect | Blocks |
|---|---|---|
| Not a complete sequential reading | Cannot certify all easter eggs or all book claims | Exhaustiveness/full-book sign-off |
| Cross-book identity and allusion corroboration | Vasher/Zahel, specific memory incidents, garment identity, Canticle candidate remain provisional | Those promoted identity edges only |
| Original artwork/map not inspected | No authoritative geometry or illustration-detail certification | Precise map claims |
| Latest integrated application not tested | No claim that corrections or UI are present/live | Implementation and release |
| Precise publication month unverified | Use edition year only | October wording only |

Claude: take FD01–FD10 and confirmed portions of FDC01–FDC25 as a bounded source packet, reconcile against the latest integrated branch, and return an implementation disposition for every ID. Preserve the existing spoiler infrastructure work. The unresolved identities may remain held while confirmed corrections proceed.

ChatGPT continuation: sequential chapter coverage and remaining geographic/magic claims, followed by corroboration from the other source books. Do not silently change this checkpoint into a full-book certificate.
