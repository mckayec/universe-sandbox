# Fixing round 5 — D02-C1 (missing Antioch card)

2026-11-06 · Claude · PR #39, branch `pack/abrahamic-world-religions`, head **`a97eb0dd566584e9b2ec3fec1a43d6320cf20271`** (parent `d95eaf28e50f6fe005e99b4b3e289d8b906b1fc3`).

## Change (2 files)

| Path | Change |
|---|---|
| `public/atlas/packs/abrahamic-world-religions.js` | New place card `chp-antioch` in the Christianity block of `PLACES` (between `chp-azusa` and `chp-fayette`); assembler comment updated ("held as an unpinned reference card (chp-antioch, D02) because no event names it"). No site, coordinate, event, journey or link added. |
| `tests/atlas-abrahamic.test.ts` | `chp-antioch` added to the stays-a-card list; new test `D02-C1: Antioch is a visible nonspatial Christianity card…`. |

No other pack-data part changed; the four data parts (judaism/christianity/islam/encounters) are byte-identical to d95eaf2.

## Text → source mapping

| Card field | Text | Source |
|---|---|---|
| id | `chp-antioch` | new stable ID, `chp-` Christianity place prefix |
| name | Antioch on the Orontes (Antakya) | Feature name in accepted package: `q01-anchor-dispositions.csv` row Antioch at bc7efce ("Antioch on the Orontes / Antakya"), [ToposText 362362PAnt](https://topostext.org/place/362362PAnt) |
| role | Ancient city · reference card · Christianity · no map point | type from the same package; layer = Christianity because Q01 (research-review.md R2/Q01) requested Antioch as a Christianity anchor; "no map point" per D02 |
| desc | The ancient city of Antioch on the Orontes, at modern Antakya. A gazetteer reference exists (ToposText place 362362PAnt), but no event in this atlas is tied to the city, so it has no map point. | identity + locator from the package; the no-event statement is a factual description of the build (verified by the new test) |
| notSame | Pisidian Antioch, a different ancient city. The ancient regional label Syria is not a modern border. | caveats of the same CSV row ("Not Pisidian Antioch… Ancient region Syria label is not modern sovereignty") |
| gate | `first: 1` (Overview, the pack's only book) | same as every other place card |

Deliberately not added: coordinates/marker, any historical narrative (church founding, patriarchate, "Christians" naming, councils), events, routes — none is in the accepted research or package. The sending-church caveat in the CSV is honoured by making no such claim.

## Evidence

- `pnpm format && pnpm check`: **124/124** unit tests pass (was 123; +1 new test), build passes.
- `pnpm test:pages`: 13 pages × 2 viewports pass (Abrahamic desktop + mobile included).
- Negative control: the new tests run against the d95eaf2 pack file → 2/2 targeted tests fail (stays-a-card list and D02-C1), as intended.
- Rendered: 390×844 codex "Places without a map point" tab shows the card in full, 0 console/page errors, no horizontal overflow — `shots/r5-a97eb0d-390x844-antioch.jpg`. The codex is the same DOM at every size; desktop SwiftShader load timed out on this runner (known slow 4096 bake, see fixing-round4.md) — desktop page-matrix case passes.

## D02 accounting at a97eb0d

Antioch, Fayette/Whitmer (`chp-fayette`), Karbala (`ISP05`), Azusa Street (`chp-azusa`), Seesen (`jud-seesen`): **5/5 unpinned cards present**. Najaf mapped feature deferred. Markers unchanged at 25 (10 heritage + 15 Q01). Codex places +1 card; inventory 313 → 314 records.
