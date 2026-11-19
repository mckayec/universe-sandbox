# MB08 — authorized-preview and inventory checkpoint

ChatGPT, 2026-11-19. **Research incomplete; checkpoint 1.** Work unit: Allomancer Jak and the Pits of Eltania, Episodes 28 through 30. No implementation request, full-story approval, new gate or parent promotion.

## Exact input inventory

Read the actual three `public/atlas/packs/cosmere.js` files through GitHub and independently hashed the identical local inputs before evaluating them in isolated Node VM contexts:

| Branch | Exact head | Verified blob |
| --- | --- | --- |
| PR48 / feature/cosmere-reading-state | 52534d0975af39e620e05a43c2f4f05dc6b4b1fc | 0fd66c7cca0085872e8f8a3d2154e4010356b9e6 |
| PR24 / fix/lore-corrections | cf25cda66e91c573c421a0f3712623db72737a3b | 3ff0aab059fa54e00f6e2ccc7b849d4bd206d958 |
| PR37 / atlas/deep-worlds | 03394c32816fcb5c95261bf6a9ea4520381a5838 | 5a74e300eaf88b2d3c81fa9bc957584cd4708e33 |

[Read-only probe](mb08-inventory-probe.cjs) and [machine-readable output](mb08-inventory-2026-11-19.json) preserve the selection and paths. Reproduce with Node and the three pinned files in PR48/24/37 order; wrong blobs fail closed.

**3/3 pack hashes verified; 3/3 lexical inventories completed.** Searching evaluated string values for Jak, Eltania or Handerwym gives two hits in PR48, both in its single bibliography row at `spoilers.works[13]` (source line 260), and zero hits in PR24/PR37. The row's id/title are not two story records. No named story event/site/codex entry or other string reference to this work ID was found by this scan. This establishes a named-content coverage gap in these packs, not proof that every possible paraphrase was detected.

The separate koloss/Roughs search returns **32/32 listed string hits**: PR48 8, PR24 9, PR37 15. These are overlap leads, not 32 MB08 claims. For example, Tathingdwen and the old-trilogy battles must not acquire MB08 gates merely because they mention koloss. The PR48 and older-branch era fields differ because of earlier accepted work; do not restore old fields while filling this gap.

## Source register and access

Ordinary source-based web research using Firecrawl, not the separate Deep Research product. All substantive sources below were opened on 2026-11-19. Metadata, author commentary, narrative and secondary synopsis are kept separate.

| Tag | Source | Result and limit |
| --- | --- | --- |
| J-A | [Author announcement](https://www.brandonsanderson.com/blogs/blog/mistborn-adventure-game-alloy-of-law-supplement-new-allomancer-jak-story-giveaway) | HTTP 200. Says the author wrote the story for the Alloy of Law RPG supplement, following Jak's novel appearance, with Handerwym annotations. Commentary/bibliography, not the episode body. |
| J-C | [Official collection page](https://www.brandonsanderson.com/pages/collections-cosmere) | HTTP 200. Names Episodes 28 through 30 within Arcanum Unbounded; no episode narrative supplied. |
| J-P | [Macmillan collection listing, ISBN 9781250390141](https://us.macmillan.com/books/9781250390141/arcanumunboundedthecosmerecollection/) | HTTP 200. Collection contents independently listed by publisher; retrieved page supplied no MB08 story sample. Not a text comparison with the RPG edition. |
| J-R | [Archived original publisher listing](https://web.archive.org/web/20150818075708/http://www.crafty-games.com:80/content/buy-alloy-law?utm_source=brandonsanderson&utm_medium=blog&utm_content=textlink&utm_campaign=cfg07004) | HTTP 200. Archived Crafty Games product identifies release date 2014-08-07 and ISBN 978-1-940094-91-5 for the supplement. Supports 2014 bibliography year in conjunction with J-A; not all RPG setting/rules as novel canon. |
| J-T | [Archived author-hosted preview, capture 2015-08-17 10:19:54 UTC](https://web.archive.org/web/20150817101954/http://brandonsanderson.com/allomancer-jak-and-the-pits-of-eltania/) | HTTP 200. Read opening narrative through the missing tin-pouch predicament and all seven editorial footnotes. Explicitly directs readers to the supplement for the rest. Authorized historical sample, not complete Episodes 28–30 or an anthology collation. |
| J-W | [Coppermind work page, retrieved revision 200047](https://coppermind.net/wiki/Allomancer_Jak_and_the_Pits_of_Eltania?oldid=200047) | HTTP 200. Secondary routing supplied the old author URL. Later plot, postscript and word-count statements remain secondary leads; none became certified story facts here. |

Access traps resolved: J-A's current preview link and `https://brandonsanderson.com/allomancer-jak-and-the-pits-of-eltania` both redirect to the collection overview. A guessed migrated `/blogs/blog/allomancer-jak-and-the-pits-of-eltania` route returns HTTP 404. These failures do not mean the historical author preview never existed: J-T recovers it. The [archived publisher downloads page](https://web.archive.org/web/20150822142933/http://www.crafty-games.com/content/mistborn-adventure-game-downloads) returned HTTP 200 but no MB08 continuation was located in its listed previews. General searches also found copies with unestablished authorization; they were not opened or used. No login, purchase or restricted-text access was attempted.

## What the opened text establishes

Confidence C below applies to the text's presentation, not omniscient truth of everything Jak asserts.

- **C, J-T opening:** Jak narrates waking in a canyon-wall cavern in the Roughs, worries about Elizandra, and lacks his expected tin supply. No precise position, canyon name or scene-wide map is established.
- **C, J-T framing:** the piece is presented as Jak's account with Handerwym's editorial notes. Treat those voices separately, including when the editor confirms a claim.

All **7/7 visible notes** were read:

| Note | Narrow disposition |
| --- | --- |
| 1 | Editor confirms the reported challenge outcome and refers to earlier episodes. That is in-world corroboration, not separately opened earlier text. |
| 2 | Editor identifies an inconsistency in Jak's recollection. Do not resolve it by silently choosing Jak's latest version. |
| 3 | Editor questions the imprisonment assumption. Awakening in a cavern is not proof of capture. |
| 4 | Editor challenges Jak's sensational depiction of koloss. Do not turn that depiction into neutral atlas prose. |
| 5 | Editor gives his own whereabouts, contradicting Jak's assumption of concern. |
| 6 | Editor refers to an earlier explanation of the koloss–Terris relationship; that earlier episode was not read. |
| 7 | Editor challenges Jak's claim of abstinence. |

These are annotation-awareness checks, not seven independent witnesses. Historical preview metadata/category labels do not override its explicit partial ending. **0/3 complete episodes read; 0/1 full story audited.**

## Five finite dispositions and remaining unit

| Unit | Disposition |
| --- | --- |
| Existing MB08 bibliography identity/year | C, bibliography: official title/episode scope and 2014 supplement release support retaining the existing PR48 row. No bibliography change requested. |
| Named-content omission | C, repository observation limited to the probe. Record as a coverage gap; do not invent an event merely to make the selector appear populated. |
| Opening narrator/editor distinction | C at J-T passage scope. Any future entry must attribute contested narration and account for the notes. |
| Later plot, koloss society, Elizandra and treasure mechanics | U at primary-text scope. Secondary synopsis does not certify them. |
| Geography, complete journey, anthology revisions and work/ancestor gates | U. No coordinates, new story/event gate, parent promotion or full-work approval. |

**5/5 finite units dispositioned: 3 bounded supported observations, 2 held scopes.** The first three are bibliography/repository/presentation results, not three fully verified atlas records. No application or rendered test was needed for this read-only inventory; none is claimed.

Checkpoint 2 must be bounded: seek one lawful continuation of Episodes 28–30 with all remaining notes and edition provenance, using an authorized edition preview or a user-provided lawful text if already available. Do not repeat the known redirect/404 routes or replace MB08 with Jak appearances in The Alloy of Law or The Lost Metal. If no adequate continuation is accessible, defer MB08 with these Known gaps at the cap and move to the next uncompleted scoped unit after checking previous MB09/MB10 packets. Full-story certification also needs a complete claim/journey/missing-content inventory and anthology-versus-RPG comparison.

Remain `research / chatgpt`. MB07 stays deferred under [its second checkpoint](mb07-final-checkpoint-2026-11-19.md). MB09's prior omission/implementation closure and other accepted scopes remain intact. **0/33 full-work approvals and 0/2 Scadrial parent promotions.** No Mckay decision or release approval is requested.
