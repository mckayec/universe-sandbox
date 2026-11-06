# Final audit checkpoint — Abrahamic world religions

> Current checkpoint: final return at `d95eaf28e50f6fe005e99b4b3e289d8b906b1fc3`; D02-C1 remains open. See the final appended section; earlier evidence retains its original revisions and counts.

2026-11-06 · ChatGPT · PR [#39](https://github.com/mckayec/universe-sandbox/pull/39), branch `pack/abrahamic-world-religions`, reviewed implementation **`ee700d153e91d854e583eb867dd40d0cc21ecfec`**, parent `9cefeac89bfd23c4a7dde0e6589151608a3c6f2e`.

## Result

**ABR01–04: 4/4 resolved across 12/12 affected records.** **24/24 targeted tests pass.** The final deterministic sample received **20/20 source checks**, with no new content finding. The five previously source-unavailable inventory records now have accessible supporting passages.

This closes the returned correction unit and the final sample. **It does not close Q01 or approve the finished atlas.** Q01 still has 13/21 supported reference-coordinate packages and 8/21 unresolved packages; these are research dispositions, not newly implemented pins. Technical/rendered acceptance and release approval remain separate.

Prior [build audit](https://github.com/mckayec/universe-sandbox/blob/bc7efce6fb75e5233a461fa7e41be0f1baf6fcfa/docs/universes/packs/abrahamic-world-religions/audit-build.md) and [313-record conformity pass](https://github.com/mckayec/universe-sandbox/blob/bc7efce6fb75e5233a461fa7e41be0f1baf6fcfa/docs/universes/packs/abrahamic-world-religions/build-audit/copy-comparison.md) remain the evidence for unchanged copy. They are not represented as a new full primary-source reading in this run.

## Returned fixes

| Finding | Affected records | Exact-head disposition |
|---|---|---|
| ABR01, Medium | ch-baptist; ch-pentecostal | Resolved, 2/2. Unsupported 1630/1930 upper bounds removed; both nodes are undated for filtering, with source-worded early-century labels and existing ongoing flags retained. Fresh [WCC Baptist](https://www.oikoumene.org/church-families/baptist-churches) opening paragraphs retain the 1609/1612 distinction; fresh [WCC Pentecostal](https://www.oikoumene.org/church-families/pentecostal-churches) opening/history paragraphs support early twentieth-century development and Azusa 1906 without a universal 1930 bound. |
| ABR02, Medium | isl05–isl08 | Resolved, 4/4. Shared relation omits the false denial of classification. The two specific blurbs correctly attribute Ja'fari and Zaydi classification to [Amman Message, point 1](https://ammanmessage.com/the-three-points-of-the-amman-message-v-1/), freshly opened. Parent, distinct school/tradition identities and notSame notes remain. The source's theological judgments are not adopted as the atlas's verdict. |
| ABR03, Medium | jud-ananites; ch-early-communities; ch-stone-campbell; ch-strang-movement | Resolved, 4/4. Numeric emergence/point fields removed and undated set; original source-worded context/episode dates remain. No ongoing flag was invented for these four historical nodes. Actual normTree/timeOk checks no longer hide them at the previously erroneous later-year cutoffs. Merger structure, early-community Jerusalem reference and the separate Second Temple span are unchanged. This removal is not a new claim about the lifetime of any movement. |
| ABR04, Medium | ISE07; ISE11 | Resolved, 2/2. Numeric when removed, qualified whenText retained. Events survive 942/1131/1500 filters, retaining belief attribution and the Cairo reference where present. The [Daftary St Andrews section on the late Fatimid period](https://www.saet.ac.uk/Islam/IsmailiShiism) also freshly confirms the after-1130 split used by ISE11. |

Counting clarification: **six nodes become numerically undated**, four other nodes receive legal-school wording changes, and two events become text-dated only. The earlier status phrase “8 nodes undated” conflated the six nodes and two events; it is not the implementation count.

## Independent implementation verification

Read the complete four-file fix diff, actual three changed data parts, unchanged assembler/Encounters part, targeted tests, validator and real layers/tree helpers at the exact head. Independent evaluated-JSON comparison against the parent confirms exactly the ten named nodes and two named events changed. All world/site data, 107 codex cards and 27 explicit links are identical. Totals remain 109 nodes, 60 events, 10 sites and 107 codex cards; together with links these make 313 inventory records.

In an isolated local fixture populated with exact-head files and its two CSV fixtures, Node 24.22.1 ran:
`node --experimental-strip-types --test tests/atlas-abrahamic.test.ts`

**24/24 pass**, including all three new regression tests. A separate negative-control fixture used the parent's three data parts with the new tests and unchanged helpers: **3/3 new tests fail**, for the intended numeric bounds, relation text and narrowed event date. The pass therefore does not rely solely on the builder's report. The tests execute the actual normTree/timeOk code; they do not establish rendered UI quality.

Inspected [Actions run 42148297929](https://github.com/mckayec/universe-sandbox/actions/runs/42148297929) at ee700d1: format, build, unit, distribution and standalone-page job steps succeeded; deploy skipped. Builder-reported 118/118 full tests and 12×2 pages were not locally rerun. No independent browser, screenshot, GPU or performance validation was performed here. The separate simulator browser-smoke suite is not shown as passing by these results.

## Final source sample: 20/20

Selection was fixed before source checking. Pool: 313 records (109 nodes, 27 explicit links, 60 events, 10 sites, 107 codex cards). Seed: `ee700d153e91d854e583eb867dd40d0cc21ecfec:AUDIT_CHECKLIST-4`. Rank by ascending SHA-256 hex of UTF-8 `seed + "|" + key`; take the first 20 without replacement. Node/event keys use IDs; site keys include world; codex keys include section; link keys include zero-based position and endpoints. [audit-final-sample.json](audit-final-sample.json) preserves every selected object and rank. This reproducible sample is not statistical certification of the whole atlas.

All source bodies below were opened on 2026-11-06. “Pass” means the displayed limited claim is supported by the specified passage and retains its attribution/uncertainty, not that every religious claim is independently historical fact.

| Rank / key | Opened passage and result |
|---|---|
| 1 · node:jud-reform-uk-historical | **Pass.** [Liberal Judaism official transfer notice](https://www.liberaljudaism.org/) identifies the two UK organizations and effective 1 January 2026 merger, separately from December 2025 launch notices. |
| 2 · codex:places:jud-seesen | **Pass.** [URJ historical essay, opening](https://reformjudaism.org/beliefs-practices/what-reform-judaism/history-reform-judaism-and-look-ahead-search-belonging) gives Jacobson, Seesen and 1810. The card does not adopt a universal first claim or a coordinate. |
| 3 · node:jud-shalom-center | **Pass.** [ALEPH Our Story, founder/history passage](https://www.aleph.org/our-story) names both merger participants in 1993. The node does not infer cessation of all independent activity. |
| 4 · codex:places:ISP01 | **Pass.** [Met, Early Life and The Hijra](https://www.metmuseum.org/learn/educators/curriculum-resources/art-of-the-islamic-world/unit-one/the-prophet-muhammad-and-the-origins-of-islam) supports the Mecca setting and departure to Medina. No precise event point is asserted. |
| 5 · codex:people:jud-moses | **Pass.** [Exodus 19:3–8, Mechon-Mamre](https://mechon-mamre.org/p/pt/pt0219.htm) portrays Moses carrying the covenant message between God and people. The role remains narrative. |
| 6 · node:jud-orthodox | **Pass.** [Pew's 2015 report on its 2013 US survey](https://www.pewresearch.org/religion/2015/08/26/a-portrait-of-american-orthodox-jews/), introductory subgroup paragraphs, distinguishes Haredi and Modern Orthodox. The pack explicitly avoids an exhaustive global taxonomy or current population claim. |
| 7 · event:che-nicaea | **Pass.** [Harvard timeline, 325 entry and preceding canon-development entries](https://pluralism.org/christianity) support date, convener and pre-existing Christianity. [John D. Meade, Nicaea and the Canon in History](https://textandcanon.org/the-council-of-nicea-and-the-biblical-canon/) discusses pre/post-council canon lists and the absence of a council decision establishing the biblical canon. His religious apologetic conclusions are not adopted. |
| 8 · node:ch-millerite-context | **Pass.** [Adventist official history, Millerite and beginnings sections](https://adventist.org/identity/history) supports nineteenth-century antecedent context. The node declines to infer universal institutional parentage. |
| 9 · codex:people:ISH04 | **Pass.** [Daftary and Nanji, What is Shi'a Islam?, printed p.3](https://www.iis.ac.uk/wp-content/uploads/2024/10/whatis-shia-islam.pdf) names Fatima as Muhammad's daughter and Ali's wife; [Daftary's St Andrews opening history](https://www.saet.ac.uk/Islam/IsmailiShiism) corroborates. No other doctrinal assertion is imported. |
| 10 · node:ist11 | **Pass.** [Daftary, late Fatimid period](https://www.saet.ac.uk/Islam/IsmailiShiism) supports after-1130 Hafizi allegiance and its historical scope. |
| 11 · node:jud-aleph | **Pass.** [ALEPH founder/history passage](https://www.aleph.org/our-story) supports the explicitly attributed P'nai Or/Shalom Center merger and 1993. An organization is not equated with all Renewal participation. |
| 12 · codex:places:ISP03 | **Pass.** [Met, Divine Revelations](https://www.metmuseum.org/learn/educators/curriculum-resources/art-of-the-islamic-world/unit-one/the-prophet-muhammad-and-the-origins-of-islam) supplies Hira near Mecca. The card calls this a revelation tradition and supplies no cave coordinate. |
| 13 · event:ISE15 | **Pass.** [USCIRF 2026 Pakistan report, printed p.41, Background](https://www.uscirf.gov/sites/default/files/2026-03/USCIRF%202026%20Annual%20Report%20Pakistan.pdf) explicitly records the 1974 constitutional classification. The card separates state classification from religious self-identification. |
| 14 · codex:journeys:ch-spread-anglican | **Pass.** [WCC Anglican opening two paragraphs](https://www.oikoumene.org/church-families/anglican-churches) support mission expansion and later provincial autonomy. No surveyed route or present officeholder information is borrowed. |
| 15 · codex:places:baghdad | **Pass.** [Bahá'í World News Service Brief history, Baghdad/1863 paragraph](https://news.bahai.org/media-information/brief-history) supports the attributed announcement location/year. No garden coordinate or archaeological Babylon identification follows. |
| 16 · node:jud-reform-progressive | **Pass.** [Harvard Modern Jewish Culture, Reform paragraphs](https://pluralism.org/modern-jewish-culture) supports nineteenth-century Germany and Hamburg 1818; [URJ opening](https://reformjudaism.org/beliefs-practices/what-reform-judaism/history-reform-judaism-and-look-ahead-search-belonging) supplies Seesen 1810 and subsequent spread. Scope stays a family of movements. |
| 17 · node:ism01 | **Pass.** [Official Ahmadiyya Community opening](https://www.alislam.org/ahmadiyya-muslim-community/) supports self-name, Muslim identity, founder and 1889; [USCIRF p.41](https://www.uscirf.gov/sites/default/files/2026-03/USCIRF%202026%20Annual%20Report%20Pakistan.pdf) supports the separately attributed state classification. No theological verdict or current membership total is adopted. |
| 18 · event:jud-e07 | **Pass.** [Harvard Kabbalah and Hasidism, Hasidism paragraphs](https://pluralism.org/kabbalah-and-hasidism) supports eighteenth-century Eastern European development around the Baal Shem Tov and disciples. The card avoids an exact founding day and additional biographies. |
| 19 · node:ist02 | **Pass.** [Harvard Sunni Muslim glossary](https://pluralism.org/sunni-muslim) supports authority/consensus wording. [Daftary and Nanji printed p.3](https://www.iis.ac.uk/wp-content/uploads/2024/10/whatis-shia-islam.pdf) supports gradual coalescence after the succession debate; the card does not posit complete modern denominations in 632. |
| 20 · node:ch-stone-campbell | **Pass.** [Disciples official chronology](https://disciples.org/our-identity/history-of-the-disciples/important-dates-in-disciple-history/) distinguishes 31 December 1831 handshake and 1 January 1832 union. [Early History](https://disciples.org/our-identity/history-of-the-disciples/) supports unity/restoration context. ABR03's removal of a misleading numeric movement span is verified above. |

## Recovered access and evidence limits

The previously inaccessible CH14 WCC Pentecostal page and IS24 USCIRF Pakistan PDF both opened successfully. Against their actual passages, the five prior access-limited records are now supported: ch-revival-contexts; the ch-pentecostal → ch-evangelical overlapping-affiliation link; che-azusa; chp-azusa; ISE15. For the link, identify by endpoints and type: it is zero-based index 13 in the assembled pack; the earlier inventory's “link:14” should not be used as an array offset. WCC's roots, 1906 mission and Evangelical-affiliation paragraphs support the limited copy. The street address is not a surveyed coordinate or proof of a surviving building. Recovery of source access does not close Q01's Azusa point.

The Taylor & Francis Nicaea article body returned 403; search excerpts were not treated as an opened full article. The opened Meade explanation supplies the relevant additional evidence instead. No restriction was bypassed. PDF checks used text extraction, not visual manuscript inspection. No separate Deep Research product was used. Neither this sample nor access recovery claims a new examination of all original scriptures, archives or manuscripts.

The full evaluated comparison shows no newly imported uncertain coordinates, guessed routes or unlabeled theological claim. Existing ten pins and 59 nonspatial place cards are unchanged. The prior safeguards for attributed tradition, scholarship, organizational self-description, model chronology, non-additive populations and historical reference features remain. Unresolved Q01 candidate coordinates stay outside the implemented pack.

## Remaining blockers and next bounded handoff

**Canon: not approved for final acceptance.**

1. **Q01 map-completeness/disposition gate remains open.** The [current coordinate continuation](build-audit/q01-coordinate-continuation-20261101.md) supports 13/21 reference packages; eight remain unresolved (Zurich/Grossmunster, Fayette/Whitmer, Hamburg, Najaf, Karbala, Azusa Street, Xi'an/Beilin, Seesen). This audit does not approve dropping them, importing guessed points or replacing an exact venue with an unlabeled city/heritage proxy.
2. **Claude's next unit:** incorporate or explicitly disposition the supported packages under their exact feature/precision restrictions, and return per-package mapping plus the changed implementation SHA. Preserve unresolved packages as nonspatial with precise outstanding evidence questions; do not claim all 21 completed. The implementation currently still has ten pins. ChatGPT must recheck new incorporation and continue the remaining source questions when handed back.
3. **Technical/visual and release gates remain open:** exact-head validator/checks, successful required browser-smoke evidence, finished rendered surfaces and viewport/performance evidence, Claude's technical sign-off, then Mckay's release approval. Successful CI steps alone are not that sign-off.

Under PROMPTS §4, hand back **fixing / claude** for the remaining Q01 implementation/disposition unit; do not repeat the closed ABR01–04 unit or this unchanged-head 20-item sample. No new content finding was added, and no merge, deployment or release approval is given.


## 2026-11-06 — Q01 round-2 implementation recheck and source answers

**Audited head: `01df0f2ec7f007a2b37a5712b279a9b5e930e299`**, PR [#39](https://github.com/mckayec/universe-sandbox/pull/39), branch `pack/abrahamic-world-religions`; parent `ee700d153e91d854e583eb867dd40d0cc21ecfec`. This section supersedes the earlier “ten implemented pins / 13 supported packages” checkpoint for current accounting, preserving the earlier audit and source sample as history.

**Returned incorporation accepted: 12/12 markers; 7/7 changed event links; no new High/Medium content finding in this delta.** All twelve numeric source bodies were reopened. ABR01–04 remain closed (4/4 findings, 12/12 affected records). Independent exact-head focused tests: **25/25 pass**. This is a completed return-review unit, not final canon approval.

### Every implemented package checked

Coordinates are latitude, longitude. DMS conversions agree within the implementation’s six-decimal rounding; source-decimal values are copied without invented accuracy. Each marker has the source ID, raw coordinate string, reference caveat and feature-specific limits in its notes.

| Pack ID | Implemented coordinates | Reopened source / identity | Disposition |
|---|---|---|---|
| ISP01 | 21.450000, 39.816667 | [Getty 7003870](https://www.getty.edu/vow/TGNFullDisplay?english=Y&find=&nation=&place=&subjectid=7003870), Mecca city, N21 27 00 E039 49 00 | Pass; not province, Kaaba, birthplace or exact episode. |
| ISP02 | 24.500000, 39.583333 | [Getty 7003869](https://www.getty.edu/vow/TGNFullDisplay?english=Y&find=&nation=&place=&subjectid=7003869), Medina city, N24 30 00 E039 35 00 | Pass; not mosque or Hijra arrival point; no gazetteer calendar claims imported. |
| ISP06 | 32.016667, 44.383333 | [Getty 7018612](https://www.getty.edu/vow/TGNFullDisplay?english=Y&find=&nation=Lithuania&place=&subjectid=7018612), Al-Kūfah town under Iraq / Najaf, N32 01 00 E044 23 00 | Pass; coarse gazetteer reference, explicitly not revolt site, mosque or modern city centre. Clean-parameter URL failed; the previously recorded search URL opened the correct Iraqi record. |
| shiraz | 29.633333, 52.566667 | [Getty 7002148](https://www.getty.edu/vow/TGNFullDisplay?english=Y&find=&nation=&place=&subjectid=7002148), Shiraz city, N29 38 00 E052 34 00 | Pass; not Báb’s house or 1844 location. |
| baghdad | 33.350000, 44.416667 | [Getty 7002482](https://www.getty.edu/vow/TGNFullDisplay?english=Y&find=&nation=&place=&subjectid=7002482), Baghdad city, N33 21 00 E044 25 00 | Pass; not region, Rusafa, 1863 garden, Egyptian namesake or Babylon. |
| acre | 32.923611, 35.068889 | [UNESCO 1220-007](https://whc.unesco.org/en/list/1220/maps/), Prison, N32 55 25 E35 4 8 | Pass; “Prison at Acre” in modern label, not city extent, route or Haifa. |
| chp-nicaea | 40.426600, 29.716800 | [ToposText 404297PNic](https://topostext.org/place/404297PNic), Bithynian Nicaea / Iznik | Pass; representative city, not council building, Nicomedia or Nice. |
| chp-ephesus | 37.941389, 27.340556 | [UNESCO 1018rev-002](https://whc.unesco.org/en/list/1018/maps/), Ancient City, N37 56 29 E27 20 26 | Pass; not council venue, Artemis component or House of Mary. |
| chp-chalcedon | 40.983400, 29.025800 | [ToposText 410290PCha](https://topostext.org/place/410290PCha), Chalcedon near Kadikoy | Pass; **accept copy change** to “No boundary is assumed.” The opened source supplies Kadikoy locality; the marker does not assert identical ancient/modern boundaries or the 451 venue. |
| jud-alexandria | 31.182000, 29.897000 | [ToposText 312299PAle](https://topostext.org/place/312299PAle), Alexandria, Egypt | Pass; not a surveyed community, teaching or patriarchal venue. |
| jud-new-york | 40.700000, -74.000000 | [Getty 7007567](https://www.getty.edu/vow/TGNFullDisplay?english=Y&find=&nation=&place=&subjectid=7007567), New York city, N40 42 00 W074 00 00 | Pass; western sign correct; not state or JTS building. |
| jud-philadelphia | 39.950000, -75.150000 | [Getty 7014406](https://www.getty.edu/vow/TGNFullDisplay?english=Y&find=&nation=&place=&subjectid=7014406), Philadelphia city, N39 57 00 W075 09 00 | Pass; not county, Independence Hall or 1968 college building. |

**Antioch hold accepted as a documented hold, not a completed marker.** Evaluated pack has no corresponding narrative record. An implementation comment names Antioch; that does not constitute narrative content. A coordinate package does not justify inventing an association.

### Independent comparison and testing

Read the complete six-file [parent-to-head diff](https://github.com/mckayec/universe-sandbox/compare/ee700d153e91d854e583eb867dd40d0cc21ecfec...01df0f2ec7f007a2b37a5712b279a9b5e930e299), actual assembler/four data parts, tests, validator, registry and layer/tree helpers at the exact head. Retrieved 13 target/dependency blobs and five parent data blobs; local Git blob SHA checks match **18/18**.

Evaluated JSON comparison establishes:

- All **109/109 nodes**, **27/27 explicit tree links**, **10/10 old sites**, and **95/95 remaining codex cards** are identical to the parent. ABR01–04 fixes are preserved.
- Exactly **12/12** place-card IDs move to sites. Names and layers remain; card `first:1` becomes site `books:[1]`. Ten description strings are identical. Baghdad moves its Babylon distinction from the flattened card description into an explicit note; the historical assertion is unchanged. Chalcedon’s one substantive copy change is accepted above. Thus the builder’s “unchanged except Chalcedon” is semantically correct but not a literal description-string identity claim.
- Exactly **7/60** events change, solely `ref` → `site`: jud-e10, jud-e12, che-nicaea, che-ephesus, che-chalcedon, ISE05, XE05. Each target exists; no date, text, layer or religious attribution changes. **53/60** events are identical.
- Inventory remains **313** records: 109 nodes + 27 links + 60 events + 22 sites + 95 codex cards. Nonspatial place cards decrease from 59 to 47. Seven cards for the eight unresolved packages remain nonspatial; Najaf has no narrative card. No unresolved numeric point was imported.

Independent Node 24.22.1 execution of `node --test tests/atlas-abrahamic.test.ts` on the exact-head fixture: **25/25 pass**, including marker inventory/coordinates, caveats, crosswalk coverage, unresolved-card holds and all three ABR regressions. Initial local fixture attempts failed because helper files had not yet been loaded and because of an incorrect working directory; after fetching the missing exact-head helpers and using the correct directory, the above run completed. These were harness setup failures, not product failures. No application code was edited.

**Prior final sample continuity:** compared the preserved deterministic 20-item sample at `ee700d1:AUDIT_CHECKLIST-4` to the evaluated new head. **17/20 records are identical**; Mecca and Baghdad moved from cards to sites, and che-nicaea changed its target field. Their historical assertions are preserved; the three changed spatial associations are covered by the reopened source table above. The earlier **20/20 source checks** remain prior evidence, not twenty newly opened sources or a new random draw in this return review. The historical 313-record conformity pass is likewise carried only within its documented limits.

### CI, rendered evidence and limits

Inspected exact-head [Actions build job 127782234547](https://github.com/mckayec/universe-sandbox/actions/runs/42184724555/job/127782234547) and logs: build/check job succeeds, **119/119 tests**, **24/24 page/viewport checks** (12 pages × 2); deploy skipped. Crucially, the enumerated page-smoke matrix **does not include `?pack=abrahamic-world-religions`**. Those 24 passes do not independently prove the changed pack renders.

Claude separately reports Chromium/SwiftShader inspection at 1440×900 and 390×844 for this pack and three screenshots in fixing-round2.md. That remains builder evidence; no independent rendered-browser, 4K, physical-device or performance pass was performed here. No separate Deep Research product was invoked, no inaccessible source body was certified, and no formal PR approval, merge or deployment was performed.

### Source-question handoff and acceptance limits

The appended [Q01 continuation](build-audit/q01-coordinate-continuation-20261101.md#2026-11-06-return-questions--three-city-packages-recovered) answers **8/8 returned questions** and adopts **3/8 new packages**: Zurich city (not Grossmünster/Manz house), Hamburg city (not Temple), Xi’an city (not museum/stele point). Total now **16/21 supported packages and 5/21 unresolved requested features**; **12/16** supported packages are currently built, one held Antioch, three awaiting incorporation. Los Angeles city context and Grossmünster church evidence are separately labelled options, not extra implemented markers or exact-feature resolutions.

Claude’s next bounded unit is the three adopted city references and an explicit Known gaps disposition for Fayette/Whitmer, Najaf, Karbala, Azusa Street and Seesen. Preserve existing nonspatial content, do not silently drop requested scope, and do not repeat the closed twelve-marker incorporation or ABR01–04 work. A permanent scope reduction or lower-confidence replacement needs explicit disposition; known gaps do not certify complete research.

### Run receipt

Receipt covers the observed review/source-answer work window; it excludes earlier triage and publication/lock-release overhead. It is elapsed wall time, not metered compute or billing. Usage fields are unavailable, not zero.

```json
{
  "project_id": "universe-sandbox",
  "item_ids": [
    "abrahamic-world-religions",
    "Q01"
  ],
  "actor": "chatgpt",
  "run_id": "chatgpt-20261106-081550",
  "attempt_id": "q01-return-01df0f2-1",
  "observed_start": "2026-11-06T08:15:50Z",
  "observed_end": "2026-11-06T08:27:09Z",
  "duration_seconds": 679,
  "duration_type": "elapsed_run_window",
  "timestamp_source": "clock.curr_time UTC observations",
  "outputs": [
    "docs/universes/packs/abrahamic-world-religions/audit-final.md",
    "docs/universes/packs/abrahamic-world-religions/build-audit/q01-coordinate-continuation-20261101.md"
  ],
  "evidence_urls": [
    "https://github.com/mckayec/universe-sandbox/pull/39",
    "https://github.com/mckayec/universe-sandbox/actions/runs/42184724555/job/127782234547"
  ],
  "measured_usage": {
    "input_tokens": null,
    "output_tokens": null,
    "cached_tokens": null,
    "compute_seconds": null,
    "cost_usd": null
  },
  "coverage_notes": "Bounded Q01 return review and eight source-question answers; excludes earlier triage and publication/lock-release overhead. No metered usage exposed. No full new 20-source sample or rendered acceptance claimed.",
  "recorded_at": "2026-11-06T08:27:09Z"
}
```

### Current verdict and blockers

**Canon: not approved for final acceptance.** The returned twelve-marker implementation is accepted at **01df0f2ec7f007a2b37a5712b279a9b5e930e299**, with **0 new High/Medium content findings**. Remaining blockers are (1) incorporation/recheck of the three newly supported city packages and explicit Q01 gap/scope disposition; (2) same-head technical/rendered evidence and Claude’s technical sign-off; and (3) Mckay’s release approval. Hand back **fixing / claude** for that bounded implementation/disposition unit.


## 2026-11-06 — Q01 round-3 return review

**Exact audited revision:** PR [#39](https://github.com/mckayec/universe-sandbox/pull/39), `pack/abrahamic-world-religions`, **9e3ce7ed4219d5f3004020de6b6339950bba502f**, parent **01df0f2ec7f007a2b37a5712b279a9b5e930e299**. This section is the current checkpoint; earlier results retain their original revisions and counts.

**Result: 3/3 new city markers accepted; 3/3 changed Chronicle links accepted; 5/5 proposed holds accepted as temporary evidence holds. One new Low finding (Q01-R3-L1), zero new High/Medium findings. Independent focused tests 25/25 pass.** Acceptance of a hold is not evidence that its missing coordinate has been researched successfully, a permanent scope reduction, or a release approval.

### Source and implementation checks

The three Getty bodies were freshly opened on 2026-11-06; identity/hierarchy and raw DMS fields match the permitted city packages. Decimal rounding is within 0.0000005 degree of DMS conversion and is not a claim of survey accuracy.

| Marker | Opened source and raw point | Built point / disposition |
|---|---|---|
| chp-zurich | [Getty TGN 7007302](https://www.getty.edu/vow/TGNFullDisplay?english=Y&find=&nation=&place=&subjectid=7007302), Swiss city; N47 22 00 E008 33 00 | 47.366667, 8.55. Pass: city reference, explicitly not Grossmünster, Manz’s house, canton or Dutch namesake. |
| jud-hamburg | [Getty TGN 7005289](https://www.getty.edu/vow/TGNFullDisplay?english=Y&find=&nation=&place=&subjectid=7005289), German inhabited place; N53 33 00 E010 00 00 | 53.55, 10. Pass: not the 1818 Temple, warehouse property or state extent. |
| xian | [Getty TGN 7001810](https://www.getty.edu/vow/TGNFullDisplay?english=N&find=&nation=Togo&place=&subjectid=7001810), inhabited place under China/Shaanxi; N34 15 30 E108 55 43 | 34.258333, 108.928611. Pass: not museum, original stele point or 635 arrival site. Nanjing distinction and historical/modern extent caution retained; URL search parameter is not the source hierarchy. |

Read the complete five-file [parent-to-head diff](https://github.com/mckayec/universe-sandbox/compare/01df0f2ec7f007a2b37a5712b279a9b5e930e299...9e3ce7ed4219d5f3004020de6b6339950bba502f), actual data files and exact-head test dependencies. Git blob hashes match for **18/18 fetched local files** (13 target/dependency files and five parent data files). Independent evaluated-pack comparison confirms:

- **109/109 nodes, 27/27 tree links, 22/22 prior sites and 92/92 remaining codex cards unchanged.** ABR01–04 and all twelve previously accepted Q01 markers remain intact.
- Exactly three place IDs move from codex to sites with names/layers retained and `first:1` converted to `books:[1]`. Zurich and Hamburg descriptions are identical. Xi’an’s Nanjing distinction moves from the flattened description to an explicit note; its historical assertion is unchanged.
- Exactly **3/60 events** change only `ref` → `site`: `che-anabaptist`, `jud-e09`, `XE01`; **57/60** are identical. Targets exist; event dates, texts and attribution remain unchanged.
- Inventory stays **313 records**: 109 nodes + 27 explicit links + 60 events + 25 sites + 92 codex cards. There are **44 nonspatial place cards**. Q01 accounting is **16/21 supported packages, 15 implemented, Antioch held; 5/21 requested features unresolved**. Do not count 25 total markers as 25 Q01 resolutions.

Executed `node --test q01-r3/tests/atlas-abrahamic.test.ts` in the isolated exact-head fixture with Node 24.22.1: **25/25 pass**, including marker inventory/provenance, unresolved cards, reference validation and prior ABR regressions. These tests do not cover correctness of the source-summary count strings identified below.

The earlier deterministic 20-entry source sample and 313-record conformity review remain inherited evidence, within their documented limits. This delta does not change those selected historical assertions; the three new spatial associations are checked above. No new random 20-item draw, full primary-source reread, or completed missing-coordinate research is claimed.

### New finding and exact replacement text

| ID | Severity | Location at audited head | Finding | Required correction |
|---|---|---|---|---|
| Q01-R3-L1 | Low | `public/atlas/packs/abrahamic-world-religions.js:392` and `:397` | `meta.srcnote` and the coordinate-source entry still describe twelve approximate references and omit the new November 6 source opening, while the actual inventory/Earth status has fifteen Q01 references and 25 total markers. | Replace the two strings below. Include this metadata alignment in the technical-pass preparation; do not redo the accepted three-marker research. |

Replacement for `meta.srcnote`:

> Map markers are ten heritage references (UNESCO World Heritage Centre geographical data, accessed 26 October 2026) and fifteen additional city or heritage reference points (Getty TGN, ToposText and UNESCO, opened 30 October, 1 November and 6 November 2026). Other places are listed without coordinates rather than guessed.

Replacement for the Getty/ToposText entry in `meta.sources`:

> Getty Thesaurus of Geographic Names and ToposText place records, and UNESCO components 1018rev-002 and 1220-007, for the fifteen additional city or heritage reference markers

These are count/provenance corrections, not new historical content. Preserve the original source-specific raw coordinate notes.

### Five hold dispositions

| Package | Decision | Boundary |
|---|---|---|
| Fayette / Whitmer | Accept hold. Existing `chp-fayette` card stays nonspatial. | No promotion of replica/map-picker coordinates; identified numeric evidence or an explicit uncertainty disposition is still required for a point. |
| Najaf | Accept deferred feature selection. No new narrative card merely to consume a coordinate. | Wadi al-Salam cemetery is not interchangeable with Najaf city or Imam Ali tomb. This is a retained gap, not completed coverage. |
| Karbala | Accept hold. `ISP05` remains a card. | GeoNames candidate remains recorded but unadopted; do not silently upgrade its evidence status. |
| Azusa Street | Accept hold and the choice not to add an optional Los Angeles city-context marker. `chp-azusa` is preserved. | City context would not resolve the mission parcel. The existing card already names Los Angeles; the reason for the hold is feature mismatch, not absence of the city name from the atlas. |
| Seesen | Accept hold. `jud-seesen` remains a card. | Exact readable town/selected-site evidence with a stated CRS remains necessary before a marker. |

All **4/4 existing affected cards** remain unchanged/nonspatial; Najaf has no narrative card. Accept Claude’s statement that these gaps do not block **building or technically checking** the supported content. Do **not** read “none blocks the rest of the atlas” as final canon or release clearance. A permanent release-scope disposition remains separate. Antioch is likewise a held supported package, not an implemented marker.

The finite next unit is metadata correction plus the same-head technical/rendered package and an explicit proposed release-scope treatment for the held features. No further broad coordinate research is requested under R3. If releasing with those features nonspatial/deferred requires Mckay’s scope decision, present one concrete combined question in DECISIONS.md before treating it as approved; do not silently reduce scope or reopen indefinite research.

### Validation limits and current verdict

Independently inspected [Actions build job 127803591530](https://github.com/mckayec/universe-sandbox/actions/runs/42191268189/job/127803591530) and its logs for this exact head: successful job, **119/119 unit tests**, **24/24 page/viewport checks**, deployment skipped. The page matrix still omits `?pack=abrahamic-world-religions`; those passes do not establish rendering of this atlas. Claude’s 1440/390 Chromium/SwiftShader captures in fixing-round3.md remain builder evidence. No independent rendered, physical-device, 4K or performance acceptance was performed here. Separate Deep Research was not invoked.

**Canon: not approved for final acceptance.** The three-marker unit and five temporary holds are accepted at **9e3ce7ed4219d5f3004020de6b6339950bba502f**. Remaining work: Q01-R3-L1’s two metadata strings; explicit final scope disposition for held features; same-head technical/rendered sign-off; Mckay’s release approval. Return **fixing / claude** to complete these together, not another open-ended research cycle. No code edit, PR approval, merge or deployment by ChatGPT.


## 2026-11-06 — Round-4 metadata and page-matrix recheck

**Exact audited head:** PR [#39](https://github.com/mckayec/universe-sandbox/pull/39), branch `pack/abrahamic-world-religions`, **d4185ed6f15d47e9e268a87fbd59f818237ffc9e**, parent **9e3ce7ed4219d5f3004020de6b6339950bba502f**.

**Q01-R3-L1 closed (1/1 finding; 2/2 exact replacement strings). Zero new pack-content findings.** Inspected the complete three-file parent-to-head diff and fetched all three actual files at the head: assembler, targeted test, and standalone-page matrix. Independently verified 3/3 fetched Git blob hashes. The only data changes are `meta.srcnote` and `meta.sources[2]`, verbatim as requested. Evaluated-parent comparison confirms every other pack value is identical, including **313/313 inventory records** (109 nodes, 27 links, 60 events, 25 sites, 92 codex cards). Raw coordinate notes, five held cards and all attribution/layer fields are unchanged.

### Independent checks and evidence boundaries

- Executed `node --test q01-r4/tests/atlas-abrahamic.test.ts`: **26/26 pass**, including the new count/source-note regression. The isolated fixture uses the three freshly fetched head files and unchanged dependencies from the previously verified exact-parent fixture. No production source was edited.
- Inspected [CI job 127830894206](https://github.com/mckayec/universe-sandbox/actions/runs/42199472611/job/127830894206) and its logs: **120/120 unit tests**, **26/26 page/viewport checks**, including **2/2 Abrahamic desktop/mobile cases**. The earlier page-matrix omission is closed.
- CI actually checked out synthetic merge **2509bb0b9184c5eec54e0bc157de9ec757090219**. Inspected its delta from the audited head: documentation/coordination changes plus root `bom-geography-map.html` and `bom-real-map.html`; no atlas runtime/data or test-file difference. Accordingly these are CI results for that tested merge, with the relevant atlas code identical, not a claim that the entire repository tree was identical. Deployment skipped.
- CI does not establish that `test:browser` passes. Claude reports a simulator-Load timeout; the successful page suite is a different test. Do not interpret fixing-round4.md's “CI is the reference for this script” as a passed simulator smoke run.
- Claude's four-size SwiftShader captures and R4-T1/R4-T2/R4-T3 observations remain builder evidence. No new independent screenshot, finished-surface, physical-device, GPU or performance acceptance was performed. TA-01/R4-T1 land-mask remediation and R4-T2 phone/chrome checks remain Claude's work. A four-second capture with “Charting surface” still visible cannot certify a finished surface; recapture after baking finishes.
- The prior 20/20 source sample and full bounded conformity review are preserved evidence for unchanged historical assertions, not 20 fresh source openings in this metadata-only return. No separate Deep Research invocation or new historical-source research is claimed.

### Scope disposition and next owner

The five unresolved Q01 packages retain their accepted temporary evidence holds; **16/21 supported, 15 built, Antioch supported but held, 5/21 unresolved**. No additional research or removal is requested here.

D02 is a real, still-unanswered scope question. Clarified its wording in [DECISIONS.md](../../DECISIONS.md) without answering it: there are **five existing nonspatial cards plus deferred Najaf**, not six existing cards. Antioch is supported but held, so “only exact points are missing” was not an accurate blanket explanation. Future pins are new spatial assertions and still require source/feature-identity review; this decision must not preapprove them. The recommendation to accept the bounded scope is not Mckay's answer or release consent.

**Canon: not approved for final acceptance pending D02's scope disposition.** All returned pack corrections are now accepted at **d4185ed6f15d47e9e268a87fbd59f818237ffc9e**; no further copy fix is requested. Technical approval and Mckay release approval remain separate gates. Return **fixing / claude** for the concrete TA-01/R4-T1 and R4-T2 technical unit while D02 is pending; this is not an item that only Mckay can currently move. After technical work is complete, route to Mckay if D02 is still the sole outstanding action. Do not repeat the accepted metadata or reopen broad coordinate research.

Run inspected **24/24 status files** (18 universe, six review); one ChatGPT-owned item, zero research-ready self-audit candidates. No agreement changes, site edits, PR approval, merge or deployment.


## 2026-11-06 — Final canon return at d95eaf2: D02 implementation mismatch

**Audited revision:** PR [#39](https://github.com/mckayec/universe-sandbox/pull/39), branch `pack/abrahamic-world-religions`, **d95eaf28e50f6fe005e99b4b3e289d8b906b1fc3**. PR independently read open/unmerged at that head. Baseline: **d4185ed6f15d47e9e268a87fbd59f818237ffc9e**.

**Result: one new Medium scope/content finding, D02-C1; 4/5 promised retained cards present. Canon: not approved.** This corrects our earlier assumption that Antioch already had a card. It is not a new request for broad coordinate research, and does not undo Mckay's D02 answer.

### Exact-revision evidence

Compared both complete, non-truncated Git trees and the three-commit comparison. Exactly **7/7 changed paths**: two Earth-mask PNGs, engine.js, engine.css, solar-tex.js, mask generator and mask tests; no removed paths. Read all five changed text files at the exact head. **5/5 pack-data blobs are identical to the accepted baseline**, including assembler blob `aca46d13b989249e61441c4e66f45dd2c688b0aa`. Therefore prior 313-record conformity evidence, ABR01–04 closures across 12 records, Q01-R3-L1's two corrected strings, and the recorded **20/20 source sample** carry forward for unchanged assertions. These are inherited checks, not fresh source openings or a new random sample.

The one-book control change leaves book data and setBook controls in the DOM; this pack has only book 1 (Overview). Label-collision suppression changes visibility under chrome, not the place data, source attribution, layer/year predicates or book restrictions. No new canon/spoiler finding in that delta. Rendered accessibility and geography appearance remain Claude's technical checks.

### Finding and bounded correction

| ID | Severity | Location | Finding/evidence | Required disposition |
|---|---|---|---|---|
| D02-C1 | Medium | `public/atlas/packs/abrahamic-world-religions.js`, reference-place inventory; fixing-round4.md release-scope table; DECISIONS.md D02 | D02 approves retention of five named existing unpinned cards, but only four exist. Across the assembler and all four data parts, the only Antioch/Antakya occurrence is the assembler comment saying Antioch is held. It is not a visible place, event or codex card. Earlier auditor prose incorrectly counted it as an existing card. | Claude: add a minimal source-backed **nonspatial Antioch reference card** from the accepted Q01/source package, with stable ID, source locator, correct tradition/layer and Overview gate. Preserve ancient-city versus modern-city/venue distinctions; do not add coordinates, an invented event, or route. Return exact head, actual text/source mapping and regression evidence. If existing evidence does not support a bounded card, explicitly document that limitation and propose a revised scope decision; do not silently reinterpret D02 as approving Antioch's absence. |

| D02 feature | Actual disposition at reviewed head |
|---|---|
| Antioch | **Missing visible card**; comment-only mention. Supported-but-held coordinate package is not itself a visitor-facing record. |
| Fayette/Whitmer | `chp-fayette` nonspatial card retained. |
| Karbala | `ISP05` nonspatial card retained. |
| Azusa Street | `chp-azusa` nonspatial card retained. |
| Seesen | `jud-seesen` nonspatial card retained. |
| Najaf | Deferred mapped feature; no new standalone narrative card required by D02. |

### Known gaps and preserved decisions

D02's owner-approved boundaries remain: the five named places are to remain unpinned, and Najaf's mapped feature is deferred. All six spatial omissions remain Known gaps. Coordinate accounting stays **16/21 supported packages, 15 implemented, Antioch supported but held, 5 unresolved**; total implemented map markers remain 25 (10 heritage + 15 Q01). D02 does not confirm an uncertain coordinate, approve a later pin, establish exhaustive world-religions coverage, or authorize release.

Historical audit-build.md and research-addendum.md are absent from current main; their exact `bc7efce6fb75e5233a461fa7e41be0f1baf6fcfa` versions were successfully read for this return. Q02–Q07 dispositions remain as documented there; Q01 is addressed by the subsequent source/implementation rounds plus D02, subject to D02-C1. No lost historical evidence was invented or silently treated as a current-main file.

### Validation and handoff

Independently read [Actions job 128046341440](https://github.com/mckayec/universe-sandbox/actions/runs/42262660864/job/128046341440) and its logs: **123/123 unit tests passed**, and both Abrahamic desktop/mobile page checks passed; overall build job succeeded, deployment skipped. The job checked out synthetic merge **63c1c6c0269c505e53513740750552b8f623a950**, not the PR head itself; no new local test execution or whole-tree equivalence claim is made. These checks do not prove retention of a card they never assert.

Claude's finished-surface four-size report is recorded in fixing-round4.md; it remains builder evidence, not an independent visual inspection here. Physical-device/GPU/performance evidence remains limited, the separate simulator Save/Load smoke issue remains unresolved, and minor coast stepping/shared 4K type size remain disclosed technical observations. No Deep Research product invoked; this was a revision/scope audit with no new historical assertions.

Return **fixing / claude** for D02-C1 only, preserving prior closures. After the bounded correction, ChatGPT rechecks changed content and source/gate evidence; Claude supplies the same-head technical sign-off; Mckay's separate release approval is still required. No site code, PR branch, merge or deployment changed by this review.

**Canon: not approved — D02-C1 (missing Antioch card).**
