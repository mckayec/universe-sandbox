# SC4-E1 motion/flyby evidence return — 3ab737f

Claude, 2026-11-10 UTC. PR [47](https://github.com/mckayec/universe-sandbox/pull/47), branch `sim/clarity-physics`, exact **unchanged** head **3ab737fe90991767b3cebf5410dc5a1c3b7a6f84**. No application or PR-branch change in this unit, so there is no new SHA. This answers the bounded unit in [packet-review-3ab737f.md](packet-review-3ab737f.md) §"One bounded next unit".

## What was run

- Harness: [evidence-harness-sc4e1.mjs](evidence-harness-sc4e1.mjs) (git blob `2f5b20821de739336f2dfb9db19741be4ea55cbb`). Raw log: [evidence-sc4e1-3ab737f.jsonl](evidence-sc4e1-3ab737f.jsonl) (one line per scenario, with every assertion, the probe rows per segment and the full flyby time series).
- How: detached checkout of 3ab737f, `pnpm install --frozen-lockfile`, `pnpm build`, harness copied to the checkout root, `CHROME_PATH=/opt/pw-browsers/chromium-1243/chrome-linux64/chrome node evidence-harness-sc4e1.mjs <outDir>`. Production build via `vite preview`, page opened with `?probe=1` (the existing read-only probe).
- Renderer: **headless Chromium 1243 with SwiftShader software GL. Not a real GPU, not Safari, not a physical device.** Builder evidence, not independent rendered acceptance.
- Result: **89/89 scenario checks + 2/2 aggregate checks pass, exit 0**. 0 page/console errors and 0 shader/WebGL program messages in every scenario (each scenario asserts both).
- Not re-run this unit: `pnpm check`, unit tests, `test:pages`, CI. The head is unchanged, so earlier exact-head results stay historical (224/224 units, 113 dist, 24/24 pages).

## Method (deterministic scenes, fixed cameras)

For each scenario the harness writes a fixed snapshot into the app's own save slot (`gravity-lab-universe-v1`) and restores it with the real **Load** button while paused. The snapshot fixes body kind (black hole), masses, positions, velocities, camera position and view target. It is built from a template body that the app itself saved, so every other field is genuine. The host body is selected with an Inspect-mode click. Then three **matched segments** run with the same camera: **paused → 1× → 10×**.

Each segment records:

- requested speed, probe `paused`/`speed` and the probe body rows (id, mass, position, tide);
- simulated elapsed time (`app.elapsed`), read before and after the window from a Save snapshot;
- `#info-disk` text;
- four disk crops 0.7 s apart, centred on the host's probe screen position. From these it computes mean absolute luminance change between consecutive crops and a left/right brightness asymmetry.

**Disk phase:** the read-only probe does not expose the disk shader `time` uniform, and no code change was requested. So phase is evidenced two ways: (a) frozen vs advancing simulated time (disk `time` advances on `diskDt` from simulated time, `update-visuals.ts`), and (b) pixel change inside the disk crop. Every scenario context records a video.

Pure rules with negative controls (all rejected or accepted as expected, line 1 of the log):

- flyby shape: rejects approach-only, merge and no-recede;
- freeze rule: rejects a moving pause, a pause that is not small relative to running, and a static run;
- highlight rule: rejects a sign flip and a missing highlight;
- energy rule: rejects a bound pair.

## Results

| Scenario (1280×800 unless noted) | Scene | Paused | 1× | 10× | Scenario-specific checks |
| --- | --- | --- | --- | --- | --- |
| isolated | 1 × 600 at rest | sim time frozen 0→0; crop Δ ≤ 0.05 | sim +1.65; crop Δ 5.7–6.9 | sim +16.5; crop Δ 3.9–5.1 | Highlight left/right asymmetry stays same-signed at 0.10–0.14 (spread 0.045) across 1×+10× while the material changes. Disk "Undisturbed", tide 0 |
| wide-equal | 600/600 circular, sep 34 | frozen; Δ ≤ 0.10 | +1.67; Δ 11.4–13.2 | +16.5 | Tide 0.43, "Truncated … 74% (heuristic estimate)". Both bodies survive |
| close-equal | 600/600 circular, sep 20 | frozen; Δ ≤ 0.77 | +1.68; Δ 19.2–21.7 | +16.5 | Tide 0.94, "Strongly truncated … 44%". Both survive |
| graded wide vs close | same masses | | | | Wide tide 0.43 < close tide 0.94 |
| unequal | 600/120 circular, sep 24 | frozen; Δ ≤ 0.17 | +1.65; Δ 8.6–9.6 | +16.5 | Tide 0.47, "Truncated … 72%". Both survive |
| **flyby** | 600/600, start sep 122.4, closing 9 u/s, offset 25; relative energy **+30.2 (unbound)** | frozen; Δ ≤ 0.013 | +1.75; Δ 6.9–9.2 | +17.4 | Continuous 250 ms series: sep 122.4 → **min 14.9** → 137+ and late 226.8. Both bodies survive throughout (no merger). Host tide peaks **0.94**, relaxes to 0.0079 after recession |
| **flyby 390×844** | same flyby rotated to the portrait axis; view target lifted above the dock | frozen; Δ ≤ 0.001 | +2.13; Δ 12.8–15.3 | +21.6 | Sep 122.4 → **min 15.1** → 175 and late 428. Both survive. Tide peak 0.94 → 0 |
| **merger** | 600/600, sep 16, small tangential v; energy −78 (bound) | frozen; Δ ≤ 1.08 | sim +1.62; infall, sep 15.9 → 5.0; Δ 12.6–27.3 | merged before the 10× window began | One survivor (id 1) and it is selected; swallowed id gone; mass 1200 = sum. After 3 s: tide 0, "Undisturbed". Re-paused survivor crop Δ ≤ 0.03 |

Matched windows: 10× advances 9.8–10.4× the simulated time of 1× over the same harness window in every scenario (check "10x advances more simulated time than 1x" uses a conservative >2× threshold; actual values are in the log).

## Clips (shots/)

One H.264 clip per scenario, ≤ 360 KB each. Each clip has a labelled contact sheet, taken at +1.5 s and +4 s into every segment plus the end frame. Segment start times in seconds are in the log (`segments[].videoSeconds`).

- isolated: [mp4](shots/sc4e1-isolated-1280x800.mp4) · [sheet](shots/sc4e1-isolated-1280x800-sheet.jpg)
- wide equal: [mp4](shots/sc4e1-wide-equal-1280x800.mp4) · [sheet](shots/sc4e1-wide-equal-1280x800-sheet.jpg)
- close equal: [mp4](shots/sc4e1-close-equal-1280x800.mp4) · [sheet](shots/sc4e1-close-equal-1280x800-sheet.jpg)
- unequal: [mp4](shots/sc4e1-unequal-1280x800.mp4) · [sheet](shots/sc4e1-unequal-1280x800-sheet.jpg)
- flyby: [mp4](shots/sc4e1-flyby-1280x800.mp4) · [sheet](shots/sc4e1-flyby-1280x800-sheet.jpg) · [after](shots/sc4e1-flyby-1280x800-after.jpg)
- flyby 390×844: [mp4](shots/sc4e1-flyby-390x844.mp4) · [sheet](shots/sc4e1-flyby-390x844-sheet.jpg)
- merger: [mp4](shots/sc4e1-merger-1280x800.mp4) · [sheet](shots/sc4e1-merger-1280x800-sheet.jpg) · [after](shots/sc4e1-merger-1280x800-after.jpg)

Viewed: flyby, close-equal and compact-flyby sheets, plus the isolated end frame and the merger post-merge frame. Software GL runs at about 5–6 FPS, so clips are choppy. **Clip artifact:** brief grey or partial frames appear in the recorded video when the harness takes clipped crop screenshots. They come from the recorder, not the app.

## Coverage matrix (required isolated/wide/close/equal/unequal/flyby/merger)

| Cell | This unit (3ab737f, enforced) | Earlier evidence |
| --- | --- | --- |
| isolated | paused/1×/10× clip + highlight-consistency + freeze | — |
| wide | paused/1×/10× clip, graded tide | 4b (earlier head, static) |
| close | close-equal and unequal clips | 4b (earlier head, static) |
| equal | wide, close, flyby, merger | — |
| unequal | paused/1×/10× clip (600/120) | 4b-2 transfer disk between two stars (earlier head; disk-encounter files unchanged since 920f76e) |
| flyby | desktop + compact, unbound, approach/recede, tide rise/relax | **none before this unit** |
| merger | clip, survivor, summed mass, cleanup, re-pause freeze | 4b-2 merger survivor (earlier head) |

All seven cells now have exact-head clips. Limits that remain:

- Clips are desktop only, except flyby, which also has 390×844.
- Paused/1×/10× are matched per scenario, not before/after a code change (there is none).
- In the merger scene the infall happens in the 1× window and the merger completes between the 1× and 10× windows. The 10× and paused-after segments therefore show the merged survivor.
- Mid-encounter pause is not separately clipped. The pause-freeze evidence comes from the pre-run pause in every scene plus the post-merger re-pause.
- Small paused residuals (close 0.77, merger 1.08 grey levels, always < 10% of running change) are consistent with the companion tide relaxing on frame time while bodies are frozen, as documented in harness 4b-2. Simulated time itself is exactly frozen.
- Highlight consistency is measured on the isolated disk only. In pairs the crops follow moving bodies, so the asymmetry is not comparable there.

## Gates retained (unchanged by this unit)

- SC7-O1 (Low 667×375 dock clipping);
- Save→Clear→Load (2/3 builder-reported; five-run strict repair process still required);
- legacy non-hole M⊕ labels;
- 200% text and screen reader;
- SC1-E1, real GPU, physical iPhone/Safari and genuine OS backgrounding are unverified;
- no independent rendered acceptance.

## Next

ChatGPT: implementation-review of this SC4-E1 evidence unit at unchanged 3ab737f. That covers whether SC4-E1 can close at builder-evidence scope with the limits above, and what remains between the packet and final technical sign-off.
