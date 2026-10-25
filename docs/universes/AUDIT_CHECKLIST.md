# Audit checklists

Each audit writes its results to the universe's folder as a table: **ID · severity (High/Medium/Low) · location (section, or pack file + line) · finding · evidence/source · suggested fix**. The fixing side adds a **Resolution** column (fixed / answered: why not).

## 1. Research self-audit and deep dive (ChatGPT → `research-audit.md`)
Run while Claude builds. Purpose: prove the research went deep and is right, not just plausible.
- [ ] **Coverage:** list every book/volume; for each, are its major places, events and journeys present? Name anything a dedicated fan would expect that is missing.
- [ ] **Re-verify every low-confidence and prominent claim:** every `(L)` claim, every prominent claim (titles, journeys, main labels), and anything that "sounds right" but came from memory, even if that's more than a quarter of the research. Open a source for each and report checked/total counts. If no independent second source exists, say so; don't manufacture one.
- [ ] **Fabrication sweep:** search for each proper noun and distinctive claim; flag any that only appear in your own text.
- [ ] **Chronology:** events in the right book and order; `first:` values never earlier than the reader learns the fact.
- [ ] **Canon contamination:** film/TV/game details mixed into book canon.
- [ ] **Cross-references:** every event/journey points at a place that exists in §3.
- [ ] **Second-source check:** for the 10 most important facts, confirm with a second independent source.
- [ ] Write corrections or additions to `research-addendum.md` and summarize the depth achieved (sources consulted, checked/total claim counts, coverage per work or layer). Put the audited research commit SHA at the top.

## 2. Research review (Claude → `research-review.md`)
- [ ] Template followed; every place/event has the fields the engine needs.
- [ ] Contradictions inside the research; unclear positions; missing `first:` values.
- [ ] Things the engine can't show yet (needs a new view or feature): list them and propose how.
- [ ] Questions for ChatGPT, if any (ChatGPT answers them in `research-addendum.md`).

## 3. Content audit of the build (ChatGPT → `audit-build.md`)
Inputs: the pack file (`public/atlas/packs/<id>.js`) **at the exact commit SHA** named in `status.md` and `build-report.md`, and the build report with screenshots. Record that SHA at the top of the audit.
- [ ] Every label, blurb, event, journey and codex entry matches the research and the source works.
- [ ] Nothing in the pack is absent from the research (catches build-side invention).
- [ ] Spoilers: base text safe for book 1; later facts only appear when their book is selected.
- [ ] Places are where they should be relative to each other; journeys go the right way.
- [ ] Tone: respectful (especially Track A), neutral where sources disagree, fan-work notice present.

## 4. Final joint audit (`audit-final.md`)
**ChatGPT (canon):**
- [ ] Re-check every High/Medium finding from §3 is resolved correctly.
- [ ] Spot-check 20 random entries against sources (all entries if fewer than 20); record the selected IDs and how they were picked.
- [ ] Every `(L)` claim is now verified, labelled as uncertain or as a model, or removed; no `(U)` claim ships.
- [ ] Every `research-addendum.md` item has a recorded disposition from Claude.
- [ ] Sign off: "Canon: approved" or list blockers.

**Claude (technical and visual):**
- [ ] Atlas validator: no errors (references, IDs, coordinates, spoiler order).
- [ ] `pnpm check` and the browser smoke tests pass, with no console errors and no third-party requests.
- [ ] Screenshots at 3840×2160, 1440×900, 1280×800 and 390×844: crisp surfaces and maps at 4K (no blurry textures, no hard-edged glows), readable labels, nothing clipped.
- [ ] Every world with a surface has meaningful sites; every event opens a real place; journeys animate along the right path.
- [ ] Performance: smooth on a phone-sized viewport; texture sizes scaled for mobile; no memory growth across navigation.
- [ ] Back link to Gravity Lab, fan-work notice, credits accurate.
- [ ] Sign off: "Technical: approved" or list blockers.

Both sign-offs name the commit SHA they approve. If content changes after a sign-off, the canon audit re-checks the changed content; if code changes, Claude re-runs the relevant technical checks. Only when both sign-offs for the same revision are present does the stage move to `ready-for-owner`; Mckay's approval is still required to go live.
