# Explicit event/journey reference disposition

2026-10-26, resumed integration after recovery commit `d04d4c70b51ae3948f44675d2518b87a41a7f614`. This is a bounded identifier/link audit of existing research, not another canonical reading pass, historical verification or completed atlas validator. Existing source copy, witness provenance and identity qualifications remain controlling.

## Results and exact scope

The reproducible scan of the core, five supplemental inventories (including geography), and eight coverage Markdown shards identifies **337 event/journey table occurrences, representing312 file-scoped owner keys**. This includes repeated source views and audit crosswalks; neither count is a unique-event denominator.

`reference-disposition.csv` records **387 explicit reference occurrences:376 place handles,6 concept references and5 movement references**. All387 resolve to existing declarations. Four initially apparent missing D&C places—DP13,DP14,DP16,DP28—are declared in the named-place prose block in `coverage-dc.md`; the generator includes that block explicitly. No invented place declarations are needed to repair them.

The scan recognizes the documented uppercase P/AP/BP/RP/PP/DP/BXP/OH-P/WP-P and NTP place-handle forms in matched event/journey rows. It also includes backticked lowercase references already declared in table first columns. Lowercase strings without a matching declaration, prose names, relationships in person payloads, chapter-card crosswalks not matching an event/journey prefix, and hypothetical schema fields are outside this syntactic check. A resolved key proves that a declaration exists, not that every semantic link or source-specific gate is correct. Duplicate declaration locations preserve source views; they do not authorize duplicate engine entities.

## Every no-key occurrence has an explicit disposition

`reference-disposition-contexts.csv` retains all149 matched table occurrences without a recognized explicit target:

- **126 distinct nonspatial reference-only contexts:** preserve their authored narrative copy and source citations under `context::<file-stem>::<owner>`. These keys identify reference entries, **not physical places**. They can remain in the global reference library under the source work's gate. No Earth site or event-to-place edge is authorized by this disposition.
- **13 duplicate context views:** reuse the first context key for that file/owner; do not create another event or place.
- **10 secondary views of keyed records:** retain the existing owner and keyed references from the main ledger; the source view adds no new place identity by itself.

Each row includes the exact retained authored context, its location and the nonspatial constraint. This is an implementation-usable exclusion from spatial serialization, not a claim that all those passages lack named places. Some name places already represented elsewhere; others contain unnamed settings, compressed routes, symbolic/visionary movement or explanatory content. A later optional physical-place union requires the relevant identity/source evidence. No name matching is used here to force one.

The existing `integration-reconciliation.md` and `identity-register.md` govern shared aliases and deliberate non-merges. Do not lower event gates to a linked place's earlier gate. In particular E08's D&C account remains gate4 while its P11 woods link is usable only with the PGP detail at5; the scanner's resolved P11 target is not permission to expose that link at4. The AP09 neutral lake correction is separately owned by the central integration pass, with NT ministry detail still gated2.

## Reproduction and acceptance limit

Run `python docs/universes/packs/lds-standard-works/validate-reference-disposition.py` to regenerate both CSVs and print counts/missing handles. This writes the two ledger files; review their diff. CSV widths and reference/context uniqueness can be checked independently. Line numbers locate this snapshot and can move after edits; the owner keys and filenames remain the lookup contract.

This closes the bounded explicit-reference existence check and supplies a safe reference-only disposition for the identified no-key rows. It does **not** certify exhaustive prose-name alias reconciliation, original-source accuracy, chronological harmonization, every earliest gate, atlas rendering or research-ready acceptance. Those decisions belong to the central acceptance audit. No new source access or invented geography was required.
