# Mobile entry usability: baseline and first implementation (Claude)

Date: 2026-11-01 UTC. PR #44 (draft), branch `fix/mobile-entry-usability`, head `91b9304140b18e358cf3f1be5f0f6808edd83516`, parent main `bb91b1b` (= `8c6a6c7` + run lock). Not merged.

Environment: cloud Playwright Chromium with SwiftShader WebGL (renderer initialised, unlike the addendum's live check), touch emulation (`isMobile`, `hasTouch`, DPR 2). **No real iPhone Safari, Android, VoiceOver, 200% text or real-GPU checks were run.** Emulation is not device acceptance.

## 1. Baseline (main 8c6a6c7), observed

Scripts: `capture.cjs` (screenshots plus measured bounding boxes of every visible button/select/range), `j3.cjs` and `j4.cjs` (touch journeys). Sizes: 320×640, 375×667, 390×844, 430×932, 768×1024, 844×390 (landscape), 1440×900 (desktop).

| # | Observation | Evidence |
|---|---|---|
| B1 | Phone **landscape** (844×390) gets the desktop layout: tool panel covers the left half, selected-object panel the right, top actions 30 px high. Canvas mostly hidden. | `shots/before-844x390-home.jpg` |
| B2 | At 320 px the top bar overflows; Fullscreen is clipped off-screen. | `shots/before-320x640-home.jpg` |
| B3 | 29 visible controls under 44 px at every phone width: toolbar 34 px, zoom 40, Focus/All 34, modes/Pause/Clear/tools toggle 40, speed 42. | capture.cjs output |
| B4 | No instruction is visible on phones: `.hint` is hidden at ≤800 px, so choosing a builder gives no "what next". | source + screenshots |
| B5 | Mode and speed buttons have no programmatic selected state. | source |
| B6 | **Accidental Clear all.** A canvas tap that places a body selects it; the selected-object sheet appears below the tool panel and shifts the dock upward, and the synthetic click that follows the touch lands on whatever is now under the finger. Reproduced: portrait 390×844 (tools open, tap at 100,350) and landscape 932×430 (tap at 280,150 → `#clear` moved to y=150, toast "Simulation cleared"). | j4.cjs; `elementFromPoint` = canvas before the tap |
| B7 | Undo is the 3rd toolbar item behind a 173 px select; partly or fully off-screen at 320–390 px. | `shots/before-390x844-home.jpg` |

The universe and exhibit dialogs were already usable (single column, 44 px close button) and were not changed.

## 2. What was built (compact layout only)

Desktop (non-coarse or taller than 500 px and wider than 800 px) is unchanged; 1440×900 screenshots match.

| Change | Addresses |
|---|---|
| Compact media query extended to `(max-height: 500px) and (pointer: coarse)`; `compactLayout()` uses the same string (`COMPACT_QUERY` in `ui/feed.ts`). Landscape block: tool panel and selected-object sheet side by side, zoom in one column at the right, dock kept clear of zoom and toolbar, event feed hidden while a sheet is open (toast still reports). | B1 |
| ≤360 px: logo and clock hide, top-action padding 8 px. | B2 |
| Essential compact controls at 44 px (toolbar buttons/select, zoom, Focus/All, modes, Pause/Clear, tools toggle, sheet buttons, lock buttons, object-menu buttons, speed, gravity slider hit area); dependent offsets moved. | B3 |
| `#touch-hint` above the dock, touch wording: "Tap empty space to place · use Inspect to move objects", "Tap empty space to build two stars", "Tap an object to inspect · drag it to move", "Drag to pan · pinch to zoom · tap an object, then Focus", orbit mode. Wraps instead of truncating. Replaces `#navigation-help` on compact screens. Desktop hint text unchanged. | B4 |
| `aria-pressed` on Add/Inspect/Navigate and speed buttons, set by the same functions that set `.active`; speed buttons grouped as "Simulation speed". | B5 |
| `touchend` on the canvas calls `preventDefault()`, so the synthetic click after a canvas touch is dropped. Pointer events (placement, selection, drag, pinch) are untouched. Side effect: on touch, double-tap no longer triggers the desktop `dblclick` focus; the hint says "tap an object, then Focus" instead. | B6 |
| Compact toolbar order: All space, Undo, Redo, then the rest (CSS `order`, DOM unchanged). Clear toast: "Simulation cleared · Undo restores it". | B7, addendum P2 |

## 3. Results after (head 91b9304)

- Visible controls under 44 px: **0** at 320, 375, 390, 430, 768 and 844×390 (was 29–30). Desktop still has small controls by design (unchanged).
- No horizontal page scroll at any size (`scrollWidth` = viewport width). No console errors.
- Journey (j3.cjs) at 320×640, 390×844, 844×390, 932×430: pause → open tools → choose Binary → close tools → hint reads "Tap empty space to build two stars" → canvas tap places (4→7 objects) → Clear all (→0) → Undo visible in view at x≈108 → Undo (→7) → resume at 10×: all pass.
- B6 retest (j4.cjs, 932×430): the same tap now places the binary (toast "Binary system assembled"), Clear all not triggered.
- Tool taps (Inspect, Navigate, tools toggle, Pause twice, 5×, open/close Universes and Exhibits) never changed the object count.

Screenshots (JPEG, half size): `shots/before-*` / `shots/after-*` for 320×640, 390×844, 844×390, 1440×900; plus `after-844x390-placed`, `after-390x844-placed`, `after-932x430-tools-open`.

## 4. Checks

- `pnpm format`, `pnpm check`: pass (82/82 tests, check:dist 111 files OK).
- `pnpm test:pages`: 12 pages × 2 viewports pass.
- `pnpm test:browser`: times out at line 88 (Load after Save does not restore the saved count within 30 s) — **identical failure on unmodified main bb91b1b** in this environment, so not caused by this change. CI on the PR is the authority: run 41273407304 at 91b9304 passed (deploy skipped).

## 5. Not done / open

1. First-use entry panel (Explore universes / Try an experiment / Free play) from addendum P1: not built. Proposal: a dismissible card shown only on a first visit with no saved session, primary "Explore universes", secondary "Try an experiment", text link "Free play"; never shown again once dismissed. Wanted ChatGPT's view before adding a step for returning users.
2. Portrait still stacks the selected-object sheet **below** the tool panel (pre-existing), which is what moves Clear all; the click fix removes the hazard, but moving the sheet above may read better.
3. No-WebGL entry resilience (addendum P2): not investigated.
4. Not run: real iPhone Safari / Android Chrome, VoiceOver, 200% text, reduced motion, rotation while a sheet is open, browser-bar changes. Taps/time per journey were not measured with people.
