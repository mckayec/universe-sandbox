# PR #44 implementation review

Reviewed 2026-11-01 UTC by ChatGPT.
Exact branch: `fix/mobile-entry-usability`.
Exact head: `91b9304140b18e358cf3f1be5f0f6808edd83516`.
Disposition: **changes requested in the repository handoff; not approval and not ready for release**. No GitHub approval review, code change, merge or deployment performed.

## Evidence and limits

Reviewed all six changed source files, the complete pointer handler and selection logic, the implementation report, and the committed diagnostic scripts `j3.cjs` / `j4.cjs`. Independently verified [CI run 41273407304](https://github.com/mckayec/universe-sandbox/actions/runs/41273407304): completed/success for this exact head. PR remains open and draft.

Claude's report documents working SwiftShader WebGL and touch-emulation captures, unlike the earlier failed live cloud-browser attempt. That is credible implementation evidence, not an independent real-device pass by this reviewer. This review did not execute the app or independently measure screenshots. The reported local Save/Load smoke timeout is explicitly distinguished from successful CI.

## Findings to resolve

### M1 — P2: Navigate's new instruction promises a selection action that does not occur

In `src/ui/controls.ts`, `setNavigationMode()` now says “Drag to pan · pinch to zoom · tap an object, then Focus.” But `src/ui/pointer.ts:128–140` enters the navigation/pan path and returns before `select(hit)` at line 162. On pointerup, the pan path only stops panning; it does not select a tapped body. `src/ui/feed.ts:178–185` enables Focus only when a body is selected.

Consequently, starting with no selection, switching to Navigate and following the displayed instruction cannot select the object; Focus remains disabled. With an old selection, Focus acts on that old object instead. The new canvas touchend suppression also removes the touch double-click fallback described in the implementation report.

Resolve either by making the instruction honest (“Switch to Inspect, tap an object, then Focus”) or by implementing intentional tap-to-select in Navigate without treating a pan as a tap. Prefer the wording-only correction for this bounded pass unless selection behavior is separately tested.

Acceptance: test no selection and a previously selected different object; follow the displayed sequence, verify the intended object is selected/focused, and verify panning does not accidentally select/place objects. This is a source-established control-flow mismatch, not a claimed live-device reproduction.

### M2 — P2: Promote the accidental-Clear regression from logging to assertions

The committed `docs/reviews/mobile-entry-usability/j3.cjs` and `j4.cjs` are useful reproduction evidence, but log object counts/toasts rather than asserting the expected results. They are not wired into the checked package scripts, and PR #44 changes no tests. A future regression could produce the same logs with wrong counts and still exit successfully.

Add an assertion-based regression to the supported browser test suite for the reported B6 touch path: validate the target was the canvas, placement increases the count while paused, Clear is not triggered, and explicit Clear/Undo still restores the scene. Include the portrait and landscape reproductions, plus a touch pan/pinch or cancellation check around the new touchend prevention. Keep mouse double-click focus working. Scope claims to tested input/browser types; do not infer Safari equivalence from Chromium.

Acceptance: assertions fail with the problematic behavior and pass at the revised head; record exact command/head and CI outcome. Do not call the existing diagnostic scripts assertion-based tests.

## Research-to-design assessment

The changes directly address the source audit's target-size, hidden instruction, selected-state and Undo-discoverability findings. Extending the compact breakpoint to short coarse-pointer screens is a focused improvement, and preserving the existing dialogs avoids unnecessary replacement. No physics or pack data changes appear in the diff.

The report correctly leaves entry hierarchy, no-WebGL resilience and actual device acceptance open. Larger targets are the project's 44 CSS-pixel goal; they are not proof of comprehensive WCAG compliance. CSS visual reordering of Undo/Redo does not change DOM/tab order, so keyboard focus-order verification remains necessary.

For the proposed first-use entry card, proceed with a small optional prototype after these corrections: keep existing direct routes available, provide an explicit Free play dismissal, never replace/recover a saved session implicitly, and provide a way to reopen the chooser. “Never shown again” should not be the only way users can reach orientation. Compare entry taps and wrong turns against the current flow; do not claim a usability improvement solely from adding a welcome card. This is design direction within the queued work, not release approval.

## Remaining acceptance gates

Real iPhone Safari, Android Chrome, VoiceOver, 200% text, reduced motion, rotation with sheets open, browser-bar/safe-area changes and human journey measurements remain unrun per the implementation report. Source review and green CI do not close them. Confirm the touch suppression works on the target devices, including long press, selection, pan, pinch, cancelled gestures and repeated interactions.

Claude: resolve M1 and M2, record resolutions against a new exact PR head and return this item for ChatGPT review. Preserve draft status, unrelated branches and Mckay's release gate.
