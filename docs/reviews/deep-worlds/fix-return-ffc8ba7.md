# Deep Worlds — remaining-content and technical disposition packet at PR37 ffc8ba7

Claude, 2026-11-07T17:20Z. Answers the handoff in implementation-review-fb79488.md ("bounded remaining-content/technical disposition packet").

PR37 `atlas/deep-worlds` head **ffc8ba7c6734f38839f3eca974b96c04a1a1c098** (parent 004c3c9). The commit changes only `public/atlas/packs/cosmere.js`: CS18/e13 (below) plus the Elantris omissions, which belong to the cosmere-book-by-book review (`docs/reviews/cosmere-book-by-book/elantris-return-ffc8ba7.md`). Engine, Society and the other five packs are identical to fb79488, so the DWR-A, DWR-B and DWH-01 closures carry unchanged.

## 1. Supplement (23/23) — final dispositions

| ID | Disposition at ffc8ba7 |
|---|---|
| CS18 / e13 | **Narrowed** to the clause ChatGPT confirmed in Chapter 4: "Siri of Idris arrives at the Court of Gods to marry the God King of Hallandren." The "youngest princess" and "nothing like the stories" clauses are removed. id, title, world, site, `lm: "palace"`, book 3 kept. |
| CS01, CS04, CS07, CS08, CS11, CS12, CS17 | Narrowed as offered (232fef1; CS04 label d902c8a). Carried. |
| CS16 | Retained, commentary-assisted (Known gap). |
| Other 14 | Carried unchanged as dispositioned in supplement-review-60176e7.md / implementation-review-232fef1.md. |

## 2. DW06 / Society remaining content — retained vs. narrowed/omitted

Claude cannot add primary-source evidence (no open-ended research by the builder). Every item below is therefore **retained, not newly evidenced**. None was narrowed or omitted in this return, because ChatGPT has not named a specific contradicted record in these groups.

| Group (audit.md item 3) | Status | Retained with evidence? |
|---|---|---|
| Expanse — Medina / Ceres claims | Retained | No new evidence |
| Sun Eater — dates | Retained | No new evidence |
| Hyperion — journeys | Retained | No new evidence |
| Foundation — narratives | Retained | No new evidence |
| Dune — later episodes | Retained | No new evidence |
| Society — prologue / early-Europa details | Retained | No new evidence |
| Replacement landmark samples (Sun Eater, Expanse, Foundation) | Open | — |

**Proposal to end the loop (R3/R4):** ChatGPT either (a) gives a scoped canon decision now with these groups listed as Known gaps, or (b) names specific record IDs to cut or narrow, which Claude applies in one pass the next run. Claude recommends (b) limited to the seven prominent places named in this review's original task (Arrakeen, Trantor, Medina, Luthadel, Kholinar, the Time Tombs, Devil's Rest): one capped ChatGPT checkpoint on those places' landmark and event text, then everything else in the table goes to Known gaps. If neither AI can close it, it becomes a Mckay question (release with an "AI-written, partly verified" note, or hold).

## 3. Technical dispositions

| Item | Status |
|---|---|
| DWR-A, DWR-B, DWH-01 | Closed (ChatGPT, source/VM); engine identical; probes rerun at ffc8ba7: history 3/3, transition 11/11, dwr 22/22. |
| `test:browser` Save/Load step | Pre-existing simulator failure, also on unmodified bases (recorded since 2026-11-04); not caused by atlas changes. Not run this return. Needs its own fix before release; proposed as a separate small review item, not a Deep Worlds blocker. |
| Integrated rendered/tour/deep-link/device evidence | Still builder-only; final technical acceptance (AUDIT_CHECKLIST §4) runs at the SHA ChatGPT approves for canon. |
| Merge conflicts with main | Not rechecked this run; resolved at final-audit time. |

## Validation at ffc8ba7

`pnpm check` 125/125, check:dist OK; `pnpm test:pages` 12×2; Deep Worlds probes as above; browser load of the Cosmere pack at 1440×900 and 390×844, four views, 0 page errors (details in the Elantris return). Not merged.
