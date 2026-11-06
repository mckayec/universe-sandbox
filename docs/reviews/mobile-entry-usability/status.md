stage: implementation
owner: claude
updated: 2026-11-06T03:22Z
blocked-on: none
next-action: Claude: record remaining acceptance evidence on PR #44 head 4ffda2d (device-size/accessibility checks, Save/Load smoke disposition) and hand to ChatGPT
idle-runs: 0
note: ChatGPT closed M1/M2 at PR #44 head 4ffda2d28678588c829751339dcaf619711ccc40 at source/test/recorded Chromium-CI level; review 7bbe2947f8e4bbce588051a328a0035e0ad8b3b2. Claude owns remaining implementation/acceptance evidence, including device/accessibility checks and a disposition of the separate Save/Load smoke failure. CI does not run test:browser. Draft, unmerged; not release approval.

# Mobile entry and landing-page usability

Mckay reports the Universe Sandbox landing page is difficult to use on a phone and requests a more intuitive experience informed by mobile-app best practices.

Read [research.md](research.md) for scope, primary sources, proposed directions and acceptance criteria. Start with root entry and first-use flows; include the atlas chooser where relevant. This is a queued existing-site improvement, not a new universe or a change to existing audit priorities.

## Next work

Claude: follow the return review in [implementation-review.md](implementation-review.md). M1/M2 are closed for the stated head at source/test/CI level; do not redo unchanged fixes. Complete or explicitly checkpoint remaining device/accessibility and rendered acceptance, disposition the separate test:browser Save/Load failure, and continue the bounded optional entry-card/resilience work as appropriate. Record exact revision and passed/failed/unavailable checks; return new implementation changes or failures for review. Preserve existing features, desktop behavior, draft status and Mckay's release gate.

Do not treat the initial brief as a completed rendered audit. Preserve all in-flight branches and owner release gates.

## History

- 2026-10-31: Mckay requested mobile usability research and work be added to the queue. ChatGPT committed the initial source-backed brief at 9ee0cd54b33705238011f1ab5a8c0f927980996e, then created this Claude-owned handoff for discovery by the existing docs/reviews/*/status.md pipeline.
- 2026-11-01: Claude: baseline captured on main 8c6a6c7 (Playwright touch emulation with WebGL), seven findings B1–B7 incl. an accidental Clear all after a placing tap (B6). Built fixes for landscape layout, 44 px targets, 320 px overflow, touch hints, aria-pressed, Undo reachability and B6 on draft PR #44 at 91b9304140b18e358cf3f1be5f0f6808edd83516. pnpm check 82/82, test:pages 12×2; test:browser fails at line 88 identically on unmodified main. Entry panel not built (proposal in implementation.md §5). Stage research-ready → implementation-review, owner claude → chatgpt.
- 2026-11-01: Claude: PR #44 CI run 41273407304 at 91b9304 passed (build incl. tests, check:dist and browser tests; deploy skipped). Stage and owner unchanged.

- 2026-11-01: ChatGPT reviewed all six changed files at PR #44 head 91b9304140b18e358cf3f1be5f0f6808edd83516 and independently confirmed successful CI run 41273407304. Published implementation-review.md at 8df9e01415d7a0e86ba2b750a271959648baf8f1; two P2 fixes requested (M1 instruction/selection mismatch, M2 assertion-based regression coverage). No independent runtime/device acceptance or PR approval. Stage implementation-review → fixing, owner chatgpt → claude.
- 2026-11-01: Claude: M1 (Navigate hint now "to focus: Inspect, tap an object, then Focus") and M2 (assertion-based tests/mobile-touch.mjs, `pnpm test:touch`, wired into deploy-pages.yml: B6 portrait aimed at Clear all's post-sheet position and landscape, explicit Clear/Undo, Navigate hint with/without prior selection and no-select pan, pinch, cancelled touch, mouse double-click focus) at 4ffda2d28678588c829751339dcaf619711ccc40. Mutation checks fail as intended. Touchend suppression now only cancels cancelable events (removes Chrome intervention console errors the new test caught). pnpm check 82/82, test:touch, test:pages 12×2 pass locally; test:browser line-88 failure unchanged from main. CI 41280511228 success incl. the new step. Stage fixing → implementation-review, owner claude → chatgpt.

- 2026-11-05 (America/Denver; 2026-11-06 UTC): ChatGPT return review at exact PR #44 head 4ffda2d28678588c829751339dcaf619711ccc40: 2/2 M1/M2 findings closed at source/test/recorded Chromium-CI level; 5/5 return files and 9/9 PR diffs inspected. Report committed at 7bbe2947f8e4bbce588051a328a0035e0ad8b3b2 and read back before status. Independently read CI 41280511228 logs: tested merge 43abdc6fb857f064759a205b0b5bf37370be54b7 differs from head only in docs/coordination files; 82/82 unit tests, 24/24 page/viewport cases and touch suite passed. test:browser is absent from CI; local mutation and baseline reports were not independently rerun. No new device/browser session or release approval. Stage implementation-review → implementation, owner chatgpt → claude for remaining acceptance/implementation evidence.
- 2026-11-06: Claude: header converted to R1 (speed amendment); stage and owner unchanged.
