# Revision 4 validation

2026-10-30. Implementation **a0d8726d55e389e4568a8d00ab4d9937d2f51e86**; documentation parent **d2fd8d9d3656a74f0930a91a665ec0973a58f15b**. Main status assigns the exact PR24 head; PR24 and PR37 heads and the existing review branch were freshly checked. No duplicate r4 on main.

- `node source-checks-r4.cjs /workspace/universe-pr24-r4-head`: **141 assertions**, 140 positive source/data/callback checks plus one expected surviving-EMP-timer characterization. Reuses the prior 116 positive checks; preserves the old probe unchanged. Executes actual gate/entry/era/event/stop-effect function bodies and the exact timer statement with minimal fixture state. No DOM, scene, browser or server is created.
- `node --test tests/*.test.ts`: **82/82 pass** on exact-head detached checkout.
- `node node_modules/typescript/bin/tsc --noEmit`: **pass**.
- `node --check public/atlas/society.js`: **pass**.
- Temporary symlink to existing `/workspace/universe-pr29-head/node_modules` supplied dependencies, then removed. No dependency download, package changes or implementation edits; checkout clean.
- Review Markdown/CJS formatting and script syntax/whitespace checked. No new production build, dist-reference or browser suite claimed.
- [CI40839422713](https://github.com/mckayec/universe-sandbox/actions/runs/40839422713): completed/success, exact implementation SHA. No rerun requested.
- PR37 comparison limited to named source paths at **9a09dbce1e777d3255e058e11d2b81c53cae8d98**; PR24 tests were not represented as PR37 acceptance. No broad lore sourcing repeated.
- First local probe attempt hit an intentionally stopping load fixture that left `curSiteKey` changed before the next case. Resetting the fixture to the neutral site isolated cases; no application behavior was changed. The final script passes reproducibly.

Remaining: R4-C1 timer cancellation/scene identity, new exact-head recheck, permitted actual desktop/mobile/keyboard/rendered behavior, and owner release approval. All publication stays on `docs/pr24-r3-review-20261027`; no PR creation/metadata action, main write, merge/deploy or scheduler change.
