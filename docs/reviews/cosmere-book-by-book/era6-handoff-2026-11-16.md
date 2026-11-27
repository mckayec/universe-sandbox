# MB05: bounded Elendel setting handoff

Date: 2026-11-16 UTC. Researcher: ChatGPT. Disposition: three nested field candidates ready for Claude's finite implementation on PR48; source review remains incomplete.

Audited implementation: PR48 `feature/cosmere-reading-state`, **5ab3eacc79476bc69a88879b1abb696d13be263f**, pack blob `0f333af7203077291dbc211799c8c47ecff7cb2a`. This document proposes a change; the candidate is not present at that head. SCR-01 remains closed under [implementation-review-5ab3eac.md](implementation-review-5ab3eac.md).

## Decision and scope

Replace only Scadrial's `eras[6].status`, `eras[6].blurb`, and `eras[6].facts` with the bounded setting below; add their three individual field gates. The current era-6 paragraph combines several held geographic, cosmological and historical claims. The opened opening-chapter evidence supports a smaller scene-specific description without certifying that larger paragraph. Removing those assertions from this field does not establish that they are false.

This unit covers **7/7 narrow setting/chronology claim units**, comprising **6/6 direct-excerpt observations and 1/1 official-synopsis chronology statement**. These support **3/3 nested field candidates**, not three complete records or an entire era container. No full novel, complete star chart, planetary geography, magic system or whole-parent approval is claimed. Research used ordinary source-based web search and opened pages; the separate Deep Research product was not invoked.

## Evidence and earliest-work boundary

Sources were opened on 2026-11-16. Stable chapter/section locators control; web extraction line numbers are supplementary and can change.

| Unit | Supported content | Evidence and locator | Classification / confidence | Mapping boundary |
|---|---|---|---|---|
| E6-01 | Elendel setting | S1, chapter 1, Wax at Cett Mansion's balcony; extracted line 27 | Direct novel excerpt / high | MB05, chapter 1 |
| E6-02 | Railway | S1, balcony view along Demoux Promenade; line 31 | Direct novel excerpt / high | MB05, chapter 1 |
| E6-03 | Canal | S1, same passage; line 31 | Direct novel excerpt / high | MB05, chapter 1 |
| E6-04 | Electric street lamps | S1, same passage; line 31 | Direct novel excerpt / high | MB05, chapter 1 |
| E6-05 | Unfinished steel towers | S1, Ironspine/Tekiel passage; line 32 | Direct novel excerpt / high | MB05, chapter 1 |
| E6-06 | Both carriage types | S1, Wax above the promenade; line 56 | Direct novel excerpt / high | MB05, chapter 1 |
| E6-07 | Approximate trilogy-to-MB05 interval | S2, Book 1 / Synopsis, opening paragraph; S1 Book Details, line 119 | Official synopsis, not a quoted novel date / high within this coarse scope | MB05; no exact calendar year inferred |

“Industrial” is an editorial summary of this setting, not a canonical title. The work-specific framing in the blurb is deliberate: the engine can retain this field in later reading states. Nothing here establishes unchanged conditions throughout later novels. The gate maps the evidence to MB05; it does not assert exhaustive earliest mention across every earlier short work. The new text does not rely on the later books' synopsis sections.

### Source register and access limits

- **S1 — Brandon Sanderson, The Alloy of Law, chapter 1**, [Tor/Macmillan authorized excerpt](https://us.macmillan.com/books/9781250860002/thealloyoflaw/), ISBN 9781250860002 page, “Read Excerpt.” The relevant opening setting passages were read directly, including the vehicle passage. Successful canonical URL retrieval was reconfirmed after an alternate hyphenated route failed. The page's 2023 on-sale date describes this catalog edition, not the original publication date. No full-book reading is claimed.
- **S2 — Author's [Wax & Wayne series page](https://www.brandonsanderson.com/pages/the-mistborn-saga-the-wax-wayne-series)**, Book 1 / The Alloy of Law / Synopsis. Official promotional evidence for E6-07; not a substitute for a located novel chronology passage. Publisher and author synopsis wording are shared publicity, not independent witnesses.
- **S3 — Author's [The Alloy of Law Sample Chapters announcement](https://www.brandonsanderson.com/blogs/blog/the-alloy-of-law-sample-chapters)**, link to Tor's prologue/chapter-1 preview. Provenance only. Following its original Tor link initially returned the [Reactor-hosted excerpt](https://reactormag.com/the-alloy-of-law-excerpt/), dated June 15, 2011; the opening chapter matched the relevant setting. Later find/open attempts through the old Tor and canonical Reactor routes returned 403. This does not prove absence or invalidate the successful earlier retrieval; S1 supplies the direct evidence used here. These hosts reproduce the same work, not independent canon testimony.

## Exact candidate for Claude

Find `worlds` record `id: 'scadrial'`, then **that world's `eras[6]`**. Preserve the rest of the object and any unrelated gates. Use this candidate:

```json
{
  "status": "The Alloy of Law · industrial Elendel",
  "blurb": "In The Alloy of Law, Elendel has railways, canals, electric street lighting and steel-framed towers under construction. Horseless carriages share its streets with horse-drawn vehicles.",
  "facts": [["Era", "About 300 years after the original Mistborn trilogy"]]
}
```

Add the following value separately to **`eras[6].gates.status`**, **`eras[6].gates.blurb`**, and **`eras[6].gates.facts`**:

```json
{"in":["the-alloy-of-law"],"req":"the-alloy-of-law"}
```

`the-alloy-of-law` is the actual registry ID. Do not add a world record gate or era record gate. Preserve world/era fallback intersection, the existing MB01 field gates, numeric legacy behavior, All behavior, and every unrelated gate. The narrow MB05 child mapping does not lift the unreviewed ancestor restrictions. In the reviewed per-work subset matrix, the era remains unavailable until the complete original-trilogy and bucket-6 sets are present. No change to registry, presets, engine, reading helper, geometry or other records is requested.

In particular preserve the accepted local `distText` qualification and artist-model note. Preserve `eras[10].status` as its separate held field; numeric 10/All can still select that status while retaining this work-framed era-6 blurb/facts. Do not claim that all mentions of Harmony or all residual Scadrial claims disappear site-wide. Do not restore the older branch's orbital, Shards or magic facts.

## Branch reconciliation

Actual pack files were fetched at these PR heads and their Git blob hashes verified:

| PR / branch | Exact head | Pack blob | Relevant comparison |
|---|---|---|---|
| 24 / `fix/lore-corrections` | `cf25cda66e91c573c421a0f3712623db72737a3b` | `3ff0aab059fa54e00f6e2ccc7b849d4bd206d958` | Era-6 blurb matches PR48; status/facts retain older material |
| 37 / `atlas/deep-worlds` | `03394c32816fcb5c95261bf6a9ea4520381a5838` | `5a74e300eaf88b2d3c81fa9bc957584cd4708e33` | Same comparison; do not import deep-world geometry/landmarks |
| 48 / `feature/cosmere-reading-state` | `5ab3eacc79476bc69a88879b1abb696d13be263f` | `0f333af7203077291dbc211799c8c47ecff7cb2a` | Implementation target; already reduced status/facts and qualified distance copy |

The **2/2 cross-branch blurb comparisons** matched; the entire era objects do not. No PR24/37 edit or merge is requested. Reconcile again if any head moves before implementation.

## Prospective validation, not implementation certification

[Reviewer runner](era6-reviewer-probe-5ab3eac.mjs) and [complete output/manifest](era6-reviewer-output-5ab3eac.json) record an independent in-memory proposal check executed with Node v24.22.1. **6/6 input blob hashes** matched: four PR48 executable inputs and two other-branch packs. The runner extracts the pinned test harness and executes the actual pinned engine, reading helper and pack; it modifies only an in-memory era-6 object.

- **136/136 state/realm cases passed**: 8 original-trilogy subsets × 8 bucket-6 subsets × 2 realms = 128; legacy 2/6/10 and All × 2 realms = 8. This is not an enumeration of all 33-work combinations.
- All three proposed era field selectors obeyed the expected ancestor intersection; displayed copy changed only in eligible states. World visibility, name, Cognitive card, star and model note stayed equal to the unmodified head. The era-10 status override remained intact. Restoring the era-6 object reproduced the original world object exactly.
- **8/8 counterfactual controls** detected that the unchanged head still has the old blurb in the eight eligible states. This distinguishes the proposed copy from the real head; it does not separately demonstrate that a child gate can override a parent restriction.
- **0 independent browser cases** and no rendered candidate screenshots. The earlier **30/30** focused tests in the SCR-01 review apply to the unmodified head, not this future patch. The prospective runner does not certify source truth, styling, complete UI behavior, or full-pack canon.

Reproduce with Node supporting `stripTypeScriptTypes` and authenticated GitHub CLI:

```sh
node docs/reviews/cosmere-book-by-book/era6-reviewer-probe-5ab3eac.mjs --fetch > era6-result.json
```

The `--fetch` convenience path is supplied for reproduction; this review executed the saved-input path, populated from authenticated GitHub reads. Both enforce the same pinned manifest. Saved-input schema: `{head, files: {path: {content, sha}}, other: {"24": {head, content, sha}, "37": {head, content, sha}}}`. The output includes all 136 cases. No source file is rewritten by the runner.

## Known gaps and continuation

Chart-dependent claims remain **held**. This run opened the author's [tenth-anniversary announcement](https://www.brandonsanderson.com/blogs/blog/tenth-anniversary-leather-edition-of-mistborn-the-final-empire-other-goodies) and Dragonsteel's [Star Chart Prints Set](https://www.dragonsteelbooks.com/products/star-chart-prints-set). Those establish product/art provenance, not every planet's order, moons or an earliest-novel spoiler threshold. The linked [product composite](https://www.dragonsteelbooks.com/cdn/shop/files/Artboard1.png?v=1699916551) was downloaded and visually inspected: at 1080×1080, overlapping prints obscure part of the Scadrian chart and fine labels are insufficient. **0 complete legible chart audits** resulted. Coppermind's Scadrian-system page and linked color-chart file were inaccessible in this run; snippets were not treated as opened evidence. Defer that complete-chart/essay unit until a usable primary artifact is available rather than repeating this checkpoint indefinitely.

The omitted era-6 combined-Shards/world-remaking, climate, Basin population/location/mountain-ring, Roughs and southern-continent assertions remain distinct future source units. The base star field, Cognitive geography/threshold, era-10 status, relevant Harmony codex material, Luthadel residue and physical model are not certified by this excerpt. “Held” denotes a research disposition, not a promise that the current application hides the field in every mode.

Prior ledgers stay **4/10 listed parent fields narrowed, 6/10 held; 0/2 whole parents promoted; 2/7 PR48 key-2 events mapped; 8/148 narrow candidate fields in the earlier broader inventory and 140/148 held; 0/33 full-work approvals**. This new three-field nested denominator is recorded separately; do not add it mechanically to the earlier inventory or mark its containing era reviewed. MB05 is a partial excerpt/synopsis unit with known gaps, not a completed book audit.

## Finite return required from Claude

Implement only the three fields and three own gates above on PR48; add targeted regression checks and identify the exact new head and parent. Supply actual diff/file evidence, exact input hashes, focused and repository-required validation results, plus a parent negative control. If a required check is unavailable, report it as unavailable, not passed.

For rendered evidence, show readable desktop and expanded-phone dossier content in Physical and Cognitive modes, covering the eligible complete OT+bucket-6 state, a partial-set denied state, numeric legacy 6 and 10, and All. Verify both candidate copy and preserved era-10 override; check the continued local qualifier/model note. Distinguish programmatic navigation, supplied screenshots, and independently exercised pointer interactions. Preserve the whole-parent unreviewed indication. Do not assert site-wide absence of deliberately retained held claims.

Return `implementation-review / chatgpt` with that evidence, or a precise implementation blocker. After bounded acceptance, the next source unit is one specifically located primary passage for a remaining Scadrial field, with its own work/field boundary; the chart unit remains a named known gap. No application edit, merge, deployment, canon sign-off or Mckay release approval was performed by this research run.
