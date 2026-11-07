# Mobile accessibility return 3 — implementation review

2026-11-07 UTC · ChatGPT. PR [#44](https://github.com/mckayec/universe-sandbox/pull/44), branch `fix/mobile-entry-usability`, exact head **38725238ed2df86910dc24438d9565fd14500d69**, parent **84625b06834fc24ebcabd3a2b17ffff93dd737fe**.

**Verdict: A11Y-1's bounded source/test-coverage correction is accepted.** A11Y-2's prior source closure remains intact: **2/2 implementation findings closed at source-review level**. This is not independent rendered/device acceptance, a whole-site accessibility certification or release approval.

## Actual implementation

Read the actual parent-to-head diff and complete contents of **2/2 changed files** at the exact head:

- `src/style.css`, blob `fb576f9c8de95328c33a797640d7d5b6e8426d3b`: removes the status container's extreme shrink/clipping rule; keeps status width, allows the top bar to wrap and grow, and offsets seven dependent compact-position rules by `--topbar-extra`.
- `src/ui/toolbar.ts`, blob `63d74b08b9f6adaa34ddf55338d8fe066b5fd3af`: registers a ResizeObserver and window resize handler to measure top-bar height above the original 44 px and publish that offset; resets the value to zero outside compact layout.

Also read `src/ui/feed.ts` at this head: its compact-layout media query matches the CSS query. The observer measures the bar itself, while the published variable affects the controls below it, avoiding an obvious direct height-feedback dependency. No history or template change is in this return.

The implemented reflow addresses the source-level cause identified in [return 2](implementation-review-a11y-r2.md). The pre-existing clock omission at widths ≤360 px remains explicitly disclosed and is not counted as a new fix or as a new regression. It does not establish full narrow-screen content accessibility; retain it in the remaining acceptance limitations.

## Coverage repair reviewed

Read [Claude's return](a11y-return-3.md), the complete [r3 assertion script](a11y-r3.cjs), [recorded output](a11y-r3-3872523.txt), and [negative-control script](a11y-r3-negative-control.cjs).

The r3 script now checks count/clock text using long representative values, displayed state, text-range containment, status-container clipping and overlap; it checks the real `#panel-toggle`, fails when absent, toggles and verifies both expanded/collapsed states, and checks each named picker opens and closes. The previous silent selector skip and broad any-panel success condition are corrected. The existing Undo/Redo keyboard regression remains.

The supplied log records **198/198 assertions** across nine viewport/text-scale cases and three keyboard cases. Those results remain **builder-executed**, not an independent rerun. The negative-control script logs old/new geometry; it does not itself assert failure or return a failing exit code for the old behavior. Treat it as diagnostic evidence rather than an independently passing mutation test. No claim of screenshot inspection or native font-scaling testing is made here.

Nonblocking follow-ups for the technical acceptance record: exercise live resize across compact/desktop and text-size changes; verify the downstream panels remain reachable on short landscape screens. The current case matrix creates fresh pages at fixed sizes, so it does not by itself establish those transitions. Native text scaling, screen readers, physical devices and real-GPU checks remain separate limitations.

## CI independently inspected

Read actual [run 42340983341 / build job 128308376750](https://github.com/mckayec/universe-sandbox/actions/runs/42340983341/job/128308376750) logs. They identify tested merge **8ed5392637a1d6cf7b5918440709dd9b6c7c9c70**, merging this head into **5c292c06909d4c52b83996000b445d7323f1baf1**.

Recorded CI passed **118/118 unit tests**, **24/24 page/viewport cases** and the Chromium touch suite; build job succeeded and deploy was skipped. These numbers belong to that merge build, not Claude's separate reported 82-test branch run. This review did not compare the entire synthetic-merge delta or independently run the app, so it does not assert identical head/merge runtime trees. The standalone 198-check script is not established by these CI results.

Claude reports one known Save/Load timeout and one passing test:browser run. Preserve the existing [smoke disposition](save-load-smoke-disposition.md); this return does not demonstrate that intermittency is fixed.

## Handoff

Return **implementation / claude** for remaining technical/rendered acceptance and the existing optional entry/resilience scope. Preserve earlier M1/M2 closures and both A11Y source dispositions; do not request another unchanged source fix. Report any additional implementation at its exact head and keep independent, builder-executed and unavailable checks distinct. No formal PR approval, merge, deployment or Mckay release approval is granted.

**Verdict: bounded implementation accepted; remaining acceptance and release gates stay open.**
