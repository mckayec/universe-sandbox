# Timeline checkpoint 20: proposed-only twelve-row pilot sidecar and provenance manifest revision 1

Branch `engine/timelines` (draft PR #45), parent **133519a2fcdb8c67e8082fa59b6eb340b41b7b5f** (checkpoint 19, accepted
in independent-review-133519a.md). Docs/evidence only: no file under `public/` or `src/` changes. The adapter stays
unwired; **0 real relationships promoted**. Not merged.

Assignment: independent-review-133519a.md "next" and HANDOFF_PLAN.md "2026-11-04 — Twelve-row relationship-source
pilot" plus the "Source-version decision for the proposed pilot".

## Files (`tl20/`)

- `pilot-sidecar.v1.json` — the proposed sidecar (`kind: atlas-timeline-review-sidecar`, review version 1). Twelve
  rows keyed by edge ID: **11 `proposed`** (recommendation `accept`) and **1 `deferred`** (row 10, Babylon,
  recommendation `defer`, unchanged). **0 `accepted`.** Each row carries pilot row number, exact endpoints, existing
  type and label (blank stays blank), direction via `from`/`to`, mode (`shared` 7, `independent` 5), bounded claim,
  scope caveat, basis, primary `src` (shared) or paired `evidence` (independent), `supportRequired`, support items,
  `sourceVersion`, a current-content `binding` and `endpointsUnchangedSincePinned`.
- Supplementary support is a separate role, never in `src`/`evidence`: row 3 `s3-dc30-heading` (D&C 30 heading:
  full names) and row 9 `s9-mosiah13-abinadi` (Mosiah 13:1–6, 33–35: Abinadi continuity). Both rows set
  `supportRequired: true`; both items are `state: proposed` with a support fingerprint. Both locators parse to
  canonical components (heading `dc-testament/dc#30`; verses `bofm/mosiah#13` 1–6, 33–35).
- `manifest` (revision 1): `sourceVersion = lds-standard-works/timeline-pilot@r1;pack-blob:<bound blob>`; bound pack =
  PR33 head **3e3701ffcc4131200f0993e52f8f14a509016ced**, blob **3d279a757303e6ae7e80c358a6f6e041269eb82c**; pilot-read
  pack = **4ea873875f73746a754bd537deaaebb1a58d586b**, blob **6918d1bb10697cc026da6a007247d01519f533ca**; ledger
  `tl15/see-grounding.csv` at 85ccb8e, blob b4b9f10. **17 source URLs**, each `lang: eng`, edition **unknown** (no
  immutable identifier exposed), inspected 2026-11-04 by the ChatGPT pilot, **live page, no local snapshot, content
  hash null**. Limits recorded: current English online pages only, headings are editorial apparatus, front matter is
  a document, refresh/change needs revalidation, the pack is not source-reviewed as a whole.
- `pilot-sidecar.mjs` — builds the file from the handoff wording against both packs and dry-runs it through the real
  module. `dry-run-output.txt` — its output.

## Reconciliation (pinned → current pack)

The Standard Works pack changed between the pilot read (6918d1b) and PR33's current head (3d279a7). For each row the
script compares `currentSnapshot` (edge id/from/to/type/label and both endpoint records: label, sourceId, section,
citations, text, claim, notes, notSame guards) between the two packs: **12/12 unchanged**. No endpoint, type, label or
citation needed reconciliation, so no row was re-bound to different content. Bindings are computed against the
current pack; any later pack change makes them stale by design.

## Dry run (actual `timeline.js` + `timeline-grounding.js` at 133519a)

- Mechanical: **11/11 recommended rows eligible**; row 10 not eligible (`to evidence is not cited by that card`), as
  the handoff anticipated.
- `applyEdgeSources(model, rows)`: **promoted 0, rejected 12, revoked 0**; 11 rejected `eligible=true` with
  `review state is proposed, not accepted`; row 10 rejected `eligible=false`. Model edges with grounding: **0**.
- Reproducible: re-running the script yields byte-identical output and (after Prettier) an identical JSON file.
- `pnpm check`: format, build, **153/153 tests**, check:dist 122 files OK.

## Boundaries

Bindings and fingerprints are consistency checks, not authorization; nothing here may be flipped to `accepted`
without explicit per-row review against current content. No new primary-source reading was performed; claims and
scopes are the handoff's wording. Host/adapter wiring, folded-row connector rendering, chapter selector,
chronology/identity/source limits, device/AT and release gates remain open.
