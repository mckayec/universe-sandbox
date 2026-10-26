# Abrahamic origins, divergence and encounter — research checkpoint

2026-10-26. Repository baseline `a5c1e171c319a4aa6241a996f484babb617ad425`. Research follows the signed HANDOFF_PLAN §1.4 order after the LDS research-review handoff in PR27. This is a separate documentation branch; the LDS handoff remains unmerged. Dedicated Deep Research is unavailable; opened web sources and source-specific dossiers supply the evidence. No finished-atlas or release approval is claimed.

| Scope | Current artifact | Coverage / limits |
|---|---|---|
| Judaism | `judaism-research.md` | Origins and selected major historical/modern formations; traditional ancestry, historical development and current organizations separated |
| Christianity | `christianity-research.md` | Early setting, major councils/communions, Reformation and selected later movements; overlapping affiliation distinguished from institutional descent |
| Islam | `islam-research.md` | Origins, Sunni/Shia/Ibadi and selected branches, legal schools and Sufi crosscutting relations; revelation traditions distinguished from historical movement |
| Comparative demography | `comparative-evidence.md` XD01–07 | Explicit2020Pew estimates released2025; not2026counts or additive denomination totals |
| Wider encounters | `comparative-evidence.md` XE/XC/XJ | Selected Christianity/Buddhism/Zoroastrianism policy context, Islamic/Hindu textual comparison, Sikh and Bahá’í contexts; bounded Daoist/Chinese intellectual-contact claims supported by inspected scholarly passages |

`C` supports the attributed source statement, not independent historical proof of religious belief. Dossier source namespaces are local; retain their full filename when importing. Missing evidence is excluded from factual display, not replaced by memory. This checkpoint does not claim an exhaustive census of all denominations, local traditions or cross-cultural interactions.

## 1. Meta

**Design:** id `abrahamic-world-religions`; title “Religious Traditions: Origins and Connections”; TrackA; Earth map with a typed relationship view. Description: “Explore how religious communities developed, divided, interacted and spread, with traditions and historical evidence clearly distinguished.”

This is historical/comparative material, not a single literary canon with one publication order. **Design gate1** is the research overview; source/date labels carry provenance. Optional tradition filters must not imply that the displayed groups are mutually exclusive statistical categories. Theme: warm stone, ink blue, restrained gold; original graphics only. No copyrighted sacred images, institutional logos or book pages supplied.

**Proposed notice:** “Independent educational atlas. Religious self-descriptions, historical interpretations and demographic estimates are identified by source. Connections do not imply agreement, biological ancestry or institutional authority.”

## 2. Structure

**Design:** one Earth world, with optional Judaism, Christianity, Islam and encounters filters. The relationship view must be a labelled graph, not an unqualified family tree. Use separate edge types for historical emergence, institutional division, merger, self-described succession, intellectual encounter, translation and overlapping movement affiliation. Do not give a named religious ancestor a fabricated historical birth/founding year or draw every tradition as a denomination of one predecessor.

The main branch currently documents TrackA layers/time in PACK_FORMAT §20. Status reports a proposed tree implementation in PR28; its unmerged API is not treated here as deployed. The research edge semantics remain usable regardless of layout. If the builder offers only one parent per node, retain the additional relationships as labelled reference entries rather than distorting them to fit the model.

## 3. Places

The three tradition dossiers supply stable place keys, sources, parentEarth, dates/associations and explicit spatial limits. Their modern representative anchors must retain the source's precision; other settings are reference-only until independently geocoded. `gazetteer-evidence.md/.csv` supplies eight additional UNESCO heritage-reference points, alongside the two in the Judaism dossier. These ten anchors are not ten exact historical event locations. A city marker does not identify an exact miracle, council room, battlefield point or modern territorial entitlement.

Comparative settings additionally include Xi'an (XE01), Lahore and the Indo-Persian translation setting (XE03–04), Talwandi/Sultanpur (XC01), Shiraz/Baghdad/Acre (XC02/XE05/XJ01). These are source-qualified settings in `comparative-evidence.md`, not new numeric coordinates. Reuse an existing dossier city where identity is explicit; retain distinct historical episodes. [X04–X07] (C)

## 4. Events

Use the dated, source-qualified event registers in the tradition dossiers. Numeric dates are adopted only to the precision the source supports; approximate and traditional chronologies remain labelled. A conventional schism year can summarize a long process but must not imply instantaneous creation of every modern community.

Comparative event keys XE01–06 retain their stated type: monument/report, state policy, authored comparison, translation, religious declaration and institutional election. The635arrival reported by a781stele is two chronology fields, not one unqualified date. Bahá’í1844/1863origins and1963administration are different events. Source attribution and independent-history status remain visible. [X04,X05,X07] (C)

## 5. Journeys

Use only sourced actor-specific ordered movements in each dossier. Geographic spread over centuries is a regional process, not one individual's continuous road. Narrative pilgrimage accounts and later traditions require their own label. XJ01 retains the Bahá’í institutional history's exile sequence without inferred intermediate routes. Guru Nanak's Makkah episode is a tradition described by X06, not a surveyed itinerary. [X06,X07] (C)

## 6. Codex

**Research reference families:** traditions' own origin accounts; historically supported community formation; councils and doctrinal disputes; legal schools; devotional orders; modern organizational unions; migration and diaspora; translation and encounter; affiliation measurement. Each factual entry is supplied by a cited dossier, not inferred from this taxonomy.

**Design labels:** “Tradition teaches,” “Historical account,” “Institutional history,” “Scholarly interpretation,” “Demographic estimate (year),” and “Unresolved.” Denomination, legal school, devotional movement, ethnicity and organization must not silently become interchangeable node types. The dated demographic reference is a separate measurement layer; it cannot determine who is a legitimate believer.

## 7. Open questions and exclusions

- `identity-and-edges.md/.csv` now supplies328source-qualified registrations/selected edges/non-merges; all selected endpoints resolve. A complete defined-registry prominent-claim/source-quality and chronology disposition remains necessary beyond the ten-family integrator sample.
- Ten representative heritage anchors are available; other places deliberately remain reference-only. Actual map/tree serialization and display checks remain later implementation gates.
- The initial Daoist-contact abstract-only gap is closed for the bounded scholarly-attribution rows XC03–04. Full primary-text comparison remains outside this checkpoint; do not infer institutional descent or wholesale doctrinal agreement.
- Wider Hindu/Buddhist/Daoist internal histories and all smaller Abrahamic-related communities are not comprehensively covered in this checkpoint. The intended focus is sourced connections to the central traditions, with additions required where material omissions are identified.
- No2026worldwide adherent estimates or mutually exclusive denominational census is claimed. Do not use stale institutional officeholder/member counts from undated pages.
- Scripture and institutional self-description establish beliefs and claims. Archaeological, historical and causal assertions require suitable evidence of their own; alleged religious truth is not adjudicated here.

## 8. TrackA additions

Every place/event/edge must distinguish textual/religious claim, community interpretation and historical evidence. An intellectual comparison is not parentage; an institutional merger is not theological unanimity; shared political persecution is not common doctrine. Differences between scholarly classifications and adherents' self-identification should be displayed as attributed perspectives.

`comparative-evidence.md` supplies dated broad-population context and explicit inter-tradition encounter records. The tradition dossiers supply their own origins, people, major divisions and spread. The subsequent integration audit must preserve the source qualifications and deliberate non-edges rather than converting all rows to one hierarchy. Status remains `research / chatgpt` until that work is complete.
