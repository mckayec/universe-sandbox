# Parallel implementation handoff

**2026-10-30 update:** see [remediation-review.md](remediation-review.md) for dispositions at 9a09dbc and the two remaining callback fixes DWR-A/B. The checklist below is the historical pre-fix handoff.

2026-10-29, implementation **f778b6b6fbbeb173763f2a79cd2d8bc0ff0d6f49**. Claude may implement these changes on `atlas/deep-worlds` while ChatGPT retains the source-review work. Neither lane has release approval. This document requests no merge or deployment. All fixes need a later exact-head recheck; none is claimed applied here.

## Ready fixes

| ID | Exact target | Change | Acceptance |
|---|---|---|---|
| DW02 / High | `public/atlas/society.js`, `setEra`, `enterSite`/`fadeTo`, effects and chained prologue callbacks | Cancel pending navigation/effect work on era change, recheck destination eligibility when a delayed callback commits, dispose active effects when their book becomes ineligible, and clear stale captions/overlays. A cancellation generation/token can cover callbacks already queued; do not rely solely on the first `enterSite` guard. | VI→I during asteroid transition must never load asteroid; II→I in Agea must stop iron rain; IV→I must invalidate the Tyche→prologue chain. Source probes currently reproduce the first two defects. Real timing, touch and keyboard behavior still require permitted rendered testing later. |
| DW03 / Low | `packs/hyperion.js`, `worlds[bressia].blurb` | Replace unsupported orphan-antecedent detail with “Kassad fought in the Bressian campaign.” See checkpoint 1 for the longer qualified alternative. | No unbound “his wife and son”; exact new copy reviewed at new head. This editorial cut is not a new primary attestation. |
| DW04 / Medium | `packs/sun-eater.js`, Devil's Rest site description and `delos/devilsrest/castle.desc` | “The dark-stone home of House Marlowe, whose lord is Archon of Meidua. Hadrian grows up under a father who wants an heir rather than a child.” | Both fields corrected against S01; do not preserve the inverted “heir his father does not want” in either field. |
| DW05 / Low | `packs/dune.js`, event `d1` **and** `caladan/castle/keep.desc` | Replace “On the eve of the move” with “Before the move to Arrakis”. | Both fields checked against S02; no false exact-eve timing. |
| DW07 / High | `packs/dune.js`, `arrakis/tabr/entrance.desc`, books `[1,2,3]` | Base copy: “A concealed way into the rock, sealed against moisture loss.” Remove the sentence beginning “In the second book”. A separately gated book-II entry is possible only after verifying its scene/placement in *Dune Messiah*. | Book I must expose no book-II departure clause. Do not simply turn `desc` into an era object: pack landmark rendering support must be established first. Existing `lmOk` passes this landmark at I. The retained first sentence is still primary-unverified. |

## DW06: evidence holds, separate from ready fixes

These are unverified assertions, not findings that every assertion is false. Do not block the ready fixes on obtaining these passages. Conservative omission is available now; it must be logged and later rechecked.

- Sun Eater: `b1j`, `b1n` and `borosevo/dungeons` need the actual Colosso/imprisonment passages for exact dungeon placement; Liliana/Balian need named passages. Remove disputed given names and dungeon tie pending evidence. `redtine/village` cites *The Lesser Devil*: disclose supplemental provenance and resolve its selector policy; do not certify it as main-novel-I content.
- Foundation: `f1d`/`termcity/board` needs the actual meeting passage. Remove the landmark tie rather than invent a room. `trantor/hotel/terminal` can be narrowed to “Gaal arrives at Trantor and takes a taxi to the Luxor; another figure follows.” S06 does not establish that figure's affiliation.
- Cosmere: `e35`/`yeddaw/orphanage` needs the ending of *Edgedancer*. Supported narrow copy: “Lift travels to Yeddaw in Tashikk, where Darkness has been reported.” Remove the orphanage landmark/effect and Third-Ideal/victim assertions pending the passage. Do not infer the ending from S03.
- Expanse: `b3l`, `b6l`, `b6i`, `b8n` and Medina `drum` landmarks remain passage-dependent; obtain the relevant *Abaddon's Gate*, *Babylon's Ashes*, *Persepolis Rising* and *Tiamat's Wrath* scenes. Remove unsupported action/room precision if evidence cannot be supplied.
- Hyperion: Benares punishment and Time Tombs/sphinx sequences remain open as in checkpoint 1. `jungle/raft/shiprest` additionally needs comparison of *Endymion* and *The Rise of Endymion* before certifying its return clause at III; omit that clause meanwhile.
- Dune: `d5`, `d14`, `d19` and other late scenes still need the relevant novel passages. A gate metadata number alone is not evidence for the event's timing or precise landmark.
- Society: see `society-samples.md`. S07 is chapter 1, not the Iron Gold prologue. Do not certify “Aja waiting on a black islet” from it. Withhold the detailed prologue adaptation until the primary prologue is available; Mercury-conquest context alone is supported.

The remaining 202 uncompared sample records are individually identified in `sample-ledger.csv` by `comparison=not-compared`, including exact current text, pack/world/site/object ID and requested work gate. Obtain those passages or remove the unsupported details from the acceptance scope explicitly. No blanket canon certification is warranted by reaching the sample count.
