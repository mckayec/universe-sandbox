# Late history and major prophets: stable-family source audit

Audit date: 2026-10-26. Scope is the stable registries in [late history](coverage-ot-late-history.md) and [major prophets](coverage-ot-major-prophets.md), not every individual name in the biblical text. The separate 269 chapter families and their repeated crosswalk edges are excluded from these counts.

| Registry scope | Place/network families | Journey families | People/relationship families | Concept families | Apparatus families | Checked / total |
|---|---:|---:|---:|---:|---:|---:|
| Major prophets | 73 | 27 | 17 | 15 | 6 | 138 / 138 |
| Late history | 56 | 17 | Included in concepts | 14 | 5 | 92 / 92 |
| Scoped family rows | 129 | 44 | 17 | 29 | 11 | **230 / 230** |

[The per-ID audit CSV](ot-late-major-record-audit.csv) provides source references, the authored claim checked, outcome and qualification for every family. There are **220 distinct unscoped keys**, since Bashan, Bethlehem, Damascus, En-gedi, Jericho, Lachish, Lebanon, Samaria, Seir and Sheba each have source-specific families in both shards. These ten are shared entities with different source cards, not ten newly discovered places. Duplicate index views of Casiphia and Shushan within late history are counted once. The major-prophet Joppa identity note is a cross-reference to the late-history-owned family, not a new major-prophet record. `lh-j17-josiah-return` is counted although its definition appears in prose.

## Evidence and actual review depth

The check used the actual preserved official Church verse bodies, not inherited C flags or artifact hashes. All assigned 269 chapters/6,700 verses had previously been read in the attributed KJV transcription and completely collated against the official bodies. This audit then re-read the material source passages for the registry labels, relationships, movements and explanatory copy. For long chapter-scale citations, the targeted recheck selected the material verses; it did not re-read every verse of every broad citation a second time. The CSV keeps the supporting full citation and, where supplied, the more precise targeted passages. All 44 journey families received explicit endpoint/traveler/mode checks. Claims about modern coordinates, independent historical occurrence, fulfilled prophecy or present territorial entitlement are not approved by this audit.

Actual official bodies and their captured responses are retained privately under `/workspace/lds-source-evidence/20261026/ot-late-major/`, especially `extracted-official-verse-bodies.json` and `unit-bundles/`. [The 538-row source witness manifest](ot-late-major-source-witnesses.csv) records official and pinned transcription witnesses per chapter. These source captures demonstrate retrieval; they do not by themselves prove interpretive review.

The 11 apparatus families were checked against the previously read, preserved official appendices, notes, headings and dictionary entries documented in [the apparatus witness manifest](ot-late-major-apparatus-witnesses.csv). Isaiah53's messianic heading, Isaiah14's heading/notes and Ezekiel37's heading were additionally rechecked in their preserved chapter captures. The Achmetha/Ecbatana alias uses the actually read [Bible Dictionary: Persia](https://www.churchofjesuschrist.org/study/scriptures/bd/persia?lang=eng), preserved separately in `/workspace/lds-source-evidence/20261026/geography/alias-captures.json`, `alias-persia`. The earlier inaccessible standalone Achmetha dictionary path remains an honest failed-access record; it is no longer an unresolved alias blocker.

## Corrections made during the source check

- Expanded 82 relative follow-on citations in the major-prophet registries into explicit full-book links, including Isaiah36:2 for the Rabshakeh clause at the upper pool, Jeremiah32 for Anathoth's purchase, Isaiah19 for Assyria's reconciliation and Isaiah65 for Sharon's pasture. Corresponding chapter crosslinks were restored. Expanded late-history compound citations likewise retain each cited chapter.
- Isaiah37:38 says **Armenia**; Jeremiah51:27 says **Ararat**. The return/escape family and geographic card retain these source-specific names without quietly declaring a modern boundary identity.
- Removed the unsupported adjective “royal” from the Rabbah card. Corrected Tema's aid from a purported command to the oracle's description of inhabitants bringing water and bread.
- Added Jeremiah32:12 for Baruch's Maaseiah ancestry; Jeremiah36:4 alone only supplies Neriah. Expanded Jeremiah37:12 to12–15 for the Benjamin departure/arrest relationship.
- Corrected Jeremiah36's document custody: officials hear and store the scroll; the king has it fetched and burns it. The officials are not described as sending it to him on their own initiative.
- Retained the official KJV **Aholah/Aholibah** spellings and their explicit Samaria/Jerusalem personification. Anathoth's written transaction is labelled narrated, not an independently surviving deed.
- Expanded Nehemiah6:2 to2–4 for Ono's refused invitation. Adopted Achmetha/Ecbatana only through the attributed official dictionary entry, with the archive a located-at child.

## Identity, gates and remaining limits

Canonical reuse remains mandatory for P02 Shechem, P07 Bethlehem, P08 Jerusalem, AP06 Jericho and AP07 Babylon. Shushan/Susa, Elath/Eloth, Hazazon-tamar/En-gedi and Achmetha/Ecbatana have specifically cited textual or study-help support. Ahava camp versus watercourse, Achmetha archive versus city, Ono invitation versus settlement, Samaria city versus region, and Gihon watercourse versus Ophel fortification remain typed distinctions. Grouped town/port/deportation lists are index or network families, not a single geometry. Name-only merges of repeated royal names, Ramah/Mizpah settings, Carmel senses or Edomite versus Moabite Bozrah remain prohibited by the owned registries and reconciliation register.

Ordinary Bible entity/source cards retain gate1. D&C113 interpretation is a distinct gate4 child. Book of Mormon interpretations of Isaiah29 and Ezekiel37 are distinct gate3 children; an existing gate1 Jerusalem or Ezekiel reference does not reveal those children early. Explicitly labelled JST comparison and Bible-edition explanations retain the gates specified in the apparatus rows. No source claim authorizes a coordinate or an animated route merely by receiving a gate.

**Verdict:** all 230 scoped stable-family rows have source support for their qualified textual/reference copy; none remains unchecked or access-blocked. This closes this shard's stable-family support audit. It does not claim exhaustive apparatus reading, independent ancient-history verification, resolution of every textual chronology tension, or readiness of a spatial rendering implementation. Source-specific chronology differences and unknown modern locations remain intentional disclosed limits, not fabricated harmonizations. Whole-corpus acceptance and cross-shard integration remain the responsibility of the combined audit.
