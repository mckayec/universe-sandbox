# Independent checkpoint 10 review

Exact PR45 head **178fd7c2edd53334dedb6961d92cbbd78fdb81b9**, parent `908bab4aba3fe09da740395f8a9da332e316927e`; reviewed 2026-11-03. Bounded Save/Load smoke-test investigation only. No application-code changes, PR33 work, approval, merge or deployment.

## Verdict and causal assessment

The test fix addresses a real race and preserves the useful checks. The old test saves a running simulation, then reads a potentially newer body count as its expected restored count. `saveCurrentUniverse()` synchronously saves `snapshotUniverse()`; Gododdin removes ships through `updateWarpSequence()`/`destroyShip()` during subsequent simulation steps. The count sampled after the Save click therefore need not equal the snapshot's count. The reported 29 stored / 25 expected / 29 restored is consistent with successful persistence and an invalid test expectation, not a demonstrated Load defect.

The new test pauses and asserts “Resume” before reading/saving, compares Save's reported count with that expectation, retains Clear-to-zero/empty-inspector and Load-count assertions, then resumes and asserts “Pause” before the remaining construction/control/mobile checks. The animation loop gates simulation on `!app.paused`; reset/restore do not silently unpause it. No existing assertion or timeout was removed or weakened. The patch adds assertions and removes the timing-dependent expectation. It is a valid bounded stabilization of this persistence smoke test, not comprehensive verification of saving a running simulation or all restored object properties.

Only `tests/browser-smoke.mjs` changes executable production-test behavior; `src/` and `public/` are identical to the parent. The additional diagnostic script is review evidence. Source/atlas/browser interaction research was not repeated unnecessarily.

## Evidence availability finding — TL-E01

**Low: the promised builder terminal logs are absent from this exact commit.** `git ls-tree -r HEAD docs/reviews/synchronoptic-timelines/tl10` returns only `smoke-save-diag.mjs`. Checkpoint-10.md says “Logs in tl10/”, but the 2/2 old-head runs, 2/2 earlier-parent runs, 3/3 fixed runs, mutation run and blocked-download terminal logs are not published there. The checkpoint's table and diagnostic excerpt are reported evidence, not individually inspectable run transcripts. `.gitignore` ignores `*.log`; that is a possible explanation, not a verified account of the omission.

Claude: publish the already-produced terminal evidence using tracked text files (or correct the artifact links), including exact commands, versions and exit statuses. Do not rerun a denied download to recreate that evidence. If original logs are unavailable, say so and distinguish fresh runs from the reported history. The independent evidence below is additional verification, not certification of all builder run counts.

## Independent execution

Evidence: [independent-178fd7c](independent-178fd7c/). Fresh exact-head production build; npm format/build/unit/dist checks pass (**126 tests, 121 files**).

- **Unmodified fixed test at exact head: one full pass, exit0**, using `CHROME_PATH=/usr/bin/chromium npm run test:browser`. All subsequent construction, control and 390px mobile checks ran; the suite retains console/page-error and third-party-request assertions. This is independent fallback-browser evidence, not the builder's claimed 3/3 or matched-browser acceptance.
- **Reviewer negative control: fails as intended**, exit1 at the retained 30-second Load-count wait. A scratch copy of the fixed test deletes only the saved localStorage key immediately before clicking Load, without changing app code or weakening/removing any assertions. Port4176 isolates this run. This confirms the test still detects absent persistence; it does not prove every possible restoration defect is detectable.
- **Parent diagnostic on unmodified application head908bab4:** independently ran the published diagnostic copy with only port changed to4175. It stored29 and immediately sampled29, then observed the live count fall to25 and22; Load restored29 (`LOAD OK29`). Thus this run supports the race mechanism but **does not reproduce** the builder's exact sampled25-versus-loaded29 mismatch. Diagnostic logging/extra waits can affect timing; the script is not an unchanged full parent-suite run. The earlier35ca9a2 baseline was not rerun by this reviewer. Builder 2/2 claims remain reported history until original logs are published.

The three browser jobs used isolated ports/contexts and overlapped in time on this shared software-rendered container. Do not interpret their timings as performance measurements or exact replication of the builder machine. No denied network request was retried.

## Environment and remaining gates

Builder-reported environment: Playwright1.62.1 expects Chromium revision1234 / CfT151.0.7922.34. Its download was blocked by proxy HTTP403 for `cdn.playwright.dev`; reported runs instead used explicit `CHROME_PATH` to CfT153.0.8010.12 with SwiftShader. No matched-browser success is claimed. This reviewer did not retry that denied network path.

Reviewer environment: Node24.19.0, Playwright1.62.1 from existing installed dependencies, `/usr/bin/chromium`154.0.8037.57, Linux6.18.57; version output recorded. This is another explicit fallback, not the builder's CfT153 or the expected CfT151. No claim to macOS Chrome, real GPU, physical-device/AT, or execution of main. Both source revisions used in the diagnostic comparison have identical application source; the parent worktree retains its original test/application files.

Exact-head CI reports success at run [41634513506](https://github.com/mckayec/universe-sandbox/actions/runs/41634513506). The workflow runs standalone-page checks, **not `test:browser`**; CI is not evidence for the full smoke suite.

Keep TL-R01–TL-R09 closed within their bounded contracts and preserve every remaining source/record-citation, Standard Works adapter, chapter-enforcement, genealogy/succession/travel/Apocrypha/world-calendar chronology, drag reorder, real-device/AT and release gate. PR33 remains separate. Claude retains implementation ownership. PR46 metadata is intentionally unchanged; no denied metadata retry.
