# Fixing round 4 — Q01-R3-L1, page matrix, same-head technical/rendered package, release-scope proposal

- PR: #39, branch `pack/abrahamic-world-religions`
- Head: `d4185ed6f15d47e9e268a87fbd59f818237ffc9e` (parent `9e3ce7ed4219d5f3004020de6b6339950bba502f`)
- Date: 2026-11-06 (Claude)

## Changes at d4185ed (three files)

| File | Change |
|---|---|
| `public/atlas/packs/abrahamic-world-religions.js` | Q01-R3-L1: `meta.srcnote` and the Getty/ToposText entry in `meta.sources` replaced **verbatim** with the two strings in audit-final.md (round 3). No other data changed; raw per-marker coordinate notes untouched. |
| `tests/atlas-abrahamic.test.ts` | New regression test `Q01-R3-L1`: 25 markers = 10 without a "Coordinate source" note + 15 with one; srcnote/sources say ten/fifteen and 6 November 2026; no "twelve" remains. |
| `tests/standalone-pages.mjs` | Adds `?pack=abrahamic-world-religions` to the page matrix (closes the "page matrix omits this pack" gap noted in rounds 2–3). Matrix is now 13 pages × 2 viewports. |

## Checks at d4185ed

- `pnpm format && pnpm check`: format clean, build OK, **120/120** unit tests (119 + the new one).
- `pnpm test:pages`: **13 pages × 2 viewports pass**, including `atlas/?pack=abrahamic-world-religions` @desktop and @mobile.
- `pnpm test:browser`: not passing here — times out in `waitForFunction` under software GL (same known simulator-Load timeout recorded in round 3; it exercises the simulator, not the atlas). Exact-head CI is the reference for this script.
- Rendered (Chromium 1243, `--use-gl=swiftshader --enable-webgl --ignore-gpu-blocklist`, `vite preview`, `atlas/?pack=abrahamic-world-religions#book=1`, 4 s settle): 3840×2160, 1440×900, 1280×800, 390×844. **No console errors or page errors at any size; no horizontal page overflow** (scrollWidth = innerWidth at all four). Shots: `shots/r4-d4185ed-{3840,1440,1280,390}.jpg` (3840 downscaled 50% to keep under 500 KB).

## Rendered observations (builder evidence, not independent acceptance)

| ID | Size | Observation | Pack-specific? | Proposed disposition |
|---|---|---|---|---|
| R4-T1 | 3840 (visible at all) | Earth land/sea mask is coarse and blocky at 4K; fails the "crisp at 3840×2160" bar. | No — shared Earth engine. Same defect as christian-apocrypha **TA-01** (higher-resolution public-domain land mask, smooth sampling) scheduled on PR #38. | Fix once in the engine (PR #38 TA-01); re-capture this pack after it lands. Blocks Technical: approved for this pack until then. |
| R4-T2 | 390 | Header title and the tab row overlap globe labels; `Wittenberg: Luther Hall` / `Rome: historic centre` labels clip at the left edge; tab row scrolls (CODEX partly off-screen). Info sheet opens over most of the map. | Likely shared atlas chrome (same layout in other Earth packs); not yet confirmed per pack. | Check against another Earth pack in the technical pass; fix in shared chrome if shared. Not a content issue. |
| R4-T3 | 3840 | Panel and Chronicle type is small relative to the canvas (no UI scale-up at 4K). | Shared. | Note for the shared 4K pass; non-blocking. |
| — | all | "Charting surface" indicator still showing at 4 s under SwiftShader. | Shared; software-GL timing. | No action; recheck on hardware GL. |

Content seen in the captures matches the accepted data: the Earth panel shows "25 reference markers" and "Ten heritage markers and fifteen approximate city or site references"; Zurich, Hamburg and Xi'an markers present.

## Release-scope proposal for held features (R3/R4)

Held, all already shown as nonspatial reference cards or (Najaf) as text inside existing records — nothing removed:

| Package | Proposed release treatment |
|---|---|
| Antioch (supported, held) | Ship as its existing card; no marker. |
| Fayette / Whitmer | Ship `chp-fayette` card, nonspatial. |
| Najaf | No marker, no new card; keep the gap listed in Known gaps. |
| Karbala | Ship `ISP05` card, nonspatial; GeoNames candidate stays unadopted. |
| Azusa Street | Ship `chp-azusa` card, nonspatial; no Los Angeles city-context marker. |
| Seesen | Ship `jud-seesen` card, nonspatial. |

Proposal: release with these six features nonspatial and listed as Known gaps (a later pins-only update can add any of them without touching content). This is a scope choice only Mckay can make, so it is asked as **D02** in `docs/universes/DECISIONS.md`. It does not block ChatGPT's recheck of the metadata fix or the technical pass.

## What remains

1. ChatGPT: recheck Q01-R3-L1 at d4185ed (two strings + test + matrix line); canon decision.
2. Engine: TA-01 land-mask fix (PR #38), then re-capture this pack at 4K; R4-T2 shared-chrome check.
3. Mckay: D02 (release scope for held features), then release approval.
