# SC4-E1 evidence review — 3ab737f

ChatGPT, 2026-11-10 UTC. PR [47](https://github.com/mckayec/universe-sandbox/pull/47), branch `sim/clarity-physics`, exact unchanged head **3ab737fe90991767b3cebf5410dc5a1c3b7a6f84**.

**Accept the bounded flyby/state evidence; SC4-E1 remains partially open for reliable motion recording and alignment.** The new evidence advances the request substantially, but does not yet support whole-gate closure. Return to Claude for the small capture repair below. Prior source/behavior acceptances and SC7-E1 closure stand. No final technical sign-off or release approval.

## What was independently checked

Read the full [return](sc4e1-return-3ab737f.md), [harness](evidence-harness-sc4e1.mjs) (blob `2f5b20821de739336f2dfb9db19741be4ea55cbb`), [raw log](evidence-sc4e1-3ab737f.jsonl) (blob `a5360d9e6e8bd9d6d5c03d3838974bc510ee2589`), and [preceding request](packet-review-3ab737f.md). Fresh PR metadata confirms the same open head, so there is no new application diff since the preceding implementation review.

Fresh exact-head source reads: `src/visuals/update-visuals.ts` blob `51616ce0ad0cdedad2f1b82fac0e8a22e5e07ff4`, `src/visuals/disk-flow.ts` blob `ebcf93ce89728dd3fd31ecd80c5ebf77bbe25f5b`, `src/app/loop.ts` blob `9b289fcf767e7eea093333f28638e06da120750b`, `src/celestial-catalog.ts` blob `37d23d4bfd2539424345e3afb728ef7f9057e99f`.

- Recounted **89/89 successful scenario log entries** (11, 12, 12, 12, 14, 14, 14), plus **2/2 aggregate checks**. Six scenario entries merely record energy with unconditional `true` (harness line 239): this is **83/83 conditional scenario assertions + 6/6 informational records**, not 89 distinct validations.
- Independently recomputed all **6/6 initial energies**, **7/7 freeze inequalities** and **7/7 elapsed-time ratios** from the supplied raw values; ratios range **9.802–10.392**. Both flyby series keep body count two (86 desktop samples, 56 compact samples), with an interior separation minimum and recession.
- Viewed **7/7 supplied contact sheets**. Downloaded and fully decoded **7/7 MP4s** with ffmpeg, no decode errors; **7/7 downloaded blob hashes match GitHub**. Decoding is file-integrity validation, not a fresh simulation or a claim of frame-by-frame visual inspection.
- Desktop MP4s are **640×400, 12 fps encoded** (recorded viewport 1280×800); compact MP4 is **390×844, 12 fps encoded**. Encoded frame rate does not establish rendered application FPS. Source/render timing remains builder evidence.
- **0 independent browser/rendered cases and 0 fresh application-test executions** in this evidence-only review. Historical tests/CI at the identical head remain historical. No physical-device or real-GPU acceptance.

## Accepted bounded evidence

| Unit | Disposition |
| --- | --- |
| Deterministic setup and state | Seven log rows record paused restored black-hole scenes, selected host and subsequent requested speeds. Initial positions/masses match the listed scenarios. These are inspected builder results, not a general Save/Load gate pass. |
| Actual unbound flyby | Both initial relative energies recompute to **+30.2207056** using the model's G=1.05. Desktop separation falls to **14.891** then rises to **137.128** in the sampled series; compact reaches **15.093** then **174.978**. All sampled counts remain two. This resolves the earlier absence of an enforced non-merging flyby. It is model evidence, not validation of astrophysical GR. |
| Tidal response and cleanup | Recorded peak tides approximately 0.938/0.940 relax to 0.00793/0 at later probes. Wide-equal tide 0.429 is below close-equal 0.940. Merger has one selected 1200-mass survivor and later zero tide/Undisturbed. Accept these at builder-state-evidence scope. |
| Coverage inventory | All **7/7 requested scenario categories** have artifacts; equal overlaps wide/close/flyby/merger. Compact coverage is flyby only. Merger 10× is the survivor, not an intact pair, as disclosed. This closes the missing-artifact inventory, not every motion acceptance criterion. |

## Residual findings

| ID | Severity | Location / evidence | Required disposition |
| --- | --- | --- | --- |
| SC4-E1-R1 | Medium evidence defect | Harness lines 206–219 start video recording and navigate/wait before `t0` is assigned at line 234. `videoSeconds` at 235 is therefore not an established video presentation timestamp. No offset calibration or transcoding timeline manifest is supplied. The sheets expose the problem: the close-equal and merger frames labeled initial paused show the template single black hole rather than the restored pair; compact frames labeled 10× still show the earlier speed selection. | Establish one video/log clock alignment (visible harness markers or measured per-clip offset), then regenerate accurately labeled sheets/window boundaries. Preserve the distinction between startup/template, restored pause, 1×, 10× and post-merger. Do not infer a fixed offset common to all clips. |
| SC4-E1-R2 | Medium evidence defect | `page.screenshot({clip:…})` at line 175 runs during video capture. Sheets visibly contain grey partial frames, particularly isolated and close-equal. Builder attributes them to recorder behavior, but no clean control recording establishes that cause. Meanwhile `crops` receives one `hostScreen(before)` at line 264 and uses that same center for all four frames: it does **not** track moving bodies frame by frame. Translation/background/occlusion can satisfy the “material motion” difference check. Numeric freeze checks compare pause with **1× only**, not 10×. | Supply clean full-frame motion windows without clipped-screenshot capture during recording. Derive crops offline from those frames (or a separate non-recording metric pass), tracking the same disk if moving. Use the stationary isolated scene for the clearest material-motion/highlight demonstration at pause/1×/high speed. Retain pair/flyby state evidence without calling raw moving-ROI differences proof of disk shear. |

Additional measurement qualification: `updateVisuals` line 165 uses **`diskDt = paused ? 0 : dt * min(speed, 4)`**, and line 256 advances Kepler shader time with that value. Physics elapsed time advances separately through fixed steps in `loop.ts`. Therefore a 10× physics elapsed ratio does **not** measure a 10× shader phase rate; the intended disk display multiplier is capped at 4×. The return's inference from `app.elapsed` to disk phase is only indirect. Preserve the accepted display cap; no code change is requested. The isolated same-sided brightness metric supports broad highlight consistency, but is not a spatial proof of shear at multiple radii. Clean visible sequence evidence is needed alongside the source relationship.

## Bounded next unit

1. Repair recording/alignment only, at this same candidate head if unchanged. Start with clean **isolated paused/1×/10×** and **flyby approach/closest approach/recession** windows; retain the already accepted 2/2 state series and 7/7 scenario inventory.
2. Avoid clipped screenshots during capture; show segment markers or publish a measured mapping from log time to clip PTS. Keep the disk large enough to see texture movement. Use full-frame extraction for sheets/crops and explicitly describe the 4× display cap.
3. Reuse unaffected existing scenario footage only after correct alignment and verification that each claimed window is unobscured. Re-record only contaminated/missing windows; do not redo unrelated code or all historical tests solely for this docs/evidence repair.
4. Return the repaired artifacts and exact head immediately. Distinguish builder observations, reviewer inspection and genuinely independent execution.

SC7-O1 Low dock clipping, Save/Load strict five-consecutive-run gate, legacy non-hole unit labels, 200% text/screen-reader coverage, SC1-E1/device/GPU/background and independent-rendering limits remain exactly as in the preceding packet review. None is closed or silently waived here. No request for Mckay to act on these repairable evidence issues.

Inspected **18/18 pack statuses and 8/8 review statuses** this run. The agreement and both sign-offs are unchanged; all three parallel research folders remain unchanged/current. This review changes documentation and hands the simulator evidence repair to Claude; it does not edit application files or PR branches, merge or deploy.
