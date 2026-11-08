# Bounded canon disposition — eight holds at 5bfde31

2026-11-08, ChatGPT. PR37 `atlas/deep-worlds`, exact head **5bfde313d819ab89e273af4b9c6a5f788d6d6f3d**.

**Canon: not approved.** The technical disposition is accepted within its stated technical scope, including DWT-03-R1's tree-integration trigger. Its proposed blanket “Canon: approved with Known gaps” does not follow from the available source evidence. R3 ends open-ended research; it does not turn unsupported assertions into verified prose. No new primary source was opened in this disposition, and no claim is judged false merely because evidence is incomplete.

## Eight holds: choose omission, not undocumented retention

Read [technical disposition](technical-disposition-5bfde31.md), [earlier dependency return](fix-return-80b8514.md), [independent hold review](implementation-review-80b8514.md), audit.md and implementation.md. Fresh exact-head Expanse and Hyperion pack reads confirm unchanged blobs **7834a74f251356ed600940e0a9016c8caa563663** and **982f0babb6a53929d5c7d4905c52f3cd84d6fe5d** and the named hold/dependency text.

Authorize this finite omission batch for Claude. It deliberately sacrifices coverage instead of asserting unsourced replacement facts:

| Hold | Required omission |
|---|---|
| SP09 Expanse medina/drum landmark drumring | Remove landmark together with b3f and dependent b3i |
| SP10 Expanse medina/drum landmark engineering | Remove landmark together with b3o and dependent b7d |
| SP11 Expanse b3f | Remove event; preserve separately corrected b3l |
| SP12 Expanse b3o | Remove event and its attached battle invocation |
| SP13 Hyperion tombs landmark sphinx | Remove landmark and duplicate hyperion/sphinx site with its nested scene/landmarks and site-dependent b1i2, b2k, b3b |
| SP14 Hyperion tombs landmark jade | Remove landmark |
| SP15 Hyperion b1n | Remove event |
| SP16 Hyperion b2b | Remove event |

Unique top-level removal targets: **14 objects = 8 held objects + 6 dependency objects**. Expanse: 2 landmarks + 4 events. Hyperion: 2 Tombs landmarks + 1 separate Sphinx site + 5 events. Nested children removed with the site are not additional independent top-level targets. No replacement dates, coordinates, historical truth claims or newly unanchored versions of the removed events.

Before applying, Claude must inventory actual incoming references across the branch. If any additional dependency appears beyond this named closure, stop that sub-cut and return its exact selector rather than cascade silently. Preserve all unrelated accepted wording, book gates and structural corrections. Remove now-unreachable scene mappings only when their sole owner is one of these removed objects; list them separately in the return. These are editorial omissions, not claims that the books lack these places/events.

## Society and remaining coverage: precise continuation

The Society file is **not empty**: GitHub contents returned an empty payload for blob **59c3eb5237161eaa6784b18e46ebc4bf3e5555e9**, so the actual 1,237,516-character blob was retrieved separately. Targeted inspection identifies the outstanding prologue/early-Europa candidates:
- event g1, book 4, Mercury/poi tyche, effect irongoldprologue;
- set-piece irongoldprologue with site tyche;
- POIS.europa lornhome description (white limestone, far-northern island, private forest);
- Tyche's book-keyed descriptions and the book-IV availability rationale in implementation.md.

This is a **target inventory, not source verification or a complete Society audit**. Do not cut the whole Europa scene: later Athena material shares that scene and needs a distinct disposition. Do not silently revert previously accepted lore corrections or move gates on the assumption that an unverified prologue location is established.

Claude's next bounded return: apply the named eight-hold/dependency omission batch, and supply one exact-selector Society source-or-omit table for the candidates above (current text, incoming event/effect/button references, proposed narrow deletion, and any already available primary locator). Do not start another general book-research loop. ChatGPT then reviews the actual diff and that finite Society packet. No Society cuts are authorized by this inventory alone.

## Acceptance and limits

Return exact head/diff, unique object counts, unchanged accepted-leaf checks, no dangling site/landmark/event/effect references, and focused omission behavior for stale links, chronicle/tour, Back and book gates. Use current validators/build and relevant tests; do not rerun unrelated completed navigation diagnosis without a changed dependency.

**8/8 held objects have an explicit omission disposition; 0/8 are newly source-verified; 0/14 removals are implemented by this document.** The prior 18 narrowed leaves, three scoped retains and three Dune omissions remain accepted only within their existing scopes. The **139 unselected records**, other DW06 claims and Society content are still outside a completed full-canon audit. Removing these 14 objects will not itself authorize a whole-pack canon sign-off or ready-for-owner transition.

Return **fixing / claude** for the finite batch and Society dependency packet. Source scope remains capped/deferred; technical screenshot/Society-suite gates and Mckay release approval remain separate. No application edit, PR branch write, merge, deploy or approval on Mckay's behalf.
