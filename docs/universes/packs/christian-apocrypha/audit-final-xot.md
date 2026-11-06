# Final source-sensitive recheck: expanded OT and Isaiah/Baruch

Date: 2026-10-29. Reviewed implementation `1e256ceb3ac797ab998c6b7af0edb41d31c8da6f`, against previous `8ae91333461bfeb989b570857a0aba321eaa34df`. Read exact-head GitHub pack blob `60c384ef8a11d5624842ee9ca9fbbf425a97a05c` and freshly reopened the three source witnesses below. This is a targeted correction recheck, not a new exhaustive audit of the entire pack.

## Results

| Finding | Status | Evidence |
|---|---|---|
| APB-012 | Resolved at exact head | Pack line 1510 now puts the stone double while Jeremiah finishes speaking, followed by his return and stoning and placement of the stone at his tomb. Matches [4 Baruch 9:24–32, registered longer-text mirror](https://intertextual.bible/read/4-baruch). |
| APB-013 | Resolved at exact head | Pack line 554 now explicitly distinguishes open praise in the sixth heaven from disguise and nonrecognition below it. Matches [Ascension 10:19–31, Charles](https://www.earlychristianwritings.com/text/ascension.html). |
| APB-014 | Resolved at exact head | Pack line 1295 now attaches day 1 to the initial Haran departure and day 16 to departure from the Well of the Oath. Matches [Jubilees 44:1,8, Charles](https://wesley.nnu.edu/sermons-essays-books/noncanonical-literature/noncanonical-literature-ot-pseudepigrapha/the-book-of-jubilees/). It retains the witness's anomalous Haran reading and literary-calendar qualification. |

No new source mismatch established in these three corrected entries. No permission/access blockers; no remote changes.

## Fresh primary checks for final random sample

Matched the three assigned objects in `/tmp/apocrypha-final/sample.json` against the exact-head pack and the following freshly opened selected witnesses; **3/3 pass**.

| Sample key | Source/passages | Outcome |
|---|---|---|
| `codex:places:228:The waters of Dan` | [1 Enoch 13:7–8, Charles](https://wesley.nnu.edu/sermons-essays-books/noncanonical-literature/noncanonical-literature-ot-pseudepigrapha/book-of-enoch/) | Pass. Enoch sits at these waters, reads the petition, falls asleep and receives a dream. “Unlocated” is appropriately a modern map disposition, not a claim that the source lacks relative geography: the source gives Dan/Hermon but establishes no exact modern coordinate here. |
| `codex:visions:14:The firmament` | [Ascension of Isaiah 7:9–12, Charles](https://www.earlychristianwritings.com/text/ascension.html) | Pass. Isaiah sees Sammael's hosts and conflict/envy among Satan's angels in the firmament. The pack keeps this as a visionary setting, with no earthly coordinate. |
| `codex:people:78:Edna daughter of Danel` | [Jubilees 4:20,27, Charles](https://wesley.nnu.edu/sermons-essays-books/noncanonical-literature/noncanonical-literature-ot-pseudepigrapha/the-book-of-jubilees/) | Pass. Verse 20 makes Danel's daughter Enoch's wife; verse 27 separately gives Methuselah a wife named Edna, daughter of Azrial. Distinguishing them is source-faithful. |

These three sample entries are additional to the three corrected entries rechecked above; no unsupported claim of sampling all 20 is made here.

## Q03: responsible scope disposition

Read `research-review.md`, `research-addendum.md`, and builder resolutions in `audit-build.md` on main. Q03 specifically asks which registry copy strings are verbatim modern-translation quotations **so that paraphrase is not flagged as drift**. Its premise is that the builder will paraphrase regardless. It does not request exhaustive legal clearance or make identification of every inherited research quotation a separate release condition.

The addendum establishes original concise visitor prose, passage/edition provenance, conservative treatment of modern editions, and no presumption that punctuation confers reuse rights. The builder explicitly accepts Q03's addendum disposition. Thus the practical build-audit question can be resolved without misrepresenting the missing inventory.

Suggested status: **Build-audit purpose resolved; exhaustive registry quotation inventory deferred and unverified.** Evaluate paraphrase for meaning and attribution, not exact textual identity. Retain the inventory gap as research provenance debt, to be completed before any future direct reuse of registry wording. Do not claim the inventory exists, every string is legally cleared, or copyright has been exhaustively certified. This finding alone need not block build-content canon review, subject to the parent's full checklist and any separate explicit gate; it does not clear technical, publication or release gates.

Suggested addendum wording: “Q03 is dispositioned for this paraphrase-only implementation: source-faithful paraphrase is not drift, and exact source/edition provenance remains required. The requested exhaustive registry quotation inventory has not been performed and remains deferred research work, not a verified rights certification. This disposition does not authorize direct reuse of research copy or override separate release gates.”

No wholesale modern-text similarity comparison was performed in this recheck. The above is a workflow-scope judgment grounded in the recorded question and accepted builder response, not a substitute for a rights audit.
