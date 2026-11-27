# Final technical scope/gap packet: PR45 at 420c1e7

2026-11-09 UTC, Claude. Answers [independent-review-420c1e7.md](independent-review-420c1e7.md): a finite packet naming
the candidate SHA, the retained gaps, and what integration/release still needs. No application change in this packet;
nothing is merged or deployed.

## 1. Candidate

| | |
|---|---|
| PR | #45 `engine/timelines` (draft), base branch `pack/abrahamic-world-religions` (PR #39) |
| Candidate head | **420c1e77f50c9c34a433f00b4062911cc422c42b** (checkpoint 31) |
| Scope | Reusable synchronoptic timeline view (model, chart/list view, lanes, URL/history state, year/layer filters, relationship brackets with source locators) built against the Religious Traditions (Abrahamic) pack. 0/12 real relationships promoted; no pack content added. |
| Builder checks at head | `pnpm check` 166/166, check:dist OK, `pnpm test:pages` 12 pages × 2 (builder-reported, checkpoint 31) |
| Independent checks at head | ChatGPT: 7/7 changed text files read; layers.js helper 17/17 assertions; extracted renderFilters 3/3 DOM-stub cases; 0 independent rendered cases |

The candidate is a **technical-scope candidate only**. It is not mergeable as-is (§3).

## 2. Accepted within scope (cite with these limits)

| Area | Evidence | Limit to keep when citing |
|---|---|---|
| TL-R01–R09, TL-R03 focus containment | checkpoints 5–9; independent reviews 312d2dd, 24655eb, eaa2e9c, 35ca9a2, 908bab4 | closed within each review's bounded scope |
| Chapter path (TL22-E2) | tl29 20/20 real input at 1440/390 (head) | parent control incomplete (2 predicates, then software-GL actionability timeout) |
| URL/history year restoration | tl30 194/194 head vs 114/190 control | builder runs only; independent browser 0/194 |
| R30-1 year handle + focus after filter rebuild | tl31 8/8 at 1440; helper 17/17 and focus 3/3 independent (source scope) | readout/input values logged not asserted; focus asserted at final case only; parent 0/1 then timeout |

## 3. Retained gaps — final disposition

| # | Gap | Disposition | Blocks release? |
|---|---|---|---|
| G1 | **Integration.** PR45 is stacked on PR39 and has textual conflicts with both PR39's current head 813061f (engine.css, engine.js, packs/registry.js, tests/atlas-layers.test.ts) and `main` (those four plus src/universe-packs.ts). PR33 (lds-standard-works, awaiting Mckay) also edits the shared engine. | Required integration step (§4). Not done now: PR39/PR33 are Mckay-gated (D04/D05/D09) and resolving against a moving base twice is waste. | **Yes** |
| G2 | 390-wide keyboard qualification of the year handles | Not run (combined run hit the budget). Same code path as 1440; fold into the post-integration rendered pass (§4 step 3). | No (risk Low) |
| G3 | Pointer/touch drag of year thumbs | No evidence: synthetic drag does not engage native range thumbs under swiftshader. Native `<input type=range>` handles touch; logic is shared with the keyboard path (`readRange`/`rangeFromHandles`). Covered by Mckay's device check. | No (risk Low) |
| G4 | Physical device, real-GPU timing, assistive technology, phone performance with the full Abrahamic row set | Out of reach in software-GL runs. Listed for Mckay's spot-check at release. | No; recorded as Known gap |
| G5 | R29-1: Timeline button can start off-screen in the phone strip for cumulative packs (reachable by swipe) | Retained **here** as a Known gap, not transferred to mobile-entry-usability. Any fix is a separately scoped follow-up after PR44. | No |
| G6 | tl29 chapter-path parent control incomplete | Evidence limitation, not a product failure; head 20/20 stands. | No |
| G7 | Default-off layers (`on:false`) in a timeline pack | No current pack uses it; re-test history behavior before introducing one. | No (trigger-based) |
| G8 | Hand-typed hash naming a surface hidden by its own filters | Handled in `applyFilters()` cleanup paths; untested in a rendered run. | No |
| G9 | Real relationship promotion (0/12) and other packs' adapters (Standard Works, apocrypha, fiction calendars) | Out of scope for this PR; later items. | No |

## 4. Remaining integration and release requirements

1. Mckay releases (or declines) PR39 and PR33 under D04/D05/D09.
2. Claude retargets PR45 to `main`, merges current `main` into `engine/timelines`, resolves G1's five files, and
   re-runs `pnpm format && pnpm check`, `pnpm test:pages`, the browser smoke test and the tl28/tl30/tl31 probes.
3. Same run: tl31 at 390×844 (G2) and screenshots at 3840×2160, 1440×900, 1280×800, 390×844 of the integrated head.
4. ChatGPT reviews the integration delta at that exact SHA (non-doc files vs this candidate).
5. Claude adds a DECISIONS entry asking Mckay to release the integrated SHA, listing G3–G9 as Known gaps.

If Mckay prefers PR45 to go out with PR39 instead (one release), step 2 runs against PR39's head instead of `main`; that
choice would be his, via DECISIONS.
