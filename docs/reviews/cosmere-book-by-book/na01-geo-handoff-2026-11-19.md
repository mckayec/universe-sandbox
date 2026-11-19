# NA01 — two site-description corrections and bounded disposition

Date: 2026-11-19. Reviewer: ChatGPT. **Claude: implement NA01-GEO-01 and NA01-GEO-02 on PR48 only.** These are conservative source-based narrowings, not findings that every removed detail is false. This is NA01's second persisted source unit; broader Warbreaker coverage is deferred with the explicit gaps below.

The [first checkpoint](na01-checkpoint-2026-11-19.md), saved at `1e4e6a4512ae381deb2f4a832c2d4a44406d2795`, supports six selected arrival/Court/palace claim groups. That completed unit was saved immediately. This handoff adds the remaining base-site/event inventory and two concrete corrections.

## Exact source revision

Re-fetched PR metadata after the first checkpoint; all three heads remained unchanged. Actual pack inputs were fetched through GitHub and independently hash-checked. File: `public/atlas/packs/cosmere.js`.

| PR / branch | Head | Pack blob |
| --- | --- | --- |
| 48 / feature/cosmere-reading-state | 52534d0975af39e620e05a43c2f4f05dc6b4b1fc | 0fd66c7cca0085872e8f8a3d2154e4010356b9e6 |
| 24 / fix/lore-corrections | cf25cda66e91c573c421a0f3712623db72737a3b | 3ff0aab059fa54e00f6e2ccc7b849d4bd206d958 |
| 37 / atlas/deep-worlds | 03394c32816fcb5c95261bf6a9ea4520381a5838 | 5a74e300eaf88b2d3c81fa9bc957584cd4708e33 |

[Probe](na01-inventory-probe.cjs) and [output](na01-inventory-2026-11-19.json): **3/3 input hashes match; 48/48 selected slots inventoried**, comprising ten base sites plus six event-ID slots on each branch. There are 44 present records and four absent slots (e77/e78 absent on PR24 and PR48). Scene landmark IDs are recorded separately; scene payloads are not silently approved by matching base descriptions.

Both target descriptions match on all three branches. PR37 has additional scene data and previously narrowed e13/e15/e16 plus e77/e78. Do not import those extra records or edit that separately owned branch. Preserve all accepted PR48 changes.

## Opened sources and evidence boundary

Research used ordinary source-based web search/open, not the separate Deep Research product.

| Source | Opened locator and use |
| --- | --- |
| [R1: author-hosted chapter 4](https://www.brandonsanderson.com/blogs/blog/warbreaker-chapter-four) | Siri's approach, passage through the gate and climb through southern T'Telir: capital identity, bay/crescent, painted buildings and warrior statues at corners. This directly supports GEO-01's replacement. |
| [R2: author-hosted chapter 28](https://www.brandonsanderson.com/blogs/blog/warbreaker-chapter-twenty-eight) | Vivenna turns into the D'Denir garden before meeting the forgers: a serene grassy field, hundreds of old/weathered warrior statues among city buildings. Supports GEO-02; this passage does not locate the garden in the city's north. |
| [R3: author-hosted chapter 32](https://www.brandonsanderson.com/blogs/blog/warbreaker-chapter-thirty-two) | Hoid's account of Kuth/Huth and the Manywar. A storyteller's qualified historical account does not validate the atlas's precise northern placement. No replacement requested for that record in this unit. |
| [R4: author-hosted epilogue](https://www.brandonsanderson.com/blogs/blog/warbreaker-epilogue) | Vasher/Vivenna discuss restoring Kuth/Huth; dialogue supplies a continuation lead, not exact map coordinates or a complete geopolitical audit. |

The author-linked **Tor first-edition PDF** and draft distinction are documented in checkpoint 1. The corresponding selected chapter-4 and chapter-28 passages were also opened there/in this run (printed pp.53–57 and p.299 respectively); no end-to-end edition collation is claimed. Repeated author text is not independent corroboration. No search-result absence is used as proof that a location/detail never appears in the book.

## Exact two-field change

### NA01-GEO-01 — Low, T'Telir description

Current `worlds[nalthis].sites[ttelir].desc`:

> Hallandren’s capital, built in a crescent around a sheltered bay on the Bright Sea, with markets, merchant mansions, slums and docks, and Awakened statues everywhere.

Replace with:

> Hallandren’s capital curves around a bay on the Bright Sea, with painted buildings and warrior statues at street corners.

R1 supports every retained clause. The old universal Awakening wording is broader than the inspected street scene. The replacement also avoids certifying an exhaustive district/building list or the bay's shelter from that scene. This does not claim the city lacks those features or that no statues are Awakened. Do not add ending revelations to explain the statues in this baseline description.

### NA01-GEO-02 — Low, D'Denir garden description

Current `worlds[nalthis].sites[denir].desc`:

> A quiet field of hundreds of old warrior statues in the north of the city.

Replace with:

> A quiet grassy field in T’Telir, filled with hundreds of weathered warrior statues.

R2 supports every retained clause. Remove the unsupported direction rather than substituting a guessed direction. No coordinate relocation or assertion that the northern placement is demonstrably false.

**2/2 replacement descriptions have direct passage support.** Change only these two `desc` fields. Preserve IDs, names, coordinates, book arrays, world/site associations, ordering, gates/fallbacks, parent-world payloads, registry, events, scene data and model-disclaimer behavior. Whole-parent and coordinate approval remain withheld.

## Prior-work reconciliation

Re-read [cosmere-supplement-crosswalk.csv](../deep-worlds/cosmere-supplement-crosswalk.csv), blob `9248b7ca93b3343b81a9033d2c1fce489641c8ca`.

- CS07 concerned PR37's market landmark, not the parent T'Telir description. Its already-narrowed landmark must stay intact. GEO-01 addresses the separate unchanged base description.
- CS17 documented the unsupported north-of-city phrase in the old statue landmark. PR37's current landmark narrowing does not remove the same claim from the base garden description. GEO-02 repairs that separate base field on PR48.
- CS11/CS18 retain checkpoint 1's supported, limited dispositions. Existing CB02/CB03/CB04 and CS23 event changes/decisions remain preserved; no duplicate claim that they are newly fixed.
- PR24/PR37 owners, their status/history, D09/D10 and release conditions remain unchanged. A descriptive edit does not satisfy PR37's scene-label/gate hold.

## Sixteen record-type dispositions

This table accounts for all ten base-site IDs and all six selected event IDs. It is a finite review disposition, not sixteen completed canon audits.

| Record | Disposition |
| --- | --- |
| ttelir | GEO-01 handoff; coordinates, whole site and scene remain held. |
| courtofgods | Checkpoint 1 prose support retained; full parent/scene/gate not certified. |
| denir | GEO-02 handoff; coordinates and complete scene remain held. |
| brightsea | Residual: complete relative-direction/name/geometry audit deferred. |
| edglipool | Residual: exact source/edition/reveal for perpendicularity, customs and flowers not established; no Warbreaker-first certification. |
| bevalis | Residual: complete site and modeled valley/placement audit deferred. |
| passes | Residual: count, trade/tolls, relative placement and geometry not fully checked. |
| pahnkahl | Residual: province/region boundaries and relative geography not fully checked. |
| tedradel | Residual: across-sea location, relations and timeline not fully checked. |
| kuth | R3/R4 read, but full spatial/historical statement remains held; no new placement. |
| e13 | Checkpoint 1 prose support retained; no new gate or full-record approval. |
| e14 | Residual: broad character arc/attachment not completely re-audited; preserve PR37's prior landmark removal. |
| e15 | Preserve accepted PR37 narrowing; PR24/48 broader text is not newly certified or changed here. |
| e16 | Preserve CS23's prior optional clarification and existing PR37 implementation; no new port requested. |
| e77 | Preserve accepted PR37 CB02; absent on PR24/48; no import. |
| e78 | Preserve accepted PR37 CB04; absent on PR24/48; no import. |

**16/16 record types dispositioned:** two corrections handed off, two checkpoint-1 limited retentions, twelve residual/prior-closure holds. Inventory coverage is not source verification. The global Nalthis atomic-claim denominator—including codex, system, realm, maps and all scene fields—is not yet established. **0/33 full-work audits approved.**

## Independent proposal check and required return

Ran the committed read-only probe on the pinned actual inputs. Both replacement strings differ from their parents (**2/2**). After substituting them in memory, reverting only those two description fields produces deep equality with the **entire parsed original PR48 pack**. No candidate application file was written. This is a scope check, not an implementation test. **0 rendered candidate cases** and no new repository-build pass claimed.

Claude: implement only GEO-01/02 on PR48, return exact head/parent, actual diff and per-finding disposition, then hand back for implementation-review. Verify two payload changes and unchanged metadata/gates against the actual parent. Render both descriptions in All and eligible legacy/per-work selections; check insufficient selections retain parent visibility. Include a parent-payload negative control and the normal required repository checks. Distinguish executed/passed, failed and unavailable validations; preserve the known Save/Load limitation unless independently resolved at the candidate head. No merge/deploy request.

## Known gaps and next work

The complete published PDF is accessible; **lack of access is not the reason this is incomplete**. This bounded pass did not read it end to end or finish all claims/journeys, parent cosmology, earliest-reveal mappings, coordinates, ending reconciliation, missing-content sweep or independent corroboration. Defer broader NA01 under the two-checkpoint cap while the two concrete fixes proceed.

After independent acceptance of the returned two-field change, continue **SA01 / The Way of Kings**, subject to fresh status priorities and reconciliation. Preserve MB08/MB09/MB10 deferrals and all prior accepted implementations. Unresolved content stays unverified; neither this handoff nor a later two-field implementation pass constitutes a full Warbreaker audit or Mckay release approval.
