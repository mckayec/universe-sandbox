# Deep Worlds R0: technical disposition and release request

**Technical: approved at `a060de4263ec88870854ed9590da5192d6c35f24` (PR #53, `engine/deep-worlds-r0`), engine-only R0 scope per D10.** Release needs Mckay's yes (DECISIONS D13).

Claude, scheduled run 2026-11-27T08:07Z. Builds on ChatGPT's [implementation review](implementation-review-a060de4.md) (R0-2 closed) and the builder [receipt](r0-2-fix-a060de4.md).

## What R0 ships

- Engine/places infrastructure, loader, style and test integration only (nine engine/integration paths).
- No shipped pack data, Society or simulator content changes: the narrative/scene work from PR #37 stays deferred, and the opt-in places gate is off for every shipped pack, so public behavior is unchanged.
- Three test-only paths sit outside the R0 allowlist (the scope script reports FAIL on exactly those three). Accepted exception: they are tests, not shipped content.

## Checks re-run by Claude at the exact head

Main's newest non-docs commit is still 5210bba (PR #47), already merged into this head, so no further integration is needed.

| Check | Result |
|---|---|
| `pnpm check` (format, build, unit tests, check:dist) | pass: 383/383 tests, 127 dist files |
| `pnpm test:pages` | pass: 15 pages × 2 viewports |
| `pnpm test:browser` | pass, including Save/Clear/Load round trip (25/25) |
| Opt-in places fixture, 1440×900 | 113/113 predicates passed before the run hit Claude's 560 s budget during the later T-cases; R0-2's S1 (17/17) and B3 (17/17) cases complete. [log](claude-fixture-output-a060de4-1440-partial.txt) |
| Opt-in places fixture, 390×844, S1 + B3 | 34/34 passed. [log](claude-fixture-output-a060de4-390-S1B3.txt) |
| Screenshots looked at | S1 downgrade settled at 390×844 and B3 downgrade settled at 1440×900 ([shots](shots-claude-a060de4/)): book-I labels only, no Keep or later-book copy, fan-work notice present |
| GitHub CI on this head | passed (run 45954462033) |

This closes the 0/2 independent rendered reruns ChatGPT could not do.

## Known gaps (carried into the release request)

1. Software-GL Chromium emulation only: no physical phone, GPU, WebKit or assistive-technology run.
2. Three test-path scope exceptions (above).
3. Pre-existing gate-off surface-label issue and the hidden raw site ID on a stale book-I link remain documented, not fixed (outside D10 scope).
4. Fixture-only coverage: no shipped pack opts in yet; any pack that opts in later needs its own validation.
5. Deferred content: PR #37 narrative places and Society application have no canon disposition and are not in this release.

Any change to the PR head after this SHA requires review of the delta before release.
