# Research review: abrahamic-world-religions (Claude, AUDIT_CHECKLIST §2)

2026-10-28. Reviewed research at main `f7b74e7bec5b75a9e83666e6fd873f1f21630d0f` (acceptance commit; files unchanged at main `772267a`). Inputs read: `research.md`, `build-contract.md`, `acceptance-review.md`, `checkpoint-validation.md`, `research-audit.md`, `judaism-research.md`, `christianity-research.md`, `islam-research.md`, `comparative-evidence.md`, `gazetteer-evidence.md/.csv`, `identity-and-edges.md/.csv` (328 rows: 293 identity, 16 edge, 19 nonmerge). No `research-addendum.md` exists yet, so there are no addendum items to dispose of.

**Verdict:** accepted for building. The research is unusually careful about what it does *not* claim, and the build contract is binding on me. It does not fit the current tree view (PACK_FORMAT §21) without new engine work, which I describe in §3 and will build generically in `tree.js`. Questions Q01–Q07 below do not block the start of the build; Q01 and Q02 affect what the finished atlas can show.

## 1. Template and engine fields

| Check | Result |
|---|---|
| Meta, notice, theme, structure, places, events, journeys, codex, open questions, Track A sections | Present in `research.md` and each dossier. |
| Stable IDs | Yes: `jud-*`, `chp-*`/`che-*`/`ch-*`, `IS*`, `X*`, `gaz-*`; crosswalk gives canonical IDs. I will use the canonical IDs from `identity-and-edges.csv` as pack IDs. |
| Coordinates | 10 map-ready anchors (8 `gaz-*` + `jud-jerusalem`, `jud-babylon`). I re-converted all 16 DMS values in `gazetteer-evidence.csv`: they match to 6 decimals. Every other place is reference-only by design. |
| `first:` gate | `first:1` everywhere (one overview gate). Fine for a historical atlas: there is no reading order to spoil. |
| Dates | Display strings with explicit precision; numeric values only where the source supports a year. Good, but most tradition nodes have **no** numeric date (see R1). |
| Relations | About 40 distinct relation labels across dossiers (e.g. `family-membership`, `successor-tradition`, `merger`, `legal-school-within`, `authored-comparison`). Exact labels are kept; see §3 E2 for how they are drawn. |

## 2. Findings (contradictions, gaps, unclear positions)

| ID | Sev. | Location | Finding | Proposed handling |
|---|---|---|---|---|
| R1 | High | islam §6, christianity §6/6a, judaism §6 | Most tree nodes (all Islamic traditions, legal schools and orders; most Jewish streams; Christian families) have a century, a period or no date at all. The current tree requires a numeric `when` per node. | Engine E1 (uncertain emergence windows from the source's own wording) and E3 (a non-chronological "by relationship" view where every node appears). No date is invented. |
| R2 | High | gazetteer §Reused | Islam has no map pin for Mecca or Medina, and Christianity none for Nicaea, Ephesus, Chalcedon, Antioch, Alexandria, Zurich, Fayette or Azusa Street. An Abrahamic map whose Islamic origins sit only in a reference list will read as broken to visitors. | Build with the 10 anchors now (reference-only places listed beside the map, as the contract requires). Ask for more anchors: Q01. |
| R3 | Medium | build-contract §PR28 | Mergers (Stone–Campbell; Liberal + Reform → Movement for Progressive Judaism; P'nai Or + Shalom Center → ALEPH) need two predecessors. | Engine E2: a `merger` relation drawn into the node from each predecessor, so no one predecessor becomes the sole parent. |
| R4 | Medium | research.md title vs scope | Pack title in status mentions ties to Buddhism, Taoism and Hinduism; research supplies bounded contact records only (XE01–06, XC01–04, XJ01). | Show these as "Encounters" nodes and labelled contact ties, never as branches. Title/description per `research.md` §1 ("Religious Traditions: Origins and Connections"). Q04 confirms Sikh and Bahá'í node treatment. |
| R5 | Low | judaism §4 jud-e15 | Event IDs jump from `jud-e14` to `jud-e16`; no `jud-e15` exists. Looks like a removed row, not a missing one. | No action unless Q07 says otherwise. |
| R6 | Low | christianity §4 che-methodist-us, che-stone-campbell | Events tied to reference-only regions (North America, Lexington). | Chronicle entries open the reference card, not a map point (E4). |
| R7 | Low | comparative XD01–07 | 2020 estimates (published 2025) must not look like current or additive counts. | Codex table titled "Population estimates (2020, published 2025)" with the method note; no map shading, no sums. |

No internal contradictions found between dossiers and the crosswalk: the 1866/1867 Deoband conflict, 1054/1965, 781/635 and Bahá'í 1844/1863/1963 distinctions are consistent everywhere and will be shown as stated.

## 3. Engine work this pack needs (generic, reusable; built in `tree.js`/`layers.js`)

| ID | Feature | Design |
|---|---|---|
| E1 | Uncertain emergence | New node fields `emerge:[earliest, latest]` plus `whenText` (the source's own words, e.g. "sixteenth century"). Drawn as a faded ramp across the window, then a solid bar; details read "Emerged: sixteenth century (no single founding date)". Distinct from `when:[from,to]` lifespans. Nodes with no defensible window use `undated:true`: no bar, a short "no single founding date" mark, listed in the relationship view. Centuries convert literally (sixteenth century = 1501–1600); see Q02. |
| E2 | Typed relations | `links[].type` from a fixed vocabulary grouped into visual families, with the exact research label shown on hover and in details: **development/branch** (solid), **within / membership** (thin solid), **succession / division** (solid with split mark), **merger** (two converging solids), **overlap / cross-cutting** (dashed), **contact / comparison / translation** (dotted), **separation & reconciliation history** (dash-dot), **context** (faint). A legend lists only families the pack uses. `parent` remains optional; nodes may be placed by their strongest typed link instead. |
| E3 | "By relationship" view | A toggle in the tree dialog: *By date* (current chart, dated/windowed nodes) and *By relationship* (an indented, collapsible outline grouped by the research's hierarchy, every node present, typed ties listed under each). Works on phones without horizontal scrolling. |
| E4 | Reference-only places and events | A "Places without a map point" list in the place index and codex, and events that open a codex card when they have no anchored site. No `lat/lon` defaults; validator rejects a site with missing coordinates instead of defaulting to (0,0). |
| E5 | Nonmerge notes | Nonmerge constraints become short "Not the same as …" notes on the affected cards (e.g. Babylon vs Babylonia, Eastern vs Oriental Orthodox). Not drawn as edges. |

The LDS (PR #33) and apocrypha (PR #38) branches change `engine.js`/`layers.js`; E1–E3 live in `tree.js`, which neither touches, so the three PRs should not conflict. The pack will use the improved Earth bake once PR #33 is merged.

## 4. Build plan and checkpoints

Branch `pack/abrahamic-world-religions` from main. Layers: Judaism, Christianity, Islam, Encounters (Q04). Checkpoints, each with `pnpm check` and screenshots: (1) engine E1–E5 with tests and the demo fixture; (2) pack skeleton, meta/notice/theme, 10 anchors, reference places; (3) Judaism nodes, events, journeys; (4) Christianity; (5) Islam; (6) comparative encounters, demographic table, crosswalk notes; (7) polish, 4K/1440/1280/390 screenshots, PR and `build-report.md`. Only (C) content is built; copy is the research's proposed copy, lightly shortened where labels must stay compact.

## 5. Questions for ChatGPT (answer in `research-addendum.md`)

| ID | Question |
|---|---|
| Q01 | **Priority.** Can you supply source-cited representative coordinates (same contract as `gazetteer-evidence.md`) for at least: Mecca, Medina, Karbala, Kufa, Najaf or other Shia shrine city you judge appropriate, Nicaea (İznik), Ephesus, Chalcedon (Kadıköy), Antioch, Alexandria, Zurich (Grossmünster or similar), Fayette NY (Peter Whitmer farm), Azusa Street, Xi'an (Beilin), Shiraz, Baghdad, Acre (UNESCO Bahá'í holy places), Seesen, Hamburg, Philadelphia, New York? Without these the map shows Islam only at Jerusalem, Cairo, Ghardaïa and Zanzibar. |
| Q02 | Do you accept literal century/period → window conversion for E1 (e.g. "eighteenth century" → 1701–1800, "seventh century" → 601–700, "early 1600s" → 1601–1630?) with the source wording always displayed? If "early 1600s" or "early centuries CE" are too vague to convert, I will mark those nodes `undated` instead. Please list any node you want `undated`. |
| Q03 | Root hubs `judaism`, `christianity`, `islam`: I plan `undated:true` for Judaism (no single founding date), `emerge` "first century CE" for Christianity's early communities with the hub itself undated, and Islam's hub dated only via event ISE01 (traditionally 610) shown as tradition, not as the node's start. Acceptable? |
| Q04 | Sikh (XC01, Guru Nanak 1469–1539) and Bahá'í (XC02/XE05/XE06): show as Encounters-layer nodes with typed contact ties (`contextual-engagement`, `declared-religious-claim`), no parent edge. Agree? |
| Q05 | Islamic legal schools (ISL01–08) and Sufi orders (ISO01–06): shown only in the relationship view and as codex entries, not as date bars (no dates supplied). Agree? |
| Q06 | Proposed notice in `research.md` §1 will be used verbatim, plus the standard fan-work/independent-atlas notice and back link. Any change? |
| Q07 | Is the missing `jud-e15` (R5) intentional? |

## 6. Build checkpoints

### Checkpoint 1 (2026-10-28): engine E1–E3, E5 — branch `pack/abrahamic-world-religions` at `f69a2b6883571d6c358c80608ab204d5d6821aa2`

Built (generic, documented in PACK_FORMAT §21.1, fixture `tests/fixtures/tree-typed-demo.js`):
- **E1** `emerge:[a,b]` + `whenText` (ramp, then solid bar; text shows the source's wording, e.g. "Emerged: sixteenth century") and `undated:true` (open ring + dotted line; text and aria say "No single founding date"; never given a year; never faded by the year filter). Undated nodes are drawn where their earliest dated branch begins, or under their parent, only for placement.
- **E2** fixed relation families on `parentType` and `links[].type` (branch, within, division, merger, overlap, contact, history, context) with the exact research label in `parentRel` / `rel`; `merge:[…]` bodies are drawn from every predecessor and listed under "Formed by merging" (no sole parent). Key lists only the families used. Validator rejects unknown families, bad windows, merge loops.
- **E3** "By date" / "By relationship" toggle; the relationship view is a collapsible outline of every visible node with its typed ties; the branch holding the picked node opens; no horizontal scroll at 390 px.
- **E5** `notSame:[{id,t}]` on tree nodes ("Not the same as"), and a `notsame` place-note label for nonmerge places.
- Split: `tree-view.js` (DOM controller) and `tree-rel.js` (relations, outline) so `tree.js` stays under 800 lines; `index.html` loads tree-rel → tree → tree-view.

Checks at that SHA: `pnpm check` (format, build, 92/92 tests, check:dist) pass; `pnpm test:pages` 12 pages × 2 viewports pass. Fixture screenshots at 3840×2160, 1440×900, 1280×800, 390×844 (date view, relationship view, merged node picked): no console errors, no horizontal page scroll; looked at. `pnpm test:browser` times out at its simulator step (line 88, `waitForFunction`) in this sandbox, identically on unmodified main, so it is environmental and unrelated to the atlas.

Not yet built: **E4** (reference-only places list in the place index/codex, events that open a codex card without a site) is moved to checkpoint 2, where the pack's reference places first exist; the validator already rejects sites without numeric coordinates.

Next: checkpoint 2 (pack skeleton, meta/notice/theme, 10 anchors, reference places with E4).
