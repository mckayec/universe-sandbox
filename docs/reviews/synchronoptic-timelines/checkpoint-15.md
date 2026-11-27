# Timeline checkpoint 15 — per-relationship citation review (grounding ledger), nothing promoted

Parent: 5c66abb (checkpoint 14 evidence; runtime 491b71c). Branch `engine/timelines` (draft PR #45). Not merged;
no release acceptance. PR33 untouched (pack read at 4ea8738 for the ledger only). Adapter still isolated and unwired.

This is the “review citations per relationship rather than promoting every see link from a card citation” unit
from the checkpoint 13 return. It adds the review machinery and a full ledger. **No relationship is promoted in this
unit**: every edge's `src` stays empty and `drawable` stays 0, because promotion is a per-row review decision.

## What changed

- **`public/atlas/timeline-grounding.js`** (new, pure, no host loads it yet; `timeline.js` is unchanged):
  - `parseLocator({t, u})` reads a citation into book (from the official URL's volume/book), chapter(s) and verses
    (from the label). “D&C 52 heading” is a heading, “D&C 117 heading, 1, 10” is the heading plus verses 1 and 10;
    a label whose chapter disagrees with its URL is marked `loose` and carries no verses.
  - `groundLink(fromSrc, toSrc)` classes a relationship by what **both** endpoint cards cite: `shared-verse` (at least
    one identical verse; the overlap is returned), `shared-chapter` (same chapter, one side cites it whole, or both
    cite the same heading), `same-chapter` (same chapter, different verses), `cross-text` (no common chapter),
    `no-locator`. A heading never grounds against a chapter's verses. **A class is evidence for a reviewer, not a
    source.**
  - `applyEdgeSources(model, reviewed)` promotes an edge only when a reviewed entry names it **and** every locator in
    the entry lies inside the passage both endpoint cards cite. The citing card's own citation for a link to another
    text (e.g. Mosiah 12 for “his law, in Abinadi's defense” → Moses) is rejected as `cross-text`; a widened locator
    (52:36–37 where both cite only 52:37), a heading offered for verses, an empty entry and an unknown edge id are
    rejected with a reason. A reviewer may narrow a locator inside the shared passage (e.g. one verse of 124:91–96).
  - `ledger(model)` lists every edge once with its class; it never promotes.
- **Tests:** `tests/atlas-timeline-grounding.test.ts` (5 tests): parser, every class, promotion only inside the shared
  passage, rejections, ledger never promotes.

## Ledger on the real pack (PR33 4ea8738)

[tl15/grounding-ledger.mjs](tl15/grounding-ledger.mjs) → [tl15/see-grounding.csv](tl15/see-grounding.csv) (one row per
relationship: id, type, label, both cards, both citations, shared passage) and
[tl15/ledger-summary.json](tl15/ledger-summary.json). **335 relationships** at this pack (329 at dd62a45; the pack has
grown): 5 travel legs + 330 `see` links.

| class | count | by type |
| --- | ---: | --- |
| shared-verse | 73 | all `context` (D&C office/charge relations, plus 3 Nephi 12 ↔ Matthew 5:1–12 and 2 Nephi 30 ↔ Isaiah 11:4–9) |
| shared-chapter | 13 | 4 describes, 7 context, 2 same-entity (e.g. D&C 121 / 110, Testimony of Eight, Daniel 1) |
| same-chapter | 10 | context |
| cross-text | 231 | 121 context, 60 same-entity, 38 quotation, 8 within, 4 describes |
| no-locator | 3 | 1 same-entity (the two Enoch's city cards), 2 context |
| travel | 5 | unsourced route legs (unchanged) |

`drawable` remains **0** on the real pack.

## Findings for the reviewer (decisions needed; nothing built for these)

1. **Promotion rule.** Proposed: a relationship may be drawn only with a reviewed locator cited by both endpoint
   cards (enforced by `applyEdgeSources`), after a per-row reading confirms that the verse itself states the
   relationship. Accept or amend.
2. **The 73 shared-verse rows** are the only mechanically groundable candidates. Most are single verses
   (D&C 52:37 Basset/Ryder; 124:127–142 office lists; 118:6 the four appointed to the Twelve; 75:6–9 companion
   pairs). Some overlaps are wider than the relation (Hyrum Smith ↔ William Law share 124:91–96; the relation is in
   a narrower verse) and should be narrowed in the reviewed entry. None has been confirmed against the official text
   in this unit; the ledger is the worklist.
3. **Cross-text rows (231)** cannot be grounded from card citations at all. All 38 `quotation` links fall here: the
   quoting card cites the Book of Mormon chapter, the target cites its own Bible passage, and neither cites the
   parallel (e.g. 2 Nephi 20 ↔ Isaiah 10). These need relationship-level research locators (the parallel's exact
   range), not card citations; they stay listed, not drawn.
4. **Rendering.** The chart draws a sourced edge only between rows it lays out; most promoted D&C relationships would
   join undated records. How promoted relationships between undated (folded) records are shown belongs to the
   wiring unit and is not checked here.

## Checks at this head

`pnpm format`; `pnpm check` (format, build, **140/140** tests, check:dist **122 files OK**); `pnpm test:pages`
(12 pages × 2 viewports); `pnpm test:browser` passed ([log](tl15/browser-smoke.txt)), Playwright Chromium 1243 via
`CHROME_PATH`. No UI changed, so no new screenshots.

## Not done

Confirming any shared-verse row against the official text and promoting it; relationship-level locators for
cross-text links (quotations first); host wiring; host chapter selector; record/travel sources;
chronology/genealogy/succession; CH13/X08; physical devices/AT; 4K of the folded view; release gates.
