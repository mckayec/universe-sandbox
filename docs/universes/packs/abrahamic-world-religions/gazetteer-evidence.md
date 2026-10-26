# Representative gazetteer evidence

Research handoff, checked 2026-10-26. This bounded subset adds **eight heritage-reference anchors**, not eight newly located historical events. All have `parent:earth`, pack-root `first:1`; module labels are descriptive. The companion [CSV](gazetteer-evidence.csv) preserves source DMS coordinates and machine-readable decimals. These are documentation candidates, not application changes.

## Geometry and identity contract

Each `gaz-*` ID denotes the named UNESCO property/component, with a `context-for` link to the dossier place IDs where supplied. It is **not an alias/merge** of the whole city, island or region. Leave those contextual records unlocated unless separately supported. Two new standalone heritage anchors (Canterbury and Bethlehem) have no invented dossier place ID. A map card must say “heritage reference”; it must not silently convert a contextual event into an event pin. Historical event dates and claims continue to use the dossier sources; modern coordinates supply no ancient date, continuous settlement claim or exact event site.

Coordinates are transcribed from each official UNESCO World Heritage Centre **Geographical data** table, for the specified component rather than a guessed city centre. Decimal conversion is signed degrees + minutes/60 + seconds/3600, rounded to six decimal places solely for interoperability. Source precision is retained in DMS; decimal digits do not imply survey accuracy. UNESCO publishes Istanbul longitude as `E28 58 60`; its normalized equivalent is `E28 59 00`, not a different location. Southern latitude at Zanzibar is negative. Points do not encode property polygons or political sovereignty.

## Anchors

| Stable ID / component | Original latitude / longitude | Decimal latitude, longitude | Context and permitted scope | Evidence |
|---|---|---|---|---|
| `gaz-rome-centre` / 91quater-001 | N41 53 24.8 / E12 29 32.3 | 41.890222, 12.492306 | **Historic Centre of Rome**. Context: chp-rome. City heritage context; not a burial location or the room of the 1965 declaration. | [UNESCO maps](https://whc.unesco.org/en/list/91/maps/); confirmed published coordinate |
| `gaz-istanbul-sultanahmet` / 356bis-001 | N41 0 30 / E28 58 60 | 41.008333, 28.983333 | **Istanbul: Sultanahmet heritage area**. Context: chp-constantinople. Modern heritage reference for historical Constantinople; not a council or excommunication event point. | [UNESCO maps](https://whc.unesco.org/en/list/356/maps/); confirmed published coordinate |
| `gaz-wittenberg-luther-hall` / 783-003 | N51 51 52.60 / E12 39 9.80 | 51.864611, 12.652722 | **Wittenberg: Luther Hall**. Context: chp-wittenberg. Named Wittenberg component; not the thesis-posting door. The serial property also contains Eisleben sites. | [UNESCO maps](https://whc.unesco.org/en/list/783/maps/); confirmed published coordinate |
| `gaz-cairo-historic` / 89-002 | N30 02 39.9 / E31 15 43.7 | 30.044417, 31.262139 | **Historic Cairo: heritage component**. Context: ISP09;chp-cairo. Component covers Mosque of Ahmed Ibn Tulun, Citadel area, Fatimid nucleus and necropolis; not an exact succession meeting or OAIC conference venue. | [UNESCO maps](https://whc.unesco.org/en/list/89/maps/); confirmed published coordinate |
| `gaz-ghardaia-ksar` / 188-005 | N32 29 19.78 / E3 40 27.22 | 32.488828, 3.674228 | **Ksar Ghardaïa**. Context: ISP12. One settlement component within M’zab; not the entire valley or the origin point of all Ibadis. | [UNESCO maps](https://whc.unesco.org/en/list/188/maps/); confirmed published coordinate |
| `gaz-zanzibar-stone-town` / 173rev | S6 9 47.016 / E39 11 21.012 | -6.163060, 39.189170 | **Stone Town of Zanzibar**. Context: ISP11. Town heritage property; not the island boundary or a documented individual scholar’s travel endpoint. | [UNESCO maps](https://whc.unesco.org/en/list/173/maps/); confirmed published coordinate |
| `gaz-canterbury-cathedral` / 496-001 | N51 16 48.00 / E1 4 59.60 | 51.280000, 1.083222 | **Canterbury Cathedral**. Context: standalone heritage reference. Standalone heritage anchor for Church of England institutional context; no new founding event or universal Anglican headquarters inference. | [UNESCO maps](https://whc.unesco.org/en/list/496/maps/); confirmed published coordinate |
| `gaz-bethlehem-nativity` / 1433 | N31 42 15.67 / E35 12 27 | 31.704353, 35.207500 | **Bethlehem: Nativity church and pilgrimage route**. Context: standalone heritage reference. Standalone commemorative heritage anchor. Christian birth tradition is distinguished from proof of the exact historical birthplace. | [UNESCO maps](https://whc.unesco.org/en/list/1433/maps/); confirmed published coordinate |

Canterbury’s institutional association is supported by UNESCO’s [property description](https://whc.unesco.org/en/list/496/), which identifies its Church of England role. This does not make every Anglican province subject to one administrative authority. Bethlehem’s [property description](https://whc.unesco.org/en/list/1433/) explicitly frames the site through Christian tradition; the heritage listing does not independently authenticate a birth point. M’zab’s [property description](https://whc.unesco.org/en/list/188/) supports its association with Ibadi culture; no exact foundation date is imported here. Confidence is confirmed for what these institutional sources report, not independent archaeological certification of every historical narrative.

## Reused anchors and reference-only remainder

Reuse `jud-jerusalem` from [Judaism places](judaism-research.md) for the **city-level context** of `chp-jerusalem` and `ISP04`, retaining its existing UNESCO JU21 citation and caveats. Do not add another Jerusalem point or identify the Old City point with any specific sacred building/event. `jud-babylon` remains the existing archaeological-city anchor with JU22; it is not an alias for wider Babylonia or `chp-east-syriac-region`. Neither coordinate is duplicated in the CSV.

All remaining dossier places remain valid reference-only cards with null geometry. In particular Mecca, Medina, Hira, Karbala, Kufa, Oman, Yemen, Ifriqiya, Djerba, Nafusa, Qadian, Deoband, Bareilly and Najd receive no guessed point in this subset; neither do Nicaea, Ephesus, Chalcedon or modern Christian formation sites absent from the table. Route/network lines must not use these heritage anchors as purported exact itinerary endpoints. A bounded representative map is usable alongside the fuller searchable historical network; it is not a complete gazetteer or missing-event claim.

## Source register and validation

All sources below: **UNESCO World Heritage Centre**, official World Heritage List, undated live *Maps / Geographical data* pages, accessed **26 October 2026**. The component identifier in the table/CSV is the exact evidence locator. Property citation labels and URLs:

1. *Rome historic centre and associated Holy See properties* (listing 91), [list 91 maps](https://whc.unesco.org/en/list/91/maps/).
2. *Historic Areas of Istanbul*, [list 356 maps](https://whc.unesco.org/en/list/356/maps/).
3. *Luther Memorials in Eisleben and Wittenberg*, [list 783 maps](https://whc.unesco.org/en/list/783/maps/).
4. *Historic Cairo*, [list 89 maps](https://whc.unesco.org/en/list/89/maps/).
5. *M’Zab Valley*, [list 188 maps](https://whc.unesco.org/en/list/188/maps/); accompanying official property description cited above.
6. *Stone Town of Zanzibar*, [list 173 maps](https://whc.unesco.org/en/list/173/maps/).
7. *Canterbury Cathedral, St Augustine’s Abbey, and St Martin’s Church*, [list 496 maps](https://whc.unesco.org/en/list/496/maps/); accompanying official property description cited above.
8. *Birthplace of Jesus: Church of the Nativity and the Pilgrimage Route, Bethlehem*, [list 1433 maps](https://whc.unesco.org/en/list/1433/maps/); accompanying official property description cited above.

Validation: eight unique anchor IDs and eight distinct UNESCO components; all sixteen decimal values recomputed from retained DMS and checked within geographic bounds; eight official HTTPS coordinate-source URLs; all gates equal 1. Existing dossier context IDs checked separately. This validates transcription and the selected bindings, not all pack coordinates, prose links, source histories or archaeological claims. No source-access blocker for this subset; omitted geometry is intentional and must remain visibly reference-only.
