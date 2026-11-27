# DWT-01 independent return review — 469a83c

Reviewed 2026-11-08. PR37 `atlas/deep-worlds`, exact head **469a83c4c13f10aa9e280cd472d54274a014642b**, parent **aea2347489172e38bb8502aaa65c90af77cda049**. PR head read and matched. Inputs: [prior requirements](implementation-review-aea2347.md), [builder return](fix-return-469a83c.md), committed VM/browser probes and logs, and the appended DWO-E1 correction.

## Verdict

**Partial DWT-01 fix accepted; return fixing/claude for two residual ownership groups.** The original five scenarios now pass, including the parent double-Back/document-exit model and stale ascend continuation. Stop does not yet invalidate pending place construction/effects, and the Back guard expires while traversal can still be pending. These are source/VM findings, not independently reproduced browser failures.

Inspected **1/1 changed files** and its entire diff (engine.js only, +33/-16). No pack/canon changes. Verified local Git blob hashes for **4/4 inputs**: head engine `d7b6e12d0908237f2a1ff1c98879b9f1c098029f`, parent engine `5e26507a4b0e972ea065e0ebd2c6dd3838ac8799`, head society `59c3eb5237161eaa6784b18e46ebc4bf3e5555e9`, and Hyperion fixture `982f0babb6a53929d5c7d4905c52f3cd84d6fe5d`. An extra local staging newline was removed to match the head blob before the final regression run; no repository source was edited.

## Independent regression evidence

Commands use local exact-head/parent source copies; renderer, DOM, history and timing are mocked.

- Builder `dwt-tour-probe.cjs`: **5/5 head**, **2/5 parent**, with parent T2/T3/T4 failing as claimed.
- [Independent chronological-timer extension](dwt-review-probe-469a83c.cjs): **5/8 head**, **2/8 parent**. Original T1–T5 retain the same pass/fail results when timers execute by due time, rather than FIFO insertion order.
- Prior lifecycle probe: **22/22 checks**; actual-transition probe: **11/11 assertions across 7 scenarios**; history ownership probe: **3/3 scenarios**. Existing DWR-A/B and DWH-01 closures are retained within those tested scopes.

| Added case | Head result | Parent result | Exact observation |
|---|---|---|---|
| T6: same-world event entry, advance 100 ms, Stop, finish fade | FAIL | FAIL | `a/a1` still constructed after Stop; expected no construction. |
| T7: event in current place queues effect, advance 100 ms, Stop | FAIL | FAIL | `burst` still plays after Stop; expected no playback. |
| T8: Back traversal takes 3000 ms, newer request at 2100 ms | FAIL | FAIL | **2 Back calls**, expected 1 while the first traversal is outstanding. This run did **not** establish a document exit. |

The new cases are inherited residuals, not claims that this patch introduced them. The prior handoff explicitly required ownership through place entry, effects and Stop.

## Required finite correction

**DWT-01a — Stop ownership, Medium.** `tourStop` increments `evNav` and clears `navNext`, but `enterPlace` and `evInPlace` guard delayed work with `placeGen`. A Stop after entry starts but before its 430 ms transition still builds the place; a Stop after an effect is scheduled still permits playback. Make cancellation reach those pending operations, reconcile any place history marker, and stop existing effects as appropriate. Preserve successful navigation and fresh replay. Return T6/T7 failing on this unchanged parent and passing on the correction, plus a positive fresh-navigation case.

**DWT-01b — Pending traversal ownership, Medium.** `navIdle` and `goBack` use a two-second wall-clock window as the Back lock. After that window, another request can call Back before the first popstate. Use explicit outstanding-traversal ownership or an equivalent proven mechanism; a recovery timeout must not silently permit a second unresolved traversal. Test delayed delivery beyond two seconds and ordinary completion, including newest destination and actual final history state. T8 is a deterministic timing model; browser latency frequency and document-exit consequences are not certified.

## Evidence corrections and rendered gap

**DWO-E1 closed within disclosure scope.** The appended correction in `fix-return-aea2347.md` fixes 15/15 to **14/14**, labels DOM/API activations as simulated, preserves the **6 PASS / 2 FAIL plus exception** evidence and qualifies uncorroborated narrative outcomes and weak Back predicates.

**DWO-E2 remains an unresolved validation gap.** It may be tracked as a Known gap for hardware/device validation, but is not waived, passed, or converted into release approval. Required return still covers e70/e102 at/below book, direct-place restoration, tour, meaningful Back state, 390×844, stale conservatory restoration and valid residency positive control. Preserve exact tested SHA, input method, expected states, terminal results and incomplete cases.

Inspected the new real-click browser script and **4/4 logged attempts** (two parent, two head). All terminate the Next loop on step 0 or 1 timeout; the parent negative control does not reproduce the claimed browser defect. The log's final tour label and location also do not establish completed travel. The script only logs these observations; it has no pass/fail assertion for destination agreement. Therefore **0/4 attempts qualify a complete browser regression**.

A fresh local Playwright launch using `/usr/bin/chromium` failed before page creation: `FATAL:chrome/browser/process_singleton_posix.cc:297 ... socket() failed: Operation not permitted (1)`. No independent rendered case executed. Builder's **125/125** suite and **12×2** page checks remain builder-attributed; not rerun or certified here.

## Handoff / retained limits

Return **fixing / claude** for DWT-01a/b and focused regression evidence. Preserve DWO-E2 as an explicit pending validation gate; do not repeatedly claim unavailable rendered checks. The three Dune omissions, 18 accepted leaf changes, three scoped retains, eight deferred source holds and 139 unselected records retain their prior dispositions. No new source claims researched or canon records accepted in this run. Broader sampling, Society, geometry, Save/Load, device/AT, full technical and Mckay's release gates remain open. No merge, deploy or owner approval.
