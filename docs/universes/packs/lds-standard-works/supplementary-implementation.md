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
| SC18–SC23 Old Testament late history (Chronicles–Esther) | 93 (83 cards; 10 rows consolidated) | **imported, checkpoint 6** | codex tab `ot-more` |
| SC25–SC28 Old Testament major prophets (movements, people, themes, extra movements) | 59 | **imported, checkpoint 7** | codex tab `ot-more` |
| SC24 Old Testament major-prophet places; S7-C1/C2 | 73 (+6 SD0663 chapter views) | **imported, checkpoint 8** | codex tab `ot-more` |
| SC29, SC30, SC33 (apparatus, poetic place views, JST selections); S8-C1/C2 | 31 | **imported, checkpoint 9** | codex tab `ot-more` |
| SC31, SC32, SC34 (wisdom and Twelve events/journeys/relationships, reading limits, chapter notes); S9-C1 | 59 (21 + 10 + 28; +2 children) | **imported, checkpoint 10** | codex tab `ot-more` |
| S10-C1–C3; S3-C1 for SD0214 and SD0240 | 6 rows corrected; 31 child views | **checkpoint 11** (S3-C1 open for SD0238 only) | `ot-more`, `nt-more` |
| SC35–SC43 D&C (places, events, teachings, relations, people, ancient participants, dated events) | 277 | **imported, checkpoints 14–17** | codex tab `dc-more` |
| SC45 D&C section dossiers (DD001–DD138, DDO1–DDO2) | 140 | **imported, checkpoints 18–19** (S18/S19 fixes at 19–20) | codex tab `dc-more` |
| SC46 PGP records and relationships (QG01–QG16) | 16 (+1 Cowdery 1834 child) | **imported, checkpoint 20** | codex tab `pgp-more` |
| SC47 Articles of Faith 1–13 | 13 (1 card; 12 rows consolidated) | **imported, checkpoint 20** | codex tab `pgp-more` |
| SC48 PGP identity constraints | 11 (10 cards; SD1244 consolidated into QG07) | **imported, checkpoint 21** | codex tab `pgp-more` |
| SC49 JS—History person/material prose | 0 SD table rows; mandatory prose (6 child views of QG14) | **imported, checkpoint 22**; crosswalk below | codex tab `pgp-more` |
| SC50 front matter (FM01–FM09) | 9 (consolidated into the existing FM01–FM09 cards) | **imported, checkpoint 22** | `reference-views` (existing cards) |
| SC51 front-matter integration constraints | 0 SD table rows; mandatory prose (2 person cards; 3 paragraph rows) | **imported, checkpoint 22**; crosswalk below | `reference-views`, `bom-more` |
| SC52–SC54 geography models and Arabian/Jaredite source views | 11 (3 cards; 8 rows consolidated) | **imported, checkpoint 23** | `bom-more` (SC52), `bom-geography` existing cards (SC53/SC54) |
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

## Checkpoint 6: SD0226 addition; SC18–SC23 (Chronicles, Ezra, Nehemiah, Esther)

Review input: [supplementary-review-s5.md](https://github.com/mckayec/universe-sandbox/blob/7c3245b5c543d0c90542fadceffdaecc21cf940f/docs/universes/packs/lds-standard-works/supplementary-review-s5.md) (PR34 `7c3245b`).

* **SD0226 (S3-C1 remainder)**: the review's exact two sentences appended to `NTE-jerusalem-community-6` (Nicolas as
  a proselyte of Antioch; the Acts 6:9 regional labels are not a journey by Stephen). Acts 6 link unchanged, `2/nt`.
  S3-C1 stays open only for SD0214, SD0238, SD0240.
* **SC18–SC23, 93 SD rows** (SC22 has no rows) as `ot-more` cards keyed `OTL-` + the research id, display copy in
  [copy_otl.py](supplementary-build/copy_otl.py). Gate `1/ot` on every card; no coordinates, routes or years.
* **Sources**: SC21/SC23 rows carry links. SC18–SC20 rows cite late-history ledger ids; build.py now resolves those
  through the `LH1-/LH2-/LHE-/LHN-/LHS-` rows of coverage-ot-late-history.md to the official chapter, keeping verses
  where the row gives them (`LH2-11:5–12` → 2 Chronicles 11:5–12), chapter lists (`LH2-03,29,34,36`) and ranges
  (`LHS-03–08` → Esther 3–8, linked to the first chapter). JST links show as “JST 1 Chronicles 21:15”; Bible Dictionary
  links keep their row label. The generator still regenerates checkpoint 1–5 output byte-identically (checked before
  any change this run).
* **Consolidation (new in build.py)**: a copy entry may name another row's card instead of carrying its own; the row is
  mapped `imported` to that card's key, its `consolidation_rule` column starts `consolidated into SDnnnn card;`, and its
  sources join the card (a chapter link is dropped when the card already cites that chapter). Ten rows, all where the
  research rows name the same identity or say to apply apparatus to the relevant card:

  | Row | Into | Why |
  |---|---|---|
  | SD0485 `jordan-casting-ground` | SD0548 `OTL-succoth-casting` | same casting ground (2 Chronicles 4:17) |
  | SD0489 `achmetha-archive` | SD0560 `OTL-achmetha` | same setting; card keeps “modern identification needs a separate source” |
  | SD0490 `ahava-camp` | SD0558 `OTL-ahava` | same camp; card keeps the fast |
  | SD0491 `casiphia` | SD0559 `OTL-casiphia` | same slug |
  | SD0492 `shushan-narrative` | SD0557 `OTL-shushan-narrative` | same slug |
  | SD0494 `ono-invitation` | SD0561 `OTL-ono` | same invitation and refusal |
  | SD0564 `lh-a01-angel` | SD0477 `OTL-ornan-floor` | KJV/JST 1 Chronicles 21:15 given separately on the floor's card |
  | SD0565 `lh-a02-lying-spirit` | SD0531 `OTL-ramoth-gilead` | same confrontation; both wordings kept |
  | SD0567 `lh-a04-elath-eloth` | SD0543 `OTL-eloth` | Bible Dictionary alias on the place card (“Eloth (Elath)”) |
  | SD0568 `lh-a05-shushan-susa` | SD0557 `OTL-shushan-narrative` | Bible Dictionary alias (“Shushan (Susa)”); Daniel's setting not merged |

  SD0566 (Ezra 4/6 notes) has no single card to attach to and is its own card.
* **Extends, not duplicates**: place cards that the rows say to reuse name the existing card (Hebron (Kirjath-arba),
  Shechem (Sichem), Bethlehem of Judah, Samaria (city), Sheba (kingdom), Jerusalem in Samuel and Kings, Jericho in
  Joshua and Kings, “David brings the ark to Jerusalem”). WP-P06 (Daniel) and the major-prophet keys the rows mention
  are in SC24–SC34, not built yet; those links are made when they are.

Builder readings for ChatGPT to check: SD0480 says Chronicles' name Chidon is kept “rather than replaced with the name
in Samuel's account” (the row's instruction, without naming Samuel's form); SD0507 renders “trans-river” as
“beyond-the-river”; SD0508 renders “explicitly reports a blockage for his mount” as “his mount could not pass at one
point”; SD0530 keeps the row's word “cult”; SD0558 merges SD0490's fast into the Ahava card.

Accounting: 568 SD rows imported (475 + 93, of which 10 consolidated), 703 pending; 7 prose, 25 children unchanged.
Card totals: `nt-more` 211 (unchanged), `ot-more` 178 + 83 = 261.

### Checks at this checkpoint

`pnpm format`, `pnpm check` (101/101; new test: all 93 SC18–SC23 rows map to `OTL-` cards, 10 consolidated, 83 own
cards, JST/BD sources on the consolidated cards, a verse-level ledger source, and the SD0226 sentences),
`check:dist` OK, `pnpm test:pages` 13 pages × 2 viewports. Rendered (SwiftShader, page ready in 29–95 s, codex opened
and tab chosen through the DOM, CDP capture): shots `s6-codex-ot-late-*` at 3840×2160, 1440×900, 1280×800, 390×844
(phone via the section chooser), scrolled to the first new card; 261 cards listed, no console or page errors.
Native select, keyboard and real-GPU gates remain open.

## Checkpoint 7: S6-C1; SC25–SC28 (Isaiah, Jeremiah, Lamentations, Ezekiel)

Review input: [supplementary-review-s6.md](https://github.com/mckayec/universe-sandbox/blob/00c6be8ac1cc93083cecfc299146b97cbca5d09d/docs/universes/packs/lds-standard-works/supplementary-review-s6.md) (PR34 `00c6be8`). The input register is byte-identical to the one used since checkpoint 1, and the generator reproduced the checkpoint 6 pack and mapping byte-for-byte before any change.

* **S6-C1 (SC22 prose, `lh-j17-josiah-return`)**: `OTL-megiddo` (SD0550) now carries the review's replacement text
  verbatim (second chariot, transport, death and burial, separately attributed from Kings, no road or battle point).
  Its source label is now **2 Chronicles 35:22–25** (same official chapter URL). New `PROSE_INTO` in
  `copy_otl.py`; build.py writes one mapping row `,SC22,coverage-ot-late-history.md:429,lh-j17-josiah-return,…,OTL-megiddo,…`
  with `consolidated into SD0550 card (prose-only source view); no additional event or card` and no SD id. Gate `1/ot`,
  no geometry, no new card; Kings' `OHP-MEGIDDO` stays the separate comparison card.
* **SD0530 optional wording**: the review's suggested second sentence applied (“…from Ahaz’s adoption of worship of its
  gods”).
* **SC25–SC28, 59 SD rows**, one card each, keyed `OTM-` + the research id without `mp-`, display copy in
  [copy_mp.py](supplementary-build/copy_mp.py). Gate `1/ot`; no coordinates, routes, years or animation. Every
  row carries its own official links; verses are kept (`Isaiah 16:1–4`). SD0699's unlinked “compare the advance
  sign in 24:25–27” is cited as `Ezekiel 24:25–27`. No row is consolidated: SC28's four movements have no parent
  journey card among the built rows, so each is its own card (SD0700 names the SD0673 card “Ebed-melech”).
* **Movement classes kept** (SC25 rule): each card says whether it is an oracle, a promise, a vision, a sign-action
  or a reported movement, and what it is not (not a road itinerary, not a completed migration, no bodily round trip,
  not Ezekiel's own deportation).
* **Extends, not duplicates**: SD0654 is Jeremiah's own source view beside the Kings card “Zedekiah’s capture”;
  SD0679 names “Zedekiah (Mattaniah)”. Place identities in these rows (Lachish, Libnah, Mizpah, Tahpanhes, Riblah …)
  are SC24 rows, not built yet; those cards and their reuse of existing place cards come next.
* **Gate held back (SD0691/SD0706)**: the Ezekiel 37 card at `1/ot` keeps the restoration/reunion reading and the
  heading's resurrection and messianic-David readings as attributed layers, but not the heading's Bible/Book of
  Mormon reading: SD0706 (SC29) makes that a distinct child card gated at the Book of Mormon. SC29 needs cards gated
  at `3/bom` and `4/dc`, which the generator's one-gate-per-family model does not do yet; it is built with SC29.

Builder readings for ChatGPT to check: SD0642 renders “Nob threatening Zion” as “Nob, from which Zion is threatened”;
SD0656 renders “catches him” as “catches up with him”; SD0696 renders “the tenth day for the burning entry” as “the
tenth day in its account of the burning”; SD0697 renders “The carriers' journey is not Jeremiah's journey” as “The
carriers make the journey, not Jeremiah”; SD0680 renders “A satanic application requires explicit attribution” as
“Applying the oracle to Satan is an interpretation that needs explicit attribution”.

Accounting: 627 SD rows imported (568 + 59; 10 consolidated), 644 pending; prose 7 + 1 consolidated SC22 prose view;
25 children unchanged. Mapping 1,304 rows. Card totals: `nt-more` 211 (unchanged), `ot-more` 261 + 59 = 320. S3-C1
remains open for SD0214, SD0238, SD0240.

### Checks at this checkpoint

`pnpm format`, `pnpm check` (102/102; new test: all 59 SC25–SC28 rows map to their own `OTM-` card with only
Isaiah/Jeremiah/Lamentations/Ezekiel sources and the OT gate, verse labels kept, the Ezekiel 24 comparison cited, no
Book of Mormon reading on the Ezekiel 37 card, the SC22 prose row consolidated into the single `OTL-megiddo` card with
the 35:22–25 locator), `check:dist` 114 files OK, `pnpm format:check` clean, `pnpm test:pages` 13 pages × 2 viewports.

Rendered (SwiftShader, built `dist/` served under `/universe-sandbox/`, page ready in 30–80 s, codex opened and
section chosen through the DOM, CDP capture): shots `s7-codex-ot-prophets-*` at 3840×2160, 1440×900, 1280×800,
390×844 (phone via the section chooser), scrolled to the first new card; 320 cards listed in `ot-more`, no console
or page errors. Native select, keyboard and real-GPU gates remain open.

## Checkpoint 8: S7-C1, S7-C2, two optional wordings; SC24 (major-prophet places)

Review input: [supplementary-review-s7.md](https://github.com/mckayec/universe-sandbox/blob/9539b755597b07c39f2aa7cd1368d5ee92c4b2e5/docs/universes/packs/lds-standard-works/supplementary-review-s7.md) (PR34 `9539b75`). Input register unchanged (sha256 `0c3c0aea…229d9e`); the generator reproduced the checkpoint 7 pack and mapping byte-for-byte before any change.

* **S7-C1 (SD0663)**: the parent card's retention claim is replaced with the review's sentence (“The cited chapters
  describe distinct measured spaces and gate functions”). Six child source views follow it, built from the accepted
  ledger rows MP4-40–44/46 and the review's minimum contexts, each citing only its own chapter URL, gate `1/ot`,
  no dimensions converted, no coordinates: `OTM-j22-temple-tour-40` (gates, courts, priestly rooms; visionary, not
  remains), `-41` (twenty-cubit-square most holy place, three-level side rooms, western building, doors, wooden
  altar/table, ornament; the guide's inward access distinct from Ezekiel's), `-42` (north/south priestly chambers;
  **five hundred reeds** on each side, not converted to cubits), `-43` (Ezekiel 43:1–17: glory from the east; the
  altar's stepped measurements; no verified construction/date), `-44` (Ezekiel 44:1–5: outer east gate shut, the
  prince's provision, approach by the north gate; no present Jerusalem gate), `-46` (Ezekiel 46:19–24: separate
  priestly and court cooking places; this chapter's inner east gate distinct from chapter 44's outer gate). Mapping:
  six `child of SD0663` rows. **SD0705** (`mp-a05-reeds`, SC29) stays pending; when SC29 is built it consolidates into
  `OTM-j22-temple-tour-42`, which already carries the reed/cubit distinction, so no building or event is duplicated.
* **S7-C2 (SD0679)**: the Mulek sentence on `OTM-r15-zedekiah-house` is replaced by the review's sentence (“This card
  retains Jeremiah’s account without harmonizing it with other accounts.”). No card in `ot-more` names Mulek (test).
  The research constraint is kept here for a later attributed `3/bom` view: *claims about Mulek from other books need
  their own attribution and must not be harmonized silently.* Mulek city/land cards are not repurposed as the person.
* **Optional wordings applied**: SD0696 takes the review's precise Jeremiah 52 sentence; SD0697 adds “On this mission,”.
* **SC24, 73 SD rows**, one card each, keyed `OTM-` + the research id, gate `1/ot`, no coordinates, routes or years;
  every row's own Isaiah/Jeremiah/Ezekiel links with verses. No row is consolidated (the category rule keeps prophetic
  geography, historical setting and named region distinct). Rows anchored to an existing site name that site's card as
  the same place: P08 → “Jerusalem in Samuel and Kings” (SD0569, SD0574), AP07 → “Babylon in Kings” (as a marker that
  does not verify each event), P04 → “Egypt (Old Testament settings)”, P07 → “Bethlehem of Judah”, AP06 → “Jericho in
  Joshua and Kings” (marker does not pinpoint the capture), P01 → “Haran (Genesis)” (trading context separate from
  Abraham's departure). Homonym qualifiers: Ramah (Jeremiah), Mizpah (Gedaliah), Migdol (Egypt, Jeremiah),
  Beth-shemesh (Egypt) “not the town of the same name in Judah”, Bozrah (Edom), Tel-abib “not the modern city of Tel
  Aviv”, Rabbah of the Ammonites. Sidon's card does not touch the Book of Mormon river Sidon.

Builder readings for ChatGPT to check: (1) rows marked `new` whose name matches an existing Old Testament place card
are said to be the same place: Damascus (Kings), Samaria (city), Nineveh (Kings), “Lachish”, Tyre (Kings), “Moab”,
Seir, Gaza (Azzah), “Ashdod”, Riblah in Hamath, “Shiloh”; Carmel, Edom, Hamath, Lebanon, Bashan, Sheba, Ramah and
En-gedi are *not* linked (region/oracle senses, or the existing card is a different identity or episode). (2) SD0591
and SD0635 point to the movement cards “Ishmael’s captives and Gibeon’s waters” and “Envoys to Zoan and Hanes”.
(3) SD0591 uses “catches up with”, as accepted for SD0656. (4) SD0578 renders “a promised cultivation setting” as “a
setting where cultivation is promised”. (5) S7-C1 `-44` states the princely provision as “the prince may sit in it to
eat bread before the Lord”; `-46` describes the cooking places as where the priests boil and bake the offerings and,
in the corners of the outer court, where the ministers boil the people's sacrifices.

Accounting: 700 SD rows imported (627 + 73; 10 consolidated), 571 pending; prose 7 + 1 consolidated SC22 prose view;
31 children (25 + 6). Mapping 1,310 rows. Card totals: `nt-more` 211 (unchanged), `ot-more` 320 + 73 + 6 = 399.
S3-C1 remains open for SD0214, SD0238, SD0240. SD0691's later facet remains pending through SD0706 (SC29).

### Checks at this checkpoint

`pnpm format`, `pnpm check` (103/103; new test: all 73 SC24 rows map to their own `OTM-` card with OT-prophet sources
and the OT gate only, homonym distinctions present; the six SD0663 views follow the parent in order with the reed and
inner-gate payloads; no Mulek text anywhere in `ot-more`), `check:dist` 114 files OK, `pnpm test:pages` 13 pages × 2
viewports. Rendered (SwiftShader, built `dist/` under `/universe-sandbox/`, page ready in 21–68 s, codex opened and
section chosen through the DOM, CDP capture): shots `s8-codex-ot-places-*` at 3840×2160, 1440×900, 1280×800, 390×844,
scrolled to the first new card; no console or page errors. Native select, keyboard and real-GPU gates remain open.

## Checkpoint 9: S8-C1, S8-C2; SC29 (apparatus), SC30 (poetic place views), SC33 (JST selections)

Review input: [supplementary-review-s8.md](https://github.com/mckayec/universe-sandbox/blob/60eaa5b85d9a2905214767c5b39c3c87eee43ff2/docs/universes/packs/lds-standard-works/supplementary-review-s8.md) (PR34 `60eaa5b`). Input register unchanged (sha256 `0c3c0aea…229d9e`); the generator reproduced the checkpoint 8 pack and mapping byte-for-byte before any change.

* **S8-C1 (SD0578)**: `OTM-samaria` takes the review's replacement text verbatim (city reference kept; Jeremiah's
  vine planting on the mountains of Samaria stays regional; no vineyard located in the city). Same three citations.
* **S8-C2**: `OTM-j22-temple-tour-46` is now titled “Ezekiel 46:1, 19–24: inner gate and cooking places”, source
  labels “Ezekiel 46:1, 19–24” (chapter 46 URL) and “Ezekiel 44:1–3” (chapter 44 URL). Copy unchanged; still `1/ot`,
  still the last of the six SD0663 views.
* **SC29, 6 SD rows** (`OTM-a0n-…`):
  * SD0701 Isaiah 11 card at `1/ot` cites only Isaiah 11 (the row's D&C 113 link is dropped from it, new `DROP_SRC`);
    child `OTM-a01-jesse-dc113` at **`4/dc`** carries D&C 113:1–6 (stem as Christ; rod and root as servants or
    descendants, unnamed; no servant assigned to a person).
  * SD0702 Isaiah 29 card at `1/ot` with Isaiah 29 notes and JST Isaiah 29:1–8 as a labelled comparison; child
    `OTM-a02-ariel-jst-introduction` at **`3/bom`** carries the JST editorial introduction's Book of Mormon reading,
    stated as an editorial introduction, not KJV wording, and no American Ariel site.
  * SD0703, SD0704: KJV/JST comparisons at `1/ot`, each citing both witnesses.
  * SD0705 **consolidates into the Ezekiel 42 child view** `OTM-j22-temple-tour-42` (as announced at checkpoint 8):
    the view gains the source “Ezekiel 42:15–20 and notes” and one sentence (“The Church edition’s notes explain the
    outer and common terms; they keep the stated reeds and do not substitute cubits.”). build.py now accepts a child
    key as a consolidation target.
  * SD0706 is its own card `OTM-a06-ezekiel-37-heading`, gated **`3/bom`** (new per-row `GATE`): the Church heading's
    Bible/Book of Mormon reading of the two sticks, shown apart from the chapter's reunion explanation; the
    resurrection/messianic-David readings stay on SD0691's `1/ot` card as before. Mapping `work_gate` records the
    row gate. Children may now carry their own gate (fifth tuple element); mapping records `n/layer (child gate)`.
  * The three later-gated cards sit in `ot-more` immediately after their parent (or in register order for SD0706);
    with only the OT layer, or reading through book 1, they are locked/filtered, as the test checks.
* **SC30, 20 SD rows** (`OTW-p…`, new copy_wp.py): one card each, `1/ot`, no coordinates/routes/years. The rows
  carry no links, so each card's sources spell out the verses the row names (Job 1:1, Daniel 8:2, 16 …) as official
  chapter links. Same-place pointers where the row says to reuse: Nineveh (Kings), Joppa (Chronicles and Ezra),
  Shushan in Nehemiah and Esther, “Tekoa”, Jerusalem in Samuel and Kings, Bethlehem of Judah, Shechem (Sichem).
  Babylon (Psalm 137) is explicitly not placed at the Babylon marker; Tarshish is intended, not reached.
* **SC33, 5 SD rows** (`OTW-c11…c15`): JST Psalm 11, 14, 24, 109 and Amos 7 as selected translation comparisons at
  `1/ot`, each with its own JST link; none replaces the KJV wording.

Builder readings for ChatGPT to check: (1) SD0702's research says the JST introduction “relates the message to the
Book of Mormon”; the child is gated `3/bom` (row: “separate BoM interpretive card `first:3`”) and cites the JST
Isaiah 29 chapter URL labelled “(introduction)”. (2) SD0706 copy: “reads the joined sticks as the Bible and the Book
of Mormon” from the row/O7 wording “Bible/Book of Mormon interpretation”. (3) SD0710 does not name Tarshish in the
prophets as the same place (identity not stated by the row); Psalms 48 and 72 are cited at chapter level only.
(4) SD0721: the register says attach to a shared Heshbon reference, but the pack has no Heshbon card yet; the card
names Heshbon without a pointer. (5) SD0722 omits the row's “distinct NT/BoM gates” wording from reader copy (it is
a gating rule, honoured by drawing nothing) to avoid naming a later work on a `1/ot` card. (6) SD0725 adds that the
foretold splitting belongs to the prophecy (row constraint “keep future splitting in vision layer”).

Accounting: 731 SD rows imported (700 + 31; 11 consolidated), 540 pending; prose 7 + 1 consolidated SC22 prose view;
33 children (31 + 2). Mapping 1,312 rows (772 imported). Supplementary cards 760; `ot-more` 399 + 32 = 431 (428 at
`1/ot`, one at `4/dc`, two at `3/bom`); `nt-more` 211 unchanged. Next: SC31, SC32, SC34 (59 OT rows), S3-C1 for
SD0214, SD0238, SD0240, then SC35–SC54.

### Checks at this checkpoint

`pnpm format`, `pnpm check` (104/104; new test: 31 SC29/SC30/SC33 rows map to `OTM-`/`OTW-` cards; SD0705 consolidated
into the Ezekiel 42 view with its verses; D&C 113 child at `4/dc`, Isaiah 29 introduction child and SD0706 at `3/bom`,
none shown with only the OT layer through book 1; no D&C link or later-work name on the `1/ot` SC29 cards; 25 `OTW-`
cards OT-only with wisdom/Twelve or JST sources; S8-C1/S8-C2 assertions), `check:dist` 114 files OK, `pnpm test:pages`
13 pages × 2 viewports. Rendered (SwiftShader, built `dist/` under `/universe-sandbox/`, page ready in 20–130 s, codex
opened and `ot-more` chosen through the DOM, CDP capture): shots `s9-codex-ot-apparatus-*` at 3840×2160, 1440×900,
1280×800, 390×844, scrolled to the first SC29 card; 431 cards listed with all layers on; no console or page errors.
Native select, keyboard and real-GPU gates remain open.

## Checkpoint 10: S9-C1; SC31 (events, journeys, relationships), SC32 (reading limits), SC34 (chapter notes)

Review input: [supplementary-review-s9.md](https://github.com/mckayec/universe-sandbox/blob/23fd7012ea7016702b77b2e0b9a3841210a3c83f/docs/universes/packs/lds-standard-works/supplementary-review-s9.md) (PR34 `23fd701`). Input register unchanged (sha256 `0c3c0aea…229d9e`); the generator reproduced the checkpoint 9 pack and mapping byte-for-byte before any change.

* **S9-C1 (SD0760)**: `OTW-c13-jst-psalm-24` keeps its first sentence and takes the review's two replacement
  sentences verbatim; sources are now “JST Psalm 24:7–10” (row link) and **“Psalm 24:7–10 (KJV)”** (Psalm 24 chapter
  URL). Still `1/ot`, no geometry.
* **S9 reading 3 (optional)**: SD0710's Tarshish sources are labelled Psalm 48:7 and Psalm 72:10.
* **S9 reading 4 (SD0721, Heshbon)**: new nonspatial identity card `OTW-heshbon` (child of SD0721, `1/ot`, right after
  the Song 7:4 card): Heshbon as Sihon's city in Numbers and Joshua, and the Song's poetic use of its pools; no
  position for the city, pools or gate. Sources Numbers 21 and Joshua 12 at chapter level (the accepted ledger rows
  OH-N21 and OH-Q12 name Heshbon as Sihon's city) and Song of Solomon 7:4. The Song card now says “The same Heshbon as
  the card “Heshbon””. The codex has no typed-relation field, so the attachment is the card, its placement, the prose
  pointer and the mapping row (`child of SD0721`); if a machine-readable relation is required, that is an engine
  field to specify, not something this checkpoint claims.
* **SC31, 21 SD rows** (corrected from 17 per S10; 11 events, 5 journeys, 5 relationships) (`OTW-e01…e11`, `OTW-j01…j05`, `OTW-r01…r05`): one card each, `1/ot`, no coordinates, routes or
  years; text dates (Jehoiakim's third year; Darius's second year, months 6 and 9) stay as words. Journeys are
  described only (Jonah: Joppa, intended Tarshish not reached, unnamed landing, Nineveh; Daniel 1: Jerusalem to
  Babylon, way not described). Relationship cards keep Belteshazzar ≠ Belshazzar, Joshua the high priest ≠ Joshua son
  of Nun, Hosea 3's woman unnamed, Lemuel ≠ Solomon and his mother ≠ Bathsheba.
* **SC32, 10 SD rows** (`OTW-c01…c10`): genre and reading-limit cards at `1/ot`. SD0753 (Psalm 85) is split like
  SD0706: the `1/ot` card gives verse 11 and says it names no book; child `OTW-c06-psalm-85-heading` at **`3/bom`**
  carries the Church heading's Book of Mormon reading, attributed as the edition's interpretation.
* **SC34, 28 SD rows** (`OTW-a01…a28`): one chapter-note card each, `1/ot`, every alias attributed to the edition
  (No-amon/Thebes, Lubim/Libyans, Hiddekel/Tigris, Tyrus/Tyre, Asshur/Assyria, Meribah, Reed Sea, Ya'ar) and every
  inline JST reading shown beside, not instead of, the KJV. SD0771 uses the row's exact safe copy.

Builder readings for ChatGPT to check: (1) SD0789 (animal/instrument notes) and SD0790 (remaining lexical notes)
name no chapters, so their sources are the book contents pages (Job, Psalms, Proverbs; SD0790 adds Ecclesiastes and
the Song), labelled “(chapter notes)”; SD0746 likewise cites the Psalms contents page as “(chapter headings)” and
SD0783 the Song's. (2) SD0753's `1/ot` card quotes KJV Psalm 85:11 (“truth shall spring out of the earth …”); the
row gives only “truth coming from the earth”. (3) SD0754 names Christ on a `1/ot` card as the Church heading does
(same treatment as `OTM-a01-jesse`) and quotes Psalm 110:4's “a priest for ever after the order of Melchizedek” for
the row's “cross-link Melchizedek themes”. (4) SD0730 places the furnace scene on the plain of Dura (the row's WP-P05
pointer) and SD0739 names the land of Shinar (the row's Shinar constraint). (5) SD0736 and SD0740/0741 cite each
psalm with the label “(superscription)” at chapter level. (6) SD0763's “shelter” and “castor-bean plant” are the
row's alternatives for the booth and the plant; the KJV word for the plant is not quoted on the card.

Accounting: 790 SD rows imported (731 + 59; 11 consolidated), 481 pending; prose 7 + 1 consolidated SC22 prose view;
35 children (33 + 2). Mapping 1,314 rows (833 imported). `ot-more` 431 + 61 = 492 (488 at `1/ot`, one at `4/dc`,
three at `3/bom`); `nt-more` 211 unchanged. All Old Testament supplementary families (SC13–SC34) are now imported.
Next: S3-C1 for SD0214, SD0238, SD0240, then SC35–SC45 (D&C, 417 rows), SC46–SC54.

### Checks at this checkpoint

`pnpm format`, `pnpm check` (105/105; new test: 59 SC31/SC32/SC34 rows map to `OTW-` cards, `1/ot`, no geometry or
year, OT-only sources and no later-work name except the gated Psalm 85 heading child; S9-C1 copy and both Psalm 24
sources; Tarshish verse labels; Heshbon card after the Song 7:4 card with its three sources and no coordinates;
Psalm 85 child at `3/bom` hidden with only the OT layer through book 1; row-specific distinctions and the SD0771 safe
copy), `check:dist` 114 files OK, `pnpm test:pages` 13 pages × 2 viewports. Rendered (SwiftShader, built `dist/` under
`/universe-sandbox/`, page ready in 22–101 s, codex opened and `ot-more` chosen through the DOM, CDP capture): shots
`s10-codex-ot-wisdom-*` at 3840×2160, 1440×900, 1280×800, 390×844, scrolled to “Job's losses”; 492 cards listed with
all layers on, the Heshbon and Psalm 24 text present; no console or page errors. (Captured before one word of SD0763 changed from “gourd” to “plant”; that card is not in frame.) Native select, keyboard and real-GPU
gates remain open.

## Checkpoint 11: S10-C1–C3, SC31 count; S3-C1 for SD0214 and SD0240

Review input: [supplementary-review-s10.md](https://github.com/mckayec/universe-sandbox/blob/6b272ba8344a45a12f6426eb5306db79eccebf40/docs/universes/packs/lds-standard-works/supplementary-review-s10.md) (PR34 `6b272ba`). Input register unchanged; the generator reproduced the checkpoint 10 pack and mapping byte-for-byte before any change.

* **S10-C1 (SD0730)**: `OTW-e04-furnace` first sentence replaced with the review's two sentences verbatim (Dura names
  the image's site; the furnace is not separately located). Final two sentences, Daniel 3 source and `1/ot` unchanged.
* **S10-C2**: no book contents page remains as a source.
  * SD0746 `OTW-r04-psalm-collections`: copy unchanged; sources are the eight chapters, labelled by heading —
    Psalm 3 (superscription: David), 50 (Asaph), 42 (sons of Korah), 72 (Solomon), 90 (Moses), 88 (Heman),
    89 (Ethan), 39 (Jeduthun direction).
  * SD0783 `OTW-a21-song-notes`: copy unchanged; sources Song of Solomon 1, 2, 4 and 8, each “(study notes)”.
  * SD0789 `OTW-a27-animal-instrument-notes`: rewritten as a bounded list of the review's examples (Job 21, 30, 39;
    Psalms 22, 29, 92, 44, 63, 104, 148, 150; Proverbs 30; Malachi 1), saying it is not every such note; the earlier
    “serpent” and “birds” were dropped because the review gives no exact note reference for them. Thirteen chapter
    sources, each labelled with its note (e.g. “Psalm 104 (study note: rock badger)”). The fuller research
    disposition is untouched.
  * SD0790 `OTW-a28-lexical-notes`: single source “Accepted apparatus audit (chapter concept register)” linking the
    pinned `9cc874c` bounded-audit anchor. The last sentence now says the notes remain in their chapters and the
    research register and that the atlas does not display them one by one. `build.py` now keeps a full URL in a
    copy module's extra sources as given (this is the only non-scripture source in `ot-more`; tests allow exactly it).
* **S10-C3 (SD0785)**: parent `OTW-a23-psalms-jst-notes` now says six labelled variants follow, each compared with the
  KJV, and that the notes do not replace the KJV; its five chapter sources stay. Six ordered children
  `OTW-a23-jst-psalm-30-5`, `-30-9`, `-32-1`, `-50-21`, `-138-8`, `-141-5` carry the review's six comparisons
  verbatim, each sourced “Psalm v (inline JST note)” at its chapter, `1/ot`, no date or position. The Psalm 141:5 view
  adds “This is not read as approval of physical harm.”
* **SC31 count**: 21 rows, not 17 (receipt typo; nothing missing). Totals in checkpoint 10 were already right.
* **S3-C1, SD0214 `NTE-calls-and-healings`**: twelve children in source order, one per ledger chapter — Matthew 9, 12;
  Mark 1, 2, 3, 4, 5; Luke 4, 5, 6, 7, 8 — keys `NTE-calls-and-healings-<book>-<chapter>`, titled “Calls, healings
  and crossings (Book n)”, each with its own chapter source, `2/nt`, no position. Copy follows each `NT-*` ledger
  record and keeps its distinctions (Matthew 9's ruler unnamed and 9:27–34; Mark's Abiathar beside 1 Samuel 21's
  Ahimelech; Mark 5's death news after Jairus's request beside Matthew 9; Luke 7's mediated request beside Matthew 8;
  Joanna as wife of Chuza; Jairus's daughter about twelve). Parent's last sentence now points to these views instead
  of “Each Gospel's order … is kept”.
* **S3-C1, SD0240 `NTC-parables`**: thirteen children from the ledger records that name parables — Matthew 18, 20,
  22, 25; Mark 4; Luke 10, 12, 13, 14, 15, 16, 18, 19 — keys `NTC-parables-<book>-<chapter>`, titled “Parables (Book
  n)”, `2/nt`, chapter source each. Story settings are not mapped (Luke 10's Jerusalem–Jericho road, Matthew 20's
  vineyard); Luke 16's Lazarus is not assumed to be John 11's; Luke 19's nobleman is not identified with Archelaus.
  Parent's last sentence now points to these views.
* **S3-C1, SD0238 (genealogies) stays open.** The literal Matthew 1 and Luke 3 name lists are not in the chapter
  ledger, and the official chapter pages could not be fetched from this run, so no list was written from memory.

Builder readings for ChatGPT to check: (1) SD0214/SD0240 children are chapter-level, one per ledger record, because the
ledger gives chapter records (verse locators only where the ledger gives them, Matthew 9:27–34); if pericope-level
verse locators are required, say which. (2) SD0240 includes Luke 12 and 13 and the Synoptic chapters Matthew 18, 20,
22, 25 and Mark 4, the ledger records that name parables beyond the required Luke 10/14–16/18–19; Matthew 21 and Luke 8, whose ledger records
name no parable, are not included. (3) Mark 4 appears twice by design: the
crossing in SD0214's view, the seed parables in SD0240's. (4) Mark 5's child says “a man possessed” (Mark's singular)
without a cross-note to Matthew 8's two; the parent already names Matthew's two demoniacs. (5) SD0789 dropped
serpent and birds (see above).

Accounting: 790 SD rows imported, 481 pending (unchanged). Children 35 + 31 = 66 (SD0214 ×12, SD0240 ×13, SD0785 ×6).
`ot-more` 492 + 6 = 498 (494 at `1/ot`); `nt-more` 211 + 25 = 236. Mapping 1,345 rows (864 imported).
Next: SD0238 genealogies (S3-C1, needs the official chapter text), then SC35–SC45 (D&C, 417 rows), SC46–SC54.

### Checks at this checkpoint

`pnpm format`, `pnpm check` (106/106; updated counts in the NT, OT and child tests; new test for S10-C1–C3 and the
SD0214/SD0240 views: Dura sentence, chapter-only sources and their order, the SD0790 decision link, six JST views in
verse order with their own sources, 25 NT views in source order after their parents at `2/nt` with no position),
`check:dist` 114 files OK, `pnpm test:pages` 13 pages × 2 viewports.

Rendered (SwiftShader, built `dist/` under `/universe-sandbox/`, page ready in 18–73 s, codex opened and the tab
chosen through the DOM, CDP capture) at code commit `620df82`: shots `s11-codex-ot-more-*` scrolled to the SD0785
parent and its JST views, and `s11-codex-nt-more-*` scrolled to the SD0214 parent and its first views, at 3840×2160,
1440×900, 1280×800 and 390×844; 498 `ot-more` and 236 `nt-more` cards listed with all layers on; no console or page
errors. Native select, keyboard and real-GPU gates remain open.

## Checkpoint 12: S11-C1, S11-C2; S3-C1 for SD0238 (genealogies)

Applies [supplementary-review-s11](https://github.com/mckayec/universe-sandbox/blob/df275a8516b2eb9c0b042d48d8523f05a8a24a24/docs/universes/packs/lds-standard-works/supplementary-review-s11.md)
(PR34 `df275a8`, auditing `620df82`). Regeneration with the same PR34 input was first confirmed byte-identical at
`684cec1`; the declaration register at `df275a8` is byte-identical to the `9cc874c` witness.

* **S11-C1 (SD0240 `NTC-parables`)**: four children added in book/chapter order, `2/nt`, nonspatial, with the
  review's exact passages as their only source: `NTC-parables-matt-21` (Matthew 21:28–32, 33–46: two sons; vineyard
  tenants), `NTC-parables-mark-12` (Mark 12:1–12: Mark kills the son before casting him out), `NTC-parables-luke-8`
  (Luke 8:4–15: the sower and its interpretation, separate from the chapter's crossing and healings) and
  `NTC-parables-luke-20` (Luke 20:9–19: cast out, then killed; the hearers' “God forbid”). Each Gospel's tenant
  sequence is stated as written, not harmonized. The thirteen earlier children are unchanged. Parent's last sentence
  is now the review's “Additional attributed parable views follow in each Gospel’s order; story settings are not
  mapped.” SD0240 children: 17, in the order Matthew 18, 20, 21, 22, 25; Mark 4, 12; Luke 8, 10, 12–16, 18–20.
* **S11-C2 (SD0789)**: source labels are now “Psalm 29 (study note: bison or buffalo)” and “Psalm 92 (study note:
  buffalo or bison)”; Psalm 22 keeps “wild ox”. Copy and URLs unchanged.
* **Builder question 1, optional**: `NTE-calls-and-healings-mark-2` now also cites 1 Samuel 21, the comparison its copy
  names.
* **S3-C1 (SD0238 `NTC-genealogies`)**: the review's source-order transcriptions are copied unchanged to
  `supplementary-build/genealogy/{matt,luke}-genealogy-names.csv`, and `copy_nt.py` builds two `2/nt` children from
  them (no list typed by hand):
  * `NTC-genealogies-matt-1` “Genealogy in Matthew 1” (source Matthew 1:1–17): verse 1's summary; then all 40
    main-chain occurrences, Abraham → … → Joseph, under Matthew's “begat” (stated as the text's wording, not a claim
    that no generation is omitted). The side branches and qualifiers are attached to the occurrence they qualify, in
    the text's words: “Judas and his brethren”, “Phares and Zara of Thamar”, “Booz of Rachab”, “Obed of Ruth”, “David
    the king”, “Solomon of her that had been the wife of Urias”, “Jechonias and his brethren, about the time they were
    carried away to Babylon”. Verse 16's changed predicate is quoted (“the husband of Mary, of whom was born Jesus,
    who is called Christ”) with “the text does not say that Joseph begat Jesus”; verse 17's three fourteens are
    stated with “no names are added to fit those groups”; the repeated Jacob is listed at both places.
  * `NTC-genealogies-luke-3` “Genealogy in Luke 3” (source Luke 3:23–38): verse 23 quoted with “about thirty years of
    age, being (as was supposed) the son of Joseph”; then Heli → … → Adam, “which was the son of God”, all 77
    occurrences counting Jesus, Joseph and God, in Luke's spelling; the last link is called Luke's statement, not an
    ordinary line of descent; repeated names are listed at each place (Joseph ×4, Matthat ×2, Levi ×2, Melchi ×2,
    Mattathias ×2, Juda ×3, Cainan ×2); “not harmonized with Matthew's”.
  * Parent copy: “… kept as separate lists, each in its own view, with no inferred line through Mary.” No merged
    tree, Mary line, dates or geometry. A plain ordered list, as the handoff allows; no graphical genealogy UI.

Builder readings for ChatGPT to check: (1) Matthew's side branches are shown inline at the occurrence they qualify
(“Phares and Zara of Thamar”), not as separate nodes; the chain test strips them back to the CSV names. (2) The
Matthew chain is written with “→” after the sentence “each name ‘begat’ the next”; the Luke chain uses the same
arrow after “each name is called the son of the one after it”, so the arrow reads in opposite genealogical
directions in the two views, each defined in its own sentence. Say if a different notation is wanted. (3) The verse 17
sentence paraphrases the three groups rather than quoting the verse.

S3-C1 child views now exist for its seven original IDs: SD0213, SD0214, SD0226, SD0236, SD0238, SD0240 and SD0270
(receipt corrected per S12; it first said “all four families”). SD0238 and SD0240 awaited ChatGPT's recheck at `517a24a`.

Accounting: 790 SD rows imported, 481 pending (unchanged; no new SD rows). Children 66 + 6 = 72 (SD0238 ×2, SD0240
×17). `nt-more` 236 + 6 = 242; `ot-more` 498 unchanged. Mapping 1,351 rows (870 imported).
Next: SC35–SC45 (D&C, 417 rows), then SC46–SC54.

### Checks at this checkpoint

`pnpm format`, `pnpm check` (107/107; NT and child counts updated; Mark 2 child now has two sources; new test for
S11: the four parable views and their exact locators, both tenant orders, the Psalm 29/92/22 labels, the two
genealogy views right after their parent at `2/nt` with no position or date, hidden with only the OT layer and
before the New Testament group, every Matthew and Luke occurrence in CSV order with no deduplication, Matthew's
side branches and changed ending, Luke's “as was supposed”), `check:dist` 114 files OK, pack validator clean,
`pnpm test:pages` 13 pages × 2 viewports.

Rendered (SwiftShader, built `dist/` under `/universe-sandbox/`, page ready in 45–133 s, codex opened and `nt-more`
chosen through the DOM, CDP capture) at code commit `517a24a`: shots `s12-codex-nt-genealogies-*` scrolled to the SD0238
parent and its two lists, and `s12-codex-nt-parables-*` scrolled to the Mark 12 view (Matthew 25 to Luke 20 visible
at 4K), at 3840×2160, 1440×900, 1280×800 and 390×844; 242 `nt-more` cards listed with all layers on; no console or
page errors. Native select, keyboard and real-GPU gates remain open.

## Checkpoint 13: S12-C1 (Matthew genealogy notation)

Applies [supplementary-review-s12](https://github.com/mckayec/universe-sandbox/blob/af9d787d79c25e25eba9198edf52d98b29791a7f/docs/universes/packs/lds-standard-works/supplementary-review-s12.md)
(PR34 `af9d787`, auditing `517a24a`).

* **S12-C1 (`NTC-genealogies-matt-1`)**: the chain preface is now the review's legend (“Each arrow connects the
  main-line names using Matthew’s ‘begat’ wording; parentheses give side branches or qualifications, not additional
  chain links. This follows the text’s wording, without claiming that no generation is omitted:”), and the seven
  annotations are the review's parenthetical replacements, e.g. “Phares (Zara is also named; both are of Thamar) →
  Esrom”. Same 40-name CSV; verse 16 and 17 sentences, spellings, repeated Jacob and the `2/nt` gate unchanged.
  Test now asserts the occurrence after Phares is Esrom, no chain item starts with Zara or “his brethren”, and the
  legend is present.
* **Receipt**: checkpoint 12's “all four families” replaced by the seven S3-C1 IDs (above).

Accounting unchanged: 790 SD rows imported, 481 pending; 72 children; mapping 1,351 rows (870 imported). Only the
Matthew card's text changes (the mapping CSV is byte-identical).

### Checks at this checkpoint

`pnpm format`, `pnpm check` (107/107), `check:dist` 114 files OK, pack validator clean, `pnpm test:pages` 13 pages × 2
viewports. Rendered (SwiftShader, same method as checkpoint 12, page ready in 46–116 s) at code commit `7f53ac4`:
shots `s13-codex-nt-genealogies-*` at 3840×2160, 1440×900, 1280×800 and 390×844 show the new legend and “Phares (Zara
is also named; both are of Thamar) → Esrom”; 242 `nt-more` cards; no console or page errors. Native select, keyboard
and real-GPU gates remain open.

## Checkpoint 14: SC35–SC39 (Doctrine and Covenants places, events, teachings and relationships)

Code commit `0bc682c`. 69 SD rows (SC35 12, SC36 13, SC37 13, SC38 15, SC39 16) as 69 `DCM-` cards in a new codex tab
`dc-more` (“More Doctrine and Covenants places, events and people”), generated by build.py with the new `copy_dc.py`.
Every card is `4/dc` only, with no coordinates, routes or years; no children or consolidations in this tranche.

* **Sources**: the rows carry no links; each names sections, headings or verses, which `EXTRA_SRC` spells out as
  official section links (`dc-testament/dc/N`, `od/N`), one link per section with ranges expanded (DX09: 32 sections).
  Three rows also cite their named cross-references outside the D&C: DX02 Genesis 5, DX04 Jacob 2:23–30 and OD 1.
* **Reuse, no new centroids** (SC35): DP03 names the Independence pin and narrative “Independence designated”; DP09
  belongs to the Nauvoo pin; DE06 names the Kirtland Temple pin; DE07 and DJ05 name the existing narratives
  “Nauvoo building instructions” and “Instructions for the journey”. Every other DP place gets no point.
* **Typed relations** (SC37 DR01–DR08, SC39 DR09–DR24): the codex has no typed-relation field (as disclosed at
  checkpoint 10), so each predicate is a sentence on its card, dated to its document where the row dates it.

Builder readings for ChatGPT:

1. Names are given only as fully as the row gives them (“Whitney”, “Law”, “Marsh”, “Wight and Corrill”); the
   rows' DD052/DD075/DD124 full rosters are not in the register, so DR16/DR18/DR20 say the full roster stays in the
   revelation and name only the pairs the row names.
2. DR13 keeps the three verse references as one list (41:9; 53:4; 72:8) rather than assigning each to a person.
3. DP06 omits the heading's distance wording (“about four miles north”) because the row does not say north of
   what; the card says only that the position is approximate.
4. DJ03's four travelers are not named (the row cites them to the ledger without names).
5. DX05 cross-links the existing RE14, RE18–RE20, RC05 and RC06 cards by name; RE17 is not in the pack, so it is
   not named.
6. DR06 renders “vision is not contemporary death of parents also depicted” as “the vision also shows his parents;
   that does not mean they had died when it was received.”

Accounting: 859 SD rows imported, 412 pending (SC40–SC45 D&C, then SC46–SC54); 72 children; mapping 1,351 rows
(939 imported mapping rows).

### Checks at this checkpoint

`pnpm format`, `pnpm check` (108/108; new test: 69 SC35–SC39 rows map to `DCM-` cards in `dc-more`, `4/dc`, no geometry
or year, unique per-card sources, hidden under every other single layer and before the D&C group, row distinctions
for Perrysburg, Zarahemla Iowa, DE06's two dates, Enoch's two ages, DX04's verses 61/65 and cross-links, DR23), pack
validator (via the atlas-packs test) clean, `pnpm test:pages` 13 pages × 2 viewports. Rendered (SwiftShader, built
`dist/` under `/universe-sandbox/`, page ready in 76–334 s, codex opened and `dc-more` chosen through the DOM) at code
commit `0bc682c`: shots `s14-codex-dc-more-*` at 3840×2160, 1440×900, 1280×800 and 390×844; 69 cards listed with all
layers on; no console or page errors. Native select, keyboard and real-GPU gates remain open.

## Checkpoint 15: S14-C1–C3; SC40 (Doctrine and Covenants person roster)

Applied [supplementary-review-s14](https://github.com/mckayec/universe-sandbox/blob/c02a5cac5e1685ca860ddec2126418bae300aae5/docs/universes/packs/lds-standard-works/supplementary-review-s14.md) (c02a5ca), audited head 0b8c8f8:

- **S14-C1** SD0849 `DCM-dr14-gause-williams`: description replaced with the review's text (transferred appointment; March 15, 1832 / March 18, 1833; no "different documents").
- **S14-C2** SD0813 `DCM-dj03-salem-journey`: replaced with the review's text naming the four travelers.
- **S14-C3** SD0839 `DCM-dx16-civil-government`: replaced with the review's text stating the 134:12 clause and attributing it to the historical declaration.
- Reading 2 (optional): SD0848 locators now sit next to each role (Partridge 41:9, Whitney 72:8, Gilbert 53:4).
- Reading 3 (optional): SD0796 second sentence replaced with the review's "about four miles north of Fishing River in Clay County, Missouri; this does not establish an exact camp point." No coordinate.

**SC40 (138 SD rows, SD0860–SD0997)** as `DCM-dcp-<key>` person cards in `dc-more`, one per stable `dcp-` identity, from new `copy_dcp.py` (generated once from the accepted rows, then static like the other copy modules). Each card says where the person is named (the row's locators spelled out: "the heading and verses 1–5 of section 53; 57:6–10 …") and cites one official link per section (verses merged, so no repeated URL). The 102 rows whose constraint is the shared rule ("same named participant across cited DD/DR records; initials retained; no uncited kinship") get no extra sentence: the rule is honoured by drawing no link and expanding no initial. The other 36 rows' identity constraints become reader sentences (spelling kept as printed, distinct namesakes, signatory vs author, heading vs body forms). All 138 are coordinate-free, year-free `4/dc`.

Builder readings for ChatGPT:

1. **SD0864 Alvin Smith.** The row resolves the surname through JS—H 1:3–4, a layer-5 source. A `4/dc` card cannot cite it without exposing a later work, so the card says the surname is not printed in 137:5 and cites only 137:5–6. If the JS—H resolution should be visible, it belongs on a child gated at 5/pgp.
2. **Person cards are not a typed identity graph.** They are codex cards; cross-references to the DR/DE cards (e.g. "See “Jesse Gause and Frederick G. Williams”") are text, not clickable links, as in checkpoint 14 (reading 5).
3. **Short cards are intentional.** For the 102 shared-rule rows the accepted register supplies a name and locators only; no role, office or biography is added from memory. Roles come with SC41's DRE relation sets.
4. **SD0895/SD0919/SD0920 "council".** The rows say "124council"/"102council"; the cards say "named among the council in section 124" / "a member of the council in section 102" without naming which council, as the rows do.

Accounting: 997 SD rows imported, 274 pending: SC41–SC45 214 D&C rows (36 + 17 + 21 + 140), then SC46–SC54 60 rows (16 + 13 + 11 + 9 + 3 + 4 + 4). Before this checkpoint the split was SC40–SC45 352 / SC46–SC54 60 (total 412), not the 348 / 64 in the S14 handoff. `dc-more` now has 207 cards (69 + 138). Mapping 1,351 rows; 1,077 imported mapping rows.

Checks at the code commit: `pnpm format` clean, `pnpm check` 109/109 (new test "Supplementary checkpoint 15"; the SC35–SC39 test now excludes the person cards when counting its 69), `pnpm check:dist` OK, `pnpm test:pages` 13 pages × 2. Playwright (SwiftShader) captures of `dc-more` scrolled to the first person cards at 1440×900, 1280×800 and 390×844 (shots `s15-*`), no console errors; 207 cards and 138 "Named in" person cards counted in the DOM. **No 3840×2160 capture this checkpoint** (the 4K page did not reach a clickable codex within the run's time); next run.

## Supplementary checkpoint 16 — S15-C1/C2 and SC41 office and companion relations

Applied [supplementary-review-s15](https://github.com/mckayec/universe-sandbox/blob/a59bb3dcb070ce8602019e6c91f6435acc35fa2d/docs/universes/packs/lds-standard-works/supplementary-review-s15.md) (a59bb3d), audited head a136f70:

- **S15-C1** SD0864 `DCM-dcp-alvin-smith`: displayed title now **“Alvin”** (stable key unchanged), D&C-only description and 137:5–6 source kept at `4/dc`. No existing JS—History family view existed in the codex, so the accepted surname resolution is one child view directly after it, `DCM-jsh-alvin-family` “Alvin in Joseph Smith's family account”, gated `5/pgp`, with the review's minimum copy and the single source “Joseph Smith—History 1:3–4”. The related `DCM-dr06-joseph-alvin` title is now “Joseph Smith and his brother Alvin”. Test checks displayed titles, description and source labels, and that the child appears only with PGP on and group 5 reached (all-combined respects the gate).
- **S15-C2** SD0962 `DCM-dcp-robert-d-foster`: description replaced with the review's text; section 124 source label is now “D&C 124:115–118, 138” (one link).
- Optional readings 4 (council wording) and the Ashley wording were not applied this checkpoint; the new high-council card (SD1027) says it is the high council for the cornerstone of Zion and is not merged with the Kirtland high council of section 102.

**SC41 (36 SD rows, SD0998–SD1033)** as `DCM-dre<nnn>` typed-relation cards in `dc-more` from new `copy_dre.py`, one per DRE register row. Each card states the row's typed statements (companion pairs, travel parties, offices, reassigned charges, support duties) and turns its constraint into a reader sentence (e.g. section 52's thirteen pairs with Murdock/Hyrum by way of Detroit only; section 75's twelve pairs with the last seven undirected; eleven living Twelve plus Patten noted, no twelfth name; Aaron Johnson replacing Seymour Brunson; Roundy “if he will receive it”; Marsh resolved by footnote 2a; stock subscription not proof of payment and Foster's verse-115 contract kept separate, consistent with S15-C2). People are named, not re-created (their person cards are in the same tab); distinct offices and source contexts stay separate cards. All `4/dc`, coordinate- and year-free, one official link per section.

Builder readings for ChatGPT:

1. **SD1013 (78:9)** the row says “Smith/Rigdon/Whitney”; the card keeps the surnames as the row does rather than expanding Whitney's initials.
2. **SD1012** cites 75:6–17, 24–28, 30–36 (the family-support verses the row names) as one section-75 link.
3. **SD1002/SD1012/SD1033** expand the earlier SC39 summaries (“Mission companions in section 52/75”, “Organizers of the westward companies”) and cross-reference them in text; both kept, as the row constraint is “consolidate repeated people, not distinct offices or source contexts”.
4. **SD1022** “John C. Bennett → distribution/labor assistant” is worded “to help with its distribution and labor”, no more.

Accounting: 1,033 SD rows imported, 238 pending: SC42–SC45 178 (17 + 21 + 140), then SC46–SC54 60. 73 child views (72 + the Alvin JS—History view). `dc-more` now has 244 cards (69 + 138 + 36 + 1). 1,114 imported mapping rows.

Checks at code commit `60e4a2e`: `pnpm format` clean, `pnpm check` 110/110 (new test “Supplementary checkpoint 16”; the S3/S4 child count is now 73; the SC35–SC39 count excludes person, DRE and JS—History cards), `pnpm check:dist` 114 files OK, `pnpm test:pages` 13 pages × 2. Playwright (SwiftShader, built `dist/` under `/universe-sandbox/`, page ready in 18–63 s, codex opened and `dc-more` chosen through the DOM, CDP capture), scrolled to the first DRE card: shots `s16-codex-dc-more-*` at **3840×2160**, 1440×900, 1280×800 and 390×844, no console errors; 243 D&C-prefixed cards counted in the DOM at each size (plus the PGP-prefixed Alvin view). This also supplies the 4K `dc-more` capture missing from checkpoint 15.

## Supplementary checkpoint 17 — SC42 ancient participants and SC43 dated events

Reviewed [supplementary-review-s16](https://github.com/mckayec/universe-sandbox/blob/cce3057ac901b8b69fff7343c502b71347029eea/docs/universes/packs/lds-standard-works/supplementary-review-s16.md) (cce3057), audited head 1a6b94e: S15-C1/C2 closed, no new required correction. **Optional S16-H1 applied:** the nine tracked `supplementary-build/__pycache__/*.pyc` files are removed and `__pycache__/` is ignored; generation was run with `PYTHONDONTWRITEBYTECODE=1`, and the baseline (checkpoint 16 copy) regenerated byte-identical before any new copy was added.

**SC42 (17 SD rows, SD1034–SD1050)** as `DCM-dca-` cards in `dc-more` from new `copy_dca.py`: one D&C source view per row of the "Ancient and visionary participants" table, naming the figures and stating each row's constraint as a sentence (John the Beloved not John the Baptist or John Whitmer; the two Eliases and Elijah kept apart, the section 27/110 co-reference left open; Gabriel not merged with Noah; Abel's brother unnamed in 84:16; Enoch's 430/365 years both kept; personal ancestors vs collective houses; the section 84 line not merged with similarly named biblical figures; Aaron's kinship to Moses resting on Exodus 4:14; no claim every participant in section 132's examples consented; the Transfiguration Elias kept separate from the Elias of 110). These are source views of identities that already exist in earlier layers, not new people, and no `dca-` key is rendered as a person card. All `4/dc`, coordinate-free.

**SC43 (21 SD rows, SD1051–SD1071)** as `DCM-de06b`/`DCM-de09`…`DCM-de28` cards: each begins with the accepted exact display sentence, under the accepted exact title, then gives the row's date precision, place (as its pin or named setting, no new point) and limit. DE06b is the April 3 vision only and cross-refers to the existing combined DE06 card; DE09 uses the Carthage Jail pin; DE28 is the statement card only and points to the existing “Manifesto accepted” (RE14) for the acceptance.

Builder readings for ChatGPT:

1. **SD1045 Sarai alias.** The row puts the Sarai alias on Abraham 2:2 (Pearl of Great Price). Citing it on a `4/dc` card would show a group-5 source early, so it is a child view `DCM-dca-sarai-abraham` gated `5/pgp` directly after the section 132 card (the S15-C1 Alvin pattern); Genesis 17:15, 19 is cited on the D&C card itself.
2. **SD1063 “Emma's concern in heading”.** The row lists this as participant metadata, but the builder could not confirm Emma in the current section 89 heading without fetching it, and the accepted display sentence does not mention her, so the card leaves her out. Please confirm or supply the wording.
3. **SD1044 / SD1041 / SD1045 OT sources.** Exodus 4:14, Genesis 5 and Genesis 17 are cited on the D&C cards (earlier-layer sources, as SD0817 already does with Genesis 5); `copy_dc.S()` gained an Exodus path.
4. **Settings read from the row's place codes:** SD1056 “given in New York with Ohio as the destination region” (P12 source context), SD1061 “Hiram”/“Kirtland; no room given” (DP01/DP13), SD1066 “for men departing Kirtland” (DP13 departure), SD1058 “given at Kirtland for the community at Thompson” (DP13/DP17). SD1053 says “a different setting from the grove” for “distinguish P11 grove”.
5. **SD1064** names the building committee from DRE094 (Hyrum Smith, Reynolds Cahoon, Jared Carter; 94:13–15) on the event card rather than creating a separate relation card, since DRE094 is not an SC41 row.

Accounting: 1,071 SD rows imported, 200 pending: SC45 140, then SC46–SC54 60 (16 + 13 + 11 + 9 + 3 + 4 + 4). 74 child views (+ the Sarai view). `dc-more` now has 283 cards (244 + 17 + 21 + 1). 1,153 imported mapping rows.

Checks at the code commit: `pnpm format` clean, `pnpm check` 111/111 (new test “Supplementary checkpoint 17”; the S3/S4 child count is now 74; the SC35–SC39 count now also excludes the SC42/SC43 keys), `pnpm check:dist` 114 files OK, `pnpm test:pages` 13 pages × 2. Playwright (SwiftShader, built `dist/` served under `/universe-sandbox/`, page ready in 30–115 s, codex opened and `dc-more` chosen through the DOM, CDP capture), scrolled to the first SC42 card: shots `s17-codex-dc-more-*` at **3840×2160**, 1440×900, 1280×800 and 390×844, no console errors; 283 cards in the DOM at each size, including “Vision in the Kirtland Temple” and the Sarai view (all books shown).

## Supplementary checkpoint 18 — S17-C1/C2 and SC45 section dossiers DD001–DD070

Reviewed [supplementary-review-s17](https://github.com/mckayec/universe-sandbox/blob/58328be138db4fa3ccf941048a7cd057ef5291c3/docs/universes/packs/lds-standard-works/supplementary-review-s17.md) (4696649, count fix 58328be), audited head 1b55cc8. Generation run with `PYTHONDONTWRITEBYTECODE=1`.

- **S17-C1** SD1035 `DCM-dca-john-peter-james`: description replaced with the review's text (the Lord speaks with John the Beloved and then addresses Peter; no John–Peter dialogue). Key, title, sources and `4/dc` gate unchanged.
- **S17-C2** SD1063 `DCM-de20-word-of-wisdom`: the review's sentence inserted after the Kirtland/date sentence (“The current section heading links Joseph Smith’s inquiry to tobacco use at the meetings and the concern it caused his wife, Emma Smith.”); heading citation, gate and the 1833/later-observance distinction unchanged.
- **Optional, applied:** the Sarai child `DCM-dca-sarai-abraham` gains a second source “Genesis 17:15” (`ot/gen/17`); SD1041 now reads “lineage, ordination, offering-comparison and vision contexts”; SD1062 now reads “The heading dates section 88 to December 27–28, 1832, and January 3, 1833, at Kirtland; verses 117–141 give these instructions. The participants are not named.”

**SC45 dossiers DD001–DD070 (SD1072–SD1141)** as `DCM-dd<nnn>-` cards in `dc-more` from new `copy_dd.py`, in section order after the SC43 cards. One card per dossier row, titled “Section N: …”, a cited reference for that section and not a new event, place or person. Its text is the section's coverage-ledger row (coverage-dc.md “Coverage ledger”) in reader sentences: the dated setting (with the ledger's precision: month only, “probably”, two dates, heading-supplied dates), every person the ledger row names, the atlas findings, and the row's exclusion or precision boundary as a plain sentence. “See also” names the existing cards the matrix row reuses (DX, DR, DE and DP01/DP03 by their displayed titles; build.py asserts each title against the pack). Source: the one official section link. All `4/dc`, coordinate-free, no date fields.

Builder readings for ChatGPT:

1. **Matrix place codes without their own card** (DP13–DP32, P12, RP01; DJ01, RE/RC/RJ/E09 restoration ids) are not given a See-also; the setting is named in the text as the ledger names it (Harmony, Fayette, Kirtland, Thompson, McIlwaine’s Bend, Chariton …). DD013 names the existing “Harmony / Priesthood Restoration Site” pin for its RE01–02/RC01 reuse.
2. **Full names.** Where the ledger gives surnames only (e.g. DD052's pairs, “Copley”, “Corrill”, “Coe”), the full name is the one already displayed on accepted cards (SC40 person cards, DR16/DR17); every full name used was checked to occur in the pack before this checkpoint. No name was added that the ledger row does not name.
3. **DD007** follows the S17-C1 reading (the Lord speaks with John and then addresses Peter), not the ledger's shorthand “John and Peter appear”.
4. **DD057** keeps the matrix's “temple site distinct” as a sentence (the temple place is distinct from the town); **DD049** keeps the matrix's “exact site unresolved” for the Shaker community; **DD032** keeps “proposed western mission, endpoints unresolved”.
5. **“Named roles retained in DD; see person-resolution gate”** is honoured by naming the people in the dossier text only; no dossier resolves an identity or creates a person card.
6. S17's note on **SD1059 / DD072** stands: section 72's distinct content arrives with DD072 in the next tranche.

Accounting: 1,141 SD rows imported, 130 pending: SC45 70 (DD071–DD138, DDO1, DDO2), then SC46–SC54 60 (16 + 13 + 11 + 9 + 3 + 4 + 4). 74 child views. `dc-more` now has 353 cards (283 + 70). 1,223 imported mapping rows.

Checks at the code commit: `pnpm format` clean, `pnpm check` 112/112 (new test “Supplementary checkpoint 18”; the SC35–SC39 count also excludes `dd` keys; the checkpoint 17 test now asserts no SC42/SC43 row pending instead of the overall pending count), `pnpm check:dist` 114 files OK, `pnpm test:pages` 13 pages × 2, coverage/source-witness/reference-disposition validators pass.


Playwright (SwiftShader, built `dist/` served under `/universe-sandbox/`, page ready in 121–347 s, codex opened and `dc-more` chosen through the DOM, CDP capture), scrolled to the first dossier card: shots `s18-codex-dc-more-*` at **3840×2160**, 1440×900, 1280×800 and 390×844, no console errors; 353 cards in the DOM at each size, and the section 7 dossier carries the S17-C1 reading. Keyboard, native-select, real-GPU and final same-head rendered evidence remain open.

## Supplementary checkpoint 19 — S18-C1–C3 and SC45 dossiers DD071–DD138, DDO1–DDO2

Reviewed [supplementary-review-s18](https://github.com/mckayec/universe-sandbox/blob/e85b2b254120e0f85aa49f8fe53e15d7164d1eec/docs/universes/packs/lds-standard-works/supplementary-review-s18.md) (e85b2b2), audited head e1d5650. Code commit `c95e948`. Generation run with `PYTHONDONTWRITEBYTECODE=1` against the e85b2b2 register.

- **S18-C1** SD1123 `DCM-dd052-missouri-companions`: “Pairs:” → “Assignments include:”; “Edward Partridge and Martin Harris to join Smith” → “Edward Partridge and Martin Harris to travel with Joseph Smith and Sidney Rigdon as one party”. Every other assignment, the Detroit qualifier, the eastern assignment and the instruction-versus-itinerary sentence unchanged.
- **S18-C2** SD1107 `DCM-dd036-edward-partridge`: the review's text (called to preach; verse 2 promises the laying on of hands through Sidney Rigdon and the Holy Ghost; priesthood and mission instructions); date, place, source and the no-inferred-office boundary kept. SD1125 `DCM-dd054-colesville-onward`: title “Section 54: The Colesville migrants directed onward” and the review's two sentences (heading identifies Newel Knight as leader at Thompson; the revelation commands the journey and does not record completed departure or arrival); failed-settlement boundary kept. Optional DD060 refinement applied (“Edward Partridge is directed to supply travel money”; “the others are to preach”).
- **S18-C3** SD1141 `DCM-dd070-publication-stewards`: the review's sentence naming the six stewards (70:1–5) **and** “Revelation publication assigned” in See also. No new person or role record.

**SC45 dossiers DD071–DD138 (SD1142–SD1209), DDO1 (SD1210) and DDO2 (SD1211)** as `DCM-dd<nnn>-` and `DCM-ddo<n>-` cards in `dc-more` from new `copy_dd2.py` (imported by `copy_dd.py`), after DD070. Same rules as checkpoint 18; Official Declarations are titled “Official Declaration N: …”, open “Doctrine and Covenants — Official Declaration N.” and cite `dc-testament/od/N`. SC45 is no longer a partial family (`PARTIAL = set()`): all 140 dossiers are imported. Commands, calls and promises are written as instructions (“is to”, “is directed”), following the S18-C2 rule, unless the ledger records completion. DD072 carries its three revelations (appointment, duties, certificates) and the regional-office boundary (S18 builder reading 6).

Builder readings for ChatGPT:

1. **See also beyond the matrix.** Besides each matrix row's DP/DE/DJ/DX/DR ids, dossiers name the DE event cards that “Document-to-event decisions” maps to the section (72→DE16, 81/90→DE18, 88→DE19, 89→DE20, 94–95→DE21, 115/118→DE22, 117→DE23, 119–120→DE24, 127–128→DE27, 130–131→DE25, 134→DE26, OD1→DE28), DE01/DR17 on DD079/DD080 (“66/68/75/79–80 commissions resolve through DE01”), DE06 for DD109 (the dedication alias) and DE06b for DD110. Restoration-layer reuse (RP04 Liberty Jail, RE07 “Letters from Liberty”, RE14 “Manifesto accepted”, the Kirtland Temple pin, the RE15/16 vision cards, Winter Quarters) is named in the text, not in See also. DD085 names Independence in text only (matrix gives DP13). build.py asserts every See-also title against the pack, and the new test asserts each one names a `dc-more` card.
2. **DD104, Martin Harris's stewardship.** The ledger's “Harris exchanged Johnson lot” is rendered neutrally as “a lot involved in an exchange with John Johnson”; please confirm or supply the exact 104:24 wording.
3. **DD124 stock.** The ledger's “stock 50–15000 dollars” is rendered “Stock is set from $50 to $15,000”; please confirm against 124:64–72 whether these are the share price and per-person limit, and supply wording if needed.
4. **DD112.** “Marsh is to keep his house in Zion while ministering among the mountains and the nations” follows the ledger; the ledger is ambiguous whether the ministering is Marsh's or the Twelve's.
5. **Names.** Full names come from the resolved roster (DRE075, DRE102, DRE103, DRE118, DRE124a–k, DRE136, `dcp-` table); DD075 lists all twelve DRE075 pairs (five with directions, seven without), so the ledger's “companionship graph pending body extraction” note is replaced by the resolved list, and its verses 1–22/23–36 separation is kept. DD137 leaves Joseph's mother unnamed (DRE137). DD135 does not assign the announcement to Taylor alone (DRE135). DDO2 does not attribute the anonymous heading to the signatories (DREOD2).
6. **Wording kept from the ledger that may want a recheck:** DD090 “Joseph Smith Sr. and Rigdon are to remain”; DD105 “an endowment in Kirtland is anticipated”; DD122 “Christ’s descent”; DD138 “Pontus, Galatia and Cappadocia come from Peter’s epistle”.

Accounting: **1,211 SD rows imported, 60 pending** (SC46 16, SC47 13, SC48 11, SC50 9, SC52 3, SC53 4, SC54 4). 74 child views. `dc-more` now has 423 cards (353 + 70). 1,293 imported mapping rows. Five prior cards changed (DD036, DD052, DD054, DD060, DD070); no other prior card or engine file changed.

Checks at the code commit: `pnpm format` clean, `pnpm check` 113/113 (new test “Supplementary checkpoint 19”; the checkpoint 18 test now covers all 140 dossiers and 60 pending; the SC35–SC39 count also excludes `ddo` keys), `pnpm check:dist` 114 files OK, `pnpm test:pages` 13 pages × 2. `validate-coverage.py` and `validate-reference-disposition.py` pass; `validate-source-witnesses.py` reports the same missing private-archive capture files as the baseline (the archive is not in this environment), with manifest metadata unchanged.

Playwright (SwiftShader, built `dist/` served under `/universe-sandbox/`, page ready in 25–83 s, codex opened and `dc-more` chosen through the DOM, CDP capture), scrolled to the Section 71 dossier: shots `s19-codex-dc-more-*` at **3840×2160**, 1440×900, 1280×800 and 390×844, no console errors, no card or page horizontal overflow; 423 cards in the DOM at each size, and “Section 71:”, “Section 138:”, “Official Declaration 2:” and the DD052 “Assignments include:” text all present. The 4K capture also shows the corrected DD070 with its six stewards. Keyboard, native-select, real-GPU and final same-head rendered evidence remain open.

## Checkpoint 20: S19-C1–C4, DD104 wording, SC46 and SC47 (Pearl of Great Price)

Code commit `be4c60eab72a4db26d81d18e4f977688016721ca`. Applies supplementary-review-s19 (379d9be) and its evidence
follow-up (07eaa45), then starts the Pearl of Great Price families in a new codex tab `pgp-more` (“More Pearl of Great
Price records and relationships”, gate `5/pgp`, no coordinates, routes or years).

* **S19-C1** (SD1208, `copy_dd2.py` section 137): “A vision including Alvin Smith:” → “A vision including Joseph
  Smith’s brother Alvin:”. Key, D&C 137 source and `4/dc` gate unchanged; `DCM-jsh-alvin-family` stays the only
  surname view, at `5/pgp`, unchanged.
* **S19-C2** (SD1195): “ward presidents are unnamed” → “the teachers’ and deacons’ presidents and the stake president,
  with their counselors, are not named in verse 142”. The priests’ leader and Roundy’s conditional appointment kept.
* **S19-C3** (SD1210): DDO1 keeps its wording and now cites Official Declaration 1 and “Church historical essay: The
  Manifesto and the End of Plural Marriage — After the Manifesto” (the given URL), added in `copy_dd.py` for OD1 only.
* **S19-C4** (SD1195): “Stock is set from $50 to $15,000” → “The instructions set a minimum of $50 per share and a
  maximum total subscription of $15,000 from any one person”, followed by the unchanged semicolon and subscriber list.
* **DD104 refinement** (SD1175): “Martin Harris, the lot John Johnson had obtained in exchange for his former
  inheritance”, as supplied.
* **SC46** (SD1212–SD1227): one `PGM-qgNN-` card per QG row via new `copy_pgp.py`; row text in reader sentences with
  each row’s limit kept as a sentence (homonyms: Cain’s and Seth’s Enoch and Lamech, Cainan person/land, the two
  Enoses; reported speech for the sister instruction; no numeric dates; the existing journey/place cards named in
  “See also”, which build.py now checks against every card name in the pack). Sources are the row locators as
  official chapter links; QG15/QG16 keep their own essay/introduction links, and QG15 adds Moses 7:8, 22 and Abraham
  1:21–27 as paired. QG14 carries the JS—History subranges, the December-arrival and April 7, 1829 limits (audit
  correction 4), and a child `PGM-qg14-cowdery-1834` for the appended 1834 Cowdery reminiscence (SC47 rule: separately
  attributed, not verse 76).
* **SC47** (SD1228–SD1240): consolidated per the row rule into one card, `PGM-aof-1-13` “Articles of Faith 1–13, article
  by article”, keeping each article’s clause and naming the existing PC06 / C06 / PC07 / C07 / PC08 view for it. The
  12 consolidated rows keep their own `Articles of Faith 1:N` locators in the mapping; the card cites 1:1–13 once
  (new optional `MERGE_NO_SRC` in the copy module).

Builder readings for ChatGPT:

1. SC47 says “consolidate … under PC06”. PC06–PC08 are hand-written cards outside the generated blocks, so the 13
   clauses sit in one generated card that points to them rather than being written into PC06 itself. If the
   reviewer wants the clauses inside PC06, that is a hand edit next checkpoint.
2. QG04 names the occupations (tents and cattle, music, metalworking) from SC48’s row SD1242, which assigns that
   context to QG04; SC48’s typed relations themselves are not yet built.
3. QG05 adds “Cainan the person is not the land of Cainan, and this Enos is not the Book of Mormon writer” from SD1243
   and audit correction 2; QG04 adds “this Enoch is not the Enoch of Seth’s line” from the same correction.
4. QG12 says “the evidence limit on the papyri still applies” and points to “Book of Abraham: Church account of
   papyri” rather than restating pgp-inventory.md’s limit.

Counts: 1,240 SD rows imported (1,211 + 29), **31 pending** (SC48 11, SC50 9, SC52 3, SC53 4, SC54 4); 75 child views;
1,323 imported mapping rows. `pgp-more` has 18 cards.

Checks at the code commit: `pnpm format` clean, `pnpm check` 115/115 (new tests “Supplementary checkpoint 20: S19-C1–C4”
and “… SC46 QG01–QG16 and SC47”; child count 75; the OD1 source assertion allows the S19-C3 essay), `pnpm check:dist`
OK, `pnpm test:pages` 13 pages × 2. Regeneration from the accepted register reproduces the pack byte-for-byte after
Prettier. Playwright (SwiftShader, built `dist/` served under `/universe-sandbox/`, page ready in 28–112 s, codex
opened and `pgp-more` chosen through the DOM, CDP capture): shots `s20-codex-pgp-more-*` at **3840×2160**, 1440×900,
1280×800 and 390×844, no console errors, no card or page horizontal overflow, 18 cards in the DOM at each size with
the Articles card and the Cowdery view present. Keyboard, native-select, real-GPU and final same-head rendered
evidence remain open.

## Checkpoint 21: S20-C1, S20-C2, PC06 pointer, SC49 receipt entry, SC48 (Pearl of Great Price identities)

Code commit `71794a3f5eab02dc9435a909d23814784eb8ec54`. Applies supplementary-review-s20 (3074715) and its evidence
follow-up (42e5f91).

* **S20-C1** (SD1218, `PGM-qg07-lamech-noah`): the first two sentences replaced with the supplied text — Methuselah as
  Lamech’s father and Lamech as Noah’s; Japheth at Noah’s 450, Shem 42 years later (492 by addition), Ham at 500; the
  account’s reported ages, not harmonized calendar dates. Cainite/Sethite distinction, source, key and `5/pgp` gate
  kept.
* **S20-C2** (PC05, hand-written card): added the supplied sentence on facsimile-explanation differences, funerary
  fragments and vignette disagreement; PC05 already cites the Church essay, so no source added. QG12 keeps its
  See-also to “Book of Abraham: Church account of papyri”.
* **PC06 pointer**: added “For the article-by-article overview, see ‘Articles of Faith 1–13, article by article’.” It is
  text, not a clickable link; the codex has no typed-link navigation for it.
* **SC49 receipt entry**: restored in the progress table above as zero SD rows with mandatory prose, integration pending.
  No SC49 content was built this checkpoint.
* **SC48** (SD1241–SD1251): ten `PGM-id` cards in `pgp-more`, one per row, each keeping the row’s identity constraint
  as plain sentences: Cain/Abel and the Cainite chain with “Master Mahan” as a title and Cain’s unnamed wife (id01);
  Lamech’s household without asserting every sibling’s mother (id02); the Sethite chain with Cainan person/land,
  Enos and Mahijah/Mahujah kept apart (id03); Abraham 2’s family with no Haran→Lot edge (id04); Onitah’s unnamed
  daughters and the unnamed priest (id05); the two Egyptus statements and the two Pharaohs kept apart, wisdom and
  priesthood both kept (id06); Facsimile 3’s Shulem, Olimlah and “Prince of Pharaoh” (id07); the gods of Abraham 1,
  Libnah not the town, Rahleenos as the text’s gloss (id08); Shinehah/Olea/Kokob/Kokaubeam glosses and the Urim and
  Thummim limit (id09); the facsimile vocabulary index (id10). **SD1244** (Noah’s sons’ ages) is mapped to
  QG07 per S20-C1’s acceptance (“consolidated into SD1218 card”), keeping its own `Moses 8:12` locator in the mapping;
  QG07’s card cites Moses 8:5–13 once (`MERGE_NO_SRC`).

Builder readings for ChatGPT:

1. **id10 (SD1251)** lists the ten terms with their caption ranges and links the published explanations, but does not
   restate each term’s individual gloss: the accepted row and research name the terms and caption ranges, not the
   per-term glosses. If the reviewer wants the glosses on the card, please supply the exact wording.
2. **id03 (SD1243)** says the ages are the account’s reported figures but does not tabulate the Seth-line ages; only
   Noah’s ages (QG07) are in the accepted payload. Same request if they are wanted.
3. **id09 (SD1250)** takes the sun/moon/star/stars glosses from coverage-pgp.md:23 and the row; it names Kolob’s
   “ordering of time” from the same line, and points to “Olaha Shinehah” as the place it is not merged with.
4. **id06 (SD1247)** paraphrases verse 23 from the row (“a woman … daughter of Ham and daughter of Egyptus”) without
   quoting the Chaldean gloss, which the accepted row does not include.

Counts: **1,251 SD rows imported, 20 pending** (SC50 9, SC52 3, SC53 4, SC54 4); 75 child views; 1,334 imported
mapping rows. `pgp-more` has 28 cards. SC49 and other zero-row prose obligations remain open as above.

Checks at the code commit: `pnpm format` clean, `pnpm check` 116/116 (new test “Supplementary checkpoint 21”; the
checkpoint 18–19 and 20 count assertions updated to 20 pending / 28 cards), `pnpm check:dist` OK, `pnpm test:pages` 13
pages × 2, coverage and reference-disposition validators pass (the source-witness validator needs ChatGPT’s local
capture files and fails identically at the parent). Regenerating from the accepted register (PR34 3729dbb) then
running Prettier leaves the pack unchanged. Playwright (SwiftShader, built `dist/` under `/universe-sandbox/`, page
ready in 23–94 s, codex opened and `pgp-more` chosen through the DOM, list scrolled to the first SC48 card, CDP
capture): shots `s21-codex-pgp-more-*` at **3840×2160**, 1440×900, 1280×800 and 390×844; 28 cards present at each
size, QG07’s ages and the id cards in the DOM, no page horizontal overflow, no console errors. Keyboard, native-select,
real-GPU and final same-head rendered evidence remain open.

## Checkpoint 22: S21-C1, S21-C2, id10 glosses, SC49, SC50, SC51

Code commit `d42c27b9276a04469e8b1ad3adc4fe024845e5e8`. Applies supplementary-review-s21 (1558524, with 4cbf130).

* **S21-C1** (SD1243, `PGM-id03-seth-line`): the nine parent→child ages as reader prose in the card itself (Adam 130
  at Seth, 6:10; Seth 105 at Enos, 6:13; Enos 90 at Cainan, 6:17; Cainan 70 at Mahalaleel, 6:19; Mahalaleel 65 at
  Jared, 6:20; Jared 162 at Enoch, 6:21; Enoch 65 at Methuselah, 6:25; Methuselah 187 at Lamech, 8:5; Lamech 182 at
  Noah, 8:8–9), stated as the account's reported ages with no calendar years derived. Homonym safeguards, QG07
  pointer, sources and `5/pgp` gate unchanged.
* **S21-C2** (SD1245): “Terah is Abraham’s father; Sarai is Abraham’s wife;” replaces the ambiguous clause.
* **id10 glosses** (SD1251, optional): the review's attributed summary added before the existing limits sentence,
  with “this is not a complete glossary”; caption locators kept.
* **SC49** (coverage-pgp.md:103–112, zero SD rows): six `5/pgp` child views of QG14 (SD1225) in `pgp-more`, after the
  Cowdery 1834 view, mapped as `child of SD1225`. Crosswalk, one target per bullet/paragraph:

  | SC49 source text | Target | Retained constraints |
  |---|---|---|
  | Section preamble (narrator's relationships; dcp-key reuse; neutral visibility from 3) | every `PGM-jsh-*` card; FM04/FM05 (3/bom) | “narrator’s reported relationships, not corroborated civil records”; witnesses named at 3 through FM04/FM05 and the two SC51 person cards; D&C person cards keep their 4/dc gate (builder reading 1) |
  | JS—H 1:3–4, 7 family | `PGM-jsh-family` | Lucy Mack Smith vs. daughter Lucy; Solomon Mack; Samuel Harrison spelling; Presbyterian membership only for Lucy, Hyrum, Samuel Harrison, Sophronia |
  | JS—H 1:56–58 | `PGM-jsh-harmony-marriage` | Josiah Stoal (source spelling, no Stowell alias), failed silver-mine search kept, Isaac Hale/Emma, January 18, 1827 at Squire Tarbill's house in South Bainbridge, no first name |
  | JS—H 1:61–65 | `PGM-jsh-harris-anthon` | financial help and the New York trip as separate acts; Anthon/Mitchell only in Harris's account as relayed; certification not presented as verified; Joseph not routed |
  | JS—H 1:30–54, 59–60 | `PGM-jsh-moroni-material` | distinct objects/episodes, no extra pins; 1827 receipt ≠ 1823 visit; 1838 narration ≠ return date |
  | JS—H 1:66–75 | `PGM-jsh-baptism` | scribe; reciprocal baptism; Peter, James and John directing, not present; Aaron/Levi/Melchizedek as terms; future first/second elder offices, no church organized in May 1829 |
  | Quoted/compared referents; appended Cowdery 1834 note | `PGM-jsh-text-referents`; `PGM-qg14-cowdery-1834` | no 1820s encounter events; 1834 reminiscence separate, not verse 76 |

* **SC50** (SD1252–SD1260): each row consolidated into its existing primary card FM01–FM09 in `reference-views`, as
  the rule requires (no nine new entities). The generator (new `copy_fm.py`; `build.py` rewrites only the `desc` of
  those nine cards, idempotently) keeps each card's first sentence and adds the row's retained context: FM01 Palmyra
  marker identity, year only, month-specific history kept separate, not the 1847 arrival; FM02 abridge/seal/address
  as distinct relations, translator credit, no site or date; FM03 editorial teaching, not a DNA finding or
  single-origin claim, Cumorah mention not a location for Mormon 6; FM04 signs/reports seeing, no venue/day/pin;
  FM05 no metallurgical test, no date/venue, signatory role only; FM06 same episodes, not additional visits,
  distinct actions, no roads, no survey coordinate, May 2, 1838 as reporting vantage; FM07 editorial provenance, about
  421 as editorial attribution, italic headings as study helps; FM08 1835/1831 testimonies distinct, Lectures on Faith
  as history, section 7 attribution kept; FM09 Richards as compiler and mission president, 1976/1979/1981 milestones
  distinct, Nauvoo periodical dates do not date Abraham's journey. Gates unchanged (FM01–07 3/bom, FM08 4/dc,
  FM09 5/pgp); the 3/bom cards name no later work.
* **SC51** (frontmatter-inventory.md:17–24, zero SD rows): new neutral cards `fm-person-christian-whitmer` and
  `fm-person-jacob-whitmer` (3/bom, signatory role only, no kinship from surname) in `bom-more`; paragraph 19 →
  FM04/FM05 + the two cards, paragraph 21 → FM01 (Palmyra pin comment already separates RE04 on the D&C event),
  paragraph 23 → FM06/FM03. Three mapping rows `,SC51,frontmatter-inventory.md:NN,` record this.

Builder readings for ChatGPT:

1. The binding note says neutral person entities begin at 3 even with `dcp-` keys. The codex has no separate person
   entity: the D&C person cards (Oliver Cowdery, David Whitmer, Martin Harris, Hyrum Smith, …) carry D&C-specific
   copy, so they keep `4/dc`, and the neutral names are visible at 3 through FM04/FM05 and the two new cards. Moving
   the D&C cards to 3 would expose D&C detail early; please confirm this reading.
2. The SC49 children cite the D&C person cards and PP07/PE09 in See-also; their own gate is `5/pgp`.
3. FM01–FM07 avoid naming Joseph Smith—History or the Doctrine and Covenants (“later works”, “Joseph Smith’s longer
   history”) so the 3/bom view does not leak later-layer titles.

Counts: **1,260 SD rows imported, 11 pending** (SC52 3, SC53 4, SC54 4); 81 child views; 1,354 imported mapping rows.
`pgp-more` 34 cards, `bom-more` 120, `reference-views` 20.

Checks at the code commit: `pnpm format` clean, `pnpm check` 117/117 (new test “Supplementary checkpoint 22”; the
child-view, pending and pgp-more counts in earlier tests updated to 81 / 11 / 34), `pnpm check:dist` OK, `pnpm
test:pages` 13 pages × 2, coverage validator `errors: []`, reference-disposition validator `missing []`. Regenerating
twice from the accepted register (9cc874c) is byte-identical. Playwright (SwiftShader, built `dist/` under
`/universe-sandbox/`, ready in 30–100 s, codex opened and tab chosen through `#cxPick`, list scrolled to the first new
card, CDP capture): shots `s22-codex-{pgp-more,reference-views,bom-more}-*` at **3840×2160**, 1440×900, 1280×800
and 390×844; every target card found, no page horizontal overflow, no console errors. Inspected 1440 pgp-more,
390 and 4K reference-views. Keyboard, native-select, real-GPU and final same-head rendered evidence remain open.

## Checkpoint 23: S22-C1, owner display naming, SC52–SC54

Code commit `a440133576437028b88dd4d2888bf91e22eccf8d`. Applies supplementary-review-s22 (9dcd550) and the owner naming
direction recorded in HANDOFF_PLAN.md (2026-11-02, commit 9ac99a1).

* **S22-C1**: `copy_fm.ADDED_SOURCES` gives FM08 **D&C 7, historical heading**
  (`…/dc-testament/dc/7?lang=eng`) and FM09 **D&C introduction, 1981 edition** (`…/dc-testament/introduction?lang=eng`).
  `build.py` appends each to the card's `src` once (existing sources kept first; idempotent) and adds the labels to the
  SD1259/SD1260 mapping locators. Gates unchanged (FM08 4/dc, FM09 5/pgp); no card duplicated.
* **Owner display naming**: registry title, `meta.title` and `meta.series` are “The Church of Jesus Christ of Latter-day
  Saints · Standard Works” (also the sandbox's `src/universe-packs.ts` label); splash, `canvasLabel` and the intro text
  describe the scriptures / standard works of The Church of Jesus Christ of Latter-day Saints. Targeted edits only:
  historical, quoted and descriptive uses (RP08 “displaced Latter-day Saints”, NTC-other-sheep, RC01, the disclaimer)
  are unchanged; ids and the `lds-standard-works` pack id are unchanged. Wrapping checked: splash `h1` fits at 390
  (six lines, 358 px of 390) and in one line at 1280/1440/3840; header fits at 1280; document title equals the label.
* **SC52** (SD1261–SD1263, retain-attributed-model-comparison): three new `bom-more` cards at 3/bom, each opening
  “Proposed geography model, attributed —”: Sorenson's limited Mesoamerican setting with Wunderli's criticism (G3, G4);
  Heartland with Hedges/Meldrum, supporters' premises and critics, the FAIR-described Niagara variant and Hedges's later
  Lake Michigan corridor reading kept separate (G5, G6); Orson Pratt's historical hemispheric model with the
  interpretive disagreement (G5, G4). No geometry, pins, ranking or endorsement; sources are the G URLs only.
* **SC53/SC54** (SD1264–SD1271): reuse of existing identities, no new cards. SD1264 → BE02 (burial is not death
  location; unlocated, no grave pin); SD1265 → BE03 (coast, mountain, sea distinct; Arabian Bountiful ≠ Bountiful
  (Americas), See also both); SD1266 → SD0002/BXP02 Irreantum (“many waters”; no modern ocean from the verse); SD1267 →
  BJ01 (promised land reached; no landing port or ocean track); SD1268–SD1271 → BJ11 (great tower, no excavated tower
  or date; Nimrod relative only; Moriancumer four-year camp is not the crossing; Shelem a separate excursion, no modern
  mountain). New `copy_geo.py` rewrites only those descs (key, name, gate, sources unchanged; their sources already cite
  the rows' chapters). SD0002's copy gained one clause.

Counts: **1,271 SD rows imported, 0 pending**; 81 child views; 1,365 imported mapping rows (41 SD rows consolidated).
`bom-more` 123 cards.

**Not done in this checkpoint (still open, Claude keeps ownership):** the 12-person shared-identity / source-view
crosswalk for the SC49/SC51 front-matter identities (S22 builder answer 1); live navigation/filter behavior or a
documented limitation for See-also links across layers (answer 2); broader BA07 identity/typed-link/timeline/source
integration. Zero pending imports does not close those. Keyboard, native-select, real-GPU and final same-head
rendered evidence also remain open.

Checks at the code commit: `pnpm format` clean; `pnpm check` 119/119 (new tests “Supplementary checkpoint 23” ×2;
pending counts in two earlier tests now 0); `pnpm check:dist` OK; `pnpm test:pages` 13 pages × 2; coverage validator
`errors: []`; reference-disposition validator `missing []`; regenerating twice from the accepted register (9cc874c) is
byte-identical. The local browser smoke test (`pnpm test:browser`) did not finish within 10 minutes under SwiftShader in
this sandbox; CI runs it. Playwright (SwiftShader, built `dist/` under `/universe-sandbox/`, codex tab chosen through
`#cxPick`, list scrolled to the target card, CDP capture): `s23-codex-{bom-more,bom-geography,reference-views}-*` at
3840×2160, 1440×900, 1280×800 and 390×844, plus `s23-splash-{390x844,1280x800}`; every target card found, no page
horizontal overflow, no console errors at 1280/1440/390 (the 3840 run's report was cut off by the time limit after its
shots were written). Inspected: 4K bom-more and splash, 390 splash and bom-geography, 1280 reference-views and header.
