# SC7-O1 implementation review — 1acc2ea

ChatGPT, 2026-11-10 UTC. Exact PR [47](https://github.com/mckayec/universe-sandbox/pull/47) head **1acc2ea61f39cb1f355a661373bf91bf86be00b8**, parent **3ab737fe90991767b3cebf5410dc5a1c3b7a6f84**.

**Accept the bounded SC7-O1 compact dock correction at source and supplied-artifact scope.** Return to Claude for the existing strict Save→Clear→Load repair/evidence unit. This is not independent rendered acceptance, whole-handoff technical approval or Mckay's release approval.

## Reviewed evidence

Read the [return](sc7o1-return-1acc2ea.md), [preceding review](sc4e1-repair-review-3ab737f.md), consolidated packet, corrected SC4-E1 repair, complete 7d harness and both new raw logs. Fresh GitHub PR metadata confirms the exact head. Actual parent-to-head comparison is **1/1 file inspected**, `src/style.css`, +50/−0; read the complete pinned file, including surrounding compact/overlay rules. No TypeScript/application-logic delta. Earlier incremental reviews remain historical; this does not re-certify every change in the full PR.

[Independent evidence inventory](sc7o1-review-evidence-1acc2ea.json) records **6/6 matching Git blob hashes** (CSS, harness, two logs and two screenshots), counts and observations. Independently recounted builder results:

| Evidence | Passed / checks | Scope |
| --- | ---: | --- |
| 7d, 667×375 normal | 11/11 | All 11 controls in the black-hole dock |
| 7d, 667×375 doubled dock text | 11/11 | Same controls; per-element computed fonts doubled |
| 7d, 844×390 | 7/7 | Desktop layout; row-scroll observation retained |
| 7d, 390×844 | 10/10 | Compact portrait |
| 7d, 1440×900 | 7/7 | Desktop |
| 7c rerun, four viewports | 58/58 | Existing picker/readout checks |

Thus **46/46 new + 58/58 retained builder checks**, not 104 independently executed browser tests. Viewed **2/2** supplied screenshots: normal row y=110–172 and sheet y=180–309; doubled-text row y=110–218 and sheet y=226–309. The row visibly clears the inspector, zoom column and time buttons. Remaining sheet content scrolls; these screenshots do not show every control simultaneously.

The CSS reserves the collapsed tool row with `flex-shrink:0`, uses the larger short-landscape band while keeping the zoom-column inset, wraps modes after the actions, and preserves the tighter overlay budget with a more specific selector. The sticky collapsed row applies in the existing scrolling tight-budget dock. The new harness does not exercise a guide/legend-induced tight-budget state: source inspection supports that rule, but its runtime behavior is not newly certified by these five scenarios.

## Disposition and limits

**SC7-O1 closes for the demonstrated expanded black-hole sheet at 667×375 normal and doubled dock text.** SC7-E1 and prior bounded closures stand. The harness actually tests five hit points, clipping ancestors, Tab traversal, focused-control visibility and keyboard operation. `:focus-visible` matching is not a measured contrast/appearance audit. Operation subtests use programmatic focus before Enter; the separate Tab pass establishes traversal.

Pointer evidence is narrower than “every control fully operated by pointer”: ten buttons use actionability-checked clicks; `bh-reference` is clicked, dismissed with Escape, then changed with `selectOption`. This establishes pointer access plus programmatic selection, **not pointer-only native-menu option selection**. Keyboard ArrowDown/ArrowUp selection is separately exercised. The hidden life-zones control is outside the black-hole scenario. No screen-reader claim is supported.

“200% text” here means only dock descendants' computed font sizes doubled. It is not page-wide resizing, browser 200% zoom or physical-device coverage. At 844×390 the desktop Pause/Clear row still needs scrolling; the log explicitly reports false for no-scroll visibility. The 7c 667×375 readout also still needs scrolling. Neither informational observation is counted as a passing no-scroll check.

A fresh reviewer Chromium launch failed **before page creation** at `process_singleton_posix.cc:297: socket() failed: Operation not permitted (1)`. **0 reviewer browser cases; 0 fresh full application-test runs.** Builder-reported 224/224 unit tests, 113 dist files and 24/24 page cases remain attributed; this run did not independently rerun those suites. No inference that an intermittent Save/Load failure is harmless follows from this launch blocker.

## Packet correction and next bounded unit

The SC4-E1 repair and packet now correctly state **0.301 s** maximum within-clip spread and apply the 0.5 s trim only to the video analysis, not the separate lossless stills. Accepted. Their supplied-artifact R1/R2 closures stand.

The consolidated packet's older Save/Load row still proposes “not a PR47 blocker” and its older next-action asks about full sign-off. Those are historical proposals, **not accepted gate waivers**; the later packet review, return and this review retain the strict gate.

Claude: execute the already agreed bounded Save→Clear→Load repair plan, with **five consecutive unedited strict runs**, exact tested commit(s), commands, raw outcomes and failed-run diagnosis. Preserve full state assertions; do not turn retries, timeout extension, a partial save/load check, or skipped tests into a pass. If a separate repair branch is used, report that exact head and its integration relationship to PR47; no acceptance transfers automatically. Return the actual diff and exact-head checks for review. Refresh the consolidated packet to reflect this disposition and distinguish historical evidence from the new head.

Keep legacy non-hole unit labels, screen-reader/page-wide resize/native picker-menu coverage, SC1-E1/device/GPU/genuine-background, independent-rendering and quantitative phase/shear limits explicit. No whole-handoff or release approval. No new Mckay decision is required to continue the existing repair unit.

This run inspected **18/18 pack statuses and 8/8 review statuses**; both agreement sign-offs remain present and the agreement is unchanged. The three parallel self-audits are current. No site or PR-branch edit, merge or deployment.
