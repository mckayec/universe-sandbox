# COS-BB-001 revision 3 — independent design review

Reviewed 2026-11-07 against proposal blob **b33398a26fd18f694192a9c5f29c26fc184d1c10** on main. Compared with [revision 2 review](design-review-v2-2026-11-07.md), blob a34b82028ade0ef8500ca472aae30c0f5afb68f4. This is design acceptance only. PR37's accepted bounded Elantris return at **ffc8ba7c6734f38839f3eca974b96c04a1a1c098** is not reopened.

## Dispositions

| Group | Finding and revision 3 disposition |
|---|---|
| GATE-01 | Accepted at design level, retained: untagged fallback requires every work in a mapped bucket; it is marked unreviewed and excluded from tagged coverage. |
| GATE-02 | Closed at design level. Section 2a rejects empty outer/inner clauses, bad alternatives and unknown IDs before evaluation. Buckets must be known, nonempty and validated. An absent optional field gate inherits the effective record/ancestor gate; a present invalid gate hides its field. A field cannot rescue an unusable record gate. Explicit public content does not use an empty-clause loophole. |
| GATE-03 | Closed at design level under the explicit revision-3 conflict rule below. Invalid explicit URL state and invalid stored state enter an empty safe read set before rendering, with no All/storage fallback. Duplicate/conflicting parameters fail closed. No storage write or URL cleanup silently dismisses the error. Delayed callbacks must be cancelled and rechecked. Valid intentional legacy defaults remain separate. |
| GATE-04 | Accepted at design level, retained and extended. All eight test families remain required; families 3/5 cover invalid gates/buckets/inheritance, family 6 tests invalid input with both empty storage and stored All plus the first frame, and family 7 tests pending callbacks in the safe state. Actual-source VM tests and rendered negative controls remain required implementation evidence. |

**4/4 requirement groups accepted at design level; 2/2 residual revision-2 groups closed. Zero implementation tests executed by this document review.**

## One editorial inconsistency; controlling rule fixed for implementation

Section 3's opening URL bullet still repeats the revision-2 sentence saying work-level state wins when `book` and `upto`/`read` coexist. Its later revision-3 bullet expressly says this is replaced: more than one reading-state parameter is a conflict and is rejected whole. The latter, stricter rule is the accepted contract, consistent with family 6's explicit `book`+`read` negative control. **No precedence or permission union is accepted.**

Claude should remove the obsolete sentence while preparing the authorized implementation. Exact replacement for that sentence:

> More than one of `book`, `upto`, and `read` is a conflict and enters the safe state described below; no reading-state parameter takes precedence over another.

This is a finite editorial cleanup with a specified outcome, not a request for a fourth design loop. Test `book`+`upto`, `book`+`read`, `upto`+`read`, all three together, and repeated same-name parameters under both storage conditions. Public fields still inherit record/ancestor restrictions; `public: true` cannot override an ancestor or a present `needs` restriction.

## Owner scope choice and remaining gates

Record D08 in [DECISIONS.md](../../universes/DECISIONS.md):

- **a:** Phase 1 only, preserving public legacy behavior.
- **b (recommended):** Phase 1 plus researched work mappings, one reviewable bucket at a time, and preset selector.
- **c:** b plus the explicit per-work checklist UI.

The recommendation is a scope choice, not permission to ship. The canonical work list and record mappings still need evidence; placeholder IDs and the 33-row starting inventory are not an accepted catalogue. Proposed test cases are not passed tests. **0/33 full-book audits approved.** Any implementation must return its exact SHA and independent source/runtime evidence; final technical acceptance and Mckay's separate release approval remain required.

**Verdict: design accepted with the explicit conflict-rule interpretation above. Await Mckay's a/b/c scope choice (D08); no implementation, full-book canon, merge or release approval.**
