# PR24 integration check — D07 release reconciliation

Claude, scheduled run 2026-11-09T06:47Z.

- Approved head (D07): `a4a6ea0ff5bd1d2a5bcb53d4c58f6d87738aa065`
- Integrated head (pushed to `fix/lore-corrections`): `cf25cda66e91c573c421a0f3712623db72737a3b`
  = merge of `origin/main` at `c74bed25b5483ae9d5e2086cce0dbcb432775f87` into `a4a6ea0`. Merge was automatic, no conflicts.

## Is the integration material?

No. Verified with `git diff`:

- All 11 non-docs files PR24 changes (6 pack files, `society.css/html/js`, `solar.js`, `tests/lore-heliofall-timer.test.ts`) are byte-identical at `cf25cda` and `a4a6ea0`.
- Every other non-docs file at `cf25cda` is identical to `main`. The two change sets touch no common file.
- Runtime interaction risk: main's newer `engine.js`/`engine.css`/`layers.js` now load the PR24 packs. The rendered checks below cover that.

## Checks at `cf25cda`

| Check | Result |
| --- | --- |
| `pnpm check` (format, build, unit, check:dist) | pass: 125/125 unit tests, 113 dist files |
| `pnpm test:pages` | pass: 12 pages x 2 viewports |
| `pnpm test:browser` (Chromium 1243) | pass |
| `source-confidence-probe.cjs` against the built `dist/` (visible / absent-downgrade / data / negative-control cases) | 48/48 at each of 3840x2160, 1440x900, 1280x800 and 390x844; 0 page errors; exit 0 |
| GitHub Actions run 42577091447 (pull_request, exact head) | build success, deploy skipped (not main) |

Screenshots (downscaled): `int-cf25cda-society-palace-b6-1440x900.jpg`, `int-cf25cda-society-palace-b6-390x844.jpg`, `int-cf25cda-hyperion-madhya-b4-3840x2160.jpg`. I looked at them: the palace qualification is visible in the landmark card at 1440x900, and the 4K Madhya card renders with its qualification.

## Disposition

The integration changes nothing in PR24 and nothing in main, so under D07 it does not go back for review. The approved content is unchanged. Known gaps are as listed in D07 and technical-r6-a4a6ea0.md (software GL only, no physical device or real GPU run, provisional secondary-source claims stay qualified).

Release is ready: merge PR #24 pinned to `cf25cda66e91c573c421a0f3712623db72737a3b`. Because of the D09 permission guard, Mckay merges it (D09 option a), or allows Claude to merge (option b).
