# Saved-work recovery checkpoint — 2026-10-26

This checkpoint publishes documentation already saved after `9dc046b27d835dfedabe61259e72520ca27c6617`. Research stopped for usage limits and was not resumed during recovery. These are research artifacts for continuation, not a declaration of comprehensive research readiness or build/release approval. PR24 re-review is preserved unchanged. PR27 description is managed by the parent and was not overwritten.

## Recovered artifacts

- `joshua-allotment-register.md/.csv`: 602 contextual place/feature records, not 602 distinct locations.
- `late-history-relationship-register.csv`: 829 contextual records; `late-history-relationship-contexts.csv`: 145 contexts; `late-history-literal-relation-pairs.csv`: 182 expressions. These are saved extraction outputs awaiting final integration; no standalone late-history relationship methodology document was present in the recovered changes.
- `ot-history-relationship-payload.csv`: 156 payloads. Its current coverage document reports 52 chapters; older audit rollups still say 145 rows/44 chapters and require reconciliation.
- `nt-relationship-expansion.md/.csv`: 50 context rows; `nt-people-roster-payload.md/.csv`: 191 typed assertions; three NT relationship source-witness metadata rows.
- Record-support/audit artifacts: BoM195, D&C323 heterogeneous rows, geography15 CSV rows plus four gazetteer checks described separately, NT218, early OT187, late-history/major-prophet230. Additional Bible, wisdom, Restoration and core/PGP audit reports and existing coverage/correction edits are included. These overlapping denominators must not be summed as unique entities or claims.

## Minimal recovery validation

All 14 newly recovered CSV files parse with consistent column widths. Their explicit record/context/payload identifiers are unique where the first column is an identifier; family/shard category columns are intentionally repeated. `git diff --check` passes. The existing source-witness validator verifies 2,975 capture references across ten manifests with no missing manifests or hash errors against the private archive. This verifies available capture bytes, not reading, extraction completeness or historical truth. No canon rereading, broad audit or new research was performed for this recovery.

The raw source archive remains private at `/workspace/lds-source-evidence/20261026/` and is **not uploaded to GitHub**. Public metadata contains URLs, retrieval information and hashes; another checkout will not automatically contain these raw captures. Retrieve sources from the cited official URLs or arrange access to the retained private evidence. No wholesale raw copyrighted source captures are part of this commit.

## Work still open

Reconcile late-arriving extraction counts and completeness statements across the coverage/audit/status files; validate and integrate the saved dense-list payloads, aliases, earliest gates and typed links; resolve global identity/cross-link questions without forced same-name unions; finish the acceptance decision against repository requirements. A known uncompleted consistency edit is AP09 (Sea of Galilee): the integration reconciliation proposes the neutral entity at gate1 using Numbers34:11 and the official identification, while the Bible inventory retains gate2 for its NT setting. Preserve source-specific claims when resolving it. The 1,587 screening rows and record-support counts do not themselves establish final completeness. Historical/model access limits and uncertain geography remain as documented. Research status remains incomplete; do not advance to the next universe on the strength of this recovery alone.
