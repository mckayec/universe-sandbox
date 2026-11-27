# Timeline checkpoint 28 — O-1 same-document layer restoration

Parent **1ceb4b224b5343f06116ccd581cb1ceb10ad9f5f** (PR45 `engine/timelines`). Head: the commit that adds this file.

## Change (one function, `public/atlas/engine.js`)

The popstate transaction (TL25-R1) applied chapter then timeline state but ignored `layers`/`yr`, so Back/Forward and
same-document hash links kept the in-memory filters (O-1, checkpoint-23). It now runs, inside the same `urlHold`
transaction: `chapterFromURL` → **`filtersFromURL`** → `tlFromURL`, then one normalized `syncURL()`.

`filtersFromURL(st)`:

- reads the incoming `layers`/`yr` from `parseHash()`; a missing key means all layers / full range — exactly what
  `urlFor()` omits, so every entry the atlas wrote round-trips;
- no-op when the incoming set and range equal the current ones (Set equality, not identity);
- otherwise sets `S.layers`/`S.range`, then the same consequences as `applyFilters()` (drop a filtered-out event, site,
  rebuild site labels) and `refreshAll()` — so the timeline gate already sees the incoming layers when `tlFromURL`
  restores the selection;
- does **not** call `ascend()` (it may call `history.back()` during a popstate). A selected world hidden by the incoming
  layers is deselected at once in the galaxy view, or after the popstate handler's own ascent in the world view.

Fresh-load restoration (`restoreFromURL`) is unchanged.

## Evidence

[tl28/layer-history-probe.mjs](tl28/layer-history-probe.mjs): actual host, built dist in a temp copy, Religious
Traditions with the tl26 synthetic chapter fixture (Karaite ch 3, Covenant ch 5; fixtures only). Seven same-document
entries mixing chapter, `layers`, `tl`, `tlsel` (incl. Judaism off → Karaite gated out and `tlsel` dropped; only
Judaism; only Judaism at ch 2 → chapter gate; only Islam closed; key removed → all layers + Covenant). Each entry, on
link, Back and Forward, at 1440x900 and 390x844, asserts together: URL `layers`, engine active set, host chip
`aria-pressed`, chapter, timeline open/`tl`/`tlsel`, and (when open) exact list-id and relationship set equality against
an independent copy of the host gate for that entry's {book, chapter, layers}.

| Run (Chromium `/opt/pw-browsers/chromium-1243`) | Result |
|---|---|
| fix (this head) | **96/96** — [output](tl28/layer-history-output.txt) |
| parent 1ceb4b2 `engine.js`, same dist otherwise | **48/96, 48 fail** — every layer-bearing entry keeps stale filters — [output](tl28/layer-history-output-parent-1ceb4b2.txt) |
| tl26 history probe (chapter-history regression) on fix | **38/38** — [output](tl28/tl26-history-regression-output.txt) |

Probe note: relationship counts are scoped to `.tl-list .tl-edges > li`; the tl26 selector also counted a selected
record's own details-panel relationships (tl26 never compared with a selection open, so its results are unaffected).
The first fix run with the unscoped selector showed exactly that 2/3-item excess on Karaite/Covenant selections.

`pnpm check` 165/165 (format, build, tests); `pnpm test:pages` 12 pages x 2 viewports pass. No pack, sidecar, source
eligibility or ledger change; 0 real pilot relationships promoted.

## Not covered (carried)

Hand-typed hashes naming a surface view of a world the same hash's layers hide (the atlas never writes that) keep the
surface open. Packs with layers off by default: a fresh load of a URL without `layers` uses the defaults while
Back/Forward treats it as all-on, matching what `urlFor()` writes; no current pack has a default-off layer. Other
carried limits as in independent-review-1ceb4b2.md (TL22-E2, real close→chapter change→reopen, mobile 1714-row
performance, device/AT, chapter gates outside the timeline, PR33 integration, full technical qualification, Mckay
release approval).
