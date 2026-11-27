# SA02-L23-PORT implementation review — 97ebc3d

ChatGPT, 2026-11-20 UTC. **Accept 1/1 finite content correction at source/test level.** Surface rendering remains unverified; this is not full SA02 canon approval or PR48 release approval.

## Exact target and scope

PR48 `feature/cosmere-reading-state`: `97ebc3d1c4d0f7e21d486dc2afdac842e4dc19fb`.
Actual parent: `af49e0ab7f32626791d11a2f573dd7b4f074f654`.
Read [handoff](sa02-final-handoff-2026-11-20.md) and [Claude's return](sa02l23-return-97ebc3d.md), current status and actual GitHub PR diff. The cumulative PR has 22 changed files; this incremental commit has **2/2 files examined**: cosmere.js and tests/atlas-sa02-l23.test.ts. Prior accepted work is not re-approved wholesale.

The only pack change is removal of events.e24.site and replacement of its text with the exact qualified palace account. id, book 5, world roshar, title, event ordering and the rest of the parsed pack are unchanged. No landmark, coordinate, new palace, mapping or parent gate was added.

| Input | Verified Git blob |
| --- | --- |
| head cosmere.js | ebe9c3948fe288723aac8093e9fc5eabbee65f91 |
| actual-parent cosmere.js | 00d8ac461d4299205cb8df883fa557dbd534cbd5 |
| engine.js | 0bc5357a2043f3939512bc5b091eb4ffbbf1c5d0 |
| reading.js | 4d9bc177294e5e33accf6f19825ef467f0bb90d4 |
| builder focused test | 0708fb669ccf15b374b66205971bc24fde095169 |

**5/5 input hashes independently verified** after fresh GitHub reads.

## Independent checks

[Reviewer adaptation](reviewer-sa02-97ebc3d.ts) uses the separately fetched actual parent rather than reconstructing it from the candidate. Place the five snapshots above beside the runner as head.js, parent.js, engine.js, reading.js and test.ts; run with Node 24 or newer.

- **3/3 focused tests passed**, Node v24.22.3: full-pack difference confinement, actual-engine event visibility, actual openEvent travel-branch control.
- **12/12 visibility states** match the actual parent for all Roshar events. e24 is visible in All, legacy book 5, legacy book 10 and WoK+WoR; withheld in the remaining tested states. WoR alone remains blocked by the existing Roshar parent requirement. This is unchanged behavior, not new source approval.
- Before adding the travel test, the two-test runner with NEGATIVE=1 (actual parent as candidate) gave **1 pass / 1 expected failure**: payload fails on the old Narak pin/text, visibility still passes.
- **6/6 branch cases** passed: same-world surface travel, different-world registry travel and different-world legacy travel, each with head and parent. Executed the actual extracted openEvent function with instrumented external calls. The head requests no site; the parent requests Narak. These are logic checks with stubbed rendering/navigation dependencies, **not rendered browser tests**. They establish that e24 no longer requests a Narak jump; they do not prove clearing an already selected site or validate surface layout.
- No new independent full-suite, browser or physical-device execution is claimed.

Exact-head GitHub Actions run [44665173792](https://github.com/mckayec/universe-sandbox/actions/runs/44665173792), job 136052597392: independently read successful format, build, test, check:dist and subpath-page steps. Deployment skipped. Claude's 646/646 suite and 115 dist-file counts remain attributed to the return; this review checked step outcomes rather than independently rerunning the whole suite.

## Rendered evidence and limitations

Read the actual [probe](sa02l23-probe.mjs), [head log](sa02l23-rendered-head.txt) and [negative log](sa02l23-rendered-negative-af49e0a.txt).
Head log contains **120/120 passing assertions**, zero failures. Negative log contains **36 failure lines**, matching its reported 84 pass / 36 fail total; its passing assertions were not printed individually. The failures concern new text, place-label removal and obsolete-copy absence.

The probe covers 1440x900 and 390x844, allowed WoK+WoR/legacy-5/All and withheld WoK/WoR/legacy-4. It opens the dossier by actual click/tap. Phone Chronicle selection uses a dispatched DOM click because a sheet overlaps that item. This does not establish successful physical tapping of that Chronicle target.

Both probed selection paths start in galaxy view. Their S.site-null assertion also passed on the incorrect parent, so that assertion is **not an effective negative control for the old surface jump**. The independent six-case logic test above addresses branch dispatch only. **0 independent rendered cases; 0/6 screenshots inspected in this review.** Builder screenshots and 120/120 are attributed evidence, not independent visual verification.

The requested surface-view rendering remains unavailable. Accept the narrow content repair because exact data comparison and discriminating branch controls establish removal of the erroneous request; carry surface rendering as an explicit outstanding technical check before broader release acceptance. Do not label that requirement passed.

Claude reports **2/2 Save/Load smoke attempts failed** at browser-smoke.mjs:88. CI's subpath-page success does not close that separate failure. Preserve it as open, without assigning causation to this two-field content repair.

## Finding disposition and continuation

| ID | Disposition | Remaining boundary |
| --- | --- | --- |
| SA02-L23-PORT | Accepted: exact qualified text and erroneous Narak attachment removal independently verified at the named head. | Palace location remains secondary-supported and visibly provisional; no complete novel-scene or edition verification. |

The source judgment remains the bounded one in the saved handoff: reproduced oath/protection text, secondary location support, deleted material excluded. This implementation review performs no new full-scene research and does not upgrade the palace to primary-confirmed geography.

Full SA02 remains deferred at 2/2 research checkpoints, with **0/4 complete book-5 events, 0/2 complete selected sites, 0/33 full-work approvals**. Keep e22/e23/e25, PR37-only events/landmarks, parent metadata, CS01 removal, prior SA01/NA01 closures, D09/D10 and all technical/release holds unchanged.

Transition implementation-review/chatgpt to research/chatgpt. Next bounded unit: **SA03 / Edgedancer**; inventory actual relevant records across current PR48/24/37, open lawful primary material, distinguish anthology/bucket membership from the individual work, and keep incomplete research at research/chatgpt with a precise checkpoint. Newly owned final/content/implementation audits retain priority.

Checked **18/18 pack and 8/8 review statuses** on current main; no other owned work or eligible stale parallel self-audit. Agreement active with both signatures; unchanged. No code/PR-branch edits, merge, deploy or Mckay release approval.
