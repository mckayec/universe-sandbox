# Timeline checkpoint 18: TL-R14 residual, TL-R16 current bindings, supplementary support role

Branch `engine/timelines` (draft PR #45), parent `c87c9a2` (the checkpoint-17 head ChatGPT reviewed). Scope:
`public/atlas/timeline-grounding.js` and `tests/atlas-timeline-grounding.test.ts` only. `timeline.js` and
`timeline-view.js` are unchanged, so the TL-R13 focus/containment behaviour accepted at `c87c9a2` is untouched. The
adapter stays unwired; real promotions remain **0**; no pilot row was applied.

## TL-R14 residual (parser identity)

- **Bible Dictionary:** the complete title must name the URL entry. The title's slug (lowercase, non-alphanumeric
  runs → `-`) must equal the URL slug (`Galilee, Sea of` → `bd/galilee-sea-of`, `Shushan` → `bd/shushan`), or the
  title must be in an explicit `BD_ALIASES` table. First-word similarity no longer passes: `Galilee` and
  `Galilee, Lake of` against `bd/galilee-sea-of`, `Shushan Palace` against `bd/shushan` all reject.
- **The alias table is empty.** The pack's `Bible Dictionary: Elath or Eloth` → `bd/elath` therefore **fails closed**.
  I did not add an alias, because I have not checked the official entry's title. If ChatGPT confirms that `bd/elath`
  is the official entry for that title, it becomes one alias line. Census: 3 BD citations in the pack, 2 valid,
  1 fail-closed (`tl18/citation-census-output.txt`). No relationship class changes because of it.
- **Chapter zero:** a URL chapter `0` is not an official scripture URL, and a label chapter `0` is rejected
  (`D&C 0`, `D&C 0:1`, `D&C 0` on a `/dc/1` URL, `Genesis 0–2`).
- Unsupported heading/notes and appended-note sections still fail closed. No document identity was invented.

## TL-R16 (current bindings)

- **Mode:** `mode` must be exactly `shared` or `independent`. A row with any other mode is rejected (`eligible: false`,
  "unsupported review mode"). A row with no mode is checked as shared only so the report can say whether it is
  mechanically eligible; `acceptance()` still refuses it ("review mode is not stated").
- **Binding:** each row carries `binding`. The module recomputes it **from the current model on every call**
  (`bindingFor(model, edgeId, entry)`). It covers:
  - the model's declared `sourceVersion`;
  - the edge's id, endpoints, direction, type and label;
  - each endpoint's id, label, source id, section and full citation list (`t` and `u`);
  - the row's claim, mode, scope, and the canonical components of its locators or evidence.

  If anything changes under stable IDs, the stored value no longer matches and the row is deferred. The comparison
  is always against the live model, never against a copy of the approval. A changed row claim or locator also makes
  the binding stale.

- **Source version:** `entry.sourceVersion` must equal `model.sourceVersion`. A model with no declared source version
  binds nothing. The Standard Works adapter does not declare one yet, so even a correctly formed sidecar promotes
  nothing until the host declares a version. That is deliberate.
- **Reconciliation:** every call clears every promoted edge first and re-promotes only what that call accepts. The
  following are all revoked: an omitted row; an explicit `withdrawn`, `rejected` or `deferred` row; a row whose
  binding went stale. Re-applying the same accepted row is idempotent and reports no revocation.
- Exported for a sidecar generator: `currentSnapshot`, `bindingFor`, `supportFingerprint`.

## Supplementary support role (pilot rows 3 and 9)

`entry.support: [{ id, role: 'support', state, purpose, claim, src, fingerprint }]` and `entry.supportRequired`
(boolean).

- **Validation:** each support citation must parse to a canonical identity, with the same fail-closed parser. Each
  item must be `accepted`, name its purpose and claim, and carry a `fingerprint` equal to `supportFingerprint`. That
  fingerprint binds the item to the current edge binding, the model source version, its purpose and claim, and its
  canonical components.
- **Separate from the primary source:** support is **never** containment-checked against the endpoint cards. It never
  enters `edge.src` or `locator`, and never widens the primary locator. It is stored apart as `edge.grounding.support`.
- **Deferral:** when `supportRequired: true`, missing support defers the row. Any present support item that is
  revoked, unaccepted, invalid or stale also defers the row, whether support is required or not. Support present
  without a stated requirement defers too.
- **Pilot:** the 11 recommended pilot rows stay **recommendations only**. `tl17/pilot-eligibility.mjs` rerun against
  this module: still 11/11 mechanically eligible, 0 promoted. Babylon (row 10) is still deferred and unchecked.

## Tests (tests/atlas-timeline-grounding.test.ts, 9 → 15)

Existing fixtures now carry `mode`, `sourceVersion` and a computed `binding`. The new tests cover:

- full dictionary-title mismatch and the Elath fail-closed case;
- chapter zero;
- unknown modes (`paired`, `Shared`, `shared `, `independant`);
- a changed edge label, endpoint label, endpoint source id, endpoint citations, citation URL, model source version,
  missing source version, row claim, and a row source version updated without rebinding;
- absent and forged bindings: empty, made up, or bound to another model, claim or locator;
- explicit withdrawal, rejection and deferral, idempotent re-application, and a binding that goes stale on a later call;
- support: missing, valid (stored apart, primary locator unchanged), revoked (clears the earlier promotion), changed
  citation, changed claim, invalid citation, wrong role, unbound, source-version change, unstated requirement,
  optional-but-unaccepted.

The original eight false acceptances still reject. The two false rejections are still eligible but unapproved.

## Verification

- **Tests and checks:** `pnpm format` was run. `pnpm check` passed (format check, build, 150/150 tests,
  `check:dist` 122 files). `pnpm test:pages` passed (12 pages × 2 viewports) and `pnpm test:browser` passed, both with
  `CHROME_PATH=/opt/pw-browsers/chromium-1243/chrome-linux64/chrome`.
- **Real ledger** (`tl17/grounding-ledger.mjs` against LDS pack `4ea8738`, output `tl18/see-grounding.csv`):
  - classes: 73 shared-verse, 14 shared-chapter, 9 same-chapter, 229 cross-text, 5 no-locator, 5 travel;
  - 0 class changes against checkpoint 17;
  - drawable 0, promoted 0.
- **Census** (`tl18/citation-census.mjs`): 1,697 records with 2,653 citations. Every invalid citation is listed by
  reason. Most are JST, superscription, study-note and inline-note forms that have no approved identity rule; they
  stay fail-closed.

## Run receipt

```json
{
  "project_id": "universe-sandbox/synchronoptic-timelines",
  "item_ids": ["TL-R14", "TL-R16", "pilot-support-role"],
  "actor": "claude (scheduled builder run)",
  "session_url": "https://claude.ai/code/session_01B94qrusSR42z7ZjqGvUy2Z",
  "attempt_id": "checkpoint-18",
  "observed_start": "2026-11-04T08:47:12Z",
  "observed_end": null,
  "duration_seconds": null,
  "duration_type": "elapsed_run_window",
  "timestamp_source": "container `date -u` at lock creation; end recorded in the status commit, not here",
  "outputs": [
    {
      "item_id": "TL-R14",
      "status": "returned for review",
      "label": "BD full-title identity, chapter zero",
      "evidence_url": null
    },
    {
      "item_id": "TL-R16",
      "status": "returned for review",
      "label": "mode validation, current binding, reconciliation",
      "evidence_url": null
    },
    {
      "item_id": "pilot-support-role",
      "status": "returned for review",
      "label": "validated support role; pilot not applied",
      "evidence_url": null
    }
  ],
  "measured_usage": {
    "input_tokens": null,
    "cached_input_tokens": null,
    "output_tokens": null,
    "reasoning_output_tokens": null,
    "total_tokens": null,
    "credits": null,
    "estimated_usd": null,
    "billed_usd": null,
    "source": null
  },
  "coverage_notes": [
    "No provider usage counters are exposed to this run; all usage fields left null.",
    "Elapsed window covers setup, implementation, tests and doc writing for all three items; not allocated per item.",
    "pnpm check wall time about 20 s (08:50:59–08:51:19Z, container clock); not added to the run window."
  ],
  "recorded_at": "written before commit; see the commit timestamp"
}
```

## Next

1. **ChatGPT:** review this exact head.
2. **After the guards are accepted:** I return the versioned review sidecar with current bindings and support items for
   pilot rows 3 and 9, as recommendations for bounded review. This needs a declared host source version. I propose
   the adapter take `pack.sourceVersion`, with the pack declaring the scripture edition it cites.
3. **Then:** the four queued Cosmere corrections (CB01–CB04) on PR #37, as a separate content patch.

Not merged; no release acceptance.
