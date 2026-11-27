# Deep worlds — DWT-02 fix at PR37 311e9fe

- Builder: Claude, 2026-11-08T11:46–11:53Z. Exact head: `311e9fefa4bad16dff40e909d57f0b450532b216` (atlas/deep-worlds; parent `117ecbaadfe9a06fb24d8be79fb7262d71486c54`). Builder-executed, not independent. Not merged.
- Application change: `public/atlas/engine.js` only (+9/−3). Probe and output on main in this folder.

## Cause (confirms implementation-review-117ecba.md)

`enterPlace` from inside a place sets `S.site` to the destination before its fade commits. A second `goEvent` for the same destination bumps `evNav` (so the first entry's `own()` is false and its transition cancels and rolls back to a/a1), then sees `S.site===e.site` and takes the already-rendered branch `evInPlace`, which returns because nothing is rendered yet. Net: neither request arrives.

## Fix

- `pendGen` records the `placeGen` of the latest entry started from inside a place; `entryPending()` = `pendPrev` set and `pendGen===placeGen` (an in-place entry is in flight and nothing newer — leave, openEvent, book change — superseded it).
- `goEvent`, same-world place branch: `S.site===e.site` uses `evInPlace` only when no entry is pending; otherwise it re-issues `enterPlace` for the same site. The re-issue reuses `pendPrev` (committed rollback baseline a/a1) and replaces the pending place history entry (no extra push); the superseded transition cancels as a no-op (`gen!==placeGen`). The latest request arrives once.
- Unchanged: committed same-site requests stay idempotent (`evInPlace`, no rebuild); distinct-destination, cancellation, rollback and book paths.

## Evidence (Node VM over the exact engine.js slices; renderer/DOM mocked — not rendered browser evidence)

[dwt02-fix-probe.cjs](dwt02-fix-probe.cjs) reuses ChatGPT's `dwt02-characterization-117ecba.cjs` `ctx()` verbatim (same four presentation/book mocks; all fixture worlds visible — these are mocks, not gating checks). Output: [dwt02-fix-probe-output-311e9fe.txt](dwt02-fix-probe-output-311e9fe.txt).

| Check | parent 117ecba | head 311e9fe |
|---|---|---|
| R1 repeated identical pending a/a2 → arrives once, e2, URL a2, history length 3 | FAIL | PASS |
| R2 committed a/a2 then same request: idempotent, no rebuild (positive control) | PASS | PASS |
| R3 distinct newer destination b/b1 while a/a2 pending | PASS | PASS |
| R4 newer request back to committed a/a1 while a/a2 pending | PASS | PASS |
| R5 triple repeat → one arrival | FAIL | PASS |
| R6 repeat then Stop before commit → committed a/a1 state+URL restored; R6b fresh retry arrives | PASS | PASS |
| Total | 5/7 | 7/7 |
| ChatGPT characterization (unchanged) desired arrival + recovery | 1/2 | 2/2 |
| 26 cancellation regressions (`dwt01c2-probe-f2.cjs`) | — | 26/26 |
| 8 F1 regressions (`dwo-e2-f1-review-probe-f2.cjs`) | — | 8/8 |

`pnpm check` (format + build + 125/125 unit tests) and `pnpm test:pages` (12 pages × 2 viewports) pass at 311e9fe.

## Limits

No real rendered-browser reproduction of DWT-02 was run (the case needs a second identical event request within a fade, which the existing browser harnesses do not drive); the VM result is not promoted to browser evidence. 90-matrix and `test:browser` not rerun. Visual, browser/device, Society, Save/Load, full canon/technical and Mckay release gates remain.
