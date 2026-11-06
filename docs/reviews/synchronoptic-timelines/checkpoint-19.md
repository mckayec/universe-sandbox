# Timeline checkpoint 19: TL-R16 residual binding gaps and the validated Elath alias

Branch `engine/timelines` (draft PR #45), parent **7048abbbfe1770a11f1ec5052e6e5943cc997c6d** (checkpoint 18, the
reviewed head). Only `public/atlas/timeline-grounding.js` and `tests/atlas-timeline-grounding.test.ts` change, plus
this report and `tl19/` evidence. `timeline.js` and `timeline-view.js` are unchanged, so TL-R13 focus behaviour and
every earlier closure are untouched. The module is still unwired; no real relationship is promoted. Not merged.

Assignment: HANDOFF_PLAN.md "2026-11-04 — Checkpoint 18 return: finish the remaining binding safeguards" (c695c5e).

## Gap 1: support requirement and exact manifest are bound

- `bindingFor` now hashes a support manifest: the stated requirement (`true`, `false` or `null` when not stated) and,
  for each item in order, its id, role, purpose, claim, canonical citation components and citation provenance.
  Item state and item fingerprints stay outside the manifest, so a revoked or unaccepted item still reports itself
  by name.
- `supportRequired` must now be stated as a boolean on **every** row (checked before the binding, so the reason is
  explicit). Deleting it rejects, with or without support present.
- Rejected mutations, each applied after a promoted positive control, each also clearing the earlier promotion
  (`revoked`, `src` empty, `locator` null, `grounding` gone):
  - `supportRequired: true → false` with support removed: binding stale;
  - requirement deleted, support removed or kept: not stated;
  - one of two required items removed, or all removed: binding stale;
  - an item substituted, even with a fresh item fingerprint computed against the mutated row: binding stale;
  - an item claim weakened, or its citation language changed: binding stale;
  - a row approved with optional support then set to required: rejected.

## Gap 2: reviewed source provenance is bound

- `provenanceOf(c)` (exported) returns the exact label, exact URL and page language. The URL's only query must be a
  single three-letter `lang` code. Anything else (no query, an extra parameter, two `lang`s, a non-code value) is
  **unknown provenance** and defers the row, even when the passage components are unchanged. This applies to
  primary locators, independent evidence on both sides, and support citations. Re-binding a row cannot make it
  acceptable.
- The row binding and the support fingerprint now also hash `[label, URL, lang]` for every reviewed citation, next to
  the canonical components. `?lang=eng → ?lang=spa` and a respelled label both make the binding stale; tested for
  primary, independent and support citations.
- Endpoint card citations were already bound by exact label and URL (checkpoint 18).

## Gap 3: endpoint explanatory content is bound

- The endpoint snapshot now carries each record's `text`, `claim` kinds, scoped `notes` (kind, text, locator) and
  `notSame` guards (id, text), the fields the adapter actually builds in `timeline.js`. Changing any of them under a
  stable id, label and citation set makes the binding stale and revokes an earlier promotion. Tested: text changed or
  removed; note text, locator or kind changed; a note added; guard text changed or removed; claim kind changed; the
  other endpoint's text changed.

## Elath alias

`BD_ALIASES` holds exactly one validated full heading: **"Elath or Eloth" → `bd/elath`**, per the reviewer's check of
the official English entry (current title/URL identity, not an immutable edition). Regressions: the full heading and
its own slug pass; "Elath or", "Eloth", the full heading on `bd/eloth`, and on another entry all reject. No
first-word aliases. The census (`tl19/citation-census-output.txt`) moves exactly that one citation from
"dictionary entry does not match the URL" to valid; nothing else changes.

## Preserved

Supported-mode validation, forged-binding rejection, explicit withdrawal, idempotence, the original eight false
acceptances and two false rejections, and the containment controls all still pass unchanged. Existing fixtures now
state `supportRequired: false`; the support test's helper binds the row with its manifest before fingerprinting.

## Verification

- `pnpm format` run. `pnpm check` passed: format check, build, **153/153** tests (grounding file 15 → 18),
  `check:dist` 122 files. `pnpm test:pages` passed (12 pages × 2 viewports) and `pnpm test:browser` passed, with
  `CHROME_PATH=/opt/pw-browsers/chromium-1243/chrome-linux64/chrome`.
- Pilot dry run (`tl17/pilot-eligibility.mjs` against LDS pack `4ea8738`, output `tl19/pilot-eligibility-output.txt`):
  11/11 mechanically eligible, **0 promoted**; Babylon (row 10) still deferred.
- Real ledger (`tl17/grounding-ledger.mjs` against `4ea8738`): output byte-identical to `tl18/see-grounding.csv`;
  **0 class changes**, drawable 0, promoted 0.

## Next

After acceptance: the proposed-only versioned pilot sidecar, using a documented provenance-manifest revision as the
model source version (per the 2026-11-04 decision): pack/record content plus each reviewed source's URL, language,
known edition information and inspection date, with local snapshots distinguished from live pages. Not started in
this checkpoint.

## Run receipt

```json
{
  "project_id": "universe-sandbox/synchronoptic-timelines",
  "item_ids": ["TL-R16-gap1", "TL-R16-gap2", "TL-R16-gap3", "bd-elath-alias"],
  "actor": "claude (scheduled builder run)",
  "session_url": "https://claude.ai/code/session_01B94qrwD8rSREG142e3XjZa",
  "run_window_utc": { "start": "2026-11-04T09:46Z", "basis": "lock commit 90f0823 at 09:47:29Z; end = push of this commit" },
  "measured_usage": null,
  "measured_usage_note": "token and compute counts are not exposed to this run; none are estimated",
  "tests": "pnpm check, test:pages, test:browser run inside the window; durations not separately measured"
}
```
