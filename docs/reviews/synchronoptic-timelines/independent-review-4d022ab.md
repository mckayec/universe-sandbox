# Independent checkpoint 26 review — 4d022ab

2026-11-08 UTC. **TL25-R1 closed within the bounded history-restoration scope. Return to implementation / claude for folded-row connectors.** No final canon, full technical or release approval.

## Target and scope

PR45 `engine/timelines`, exact head **4d022abe9fd2f525395736e041f9547c1479e9ec**, parent **66c80f1f50e44d32bc68c404a4e4addac77e1d57**. PR metadata independently confirmed that head. Inspected the actual parent delta (9/9 changed text files: one engine file and eight documentation/probe/log files), relevant cumulative PR diff, current source, checkpoint26, prior independent-review-66c80f1.md and proposal. This does not re-certify the cumulative 188-file PR.

Read 25/25 pack/review statuses on current main. Sole owned handoff: this review. The 15 research/source/review/audit/addendum files across Hierarchy, Licanius and Narnia are unchanged from main 11daab2c4efc9830fb417a21887a800a9b563225; no stale parallel self-audit. Agreement remains active with both sign-offs; no changes to it.

## Disposition

| ID | Previous severity | Result | Evidence |
|---|---|---|---|
| TL25-R1 | Medium | Closed within scope | Incoming hash captured before chapter refresh; syncURL suppressed during that refresh and timeline restoration; chapter applied before selection gating; captured hash passed to tlFromURL; hold reset in finally and normalized URL written afterward. Independent original probe 5/5 at head vs 2/5 at parent; expanded probe 12/12 vs 4/12. |

The patch addresses the causal ordering failure rather than restoring a selection before its gate. Existing startup handling is unchanged. The transaction covers chapter/timeline state, not a general repair of every atlas navigation subsystem. In particular O-1 layer restoration and world/surface history semantics are not closed here.

## Independent execution

[Full terminal evidence](tl26/reviewer-evidence.md), including expected failing parent controls and fresh browser-launch failure.

- Original reviewer host probe: **5/5 head**, **2/5 parent**. Only the expected engine blob was changed for the head run; hash assertions retained.
- Builder-authored expanded host probe, independently executed unchanged: **12/12 head**, **4/12 parent**. Covers chapter change with open/close/selection, higher/lower/missing/invalid chapter, order/collapse/default reset, and one seven-step simulated traversal counted as one case. Actual host functions are extracted; rendering and view/history transport are test doubles.
- Targeted `atlas-timeline-sw.test.ts`: **12/12** independently pass under Node24.22.1.
- Six local input copies match their GitHub blobs: head engine b6650d6fe7a33fa0d2d8c9b3ac27ea3a883fdedf; parent engine 56d47d017dbf4a13b19a49a0d4a888a39863c819; head/parent model a16d2a10d7ccee44fd15674f745c8617cdfdd65c; test d7ae89d775041f5091155956c6b1050651899b65; expanded probe 12b00f98278cac7ad28b330a46e223f77175b2fb.
- Fresh Playwright Chromium launch failed before page creation at07:13:50 UTC: `process_singleton_posix.cc:297: socket() failed: Operation not permitted (1)`. **0/38 browser cases independently executed.** No rendered, screenshot or real-device pass claimed.

## Builder evidence assessed separately

Read the browser probe and both logs: **38/38 head**, **16/38 parent**, counts independently reconciled. It exercises simulated same-document hash links and browser `goBack/goForward` at1440/390. Intermediate assertions check visible panel state, chapter selector and URL selection/order/collapse fields. They do not independently assert every intermediate detail panel, selected DOM row or rendered lane order. The final Not-set state additionally checks exact record membership, row uniqueness, three fixture exclusions and relationship counts; relationship identities are not compared.

This is useful corroboration of the finite history fix, not an independent rendered pass or comprehensive UI qualification. The status reports the old chapter probe rerun112/112; checkpoint26 reports full check162/162. Those remain builder reports, not suites rerun here. Synthetic chapter gates are fixtures, not canon.

No pack, sidecar or source changed in this delta. **0/12 real pilot relationships promoted or newly substantively accepted.**

## Next bounded unit

Claude may implement the planned folded-row connector unit on PR45. Preserve record/edge gates, source locators and relationship wording, and keep proposed-only sidecar rows unpromoted. Return exact commit/diff plus focused evidence for folded/expanded endpoints and book/chapter/layer downgrades; synthetic positive controls must remain labelled. Keep this history regression in the check set.

Carried limitations: O-1 same-document layer restoration; TL22-E2 real input/focus and1440 click timeout; real close→chapter change→reopen path; mobile1714-row performance; device/AT; chapter gates outside the timeline; PR33 integration; full technical qualification and Mckay release approval. No additional chapter-fix loop requested.
