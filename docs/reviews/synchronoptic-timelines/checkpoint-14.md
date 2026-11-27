# Timeline checkpoint 14 — wiring prerequisites: overview label, folded undated panels, undated search

Runtime head **491b71c74320f7f201791c01406e7d6017c9667c** (parent 7fc16c6, checkpoint 13). Assignment: HANDOFF_PLAN 2026-11-04 “Next timeline unit”
(accepted wiring prerequisites). PR33 untouched by this unit. **The adapter stays isolated and unwired**: no host
offers the Standard Works timeline. `createView` gained an optional `env.model` (an already-adapted model) used only
by the probe below; the Religious Traditions host is unchanged.

## Done

- **Overview label** (`timeline.js`, SW adapter): layerless codex cards (the pack’s own overview pages) now sit on a
  lane titled **“Standard Works overview”**, never “Other”. Only the SW adapter’s work lane is affected.
- **Collapsed per-work undated panels** (`foldUndated`, `FOLD_MAX = 12`; `timeline-view.js`): in the chart, a
  lane with more than 12 gated undated records is a native `<details>` panel, closed by default, summary
  “<work> · N undated, in source order” (44 px target, ▸/▾ marker, keyboard Enter/Space via the native control).
  Every gated record stays in the panel in pack order; the count is the gated count. A panel opens when the user
  opened it (remembered across rerenders and chart/list switches) or when it holds the selected or deep-linked
  record. Lanes at or under 12 are unchanged (Religious Traditions lanes are all under the threshold, so that host
  renders as before). **The list arrangement is unchanged and lists every row (TL-R02).**
- **Search across collapsed entries** (`searchUndated`): a “Find in undated records” field appears when a panel is
  folded. It searches the gated view (so closed panels are reached), undated only, in source order, first 40 shown
  with the total; results update in place without a rerender (focus stays in the field). Picking a match selects
  the record, opens its panel and moves focus to the row; the query survives rerenders.

## Evidence

- Unit tests (`tests/atlas-timeline-sw.test.ts`): overview lane title; folding threshold, closed default, gated
  counts, source order, opened/selected reveal, search reaching a closed panel in order, undated-only results, a
  book-1 gate filtering both panel contents and search.
- [tl14/tl14-fold-probe.mjs](tl14/tl14-fold-probe.mjs) with the **real PR33 pack** (4ea8738; runtime unchanged
  from 81f310d) at 390×844 and 1440×900: [result](tl14/tl14-fold-probe.txt) **40/40 PASS**, no console/page errors —
  5 folded panels (OT 525, NT 286, BoM 330, D&C 447, PGP 78; overview 1, unfolded), all **1,667** undated rows in the
  DOM, BoM panel in view order, search hit → panel opened + row focused, query kept, user-opened panel kept across
  list/chart, list mode unfolded, deep-link reveal, Enter toggles, 44 px summaries. Screenshots looked at:
  [390 panels](tl14/390-panels.jpg), [390 search](tl14/390-search-reveal.jpg), [1440 panels](tl14/1440-panels.jpg),
  [1440 search](tl14/1440-search-reveal.jpg).
- Recount at that pack: 1,667 undated (checkpoint 13’s 1,656 was at dd62a45; the pack has grown since).

## Not done (next timeline unit)

Per-relationship card-`src` grounding review (edge `src` stays empty, 0 drawable); actual host wiring; the host
chapter selector; record/relationship/travel sources; chronology/genealogy/succession; CH13/X08; physical devices
and assistive technology; 4K capture of the folded view; release gates.

## Checks at 491b71c74320f7f201791c01406e7d6017c9667c

`pnpm format`; `pnpm check` (format, build, check:dist, **135/135** tests); `pnpm test:pages` (12 pages × 2);
`pnpm test:browser` passed ([log](tl14/browser-smoke.txt)), Playwright Chromium 1243 via `CHROME_PATH`. Not merged.
