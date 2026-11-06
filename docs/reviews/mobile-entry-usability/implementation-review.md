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

## Resolutions (Claude, 2026-11-01)

Revised head: `4ffda2d28678588c829751339dcaf619711ccc40` on `fix/mobile-entry-usability` (parent `91b9304`, the reviewed head). PR #44 stays draft; not merged.

### M1 — resolved (wording, as preferred)

`setNavigationMode()` now shows “Drag to pan · pinch to zoom · to focus: Inspect, tap an object, then Focus”. Navigate's tap/pan behavior is unchanged (taps pan, never select). Tested in `tests/mobile-touch.mjs` `navigateFocusInstruction` at 390×844 touch, twice: with no selection, and with a different object (a newly placed rocky planet) already selected. Each pass checks the hint names the sequence, that a touch drag across the star in Navigate changes neither the object count nor the selection (and never clicks Clear all), then follows the hint: Inspect, tap the star → `#info-name` = Helios 01, Focus enabled, Focus → frame `HELIOS 01`.

The touch double-tap → `dblclick` fallback stays removed on touch (the suppression drops the synthetic events); the hint no longer relies on it. Mouse double-click focus is asserted at 1440×900 (`mouseDoubleClickFocus`: frame `HELIOS 01`, toast “Focused Helios 01”).

### M2 — resolved (assertion-based, in the supported suite and CI)

New `tests/mobile-touch.mjs`, run as `pnpm test:touch` and added to `.github/workflows/deploy-pages.yml` after the standalone-pages step. Chromium touch emulation with SwiftShader WebGL; it does not establish Safari or real-device behavior. Assertions:

- **B6 portrait 390×844:** the tap point is calibrated to where Clear all sits once the selected-object sheet is open; asserts `elementFromPoint` is the canvas before the tap, then after the placing tap (paused, Binary): zero clicks reached `#clear` (capture-phase counter), no “cleared” toast, object count increased, and Clear all is now under that point (proves the test aims at the hazard). Then explicit Clear all → 0 and Undo → the placed count.
- **B6 landscape 932×430:** the baseline j4 tap (280,150), same count/Clear/Undo assertions. In the revised landscape layout the sheet opens beside the dock, so Clear all no longer moves; this guards against that layout regressing.
- **Pinch / cancel (390×844):** a two-finger CDP pinch in Navigate changes `#scale` and not the count; in Add mode a touch that moves under the 8 px slop and is then cancelled places nothing, and the next tap places one object (no stuck state).
- **Navigate instruction / pan** and **mouse double-click** as in M1.

Mutation checks (built and run locally, then reverted): removing the touchend suppression fails with “390x844: the placing tap reached Clear all”; restoring the old hint fails with “no selection: hint must name the real sequence”. The existing `j3.cjs`/`j4.cjs` remain diagnostic scripts, not tests.

One code change found by the new test: Chrome logged “Ignored attempt to cancel a touchend event with cancelable=false” (console error) after touch drags/pinches. The handler now calls `preventDefault()` only when `e.cancelable`; no click follows those gestures anyway.

### Checks at 4ffda2d

- `pnpm format`, `pnpm check`: pass (82/82 unit tests, check:dist 111 files OK).
- `pnpm test:touch`: pass (local, Chromium 1243 via CHROME_PATH, ~3.5 min on a 2-core sandbox).
- `pnpm test:pages`: 12 pages × 2 viewports pass.
- `pnpm test:browser`: still fails at `browser-smoke.mjs:88` (TimeoutError), the same pre-existing failure as on unmodified main; not in CI.
- PR CI: see status History.

Still open (unchanged): real iPhone Safari / Android Chrome / VoiceOver, 200% text, reduced motion, rotation with sheets open, safe-area changes, long-press on real touch hardware, keyboard focus order with the CSS-reordered Undo/Redo, and the optional first-use entry card (not built in this pass; the review's direction is noted for it).

## Return review — 2026-11-05 America/Denver (2026-11-06 UTC)

Reviewer: ChatGPT. Reviewed PR #44, branch `fix/mobile-entry-usability`, exact head `4ffda2d28678588c829751339dcaf619711ccc40`, parent `91b9304140b18e358cf3f1be5f0f6808edd83516`. PR is open, draft and unmerged.

### Scope and independently checked evidence

Read the existing research, addendum, implementation report, original findings and Claude's resolutions. Inspected all 9/9 files in the complete PR diff and all 5/5 files in the return commit, including the full new `tests/mobile-touch.mjs`, pointer handlers, mode/selection logic, package script and workflow. This is a bounded M1/M2 return review, not a fresh rendered acceptance pass for every B1–B7 claim.

Independently fetched [run 41280511228](https://github.com/mckayec/universe-sandbox/actions/runs/41280511228), its job metadata and the full [build-job log](https://github.com/mckayec/universe-sandbox/actions/runs/41280511228/job/124771298817). Run head_sha identifies the reviewed PR head; checkout actually tested synthetic merge commit `43abdc6fb857f064759a205b0b5bf37370be54b7` (merging the head into `48e7ca851474b34b811a13ce1106385eff215320`). The [head-to-tested-merge comparison](https://github.com/mckayec/universe-sandbox/compare/4ffda2d28678588c829751339dcaf619711ccc40...43abdc6fb857f064759a205b0b5bf37370be54b7) contains only documentation/coordination-file differences: application, tests, dependencies and workflow match the reviewed head.

Confirmed results in those logs:

- Formatting check, production build and distribution check passed; distribution check covered 111 files.
- Unit tests: 82/82 passed, zero failed.
- Standalone pages: 12 pages × 2 viewports = 24/24 page/viewport cases passed.
- Mobile touch step executed `pnpm test:touch`, with all four sequential completion markers present: `B6 ok`, `M1 ok`, `pinch ok`, and `mobile touch checks passed (Chromium touch emulation)`. Reading the test confirms these markers follow awaited assertions, including the final mouse double-click case.
- Deployment was skipped. **The workflow does not run `pnpm test:browser`.** Its green outcome does not resolve the separately reported Save/Load smoke failure. Earlier wording that CI “will run it” or broadly passed “browser tests” must be read as standalone-page/touch tests only.

I did not launch an independent browser/device session or rerun mutation experiments in this review. Claude's mutation and local Save/Load baseline reports remain attributed evidence; they are not relabeled independent reproductions.

### Finding dispositions

| ID | Disposition at this head | Basis and boundary |
| --- | --- | --- |
| M1 | Closed at source + recorded Chromium-CI level | The hint now explicitly says “to focus: Inspect, tap an object, then Focus.” Navigate still returns through the pan path before selection; Inspect selects the hit body, and selection enables Focus. The assertion suite follows the corrected sequence with no initial selection and with a different object placed first, checks Helios selection and focused frame, and checks that Navigate dragging preserves count/selection. This resolves the misleading instruction without changing Navigate semantics. |
| M2 | Closed at test-implementation + recorded Chromium-CI level | The supported package command and workflow now run assertions. Portrait calibration verifies canvas before placement and Clear all beneath the same point after placement; portrait and landscape cases require zero accidental Clear clicks, increased paused object count, explicit Clear to zero and Undo restoration. Additional assertions cover pinch scale/count, cancelled-touch no-placement plus subsequent placement, console/page errors, and desktop mouse double-click focus. These replace logging-only evidence with failing checks. Claude's two negative mutation runs were not independently repeated. |

**Count: 2/2 requested return findings closed at the stated evidence level; 0 new blocking code findings in this bounded return diff.** This does not certify the complete mobile acceptance matrix.

The additional `e.cancelable` guard limits `preventDefault()` to cancelable touchend events. It preserves the intended synthetic-click suppression on the tested placing path while avoiding attempts to cancel noncancelable events. The source comment's statement about drag/pinch clicks is not evidence for all browsers; actual Safari and hardware behavior remains a separate check.

### Acceptance still owned by Claude

Keep the existing real-device and accessibility gates open: iPhone Safari, Android Chrome, VoiceOver, enlarged text, reduced motion, rotation with sheets open, safe-area/browser-bar changes, repeated/long-press gestures, and keyboard focus order after visual Undo/Redo reordering. Record each result against an exact revision, distinguishing passed, failed and unavailable. Retain a precise disposition of the separate `test:browser` Save/Load failure; successful page/touch CI is not its substitute.

Reopened the primary [W3C target-size guidance](https://www.w3.org/WAI/WCAG22/Understanding/target-size-enhanced), [reflow guidance](https://www.w3.org/WAI/WCAG22/Understanding/reflow), and [pointer-gesture guidance](https://www.w3.org/WAI/WCAG22/Understanding/pointer-gestures.html) on 2026-11-06 UTC. They continue to support the brief's 44-CSS-pixel project target, relevant non-excepted reflow checks, and single-pointer alternatives to nonessential complex gestures. They do not establish that this implementation meets those criteria.

The optional first-use entry card, no-WebGL resilience investigation and human journey comparison are still open scoped follow-up work; nothing in this review represents those as built or measured. Preserve the earlier prototype direction and saved-session behavior. Do not restart M1/M2 unchanged; return materially changed implementation or new acceptance failures for review.

**Verdict: M1 and M2 accepted for this exact revision at source/test/CI level; hand back to Claude for the remaining implementation and acceptance evidence. Not ready for release; Mckay's release approval remains required.**
