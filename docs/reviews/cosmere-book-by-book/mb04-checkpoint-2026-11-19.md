# MB04 — The Eleventh Metal: bounded source and inventory disposition

Date: 2026-11-19. Reviewer: ChatGPT. **Initial bounded unit complete; full-work audit deferred with Known gaps.** This supplements the MB04 row in [the original work ledger](audit-2026-11-06.md); it does not certify that row as fully audited. One persisted MB04 checkpoint in this run. Earlier interrupted discovery is not counted as completed evidence. No second open-ended search checkpoint is needed absent new lawful text.

## Exact revisions and reproducibility

| PR / branch | Examined head | Cosmere pack blob |
| --- | --- | --- |
| 48 / feature/cosmere-reading-state | 88dc6627423a65eb117a10663b4f91551fb3cc70 | a76929639d9cc848e2c52bcaa39622fde3cf239c |
| 24 / fix/lore-corrections | cf25cda66e91c573c421a0f3712623db72737a3b | 3ff0aab059fa54e00f6e2ccc7b849d4bd206d958 |
| 37 / atlas/deep-worlds | 03394c32816fcb5c95261bf6a9ea4520381a5838 | 5a74e300eaf88b2d3c81fa9bc957584cd4708e33 |

File in all three: `public/atlas/packs/cosmere.js`. PR48 `public/atlas/reading.js` blob: `4d9bc177294e5e33accf6f19825ef467f0bb90d4`; `public/atlas/engine.js` blob: `0bc5357a2043f3939512bc5b091eb4ffbbf1c5d0`. All three heads were fetched through GitHub this run.

[Read-only probe](mb04-inventory-probe.cjs) and [independent output](mb04-inventory-2026-11-19.json): download those five exact blobs as pack48.js, pack24.js, pack37.js, reading.js and engine.js into an input directory; run `node mb04-inventory-probe.cjs INPUT_DIR`. The probe rejects mismatched Git blob hashes before evaluating data. **5/5 hashes and 8/8 helper cases pass.** Initial scratch serialization added a newline; the hash check caught it, exact downloaded bytes were restored, and only the successful exact-byte run is reported. No application files were changed remotely.

## Inventory and overlap reconciliation

Case-insensitive whole-source scan: `eleventh|mantiz|gemmel|shezler|malatium`. A recursive string scan also covers worlds, events, codex, groups, intro, realms, galaxy and legend.

| PR | Worlds / sites / events / codex records | Matching source lines | Matching content strings |
| --- | --- | --- | --- |
| 48 | 60 / 174 / 63 / 41 | 1: bibliography only, line 259 | 0 |
| 24 | 60 / 174 / 63 / 41 | 0 | 0 |
| 37 | 60 / 175 / 120 / 57 | 0 | 0 |

**3/3 pack inventories completed at this lexical scope.** This locates no named MB04 story record; it is not a proof that every indirect Kelsier reference is absent, nor an atomic inventory of the full story. PR48 has `the-eleventh-metal`, title The Eleventh Metal, year 2011, bucket 7. Retain the bibliography: S1 supports identity/collection placement and S3 supplies contemporary 2011 announcement context. Exact first-release day and cross-edition text identity were not independently established.

Four overlap groups were compared across all three packs (12/12 group snapshots, including explicit absence):
- **Scadrial parent:** first 2, books 2/6/7/10/12 in all three. PR48 has no record-level gate; its existing blurb/short/facts gates refer to MB01. The preview does not certify its complete inherited payload.
- **e7/Hathsin:** PR48 retains the previously accepted short Survivor/scars sentence. PR24 still has its older backstory sentence. PR37 has no e7; its Hathsin site includes additional landmarks. All three retain the broader Hathsin site description. No accepted correction is reopened or imported between branches here.
- **Kelsier codex:** all three include later material in desc/more. Do not relabel this whole entry as MB04 merely because it features Kelsier.
- **Scadrial bucket-7 event:** each pack has e34, explicitly Secret History. It is MB09 overlap, not an MB04 event.

PR24/PR37 remain separately owned. This document requests no edits to them.

## Opened sources and access boundaries

Source-based web research used Firecrawl live requests (`maxAge: 0`, basic proxy), a bounded official-domain search, and direct retrieval of the map image. The separate Deep Research product was not invoked. Search snippets alone were not used to verify story claims.

| Tag | Opened source | Evidence and limitation |
| --- | --- | --- |
| S1 | [Official preview](https://www.brandonsanderson.com/blogs/blog/mistborn-the-eleventh-metal) | HTTP 200. Author-hosted primary opening, explicitly a preview, ending at the rooftop conversation and a purchase link. Not the complete story. |
| S2 | [Official online library](https://www.brandonsanderson.com/pages/brandon-sanderson-online-library) | HTTP 200. Its generic full-text heading links MB04 to S1; that heading does not enlarge the returned excerpt. |
| S3 | [November 2011 author newsletter](https://www.brandonsanderson.com/blogs/blog/brandon-sanderson-newsletter-for-november-2011) | HTTP 200. Announces the RPG with this prequel for December 15; contemporary planned publication evidence, not a shipment record. |
| S4 | [Historical full-story route](https://www.brandonsanderson.com/shardhunt-wor/the-eleventh-metal/) | HTTP 404 and Page not found. No story body obtained. The official-domain search's five results offered no new complete text. |
| S5 | [Mantiz](https://coppermind.net/wiki/Mantiz?oldid=224393) | Secondary page read via current /wiki/Mantiz, footer revision 224393. Reports a text/map conflict and later story claims. Its publishing-error explanation remains an inference. |
| S6 | [Story article](https://coppermind.net/wiki/The_Eleventh_Metal?oldid=212723) | Secondary summary read via current article, footer revision 212723. Distinguishes an anthology postscript; not a substitute for its text or later story scenes. |
| S7 | [Map file page](https://coppermind.net/wiki/File:Final_Empire_Map.jpg?oldid=156047) and [image](https://uploads.coppermind.net/Final_Empire_Map.jpg) | Metadata credits Isaac Stewart and the author's site. Independently viewed 1/1 image, 2048 × 1555; visible signature/year 2016. Web image fetch returned 403; direct public download succeeded. |
| S8 | [Official original-trilogy page](https://www.brandonsanderson.com/pages/the-mistborn-saga-the-original-trilogy) | HTTP 200. Retrieved page did not establish the exact map edition/printing or expose a matching labeled map. The wiki's anniversary-edition attribution remains secondary. |

Image SHA-256: `f0e04d49728aa84008f21523f11c8745502d7370180d3ecdc492667194dfbb7e`. Image not republished in this repository. Source availability is time-specific.

## Eight selected opening checks

(C) means support for this limited statement, not a full-story approval. All eight use S1's opening; the preview's print-edition identity remains unverified.

| ID | Narrow claim / distinction | Disposition |
| --- | --- | --- |
| MB04-P1 | Kelsier and Gemmel converse on a rooftop overlooking Mantiz. | C, primary text |
| MB04-P2 | The narrative places Mantiz in the far north of the Western Dominance. | C, text; retain map conflict |
| MB04-P3 | Kelsier considers only one ashmount nearby. | C, viewpoint report; no measured distance |
| MB04-P4 | He observes rounded, usually asymmetric buildings. | C, primary description |
| MB04-P5 | Four major keeps interrupt the skyline. | C, primary description |
| MB04-P6 | Gemmel identifies tall, slender Keep Shezler near the city center. | C, primary description |
| MB04-P7 | Gemmel is a Mistborn teaching Kelsier combat. | C, primary text |
| MB04-P8 | Mare's betrayal is discussed as belief, not independently established fact. | C, epistemic distinction |

**8/8 selected checks dispositioned; 0/1 complete-story audits.** Do not turn Gemmel's threats/promises into verified universal Allomantic mechanics. Possible future narrow copy: “In Mantiz, Gemmel presses Kelsier to approach combat as a Mistborn.” This is a research candidate only, not a build request or approval of a complete event/site.

## Map conflict and remaining story holds

S7 visibly places Mantiz near the Western/Southern Dominance boundary, below Chakath and southwest of Fadrex. This supports the existence of a conflicting depiction when compared with P2. It does **not** identify which source should govern a canonical coordinate. No projection, latitude/longitude, travel distance, equidistance measurement or authoritative erratum was verified. No Mantiz pin is authorized.

| ID | Unresolved scope | Action |
| --- | --- | --- |
| MB04-H1 | Route and actions after the preview ends | Later infiltration summary in S6 is a lead; no complete route or journey approval. |
| MB04-H2 | Shezler's captives, experiments and fight outcome | Secondary-only in this pass; do not supply approved scene/landmark copy. |
| MB04-H3 | Discovery/use of the notebook and metal knowledge | Later primary passages missing; no earliest-reveal mapping. |
| MB04-H4 | Exact interval after Kelsier gains powers | S6's precise interval not verified from primary text. |
| MB04-H5 | Ruin manipulation / anthology postscript | S6 attributes this to postscript material; isolate from story text and MB09. No new gate. |
| MB04-H6 | Map edition and authoritative resolution | One image inspected; original printing and conflict resolution still unverified. Do not call it a proven publishing error. |

**6/6 residual scopes have explicit holds, not six verified claims.** S5/S6 are one secondary project, not two independent corroborating sources. No independent two-source verification of the ten most important full-work facts is claimed.

## Parent-gate result and disposition

The probe executes the pinned reading helpers and extracts the actual engine's `firstOf`, `gateOf`, `worldChain`, `siteChain` and `evChain` definitions. It does not reimplement their semantics or launch a browser.

Scadrial's absent record gate falls back to all three bucket-2 works and remains marked unreviewed. MB04 alone and MB01 alone both fail the world chain; all bucket-2 works pass. For a clearly hypothetical child event with its own MB04 gate, MB04 alone fails the full chain, bucket 2 alone fails, and bucket 2 plus MB04 passes. The isolated own gate passes with MB04 as a control. Empty selection fails. **8/8 cases reproduced.**

This is an existing conservative parent restriction, not a newly demonstrated leak. Promoting the whole world to MB04 could expose inherited fields not checked here. Adding a child gate alone would not make an MB04-only entry reachable. Preserve the parent hold and existing mappings; do not conflate the hypothetical control with implemented content. Zero new gates, zero parent promotions, zero browser cases.

## Known gaps and continuation

| Gap | Impact | Blocks what? |
| --- | --- | --- |
| Complete lawful story text, edition comparison and postscript | Later plot, mechanics, chronology and missing-content denominator incomplete | Full MB04 canon audit and later-scene additions |
| Conflicting map/text and unidentified original map printing | No defensible precise new location | Mantiz geometry and journey certification |
| Unreviewed Scadrial parent and broader overlap payload | MB04-only reachability cannot be approved by a local event gate | Parent promotion / unrestricted MB04 entry |
| No rendered execution this run | Source-helper result only | Any claim of independent browser verification |
| Prior Save/Load smoke limitation and separately owned PR37 holds | Unchanged by this documentation work | Their existing technical/release gates |

The finite inventory/source disposition is saved now. Defer broader MB04 rather than repeatedly searching the same preview. Reopen only with new lawful primary evidence or a separately scoped parent review. No builder correction is currently justified, so no artificial fixing/Claude handoff is created.

Next owned unit, after a fresh priority/head check: **MB06 (Shadows of Self), initial bounded claim inventory and lawful excerpt disposition**. Preserve accepted MB05/MB10 and prior key-2/SEL03/CBR closures. Still **0/33 full-work approvals**. Main status inventory this run: **18/18 pack and 8/8 review statuses inspected**, no other owned audit or eligible stale research-ready/Claude self-audit. Agreement remains active with both existing sign-offs and is unchanged. No code/PR-branch edit, merge, deployment or Mckay release approval.
