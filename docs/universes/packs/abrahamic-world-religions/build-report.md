# Religious Traditions: Origins and Connections — build report (Claude)

- **PR:** #39, branch `pack/abrahamic-world-religions`, commit **`9cefeac89bfd23c4a7dde0e6589151608a3c6f2e`** (audit this exact SHA). Not merged.
- **Research built from:** revision `f7b74e7bec5b75a9e83666e6fd873f1f21630d0f` with the corrections in the four `*-record-audit.md` files. No `research-addendum.md` exists yet.
- **Builder review and per-checkpoint notes:** `research-review.md` (R1–R7, engine E1–E5, Q01–Q07, build checkpoints 1–7).

## What was built

| Area | Built |
|---|---|
| Pack | `public/atlas/packs/abrahamic-world-religions.js` plus data parts `abrahamic-world-religions/{judaism,christianity,islam,encounters}.js`, registered (with `parts`) in `public/atlas/packs/registry.js` and in `src/universe-packs.ts`. Title, description and notice from `research.md` §1 verbatim (Q06 open); independent-atlas notice in the credits; back link to Gravity Lab. One overview gate; layers Judaism / Christianity / Islam / Encounters (filters, stated not to be population categories). |
| Map | Earth, opening at Jerusalem, with **10 pins only**: the eight `gaz-*` heritage markers at the CSV decimals plus Jerusalem (one city record with separate Christianity and Islam notes) and Babylon. Each heritage marker says it is a reference point, not the place of an event. |
| Places without a map point | 59 reference cards (codex tab and a section in Earth's details), ids from `identity-and-edges.csv`; no coordinates. Place non-merges shown as "Not the same as" text. |
| Family tree | 109 nodes, 27 typed links: Judaism 29, Christianity 39, Islam 34, Encounters 7. Dates in the sources' own words; century/period windows where the research gives one (Q02 conversions), `undated` otherwise, years only where a source gives one. Mergers drawn from every predecessor. Opens in the *By relationship* outline. |
| Chronicle | 60 events (Judaism 17, Christianity 22, Islam 15, Encounters 6), each with the source's date wording; numeric years only drive the year filter. Events open a pin (Jerusalem, Babylon) or a reference card, or say why there is no place. |
| Codex | Journeys and spread (12, ordered text, never drawn routes), People (24), Encounters (4: XC01–XC04), Population estimates (2020, published 2025) (method card + XD01–XD07; never summed or mapped). |
| Engine (generic) | Tree: emergence windows, undated nodes, typed relation families, mergers, *By relationship* outline, "Not the same as" notes (PACK_FORMAT §21.1). Reference-only places and events that open codex cards (§13.1); event/site `whenText` (§20.2); registry `parts` (§1.1). Checkpoint 7 polish: tree dialog bounded to the screen (on a 390 px phone it ran ~5,600 px tall and its lower part was unreachable; desktop dialogs no longer sit low), `#tree=<id>` deep links scroll to the node, outline reads in pack order with siblings grouped by kind, "Open the map · no single map point for this entry" for nodes without a site, filter bar fits between the side panels up to 1600 px, long titles two lines on phones; PR #38's layer-bar wrap and dossier height fixes ported as identical lines. |
| Tests | `tests/atlas-abrahamic.test.ts` (pins = gazetteer; every crosswalk identity built or named; per-tradition counts, forbidden parentage absent, merger predecessors, no invented years, SAJ location withheld, Deoband discrepancy kept, Ahmadi two-field identity, events without coordinates); `tests/atlas-tree-rel.test.ts` (typed relations, outline, outline order). |

## Left out, and why

- **More map pins** (Mecca, Medina, Karbala, Nicaea, Antioch, Alexandria, Zurich, Fayette, Azusa Street, Xi'an, Baghdad, Acre …). Q01 has no answer; without source-cited coordinates these stay reference cards, so Islam appears on the map only at Jerusalem, Historic Cairo, Ksar Ghardaïa and Stone Town.
- **Tradition ties for Sikh and Bahá'í nodes** (Q04): the crosswalk edges for them point to places and a region, not traditions, so none is drawn.
- **Date bars for legal schools and Sufi orders** (Q05): no dates supplied; undated.
- **Population map shading or totals** (R7): deliberately not built.
- **`jud-e15`** (R5/Q07): not in the research; nothing built.
- **Person nodes in the tree**: Dara Shikoh's comparison (AI293/AI294) is one labelled contact tie between Hindu philosophy and Sufism.

## Items for ChatGPT's build audit

Builder readings flagged in `research-review.md` §6, to confirm or correct:
1. Evangelical drawn as `overlap` with Anglican, Lutheran, Reformed, Baptist and Methodist ("crossing Protestant and Anglican institutions"); Anabaptists not included (checkpoint 4).
2. Ahmadiyya under Islam as "self-identifies-with (the Community's own description)" plus a separate attributed note on Pakistan's 1974 classification (USCIRF 2026) (checkpoint 5).
3. Sufism as an `overlap` from Islam, not `within` (checkpoint 5).
4. ISL05–08 (Ja'fari, Zaydi, Ibadi, Zahiri schools) under Islam "named in the Amman Message (no further classification given)" rather than under Shia/Ibadi (checkpoint 5).
5. AI293/AI294 Dara Shikoh as one contact tie (checkpoint 6); no Sikh/Bahá'í ties (checkpoint 6).
6. Century conversions per Q02 (e.g. "early 1600s" → 1601–1630, "early 1900s" → 1901–1930) and Rabbinic Judaism "Early centuries CE onward" left undated.
7. Bahá'í Faith: the self-description note repeats the blurb word for word (seen in `1280x800-tree-bahai.png`); harmless, but say if one should change.

## Checks at `9cefeac`

- `pnpm format`; `pnpm check` (format check, build, 115/115 tests, check:dist: 118 files, no third-party loads).
- `pnpm test:pages`: 12 pages × 2 viewports (CHROME_PATH = sandbox Chromium 1243).
- `pnpm test:browser`: not run; it times out at its simulator step in this sandbox identically on unmodified main (checkpoint 1). CI runs it on the PR.
- Chromium (swiftshader) at 3840×2160, 1920×1080, 1440×900, 1280×800, 390×844 (Earth, tree deep links, open Chronicle event, codex population tab): no console or page errors, no horizontal page scroll; all looked at. Screenshots were taken on the polish code; the last commit before `9cefeac` only added a test and a PACK_FORMAT paragraph.

## Screenshots (`shots/`, PNG, all under 500 KB)

| File | What it shows |
|---|---|
| `3840x2160-earth.png` | 4K Earth view with the details panel (surface bake still running under software GL) |
| `3840x2160-tree-crop-1to1.png` | 1:1 crop of the 4K tree dialog (zoomed 1.5× at 4K), Nizari Ismailis picked; Encounters roots last |
| `1920x1080-chronicle-jud-e06.png` | Ananites and Karaites open; filter bar clear of the details panel |
| `1440x900-earth.png` | Earth start view |
| `1440x900-tree-nizari.png` | relationship outline: Islam's traditions, then legal schools, then movements; "Open the map" note |
| `1440x900-chronicle-jud-e06.png` | open entry no longer runs under the year filter (1400→1600 px rule) |
| `1280x800-tree-bahai.png` | Encounters nodes and contact ties; Bahá'í Faith details |
| `1280x800-chronicle-jud-e06.png` | layer bar wrapped to two rows |
| `390x844-earth.png` | phone; title on two lines |
| `390x844-tree-zaydi.png` | phone deep link `#tree=ist07` scrolled to Zaydi Shi'ism inside a screen-high dialog |
| `390x844-codex-population.png` | phone codex, population estimates tab with the method card |

## Known limits

- **Earth texture at 4K is soft** in these shots: the "Charting surface" bake had not finished under software GL (and pin labels were not yet placed in the 4K capture). PR #33's improved Earth bake should help once merged; worth a look on real hardware before release.
- UI text at 3840×2160 is drawn at 1× CSS size on the map view (engine-wide behaviour); the tree dialog is zoomed 1.5× at 4K.
- On phones, map labels can show behind the header's transparent area; the title and controls stay readable.
- In the *By date* view undated nodes are drawn at their parent with open rings and dotted lines; the header counts them and the pack opens in *By relationship*.
- Engine CSS lines shared with PR #38 are identical, so whichever merges second has no conflicting change there.
