# Deep worlds R0-2: surface label downgrade fix (receipt)

2026-11-26 · Claude (builder subagent). This receipt answers finding R0-2 in `implementation-review-6f78d98.md`.

- **Candidate:** draft PR #53, branch `engine/deep-worlds-r0`. The PR is still a draft and has not been merged.
- **Reviewed head:** `6f78d98c301841277cce325b3c1fb818c048b1a7`.
- **New head:** **`a060de4263ec88870854ed9590da5192d6c35f24`**. I pushed two commits as a fast-forward and did not touch main.
  - `f279d997`: merges main `5210bba`. PR53 had a merge conflict in `engine.js` with main's LDS changes.
  - `a060de42`: the R0-2 fix plus the new fixture checks.
- **Browser:** Playwright Chromium 153.0.8010.12 (`/opt/pw-browsers/chromium-1243`), headless, run with `--use-gl=swiftshader --enable-webgl --ignore-gpu-blocklist` and deviceScaleFactor 1. The pages come from the `pnpm build` `dist/` at the new head. I ran every check myself, so none of this is independent verification.

## 1. Merge of main (f279d997)

Main gained the LDS surface journeys and the S46/S47 label layout and view-offset work. It also gained `cancelEvFocus`, the codex and sky hooks, and the move of `#labels`. That produced 11 conflict hunks in `public/atlas/engine.js`. I resolved them by keeping main's code and carrying the R0 and R0-1 places/tour additions on top:

- the S object gets both `lm` and `route`;
- the shell keeps main's `#labels` position and adds the tour box and button;
- the site label click can enter a place;
- `layoutSiteLabels` returns early in place view;
- the dossier keeps `routesHtml`, the enter buttons and the route click handler;
- `refreshAll` keeps the `inplace` class and the codex refresh;
- `selectWorld`, `selectSite`, `openEvent` and the book handler call both `placeGen++` and `cancelEvFocus()`;
- `selectSite` uses main's `turnToSite`;
- `doAscend` keeps `clearRoutes()` and `navBusy`;
- `PLACES.resize` takes the eased offsets in `applyViewOffset`;
- the frame loop keeps main's label-jump and routes code, with the place branch added.

I also made one small integration change in the merge commit: main's new route legs are hidden while the reader is inside a place.

## 2. Fix (a060de42): `public/atlas/engine.js` +11/−4 lines, opted-in packs only (fixture +154/−12)

- **`syncSurfaceSites(w)`** runs from the book handler when the world view keeps the same planet mesh (`PL.key === cacheKey`), and only when `PLACES` is on. It clears `S.site` and `S.lm` when the new book does not reach the selected site, then rebuilds the globe's site buttons from the eligible sites with `buildSiteLabels`.
  - On a downgrade, the later-book button is removed, which also removes its name, tab stop and aria exposure.
  - On an upgrade, the button is restored.
  - A pending place entry still cancels through its own `placeGen` check. Its snapshot (`pendPrev`) only exists for entries made from inside a place, and those take the place branch, so nothing needed for cancellation is touched.
- **Per-frame guard:** `layoutSiteLabels` now hides any label whose site is not `siteSeen` under the current book. It is hidden from view, from the tab order (`tabIndex -1`) and from assistive technology (`aria-hidden`). This guard only applies when `PLACES` is on.
- **World hidden by the new book:** the surface labels are removed immediately instead of after the 430 ms ascent fade (when `PLACES` is on).
- **Inside a place:** hidden globe labels also lose their tab stop and their aria exposure.

Non-opted packs are unchanged. The dormancy probe in §4 confirms this.

The pre-existing main behaviour that the reviewer reproduced at the PR base (stale surface labels on non-opted packs after a same-mesh book change) is intentionally left as it is. That follows D10: R0 stays dormant. It should be filed as a separate main issue if wanted.

## 3. Fixture changes (`tests/atlas-places-fixture.mjs`, test-only)

- **Snapshot:** each snapshot now records every `#labels .plbl` button with its text, opacity, tabIndex, `aria-hidden` and pointer-events.
- **New case S1, direct surface downgrade on an unchanged mesh.** The steps run on the book-II Arrakis surface with Paul's Keep selected:
  1. Positive control: the Keep label is shown and focusable (`tab=0`, `aria-hidden=false`). On the phone layout, the details sheet is lowered first.
  2. Switch to book I.
  3. Immediately after the switch, check:
     - no globe label carries later-book text;
     - no later-book label is focusable or exposed;
     - the book-I labels (Arrakeen, Sietch Tabr) are still offered.
  4. Confirm `__atlas.PL` is the same object, which proves this is the unchanged-mesh path.
  5. After settling, check:
     - the selection is cleared (`site=null`);
     - the URL has no `site=`;
     - the same three label predicates as in step 3 hold;
     - a real keyboard walk of 90 Tab presses from the top reaches no later-book name and reaches only book-I-eligible globe labels.
  6. Switch back to book II: the Keep label is restored.
- **Case B3, cancelled entry, extended:**
  - Label predicates are checked immediately after the downgrade, with the entry still pending.
  - The labels are sampled 20 times at 100 ms intervals during cancellation.
  - Once settled, the selection must be cleared, and the label predicates and the 90-stop Tab walk must pass.
  - Switching back to book II restores the Keep label.
- **Cases B2 and B4:** the label predicates are checked once settled.
- **`CASES=<regexp>`** filters which cases run.

## 4. Checks (exact counts)

| Check | Result |
|---|---|
| `pnpm format` then `pnpm check` (format:check, build, unit, check:dist) | Pass. **383/383** unit tests. |
| `pnpm test:pages` | Pass. **15 pages × 2 viewports**. |
| `pnpm test:places` at 1440×900 | **124/124**. Per case: L1 11, L2 8, L3 6, L4 6, B1 8, B2 12, B3 17, S1 17, B4 8, T1 4, T2 12, T3 4, H1 7, H2 4. |
| `pnpm test:places` at 390×844 | **124/124**, with the same per-case counts. In total **248 PASS / 0 FAIL**. Raw output: `r0-2-places-fixture-output-a060de4.txt`. |
| Negative control: the new harness with `CASES='S1\|B3'` against `f279d99` (the merge without the fix) | **44 passed, 24 failed** (`r0-2-negative-control-f279d99.txt`). The failures show the Keep label surviving with `tab=0 aria-hidden=false op=1`, the Tab walk reaching "Paul's Keep", and `site=keep` retained. This reproduces R0-2 at both widths. One 390 failure in that run was the old positive control, which had no sheet lowering yet; that has since been fixed in the harness. |
| `pnpm test:browser` | **Pass** this run. The Save/Clear/Load round trip restored 29 of 29 bodies. This step is known to be flaky on main as well, and passed here on the first attempt. |
| R0 dormancy probe (`docs/reviews/deep-worlds/r0-dormancy-probe.cjs`), candidate dist vs main `5210bba` dist | **138/138** at 1440×900 and **138/138** at 390×844. Outputs: `r0-2-dormancy-output-a060de4-{1440,390}.txt`. |
| Scope (`r0-scope-check.sh origin/main a060de4`) | See below. |

**Scope check details** (output in `r0-2-scope-check-output.txt`):

- The candidate changes 12 paths against main. These are the same 12 paths reviewed at 6f78d98:
  - the 9 R0 allowlist paths;
  - the 3 test-only R0-1 paths: `tests/atlas-places-fixture.mjs`, `tests/atlas-places-optin.test.ts` and `tests/fixtures/places-optin-fixture.js`.
- The script prints `RESULT FAIL` only because its allowlist predates R0-1 and does not list those 3 test files. No denied path is changed.
- The following trees and files are identical to main: `public/atlas/packs` (tree `52bf27df…`), `society.{js,html,css}`, `society-fonts.css`, `solar.js` and `src`.
- `public/atlas/tex` is absent.
- The four places modules are byte-identical to PR37 `03394c3`.
- 0 pack files carry `scene`/`landmarks`/`fx`/`lm`/`places` keys.
- The fix itself (`f279d99..a060de4`) touches only `public/atlas/engine.js` and `tests/atlas-places-fixture.mjs`.

## 5. Screenshots viewed

I opened and inspected all six. Each was PNG-quantized and is under 500 KB:

- `r0-2-S1-book2-before-{1440x900,390x844}.png`: the book-II surface. "Paul's Keep" is selected and highlighted on the globe, and the crumbs end in "Paul's Keep". On the phone, the "Charting surface" bar is still finishing.
- `r0-2-S1-downgrade-settled-{1440x900,390x844}.png`: book I on the same globe. There is no Keep label. Arrakeen now shows where the Keep label was, and the crumbs end at Arrakis. At 1440 the side panels are scrolled because the Tab walk ended in the chronicle ("Yueh's betrayal" is focused). At 390 the small empty outlined box beside Harg Pass is the keyboard focus ring on a collapsed marker after the walk, not a label.
- `r0-2-B3-downgrade-settled-{1440x900,390x844}.png`: the same settled book-I surface after the cancelled entry. There is no Keep label and no later-book copy. The 1440 capture is pixel-identical to S1 settled, as expected for the same end state.

## 6. Limits

- The pre-existing defect remains on non-opted packs on main, deliberately, per D10 (see §2).
- **L3 (stale `site=keep` link at book I)** still keeps the raw `keep` id in `S.site`, as before. It is a stale link, not a downgrade. It is hidden: there is no label, no `site=` in the URL and no copy. The label guard covers it.
- **Upgrade checks** assert only that the Keep label is back in the DOM. They do not check that it is on screen or focusable.
- The Tab walk is limited to 90 stops. It reached the globe labels at both widths.
- Only SwiftShader in headless Chromium was used. No physical device or real GPU was tested. The tree-bearing fixture qualification is open, as before.
- I did not inspect CI for `a060de4`. The PR reported `mergeable=true` with `mergeable_state=unstable` (checks pending) right after the push.
