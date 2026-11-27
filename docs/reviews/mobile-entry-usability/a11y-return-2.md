# Accessibility return 2 — A11Y-1 and A11Y-2

2026-11-07 UTC · Claude. PR #44, branch `fix/mobile-entry-usability`, head **84625b06834fc24ebcabd3a2b17ffff93dd737fe** (parent d699aaacdbd2cf381dab3808dcbe8f4ebcdd0242). Responds to [implementation-review-a11y.md](implementation-review-a11y.md). Merges cleanly with main at the time of writing.

## Changes (3 files)

| Item | File | Change |
|---|---|---|
| A11Y-1 | `src/style.css` (compact enlarged-text block only) | Top-action labels wrap instead of ellipsizing (`white-space: normal`, `overflow-wrap: anywhere`, height grows); text buttons use 6 px side padding (was 10 px, so default widths drop from ~82 to 74/67 px, still ≥44 px); Fullscreen keeps its icon and 10 px padding; top-bar gap 10 → 6 px; the object count/clock (`.sim-state`, `flex-shrink: 9999`) gives up space before any action label. |
| A11Y-2 (b) | `src/ui/template.ts`, `src/style.css` | Undo, Redo now precede Named structures in the DOM (desktop and compact). The redundant compact `order` rules for All space/Undo/Redo are removed. No tabindex. |
| A11Y-2 (found while testing) | `src/state/history.ts` `updateHistoryButtons()` | Using the last Undo (or Redo) disabled the focused button and dropped focus to the page body. Focus now moves to the other history button if enabled, otherwise to All space. |

## Acceptance — assertion-based, 126/126 pass

Script: [a11y-r2.cjs](a11y-r2.cjs) (exits non-zero on any failure); raw output: [a11y-r2-84625b0.txt](a11y-r2-84625b0.txt). Chromium 1243 (Playwright), SwiftShader WebGL, mobile emulation; text scale approximated by root `font-size` + `-webkit-text-size-adjust` (not native Dynamic Type / Android font scale).

**A11Y-1** at 390×844, 844×390 and the 320×568 baseline, each at 100%, 150% and 200%: Universes/Exhibits label text lies wholly inside the button (range rects), no scroll clipping, no ellipsis; targets ≥44 px; no top-bar control off screen; top bar does not overlap the universe toolbar; no horizontal page overflow; tapping Universes and Exhibits still opens their panel; no page errors.

| Viewport | 200% result |
|---|---|
| 390×844 | Both labels whole on one line (133×44, 120×44). |
| 844×390 | Both labels whole on one line. |
| 320×568 | Labels cannot fit whole words (needs ~312 px, 296 px available); they wrap inside the word onto two lines ("UNIVERS/ES", "EXHIBIT/S", 120×52, 108×52). All letters visible, no overlap. |

Shots: `shots/a11y-r2-{390x844,844x390,320x568}-text{150,200}.jpg`.

**A11Y-2** at compact portrait 390×844, compact landscape 844×390 and desktop 1440×900: DOM order All space, Undo, Redo, Named structures and matching visual order; disabled Undo/Redo skipped (All space → Named structures); after Clear all, Tab All space → Undo → Named structures (Redo still disabled), Shift+Tab back to Undo; focused Undo inside the toolbar with a visible focus style; Enter on Undo restores the scene (4 objects), Redo enables and focus moves to Redo (Undo became disabled); Space on Redo re-applies Clear all (0), focus moves to Undo; Shift+Tab → All space; no page errors. Shots: `shots/a11y-r2-{compact-portrait,compact-landscape,desktop}-focus.jpg`.

## Repo checks at 84625b06834fc24ebcabd3a2b17ffff93dd737fe

- `pnpm format`, `pnpm check`: pass (82/82 unit tests, build, check:dist).
- `pnpm test:pages` (CHROME_PATH = Chromium 1243): 12 pages × 2 viewports pass.
- `pnpm test:touch`: pass (B6, M1, pinch, all markers).
- `pnpm test:browser`: not re-run; Save/Load disposition unchanged ([save-load-smoke-disposition.md](save-load-smoke-disposition.md)).

## Trade-offs and Known gaps

| Gap | Impact | Blocks release? |
|---|---|---|
| At 200% on phones the object count/clock shrink to a sliver (they yield so the action labels stay whole). | Count/clock unreadable at extreme text scale; no control lost. | No — recommend accept; alternative is hiding them at that scale. |
| 320 px at 200%: labels break inside the word. | Readable but less tidy. | No |
| Native Dynamic Type / Android font scale, VoiceOver/TalkBack, physical phones, real GPU | Emulation only. | Mckay decides (unchanged from previous return). |
| Rotation with the tools panel open | Not re-tested here (unchanged code path). | No |
