# Licanius final canon audit

**Sign-off withheld at `766a7627fcac419ae2ca8294ceb16ba02b50e3e5`, PR #50, `pack/licanius`.** The corrected coalition card passes. The [research review](research-review.md) records two independent corroborations out of ten and no primary novel audit out of three. Both affect canon clearance; the third novel contributes publisher-premise cards only.

## Sample and findings

Population: all 29 seed IDs in research-file order, including the three journey bullets. Fisher–Yates without replacement, seeded from the first eight hex digits of the audited SHA, using unsigned LCG (1664525, 1013904223) and floor(u32 × remaining / 2^32). The first 20 records gave the groups below.

| Checked IDs | Source judgment |
|---|---|
| le01, caladel, desriel, boundary, lj01, le02, res-kartha | The first recap supports the school departure, Desriel crossing, barrier and displacement at Deilannis. The journey is an ordered subset of stops. The book-I Res Kartha card stops at the Lyth dwelling. [Author recap, pp. 1, 3–6, 8](https://jamesislington.com/ShadowRecap.pdf) |
| lc02, lc03, lc04, lc05 | The historical preface connects Andrael to the blade, the time device to Deilannis and the Lyth to the displaced Darecians. LC05 distinguishes two characters' interpretations. [Combined recap, pp. 1–4](https://jamesislington.com/EchoRecap.pdf) |
| alkathronen, lj03, daren-tel, lj02, ilshan-gathdel-teth | The recap identifies the snow-covered city, movement north, the family estate, the capital return and the place of captivity. The journeys omit intermediate stops and imply no distance. [Combined recap, pp. 15–20](https://jamesislington.com/EchoRecap.pdf) |
| le05 | Asha investigates the disappearance of the Shadows. The card uses the LR-01 correction. [Book II description](https://www.hachettebookgroup.com/titles/james-islington/an-echo-of-things-to-come/9780316274128/) |
| lc06, le03, le04 | Captivity, the repaired Boundary and the threat to Andarra are supported at premise level. LE04 states Wirr's objective without asserting success. Its book-III gate and premise qualification remain intact. [Book III description](https://www.hachettebookgroup.com/titles/james-islington/the-light-of-all-that-falls/9780316274173/) |

20/20 records checked at the source level identified above. LB-01 (the only Medium build finding) and LB-02 remain closed. The L2-01–05 dispositions cover the editorial Caladel label, completed-through gate convention, book-III limitations, independent evidence and nonspatial journeys. Later history stays out of the early Res Kartha card. No sampled uncertain inference needs promotion to fact.

**Continuation.** Keep the 29-record prototype and its source labels. Supply the eight missing independent corroborations with claim-level locators and resolve the primary-text clearance recorded in §5 before returning this head for sign-off. The sampled recaps share authorship and overlapping text. Duplicate excerpts and publisher listings cannot fill those eight slots.

## Final review after R3 integration · 2026-11-27

Reviewed [PR #50](https://github.com/mckayec/universe-sandbox/pull/50) at `766a7627fcac419ae2ca8294ceb16ba02b50e3e5`, pack blob `13e5586d1c89174f3a8189a970c94b53eca1e054`. The PR still contains the exact file sampled above. The same head seed selects the same 20 IDs. I carried forward their recorded source dispositions and reopened the linked sources. This adds zero new sample IDs. The change since the previous verdict is the [claim-level addendum](research-addendum.md) and [Claude’s integration in §7](research-review.md).

The two earlier confirmations and three R3 additions cover 5/10 selected assertions. The located time displacement, capital and Boundary/Andarra orientation agree with the cited secondary accounts. Five entries retain single-author support for part or all of their wording: the Boundary’s composition, Deilannis’s status and location, the intermediate journey stop, the blade’s maker/function, and the Lyth’s origin and survival. The two author recaps overlap and cannot serve as independent witnesses to each other. The only Medium build finding (LB-01) remains resolved: LE04 describes Wirr’s goal and leaves the outcome open, matching the book-three publisher premise. LB-02 also remains closed. The displayed gates still require completed books; the review found no new chapter-level clearance. Whole novels audited: 0/3.

**Blocker — D15.** Mckay’s evidence-scope decision is pending in [DECISIONS.md](../../DECISIONS.md). The bounded evidence review is complete. If the labelled seed scope is accepted, return this head to ChatGPT for the scoped canon disposition; if full coverage is required, assign the outstanding evidence work first. The decision itself does not authorize release.
