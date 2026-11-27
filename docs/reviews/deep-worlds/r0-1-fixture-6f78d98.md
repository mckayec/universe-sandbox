# Deep worlds R0-1: isolated opt-in fixture (receipt)

2026-11-26 · Claude (builder subagent). Answers the remaining return unit R0-1 in `implementation-review-7a25822.md`.

- **Candidate:** draft PR #53, branch `engine/deep-worlds-r0`.
- **Reviewed head:** `7a25822e8504da0882fc593942065328794a579a`.
- **New head:** **`6f78d98c301841277cce325b3c1fb818c048b1a7`**. One commit, pushed as a fast-forward. Main was not touched.
- **Browser:** Playwright Chromium 153.0.8010.12 (`/opt/pw-browsers/chromium-1243`), headless, SwiftShader WebGL (`--use-gl=swiftshader --enable-webgl --ignore-gpu-blocklist`), deviceScaleFactor 1. The site was served from `pnpm build` `dist/` at the new head. I ran every check myself; nothing here is independent.

## 1. Code delta since 7a25822 (6 files, +700/−1)

| File | Change | D10 scope |
|---|---|---|
| `public/atlas/engine.js` | **Bug fix (`selectLandmark`):** only a landmark that the rendered place shows can now be selected. Before the fix, a stale or later-book `lm` in a deep link stayed in `S.lm` and in the URL. Example: `…&view=place&lm=fxlater` under book 1 kept `lm=fxlater` even though no landmark was focused. This was found by fixture case L2 (3 FAILs before the fix, 0 after). There is also a comment at `placesOn` that documents the opt-in contract. | Engine infrastructure. It acts only in `view=place`, which stays dormant without an opt-in. |
| `tests/atlas-pack-validator.mjs` | A non-object `places` (array, null, boolean, string or number) is now reported as an **error**. Before, it was silently ignored. | Validator support. |
| `tests/atlas-places-optin.test.ts` (new) | Unit tests: (a) no shipped pack, with registry parts loaded, has a `places` key; (b) the fixture applied to Dune validates with 0 issues; (c) 5 malformed opt-ins are rejected. | Test support. |
| `tests/fixtures/places-optin-fixture.js` (new) | Test-only fixture. It is never copied to `dist/`, and the harness appends it to the Dune pack response in the browser. | Isolated fixture. Not pack data. |
| `tests/atlas-places-fixture.mjs` (new) | Playwright lifecycle harness. | Browser test. |
| `package.json` | Adds `"test:places": "node tests/atlas-places-fixture.mjs"`. It is not part of `pnpm check` or CI. | Package/test support. |

**Scope confirmation:**
- The diff 7a25822..6f78d98 touches no path under `public/atlas/packs/`, `society*`, `tex/`, `solar*`, `src/`, `docs/` or `check-dist`. I grepped the changed paths against that deny set and got 0 hits.
- The `public/atlas/packs` tree hash is `7f02fe18f81c9e0ac870bd4dfe426fe1cce938f1` at both heads, the same as main's, per the R0 receipt.
- No shipped pack opts in, and a unit test now enforces that.
- The fixture is not tree-bearing: Dune has no `tree`. So the DWT-03-R1 tree-integration trigger and the device/GPU limits carry over unchanged.

## 2. Fixture

`tests/fixtures/places-optin-fixture.js` opts Dune in (`places:{}`) and adds the following. All names are fixture-labelled so that any leak is easy to detect.

- **Two eligible book-1 destinations on Arrakis:**
  - Arrakeen (`scene` city/desert, landmark `fxres`, book 1).
  - Sietch Tabr (`scene` sietch, landmark `fxcave`).
- **A later-book landmark and event:** `fxlater` "Fixture Later Hall" (`first: 2`) at Arrakeen, with event `m4` (book 2) pointing at it (`lm: fxlater`).
- **A later-book enterable site:** Paul's Keep (books 2–3, landmark `fxkeep`, event `m3`).
- **Events tied to the book-1 landmarks:** `d4` → `fxres` and `d6` → `fxcave`.

The harness intercepts `**/atlas/packs/dune.js` and appends the fixture. No file under `public/` and nothing in `dist/` is changed.

**How "during the fade" is measured.** An init script hooks `#fade`. Each time the fade turns on, the script snapshots state 150 ms later, which is inside the 430 ms window before the transition commits.

**What every snapshot records:**
- view, sel, site, lm, ev and book;
- rendered place (`AtlasPlaces.place.site.id`) and rendered landmark focus (`place.sel`);
- `#dossier`, `#crumbs`, the `#announce` live region and `#chron` text;
- `location.hash`, `history.state` and `history.length`;
- tour box state;
- a per-document marker.

**Shared predicates:**
- When settled, the rendered place and landmark equal state.
- No later-book copy (Fixture Later Hall, Fixture Keep Tower, Paul's Keep, "The stone burner", "Hayt") appears in the dossier, crumbs, announcement or chronicle. The URL never contains `site=keep`, `lm=fxlater`, `lm=fxkeep` or `book=2` under book 1, whether mid-fade or settled.
- The page stays on the same document.
- There are 0 page or console errors.

## 3. Cases × results (final head 6f78d98)

| Case | What is exercised | 1440×900 | 390×844 |
|---|---|---|---|
| L1 valid place link | `#book=1&…site=arrakeen&view=place&lm=fxres`. Entry fade sampled with no later copy; settles in Arrakeen at `fxres` with render = state; dossier shows the landmark; crumbs name Arrakeen; announcement "Arrakeen, inside, on Arrakis. Reading Dune"; URL `view=place&lm=fxres` with an `atlasPlace` history state; book-1 landmark list excludes `fxlater`. | 11/11 | 11/11 |
| L2 stale landmark link | `lm=fxlater` under book 1. Place renders; lm dropped in state, render and URL; no later copy at any fade or when settled. (Failed 3 rows before the `selectLandmark` fix.) | 8/8 | 8/8 |
| L3 stale later-book site link | `site=keep&view=place` under book 1. Sampled every 150 ms for 7 s: never enters, never builds, and no Keep copy appears. Settles on the Arrakis surface with no visible site; URL rewritten to `view=surface` without `site=`. | 6/6 | 6/6 |
| L4 stale unknown site link | `site=nosuch&view=place`. Same checks as L3; the id is also dropped from state (DWO-S1). | 6/6 | 6/6 |
| B1 downgrade in place, later landmark selected | Arrakeen at book 2 with `fxlater` focused (positive control), then book 1. Immediately: no later copy or URL. Settled: still in Arrakeen; lm and ev null in state and render; `fxlater` not rendered; announcement uses the book-1 title. | 8/8 | 8/8 |
| B2 downgrade in a committed later-book place | In Keep (in-app entry), then book 1. Mid-leave-fade: dossier, crumbs, announcement and chronicle are neutral; URL `#book=1&world=arrakis&view=surface` (DWO-E2-F1/F2). Settled: Arrakis surface, render = state, no place history state. | 9/9 | 9/9 |
| B3 downgrade mid-entry | Enter Keep, then book 1 150 ms into the entry fade, timed in-page. Entry never commits or builds; place history marker dropped; neutral throughout. | 7/7 | 7/7 |
| B4 downgrade mid-leave | Keep, then "Back to Arrakis", then book 1 during the leave fade. Neutral mid-fade; settles on the surface. | 5/5 | 5/5 |
| T1 tour Stop mid-entry | ▶ Tour (step 1 travels to Caladan), then Stop during the first fade. No place entered or built; render = state; tour hidden; no place history (DWT-01a). | 4/4 | 4/4 |
| T2 repeated tour destination | Rapid Next×2 lands only on d3 in Arrakeen. Next to d4 (same place): no re-entry fade, `fxres` selected, history length unchanged, URL `lm=fxres`. Next (d5, a leave in flight) then Next (d6) queued: lands only on d6 in Tabr at `fxcave`, with crumbs and announcement naming Tabr. Prev, then Next back to the same destination, settles once on d6 (DWT-02). Stop settles with render = state. | 12/12 | 12/12 |
| T3 tour Stop during travel | Inside Arrakeen; the tour travels to d1. Next (d2, Giedi) then Stop 150 ms later. The d2 travel is cancelled and the settled view has render = state. | 4/4 | 4/4 |
| H1 Back during travel | Chronicle d4 enters Arrakeen (pushes an app entry). Hop to Tabr, then `history.back()` 100 ms into the hop fade, timed in-page. popstate arrived **before** the hop commit at both widths (1440: 1596 ms; 390: 687 ms); Tabr was never built; settles on the Arrakis surface with render = state, URL `view=surface`, no place history state, announcement "Arrakis, on the surface…". | 7/7 | 7/7 |
| H2 Back/Forward settled | Enter Tabr from its surface; Back returns to the surface; Forward re-enters Tabr with render = state. | 4/4 | 4/4 |
| **Total** | | **91/91** | **91/91** |

**182 PASS / 0 FAIL.** Raw output: `deep-worlds-r0-1-fixture-output-6f78d98.txt`, in this folder.

**History of this harness, all on my machine:**
- **First run at 7a25822 + fixture:** 79/87. The 8 FAILs were:
  - 3 from the real stale-lm bug in L2;
  - 5 harness timing or predicate faults: a missed fade sample in L1, a screenshot that delayed Back in H1, and strict `S.site == null` in L3, B3 and B4.
- **After fixes:** 85/89, then 91/91 per viewport. I gave the predicates these changes:
  - **Fade sampling** moved in-page, so a slow round trip cannot miss the 430 ms window.
  - **H1 and B3 timing** is in-page (`setTimeout` inside the page).
  - **Later-book site id (L3, B3, B4):** the predicate now allows `S.site='keep'` to remain as a *hidden* id after the downgrade or stale link. The URL, dossier, crumbs and announcement must still present no site. This matches main's surface behaviour: on a book downgrade at `view=world`, main keeps `S.site`, and `hideUnseen`/`asVisible` hide it. R0's place-leave path clears it, while the surface path keeps it hidden. It is presentation-neutral, so I left it alone rather than change baseline semantics. Reviewers may still want a decision on it.

## 4. Unavailable or limited cases

- **Mid-fade screenshots.** A screenshot under SwiftShader often takes longer than the 430 ms fade. `B2-downgrade-midfade-390x844.png` caught the black fade. The 1440 version caught the settled surface just after it. The mid-fade *assertions* come from the in-page samples, not from screenshots.
- **H1 order dependence.** Both runs saw popstate before the hop commit. The opposite order (Back processed after the commit) passes by design, because the leave follows from Tabr. It was seen in a development run but is not forced by the final harness.
- **Books.** The fixture covers book 1↔2 under cumulative mode. "All books" and realm or layer filters are not part of the fixture. Dune has neither realms nor layers.
- **Not covered:** a real GPU, physical devices, pointer-hit testing of 3D landmark labels (landmarks were selected through dossier buttons and events), Save/Load of place state, audio, and tree-bearing place data (DWT-03-R1). The R1 32-slot matrix stays deferred.
- **Builder-run only.** The fixture run is not in CI. `test:places` is a separate script, like `test:pages`.

## 5. Opt-in documentation disposition

**What I did:** a code comment at `placesOn` in `engine.js`, plus a validator **error** and a unit test.

**The contract:**
- Only a plain-object top-level `places` turns places on. Its keys are passed to `AtlasPlaces.enter` as scene defaults.
- A missing key, null, an array, a boolean, a number or a string leaves the feature off.
- The validator now rejects any of those non-object values, so a malformed opt-in fails the validator instead of silently disabling the feature.

**Why not `docs/atlas/PACK_FORMAT.md`:**
- D10 limits R0 to engine, loader, style, validator and test integration, and lists PR37 `docs/**` as untouched.
- The R0 receipt assigns PACK_FORMAT §22 docs to the coordinator.

The code comment plus an enforcing check covers the review's "add a type check *or* document" without opening a docs path. PACK_FORMAT §22 stays a coordinator follow-up.

## 6. Checks at 6f78d98

| Check | Result |
|---|---|
| `pnpm format`, then `pnpm check` | Format check clean; build OK; unit **167/167** (165 before + 2 new); check:dist **124 files OK** |
| `pnpm test:pages` | **14 pages × 2 viewports passed** |
| `pnpm test:browser` | **FAIL in 2 of 2 runs** (the first run plus the one allowed rerun). Both failed at the known `browser-smoke.mjs:88` Save → Clear → Load `#count` wait (`TimeoutError` after 30000 ms). The R0 receipt records the same flake on main (3/7 passes, last 3 consecutive failing). This head changes nothing under `src/` or in `browser-smoke.mjs`. It is not credited as passing. |
| `pnpm test:places` (fixture) at 1440×900 and 390×844 | **182/182** |
| Exact-head CI | `build` run [45941130717](https://github.com/mckayec/universe-sandbox/actions/runs/45941130717) **success** (`deploy` skipped on the PR branch). The `test:browser` Save/Load smoke still timed out twice locally at this head (known flake, untouched `src/`). |

## 7. Screenshots (in [shots-r0-1-6f78d98/](shots-r0-1-6f78d98/))

All are PNG, deviceScaleFactor 1, quantized to under 330 KB.

| File | What it shows |
|---|---|
| `L1-settled-{1440x900,390x844}.png` | Inside Arrakeen. The Fixture Residency label is in the scene; the dossier has the Landmarks section (Residency + d4) and "What happened here"; crumbs end at Arrakeen. |
| `T2-repeated-settled-*` | Arrakeen with the tour box on d4 ("Yueh's betrayal…", 4/12), at 390. |
| `B2-downgrade-midfade-*` | 390: full black fade with the book I button pressed, the surface sheet reading "Arrakis on the surface", and no Keep text. 1440: the surface just after the fade. |
| `B2-downgrade-settled-*` | Arrakis surface at book I, no Keep. |
| `H1-back-settled-*` | Arrakis surface after Back. |

**What I looked at:**
- L1 1440: place, landmark label, dossier landmark list and crumbs look correct.
- B2-mid 390: neutral black fade with the surface sheet.
- B2-mid 1440: surface with the Arrakis dossier and no Keep.
- T2 390: tour box over the Arrakeen dossier.

**Cosmetic, not caused by this change:** in the 1440 B2 shot, the place hint ("…Esc returns to the world") is still showing on the surface just after the leave, overlapping the dossier eyebrow. A Twisting-of-the-South galaxy label is clipped under the Gravity Lab button.
