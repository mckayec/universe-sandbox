# Hierarchy — Claude research review (bounded 40-record seed)

Reviewed 2026-11-07T00:50Z by Claude (builder). Inputs on main 5eb073aa8ae4b94f568526ace8a21b6af5ccbf56:
research.md at fa555e7caa5a8489c1724e8e06ac0e680b0101af (blob 234dc264f999cc1fd89c0d2e123abd886f0783ef),
sources.md at 64ab28d71825e4a1c820102c3b16be230279c977, research-audit.md, research-addendum.md, and
independent-review.md at 14f621a938343c987425400fd98da475aba7c80c. Engine read: public/atlas/engine.js and
docs/atlas/PACK_FORMAT.md on the same main.

Scope accepted for build: exactly the 40 seed records (22 places, 6 events, 2 journeys, 10 codex) with the
correction overlay below, as a **nonspatial, spoiler-gated reference-card prototype**. Nothing else. No full-series,
canon or release claim.

## 1. Correction overlay (independent review)

| ID | Disposition |
|---|---|
| HR-01 (Low) | **Adopted.** Build copy for HP14 Tensia = "Southernmost populated country in the known world." first=1, parent and source unchanged. research.md stays as the provenance artifact. |
| HR-02 (Low) | **Adopted.** The build treats HP13–HP22 as rows of the single Places table; no lore or ID change. Research file left untouched for provenance (formatting only). |

## 2. Research-addendum dispositions

| Item | Disposition |
|---|---|
| H2-01 gate = display eligibility | **Adopted.** `first` values used verbatim as "completed through book N" gates. Name-first-1 for Obiteum/Luceum is recorded but not used to lower HP08/HP09 (stay gate 2). |
| H2-02 HJ02 local IDs | **Adopted.** HJ02 = HP21 → HP22 → HP12 as an ordered text card. |
| H2-03 text geography only | **Adopted.** No coordinates, pins, coastlines, scale or ly units. |
| H2-04 full coverage open | **Carried as Known gap** (see §5). Prototype shows a visible "limited source coverage" note. |
| H2-05 independent corroboration 0/10 | **Carried as Known gap.** Does not block the seed prototype; blocks canon approval. |
| H2-06 independent review before build | **Satisfied for this seed scope only** by 14f621a. |

## 3. Record-level review

- Contradictions found: **none** across the 40 rows. Parent links resolve (HP03→HP02, HP06→HP05, HP07→HP06,
  HP11/HP12/HP20→HP08, HP18→HP17, HP21/HP22→HP20); event place IDs and journey IDs all resolve.
- Name collision: HP02 Solivagus vs HP20 "Solivagus in Obiteum" — kept as two records, no alias merge (HQ04).
- Gate check: every record whose parent is gate 2 is itself gate 2. HP06/HP07 stay under the anonymous
  `hierarchy-setting` container and are never linked to HP10 Res.
- Editorial labels (HP12, HP21, HP22, `hierarchy-setting`) will be marked "editorial label" in the UI.
- HE02 stays departure-only, HE04 has no destination, HC08 stays an attributed character account.
- Copy will be the research wording (already paraphrased, no quotations); attribution/notice per research §1.

## 4. Engine fit — three concrete constraints (no positions will be invented)

The current atlas engine cannot deliver the review's acceptance conditions with pack data alone:

| ID | Constraint in current engine | Needed (generic, reusable) |
|---|---|---|
| EC-1 Spoiler-neutral start | With no stored choice the engine starts at book 0 = "All, with spoilers" (`storedBook()` returns 0), and `#book=0` URLs open everything. The review forbids a generic All default. | Pack option (e.g. `spoilers.start:"choose"`, `ui.all:false`): land on the intro only, require a completed-book choice before any world/site/codex/event is listed, ignore `#book=0` and deep links to items above the chosen gate. |
| EC-2 Nonspatial places | Sites need `lat/lon` (or `rel`) on a world surface; worlds need galaxy `map` coordinates in kly. Using them would invent geography. | Pack option for an index/card layout: worlds and sites listed as cards with parent breadcrumbs, no galaxy map, no surface pins, no distance/ly labels. |
| EC-3 Journeys as text | Routes draw between positions. | Render journeys as ordered narrative cards (no animation). Can reuse codex/chronicle panels. |

Pack-only items (no engine change): "Completed through" wording via `ui.bookLabel`/`ui.booksAria`/`ui.allTitle`;
`spoilers.mode:"cumulative"` with first=k read as completed-through-k; book 3 not listed in `books`. The engine has
no free-text search index, so the search-gate condition is met by absence; URL, breadcrumb and label gating are
covered by EC-1/EC-2 and must be tested.

## 5. Known gaps and effect on the build

| Gap | Effect on this build | Blocks? |
|---|---|---|
| Only opening chapters, synopsis and glossary checked | Seed prototype only; visible coverage note | Blocks complete atlas and canon approval |
| No numeric geography / map image not inspected | EC-2 card layout; no pins or routes | Blocks any mapped view |
| Ending/reveal boundaries unlocated | Explanations stay at gate 2 | Blocks lowering gates |
| Book-2 branches mostly unresearched | Only the 14 gate-2 seed records appear for book 2 | Blocks claiming book-2 coverage |
| Bridge-story edition unresolved | Omitted; no extra book slot | Blocks that supplement only |
| 0/10 independent corroboration, 0/2 full-book audits | Build-audit/canon must treat seed as bounded | Blocks canon approval and release |
| Book 3 unpublished | Not in book selector | None for prototype |

## 6. Build plan and WIP

Active universes now: abrahamic-world-religions (ready-for-owner), lds-standard-works (fixing), hierarchy
(research-ready) = 3, above the WIP limit of 2 (HANDOFF_PLAN §1.4.6). Mckay's 2026-11-06 parallel assignment waived
the research count only, not WIP. So the build PR on `pack/hierarchy` (EC-1..EC-3 engine options + pack) starts
when a slot frees — e.g. abrahamic goes live on a D04 yes — and this review is the stage's completed first output.
Bounded order once started: EC-1 (with tests) → EC-2/EC-3 → pack file + registry → checks, screenshots,
build-report.md, PR.
