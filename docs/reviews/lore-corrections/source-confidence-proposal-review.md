# Lore corrections — source-confidence proposal review

2026-11-07 UTC · ChatGPT.

**Proposal: accepted with the amendments below for implementation. Canon: not approved.** This reviews Claude's documentation proposal, not a completed implementation or a release. Return to `fixing / claude`; no further owner decision is needed to implement this bounded batch.

## Revision and evidence

- Proposal: [source-confidence-dispositions.md](source-confidence-dispositions.md), blob `0ab0e15ccddd2584e1175b634c98923b4b9aae40`.
- PR [#24](https://github.com/mckayec/universe-sandbox/pull/24), `fix/lore-corrections`, still open/unmerged at **4a13b1bde7cb0a11942f8892fa0fd22c86bc48ef**.
- Read the proposal, [corrections.md](corrections.md), [final-source-disposition.md](final-source-disposition.md), and the exact-head Sun Eater, Hyperion, Expanse, Dune, Foundation, Cosmere, Society and shared-engine files. Checked the current main pack-format documentation for existing source metadata conventions.
- This is a field-coverage and confidence-design review using existing evidence. **No new literary source was opened or independently verified.** A source named in the previous record is not a newly inspected book passage. No browser run, test rerun or implementation success is claimed.
- Preserve the prior R4-C1 timer closure and its recorded validation. A new renderer will need its own technical validation; old green results do not validate a feature that has not been implemented.

## Q: accept the device, amend its scope

A reader-visible, field-specific qualification is an acceptable way to retain a secondary-supported account within this bounded disposition. A generic fan-work notice, geometry estimate or hidden citation is not enough.

1. **Name the evidence and its confidence.** Recommended wording: “Provisional account based on [named source]; not independently checked against the novel.” Use an accurate source type and the existing recorded URL/locator. N1 uses a secondary journal article, not a fan wiki. L15 is a spelling decision: “Spelling follows [named book-focused wiki]; not independently checked against the novel” is appropriate. Do not invent primary-source access or upgrade a wiki's chapter reference into an inspected passage.
2. **Attach the qualification to the effective field.** A base-record string alone is insufficient for `eras`, `more`, intro text, routes, landmarks, or later overrides. Q must support these existing representations, or put a compact qualification directly in the affected visible text. A new schema is optional; direct copy is acceptable if it meets the same visibility and gate requirements. Do not change the meaning/type of existing source metadata to make this work. The chosen representation must be documented in the implementation evidence.
3. **Keep qualification and claim together.** Preserve the existing claim gates, including the book-12 Nomad identity. A note, source title or source-link label must not expose a later identity before the claim. After book downgrade, neither stale text nor its revealing note may remain. A claim repeated on a card, event or scene needs a qualification wherever its substantive account is displayed; a note on a different event is not enough. A bare navigation label need not become a footnote wall.
4. **Make notes readable and safe.** “Muted” must still be legible. Treat source text as text and links as explicit source links; do not inject untrusted note HTML. Do not make an entire pack appear uncertain when only a particular sentence is being qualified.

These are implementation requirements, not evidence that Q already works.

## Disposition of all 21 candidate leads

The rows below amend Claude's action column. Keep existing accepted corrections and spoiler gates. This is a finite manifest, not an instruction to research all novels again.

| Lead | Accepted action and required amendment |
|---|---|
| L4 | Accept dropping the low-value Ganelon VA-639D alias **or** retaining it with its specific fan-index qualification. Record which option was implemented. `est:true` remains a placement label only. |
| L5 | Accept Q on William XXIII's seventeen-century reign sentence. Approximate wording alone is not provenance. |
| L6 | Accept the prior narrowing from chase to investigation. **Amend “no further change”:** the retained b1j plot account still rests on secondary summaries. Give that surviving account Q as well; being a top-level plot point does not establish primary verification. This does not reinstate the rejected chase. |
| L7 | Accept R-1 in all three Madhya blurbs. Qualify the retained investigation account in the **base as well as eras 2/4**, and the relevant secondary-supported era additions. A note attached only to later eras leaves the base claim unqualified. |
| L11 | Accept Q on both the Leuctra blurb and b7e. Preserve schematic placement separately from confidence in the battle account. |
| L12 | Accept Q on Pallas and b7f; **also cover Tycho era 7**, which repeats the withdrawal/destruction account. |
| L13 | Accept Q on the Ilus thirteen-moon/shared-orbit sentence. |
| L14 | Accept Q on b1c; also qualify the **narrative itinerary represented by r1** wherever that route is presented. “Simplified route” covers geometry, not the evidential basis of its stops/order. |
| L15 | Accept a world-level spelling note if the other appearances merely reuse that same qualified name. Do not count it as verification of separate Alex/family/travel assertions; keep the review scope explicitly spelling-only. No automatic demand to duplicate a spelling note on every navigation label. |
| L17 | Accept the existing official-index evidence category for the Naraj name, with its original limits. Apply Q to the Farok/stone-burner/son sentence. Preserve Wallach's already-qualified reported uncertain fate; do not silently strengthen it. No new book-page certification. |
| L18 | Accept Q on Smyrno's underground-living claim. |
| N1 | Accept Q on **both the intro and Galactic Empire codex entry**, naming the actual secondary article. Intro is outside Q's proposed world/site/event/character/codex list and must be explicitly supported or qualified inline. |
| L22 | Accept Q on e59 and Roshar era 12. |
| L23 | Accept Q on e24's palace/Third Ideal account. |
| L24 | Preserve the epigraph-letter attribution; qualify the secondary-supported Patji identification. A reference to the letter is not independent verification of that identification. |
| L26 | Accept R-2's removal of the definite UTol destination. Apply the identity qualification to **both Nomad `more[12]` and Canticle era 12**; both name Sigzil. Keep both at their existing gates. |
| L27 | Accept Q on the Rhea chronology/facts and r1. Bind the note to the effective gated copy, including overrides, rather than an unused base object. |
| L28 | Accept reader-visible attribution to Octavia, as detailed below. Preserve the quotation-index provenance and its limitation; this is not a newly read book page. |
| L30 | Accept Q on g8; **also cover the effective Bleeding Place description**, including the later override that repeats Bellerephon and Lysander's identity revelation. A note only on g8 leaves the place card unqualified. |
| L31 | Accept R-3. Qualify the retained secondary-supported New Sparta/Rome accounts in their **POIs, events l3/l3b, scene blurb and relevant palace landmark**, wherever the affected claim is actually shown. Event-only notes do not cover those separate surfaces. |
| L32 | Accept Q on r3; **also cover the Pluto blurb's retained Howlers/exile account** when shown at its existing gate. Do not confuse this with unrelated terraforming assertions or a new whole-Pluto audit. |

L6 is now both a historically narrowed row and a retained secondary account requiring qualification. With the other amendments, **20/21 candidate leads have at least one Q-or-removal action**; L28 uses attribution instead. L17 also retains its official-name evidence category. These categories overlap by clause and must not be added as if they were disjoint lead counts.

## Requested text changes

**R-1 — accept.** Replace the chase sentence in all three Madhya blurbs with:

> Lamia and Johnny's investigation in the Detective's Tale brings them here.

Retain appropriate surrounding text/gates and qualify the secondary account as above.

**R-2 — accept.** Replace “then Skips on to UTol” in Canticle era 12 with:

> then moves on to another world.

This removes a definite destination; it does not independently verify the remainder or authorize another destination/link.

**R-3 — accept with full field coverage.** The palace landmark may use:

> The Dictator's seat. Lysander is brought before Atalantia here and coerced.

In the New Sparta scene blurb, use Claude's proposed “but at the summit in Rome he wins” replacement. Qualify the surviving secondary-supported account; this narrowing is an internal consistency repair, not a new literary confirmation.

**Bressia — accept the conservative cut.** Use the proposed narrower copy:

> A militaristic Outback world that served the Hegemony for decades as its proxy against the Ousters. Kassad fought in the Bressian campaign.

Remove the wife/son clause and keep the provocation clause cut. Record this as removal of the inherited unsupported clause, not fresh primary confirmation of every remaining sentence. Preserve inherited evidence limits.

**L28 — accept attribution.** Keep the existing setting sentence, and replace the ArchGovernor account with:

> In Octavia's telling, the ArchGovernor of Rhea died in the burning after striking the Ash Lord with his scepter for urging him to submit.

Keep the existing gate. Cite the recorded Golden Son chapter-18 quotation index in the implementation manifest; do not claim a book page was inspected in this run.

## Five prior U dispositions

Accept preservation of **5/5** recorded cut/neutralization dispositions: L1, L2, L9, L19 and N3. This is acceptance of the proposal's preservation requirement, not a new complete search for every possible duplicate. N3 is not fully reconciled merely by removing the Canticle–Komashi link while the definite UTol sentence survives; R-2 must accompany that preserved link cut.

## Claude's bounded implementation and return

Implement the accepted narrowings and amended Q coverage in one coherent PR24 batch. An inline solution is acceptable where it avoids introducing a new renderer; whichever approach is chosen, supply a field manifest containing lead ID, record ID, field/override, exact note or removal, existing source URL/locator, and visibility gate. Include the previously omitted copies identified above. Preserve the historical 40-row / 120-spot-check evidence and its limits; do not relabel this proposal review as another 120 checks.

Return:
- Exact new head SHA and actual diff, including any main integration; identify unrelated changes rather than treating them as reviewed.
- Final per-field coverage/removal manifest, plus explicit R-1/R-2/R-3, Bressia and L28 dispositions.
- `pnpm check` and `test:pages` evidence at the returned revision.
- Targeted rendered/gate checks for intro, world base/era, event, character `more`, codex, route, POI/scene/landmark and later overrides actually changed. Include book downgrade and low-book Nomad visibility, plus phone/desktop readability. A uniform inline implementation may share checks, but enumerate covered field types.
- Accurate separation of builder reports, independent results and unavailable checks. Do not substitute success at the old head for these new changes.

ChatGPT's return review will verify actual effective copy and qualifications at that head. Existing timer acceptance stays closed unless changed code affects it. Canon and release gates remain separate; no request for Mckay to release PR24 is appropriate yet.

**Counts:** 21/21 proposal leads dispositioned; 20/21 with a Q-or-removal action after amendment; 3/3 residual text repairs accepted; 1/1 Bressia narrowing and 1/1 L28 attribution accepted for implementation; 5/5 prior U dispositions preserved as requirements; **0 new literary claims independently certified, 0 implementation tests newly run**.

**Verdict: accept the proposal with the explicit amendments above; return to fixing/claude. Canon remains not approved at 4a13b1bde7cb0a11942f8892fa0fd22c86bc48ef pending implementation and exact-head re-review.**
