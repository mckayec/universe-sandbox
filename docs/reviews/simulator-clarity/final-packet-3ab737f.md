# Consolidated final technical/evidence packet — items 1–7 at 3ab737f

Claude, 2026-11-10 UTC. PR [47](https://github.com/mckayec/universe-sandbox/pull/47), branch `sim/clarity-physics`, exact candidate head **3ab737fe90991767b3cebf5410dc5a1c3b7a6f84** (unchanged; no source change in this return). Requested by [implementation-review-3ab737f.md](implementation-review-3ab737f.md). Not merged. Not release approval; release stays Mckay's gate.

## 1. SC7-E1 — closed with enforced evidence (no source change)

New enforced harness [evidence-harness-7c.mjs](evidence-harness-7c.mjs) (exits 1 on any failed check), raw log [evidence-7c-3ab737f.jsonl](evidence-7c-3ab737f.jsonl): **58/58 checks pass, exit 0**, at 844×390 (the requested short landscape), 667×375 (added: smallest common phone landscape), 390×844 and 1440×900. Production build via `vite preview`, headless Chromium + SwiftShader, builder-run.

Per viewport, no `selectOption` and no clicks on the control:

- Black hole placed via the UI; on compact layouts the sheet is expanded by **keyboard** (focus `#info-expand`, Enter; `aria-expanded` asserted).
- The picker is **reached with Tab only** from the inspector's first focusable element (bounded to 60 presses; path recorded).
- **Focus semantics** asserted: `document.activeElement` is `#bh-reference`; it matches `:focus-visible`; computed outline `solid 2px` (the `#9fc3ff` ring); native tab order (`tabIndex 0`), not disabled; its accessible label (`select.labels`) is exactly "Read as". Option list recorded (the "Merged remnant" option is hidden and disabled, so arrow keys skip it).
- **Vertical and horizontal reachability**: after focus alone, the select's rectangle is fully inside the viewport *and* every clipping/scrolling ancestor, and `elementFromPoint` at its centre is the select (unobstructed).
- **Keyboard operation**: ArrowDown on the closed select walks `none → … → large-stellar`; the readout then reads "≈ 30 M☉ · Stellar-mass · horizon radius 89 km (not drawn to scale)"; the body record has origin `large-stellar` and factor × mass = 30; mass, radius and position unchanged; one undo step per value change; focus stays on the picker.
- **Readout visibility** after the change: fully visible and unobstructed, with at most a nearest-edge panel scroll (what a swipe/wheel does). Whether it was already visible without scrolling is logged as an observation.
- 0 page/console errors.

Observation result: readout visible without any scrolling at 844×390, 390×844 and 1440×900. At 667×375 the focused picker is fully visible but the readout sits just below the panel's visible window (the panel's scroll window there is ~62 px tall) and needs a short scroll; after it, both are visible together. See SC7-O1 below.

Screenshots, viewed (4/4): [844×390](shots/sc7c-844x390.png) (focus ring on picker, readout and "Last event" visible), [667×375](shots/sc7c-667x375.png), [390×844](shots/sc7c-390x844.png), [1440×900](shots/sc7c-1440x900.png).

Harness note: in this sandbox `vite preview` spawned with `stdio: 'ignore'` on port 4190 never answered; the harness uses piped, drained stdio on port 4194. No effect on the app.

### SC7-O1 (new, Low, layout — observation for ChatGPT disposition)

At 667×375 the compact stack gives the expanded inspector only ~62 px of visible scroll height, and the top edge of the inspector card overlaps the bottom of the dock row (Resume / Clear all / Show tools) by a few pixels ([shot](shots/sc7c-667x375.png)). Controls stay reachable by keyboard and scroll; nothing is lost. This is the SC6-O1 shared height budget at a size it was not tested at (it was checked at 720×450 and 320×568); not introduced by 7b. Proposed disposition: carry as a Low known gap for the release decision, or a bounded follow-up (give the dock row its own reserved strip below 400 px height). It does not block SC7-E1.

## 2. Exact-head state at 3ab737f

| Check | Result | Attribution |
| --- | --- | --- |
| CI [42831060743](https://github.com/mckayec/universe-sandbox/actions/runs/42831060743) (merge 2676af2, 243/243 non-doc files identical to head) | format/build pass, **224/224** units, **113/113** dist, **24/24** page/viewport | Independently read by ChatGPT (implementation-review-3ab737f.md) |
| Item 7b rendered | 73/73 | Builder ([log](evidence-7b-3ab737f.jsonl)) |
| SC7-E1 rendered | 58/58 | Builder, this packet |
| `pnpm test:browser` (Save→Clear→Load smoke), 3 consecutive unedited runs at this head | **2/3 pass** (78 s fail, 89 s pass, 88 s pass); run 1 failed at the known `browser-smoke.mjs:88` Load-count wait (30 s timeout) | Builder, this packet |

Earlier item harnesses ran at earlier PR47 heads; files they exercise that changed afterwards are listed per item below.

## 3. Items 1–7: acceptance state at the candidate head

| Item | Accepted scope (review, head) | Its files changed after that acceptance (from `compare` to 3ab737f) | Remaining limits |
| --- | --- | --- | --- |
| 1 Ignition cage | Source scope ([0039fe0](implementation-review-0039fe0.md); retained at [d9d5026](implementation-review-d9d5026.md)) | No: `src/visuals/effects.ts` unchanged since d9d5026 | SC1-E1: ignition-vs-supernova visual distinction only seen on SwiftShader |
| 2 Disk shader correctness | Source scope (same) | `disk-flow.ts` changed in item 4 and `materials.ts` in items 4–5; both inside later reviewed units (920f76e, 3c2e69d) | GPU compilation verified on SwiftShader only |
| 3 Timing / masks | Source + executable timing tests ([d9d5026](implementation-review-d9d5026.md)) | `loop.ts`, `exhibit-runtime.ts`, `scene/quality.ts` changed in item 6 (reviewed at b7fc3f1/8de9128/fb6afbb); timing tests still pass in the 224/224 run | Background/foreground covered by synthetic `visibilitychange`, not a real OS background |
| 4 Disk readability / binary response | Source/controller/helper ([6c7d08e](implementation-review-6c7d08e.md), [920f76e](implementation-review-920f76e.md)); SC4-T1 closed ([ff480a5](implementation-review-ff480a5.md)) | `collisions.ts`, `tidal-disruption.ts`, `body-math.ts` changed in items 6–7 (reviewed); disk-encounter files unchanged since 920f76e | SC4-E1: flyby/unbound case not rendered; matched paused/1×/high-speed clips not produced |
| 5 Star-relative lighting | SC5-T1 closed at source + matrix behavior ([3c2e69d](implementation-review-3c2e69d.md)) | No: `planet-lighting.ts`, `key-light*.ts`, `materials.ts` unchanged since 3c2e69d | SwiftShader only |
| 6a Labels/Details/quiet feedback | Accepted ([8de9128-e2](implementation-review-8de9128-e2.md)) | Compact layout changed by 6b/SC6-O1 (reviewed at fb6afbb/a50f1aa/20837c0) | — |
| 6b Kids mode + SC6-O1 | Accepted, bounded interaction scope ([20837c0](implementation-review-20837c0.md)) | `kids-mode.ts`, `ui/kids.ts` changed in 7a/7b (reviewed at 07464c3/660cfaf/3ab737f) | SC7-O1 (667×375) above |
| 7a Catalog + model-unit labels | SC7-C1/C2 closed ([660cfaf](implementation-review-660cfaf.md)) | 7b added the picker row | — |
| 7b Reference scale + unit mapping | Source/behavior scope ([3ab737f](implementation-review-3ab737f.md)) | No | SC7-E1 closed here |

## 4. Explicit dispositions of inherited gates

| Gate | Disposition | Proposed status for release decision |
| --- | --- | --- |
| **SC1-E1 / SC4-E1** (independent rendered acceptance, real GPU, physical iPhone/Safari, matched paused/1×/high-speed motion, flyby/unbound, ignition vs supernova distinction, genuine background/foreground) | Builder-run enforced harnesses exist for placement, 10× selection, isolated/paired/close/wide pairs, merger survivor, protostar and unequal transfer (4b 33/33, 4b-2 45/45), lighting (6/6 scenarios), timing (synthetic hide/show). **Not producible in this sandbox:** real GPU, physical devices, real OS backgrounding. **Producible but not done:** matched motion clips and a rendered flyby case; both are evidence, not code. Reviewer Chromium cannot launch in ChatGPT's environment, so independent rendered acceptance is not currently achievable by either AI. | Carry as **named release limitations** for Mckay: SwiftShader-only rendering, no device/GPU pass, flyby/motion clips not produced. Optional bounded follow-up (Claude): a rendered flyby + paused/1×/10× clip harness, if ChatGPT or Mckay requires it before release. |
| **Save→Clear→Load smoke** (`tests/browser-smoke.mjs:88`) | Pre-existing on main (fails identically on unmodified main; see slice-1 receipt and mobile-entry D06 notes). Not caused by PR47. At this head: 2/3 consecutive runs pass, the failure is again line 88, so the race is intermittent here, not fixed. Repair is planned as a separate tests-only branch per [save-load-smoke-fix-plan.md](save-load-smoke-fix-plan.md) (not yet built). Item 7b's Save→change→Load passes; this does not close the gate. | Separate item, **not a PR47 blocker**; proposed to be tracked as its own review unit so it does not hold PR47, PR44 and others. |
| **Legacy Earth-mass labels** on non-hole bodies (inspector and event-feed strings in stellar-evolution.ts, collisions.ts) | Unchanged, disclosed since 7a. Black holes show honest model units + optional reference; other bodies keep M⊕-styled labels. The scene does not claim calibrated SI units. | Low **known gap**, follow-up item (convert to model units or a documented reference per body kind). Not a correctness defect. |
| **Device / GPU / accessibility** | Done (builder): keyboard reachability and focus semantics for the new picker (this packet), accessible names and `aria-pressed`/`aria-expanded` on Kids and compact controls (6a–6e harnesses), short landscape at 844×390 and 667×375. **Not done:** screen reader, 200% text zoom on PR47 surfaces, physical iPhone/iPad Safari, real GPU, real audio. | Carry as **named release limitations**; Mckay may spot-check on a phone before or after release. |

## 5. Handoff

ChatGPT: implementation-review of this packet at unchanged 3ab737f — SC7-E1 closure, SC7-O1 disposition, and whether the §4 dispositions are acceptable to move the whole handoff to final technical sign-off and then Mckay's release decision. If you require the optional flyby/motion-clip evidence or an SC7-O1 fix before sign-off, return it as one bounded unit.
