# SA01 / The Way of Kings — first bounded checkpoint

ChatGPT, 2026-11-20 UTC. **Research remains incomplete and owned by ChatGPT.** First persisted SA01 source/inventory unit; one bounded continuation remains before the two-checkpoint disposition. No implementation request, new gate or full-work approval is made here.

## Revision and inventory

Reconciled current PR48/24/37 heads through GitHub and fetched their actual pack files. [Read-only probe](sa01-inventory-probe.cjs), saved at `fa85a20870f843867ab1c586552ef6987a1b550b`, and [inventory](sa01-inventory-2026-11-20.json), saved at `bc7acbcb5abda10c34b8b3087c86b1b3c084cfb6`, establish repository contents, not canon.

| PR / branch | Exact head | Pack blob |
| --- | --- | --- |
| 48 / feature/cosmere-reading-state | fccfe2c7023b93a91b52df1f812a17f0e94e3ed3 | 0d1dddaec48658936ab7a99225a9b089837a1f94 |
| 24 / fix/lore-corrections | cf25cda66e91c573c421a0f3712623db72737a3b | 3ff0aab059fa54e00f6e2ccc7b849d4bd206d958 |
| 37 / atlas/deep-worlds | 03394c32816fcb5c95261bf6a9ea4520381a5838 | 5a74e300eaf88b2d3c81fa9bc957584cd4708e33 |

**3/3 input hashes match. 57/57 selected record slots inventoried: 41 present, 16 absent.** Per branch: thirteen event-ID slots (e17–e21, e79–e86), five base sites (shatteredplains, warcamps, tower, kholinar, kharbranth), and Roshar parent prose/metadata. Geometry arrays are omitted from the snapshot, not approved.

All actual key-4 events are accounted for: 5 on PR48, 5 on PR24, 13 on PR37. The sixteen absences are e79–e86 on PR48/24. PR37's 26 landmark IDs under the five selected sites are recorded separately; their full claims and geometry are not certified. This selected inventory does not cover every Roshar site, codex entry, realm, system, journey or implicit spoiler.

PR48/24 e17 includes a revenge-war clause; PR37 already narrows it to the assassination on the treaty-feast night and adds lm:palace. PR37 e21 points to warcamps/kholin instead of the base Shattered Plains attachment. Its other additional events and scene attachments remain separate work, not automatic imports. Roshar's later-era text differs among branches; the inventory retains those differences without treating SA01 as their verification.

## Source register and access results

Ordinary source-based web search/open was used; no separate Deep Research invocation. Primary text, author commentary, and access failures are distinguished below. Search snippets were discovery leads, not substitutes for opened chapter bodies.

| Tag | Opened source | What was actually available / evidence scope |
| --- | --- | --- |
| S1 | [Author-hosted The Way of Kings prologue, “To Kill”](https://www.brandonsanderson.com/blogs/blog/the-way-of-kings-prologue) | Read the treaty-feast setup, palace approach, fight, balcony collapse and closing death/message sequence. Published-novel sample, not The Way of Kings Prime. The page gives no edition/page concordance; no full-edition collation claimed. |
| S2 | [Macmillan title/excerpt page, ISBN route 9780765376671](https://us.macmillan.com/books/9780765376671/thewayofkings/) | Publisher identifies Brandon Sanderson and Stormlight volume 1 and exposes the prologue. It is another presentation of the same text, not an independent witness or proof of all later chapters. No purchase or download of a full edition. |
| S3 | [Author annotation, chapter 3](https://www.brandonsanderson.com/blogs/blog/annotation-the-way-of-kings-chapter-3) | Opened/read the Kharbranth section. Author commentary supports its city-state classification. Discussion of Prime/development is not imported as novel canon. |
| A1 | [Author chapter-3 page](https://www.brandonsanderson.com/blogs/blog/the-way-of-kings-chapter-three) | Contains an old referral to Tor.com, not chapter text. No chapter-3 reading claimed. |
| A2 | [Reactor opening excerpt](https://reactormag.com/prelude-to-the-stormlight-archive/) | Direct open returned HTTP 403; the discovered double-slash variant also returned 403. Search-index passages were not accepted as a fully opened chapter. |
| A3 | [Reactor chapters 9 and 11](https://reactormag.com/the-way-of-kings-chapters-9-and-11/) | Direct open returned HTTP 403; no text verification. |
| A4 | [Reactor chapters 12 and 13](https://reactormag.com/the-way-of-kings-chapters-12-and-13/) | Direct open returned HTTP 403; no text verification. |

The chapters 4–6 audio route was found in search but not listened to or transcribed; it supplies no evidence in this checkpoint. Unavailable retrieval does not imply that a claim is false or that the book lacks it.

## Bounded evidence results

1. **e17 assassination core — (C, primary text).** S1 supports Szeth acting under his masters' instructions, the Kholinar palace setting, the treaty celebration, and Gavilar's death after the fight. The palace encounter occurs after the king has left the banquet; the existing PR37 wording avoids implying a killing at the banquet table.
2. **e17 revenge-war continuation — (U in this unit).** The opened prologue does not narrate the later march to war. Do not certify that clause from this excerpt or label it false. Seek the relevant later text in the second bounded unit, or retain an explicit hold/conservative narrowing.
3. **Kharbranth city-state — (C, author commentary).** S3 directly supports the political classification only. It does not establish the complete harbor/sea/mountainside/Palanaeum description, named-king chronology, coordinates or earliest textual reveal.

Thus **3/3 selected evidence groups have dispositions: one primary-supported, one commentary-supported, one held.** This is not a percentage of all SA01 claims. **0/5 complete PR48 key-4 event records and 0/5 complete selected base-site records are newly certified.** The prologue support is sufficient for PR37's already-narrowed assassination sentence, not for its parent payload or entire scene.

Read/reconciled CS01 in [the existing supplement crosswalk](../deep-worlds/cosmere-supplement-crosswalk.csv), blob `9248b7ca93b3343b81a9033d2c1fce489641c8ca`. The current PR37 palace landmark already removed the unsupported northern-plateau qualifier. Preserve that closure; do not reopen it as an unfixed finding or restore the qualifier. No duplicate new correction is claimed.

## Nineteen selected record-type dispositions

These rows cover the nineteen types represented in the 57 slots. A grouped row's count is explicit; inventory coverage is not source approval.

| Record types | Count | Current disposition |
| --- | ---: | --- |
| e17 | 1 | Partial primary support above; PR48/24 revenge clause held in this unit. PR37's prior narrowed prose preserved. No new gate or landmark port. |
| e18 | 1 | Surgeon/soldier/slave history, bridge labor and crew-survival composite remain to be checked against actual novel passages; no blanket claim that every crewmember survives. |
| e19 | 1 | Wardship negotiation, theft intent and PR37 Palanaeum attachment not verified from a successfully opened chapter in this unit. |
| e20 | 1 | Tower battle, betrayal, rescue and exact attachment held for late-novel text. |
| e21 | 1 | Vision content, timing of the speaker's death, and differing place/landmark attachments require relevant ending text; no tense correction from memory. |
| e79, e80, e81, e82, e83, e84, e85, e86 | 8 | PR37-only payloads/attachments inventoried; broader interlude, bridge-crew, alley and ending claims unverified here. No import. |
| shatteredplains | 1 | Chasm/war/gemheart/bridge prose and fourth-moon claim are distinct claims. The composite is not SA01-certified; neither is its geometry. |
| warcamps | 1 | Ten-crater description, exact north–south roster and location need map-edition/text reconciliation. |
| tower | 1 | Complete plateau/battle description held with e20. |
| kholinar | 1 | Palace-assassination context supported, but capital/rock-fin claims, later-book fall/Oathgate claims and complete parent gate are not approved. |
| kharbranth | 1 | City-state clause supported by commentary only; remaining composite and coordinates held. |
| roshar parent | 1 | Cosmology, realm/cities, numerical astronomy, later-era payloads and whole-parent eligibility remain held. No promotion from opening-chapter evidence. |

**19/19 selected record types dispositioned**, with incomplete evidence explicit. Broader Roshar atomic-claim denominator is not established. The label `book:4` is repository metadata, not proof that a composite payload is entirely revealed in SA01.

## Known gaps and precise continuation

| Gap | Impact / next bounded action |
| --- | --- |
| Early/middle chapter bodies not obtained from the attempted Reactor routes | Try a different lawful author/publisher sample or authorized preview once in the second unit. Prioritize e18/e19 and Kharbranth; keep commentary and synopsis separate from direct text. |
| e17 revenge-war clause beyond the opened prologue | Locate the later narrative support, or hand off only a justified narrow replacement after reconciling existing PR37 wording and the fresh PR48 head. |
| Ending/Tower/visions and PR37 additional-event scenes not directly checked | Preserve explicit holds. Do not use memory or fan summaries to certify the whole records. |
| Parent/cosmology/fourth-moon/later-book material and exact maps/coordinates | Blocks complete parent approval and early per-work promotion; selected prologue support does not release these holds. |
| Full novel/edition, complete atomic inventory, chronology/journeys and missing-content sweep unfinished | Blocks full SA01 audit. At the second checkpoint, hand off only concrete sourced corrections and defer the remaining scope with Known gaps; do not extend the research cap by relabeling fragments. |

Remain **research / owner chatgpt**. Next action is the second bounded SA01 source unit and cap disposition, not a promise to finish the novel in one run. No user action is required for these currently bounded source gaps.

All prior accepted PR48 changes, including NA01-GEO-01/02 at fccfe2c, remain preserved. Keep MB08/MB09/MB10/NA01 deferrals, D09/D10 and technical/release limitations unchanged. **0/33 full-work approvals**, no new parent promotions, application/PR-branch edits, merge, deployment or Mckay release approval.
