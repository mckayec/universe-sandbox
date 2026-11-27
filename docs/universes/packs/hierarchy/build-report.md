# Hierarchy — build report (bounded 40-record seed)

Built 2026-11-27 by Claude (builder). Status: **built, awaiting ChatGPT build audit. Do not merge.**

| Branch | Head SHA | PR |
|---|---|---|
| `engine/world-only` (EC-1..EC-4 engine options) | `b2935646d09856f7aef98d5d130caa5930a7d286` | #49 "Atlas engine: world-only options EC-1..EC-4 (do not merge)" |
| `pack/hierarchy` (pack; contains the engine commits) | `ddb4ad99fcb61e2441d0f2ef857437b2cb5083e3` | #51 "Hierarchy atlas (built, awaiting audit; do not merge)" — depends on #49 |

Inputs: research.md at fa555e7 (blob 234dc264), research-review.md, research-addendum.md, sources.md 64ab28d,
independent-review.md 14f621a, on main 718d84d5. Only (C) records adopted by research-review.md were built.

## 1. Built

`public/atlas/packs/hierarchy.js`, `layout:"cards"`; registered in `public/atlas/packs/registry.js` and
`src/universe-packs.ts`; added to `tests/standalone-pages.mjs` with a reading-gate assertion.

| Research rows | Built as | Gate |
|---|---|---|
| `hierarchy-setting` (editorial container) | world `setting`, "First-novel setting", tagged **Editorial label**; blurb says it is not a name from the books | 1 |
| HP01–HP07, HP13–HP19 | sites of `setting`; parents per research (HP03→HP02, HP06→HP05, HP07→HP06, HP18→HP17); HP14 copy per HR-01 | 1 |
| HP08 Obiteum, HP09 Luceum, HP10 Res | worlds | 2 |
| HP11, HP12, HP20, HP21, HP22 | sites of `obiteum` (HP21/HP22 under HP20); HP12, HP21, HP22 tagged Editorial label; HP11 and HP20 carry the research caveats as notes | 2 |
| HE01, HE05, HE02 / HE03, HE06, HE04 | Chronicle events in that per-book order, with chapter locators and characters; HE02 note "announced destination, not a recorded arrival"; HE04 note "no destination, no link drawn" | 1 / 2 |
| HJ01 (HP06→HP07), HJ02 (HP21→HP22→HP12, H2-02) | ordered journey cards, no lines or animation, research limits as notes | 1 / 2 |
| HC01–HC06, HC09, HC10 / HC07, HC08 | "Ideas" tab; HC08 noted as an attributed character account | 1 / 2 |

Every card shows its research ID and source (S1/S2/S3). Copy is the research wording (paraphrase, no quotations).
Meta: description, works, attribution and the proposed fan notice from research §1 (footer and About); back link
"← Gravity Lab" as in other packs; continuity boundary (not Licanius) in the intro.

## 2. Left out and why

| Item | Reason |
|---|---|
| Any coordinates, pins, coastlines, scale, distances, routes as lines | H2-03 / review §4: no inspected geometry |
| Book 3 *The Justice of One* in the selector | Unpublished (S4); named only in the coverage note |
| Theatre (HE02 destination), Aquiria (HP19 text) as cards | Not research records; would invent places |
| Name-first-1 lowering of HP08/HP09 | H2-01: names recorded, explanatory records stay gate 2 |
| Any link between HP06/HP07 and HP10 Res; HP02↔HP20 alias | Research §3 / HQ04 |
| Bridge story, rank multipliers, character identities/aliases | HQ05 / research §6: not researched |
| Characters as codex entries | Not research records (names appear only as event participants) |

## 3. Known-gap handling

Visible coverage note on the opening card ("only the author's glossary, the publisher's synopsis and the opening
chapter of each novel; not a complete atlas of either book; book 3 unpublished, not included"); Chronicle note
"sampled opening episodes only, not a complete timeline"; Journeys note "no routes, distances or positions known";
"More appears as you finish later books" where items are gated. Gaps that block canon/release (0/10 independent
corroboration, 0/2 full-book audits, book-2 branches unresearched, ending boundaries unlocated) are unchanged and
are not claimed resolved.

## 4. Engine options used (PACK_FORMAT 6.1 and 22 on `engine/world-only`)

- EC-1: `spoilers:{mode:"cumulative", start:"choose", all:false}` — fresh visitors see only the chooser and About;
  no "All"; `#book=0` ignored; `#book=2&place=obiteum` neither chooses for a fresh visitor nor raises a stored
  book-1 choice (a notice says the link stays hidden); choice stored per pack.
- EC-2: `layout:"cards"`, nested sites via `parent`, breadcrumbs, `editorial:true`, `note`, `src`.
- EC-3: `journeys` with ordered `path`.
- EC-4: not used (publication order = reading order).

## 5. Checks (on `pack/hierarchy` at ddb4ad9)

- `pnpm format && pnpm check`: format OK, build OK, **175/175** unit tests (incl. 9 in `tests/atlas-gate.test.ts`
  and the hierarchy validator test: 4 worlds, 19 sites, 6 events, 2 journeys, 0 issues, 0 warnings), check-dist
  124 files OK.
- `pnpm test:pages`: **15 pages x 2 viewports** OK (incl. hierarchy gate assertions).
- `pnpm test:browser`: passed.
- Engine branch (a7df00f): check 174/174, test:pages 14x2 OK; existing packs (sun-eater, hyperion, dune) still open
  on All for a fresh visitor and `#book=2` links still apply.
- Ad-hoc Playwright run at 3840x2160, 1440x900, 1280x800, 390x844: gate shown, 0 places before choosing, 15 places
  at book I, 23 at book II, deep link capped, no console errors, no horizontal scroll.

## 6. Screenshots (`shots/`, JPEG, all < 500 KB, looked at)

`hierarchy-gate-*` (chooser, all four sizes), `hierarchy-book1-*` (place list at book I, all four sizes),
`hierarchy-place-*` (Deep cells card with breadcrumb, events and journey, all four sizes), `hierarchy-chron-1440x900`,
`hierarchy-chron-390x844`, `hierarchy-journeys-1440x900`, `hierarchy-journeys-390x844`, `hierarchy-codex-1280x800`,
`hierarchy-about-1440x900`. Text is DOM-rendered, so it is sharp at 4K; no WebGL work on phones.

## 7. Recommended status

stage **built**; owner **chatgpt**; blocked-on: none; next-action: "ChatGPT: build audit of pack/hierarchy at
ddb4ad99fcb61e2441d0f2ef857437b2cb5083e3 (engine PR #49 reviewed with it)".
