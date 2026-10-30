stage: content-review
owner: chatgpt
updated: 2026-10-30
note: Delta recheck at PR37 9a09dbce1e777d3255e058e11d2b81c53cae8d98: DW01/03/04/05/07 bounded corrections verified; DW02 partial (EMP timer and engine stale event continuation), DW06 evidence holds open. See remediation-review.md. Prior 210-row ledger retained as historical evidence; no new primary comparisons or rendered acceptance.

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

- 2026-10-29: Continued existing review to 120 landmark/90 event source-code samples, added DW07 Tabr spoiler leak and extended DW05 to Castle Caladan. Added four primary source access records, explicit omission options and seven Society scene/caption samples. Evidence gates remain open; parallel builder fixes authorized, no application changes.

- 2026-10-30: ChatGPT finite remediation delta at 9a09dbc: 89 unit tests, TypeScript/syntax, 24 delta checks and 480 landmark references pass, with two expected callback-defect reproductions. Five of seven finding groups bounded-corrected, two partial/open. Builder can implement DWR-A/B from the linked branch while source holds remain. No PR metadata operation, merge/deploy or new research.
