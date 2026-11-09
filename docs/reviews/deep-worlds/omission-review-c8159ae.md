# Omission return review and Society continuation

2026-11-09 UTC (2026-11-08 Denver), ChatGPT. PR37 `atlas/deep-worlds`, exact head **c8159ae4aef82f6f05346a587e11f43a3df4e5e1**, parent **5bfde313d819ab89e273af4b9c6a5f788d6d6f3d**.

**The 14-object omission is accepted at source/data scope. Canon: not approved.** This is a completed bounded return review, not a whole-pack audit or technical sign-off.

## Independent evidence

Read the GitHub parent-to-head comparison (2/2 changed files; 0 added / 18 deleted lines), both complete changed pack files, the preceding canon disposition, current audit checkpoint, implementation rationale, Claude's fix-return, data-check script and partial browser output. Head blobs:
- Expanse: `9f3dfe309030069f451f0165265807014d3600ee`.
- Hyperion: `20587c62f3fc5ddbd24cc4f3cefe527ab198d191`.
- Society: unchanged `59c3eb5237161eaa6784b18e46ebc4bf3e5555e9`, retrieved through the blob API and inspected at the selectors below.

An independently constructed Node VM check loaded parent and head packs, removed the authorized objects from parent data, then deep-compared the complete result against head. **2/2 whole-pack comparisons passed.** All surviving event records that name a site resolved to their world/site and, when present, landmark: **96/96 Expanse + 60/60 Hyperion = 156/156**. Event totals are now 112 and 76. This checks data relations, not rendered navigation.

The actual diff removes exactly **14/14** authorized top-level objects: Expanse 2 landmarks + 4 events; Hyperion 2 landmarks + 1 site (including its nested children) + 5 events. No other leaves changed. Expanse b3l and the earlier accepted narrowings remain unchanged. No new narrative, geometry or replacement facts were added. The GitHub comparison contains no other changed application files.

Claude's 20/20 data checks, 125/125 unit tests and 12×2 page checks remain **builder-reported** here; this run did not independently rerun the application suite. The partial browser log is not a rendered pass: it contains seven FAIL rows and two harness-error blocks. Valid-link controls also remain at world view. Tour samples such as `b3a,,` and `b7a,,` do not establish traversal of every stop. Hyperion book 1–3 flows and the 390-wide run remain incomplete. **0 independent rendered cases in this review**; no browser availability diagnosis is claimed.

DWO-S1 remains open for Claude's final technical unit: stale Sphinx site state survives after its data is removed. Preserve the current DWT-03 closure and DWT-03-R1 tree-integration trigger. The data omission can be accepted without treating these technical limits as resolved.

## Society decisions and incomplete dependency inventory

No new primary novel evidence was opened in this run. **0/6 Society rows are newly source-verified.** Absence of a locator in this packet does not prove a statement false. The following are editorial omission decisions and explicitly bounded continuation requirements, not source-based corrections to the books.

| Row | Decision / required next action |
|---|---|
| SO1 | **Omit** `EVENTS g1` (line 197). No replacement event, relocation or guessed date. |
| SO2 | **Omit the exposed Iron Gold prologue presentation**, together with SO3 and the explicit registration closure below. Do not retain a selectable scene that still asserts the unverified Tyche staging. |
| SO3 | **Omit the prologue controls/callers** as dependencies of SO2. Preserve unrelated Tyche controls and ordinary scene entry. |
| SO4 | **Omit the unsupported descriptive clauses, but the proposed two-line deletion is incomplete.** Before applying this sub-cut, return the finite duplicate-selector closure below with exact proposed text removals, retaining separately accepted lore and Athena access. No whole-Europa deletion. |
| SO5 | **Omit unsupported headquarters/flood assertions within this held group, but the two proposed selectors do not close it.** Return the finite scene/era/landmark/effect closure below before applying this sub-cut; do not silently remove the whole Tyche scene or alter other accepted gates. |
| SO6 | Correct implementation.md's rationale: the staged prologue is not evidence for book-IV availability. Record the staging's omission and that any surviving book-IV availability still requires its own accepted evidence/disposition. Do not automatically change a gate on this review's authority. |

### Authorized prologue omission closure: SO1–SO3

At the unchanged Society blob, actual source inspection adds two selectors omitted from the proposed cut:
- line 7239 appends the Tyche `prologue` toggle; removing only the line-7240 handler leaves a visible control.
- lines 7353 onward register **SITES.prologue**, including title, blurb, facts, an orbit landmark and its own play control. Removing only the callback at 7357 leaves exposed unsupported presentation.

Authorize removing g1, the set-piece registry entry `irongoldprologue` at 257, the Tyche prologue toggle and its dedicated handler branch, the interval-driven chain at 7347, and the complete **SITES.prologue registration** with its owned controls/landmarks. Remove or make unregistered/unreachable both dedicated effect registrations `FX.irongoldprologue` and `FX.irongoldreaper`; do not leave an effect dispatcher path that can resurrect the omitted scene. This explicitly includes the previously undecided reaper dependency. Preserve shared functions, unrelated scenes/effects, normal Tyche build behavior and later Athena content. Private inert geometry/helper cleanup is optional only where sole ownership is demonstrated; it is not permission to remove shared utilities.

Before applying, enumerate all callers and registration/deep-link paths across the actual branch. Any dependency beyond this named closure must stop that sub-cut and be returned, not silently cascaded. Return exact selectors removed and stale event/site/effect-link behavior, including no exposed prologue button or scene entry. These omissions do not assert that Iron Gold lacks a prologue or Mercury campaign.

### SO4 duplicate closure to return

The table names only lines 51 and 438. The same held attributes remain in the active Europa scene:
- line 6420: `SITES.europa` landmark `villa`, white limestone and far-northern location;
- line 6423: landmark `garden`, private forest and Aja claim;
- line 6428: active scene blurb, white limestone/far-northern island/private forest;
- line 6430: scene facts, far-northern location.

Also inspect the earlier `SITES.europa` registration at 3433 and which registration actually wins. Return exact clause removals for this finite set and any directly duplicated held text, separating the accepted Lorn/Tactus material and later-book Athena/Harmonia material from unsupported additions. Preserve e9 and the villa selector pending that disposition; no new factual replacement prose. Do not call two POI edits closure of SO4.

### SO5 duplicate closure to return

Beyond POIS.mercury/tyche at 147 and the map entry at 3483:
- line 3905: `SITES.tyche.eras` 4/5/6 repeats headquarters, drowning and broken-capital claims;
- line 3892: harbor landmark describes the storm/flood;
- line 3894: centralcmd landmark repeats headquarters and adds Orion;
- line 3901: morningstar landmark describes repair and subsequent ship identity;
- line 3909: Storm Gods control exposes the flood presentation.

Return an exact source-or-omit dependency table for these **existing selectors**, including the control's effect dependencies and any accepted prior lore disposition that must be retained. The inclusion of a selector here is not a finding that every clause in it is false or an authorization to delete all of it. Do not solve an unsupported book-IV claim by deleting separately sourced later-book content without checking its disposition. No broad new book-research loop is requested.

## Handoff and remaining gates

Return **fixing / claude**: implement the authorized SO1–SO3 prologue omission and SO6 documentation correction; return the finite SO4/SO5 duplicate/dependency closure before those sub-cuts. Keep the 14-object Expanse/Hyperion result unchanged.

Historical 139 unselected records, full Society coverage and full canon approval remain outside this completed unit. Final Society technical suite, final-SHA viewport evidence, DWO-S1 and any material integration changes remain technical gates. No ready-for-owner transition, PR approval, merge, deployment or Mckay release approval is given.

All 18 pack and 7 review statuses were inspected on main. Hierarchy/Narnia/Licanius research-folder blobs are unchanged from the preceding run, so no stale parallel self-audit was found; their status/history was untouched.
