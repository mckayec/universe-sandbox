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

### Checkpoint 2 (2026-10-28): pack skeleton, anchors, reference places, E4 — branch `pack/abrahamic-world-religions` at `9ab2c9b61ccdbb626821055324973f942bb1b8e0`

Built:
- **E4** (generic, PACK_FORMAT §13.1): codex entries take an `id`; a world's `refPlaces` names a codex tab and adds a "Places without a map point" section with a button to it; an event's `ref` names a codex entry (Chronicle shows "<name> · no map point"; the open event gets a "Reference card" button that opens the codex at that entry, highlighted; only the codex body scrolls). Validator rejects dangling `ref`/`refPlaces` and duplicate entry ids; sites without numeric lat/lon were already rejected.
- **Pack** `public/atlas/packs/abrahamic-world-religions.js`, registered in `registry.js` and `src/universe-packs.ts`: title/description and the proposed notice from `research.md` §1 verbatim (Q06 still open), warm stone / ink blue / gold theme with an original non-religious sigil, one overview gate, layers Judaism / Christianity / Islam / Encounters (filters, said not to be population categories), Earth start at Jerusalem.
- **Ten pins only**: the eight `gaz-*` components at the CSV decimals plus `jerusalem` and `jud-babylon`; each heritage marker carries a "Heritage reference … not the exact place of an event" note and the source's scope limit. Jerusalem is one city-level record with separate Christianity and Islam notes.
- **59 reference cards** (codex tab "Places without a map point"), ids = canonical ids from `identity-and-edges.csv` (shared `london`, `cairo`); city records for Rome, Constantinople, Wittenberg, Cairo, M'zab and Zanzibar name their heritage marker without merging into it. Place non-merges (Babylon/Babylonia/Baghdad, Egypt/Cairo, Land of Israel/Jerusalem, Zanzibar island/town, Xi'an/Nanjing, East Syriac region/Babylonia, Bareilly/Rae Bareli) shown as "Not the same as" text.
- `tests/atlas-abrahamic.test.ts`: pins equal the ten gazetteer coordinates; every `place` identity in the crosswalk is a pin or a card; cards have no coordinates; validator E4 rules.

Checks at that SHA: `pnpm check` (format, build, 97/97 tests, check:dist) pass; `pnpm test:pages` 12 pages × 2 viewports pass. Screenshots at 3840×2160, 1440×900, 1280×800, 390×844 (start at Jerusalem, Earth details with the reference section, codex): no console errors, no horizontal scroll, 59 cards render; looked at.

Seen, to fix in checkpoint 7 (polish), not blocking: the long title wraps to three lines at 390 px and surface labels can draw over the header there; at 1280 px the layer bar scrolls sideways ("Encounters" clipped) — PR #38 already carries a wrap fix for 821–1400 px; the codex dialog sits low in headless screenshots on main packs too (pre-existing); Earth texture is soft at 4K close zoom (PR #33's Earth bake should help once merged). Event `ref` is exercised by the validator test only until events exist (checkpoint 3). No timeline yet: added with the first dated events.

Next: checkpoint 3 (Judaism tree nodes, events, journeys).

### Checkpoint 3 (2026-10-28): Judaism — branch `pack/abrahamic-world-religions` at `445ea21cbfab984cc43169da2c30126851c5c133`

Built from `judaism-research.md` §4–§6 and §8 (with the JA01 correction from `judaism-record-audit.md`), ids from `identity-and-edges.csv`:
- **Tree (29 nodes, 8 typed links).** Every Judaism tradition/concept, historical-movement, intellectual-context, institution, organization and overview record is a node; `jud-pluralism` is folded into the Judaism hub's notes (it is an explanatory entry, not a tradition). Opens in the *By relationship* view. Dates: `undated` with the source's wording for Judaism, the covenant tradition, ancient Israel/Judah, Josephus's three groups ("Late Second Temple period"), Rabbinic Judaism ("Early centuries CE onward", per Q02), Orthodox and its two streams, Renewal, the mystical/Haskalah contexts and the pre-merger organizations; literal century windows for Ananites (701–800), Karaites (801–900, "apparently ninth century"), Hasidism (1701–1800), Reform and Conservative (1801–1900), Reconstructionist and Humanistic (1901–2000); years only for the Second Temple frame (c. 515 BCE – 70 CE), JTS (1886), ALEPH (1993) and the Movement for Progressive Judaism (2026). Mergers JU-R17/R18 drawn from both predecessors (`merge`). Ledger ties: covenant→rabbinic and Haskalah→Reform and JTS→Conservative as `context`; Ananites→Karaites and mystical→Hasidism as `contact`; Karaites↔Rabbinic as `history`; Hasidic↔Haredi as `overlap`; ALEPH→Renewal as `within`. No forbidden parentage (Pharisees→rabbis, Sadducees→Karaites, Hasidism→Orthodox). Children of the overview hub say "grouped in this overview", not a classification. Non-merges AI311 (Karaites/Sadducees) and AI312 (Orthodox Judaism/Eastern Orthodox) as "Not the same as" notes; the second gets its node link in checkpoint 4.
- **Chronicle (17 events, jud-e00 … jud-e16).** Each carries the source's own date wording (new generic `whenText`, PACK_FORMAT §20.2); numeric `when` only drives the year filter and is omitted for jud-e00, jud-e00b and jud-e05. Sites only at Jerusalem or Babylon; otherwise the event opens a reference card (E4). jud-e11 (SAJ 1922) has no place at all: "Location not given by the cited source" (JA01). jud-e07 says "Eastern Europe · regional context, no map point".
- **Journeys** jud-j01–j04 as a codex tab "Journeys and spread": ordered reference sequences, explicitly not drawn routes (research §5 forbids polylines). **People**: the nine source-qualified roles in a "People" codex tab.
- Timeline −800…2030 (BCE/CE) with one descriptive era, the Second Temple frame.
- Tests: every Judaism crosswalk record is built; no year where the research gives none; SAJ location withheld; forbidden parentage absent; both merger predecessors kept; `whenText` shown instead of numbers and validated.

Checks at that SHA: `pnpm check` (format, build, 101/101 tests, check:dist) pass; `pnpm test:pages` 12 pages × 2 viewports pass. Screenshots (relationship view with Karaite Judaism picked, date view, Earth + Chronicle with jud-e06 open) at 1440×900, 1280×800, 390×844, and the relationship view at 3840×2160: no console errors, no horizontal scroll; looked at. The other 4K views exceed the software-WebGL time budget in this sandbox (Earth at 4K was captured in checkpoint 2).

Seen, for checkpoint 7 (polish), not blocking: in the date view undated nodes are drawn at their parent's start or the axis start with open rings, which can look like a date at first glance (the header says "18 without a single founding date", and the relationship view opens first); at 4K the tree dialog keeps its desktop size and could use more of the screen; the pack file is ~700 lines and will pass 800 with Christianity, so checkpoint 4 splits per-tradition data into helper files.

Next: checkpoint 4 (Christianity nodes, events, journeys). Q01–Q07 still open.
