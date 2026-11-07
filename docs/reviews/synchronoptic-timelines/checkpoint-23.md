# Timeline checkpoint 23: host-validation return for TL22-E1 / TL22-E3 (TL22-E2 qualified; 0 promoted)

Branch `engine/timelines` (draft PR #45), parent **5228e3564e61e3721faf16a00fccfe2913c8c10b** (checkpoint 22,
bounded wiring accepted by independent-review-5228e35.md). **Docs/evidence only: no application file changed**
(`public/`, `src/`, `tests/` identical to the parent). Not merged. **0 real relationships promoted.**

Probe: `tl23/host-layer-probe.mjs` → `tl23/host-layer-probe-output.txt`, **68/68 checks passed**, exit 0. Same harness
as `tl22/actual-host-probe.mjs` (unchanged): built `dist/` of this head plus the PR33 pack 3e3701f (blob
3d279a757303e6ae7e80c358a6f6e041269eb82c) and one registry line in a temp copy only; 1440x900 and 390x844; variants
not-opted-in (pack as shipped) and opted-in (harness appends the committed tl20 proposed sidecar). Playwright
Chromium `/opt/pw-browsers/chromium-1243/chrome-linux64/chrome`, `--use-gl=swiftshader`. `pnpm check` 159/159.

## TL22-E3 (exact list membership) — closed

Each comparison computes the expected record-ID set in the page from the actual adapter model using an independent
copy of the host gate (engine.js `treeNodeSeen` book gate, chapter gate with no chapter selector, layers.js
`layerOk`) for the state the probe set, and requires: rendered list-row id set (`.tl-list` dated + `.tl-und` undated
`.tl-it[data-id]`) **equal** to it (missing 0, extra 0, no duplicates), the `Relationships · N` header and its `<li>`
count both equal to the expected edge count, and `AtlasTimeline.visible()` with the same predicate agreeing. Run in
five states per width/variant (20 comparisons, all exact):

| state                                         | records | edges |
| --------------------------------------------- | ------- | ----- |
| All books, all layers                         | 1714    | 342   |
| NT layer off (host chip)                      | 1428    | 316   |
| NT layer back on                              | 1714    | 342   |
| fresh load `layers=ot,bom,dc,pgp`             | 1428    | 316   |
| Old Testament only (book gate, mode `single`) | 526     | 52    |

The checkpoint-22 thresholds (>1000 / >100) are superseded by these equalities; a partial render now fails. The first
draft of this probe used only `.tl-list` and correctly failed (30 of 1714: the undated rows sit in `.tl-und`), which
is the kind of partial render the check is meant to catch.

## TL22-E1 (actual layer interaction) — closed, with one reachability qualification

The host's own layer bar (`#filters [data-layer]`, the atlas chip that calls `toggleLayer` → `applyFilters` →
`TLV.refresh`) is used, not a view-internal control. Per width/variant, with the timeline open in list mode:

- `s:capernaum` (gate `layers:["nt"]`) selected from its list row: `tlsel` set, detail shows Capernaum.
- NT chip off: chip `aria-pressed=false`; URL `layers=ot,bom,dc,pgp`; selection, list row, detail text and `tlsel`
  removed; undated search finds 0; exact set equality 1428/316 (10 NT-gated edges plus edges to NT records gone,
  342→316); timeline stays open.
- NT chip on: chip pressed; `layers` removed from URL; row and search restored; exact equality 1714/342. The earlier
  selection is not resurrected (same rule as a book downgrade).
- Fresh document load of `#tl=1&layers=ot,bom,dc,pgp&tlsel=s:capernaum`: NT chip unpressed, the gated-out `tlsel` is
  revalidated away, record absent, exact equality 1428/316.

**Qualification:** `elementFromPoint` at the chip centre is not the chip while the timeline panel is open
(`topIsChip:false` at both widths): the open timeline covers the layer bar, so a real user switches a layer by
closing the timeline, toggling, and reopening. The probe activates the chip with `element.click()` (TL22-E2 scope);
the state transition it exercises is the same host path a real toggle takes. Whether the timeline should expose its
own layer control is a design question for later, not part of this return.

**Observation O-1 (pre-existing host behaviour, not changed):** navigating to a URL that differs only in its hash
(same-document navigation) applies `tl`/`tlsel` but not `layers`; a real load applies all three. No leak results (the
selection is re-validated against the unchanged layer state). The probe therefore goes through `about:blank` before
each load; the first draft without it failed the fresh-load cases for that reason.

## TL22-E2 (real input) — still qualified, now measured

One bounded real Playwright attempt per width/variant (reported as INFO, not counted):

- 390x844: real `page.click('#tlBtn')` opened the timeline in 7.8–8.2 s; real `keyboard.press('Escape')` closed it in
  ~0.7 s (both variants).
- 1440x900: real `page.click('#tlBtn')` timed out at 15 s (both variants), so real Escape was not attempted.

So real pointer/keyboard open/close works at phone width under software WebGL but is slow, and still times out at
1440 where the scene renders more pixels. This remains an environment/performance limit of swiftshader, not a pass:
real focus/navigation and real 1440 input remain unverified and need hardware GPU or device evidence.

## Unchanged / still open

0/12 real relationships promoted; sidecar format and loader unchanged; chapter fail-closed unchanged. Chapter
selector and folded-row connectors remain planned work for the next checkpoints. Mobile performance with 1714 rows,
device/AT, PR33 integration and Mckay's release approval remain open.
