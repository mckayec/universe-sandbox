# Judaism record audit

Audit date: 2026-10-26. Repository base: `79a0c450ba1bc1e63d396a86b74bd31ba3272149`; audited dossier: [judaism-research.md](judaism-research.md), including the corrections below. Final dossier SHA-256: `5fbfb21389b17f1afdd5c1432c2b9c643e6aba43647417f90f3b179cc3a4019a`. This hash identifies the artifact, not proof that source bodies were read.

**Verdict: the bounded dossier's retained records are supported at their stated attribution and precision after one location-support correction.** This is a research audit, not release approval, comprehensive Jewish history, or validation of downstream serialized data. All declared records, including prominent origins and contested classifications, received passage-level checking; this was not a sample.

## Denominators and method

[The CSV](judaism-record-audit.csv) contains 86 unique record IDs: 18 places, 17 events, 4 journeys, 20 concept/tradition nodes, 9 people, and 18 typed-edge rows. These are record categories, not 86 independent historical claims: a date may recur in an event, place and edge. The 18 edges are ledger rows; JU-R03 has three targets, JU-R07 is bidirectional, and JU-R17/JU-R18 each have two source organizations. They must not be represented as 18 atomic directed links without expansion. Bracketed endpoint facets are not additional denominations. There are 68 non-edge record rows. No `(L)` or `(U)` records are retained in this dossier; uncertainty is expressed in claim type, date precision and withheld geography rather than concealed by the `(C)` source-access label.

For each retained record I compared the actual relevant source passage with its proposed copy, relationships, date and location. The CSV names the direct URL, inspected passage, outcome and limits. Sources JU01–19, JU21–22 and JU24 were reopened successfully through the web reader: **22 claim-bearing sources**. JU20 and JU23 are declared background consultations with no retained record dependent on them; they were not reopened and are excluded from this audit's checked-source denominator. No linked whole book or full canon was reread. No wholesale source capture is included.

The shell HTTP route failed at the network tunnel with403 for the source URLs; this did not establish source inaccessibility, because the web reader supplied the needed bodies. The separate SAJ history URL below did fail in the web reader. Original dossier reports of other inaccessible sites were not retried or promoted to supporting evidence.

## Correction applied

**JA01 — source-location mismatch, two affected rows.** JU12's RRC history establishes Kaplan's SAJ founding in1922 but does not name its city. The attempted direct page `https://thesaj.org/history/` returned an inaccessible-page error. This does not prove the historical New York association false; it means the cited evidence did not support that field. Removed the SAJ association and1922 date from `jud-new-york`, retaining its independently supported JTS association under JU11. In `jud-e11`, replaced `jud-new-york` with “Location withheld pending direct supporting evidence” and retained the1922 founding and Kaplan. IDs and event existence are unchanged. No new geography was inferred.

## Source-body checks and precision constraints

| Source | Actual inspected passage and decision |
|---|---|
| JU01 | Genesis12:1–10: call, household relationships, age75 and ordered itinerary. Narrative age is not a historical BCE date; no campsite coordinate supplied. |
| JU02 | Exodus19:1–8: third month, Rephidim–Sinai sequence, Moses and collective assent. Text claim, not archaeological route confirmation. |
| JU03 | Main Temple/rabbinic paragraphs: circa515BCE and70CE are supported at overview precision. Compressed universal transformation language is not imported. |
| JU04 | “The Israelites” and “Cyrus and the Exiles”: staged conquest,597–586 context and539 conquest. Embedded Kings/Ezra quotations remain biblical witnesses; the court-record quotation supports a narrower capture claim. The Cylinder is not relabeled the Judean decree. |
| JU05 | Oral Torah, Mishnah and Gemara paragraphs: traditional transmission is explicitly attributed; Palestinian/Babylonian literary development remains broad. |
| JU06 | Alexandria/Philo and diaspora-community paragraphs: places and cultural distinctions supported. Blanket exile language and demographic estimates are not retained. |
| JU07 | Opening summary and Hasidism paragraph: eighteenth-century Eastern Europe and Baal Shem Tov supported. Source's narrower “late18th” formulation and exact Zohar date are not adopted. |
| JU08 | Ananite correction, changing community ties and period/location overview: eighth-century Anan is not directly equated with the apparently ninth-century Karaite movement. Book description is not a claim that the book was inspected. |
| JU09 | Haskalah/Wissenschaft and Hamburg paragraph: influence and1818 supported. Compressed Musar classification is excluded. |
| JU10 | Opening three paragraphs: Seesen17July1810, Jacobson and international spread. Institutional “first” rhetoric is not universalized. |
| JU11 | Opening and Conservative-voice paragraph:1886 foundation,1887 New York class and named founders supported. |
| JU12 | History introduction,1922/1955 paragraphs,1968 building/caption/dedication passage:13October dedication and next-day classes supported. SAJ city not supplied; JA01 applies. |
| JU13 | Opening and SHJ subsection:1964 congregational practice in this account,1969 SHJ, Wine and humanistic philosophy. These are not assertions of a1964 temple founding. |
| JU14 | “Who We Are,” founder and Renewal sections:1993 merger and Zalman association supported; ALEPH is not all Renewal. |
| JU15 | Transfer/data notice:1January2026 effective merger and Sternberg Centre office. Separate December2025 launch links are visible; the two dates are not conflated. |
| JU16 | Main pluralism paragraphs: cross-denominational and no-label participation supported. Its demographic generalization is excluded. |
| JU17 | Antiquities18.1.2–6: three named groups and a fourth philosophical grouping demonstrate why the three-node selection is nonexhaustive. Josephus's portrayal is attributed, not neutral census evidence. |
| JU18 | Classification paragraphs and “Who is a Jew?”: Modern Orthodox/Haredi and Hasidic/Yeshivish distinctions supported for this2013 US survey, published2015; no current population totals inferred. |
| JU19 | Introduction only: positive-historical outlook and Frankel supported. Its1857 Breslau statement remains excluded; full46-page document not inspected. |
| JU20 | Background-only source; no retained record relies on it. Not independently reopened in this audit. |
| JU21 | UNESCO coordinate field:31°46′40″N35°13′54″E converts to31.777778,35.231667. Heritage reference point only. |
| JU22 | UNESCO opening and coordinate field: imperial-city description and32°32′31.09″N44°25′15″E convert to32.541969,44.420833. City is not entire Babylonia. |
| JU23 | Background-only source; no retained record relies on it. Not independently reopened in this audit. |
| JU24 | Landing-page prayer/Torah/customs headings support the limited continuing-practice claim. Linked detailed teachings were not independently inspected. |

Direct source URLs are recorded per record in the CSV and in the dossier's JU source register. Source statements preserved as quotations by the original author remain distinguished from the author's historical interpretation. The audit adds no long source quotations.

## Remaining limits and integration obligations

- SAJ founding location remains withheld. A nonspatial event is usable; a map pin requires direct supporting evidence.
- Sixteen of18 place records lack researched coordinates and remain reference-only; the two UNESCO anchors do not locate ancient actions. Neither narrative route can become a precise polyline.
- All records use local Judaism-overlay `first:1`; this is not a Genesis spoiler claim. Global navigation mapping, typed facet resolution, edge expansion and cross-shard deduplication remain integration work.
- Modern classifications are regionally bounded. The dossier's exclusions and absence of adherent totals remain explicit. It cannot be used as an exhaustive global Jewish denominational census.
- Source-supported religious narrative, institutional self-description and academic synthesis are different evidence classes. `(C)` does not adjudicate religious truth or prove independent historical corroboration.

Validation: unique record IDs and category totals checked against declared dossier rows; source keys resolve; no IDs changed; coordinate arithmetic verified; whitespace check passed for the three audit-owned files. No runtime tests apply to this documentation-only audit. No commit or publication performed by this reviewer.
