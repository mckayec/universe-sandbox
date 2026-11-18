# Independent checkpoint 9 review

Reviewed exact PR45 head **908bab4aba3fe09da740395f8a9da332e316927e**, parent `35ca9a2439299b7e99069de07f5e563a3416de90`, on 2026-11-03. Religious Traditions only; Claude remains implementation owner. No PR33 changes, approval, merge or deployment.

**TL-R08 and TL-R09 are resolved within the bounded prototype contract.** No new patch-specific finding in this review. This closes the two presentation defects, not the remaining source, adapter, chronology or release gates.

## Findings verified

- **TL-R08:** record details now call the same full citation renderer as the relationship list. Daoism details show X08's inspected chapter-proof and DOI alternatives plus the scope distinguishing inspected printed pp34–36/44–46 from full-chapter/manuscript certification. Independent probes at 390, 1440 and 3840 pixels confirm proof/scope in both views; the details proof anchor accepts keyboard focus inside the dialog. The phone screenshot shows the actual citation and scope after focus scrolls it into view. Existing textual-contact/non-descent caveats remain intact.
- **TL-R09:** the Overview intro now visibly explains that left-gutter brackets join related traditions and are undated. At 390×844 the header note remains hidden, but the new explanation is visible in the Overview pane without requiring hover. Actual rendered screenshot inspected. Desktop/4K retain the explanation as well.
- The only implementation delta is five changed lines in `timeline-view.js`: the intro sentence and the citation-renderer argument/comment. Source data, relationship mappings, chronology model, gating, CSS and repository instructions are unchanged. No redundant external-source research was performed. Prior bounded source inspection and access limitations still apply.

## Independent validation and limits

Evidence: [independent-908bab4](independent-908bab4/). Fresh production build of the exact detached SHA, independent of builder screenshots/results.

- npm package-script equivalents of formatting, TypeScript/Vite build, **126 tests**, **121 distribution-file checks** pass; direct formatting of the changed timeline module passes.
- Prior reviewer-owned regression probe: **59/59**. Covers actual phone filter taps, collapsed-list completeness, preserved notes/identity guards, focus after clear/deselect/gate refresh, lane order/default URL restoration, Back/Forward and codex navigation. Zero observed console/page/request/HTTP errors.
- Updated reviewer-owned gutter/source probe at **390×844, 1440×900, 3840×2160**, reduced motion: nine brackets initially, six when Judaism is collapsed, nine after expansion; all stay inside the non-temporal gutter through zoom/reset/reorder. No page overflow. Full X08 proof/scope present in list and details, details proof anchor focused, keyboard navigation stays within the dialog, Escape closes. Zero observed console/page errors. Actual phone overview/details and desktop/4K screenshots inspected. These probes use Chromium/SwiftShader and emulated touch, not physical-device or assistive-technology acceptance.
- Exact-head CI [41624744977](https://github.com/mckayec/universe-sandbox/actions/runs/41624744977) independently read back: build, unit tests, distribution checks and standalone-page browser step succeeded; deploy skipped. The workflow does **not** run `pnpm test:browser`.

**Full browser-smoke evidence remains unresolved.** The builder reports `tests/browser-smoke.mjs:88` Save/Load timeout on both this head and the unchanged parent in its container. This reviewer did not independently reproduce or clear that full-suite timeout. Parent reproduction makes it inappropriate to attribute the failure to this five-line patch without further evidence; it also does not prove an environment-only cause. CI's success is not a replacement because that smoke suite is absent from the workflow. The checkpoint's phrase “CI … is the reference” must not be read as full-smoke acceptance. Continue investigation with the intended Playwright/browser version and retain the timeout until a reproducible result explains or clears it.

Reproduce targeted evidence: build this SHA and preview on port4199; run `gutter-probe.mjs`; run `regression/probe.mjs` with `BASE=http://127.0.0.1:4199/atlas/?pack=abrahamic-world-religions`. Scripts use `/usr/bin/chromium` and installed Playwright. Stored JSON includes each viewport/stage, full source details and focus evidence.

## Handoff

TL-R01–TL-R09 are closed only within their previously documented bounded contracts. Claude may continue the existing implementation work without another proposal-review wait. Preserve **Standard Works adapter, chapter enforcement, all 169 empty record-level explicit citation arrays, genealogy, succession, ordered dated travel, Apocrypha composition chronology, world calendars, drag reorder, physical hardware/browser/assistive-technology acceptance and all release gates**. Keep CH13's prior retrieval failure, X08's partial independent inspection and the full-browser-smoke timeout explicit. PR33 remains with its separate reviewer.

Publish review files and timeline-only handoff under existing authorization. PR46 title/body metadata is intentionally left at checkpoint7 after the prior automatic-review denial; no retry and no approval request is needed for that stale metadata. Current review files and handoff are the review record.
