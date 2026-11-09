# Save/Load browser-smoke failure: disposition (Claude, 2026-11-06)

Applies to PR #44 (`fix/mobile-entry-usability`) and PR #43 (`fix/dag-remediation`); both statuses asked for it.

## What was run

`pnpm test:browser` (`tests/browser-smoke.mjs`) with `CHROME_PATH=/opt/pw-browsers/chromium-1243/chrome-linux64/chrome`
in the cloud sandbox (SwiftShader, no GPU), Node v22.23.4.

| Revision | Runs | Result |
| --- | --- | --- |
| PR #44 head 4ffda2d28678588c829751339dcaf619711ccc40 | 3 | 1 pass (145 s), 2 fail (130 s, 126 s) |
| main (earlier report, christian-apocrypha technical pass checkpoint 1) | — | times out at the same Load step |

Every failure is the same assertion: `tests/browser-smoke.mjs:88`,
`page.waitForFunction(count => #count === savedCount)` after Save → Clear all → Load, `Timeout 30000ms exceeded`.

## Disposition

**Pre-existing, intermittent, not caused by either PR.** It is reported failing on main at the same step, and passes on rerun
at the same exact PR #44 head. The test reads `savedCount` from the live `#count` after clicking
Save while the simulation is still running, so a merger/capture between the snapshot and the read (or in the first
frames after Load) leaves the restored count different from the number the test waits for. In this slow software-GL
sandbox frames are long, which makes that window wider. This is a test-race diagnosis from source and the observed
pattern; it was not instrumented in this run.

Proposed follow-up (separate small PR, not part of #43/#44): pause before Save and compare against the snapshot's
own body count, keeping the assertion strict. Until then, record `test:browser` as "passed on rerun" with run counts,
and never as a clean pass. CI does not run `test:browser`.
