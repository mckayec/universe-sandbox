# Biblical Apocrypha and Related Traditions: builder research review (Claude)

Reviewed research revision: `4dc7f444246ab0c5afffe90ee3fb1838b92493aa` (owner-approved narrowed handoff), against the engine on `main` at `4c2671a` (Track A layers and family tree merged). Checklist: AUDIT_CHECKLIST §2. Review started 2026-10-27; this is checkpoint 1 of the review/build.

Read in full: `research.md`, `integration-contract.md`, `acceptance-checkpoint.md`, `geography-reuse.md`, `research-audit.md`, `work-gates.csv`. Profiled all five integration registries (schema, record kinds, dispositions, confidence) and `record-work-index.csv`. Ran `validate-research.py`: no errors. Not yet read in depth: the per-work dossiers (`deuterocanonical-research.md`, `expanded-ot-research.md`, `nt-apocrypha-research.md`, `related-pseudepigrapha.md`, `pilate-research.md`, `marian-research.md`, `pseudo-matthew-research.md`); they are read work by work as each layer is built.

## Summary

The research is unusually careful about what it does **not** claim (no harmonized canon, no coordinates for unknown sites, no historicized visions, U rows excluded), and the registries resolve structurally. It is buildable, but it is a different shape from the earlier packs:

| Registry | Rows | Kinds | Render disposition |
|---|---|---|---|
| deuterocanonical-integration.csv | 984 | 482 typed edges, 223 place refs, 77 concepts, 70 event groups, 52 people, 48 thematic cards, 20 journeys, 12 relationship groups | 817 reference cards, 147 grouped cards, 20 nonspatial journeys; all `C` |
| expanded-ot-integration.csv | 126 | 41 settings, 33 events, 22 journeys, 19 relationships, 11 audit-only | all coordinates `null`; 11 `U` rows excluded |
| nt-apocrypha-integration.csv | 59 | 59 narrative clusters | reference-only; named places need a gazetteer join |
| related-traditions-integration.csv | 156 | 74 event topics, 39 places, 22 codex, 21 journeys | coordinates withheld |
| pilate-esdras-integration.csv | 25 | events, journeys, realms, chronology, document | all nonspatial |

Only five places have coordinates (geography-reuse.md: Jerusalem, Babylon, Bethlehem, Rome, Nazareth). Everything else is a text record. So this atlas is mainly a **gated text library with a sparse Earth map**, and the build plan below is shaped around that.

## Findings

| ID | Severity | Location | Finding | Proposal / builder action |
|---|---|---|---|---|
| RR01 | High | work-gates.csv; PACK_FORMAT §6 | 39 work slots, but the engine's book chooser is designed for 1–12 books (a row of buttons; on phones a full-width row above 7). 39 buttons is unusable on a phone. | Generic engine feature on the pack branch: when a pack has more than 12 books, the chooser becomes one compact "Work" picker (a native `<select>` with `<optgroup>`s by layer, plus previous/next), keeping cumulative gating exactly as the integration contract requires. Packs with ≤12 books are unchanged. Validator and tests updated. |
| RR02 | High | geography-reuse.md; all registries | ~260 place references, 5 coordinates. The Earth view would show 5 pins for 39 works. | Build the five anchors as given. For other named, well-identified cities (e.g. Nineveh, Susa, Ecbatana, Antioch, Ephesus, Alexandria), propose builder-compiled anchors in `anchors-proposal.csv`, reusing only coordinates already researched and audited at exact revisions (LDS build PR #33 at `c59c9bc`, Abrahamic gazetteer at `f7b74e7`), each labelled `(L)` for ChatGPT's build audit: the same procedure ChatGPT accepted for LDS. Unknown or disputed settings (Bethulia, Mamilch, Arimathea, the Infancy Thomas village) stay unpinned. See Q01. |
| RR03 | Medium | registry `copy` / `material_disposition` fields | Copy is research shorthand (e.g. "Secondregnalyear/Nisan1", "Textual label: Nineveh…"), not visitor text. | Builder writes short paraphrased visitor copy, one entry per stable record ID, never splitting a bundle into new propositions; each entry keeps its passage locator as a `ref`. ChatGPT's build audit checks copy against the cited rows. |
| RR04 | Medium | 482 typed edges + mention rows | Typed edges and mentions are relationships, not displayable facts. | Not rendered one by one. Shown as "Appears in" / "Related" lists on the place or person codex entry they attach to, gated by each edge's own work slot. |
| RR05 | Medium | expanded-ot rows XO-U01–U11 | Owner-approved exclusion. | Filtered by explicit ID list; an automated test asserts none of the 11 IDs (or their copy) appears in the pack. Meqabyan works 18–20 appear in the picker marked "coverage incomplete" with no narrative content. |
| RR06 | Medium | Pilate, visionary settings (Hades, Paradise, heavens, visionary Zion) | No Earth coordinate is allowed and none should be implied. | Codex section "Visionary and otherworldly settings"; their events attach to Earth with no `site` (the Chronicle lists them without a pin). No schematic worlds or realms that would suggest a physical place. |
| RR07 | Medium | HANDOFF_PLAN §1.4.3 vs research.md §1 | The plan called this "a Bible layer" (of LDS); the research specifies a standalone pack with its own 39-slot gating. LDS PR #33 is under ChatGPT's build audit at `c59c9bc`; merging content into it would invalidate that audit. | Build a standalone pack `christian-apocrypha` with cross-links to the LDS atlas Bible layer (and the Abrahamic atlas once live). Not blocking; see Q02. |
| RR08 | Low | research.md §4; integration-contract | Numeric dates require independent support; none is supplied. | No `timeline` (§20.2) for this pack. Source-specific dates (PL12 5,430 vs 5,500; 2 Esdras 94/204; Jubilees/Enoch tensions) appear as text notes labelled "The text" with the integrator's arithmetic labelled separately. |
| RR09 | Low | research.md §1 rights | Modern translations (e.g. NABRE on bible.usccb.org) are copyrighted. Some registry `copy` strings are in quotation marks. | Builder paraphrases everything and quotes nothing longer than a few words; each entry links its lawful host. See Q03. |
| RR10 | Low | layers | research.md §2 browsing groups. | Five layers: Deuterocanonical core; Expanded OT collections; Related pseudepigrapha (Isaiah/Baruch); NT-related gospels, acts and apocalypses; Pilate and Marian traditions. Display labels distinguish **The text / Tradition / Scholarship / Location evidence** (PACK_FORMAT §20.3 `notes`). |

## Questions for ChatGPT (answer in `research-addendum.md`)

- **Q01** (RR02): Do you accept builder-compiled `(L)` anchors that reuse coordinates from the LDS build (PR #33 at `c59c9bc`, `anchors-proposal.csv` there) and the Abrahamic gazetteer at `f7b74e7`, for apocrypha place references whose identity is not disputed? You would audit each row as for LDS. If not, the map stays at five pins.
- **Q02** (RR07): Any objection to a standalone pack, cross-linked to the LDS Bible layer, rather than content inside the LDS pack? (Mckay may also decide this.)
- **Q03** (RR09): Which registry `copy` strings are verbatim modern-translation quotations? The builder will paraphrase them regardless; this is so your build audit doesn't flag paraphrase as drift.

## Addendum dispositions

No `research-addendum.md` yet.

## Build plan and checkpoint

Planned units (one or two per run, each ending in a pushed checkpoint):
1. Engine: compact work picker for packs with more than 12 books (RR01), with validator/tests. Pack skeleton: meta, fan/educational notice, back link, 39 books, 5 layers, Earth start with the five anchors, U-exclusion test.
2. Deuterocanonical core (works 1–9): event groups, journeys, people, thematic cards, place codex.
3. Expanded OT (10–17; 18–20 marked incomplete) and related pseudepigrapha (21–22).
4. NT-related works (23–35).
5. Pilate and Marian (36–39); anchors-proposal.csv if Q01 is accepted.
6. Screenshots (3840×2160, 1440×900, 1280×800, 390×844), checks, PR, build-report.md, stage `built`.

**Checkpoint 1 (2026-10-27):** research review written; no code yet. Next: unit 1 on branch `pack/christian-apocrypha`.

## Build checkpoint 1–2 (2026-10-27)

Branch `pack/christian-apocrypha` at `aebe6d255888b604158d586e4098ce1e39030bbd` (no PR yet; opened at handoff).

- **Unit 1 done (RR01, RR05, RR10):** engine compact work picker for packs with more than 12 books (`layers.js` helpers `usePicker`/`pickerGroups`/`stepBook`/`renderBookPicker`, engine wiring, CSS; badge rows over 12 collapse to "first … last N"; PACK_FORMAT §6 documented; unit tests). Pack skeleton: 39 books from work-gates.csv grouped under five layers, cumulative gating, Earth start, the five geography-reuse anchors (location-only descriptions), coverage codex incl. Meqabyan "coverage incomplete". `tests/atlas-apocrypha.test.ts` asserts the 39 slots match work-gates.csv, that no XO-U01–U11 ID or claim text reaches the pack, and that only the five anchors are pinned.
- **Unit 2 started:** Tobit (slot 1) and Judith (slot 2): 30 Chronicle entries (dc-tob-01…14, dc-jdt-01…16), 9 unpinned places, 8 journeys as ordered text (no lines: only Jerusalem is pinned among their stops), 14 work-scoped people. Copy is paraphrased from the registry rows and dossier rows; details not in those rows were removed on self-review (e.g. which fish organs, Achior's title).
- **Checks:** `pnpm check` 87/87; `pnpm test:pages` 12 pages × 2 viewports; `pnpm test:browser` passed; validator: no issues or warnings for the pack. Picker exercised in Chromium at 1440×900 and 390×844 (select, next/prev, stored book), no console errors.
- **Known layout items for later units:** Chronicle book markers show the short work label inside a small circle, which overflows for long labels (e.g. "Inf Thom"); the layer bar sits over the bottom of the details panel at 1440×900 (same as the LDS build).

**Next:** unit 2 continued, works 3–9 (Wisdom, Sirach, Baruch, 1–2 Maccabees, Esther and Daniel additions), then units 3–6 as planned above.

## Build checkpoint 3 (2026-10-27)

Branch `pack/christian-apocrypha` at `84387a26656da934ebd0c17e4e75ba0c8ae104d1` (no PR yet).

- **Wisdom (slot 3):** 19 Chronicle entries, one per `dc-wis-NN-card` (chapters 1, 5, 10 and 19 labelled RV 1895, since the NABRE page was unavailable per the rows' limits); new codex section "Themes and allusions" with one entry per `dc-wis-*` thematic card (19). Names the body does not give (Solomon, Adam, Noah, Abraham, Lot, Jacob, Joseph, Moses, Aaron) are attributed to notes or other books, never to the chapter.
- **Baruch (slot 5):** 6 entries (`dc-bar-01…06-card`); ch. 6 shown as the Letter of Jeremiah with "seven generations" kept; ch. 1 attaches to the Babylon anchor and records the literary-frame caveat and the missing month. Journey `dc-route-baruch-dispatch` as object dispatch only.
- **Esther additions (slot 8):** 6 entries A–F with each edition's own date (Douay 14 Adar in B, 13 Adar in E, not reconciled); Artaxerxes not renamed.
- **Daniel additions (slot 9):** 3 entries (prayer/song, Susanna, Bel and the Dragon); Susanna and Bel attach to the Babylon anchor; `dc-route-habakkuk` as supernatural transport with an unnamed endpoint.
- **Codex:** 7 unpinned places (Red Sea, Nile, Sud, Susa, Joakim's garden, temple of Bel, lions' den), 8 work-scoped people (Mordecai scoped to slot 8 here although `dc-mordecai` has `first` 7 from a 2 Maccabees mention; its slot-7 mention arrives with 2 Maccabees). Jerusalem badges now 1, 2, 5, 8, 9; Babylon 5, 8, 9.
- **Checks:** `pnpm check` 87/87; `pnpm test:pages` 12 pages × 2; `pnpm test:browser` passed; screenshots at 1440×900 and 390×844 with `#book=9`, no console errors.

**Next:** Sirach (slot 4: 52 concept cards, 29 thematic cards), then 1–2 Maccabees (slots 6–7), then units 3–6.

## Build checkpoints 4–5 (2026-10-27)

Branch `pack/christian-apocrypha` at `df6991869bd3ea6d007a55c7443bed9581c9bfd0` (checkpoint 4 at `0a42116`; no PR yet).

- **Sirach (slot 4):** 52 Chronicle entries, one per `dc-sir-prologue-card` and `dc-sir-01…51-card`, editions per deuterocanonical-coverage.csv (RV 1895 for the prologue and chapters 4, 22, 34, 37, 38, 44, 46, 51; NABRE otherwise). Sirach 24 attaches to the Jerusalem anchor. Themes codex: 25 `dc-sir-*` thematic cards; People: the author (colophon name, "not Jesus of Nazareth"), the translator, Simeon son of Jochanan (Simeon II identification and Day of Atonement setting labelled editorial). Places: Hermon, Engedi, Pishon, Gihon, Seir, Philistia, Ophir. Ophir's Tobit 13 mention (`dc-ref-ophir` first 1) is not written up yet, so its entry is scoped to slot 4; Lebanon, Jericho, Jordan and Euphrates (first 2) appear only inside the Sirach plant/river theme entries for now.
- **Gating fix (self-found):** checkpoint 3 showed later works' text at an earlier slot in three codex entries (Nineveh and Ecbatana carried Judith text at slot 1; the Red Sea carried Wisdom text at slot 2). `ref()` now takes PACK_FORMAT §13 `more` additions, those entries were split, and a new test asserts that any "Work:" text in a codex entry belongs to the entry's own slot or to a correctly gated `more`.
- **1 Maccabees (slot 6), partial:** 16 Chronicle entries (`dc-m1-c01…c16-card`, all RV 1895; years in the book's own Greek-kingdom era, RV BC annotations not adopted; c01 and c04 attach to Jerusalem, c08 to Rome); 19 work-scoped people with the `dc-m1-r01…r08` relationships stated on them (the three Antiochi, two Ptolemies and two Demetrii kept apart); 5 journeys (`dc-m1-j01…j05`) as ordered text. **Not yet:** the 95 1 Maccabees place-reference rows (codex), which need per-place context from the chapter cards.
- **Checks:** `pnpm check` 88/88; `pnpm test:pages` 12 pages × 2; `pnpm test:browser` passed (one intermittent timeout in this sandbox, passed on rerun; the atlas is not part of that test); screenshots at 1440×900 and 390×844 with `#book=4` and `#book=6`, no console errors.
- **Layout item (known, for the polish unit):** the Chronicle book marker overflows for two-part labels ("1 Mc"), as noted at checkpoint 2.

**Next:** 1 Maccabees places, then 2 Maccabees (slot 7, incl. Mordecai's slot-7 mention), then units 3–6.

## Build checkpoints 6–7 (2026-10-27)

Branch `pack/christian-apocrypha` at `66c2bff03504e6d0b033b5e33bc2eff2a905ccf5` (checkpoint 6 at `f7b1d44`; no PR yet).

- **1 Maccabees places (checkpoint 6):** one codex entry for each of the 95 `dc-ref-*` rows with `first` 6 except Rome (a pinned anchor). Entries say only what the chapter cards `dc-m1-c01…c16` state; where a card only lists a name, the entry gives the chapter and its episode, not a role (e.g. the ten ch. 9 towns, the eighteen recipients of the Roman letter in ch. 15, "a list of recipients, not a route"). Homonyms kept apart (Mizpeh opposite Jerusalem vs Mizpeh of Gilead; Berea vs Beroea; Bethsura vs Bethsuron). India's Esther-additions mention is a gated slot-8 `more`. New test: every slot-6 place row has its own entry.
- **2 Maccabees (slot 7, checkpoint 7):** 15 Chronicle entries (`dc-m2-c01…c15-card`, RV 1895; Jerusalem pin on chs. 3, 5, 10); 25 place entries for the `first` 7 rows, including the five source-scoped unnamed sites (Aretas's court, the foreign mountains, Nanaea's temple, the fire well, Jeremiah's cave), none pinned; 8 people (Jason vs Jason of Cyrene kept apart; the mother and seven sons unnamed); 3 journeys as ordered text; `dc-m2-r01…r04` stated in the entries. Each card's limits are carried into the copy (no harmonizing of the three Antiochus death accounts or of year 149 vs 150; Dioscorinthius not converted; Lessau text corrupt; Emmaus not inserted into ch. 8).
- **Later-work mentions:** a `later(slot, {...})` table in the pack adds gated `more` text to entries written with earlier works (13 slot-7 additions: Ecbatana, Sparta, Ptolemais, Joppa, Ephron, Gazara, Marisa, Cyrene, Modin, Bethsura, Antioch, Idumaea, Cyprus). Mordecai is now scoped to slot 7 (`dc-mordecai` first 7: "the day before Mordecai's day", 15:36) with his Esther-additions text as a slot-8 `more`.
- **Fix (self-found):** the Babylon anchor badge lacked 1–2 Maccabees and Jerusalem lacked 2 Maccabees; both now follow the `dc-ref-babylon`/`dc-ref-jerusalem` source bundles.
- **Known gap, scheduled:** 21 places first named in Tobit or Judith and mentioned again in 1–2 Maccabees (Egypt, Media, Persia, Jordan, Jericho, Euphrates, Judea, Galilee, Gilead, Samaria, Jamnia, Azotus, Ascalon, Arabia, Cilicia, Damascus, Tyre, Bethhoron, Elymais, Kedesh, Scythopolis) still have no codex entry: the slot 1–2 place rows were only partly written at checkpoint 2. They will be written with their 1–2 Maccabees mentions as `later` additions in the next unit, which closes the deuterocanonical core.
- **Checks:** `pnpm check` 90/90; `pnpm test:pages` 12 pages × 2; screenshots at 1440×900 and 390×844 with `#book=7`, no console errors. `pnpm test:browser` timed out at its save/load step (line 88) here, on the unchanged checkpoint-6 head too; it does not load the atlas, and this sandbox's software GL is slow. CI runs it on the PR.

**Next:** remaining Tobit/Judith place rows (closes works 1–9), then unit 3 (expanded OT, works 10–17; 18–20 incomplete).

## Build checkpoint 8 (2026-10-27)

Branch `pack/christian-apocrypha` at `16ac23f75ac497977b8bf7e162a560e279af15a3` (no PR yet).

- **Tobit and Judith places (closes works 1–9):** every `dc-ref-*` place-reference row with `first` 1 or 2 now has a codex entry scoped to that slot (about 80 rows, including the 21 named at checkpoint 7). Each says only what `dc-tob-01…14` / `dc-jdt-01…16` state; names that appear only in a list (Nebuchadnezzar's summons, ch. 1; Holofernes's campaign sequence, ch. 2; the coastal towns, ch. 2; the warned towns, ch. 4; the siege positions, ch. 7; the notified towns, ch. 15) are described as list members, not given roles. Later mentions are gated `more` text by slot (Wisdom, Sirach, Baruch, 1–2 Maccabees, Esther C, Bel and the Dragon); where a 1–2 Maccabees card only lists a name, the text gives the chapter and its episode, as at checkpoint 6. Kept apart: Kedesh / Kadesh / Kadesh-barnea, Sur / Bethsura, Dothan / Dothaim, Belmain / Belmaim, Choba / Chobai, Tyre / the Ladder of Tyre. Source-scoped sites added without locations: Tobit's remembered home region, the bridal chamber, Holofernes' camp, the hillfoot below Bethulia, the valley outside Bethulia. Ophir now starts at slot 1 (Tobit 13 imagery) with its Sirach text as a slot-4 `more`. Elymais keeps the RV "I went"/"he went" variant and assigns no journey.
- **Engine fix (self-found):** with the long "Places without a map pin" tab, the codex panel was placed thousands of pixels below the viewport on phones (the overlay's grid track sized to the panel's content). `#codex` now has a bounded row, and the panel and `.cx-body` can shrink so the body scrolls. Checked at 390×844 and 1440×900; short tabs unchanged.
- **New test:** every slot 1–2 place-reference row has an entry with the same `first` (91 tests).
- **Checks:** `pnpm check` 91/91; `pnpm test:pages` 12 pages × 2; Chromium at 1440×900 (`#book=7`) and 390×844 (`#book=2`, `#book=7`): slot 7 text shown at 7, hidden at 2; Esther and Bel additions hidden at both; no console errors. `pnpm test:browser` not rerun (same sandbox limitation as checkpoint 7; CI runs it on the PR).

**Next:** unit 3, expanded OT (works 10–17; 18–20 marked incomplete), then related pseudepigrapha (21–22).

## Build checkpoint 9 (2026-10-27)

Branch `pack/christian-apocrypha` at `4c5ecdbba1499cc6cdff8a35cad2095ea5644386` (no PR yet).

- **Expanded OT, slots 10–15:** every `expanded-ot-integration.csv` row with `first` 10–15 (38) and every `XE2-*` row in `pilate-esdras-integration.csv` (10) is used, paraphrased from the row only. 24 Chronicle entries, ids = lowercased record ids: 1 Esdras `xo-p01`, `xo-p03`, `xo-e01`, `xo-e23…e26` (KJV transcription XO01); 2 Esdras `xo-p06`, `xo-e02` (KJV, chs. 1–4) and `xe2-c03`, `xe2-e01`, `xe2-c01`, `xe2-e02`, `xe2-c04` (WEB, chs. 5–16); 3 Maccabees `xo-p07`, `xo-e03`, `xo-e04` (WEB); 4 Maccabees `xo-e07`, `xo-e27…e30` (online translation XO04, edition named per entry; 10:4 and 11:7–8 from WEB XO22); Prayer of Manasseh `xo-e05` and Psalm 151 `xo-e06` (copyrighted translations: paraphrase only). Pins only at the reused anchors: Jerusalem (XO-P01, XO-P07) and Babylon (XO-P03, XO-P06); badges updated.
- **Codex:** 8 unpinned settings (Magiddo, Darius’s court, Ecbatane, the river Theras, the field Ardat/Arphad, Schedia, the hippodrome, Ptolemais “rose-bearing”); same-spelled places are separate entries from the 1–2 Maccabees and Tobit ones, per the rows’ no-merge limits. New section **Visionary and otherworldly settings** (RR06) with XO-P05 and XE2-P02. 7 journeys (XO-J01–J04, J21, J22, XE2-J01 with XE2-C02’s “year and a half”). 14 people scoped to their work (XO-R01–R05, XE2-R01; the two Eleazars, the 4 Maccabees mother left unnamed). Edition-specific numbers are kept side by side (2 Esdras 14: WEB 94/70 vs KJV 204; 2 Esdras 7:36–105 restored in WEB, absent in the KJV transcription).
- **Engine fix (self-found):** with ten book badges, the Jerusalem row’s badges ran over the place name at 1440×900. Place-row badge lists now wrap (`engine.css`, `.place .pc .bks`); no change for rows that fit.
- **New tests:** each narrative row for slots 10–15 has a Chronicle entry at its own work, pinned only at Jerusalem or Babylon; visionary settings have no location and are not listed as places (93 tests).
- **Checks:** `pnpm check` 93/93; `pnpm test:pages` 12 pages × 2; Chromium at 1440×900 (`#book=12`), 390×844 (`#book=12`), 1280×800 (`#book=10`) and 3840×2160 (`#book=15`): no console errors; 1 Esdras text absent at `#book=9` and present from 10. `pnpm test:browser` not rerun (sandbox limitation as at checkpoint 7; CI runs it on the PR).

**Next:** 1 Enoch (slot 16, 31 rows) and Jubilees (slot 17, 45 rows), then related pseudepigrapha (21–22).

## Build checkpoints 10–11 (2026-10-27)

Branch `pack/christian-apocrypha` at `ad9ea3efb5d8da2c23e4b3062758d19265ab17a2` (checkpoint 10 at `e339935`; no PR yet).

- **1 Enoch (slot 16, checkpoint 10):** all 31 `expanded-ot-integration.csv` rows with `first` 16 (Charles translation as hosted by NNU, XO07). 6 Chronicle entries (`xo-e31`, `xo-e08`, `xo-e11…e14`), none pinned (coordinates null). Codex: 3 reference places (Hermon kept separate from Sirach’s, the waters of Dan, Mahalalel’s house); 12 visionary/mythic settings (XO-P12, P14–P16, P19–P24, P26–P27), with Dudael and Duidain kept apart and the chapter 22 “four hollows / three divisions” tension stated, not resolved; 5 journeys (XO-J05–J09) as ordered text; 9 people (Raphael kept separate from Tobit’s; the angel of peace not identified with the four archangels; the explicit Enoch→Methuselah→Lamech→Noah line followed over chapter 65’s “grandfather” wording; Noah’s birth: Lamech’s fear not turned into an angelic parentage).
- **Jubilees (slot 17, checkpoint 10):** all 45 rows with `first` 17 (XO08). 11 Chronicle entries (`xo-e32`, `xo-e15`, `xo-e09`, `xo-e16…e22`, `xo-e33`), none pinned; the 364-day year and jubilee scheme labelled as the book’s own; the assaults in chs. 30 and 33 stated as assaults; Jacob killing Esau kept as this book’s ending. Codex: 13 reference places (incl. Sion kept as printed at 18:13, Lubar not tied to a modern summit, Deborah’s burial and Rachel’s pillar as separate entries); the two sacred groupings (4:26, 8:19) under Themes; 11 journeys (XO-J10–J20) with the printed “Asshur” and “Haran” kept and the narrative calendar strings as text; 12 people entries (the two Ednas kept apart; Asenath daughter of Potiphar as printed; Tharmuth’s adoption distinguished from kinship; the angel of the presence left unnamed).
- **Ascension of Isaiah (slot 21) and 4 Baruch (slot 22), checkpoint 11:** all 58 `related-traditions-integration.csv` rows for the two works, copy from related-pseudepigrapha.md. 20 Chronicle entries (`rpe01…rpe20`); pins only at reused anchors (Jerusalem: RPE01, 06, 12, 13, 16; Babylon: RPE15; Bethlehem: RPE02). Anchor badges: Jerusalem +21, 22; Babylon +22; Bethlehem +21 (RPP02); Nazareth +21 (RPP10). The Jordan (RPP16) and Samaria (RPP17) are `later(22)` additions to their existing entries; Samaria’s founding is labelled the story’s account. Visionary realms (firmament, seven heavens, Sheol with Haguel not merged, Gehenna) under Visionary settings; the three nonspatial 4 Baruch references and the figs (RPC09) under Themes; 10 journeys (instruction-only and visionary legs labelled; no first-heaven stop added on the return); 13 people (Belchira not merged with Beliar; the guide kept apart from the angel of the Holy Spirit; Abimelech’s origin not used as evidence of composition). Hezekiah’s 26th vs 20th year and the 66/9/3/477 figures are given as the text’s own numbers.
- **New tests (95):** every XO-E row for slots 16–17 has an unpinned Chronicle entry at its work; one journey entry per XO-J row; 12 schematic 1 Enoch settings and none for Jubilees; every RPE row at its work; one journey per RPJ row; anchor badges and the 4 Baruch `later` additions present.
- **Checks:** `pnpm check` 95/95; atlas pack validator clean; `pnpm test:pages` 12 pages × 2. Chromium at 1440×900 (`#book=16`, `#book=17`, `#book=22`), 390×844 (`#book=17`, `#book=21`, `#book=22`), 1280×800 (`#book=15`, `#book=20`) and 3840×2160 (`#book=17`, `#book=22`): no console errors; codex gating checked (Jubilees entries absent at 16; 4 Baruch entries and the Samaria addition absent at 21, present at 22). `pnpm test:browser` not rerun (sandbox limitation noted at checkpoint 7; CI runs it on the PR).
- **Known layout item (unchanged):** the Chronicle book marker overflows for two-part labels (“4 Bar”), for the polish unit.

**Next:** unit 4, NT-related works (slots 23–35), then unit 5 (Pilate and Marian, 36–39) and unit 6 (screenshots, PR, build report).
