# Lore corrections — Revision 6 implementation review

2026-11-07 UTC · ChatGPT.

**Verdict: implementation accepted for the bounded source-confidence manifest.** All **21/21** candidate lead dispositions conform at source level. This closes the requested qualification/removal batch, not a full-novel audit or an unrestricted atlas canon certification. Return to Claude for exact-revision technical acceptance and the remaining rendered evidence described below. No owner release request yet.

## Exact target and method

PR [#24](https://github.com/mckayec/universe-sandbox/pull/24), `fix/lore-corrections`, **6a961275cade4494a2d90b59e13fced5a2431155**, open/unmerged. Parent: `4a13b1bde7cb0a11942f8892fa0fd22c86bc48ef`.

Read the actual parent-to-head diff (**9/9 files**: seven application data files, implementation note and probe), complete returned pack/Society files, shared engine source, the accepted proposal review, original corrections and Claude's source-confidence-implementation.md. No main integration occurs in this commit. The shared engine blob is still `d8225b464b2d9483e8eb2a91f896d07efb13279e`; renderer, CSS and timer logic were not changed by this batch.

This is independent source inspection of an implementation, not fresh literary sourcing. **0 new book claims independently certified; no local tests or browser execution newly claimed.** Preserve the historical 40-lead and 120-spot-check records and their limits without recounting them as new work.

## Dispositions

| Lead group | Checked implementation | Result |
|---|---|---|
| L4, L5 | Ganelon alias removed; William reign sentence explicitly provisional and names the fan wiki | 2/2 accepted |
| L6, L7 | b1j qualifies the remaining plot summary; Madhya base and both eras use investigation with attached qualification | 2/2 accepted |
| L11, L12 | Leuctra/event and Pallas/event/Tycho-era qualifications; repeated hover summaries neutralized | 2/2 accepted |
| L13, L14, L15 | Ilus blurb and facts name secondary evidence; b1c qualified; book-one itinerary provenance appears in the intro legend; Nieuwestad note expressly spelling-only | 3/3 accepted |
| L17 | Farok/stone-burner account qualified; Naraj official-name evidence and Wallach's reported uncertain fate not strengthened | 1/1 accepted |
| L18, N1 | Smyrno qualification; both Foundation intro and Empire codex name the secondary Jazbec article | 2/2 accepted |
| L22, L23, L24, L26 | Roshar era/e59, e24 and Patji identification qualified; Nomad more[12] and Canticle era[12] both qualify the identity; UTol destination removed | 4/4 accepted |
| L27, L28, L30, L31, L32 | Rhea narrative/facts/event qualified; Octavia attribution; effective Bleeding Place override and g8; six New Sparta/Rome fields; Pluto/r3 qualification | 5/5 accepted |

**20/21** leads have the required qualification/removal action: L4 removal, 19 qualification actions (L15 spelling-only). L28 uses the accepted attribution. These are lead-level dispositions, not counts of atomic facts proved true.

R-1: **3/3** Madhya blurbs repaired. R-2: **1/1** definite UTol destination removed. R-3: **2/2** requested scene/landmark text repairs made; all six associated qualified fields are present. Bressia: **1/1** accepted narrowing applied. L28: **1/1** attribution applied. The **5/5** prior U cut/neutralization dispositions remain intact in this delta; no rejected clause or Canticle–Komashi link is restored. R4-C1 timer closure remains closed.

## Effective fields and gates

Inline qualifications travel with their strings through the existing escaped text paths; there is no new untrusted-HTML or source-note renderer. Important checks:

- The engine renders the Expanse intro legend, so the route note is in an actual presentation path rather than the unused r1 label. It names book-one route provenance without introducing a new itinerary spoiler.
- Nomad's identity qualification is inside the existing book-12 `more` string; Canticle's is inside era 12. Neither moves into base copy.
- Society's later Bleeding Place `set()` override contains the qualification, so it does not erase the earlier note.
- Society transfers the qualified Rhea blurb into era 2 before installing the neutral base. The facts Source row is also present. This review does not claim a new general audit of every inherited facts gate.
- Pluto's original blurb is overwritten by the neutral base and has no restoring era. The qualified r3 event is the visible exile account. The manifest correctly discloses this rather than claiming the unused blurb is displayed.
- New Sparta/Rome POIs remain from 6, events remain book 6, and the existing scene gate remains 6. The scene and palace text themselves carry the qualification. No metadata gate is lowered in the actual diff.
- Ilus's facts retain named secondary attribution when its later era replaces the base blurb. The spelling-only L15 note does not certify Alex's separate family/travel story.

Source identifiers in the manifest resolve through corrections.md's existing source record; this review does not represent them as freshly opened evidence or turn secondary citations into primary-book verification.

## Validation evidence and limits

Independently fetched [CI run 42370835357](https://github.com/mckayec/universe-sandbox/actions/runs/42370835357), build job 128398428589 logs. They report **125/125 unit tests**, **24/24 standalone page/viewport cases**, format/build success, and distribution check **113 files**. Deploy was skipped.

Crucially, CI tested synthetic merge **bf5787b9ff287a7c5091f3981e57c9b8c6ff51ef**, combining the reviewed head with main **6defada09fde8e5f9c7e2155f7f375adcd67bffc**. The head-to-merge comparison has 263 changed files, including engine.js, engine.css, layers.js, other application code and tests. **This is not an identical-runtime substitute for the branch head.** Do not label those 125 tests as an independent rerun of Claude's branch-head 89 tests. Claude's reported **89/89**, **24/24** and **29/29 per viewport** remain builder-attributed.

Read the entire committed source-confidence-probe.cjs:
- Shared-engine checks inspect claim and note strings and exercise Madhya and Nomad downgrade paths.
- Phone checks deliberately use `textContent` for a collapsed dossier. They establish DOM content, not readable expanded-sheet presentation.
- Most Society checks read exposed data objects, not rendered/gated UI.
- The “site rendered” case searches `document.body.textContent`; it does not establish visible placement, clipping or that the palace landmark itself is readable.
- Horizontal overflow is asserted only for Society. The script prints failures/page errors but does not set a failing exit code on them. A successful process exit alone is therefore not a passing result.

These limitations do not reverse the source-level content acceptance. They bound what the builder's 58 reported cases demonstrate. No new application defect is asserted solely from missing test coverage.

## Finite return to Claude

Complete the current revision's technical/rendered acceptance, preserving this content disposition:

1. Supply actual visible checks at desktop and phone for the expanded qualified dossier and New Sparta scene **and selected palace landmark**. Assert visible target text/geometry rather than whole-body hidden text; check clipping/overflow. Exercise Society book-6 to book-1 downgrade with the relevant UI open. Carry the already exercised shared-engine downgrade evidence accurately.
2. Make the probe fail on failed cases or page errors, and show one deliberate negative control for the visible-text predicate. Keep data-only cases labeled data-only.
3. State which runtime was tested: branch head versus synthetic merge. If integrating main, return the new exact SHA and changed-runtime/content inventory for the relevant recheck; do not transfer either sign-off automatically across the engine changes.
4. Record technical sign-off at the applicable revision, with required screenshot/performance checks or explicitly bounded unavailable evidence. Prior technical approval at 4a13b1b does not cover the new longer copy.

No further open-ended literary research is requested by this handoff. Broader full-book/Cosmere work remains separately tracked; this acceptance does not certify that unfinished work. The only return requested here is finite validation of the accepted batch and reconciliation of the actual release revision.

**Counts:** 9/9 diff files reviewed; 21/21 manifest leads accepted at source level; 3/3 residual groups resolved; 5/5 prior U dispositions preserved; 0 new literary certifications; CI125/125 and24/24 confirmed from logs at the explicitly different tested merge. No independent browser run.

**Verdict: bounded implementation accepted; hand to Claude for the specified technical/rendered return. Full atlas canon and owner release approval are not granted by this report.**
