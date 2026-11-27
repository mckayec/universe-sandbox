# Item 7b implementation review — 3ab737f

ChatGPT, 2026-11-10 UTC. PR [47](https://github.com/mckayec/universe-sandbox/pull/47), branch `sim/clarity-physics`, exact head **3ab737fe90991767b3cebf5410dc5a1c3b7a6f84**, parent **660cfaf36d838d35dc2aae0f0ed99bb16907b324**.

**Accept bounded 7b at source/behavior scope. Return to Claude for the final technical/evidence packet, including SC7-E1 below. Do not mark the whole simulator handoff ready for owner yet.** No new High/Medium code defect reproduced. No release approval.

## Inputs and independently checked results

Read [7b return](sc7b-return-3ab737f.md), [prior review](implementation-review-660cfaf.md), all **14/14** incremental patches, relevant exact-head integration paths, [rendered harness](evidence-harness-7b.mjs) and [raw log](evidence-7b-3ab737f.jsonl). Downloaded exact-head inputs and verified **20/20** Git blob hashes locally.

- **9/9** focused repository tests pass: `node --test tests/black-hole-reference.test.ts`. Some integration tests assert source wiring; they are not full runtime persistence/physics tests.
- Independent checks: **7/7** pass. Executed the actual setter extracted with Node's TypeScript stripper and stubbed history/render/toast callbacks; verified reference-only mutation, one history step, no-op/non-hole guards and clearing. Executed real pure functions for linear growth, all four referenced/unreferenced merger combinations and input immutability. Executed actual save/load JSON functions using in-memory localStorage and the real sanitize boundary. Checked dimensional scaling independently (time squared, length cubed).
- [Evidence and reproducible runner source](reviewer-reference-output-3ab737f.json) contains the checks, input manifest and `runnerSource`. To reproduce, materialize that string as `reviewer-reference.mjs` at the audited checkout root and run with Node 24.22.1. Stubs do not prove full undo reconstruction, actual DOM interaction or collision trajectories.
- Independently retrieved CI [42831060743](https://github.com/mckayec/universe-sandbox/actions/runs/42831060743), build job **129880885133**, and logs: format/build success, **224/224** unit tests, **113/113** distribution files, **24/24** page/viewport checks (12 × 2). CI checked merge **2676af2dc248e0f1a5c3aa299284c98a414ade7d**; recursive trees show **243/243** files outside docs identical to this head. Deploy skipped.
- Builder log independently counted **73/73** passing checks. These remain Claude-run Chromium/SwiftShader results. The log covers initial picker state, selected reference, mass/radius/position unchanged, undo/redo, Save→change→Load, two referenced holes merging to 35 solar masses, and hiding on rocky selection. Save→Load without Clear does not resolve the existing Save→Clear→Load gate.
- Viewed **3/3** screenshots: [desktop](shots/sc7b-1440x900.png), [portrait](shots/sc7b-390x844.png), [landscape](shots/sc7b-844x390.png). Desktop/portrait show the picker and reference reading; landscape shows the panel above the reference row.
- Fresh independent browser attempts: bundled Chromium executable missing; installed Chromium aborts before page creation at process-singleton `socket()` with Operation not permitted. **0 independently rendered cases**. No physical Safari/iPhone, real-GPU, screen-reader or external-link activation pass claimed.

## Design dispositions

| Topic | Disposition |
| --- | --- |
| Reference scale and linear horizon | Accepted as an explanatory per-body scale. Picking 30 solar masses for model mass 600 fixes factor 0.05; model mass 1,200 reads 60 and horizon 177 km. Model mass, radius, position and velocity are not changed by the setter. The displayed preset records its origin, not a promise the growing body remains at its original mass. |
| Merger semantics | Accept documented teaching choice, not relativistic merger physics. Two referenced masses add; otherwise the one available factor applies to the total. No gravitational-wave mass-loss prediction is made. Both undefined remains undefined. Mixed factors are not a scene-wide physical calibration. |
| Persistence/transform | Snapshot copies the record; restore sanitizes known origin and positive finite factor for holes only; old saves have none. Non-hole transforms clear it. Setter records history before mutation. Local storage round-trip verified; full undo/redo/merge integration remains builder-run evidence. |
| Physical separation | The delta changes the merger reference record before the unchanged mass-growth path. Contact/picking/display formulas are unchanged and do not consume the reference. Reported horizon uses the catalog's linear nonspinning formula, not cube-root visual growth. |
| Scene-wide units | The formula mu_sim = mu_SI × T0²/L0³ follows dimensionally from length/time rescaling and passes independent scaling checks. This head documents an optional mapping but fixes neither L0 nor T0 and does **not implement a calibrated scene-wide SI conversion**. Accept the handoff's honest-model-unit alternative for black holes only. |
| Legacy Earth-mass labels | Disclosed, unchanged follow-up outside this bounded black-hole unit. Do not claim the entire scene has honest physical units or that all item-7 scope is physically calibrated. Claude must carry an explicit disposition in the consolidated packet. |
| Prior findings | SC7-C1/C2 and SC6-O2 remain closed at their recorded scopes. Prior SC1-E1/SC4-E1, Save/Load and device/accessibility/release limitations are not superseded. |

No new astronomical source claim is certified here; catalog science/source checks are inherited from the prior review. This run checks implementation and dimensional algebra, not new canon research.

## Evidence finding to close before final technical sign-off

| ID | Severity | Location | Finding/evidence | Required next step |
| --- | --- | --- | --- | --- |
| SC7-E1 | Low | evidence-harness-7b.mjs: reference-row fit and picker interaction; shots/sc7b-844x390.png | The “no clipping” fit check verifies horizontal bounds only. At 844×390 the supplied capture does not show the picker/readout. `selectOption` programmatically sets the select, and the comment saying “keyboard-change” is not accompanied by a keyboard-change action. Thus visible vertical reachability and keyboard operation of the new control are not established by these checks. This is an evidence gap, not proof the control is inaccessible. | Scroll the short-landscape inspector to the row, assert vertical visibility of picker/readout, operate it with keyboard and capture the visible result. Return enforced assertions/raw log and screenshot at the exact candidate head; include focus semantics in the technical packet. |

## Handoff

Set **implementation / claude**, next: consolidate an exact-head final technical/evidence packet for items 1–7, close SC7-E1, and explicitly disposition inherited SC1-E1/SC4-E1, Save→Clear→Load, legacy mass labels and device/GPU/accessibility limits. If source changes, return the new exact head for relevant review. Do not infer whole-handoff completion from the bounded 7b acceptance, and do not replace Mckay's release approval.

Checked **18/18 pack statuses and 8/8 review statuses** on current main. No other owned item or stale parallel self-audit: Hierarchy/Narnia/Licanius folders unchanged since the preceding run. WIP prevents opening new research. Agreement and both sign-offs unchanged. No application/PR-branch edit, merge, deployment or owner approval.
