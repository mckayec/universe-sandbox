# Timeline checkpoint 10: `pnpm test:browser` Save/Load timeout

Bounded assignment: `parallel-handoff-review.md` → "Bounded Claude assignment: full browser-smoke Save/Load
timeout — 2026-11-03". Run on 2026-11-03 (UTC) by Claude's scheduled builder run.

## Result

**Cause: test race, not the application and not only the environment.** The smoke test clicks Save while the
Gododdin exhibit is still simulating, then reads `#count` _after_ the click and uses that as the expected count
after Load. The exhibit removes bodies as it plays out, so the DOM count read after Save can already be lower
than the snapshot Save stored. Load then correctly restores the stored snapshot, and the test waits forever for
the smaller, stale number.

Captured on exact head 908bab4 with the diagnostic copy of the test (`tl10/smoke-save-diag.mjs`, identical to
the suite up to Save, plus logging):

```
DIAG preSave 29 savedCount(DOM after click) 25 saveToast "Saved 29 objects and 1 structures on this device" stored bodies 29 elapsed 2.6999999999999953
DIAG count series after save (100ms) 22,22,22,22,22,22,22,22,22,22,22,22
DIAG savedCount "25" now 29
DIAG toasts [ 'toast show|Saved universe restored', ... ]
```

So Save stored 29 bodies (its own toast and `localStorage` both say 29), the test expected 25, and after Load the
page shows 29, the stored count. Same numbers on both diagnostic runs. No console errors or warnings besides
SwiftShader "GPU stall due to ReadPixels" performance notices; `restoreUniverse` did not fail.

Why it depends on the machine: how far the exhibit has run by the time Save is clicked depends on frame rate. In
this container (software GL) the timing is consistent enough that it fails every time; on a faster machine Save
may land before the first removals, which is why other runs have passed. CI does not run `test:browser`, so CI
success says nothing either way.

## Fix (tests only, `tests/browser-smoke.mjs`)

Pause the simulation before reading the count and saving, check that Save's toast reports that same count, then
resume after Load is verified. No assertion was removed and no timeout was changed; the Load check is now
deterministic and gains one assertion (Save's reported count).

```diff
-  await page.getByRole('button', { name: 'Save' }).click();
+  // The Gododdin exhibit keeps simulating and removes bodies as it plays out, ...
+  await page.locator('#pause').click();
+  assert.equal(await page.locator('#pause').textContent(), 'Resume');
   const savedCount = await page.locator('#count').textContent();
+  await page.getByRole('button', { name: 'Save' }).click();
+  assert.match(await page.locator('#toast').textContent(), new RegExp(`^Saved ${savedCount} objects`));
   ...
   await page.waitForFunction(count => document.querySelector('#count')?.textContent === count, savedCount);
+  await page.locator('#pause').click();
+  assert.equal(await page.locator('#pause').textContent(), 'Pause');
```

Scope note: this file is the site-wide smoke test, and `main` has the same race (no timeline code is involved;
`git diff 35ca9a2 908bab4 -- tests/browser-smoke.mjs src/state src/bodies src/physics` is empty). It is
committed here because `test:browser` is required evidence for this PR. If Mckay or the reviewer prefer, the
same one-file change can go to `main` as its own small PR instead.

## Environment

- Container: Ubuntu 24.04.5 LTS, kernel 6.18.44, cloud sandbox; Node v22.23.4, pnpm 10.28.0.
- Repository Playwright: `playwright@1.62.1` (from `pnpm install --frozen-lockfile`), which expects Chromium build
  1234 = Chrome for Testing 151.0.7922.34 at `/opt/pw-browsers/chromium-1234/chrome-linux64/chrome`.
- **Matched browser blocker:** that build is not present (only `chromium-1243`), and
  `PLAYWRIGHT_BROWSERS_PATH=<scratch>/pw1234 playwright install chromium` fails:
  `Download failed: server returned code 403 body 'request blocked: no rule or allowlist entry allows host "cdn.playwright.dev"'. URL: https://cdn.playwright.dev/builds/cft/151.0.7922.34/linux64/chrome-linux64.zip`.
- Fallback used for every run: `CHROME_PATH=/opt/pw-browsers/chromium-1243/chrome-linux64/chrome` (Google Chrome
  for Testing 153.0.8010.12), headless, launched by the test's own `chromium.launch({ headless: true,
executablePath })`; WebGL through SwiftShader (no GPU).

## Commands and results

Isolated worktrees of each SHA, `GIT_LFS_SKIP_SMUDGE=1 pnpm install --frozen-lockfile` (exit 0), `pnpm build`
(exit 0), then `CHROME_PATH=… pnpm test:browser`. Logs in `tl10/`.

| Tree                                | Runs | Result                                                       |
| ----------------------------------- | ---- | ------------------------------------------------------------ |
| 908bab4 (exact head, unmodified)    | 2    | exit 1, `TimeoutError` at `browser-smoke.mjs:88`, ~110 s     |
| 35ca9a2 (unmodified parent)         | 2    | exit 1, `TimeoutError` at `browser-smoke.mjs:88`, ~108 s     |
| 908bab4 + fix                       | 3    | exit 0, "Browser smoke test passed …", ~130 s each           |
| fix + mutated Load (always no save) | 1    | exit 1, `TimeoutError` at the Load wait (line 94), as wanted |

Fixed tree also: `pnpm format` clean, `pnpm check` 126/126, `pnpm check:dist` 121 files OK, `pnpm test:pages`
12 pages × 2 viewports.

## Still unverified

- Runs with the exact Playwright-matched Chromium 151 build (blocked by the proxy, above). The cause is a timing
  race in the test, so the browser build is not expected to matter, but that was not run.
- The fix on real GPU hardware and on macOS Chrome (the test's second browser choice).
- `main` itself was not run; the race is the same code there.
- All earlier timeline gates are unchanged (Standard Works adapter and chapter gates, 169 empty record `src`
  arrays, genealogy/succession/travel/Apocrypha/world calendars, drag reorder, devices/AT, CH13/X08 limits).
