# Society disposition review — flood and book boundaries

- Reviewer: ChatGPT, 2026-11-09.
- Exact audited PR37 head: `2f04e416696f0fe32ab5eca7be5d8b578cd129cd` (`atlas/deep-worlds`).
- File: `public/atlas/society.js`, blob `fd3b2d14eb2457fef933b8925e9a4888b3e57d34`, 9,781 lines.
- Input: [disposition-2f04e41.md](disposition-2f04e41.md), blob `c7cf545264bd4a778eb47c87ea6b6bc62c9f3ef2`; prior [omission review](omission-review-2f04e41.md) preserved.
- Scope: 3/3 requested decisions completed; 9/9 flood selector groups inspected. These are implementation instructions, not acceptance of an implemented fix. No application edit or independent browser run.

## Decision

**Flood: A amended below. Tyche: V minimum accepted. Harmonia/Discordia: conservative VI boundary accepted with two closure amendments.** Claude can implement this finite batch and return the exact new head with evidence. Do not drop a source-confidence note merely because a secondary source supplies a chapter number.

## Bounded source check

Source-based web research was used; the separate Deep Research product was not invoked. Four source URLs were opened or attempted on 2026-11-09:

| Source | Access and evidence | Limit |
|---|---|---|
| [SuperSummary, Dark Age Part 1](https://www.supersummary.com/dark-age/part-1-summary/) | Readable secondary summary: chapter 1 describes Orion after torture; chapter 15, “Darrow: Tyche,” describes the Storm God and a destructive storm at Tyche. | A useful novel locator, not an opened novel passage. It does not independently establish the retained wording “surges drown the city,” exact inundation, or Book VI persistence. |
| [Book Series Recaps, Dark Age](https://www.bookseriesrecaps.com/what-happened-in-dark-age/) | Readable secondary recap: Orion threatens Tyche with Storm Gods; Darrow intervenes and Alexandar helps civilians escape. | General corroboration of the episode, not a precise flood/chronology or mortality source. |
| [Penguin Random House, Dark Age](https://www.penguinrandomhouse.com/books/545686/dark-age-by-pierce-brown/) | Publisher product page readable. | Retrieved page supplies no chapter-15 passage supporting these details. |
| [Red Rising Wiki, Tyche](https://red-rising.fandom.com/wiki/Tyche) | Direct open failed with 402 Payment Required. | Search exposed a chapter-15 lead, but the page was not read. Do not count it as verified evidence. |

Access result: 3/4 pages readable, 1/4 inaccessible; 2/4 provide relevant secondary narrative evidence, 0/4 provide the needed primary passage. **0/6 legacy Society source rows newly primary-verified.** No claim that the flood wording, first appearance of either Europa name, or VI water level was canon-confirmed. The Light Bringer map mentioned in the code was not independently opened.

## F — connected flood feature: A amended

Retain the existing feature provisionally, using the established explicit uncertainty treatment. This is a confidence disposition, not source certification. The retained city-inundation claim remains low confidence in this review. Amend A to prevent unqualified copies and an unsupported persistent VI state:

| ID / exact-head location | Verdict and bounded instruction | Gate / validation |
|---|---|---|
| F1 — `d8`, line 215 | Accept A's deletion of subclaims c–e: horizon-four wording, master-override death, and “tens of millions.” Keep its proposed a+b text only with the full adjacent sentence: “Provisional account; not independently checked against the novel.” Neither secondary locator removes that qualifier. | Event remains V. Check Chronicle, event banner and replay entry all retain the qualifier. |
| F2 — `FX_VIEW.flood` 258; `FX.flood` 4786; `FXG.flood` 4849 | Keep the connected effect registrations and their event route. This is an illustrative reconstruction of a provisional account. | V+, no orphan event/effect/scene references. |
| F3 — Tyche `storms`, 3906; handler/update 4013–4024 | Keep the toggle and effect dependencies. Add a visible Tyche scene note explaining that flood extent and height are illustrative and not verified against the novel. Retain the existing artistic-layout note. | Qualifier must be present when entering Tyche directly, without first reading d8. Do not interpret the scene's numerical water height as sourced measurement. |
| F4 — `SITES.tyche.eras[5].blurb`, 3902 | Keep the control instruction, qualified as a provisional flood reconstruction. Suggested: “Dark Age. Toggle the Storm Gods for an illustrative flood reconstruction; this account has not been independently checked against the novel.” | V. |
| F5 — `eras[6].blurb` 3902, `fOn` 4019, comment 7038 | **Amend A:** remove the automatic `ERA>=6` flood trigger; preserve explicit toggle/event activation. Replace the drowned-capital VI assertion with “Light Bringer. The scene does not establish Tyche’s water level in this book; the Storm Gods control replays the provisional Book V reconstruction.” Update the stale comment. | Default VI must not force the sea up. A lower default is also an artistic baseline, not evidence the city recovered. The visible note must make that distinction. Explicit replay may remain at VI. |
| F6 — Mercury `ERAS[5].blurb`, 104 | Use B's narrow deletion of “, Tyche drowns” so the global summary does not silently turn the provisional claim into fact. Keep its other clauses. | V, no change to Ladon scope. |
| F7 — Helios `eras[5].blurb`, 3529 | Use B's narrow deletion of the Tyche-drowning clause, retaining the hypercane/Ladon description and Helios control. | V; no deletion of unrelated storms. |
| F8 — `TOURS.book5` Tyche step, 8047 | Use B's neutral replacement, “The City of Libraries, its great sculpted heads above the sea.” Retain the step and its route. | Six steps remain six; no flood claim without its confidence note. |
| F9 — Tyche `harbor` 3890 and gate 9036 | Keep the surviving neutral harbor description and selector. No-op gate may remain. | d8's landmark target remains valid. |

No broader deletion is authorized. Operation Tartarus d6, Ladon d7, polar, ladonstorm/storms and the Helios storm control remain outside this batch. No demand for another open-ended source hunt: implement the qualified disposition and the finite omissions now. Any future removal of the uncertainty note requires an actually inspected source supporting the precise claim, recorded separately.

## T — Tyche availability

Accept `SITE_FROM.tyche:4 → 5` at 8963 and the proposed corrected rationale at 8964–8966. This restores the accepted lore-corrections minimum and matches `POI_FROM.mercury.tyche=5` at 415. It is a conservative display boundary, not a newly proven earliest canonical mention.

Leave the unreachable IV dress/shield/landmark variants alone. Validate IV direct entry, globe pin, stale entry and history navigation are blocked; V entry and the event route still work. Do not reintroduce the withdrawn prologue as evidence.

## E — Harmonia / Discordia closure

Accept the packet's VI display boundary as a conservative restriction. The code's map attribution is a lead, not independent map verification.

| ID / exact-head location | Decision / replacement | Gate |
|---|---|---|
| E1 — `POI_FROM.europa` 420; Discordia pin 289 | Add `discordia:6`; retain existing `harmonia:6`. | VI |
| E2 — live `SITES.europa` 6423–6425 | Accept neutral epithet “Europa · House Arcos” and base blurb beginning “A castle on an island of Europa’s ocean”. Keep the existing VI blurb. | Names only VI+ |
| E3 — facts 6426 and gate 9017–9018 | **Correct the packet:** facts already have an era mechanism. `siteGate("europa","facts",6,base)` stores full facts at VI, and era 2 has its own facts. Neutralize the Island row in the derived pre-VI `base` before constructing era-2 facts; preserve full VI Island/Books rows. | Base and II–V must omit both names; VI restores the existing full rows. |
| E4 — `villa` variants 9015–9016 | Accept “Keep and walls on the island’s heights.” in both early variants, retaining their remaining already-gated text. | Full named description VI |
| E5 — `seagate` 6420; `sea` 6422 | Accept proposed neutral pre-VI seagate gate and `lmHide("europa","sea",6)`. Keep existing deep/athena VI gates. | VI |
| E6 — **missed live dependency:** `LEV_BASE` / `LEV_TEXT` 9432–9433 | Early text still says “Europa’s Discordia Sea.” Make a neutral early variant replacing just that phrase with “Europa’s ocean”; preserve full wording in the VI variant. This single text object serves the globe popup (9428–9429) and the late-added site landmark (9441). Both require checking. | No Discordia in either surface before VI; full VI variant retained. |

E3 is not a request to strip the full “Golden Son, Light Bringer” bibliography to “Golden Son”: the existing code already withholds that full Books row until VI. Preserve it. E6 changes the sea name only; this review does not certify or broaden the scope to the Kalibar/Cyraxes/age claims.

Source inspection found earlier Europa assignments at 3431 and 4481; both precede the replacement `SITES.europa={...}` at 6423. Do not spend this unit purging dead text. The late leviathan registration is different: it runs after the gate block and is live. Raw string search alone therefore cannot prove absence of visible leaks.

## Required return evidence and stop point

Implement the three units together on PR37, record exact head and parent, provide the actual diff and a finite assertion table. Run the existing required checks appropriate to the application change; report executed totals and failures honestly. At 1440 and 390 widths exercise:

1. Tyche IV denial and V entry, including direct/stale entry and history.
2. V d8/Chronicle replay, manual Storm Gods on/off and neutral harbor; confidence text visible both with the event and on direct scene entry.
3. VI fresh entry without forced flooding; explicit Book V replay remains usable; downgrade/upgrade does not leave stale control state or an unqualified “drowned capital.”
4. Europa at II, V and VI: globe pins; scene epithet/blurb/facts; villa, seagate and sea; **both** leviathan popup and site landmark. Names absent on early visible surfaces and present where retained at VI.
5. No dangling targets; Book V tour still six steps; Ladon/Helios unrelated effects preserved. Distinguish data assertions, API-driven checks and independently rendered interaction.

This review has 3/3 decisions, not 3/3 implemented passes. Independent rendered cases in this run: 0. Claude's prior probe counts are not new reviewer evidence. Current source inspections do not close DWO-S1 or the final Society technical suite/four-viewport evidence requirement. Preserve the 139 unselected records as uncertified, prior omission decisions, and all broader canon/technical/release gates.

**Canon: not approved.** Hand off to fixing/claude for the bounded implementation. No Mckay decision is needed for this packet; Mckay's eventual release approval remains separate. No PR approval, merge or deployment.
