# LDS build remediation, round 2 (Claude)

2026-10-31. PR #33, branch `pack/lds-standard-works`, implementation head **`dcc793c6036f9dc26ec4286d8c132c272638fd40`**
(parent `5a9711e`, the round-1 head ChatGPT rechecked in `remediation-review-r1.md`). Not merged.

Specification sources read on PR #34 at `3729dbb33a98705fe8117a2aa53d9d058b870d9d` (not merged): `remediation-review-r1.md`,
the ten `ba07-*-spec.md` tranches and their `ba07-spec/*-content-crosswalk.csv`, `supplementary-dispositions.md`.

## Resolutions

| Item | Resolution at `dcc793c` |
|---|---|
| R1-C1 Salamis | `worlds[0].sites[id=salamis].desc` is now exactly “Representative city-site point for Salamis/Konstantia on Cyprus from the ToposText gazetteer. No synagogue is located.” Coordinate (35.179951, 33.903053) and `modern` line unchanged. The Pleiades point survives only in the provenance comment. |
| Palmyra BoM gate (BA07 / FM01) | Site `palmyra` is now `books:[BOM, DC]`, `layers:['bom','dc']`, so the neutral city/publication-setting pin (year 1830, “Palmyra hosted publication of the Book of Mormon. The marker is the village’s reference point, not the print shop.”) is visible from book 3 under the BoM layer. RE04’s month-specific printing history remains the D&C event `book-mormon-publication` (book 4, `dc`), hidden under BoM-only (screenshot: the BoM-only chronicle shows only “Lehi at Jerusalem”). |
| BA07 remaining primary views | All **107** remaining specified research IDs imported as **108** keyed codex cards (AP09 = two cards). Per-ID rows appended to [ba07-implementation-crosswalk.csv](ba07-implementation-crosswalk.csv) (170 keyed cards total with round 1). See below. |
| Browser-smoke Save/Load timeout | Cause found: the Gododdin exhibit keeps removing bodies after the save snapshot, so `#count` read after clicking Save was already lower than the saved count (saved 29, read 25) and the test waited forever for a mismatched number after Load. Load itself restores correctly. The test now compares against the count the save toast reports. Passed twice in a row. Test-only change; no app change. |

### Import details

* **Copy:** each card’s `desc` is the crosswalk’s `minimal_neutral_copy` / `minimal_attributed_copy` verbatim; card titles are the crosswalk’s proposed/accepted titles. The PGP-remainder crosswalk supplies slug labels only, so those 18 cards use short descriptive titles (e.g. “Mahujah”, “Land of Cainan”, “Hill near Manchester”). **ChatGPT: please check those 18 titles.**
* **Gates:** one work per card (`books`/`layers` from the crosswalk); no `when`, no coordinates, no routes. BP/BE/BJ are BoM only (group 3); AP01–05, AJ01, J01 OT; AP20–31, AP34 NT; RE/RP D&C (group 4); PP/PE/PJ/PC and J03 PGP (group 5).
* **AP09:** key `AP09` carries only the OT boundary / Bible Dictionary copy at 1/ot; key `AP09.NT` carries “Matthew places the call of fishermen beside this sea.” at 2/nt. They are never on one OR-layer card.
* **RE02/05/06/07/13:** the spec’s `display_date` is shown as text beside the layer chip via a new codex field `date` (PACK_FORMAT §20.5). It never feeds the year filter.
* **Placement:** BP01–30, BE01–23, BJ01–11 are in a new codex tab, “Book of Mormon places, events and journeys”, in inventory order. Bible, PGP and Restoration place views go under “Places without a map pin”, and episodes and journeys under “Narratives without a map pin”.
* **Sources:** each card links its crosswalk URLs. Link text uses the crosswalk’s verse locator where one was given and matches the URL’s chapter; otherwise it uses book and chapter (e.g. “Moses 7”). Non-scripture links are named for their institution (Joseph Smith Papers, NPS, Missouri State Archives, Church history site).
* **Consolidation:** none beyond AP09. Every ID is its own card, which the specs allow. Shared identities (e.g. PP07/PE09 with FM06; BP and BE) are separate source views, not merged objects.
* **UI fix found during rendered checks:** the new tab name overflowed the dialog at 390 px. Codex tab labels now wrap.

## Validation at `dcc793c`

* `pnpm format` + `pnpm check`: formatting, build, **96/96** unit tests (including 9 LDS tests: R1-C1, the Palmyra gate, and all 108 new cards checked for layer isolation, earlier-book hiding, https sources, no `when`/coordinates, the AP09 split and the RE date text), check:dist 114 files OK.
* `pnpm test:pages`: 13 pages × 2 viewports (the LDS atlas is now included).
* `pnpm test:browser` (Chromium 1243 via `CHROME_PATH`): passed twice.
* Rendered checks (Chromium, SwiftShader WebGL) at 3840×2160, 1440×900, 1280×800 and 390×844 (DPR 3). There were no page errors and no horizontal overflow. The BoM tab shows 64 cards with 84 source links at every size. With only the D&C layer on, the narratives tab shows the five RE dates as text, and 28 other cards are counted as hidden by the filter. Palmyra is listed under BoM only, and Salamis shows the new copy. Shots: [Palmyra BoM 4K](shots/r2-palmyra-bom-4k.jpg), [Salamis 4K crop](shots/r2-salamis-4k-crop.jpg), [BoM tab 1440](shots/r2-codex-bom-1440.jpg), [BoM tab 1280](shots/r2-codex-bom-1280.jpg), [D&C dates 390](shots/r2-codex-dc-dates-390.jpg), [tab wrap 390](shots/r2-codex-tabs-wrap-390.jpg). Every shot except the tab-wrap one was taken just before the one-line CSS wrap fix. The wrap shot and the overflow probe (0 tabs past the dialog edge at 390 px) were taken after it.
* Not done: a real-GPU check (APB-style finished-surface evidence) is still unavailable in this environment, and keyboard-only navigation of the codex was not re-exercised.

## Still open (Claude)

1. **Supplementary dispositions (SC01–SC54, 1,271 SD rows):** none is implemented at this head. Each row needs a target card, facet or retained reference section, with per-row mapping and its own gate (supplementary-dispositions.md “Precise implementation contract”). The rows come in about 49 different table layouts, and many mix display copy with builder constraints. Planned approach: generate per-category cards from the accepted quoted copy and its source links, keep constraint text out of the visible copy, and record per-SD-row targets in a new `supplementary-implementation.csv`. This will be a separate commit on PR #33 after ChatGPT’s recheck of this head, so the head under review stays fixed.
2. Real-GPU rendered evidence, and Claude’s final same-head technical sign-off once content is approved.

No merge, deploy or release approval is claimed. Mckay’s release approval and the same-head dual audits remain separate gates.
