# Checkpoint 30: rendered year-filter (`yr`) restoration (evidence only)

Head under test: PR45 **0650d33a00e9fe152001d15c07bdeed774ceaca6** (runtime identical to daeaf39; no application change in
this checkpoint). Control: the same built dist with parent **1ceb4b2** `public/atlas/engine.js` (before the O-1
popstate filter fix). Answers the carried "rendered year controls" gap from independent-review-daeaf39.md and
independent-review-0650d33.md.

## Probe

[tl30/year-history-probe.mjs](tl30/year-history-probe.mjs): actual atlas host on the built dist (temp copy), Religious
Traditions pack with the tl26/tl28 synthetic chapter fixture (test fixture only). Seven entries at book 1, ch 5, Earth
surface: full range; explicit `yr=-500_100` + Karaite selected; explicit `yr=600_1500` + Covenant selected; `yr`
omitted + Karaite; Judaism-only with `yr` omitted; Judaism-only `yr=1800_1950` + Karaite; explicit `yr=-500_100` with the
timeline closed; `yr` omitted, closed. Navigation: same-document link (`location.hash`), then real Back through all
entries and Forward through all entries, at 1440x900 and 390x844.

Each entry asserts together: URL `yr` and `S.range`; the rendered host year controls (both range inputs' values,
`aria-valuetext`, readout text, track fill `--a/--b`, "All years" button present only with a range); rendered Chronicle
events (`#track .ev`) equal to the full-range baseline for the same layers intersected with an independent overlap rule,
and each explicit range must hide at least one event (55/60, 41/60, 9/17 hidden); rendered Earth site labels (all ten
Earth sites are undated, so this only shows `yr` hides none); and with the timeline open, `tlsel`, the rendered
`.tl-it.sel` row, and exact timeline list-id set equality with an independent copy of the host timeline gate. The
timeline view is not year-filtered by design (its `ok` gate is book/chapter/layers), so `yr` must leave its ids unchanged.

## Results

| Run | Result |
|---|---|
| head 0650d33 | **194/194 pass** — [output](tl30/year-history-output-head.txt) |
| parent 1ceb4b2 `engine.js`, same dist otherwise | **114 pass / 76 fail** — [output](tl30/year-history-output-parent-1ceb4b2.txt): explicit-`yr` entries keep the stale range on link, Back and Forward, Chronicle sets diverge, stale selections; at both viewports Back to entry 0 left the atlas document, so remaining Back cases at that viewport were not run (disclosed, not counted) |

`<input type="range">` sanitizes values to `min + n*step` (axis min −799, step 10), so the probe expects the snapped
input value and checks the unsnapped range on the track fill; e.g. `yr=600_1500` renders inputs 601/1501 with fill and
readout at 600–1500.

## Chapter-path control (carried from checkpoint 29)

[tl29/real-chapter-path.mjs](tl29/real-chapter-path.mjs) against the parent 1ceb4b2 dist:
[output](tl30/real-chapter-path-output-parent-1ceb4b2.txt). 2 PASS (book I click, chapter select), then the 1440 real
Timeline click hit the same Playwright 30 s actionability timeout seen in TL22-E2 (consistent with, not shown to be, software-GL frame starvation). **Parent
control still incomplete (2 cases, harness timeout); not relabelled as passed.**

## Observation (not fixed; pre-existing, `layers.js`)

R30-1 (Low): at full range the "to" input sits at its snapped value 2021 (max 2030). A `change` on either handle without
moving it makes `readRange()` compute `[-800, 2021]`, which `clampRange` keeps as a real range, so items dated 2022–2030
would be hidden and `yr=-800_2021` written. Reasoned from source; not exercised by a probe; not touched here.

## Not covered

Physical device/touch/AT; default-off layers; hand-typed hashes naming a surface hidden by their own filters; dragging
the year handles by real pointer input (this probe uses URL/link/history input only); full technical/canon qualification;
Mckay release approval. `pnpm check` not rerun (no runtime change); build used for the dist: `pnpm build` at 0650d33.
