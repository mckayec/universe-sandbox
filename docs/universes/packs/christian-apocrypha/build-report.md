# Biblical Apocrypha and Related Traditions: build report (Claude)

- **PR:** #38, branch `pack/christian-apocrypha`, current head **`1e256ceb3ac797ab998c6b7af0edb41d31c8da6f`** (APB fixes; recheck this exact SHA). First build was `8ae91333461bfeb989b570857a0aba321eaa34df`, audited in audit-build.md. Not merged.
- **Research built from:** revision `4dc7f444246ab0c5afffe90ee3fb1838b92493aa` (owner-approved narrowed handoff; XO-U01–U11 excluded).
- **Builder review and per-checkpoint notes:** `research-review.md` (RR01–RR10, Q01–Q03, build checkpoints 1–16).

## What was built

| Area | Built |
|---|---|
| Pack | `public/atlas/packs/christian-apocrypha.js`, registered in `public/atlas/packs/registry.js` and `src/universe-packs.ts`. Fan/educational notice in the credits and About panel; back link to Gravity Lab. |
| Works and gating | 39 work slots from `work-gates.csv` in five layers (Deuterocanonical core 1–9; Expanded OT 10–20; Isaiah/Baruch 21–22; NT-related 23–35; Pilate and Marian 36–39). Cumulative gating by work: Chronicle entries, codex entries, badges and gated `more`/`later` additions appear only from their own slot. |
| Map | Earth view with only the five researched anchors (Jerusalem, Babylon, Bethlehem, Rome, Nazareth), each described as a location marker, never as the spot of a narrated event. No other pins. |
| Chronicle | 327 entries, one per narrative row/cluster (ids = stable record ids), paraphrased from the cited rows with the edition named on each (since 1e256ce; at 8ae9133, 95 deuterocanonical entries lacked it, APB-011). Pins only where the row binds an event to an anchor. |
| Codex | 706 entries (incl. three coverage notices) plus 77 gated later-work additions: unpinned places (namespaced by work where the research keeps homonyms apart), journeys as ordered text, people scoped to their works, themes, and "Visionary and otherworldly settings" (no Earth location). Later-work mentions are gated additions. |
| Meqabyan (18–20) | Coverage-incomplete notices only; a test asserts no XO-U01–U11 id or claim text reaches the pack. |
| Engine (generic) | Compact work picker for packs with more than 12 books (`layers.js`, PACK_FORMAT §6; badge rows over 12 collapse to "first … last N"); codex panel bounded so long tabs scroll on phones; place-row badges wrap; Chronicle book markers become pills for multi-letter labels; index/details panels subtract their padding from max-height so they stop above the Chronicle; the layer bar wraps between 821 and 1400 px. Packs with 12 or fewer books are unchanged apart from the last three layout fixes. |
| Tests | `tests/atlas-apocrypha.test.ts` (slot list vs work-gates.csv, U exclusion, only five pins, per-work Chronicle coverage and pin expectations, journey/visionary counts, badge inclusions and exclusions, gated `later` additions, no Latin-form imports in slot 38); picker tests in `tests/atlas-layers.test.ts`. |

## Left out, and why

- **Pins for any place other than the five anchors.** Q01 (reusing audited (L) coordinates from LDS/Abrahamic) has no `research-addendum.md` answer yet; without it the map stays at five pins. Everything else is in the codex.
- **Timeline (§20.2).** No independently supported numeric dates (RR08); the texts' own figures are given as text.
- **Typed edges as separate items** (RR04): shown as "appears in"/related text on the entries they attach to.
- **Quotations.** Everything is paraphrased (RR09); Q03 asks which registry strings are verbatim.
- **Meqabyan narrative content** (owner-approved exclusion).
- **LDS cross-link.** Q02 open; the pack is standalone.

## Items for ChatGPT's build audit

Flagged during the build (details in `research-review.md`): `nta-ape-eubula` "Agrippinus or Pompeius"; `nta-aj-parricide` (murdered father taken from the cluster id); `nta-apa-discovery` read as copies for the emperor and for Jerusalem; ME01 pinned to Jerusalem from MP01's "Jerusalem context"; PME22 carries the coastal-road note filed under PMJ05; the Descent's paradise entry names "the robber" without identifying him.

## Checks at `8ae9133`

- `pnpm format`; `pnpm check` (format check, build, 99/99 tests); site-audit `atlas-validate.js` on the branch's packs: 0 issues, 327 events, 5 sites; its only warnings are the PACK_FORMAT §20 keys `layers` and `start`, which that validator predates.
- `pnpm test:pages`: 12 pages × 2 viewports (CHROME_PATH = installed Playwright headless shell).
- `pnpm test:browser`: not run here; its save/load step times out on this sandbox's software GL (it does not load the atlas). Correction (APB-006): CI does **not** run it; deploy-pages.yml runs format check, build, unit tests, check:dist and test:pages only.
- Chromium (swiftshader) at 3840×2160 (`#book=39`), 1440×900 (`#book=38`), 1280×800 (`#book=35`), 390×844 (`#book=39`): no console errors. Sun Eater checked at 1440×900 for regressions from the engine CSS changes (book circles and panel unchanged in look).

## Screenshots (`shots/`)

| File | What it shows |
|---|---|
| `3840x2160-ps-matthew.jpg` | 4K view at slot 39, downscaled to 1920 wide |
| `3840x2160-crop-1to1.jpg` | 1:1 crop of the 4K view around the anchors |
| `1440x900-dormition.jpg` | slot 38; Chronicle marker as a pill; details panel ending above the credits |
| `1280x800-apocalypse-paul.jpg` | slot 35; layer bar wrapped to two rows; later works locked in the Chronicle |
| `390x844-ps-matthew.jpg` | phone, slot 39, compact work picker and details sheet |

## Known limits

- **Earth texture at 4K in these shots is soft:** the "Charting surface" bake had not finished after 45 s under software GL. On a GPU it should finish; worth a look on real hardware before release.
- **At globe zoom, Bethlehem's label is hidden** where it collides with Jerusalem's (the engine's label collision rule); it appears when zoomed in or selected from the details panel.
- **On phones the layer bar sits under the open details sheet**; collapsing the sheet shows it (same as the other Track A layout).
- UI text at 3840×2160 is drawn at 1× CSS size (engine-wide behaviour, unchanged).

## Fix round 1 — `1e256ce` (2026-10-29)

Resolves audit-build.md APB-001–003 and 007–019 (each row's Resolution cell names the change); APB-005/006 are corrected above. APB-004 (finished-surface evidence) is still open: in this sandbox the bake reaches only ~25–40% after 85–146 s under software GL and slows, so no crisp-surface evidence is claimed. It needs a capture on real GPU hardware before technical approval.

Checks at `1e256ce`: `pnpm format:check` clean; `pnpm check` (build, 100/100 unit tests incl. the new APB regression test, check:dist 112 files); `pnpm test:pages` 12 × 2 passed; `pnpm test:browser` timed out at the simulator save/load step (not the atlas). Playwright with swiftshader at four sizes: no console errors, corrected text present in the rendered page.

| File | What it shows |
|---|---|
| `fix-1e256ce-3840x2160.jpg` | 4K, All works, downscaled to 1920 wide; bake unfinished (23%) |
| `fix-1e256ce-1440x900.jpg` | All works; Tobit Chronicle row, panels and layer bar |
| `fix-1e256ce-1280x800.jpg` | All works at 1280 |
| `fix-1e256ce-390x844.jpg` | phone, details sheet |
