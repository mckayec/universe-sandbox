# SC7-O1 return: short compact landscape dock (PR47 1acc2ea)

Claude, 2026-11-10 UTC. Bounded unit from [sc4e1-repair-review-3ab737f.md](sc4e1-repair-review-3ab737f.md) §"Bounded handoff".

**Exact head: `1acc2ea61f39cb1f355a661373bf91bf86be00b8`** on `sim/clarity-physics` (draft PR #47), parent `3ab737fe90991767b3cebf5410dc5a1c3b7a6f84`.

## Changed-file receipt

`git diff --stat 3ab737f 1acc2ea` → `src/style.css | 50 +` (1 file, CSS only; no TypeScript change).

| Rule | Where it applies | Effect |
|---|---|---|
| `.tools-collapsed .dock > .tool-panel { flex-shrink: 0 }` | compact (≤800 px wide) | The collapsed tool panel (the dock's action row) never shrinks under an expanded sheet; this was the clipping in the SC7-O1 shot. The sheet takes the rest and scrolls inside itself. |
| `.overlay-tight .tools-collapsed .dock > .tool-panel { position: sticky; top: 0 }` | compact, SC6-O1 tight budget | When the guide/legend/navigation help forces the whole dock to scroll, the action row stays pinned at its top. |
| `@media (max-width: 800px) and (max-height: 430px)` block | short compact landscape (667×375 etc.) | With the sheet **expanded**: the dock may use the band from the universe toolbar to the time row (`max-height: 100dvh − 176px` instead of −230px) and its right edge clears the zoom column (+96 px); the one-line event feed hides (the sheet shows "Last event"); the SC6-O1 budget still wins (`.overlay-tight … { max-height: var(--dock-max) }`). With the tools **collapsed**: Pause/Resume, Clear all and Show tools come first in one wrapping row and the three interaction modes follow as one unit (instead of a two-row grid); at 200% text the modes move together to a second row. |

Result at 667×375: action row 110–172 px, sheet window **180–309 (129 px, was 62)**; at 200% text: row 110–218, sheet 226–309 (83 px). Portrait (390×844) and >800 px wide layouts (844×390 and desktop) are unaffected by the media block.

## Evidence

[evidence-harness-7d.mjs](evidence-harness-7d.mjs) (enforced, exits 1 on any failure), raw output [evidence-7d-1acc2ea.jsonl](evidence-7d-1acc2ea.jsonl): **46/46 pass, 0 fail** — 667×375 11/11, 667×375 @200% text 11/11, 844×390 7/7, 390×844 10/10, 1440×900 7/7. Setup per case: Clear, place a black hole, collapse tools, select it, expand the sheet with Enter.

Controls covered ("every dock control", 11 at 667×375): `panel-toggle` (Show tools), `pause`, `clear`, `add-mode`, `inspect-mode`, `navigate-mode`, `info-expand` (Details/Less), `info-close`, `bh-reference` (Read as), `lock`, `build-lock`. `info-life-zones` is hidden for a black hole and is not covered. On 844×390 and desktop only rendered controls are required (no Show tools / Details there).

Per case:
1. All required controls rendered (667×375).
2. **Action row (Show tools, Pause, Clear all) fully visible inside the viewport and every clipping ancestor and unobstructed at its centre and four points 3 px inside its corners, with no scrolling** (compact cases; enforced).
3. No overlap: tool panel vs sheet, dock vs time row, dock vs zoom column (compact; all 0 px²).
4. Tab, starting keyboard-initiated before the first control, reaches every required control; each, when focused, is fully visible in its scroll window, unobstructed (5 points), `:focus-visible`, and the action row is still fully visible at that moment (compact).
5. Keyboard operation: Enter toggles Pause↔Resume and back (`paused` from the probe), Show tools open/closed, modes Inspect→Navigate→Add (`active`), Details collapse/expand (`aria-expanded`), Position lock and Build lock on/off; ArrowDown/ArrowUp change and restore Read as; Enter on × deselects; Enter on Clear all removes the body.
6. Pointer operation: the same actions with Playwright `click()` (actionability: visible, stable, receives the event at the target point); Read as is clicked, then its value set with `selectOption`.
7. 0 page/console errors in both passes.

"200% text" here = every element inside the dock gets twice its computed font-size (text-only resize, WCAG 1.4.4 style). It is **not** browser zoom (667×375 at 200% zoom is 333×187 CSS px) and not a screen-reader check.

Observations (not enforced): 844×390 desktop layout — Pause/Clear all sit at the bottom of the scrolling desktop tool panel and need a panel scroll (pre-existing desktop layout, unchanged by this unit; focus/pointer reach them, checks 4–6 pass); 1440×900 row visible without scrolling.

**Picker behaviour retained:** the unchanged SC7-E1 harness [evidence-harness-7c.mjs](evidence-harness-7c.mjs) on 1acc2ea: **58/58** ([raw](evidence-7c-1acc2ea.jsonl)) at 844×390, 667×375, 390×844, 1440×900. Its 667×375 observation is unchanged in kind: the readout needs a nearest-edge scroll after the picker change.

Screenshots (viewed): [667×375](shots/sc7d-667x375.png), [667×375 @200% text](shots/sc7d-667x375-200text.png).

Checks: `pnpm format`, `pnpm check` — format OK, build, **224/224** units, check:dist 113; `pnpm test:pages` 12 pages × 2 viewports. Not run: `pnpm test:browser` (strict Save/Load gate is a separate repair), screen reader, browser-zoom 200% at 667×375, physical devices/GPU.

## Gates retained (not closed here)

Strict Save→Clear→Load five-consecutive-run gate; legacy non-hole unit labels; screen-reader coverage; SC1-E1/device/GPU/genuine-background and independent-rendering limits. SC4-E1 consolidation: [final-packet-3ab737f.md](final-packet-3ab737f.md) now references the repair review, and [sc4e1-repair-3ab737f.md](sc4e1-repair-3ab737f.md) carries the 0.301 s and video-only 0.5 s trim corrections.
