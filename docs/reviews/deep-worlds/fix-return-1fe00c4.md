# Deep worlds — DWT-01a/b return at PR37 1fe00c4

PR37 `atlas/deep-worlds` head: **1fe00c42d4d44c61544a68223e2d47ad40704d70** (parent **469a83c4c13f10aa9e280cd472d54274a014642b**).
Instruction: [implementation-review-469a83c.md](implementation-review-469a83c.md) §"Required finite correction".
Diff: `public/atlas/engine.js` only (+20/−14; head blob `591a806fe19715177d7c5138ac5beb1a2d62a8ac`). No pack/data/canon change.

## DWT-01a — Stop ownership
- `enterPlace(id,fromHistory,then,own)` and `evInPlace(e,own)` accept an optional ownership check. `goEvent`
  passes its latest-step token (`own=()=>t===evNav`) to every entry and in-place event it starts.
- An entry whose owner was superseded (tour Stop, book change, or a newer step) before its fade commits goes through
  the existing `cancelEntry` path: nothing is built and the place history marker that entry pushed is dropped
  (DWH-01 `atlasEntry===gen` rule unchanged). A queued effect checks the same owner before playing.
- `tourStop` also calls `PLACES.stopFx()` when a tour was actually running, so an effect already playing stops too.
- Manual (non-tour) entries pass no owner and are unaffected by Stop (T10).

## DWT-01b — pending traversal ownership
- `goBack` holds an explicit `backPending` flag, set on `history.back()` and cleared only by `popstate` (or a
  bfcache `pageshow` with `persisted`). The 2 s wall-clock window and the `setTimeout(navKick,2050)` fallback are removed.
- `navIdle()` = no fade in flight and no Back pending; newer requests keep replacing the single queued request.
- No recovery timeout unlocks travel. A Back still pending after 5 s only logs a console warning. **Known gap:** if a
  browser ever dropped the popstate for an in-app Back, tour travel would hold (no second Back) until the next
  popstate/pageshow; not observed, and not certified on real browsers/devices.

## Regression — [dwt01ab-probe.cjs](dwt01ab-probe.cjs) ([output](dwt01ab-probe-output-1fe00c4.txt))
The independent chronological harness from `dwt-review-probe-469a83c.cjs`, unchanged, with T9–T14 added. VM model:
real engine source slices; renderer/DOM mocked; timers by due time; asynchronous popstate. Not a browser claim.

| Case | parent 469a83c | head 1fe00c4 |
|---|---|---|
| T1–T5 (original) | 5/5 PASS | 5/5 PASS |
| T6 Stop 100 ms into same-world entry | FAIL (`a/a1` built) | PASS |
| T7 Stop before queued effect | FAIL (`burst` played) | PASS |
| T8 3000 ms Back, newer request at 2100 ms | FAIL (2 Backs) | PASS (1 Back, c/c1/e2) |
| T9 positive: fresh navigation after Stop builds place + plays effect, final history `#world=a&site=a1&view=place` | PASS | PASS |
| T10 Stop does not cancel a manual entry | PASS | PASS |
| T11 positive: single step with 3000 ms Back completes once at b/b1/e1 | PASS | PASS |
| T12 = T8 + final history entry is c/c1 place with marker | FAIL (2 Backs) | PASS |
| T13 Stop mid-entry drops that entry's place marker | FAIL (marker kept) | PASS |
| T14 8000 ms Back, newer request at 6000 ms | FAIL (2 Backs) | PASS |

Totals: parent **8/14**, head **14/14**. Reviewer's unmodified `dwt-review-probe-469a83c.cjs` at head: **8/8**.
Prior probes at head: `dwt-tour-probe` 5/5, `dwr-probe`, `dwr-transition-probe`, `dwr-history-probe-d902c8a` all exit 0.
`dwr-residual-probe-232fef1.cjs` exits 1 at both head and 469a83c (232fef1-era characterization; not a signal for this change).

## Checks at 1fe00c4 (builder-run, this environment)
- `pnpm format` (no changes) and `pnpm check`: format, build, **125/125** tests, check:dist 175 files OK.
- `pnpm test:pages`: first attempt aborted with an error after `atlas/?pack=dune @mobile`; immediate rerun **24/24 ok** (12 pages × desktop/mobile). Recorded as one intermittent failure, not hidden.
- `pnpm test:browser` (simulator smoke): passed.

## Not done / retained
- **DWO-E2** rendered validation is still pending and is not claimed here (no new real-browser tour/Back run this return).
- Three Dune omissions, accepted leaf changes, scoped retains, eight source holds and 139 unselected records unchanged.
- Not merged; no canon, full technical or release approval implied.
