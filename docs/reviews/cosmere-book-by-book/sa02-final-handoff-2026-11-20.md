# SA02 / Words of Radiance — second bounded unit and L23 reconciliation

ChatGPT, 2026-11-20 UTC. **One finite correction for Claude; full SA02 audit deferred at the two-checkpoint cap.** This is source-based web research, not the separate Deep Research product. No full-book reading, implementation acceptance or release approval is claimed.

## Revision and inventory

Read current main at `ae04fefae31d8dc8ccbfcf146613750b20cdfe4c` before acquiring this run's coordination lock. Read all **18/18 pack statuses and 8/8 review statuses**; this review alone was owned by ChatGPT. The agreement remains active with both sign-offs. No eligible research-ready/Claude parallel self-audit; WIP continues to block new queued packs.

| PR / branch | Exact head | public/atlas/packs/cosmere.js blob |
| --- | --- | --- |
| 48 / feature/cosmere-reading-state | af49e0ab7f32626791d11a2f573dd7b4f074f654 | 00d8ac461d4299205cb8df883fa557dbd534cbd5 |
| 24 / fix/lore-corrections | cf25cda66e91c573c421a0f3712623db72737a3b | 3ff0aab059fa54e00f6e2ccc7b849d4bd206d958 |
| 37 / atlas/deep-worlds | 03394c32816fcb5c95261bf6a9ea4520381a5838 | 5a74e300eaf88b2d3c81fa9bc957584cd4708e33 |

Fresh GitHub fetches and independent Node/vm extraction matched **3/3 Git blob hashes and 28/28 selected records** against [the saved inventory](sa02-inventory-2026-11-20.json), blob `a0677b27a6734efbf05ee11b6d37bf230b8d146d`. Selection: all events with book===5; full narak/urithiru sites; roshar/braize parent properties except gfx/map/sites. Counts: PR48 8, PR24 8, PR37 12. These counts establish inventory continuity, not canon correctness. The first local hash check detected an extra terminal newline introduced by scratch serialization; removing that local transport artifact produced the three exact hash matches. No repository file was changed by this check.

Prior checkpoint: [sa02-checkpoint-2026-11-20.md](sa02-checkpoint-2026-11-20.md), blob `54fe5cdcbffb7fa8d5d5ba8279bbfe26026ea00e`. L23 source: [lore-corrections/corrections.md](../lore-corrections/corrections.md), blob `684b7c6d899183a54959baff6ac8a39bbc576640`. Existing L23 is preserved, not counted as a newly discovered error.

## Opened evidence and access log

All observations below were checked in this run on 2026-11-20 UTC. Confidence and evidence type are separate: an opened secondary account is evidence of what that account says, not direct verification of a complete published scene. No reader comments or speculative reread theories support the proposed correction.

| ID | Source and locator | Access / evidence boundary |
| --- | --- | --- |
| S1 | Alice Arneson, [Words of Radiance Reread: Chapter 82](https://reactormag.com/words-of-radiance-reread-chapter-82/), 2016-05-26; Setting, summary and Kaladin commentary | Full article body retrieved through Firecrawl, HTTP 200. Web reader separately returned 429. Secondary account locates Kaladin's attempt to rescue Elhokar in the warcamp palace; quoted fragments show the rescue underway. Not a complete chapter or identified print edition. |
| S2 | Arneson, [Chapter 84: The One Who Saves](https://reactormag.com/words-of-radiance-reread-chapter-84/), 2016-06-09; Setting, Quote of the Week and Kaladin commentary | Web reader 403; alternate retrieval HTTP 200, article body read. The reproduced novel passage supports the oath's conditional protection principle, Syl's return and an interior hallway. The Pinnacle location and surrounding rescue summary are secondary framing. This supports narrowing e24, not an entire palace map or exact coordinates. |
| S3 | Arneson, [Chapter 85: Swallowed by the Sky](https://reactormag.com/words-of-radiance-reread-chapter-85/), 2016-06-16; summary and storm passage in Commentary | Web reader 403; alternate retrieval HTTP 200. A quoted passage puts the developing storm west of Dalinar's viewpoint; commentary identifies the Everstorm. Supports the direction in e22, not every element of its march/summoning composite. |
| S4 | Arneson, [Chapter 86: Patterns of Light](https://reactormag.com/words-of-radiance-reread-chapter-86/); summary, Shallan commentary, Ars Arcanum | Web reader 403; alternate retrieval HTTP 200. Reproduced text supports Pattern opening the mechanism; secondary narration supports the armies' arrival at Urithiru. Separately discusses original/revised Szeth endings. Not a full edition collation. |
| S5 | Sanderson, [Three Stories in New Formats](https://www.brandonsanderson.com/blogs/blog/three-stories-in-new-formats), March 2015, Words of Radiance Tweak | Opened author commentary. Distinguishes the changed Kaladin/Szeth confrontation; revised death is caused by the storm. Does not establish e24's palace location and is not either complete published ending. |
| S6 | [The Bands of Mourning signed copies + Updates](https://www.brandonsanderson.com/blogs/blog/the-bands-of-mourning-signed-copies-updates), closing reread paragraph | Opened author-site referral to chapter 84. Establishes the referral, not independent corroboration of the linked article or a new primary chapter. |
| S7 | [Words of Radiance Chapter Kaladin Insert 3](https://www.brandonsanderson.com/blogs/blog/words-of-radiance-chapter-kaladin-insert-3), editorial introduction | Opened, explicitly tagged Deleted Scenes and introduced as an eliminated chapter-32 section. **Excluded from published-canon geography evidence**, despite its palace/travel language. |
| S8 | [Macmillan Words of Radiance](https://us.macmillan.com/books/9781250166531/wordsofradiance/), Read Excerpt | Opened publisher sample starts with chapter 1, Santhid. It does not provide the required ending scenes. No later-event certification from this sample. |
| S9 | [Coppermind Kaladin](https://coppermind.net/wiki/Kaladin) | Web reader 403; not freshly verified. Prior L23 citation remains historical evidence, not a successful new source read. |
| S10 | [Coppermind chapter 84 summary](https://coppermind.net/wiki/Summary:Words_of_Radiance/Chapter_84) | Web reader 403; not used as opened evidence. |

**8/10 distinct candidate URLs supplied readable bodies; 2/10 remained inaccessible.** Four Reactor bodies were successfully read after web-reader failures. Their shared author/source does not make four independent witnesses. Search snippets were navigation leads only. The quoted book fragments were read within commentary, not from a complete, edition-identified novel. No full copyrighted text is reproduced here.

## Findings and finite builder request

| ID | Severity | Exact location | Finding / evidence | Required disposition |
| --- | --- | --- | --- | --- |
| SA02-L23-PORT | Medium; existing correction divergence | PR48 cosmere.js line 769, events.e24; compare PR24 line 718 and PR37 line 1303 | PR48 retains site:narak and the older compressed oath/flight text. L23 already required removing that pin. S1–S2 freshly support the rescue/oath context and distinguish the warcamp palace from the battlefield; exact location remains secondary-supported. PR24 removes the pin with qualified text; PR37 adds warcamps/pinnacle, which is outside this requested change. | On PR48 only, remove e24.site and replace e24.text with the exact qualified description below. Keep id, book:5, world:roshar, title, order and all unrelated values. Do not import a landmark, coordinates, parent metadata or reading-state promotion. |

**Exact proposed e24.text:**

> At the king’s palace in the warcamps, Kaladin speaks his Third Ideal while protecting Elhokar. Location is provisional, based on Tor.com’s chapter rereads rather than a checked edition of the novel.

Evidence classification: oath/protection core **C / reproduced published passage**, palace location **L / secondary-supported, explicitly qualified**, Narak removal **C / repository reconciliation with existing L23 plus opened secondary context**. No claim that the full primary scene or exact palace geometry was independently verified. This is one correction unit containing two field operations, not two newly discovered canon errors.

No fresh PR24 or PR37 work is assigned; those review statuses remain untouched. The existing PR37 pinpoint is not newly approved. Preserve the prior CS01 palace/northern-plateau removal and all earlier closures.

### Five follow-up evidence groups

| Group | Disposition |
| --- | --- |
| e24 / L23 | One conservative correction requested above. Narrow reprinted oath support plus qualified secondary location; not whole-record promotion. |
| e22 | Western storm direction has narrow quoted-text support [S3]. March, summoning sequence and exact Narak/stormseat geometry remain partially checked. No direction reversal or new correction requested. |
| e23 | Mechanism activation has narrow reprinted support; evacuation/destination has secondary support [S4]. No new correction or whole-site approval. |
| Edition boundary | Author commentary [S5] and reread comparison [S4] distinguish the duel revision. Neither verifies both entire editions; do not use the change note as palace-scene evidence. |
| Deleted/sample boundary | Deleted chapter-32 insert excluded [S7]; opening publisher excerpt cannot verify climax [S8]. |

**5/5 follow-up groups dispositioned; 1/1 finite correction ready for builder pickup, 0/1 implemented in this run.**

## Known gaps and cap disposition

The **12/12 record-type dispositions** from the first checkpoint remain explicit: e22/e23 now have the limited support above; e24 has the finite qualified correction; e25, e87–e90, narak, urithiru, roshar and braize remain held for full-payload claims. No new mappings or gates are authorized.

| Gap | Impact | Blocks this finite repair? |
| --- | --- | --- |
| Complete ending chapters and exact print/ebook editions not read or collated | Blocks complete scene/edition certification; keep palace qualification. | No; blocks removing qualification or claiming a direct full-scene check. |
| Narak/Urithiru complete descriptions, geometry and 15 PR37 landmarks not audited | Blocks site/landmark imports and whole-record promotion. | No; remove the misleading pin without inventing a replacement. |
| e25 and PR37-only e87–e90, parent cosmology, broader journeys/codex/missing-content coverage | Full SA02 remains incomplete. | No; defer full audit at cap. |
| Independent rendered return and technical checks not performed for this proposed change | No implementation acceptance yet. Existing Save/Load intermittency remains unresolved. | Required on Claude's return; not a reason to invent a pass. |

**Full SA02 deferred after checkpoint 2/2. 0/4 complete PR48 book-5 events, 0/2 complete selected sites, 0/33 full works approved.** SA01 remains deferred with its two description corrections accepted at af49e0a. Earlier work-unit dispositions, D09/D10, technical limitations and Mckay's release gate stand.

## Return contract and continuation

Claude: implement **SA02-L23-PORT only** on `feature/cosmere-reading-state`, then commit a return report here naming the exact new head and actual parent. Show the actual diff; verify that only e24.text and removal of e24.site changed in the pack. Keep existing numeric/reading-state eligibility and all prior fixes. Do not assign new req/in/public or parent gates.

Use a focused actual-parent negative check for the old Narak pin and unqualified copy; verify that event visibility is unchanged in relevant legacy and reading-state states. Render the world-level event selection at desktop and phone sizes: the new description/qualification must appear and selection must not jump to Narak or an invented palace marker. Run required validation and record passed/failed/unavailable checks separately, including the existing Save/Load issue. Do not substitute assertions or screenshots alone for source and functional evidence.

Return ownership as implementation-review/chatgpt only after the report is saved. ChatGPT then reviews the actual PR head, diff, tests and evidence. After independent acceptance, continue **SA03 / Edgedancer** as the next bounded work-ledger unit, subject to newly owned higher-priority audits. Do not resume open-ended SA02 research without new evidence or an explicit scope change.

No application/PR-branch edits, merge, deployment, or Mckay release approval by ChatGPT. This handoff needs Claude's work; no new Mckay decision.
