# COS-BB-001 revision 2 — independent design review

Reviewed 2026-11-07 against proposal blob **576052c6d49afde444c3e8167ec9916390b58ba1**. Design only; no implementation exists to certify. Prior review: [implementation-review-ffc8ba7.md](implementation-review-ffc8ba7.md). Accepted Elantris changes at PR37 **ffc8ba7c6734f38839f3eca974b96c04a1a1c098** are not reopened.

## Disposition: 2/4 requirement groups closed at design level

| Requirement | Revision 2 assessment | Disposition |
|---|---|---|
| GATE-01, untagged fallback | Whole mapped bucket must be read; fallback visibly marked unreviewed and excluded from tagged coverage. The mb1-only Harmony/Sazed negative control is explicit. | Closed at design level, subject to GATE-02's nonempty/valid mapping rule below. |
| GATE-02, Boolean and inherited gates | DNF req, ANDed needs, parent conjunction and field conjunction address the central problem. Empty inner clauses and missing optional field gates remain ambiguous. | Finite revision required. |
| GATE-03, state and migration | Legacy numeric state stays legacy; preset versions and explicit set IDs avoid silently adding newly published works. However malformed work-level reading intent falls back to stored state or All. | Finite revision required. |
| GATE-04, evidence plan | Eight families, checked/total denominators, actual engine/pack execution, rendered negative controls at two widths and cancellation/downgrade checks are specified. | Closed at design level; add residual cases below to existing families. Zero implementation tests executed or passed by this design review. |

## Required revision A — GATE-02: make empty and inherited cases explicit

Section 2 says an inner clause is true iff every member is read, but only defines an empty outer array as false. Under that definition, `[[]]` is vacuously true. A missing bucket registry can create the same accidental allow-all when applying “every work in the bucket.”

Specify the following outcomes in the evaluator contract and tests:

- Reject an empty inner clause, malformed clause, unknown work ID, or missing/empty bucket registry as invalid/hidden. A bad OR branch must not be silently discarded to accept the rest. If genuinely public content is needed, define an explicit public/neutral policy rather than using an accidental empty clause.
- Whole-bucket fallback is allowed only for a known, nonempty, validated mapping; it never counts as reviewed per-work tagging.
- Distinguish absent optional field restriction from a record with no usable gate. A field with no additional restriction inherits its valid effective record/ancestor gate; an explicitly present malformed field gate hides that field. A record with neither a valid gate nor a valid fallback remains hidden. This resolves the apparent conflict between optional field gates and the instruction to fail closed for any field with no gate/no bucket.

Required cases in test families 3/5: `[]`, `[[]]`, mixed empty/valid alternatives, unknown ID within an otherwise satisfiable alternative, missing/empty bucket, inherited unannotated field, and explicitly invalid field gate.

## Required revision B — GATE-03: invalid reading intent must not reveal All

Section 3 currently says malformed numbers, unknown work IDs/presets and cross-pack IDs are ignored, falling back to stored state or All. A reader following `#read=misspelled-id` with no stored state can therefore receive all spoilers. A toast does not undo the disclosure. The same risk occurs when permissive stored state wins after an invalid restrictive link.

For explicit invalid reading-state input, fail closed before rendering: show a neutral error/empty safe reading state and let the reader deliberately choose a valid mode. Do not silently reuse All or a more permissive stored state. Keep the intentional no-parameter legacy default and explicit `book=0` behavior separate from malformed input.

Also define:
- simultaneous `read` and `upto` (reject conflict or choose documented deterministic precedence without combining their permissions);
- explicit empty `read=`, duplicate parameters and malformed/out-of-range legacy numbers;
- unavailable preset version and invalid persisted work-level state;
- a failed parse must not briefly render the old/All state before the error.

Add these to family 6, with both empty storage and previously stored All; rendered negative controls must show that protected names/text never appear. Existing family 7 should exercise delayed callbacks after the safe error state too.

## Next action and preserved scope

Claude revises only the proposal to close these two finite residual groups. Then ChatGPT can accept the design and record a concrete a/b/c scope choice for Mckay. Do not present implementation as approved or start work-level tagging from placeholder IDs. Canonical work inventory/mappings still require research; **0/33 full-book audits are approved**.

**Verdict: changes requested for GATE-02 and GATE-03; GATE-01 and GATE-04 accepted at design level. Return to Claude for a bounded proposal revision.**
