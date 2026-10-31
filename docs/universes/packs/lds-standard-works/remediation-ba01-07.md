# LDS build remediation: BA01–BA07, round 1 (Claude)

2026-10-31. **Implementation head for recheck: PR #33, branch `pack/lds-standard-works`, commit `5a9711eb2676e0b421fb093211fc0be97ae2b368`** (parent `fca2ddfbc94525c022c3cb09e957a1431078eb4f` = BA01–06; its parent `c59c9bc`, the audited head). Not merged. Read against PR34 `docs/lds-anchor-review-20261027` at `5044468` (content-audit.md, audit-build.md, anchor-dispositions.csv, the four ba07-*-spec.md files and their crosswalk CSVs).

## Receipt (BA04)

Received PR34's 26-anchor audit (A01–A05, BA01–BA04), the 96/256 content audit (BA05–BA07), supplementary accounting, and the BA07 specifications (tranche 1 PGP/front matter 21, tranche 2 Restoration 12, tranche 3 Book of Mormon 20, Bible AE/AC 9). Q01–Q04 have answers on PR34; Q03's schematic was owner-authorized on 2026-10-27, so no further preference request is pending. The older wording in build-report.md / research-review.md on the PR branch ("Q01–Q04 unanswered", "Q03 awaits Mckay") is superseded by this file. Main's `status.md` is ChatGPT-owned and was not changed.

A01–A05 dispositions: A01a/b (11 replacements) → BA02 applied; A01c/d (Lystra, South Pass holds) → BA01 applied; 13 conditional retains → BA03 applied; A02–A05 → no further pack change beyond the items below (Murray→Thayer was already correct in the build).

## Resolutions

| ID | Resolution | Evidence |
|---|---|---|
| BA01 | `lystra` and `south-pass` sites removed. Both Lystra occurrences in `paul-first-mission` and South Pass in `valley-migration` are named unplaced stops with notes; no BLM or other substitute coordinate. Iconium→Lystra, Lystra→Iconium, Chimney Rock→South Pass, South Pass→Fort Bridger legs are gone, and no bridge (e.g. Chimney Rock→Fort Bridger) replaces them. Sources credit line updated. | `tests/lds-pack.test.ts` "BA01" using actual `AtlasLayers.routeLegs` |
| BA02 | All 11 `replace-representative` rows applied: exact recommended lat/lon, ToposText attribution in the record comment (original point kept there as metadata), register `anchor_copy` as the visible "Today" line with "Coordinate: ToposText gazetteer point (representative)". New ToposText credit in `meta.sources`. Displayed coordinates are not shown by the engine, so no rounding change. | test "BA02/BA03" asserts all 11 pairs |
| BA03 | All 13 `conditional-retain-L` rows carry the register `anchor_copy` plus "Coordinate: secondary source (approximate)" in the visible "Today" line; comment records coordinate and identity URLs. RP01 renamed "Harmony / Priesthood Restoration Site"; its visible copy says the point does not locate the baptism or a specific house. | same test; 4K screenshot shows the renamed pin row |
| BA04 | This file; implementation crosswalk below. | — |
| BA05 | Mixed-source codex entries split into one entry per source, each with only its own layer and work badge: Haran (OT/PGP), Ur (OT/PGP), Mount of Olives (OT/NT/PGP), Enoch's city (D&C 38:4 / Moses 7, using the audit's wording), First Vision account (D&C introduction / PGP). Woods → `pgp` only. Shechem, Bethel/Hai camp, Egypt → `ot` only (no Abraham-source text added). E12 stays explicitly comparative. | test "BA05" covers all nine isolated-layer cases, all-on retention, and the Jerusalem note control |
| BA06 | `when` removed from the persistent Fayette reference point; the 1829 event/route and 1830 event keep their own dates. At range 1829 site, `translation-fayette` and `dictation-move` all pass `timeOk`. BA03's Fayette qualification applies separately. | test "BA06" |
| BA07 (partial) | All 62 specified source views implemented as attributed nonspatial codex entries, one work layer each, `books` per the spec gate, no numeric `when`, no new sites/coordinates/routes/events. Copy is the spec's `minimal_neutral_copy` with only spacing normalized (e.g. "in1830" → "in 1830") and FM05 listing the eight names the spec requires. Each entry shows a visible "Source:" line with https links (new generic engine field `src`, escaped, https-only; PACK_FORMAT §13). Tabs: PE/AE → "Narratives without a map pin"; BC → new "Book of Mormon records and teachings"; FM/PC/AC → new "Front matter, facsimiles and notes"; RE/RC → new "Restoration documents and teachings". Full mapping: [ba07-implementation-crosswalk.csv](ba07-implementation-crosswalk.csv). | test "BA07" asserts 62/62 resolve, one layer, no `when`, https sources, gate behaviour (own layer at own group; hidden via every other layer; locked one group earlier; shown with all works), FM01–07=3/bom, FM08=4/dc, FM09=5/pgp, PE06/PC04/FM03/RC05 content assertions, single Palmyra |

## Still open (not claimed)

- **BA07 remainder:** the 149 unrepresented / 11 partial rows of the 256-row accounting beyond these 62 views, the 11 textual journey specifications handed off at `7f4afa2`, and the supplementary 62-category crosswalk still need dispositions. Next run continues there.
- **FM01 / Palmyra site gate:** the codex card is added; the Palmyra pin's own book gate and the RE04 D&C publication-history separation are **not** changed yet.
- **Rendered layer-selection evidence** for BA05 in the browser (only pure-helper tests so far).

## Validation at `5a9711e`

- `pnpm format`, `pnpm check`: 93/93 tests pass (6 new LDS regression tests), build and check:dist OK.
- `pnpm test:pages` (12 pages × desktop/mobile, swiftshader): pass.
- `pnpm test:browser`: passed once at `fca2ddf`; three later runs (at `fca2ddf` and `5a9711e`) time out at `tests/browser-smoke.mjs:88` (main-sandbox Save/Load count) — the same failure on the unchanged parent, in a part of the site these commits don't touch, so recorded as an environment flake, not a pass.
- Playwright (swiftshader) at 3840×2160, 1440×900, 1280×800, 390×844: atlas loads with no page errors; new codex tabs render with source links. Found and fixed a codex layout bug: a tab taller than the viewport pushed the dialog off-screen (fully off-screen at 390×844). Now centered (panel top 80 px at 1440×900, 75 px at 390×844).
- Real-GPU finished-surface evidence: not available in this environment.
