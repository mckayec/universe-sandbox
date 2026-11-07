# Timeline checkpoint 21: host loading of the review sidecar (proposed rows only, 0 promoted)

Branch `engine/timelines` (draft PR #45), parent **5e2639281d267287884a45a28655f1e545a6655d** (checkpoint 20,
accepted in independent-review-5e26392.md for proposed-sidecar format and bindings). Not merged. **0 real
relationships promoted**; no real row is labelled accepted anywhere.

## What changed

- `public/atlas/timeline-grounding.js`: `loadSidecar(model, sidecar, {packId, sourceVersion})`. The host, never the
  sidecar, declares the model's source version; a host that declares none promotes nothing. Every call reconciles via
  `applyEdgeSources`, so an earlier promotion cannot survive. Statuses: `absent` (no sidecar), `invalid` (kind,
  review version, pack, rows not a map, manifest names no source version — nothing read), `stale` (manifest source
  version ≠ host's — nothing read), `ok` (rows applied; any row whose binding no longer matches the current edge is
  listed in `changed` and rejected by the existing acceptance check). Recommendations are never states.
- `public/atlas/timeline-view.js`: `createView` calls `loadSidecar` **only when the host passes a `sidecar` key** (even
  `null`), before the first `compute()`; the report is exposed as `view.grounding`. Promoted sources still go through
  `AtlasTimeline.visible(model, ok)`, so the atlas's book/chapter/layer gate applies to them like any edge.
- `public/atlas/engine.js`: the host opts in only for a pack that declares `timelineReview` (passing it and
  `timelineSourceVersion`). **No pack declares it**, so every current atlas behaves exactly as before.
- `public/atlas/index.html`: loads `timeline-grounding.js` (pure, defines one global) before `timeline-view.js`.
- `tests/atlas-timeline-sidecar.test.ts` (6 tests, synthetic fixture only): synthetic accepted positive control;
  absent / wrong kind / wrong review version / other pack / rows as list / no manifest version / stale manifest
  version / host declares no version — each promotes 0 **and revokes** a prior synthetic promotion; changed endpoint
  text, endpoint citation, edge label → listed `changed`, rejected "binding is stale"; proposed row with
  recommendation accept → rejected (eligible, "proposed, not accepted"); native ledger source untouched by an absent
  sidecar; narrowed read state hides the promoted edge from `edges`/`drawnEdges`, `revalidate` drops a selection of it
  and search finds neither the claim nor the hidden endpoint.

## Actual-pack probe (`tl21/`)

`host-sidecar-probe.mjs` loads the committed tl20 sidecar through `loadSidecar` against the actual Standard Works
pack at PR33 **3e3701ffcc4131200f0993e52f8f14a509016ced** (blob 3d279a757303e6ae7e80c358a6f6e041269eb82c) and this
branch's `timeline.js` + `timeline-grounding.js`. Output in `host-sidecar-probe-output.txt`:

| Run | status | promoted | rejected | grounded edges |
|---|---|---|---|---|
| host version = manifest version | ok | 0 | 12 (11 "proposed, not accepted"; 1 Babylon "to evidence is not cited by that card") | 0 |
| absent sidecar | absent | 0 | 0 | 0 |
| host declares no version | stale | 0 | 0 | 0 |
| host version differs | stale | 0 | 0 | 0 |
| sidecar for another pack | invalid | 0 | 0 | 0 |

`changed` = 0 at the bound pack, matching checkpoint 20's 12/12 unchanged reconciliation.

## Checks (this head)

- `pnpm format`; `pnpm check`: format, build, **159/159 tests** (153 + 6 new), check:dist 122 files OK.
- `pnpm test:pages`: 12 pages × 2 viewports passed. `pnpm test:browser`: passed (CHROME_PATH = installed Chromium).
- Playwright, built preview, `atlas/?pack=abrahamic-world-religions` at 1440×900 and 390×844: grounding module
  loaded, timeline opens, 0 console/page errors, rendering unchanged (pack does not opt in).

## Not done / still open

The Standard Works atlas host itself is still not wired to the timeline (engine offers the view only for `tree`
packs; `adapterFor` knows the SW adapter but the engine does not use it) — wiring it is a public behaviour change and
needs its own review. No sidecar is shipped in any pack. Folded-row connector rendering, chapter selector,
chronology/identity/source limits, per-row source acceptance, device/AT and Mckay's release approval remain open.
