```
stage: implementation
owner: claude
updated: 2026-11-02
note: Prototype on draft PR #45, branch engine/timelines at 708f26c689a6ae58120040a1c7a1b5aa344720ac (parent 257cc2e, checkpoint 3; stacked on PR #39; not merged). Checkpoint 4: the timeline panel now uses the full screen width on wide and 4K screens (it was capped at 1600px, 1900px at 4K) and the details column grows to at most 400px; phone and 1440 layouts unchanged. Evidence: tl4-probe.mjs 4/4 at 3840x2160, 2560x1440, 1440x900 and 390x844 (panel width, chart fills its scroll area, details column readable, no page sideways scroll) with no console errors, requestfailed or HTTP>=400 (tl4-probe-output.txt; shots tl4-*); pnpm check 121/121, check:dist 120 files OK. Still open: edge source locators from the research ledger, Standard Works adapter, drag reorder (buttons only for now). Claude keeps ownership; ChatGPT may review checkpoint 708f26c in parallel. Independent ChatGPT review at this exact head is now published on review/timelines-708f26c (4cc983f): TL-R01–06 require follow-up; see the dated implementation-review update in parallel-handoff-review.md. Claude continues immediately; no new proposal gate or acceptance.
```

# Synchronoptic timelines (reusable timeline view for the religion atlases and other worlds)

Brief: [synchronoptic-timelines-follow-on.md](https://github.com/mckayec/universe-sandbox/blob/03cb87f6527b29e1a7a44ee77bf890b42b21259a/docs/universes/synchronoptic-timelines-follow-on.md) (PR34 at 03cb87f, with the additional-examples section). Builder plan: [proposal.md](proposal.md).

Stages: `implementation` (claude builds on `engine/timelines`) → `implementation-review` (chatgpt) → `awaiting-owner` (mckay) → `approved` → `live`. Nothing merges without Mckay's yes.

## History
- 2026-11-02: Claude: created at Mckay's request to start now, in parallel with PR #33 (he chose “start now, in parallel” over “after the Standard Works release”). Inventory and proposal.md written; bounded prototype next.
- 2026-11-02: Claude: prototype checkpoint 1 on draft PR #45 (engine/timelines) at c6ecfec434f2635ff4b1bee743299b2b0cbf607e: model + chart/list view for Religious Traditions, gaps reported. Not merged.
- 2026-11-02: Claude: timeline checkpoint 2 at 06545fcefd6412950d7d7dd74d7e512347a66049 (PR #45): browser Back/Forward; tl2-probe.mjs 4/4, pnpm check 120/120. Stage and owner unchanged (implementation / claude).
- 2026-11-02: Claude: timeline checkpoint 3 at 257cc2e4c25000c78c7f45ce8934a546012d5b5a (PR #45): lane collapse/expand and reorder with URL state, era/tick label overlap fixed; tl3-probe.mjs 4/4, pnpm check 121/121. Stage and owner unchanged (implementation / claude).
- 2026-11-02: Claude: timeline checkpoint 4 at 708f26c689a6ae58120040a1c7a1b5aa344720ac (PR #45): full-width panel on wide/4K screens; tl4-probe.mjs 4/4, pnpm check 121/121. Stage and owner unchanged (implementation / claude).

- 2026-11-02: ChatGPT: independently reviewed exact PR45 head 708f26c689a6ae58120040a1c7a1b5aa344720ac; [review/evidence](https://github.com/mckayec/universe-sandbox/blob/4cc983f7a1cef5ce9269f51333f9123c08f5c763/docs/reviews/synchronoptic-timelines/independent-review-708f26c.md). Six findings cover provenance/identity guards, collapsed-list completeness, focus, future event gates, URL state, and inherited phone filter layout. 121 tests/120 files passed via npm scripts; desktop/390/4K probes include explicit failures and emulation limits. Review branch published; draft review PR creation denied by automatic approval review, not retried. Stage and owner remain implementation / claude; fixes/research proceed now. PR33 unchanged.

- 2026-11-02: ChatGPT: authorized follow-up retry created [draft review PR #46](https://github.com/mckayec/universe-sandbox/pull/46) from review/timelines-708f26c at 4cc983f7a1cef5ce9269f51333f9123c08f5c763; draft/open/unmerged independently read back. Earlier creation denial resolved; no implementation or release-gate changes. Claude remains implementation owner.
