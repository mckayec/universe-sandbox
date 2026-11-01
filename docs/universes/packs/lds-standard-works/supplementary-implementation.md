# Supplementary implementation (SC01–SC54): builder mapping

Builder: Claude. Input: ChatGPT's accepted register `supplementary-dispositions/declaration-dispositions.csv` on PR34
(`9cc874c09a3686119ca6b4c17c7e16f214fd7ab6`, unchanged since `3729dbb`), 1,271 SD rows in 62 categories.
Per-row mapping: [supplementary-implementation.csv](supplementary-implementation.csv) (every SD row, `imported` or `pending`).
Generator: [supplementary-build/build.py](supplementary-build/build.py) with display copy in `supplementary-build/copy_*.py`.
Re-run: `python3 docs/universes/packs/lds-standard-works/supplementary-build/build.py <declaration-dispositions.csv>`.

This is being built in bounded checkpoints, one family per run. SD ids are audit handles, not engine ids or a
count of new entities.

## Progress

| Families | SD rows | State | Target |
|---|---|---|---|
| SC01–SC07 Book of Mormon | 111 (+7 prose bullets) | **imported, checkpoint 1** | codex tab `bom-more` |
| SC08–SC12 New Testament | 187 | **imported, checkpoint 3** | codex tab `nt-more` |
| SC13–SC17 Old Testament history (Genesis–2 Kings) | 177 | **imported, checkpoint 4** | codex tab `ot-more` |
| S3/S4 review fixes | 13 parent rows corrected; 25 child source views | **checkpoint 5** (S3-C1 partial) | `nt-more`, `ot-more` |
| SC18–SC34 Old Testament (Chronicles–Malachi) | 315 | pending | next runs, same tab |
| SC35–SC45 D&C | 417 | pending | |
| SC46–SC49 Pearl of Great Price | 40 | pending | |
| SC50–SC51 front matter | 9 | pending (consolidate with FM01–09) | |
| SC52–SC54 geography models | 11 | pending | |
| SC55–SC62 dense payloads | 0 table rows | display deferral A04/Q04/RR06 unchanged | |

## Checkpoint 1: SC01–SC07 (Book of Mormon)

* **One card per SD row** in the new codex tab "More Book of Mormon places, journeys and people", keyed by the row's
  research id (BXP01–74, BXJ01–17, BXE01–08, BXR01–06, BXC01–06). Every card is `books:[3]`, `layers:['bom']` (gate
  `3/bom`); no coordinates, routes, years or pins.
* **Prose-only material kept**: SC04's six people/relationship bullets (coverage-bom.md:402–410) are cards
  `SC04.1`–`SC04.6`; SC02's closing note on the narrow pass near Desolation is `SC02.1`.
* **Copy**: the accepted row text, lightly edited into reader sentences. Builder instructions in a row are applied,
  and where they tell a reader something they are kept as a plain distinction (e.g. "distinct from the river in
  Lehi’s dream", "not the biblical region of Judaea", "a text genealogy, not a dated, complete pedigree").
  Instructions that only govern drawing ("do not animate all four inside Laban’s house", "do not draw a route to
  New York") are honoured by drawing nothing and stated as what the text does and does not give.
* **Sources**: every link in the row, as `src`. "Official chapter, N" links are given their book and chapter from the
  link itself (e.g. `Alma 2:36–38`). BXP52 (Shim) also cites Ether 9:3, which the row names in text.
* **Identity rules applied**: Irreantum is created here as the single sea identity (SC53 will reuse it); homonym
  places keep a qualifier in the name (Gid (city), Jordan (city), Lemuel (city), Midian (Book of Mormon), Jerusalem
  (Book of Mormon city), Onidah (Alma 47) vs Hill Onidah (Alma 32), Aaron (Alma 8) vs existing Aaron (Alma 50)).
  Cards that extend existing ones say so by name instead of duplicating them: BXJ05 → "Alma’s ministry: selected
  stops", BXJ13 → "Early retreat in Mormon’s account", BXJ16/BXE07 → "Final Jaredite gathering", BXE03 → "Cities
  destroyed"/"Healing the multitude", BXE04 → "Zarahemla rebuilt", BXE05 → "Early northern retreat"/"Gathering at
  Cumorah", BXC01 → "Bread and wine among the multitude"/"Church and gospel".
* **Genealogy tensions kept**: two Jonas, ambiguous son clause (BXR01); two Amos generations and Mormon’s father
  (BXR02); Ether’s descendant/son and Shiblon/Shiblom wording (BXR04); Cohor as both brother and son of Noah
  (BXR05); Amoron ≠ Ammaron (BXR06).

Builder readings for ChatGPT to check: BXP12 drops "the king’s" (row says only "flocks"); BXP35 names the tower
"Nephi’s garden tower" from the row’s slug and heading; BXP62/BXJ14 word the "later Nephite destruction place" as a
place the route passes, per Ether 9:3; BXE05 "does not place Mormon’s death in the scene where he survives wounded"
restates the row’s constraint for readers.

### Checks at this checkpoint

`pnpm format:check`, build, 97/97 unit tests (new test: all 111 SC01–07 rows map to a `bom-more` card with sources
and only the BoM layer; the 1,271-row CSV is complete; the primary 170-key count is unchanged), `check:dist`,
validator clean, `pnpm test:pages` 13 pages × 2 viewports pass. Playwright (SwiftShader) opened the codex tab at
3840×2160, 1440×900, 1280×800 and 390×844: no console errors, focus stays in the dialog on Tab, Escape closes it.
Screenshots `shots/s1-codex-*`.

Observed limit (engine, not content): on a 390 px phone the eight codex tab buttons take about half of the dialog
before the list. Adding the remaining families as more tabs would make that worse; next checkpoint will either fold
them into existing tabs or switch the tab row to a compact chooser on narrow screens.

## Checkpoint 2 (2026-11-01) — supplementary-review-s1 corrections and phone codex navigation

Applies ChatGPT's [supplementary-review-s1](https://github.com/mckayec/universe-sandbox/blob/e0840462c961181713a8c3fdb03a526ecff66e16/docs/universes/packs/lds-standard-works/supplementary-review-s1.md) at its parent fe24d33. No new SD rows yet (still 111 imported + 7 prose; 1,160 pending).

| Item | Resolution |
|---|---|
| S1-C1 (BXJ12 / SD0086) | Edited in `supplementary-build/copy_bom.py` and regenerated, using the review's minimum replacement verbatim: the region “includes the land of Zarahemla and the land between Zarahemla and Bountiful, extending to the line between Bountiful and Desolation”. Sources, gate (`books:[3]`, `layers:['bom']`) and nonspatial form unchanged; mapping CSV display row unchanged apart from regeneration (only BXJ12's pack line and no CSV locator changed for it). |
| SC04.4 sources | Added `Mosiah 17:1–3` (`bofm/mosiah/17`) between Mosiah 7:9 and Mosiah 27:8; copy unchanged. The CSV prose row's locators now list it. |
| Mobile tab growth | Engine (`public/atlas/engine.js`, `engine.css`): at ≤600 px the codex tab buttons are replaced by one full-width section chooser (`<select id="cxPick">`, 44 px tall, ellipsis for long titles); wider screens keep the tab buttons unchanged. The chooser is in the dialog's Tab cycle; choosing a section re-renders the list and scrolls it to the top. Applies to every atlas with a codex. |

Regeneration was first confirmed byte-identical at fe24d33 with the same PR34 input (`docs/lds-anchor-review-20261027:…/supplementary-dispositions/declaration-dispositions.csv`), then re-run with the two copy edits; the diff is exactly the BXJ12 and SC04.4 pack lines plus the SC04.4 CSV row.

Checks: `pnpm format`, `pnpm check` (97/97, check:dist 114 files OK), `pnpm test:pages` 13 pages × 2 viewports. Playwright (SwiftShader) at 390×844 touch: chooser shown, tab row hidden, the list starts 105 px below the dialog top (was about half the dialog), all 8 sections offered, selecting “More Book of Mormon…” shows River Laman first and keeps the tab state in sync, Tab stays inside the dialog, Escape closes and returns focus to the Codex button, no console errors. At 1440×900 the tab buttons show as before. Screenshots `shots/s2-codex-390x844.png`, `shots/s2-codex-1440x900.png`. Reverse-Tab order, VoiceOver and real devices are not tested.

Next: SC08 onward, using the chooser instead of adding more stacked tabs.

## Checkpoint 3 (2026-11-01): SC08–SC12 (New Testament)

* **One card per SD row** (187) in a new codex tab “More New Testament places, journeys and people” (`nt-more`), keyed
  by the row's research id (`NTP-…` 73, `NTJ-…` 26, `NTE-…` 27, `NTC-…` 33, `NTR-…` 28). Every card is `books:[2]`,
  `layers:['nt']` (gate `2/nt`); no coordinates, routes, years or pins. On phones the tab is reached through the
  checkpoint 2 section chooser.
* **Generator**: `build.py` now builds several families (`FAMILIES` maps family to tab, gate and copy module); copy is in
  `supplementary-build/copy_nt.py`. NT link text (`matt 4:12–23`) becomes the book name and reference
  (`Matthew 4:12–23`); the generator asserts the link text's book matches its URL. Regeneration leaves the BoM block
  byte-identical, and a second run produces no diff.
* **Copy**: the row's quoted summary is the first sentence; the row's constraint is kept where it tells a reader
  something (distinct identities, unresolved identifications, separate Gospel accounts, intended-not-reached, passing
  not landing). Drawing-only constraints (“no road geometry”, “do not animate all troops”) are honoured by drawing nothing.
  Pin codes in rows are written as the existing record's name (P08 → Jerusalem, AP09 → Sea of Galilee, AP12 → Antioch,
  AP22 → Troas, AP25 → Philippi, AP26 → Melita, AJ04 → “Crossing toward Macedonia”, AJ05 → “Paul’s company to Rome”,
  C02 → “Resurrection testimony”, AE09/AE10, AE13, E03/E04, J02).
* **Sources**: every link in the row, plus, in `EXTRA_SRC`, passages the row names in its text without a link when the
  card names them too (e.g. SD0127 Luke 8:26 and Matthew 8:28; SD0213 Luke 4:1–13; SD0244 3 Nephi 15; SD0247 D&C 76).
  Where the row names only a chapter, the extra source is cited at chapter level; no verse numbers were added from
  memory.
* **Identity rules applied**: Joppa (Acts) is the OT Joppa identity gated to its Acts view (SD0144); Caesarea (Acts) ≠
  Caesarea Philippi; Sychar ≠ Shechem; Magdala ≠ Dalmanutha; Gennesaret (land) ≠ lake alias; Ephraim (John 11) ≠ tribal
  territory; three men named Ananias; Silas ≠ Silvanus without evidence; Nathanael ≠ Bartholomew and Levi ≠ Matthew not
  assumed; Lazarus of Bethany ≠ Luke 16; Philip of the seven ≠ apostle.

Builder readings for ChatGPT to check:

1. SD0115 “distinct from beyond-Jordan variant place traditions” is worded “kept distinct from traditions of a place
   by the same name beyond Jordan”.
2. SD0116 adds “near the Mount of Olives” from the row's P20 relation (Matthew 21:1 is the cited verse).
3. SD0144 states the deduplication for readers (“the same Joppa as in the Old Testament, gated here to its Acts
   account”) instead of a key reference.
4. SD0186 names Nazareth as Mary's starting point from the row's `P06→…→home`.
5. SD0191 renders “unnamed earlier baptizing place” as “to where John first baptized” (John 10:40 wording); please
   confirm this does not over-identify the place.
6. SD0206's AJ05 timing details (Syracuse, Rhegium, Puteoli) are already carried by “Paul’s company to Rome”; the card
   links to it rather than repeating them.
7. SD0214 names “the country Matthew calls the Gergesenes” for the row's NTP-gadarene-country plus source label.
8. SD0270 lists the fifteen nonspatial vision scenes in one card, not fifteen child cards; the row says “distinct
   nonspatial children”. If separate cards are required, they can be split in the generator without new research.
9. SD0226 and SD0236 likewise name their Acts 4–6 and Acts 22–26 children in the card text rather than as separate
   cards.

### Checks at this checkpoint

`pnpm format`, `pnpm check` (98/98, including a new test: all 187 SC08–12 rows map to an `nt-more` card with sources,
NT gate only, no coordinates or years, hidden under every other single layer and before the NT group; the primary
170-key count is unchanged), `check:dist` 114 files OK, validator clean, `pnpm test:pages` 13 pages × 2 viewports.
Playwright (SwiftShader) opened the new tab at 3840×2160, 1440×900, 1280×800 and 390×844 (phone via the section
chooser): 187 cards, no console or page errors, Escape closes and returns focus to the Codex button. Screenshots
`shots/s3-codex-nt-*`.

Observed (engine, not content): at 1440×900 the desktop tab buttons now wrap to four rows above the list. Still
usable; if the Old Testament and D&C families add tabs, desktop may also need the section chooser or grouped tabs.

Next: SC13–SC34 (Old Testament, 487 rows), likely over two runs.

## Checkpoint 4 (2026-11-01): SC13–SC17 (Old Testament history, Genesis–2 Kings)

Correction to the progress table: the Old Testament families SC13–SC34 hold 492 SD rows, not 487 (SC22 has none).

* **One card per SD row** (177) in a new codex tab “More Old Testament places, journeys and people” (`ot-more`):
  SC13 integration rows `OH-C01`, `OH-P01`, `OH-E01`, `OH-R01`, `OH-P02`; SC14 places (76); SC15 people (51);
  SC16 journeys (27); SC17 concepts (18; corrected from 19 per supplementary-review-s4). Every card is `books:[1]`, `layers:['ot']` (gate `1/ot`); no coordinates,
  routes, years or pins. Rows whose research id is a primary-record code (P18, AP01–AP07, AJ01, AE03) get an `OTS-`
  key prefix so they never collide with that primary card, and the card says which existing card it adds to.
* **Sources**: SC13 rows carry links. SC14–SC17 rows cite chapter-ledger ids (`OH-G11`, `OH-K1-03`, `OH-S2-15–20` …)
  and no links; per the rows' `source_resolution`, the generator resolves each id through the ledger rows of
  `coverage-ot-history.md` (`| OH-G11 / [Genesis 11](…) |`), so these cards cite **chapters**, and a ledger range
  becomes one source (“Exodus 2–40”, linked to its first chapter). `EXTRA_SRC` adds only chapters a row names in its
  text without a ledger id and the card names too (SD0393 Exodus 2, SD0394 Numbers 12, SD0395 Numbers 10, SD0443
  Deuteronomy 10, SD0471 Deuteronomy 25). No verse numbers were added from memory; SD0303’s “Zion narrative in
  Moses” is named in the card without a source because the row gives no chapter.
* **Copy**: the quoted summary first, then the row’s constraint where it tells a reader something (distinct
  identities, unresolved identifications, separate accounts, who does and does not travel). Drawing-only
  constraints are honoured by drawing nothing.
* **Generator**: `copy_ot.py`; `build.py` gained the OT family, the ledger resolver, OT link labels (“2:1–3” on a
  Genesis 2 link becomes “Genesis 2:1–3”) and a guard against an extra source duplicating a resolved one. BoM and NT
  blocks regenerate byte-identical; a second run produces no diff.

Builder readings for ChatGPT to check:

1. SC14 cards that reuse a primary record (`OTS-P18-ur` … `OTS-AP07-babylon`) are separate cards naming the existing
   card, not edits to it; the primary 170 cards are unchanged.
2. SD0311 says Ibzan’s Bethlehem is one “the text does not place” for the row’s “unspecified Ibzan Bethlehem”.
3. SD0348 cites Judges 18, Joshua 19 and 1 Kings 12 from the row’s OH-J18, OH-Q19 and OH-K1-12.
4. SD0354 words the Baale-Judah point as “treating the two names as one place would need separate support”.
5. SD0360 says Gospel accounts on Olivet “are gated to the New Testament” for “later gospel claims remain
   separately gated”.
6. SD0404 renders “no … literal brother-levirate claim” as “not literally a brother-in-law under the levirate law”.
7. SD0412 renders “do not invent consent or erase David’s power” as reader copy; please confirm the tone.
8. SD0441 renders “Zipporah/family participation scoped” as “how far Zipporah and the family travel with him is
   read from the text”.
9. SD0454 keeps the row’s “Habor-Gozan” form rather than expanding it.

### Checks at this checkpoint

`pnpm format`, `pnpm check` (99/99, including a new test: all 177 SC13–17 rows map to an `ot-more` card with
official-scripture sources, OT gate only, no coordinates or years, hidden under every other single layer and shown
at the OT group; the primary 170-key count is unchanged), `check:dist` 114 files OK, `pnpm format:check` clean,
`pnpm test:pages` 13 pages × 2 viewports.

Not done this checkpoint: Playwright screenshots of the new tab. Under SwiftShader in this run the LDS page (which
opens on the Earth surface) did not report ready within about 11 minutes at 1440×900, so no `s4-` shots were taken
and the tab has not yet been looked at rendered. The data-level checks above pass; next run captures the tab at
3840×2160, 1440×900, 1280×800 and 390×844 before continuing with SC18.

## Checkpoint 5 (2026-11-01): supplementary-review-s3 and -s4 corrections, OT tab rendered

Applied ChatGPT's finite fixes from supplementary-review-s3.md (at `d321689`) and supplementary-review-s4.md (at
`f571cb9`) in `copy_nt.py` / `copy_ot.py` and regenerated; no other card changed. New: **child source views**
(`CHILDREN` in the copy modules). `build.py` places each child card right after its parent in the same tab and gate,
and writes it to the mapping as a row with empty `disposition_id`, `source_location` `child of SDnnnn`,
`research_declaration` = the parent's card key. Mapping now 1,303 rows: 1,271 SD rows (475 imported, 796 pending,
unchanged), 7 prose rows, 25 child rows. Card totals: `nt-more` 187 + 24 = 211, `ot-more` 177 + 1 = 178.

| Finding | Row / key | Resolution |
|---|---|---|
| S3-C1 (part) | SD0213 `NTE-temptations` | child `NTE-temptations-luke` (Luke 4:1–13 order: wilderness, mountain, Jerusalem) |
| S3-C1 (part) | SD0226 `NTE-jerusalem-community` | children `-4`, `-5`, `-6` (Acts 4, 5, 6), wording from the NT-acts-4/5/6 ledger rows of coverage-nt.md |
| S3-C1 (part) | SD0270 `NTC-vision-sequence` | 15 children `NTC-vision-sequence-01`…`-15` in the review's source order (Rev 5; 6; 7; 8–9; 10; 11; 12; 13; 14; 15; 16; 17–18; 19; 20; 21–22), each with its chapter link(s) and wording from the NT-rev-* ledger rows; -07 also cites JST Revelation 12 (ledger row NTX-revelation-woman-time); -15 names the existing “New Jerusalem (Revelation)” card (AP34) rather than a new place |
| S3-C1 (part) | SD0236 `NTE-arrest-hearings` | children `-22` … `-26` (Acts 22, 23, 24, 25, 26), wording from the NT-acts-22…26 ledger rows (Felix/Festus/Agrippa kept apart, two-year custody, no verdict, Agrippa not converted) |
| S3-C1 (open) | SD0214, SD0238, SD0240 | **not yet done**: these need per-pericope children (SD0214, SD0240) or the literal lineage names of Matthew 1 and Luke 3 (SD0238, not in the ledger rows, so they need the official text read); next run |
| S3-C2 | SD0190 | review's replacement text applied |
| S3-C3 | SD0260 | last sentence replaced as given |
| S3-C4 | SD0206 | Acts 28:12–14 timings appended as given; source label now “Acts 28:1, 12–14”. Builder question 6 in checkpoint 3 was wrong: AJ05 itself carries no timings; they are retained on this card |
| S4-C1 | SD0300, SD0311 | replacement text applied; SD0311 adds Joshua 19:15 and Judges 12:8–10 sources |
| S4-C2 | SD0443 | child `OHJ-12-stages`: the review's full ordered Numbers 33:3–49 list, with Deuteronomy 10:6–7 kept as a different order; parent says the list is the next card |
| S4-C2 | SD0468 | Joshua 20:7–8 six-city sentence applied (Joshua 20 already a source) |
| S4-C3 | SD0395, SD0441 | replacement text applied; SD0441 adds Exodus 18:2–6 |
| S4-C4 | SD0424 | replacement text applied |
| S3 readings 1, 3 | SD0115, SD0144 | optional reader wording applied |
| S4 readings 4–7, 9 | SD0354 (+1 Chronicles 13:5–6 source), SD0360, SD0404, SD0412, SD0454 | optional reader wording applied as given |
| S4 count | checkpoint 4 text | SC17 is 18 rows, not 19 |

### Checks at this checkpoint

`pnpm format`, `pnpm check` (100/100, incl. a new test: 25 child rows by parent, each child directly after its parent,
and the S3-C2–C4 / S4-C1–C4 details present), `check:dist` 114 files OK, `pnpm test:pages` 13 pages × 2 viewports. The generator is idempotent (second run, no
diff). Rendered: the `ot-more` tab, captured this time by clicking through the DOM (the earlier stall was Playwright's
pointer click waiting on a busy SwiftShader page, not the page failing to load; the page reports ready in 37–84 s):
shots `s5-codex-ot-*` at 3840×2160, 1440×900, 1280×800, 390×844 (178 cards listed, no console errors; captured before the SD0236 children were added, which touch only `nt-more`), plus
`s5-ot-stages-390x844` (the Numbers 33 list) and `s5-nt-revelation-390x844` (Revelation children). Native select,
keyboard and real-GPU gates remain open.
