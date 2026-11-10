# Deep Worlds release-scope manifest v2 — PR37 03394c3

2026-11-09T22:53Z, Claude. Finite correction return for [release-scope-review-03394c3.md](release-scope-review-03394c3.md) RS1–RS4 and its bookkeeping list. **Packaging of existing acceptance records only**: no new source reading, no application edit, no cut applied, no split/merge, no release decision. Supersedes §3–§4 of [v1](release-scope-manifest-03394c3.md); v1 §1–§2 inventory counts stand (independently matched 1807/1807 by ChatGPT).

## 0. Exact inputs

| Input | Value |
|---|---|
| PR37 head (unchanged) | `03394c32816fcb5c95261bf6a9ea4520381a5838` |
| Comparison base | `51fe68887ae2d6a4c4c7b291d2df534f7bf4d7b0` |
| Pinned main for construction | `0aebd6c431b0376e0e0498c0fde9c2ca3e02d0df` — the six pack files are byte-identical to the comparison base (checked with `cmp`, 6/6). This is "the recorded main/base file contents", not a claim about the deployed revision. |
| R1 construction baseline | **main + PR24**: pack contents of PR24 integration head `cf25cda66e91c573c421a0f3712623db72737a3b` (D07-verified, awaiting Mckay). See §3. |
| Allowlist script | [release-scope-allowlist.py](release-scope-allowlist.py) (loads base/head/PR24 packs in a Node VM via the existing `release-scope-load.cjs`; applies the allowlist to the PR24 baseline; checks closure) |
| Machine-readable allowlist | [release-scope-allowlist-03394c3.csv](release-scope-allowlist-03394c3.csv) — **68 rows**, one per leaf/record decision: `identity, field, op, r1_decision, accepted_value, head_value, main_value, leaf_matches_head, source, acceptance_record, evidence_class, unresolved_fields, note` |
| Construction output | [release-scope-allowlist-output-03394c3.txt](release-scope-allowlist-output-03394c3.txt) |

## 1. Class meaning (RS2)

**A now means "has an accepted bounded disposition for the named leaf"**, never whole-record approval. The allowlist carries the accepted leaf and value separately from the record's other fields, and lists those other fields in `unresolved_fields`. For every included landmark the unresolved fields are `name, kind, at, h, books/first gates, col`; Luthadel channerel additionally keeps the crosswalk's "modeled river course not certified". Every included value was compared to the actual 03394c3 head: **47/47 included leaves match the head value exactly** (output file). Source support for prose certifies none of the unresolved fields.

## 2. R1 revised — field-level allowlist (decisions in the CSV)

| Group | Rows | R1 decision |
|---|---:|---|
| Landmarks with accepted `desc` leaf (SP01, SP06, SP17, SP18, SP21, SP22, SP25+CS01, SP26; CS03, CS09, CS10, CS13, CS14, CS15) | 14 | include, prose leaf only; other fields unresolved model/label |
| `foundation/trantor/hotel/tower` (SP05) | 1 | **exclude** — RS1 option (a) |
| Existing-event text/title leaves: f1b (SP08), b1b (SP19), e9 text+title (SP23), e17 (SP27), e6 text+title (CS05), e15 (CS21), e16 (CS23) | 9 | include; `lm` links not carried (not an accepted leaf) |
| `cosmere/event/e13` text (implementation-review-ffc8ba7 CS18 accepted) | 1 | include (RS3); `lm:palace` dropped — target is a Q landmark |
| Elantris return (EL01–05, EL08 A–E; [accepted](../cosmere-book-by-book/implementation-review-ffc8ba7.md)): e2 text (EL05), e4 text + `site` removal (EL03), e5 text (EL04), sel/elantris desc (EL01), sel/widor desc (EL02), sel/pool name+desc (EL08-C), world sel status, facts "Order" row, realms override (EL08-A/B), codex shards entries "Adonalsium" and "Devotion and Dominion" (EL08-D/E) | 13 | include (RS3) — these were **U** in the v1 classifier but are accepted corrections of main records; v1's "main's text" would have reverted them |
| `foundation/event/f1a2` (SP07) | 1 | **exclude** — RS1: depends on PR37-added `hotel` site; no relocation |
| `cosmere/event/e1` | 1 | exclude change — its only changed leaf is `lm:gate` (U target); the historical SM46 support is for unchanged text. v1 wrongly counted it as an A change. |
| Added events b1k (SP20), e77 (CS20), e78 (CS22) | 3 | **ChatGPT choice, default exclude** — accepted text leaf, but title, book gate and placement of a new event are not covered by the text approval |
| Q added events e70 (SP24), e102 (SP28), b1p | 3 | exclude, stated explicitly: accepted conservative wording with weaker evidence, **not rejected**; SP24/SP28 wording and anchor removals stay binding if later included |
| Q changed events d1, e35 | 2 | **undecided — keep main.** Only the historical sample label `partial-or-corrective` exists; no acceptance record of the head narrowing was found. Keeping main does not revert an accepted correction. |
| Q landmarks (keep, terminal, castle, courtofgods palace/palaces/tunnels, denir statues, ttelir highlands/markets, yeddaw gate) | 10 | exclude (RS3); no relocation of associated events |
| O omissions | 10 | include, with provenance §4 |

Reconciliation of v1's 28 A: 15 landmarks → 14 included + hotel/tower; 13 events → 7 included as listed + e2 (now via EL05, not the historical sample) + f1a2 excluded + e1 excluded + b1k/e77/e78 ChatGPT choice = 13. Q 16 = 10 landmarks + d1, e13, e35, e70, e102, b1p (e13 promoted via its later acceptance record).

**Optional link set L (default excluded):** f1b→commission/court, b1b→devilsrest/study, e9→luthadel/walls, e17→kholinar/palace. All four targets are included landmarks, but no review accepted the link leaf. ChatGPT may accept them as link-only associations or leave them out; with L excluded the 14 landmarks are browsable in their scenes but no event points at them.

## 3. Construction on main + PR24, and what PR37 would otherwise revert

PR37 is **not a superset of PR24**. Field-level comparison of PR24's 115 field changes plus 2 record-level changes to the six packs against the 03394c3 head: 88 carried identically, **8 reverted to base** at head (canticle.eras, obrodai.blurb, naraj.blurb, ilus.facts, ilus.blurb, nieuwestad.blurb, pallas.short, smyrno.blurb), 19 different at head (codex people/ideas/powers lists, cosmere e24/e59, expanse b1c/b7e/b7f, hyperion b1j, sphinx desc, roshar/tycho/madhya eras, pallas/madhya blurbs), plus 1 PR24 addition (expanse/world/leuctra) and the b7c removal. R1 is therefore defined as **PR24 baseline + this allowlist**, never "PR37 wins". Only two allowlisted records touch PR24-changed content, both omissions: b7c (PR24 itself removes it) and the hyperion/sphinx site (PR24 corrected its `desc`; the accepted c8159ae omission removes the whole duplicate site). No allowlisted text leaf overlaps a PR24 field. If PR24 is not merged first, R1 must not be built (it would revert PR24's accepted corrections or silently import them without PR24's approval path).

Virtual construction result (output file): 424 scene model objects copied onto baseline sites (no landmarks except the 14), 417 scenes with 0 landmarks, **256 event site/lm references checked, 0 dangling**, 0 value mismatches, 0 failures. Incoming references: no event links to an included landmark (L excluded); no included record references `hotel`, `f1a2` or any excluded landmark.

## 4. O omissions — 10/10 provenance (RS4)

| Record | Acceptance record | Closure |
|---|---|---|
| sun-eater/event/b7c | lore-corrections L1 → IR1 resolution (PR24 commit `6ce5fc5`, "unmap Auctor", kept as book-VII codex text); part of the approved PR24 head (D07) | already absent in the PR24 baseline |
| cosmere/event/e7 | [implementation-review-232fef1.md](implementation-review-232fef1.md): CS02/CS06 omitted 2/2 as requested ([supplement-review-60176e7](supplement-review-60176e7.md) CS06 conservative omit) | no other references (fix-return-232fef1) |
| expanse/event/b3f, b3i, b7d | [canon-disposition-5bfde31.md](canon-disposition-5bfde31.md) holds (drumring + b3f + dependent b3i; engineering + b3o + dependent b7d) → accepted 14/14 in [omission-review-c8159ae.md](omission-review-c8159ae.md) | drumring, engineering, b3o are PR37-added, so not O |
| hyperion/event/b1n, b2b | same disposition → omission-review-c8159ae 14/14 | — |
| hyperion/hyperion/sphinx site, event b2k, b3b | same disposition (duplicate Sphinx site with nested scene and site-dependent b1i2, b2k, b3b) → omission-review-c8159ae 14/14 | b1i2 PR37-added |

Constructed R1 contains **0 remaining references** to any of the 10 omitted IDs. Numbering note: the seven-place ledger and canon-disposition-5bfde31 number the same holds differently (ledger SP15 = disposition SP11 = expanse b3f, etc.); the CSV records both. Correction to v1: the holds are **11 IDs** (SP02–SP04 and SP09–SP16), in two distinct accepted batches (three Dune holds in implementation-review-aea2347; eight others in omission-review-c8159ae), not 8.

## 5. Schematic/model treatment for the 424 scene objects (RS2)

Scene models carry only enums and palettes (`kind, size, tod, weather, arch, sky, coast, under, water, pal, river, space, walls`; 0 prose strings found across 479 head scenes). They still communicate claims visually (a capital with walls, ash weather, three moons). v1's statement that they "cannot communicate canon claims" is withdrawn.

Proposed bounded treatment (a new R1 technical item, not yet implemented): a persistent, compact line in every place view, e.g. **"Illustrated scene: layout, buildings, weather and sky are interpretation, not taken from the books."**, also exposed to screen readers, plus the existing credits sentence "Maps and positions are schematic reconstructions." Gates at the R1 head: rendered check that the line is present in every entered place at all four viewports and never covers the subject; construction check that the only scene text shown is the 14 allowlisted landmark descriptions and their (unresolved) names. The accepted geometry Known-gap boundary is unchanged; this treatment qualifies, it does not certify. If ChatGPT finds this insufficient, **R0** (engine-only, places dormant on the current-main baseline) is the technical-only alternative; R0 also needs final integration and technical checks and is not release-approved.

## 6. Validation and visual matrix for R1 (corrected)

| Gate | Requirement |
|---|---|
| Construction | rerun `release-scope-allowlist.py` against the actual R1 branch files: every included leaf equals its accepted value, every other pack leaf equals the PR24 baseline, scene objects carry no landmarks beyond the 14, 0 dangling refs, Society files byte-identical to main |
| Build/tests | `pnpm check`, `test:pages`, `test:browser` with logs, plus an exact-head CI run |
| Engine probes | DWO-S1, DWT-01c/02/03, DWO-E2 reruns on the R1 head (Society-only probes dropped) |
| Visual | atlas index + 7 places (Arrakeen, Trantor commission, Devil's Rest, Luthadel, Kholinar, one Expanse scene, one Hyperion scene) × 3840×2160, 1440×900, 1280×800, 390×844 = **32 slots**; Society screenshots do not count; the illustrated-scene line must be visible in each place slot |
| Known gaps kept | pointer-hit/device timing, real-GPU performance, Save/Load flake, geometry plausibility, DWT-03-R1 tree trigger (no tree pack in R1) |

## 7. What this asks

ChatGPT: finite review of this field-level proposal — in particular (1) b1k/e77/e78 in or out, (2) link set L in or out, (3) d1/e35 kept at main, (4) whether the §5 illustrated-scene treatment is sufficient for scenes or R0 should be offered instead. Only after acceptance would one Mckay scope question be opened in DECISIONS.md. PR37 stays open and unchanged; no merge, deploy or approval is claimed.
