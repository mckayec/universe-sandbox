# Fixing round 2: APQ-004 and APF-001

2026-11-06 · Claude (builder). PR #38 branch `pack/christian-apocrypha`, new head **`caf70a87b574da1073c2147e73d909eb2a9193ed`** (parent `1e256ceb3ac797ab998c6b7af0edb41d31c8da6f`, the head ChatGPT rechecked). Inputs: [audit-final.md](https://github.com/mckayec/universe-sandbox/blob/d9a05c198f54c838f8bba7076c07fe6a6b11af0b/docs/universes/packs/christian-apocrypha/audit-final.md) and [apq004-alignment.md](https://github.com/mckayec/universe-sandbox/blob/d9a05c198f54c838f8bba7076c07fe6a6b11af0b/docs/universes/packs/christian-apocrypha/apq004-alignment.md) at `d9a05c1`.

One commit; it changes only `public/atlas/packs/christian-apocrypha.js` (4 lines) and `tests/atlas-apocrypha.test.ts` (2 new tests). No engine change.

## Resolutions

| ID | Resolution |
|---|---|
| APQ-004 | Babylon site `books` is now `[1, 5, 6, 7, 8, 9, 10, 11, 22]`: slot 1 added, every later gate unchanged. Source comment now names Tobit 14:4 as the earliest mention and says slot 1 is a neutral name mention with no pinned Tobit event and no route. Coordinates, modern-heritage label and the "not Babylonia or any exile route" disclaimer are unchanged. `tob-14` stays unpinned; its card now records the comparison (move to Media, "where things will go better than in Assyria or Babylon", paraphrase of NABRE Tobit 14:4). Baruch's narrative (`bar-01`) stays at slot 5; no Babylon-pinned event is earlier than slot 5. New test asserts all of this. |
| APF-001 | `m2-03` now reads "A horse bearing a heavenly rider strikes Heliodorus, and two young men scourge him" (RV 2 Maccabees 3:25–26), the wording the audit suggested. New test asserts the new wording and that the old one is gone. |
| APB-005/006 follow-up | PR #38 description corrected: it no longer says CI runs `test:browser`; it now says the sandbox run times out under software GL and CI does not run it. |

Not changed: the 18/19 APB results, Q01–Q03 dispositions and the deferred quotation inventory. The aligned research CSVs from `d9a05c1` live on review PR #42 and are not copied into this branch; the pack tests do not depend on the old row counts.

## Checks at caf70a8

- `pnpm format`, `pnpm check`: 102/102 tests pass (was 100; +2), build and format check pass.
- `pnpm test:pages`: 12 pages × 2 viewports pass.
- `pnpm test:browser` (Chromium 1243, software GL): times out at a `waitForFunction` (30 s) in the simulator smoke test, as in round 1. Not an atlas change; still needs a GPU run.
- Targeted load of `atlas/?pack=christian-apocrypha#book=1&world=earth&site=babylon&view=surface` at 1440×900 and 390×844: no console errors; Babylon is listed and badged at Tob; no Chronicle entry is pinned to it. Screenshots: `shots/r2-apq004-babylon-tobit-1440.jpg`, `shots/r2-apq004-babylon-tobit-390.jpg` (software GL; not finished-surface evidence).

## Still open

- **APB-004** (technical blocker): finished real-GPU surface captures, and Claude's final technical sign-off. Not attempted in this unit.
- ChatGPT: recheck APQ-004 and APF-001 at `caf70a8`.

No merge, no deployment.
