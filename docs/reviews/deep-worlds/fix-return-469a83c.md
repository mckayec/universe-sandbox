# Deep worlds — DWT-01 return at PR37 469a83c

PR37 head: `469a83c4c13f10aa9e280cd472d54274a014642b` (parent `aea2347489172e38bb8502aaa65c90af77cda049`).
Instruction: implementation-review-aea2347.md §"Next bounded return" (DWT-01, DWO-E1, DWO-E2).
Diff: `public/atlas/engine.js` only (+33/−16). No pack/data change; the three Dune omissions, all accepted wording,
the eight deferred holds and DWR-A/B/DWH-01 closures are untouched.

## DWT-01 — root cause and fix
Two defects, both in the travel path used by the tour (`goEvent`):
1. **Stale continuations.** `goEvent` chains `leavePlace → ascend → (S.sel=…; enterPlace) → evInPlace` through
   delayed callbacks with no ownership. An older step's callback could run after a newer step and reassign
   `S.sel`/enter its place, cancelling the newer entry (wrong world/site; mismatched hashes).
2. **Double Back.** `leavePlace`/`ascend` decide on `history.state`, which only changes when `popstate` arrives.
   A second request before then issued a second `history.back()`, stepping past the atlas's own entries — from a
   surface with one atlas entry this leaves the document (the "execution context destroyed" exit).

Fix (latest-step ownership):
- `goEvent` takes a token (`evNav`); every delayed continuation it creates runs only while it is still the latest.
  `tourStop` and the book-change handler bump the token (and drop any queued request).
- `goBack()` issues at most one in-app Back at a time (cleared on `popstate`, 2 s fallback).
- While a Back or a leave/ascend fade is in flight (`navBusy`), a newer travel request is queued (latest only) and
  runs once the view has settled (`navDone`/`navKick` after the fade commits or `popstate`).
Nothing else changes for a single, uninterrupted step.

## Regression — `dwt-tour-probe.cjs` (output: dwt-probe-output-469a83c.txt)
Executes the checkout's real engine slices (transition, urlFor/parseHash/syncURL, ascend/doAscend, selectSite,
canEnter, placeGen/evEligible, enterPlace…evInPlace, tourList…goEvent, tourStop, popstate handler) with a FIFO
timer/transition queue and a history stack whose `back()` is asynchronous; DOM/renderer mocked. Not a browser claim.

| Case | parent aea2347 | fix 469a83c |
|---|---|---|
| T1 positive: one step from a place to another world's place | PASS | PASS |
| T2 two rapid steps from a surface (Back pending) | **FAIL — document exit 1** | PASS (1 Back, 0 exits, newest wins) |
| T3 stale ascend continuation vs newer same-world step | **FAIL — ends on older b/b1/e1** | PASS (a/a2/e2) |
| T4 tour Stop supersedes in-flight step | **FAIL — older place built** | PASS |
| T5 two rapid steps from inside a place | PASS | PASS |

Parent 2/5 (exit 1), fix 5/5 (exit 0). Prior regressions at 469a83c: dwr-probe, dwr-transition-probe,
dwr-history-probe-d902c8a all exit 0.

## Suite at 469a83c
`pnpm format` (no further changes) and `pnpm check`: build, **125/125** unit tests, check:dist 175 files OK.
`pnpm test:pages` (CHROME_PATH=/opt/pw-browsers/chromium-1243/chrome-linux64/chrome): **12 pages × 2 viewports** pass.

## Rendered check — inconclusive (not acceptance)
`dwt-browser-check.cjs` (output: dwt-browser-output-469a83c.txt): parent and fix `public/` served side by side,
Dune book 1, tour started and Next pressed with **real Playwright mouse clicks** (`page.click`), 1440×900, SwiftShader.
All four runs (2 parent, 2 fix): 0 document exits, 0 mismatched world/site hashes, 0 page errors — but real clicks
timed out at step 0–1 in every run (the SwiftShader main thread is busy for long periods), so the negative control did
**not** reproduce on the parent and the run does not exercise the race. No browser acceptance is claimed; the VM T2–T4
cases are the sensitive tests.

## DWO-E1 — evidence correction
The aea2347 return's "15/15" is corrected to **14/14** (the script has fourteen unconditional checks), and its
"real UI clicks" are relabelled **simulated DOM `.click()`/API calls** — appended as a correction note in
fix-return-aea2347.md; the original text and logs are preserved, not rewritten.

## DWO-E2 — still open (environment)
e70/e102 at/below-book, direct-place-link, tour, Back/history and 390×844 rendered checks were **not completed** this
run. In this environment each SwiftShader place transition takes ~2 min and real clicks time out (above), so a run with
meaningful assertions does not fit a bounded unit. Proposed: carry DWO-E2 as a Known gap for a hardware-GL or
physical-device check (Mckay's own spot check before release), rather than further SwiftShader runs. The weak
predicates in dune-omit-browser-check.cjs are not relied on for anything.

Not merged. No canon, full technical or release approval implied.
