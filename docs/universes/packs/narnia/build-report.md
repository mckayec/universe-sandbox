# Narnia — build report (bounded 51-record seed)

Built 2026-11-27 by Claude (builder). Build authority: research-review.md (on main), with research.md at
5396b0c20832366a0a52f979cb704595bc14f17d, sources.md at 7352da2ea826beca39f02ee00c0a874a686e5075 and independent-review.md
at aa0fad2e4c9b431a35dec3a019a40bf6b1639570.

- Branch: `pack/narnia`, head **c6f8c1a1dadb348a09119aa15c2a27bc2fa227fc**
- Engine base: `engine/world-only` at **b2935646d09856f7aef98d5d130caa5930a7d286** (EC-1..EC-4). The pack cannot ship
  without that engine PR; merge the engine first.
- PR: "Narnia atlas (built, awaiting audit; do not merge)" #52 (stacked on engine PR #49).
- Files: `public/atlas/packs/narnia.js` (new), `public/atlas/packs/registry.js`, `src/universe-packs.ts`,
  `tests/standalone-pages.mjs` (pack id added), `tests/atlas-narnia.test.ts` (new). No engine code changed.

## 1. What is built

Exactly the seed: **23 places/containers, 14 events, 7 partial journeys, 7 codex entries, 7 later-era additions**,
as a world-only, spoiler-gated reference-card atlas (`layout:"cards"`). Copy is the research's own paraphrase; no
quotations, art, maps or adaptation facts.

| Research rows | How built |
|---|---|
| N00 | World "Narnia (world)", group "The world of Narnia", editorial label, NQ07 note "Grouping container; not a claim that every land is ruled by Narnia." Eras 6 and 7 as gated additions |
| E00 | World "Earth", editorial label, in group "Other worlds and ways between"; contains P16 London and P10 Experiment House |
| P01–P09, P11–P15, P19, P20 | Sites of N00 with their research gates and types. P14 nests under P13 (breadcrumb Narnia (world) › Calormen › Tashbaan) |
| P12, P13, P15 | Carry the NQ07 note ("Listed under Narnia (world) for grouping only; not a claim that it is ruled by Narnia.") |
| P17, P18, P21 | Top-level worlds in "Other worlds and ways between" (never placed on the Narnian continent); P21 editorial label |
| P20 | **NR-01 applied:** "Stable Hill", Landmark, gate 7, not editorial, "Stable-bearing hill in Lantern Waste.", src S7 III, IX, XIII |
| P05 → P02 (NA2-07/NQ06) | P05 card (gate 2) shows the fact "Built over: The Stone Table site (one place, not a second Table)". One Table record only |
| Eras P03/2, P06/2, P07/3, P13/5, P16/6, N00/6, N00/7 | `more:[[book,text]]`, appended only behind their own gate; base text unchanged |
| E01–E14 | Chronicle events, gate = book, chapter locator, characters (`who`), source line. E04 (book 2) under P06 (gate 1) and E05 (book 3) under P07 (gate 1) keep their own gates |
| J01–J07 | EC-3 journeys: numbered stops linking to place cards, no line/animation; each carries "Partial: only the listed anchors are researched; there is no measured route." and a tab-level caveat |
| C01–C07 | Codex tabs "People and beings" (C01, C04, C05) and "Quests, magic and ideas" (C02, C03, C06, C07). C02 has a note limiting it to its single instance (NA2-05) |
| Books | Publication order 1950–1956 are the gate keys; `chron` slots 2,4,5,6,3,1,7 [S8]. About lists each book with "chronological slot N" as text |

Verified in the browser (fresh contexts): before a choice nothing is listed (0 place links); a link
`#book=7&place=n00/p20` with no stored choice shows only the gate; with "completed through I" stored the same link
stays at I and Stable Hill is not shown; at book I no later place/event/journey/codex name appears in any tab (only
book titles in the selector/About list); at book II Beruna shows the bridge era and E04, while Lone Islands shows
neither its book-3 era nor E05.

## 2. Left out, and why

| Item | Why |
|---|---|
| Any wolf record, Fenris Ulf / Maugrim alias (NA2-08, NQ03) | research-review §2: not built |
| Any coordinate, map, pin, route line or distance | No sourced geometry (research §2, review §5); EC-2 cards layout |
| Clickable P05 → P02 cross-link | The engine has no generic related-place field; shown as a fact line instead. Optional future engine option, not a data gap |
| "All, with spoilers" option | EC-1 `all:false`; finishing VII shows everything |
| Narnia-maas-pilot content (NQ01) | Unrecovered; nothing imported |
| Any place/event beyond the 51 seed rows | Seed only; visible coverage notice |

## 3. Known-gap handling

| Gap | Handling in the build |
|---|---|
| 0/7 full books; major omissions (NQ05) | `intro.coverage` notice on the opening card and About; Chronicle and Journeys carry sample/partial notes |
| Edition collation / first-mention sweep (NQ02, NQ03) | Gates used verbatim (never lowered); About source note says editions were not collated and names may differ by edition |
| 3/10 corroboration (NQ04) | Carried; no canon claim anywhere in the UI |
| Partial journeys, no geometry | EC-3 text stops only, partial note on each |
| N00 regional modeling (NQ07) | Neutral container notes on N00, P12, P13, P15 |
| Rights wording (NQ08) | Fan-work notice in footer and About: unofficial, non-commercial, not endorsed by the C. S. Lewis estate or any publisher; names belong to their rights holders; no maps/art/quotations. Exact wording stays a release gap. "← Gravity Lab" back link present |

## 4. Engine options used (engine/world-only)

- EC-1 `spoilers:{mode:"cumulative", start:"choose", all:false}` (guardLinks defaults on).
- EC-2 `layout:"cards"`, site `parent`, `type`, `editorial`, `note`, `src`, `facts`, `more`.
- EC-3 `journeys` with `path`, `who`, `locator`, `text`, `note`.
- EC-4 `books[k].chron` → Published / Chronological switch (default Published; gates unchanged).

## 5. Checks (on c6f8c1a)

- `pnpm format` then `pnpm check`: format clean; build OK; **183/183 unit tests pass** (includes 8 new
  `atlas-narnia` tests: record counts, ledger gates, chron/years, EC-1 settings, no coordinates, NR-01 and editorial
  set, era/event/journey gate order, NQ07 notes and no wolf); check-dist 124 files OK.
- `pnpm test:pages`: pass, 15 pages × 2 viewports (narnia added).
- `pnpm test:browser`: pass on 6 of 9 runs; the 3 failures were each a 30 s timeout at `tests/browser-smoke.mjs:88`
  (sandbox Save/Load count), unrelated to the atlas, under machine load from parallel agents (load avg ~4–6).
- Browser console: no errors or page errors at any of the four sizes.

## 6. Screenshots (looked at; `shots/`, 3840 images downscaled to 1920×1080 JPEG, all < 140 KB)

3840x2160-gate, 3840x2160-chronicle-book7-chron, 3840x2160-codex-book7, 1440x900-gate, 1440x900-how-book2,
1440x900-journeys-book7, 1280x800-places-book2, 1280x800-chronicle-book2, 390x844-gate, 390x844-how-book2,
390x844-journeys-book7, 390x844-narnia-world-book7. Text is crisp at all sizes (plain DOM). Observations for the
engine owner, not pack issues: at 3840×2160 (DPR 1) the reading column is ~700 CSS px wide with much empty
space; at 390×844 the fan notice footer takes ~75 px and the About tab is slightly clipped in the tab row
(scrollable).

## 7. Recommended status

stage: built · owner: chatgpt · blocked-on: none (merge order: engine/world-only PR first) ·
next-action: ChatGPT: build audit of pack/narnia at c6f8c1a1dadb348a09119aa15c2a27bc2fa227fc.
