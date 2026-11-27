# PR47 landscape qualification: guide + legend + navigation help + selected-object sheet at 844×390, coarse pointer

- Branch `sim/clarity-physics`. Reviewed head `4c3c03d6ffe918317959c72db32805805170800b`. **New head `14c684dcd0a7b3ca3252749854af7371d7ef2a7b`** (1 commit on top: `src/style.css`, `src/ui/overlay-layout.ts`, `tests/overlay-budget.test.ts`).
- Author: Claude, 2026-11-27. Not merged. Responds to [integration-review-4c3c03d.md](integration-review-4c3c03d.md).

## Verdict
**Defect found at 4c3c03d and fixed at 14c684d.** At 4c3c03d the combined state overlapped and had unreachable controls. At 14c684d every guide, dock and toolbar control in that state is fully visible and wins the hit-test at its centre and 4 inset corners. The overlay stack never overlaps the dock, zoom column or time row. One residual is open (SC-L1, below): the guide card can cover the selected object's canvas label.

## State definition
Chromium (Playwright 1.62.1, SwiftShader), context `{viewport 844×390, deviceScaleFactor 1, hasTouch: true, isMobile: true}`. Matches `(pointer: coarse)` and `(max-height: 500px) and (pointer: coarse)`, so the PR44 two-column landscape dock is active. Steps, all by `tap()`:
1. Exhibits → guided exhibit (`binary-stars`; repeated with the longer-objective `habitable-world`).
2. Pause.
3. Inspect, then tap the most massive body whose centre is open canvas. The selected-object sheet shows "Helios 01".
4. Overlays on until `#science-legend` shows.
5. Navigate (navigation mode on).
6. Wait 3.2 s for the start toast to fade, then measure.
7. Measure again with Details expanded.
8. Tap Inspect, Navigate, Restart and Exit guide to show the controls work.

The same steps were also run at 390×844 (portrait, coarse).

Note on "navigation help": on compact screens PR44 sets `.navigation-help { display: none }` and the dock touch hint carries the navigation text instead. The `#navigation-help` element is un-hidden but not rendered at both sizes; the harness records this.

## Defect at 4c3c03d (before)
The PR47 compact overlay-stack CSS, the objective clamp, the `overlay-tight` limits and the `overlay-layout.ts` budget were all gated on `max-width: 800px`, while the PR44 landscape dock applies at 844 px. Measured with the guide only (Exit guide), then with the combined state:
- The guide card was `[-99,120,711,257]`: 810 px wide and starting off-screen, so **Restart was off-screen**.
- At Pause's centre, `elementFromPoint` returned `#guide-exit`, so **Pause was covered**.
- The legend `[174,265,438,312]` covered Inspect / Navigate.
- The stack overlapped the dock `[12,122,776,322]`, and `overlay-tight` stayed false.

At 4c3c03d the harness itself aborts, because Playwright's `tap('#pause')` is intercepted by `#guide-exit`.

Shots: `shots-landscape-14c684d/before-4c3c03d-844x390-guide-only.jpg`, `before-4c3c03d-844x390-combined.jpg`.

## Fix (14c684d)
- `(max-height: 500px) and (pointer: coarse)` added to the three compact overlay-stack media queries (stack position and width, objective clamp, `overlay-tight` limits) and to `COMPACT` in `overlay-layout.ts`, so CSS and JS share one condition.
- Landscape phones only (`max-height:500px` + coarse + `min-width:601px`):
  - The guide card uses a grid with Restart / Exit beside the title and objective. The eyebrow is hidden, and the rule uses `:not([hidden])` so Exit still hides the card.
  - The dock touch hint steps aside while a guide is running.
  - An idle toast and the empty dock grid rows reserve no space.
  - The budget's dock floor is 124 px, so both tool rows and the sheet heading stay visible. The stack takes the rest (78 px), and the legend scrolls inside the stack's share.
- Desktop (fine pointer) and ≤800 px portrait rules are unchanged.
- Test: `tests/overlay-budget.test.ts` adds a case covering wiring (same query in JS and CSS), the `:not([hidden])` guard and the landscape budget split.

## Hit-tests at 14c684d (844×390 coarse, binary-stars; habitable-world identical)
Stack `[12,112,736,190]` (overlay-tight, max-height 78), dock `[12,198,776,322]`, zoom column `[788,122,832,316]`, time row y 334–378.

| Control | Rect [l,t,r,b] | Topmost at centre | Corners hit | Fully visible |
|---|---|---|---|---|
| Restart | 550,138,623,182 | `#guide-restart` | 5/5 | yes |
| Exit guide | 629,138,721,182 | `#guide-exit` | 5/5 | yes |
| Show tools | 302,207,399,251 | `#panel-toggle` | 5/5 | yes |
| Resume/Pause | 47,207,114,251 | `#pause` | 5/5 | yes |
| Clear all | 120,207,188,251 | `#clear` | 5/5 | yes |
| Add | 47,259,161,303 | `#add-mode` | 5/5 | yes |
| Inspect | 166,259,280,303 | `#inspect-mode` | 5/5 | yes |
| Navigate | 285,259,399,303 | `#navigate-mode` | 5/5 | yes |
| Details | 638,209,713,253 | `#info-expand` | 5/5 | yes |
| × (deselect) | 719,209,763,253 | `#info-close` | 5/5 | yes |
| Universes | 635,10,709,54 | `#universes-button` | 5/5 | yes |
| Exhibits | 715,10,782,54 | `#exhibits-button` | 5/5 | yes |
| Fullscreen | 788,10,832,54 | `#fullscreen-button` | 5/5 | yes |
| Overlays (after scrolling the toolbar) | 713,65,831,109 | `#science-mode` | 5/5 | yes |
| Focus | 788,222,832,266 | `#zoom-selected` | 5/5 | yes |
| All | 788,272,832,316 | `#zoom-fit` | 5/5 | yes |

Also enforced, at both 844×390 exhibits and at 390×844:
- No horizontal scroll.
- Stack clear of every universe-toolbar control.
- Legend reachable by scrolling inside the stack.
- With Details expanded: no stack/dock overlap, and Restart, Exit, Details/Less, ×, Inspect and Pause still pass 5/5.
- Tapping Inspect switches mode, Restart keeps the guide, Exit guide hides it.
- 0 console or page errors.

**Harness: 102/102 checks pass, exit 0** ([landscape-qualification-harness.mjs](landscape-qualification-harness.mjs), raw [landscape-qualification-14c684d.jsonl](landscape-qualification-14c684d.jsonl)).

## Residual SC-L1 (reported, not enforced)
With all four panels open at 844×390, the overlay stack plus the dock fill the band between the universe toolbar and the time row. The selected body's canvas label is therefore under the guide card in both exhibits, and in binary-stars the body's centre is too. The sheet names the object ("Helios 01"), and Exit guide, Focus or a Navigate pan uncovers the label.

At 390×844 the label sits under the legend at the default camera, though the body's centre is clear (unchanged PR47 portrait layout).

Trade-offs of the fix:
- On landscape phones the legend is only visible by scrolling the stack while a guide runs.
- The touch hint is hidden while a guide runs.

## Screenshots (viewed)
In `shots-landscape-14c684d/`:
- `844x390-combined-binary.jpg`: guide with Restart/Exit on the right, two-row tool panel, sheet "Helios 01", nothing overlapping.
- `844x390-combined-binary-details.jpg`, `844x390-combined-habitable.jpg`, `844x390-combined-habitable-details.jpg` ("Less" shown).
- `390x844-combined-binary.jpg`, `390x844-combined-binary-details.jpg`: portrait unchanged, with the touch hint carrying the navigation text.
- The two `before-4c3c03d-*` shots.

## Checks at 14c684d
- `pnpm format` then `pnpm check`: format OK, build OK, **282/282** unit tests (was 281, plus 1 new), check:dist 120 files OK.
- `pnpm test:pages`: 14 pages × 2 viewports pass.
- `pnpm test:browser`: pass (paused Save→Clear→Load 29/29).
- `pnpm test:touch`: B6, M1 and pinch pass.
- Landscape harness: 102/102.
- Desktop 3840/1440/1280 shots were not retaken. Every new rule requires `(pointer: coarse)` or ≤800 px, so desktop CSS is untouched; `test:browser` covers the desktop layout.

## Not covered
Real devices and Safari, a real GPU, accessibility beyond pointer hit-tests, and page-wide 200% text in landscape.
