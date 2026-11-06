# LDS supplementary checkpoint 25 — typed integration delta

Reviewed **1e8753001d674992603dee6153175c54204f60e9**, PR33 (code **abd7f1a97d21180b4dd47fde730cee3a2f3bd061**), against S24 **8ec67f4732b1e253a31f3a5e802a7bd4d183e44a**, on 2026-11-02. Claude remains owner. This is a partial integration audit, not final content/technical approval or release approval.

## Result

The 21 implemented same-entity groups and 17 typed-relation rows conform to the existing [integration contract](https://github.com/mckayec/universe-sandbox/blob/1e8753001d674992603dee6153175c54204f60e9/docs/universes/packs/lds-standard-works/integration-reconciliation.md). All 48 rows of `typed-links.csv` were reviewed: 38 implemented group/relation rows and 10 non-link/open dispositions. **One bundled non-link explanation requires correction (S25-C1 below)**; it must not prematurely close omitted integration. Builder's DD122/DD123 question is answered below. No new unsupported scripture-copy claim was found in the unchanged card content.

The 76 changed cards only gain `see` entries. **1,447 other cards are unchanged; 1,523 total; zero added.** All descriptions, sources, dates, coordinates and work/layer gates are unchanged. S23-C1's Church-position notice and the full Church display naming remain present. The 108 earlier identity links remain unchanged. There are now **120 linked cards / 241 directed entries**, including **133 labelled entries and three event targets**. These are navigational source-view relationships, not 241 new historical claims or new entities.

All **1,271 SD imports remain complete, zero pending**. The 1,365-row mapping and 12-person identity CSV are byte-identical to S24. Imports are not the remaining blocker; broader integration and final technical/rendered evidence are.

## S25-C1 — split the false single-view exclusion

Location: `supplementary-build/copy_links.py`, final `UNLINKED` row, emitted as the final row of `typed-links.csv`. Current explanation bundles `galilee-region, tigris/Hiddekel, eden-textual, nod-textual, P17 Enoch, bom-irreantum` as “one codex card each in the pack (or a pin); nothing to link”. That explanation is false for at least the following three named entities:

| Existing source views | Required disposition / safe link meaning |
| --- | --- |
| `OH-P01` (1/ot, Genesis 2:8–15) and `PP02` (5/pgp, Moses 3; Abraham 5) | Same accepted Eden **concept**, retaining different source landscapes. Link these source views with wording such as `Eden in another account`; never claim identical recovered terrain or lower the PGP gate. |
| `OH-P02` (1/ot, Genesis 4:16–17) and `PP03` (5/pgp, Moses 5) | Source views of the accepted Nod setting. Use `Nod in another account`; the Cain/Enoch material in OH-P02 remains its own context. Never identify Cain's Enoch with the Zion/Enoch of Seth's line. |
| Two existing unkeyed `unmapped-places` cards both titled `Enoch’s city (Zion)`, one 4/dc citing D&C 38:4 in its text, the other 5/pgp citing Moses 7 in its text | These are two source views of accepted P17, not one card. Assign stable, distinct source-view keys under the shared P17 concept, preserve both texts and gates, and connect as `Enoch’s city in another account`. Do not create a second city, a modern location, or a blanket identity with every Zion usage. |

**Exact replacement disposition for the three affected cases:**

> Open shared-source integration: Eden has OH-P01 (1/ot) and PP02 (5/pgp); Nod has OH-P02 (1/ot) and PP03 (5/pgp); P17 has two currently unkeyed Enoch’s city (Zion) views at 4/dc and 5/pgp. Preserve their source-specific descriptions and gates. Add source-view links using the accepted shared concepts; stable distinct keys are needed for the two P17 views. No geographical equivalence or new pin is inferred.

Split the compound CSV row so genuinely single-view cases can retain their own justified dispositions. Existing `OH-P01` explicitly says it shares the atlas's Eden concept without making every source's geography identical. Accepted `integration-reconciliation.md` explicitly lists `eden-textual`, `nod-textual` and P17 with these gate distinctions. This is a concrete correction within the existing integration scope, not new research or a request to merge narratives. The table gives a minimum set, not an assertion that every other thematic mention must become a link. Genesis garden rivers, Daniel's Hiddekel setting, Eden Smith the person and unrelated Enoch narratives must not be flattened together.

Acceptance: regenerate the crosswalk; assert unique source-view keys and target resolution, preserve original copy/gates, test all-layers navigation and single-layer filtered-target behavior, and retain no-location/vision safeguards. If deliberately postponed, keep these rows **open** pending an explicit scope decision; “nothing to link” is not a valid completed disposition.

## Builder question — DD122/DD123 and RC02

**Keep only DD121 → RC02 labelled `explains`. Do not add that label to DD122 or DD123.** This refines the grouped contract row to its actual source support; it does not omit the shared prison-letter context. RC02's existing “Authority and persuasion” summary is specifically sourced to [D&C 121:41–42](https://www.churchofjesuschrist.org/study/scriptures/dc-testament/dc/121?lang=eng). [D&C 122](https://www.churchofjesuschrist.org/study/scriptures/dc-testament/dc/122?lang=eng) addresses adversity and consolation; [D&C 123](https://www.churchofjesuschrist.org/study/scriptures/dc-testament/dc/123?lang=eng) instructs gathering and publishing evidence of losses and persecution. Their headings place the extracts in the approximately March 22 prison epistle. Keep all three existing RE07 links and the separate document dates; no need to make every section “explain” every teaching from the letters.

These three official pages were reopened on 2026-11-02: 121's relevant verses, 122's heading/body and 123's heading/body were inspected. This verifies textual attribution, not independent history. No full-canon pass or fresh source verification for the other unchanged cards is claimed. No raw response captures or retrospective source hashes are fabricated; URLs and inspected locators are the access record for this narrow question.

## Link and regression checks

[contract-dispositions.csv](supplementary-review-s25/contract-dispositions.csv) records all 48 contract rows, their actual endpoint copy/gates/source locators and dispositions. The 21 groups were compared to the pinned accepted canonical/collision rows; the 17 directed relations to their binding resolutions and existing endpoint text. Same-city/region links do not merge Samaria region with city, Jericho plains with city, the Jerusalem contained features with one another, or the three Kirtland occasions. Tarshish remains an unlocated place-name reference; Daniel's Shushan retains vision wording; Song comparisons do not become journeys. The D&C 136 links refer to instructions, not completed travel. This is accepted-research conformity, not new archaeological validation.

Executed at the exact implementation head:

- **47/47** LDS-pack/layer unit tests pass ([log](supplementary-review-s25/unit-results.txt)).
- Independent [pure-function probe](supplementary-review-s25/probe.cjs) verifies unchanged content, retained identity links, unique resolving targets, all 241 entries and **69,408 reachability cases** covering work 0–5, cumulative/single modes, six layer selections and four year ranges. Unknown keys are ignored; cumulative locked targets suppress titles; layer/year-filtered targets are named but unlinked; event single-work filtering matches existing `evFor` semantics. All-layer output resolves every declared link. [Result](supplementary-review-s25/probe-result.json).
- Two isolated generator runs reproduce the pack, SD mapping, identity crosswalk and typed-link CSV byte-for-byte. The accepted register remains pinned at `9cc874c09a3686119ca6b4c17c7e16f214fd7ab6`. [Accounting result](supplementary-review-s25/accounting-result.json).
- Three research validators pass: coverage errors empty, reference missing list empty, witness integrity errors empty in this environment. Capture integrity is not reading or historical certification.

Static engine inspection: `cxGoEvent` checks current event reachability before closing the codex and calling the existing `openEvent`. `cxGo` retains its current-target recheck. Typed labels and target names/attributes are escaped. The new 60 ms event-focus callback does not recheck current selection/filter/modal state; it does not itself reveal content, but final interaction checks should include changing filters or reopening the codex immediately after an event click and verify no stale focus steal. This is a targeted acceptance case, not a demonstrated failure. No DOM/browser/server execution was performed here.

## Supplied rendered/technical evidence and remaining gates

Three of three new committed images inspected as pixels. At 390×844, Damascus's typed links fit within the card, while the native chooser's long label is truncated. At 1440×900, Jerusalem shows readable same-city/epithet/contained-feature labels; the longer relation label wraps above its target. Neither screenshot proves keyboard traversal or physical-phone select behavior.

**S25-V1 — confirmed screenshot anomaly, cause unresolved:** `s25-typed-links-event-1440x900.jpg` shows the Kirtland dedication event open, but Old World labels (including Rome, Patmos and Babylon) drawn over North America, and a “Charting surface” indicator. Claude reports capture during a turn under SwiftShader. Static equality of the old `openEvent` path does not independently prove this is harmless, transient or absent on a real GPU. Supply a settled-frame capture after surface/turn completion, repeat event navigation on a real GPU, and check label-anchor alignment during and after the transition. If persistent, fix it before final rendered sign-off. Do not treat the current image as successful map alignment evidence.

The committed builder `typed-links-probe.mjs` was read, not run here. The receipt reports 4/4 checks in 14 minutes under SwiftShader: Enter activation, event click, NT-only filter, and mobile tap. It programmatically focuses the button and uses `selectOption()` for the chooser; it does not establish full Tab/Shift-Tab traversal or actual native-select interaction on a physical phone. It excludes `Failed to load resource` messages from its console-error collection, so final evidence must report those separately. Its root preview URL is distinct from the CI Pages-subpath suite.

The earlier S24 `test:browser` pass remains **builder-reported at the earlier code head**, not a newly observed S25 smoke pass. The S25 receipt supplies the targeted typed-link probe, not a new raw smoke result. CI [41387161597](https://github.com/mckayec/universe-sandbox/actions/runs/41387161597) verifies `test:pages`, not `test:browser`; terminal implementation/review results are recorded in the main handoff. Do not substitute either test for final real-GPU/device acceptance.

Next Claude actions: correct S25-C1; continue the explicitly open BMC quotation/vision edges, DRE office-succession relations, timeline/source-vision integration and omission/consolidation rollup with exact IDs and dispositions; supply final same-head 4K/1280/phone, keyboard traversal/focus/Escape, native-select/touch and real-GPU evidence, including S25-V1's settled alignment and the new event-focus race case. Keep the 1,271-row import ledger closed unless an actual changed record warrants reopening it. ChatGPT then reviews only returned deltas and integration evidence. Basemap remains follow-on/nonblocking; Church naming remains preserved; specific-PR owner approval follows final gates. No app edits, status transition, approval, merge, deployment or release by this review.
