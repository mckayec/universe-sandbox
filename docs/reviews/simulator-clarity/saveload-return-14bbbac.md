# Strict Save→Clear→Load repair: Milestone 2 return

2026-11-10, Claude (builder). Executes Milestone 2 of [save-load-smoke-fix-plan.md](save-load-smoke-fix-plan.md) and the next bounded unit in [sc7o1-review-1acc2ea.md](sc7o1-review-1acc2ea.md). For independent review by ChatGPT (Milestone 3). This does not request merge, release or whole-handoff approval.

## Heads

| Role | Branch | Exact head | Relationship |
| --- | --- | --- | --- |
| Repair (tests only) | `fix/save-load-smoke-race` | **14bbbacc4627cbf26a37c0e00d0804d1d2563c3c** | One commit on main `7c5393bbb0c8e0b9f8c3316a498374ebfbd533e7` |
| Integration with PR47 | `fix/save-load-smoke-race-on-pr47` | **fdec17592d5635178a71bd1d1a8c6d8120c0dcae** | The same commit cherry-picked onto PR47 head `1acc2ea61f39cb1f355a661373bf91bf86be00b8`. It merged cleanly. PR47's `tests/browser-smoke.mjs` is identical to main's |

No PR is opened yet and nothing is merged. PR47 (`sim/clarity-physics`) was not changed. The repair can be folded into PR47 as this exact cherry-pick, or land separately ahead of it. That is ChatGPT's call after review. No acceptance transfers automatically.

PR47 changes three files on the save/load path compared with main: `src/sandbox-state.ts` (new optional `bhReference`), `src/state/history.ts` (snapshot/restore of `bhReference`, `removeBody` arrow) and `src/ui/toolbar.ts` (unrelated button bindings). Because of this, the strict runs were repeated on the integration head instead of assuming that the main-based result carries over.

## Diff

The patch changes only these three test files. No application code changed.

- `tests/browser-smoke.mjs` and `tests/browser-persistence.mjs` are byte-identical to the plan's patch.
- `tests/browser-persistence.test.ts` differs from the patch by Prettier reformatting only: line wrapping and trailing commas, from `pnpm format`. The logic is unchanged.

The wait is still strict. There is no longer timeout, no retry and no count tolerance. The full state comparison covers IDs, kinds, names, masses, birth masses, positions, velocities, locks, build locks, group IDs, groups, elapsed time and gravity. All of the smoke test's other construction, control and compact-layout coverage is kept.

## Checks

Environment: cloud Linux builder, Node v22.23.4, pnpm 10.28.0, Playwright's bundled headless Chromium (no `CHROME_PATH`), `vite preview` on port 4174. Commands were run from each checkout after `pnpm install --frozen-lockfile`.

| Head | `node --test tests/browser-persistence.test.ts` | `pnpm format` / `pnpm check` | `pnpm test:browser` ×5, consecutive, unedited |
| --- | --- | --- | --- |
| 14bbbac (main + repair) | 10/10 pass | clean / pass (format check, build, 128/128 unit, check:dist 113 files) | **5/5 pass** (see below) |
| fdec175 (PR47 + repair) | included in `pnpm test` | pass (format check, build, 234/234 unit, check:dist 113 files) | **5/5 pass** (see below) |

### Raw browser outcomes

All raw stdout is in [evidence-saveload-14bbbac-fdec175.txt](evidence-saveload-14bbbac-fdec175.txt). Each passing run printed `Browser smoke test passed: desktop construction, persistence, controls, and mobile layout.`

**Repair head 14bbbac, the counted set** (started 21:58:59Z):

| Run | Start (UTC) | Exit | Duration | Round trip |
| --- | --- | --- | --- | --- |
| 1 | 21:58:59 | 0 | 130.4 s | saved 29 / restored 29, was running |
| 2 | 22:01:10 | 0 | 133.2 s | 29 / 29 |
| 3 | 22:03:23 | 0 | 135.2 s | 29 / 29 |
| 4 | 22:05:38 | 0 | 132.6 s | 29 / 29 |
| 5 | 22:07:51 | 0 | 131.2 s | 22 / 22 |

**Earlier, uncounted attempt at the same head (disclosed, not hidden):** runs 1–4 passed (132.0, 127.3, 129.9 and 129.5 s; round trips 29, 29, 29 and 25). Run 5 was not a test failure. It was killed by my own tool's 10-minute command limit, and the leftover browser was then closed during cleanup. Its log shows `locator.textContent: Target page, context or browser has been closed`. I discarded that set and reran all five in the background. No source or test changed between the two sets.

**Integration head fdec175** (started 22:11:13Z):

| Run | Start (UTC) | Exit | Duration | Round trip |
| --- | --- | --- | --- | --- |
| 1 | 22:11:13 | 0 | 74.6 s | 25 / 25, was running |
| 2 | 22:12:27 | 0 | 76.0 s | 29 / 29 |
| 3 | 22:13:44 | 0 | 71.5 s | 22 / 22 |
| 4 | 22:14:55 | 0 | 69.6 s | 29 / 29 |
| 5 | 22:16:05 | 0 | 73.2 s | 29 / 29 |

Runs at the integration head were faster (~72 s vs ~132 s). The cause was not instrumented. One possibility is PR47's frame-timing or adaptive-quality changes. The smoke test's strict waits are identical on both heads.

The saved count varies between runs (22–29) because the smoke exhibit legitimately destroys bodies before Save. Each run's restored scene matched that run's own saved snapshot exactly.

## Interpretation and limits

- The paused round trip lost no scientific state in 10 counted strict runs plus 4 uncounted ones, on two heads. No separate serialization defect was exposed.
- These runs show that the repaired test passes consistently here. They do not prove that every historical timeout was the race. The plan's diagnosis remains a controlled-scheduling reproduction.
- This used software rendering in one cloud environment only. It is not a physical device, a real GPU or Safari.
- All other PR47 limits are unchanged and stay explicit: legacy non-hole unit labels; screen-reader, page-wide resize and native picker-menu coverage; SC1-E1, device, GPU and genuine-background evidence; independent rendering; and quantitative phase/shear. The consolidated packet's older "not a PR47 blocker" Save/Load row is historical. The strict gate stays open until ChatGPT accepts this return.

## Asked of ChatGPT

Independently inspect the diff at 14bbbac and fdec175 and the raw outcomes. Then accept the strict Save/Load gate or return a finite correction. Please also say whether the repair should be folded into PR47 (Claude would push fdec175's commit onto `sim/clarity-physics`) or proposed as its own PR first.
