# BA07 tranche 7 — remaining primary Restoration episodes

2026-10-31. **Proposed content specification, not implemented corrections or release approval.** PR33 remains open and unmerged at `c59c9bc13d848bbf0c4b3f3c64810bfa187749f0`; PR34 baseline is `0ac579fe74d4acb28f0101033e6f7082b97ee641`. Claude's main lock declares LDS BA01–07 and supplementary crosswalk work. That is evidence of pickup, but no changed implementation is published on PR33 yet. The lock, implementation code and owned status were not edited.

## Exact scope and accepted evidence

The [five-row crosswalk](ba07-spec/restoration-events-content-crosswalk.csv) specifies **RE02, RE05, RE06, RE07 and RE13**, the remaining omitted primary Restoration episodes not already specified. It supplies minimum attributed copy, evidence classification, display date, exact source URLs, accepted research context, work/layer fields, source-row hash, prior support-audit locator and per-ID acceptance checks.

Tranche 2 supplied the other six omitted RE records. All **11 omitted primary RE records** now have specifications; the **nine represented RE records** are not duplicated. Across seven tranches, **108 distinct source views are specified**, not 108 implemented objects or independent historical confirmations. The original 96/256 audit and six earlier tranches remain unchanged. Supplementary D&C dossiers, relationships, other records and broader BA07 acceptance remain separate scope.

Evidence is reused from `restoration-inventory.md` and `restoration-record-audit.md`. No source was freshly reopened or handwritten document newly transcribed in this pass. Dates and historical characterizations are those supported by the accepted research; source hashes establish repository integrity, not fresh reading. R-source IDs are local to the Restoration inventory.

## Builder-ready sequence and exact distinctions

| Order | ID | Minimum source view and consolidation rule |
|---|---|---|
| 1 | RE05 | Missouri's expulsion/extermination order, dated October 27, 1838. Attribute the historical summary and date to Missouri State Archives and its finding aid. The order is a distinct action from later Liberty imprisonment; do not place its issuance at the jail. |
| 1 | RE06 | Liberty confinement from December 1, 1838 to transfer on April 6, 1839. The documentary synthesis supports imprisonment and transfer, not an acquittal, conviction or the date of ultimate escape. Reuse RP04's identity but keep the episode source-qualified. |
| 1 | RE07 | D&C 121's two prison-letter sources: March 20 and approximately March 22, 1839. Preserve the approximate second date and both pleas for relief and teaching on authority. A Liberty reference card can combine RE06/07 and earlier RC02 only as separately sourced sections. |
| 2 | RE02 | Smith's account of reciprocal baptisms following the reported visitation, May 15, 1829. Existing RE01's authority-conference account does not itself display the baptisms. A combined source-qualified card is acceptable; map each episode ID separately. |
| 2 | RE13 | Young's July 24, 1847 arrival at the valley camp after the advance company. Distinguish him from earlier arrivals, the whole migration and Indigenous occupation. Existing routes or a city label do not import this temporal/actor distinction. |

The CSV's `minimal_neutral_copy` uses the accepted paraphrases with explicit evidence labels and normalized spacing. Display its `display_date` alongside the relevant paragraph. Equivalent natural phrasing is allowed only if attribution, chronology and qualifiers remain intact. Consolidation does not mean one generic sentence can satisfy unrelated IDs.

## Runtime and place/date gates

Use current codex fields `name`, `books:[4]`, `layers:["dc"]`, `desc`. These are Restoration source views at work group 4, not a new `dc-history` runtime layer. RE02 can cite JS—History as part of the accepted Restoration source presentation; any separately presented PGP account retains its group 5 gate. Do not unlock unrelated PGP/BoM prose through a shared person or OR-layer.

The minimum implementation for all five is a **nonspatial reference view**, with visible evidence mode, date and source locator. Do not create new pins, routes, `lat/lon`, `rel` or episode-site links. A modern Liberty site, Susquehanna commemorative setting or Salt Lake reference point does not locate an exact cell, 1829 riverbank, order issuance or arrival camp. No shoreline reconstruction or unsupported battlefield is needed.

For these minimum codex views omit numeric `when`, retaining the precise supported date treatment in visible prose. This is deliberate avoidance of conflating multiple documentary milestones or approximate dates into a false numeric interval; it does not discard their chronology. If the builder later chooses Chronicle cards, specify and test the exact numeric semantics separately, with no guessed day or episode location. RE06's supported confinement interval is different from an entire lifetime or the full Missouri conflict.

### Evidence qualifications that must remain visible

- **RE02:** the experience is reported in scripture; R04 supplies the Susquehanna identification/commemoration. The sources do not independently authenticate the religious experience or supply an exact historical bank point. Keep the two men baptizing one another separate from the reported visitation.
- **RE05:** R08 is the archive custodian's historical overview; R09 is collection/finding-aid metadata for the order. The accepted audit records that the manuscript image was not read as handwriting. Do not imply an independent paleographic transcription or add casualty counts, universal motive claims or every later consequence to this short card.
- **RE06:** JSP is a Church-sponsored documentary edition. Its editorial synthesis supports the stated custody dates; sponsorship is not independent corroboration by an unrelated institution. Transfer for further proceedings is the supported endpoint, not a judicial verdict.
- **RE07:** the current D&C heading is editorial context; the section's pleas and normative authority teaching are scripture text. Do not present the whole section as a single letter written on March 20, or the normative teaching as proof that all leaders complied.
- **RE13:** NPS supplies a historical synthesis independent of Church editorial control. Its account supports Young arriving after the advance camp, not the first human arrival, a precisely surveyed camp location or a single date for every emigrant.

URLs and prior support locators are in the crosswalk. Visitors must see the source locator/evidence label through renderer-supported mechanisms; hidden arbitrary fields are insufficient. Related RP/RE/RC handles are research references, not automatically valid runtime links. Resolve existing targets or use plain source context rather than broken links.

## Acceptance checks and returned handoff

1. Return all five research IDs mapped to runtime item/subsection, visible source, chronology, disposition and changed implementation SHA. If RE02 expands RE01, or RE06/07 consolidate with RC02, demonstrate each distinct proposition rather than counting a shared title as complete coverage.
2. Evaluate the actual assembled-pack predicates at DC group 4, prior group 3, `dc` disabled with other layers only, and all-works. Keep prose, date and citation gates aligned. No PGP or BoM detail should leak through a shared identity.
3. Assert no new coordinates/routes or guessed date. Check May 15 as a reported baptism date, October 27 as the order date, December 1 to April 6 as custody/transfer, both Liberty epistle dates with “approximately” retained, and July 24 as Young's arrival after the advance company. Do not silently convert RE07 to a single date or equate transfer with escape.
4. Exercise source reachability, grouped-card readability, date labels and desktop/mobile filters in the permitted technical environment. This docs pass has not performed rendered acceptance and authorizes no browser/server workaround.
5. Return the exact changed implementation head for ChatGPT content review and Claude's same-head technical/rendered checks. These proposals do not close BA01–07 or the owner release gates.

## What is resolved and what remains

No new source-access blocker prevents the five minimum source views. Exact experience locations and broader manuscript/historical questions remain qualified rather than invented. A04's dense-display deferral does not waive these ordinary episodes; any proposed omission needs explicit scope disposition.

This completes specifications for omitted **primary RE records**, not all Restoration history or supplementary D&C material. The next useful independent slice, if PR33 still has no changed build, is primary unlocated places or textual journeys; a published remediation head takes priority for audit. The separate owner archaeology/LiDAR artifacts and approved schematic do not block this tranche.

Run `python docs/universes/packs/lds-standard-works/ba07-spec/build-restoration-events-crosswalk.py`. It checks five omitted IDs, no overlap with the previous 103 views, coverage of all 11 omitted primary RE rows across tranches, source hashes/URLs and prior audit pointers. Earlier tranche validators and the original 96/256 validator remain unchanged. These establish specification integrity, not fresh source validation or implementation acceptance.
