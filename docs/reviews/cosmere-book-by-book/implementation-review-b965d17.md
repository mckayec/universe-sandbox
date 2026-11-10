# CBR-02 residual review — b965d17

ChatGPT, 2026-11-10 UTC. Draft PR #48, `feature/cosmere-reading-state`, audited head **b965d1726c48288d2b91016ac173db1190811e70**; parent **6d36f0c4afc2c2c2c9f7cbf860226112338eb235**.

**Both CBR-02 residuals close. The bounded infrastructure return is accepted for the key-2 then key-12 mapping continuation.** CBR-01/03 closures stand. This does not certify real work mappings, the entire feature, full novels or release.

## Dispositions

| Finding | Disposition | Evidence |
|---|---|---|
| CBR-02 base gfx bypass | Closed | `gfxFor` checks the base gfx field against the world chain and returns an explicit neutral barren recipe when unmet/invalid. `baseGfx` prevents direct swatch/camera consumers restoring the gated base. Hidden world gfx also prevents public era gfx from restoring it. Public/met/absent-field and legacy controls remain. |
| CBR-02 base group name and era record bypass | Closed | `GROUP_NAME` checks the base name; `grpChain` documents an ungated group as a public container, with explicit invalid/unmet group gates hidden. Group era names intersect the group, explicit era record (bucket fallback only if absent), group field and era field. Earlier visible names remain when later ones are hidden. Omission/neutral label is used. |

Inspected **3/3 incremental patches**, actual changed engine/test files and PACK_FORMAT. Independently executed repository reading helper/UI/engine tests: **27/27 pass**. Their actual-function regressions cover invalid shapes, hidden ancestors, absent versus invalid era gates, era fallback and legacy behavior.

[Reviewer selector runner](reviewer-fields-b965d17.mjs) and [head/parent output plus input manifest](reviewer-fields-output-b965d17.json): **14/14 pass at head; 8/14 at parent**. The same six protected cases still fail at parent. The only expectation change from the preceding reviewer probe is the two gfx cases: accept a neutral barren recipe with no protected map/marker instead of an empty object, exactly as the prior review allowed. The builder's reported 12/14 therefore does not represent two unresolved product defects. All group and control expectations are unchanged.

**8/8 local input blob hashes match the exact-head GitHub tree**. The parent engine hash was independently refetched and matched before counting the negative control.

## Browser evidence and CI

Read [the rendered harness](cbr02-residual-probe.mjs) and both complete raw logs:

- Head **80/80 enforced checks**, parent **56/80 pass (24/80 fail)**, across 1440×900 and 390×844. Failures are the protected graphics and group cases targeted by this return; controls pass.
- The harness injects synthetic registry/gates into the actual Cosmere pack, marks protected base gfx and inspects `PL.key` after descent. Hidden cases require an actual built surface with the neutral recipe, no secret marker, and a neutral list swatch. Met/public/absent-field controls retain the protected marker/swatch.
- Group assertions search complete DOM text, including collapsed content. Hidden base labels use “Unrevealed group”; hidden era labels retain the visible base.
- This is **inspected builder evidence**, not a reviewer browser run or a real-book mapping audit. The production-surface test uses the existing `window.__HD=256` hook. The log's key preview is truncated to 80 characters, while the harness evaluates the full key; it is not a full exported GPU resource manifest. WebGL/GPU-stall console messages are filtered by that harness, so “no page errors” is not a blanket no-warning claim.
- CI run **42805064886**, build job **129791967444**: logs independently verify **145/145 units, 115/115 dist files and 24/24 standalone-page cases**, formatting/build success. CI checked merge **032e210dbce5dee1f08843fe6aa372a6aadba574**; **224/224 non-doc files match** the audited head, with no extra non-doc files. Deploy was skipped.

Fresh browser attempts in this run could not create a page: default Playwright executable absent; installed Chromium aborts at `process_singleton_posix.cc:297` with socket permission failure. **0 independent rendered cases**. No new screenshots, full local build, physical-device, screen-reader, full-HD GPU or Save/Load smoke certification is claimed. Prior history-navigation/safe-state evidence limitations remain as recorded in implementation-review-6d36f0c.md.

## Mapping continuation and authoring boundary

Claude resumes the key-2 then key-12 continuation under [the implementation handoff](implementation-handoff-2026-11-09.md). Preserve the separate research/implementation responsibilities: ChatGPT's source-backed packet is required for every newly promoted real gate. Infrastructure acceptance does not turn fixture IDs or numeric buckets into reviewed bibliography.

The existing [key-2 research checkpoint](mapping-checkpoint-2026-11-09.md) covers **3/3 original-trilogy bibliography entries and 1/14 event gate/copy units** (a narrow author-commentary-supported e12), with **13/14 event units and all world/site/landmark/codex/era/realm/route units still lacking a completed mapping audit there**. Those counts belong to its pinned PR37 snapshot, not a claim that current PR48 has the same expanded content. Fetch the latest PR24/PR37/main and produce the exact-head record/field/ancestor inventory before applying the packet; preserve accepted Elantris fixes and concurrent Deep Worlds changes. The PR48 Cosmere blob fetched here is **0ca2f3eedf23bd6b453240c3e047e8c50671e5d2**, the older main pack recorded in the initial audit, so branch reconciliation is a concrete required step. Do not overwrite newer accepted content with that baseline.

Keep unsupported fields conservatively held/unreviewed; do not make ancestors public to expose a child. If the next implementation unit needs missing source mappings, hand the explicit inventory back to `chatgpt` for bounded mapping research, rather than inventing gates or waiting on Mckay. Key-12 source packets (including WAT-01–15 and their holds) remain separate units; bibliography, commentary, selected primary passages and full-book coverage must stay distinct.

**Low authoring follow-up CBR-O1:** `renderCrumbs` still renders `gc.label` directly before `GROUP_NAME`. The return flags this correctly. It is a distinct configuration override, not proof that `gates.name` protects that label. The current fetched Cosmere pack has no `crumb` override. Document public-only override text in PACK_FORMAT and inventory such configuration labels before real mappings; if an override carries protected lore, gate or remove it. This does not reopen the two corrected selectors. The documented star/no-surface structural exception likewise must not carry newly promoted spoiler data.

**0/33 full-book audits approved.** No new source research or book-wide canon approval is earned by these implementation checks. Return bounded mapping changes with exact SHA, all exposure-field denominators, source holds and required first-Mistborn-only/narrowing controls; retain Mckay's separate release approval.

This run inspected **18/18 pack statuses and 8/8 review statuses** and both owned implementation returns. No stale parallel self-audit was found in the three unchanged research-ready folders. No site code/PR-branch edit, merge or deployment.
