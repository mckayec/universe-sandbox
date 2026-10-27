# Identity and typed-edge integration

2026-10-26. This crosswalk integrates the saved Judaism, Christianity, Islam and comparative dossiers at repository baseline `a5c1e171c319a4aa6241a996f484babb617ad425`. It reuses their existing citations; no new historical research or independent source rereading is claimed. Research gate is **first:1 throughout**, consistent with the parent overview. It is not a chronological date.

## Files, counts and operation

`identity-and-edges.csv` contains **328 rows:293 identity/context registrations,16 selected cross-dossier or organizational edges,19 explicit nonmerge constraints**. These are overlapping source views, not328religions, people or claims. The identity registrations include all56formally declared place rows (Judaism18,Christianity20,Islam18), plus comparative settings and previously informal regional/context endpoints. Other registered rows cover events, people, traditions, schools, devotional orders, demographic references and journey/network views. The16edge rows supplement the full local relationship specifications in the dossiers; they do not replace or purport to exhaust those local edges.

Read `source_file` + `source_id` as the source-view key and `canonical_id` as the shared identity. Preserve the source-view's exact copy, date, evidence class and limitations. Only explicit alias rows authorize reuse. `evidence` keys resolve by their JU/CH/IS/X namespace to the corresponding dossier's source register, even in rows combining namespaces. For identities, a registered source body supplies the claim; the crosswalk itself supplies editorial bookkeeping. A registration does not independently validate historical truth.

`record_kind:edge` uses canonical endpoints and a named relation. `record_kind:nonmerge` is a prohibition, not a drawn edge; its right-hand value may deliberately be an excluded label or distinction rather than a registered node. No unknown geometry is supplied. Reference-only entries are a valid final research disposition and do not need invented coordinates to count as usable reference content.

## Shared identities and deliberate separation

- **Jerusalem:** `jud-jerusalem`, `chp-jerusalem`, `ISP04` reuse `jerusalem`. The JU21UNESCO Old City point represents heritage geography only. Jewish Temple history, Christian origins and the Muslim Night Journey identification remain separate attributed claims. No exact-event coordinate or political title transfers through this union. Sources: `judaism-research.md` JU21; `christianity-research.md` CH02; `islam-research.md` IS01.
- **London:** `jud-london` and `chp-london` reuse `london`; their2026British organizational merger and1612Baptist congregation remain distinct episodes. Sources JU15 andCH11.
- **Cairo:** `chp-cairo` andISP09 reuse `cairo`;1978OAICassociation and medieval Fatimid succession are different source views. Sources CH27 andIS08.
- **Islam and Christianity overview keys:** IST01/`islam` reuse `islam`; `ch-christianity` becomes `christianity`. `judaism` is an editorial overview container, not the name of an ancient corporation. No root receives an unsourced historical foundation date. Sources IS03/IS06,CH01/CH18,JU16.
- **Church of the East:** the comparative `church-of-east` label resolves to historical family `ch-east-syriac`. The781stele's reported635arrival must not be attributed automatically to a present legal organization. Sources X04/CH17.
- **Sufism:** the subject `islamic-sufism` in Dara Shikoh's comparison resolves toISC01. This is neither an additional denomination nor proof that all Sufi orders accept his comparison. Sources X05/IS15.
- **Historical Jewish setting:** `ch-jewish-context` reuses the Second Temple historical-context view, not the entirety of Judaism construed as a discarded predecessor. Sources CH01/CH18/JU03.
- **Repeated religious figures:** ISC04's Abraham/Ishmael account remains a composite textual-reference view. Its connection to the Jewish covenant narrative is `shared-named-figure-reference`; it is not a merged archaeological biography, a verified family tree or institutional parenthood. Sources IS04/JU01.

The nonmerge ledger explicitly separates city/region (Babylon/Babylonia), different cities (Babylon/Baghdad;Xi'an/Nanjing), region/city (Egypt/Cairo), historical regions and modern boundaries, Jewish versus Christian “Orthodox,” Eastern versus Oriental Orthodox, the Church-of-the-East family, LatterDaySaint movement versus one successor church, and Stone–Campbell versus JosephSmith restoration movements. It also separates tradition/legal-school homonyms, Salafi/Wahhabi overlap, person/order affiliations, regional AhlalSunna terminology and the two different AhmadBarelwi/RizaKhan figures. Exact evidence and limits are in theCSV; none of these distinctions licenses an additional unsupported historical claim.

## Reference closure and uncited-global check

The three formal place/event/journey namespaces resolve with **zero missing targets**:21distinct cited `jud-e*`/`jud-j*` keys,42`chp-*`/`che-*` keys and36ISP/ISE/ISJkeys. The56place declarations are separately registered; the Judaism place names are not included in the21event/journey denominator. Comparative names were checked manually because its source file uses natural-language settings rather than a shared place namespace.

Previously informal settings now have explicit scoped keys: Lexington,NorthAmerica,Nigeria,EasternEurope,India,Pakistan,Yemen,Iran; comparativeXi'an,Lahore,Talwandi,Sultanpur,Shiraz,Baghdad,Acre,Nanjing. The local wording and citations control each. These are reference contexts, not new precise geographies. The four Christian spread/network IDs are also registered without invented itinerary legs.

Previously informal graph endpoints now have context/organization identities: Jewish mystical/Haskalah contexts,Ananites,JTS,ALEPH and its cited merger participants; British Liberal/Reform historical organizations; WesternChristianity/Reformation/EnglishSeparatist/revival contexts;Stone/Campbell movements;Millerite/BibleStudent contexts;Chalcedonian andKyivanByzantine contexts;UnionofUtrecht. Context labels do not acquire populations or universal institutional authority from registration. Literal source distinctions and source-specific dates remain required.

All16selected edge rows have registered canonical endpoints; all328row IDs and293source-view keys are unique; every row has an evidence namespace and gate1. There are **zero blank evidence fields**. This is a reference-integrity check, not an independent verification of all underlying assertions. Generic editorial containers (Earth,overview,reference library) are not factual origin claims and need no invented historical source.

## Completeness assessment and remaining work

The current selected major-family coverage includes the previously added Adventist/Witness/AfricanInstituted/LatterDaySaint successor distinctions and the Islamic modern-movement additions. This integration pass identifies **no additional missing major branch required to render the selected overview honestly**. That conclusion is bounded by the published scope; it is not a census of every community. Regional Jewish histories, every Christian denomination, all Islamic theological/legal subdivisions and full internal histories of Buddhism/Hinduism/Daoism remain stated exclusions. These are not automatically acceptance blockers for a comparative overview with visible scope.

The consolidated source-quality and chronology disposition is now recorded in acceptance-review.md. The affected SAJ location and ISJ03 network registrations were reconciled with the corrected dossiers; IDs, aliases and endpoints did not change. No source inaccessible in this integration task prevented reference closure. The existing dossiers retain their original access limits. Builder serialization must preserve the difference between overlapping affiliation, self-identification, historical development, institutional merger, intellectual contact and traditional succession; a single-parent layout cannot silently erase these relations. Final built-data link/rendering checks occur after implementation.

## Input snapshots

These hashes identify the working dossier inputs checked here, not their external source bodies or proof of reading. If a dossier changes, recheck affected aliases/targets rather than treating this snapshot as future certification.

| File | SHA256 |
|---|---|
| `judaism-research.md` | `5fbfb21389b17f1afdd5c1432c2b9c643e6aba43647417f90f3b179cc3a4019a` |
| `christianity-research.md` | `c25264fc9c3668483067a25f8bb414fabf2b2563ce156f74931eceea4ceea18f` |
| `islam-research.md` | `ae61bcc17acad2425c8ac49979bf102c4fefcfb384099bef378eb5403230f150` |
| `comparative-evidence.md` | `78f14aec6d036c82779f2ec9ae315ce85d4b234ec43cd07ea071caf5a4bc6ab2` |
