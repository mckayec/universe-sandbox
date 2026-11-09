# Save/Load browser-smoke repair: bounded implementation handoff

2026-11-09. Owner for branch implementation: **Claude**. Independent review: **ChatGPT**. No merge or deployment is authorized by this handoff.

## Concrete fix

1. Apply the adjacent [three-file test patch](save-load-smoke-fix.patch) to a small branch, suggested name `fix/save-load-smoke-race`, from current main. Check the current source first. This deliberately does not edit PR47's application code or its active status.
2. In the smoke test, pause and verify the `Resume` label before saving. Read the expected scene from the actual persisted snapshot rather than a later live `#count`. Keep physics paused through Save → Clear → Load, assert the exact saved count, and verify that Clear did not erase the saved snapshot.
3. Re-save the restored scene and compare IDs, kinds, names, masses, positions, velocities, locks, elapsed time, gravity and group membership. Matching counts alone are insufficient. Restore the previous running/paused state afterward, including on failure. Keep the original strict wait; do not add a longer timeout, retries that conceal failures, or a count tolerance.
4. Run the ten regression cases, format the patch, run the full aggregate checks and **five consecutive full browser smoke runs** in the supported environment. Record every result and duration. One failure means investigate its new saved-count/current-count/pause/toast diagnostics, not call a later pass clean.
5. Return the exact branch/head and raw results to ChatGPT for independent review. Only close the Save/Load test gate after that review accepts the final result. If a paused round trip loses state, treat that as a real serialization defect and fix it separately instead of weakening the test.

## What is already done

The patch changes tests only:

- `tests/browser-smoke.mjs`: replace the racy block with the strict paused round-trip helper.
- `tests/browser-persistence.mjs`: isolated-browser persistence helper and scientific-state comparison.
- `tests/browser-persistence.test.ts`: ten deterministic regression/negative-control cases using the actual `saveUniverse`/`loadUniverse`, actual extracted save/load UI functions and actual pause-handler body. Scene rebuild and browser scheduling are controlled fixtures, not a real renderer.

Checked source: main **0b04dc3466744c970046a294dece3a14b2bcdb2f**, PR47 **920f76e80958a7753ced450b97d66d49ebc4eaca**. The old smoke test, storage module and toolbar have identical blob hashes on both. PR47's history file differs elsewhere, not in the two save/load functions used here.

- Six baseline fixture hashes match their Git blobs.
- The unmodified smoke-test Save/Load sequence passes when no physics intervenes.
- With a forced physics tick after Save but before the DOM count read, the actual old sequence waits for **4** while the saved scene restores **5**.
- With a forced tick immediately after Load, it waits for **5** while the running scene has **4**.
- The candidate prevents both race windows by pausing and restores the original pause state.
- Negative controls still fail for a substituted body ID with the same count, a changed mass with the same count, blocked Save, and a no-op Load.
- **10/10 checks pass** in the independent fixture runner and again after applying the patch to a clean copy. `git apply --check` and JavaScript syntax checks pass.

This establishes the suspected race mechanism under controlled scheduling. It does not prove that every prior browser timeout had that cause, nor is it a new full-browser pass. The historical disposition explicitly called its diagnosis uninstrumented. The stronger comparison may expose an additional serialization bug; retain that possibility.

## Reproduction and completion checklist

From an isolated checkout of the current baseline:

```sh
git apply --check docs/reviews/simulator-clarity/save-load-smoke-fix.patch
git apply docs/reviews/simulator-clarity/save-load-smoke-fix.patch
node --test tests/browser-persistence.test.ts
pnpm format
pnpm check
```

Use the project's supported browser setup and run `pnpm test:browser` five times without hiding failed attempts. Keep its full construction, control and compact-layout coverage. The helper removes only the explicit manual-save storage slot inside the smoke test's fresh browser context so a failed Save cannot silently reuse stale data; it does not touch recovery storage or change production save/load behavior. Group comparisons mirror the restore code's intentional removal of links to bodies already absent from the snapshot.

**Milestone 1, complete:** source inspection, race reproduction, three-file candidate and ten passing controlled checks.

**Milestone 2, Claude:** apply on the small branch, complete formatting/aggregate checks, and produce five consecutive full-browser results. Return exact errors promptly if blocked. A partial pass must remain labelled partial.

**Milestone 3, ChatGPT:** independently inspect final diff and evidence, verify the same head, and explicitly accept or return a finite correction. No release estimate is supported until the browser milestone is completed.

## Scope and coordination

At the check, Claude held a fresh run lock for simulator-clarity/Cosmere work. Its lock, PR47 code and owned status were not changed. This document and its patch are an informational handoff; publication is not evidence of Claude pickup or implementation.

No browser/server launch was retried here following the earlier executor launch restriction. Full formatting/build/suite and browser stress execution are still pending in the authorized builder environment. Preserve unrelated PR47 rendering, GPU/device and owner-release gates.

Sources: [current smoke test](https://github.com/mckayec/universe-sandbox/blob/0b04dc3466744c970046a294dece3a14b2bcdb2f/tests/browser-smoke.mjs), [save/load implementation](https://github.com/mckayec/universe-sandbox/blob/0b04dc3466744c970046a294dece3a14b2bcdb2f/src/state/history.ts), and [historical disposition](https://github.com/mckayec/universe-sandbox/blob/0b04dc3466744c970046a294dece3a14b2bcdb2f/docs/reviews/mobile-entry-usability/save-load-smoke-disposition.md).
