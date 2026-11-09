# Checkpoint 31: remaining-gate disposition (R30-1 fixed, year-handle focus fixed; others dispositioned)

Parent: PR45 **eabf9c61ddd70558f0b5c8c3ba7244129262c47d**. Answers the finite remaining-gate unit in
[independent-review-eabf9c6.md](independent-review-eabf9c6.md). The accepted URL/history qualification (checkpoint 30)
is not repeated.

## Required fixes (application change)

**R30-1 (Low) — fixed.** `layers.js`: the year inputs' max is now `axisTop(T)` = axis min + whole steps (Religious
Traditions: −799 + 283×10 = **2031**, was 2030 and unreachable, so the full-range "to" handle sat at 2021). New pure
`rangeFromHandles(T, range, va, vb)`: a handle still at the snapped position of the current end keeps that end exactly,
otherwise it takes `fromAxis(value)`; `clampRange` maps 2031 back to 2030 / full range. `engine.js` `readRange()` uses
it. A change without a move can no longer narrow the full range or shift an explicit range by the snap offset. Track
fill now uses the same top as the inputs (full range = 0.00%/100.00%).

**New, found by the probe (pre-existing): keyboard focus lost after every year step.** Each arrow-key `change` ran
`applyFilters()` → `renderFilters()`, which rebuilt the bar's innerHTML and dropped focus, so a second arrow press went
nowhere (seen at eabf9c6: "to" ArrowLeft then ArrowRight left the range at −800..2011). `renderFilters()` now restores
focus to the same `data-tl` / `data-layer` control after a rebuild (`preventScroll`).

Unit tests: `tests/atlas-layers.test.ts` adds the R30-1 case (axisTop, snapAxis, rangeFromHandles full/explicit/moved,
rendered max/value/fill). `pnpm check` **166/166** (was 165), check:dist OK, `pnpm test:pages` 12 pages × 2 pass.

## Real-input browser evidence

[tl31/year-handle-probe.mjs](tl31/year-handle-probe.mjs): built dist, Religious Traditions, Earth surface; real keyboard
on the focused range inputs (Arrow/End/Home fire native input+change); asserts S.range = URL `yr`, readout, inputs.

| Run (1440×900) | Result |
|---|---|
| head (this commit) | **8/8 pass** — [output](tl31/year-handle-output-head-1440.txt): full range stays All years after left+right, left+End, right+Home; yr=600_1500 one step on "to" → 600_1511 with "from" exact; End → 600_2030; focus kept; no errors |
| control: same dist with eabf9c6 `engine.js` + `layers.js` | **0/1, then harness timeout** — [output](tl31/year-handle-output-parent-eabf9c6-1440.txt): case A narrows to −800..2011; next `page.focus` hit the 30 s actionability timeout (software-GL starvation pattern of TL22-E2). Incomplete; not relabelled |

390×844 not run this checkpoint (a first combined run timed out at the run budget); mouse drag of a thumb was attempted
and dropped (the synthetic drag did not engage the thumb under swiftshader) — **no pointer/drag evidence claimed**.
Case D documents behaviour, not a fix: a handle moved and moved back lands on its grid year (600 → 611 → 601).

## Dispositions (no change)

| Item | Disposition |
|---|---|
| R29-1 phone strip: Timeline button off-screen in cumulative packs at 390 | **Defer to mobile-entry-usability review** (owner Mckay, awaiting-owner). Pre-existing, head = parent, reachable by swipe; Standard Works shows it on screen. Not a timelines defect; candidate fix (lead strip with Timeline or fade cue) recorded there. Does not block this PR. |
| tl29 chapter-path parent control (2 predicates, then timeout) | **Evidence-backed deferral.** PR45 has no chapter-path code delta between that control and head; head 20/20 stands. Completing the control needs a non-swiftshader browser; not a fix item. |
| Default-off layers | **No current pack uses `on:false`** in a timeline pack; popstate treats omitted `layers` as all-on, matching `urlFor()` (checkpoint 28). Deferred until a pack ships one; unit test for defaultActive already covers on:false. |
| Hand-typed hash naming a surface hidden by its own filters | Existing `applyFilters()` drops a hidden selection/site/event (ascends from a hidden world); not separately probed. Deferred as untested-but-handled. |
| Physical device/touch/AT, real-hardware timing, mobile 1714-row perf, PR33 integration | Out of scope for software-GL runs; remain open for the final technical audit / Mckay's device check. |

No canon, full technical or release approval. 0/12 real relationships promoted.
