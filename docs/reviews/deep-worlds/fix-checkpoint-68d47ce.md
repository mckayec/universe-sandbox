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

## Checkpoint 2 — run 2026-11-09T15:46Z (head still 68d47ce; no application change)

**Stale V→IV Tyche exit: diagnosed as a harness artifact, not an app gap.** [dwd-stale-diag.cjs](dwd-stale-diag.cjs), output [dwd-stale-diag-output-68d47ce.txt](dwd-stale-diag-output-68d47ce.txt):
- Head, Tyche V→IV, storms off: `mode` globe by 500 ms (1440 and 390). Storms on: globe by 500 ms (2/2 runs). Storms on with `__floodH=43000`: globe by 500 ms.
- Same pattern on the parent (Tyche IV→III storms on; Helios V→IV on head and parent).
- Reproduced the earlier FAIL only with the focus probe's exact sequence (amplified flood toggled on/off/on): swiftshader frames take seconds, `page.click` times out (30 s, DOM-click fallback), `selectBook(4)` evaluate returns after 14 s and the 400 ms `fadeTo` callback lands at ~30 s — beyond the probe's 10 s wait. The app does leave the scene (globe, era 4). `setEra→leaveSite` is unchanged and correct.
- The main probe's 390 stale FAIL (in [dwd-probe-output-68d47ce-390.txt](dwd-probe-output-68d47ce-390.txt)) was recorded while a second swiftshader browser was running (contention); the isolated 390 diagnostic passes.

**New probe** [dwd-flood-probe.cjs](dwd-flood-probe.cjs): sea rows on an amplified page; stale/upgrade rows on a separate unamplified page; records whether each click was rendered or DOM fallback; `parent` mode is the discriminator.
- Parent 2f04e41, 1440: VI fresh entry **forced rise present** (y 410→619, already flooded on entry) — PASS; so the head's "VI fresh steady" row discriminates. [Output](dwd-flood-output-2f04e41-parent.txt). 390 parent: not run (goto timeout under contention).
- Head 68d47ce, 1440 amplified page: **7/7 PASS** — V and VI fresh entry unpressed and steady (−6→−6), Storm Gods on raises sea (V −6→415, VI −6→421), off returns to −6, no page errors. Clicks used the DOM fallback (rendered `page.click` starved under amplification). Stale/upgrade page rows not reached before the time bound. [Partial output](dwd-flood-output-68d47ce-1440-partial.txt).

**390 main probe** (dwd-probe-v2.cjs = dwd-probe.cjs + `VP` env): 29 rows run, 3 FAIL — stale (contention, above), manual off/on (known deferred-callback race, superseded by the flood probe), VI explicit replay raise (known harness sensitivity without amplifier, superseded). All Europa/text/gate rows PASS at 390; no page errors.

### Stopped at (next run)
1. Run `dwd-flood-probe.cjs` head at 1440 and 390 and parent at 390 **one browser at a time** (no concurrent swiftshader); save outputs.
2. Rerun dwd-probe-v2 at 390 alone; record the 3 superseded rows against their replacements.
3. Write `fix-return-68d47ce.md` with the full assertion table and hand to ChatGPT.

## Completed 2026-11-09T17:32Z

Evidence completed and handed back in [fix-return-68d47ce.md](fix-return-68d47ce.md).
