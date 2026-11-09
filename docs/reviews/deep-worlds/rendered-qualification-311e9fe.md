# Deep worlds — DWT-02 rendered qualification checkpoint at PR37 311e9fe

- Builder: Claude, 2026-11-08T12:47–13:40Z. Exact head `311e9fefa4bad16dff40e909d57f0b450532b216`, parent `117ecbaadfe9a06fb24d8be79fb7262d71486c54` (atlas/deep-worlds). Builder-run, not independent. No application edit, no merge.
- Environment: `pnpm build` of each revision served by `vite preview` (head :4173, parent :4174); Playwright Chromium 1243, SwiftShader WebGL, 1440×900.
- Harness: [dwt02-rendered-probe.cjs](dwt02-rendered-probe.cjs). Outputs: [head](dwt02-rendered-output-311e9fe-1440.txt), [parent](dwt02-rendered-output-117ecba-1440.txt).

## How the real UI produces the identical pending request

`goEvent` is reached only through the tour (`tourStep`, plus `navKick`). `tourStep` clamps at the ends, so pressing **Next on the last step re-issues `goEvent` for the same event**. Cosmere book 10 has a two-step tour, e47 (Scadrial/Bilming) → e48 (Scadrial/Elendel): same world, different enterable sites. From e47 rendered in place, Next → e48 pending; Next again before the fade commits = the DWT-02 repeat. Input is trusted pointer input (`page.mouse.click` at each control's centre; `isTrusted` recorded true). `page.click` was unusable: its actionability wait never resolves under SwiftShader with the render loop running. Pre-commit is decided from in-page timestamps (capture-phase click times, `#fade` class toggles, and a wrapper recording each `PLACES.enter` build time), not wall clock.

## Results (head 311e9fe, 1440×900, cosmere-b10)

| Case | Result | Timing evidence |
| --- | --- | --- |
| R2x: Next, Next (15 ms apart), both before commit | **FAIL — arrives once at Elendel (state, render, URL, history unchanged length) but `S.ev` is `null`, not e48.** Also seen in the first solo head run at ~12:55Z (clicks +0/+2415 ms, still pre-commit; that log was overwritten by a later invalid parallel run, so only the 13:22Z log is saved). | clicks +0/+15 ms; first fade on +1 ms; single Elendel build at +4274 ms (fade timers starved under SwiftShader) |
| R6: Next, Next, Stop before commit | PASS — Bilming restored (state, render, URL incl. `lm=shaw`, history length, ev e47), nothing built | clicks +0/+1551/+1567 ms; no build |
| R6b: fresh retry after Stop | PASS — arrives at Elendel with e48 | — |
| R3x: triple Next | Not qualified — the harness's own state reads stalled ~10 s, so repeats 2–3 landed after commit (positive arrival with e48, but not a pending-repeat test) | build +4098 ms, repeats +10408/+10418 ms |
| C0 single-Next control | PASS in the first (interrupted) head run and in the parent run; FAIL to prime in the final head run (tour advanced past step 1 before Pause registered — harness race, not app) | — |
| Page errors | none in any case | — |

**New rendered finding DWT-02-R (head):** the VM probe's R1 "latest event selected" does not hold in the real browser. Two identical pre-commit tour requests land on the right place, but the event selection is dropped (`ev=null`, dossier shows no event). The VM fixture mocks `PLACES.landmarks`/presentation and uses a synchronous build, which is the likely gap; not yet diagnosed in code. R1 is therefore **not closed at rendered scope**.

**Parent comparison:** C0 control passes on parent; the parent run then hit a harness race (`#tourBox` Pause not yet laid out) before R2x. No paired parent R2x/R6 rendered result yet.

## Not done this checkpoint (precise limits)

- Paired parent R2x/R6, 390×844 viewport and the Dune book-3 destination pair (fane → keep) not run.
- 90-case DWO-E2 matrix not rerun at 311e9fe: an attempt in parallel with two probe browsers starved SwiftShader and timed out (invalid, discarded). It must run alone (~30 min).
- `test:browser` not rerun. Priming robustness (wait for `#tourBox` layout before Pause; read coordinates and click without intervening state reads) to fix in the harness.

## Next step (Claude, next run)

1. Diagnose and fix DWT-02-R on the PR branch (why `S.ev` ends null after a repeated in-place entry in the rendered app), with a regression check in the VM probe that reproduces it.
2. Harden priming; rerun the rendered probe alone, head and parent, 1440 and 390, both destination pairs.
3. Run the 90-case matrix alone at the new head; then hand to ChatGPT.
