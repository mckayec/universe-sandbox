# Checkpoint 21 independent review — sidecar loader and opt-in wiring

Reviewed 2026-11-07. PR45 branch **engine/timelines**, exact head **2cdef89f2518551ac5750be5abfd27c7adc5fa46**, parent **5e2639281d267287884a45a28655f1e545a6655d**. PR head independently reread and matched. Prior [checkpoint 20 review](independent-review-5e26392.md) remains in force.

## Scope and result

Inspected **8/8 changed files**: four public runtime/HTML files, one test file, checkpoint report, actual-pack probe and its expected output. No pack content is changed in this delta. Accepted here: the loader's bounded source-reconciliation behavior, backed by independently executed unit and actual-pack checks. This is **not** acceptance of the unfinished Standard Works atlas integration or a release recommendation.

| Evidence | Independent result |
|---|---|
| Exact-head local input integrity | **11/11 Git blob hashes match** authenticated GitHub reads: the eight changed files plus unchanged timeline.js, the proposed pilot JSON and the grounding regression test. |
| Grounding regression suite | **18/18 passed** with the exact-head module. |
| New sidecar loader suite | **6/6 passed**; combined total **24/24**, zero failures/skips. Eight absent/invalid/stale variants revoke a previous synthetic promotion; three endpoint/edge changes reject stale bindings. Proposed recommendation=accept does not promote; a native non-sidecar citation survives an absent sidecar; narrowing hides the promoted edge/selection/search result. |
| Real-pack probe | **5/5 reported scenarios reproduced**. Matching host version: **0 promoted, 12 rejected, 0 changed, 0 grounded edges**. Eleven rows remain proposed; Babylon still fails destination containment. Absent/stale/no-host-version/wrong-pack cases promote zero. |
| Synthetic DOM probe | **0/14 scenarios executed**. Chromium failed before page creation, as detailed below. No rendered pass claimed. |
| Required full application checks | Builder reports 159/159, pages 12×2, browser smoke and two-width preview. These were **not independently reproduced** here. Exact branch-head check-runs and Actions runs queries both returned zero records; this does not establish checks on a synthetic merge revision. |

Commands executed against isolated exact-head copies:

```text
node --test tests/atlas-timeline-grounding.test.ts tests/atlas-timeline-sidecar.test.ts
node docs/reviews/synchronoptic-timelines/tl21/host-sidecar-probe.mjs <PR33 pack>
```

The pack supplied to the real probe was PR33 **3e3701ffcc4131200f0993e52f8f14a509016ced**, independently hashed as blob **3d279a757303e6ae7e80c358a6f6e041269eb82c**. The host's source version is derived from that blob, not accepted from the sidecar.

## Source-level assessment

- `loadSidecar` sets sourceVersion from the host, rejects incompatible envelope/version/pack/row-map/manifest data, and calls reconciliation for absent, invalid and stale outcomes. Reconciliation clears previous sidecar promotions while preserving unrelated native sources.
- Current endpoint/edge binding checks remain authoritative; the loader reports changed rows but does not regenerate their accepted bindings. The earlier 18 regression cases preserve binding, supplementary support, locator/provenance and revocation constraints.
- The view calls the loader before its first computation when `sidecar` is supplied (including null), exposing its report as `view.grounding`. The engine forwards opt-in pack fields and index.html loads grounding before the view. Source inspection verifies these additions; it is not a rendered integration test.
- The view still defaults to `adaptTree`, and the engine entry remains tree-specific. The real Standard Works pack probe therefore verifies the adapter/model/loader route, **not** a Standard Works atlas button, URL restoration, chapter selector or interactive host. This matches the builder's disclosed unfinished scope.

Relevant exact-head blobs: timeline-grounding.js **61790e0bb61b5172a3271edf23f6767346283a40**; timeline-view.js **9d283ed1b1f5d4abc0704200eccf99951fc65cd3**; engine.js **d6ce98287203d5cacadfd07d4e671a964fdfd1d6**; sidecar test **357a0df8b2f0b1048b7b89d357f9498387f11e63**.

## Browser evidence gap and executable next check

Added [reviewer-view-probe.cjs](tl21/reviewer-view-probe.cjs) for the actual timeline/grounding/view modules, with synthetic data only. It has seven scenarios at each of 1440 and 390 CSS-pixel widths: accepted, proposed, absent, invalid, stale, changed and host not opted in. Each checks first-render source state and citation DOM, then narrowing removes the selected hidden endpoint and citation. It does not certify full-host wiring, mobile hardware or assistive technology.

The attempted launch using installed Playwright and `/usr/bin/chromium` failed before creating a page:

```text
FATAL:chrome/browser/process_singleton_posix.cc:297
socket() failed: Operation not permitted (1)
```

Thus the probe is committed **unexecuted**, not green. Claude must run it in a browser-capable environment, fix any probe/setup or implementation failure, and return terminal output. No conclusion about application behavior follows from this environment failure.

## Canon boundary and next bounded handoff

**0/12 real relationships substantively accepted or promoted.** This review does not reopen the source pages or upgrade the November 4 live-page provenance; no new immutable edition identity, source hash, chronology or same-entity approval is claimed. Twelve-row proposed evidence and the Babylon hold remain intact.

Return to Claude for the next bounded integration checkpoint: wire the Standard Works adapter into the actual atlas host within the already authorized timeline build scope; preserve book/layer/chapter restrictions, including hiding current-book chapter-gated records while the host has no chapter selector. Keep real pilot rows proposed and zero-promoted. Run the committed synthetic DOM probe and actual-host open/close, downgrade, selection/search and URL-restore checks; return an exact head, diff and terminal evidence (or a precise environment blocker). A synthetic accepted row may test rendering, but must never be shipped as accepted real evidence.

Folded-row connectors, chapter selector, fresh per-row acceptance, full runtime/CI qualification, device/AT checks and separate owner release approval remain open. Do not move this review to awaiting-owner as if the full feature were complete.

**Verdict: checkpoint 21 loader accepted within tested unit/actual-pack scope; rendered and complete-host acceptance withheld. Hand back to Claude for the bounded integration and browser-evidence return. No final canon, full technical or release approval.**
