# Checkpoint 26 — TL25-R1 history-restoration transaction

Builder: Claude, 2026-11-08 UTC. PR45 `engine/timelines`, parent **66c80f1f50e44d32bc68c404a4e4addac77e1d57**. Responds to [independent-review-66c80f1.md](independent-review-66c80f1.md) (on main). Bounded correction only; folded-row connectors remain the next feature unit.

## Fix (public/atlas/engine.js, 1 file, +10/−4)

The popstate handler is now one transaction:

1. capture the incoming `location.hash` before anything runs;
2. set `urlHold` so `syncURL()` writes nothing while the entry is applied (the chapter refresh can no longer overwrite the incoming `tl`/`tlc`/`tlsel`);
3. apply/validate the chapter first (`chapterFromURL`), so selection gating uses the incoming chapter;
4. apply the timeline state from the **captured** hash (`tlFromURL(incoming)`; `TLV.restore` re-gates the selection, lane order and collapse);
5. release the hold and write one normalized URL (`syncURL()`).

Selection is not restored before the chapter gate. `tlFromURL()` without an argument keeps its old behaviour. Start-up restoration is unchanged (URL writes are already disabled there).

## Evidence (labelled)

| Check | Input | Parent 66c80f1 | This checkpoint |
|---|---|---|---|
| Reviewer's `tl25/reviewer-chapter-history.cjs` (blob-hash asserts removed, otherwise unchanged) | isolated host functions, test doubles | 2/5 (reviewer) | **5/5** (`tl26/reviewer-tl25-probe-on-fix.txt`) |
| `tl26/history-transaction-probe.cjs` — isolated host transaction, same extraction markers as the reviewer's probe; view double gates selection by chapter and keeps lane order/collapse | simulated | 4/12 (`…-parent-66c80f1.txt`) | **12/12** (`history-transaction-output.txt`) |
| `tl26/history-browser-probe.mjs` — actual host, built `dist/` (temp copy), tl25 fixture (synthetic chapter gates), Chromium SwiftShader, 1440x900 and 390x844 | same-document link input (`location.hash`) + **real** browser Back/Forward (`page.goBack/goForward`) | 16/38 (`history-browser-output-parent-66c80f1.txt`) | **38/38** (`history-browser-output.txt`) |
| `pnpm check` (format, build, tests, check:dist) | — | 162/162 (builder, cp25) | **162/162** |

Isolated cases (12): two unchanged-chapter controls; the reviewer's three changed-chapter cases; chapter lowered gates a later selection out (tlsel dropped); chapter raised admits a selection gated at the old chapter; chapter change + custom lane order and collapse; chapter change + `tl=1` replaces a custom order; missing `ch` → Not set (selection gated out); invalid `ch` → Not set and close; a 7-step Back/Forward walk over three entries landing on each entry's own URL unchanged.

Browser cases per width (19): six entries — closed ch2; ch2→3 + open + Karaite selected (synthetic gate ch3); ch3→2 gates Karaite out (tlsel dropped); ch2→5 + reversed lane order + a collapsed lane + selection; ch5→4 closes; `ch=abc` → Not set with Karaite gated out — each verified on link, then Back through all, then Forward through all; plus exact list/model set equality at the final Not-set state and zero runtime errors. The collapsed lane is one other than the selection's lane, because showing a selection expands its own lane by design (timeline-view.js `show`).

Fresh-load fail-closed checks and the unchanged-chapter cases remain covered by `tl25/chapter-probe.mjs` (rerun result recorded in status History when complete).

## Retained limits

Same-document link input is simulated (hash assignment), not real pointer input; O-1 same-document layer restoration; TL22-E2 real input/focus and 1440 click timeout; mobile 1714-row performance; device/AT; chapter gates outside the timeline; PR33 integration; full technical qualification; Mckay's release approval. 0/12 real pilot relationships promoted. Fixture chapter gates are test input, not canon.
