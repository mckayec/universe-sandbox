# Standard Works — final-audit checkpoint 66

2026-11-06 UTC · ChatGPT.

**RES64-C1 and RES64-C2 are closed: 2/2 requested wording corrections accepted. Full canon approval remains withheld at the existing completeness/final-audit boundary.**

Audited [PR33](https://github.com/mckayec/universe-sandbox/pull/33), branch `pack/lds-standard-works`, exact head **e2c02e49d8f77d020d5e0d1f8ddd30b2fab98d25**, against parent **a3d5cc4de273be0590567cde45461b5ebc30fc53**. This is the narrow two-replacement return explicitly requested in status.md. The [previous return review](return-review-a3d5cc4.md) and its accepted structural/editorial decisions remain intact; this checkpoint does not restart that residual batch.

## Changed claims and source decisions

Reopened both official chapter bodies on 2026-11-06 and checked the two changed assertions. These are textual-source decisions, not independent historical verification.

| Finding | Card | Result |
| --- | --- | --- |
| RES64-C1 | BMV-008-lehi-dream-tree | Closed. The generated description now says the text does not identify the dream's river as the river Laman. This retains uncertainty rather than asserting definite nonidentity. [1 Nephi 8:13–20](https://www.churchofjesuschrist.org/study/scriptures/bofm/1-ne/8?lang=eng). |
| RES64-C2 | BMV-223-omer-dream-emer-sight | Closed. The description distinguishes Emer's four remaining years after appointing Coriantum from the narrated sight, peace and death, without fixing the sight at the four-year endpoint. Omer's separate warning and the no-date/no-location qualification remain. [Ether 9:3,21–22](https://www.churchofjesuschrist.org/study/scriptures/bofm/ether/9?lang=eng). |

Both replacements match the prior review's requested text in the generator and generated pack. **2/2 findings closed; 0 new findings; 2/2 requested changed claims checked against primary text.** These counts are not whole-atlas verification.

## Actual change and preservation checks

Read the actual four-file commit diff, the complete exact-head generator, pack and changed test, plus the builder's checkpoint-66 evidence. The four changed files are the generator, generated pack, regression test and supplementary implementation report. CSVs and engine files are unchanged.

The fetched pack's Git blob hash was independently reproduced as **9e0f93eac67efa34598a9d2c9481635e6519e172**. The prior pack matched **f3375f2b64b9936d271f190c4607ff90ac86dc78**. Evaluating both complete packs and comparing their data found **exactly two changed leaves**, both `desc`:
- `codex[6].list[116]`: BMV-008-lehi-dream-tree.
- `codex[6].list[123]`: BMV-223-omer-dream-emer-sight.

All remaining evaluated pack data are equal, including identifiers, gates, sources, links and spatial/time fields. The generator blob is **cbc591922b5f438494daffa630efa712605ac4b2**; the changed test blob is **2f0da714072f76745a4d6562f1611e94cceb2f5a**. This review did not independently regenerate the complete build; the builder's idempotence claim remains attributed.

## Independent validation

Executed with Node v24.22.1 against the fetched exact-head pack/test and unchanged dependencies:

```sh
node --test tests/lds-res96c.test.ts tests/lds-res96.test.ts tests/lds-mat61.test.ts tests/lds-semantic-c60.test.ts
```

**18/18 passed** (5+4+4+5). Running the new five-case RES96-C suite against the actual parent pack produced **4/5 passing and the expected 1/5 copy assertion failure**. This negative control demonstrates that the amended test detects the old wording; it is not a failure at the audited head.

Independently read [CI run 42165272882](https://github.com/mckayec/universe-sandbox/actions/runs/42165272882), build job 127720170395 and its logs. CI succeeded: **171/171 unit tests**, distribution check **114 files**, and standalone pages **26/26 page/viewport cases** (13×2). Deployment was skipped.

The runner actually checked out synthetic merge **5de5d5897b66b8469b956abe2c797e285991b7a4**, combining the audited head with base **59db328575bcb77ea790ebea4d547ab17289dc9d**. The reviewed head-to-merge comparison adds documentation/coordination and two root HTML files; it does not change the reviewed atlas runtime, tests or workflow. These CI results are distinguished from the 18 locally executed tests. No new local full build, full-app browser run or device run is claimed.

## Known gaps and final-audit boundary

| Gap | Impact | Blocks continuing the build? |
| --- | --- | --- |
| Wider vision/completeness accounting and final whole-atlas canon disposition | Two corrected descriptions cannot establish complete coverage or close every historical content/evidence gate. | No; preserve accepted records and package an explicit disposition of the remaining scope. Blocks blanket canon approval. |
| Final §4 coverage record, including a documented 20-entry sample and whole-pack low/unknown-confidence dispositions | This narrow return did not conduct a fresh 20-entry final sample or certify every low-confidence claim. | No; do not represent this two-claim review as a completed final canon audit. |
| RC64-O1 independent rendered chooser/scroll/focus/resize acceptance | Previous source review is accepted; prior independent Chromium attempt failed before page execution. Zero new rendered cases here. | No; remains part of technical/interactive acceptance. |
| Finished 4K capture, physical iOS/Android/phone and real-GPU evidence | Unit tests and downscaled screenshots cannot substitute for these existing evidence gates. | No; remains open at the existing technical/release scope. |

Under R3, known coverage gaps are recorded explicitly rather than restarting open-ended research. No scope reduction is silently approved. The prior completed residual decisions and unchanged accepted content need not be redone.

**Next bounded action for Claude:** package the exact-head final technical/rendered evidence and an explicit disposition of the remaining completeness scope, identifying any specific content item needing a source decision. Return a concrete final-audit package for the remaining §4 checks. Do not send RES64-C1/C2 back unchanged for another copy recheck.

Status returns to `fixing / claude` after this output is saved; `idle-runs: 0`. The signed agreement remains unchanged. No site code, PR branch, merge, deployment or Mckay release approval is changed.

**Final canon verdict: not yet approved. Blockers are the unresolved whole-atlas completeness/confidence disposition and incomplete final §4 coverage, with technical/rendered and owner-release gates separately open. The two checkpoint-66 wording corrections are accepted at the exact SHA above.**


---

# Final canon audit — checkpoint 68 return, 2026-11-07

ChatGPT · exact [PR33](https://github.com/mckayec/universe-sandbox/pull/33) head **9d53e7c48eae8469e240e6b61e933e7b5c115d5f**, branch `pack/lds-standard-works`; pack blob **0e4a2f8105f625daa6e86422717864488a63164d**. This section supersedes checkpoint66's current next action, preserving its historical evidence and closures.

**CS-1 is closed. All33 added-source records and the required20-entry sample are checked. One Medium disclosure fix remains (CS-2); no new book/text accuracy correction was found. Canon is not yet approved at this SHA.**

## Completed source and sample units

[CS-1 and sample review](cs1-review-9d53e7c.md), saved and read back at commit **54cf4d1d1a9f83e9fe68adc3be00ffb13cc0e655**, records every ID, source URL, supporting passage and decision:

- **33/33** newly linked cards checked against opened official source bodies:7 works,19 places,7 narratives;35 link instances,19 distinct destination pages, plus supporting follow-links. The StandardWorks entry is a cross-reference; followed Canon for the definition. Optional locator/navigation improvements there, Golgotha, Bountiful and the sampled Moroni range are not blockers.
- **20/20** final sample entries checked:11 codex,3 sites,3 events,3 journeys. Reproducible stratified xorshift32/Fisher–Yates selection seeded with0x9d53e7c4 over1714 records. Zero new substantive discrepancies in the sample. This is not an estimate that every atomic claim was independently reread this run.
- **1647/1647** codex cards have source arrays, up from1614. Source presence is an accounting check, not proof of accuracy. Exact evaluated old/new packs differ only in src: **0 non-source-field changes**. The earlier accepted wording, layer gates, dates, spatial data and links remain intact.
- **72/72** independently executed existing regression tests pass on fetched exact-head files, including all original BA01/02/03/05/06 constraints,169 primary IDs represented by170 source-view cards, supplementary source/gate checks, semantic/source-vision corrections and RES64 wording. Command and output: [validation receipt](final-validation-9d53e7c.txt). Initial expanded run was53/54 because my local review copy lacked the existing s28-callback-probe.cjs dependency; fetching that exact-head helper fixed setup. The final72-case run has0 failures/skips. No application changes were made.

## Original High/Medium finding reconciliation

Read the original [audit-build.md](https://github.com/mckayec/universe-sandbox/blob/846cf78e85927df7bd056748b41d88e1cc36d1f4/docs/universes/packs/lds-standard-works/audit-build.md), [content-audit.md](https://github.com/mckayec/universe-sandbox/blob/7539ff4e84478f11361736bfc0f1ad4d6c915278/docs/universes/packs/lds-standard-works/content-audit.md), [round1 recheck](https://github.com/mckayec/universe-sandbox/blob/27b9600546198757e5f1cd537a7cacc2bb2593d1/docs/universes/packs/lds-standard-works/remediation-review-r1.md), [round2 recheck](https://github.com/mckayec/universe-sandbox/blob/846cf78e85927df7bd056748b41d88e1cc36d1f4/docs/universes/packs/lds-standard-works/remediation-review-r2.md), current HANDOFF_PLAN's subsequent independent reviews, and checkpoint62–66 return reports. These original files are preserved on PR34's historical review revision; their absence at main's same paths does not erase their findings or prevent review.

| Finding | Current disposition at9d53e7c | Evidence and remaining boundary |
| --- | --- | --- |
| BA01, High | Resolved for content/route data. Lystra and SouthPass ordinary pins remain absent; both Lystra occurrences and SouthPass remain named unplaced stops. | Exact-head actual route helper regression passes; no substitute bridge across withheld stops. |
| BA02, Medium | Resolved:11/11 recommended pairs and representative-point qualifications match archived register; Salamis credits active ToposText point. | Independent register-to-pack comparison, R1-C1 closure and current tests. No archaeological/event-position certification. |
| BA03, Medium | Resolved with uncertainty retained:13/13 numbers and complete approximate/secondary display qualifications match register. | Harmony site-complex name and Thayer distinction retained; table below. |
| BA04, Medium | Answered by builder receipt and subsequent handoffs. | [Receipt](https://github.com/mckayec/universe-sandbox/blob/60db2b5/docs/universes/packs/lds-standard-works/remediation-ba01-07.md) explicitly supersedes older unanswered-Q01–04 text; no new Q03 authorization request. Current status identifies actual review head. |
| BA05, Medium | Resolved for source/gate contract. | Nine original isolation cases, Jerusalem note control and primary/supplementary gate checks pass. Paired Enoch/FirstVision/Haran/Ur/Olives links newly checked against their respective source accounts. Browser proof remains Claude's technical responsibility. |
| BA06, Medium | Resolved. | Fayette reference site has no1830-only date filter; actual helper permits site,1829 translation event and dictation route together. |
| BA07, High | Specified import, child/prose, identity, relation and semantic-remediation units accepted; final curated-scope disclosure remains CS-2 below. |169 primary research IDs/170 cards preserved; all1271/1271 SD IDs have imported targets resolving in actual pack. Mapping has1365 rows including94 child/prose rows, not1365 SD IDs or unique entities. Source/gate regressions and prior per-batch independent reviews apply; mapping existence alone is not source verification. No outstanding concrete import key established. |

**7/7 original finding groups reconciled.** This does not silently close technical findings or expand a finite content audit into an exhaustive concordance.

Subsequent source findings remain closed through the recorded independent review chain: S1-C1 at S2; S3/S4 refinements and seven child families through S5–S13; S6–S10 content/locator corrections; S14–S22 D&C/PGP corrections through successive returns; S23-C1 model notice at S24; S25-C1 source-view splits and S26 Enoch link; S30 Brunson source at S31; S32–S38 BMC source/disposition corrections; S40-C1 and S41 category labels; SEM-R1–R4/VIS-R1, SEM58-C1–C3, VIS60-C1/SEM60-C1, MAT61-C1, and RES64-C1/C2. Current regressions preserve the relevant payloads. Review provenance and exact earlier SHAs are in [HANDOFF_PLAN.md](../../HANDOFF_PLAN.md), [return-review-a3d5cc4.md](return-review-a3d5cc4.md) and the preserved checkpoint66 section above. This is inherited independent audit evidence plus current preservation checks, not reliance on Claude's report alone or a claim of fresh full-corpus rereading.

## Low/unknown-confidence disposition

The confidence decision follows concrete earlier source dispositions and retained visitor-facing qualifications, **not** the withdrawn112-match regex or absence of a U marker. The original [26-row register](https://github.com/mckayec/universe-sandbox/blob/846cf78e85927df7bd056748b41d88e1cc36d1f4/docs/universes/packs/lds-standard-works/anchor-dispositions.csv) assigns24 allowed representative/secondary points and2 withheld pins. Independently compared all26 decisions with actual current objects, including full required copy after apostrophe/whitespace normalization:

| Site ID | Register disposition | Current result |
| --- | --- | --- |
| fayette | conditional-retain-L | Pair and full scope copy match; explicitly secondary/approximate. |
| independence | conditional-retain-L | Pair and full scope copy match; explicitly secondary/approximate. |
| kirtland-temple | conditional-retain-L | Pair and full scope copy match; explicitly secondary/approximate. |
| nauvoo | conditional-retain-L | Pair and full scope copy match; explicitly secondary/approximate. |
| carthage-jail | conditional-retain-L | Pair and full scope copy match; explicitly secondary/approximate. |
| harmony | conditional-retain-L | Pair and full scope copy match; explicitly secondary/approximate. |
| palmyra | conditional-retain-L | Pair and full scope copy match; explicitly secondary/approximate. |
| salt-lake-temple | conditional-retain-L | Pair and full scope copy match; explicitly secondary/approximate. |
| garden-grove | conditional-retain-L | Pair and full scope copy match; explicitly secondary/approximate. |
| mount-pisgah | conditional-retain-L | Pair and full scope copy match; explicitly secondary/approximate. |
| chimney-rock | conditional-retain-L | Pair and full scope copy match; explicitly secondary/approximate. |
| south-pass | hold-ordinary-pin | Absent as ordinary pin; textual stop retained. |
| fort-bridger | conditional-retain-L | Pair and full scope copy match; explicitly secondary/approximate. |
| antioch-sending | replace-representative | Recommended pair and full scope copy match; explicitly representative gazetteer point. |
| seleucia | replace-representative | Recommended pair and full scope copy match; explicitly representative gazetteer point. |
| salamis | replace-representative | Recommended pair and full scope copy match; explicitly representative gazetteer point. |
| paphos | replace-representative | Recommended pair and full scope copy match; explicitly representative gazetteer point. |
| iconium | replace-representative | Recommended pair and full scope copy match; explicitly representative gazetteer point. |
| lystra | hold-ordinary-pin | Absent as ordinary pin; textual stop retained. |
| attalia | replace-representative | Recommended pair and full scope copy match; explicitly representative gazetteer point. |
| troas | replace-representative | Recommended pair and full scope copy match; explicitly representative gazetteer point. |
| syracuse | replace-representative | Recommended pair and full scope copy match; explicitly representative gazetteer point. |
| rhegium | replace-representative | Recommended pair and full scope copy match; explicitly representative gazetteer point. |
| puteoli | replace-representative | Recommended pair and full scope copy match; explicitly representative gazetteer point. |
| rome | conditional-retain-L | Pair and full scope copy match; explicitly secondary/approximate. |
| patmos | replace-representative | Recommended pair and full scope copy match; explicitly representative gazetteer point. |

**26/26** conform:11 replacements,13 qualified retains,2 holds. SouthPass's unresolved coordinate conflict is withheld, not promoted to a verified crossing. Lystra's contested candidate is not an ordinary pin. The13 remaining low-confidence numerical points are allowed **because their limitation is visible**, not because official addresses prove the secondary coordinates. Three of these sites were also newly source-checked in the final sample (6/6 coordinate components agree with their cited secondary pages).

All **3/3** geography-model cards (`bom-model-mesoamerican-sorenson`, `bom-model-heartland`, `bom-model-hemispheric-historical`) retain explicit proposed/attributed labels, competing readings and the Church's non-position. None carries geometry/date fields or creates model pins. Their historical source audits remain bounded to the read articles/essays; no unread scholarly book or inaccessible variant is newly certified. Both Heartland variants remain distinguished.

The supplied research's32 risk families in [whole-corpus-claims-audit.md](whole-corpus-claims-audit.md) remain the inherited source-scope framework, not32 new primary-source tests. Source narratives/visions, edition notes, theological interpretations, uncertain identities and intended journeys retain their audited distinctions; no unresolved known unsupported assertion is being accepted as fact. Current structural checks find **0/1647 codex cards with spatial fields**. All46 unmapped-place and34 unmapped-narrative records remain nonspatial. Only the two explicitly attributed FirstVision cards carry numeric codex years (1820); date/vision crosswalk reproduction passes at167 rows. No ancient calendar arithmetic is newly authorized. The only BoM-layer Earth sites are sourced Jerusalem and modern-publication Palmyra; no American narrative city or Arabian proposal has been turned into an Earth pin.

**Confidence contract satisfied for the retained, audited scope:** known low-confidence points remain qualified or withheld; models remain models; no identified unresolved U claim ships. This is a scoped audit conclusion based on the named registries, source audits and implementation reviews, not a claim of universal certainty or independent historical corroboration.

## Research-addendum receipt and scope

Read all **5/5 A01–A05** items in the [original addendum](https://github.com/mckayec/universe-sandbox/blob/846cf78e85927df7bd056748b41d88e1cc36d1f4/docs/universes/packs/lds-standard-works/research-addendum.md) and Claude's archived receipt linked above. A01 anchors are reconciled here; A02 single-mode work-layer design and source separation remain; A03's already-authorized schematic and the three archaeology/LiDAR artifacts are separate follow-ons, not delivered features or an unapproved geography model; A04 dense-display deferrals retain reference payloads and explicit mapping; A05's historical stage language is superseded by current status. No new approval request is needed for the already-authorized schematic. Missing comparison artifacts are an inherited follow-on dependency, not a new demand on Mckay from this return.

The76 residual editorial keys and20 correction keys (16 new cards across14 groups plus consolidations) were source-dispositioned and returned in the prior review; current residual semantic and omission ledgers are empty. Empty ledgers are checked against those accepted decisions, not treated alone as completeness proof. The two separate Matthew reader leads are resolved by MAT61-C1. Wider vision expansion, exhaustive incidental-name indexing and full verse-concordance coverage remain Known gaps under R3. They do not license unsupported retained claims or permit a silent claim that omitted work was completed.

## CS-2 — required visible coverage disclosure is absent

| ID | Severity | Location | Finding and evidence | Exact requested fix |
| --- | --- | --- | --- | --- |
| CS-2 | Medium | `public/atlas/packs/lds-standard-works.js:48`, `meta.notice` | [Previous final-package review](final-package-review-e2c02e4.md) accepted curated coverage only with a visible, accurate description. CS-1 return §5 says the visible description stays “curated atlas, not a verse-complete concordance.” That wording is not present in the evaluated pack, registry or display engine at9d53e7c. Current notice only declares independence and evidence distinctions; individual selected-journey qualifiers do not disclose whole-atlas scope. | Replace meta.notice with the exact text below, or an equivalent reader-visible scope statement for review. Preserve the independence/official-status and evidence-distinction statements. |

Exact replacement value:

> Independent educational atlas with selected coverage, not a verse-complete concordance. Not an official publication of The Church of Jesus Christ of Latter-day Saints. Scripture narratives, religious beliefs, historical evidence and geographic proposals are labelled separately.

The existing engine's `fanNotice(M)` at engine.js:494 uses meta.notice in credits/About, so no new UI feature is required. Confirm the replacement is readable through the existing notice/About surface on desktop and phone; retain the existing no-clipping requirement. This finding concerns a **missing previously required disclosure**, not a request to research omitted future material or redo accepted scripture corrections.

## Next action and remaining gates

Claude: implement CS-2 as one bounded notice change, return the exact new head and actual diff, and provide the resulting notice-display evidence with normal required validations. Do not repeat33-source checking,20-entry sampling, the accepted residual96 decisions or the unchanged RES64 corrections. ChatGPT's return should check the notice delta and preservation; changed canon content beyond that needs its own recheck. Keep exact-head technical/device limitations explicit and obtain Claude's separate technical sign-off after canon clears. Physical-device/real-GPU evidence and Mckay's release approval remain separate; this report supplies neither.

No code, PR branch, merge or deploy changed. Agreement and other chats' work remain untouched. Output was saved before the status handoff to fixing/claude.

**Canon: not approved — CS-2 (Medium), missing reader-visible selected-coverage notice. CS-1 closed33/33; final sample completed20/20; prior content/confidence dispositions accepted as recorded above.**
