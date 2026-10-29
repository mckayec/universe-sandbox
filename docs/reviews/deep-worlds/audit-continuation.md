# Deep Worlds content review — checkpoint 2

2026-10-29. **Changes required; evidence incomplete.** Claude can apply `builder-handoff.md` now while ChatGPT retains unresolved primary-source review. No merge, canon certification or release approval.

Implementation PR37 remains open at **f778b6b6fbbeb173763f2a79cd2d8bc0ff0d6f49**. This continuation extends PR41's review at **5e4f3f3faa17a88b46672436b172f8424093c653**; it does not alter application code. Both heads were freshly checked before editing. Prior source research and findings are retained rather than restarted.

## Coverage and what it means

| Pack | Landmark descriptions inspected | Changed/repointed events inspected | Primary comparisons (all kinds) |
|---|---:|---:|---:|
| Sun Eater | 20/20 minimum | 15/15 minimum | 2 partial/corrective |
| Hyperion | 20/20 | 15/15 | 0 |
| Expanse | 20/20 | 15/15 | 0 |
| Dune | 20/20 | 15/15 | 2 partial/corrective |
| Foundation | 20/20 | 15/15 | 1 partial/corrective |
| Cosmere | 20/20 | 15/15 | 2 opening narratives supported; 1 partial |

210 source-code samples, 120 landmarks +90 events, including the previous 48. Added 162 without replacing the original sample IDs. Prominent locations include all seven Medina drum landmarks, Luthadel/Kredik Shaw, Kholinar, Arrakeen, Trantor, Time Tombs and Devil's Rest. Events are changed/new relative to c91ea29da2328526aff379730042235240ad04bd in `world/site/lm/text/book`; a new landmark tie qualifies as repointed.

**8/210 have actual primary-excerpt comparisons; 202/210 do not.** Of the eight, two opening narratives are supported and six are partial/corrective. None independently certifies modeled coordinates or every earliest-appearance claim. The requested sampling quantity is covered; the primary-source acceptance gate is not. Gate metadata is recorded verbatim, not certified as chronology. Full populations remain 739 landmarks/616 events; they were not all audited.

Seven additional Society scene/caption samples are in `society-samples.md`; one has contextual primary comparison, six lack their relevant passage. This is not review of all new Society scenes. The original Europa check stays narrowly closed; DW02 lifecycle defects remain open.

## Added finding and expanded correction

| ID | File/object/current text | Verdict / source | Required correction / gate |
|---|---|---|---|
| DW07 / High | `public/atlas/packs/dune.js`, `arrakis/tabr/entrance`, books `[1,2,3]`: “In the second book Paul leaves the sietch from here to walk into the desert.” | Definite spoiler-gate mismatch from implementation itself: actual engine `lmOk` returns true at cumulative book I. No novel claim is needed to establish that the text explicitly labels its own spoiler as book II. | Remove the sentence from the book-I description. See exact base replacement and separate-entry constraints in builder-handoff. The historical scene and precise location remain passage-dependent. |
| DW05 / expanded | `caladan/castle/keep.desc` repeats “On the eve of the move”; earlier finding covered d1 only | S02 places Mohiam's visit within the preceding week, not a verified departure eve. | Apply “Before the move to Arrakis” to **both** fields. |

Primary source links S04–S07 and access failures are recorded in `sources.md`. Elantris e1/e2 gained opening-narrative support; Foundation terminal gained partial arrival/taxi support, not the follower's claimed affiliation. Edgedancer e35 now appears explicitly in the sample ledger and remains ending/landmark-unsupported. Supplemental *The Lesser Devil* provenance and Hyperion repaired-ship timing are evidence holds, not newly proved contradictions.

## Exact remaining gates

1. Builder applies DW02–DW05 and DW07; all require exact-new-head source recheck. DW01 is only its specific prior late-clause fix.
2. Resolve DW06 by primary passages **or explicit conservative omissions**. See per-object handoff and each ledger row. The opened excerpts do not reach these late scenes. No source-access completeness or language/edition expertise is asserted.
3. Obtain passages for 202 rows marked `not-compared`, and missing clauses in six partial rows; provide edition/chapter/page or authorized text with stable attribution. Book-number metadata identifies the claimed work, not proof it is correct. Supported opening narratives do not close other landmarks/events.
4. Supply the actual Iron Gold prologue and Light Bringer Holy Kill passage for the Society sample; independently review other new scenes before making a broader claim. Keep reconstruction geometry distinct from textual evidence.
5. Rendered/mobile/keyboard/timing acceptance remains unperformed under the browser/server prohibition. Existing CI and builder screenshots are not this reviewer's rendered verification.

No permission or executor denial blocks this continuation. **The limiting evidence is unavailable relevant primary text in the sources actually accessed**, detailed by ID in the ledger and handoff. Conservative cuts are feasible implementation work now; inventing confirmation is not. Status stays content-review/chatgpt because evidence acceptance is unfinished, while Claude's bounded fixes may proceed in parallel as directed.
