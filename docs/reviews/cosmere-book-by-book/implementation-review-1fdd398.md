# EL-PORT-R1 implementation review — 1fdd398

2026-11-21 · ChatGPT · PR48 `feature/cosmere-reading-state`, exact head **1fdd398a7ac936d21e11ddb9da8de65a895aac9b**, actual sole parent **bfaab6b873a493150f090c3cfbb25202c4cf626a**.

**EL-PORT-R1 closed at source/function-test scope, 1/1.** EL-PORT-03's finite world-only navigation repair is accepted at that level. Supplied surface screenshots corroborate the shown end states; fresh independent browser interaction, full technical/rendered acceptance, whole-PR canon and release approval remain unclaimed.

## Inputs and actual change

Read [prior finding](implementation-review-bfaab6b.md) (blob e5a98b87fce8461680b1abc7b062c908643707b8), [Claude return](elport-r1-return-1fdd398.md) (455d99bd6eb9198ab6be7fac8f46b783ed82d5a6), and [surface probe](elport-r1-surface-probe.mjs) (67527301423dac0b412a7825a5a9feff84fe1f13). Independently fetched the commit and all **3/3 incremental changed files**. GitHub's actual diff is engine **+8/-2**, existing test +1, new test +182, total +191/-2; the return's engine +10/-2 wording overcounts additions by two, without changing its described behavior.

| Input | Blob SHA |
| --- | --- |
| Head engine.js | 7c2daaa7bc159e88b6aec6157019780baa7bf209 |
| Actual-parent engine.js | 0bc5357a2043f3939512bc5b091eb4ffbbf1c5d0 |
| cosmere.js, unchanged | 0ec8d80d4b9e184dafbc6461867fb9be54c6c631 |
| reading.js, unchanged | 4d9bc177294e5e33accf6f19825ef467f0bb90d4 |
| atlas-el-port-r1.test.ts | 37ea9ae13544f075f6c007ec5baed7566f19603a |
| atlas-el-port-02-05.test.ts | 1df376eda825998da35adddcbae3b16cf7533423 |

At engine lines1485–1495, travel increments NAVG; same-world unpinned travel clears a selected site through selectSite(null). Non-travel expansion keeps its behavior. At lines1023–1024, laterSite captures both reading generation and a new navigation generation, dropping superseded callbacks. The existing RGEN test remains in the condition. Actual selectSite calls renderDossier, renderCrumbs and syncURL; actual layoutSiteLabels derives its selected class from S.site. The pack and reading helper blobs equal the previously reviewed inputs, so the five accepted data operations, EL01 omission and existing gates are preserved.

## Independently executed checks

Ran the fetched tests with Node24.22.3, adapting only file URLs to isolated copies of exact GitHub inputs. **9/9 focused tests pass**: the five R1 tests and four prior portability tests. This is actual selected engine-function execution with inert DOM/scene dependencies, not a complete engine/browser run.

Coverage includes:
- e4 from null/chasm/kae on Sel's surface: **3/3** end with null site and Sel-ending breadcrumb; the two initially selected cases invoke the URL-sync stub with null.
- Pinned e2/e5, same-world and cross-world: **4/4** retain destinations; non-travel e4 **1/1** retains Chasm.
- Other-surface and galaxy e4 entry: **2/2** retain the requested world-only result in the harness.
- Pending e2 and direct laterSite callbacks are cancelled by e4 travel; changed RGEN drops a callback; a newer laterSite supersedes an older one. An uninterrupted e2 callback remains a control.

**Actual-parent negative control:** reran the five R1 tests against separately fetched parent engine. Changed the extraction start from `var NAVG=0;` to `function laterSite(` solely because the parent has no NAVG declaration. No engine behavior was patched. Result: **3/5 pass, 2/5 fail behaviorally**: selected Chasm survives e4 and queued Kae returns after e4. This resolves the return's extraction-only negative-control limitation. Group failure short-circuits later assertions; it is not a count of every failing subcase.

The four older portability tests retain their synthesized-parent limitation. They do not independently establish historical pack equality; this review instead relies on the unchanged pack blob and the separately documented actual-parent comparison in the prior review. No new source research or full-book reading was needed or claimed.

## Surface evidence and precise limits

Independently fetched and visually inspected **2/2** supplied JPEGs:
- desktop1440x900 blob **9074632453f5a959bca17a6533df1e341445e096**: Sel surface, breadcrumb ending at Sel, unhighlighted Chasm label, expanded e4 with narrowed text.
- phone390x844 blob **7e83491cb0c510e06ef44a41190da48c43eb11e9**: Sel world dossier, “on the surface”; no place dossier is shown. The expanded e4 text and URL are not visible in this image.

These images corroborate their visible end states, not the preceding clicks, every asserted DOM state or exact executable provenance independently. The desktop image uses the disclosed reduced-resolution __HD=256 hook; neither image establishes 4K quality or physical-device performance.

The supplied probe's **16/16** remains builder-executed. Its six principal cases check event, site, world/view, breadcrumb and URL; six cases check errors; four are controls. It collects selLabels but does **not assert** that the collection is empty. Thus “no highlighted place” is not part of its automated pass denominator; the desktop image and inspected layoutSiteLabels condition provide separate limited evidence. No new code defect follows from that test-accounting limitation.

Independent Chromium launch was attempted with /usr/bin/chromium and Playwright. It failed before page navigation with `process_singleton_posix.cc:297: socket() failed: Operation not permitted (1)`. **0 fresh browser cases** executed; no claim of a missing executable. No bypass or escalation attempted.

At this PR48 head, inspected index.html, engine.js and cosmere.js expose the actual chronicle listener at engine1222 calling openEvent(id,true), but no tourList/tour runner. Direct laterSite tests are delayed-callback tests, not a rendered tour test. PR37's separate tour machinery is outside this incremental PR48 audit. Do not import its acceptance automatically. Back/Forward after this change remains unprobed.

## CI and disposition

Independently opened exact-head [Actions44916443287](https://github.com/mckayec/universe-sandbox/actions/runs/44916443287), job136882960247. Format, build, test, check:dist and standalone-pages steps succeeded **5/5**; deploy skipped. CI has no test:browser step. Full-suite686/686, dist115 and pages12×2 counts remain builder-reported, not locally rerun. The inherited Save/Load timeout at browser-smoke.mjs:88 remains unresolved; successful CI/pages do not close it.

No new implementation finding. Preserve all accepted finite corrections. The bounded seven original Elantris correction units now have their applicable PR48 ports or preserved target absences, with R1's execution limits above; this does not close EL08, map/parent/gate or full-book holds.

Continue **research/chatgpt** only for a finite reconciliation of already documented EL08-A–E dispositions against current PR48 and PR37, using the saved source/gate holds and return records. Identify an exact portability handoff if warranted; do not reopen capped full-book research, infer source truth from omissions, or edit the Mckay-owned PR24/PR37 review statuses. Record remaining technical/source limits separately. Ledger stays28 deferred/5 partial, **0/33 full-work approvals**. FD01 stays deferred2/2 and HO01 addition stays held.

All18/18 pack and8/8 review statuses inspected. No eligible research-ready/Claude self-audit or new queue slot. Agreement remains unchanged. No application/PR-branch edit, merge, deployment or approval on Mckay's behalf.
