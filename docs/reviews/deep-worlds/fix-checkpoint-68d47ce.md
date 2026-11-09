# Society disposition batch — implementation checkpoint at PR37 68d47ce

- Builder: Claude, 2026-11-09 (run 14:47Z). Checkpoint, not a full return: the change is complete; evidence is partial.
- Branch `atlas/deep-worlds` (PR37). Parent `2f04e416696f0fe32ab5eca7be5d8b578cd129cd` → head `68d47cebf40b37c345a37cb8b0080590c52a0339`.
- One file: `public/atlas/society.js` (+22/−19). Full diff: [disposition-diff-68d47ce.patch](disposition-diff-68d47ce.patch).
- Implements [disposition-review-2f04e41.md](disposition-review-2f04e41.md) as written. Canon not approved; no merge or deploy.

## Rows implemented

| ID | Change at 68d47ce |
|---|---|
| F1 | d8 text = "Orion, broken by torture, drives the Storm Gods against Tyche, and storm surges drown the city. Provisional account; not independently checked against the novel." (c–e removed). Title, `lm:"harbor"`, `fx:"flood"` unchanged. |
| F2 | Registrations kept. `FX_VIEW.flood.sub` (the event banner subtitle) now "Illustrative reconstruction of a provisional account, not checked against the novel" so the banner carries the qualifier. |
| F3 | Toggle/effect kept. `SITES.tyche.note` = existing artistic-layout sentence + "The Storm Gods flood is illustrative: its extent and water height are not verified against the novel." (set in the gate block; rendered on every Tyche entry). |
| F4 | V blurb = suggested qualified text. |
| F5 | `fOn=!prol&&on` (no `ERA>=6` term); VI blurb = review's replacement text; comment 7038 updated. |
| F6–F8 | Narrow cuts as specified (Mercury V, Helios V, Book V tour step; tour still 9 steps total in the block, Tyche step kept). |
| F9 | Unchanged. |
| T | `SITE_FROM.tyche` 4→5; comment replaced with corrected rationale. IV variants left alone. |
| E1 | `POI_FROM.europa.discordia=6`. |
| E2 | Epithet "Europa · House Arcos"; base blurb "A castle on an island of Europa’s ocean: …". VI blurb unchanged. |
| E3 | Pre-VI `base` facts map Island → "An island of Europa’s ocean" before era-2 facts are built; VI keeps full Island/Books rows. |
| E4 | Villa variants 1/2 start "Keep and walls on the island’s heights." |
| E5 | `lmGate("europa","seagate",6,"A stair winds down from the castle to the harbor in the cove.")`; `lmHide("europa","sea",6)`. |
| E6 | `LEV_TEXT[1]` = LEV_BASE with "Europa’s Discordia Sea" → "Europa’s ocean"; VI variant unchanged (shared by globe popup and site landmark). |

## Evidence so far (head 68d47ce, local `vite preview` of the build)

- `pnpm check`: format check, build, **125/125** tests, check:dist 175 files — pass.
- [dwd-probe.cjs](dwd-probe.cjs) v1 output [dwd-probe-output-68d47ce-v1.txt](dwd-probe-output-68d47ce-v1.txt) (API-driven navigation via the `__atlas` test hook; assertions on rendered `document.body.innerText` and banner DOM, plus data assertions). 1440: 22 pass / 2 fail; 390: partial run (12 rows) before timeout.
  - Pass at 1440 (and the 390 rows reached): d8 text/refs; Tyche from V, toggle era 5, harbor kept; Europa pins VI; Europa facts base/II/VI; IV enter denied, pin V; V direct entry shows note + qualified blurb; no unqualified drowned text; d8 replay presses Storm Gods with qualified banner; Chronicle entry shows qualifier; VI fresh entry sea steady; VI blurb; Europa II/V rendered text free of Harmonia/Discordia with sea hidden and neutral villa/seagate/leviathan; VI names restored; no page errors at 1440.
  - Fail rows, diagnosed: (a) "VI explicit replay raises sea" — harness sensitivity (1.84 u rise in 5 s under swiftshader); superseded by the focused probe below. (b) 390 "manual off/on" — probe clicked before the d8 replay's deferred callback ran; superseded by focused probe.
  - **Open: stale V→IV inside Tyche.** After `selectBook(4)` while in the Tyche scene, `mode` stayed `site` (1440, both probes). Not yet diagnosed whether this is a harness timing issue or a real stale-scene gap in `setEra→leaveSite` (generic code, not changed by this batch). Must be resolved before the return.
- [dwd-focus-probe.cjs](dwd-focus-probe.cjs) (rendered `page.click` on the Storm Gods button, `__floodH=43000` test hook amplifies sea displacement 100× for detection) partial output [dwd-focus-output-68d47ce-partial.txt](dwd-focus-output-68d47ce-partial.txt): 1440 V fresh unpressed + steady; on raises sea (−6→419); off returns; VI fresh unpressed + steady; VI explicit on raises sea (−6→405). Stale row failed as above. 390 not reached (timeout).

Independent rendered interaction: Storm Gods clicks only. Everything else is API-driven navigation with DOM-text assertions. No 3840/1280 captures, no real GPU/device.

## Stopped at / remaining for the return

1. Diagnose the stale V→IV Tyche case (try `history`/crumb route and a longer settle; compare a V-gated site on parent 2f04e41); fix only if it is a real gap.
2. Complete the 390 rows of both probes; add the VI fresh-entry comparison on parent 2f04e41 (must show the old forced rise) so the "no forced flood" check is shown to discriminate.
3. Add downgrade/upgrade with storms on and history/crumb navigation rows; then write the full return with an assertion table and hand to ChatGPT.
