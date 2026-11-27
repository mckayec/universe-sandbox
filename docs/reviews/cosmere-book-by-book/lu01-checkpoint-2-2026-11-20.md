# LU01 — Tress: checkpoint 2/2 and full-audit deferral

Date: 2026-11-20. Research owner: ChatGPT. Run: chatgpt-lu01-20261120T2313Z-b7a2.

## Outcome and evidence boundary

**LU01 reaches its two-checkpoint research cap. Full audit deferred; no new mandatory implementation correction. Next book unit: KO01, Yumi and the Nightmare Painter.** This closes the bounded research unit, not the book's canon audit. Preserve the [checkpoint1](lu01-checkpoint-1-2026-11-20.md), [inventory](lu01-inventory-2026-11-20.json), earlier [Secret Projects findings](secret-projects-primary-audit-2026-11-09.md), DR01/DR02 deferrals and all accepted corrections/runtime/release holds.

New evidence is two complete published sample chapters, 6 and 7. The chapter8 sample contains only an opening fragment and is not counted as a chapter read. A public reader's contents establishes **64 numbered chapters plus an epilogue**, with postscript/back matter separately listed. Thus **2/64 numbered chapters were read in full from this identified ebook edition in this run**, epilogue 0/1. Checkpoint1's five author-posted chapters remain separately credited; no edition-equivalence check or complete seven-chapter reading of this ebook is claimed.

Research used web retrieval and normal public reader interaction, not the separate Deep Research product. No borrowing, account access, purchase, source-text upload or bypass was used.

## Exact implementation snapshots

Fresh authenticated GitHub reads in this run:

| PR | Head commit | public/atlas/packs/cosmere.js blob | public/atlas/engine.js blob |
|---|---|---|---|
| 24, fix/lore-corrections | cf25cda66e91c573c421a0f3712623db72737a3b | 3ff0aab059fa54e00f6e2ccc7b849d4bd206d958 | f7522acb5ca255b3d3d32cef0800e24284d97d97 |
| 37, atlas/deep-worlds | 03394c32816fcb5c95261bf6a9ea4520381a5838 | 5a74e300eaf88b2d3c81fa9bc957584cd4708e33 | 4a162090ae65154e66248daaeb1fa882008c7b85 |
| 48, feature/cosmere-reading-state | 61e26afb4514f4b9510f33ce9f8b0b7bbe84e964 | 05170eab9f4c10f18c98a6fac51cf825e63c8a56 | 0bc5357a2043f3939512bc5b091eb4ffbbf1c5d0 |

All3/3 pack blobs match checkpoint1; no new inventory file is needed. The existing selection remains 1/60 worlds,9/9 nested Lumar sites,2/2 selected events on PR24/48 or3/3 on PR37,3 codex selections,2 Lumar links and1 adjacent Threnody site per snapshot; PR37 adds5/5 selected nested landmarks. Pack evaluation here inspected data only, not application rendering.

Also read PR37 public/atlas/index.html blob1910c9f91749a816eb1e6c34b52ba2b13c5f28e1 and current-main docs/atlas/PACK_FORMAT.md blob03d156754f37adce950ac2eda5067f7d169e0503. Intake main was167bf3243da492c85f1698a78e01195887122e47. Existing Secret Projects audit blob e45576853f5b16c24626f1fac2cb0fef5e3f452a was reread as prior attributed research, not a substitute for opening its underlying private ebook.

## Sources opened and access results

- **S1 — published ebook sample, primary text.** Brandon Sanderson, Tress of the Emerald Sea; [Bilkent/OverDrive catalogue](https://bilkent.overdrive.com/media/9533141), Dragonsteel LLC, ISBN9781938570346, platform release January10,2023. Opened catalogue using web retrieval, then its public READ A SAMPLE control in the normal browser. Contents -> chapter6 -> READ FROM HERE exposed the chapter text; NEXT PART exposed chapter7 and the chapter8 fragment. Catalogue metadata is not independent narrative evidence.
- **S2 — reader contents and boundary, primary edition metadata.** Same catalogue/reader. Contents lists chapters1–64, epilogue and separate back matter. Chapters1–8 have displayed page entries; chapters9–64 and epilogue are marked unavailable. Number8 having a page entry does not mean the whole chapter is offered. After its opening fragment, Next Page returned the sample's About This Book panel. Reader page indices depend on layout; cite chapter headings, not these as print pagination. No session-token reader URL is committed.
- **S3 — publisher catalogue/synopsis.** [Orion paperback](https://www.orionbooks.co.uk/titles/brandon-sanderson/tress-of-the-emerald-sea/9781399613392/) and linked [hardcover](https://www.orionbooks.co.uk/titles/brandon-sanderson/tress-of-the-emerald-sea/9781399613378/) opened in the browser. Neither observed page exposed an excerpt control; both show the stowaway synopsis. This is a current UI observation, not a universal claim about publisher access. Hardcover metadata: ISBN9781399613378, April4,2023; paperback ISBN9781399613392, April2,2024.
- **S4 — publisher catalogue/synopsis.** [Tor/Macmillan](https://us.macmillan.com/books/9781250899651/tressoftheemeraldsea/) opened by web retrieval: ISBN9781250899651, April4,2023,384 pages. Same broad departure premise. No later narrative credited from this listing.
- **Access qualification.** The web tool's OverDrive sample redirect was inaccessible, but the normal catalogue reader worked. Browser plugin could not bind an originating browser context; the available cloud browser completed the public-reader interaction. These are access-method outcomes, not evidence of a site ban or absence of lawful sources.

## New narrow primary checks

**S1 chapter6, The Inspector (C, text):** Tress explains her rescue intention to her parents; they study shipping and the cargo inspector's checks. Two weeks after deciding to leave she is still planning; Lem subsequently seeks help. The Emerald Moon is described as immobile in the sky. This supports the departure motive, preparation and the apparent fixed moon position, not a complete orbital model.

**S1 chapter7, The Father (C, text):** Lem recruits help indirectly; Brick, Sor and Gremmy offer assistance. More than a week later, the plan uses Oot's Dream, its ale purchase and an inspection at the dock. A raven-haired woman is discovered in a keg; the other cargo is loaded and the vessel leaves toward the Core Archipelago. The narrative then reveals that Tress is the apparent inspector, not the person hiding in cargo. This establishes the actual departure and dock association. It does not verify later landfall, navigation geometry, captaincy or rescue outcome.

**S1 chapter8, The Stowaway (U beyond fragment):** title and initial words only. Do not infer subsequent discovery, dialogue or voyage events from its title.

## Eight updated dispositions

| ID | Result after unit2 |
|---|---|
| LU01-01 — world/moons | Retain checkpoint1's narrow twelve-moon/spore-premise support. Chapter6 adds fixed-sky language for the Emerald Moon. See schematic review below; no physical simulation or complete moon catalogue approved. |
| LU01-02 — Rock/mansion/home | Prior narrow text support preserved:1/9 site descriptions and2/5 PR37 landmark descriptions. No new coordinate, shape, size or scene certification. |
| LU01-03 — other eight site descriptions | No additional complete site description verified. Core Archipelago is the departing ship's stated destination in chapter7; this does not establish Kingsport's exact location or all sea adjacencies. Preserve placeholder/uncertainty wording. |
| LU01-04 — e49/docks | **New narrow support** for departure event and dock attachment from chapter7, with motive from chapter6 and checkpoint1's attributed chapter5 report. e49's broad rescue-departure text is supported,1/3 selected PR37 event texts or1/2 on PR24/48; timing, reader gates and all downstream voyage claims are not certified. The dock's departing-ship function is supported. Its “stowaway” shorthand matches publisher synopsis and chapter8's title; the detailed action is inspector impersonation. No mandatory error finding from the shorthand alone; if later expanded, describe the actual ruse rather than hiding Tress in the keg. Do not promote this into an additional wholly verified landmark paragraph. |
| LU01-05 — dragon/ending | No new narrative support for e113/e50, Xisis/Crow resolution or lair/tower descriptions. Contents identifies chapter51 The Dragon,52 The Sacrifice and60 The Sorceress, but those entries are unavailable. Titles are not plot verification. Prior T06/T08/T09 remain attributed earlier research. |
| LU01-06 — characters/links | Prior Hoid narrator support1/1 selected line retained. New sample does not verify Tress's captaincy, later identities, Sel–Lumar travel or spacecraft claims. Charlie's earlier Iriali explanation remains attributed. |
| LU01-07 — later DR02 boundary | No change to Dhatrian-network/under-a-year travel/Lilting Abyss holds. Opening Tress chapters do not resolve later-work chronology or geography. |
| LU01-08 — edition/maps/gates/full coverage | The published contents denominator and sample boundary are now known for S1. Full text, illustration fidelity, complete cross-book checking and per-work/ancestor gates remain incomplete. No full-book or application approval. |

**8/8 groups dispositioned;0/8 wholly certified;0/33 full-work audits approved.** The new2/64 chapter count, prior5/5 posted-chapter count and narrow field counts measure different scopes and must not be added into an ebook-completion percentage.

## Moon renderer and schematic review

The six descriptors are confirmed on3/3 freshly read packs. The engines create one decorative moon mesh per descriptor: PR37 engine lines890–893, PR24/48 lines888–891. Animation advances each pivot in PR37 line916 and PR24/48 line914; this is a source trace, not an observed rendered result. A zero speed also falls through the current default expression, so merely setting speed:0 would not establish stationary rendering.

This does **not** justify a demand to implement six invented moon records or physically accurate astronomy. PACK_FORMAT.md line334 explicitly defines these moons as decorative; the engine fan notice (PR37 line470; PR24/48 line468) and PR37 index line44 label maps/positions schematic. Pack lines16–30 also explain enlarged/compressed orreries and generated geography. Therefore retain the difference between the twelve-moon textual fact and six decorative models as a presentation limitation. If a future feature claims complete moon enumeration or canon orbital motion, it needs explicit completeness/animation semantics and rendered verification. No new mandatory moon correction is issued here. Existing SP08 dry-spore-rendering risk is separate and remains unresolved by this inspection.

## Known gaps and restart conditions

| Gap | Impact | Blocks what? |
|---|---|---|
| S1 chapter8 incomplete; chapters9–64 and epilogue unavailable | Later voyage, dragon, ending, mechanisms and identities not independently reread | Full LU01 approval and new unsupported later-plot claims; does not invalidate supported opening/departure facts |
| Author-post chapters1–5 not collated against this ebook | Cannot equate prior posts with all published wording | Edition-complete reading claims |
| Earlier private-ebook research not reopened in this run | Existing T01–T09 remain historical targeted evidence | Fresh independent confirmation of those later passages |
| Map/art and generated geography unverified | No exact global/scene geometry claim | Canon geometry certification |
| Shared bucket11 and ancestor/gate coverage incomplete | Tress completion cannot stand in for Yumi/Sunlit completion | Per-work spoiler approval |
| Runtime/device/Save–Load and owner release holds | Source review is insufficient for release | Technical/release approval; only Mckay authorizes release |

At the cap, **defer LU01's full audit**. Reopen only for materially new primary access or a finite returned correction, not a third search-only checkpoint. Continue KO01 unit1/2 using its own existing evidence and fresh sources; keep the folder research/chatgpt. All18/18 pack and8/8 review statuses were inspected this run. No other owned review or eligible stale parallel self-audit was found. No application/PR-branch edit, merge, deployment or Mckay approval occurred.
