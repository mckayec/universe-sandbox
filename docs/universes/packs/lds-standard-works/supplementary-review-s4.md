# LDS supplementary checkpoint 4 — OT history parent review

Reviewed 2026-11-01. Requested code head **de94dffc3c4b7b6a7df2b40da11e069700e017e6**; latest verified PR33 head **665f82590881ee8664b70bb88543e71a0965b7d1**; baseline **7b7a3da6154aceb1e279775a5805e5e287df4194**. The only de94dff→665f825 change is five receipt lines disclosing missing rendered screenshots. Application, generator, mapping and tests are identical between those heads. The inconsistent supplied/API timestamps are not used to infer publication chronology.

Accepted supplementary register and OT chapter ledger: **9cc874c09a3686119ca6b4c17c7e16f214fd7ab6**. Prior NT review: **d321689cd43a9ab5c87ecb07f9b71a56cfa38975**. Main status read at `b68f927` retains **fixing/claude**, SC18–34 next, and says this is not a full-stage return. This explicitly requested parallel audit leaves that ownership unchanged. No relevant checkout `.agents/skills` files were found; repository AGENTS/CHATGPT guidance and the explicit bounded-review authorization apply.

**Verdict:** 177 new OT parent views were compared with their accepted contexts. **170 have no additional discrepancy identified; seven have content qualifications/omissions grouped in S4-C1–C4 below.** All four prior NT findings remain open, because the NT implementation is unchanged. Keep importing the remaining supplementary work while correcting these finite items. This is not complete canon/source certification or final technical acceptance.

## Exact coverage, counts and provenance

[Comparison inventory](supplementary-review-s4/comparison.csv): SD0299–SD0475, covering SC13 5 integration/reference views, SC14 76 place views, SC15 51 people/relationship views, SC16 27 journey views and **SC17 18 explanatory views**. The builder receipt says 19 for SC17; correct that count to 18. The total 177 is correct. These are source-view parents, not 177 newly established historical entities. SC13's five integration rows do not become five physical places/events merely because they have cards.

All **1,271 SD rows** match accepted metadata; all **1,278 mapping rows** were compared against baseline. Exactly 177 SD rows switch to imported, with every prior SD/prose mapping unchanged. Totals: **475 imported SD parents + seven prose cards; 796 SD parents pending.** The OT SC13–34 total really is 492 (the receipt corrects its earlier 487); **315 OT SD rows remain in SC18–34**, within the 796 overall pending count. Missing child/reference content in S3/S4 remains additional work even though its parents are marked imported.

The entire pack after removing `ot-more` is deep-equal to baseline: **508 prior cards unchanged**, now **685 total cards**. All **652 keyed cards** have unique keys. Engine JS/CSS and layer helpers are byte-identical. Thus the BXJ12/SC04.4 corrections, Salamis attribution, Palmyra BoM gate and primary 169-ID / 170-card accounting carry forward unchanged. No renewed rendered claim follows from that equality.

The [source-resolution inventory](supplementary-review-s4/resolved-ledger-sources.csv) independently resolves **372 ledger expressions** through the pinned OT ledger, expanding each range into its chapter IDs and URLs. SC13 uses direct links; SC14–17 use ledger citations plus the five explicit `EXTRA_SRC` additions. Every displayed source set matches its accepted direct/ledger references plus those declared additions. Range labels intentionally link to the first chapter, not to a combined full-range document; the inventory preserves every chapter for review. All range endpoints/interior ledger IDs resolve, and source-label first chapters match URLs. This verifies traceability, not fresh reading of every linked chapter.

The builder generator, run in a disposable tree with the exact accepted CSV and identical pinned `coverage-ot-history.md`, reproduces both pack and mapping byte-for-byte. Prior NT/BoM copy is unchanged. No Claude checkout or application file was edited.

## Prior findings: no NT closure at this head

- **S3-C1 remains:** SD0213/SD0214/SD0226/SD0236/SD0238/SD0240/SD0270 still lack the specified child/reference payload. No new children were imported in this OT-only delta.
- **S3-C2 remains:** SD0190's journey antecedent is unchanged.
- **S3-C3 remains:** SD0260's heavenly-sanctuary wording is unchanged.
- **S3-C4 remains:** SD0206 and AJ05 still omit the accepted Syracuse/Rhegium/Puteoli intervals. The old receipt assertion remains inaccurate.

Use [S3's exact replacements and child acceptance checks](supplementary-review-s3.md); do not redo its primary research or treat this checkpoint's CI as closing those findings.

## S4-C1 — preserve conceptual reuse and unresolved place identity (two rows)

**SD0300 / OH-P01**, `copy_ot.py` dictionary entry: “The same Eden as the other accounts” converts a conceptual reuse instruction into a potentially categorical identification across texts. The accepted row says to reuse the **conceptual** Eden while retaining source labels. Keep the Genesis summary; replace that clause with:

> This reference shares the atlas's Eden concept while retaining Genesis's own wording; it does not establish that every source's landscape description is geographically identical.

Keep the existing statement that the passage supplies no modern garden location and modern river names do not reconstruct its landscape. No new research or coordinates are necessary.

**SD0311 / OTS-P07-bethlehem:** “Kept distinct from ... the Bethlehem of Ibzan” implies a positively separate place, whereas the text gives an unqualified Bethlehem. [Judges 12:8–10](https://www.churchofjesuschrist.org/study/scriptures/ot/judg/12?lang=eng), freshly inspected, does not decide which Bethlehem. Replace the final sentence with:

> Joshua 19:15 also names a Bethlehem in Zebulun. Judges 12:8–10 associates Ibzan with a Bethlehem but does not specify its region; that reference is not automatically identified with either town here.

Add Joshua 19 and Judges 12 source links (currently the card cites Ruth 1–4 and Genesis 35). Joshua's Zebulun distinction is inherited from the accepted row; the new primary check was of the Ibzan passage. Do not create a third known Bethlehem or force a merge. This resolves builder question 2 while preserving the uncertainty that motivated it.

## S4-C2 — required retained lists are not actually supplied (two rows)

**SD0443 / OHJ-12:** the card says Numbers preserves a longer itinerary but supplies only its endpoints. The accepted requirement is “Use complete OH-N33 stage list,” with the exact retained itinerary at `coverage-ot-history.md:246`. The cited chapter is not a substitute for that expressly required source view. Retain a nonspatial ordered reference under `1/ot`, using this already accepted sequence:

Rameses → Succoth → Etham → Pi-hahiroth (before Baal-zephon; camp before Migdol) → sea crossing / wilderness of Etham → Marah → Elim → Red Sea camp → wilderness of Sin → Dophkah → Alush → Rephidim → Sinai → Kibroth-hattaavah → Hazeroth → Rithmah → Rimmon-parez → Libnah → Rissah → Kehelathah → Shapher → Haradah → Makheloth → Tahath → Tarah → Mithcah → Hashmonah → Moseroth → Bene-jaakan → Hor-hagidgad → Jotbathah → Ebronah → Ezion-gaber → Zin/Kadesh → Hor → Zalmonah → Punon → Oboth → Ije-abarim (subsequently Iim) → Dibon-gad → Almon-diblathaim → Abarim before Nebo → Moab plains by Jordan near Jericho; final camp extends from Beth-jesimoth to Abel-shittim.

Source: [Numbers 33:3–49](https://www.churchofjesuschrist.org/study/scriptures/ot/num/33?lang=eng), **reused accepted reading**, not a new full-chapter verification here. Preserve the accepted [Deuteronomy 10:6–7](https://www.churchofjesuschrist.org/study/scriptures/ot/deut/10?lang=eng) differing order and Aaron death setting; no invented alias/detour reconciles them. This is an ordered textual itinerary, not an Earth route or a count of uniquely geolocated camps. A compact referenced expansion is sufficient; no new map UI is required.

**SD0468 / OHC-REFUGE:** “The six designated cities are each listed from the text” supplies no names. Retain the legal summary and replace that sentence with:

> Joshua 20:7–8 names Kedesh in Galilee in mount Naphtali, Shechem in mount Ephraim, and Kirjath-arba (Hebron) in Judah; east of Jordan it names Bezer in Reuben, Ramoth in Gilead in Gad, and Golan in Bashan in Manasseh.

[Joshua 20:7–8](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/20?lang=eng) was freshly inspected. Retain context-scoped reuse of existing Shechem/Hebron/Ramoth references; names do not authorize new pins. No six-city list exists elsewhere in the exact pack to satisfy this requirement by consolidation.

**Acceptance:** map each retained list to its actual accessible card/subsection, preserve order/context and source citation, and test that the content is present under OT only. These are explicit retained-content requirements, not a request to undo approved dense genealogy/allotment UI deferrals.

## S4-C3 — replace two promises of source fidelity with the actual scoped detail

**SD0395 / OHR-JETHRO:** “Hobab's relationship keeps Numbers 10's wording” never supplies that wording. Preserve the Reuel/Jethro summary and replace the final sentence with:

> Numbers 10:29 describes Hobab as “the son of Raguel the Midianite, Moses' father in law.” This reference retains that wording without merging Hobab, Raguel/Reuel and Jethro into one person.

[Numbers 10:29](https://www.churchofjesuschrist.org/study/scriptures/ot/num/10?lang=eng) was freshly inspected. Keep the existing Numbers 10 link and source-specific relationship wording; the quotation does not settle the antecedent or translation debate by fiat.

**SD0441 / OHJ-11:** “How far Zipporah and the family travel with him is read from the text” leaves the accepted traveler constraint unimplemented. Replace it with:

> Exodus 4:20 places Moses' wife and sons with him on his return toward Egypt. Exodus 18:2–6 later brings Zipporah and the two sons to Moses with Jethro after she had been sent back; it does not narrate where or when that separation occurred.

Freshly inspected [Exodus 4:20](https://www.churchofjesuschrist.org/study/scriptures/ot/ex/4?lang=eng) and [18:2–6](https://www.churchofjesuschrist.org/study/scriptures/ot/ex/18?lang=eng). Add Exodus 18 to this journey card's sources; the existing source set is Exodus 2–4. Do not animate the family on every Moses leg or invent the return date/location. Builder question 8 is therefore **partial**, with this finite replacement ready to apply.

## S4-C4 — Ahaziah accession wording overstates what Kings supplies

**SD0424 / OHR-AHAZIAH** says the two kings have “separate fathers and ages at accession.” [1 Kings 22:51](https://www.churchofjesuschrist.org/study/scriptures/ot/1-kgs/22?lang=eng) gives Israel's Ahaziah's father, accession synchronism and reign duration, not his age. [2 Kings 8:25–26](https://www.churchofjesuschrist.org/study/scriptures/ot/2-kgs/8?lang=eng) gives Judah's Ahaziah's father and age 22. Both passages were freshly inspected. Replace the description after the work prefix with:

> Kings distinguishes Ahaziah son of Ahab, king of Israel, from Ahaziah son of Jehoram, king of Judah. First Kings 22:51 dates the former's accession by Jehoshaphat's regnal year without stating his age; 2 Kings 8:26 gives the latter's accession age as 22.

The accepted row's broad “preserve separate fathers and accession ages” instruction must be read source-specifically; it is not evidence for an unstated age. This audit qualifies that instruction explicitly rather than fabricating a value. Preserve later Chronicles witness differences when those source views are imported; do not silently harmonize them to Kings. Keep both person IDs distinct (see the group mapping below).

## Consolidation and the nine builder readings

The [group-member crosswalk](supplementary-review-s4/group-members.csv) makes explicit **25 distinct research person IDs in 11 shared reference cards** (SD0388, SD0403, SD0410, SD0415, SD0417–19, SD0422–25). The builder CSV already preserves these IDs in `research_declaration`; this additive crosswalk does not invent new entities or require 25 new cards. A flat codex card discussing several named people is acceptable **as a group reference**, not a person whose aliases are those people. Keep distinct member IDs/predicates if relationship links are later implemented. SD0424 still needs S4-C4.

All **16 repeated primary place IDs** in SC14 are explicitly traceable through their retained declaration and `OTS-` view keys. Shared source facets can use distinct reference cards without adding duplicate Earth pins. Similarly the existing AJ01/AE03 and overlapping J01/AE06 episodes remain existing events/journeys, with the new cards supplying source facets. Their plain-text names are not clickable navigation; no such behavior is claimed.

| Builder question | Disposition |
|---|---|
| 1 / repeated primary places | Accept the source-facet approach above; do not interpret `OTS-` keys as newly established sites. The existing primary data are unchanged. |
| 2 / Ibzan's Bethlehem | Qualify under **S4-C1**; no inferred distinct third settlement. |
| 3 / SD0348 Dan | All three declared ledger links resolve to Judges 18, Joshua 19 and 1 Kings 12; Laish/Leshem and earlier Genesis Dan remain qualified. This confirms accepted-context fidelity, not archaeological identification. |
| 4 / SD0354 Baale-Judah | Current caution conforms to the accepted Samuel-only constraint. A targeted new comparison is available: [1 Chronicles 13:5–6](https://www.churchofjesuschrist.org/study/scriptures/ot/1-chr/13?lang=eng) explicitly calls its ark departure place Baalah/Kirjath-jearim. Optional improved copy: “Second Samuel 6 names Baale of Judah; the parallel account in 1 Chronicles 13:6 calls its departure place Baalah, that is, Kirjath-jearim. These are compared as source accounts, without locating a modern transfer point.” Add that citation if used; it does not turn every similar name into an alias. |
| 5 / SD0360 Olivet | NT account details are not imported into the OT card; the generic separate-source note is acceptable. Optional reader wording: “Gospel episodes at Olivet are presented in their own New Testament source views.” Source-level gating is tested, not rendered. |
| 6 / SD0404 Boaz | The intended refusal to infer literal brother-levirate kinship is sound. For tighter attribution, prefer “Ruth presents Boaz as a kinsman in the redemption account; it does not identify him as Mahlon's brother or as Ibzan.” [Ruth 4:1–10, 13–22](https://www.churchofjesuschrist.org/study/scriptures/ot/ruth/4?lang=eng) inspected; no unsupported exact degree of kinship is introduced. SD0471 already distinguishes analogy from identity. |
| 7 / SD0412 Bath-sheba | Safeguard is appropriate: do not invent consent or omit David's power. Optional more concrete reader sentence: “David acts as king and sends messengers to take Bath-sheba; the narrative does not state her consent.” [2 Samuel 11:2–4](https://www.churchofjesuschrist.org/study/scriptures/ot/2-sam/11?lang=eng) inspected. This is textual attribution, not a claim to recover an unstated response. |
| 8 / SD0441 family travel | **S4-C3**: supply actual participant details and the limit, not a promise to consult the text. |
| 9 / SD0454 Habor-Gozan | Inherited shorthand is traceable but should read naturally: “Halah, Habor by the river of Gozan, and the cities of the Medes,” following freshly inspected [2 Kings 17:6](https://www.churchofjesuschrist.org/study/scriptures/ot/2-kgs/17?lang=eng). Keep incoming settlers as a separate movement; no modern coordinate asserted. This is an optional precision improvement, not a newly selected geographic identification. |

## Validation and limits

```sh
node docs/universes/packs/lds-standard-works/supplementary-review-s4/probe.cjs
python docs/universes/packs/lds-standard-works/supplementary-review-s4/accounting.py
node --test /path/to/665f825/tests/lds-pack.test.ts /path/to/665f825/tests/atlas-layers.test.ts
```

[Probe result](supplementary-review-s4/probe-result.json): **4,425 gate combinations**, all 177 cards nonspatial/undated, prior pack equality, unique runtime keys, engine/layer equality. No synthetic pre-OT group was invented: OT is the first reading group; other-layer exclusion is tested across all five valid groups. [25/25 targeted tests](supplementary-review-s4/targeted-tests.txt) passed. [Accounting/generator result](supplementary-review-s4/accounting-result.json) records exact pins and counts. The unchanged coverage, source-witness and reference-disposition validators also pass; relative artifact links and whitespace were checked. These checks do not read all scripture or prove historical truth.

Fresh official passage checks this turn were limited to Judges 12:8–10; Exodus 4:20 and 18:2–6; Joshua 20:7–8; 1 Kings 22:51; 2 Kings 8:25–26; 2 Samuel 11:2–4; Numbers 10:29; Ruth 4:1–10, 13–22; 2 Kings 17:6; 1 Chronicles 13:5–6. All other source comparisons, including the full Numbers 33 itinerary, reuse accepted research. Links and scoped conclusions appear above. No full-canon reread or wholesale raw captures are claimed/uploaded.

The receipt at 665f825 explicitly says the new tab was **not inspected rendered**: its local SwiftShader load stalled for roughly 11 minutes and no S4 screenshots were captured. This is a disclosed technical evidence gap, not proof of bad content and not a passed visual test. Builder reports pnpm format/check, 99 unit tests, check:dist and standalone pages; independent local checks here are only the named Node/Python checks. ChatGPT did not run a browser/server or workaround. Native-select, keyboard, real-GPU, new-tab layout, final same-head rendered/technical and owner release gates remain open.

Implementation CI at de94dff: [41289021482](https://github.com/mckayec/universe-sandbox/actions/runs/41289021482), completed success when checked. Final-head 665f825 CI [41289220258](https://github.com/mckayec/universe-sandbox/actions/runs/41289220258) and this documentation head's CI are followed to terminal and recorded in the publication handoff. Passing generic page checks does not certify the uninspected OT tab or close S3/S4 content findings.

**Next owner/action:** Claude retains fixing ownership, captures the new tab when permitted, applies S3 and S4's finite fixes and continues SC18–34. No owner scope decision or inaccessible primary passage prevents these corrections. Return changed content and final technical evidence for an exact-head review. The separate archaeology/LiDAR artifacts do not block these Earth-atlas corrections, and Q03 schematic approval already exists. This report grants no approval, merge, deployment, release or status transition.
