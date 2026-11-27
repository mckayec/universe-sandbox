# CA01 source addendum: Canticle's sunset storm (2026-11-21)

This is a source addendum for the existing CA01 unit 1/2, not a stage transition, a full-work review or an implementation approval.

## One bounded correction: CA01-WEATHER-01 (SP06, sunset clause only)

The identical base-world `canticle.blurb` in `public/atlas/packs/cosmere.js` calls this event a firestorm at these checked heads:

- PR #24: [line 623](https://github.com/mckayec/universe-sandbox/blob/cf25cda66e91c573c421a0f3712623db72737a3b/public/atlas/packs/cosmere.js#L623) at `cf25cda66e91c573c421a0f3712623db72737a3b`.
- PR #37: [line 1186](https://github.com/mckayec/universe-sandbox/blob/03394c32816fcb5c95261bf6a9ea4520381a5838/public/atlas/packs/cosmere.js#L1186) at `03394c32816fcb5c95261bf6a9ea4520381a5838`.
- PR #48: [line 674](https://github.com/mckayec/universe-sandbox/blob/b202db06188bc11a694e5232ee0ce983882a7fb8/public/atlas/packs/cosmere.js#L674) at `b202db06188bc11a694e5232ee0ce983882a7fb8`.

[Author-hosted chapter 8](https://www.brandonsanderson.com/blogs/blog/the-sunlit-man-chapter-eight) describes the maelstrom at sunset, distinct from the sun's burning phase, and depicts wind and rain. [Chapter 9](https://www.brandonsanderson.com/blogs/blog/the-sunlit-man-chapter-nine) depicts wind, rain and lightning in that storm. These public excerpts independently corroborate the sunset clause of [prior supplied-edition finding SP06](secret-projects-primary-audit-2026-11-09.md). They do not newly verify an edition match or the entire book.

Recommended exact sentence replacement inside that one field: change `It spins backwards, rings light its night side, and a firestorm sweeps the sunset line.` to `It spins backwards, and rings light its night side. A powerful storm follows sunset, bringing wind, rain, and lightning.` The retained rotation and ring claims are unchanged in substance, not accepted by this addendum. If the existing CA01 review advances this to implementation, target PR #48 only after refreshing its head. Confirm that reversing this prose substitution restores full source/data equality, no other file or field changed, and inherited spoiler behavior remains unchanged. PR #24 and #37 are comparison snapshots, not parallel edit targets.

Do not change `eras[12]`, dawn or sunlight-height mechanics, facts, map, event entries, or reading gates under this correction. [Chapter 10](https://www.brandonsanderson.com/blogs/blog/the-sunlit-man-chapter-ten) separately shows that Wit appears as a projection, not a confirmed physical visit. Keep that attribution separate. These excerpts do not establish the later destination; keep SP05 and the candidate UTol claim separate. No app code, browser execution, merge, release or full-work sign-off.
