# Checkpoint 27 — folded-row connectors

PR45 `engine/timelines`, parent 4d022abe9fd2f525395736e041f9547c1479e9ec. Bounded unit requested by
independent-review-4d022ab.md. No pack, sidecar or source file changed; **0/12 real pilot relationships promoted**.

## What changed

- `timeline.js`: new pure `connectorEnds(edges, rowY, foldY, laneOf)`. An end in an expanded lane joins its own row;
  an end that is a **dated** record in a **collapsed** lane joins that lane's summary row and is flagged folded. Edges
  with both ends folded into the same lane are not drawn and counted (`inside`); edges with an end that has no chart
  row (undated records) are not drawn and counted (`offChart`) — they stay in the list and undated panels as before.
  Input is `V.drawnEdges` from the gated view, so record/edge gates (book, chapter, layer) apply before layout; edges
  without a source locator are still never drawn. Undated ends never attach to a summary row, so expanding a lane
  never makes a bracket vanish.
- `timeline-view.js`: chart uses `connectorEnds`; a folded end gets an open ring (`circle.tl-edge-fold`,
  `data-fold-edge`, `data-fold-end`, aria-hidden) at the nub, the path gets class `folded`, and its title adds
  "<record> is inside the collapsed <lane> lane; expand it for the exact row". Relationship wording, direction,
  type styles and the gutter (no x in the time axis) are unchanged. While a lane is collapsed the Overview adds one
  sentence each for folded brackets and relationships hidden inside one collapsed lane. `engine.css`: ring style.
- Behaviour change against tl8: collapsing a lane no longer removes connectors with one end elsewhere (tl8 asserted
  "fewer than 9"); they now stay, marked folded. Expanded layout is identical to the parent (unit test below).

## Evidence (this host, Node 22, Playwright Chromium 1243 headless, swiftshader)

- Unit tests (`tests/atlas-timeline.test.ts`, 3 new):
  - expanded lanes: `connectorEnds` gives exactly the parent's row-only set (9 ids, same order), none folded;
  - real pack, each lane collapsed in turn: every one of the 9 connectors is either drawn with ends on the exact
    row / summary row with the right folded flags, or hidden as `inside`; drawn+inside+offChart = all sourced
    non-self edges; no drawn connector has an undated end;
  - **synthetic fixture (labelled, not canon)**: chapter, book and layer downgrades remove gated ends before layout
    (`e1< e2< e3<` → ch≤4 `e1<`, book 1 `e1< e2<`, layer x only `e3<`), inside/offChart counted, folding moves with
    the collapsed lane.
- `pnpm check`: format, build, **165/165** tests. `pnpm test:pages`: 12 pages × 2 viewports.
- `tl27/folded-connector-probe.mjs` (actual host, real clicks on the lane bar, host layer chip clicked via DOM):
  **63/63** at 1440 and 390 ([output](tl27/folded-connector-probe-output.json)). Per lane: folded ends on the summary
  row with ring and title, other ends unchanged, inside edges hidden, Overview note matches, expand restores the 9
  row-exact connectors. Across all lanes: 2 folded, 8 inside (Judaism: 1 folded/2 inside; Christianity: 1/6).
  Screenshots looked at: `tl27/tl27-1440-folded.jpg`, `tl27/tl27-390-folded.jpg` (Judaism collapsed, ring on its
  summary row).
- History regression kept: `tl26/history-browser-probe.mjs` rerun at this head **38/38**.

## Limits (not claimed)

- The real-pack layer downgrade is weak: with Judaism collapsed, switching Islam off leaves the same 7 drawn
  connectors (none of the 9 touch Islam-only gates), so it shows only "nothing outside the active layers"; the gating
  proof is the synthetic unit test. No real chapter-gated relationships exist (Standard Works pack on PR33 has 0).
- Parent run of the new probe not made (it asserts rings the parent does not render). No device/AT, no 3840 shot,
  no mobile 1714-row performance. Folded rings are not separately focusable; the list view remains the nonvisual
  alternative. O-1, TL22-E2, PR33 integration, full technical qualification and Mckay's release approval stay open.

## TL27-E1 evidence correction (requested by independent-review-97674ad.md)

Probe-only change; **no application file changed** against 97674ad (`public/`, `src/`, `tests/` untouched).

- `tl27/folded-connector-probe.mjs` now reads every y in the root SVG user space (point × `getCTM`), including the
  actual rendered `.tl-sum-bar` centre of each collapsed lane keyed by its `data-lane-t`. The per-lane predicate
  (`judge`) requires every folded path end **and** its ring to equal that lane's bar centre (|Δ| < 0.01), expanded
  ends to equal their own row, inside edges hidden, rings only on folded ends, and the title. A lane with no dated
  record on the chart (Encounters: 7 records, 0 dated) has no bar; that is accepted only because it has no chart
  marks, and any folded end there would still fail.
- Live-DOM negative controls, for each lane that folds a connector (Judaism, Christianity) at both widths: (1) the
  folded path end and its ring moved **together** 26 px off the bar — **rejected** (the reviewer's false positive);
  (2) a re-render restores an accepted state; (3) the ring alone moved 26 px — **rejected**. 8/8 controls.
- The Overview note is now compared by its numbers (folded and inside counts parsed from the text) instead of
  phrase presence: 1/2 for Judaism, 1/6 for Christianity, none for the others.
- Retained: expanded 9-connector baseline, per-lane expand restore, layer downgrade with a lane collapsed and
  restore, no page errors.

Results at this head (Playwright Chromium 1243, swiftshader, 1440×900 and 390×844):
**75/75** ([log](tl27/folded-connector-probe-log.txt), [output](tl27/folded-connector-probe-output.json)); bar centres
Judaism 91 / Christianity 415 at 390. `pnpm check` 165/165. History regression `tl26/history-browser-probe.mjs`
**38/38** ([output](tl27/history-browser-output-tl27e1.txt)). Screenshot `tl27/tl27-1440-folded.jpg` re-taken and
looked at (ring on the Judaism summary bar; note reads "1 bracket ends … 2 relationships …"). No real mismatch
found, so no application rewrite. Limits above are unchanged.
