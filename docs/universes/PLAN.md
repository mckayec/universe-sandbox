# New universes: kickoff plan

This folder is the shared workspace for adding new universes to Gravity Lab. Two AIs work in it:

- **ChatGPT (research + audit)**: researches each universe, audits its own research, and audits Claude's build for canon.
- **Claude (build + audit)**: turns the research into an atlas pack, tests it, and audits ChatGPT's research while building.

Neither AI's work goes live on its own. Every universe passes through both and then the owner (Mckay) before it is merged.

Everything lives in this repo so both AIs can read it at any time:

| File | Purpose |
|---|---|
| `PLAN.md` | This plan: tracks, order, roles, stages, rules |
| `QUEUE.md` | Every planned universe, its track and its folder |
| `WORKFLOW.md` | The stage-by-stage handoff and how status is recorded |
| `RESEARCH_TEMPLATE.md` | The exact structure ChatGPT's research must follow |
| `AUDIT_CHECKLIST.md` | What each audit checks (research, content, final) |
| `PROMPTS.md` | Copy-paste prompts for ChatGPT at each stage |
| `packs/<id>/` | One folder per universe: `status.md`, research, audits, build report |

## The four tracks

The requested universes are not all the same kind of thing. They fall into four tracks with different engine needs.

| Track | Universes | Shape | Engine status |
|---|---|---|---|
| **A. Real-world religion & history** | LDS standard works (Bible, Book of Mormon, D&C + church history, Pearl of Great Price), Christian apocrypha, Abrahamic divergence & world religions | Real Earth geography, people's journeys, timelines, a branching tree of traditions spreading across the world map | Built-in Earth exists. Needs: historical map layers, a **branching-tree view**, multiple competing models (e.g. Book of Mormon geography) |
| **B. Single-world fantasy** | Wheel of Time, Lord of the Rings (Middle-earth), Narnia, Throne of Glass (+ Maasverse links), Licanius, Hierarchy, Harry Potter (Wizarding World) | One detailed drawn continent map, many sites, journeys, a book-gated timeline | Drawn maps (`gfx.map`) and sites exist. Needs: a **world-only mode** (open straight onto one world, no galaxy) |
| **C. Galaxy-scale fiction** | Star Wars, Star Trek, Stargate, Marvel (cosmic), Sanderson's non-Cosmere works (Skyward/Cytoverse, Reckoners, Legion, Rithmatist, Alcatraz) | Star map, planets, routes, book/film/series filters | Fits the current engine as-is |
| **D. Unusual structures** | Dungeon Crawler Carl (dungeon floors), He Who Fights Monsters (multiverse), Disney (only partly one shared universe) | Custom view per universe | Needs a design session each |

### Recommended order

1. **LDS standard works atlas (Track A)**, built as **one atlas with layers** (Bible, Book of Mormon, D&C and church history, Pearl of Great Price) instead of five separate packs, so shared places and people are not duplicated. "All combined works" is simply all layers on. Christian apocrypha becomes a later layer of the Bible portion.
2. **Abrahamic divergence & world religions (Track A)**: reuses the Earth tools and adds the branching-tree view.
3. **Wheel of Time (Track B)**: builds the world-only mode that every other single-world fantasy then reuses.
4. **Remaining Track B**, then **Track C**, then **Track D**, a few per session.

The owner can reorder at any time by editing `QUEUE.md`.

## Rules that apply to every universe

### Canon and sourcing
- Follow the **primary source** (the books/scripture) unless the pack explicitly says otherwise. Flag where film/TV canon differs; never mix it in silently.
- Every fact in the research carries a source and a confidence level. Anything that cannot be sourced is cut, not guessed. Fabricated details are the main risk with AI-written lore.
- Where sources disagree, present the disagreement neutrally rather than picking a side.
- Spoilers are gated by book/era using the engine's spoiler system; base text must be safe for a reader on book 1.

### Religious content
- Describe each tradition in its own terms and respectfully. Distinguish **what the text says**, **what adherents believe**, and **what historians/scholars say**, and label which is which.
- Book of Mormon geography has no official Church position: present the main proposed models side by side as models, not facts. Never present one as settled.
- No ranking of religions, no proselytizing in either direction.

### Copyright and IP
- This is an unofficial, non-commercial fan project. Every pack shows a short fan-work notice naming the rights holders.
- No official art, logos, film stills, or traced maps. Maps are schematic reconstructions drawn procedurally.
- No long quotations from the works; paraphrase (scripture quotations from public-domain translations such as the KJV are fine).
- Higher-enforcement IP (Disney incl. Star Wars and Marvel, Paramount's Star Trek, MGM/Amazon's Stargate, Warner/Rowling's Wizarding World) stays strictly non-commercial; the owner may choose to keep these packs off the public site.

### Quality bar ("4K / high definition")
- Surfaces and maps render crisply at 3840×2160 on desktop (procedural or high-resolution generated textures, no blurry upscales, no hard-edged sprites), with mobile-scaled versions that stay smooth.
- Every world has meaningful sites; every event points at a real place; journeys follow the source.
- The pack passes the automated validator, the browser smoke test, and the final joint audit before the owner sees it.

## Definition of done (per universe)
1. Research complete, self-audited by ChatGPT, and reviewed by Claude.
2. Pack built by Claude, passing validator, tests, and visual checks at desktop 4K, laptop and phone sizes.
3. Content audit by ChatGPT with every finding resolved or explicitly answered.
4. Final joint audit signed off by both.
5. Owner approves, then Claude merges and confirms the live deploy.
