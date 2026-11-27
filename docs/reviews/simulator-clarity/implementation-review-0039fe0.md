# Slice 1 implementation review — fixes required

2026-11-09 UTC (2026-11-08 Denver), ChatGPT. Draft PR47, branch `sim/clarity-physics`, exact audited head **0039fe0aa6f527d33be11da83147929812eba9b7**. PR base observed **9040412aad53e3441e6cc901cb1e18a116af0696**.

**Items 1 and 2 accepted at source scope; item 3 needs the timing correction below. No final technical, scientific-accuracy or release approval.** The implementation is partial: items 4–7 are not included.

## What was inspected and executed

Read the current handoff, folder status/receipt, actual PR diff and complete files at the exact head: **9/9 changed files** (7 source + 2 test files). No earlier review/corrections file existed in this new main review folder.

Independently executed the repository's shader-correctness tests against these fetched source files: **5/5 pass**. These are source/math guards, not GPU compilation or rendered acceptance.

Independently imported the actual exhibit-runtime.ts and executed the source-extracted updateAdaptiveQuality function with a stub recording quality-scale changes. The 3 scenario outcomes below were reproduced. This uses the loop's actual `timing.measured !== null` sampling predicate; no actual frame renderer was simulated. The reproduction script is [reviewer-timing-0039fe0.mjs](reviewer-timing-0039fe0.mjs).

| Controlled foreground trace | Actual wall-clock rate | Accepted measurements | Monitor / adaptive result |
|---|---:|---:|---|
| 30 frames at 0.1 s | 10 FPS | 30/30 | 10 FPS, 2 badge-window updates; quality .8 → .72 |
| 20 frames at 0.6 s | 1.667 FPS | 0/20 | Monitor retains initial 60, 0 badge-window updates; quality stays .8 |
| 400 alternating 1/60 s and 0.6 s frames | 3.243 FPS | 200/400 | Reports 60 FPS, 3 badge-window updates; quality **increases** .8 → .84 |

The steady-slow example's “60” is the monitor's initial value, not a claim that this trace rendered that badge. In an already running application, the last displayed reading would remain stale. The mixed trace does publish the misleading 60-FPS measurement through the current sampling logic.

## Findings

| ID | Severity | Location | Finding and evidence | Required resolution |
|---|---|---|---|---|
| SC1-T1 | Medium | src/exhibit-runtime.ts frameTiming / MAX_MEASURED_FRAME; src/app/loop.ts measurement guards | Every finite frame >0.5 s is assumed to be an interruption. Duration alone does not distinguish a hidden tab/debugger pause from genuinely slow foreground rendering. The independent mixed trace reports 60 FPS at a true 3.243 FPS and raises quality, which can compound load. This exceeds the receipt's “under 2 FPS keeps last reading” Low-gap description and violates the requested uncapped foreground measurement. | Measure finite positive foreground elapsed time, including long foreground frames, or introduce an explicit, justified interruption state that cannot classify ordinary slow rendering solely by duration. Preserve the separate ≤0.03 s simulation step. Reset/discard windows and reset the clock on genuine visibility transitions. Never silently report fast FPS or raise adaptive quality from a selectively filtered foreground trace. |
| SC1-E1 | Low / evidence gap | Slice 1 receipt and return evidence | The receipt reports shader compilation and viewport checks, but this main folder contains no raw browser log, matched capture or reproducible rendered harness. No pause/>4x motion clips are supplied. The five source tests cannot establish these runtime properties. | Attach a reproducible command/harness and raw results at the corrected head, with viewport, build/dev mode, software renderer, exact tested materials and omissions. Include a compact pause/resume/>4x sequence and visibility reset trace; distinguish API-triggered ignition from user interaction. Retain real-GPU/iPhone and matched visual limitations unless actually tested. |

SC1-T1 must be fixed before item 3 is accepted. SC1-E1 is not a newly claimed rendering defect; it prevents an independent rendered acceptance claim. The prior Save/Load failure is builder-reported as also occurring on main; this run did not reproduce that control and does not certify its cause.

## Accepted scope and preserved behavior

- **Item 1, ignition cage:** the entire changed stellarIgnitionEffect is inspected. It no longer constructs the fireball or three icosahedral shells; uses two sprites, one smaller particle burst and lower flash strength. No force update was added. This accepts removal of the geometric cage in source, not the subjective appearance or physical realism of fusion. The description “contracting” should not imply every sprite contracts monotonically; the core still pulses.
- **Item 2, disk shader correctness:** all **3/3** consumers use the matching vec2 vXY interface and per-fragment atan; the vertex-side orbit direction remains local-angle based. The two-phase flow equations are unchanged. The **5/5 specified reversed masks** (three disks, gas vortex, jet) now use ordered edges and an inverted result. The source/math tests pass. No binary interaction or GRMHD claim follows.
- **Item 3, partial acceptance:** a single clock sample feeds separate measured and bounded deltas; 0.1 s produces 10 FPS rather than a clamped ~33. Visibility listeners reset both averaging windows, and the manual-quality early return remains. The foreground-duration rejection remains the blocking defect. The reset helper's comment mentioning interruption resets does not establish that the null-measurement branch invokes it; it does not.
- Physics fixed-step accumulation, speed handling and the 0.03 s bound are preserved in the diff. Pause/high-speed rendered behavior remains unverified here.

## Exact evidence anchors

- src/app/loop.ts: `af52c83f18223e2dc35b593a5205e4be3a0a33da`
- src/exhibit-runtime.ts: `3b133d8f129d486ce250d5ddae3eae0a34830340`
- src/scene/quality.ts: `a3caa43e3280c9414a9bb5ea9e764bddce69388f`
- src/visuals/disk-flow.ts: `974adde08b78ee6b154b9f832e6ded8a502fb826`
- src/visuals/materials.ts: `9e7f26c247726091dfbe5d661d1559cdd5a634bb`
- src/visuals/effects.ts: `25f4abc8933b8cab85f58489e5bf787db119db6f`

## Return criteria

Hand back **fixing / claude** for one bounded repair:
1. Correct SC1-T1 without changing accepted shader/ignition behavior.
2. Add meaningful regressions for sustained slow foreground frames, alternating long/short frames, visibility hide/show reset, invalid deltas, manual quality and capped simulation stepping. The mixed case must not appear fast or increase quality.
3. Return exact head/diff, focused/full test results and the SC1-E1 evidence packet. Builder's earlier 125/125 tests and 12×2 page checks remain attributed; **0 independent GPU/browser cases** were executed in this review.
4. Save the fix before starting later simulator slices; keep items 4–7 separately scoped and do not present the whole handoff as complete.

All 18 pack and 8 review statuses were inspected. Other active reviews remain Claude-owned; no ownership was taken from them. Hierarchy/Narnia/Licanius research-folder blobs are unchanged from the previous run; no stale parallel self-audit was found. No application edits, PR-branch writes, merge, deployment or approval on Mckay's behalf.
