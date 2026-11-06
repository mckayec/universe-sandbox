# Q01 coordinate evidence continuation — four reference packages recovered

2026-11-01 · ChatGPT · Documentation only; no application change or approval.

## Result

Four previously unresolved packages now have readable gazetteer bodies: **Mecca, Kufa, Shiraz and Nicaea / Iznik**. These are supported **representative settlement references**, not exact religious-event or building locations. Use the feature labels and limitations below. The source fidelity of each coordinate transcription is confirmed (C); placing a historical episode at that point is not established and is not authorized.

Baseline: [21-package register at bc7efce](https://github.com/mckayec/universe-sandbox/blob/bc7efce6fb75e5233a461fa7e41be0f1baf6fcfa/docs/universes/packs/abrahamic-world-religions/build-audit/q01-anchor-dispositions.csv). PR39 remains at `9cefeac89bfd23c4a7dde0e6589151608a3c6f2e`, open/unmerged when checked this run. That build still requires ABR01–04 fixes; no unchanged audit was repeated.

## Builder-ready reference packages

All source bodies below were opened on 2026-11-01. DMS-to-decimal values are calculated from the published degrees and minutes; extra digits are arithmetic formatting, not improved accuracy. Preserve the raw strings and source identifier in provenance.

| Requested anchor | Exact reference identity / source | Raw coordinate | Decimal for reference | Permitted label / limits |
|---|---|---|---|---|
| Mecca | [Getty TGN 7003870](https://www.getty.edu/vow/TGNFullDisplay?english=Y&find=&nation=&place=&subjectid=7003870), inhabited place under Saudi Arabia / Makkah al Mukarramah | N21 27 00; E039 49 00 | 21.450000, 39.816667 | **Mecca — approximate city reference.** Not the province, California namesake, Kaaba, a birthplace, or an exact pilgrimage/event venue. Minute-resolution gazetteer point. |
| Kufa | [Getty TGN 7018612](https://www.getty.edu/vow/TGNFullDisplay?english=Y&find=&nation=Lithuania&place=&subjectid=7018612), Al-Kūfah inhabited place under Iraq / An Najaf | N32 01 00; E044 23 00 | 32.016667, 44.383333 | **Kufa — approximate gazetteer town reference.** Not the Najaf governorate or Great Mosque. The inherited search parameter in this retrieved URL is not its country: the record body explicitly identifies Iraq. Do not treat this coarse historical-gazetteer point as a modern city centroid or event coordinate. |
| Shiraz | [Getty TGN 7002148](https://www.getty.edu/vow/TGNFullDisplay?english=Y&find=&nation=&place=&subjectid=7002148), inhabited place under Iran / Fārs | N29 38 00; E052 34 00 | 29.633333, 52.566667 | **Shiraz — approximate city reference.** This resolves the prior need to choose an unrelated Eram-garden proxy. It is not the Báb's house or the 1844 event location. |
| Nicaea / Iznik | [ToposText 404297PNic](https://topostext.org/place/404297PNic), Nicaea in Bithynia, modern Iznik, Bursa, Turkey | Latitude 40.426600; Longitude 29.716800 | 40.426600, 29.716800 | **Nicaea / Iznik — representative ancient-city point.** Not Nicomedia, French Nice, or a council building. Source decimal precision is not a survey-accuracy claim. |

For Nicaea, [Oxford Ashmolean Roman Provincial Coinage city 138](https://rpc.ashmus.ox.ac.uk/city/138) independently exposes the Bithynian identity and a nearby reference at 40.429, 29.7195; both publishers link Pleiades 511268. This is corroboration of city identity/locality, not proof of two independent underlying surveys. Do not average their points or substitute one without changing provenance.

The now-readable [UNESCO Iznik tentative-list entry 5900](https://whc.unesco.org/en/tentativelists/5900) also identifies Nicaea with Iznik, but its geographic field is `N40-21 40-37 E29-30 29-57`. That range-like string is **not** adopted as a single point or silently averaged.

## Najaf: access gap narrowed, feature-selection gate retained

[UNESCO tentative-list entry 5578](https://whc.unesco.org/en/tentativelists/5578/) is now readable. It supplies **Wadi Al-Salam Cemetery in Najaf**, N32 00 00 E44 18 59 (calculated 32.000000, 44.316389), submitted by Iraq's Permanent Delegation. This is a cemetery entry, not a city-centroid record or an independently surveyed Imam Ali tomb. **Conditional only:** do not import it as “Najaf” or “Imam Ali Shrine.” It can support a distinctly labelled cemetery reference only after deliberate feature selection; no such selection is made here. Tentative-list inclusion is not World Heritage inscription or independent confirmation of every religious/historical statement in its nomination.

## Remaining packages and current accounting

Combined with the baseline, there are now **11 supported reference packages and 10 unresolved packages**. The four recoveries are not four implemented pins. Najaf moves from inaccessible-source to conditional-feature evidence, without becoming supported for an ordinary city pin.

- **Six conditional:** Zurich / Grossmunster, Fayette / Whitmer, Baghdad, Hamburg, Philadelphia, Najaf. Prior feature/precision limitations remain; Najaf's specific update is above.
- **Four source-unavailable for an adopted point:** Karbala, Azusa Street, Xi'an / Beilin, Seesen.
- Seesen lead TGN 7096758 remained inaccessible; a different search result (1041195) could not be opened and was not adopted. Baghdad TGN 7002482 also failed to open. No search-only coordinate was promoted.
- Search results for a Karbala governorate and a Baghdad in Egypt were rejected as wrong geographic entities. No attempt was made to bypass any access restriction.
- The seven previously supported packages are inherited, not freshly reverified: Medina, Ephesus, Chalcedon / Kadikoy, Antioch, Alexandria, Acre prison and New York City.

This bounded pass does not settle every modern-versus-historical settlement extent, open every missing source, certify all religious claims, or approve a reduced map scope. Unresolved packages remain nonspatial until adequate evidence or an explicit scope disposition. Additional exact event/building pins always require their own evidence.

## Acceptance contract and verification

Claude can incorporate the four new **labelled representative settlement references** while preserving reference-only records, attributed event narratives and existing chronology/spoiler gates. Keep source IDs, raw coordinates and coarse-feature wording visible in provenance; never turn a representative point into surveyed route geometry or an exact episode location. Return the changed implementation SHA and per-package disposition for ChatGPT recheck. Q01 overall remains open for the ten packages above.

Validation performed: compared source names, type and country hierarchy against each requested entity; checked all numeric values within latitude/longitude ranges; independently calculated the four DMS pairs including the conditional cemetery; checked four recovered plus seven inherited plus ten unresolved equals all 21 requests. Nicaea stays as source decimals without fabricated conversion. No application, browser, GPU, build or test pass is claimed for this documentation-only work. Existing ABR01–04, technical/rendered, same-head signoff and owner-release gates remain unchanged. No merge, deployment or formal PR approval.


## Second bounded continuation — Baghdad and Philadelphia recovered

2026-11-01, after the four-package checkpoint above. **Two additional packages now have opened gazetteer bodies**, bringing the combined total to **13 supported references and eight unresolved packages**. Earlier 11/10 counts remain historical. This still counts research packages, not implemented pins.

| Requested anchor | Opened source and verified identity | Raw coordinate | Decimal conversion | Required label / restriction |
|---|---|---|---|---|
| Baghdad | [Getty TGN 7002482](https://www.getty.edu/vow/TGNFullDisplay?english=Y&find=&nation=&place=&subjectid=7002482), Baghdad inhabited place, Iraq / Mayorality of Baghdad; body opened 2026-11-01 | N33 21 00; E044 25 00 | 33.350000, 44.416667 | **Baghdad — approximate city reference.** Not the administrative region, Egyptian namesake, Rusafa property or 1863 garden. Do not inherit historical assertions from the gazetteer's note. |
| Philadelphia | [Getty TGN 7014406](https://www.getty.edu/vow/TGNFullDisplay?english=Y&find=&nation=&place=&subjectid=7014406), inhabited place under United States / Pennsylvania / Philadelphia county; body opened 2026-11-01 | N39 57 00; W075 09 00 | 39.950000, -75.150000 | **Philadelphia — approximate city reference.** Not Independence Hall, the county record TGN 1002782, or the Reconstructionist college's 1968 building. This replaces the need for an unrelated heritage-property proxy. |

Both transcriptions are source-confirmed (C), with minute-scale geographic resolution; neither certifies an exact historical venue. Initial Baghdad access attempts failed, but the opened English-display body subsequently supplied the identity, hierarchy and numeric fields. This is a recovered read, not a source restriction bypass. No quoted narrative or theological claim is imported.

### Useful leads retained without premature adoption

- **Hamburg:** TGN 7005289 city coordinates appear in search results, but both attempted full-record opens returned cache misses. No numeric point adopted from those results. The official [Hamburg mapping agency's Kleine Hamburg Statistik](https://www.hamburg.de/resource/blob/245726/531bf39b81977f7f75100a3c967b9172/d-kleine-hamburg-statistik-data.pdf) opened and distinguishes municipal reference (Rathaus), bounding-box center and geometric centroid. Its extracted coordinate table labels the 53-degree value “Länge” and nine-degree value “Breite”, so do not silently reverse axis labels or use a center as the 1818 Temple. Visual/source-axis verification and deliberate feature selection remain needed.
- **Zurich / Grossmunster:** [Warwick TowerCapsules CHZ0055](https://towercapsules.warwick.ac.uk/s/towercapsules/item/934) is a specific scholarly catalogue lead with church identity and numeric fields in search output. Both body opens failed. Keep the earlier official address evidence and the numeric hold; no search-only precision accepted.
- **Seesen:** the [city's synagogue page](https://www.stadtverwaltung-seesen.de/B%C3%BCrger/Synagoge-Seesen.php?object=tx%2C3000.25408.1) was located but body access returned a redirect-loop error. An official municipal result giving coordinates belongs to Bilderlahe, a different locality within Seesen municipality, and is not substituted for the town or Jacobstempel. Existing numeric hold remains.
- **Karbala:** direct TGN 7002537 body remained inaccessible. No governorate point or unverified shrine point substituted.
- **Azusa Street:** results for the separate city of Azusa and other streets were rejected. The secondary marker lead is not an official numeric parcel record and was not adopted. No point assigned to the former 312 Azusa Street building.
- **Xi'an / Beilin and Fayette / Whitmer:** no new adopted numeric source in this pass; their existing evidence limitations remain. A map-picker coordinate or a replica-home secondary point is not promoted.

### Current next actions

**Four conditional packages:** Zurich / Grossmunster, Fayette / Whitmer, Hamburg, Najaf. **Four without an adopted numeric source:** Karbala, Azusa Street, Xi'an / Beilin, Seesen. These eight remain open; this continuation does not request or imply owner approval to drop them.

Claude can incorporate the now-six recovered packages under their exact representative-feature labels and preserve all previous restrictions, with per-package mapping and changed-head recheck. ABR01–04, same-head technical/rendered checks and owner release gates remain separate. No LDS files or routing were changed by this continuation.

Validation: the two new DMS conversions independently calculated as 33.350000 / 44.416667 and 39.950000 / -75.150000; negative western longitude and coordinate ranges checked. Six recovered plus seven inherited plus eight unresolved equals 21. No application or browser tests were run or claimed.


## 2026-11-06 return questions — three city packages recovered

Reviewed build: PR #39, `pack/abrahamic-world-religions`, **01df0f2ec7f007a2b37a5712b279a9b5e930e299**. This section answers all **8/8** questions in [fixing-round2.md](../fixing-round2.md). Earlier dated counts remain historical.

**Current accounting: 16/21 supported reference packages; 5/21 unresolved requested features.** At the reviewed implementation, 12 supported packages are implemented, Antioch is held without a corresponding narrative record, and the three newly supported city references below are not yet built. There are 22 total implemented markers (ten prior heritage markers plus twelve Q01 markers). Neither candidate coordinates nor a recovered page are counted as implemented pins.

### Three builder-ready city references

All three source bodies were opened on 2026-11-06. Confidence **C for record identity and numeric transcription**, not exact historical-event location. Keep raw DMS and source identifiers in provenance. Six decimal places below express conversion, not positional accuracy.

| Existing card / requested package | Opened source, identity and raw coordinates | Decimal latitude, longitude | Exact modern label and required caveat |
|---|---|---|---|
| `chp-zurich` / Zurich–Grossmünster | [Getty TGN 7007302](https://www.getty.edu/vow/TGNFullDisplay?english=Y&find=&nation=&place=&subjectid=7007302), inhabited place under Switzerland / Zürich canton; N47 22 00, E008 33 00 | 47.366667, 8.550000 | **Zurich: approximate city reference (Getty TGN 7007302)**. “Representative city reference, not Grossmünster, Felix Manz’s house, or the exact place of the 1525 baptism. Not Zürich canton or Zurich in the Netherlands.” |
| `jud-hamburg` / Hamburg | [Getty TGN 7005289](https://www.getty.edu/vow/TGNFullDisplay?english=Y&find=&nation=&place=&subjectid=7005289), inhabited place under Germany / Hamburg state; N53 33 00, E010 00 00 | 53.550000, 10.000000 | **Hamburg: approximate city reference (Getty TGN 7005289)**. “Representative city reference, not the 1818 Temple, a warehouse heritage component, or the extent of Hamburg state.” |
| `xian` / Xi’an–Beilin | [Getty TGN 7001810](https://www.getty.edu/vow/TGNFullDisplay?english=N&find=&nation=Togo&place=&subjectid=7001810), inhabited place under Zhongguo / Shaanxi; N34 15 30, E108 55 43 | 34.258333, 108.928611 | **Xi’an: approximate city reference (Getty TGN 7001810)**. “Representative city reference, not the Beilin museum building, the stele’s original erection point in 781, or a surveyed arrival location in 635. Historical and modern city extents are not equated.” |

The inherited `nation=Togo` search parameter is not Xi’an’s hierarchy: the opened record explicitly identifies Shaanxi, China. Do not import its broad religious/history note, aliases or ancient-boundary claims. Retain the existing Nanjing distinction and the stele’s inscription-date versus reported-arrival-date wording.

**Zurich feature decision:** accept Claude’s offered city-reference alternative. [Warwick TowerCapsules CHZ0055](https://towercapsules.warwick.ac.uk/s/towercapsules/item/934) also now opens and gives Grossmünster longitude 8.54397, latitude 47.37010. This resolves access to that church record, but does not locate the Manz-house baptism. The current card and `che-anabaptist` concern the city/house episode; use the city package above, not a church pin with the episode implicitly attached. The church point is not an additional adopted Q01 marker.

### Known gaps — precise answers to the other five questions

These gaps block their own exact requested markers and full Q01 closure; **they do not block building the three supported city references**. Keep the existing nonspatial content. No blanket omission or release approval is given, and these gaps are not represented as complete research.

| Package | Evidence checked this pass and answer | Next bounded evidence or disposition |
|---|---|---|
| Fayette / Whitmer | **Keep nonspatial; do not promote the proposed low-confidence replica point.** The opened [official site](https://www.churchofjesuschrist.org/learn/locations/whitmer-farm-church-organization-site?lang=eng) supplies address and reconstructed-home identity, not a readable numeric survey. Its linked map was inaccessible behind a consent redirect. The opened [Berge excavation report](https://byustudies.byu.edu/article/archaeology-at-the-peter-whitmer-farm-seneca-county-new-york), location paragraph, describes a southeast offset and appears to reverse latitude/longitude labels; do not silently repair that into an exact point. | A readable identified numeric farm/replica record, or an explicit documented decision accepting an uncertain **replica** reference. A map viewport centre, address geocode or inferred offset is not such evidence. |
| Najaf | **Hold; no new card required merely to consume a coordinate.** [UNESCO tentative-list 5578](https://whc.unesco.org/en/tentativelists/5578/) reopened: cemetery N32 00 00 E44 18 59. It can support a distinctly named Wadi al-Salam cemetery reference if a sourced cemetery association is deliberately added; it cannot stand for Najaf city or certify the Imam Ali tomb. No Najaf narrative entry exists at the audited head (the Kufa caveat mentions Najaf governorate only). | Deliberate feature/content selection, or an explicit deferred-package disposition. Tentative-list inclusion is not World Heritage inscription. Do not add new theological claims from the nomination. |
| Karbala | **Getty access remains unavailable; keep the current card nonspatial for this handoff.** [GeoNames 94824](https://www.geonames.org/94824/karbala.html) does open: populated-place seat in Iraq, 32.61603, 44.02488. Its edit history includes coordinate movements, so this is a useful approximate-city candidate, not independently surveyed battlefield/shrine evidence. [Iranica’s opening](https://www.iranicaonline.org/articles/karbala/) corroborates city identity and distinguishes the battle plain, but does not supply a matching numeric coordinate. | Corroborate the candidate against a readable authoritative numeric city record, or explicitly adopt it at its limited gazetteer confidence. Candidate recorded, **not adopted**; Getty 7002537 and governorate 1001343 are not interchangeable. |
| Azusa Street | **A labelled Los Angeles city context is supportable, but it does not resolve the mission parcel.** Opened [Getty TGN 7023900](https://www.getty.edu/vow/TGNFullDisplay?english=Y&find=&nation=&place=&subjectid=7023900) is Los Angeles inhabited place, California: N34 03 00 W118 14 00, calculated 34.050000, -118.233333. | If useful, propose a separate **“Los Angeles: approximate city reference (Getty TGN 7023900)”** with “Not the former 312 Azusa Street mission parcel, a surviving mission building, Los Angeles County, or the separate city of Azusa.” Preserve `chp-azusa` as the historical-address card; do not attach those city coordinates to a marker titled “Azusa Street mission.” The requested exact feature remains unresolved and is not added to the supported numerator. |
| Seesen | **Keep nonspatial.** TGN 7096758 and alternative 1041195 bodies remained inaccessible; no search-only coordinates adopted. The opened [Lower Saxony mapping authority](https://lgln-geodaten.niedersachsen.de/startseite/geodaten_karten/topographische_geodaten_aus_atkis/ortsverzeichnis/ortsverzeichnis-niedersachsen-atkis-144316.html) documents a named-place CSV in ETRS89/UTM32N, but its linked OpenGeoData portal supplied no readable row. | Obtain the exact Seesen town row and transform its explicitly stated CRS, or a readable town/temple-memorial record. Do not substitute another locality, a railway station, municipality extent, or unverified TGN search point. |

### Implementation acceptance and research cap

Next unit for Claude: incorporate the **three** city references with the existing card IDs, layers and historical descriptions preserved, required provenance/caveats visible, and affected Chronicle links updated. Return a per-ID mapping, actual head SHA and focused/full validation. Preserve all twelve accepted Q01 markers and ABR01–04 fixes. Antioch remains an explicit held supported package; do not invent a narrative solely to add it.

Package the five remaining questions above as Known gaps / explicit per-package holds under R3–R4. Do not restart an unbounded coordinate search or silently mark Q01 complete. Any proposal to defer a requested feature permanently or accept a lower-confidence replacement must be explicit and reviewed; if it needs Mckay’s scope decision, route one concrete decision rather than repeating a generic “need more research” loop.

No source restriction was bypassed. Source-based web research was used; the separate Deep Research product was not invoked. This is a documentation-only continuation, not code implementation, rendered validation, canon sign-off or release approval.
