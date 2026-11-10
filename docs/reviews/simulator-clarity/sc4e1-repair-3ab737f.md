# SC4-E1 recording/alignment repair — 3ab737f

Claude, 2026-11-10 UTC. PR [47](https://github.com/mckayec/universe-sandbox/pull/47), branch `sim/clarity-physics`, exact head **3ab737fe90991767b3cebf5410dc5a1c3b7a6f84** (unchanged; no application diff). This is the bounded evidence repair asked for in [sc4e1-review-3ab737f.md](sc4e1-review-3ab737f.md) (R1, R2). All results are **builder observations** from Chromium + SwiftShader software GL on a production build of that head. Not a real GPU, not a physical device, not independent execution.

## What changed in the method

| Review finding | Repair |
| --- | --- |
| **R1** `videoSeconds` was not a video timestamp; sheets mislabelled template frames as restored pause and compact speed frames | [evidence-harness-sc4e1-r.mjs](evidence-harness-sc4e1-r.mjs) injects a **harness-only overlay** (fixed, `pointer-events:none`, top-left 40×40 colour swatch + text; not app UI) and switches its colour at every phase change: `startup` (page start, template creation **and** Load), `restored-paused`, `1x`, `10x`, flyby `approach`/`recession`, `merged-10x`, `paused-after-merger`. [evidence-analyze-sc4e1-r.py](evidence-analyze-sc4e1-r.py) decodes **every** frame (ffmpeg, passthrough timing, PTS from `showinfo`) and labels it by the swatch the frame itself shows. The log→PTS offset is **measured per transition per clip** (first frame showing the new colour); no common offset is assumed. Probe samples (~100 ms) map to frames through the offset of the latest preceding transition and are only attached to a frame if within 0.3 s. |
| **R2** clipped screenshots during recording, grey partial frames, one fixed crop centre, 10× not in the freeze check | **No screenshot or Save click during any recorded window.** Videos record at full viewport size (1280×800, 390×844). Crops are derived offline and **follow the host** via the mapped probe screen position. Material-motion numbers are claimed only from a **separate non-recording metric pass** (`METRIC=1`, unclipped full-frame lossless PNGs, [evidence-metric-sc4e1-r.py](evidence-metric-sc4e1-r.py)) for the **stationary isolated hole** and the **paused merger survivor**, now covering pause, 1× **and** 10×. Pair/flyby crops are for viewing only; no pair/flyby pixel difference is offered as proof of disk shear. |
| Disk display cap | Stated explicitly: `src/visuals/update-visuals.ts` uses `diskDt = paused ? 0 : dt * min(speed, 4)`. The `10x` windows show the disk at the **4× display cap**; physics elapsed time is separate (`loop.ts`). No code change. |

## Alignment (all 7 clips)

From [alignment-sc4e1-r-3ab737f.json](alignment-sc4e1-r-3ab737f.json). Offsets are log seconds − PTS of the first frame showing that marker.

| Clip | Frames decoded | Unlabelled (before overlay) | Blank frames | Measured offset per transition (s) |
| --- | ---: | ---: | ---: | --- |
| isolated-1280x800 | 1089 | 249 | 10 | startup −0.305, restored-paused −0.092, 1x −0.031, 10x −0.048 |
| wide-equal-1280x800 | 887 | 61 | 0 | startup +5.922, restored-paused +6.102, 1x +6.139, 10x +6.157 |
| close-equal-1280x800 | 1096 | 254 | 10 | startup −0.317, restored-paused −0.074, 1x −0.079, 10x −0.054 |
| unequal-1280x800 | 933 | 71 | 0 | startup +6.247, restored-paused +6.455, 1x +6.478, 10x +6.498 |
| flyby-1280x800 | 1174 | 243 | 10 | startup −0.259, restored-paused −0.043, approach −0.042, recession −0.082 |
| flyby-compact-390x844 | 635 | 23 | 0 | startup +5.286, restored-paused +5.352, approach +5.359, recession +5.304 |
| merger-1280x800 | 1381 | 258 | 10 | startup −0.296, restored-paused −0.024, 1x −0.069, 10x −0.032, merged-10x +0.005, paused-after-merger +0.002 |

- The review was right not to assume a shared offset: clip-start offsets differ by **~6 s between clips** (recorder start vs page start), and within a clip transitions differ by up to **0.36 s**.
- **All 10 blank frames per affected clip fall in the unlabelled pre-load stretch** (before the app had painted); **0 blank frames inside any labelled window** in all 7 clips. With no screenshots during recording, the grey partial frames seen in the earlier sheets do not recur in these labelled windows. This is consistent with, but does not prove, the clipped-screenshot cause.
- Boundary caveat: the harness clicks speed/pause, then switches the marker, so the final frames carrying the outgoing label can already show the next state (visible in the flyby sheet: last `restored-paused` tile already moving). Metric windows therefore exclude 0.5 s at both ends.

## Material motion: isolated hole (stationary, host crop 352×352)

Lossless metric pass ([lossless-metrics-sc4e1-r-3ab737f.json](lossless-metrics-sc4e1-r-3ab737f.json), crops: [sc4e1r-metric-isolated-1280x800-crops.jpg](shots/sc4e1r-metric-isolated-1280x800-crops.jpg)); consecutive stills ~0.9 s apart (SwiftShader screenshot rate).

| Window | Stills | Probe | Mean abs luminance change | Left/right asymmetry |
| --- | ---: | --- | --- | --- |
| restored-paused | 4 | paused | 0.038, 0.063, 0.009 | 0.1368–0.1374 |
| 1x | 4 | running, speed 1 | 3.333, 3.697, 3.493 | 0.1258–0.1502 |
| 10x (disk at 4× display cap) | 5 | running, speed 10 | 5.789, 5.826, 7.260, 6.460 | 0.1123–0.1377 |

Paused max is **0.063**, under 2% of the 1× minimum (3.333); 10× changes more than 1× per still interval, as expected for a capped 4× display clock. Asymmetry keeps a positive sign in all 13 stills (spread 0.038 across 1×+10×). This supports broad camera-consistent highlight placement while the texture changes; it is **not** a spatial proof of shear at multiple radii. Viewing the crop sheet, the ring texture visibly shifts between 1×/10× tiles and is identical across paused tiles.

Video cross-check (lossy VP8 recording, aligned frames ~0.5 s apart, [video-metrics-sc4e1-r-3ab737f.json](video-metrics-sc4e1-r-3ab737f.json)): paused 0.008–0.756, 1× 2.011–4.207, 10× 4.241–6.246; asymmetry 0.099–0.155 throughout. Paused residue here is compression noise; the lossless pass is the claim.

**Merger survivor** (lossless): `paused-after-merger` 0.014, 0.011, 0.013 vs `merged-10x` 13.0–15.0 → frozen when paused. The merger 10× window is mostly the survivor (merger happens ~1 s into 10×); this is disclosed, not a pair-at-10× window.

## Flyby windows (state + viewing)

Same scenes as before; initial relative energy **+30.2207** (unbound) in both.

| Clip | Approach window | Closest sampled | Recession window |
| --- | --- | --- | --- |
| desktop 1280×800 | PTS 33.52–39.96 s | sep **14.822**, tide 0.866 at PTS 39.52 ([frame](shots/sc4e1r-flyby-1280x800-closest.jpg)) | PTS 40.00–46.92 s, sep rises to 114.3 by last tile, tide relaxes 0.94→0.13 |
| compact 390×844 | PTS 17.36–20.64 s | sep **15.199**, tide 0.897 at PTS 20.44 ([frame](shots/sc4e1r-flyby-compact-390x844-closest.jpg)) | PTS 20.68–25.36 s |

Both bodies remain (count 2) throughout. Flyby crops track the selected host but are moving-ROI views only.

## Artifacts (all under `docs/reviews/simulator-clarity/`)

- Harness / analysers: `evidence-harness-sc4e1-r.mjs`, `evidence-analyze-sc4e1-r.py`, `evidence-metric-sc4e1-r.py`. Raw log: [evidence-sc4e1-r-3ab737f.jsonl](evidence-sc4e1-r-3ab737f.jsonl) (video pass 0 failures; metric pass isolated+merger, 0 failures; marker-classifier negative controls 4/4).
- Contact sheets (4 aligned frames per labelled window, full frame + tracked host crop, label/PTS/probe on each tile): `shots/sc4e1r-{isolated,wide-equal,close-equal,unequal,flyby,merger}-1280x800-sheet.jpg`, `shots/sc4e1r-flyby-compact-390x844-sheet.jpg`. The `startup` row shows template then Load — the restored pair first appears inside `startup`; `restored-paused` begins only after Load + host selection settled.
- Viewing MP4s (re-encoded 800 px / 390 px wide, 12 fps; marker visible): `shots/sc4e1r-*.mp4` (7). The isolated source recording the video metrics came from is published as `shots/sc4e1r-isolated-1280x800.webm`; other source WebMs (2.3–3.6 MB each) are reproducible with the harness and are not committed. SHA-256 of all 7 source WebMs and 7 MP4s are listed below.

```
<!-- source webm -->
342ec9f4495fc272d8a15b5058bd8a3d721c78025b4b5b49db8e067488057038  sc4e1r-close-equal-1280x800.webm
cc242a2c0157d6e956f6d7c5f96c7c1228c876c3c76db7599dc48d7ce072f830  sc4e1r-flyby-1280x800.webm
71f3b57c7d0109dc9a5d29fc696347e4442ecd1d78c5f07a474f77803852b56d  sc4e1r-flyby-compact-390x844.webm
d1e7f09e3e858648c0c60c261bf0e07e9896b124d955a125c1be7d231184d680  sc4e1r-isolated-1280x800.webm
3838a0346aa48b829f9a69754b6617fadb0ea329643bb7cdde9e5756f930b982  sc4e1r-merger-1280x800.webm
f691f14191acab2f09b9a50de8c235b7ca8ff2cae4df040884650dc226cc4bb4  sc4e1r-unequal-1280x800.webm
2301493c06eb739e72db408f952bebdd357cbae901cb10de89c8dbb5c44550ef  sc4e1r-wide-equal-1280x800.webm
<!-- viewing mp4 -->
9615de40ffeb94b071c21a3ffc953e624c9d75a9528917c2335a852fdcab5343  sc4e1r-close-equal-1280x800.mp4
cf654b0062bd0544fe51699b6497e8f9d6fbb5115aafbb6311de6607b2441c92  sc4e1r-flyby-1280x800.mp4
abc0348c9f7a24d0ea6f7373d765ef20c503de05c94672af0f77cc05333271ba  sc4e1r-flyby-compact-390x844.mp4
ef209346104b34b8511dc458ffcbdc2c373a9c74bf2ad06291deb74c3c1acee1  sc4e1r-isolated-1280x800.mp4
f95a19b1160c3f86be57704bdbc897f54655b4501752dc7443e336145b8cd1d7  sc4e1r-merger-1280x800.mp4
8439c77d557cde930e8141ebe818dfeaa8b9593dd75d6a9f7198b4f740e68cac  sc4e1r-unequal-1280x800.mp4
52645186bdef209d02a6d8d07373c85261e633e2a39a765361de4d899acffce5  sc4e1r-wide-equal-1280x800.mp4
```

## Reuse of earlier footage

The earlier `sc4e1-*` clips/sheets are **superseded for timing/label claims**; they had no alignment and are kept only as history. All 7 scenario categories were re-recorded with alignment here, so no earlier footage is relied on.

## Not changed / still open

No application change; head unchanged at 3ab737f. Accepted 2/2 state series and 7/7 scenario inventory unchanged. SC7-O1 dock clipping, Save/Load strict five-run gate, legacy non-hole unit labels, 200% text/screen-reader coverage, SC1-E1/device/GPU/background and independent-rendering limits remain exactly as in the preceding packet review. No final technical sign-off or release approval is claimed.
