# COS-BB-001 — full-scope implementation handoff

Recorded 2026-11-09 UTC. D08 is answered: **option c**. The user approved infrastructure, researched work mappings, a preset selector **and** an explicit per-work checklist. This replaces the awaiting-owner scope blocker, not the separate release gate.

## Decision and responsibility

Relevant conversation:
- Assistant: “3. Cosmere spoilers: Should I build researched book mappings and a preset selector, or also include a per-book checklist? I recommend the mappings and selector first.”
- Mckay: “3. YEs proceed with all”

Claude owns implementation. ChatGPT owns the source-backed work registry and record/field mapping research and independent content/implementation return review. Use the existing Cosmere review lane; do not create a duplicate source audit or reopen the accepted bounded Elantris corrections.

The accepted contract is [design revision 3](cos-bb-001-design-proposal.md), as controlled by [its independent review](design-review-v3-2026-11-07.md). All four design groups are accepted. This handoff does not ask for a fourth proposal round.

**No Cosmere merge, deployment or release is authorized.** Do not apply D04–D07's separate release decisions to this feature. Return exact-head evidence, then retain Mckay's distinct release approval.

## Current source observation

PR37 was open at **08d10e1736d3e6916d7a061d311ddb13f444bb05** when checked. Its complete Cosmere pack was retrieved and evaluated in an isolated Node VM. It still declares `spoilers.mode = "cumulative"`, has no `works` or `presets` registry, and retains 14 key-2 events and 20 key-12 events. These are source inventory observations, not runtime spoiler tests or a new acceptance of PR37.

Reconcile the actual latest PR24/PR37/main state before implementation. Preserve concurrent Deep Worlds fixes and prior source dispositions. Use a draft implementation PR unless existing branch ownership explicitly makes one current PR the safe integration point. Do not mix an unreviewed large spoiler refactor into an approved release head.

## First bounded return: infrastructure and complete UI behavior

Start the finite engine/state/helper refactor now. The unfinished bibliography and mappings need not block implementation against explicit synthetic fixtures, but fixtures and illustrative IDs must not become asserted production research.

1. Implement the validated registry, one visibility helper, DNF `req`, descriptive-only `in`, narrowing `needs`, and record/ancestor/field intersection.
2. Implement legacy, versioned preset and explicit-set state, URL/storage migration and safe-state parsing before first render. Preserve legacy numeric keys rather than silently reassigning them.
3. Remove the obsolete URL-precedence sentence in the proposal. Replace it with: “More than one of `book`, `upto`, and `read` is a conflict and enters the safe state described below; no reading-state parameter takes precedence over another.”
4. Implement both requested controls: preset selector and per-work checklist. The checklist is **in scope**, not deferred pending another owner question. A selected later work must not silently tick earlier works or other works in its series. Unchecking a work must narrow immediately through the same safe render/cancellation path. Display actual selected works and make the preset/checklist state transition explicit rather than implying a mixed set is a preset prefix.
5. Keep the authoring/fixture test surface distinct from a validated public mapping set. Legacy remains the initial production behavior until the real registry and mappings are reviewed; this is a staged return, not cancellation of the selected public controls.
6. Return the exact branch/head, stable data interface and changed files with a complete per-surface inventory. Route this lane to `implementation-review / chatgpt` after that bounded return, so the next mapping packet can use the implemented interface rather than an unspecified contract.

If a current claimed engine task prevents starting, record the exact dependency and next bounded action. Do not leave the status awaiting Mckay: D08 is resolved.

## Research continuation and bounded mapping returns

[The first research checkpoint](mapping-checkpoint-2026-11-09.md) verifies the three original Mistborn bibliography entries and supplies one narrow, commentary-supported event-gate disposition. It also records the actual 14/20 event inventories. This is not a complete registry or bucket audit.

After the first infrastructure return, ChatGPT should complete the first key-2 record/field/ancestor mapping packet, followed by key 12 as the accepted proposal specifies. Each bucket return must name:
- Actual record/field IDs and the exact implementation SHA inventoried.
- Permanent work IDs, titles/editions, publication evidence and preset membership.
- A source for every promoted reveal gate, plus any narrower wording or omitted/held content.
- `in` separately from `req` and any independently justified `needs`; publication rank is never a prerequisite inference.
- Parent and field restrictions, including names, eras, facts, search snippets and intro copy.
- Checked/total denominators by surface and explicit source holds. Do not count a bibliography entry or whole-bucket fallback as a reviewed record mapping.

Secret History is not implicitly included in finishing the original trilogy. Anthology membership does not mean all constituent stories were read. White Sand volumes/omnibus and anniversary/reused text require edition reconciliation. The Fires of December publication/edition and later plot remain a documented source hold until checked; a preview or the existing key-12 label cannot establish publication or validate later plot.

## Required implementation evidence

All eight accepted test families remain mandatory, with passed/failed/not-run distinguished:
1. Actual-source legacy parity for keys 0–12 across every inventoried exposure surface.
2. Tagged records before and at each reveal gate, including precise checked/total counts.
3. AND/OR/`needs`, ancestor intersection, cycles, unknown IDs, invalid/empty clauses and misuse of public markers.
4. Non-prefix sets and a first-Mistborn-only negative control that hides later grouped Sazed/Harmony revelations.
5. Conservative whole-bucket fallback, visible unreviewed notice, invalid bucket rejection, and absent-versus-invalid field gates.
6. URL/storage round trips, version retention, strict integer/range parsing, every conflicting pair and all three reading parameters, repeated same-name parameters, malformed IDs/index/version, empty storage and stored All, and no protected first-frame flash.
7. Narrowing and invalid-link safe state while dossiers, searches, tours, place construction or effects are pending. Cancel and recheck callbacks before every write.
8. Back/Forward and saved deep links restoring only permitted surfaces or a neutral visible parent.

Render the negative controls at 1440×900 and 390×844. Exercise checklist repeated taps/clicks, keyboard selection, close/cancel, reopening, deliberate transitions among preset/custom/legacy, and unchecking while work is pending. Run the repository's applicable format/check/build/unit/page/browser checks on the final integrated head. A static scan, a fixture pass or an old-head CI run is not a substitute for actual-source and rendered evidence.

## Known gaps and completion boundary

This handoff executes the owner scope decision and starts the implementation lane. No feature implementation, real-browser pass or full-book audit is claimed here. The initial ledger remains 0/33 full-book audits approved. Previous Elantris closures and source holds remain scoped; this decision does not certify all books, records, editions or locations.

Claude's pickup receipt should name this handoff, the claimed unit, branch/head and next action. ChatGPT then reviews the returned revision and advances the researched mapping packet. Technical acceptance and Mckay's separate release approval remain required.
