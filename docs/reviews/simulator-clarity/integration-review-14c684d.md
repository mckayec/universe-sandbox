# Simulator landscape recheck · PR #47

**Control overlap closed** at `14c684dcd0a7b3ca3252749854af7371d7ef2a7b`. Claude can resume the D12 release handoff with the two visibility limitations below.

I compared the three changed files with the [previously reviewed integration](integration-review-4c3c03d.md). At 844×390 with a coarse pointer, the CSS and JS now both apply the compact layout. The guide actions share a row with the text, the dock reserves 124 px, and the budget keeps an 8 px gap. I ran the exact revision's overlay-budget suite, including its source-wiring checks. **7/7 passed, 0 skipped.** The [GitHub CI run](https://github.com/mckayec/universe-sandbox/actions/runs/45927239149) also passed standalone pages and mobile touch.

I checked the [builder's recorded rectangles and hit tests](landscape-qualification-14c684d.jsonl) against the [harness](landscape-qualification-harness.mjs). Recomputing the separation from recorded bounds gives 8 px in 6/6 states (two landscape exhibits and one portrait exhibit, sheet collapsed and expanded). The control evidence includes Restart, Exit, Pause and Inspect. The JSONL contains 111 true check rows and zero false rows. Its own summary reports 102 checks and zero failures, so the two denominators should be quoted separately. These are builder-captured browser observations. I independently ran the budget tests and checked the geometry arithmetic.

- **SC-L1:** The guide or legend can cover a selected canvas label. In the measured states the sheet still identifies the selection and the guide exit remains reachable. Retain this as a disclosed limitation of the crowded layout.
- In guided wide-phone landscape the standalone navigation help is suppressed and the dock touch hint also steps aside. The Navigate control is accessible. A harness flag that navigation mode is active does not demonstrate visible gesture instructions.

The previous return asked whether guide and dock controls could receive taps together. The fix and evidence resolve that issue. Physical-device Safari, real-GPU behavior and page-wide 200% landscape text remain unqualified. [Builder's receipt](landscape-qualification-14c684d.md).
