# Deep worlds — DWT-03 fix at PR37 5bfde31

- Builder: Claude, 2026-11-08T18:19–20:32Z. Exact head: `5bfde313d819ab89e273af4b9c6a5f788d6d6f3d` (atlas/deep-worlds; parent `311e9fefa4bad16dff40e909d57f0b450532b216`). Builder-executed, not independent. Not merged.
- Application change: `public/atlas/engine.js` only (+7/−3). Probes and outputs on main in this folder.
- Full diagnosis and per-run tables: [rendered-diagnosis-311e9fe.md](rendered-diagnosis-311e9fe.md) (checkpoints 16:20Z → 20:32Z).

## Cause

`doLeavePlace` (place entered straight from the galaxy), `openEvent(…, true)` (world → other world) and `goPlace` scheduled `setTimeout(() => selectSite(site), …)` with no ownership check. Under a busy main thread the timer could fire after a newer navigation (e.g. the next tour step's fane entry), renaming `S.site`/URL and bumping `placeGen`, so the newer entry was cancelled or left split (state/URL on one site, rendered place on another). Trace evidence: [dwt03-trace-output-311e9fe-1440-g150.txt](dwt03-trace-output-311e9fe-1440-g150.txt).

## Fix

`selectSiteLater(wid, sid, ms)` captures `placeGen` and calls `selectSite` only if `placeGen` is unchanged and the same world is still selected. Used at all three call sites. Restore-from-URL startup path unchanged.

## Evidence at 5bfde31 (builder-run; `pnpm build` + `vite preview`, Playwright Chromium + SwiftShader, trusted pointer input, one browser at a time)

| Check | Result |
| --- | --- |
| `pnpm check` | format, build, 125/125 tests, check:dist 175 files OK |
| DWT-03 directed repro, Dune b3, 1440×900, gaps 0 / 150 / 400 | **PASS** all three — fane / ev c6 / `site=fane&view=place&lm=steps` consistent at +5/+20/+40/+60 s; no page errors ([g0](dwt03-trace-output-5bfde31-1440-g0.txt), [g150](dwt03-trace-output-5bfde31-1440-g150.txt), [g400](dwt03-trace-output-5bfde31-1440-g400.txt)) |
| DWO-E2 matrix, 1440×900 + 390×844 | **ALL PASS 90** ([output](dwo-e2-browser-output-5bfde31.txt)) |
| v2.1 rendered probe, Cosmere b10, 1440×900 | **ALL PASS 19** ([output](dwt02-rendered-v21-output-5bfde31-1440-cosmere.txt)) |
| v2.1 rendered probe, Dune b3, 1440×900 | **ALL PASS 19** ([output](dwt02-rendered-v21-output-5bfde31-1440-dune.txt)); ~20 min under SwiftShader |
| v2.1 rendered probe, Cosmere b10, 390×844 | **ALL PASS 19** ([output](dwt02-rendered-v21-output-5bfde31-390-cosmere.txt)) |
| v2.1 rendered probe, Dune b3, 390×844 | **ALL PASS 19** ([output](dwt02-rendered-v21-output-5bfde31-390-dune.txt)) |
| `pnpm test:browser` | first run failed at the known pre-existing Save/Load count wait (`browser-smoke.mjs:88`, not engine.js); immediate rerun passed |

All v2.1 runs: no page errors. DWT-02 cases (C0, R2x, R3x, R6, R6b) stay fixed on this head at both widths for both pairs.

## Limits

- Builder-run only; SwiftShader on a 2-core runner, no physical device or real-GPU timing.
- Parent-side v2.1 pairs at 311e9fe were not rerun for Dune 390; parent controls for DWT-03 are the 311e9fe repro/trace outputs.
- Pre-existing Save/Load smoke race unchanged (tracked under mobile-entry-usability).
- No canon, full technical or release approval implied.

## Requested review

ChatGPT: review the 1-file delta 311e9fe→5bfde31 and the evidence above; close DWT-03 or return findings.
