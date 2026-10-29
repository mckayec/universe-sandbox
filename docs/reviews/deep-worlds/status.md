stage: content-review
owner: chatgpt
updated: 2026-10-29
note: Bounded checkpoint at PR37 head f778b6b6fbbeb173763f2a79cd2d8bc0ff0d6f49 (older 14f7a52 differs only in docs). See audit.md, sample-ledger.csv and validation.md. Five open finding groups DW02–DW06; DW01 narrowly source-fixed. 5/20 landmarks and 3/15 events per pack inspected; only 3 sampled records partially compared to primary excerpts. Not final approval; remaining source/rendered acceptance open.

# Deep worlds: enterable places, deeper content, merged Society Atlas

Scope (on branch `atlas/deep-worlds`): `public/atlas/packs/{sun-eater,hyperion,expanse,dune,foundation,cosmere}.js`
(new `scene` / `landmarks` on sites, new and re-pointed events, codex entries) and `public/atlas/society.js`
(merged page; spoiler gating). Engine code (`places*.js`, `engine.js`) is technical, not canon; review it only
for spoiler leaks.

## Your task (ChatGPT)
`implementation.md` describes what was built and lists every item the builders were unsure of. The new content
was written by AI from plot summaries, not checked against the books: treat it as unaudited.

1. Verify each flagged item in `implementation.md` §2 against primary sources (the books), with official wikis
   as secondary sources. Decide: confirmed, wrong (give the correction), or unsupported (recommend cutting).
2. Spot-check at least 20 landmark descriptions and 15 new or re-pointed events per pack, prioritising
   prominent places (Arrakeen, Trantor, Medina, Luthadel, Kholinar, the Time Tombs, Devil's Rest).
3. Check spoiler gating: base site text and landmarks without `books`/`first` must be safe for the site's
   first book; events must sit in the book where they happen.
4. Society Atlas: spot-check the new scenes' landmark text and set-piece captions for accuracy and book gating.
5. Write `audit.md` in this folder as a table: **ID · file · object id · current text · verdict · replacement
   (paraphrased) · gate book · source URL**. Commit only to this folder, then set this file's header to
   `stage: fixing`, `owner: claude`, today's date and a one-line count note, and append a History line.

Do not edit the pack files yourself; Claude applies the findings on the PR branch.

## History
- 2026-10-27: Claude built the work on `atlas/deep-worlds` (head bb5eb23; PR #37 head 14f7a52 after merging main) and handed the canon audit to ChatGPT. Not merged; Mckay approves after the audit.

- 2026-10-29: ChatGPT published a bounded exact-head content-review checkpoint on a separate documentation branch. All six builder-flag groups dispositioned with open evidence needs; 48 sample records logged, not canon-certified. Two primary-supported copy corrections; prior delayed-transition/effect and Bressia defects remain; Europa VI clause now source-gated. 17 targeted unit tests pass, existing implementation CI passed. Browser/server work prohibited and not performed. Review remains content-review/chatgpt pending the uncompleted sampling and evidence gates.
