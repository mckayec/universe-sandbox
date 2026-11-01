stage: fixing
owner: claude
updated: 2026-11-01
note: ChatGPT reviewed draft PR #44 at 91b9304140b18e358cf3f1be5f0f6808edd83516; CI success independently verified. Resolve M1 (Navigate hint promises unsupported tap selection) and M2 (assertion-based accidental-Clear regression) in implementation-review.md, then return exact revised head. No approval, merge or release.

# Mobile entry and landing-page usability

Mckay reports the Universe Sandbox landing page is difficult to use on a phone and requests a more intuitive experience informed by mobile-app best practices.

Read [research.md](research.md) for scope, primary sources, proposed directions and acceptance criteria. Start with root entry and first-use flows; include the atlas chooser where relevant. This is a queued existing-site improvement, not a new universe or a change to existing audit priorities.

## Next work

Claude: resolve M1 and M2 in [implementation-review.md](implementation-review.md), record each resolution and return the exact revised PR #44 head with checks. The review also provides a bounded direction for the optional first-use entry-card proposal. Preserve existing features, desktop behavior, draft status and real-device/release gates.

Do not treat the initial brief as a completed rendered audit. Preserve all in-flight branches and owner release gates.

## History

- 2026-10-31: Mckay requested mobile usability research and work be added to the queue. ChatGPT committed the initial source-backed brief at 9ee0cd54b33705238011f1ab5a8c0f927980996e, then created this Claude-owned handoff for discovery by the existing docs/reviews/*/status.md pipeline.
- 2026-11-01: Claude: baseline captured on main 8c6a6c7 (Playwright touch emulation with WebGL), seven findings B1–B7 incl. an accidental Clear all after a placing tap (B6). Built fixes for landscape layout, 44 px targets, 320 px overflow, touch hints, aria-pressed, Undo reachability and B6 on draft PR #44 at 91b9304140b18e358cf3f1be5f0f6808edd83516. pnpm check 82/82, test:pages 12×2; test:browser fails at line 88 identically on unmodified main. Entry panel not built (proposal in implementation.md §5). Stage research-ready → implementation-review, owner claude → chatgpt.
- 2026-11-01: Claude: PR #44 CI run 41273407304 at 91b9304 passed (build incl. tests, check:dist and browser tests; deploy skipped). Stage and owner unchanged.

- 2026-11-01: ChatGPT reviewed all six changed files at PR #44 head 91b9304140b18e358cf3f1be5f0f6808edd83516 and independently confirmed successful CI run 41273407304. Published implementation-review.md at 8df9e01415d7a0e86ba2b750a271959648baf8f1; two P2 fixes requested (M1 instruction/selection mismatch, M2 assertion-based regression coverage). No independent runtime/device acceptance or PR approval. Stage implementation-review → fixing, owner chatgpt → claude.
