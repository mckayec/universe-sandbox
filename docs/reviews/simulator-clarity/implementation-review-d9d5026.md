# Slice 1 timing re-review — source correction accepted

2026-11-09 UTC, ChatGPT. PR #47, branch `sim/clarity-physics`, exact audited head **d9d5026a7d94ac22a1816c65dabb9217f823e071**, compared with **0039fe0aa6f527d33be11da83147929812eba9b7**. PR remains draft; observed base 9040412aad53e3441e6cc901cb1e18a116af0696.

**SC1-T1 is closed at source and executable timing-test scope. Item 3 is accepted at that scope.** Items 1–2 retain their previous source-only acceptance: their shader/ignition files did not change in this five-file delta. This is not full rendered, scientific-accuracy or release approval. Items 4–7 remain unimplemented.

## Independent checks

Read all **5/5 changed files** in full at the exact head, the actual GitHub comparison, previous review, current receipt, evidence harness and raw JSONL. Executed the exact-head repository tests with Node 24.22.1: `node --test tests/exhibit-runtime.test.ts`, **10/10 passed** (runtime and planet-climate dependencies fetched at the same head).

The new [reviewer reproduction](reviewer-timing-d9d5026.mjs) imports the actual runtime helper and executes the actual source-extracted quality wrapper against a stub recording render-scale changes. It separately executes the visibility listener with document/clock stubs. It does not instantiate a renderer.

| Independent trace | Measurements counted | True wall-clock FPS | Reported rounded FPS | Quality scale | Raises |
|---|---:|---:|---:|---:|---:|
| 30 × 0.1 s | 30/30 | 10 | 10 | .8 → .72 | 0 |
| 20 × 0.6 s | 20/20 | 1.667 | 2 | .8 → .62 | 0 |
| 400 alternating 1/60 s and .6 s | 400/400 | 3.243 | 3 | .8 → .62 | 0 |

**3/3 trace expectations passed.** Every step stayed at or below .03 s. **1/1 visibility-listener stub scenario passed:** clock reset invoked, explicit interruption set, both partly filled measurement windows cleared, interrupted measurement excluded, later .6 s foreground delta retained. Loop consumption of the flag was checked in source; this is not a real background-tab test.

The full focused test file also verifies smooth-frame quality increase, manual-mode stability, invalid deltas and monitor reset. Moving adaptive-window logic into the runtime helper preserves the 2.5 s window, 43/57.5 thresholds, floor, ceiling, adjustment increments and dead band. The quality wrapper copies updated counters back and applies only a non-null target.

GitHub reports exact-head **build success** and **deploy skipped**, run [42558704479](https://github.com/mckayec/universe-sandbox/actions/runs/42558704479). This is check metadata, not independent execution of the full suite here or deployment evidence. The receipt's 130/130 full tests and distribution/build results remain builder-attributed. Independent browser/GPU cases in this review: **0**; browser rerun not performed, not claimed unavailable.

## Findings and evidence disposition

| ID | Disposition | Evidence / remaining limit |
|---|---|---|
| SC1-T1 (Medium) | Closed for this head | No duration ceiling rejects slow foreground frames. Explicit visibility flag drops one measurement; physical step remains capped. All three old reproduction traces now behave correctly. An OS/debugger pause without a visibility event is measured as a long frame, as disclosed; this is not the former selective-filtering defect. |
| SC1-E1 (Low evidence gap) | Raw-evidence delivery satisfied; rendered acceptance remains partial | Harness and raw JSONL now exist. They supply attributed observations, not independent GPU acceptance or a complete behavior pass. Carry the limits below into final technical acceptance. No new source blocker prevents the next bounded implementation slice. |

Evidence limitations from direct harness/log inspection:

- **2/2 viewport logs** record zero page/console errors and zero shader/program messages; desktop separately counts four driver performance notices. Only **1/2 viewports** attempted the black-hole placement path. Compact view skipped it because the palette was collapsed. Moreover `placedByUi` is computed from palette visibility, not a verified selected/new black-hole identity.
- Pause logs show frozen whole-second mission time in **2/2** sizes; resume advanced in **1/2**. Desktop `advanced:false` is an observed incomplete resume check, plausibly consistent with capped simulation progress on slow software GL. That explanation is not independently demonstrated by this log. Use simulation-time instrumentation or a sufficient deterministic wait for acceptance.
- Both 10× runs logged mission-time changes. That does not prove disk motion, visual speed capping, pause of disk motion, or all changed material variants compiled.
- The throttling logs have lower before/after FPS readings in **2/2** sizes. They do not log frame deltas, adaptive scale or the full intermediate trace, so they cannot establish “never reported a fast reading.” The independent controlled traces establish the repaired algorithm's behavior separately.
- `setHidden` overrides `document.hidden`/`visibilityState` and dispatches an event. It does **not** actually background/suspend the page; requestAnimationFrame may keep running during the three-second wait. This checks the synthetic event path, not exclusion of a genuine hidden interval.
- The harness exits nonzero for console/GL problems only. Failed `frozen`, `advanced`, placement, speed or timing expectations do not fail the run. Do not summarize its exit status as all interactions passing.
- Ignition is not triggered by this harness. Three disk variants, vortex and jet are not individually enumerated as instantiated/compiled. No independent screenshot/seam judgment was performed here. Real GPU, physical iPhone/Safari, matched before/after clips and disk-motion video remain unverified. The Save/Load failure/control was not rerun.

## Handoff and precise continuation

Return **implementation / claude**. Continue the next bounded item from the existing handoff (item 4 disk readability/binary response), keeping units/model claims explicit and preserving accepted slice 1 behavior. Do not reopen unchanged research or claim the whole simulator request complete.

Before final technical acceptance, strengthen the evidence harness: enforce outcome assertions; verify an actual black hole in desktop and compact view; enumerate/material-test all affected shader variants; trigger ignition; capture disk pause/10× behavior; and distinguish synthetic event dispatch from genuine background/resume evidence. Return exact new head, changed-file list, raw results and explicit not-run checks with the next slice. These are remaining acceptance gates, not newly certified defects in unchanged shaders.

Reviewed source blobs: loop d9089457ea03683a90a56baa91fd8528dce41489; runtime ea70ed35e9b90cdf3e9af529d67d6a4a7887e876; quality e93515b362576e9fb7a314d9c5c488d6fc5f7317; app-state 06d39b2c9c0e97631ab0cba3f55871abee2a4d7a; tests fc5b6d5d6cf36c1956a24f7cfbe89203467c6052. Reviewed harness blob 08b33811bfe0508b309a5194f105127c4fc946c0 and JSONL d65ddbbe6c1ab2342789b6ff3740e8495c0013d8.

Run routing: **18/18 pack and 8/8 review statuses** inspected. No other ChatGPT-owned work. All three research-ready folders unchanged from main fd922e1e3703d7ffb9132cc3057f6597e067d09c, so no stale parallel self-audit. D09 remains the previously reported owner blocker. No app edits, PR-branch writes, merge, deployment or owner approval.
