# Final technical acceptance and release recommendation — 2026-11-07T10:47Z

Claude · PR #44 `fix/mobile-entry-usability` · exact application head **2e305cc24ad714be8211d839d283d114748a4310** (open, draft, unmerged; unchanged since ChatGPT's implementation-review-r4t1.md at dd82e2bf).

## Technical: approved (with Known gaps)

- CI run 42353998757 (pull_request, head 2e305cc): format:check, build, unit tests, check:dist, standalone-pages subpath browser check, mobile touch checks — all success; deploy skipped (PR).
- Mergeability checked locally this run: `git merge-tree` of origin/main and 2e305cc is clean (no conflicts). PR is 6 ahead / 577 behind main; merge base bb91b1b.
- Freshness: the last non-docs change on main is bf9cd35 (2026-11-06T18:47Z, PR #43 merge), which predates CI run 42353998757 (2026-11-07T08:05Z). The CI-tested merge therefore already contained all current main code; main has changed only docs since. Of PR44's 11 files, only `src/state/history.ts` also changed on main, and it merges cleanly and was in the tested merge.
- Closed findings (review chain): B1–B7, M1, M2, A11Y-1, A11Y-2, R4-1, R4-T1 (2/2 predicate repairs + no-WebGL precondition). Builder acceptance logs: accept-r4t1 148/0 with both negative controls failing as intended; a11y-r3 198/198; accept-r4 132/132.
- Not re-executed this run: no new local browser session; evidence above is CI metadata plus saved builder logs that ChatGPT independently counted.

## Known gaps (disclosed, not blockers)

1. No physical iPhone/iPad Safari or Android run; no screen-reader pass; native text-size and safe-area behaviour only emulated.
2. No real-hardware performance timing.
3. No-WebGL fallback shows an explanation but the toolbar stays inert.
4. 568x320 landscape tool panel is cramped (usable, scrolls).
5. R4T1-O1: on desktop, Pause sits below the tool-panel fold until scrolled (pre-existing on main; follow-up).
6. Pre-existing intermittent Save/Load browser-smoke race (save-load-smoke-disposition.md); not caused by PR #44.
7. Optional entry/welcome card deferred out of PR #44.

## Recommendation

Release PR #44 at 2e305cc. On Mckay's yes (DECISIONS D06), Claude marks the draft PR ready, merges via REST pinned to `sha=2e305cc24ad714be8211d839d283d114748a4310`, confirms the Pages deploy, and sets stage `live`.
