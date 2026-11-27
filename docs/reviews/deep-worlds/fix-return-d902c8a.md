# Deep Worlds — residual fix return at d902c8a

2026-11-07T14:56Z · Claude (builder). Responds to implementation-review-232fef1.md (DWR-B residual, DW-CS04-label).

**PR #37 head: d902c8a7092e5e1f2597af800b11f0f7f63dc901** (branch `atlas/deep-worlds`).
- Fix commit **e22d497eab6565949a2e5348466457b9a283a8b4** (parent 232fef1): 2 files, `public/atlas/engine.js` (+6/−2), `public/atlas/packs/cosmere.js` (1 line).
- Merge commit **d902c8a** = e22d497 + main 51fe688 (conflict reconciliation; PR was mergeable=false).

## DWR-B residual — transition/destination guard

| Required repair | Change |
|---|---|
| Guard transition with captured generation + intended destination before view change / PLACES.enter | enterPlace's transition callback now first checks `gen!==placeGen \|\| S.site!==id \|\| S.sel!==w.id \|\| !canEnter(...)`; on any failure it calls `cancelEntry` and builds nothing. |
| Invalidate pending entry on site selection change, incl. away-and-back | `selectSite` now bumps `placeGen` on every call, so A→B→A still invalidates the entry captured before. All existing callers that select-then-enter call `enterPlace` after `selectSite`, so they capture the newer generation. |
| Recheck world/site eligibility at commit | Kept (`S.sel!==w.id`, `canEnter`). |
| Cancelled entry leaves no stale place state | New `cancelEntry(fromHistory)`: if not in a place, replaces the `atlasPlace` history entry the cancelled entry pushed with a surface entry at the current URL, then `refreshAll()`. |

DWR-A code untouched. The 500 ms continuation and evInPlace effect guards from 232fef1 are unchanged.

## DW-CS04-label

`yeddaw/gate` name: "The refugee entrance" → **"The guarded entrance"** (exact text requested). Description, `books: [7]` gate and position unchanged.

## Evidence (builder-run)

- **dwr-transition-probe.cjs** (this folder; derived from ChatGPT's residual fixture with reproductions inverted into remediation assertions): **11/11 pass** at d902c8a sources (output: dwr-transition-probe-output-d902c8a.txt). Cases: T1 positive control (place built, view=place, site matches, effect once); T2 openEvent(null) before fade → nothing built, view not place; T3 selectSite(other) → nothing built, S.site=other; T4 away-and-back → invalidated; T5 fresh navigation after cancellation → enters once and plays effect once; T6 world change; T7 book downgrade. Asserts the entered-place list and S.view/S.site/S.ev, not only effect counts.
- **Negative control:** same probe against 232fef1 engine fails at T2 ("no place built") — the defect it targets.
- ChatGPT's characterization probe dwr-residual-probe-232fef1.cjs now fails its intended-defect assertion at T2 (expected: it asserted the stale build).
- Committed dwr-probe.cjs: **22/22** at d902c8a (DWR-A/B regression).
- `pnpm format` (no changes), `pnpm check`: format, build, **125/125** unit tests (main's added tests included), check:dist 175 files OK.
- `pnpm test:pages`: **12 pages × 2 viewports** pass under /universe-sandbox/.
- `pnpm test:browser` (CHROME_PATH=Playwright Chromium 1243): **pass** (desktop construction, persistence, controls, mobile layout).
- Playwright (swiftshader) load of `atlas/?pack=hyperion` and `?pack=cosmere` at 3840×2160, 1440×900, 1280×800, 390×844: **0 page/console errors in 8/8**; looked at the shots, rendering normal. Two kept: shots/d902c8a-hyperion-1440x900.jpg, shots/d902c8a-cosmere-390x844.jpg.

## Merge reconciliation (main 51fe688 into PR37)

Conflicts: `public/atlas/engine.css` (two independent appended blocks — PR37 places/tour CSS and main's compact work picker; both kept, no rule overlap) and `docs/reviews/deep-worlds/status.md` (main's copy taken; main owns status). Engine/Society/pack files auto-merged; `engine.js` gains main's work-picker code (+27 lines) beside the fix. 27 non-docs files changed by the merge are main's already-reviewed work (apocrypha, Earth mask, infall/galaxy state, etc.). The integration itself is unreviewed for this item; the checks above ran on the merged head.

## Limits

VM fixtures with inert renderer; no real pointer sequence through the fade overlay was driven in a browser. No physical device. Fresh PR CI at d902c8a not yet observed when this was written. No canon claims added; broad Known gaps (DW06 six-pack/Society sources, CS18 partial clauses, geometry, earliest appearances) unchanged. Not merged.
