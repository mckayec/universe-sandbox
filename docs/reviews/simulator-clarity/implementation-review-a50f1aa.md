# Kids correction review — a50f1aa

ChatGPT, 2026-11-10 UTC. PR #47, `sim/clarity-physics`, exact head **a50f1aa58ce6e26756a5b0e2b4510c8079a81532**; prior audited head **fb6afbb082c114a05a1ec509b9d4e6dbf4de22a4**.

**Return fixing / claude for the finite SC6-K3 remainder.** SC6-K1/K2 close at source/handler scope. The reserved SC6-O1 compact-overlay visual review is now complete within the supplied viewport scope. Kids 6b is not yet accepted as a whole; item 7 follows its correction return.

## Dispositions

| ID | Disposition | Evidence |
|---|---|---|
| SC6-K1 held touch survives cancellation | Closed at source/handler scope | Every interaction/navigation change invalidates the pending placement and advances its epoch. Release/move validate immediately before placing. Independent five-case actual-handler runner now yields normal 1, Escape 0, disarm 0, pointercancel 0, cancel/re-arm 0; the new arm survives. Parent yields 1,1,1,0,1. Repository regressions additionally cover dialog cancellation, drag and adult controls. |
| SC6-K2 query startup overwritten | Closed at source/startup scope | `startKidsFromQuery()` runs after adult defaults and exhibit preferences, before animation. Repository order regression passes; builder full-startup assertions at both viewports are read and attributed below. |
| SC6-K3 held release activates dialog | Simple single-pointer case fixed; **Medium residual: cross-pointer authorization** | The new capture handlers use one global `kidsPressInDialog` boolean. A different pointer's latest press changes the permission of the pending click. Two actual-handler expectations fail; finite fix below. |
| SC6-O1 guide/legend/dock overlap | Bounded compact-layout correction accepted | Inspected **5/5 carried 6c images** and current unchanged overlay/CSS source. Guide/legend are separated from the clipped dock in 390×844, 720×450 and 320×568 supplied examples. Overflow requires scrolling inside the allotted shares; this is not a claim that all dock content is simultaneously visible. |

## SC6-K3 finite correction

Locations: `src/ui/kids.ts:32–39`, `src/state/app-state.ts:102`.

`notePress` records whether **the latest press from any pointer** began in the dialog; `gate` then authorizes any non-keyboard dialog click from that value without matching the originating pointer. Actual extracted handlers demonstrate both directions:

1. Pointer 7 starts on the canvas. While it remains held, pointer 8 presses inside the open dialog. A subsequent pointer-7 click delivered to the dialog is **allowed**, although its press did not begin there.
2. Pointer 7 starts on a dialog button. Pointer 8 then presses the canvas. Pointer 7's legitimate dialog click is **blocked**, although its own press began in the dialog.

The first case leaves the builder-reported held-release/Leave mechanism unprotected if another contact updates the boolean. The second is an unintended rejection of a legitimate control activation. This is a deterministic handler-policy failure with explicit pointer identities, **not a newly observed browser or physical-device exit**; the reproduction supplies the click target rather than emulating browser hit testing. The first browser scenario must be validated in the correction return, including whether the browser emits/retargets that click for the chosen contact sequence.

Fix authorization so it belongs to the originating gesture/pointer and dialog lifetime; unrelated contacts must neither grant nor revoke it. Handle cancellation and completed gestures without retaining stale permission, and preserve keyboard/assistive activation. Do not simply reject all multi-touch input or all detail-zero activation. Return actual-handler controls for both interleavings plus canceled/reused gestures, and real CDP touch evidence at 390×844 and 844×390. Show the event trace (pointer identity, target and relevant capture state) for the held-release case; preserve normal Stay/Leave, keyboard and single-touch cancellation controls.

Opened primary reference: [W3C Pointer Events Level 3 §4.2.12.1](https://www.w3.org/TR/pointerevents3/#event-attributes), accessed 2026-11-10. Pointing-device clicks retain the causing pointer's identity/type; non-pointing activation has separate identity semantics. [§4.2.12.3](https://www.w3.org/TR/pointerevents3/#event-dispatch) also makes click targeting depend on capture and the associated down/up targets. This supports matching the originating gesture; it does **not** establish that every browser generates the synthetic target sequence in this probe.

[Reviewer runner](reviewer-kids-a50f1aa.mjs) and [output/input manifest](reviewer-kids-output-a50f1aa.json): **8/10 expected behaviors pass at head, 5/10 at parent**. All five held-touch cases pass at head (2/5 parent); dialog controls pass 3/5 at both heads, with different failures. Run from the repository root, or set `SIM_REVIEW_ROOT` and `SIM_REVIEW_HEAD`. Both executions exit 1 because their remaining expectations fail. Adapters replace DOM/rendering only; the relevant handlers and pure helper are actual source.

## Verification, evidence and visual scope

- Inspected **7/7 incremental changed-file patches** and their exact-head files. **15/15 fetched head input Git blob hashes match**; the four parent runner input hashes were freshly checked against GitHub.
- Independent focused repository tests: **17/17 pass** — six cancellation, five Kids and six overlay-budget tests. Two preliminary partial-checkout attempts lacked local feed/inspector dependencies; fetched both at the exact head and reran successfully. Those setup failures are not product failures.
- GitHub CI run **42795357445**, build job **129759057436**: logs independently verify **201/201 units, 113/113 dist files, 24/24 standalone-page cases**, format/build success. CI checked merge **d29974de699bb5b6c912ad789926333ec8c2f545**; recursive tree comparison confirms **238/238 files outside docs are identical to the audited head**. Deploy job and Pages upload/configuration were skipped.
- Read the 6d harness and both raw logs. Builder head evidence independently recounted: **41/41 enforced checks** (12 portrait + 12 landscape Kids cancellation, 3 adult touch, 7 + 7 query-startup), 0 recorded console/page errors. Parent negative control records **4 failed behavioral checks out of 6 reached**, then a fatal missing-dialog/bounding-box error: its summary is 5 failures, not five behavioral cases or a complete matrix. These remain builder SwiftShader runs.
- Re-read the carried 6c harness/log: **303/303 enforced checks + 70 informational rows**. Its scroll-then-hit checks distinguish initially clipped content from reachable content; pointer/keyboard Restart and Exit checks are present. No fresh 6c execution is claimed.
- Viewed **11/11 supplied images**: all six 6d Kids/dialog/query screenshots and all five carried 6c compact-overlay screenshots; all 11 decoded image blob hashes match GitHub. These are supplied captures, not reviewer browser sessions. The 6c “200%” examples are **720×450 CSS-viewport proxies for a 1440×900 browser zoom**, plus 320px reflow, as the harness explicitly states. They do not independently certify real text-only enlargement, device accessibility or screen-reader behavior. The tight dock is visibly clipped and needs its internal scroll.
- Fresh Chromium launch in this run failed before page creation (exit 134, process-singleton socket permission). **0 independent rendered cases**. No full local build, real GPU, physical iPhone/iPad or screen-reader pass. Save→Clear→Load browser smoke remains unavailable/failing historically and was not rerun or counted as passed.

## Handoff and retained gates

Claude: correct only the SC6-K3 gesture-identity remainder and attach the finite return above. Preserve SC6-K1/K2, 6a and SC6-O1 dispositions unless a new regression is demonstrated. Once 6b is accepted, continue bounded item 7 (catalog/units). Prior SC1-E1/SC4-E1, Save/Load and device/accessibility/release limitations remain explicit.

This run read **18/18 pack statuses and 8/8 review statuses** on main, processed both owned implementation returns, and found no stale parallel research audit. No application/PR-branch change, merge, deployment, full canon certification or Mckay release approval.
