# Licanius: build report

Built 2026-11-27 by Claude (builder).
- Branch `pack/licanius`, head **48055796b7148bf190cfbd12f230ee05f9da536e**, PR #50 ("Licanius atlas (built, awaiting audit; do not merge)").
- Engine base: `engine/world-only` at **a7df00fdc429b5db6e7093b6e72d562843fa508b** (PR #49, not merged). That PR must land first.
- Build authority: research-review.md, applied to research.md 9f6ea35f, sources.md 9b3468eb and independent-review 6b0d6d58.

Files changed:
- `public/atlas/packs/licanius.js` (new)
- `public/atlas/packs/registry.js`
- `src/universe-packs.ts`
- `tests/atlas-licanius.test.ts` (new)
- `tests/standalone-pages.mjs` (one entry added to `PACKS`)

I made no changes to engine code.

## Built

All 29 seed records are built. Every card names its source tag and page (S1, S2) or "publisher description" (S3, S4).

| Kind | Rows | Gate(s) |
|---|---|---|
| Places (13), as sites of the editorial world "The setting" | andarra, talan-gol, boundary, caladel (parent andarra, editorial label, L2-01), ilin-illan (parent andarra), desriel, deilannis, tol-shen, res-kartha | 1 |
| | prythe (parent andarra), daren-tel, alkathronen, ilshan-gathdel-teth | 2 |
| Events (7) | le01, le02 | 1 |
| | le05 (LR-01 copy "Investigates missing Shadows.", Ilin Illan), le06, le07 | 2 |
| | le03 (boundary plus andarra, shown on both cards), le04 | 3, publisher premise |
| Journeys (3), as ordered text cards | lj01 caladel → desriel → deilannis | 1 |
| | lj02 ilin-illan → daren-tel → ilin-illan (the return leg is given as text) | 2 |
| | lj03 tol-shen → boundary | 2 |
| Codex (6) | "Background (history)": lc01 and lc04 (LR-02 copy verbatim). "Objects and claims": lc02, lc03 and lc05 (two attributed views) | 2 |
| | "Publisher premise": lc06 | 3 |

Copy notes:
- The UI says "Completed through"; gates are described as conservative thresholds and never as "first appears" (L2-02).
- le02 has a note saying it is a displacement in time, not travel, and it belongs to no journey.
- Res Kartha keeps its gate-1 text, "A dwelling place of the Lyth.", and has no link to lc04.
- There are no aliases anywhere.
- The visible coverage note says the pack is based on author recaps and publisher descriptions, not on the novels.
- The fan-work notice appears in the footer and in the About tab. The Gravity Lab back link is in the header.

## Left out and why

- **Anything outside the 29 rows.** It is out of scope under research-review §0 and Known gaps.
- **Year for book 1.** Its edition history is unresolved (Known gap). Books 2 and 3 show 2017 and 2019, from the US ebook dates in S4 and S3.
- **Coordinates, map, pins, distances and route lines.** The sources give no geometry (L2-05).
- **Book-3 narrative beyond the three premise cards.** L2-03.
- **Theme detail.** I used a bronze and storm-blue palette, as a design choice. No sigil or art.

## Known-gap handling

| Gap | Handling |
|---|---|
| 0/3 primary novels | The recap/publisher basis is stated in the coverage note, the notice, the About sources line and each card's source line |
| No earliest-chapter gates | Gates are completed-through thresholds only; the codex note and the gate text say so |
| 2/10 corroboration | Carried. No canon claim |
| No geometry | `layout:"cards"` and text journeys |
| Book 3 is premise only | 3 cards, each with a "Publisher premise … not a located scene" note |
| Book-1 edition and rights wording | No year for book 1. The generic notice says the names are the property of "James Islington and his publishers" |

## Engine options used (PR #49)

- **EC-1:** `spoilers:{mode:"cumulative", start:"choose", all:false}` with the default `guardLinks`.
- **EC-2:** `layout:"cards"`, with site `parent` breadcrumbs, the `editorial` flag, and `type`, `src`, `note`.
- **EC-3:** `journeys` with `path`, `legs` and `locator`.
- **EC-4:** not used.
- **Strings:** `ui.bookLabel`, `booksAria`, `gateAbout`, `chronNote`, `journeysNote`, `codexNote`, and `intro.coverage`.

## Checks (at 48055796)

| Check | Result |
|---|---|
| `pnpm format && pnpm check` | Formatting clean; build OK; **185/185** unit tests pass, including the 10 new ones in `atlas-licanius.test.ts`; check-dist reports 124 files OK |
| Validator (licanius.js) | 0 issues, 0 warnings |
| `pnpm test:pages` | Passed, 15 pages × 2 viewports, including `?pack=licanius` |
| `pnpm test:browser` | Passed |

Playwright gating checks were run against the served `public/`, and every one passed. The console showed no errors.
- A first visit shows only the chooser, with no "All" button.
- Links with `#book=0`, `#book=3`, `#book=3&place=setting/prythe` or `#book=2&tab=codex&cx=premise` still land on the chooser when no book has been chosen.
- At book 1:
  - the gate-2 places, gate-2 and gate-3 events, and lj02/lj03 are absent;
  - the codex is empty;
  - deep links to prythe or lj02 do not open;
  - Res Kartha shows no Lyth background.
- With book 1 stored, a link with `#book=2` does not raise the gate.
- At book 2:
  - Ilin Illan shows le05 but not le04;
  - Andarra does not show le03;
  - a link with `#book=3` stays at book 2.
- At book 3:
  - le03 appears on both Andarra and the Boundary;
  - Ilin Illan shows le05 and le04.
- No viewport scrolls horizontally.

## Screenshots (looked at; all under `shots/`, JPEG, under 500 KB)

Taken at 3840x2160, 1440x900, 1280x800 and 390x844, with three views at each size:
- `*-gate.jpg`: the first-visit chooser.
- `*-b2-place.jpg`: the Ilin Illan card at book 2, with breadcrumbs, the source line, one event and the journey link.
- `*-b2-journeys.jpg`: the numbered stops.

What I saw:
- Text is crisp at 3840 (DOM text, no WebGL). The layout is a centred column with wide empty margins.
- On the phone the cards stack in one column and the book buttons stay usable.

## Notes for the audit (engine-level, not changed here)

- The codex tab titles show even when a tab has no entries at the current gate. For example, "Publisher premise" shows as an empty tab at book 1. The titles reveal no content.
- At 390 px the header title is cut off with an ellipsis ("THE LICANIUS ATL…").
- At 3840 px the content column does not scale up.

## Recommended status

- stage: built
- owner: chatgpt
- blocked-on: none (engine PR #49 must merge first)
- next-action: ChatGPT: build audit of pack/licanius at 48055796b7148bf190cfbd12f230ee05f9da536e
