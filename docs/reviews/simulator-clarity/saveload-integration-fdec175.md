# Save/Load repair folded into PR47 — integration return at fdec175

Claude, 2026-11-16T20:47Z. Requested by [saveload-review-2026-11-16.md](saveload-review-2026-11-16.md). Not merged; no release approval.

## What changed

- `sim/clarity-physics` (PR [47](https://github.com/mckayec/universe-sandbox/pull/47)) was fast-forwarded from 1acc2ea61f39cb1f355a661373bf91bf86be00b8 to **fdec17592d5635178a71bd1d1a8c6d8120c0dcae**. No new commit, rebase or cherry-pick: fdec175's only parent is 1acc2ea, so PR47's new head **is the reviewed integration head**, byte for byte.
- PR metadata after the push: head fdec175, open, not merged.
- `git diff --stat 1acc2ea fdec175`: exactly 3 test files (tests/browser-persistence.mjs +109, tests/browser-persistence.test.ts +232, tests/browser-smoke.mjs +10/−7). No application file changed.
- Blob check at the new head: browser-persistence.mjs 788eb37eb0427e3a5175cb26d883f999366abc1a, browser-persistence.test.ts e90f2386be9d77f7e408ea124e612eef4ccbe523, browser-smoke.mjs dc901f8098d1d2d7d7624b12a652844c74d3dd7b — all 3 match the reviewed blobs.

## Checks

Because the head is identical to the already-reviewed fdec175 (same tree, same application base), no checks were re-run in this unit; the evidence in [saveload-return-14bbbac.md](saveload-return-14bbbac.md) / [evidence-saveload-14bbbac-fdec175.txt](evidence-saveload-14bbbac-fdec175.txt) applies directly. Evidence ownership is unchanged:

| Evidence at fdec175 | Who ran it |
| --- | --- |
| 5/5 consecutive unedited strict `pnpm test:browser` runs; 234/234 suite; format/build/check:dist | Builder (Claude), earlier run |
| tests/browser-persistence.test.ts 10/10; 6/6 input blobs verified | Independent (ChatGPT), fixture-level, not a browser run |
| Independent browser execution | 0 cases (reviewer Chromium cannot launch) |

## Packet update

[final-packet-3ab737f.md](final-packet-3ab737f.md) §4 now records the Save→Clear→Load row as accepted at bounded scope at fdec175 (its earlier "not a PR47 blocker" waiver is superseded and marked historical). Scope stays the helper's enumerated projection (elapsed/gravity; body ID/kind/name/mass/birthMass/position/velocity/locked/buildLocked/groupId; group ID/name/surviving links) — not exhaustive serialization; bhReference persistence still rests on its own 7b tests.

## Remaining-gates inventory at PR47 fdec175

| Gate | State |
| --- | --- |
| Items 1–7, SC7-E1, SC7-O1 | Accepted at prior bounded scopes (unchanged; no application delta since 1acc2ea) |
| Save→Clear→Load strict smoke | Accepted, bounded (this unit) |
| SC1-E1 / SC4-E1 rendered acceptance | Named limitations: SwiftShader only, no real GPU/physical device/real OS background, no independent rendering, no quantitative phase/shear certification |
| Legacy Earth-mass labels on non-hole bodies | Low known gap, follow-up item |
| Screen reader, 200% text zoom, native-menu, page-wide resize | Not done; named limitations |
| Pause-label wait before try/finally in helper | Test-cleanup limitation, noted by reviewer; not changed |
| Whole-handoff technical sign-off | Pending ChatGPT |
| Release | Mckay's decision |

## Handoff

ChatGPT: review this integration (head identity + inventory) and decide whether PR47 at fdec175 goes to final technical sign-off, or return one bounded unit.
