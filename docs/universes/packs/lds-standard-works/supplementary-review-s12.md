# Supplementary checkpoint 12: parables, labels and genealogy payload

Reviewed **517a24afd70610485e6da6ce158660cf0ee0e31d** against **684cec17a7fea64f4f82f160bd469b16485a4d3f**, 2026-11-01. Prior source/correction handoff: **df275a8516b2eb9c0b042d48d8523f05a8a24a24**. Accepted SD witness remains `9cc874c09a3686119ca6b4c17c7e16f214fd7ab6`. Current repository instructions are unchanged. Main's checkpoint-11 status lags this build; Claude's active lock, code and fixing/claude ownership remain untouched.

**Verdict: S11-C1/C2 close; the missing genealogy reference payload is implemented. One narrow genealogy notation clarification (S12-C1) remains before accepting that display.** This is a bounded exact-head content review, not full supplementary or release acceptance.

## Checked scope and outcomes

All **six new children and four changed prior cards** inspected against the supplied source evidence and safeguards. Four parable children conform; Luke's genealogy conforms; Matthew's names and predicates are present but its branch notation needs S12-C1. The existing 13 parable children remain unchanged, in the correct combined source order with the four additions.

- **S11-C1 / SD0240 closes:** Matthew 21, Mark 12, Luke 8 and Luke 20 are present with the exact requested passage locators, `2/nt`, no geometry/date. Mark's killing-before-casting-out sequence stays distinct from Luke's casting-out-before-killing sequence. The parent's overly broad range statement is replaced with the supplied neutral sentence. This closes the finite previously identified parable-reference hold, not a fresh exhaustive taxonomy of every Gospel parable.
- **S11-C2 closes:** Psalm 29 now labels bison/buffalo and Psalm 92 buffalo/bison; Psalm 22 retains wild ox. Copy and URLs are unchanged.
- Optional Mark 2 source improvement applied: 1 Samuel 21 is an additional source for the already stated comparison, not an OT-only card exposing later content.
- **SD0238 missing-reference-payload requirement is implemented:** both source-order CSVs match the S11 handoff byte for byte. The actual generated Matthew chain retains all 40 main-line occurrences through Joseph; Luke retains all 77 occurrences, including the opening and ending outside its arrow run. Repeated names are not deduplicated. Matthew's side relationships, changed verse 16 predicate, three-fourteens statement and no-added-names rule survive. Luke's approximate age, “as was supposed” qualifier, text-specific spellings and qualified God endpoint survive. No Mary-line harmonization, merged tree or geography is introduced. The display ambiguity below must still be fixed.
- Earlier S3-C1 children remain unchanged. The original seven-family finding covered SD0213, SD0214, SD0226, SD0236, SD0238, SD0240 and SD0270; the receipt's phrase “all four families” is a counting typo, not evidence of missing imports or permission to skip prior gates. Describe the seven IDs or omit the aggregate.

[Six-child comparison](supplementary-review-s12/child-comparison.csv), [four changed cards](supplementary-review-s12/changed-cards.json), [independent probe](supplementary-review-s12/probe.cjs), [accounting/genealogy validation](supplementary-review-s12/accounting.py).

## S12-C1 — distinguish Matthew's main chain from sibling annotations

Location: `supplementary-build/copy_nt.py`, `_MATT_NOTE`, `_matt_chain`, generated `NTC-genealogies-matt-1`.

The sentence “each name ‘begat’ the next” precedes a chain containing **“Judas and his brethren → Phares and Zara of Thamar → Esrom”**. Although all supplied names occur, the rule does not tell readers which name continues the chain. It can imply Zara is Esrom's parent or that sibling groups are chain nodes. [Matthew 1:2–3](https://www.churchofjesuschrist.org/study/scriptures/nt/matt/1?lang=eng) specifically continues from Phares. This is a notation ambiguity, not a claim that the data CSV is wrong or that inline annotations are prohibited.

Use the same 40-name CSV and replace the chain preface with:

**“Each arrow connects the main-line names using Matthew’s ‘begat’ wording; parentheses give side branches or qualifications, not additional chain links. This follows the text’s wording, without claiming that no generation is omitted:”**

Render these seven annotations parenthetically:

| Main-line occurrence | Replacement display |
|---|---|
| Judas, verse 2 | Judas (his brethren are also named) |
| Phares, verse 3 | Phares (Zara is also named; both are of Thamar) |
| Booz, verse 5 | Booz (of Rachab) |
| Obed, verse 5 | Obed (of Ruth) |
| David, verse 6 | David (the king) |
| Solomon, verse 6 | Solomon (of her that had been the wife of Urias) |
| Jechonias, verse 11 | Jechonias (his brethren are also named, about the carrying away to Babylon) |

Keep the verse 16 changed-predicate sentence and explicit prohibition on a Joseph-begat-Jesus edge, verse 17 groups, all source spellings, repeated occurrences and `2/nt` gate. Acceptance: the visible sequence unambiguously continues **Phares → Esrom** and does not turn Zara or unnamed brethren into intervening ancestors. Exact original name extraction still passes. No new graph UI or scope decision is needed.

## Three builder questions answered

1. Inline side notes are acceptable in this plain reference payload, provided the main-chain continuation is explicit (S12-C1). They need not be separate interactive nodes. A test that strips annotations back to the CSV demonstrates name order but cannot alone prove the unstripped display is unambiguous.
2. Opposite arrow directions are acceptable because the accounts have separate, explicit local legends: Matthew's main-line “begat” direction and Luke's “son of” direction. Do not reuse either as a global unlabeled graph convention. No new notation preference from Mckay is needed.
3. Paraphrasing Matthew's three groups of fourteen is accurate. The implementation retains the stated groups, does not insert names to force a count, and does not substitute its 40-name chain count for the text's grouping claim.

## Counts and reproducibility

No new SD row imports: **790 imported / 481 pending**. There are **72 children**, seven standalone prose cards and one consolidated prose view. **1,351 mapping rows; 870 imported mappings; 858 supplementary cards** after eleven SD consolidations and one prose consolidation. Whole pack **1,061 cards / 1,028 unique keyed cards**. Six added cards, four changed cards, **1,051 prior cards unchanged**. All 1,271 SD declarations, hashes, source locations and state values reconcile.

Both genealogy CSVs are copied exactly from S11. Independent parsing of the actual generated chains verifies all main-line occurrences in order, both opening/ending qualifications and repeated-name preservation. The test expressly does not treat that as resolution of S12-C1's human-readable ambiguity. Seventeen parable children and two genealogy children appear directly after their parents in mapping/display order.

The generator has no new algorithm change; `copy_nt.py` newly loads the two CSV files. Isolated reproduction includes these dependencies and recreates the pack and mapping byte for byte. No engine/layer, date, geometry, route or scene change. All other pack data match the baseline after removing the six additions and restoring four changed cards.

Locally observed: **33/33 targeted tests**, **250 actual helper gate combinations**, nine pre-NT all-layer exclusions, unique-key/nonspatial/source checks, child ordering and full remaining-pack regression. The three standing coverage/source-witness/reference validators pass. [Probe result](supplementary-review-s12/probe-result.json), [accounting result](supplementary-review-s12/accounting-result.json). These are integrity/content checks, not full-canon certification.

## Evidence and remaining acceptance

This turn reuses the actual official passages inspected in S11: Matthew 1:1–17; Luke 3:23–38; Matthew 21:28–46; Mark 12:1–12; Luke 8:4–15; Luke 20:9–19. The source-label correction reuses the S10 retained Psalm notes. No new primary retrieval or broad source sweep is claimed. The [S11 genealogy handoff](supplementary-review-s11/genealogy-handoff.md) and source CSVs remain preserved and are now implemented reference inputs. There is no source-access blocker for this tranche.

Builder reports pnpm check 107/107, distribution/pack checks and 13 pages × two viewports. The requested head includes no new rendered captures; older checkpoint-11 images do not show the new genealogy cards. No local browser, server, DOM workaround or full pnpm check was run. Same-head native-select, keyboard, real-GPU and final technical/rendered acceptance remain open. Implementation CI 41324880041 was running during drafting; terminal outcomes are recorded in the main handoff.

Claude can apply S12-C1 and correct the receipt count while proceeding to **SC35–45's 417 D&C rows, then SC46–54**, within the 481 pending SD rows. Do not confuse completion of this finite missing-payload finding with complete atlas source/identity/vision integration or release readiness. Q03 schematic is already approved; separate archaeology/LiDAR artifacts do not block current Earth corrections. No status/ownership/lock edit, PR approval, merge, deployment or release.
