# Seven-place implementation review — PR37 80b8514

Reviewed 2026-11-07 at exact PR37 branch `atlas/deep-worlds` head **80b8514885516d11bad503cf973603b60d8111a5**, parent **ffc8ba7c6734f38839f3eca974b96c04a1a1c098**. Current PR head was reread and matched. Inputs: [approved source handoff](seven-place-review-2026-11-07.md), [exact ledger](seven-place-ledger-2026-11-07.json), and [Claude's return](fix-return-80b8514.md).

## Independent implementation result

**14/14 narrowed records accepted within the previously sourced scope; 18/18 exact leaf changes verified.** This checks application of the earlier source review, not a new reading of the books or new source-page verification.

- Inspected **4/4 changed pack files** and their actual commit diff: Dune, Foundation, Sun Eater and Cosmere. The commit changes no engine, Society, Expanse or Hyperion file.
- Loaded all six packs from both exact revisions in isolated Node VM contexts. **12/12 local file Git blob hashes** match authenticated GitHub reads.
- Independently asserted every ledger selector/ID, expected-before value, replacement value and optional-property deletion. Compared the entire flattened data of all six packs against the exact expected selector/field set: **18 expected / 18 actual changes; zero unexpected changes**.
- **3/3 scoped retains unchanged; 11/11 source holds unchanged.** All IDs, book gates, parent references, coordinates and effects remain unchanged.
- Independently ran the committed structural comparison: **zero unresolved landmark references** across six packs.
- e9 title and text both narrow to Straff's approach. e70 is only deposition; e102 only Shallan's intention. Their optional landmark properties are removed while the Assembly and Oathgate landmarks remain. e17 says the night of the treaty feast rather than killing during the feast. Foundation's uncollated three-century claim is removed.
- The two commentary-supported reductions remain commentary-supported. Translation-based evidence remains translation-based. No evidence class is upgraded.

Source scope remains **28/167 selected**, including 15 narrative comparisons, 2 commentary/short-quote comparisons and 11 unverified holds; **139/167 unselected**. These historical source-review counts are not added to earlier unique coverage. No whole-place or full-book approval.

## Hold dispositions and one finite omission instruction

Independently reran the dependency inventory against the exact returned packs. Conservatory has only d16 anchored to it; d15/d16 occur as event definitions, not pack-internal ID targets. Residency remains needed by other events. Expanse's drumring anchors b3f/b3i; engineering anchors b3o/b7d. Hyperion has both a Tombs landmark and a separate Sphinx site; the latter anchors b1i2/b2k/b3b, so deleting only the landmark would not remove the same unsupported site claim.

| Hold IDs | Disposition |
|---|---|
| Dune SP02 conservatory, SP03 d15, SP04 d16 | Authorize the proposed omission as a bounded source-quality reduction: remove d15, d16 and the conservatory landmark together. Preserve the residency and every other record. Do not unanchor d16 and retain its unsupported text. |
| Expanse SP09–SP12: drumring, engineering, b3f, b3o | Deferred, not verified or accepted for final canon. Do not break b3i/b7d by deleting their landmarks without a separate scoped disposition. Prior structural deceleration correction stays closed. |
| Hyperion SP13–SP16: sphinx, jade, b1n, b2b | Deferred, not verified or accepted for final canon. Preserve the explicit duplicate-site dependency. The seven-pilgrim beginning does not disprove six later survivors; no false-error verdict is issued. |

These omissions are editorial responses to insufficient inspected evidence, **not claims that the book lacks these events or places**. No new source evidence was supplied for any of the 11 holds. “Retained-unverified” in a review table is not a public qualification and cannot by itself close a final canon gate.

An independent, in-memory hypothetical Dune cut confirmed **9 Arrakeen markers (from 10), 12 Arrakeen events (from 14)**, residency retained and no dangling conservatory event anchor. No repository pack was edited. The omission must still be implemented and checked on Claude's branch. No cut of the other eight holds or their dependent records is authorized by this document.

## Validation limits and required next return

Claude reports 125/125 unit tests, 12×2 page checks and lifecycle probes. These remain **builder-reported** here; this review independently executed the data/ledger/dependency checks above, not the full application suite.

The prior handoff explicitly required affected event-click, tour, direct-link and Back/history checks for e70/e102. Claude reports that its SwiftShader run stalled and produced no result. That is **missing evidence**, neither a passing test nor proof of an application failure. Unchanged gate data alone does not prove navigation remains correct after removing an anchor. Rendered acceptance remains withheld; it must not disappear into a general Known gaps statement.

Claude's next bounded return:
1. Apply only the three Dune omissions above, preserving all 18 accepted leaf changes and three scoped retains.
2. Return exact head/diff and repeat reference/ledger checks. Confirm removed IDs are handled safely in URL restoration, chronology and tours, without stale selection/text/effects.
3. Obtain affected at/below-book checks for e70/e102 and the Dune omission, including open event, tour, direct link, Back and downgrade. Use a browser-capable environment or provide a reproducible failure with exact command and terminal output; do not describe an uncompleted harness as passing.
4. Keep the eight remaining holds and 139 unselected records explicitly outside verified coverage. Do not initiate another open-ended research loop or present the whole pack as canon-approved.

DWR-A/B, DWH-01, CS18/e13 and CB01–04 closures are not reopened by this copy-only delta. Save/Load smoke, geometry, Society review, broader sampling, device/AT, final technical and owner release gates remain open.

**Verdict: bounded 18-leaf implementation accepted; three Dune omissions authorized for Claude; eight other source holds deferred. Rendered navigation and full canon/release approval withheld. Return to fixing/claude.**
