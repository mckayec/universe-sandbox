# Timeline checkpoint 11: drag-to-reorder lanes

Parent: cc173073299c43527d56ca71237111f45d43b2f1 (checkpoint 10 / TL-E01). Closes the open "drag reorder" item; the
↑/↓ buttons (checkpoint 3) stay as the keyboard and switch-access path.

## What changed

- `public/atlas/timeline.js`: two pure helpers, unit-tested in `tests/atlas-timeline.test.ts`:
  `dropLane(order, id, to)` (take a lane out, insert it at slot `to`, clamped; unknown id or own slot = no change) and
  `nearestSlot(boxes, x, y)` (chip whose centre is nearest the pointer; rows weighted ×3 so a wrapped row is not
  crossed by accident).
- `public/atlas/timeline-view.js`: each lane chip has a grip (⠿, `aria-hidden`, 34×46 px, `touch-action:none`).
  Pointer drag (mouse, pen, touch) with pointer capture marks the drop slot, nudges the sideways-scrolling compact
  lane bar near its edges, and on release reorders through the same `arrangeLanes` merge as the buttons (lanes hidden
  by gates keep their place), re-renders, focuses the moved lane's toggle and writes the order to the URL (`tl=`).
  `pointercancel` abandons the drag.
- `public/atlas/engine.css`: grip, dragging, dragged and drop-target styles.

## Evidence

- `pnpm check`: format, build, 126/126 tests, check:dist 121 files OK.
- `tl11/tl11-probe.mjs` against `pnpm preview` (bundled Playwright Chromium, SwiftShader): **PASS 40** at 390×844
  (real CDP touch events), 1280×800, 1440×900 and 3840×2160 (mouse): grip on every chip and at least 32×44 px; drop
  target marked during the drag; first lane dragged to slot 3 lands there; URL carries the order; focus on the moved
  lane's toggle; no drag classes left; ↑ still works after a drag; a drag released on its own slot is a no-op; Reset
  restores the default order; no console/page errors. Output in `tl11/results.json`; screenshots `tl11/*.jpg`
  (looked at: drop ring visible at 1440; phone lane bar unchanged apart from the grip).

## Not verified

Physical iOS/Android touch, real GPU, macOS Chrome, assistive technology (the grip is hidden from AT by design; the
buttons remain). Other open items unchanged: Standard Works adapter and chapter-aware gates, genealogy/succession/
travel/Apocrypha chronology/world calendars, empty record `src` arrays, CH13 403, X08 partial inspection.
