# Deep worlds — Dune omission return at PR37 aea2347

PR37 head: `aea2347489172e38bb8502aaa65c90af77cda049` (parent `80b8514885516d11bad503cf973603b60d8111a5`).
Instruction: implementation-review-80b8514.md §"Claude's next bounded return" items 1–4.

## 1. Change (exact diff)
`git diff --stat 80b8514 aea2347` → `public/atlas/packs/dune.js | 4 ----` (one file, deletions only):
- Arrakeen scene landmark `conservatory` (2 lines: record + desc) removed.
- Events `d15` "The hunter-seeker" and `d16` "A hidden warning" removed.
Residency and every other record unchanged. The 18 accepted leaf changes and 3 scoped retains are in other
records/packs and are byte-identical (see check below). Society Atlas `d15`/`d16` are unrelated Red Rising ids and untouched.

## 2. Reference / ledger checks — `dune-omit-check.cjs` (output: dune-omit-check-output-aea2347.txt)
`node dune-omit-check.cjs <checkout 80b8514> <checkout aea2347>` → **15/15 PASS**: events removed exactly d15,d16;
remaining Dune events identical in order and content; Arrakeen landmarks = base minus conservatory; **markers 10 → 9,
Arrakeen events 14 → 12** (matches ChatGPT's hypothetical cut); residency retained; whole Dune pack = base minus the three
records; no remaining d15/d16/conservatory id references; 0 unresolved lm refs; foundation, sun-eater, cosmere, expanse,
hyperion packs deep-equal to 80b8514 (so the 18 leaves, 3 retains and 11→8 holds carry unchanged).

Removed-ID handling in code (engine.js inspection): the URL hash never carries event ids (`urlFor`: book, world, site,
realm, view, lm, layer filters, tree), so no old link can restore d15/d16. Tours are built at run time from the filtered
EVENTS list (`tourList`), so they cannot reference removed ids. A stale `lm=conservatory` link is the only reachable stale
id; `selectLandmark` sets `S.lm` and `PLACES.focus` with an id that has no marker — see browser result B1.

## 3. Rendered checks — `dune-omit-browser-check.cjs` (output: dune-omit-browser-output-aea2347.txt)
Environment: built dist via `vite preview`, Chromium headless shell 1243 with `--use-gl=swiftshader` (CHROME_PATH set).
Command: `CHROME_PATH=/opt/pw-browsers/chromium_headless_shell-1243/chrome-headless-shell-linux64/chrome-headless-shell node docs/reviews/deep-worlds/dune-omit-browser-check.cjs http://localhost:4173/`

Completed at 1440x900 (real UI clicks):
- B1 stale direct link `#book=1&world=arrakis&site=arrakeen&view=place&lm=conservatory`: no page/console errors; dossier
  shows no conservatory/Margot text; Arrakeen scene has 9 landmarks. A control run of the same link with `lm=residency`
  and with no lm reached `view=place` in ~119–123 s under SwiftShader with `lm=null` in both cases, i.e. the stale lm
  behaves exactly like a valid lm in this environment (lm application after restore did not complete in either; not
  attributable to the omission).
- B2 Dune book 1 chronicle: no d15/d16, neighbours d14/d17 present (27 events); All-books chronicle 88 events, no d15/d16;
  d17 opens via chronicle click; tour length 27 = chronicle count; no errors.
- B3 Cosmere book 2: e70 listed and opens via chronicle click with `lm=null` (its lm was removed at 80b8514).

**Not completed (missing evidence, not passes):** e70 Back/downgrade/direct place link, all e102 checks, and every check
at 390x844. Reproducible blockers, exact output in the txt file:
1. First run: `HARNESS ERROR page.evaluate: Execution context was destroyed` at the e70 Back step — opening an event from
   the galaxy view pushes no history entry, so `history.back()` left the app document (harness defect; fixed by guarding
   Back on `history.state`).
2. Second run: the same error during rapid tour Next clicks (proposed finding DWT-01 below).
SwiftShader place transitions take ~2 min each here, so a complete 2-viewport run did not fit this run's budget.

## 4. Proposed technical finding DWT-01 (pre-existing; outside this delta)
`tour-race-probe.cjs`: start the Dune book-1 tour and press Next six times 1.5 s apart under SwiftShader. Hashes with a
mismatched world/site pair appear (`world=arrakis&site=castle`, `world=caladan&site=arrakeen`); in one diagnostic run the
page then navigated out of the atlas document. **Reproduces on base 80b8514** (served from that checkout's `public/`: 1 of
2 runs) and on aea2347 (2 of 2 runs), so it is not caused by the omission. Likely a tour-step race between in-flight
leave/ascend/descend callbacks and a newer step (same class as DWR-B/DWH-01). Proposed as a separate bounded fix; not
attempted here.

## 5. Suite
`pnpm check` at aea2347: format, build, **125/125** unit tests, check:dist 175 files OK. `pnpm test:pages` with
CHROME_PATH=/opt/pw-browsers/chromium-1243/chrome-linux64/chrome: **12 pages × 2 viewports** pass.

## 6. Scope kept
Eight other source holds deferred and outside verified coverage; 139 unselected records unverified; whole pack not
presented as canon-approved. No merge, no deploy.
