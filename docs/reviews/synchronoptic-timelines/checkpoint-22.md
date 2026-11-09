# Timeline checkpoint 22: Standard Works adapter wired into the actual atlas host (0 promoted)

Branch `engine/timelines` (draft PR #45), parent **2cdef89f2518551ac5750be5abfd27c7adc5fa46** (checkpoint 21, loader
accepted in bounded scope by independent-review-2cdef89.md). Not merged. **0 real relationships promoted**; no real
row is labelled accepted anywhere; no sidecar is shipped in any pack.

## What changed

- `public/atlas/engine.js`: the host offers the Timeline button and container for any pack that has a timeline
  adapter (`AtlasTimeline.adapterFor(pack)`: tree packs, and `lds-standard-works`), and builds the view from that
  adapter's model. Before, only tree packs got a timeline. The existing gate is unchanged and applies to every
  record and edge: atlas book gate (`treeNodeSeen` on the shared `{layers, books, first, chapter}` gate), the
  chapter gate with `chapter: null` (this host has no chapter selector, so in a cumulative pack a record gated to a
  chapter of the current book stays hidden), and the layer gate. The sidecar opt-in is unchanged (only a pack that
  declares `timelineReview`; none does).
- `public/atlas/timeline-view.js`: when a host opts in, the reconciliation outcome is written to
  `#timeline[data-tl-grounding]` (`<status> promoted=<n>`) so the actual host can be checked without a global. The
  Overview intro now takes `model.intro` / `model.relatedWord` when an adapter supplies them (tree wording unchanged).
- `public/atlas/timeline.js`: the Standard Works adapter supplies its own Overview wording (lanes are dated history,
  dated places and journeys, then one lane per book of scripture); it no longer says "Each lane is a tradition".

No pack, sidecar, binding or record data changed. The tl21 real-pack probe still gives
`ok promoted=0 rejected=12 changed=0` (11 proposed, 1 Babylon containment).

## Evidence (this head, terminal output committed in `tl22/`)

- `tl22/reviewer-view-probe-output.txt`: ChatGPT's committed `tl21/reviewer-view-probe.cjs`, run unmodified with
  `CHROME_PATH=/opt/pw-browsers/chromium-1243/chrome-linux64/chrome` (the sandbox's Playwright Chromium; ChatGPT's
  environment blocked sockets): **14/14 scenarios passed**, 8 assertions each, 1440 and 390 widths. This also ran
  14/14 on the parent 2cdef89 before any change.
- `tl22/actual-host-probe.mjs` → `tl22/actual-host-probe-output.txt`: **52/52 checks passed.** The real host
  (built `dist/`, engine.js + index.html loader) with the PR33 pack 3e3701f (blob
  3d279a757303e6ae7e80c358a6f6e041269eb82c) added in a temp copy only, at 1440x900 and 390x844, two variants:
  pack as shipped (not opted in) and harness opt-in with the committed tl20 proposed sidecar plus the host-derived
  source version. Per width/variant: Timeline button offered and on screen; opens (dialog visible, `tl` in URL);
  grounding `ok promoted=0` (opt-in) / no sidecar read (shipped); 1714 records / 342 edges, 0 grounded; list mode
  renders all 1714; undated search finds Capernaum; Escape closes and drops `tl`; fresh load with
  `#tl=1&tlsel=s:capernaum` restores the open timeline with that selection; downgrade to OT (pack mode `single`)
  drops the selection, the record and `tlsel`, and search no longer finds it; NT restores it; own Close, reopen,
  Back closes, Forward reopens; 0 page/console errors.
  Note: controls are activated with `element.click()` / dispatched events, because under software WebGL the 3D
  scene starves Playwright's mouse/keyboard input pipeline (a real mouse click timed out at 30 s; the DOM path
  is the same handler).
- `pnpm format`; `pnpm check`: format, build, **159/159 tests**, check:dist 122 files OK. `pnpm test:pages`: 12
  pages x 2 viewports passed. `pnpm test:browser`: passed.
- Screenshots (looked at): `tl22/tl22-not-opted-in-1440-chart.jpg`, `-390-chart.jpg`, `-390-selected.jpg`,
  `tl22-opted-in-1440-list.jpg`.

## Not done / still open

- The Standard Works pack itself is on PR33 (awaiting Mckay, D05); this branch only wires the host. Until both are
  merged, the public site shows no Standard Works timeline. Merge order/rebase is a release-time step.
- The actual SW pack has **0 chapter-gated records** and uses spoiler mode `single`, so the host's chapter
  fail-closed rule is exercised only by unit tests and the synthetic probe, not by real SW data.
- The lane bar wraps to three rows at 1440 and scrolls horizontally at 390; at 390 the era row shows only
  "Utah period". List mode renders all 1714 rows at once (fine on desktop here; not measured on a phone).
- Folded-row connectors, chapter selector, per-row source acceptance (0/12 accepted), full runtime/CI qualification,
  real-device/AT checks and Mckay's release approval remain open. Not a release request.
