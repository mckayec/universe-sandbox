# R-B: key-2 record/field dispositions and parent holds

ChatGPT · 2026-11-10 UTC · run `chatgpt-20261110T172038Z-r17-8c641a`

**Bounded checkpoint, not complete canon certification.** All **65/65 records and 148/148 listed field units** in the requested PR37 inventory now have explicit dispositions: **2/14 event copy/gate candidates (4 fields)** and **63/65 record holds (144 fields)**. One event candidate is newly supported by an author-hosted excerpt; one renews the existing narrow author-commentary finding. No world, site, landmark or codex unit is promoted by this packet. **0/33 full-work audits approved.**

[Machine-readable dispositions](key2-dispositions-2026-11-10.json) are research instructions, not an application file to paste wholesale. [R-A bibliography](bibliography-handoff-2026-11-10.md) is the immediately usable registry unit. Source research used ordinary web access, not the separate Deep Research product.

## Exact source / denominator

Read actual `public/atlas/packs/cosmere.js` at PR37 **03394c32816fcb5c95261bf6a9ea4520381a5838**, blob **5a74e300eaf88b2d3c81fa9bc957584cd4708e33**. Read Claude’s inventory/probe and independently enumerated the actual pack object; **5/5 surface ID+field-list comparisons agree** with [the saved inventory](key2-inventory-03394c3.json).

| Surface | Records inspected for disposition | Listed field units | Narrow candidates | Held fields |
|---|---:|---:|---:|---:|
| Worlds | 2/2 | 15/15 | 0 | 15 |
| Sites | 17/17 | 34/34 | 0 | 34 |
| Landmarks | 23/23 | 46/46 | 0 | 46 |
| Events | 14/14 | 28/28 | 4 fields in 2 events | 24 |
| Codex | 9/9 | 25/25 | 0 | 25 |
| Total | 65/65 | 148/148 | 4 | 144 |

“Inspected for disposition” means read the actual fields and assigned a source-backed candidate or an explicit source gap. It does **not** mean that 65 records were independently canon-verified. A holder such as `facts`, `gfx`, `eras` or `more` is one inventory field, not one atomic claim. Child units and geometry add exposure beyond this denominator.

Reconfirmed open PR heads: PR24 **cf25cda66e91c573c421a0f3712623db72737a3b**, PR37 as above, draft PR48 **f74622957d0a889001598b3a4ad874181da75763**. PR48/main pack blob **0ca2f3eedf23bd6b453240c3e047e8c50671e5d2** is the older baseline; PR24 pack **3ff0aab059fa54e00f6e2ccc7b849d4bd206d958** differs. Preserve [the reconciliation decision](key2-inventory-return-f746229.md): additive mapping on the actual current pack, no PR24/PR37 wholesale import or merge here.

## Hold semantics and parent-first rule

A **hold** authorizes no earlier `req`/extra `needs` conclusion. Retain the existing unreviewed whole-bucket fallback and prior accepted copy corrections. It is not a positive finding that the current text is correct or safe after any particular book. No public marker or explicit all-three-books gate should be invented: `compileGate` marks explicit expressions reviewed, whereas `recordGate` fallback remains unreviewed.

Keep every ancestor restriction. In particular:
- `scadrial` stays unreviewed; `luthadel` stays unreviewed. e6’s MB01 candidate therefore does not independently make the event visible with only MB01 selected.
- e12’s MB03 candidate still intersects `scadrial` fallback. Reading MB03 alone does not discharge the parent’s requirement for MB01–03.
- An event’s `in` lists descriptive work membership; it grants no permission by itself. No new `needs` claim is supported for these two narrow sentences; their exact `req` plus existing ancestor restrictions is the candidate.
- If the builder chooses to remove an unsupported mixed field, name the omission and its source hold in the return. Do not silently broaden a parent or portray an omission as verification.
- A group without gates is currently a public container. This packet does not approve turning any additional ancestor public. Configuration-label restrictions and earlier CBR closures stand.

## Parent worlds: 2 records, 15 explicit field holds

Both record-level dispositions are **hold**. The table addresses each listed field rather than pretending that a single familiar setting sentence verifies an entire world.

| Field | Disposition | Reason / next evidence |
|---|---|---|
| `scadsun.name` | Hold | Proper system label lacks an MB01–03 locator. |
| `scadsun.status` | Hold | System classification lacks edition/source locator. |
| `scadsun.star` | Hold | Name/color not audited as trilogy evidence. |
| `scadsun.blurb` | Hold | Mixed red-sun observation, orbital changes/Harmony and system-chart assertions. |
| `scadsun.short` | Hold | Yellow-star classification not independently established. |
| `scadsun.facts` | Hold | Aagal Nod, Aagal Uch and two dwarf planets need system-chart/AU evidence. |
| `scadsun.gfx` | Hold | Artistic/model parameters not an exact visual-source audit. |
| `scadrial.name` | Hold | Do not infer an MB01 first appearance of the planet name from later bibliography. |
| `scadrial.status` | Hold | Orbital rank and Final Empire identity require separate locators. |
| `scadrial.star` | Hold | Display name/color not separately audited. |
| `scadrial.blurb` | Hold | Opening setting, pole/desert geography and plot premise form a mixed field. |
| `scadrial.short` | Hold | No whole-world promotion while sibling fields remain mixed. |
| `scadrial.eras` | Hold | Contains later keys 6 and 10; preserve child fallback, no MB01–03 override. |
| `scadrial.facts` | Hold | Order/no moon, two named Shards and three arts need per-claim checks. |
| `scadrial.gfx` | Hold | MAPSCAD1 geometry/regions/texture and features not certified by the opened chapter. |

The finite next research unit is **Scadrial’s base world + Luthadel**: obtain direct MB01 setting passages and the identified geography/map source, split mixed late facts or omit them explicitly, then review the parent chain. Until that is done, do not grant an early parent gate merely to surface e6.

## Sites: 17 record holds, 34 field holds

For each row, the record and each named field are held. Coordinates, `until` behavior and scene geometry are not certified by this text disposition.

| Site | Fields held individually | Reason / next evidence |
|---|---|---|
| `scadrial/luthadel` | `name`, `desc` | Hold — Capital/walls/eight metal-named gates/river/Well location bundle needs separate checks. |
| `scadrial/kredikshaw` | `name`, `desc` | Hold — Palace/spire epithet/Vin’s final confrontation need separate locators. |
| `scadrial/well` | `name`, `desc` | Hold — Pool/perpendicularity/Rashek relocation mixes reveal levels. |
| `scadrial/fellise` | `name`, `desc` | Hold — Town/travel time/mansion details unverified here. |
| `scadrial/hathsin` | `name`, `desc` | Hold — Prison/mines/Snapping/Ruin’s pool mixes claims and reveal levels. |
| `scadrial/homeland` | `name`, `desc` | Hold — Cavern placement/hidden atium require text and map separation. |
| `scadrial/arguois` | `name`, `desc` | Hold — Cave geography/army training lacks a locator. |
| `scadrial/tyrian` | `name`, `desc` | Hold — Lake/ashmount placement needs identified map or direct location text. |
| `scadrial/urteau` | `name`, `desc` | Hold — Capital/house seat/canals/rebel control needs per-claim sources. |
| `scadrial/tremredare` | `name`, `desc` | Hold — Former capital/luxury-market description unverified here. |
| `scadrial/fadrex` | `name`, `desc` | Hold — Rock geography/cache/siege needs primary locators. |
| `scadrial/statlin` | `name`, `desc` | Hold — Eastern/mining/cache description unverified here. |
| `scadrial/conventical` | `name`, `desc` | Hold — Steel/crater/orientation requires text/map separation. |
| `scadrial/vetitan` | `name`, `desc` | Hold — Southern farming/mining/cache location unverified here. |
| `scadrial/lekal` | `name`, `desc` | Hold — Capital/river/lava ending includes late spoilers without locators here. |
| `scadrial/tathingdwen` | `name`, `desc` | Hold — Terris/Synod/geography/koloss fate needs separate locators. |
| `scadrial/islands` | `name`, `desc` | Hold — Sea-relative geography unverified from consulted narrative. |

## Landmarks: 23 record holds, 46 field holds

IDs are scoped by site: the two `cache` landmarks are different records. All rows retain the world → site → landmark restrictions.

| Site/landmark | Fields held individually | Reason / next evidence |
|---|---|---|
| `luthadel/fountain` | `name`, `desc` | Hold — Fountains/executions/exact death location/renaming need separate text checks. |
| `luthadel/venture` | `name`, `desc` | Hold — MB02 palace use not newly verified; preserve existing correction. |
| `luthadel/hasting` | `name`, `desc` | Hold — Sparring location and Cett dinner need chapter locators. |
| `luthadel/assembly` | `name`, `desc` | Hold — Venue and deposition attribution need MB02 evidence. |
| `luthadel/walls` | `name`, `desc` | Hold — Structure and Elend/Straff scene need primary locator. |
| `luthadel/channerel` | `name`, `desc` | Hold — River identity/location needs text or identified map. |
| `kredikshaw/spires` | `name`, `desc` | Hold — Architecture and late Preservation/Inquisitor/destruction scene are mixed. |
| `kredikshaw/throne` | `name`, `desc` | Hold — Capture/interrogation/window/death need scene verification. |
| `kredikshaw/murals` | `name`, `desc` | Hold — Exact mural contents and arrangement require passage inspection. |
| `well/pool` | `name`, `desc` | Hold — Pool/cavern/door/release bundle not verified here. |
| `fellise/renoux` | `name`, `desc` | Hold — Rented mansion/front/training does not establish Luthadel ball location. |
| `hathsin/pits` | `name`, `desc` | Hold — Prison geology/survival/wife’s fate/Elend’s ending cannot share an assumed early gate. |
| `hathsin/refuge` | `name`, `desc` | Hold — Refuge and universal no-mist-sickness claim need direct evidence. |
| `homeland/trustwarren` | `name`, `desc` | Hold — Chamber/court/trial/platform-atium bundle needs text. |
| `homeland/prison` | `name`, `desc` | Hold — Sentence and escape need direct locator. |
| `arguois/caves` | `name`, `desc` | Hold — Army hiding/training needs direct locator. |
| `urteau/canals` | `name`, `desc` | Hold — Drainage/diversion/lake/cache need primary scene evidence. |
| `urteau/cache` | `name`, `desc` | Hold — Location/discovery attribution unverified here. |
| `urteau/burnings` | `name`, `desc` | Hold — Execution method and escape-route claim need direct locator. |
| `fadrex/rocks` | `name`, `desc` | Hold — Fortifications/siege/exact half-koloss loss need separate checks. |
| `fadrex/orielle` | `name`, `desc` | Hold — Ball/ultimatum/refusal details unverified here. |
| `fadrex/cache` | `name`, `desc` | Hold — Storage identification and motivation unverified here. |
| `conventical/plate` | `name`, `desc` | Hold — Massacre/Marsh/Sazed/rubbing/Kwaan need direct locator. |

## Events: 2 narrow candidates, 12 explicit holds

| Event | Fields | Disposition |
|---|---|---|
| `e6` | `title`, `text` | Narrow candidate below; all ancestors remain restrictive. |
| `e68` | `title`, `text` | Hold — Training and Luthadel balls/Elend meeting span locations; Fellise/Renoux is not verified for every clause. |
| `e69` | `title`, `text` | Hold — Fight/execution location/killing/causal legend sentence not text-checked here. |
| `e8` | `title`, `text` | Hold — Weakness/death/palace scene not verified by e6 excerpt. |
| `e9` | `title`, `text` | Hold — Army approach and Elend scene need MB02 locator. |
| `e70` | `title`, `text` | Hold — Deposition remains primary-text hold; preserve existing narrowed copy. |
| `e71` | `title`, `text` | Hold — Battle/death list/control/attack sequence needs multiple locators. |
| `e10` | `title`, `text` | Hold — Well release and deceiver need MB02 scene evidence. |
| `e72` | `title`, `text` | Hold — Trial/contract/sentence/First Generation/escape needs multiple locators. |
| `e73` | `title`, `text` | Hold — Pewter/Citizen/executions/city/cache outcome needs direct evidence. |
| `e11` | `title`, `text` | Hold — Cache motive/siege participants/timing need direct source. |
| `e74` | `title`, `text` | Hold — Exact Pits location/death/atium motivation not established by e12 annotation. |
| `e75` | `title`, `text` | Hold — Power/Inquisitors/palace destruction/Ruin sequence needs MB03 locators. |
| `e12` | `title`, `text` | Narrow candidate below; all ancestors remain restrictive. |

### e6 — new direct-excerpt support, parent still held

[B01: author-hosted Mistborn Chapter Three](https://www.brandonsanderson.com/blogs/blog/mistborn-chapter-three), opened 2026-11-10. The chapter places Vin’s crew in Luthadel, introduces Kelsier’s encounter with her and identifies her as Mistborn after testing her abilities. Locators: Luthadel context (retrieved lines 161–162), entrance/identification (192–243), final explanation (502–504). This is a targeted excerpt check, not a full reading of MB01.

Exact candidate:
```json
{
  "title": "Kelsier meets Vin",
  "text": "In Luthadel, Kelsier meets Vin and recognizes her as Mistborn."
}
```
Record `gate`:
```json
{
  "in": [
    "mistborn-the-final-empire"
  ],
  "req": "mistborn-the-final-empire"
}
```
Applies only to this title/text and existing `world: scadrial`, `site: luthadel` references. No landmark is added. Separate title/text field gates need not repeat the same expression if they inherit this record gate. If other field copy is added later, reassess it.

### e12 — renewed commentary support, narrow before gating

[B02: author’s annotation to The Hero of Ages chapter 82](https://www.brandonsanderson.com/blogs/blog/annotation-mistborn-3-chapter-eighty-two), opened 2026-11-10. The “Sazed Ascendant” discussion supports Sazed ascending and remaking the world. This is **author commentary**, not independently read chapter text. It renews the prior checkpoint’s narrow disposition; it does not newly certify every existing clause about both Shards, ash or mists.

Exact candidate:
```json
{
  "title": "The Hero of Ages",
  "text": "Sazed ascends and remakes the world."
}
```
Record `gate`:
```json
{
  "in": [
    "mistborn-the-hero-of-ages"
  ],
  "req": "mistborn-the-hero-of-ages"
}
```
Do not apply this gate to the broader current text without first making the explicit narrow-copy correction. Keep its world parent; do not assign a new site/landmark.

### e7 / e74 branch identity decision

**Neither is newly mapped here.** e7 (“The survivor of Hathsin”) exists on main/PR24, not the PR37 denominator. It stays an explicit additional hold on that baseline. e74 is the distinct PR37 Elend-ending event and remains held as listed. Never treat them as aliases, substitute one for the other or import e74 into PR48 just to match this inventory. Recount the final pack on implementation return.

## Codex: 9 record holds, 25 field holds

Each field named below is held, even where a related fact occurs in e6/e12. A narrow event check does not certify an entire character/shard entry.

| Entry | Fields held individually | Reason / next evidence |
|---|---|---|
| `shards/Preservation` | `name`, `desc` | Hold — Mists’ creator/stability descriptor not certified by narrow e12 annotation. |
| `shards/Ruin` | `name`, `desc` | Hold — Entropy/Well imprisonment/deception bundle needs direct source. |
| `shards/Harmony` | `name`, `desc` | Hold — Combined Shards/second-era label exceeds narrow e12 evidence. |
| `people/Kelsier` | `name`, `role`, `desc`, `more` | Hold — Crew outcome/Survivor label not fully covered by e6; later more lines separate. |
| `people/Vin` | `name`, `role`, `desc` | Hold — Chapter establishes Mistborn, not most powerful Allomancer of her age. |
| `people/Sazed` | `name`, `role`, `desc`, `more` | Hold — Every religion is an unsupported universal here; later Harmony line separate. |
| `people/Elend Venture` | `name`, `role`, `desc` | Hold — Noble/king/meeting/post-Lord-Ruler agenda needs earliest-threshold checks. |
| `people/Spook` | `name`, `role`, `desc` | Hold — Kinship/age/crew/tin ability needs direct text. |
| `ideas/The metal arts` | `name`, `desc` | Hold — Three systems/Hemalurgy explanation needs per-system reveal locators. |

Later child lines are separate holds: Kelsier `more[0]` bucket 7 (Secret History), Kelsier `more[1]` bucket 12 (Ghostbloods), Sazed `more[0]` bucket 6 (Harmony). Preserve their later numeric fallback; do not let a base-entry or e12 gate erase it.

## Additional exposure outside the inventory’s denominator

- Actual `scadrial.realms.cognitive` has a name, blurb and visual/style data. The probe’s zero top-level key-2 realms is **not** a review of this nested object. It remains explicitly unreviewed; reconcile its renderer and source/gate boundary in a later parent-surface unit.
- `scadrial.eras[6]` and `[10]` are later child records. No era content is authorized as an MB01–03 replacement by the base-world table.
- Map geometry, labels, `distText`, scene architecture, landmark positions/heights and diagram transforms are not made canonical by this 148-field accounting. Preserve existing schematic/inferred labels; exact map-edition verification remains pending.

## Builder return and continuation

Implement **R-A now** as the bounded real-registry/control return, preserving unknown-year and edition qualifications. The two R-B candidate gates may be added only with exact copy and unchanged restrictive ancestors on the reconciled baseline; leaving them pending for a parent-first unit is also valid and must be reported precisely. All other rows remain on unreviewed fallback. Do not claim 65/65 researched gates, a complete key-2 audit, or earliest-spoiler certification.

Return exact head and actual diffs, count mapped vs held units, test both strict-prefix and missing-ancestor cases, and supply new real-registry rendered evidence. The reviewer’s independent checks here are source inventory comparisons and data/helper checks, **0 browser executions / 0 fresh app builds**. Claude’s earlier reports remain attributed; they are not new independent results.

After the implementation return is reviewed, resume research with the **two-record Scadrial + Luthadel parent unit**, then their dependent events/landmarks, then the next held key-2 units. Keep key 12 behind that bounded sequence and preserve earlier SA07 user-ebook findings without claiming a full-book read. Bibliographic year holds from R-A remain open. No Mckay action is requested by this checkpoint, and no merge, deploy or release approval is granted.
