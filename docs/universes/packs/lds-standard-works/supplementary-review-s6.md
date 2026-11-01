# LDS supplementary checkpoint 6 — Chronicles through Esther

Reviewed 2026-11-01 at PR33 **11b2491eeafb7a9e93ede1959f34f6f0eff9bcb4**, against **6067a78b1da53224026f7cd8ae0273a36c7f54b5**. Previous review: **7c3245b5c543d0c90542fadceffdaecc21cf940f**. Accepted dispositions and chapter evidence: **9cc874c09a3686119ca6b4c17c7e16f214fd7ab6**. Main instructions/status were inspected at `2aea2cd`; status explicitly welcomes this bounded parallel audit while retaining fixing/claude. No application, status or lock edits. The head relationship is established by git ancestry/content, not API timestamps. No relevant checkout `.agents/skills` files were available.

**Verdict: SD0226 closes; all 93 newly imported SD rows conform to their accepted minimum contexts, but the SC22 prose requirement remains partial (S6-C1).** There are 83 new cards and 10 consolidated SD rows, not 93 new entities. The three larger S3-C1 families SD0214, SD0238 and SD0240 remain open. This is not full supplementary, canon, technical or release acceptance.

## Checked scope and accounting

[Row-by-row inventory](supplementary-review-s6/row-comparison.csv) records every SD0476–SD0568 declaration, its accepted context/locator, built key/copy/sources, consolidation owner and remaining integration limits. Comparison is to previously accepted research, with five finite official-passage checks described below; it is not a fresh full-primary reading.

| Category | Newly imported SD rows | Disposition |
|---|---:|---|
| SC18 landmarks/settings | 20 | Accepted minimum context retained; shared place settings remain reference views. |
| SC19 movements | 16 | Source sequences and actor distinctions retained; no routes drawn. |
| SC20 people/institutions/themes | 14 | Attributed roles, coercion, differing lists and household relationships retained. |
| SC21 place identities | 38 | Narrative identities retained without invented modern coordinates. |
| SC22 prose | 0 table rows | **One mandatory prose movement remains partial; see S6-C1.** |
| SC23 apparatus | 5 | KJV/JST and editorial/source distinctions retained; four consolidated into relevant cards. |

All **1,271 SD rows** reconcile: **568 imported, 703 pending**. Separately, seven prose cards and 25 child cards remain. Mapping total stays **1,303 rows**: 600 imported mapping rows, including 10 many-to-one consolidations, and 703 pending rows. The supplementary runtime total is therefore **590 cards**, not 600; whole pack **793 cards / 760 unique keyed cards**. `nt-more` has 211 cards; `ot-more` grows from 178 to 261. No new child objects were added.

Exactly **83 cards are new and one prior child changes** (`NTE-jerusalem-community-6`); **709 prior cards are unchanged**. After removing the additions and restoring that child, the whole pack deep-equals the baseline. Engine JS/CSS/layer helpers are byte-identical. Prior Salamis provenance, Palmyra BoM gate, 169-ID / 170-card primary disposition, S3 copy fixes and S4 corrections carry forward without a new primary audit.

## Prior finding closure

The Acts 6 child now contains the two exact requested sentences about Nicolas as an Antioch proselyte and regional participant labels not constituting Stephen's journey. It retains its Acts 6 source and `2/nt` gate. **SD0226 closes within S3-C1.** All 25 previously added children now meet the bounded accepted requirements recorded in S5; only one was re-compared as changed content here, with the other 24 byte-identical.

S3-C1 remains open for **SD0214** (attributed healing/pericope children), **SD0238** (separate Matthew/Luke lineage payloads) and **SD0240** (attributed parable/pericope children). Their absence is disclosed by the builder, not newly discovered. Source-view counts do not complete those payloads. No rollback of S3-C2–C4 or S4-C1–C4 is present.

## S6-C1 — retain the mandatory SC22 transport prose and map its consolidation

Accepted `coverage-ot-late-history.md:427–430` contains **`lh-j17-josiah-return`**, a reported-transport source view. `category-dispositions.csv` explicitly says zero table rows does not authorize omission. The receipt correctly counts zero SC22 rows but does not supply a prose disposition. `OTL-megiddo` / SD0550 currently says:

> Old Testament — Josiah is wounded in the valley of Megiddo and taken to Jerusalem, where he dies in Chronicles’ account. Its wording differs from Kings, and the difference is kept.

That fulfills SD0550's own minimum, but does not retain SC22's transfer to another chariot and burial. No other current card supplies those clauses. Keep the existing card and replace its description with:

> Old Testament — After being wounded in the valley of Megiddo, Josiah is transferred to a second chariot and taken to Jerusalem, where Chronicles reports his death and burial. Its wording differs from Kings and remains separately attributed. No exact road or battle point is supplied.

Retain `1/ot` and the current official chapter URL; the locator may be **2 Chronicles 35:22–25**. Add a prose consolidation mapping from **SC22 / `lh-j17-josiah-return` → SD0550 / `OTL-megiddo`**, preserving both research contexts and explicitly recording no additional event/card. Do not fabricate an SD ID, infer a second Josiah death, draw a road or reconcile Kings by assumption. The existing Kings-view card `OHP-MEGIDDO` can remain the separately attributed comparison reference. Accepted narrative/reference links need not be new Earth pins or implemented graph edges.

Fresh official [2 Chronicles 35:22–25](https://www.churchofjesuschrist.org/study/scriptures/ot/2-chr/35?lang=eng) confirms the second chariot, transport, death and burial. **Acceptance:** visible attributed replacement, source locator, explicit SC22 consolidation row/receipt, unchanged gates/no geometry, and generator output including the consolidation without duplicate card counts. This is a small required context/accounting fix; no owner decision or inaccessible source blocks it. It does not invalidate the 93 table-row comparisons.

## Five builder readings answered

| Reading | Disposition and evidence |
|---|---|
| SD0480: Chidon without spelling Samuel's alternative | Conforms to the accepted row. The card actually retains Chidon/Perez-uzza and does not harmonize the names. Fresh [1 Chronicles 13:9–14](https://www.churchofjesuschrist.org/study/scriptures/ot/1-chr/13?lang=eng) confirms the place wording and three-month stay; naming Samuel's form is optional, not a new mandatory correction. |
| SD0507: “beyond-the-river” for “trans-river” | Conforms. Fresh [Nehemiah 2:7–11](https://www.churchofjesuschrist.org/study/scriptures/ot/neh/2?lang=eng) describes those governors before Jerusalem. The later return residence stays unknown; no extra city or route is supplied. The later-return clause reuses accepted LHN-13 evidence rather than a fresh reading of that chapter. |
| SD0508: mount “could not pass at one point” | Conforms. Fresh Nehemiah 2:12–15 explicitly retains the obstruction at the Fountain Gate/King's Pool sequence. No need to add a modern gate or pool identification from uncertain study notes. |
| SD0530: “cult” | Matches accepted research; in this context it denotes religious worship, not a new claim about a modern group. For approachable neutral copy, optional replacement for the second sentence: **“The city is kept distinct from its rulers and from Ahaz's adoption of worship of its gods.”** Fresh [2 Chronicles 28:23](https://www.churchofjesuschrist.org/study/scriptures/ot/2-chr/28?lang=eng) supports the narrower personal attribution. This is a reader-facing refinement, not a newly established factual defect. |
| SD0558 incorporates SD0490's fast | Valid consolidation. Fresh [Ezra 8:15, 17–23, 31](https://www.churchofjesuschrist.org/study/scriptures/ot/ezra/8?lang=eng) supports assembly/fast, the separate Casiphia delegation and twelfth-day departure. No modern river course or whole-caravan detour is invented. |

These five opened official pages establish their textual claims only, not archaeological/historical confirmation. All other row comparisons use accepted context/source evidence. The KJV/JST agency difference at Ramoth-gilead, expanded angel scene, Bible Dictionary aliases and Ezra editorial notes were compared to the accepted apparatus rows; no fresh appendix-reading claim is made this turn.

## Consolidation, source resolver and remaining identity work

All 10 many-to-one mappings are independently checked against actual card keys, retained copy and source unions:

`SD0485 → SD0548`; `SD0489 → SD0560`; `SD0490 → SD0558`; `SD0491 → SD0559`; `SD0492 → SD0557`; `SD0494 → SD0561`; `SD0564 → SD0477`; `SD0565 → SD0531`; `SD0567 → SD0543`; `SD0568 → SD0557`.

The casting ground remains a relational locality, not a replacement coordinate for either endpoint. Achmetha remains an archive setting; Ono remains an invitation refused. KJV/JST passages have distinct labels on the same narrative card. Elath/Eloth and Shushan/Susa aliases are visible and attributed to the Bible Dictionary. No assertion of Esther's historicity follows. The new plain reference cards do not instantiate graph edges or a fully normalized identity database; do not claim that future integration is already implemented.

Chronicles-related cards name existing Hebron, Shechem, Bethlehem, Jerusalem, Jericho, Samaria and other reference views where available. Explicit reuse against future SC24–SC34 major-prophet records and WP-P06/Daniel remains **pending**, as the receipt states. Keep Daniel's vision mode separate from Esther's story and Nehemiah's court service. This is still required integration, not approved omission or a reason to duplicate cities.

The resolver preserves verse labels, chapter lists and ranges. E.g. `LH2-11:5–12` links the correct chapter and keeps its verses; `LHS-03–08` labels Esther 3–8 but links the first chapter, as disclosed. A range link is not direct access to every included chapter. Every new card's source URL set equals the union of its accepted owner/consolidated-row sources; verse specificity and the apparatus labels were inspected. Chapter-level duplicates can be suppressed when the same URL already has a verse-specific source, without losing the underlying source. SC23's metadata correctly retains the fuller “source-specific 1/ot; later commentary separately gated” rule; the current cards contain the accepted attributed appendix/study-help context only.

## Reproducible validation and limits

- [Probe](supplementary-review-s6/probe.cjs) / [result](supplementary-review-s6/probe-result.json): actual pack/layer functions in Node VM; **2,100 gate combinations** for 83 additions and the changed Acts child, one pre-NT all-layer exclusion, nonspatial/undated assertions, unique keys, exact rest-of-pack and engine equality.
- [Accounting](supplementary-review-s6/accounting.py) / [result](supplementary-review-s6/accounting-result.json): all 1,271 SD metadata/hash mappings; 93 changed import rows; 10 consolidations; source unions and isolated generator reproduction of pack/CSV byte-for-byte.
- [93-row comparison](supplementary-review-s6/row-comparison.csv) and [SC22 prose disposition](supplementary-review-s6/prose-comparison.csv) separate table-row conformity from the missing prose context.
- [Targeted tests](supplementary-review-s6/targeted-tests.txt): **27/27 pass** from the pinned build's LDS/layer tests. The coverage, source-witness and reference-disposition integrity validators also pass; they do not independently certify primary reading or historical truth.

Run `node docs/universes/packs/lds-standard-works/supplementary-review-s6/probe.cjs` and `python docs/universes/packs/lds-standard-works/supplementary-review-s6/accounting.py` from a repository containing the pinned commits. Tests use `node --test /path/to/11b2491/tests/lds-pack.test.ts /path/to/11b2491/tests/atlas-layers.test.ts`. An initial accounting assertion assumed all work-gate metadata was literally `1/ot`; it was corrected to accept SC23's preserved, longer source-specific rule. No application failure resulted.

Two of the four committed S6 captures were inspected: 390×844 and 1440×900. They show the new Chronicles cards, separate JST source labels, phone section chooser and existing desktop tab arrangement; they cannot establish keyboard/native-select behavior or all 261 OT cards' rendering. Builder reports 29–95-second SwiftShader readiness, DOM-click/CDP capture, 101 tests and 13×2 page checks. Those are builder-reported observations, not independently executed browser actions. ChatGPT used no browser/server, DOM click or alternate preview. Real-GPU, native-select/keyboard and final same-head rendered/technical acceptance remain open.

Exact implementation [CI 41296101486](https://github.com/mckayec/universe-sandbox/actions/runs/41296101486) completed success; deployment skipped. Review CI is followed to terminal and recorded in the main handoff. Neither pass grants release acceptance.

**Next handoff:** Claude retains fixing ownership. Apply S6-C1's small consolidation, complete the three outstanding S3-C1 families, continue **703 pending SD rows** (SC24–SC34 next, including 222 remaining OT rows), and preserve later prose/category constraints beyond row counts. No inaccessible source or new owner decision blocks this tranche's small fix. Q03 remains approved; separate archaeology/LiDAR artifacts do not block current Earth work. No approval, merge, deployment or release.
