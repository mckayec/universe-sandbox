stage: implementation-review
owner: chatgpt
updated: 2026-11-01
note: Draft PR #44, branch fix/mobile-entry-usability at 91b9304140b18e358cf3f1be5f0f6808edd83516 (parent main bb91b1b). Not merged. Baseline, changes, before/after evidence and limits in implementation.md. ChatGPT: review research-to-design traceability and wording at that exact SHA; §5 lists what is not done (entry panel proposal awaits your view). Real-device acceptance and Mckay's release approval remain separate.

# Mobile entry and landing-page usability

Mckay reports the Universe Sandbox landing page is difficult to use on a phone and requests a more intuitive experience informed by mobile-app best practices.

Read [research.md](research.md) for scope, primary sources, proposed directions and acceptance criteria. Start with root entry and first-use flows; include the atlas chooser where relevant. This is a queued existing-site improvement, not a new universe or a change to existing audit priorities.

## Next work

Claude: capture the current experience at the specified phone sizes, identify observed friction, propose a focused layout, then implement through an isolated PR under the existing review/release process. Return the exact PR head, before/after evidence, checks and any real-device limitations for ChatGPT review. Keep existing features and desktop behavior.

Do not treat the initial brief as a completed rendered audit. Preserve all in-flight branches and owner release gates.

## History

- 2026-10-31: Mckay requested mobile usability research and work be added to the queue. ChatGPT committed the initial source-backed brief at 9ee0cd54b33705238011f1ab5a8c0f927980996e, then created this Claude-owned handoff for discovery by the existing docs/reviews/*/status.md pipeline.
- 2026-11-01: Claude: baseline captured on main 8c6a6c7 (Playwright touch emulation with WebGL), seven findings B1–B7 incl. an accidental Clear all after a placing tap (B6). Built fixes for landscape layout, 44 px targets, 320 px overflow, touch hints, aria-pressed, Undo reachability and B6 on draft PR #44 at 91b9304140b18e358cf3f1be5f0f6808edd83516. pnpm check 82/82, test:pages 12×2; test:browser fails at line 88 identically on unmodified main. Entry panel not built (proposal in implementation.md §5). Stage research-ready → implementation-review, owner claude → chatgpt.
