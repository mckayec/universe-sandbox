# DR01 — Sixth of the Dusk, research checkpoint 1/2

Date: 2026-11-20. Owner remains ChatGPT; stage remains research. This is a bounded source-based web research checkpoint, not a full novella reading, content/final audit approval, or release approval. The separate Deep Research product was not invoked.

## Routing and exact repository evidence

Current-main intake at `e33cb416c870d607e07490bd3c8a3034bb0943f3`: 18/18 universe-pack statuses and 8/8 review statuses inspected. The handoff agreement is active with both sign-offs. This review was the only ChatGPT-owned item; no research-ready/Claude parallel self-audit was eligible. Preserve the agreement, other owners, and all earlier accepted corrections and runtime/release holds. TH01 remains deferred after checkpoint 2/2.

Read actual `public/atlas/packs/cosmere.js` at each immutable PR head below, rather than treating builder reports as evidence:

| PR / branch | Exact head | Pack blob |
|---|---|---|
| 24 / fix/lore-corrections | `cf25cda66e91c573c421a0f3712623db72737a3b` | `3ff0aab059fa54e00f6e2ccc7b849d4bd206d958` |
| 37 / atlas/deep-worlds | `03394c32816fcb5c95261bf6a9ea4520381a5838` | `5a74e300eaf88b2d3c81fa9bc957584cd4708e33` |
| 48 / feature/cosmere-reading-state | `61e26afb4514f4b9510f33ce9f8b0b7bbe84e964` | `05170eab9f4c10f18c98a6fac51cf825e63c8a56` |

[Machine-readable inventory](dr01-inventory-2026-11-20.json) records the selected fields, gates and source-line references. Independently recomputed Git blob SHA-1 values matched 3/3 fetched files; evaluating those exact pack strings in an isolated Node VM established inventory counts, not browser behavior or canon correctness.

| Selection | PR24 | PR37 | PR48 |
|---|---:|---:|---:|
| Drominad-group world records / all world records | 8/60 | 8/60 | 8/60 |
| First of the Sun sites inventoried / present | 6/6 | 6/6 | 6/6 |
| First of the Sun events inventoried / present | 2/2 | 2/2 | 2/2 |
| First of the Sun scene landmarks inventoried / present | 0/0 | 2/2 | 0/0 |
| All pack events, denominator only | 63 | 120 | 63 |

The eight selected world records are the star `drominad` and `firstsun` through `seventhsun` (IDs `secondsun`, `thirdsun`, `fourthsun`, `fifthsun`, `sixthsun`). Sites: `patji`, `patjiseye`, `fort`, `sori`, `homeisles`, `mainland`. Firstsun events: `e31` (key 7) and `e61` (key 12). PR37 adds `patjiseye/pool` and `fort/machine`; its e61 has `lm:pool`. Related `e62`, three selected codex entries (Dusk, Autonomy, Perpendicularities), group association, and `h-dusk` are cross-references, not additional original-novella events. The inventory does not enumerate every Cosmere reference or validate generated geometry.

Useful source lines: shared SITES_FIRSTSUN at 177 in all three files; firstsun at 546/1110/597, e31 at 727/1315/778, e61 at 762/1379/813, and Perpendicularities at 811/1441/862 (PR24/37/48 respectively).

## Edition and access boundary

[S1] explicitly identifies the solo ebook as the final novella also included in *Shadows Beneath*, whose other material includes drafts and creation commentary. Do not treat a draft as the final work. Dragonsteel sells that standalone ebook and lists ©2014 [S3]. OverDrive identifies its edition as Dragonsteel, ISBN 9781938570070, with a platform release date of October 20, 2014 [S8]; this is a catalogue date, not independent proof of every edition's publication day.

[S4] describes *Isles of the Emberdark* as an expansion of the novella. That establishes a separate work boundary, not textual identity between editions. DR01 remains the original novella; DR02 covers the later novel. The Drominad essay [S5] is a third source unit in *Arcanum Unbounded*. Legacy key 7 names the anthology bucket, not a claim that all its essays were revealed in the original novella.

Actual reading:
- [S2] complete public preview from the opening ocean encounter through the woman in the trap and her first greeting, ending at the site's continuation marker. Retrieval lines 18–134 are locators for this observation, not printed book pagination. No subsequent dialogue or ending read.
- [S8] normal public sample reader, all 7/7 displayed pages inspected: initial illustration, then narrative pages 2–7 ending during Dusk's reflection after the cutaway-vine encounter. These are responsive reader pages, not a full-work page denominator. It repeats an earlier portion of [S2], adding no later plot coverage.
- [S5] essay body paragraphs beginning with inhabited planets through the narrator's report of failed expeditions (retrieval lines 115–122), including its expressly limited knowledge. No system map image inspected.
- [S6–S7] two author FAQ answers, commentary only. [S1], [S3], [S4], and catalogue metadata in [S8] are bibliographic/promotional evidence, not the novella's missing passages.

## Narrow evidence observations

**Original opening, C-text for these points only [S2; overlapping S8]:** Dusk relies on Kokerlii's mental concealment and Sak's warnings through images of his own possible deaths. Patji is the Pantheon's largest island, with a wedge profile, cliffs and jungle. Sori is a training island; the homeisles are three weeks behind his current voyage. The original text mentions the mainland but the opened passage does not establish its population. Dusk finds a wrecked Northern Interests camp, then follows survivor tracks; the preview ends with a woman caught near his safecamp. This does not verify the later fort, machine or her account of the Ones Above. No acquisition mechanism for Aviar talents is established by the read opening.

**Separate system essay, C-text with narrator qualification [S5]:** the narrator reports three human-inhabited planets and a fourth habitable-zone planet; all four are water-dominated. First of the Sun has a perpendicularity despite no Shard residing in the system. The narrator has not personally investigated the planet and reports unsuccessful Silverlight expeditions. The essay does not here name that portal Patji's Eye or assign each inhabited society to a specific planet.

**Commentary, C-commentary only:** [S6] distinguishes absence of a resident Shard from Investiture and interference; do not simplify this to absence of magic or all Shard involvement. [S7] discusses similarities and differences between Aviar abilities and other Cosmere magic, without establishing that Aviar literally practice Allomancy. Neither FAQ establishes the original novella's earliest textual reveal.

## Eight bounded review groups

C means confirmed only within the stated evidence boundary; U means unverified, not demonstrated false. All eight groups have a disposition, not eight blanket factual approvals.

| ID | Target / current exposure | Disposition and next evidence |
|---|---|---|
| DR01-01 | Original novella, anthology essay, later novel; legacy keys 7 and 12 | C-bibliographic separation [S1, S3–S5, S8]. Keep DR01, essay and DR02 sources distinct. Do not silently mark all key-7 records as DR01-verified or migrate broad gates without researched field mappings. |
| DR01-02 | firstsun blurb; patji.desc; Dusk base codex | C-text for the narrow opening observations above; U for the Aviar acquisition sentence, global superlative implied by “greatest island,” orbital specifics and complete paragraph coverage. Preserve the supported core; obtain later original passages before certifying the rest. |
| DR01-03 | sori and homeisles; site coordinates and PR37 scene defaults | Partial C-text only as above. U for exact smallest/tamest/closest assertions, cities/reefs and precise coordinates. Travel duration is not a distance or a latitude calculation. The pack's placeholder/enlargement disclosures remain modelling disclosures, not canon validation. |
| DR01-04 | fort.desc, PR37 machine landmark, e31 | U for fort construction/location, cannons, machine placement, Vathi's identity/role and her ship observations. An opening wrecked camp is not proof that the later fort never exists. Do not issue a false correction by conflating two narrative moments. Need original post-meeting/fort passages. |
| DR01-05 | mainland.desc, books [7,12]; PR37 ice/snow scene | U edition-sensitive hold: frozen southern wasteland, ravens and no people are not verified for DR01. Search surfaced a later-edition discussion but its source page returned 403; snippets are not evidence. Compare original published passages with DR02 before replacing or sharing copy. No retcon conclusion earned here. |
| DR01-06 | drominad + six outer planet records; firstsun order/moon | Partial C-text from the separate essay [S5], not DR01. Planet sizes, rings, moon names/counts, seven-planet chart, star colour and specific society assignments require the actual published chart/other passages. Do not turn the essay's three inhabited worlds into four confirmed inhabited worlds, or independently assign them from the four-world statement. |
| DR01-07 | Perpendicularities codex; firstsun Cognitive description; group spirit Autonomy | Essay supports the generic portal concept and Firstsun's portal only [S5]; named identity, detailed Cognitive scenery, and earliest Autonomy/avatar reveal remain U for DR01. FAQ commentary [S6] is separately attributed. Cross-source association is not an original-novella spoiler gate. No rendered leak test performed. |
| DR01-08 | patjiseye, PR37 pool, e61/e62, era12, Dusk more12, Autonomy more12, h-dusk | Route to DR02 for narrative verification. [S4] gives promotional context for the later journey but cannot certify exact scene pins, worm/paste mechanics, apprenticeship, portal geography or route sequence. The second h-dusk pair is Yolen–Emberdark; do not count both pairs as Dusk's original-novella itinerary. |

No finite implementation correction is handed to Claude in this checkpoint. These holds must not be converted into an instruction to remove every unverified record without reconciling its existing source history. No application changes or tests were required or performed for this documentation-only research unit.

## Source register

All eight sources below were opened during this run on 2026-11-20. Searches served discovery only. Repeated hosting of the same narrative is not independent corroboration.

| Tag | Source and classification | Scope |
|---|---|---|
| S1 | [Solo ebook announcement](https://www.brandonsanderson.com/blogs/blog/sixth-of-the-dusk-solo-ebook-out-now), author publication note | Final-version / anthology relationship |
| S2 | [StoryBundle public book preview](https://www.storybundle.com/books/1362), published narrative excerpt | Opening reading boundary above; no full novella |
| S3 | [Dragonsteel ebook listing](https://www.dragonsteelbooks.com/products/sixth-of-the-dusk-e-book), publisher catalogue | Standalone edition and copyright; no purchase |
| S4 | [Official Cosmere standalones page, Isles section](https://www.brandonsanderson.com/pages/standalones-cosmere), author promotional description | Later-work boundary, not a DR02 audit |
| S5 | [Arcanum Unbounded: The Drominad System](https://reactormag.com/arcanum-unbounded-the-drominad-system-excerpt/), author-credited publisher excerpt, November 7, 2016 | Essay text; excludes reader comments and uninspected map |
| S6 | [Is There a Shard on First of the Sun or Not?](https://faq.brandonsanderson.com/knowledge-base/is-there-a-shard-on-first-of-the-sun-or-not/), author FAQ | Commentary; not novel text |
| S7 | [Do aviars have allomantic powers?](https://faq.brandonsanderson.com/knowledge-base/do-aviars-have-allomantic-powers/), author FAQ | Commentary; not direct earliest-reveal evidence |
| S8 | [OverDrive catalogue and its Read a sample control](https://minuteman.overdrive.com/media/2014436), catalogue plus public ebook sample | ISBN/date metadata and visually inspected 7-page sample; no borrowing or sign-in |

Access log: S1's linked legacy author excerpt at `https://www.brandonsanderson.com/sixth-of-the-dusk` returned 404. Two current-path candidate variants did not yield text. The OverDrive sample failed web extraction after redirect, but normal UI access succeeded; do not carry forward “reader unavailable” as a blanket blocker. Its short sample did not extend coverage beyond S2. The Arcanum mainland search endpoint `https://wob.coppermind.net/adv_search/?query=Mainland` returned 403; the discovered discussion remains an unverified lead. No paywall, login, or access control was bypassed.

## Known gaps and continuation

| Gap | Impact | Blocks what? |
|---|---|---|
| Original novella beyond the first encounter, including fort/machine, Vathi, Aviar origin and resolution | Central existing claims still U | Blocks full DR01 approval and new precise mappings; does not block separate bounded work |
| Original/later mainland comparison | Shared copy may conceal an edition difference | Blocks certifying that description for DR01; not proof of a defect yet |
| System chart and specific world details | Essay text does not verify visual measurements or every named body | Blocks chart-level approval; keep source and model distinctions |
| DR02 narrative and precise portal/route details | Promotional synopsis is insufficient | Blocks DR02 approval; queue it separately |
| Runtime/per-work visibility and inherited implementation holds | Static inventory does not establish displayed behavior | Existing release/runtime holds unchanged |

**Next bounded checkpoint: DR01 unit 2/2.** Seek lawful original post-meeting text for the fort/device and Aviar-origin claims, plus original mainland wording; use edition-identifiable passages, not later-novel summaries. Verify any proposed finite change against fresh PR24/37/48 heads. If the missing evidence remains unavailable at the cap, explicitly defer DR01 with these gaps and advance to DR02, or hand off only a precisely sourced correction. Do not cycle the same short previews as progress.

Coverage accounting: 8/8 selected review groups dispositioned; 6/6 Firstsun sites and 2/2 Firstsun events inventoried in each of 3/3 snapshots; 2/2 Firstsun PR37 landmarks inventoried. Two distinct published text units consulted (one novella opening and one separate essay), with duplicate hosting counted once. 0 new finite corrections; 0/1 DR01 full-work approval and 0/33 ledger full-work approvals. Earlier accepted bounded fixes, including TH01-RULES-01 at PR48 `61e26af`, remain closed within their existing limits. No merge, deployment or Mckay release approval.
