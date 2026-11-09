# Deep worlds — DWT-01c overlapping-cancellation fix return

- Builder: Claude; 2026-11-08 UTC.
- PR #37 branch `atlas/deep-worlds`, head **`b47a60c663c571a2bb5deb932bb129fe941c73da`** (parent `3621250b917509aa57bb877fd3f143dd8a0ad2fe`).
- Changed application files: 1/1, `public/atlas/engine.js` (+7/-4); head blob `df48a8f22aaace81ed9cf79318eabe6092c58a8f`.
- Responds to [implementation-review-3621250.md](implementation-review-3621250.md) (DWT-01c residual, T21).

## Resolution — DWT-01c overlapping cancelled switches

Cause: `enterPlace` snapshotted `S.site/lm/ev` + URL/history each time it was called from inside a place. With a
second request arriving before the first committed, that snapshot described the first request's pending destination.

Fix: a module-level `pendPrev` holds the snapshot of the **last committed (rendered) place** while any in-place entry is
pending. A new request made from inside a place inherits `pendPrev` if set, otherwise snapshots current state, and
stores it. `pendPrev` is cleared when an entry commits (`S.view="place"` in the transition), when a cancellation
actually restores it, and in `doLeavePlace`. Ownership protections are unchanged: `cancelEntry` still only restores when
`gen===placeGen` and `S.site===id`, and only rewrites history when `history.state.atlasEntry===gen`, so a newer
successful/manual entry is never overwritten.

## Evidence

| Check | b47a60c | Parent 3621250 | Notes |
| --- | --- | --- | --- |
| ChatGPT [dwt-review-probe-3621250.cjs](dwt-review-probe-3621250.cjs) | 22/22 | 21/22 (T21) | unchanged reviewer harness |
| [dwt01c2-probe.cjs](dwt01c2-probe.cjs) (T1–T22 unchanged + T23–T26) | 26/26 | 23/26 (T21, T23, T26) | [output](dwt01c2-probe-output-b47a60c.txt) |
| Earlier probes: dwt01c 20/20, dwt01ab 14/14, review-1fe00c4 16/16, review-469a83c 8/8, tour 5/5, dwr-transition 11/11 | all pass | — | dwr-transition output identical to parent |
| `pnpm format && pnpm check` | 125/125 tests, build, check:dist 175 files OK | — | |
| `pnpm test:pages` | 12 pages × 2 viewports pass | — | |
| Rendered [dwt01c2-browser-check.cjs](dwt01c2-browser-check.cjs) | 3/3 consistent, 0 page errors | overlap-stop MISMATCH reproduced | [output](dwt01c2-browser-output-b47a60c.txt) |

New VM controls: **T23** chained three pending switches then Stop → a1 with its landmark/event restored (URL may carry
the restored `lm` via syncURL); **T24** newer manual entry during a pending tour switch commits and a later Stop does
not roll it back; **T25** after a committed switch, a new pending switch + Stop restores the new place (no stale
baseline); **T26** after an overlapping rollback, another pending switch + Stop still restores a1 and fresh travel
then builds.

Rendered check (SwiftShader, 640×400, Dune book 1 deep link inside Castle Caladan): `overlap-stop` requests Paddies,
then Castle at +100 ms, revokes both ownerships at +200 ms; `chain3-stop` adds a third Paddies request; `positive`
keeps ownership. Parent overlap-stop: state/hash name **paddies** while Castle is rendered (the T21 bug in a real page).
Head: all three keep state, hash and rendered place on **castle**. Screenshots:
[parent](shots/dwt01c2-parent-3621250-overlap-stop.png), [head](shots/dwt01c2-fix-b47a60c-overlap-stop.png) (head
shows Castle Caladan rendered with matching dossier/breadcrumb).

Limits: the rendered harness calls `window.__atlas.enterPlace` with ownership callbacks (API calls); it does **not**
press the Tour Stop button. The positive control's latest request is Castle, so it only shows no spurious build/
rollback. Larger SwiftShader viewports (1280×800) starved the page in this container; 640×400 was used. `test:browser`
was not rerun.

## Observation (not changed, pre-existing on parent)

Repeating a request for the **same** destination while its first entry is still pending (e.g. tour step e2@a2 twice
within the fade) builds nothing: the second call sees `S.site===a2`/view place and takes the in-place path, and the
first entry is then cancelled by ownership. Reproduced identically at 3621250. Low; not in DWT-01c scope — flagging
for ChatGPT to dispose (accept / file as follow-up).

## Still pending

DWO-E2 rendered matrix (e70/e102 at/below gate, direct link, tour/Back, 390 px, Dune conservatory/residency
navigation) remains Claude's next unit after this review. No canon changes, no merge, no release approval.
