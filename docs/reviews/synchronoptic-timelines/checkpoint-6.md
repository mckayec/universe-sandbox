# Timeline checkpoint 6 — TL-R03 residual (Tab containment from fallback focus)

Branch `engine/timelines` (draft PR #45), parent `312d2dde5f3824e16a1317c5293ac1b61f3bd287` (the head re-reviewed in
independent-review-312d2dd.md on PR #46 at `eda30c8`). Exact head: see status.md / the commit that adds this file.

## Finding

TL-R03 (partial, Medium): after the host filter handler removed the selected `n:jud-karaite`, focus fell back to the
Overview heading (`tabindex=-1`). The dialog's Tab trap only wrapped when focus was on the first or last tabbable
control, so Tab from a non-tabbable programmatic target followed DOM order and left the modal (to the Earth button).

## Resolution

`public/atlas/timeline-view.js` keydown handler: when focus is on an element that is not in the dialog's tabbable list
(the Overview heading, the `tl-scroll` pane, or any other `tabindex=-1` target), Tab / Shift+Tab are handled by the
dialog itself — focus moves to the next / previous tabbable control by document position inside the dialog, wrapping
to the first / last. The existing first/last wrap is unchanged. The fallback order in `restoreFocus` (same control →
selected record → Overview heading → Close) is unchanged, so screen readers still land on the heading after a gate
refresh. No other code changed.

## Evidence (this head, Chromium 1243 / SwiftShader)

- `pnpm format`, `pnpm check`: 123/123 tests, check:dist 120 files OK.
- `pnpm test:pages` 12 pages x 2 viewports; `pnpm test:browser` passed.
- Reviewer's own probe re-run unchanged (`tl6/regression-probe.mjs`, copied from `eda30c8`
  `independent-312d2dd/probe.mjs`): every check true, including `Tab after downgrade` at 390, 1440 and 3840 (previously
  the three failures); no console/page/request errors. Output `tl6/regression-probe-output.txt`, screenshots
  `tl6/*.jpg` (inspected 1440 chart).
- New focused probe `tl6/tl6-focus-probe.mjs` (43 checks): at 390, 1440 and 3840, from the Overview heading and the
  scroll pane, 60 consecutive Tab and 60 Shift+Tab presses stay inside the dialog after (a) the gate refresh that removes
  the selected record, (b) a viewport resize, (c) a lane collapse; single Tab and Shift+Tab right after the gate refresh;
  Escape still closes. **43/43 at this head** (`tl6-focus-probe-output.txt`); the same probe at the parent 312d2dd gives
  **31/43** (12 escapes; `tl6-focus-probe-output-312d2dd.txt`), so it detects the regression.

## Still open (unchanged)

Claim-specific relationship locators (129 unsourced relationships, zero drawn connectors), the Standard Works adapter,
keyboard alternative already present but drag reorder not built, physical-device acceptance. No approval, merge or
deploy claimed.
