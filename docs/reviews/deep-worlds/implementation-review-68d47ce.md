# Society disposition implementation review — 68d47ce

2026-11-09, ChatGPT. PR [#37](https://github.com/mckayec/universe-sandbox/pull/37), `atlas/deep-worlds`.

**Accept 3/3 bounded implementation units at source/VM scope: flood A amended, Tyche V minimum, and Europa VI name boundary. Canon: not approved.** No new application defect was established in this delta. Full canon coverage and the existing technical gates remain incomplete.

## Exact revision and inputs

- Audited head: `68d47cebf40b37c345a37cb8b0080590c52a0339`.
- Parent: `2f04e416696f0fe32ab5eca7be5d8b578cd129cd`.
- Society head blob: `c002eae9f01eacf8655e20a368217743d5d8f5f9` (1,206,501 bytes).
- Parent Society blob: `fd3b2d14eb2457fef933b8925e9a4888b3e57d34` (1,205,862 bytes).
- Instructions: [disposition-review-2f04e41.md](disposition-review-2f04e41.md), blob `599f9e417e50a577b0ea1cb1d1de245126b19827`.
- Builder return: [fix-return-68d47ce.md](fix-return-68d47ce.md), blob `e1e6f6c316825505bae2996c3ebdf7b67e7c68b4`; checkpoint, supplied patch, probe scripts and their output were inspected.
- Branch `implementation.md`: blob `0927ce8e199838b37cdf292ed146289f92cf8feb`. Its old gate/coverage prose is historical; the corrections below control.

Read the actual GitHub commit diff and downloaded both complete Society blobs, verifying their Git blob hashes locally. **1/1 changed application files inspected; 1/1 whole-file patch reconstructions match exactly: +22/−19.** The committed patch agrees with GitHub's actual delta. No engine or other pack change occurs in this commit; earlier bounded closures remain carried at their original scope.

## Implementation disposition

All line numbers refer to head `public/atlas/society.js`.

| Unit / selectors | Verdict | Evidence and retained limit |
| --- | --- | --- |
| F1–F2, lines 215/258/4786/4849 | Accepted | d8 retains V, harbor and flood references, removes horizon-four/master-override/mortality claims and includes its provisional sentence. The banner subtitle also carries uncertainty. Both effect registrations survive. This does not verify the retained narrative against the novel. |
| F3–F5, 3902/4019–4020/9039 | Accepted | V and VI blurbs match the disposition; the late note qualifies flood extent/height. The actual update expression no longer forces flooding at VI. In a 600-frame, 1/60-second VM simulation without the amplifier, fresh VI remains y=-6; parent rises to about 141.43. Explicit on raises water at both V and VI. These are numerical state checks, not visual water-height or performance evidence. |
| F6–F9, 104/3529/8047/3890/9038 | Accepted | Mercury, Helios and tour copies lose the unqualified drowning assertion. Ladon/hypercane wording remains. The actual Book V tour has six steps; its Tyche step and harbor target survive. |
| T, 415/8963 and admission paths 7738–7741 | Accepted | Pin and site require V. Actual entry function refuses IV and rechecks eligibility inside the deferred callback. V schedules entry. The gate is a conservative display boundary, not a proven first mention. |
| E1–E5, 420/6423–6426/9017–9022 | Accepted | Discordia and Harmonia pins require VI. Effective II/V epithet, blurb, facts and eligible landmark descriptions contain neither name; VI retains names and full bibliography. Sea is hidden before VI; seagate/villa use neutral early variants. Earlier overwritten registrations are not evidence of a live leak. |
| E6, 9432/9435–9436/9444 | Accepted | Executing the actual globe-popup callback expression and the actual landmark text selection yields the same neutral early text and named VI text. This checks both consumers at source/VM level, not their rendered click targets. Kalibar/Cyraxes/age claims remain outside this unit. |

## Independent validation

[disposition-review-probe-68d47ce.cjs](disposition-review-probe-68d47ce.cjs) and [output](disposition-review-output-68d47ce.txt):

- Head **35/35 pass**; parent **16/35 pass, 19/35 fail** against the new requirements. Parent failures are the expected discrimination, not an unexpected test crash.
- Coverage: F1–F9 text/dependency checks; Tyche pin/site boundaries at I/IV/V/VI; Europa effective text, pins, sea, bibliography and both leviathan consumers at II/V/VI; actual flood-state update with and without the fast-test hook; direct and deferred Tyche admission.
- Uses exact source slices and actual predicates. Geometry, renderer, DOM layout, scene building and timing are not executed. Landmark positions are intentionally excluded.
- Society has no `pushState`, `replaceState`, `popstate` or `hashchange` router in this file. Its hash is processed once at startup after selecting Book I; `#tyche` is ineligible there. Do not claim a Society in-page history test from the galactic engine's separate history probes. Browser Back/Forward and crumb rendering remain untested here.

Browser execution was attempted: default Playwright launch failed because its Chromium headless-shell executable is absent; system `/usr/bin/chromium` then failed before page creation with `socket() failed: Operation not permitted (1)`. **0 independent rendered cases.** This is a reviewer execution limit, not an application failure and not a reason to repeat previously accepted unrelated navigation tests.

GitHub [run 42643728577](https://github.com/mckayec/universe-sandbox/actions/runs/42643728577) associates the head with a successful build check and skipped deployment. Job metadata lists successful format/build/test/dist/subpath-page steps. Raw logs and the synthetic checkout tree were not inspected in this review; the **125/125** count remains builder-attributed, not independently rerun or inferred from green metadata. No `test:browser` result is inferred.

## Evidence corrections and qualifications

| Item | Accurate disposition |
| --- | --- |
| Phone main-probe count | `dwd-probe-output-68d47ce-390.txt` contains **25 rows = 22 PASS + 3 FAIL**, not 29/26. The three failures are manual toggle, explicit VI rise and stale exit. Later focused logs address those cases; preserve the failed original, do not relabel it an all-pass run. |
| Desktop flood log | **11 rows = 10 PASS + 1 FAIL**; the first seven amplified-page rows pass. The stale failure is replaced by the separate fresh-browser stale log, **4/4**, not erased. Phone flood is **11/11** and separate phone stale is **4/4**. These overlap; do not sum them into unique scenario coverage. |
| Tour count | `TOURS.book5.steps.length` is **6**, not the checkpoint's “9 steps total in the block.” The retained Tyche step is one of those six. |
| Gate report | Branch implementation §3 still says Tyche IV and gate unchanged. Superseded: this head sets Tyche V. Reconcile the current builder report on main; no application change is needed. |
| “Anywhere rendered” claim | The supplied regex checks particular old drowning strings, not all possible unqualified text. The finite F1–F9 source review supports those selectors only. |
| Popup/history coverage | The supplied “shared LEV_TEXT” row reads the site landmark; its globe loop makes no popup assertion. Independent VM now checks the popup callback text, but rendered popup interaction and browser history were not established. |
| Stale-exit timing | Builder logs show eventual exit after **33,533 ms at 1440** and **18,660 ms at 390**, using DOM-click fallback. This is not proof of responsive interaction. SwiftShader/contention is the builder's diagnosis, not an independently measured real-GPU result. |
| Amplified sea checks | `__floodH=43000` and `__atlasFast` alter observation behavior. The VM check above also tests the normal update expression, but neither establishes production rendering or physical-device performance. |

These are documentation/evidence-scope corrections; they do not reopen the three accepted implementation units. No new primary book passages were opened: **0/6 legacy Society rows newly primary-verified**. The preceding source-access record remains historical and is not recounted as fresh research. The separate Deep Research product was not invoked.

## Precise continuation

Hand to **fixing / claude** for the existing finite technical return:

1. Resolve or explicitly evidence **DWO-S1** (stale removed Sphinx site state) at the current head, preserving earlier lifecycle closures and the DWT-03-R1 tree-integration trigger. Return a sensitive positive/negative case; do not repeat unrelated completed navigation work.
2. Run the final-head Society spoiler suite and required four-viewport evidence at **3840×2160, 1440×900, 1280×800, 390×844**, with actual passed/failed/not-run counts. Include the retained new flood/gate behavior and rendered leviathan popup/landmark checks in that existing technical unit; do not claim them covered solely by these VM rows.
3. Reconcile the three report errors above (25 phone assertions, six tour steps, Tyche V) in the current documentation. Carry software-renderer timing and physical-device limits honestly. Return exact head plus a consolidated unresolved-gate list before any final-audit transition.

The **139 unselected records**, remaining DW06/full Society source coverage and broader canon audit remain uncertified; the source work stays capped/deferred under R3. Completed omissions, prior accepted narrowings and this qualified flood disposition do not establish whole-pack canon approval. Do not request another open-ended source hunt or repeat this accepted batch unchanged.

All **18/18 pack** and **8/8 review** statuses were inspected. All three research-ready folders remain unchanged against the completed audit baseline; their statuses/history were not modified. No new Mckay decision is required for this technical handoff.

**Canon: not approved. No final technical sign-off, ready-for-owner transition, release approval, PR approval, merge or deployment.**
