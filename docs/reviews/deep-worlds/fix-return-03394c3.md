# Deep worlds — fix return at 03394c3 (DWO-S1 + final-head Society suite + gate list)

2026-11-09, Claude. PR [#37](https://github.com/mckayec/universe-sandbox/pull/37), branch `atlas/deep-worlds`.
**Exact head `03394c32816fcb5c95261bf6a9ea4520381a5838`** (unchanged this run), parent `68d47cebf40b37c345a37cb8b0080590c52a0339`.
Answers [implementation-review-68d47ce.md](implementation-review-68d47ce.md) §"Precise continuation" items 1–3.
Items 1 (DWO-S1) and 3 (report reconciliation) are in [fix-checkpoint-03394c3.md](fix-checkpoint-03394c3.md); this
file completes item 2 and gives the consolidated gate list. No application edit this run.

All runs: built dist (`pnpm build` at the head) served by `vite preview`, headless Chromium with
`--use-gl=swiftshader`, one browser at a time (parallel runs starve swiftshader). All counts are builder-run.

## 1. Scope note

`society.html` does not load `engine.js`, and `public/atlas/society.js` is byte-identical between 68d47ce and
03394c3. The only application delta since the accepted 68d47ce batch is the DWO-S1 engine change (+5/−2), so the
Society suite below re-establishes the accepted 68d47ce behaviour at the final head; it is not new Society coverage.

## 2. Final-head Society spoiler suite at 03394c3

| Probe | Viewport | PASS | FAIL | Not run | Output |
| --- | --- | --- | --- | --- | --- |
| [dwd-probe.cjs](dwd-probe.cjs) (data + rendered text, Tyche IV/V/VI, d8 replay, Europa II/V/VI) | 1440×900 | 24 | 1 | 0 | [log](dwd-probe-output-03394c3-1440-partial.txt) (1440 leg complete; its 390 leg was cut by the earlier run) |
| same | 390×844 | 23 | 2 | 0 | [log](dwd-probe-output-03394c3-390.txt), exit 1 |
| [dwd-flood-probe.cjs](dwd-flood-probe.cjs) `head` (amplified sea + stale page) | 1440×900 + 390×844 | 20 | 2 | 0 | [log](dwd-flood-output-03394c3.txt), exit 1 |
| same, 390 rerun | 390×844 | 11 | 0 | 0 | [log](dwd-flood-output-03394c3-390-rerun.txt), exit 0 |
| [dwd-stale-probe.cjs](dwd-stale-probe.cjs) (fresh browser per viewport) | 1440×900 + 390×844 | 8 | 0 | 0 | [log](dwd-stale-output-03394c3.txt), exit 0 |
| [dwd-leviathan-probe.cjs](dwd-leviathan-probe.cjs) (new: rendered globe label → banner, scene landmark button) | 1440×900 + 390×844 | 12 | 2 | 0 | [log](dwd-leviathan-output-03394c3.txt), exit 1 |
| same, 390 rerun with `LEVWAIT=120000` | 390×844 | 7 | 0 | 0 | [log](dwd-leviathan-output-03394c3-390-rerun.txt), exit 0 |

FAIL rows, each classified:

- **dwd-probe 1440 "stale: V→IV inside Tyche leaves the scene"** — the known amplified-page starvation row
  (diagnosed at 68d47ce: with `__floodH` the 400 ms fade callback is starved for ~30 s). The fresh-browser
  dwd-stale-probe passes it at both widths at this head (left after 33.1 s at 1440 and 19.3 s at 390, storms on).
- **dwd-probe 390 "manual Storm Gods off/on toggles" and "VI explicit Storm Gods replay raises sea"** — the same two
  superseded 390 harness rows as at 68d47ce (this probe taps the toggle without opening the compact bottom sheet,
  which by design swallows the first tap). dwd-flood-probe opens the sheet first and passes the corresponding rows.
  The third 68d47ce 390 FAIL (stale row) now passes in this probe.
- **dwd-flood 1440 "V→IV inside Tyche with storms on leaves scene"** — same starvation row on the stale page that
  follows the amplified page in one browser; covered by dwd-stale-probe 4/4 per width.
- **dwd-flood 390 "book 5 Storm Gods off returns sea"** — the rendered click timed out and the DOM fallback left the
  toggle pressed. Not reproduced on the immediate 390 rerun (11/11, exit 0); society.js is unchanged since 68d47ce,
  where this row passed. Recorded as a harness flake, not an app finding.
- **dwd-leviathan 390 books V and VI "globe Leviathans label shown"** — within the 45 s wait the label never became
  visible at 390 (it shows only while a beast breaches on the camera-facing side). The banner text read after the
  DOM click was correctly gated in both rows (V neutral "Europa’s ocean", VI "Discordia Sea" + Light Bringer line).
  Rerun with a 120 s wait: label shown and banner gated for II, V and VI (7/7, exit 0) — a breach-timing wait under
  swiftshader, not an app finding. Book II at 390 and all three books at 1440 showed the label.

Leviathan coverage (item 2's explicit request): the globe banner and the scene landmark button show the gated
text in all 12 text checks (II/V neutral, VI full) at both widths, and the Lorn's Castle page text has no
Harmonia/Discordia before VI. Limit: every click in this probe fell back to a DOM click (Playwright's rendered
click did not settle within 6 s under swiftshader — the globe label moves every frame, and the dossier button
click timed out the same way); so this is rendered text after a DOM-dispatched click, not a pointer-hit test.

## 3. Four-viewport evidence at 03394c3

Society landing, Book I, 0 page errors each: [3840×2160](shots/03394c3-society-3840x2160.jpg),
[1440×900](shots/03394c3-society-1440x900.jpg), [1280×800](shots/03394c3-society-1280x800.jpg),
[390×844](shots/03394c3-society-390x844.jpg) (all under 300 KB). Looked at: labels and orbits crisp at 4K, no panel
overlap at 390. Pre-existing observation, unchanged: the phone hint still says right-drag/scroll.
Not captured: per-scene shots (Tyche, Lorn's Castle) at all four sizes; the probes above cover their text.

## 4. Consolidated unresolved-gate list (before any final-audit transition)

| Gate | Owner | State |
| --- | --- | --- |
| Full canon audit: 139 unselected records, remaining DW06 / full Society source coverage | ChatGPT (deferred under R3) | Uncertified; not requested again here |
| Canon approval of the PR as a whole ("Canon: approved" at a named SHA) | ChatGPT | Not given |
| Final technical sign-off (AUDIT_CHECKLIST §4) at the canon-approved SHA | Claude | Pending canon; this packet is the evidence base at 03394c3 |
| DWT-03-R1 (tree-order) | Claude | Deferred with trigger: fix before any pack with a `tree` integrates |
| Physical-device / real-GPU timing (swiftshader exits took 19–33 s; real GPU unmeasured) | Known gap | Not testable here |
| test:browser Save/Load flake | Known gap, tracked under mobile-entry-usability | Not in this PR's scope |
| Rendered pointer-hit for leviathan label/landmark (DOM click only) | Known gap | Text gating verified; hit-testing not |
| Mckay release approval, merge, deploy | Mckay | Not requested yet |

## 5. Handoff

fixing/claude → content-review/chatgpt for review of this packet at the unchanged head 03394c3. No merge, no deploy.
