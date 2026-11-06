# Final canon audit — Christian apocrypha

2026-11-06 · ChatGPT · Implementation PR [#38](https://github.com/mckayec/universe-sandbox/pull/38), branch `pack/christian-apocrypha`, exact reviewed head **`caf70a87b574da1073c2147e73d909eb2a9193ed`**, parent `1e256ceb3ac797ab998c6b7af0edb41d31c8da6f`.

## Prior evidence retained

This is the bounded round-2 return check requested by status.md and fixing-round2.md. It continues, rather than replaces or repeats, the [earlier final audit](https://github.com/mckayec/universe-sandbox/blob/d9a05c198f54c838f8bba7076c07fe6a6b11af0b/docs/universes/packs/christian-apocrypha/audit-final.md), its companion source ledgers and [20-item sample](https://github.com/mckayec/universe-sandbox/blob/d9a05c198f54c838f8bba7076c07fe6a6b11af0b/docs/universes/packs/christian-apocrypha/audit-final-sample.json). That audit resolved 18/19 APB findings; APB-004 was the technical evidence exception. It checked 20/20 selected entries against sources, found Low APF-001 in one, and left APQ-004 for research/build alignment.

The [APQ-004 alignment](https://github.com/mckayec/universe-sandbox/blob/d9a05c198f54c838f8bba7076c07fe6a6b11af0b/docs/universes/packs/christian-apocrypha/apq004-alignment.md) and corrected CSVs are at that immutable review revision on PR #42. They are not claimed to have been copied into main or the implementation branch by this audit. The current implementation is assessed against that documented correction as well as the original owner-narrowed research baseline.

## Returned corrections: 2/2 resolved

| ID | Result at caf70a87 | Evidence and limits |
|---|---|---|
| APQ-004 | Resolved for the reviewed implementation and the aligned research revision above. | Freshly opened [NABRE Tobit 14:4](https://bible.usccb.org/bible/tobit/14): Tobit's advice favors Media over Assyria or Babylon. The slot-1 name mention is justified; it does not establish a visit, a route or a surveyed event location. Babylon's books are now [1,5,6,7,8,9,10,11,22]. Coordinates and modern-heritage disclaimer are unchanged; tob-14 remains unpinned and bar-01 stays at slot 5. The new card wording is an attributed paraphrase, not a quotation. |
| APF-001 | Resolved. | Freshly opened [RV 1895, 2 Maccabees 3:25–26](https://ebible.org/eng-rv/2MA03.htm). The revised m2-03 assigns the strike to the horse and scourging to the two youths. The surrounding miracle-account attribution remains. |

Source pages were opened on 2026-11-06. This was source-based web research; no separate Deep Research product was invoked. Neither passage is certified as independent historical evidence.

The aligned research rows were also read directly at d9a05c1: dc-ref-babylon, dc-tob-14-card, the added dc-ref-babylon-mention-tob14, and their work-index rows. The seven pre-existing Babylon mention edges remain gated 5,5,6,7,8,9,9. The implementation follows this separation.

## Exact-head verification

- Read the complete two-file correction diff and both actual files at caf70a87. Only the pack and its targeted tests changed; no engine change.
- Independently evaluated the parent and new pack with Node 24.22.1. Full object comparison found exactly three changed values: Babylon's books array and the text of tob-14 and m2-03. All other pack data, including all codex entries and later additions, are identical. Counts remain **327 events / 706 base codex entries / 77 later additions**, with five anchors.
- Compared all **20/20** prior sample keys between those evaluated packs: **19 unchanged**, one changed (m2-03), freshly source-checked above. The original deterministic seed, pool and selection are retained in the linked prior audit; no replacement sample or fresh rereading of the 19 unchanged entries is claimed.
- Ran the unmodified exact-head `tests/atlas-apocrypha.test.ts` with all seven CSV fixtures fetched from the same commit in an isolated local fixture: `node --experimental-strip-types --test tests/atlas-apocrypha.test.ts`, **18/18 pass**, including both new tests. This is not execution of the whole-project or browser suites. An initial independent comparison assertion used a mistaken hard-coded event index; replacing it with event-ID lookup yielded the three-value result above. It was a reviewer-script error, not a pack defect.
- Inspected exact-head [Actions run 42147439543](https://github.com/mckayec/universe-sandbox/actions/runs/42147439543) and its build-job steps: format, build, unit tests, distribution checks and standalone-page checks succeeded; deploy was skipped. This is independently inspected remote evidence. The builder's 102/102 full-suite count and 12×2 page count remain builder-reported; they were not locally reproduced here.
- Read the exact-head workflow and package scripts: the workflow does not run `test:browser`. PR #38's description now correctly states this and the reported software-GL timeout. APB-005/006 reporting follow-up is satisfied; a successful standalone-page job does not turn that timeout into a pass.

## Scope and handoff

The **18/19 APB** disposition is carried forward with the unchanged-content comparison; it is not a new 19-finding source sweep. All outstanding content corrections identified by the previous final audit are now closed, including the sole correction from its 20-item sample.

The previous confidence restrictions still apply: eleven Meqabyan U records stay excluded, slots 18–20 retain coverage notices, no additional L coordinate proposal is admitted, modern anchors are not exact narrated locations, and source/edition/OCR uncertainty remains visible. The two changed text passages introduce no unsupported chronology or geography. Q01–Q03 retain their recorded accepted dispositions, including the explicitly deferred exhaustive quotation inventory for this paraphrase-only build. This approval covers the owner-narrowed implemented scope, not missing Meqabyan research, every manuscript tradition, or a complete new primary-text reading.

**Technical remains unapproved.** APB-004 requires finished real-GPU surface evidence. The separate browser-smoke timeout and Claude's exact-head technical checklist/sign-off remain open. No new rendered capture or performance test was performed here, and the builder's unfinished images are not accepted as finished-surface evidence. Claude must retain these blockers until independently supported technical evidence exists.

Hand back to **final-audit / claude** for that technical pass, under PROMPTS §4. Do not advance to ready-for-owner without both sign-offs at the same revision. Any later content change needs a canon recheck; any later code change needs the appropriate technical rerun. Mckay's eventual release approval remains separate. No merge, deployment or release approval.

For PR #38 at **caf70a87b574da1073c2147e73d909eb2a9193ed** only:

**Canon: approved**

---

## Technical pass (Claude), checkpoint 1 — PR #38 at caf70a87b574da1073c2147e73d909eb2a9193ed

Run 2026-11-06 02:46–03:25 UTC in the cloud sandbox (Chromium 1243, `--use-gl=swiftshader`). Exact head checked out and confirmed (`git rev-parse` = caf70a8).

| AUDIT_CHECKLIST §4 item | Result at caf70a8 |
|---|---|
| Atlas validator | `docs/reviews/site-audit/atlas-validate.js` (run as CommonJS): christian-apocrypha 0 issues, 327 events, 5 sites, no world without sites, no polar sites; only the two known §20 warnings (`layers`, `start`). |
| `pnpm check` | Pass: format check, build, 102/102 unit tests, check:dist 112 files with no third-party loads. |
| `pnpm test:pages` | Pass, 12 pages × 2 viewports. |
| `pnpm test:browser` | Times out at `browser-smoke.mjs:88` (simulator Load after Save; does not open the atlas). **Same failure on current main 9f4ce77** run in the same sandbox, and `src/` differs from main only by the 10-line pack registration in `src/universe-packs.ts`. So the timeout is environmental/pre-existing, not caused by PR #38. Not run by CI (deploy-pages.yml). |
| Console / third-party | 4K atlas session: 0 console errors, 0 third-party requests (`tech-bake-capture.txt`). |
| 4K crisp surface | **Blocker — TA-01, below.** |
| Other sizes, phone performance, memory | Not re-run in this checkpoint (content-only change since 1e256ce; earlier 1440/1280/390 captures exist). To do in checkpoint 2. |

### APB-004 re-diagnosed: the finished 4K surface is not crisp, and a GPU will not change that

Earlier runs stopped the capture before the "Charting surface" bake finished and asked for real-GPU hardware. This run let the bake finish: `tech-bake-capture.mjs` loads the pack at 3840×2160 (so the desktop 4096 bake size and 8192 map width are chosen at start-up), shrinks the window only while the bake runs so software GL can keep up, waits for 100 % (497 s), restores 3840×2160 and captures. Bake output does not depend on the window size, and a GPU computes the same pixels faster.

- `shots/tech-caf70a8-3840x2160-baked.jpg` (finished bake, downscaled to 1920 wide) and `shots/tech-caf70a8-3840x2160-baked-crop1to1.jpg` (1:1 crop around Jerusalem/Babylon).
- **TA-01 (High, technical, engine):** with the bake complete, the coastlines of the Mediterranean, Red Sea and Persian Gulf are visibly stair-stepped and the land soft. Cause: the Earth layer is driven by `public/atlas/earth-base.png`, a **1024×512** grayscale land mask (about 0.35° per texel, ~30 screen pixels per texel at the default 4K framing). The 4096 bake and 8192 vector maps cannot add detail that mask does not have. This fails §4 "crisp surfaces and maps at 4K" on any hardware.
- This is shared engine code: the same Earth view is used by the LDS (PR #33) and Abrahamic (PR #39) atlases, so it also explains their open "finished 4K capture" items.
- Proposed fix (generic engine work, next checkpoint): replace the mask with a higher-resolution public-domain land mask (Natural Earth 1:10m/1:50m land, rasterised to 4096×2048 on desktop with a smaller copy for phones, kept same-origin) and sample it with a smooth threshold so coastlines stay clean when magnified. Then re-capture all four sizes, re-check phone memory and performance, and record before/after crops. Pack data is untouched, so the canon approval should stand; the change would be a code change needing a technical rerun and a new SHA.

**Technical: not approved at caf70a8.** Blocker TA-01 (APB-004). Claude keeps final-audit ownership and continues with the TA-01 fix.

### TA-01 checkpoint 2 (2026-11-06T11:13Z, Claude)

- **Mask fix built** on branch `engine/ta-01-land-mask` at **46d2548b9d82e02fd0e3cc0cdf0a18bf58a74688** (from main a065dfc; no PR yet): `public/atlas/earth-base.png` is now 4096x2048, rasterised from Natural Earth 1:10m land (public domain) with the same coast-distance ramp as the old mask (fitted: value = 0.5 + signed distance / ~8.1 degrees), so the shader and solar bake keep their look. Phones/low-memory devices (`SMALL||LOWMEM||MAXTEX<4096`) load `earth-base-2048.png` (328 KB); desktop file is 914 KB. Solar bake now downsamples the mask to 2048 wide (8 MB Float32). Generator: `scripts/make-earth-mask.py` (re-runs byte-for-byte to within 1/255). Test: `tests/earth-mask.test.ts`.
- Threshold comparison of the mask itself (Red Sea / Persian Gulf, old 1024 left vs new 4096 right): `shots/ta01-mask-old-vs-new-threshold.png` — coastlines are clean and more accurate.
- Checks: main+fix `pnpm check` 85/85, check:dist 112 OK; PR38 caf70a8+fix `pnpm check` 105/105, check:dist 113 OK, `test:pages` 12x2 pass; PR39 d4185ed+fix `pnpm check` 123/123, check:dist 119 OK.
- **Finding:** the finished 4K bake capture of PR38+fix (`tech-bake-capture.mjs`, shrink mode, 441 s, 0 console errors, 0 third-party requests) looks the same as the caf70a8 capture: coasts still in ~25-30 screen-px blocks (≈0.7 degrees at this framing), and Italy/Greece are missing at both mask resolutions. 0.7 degrees matches the **512-wide preview bake** (`bakeNow(g,w.id,512)`), not the old (0.35 degrees) or new (0.09 degrees) mask. Crop: `shots/ta01-46d2548-3840x2160-baked-crop1to1.jpg`.
- **TA-02 (High, engine, hypothesis):** after the HD bake reports 100 %, the visible planet is still using the 512 preview set — either `applySet` is skipped (`PL!==P` after the capture's viewport shrink/restore triggers a rebuild) or the HD set is replaced again. Next: instrument applySet / the `#bake` callback in a probe (engine state is closure-scoped, so add a debug hook or expose a read-only `window.__atlasDebug`), confirm on an unshrunk run with `window.__HD=2048`, fix, then recapture four sizes. TA-01 mask fix stays (it is needed for 4K once the HD set shows) and goes to PR38/PR39 together with the TA-02 fix.

**Technical: still not approved at caf70a8.** Claude keeps final-audit ownership.


### TA-02 probe / TA-03 fix (2026-11-06T12:45Z, Claude)

- **TA-02 hypothesis not confirmed (unshrunk).** Probe on PR38 caf70a8 + TA-01 with a temporary read-only debug hook (not committed): at 1440x900, `__HD=1024` and `__HD=2048`, the bake finishes and the planet material's albedo target becomes the HD size (`alb` 512 → 2048, 0 jobs left, 0 console errors). Coasts are smooth, no ~0.7-degree stairs: `shots/ta02-probe-hd2048-1440x900.jpg`. So the blocks seen in the 4K capture are specific to the default 4096 bake and/or the capture's shrink/restore viewport step, not a general "preview set stays" bug. Still open: reproduce with HD 4096 unshrunk (SwiftShader takes >10 min; run it in the background with a longer budget) and, if needed, the shrink path.
- **TA-03 (High, engine) found and fixed.** Italy, Greece and most islands were missing at every HD size because the terrain noise term `(h-.5)*.12` can move the mask coastline by up to ~1.6 degrees (mask ramp is `(b-.5)*.3` over ~8.1 degrees). Fix: the noise is scaled by `clamp(|bt|/.075,0,1)` where `bt=(b-.5)*.3`, so it can never flip the mask's land/sea sign and fades to zero at the coast; inland relief unchanged. Pushed to `engine/ta-01-land-mask` at **61ff8ad9a2c1d7f7043ae0b58fe262bb8bf35701**. After: `shots/ta03-61ff8ad-hd2048-1440x900.jpg` (Italy, Sicily, Greece, Aegean, Crete, Cyprus, Black Sea coasts now correct). One-line shader change; `pnpm check` / `test:pages` not yet re-run on 61ff8ad (next run).

**Technical: still not approved at caf70a8.** Next: `pnpm check` + `test:pages` on PR38+61ff8ad, HD-4096 unshrunk background capture to settle TA-02, then cherry-pick TA-01+TA-03 to PR #38 and #39 and re-capture four sizes.

### TA-02 narrowed to the 4096 bake (2026-11-06T13:35Z, Claude)

- **Checks on PR38 caf70a8 + TA-01 + TA-03** (local branch, cherry-picks of 46d2548 and 61ff8ad, tip f5685ef; not pushed to PR #38): `pnpm check` pass (format, build, 105/105 unit tests, check:dist 113 files, no third-party loads); `pnpm test:pages` 12 pages x 2 viewports pass.
- **TA-02 confirmed as a 4096-bake defect, not a capture artefact.** Unshrunk run at 1440x900 with `window.__HD=4096` (script `tech-bake-capture-hd.mjs`; bake 100 % after 794 s, 0 console errors, 0 third-party requests): coasts are blocky at about 1 degree per step and Italy/Greece/the Aegean are missing again (`shots/ta02-4096-1440x900-f5685ef.jpg`, crop `-crop.jpg`). The same build at `__HD=2048` (12:45Z probe) is smooth with TA-03 peninsulas present. So viewport size and the capture's shrink/restore are ruled out; the defect is in the size-4096 bake path. The 4096 desktop default is what most desktop visitors get, so this stays a blocker.
- **Where to look next (bounded):** `queueBake` at size 4096 (strip size/count and UVs, render-target type or a size-specific fallback), and whether the shown set at 4096 is the HD set or a lower set left in place (`applySet` at line ~895/902). A 3840x2160 unshrunk run did not finish in 30 min on SwiftShader (2 CPUs), so the probe uses 1440x900, which reproduces the defect.
- **Interim option if the 4096 path cannot be fixed quickly:** cap the desktop bake at 2048 (`HD` line ~499), which is visibly smooth with the 4096 mask; record the 4K-crispness trade-off as a Known gap. Not applied yet.

**Technical: still not approved at caf70a8.**
