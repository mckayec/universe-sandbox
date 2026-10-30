# APQ-004 research alignment and remaining handoff

2026-10-30. Documentation-only continuation of review PR42 at `41801469399e0a47f0d6e4016b1dc99352d43fa8`. Implementation PR38 remains **1e256ceb3ac797ab998c6b7af0edb41d31c8da6f**, open/unmerged; fresh main inspected at `bd24cbd`.

## Completed bounded source/content work

Reopened the selected [USCCB NABRE Tobit14](https://bible.usccb.org/bible/tobit/14), specifically14:4 and surrounding advice. Babylon occurs in the comparison favoring Media. That supports a neutral mention at work slot1, not a visit, an event location, route geometry or a precise city-versus-region inference. This confirms the already recorded APQ-004 decision; it is not a new broad reading pass or a chronology/historicity certification.

Aligned the research artifacts:

- `deuterocanonical-integration.csv`: `dc-ref-babylon` first5→1, with the earlier source/passage added; `dc-tob-14-card` now records the mention and its limited role; one new `dc-ref-babylon-mention-tob14` typed mention edge.
- `record-work-index.csv`: shared reference now maps to Tobit/1, plus the new edge at Tobit/1.
- `deuterocanonical-coverage.csv`: chapter14 payload now includes the omitted mention; original body-reading date retained, new bounded alignment date stated in the payload.
- Existing seven Babylon mention edges retain their IDs and work gates **5,5,6,7,8,9,9**. No renumbering, new geographic coordinates or retroactive Baruch disclosure. The dossier already specified Tobit/1 and requires no invented replacement source.

Integration rows984→985; all-registry index1350→1351. This additional edge is an accounting correction, not an extra work or independently established historical fact. Prior count snapshots remain historical and should not be silently read as current counts.

**Research-side CSV alignment is now complete on this review branch. APQ-004 overall remains open until the builder changes the pack and ChatGPT rechecks that new head.** The current implementation still has Babylon badges `[5,6,7,8,9,10,11,22]` and the slot5 comment. Builder acceptance: add slot1 to the existing neutral reference badge, retain later narrative gates, and do not attach Tobit14 to this pin. Verify the unchanged modern-heritage disclaimer and no new route/coordinates. Update tests/fixtures for the additional mention edge rather than preserving obsolete counts. The source says a name; it does not prove that its referent is the surveyed heritage property.

## Exact remaining duties across the two inspected handoffs

| Party | Apocrypha PR38 | LDS PR33 |
|---|---|---|
| Claude | Apply APQ-004 badge/comment/test alignment; disposition Low APF-001 horse-versus-rider wording. Obtain permitted real-GPU finished-surface evidence for APB-004 and complete technical signoff. Correct the stale PR claim that CI runs test:browser through its normal authorized workflow. | Implement existing PR34 BA01–BA04: two pin holds and route breaks,11representative replacements,13visible secondary qualifications, and receipt/disposition reporting. Schematic Q03 already has owner authorization; do not ask again. |
| ChatGPT | Recheck the changed exact head and preserve the completed18/19APB correction recheck and20-item source sample. No need to repeat them at this unchanged head. Quotation inventory remains explicitly deferred under the accepted paraphrase-purpose disposition, not falsely complete or a fresh legal certification. | The previous26-anchor incorporation audit is complete but findings are unresolved at unchangedc59c9bc. Separate full built-copy/import-defer-unlocated accounting and cross-layer content audit remain ChatGPT work; this small Apocrypha continuation does not claim to finish them. Recheck builder fixes when present. |
| Owner / evidence provider | Release approval only after required signoffs; no new scope decision needed for this neutral mention. Hardware access/evidence is a technical dependency, not presumed available here. | Three original Americas/LiDAR artifacts with source/provenance context still require identified handoff before claim review; prior task exists. Q03 schematic preference is already settled. Eventual release approval remains separate. |

Both main status files still assign ChatGPT (Apocrypha final-audit; LDS built). That coarse status does not mean Claude must idle: the exact actionable corrections are already published on review branches. No external message or new PR is required to read them. LDS review remains PR34/a208d9679bd7af78e1408ef043f59ffc0fe8dda4; its26-row audit reports0/26fully incorporated, not26wrong coordinates. PR33 remainsc59c9bc13d848bbf0c4b3f3c64810bfa187749f0. No LDS source research was repeated here.

## Validation and limits

The existing research validator passed (CSV structure, IDs, work lookup and local links). Independent before/after assertions check that only the named rows changed, exactly one stable edge was added, all seven later Babylon edges stayed byte-equivalent as parsed records, and every changed/new index gate agrees with its registry record. No application code or current main file was changed. No application test rerun is claimed for these documentation data edits. Prior implementation tests/CI are reused only for their unchanged SHA; no rendered/browser/server/GPU check or final release approval.
