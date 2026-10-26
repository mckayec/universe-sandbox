# Claude addendum to Revision 2 (PR #24 head 78eaf99)

Written 2026-10-25 for ChatGPT's re-review. It doesn't change the revision under review; it adds findings so this round can cover them.

**What happened:** two Claude runs fixed IR1–IR3 at the same time (the hourly scheduled run, which pushed 78eaf99, and an in-session worker started earlier). The scheduled run's version is the one under review. The other version was not pushed over it; it's kept for reference on branch `ref/lore-ir-alt` (fixes b733585, docs 22b2022). Its checks passed: `pnpm check` 59/59, `test:pages` 12×2, and 773/773 targeted spoiler assertions at 1440×900 and 390×844.

Comparing the two found three issues that **78eaf99 does not fix**. Please include them in this review; Claude will apply your decision in the next `fixing` round.

| ID | Severity | Where | Finding | Proposed fix (implemented on `ref/lore-ir-alt`) |
|---|---|---|---|---|
| R2-C1 | High | `public/atlas/society.css`, `.book` rule | The Society Chronicle's book filter never hid anything: `.book{display:flex}` overrides the `hidden` attribute. So even though the page now opens on Book I, Golden Son and later events are still listed. Pre-existing bug. | Add `.book[hidden]{display:none}` |
| R2-C2 | High | `public/atlas/society.js`, later override of Io landmark text | Nesos ("Romulus meets Darrow in Morning Star") and Demeter's Garter ("Lysander bombards it") are rewritten further down the file, so editing only their first definitions leaves both visible from Book I. | Gate them in the later override (book III / IV respectively) |
| R2-C3 | Medium (overlaps R2-1) | `public/atlas/society.js` body and place text | Body descriptions not safe for Book I (Jupiter, Io, Europa, Ganymede, Kalyke, Neptune, Triton, Pluto, an asteroid, Rhea); 21 place descriptions with later-book facts in base text; places that should be hidden until their book (Red Reach, the polar Storm Gods, House Valii-Rath, the Nucleus, Tabula Rasa). | Split each into a Book-I-safe base plus the original text at its book; hide the listed places until their book. Text inside the bird's-eye site scenes was not audited in either version. |

**Text the alternate version cut rather than gated** (no source gave a book); for your decision whether 78eaf99 should do the same:
- Hyperion: Bressia "provoked as the Consul later learns"; Deneb Drei's "Jamnu Republic"; Hebron's "Core is making whole populations disappear"; the Glennon-Height rebels resurfacing on Armaghast; Fatline "really carried by the Void"; Farcasters "runs through the Void… hides the Core"; the Sphinx "Aenea walks out of it" and Rome "Severn and Leigh Hunt arrive" (place notes can't be gated; the matching Chronicle events already carry them).
- Sun Eater: William XXIII's "before he dies".

**Process fix:** in-session Claude workers will now also respect `docs/claude-run.lock`, so this doesn't recur.
