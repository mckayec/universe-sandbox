# MB02 / K2-E9-01 — bounded siege-summary precision

ChatGPT · 2026-11-17T05:17Z. Ordinary source-based web research; no separate Deep Research product used. **Finite e9 source unit complete by conservative wording disposition; full MB02 audit remains incomplete.**

## Exact reviewed records

Current PR48 `feature/cosmere-reading-state` head **9b49a52014adf65eaa3003cf4c4f257bbfffff86**, pack **bbcd03657fa3fc50b2f201dd91829c453119327d**. Preserve accepted e7/e8 and earlier corrections.

`events[id=e9]`: book 2, world scadrial, site luthadel, title “Siege of Luthadel”; no own gate/gates/lm/fx. Current text:
> Elend Venture tries to rule a free city while three armies camp outside the walls.

Fresh GitHub reads of both older branches:
- PR24 **cf25cda66e91c573c421a0f3712623db72737a3b**, pack **3ff0aab059fa54e00f6e2ccc7b849d4bd206d958**: e9 matches the PR48 record.
- PR37 **03394c32816fcb5c95261bf6a9ea4520381a5838**, pack **5a74e300eaf88b2d3c81fa9bc957584cd4708e33**: e9 is a different, earlier scene, titled “Straff approaches Luthadel”, with `lm: walls` and text “Elend tries to hold Luthadel as Straff Venture's army approaches.” Do not overwrite that branch or import its landmark. P1 below supports its narrower narrative, but this is not a full PR37 landmark audit.

All three heads re-read unchanged immediately before this handoff. Parsed all three e9 records, not a name-only comparison. PR48 Luthadel retains books:[2], until:6, existing MB01 name/desc field gates and schematic coordinates. No parent record gate is added or relaxed.

## Opened sources and evidence type

| Tag | Source and locator | Support / limit |
| --- | --- | --- |
| P1 | [Author-hosted MB02 chapter 1](https://www.brandonsanderson.com/blogs/blog/mistborn-2-chapter-one), opening Elend/Ham scene, retrieved lines 119–150; Vin transition at 159 | **(C, direct primary excerpt)** Elend is king at Luthadel, faces governing/resource pressure and an approaching hostile army, identified as Straff's; later paragraph calls the government free. One army's campfires are observed. Does not establish all three camps in one scene. |
| P2 | [Macmillan Audio MB02 page, ISBN 9781427275110](https://us.macmillan.com/books/9781427275110/thewellofascension/), Read Excerpt lines 24–49 | **(C, publisher-hosted primary excerpt)** Same chapter-1 scene independently retrieved from another host. This is the same work/passage, not an independent second textual witness. |
| M1 | Same Macmillan page, **Book Details**, lines 160–162 | **(C, official publisher synopsis, not novel text)** Explicitly describes three armies competing to conquer Luthadel and a tightening siege. Supports the count/objective and existing event title at plot-summary scope. Does not locate all camps or prove the first chapter where all three become known. |
| A1 | [MB02 chapter 19 annotation](https://www.brandonsanderson.com/blogs/blog/annotation-mistborn-2-chapter-nineteen), lines 123–125 | **(C, author commentary)** Explains revision of when the city's characters learn about the koloss army. Early-draft discussion must not be treated as final-text reveal evidence. The final version deliberately separates reader and character knowledge. |
| A2 | [MB02 chapter 42 annotation](https://www.brandonsanderson.com/blogs/blog/annotation-mistborn-2-chapter-forty-two), “Elend Goes into the Koloss Camp”, lines 130–133 | **(C, author commentary)** Names the three army leaders in context: Straff, Cett and Jastes; corroborates the three-force structure. The same page says Elend is no longer king at this later point, so it cannot establish simultaneous kingship/camping for the current sentence. |

Also opened [chapter 3 annotation](https://www.brandonsanderson.com/blogs/blog/annotation-mistborn-2-chapter-three) (lines 120–122: revision to make the army central to the proposal) and [chapter 20 annotation](https://www.brandonsanderson.com/blogs/blog/annotation-mistborn-2-chapter-twenty) (lines 120 and 139: leadership development/Assembly context). These provide author commentary only.

Access limitation: direct open of Macmillan ISBN **9781427206381** returned **403 Forbidden**. The alternative official ISBN page above opened successfully and supplied both excerpt and synopsis. Search snippets were discovery only; unverified full-text mirrors, fan summaries and draft material were not used as published scene evidence.

## Claim-level disposition

| Existing component | Evidence / disposition |
| --- | --- |
| Elend tries to govern the city | P1/P2 directly support king/government context and practical pressure. Retain, name Luthadel explicitly. |
| Free government/city | P1 line 159 / P2 line 49 directly support a free-government description. Not disproven; omitted from the replacement to avoid treating political freedom as a timeless status throughout the siege. |
| Three hostile armies | M1 directly supports the count as synopsis; A2 corroborates the three leaders as commentary. Retain at book-level plot-summary scope, not primary-scene certification. |
| All three camp outside the walls while Elend rules | P1/P2 only locate the initial army; A1/A2 expose changing knowledge and office over the narrative. Exact simultaneous camping wording **not verified**. Remove this precision; do not label it false. |

**4/4 components dispositioned; 2/4 directly supported by primary excerpt, 1/4 supported at synopsis/commentary scope, 1/4 withheld at the claimed precision.** Two hosts of the same chapter do not increase the independent-witness denominator.

## Finite correction

| ID | Severity | Location | Finding | Suggested fix |
| --- | --- | --- | --- | --- |
| K2-E9-01 | Low | PR48 public/atlas/packs/cosmere.js, events[id=e9].text | Exact simultaneous encampment is more specific than the opened evidence. The three-army plot premise is supported and should not be discarded. | Replace text only with the sentence below. |

> Elend Venture tries to govern Luthadel while three armies seek to conquer the city.

The governance clause is supported by P1/P2; the three-army objective by M1, corroborated by A2. **2/2 replacement clauses supported, 1/2 by primary passage and 1/2 by official synopsis with author-commentary corroboration.** This is high confidence for a broad book summary, not a complete scene or earliest-reveal audit. Existing siege title is supported by M1. Earliest verified work for this combined summary is MB02; only the opening governance/first-army scene has a located chapter. **No new gate authorization.**

Keep id/book/world/site/title/order and all absent/present gates as they are. No landmark, effect, journey, date, camp coordinate or army taxonomy added. No changes to PR24 or PR37. No changes to e7/e8/e6/e12/e10/e11, registry/presets or the Scadrial/Luthadel parent chain. Full-trilogy fallback restrictions remain.

A local in-memory proposal changed only this one property and restored the entire parsed pack to its original serialization after reverting it. This is a scope check, not implementation/testing of the proposed build. **0 app edits, 0 new application tests and 0 rendered candidate runs.**

## Builder return and continuation

Claude implements only K2-E9-01 on PR48, then returns:
1. Exact audited head and one-field app diff, preserving both older branch variants and prior closures.
2. Focused regression/payload checks with head/parent outcomes; actual repository validation results with failures/unavailable checks explicit.
3. Allowed/withheld e9 dossier text at 1440×900 and 390×844, legacy/All wording parity, old text absence and unchanged surrounding event checks. Do not relax parents to reveal it.
4. `implementation-review / chatgpt` before further content work.

The existing browser-smoke line-88 Save/Load failure remains open; another PR's fix is not evidence on PR48. No merge/deploy/release approval.

After implementation review, the next finite research unit is **MB02 e10's Well/power-release sentence**, under the two-checkpoint cap. Keep e11 pending and MB09 deferred. Do not restart e9 camp/reveal research unless new source access or an explicitly bounded scope requires it.

Counts: **2/5** prose units implemented/accepted (e7/e8); **3/5** have finite source dispositions including this e9 handoff; **0/5** whole events newly certified by these prose dispositions. **2/7** key-2 events mapped; **0** new mappings; **0/2** whole-parent promotions; **0/33** full-work approvals. Previous ledgers, accepted corrections and source/geometry holds remain unchanged.
