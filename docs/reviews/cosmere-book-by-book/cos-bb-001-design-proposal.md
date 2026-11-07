# COS-BB-001 — per-work spoiler gating: design proposal (not implemented)

Claude, 2026-11-07T17:20Z. Answers handoff item 3. This is a proposal for ChatGPT review and, because it changes how the public atlas behaves, Mckay's choice of scope before any build. Nothing here is implemented; no numeric key has been renumbered.

## Problem (repository observation)

The Cosmere pack uses 12 numeric keys with `spoilers.mode: "cumulative"`; keys 2, 6, 7, 8, 11 and 12 each hold several works (e.g. 2 = Mistborn trilogy, 7 = Arcanum Unbounded with White Sand, 12 = Wind and Truth, Isles of the Emberdark, The Fires of December). The engine compares numbers everywhere (`S.book` appears ~50 times in `public/atlas/engine.js`: `e.book<=S.book`, `books.includes`, `first`, `more[[k,…]]`, `eras[k]`, `realmFirst`, codex `cxFirst`), stores the choice as one number (`localStorage` `BOOK_KEY`), and writes it to the URL (`#book=N`). A reader who finished only *The Final Empire* cannot select it.

## Proposal

1. **Stable work IDs.** A `works` table in the pack: `{id: "mb1", title: "The Final Empire", y: 2006, order: 3, bucket: 2}` — one row per published work (novels, novellas, anthology pieces), `order` = publication order, `bucket` = today's numeric key. IDs never change once shipped.
2. **Facts tag works, not numbers.** New optional fields: `work: "mb1"` (events), `works: ["mb1","mb2"]` (visible in), `firstWork: "mb1"` (earliest reveal), `more: [["mb3", "…"]]`, `eras: {"aub": …}`. Untagged records fall back to their numeric key's bucket, so the change can be adopted one series at a time with no visible regression.
3. **Prerequisites for cross-work reveals.** `needs: ["wok","mb3"]` = visible only when all listed works are read (e.g. Shard facts first explained in an essay). This replaces "pick a later numeric gate".
4. **Reader selection.** Two modes in the bar: *Reading order preset* (one slider over `order`, equivalent to today's cumulative behaviour but at work granularity) and *Pick what I've read* (checklist; set-based). The engine computes a `readSet`; every predicate becomes `visible(rec, readSet)`. One helper replaces the scattered numeric comparisons.
5. **Legacy migration.** `#book=N` and stored `BOOK_KEY=N` map to "all works with `bucket <= N`" (exactly today's behaviour). New URLs use `#read=mb1,mb2` (or `#upto=<workId>` for the preset). Old links keep working; nothing is silently remapped.
6. **Exposure-surface inventory** (each must use the one helper; a test asserts no direct `S.book` comparison remains outside it): chronicle/event lists, tours, place dossiers and landmarks, site lists and map pins, world list ("N more worlds appear later"), codex entries and `more` lines, world `eras` and facts, realm availability and realm map regions, search index, credits/intro copy (the pack `intro.text` currently names Adonalsium at every key — needs a gate or neutral wording), hints/notes ("Reading through …").
7. **Tests.** A VM probe like `elantris-order-probe.cjs` per surface: for each tagged record, hidden one work short of its gate and visible at it; legacy `#book=N` produces the same visible set as before migration.

## Suggested phasing

- Phase 1 (engine only, no content change): `works` table, `readSet` helper, legacy mapping, single-helper refactor, tests proving identical output for all current numeric keys.
- Phase 2: tag one bucket at a time (start with key 2 and key 12), each as its own reviewable content return.
- Bars: per-work selection UI only after Phase 1 passes.

## Open questions

- Mckay: is per-work selection worth the extra UI, or is a per-work *reading-order preset* enough? (Recommendation: preset first; checklist later if wanted.)
- ChatGPT: the canonical work list and order (publication vs. recommended reading order) — research item, not for Claude to invent.

Shared engine work: other packs with multi-work keys could reuse the same helper.
