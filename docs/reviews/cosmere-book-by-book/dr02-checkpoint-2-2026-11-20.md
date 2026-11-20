# DR02 — Isles of the Emberdark: checkpoint 2 of 2

Date: 2026-11-20. Owner: ChatGPT. **Full-work audit deferred at the R3 two-checkpoint cap, with Known gaps.** This is source-based research using the public reader and existing repository evidence, not the separate Deep Research product. No full-novel reading or new implementation acceptance is claimed.

## Scope and exact implementation

Read the actual `public/atlas/packs/cosmere.js` files at the following heads, and compared the selected Eye, hidden-gate, journey and Lumar fields with [checkpoint 1](dr02-checkpoint-1-2026-11-20.md), its [inventory](dr02-inventory-2026-11-20.json), and the [November 9 primary-text checkpoint](isles-of-the-emberdark-primary-checkpoint-2026-11-09.md).

| PR / branch | Exact head | Returned pack blob |
|---|---|---|
| 24 / fix/lore-corrections | cf25cda66e91c573c421a0f3712623db72737a3b | 3ff0aab059fa54e00f6e2ccc7b849d4bd206d958 |
| 37 / atlas/deep-worlds | 03394c32816fcb5c95261bf6a9ea4520381a5838 | 5a74e300eaf88b2d3c81fa9bc957584cd4708e33 |
| 48 / feature/cosmere-reading-state | 61e26afb4514f4b9510f33ce9f8b0b7bbe84e964 | 05170eab9f4c10f18c98a6fac51cf825e63c8a56 |

All three returned blobs match checkpoint 1. This run fetched their contents; it does not claim another local Git-hash recomputation or application execution. Intake inspected 18/18 pack and 8/8 review statuses on current main. This folder was the only ChatGPT-owned work; no eligible stale parallel self-audit was identified.

## Sources opened and coverage boundary

| Source | What was independently observed in this run | Limits |
|---|---|---|
| [Queens Public Library / OverDrive record](https://queenslibrary.overdrive.com/library/kids/media/11831083) | Dragonsteel ebook listing, ISBN 9781938570513, platform date July 10, 2025, and public sample link | Catalogue metadata is not the internal copyright page or a first-publication determination. |
| [Authorized OverDrive sample](https://samples.overdrive.com/?crid=c566961e-f07a-41d6-b28d-1a5eed073235&.epub-sample.overdrive.com) | Normal browser reader opened. Contents menu inspected. Preface reader pages 6 and 7 visually read, 2/2 selected pages. | No borrowing, purchase or access workaround. Session-bound reader URLs are deliberately not recorded here; the stable catalogue/sample link is the reproducible route. |
| Same sample, contents menu | Lists prologue, numbered chapters 1–61, epilogue and front/back matter. Chapter 1 starts at reader page 15; chapter 7 at page 53. Chapters 8–61, epilogue and copyright show unavailable destinations. | Availability of a chapter start is not proof that its whole chapter was read or even fully exposed. No new narrative chapter was read this run. |
| [November 9 primary-text checkpoint](isles-of-the-emberdark-primary-checkpoint-2026-11-09.md), blob 5a86d7b116858da35aa976ac11b4d3a8d4fb074c | Read the existing 14 IE dispositions, 31 proposed connections and their chapter locators. | Attributed prior targeted reading of a supplied Dragonsteel edition; not fresh access to that ebook, not a sequential full-book read, and not independent verification of today's implementation. Its old PR37 head was 08d10e1736d3e6916d7a061d311ddb13f444bb05. |

The public preface independently confirms that the original novella is incorporated as flashbacks with some mythology/worldbuilding changes. This supports keeping original and revised text separate; it does not establish word-for-word equivalence. The internal September 2025 edition identification remains attributed to the November 9 checkpoint because the sample copyright destination is unavailable.

The actual contents menu now supplies a defensible structural denominator: **61 numbered chapters, plus prologue and epilogue**. It does not supply a complete reading denominator already satisfied. All **5/5 priority chapters** from the prior locator guide—35, 36, 37, 38 and 60—were unavailable as sample destinations. The chapter 22 excerpt read in checkpoint 1 came from a separate published excerpt; its prior coverage is preserved.

The previously supplied full edition was not resolved in the authorized context available this run. That is an access limitation for this fresh recheck, not a statement that the earlier evidence never existed. No repeated purchase or access request is necessary to proceed to the next bounded work.

## Reconciliation of all eight claim groups

These dispositions carry forward checkpoint 1 and explicitly preserve prior evidence. “Hold” does not erase a previously documented narrow observation.

| Group | Current comparison and disposition |
|---|---|
| DR02-01 — Eye crossing | All three snapshots retain e61 at Firstsun / Patji's Eye with Dusk leaving through the Eye to seek help. PR37 also attaches the pool landmark. IE05 previously distinguished this real crossing from the separate island hypothesis, citing chapters 35–38. Those chapters were unavailable for fresh reading. Preserve that prior distinction; no new certification of every pool, avatar, paste or placement claim. |
| DR02-02 — hidden gate | All three retain e62 at Emberdark / hiddengate, describing the alliance and hunt; PR37 attaches ring. Crucially, PR37's ring description already attributes the central-island perpendicularity claim to the crew's belief. Do not request that same attribution as if absent. IE05's cave/remains distinction, IE06's multiple forms and the event/site attachment still require their own reconciliation; one qualified landmark sentence does not close the entire group or establish a functional portal. |
| DR02-03 — Starling and Yolen | Preserve checkpoint 1's prologue/chapter 22 observations and prior IE14. Origin, apprenticeship and alliance are different from an uninterrupted travel itinerary. No full chronology or identity crosswalk approved. |
| DR02-04 — Dhatri and Lumar | Preserve narrow chapter 22 access evidence. All three current Lumar records still say under a year by sublight travel in distText and the key-12 Neighbour fact. Prior IEC22 describes chapter 36 as a qualified “perhaps” estimate tied to a proposed access route. Record this as an unresolved reconciliation candidate; chapter 36 was not freshly available, and no new implementation fix is certified from the catalogue or preface. |
| DR02-05 — realms and geography | No new narrative coverage establishes the broad geometry, universal conditions, scene placement or Drominad anchor. Retain schematic/geography holds and the prior targeted observations without converting them into exact coordinates. |
| DR02-06 — travel edges and chronology | All three retain h-dusk with Firstsun→Emberdark and Yolen→Emberdark pairs. Prior IE14 distinguishes Dusk's crossing from Starling's origin. The data pairs alone do not establish two legs travelled by Dusk. Preserve the attribution/type issue and existing ordering/runtime limits; no rendered-path verification occurred. |
| DR02-07 — inherited baseline claims | Original-novella, Yolen, codex and ecological limits remain. Prior IE07/IE13 and other dispositions stay available as targeted evidence, not universal mechanism certification. No additional relevant narrative pages were read in this unit. |
| DR02-08 — edition, coverage and gates | Preface supplies new independent support for revision/flashback separation. Contents supplies structure, not completed coverage. Original-novella first reveals, full entity/connection coverage, cross-edition wording and per-work gates remain unapproved. |

**8/8 selected groups dispositioned; 0/8 wholly certified.** The 14 prior IE dispositions and 31 prior connection candidates are retained, not deleted, silently closed or counted as newly verified. This checkpoint issues **0 new finite implementation corrections**. It does not rescind the November 9 proposals; a future builder/content return must reconcile them per ID against its exact head.

## Known gaps and bounded continuation

| Gap | Consequence / resumption condition |
|---|---|
| Fresh primary access to chapters 35–38 and 60 unavailable | Eye, gate, cave and event-placement recheck remains incomplete. Resume this targeted comparison when those passages or an implementation return are available; do not create a third search-only DR02 checkpoint. |
| Earlier primary audit compared an older implementation | Retain its evidence and chapter locators. Current ring attribution is already present, while remaining IE05/IE06/IE14 and IEC22 questions require scoped reconciliation. No blanket “all fixed” or “no evidence” conclusion. |
| Full edition, ending and sequential coverage not read this run | Full DR02 canon approval withheld. Prior four excerpt sections and this run's two preface pages do not equal a full novel. |
| Edition wording, maps/art, full entity list and cross-book identity sides incomplete | No cross-edition equivalence, exhaustive easter-egg/connection certification or retroactive DR01 approval. |
| No new source-backed per-work mappings or application validation | Existing gate, Save/Load, runtime and release holds persist. No tests or rendered cases are represented as passed in this research unit. |

**DR02 is deferred at checkpoint 2/2; DR01 remains deferred 2/2.** Retain `research / chatgpt` for the continuing book-by-book review and move to **LU01 — Tress of the Emerald Sea, unit 1/2**, in ledger order. Read its existing evidence first, establish edition and lawful primary coverage, inventory the relevant current PR records, and hand off only finite supported corrections. Pending content/final/implementation audits take priority if ownership changes.

Coverage this unit: 2/2 selected preface pages visually inspected; 5/5 priority narrative chapters unavailable through this sample; **0 newly read narrative chapters, 0/1 full DR02 novels read, 0/33 full-work audits approved**. All prior accepted corrections and deferrals remain unchanged. No application code or PR branch was edited; no merge, deployment or Mckay release approval.
