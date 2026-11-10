# CBR-04 implementation review — 55e28bd

Date: 2026-11-10. Reviewer: ChatGPT. **Bounded infrastructure correction accepted; canon research remains incomplete.**

## Exact scope and disposition

PR48 `feature/cosmere-reading-state`, head `55e28bd7af1a7b1074f59765982ccee1f922804b`, compared with parent `7155f0acbcfa351c73fb990366b4e0bd163ea3cf`. Inspected the actual 2/2 incremental files, not only [Claude's return](cbr04-return-55e28bd.md).

- `public/atlas/engine.js`, blob `5d09714dd45bc7a0d4b2a688bce7abd7a66d44d8`: both realmCard and realmLook now use realmsOwn, intersecting the world chain with the realms field gate in per-work modes. Denied data falls back to generic realm copy/look. Legacy/All retain prior behavior.
- `tests/atlas-realms-gate.test.ts`, blob `e6ebd027554cd9b234ef8b3030a80b202fb5336c`: six state controls, selector transition, and source-order guard for applyRd.
- applyRd now calls applyRealmToPlanet before refreshAll when the existing planet remains usable. Rebuild and hidden-world early returns remain intact. This addresses stale uniforms when the reading selection changes without a gfx cache-key change.
- No pack, work registry, factual copy, record threshold or field mapping changed. Prior CBR-01–03 closures and the narrow Scadrial/Luthadel return remain accepted.

**CBR-04 closed for this exact implementation.** This is not a full implementation or release approval; PR48 remains draft/unmerged and its integration/release gates remain separate.

## Independent evidence

[Reviewer runner](reviewer-realms-55e28bd.mjs) and [output with input manifest](reviewer-realms-output-55e28bd.json) were saved/read back before this review.

| Evidence | Result | Scope |
|---|---|---|
| Git blob verification | 11/11 inputs match exact head | Four runtime/pack files, five focused test files, fixture, bibliography input |
| Original reviewer reproduction, unchanged logic | 12/12 pass, formerly 8/12 | Two consumers × six fixture states; original runner hardcodes its old head label, so this rerun's actual engine blob was verified separately |
| Extended reviewer reproduction | 18/18 pass | Separate name, blurb and look expectations for unread-valid, present-invalid, satisfied, absent, legacy and All cases |
| Focused Node test suite | 43/43 pass | Actual source helper/selector/UI-adapter/registry tests; includes eight CBR-04 tests |
| Independent rendered browser cases | 0 completed | Chromium exited 134 before page load: process_singleton_posix.cc:297, socket() failed: Operation not permitted (1) |

Two initially copied test inputs were older formatting revisions; refreshed both from the exact GitHub head, verified all 11 blobs and reran the 43 tests. The saved evidence is from the corrected input set. No stale-input run is offered as exact-head verification.

The new test's applyRd check is textual ordering, not independently executed browser/controller interaction. Selector transition tests and actual implementation inspection support the bounded correction; the live material transition evidence below remains builder-attributed. Neither the full 161-test suite nor dist/pages validation was rerun independently here.

## Builder evidence examined, with limits

Read the [rendered probe](cbr04-realms-probe.mjs), [head log](cbr04-rendered-output-55e28bd.txt) and [parent negative log](cbr04-rendered-negative-7155f0a.txt). Recounted 86/86 PASS lines at head; parent 68/86 pass and 18/86 fail. Failures correspond to denied-name/material/style checks for unread, invalid and post-untick states at both viewports. These are Claude-executed results, not reviewer executions.

Inspected 4/4 supplied screenshots: [desktop allowed](shots/cbr04-1440x900-allowed.jpg), [desktop denied](shots/cbr04-1440x900-denied.jpg), [phone allowed](shots/cbr04-390x844-allowed.jpg), [phone denied](shots/cbr04-390x844-denied.jpg). Desktop shows the specific name/description and gray mist look when allowed, generic Cognitive copy and purple look when denied. Phone stills show the corresponding appearance difference, but the dossier sheet is collapsed: they do not independently demonstrate the phone card's copy.

The harness initially selects realm/descends using JavaScript; its state transition ticks/unticks the real work checkbox. Its name assertion searches dossier text and does not separately assert rendered blurb absence. Fixture gates are synthetic; none is a researched work threshold. Claude's 161/161 unit, 115 dist and 24/24 page checks remain attributed to the return. Existing simulator Save/Clear/Load and integration constraints are not cleared by this review.

## Research continuation checkpoint

Return to `content-review / chatgpt`. No new canon mapping is certified. Preserve **4/10 listed parent fields narrowed, 6/10 held, 0/2 parents promoted, 2/7 PR48 key-2 events mapped and 0/33 full-work approvals**. Broader PR37 ledger: 8/148 narrow candidate fields, 140 held; 2/65 event-record candidates, 63 held. Nested realm content remains an additional hold outside the ten-field denominator.

The [prior source checkpoint](parent-surface-review-7155f0a.md) remains authoritative for failed-access routes and evidence distinctions. The unmodified pack still exposes Scadrial's own Cognitive description/look under existing fallback rules without a researched realms field gate; the generic realm first:4 versus matching subastral first:7 inconsistency remains a data/research hold. The engine repair makes an explicit gate effective; it does not invent that gate.

Next bounded unit: seek a complete identifiable Scadrian system essay/chart and a lawful primary Cognitive passage through a new source route. If still inaccessible, prepare a finite omission/qualified-model proposal for the unresolved surfaces, preserving verified copy and restrictive parent gates. Do not repeat the failed Google Play/gallery routes without new access evidence, promote entire parents, or treat this defect closure as full-book research.

Run triage: 18/18 pack and 8/8 review statuses inspected on main; no other ChatGPT-owned audit identified. Existing parallel self-audits remain current. No site or PR-branch edit, merge, deployment, Mckay decision or release approval.
