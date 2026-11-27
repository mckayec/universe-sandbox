# NA01 / Warbreaker — first bounded source checkpoint

Date: 2026-11-19. Reviewer: ChatGPT. **Retain the selected prose; no implementation request from this unit.** This is an excerpt-based audit of e13, the Court of Gods description and the PR37 palace description. It is not a complete novel reading, full-record certification or spoiler-gate approval.

## Revision and scope

Current-main priority scan read 18/18 universe-pack statuses and 8/8 review statuses. This review was the only ChatGPT-owned item; no eligible stale parallel self-audit was found. Agreement remains active with both sign-offs. Run lock was acquired and verified before substantive work.

All three actual PR files were fetched through authenticated GitHub. File: `public/atlas/packs/cosmere.js`.

| PR / branch | Audited head | Pack blob |
| --- | --- | --- |
| 48 / feature/cosmere-reading-state | 52534d0975af39e620e05a43c2f4f05dc6b4b1fc | 0fd66c7cca0085872e8f8a3d2154e4010356b9e6 |
| 24 / fix/lore-corrections | cf25cda66e91c573c421a0f3712623db72737a3b | 3ff0aab059fa54e00f6e2ccc7b849d4bd206d958 |
| 37 / atlas/deep-worlds | 03394c32816fcb5c95261bf6a9ea4520381a5838 | 5a74e300eaf88b2d3c81fa9bc957584cd4708e33 |

Read-only Node VM extraction independently recomputed each Git blob hash: **3/3 match**. Examined e13 and courtofgods on each branch (**6/6 selected record slots**) and the PR37 palace landmark (**1/1 selected landmark**). The other five Court landmarks were visible in the extracted scene but are not included in this unit's supported-claim count.

PR24 and PR48 e13 match: their sentence covers the youngest princess, marriage mission and later change in her understanding of the God King. PR37 instead contains the already-narrowed arrival sentence and `lm: "palace"`. All three Court descriptions match. PR37's palace description is already the narrower black/stepped/far-end/arrival wording.

## Edition and opened sources

Ordinary source-based web search/open was used, not the separate Deep Research product. Search snippets were discovery only.

- **W0 — [Author's rights/downloads page](https://www.brandonsanderson.com/blogs/blog/warbreaker-rights-and-downloads), Versions section.** It distinguishes the pre-copyedit 6.1 draft from the Tor first-edition file. Use the latter for this audit.
- **W1 — [Tor hardcover first edition PDF, author-hosted](https://cdn.shopify.com/s/files/1/0886/8082/5106/files/Warbreaker_hardcover_1st_ed.pdf?v=1723759719).** Copyright page identifies the June 2009 first edition and ISBN 978-0-7653-2030-8. Opened selected passages, not the whole novel.
- **W2 — [Author-hosted chapter 1](https://www.brandonsanderson.com/blogs/blog/warbreaker-chapter-one), opening family paragraph.**
- **W3 — [Author-hosted chapter 4](https://www.brandonsanderson.com/blogs/blog/warbreaker-chapter-four), arrival and final Court/palace paragraphs.**
- **W4 — [Author-hosted chapter 21](https://www.brandonsanderson.com/blogs/blog/warbreaker-chapter-twenty-one), opening palace descent.** Corroborates the stepped construction; not a separate independent witness.

W2–W4 are supplemental author-hosted text. No assertion that every online chapter matches every printed edition. No annotation or abandoned draft supplies a canon claim here. PDF text extraction splits some words (including “youngest”); a failed literal search is not evidence of absence.

## Six bounded claim dispositions

Page locators below use the PDF viewer's zero-based page index, which in these passages coincides with the printed page number. The numbered chapter and scene are the durable locators.

| ID / field | Direct-text support and disposition |
| --- | --- |
| NA01-01 / e13, youngest princess | **C.** W1 ch.1 p.25; W2 opening: Siri is the youngest of Dedelin's four living children. Retain. |
| NA01-02 / e13, marriage mission and Court/palace attachment | **C.** W1 ch.4 pp.55–57; W3 closing supports mission/arrival. The priest treats her as already married: do not invent a ceremony. Retain both variants. |
| NA01-03 / PR24/48 e13, changed understanding | **C, synthesis.** W1 ch.24 pp.250–253: Siri revises her fearful interpretation of Susebron. Retain as a relationship arc, not an arrival-instant revelation. |
| NA01-04 / courtofgods.desc, southern walled seaside plateau | **C.** W1 ch.4 p.56; W3 arrival route supports these relative relationships. No numerical coordinates are established. |
| NA01-05 / courtofgods.desc, ring of Returned palaces | **C.** W1 p.82, Lightsong's wedding-night fireworks scene supports the ring and Returned context, not modeled angles/distances. |
| NA01-06 / PR37 palace.desc, black stepped building at far end and Siri's arrival | **C.** W1 ch.4 pp.56–57; W3 closing; W4 opening. Retain current prose and the prior deletion. |

**6/6 selected claim groups supported**, with the interpretation/chronology qualifications above. These groups are not the denominator for all Warbreaker facts. **0/3 complete logical records certified** (event, parent site, landmark): runtime gating, complete parent chain and geometry were not audited. **0/1 novels read end to end; 0/33 full-work audits approved.**

## Reconciliation with prior work

Read the [Nalthis supplement crosswalk](../deep-worlds/cosmere-supplement-crosswalk.csv), blob `9248b7ca93b3343b81a9033d2c1fce489641c8ca`, particularly CS11 and CS18. Its historical PR37 target was `60176e78f1272816a0869a5abe8018e884d704f7`; it is not the present implementation.

- CS18's earlier youngest/later-expectation evidence gaps now have selected published-text support (NA01-01/03). This does not require restoring PR37's broader old sentence; its arrival-only text is supported as it stands.
- CS11's narrowed palace description is present at current PR37. Its removed gentle/silent characterization is not restored.
- Preserve accepted CB02/CB03/CB04 and subsequent event dispositions; this checkpoint neither reopens nor newly certifies them.
- Do not edit the separately owned deep-worlds status/history or infer that its D10 scene-label/gate hold is resolved.
- MB08/MB09/MB10 deferrals and all accepted PR48 implementations remain unchanged.

## Known gaps and continuation

No complete Nalthis inventory, all-journey/ending pass, independent corroboration, full-book read, coordinate validation or rendered spoiler test is claimed. Parent-world Endowment, system-chart, Cognitive Realm and perpendicularity material needs its own sources and reveal boundaries; the selected novel passages do not certify those mixed payloads. The PR37 Court's other five landmarks remain outside this unit.

This is **NA01 checkpoint 1** under the bounded research rule. Keep `research / owner chatgpt`. Next bounded unit: inventory the remaining Nalthis event/site prose on the same three freshly reconciled heads, prioritize a finite concrete correction with published-text support, and explicitly dispose of residual parent/gate/geometry gaps. At the second checkpoint, hand off any sourced finite correction and defer incomplete broader NA01 coverage rather than repeatedly extending it. No code change or gate promotion is requested from this checkpoint.

No application/PR-branch edit, merge, deploy, technical sign-off or Mckay release approval.
