# LDS screenshot-retry delta review

2026-10-31. Exact implementation **`f877f76f295fc09bd80b28d455ce59a093f31271`**, PR33; reviewed parent **`dcc793c6036f9dc26ec4286d8c132c272638fd40`**. Prior content review: `remediation-review-r2.md` at **`846cf78e85927df7bd056748b41d88e1cc36d1f4`**. Latest inspected main handoff at start: **`1d3f81039bf51414d0f3bb1d85dea90eb245b45f`**, with Claude's CI-fix lock preserved.

**Bounded verdict:** no source-level defect found in the retry control flow. This is a test-harness change only, not supplementary completion or release acceptance. The prior 169-ID / 170-card content conformity carries forward by exact application-file equality. Exact-head CI must reach its own terminal result; that result is recorded separately in the publication handoff/final response and must not be inferred from these probes.

## Actual delta and regression boundary

Git comparison shows exactly **one changed file**, `tests/standalone-pages.mjs`, with 16 inserted and two removed lines. `public/`, `src/`, the pack, engine helpers, LDS tests and layer tests are unchanged. No content, source URL, coordinate, gate, date, route, event, supplementary mapping or keyboard behavior changed in this commit.

The wrapper calls the same `tab.screenshot({path})` with the same destination. It retries errors whose **message contains `Unable to capture screenshot`**. This is message matching, not a typed check of an error class or proof of compositor cause. It permits four total attempts, with three 3,000 ms waits: at most nine seconds of explicit added waiting, excluding the screenshot calls' own duration. Persistent matching errors and all other errors still reach the existing failure collector. Screenshot requests remain conditional on `SCREENSHOTS`, as before; page assertions, fallback-page coverage, overflow tests and the suite's nonzero failure exit remain.

Claude's commit reports local reproduction after the Earth-start page under constrained SwiftShader and attributes the problem to the shared GPU process. This reviewer did not reproduce that causal diagnosis with a browser. The prior CI log showed actual capture errors for `?pack=nope`, not a proved failure of LDS content or fallback navigation. A successful retry run can demonstrate suite recovery on that runner; it does not independently establish the physical cause or full rendering correctness.

## Reproducible checks

[probe.cjs](remediation-ci-fix/probe.cjs) pins the exact Git head, verifies the one-file delta and unchanged application bytes, then extracts the actual new function. Mock page methods record calls and waits; no browser, server, real timeout or alternative preview surface is used.

| Case | Observed attempts / waits | Result |
|---|---|---|
| First capture succeeds | 1 / 0 | Original result returned |
| One matching error, then success | 2 / 1 | Same path retried; result returned |
| Three matching errors, then success | 4 / 3 | Result returned on final permitted attempt |
| Four matching errors | 4 / 3 | Exact fourth error propagated |
| Different error immediately | 1 / 0 | Exact error propagated without retry |
| Matching error, then different error | 2 / 1 | Different error propagated immediately |

All **six** cases pass; [saved result](remediation-ci-fix/probe-result.json) includes the extracted-function SHA-256 and exact counts. `node --test tests/lds-pack.test.ts tests/atlas-layers.test.ts` at this head passes **22 / 22**, recorded in [targeted-tests.txt](remediation-ci-fix/targeted-tests.txt). All **13** specification/accounting validators pass; the original 96-object hash validator correctly targets its historical `c59c9bc` baseline rather than pretending those hashes describe the new build.

This is independent verification of control flow and data equality, not another 169-record source reading or a rendered acceptance test. No application or test code was edited by ChatGPT.

## CI and evidence handoff

Exact-head implementation run: [41254005800](https://github.com/mckayec/universe-sandbox/actions/runs/41254005800). This succeeds the failed parent run [41249428162](https://github.com/mckayec/universe-sandbox/actions/runs/41249428162), whose two errors were `Page.captureScreenshot: Unable to capture screenshot` for the invalid-pack fallback at desktop and mobile. Follow the new run to terminal; preserve the old failure as history. No blind rerun, disabled assertion or claim of success from a running status is authorized by this review.

The PR body and coarse main status still describe older build/question states; current review/receipt SHAs take precedence. The latest round-2 builder receipt remains `remediation-round2.md` at `fd8320936e75a26c16273156a7c27733add42df0`. At review start no newer technical receipt was published beyond this test commit and active lock. Later receipts should be evaluated on their stated SHA, not silently applied backward.

## Gates that remain

- **Supplementary content:** no new import or `supplementary-implementation.csv` in this delta. SC01–54's 1,271 overlapping source declarations and prose constraints still require actual implementation mapping and exact-head copy/gate review. SC55–62 retain only their previously authorized dense-display deferral. Existing primary overlap is neither proof of wholesale absence nor proof of completed supplementary import.
- **Rendered/keyboard:** this commit supplies no new rendered or keyboard evidence. Round-2 screenshots retain their earlier limitations (five predate the CSS wrap fix). Keyboard-only codex navigation was not re-exercised in that receipt.
- **Real GPU / technical:** real-GPU evidence was unavailable in Claude's environment; final same-head technical sign-off remains open. Passing source tests or CI does not replace these gates.
- **Owner release:** separate and unchanged. No PR approval, merge, deployment or release is granted.

Claude can continue the already-authorized supplementary work without merging this review. Resolve any remaining exact-head CI failure first; if CI succeeds, retain its result as a narrow technical checkpoint, then return the supplementary implementation and mapping for ChatGPT's content delta review. Preserve the existing source uncertainties and corrected J03/PJ02 separation. No further broad research is required to disposition this test-only change.
