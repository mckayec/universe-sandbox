stage: ready
owner: claude
updated: 2026-10-30
note: R4 recheck of PR24 a0d8726 closes R3-C1/C3; R3-C2 remains partial due to uncancelled Heliopolis EMP timer (R4-C1 Medium). See implementation-review-r4.md. 82 unit tests and 141 source/state assertions pass, including one expected defect. Ready means review handed back for fixes, not release approval.

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

- 2026-10-25: ChatGPT committed corrections.md (445369494846a34f0f457cc85fd9b03aaf4ceb5e): all 36 leads dispositioned (19 confirmed, 13 not an error, 4 cut/neutralized), 120 atomic spot-checks across eight atlases, 4 new findings (3 corrections, 1 unsupported route cut). Sources and confidence limits recorded; dedicated Deep Research unavailable, no claim of full primary-book verification. Handoff is for conservative implementation, not final canon sign-off. No atlas code changed.
- 2026-10-25: Claude applied corrections.md on fix/lore-corrections (commits 955e9ef, 09f26a0; implementation.md in d08c4d2), PR #24 open, not merged: 27 applied, 13 not an error (7 optional skipped), 0 skipped; the L29 default-to-Book-I behaviour was left out as a code change. pnpm check, test:pages and browser spot-checks pass.

- 2026-10-25: ChatGPT reviewed all 40/40 dispositions against PR #24, fix/lore-corrections at d08c4d2851ea780d3c990f3a207eb267409bbb4a. Review committed in e3de245d140bb638d9a5eb1741353726bc6b0a9d: 23 mandatory rows conform, 4 partial (L1/L8/L29/L31), 13 retained; 3 blocking findings IR1–IR3. GitHub CI passed and 5/5 fetched packs loaded in a local data probe, but content/spoiler issues remain. Returned to Claude for fixes and targeted gate checks; no canon sign-off, merge or deployment.

- 2026-10-25: Mckay approved the preceding review outcomes (“All are approved”), including the requested correction work. Recorded as approval to proceed with IR1–IR3, not a statement that the known defects are fixed or that ChatGPT approved d08c4d2851ea780d3c990f3a207eb267409bbb4a. Claude retains fixing ownership and returns the changed revision for the agreed content/technical rechecks.
- 2026-10-25: Claude resolved IR1–IR3 on PR #24 (fix/lore-corrections head 78eaf99035e618939cab1569936503f55e3d16d0; main merged in at 67d8cbe; fixes 6ce5fc5): b7c unmapped (Auctor kept as book-VII codex text); Hyperion codex/world/site text cut back to first-book-safe base with later facts behind `more`/`eras`/`first` gates (Shared Moment book 4, LTB observer book 4, Lamia rescue book 2); Society opens at Book I with an explicit "All six books · spoilers" opt-in and notice, New Sparta from:6. pnpm check (59/59, check:dist 109), test:pages 12×2, test:browser and a targeted Playwright gate run pass. Raised R2-1 (ungated later-book Society POI/landmark text) for ChatGPT. Handed to ChatGPT for implementation re-review; not merged.

- 2026-10-26: ChatGPT completed local revision-2 re-review at 78eaf99035e618939cab1569936503f55e3d16d0. IR1 mapping and named Hyperion/New Sparta gates pass targeted checks; Society Chronicle visibility, body/POI/scene leaks and unresolved claims require fixes. Five blocker groups (4 High / 1 Medium); 19/19 targeted assertions pass, nine POI leaks and both viewport Chronicle failures reproduced. Local fixing handoff prepared; publication was subsequently authorized for the documentation draft PR. No remote review, push, merge or deployment.
- 2026-10-26: Claude applied ChatGPT's revision-2 findings on PR #24 (fix/lore-corrections head c91ea29da2328526aff379730042235240ad04bd; main merged in at 7103730): `.book[hidden]` CSS fix; Io final overrides gated (Nesos III, Garter VI); ChatGPT's POI minimum set plus the same named-book rule on the remaining places; exact neutral bases for the ten body dossiers; one visibility rule for scenes, landmarks, labels, focus targets, entry links, direct URLs, event navigation and book downgrade, with `eraVal` no longer leaking later values; ChatGPT's scene/landmark replacements and withholds, plus safe bases for other landmarks naming later books; the seven R2-C5 cuts. pnpm check 68/68 and check:dist 110; test:pages 12×2; spoiler-gate suite (docs/reviews/lore-corrections/society-gates.cjs on the branch) 419/419 at each of 1440×900 and 390×844. test:browser times out in this sandbox on a main-app step and fails the same way on untouched main; CI is the authority. Handed to ChatGPT for implementation re-review; not merged.

- 2026-10-27: ChatGPT re-reviewed Revision 3 at c91ea29da2328526aff379730042235240ad04bd on a separate documentation branch. Four of five R2 groups have specified source changes; R2-C4 remains partial. Late Europa registration/banner bypasses gates; pending transitions and active effects survive book downgrade; Bressia needs a pronoun repair. 26/1/13 ledger accounting, 68 unit tests, build/format/dist checks, and 120 source assertions (116 positive plus 4 expected defect probes). Existing exact-head CI passed. Browser checks not rerun under current restriction. Returned for fixes; no application changes, formal approval, merge or deployment.

- 2026-10-30: ChatGPT bounded R4 review at a0d8726d55e389e4568a8d00ab4d9937d2f51e86 verifies shared Europa gating/final order and Bressia repair; navigation cancellation improved but R4-C1 deferred EMP timer remains. 140 positive checks plus one defect characterization; no rendered acceptance. PR37 comparison at 9a09dbc is presence-only and finds the same timer. Documentation branch only; no merge/deployment or new PR operation.
