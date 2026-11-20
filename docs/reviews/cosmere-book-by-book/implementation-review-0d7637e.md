# SA03-DW06-PORT implementation review — 2026-11-20

Decision: **accept 1/1 finite e35 text correction at source/test level**, with the rendered and technical limits below. Full SA03 remains deferred; **0/33 full-work approvals**. Continue SA04 / Oathbringer as the next bounded research unit, subject to fresh higher-priority work. This is not release approval.

## Exact scope

- PR48, `feature/cosmere-reading-state`, head **0d7637e8973187afa3e8c58552a197d48c315b03**, actual parent **97ebc3d1c4d0f7e21d486dc2afdac842e4dc19fb**.
- Read the actual commit diff and both changed files: **2/2 incremental files**, `public/atlas/packs/cosmere.js` (+1/−1) and new `tests/atlas-sa03-dw06.test.ts` (+133). The cumulative PR file list has 23 files; this bounded review does not recertify all prior PR infrastructure.
- Pack change is exactly e35.text: “Lift travels to Yeddaw in Tashikk, where Darkness has been reported.” Event id/book/world/site/title/order, all other pack data, geometry, parents and gates are unchanged. No PR37 e96/codex/landmarks imported.
- Reconciles historical DW06/F-CO1 per [handoff](sa03-handoff-2026-11-20.md); PR24/37 are not newly assigned. Prior SA01/SA02 and other accepted closures stand.

## Independent evidence

[Reproducible actual-parent reviewer](reviewer-sa03-0d7637e.ts), saved at d15b09ce1314e88a3621bb31aacb1b489cecd8fc, runs under Node v24.22.3 against fetched GitHub inputs; **5/5 Git blob hashes verified**:

| Input | Git blob |
| --- | --- |
| head cosmere.js | ae2a877eb9a667c332e0f5b96ea22c89b5c91f35 |
| actual-parent cosmere.js | ebe9c3948fe288723aac8093e9fc5eabbee65f91 |
| head engine.js | 0bc5357a2043f3939512bc5b091eb4ffbbf1c5d0 |
| head reading.js | 4d9bc177294e5e33accf6f19825ef467f0bb90d4 |
| submitted test | c29369ee3cd1981379c17e8a4b87cb700a80a482 |

`SA03_INPUT_DIR=<input-directory> node --test reviewer-sa03-0d7637e.ts`: **2/2 tests pass**. Exact event payload and whole parsed pack equality after removing only e35.text pass against the actual parent, not a reconstructed old string. The submitted test's parent is reconstructed from its candidate, so this independent comparison is material.

Actual engine selectors and real reading helper: **11/11 enumerated states** preserve every Roshar event visibility result and Yeddaw eligibility. e35/Yeddaw remain visible in All, legacy 7/12 and WoK + all 13 bucket-7 works; withheld in legacy 6, empty selection, Edgedancer alone, WoK + Edgedancer, WoK + WoR + Edgedancer, bucket 7 alone, and WoK + bucket 7 minus Edgedancer. These are VM selector checks, not rendered cases or completed per-work mappings.

`SA03_NEGATIVE=1` with the same command substitutes the actual parent: **1/2 passes, 1/2 expected payload failure**, exit 1. The visibility test still passes. This proves the candidate text check rejects the old text while showing the unchanged gate behavior. The builder's negative file aborts at a top-level assertion before its two new subtests, which explains its different 18-pass/1-fail total.

Reopened [publisher-hosted Edgedancer excerpt](https://us.macmillan.com/books/9781250166548/edgedancer/) this run: chapter 2 places Lift at Yeddaw in Tashikk, approaching the city, and reports the message about Darkness being seen there. This supports the narrow journey sentence without assigning an unsupported victim or asserting her disputed motive. Selected opening passages only; no full novella or edition collation.

## Validation provenance and limits

Independently queried [exact-head CI run 44677807213](https://github.com/mckayec/universe-sandbox/actions/runs/44677807213) and its jobs. Build job succeeded; install, format:check, build, test, check:dist and standalone subpath page check steps succeeded. Deploy job skipped. These are GitHub-reported outcomes, not locally rerun broad suites. Direct job endpoint was rejected by connector URL validation; the supported run/jobs endpoint supplied step conclusions.

Read [Claude's return](sa03dw06-return-0d7637e.md), the complete [rendered probe](sa03dw06-probe.mjs) and head/negative log results. Builder reports focused **20/20**, broad **648/648**, dist **115 files**, pages **12 × 2**; those numeric broad totals remain builder-attributed. Rendered logs account for **114/114** head assertions and **78/114** parent passes with **36/114** expected text failures, across 1440×900 and 390×844. Six text-sensitive checks × three allowed states × two viewports explain all 36 failures. The probe also checks three withheld states per viewport.

**0 independent rendered cases; 0/6 screenshots viewed by this reviewer.** Builder logs and probe inspection are not independent visual verification. Phone dossier uses real tap, but phone Chronicle item uses dispatched DOM click because of overlap. Both dossier and Chronicle galaxy-view paths keep S.site null; surface-view Yeddaw selection was not rendered. Do not promote these results to full touch usability, surface-travel or screenshot acceptance.

The carried Save/Load browser-smoke problem remains open: Claude reports one failed run out of two at browser-smoke.mjs:88. Exact-head CI page success does not close that distinct smoke failure.

## Continuation and retained holds

- Close **SA03-DW06-PORT 1/1** only. Keep SA03's 17/17 narrative and 8/8 nested-landmark dispositions, full-record/source/geometry gaps and deferred full-work state.
- **0 new gates/mappings/parent promotions**. Conservative 13-work anthology fallback remains; Edgedancer-only selection still does not expose the event or site.
- Next research unit: SA04 / Oathbringer, initial exact-head inventory and selected primary-source checkpoint. Reconcile current PR24/37 before any implementation request. Follow the two-checkpoint cap; do not restart broad SA03.
- Startup inspected **18/18 pack and 8/8 review statuses**. No other owned work or missing/stale eligible parallel self-audit was found.
- No application or PR-branch edits, merge, deployment, or approval on Mckay's behalf.
