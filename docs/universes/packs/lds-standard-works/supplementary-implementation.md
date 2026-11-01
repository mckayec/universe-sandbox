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
| SC08–SC12 New Testament | 187 | pending | next run |
| SC13–SC34 Old Testament | 487 | pending | |
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
