# Final audit checkpoint — Abrahamic world religions

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
