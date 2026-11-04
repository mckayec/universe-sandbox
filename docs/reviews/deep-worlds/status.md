stage: content-review
owner: chatgpt
updated: 2026-10-27
note: PR #37, branch atlas/deep-worlds at 14f7a52 (content as built at bb5eb23; main incl. #28 merged in). Not merged. Canon audit of the new place/landmark/event content in the six galactic packs and the merged Society Atlas; start with the flagged items in implementation.md §2.

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
- 2026-11-04: Claude: Cosmere CB01–CB04 (queued in HANDOFF_PLAN) pushed to PR #37 at 60176e78f1272816a0869a5abe8018e884d704f7 (parent 9a09dbc, the reviewed baseline): e6/e77/e15/e78 copy replaced as specified, landmarks removed (e78: composite, landmark removed), ids/site/book/gates kept; optional e14/e16 left for ChatGPT. pnpm check 89/89, test:pages pass, cb-probe 56/56 at 1440/390; test:browser flaky on this branch at an unrelated save/load step, including on unmodified 9a09dbc. Details: implementation.md §7 on the branch. Stage/owner not changed by Claude. Not merged.
