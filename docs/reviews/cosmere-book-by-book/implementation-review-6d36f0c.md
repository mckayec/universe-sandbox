# COS-BB-001 correction review — 6d36f0c

ChatGPT, 2026-11-10 UTC. Draft PR #48, `feature/cosmere-reading-state`, exact head **6d36f0c4afc2c2c2c9f7cbf860226112338eb235**; prior audited head **1e588f0c5bdab5f8775f20481e07b57cb3b5c318**.

**Return fixing / claude for the finite CBR-02 remainder.** CBR-01 and CBR-03 close at the source/controller scope below. The original world-era blurb/facts bypass is corrected, but the sibling field audit finds two remaining bypasses. Infrastructure and real mappings are not accepted as complete.

## Dispositions

| Finding | Disposition | Evidence |
|---|---|---|
| CBR-01 deliberate empty state | Closed at helper/controller scope | `none` persists as `#read=_none` and `{"mode":"none"}`; invalid input remains a separate safe/no-write state. Actual-function repository regressions pass for storage/reload and history-parameter rewriting. |
| CBR-02 world era fields | Original blurb/facts defect corrected; **open**, two residual Medium paths below | Actual world-era selectors now intersect world, era record, world field and era field gates. Status/gfx era overrides use the same helper. Base gfx and group-name handling still bypass parts of that contract. |
| CBR-03 pending descent | Closed at source/controller scope | Tickets recheck target identity, selection and current visibility before the fade commits and before deferred Earth loading builds. A changed generation may proceed only for a still-visible, still-selected target, using current state. Actual-function tests cover narrowed/safe state, changed selection, superseded descent and deferred load; no GPU execution claimed. |

## CBR-02 residual fixes

1. **Base graphics — Medium**, `public/atlas/engine.js:728`. `gfxFor` starts with an unconditional copy of `w.gfx`. On a world visible to A, both `gates.gfx={req:"b"}` and an invalid gfx field gate still return the protected base map when only A is read. The new gate applies to era overrides only. The output is consumed by surface construction/cache selection, so hiding later overrides does not protect a gated base graphic. Apply the field restriction to base gfx as well, provide a usable neutral fallback, and ensure direct base-gfx consumers cannot restore protected data. Preserve valid/public and legacy controls.

2. **Group names — Medium**, `engine.js:479,1000–1004`. `GROUP_NAME` returns its base name without evaluating `gates.name`; present unmet/invalid base-name gates therefore do nothing. For a group era, `eraFieldOk` substitutes `bucketGate(k)` for the record path and ignores a present `eras[k].gate`. Reading the whole numeric bucket exposes an era name whose explicit record gate is unmet or invalid. This conflicts with the supplied PACK_FORMAT promise that present invalid gates hide records and that the era rules include group names. Apply a documented group ancestor/record policy, respect explicit era-record gates (bucket fallback only when absent), and return a neutral label or omission for hidden base names. Do not quietly weaken the agreed fail-closed/field-gate contract to fit these paths.

[Independent selector probe](reviewer-fields-6d36f0c.mjs), [raw output](reviewer-fields-output-6d36f0c.json): **8/14 expected behaviors pass; 6/14 fail** (two base-gfx, two base-group-name, two group-era-record cases). It invokes the actual reading helper and extracted selectors with synthetic A/B fixtures. The empty string/object in its expectations represents omission; an explicitly neutral production fallback is also acceptable. Public/met-gate, gated-era-field and legacy controls pass. The runner exits 1 for the six failed expected behaviors. This is a source-contract reproduction, not proof that a particular real-book spoiler was painted.

Return a bounded correction at an exact head with actual-function regressions for unmet/invalid/public/met gates, inherited era gates, hidden ancestors, legacy behavior and visible/hidden earlier-era fallbacks. Add rendered negative controls for group text (including DOM text) and protected graphics at both existing viewports; ensure the graphics assertion actually distinguishes a protected resource from its fallback. Keep CBR-01/03 closed unless a regression is demonstrated.

## Verification and limits

- Read **7/7 incremental changed-file patches**, the actual changed source/test files and PACK_FORMAT at the exact head. **8/8 fetched local input Git blob hashes match** (seven changed files plus reading-demo fixture). PR head was freshly verified. Comparison of **3250d094233a37e6c6697e4487d9dcf27b76cd79 → 6d36f0c** confirms **1/1 changed file is PACK_FORMAT**, so the builder's rendered application snapshot is byte-equivalent for application files.
- Independently executed `node --test tests/atlas-reading.test.ts tests/atlas-reading-ui.test.ts tests/atlas-reading-engine.test.ts`: **25/25 pass** (12 helper, 6 UI, 7 engine groups). These passing tests do not cover the six residual expectations above.
- Read the builder return, correction harness and pending-surface harness. Independently recounted the raw log: **62/62 CBR-01 + 32/32 CBR-02 + 16/16 CBR-03 + 28/28 pending checks = 138/138 attributed builder checks**, across 1440×900 and 390×844. The other raw summaries report **59/59 fields, 128/128 parity/smoke and 42/42 UI**. Those are builder executions, not reviewer browser execution. The 128 denominator includes 78 comparisons of six captured surface groups over 13 keys, not every possible exposure.
- Evidence precision: the rendered CBR-03 “safe-state analogue” repeats deliberate last-untick narrowing; it is not an independently demonstrated invalid-link transition. Safe-state cancellation has actual-function coverage. CBR-01 browser Back/Forward calls swallow navigation errors and do not independently prove history movement; the actual history-rewrite regression supplies narrower controller evidence. The pending-surface return uses the existing **test-only `window.__HD=256`** hook, not full production HD baking.
- Fresh Chromium launch failed before any page at process-singleton socket permission, exit 134: **0 independent rendered cases**. No full build/full-suite/CI-log rerun, new screenshot inspection, physical-device or screen-reader certification in this correction review. Builder 143/143 units, 115 dist and 24/24 pages remain attributed; unavailable Save/Load browser smoke is not a pass.

## Continuation

Fix only the finite CBR-02 remainder, then return for implementation review. Keep the source-backed key-2 then key-12 mapping continuation queued behind the infrastructure correction. Fixture IDs are not an approved registry; **0/33 full-book audits approved**. Previous Elantris/design dispositions stand. D08 authorizes implementation scope, not release. No new canon research, application/PR-branch change, merge, deployment or Mckay release approval.

This run inspected **18/18 pack statuses and 8/8 review statuses** on main. Both Cosmere and simulator-clarity were eligible; three parallel research folders were unchanged, so no self-audit/status churn was needed.
