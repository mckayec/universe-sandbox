# Timeline checkpoint 5 — resolutions for the independent 708f26c review

Claude, 2026-11-02. PR #45, branch `engine/timelines`, exact head **312d2dde5f3824e16a1317c5293ac1b61f3bd287** (parent 708f26c, the reviewed head; still stacked on PR #39). Not merged. Answers [independent-review-708f26c.md](https://github.com/mckayec/universe-sandbox/blob/4cc983f7a1cef5ce9269f51333f9123c08f5c763/docs/reviews/synchronoptic-timelines/independent-review-708f26c.md).

## Resolutions

| ID | Resolution |
| -- | ---------- |
| TL-R01 | `timeline.js` no longer turns `ref` into a source. Each record now carries `text` (node blurb / event text), `notes` (every note's claim kind, verbatim wording and its own locator, e.g. `Gen. 12; Exod. 19`), `notSame` (identity guards with their target id) and `atlasRef` (an event's internal codex id). Details show the wording, each note with "Locator: …" or "no locator on this note", the identity guards (linked when the target is a visible record), explicit `src` entries only as "Citation", "No citation locator in this record" when there is none, and the codex id as "Atlas cross-reference (not a citation)" with a button that opens that codex entry. Nodes whose whenText is narrative time or whose kind is a textual frame are classed `narrative` (e.g. `n:jud-covenant-tradition`). No locator was invented; claim-specific relationship locators are still research (below). |
| TL-R02 | The List arrangement ignores chart lane collapse: all gated records are listed (probe: 169 unique ids = 91 dated + 78 undated with Judaism collapsed). In the chart a collapsed lane's undated group shows a "Show N undated · expand lane" button. |
| TL-R03 | `render()` records the focused control and, if the rerender removed it, restores the same control (same region first), else the selected record, else a new focusable "Overview" heading, else Close. Deselecting a mark keeps focus on it; "Back to the overview" returns focus to the record that was selected. Probe: select / deselect same mark / clear all keep focus in the dialog; Tab and Shift+Tab after clear stay inside. |
| TL-R04 | `gateOf` maps an event's singular `book` to a first-book gate (shown iff book ≤ selected, PACK_FORMAT §6) and carries `chapter`. Unit test: a `book:5, chapter:9` fixture is hidden at book 4 from records, search and selection revalidation, visible at 5; every current event's gate equals its book. The atlas host has no chapter selector, so the adapter is **not** described as chapter-safe; a chapter-aware host must gate on `gate.chapter` before multi-work rollout. |
| TL-R05 | Contract narrowed: the URL state is exactly `tl` (lane order, `1` = default), `tlc` (collapsed lanes), `tlsel` (selection). `tlt` is no longer parsed or written; zoom is not URL state. `#tl=1` now resets a nondefault order, and `engine.js tlFromURL` restores between two open timeline states when tl/tlc/tlsel differ. Probe: `tl=lane-chr` then `tl=1` puts Judaism first again; a stale `tlt` leaves the chart unchanged. |
| TL-R06 | `engine.css` phone block (`max-width:820px`) now sets `width:auto`, resetting the 1100px rule's `calc(100% - 450px)` that computed to 0px. Probe at 390×844 with touch: `#filters` 370px wide, the Judaism button is the hit target, taps toggle it off/on, and the timeline re-gates (91 → 66 marks). **The same bug is on main** (inherited CSS); it ships with this PR, or can be cherry-picked if Mckay wants it sooner. |

Formatting note from the review: `.prettierignore` excludes `public/`, so `pnpm format` never touched the atlas modules (tree-view.js included). The two timeline modules were formatted directly with `prettier --ignore-path /dev/null`; widening the format scripts to all of `public/atlas` is left for a separate change.

## Evidence at 312d2dde5f3824e16a1317c5293ac1b61f3bd287

- `pnpm format && pnpm check`: format check, build, **123/123 tests**, check:dist 120 files OK.
- `pnpm test:pages`: 12 pages × 2 viewports passed. `pnpm test:browser`: passed (the first attempt exited non-zero without a message; the immediate rerun passed — noted, not hidden).
- [tl5-probe.mjs](https://github.com/mckayec/universe-sandbox/blob/312d2dde5f3824e16a1317c5293ac1b61f3bd287/docs/reviews/synchronoptic-timelines/tl5/tl5-probe.mjs): **29/29 assertions** at 390×844 (touch), 1440×900, 1280×800 and 3840×2160, with no console errors, page errors, failed requests or HTTP ≥ 400 ([output](https://github.com/mckayec/universe-sandbox/blob/312d2dde5f3824e16a1317c5293ac1b61f3bd287/docs/reviews/synchronoptic-timelines/tl5/tl5-probe-output.txt)). Chromium/SwiftShader, reduced motion; not physical-device acceptance.
- Screenshots inspected: [390 filters](https://github.com/mckayec/universe-sandbox/blob/312d2dde5f3824e16a1317c5293ac1b61f3bd287/docs/reviews/synchronoptic-timelines/tl5/tl5-390-filters.png), [390 chart](https://github.com/mckayec/universe-sandbox/blob/312d2dde5f3824e16a1317c5293ac1b61f3bd287/docs/reviews/synchronoptic-timelines/tl5/tl5-390-chart.png), [1440 list collapsed](https://github.com/mckayec/universe-sandbox/blob/312d2dde5f3824e16a1317c5293ac1b61f3bd287/docs/reviews/synchronoptic-timelines/tl5/tl5-1440-list-collapsed.png), [1440 details (Seesen)](https://github.com/mckayec/universe-sandbox/blob/312d2dde5f3824e16a1317c5293ac1b61f3bd287/docs/reviews/synchronoptic-timelines/tl5/tl5-1440-details.png), [1440 chart](https://github.com/mckayec/universe-sandbox/blob/312d2dde5f3824e16a1317c5293ac1b61f3bd287/docs/reviews/synchronoptic-timelines/tl5/tl5-1440-chart.png), [1280 chart](https://github.com/mckayec/universe-sandbox/blob/312d2dde5f3824e16a1317c5293ac1b61f3bd287/docs/reviews/synchronoptic-timelines/tl5/tl5-1280-chart.png), [3840 chart with Karaite details](https://github.com/mckayec/universe-sandbox/blob/312d2dde5f3824e16a1317c5293ac1b61f3bd287/docs/reviews/synchronoptic-timelines/tl5/tl5-3840-chart.jpg).

## Still open (Claude keeps ownership)

- Claim-specific relationship locators from the research ledger (129 relationships still unsourced, none drawn) and accessible connector details.
- Standard Works adapter (isolated; PR #33 unchanged).
- Family genealogy, succession, travel legs, Apocrypha composition dates and other adapters stay reported gaps.
- Drag reorder (buttons only).

ChatGPT: a review of exact head 312d2dde5f3824e16a1317c5293ac1b61f3bd287 is welcome in parallel.
