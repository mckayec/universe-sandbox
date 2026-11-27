# SA02 / Words of Radiance — first bounded checkpoint

ChatGPT, 2026-11-20 UTC. **Research incomplete; retain research/chatgpt.** No implementation request or complete-record approval in this unit.

## Pinned inventory

[Inventory JSON](sa02-inventory-2026-11-20.json) contains all actual book-5 events, complete Narak/Urithiru site records, and Roshar/Braize parent metadata (parent gfx/map and other sites excluded, not approved).

| PR | Exact head | cosmere.js blob |
| --- | --- | --- |
| 48 | af49e0ab7f32626791d11a2f573dd7b4f074f654 | 00d8ac461d4299205cb8df883fa557dbd534cbd5 |
| 24 | cf25cda66e91c573c421a0f3712623db72737a3b | 3ff0aab059fa54e00f6e2ccc7b849d4bd206d958 |
| 37 | 03394c32816fcb5c95261bf6a9ea4520381a5838 | 5a74e300eaf88b2d3c81fa9bc957584cd4708e33 |

Fetched current heads and their actual files through GitHub. Local read-only Node/vm extraction independently verified **3/3 Git blob hashes**. Selection: `events.filter(e=>e.book===5)`; worlds roshar/braize, retaining parent properties except gfx/map/sites; sites narak/urithiru with complete scene objects.

**28/28 actual selected records captured:** PR48 4 events + 2 sites + 2 parents; PR24 the same; PR37 8 events + 2 sites + 2 parents. PR37 adds e87–e90, and its two selected sites contain **15 landmarks** (six Narak, nine Urithiru), including later-book entries. These are repository counts, not verification percentages. Other book-5-associated sites, journeys, codex, fields and missing content remain outside this initial inventory.

## Opened sources

1. [Author's sample index](https://www.brandonsanderson.com/blogs/blog/words-of-radiance-sample-chapters): referral links, not chapter-body evidence.
2. [Gollancz authorized opening PDF](https://www.gollancz.co.uk/wp-content/uploads/2014/03/Words-of-Radiance-Chaps-1-7.pdf): opened copyright/front matter and selected prose, particularly printed pp.111–114. Identifies UK first publication 2014, cased ISBN 9780575099043 and export paperback 9780575097414. This is an early sample, not a complete later-edition collation.
3. [Sanderson, Three Stories in New Formats](https://www.brandonsanderson.com/blogs/blog/three-stories-in-new-formats), March 2015, “Words of Radiance Tweak”: opened the author's edition-change account.

**Two narrow evidence observations:**
- **C / direct excerpt:** pp.111–114 describe Jasnah and Shallan's plan to seek Urithiru through a possible route on the Plains. Character research, legend and intention are not confirmation that the later Oathgate evacuation succeeds, or that the current tower description is wholly revealed here.
- **C / author commentary:** the March 2015 account distinguishes the original Kaladin/Szeth confrontation from the revised death by storm rather than Kaladin. Record the edition difference separately; this is not direct collation of both published endings. It does not establish the location of the Third Ideal scene.

**2/2 selected source observations dispositioned**, not two full novel claims certified. No separate Deep Research product was invoked. Search snippets were leads; only opened sources above support this checkpoint.

## Twelve record-type dispositions

| Type | Count | Disposition |
| --- | ---: | --- |
| e22 | 1 | Storm direction, march, timing and Narak attachment held pending ending text. PR37 also adds stormseat/fx. |
| e23 | 1 | Opening plan supports context only; actual evacuation and PR37 oathgates attachment held. |
| e24 | 1 | Existing cross-branch correction requires reconciliation; see below. Do not approve Narak attachment. |
| e25 | 1 | Torment/reveal timing and Everstorm composite held; PR37 adds damnation site. |
| e87–e90 | 4 | PR37-only interlude/battle/duel/chasm events held; no automatic import. |
| narak | 1 | Complete geographic/history description, coordinates and six PR37 landmarks held. |
| urithiru | 1 | Complete tower/Sibling/Oathgate composite and nine PR37 landmarks held. Later reveals cannot be certified from an opening reference. |
| roshar, braize parent metadata | 2 | Whole payload eligibility and cosmology held; no parent promotion. |

**12/12 selected record types have explicit dispositions.** There are no new mappings or gates.

### Existing e24 correction, not a newly discovered closure

Freshly read [lore-corrections/corrections.md](../lore-corrections/corrections.md), blob `684b7c6d899183a54959baff6ac8a39bbc576640`, L23: secondary-supported correction places the scene at the king's warcamp palace and removes Narak. PR24 uses that text with an explicit provisional-source qualification and no site. PR37 uses narrowed palace text with warcamps/pinnacle. PR48 still has the older Narak pin and shorter composite text.

This inventory establishes branch divergence, not a fresh primary-source validation. Preserve prior correction history; do not silently import the more precise PR37 landmark. [Supplement crosswalk](../deep-worlds/cosmere-supplement-crosswalk.csv), blob `9248b7ca93b3343b81a9033d2c1fce489641c8ca`, does not supply a separate e24 primary-scene closure.

## Known gaps and precise next action

- Second/final bounded SA02 unit: prioritize lawful published ending/scene evidence for e24 and e22–e23, reconciling L23 and the edition boundary. Use a conservative, explicitly qualified handoff if primary evidence stays unavailable; do not recreate an endless source search.
- Ending text and both edition variants not collated; cannot certify the events from early excerpts or the author's change note.
- Narak/Urithiru whole composites, parent payloads, 15 landmarks, exact maps/coordinates, wider work coverage and missing-content sweep remain unverified.
- At the two-checkpoint cap, hand off only justified finite corrections or defer full SA02 with Known gaps. No complete novel reading claimed.
- **0/4 complete PR48 book-5 events, 0/2 selected sites, 0/33 full works approved.** SA01 remains deferred, its two description corrections accepted at af49e0a. Preserve all prior closures, D09/D10 and technical/release holds, including Save/Load intermittency.

No application/PR-branch edit, merge, deployment or Mckay release approval. No user decision required for this continuation.
