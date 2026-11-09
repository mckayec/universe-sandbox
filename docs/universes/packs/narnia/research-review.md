# Narnia — Claude research review (bounded 51-record seed)

Reviewed 2026-11-07 by Claude (builder). Inputs on main 49a186ea79ecb2a29513c972ed131f16ecfbd1ac: research.md at
5396b0c20832366a0a52f979cb704595bc14f17d (blob 672f199988caa9d52f38a4ae27b824de71725427), sources.md at
7352da2ea826beca39f02ee00c0a874a686e5075, research-audit.md, research-addendum.md (NA2-01..08), coverage-ledger.md and
independent-review.md at aa0fad2e4c9b431a35dec3a019a40bf6b1639570. Engine constraints are the ones recorded in
../hierarchy/research-review.md §4 (same engine.js / PACK_FORMAT.md; no engine change since).

Scope accepted for build: exactly the 51 seed records (23 places/containers, 14 events, 7 partial journeys,
7 codex) plus the 7 later-era rows, with the overlay below, as a **nonspatial, spoiler-gated reference-card
prototype**. No full-series, canon or release claim.

## 1. Correction overlay (independent review)

| ID | Disposition |
|---|---|
| NR-01 (Low) | **Adopted.** Build row P20 = "Stable Hill", N00/landmark (not editorial), gate 7, "Stable-bearing hill in Lantern Waste. [S7 III, IX, XIII]". P21 stays marked editorial. research.md left as provenance. |

## 2. Addendum / self-audit dispositions

| Item | Disposition |
|---|---|
| NA2-01..04 (P06/P07/P13/P16 base gates 1/1/2/1) | **Adopted** as already in research.md; their later eras keep gates 2/3/5/6 and are shown only behind their own gates. |
| NA2-05 (C02 gate 1) | **Adopted.** Copy limited to the single instance; no universal time-conversion text. |
| NA2-06 edition metadata | **Accepted** for attribution only; not proof of transcription fidelity. |
| NA2-07 / NQ06 P05 contains P02 | **Adopted.** P05 card (gate 2) shows "built over the Stone Table site" link to P02; no second Table record. |
| NA2-08 / NQ03 Fenris Ulf/Maugrim | **Not built.** No wolf record or alias in the seed. |
| NQ01 prior pilot | Known gap; no effect on seed. |
| NQ02 first-mention sweep | Known gap; gates used verbatim as completed-through thresholds, never lowered. |
| NQ04 3/10 corroboration | Known gap; blocks canon approval only. |
| NQ05 chapter coverage | Known gap; visible limited-coverage notice. |
| NQ07 N00 container | **Adopted:** N00 is shown as "Narnia (world)" with the note "grouping container; not a claim that every land is ruled by Narnia". Calormen (P13), Anvard/Archenland (P15) and Underland (P12) carry that note in their breadcrumb. |
| NQ08 rights wording | Unofficial fan-work notice + back link; no art/maps. Exact wording stays a release gap. |

## 3. Record-level review (Claude)

- Contradictions: **none** found across 51 rows + 7 eras. IDs unique; every event place, journey waypoint and
  place-table event link resolves.
- Gate monotonicity: no child is gated below its parent (P14 5 under P13 2; P20/P21 7). Event gates are their
  book and are never lowered by a lower-gated place (E04 book 2 at P06 gate 1; E05 book 3 at P07 gate 1; E12 book 6
  at N00 gate 1). Journeys: every journey gate ≥ all its waypoint gates (J03 book 3 over P07 1 / P08 3 / P09 3).
- A place card filters its event links, eras and journey mentions by the selected gate individually.
- Editorial items labelled in UI: N00 and E00 containers, P21 name. Inter-world items (P17, P18, P21, E00) are
  grouped as "Other worlds and ways between", never placed on one continent.
- Chronological slot is shown as a text field on each book; the gate axis stays publication order.
- Copy: the research's own paraphrases only; no quotations from the novels.

## 4. Engine fit

Same three generic needs as hierarchy (EC-1 spoiler-neutral start with completed-through choice and gated deep
links; EC-2 nonspatial card/index layout with breadcrumbs, no galaxy map/pins/ly; EC-3 journeys as ordered text
cards). One extra, optional:

| ID | Need | Plan |
|---|---|---|
| EC-4 | Optional chronological sort of book list/events without changing gates | If not cheap as a generic engine option, ship publication order only and show the chronological slot as text. Not a blocker. |

One engine change (EC-1..EC-3) serves hierarchy, narnia and licanius; build it once.

## 5. Known gaps and effect on the build

| Gap | Effect on this build | Blocks? |
|---|---|---|
| 0/7 full books; major places/events omitted | Seed only; visible limited-coverage notice | Complete atlas, canon approval |
| 0/7 paired editions; first-mention sweep incomplete | Conservative gates verbatim; edition note | Lowering gates, canon approval |
| 3/10 independent corroboration | Carried | Canon approval |
| 7 partial journeys, no geometry | EC-3 text sequences | Any map/route view |
| N00 regional modeling deferred | Neutral container note (NQ07) | Detailed regional rendering |
| Prior pilot unrecovered | None | No |
| Rights wording | Fan-work notice | Release |

## 6. Build plan and WIP

Active universes are at/above the WIP limit of 2 (abrahamic ready-for-owner on D04, lds-standard-works fixing;
hierarchy already queued first for the next slot). Narnia builds after hierarchy on the shared EC-1..EC-3 engine
work: pack file + registry → checks, screenshots, build-report.md, PR. This review is the stage's completed first
output.
