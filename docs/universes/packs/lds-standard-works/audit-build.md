# LDS build audit — bounded anchor/addendum implementation pass

2026-10-29. **Changes required; no final canon or release approval.** This audits incorporation of the existing 26-anchor register and A01–A05 only. It is not the complete AUDIT_CHECKLIST §3 pass over every narrative, event, alias and layer, nor a fresh full-canon source audit.

## Exact revisions and scope

- Build: [PR33](https://github.com/mckayec/universe-sandbox/pull/33), `pack/lds-standard-works`, **c59c9bc13d848bbf0c4b3f3c64810bfa187749f0**, verified open/unmerged and unchanged on 2026-10-29.
- Prior review: [PR34](https://github.com/mckayec/universe-sandbox/pull/34), `docs/lds-anchor-review-20261027`, **71bf358dc576f1014ec2ec6341d74f25a61fc3df** before this addition. Sources and dispositions are reused from [research-addendum.md](research-addendum.md), [anchor-dispositions.csv](anchor-dispositions.csv) and [anchor-sources.md](anchor-sources.md); no new source-reading claim.
- Fresh main inspected: **a8236ae5b4d013a0d6cca45e421f5b8390face35**. Main status is built / chatgpt. Root AGENTS.md and CHATGPT.md match the review checkout; signed handoff, audit checklist, workflow/status and current builder report consulted. No relevant `.agents/skills` or nested AGENTS.md was found. Explicit task instructions restrict changes to this existing review branch; main/status is not changed here.
- Research built from: **52adadf1558b8bba1c89ca266de682ccdc988767**, handoff **689b4959b520b5da57a6579e47877dd43726892b**. Builder report originally targets **6848554f14ddd81be35a06b0ce68b3b7089c2db1**; exact pack blob at both that revision and current build is **99bd59818c8caaee78351237cf3ca6c30740cbbd**. The intervening main merge does not incorporate the addendum into pack data.

## Finite disposition accounting

**26/26 builder anchors checked**, exact ID, coordinates, name, modern-reference description and explanatory copy captured in [anchor-implementation-audit.csv](anchor-implementation-audit.csv). All 26 coordinate pairs still equal the original proposal. The ten research-supplied anchors are outside this 26-row source-disposition audit.

| Prior action | Checked | Current incorporation |
|---|---:|---|
| Replace representative coordinate and source | 11/11 | 0/11 replacements applied. AP12–AP15, AP18, AP21, AP22, AP27–AP29, AP33 retain original pairs. |
| Withhold ordinary pin | 2/2 | 0/2 holds applied: AP19 Lystra and RP12 South Pass remain pinned. |
| Conditional retention with approximate/secondary qualification | 13/13 | All 13 numbers remain eligible for conditional retention; 0/13 fully satisfy the explicit visible confidence/source qualification contract. Most already distinguish a modern reference from an episode, which is useful but insufficient. |

**0/26 fully closed against the prior register**, not 26 fabricated/wrong locations. The thirteen retained numbers are not rejected numerically. The eleven replacements are unincorporated review decisions, not eleven newly discovered contradictions. In the evaluated site objects no explicit `(L)`/secondary-coordinate qualification or anchor-source URL is supplied. Source comments and the proposal CSV are developer provenance, not visitor-visible uncertainty. The builder report's statement that all 26 are tagged `(L)` in the pack is not borne out in evaluated display fields.

## Findings and exact acceptance requirements

| ID | Severity | Location at build SHA | Finding and evidence | Required disposition |
|---|---|---|---|---|
| BA01 | High | `public/atlas/packs/lds-standard-works.js:363,608,683,685,756` | A01c/d holds not applied. Lystra and South Pass remain ordinary sites. Actual `AtlasLayers.routeLegs` yields Iconium→Lystra, Lystra→Iconium, Chimney Rock→South Pass, South Pass→Fort Bridger. Prior evidence is contested Lystra identification and unresolved South Pass coordinate conflict; no new geography conclusion is inferred. | Remove both ordinary pins and retain textual records. Replace every occurrence in routes with a named unplaced stop, not a skipped stop. Assert all four listed legs disappear and no replacement bridge spans either unknown stop. Do not substitute the conflicting BLM coordinate or certify a candidate through the word “believed.” |
| BA02 | Medium | same pack:302–456; register's 11 `replace-representative` rows | All eleven prior coordinate/source replacements are absent. | Apply each exact recommended pair **and** its coordinate-source attribution and representative-point copy from the register, or record an evidence-backed alternative for review. Preserve original metadata. Source precision is not measurement accuracy; round only displayed coordinates as specified in A01. |
| BA03 | Medium | same pack:436–445,472–629; thirteen `conditional-retain-L` rows | Numeric retention lacks the required explicit approximate/secondary qualification. RP01 still names “Harmony (Smith home site)” though the point is only verified as a site-complex reference. Comments cannot communicate this qualification to a visitor. | Carry the register's `anchor_copy`, source and `(L)`/secondary qualification into visible details, or withhold the point. Rename RP01 to “Harmony / Priesthood Restoration Site” and clarify the point is not an identified house or baptism location. Keep city references separate from temple lots, rooms, landings and events. |
| BA04 | Medium | `build-report.md`, `research-review.md`, main `status.md` | Q01–Q04 still called unanswered/no addendum; Q03 incorrectly awaits owner preference. No A01–A05 disposition ledger is recorded. | Record receipt of PR34 and each A item. Q03's schematic **was owner-authorized on 2026-10-27**; no repeated preference request is needed. Implementation and comparison-artifact review remain pending, not approved geographic equivalence. Retain incomplete status until substantive acceptance gates close. |

Source links for each anchor and original findings are in the two linked CSV registers and prior addendum. The script/validator's absence of structural errors does not resolve these content findings.

## Prior correction accounting (A01–A05)

- **A01a Mount Pisgah:** pack already says **near Thayer, Iowa**, and distinguishes biblical Pisgah. This aspect conforms; do not report a Murray error in the pack. The research restoration inventory's Murray wording still needs the addendum correction, and the numeric point remains secondary with site/boundary limits. No new cemetery-boundary claim is accepted.
- **A01b Paphos:** pack already says **Nea Paphos**, explicitly not Palaepaphos. Identity distinction conforms; replacement representative point/source remains unapplied. This is not proof of the proconsul encounter location.
- **A01c/d:** both holds remain open (BA01).
- **A01e:** Garden Grove already distinguishes modern town from 1846 camp. Harmony's house-specific name remains too narrow. Patmos already denies a cave location, but has not adopted the Kastelli-associated gazetteer reference. Do not call that point an island centroid.
- **A02/Q02:** `spoilers.mode: "single"` and five work layers are present and consistent with the prior canon answer. Layered notes/codex machinery exists and unit tests pass; whole-payload cross-layer behavior and rendered selection remain outside this bounded pass. Mode conformity is not complete layer acceptance.
- **A03/Q03:** owner-approved relation-only schematic is not built (one Earth world; no schematic world). Its omission is disclosed and may be a follow-up, but the rationale must no longer say owner consent is missing. The paired Americas/LiDAR comparison remains a separate evidence review. A03-ART01 has no receipt/disposition in this exact build's report; this pass did not repeat the all-branch artifact search and makes no new claim of absence from private projects. Require three identified original artifacts, source/research context and rights/provenance before reviewing their claims. LiDAR does not establish textual or ethnic identity by itself.
- **A04/Q04:** dense-context deferral is disclosed in the build report and agrees with the accepted display deferral. Aggregate 36 sites / 24 events / 9 routes / 27 codex entries do not supply the requested record-level imported/deferred/unlocated accounting for the structured research. That broader reconciliation remains open, not silently waived by this anchor pass.
- **A05:** research-ready handoff and unfinished build remain distinct. Main's built/chatgpt status is the current workflow state; the prior addendum's research-ready/claude paragraph describes its earlier checkpoint. Neither should be treated as final approval.

## Validation and limits

Node v24.19.0; evaluated exact-head pack data in a Node VM without DOM/browser/server. The existing pack validator reports **1 world, 36 sites, 24 events, 0 issues, 0 warnings** for LDS. Existing `tests/atlas-layers.test.ts` and `tests/atlas-packs.test.ts`: **22/22 pass**. These include adjacent-placed-stop route handling, notes/layer helpers and pack structure; they do not validate historical truth. Direct evaluation of the actual route helper confirms the four offending legs above.

A broader `npm test` attempt yielded **74 passes, 2 failures (76 reported tests)**: `galaxy-field.test.ts` and `refactor-regressions.test.ts` could not import missing package `three` in this clean detached checkout. This is a dependency/setup failure, not an established application regression. No dependency installation, fresh production build, pnpm format/check or distribution check is claimed in this pass. Existing exact-head [CI40484725191](https://github.com/mckayec/universe-sandbox/actions/runs/40484725191) is completed/success; it is distinct from these local results. Builder screenshots and browser claims remain attributed, not independently verified here.

No rendered/mobile/keyboard/label-collision/interactive acceptance was performed. No alternative surface or server was used. No application code, main branch, formal review, merge, deployment or scheduling was changed. CSV uniqueness, count, IDs, coordinate comparison, relative links and diff whitespace are checked before publication. The source-head checkout remains clean.

## Next finite acceptance gates

1. Builder records A01–A05 dispositions and resolves BA01–BA04 on a named new build SHA. Preserve the 26-row matrix, count all 11 replacements, both holds and all 13 visible qualifications separately; verify both occurrences of Lystra.
2. Verify missing-stop route breaks using actual final pack data; verify source attribution, point scope and displayed coordinate precision. Keep the prior source-access/confidence limits intact.
3. Complete the **separate remaining build audit**: structured-record import/defer/unlocated accounting, all label/event/journey/codex content and cross-layer behavior. This document does not claim that work complete.
4. Obtain permitted rendered/desktop/mobile/keyboard technical acceptance for the resulting head, then resolve remaining content findings and conduct the signed final audit. Both final sign-offs and owner release approval remain necessary. Schematic authorization is already recorded; it is not a release authorization.
