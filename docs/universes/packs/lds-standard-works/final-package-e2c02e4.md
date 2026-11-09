# Standard Works — final-audit package (checkpoint 67)

2026-11-07 UTC · Claude (builder / technical auditor).

Exact head audited: **PR33 `pack/lds-standard-works` e2c02e49d8f77d020d5e0d1f8ddd30b2fab98d25** (no code or content change in this checkpoint). This answers the "next bounded action" in [audit-final.md](audit-final.md): exact-head technical/rendered evidence plus an explicit disposition of the remaining completeness scope, with the specific content items that need a source decision. RES64-C1/C2 are not re-sent.

## 1. Exact-head technical evidence (re-run this checkpoint, local, Node 22, Chromium 1243 headless with SwiftShader software GL)

| Check | Result |
| --- | --- |
| `pnpm install --frozen-lockfile` | pass |
| `pnpm check` (format, tsc + vite build, unit tests, check:dist) | pass — **171/171** tests; check:dist **114 files OK, no third-party loads** |
| `pnpm test:pages` | pass — **13 pages × 2 viewports** |
| `pnpm test:browser` (full simulator smoke; CHROME_PATH set) | **pass** this run (the pre-existing Save/Load race did not reproduce) |
| Atlas pack validator | runs inside the unit suite (`tests/atlas-packs.test.ts` / `atlas-pack-validator.mjs`): pass |

## 2. RC64-O1 rendered chooser / scroll / focus / resize — executed

Script: [supplementary-build/s67-final-evidence.mjs](supplementary-build/s67-final-evidence.mjs) (s65 checks plus focus-on-open, keyboard focus of the chooser, Escape close with focus return, and a request guard failing on any non-same-origin request). Run per viewport (`VPS=…`) against `vite preview` of the exact-head build.

| Viewport | Chooser replaces 13 tabs | Header / list px | Sideways scroll | Title visible after scroll-to-top (≥8 px) | Focus on open → `cxClose` | Escape → closed, focus `cxBtn` | Third-party requests |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1440×900 | yes (compact) | 108 / 464 | 0 | pass | pass | pass | 0 |
| 1280×800 | yes (compact) | 108 / 464 | 0 | pass | pass | pass | 0 |
| 390×844 (touch, DPR 2) | yes (phone chooser) | 104 / 588 | 0 | pass | pass | pass | 0 |
| 3840×2160 | yes (compact) | 108 / 464 | 0 | pass | pass | pass | 0 |
| Dune control 1440×900 | keeps buttons (few sections) | 53 / 685 | 0 | — | — | — | 0 |

Resize across the threshold (to 3000 px) stays compact at every desktop viewport. No page errors or console errors (GPU-driver noise filtered as in s65). Console logs: `supplementary-build/s67-final-evidence.txt`.

**These are builder-executed rendered cases, reproducible by the committed script.** They supply the rendered evidence RC64-O1 lacked; ChatGPT's earlier sandbox could not launch Chromium, so independent re-execution remains optional and is not claimed here.

### 2a. Run note
The four viewports were first run in parallel; the 3840×2160 process timed out on its first Codex click under the combined software-GL load (240 s). Re-run alone it passed every check (table above). Logged in the evidence file.

## 3. Captures (exact head, full resolution, < 500 KB)

- [shots/s67-reference-3840x2160.jpg](shots/s67-reference-3840x2160.jpg) — **full 3840×2160, not downscaled**: Reference dialog over the globe; text crisp, no clipping. The dialog is a fixed-width centred panel at 4K (readable; a possible later polish is a wider panel at ≥2560 px, not a blocker).
- [shots/s67-reference-1280x800.jpg](shots/s67-reference-1280x800.jpg), [shots/s67-reference-390x844.jpg](shots/s67-reference-390x844.jpg) (DPR 2) — chooser, card titles, sources and See-also links readable; nothing clipped; no sideways scroll.
- Earlier finished-surface 4K captures remain at `shots/b9-*`, `shots/b10-*` (globe bake). Software-GL only.

## 4. Completeness-scope disposition (whole pack at e2c02e4)

Computed with [supplementary-build/s67-scope-stats.cjs](supplementary-build/s67-scope-stats.cjs) by evaluating the generated pack.

| Scope element | Count at head | Disposition |
| --- | --- | --- |
| Codex cards (13 sections) | **1,647** (works 7, unmapped-places 46, unmapped-narratives 34, bom-records 20, bom-geography 64, bom-more 123, bom-bible 124, nt-more 242, ot-more 498, dc-more 423, pgp-more 34, reference-views 20, restoration-documents 12) | Ship as built. Coverage is a **curated atlas, not a verse-complete concordance**; the intro/about copy should keep saying so. Wider "vision completeness" is **deferred to a post-release addendum** under R3 rather than a release blocker — recommend ChatGPT records this as a Known gap, not a canon blocker. |
| Cards with ≥1 official source link | 1,614 | Accepted per earlier per-batch audits (76 editorial keys, 16 checkpoint-64 cards, RES64-C1/C2 etc.); not re-verified here. |
| **Cards with no `src` link** | **33** (works 7, unmapped-places 19, unmapped-narratives 7) — listed in §5 | **Source decision needed (CS-1).** These are the early anchored core cards; most cite the chapter in prose, some do not. Proposed fix: builder adds official churchofjesuschrist.org chapter links to all 33 (content-neutral, no wording change) in one checkpoint, then ChatGPT checks only those 33 links. Alternative: accept prose references for the 7 `works` overview cards (they describe the canon as a whole) and link only the 26 place/narrative cards. |
| Cards using explicit qualification language (uncertain / not identified / traditional / proposed …) | 112 (heuristic regex) | These are the shipped `(L)`-style claims: each is visibly labelled as uncertain in its own text. No hidden confidence field exists in the pack; the qualification is the prose itself. |
| `(U)` claims | none known shipping | Previous audits removed or qualified them; no `U` marker exists in the pack. |
| Events | 24, each with a `site` | Every event opens a real place. |
| Earth sites | 34 (7 major), all with lat/lon, modern-name and layers | Unlocated places are kept off the map in "unmapped places" (46 cards), as designed. |

## 5. CS-1 — the 33 cards without source links

| Section[index] | Key | Card |
| --- | --- | --- |
| works[0] | - | Standard works |
| works[1] | - | Resurrection testimony |
| works[2] | - | Baptism at Mormon |
| works[3] | - | Doctrine and Covenants |
| works[4] | - | Kolob |
| works[5] | - | Principles and ordinances |
| works[6] | - | Scripture and revelation |
| unmapped-places[0] | - | Haran |
| unmapped-places[1] | - | Haran |
| unmapped-places[2] | - | Shechem (Sichem) |
| unmapped-places[3] | - | Camp between Bethel and Hai |
| unmapped-places[4] | - | Egypt |
| unmapped-places[5] | - | Horeb |
| unmapped-places[6] | - | Ur of the Chaldees |
| unmapped-places[7] | - | Ur of the Chaldees |
| unmapped-places[8] | - | Mount of Olives |
| unmapped-places[9] | - | Mount of Olives |
| unmapped-places[10] | - | Mount of Olives |
| unmapped-places[11] | - | Gethsemane |
| unmapped-places[12] | - | Golgotha |
| unmapped-places[13] | - | Waters of Mormon |
| unmapped-places[14] | - | Temple in Bountiful |
| unmapped-places[15] | - | Woods near the Smith home |
| unmapped-places[16] | P17-dc-enoch-city | Enoch’s city (Zion) |
| unmapped-places[17] | P17-pgp-enoch-city | Enoch’s city (Zion) |
| unmapped-places[18] | - | Jershon (Abraham) |
| unmapped-narratives[0] | - | Abram’s journey |
| unmapped-narratives[1] | - | Moses’ commission |
| unmapped-narratives[2] | - | Baptisms at Mormon |
| unmapped-narratives[3] | - | Jesus at Bountiful |
| unmapped-narratives[4] | - | First Vision account |
| unmapped-narratives[5] | - | First Vision account |
| unmapped-narratives[6] | - | Abraham’s journey account |

## 6. Suggested §4 20-entry sample for ChatGPT

Deterministic selection: SHA-256 of `e2c02e49…:<key>` over the 1,614 keyed, sourced cards, lowest 20 hashes (script above). ChatGPT may use or replace it; recording how entries were picked is the §4 requirement.

| Hash prefix | Section[index] | Key |
| --- | --- | --- |
| 0011fba5 | bom-bible[120] | BMV-174-wise-men-angels-skeptics |
| 002710c2 | nt-more[109] | NTE-calls-and-healings-mark-4 |
| 00518103 | unmapped-places[25] | PP01 |
| 00bb5b8c | ot-more[21] | OHP-BEERLAHAIROI |
| 00d48a79 | ot-more[268] | OTM-shiloah-water |
| 00df6c6b | ot-more[247] | OTL-lachish |
| 00eba7b0 | dc-more[269] | DCM-de15-colesville-onward |
| 00ec7929 | ot-more[446] | OTW-r04-psalm-collections |
| 00f8386c | bom-more[64] | BXP57 |
| 010e6196 | dc-more[416] | DCM-dd134-government |
| 010f890f | dc-more[338] | DCM-dd056-companions-revised |
| 012cb625 | bom-more[6] | BXP07 |
| 013dbf51 | bom-geography[50] | BE21 |
| 0172b58c | bom-bible[44] | BMV-105-amulek-joseph-descent |
| 01aa145c | ot-more[88] | OHR-ESAU |
| 01d1a8ba | reference-views[9] | PC01 |
| 01da57fd | ot-more[291] | OTM-carchemish |
| 01ed271d | dc-more[300] | DCM-dd018-twelve-envisioned |
| 0222d053 | ot-more[415] | OTW-p10-moresheth |
| 028d013c | bom-bible[26] | BMV-045-babylon-oracle |

## 7. Remaining gates (unchanged, explicit)

| Gap | Blocks |
| --- | --- |
| CS-1 source decision (33 cards) | Canon approval until decided either way |
| ChatGPT §4: 20-entry sample + whole-pack low-confidence acceptance (§4–§6 above) | Canon approval |
| Physical iOS/Android device and real-GPU timing | Not reproducible here; recommend carrying as a Known gap into the D-question to Mckay, as was done for abrahamic (D04) and christian-apocrypha (D03) |
| Mckay release approval | Release |

**Technical (provisional):** no technical blockers found at e2c02e4 beyond the device/GPU Known gap. Formal "Technical: approved" will be written to audit-final.md once canon is approved for the same SHA (or a new SHA if CS-1 adds links, in which case Claude re-runs §1–§2).
