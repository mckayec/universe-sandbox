```
stage: implementation
owner: claude
updated: 2026-11-03
note: Checkpoint 6 on draft PR #45, branch engine/timelines at 24655ebda5b1c6b98803f4283fbd1e7b5a063069 (parent 312d2dd, the independently re-reviewed head; stacked on PR #39; not merged). TL-R03 residual resolved: Tab/Shift+Tab from a non-tabbable fallback target (Overview heading, scroll pane) now move to the neighbouring control inside the dialog, wrapping; fallback order unchanged. Evidence (checkpoint-6.md on the branch): pnpm check 123/123, check:dist 120 OK, test:pages 12x2, test:browser passed; the reviewer's own eda30c8 probe re-run unchanged passes every check incl. Tab after downgrade at 390/1440/3840 with no console/request errors; new tl6-focus-probe.mjs 43/43 (60x Tab and Shift+Tab after gate refresh, resize and lane collapse, at 390/1440/3840) vs 31/43 at 312d2dd. Still open: claim-specific relationship locators, Standard Works adapter, drag reorder, physical devices. Claude keeps ownership and continues locator/adapter work; a review of 24655eb (TL-R03) is welcome. No release acceptance.
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
- 2026-11-02: Claude: timeline checkpoint 5 at 312d2dde5f3824e16a1317c5293ac1b61f3bd287 (PR #45): TL-R01–R06 resolved (checkpoint-5.md); pnpm check 123/123, tl5-probe.mjs 29/29. Stage and owner unchanged (implementation / claude).

- 2026-11-03: ChatGPT: independent re-review of exact PR45 head 312d2dde5f3824e16a1317c5293ac1b61f3bd287 published in [PR46 review/evidence](https://github.com/mckayec/universe-sandbox/blob/eda30c8357f61361e31de8c58300fb9ed6061be6/docs/reviews/synchronoptic-timelines/independent-review-312d2dd.md), review commit eda30c8357f61361e31de8c58300fb9ed6061be6. Five findings resolved within scope; TL-R03 remains Medium after gating (Overview → Tab → underlying Earth button), reproduced at 390/1440/3840. 123 tests/120 files pass; independent browser 56/59 checks pass, three failures are this same issue. Source-locator/adapter/chapter/device gaps remain. PR46 refreshed from main without conflict; remote shows draft/open/unmerged/mergeable. Stage implementation / owner claude unchanged; PR33 unchanged. PR title/body update was denied by automatic approval review, not retried; latest report is authoritative.
- 2026-11-03: Claude: timeline checkpoint 6 at 24655ebda5b1c6b98803f4283fbd1e7b5a063069 (PR #45): TL-R03 Tab containment from fallback focus (checkpoint-6.md); reviewer probe all pass, tl6-focus-probe.mjs 43/43 (31/43 at parent). Stage and owner unchanged (implementation / claude).
