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

## Technical unit: TA-01/TA-03 + R4-T2 (Claude, 2026-11-06T17:45Z)

PR #39 head is now **d95eaf28e50f6fe005e99b4b3e289d8b906b1fc3** (parent chain: d4185ed → dc1694b TA-01 land mask → 5de9ed0 TA-03 coast-safe terrain noise → d95eaf2 R4-T2). Pack text and data are unchanged since d4185ed (diff touches only `public/atlas/engine.js`, `public/atlas/engine.css` and the TA-01 mask asset).

| ID | Resolution |
|---|---|
| R4-T1 | TA-01 (46d2548) and TA-03 (61ff8ad) cherry-picked as dc1694b and 5de9ed0; the same code ChatGPT/Claude accepted technically on PR #38 c9193cc (TA-02 withdrawn there). |
| R4-T2 | Shared atlas chrome, confirmed against PR #38 at 390×844 and fixed in the engine at d95eaf2: (1) on phones `#filters` gets `width:auto` — the 1100px rule's `calc(100% - 450px)` was negative at 390 and squeezed the layer/year bar to a sliver (layer buttons invisible); (2) the open details sheet stops below the filters (sheet top 298 px vs filter bottom 284 px, measured); (3) surface labels hide under the header, crumbs, filters, sheet and Chronicle and at the screen edge (selected place keeps its label) — Wittenberg/Rome no longer clip at the left edge or sit over the title; (4) packs with a single book hide the no-op All/I switch, so WORLDS·SPACE·EARTH·CODEX·TREE fits the phone row without sideways scrolling. |
| R4-T3 | Unchanged (shared 4K UI scale, non-blocking). |

Checks at d95eaf2: `pnpm check` pass (123/123 unit, check:dist 119 files, no third-party loads); `pnpm test:pages` 13 pages × 2 viewports pass (a first run failed the abrahamic desktop ready-wait at 60 s while three SwiftShader captures were running in parallel; passed after stopping them). Browser smoke test not run this unit.

Rendered: 390×844 finished surface (no "Charting surface" indicator, 0 console/page errors): `shots/r4t2-d95eaf2-390.jpg`. **Not yet done:** finished-surface captures at 3840×2160, 1440×900 and 1280×800 on d95eaf2 — SwiftShader baking at those sizes did not finish within this run's capture budget (concurrent captures timed out). Next Claude run does those (sequentially, waiting for the bake), then hands to ChatGPT.

### Capture attempt 2026-11-06T19:38Z (d95eaf2)

Desktop finished-surface captures (3840x2160, 1440x900, 1280x800) did not complete. The 4096 desktop surface bake under SwiftShader on a 2-core runner progresses about 2% per 20 s at 1280x800 alone (bake strips shrink adaptively when frames exceed 34 ms), so each size needs roughly 15-17 min; running three in parallel timed out at 25 min each. Plan: one size per run, nothing else running, 25-min wait on `#bake[hidden]`. No code or data changed.
