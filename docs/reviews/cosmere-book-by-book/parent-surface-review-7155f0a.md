# Scadrian parent surfaces: checkpoint and CBR-04 handoff

ChatGPT · 2026-11-10 UTC · run `chatgpt-20261110T201500Z-r20-48b9`

**Changes requested: one Medium infrastructure finding, CBR-04. Parent canon research remains incomplete.** The earlier [narrow implementation acceptance](implementation-review-7155f0a.md) stands: three text replacements and four field gates were implemented correctly. This follow-up discovers a separate, pre-existing realm-property gate bypass. It does not reopen CBR-01–03 or authorize a new canon mapping.

## Exact source and independent reproduction

PR48 head: `7155f0acbcfa351c73fb990366b4e0bd163ea3cf`.

| Input | Git blob |
|---|---|
| `public/atlas/packs/cosmere.js` | `317cb58c4996c64f3acee32e7c9db00e95512552` |
| `public/atlas/reading.js` | `4d9bc177294e5e33accf6f19825ef467f0bb90d4` |
| `public/atlas/engine.js` | `6ecfb467f2577c2ffe57ee93ba5c06ee85979f52` |

Run the committed [selector reproduction](reviewer-realms-7155f0a.mjs) from a checkout of that exact head. [Raw output and input manifest](reviewer-realms-output-7155f0a.json) records **8/12 passing expectations and 4/12 failures**, exit 1. It evaluates the actual reading helper, actual pack and extracted engine functions in Node; it is not an independent browser/rendering test. The manifest is calculated from the executed bytes.

### CBR-04 — world-specific realm card and appearance ignore field gates (Medium)

The accepted [revision-3 design](cos-bb-001-design-proposal.md), sections 2/2a and surface inventory, requires field restrictions to intersect record/ancestor restrictions, with a present-invalid field hidden. At the audited head, `realmCard(w)` (engine lines 1354–1357; dossier call at 1159) reads `w.realms[S.realm]` directly. `realmLook(w)` (1330–1332) directly merges `w.realms.cognitive` into the global look; `applyRealmToPlanet()` then copies that result to material uniforms. Neither selector consults `fOk(w,"realms",worldChain(w))`.

The fixture keeps Scadrial visible by selecting the original Mistborn trilogy and The Way of Kings, so the global Cognitive Realm is open. It injects a field gate into the actual world object **only in memory**:

| Fixture | Field evaluator | Card / appearance expected | Observed | Expectations |
|---|---|---|---|---|
| unread valid `gates.realms` | false | omit world-specific values | both use world-specific values | 0/2 pass |
| present-invalid `gates.realms = {}` | false | omit world-specific values | both use world-specific values | 0/2 pass |
| satisfied field gate | true | retain world-specific values | retained | 2/2 pass |
| absent field gate, visible parent | true | inherit visible parent | retained | 2/2 pass |
| legacy book 4 | true | preserve legacy result | retained | 2/2 pass |
| All | true | preserve All result | retained | 2/2 pass |

The unread fixture uses `mistborn-secret-history`; the satisfied fixture uses `the-way-of-kings`. **These IDs exercise gate evaluation, not proposed earliest-work assignments.** No new gate was added to the application pack. Browser exploitability or final material appearance was not independently rendered here.

Separately, the **unmodified** pack with those four selected works returns Scadrial's specific Cognitive name, blurb and mist palette even though `reach(7)` is false and its matching global subastral has `first:7`. That is a reproducible difference between existing thresholds, not proof that 7 is the correct canon threshold. The current world has no `gates.realms`; fixing the field-gate infrastructure alone does not research or resolve that data inconsistency.

### Finite return for Claude

1. Make both world-specific realm consumers honor the existing `realms` field gate intersected with the world/ancestor chain in per-work modes. A denied/invalid field must not contribute its name, prose, style or colors. Use only an otherwise allowed generic/neutral fallback; do not substitute another protected world-specific property.
2. Preserve absent-gate inheritance and legacy/All behavior. Do not invent a new nested schema or canon threshold, promote a parent, or change the accepted copy/event mappings.
3. Add regression coverage for these six fixture states on both consumers, including restrictive-state changes while a world is already open. Confirm the card and material values after downgrade; rerun the relevant reading/engine/registry tests and required project checks.
4. Supply targeted rendered evidence at 1440×900 and 390×844 with raw success/failure output and exact head. Keep synthetic gate cases visibly labeled as fixtures. Include an allowed-to-denied transition, not only initial hidden state. A failed or unavailable validation stays explicit.
5. Return this review to `implementation-review / chatgpt` with exact diff/head and evidence. Existing CBR closures remain closed unless new evidence contradicts them. No release approval follows from this return.

## Branch reconciliation

Fresh PR metadata and exact-head pack fetches confirmed:

| PR | Head | Pack blob |
|---|---|---|
| 24 | `cf25cda66e91c573c421a0f3712623db72737a3b` | `3ff0aab059fa54e00f6e2ccc7b849d4bd206d958` |
| 37 | `03394c32816fcb5c95261bf6a9ea4520381a5838` | `5a74e300eaf88b2d3c81fa9bc957584cd4708e33` |
| 48 | `7155f0acbcfa351c73fb990366b4e0bd163ea3cf` | `317cb58c4996c64f3acee32e7c9db00e95512552` |

Scadrial's `name,status,star,facts,realms,distText,eras,gfx` match PR48 on both older branches: **16/16 property comparisons**. The global Cognitive first value (4) and Scadrial subastral first value (7) also match. This does not assert whole-pack/engine equivalence. PR37's separate Luthadel scene/landmarks and previous corrections must not be overwritten or imported as part of CBR-04. Reconcile heads again before implementation.

## Source-based parent research checkpoint

Ordinary web search and opened source pages/images were used; the separate Deep Research product was not invoked. No complete novel, Scadrian system essay or fully readable Scadrian chart was obtained. **No new parent field or earliest-work mapping is approved in this continuation.**

| Evidence / stable locator | What was actually available | Disposition |
|---|---|---|
| [Author MB03 chapter 76 annotation](https://www.brandonsanderson.com/blogs/blog/annotation-mistborn-3-chapter-seventy-six), “The North Pole,” retrieved lines 115–121 | Author commentary names Scadrial and explains the changed orbit, ash cooling, capital/Well relationship and magnetic/geographic-pole distinction. It distinguishes a discarded original plan. | Useful corroboration, not direct novel text, an earliest-name threshold, or numeric atlas latitude/orbit validation. Keep geometry/name/order holds. |
| [Author MB03 chapter 82 annotation](https://www.brandonsanderson.com/blogs/blog/annotation-mistborn-3-chapter-eighty-two), “Sazed Ascendant,” lines 115–125 | Commentary discusses Sazed's ascension and remaking the world using knowledge retained in metalminds. | Does not certify either complete later-era record, industrial-era detail or gfx implementation. |
| [Official star-chart print set](https://www.dragonsteelbooks.com/products/star-chart-prints-set), product description and images | Credits Isaac Stewart and identifies seven prints. Viewed the [second composite](https://www.dragonsteelbooks.com/cdn/shop/files/Artboard1.png?v=1699916551), 1080×1080. The Scadrian sheet is partly hidden behind other sheets; complete labels are unavailable. Image SHA-256: `ca5315207bc4e342df7aaa3bbc71b3dd985dcf567f3538d2621b9956288c5633`. | Provenance and partial visual inspection only. No complete orbital order, moon inventory, star name or numerical geometry certification. No copyrighted image copied into this review folder. |
| [Author introduction to Arcanum Unbounded](https://www.brandonsanderson.com/blogs/blog/introducing-arcanum-unbounded), collection contents; [official collection page](https://www.brandonsanderson.com/pages/collections-cosmere), Arcanum Unbounded section | Identifies star charts and system essays in the collection, distinct from its individual stories. Collection HTML exposed an art-gallery placeholder; its gallery script returned 403. | Keep the system-essay/art boundary distinct from MB01 and Secret History. An art-gallery placeholder is not retrieved art. |
| [Reactor excerpt announcement](https://reactormag.com/find-out-more-about-mistborn-in-new-excerpt-from-brandon-sandersons-arcanum-unbounded/), Nov. 14, 2016, paragraphs linking Google Play | Secondary announcement identifies an excerpt including the Scadrian system introduction. Its [linked Google Play excerpt](https://play.google.com/books/article/nng7wfdyae/arcanum-unbounded-excerpt) returned 404. | Discovery lead only; the full primary essay was not read. Do not reconstruct it from the announcement. |
| [Publisher Secret History description](https://academy.hachettelearning.com/titles/brandon-sanderson/mistborn-secret-history/9781473225046/), synopsis/spoiler warning | Identifies a companion to the original trilogy with trilogy spoilers and a lesser Bands of Mourning warning. | Bibliographic/spoiler context, not evidence for the specific Cognitive blurb or its first appearance. |
| [Hero of Ages Q&A archive](https://wob.coppermind.net/events/243-hero-of-ages-qa-time-wasters-guide/) and [Scadrial chart file lead](https://coppermind.net/wiki/File:Starchart_scadrial_color.jpg) | Search snippets supplied leads; the Q&A page returned 403, alternate mirrors timed out/failed, and the chart file page could not be accessed. | Neither underlying Q&A nor original chart verified. The moon claim remains held; snippets do not close it. |

### Known gaps and next bounded unit after the correction return

Keep the prior accounting: **4/10 listed parent fields narrowed; 6/10 held; 0/2 parent records promoted; 2/7 PR48 key-2 events explicitly mapped; 0/33 full-work approvals.** The broader PR37 ledger remains 8/148 narrow field candidates with 140 holds, and 2/65 narrow event-record candidates with 63 record holds. Nested realm content is an additional explicit hold outside that ten-field denominator. Existing unreviewed whole-bucket fallback is not a safety/canon certification.

Next research should obtain an identifiable, fully readable Scadrian system essay/chart and a lawful readable primary passage for the Cognitive descriptions. Record edition/work and exact locator before proposing a boundary. Do not repeat the failed Google Play/gallery routes without new access evidence. If access remains unavailable, prepare a finite omission or qualified-model proposal for each unresolved surface; do not silently promote the world or relabel current thresholds as verified. Then examine both later era records and the procedural gfx/map transforms against the appropriate sources. Luthadel's numeric coordinates, lifetime boundary, PR37 scene and landmarks remain separate holds.

This checkpoint preserves completed evidence while handing the concrete renderer defect to Claude. No Mckay decision is required for CBR-04. No site/PR-branch edit, merge, deploy, completed research certification or release approval.
