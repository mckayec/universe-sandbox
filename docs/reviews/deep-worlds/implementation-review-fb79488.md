# Deep Worlds — DWH-01 return review

2026-11-07 · ChatGPT. **DWH-01 accepted at source/isolated-execution level; 1/1 returned finding closed. Full canon and release approval withheld.**

## Revisions and scope

- Reviewed fix: PR37 / atlas/deep-worlds, **fb79488cbc3ff9a404f2052dbd7314e15913d838**, parent **d902c8a7092e5e1f2597af800b11f0f7f63dc901**.
- Inspected **1/1 changed files**, public/atlas/engine.js (+7/−5), complete diff and file.
- Engine blob: **5e26507a4b0e972ea065e0ebd2c6dd3838ac8799**.
- Current PR head when checked: **004c3c9c13b514235cc3fc3dd4b971d31c4948ef**. Its comparison to fb79488 changes only cosmere.js. The engine closure carries to that identical engine, not to the new Cosmere content.
- Cosmere book-by-book remains Claude-owned with unfinished dispositions at its checkpoint. No premature content review or ownership change in that folder.
- Current main inspection covered 25/25 status files. Hierarchy/Licanius/Narnia research, sources, research-review and research-audit SHAs match the previous check; no new stale self-audit was found.

## Finding disposition

The place history state now includes atlasEntry:gen. The stale-transition branch passes the captured generation to cancelEntry, which cleans history only when the current marker belongs to that generation. This satisfies the requested ownership repair: cancellation of an older pending entry cannot erase the newer entry's marker.

The lone-cancellation cleanup remains enabled. DWR-B generation/destination/eligibility checks, delayed continuation/effect checks, and DWR-A Society cancellation are unchanged. No pack or Society file changes in the fix commit. Preserve the prior DWR-A/B and CS04 closures within their recorded evidence scope.

## Independently executed checks

Node 24.22.1; actual source slices in inert VM fixtures, not full browser execution.

| Check | Result |
|---|---|
| dwr-history-probe-d902c8a.cjs at fb79488 | **3/3 scenarios pass**: uninterrupted entry, lone cancellation, superseding entry |
| Same history probe at parent d902c8a | **2/3 pass; H3 fails as expected**: the newer marker is lost |
| dwr-transition-probe.cjs at fb79488 | **11/11 assertions pass** |
| dwr-probe.cjs at fb79488 | **22/22 assertions pass** |

The history scenario count is separate from the 33 transition/lifecycle assertions; do not label this “36 assertions.” H3 ends with one Keats place built, S.view=place, S.site=keats and history.state containing atlasPlace:true and atlasEntry:2.

Input provenance was checked against the nontruncated GitHub tree: Hyperion blob 982f0babb6a53929d5c7d4905c52f3cd84d6fe5d and Society blob 59c3eb5237161eaa6784b18e46ebc4bf3e5555e9. A trailing newline introduced by local text staging was identified and removed; all three runtime input Git blob hashes then matched exactly, and the checks were rerun successfully. Probe source matches the committed versions (transition 28332bd6d045d5b97c7b694f87ccb88793e4677e; lifecycle 9b87675ff3357eb28400a9be7c7a678ce9ecebd9).

## Browser and CI evidence limits

Read fix-return-fb79488.md and the complete dwh-browser-check.cjs.

The builder reports successful entry/Back observations at 1440×900 and 390×844 with no page errors. The script dispatches synthetic clicks on injected delegated buttons and logs state; it has no result assertions. The builder explicitly reports that the same browser harness did not reproduce the old defect. Therefore these are **two builder-attributed positive navigation observations**, not a sensitive negative-control test or proof of real pointer reachability through the fade overlay. This review did not independently rerun that browser harness. The independently sensitive test is the VM parent/fix comparison above.

The builder reports 125/125 unit tests and 24/24 page cases, but test:browser failed twice at the simulator Save/Load wait before reaching any atlas step. That failure remains open technical evidence; the builder's attribution to pre-existing intermittency is not an independently reproduced diagnosis here. Fresh GitHub check-runs for fb79488 show build success and deploy skipped; this run did not inspect the new CI checkout/logs, so it does not assert those counts as independently verified exact-head CI.

The requested browser evidence or specific limitation has been supplied. It does not justify keeping the demonstrated source defect open after the sensitive regression passes; it also does not satisfy final integrated browser/release gates.

## Handoff and Known gaps

Return to Claude for a bounded remaining-content/technical disposition packet: preserve these lifecycle closures, keep the outstanding DW06/Society and CS18 source holds explicit, and list retained-with-evidence versus narrowed/omitted items before requesting final canon approval. Coordinate the unfinished Elantris return in its own folder; no need to redo these unchanged engine checks.

Existing broader coverage, replacement landmark samples, geometry, rendered tour/deep-link/downgrade behavior, device evidence and owner release approval remain as documented in audit.md and earlier reviews. No fresh book-source verification is claimed by this code return. Do not read the older audit's pending DWR-A/B text as reopening closures established by the later implementation reviews.

**Verdict: DWH-01 closed (1/1); no new finding in this bounded return. Canon/release approval remains withheld for the existing broader gaps.**
