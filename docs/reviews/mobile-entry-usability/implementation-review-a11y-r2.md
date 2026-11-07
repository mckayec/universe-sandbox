# Mobile accessibility return 2 — implementation review

2026-11-07 UTC · ChatGPT · PR [#44](https://github.com/mckayec/universe-sandbox/pull/44), branch `fix/mobile-entry-usability`.

**Disposition: A11Y-2 closed at source-review level; A11Y-1 partially fixed and returned to Claude.** Both requested items reviewed (2/2); 1/2 closed, 1/2 remains open. This is not rendered/device acceptance or release approval.

## Exact scope and evidence

Audited head: **84625b06834fc24ebcabd3a2b17ffff93dd737fe**. Return parent: **d699aaacdbd2cf381dab3808dcbe8f4ebcdd0242**. Inspected the actual [return diff](https://github.com/mckayec/universe-sandbox/compare/d699aaacdbd2cf381dab3808dcbe8f4ebcdd0242...84625b06834fc24ebcabd3a2b17ffff93dd737fe) and all **3/3** changed files at that head:

| File | Blob SHA | Review |
|---|---|---|
| `src/style.css` | `7bd4143080bddfad5b399d18fdec507b9d635a16` | Wrapping labels, compact flex sizing, removal of toolbar order overrides |
| `src/ui/template.ts` | `6e2ec0050bc31a13b0ff21d247de06c6c8146ae3` | Actual toolbar DOM order; status spans and tool-panel toggle |
| `src/state/history.ts` | `c0c7ad06e763d4cf0525e784977231e8c6edfcbc` | Focus handling when an Undo/Redo button disables itself |

Read [previous accessibility review](implementation-review-a11y.md), [implementation review](implementation-review.md), [Claude's return](a11y-return-2.md), the complete [assertion script](a11y-r2.cjs), and its [recorded output](a11y-r2-84625b0.txt). Claude's output is evidence supplied by the implementer, not an independent rerun. No new local browser, physical-device, native font-scaling or screen-reader session was run; the referenced screenshots were not independently inspected.

## A11Y-1 — partial; remaining content loss and a coverage gap (Medium)

The label fix is materially better: CSS lines 2325–2332 allow full labels to wrap instead of ellipsizing, retain a 44 px minimum width, and allow height to grow. The source implements the previous requested direction. Claude's 9/9 recorded viewport/scale cases cover 390×844, 844×390 and 320×568 at 100/150/200%; the label checks inspect text ranges and clipping. Breaking a word at 320 px is not itself a reason to reject this return.

However, lines 2315–2318 give the object-count/mission-clock container `flex: 0 9999 auto; min-width: 0; overflow: hidden`. The template contains plain status spans, with no disclosure control or indicated full-value reveal. This deliberately lets status content collapse before the action labels. Claude explicitly reports that count/clock become unreadable at 200% on phones. I do not accept that trade-off as completion of the enlarged-text work: the count and elapsed time remain information a user needs, even though they are not buttons.

The [W3C explanation of Resize Text](https://www.w3.org/WAI/WCAG22/Understanding/resize-text.html), opened for this review, calls for retaining content and functionality up to 200%; its allowance for truncation requires an indicated way to obtain the full content through focus or activation. Nothing in this return demonstrates that alternative for these status values. This is an acceptance finding based on the actual CSS and the reported reproduction, not a claim that an injected text-scaling fixture establishes whole-site WCAG conformance or nonconformance.

The existing max-width:360 px rule already hides the clock. Do not misclassify that pre-existing 320 px behavior as a new regression introduced by this commit. The new return must at least resolve the reported enlarged-text loss at 390 px and preserve the object count at the narrow baseline, with any remaining deliberate omissions explicitly dispositioned.

**Required bounded correction:**

1. Keep full count/time information available as text grows—prefer reflow into a suitable status row, or provide a clearly indicated, touch- and keyboard-operable way to read complete values. Merely hiding or clipping the values is not an acceptance fix. Preserve the improved labels and targets.
2. Extend the 9-case text matrix to assert actual status-value availability, including representative multi-digit counts and longer elapsed values. Check visibility/clipping or exercise the complete alternative disclosure, not only DOM presence. The current 126 checks do not probe status text.
3. Repair the overlap probe: it queries `#tools-toggle, .tools-toggle, [data-tools-toggle]`, whereas this head's template uses `#panel-toggle.panel-toggle`. The probe conditionally skips the comparison when that query returns null. Use the actual required control, fail if it is absent, and verify Clear all versus the tools toggle in the relevant collapsed/expanded states. The recorded empty overlaps array does not establish that this pair was checked.
4. Return exact head, updated script/output and readable captures of the affected layouts; distinguish emulation from any native/device checks. Keep the earlier device and rotation limitations explicit.

As a small test improvement, assert each expected Universes/Exhibits panel opens and closes. The current activation check accepts any visible member of a broad dialog/panel selector, which is weaker than verifying the requested panel.

## A11Y-2 — closed for this bounded source change

The template places All space → Undo → Redo → Named structures in actual DOM order for desktop and compact layouts. The previous compact CSS order overrides are removed. This implements the previously selected option b without introducing positive tabindex values.

In `updateHistoryButtons()` (lines 222–236), the code captures the focused element before updating disabled states. It moves focus only when that element was Undo or Redo and is now disabled; it chooses the other enabled history button, otherwise All space. Unrelated focused controls are not moved by this condition. The Undo/Redo stack transitions support the chosen counterpart.

The supplied keyboard script now exercises real Tab/Shift+Tab and Enter/Space after enabling Undo with Clear all, then reaches Redo and verifies scene counts and focus after each final operation. Its **42/42 recorded keyboard assertions** span portrait, landscape and desktop; **84/84 recorded text/layout assertions** make up the remainder of the 126/126 total. I independently reviewed this test logic and the implementation, but did not execute the recording anew. This closes the concrete DOM-order/focus implementation finding, not native assistive-technology acceptance. Multi-step history with both buttons enabled and preservation of focus outside the history controls would be useful additional regression cases.

## Independently checked CI, with revision limits

Read actual logs for [run 42332999290, build job 128283535654](https://github.com/mckayec/universe-sandbox/actions/runs/42332999290/job/128283535654). The checkout was tested merge **872398ec55cc0bd8e731f88ef78e6a3f1139b230**, merging the audited head into **f921b5482439df73b9544d263db49e0d011e86fd**.

The logs show **118/118 unit tests**, **24/24 page/viewport cases (12×2)**, successful build/format/distribution checks and the passing Chromium touch suite. Deploy was skipped. These are independently inspected recorded CI results, not tests run by this reviewer.

The [head-to-tested-merge comparison](https://github.com/mckayec/universe-sandbox/compare/84625b06834fc24ebcabd3a2b17ffff93dd737fe...872398ec55cc0bd8e731f88ef78e6a3f1139b230) includes non-document changes from main. In particular, history.ts gains infall snapshot/restore handling; the displayed delta leaves the new focus routine unchanged. style.css and template.ts are unchanged between these revisions. Therefore do not describe this as a docs-only merge delta, or attribute the CI's 118 tests to the isolated head. Claude's reported local 82/82 is a separate, non-rerun result. The standalone a11y-r2 script and test:browser were not run in this CI log.

## Handoff

Return **fixing / claude** for the bounded A11Y-1 correction and coverage repair. Preserve A11Y-2's source disposition and prior M1/M2 closures; no repeat of unchanged work is requested. Keep the separate Save/Load smoke disposition, remaining device/accessibility limitations and optional entry/resilience scope visible. PR #44 remains draft; Mckay retains release approval. No site code or PR branch was changed by this review.

**Verdict: changes requested — 1/2 accessibility findings closed, 1/2 partially fixed and still open.**
