# Scadrial + Luthadel: narrow opening-text return

ChatGPT · 2026-11-10 UTC · run `chatgpt-20261110T191420Z-r19-85af`

**Finite implementation handoff, not completed parent research.** Apply the three text replacements and four field gates below; preserve both record-level unreviewed fallbacks. Of this two-record unit's **10 listed fields, 4 have narrow source-backed candidates and 6 remain held**. **0/2 whole parent records approved; 0/33 full-work audits approved.** Earlier e6/e12 mappings and CBR closures stand. Ordinary source-based web research was used, not the separate Deep Research product.

## Exact branches and reconciliation

Read actual `public/atlas/packs/cosmere.js` on all three PR heads:

| PR | Head commit | Pack blob |
|---|---|---|
| 48 | `773c35bcaeb727927c9ab6a462a52ab1e9d0e538` | `aebc2fb385bc6e2bfe453c610b48173f11d50916` |
| 24 | `cf25cda66e91c573c421a0f3712623db72737a3b` | `3ff0aab059fa54e00f6e2ccc7b849d4bd206d958` |
| 37 | `03394c32816fcb5c95261bf6a9ea4520381a5838` | `5a74e300eaf88b2d3c81fa9bc957584cd4708e33` |

The six Scadrial text/metadata fields `name`, `status`, `star`, `blurb`, `short`, `facts` and Luthadel `name`, `desc` match PR48 on both older branches: **16/16 cross-branch field comparisons**. This is not a claim that the complete world objects match. PR37 has Luthadel scene/landmarks absent from PR48. Do not import those objects, merge branches, overwrite their earlier corrections, or treat e7/e74 as aliases. Use additive changes on the current PR48 baseline and recheck its head before implementation.

## Four candidate fields

Sources and stable textual locators are listed below. Confidence describes the **narrow claim**, not the whole record or every edition.

| Target field | Disposition | Evidence / threshold |
|---|---|---|
| `scadrial.blurb` | Replace with the exact opening-setting copy below | P1 direct excerpt, high confidence; MB01 prologue. No universal constant ashfall or planet-wide vegetation/geography claim. |
| `scadrial.short` | Replace with the exact short copy below | P1 direct excerpt, high confidence; MB01 prologue. |
| `scadrial/luthadel.name` | Keep `Luthadel`; add only its field gate | P2 opening and P3 city description, high confidence; directly encountered in MB01. This is a supported book-level threshold, not a claim that chapter one is its first mention. |
| `scadrial/luthadel.desc` | Replace with the exact narrow city copy below | P3 opening city description and later explicit capital reference, high confidence; MB01 chapter two. |

Exact replacements (three strings; retain the existing Luthadel name):

```json
{
  "scadrial.blurb": "In the Final Empire, ash falls beneath a red sun. Skaa labor in the fields under the Lord Ruler’s rule, brown-leaved crops struggle to grow, and mists gather as evening falls.",
  "scadrial.short": "The Final Empire beneath a red sun.",
  "scadrial/luthadel.desc": "Luthadel is the walled capital of the Final Empire. The River Channerel runs through the city."
}
```

On Scadrial, add this expression separately at `gates.blurb` and `gates.short`. On Luthadel, add it separately at `gates.name` and `gates.desc`; preserve any other existing field gates:

```json
{"in":["mistborn-the-final-empire"],"req":"mistborn-the-final-empire"}
```

**Do not add or replace either record's `gate`.** No public marker, explicit trilogy record gate, new `needs`, changed `books`/`first`/`until`, parent promotion or new site/landmark is authorized. A field gate intersects its record and ancestors; it never supplies permission to bypass them. The proposed copy/gates therefore do not make either parent or e6 visible for MB01 alone. Existing whole-bucket fallback remains visibly unreviewed. Later era overrides retain their own restrictions; future parent promotion must reassess all exposures rather than treating these four fields as complete parent approval.

Removing clauses from these early descriptions does not declare them false. C1 supports the metal-named gate detail as commentary, but the inspected city image cannot establish an MB01 edition/earliest threshold. C2 supports the Well/capital relationship in later commentary; it is outside this direct opening-text packet. The broader old blurb's geography, chronology, magic and plot claims are not certified by the narrow replacement.

## Six listed field holds and additional exposures

| Scadrial field | Current disposition / next evidence |
|---|---|
| `name` | Hold its MB01 earliest threshold. Later commentary/art naming does not prove the novel's opening uses the planetary name. Do not invent a public label exception. |
| `status` | Hold the combined first-planet/Final-Empire label. A system-chart assertion needs a readable identified chart and its own source/work boundary. |
| `star` | Hold the whole object. P1 supports the observed red sun in the candidate prose, not this object's named label, exact color value or every era. |
| `facts` | Hold the bundled order/moon/Shards/three magic systems/ruler array. One early ruler mention does not discharge the later or structural claims. |
| `eras` | Hold the container and both later child records (6, 10) separately. No early override or era promotion. |
| `gfx` | Hold the procedural planet, map transforms, palette, labels and features as a whole. The source map is not proof of the implemented projection or coordinates. |

The ten-field denominator is the prior inventory's eight Scadrial fields plus two Luthadel fields; containers are not atomic facts. Additional explicit holds: `realms.cognitive` name/blurb/style, `distText`, world/group labels and projections, Luthadel `lat:70`/`lon:0` and `until:6`, PR37 scene architecture and six landmarks, later children, all other key-2 sites/events/codex entries. Retain prior schematic/inferred qualifiers and prior Venture/Assembly and other corrections. The Channerel passage is useful future evidence for PR37's river landmark; this packet does not import or newly map that landmark.

Relative to the original PR37 **148-field** ledger, the earlier e6/e12 four-field candidates plus these four give **8 narrow candidate fields and 140 remaining field holds**. Record accounting is unchanged: **2/65 narrow event candidates, 63/65 record holds**, including these two parents. PR48 still has only **2/7 key-2 events explicitly mapped**; there are no new event or whole-record mappings here. Keep the original ledger intact and read this packet as its scoped supplement.

## Sources opened this run

Nine cited source pages: **3 direct excerpts, 2 author annotations, 3 official art/provenance pages, 1 artist interview**. The three linked art images were inspected, with limitations below. Retrieved line numbers are convenience locators; titles and scene/section descriptions are the durable locators. No full novel or complete original-edition map sequence was read.

| ID | Source and locator | Supports / limits |
|---|---|---|
| P1 | [Author-hosted Mistborn prologue](https://www.brandonsanderson.com/blogs/blog/mistborn-prologue), Tresting's fields and Kelsier at evening; retrieved lines 124–138, 184–187 | Direct source for the limited setting observations used above. Does not establish constant worldwide ashfall or all plant life. |
| P2 | [Author-hosted chapter one](https://www.brandonsanderson.com/blogs/blog/mistborn-chapter-one), opening Vin city scene, lines 122–124 | Direct Luthadel name/setting support. |
| P3 | [Author-hosted chapter two](https://www.brandonsanderson.com/blogs/blog/mistborn-chapter-two), Kelsier on the wall, lines 120–130; capital reference at 227 | Direct capital, wall and river support. No Well-location or eight-gate inference needed. |
| C1 | [MB02 chapter 49 annotation](https://www.brandonsanderson.com/blogs/blog/annotation-mistborn-2-chapter-forty-nine), city-map discussion, line 122 | Author attributes the eight metal-named gates to Isaac's map work. Commentary provenance is clear; inspected material does not establish the exact earliest edition exposing that detail. |
| C2 | [MB03 chapter 76 annotation](https://www.brandonsanderson.com/blogs/blog/annotation-mistborn-3-chapter-seventy-six), “The North Pole,” lines 115–123 | Later commentary explains changed geography, the capital/Well relationship and distinct magnetic/geographic poles. The originally planned location described there was superseded: do not promote that discarded plan to canon. No exact atlas latitude certified. |
| M1 | [Isaac Stewart interview, From the Desk](https://fromthedesk.org/10-questions-isaac-stewart/), July 24, 2018; caption identifies his supplied Luthadel map | Inspected the [linked city image](https://i0.wp.com/fromthedesk.org/wp-content/uploads/2018/07/isaac-stewart-mistborn-luthadel.jpg), 300×227. Broad walled-city/river image only; fine labels and edition plate are inadequate for eight-gate, Well or coordinate verification. Interview is provenance evidence, not primary novel text. |
| M2 | [Dragonsteel tenth-anniversary announcement](https://www.brandonsanderson.com/blogs/blog/tenth-anniversary-leather-edition-of-mistborn-the-final-empire-other-goodies), paragraphs describing the new map and print set, lines 117–120 | Identifies a new Final Empire map in the anniversary leather edition and a matching poster; identifies the star-chart set with Arcanum Unbounded. Does not make revised artwork original-edition evidence. |
| M3 | [Official Final Empire poster](https://www.dragonsteelbooks.com/collections/art-prints/products/final-empire-map-poster), Isaac credit and product image | Inspected the [1040×1040 product image](https://www.dragonsteelbooks.com/cdn/shop/files/FinalEmpire_96cb67f2-01e9-48c0-b882-3ab2ae4aaacb.jpg?v=1685116002): plate reads Final Empire 1021, with Luthadel and the Channerel labeled. Regional placement supports an identified map reference, not numeric lat/lon, a global projection or exact city geometry. |
| M4 | [Official star-chart print set](https://www.dragonsteelbooks.com/collections/art-prints/products/star-chart-prints-set), Isaac credit and composite | Inspected the [1080×1080 composite](https://www.dragonsteelbooks.com/cdn/shop/files/StarCharts_SocialPost_V1.png?v=1699916588). Overlapping/cropped sheets are not a complete readable Scadrian chart audit; no new orbital or moon field is approved. |

Supplementary access failures were not evidence of absence: the Barnes & Noble Sanderson sampler PDF timed out; a guessed author map-annotation path and art-gallery path were unavailable; Coppermind's `File:Final_Empire_Map.jpg` returned 403. None supplied a verified claim. No inaccessible-source citation is substituted for a direct check.

## Validation, return and continuation

[Reviewer probe](parent-field-probe-773c35b.mjs) and [output](parent-field-output-773c35b.json): **68/68 source-level assertions**. Breakdown: 16 cross-branch comparisons, 2 checks that record gates are absent, 32 candidate-field visibility cases across eight trilogy subsets, 16 unchanged e6/e12 ancestor cases, 2 unreviewed-fallback checks. Uses actual extracted engine chain/field selectors and the actual helper; candidate gates exist **only in memory**. Four candidate fields and both events pass their chains only for the complete original-trilogy subset. This is expected fallback behavior, not certification that all inherited content is safe after MB03. No current app implementation or rendered result is claimed by this probe.

Claude: implement this finite text/field-gate return on PR48 after fresh reconciliation, then return `implementation-review/chatgpt` with exact head/diff, field/record counts, required project checks and targeted rendered evidence. Demonstrate that empty/MB01-only/MB03-only states still hide these parent-dependent surfaces; all-three original books show the narrow copy; a later bucket's `until`/era behavior remains unchanged. Preserve e6/e12 and unreviewed indicators. Do not claim completed parent gating or full key-2 coverage.

After review, resume one parent-surface unit: obtain a complete identifiable Scadrian system chart and resolve `name`/`status`/`star`/order/membership boundaries; then inspect nested cognitive/era/gfx exposures before any world promotion. If sources stay unavailable, record field-specific omission/qualified-model options and a bounded Known gaps disposition rather than silently promoting the world. Luthadel geometry/edition and later clauses remain separate. Only then continue dependent events/landmarks, remaining key 2, and key 12. No Mckay decision is needed for this narrow return. No merge, deploy or release approval.
