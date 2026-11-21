# CA01 — checkpoint 2/2: destination uncertainty and bounded handoff

2026-11-21 UTC. Research lead: ChatGPT. Run: chatgpt-20261121T042807Z-ca01-7f4b98.

## Outcome and limits

CA01 research has reached its **2/2 checkpoint cap**. Defer the incomplete full-work audit; do not certify it or start a third CA01 research checkpoint without materially new evidence. Hand Claude **2 Medium removal operations in one finite destination correction unit, CA01-DESTINATION-01**, scoped to PR48. This narrows existing SP05/SP12; it is not a second claim that those findings are wholly resolved.

Preserve accepted CA01-WEATHER-01 at PR48 0ad0c14957a840a69700e6d26df47102882a65d3 and [its independent implementation review](implementation-review-0ad0c14.md). After this finite implementation and independent review, resume **AU01: Arcanum Unbounded system essays/maps**, distinct from its story/excerpt units. Full-work approvals remain **0/33**.

Research used ordinary source-based web search and opened pages through Firecrawl. No separate Deep Research product was invoked. No full published novel or supplied private ebook was reopened. Retrieved page contents are not equivalent to complete sequential reading. No application code, PR branch, merge, deployment, release approval, or rendered test was performed.

## Exact repository evidence

Current main intake inspected **18/18 pack statuses and 8/8 review statuses**. Only this review was ChatGPT-owned; there was no eligible research-ready/claude self-audit. Other owner decisions and WIP holds are unchanged.

Actual `public/atlas/packs/cosmere.js` was fetched and parsed at **3/3** current heads:

| PR / branch | Exact head | Pack blob |
|---|---|---|
|24 / fix/lore-corrections|cf25cda66e91c573c421a0f3712623db72737a3b|3ff0aab059fa54e00f6e2ccc7b849d4bd206d958|
|37 / atlas/deep-worlds|03394c32816fcb5c95261bf6a9ea4520381a5838|5a74e300eaf88b2d3c81fa9bc957584cd4708e33|
|48 / feature/cosmere-reading-state|0ad0c14957a840a69700e6d26df47102882a65d3|ab5db8c8b53ee989391d6436d49afc8183bdccbf|

The [checkpoint1 inventory](ca01-inventory-2026-11-21.json) remains historical at PR48 b202db0. This pass reread the current Canticle world/sites, Nomad codex and Canticle-touching links. PR24 uses an unspecified next world and an attributed identity caveat. PR37/48 retain the definite UTol clause. PR48 additionally has `galaxy.links[id=h-nomad].path = ["canticle","komashi"]`; PR24/37 do not. Canticle-touching link counts are **2/2/3**, seven snapshot instances, not seven independently verified journeys. No link is canon-certified by this research pass.

PR48 `public/atlas/reading.js`, `tests/atlas-cosmere-registry.test.ts` and `docs/atlas/PACK_FORMAT.md` were also fetched for scope/gate context. Inspection is not execution. The current registry contains separate Sunlit, Yumi and Wind and Truth IDs; the Nomad identity detail remains numerical key12. This report does not silently convert that field or all key12 facts.

## Opened evidence and provenance

Seven page retrievals succeeded; targeted relevant sections were read. Six are substantive source pages and one is bibliographic routing. These are **7/7 successful retrievals**, not seven fully read works. Ten targeted discovery searches found no usable later published Sunlit chapter/epilogue text in this run. Search non-discovery is not proof such access does not exist.

| Tag | Opened source and anchor | What it establishes; limits |
|---|---|---|
|C2-A|[Author's Secret Project Four first look](https://www.brandonsanderson.com/blogs/blog/first-look-at-secret-project-four-hint-its-stormlight-adjacent), introduction and closing inspirations commentary|**Author commentary (C):** identifies Nomad with Sigzil and says the book was intended to precede Stormlight5. This is a prerelease reveal containing the first ten chapters, not a fresh reading of the published identity scene or permission to expose all later backstory. Discarded early worldbuilding concepts are not published canon.|
|C2-B|[YouTube Spoiler Stream6 transcript](https://wob.coppermind.net/events/526-youtube-spoiler-stream-6/), UTol significance and audience questions|**Fan-transcribed author commentary:** the answers discuss possible future use and decline a fuller answer. Neither selected answer confirms Nomad's destination. Audio was not independently checked; this is not epilogue text.|
|C2-C|[Canticle-tagged author Q&A collection](https://wob.coppermind.net/adv_search/?tags=canticle), core/purpose and Reliquary questions|**Fan-transcribed author commentary:** the author describes a deliberately built planetary structure but withholds major core details. The Reliquary answer distinguishes the people whose Investiture becomes sunhearts from entering that Reliquary. Do not mistake a questioner's proposed mechanics, a paraphrased answer or a RAFO for a verified full model. No altitude threshold or complete Auxiliary terminal-state account is established here. Audio not checked.|
|C2-D|[Coppermind UTol](https://coppermind.net/wiki/UTol), introductory Nomad paragraph and Relationship with Komashi|**Secondary evidence:** explicitly qualifies the destination identification as likely and treats UTol and Komashi as distinct worlds. This independently checks the wiki's wording, not the novel's ending. It supports removing certainty; it does not promote the theory to canon. Its cited epilogue was not reopened.|
|C2-E|[Author chapter eight](https://www.brandonsanderson.com/blogs/blog/the-sunlit-man-chapter-eight), Scadrian key and sunset discussion|**Targeted primary excerpt (C):** Nomad interprets the key and storm. Supports the already-accepted weather distinction, not a confirmed destination or comprehensive laboratory provenance. No new weather correction claimed.|
|C2-F|[Author chapter seven](https://www.brandonsanderson.com/blogs/blog/the-sunlit-man-chapter-seven), weather/travel explanation and arrival at Beacon|**Targeted primary excerpt (C):** depicted flight, city engines and joining the city's structure support treating mobile-city positions as illustrative. Nomad's meteorology and cultural hypotheses remain character inferences; no latitude/longitude or universal atmospheric model is provided.|
|C2-G|[Coppermind book page](https://coppermind.net/wiki/The_Sunlit_Man), preview/structure references|Bibliographic routing only. Retrieved references did not supply the later published passages needed for this audit. Not evidence for an ending, edition equivalence or a complete reading.|

The prior [supplied-edition audit](secret-projects-primary-audit-2026-11-09.md), blob e45576853f5b16c24626f1fac2cb0fef5e3f452a, was reread as **attributed prior research**. Its S10 reports an unnamed ocean world with Sho Del; its S05/S06/S08 report the altitude, naming and sacrifice scenes. These are useful precise scene leads, not freshly reopened primary evidence. ISBN9781938570414 remains the prior edition identifier; equivalence to the web preview was not verified.

## CA01-DESTINATION-01 — exact finite implementation request

Target PR48 only, `public/atlas/packs/cosmere.js`. PR24/37 are comparison snapshots; no changes requested there. The disposition is **unsupported certainty: remove**, not proof that a future source could never identify the destination.

| Operation | Severity / existing finding | Exact selector at audited head | Requested change and evidence |
|---|---|---|---|
|D1|Medium / SP05|line676; `worlds[id=canticle].eras[12].blurb`|Replace the unique ending `, then Skips on to UTol.` with `.`. Retain the preceding Cinder King clause and all other text unchanged for this unit. C2-D qualifies the identification; C2-B does not confirm it; prior S10 is attributed. This omits the destination claim instead of adding an ending description that was not freshly read.|
|D2|Medium / SP12 destination-link component|line964; `galaxy.links[id=h-nomad]`|Remove this entire link object with `path:["canticle","komashi"]`. Do not retarget it to UTol, a guessed point, or a newly invented unnamed-world node. The inspected evidence supports no confirmed Canticle–Komashi journey; even the qualified UTol theory is not a Komashi destination. Keep h-scad-can and h-nomad2 unchanged and explicitly unaudited by this unit.|

Do not alter registry IDs, gate policy, eras keys, codex identity/backstory, other galaxy links, world coordinates, renderer or accepted weather/KO01/TH01/Kenton work. Removing an unsupported route is not certification of the routes left behind. Remaining text in the edited era paragraph is outside this narrow approval.

## Proposal-only validation

An in-memory copy of the exact PR48 pack was changed using D1/D2 and parsed:
1. D1 target occurs exactly once; D2 ID occurs exactly once (**2/2 unique targets**).
2. Resulting parsed era has no UTol clause; h-nomad is absent (**2/2 intended removals**).
3. Reinserting the original link at its original index and restoring the era string reproduces the entire original parsed pack (**1/1 whole-data equality check**).
4. Galaxy links change **10 to9**; all other parsed content, including the accepted weather sentence, is unchanged.

These checks validate the proposal, **not an implementation**. **0 implementation test runs;0 rendered cases** in this research unit. Builder must check dependent tests, selectors, labels and routes rather than assuming deleting the data object is sufficient.

## Remaining dispositions at the cap

| Existing finding / group | Current disposition | Blocks D1/D2? |
|---|---|---|
|SP04 identity and SP03 work gates|C2-A freshly corroborates the identity and intended reading sequence at commentary level. Published scene/earliest gate reconciliation and Sunlit-only runtime behavior remain open. Do not move all key12 facts wholesale.|No; blocks identity/gate approval.|
|SP05 ending|D1 removes the unsupported certainty. Unnamed ocean-world/Sho Del wording remains prior S10 evidence only; no new final-destination assertion is authorized.|No; blocks full ending certification.|
|SP06 sunlight-height/core|Accepted sunset correction preserved. Later high-altitude passage not retrieved; C2-C cannot substitute for it. Blanket sunlight wording remains a known unresolved claim.|No; blocks environmental approval.|
|SP07 moving-city geometry|C2-F supports mobility; current Union/Beacon fixed markers remain illustrative/unverified. No map/coordinate validation or renderer qualification was executed.|No; blocks geographic approval.|
|SP11 Auxiliary and Dawnshard|Prior S04/S08 remain attributed; terminal sacrifice, highspren identity and residual Dawnshard mechanics were not freshly established from later published text. Do not add a recharge/resurrection claim.|No; blocks character/magic approval.|
|SP12 graph semantics|D2 removes one unsupported destination route. Other physical travel, remote projection, provenance and cross-book edges still require separate evidence and gates.|No; blocks full graph approval.|

**6/6 remaining finding groups have dispositions;0/6 are wholly certified.** The earlier seven-group inventory is not replaced by this different denominator. Full novel reading, full atomic-claim inventory, missing-content/easter-egg coverage, edition/art/map comparison, independent corroboration and complete chronology remain deferred. Existing SA07/S20/WAT06 and KO01/LU01/DR01/DR02 holds stay intact.

## Builder return and continuation

Claude: reconcile the latest PR48 head, apply only D1/D2 and record exact parent/new head, actual diff and a per-operation receipt. Run required repository checks plus focused route and Canticle display checks, including All, legacy11/12, bucket11, Sunlit-only and excluded-Sunlit selections. Confirm no dangling h-nomad references and no replacement unsupported destination. Check desktop/mobile rendered output; retain every failed or unavailable check explicitly, including inherited smoke failures. Unrelated state differences are not authorized by this unit.

Save implementation evidence in this review folder first, then set implementation-review/owner chatgpt. ChatGPT must inspect actual head/files/diff and distinguish independently executed checks from builder reports. Acceptance of the finite patch will not approve CA01, the PR, or release. After that review, set research/owner chatgpt for AU01 unit1/2; retain CA01's deferred gaps in this file. Do not spend another scheduled research unit repeating unchanged CA01 source searches.
