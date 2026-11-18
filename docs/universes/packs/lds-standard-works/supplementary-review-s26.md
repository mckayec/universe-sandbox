# LDS checkpoint 26 — cross-account remediation and settled-frame evidence

Reviewed **ed7a49bbe7bb1620b49eaa6c33799f5352663c4e**, PR33, code **22f6ca415454b2a2f9d31980eede33663d64295b**, against audited S25 **1e8753001d674992603dee6153175c54204f60e9**, on 2026-11-02. Claude retains implementation ownership. Bounded delta review only: unchanged source evidence and prior import dispositions are inherited, not re-read or newly certified.

## Verdict

**S25-C1 closes for its specified minimum correction.** Eden (`OH-P01` ↔ `PP02`), Nod (`OH-P02` ↔ `PP03`) and Enoch's city (`P17-dc-enoch-city` ↔ `P17-pgp-enoch-city`) now have reciprocal “in another account” links. The former bundled exclusion is split into individual reasons. The two P17 source views gain distinct stable keys, retaining separate 4/dc and 5/pgp gates and identical original texts; no extra city is created. Eden and Nod preserve 1/ot versus 5/pgp source views. Cain's Enoch is not linked as the Zion city; no coordinate, date, route or recovered landscape is invented.

**DD121-only → RC02 remains correct and unchanged.** S25's primary-source answer carries forward. No new mandatory copy correction was found in the six changed cards. The builder's PGM-qg06-zion question is resolved below for the next integration delta. **S25-V1 remains partially open**: the supplied settled frame improves the evidence, but does not establish real-GPU/finished-render acceptance.

| Bounded accounting | Verified result |
| --- | --- |
| Cards | 1,523 total; six gain links, two of those also gain keys; 1,517 unchanged; zero added |
| Source content | All descriptions, source fields, dates, work/layer gates and other pack data unchanged |
| Links | 126 linked cards; 247 directed entries, 139 labelled, three event targets; prior 241 entries preserved |
| Contract CSV | 54 rows; three added groups and four replacement disposition rows reviewed; the prior bundled row removed |
| Imports | 1,271 SD imported / zero pending; 1,365-row mapping and 12-person CSV byte-identical to S25 |
| Engine | `engine.js`, `engine.css`, `layers.js`, registry and Church display naming unchanged |
| Broader integration | No new BMC quotation/vision edges, DRE succession links, timeline/source-vision implementation or final omission/consolidation rollup in this delta |

[Delta dispositions](supplementary-review-s26/delta-dispositions.csv), [probe result](supplementary-review-s26/probe-result.json), [accounting result](supplementary-review-s26/accounting-result.json). Galilee region/lake and Daniel's Hiddekel/garden-river distinctions remain appropriately separate; this accepts their stated bounded non-link reasons, not a claim that all future conceptual references are integrated.

## Builder answer — PGM-qg06-zion

**Yes: connect this card as a source discussion of P17, while preserving its wider promise context.** The existing card expressly discusses the community and city of Moses 7:18–21 and separately the future expectation in 62–69. The prior warning against linking every Zion usage does not exclude this specifically identified account.

Minimal implementation: add `PGM-qg06-zion` (5/pgp) → `P17-pgp-enoch-city` (5/pgp), labelled **“describes Enoch’s community and city”**; inverse label **“Moses 7 teaching and promise”**. Preserve the existing cross-account P17 link to the 4/dc view. This connects the third source view without treating an explanatory card as an additional city or asserting that its entire future-gathering passage is an alias for the ancient city. A direct additional D&C comparison link is not necessary for this minimum implementation. Keep the description, locators and 5/pgp gate; update the explicit non-link row that currently excludes PGM-qg06-zion.

Primary basis: [Moses 7:18–21, 62–69](https://www.churchofjesuschrist.org/study/scriptures/pgp/moses/7?lang=eng), reopened and inspected on 2026-11-02. Verses 18–21 name the people/community and the city, then describe its being taken up. Verses 62–63 describe a future holy city/gathering and a meeting involving Enoch's city; that future setting must not be collapsed into one recovered ancient location. This is textual attribution, not historical corroboration. No new source-access blocker, full-canon rereading or raw-capture certification is claimed.

Acceptance: both targets resolve, relationship labels preserve the community/city versus promise distinction, both new edges remain 5/pgp, PGP-only links work, D&C-only never reveals the PGP card, and unknown geographic/date values remain absent. Do not connect Cain's Enoch, every DCM-dx01 Zion usage or a modern New Jerusalem pin through a bare-name match.

## Independent permitted checks

- **48/48** LDS-pack/layer unit tests pass at the exact head ([log](supplementary-review-s26/unit-results.txt)).
- [Pinned probe](supplementary-review-s26/probe.cjs) compares the six modified records and all preserved data, checks unique keys and all 247 targets, and runs **71,136** pure-function reachability cases over work, layer and year filters. All pass. It executes the unchanged pure See-also functions in a VM; no DOM/browser/server execution. S25's generic-engine inspection and its limits carry forward.
- [Accounting script](supplementary-review-s26/accounting.py) runs the generator twice in an isolated temporary copy: pack, SD mapping, identity CSV and typed-link CSV reproduce byte-for-byte. Accepted register remains pinned at `9cc874c09a3686119ca6b4c17c7e16f214fd7ab6`; unchanged imports were not re-researched.
- Three research validators pass here: coverage `errors: []`, reference `missing []`, witness integrity no errors. Witness checks attest available capture bytes only, not reading completeness or historical truth.

Implementation [CI 41392635992](https://github.com/mckayec/universe-sandbox/actions/runs/41392635992) is associated with the exact reviewed head. Terminal implementation/review results are recorded in the main handoff after publication. CI runs **`test:pages`**, not **`test:browser`**. No new S26 raw browser-smoke result is supplied; S24's earlier local smoke pass remains builder-reported at its older head. The new targeted probe is distinct from that smoke suite.

## S25-V1 and supplied interaction evidence

All four new committed screenshots inspected as pixels:

- `s26-event-turning-1440x900.jpg` repeats the visible mismatch: Old World labels over a globe showing North America.
- `s26-event-settled-1440x900.jpg` now shows North American labels, including Salt Lake Temple, Nauvoo, Palmyra and highlighted Kirtland Temple, over the corresponding region. This closes the request for a later-frame comparison in the supplied SwiftShader run. **“Charting surface” is still visible**, however. The code waits a fixed 45 seconds, rather than asserting bake/turn completion. The image is evidence of recovered label placement in that captured state, not proof that the renderer finished or that no lag occurs on real hardware.
- `s26-eden-link-1440x900.png` shows the Garden in Eden card focused with its cross-account label and link, without a modern-location claim.
- `s26-nod-390x844.png` shows the Land of Nod card and its labelled link fitting within the phone modal; it does not demonstrate physical-phone input.

The builder receipt reports four interaction checks plus the frame comparison under SwiftShader. `s26-probe.mjs` was inspected, not executed here: programmatic focus precedes Enter, phone section selection uses `selectOption()`, and the console collector excludes `Failed to load resource` messages. Thus it reports activation/focus, filtered-link and tap evidence, not full Tab/Shift-Tab traversal, physical native-select use, real GPU, or an unfiltered clean resource log. The new event-focus race case remains explicitly untested; no engine change in this delta resolves it.

**Remaining S25-V1 acceptance:** capture after an observable completed turn/surface state (not elapsed time alone), check label-anchor alignment while moving and settled on a real GPU, and record whether the transient mismatch persists. If real hardware reproduces incorrect placement, fix it before sign-off. Preserve the current screenshot evidence rather than describing the issue as fully resolved.

## Exact next release-critical work

Claude: add the bounded PGM-qg06-zion source-discussion link above; finish the already-open BMC quotation/vision, DRE office-succession, timeline/source-vision and omission/consolidation crosswalk with exact IDs, source roles and supported non-link dispositions. Zero imports does not complete those tasks. Supply final same-head 4K/1280/phone rendering, full keyboard traversal/activation/Escape/focus return, physical-phone native-select/touch and real-GPU evidence, plus the rapid filter/modal-change event-focus case and unfiltered resource results. Record a precise device/access limitation if any required external evidence cannot be obtained; do not present emulation as that evidence.

ChatGPT: recheck returned deltas and integration evidence, inheriting unchanged source checks. Owner: specific-PR approval after final content/technical gates. Separate post-release synchronoptic timelines, Cosmere magic-system views and basemap remain untouched and nonblocking; they are not substitutes for or additions to current release integration. No application edits, ownership/status/lock changes, approval, merge, deployment or release by this audit.
