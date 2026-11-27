# Emulated accessibility checks — PR #44 (Claude, 2026-11-06)

Branch `fix/mobile-entry-usability`. Checked at `4ffda2d28678588c829751339dcaf619711ccc40`, one fix pushed, re-checked at **`d699aaacdbd2cf381dab3808dcbe8f4ebcdd0242`**. Draft, not merged.

Environment: cloud Playwright Chromium 1243 with SwiftShader WebGL and touch emulation (`isMobile`, `hasTouch`, DPR 2), `pnpm preview`. Script: [a11y.cjs](a11y.cjs); raw output at the new head: [a11y-d699aaa.json](a11y-d699aaa.json); screenshots `shots/a11y-*`. **This is emulation, not device acceptance.**

## Results

| Check | At 4ffda2d | At d699aaa | Notes |
|---|---|---|---|
| Reduced motion (`reducedMotion: 'reduce'`, 390×844) | pass | pass | Media query reaches the app: Effects starts at "gentle", toast transition 0 s, event-feed animation off; camera moves use the existing instant path (`scene/camera.ts`). Placing tap still works (4→5). No console errors. |
| Enlarged text 200% (`-webkit-text-size-adjust: 200%`, which Chromium scales on mobile emulation), 390×844 | **fail (A11Y-1)** | pass, with truncation | Before: Exhibits and Fullscreen pushed off the right edge (unreachable), FOCUS label clipped in its 44 px column, Clear all overlapping Show tools. After: every control on screen, nothing overlapping, no horizontal scroll; Universes/Exhibits labels ellipsize ("UNI…", "EX…") — their accessible names are unchanged. `shots/a11y-390x844-text200.jpg` |
| Enlarged text 200%, 844×390 landscape | pass | pass | No clipping or overlap. `shots/a11y-844x390-text200.jpg` |
| Rotation with the selected-object sheet open (390×844 → 844×390 → 390×844 → 844×390) | pass | pass | Sheet stays open, selection and object count kept, no clipped controls, no horizontal scroll, no errors. `shots/a11y-rotate-*` |
| Keyboard focus order, compact toolbar | **finding (A11Y-2)** | unchanged | Visual order is All space, Undo, Redo, Named structures…; Tab order is All space, Named structures, Undo, Redo (DOM order; CSS `order` moves Undo/Redo). Disabled buttons are skipped as expected; every focused control was on screen with a visible focus style. |
| Default text size regression (capture.cjs) | — | pass | 0 visible compact controls under 44 px at 320, 375, 390, 430, 768, 844×390; no horizontal scroll; desktop 1440×900 unchanged (small controls by design, as before). |

## Fix for A11Y-1 (d699aaa, `src/style.css`, compact media query only)

Top bar: `.sim-state` and `.top-actions` may shrink; top-action buttons keep 44 px minimum and ellipsize. Zoom grid columns `minmax(44px, auto)`. Pause/Clear all may shrink and wrap their labels (10 px side padding) instead of overflowing into Show tools. No change at default text size.

## A11Y-2 — not fixed, for the reviewer

WCAG 2.4.3 (Focus Order) needs focus order to preserve meaning and operability; here the swap only affects two adjacent groups in a horizontally scrolling toolbar, so I read it as minor. Options: (a) leave it; (b) move Undo/Redo before the Named-structures select in the DOM (`ui/template.ts`) — this also changes the desktop order, which the PR has so far kept unchanged. Recommendation: (b), if the reviewer agrees desktop may change.

## Checks at d699aaa

- `pnpm format`, `pnpm check`: pass (82/82 unit tests, check:dist OK).
- `pnpm test:touch` (CHROME_PATH = Playwright Chromium 1243): pass (B6, M1, pinch, all markers).
- `pnpm test:pages`: 12 pages × 2 viewports pass.
- `pnpm test:browser`: not re-run; the Save/Load disposition in [save-load-smoke-disposition.md](save-load-smoke-disposition.md) is unchanged (this commit touches CSS only).

## Known gaps (unavailable here — Mckay-only, real hardware)

| Gap | Impact | Blocks release? |
|---|---|---|
| Real iPhone Safari and Android Chrome (safe areas, browser-bar resize, long-press, repeated gestures) | Emulation may differ from real touch and viewport behavior | Mckay decides; recommend one quick phone pass before release |
| VoiceOver / TalkBack | Screen-reader names/announcements not heard | No (names and aria-pressed are source-verified) |
| iOS Dynamic Type / Android font scale | Approximated by text-size-adjust 200% only | No |
| Real-GPU rendering | SwiftShader only | No |
