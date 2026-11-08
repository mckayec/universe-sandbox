# Checkpoint 25 — chapter selector (bounded)

PR45 `engine/timelines`, parent **04398997c8c01d57c2f05da2368b6fa7828a94f3** (checkpoint 24). Scope per
[independent-review-e5ff736.md](independent-review-e5ff736.md) “Next bounded return” item 2: book/chapter/layer
downgrade and selection/detail/search/URL fail-closed checks; no-selector behaviour stays fail-closed; **0/12 real
relationships promoted** (no sidecar or source change). Folded-row connectors remain a later unit.

## What changed (3 runtime files + 1 test file)

- `public/atlas/timeline.js`: two pure helpers, exported on `AtlasTimeline`.
  - `chapterCount(books, b)` — a book declares chapters only with a positive-integer `books[b].chapters` (≤ 9999);
    anything else is 0 (no selector).
  - `chapterPos(books, b, raw)` — a selector/URL value is a chapter position only as plain decimal digits
    `1..chapterCount`; missing, empty, `0`, leading zero, sign, fraction, exponent, whitespace, out of range or a
    book without chapters → `null` (“not set”).
  - `chapterOk` is unchanged: `null` keeps the current book's chapter-gated records hidden.
- `public/atlas/engine.js` (atlas host):
  - `S.chapter` (default `null`). The timeline `ok` gate now passes `chapter: S.chapter` instead of a fixed `null`.
  - Header `<select id="chapterSel">` (“Not set”, “Through 1…N”), rendered only when the pack is cumulative and at
    least one book declares `chapters`; shown only while such a book is selected. `renderChapterSel()` runs first in
    `refreshAll()` and re-validates `S.chapter` against the current book (invalid → `null`).
  - Changing book resets the chapter to `null` (fail closed); re-pressing the same book keeps it.
  - URL: `ch=<n>` is written only for the selected book with a valid position. On a fresh load, `ch` is applied only
    when the link itself names that book (never to a remembered book). Same-document hash navigation / Back
    (`popstate`) applies `ch` when the hash names the book on screen; a missing or invalid `ch` there means “not
    set”. This runs before the timeline's own `tlsel` restore, so a selection is restored only if its record is
    visible at that chapter.
  - Screen-reader announcement adds “, through chapter N”.
- `public/atlas/engine.css`: `.chsel` select styling (28 px min height, focus-visible outline).
- `tests/atlas-timeline-sw.test.ts`: 3 tests — `chapterCount` declarations, `chapterPos` valid values and 12
  rejected forms, `chapterOk` with a chosen chapter (earlier/current/later book).

No pack declares `chapters` today (the PR33 Standard Works pack and the Religious Traditions pack have none), so on
the shipped packs the selector never renders and behaviour is exactly the previous no-selector, fail-closed gate.

## Evidence (builder-run)

- `pnpm check` (format, build, unit tests, check:dist): **162/162** tests (159 + 3 new); check-dist 122 files OK.
- `pnpm test:pages`: **12 pages x 2 viewports** passed under `/universe-sandbox/`.
- [tl25/chapter-probe.mjs](tl25/chapter-probe.mjs) on built `dist/` (temp copy; synthetic fixture appended to the
  Religious Traditions pack there only — cumulative mode, two books, three tree nodes gated
  `jud-karaite` first 1 ch 3, `jud-covenant-tradition` first 1 ch 5 (undated), `jud-ananites` first 2):
  **112 PASS, 0 FAIL, 2 INFO** — [output](tl25/chapter-probe-output.txt). Variants × 1440x900 and 390x844:
  - `chapters` (book I declares 6 chapters): selector hidden on All; book I shows Not set + 6; not-set hides both
    chapter-gated records; ch 3 shows Karaite only, URL `ch=3`, announcement; Karaite selected → ch 2 removes
    selection, detail and `tlsel`; undated search for “Covenant tradition” 0 hits at ch 2, ≥1 at ch 5; selection at
    ch 5 → `jud` layer chip off removes it and keeps `ch=5`, on restores; Not set drops `ch`; book II (no chapters)
    hides the selector and drops `ch`; back to book I is Not set; All hides it; same-document hash `ch=2` applied,
    `ch=abc` → Not set; fresh loads `book=1&ch=3&tlsel=Karaite` restored, `ch=9` → Not set and selection not
    restored, `book=2&ch=3` → `ch` dropped, `ch=3` with no book (remembered book 1) → ignored.
  - `no-chapters` (same fixture, no `chapters`): no selector; book I hides both chapter-gated records; a link with
    `ch=3` is ignored and dropped.
  - `unmodified` real single-mode pack: no selector element; All matches the model exactly.
  - Every state is an exact list-id / gated-model-id set comparison with an independent copy of the host gate
    (book + chapter + layer), rows == distinct (TL23-E1), relationship header and list count == gated edges,
    and agreement with `AtlasTimeline.visible()`. No runtime errors in any variant.
- [Header screenshots](tl25/header-1440.png), [390](tl25/header-390.png) (`#book=1&ch=3`, timeline closed): the
  selector sits after the book buttons, 100x28 px at both widths.

## Limits (carried, not closed)

- **Simulated input.** All activations are DOM-level (`click()`, select value + `change`). INFO: with the timeline
  open the selector is on-screen but covered by the timeline panel at both widths (`topIsSelect:false`), as the
  layer chips were in checkpoint 23; a reader closes the timeline to change chapter. A real close → change → reopen
  sequence is not separately validated.
- **Timeline only.** The atlas's own world/event panels and the family tree do not gate on chapters (no pack declares
  chapter gates outside the timeline). A pack adding `chapter` to events would need that host work first.
- The chapter is not remembered across reloads (only `book` is stored); a reload without `ch` starts at Not set
  (fail closed).
- Fixture-only evidence: no shipped pack declares chapters; the synthetic gates are test fixtures, not content.
- Retained from earlier reviews: O-1 same-document **layer** restoration, TL22-E2 real pointer/keyboard
  input and 1440 click timeout, mobile 1714-row performance, device/AT checks, PR33 integration, full technical
  qualification and Mckay's release approval. 0/12 real relationships promoted. Not merged.
