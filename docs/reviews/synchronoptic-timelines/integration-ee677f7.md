# Integration receipt: PR45 onto main at ee677f7

2026-11-26 UTC, Claude (builder subagent). Covers G1 (integration) and G2 (phone keyboard check) from
[packet-review-420c1e7.md](packet-review-420c1e7.md). Nothing was merged into main or deployed.

| | |
|---|---|
| PR | #45 `engine/timelines` (draft) |
| Previous candidate | 420c1e77f50c9c34a433f00b4062911cc422c42b (checkpoint 31) |
| main merged | **5210bbab** (Merge PR #47; contains PR39 and PR33). Old merge base was 9cefeac. |
| Integrated head | **ee677f7a2c622cde82f6fc5adc7c84bfb80738ef** (a merge commit; no rebase) |
| PR base | Retargeted from `pack/abrahamic-world-religions` to `main` (REST PATCH). GitHub now reports `mergeable: true`. |
| Delta vs main (non-doc) | 15 files, +4821/-18: the timeline feature only |

## Conflicts and resolutions (5 files: the same 5 the packet predicted)

| File | Resolution |
|---|---|
| `public/atlas/engine.js` (7 hunks) | Kept everything from both sides. From main: the compact book picker (`BOOK_PICK`, `.picker`, `renderBookPicker`), the `onebook` class, `#labels` moved after the panels, `cxPick`, `S.route`, `cancelEvFocus()` in `applyFilters` and the book handler, and the codex re-render in `refreshAll`. From PR45: the chapter selector, Timeline button and `#timeline` dialog host, `S.chapter`, the focus-preserving `renderFilters` (R30-1), `renderChapterSel()` and `TLV.refresh()` in `refreshAll`, and resetting the chapter when the book changes. Main's picker changes book by clicking the hidden `data-b` buttons, so the chapter reset covers it too. |
| `public/atlas/engine.css` (2 hunks) | Phone `#filters` rule: kept main's comment (the rule is the same on both sides). Kept both PR45's timeline styles and main's compact-picker styles. |
| `public/atlas/packs/registry.js` | Main's pack list (adds lds-standard-works and christian-apocrypha). The Abrahamic entry keeps PR45's `relationship-sources` part. |
| `tests/atlas-layers.test.ts` | Kept both tests: PR45's R30-1 year-handle test and main's work-picker test. |
| `tests/browser-smoke.mjs` | Took main's `assertSaveLoadRoundTrip` helper (`browser-persistence.mjs`). It replaces PR45's inline paused Save/Load fix for the same flake. |

Nothing else had to change in the code. The Escape handling, the Tree and Timeline dialog stacking (z-index 21) and the
timeline modules are the same as at 420c1e7.

### Fit to main's data (one test file, not a conflict)

`tests/atlas-timeline.test.ts` failed 3 tests after the merge because main's released Abrahamic pack differs from the
pack that PR45 was built on. Main's ABR01 audit marked ch-early-communities, ch-baptist, ch-strang-movement and
jud-ananites (and some related records) as undated. The timeline model handles this correctly: the coverage count goes
from 91 dated / 78 undated at 420c1e7 to 83 / 86 now. As a result, 6 connectors now have two dated ends (was 9), and
none of them crosses lanes. The only cross-lane pair was Second Temple > early communities.
- The connector counts changed from 9 to 6, with a comment explaining why.
- The real-pack fold test now checks that `foldedSeen === 2 × crossLane` (which is 0 on main's data) instead of
  `foldedSeen > 0`.
- Cross-lane folding is still covered by the existing synthetic-fixture test, which is unchanged.

## Checks at ee677f7 (all run in this session)

| Check | Result |
|---|---|
| `pnpm format` | clean (no changes after the resolution) |
| `pnpm check` | format:check OK, tsc + vite build OK, **432/432** unit tests, check:dist **127 files OK** |
| `pnpm test:pages` | **15 pages × 2 viewports** passed |
| `pnpm test:browser` | passed on the first run (the known flaky Save/Load wait did not occur): `savedCount 22, restoredCount 22` |
| tl28 layer-history probe | **96/96** pass (`tl28-layer-history-output-ee677f7.txt`) |
| tl30 year-history probe | **194/194** pass (`tl30-year-history-output-ee677f7.txt`) |
| tl31 year-handle probe, 1440 + 390×844 | **16/16** pass, 8 per size (`tl31-year-handle-output-ee677f7.txt`) |
| G2 phone keyboard probe (new) | **23/23** pass (`g2-phone-keyboard-output-ee677f7.txt`, script `g2-phone-keyboard-probe.mjs`) |
| Runtime errors | 0 page or console errors in every probe and in all screenshot runs |
| GitHub CI on ee677f7 | `build` was still in progress when this receipt was written |

## G2: phone keyboard qualification

The run used Playwright's `iPhone 13` descriptor: a 390×664 CSS viewport, DPR 3, isMobile, hasTouch and the mobile
Safari user agent, on Chromium with swiftshader. Every step uses real keyboard input on the focused control. After
**every** step the probe asserts the exact `from` and `to` input values, the exact readout text, `S.range`, the URL
`yr`, and which handle has focus. The packet review asked for asserted values rather than logged ones.

- **Full range.** The `to` handle steps ←, →, ←, End: 2021 gives "800 BCE – 2021" (-800_2021), then back to All years,
  then 2021 again, then All years. The `from` handle steps →, Home: -789 gives "790 BCE – 2030" (-790_2030), then All
  years.
- **From `yr=600_1500`.** The `to` handle steps →, ←, End: 600_1511, then 600_1501, then 600_2030. The `from` handle
  steps →, Home: 611_2030, then All years. In every step, focus stayed on the handle that was moved.
- **Timeline dialog.** Enter on the focused `#tlBtn` opens the dialog with focus on Close and adds `tl=1` to the URL.
  40 Tab presses and 10 Shift+Tab presses never left the dialog (17 distinct stops). ArrowDown moves between chart marks.
  Enter selects a mark, which sets `tlsel`, shows its details and keeps focus inside. Escape closes the dialog, returns
  focus to `#tlBtn` and removes `tl` from the URL.

**Limits.** This is emulation only:
- There is no on-screen keyboard. Playwright sends key events straight to the focused element, so an iOS software
  keyboard, a hardware keyboard paired to an iPhone, Full Keyboard Access and VoiceOver were not exercised.
- No real touch or pointer drag was tested (G3 stays unverified).
- This is not WebKit or Safari, and there is no physical device or GPU (G4).

**G5 is still present.** At 390 wide, `#tlBtn` sits at x=384–473, so it starts off-screen in the phone header strip.
Main's new `›` header-overflow affordance only appears in landscape (`max-height:520px and (pointer:coarse)`), so it does
not help in portrait. Keyboard focus reaches the button, but this run did not test that.

## Screenshots (viewed)

Taken with `--use-gl=swiftshader --enable-webgl --ignore-gpu-blocklist` at deviceScaleFactor 1. The Timeline was opened
by keyboard from the default Abrahamic view. All files are under 500 KB.

| File | What I checked |
|---|---|
| `timeline-1440x900-ee677f7.png` | Chart: lane bar on two rows, axis 400 BCE – 1800 CE, connector brackets in the left gutter, Overview/coverage panel showing 83 dated / 86 undated / 129 relationships. |
| `timeline-390x844-ee677f7.png` | Phone layout: header wraps, lane bar scrolls sideways, details panel stacked below the chart. Nothing overlaps. |
| `timeline-1280x800-ee677f7.png` | Close wraps to a second header row. A control capture of 420c1e7 at 1280 shows the same wrap, so this is not caused by the integration. |
| `timeline-3840x2160-ee677f7-scaled50.png` | The 4K capture, downscaled to 1920×1080 and palette-quantized to fit the size limit. All lanes fit on one row, the full axis is visible, and nothing is clipped. |
| `atlas-1440x900-ee677f7.png`, `atlas-1280x800-ee677f7.png`, `atlas-390x844-ee677f7.png` | The atlas behind the timeline. Main's header, layer chips, year bar and dossier render correctly. The Timeline button shows at desktop sizes and is off-screen at 390 (G5). |

## Status of the gaps

- **G1:** done at ee677f7, pending ChatGPT's bounded integration review.
- **G2:** run in emulation, 23/23 plus tl31 at 390 (8/8), with the limits stated above.
- **G3–G9:** unchanged from the packet. G6–G9 were not re-run. Main's data change reduces the real dated cross-lane
  connectors to 0, so cross-lane fold behaviour on real data now rests on the synthetic-fixture test only (relevant to G9).
