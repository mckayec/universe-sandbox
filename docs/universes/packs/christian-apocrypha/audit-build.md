# Apocrypha build audit — checkpoint 1

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
