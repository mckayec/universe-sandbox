# Hierarchy final canon audit

**Canon sign-off withheld.** The sampled cards accurately represent the bounded prototype. The accepted research review expressly carries H2-05 as a canon blocker. Its ledger still has 0/10 independently corroborated claims and 0/2 whole novels audited. Rechecking the same author and publisher sources cannot close those gaps.

Reviewed `pack/hierarchy` at `cc965ccf3490bab8ce9f40b7c18df76b3ba28eb2` (PR #51). The scope is 22 places, six events, two partial journeys and ten ideas. HB-01 through HB-03 remain closed at the same SHA. There were zero High or Medium build findings. All six addendum items have dispositions in [research-review.md §2](research-review.md). The research record rows carry confirmed tags; the build attributes Caeror's uncertainty, labels editorial names and omits unverified geography.

## Random source check

I sampled 20 of the 40 research IDs without replacement and compared the records to the actual pack. Reproduction: take research-table order, seed a 32-bit LCG with the first eight hexadecimal digits of the PR SHA, iterate Fisher–Yates from the last row down with multiplier 1664525, increment 1013904223 and index floor(u32 / 2^32 × remaining count). Take the first 20.

| Records | Comparison and result |
|---|---|
| HP02, HP03, HP04, HP05, HP13, HP15, HP16, HP17, HP18, HP19, HC03 | The glossary supports the academy's island, Vis's homeland, Letens's capital status, Caten's surrounding region, the eastern country, the shared sea, Agerus and its funerary area, the strait and the rebel group. The cards retain relative geography. [Author glossary, Locations and Anguis](https://www.jamesislington.com/hierarchy_world.html) |
| HC06, HC10 | The prison scene distinguishes Governance, Military and Religion. Vis describes the pillars' role in enabling ceding. Both are book-I claims. [First novel, chapter I](https://www.simonandschuster.com/books/The-Will-of-the-Many/James-Islington/Hierarchy/9781982141172) |
| HP08, HP09, HP12, HP21, HE03, HE06, HC07 | The synopsis names three versions of Vis. Chapter I supports the escape through the hall, ascent, descent into a crater below the sphere, Caeror's identification of Obiteum, and activation of the archway. The device site retains its editorial label. Neither event asserts an onward destination. [Second novel, synopsis and chapter I](https://www.simonandschuster.com/books/The-Strength-of-the-Few/James-Islington/Hierarchy/9781982141233) |

20/20 sampled records supported for the displayed propositions. No new copy correction. Before another final handoff, supply claim-level independent evidence against H2-05 and a disposition of the outstanding novel coverage under H2-04. Keep the source limits explicit. Resubmitting this same build and ledger will give the same result.
