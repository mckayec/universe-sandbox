# DWT-01c fix return — 3621250

2026-11-08 UTC. PR37 `atlas/deep-worlds`, head **3621250b917509aa57bb877fd3f143dd8a0ad2fe**, parent **1fe00c42d4d44c61544a68223e2d47ad40704d70**. 1 file: `public/atlas/engine.js` (+11/−3). No pack/content change.

## Change

- `enterPlace` records, only when called from inside a place, the rendered place's `site`, `lm`, `ev`, `history.state` and `location.href` before writing the destination.
- `cancelEntry(fromHistory, gen, id, prev)`: when still inside a place, it restores that snapshot **only if this entry still owns state** — `gen === placeGen` (no newer navigation bumped the generation) and `S.site === id` (nothing else re-pointed the site). History is put back (replaceState to the saved state/URL) only if the current entry is the one this call wrote (`atlasEntry === gen`). Landmark focus/overview is reapplied; `refreshAll()` syncs UI. A superseded entry returns without touching anything, so newer navigation/history always wins.
- Not-in-place cancellation path unchanged (DWR-B/DWH-01 behaviour kept).

## Evidence (builder-run)

| Check | Fix 3621250 | Parent 1fe00c4 |
|---|---|---|
| [dwt01c-probe.cjs](dwt01c-probe.cjs) = reviewer harness unchanged + T17–T20 | **20/20** | **17/20** (T15, T19, T20 fail) |
| Reviewer [dwt-review-probe-1fe00c4.cjs](dwt-review-probe-1fe00c4.cjs) | **16/16** | 15/16 (reviewer's own result) |
| dwt01ab-probe 14/14, dwt-review-probe-469a83c 8/8, dwt-tour-probe 5/5 | pass | — |
| dwr-probe, dwr-transition-probe, dwr-history-probe-d902c8a, dwr-residual-probe-232fef1 | output byte-identical to parent | — |
| `pnpm check` (format, build, 125/125 tests, check:dist 175 files) | pass | — |
| `pnpm test:pages` (headless shell 1243) | 12 pages × 2 viewports pass | — |
| [Rendered check](dwt01c-browser-check.cjs) (SwiftShader, 1280×800, Dune Castle Caladan → Paddies, ownership revoked at 100 ms) | state/hash/dossier = castle, rendered = castle | state/hash = paddies, rendered = castle (DWT-01c reproduced) |
| Rendered positive (ownership kept) | paddies everywhere | paddies everywhere |

New tests: T17 Stop then newer manual entry → newer wins; T18 tour step superseded by a newer step on another world → newest wins, no rollback to a1; T19 fresh travel to the same destination after a rolled-back Stop builds it (parent fails: state already named a2, so the step was a no-op); T20 landmark/event selection restored. Output: [dwt01c-probe-output-3621250.txt](dwt01c-probe-output-3621250.txt), [dwt01c-browser-output-3621250.txt](dwt01c-browser-output-3621250.txt). Screenshots: [fix](shots/dwt01c-fix-stop.jpg), [parent](shots/dwt01c-parent-stop.jpg).

Rendered check drives `window.__atlas.enterPlace` with an ownership callback (the hook tour Stop uses), not a real Tour-button click sequence.

## Limits / still open

- `fromHistory` (popstate-driven) entries are not rolled back: the browser already owns that URL, and no tour ownership is passed on that path.
- `test:browser` simulator smoke not re-run this unit (pre-existing Save/Load intermittency carried).
- **DWO-E2 remains pending** (e70/e102 at/below book, direct place links, real tour, Back/history, 390×844, conservatory restoration, residency control). Not attempted this run; the rendered harness above works in this container with `chrome-headless-shell` 1243, `--no-proxy-server` and `waitUntil: 'commit'`, which should unblock it.
- No canon, full technical or release approval claimed.
