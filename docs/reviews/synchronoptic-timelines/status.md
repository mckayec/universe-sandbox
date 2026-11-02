```
stage: implementation
owner: claude
updated: 2026-11-02
note: Prototype on draft PR #45, branch engine/timelines at 06545fcefd6412950d7d7dd74d7e512347a66049 (stacked on PR #39; not merged). Checkpoint 2 adds browser Back/Forward (review correction 7): opening the timeline pushes one history entry, Back closes it with focus back on the Timeline button, Forward reopens it with the same selection, the close button and Escape step back over the entry (three open/Escape cycles leave history length unchanged), and a shared #tl=1 link closes by replacing the URL. Evidence: tl2-probe.mjs 4/4 at 1440 and 390 touch with no console errors, requestfailed or HTTP>=400 (tl2-probe-output.txt, shot tl2-forward-restored-1440); pnpm check 120/120, check:dist 120 files OK. Checkpoint 1 (c6ecfec): Religious Traditions model and view, gaps reported not filled (family genealogy, succession, migration, source locators on all 129 relationships). Next unit: edge source locators from the research ledger, Standard Works adapter, lane collapse/reorder, dense-row label overlap at 4K. Claude keeps ownership; ChatGPT may review checkpoint 06545fc in parallel.
```

# Synchronoptic timelines (reusable timeline view for the religion atlases and other worlds)

Brief: [synchronoptic-timelines-follow-on.md](https://github.com/mckayec/universe-sandbox/blob/03cb87f6527b29e1a7a44ee77bf890b42b21259a/docs/universes/synchronoptic-timelines-follow-on.md) (PR34 at 03cb87f, with the additional-examples section). Builder plan: [proposal.md](proposal.md).

Stages: `implementation` (claude builds on `engine/timelines`) → `implementation-review` (chatgpt) → `awaiting-owner` (mckay) → `approved` → `live`. Nothing merges without Mckay's yes.

## History
- 2026-11-02: Claude: created at Mckay's request to start now, in parallel with PR #33 (he chose “start now, in parallel” over “after the Standard Works release”). Inventory and proposal.md written; bounded prototype next.
- 2026-11-02: Claude: prototype checkpoint 1 on draft PR #45 (engine/timelines) at c6ecfec434f2635ff4b1bee743299b2b0cbf607e: model + chart/list view for Religious Traditions, gaps reported. Not merged.
- 2026-11-02: Claude: timeline checkpoint 2 at 06545fcefd6412950d7d7dd74d7e512347a66049 (PR #45): browser Back/Forward; tl2-probe.mjs 4/4, pnpm check 120/120. Stage and owner unchanged (implementation / claude).
