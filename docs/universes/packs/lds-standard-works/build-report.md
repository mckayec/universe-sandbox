> **DRAFT, not handed off.** Written at build checkpoint 9; the stage is still `research-ready`, owned by Claude. Blocked on BV3 (see `research-review.md`, checkpoint 9). Do not audit until `status.md` says `built`.

# LDS standard works: build report (Claude)

- **PR:** #33 (`pack/lds-standard-works`), **commit `200ec6b8e5d8aec28fc1678de85a00cc9ce5677f`**. Audit this exact revision.
- **Research revision built from:** `52adadf1558b8bba1c89ca266de682ccdc988767` (handoff `689b495`), plus builder-compiled anchors in `anchors-proposal.csv`.
- **Pack file:** `public/atlas/packs/lds-standard-works.js`, registered in `public/atlas/packs/registry.js` and `src/universe-packs.ts`.
- **Builder review and checkpoint log:** `research-review.md` (RR01–RR09, build checkpoints 1–8).
- **Not merged.** Mckay's approval is still needed after both audits.

## What was built

**Navigation (RR02, pending Q02).** Five books (OT, NT, Book of Mormon, D&C, Pearl of Great Price) with `spoilers.mode: "single"`, so nothing is hidden by reading order, and five work layers (`ot`, `nt`, `bom`, `dc`, `pgp`) as the main filter. Every record keeps its work attribution. Start view: Earth (Track A).

**Earth sites: 36 pins**, each with the research's copy and a statement of what the point marks (heritage property, gazetteer point, city point, replica), never the exact spot of an episode. Seven are `major` (keep their labels when labels overlap): Jerusalem, Babylon, Rome, Kirtland Temple, Nauvoo, Palmyra, Salt Lake Temple.
- 10 research-supplied anchors `(C)`: P06–P08, AP06–AP08, AP16, AP17, AP25, RP05 (UNESCO, Pleiades, NPS).
- 13 builder-compiled restoration-era anchors `(L)`: P12–P16, RP01, RP03, RP07, RP09–RP13.
- 13 builder-compiled New Testament anchors `(L)`: AP12–AP15, AP18, AP19, AP21, AP22, AP27–AP29, AP32, AP33.
- All 26 builder-compiled anchors are listed with source URL and "what the point marks" in `anchors-proposal.csv`, are tagged `(L)` in the pack, and need ChatGPT's canon audit (see "For the auditor").

**Surface routes: 9** (RR04): J02 Luke childhood, Nazareth→Capernaum, return from Babylon, AJ03 first mission, AJ04 crossing toward Macedonia, AJ05 Paul's company to Rome, RJ01 Harmony→Whitmer home, RJ02 Nauvoo→Missouri River camps, RJ03 the 1847 journey. Legs are drawn only between consecutive placed stops; unplaced stops are listed, not drawn, and break the line. Caption: schematic sequence, not a recovered road.

**Chronicle: 24 events** at pinned places, using the research's wording. Ancient narratives carry no numeric year; only sourced modern dates have `when`.

**Codex: 3 lists.** The works (7 entries, C01–C07), Places without a map pin (14), Narratives without a map pin (6). Each entry starts with its work and is layer-gated.

**Layer-gated notes (RR03).** Place notes and codex entries take `layers`/`when`/`first` (PACK_FORMAT §20.5), so e.g. the Book of Mormon paragraph on Jerusalem only shows with the BoM layer on.

**Notice.** Research Q10 notice verbatim ("Independent educational atlas. Not an official publication of The Church of Jesus Christ of Latter-day Saints…"), standard back link to Gravity Lab. No Church art, maps or logos.

**Generic engine work in this PR** (benefits every Track A pack; PACK_FORMAT updated):
- Layer-gated notes and codex (§20.5); surface routes (§20.6).
- Built-in Earth from a Natural Earth 1:10m land-and-lakes mask, 8192×4096 desktop / 4096×2048 phone (RR09), rebuilt by `tools/build_earth_mask.py`.
- Label collision: overlapping site labels collapse to markers, selected and `major` sites keep labels (§11.4).
- Phone filter bar no longer collapses to zero width; breadcrumb and title text shadows.
- Panels `border-box` so they stop above the chronicle credits (BV1).
- Built-in Earth normal step capped at a 2048 bake's, removing dark coast/lake rims in 4096 bakes (BV2).

## Left out, and why

| Item | Why | What would bring it in |
|---|---|---|
| Book of Mormon pins | PLAN.md: no Earth coordinates for BoM places; geography models are never facts. | Nothing; by design. |
| Schematic BoM internal-geography view (RR05) | Design and canon question (Q03), asked of ChatGPT and Mckay; no answer yet. | A yes from Mckay plus ChatGPT's list of relations strong enough to place. Can be a follow-up PR. |
| `models` layer | No model content is drawn; geography models stay attributed text in the research. | Same decision as Q03. |
| 14 unpinned places in the codex (Haran, Shechem, camp between Bethel and Hai, Egypt, Horeb, Ur, Mount of Olives, Gethsemane, Golgotha, Waters of Mormon, temple in Bountiful, woods near the Smith home, Enoch's city, Jershon) | No cited or uncontested anchor, or BoM/PGP places with no Earth location. Listed in the codex "Places without a map pin". | An anchor from ChatGPT or an approved gazetteer point. |
| Unpinned route stops: AP20 Derbe, AP23 Samothracia, AP24 Neapolis, AP26 Melita, AP30 Appii Forum, AP31 Three Taverns | Derbe is contested; the others have no point in the research or the sources I opened. Shown as listed-not-drawn stops in their routes. | Same. |
| RP02 river reach, RP04 Liberty Jail, RP06 Salt Lake Valley, RP08 Missouri region | Regions the research says not to pin; Liberty Jail had only a weak aggregator coordinate. Not shown yet (RP06 appears as the unplaced last stop of RJ03). | A primary point for Liberty Jail; regions stay unpinned. |
| Dense contextual payloads (~1,000 allotment, genealogy, greeting records) (RR06, Q04) | Research context, not map objects; would swamp the atlas. | A later people/genealogy view. |
| Unanchored narratives (6) | Their place has no pin. Listed in the codex. | Anchors for their places. |

## For the auditor

- Open questions still unanswered (no `research-addendum.md` yet): Q01 anchors, Q02 single mode, Q03 schematic BoM view, Q04 dense payloads. I proceeded on my proposals; each is easy to change.
- Please audit every row of `anchors-proposal.csv`: the 26 builder-compiled anchors are `(L)`, mostly from Wikipedia infobox coordinates (NRHP/GNIS-derived), weaker than Pleiades/NPS/UNESCO. Replace any with a primary gazetteer point.
- Possible research discrepancy: RP10 says Mount Pisgah is "near present Murray, Iowa"; the sources I opened put the site near Thayer, Union County.
- AP15 Paphos is pinned at Nea Paphos per the research's Palaepaphos caution; please confirm.

## Checks at `200ec6b`

- `pnpm format` / `pnpm check`: 73/73 tests, build and check:dist OK (113 files, no third-party loads).
- Atlas validator: `lds-standard-works.js` — 1 world, 36 sites, 24 events, no issues, no warnings.
- `pnpm test:pages`: 12 pages × 2 viewports pass. `pnpm test:browser`: pass. (Both with `CHROME_PATH` set to the installed Chromium.)
- Playwright (SwiftShader: `--use-gl=swiftshader --enable-webgl --ignore-gpu-blocklist`): 3840×2160 finished 4096 bake after 41 min, no console errors or failed requests. 1440/1280/390 still to capture after BV3.

## Screenshots (`shots/`)

- `b9-4k-finished-bake-1920.jpg`: 3840×2160 finished bake, downscaled.
- `b9-4k-coast-fringe-crop.jpg`: 1000×600 full-resolution crop (eastern Mediterranean) showing BV3.

Earlier checkpoint shots (`rr09-*`, `b4-*` … `b8-*`) remain in `shots/` for history.

## Known limits

- In this 2-core SwiftShader container the full 4096 surface bake takes 25–40 minutes; on real GPUs it takes a second or two. Phones bake at 2048, low-memory devices at 1024.
- Shore pixels where the fine mask says land but the baked map says sea use the pack's land colour, which can read as a thin fringe on desert coasts at globe zoom (cosmetic, noted at checkpoint 3).
