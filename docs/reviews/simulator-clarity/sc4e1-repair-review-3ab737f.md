# SC4-E1 repair review — 3ab737f

ChatGPT, 2026-11-10 UTC. PR [47](https://github.com/mckayec/universe-sandbox/pull/47), branch `sim/clarity-physics`, exact audited head **3ab737fe90991767b3cebf5410dc5a1c3b7a6f84**. Evidence snapshot on main: **9660d4e0f98f1d9788ac7ce59b19ae08053ab535**.

**Close SC4-E1-R1 and R2 at supplied-artifact scope. Accept the producible SC4-E1 motion/flyby evidence subgate, retaining independent-rendering and hardware limitations. Return to Claude for the bounded SC7-O1 dock/200% text follow-up.** This is not whole-handoff technical sign-off or Mckay's release approval.

## Scope and independent checks

Read the [repair](sc4e1-repair-3ab737f.md), [preceding review](sc4e1-review-3ab737f.md), [packet review](packet-review-3ab737f.md), final packet, complete replacement harness and both analysis scripts, alignment JSON, metric JSONs and JSONL log. Fresh PR metadata confirms the unchanged open head: **0 application delta files** since the preceding review. Retrieved the actual 54-file PR diff and re-inspected its disk-flow/update-visuals sections, plus both complete files at the exact head (blobs `ebcf93ce89728dd3fd31ecd80c5ebf77bbe25f5b` and `51616ce0ad0cdedad2f1b82fac0e8a22e5e07ff4`). This return does not re-review all 54 historical code changes.

Independent offline results are saved in [sc4e1-repair-review-evidence-3ab737f.json](sc4e1-repair-review-evidence-3ab737f.json), including input hashes, timestamps, formulas and limits.

- **16/16** downloaded artifact Git blob hashes match GitHub; **7/7** MP4 SHA-256 hashes match the repair manifest.
- Fully decoded **7/7 MP4s, 3,455/3,455 frames**, with successful decoder exits and matching ffprobe timestamp counts. Desktop copies are 800×500; compact is 390×844; all encode at 12 fps. Encoded fps is not application/rendered fps.
- Independently classified every MP4 frame's visible marker. **30/30 transitions** occur in the supplied order, within **0.040 s** of the builder's source-WebM PTS map. This is consistent with 25 fps source → 12 fps viewing-copy quantization. No common recording offset was assumed.
- **0 globally blank frames in labeled MP4 windows** by the stated below-marker variance test. This test cannot exclude every partial occlusion. Viewed **7/7 scenario contact sheets + 2/2 metric crop sheets**, and **6/6 separately extracted MP4 frames** across isolated pause/1×/10× and merger running/paused windows; the earlier grey partial-frame defect is absent in these inspected views.
- Recounted **18/18 successful builder checks**: 14/14 in seven video scenarios and 4/4 in two metric scenarios. The classifier log has one aggregate success containing **4/4** booleans. The video log reports **698 samples** but does not publish those complete sample arrays; do not count this as 698 independently verified state observations. Metric log contains **32 still records** (13 isolated, 19 merger), not 32 supplied lossless images.
- **0 fresh browser/rendered cases and 0 fresh application-test runs.** Independent arithmetic and decoding operate on builder artifacts; they are not an independently executed simulator. Historical exact-head CI/test results retain their prior attribution.

## Findings and dispositions

| Finding | Disposition | Evidence and limits |
| --- | --- | --- |
| SC4-E1-R1, mislabeled video windows | **Closed** | Visible startup/restored-pause/running/post-merger markers and per-transition mapping repair the prior clock assumption. All seven MP4 label sequences agree. Startup contains template/load activity and is no longer represented as restored pause. |
| SC4-E1-R2, capture contamination and moving crop inference | **Closed at supplied-artifact scope** | Recording mode no longer takes screenshots; separate metric mode captures full frames without video. Offline crops follow probe positions. Stationary isolated windows show texture changes and broadly same-sided brightness; merger-survivor pause shows freeze. Moving pair/flyby crops are explicitly viewing evidence, not shear measurements. |
| SC4-E1 required scenario/motion evidence | **Producible motion/flyby subgate accepted** | Seven requested scenario categories have aligned footage; equal coverage overlaps wide/close/flyby/merger. Both flyby views show approach, close passage and recession. The prior 2/2 unbound state-series acceptance stands. Merger high speed mostly shows the survivor; compact coverage is flyby only. Independent rendering, device/GPU coverage and quantitative phase/shear certification are not granted. |

The harness changes controls before updating its marker. Outgoing boundary frames can therefore already show the next state: compact's last yellow tile visibly has Pause/10×. This is disclosed, not a repaired-state failure. Use interior windows for measurement. The offline video analyzer trims 0.5 s; this review trims 0.75 s. **The separate lossless-still script does not apply that trim**: its first isolated stills are only 0.109/0.134/0.123 s after their markers. Do not generalize the repair's trim statement to the lossless pass.

A small reporting correction: the seven published transition-offset ranges have a maximum within-clip spread of **0.301 s**, not 0.36 s. This does not affect alignment acceptance.

## Independent stationary-scene cross-check

RGB luminance is `0.2126R + 0.7152G + 0.0722B`; differences below are mean absolute luminance differences on decoded, compressed MP4 pixels roughly 0.5 s apart. They are **not** replications of source-WebM or lossless-PNG values.

| Interior window | Samples / adjacent comparisons | Difference range |
| --- | ---: | ---: |
| Isolated paused | 10 / 9 | 0–0.1353 |
| Isolated 1× | 8 / 7 | 0.9987–4.8420 |
| Isolated 10× control | 6 / 5 | 3.9882–6.4863 |
| Merger survivor running 10× | 8 / 7 | 9.4652–11.6675 |
| Merger survivor paused | 6 / 5 | 0–0.005573 |

Isolated uses a fixed 220×220 crop centered at (400,250) in the 800×500 copy; no host translation is needed. The same-sided brightness sign remains positive in **24/24** sampled isolated crops. Merger uses a fixed 120×120 crop, x=330..449/y=188..307, covering the stationary survivor. Exact intervals and the asymmetry normalization are in the JSON.

These observations distinguish pause from visible running texture change. They do **not** establish a 4:1 measured phase-rate ratio: the 1× and 10× difference ranges overlap, compression and nonlinear crossfade affect differences, and screenshot timing is not a phase clock. The exact-head source still explicitly caps disk time with `paused ? 0 : dt * Math.min(speed, 4)`; view-space Doppler calculation and differential flow remain in the shader. Physics elapsed time is separate. Tidal shape can settle while paused; the isolated/survivor freeze result must not be generalized to every changing encounter state.

## Unavailable inputs and retained gates

The isolated original WebM fetch returned its blob SHA (`8c60a7d5807f402e804e03617501d11811adb89d`) with **empty base64 content**; it was not decoded. Six other source WebMs are not published. Full-resolution lossless PNGs and the original complete probe arrays are also absent from the packet. Their exact numerical values, source frame counts and flyby closest-sample numbers remain **builder-reported**, with arithmetic/method inspection only. The independent MP4 checks above supply bounded corroboration; they do not make those missing inputs verified.

SC7-E1 stays closed. **SC7-O1 Low dock clipping, strict Save→Clear→Load five-consecutive-run gate, legacy non-hole unit labels, screen-reader/200% text coverage, SC1-E1/device/GPU/genuine-background and independent-rendering limitations remain open exactly as qualified in the packet review.** No gate is waived because it is pre-existing or not run.

## Bounded handoff

Claude: address **SC7-O1 at 667×375**, reserving adequate dock space and returning enforced pointer/keyboard reachability evidence for every dock control with the inspector expanded, including **200% text**. Retain the existing 844×390/390×844/desktop picker behavior. Return the exact new PR head, actual changed-file receipt, checks/failures and screenshots; do not claim screen-reader coverage from keyboard checks. If the unit remains incomplete, checkpoint its specific remaining controls/conditions.

Update the consolidated packet to reference this review, correct the 0.301 s/metric-trimming wording, and retain all other gates. No need to re-record these seven motion scenarios solely to repair that prose. Separate Save/Load repair still needs its strict five-run evidence and exact-head review; release authority remains Mckay's.

Inspected **18/18 pack statuses and 8/8 review statuses**. Both agreement sign-offs remain present; agreement unchanged. Hierarchy/Narnia/Licanius self-audits target the current research/source blobs (**3/3 current**), so no parallel rewrite or ownership change is needed. No new research opened under the WIP limit. Only the simulator review is handed to Claude; no application/PR-branch edits, merge or deployment.
