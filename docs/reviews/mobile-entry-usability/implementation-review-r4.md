# Mobile return 4 — independent implementation review

2026-11-07 UTC · ChatGPT · PR44 `fix/mobile-entry-usability`, exact head **2e305cc24ad714be8211d839d283d114748a4310**, parent **38725238ed2df86910dc24438d9565fd14500d69**. PR open/unmerged at review.

## Scope and evidence
Inspected 2/2 changed files, complete setup.ts and style.css, the existing implementation and A11Y-r3 reviews, acceptance-r4.md, accept-r4.cjs and actual template.ts at the head. The return modifies renderer initialization and adds one CSS rule; prior M1/M2 and A11Y-1/A11Y-2 source closures remain intact.

R4-1's no-WebGL explanation is accepted at source and isolated execution level. Independently extracted the exact createRenderer function (removed only its TypeScript return annotation) and executed it in Node VM: **4/4 cases passed**. Three successful device-tier constructors retain antialias/alpha/powerPreference and append no notice; the throwing constructor appends exactly one alert with the expected ID/text and rethrows the identical error. These are mocked-DOM checks, not rendered accessibility tests. The inert underlying toolbar remains a disclosed limitation, not a repaired interaction.

GitHub reports run [42353998757](https://github.com/mckayec/universe-sandbox/actions/runs/42353998757) completed successfully for this head. This review checked run metadata, not its job logs or synthetic-merge tree; it does not newly certify unit/page counts. Claude's 132/132 browser results and negative control remain builder-attributed.

An independent browser probe was attempted: bundled Playwright browser executable was absent; installed /usr/bin/chromium then failed at process-singleton socket creation with Operation not permitted. No rendered or physical-device pass is claimed.

## R4-T1 — Medium: acceptance predicates can pass without the promised behavior

| Location | Evidence | Required repair |
| --- | --- | --- |
| accept-r4.cjs §3, picker closure | Actual template uses a div with role=dialog, not a dialog element. The closure expression ends in `|| !el.open`; a div has no native open state, so undefined makes that branch true even while the picker is visible. | Remove the open-property alternative. Assert the actual hidden/display state after closing; first assert the picker visible before closing. Add a negative control leaving it open and demonstrate failure. |
| accept-r4.cjs topOk, “Pause reachable” | layout() returns both shown and on, but Pause asserts only shown. Off-screen controls can retain positive dimensions and pass. | Require shown AND on (and, where occlusion is possible, a usable hit target). Demonstrate failure with Pause moved off screen. Keep the same resize/rotation/text-size population. |

This is **one evidence-quality finding with two concrete repairs**, not evidence that the current UI actually fails either interaction. Do not change application code unless the repaired assertions expose a real failure. Also make the disabled-WebGL precondition an assertion rather than informational output in §6.

The optional entry-card deferral is acceptable as explicitly separate scope. Physical-device/screen-reader, native text sizing, safe-area and Save/Load limitations remain disclosed. Claude's proposed post-release device check cannot grant Mckay's release approval or label those checks passed.

## Handoff
Return fixing/claude for the bounded test repair and exact-head assertion output, including the two negative controls. Preserve R4-1 and previous source closures. If only documentation tests change, do not repeat the unchanged renderer audit. No application edits, formal PR approval, merge or deployment performed.

**Verdict: changes requested — R4-1 implementation accepted; R4-T1 acceptance evidence incomplete.**
