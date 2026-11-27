# PR47 integration receipt — sim/clarity-physics at 4c3c03d

- Branch: `sim/clarity-physics`; head `4c3c03d6ffe918317959c72db32805805170800b` (merge commit; parents `fdec175` = approved PR47 head, `8a28073` = main after PR39/PR24/PR44).
- Author: Claude, 2026-11-27T01:10Z. Not merged.

## Conflict resolutions
- `src/ui/template.ts`: token-level 3-way merge, no manual choices. Result keeps PR44 (Undo/Redo before the named-systems select, `aria-pressed` on interaction modes, `#touch-hint`, `role="group" aria-label="Simulation speed"`, `aria-hidden` glyphs) and PR47 (`#overlay-stack` wrapping guide/badge/narration/legend/navigation help, Kids bar, Kids mode button). Every id appears exactly once.
- `src/ui/feed.ts`: adopted PR44 `COMPACT_QUERY` (`(max-width: 800px), (max-height: 500px) and (pointer: coarse)`). `ui/overlay-layout.ts` keeps its own `(max-width: 800px)` so the SC6-O1 budget stays aligned with the PR47 CSS it controls.
- `src/style.css`: both sides appended blocks at the end; kept PR47 blocks (overlay stack, SC6-O1 residual, SC7-O1, Kids) followed by PR44 blocks (≤360px top bar, enlarged-text rules, landscape-phone dock grid, WebGL notice).
- Docs conflicts: main's version.

## Integration fixes (new, please review)
1. `.kids-mode .touch-hint { display: none }` — PR44's adult hint ("Tap an object to inspect · drag it to move") showed above the Kids bar.
2. `tests/kids-cancel.test.ts`: the extracted-handler harness stubs PR44 helpers `showMode`, `setTouchHint`, `builderTouchHint` (called by `setInteractionMode`). No assertion changed.

## Checks at 4c3c03d
- `pnpm format` then `pnpm check`: format OK, build OK, 281/281 unit tests, check:dist 120 files OK.
- `pnpm test:pages` (CHROME_PATH = bundled Chromium 1243): 14 pages × 2 viewports pass.
- `pnpm test:browser`: pass (paused Save→Clear→Load 29/29).
- Rendered (SwiftShader) at 1440×900, 390×844, 844×390, 667×375, 390×844 `?kids=1`: 0 console/page errors, no horizontal overflow. Screenshots: [shots-integration-4c3c03d/](shots-integration-4c3c03d/). Viewed: touch hint sits above the dock in portrait and landscape; Kids bar clear; overlay stack empty at rest.

## Not exercised (known gaps for the recheck)
- Guided exhibit + legend + navigation help open together on 844×390 (PR44 landscape grid vs SC6-O1 budget) — the two layouts now coexist on landscape phones wider than 800 px only through PR44's rules.
- Real-device touch.
