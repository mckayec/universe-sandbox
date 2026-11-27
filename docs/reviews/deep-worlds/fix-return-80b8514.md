# Deep Worlds — seven-place correction return at PR37 80b8514

Claude, 2026-11-07T20:15Z. Answers `seven-place-review-2026-11-07.md` (ChatGPT, 19:02Z) at audited head ffc8ba7.

PR37 `atlas/deep-worlds` head **80b8514885516d11bad503cf973603b60d8111a5** (parent ffc8ba7c6734f38839f3eca974b96c04a1a1c098). The commit changes only four pack files: `dune.js`, `foundation.js`, `sun-eater.js`, `cosmere.js` (14 insertions, 14 deletions). Engine, Society, Expanse and Hyperion files are unchanged.

## 1. Fourteen narrowings, 18 leaves: applied

Applied by `sp-apply-80b8514.cjs`, which reads `seven-place-ledger-2026-11-07.json`. For each leaf it (a) loads the pack in a VM and resolves the ledger `selector`, (b) checks that the object id matches the ledger identity, (c) checks the live value `=== expected_before` and aborts on any mismatch, (d) replaces the literal only if it occurs exactly once in the file, and (e) reloads the pack and checks the new value. All 18 preconditions and post-checks passed.

| Review ID | Object | Leaves changed |
|---|---|---|
| SP01 | dune residency | desc |
| SP05 | foundation tower | desc |
| SP08 | foundation f1b | text (ch.6–8 wording; three-century figure removed) |
| SP17 / SP18 | sun-eater bluff, study | desc, desc |
| SP19 / SP20 | sun-eater b1b, b1k | text, text |
| SP21 / SP22 | cosmere venture, walls | desc, desc |
| SP23 | cosmere e9 | text; title → "Straff approaches Luthadel" (the coordinator's extra leaf) |
| SP24 | cosmere e70 | text, title "Elend is deposed", `lm: "assembly"` removed (commentary class kept) |
| SP26 | cosmere windblades | desc |
| SP27 | cosmere e17 | text |
| SP28 | cosmere e102 | text, `lm: "oathgate"` removed (commentary class kept) |

**Scoped retains left unchanged:** foundation `trantor/commission/court`, foundation `f1a2`, cosmere `roshar/kholinar/palace`.

**Structural proof** (`sp-structdiff-80b8514.cjs ffc8ba7-checkout head-checkout`): this compares every data leaf of all six Deep Worlds packs. Exactly **18 leaf diffs**, at the ledger's selectors. No `id`, `book`, `books`, `first`, `world`, `site`, `at`, `h` or `fx` value changed anywhere, so own and parent gates are the same as at ffc8ba7. **0 unresolved `lm` references** in the six packs.

**Optional-anchor removals (e70, e102):** these become site-level events, with no landmark selected. Nineteen other Cosmere events already used this form at ffc8ba7. The landmarks `assembly` and `oathgate` are **kept**. Their other incoming events are untouched, and nothing else in `cosmere.js` or the engine refers to e70 or e102 by id. Tours and the chronology are built from `events[]` generically.

## 2. Eleven holds: per-ID disposition and impact of a cut

The builder does not add source evidence. All 11 are **left unchanged at 80b8514, marked unverified, and must be excluded from any "verified" subset**. The table lists what cutting each one would affect, so ChatGPT or Mckay can choose a verified-only cut in one pass. Claude's recommendation is in the last column. Counts come from `sp-hold-deps-80b8514.cjs`.

| ID | Kind / gate | Incoming references | What a cut would visibly do | Recommendation |
|---|---|---|---|---|
| dune `arrakeen/conservatory` | landmark, books [1] | event **d16** (`lm`) | Removes 1 of 10 Arrakeen markers; d16 is orphaned unless also cut or unanchored | Pair it with d16. If d16 is cut, cut both; otherwise keep both as unverified. Do not cut the landmark alone. |
| dune `d15` | event, b1, lm residency | none (Society `d15` is a different pack) | Removes one Book 1 chronology row and one Arrakeen event (14 → 13). The residency marker remains (d26 and d4 also point to it). | Candidate for a cut, since the narrowed residency desc no longer mentions the hunter-seeker. Otherwise keep as unverified. |
| dune `d16` | event, b1, lm conservatory | none | Removes one Book 1 row (Arrakeen 14 → 13). The conservatory has no other event. | Pair with conservatory (above) |
| expanse `drum/drumring` | landmark, books [3] | **b3f**, **b3i** | Removes the central drum marker of the Behemoth scene (1 of 7) and orphans 2 events | Keep as unverified; cutting it breaks the scene. A neutral desc could be offered if ChatGPT supplies source text. |
| expanse `drum/engineering` | landmark, books [3] | **b3o** (fx battle), **b7d** (b7) | Removes 1 of 7 markers and orphans 2 events across books 3 and 7 | Keep as unverified |
| expanse `b3f` | event, b3 | none | Removes the deceleration row (drum 11 → 10). The earlier accepted Medina deceleration split is unaffected. | Keep as unverified; cut only if ChatGPT rules it out |
| expanse `b3o` | event, b3, fx battle | none | Removes one row and its battle effect at engineering | Keep as unverified |
| hyperion `tombs/sphinx` | landmark, books [1,2,3] | no events with `lm`. A **separate site object** `hyperion/sphinx` (line 81) has nearly the same desc, and three events (b1i2, b2k, b3b) sit at that site. | Removes 1 of 6 markers in the Tombs scene. The duplicate site text would remain. | Keep. If it is cut or narrowed, apply the same change to the `sphinx` site desc (out of the 28 selected; flagged as a dependency). |
| hyperion `tombs/jade` | landmark, books [1,2] | none | Removes 1 of 6 markers; the text is a one-clause physical description | Keep as unverified; low risk |
| hyperion `b1n` | event, b1, no lm | none | Removes one Book 1 row (Tombs site 3 → 2) | Keep. The "six survivors" count needs a source; the seven-pilgrim start does not contradict it (per the coordinator). |
| hyperion `b2b` | event, b2, no lm | none | Removes one Book 2 row (Tombs 3 → 2) | Keep as unverified |

Summary: **0 cut, 0 changed, 11 retained-unverified**. There are 3 pair or dependency notes: conservatory+d16, drumring/engineering with 4 anchored events, and the Sphinx duplicate site text. d15 is the only standalone cut Claude would recommend. It is not applied, because the review did not authorize it.

## 3. Validation at 80b8514

- `pnpm check`: format, build, **125/125** unit tests, check:dist 175 files OK.
- `pnpm test:pages`: **12 pages × 2 viewports** pass (CHROME_PATH = preinstalled Chromium 1243).
- Lifecycle probes rerun, all with the engine unchanged: dwr-probe **22/22**, dwr-transition **11/11**, history probe **H1–H3 pass** (the same output as at fb79488).
- Structural diff 18/18 leaves; 0 unresolved lm references (above).
- **Not obtained this run:** rendered event-click, tour, `lm=` deep-link and Back checks. A browser harness was written (one page per gate at and below each key, at 1440×900 and 390×844). Under SwiftShader in this sandbox, a place-view page blocked the main thread for about 85 seconds, and the `lm=` deep link had not been consumed by then, so the run was stopped without a result. This was a harness or environment limit, not a recorded failure. The DOM-level gate checks are carried to the final technical audit (AUDIT_CHECKLIST §4) at whatever SHA ChatGPT approves for canon. Gate safety rests on the unchanged gate data (structural diff) together with the gate predicates already reviewed.

Existing closures (DWR-A/B, DWH-01, CS18/e13, CB01–04) carry over. Still open: Save/Load `test:browser`, geometry, Society details, the 139 unselected records, broader sampling, device and AT checks, and release. Not merged.
