# Kids per-pointer correction review — 20837c0

ChatGPT, 2026-11-10 UTC. PR #47, `sim/clarity-physics`, exact audited head **20837c0211575d03ed0ad3ff3c34fcb98adeb653**; parent **a50f1aa58ce6e26756a5b0e2b4510c8079a81532**.

**SC6-K3 closed for the bounded interaction scope. Kids 6b accepted; hand item 7 (catalog/units) to Claude.** This is implementation acceptance, not final technical or release approval. SC6-K1/K2, 6a and the bounded SC6-O1 disposition from the preceding review stand.

## Correction and independent checks

Read **4/4 incremental patches** and all four changed source/test files. The capture listeners now retain each pointer's press origin, transfer that origin on release, and consume the matching released authorization when its dialog click arrives. Opening the dialog and its Stay/Leave handlers reset the records. Unrelated contacts no longer authorize or suppress a click with a different pointer identity. Keyboard/assistive detail-zero activation remains allowed.

Independently executed the committed [actual-handler runner](builder-kids-k3.mjs), after reading its extraction and DOM adapters: **18/18 pass**, including both grant/revoke interleavings with and without a recorded pointerup, cancel, reused identity, reset on reopen, pointer-less fallback, repeated post-release click, and the five held-placement controls. This is an independent execution of a builder-adapted runner, not a second independently authored suite. [Reviewer output and input manifest](reviewer-kids-output-20837c0.json).

Independent focused repository tests: **20/20 pass** (9 cancellation/authorization, 5 Kids, 6 overlay-budget). **15/15 local input blob hashes match the exact-head GitHub tree**, including carried dependencies. No local application source was modified for these checks.

Opened [W3C Pointer Events Level 3 §4.2.12.1](https://www.w3.org/TR/pointerevents3/#event-attributes) in this run. Matching a pointing-device click to its own pointer identity is the appropriate contract. The identity-less fallback is covered by helper/handler tests only; actual WebKit compatibility is not demonstrated.

## Rendered evidence and CI

Read the complete [6e harness](evidence-harness-6e.mjs) and both raw logs, rather than relying on the return summary.

- Head: **72/72 recorded enforced checks** across **20/20 cases** at 390×844 and 844×390; no recorded console/page errors.
- In both mixed-grant traces, a touch begins on the canvas, a mouse presses the dialog copy, and the browser emits the held touch's click on Leave. The click is observed at window capture but does not reach document capture; Kids remains on.
- In both mixed-revoke traces, a mouse begins on Stay, another touch begins on canvas, and the mouse click reaches Stay and closes the dialog while retaining Kids.
- Parent negative control: **10/28 checks fail**, specifically the two mixed-pointer failures at both viewports. The single-pointer held-release control passes at parent, as expected.
- The three touch-only multi-contact cases at each viewport emit no relevant click. Their **6/20 case outcomes are vacuous for authorization**, not proof that the gate rejected a generated click. The nonvacuous mixed-pointer traces and actual-handler tests provide the targeted evidence.
- These remain **builder-produced Chromium/SwiftShader traces**, independently inspected and counted. No new screenshot inspection is claimed; this correction changes event authorization, not layout.
- CI run **42804350399**, build job **129789584287** logs independently verify **204/204 units, 113/113 dist files, 24/24 standalone-page cases**, formatting/build success. The previously missing local page rerun therefore has CI evidence. CI checked merge **96324cb57c631fd21595444537cf239f2110112b**; **238/238 non-doc head files match** that tree. Deploy was skipped.

Fresh reviewer Chromium attempts could not create a page: the default bundled executable is absent; installed `/usr/bin/chromium` aborts at `process_singleton_posix.cc:297`, `socket() failed: Operation not permitted`. **0 independent rendered cases.** No physical device, real GPU, screen reader or full Save→Clear→Load smoke pass is claimed.

## Nonblocking observation

| ID | Severity | Location | Finding / evidence | Next action |
|---|---|---|---|---|
| SC6-O2 | Low | `src/ui/kids.ts:35–58`, `src/kids-mode.ts:104–138` | Press/release tracking runs even outside Kids/the dialog, while click consumption only runs for Kids-dialog clicks. A deterministic helper sequence of 1,000 distinct outside-dialog pointer IDs leaves 1,000 released entries (0 down); a dialog reset clears all. This establishes retention by event count, not a measured memory or performance regression. The normal click-on-release contract closes K3; the synthetic no-pointerup fallback should not be described as consuming its still-down record. | While continuing item 7, bound or clean up irrelevant/completed records without weakening held-pointer identity, keyboard activation or dialog reset behavior. Include a finite retention test; do not reopen unchanged layout/placement work. |

## Handoff and limits

Set `implementation / claude`: continue the bounded item-7 catalog/units slice, carrying SC6-O2 as a small cleanup and the established SC1-E1/SC4-E1, Save/Load, device/accessibility and release gaps. There is no new Medium/High correction blocking that continuation. Return exact-head code, validation and evidence for item 7.

Inspected **18/18 pack statuses and 8/8 review statuses** on main. The Hierarchy, Narnia and Licanius folders are byte-unchanged from the prior completed run; no stale parallel self-audit was found. No site code/PR branch edit, merge, deployment, canon certification or approval on Mckay's behalf.
