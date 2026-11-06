# Independent checkpoint 6 review — 24655eb

ChatGPT, 2026-11-03. Exact PR45 head **24655ebda5b1c6b98803f4283fbd1e7b5a063069**, parent **312d2dde5f3824e16a1317c5293ac1b61f3bd287**. Compared actual code and checkpoint-6.md with the [checkpoint 5 re-review](independent-review-312d2dd.md) and [original findings](independent-review-708f26c.md).

**TL-R03's remaining focus regression is resolved at this exact head.** The original six findings are now closed within their previously documented bounded-prototype scope. This is not PR approval, release acceptance, a full historical-source audit, or physical-device acceptance. Claude retains implementation ownership and may continue the remaining research and adapter work immediately. PR33 and its release gates remain unchanged.

## Independent verification

The only implementation change from 312d2dd is the Tab handler in `public/atlas/timeline-view.js` (13 added lines, 2 changed lines). It now handles focus on a programmatic target outside its ordinary tabbable list, selects the next/previous modal control by document order, and wraps inside the dialog. Model, pack data, source handling, gates and URL contract did not change.

- Reran the reviewer's previous browser probe against the new build: **59/59 checks passed**, including all three previously failing downgrade-Tab cases at 390×844, 1440×900 and 3840×2160. No console, page, failed-request or HTTP errors recorded. This independently repeats the earlier source-text/codex navigation, complete collapsed list, phone filter, event gate and open-to-open Back/Forward checks; it does not rely on Claude's passing rerun.
- Added an independent focused probe: from both Overview and the scroll pane, after gate refresh, viewport resize and lane collapse, ran **60 Tab and 60 Shift+Tab presses per target/phase/viewport**. **36 sequences / 2,160 keypresses / zero modal escapes**. Starting sizes were 390×900, 1440×900 and 3840×2160; resized cases used 380×890, 1430×890 and 3830×2100. Escape closed the dialog at all three sizes.
- Checked ordinary SVG mark traversal against independently built parent and target previews: Tab moves Second Temple → Ananites, Shift+Tab moves Ananites → Second Temple, and ArrowDown moves Second Temple → Ananites at both heads. The fallback fix does not disrupt these sampled mark-to-mark interactions.
- `npm run format:check`, `npm run build`, `npm test`, `npm run check:dist`: **123 tests / 120 distribution files passed**. Direct Prettier check of the changed timeline view, bypassing the public-file ignore, passed. Node 24.19.0 and installed dependencies; this does not claim the earlier pnpm initialization problem was repaired.
- Exact-head [CI run 41564024290](https://github.com/mckayec/universe-sandbox/actions/runs/41564024290) independently read as completed/success. No workflow or deployment was manually triggered by this review.

## Evidence and reproduction

[Regression probe](independent-24655eb/probe.mjs), [59-check results](independent-24655eb/results.json), [regression log](independent-24655eb/regression-output.txt), [focused probe](independent-24655eb/focus-probe.mjs), [focus/traversal results](independent-24655eb/focus-results.json), and build/test logs in the same directory.

Build the exact target head and serve its distribution with `node node_modules/vite/bin/vite.js preview --host 127.0.0.1 --port 4196 --strictPort`. Copy the docs-only probe folder into that checkout. Run:

```sh
BASE='http://127.0.0.1:4196/atlas/?pack=abrahamic-world-religions' node docs/reviews/synchronoptic-timelines/independent-24655eb/probe.mjs
node docs/reviews/synchronoptic-timelines/independent-24655eb/focus-probe.mjs
```

The focused probe's final parent comparison additionally requires the independently built 312d2dd preview on port 4195. It saves observations rather than treating process exit as product acceptance. The regression probe is the same reviewer-owned script from checkpoint 5; its default port still points to the parent, so the `BASE` override above is required for the target run.

Inspected the actual [390 chart](independent-24655eb/390-chart.jpg) and [4K chart](independent-24655eb/3840-chart.jpg); further chart and source-detail captures are included. Measurements report no page sideways overflow. Headless Chromium 154 / Playwright 1.62.1 / SwiftShader and reduced-motion emulation are not physical iPhone/iPad, Safari/VoiceOver, sustained-memory or GPU-performance acceptance. No new historical sources were researched in this focused regression review.

## Remaining work for Claude

1. Continue claim-specific source-locator research: **129 relationships remain unsourced, with zero drawn connectors**. Preserve explicit missing-evidence labels; do not substitute internal references or generic node sources for relationship evidence. Accessible connector details still need implementation once supported data exists.
2. Continue the isolated Standard Works adapter and chapter-aware host gates. Carrying `chapter` is not enforcement. Preserve separate narrative/composition/institutional chronology and work-selection boundaries; do not modify PR33's accepted content or release gates.
3. Keep family genealogy, succession, unsupported travel legs, Apocrypha composition dates and other/world-calendar adapters explicit gaps. The current slice remains Religious Traditions only, not the full cross-atlas user request.
4. Drag reorder remains deferred (keyboard buttons exist). Arrange physical-device and assistive-technology acceptance before release. The URL contract remains `tl`/`tlc`/`tlsel`; time-range/zoom persistence is not implemented.

No new implementation blocker found in this targeted pass. A next exact-head review should focus on the source-locator/adapter changes when available, rather than requesting another proposal review. No implementation files changed by this audit; no PR approval, merge or deployment.
