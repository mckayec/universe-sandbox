# Timeline checkpoint 16 — TL-R12 idempotent reveal and TL-R13 keyboard/focus model

Parent: 85ccb8e (checkpoint 15). Branch `engine/timelines` (draft PR #45). Not merged; no release acceptance.
PR33 untouched (pack read at 4ea8738 for the probe only). Adapter still isolated and unwired; real promotions stay 0.
TL-R14/TL-R15 (grounding parser/containment) are **not** in this unit; they are next, as one source-guard unit.

## What changed (`public/atlas/timeline-view.js` only)

- **TL-R12, idempotent reveal.** Activating a search result calls a new `reveal(id)`: the record must still pass the
  gate (a gate-excluded record is never unhidden); its lane is expanded if collapsed, its panel opened even when it
  is already selected or was closed by hand, the query and selection are kept, and focus moves to the record's
  actual visible row (never a copy inside a closed panel). Repeated activation of the same result no longer toggles
  the selection off.
- **TL-R13, focus model.** One `shown()` test (connected, enabled, laid out, not inside a closed `<details>` other
  than as that panel's own summary) is used by Tab wrapping, arrow movement and focus recovery. Tab/Shift+Tab now
  include the native controls (search field, panel summaries) and exclude anything hidden. After a gate change that
  removes the focused record, focus goes to a visible control; if nothing could take focus it falls back to Close,
  never `body`.
- **TL-R13, roving tab stop for undated lists (new this run).** Each undated list is now one Tab stop: the selected
  row if it is in that list, otherwise the first row. ArrowUp/ArrowDown/Home/End move inside the list and carry the
  stop with them; clicking or revealing a row makes it the stop. Before this, an open Book of Mormon panel put
  330 rows in the Tab order, so Close and the other panels were hundreds of presses away. The undated section's
  one-line note now says "Each list is one Tab stop; arrow keys move within it." Applies in chart and list modes.

## Evidence

`tl16/tl16-interaction-probe.mjs` drives the real Standard Works pack (PR33 4ea8738) through the unwired adapter at
390×844 and 1440×900: **66/66 PASS, 0 FAIL** (`tl16/interaction-probe-output.txt`). Covered at each width:

- first and repeated activation of the same search result (selection, `aria-pressed`, focus, query kept);
- three rounds of closing the panel by hand then revealing again; collapsed lane then reveal (lane state cleared);
- chart → list → chart interruption (list keeps every row) then reveal;
- roving stop: the open BoM list (330 rows) has exactly one `tabindex=0`, on the selected row; ArrowDown/ArrowUp in
  source order, End/Home, one Tab leaves the list, Shift+Tab returns to the list's current stop;
- full Tab cycle from the search field back to it (70 stops) and the same 70 in reverse with Shift+Tab; never
  outside the dialog, never hidden, never stuck; closed panel summaries reached (5);
- Enter and Space on a closed summary toggle it and keep focus;
- gate change removing the focused record: focus on a visible control (Overview heading), selection cleared, gated
  panel and search hit gone, every panel count equals the gated view, a stale `show(id)` for the excluded record
  leaves it hidden, a D&C record is still revealable, D&C panel in source order;
- no console or page errors.

Probe note: the atlas globe keeps rendering behind the timeline dialog, and under software GL it starved the main
thread (a bare `evaluate` took ~0.7 s, one key press ~1.9 s), which is why the checkpoint 15 WIP run never finished.
The probe now stops scheduling globe animation frames after setup; the timeline view uses no animation frames, so
this does not change what is being tested. Real-device performance of the open dialog over a live globe is a
separate, still-open question for device acceptance.

Screenshots: `tl16/390-reveal-after-close.jpg`, `tl16/1440-reveal-after-close.jpg` (reveal after a chart/list
round trip; record detail shown beside/below the list).

Checks at this head: `pnpm check` (format, build, 140/140 tests, check:dist 122 files) pass; `pnpm test:pages`
12 pages × 2 viewports pass; `pnpm test:browser` passes. Browser: system Chrome (`CHROME_PATH=/usr/bin/google-chrome`)
with SwiftShader, not matched-browser, physical-device or assistive-technology acceptance.

## Still open

- TL-R14/TL-R15 grounding guard corrections and the 8 + 2 fixtures from the 2026-11-04 review (next unit), then the
  versioned review sidecar and the bounded 12-row pilot. Real promotions stay 0 until per-row semantic acceptance.
- Host wiring/chapter selector; chronology, genealogy, succession, travel provenance; CH13/X08; device/AT; release.
- Visual: the selected undated row's highlight is subtle in the screenshots; worth a look during host wiring.
