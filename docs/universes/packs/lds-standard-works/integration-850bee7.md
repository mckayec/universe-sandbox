# PR33 integration receipt — pack/lds-standard-works at 850bee7

- Branch: `pack/lds-standard-works`; head `850bee707ba9a0facc8fa06ada0126276be9f974` (merge commit; parents `3e5791e` = approved PR33 head, `8a28073` = main after PR39/PR24/PR44).
- Author: Claude, 2026-11-27T01:10Z. Not merged.

## Conflict resolutions (6 files, 16 hunks)
- `engine.js`
  - Surface shader: PR33 `baseAt(p)`/`gB` refactor (main side was unchanged from base).
  - `#app`: main's `onebook` class + PR33's #labels DOM-order comment.
  - `loadEarth`: PR33 hi-mask path and fallback kept; low-res choice now `LOWMEM||HD<4096` (main's rule also covers software GL via `HD`).
  - Site labels: PR33 S46/S47 compact layout kept whole. **Integration choice:** main's chrome-rect hiding (`CHROME_SEL`, `chromeRects`, `hitsAny`) is added for wide layouts only (`MOB` false): a non-selected label under the header, crumbs, filters, details panel, chronicle or open index hides. On compact layouts PR33's band logic decides, as before.
  - Details panel: `routesHtml(w)` then main's `refPlacesHtml(w)`.
  - `NOTE_LBL`: main's `notsame: "Not the same as"` plus PR33 `noteHtml`.
  - Click handler: PR33 route toggle, then main's `[data-cx],[data-cxtab]` reference-card opener, then PR33 site/stop selection.
  - Codex: PR33 `codexSplit` filtering, `cxItem`, `cxFit` chooser and `#cxPick`; `openCodex(tab, entry)` from main (highlight + body-only scroll) with PR33's `cancelEvFocus()` and `cxFit()`.
- `engine.css`: PR33 `#codex` grid (rows and columns) and chooser rules; main's 1600 px filters breakpoint and the width:auto comment; both appended blocks (PR33 sky/landscape controls, main typed-relation tree + reference cards).
- `layers.js`: attributed `date` text, else main's `whenText`, else formatted `when`.
- `registry.js`, `src/universe-packs.ts`, `tests/standalone-pages.mjs`: all of lds-standard-works, christian-apocrypha, abrahamic-world-religions; `SURFACE_START` kept.
- Docs: main's version, plus `supplementary-build/s28-callback-probe.cjs` now finds `function openCodex(` and stubs `K`/`CX_BY` (branch-only probe; no expectations changed).

## Checks at 850bee7
- `pnpm format` then `pnpm check`: format OK, build OK, 260/260 tests, check:dist 123 files OK.
- `pnpm test:pages`: 15 pages × 2 viewports pass. `pnpm test:browser`: pass.
- Rendered (SwiftShader) `atlas/?pack=lds-standard-works` at 3840×2160, 1440×900, 1280×800, 390×844 and `?pack=abrahamic-world-religions` at 1440×900, 390×844: 0 console/page errors, no horizontal overflow. Screenshots: [shots-integration-850bee7/](shots-integration-850bee7/) (viewed 1440, 390 and abrahamic 1440).

## For the recheck
- Codex: a reference-card link in the abrahamic atlas should open its tab and highlight the card; LDS see-also links and the phone section chooser should still work.
- Desktop label hiding under chrome now applies to the LDS atlas too (new for PR33).
