# Apocrypha build audit — bounded checkpoints 1–2

Date: 2026-10-29. Auditor: ChatGPT. **Partial content audit; not canon or release approval.**

- Build: PR #38, `pack/christian-apocrypha`, exact SHA `8ae91333461bfeb989b570857a0aba321eaa34df`.
- Research handoff: `4dc7f444246ab0c5afffe90ee3fb1838b92493aa`.
- Scope: all six explicitly flagged items in build-report.md, checked against the pack at that SHA and reopened selected primary witnesses. This is **6/6 flagged items**, not all 327 events or approximately 620 codex entries.
- Ownership observed: built / chatgpt. Keep that status: full build audit remains incomplete.
- Publication: isolated docs review branch only; no main, code, PR metadata, merge or deploy changes.

## Findings

Locations below refer to `public/atlas/packs/christian-apocrypha.js` at the audited SHA. Confidence C-text means the selected witness supports the finding, not that the narrative happened historically.

| ID | Severity | Location | Finding | Evidence/source | Suggested fix | Resolution |
|---|---|---|---|---|---|---|
| APB-001 | Medium | line 601, `nta-ape-eubula` | “Agrippinus or Pompeius” incorrectly suggests alternative identity. They are two separate participants with different roles. | [Acts of Peter XVII, James](https://www.earlychristianwritings.com/text/actspeter.html): Agrippinus receives the proposed sale; Pompeius is the deputy who investigates. C-text; reopened 2026-10-29. | Replace the alternative with “Agrippinus the goldsmith and Pompeius the deputy”, or omit these supporting names. Keep the Judaean recollection separate from Peter's Roman journey. | Open |
| APB-002 | Medium | line 652, `nta-apa-discovery` | “copies for the emperor and for Jerusalem” loses the original/copy distinction and the edition-dependent reversal. | [Apocalypse of Paul 1–2, James](https://en.wikisource.org/wiki/The_Apocryphal_New_Testament_(1924)/Apocalypses/The_Apocalypse_of_Paul): Latin-based main text retains original with emperor and sends copy to Jerusalem; editorial Greek variant reverses this. C-text; reopened 2026-10-29. | State that the framing story sends the discovered box to the emperor, who keeps the original and sends a copy to Jerusalem; identify the Greek reversal if included. Retain unauthenticated-story qualification. | Open |
| APB-003 | Low | line 677, `ME01`; research `marian-research.md` MP01 | Jerusalem pin follows the research's “Jerusalem context”, but the opening passage itself names Jesus' tomb without naming its city. This is a contextual inference, not an explicit opening-unit location. | [Greek Pseudo-John, opening through return to Bethlehem](https://www.newadvent.org/fathers/0832.htm), first account only. MP01 at research SHA describes Jerusalem context, with null position. C-text for tomb/prayer, L-context for Jerusalem binding; reopened 2026-10-29. | Prefer leaving ME01 unpinned, or explicitly qualify the inherited contextual association in the event. Do not imply a located tomb. Existing anchor disclaimer is useful but does not make a city association explicit in the witness. | Open |

## Flagged items cleared at this checkpoint

| Item | Location | Disposition and evidence |
|---|---|---|
| Young man's murdered father | line 611, `nta-aj-parricide` | Supported, not merely inferred from the record ID. [Acts of John 48–55, James](https://www.earlychristianwritings.com/text/actsjohn.html) narrates the son's lethal assault, confession, revival, subsequent mutilation and John's rebuke; Smyrna is an invitation. C-text, reopened 2026-10-29. No required change. |
| Coastal-road proposal | line 715, `PME22` | Supported in the chapter itself. [Pseudo-Matthew 22, Walker](https://www.newadvent.org/fathers/0848.htm) has Joseph propose the coast and Jesus shorten the journey before Sotinen. Research PMJ05 already summarizes it; not a build invention. C-text, reopened 2026-10-29. No required change. |
| Unnamed robber | line 1396, Paradise (Descent) | Correctly cautious. [Descent, first Latin form, chapters 9–10, Walker](https://www.newadvent.org/fathers/08072b.htm) includes Enoch, Elijah and the robber but gives the robber no proper name here. Keep him unnamed; do not import Dysmas from the separately scoped Acts of Pilate. C-text, reopened 2026-10-29. No required change. |

## Checks and limits

- Read pack source at exact build SHA; inspected selected primary passages, not a full rereading of every work.
- Re-read Marian, Pseudo-Matthew, Pilate and NT source registers at the research handoff SHA. The working NT research dossier was also consulted, but findings above are controlled by reopened primary text, not a cluster-name inference.
- No software tests, runtime browser checks, screenshot QA, exhaustive spoiler audit or independent full registry join were run in this content checkpoint. Builder-reported checks are not represented as independently rerun.
- No (U) Meqabyan content acceptance or changed scope is implied.
- No final sign-off. Do not merge PR #38 on the strength of this checkpoint.

## Precise continuation

1. Continue exhaustive pack-to-research record accounting and entry-by-entry source/edition fidelity, with per-layer checked/total counts.
2. Audit cumulative work gating, later additions and labels for premature disclosures; inspect the build screenshots.
3. Answer Q01–Q03 in research-addendum.md using evidence (no automatic coordinate reuse or LDS cross-link approval).
4. Once the entire build audit is complete, commit it before any owned status transition. Claude then resolves APB findings on the code branch; recheck the new exact SHA before canon approval.

The isolated review branch deliberately does not edit authoritative status on main. This document is a checkpoint for the ongoing audit, not a completed handoff to fixing.

## Checkpoint 2 — complete bounded structural / implementation pass

2026-10-29, same exact build SHA. This extends checkpoint 1 rather than replacing its source findings.

### Independently executed checks

Downloaded the exact-head pack, its exact-head `tests/atlas-apocrypha.test.ts` and five integration registries to an isolated temporary fixture. The work-gates and record-work-index files from research SHA were compared byte-for-byte with the build SHA: identical. Ran with Node v24.22.1:

```sh
node --experimental-strip-types --test tests/atlas-apocrypha.test.ts
```

**15 tests passed, 0 failed.** This independently covers the test's work-slot equality, forbidden Meqabyan IDs/claim-prefix exclusions, five-anchor inventory, targeted codex prefixes/later gates, selected place-row correspondence, narrative clusters, visionary nonspatial handling and specified badge inclusions/exclusions. String-prefix exclusion is not a proof against paraphrased forbidden claims; counts are not semantic verification.

A second independent VM inspection traversed **all 327 events, all 706 codex entries and all 77 `more` additions**. It checked valid 1–39 gates, event/layer agreement, codex base-layer agreement where specified, unique event IDs, event-site existence and matching work badges, and strictly later valid `more` gates present in each entry's books list. **No violations.** Three global coverage notices deliberately have no layer. The 39-slot inventory has zero events in excluded slots 18–20; one shared Meqabyan notice starts at 18.

| Layer | Events structurally checked / total | Layer-tagged codex entries structurally checked / total |
|---|---:|---:|
| Deuterocanonical | 147 / 147 | 333 / 333 |
| Expanded OT | 41 / 41 | 98 / 98 |
| Isaiah/Baruch | 20 / 20 | 39 / 39 |
| NT-related | 59 / 59 | 172 / 172 |
| Pilate/Marian | 60 / 60 | 61 / 61 |
| Global coverage notices | — | 3 / 3 |
| Total | 327 / 327 | 706 / 706 |

**These are structural counts, not claims that every proposition has been re-read against its primary source.** The primary-source verification count remains six flagged items.

### Implementation review

Read the full changed picker helper implementation and engine integration diff, plus the exact-head codex rendering/filter paths. Escaping is present for picker labels and group headings; selection and step controls delegate through the existing hidden book buttons; URL restoration uses the same setBook/click path. No new implementation defect established in those inspected paths.

Important existing contract limit: PACK_FORMAT §20.1 applies layer filtering to worlds, sites, events and galaxy links, not codex entries. Engine renderCodex filters by work gate but not layer. Do not describe the layer controls as filtering the entire reference library. If wider codex filtering is wanted, it needs explicit engine scope, including cross-layer later additions, rather than merely adding a layer predicate to the current base entries.

### Screenshot evidence

Inspected all five files reported by the builder: phone 390×844, laptop 1440×900, 1280×800, downscaled 3840×2160 overview and 1:1 4K crop. These are builder-produced artifacts read from main, not a newly launched browser or independent rendering at the build SHA.

- Picker and work marker pills are legible in the inspected views; 1280 layer controls wrap into two rows.
- Phone details sheet covers the layer bar as the builder disclosed; its screenshot alone does not prove dismissal/reopening behavior.
- Earth surface remains visibly soft/blocky in the overview and 1:1 crop, with “Charting surface” visible in overview screenshots. The images therefore do not establish the final crisp-surface acceptance gate.

### Additional findings / evidence limits

| ID | Severity | Location | Finding | Evidence/source | Suggested fix | Resolution |
|---|---|---|---|---|---|---|
| APB-004 | Medium | build-report.md screenshots / final technical gate | Supplied screenshots show the unfinished soft surface, not a completed crisp map. This confirms a disclosed verification gap, not a newly diagnosed GPU bug. | Five inspected shots, especially 4K 1:1 crop; AUDIT_CHECKLIST §4 requires crisp surfaces. | Claude should capture the finished bake on supported GPU hardware, verify quality and retain matching exact-head evidence before technical approval. | Open |
| APB-005 | Low | build-report.md Codex count | Report says about 620 entries; evaluated pack actually contains 706 (including three coverage notices). | Exact-head VM count above. | Correct report denominator so later audit coverage is not understated. | Open |
| APB-006 | Low | build-report.md browser-check claim | Report says CI runs `pnpm test:browser`; the inspected workflow's enumerated steps show standalone-page checks but no explicit `pnpm test:browser` step. The separate suite cannot be called verified from this job list. | [Workflow run 40591931729](https://github.com/mckayec/universe-sandbox/actions/runs/40591931729), returned for exact build SHA: build success; deploy skipped. | Clarify whether a listed script invokes the separate suite, provide its actual execution evidence, or keep it explicitly unrun. Do not infer it passed from the workflow title. | Open |

CI evidence: exact-head workflow 40591931729 completed successfully. Job steps reported format check, build, unit tests, distribution check and standalone-page browser check successful; deploy skipped. Empty legacy combined statuses are not a failing check. This is inspected remote evidence, not a local full-project check.

### Bounded conclusion and handoff

The assigned bounded content/implementation audit now has (a) six primary-source dispositions, (b) independent exact-head targeted tests, (c) complete structural inventory traversal, (d) changed picker/engine-path inspection and (e) every supplied screenshot inspected. APB-001/002 require correction; APB-003 requires a disposition; APB-004 remains a technical acceptance blocker. No canon or release approval.

The broader repository's exhaustive §3 canon audit remains unfinished: it requires source-level review of the other entries, not substitution of the structural pass. Keep built/chatgpt rather than falsely transfer a finished stage. The draft review PR is the discoverable handoff artifact; it must not be merged or deployed by this audit task.

## Checkpoint 3 — source-level semantic audit and required corrections

This checkpoint supersedes the earlier six-item-only scope. All **327 event copies and 706 codex base entries** have now been read and semantically compared with the exact-revision research dossiers/registries, including names, places, chronology, edition boundaries, attribution, uncertainty, journeys and nonspatial dispositions. The five modern anchors exactly match geography-reuse.md; the two general coverage notices preserve the research's selected-witness/neutrality limits.

This is a **completed build-to-research semantic sweep with targeted primary-source verification**, not a new complete rereading of every original corpus unit, manuscript collation, or final canon sign-off. The source-level checks confirmed material drift that the structural tests did not catch. The initial APB-001 also affects people codex **Eubula, line 1550**, and APB-003 also affects **Jesus' tomb (Dormition), line 1151**.

### Additional source findings

All line numbers are in the exact-head pack file. Findings are C-text unless an inference/ambiguity is explicitly marked.

| ID | Severity | Location | Finding | Evidence/source | Suggested fix | Resolution |
|---|---|---|---|---|---|---|
| APB-007 | Medium | line 449, m2-01 | The copy applies year 188 to both letters; only the first letter carries that date. | [2 Maccabees 1:1–10, RV](https://ebible.org/eng-rv/2MA01.htm); second salutation starts 1:10b. | Attach years 169/188 to the first letter only. | Open |
| APB-008 | Medium | line 332, jdt-07 | Thirty-four days of siege becomes thirty-four days literally without water. | [Judith 7:20–21, NABRE](https://bible.usccb.org/bible/judith/7): siege duration followed by failing supplies and insufficient rationing. | Say that after thirty-four days of siege, water supplies fail. | Open |
| APB-009 | Medium | line 764, Nineveh | Says Tobit's story begins and ends at Nineveh; the ending takes Tobiah to Ecbatana. | [Tobit 14:12–15, NABRE](https://bible.usccb.org/bible/tobit/14). | Remove “and ends”; describe Nineveh as an exile/return setting. | Open |
| APB-010 | Low | line 326, jdt-01 | Compressed order can imply capture of Ecbatana precedes the summons. | [Judith 1:7–14, NABRE](https://bible.usccb.org/bible/judith/1): summons/refusal precede capture. | Reorder clauses to avoid the chronological implication. | Open |
| APB-011 | Medium | 95 deuterocanonical event side labels | Edition provenance is not actually named on every event, contrary to build-report claim: 14 Tobit, 16 Judith, 15 Wisdom, 44 Sirach and 6 Baruch labels omit it. Pack-source comments do not reach the visitor. | Exact-head labels compared with per-chapter coverage/source register, where NABRE/RV and unavailable-body substitutions matter. | Append precise edition labels from coverage.csv; do not assign one blanket edition across exceptions. Ensure visitor-accessible source references. | Open |
| APB-012 | Medium | line 1510, Jeremiah (4 Baruch) | Death is placed before the stone substitution. | [4 Baruch 9:24–32, registered longer-text mirror](https://intertextual.bible/read/4-baruch): substitution while he speaks, return and killing, then stone at tomb. | Put the temporary substitution before his return and stoning. | Open |
| APB-013 | Low | line 554, rpe10 | Blanket hidden-identity descent obscures the sixth-heaven exception. | [Ascension 10:19–20, Charles](https://www.earlychristianwritings.com/text/ascension.html). | Qualify concealment as occurring below the sixth heaven. | Open |
| APB-014 | Low | line 1295, Jacob goes down to Goshen | Date can read as initial Haran departure rather than departure from the Well of the Oath. | [Jubilees 44:1,8, Charles](https://wesley.nnu.edu/sermons-essays-books/noncanonical-literature/noncanonical-literature-ot-pseudepigrapha/the-book-of-jubilees/). | Attach day 16 explicitly to the Well of the Oath; initial departure is day 1. | Open |
| APB-015 | Medium | lines 639, 1139, 1577; nta-at-initiation and two codex entries | Both spouses are said to be physically healed; the selected witness identifies Mnesara's illness/healing and both spouses' initiation. | [Acts of Thomas 151,154–158, James](https://www.earlychristianwritings.com/text/actsthomas.html). | “Mnesara is healed; she and Iuzanes are initiated.” Apply to event, house and people entries. | Open |
| APB-016 | Low | lines 639, 1575; Narcia | No inferred biological parentage becomes an unsupported denial that she is anyone's mother. | [Acts of Thomas 120–121, James](https://www.earlychristianwritings.com/text/actsthomas.html): nurse role with maternal address. | Identify her as Mygdonia's nurse; say the address does not establish biological parentage. | Open |
| APB-017 | Low | line 590, nta-pt-ephesus | “Known only” from two witnesses excludes the Acts of Titus sentence included in the selected section. | [Acts of Paul VIII, James](https://www.earlychristianwritings.com/text/actspaul.html). | Remove “only” or include the third witness. | Open |
| APB-018 | Medium | line 1584, Joseph of Arimathea (Acts of Pilate) | “Mary's Joseph, whose parentage is disputed” attaches the disputed parentage to Joseph rather than Jesus. | [Acts of Pilate, Greek I, chapter 2, Walker](https://www.newadvent.org/fathers/08071a.htm). | Distinguish the two Josephs without the wrong antecedent: the chapter disputes Jesus' parentage. | Open |

### Semantic coverage and evidence depth

- **Deuterocanonical:** 147/147 events and 333/333 codex compared against research. Direct rechecks included Tobit 14; Judith 1,5,7; 2 Maccabees 1; Sirach 47,49,50. USCCB Sirach 47 returned 403; a licensed NABRE BibleGateway presentation supplied it. No access restriction was bypassed. Remaining clauses rely on the research's passage-specific evidence, not claimed fresh rereading.
- **Expanded OT and Isaiah/Baruch:** 61/61 events and 137/137 layer codex, plus the Meqabyan notice and two later additions compared. Primary rechecks: 1 Esdras 7; WEB 2 Esdras 7/13/14; 3 Maccabees 7; 4 Maccabees 1; Enoch 22/81–82/106; Jubilees 7/28/32–34/38/44/47; Ascension 1–2/10–11; 4 Baruch 9. The registered CATSS-based longer-text mirror supplied 4 Baruch after the other host failed.
- **NT-related:** 59/59 events, 172/172 codex and three later additions compared. Primary passages across nine works were rechecked for version framing, people, geography, fragment boundaries and narrative outcomes; Peter XVII, John 48–55 and Apocalypse Paul 1–2 also rechecked by the lead. Detached unproofread John OCR and all apocalypse witness bodies were not freshly reread in full. Do not upgrade their inherited evidence quality.
- **Pilate/Marian:** 60/60 events, 61/61 codex and nine later additions compared to the three selected dossiers. Relevant passages reopened across Greek Acts of Pilate prologue/1–2/9–16; Latin Descent 1–3/5/8–13; Greek Pseudo-John MU01–MU12; and Pseudo-Matthew chapters 1–42 plus attributed prefatory material. Chapter locators remain distinct from work gates. PL12 arithmetic independently recalculated to 5430. No wholesale primary transcription is published.
- **Global material:** five anchor coordinates/names/restrictions compared to exact geography contract; two global scope/neutrality notices checked. No new coordinate or linked historical assertion authorized.

### Current conclusion

**Changes required; not canon approved.** The complete semantic sweep has established the corrections above. Existing edition limitations and targeted-not-exhaustive fresh primary coverage remain explicit. All High/Medium findings need an accepted resolution and an exact-new-SHA recheck; the final audit still needs its recorded sample and Claude's independent technical acceptance.

A fixing-stage proposal may be placed on this draft review branch after this output is committed. Main remains unchanged until an authorized owner handles the docs handoff. No code changes, merge or deploy are authorized by this report.
