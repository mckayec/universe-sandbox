# Timeline checkpoint 29: TL22-E2 real-input / focus diagnosis (evidence only; 0 promoted)

Return for [independent-review-daeaf39.md](independent-review-daeaf39.md) "Next bounded unit". Application code is
unchanged: head under test **daeaf395fd4fc309eca1ea27854e2a8f4bb287ea**, parent control
**1ceb4b224b5343f06116ccd581cb1ceb10ad9f5f**, both built locally (`pnpm build`), PR33 pack at
3e3701ffcc4131200f0993e52f8f14a509016ced (temp copy only). Chromium via Playwright, headless, swiftshader WebGL.
Node v22.23.4. This commit adds only `docs/reviews/synchronoptic-timelines/` files.

## Causal diagnosis of the 1440 click timeout

[`tl29/real-input-diagnosis.mjs`](tl29/real-input-diagnosis.mjs) — outputs for
[head](tl29/real-input-diagnosis-output-head.txt) and [parent](tl29/real-input-diagnosis-output-parent-1ceb4b2.txt).

| Measure (Standard Works, not opted in) | 1440x900 head / parent | 390x844 head / parent |
|---|---|---|
| rAF frames in 3 s (mean frame interval) | 2 (2.9 s) / 2 (3.3 s) | 7 (0.45 s) / 7 (0.46 s) |
| `elementFromPoint` at `#tlBtn` centre is the button | yes / yes | yes / yes |
| `#tlBtn` box over 6 consecutive frames | 1 distinct / 1 distinct | 1 / 1 |
| `page.click`, 15 s budget | timeout / timeout | 6.4 s / 6.9 s |
| same `page.click`, 90 s budget | opened in 12.9 s / 13.5 s | 6.9 s / 6.7 s |
| real CDP `mouse.click` at centre → panel open | open, focus inside `#timeline` / same | same / same |
| real `Escape` → closed, focus returns to | `#tlBtn` / `#tlBtn` | `#tlBtn` / `#tlBtn` |
| real `Enter` on the focused button → reopen | open / open | open / open |

Diagnosis: the button is not covered, not moving and its handler works. Playwright's actionability wait ("visible,
enabled and stable", then "scrolling into view") needs several rendered animation frames; under software WebGL at
1440x900 a frame takes about 3 s (about 6x the 390 interval), so the wait runs out of the 15 s budget. The call log at
head shows it got past "element is visible, enabled and stable" and was still in "scrolling into view" at 15 s; with
a 90 s budget the identical call succeeds in about 13 s at head and parent. Head and parent behave the same, so this
is not caused by PR45 changes and no application fix is warranted. It is a frame-starvation limit of the test
environment, not a pass for real-hardware timing.

## Real close → chapter change → reopen (real input only)

[`tl29/real-chapter-path.mjs`](tl29/real-chapter-path.mjs) → [output](tl29/real-chapter-path-output.txt):
**20/20 at head** (10 per width, 1440 and 390). Fixture as tl25 `chapters` (Religious Traditions made cumulative,
book I with 6 chapters, `n:jud-karaite` gated first 1 / chapter 3; synthetic, not canon). Every activation is a real
CDP pointer click at the element centre after a hit test, or real keys (Home/ArrowDown/Enter on the chapter select,
Escape, Enter); no `element.click()`, dispatched events or `selectOption`.

Path per width: book I → chapter 3 (keys) → open timeline (pointer; focus moves inside) → List → click the Karaite
row (tlsel + detail) → Escape (closed; focus back on `#tlBtn`) → chapter Not set (keys; `ch` and `tlsel` leave the
URL) → reopen (row absent, not selected, no detail) → close → chapter 3 → reopen (row listed again; the old selection
is not resurrected) → no page/console errors.

The parent control run of this path was cut off by the run's time limit and is **not reported** (0 parent cases).
PR45 has no chapter-path delta between parent and head (the daeaf39 delta is filter restoration), so this is a
missing control, not a known difference.

## Finding R29-1 (phone width, pre-existing, not changed): Timeline button starts off-screen in cumulative packs

[`tl29/header-reach-390.mjs`](tl29/header-reach-390.mjs) → [output](tl29/header-reach-390-output.txt),
[screenshot](tl29/tl29-390-strip-after-chapter.jpg). In the cumulative fixture at 390x844, `#controls` is a
`nowrap` strip with `overflow-x:auto` (scrollWidth 569 of 358 visible; 677 when the chapter selector shows), so
`#tlBtn` sits at x=495 (603 with the chapter selector) — reachable only by swiping the strip. Head and parent are
identical. The real-input path above reaches it with real mouse-wheel input over the strip. In the Standard Works
pack at 390 the button is on screen (x=16). Not a functional defect; a discoverability question for the mobile
review (e.g. lead the strip with Timeline, or a fade/arrow cue) — recorded here, not changed.

## Still open

Real-hardware timing and device/AT (all numbers above are swiftshader); touch input (pointer here is mouse);
parent control for the chapter path; rendered year controls; mobile 1714-row performance; chapter gates outside the
timeline; PR33 integration; full technical/canon qualification; Mckay's release approval. 0/12 real relationships
promoted.
