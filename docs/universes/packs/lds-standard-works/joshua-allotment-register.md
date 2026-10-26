# Joshua 13–22 allotment, boundary and settlement register

2026-10-26. This closes the named-place extraction gap previously recorded in `coverage-ot-history.md` under `OHC-ALLOTMENTS`. All **306 numbered verses in Joshua13–22** were read from the preserved official Church captures. Every named settlement, boundary feature and material setting in these chapters is represented in the context register below; territorial ethnonyms and relationally described unnamed features are explicitly typed, not invented cities. The paired CSV is the implementation handoff. This is scriptural allocation/narrative evidence, **not a geopolitical polygon, archaeological location proof or contemporary ownership claim**.

## Identity, reuse and source rules

- `JAR-<chapter>-<context>-<name>` is a stable **contextual record key**, not a claim that every row is a different physical place. Repeated mentions within the same context aggregate their verse references. Distinct allotments, lists, upper/lower labels and unresolved same-name occurrences retain distinct keys. The bracketed identifiers for repeated Hazor/Rehob/Asher labels are editorial disambiguators, not words added to scripture.
- Explicit local equivalences are recorded from the edition's wording: Hebron/Kirjath-arba, Debir/Kirjath-sepher or Kirjath-sannah, Baalah or Kirjath-baal/Kirjath-jearim, Jebusi/Jerusalem, Luz/Beth-el in18:13, Beer-sheba/or Sheba in19:2, Leshem/renamed Dan, and altar/Ed. Local equality does not merge every occurrence of either name elsewhere.
- Existing `OHP`, `P` and `AP` identities are reused where the textual setting supports them. Other same-name comparisons stay unresolved. All entries use `layer:bible`, association `first:1`, and **no coordinates, polygons, numeric event dates or surveyed routes**. A boundary description is an attributed sequence of landmarks, not recovered geometry.
- Exact proposed copy deliberately says the chapter **names** an item in a specified context. It does not turn a boundary reference, neighboring territory, retrospective event or people's name into an occupied town assigned to that tribe.
- Official source bodies, not the fallback transcription, control this register. In particular Joshua19:2's official **or Sheba** is preserved. Body/heading/JST distinctions and wider possession tensions remain in the owning chapter research. Existing source witnesses are in `ot-history-source-witnesses.csv`; each row here also carries the actual preserved capture path and SHA256.

## Textual totals and list differences

| Source group | Textual total / inspected-list disposition |
|---|---|
|13:30, eastern Manasseh | Sixty towns of Jair are claimed, but sixty individual town names are not supplied. One named group record preserves the claim; no sixty invented sites. |
|14:7,10, Caleb | Forty at the scouting commission, forty-five elapsed years, eighty-five at the request. Relative narrative ages, not converted BCE dates. |
|15:21–32, Judah south | Text says29 cities. The comma-preserving extraction has38 name entries after excluding Edom and grouping explicit Hezron/Hazor equivalence. Hazor/Hadattah and Kerioth/Hezron may involve compound-name parsing; this register does not claim38 independently proved cities or force the result to29. |
|15:33–36, Judah lowland1 | Fifteen displayed name entries, but stated total14. Both Gederah and Gederothaim remain; no silent deletion or alternative reading. |
|15:37–44 | Sixteen names and stated16 in37–41; nine and stated9 in42–44. |
|15:48–62, hill/wilderness lists | Stated11/9/10/6/2/6 match the displayed entries after explicit aliases are grouped. Repeated Ashnah, Socoh, Ziph, Zanoah, Timnah and other names retain their own list contexts. |
|17:5,11,14–18 | Ten portions exclude eastern Gilead/Bashan. Verse11's three countries is retained beside its six named town groups; do not reinterpret it as only three towns. Joseph's one-lot complaint is source-specific rhetoric, not a calculated modern area. |
|18:2–10 | Seven remaining tribes, three surveyors requested per tribe, seven described portions; the source does not preserve their underlying survey document or coordinates. |
|18:21–28, Benjamin | Twelve and fourteen named list entries, respectively; Jebusi/Jerusalem counts as the explicit local equivalence. |
|19:2–8, Simeon | Official or Sheba yields13 entries in2–6; four more in7. Baalath-beer/Ramath-of-the-south extent follows separately; no unwritten alias is imposed. |
|19:10–16, Zebulun | Twelve cities is stated, but the preceding passage interweaves boundary references with a final five-name list. No arbitrary subset of all boundary labels is selected to manufacture a twelve-city enumeration. |
|19:18–23, Issachar | Sixteen settlement/name entries before the Jordan outlet, with stated16; no additional city is made out of the river. |
|19:25–31, Asher | Stated22 retained. Boundary landmarks, neighboring tribes and repeated Rehob occurrences complicate a flat token count; do not turn every token into a separate city or emend Hebron19:28 to Abdon. |
|19:33–39, Naphtali | Stated19 cities; the specifically fenced-city block35–38 names16. Earlier boundary labels remain distinct; no missing three cities are invented. Preserve Allon/to Zaanannim and Judah upon Jordan exactly at the textual level. |
|20:7–8 | Six explicitly designated refuge cities: Kedesh, Shechem, Hebron, Bezer, Ramoth in Gilead and Golan. Region/boundary names in those verses are additional context, not additional refuge cities. |
|21:4–7,9–40 | Aaron13 =9+4; other Kohath10 =4+4+2; Gershon13 =2+4+4+3; Merari12 =4+4+4. The named allocation slots sum48, matching21:41. The register separately types regions, sanctuary setting and Hebron fields; these do not inflate the48. |
|21:24–25 / Chronicles comparison | Gath-rimmon occurs under both Dan and half Manasseh in this edition. Both allocation contexts remain. No name is substituted from Chronicles without a separately attributed comparison. |
|21:43–45 versus13:1,13 /15:63 /16:10 /17:12–13 | The broad fulfillment/rest conclusion remains alongside explicit incomplete-expulsion statements. Do not silently harmonize them into universal possession of every listed place. |
|22:9–34 | Departing group returns toward Gilead; alarm concerns an altar beside Jordan; delegation and explanation avert threatened war. The altar is named Ed as witness, not a newly authorized sacrificial sanctuary. Exact riverbank remains unselected. |

## Homonym and alias safeguards

Aroer on the Arnon and Aroer before Rabbah are separate descriptions. Debir in Gad, Debir on Judah's boundary and Caleb's Debir retain contexts. Judah's southern Hazor/Kedesh/Ziph are not northern Hazor/Kedesh; Judah's Goshen is not Egyptian Goshen. Beth-lehem in Zebulun is not automatically P07 Bethlehem of Judah. Asher's printed Hebron is not OHP-HEBRON. Judah's Carmel is distinct from the northern Carmel reference; Judah's Jezreel is not OHP-JEZREEL. Beth-shemesh in Judah, Issachar and Naphtali remains tribe-scoped. Ramah, Rabbah, Aphek, En-gannim, Beth-dagon, Jarmuth, Gath-rimmon and Rehob likewise require context. A stream Kanah is not automatically the Asher locality Kanah. Mount Seir on Judah's boundary is not automatically the Edomite region. Upper, nether and unqualified Beth-horon are not silently collapsed. Leshem's explicit renaming as Dan is not independent proof of equivalence with Laish in Judges18. Person/clan names such as Shechem, Gilead, Tirzah and Rekem are not mapped merely because a locality elsewhere shares the spelling.

## Contextual register

The CSV contains full exact proposed copy, source URL, capture provenance, alias evidence and uncertainty. The table below provides every stable key and its source context. `—` in reuse means **no canonical identity adopted**, not absence of evidence for the source's naming. Numbered verse references link to the actual official chapter.

### Joshua 13 — Not-yet-possessed overview (`remaining-land`)

| Stable key | Name / source forms | Verses | Type / role | Existing ID reuse |
|---|---|---|---|---|
| `JAR-13-remaining-land-philistines` | Philistines | [13:2](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/13?lang=eng) | people/territorial label (not a city); territorial/boundary reference | — |
| `JAR-13-remaining-land-geshuri` | Geshuri | [13:2](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/13?lang=eng) | people/territorial label (not a city); territorial/boundary reference | — |
| `JAR-13-remaining-land-sihor` | Sihor | [13:3](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/13?lang=eng) | settlement / named locality; territorial/boundary reference | — |
| `JAR-13-remaining-land-egypt` | Egypt | [13:3](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/13?lang=eng) | region / extent / land feature; territorial/boundary reference | P04 |
| `JAR-13-remaining-land-ekron` | Ekron | [13:3](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/13?lang=eng) | settlement / named locality; territorial/boundary reference | OHP-EKRON |
| `JAR-13-remaining-land-gazathites` | Gazathites | [13:3](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/13?lang=eng) | people/territorial label (not a city); territorial/boundary reference | — |
| `JAR-13-remaining-land-ashdothites` | Ashdothites | [13:3](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/13?lang=eng) | people/territorial label (not a city); territorial/boundary reference | — |
| `JAR-13-remaining-land-eshkalonites` | Eshkalonites | [13:3](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/13?lang=eng) | people/territorial label (not a city); territorial/boundary reference | — |
| `JAR-13-remaining-land-gittites` | Gittites | [13:3](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/13?lang=eng) | people/territorial label (not a city); territorial/boundary reference | — |
| `JAR-13-remaining-land-ekronites` | Ekronites | [13:3](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/13?lang=eng) | people/territorial label (not a city); territorial/boundary reference | — |
| `JAR-13-remaining-land-avites` | Avites | [13:3](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/13?lang=eng) | people/territorial label (not a city); territorial/boundary reference | — |
| `JAR-13-remaining-land-canaanite` | Canaanite | [13:3](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/13?lang=eng) | people/territorial label (not a city); territorial/boundary reference | — |
| `JAR-13-remaining-land-canaanites` | Canaanites | [13:4](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/13?lang=eng) | people/territorial label (not a city); territorial/boundary reference | — |
| `JAR-13-remaining-land-mearah` | Mearah | [13:4](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/13?lang=eng) | settlement / named locality; territorial/boundary reference | — |
| `JAR-13-remaining-land-sidonians` | Sidonians | [13:4,6](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/13?lang=eng) | people/territorial label (not a city); territorial/boundary reference | — |
| `JAR-13-remaining-land-aphek` | Aphek | [13:4](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/13?lang=eng) | settlement / named locality; territorial/boundary reference | — |
| `JAR-13-remaining-land-amorites` | Amorites | [13:4](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/13?lang=eng) | people/territorial label (not a city); territorial/boundary reference | — |
| `JAR-13-remaining-land-giblites` | Giblites | [13:5](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/13?lang=eng) | people/territorial label (not a city); territorial/boundary reference | — |
| `JAR-13-remaining-land-lebanon` | Lebanon | [13:5,6](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/13?lang=eng) | region / extent / land feature; territorial/boundary reference | — |
| `JAR-13-remaining-land-baal-gad` | Baal-gad | [13:5](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/13?lang=eng) | settlement / named locality; territorial/boundary reference | — |
| `JAR-13-remaining-land-mount-hermon` | mount Hermon | [13:5](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/13?lang=eng) | boundary landform / landmark; territorial/boundary reference | — |
| `JAR-13-remaining-land-entering-into-hamath` | entering into Hamath | [13:5](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/13?lang=eng) | boundary landform / landmark; territorial/boundary reference | — |
| `JAR-13-remaining-land-misrephoth-maim` | Misrephoth-maim | [13:6](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/13?lang=eng) | settlement / named locality; territorial/boundary reference | — |

### Joshua 13 — Reuben/Gad/east Manasseh overview (`east-summary`)

| Stable key | Name / source forms | Verses | Type / role | Existing ID reuse |
|---|---|---|---|---|
| `JAR-13-east-summary-jordan` | Jordan | [13:8](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/13?lang=eng) | water feature / water-place reference; territorial/boundary reference | OHP-JORDAN |
| `JAR-13-east-summary-aroer` | Aroer | [13:9](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/13?lang=eng) | settlement / named locality; territorial/boundary reference | — |
| `JAR-13-east-summary-river-arnon` | river Arnon | [13:9](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/13?lang=eng) | water feature / water-place reference; territorial/boundary reference | — |
| `JAR-13-east-summary-city-in-the-midst-of-the-river` | city in the midst of the river | [13:9](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/13?lang=eng) | water feature / water-place reference; territorial/boundary reference | — |
| `JAR-13-east-summary-plain-of-medeba` | plain of Medeba | [13:9](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/13?lang=eng) | region / extent / land feature; territorial/boundary reference | — |
| `JAR-13-east-summary-dibon` | Dibon | [13:9](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/13?lang=eng) | settlement / named locality; territorial/boundary reference | — |
| `JAR-13-east-summary-heshbon` | Heshbon | [13:10](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/13?lang=eng) | settlement / named locality; territorial/boundary reference | — |
| `JAR-13-east-summary-ammon` | Ammon | [13:10](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/13?lang=eng) | region / extent / land feature; territorial/boundary reference | — |
| `JAR-13-east-summary-gilead` | Gilead | [13:11](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/13?lang=eng) | region / extent / land feature; territorial/boundary reference | — |
| `JAR-13-east-summary-geshurites` | Geshurites | [13:11,13](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/13?lang=eng) | people/territorial label (not a city); territorial/boundary reference | — |
| `JAR-13-east-summary-maachathites` | Maachathites | [13:11,13](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/13?lang=eng) | people/territorial label (not a city); territorial/boundary reference | — |
| `JAR-13-east-summary-mount-hermon` | mount Hermon | [13:11](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/13?lang=eng) | boundary landform / landmark; territorial/boundary reference | — |
| `JAR-13-east-summary-bashan` | Bashan | [13:11,12](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/13?lang=eng) | region / extent / land feature; territorial/boundary reference | — |
| `JAR-13-east-summary-salcah` | Salcah | [13:11](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/13?lang=eng) | settlement / named locality; territorial/boundary reference | — |
| `JAR-13-east-summary-ashtaroth` | Ashtaroth | [13:12](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/13?lang=eng) | settlement / named locality; territorial/boundary reference | — |
| `JAR-13-east-summary-edrei` | Edrei | [13:12](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/13?lang=eng) | settlement / named locality; territorial/boundary reference | — |

### Joshua 13 — Reuben (`reuben`)

| Stable key | Name / source forms | Verses | Type / role | Existing ID reuse |
|---|---|---|---|---|
| `JAR-13-reuben-aroer` | Aroer | [13:16](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/13?lang=eng) | settlement / named locality; allotment reference | — |
| `JAR-13-reuben-river-arnon` | river Arnon | [13:16](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/13?lang=eng) | water feature / water-place reference; allotment reference | — |
| `JAR-13-reuben-city-in-the-midst-of-the-river` | city in the midst of the river | [13:16](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/13?lang=eng) | water feature / water-place reference; allotment reference | — |
| `JAR-13-reuben-plain-by-medeba` | plain by Medeba | [13:16](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/13?lang=eng) | region / extent / land feature; allotment reference | — |
| `JAR-13-reuben-heshbon` | Heshbon | [13:17,21](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/13?lang=eng) | settlement / named locality; allotment reference | — |
| `JAR-13-reuben-dibon` | Dibon | [13:17](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/13?lang=eng) | settlement / named locality; allotment reference | — |
| `JAR-13-reuben-bamoth-baal` | Bamoth-baal | [13:17](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/13?lang=eng) | settlement / named locality; allotment reference | — |
| `JAR-13-reuben-beth-baal-meon` | Beth-baal-meon | [13:17](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/13?lang=eng) | settlement / named locality; allotment reference | — |
| `JAR-13-reuben-jahazah` | Jahazah | [13:18](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/13?lang=eng) | settlement / named locality; allotment reference | — |
| `JAR-13-reuben-kedemoth` | Kedemoth | [13:18](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/13?lang=eng) | settlement / named locality; allotment reference | — |
| `JAR-13-reuben-mephaath` | Mephaath | [13:18](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/13?lang=eng) | settlement / named locality; allotment reference | — |
| `JAR-13-reuben-kirjathaim` | Kirjathaim | [13:19](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/13?lang=eng) | settlement / named locality; allotment reference | — |
| `JAR-13-reuben-sibmah` | Sibmah | [13:19](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/13?lang=eng) | settlement / named locality; allotment reference | — |
| `JAR-13-reuben-zareth-shahar` | Zareth-shahar | [13:19](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/13?lang=eng) | settlement / named locality; allotment reference | — |
| `JAR-13-reuben-mount-of-the-valley` | mount of the valley | [13:19](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/13?lang=eng) | boundary landform / landmark; allotment reference | — |
| `JAR-13-reuben-beth-peor` | Beth-peor | [13:20](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/13?lang=eng) | settlement / named locality; allotment reference | — |
| `JAR-13-reuben-ashdoth-pisgah` | Ashdoth-pisgah | [13:20](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/13?lang=eng) | boundary landform / landmark; allotment reference | — |
| `JAR-13-reuben-beth-jeshimoth` | Beth-jeshimoth | [13:20](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/13?lang=eng) | settlement / named locality; allotment reference | — |
| `JAR-13-reuben-midian` | Midian | [13:21](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/13?lang=eng) | region / extent / land feature; allotment reference | — |
| `JAR-13-reuben-jordan` | Jordan | [13:23](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/13?lang=eng) | water feature / water-place reference; allotment reference | OHP-JORDAN |

### Joshua 13 — Gad (`gad`)

| Stable key | Name / source forms | Verses | Type / role | Existing ID reuse |
|---|---|---|---|---|
| `JAR-13-gad-jazer` | Jazer | [13:25](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/13?lang=eng) | settlement / named locality; allotment/boundary reference | — |
| `JAR-13-gad-gilead` | Gilead | [13:25](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/13?lang=eng) | region / extent / land feature; allotment/boundary reference | — |
| `JAR-13-gad-ammon` | Ammon | [13:25](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/13?lang=eng) | region / extent / land feature; allotment/boundary reference | — |
| `JAR-13-gad-aroer-before-rabbah` | Aroer before Rabbah | [13:25](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/13?lang=eng) | settlement / named locality; allotment/boundary reference | — |
| `JAR-13-gad-rabbah` | Rabbah | [13:25](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/13?lang=eng) | settlement / named locality; allotment/boundary reference | — |
| `JAR-13-gad-heshbon` | Heshbon | [13:26,27](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/13?lang=eng) | settlement / named locality; allotment/boundary reference | — |
| `JAR-13-gad-ramath-mizpeh` | Ramath-mizpeh | [13:26](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/13?lang=eng) | settlement / named locality; allotment/boundary reference | — |
| `JAR-13-gad-betonim` | Betonim | [13:26](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/13?lang=eng) | settlement / named locality; allotment/boundary reference | — |
| `JAR-13-gad-mahanaim` | Mahanaim | [13:26](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/13?lang=eng) | settlement / named locality; allotment/boundary reference | OHP-MAHANAIM |
| `JAR-13-gad-debir` | Debir | [13:26](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/13?lang=eng) | settlement / named locality; allotment/boundary reference | — |
| `JAR-13-gad-beth-aram` | Beth-aram | [13:27](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/13?lang=eng) | settlement / named locality; allotment/boundary reference | — |
| `JAR-13-gad-beth-nimrah` | Beth-nimrah | [13:27](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/13?lang=eng) | settlement / named locality; allotment/boundary reference | — |
| `JAR-13-gad-succoth` | Succoth | [13:27](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/13?lang=eng) | settlement / named locality; allotment/boundary reference | — |
| `JAR-13-gad-zaphon` | Zaphon | [13:27](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/13?lang=eng) | settlement / named locality; allotment/boundary reference | — |
| `JAR-13-gad-jordan` | Jordan | [13:27](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/13?lang=eng) | water feature / water-place reference; allotment/boundary reference | OHP-JORDAN |
| `JAR-13-gad-sea-of-chinnereth` | sea of Chinnereth | [13:27](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/13?lang=eng) | water feature / water-place reference; allotment/boundary reference | — |

### Joshua 13 — Half Manasseh east / Machir portion (`manasseh-east`)

| Stable key | Name / source forms | Verses | Type / role | Existing ID reuse |
|---|---|---|---|---|
| `JAR-13-manasseh-east-mahanaim` | Mahanaim | [13:30](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/13?lang=eng) | settlement / named locality; allotment reference | OHP-MAHANAIM |
| `JAR-13-manasseh-east-bashan` | Bashan | [13:30,31](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/13?lang=eng) | region / extent / land feature; allotment reference | — |
| `JAR-13-manasseh-east-towns-of-jair` | towns of Jair | [13:30](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/13?lang=eng) | unnamed settlement/land group; allotment reference | — |
| `JAR-13-manasseh-east-gilead` | Gilead | [13:31](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/13?lang=eng) | region / extent / land feature; allotment reference | — |
| `JAR-13-manasseh-east-ashtaroth` | Ashtaroth | [13:31](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/13?lang=eng) | settlement / named locality; allotment reference | — |
| `JAR-13-manasseh-east-edrei` | Edrei | [13:31](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/13?lang=eng) | settlement / named locality; allotment reference | — |

### Joshua 13 — Eastern allocation setting (`allocation-setting`)

| Stable key | Name / source forms | Verses | Type / role | Existing ID reuse |
|---|---|---|---|---|
| `JAR-13-allocation-setting-plains-of-moab` | plains of Moab | [13:32](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/13?lang=eng) | region / extent / land feature; setting reference | — |
| `JAR-13-allocation-setting-jordan` | Jordan | [13:32](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/13?lang=eng) | water feature / water-place reference; setting reference | OHP-JORDAN |
| `JAR-13-allocation-setting-jericho` | Jericho | [13:32](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/13?lang=eng) | settlement / named locality; setting reference | AP06 |

### Joshua 14 — Western allocation overview (`allocation`)

| Stable key | Name / source forms | Verses | Type / role | Existing ID reuse |
|---|---|---|---|---|
| `JAR-14-allocation-canaan` | Canaan | [14:1](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/14?lang=eng) | region / extent / land feature; setting/territorial reference | — |
| `JAR-14-allocation-jordan` | Jordan | [14:3](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/14?lang=eng) | water feature / water-place reference; setting/territorial reference | OHP-JORDAN |

### Joshua 14 — Caleb / Judah (`caleb`)

| Stable key | Name / source forms | Verses | Type / role | Existing ID reuse |
|---|---|---|---|---|
| `JAR-14-caleb-gilgal` | Gilgal | [14:6](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/14?lang=eng) | settlement / named locality; grant and retrospective setting | OHP-GILGAL-JOSHUA |
| `JAR-14-caleb-kadesh-barnea` | Kadesh-barnea | [14:6,7](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/14?lang=eng) | settlement / named locality; grant and retrospective setting | OHP-KADESH |
| `JAR-14-caleb-wilderness` | wilderness | [14:10](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/14?lang=eng) | region / extent / land feature; grant and retrospective setting | — |
| `JAR-14-caleb-this-mountain` | this mountain | [14:12](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/14?lang=eng) | region / extent / land feature; grant and retrospective setting | — |
| `JAR-14-caleb-hebron` | Hebron / Kirjath-arba | [14:13,14,15](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/14?lang=eng) | settlement / named locality; grant and retrospective setting | OHP-HEBRON |

### Joshua 15 — Judah boundary (`boundary`)

| Stable key | Name / source forms | Verses | Type / role | Existing ID reuse |
|---|---|---|---|---|
| `JAR-15-boundary-edom` | Edom | [15:1](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/15?lang=eng) | region / extent / land feature; boundary reference | — |
| `JAR-15-boundary-wilderness-of-zin` | wilderness of Zin | [15:1](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/15?lang=eng) | region / extent / land feature; boundary reference | — |
| `JAR-15-boundary-salt-sea` | salt sea | [15:2,5](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/15?lang=eng) | water feature / water-place reference; boundary reference | — |
| `JAR-15-boundary-south-bay-of-salt-sea` | south bay of salt sea | [15:2](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/15?lang=eng) | water feature / water-place reference; boundary reference | — |
| `JAR-15-boundary-maaleh-acrabbim` | Maaleh-acrabbim | [15:3](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/15?lang=eng) | boundary landform / landmark; boundary reference | — |
| `JAR-15-boundary-zin` | Zin | [15:3](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/15?lang=eng) | region / extent / land feature; boundary reference | — |
| `JAR-15-boundary-kadesh-barnea` | Kadesh-barnea | [15:3](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/15?lang=eng) | settlement / named locality; boundary reference | OHP-KADESH |
| `JAR-15-boundary-hezron` | Hezron | [15:3](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/15?lang=eng) | settlement / named locality; boundary reference | — |
| `JAR-15-boundary-adar` | Adar | [15:3](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/15?lang=eng) | settlement / named locality; boundary reference | — |
| `JAR-15-boundary-karkaa` | Karkaa | [15:3](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/15?lang=eng) | settlement / named locality; boundary reference | — |
| `JAR-15-boundary-azmon` | Azmon | [15:4](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/15?lang=eng) | settlement / named locality; boundary reference | — |
| `JAR-15-boundary-river-of-egypt` | river of Egypt | [15:4](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/15?lang=eng) | water feature / water-place reference; boundary reference | — |
| `JAR-15-boundary-sea` | sea | [15:4,11](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/15?lang=eng) | water feature / water-place reference; boundary reference | — |
| `JAR-15-boundary-jordan` | Jordan | [15:5](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/15?lang=eng) | water feature / water-place reference; boundary reference | OHP-JORDAN |
| `JAR-15-boundary-north-bay-of-salt-sea` | north bay of salt sea | [15:5](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/15?lang=eng) | water feature / water-place reference; boundary reference | — |
| `JAR-15-boundary-beth-hogla` | Beth-hogla | [15:6](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/15?lang=eng) | settlement / named locality; boundary reference | — |
| `JAR-15-boundary-beth-arabah` | Beth-arabah | [15:6](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/15?lang=eng) | settlement / named locality; boundary reference | — |
| `JAR-15-boundary-stone-of-bohan` | stone of Bohan | [15:6](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/15?lang=eng) | boundary landform / landmark; boundary reference | — |
| `JAR-15-boundary-debir` | Debir | [15:7](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/15?lang=eng) | settlement / named locality; boundary reference | — |
| `JAR-15-boundary-valley-of-achor` | valley of Achor | [15:7](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/15?lang=eng) | boundary landform / landmark; boundary reference | — |
| `JAR-15-boundary-gilgal` | Gilgal | [15:7](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/15?lang=eng) | settlement / named locality; boundary reference | — |
| `JAR-15-boundary-going-up-of-adummim` | going up of Adummim | [15:7](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/15?lang=eng) | boundary landform / landmark; boundary reference | — |
| `JAR-15-boundary-river-south-of-adummim` | river south of Adummim | [15:7](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/15?lang=eng) | water feature / water-place reference; boundary reference | — |
| `JAR-15-boundary-waters-of-en-shemesh` | waters of En-shemesh | [15:7](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/15?lang=eng) | water feature / water-place reference; boundary reference | — |
| `JAR-15-boundary-en-rogel` | En-rogel | [15:7](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/15?lang=eng) | settlement / named locality; boundary reference | — |
| `JAR-15-boundary-valley-of-the-son-of-hinnom` | valley of the son of Hinnom | [15:8](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/15?lang=eng) | boundary landform / landmark; boundary reference | — |
| `JAR-15-boundary-jebusite` | Jebusite / Jerusalem | [15:8](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/15?lang=eng) | settlement / named locality; boundary reference | P08 |
| `JAR-15-boundary-unnamed-mountain-before-hinnom` | unnamed mountain before Hinnom | [15:8](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/15?lang=eng) | boundary landform / landmark; boundary reference | — |
| `JAR-15-boundary-valley-of-the-giants` | valley of the giants | [15:8](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/15?lang=eng) | boundary landform / landmark; boundary reference | — |
| `JAR-15-boundary-fountain-of-nephtoah` | fountain of Nephtoah | [15:9](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/15?lang=eng) | water feature / water-place reference; boundary reference | — |
| `JAR-15-boundary-mount-ephron` | mount Ephron | [15:9](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/15?lang=eng) | boundary landform / landmark; boundary reference | — |
| `JAR-15-boundary-baalah` | Baalah / Kirjath-jearim | [15:9,10](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/15?lang=eng) | settlement / named locality; boundary reference | OHP-KIRJATHJEARIM |
| `JAR-15-boundary-mount-seir` | mount Seir | [15:10](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/15?lang=eng) | boundary landform / landmark; boundary reference | — |
| `JAR-15-boundary-mount-jearim` | mount Jearim / Chesalon | [15:10](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/15?lang=eng) | boundary landform / landmark; boundary reference | — |
| `JAR-15-boundary-beth-shemesh` | Beth-shemesh | [15:10](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/15?lang=eng) | settlement / named locality; boundary reference | OHP-BETHSHEMESH-JUDAH |
| `JAR-15-boundary-timnah` | Timnah | [15:10](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/15?lang=eng) | settlement / named locality; boundary reference | — |
| `JAR-15-boundary-ekron` | Ekron | [15:11](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/15?lang=eng) | settlement / named locality; boundary reference | OHP-EKRON |
| `JAR-15-boundary-shicron` | Shicron | [15:11](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/15?lang=eng) | settlement / named locality; boundary reference | — |
| `JAR-15-boundary-mount-baalah` | mount Baalah | [15:11](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/15?lang=eng) | boundary landform / landmark; boundary reference | — |
| `JAR-15-boundary-jabneel` | Jabneel | [15:11](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/15?lang=eng) | settlement / named locality; boundary reference | — |
| `JAR-15-boundary-great-sea` | great sea | [15:12](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/15?lang=eng) | water feature / water-place reference; boundary reference | — |

### Joshua 15 — Caleb / Judah (`caleb`)

| Stable key | Name / source forms | Verses | Type / role | Existing ID reuse |
|---|---|---|---|---|
| `JAR-15-caleb-city-of-arba` | city of Arba / Hebron | [15:13](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/15?lang=eng) | settlement / named locality; grant/conquest reference | OHP-HEBRON |
| `JAR-15-caleb-debir` | Debir / Kirjath-sepher | [15:15,16](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/15?lang=eng) | settlement / named locality; grant/conquest reference | — |
| `JAR-15-caleb-south-land` | south land | [15:19](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/15?lang=eng) | region / extent / land feature; grant/conquest reference | — |
| `JAR-15-caleb-upper-springs` | upper springs | [15:19](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/15?lang=eng) | water feature / water-place reference; grant/conquest reference | — |
| `JAR-15-caleb-nether-springs` | nether springs | [15:19](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/15?lang=eng) | water feature / water-place reference; grant/conquest reference | — |

### Joshua 15 — Judah southern cities (`south`)

| Stable key | Name / source forms | Verses | Type / role | Existing ID reuse |
|---|---|---|---|---|
| `JAR-15-south-edom` | Edom | [15:21](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/15?lang=eng) | region / extent / land feature; settlement list | — |
| `JAR-15-south-kabzeel` | Kabzeel | [15:21](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/15?lang=eng) | settlement / named locality; settlement list | — |
| `JAR-15-south-eder` | Eder | [15:21](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/15?lang=eng) | settlement / named locality; settlement list | — |
| `JAR-15-south-jagur` | Jagur | [15:21](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/15?lang=eng) | settlement / named locality; settlement list | — |
| `JAR-15-south-kinah` | Kinah | [15:22](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/15?lang=eng) | settlement / named locality; settlement list | — |
| `JAR-15-south-dimonah` | Dimonah | [15:22](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/15?lang=eng) | settlement / named locality; settlement list | — |
| `JAR-15-south-adadah` | Adadah | [15:22](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/15?lang=eng) | settlement / named locality; settlement list | — |
| `JAR-15-south-kedesh` | Kedesh | [15:23](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/15?lang=eng) | settlement / named locality; settlement list | — |
| `JAR-15-south-hazor-15-23` | Hazor | [15:23](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/15?lang=eng) | settlement / named locality; settlement list | — |
| `JAR-15-south-ithnan` | Ithnan | [15:23](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/15?lang=eng) | settlement / named locality; settlement list | — |
| `JAR-15-south-ziph` | Ziph | [15:24](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/15?lang=eng) | settlement / named locality; settlement list | — |
| `JAR-15-south-telem` | Telem | [15:24](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/15?lang=eng) | settlement / named locality; settlement list | — |
| `JAR-15-south-bealoth` | Bealoth | [15:24](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/15?lang=eng) | settlement / named locality; settlement list | — |
| `JAR-15-south-hazor-15-25-first` | Hazor | [15:25](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/15?lang=eng) | settlement / named locality; settlement list | — |
| `JAR-15-south-hadattah` | Hadattah | [15:25](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/15?lang=eng) | settlement / named locality; settlement list | — |
| `JAR-15-south-kerioth` | Kerioth | [15:25](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/15?lang=eng) | settlement / named locality; settlement list | — |
| `JAR-15-south-hezron` | Hezron / Hazor | [15:25](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/15?lang=eng) | settlement / named locality; settlement list | — |
| `JAR-15-south-amam` | Amam | [15:26](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/15?lang=eng) | settlement / named locality; settlement list | — |
| `JAR-15-south-shema` | Shema | [15:26](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/15?lang=eng) | settlement / named locality; settlement list | — |
| `JAR-15-south-moladah` | Moladah | [15:26](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/15?lang=eng) | settlement / named locality; settlement list | — |
| `JAR-15-south-hazar-gaddah` | Hazar-gaddah | [15:27](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/15?lang=eng) | settlement / named locality; settlement list | — |
| `JAR-15-south-heshmon` | Heshmon | [15:27](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/15?lang=eng) | settlement / named locality; settlement list | — |
| `JAR-15-south-beth-palet` | Beth-palet | [15:27](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/15?lang=eng) | settlement / named locality; settlement list | — |
| `JAR-15-south-hazar-shual` | Hazar-shual | [15:28](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/15?lang=eng) | settlement / named locality; settlement list | — |
| `JAR-15-south-beer-sheba` | Beer-sheba | [15:28](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/15?lang=eng) | settlement / named locality; settlement list | OHP-BEERSHEBA |
| `JAR-15-south-bizjothjah` | Bizjothjah | [15:28](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/15?lang=eng) | settlement / named locality; settlement list | — |
| `JAR-15-south-baalah` | Baalah | [15:29](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/15?lang=eng) | settlement / named locality; settlement list | — |
| `JAR-15-south-iim` | Iim | [15:29](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/15?lang=eng) | settlement / named locality; settlement list | — |
| `JAR-15-south-azem` | Azem | [15:29](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/15?lang=eng) | settlement / named locality; settlement list | — |
| `JAR-15-south-eltolad` | Eltolad | [15:30](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/15?lang=eng) | settlement / named locality; settlement list | — |
| `JAR-15-south-chesil` | Chesil | [15:30](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/15?lang=eng) | settlement / named locality; settlement list | — |
| `JAR-15-south-hormah` | Hormah | [15:30](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/15?lang=eng) | settlement / named locality; settlement list | — |
| `JAR-15-south-ziklag` | Ziklag | [15:31](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/15?lang=eng) | settlement / named locality; settlement list | OHP-ZIKLAG |
| `JAR-15-south-madmannah` | Madmannah | [15:31](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/15?lang=eng) | settlement / named locality; settlement list | — |
| `JAR-15-south-sansannah` | Sansannah | [15:31](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/15?lang=eng) | settlement / named locality; settlement list | — |
| `JAR-15-south-lebaoth` | Lebaoth | [15:32](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/15?lang=eng) | settlement / named locality; settlement list | — |
| `JAR-15-south-shilhim` | Shilhim | [15:32](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/15?lang=eng) | settlement / named locality; settlement list | — |
| `JAR-15-south-ain` | Ain | [15:32](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/15?lang=eng) | settlement / named locality; settlement list | — |
| `JAR-15-south-rimmon` | Rimmon | [15:32](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/15?lang=eng) | settlement / named locality; settlement list | — |

### Joshua 15 — Judah lowland list 1 (`lowland-1`)

| Stable key | Name / source forms | Verses | Type / role | Existing ID reuse |
|---|---|---|---|---|
| `JAR-15-lowland-1-eshtaol` | Eshtaol | [15:33](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/15?lang=eng) | settlement / named locality; settlement list | — |
| `JAR-15-lowland-1-zoreah` | Zoreah | [15:33](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/15?lang=eng) | settlement / named locality; settlement list | — |
| `JAR-15-lowland-1-ashnah` | Ashnah | [15:33](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/15?lang=eng) | settlement / named locality; settlement list | — |
| `JAR-15-lowland-1-zanoah` | Zanoah | [15:34](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/15?lang=eng) | settlement / named locality; settlement list | — |
| `JAR-15-lowland-1-en-gannim` | En-gannim | [15:34](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/15?lang=eng) | settlement / named locality; settlement list | — |
| `JAR-15-lowland-1-tappuah` | Tappuah | [15:34](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/15?lang=eng) | settlement / named locality; settlement list | — |
| `JAR-15-lowland-1-enam` | Enam | [15:34](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/15?lang=eng) | settlement / named locality; settlement list | — |
| `JAR-15-lowland-1-jarmuth` | Jarmuth | [15:35](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/15?lang=eng) | settlement / named locality; settlement list | — |
| `JAR-15-lowland-1-adullam` | Adullam | [15:35](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/15?lang=eng) | settlement / named locality; settlement list | — |
| `JAR-15-lowland-1-socoh` | Socoh | [15:35](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/15?lang=eng) | settlement / named locality; settlement list | — |
| `JAR-15-lowland-1-azekah` | Azekah | [15:35](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/15?lang=eng) | settlement / named locality; settlement list | — |
| `JAR-15-lowland-1-sharaim` | Sharaim | [15:36](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/15?lang=eng) | settlement / named locality; settlement list | — |
| `JAR-15-lowland-1-adithaim` | Adithaim | [15:36](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/15?lang=eng) | settlement / named locality; settlement list | — |
| `JAR-15-lowland-1-gederah` | Gederah | [15:36](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/15?lang=eng) | settlement / named locality; settlement list | — |
| `JAR-15-lowland-1-gederothaim` | Gederothaim | [15:36](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/15?lang=eng) | settlement / named locality; settlement list | — |

### Joshua 15 — Judah lowland list 2 (`lowland-2`)

| Stable key | Name / source forms | Verses | Type / role | Existing ID reuse |
|---|---|---|---|---|
| `JAR-15-lowland-2-zenan` | Zenan | [15:37](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/15?lang=eng) | settlement / named locality; settlement list | — |
| `JAR-15-lowland-2-hadashah` | Hadashah | [15:37](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/15?lang=eng) | settlement / named locality; settlement list | — |
| `JAR-15-lowland-2-migdal-gad` | Migdal-gad | [15:37](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/15?lang=eng) | settlement / named locality; settlement list | — |
| `JAR-15-lowland-2-dilean` | Dilean | [15:38](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/15?lang=eng) | settlement / named locality; settlement list | — |
| `JAR-15-lowland-2-mizpeh` | Mizpeh | [15:38](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/15?lang=eng) | settlement / named locality; settlement list | — |
| `JAR-15-lowland-2-joktheel` | Joktheel | [15:38](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/15?lang=eng) | settlement / named locality; settlement list | — |
| `JAR-15-lowland-2-lachish` | Lachish | [15:39](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/15?lang=eng) | settlement / named locality; settlement list | OHP-LACHISH |
| `JAR-15-lowland-2-bozkath` | Bozkath | [15:39](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/15?lang=eng) | settlement / named locality; settlement list | — |
| `JAR-15-lowland-2-eglon` | Eglon | [15:39](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/15?lang=eng) | settlement / named locality; settlement list | — |
| `JAR-15-lowland-2-cabbon` | Cabbon | [15:40](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/15?lang=eng) | settlement / named locality; settlement list | — |
| `JAR-15-lowland-2-lahmam` | Lahmam | [15:40](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/15?lang=eng) | settlement / named locality; settlement list | — |
| `JAR-15-lowland-2-kithlish` | Kithlish | [15:40](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/15?lang=eng) | settlement / named locality; settlement list | — |
| `JAR-15-lowland-2-gederoth` | Gederoth | [15:41](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/15?lang=eng) | settlement / named locality; settlement list | — |
| `JAR-15-lowland-2-beth-dagon` | Beth-dagon | [15:41](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/15?lang=eng) | settlement / named locality; settlement list | — |
| `JAR-15-lowland-2-naamah` | Naamah | [15:41](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/15?lang=eng) | settlement / named locality; settlement list | — |
| `JAR-15-lowland-2-makkedah` | Makkedah | [15:41](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/15?lang=eng) | settlement / named locality; settlement list | — |

### Joshua 15 — Judah lowland list 3 (`lowland-3`)

| Stable key | Name / source forms | Verses | Type / role | Existing ID reuse |
|---|---|---|---|---|
| `JAR-15-lowland-3-libnah` | Libnah | [15:42](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/15?lang=eng) | settlement / named locality; settlement list | — |
| `JAR-15-lowland-3-ether` | Ether | [15:42](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/15?lang=eng) | settlement / named locality; settlement list | — |
| `JAR-15-lowland-3-ashan` | Ashan | [15:42](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/15?lang=eng) | settlement / named locality; settlement list | — |
| `JAR-15-lowland-3-jiphtah` | Jiphtah | [15:43](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/15?lang=eng) | settlement / named locality; settlement list | — |
| `JAR-15-lowland-3-ashnah` | Ashnah | [15:43](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/15?lang=eng) | settlement / named locality; settlement list | — |
| `JAR-15-lowland-3-nezib` | Nezib | [15:43](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/15?lang=eng) | settlement / named locality; settlement list | — |
| `JAR-15-lowland-3-keilah` | Keilah | [15:44](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/15?lang=eng) | settlement / named locality; settlement list | — |
| `JAR-15-lowland-3-achzib` | Achzib | [15:44](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/15?lang=eng) | settlement / named locality; settlement list | — |
| `JAR-15-lowland-3-mareshah` | Mareshah | [15:44](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/15?lang=eng) | settlement / named locality; settlement list | — |

### Joshua 15 — Judah coastal claims (`coast`)

| Stable key | Name / source forms | Verses | Type / role | Existing ID reuse |
|---|---|---|---|---|
| `JAR-15-coast-ekron` | Ekron | [15:45,46](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/15?lang=eng) | settlement / named locality; settlement/extent reference | OHP-EKRON |
| `JAR-15-coast-sea` | sea | [15:46](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/15?lang=eng) | water feature / water-place reference; settlement/extent reference | — |
| `JAR-15-coast-ashdod` | Ashdod | [15:46,47](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/15?lang=eng) | settlement / named locality; settlement/extent reference | OHP-ASHDOD |
| `JAR-15-coast-gaza` | Gaza | [15:47](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/15?lang=eng) | settlement / named locality; settlement/extent reference | OHP-GAZA |
| `JAR-15-coast-river-of-egypt` | river of Egypt | [15:47](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/15?lang=eng) | water feature / water-place reference; settlement/extent reference | — |
| `JAR-15-coast-great-sea` | great sea | [15:47](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/15?lang=eng) | water feature / water-place reference; settlement/extent reference | — |

### Joshua 15 — Judah hill-country list 1 (`hills-1`)

| Stable key | Name / source forms | Verses | Type / role | Existing ID reuse |
|---|---|---|---|---|
| `JAR-15-hills-1-shamir` | Shamir | [15:48](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/15?lang=eng) | settlement / named locality; settlement list | — |
| `JAR-15-hills-1-jattir` | Jattir | [15:48](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/15?lang=eng) | settlement / named locality; settlement list | — |
| `JAR-15-hills-1-socoh` | Socoh | [15:48](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/15?lang=eng) | settlement / named locality; settlement list | — |
| `JAR-15-hills-1-dannah` | Dannah | [15:49](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/15?lang=eng) | settlement / named locality; settlement list | — |
| `JAR-15-hills-1-kirjath-sannah` | Kirjath-sannah / Debir | [15:49](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/15?lang=eng) | settlement / named locality; settlement list | — |
| `JAR-15-hills-1-anab` | Anab | [15:50](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/15?lang=eng) | settlement / named locality; settlement list | — |
| `JAR-15-hills-1-eshtemoh` | Eshtemoh | [15:50](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/15?lang=eng) | settlement / named locality; settlement list | — |
| `JAR-15-hills-1-anim` | Anim | [15:50](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/15?lang=eng) | settlement / named locality; settlement list | — |
| `JAR-15-hills-1-goshen` | Goshen | [15:51](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/15?lang=eng) | settlement / named locality; settlement list | — |
| `JAR-15-hills-1-holon` | Holon | [15:51](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/15?lang=eng) | settlement / named locality; settlement list | — |
| `JAR-15-hills-1-giloh` | Giloh | [15:51](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/15?lang=eng) | settlement / named locality; settlement list | — |

### Joshua 15 — Judah hill-country list 2 (`hills-2`)

| Stable key | Name / source forms | Verses | Type / role | Existing ID reuse |
|---|---|---|---|---|
| `JAR-15-hills-2-arab` | Arab | [15:52](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/15?lang=eng) | settlement / named locality; settlement list | — |
| `JAR-15-hills-2-dumah` | Dumah | [15:52](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/15?lang=eng) | settlement / named locality; settlement list | — |
| `JAR-15-hills-2-eshean` | Eshean | [15:52](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/15?lang=eng) | settlement / named locality; settlement list | — |
| `JAR-15-hills-2-janum` | Janum | [15:53](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/15?lang=eng) | settlement / named locality; settlement list | — |
| `JAR-15-hills-2-beth-tappuah` | Beth-tappuah | [15:53](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/15?lang=eng) | settlement / named locality; settlement list | — |
| `JAR-15-hills-2-aphekah` | Aphekah | [15:53](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/15?lang=eng) | settlement / named locality; settlement list | — |
| `JAR-15-hills-2-humtah` | Humtah | [15:54](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/15?lang=eng) | settlement / named locality; settlement list | — |
| `JAR-15-hills-2-kirjath-arba` | Kirjath-arba / Hebron | [15:54](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/15?lang=eng) | settlement / named locality; settlement list | OHP-HEBRON |
| `JAR-15-hills-2-zior` | Zior | [15:54](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/15?lang=eng) | settlement / named locality; settlement list | — |

### Joshua 15 — Judah hill-country list 3 (`hills-3`)

| Stable key | Name / source forms | Verses | Type / role | Existing ID reuse |
|---|---|---|---|---|
| `JAR-15-hills-3-maon` | Maon | [15:55](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/15?lang=eng) | settlement / named locality; settlement list | — |
| `JAR-15-hills-3-carmel` | Carmel | [15:55](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/15?lang=eng) | settlement / named locality; settlement list | OHP-CARMEL-JUDAH |
| `JAR-15-hills-3-ziph` | Ziph | [15:55](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/15?lang=eng) | settlement / named locality; settlement list | — |
| `JAR-15-hills-3-juttah` | Juttah | [15:55](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/15?lang=eng) | settlement / named locality; settlement list | — |
| `JAR-15-hills-3-jezreel` | Jezreel | [15:56](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/15?lang=eng) | settlement / named locality; settlement list | — |
| `JAR-15-hills-3-jokdeam` | Jokdeam | [15:56](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/15?lang=eng) | settlement / named locality; settlement list | — |
| `JAR-15-hills-3-zanoah` | Zanoah | [15:56](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/15?lang=eng) | settlement / named locality; settlement list | — |
| `JAR-15-hills-3-cain` | Cain | [15:57](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/15?lang=eng) | settlement / named locality; settlement list | — |
| `JAR-15-hills-3-gibeah` | Gibeah | [15:57](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/15?lang=eng) | settlement / named locality; settlement list | — |
| `JAR-15-hills-3-timnah` | Timnah | [15:57](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/15?lang=eng) | settlement / named locality; settlement list | — |

### Joshua 15 — Judah hill-country list 4 (`hills-4`)

| Stable key | Name / source forms | Verses | Type / role | Existing ID reuse |
|---|---|---|---|---|
| `JAR-15-hills-4-halhul` | Halhul | [15:58](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/15?lang=eng) | settlement / named locality; settlement list | — |
| `JAR-15-hills-4-beth-zur` | Beth-zur | [15:58](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/15?lang=eng) | settlement / named locality; settlement list | — |
| `JAR-15-hills-4-gedor` | Gedor | [15:58](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/15?lang=eng) | settlement / named locality; settlement list | — |
| `JAR-15-hills-4-maarath` | Maarath | [15:59](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/15?lang=eng) | settlement / named locality; settlement list | — |
| `JAR-15-hills-4-beth-anoth` | Beth-anoth | [15:59](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/15?lang=eng) | settlement / named locality; settlement list | — |
| `JAR-15-hills-4-eltekon` | Eltekon | [15:59](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/15?lang=eng) | settlement / named locality; settlement list | — |

### Joshua 15 — Judah hill-country list 5 (`hills-5`)

| Stable key | Name / source forms | Verses | Type / role | Existing ID reuse |
|---|---|---|---|---|
| `JAR-15-hills-5-kirjath-baal` | Kirjath-baal / Kirjath-jearim | [15:60](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/15?lang=eng) | settlement / named locality; settlement list | OHP-KIRJATHJEARIM |
| `JAR-15-hills-5-rabbah` | Rabbah | [15:60](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/15?lang=eng) | settlement / named locality; settlement list | — |

### Joshua 15 — Judah wilderness cities (`wilderness`)

| Stable key | Name / source forms | Verses | Type / role | Existing ID reuse |
|---|---|---|---|---|
| `JAR-15-wilderness-beth-arabah` | Beth-arabah | [15:61](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/15?lang=eng) | settlement / named locality; settlement list | — |
| `JAR-15-wilderness-middin` | Middin | [15:61](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/15?lang=eng) | settlement / named locality; settlement list | — |
| `JAR-15-wilderness-secacah` | Secacah | [15:61](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/15?lang=eng) | settlement / named locality; settlement list | — |
| `JAR-15-wilderness-nibshan` | Nibshan | [15:62](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/15?lang=eng) | settlement / named locality; settlement list | — |
| `JAR-15-wilderness-city-of-salt` | city of Salt | [15:62](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/15?lang=eng) | settlement / named locality; settlement list | — |
| `JAR-15-wilderness-en-gedi` | En-gedi | [15:62](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/15?lang=eng) | settlement / named locality; settlement list | — |

### Joshua 15 — Judah possession limitation (`possession`)

| Stable key | Name / source forms | Verses | Type / role | Existing ID reuse |
|---|---|---|---|---|
| `JAR-15-possession-jerusalem` | Jerusalem | [15:63](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/15?lang=eng) | settlement / named locality; possession reference | P08 |

### Joshua 16 — Joseph / Ephraim and Manasseh (`joseph-boundary`)

| Stable key | Name / source forms | Verses | Type / role | Existing ID reuse |
|---|---|---|---|---|
| `JAR-16-joseph-boundary-jordan` | Jordan | [16:1](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/16?lang=eng) | water feature / water-place reference; boundary reference | OHP-JORDAN |
| `JAR-16-joseph-boundary-jericho` | Jericho | [16:1](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/16?lang=eng) | settlement / named locality; boundary reference | AP06 |
| `JAR-16-joseph-boundary-water-of-jericho` | water of Jericho | [16:1](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/16?lang=eng) | water feature / water-place reference; boundary reference | — |
| `JAR-16-joseph-boundary-wilderness-ascending-from-jericho` | wilderness ascending from Jericho | [16:1](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/16?lang=eng) | region / extent / land feature; boundary reference | — |
| `JAR-16-joseph-boundary-mount-beth-el` | mount Beth-el | [16:1](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/16?lang=eng) | boundary landform / landmark; boundary reference | — |
| `JAR-16-joseph-boundary-beth-el` | Beth-el | [16:2](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/16?lang=eng) | settlement / named locality; boundary reference | OHP-BETHEL |
| `JAR-16-joseph-boundary-luz` | Luz | [16:2](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/16?lang=eng) | settlement / named locality; boundary reference | — |
| `JAR-16-joseph-boundary-archi` | Archi | [16:2](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/16?lang=eng) | people/territorial label (not a city); boundary reference | — |
| `JAR-16-joseph-boundary-ataroth` | Ataroth | [16:2](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/16?lang=eng) | settlement / named locality; boundary reference | — |
| `JAR-16-joseph-boundary-japhleti` | Japhleti | [16:3](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/16?lang=eng) | people/territorial label (not a city); boundary reference | — |
| `JAR-16-joseph-boundary-beth-horon-the-nether` | Beth-horon the nether | [16:3](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/16?lang=eng) | settlement / named locality; boundary reference | — |
| `JAR-16-joseph-boundary-gezer` | Gezer | [16:3](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/16?lang=eng) | settlement / named locality; boundary reference | — |
| `JAR-16-joseph-boundary-sea` | sea | [16:3](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/16?lang=eng) | water feature / water-place reference; boundary reference | — |

### Joshua 16 — Ephraim (`ephraim`)

| Stable key | Name / source forms | Verses | Type / role | Existing ID reuse |
|---|---|---|---|---|
| `JAR-16-ephraim-ataroth-addar` | Ataroth-addar | [16:5](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/16?lang=eng) | settlement / named locality; boundary/possession reference | — |
| `JAR-16-ephraim-beth-horon-the-upper` | Beth-horon the upper | [16:5](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/16?lang=eng) | settlement / named locality; boundary/possession reference | — |
| `JAR-16-ephraim-sea` | sea | [16:6,8](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/16?lang=eng) | water feature / water-place reference; boundary/possession reference | — |
| `JAR-16-ephraim-michmethah` | Michmethah | [16:6](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/16?lang=eng) | settlement / named locality; boundary/possession reference | — |
| `JAR-16-ephraim-taanath-shiloh` | Taanath-shiloh | [16:6](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/16?lang=eng) | settlement / named locality; boundary/possession reference | — |
| `JAR-16-ephraim-janohah` | Janohah | [16:6,7](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/16?lang=eng) | settlement / named locality; boundary/possession reference | — |
| `JAR-16-ephraim-ataroth` | Ataroth | [16:7](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/16?lang=eng) | settlement / named locality; boundary/possession reference | — |
| `JAR-16-ephraim-naarath` | Naarath | [16:7](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/16?lang=eng) | settlement / named locality; boundary/possession reference | — |
| `JAR-16-ephraim-jericho` | Jericho | [16:7](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/16?lang=eng) | settlement / named locality; boundary/possession reference | AP06 |
| `JAR-16-ephraim-jordan` | Jordan | [16:7](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/16?lang=eng) | water feature / water-place reference; boundary/possession reference | OHP-JORDAN |
| `JAR-16-ephraim-tappuah` | Tappuah | [16:8](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/16?lang=eng) | settlement / named locality; boundary/possession reference | — |
| `JAR-16-ephraim-river-kanah` | river Kanah | [16:8](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/16?lang=eng) | water feature / water-place reference; boundary/possession reference | — |
| `JAR-16-ephraim-manasseh` | Manasseh | [16:9](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/16?lang=eng) | region / extent / land feature; boundary/possession reference | — |
| `JAR-16-ephraim-gezer` | Gezer | [16:10](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/16?lang=eng) | settlement / named locality; boundary/possession reference | — |

### Joshua 17 — Manasseh east / Machir (`east`)

| Stable key | Name / source forms | Verses | Type / role | Existing ID reuse |
|---|---|---|---|---|
| `JAR-17-east-gilead` | Gilead | [17:1,5,6](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/17?lang=eng) | region / extent / land feature; territorial reference | — |
| `JAR-17-east-bashan` | Bashan | [17:1,5](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/17?lang=eng) | region / extent / land feature; territorial reference | — |
| `JAR-17-east-jordan` | Jordan | [17:5](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/17?lang=eng) | water feature / water-place reference; territorial reference | OHP-JORDAN |

### Joshua 17 — Manasseh west / Ephraim adjacency (`boundary`)

| Stable key | Name / source forms | Verses | Type / role | Existing ID reuse |
|---|---|---|---|---|
| `JAR-17-boundary-asher-17-7` | Asher | [17:7](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/17?lang=eng) | boundary label; town/region unresolved; boundary reference | — |
| `JAR-17-boundary-michmethah` | Michmethah | [17:7](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/17?lang=eng) | settlement / named locality; boundary reference | — |
| `JAR-17-boundary-shechem` | Shechem | [17:7](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/17?lang=eng) | settlement / named locality; boundary reference | P02 |
| `JAR-17-boundary-en-tappuah` | En-tappuah | [17:7](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/17?lang=eng) | settlement / named locality; boundary reference | — |
| `JAR-17-boundary-land-of-tappuah` | land of Tappuah | [17:8](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/17?lang=eng) | region / extent / land feature; boundary reference | — |
| `JAR-17-boundary-tappuah` | Tappuah | [17:8](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/17?lang=eng) | settlement / named locality; boundary reference | — |
| `JAR-17-boundary-river-kanah` | river Kanah | [17:9](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/17?lang=eng) | water feature / water-place reference; boundary reference | — |
| `JAR-17-boundary-sea` | sea | [17:9,10](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/17?lang=eng) | water feature / water-place reference; boundary reference | — |
| `JAR-17-boundary-ephraim` | Ephraim | [17:10](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/17?lang=eng) | region / extent / land feature; boundary reference | — |
| `JAR-17-boundary-manasseh` | Manasseh | [17:10](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/17?lang=eng) | region / extent / land feature; boundary reference | — |
| `JAR-17-boundary-asher-17-10` | Asher | [17:10](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/17?lang=eng) | region / extent / land feature; boundary reference | — |
| `JAR-17-boundary-issachar` | Issachar | [17:10](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/17?lang=eng) | region / extent / land feature; boundary reference | — |

### Joshua 17 — Manasseh towns within Issachar/Asher (`towns`)

| Stable key | Name / source forms | Verses | Type / role | Existing ID reuse |
|---|---|---|---|---|
| `JAR-17-towns-issachar` | Issachar | [17:11](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/17?lang=eng) | region / extent / land feature; settlement/possession list | — |
| `JAR-17-towns-asher` | Asher | [17:11](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/17?lang=eng) | region / extent / land feature; settlement/possession list | — |
| `JAR-17-towns-beth-shean` | Beth-shean | [17:11](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/17?lang=eng) | settlement / named locality; settlement/possession list | — |
| `JAR-17-towns-ibleam` | Ibleam | [17:11](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/17?lang=eng) | settlement / named locality; settlement/possession list | — |
| `JAR-17-towns-dor` | Dor | [17:11](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/17?lang=eng) | settlement / named locality; settlement/possession list | — |
| `JAR-17-towns-en-dor` | En-dor | [17:11](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/17?lang=eng) | settlement / named locality; settlement/possession list | — |
| `JAR-17-towns-taanach` | Taanach | [17:11](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/17?lang=eng) | settlement / named locality; settlement/possession list | — |
| `JAR-17-towns-megiddo` | Megiddo | [17:11](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/17?lang=eng) | settlement / named locality; settlement/possession list | OHP-MEGIDDO |

### Joshua 17 — Joseph / Ephraim and Manasseh (`complaint`)

| Stable key | Name / source forms | Verses | Type / role | Existing ID reuse |
|---|---|---|---|---|
| `JAR-17-complaint-wood-country` | wood country | [17:15](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/17?lang=eng) | region / extent / land feature; territorial complaint | — |
| `JAR-17-complaint-land-of-the-perizzites` | land of the Perizzites | [17:15](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/17?lang=eng) | people/territorial label (not a city); territorial complaint | — |
| `JAR-17-complaint-land-of-the-giants` | land of the giants | [17:15](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/17?lang=eng) | people/territorial label (not a city); territorial complaint | — |
| `JAR-17-complaint-mount-ephraim` | mount Ephraim | [17:15](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/17?lang=eng) | boundary landform / landmark; territorial complaint | — |
| `JAR-17-complaint-land-of-the-valley` | land of the valley | [17:16](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/17?lang=eng) | region / extent / land feature; territorial complaint | — |
| `JAR-17-complaint-beth-shean` | Beth-shean | [17:16](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/17?lang=eng) | settlement / named locality; territorial complaint | — |
| `JAR-17-complaint-valley-of-jezreel` | valley of Jezreel | [17:16](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/17?lang=eng) | boundary landform / landmark; territorial complaint | — |
| `JAR-17-complaint-wooded-mountain` | wooded mountain | [17:18](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/17?lang=eng) | region / extent / land feature; territorial complaint | — |

### Joshua 18 — Seven-tribe survey and casting lots (`survey`)

| Stable key | Name / source forms | Verses | Type / role | Existing ID reuse |
|---|---|---|---|---|
| `JAR-18-survey-shiloh` | Shiloh | [18:1,8,9,10](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/18?lang=eng) | settlement / named locality; assembly/survey setting | OHP-SHILOH |
| `JAR-18-survey-judah` | Judah | [18:5,11](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/18?lang=eng) | region / extent / land feature; assembly/survey setting | — |
| `JAR-18-survey-joseph` | Joseph | [18:5,11](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/18?lang=eng) | region / extent / land feature; assembly/survey setting | — |
| `JAR-18-survey-jordan` | Jordan | [18:7](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/18?lang=eng) | water feature / water-place reference; assembly/survey setting | OHP-JORDAN |

### Joshua 18 — Benjamin boundary (`benjamin-boundary`)

| Stable key | Name / source forms | Verses | Type / role | Existing ID reuse |
|---|---|---|---|---|
| `JAR-18-benjamin-boundary-jordan` | Jordan | [18:12,19,20](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/18?lang=eng) | water feature / water-place reference; boundary reference | OHP-JORDAN |
| `JAR-18-benjamin-boundary-jericho` | Jericho | [18:12](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/18?lang=eng) | settlement / named locality; boundary reference | AP06 |
| `JAR-18-benjamin-boundary-wilderness-of-beth-aven` | wilderness of Beth-aven | [18:12](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/18?lang=eng) | region / extent / land feature; boundary reference | — |
| `JAR-18-benjamin-boundary-luz` | Luz / Beth-el | [18:13](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/18?lang=eng) | settlement / named locality; boundary reference | OHP-BETHEL |
| `JAR-18-benjamin-boundary-ataroth-adar` | Ataroth-adar | [18:13](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/18?lang=eng) | settlement / named locality; boundary reference | — |
| `JAR-18-benjamin-boundary-nether-beth-horon` | nether Beth-horon | [18:13](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/18?lang=eng) | settlement / named locality; boundary reference | — |
| `JAR-18-benjamin-boundary-hill-south-of-nether-beth-horon` | hill south of nether Beth-horon | [18:13](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/18?lang=eng) | boundary landform / landmark; boundary reference | — |
| `JAR-18-benjamin-boundary-beth-horon` | Beth-horon | [18:14](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/18?lang=eng) | settlement / named locality; boundary reference | — |
| `JAR-18-benjamin-boundary-kirjath-baal` | Kirjath-baal / Kirjath-jearim | [18:14,15](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/18?lang=eng) | settlement / named locality; boundary reference | OHP-KIRJATHJEARIM |
| `JAR-18-benjamin-boundary-judah` | Judah | [18:14](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/18?lang=eng) | region / extent / land feature; boundary reference | — |
| `JAR-18-benjamin-boundary-well-of-waters-of-nephtoah` | well of waters of Nephtoah | [18:15](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/18?lang=eng) | water feature / water-place reference; boundary reference | — |
| `JAR-18-benjamin-boundary-unnamed-mountain-before-hinnom` | unnamed mountain before Hinnom | [18:16](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/18?lang=eng) | boundary landform / landmark; boundary reference | — |
| `JAR-18-benjamin-boundary-valley-of-the-son-of-hinnom` | valley of the son of Hinnom | [18:16](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/18?lang=eng) | boundary landform / landmark; boundary reference | — |
| `JAR-18-benjamin-boundary-valley-of-the-giants` | valley of the giants | [18:16](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/18?lang=eng) | boundary landform / landmark; boundary reference | — |
| `JAR-18-benjamin-boundary-jebusi` | Jebusi | [18:16](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/18?lang=eng) | settlement / named locality; boundary reference | — |
| `JAR-18-benjamin-boundary-en-rogel` | En-rogel | [18:16](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/18?lang=eng) | settlement / named locality; boundary reference | — |
| `JAR-18-benjamin-boundary-en-shemesh` | En-shemesh | [18:17](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/18?lang=eng) | settlement / named locality; boundary reference | — |
| `JAR-18-benjamin-boundary-geliloth` | Geliloth | [18:17](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/18?lang=eng) | settlement / named locality; boundary reference | — |
| `JAR-18-benjamin-boundary-going-up-of-adummim` | going up of Adummim | [18:17](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/18?lang=eng) | boundary landform / landmark; boundary reference | — |
| `JAR-18-benjamin-boundary-stone-of-bohan` | stone of Bohan | [18:17](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/18?lang=eng) | boundary landform / landmark; boundary reference | — |
| `JAR-18-benjamin-boundary-arabah` | Arabah | [18:18](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/18?lang=eng) | settlement / named locality; boundary reference | — |
| `JAR-18-benjamin-boundary-beth-hoglah` | Beth-hoglah | [18:19](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/18?lang=eng) | settlement / named locality; boundary reference | — |
| `JAR-18-benjamin-boundary-north-bay-of-salt-sea` | north bay of salt sea | [18:19](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/18?lang=eng) | water feature / water-place reference; boundary reference | — |
| `JAR-18-benjamin-boundary-salt-sea` | salt sea | [18:19](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/18?lang=eng) | water feature / water-place reference; boundary reference | — |

### Joshua 18 — Benjamin city list 1 (`benjamin-cities-1`)

| Stable key | Name / source forms | Verses | Type / role | Existing ID reuse |
|---|---|---|---|---|
| `JAR-18-benjamin-cities-1-jericho` | Jericho | [18:21](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/18?lang=eng) | settlement / named locality; settlement list | AP06 |
| `JAR-18-benjamin-cities-1-beth-hoglah` | Beth-hoglah | [18:21](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/18?lang=eng) | settlement / named locality; settlement list | — |
| `JAR-18-benjamin-cities-1-valley-of-keziz` | valley of Keziz | [18:21](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/18?lang=eng) | boundary landform / landmark; settlement list | — |
| `JAR-18-benjamin-cities-1-beth-arabah` | Beth-arabah | [18:22](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/18?lang=eng) | settlement / named locality; settlement list | — |
| `JAR-18-benjamin-cities-1-zemaraim` | Zemaraim | [18:22](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/18?lang=eng) | settlement / named locality; settlement list | — |
| `JAR-18-benjamin-cities-1-beth-el` | Beth-el | [18:22](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/18?lang=eng) | settlement / named locality; settlement list | OHP-BETHEL |
| `JAR-18-benjamin-cities-1-avim` | Avim | [18:23](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/18?lang=eng) | settlement / named locality; settlement list | — |
| `JAR-18-benjamin-cities-1-parah` | Parah | [18:23](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/18?lang=eng) | settlement / named locality; settlement list | — |
| `JAR-18-benjamin-cities-1-ophrah` | Ophrah | [18:23](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/18?lang=eng) | settlement / named locality; settlement list | — |
| `JAR-18-benjamin-cities-1-chephar-haammonai` | Chephar-haammonai | [18:24](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/18?lang=eng) | settlement / named locality; settlement list | — |
| `JAR-18-benjamin-cities-1-ophni` | Ophni | [18:24](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/18?lang=eng) | settlement / named locality; settlement list | — |
| `JAR-18-benjamin-cities-1-gaba` | Gaba | [18:24](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/18?lang=eng) | settlement / named locality; settlement list | — |

### Joshua 18 — Benjamin city list 2 (`benjamin-cities-2`)

| Stable key | Name / source forms | Verses | Type / role | Existing ID reuse |
|---|---|---|---|---|
| `JAR-18-benjamin-cities-2-gibeon` | Gibeon | [18:25](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/18?lang=eng) | settlement / named locality; settlement list | OHP-GIBEON |
| `JAR-18-benjamin-cities-2-ramah` | Ramah | [18:25](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/18?lang=eng) | settlement / named locality; settlement list | — |
| `JAR-18-benjamin-cities-2-beeroth` | Beeroth | [18:25](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/18?lang=eng) | settlement / named locality; settlement list | — |
| `JAR-18-benjamin-cities-2-mizpeh` | Mizpeh | [18:26](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/18?lang=eng) | settlement / named locality; settlement list | — |
| `JAR-18-benjamin-cities-2-chephirah` | Chephirah | [18:26](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/18?lang=eng) | settlement / named locality; settlement list | — |
| `JAR-18-benjamin-cities-2-mozah` | Mozah | [18:26](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/18?lang=eng) | settlement / named locality; settlement list | — |
| `JAR-18-benjamin-cities-2-rekem` | Rekem | [18:27](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/18?lang=eng) | settlement / named locality; settlement list | — |
| `JAR-18-benjamin-cities-2-irpeel` | Irpeel | [18:27](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/18?lang=eng) | settlement / named locality; settlement list | — |
| `JAR-18-benjamin-cities-2-taralah` | Taralah | [18:27](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/18?lang=eng) | settlement / named locality; settlement list | — |
| `JAR-18-benjamin-cities-2-zelah` | Zelah | [18:28](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/18?lang=eng) | settlement / named locality; settlement list | — |
| `JAR-18-benjamin-cities-2-eleph` | Eleph | [18:28](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/18?lang=eng) | settlement / named locality; settlement list | — |
| `JAR-18-benjamin-cities-2-jebusi` | Jebusi / Jerusalem | [18:28](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/18?lang=eng) | settlement / named locality; settlement list | P08 |
| `JAR-18-benjamin-cities-2-gibeath` | Gibeath | [18:28](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/18?lang=eng) | settlement / named locality; settlement list | — |
| `JAR-18-benjamin-cities-2-kirjath` | Kirjath | [18:28](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/18?lang=eng) | settlement / named locality; settlement list | — |

### Joshua 19 — Simeon within Judah, list 1 (`simeon-1`)

| Stable key | Name / source forms | Verses | Type / role | Existing ID reuse |
|---|---|---|---|---|
| `JAR-19-simeon-1-beer-sheba` | Beer-sheba / Sheba | [19:2](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/19?lang=eng) | settlement / named locality; settlement list | OHP-BEERSHEBA |
| `JAR-19-simeon-1-moladah` | Moladah | [19:2](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/19?lang=eng) | settlement / named locality; settlement list | — |
| `JAR-19-simeon-1-hazar-shual` | Hazar-shual | [19:3](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/19?lang=eng) | settlement / named locality; settlement list | — |
| `JAR-19-simeon-1-balah` | Balah | [19:3](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/19?lang=eng) | settlement / named locality; settlement list | — |
| `JAR-19-simeon-1-azem` | Azem | [19:3](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/19?lang=eng) | settlement / named locality; settlement list | — |
| `JAR-19-simeon-1-eltolad` | Eltolad | [19:4](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/19?lang=eng) | settlement / named locality; settlement list | — |
| `JAR-19-simeon-1-bethul` | Bethul | [19:4](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/19?lang=eng) | settlement / named locality; settlement list | — |
| `JAR-19-simeon-1-hormah` | Hormah | [19:4](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/19?lang=eng) | settlement / named locality; settlement list | — |
| `JAR-19-simeon-1-ziklag` | Ziklag | [19:5](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/19?lang=eng) | settlement / named locality; settlement list | OHP-ZIKLAG |
| `JAR-19-simeon-1-beth-marcaboth` | Beth-marcaboth | [19:5](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/19?lang=eng) | settlement / named locality; settlement list | — |
| `JAR-19-simeon-1-hazar-susah` | Hazar-susah | [19:5](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/19?lang=eng) | settlement / named locality; settlement list | — |
| `JAR-19-simeon-1-beth-lebaoth` | Beth-lebaoth | [19:6](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/19?lang=eng) | settlement / named locality; settlement list | — |
| `JAR-19-simeon-1-sharuhen` | Sharuhen | [19:6](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/19?lang=eng) | settlement / named locality; settlement list | — |

### Joshua 19 — Simeon within Judah, list 2 (`simeon-2`)

| Stable key | Name / source forms | Verses | Type / role | Existing ID reuse |
|---|---|---|---|---|
| `JAR-19-simeon-2-ain` | Ain | [19:7](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/19?lang=eng) | settlement / named locality; settlement list | — |
| `JAR-19-simeon-2-remmon` | Remmon | [19:7](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/19?lang=eng) | settlement / named locality; settlement list | — |
| `JAR-19-simeon-2-ether` | Ether | [19:7](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/19?lang=eng) | settlement / named locality; settlement list | — |
| `JAR-19-simeon-2-ashan` | Ashan | [19:7](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/19?lang=eng) | settlement / named locality; settlement list | — |

### Joshua 19 — Simeon within Judah, extent (`simeon-extent`)

| Stable key | Name / source forms | Verses | Type / role | Existing ID reuse |
|---|---|---|---|---|
| `JAR-19-simeon-extent-baalath-beer` | Baalath-beer | [19:8](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/19?lang=eng) | settlement / named locality; extent reference | — |
| `JAR-19-simeon-extent-ramath-of-the-south` | Ramath of the south | [19:8](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/19?lang=eng) | settlement / named locality; extent reference | — |
| `JAR-19-simeon-extent-judah` | Judah | [19:9](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/19?lang=eng) | region / extent / land feature; extent reference | — |

### Joshua 19 — Zebulun (`zebulun`)

| Stable key | Name / source forms | Verses | Type / role | Existing ID reuse |
|---|---|---|---|---|
| `JAR-19-zebulun-sarid` | Sarid | [19:10,12](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/19?lang=eng) | settlement / named locality; boundary/settlement list | — |
| `JAR-19-zebulun-sea` | sea | [19:11](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/19?lang=eng) | water feature / water-place reference; boundary/settlement list | — |
| `JAR-19-zebulun-maralah` | Maralah | [19:11](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/19?lang=eng) | settlement / named locality; boundary/settlement list | — |
| `JAR-19-zebulun-dabbasheth` | Dabbasheth | [19:11](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/19?lang=eng) | settlement / named locality; boundary/settlement list | — |
| `JAR-19-zebulun-river-before-jokneam` | river before Jokneam | [19:11](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/19?lang=eng) | water feature / water-place reference; boundary/settlement list | — |
| `JAR-19-zebulun-jokneam` | Jokneam | [19:11](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/19?lang=eng) | settlement / named locality; boundary/settlement list | — |
| `JAR-19-zebulun-chisloth-tabor` | Chisloth-tabor | [19:12](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/19?lang=eng) | settlement / named locality; boundary/settlement list | — |
| `JAR-19-zebulun-daberath` | Daberath | [19:12](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/19?lang=eng) | settlement / named locality; boundary/settlement list | — |
| `JAR-19-zebulun-japhia` | Japhia | [19:12](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/19?lang=eng) | settlement / named locality; boundary/settlement list | — |
| `JAR-19-zebulun-gittah-hepher` | Gittah-hepher | [19:13](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/19?lang=eng) | settlement / named locality; boundary/settlement list | — |
| `JAR-19-zebulun-ittah-kazin` | Ittah-kazin | [19:13](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/19?lang=eng) | settlement / named locality; boundary/settlement list | — |
| `JAR-19-zebulun-remmon-methoar` | Remmon-methoar | [19:13](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/19?lang=eng) | settlement / named locality; boundary/settlement list | — |
| `JAR-19-zebulun-neah` | Neah | [19:13](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/19?lang=eng) | settlement / named locality; boundary/settlement list | — |
| `JAR-19-zebulun-hannathon` | Hannathon | [19:14](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/19?lang=eng) | settlement / named locality; boundary/settlement list | — |
| `JAR-19-zebulun-valley-of-jiphthah-el` | valley of Jiphthah-el | [19:14](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/19?lang=eng) | boundary landform / landmark; boundary/settlement list | — |
| `JAR-19-zebulun-kattath` | Kattath | [19:15](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/19?lang=eng) | settlement / named locality; boundary/settlement list | — |
| `JAR-19-zebulun-nahallal` | Nahallal | [19:15](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/19?lang=eng) | settlement / named locality; boundary/settlement list | — |
| `JAR-19-zebulun-shimron` | Shimron | [19:15](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/19?lang=eng) | settlement / named locality; boundary/settlement list | — |
| `JAR-19-zebulun-idalah` | Idalah | [19:15](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/19?lang=eng) | settlement / named locality; boundary/settlement list | — |
| `JAR-19-zebulun-beth-lehem` | Beth-lehem | [19:15](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/19?lang=eng) | settlement / named locality; boundary/settlement list | — |

### Joshua 19 — Issachar (`issachar`)

| Stable key | Name / source forms | Verses | Type / role | Existing ID reuse |
|---|---|---|---|---|
| `JAR-19-issachar-jezreel` | Jezreel | [19:18](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/19?lang=eng) | settlement / named locality; boundary/settlement list | OHP-JEZREEL |
| `JAR-19-issachar-chesulloth` | Chesulloth | [19:18](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/19?lang=eng) | settlement / named locality; boundary/settlement list | — |
| `JAR-19-issachar-shunem` | Shunem | [19:18](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/19?lang=eng) | settlement / named locality; boundary/settlement list | OHP-SHUNEM |
| `JAR-19-issachar-hapharaim` | Hapharaim | [19:19](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/19?lang=eng) | settlement / named locality; boundary/settlement list | — |
| `JAR-19-issachar-shion` | Shion | [19:19](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/19?lang=eng) | settlement / named locality; boundary/settlement list | — |
| `JAR-19-issachar-anaharath` | Anaharath | [19:19](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/19?lang=eng) | settlement / named locality; boundary/settlement list | — |
| `JAR-19-issachar-rabbith` | Rabbith | [19:20](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/19?lang=eng) | settlement / named locality; boundary/settlement list | — |
| `JAR-19-issachar-kishion` | Kishion | [19:20](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/19?lang=eng) | settlement / named locality; boundary/settlement list | — |
| `JAR-19-issachar-abez` | Abez | [19:20](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/19?lang=eng) | settlement / named locality; boundary/settlement list | — |
| `JAR-19-issachar-remeth` | Remeth | [19:21](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/19?lang=eng) | settlement / named locality; boundary/settlement list | — |
| `JAR-19-issachar-en-gannim` | En-gannim | [19:21](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/19?lang=eng) | settlement / named locality; boundary/settlement list | — |
| `JAR-19-issachar-en-haddah` | En-haddah | [19:21](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/19?lang=eng) | settlement / named locality; boundary/settlement list | — |
| `JAR-19-issachar-beth-pazzez` | Beth-pazzez | [19:21](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/19?lang=eng) | settlement / named locality; boundary/settlement list | — |
| `JAR-19-issachar-tabor` | Tabor | [19:22](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/19?lang=eng) | boundary landform / landmark; boundary/settlement list | — |
| `JAR-19-issachar-shahazimah` | Shahazimah | [19:22](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/19?lang=eng) | settlement / named locality; boundary/settlement list | — |
| `JAR-19-issachar-beth-shemesh` | Beth-shemesh | [19:22](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/19?lang=eng) | settlement / named locality; boundary/settlement list | — |
| `JAR-19-issachar-jordan` | Jordan | [19:22](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/19?lang=eng) | water feature / water-place reference; boundary/settlement list | OHP-JORDAN |

### Joshua 19 — Asher (`asher`)

| Stable key | Name / source forms | Verses | Type / role | Existing ID reuse |
|---|---|---|---|---|
| `JAR-19-asher-helkath` | Helkath | [19:25](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/19?lang=eng) | settlement / named locality; boundary/settlement list | — |
| `JAR-19-asher-hali` | Hali | [19:25](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/19?lang=eng) | settlement / named locality; boundary/settlement list | — |
| `JAR-19-asher-beten` | Beten | [19:25](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/19?lang=eng) | settlement / named locality; boundary/settlement list | — |
| `JAR-19-asher-achshaph` | Achshaph | [19:25](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/19?lang=eng) | settlement / named locality; boundary/settlement list | — |
| `JAR-19-asher-alammelech` | Alammelech | [19:26](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/19?lang=eng) | settlement / named locality; boundary/settlement list | — |
| `JAR-19-asher-amad` | Amad | [19:26](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/19?lang=eng) | settlement / named locality; boundary/settlement list | — |
| `JAR-19-asher-misheal` | Misheal | [19:26](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/19?lang=eng) | settlement / named locality; boundary/settlement list | — |
| `JAR-19-asher-carmel` | Carmel | [19:26](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/19?lang=eng) | settlement / named locality; boundary/settlement list | OHP-CARMEL-NORTH |
| `JAR-19-asher-shihor-libnath` | Shihor-libnath | [19:26](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/19?lang=eng) | settlement / named locality; boundary/settlement list | — |
| `JAR-19-asher-beth-dagon` | Beth-dagon | [19:27](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/19?lang=eng) | settlement / named locality; boundary/settlement list | — |
| `JAR-19-asher-zebulun` | Zebulun | [19:27](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/19?lang=eng) | region / extent / land feature; boundary/settlement list | — |
| `JAR-19-asher-valley-of-jiphthah-el` | valley of Jiphthah-el | [19:27](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/19?lang=eng) | boundary landform / landmark; boundary/settlement list | — |
| `JAR-19-asher-beth-emek` | Beth-emek | [19:27](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/19?lang=eng) | settlement / named locality; boundary/settlement list | — |
| `JAR-19-asher-neiel` | Neiel | [19:27](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/19?lang=eng) | settlement / named locality; boundary/settlement list | — |
| `JAR-19-asher-cabul` | Cabul | [19:27](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/19?lang=eng) | settlement / named locality; boundary/settlement list | — |
| `JAR-19-asher-hebron` | Hebron | [19:28](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/19?lang=eng) | settlement / named locality; boundary/settlement list | — |
| `JAR-19-asher-rehob-19-28` | Rehob | [19:28](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/19?lang=eng) | settlement / named locality; boundary/settlement list | — |
| `JAR-19-asher-hammon` | Hammon | [19:28](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/19?lang=eng) | settlement / named locality; boundary/settlement list | — |
| `JAR-19-asher-kanah` | Kanah | [19:28](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/19?lang=eng) | settlement / named locality; boundary/settlement list | — |
| `JAR-19-asher-great-zidon` | great Zidon | [19:28](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/19?lang=eng) | settlement / named locality; boundary/settlement list | — |
| `JAR-19-asher-ramah` | Ramah | [19:29](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/19?lang=eng) | settlement / named locality; boundary/settlement list | — |
| `JAR-19-asher-tyre` | Tyre | [19:29](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/19?lang=eng) | settlement / named locality; boundary/settlement list | OHP-TYRE |
| `JAR-19-asher-hosah` | Hosah | [19:29](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/19?lang=eng) | settlement / named locality; boundary/settlement list | — |
| `JAR-19-asher-sea` | sea | [19:29](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/19?lang=eng) | water feature / water-place reference; boundary/settlement list | — |
| `JAR-19-asher-achzib` | Achzib | [19:29](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/19?lang=eng) | settlement / named locality; boundary/settlement list | — |
| `JAR-19-asher-ummah` | Ummah | [19:30](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/19?lang=eng) | settlement / named locality; boundary/settlement list | — |
| `JAR-19-asher-aphek` | Aphek | [19:30](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/19?lang=eng) | settlement / named locality; boundary/settlement list | — |
| `JAR-19-asher-rehob-19-30` | Rehob | [19:30](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/19?lang=eng) | settlement / named locality; boundary/settlement list | — |

### Joshua 19 — Naphtali (`naphtali`)

| Stable key | Name / source forms | Verses | Type / role | Existing ID reuse |
|---|---|---|---|---|
| `JAR-19-naphtali-heleph` | Heleph | [19:33](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/19?lang=eng) | settlement / named locality; boundary/settlement list | — |
| `JAR-19-naphtali-allon` | Allon | [19:33](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/19?lang=eng) | settlement / named locality; boundary/settlement list | — |
| `JAR-19-naphtali-zaanannim` | Zaanannim | [19:33](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/19?lang=eng) | settlement / named locality; boundary/settlement list | — |
| `JAR-19-naphtali-adami` | Adami | [19:33](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/19?lang=eng) | settlement / named locality; boundary/settlement list | — |
| `JAR-19-naphtali-nekeb` | Nekeb | [19:33](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/19?lang=eng) | settlement / named locality; boundary/settlement list | — |
| `JAR-19-naphtali-jabneel` | Jabneel | [19:33](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/19?lang=eng) | settlement / named locality; boundary/settlement list | — |
| `JAR-19-naphtali-lakum` | Lakum | [19:33](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/19?lang=eng) | settlement / named locality; boundary/settlement list | — |
| `JAR-19-naphtali-jordan` | Jordan | [19:33,34](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/19?lang=eng) | water feature / water-place reference; boundary/settlement list | OHP-JORDAN |
| `JAR-19-naphtali-aznoth-tabor` | Aznoth-tabor | [19:34](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/19?lang=eng) | boundary landform / landmark; boundary/settlement list | — |
| `JAR-19-naphtali-hukkok` | Hukkok | [19:34](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/19?lang=eng) | settlement / named locality; boundary/settlement list | — |
| `JAR-19-naphtali-zebulun` | Zebulun | [19:34](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/19?lang=eng) | region / extent / land feature; boundary/settlement list | — |
| `JAR-19-naphtali-asher` | Asher | [19:34](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/19?lang=eng) | region / extent / land feature; boundary/settlement list | — |
| `JAR-19-naphtali-judah-upon-jordan` | Judah upon Jordan | [19:34](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/19?lang=eng) | region / extent / land feature; boundary/settlement list | — |
| `JAR-19-naphtali-ziddim` | Ziddim | [19:35](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/19?lang=eng) | settlement / named locality; boundary/settlement list | — |
| `JAR-19-naphtali-zer` | Zer | [19:35](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/19?lang=eng) | settlement / named locality; boundary/settlement list | — |
| `JAR-19-naphtali-hammath` | Hammath | [19:35](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/19?lang=eng) | settlement / named locality; boundary/settlement list | — |
| `JAR-19-naphtali-rakkath` | Rakkath | [19:35](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/19?lang=eng) | settlement / named locality; boundary/settlement list | — |
| `JAR-19-naphtali-chinnereth` | Chinnereth | [19:35](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/19?lang=eng) | fortified city; distinct from lake label; boundary/settlement list | — |
| `JAR-19-naphtali-adamah` | Adamah | [19:36](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/19?lang=eng) | settlement / named locality; boundary/settlement list | — |
| `JAR-19-naphtali-ramah` | Ramah | [19:36](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/19?lang=eng) | settlement / named locality; boundary/settlement list | — |
| `JAR-19-naphtali-hazor` | Hazor | [19:36](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/19?lang=eng) | settlement / named locality; boundary/settlement list | OHP-HAZOR |
| `JAR-19-naphtali-kedesh` | Kedesh | [19:37](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/19?lang=eng) | settlement / named locality; boundary/settlement list | — |
| `JAR-19-naphtali-edrei` | Edrei | [19:37](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/19?lang=eng) | settlement / named locality; boundary/settlement list | — |
| `JAR-19-naphtali-en-hazor` | En-hazor | [19:37](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/19?lang=eng) | settlement / named locality; boundary/settlement list | — |
| `JAR-19-naphtali-iron` | Iron | [19:38](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/19?lang=eng) | settlement / named locality; boundary/settlement list | — |
| `JAR-19-naphtali-migdal-el` | Migdal-el | [19:38](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/19?lang=eng) | settlement / named locality; boundary/settlement list | — |
| `JAR-19-naphtali-horem` | Horem | [19:38](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/19?lang=eng) | settlement / named locality; boundary/settlement list | — |
| `JAR-19-naphtali-beth-anath` | Beth-anath | [19:38](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/19?lang=eng) | settlement / named locality; boundary/settlement list | — |
| `JAR-19-naphtali-beth-shemesh` | Beth-shemesh | [19:38](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/19?lang=eng) | settlement / named locality; boundary/settlement list | — |

### Joshua 19 — Dan original allotment (`dan`)

| Stable key | Name / source forms | Verses | Type / role | Existing ID reuse |
|---|---|---|---|---|
| `JAR-19-dan-zorah` | Zorah | [19:41](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/19?lang=eng) | settlement / named locality; boundary/settlement list | — |
| `JAR-19-dan-eshtaol` | Eshtaol | [19:41](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/19?lang=eng) | settlement / named locality; boundary/settlement list | — |
| `JAR-19-dan-ir-shemesh` | Ir-shemesh | [19:41](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/19?lang=eng) | settlement / named locality; boundary/settlement list | — |
| `JAR-19-dan-shaalabbin` | Shaalabbin | [19:42](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/19?lang=eng) | settlement / named locality; boundary/settlement list | — |
| `JAR-19-dan-ajalon` | Ajalon | [19:42](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/19?lang=eng) | settlement / named locality; boundary/settlement list | — |
| `JAR-19-dan-jethlah` | Jethlah | [19:42](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/19?lang=eng) | settlement / named locality; boundary/settlement list | — |
| `JAR-19-dan-elon` | Elon | [19:43](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/19?lang=eng) | settlement / named locality; boundary/settlement list | — |
| `JAR-19-dan-thimnathah` | Thimnathah | [19:43](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/19?lang=eng) | settlement / named locality; boundary/settlement list | — |
| `JAR-19-dan-ekron` | Ekron | [19:43](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/19?lang=eng) | settlement / named locality; boundary/settlement list | OHP-EKRON |
| `JAR-19-dan-eltekeh` | Eltekeh | [19:44](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/19?lang=eng) | settlement / named locality; boundary/settlement list | — |
| `JAR-19-dan-gibbethon` | Gibbethon | [19:44](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/19?lang=eng) | settlement / named locality; boundary/settlement list | — |
| `JAR-19-dan-baalath` | Baalath | [19:44](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/19?lang=eng) | settlement / named locality; boundary/settlement list | — |
| `JAR-19-dan-jehud` | Jehud | [19:45](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/19?lang=eng) | settlement / named locality; boundary/settlement list | — |
| `JAR-19-dan-bene-berak` | Bene-berak | [19:45](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/19?lang=eng) | settlement / named locality; boundary/settlement list | — |
| `JAR-19-dan-gath-rimmon` | Gath-rimmon | [19:45](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/19?lang=eng) | settlement / named locality; boundary/settlement list | — |
| `JAR-19-dan-me-jarkon` | Me-jarkon | [19:46](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/19?lang=eng) | settlement / named locality; boundary/settlement list | — |
| `JAR-19-dan-rakkon` | Rakkon | [19:46](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/19?lang=eng) | settlement / named locality; boundary/settlement list | — |
| `JAR-19-dan-japho` | Japho | [19:46](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/19?lang=eng) | settlement / named locality; boundary/settlement list | — |

### Joshua 19 — Dan conquest and renaming (`dan-leshem`)

| Stable key | Name / source forms | Verses | Type / role | Existing ID reuse |
|---|---|---|---|---|
| `JAR-19-dan-leshem-leshem` | Leshem / Dan | [19:47](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/19?lang=eng) | settlement / named locality; conquest/renaming reference | — |

### Joshua 19 — Joshua personal grant (`joshua`)

| Stable key | Name / source forms | Verses | Type / role | Existing ID reuse |
|---|---|---|---|---|
| `JAR-19-joshua-timnath-serah` | Timnath-serah | [19:50](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/19?lang=eng) | settlement / named locality; grant/assembly setting | — |
| `JAR-19-joshua-mount-ephraim` | mount Ephraim | [19:50](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/19?lang=eng) | boundary landform / landmark; grant/assembly setting | — |
| `JAR-19-joshua-shiloh` | Shiloh | [19:51](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/19?lang=eng) | settlement / named locality; grant/assembly setting | OHP-SHILOH |
| `JAR-19-joshua-door-of-the-tabernacle` | door of the tabernacle | [19:51](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/19?lang=eng) | sanctuary reference; grant/assembly setting | — |

### Joshua 20 — Western refuge designations (`refuge-west`)

| Stable key | Name / source forms | Verses | Type / role | Existing ID reuse |
|---|---|---|---|---|
| `JAR-20-refuge-west-kedesh` | Kedesh | [20:7](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/20?lang=eng) | settlement / named locality; refuge-city/region designation | — |
| `JAR-20-refuge-west-galilee` | Galilee | [20:7](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/20?lang=eng) | region / extent / land feature; refuge-city/region designation | — |
| `JAR-20-refuge-west-mount-naphtali` | mount Naphtali | [20:7](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/20?lang=eng) | boundary landform / landmark; refuge-city/region designation | — |
| `JAR-20-refuge-west-shechem` | Shechem | [20:7](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/20?lang=eng) | settlement / named locality; refuge-city/region designation | P02 |
| `JAR-20-refuge-west-mount-ephraim` | mount Ephraim | [20:7](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/20?lang=eng) | boundary landform / landmark; refuge-city/region designation | — |
| `JAR-20-refuge-west-kirjath-arba` | Kirjath-arba / Hebron | [20:7](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/20?lang=eng) | settlement / named locality; refuge-city/region designation | OHP-HEBRON |
| `JAR-20-refuge-west-mountain-of-judah` | mountain of Judah | [20:7](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/20?lang=eng) | boundary landform / landmark; refuge-city/region designation | — |

### Joshua 20 — Eastern refuge designations (`refuge-east`)

| Stable key | Name / source forms | Verses | Type / role | Existing ID reuse |
|---|---|---|---|---|
| `JAR-20-refuge-east-jordan` | Jordan | [20:8](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/20?lang=eng) | water feature / water-place reference; refuge-city/region designation | OHP-JORDAN |
| `JAR-20-refuge-east-jericho` | Jericho | [20:8](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/20?lang=eng) | settlement / named locality; refuge-city/region designation | AP06 |
| `JAR-20-refuge-east-bezer` | Bezer | [20:8](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/20?lang=eng) | settlement / named locality; refuge-city/region designation | — |
| `JAR-20-refuge-east-wilderness-upon-the-plain` | wilderness upon the plain | [20:8](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/20?lang=eng) | region / extent / land feature; refuge-city/region designation | — |
| `JAR-20-refuge-east-reuben` | Reuben | [20:8](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/20?lang=eng) | region / extent / land feature; refuge-city/region designation | — |
| `JAR-20-refuge-east-ramoth-in-gilead` | Ramoth in Gilead | [20:8](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/20?lang=eng) | settlement / named locality; refuge-city/region designation | OHP-RAMOTHGILEAD |
| `JAR-20-refuge-east-gilead` | Gilead | [20:8](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/20?lang=eng) | region / extent / land feature; refuge-city/region designation | — |
| `JAR-20-refuge-east-golan` | Golan | [20:8](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/20?lang=eng) | settlement / named locality; refuge-city/region designation | — |
| `JAR-20-refuge-east-bashan` | Bashan | [20:8](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/20?lang=eng) | region / extent / land feature; refuge-city/region designation | — |
| `JAR-20-refuge-east-gad` | Gad | [20:8](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/20?lang=eng) | region / extent / land feature; refuge-city/region designation | — |
| `JAR-20-refuge-east-manasseh` | Manasseh | [20:8](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/20?lang=eng) | region / extent / land feature; refuge-city/region designation | — |

### Joshua 21 — Levitical request (`assembly`)

| Stable key | Name / source forms | Verses | Type / role | Existing ID reuse |
|---|---|---|---|---|
| `JAR-21-assembly-shiloh` | Shiloh | [21:2](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/21?lang=eng) | settlement / named locality; assembly setting | OHP-SHILOH |
| `JAR-21-assembly-canaan` | Canaan | [21:2](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/21?lang=eng) | region / extent / land feature; assembly setting | — |
| `JAR-21-assembly-bashan` | Bashan | [21:6](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/21?lang=eng) | region / extent / land feature; assembly setting | — |

### Joshua 21 — Aaron/Kohath from Judah and Simeon (`aaron-judah-simeon`)

| Stable key | Name / source forms | Verses | Type / role | Existing ID reuse |
|---|---|---|---|---|
| `JAR-21-aaron-judah-simeon-city-of-arba` | city of Arba / Hebron | [21:11,13](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/21?lang=eng) | settlement / named locality; Levitical city list | OHP-HEBRON |
| `JAR-21-aaron-judah-simeon-hill-country-of-judah` | hill country of Judah | [21:11](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/21?lang=eng) | boundary landform / landmark; Levitical city list | — |
| `JAR-21-aaron-judah-simeon-fields-and-villages-of-hebron` | fields and villages of Hebron | [21:12](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/21?lang=eng) | unnamed settlement/land group; Levitical city list | — |
| `JAR-21-aaron-judah-simeon-libnah` | Libnah | [21:13](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/21?lang=eng) | settlement / named locality; Levitical city list | — |
| `JAR-21-aaron-judah-simeon-jattir` | Jattir | [21:14](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/21?lang=eng) | settlement / named locality; Levitical city list | — |
| `JAR-21-aaron-judah-simeon-eshtemoa` | Eshtemoa | [21:14](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/21?lang=eng) | settlement / named locality; Levitical city list | — |
| `JAR-21-aaron-judah-simeon-holon` | Holon | [21:15](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/21?lang=eng) | settlement / named locality; Levitical city list | — |
| `JAR-21-aaron-judah-simeon-debir` | Debir | [21:15](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/21?lang=eng) | settlement / named locality; Levitical city list | — |
| `JAR-21-aaron-judah-simeon-ain` | Ain | [21:16](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/21?lang=eng) | settlement / named locality; Levitical city list | — |
| `JAR-21-aaron-judah-simeon-juttah` | Juttah | [21:16](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/21?lang=eng) | settlement / named locality; Levitical city list | — |
| `JAR-21-aaron-judah-simeon-beth-shemesh` | Beth-shemesh | [21:16](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/21?lang=eng) | settlement / named locality; Levitical city list | OHP-BETHSHEMESH-JUDAH |

### Joshua 21 — Aaron/Kohath from Benjamin (`aaron-benjamin`)

| Stable key | Name / source forms | Verses | Type / role | Existing ID reuse |
|---|---|---|---|---|
| `JAR-21-aaron-benjamin-gibeon` | Gibeon | [21:17](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/21?lang=eng) | settlement / named locality; Levitical city list | OHP-GIBEON |
| `JAR-21-aaron-benjamin-geba` | Geba | [21:17](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/21?lang=eng) | settlement / named locality; Levitical city list | — |
| `JAR-21-aaron-benjamin-anathoth` | Anathoth | [21:18](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/21?lang=eng) | settlement / named locality; Levitical city list | — |
| `JAR-21-aaron-benjamin-almon` | Almon | [21:18](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/21?lang=eng) | settlement / named locality; Levitical city list | — |

### Joshua 21 — Other Kohath from Ephraim (`kohath-ephraim`)

| Stable key | Name / source forms | Verses | Type / role | Existing ID reuse |
|---|---|---|---|---|
| `JAR-21-kohath-ephraim-shechem` | Shechem | [21:21](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/21?lang=eng) | settlement / named locality; Levitical city list | P02 |
| `JAR-21-kohath-ephraim-mount-ephraim` | mount Ephraim | [21:21](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/21?lang=eng) | boundary landform / landmark; Levitical city list | — |
| `JAR-21-kohath-ephraim-gezer` | Gezer | [21:21](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/21?lang=eng) | settlement / named locality; Levitical city list | — |
| `JAR-21-kohath-ephraim-kibzaim` | Kibzaim | [21:22](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/21?lang=eng) | settlement / named locality; Levitical city list | — |
| `JAR-21-kohath-ephraim-beth-horon` | Beth-horon | [21:22](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/21?lang=eng) | settlement / named locality; Levitical city list | — |

### Joshua 21 — Other Kohath from Dan (`kohath-dan`)

| Stable key | Name / source forms | Verses | Type / role | Existing ID reuse |
|---|---|---|---|---|
| `JAR-21-kohath-dan-eltekeh` | Eltekeh | [21:23](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/21?lang=eng) | settlement / named locality; Levitical city list | — |
| `JAR-21-kohath-dan-gibbethon` | Gibbethon | [21:23](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/21?lang=eng) | settlement / named locality; Levitical city list | — |
| `JAR-21-kohath-dan-aijalon` | Aijalon | [21:24](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/21?lang=eng) | settlement / named locality; Levitical city list | — |
| `JAR-21-kohath-dan-gath-rimmon` | Gath-rimmon | [21:24](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/21?lang=eng) | settlement / named locality; Levitical city list | — |

### Joshua 21 — Other Kohath from half Manasseh (`kohath-manasseh`)

| Stable key | Name / source forms | Verses | Type / role | Existing ID reuse |
|---|---|---|---|---|
| `JAR-21-kohath-manasseh-tanach` | Tanach | [21:25](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/21?lang=eng) | settlement / named locality; Levitical city list | — |
| `JAR-21-kohath-manasseh-gath-rimmon` | Gath-rimmon | [21:25](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/21?lang=eng) | settlement / named locality; Levitical city list | — |

### Joshua 21 — Gershon from eastern half Manasseh (`gershon-manasseh`)

| Stable key | Name / source forms | Verses | Type / role | Existing ID reuse |
|---|---|---|---|---|
| `JAR-21-gershon-manasseh-golan` | Golan | [21:27](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/21?lang=eng) | settlement / named locality; Levitical city list | — |
| `JAR-21-gershon-manasseh-bashan` | Bashan | [21:27](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/21?lang=eng) | region / extent / land feature; Levitical city list | — |
| `JAR-21-gershon-manasseh-beesh-terah` | Beesh-terah | [21:27](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/21?lang=eng) | settlement / named locality; Levitical city list | — |

### Joshua 21 — Gershon from Issachar (`gershon-issachar`)

| Stable key | Name / source forms | Verses | Type / role | Existing ID reuse |
|---|---|---|---|---|
| `JAR-21-gershon-issachar-kishon` | Kishon | [21:28](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/21?lang=eng) | settlement / named locality; Levitical city list | — |
| `JAR-21-gershon-issachar-dabareh` | Dabareh | [21:28](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/21?lang=eng) | settlement / named locality; Levitical city list | — |
| `JAR-21-gershon-issachar-jarmuth` | Jarmuth | [21:29](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/21?lang=eng) | settlement / named locality; Levitical city list | — |
| `JAR-21-gershon-issachar-en-gannim` | En-gannim | [21:29](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/21?lang=eng) | settlement / named locality; Levitical city list | — |

### Joshua 21 — Gershon from Asher (`gershon-asher`)

| Stable key | Name / source forms | Verses | Type / role | Existing ID reuse |
|---|---|---|---|---|
| `JAR-21-gershon-asher-mishal` | Mishal | [21:30](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/21?lang=eng) | settlement / named locality; Levitical city list | — |
| `JAR-21-gershon-asher-abdon` | Abdon | [21:30](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/21?lang=eng) | settlement / named locality; Levitical city list | — |
| `JAR-21-gershon-asher-helkath` | Helkath | [21:31](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/21?lang=eng) | settlement / named locality; Levitical city list | — |
| `JAR-21-gershon-asher-rehob` | Rehob | [21:31](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/21?lang=eng) | settlement / named locality; Levitical city list | — |

### Joshua 21 — Gershon from Naphtali (`gershon-naphtali`)

| Stable key | Name / source forms | Verses | Type / role | Existing ID reuse |
|---|---|---|---|---|
| `JAR-21-gershon-naphtali-kedesh` | Kedesh | [21:32](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/21?lang=eng) | settlement / named locality; Levitical city list | — |
| `JAR-21-gershon-naphtali-galilee` | Galilee | [21:32](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/21?lang=eng) | region / extent / land feature; Levitical city list | — |
| `JAR-21-gershon-naphtali-hammoth-dor` | Hammoth-dor | [21:32](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/21?lang=eng) | settlement / named locality; Levitical city list | — |
| `JAR-21-gershon-naphtali-kartan` | Kartan | [21:32](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/21?lang=eng) | settlement / named locality; Levitical city list | — |

### Joshua 21 — Merari from Zebulun (`merari-zebulun`)

| Stable key | Name / source forms | Verses | Type / role | Existing ID reuse |
|---|---|---|---|---|
| `JAR-21-merari-zebulun-jokneam` | Jokneam | [21:34](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/21?lang=eng) | settlement / named locality; Levitical city list | — |
| `JAR-21-merari-zebulun-kartah` | Kartah | [21:34](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/21?lang=eng) | settlement / named locality; Levitical city list | — |
| `JAR-21-merari-zebulun-dimnah` | Dimnah | [21:35](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/21?lang=eng) | settlement / named locality; Levitical city list | — |
| `JAR-21-merari-zebulun-nahalal` | Nahalal | [21:35](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/21?lang=eng) | settlement / named locality; Levitical city list | — |

### Joshua 21 — Merari from Reuben (`merari-reuben`)

| Stable key | Name / source forms | Verses | Type / role | Existing ID reuse |
|---|---|---|---|---|
| `JAR-21-merari-reuben-bezer` | Bezer | [21:36](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/21?lang=eng) | settlement / named locality; Levitical city list | — |
| `JAR-21-merari-reuben-jahazah` | Jahazah | [21:36](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/21?lang=eng) | settlement / named locality; Levitical city list | — |
| `JAR-21-merari-reuben-kedemoth` | Kedemoth | [21:37](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/21?lang=eng) | settlement / named locality; Levitical city list | — |
| `JAR-21-merari-reuben-mephaath` | Mephaath | [21:37](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/21?lang=eng) | settlement / named locality; Levitical city list | — |

### Joshua 21 — Merari from Gad (`merari-gad`)

| Stable key | Name / source forms | Verses | Type / role | Existing ID reuse |
|---|---|---|---|---|
| `JAR-21-merari-gad-ramoth-in-gilead` | Ramoth in Gilead | [21:38](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/21?lang=eng) | settlement / named locality; Levitical city list | OHP-RAMOTHGILEAD |
| `JAR-21-merari-gad-gilead` | Gilead | [21:38](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/21?lang=eng) | region / extent / land feature; Levitical city list | — |
| `JAR-21-merari-gad-mahanaim` | Mahanaim | [21:38](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/21?lang=eng) | settlement / named locality; Levitical city list | OHP-MAHANAIM |
| `JAR-21-merari-gad-heshbon` | Heshbon | [21:39](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/21?lang=eng) | settlement / named locality; Levitical city list | — |
| `JAR-21-merari-gad-jazer` | Jazer | [21:39](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/21?lang=eng) | settlement / named locality; Levitical city list | — |

### Joshua 22 — Reuben/Gad/half Manasseh and western delegation (`return-and-altar`)

| Stable key | Name / source forms | Verses | Type / role | Existing ID reuse |
|---|---|---|---|---|
| `JAR-22-return-and-altar-jordan` | Jordan | [22:4,7,25](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/22?lang=eng) | water feature / water-place reference; return/witness-altar setting | OHP-JORDAN |
| `JAR-22-return-and-altar-bashan` | Bashan | [22:7](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/22?lang=eng) | region / extent / land feature; return/witness-altar setting | — |
| `JAR-22-return-and-altar-shiloh` | Shiloh | [22:9,12](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/22?lang=eng) | settlement / named locality; return/witness-altar setting | OHP-SHILOH |
| `JAR-22-return-and-altar-canaan` | Canaan | [22:9,10,11,32](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/22?lang=eng) | region / extent / land feature; return/witness-altar setting | — |
| `JAR-22-return-and-altar-gilead` | Gilead | [22:9,13,15,32](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/22?lang=eng) | region / extent / land feature; return/witness-altar setting | — |
| `JAR-22-return-and-altar-borders-of-jordan` | borders of Jordan | [22:10,11](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/22?lang=eng) | region / extent / land feature; return/witness-altar setting | — |
| `JAR-22-return-and-altar-altar-by-jordan` | altar by Jordan / Ed | [22:10,34](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/22?lang=eng) | altar / witness monument; return/witness-altar setting | — |
| `JAR-22-return-and-altar-passage-of-the-children-of-israel` | passage of the children of Israel | [22:11](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/22?lang=eng) | boundary landform / landmark; return/witness-altar setting | — |
| `JAR-22-return-and-altar-peor` | Peor | [22:17](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/22?lang=eng) | settlement / named locality; return/witness-altar setting | — |
| `JAR-22-return-and-altar-land-of-the-lord-s-tabernacle` | land of the Lord’s tabernacle | [22:19](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/22?lang=eng) | region / extent / land feature; return/witness-altar setting | — |
| `JAR-22-return-and-altar-altar-of-the-lord` | altar of the Lord | [22:19,28,29](https://www.churchofjesuschrist.org/study/scriptures/ot/josh/22?lang=eng) | altar / witness monument; return/witness-altar setting | — |

## Every-verse disposition ledger

All 306 verses were read. `retained` gives the exact contextual keys for material features; other rows state why no additional place key is created. Such exclusions do not delete the narrative, legal rule, people or numerical claim from the owning chapter inventory.

| Chapter:verse | Disposition | Stable keys / reason |
|---|---|---|
| 13:1 | no new feature | Allocation procedure, tribal/person relationship, law, dialogue or retrospective explanation; no additional named settlement/boundary feature. Tribal donor/recipient labels remain in record context. |
| 13:2 | retained | `JAR-13-remaining-land-philistines`, `JAR-13-remaining-land-geshuri` |
| 13:3 | retained | `JAR-13-remaining-land-sihor`, `JAR-13-remaining-land-egypt`, `JAR-13-remaining-land-ekron`, `JAR-13-remaining-land-gazathites`, `JAR-13-remaining-land-ashdothites`, `JAR-13-remaining-land-eshkalonites`, `JAR-13-remaining-land-gittites`, `JAR-13-remaining-land-ekronites`, `JAR-13-remaining-land-avites`, `JAR-13-remaining-land-canaanite` |
| 13:4 | retained | `JAR-13-remaining-land-canaanites`, `JAR-13-remaining-land-mearah`, `JAR-13-remaining-land-sidonians`, `JAR-13-remaining-land-aphek`, `JAR-13-remaining-land-amorites` |
| 13:5 | retained | `JAR-13-remaining-land-giblites`, `JAR-13-remaining-land-lebanon`, `JAR-13-remaining-land-baal-gad`, `JAR-13-remaining-land-mount-hermon`, `JAR-13-remaining-land-entering-into-hamath` |
| 13:6 | retained | `JAR-13-remaining-land-sidonians`, `JAR-13-remaining-land-lebanon`, `JAR-13-remaining-land-misrephoth-maim` |
| 13:7 | no new feature | Allocation procedure, tribal/person relationship, law, dialogue or retrospective explanation; no additional named settlement/boundary feature. Tribal donor/recipient labels remain in record context. |
| 13:8 | retained | `JAR-13-east-summary-jordan` |
| 13:9 | retained | `JAR-13-east-summary-aroer`, `JAR-13-east-summary-river-arnon`, `JAR-13-east-summary-city-in-the-midst-of-the-river`, `JAR-13-east-summary-plain-of-medeba`, `JAR-13-east-summary-dibon` |
| 13:10 | retained | `JAR-13-east-summary-heshbon`, `JAR-13-east-summary-ammon` |
| 13:11 | retained | `JAR-13-east-summary-gilead`, `JAR-13-east-summary-geshurites`, `JAR-13-east-summary-maachathites`, `JAR-13-east-summary-mount-hermon`, `JAR-13-east-summary-bashan`, `JAR-13-east-summary-salcah` |
| 13:12 | retained | `JAR-13-east-summary-bashan`, `JAR-13-east-summary-ashtaroth`, `JAR-13-east-summary-edrei` |
| 13:13 | retained | `JAR-13-east-summary-geshurites`, `JAR-13-east-summary-maachathites` |
| 13:14 | no new feature | Allocation procedure, tribal/person relationship, law, dialogue or retrospective explanation; no additional named settlement/boundary feature. Tribal donor/recipient labels remain in record context. |
| 13:15 | no new feature | Allocation procedure, tribal/person relationship, law, dialogue or retrospective explanation; no additional named settlement/boundary feature. Tribal donor/recipient labels remain in record context. |
| 13:16 | retained | `JAR-13-reuben-aroer`, `JAR-13-reuben-river-arnon`, `JAR-13-reuben-city-in-the-midst-of-the-river`, `JAR-13-reuben-plain-by-medeba` |
| 13:17 | retained | `JAR-13-reuben-heshbon`, `JAR-13-reuben-dibon`, `JAR-13-reuben-bamoth-baal`, `JAR-13-reuben-beth-baal-meon` |
| 13:18 | retained | `JAR-13-reuben-jahazah`, `JAR-13-reuben-kedemoth`, `JAR-13-reuben-mephaath` |
| 13:19 | retained | `JAR-13-reuben-kirjathaim`, `JAR-13-reuben-sibmah`, `JAR-13-reuben-zareth-shahar`, `JAR-13-reuben-mount-of-the-valley` |
| 13:20 | retained | `JAR-13-reuben-beth-peor`, `JAR-13-reuben-ashdoth-pisgah`, `JAR-13-reuben-beth-jeshimoth` |
| 13:21 | retained | `JAR-13-reuben-heshbon`, `JAR-13-reuben-midian` |
| 13:22 | no new feature | Allocation procedure, tribal/person relationship, law, dialogue or retrospective explanation; no additional named settlement/boundary feature. Tribal donor/recipient labels remain in record context. |
| 13:23 | retained | `JAR-13-reuben-jordan` |
| 13:24 | no new feature | Allocation procedure, tribal/person relationship, law, dialogue or retrospective explanation; no additional named settlement/boundary feature. Tribal donor/recipient labels remain in record context. |
| 13:25 | retained | `JAR-13-gad-jazer`, `JAR-13-gad-gilead`, `JAR-13-gad-ammon`, `JAR-13-gad-aroer-before-rabbah`, `JAR-13-gad-rabbah` |
| 13:26 | retained | `JAR-13-gad-heshbon`, `JAR-13-gad-ramath-mizpeh`, `JAR-13-gad-betonim`, `JAR-13-gad-mahanaim`, `JAR-13-gad-debir` |
| 13:27 | retained | `JAR-13-gad-heshbon`, `JAR-13-gad-beth-aram`, `JAR-13-gad-beth-nimrah`, `JAR-13-gad-succoth`, `JAR-13-gad-zaphon`, `JAR-13-gad-jordan`, `JAR-13-gad-sea-of-chinnereth` |
| 13:28 | no new feature | Allocation procedure, tribal/person relationship, law, dialogue or retrospective explanation; no additional named settlement/boundary feature. Tribal donor/recipient labels remain in record context. |
| 13:29 | no new feature | Allocation procedure, tribal/person relationship, law, dialogue or retrospective explanation; no additional named settlement/boundary feature. Tribal donor/recipient labels remain in record context. |
| 13:30 | retained | `JAR-13-manasseh-east-mahanaim`, `JAR-13-manasseh-east-bashan`, `JAR-13-manasseh-east-towns-of-jair` |
| 13:31 | retained | `JAR-13-manasseh-east-bashan`, `JAR-13-manasseh-east-gilead`, `JAR-13-manasseh-east-ashtaroth`, `JAR-13-manasseh-east-edrei` |
| 13:32 | retained | `JAR-13-allocation-setting-plains-of-moab`, `JAR-13-allocation-setting-jordan`, `JAR-13-allocation-setting-jericho` |
| 13:33 | no new feature | Allocation procedure, tribal/person relationship, law, dialogue or retrospective explanation; no additional named settlement/boundary feature. Tribal donor/recipient labels remain in record context. |
| 14:1 | retained | `JAR-14-allocation-canaan` |
| 14:2 | no new feature | Allocation procedure, tribal/person relationship, law, dialogue or retrospective explanation; no additional named settlement/boundary feature. Tribal donor/recipient labels remain in record context. |
| 14:3 | retained | `JAR-14-allocation-jordan` |
| 14:4 | no new feature | Allocation procedure, tribal/person relationship, law, dialogue or retrospective explanation; no additional named settlement/boundary feature. Tribal donor/recipient labels remain in record context. |
| 14:5 | no new feature | Allocation procedure, tribal/person relationship, law, dialogue or retrospective explanation; no additional named settlement/boundary feature. Tribal donor/recipient labels remain in record context. |
| 14:6 | retained | `JAR-14-caleb-gilgal`, `JAR-14-caleb-kadesh-barnea` |
| 14:7 | retained | `JAR-14-caleb-kadesh-barnea` |
| 14:8 | no new feature | Allocation procedure, tribal/person relationship, law, dialogue or retrospective explanation; no additional named settlement/boundary feature. Tribal donor/recipient labels remain in record context. |
| 14:9 | no new feature | Allocation procedure, tribal/person relationship, law, dialogue or retrospective explanation; no additional named settlement/boundary feature. Tribal donor/recipient labels remain in record context. |
| 14:10 | retained | `JAR-14-caleb-wilderness` |
| 14:11 | no new feature | Allocation procedure, tribal/person relationship, law, dialogue or retrospective explanation; no additional named settlement/boundary feature. Tribal donor/recipient labels remain in record context. |
| 14:12 | retained | `JAR-14-caleb-this-mountain` |
| 14:13 | retained | `JAR-14-caleb-hebron` |
| 14:14 | retained | `JAR-14-caleb-hebron` |
| 14:15 | retained | `JAR-14-caleb-hebron` |
| 15:1 | retained | `JAR-15-boundary-edom`, `JAR-15-boundary-wilderness-of-zin` |
| 15:2 | retained | `JAR-15-boundary-salt-sea`, `JAR-15-boundary-south-bay-of-salt-sea` |
| 15:3 | retained | `JAR-15-boundary-maaleh-acrabbim`, `JAR-15-boundary-zin`, `JAR-15-boundary-kadesh-barnea`, `JAR-15-boundary-hezron`, `JAR-15-boundary-adar`, `JAR-15-boundary-karkaa` |
| 15:4 | retained | `JAR-15-boundary-azmon`, `JAR-15-boundary-river-of-egypt`, `JAR-15-boundary-sea` |
| 15:5 | retained | `JAR-15-boundary-salt-sea`, `JAR-15-boundary-jordan`, `JAR-15-boundary-north-bay-of-salt-sea` |
| 15:6 | retained | `JAR-15-boundary-beth-hogla`, `JAR-15-boundary-beth-arabah`, `JAR-15-boundary-stone-of-bohan` |
| 15:7 | retained | `JAR-15-boundary-debir`, `JAR-15-boundary-valley-of-achor`, `JAR-15-boundary-gilgal`, `JAR-15-boundary-going-up-of-adummim`, `JAR-15-boundary-river-south-of-adummim`, `JAR-15-boundary-waters-of-en-shemesh`, `JAR-15-boundary-en-rogel` |
| 15:8 | retained | `JAR-15-boundary-valley-of-the-son-of-hinnom`, `JAR-15-boundary-jebusite`, `JAR-15-boundary-unnamed-mountain-before-hinnom`, `JAR-15-boundary-valley-of-the-giants` |
| 15:9 | retained | `JAR-15-boundary-fountain-of-nephtoah`, `JAR-15-boundary-mount-ephron`, `JAR-15-boundary-baalah` |
| 15:10 | retained | `JAR-15-boundary-baalah`, `JAR-15-boundary-mount-seir`, `JAR-15-boundary-mount-jearim`, `JAR-15-boundary-beth-shemesh`, `JAR-15-boundary-timnah` |
| 15:11 | retained | `JAR-15-boundary-sea`, `JAR-15-boundary-ekron`, `JAR-15-boundary-shicron`, `JAR-15-boundary-mount-baalah`, `JAR-15-boundary-jabneel` |
| 15:12 | retained | `JAR-15-boundary-great-sea` |
| 15:13 | retained | `JAR-15-caleb-city-of-arba` |
| 15:14 | no new feature | Allocation procedure, tribal/person relationship, law, dialogue or retrospective explanation; no additional named settlement/boundary feature. Tribal donor/recipient labels remain in record context. |
| 15:15 | retained | `JAR-15-caleb-debir` |
| 15:16 | retained | `JAR-15-caleb-debir` |
| 15:17 | no new feature | Allocation procedure, tribal/person relationship, law, dialogue or retrospective explanation; no additional named settlement/boundary feature. Tribal donor/recipient labels remain in record context. |
| 15:18 | no new feature | Allocation procedure, tribal/person relationship, law, dialogue or retrospective explanation; no additional named settlement/boundary feature. Tribal donor/recipient labels remain in record context. |
| 15:19 | retained | `JAR-15-caleb-south-land`, `JAR-15-caleb-upper-springs`, `JAR-15-caleb-nether-springs` |
| 15:20 | no new feature | Allocation procedure, tribal/person relationship, law, dialogue or retrospective explanation; no additional named settlement/boundary feature. Tribal donor/recipient labels remain in record context. |
| 15:21 | retained | `JAR-15-south-edom`, `JAR-15-south-kabzeel`, `JAR-15-south-eder`, `JAR-15-south-jagur` |
| 15:22 | retained | `JAR-15-south-kinah`, `JAR-15-south-dimonah`, `JAR-15-south-adadah` |
| 15:23 | retained | `JAR-15-south-kedesh`, `JAR-15-south-hazor-15-23`, `JAR-15-south-ithnan` |
| 15:24 | retained | `JAR-15-south-ziph`, `JAR-15-south-telem`, `JAR-15-south-bealoth` |
| 15:25 | retained | `JAR-15-south-hazor-15-25-first`, `JAR-15-south-hadattah`, `JAR-15-south-kerioth`, `JAR-15-south-hezron` |
| 15:26 | retained | `JAR-15-south-amam`, `JAR-15-south-shema`, `JAR-15-south-moladah` |
| 15:27 | retained | `JAR-15-south-hazar-gaddah`, `JAR-15-south-heshmon`, `JAR-15-south-beth-palet` |
| 15:28 | retained | `JAR-15-south-hazar-shual`, `JAR-15-south-beer-sheba`, `JAR-15-south-bizjothjah` |
| 15:29 | retained | `JAR-15-south-baalah`, `JAR-15-south-iim`, `JAR-15-south-azem` |
| 15:30 | retained | `JAR-15-south-eltolad`, `JAR-15-south-chesil`, `JAR-15-south-hormah` |
| 15:31 | retained | `JAR-15-south-ziklag`, `JAR-15-south-madmannah`, `JAR-15-south-sansannah` |
| 15:32 | retained | `JAR-15-south-lebaoth`, `JAR-15-south-shilhim`, `JAR-15-south-ain`, `JAR-15-south-rimmon` |
| 15:33 | retained | `JAR-15-lowland-1-eshtaol`, `JAR-15-lowland-1-zoreah`, `JAR-15-lowland-1-ashnah` |
| 15:34 | retained | `JAR-15-lowland-1-zanoah`, `JAR-15-lowland-1-en-gannim`, `JAR-15-lowland-1-tappuah`, `JAR-15-lowland-1-enam` |
| 15:35 | retained | `JAR-15-lowland-1-jarmuth`, `JAR-15-lowland-1-adullam`, `JAR-15-lowland-1-socoh`, `JAR-15-lowland-1-azekah` |
| 15:36 | retained | `JAR-15-lowland-1-sharaim`, `JAR-15-lowland-1-adithaim`, `JAR-15-lowland-1-gederah`, `JAR-15-lowland-1-gederothaim` |
| 15:37 | retained | `JAR-15-lowland-2-zenan`, `JAR-15-lowland-2-hadashah`, `JAR-15-lowland-2-migdal-gad` |
| 15:38 | retained | `JAR-15-lowland-2-dilean`, `JAR-15-lowland-2-mizpeh`, `JAR-15-lowland-2-joktheel` |
| 15:39 | retained | `JAR-15-lowland-2-lachish`, `JAR-15-lowland-2-bozkath`, `JAR-15-lowland-2-eglon` |
| 15:40 | retained | `JAR-15-lowland-2-cabbon`, `JAR-15-lowland-2-lahmam`, `JAR-15-lowland-2-kithlish` |
| 15:41 | retained | `JAR-15-lowland-2-gederoth`, `JAR-15-lowland-2-beth-dagon`, `JAR-15-lowland-2-naamah`, `JAR-15-lowland-2-makkedah` |
| 15:42 | retained | `JAR-15-lowland-3-libnah`, `JAR-15-lowland-3-ether`, `JAR-15-lowland-3-ashan` |
| 15:43 | retained | `JAR-15-lowland-3-jiphtah`, `JAR-15-lowland-3-ashnah`, `JAR-15-lowland-3-nezib` |
| 15:44 | retained | `JAR-15-lowland-3-keilah`, `JAR-15-lowland-3-achzib`, `JAR-15-lowland-3-mareshah` |
| 15:45 | retained | `JAR-15-coast-ekron` |
| 15:46 | retained | `JAR-15-coast-ekron`, `JAR-15-coast-sea`, `JAR-15-coast-ashdod` |
| 15:47 | retained | `JAR-15-coast-ashdod`, `JAR-15-coast-gaza`, `JAR-15-coast-river-of-egypt`, `JAR-15-coast-great-sea` |
| 15:48 | retained | `JAR-15-hills-1-shamir`, `JAR-15-hills-1-jattir`, `JAR-15-hills-1-socoh` |
| 15:49 | retained | `JAR-15-hills-1-dannah`, `JAR-15-hills-1-kirjath-sannah` |
| 15:50 | retained | `JAR-15-hills-1-anab`, `JAR-15-hills-1-eshtemoh`, `JAR-15-hills-1-anim` |
| 15:51 | retained | `JAR-15-hills-1-goshen`, `JAR-15-hills-1-holon`, `JAR-15-hills-1-giloh` |
| 15:52 | retained | `JAR-15-hills-2-arab`, `JAR-15-hills-2-dumah`, `JAR-15-hills-2-eshean` |
| 15:53 | retained | `JAR-15-hills-2-janum`, `JAR-15-hills-2-beth-tappuah`, `JAR-15-hills-2-aphekah` |
| 15:54 | retained | `JAR-15-hills-2-humtah`, `JAR-15-hills-2-kirjath-arba`, `JAR-15-hills-2-zior` |
| 15:55 | retained | `JAR-15-hills-3-maon`, `JAR-15-hills-3-carmel`, `JAR-15-hills-3-ziph`, `JAR-15-hills-3-juttah` |
| 15:56 | retained | `JAR-15-hills-3-jezreel`, `JAR-15-hills-3-jokdeam`, `JAR-15-hills-3-zanoah` |
| 15:57 | retained | `JAR-15-hills-3-cain`, `JAR-15-hills-3-gibeah`, `JAR-15-hills-3-timnah` |
| 15:58 | retained | `JAR-15-hills-4-halhul`, `JAR-15-hills-4-beth-zur`, `JAR-15-hills-4-gedor` |
| 15:59 | retained | `JAR-15-hills-4-maarath`, `JAR-15-hills-4-beth-anoth`, `JAR-15-hills-4-eltekon` |
| 15:60 | retained | `JAR-15-hills-5-kirjath-baal`, `JAR-15-hills-5-rabbah` |
| 15:61 | retained | `JAR-15-wilderness-beth-arabah`, `JAR-15-wilderness-middin`, `JAR-15-wilderness-secacah` |
| 15:62 | retained | `JAR-15-wilderness-nibshan`, `JAR-15-wilderness-city-of-salt`, `JAR-15-wilderness-en-gedi` |
| 15:63 | retained | `JAR-15-possession-jerusalem` |
| 16:1 | retained | `JAR-16-joseph-boundary-jordan`, `JAR-16-joseph-boundary-jericho`, `JAR-16-joseph-boundary-water-of-jericho`, `JAR-16-joseph-boundary-wilderness-ascending-from-jericho`, `JAR-16-joseph-boundary-mount-beth-el` |
| 16:2 | retained | `JAR-16-joseph-boundary-beth-el`, `JAR-16-joseph-boundary-luz`, `JAR-16-joseph-boundary-archi`, `JAR-16-joseph-boundary-ataroth` |
| 16:3 | retained | `JAR-16-joseph-boundary-japhleti`, `JAR-16-joseph-boundary-beth-horon-the-nether`, `JAR-16-joseph-boundary-gezer`, `JAR-16-joseph-boundary-sea` |
| 16:4 | no new feature | Allocation procedure, tribal/person relationship, law, dialogue or retrospective explanation; no additional named settlement/boundary feature. Tribal donor/recipient labels remain in record context. |
| 16:5 | retained | `JAR-16-ephraim-ataroth-addar`, `JAR-16-ephraim-beth-horon-the-upper` |
| 16:6 | retained | `JAR-16-ephraim-sea`, `JAR-16-ephraim-michmethah`, `JAR-16-ephraim-taanath-shiloh`, `JAR-16-ephraim-janohah` |
| 16:7 | retained | `JAR-16-ephraim-janohah`, `JAR-16-ephraim-ataroth`, `JAR-16-ephraim-naarath`, `JAR-16-ephraim-jericho`, `JAR-16-ephraim-jordan` |
| 16:8 | retained | `JAR-16-ephraim-sea`, `JAR-16-ephraim-tappuah`, `JAR-16-ephraim-river-kanah` |
| 16:9 | retained | `JAR-16-ephraim-manasseh` |
| 16:10 | retained | `JAR-16-ephraim-gezer` |
| 17:1 | retained | `JAR-17-east-gilead`, `JAR-17-east-bashan` |
| 17:2 | no new feature | Genealogical people/clans and inheritance petition; names such as Shechem, Gilead and Tirzah are not new place records in this use. |
| 17:3 | no new feature | Genealogical people/clans and inheritance petition; names such as Shechem, Gilead and Tirzah are not new place records in this use. |
| 17:4 | no new feature | Genealogical people/clans and inheritance petition; names such as Shechem, Gilead and Tirzah are not new place records in this use. |
| 17:5 | retained | `JAR-17-east-gilead`, `JAR-17-east-bashan`, `JAR-17-east-jordan` |
| 17:6 | retained | `JAR-17-east-gilead` |
| 17:7 | retained | `JAR-17-boundary-asher-17-7`, `JAR-17-boundary-michmethah`, `JAR-17-boundary-shechem`, `JAR-17-boundary-en-tappuah` |
| 17:8 | retained | `JAR-17-boundary-land-of-tappuah`, `JAR-17-boundary-tappuah` |
| 17:9 | retained | `JAR-17-boundary-river-kanah`, `JAR-17-boundary-sea` |
| 17:10 | retained | `JAR-17-boundary-sea`, `JAR-17-boundary-ephraim`, `JAR-17-boundary-manasseh`, `JAR-17-boundary-asher-17-10`, `JAR-17-boundary-issachar` |
| 17:11 | retained | `JAR-17-towns-issachar`, `JAR-17-towns-asher`, `JAR-17-towns-beth-shean`, `JAR-17-towns-ibleam`, `JAR-17-towns-dor`, `JAR-17-towns-en-dor`, `JAR-17-towns-taanach`, `JAR-17-towns-megiddo` |
| 17:12 | no new feature | Allocation procedure, tribal/person relationship, law, dialogue or retrospective explanation; no additional named settlement/boundary feature. Tribal donor/recipient labels remain in record context. |
| 17:13 | no new feature | Allocation procedure, tribal/person relationship, law, dialogue or retrospective explanation; no additional named settlement/boundary feature. Tribal donor/recipient labels remain in record context. |
| 17:14 | no new feature | Allocation procedure, tribal/person relationship, law, dialogue or retrospective explanation; no additional named settlement/boundary feature. Tribal donor/recipient labels remain in record context. |
| 17:15 | retained | `JAR-17-complaint-wood-country`, `JAR-17-complaint-land-of-the-perizzites`, `JAR-17-complaint-land-of-the-giants`, `JAR-17-complaint-mount-ephraim` |
| 17:16 | retained | `JAR-17-complaint-land-of-the-valley`, `JAR-17-complaint-beth-shean`, `JAR-17-complaint-valley-of-jezreel` |
| 17:17 | no new feature | Allocation procedure, tribal/person relationship, law, dialogue or retrospective explanation; no additional named settlement/boundary feature. Tribal donor/recipient labels remain in record context. |
| 17:18 | retained | `JAR-17-complaint-wooded-mountain` |
| 18:1 | retained | `JAR-18-survey-shiloh` |
| 18:2 | no new feature | Allocation procedure, tribal/person relationship, law, dialogue or retrospective explanation; no additional named settlement/boundary feature. Tribal donor/recipient labels remain in record context. |
| 18:3 | no new feature | Allocation procedure, tribal/person relationship, law, dialogue or retrospective explanation; no additional named settlement/boundary feature. Tribal donor/recipient labels remain in record context. |
| 18:4 | no new feature | Allocation procedure, tribal/person relationship, law, dialogue or retrospective explanation; no additional named settlement/boundary feature. Tribal donor/recipient labels remain in record context. |
| 18:5 | retained | `JAR-18-survey-judah`, `JAR-18-survey-joseph` |
| 18:6 | no new feature | Allocation procedure, tribal/person relationship, law, dialogue or retrospective explanation; no additional named settlement/boundary feature. Tribal donor/recipient labels remain in record context. |
| 18:7 | retained | `JAR-18-survey-jordan` |
| 18:8 | retained | `JAR-18-survey-shiloh` |
| 18:9 | retained | `JAR-18-survey-shiloh` |
| 18:10 | retained | `JAR-18-survey-shiloh` |
| 18:11 | retained | `JAR-18-survey-judah`, `JAR-18-survey-joseph` |
| 18:12 | retained | `JAR-18-benjamin-boundary-jordan`, `JAR-18-benjamin-boundary-jericho`, `JAR-18-benjamin-boundary-wilderness-of-beth-aven` |
| 18:13 | retained | `JAR-18-benjamin-boundary-luz`, `JAR-18-benjamin-boundary-ataroth-adar`, `JAR-18-benjamin-boundary-nether-beth-horon`, `JAR-18-benjamin-boundary-hill-south-of-nether-beth-horon` |
| 18:14 | retained | `JAR-18-benjamin-boundary-beth-horon`, `JAR-18-benjamin-boundary-kirjath-baal`, `JAR-18-benjamin-boundary-judah` |
| 18:15 | retained | `JAR-18-benjamin-boundary-kirjath-baal`, `JAR-18-benjamin-boundary-well-of-waters-of-nephtoah` |
| 18:16 | retained | `JAR-18-benjamin-boundary-unnamed-mountain-before-hinnom`, `JAR-18-benjamin-boundary-valley-of-the-son-of-hinnom`, `JAR-18-benjamin-boundary-valley-of-the-giants`, `JAR-18-benjamin-boundary-jebusi`, `JAR-18-benjamin-boundary-en-rogel` |
| 18:17 | retained | `JAR-18-benjamin-boundary-en-shemesh`, `JAR-18-benjamin-boundary-geliloth`, `JAR-18-benjamin-boundary-going-up-of-adummim`, `JAR-18-benjamin-boundary-stone-of-bohan` |
| 18:18 | retained | `JAR-18-benjamin-boundary-arabah` |
| 18:19 | retained | `JAR-18-benjamin-boundary-jordan`, `JAR-18-benjamin-boundary-beth-hoglah`, `JAR-18-benjamin-boundary-north-bay-of-salt-sea`, `JAR-18-benjamin-boundary-salt-sea` |
| 18:20 | retained | `JAR-18-benjamin-boundary-jordan` |
| 18:21 | retained | `JAR-18-benjamin-cities-1-jericho`, `JAR-18-benjamin-cities-1-beth-hoglah`, `JAR-18-benjamin-cities-1-valley-of-keziz` |
| 18:22 | retained | `JAR-18-benjamin-cities-1-beth-arabah`, `JAR-18-benjamin-cities-1-zemaraim`, `JAR-18-benjamin-cities-1-beth-el` |
| 18:23 | retained | `JAR-18-benjamin-cities-1-avim`, `JAR-18-benjamin-cities-1-parah`, `JAR-18-benjamin-cities-1-ophrah` |
| 18:24 | retained | `JAR-18-benjamin-cities-1-chephar-haammonai`, `JAR-18-benjamin-cities-1-ophni`, `JAR-18-benjamin-cities-1-gaba` |
| 18:25 | retained | `JAR-18-benjamin-cities-2-gibeon`, `JAR-18-benjamin-cities-2-ramah`, `JAR-18-benjamin-cities-2-beeroth` |
| 18:26 | retained | `JAR-18-benjamin-cities-2-mizpeh`, `JAR-18-benjamin-cities-2-chephirah`, `JAR-18-benjamin-cities-2-mozah` |
| 18:27 | retained | `JAR-18-benjamin-cities-2-rekem`, `JAR-18-benjamin-cities-2-irpeel`, `JAR-18-benjamin-cities-2-taralah` |
| 18:28 | retained | `JAR-18-benjamin-cities-2-zelah`, `JAR-18-benjamin-cities-2-eleph`, `JAR-18-benjamin-cities-2-jebusi`, `JAR-18-benjamin-cities-2-gibeath`, `JAR-18-benjamin-cities-2-kirjath` |
| 19:1 | no new feature | Allocation procedure, tribal/person relationship, law, dialogue or retrospective explanation; no additional named settlement/boundary feature. Tribal donor/recipient labels remain in record context. |
| 19:2 | retained | `JAR-19-simeon-1-beer-sheba`, `JAR-19-simeon-1-moladah` |
| 19:3 | retained | `JAR-19-simeon-1-hazar-shual`, `JAR-19-simeon-1-balah`, `JAR-19-simeon-1-azem` |
| 19:4 | retained | `JAR-19-simeon-1-eltolad`, `JAR-19-simeon-1-bethul`, `JAR-19-simeon-1-hormah` |
| 19:5 | retained | `JAR-19-simeon-1-ziklag`, `JAR-19-simeon-1-beth-marcaboth`, `JAR-19-simeon-1-hazar-susah` |
| 19:6 | retained | `JAR-19-simeon-1-beth-lebaoth`, `JAR-19-simeon-1-sharuhen` |
| 19:7 | retained | `JAR-19-simeon-2-ain`, `JAR-19-simeon-2-remmon`, `JAR-19-simeon-2-ether`, `JAR-19-simeon-2-ashan` |
| 19:8 | retained | `JAR-19-simeon-extent-baalath-beer`, `JAR-19-simeon-extent-ramath-of-the-south` |
| 19:9 | retained | `JAR-19-simeon-extent-judah` |
| 19:10 | retained | `JAR-19-zebulun-sarid` |
| 19:11 | retained | `JAR-19-zebulun-sea`, `JAR-19-zebulun-maralah`, `JAR-19-zebulun-dabbasheth`, `JAR-19-zebulun-river-before-jokneam`, `JAR-19-zebulun-jokneam` |
| 19:12 | retained | `JAR-19-zebulun-sarid`, `JAR-19-zebulun-chisloth-tabor`, `JAR-19-zebulun-daberath`, `JAR-19-zebulun-japhia` |
| 19:13 | retained | `JAR-19-zebulun-gittah-hepher`, `JAR-19-zebulun-ittah-kazin`, `JAR-19-zebulun-remmon-methoar`, `JAR-19-zebulun-neah` |
| 19:14 | retained | `JAR-19-zebulun-hannathon`, `JAR-19-zebulun-valley-of-jiphthah-el` |
| 19:15 | retained | `JAR-19-zebulun-kattath`, `JAR-19-zebulun-nahallal`, `JAR-19-zebulun-shimron`, `JAR-19-zebulun-idalah`, `JAR-19-zebulun-beth-lehem` |
| 19:16 | no new feature | Allocation procedure, tribal/person relationship, law, dialogue or retrospective explanation; no additional named settlement/boundary feature. Tribal donor/recipient labels remain in record context. |
| 19:17 | no new feature | Allocation procedure, tribal/person relationship, law, dialogue or retrospective explanation; no additional named settlement/boundary feature. Tribal donor/recipient labels remain in record context. |
| 19:18 | retained | `JAR-19-issachar-jezreel`, `JAR-19-issachar-chesulloth`, `JAR-19-issachar-shunem` |
| 19:19 | retained | `JAR-19-issachar-hapharaim`, `JAR-19-issachar-shion`, `JAR-19-issachar-anaharath` |
| 19:20 | retained | `JAR-19-issachar-rabbith`, `JAR-19-issachar-kishion`, `JAR-19-issachar-abez` |
| 19:21 | retained | `JAR-19-issachar-remeth`, `JAR-19-issachar-en-gannim`, `JAR-19-issachar-en-haddah`, `JAR-19-issachar-beth-pazzez` |
| 19:22 | retained | `JAR-19-issachar-tabor`, `JAR-19-issachar-shahazimah`, `JAR-19-issachar-beth-shemesh`, `JAR-19-issachar-jordan` |
| 19:23 | no new feature | Allocation procedure, tribal/person relationship, law, dialogue or retrospective explanation; no additional named settlement/boundary feature. Tribal donor/recipient labels remain in record context. |
| 19:24 | no new feature | Allocation procedure, tribal/person relationship, law, dialogue or retrospective explanation; no additional named settlement/boundary feature. Tribal donor/recipient labels remain in record context. |
| 19:25 | retained | `JAR-19-asher-helkath`, `JAR-19-asher-hali`, `JAR-19-asher-beten`, `JAR-19-asher-achshaph` |
| 19:26 | retained | `JAR-19-asher-alammelech`, `JAR-19-asher-amad`, `JAR-19-asher-misheal`, `JAR-19-asher-carmel`, `JAR-19-asher-shihor-libnath` |
| 19:27 | retained | `JAR-19-asher-beth-dagon`, `JAR-19-asher-zebulun`, `JAR-19-asher-valley-of-jiphthah-el`, `JAR-19-asher-beth-emek`, `JAR-19-asher-neiel`, `JAR-19-asher-cabul` |
| 19:28 | retained | `JAR-19-asher-hebron`, `JAR-19-asher-rehob-19-28`, `JAR-19-asher-hammon`, `JAR-19-asher-kanah`, `JAR-19-asher-great-zidon` |
| 19:29 | retained | `JAR-19-asher-ramah`, `JAR-19-asher-tyre`, `JAR-19-asher-hosah`, `JAR-19-asher-sea`, `JAR-19-asher-achzib` |
| 19:30 | retained | `JAR-19-asher-ummah`, `JAR-19-asher-aphek`, `JAR-19-asher-rehob-19-30` |
| 19:31 | no new feature | Allocation procedure, tribal/person relationship, law, dialogue or retrospective explanation; no additional named settlement/boundary feature. Tribal donor/recipient labels remain in record context. |
| 19:32 | no new feature | Allocation procedure, tribal/person relationship, law, dialogue or retrospective explanation; no additional named settlement/boundary feature. Tribal donor/recipient labels remain in record context. |
| 19:33 | retained | `JAR-19-naphtali-heleph`, `JAR-19-naphtali-allon`, `JAR-19-naphtali-zaanannim`, `JAR-19-naphtali-adami`, `JAR-19-naphtali-nekeb`, `JAR-19-naphtali-jabneel`, `JAR-19-naphtali-lakum`, `JAR-19-naphtali-jordan` |
| 19:34 | retained | `JAR-19-naphtali-jordan`, `JAR-19-naphtali-aznoth-tabor`, `JAR-19-naphtali-hukkok`, `JAR-19-naphtali-zebulun`, `JAR-19-naphtali-asher`, `JAR-19-naphtali-judah-upon-jordan` |
| 19:35 | retained | `JAR-19-naphtali-ziddim`, `JAR-19-naphtali-zer`, `JAR-19-naphtali-hammath`, `JAR-19-naphtali-rakkath`, `JAR-19-naphtali-chinnereth` |
| 19:36 | retained | `JAR-19-naphtali-adamah`, `JAR-19-naphtali-ramah`, `JAR-19-naphtali-hazor` |
| 19:37 | retained | `JAR-19-naphtali-kedesh`, `JAR-19-naphtali-edrei`, `JAR-19-naphtali-en-hazor` |
| 19:38 | retained | `JAR-19-naphtali-iron`, `JAR-19-naphtali-migdal-el`, `JAR-19-naphtali-horem`, `JAR-19-naphtali-beth-anath`, `JAR-19-naphtali-beth-shemesh` |
| 19:39 | no new feature | Allocation procedure, tribal/person relationship, law, dialogue or retrospective explanation; no additional named settlement/boundary feature. Tribal donor/recipient labels remain in record context. |
| 19:40 | no new feature | Allocation procedure, tribal/person relationship, law, dialogue or retrospective explanation; no additional named settlement/boundary feature. Tribal donor/recipient labels remain in record context. |
| 19:41 | retained | `JAR-19-dan-zorah`, `JAR-19-dan-eshtaol`, `JAR-19-dan-ir-shemesh` |
| 19:42 | retained | `JAR-19-dan-shaalabbin`, `JAR-19-dan-ajalon`, `JAR-19-dan-jethlah` |
| 19:43 | retained | `JAR-19-dan-elon`, `JAR-19-dan-thimnathah`, `JAR-19-dan-ekron` |
| 19:44 | retained | `JAR-19-dan-eltekeh`, `JAR-19-dan-gibbethon`, `JAR-19-dan-baalath` |
| 19:45 | retained | `JAR-19-dan-jehud`, `JAR-19-dan-bene-berak`, `JAR-19-dan-gath-rimmon` |
| 19:46 | retained | `JAR-19-dan-me-jarkon`, `JAR-19-dan-rakkon`, `JAR-19-dan-japho` |
| 19:47 | retained | `JAR-19-dan-leshem-leshem` |
| 19:48 | no new feature | Allocation procedure, tribal/person relationship, law, dialogue or retrospective explanation; no additional named settlement/boundary feature. Tribal donor/recipient labels remain in record context. |
| 19:49 | no new feature | Allocation procedure, tribal/person relationship, law, dialogue or retrospective explanation; no additional named settlement/boundary feature. Tribal donor/recipient labels remain in record context. |
| 19:50 | retained | `JAR-19-joshua-timnath-serah`, `JAR-19-joshua-mount-ephraim` |
| 19:51 | retained | `JAR-19-joshua-shiloh`, `JAR-19-joshua-door-of-the-tabernacle` |
| 20:1 | no new feature | Refuge law and unnamed hypothetical home/city/gate; named designations are recorded in20:7–8. No hypothetical settlement invented. |
| 20:2 | no new feature | Refuge law and unnamed hypothetical home/city/gate; named designations are recorded in20:7–8. No hypothetical settlement invented. |
| 20:3 | no new feature | Refuge law and unnamed hypothetical home/city/gate; named designations are recorded in20:7–8. No hypothetical settlement invented. |
| 20:4 | no new feature | Refuge law and unnamed hypothetical home/city/gate; named designations are recorded in20:7–8. No hypothetical settlement invented. |
| 20:5 | no new feature | Refuge law and unnamed hypothetical home/city/gate; named designations are recorded in20:7–8. No hypothetical settlement invented. |
| 20:6 | no new feature | Refuge law and unnamed hypothetical home/city/gate; named designations are recorded in20:7–8. No hypothetical settlement invented. |
| 20:7 | retained | `JAR-20-refuge-west-kedesh`, `JAR-20-refuge-west-galilee`, `JAR-20-refuge-west-mount-naphtali`, `JAR-20-refuge-west-shechem`, `JAR-20-refuge-west-mount-ephraim`, `JAR-20-refuge-west-kirjath-arba`, `JAR-20-refuge-west-mountain-of-judah` |
| 20:8 | retained | `JAR-20-refuge-east-jordan`, `JAR-20-refuge-east-jericho`, `JAR-20-refuge-east-bezer`, `JAR-20-refuge-east-wilderness-upon-the-plain`, `JAR-20-refuge-east-reuben`, `JAR-20-refuge-east-ramoth-in-gilead`, `JAR-20-refuge-east-gilead`, `JAR-20-refuge-east-golan`, `JAR-20-refuge-east-bashan`, `JAR-20-refuge-east-gad`, `JAR-20-refuge-east-manasseh` |
| 20:9 | no new feature | Refuge law and unnamed hypothetical home/city/gate; named designations are recorded in20:7–8. No hypothetical settlement invented. |
| 21:1 | no new feature | Allocation procedure, tribal/person relationship, law, dialogue or retrospective explanation; no additional named settlement/boundary feature. Tribal donor/recipient labels remain in record context. |
| 21:2 | retained | `JAR-21-assembly-shiloh`, `JAR-21-assembly-canaan` |
| 21:3 | no new feature | Allocation procedure, tribal/person relationship, law, dialogue or retrospective explanation; no additional named settlement/boundary feature. Tribal donor/recipient labels remain in record context. |
| 21:4 | no new feature | Donor/recipient groups, totals or theological possession conclusion; named allocation records occur in9–39. Totals and fulfillment tension retained above. |
| 21:5 | no new feature | Donor/recipient groups, totals or theological possession conclusion; named allocation records occur in9–39. Totals and fulfillment tension retained above. |
| 21:6 | retained | `JAR-21-assembly-bashan` |
| 21:7 | no new feature | Donor/recipient groups, totals or theological possession conclusion; named allocation records occur in9–39. Totals and fulfillment tension retained above. |
| 21:8 | no new feature | Allocation procedure, tribal/person relationship, law, dialogue or retrospective explanation; no additional named settlement/boundary feature. Tribal donor/recipient labels remain in record context. |
| 21:9 | no new feature | Allocation procedure, tribal/person relationship, law, dialogue or retrospective explanation; no additional named settlement/boundary feature. Tribal donor/recipient labels remain in record context. |
| 21:10 | no new feature | Allocation procedure, tribal/person relationship, law, dialogue or retrospective explanation; no additional named settlement/boundary feature. Tribal donor/recipient labels remain in record context. |
| 21:11 | retained | `JAR-21-aaron-judah-simeon-city-of-arba`, `JAR-21-aaron-judah-simeon-hill-country-of-judah` |
| 21:12 | retained | `JAR-21-aaron-judah-simeon-fields-and-villages-of-hebron` |
| 21:13 | retained | `JAR-21-aaron-judah-simeon-city-of-arba`, `JAR-21-aaron-judah-simeon-libnah` |
| 21:14 | retained | `JAR-21-aaron-judah-simeon-jattir`, `JAR-21-aaron-judah-simeon-eshtemoa` |
| 21:15 | retained | `JAR-21-aaron-judah-simeon-holon`, `JAR-21-aaron-judah-simeon-debir` |
| 21:16 | retained | `JAR-21-aaron-judah-simeon-ain`, `JAR-21-aaron-judah-simeon-juttah`, `JAR-21-aaron-judah-simeon-beth-shemesh` |
| 21:17 | retained | `JAR-21-aaron-benjamin-gibeon`, `JAR-21-aaron-benjamin-geba` |
| 21:18 | retained | `JAR-21-aaron-benjamin-anathoth`, `JAR-21-aaron-benjamin-almon` |
| 21:19 | no new feature | Donor/recipient groups, totals or theological possession conclusion; named allocation records occur in9–39. Totals and fulfillment tension retained above. |
| 21:20 | no new feature | Allocation procedure, tribal/person relationship, law, dialogue or retrospective explanation; no additional named settlement/boundary feature. Tribal donor/recipient labels remain in record context. |
| 21:21 | retained | `JAR-21-kohath-ephraim-shechem`, `JAR-21-kohath-ephraim-mount-ephraim`, `JAR-21-kohath-ephraim-gezer` |
| 21:22 | retained | `JAR-21-kohath-ephraim-kibzaim`, `JAR-21-kohath-ephraim-beth-horon` |
| 21:23 | retained | `JAR-21-kohath-dan-eltekeh`, `JAR-21-kohath-dan-gibbethon` |
| 21:24 | retained | `JAR-21-kohath-dan-aijalon`, `JAR-21-kohath-dan-gath-rimmon` |
| 21:25 | retained | `JAR-21-kohath-manasseh-tanach`, `JAR-21-kohath-manasseh-gath-rimmon` |
| 21:26 | no new feature | Donor/recipient groups, totals or theological possession conclusion; named allocation records occur in9–39. Totals and fulfillment tension retained above. |
| 21:27 | retained | `JAR-21-gershon-manasseh-golan`, `JAR-21-gershon-manasseh-bashan`, `JAR-21-gershon-manasseh-beesh-terah` |
| 21:28 | retained | `JAR-21-gershon-issachar-kishon`, `JAR-21-gershon-issachar-dabareh` |
| 21:29 | retained | `JAR-21-gershon-issachar-jarmuth`, `JAR-21-gershon-issachar-en-gannim` |
| 21:30 | retained | `JAR-21-gershon-asher-mishal`, `JAR-21-gershon-asher-abdon` |
| 21:31 | retained | `JAR-21-gershon-asher-helkath`, `JAR-21-gershon-asher-rehob` |
| 21:32 | retained | `JAR-21-gershon-naphtali-kedesh`, `JAR-21-gershon-naphtali-galilee`, `JAR-21-gershon-naphtali-hammoth-dor`, `JAR-21-gershon-naphtali-kartan` |
| 21:33 | no new feature | Donor/recipient groups, totals or theological possession conclusion; named allocation records occur in9–39. Totals and fulfillment tension retained above. |
| 21:34 | retained | `JAR-21-merari-zebulun-jokneam`, `JAR-21-merari-zebulun-kartah` |
| 21:35 | retained | `JAR-21-merari-zebulun-dimnah`, `JAR-21-merari-zebulun-nahalal` |
| 21:36 | retained | `JAR-21-merari-reuben-bezer`, `JAR-21-merari-reuben-jahazah` |
| 21:37 | retained | `JAR-21-merari-reuben-kedemoth`, `JAR-21-merari-reuben-mephaath` |
| 21:38 | retained | `JAR-21-merari-gad-ramoth-in-gilead`, `JAR-21-merari-gad-gilead`, `JAR-21-merari-gad-mahanaim` |
| 21:39 | retained | `JAR-21-merari-gad-heshbon`, `JAR-21-merari-gad-jazer` |
| 21:40 | no new feature | Donor/recipient groups, totals or theological possession conclusion; named allocation records occur in9–39. Totals and fulfillment tension retained above. |
| 21:41 | no new feature | Donor/recipient groups, totals or theological possession conclusion; named allocation records occur in9–39. Totals and fulfillment tension retained above. |
| 21:42 | no new feature | Donor/recipient groups, totals or theological possession conclusion; named allocation records occur in9–39. Totals and fulfillment tension retained above. |
| 21:43 | no new feature | Donor/recipient groups, totals or theological possession conclusion; named allocation records occur in9–39. Totals and fulfillment tension retained above. |
| 21:44 | no new feature | Donor/recipient groups, totals or theological possession conclusion; named allocation records occur in9–39. Totals and fulfillment tension retained above. |
| 21:45 | no new feature | Donor/recipient groups, totals or theological possession conclusion; named allocation records occur in9–39. Totals and fulfillment tension retained above. |
| 22:1 | no new feature | Allocation procedure, tribal/person relationship, law, dialogue or retrospective explanation; no additional named settlement/boundary feature. Tribal donor/recipient labels remain in record context. |
| 22:2 | no new feature | Allocation procedure, tribal/person relationship, law, dialogue or retrospective explanation; no additional named settlement/boundary feature. Tribal donor/recipient labels remain in record context. |
| 22:3 | no new feature | Allocation procedure, tribal/person relationship, law, dialogue or retrospective explanation; no additional named settlement/boundary feature. Tribal donor/recipient labels remain in record context. |
| 22:4 | retained | `JAR-22-return-and-altar-jordan` |
| 22:5 | no new feature | Allocation procedure, tribal/person relationship, law, dialogue or retrospective explanation; no additional named settlement/boundary feature. Tribal donor/recipient labels remain in record context. |
| 22:6 | no new feature | Allocation procedure, tribal/person relationship, law, dialogue or retrospective explanation; no additional named settlement/boundary feature. Tribal donor/recipient labels remain in record context. |
| 22:7 | retained | `JAR-22-return-and-altar-jordan`, `JAR-22-return-and-altar-bashan` |
| 22:8 | no new feature | Allocation procedure, tribal/person relationship, law, dialogue or retrospective explanation; no additional named settlement/boundary feature. Tribal donor/recipient labels remain in record context. |
| 22:9 | retained | `JAR-22-return-and-altar-shiloh`, `JAR-22-return-and-altar-canaan`, `JAR-22-return-and-altar-gilead` |
| 22:10 | retained | `JAR-22-return-and-altar-canaan`, `JAR-22-return-and-altar-borders-of-jordan`, `JAR-22-return-and-altar-altar-by-jordan` |
| 22:11 | retained | `JAR-22-return-and-altar-canaan`, `JAR-22-return-and-altar-borders-of-jordan`, `JAR-22-return-and-altar-passage-of-the-children-of-israel` |
| 22:12 | retained | `JAR-22-return-and-altar-shiloh` |
| 22:13 | retained | `JAR-22-return-and-altar-gilead` |
| 22:14 | no new feature | Allocation procedure, tribal/person relationship, law, dialogue or retrospective explanation; no additional named settlement/boundary feature. Tribal donor/recipient labels remain in record context. |
| 22:15 | retained | `JAR-22-return-and-altar-gilead` |
| 22:16 | no new feature | Accusation, explanation, person reference or resolution; same witness-altar context already retained. Threatened attack is not a completed journey/battle. |
| 22:17 | retained | `JAR-22-return-and-altar-peor` |
| 22:18 | no new feature | Accusation, explanation, person reference or resolution; same witness-altar context already retained. Threatened attack is not a completed journey/battle. |
| 22:19 | retained | `JAR-22-return-and-altar-land-of-the-lord-s-tabernacle`, `JAR-22-return-and-altar-altar-of-the-lord` |
| 22:20 | no new feature | Accusation, explanation, person reference or resolution; same witness-altar context already retained. Threatened attack is not a completed journey/battle. |
| 22:21 | no new feature | Accusation, explanation, person reference or resolution; same witness-altar context already retained. Threatened attack is not a completed journey/battle. |
| 22:22 | no new feature | Accusation, explanation, person reference or resolution; same witness-altar context already retained. Threatened attack is not a completed journey/battle. |
| 22:23 | no new feature | Accusation, explanation, person reference or resolution; same witness-altar context already retained. Threatened attack is not a completed journey/battle. |
| 22:24 | no new feature | Accusation, explanation, person reference or resolution; same witness-altar context already retained. Threatened attack is not a completed journey/battle. |
| 22:25 | retained | `JAR-22-return-and-altar-jordan` |
| 22:26 | no new feature | Accusation, explanation, person reference or resolution; same witness-altar context already retained. Threatened attack is not a completed journey/battle. |
| 22:27 | no new feature | Accusation, explanation, person reference or resolution; same witness-altar context already retained. Threatened attack is not a completed journey/battle. |
| 22:28 | retained | `JAR-22-return-and-altar-altar-of-the-lord` |
| 22:29 | retained | `JAR-22-return-and-altar-altar-of-the-lord` |
| 22:30 | no new feature | Accusation, explanation, person reference or resolution; same witness-altar context already retained. Threatened attack is not a completed journey/battle. |
| 22:31 | no new feature | Accusation, explanation, person reference or resolution; same witness-altar context already retained. Threatened attack is not a completed journey/battle. |
| 22:32 | retained | `JAR-22-return-and-altar-canaan`, `JAR-22-return-and-altar-gilead` |
| 22:33 | no new feature | Accusation, explanation, person reference or resolution; same witness-altar context already retained. Threatened attack is not a completed journey/battle. |
| 22:34 | retained | `JAR-22-return-and-altar-altar-by-jordan` |

## Validation and remaining uncertainty

**602 unique contextual records** represent 649 source-list mentions after within-context repeat aggregation; **306/306 verses** have an explicit disposition. This is not a claim of 602 distinct physical sites. 73 records explicitly reuse existing P/AP/OHP identities; other identities remain context-scoped. All 649 parsed mentions are assigned, including repeated aliases, people-territory references and named boundary features. Every row has source verses, an official chapter URL, a preserved-capture SHA256, `first:1` / `layer:bible` and withheld coordinates.

| Chapter | Verses inspected | Contextual records |
|---|---|---|
| Joshua 13 | 33 | 84 |
| Joshua 14 | 15 | 7 |
| Joshua 15 | 63 | 176 |
| Joshua 16 | 10 | 27 |
| Joshua 17 | 18 | 31 |
| Joshua 18 | 28 | 54 |
| Joshua 19 | 51 | 137 |
| Joshua 20 | 9 | 18 |
| Joshua 21 | 45 | 57 |
| Joshua 22 | 34 | 11 |

Source bodies are the ten preserved official files `josh-13.txt` through `josh-22.txt` under `/workspace/lds-source-evidence/20261026/ot-history/`; their existing witness metadata lives in `ot-history-source-witnesses.csv`. The raw source archive is outside the public repository. No current source-access blocker remains. Unresolved compound-name parsing, same-name identity, textual totals, modern coordinates and historical occupation are explicitly retained; no unseen archaeological or manuscript evidence is claimed.

Implementation may join proven shared identities while retaining every chapter/tribe relationship row. Do not replace these source relations with one modern territorial polygon. This register supplies the formerly missing dense allotment keys; unrelated genealogical and royal-official completeness questions remain outside this file’s assigned scope.
