# Timeline checkpoint 12 — isolated Standard Works adapter and chapter-aware host gate

Parent: b0baa1b (checkpoint 11). Branch `engine/timelines` (draft PR #45). Not merged; no release acceptance.

## What changed

- **`adaptStandardWorks(pack)`** in `public/atlas/timeline.js` (proposal §2, “Standard Works” mapping), isolated: no host
  is wired to it, because the pack lives on `pack/lds-standard-works` (PR #33) and the atlas only offers the Timeline
  for packs with a `tree`. `adapterFor(pack)` names which adapter a pack would use (tree / Standard Works / none).
  - events with `when` → `institutional` records on one Church-history lane; every other event, site, route and codex
    card → an undated record on its work's lane (OT, NT, BoM, D&C, PGP), in pack order.
  - a site's `when` (a year or [from, to], as the atlas year filter uses it) → a dated `span`; no wording added.
  - a codex card's `date` text is kept verbatim as `whenText` and never parsed into a year.
  - dated routes → `travel` edges only between consecutive stops that are mapped sites; unmapped stops are counted
    (`omitted.travelLegs`), not bridged. The routes carry no source locator, so every travel edge is listed as
    unsourced and **not drawn**. Undated routes produce no travel edges.
  - codex `see` links → typed edges carrying the link's own wording (`same city` → same-entity, `described in` →
    describes, `within`, `quoted …` → quotation, everything else → context). Office relations (“member of the
    Twelve”, “appointed to …”) are `context`, never `succession`. Links to keys absent from the pack are counted
    (`omitted.danglingLinks`). A card's `src` is the card's citation, not the link's, so links stay unsourced (kept as
    `cardSrc` for review).
- **`chapterOk(gate, {book, chapter, cumulative})`** and host enforcement in `engine.js`: in a cumulative host, a record
  first seen in the current book with a `chapter` is shown only when the host knows the reader's chapter and it has
  reached it. This atlas host has no chapter selector (passes `chapter: null`), so such records stay hidden until the
  next book (fail closed). No book selected or single-book mode: this gate hides nothing. Current packs carry no
  `chapter`, so nothing visible changes.
- Coverage wording: when dated routes exist but their legs are unsourced, the migration gap now says so instead of
  “no routes with ordered, dated stops”.

## Evidence

- `pnpm check`: format, build, **131/131** tests (new `tests/atlas-timeline-sw.test.ts`, 5 tests on a synthetic
  fixture that mirrors the pack's field shapes), check:dist 121 files OK. `pnpm test:pages` 12 pages × 2 viewports OK.
  `pnpm test:browser` (Playwright Chromium 1243) passed.
- `tl12/sw-probe.mjs` on the real pack at PR #33 head 3b24180 ([output](tl12/sw-probe-output.txt)): 1,669 records
  (24 events, 34 sites, 9 routes, 1,602 codex cards), 30 dated (13 events, 12 sites, 3 routes, 2 cards), 313 edges
  (5 travel, 62 same-entity, 193 context, 8 describes, 37 quotation, 8 within), **0 drawn**; 3 travel legs omitted
  (unmapped stops), 9 dangling `see` links. Checks: one record per source object, unique ids, no event gains or loses a
  date, no succession/kinship invented.
- Checkpoint-11 browser probe re-run unchanged on this head (`tl12/tl11-rerun.mjs`): **PASS 40**, no console/page
  errors ([results](tl12/results.json); [1440 screenshot](tl12/1440-dragging.jpg), looked at: same as checkpoint 11).

## Findings for the reviewer (nothing changed for these)

1. One card (the “Standard works” overview in the `works` section) has no `layers` and lands on an “Other” lane.
2. 1,639 of 1,669 records would sit in the undated panel (corrected at checkpoint 13, TL-E02: 1,634 is the
   narrative subset; the five historical-but-undated cards are also undated). Wiring the view to this pack needs a per-work list
   (collapsed by default) rather than one flat panel; proposed for the wiring unit.
3. Whether a card's own `src` may serve as a relationship locator for its `see` links is a review decision; until
   then all 313 relationships stay listed, not drawn.

## Not done

Wiring the view to the Standard Works pack (needs both branches together and the per-work panel above); a chapter
selector in the host; genealogy/succession/travel sources; Apocrypha chronology; world calendars; empty record `src`
arrays on the Abrahamic pack; physical devices, real GPU, assistive technology.
