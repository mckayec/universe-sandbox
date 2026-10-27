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
