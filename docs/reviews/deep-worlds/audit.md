# Deep Worlds — current audit checkpoint and Cosmere return review

2026-11-05 America/Denver (2026-11-06 UTC), ChatGPT.

**CB01–CB04 accepted at source/content-data level for PR37 head 60176e78f1272816a0869a5abe8018e884d704f7. The full Deep Worlds audit remains incomplete and is not approved for release.**

Target: [PR37](https://github.com/mckayec/universe-sandbox/pull/37), `atlas/deep-worlds`, open/unmerged. Parent: `9a09dbce1e777d3255e058e11d2b81c53cae8d98`. Cosmere blob: `e77b6e311a4b5d55fca19f5cd8d2ea8cfa4d49e5`; parent blob: `aff59f8d7fa10f5f3476fa72d3cd10b9a2f17045`.

This checkpoint makes the current bounded outcome available on main. Preserve the [historical audit](https://github.com/mckayec/universe-sandbox/blob/a115b6944686121fd63c09770b26f513b0f2c4d1/docs/reviews/deep-worlds/audit.md), [remediation review](https://github.com/mckayec/universe-sandbox/blob/a115b6944686121fd63c09770b26f513b0f2c4d1/docs/reviews/deep-worlds/remediation-review.md), and [210-row ledger reconciliation](https://github.com/mckayec/universe-sandbox/blob/a115b6944686121fd63c09770b26f513b0f2c4d1/docs/reviews/deep-worlds/ledger-reconciliation.md). They remain evidence with their own dates, scope and unresolved claims. The 2026-11-04 Cosmere continuation in HANDOFF_PLAN.md is an additional 23-record comparison, not a replacement for the historical ledger.

## Returned corrections

Read the complete four-file return commit, its implementation §7, exact-head pack/event code and relevant engine paths. Reopened the six author-hosted chapter/epilogue pages below and inspected the relevant passages. This uses source-based web research; no separate Deep Research product was invoked. It is not a full-novel or edition-wide verification.

All rows below refer to `public/atlas/packs/cosmere.js`. “Keep” means no further replacement is needed for the returned text; it does not certify procedural geometry or every other field in the pack.

| ID / object | Current text or anchor | Verdict / exact disposition | Gate | Primary evidence |
| --- | --- | --- | --- | --- |
| CB01 / e6 | “In Luthadel, Kelsier meets Vin and recognizes her as Mistborn.” Title “Kelsier meets Vin”; no `lm`. | Keep. The encounter is in Milev's safehouse; the chapter distinguishes the proposed Clubs meeting location. Removing the Clubs tie is correct. This does not disprove the separate landmark's later-use claim. | Existing key 2, Mistborn grouping | [Mistborn chapter 3](https://www.brandonsanderson.com/blogs/blog/mistborn-chapter-three), safehouse exchange and final identification of Vin |
| CB02 / e77 | “After killing Blushweaver and threatening Llarimar, the plotters obtain Lightsong’s command phrase, change it, and order the Lifeless to march on Idris.” No enclave tie. | Keep. The dungeon confrontation and subsequent command-change/order support this sequence. The correction does not deny earlier violence. | Existing key 3, Warbreaker | [Chapter 53](https://www.brandonsanderson.com/blogs/blog/warbreaker-chapter-fifty-three), dungeon confrontation; [55](https://www.brandonsanderson.com/blogs/blog/warbreaker-chapter-fifty-five), checked/changed phrase and march order |
| CB03 / e15 | “In captivity, Lightsong gives his Breath to heal Susebron, sacrificing himself to restore the God King’s tongue.” No Returned-palaces tie. | Keep. The cage scene and subsequent healed-tongue observation support the narrowed event; the former broad palace-ring anchor was unwarranted. | Existing key 3 | [Chapter 53](https://www.brandonsanderson.com/blogs/blog/warbreaker-chapter-fifty-three), dungeon; [57](https://www.brandonsanderson.com/blogs/blog/warbreaker-chapter-fifty-seven), gift through the bars; [58](https://www.brandonsanderson.com/blogs/blog/warbreaker-chapter-fifty-eight), healing and speech |
| CB04 / e78 | “Susebron uses Awakened cloth to rescue Siri. Vasher entrusts him with the D’Denir army, which is sent after the Lifeless marching on Idris.” No landmark; existing battle effect retained. | Keep as a composite summary. Rescue, command transfer and pursuit are supported. It no longer declares the war already stopped. The Epilogue depicts pursuit and an expectation of success, not a narrated completed victory. Removing the landmark implements the offered composite option. | Existing key 3 | [Chapter 57](https://www.brandonsanderson.com/blogs/blog/warbreaker-chapter-fifty-seven), rescue; [58](https://www.brandonsanderson.com/blogs/blog/warbreaker-chapter-fifty-eight), army entrusted to Susebron; [Epilogue](https://www.brandonsanderson.com/blogs/blog/warbreaker-epilogue), pursuit |

**4/4 core return corrections conform; 4/4 disputed landmark ties removed; 0 new blocking findings in this content delta.** The title's missing terminal period is immaterial. Event IDs, worlds, sites, book keys and effect values remain unchanged.

## Structural and gate verification

Independent string comparison confirms the entire Cosmere pack differs from the parent only in those four event lines; other pack records are unchanged. A local Node VM probe evaluated the actual four old/new event literals and the actual engine `evFor` predicate with unrelated filters eligible:

- 4/4 events preserve identity, world, site, book and effect fields, with no `lm` property.
- 8/8 at/below-gate cases behave as expected: each absent one key below its gate and present at its gate.
- Source inspection of `placeDossier` confirms landmark event lists match `e.lm`; `evInPlace` takes overview/no-landmark focus for these records.

These are data/predicate tests, not rendered site-panel, tour, keyboard or deep-link acceptance. Claude's committed `cb/cb-probe.mjs` and output report 56/56 assertions at each of 1440×900 and 390×844; that remains attributed browser evidence, not my own browser execution. Existing DWR-B delayed event-continuation risk is not cured by a static at/below-gate test.

Independently fetched [CI 41809326448](https://github.com/mckayec/universe-sandbox/actions/runs/41809326448), job metadata and [logs](https://github.com/mckayec/universe-sandbox/actions/runs/41809326448/job/126504304854). Actual checkout was synthetic merge `efa8a8e94707dcd8825c2e46fca3b52677a54e40`, merging the reviewed head into `c695c5eaacfb6398b22bc11b0dadce0be65d4148`. Its comparison to the PR head contains documentation/coordination changes and two root HTML files; the reviewed pack, public engine, tests and workflow are unchanged. Logs show formatting/build, 89/89 unit tests, 173-file distribution validation and 24/24 standalone page/viewport cases passed; deploy skipped.

**CI does not run `test:browser`.** Implementation §7's claim that new-head PR CI is the authority for that separate Save/Load smoke result is inaccurate. Keep its reported flaky failure and baseline comparison separate until technically dispositioned. This does not reopen the four content repairs.

## Optional clarifications decided

These are two nonblocking refinements, not two additional core failures:

- **e14:** prefer removing `lm: "markets"` while retaining site `ttelir`, key 3 and current broad city-arc copy. That broad summary does not itself justify one market location. This is conservative removal of precision, not a new passage-based claim that Vivenna never visits a market.
- **e16:** replace the ambiguous single-war wording with: **“Vasher and Nightblood work to prevent a new war between Hallandren and Idris; Vasher’s past is tied to the earlier Manywar.”** Retain site `ttelir`, key 3 and no landmark. Chapter 58 and the Epilogue distinguish the new threatened conflict from Vasher's earlier history. This is optional clarity, not a claim that the Manywar connection is false.

## Remaining work and precise continuation

Stage remains **content-review / chatgpt**, because the requested full source audit is incomplete. Completed CB01–CB04 should not be researched or implemented again unless their content changes.

1. **Claude can continue the already-issued DWR-A/B fixes:** retain/cancel/guard the Society EMP timer by generation and active instance; invalidate delayed place-entry/event continuations and recheck event eligibility plus destination before applying effects. The return commit changes neither affected engine nor Society source, so both existing blockers carry forward. Return a new exact head and positive/negative controls. This is not a new duplicate finding.
2. **ChatGPT next source unit:** reconcile the 2026-11-04 23-record Cosmere supplement into a separate current-evidence crosswalk keyed to historical SM41/185/190/195/205/206 plus the Nalthis records. Preserve partial, commentary-assisted and unsupported geometry distinctions. This four-event return review is a recheck of that supplement's corrections, not four extra newly covered records.
3. Keep all remaining DW06 passage/omission questions open, including retained Expanse/Medina/Ceres claims, Sun Eater dates, Hyperion journeys, Foundation narratives, Dune later episodes and Society prologue/early-Europa details.
4. The October 30 ledger mapped 210 historical rows to 206 surviving records, with 198 then historically uncompared survivors and four deleted landmarks. Those are dated baseline counts: do not report 198 as a fresh current-unverified total after the November 4 supplement. Four replacement landmark samples are still needed before a current-population 20-per-pack claim; source comparison and geometry remain separate requirements.
5. Finish exact-head rendered/tour/deep-link/downgrade and technical/device evidence after fixes. None of this authorizes merge, deploy or owner release approval.

**Verdict: accept CB01–CB04 at the stated source/content-data scope; retain Deep Worlds' incomplete canon audit, DWR-A/B blockers and all technical/owner-release gates.**
