# Wind and Truth — interactive magic-page specification

Recorded 2026-11-09 UTC. Research/implementation specification, **not an implemented page**.

Related: [primary audit](wind-and-truth-primary-audit-2026-11-09.md), [73-relationship source ledger](wind-and-truth-connections-2026-11-09.json), [existing D08 implementation contract](implementation-handoff-2026-11-09.md).

## Decision

**Add a dedicated interactive Cosmere magic page within the atlas.** Wind and Truth changes access to Investiture, bonds, Shard holders and travel routes. Static descriptions lose the conditions under which a power works. The existing scientific Powers of Ten page is a different feature.

The experience should answer three questions clearly: **What is possible here? What enables it? What remains unknown?** Present canon demonstrations and attributed explanations. A sandbox extrapolation must be visibly optional and never become a source-backed fact by passing through an animation.

## Initial bounded delivery: Stormfall

Use the existing atlas navigation/design. Start with one fully sourced module, not a new all-magic rules engine.

Controls:
- Era: **Before Stormfall / Stormfall / Aftermath**.
- Location/context: **Urithiru / wider Physical Roshar / Shadesmar / Scadrial**. These are state contexts, not precise spatial simulation.
- Subject: ordinary Stormlight-dependent Radiant or Oathgate, Navani/Sibling protection, Fused, seon communication, Adolin/Unoathed, Hoid/Design.
- “Show why”: open the exact named scene and paraphrased evidence, with testimony/estimate labels.
- Reading checklist: the existing D08 control, shared with the atlas and connection map.

Show one compact mechanism at a time: source of power → enabling bond/route → demonstrated action → limitation. Animate movement/flow only where the evidence supports it. Reading-state permission comes before any caption, graphic, search entry or animation is constructed.

| Subject and context | Before / transition / aftermath evidence | Required limitation |
|---|---|---|
| Ordinary Stormlight / Oathgate | Stormfall withdraws Light; Shallan cannot transfer at the Oathgate (S22) | The initial failure is directly depicted. “Forever” is a character's prediction, not a certified end-of-series rule. |
| Urithiru, Navani and Sibling | Protective response and continuing Towerlight exception (S22, S27) | Protection is local; Navani and the Sibling are incapacitated. Do not imply ordinary society is unaffected. |
| Fused seen in Shadesmar | Their powers still function in the later scene (S28) | Preserve the observed context; do not infer every power everywhere. |
| Seon connection across worlds | Ala communicates with Kelsier without Stormlight (S29) | Messages must account for changing time rates, not instant synchronous voice. |
| Adolin / Maya / Unoathed | Blade and Plate access persists in the aftermath (S27) | This is a distinct bond development, not universal Radiant power restoration. |
| Hoid / Design at interplanetary separation | Hoid senses his Lightweaver powers but cannot summon Design as a Blade there (S26) | Design remains on Roshar. Distance limitation is the supported scope, not permanent bond destruction. |
| Cultivation's familiar perpendicularity | Previously used route is gone after her departure (S22, S28) | Preserve earlier-era route; disappearance does not prove every possible worldhopping route is sealed. |
| Listeners' new Light | A new Light is offered and accepted (S25) | Exact taxonomy, universal substitutes and future supply are not established by this scene alone. |

Do not expose a pre-Stormfall-only reader to controls named after the hidden outcome. Use neutral available modules or hide the inaccessible module entirely according to the accepted D08 helper.

## Follow-on modules

| Module | Interaction | What the source permits | What must stay unavailable |
|---|---|---|---|
| **Connection and Nightblood** | Step through Kaladin's Fifth Ideal, the new connection, Szeth's Lashings and the drain | Distinguish wielder, connected donor and affected people. Show harm persisting after the sword is dropped, then Nightblood choosing to stop (S18–S19). | Arbitrary universal power transfer; free infinite battery; every Surge unlocked; a guaranteed harmless operating mode |
| **Two kinds of oath** | Compare the Fifth Ideal and the later renewed Oathpact on separate tracks | Kaladin's self-protection Ideal comes first. He later replaces Jezrien; spren receive protection; the Honor spear is distinct from Syl (S18, S21, S32). | Treating the Fifth Ideal as the Herald oath; healing all trauma; immunity to every future danger |
| **Dawnshard encounters** | Select the Rysn meeting or the later transfer to Sigzil; inspect holder states | Hoid and Rysn both hold Dawnshards during their encounter. Later Hoid transfers his to Sigzil (S12, S24). | Turning the reported proximity risk into a numerical merger recipe; importing all later Sunlit abilities without the other book's gate |
| **Awakening and cross-world arts** | Inspect demonstrated objects/actions: animated cloth, Zahel's captivity, Galladon's sphere, Axindweth's speed | Separate observation from identification: animated cloth; restrictions on Zahel's resources; Galladon's use of a Stormlight sphere; Zahel's full-Feruchemist diagnosis (S02, S09–S11). | Treating an observed object as a fully decoded system; universal Investiture conversion; invented metal counts or metalmind charges |
| **Bonds and spren** | Compare Testament/Pattern, Szeth's former highspren, Vienta and Maya | Display separate entities, changing bond states and survival. A meeting is distinct from a newly sworn bond (S15, S17, S27–S28). | One generic live/dead toggle; calling Szeth's former spren explicitly named Auxiliary in the WaT scene; Vienta permanently dead |
| **Shard holders and Intent** | Step through historical Honor, Dalinar's brief holding and Taravangian's combined power | Separate Shard power, Vessel and derivative entity. Tanavast's account, Dalinar's decisions, Stormfather's destruction and Retribution's formation have different source times (S14, S16, S20). | Combining Honor/Odium as a user-defined arithmetic formula; treating all two-Shard combinations as Harmony; presenting missing Shards as dead |
| **Time and communication** | Play a qualitative example of a seon's buffered conversation; compare clocks | Rate varies. Display Kelsier's approximate estimate with attribution, and show why replies require buffering (S26, S29). Keep Herald mind-vision time separate (S32). | A supposedly canonical fixed ratio or curve; deriving exact dates of every other series from this book alone |
| **Realms and historical visions** | Distinguish the cistern trial, revisited memories, Shadesmar transit and hidden Kharbranth | An anchor/tether supports a controlled vision; a manufactured Spiritual setting can contain real people (S04, S15–S16, S28, S30). | Editable past; all vision occupants are illusions; interchangeable Physical/Cognitive/Spiritual locations; arbitrary physical coordinates for the dragon meditative realm |
| **Rysn's chair** | Explain paired gemstones and the narrated prototype concepts with a simple mechanism viewer | Inspect the proposed transfer of motion and the specific waves/gravity ideas in I-15 (S12). | Invented efficiency, force, range or perpetual-motion performance; an assertion all prototypes were commercially deployed |

The initial module and each follow-on should be independently reviewable. Optional later simulations may use clearly labeled illustrative values; they must never masquerade as canonical measurements.

## Data/interface requirements

Use the builder's accepted D08 schema and one visibility helper. Do not introduce a competing spoiler parser. The research ledger's SA07 must be mapped to the approved permanent work ID at integration time.

Each public claim/state needs:
- Stable ID; entity IDs; work and source-scene reference.
- Relation/condition: place, realm, era and required bond/source where known.
- Evidence category: demonstrated, character testimony, historical memory, estimate, inference or unresolved.
- Scope: the demonstrated scene rather than an unsupported universal rule.
- Reveal permission for the record, parent, label, alias, explanatory text, linked destination and animation.
- Distinct narrative time and publication/reveal ordering. Unknown values remain unknown.
- A concise limitation and an evidence drawer. No copied ebook pages or long quotations.

A newly selected later book does not silently mark earlier works read. If a WaT passage identifies a person, show the permitted WaT identity; suppress unrelated counterpart-book plot spoilers unless separately permitted. Conversely, an earlier-book reader must not see a WaT alias through a hidden edge's search text.

## Connection map integration

Add filters for **physical appearance, remote contact, reference, historical memory, identity/family, magic interaction and future intention**. Display requested actions separately from completed actions. Prefer a focused neighborhood around the selected person/object; 89 research nodes should not arrive as an unreadable global hairball.

Clicking an edge should open:
1. A one-sentence scoped claim.
2. How the evidence is presented.
3. The named source scene.
4. Its constraint or uncertainty.
5. A link to the appropriate magic module, if that module is visible in the current reading state.

“Confirmed in this book” and “earliest revealed in the series” are different statuses. The eight cross-work bridge-hold groups in the research JSON must retain that distinction. Do not auto-merge entities by matching a familiar word or by loading an ungated alias table.

## Acceptance checks for builder return

These are expected checks, **not test results**.

| ID | Scenario | Expected result |
|---|---|---|
| WM-01 | A reading state without WaT opens the atlas, search, graph and magic page | No late alias, fourth-moon reveal, holder update, Stormfall control label or protected snippet leaks. |
| WM-02 | WaT is selected alone in the per-work checklist | WaT-attested facts may show; unrelated plot details from another work remain restricted. Earlier works are not silently checked. |
| WM-03 | WaT is unchecked while a graph layout, search or animation is pending | Work is cancelled/rechecked before DOM/canvas output; selection falls back to a permitted neutral context. |
| WM-04 | Compare Kaladin events | Fifth Ideal precedes a separate Herald oath; Honor spear and Syl are distinct; no claim of universally cured Herald trauma. |
| WM-05 | Step through Retribution | Renunciation precedes Stormfather's destruction, which precedes absorption of Honor. |
| WM-06 | Select Dalinar and then Blackthorn | Distinct nodes and states; service edge belongs to the Blackthorn entity only. |
| WM-07 | Play the Nightblood climax sequence | Wielder/donor distinction is clear; ongoing harmful drain and voluntary stopping are retained. |
| WM-08 | Switch Stormfall location/subject | Oathgate failure and Towerlight, seon, Fused and Unoathed exceptions remain distinct. |
| WM-09 | Inspect Hoid's Scadrial entry | Regeneration is distinct from the later job; Design remains on Roshar; seeking Valor is a plan. |
| WM-10 | Inspect Narak | Prime/Two/Three/Four; Two corresponds to Oathgate; old links have an explicit migration; no duplicate Oathgate fortress. |
| WM-11 | Inspect time estimates | No fixed-ratio canon assertion. Kelsier's approximate forecast and the protected mind-vision context remain separate. |
| WM-12 | Follow an uncertain or incomplete bridge | The hold is visible; an unnamed healer, bird or spren is not automatically assigned a speculative identity. |
| WM-13 | Back/Forward or open an old deep link after narrowing | Only permitted state is restored; no protected first-frame flash. |
| WM-14 | Keyboard, touch and reduced-motion use at desktop/mobile sizes | Controls are labeled, reachable and usable; evidence is accessible without hover; animation is optional. |
| WM-15 | Verify actual-source graph data | Endpoints resolve; IDs are unique; every promoted relationship has sources and gates; no dangling links from Narak migrations. |

Return current commit, changed files, per-unit implementation/hold status, applicable repository checks, actual-source spoiler results and rendered evidence at 1440×900 and 390×844. Research-schema validation alone does not satisfy these checks.

## Completion boundary

This specification is ready for the existing builder lane. It does not certify a finished interface, numerical physical simulation, exhaustive Cosmere ruleset, complete novel audit or release approval.
