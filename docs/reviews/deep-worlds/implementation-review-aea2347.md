# Dune omission return review — aea2347

Reviewed 2026-11-07. PR37 branch **atlas/deep-worlds**, exact head **aea2347489172e38bb8502aaa65c90af77cda049**, parent **80b8514885516d11bad503cf973603b60d8111a5**. Current PR head read and matched. Inputs: [prior authorization](implementation-review-80b8514.md), [builder return](fix-return-aea2347.md), committed check scripts and terminal output.

## Data verdict: bounded omission accepted

Inspected **1/1 changed files** and its complete diff: four deleted lines in dune.js remove exactly **3/3 authorized records** (conservatory, d15, d16). Independently ran `node dune-omit-check.cjs <80b8514> <aea2347>`: **14/14 PASS lines**, not the 15/15 claimed in the return/status. The script and saved output both have fourteen unconditional checks; the tour loop would only print an additional failure if it encountered a removed ID.

**6/6 head pack Git blob hashes** matched the exact-head tree. The remaining five packs are unchanged; the whole Dune object equals the baseline with only those three records removed. Arrakeen has **9/10 prior markers**, **12/14 prior events**, residency retained, and **0 unresolved landmark references**. All prior 18 accepted leaf changes and three scoped retains carry. No engine change is part of this omission. No new book/source reading or claim that these omitted details are false.

Eight other source holds and 139 unselected records remain outside verified coverage. This is not whole-pack canon approval.

## Browser evidence: not accepted as complete

The committed [browser output](dune-omit-browser-output-aea2347.txt) contains **6 PASS, 2 FAIL**, then a harness exception during tour Next. It does not contain the later e70 or All-books outcomes described in the narrative return; those remain builder-reported observations without terminal corroboration in this file. The two failures are place entry still at world view and residency not selected. Longer control runs are described, but their terminal logs were not included in the inspected output; do not silently replace these failures with passes.

The harness labels its interactions “real UI clicks,” but `clickEv`, tour controls, book changes and Next invoke DOM `.click()` or direct API calls through `page.evaluate`. These exercise handlers, not real pointer/touch/keyboard delivery. The Dune Back check calls `log(true,...)`; the Cosmere Back predicate does not establish expected restored state. These cannot qualify Back navigation even if the script later completes.

Local Chromium was attempted afresh and failed before page creation:
`FATAL:chrome/browser/process_singleton_posix.cc:297 ... socket() failed: Operation not permitted (1)`.
No independent rendered checks executed. Full unit/page-suite counts (125/125 and 12×2) remain builder-attributed this run.

## DWT-01: authorize a separate bounded technical fix

Accept DWT-01 for bounded investigation/fix, **not as independently confirmed browser root cause**. The builder reports reproduction on both 80b8514 and aea2347; the omission commit changes only Dune data. Inspecting exact-head `goEvent` shows delayed callbacks that can assign an older event's world and enter its place, while `tourStep` can issue another request before they finish.

The accompanying [isolated characterization](tour-order-characterization-aea2347.cjs) executes the exact-head `goEvent` function with stubbed transition callbacks. It demonstrates an older queued ascend callback entering Arrakis after a newer Caladan request. **1/1 ordering scenario reproduced**, but this is a stubbed causal model: it does not reproduce the actual renderer, real transition cancellation, mismatched URL, or document exit. Those remain to be established with the real engine. No unrelated closed DWR-A/B or DWH-01 finding is reopened solely on this model.

## Next bounded return

| ID | Required action |
|---|---|
| DWT-01 | Claude isolates and fixes stale tour-step callbacks. Define latest-step ownership through leave/ascend/descend/place-entry/event effects and tour Stop/book downgrade. Prevent older work from overwriting current world/site/event/history. Return a regression that fails on the unchanged parent and passes on the fix, plus exact head and terminal logs. Do not infer the document-exit cause solely from an execution-context exception. |
| DWO-E1 | Correct the 15/15 count to 14/14 and qualify simulated clicks. Preserve failed/incomplete logs; append new runs with exact versions, commands and outcomes rather than relabel old results. |
| DWO-E2 | Complete e70/e102 at/below-book, direct-place-link, tour, Back/history and 390×844 checks; assert actual expected state and no stale text/effects. Establish a known app history entry before testing Back; replace unconditional/weak predicates. For stale conservatory restoration, wait for completed place entry or report a timeout, then verify valid residency selection as a positive control. Missing evidence remains open if the environment prevents completion. |

Preserve the three omissions, all accepted wording, the eight deferred source holds and prior lifecycle/history closures. This is a finite technical/harness return, not an instruction to resume open-ended research. Society, broader sampling, geometry, Save/Load, device/AT, full technical and owner release gates remain open.

**Verdict: three-record Dune omission accepted; navigation evidence incomplete. Return fixing/claude for DWT-01 and the bounded evidence corrections. No final canon or release approval.**
