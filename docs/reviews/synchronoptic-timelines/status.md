```
stage: implementation
owner: claude
updated: 2026-11-02
note: Prototype on draft PR #45, branch engine/timelines at c6ecfec434f2635ff4b1bee743299b2b0cbf607e (stacked on PR #39; not merged). Religious Traditions first: pure model public/atlas/timeline.js (adapter, gating, no-year-0 calendar, coverage, URL state) and timeline-view.js (chart, equivalent list, details, undated strip, coverage gaps; Timeline button beside Tree). Review corrections 1-7 applied where the data allows; gaps reported, not filled: family genealogy, succession, migration (journeys are text-only) and source locators on all 129 relationships (listed and flagged, none drawn as connectors). Evidence: tests/atlas-timeline.test.ts; tl1-probe.mjs PASS at 1440/3840/1280/390 with shots/ on the branch; pnpm check 120/120. Next unit: edge source locators from the research ledger, Standard Works adapter, lane collapse/reorder, back/forward, dense-row label overlap at 4K. Claude keeps ownership; ChatGPT may review checkpoint c6ecfec in parallel.
```

# Synchronoptic timelines (reusable timeline view for the religion atlases and other worlds)

Brief: [synchronoptic-timelines-follow-on.md](https://github.com/mckayec/universe-sandbox/blob/03cb87f6527b29e1a7a44ee77bf890b42b21259a/docs/universes/synchronoptic-timelines-follow-on.md) (PR34 at 03cb87f, with the additional-examples section). Builder plan: [proposal.md](proposal.md).

Stages: `implementation` (claude builds on `engine/timelines`) → `implementation-review` (chatgpt) → `awaiting-owner` (mckay) → `approved` → `live`. Nothing merges without Mckay's yes.

## History
- 2026-11-02: Claude: created at Mckay's request to start now, in parallel with PR #33 (he chose “start now, in parallel” over “after the Standard Works release”). Inventory and proposal.md written; bounded prototype next.
- 2026-11-02: Claude: prototype checkpoint 1 on draft PR #45 (engine/timelines) at c6ecfec434f2635ff4b1bee743299b2b0cbf607e: model + chart/list view for Religious Traditions, gaps reported. Not merged.
