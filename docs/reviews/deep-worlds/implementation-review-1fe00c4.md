# DWT-01a/b independent review — 1fe00c4

Reviewed 2026-11-08 UTC. PR37 `atlas/deep-worlds`, exact head **1fe00c42d4d44c61544a68223e2d47ad40704d70**, parent **469a83c4c13f10aa9e280cd472d54274a014642b**. Current PR head independently read and matched. Inputs: [prior review](implementation-review-469a83c.md), [builder return](fix-return-1fe00c4.md), builder probe and terminal output, and actual engine source.

## Verdict

**DWT-01b closed within the tested source/VM scope. DWT-01a substantially corrected, with one remaining cancellation-state finding DWT-01c. Return fixing / claude.** No new canon acceptance, full technical approval or release approval.

Inspected **1/1 changed files** and full diff: engine.js only, +20/-14. Local engine bytes match Git blob **591a806fe19715177d7c5138ac5beb1a2d62a8ac**. No pack or source-content change. Optional ownership checks now reach place construction and queued effects; Back ownership persists until popstate rather than expiring after two seconds.

## Independent results

| Check | Head | Parent / qualification |
|---|---|---|
| Committed dwt01ab-probe.cjs | **14/14** | **8/14** at 469a83c; T6/T7/T8/T12/T13/T14 fail as reported |
| Prior independent chronological probe | **8/8** | Prior 5/8 baseline preserved in previous review |
| [New extension](dwt-review-probe-1fe00c4.cjs), adds existing-place cancellation and positive switch | **15/16** | **9/16** at 469a83c |
| DWR lifecycle probe | **22/22** | Prior closures retained within tested scope |
| Actual-transition probe | **11/11 assertions, 7 scenarios** | Prior closures retained |
| History ownership probe | **3/3 scenarios** | Newer entry marker remains protected |

Commands: `node dwt01ab-probe.cjs <head-or-parent-root>`, `node dwt-review-probe-469a83c.cjs <head-root>`, `node dwt-review-probe-1fe00c4.cjs <head-or-parent-root>`, and the existing dwr lifecycle/transition/history probes. Each runs actual source slices with mocked renderer/DOM/history; chronological probes use fake timers and asynchronous traversal. **These are not rendered browser results.**

T9 verifies fresh travel after Stop, T10 a manual entry unaffected by Stop, T11/T12/T14 normal completion and newest-destination history after 3- and 8-second traversal. Thus the explicit pending flag fixes the wall-clock-expiry issue in those cases. The five-second warning does not unlock traversal. Dropped popstate holding travel and bfcache restoration remain unverified browser limitations, not newly reproduced failures.

## DWT-01c — Medium: cancellation while already inside a place leaves destination state behind

Location: `enterPlace` pre-transition state/history writes and `cancelEntry` early return `if(S.view==="place")return`.

**T15:** begin inside a/a1 with a valid place history entry; request event e2 at a/a2 on the same world; advance 100 ms; Stop; drain timers.

Exact head observation:

```json
{"entered":[],"state":{"view":"place","sel":"a","site":"a2","ev":null,"lm":null},"history":{"st":{"atlasSurface":true,"atlasPlace":true,"atlasEntry":1},"hash":"#world=a&site=a2&view=place"}}
```

No new place is constructed, so the existing a1 scene remains, but state and URL name a2. The source explains this: entry assigns S.site and replaces the current place history before the fade; ownership rejection calls cancelEntry, which returns immediately because S.view was already place. This is a source/VM state-consistency finding; actual displayed pixels were not inspected.

The parent also fails T15, but differently: it builds a2 after Stop. The new guard prevents construction yet exposes the missing rollback. **T16 positive uninterrupted a1→a2 passes on both**, constructing a2, selecting e2 and writing the correct final history.

Required bounded correction: when this owned entry is cancelled, reconcile state and history with the place still rendered, or complete an explicitly consistent cancellation destination. Protect newer navigation/history ownership; do not blindly restore an old snapshot over a later request. Include T15 as a failing-parent/passing-fix regression, retain T16, and cover cancellation superseded by a newer entry. Preserve manual entry and fresh travel after Stop. No unrelated navigation redesign requested.

## Validation limits

Fresh Playwright launch with installed `/usr/bin/chromium` failed before page creation:
`FATAL:chrome/browser/process_singleton_posix.cc:297 ... socket() failed: Operation not permitted (1)`.
**Zero independent rendered scenarios executed.** Full 125/125 suite, 24/24 page rerun and simulator smoke remain builder-attributed. The builder explicitly preserves its first page-run abort; the successful rerun does not erase that intermittent failure.

**DWO-E2 remains pending**, not waived: e70/e102 at/below book, direct place links, tour, meaningful Back/history, 390×844, stale conservatory restoration and residency positive control. The new return supplies no completed rendered tour/Back evidence. DWO-E1's prior disclosure closure stands.

## Handoff and checkpoint

Claude: fix DWT-01c and return the exact head plus regression evidence, keeping DWT-01b closed unless new evidence contradicts it. Carry DWO-E2 as an explicit validation gate and report the exact environment limitation if it cannot run.

All three Dune omissions, 18 accepted leaf changes, three scoped retains, eight source holds and 139 unselected records retain their dispositions. Broader sampling, Society, geometry, Save/Load, device/AT, full technical and owner-release gates remain open. No source facts researched or newly certified this run.

Run inventory: **25/25 status files inspected**; this was the only ChatGPT-owned handoff. Hierarchy, Licanius and Narnia research/source/review/audit/addendum blobs (**15/15**) are unchanged from the prior run's main c6c34422099fb6a54792f0a7ed6ac4461f3526a0; their existing self-audit limitations are not relabeled complete. No Claude-owned status/history or agreement was changed.
