# Fixing round 3 — three Q01 city references and Known gaps

2026-11-06 · Claude (builder) · PR #39, branch `pack/abrahamic-world-religions`

- New head: `9e3ce7ed4219d5f3004020de6b6339950bba502f` (parent `01df0f2ec7f007a2b37a5712b279a9b5e930e299`)
- Input: the 2026-11-06 section of [the Q01 continuation](build-audit/q01-coordinate-continuation-20261101.md#2026-11-06-return-questions--three-city-packages-recovered) (commit 45451c5) and audit-final.md at 1dedc8e.
- Scope: data and tests only. No engine change. The twelve accepted Q01 markers and the ABR01–04 fixes are untouched.

## Per-ID mapping (3 new packages)

Built the same way as round 2: the marker keeps its place card's id, layers and description; the card leaves "Places without a map point"; the Chronicle entry switches from `ref:` to `site:`.

| Pack id / layers | Lat, lon used | Source and raw string | Label ("Today:") | Limits note | Chronicle link |
|---|---|---|---|---|---|
| `chp-zurich` / Christianity | 47.366667, 8.55 | Getty TGN 7007302, N47 22 00, E008 33 00 | Zurich: approximate city reference (Getty TGN 7007302) | Not the Grossmünster, Felix Manz's house, or the exact place of the 1525 baptism. Not Zürich canton, and not Zurich in the Netherlands. | `che-anabaptist` |
| `jud-hamburg` / Judaism | 53.55, 10 | Getty TGN 7005289, N53 33 00, E010 00 00 | Hamburg: approximate city reference (Getty TGN 7005289) | Not the 1818 Temple, a warehouse heritage component, or the extent of Hamburg state. | `jud-e09` |
| `xian` / Encounters, Christianity | 34.258333, 108.928611 | Getty TGN 7001810, N34 15 30, E108 55 43 | Xi'an: approximate city reference (Getty TGN 7001810) | Not the Beilin museum building, the stele's original erection point in 781, or a surveyed arrival location in 635. Historical and modern city extents are not equated. Existing "Not the same as Nanjing" kept. | `XE01` |

Each also carries the standard APPROX caveat and a `Coordinate source:` provenance note with the raw string. The Grossmünster church point (TowerCapsules CHZ0055) is **not** used, as directed. Nothing from the Xi'an TGN record's notes, aliases or boundary claims was imported; the inscription/arrival date wording is unchanged.

Counts: 10 heritage + 15 Q01 = **25 markers**. Q01: 16/21 supported, 15 built, Antioch held, 5 unresolved. Atlas copy updated (Earth status "25 reference markers", blurb "fifteen approximate", header comments).

## Known gaps (R3–R4) — five unresolved packages, proposed dispositions

All five stay as they are now: nonspatial reference content, no marker (asserted by test for the four that have cards). Proposed disposition for each: **explicit hold, not a scope reduction**. None blocks the rest of the atlas; each blocks only its own exact marker. ChatGPT: accept, or reject a specific row.

| Package | Current built content | Proposed disposition | What would reopen it |
|---|---|---|---|
| Fayette / Whitmer | `chp-fayette` card | Hold. Not adopting the replica-home point (ChatGPT advised against). | A readable identified numeric farm/replica record. |
| Najaf | none (no built record names Najaf) | Hold / deferred. No card is created just to carry a coordinate. | A deliberately added, sourced Wadi al-Salam cemetery association. |
| Karbala | `ISP05` card | Hold. GeoNames 94824 candidate recorded, not adopted. | A readable authoritative city record corroborating it, or an explicit decision to accept gazetteer-level confidence. |
| Azusa Street | `chp-azusa` card | Hold. No Los Angeles city marker added: a city point would not locate the mission, and no other built record names Los Angeles, so a separate "Los Angeles" marker would carry no content of its own. | An official numeric parcel record for former 312 Azusa Street. |
| Seesen | `jud-seesen` card | Hold. | A readable Seesen town row (with CRS) or a town/memorial record. |

If any of these holds needs to become a permanent scope decision for release, it will go to Mckay as one combined question with the release request, not as more research runs.

## Checks at `9e3ce7e`

- `pnpm check`: format, build, 119/119 tests, check:dist 118 files OK. The Q01 test now covers 15 markers (lat/lon, caveat, source id in note and label, no event with both `site` and `ref`) and asserts the four unresolved cards stay cards; the pin-set test expects 25.
- `pnpm test:pages`: 12 pages x 2 viewports pass.
- Browser (Chromium, SwiftShader GL, `vite preview`, `atlas/?pack=abrahamic-world-religions#book=1`): at 1440x900 selecting Xi'an and Zurich, at 390x844 Xi'an and Hamburg; label and Getty TGN provenance shown; no console or page errors. Shots: `shots/q01-xian-1440.jpg` (Xi'an marker in China, panel shows 25 markers), `shots/q01-xian-390.jpg`.
- Not re-run: `pnpm test:browser` (known simulator Load timeout under software GL), 4K captures, real devices. Technical/rendered gates and Mckay's release approval remain open.
