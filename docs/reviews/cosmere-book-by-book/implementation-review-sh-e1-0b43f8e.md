# SH-E1 evidence review at unchanged 0b43f8e

ChatGPT, 2026-11-17T02:19Z.

**SH-E1 closed at bounded evidence-review scope.** The SH-D1–03 omission package is accepted at the audited revision with the limits below. This is not whole-book canon approval, final technical approval or release approval.

## Revision and evidence

PR48 `feature/cosmere-reading-state`: **0b43f8ee562b232387e9342d00985c91df9663fb**. Fresh PR read matches the earlier reviewed head; GitHub compare reports identical, **0 changed files / 0 commits** since that review. Fresh fetched engine blob **0bc5357a2043f3939512bc5b091eb4ffbbf1c5d0** and pack blob **a5dec3452a855e4680fb4b604b0ff6274528f906** match the prior accepted inputs. No new application change is claimed.

Read [earlier review](implementation-review-0b43f8e.md), [Claude's evidence return](sh-e1-surface-return-0b43f8e.md), the complete [new probe](sh-surface-probe.mjs), and all three output logs. These are supplemental main-branch evidence files; they do not change the PR.

| Evidence | Git blob | Finding |
| --- | --- | --- |
| Surface probe | 60bdf0e3783200e5a6f9c88b43078c9162651c5e | Readiness now requires matching view/selection/realm/planet, nonempty completed uncancelled jobs, expected HD texture dimensions, and hidden loading indicator. |
| Default log | 02e7b5c311d07791539931979cd5a7e272769dd0 | Builder reports 12/12 assertions and 2/2 completed cases: 4096×2048 desktop, 2048×1024 phone. |
| Diagnostic log | d71908b745dffc955659c83997cd8fe6b59c7712 | Builder reports 12/12 assertions and 2/2 completed cases at disclosed 256×128; not substituted for default mode. |
| Timeout log | cb4f4caadfe0975f7a4ab7cb5f9d96cdc87b1d0c | 0/2 complete, 2/2 incomplete; pass 0, preview texture and visible loading indicator. |

## Why the finding closes

I checked the predicate against the exact engine: `bakeStep` increments through pass 2 before invoking the completion callback (line 824); the callback applies HD textures (lines 895–901); descent controls the loading indicator (lines 1457–1459). Merely assigning PL is no longer sufficient. The new probe waits 30 further animation frames, rechecks readiness, and reads material uniforms before capture. Its final exit condition rejects incomplete cases as well as failed assertions. Brightness is correctly report-only, not a substitute for readiness.

The claimed five-second negative deadline is a polling budget rather than a guaranteed wall-clock cutoff: the desktop snapshot is at 8.6 seconds, the phone at 5.3. Both are correctly recorded incomplete. This timing qualification does not invalidate the negative control.

I independently executed [reviewer-sh-e1-readiness.cjs](reviewer-sh-e1-readiness.cjs) in Node: **19/19 checks pass**. It uses the fetched predicate and recorded snapshots: **6/6** completed/incomplete classifications, **3/3** expected summary exit decisions, and **10/10** mutations rejected (wrong view, selection, realm or planet; empty/unfinished/cancelled jobs; wrong texture width/height; visible loading indicator). This is independent predicate validation against supplied data, **not independent browser or GPU execution**.

Directly inspected **5/5 supplied new images**:
- [Default desktop](shots/sh-surface-default-1440x900.png), blob 054a3675cace425af7f69c1d4998eb642432d22c.
- [Default phone](shots/sh-surface-default-390x844.png), blob 32ba284e78725b878f0f808739760f65fd1eaa21.
- [Diagnostic desktop](shots/sh-surface-diag-1440x900.png), blob c228facc96a6022a0a0d250187aa9af6164f4c4e.
- [Diagnostic phone](shots/sh-surface-diag-390x844.png), blob 347f9cc54eb3eed4effffcbb976da27019393a07.
- [Incomplete desktop](shots/sh-surface-default-1440x900-INCOMPLETE.png), blob 971784365c75241f5b2e7aadab2eb8895c93d533.

All four completion images lack the loading bar; the negative image retains it. The surfaces are dark violet with lighter patches, consistent with the unchanged generic material; the desktop neutral card remains visible. Phone descent collapses the dossier, so that image does not prove phone text readability; the earlier expanded-dossier evidence remains applicable. The supplied images are quantized, not raw colorimetric evidence. Site-label overlap visible on the phone is not certified as a general layout pass by this focused closure.

**2/2 required default-resolution captures now have mutually consistent readiness logs, inspected probe logic and inspected images.** This independently reviewed evidence closes the earlier missing-evidence finding. Builder execution, timings and absence of console errors remain attributed to Claude; **0 independent browser cases** were executed here. Physical devices and real-GPU performance remain unverified.

## Preserved acceptance and limits

- SH-D1–03 **3/3** payload/selector acceptances stand. The earlier independently executed **476/476 focused tests** are carried evidence, not rerun this time; unchanged application inputs did not justify repeating them.
- The reported browser-smoke failure at `tests/browser-smoke.mjs:88` remains unresolved for this branch. No fresh full suite, page suite, CI log audit or browser-smoke execution occurred here. SH-E1 closure is not a blanket technical pass, and PR47's repair is not imported or assumed.
- Preserve CBR closures, accepted MB01/MB05/MB10 changes, **0/2 whole-parent promotions**, **0/33 full-work approvals**, and all earlier source/geometry/gate holds. Global Cognitive text/look, opening threshold, other subastral names, perpendicularities and the retained row's geometry/`first:7` are not newly certified.
- MB09 remains deferred: **0/2 missing witnesses obtained; 0/1 complete old Cognitive blurb certified**. No new source search or Deep Research product invocation occurred.

## Continuation checkpoint

Route to **content-review/chatgpt**, not ready-for-owner. Next bounded unit: inventory the five remaining unmapped PR48 key-2 events **e7–e11** and their parent gates at the current exact head, reconcile the prior key2 dispositions and accepted e6/e12, then produce a source-backed correction/omission packet for one finite event group under the two-run research cap. Repository inspection here confirms the five rows still lack their own per-work gates; that is not a new assertion that their text is false, nor permission to relax parent gates. Preserve the **2/7** mapped-event count until actual new mappings are reviewed. Do not restart the deferred MB09 access search or silently promote parent scope.

Intake checked **18/18 pack statuses and 8/8 review statuses** on main. No other eligible owned item or stale research-ready/claude self-audit was found. Active agreement and both sign-offs unchanged; WIP prevents new universe activation. No application or PR-branch edit, merge, deployment or Mckay release approval.
