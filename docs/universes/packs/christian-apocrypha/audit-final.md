# Final Apocrypha audit — correction recheck, not release approval

2026-10-29 · ChatGPT. **Reviewed implementation PR #38 at `1e256ceb3ac797ab998c6b7af0edb41d31c8da6f`**, parent `8ae91333461bfeb989b570857a0aba321eaa34df`. Research baseline `4dc7f444246ab0c5afffe90ee3fb1838b92493aa`; builder fix handoff read on main at `7edcc8c046e6e8b7b726774f0f9683e709c7082e`.

## Result first

**18 of 19 APB findings are verified resolved at this head** (16 pack corrections/dispositions and two build-report corrections). APB-004 remains open: no finished real-GPU surface evidence or final technical approval. All20 deterministic random sample entries were freshly compared with their selected source passages:19 pass without a finding; one Low precision correction, APF-001 below. No new High/Medium defect from the sample.

**Canon: not yet approved.** APQ-004 inherited research disagreement is now resolved in principle in favor of Babylon's Tobit/slot1 mention, but the corrected research and builder implementation must be aligned and rechecked at a new exact head before canon signoff. No new location, event pin or route is authorized. Q03 is dispositioned for paraphrase-only implementation; an exhaustive quotation inventory is explicitly not claimed. **Technical: not approved by this report**; that signoff belongs to Claude and APB-004 remains a blocker. Do not move to ready-for-owner or merge/publish PR #38.

## Finding dispositions

| Findings | Exact-head result | Evidence |
|---|---|---|
| APB-001,002,015,016,017 | Resolved, including all duplicate event/codex occurrences | `audit-final-nt.md`: fresh selected Peter/Paul/Thomas witnesses; distinct people, original/copy reversal, Mnesara-only healing, restrained nurse relationship, all three Ephesus witnesses. |
| APB-003,018 | Resolved | `audit-final-lead.md`: ME01 unpinned and tomb city uncertainty explicit; disputed parentage correctly belongs to Jesus. Fresh Greek Dormition opening and Acts Pilate2. |
| APB-007,008,009,010,011,019 | Resolved | `audit-final-dc.md`: dates, siege, ending, chronology, Egypt boundary. All95 changed labels independently joined to coverage80NABRE/15RV; all147 DC labels checked, not merely presence-tested. |
| APB-012,013,014 | Resolved | `audit-final-xot.md`: fresh4Baruch9, Ascension10 and Jubilees44. Correct sequence, sixth-heaven exception and departure dates. |
| APB-005,006 | Reporting corrections resolved | Main build-report gives706/77, retracts CI test:browser claim and reports timeout rather than success. The unchanged PR38 description still contains the older CI sentence; builder should synchronize it to the corrected report. |
| APB-004 | Open, technical blocker | Builder explicitly reports unfinished new captures and real-GPU requirement. No successful final texture evidence asserted. |

## New final-sample finding and inherited research correction

| ID | Severity | Location at reviewed SHA | Finding | Evidence/source | Suggested fix |
|---|---|---|---|---|---|
| APF-001 | Low | pack line451, `m2-03` | Rider and two young men are described as striking Heliodorus; selected text specifies the horse's forefeet and youths' scourging. | [RV2Maccabees3:25–26](https://ebible.org/eng-rv/2MA03.htm), freshly read. | “A horse bearing a heavenly rider strikes Heliodorus, and two young men scourge him.” Precision improvement, not a new High/Medium blocker. |
| APQ-004 | Medium consistency gate | Babylon badge lines264–270; integration `dc-ref-babylon`; derived index | Dossier and earliest-reference contract support slot1/Tobit14:4; registry/build start5. Builder appropriately awaited research reconciliation. | [NABRE Tobit14:4](https://bible.usccb.org/bible/tobit/14); exact research dossier, integration-contract and geography-reuse. See `audit-final-dc.md`. | Align research reference/card/mention edge/index to1, retain later sources at own gates. Builder adds1 to existing neutral Babylon badge; never pin Tobit14 there or expose Baruch narrative at1. Recheck new head. |

## Final sample selection and evidence

Pool:327 events,706 codex base entries,77 later additions =1110 items. Stable keys are `event:<id>`, `codex:<section-id>:<zero-based-index>:<name>`, and that codex key plus `:more:<zero-based-index>`. Seed is literal `1e256ceb3ac797ab998c6b7af0edb41d31c8da6f:AUDIT_CHECKLIST-4`. Sort by ascending SHA256 hex of UTF-8 `seed + '|' + key`; select first20 without replacement. Fixed before source checks, no substitutions. This deterministic pseudorandom hash-rank makes the exact sample reproducible; it is not a claim of statistical population certification. `audit-final-sample.json` records selected objects and keys; companion source ledgers give passage-level outcomes.

Selected keys in rank order:
1. `codex:places:103:Modin`
2. `codex:places:140:Bethbasi`
3. `codex:places:85:Chola`
4. `codex:places:228:The waters of Dan`
5. `codex:places:313:The royal tomb (Acts of Thomas)`
6. `event:PME13`
7. `event:m2-03` — APF-001
8. `codex:places:11:Egypt:more:5`
9. `codex:journeys:11:The embassy of Eupolemus and Jason`
10. `codex:visions:14:The firmament`
11. `event:m2-14`
12. `codex:places:30:Esdraelon`
13. `codex:people:149:Iphidamia and Stratocles`
14. `event:wis-09`
15. `codex:people:78:Edna daughter of Danel`
16. `codex:places:47:Lud`
17. `codex:places:137:Lydia`
18. `event:sir-25`
19. `codex:places:109:Bethsura:more:0`
20. `event:m1-05`

## Independent execution and scope

- Exact-head targeted tests **16/16 pass** using Node24.22.1 and `node --experimental-strip-types --test tests/atlas-apocrypha.test.ts` in an isolated fixture. This is not a locally executed whole-project/browser suite.
- Remote exact-head [workflow40826668635](https://github.com/mckayec/universe-sandbox/actions/runs/40826668635) succeeded: format/build/unit/dist/standalone-page checks; deploy skipped. Separate test:browser is not run by that workflow; builder reports simulator save/load timeout under softwareGL.
- Fix diff is one commit affecting only pack and targeted test. Counts unchanged327/706/77; five anchors unchanged, ME01 pin removed. Independent later-addition checks find valid later gates/badges. No engine change in this correction.
- Inherited confidence restrictions remain. Eleven excluded Meqabyan U rows remain excluded with coverage notices; no new proposed L anchor is accepted. Five shared modern city markers retain geography disclaimers and provenance. Textual/OCR/editorial uncertainty is not promoted to historical certainty. See lead record for registry confidence inventory. This final sample and correction recheck do not retrospectively assert a fresh reading of every original body or a complete original-language collation.
- New JPEG retrieval via connected GitHub methods failed UTF-8 decoding, so no claim of independently viewing new screenshots. Builder explicitly reports them unfinished; the prior five inspected images also failed the crisp-surface gate. No access restriction bypassed.

## Builder research-question dispositions

Q01: retain five approved anchors; additional coordinates deferred. Q02: standalone accepted as content architecture, crosslinks deferred to approved targets, no LDS changes. Claude explicitly accepts these in builder resolutions.

Q03: original research-review question asks quotation classification so paraphrase is not wrongly treated as drift, with builder paraphrasing regardless. That build-audit purpose is resolved: judge fidelity of meaning, not verbatim identity. **Exhaustive registry quotation inventory remains deferred and unverified**, not a rights certification; no direct reuse of research copy authorized by this disposition. Claude accepted the existing conservative addendum. This does not itself create a separate canon blocker for the current paraphrase-only build.

APQ-004: research-side earliest mention decision above supplied for builder implementation. Still requires aligned artifact changes and exact-head recheck. Suggested next handoff: fixing/claude for this bounded correction and APF-001 disposition, while APB-004 remains the technical gate. This draft does not mutate main status, merge any PR or authorize deployment.

## 2026-10-30 continuation

[APQ-004 alignment and ownership handoff](apq004-alignment.md) now aligns the research CSVs and index on this documentation branch. Earlier statements that CSV corrections are not included are superseded. Builder badge alignment and exact-new-head recheck remain open;18/19APB result, APF-001 and APB-004 technical gate are unchanged. No final approval.
