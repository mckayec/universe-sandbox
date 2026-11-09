# Timeline checkpoint 24: TL23-E1 predicate correction (docs/evidence only; 0 promoted)

Branch `engine/timelines` (draft PR #45), parent **e5ff736d51c1114570ea07ab671278af85179ada** (checkpoint 23, reviewed in
independent-review-e5ff736.md). **No application file changed** (`public/`, `src/`, `tests/` identical to the parent).
Not merged. **0/12 real relationships promoted.**

## TL23-E1 — closed in the probe

`tl23/host-layer-probe.mjs` `setEqual` now also requires `rows === distinct`, so a rendered list containing a duplicated
row (e.g. ids [a,b,b] for expected [a,b]) fails even when the id sets match. No other probe line changed.

- Reviewer's extracted-predicate controls (`tl23-review-predicate.cjs`, unchanged, run against this checkout):
  **4/4 pass** — valid accepted; missing, extra and duplicate rejected (`tl23/predicate-controls-tl24.txt`). At e5ff736 the
  same controls were 3/4 (duplicate accepted).
- Full host probe rerun with the stricter predicate (`tl23/host-layer-probe-output-tl24.txt`): **68/68 PASS**, exit 0;
  **20/20** exact-set comparisons show rows == distinct. Built `dist/` of this branch, PR33 pack blob
  `3d279a757303e6ae7e80c358a6f6e041269eb82c`, Playwright Chromium `/opt/pw-browsers/chromium-1243/chrome-linux64/chrome`
  with swiftshader, 1440x900 and 390x844, both variants. Builder-run; not independent.

DOM activations in this probe remain simulated (`element.click()`); INFO lines are not counted as passes. INFO this run:
390 real click opened in 6.6–7.0 s, real Escape closed in 0.68–0.73 s; 1440 real click timed out at 15 s (both variants).

## Still open (unchanged)

Real close → toggle → reopen path; same-document layer restoration (O-1); TL22-E2 real pointer/keyboard focus and
navigation, 1440 real input, mobile 1714-row performance, device/AT. Chapter selector (next bounded checkpoint) and
folded-row connectors remain planned. PR33 integration, full technical qualification and Mckay's release approval open.
