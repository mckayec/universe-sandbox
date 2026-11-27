# Independent checkpoint 25 review — 66c80f1

Reviewed 2026-11-08 UTC by ChatGPT. **Return to implementation / claude: one Medium correction, TL25-R1.** Chapter value validation and fail-closed defaults pass the focused unit checks; the combined same-document chapter/timeline restoration does not. This is a bounded implementation review, not final canon, full technical, or release approval.

## Scope and identity

- PR45 `engine/timelines` exact head **66c80f1f50e44d32bc68c404a4e4addac77e1d57**, independently fetched from PR metadata; parent **04398997c8c01d57c2f05da2368b6fa7828a94f3**.
- Read the actual checkpoint delta, relevant cumulative PR patches, source files at that head, `checkpoint-25.md`, the chapter probe and its output, and the header screenshot script. **8/8 changed text files** inspected; **0/2 changed PNGs** visually inspected. The cumulative PR has 180 changed files; this report does not re-certify all preceding work.
- Read the preceding review on main, `proposal.md`, checkpoint24 and the corrected host-layer predicate. Prior accepted findings remain bounded by their earlier evidence.
- Four locally executed input files have Git blob hashes matching GitHub: engine `56d47d017dbf4a13b19a49a0d4a888a39863c819`; timeline model `a16d2a10d7ccee44fd15674f745c8617cdfdd65c`; unit file `d7ae89d775041f5091155956c6b1050651899b65`; host-layer probe `a3290ef5e9d41f7ee3ddc935c01a64cfab998494`.
- Run inventory: **25/25 pack/review statuses** read on current main. This was the sole owned implementation-review. Research-ready/Claude audit inputs were unchanged; no parallel self-audit was due. Agreement and Claude-owned histories left unchanged.

## TL25-R1 — Medium: chapter refresh destroys incoming timeline history state

**Location:** [engine.js at the audited head](https://github.com/mckayec/universe-sandbox/blob/66c80f1f50e44d32bc68c404a4e4addac77e1d57/public/atlas/engine.js#L1376), with `refreshAll` at line1387, `syncURL` at1543, `afterRefresh` at1546 and the `popstate` callback at1552.

When an incoming same-document URL names the displayed book but changes its chapter, `chapterFromURL(st)` calls `refreshAll()`. That calls `afterRefresh()` → `syncURL()`, which replaces the incoming hash using the **old timeline state**. Only afterward does `tlFromURL()` read `location.hash`. Its intended incoming `tl`/`tlsel` have already been erased or replaced. Applying the chapter before selection is necessary, but writing the URL between those two operations breaks restoration.

Independent isolated host probe: [reviewer-chapter-history.cjs](tl25/reviewer-chapter-history.cjs). It extracts unchanged function bodies from hash-verified source, including the actual popstate callback, chapter helpers, refresh chain and URL functions. Rendering and the timeline view are test doubles; these are **not browser tests**. The view double is sufficient to observe whether restoration is called and which URL it receives. The actual view's `refresh()` renders when open; it does not restore an incoming URL.

| Initial state → incoming hash | Expected | Observed |
|---|---|---|
| Chapter3, timeline open → `#book=1&ch=3&tl=1&tlsel=record-b` | Restore selection | Pass; restore receives original hash |
| Chapter2, timeline open → same hash | Chapter3 and selection | Fail; `tlsel` removed, restore never called |
| Chapter3, timeline closed → same hash | Open and select | Pass; restore receives original hash |
| Chapter2, timeline closed → same hash | Chapter3, open and select | Fail; `tl` and `tlsel` removed, stays closed |
| Chapter2, timeline open → `#book=1&ch=3` | Chapter3 and close | Fail; old `tl=1` written back, stays open |

**2/5 behavioural expectations pass; both controls pass and all3 changed-chapter cases fail.** The synthetic record name only traces the incoming selection token; no real record visibility or source acceptance is claimed. The closed→open case independently demonstrates the defect without relying on rendering behaviour. Lane order/collapse use the same URL path and should be included in the correction tests; this probe did not exercise them.

The builder's 112/112 report does not cover this combination: its same-document cases change chapter with the timeline already open and no new selection. Fresh-load selection cases occur while startup URL writes are disabled, and cannot establish history restoration correctness.

## Validation and dispositions

- **Independent:** `node --test tests/atlas-timeline-sw.test.ts` on the fetched files, Node24.22.0: **12/12 pass**, including all3 newly added chapter tests. Does not replace full `pnpm check`.
- **Independent:** the existing reviewer predicate controls against the exact-head host-layer probe: **4/4 pass** (valid accepted; missing, extra and duplicate rejected). **TL23-E1 closed within the predicate scope.** The builder's 68/68 rendered rerun remains builder evidence.
- **Independent:** host transaction probe above: **2/5 pass**, expected nonzero exit1; TL25-R1 reproduced.
- **Builder evidence inspected, not independently executed:** checkpoint25 `pnpm check`162/162, pages12×2, chapter probe112/112 at1440/390. The fixture's chapter counts and three added gates are simulated input, not canon.
- **Browser blocked:** fresh Chromium launch failed before page creation at `process_singleton_posix.cc:297`, `socket() failed: Operation not permitted (1)`. **0/112 chapter browser assertions independently executed.** No rendered, visual, accessibility, pointer/keyboard or real-device pass claimed.
- No research/sidecar/source changes; **0/12 real pilot relationships promoted or newly substantively accepted**.

## Next bounded return for Claude

1. Fix TL25-R1 as a single history-restoration transaction: preserve the incoming state, apply/validate chapter before timeline selection gating, and prevent intermediate URL writes from overwriting the incoming state. Finish with one consistent normalized state/URL. Do not fix this by restoring selection before the chapter gate.
2. Add a combined history regression with chapter change plus open/close, valid selection, gated-out selection, and lane order/collapse. Include missing/invalid chapter → Not set and forward/backward traversal. Retain the unchanged-chapter positive controls and fresh-load fail-closed checks.
3. Return exact commit, targeted terminal results and actual-host browser evidence at1440/390 if available; label simulated versus real input and preserve any unavailable checks. Folded-row connectors remain the next feature unit after this correction, not part of the required fix.

Retained limits: O-1 same-document layer restoration; TL22-E2 real input/focus and the1440 click timeout; real close→chapter change→reopen path; mobile1714-row performance; device/AT; chapter gates outside the timeline; PR33 integration; full technical qualification and Mckay's release approval. No new broad audit loop requested.
