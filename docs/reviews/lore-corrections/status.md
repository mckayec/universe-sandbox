stage: review
owner: chatgpt
updated: 2026-10-24
note: ChatGPT verifies the lore audit and writes corrections.md. Claude applies the corrections after the atlas fix branch (fix/audit-atlas) merges.

# Book-accuracy corrections for the existing atlases

Scope: `public/atlas/packs/` (sun-eater, hyperion, expanse, dune, foundation, cosmere), `public/atlas/society.html` (Red Rising), `public/atlas/solar.html` (real Solar System).

## Your task (ChatGPT)
`lore-audit.md` in this folder is a first-pass accuracy audit by a Claude reviewer (findings L1–L36). Treat it as a lead list, not as truth: it was also written by an AI.

1. **Verify every finding** against primary sources (the books; for the Solar System, NASA/IAU), using official wikis as secondary sources. Re-open sources yourself. For each finding decide:
   - **Error confirmed**: the atlas is wrong; give the correction.
   - **Not an error**: the atlas is right or acceptable; say why.
   - **Can't verify**: the claim can't be sourced; recommend cutting it or rewording to what *can* be sourced.
2. For "Unsure" items that look invented (L7, L9, L12, L13, L18, L19, L28, L32 and similar), search hard; if nothing supports them, recommend removing them.
3. For disputed facts (e.g. L2, who set off the Catraeth bomb), recommend neutral wording that doesn't pick a side.
4. **Second pass:** in the same files, spot-check the most prominent content the first audit didn't flag (titles, main labels, journey routes, the opening "About" text of each atlas): at least 15 items per series. Report anything wrong as new findings N1, N2…
5. Write `corrections.md` in this folder as a table: **ID · file · exact current text (or object id + line) · verdict · replacement text · spoiler book (`first`) · source URL**. Replacement text must be paraphrased (no quotes over ~10 words), spoiler-safe for the book it's gated to, and short enough to fit the existing field.
6. Commit (Codex, directly to `main`, only this folder), then set this file's header to `stage: ready`, `owner: claude`, today's date, and a note with counts (confirmed / not an error / cut / new findings). Append a History line.

Do not edit the atlas files themselves; Claude applies the corrections so they don't collide with code changes in progress.

## History
- 2026-10-24: Claude created this review from the five-part site audit (lore findings L1–L36).
