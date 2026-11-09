# Deep Worlds release-scope manifest — PR37 03394c3

2026-11-09T22:20Z, Claude. Requested by [implementation-review-03394c3.md](implementation-review-03394c3.md) §"Canon boundary and next bounded deliverable". **Packaging of existing evidence only**: no new source reading, no application edit, no cut applied, no split/merge, no release decision.

## 0. Exact inputs

| Input | Value |
|---|---|
| PR37 head (unchanged) | `03394c32816fcb5c95261bf6a9ea4520381a5838` (`atlas/deep-worlds`) |
| Merge base with main | `51fe68887ae2d6a4c4c7b291d2df534f7bf4d7b0` (branch is 52 ahead / 353 behind main) |
| Main at time of run | the six pack files, `society.js` and `engine.js` on main are **byte-identical to the merge base**, so "vs base" = "vs what is live" |
| Evidence joined | [seven-place ledger](seven-place-ledger-2026-11-07.json) (28 selected + 139 unselected); historical 210-row `sample-reconciliation.csv` at a115b69; [Cosmere supplement crosswalk](cosmere-supplement-crosswalk.csv) (23); omission reviews c8159ae/08d10e1/2f04e41 |
| Join script | [release-scope-inventory.py](release-scope-inventory.py) (loads each pack in a Node VM at base and head; identities as in the ledger: `pack/world/site/lm`, `pack/event/id`, plus `pack/world/site` for sites, `pack/world/<id>`, `pack/codex/<id>`) |
| Output | [release-scope-inventory-03394c3.csv](release-scope-inventory-03394c3.csv): **1807 rows**, one per pack record added/changed/removed by PR37, with head selector, changed fields, class, evidence and head text |

Class rules (mechanical; no new judgement): **A** = accepted retained (ledger `narrow`/`retain` with change applied; crosswalk `supported-text`/`accepted-return-carried`/`clarification-carried`; historical `narrative-supported`). **Q** = qualified (ledger `narrow-commentary`; crosswalk `partial-primary`/`commentary-assisted`; historical `partial-or-corrective`). **O** = omitted (record live on main, absent at head). **U** = no source disposition. Society is classified separately (§2) because `society.js` is not record-structured.

## 1. Pack records (six packs)

| Kind · change vs main | Rows | A | Q | O | U |
|---|---:|---:|---:|---:|---:|
| landmark · added | 718 | 15 | 10 | – | 693 |
| site · changed (`scene` only: 396; `desc`/`name`/`books`+scene: 28) | 424 | – | – | – | 424 |
| site · added | 55 | – | – | – | 55 |
| site · removed (`hyperion/hyperion/sphinx`) | 1 | – | – | 1 | – |
| event · changed (link-only `lm`/`site`/`fx`: 271; text/title: 34) | 305 | 9 | 3 | – | 293 |
| event · added | 215 | 4 | 3 | – | 208 |
| event · removed | 9 | – | – | 9 | – |
| world · changed (`blurb`/`eras`/`facts`/`status`/`hero`) / added | 63 / 1 | – | – | – | 64 |
| codex · changed / added | 15 / 1 | – | – | – | 16 |
| **Total** | **1807** | **28** | **16** | **10** | **1753** |

A and Q rows are listed by identity in the CSV (filter `class`). Notes:
- Kholinar `palace` is A on the later ledger `retain` (SP25) though its crosswalk row CS01 was `partial-primary`.
- The 8 ledger holds (SP02–SP04, SP09–SP16) are **absent at head**: hold landmarks/events added by PR37 were omitted before reaching main, so they are not delta rows; b1n/b2b/b3f were live on main and appear as O.
- O rows b7c (sun-eater) and b2k/b3b (hyperion) come from earlier accepted omission batches; this packet did not re-trace the source decision for b7c — flagged for ChatGPT, not re-opened.
- 396 `scene`-only site changes carry enumerated model parameters (`kind`, `arch`, `size`, `tod`, `weather`, `sky`; validator enums), not prose. They are **model geometry**, not canon claims; listed U because no review accepted them as such.

### 1.1 Reconciliation of the historical 139 unselected records

| State at 03394c3 | Count |
|---|---:|
| U, added by PR37 | 97 |
| U, changed by PR37 (link/text) | 30 |
| Unchanged vs main (already live, outside PR37 delta): `dune/event/c1`, `foundation/event/f2c`, `f6j`, `f7b`, `f7d`, `expanse/event/b4b` | 6 |
| Q (historical partial sample): `foundation/trantor/hotel/terminal`, `sun-eater/delos/devilsrest/castle` | 2 |
| O (removed): `expanse/event/b3i`, `b7d` | 2 |
| A via other evidence: `cosmere/event/e6` (CS05), `cosmere/scadrial/luthadel/channerel` (CS03) | 2 |
| **Total** | **139** |

All 139 identities resolve; none is declared false or verified by this manifest.

## 2. Society (`society.js` +6461/−1252, `society.css`, `society.html`, tex/helios2_*, tex/siege_*, `tests/society-transitions.test.ts`)

| Status | Selectors / units |
|---|---|
| Omitted (accepted) | SO1–SO3 prologue module (08d10e1); SO4/SO5 garden/centralcmd + held clauses + e9 Aja clause (2f04e41); flood c–e and unqualified F6–F8 copies (68d47ce) |
| Qualified/model (accepted with visible qualification) | flood option A provisional treatment (`surges drown Tyche` + Orion clause, non-historical-baseline note); Tyche `SITE_FROM` V; Europa VI boundary incl. late `LEV_TEXT` |
| Unreviewed | everything else added by the merge of the Society Atlas; 0/6 legacy rows primary-verified; the 676-row historical gate suite not rerun |

Society is a **separate page** (`society.html` loads only three-r128, `standalone.js`, `society.js`); `engine.js`/`places*.js` reference neither `society.js` nor any `tex/` file. The added textures are used only by `society.js`. Society is therefore separable from the pack/places work without a code dependency.

## 3. Proposed release slice R1 — "places engine + accepted-text scenes"

Dependency-closed by construction; uses only accepted technical changes and A content.

**Include**
1. Technical: `engine.js` (places integration and accepted DWT-01/02/03, DWO-E2, DWO-S1 fixes), `places.js`, `places-lm.js`, `places-fx.js`, `places-audio.js`, `engine.css`, `index.html` (+4 lines: loader), `package.json` (format list), the PACK_FORMAT 22 parts of `tests/atlas-pack-validator.mjs`, the non-Society parts of `tests/check-dist.mjs`.
2. Scenes: the `scene` model object (no landmarks) on the 396 scene-only sites and on the 28 sites whose `desc`/`name`/`books` changed — **with main's `desc`/`name`/`books` kept** (`places.js` 1858 filters an empty landmark array; procedural city/terrain still render).
3. Landmarks: the **15 A landmarks** only. Q landmarks (10) are a ChatGPT decision: include with qualification, or leave out.
4. Events: main's text for every event, plus the **13 A event changes/additions** (`foundation` f1a2, f1b; `sun-eater` b1b, b1k; `cosmere` e1, e2, e6, e9, e15, e16, e17, e77, e78). An `lm` link is kept only when it targets an included landmark.
5. Omissions: the 10 O removals (already accepted).

**Exclude**: 693 U landmarks; 55 added sites (one exception below); 208 U added events; 293 U event changes (incl. 270 link-only site/landmark re-pointings, which are location claims); 64 world and 16 codex changes; all Society files, textures and `society-transitions.test.ts` (later slice S2 after Society canon).

**Dependency that blocks a fully clean R1** — `foundation/trantor/hotel` is an **added site** (U desc: "From the spaceport to his hotel: Gaal Dornick's first day on Trantor, and his first meeting with Hari Seldon.") that hosts A landmark `hotel/tower` (SP05) and Q `hotel/terminal`. Options: (a) drop `hotel/tower` from R1 (14 A landmarks), or (b) ChatGPT accepts/narrows the one site desc. Recommendation: (a), no new research. No other A landmark sits on a U site (the other 7 host sites exist on main).

**Fallback R0 (engine-only)**: item 1 only, packs and Society as on main. Clean and lowest-risk, but places stay dormant (no `scene` data). Use if ChatGPT rules that `scene` model parameters themselves need canon review.

**Overlaps**
- **PR24** (`fix/lore-corrections`, cf25cda, awaiting Mckay): edits all six packs (cosmere +13/−14, hyperion +108/−109, expanse +21/−14, …) and `society.js` +215/−63. R1 must be built on whichever base is current after the PR24 decision; PR24 edits to event text win over main's text in R1 item 4.
- **PR39** (abrahamic, awaiting Mckay): `engine.js` +65/−15 and `engine.css` — textual merge conflict likely; re-run the engine probes after integration.
- **PR48** (Cosmere reading-state, draft): no file overlap yet; semantic overlap on Cosmere book gating of e-events — R1 keeps existing gates.
- 353-commit gap to main: R1 must be constructed on a fresh branch from current main, not by trimming PR37.

## 4. Validation and visual matrix for R1 (at the R1 exact head)

| Gate | Requirement | Carried from |
|---|---|---|
| Construction check | script proving every included pack leaf is main, A, accepted O, or `scene` model; 0 dangling `site`/`lm` refs; Society files byte-identical to main | new (like hold-omit-check) |
| Build/tests | `pnpm check`, `test:pages`, `test:browser` with complete logs **plus an exact-head CI run** | 03394c3 review: 0 exact-head CI runs |
| Engine probes | rerun DWO-S1 (reviewer + builder), DWT-01c/02/03 traces, DWO-E2 matrix on R1 head; drop Society-only probes (dwd-*, leviathan, flood, stale) | prior accepted scopes, not re-certified |
| Visual | atlas index + one place per pack (Arrakeen, Trantor commission, Devil's Rest, Luthadel, Kholinar, Medina or other Expanse scene, one Hyperion scene) at 3840×2160, 1440×900, 1280×800, 390×844 = **28 slots** (Society's 4 move to S2) — empty-landmark scenes must be checked for readability | technical-disposition-5bfde31 §4 (32 → 28) |
| Known gaps kept | pointer-hit/device timing, real-GPU performance, Save/Load flake (mobile-entry-usability), geometry plausibility | technical-disposition-5bfde31 |
| DWT-03-R1 | no tree-bearing pack in R1 → trigger not hit; fix and verify before any tree pack integrates | unchanged |

## 5. What this asks

ChatGPT: finite scope review of R1 vs R0 (and hotel option a/b; Q landmarks in/out). Only after an accepted proposal would a Mckay-only scope question (ship R1 now, Society later) be opened in DECISIONS.md. PR37 itself stays open and unchanged.
