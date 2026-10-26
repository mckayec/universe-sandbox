# Deuterocanonical core: integration and claim audit

2026-10-26. **Finite, source-linked grouped-card handoff; not an independent historical certification or whole-Christian-apocrypha sign-off.** This audit uses the already-read passages and their retained reading notes; it does not claim a second complete reading, newly retrieved sources, or independent reviewer status. No app payload, coordinates, code, commits or publication are produced here.

## Deliverables and denominators

- [Coverage](deuterocanonical-coverage.csv): 147 actual reading units: 137 chapters, Sirach prologue, six Esther sections, three Daniel addition sections. The source-witness distribution remains 81 NABRE, 64 RV1895, two mixed/DRA Esther units. These are reading dispositions, not independent events.
- [Integration registry](deuterocanonical-integration.csv): **984 rows**: 70 narrative event-group cards, 77 concept/recollection chapter cards, 48 thematic cards, 223 place references, 52 person references, 20 journeys, 12 relationship-group instructions, and 482 typed edges. The 147 chapter cards map one-to-one to the coverage units. Thematic cards overlap chapter material; relationship groups overlap individual edges.
- Of the 482 edges, **449 are mentions-place links and 33 are explicit relationship/explanatory links**. A place mention is not a visit, location of an event, proof of historicity or an independent factual certification. Therefore 984 must never be reported as 984 independently audited historical claims.
- [Research dossier](deuterocanonical-research.md) provides the human-readable copy, narrative constraints, chronology and edition distinctions. [Sources](deuterocanonical-sources.md) explains the witnesses and successful/failed access.

## Method and rendering contract

The registry reorganizes the already-read material; no new primary-source assertions are manufactured from a regex. The place candidate list was manually assembled from existing chapter payloads, including the Maccabean place fields. Exact-label matching then creates **mentions-place** joins only. This mechanical indexing does not determine a place's role. Source cards retain whether a label is a scene, recollection, simile, origin, threatened destination, letter recipient or uncertain spelling. Narrative local sites and journey sequences were manually entered with source bundles; no coordinates are supplied. Mizpeh opposite Jerusalem and Mizpeh of Gilead have separate IDs and source scopes. Dathema is retained before Mizpeh on the selected 1Maccabees5 journey backbone.

People references and 33 explicit links were manually bounded to the cited relationships. Repeated royal and priestly names are source-scoped. A source-scoped label is not automatic identity resolution with a Biblical figure, another recension, or another pack. Thematic records retain allusion, editorial identification and personification. The 12 original Maccabean relationship instructions retain their previous IDs and do not inflate the number of distinct relationships.

Each row provides its source bundle(s), actual witness URL(s), reading extent, local earliest work gate, confidence, evidence layer, copy and limits. **C means the cited witness supports the attributed textual claim**, not that an event is independently established. Editorial identifications stay labeled inside copy. No L assertions are introduced. Unknown locations are not U location assertions authorized for rendering: they are deliberately unlocated reference cards. Geometry-dependent renderers must omit them from coordinate-required arrays. Thematic/group cards can be rendered as nonspatial codex or event descriptions; atomic splitting is a builder operation within the stated source boundaries, not permission to reconstruct omitted facts.

Local `first` is the minimum of the row's cited work gates, never a Gregorian date. A multi-source row's later developments remain tied to their own `source_bundles`; do not expose all later copy at the earliest gate. In particular shared-place cards show only their neutral label at first, and link to separately gated chapter cards for eras. Mordecai's observance reference in 2Maccabees15 is gate7; Esther narrative development remains gate8. A person mention in an earlier work does not import the whole later biography. Chapter provenance is finer than the work gate but no chapter slider is promised.

## Prominent and uncertain claim review

This is an explicit material-risk self-audit, not a claim that each independently checkable clause in 984 rows received a new external source comparison. Every listed decision below uses source passages already read in the named coverage row; its exact URL/edition is resolved there and in the registry.

| Claim family and evidence | Audit disposition / required copy boundary |
|---|---|
| Tobit1; dc-tob-01 | Narrative Shalmaneser–Sennacherib sequence remains distinct from opened NABRE historical note. No invented unified Assyrian genealogy. |
| Tobit2 RV; dc-tob-02 | Elymais first-person/third-person variant prevents an unqualified journey attributed to Tobit or Ahiqar; excluded from journey registry. |
| Tobit3/5/7; dc-tob-03/05/07 | Angel's presented Azarias parentage is disguise, not biological kinship. Sarah's parents and marriage are typed separately. |
| Tobit6 RV; dc-tob-06 | Ecbatana/Rages tension retained. Selected outbound sequence is narrative-only; distances and road geometry withheld. |
| Tobit8–9; dc-tob-08/09 | Demon flight is supernatural; money-retrieval participant is Raphael, not Tobiah. Return Ecbatana setting is explicitly contextual inference from7. |
| Tobit11/14 NABRE; dc-tob-11/14 | Kaserin unlocated. Age112/117 and blindness58 remain witness-specific narrative figures. No lifetime reconstructed from editorial612BCE. |
| Judith1–4; dc-jdt-01/02/04 | Assyrian Nebuchadnezzar, Arphaxad, postexilic Temple and impossible march pace remain literary tensions; no reconstructed historical campaign. |
| Judith4/7; dc-jdt-04/07 | Bethulia/Betomesthaim and siege topology unlocated; no Bethel/Shechem identification adopted. |
| Judith5/11; dc-jdt-05/11 | Achior's retrospective theological history and Judith's deceptive promised Jerusalem route are not travelled itineraries. |
| Judith8/14/16; dc-jdt-08/14/16 | Husband Manasseh remains source-scoped. Achior's conversion is affiliation, not ancestry. Maid stays unnamed; no devotional name added. |
| Wisdom6–10; dc-wis-06 through10 | Solomon is editorial literary-role identification, not confirmed authorship. Chapter10 biblical names remain intertextual; body does not name them. |
| Wisdom10–19; dc-wis-10 through19 | Allusion comparisons and divine judgments are attributed religious narrative, not independently dated Exodus/Sodom geography or endorsed ethnic descriptions. |
| Sirach prologue/50; dc-sir-prologue/50 | Author/grandfather and unnamed translator distinguished; Egypt arrival regnal38 differs from editorial translation-date assessment. No exact arrival city. |
| Sirach24; dc-sir-24 | Plant and river similes generate reference facets, not travel. Gihon and Nile remain distinct labels; Wisdom-law link is explanatory, not manuscript dating or a claim Sirach equals Moses' law. |
| Sirach36/46 RV; dc-sir-36/46 | Numbering/dislocation and RV Tyrians retained; no silently substituted NABRE text. |
| Sirach48/50; dc-sir-48/50 | Siloam and SimeonII dating remain editorial identifications; possible Yom Kippur is tentative, not a definite date. |
| Sirach9/25/33/42/50; relevant chapter cards | Gender, servitude and ethnic polemic attributed to ancient speaker; not atlas advice or neutral ethnography. |
| Baruch1/6; dc-bar-01/06 | Unspecified month in fifth-year reading remains unknown;10Sivan is separate vessel reference. Seven generations not replaced by70years. Fictional framing/editorial assessment is distinct from narrative voice. |
| 1Maccabees2/9/13/16; relevant chapter cards | Five sons, succession and two Johns distinguished. Simon succeeds captive Jonathan before Jonathan's death. Royal Ptolemy distinct from son of Abubus. |
| 1Maccabees5; dc-m1-c05 | Galilee rescue distinct from Gilead expedition. Dathema and Mizpeh of Gilead separate; Bethshan stage is plain opposite city, not asserted entry. |
| 1Maccabees8/12/15; relevant chapter cards | Diplomatic destinations distinct from recipient list. Claimed Spartan/Jewish kinship remains letter assertion, not verified ethnic genealogy. |
| 1Maccabees6;2Maccabees1/9 | Three Antiochus death presentations remain separately attributed; no combined final journey or diagnosis. |
| 1Maccabees6;2Maccabees13 | Era years150/149 retained. Elephant raids not automatically one event. No uniform BCE conversion from marginal editorial dates. |
| 1Maccabees5/13;2Maccabees11/14 | Samaria/Marisa, Gazara/Gaza, Dioscorinthius and Lessau textual problems remain visible; no invisible emendation or pin. |
| 2Maccabees4/7; dc-m2-c04/07 | Jason priest distinct from Cyrene source author and envoy. Mother/seven sons unnamed; later traditional names and exact martyrdom location excluded. |
| 2Maccabees10/12; dc-m2-c10/12 | Timotheus killed/released tension unresolved; no unsupported same-person or different-person harmonization. |
| 2Maccabees12/15; dc-m2-c12/15 | Prayer/offering linked to resurrection in text; later doctrinal systems not substituted. Dream sword/figures are vision links, not physical meetings. |
| EstherA–F; dc-est-a throughf | Greek Artaxerxes preserved. DRA14Adar destruction vs RV13Adar defense remains edition difference. Colophon Ptolemies and regnal date unresolved; no modern-year invention. |
| EstherD/F; dc-est-d/f | King's brother language not literal sibling genealogy; symbolic dragons/stream distinct from physical people/places. |
| Daniel Prayer/Song; dc-dan-prayer-song | RV missing45 and variants visible; not68 uninterrupted NABRE-equivalent verses. Furnace scene is narrative, not a precision coordinate. |
| Susanna; dc-dan-susanna | Joakim and garden source-scoped. False accusation remains false within narrative. No datable historical trial or later place identification. |
| Bel/Dragon; dc-dan-bel-dragon | Theodotion-based witness and Old Greek notes differ; no full collation claimed. Den distinct from Daniel6; Habakkuk transport supernatural and home endpoint unnamed. |

## Corrections made during integration

1. Corrected Esther's person-reference source from additionA to additionB, where the retained extraction explicitly names her; kept Mordecai's earlier gate7 observance reference separate from his gate8 narrative.
2. Scoped the two Mizpeh references separately; added Dathema to the Gilead rescue backbone rather than treating Mizpeh as the relieved fortress.
3. Mapped the general Sirach instruction card across the already-read instructional chapters1–43 rather than allowing chapter1 alone to support every listed ethical topic.
4. Preserved five otherwise unmapped Wisdom thematic IDs with their proper source chapters and added Wisdom14 to the Noah editorial-identification source mapping.
5. Replaced a potentially misleading Wisdom-law identity edge to Sirach's own instruction card with an explanatory link to Sirach24. The text's stated identification remains covenant book/law of Moses.

## Validation and remaining boundary

Validated unique IDs, all source-bundle references, every typed-edge endpoint, all journey stops, place/person references, earliest-work gate calculation, and exact147 chapter-card coverage. Source URLs and extents are inherited from the actual reading ledger, not manufactured access records. Whitespace checked on all five owned artifacts. These are artifact-integrity checks, not website runtime tests or independent all-clause certification.

The bounded grouped-card registry is usable without additional primary reading **for the attributed claims it includes**. Remaining release conditions: parent-level cross-shard identity and gate reconciliation; choosing supported renderer representations; independent canon/build review; checking any proposed coordinates against a gazetteer; and any separately required uniform NABRE/recension comparison. No comparison is needed merely to acknowledge unknown geography, but differences must stay visible. Full Hebrew/Greek textual collation, external archaeological proof and all Christian apocrypha remain outside this finite checkpoint. No broad release-ready status is asserted.
