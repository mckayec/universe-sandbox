# Standard Works final package — source decision and continuation

2026-11-07 UTC · ChatGPT. PR33, `pack/lds-standard-works`, exact head **e2c02e49d8f77d020d5e0d1f8ddd30b2fab98d25**. Reviewed [checkpoint 67 package](final-package-e2c02e4.md) against the actual complete generated pack (blob **9e0f93eac67efa34598a9d2c9481635e6519e172**) and [existing final audit](audit-final.md).

## CS-1 decision — add links to all 33 cards

Choose the builder's first proposal: add appropriate official sources to **33/33** currently unlinked cards, preserving wording and gates. Do not exempt the seven `works` cards as generic overviews: six contain specific textual assertions (resurrection testimony; baptismal commitments; D&C section 7; Kolob; Article of Faith 4; Articles of Faith 8–9). The remaining Standard works card makes an institutional canon claim and should link the Church's own explanation.

Independently evaluated the exact-head pack and counted **1,647/1,647** codex records: **1,614** with a nonempty `src` array and **33** without one. Read the complete text of **33/33** unlinked records, not just the truncated descriptions in the builder's stats script. The missing-source inventory in package §5 matches: works 7, unmapped-places 19, unmapped-narratives 7. A missing link is not proof the prose is false; this decision addresses traceable evidence in the shipped cards.

| ID | Severity | Location | Finding and evidence | Required fix |
| --- | --- | --- | --- | --- |
| CS-1 | Medium | `codex`: works[0–6], unmapped-places[0–18], unmapped-narratives[0–6] | All 33 records have no source links; six of seven works entries are claim-specific rather than general overviews. Actual pack inspection agrees with the builder's inventory. | Add claim-appropriate official source links to all 33, with accurate visible locators. Preserve each account's distinct layer/book gates and all existing prose unless a source check establishes a correction. |

Use source granularity appropriate to the claim: an official Church canon explanation for Standard works; the named scripture chapter/passage for narrative and teaching cards; the D&C introduction plus section 7 for the two distinct assertions in its overview; the D&C introduction for that layer's First Vision card and Joseph Smith—History for its separate Pearl of Great Price card. Do not replace these account-specific sources with one generic Church landing page.

The Abraham journey card explicitly compares two ages in two accounts. Its link set must support **both** Abraham 2 and Genesis 12, without harmonizing them. Keep D&C 38 and Moses 7 separate for the paired Enoch cards. An official source for a narrated place does not establish a modern coordinate: retain the existing unlocated/model qualifications. No pins, years, identity links or account mergers are authorized.

This checkpoint made **0 new primary-source confirmations**. These source choices are implementation requirements based on the cards' assertions, not a claim that destinations were freshly opened and verified here. Claude should return an explicit 33-row manifest (section/index or key, source label, exact URL, passage supporting the card), with link additions in the generator and generated pack as applicable. Tests should verify every expected card has the intended source, without altering unrelated descriptions, gates or data.

## Completeness and confidence disposition

Accept **curated atlas, not verse-complete concordance** as the stated coverage description. It must remain visible and accurate. Preserve all previous accepted batch corrections, especially RES64-C1/C2; they are not reopened.

Do **not** turn the package's counts into a whole-pack confidence clearance. I independently reproduced the stats script's **112** qualification-language matches. That regex is a discovery aid, not a confidence ledger: it can match a source's statement that a name is not supplied, miss other uncertain wording, and does not show whether each qualification addresses the relevant claim. Likewise, absence of a literal U field does not prove there are no unsupported claims.

For the return, identify the dispositions of any *still-open* low-confidence/unknown or completeness findings by their existing IDs and cite prior closures where already resolved. No repeat of all 1,647 cards is requested. Distinguish an omitted future expansion from an unsupported assertion retained in the current pack. The former may remain a clearly disclosed Known gap under R3; the latter still needs evidence, qualification or removal. Wider vision coverage is not certified by this checkpoint.

## Evidence limits and next final-audit unit

- The unchanged pack blob matches the previously independently reviewed checkpoint-66 revision. Previous wording and regression closures remain in force.
- Checkpoint 67's 171 tests, browser pass, captures and four-viewport interaction results are **builder-executed evidence**. They were read as a report here, not independently rerun or visually inspected. This checkpoint does not convert them to independent acceptance or formal technical sign-off.
- Final §4 sample checked in this checkpoint: **0/20**. The builder's suggested selection only samples keyed, sourced codex entries; it excludes the 33 CS-1 records and non-codex events/sites/journeys. The final auditor should record a reproducible selection with the stated population and include non-codex coverage, in addition to the targeted 33-link check, rather than describe that sample as whole-atlas coverage.
- Physical-device/real-GPU limitations and Mckay's separate release decision remain explicit. No new owner decision is requested.

**Next bounded action:** Claude implements CS-1 for all 33 cards and returns the exact new head, 33-row source manifest, preservation diff/tests and the existing-open-finding dispositions. Then ChatGPT checks the added links against opened sources, performs and records the final 20-entry sample, and decides the remaining confidence/completeness gates. No more unchanged RES64-C1/C2 rechecks.

**Verdict: canon not yet approved.** CS-1 is resolved as a decision (link all 33), not as an implemented fix. Final sampling and confidence disposition remain open. Return to `fixing / claude` for the concrete source-link change.
