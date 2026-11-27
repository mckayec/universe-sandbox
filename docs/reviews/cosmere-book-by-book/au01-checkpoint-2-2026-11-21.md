# AU01 checkpoint 2 — chart reconciliation and Threnodite provenance handoff

Date: 2026-11-21 UTC. Reviewer: ChatGPT. Research unit **2/2**. Source-based web research; no separate Deep Research product invoked.

**AU01-THRENODY-01: one Medium, conservative correction affecting two fields on PR48.** Remove Mercy's participation and destroyed-planets clauses from the anthology-level base text. The evidence distinguishes a later-work epigraph fragment from an unverified later-work chapter locator; this is not a claim that those details are false in the wider canon. Full AU01 is **deferred at the checkpoint cap**, not approved.

## Exact inputs and coverage

All three actual `public/atlas/packs/cosmere.js` files were fetched and parsed:

| PR / branch | Head | Pack blob |
|---|---|---|
|24 / fix/lore-corrections|cf25cda66e91c573c421a0f3712623db72737a3b|3ff0aab059fa54e00f6e2ccc7b849d4bd206d958|
|37 / atlas/deep-worlds|03394c32816fcb5c95261bf6a9ea4520381a5838|5a74e300eaf88b2d3c81fa9bc957584cd4708e33|
|48 / feature/cosmere-reading-state|9e7c4b7b7d418f675143b017f78f1bd02bc5728e|777cee0693d5f9443766e720d8248dae6cf07a2c|

PR48 engine blob `0bc5357a2043f3939512bc5b091eb4ffbbf1c5d0`; reading helper `4d9bc177294e5e33accf6f19825ef467f0bb90d4`. The two target fields match across all three branches (**6/6 field observations**). This corroborates repository state, not canon.

Intake read **18/18 pack statuses and 8/8 review statuses** on main. This review was the sole ChatGPT-owned unit; no research-ready/Claude stale parallel self-audit was eligible. The agreement remained active with both sign-offs. Existing WIP over the agreed limit means no new queued pack was opened.

Coverage carried from [unit 1](au01-checkpoint-1-2026-11-21.md): **42 selected world records out of 60**, across six systems, with a surface inventory rather than a complete atomic-claim inventory. This unit adds **4/4 remaining system-chart images** and **1/1 constellation image** visually inspected: cumulative **6/6 system-chart images**, but still only **1/6 complete system essays** opened (Drominad, prior unit). **0/5 remaining complete essays** newly opened. Image inspection does not certify compound world records. **0/33 full-work audits approved.**

Accepted AU01-ORDER-01 at PR48 9e7c4b7 remains closed at its previously reviewed finite scope. Preserve all CA01, TH01, SA06 and other accepted corrections. CA01 remains deferred at 2/2.

## Opened evidence and access limits

Evidence labels follow the initial audit: **C** = opened evidence supporting the narrow statement, with its type specified; **L** = locator/lead not independently verified; **U** = unresolved. C is not a full-work pass.

### Visual sources — newly inspected reproductions

All five images were downloaded and visually inspected, not merely read through filenames or alt text. The corresponding Coppermind file pages attribute the artwork to Isaac Stewart and Brandon Sanderson's site; these are secondary-hosted reproductions, not independent physical-edition authentication. No copyrighted image is copied into the repository. Byte hashes are in [the evidence record](au01-evidence-2-2026-11-21.json).

| Source | Narrow observations | Limits / disposition |
|---|---|---|
|[M1 Selish chart](https://uploads.coppermind.net/Starchart_sel_color.jpg)|Donne/Doo, Sel/Seol and Oem, asteroid belt, Ky/Kii, Ralen/Raa, comet belt, unnamed dwarf. Four satellite marks at Ky; five and a ring at Ralen.|Supports depicted order/names and drawn features. It does not label Ky a gas giant, verify Mashe's etymology, establish climate or provide measured sizes. Hold those prose claims.|
|[M2 Scadrian chart](https://uploads.coppermind.net/Starchart_scadrial_color.jpg)|Old Orbit/Old Calendar and New Orbit/New Calendar for Scadrial; Aagal Nod blue with six satellite marks, Aagal Uch red with five and a ring; comet belt and two unnamed outer dwarfs.|The two orbits are not two planets. No independent verification here of Nelazan translations, exact radii, largest-planet language, or the cause/timing of orbital changes.|
|[M3 Taldain chart](https://uploads.coppermind.net/Starchart_taldain_color.jpg)|Two unnamed stars, smaller one with a labeled particulate ring; planet's Dayside faces the larger star and Darkside the smaller; Nizh Da labeled.|Does not print AisDa/Ridos names, seven-orbit pulses, stellar classes or a Lagrange-point proof. TA04 astronomy holds remain.|
|[M4 Threnodite chart](https://uploads.coppermind.net/Starchart_threnody_color.jpg)|Monody, Elegy with Coronach, Threnody, then larger-drawn outer Purity; orange-red sun.|No battle history or destroyed planets shown. Symbol sizes/distances are not measurements; absent satellite marks do not independently prove exhaustive moon totals.|
|[M5 constellation chart](https://uploads.coppermind.net/Cosmere_constellation_map.jpg)|Labels include Threnody, Taldain, Scadrial, Roshar, Sel, Nalthis, First of the Sun and The Scar.|Illustrative constellation connections are not metric three-dimensional coordinates. No observer location is labeled. Nalthis's inclusion does not create a seventh system essay.|

**5/5 new visual-source rows have dispositions, not five new full-essay approvals.** The four new system charts concern 20 of the 42 previously selected world records; the other 22 were associated with the prior Drominad/Rosharan images. Atlas scale, colours and painterly appearance remain illustrative unless separately sourced.

### Text and provenance

- **T1, C-secondary / L-chapter:** [Threnodite system](https://coppermind.net/wiki/Threnodite_system), retrieved in this run (page revision link oldid 214676). The Mercy statement cites *Rhythm of War*, chapter 27 epigraph; the destroyed-planets statement cites *Wind and Truth*, chapter 113. The battle/wound and four-planets/one-moon discussion separately cites the AU Threnodite essay. These distinct citations must not be flattened into anthology evidence. The WaT chapter itself was **not opened**.
- **T2, C-text fragment reproduced by secondary commentary:** [Rhythm of War reread, chapter 27](https://reactormag.com/rhythm-of-war-reread-chapter-twenty-seven/), successfully opened. Its reproduced epigraph places Mercy in the clash with Ambition and Odium. This supports attribution to that published epigraph; it is not a full chapter/novel reading or an exhaustive proof of first publication.
- **T3, C-secondary:** [Arcanum Unbounded spoiler review](https://reactormag.com/arcanum-unbounded-the-cosmere-collection-spoiler-review/), Alice Arneson, 2016-11-25. The article describes the Odium/Ambition conflict, mortal wound and distortion affecting Threnody, and distinguishes the clash from Ambition's final Splintering. Its article text corroborates the retained narrow core; its silence cannot prove the absence of a claim from the full essay. Reader comments were excluded.
- **T4, C-secondary:** [Taldain system](https://coppermind.net/wiki/Taldain_system), revision link oldid 214644. Footnotes separate the AU essay from later omnibus/Ars Arcanum material. Seven-moon-orbit pulses are attributed to *White Sand* Ars Arcanum, not established by M3. Exact earliest-name/classification attribution remains unresolved.
- **T5, C-author-commentary transcript:** [2016 San Francisco signing answer](https://wob.coppermind.net/entry/2765), opened via its event page. The reported Lagrangian-point answer is hesitant, with concern about the scientific explanation. It is commentary, not a published essay or an independently validated physical model; audio was not heard.
- **T6, C-secondary only:** [Summary:Arcanum Unbounded](https://coppermind.net/wiki/Summary:Arcanum_Unbounded) was opened for the six essay summaries. It helps locate topics but does not raise full primary-essay coverage above 1/6.

Access work did not substitute catalogue metadata for reading. [Hachette](https://www.orionbooks.co.uk/titles/brandon-sanderson/arcanum-unbounded/9781473218062/), [Macmillan](https://us.macmillan.com/books/9780765391162/arcanumunboundedthecosmerecollection/) and [Apple Books](https://books.apple.com/us/book/arcanum-unbounded-the-cosmere-collection/id1128453315) yielded descriptive material, not the five complete missing essays. The official Google Play Books [UK preview](https://www.youtube.com/watch?v=G0yVIc6c3DQ) reported country unavailability; the [US preview](https://www.youtube.com/watch?v=wWOn10xOifg) exposed metadata, while the transcript service returned no tracks/segments. Neither audio was heard.

[KCLS's public sample link](https://kcls.overdrive.com/media/2678640) resolved by HTTP to an OverDrive reader shell, not readable essay text. Firecrawl retrieval failed; a local Chromium launch then failed with `socket() failed: Operation not permitted` before navigation. No login, purchase, restriction bypass, or sample-text reading is claimed. The earlier OWWL listing had no available copy. These attempts add **0 primary essays**, and unchanged access failures need not be repeated next run.

## Selected parent/codex dispositions

| Question | Disposition |
|---|---|
|threnosun.blurb: Mercy / destroyed planets|Remove the two unsupported-at-AU clauses under AU01-THRENODY-01. T2 supplies a later epigraph fragment; T1 supplies an unverified later destruction locator.|
|Shards / Ambition.desc: same two clauses|Same correction. Keep the mortal-wound wording, rather than relocating final destruction into this system. Retained wording is not fully re-certified.|
|ridos.blurb: seven lunar orbits and Investiture pulses|Hold under TA04/AU01. M3 cannot verify it; T4 points to omnibus material, itself grouped in bucket7. Do not invent an AU01-only mapping or apply the Threnody removal to this different evidence case.|
|taldain.blurb: Lagrange point / stellar names|T5 is qualified commentary; M3 does not establish the model or names. Hold full-field approval and earliest-work mapping.|
|mashe.blurb / Ky/Ralen classifications|Map labels do not establish etymology or gas composition. Hold; a drawing is insufficient to declare the current prose scientifically or canonically false.|
|scadsun.blurb: history of moving Scadrial|M2 supports two labeled orbits, not the actors, chronology or earliest revealing novels. Preserve earlier focused findings; hold cross-work field approval.|

**6/6 selected questions have dispositions; 0/6 compound question groups earn complete canon approval.** Broad Shard identities, Adonalsium/Yolen, Autonomy avatars, Perpendicularities, Investiture, Shadesmar, geography, all eras/sites/events and missing-content checks remain outside full verification. The Drominad narrator's limited knowledge remains qualified; no all-era contradiction is inferred from that essay alone.

## AU01-THRENODY-01 — finite implementation request

**Medium. Repository observation + T1/T2/T3 provenance; conservative removal, not exhaustive earliest-publication certification.**

PR48 base world `threnosun` has `first:7`, `books:[7]`; Shards/Ambition has `first:7`. Neither target field has a narrowing work gate. Actual selectors show their base text in legacy7 and the complete bucket7 selection, without requiring *Rhythm of War* or *Wind and Truth*. Thus later/unverified clauses are being carried by the anthology-level base fields. The bounded fix is deletion from those base strings, not relocation into an unverified later gate.

1. `worlds[id=threnosun].blurb` (head line 546), replace exactly:

> A red star. In the empty space of this system the Shards Ambition and Odium fought; Ambition was mortally wounded. The twisted Investiture on Threnody is at least partly a scar of that battle.

2. `codex[id=shards].list[name=Ambition].desc` (head line 830), replace exactly:

> A Shard mortally wounded in a battle with Odium in the empty space of the Threnodite system. The battle still twists the Investiture on Threnody.

The evidence JSON preserves both current and proposed values. **Two fields / four clause removals**. Only PR48 is assigned; PR24/37 are reconciliation references, not reassigned builder work. Do not add a new gate, later-era paragraph, world, moon, event, route, or speculative fact. Preserve the other parsed data, including accepted Rosharan ordinals and Canticle removals.

## Proposal characterization

[Reproducible proposal probe](au01threnody-proposal-probe.mjs), run with Node against separately fetched inputs. It edits an in-memory copy only, extracts actual engine reading/world selectors and codex rendering code, and uses a minimal HTML sink/event stub rather than a browser. The harness fixes the physical realm and default category filters; it is not a full application boot.

- **5/5 input Git blob hashes** verified.
- **6/6 branch-field observations** match; **2/2 unique replacement targets** found.
- Restoring the two proposed fields reproduces the entire original parsed pack: **1/1 full-data equality check**.
- **16/16 paired field-state comparisons** pass: two fields in eight states, before and after the proposal. Expected strings/removal of the targeted clauses are checked in every visible case.
- **0 implementation test runs, 0 rendered browser cases**. The probe does not verify interaction, screenshots, layout, all unrelated selectors or Claude's eventual patch.

| State | Both target fields eligible, before and proposal |
|---|---|
|All; legacy7; complete bucket7; all registry works|Yes (4 states)|
|legacy6; empty; AU01 only; bucket7 without AU01|No (4 states)|

The inherited whole-bucket fallback explains why AU01-only is hidden. Preserve it for this correction; passing these cases does not approve the broader mapping design or certify every bucket7 detail.

## Builder return, gaps and next unit

Claude: re-read current PR48 and this folder's status. Implement only the two replacements; record actual parent/new head, two-field diff, required repository validations, and focused parent/head results. Independently exercise both the Threnody sun dossier and Ambition codex on desktop/mobile for the states above. Preserve gates and prior closures; report inherited failures and unavailable validations explicitly. Save implementation evidence in this folder before status `implementation-review / owner chatgpt`.

ChatGPT must then inspect the actual head/diff/files and independently review the finite change. No implementation acceptance, merge, deploy or Mckay release approval is granted here. Inherited Save/Load and surface-render gaps are not cleared by this research.

| Known gap | Impact | Blocks this finite removal? |
|---|---|---|
|Five complete essays unopened; exact editions not authenticated|No full AU01 certification; some retained prose rests on partial/secondary support|No: removal reduces unsupported claims without adding lore|
|WaT113 not opened; exhaustive earliest-publication search incomplete|No approval to reintroduce destroyed planets or assign a new later gate|No|
|Chart colour/size/coordinates and exhaustive moon claims|No measured astrophysics or complete object approval|No|
|Atomic fields, all codex/eras/sites/events, cross-era contradictions and missing content|Full inventory and canon audit incomplete|No|
|No rendered checks in this run; inherited application failures|Implementation/release validation remains necessary|Yes for any claim of independently verified rendered implementation; not for handing off the proposal|

After independent acceptance, **leave full AU01 deferred at 2/2 and proceed to FD01 research unit1/2**, the next work-ledger unit, reconciling the existing Fires of December primary checkpoint and publication/edition boundary before new research. Do not reopen the accepted ordinal check or keep repeating the same blocked essay searches. No Mckay decision is requested for the narrow correction. **0/33 full-work approvals remains unchanged.**
