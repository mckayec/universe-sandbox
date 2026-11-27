# Fix return: Society disposition batch (flood A-amended, Tyche from V, Harmonia/Discordia VI)

2026-11-09 UTC, Claude. PR37 `atlas/deep-worlds`, head **68d47cebf40b37c345a37cb8b0080590c52a0339**, parent **2f04e416696f0fe32ab5eca7be5d8b578cd129cd**. Instructions: [disposition-review-2f04e41.md](disposition-review-2f04e41.md). Rows implemented and diff: [fix-checkpoint-68d47ce.md](fix-checkpoint-68d47ce.md) (one file, `public/atlas/society.js` +22/−19; [disposition-diff-68d47ce.patch](disposition-diff-68d47ce.patch)). No application change since the checkpoint; this file completes the evidence. Canon not approved; no merge or deploy.

## Checks at 68d47ce

- `pnpm check`: format check, build, **125/125** unit tests, check:dist 175 files: pass (checkpoint run).
- Browser probes run on a local `vite preview` of the build at head 68d47ce (and parent 2f04e41 for the comparison), Playwright Chromium with swiftshader WebGL, **one browser at a time**.

## Assertion table

| Row | Viewport | Result | Evidence |
|---|---|---|---|
| d8 text = provisional account; c–e removed; refs kept | 1440 / 390 | PASS | [dwd-probe-output-68d47ce-v1.txt](dwd-probe-output-68d47ce-v1.txt), [dwd-probe-output-68d47ce-390.txt](dwd-probe-output-68d47ce-390.txt) |
| No unqualified "drowned" text anywhere rendered | 1440 / 390 | PASS | same |
| Flood banner subtitle carries the qualifier (F2) | 1440 / 390 | PASS | same |
| Tyche note carries the illustrative-flood sentence (F3), V blurb qualified (F4) | 1440 / 390 | PASS | same |
| Tyche: IV entry denied, pin from V, toggle from V, harbor kept (T) | 1440 / 390 | PASS | same |
| Europa pins/facts/landmarks: II/V neutral (no Harmonia/Discordia, sea hidden, neutral villa/seagate/leviathan); VI names restored (E1–E6) | 1440 / 390 | PASS | same |
| F6–F8 cuts (Mercury V, Helios V, Book V tour step) | 1440 | PASS | [dwd-probe-output-68d47ce-v1.txt](dwd-probe-output-68d47ce-v1.txt) |
| V fresh entry: toggle unpressed, sea steady | 1440 / 390 | PASS | [dwd-flood-output-68d47ce-1440.txt](dwd-flood-output-68d47ce-1440.txt), [dwd-flood-output-68d47ce-390.txt](dwd-flood-output-68d47ce-390.txt) |
| VI fresh entry: toggle unpressed, sea steady (no forced flood, F5) | 1440 / 390 | PASS | same |
| **Discriminator:** parent 2f04e41 VI fresh entry floods without any press | 1440 / 390 | PASS (rise present on parent) | [dwd-flood-output-2f04e41-parent.txt](dwd-flood-output-2f04e41-parent.txt), [dwd-flood-output-2f04e41-parent-390.txt](dwd-flood-output-2f04e41-parent-390.txt) |
| Storm Gods on raises sea / off returns it, at V and VI | 1440 / 390 | PASS | flood outputs above |
| V→IV inside Tyche with storms on leaves the scene (globe, era 4) | 1440 / 390 | PASS | [dwd-stale-output-68d47ce-1440.txt](dwd-stale-output-68d47ce-1440.txt), [dwd-stale-output-68d47ce-390.txt](dwd-stale-output-68d47ce-390.txt); also flood outputs |
| Re-entry at V after a storms-on downgrade: toggle unpressed | 1440 / 390 | PASS | same |
| V→VI upgrade with storms on keeps scene and pressed toggle | 1440 / 390 | PASS | same |
| No page errors | 1440 / 390 | PASS | all outputs |

Superseded rows from earlier runs (not counted as passes or fails of the app):

| Earlier FAIL | Cause | Replaced by |
|---|---|---|
| 1440/390 "stale V→IV leaves the scene" ([v1](dwd-probe-output-68d47ce-v1.txt), [390](dwd-probe-output-68d47ce-390.txt), first flood run) | swiftshader frame starvation with storms on; the app leaves the scene later than the probe's 10 s wait ([dwd-stale-diag-output-68d47ce.txt](dwd-stale-diag-output-68d47ce.txt)) | [dwd-stale-probe.cjs](dwd-stale-probe.cjs): fresh browser, 30 s poll, records time to leave |
| 390 "manual Storm Gods off/on" and the first 390 flood run's V on/off rows | at compact widths a closed bottom sheet swallows the first tap and only opens the sheet (society.js sheet capture handler, existing mobile design, unchanged by this batch). The DOM click hit the closed sheet. | both probes now open the sheet first (`click()`), then press |
| VI explicit replay raise without amplifier | 1.84 u rise in 5 s under swiftshader is below the threshold | amplified `__floodH` rows in [dwd-flood-probe.cjs](dwd-flood-probe.cjs) |

## Qualifications

- **Exit time under swiftshader.** With storms on, the probe measured 33.5 s (1440) and 18.7 s (390) from `selectBook(4)` to leaving the scene. Software WebGL frames with the storm layer take seconds; storms off, the diagnostic shows the exit by 500 ms. Real-GPU exit latency was not measured.
- Clicks on the storms toggle used the DOM fallback (`element.click()`) after the 8 s rendered `page.click` timed out under swiftshader; the rendered click path is shown only in the 1440 focus probe ([dwd-focus-output-68d47ce-partial.txt](dwd-focus-output-68d47ce-partial.txt)).
- Sea-motion rows use the `__floodH=43000` test hook to make the displacement visible under swiftshader; stale/upgrade rows run without it.
- Not run: 3840×2160 and 1280×800 captures, real GPU, physical phones. Navigation is API-driven (`__atlas`) with rendered-DOM text assertions.
- Canon: the flood text remains a provisional account per the disposition; no primary passages were checked by Claude.

## Handoff

fixing/claude → content-review/chatgpt: review this batch at exact head 68d47ce against [disposition-review-2f04e41.md](disposition-review-2f04e41.md).
