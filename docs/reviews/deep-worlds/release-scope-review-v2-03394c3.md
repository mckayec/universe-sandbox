# Deep Worlds scope decision review — v2 at 03394c3

2026-11-09 UTC · ChatGPT.

**The v2 inventory and virtual construction are verified at the bounded data scope below. R1 is not canon-cleared. Offer the concrete R0 engine-only implementation scope to Mckay (D10), with new places and Society deferred. This is a scope decision, not release approval.**

## Exact target and evidence

PR37 `atlas/deep-worlds` remains open at **03394c32816fcb5c95261bf6a9ea4520381a5838**, comparison base **51fe68887ae2d6a4c4c7b291d2df534f7bf4d7b0**. No R0 or R1 implementation branch was produced by this review.

Reviewed [v2 manifest](release-scope-manifest-v2-03394c3.md), blob `09d706340c98e3f62c14c2c204aac1bc3b184c94`; [68-row CSV](release-scope-allowlist-03394c3.csv), blob `79d8a6f86add4c7630ef7d727cbc4874e91ba5fd`; complete construction script, blob `343a357407518cb6e3b96dd7124b27766bbb1ed5`; output, blob `c49d0fdea149520c217b6a9e0ce47d54ba27e1c7`; prior scope review and the named supplement, e13, Elantris and omission acceptances. Read the current PR file inventory and freshly fetched all six complete pack files at both the PR37 head and proposed PR24 baseline **cf25cda66e91c573c421a0f3712623db72737a3b**.

Executed an independently written [data check](scope-v2-check.cjs); [complete output](scope-v2-check-output-03394c3.json):

| Check | Independently observed |
|---|---|
| Retrieved pack content versus Git blob SHA | 12/12 match |
| Allowlist operation rows | 68/68 inspected; 68 distinct identity/field/operation keys |
| Included operations versus actual head | 47/47 match: 32 description/set comparisons and 15 field/entry/record absence checks |
| Proposed construction on PR24 baseline | 424 scene objects; 14 landmarks; 417 empty-landmark scenes |
| Event site/landmark references | 256/256 resolve; 0 dangling |
| Named O omissions | 10/10 absent, with 0 matching string values remaining in the constructed packs |

The two codex-list removals intentionally share an identity/field but have different operations. The 47 denominator is **not 47 newly sourced claims**, nor 47 set/add leaves: it includes ten whole-record omissions. It establishes correspondence and data closure only. The input to the checker is the parsed CSV plus GitHub `{content,sha}` responses for each of the six packs at the two exact commits, as documented in its header. No application code was edited.

No fresh narrative/web-source verification, separate Deep Research product, browser suite or CI execution was performed for this existing-evidence scope review. Current main triage covered 18/18 pack and 8/8 review statuses. The three research-ready parallel audit folders remain unchanged from the preceding completed run.

## Four response groups

| Request | Disposition |
|---|---|
| RS1 hotel closure | **Closed for the proposed slice.** Hotel/tower and dependent f1a2 are excluded; no invented replacement location. The independent construction closes all 256 references. |
| RS2 leaf boundaries and model treatment | **Packaging addressed; R1 acceptance remains withheld.** Accepted description values and unresolved metadata are explicit. The script still copies each entire head landmark object using `copy.deepcopy(head_obj)`; the independent construction confirms 14/14 copies carry additional fields. The qualification proposal does not settle the unresolved labels/gates. See below. |
| RS3 cumulative acceptance | **Closed at disposition-ledger scope.** e13's later accepted text and the 13 named Elantris operations are carried, e1's unsupported new link is not. e70/e102/b1p remain outside the proposed slice; their omission does not revoke accepted conservative wording. No full Elantris or whole-record approval is inferred. |
| RS4 omission provenance | **Closed at disposition-ledger scope.** All 10 identities have traced dispositions: b7c via PR24 L1/IR1, e7 via CS06/232fef1, the other eight via c8159ae. Freshly inspected commit `6ce5fc55a4b4004c5f9f01193c24c394bb5b930f`: its Sun Eater diff removes precisely b7c's mapped event. The approved PR24 package carries that disposition. |

This is **4/4 response groups reviewed: 3 closed, 1 partial**. Prior accepted corrections and technical closures remain recorded at their original limits.

## Resolve the four requested choices

1. **b1k/e77/e78: out of the proposed R1.** Their accepted prose does not establish all metadata needed for newly exposed events. Preserve their accepted text for any later inclusion.
2. **Link set L: out, 4/4 links.** Text support does not independently approve the four new landmark associations. No arbitrary relocation.
3. **d1/e35: preserve the construction baseline, 2/2.** Do not import the unaccepted PR37 narrowings or describe baseline prose as newly verified. “Keep main” means the explicitly pinned integrated baseline when a slice is actually built, not an instruction to overwrite later accepted edits.
4. **Illustrated-scene treatment: insufficient to clear this R1; choose the R0 alternative for the owner question.** A visible model qualification is useful for procedural geometry. It cannot establish factual landmark names, correct first disclosure or spoiler eligibility. V2 explicitly leaves `name` and `books/first` unresolved for all 14 descriptions, yet copies those fields (including absent gates on bluff/study). The independent output records the actual metadata. Missing gates do not by themselves prove an early spoiler, but the existing source packet has not certified that inherited eligibility is safe. Calling a scene an interpretation does not resolve that evidence gap.

This does not declare those names/gates false, reopen accepted geometry limits, or require another broad book-research loop. Preserve the field ledger for later bounded work. Do not turn the 47/47 data result into whole-scene or canon acceptance.

## D10: concrete R0 implementation scope

**Question:** prepare a separate engine-only R0 candidate, or defer Deep Worlds until a bounded scene scope has accepted label/gate dispositions? **Recommend R0** as the already proposed technical foundation, with the explicit tradeoff that it adds no enterable places now.

If Mckay chooses R0, Claude owns the next implementation unit:

- Start from a freshly pinned main on a separate draft branch. Carry only the engine/places infrastructure and necessary loader/style/validator/distribution integration from v1 §3 item 1: `engine.js/css`, `places.js`, `places-lm.js`, `places-fx.js`, `places-audio.js`, the index loader, and narrowly required package/test/schema support. This is a functional scope, not permission to overwrite entire old branch files.
- **All pack data and Society application/assets remain byte-identical to that integrated baseline.** No R1 scene objects, 14 landmarks, event additions, link set L, or whole PR37 merge. No unrelated solar, texture or simulator changes. Keep the full PR37 work and its accepted correction history available for later bounded delivery.
- Reconcile PR24/PR39 and other actual baseline integrations without reverting their accepted changes; PR48 reading-state semantics remain a separate accepted design/implementation lane. R0 does not secretly import PR24 or authorize its merge. PR24-first is a stated dependency of the proposed R1; R0 must instead demonstrate preservation of whatever approved content has actually reached its chosen main baseline.
- Return the exact candidate head, complete diff and an independent baseline comparison proving unchanged content. Demonstrate new place entry remains dormant in ordinary UI, event/tour navigation and stale/deep links; test any existing scene-capable baseline content explicitly before claiming dormancy. A copied loader or absence of new data alone is not sufficient proof.
- Run required build/format/unit/page/browser checks and exact-head CI; rerun applicable DWO/DWT lifecycle, downgrade and history probes on the integrated engine. Use clearly isolated test fixtures for dormant feature paths, never test-only data shipped as new canon. Return current four-viewport atlas regression evidence. R1's 32-slot place matrix is deferred with R1, not credited as passed.
- Preserve device/GPU, pointer-hit, Save/Load and DWT-03-R1 tree-integration limits. Any activation of tree-bearing place data triggers that existing requirement.

R0's lack of new pack/Society content is a proposed scope boundary, not evidence the future implementation is regression-free. Accepted PR37 corrections absent from main remain deferred work, not revoked findings. Canon/content checks of the actual R0 delta, technical sign-off and a separate Mckay release decision remain required.

## Handoff

Keep `stage: content-review`; set `owner: mckay`, `blocked-on: mckay` for **D10 only**. Do not use `ready-for-owner`: this is not a release-ready head. After the scope answer, Claude prepares the selected bounded candidate and returns its exact revision for implementation review. If deferred, preserve PR37 and the accepted leaf ledger without automatic further research.

The agreement and decision history are unchanged. No application/PR branch edit, PR approval, merge, deploy or release approval occurred.
