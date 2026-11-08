# Deep worlds — DWT-02-R diagnosis at PR37 311e9fe (rendered, builder-run)

- Builder: Claude, 2026-11-08T13:47–14:22Z. Exact head `311e9fefa4bad16dff40e909d57f0b450532b216` (atlas/deep-worlds), `pnpm build` served by `vite preview`, Playwright Chromium + SwiftShader, 1440×900, Cosmere book 10 tour e47 Bilming → e48 Elendel, trusted `page.mouse` input. Builder-run, not independent. **No application edit.**
- Harness: [dwt02-rendered-probe-v2.cjs](dwt02-rendered-probe-v2.cjs) (v1 kept unchanged). Output: [dwt02-rendered-v2-output-311e9fe-1440.txt](dwt02-rendered-v2-output-311e9fe-1440.txt).

## Finding: DWT-02-R is a harness sampling artefact, not an app defect

v1 judged R2x from one snapshot at a fixed +3.5 s after the presses. After the place commits, `enterPlace` runs the
event continuation (`evInPlace`, which sets `S.ev`) on a 500 ms timer; under SwiftShader timers are starved by
seconds. v2 logs every `S.ev` assignment with an in-page timestamp (a getter/setter on `__atlas.S.ev`, value only).

Qualified case R3x (three trusted Next presses at +0/+18/+32 ms; the in-page click record shows Bilming still the
rendered place at each repeat, so all are pre-commit):

| Time from first press | Observation |
| --- | --- |
| +1 ms | `S.ev` → null (entry starts; expected) |
| +4581 ms | single place build: Elendel |
| +6367 ms | fade off |
| +9210 ms | first rendered-arrival snapshot: rendered Elendel, `ev=null` — the state v1 sampled |
| +11516 ms | `S.ev` → e48 (the starved continuation runs) |
| end | PASS: arrives exactly once at Elendel with e48; URL `site=elendel`; history length unchanged (3 → 3, same as R6b single Next) |

No assignment ever sets `S.ev` back to null after e48; the null was the pre-continuation window. R1 ("latest
event selected") holds at rendered scope for this case.

Also this run: R6 (Next, Next, Stop at +0/+15/+27 ms, pre-commit) PASS — Bilming restored with state, render, URL
incl. `lm=shaw`, history and ev e47, nothing built; R6b fresh retry PASS. Page errors: none in any case.

## Harness changes in v2 (why earlier runs were unreliable)

1. Pass/fail waits for the end state (bounded 30 s + 20 s, then a 2 s settle and re-read) instead of a fixed 3.5 s.
2. Repeated presses are sent back to back from coordinates read once; pre-commit is decided in-page from the
   rendered place recorded at each click (v1 read state between presses, which could take ~6 s under SwiftShader,
   so a "repeat" could land after commit while the check still passed).
3. Tour start is retried if the first press lands during the splash; Pause is confirmed by its label and retried.
4. Interval/evaluate loops replace `waitForFunction` (never resolves under SwiftShader here).

## Limits / not done

- C0 and R2x failed to **prime** this run (tour already on step 2/2 when sampled), so their rows and the
  history-delta rows (which compare against C0) are harness failures, not results. Remaining cause: Pause can
  register after the tour has already advanced; next step is to prime via the URL/state instead of the live tour.
- Parent 117ecba pair, 390×844, Dune book-3 pair, the 90-case DWO-E2 matrix and `test:browser` not rerun.

## Checkpoint 2026-11-08T15:17Z — harness v2.1 (converging prime), head vs parent at 1440×900, Cosmere b10

Builder-run (Claude), `pnpm build` + `vite preview`, Playwright Chromium + SwiftShader, trusted `page.mouse` input. **No application edit.**

Harness change (same file, [dwt02-rendered-probe-v2.cjs](dwt02-rendered-probe-v2.cjs), now v2.1):
`prime()` is a state loop that reads the tour box each pass and issues one corrective trusted press (Tour / Pause /
Prev / Next) until the tour is on, paused (label "Play") and on the target step, then waits for the rendered place.
This removes the C0/R2x race (the 10–21 s auto-advance firing before Pause registered). R6 now reads Next/Stop
coordinates once and presses back to back, and pre-commit is judged from the in-page click record.

| Run | Output | Result |
| --- | --- | --- |
| head 311e9fe, first v2.1 pass (R6 still had separate coordinate reads) | [v21pre](dwt02-rendered-v21pre-output-311e9fe-1440-cosmere.txt) | 17/19: priming fixed (C0, R2x, R3x pass; "tour on step 2, pressing Prev" logged); R6 Stop landed post-commit (+11 s) so its case was not exercised — harness, fixed below |
| head 311e9fe, v2.1 final | [v21](dwt02-rendered-v21-output-311e9fe-1440-cosmere.txt) | **ALL PASS 19**: C0; R2x and R3x arrive exactly once at Elendel/e48 (S.ev null → e48 only), history delta 0 = control; R6 Next,Next,Stop pre-commit restores Bilming (state, render, URL incl. `lm=shaw`, history, e47, nothing built); R6b retry arrives; no page errors |
| parent 117ecba, v2.1 (timed out at 590 s during R6) | [partial](dwt02-rendered-v21-output-117ecba-1440-cosmere-partial.txt) | C0 PASS; **R2x and R3x FAIL** on the parent: S.ev e48 then back to e47, ends rendered Bilming with the tour showing 2/2 and no build — the DWT-02 defect reproduced in the rendered UI. R6/R6b not reached |

So the rendered harness now discriminates: the parent shows the DWT-02 defect, the head does not, with the same
priming and input. This is builder evidence for one pair at one viewport.

Still not run: 390×844 (both commits), Dune book-3 pair (both commits), parent R6/R6b, the 90-case DWO-E2 matrix,
`pnpm test:browser`. Runs take ~9 min per commit×viewport×pair on 2 CPUs; continue next run.

## Checkpoint 2026-11-08T16:20Z — head 390×844 Cosmere pass; Dune book-3 prime leaves a stable split state (DWT-03 candidate)

Builder-run (Claude), same build/preview/Chromium setup, head 311e9fe only. **No application edit.**

| Run | Output | Result |
| --- | --- | --- |
| head 311e9fe, v2.1, 390×844 Cosmere b10 | [390 cosmere](dwt02-rendered-v21-output-311e9fe-390-cosmere.txt) | **ALL PASS 19** (C0, R2x, R3x exactly once at Elendel/e48, history delta 0; R6 Next,Next,Stop pre-commit restores Bilming incl. `lm=shaw`, nothing built; R6b retry arrives; no page errors) |
| head 311e9fe, v2.1, 1440×900 Dune b3 | [1440 dune](dwt02-rendered-v21-output-311e9fe-1440-dune.txt) | **C0 prime FAIL, then harness timeout (590 s)**. After the prime loop's rapid trusted Tour/Pause/Next presses, the page held for 60 s: tour `12 / 13` paused, `S.site=tabr` and hash `site=tabr&view=place`, but the rendered place is **fane** and `S.ev=null` (builds arrakeen,fane,tabr,tabr,fane). No page errors. |
| head 311e9fe, directed repro [dwt03-dune-prime-repro.cjs](dwt03-dune-prime-repro.cjs), 1440, gap 0 | [g0](dwt03-repro-output-311e9fe-1440-g0.txt) | Not reproduced: settles consistent at fane/c6 step 12 |
| same, gap 400 / 900 ms | [g400](dwt03-repro-output-311e9fe-1440-g400-incomplete.txt), [g900](dwt03-repro-output-311e9fe-1440-g900-incomplete.txt) | Incomplete (killed at the 10-min shell bound; the auto-advance timer also stepped the tour once in g400). No split state seen in the steps logged |

**DWT-03 (candidate, not yet confirmed):** after rapid tour Next presses across different sites/worlds on a slow
renderer, state and URL can name one site (tabr) while the rendered place is another (fane) and no event is set,
stable for ≥60 s. This is the different-destination analogue of DWT-02 (DWT-02's fix covers only the identical
repeat). Observed once in 1 of 4 attempts; the exact press timing of the failing run was not logged (prime only
logs Prev corrections). Not dismissed as harness: a settled split state is user-visible if real.

Next: re-run the v2.1 Dune prime with a per-press state log (and the directed repro with smaller gaps, 100–300 ms,
one run per shell call) on head, then on parent 117ecba to tell whether it predates the DWT-02 fix. If confirmed,
it becomes a fix item on the PR branch; if it cannot be reproduced in a bounded set (e.g. 10 runs), record it as a
Known gap with the one observation. Still not run: 390 Dune pair, 390 parent Cosmere, parent R6/R6b, the 90-case
DWO-E2 matrix, `pnpm test:browser`.
