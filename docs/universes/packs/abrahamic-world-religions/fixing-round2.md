# Fixing round 2 — Q01 supported reference packages

2026-11-06 · Claude (builder) · PR #39, branch `pack/abrahamic-world-religions`

- New head: `01df0f2ec7f007a2b37a5712b279a9b5e930e299` (parent `ee700d153e91d854e583eb867dd40d0cc21ecfec`)
- Input: [Q01 continuation](build-audit/q01-coordinate-continuation-20261101.md) (13 supported / 8 unresolved) and the 21-package baseline `q01-anchor-dispositions.csv` at `bc7efce`.
- Scope: data and tests only (`public/atlas/packs/abrahamic-world-religions*.js`, `tests/atlas-abrahamic.test.ts`). No engine change.

## How the packages were built

Each supported package becomes a map marker that **keeps the id of its existing place card** (so the crosswalk identity, the Chronicle entries and deep links stay the same) and the card leaves "Places without a map point". Every marker has:

- `modern`: the exact permitted feature label plus its source identifier;
- a caveat note: "Approximate reference: a representative gazetteer point for the named place, not the exact place of an event" (or the existing heritage note for the two UNESCO components);
- a limits note carrying the continuation's "not X" restrictions;
- a provenance note: `Coordinate source:` source id and the raw coordinate string as published. Decimals are conversions only.

Card descriptions are carried over unchanged, with one exception (Chalcedon, below). Seven Chronicle entries that pointed at a moved card now use `site:` instead of `ref:` (che-nicaea, che-ephesus, che-chalcedon, ISE05, XE05, jud-e10, jud-e12).

## Per-package mapping (13 supported)

| Package | Pack id / layer | Lat, lon used | Source and raw string | Label on the map ("Today:") | Disposition |
|---|---|---|---|---|---|
| Mecca | `ISP01` / Islam | 21.45, 39.816667 | Getty TGN 7003870, N21 27 00 E039 49 00 | Mecca: approximate city reference | Built. Not province, Kaaba, birthplace or event venue; not Mecca, California. |
| Medina | `ISP02` / Islam | 24.5, 39.583333 | Getty TGN 7003869, N24 30 00 E39 35 00 | Medina: approximate city reference | Built. Not the mosque or the Hijra arrival point. |
| Kufa | `ISP06` / Islam | 32.016667, 44.383333 | Getty TGN 7018612, N32 01 00 E044 23 00 | Kufa: approximate gazetteer town reference | Built. Not Najaf governorate, Great Mosque, a modern centroid or the revolt location. |
| Shiraz | `shiraz` / Encounters | 29.633333, 52.566667 | Getty TGN 7002148, N29 38 00 E052 34 00 | Shiraz: approximate city reference | Built. Not the Báb's house or the 1844 location. |
| Baghdad | `baghdad` / Encounters | 33.35, 44.416667 | Getty TGN 7002482, N33 21 00 E044 25 00 | Baghdad: approximate city reference | Built. Not the region, Rusafa, the 1863 garden or Baghdad in Egypt; "not ancient Babylon" kept. |
| Acre | `acre` / Encounters | 32.923611, 35.068889 | UNESCO 1220-007, N32 55 25 E35 4 8 | Prison at Acre (UNESCO component 1220-007) | Built as the named prison component with the heritage note; not city extent, exile route, Haifa site or proof of religious claims. |
| Nicaea / Iznik | `chp-nicaea` / Christianity | 40.4266, 29.7168 | ToposText 404297PNic, 40.426600 29.716800 | Nicaea / İznik: representative ancient-city point | Built. Not Nicomedia, Nice or a council building. RPC/UNESCO values not averaged or used. |
| Ephesus | `chp-ephesus` / Christianity | 37.941389, 27.340556 | UNESCO 1018rev-002, N37 56 29 E27 20 26 | Ancient City of Ephesus (UNESCO component 1018rev-002) | Built with the heritage note. Not the 431 venue, Artemis component or House of Mary. |
| Chalcedon / Kadıköy | `chp-chalcedon` / Christianity | 40.9834, 29.0258 | ToposText 410290PCha, 40.983400 29.025800 | Chalcedon, ancient city near Kadıköy: representative point | Built. Not the 451 venue. **Copy change:** card text "No boundary or modern alias is assumed" → "No boundary is assumed", because the source itself supplies the Kadıköy locality. ChatGPT please confirm or reject. |
| Antioch | — | — | ToposText 362362PAnt | — | **Held, not pinned.** No built record (node, event, card, journey) names Antioch, so a marker would carry no sourced content. Can be added with a sourced association later. |
| Alexandria | `jud-alexandria` / Judaism | 31.182, 29.897 | ToposText 312299PAle, 31.182000 29.897000 | Alexandria: representative ancient and modern city point | Built. Not an exact community, teaching or patriarchal venue. |
| New York | `jud-new-york` / Judaism | 40.7, -74 | Getty TGN 7007567, N40 42 00 W74 00 00 | New York City: approximate city reference | Built. Not New York State or the JTS buildings. |
| Philadelphia | `jud-philadelphia` / Judaism | 39.95, -75.15 | Getty TGN 7014406, N39 57 00 W075 09 00 | Philadelphia: approximate city reference | Built. Not Independence Hall, the county or the 1968 building. |

Count: 12 built + 1 held = 13 supported. Map markers: 10 heritage + 12 Q01 = 22. Atlas copy updated to match (source note, legend, Earth status "22 reference markers", blurb, sources list, "Many places…" instead of "Most places…").

## Eight unresolved packages — kept nonspatial, source questions for ChatGPT

All stay reference cards with no coordinates (asserted by a new test). Najaf has no card in the built pack (no built record names it), so it needs a decision only if a Najaf record is added.

| Package | Card | Question that would unblock a marker |
|---|---|---|
| Zurich / Grossmünster | `chp-zurich` | Can a readable body for Warwick TowerCapsules CHZ0055 (or an official Zurich numeric record) give the church point? Or do you accept a labelled "Zurich: approximate city reference" from a Getty TGN city body instead of the church? |
| Fayette / Whitmer | `chp-fayette` | Primary numeric site evidence, or explicit acceptance of the labelled low-confidence replica-home point 42.865972, -76.869778? |
| Hamburg | `jud-hamburg` | Opened Getty TGN 7005289 body for an "approximate city reference" (not the 1818 Temple)? |
| Najaf | (none) | Only if a Najaf record is added: is the Wadi al-Salam cemetery reference acceptable as a distinctly labelled cemetery marker? |
| Karbala | `ISP05` | Opened Getty TGN 7002537 body (city, not governorate or shrine)? |
| Azusa Street | `chp-azusa` | Official numeric parcel/site record for former 312 Azusa Street; otherwise would a labelled "Los Angeles: approximate city reference" be acceptable? |
| Xi'an / Beilin | `xian` | Opened gazetteer city body (Xi'an approximate city reference), keeping the stele's repository separate from its 781 location? |
| Seesen | `jud-seesen` | Opened Getty TGN 7096758 body for the town? |

## Checks at `01df0f2`

- `pnpm check`: format, build, 119/119 tests (one new test: Q01 markers carry caveat, source id, label; unresolved stay cards; no event has both `site` and `ref`), check:dist pass.
- `pnpm test:pages`: 12 pages × 2 viewports pass.
- Browser (Chromium, SwiftShader GL, `vite preview`): `atlas/?pack=abrahamic-world-religions#book=1` at 1440×900 and 390×844, no console or page errors. Selecting Nicaea and Mecca shows the label, caveat and coordinate-source notes. Shots: `shots/q01-chp-nicaea-1440.jpg`, `shots/q01-chp-nicaea-390.jpg`, `shots/q01-ISP01-390.jpg`. Mecca and Medina markers visible near the lower edge of the 1440 shot.
- Not re-run: `pnpm test:browser` (known simulator Load timeout under software GL), 4K captures, real-device checks. Rendered/technical gates and Mckay's release approval remain open.
