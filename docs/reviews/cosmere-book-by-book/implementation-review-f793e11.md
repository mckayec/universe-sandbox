# MB10 era-10 implementation review — f793e11

ChatGPT, 2026-11-16. **Accepted for this bounded one-field return only.** This is not final canon approval, full PR validation, or Mckay's release approval.

- PR48 / `feature/cosmere-reading-state`: **f793e1142ec1eb550507c29e2da1b2809e17312c**
- Parent: **c1f1f2f6c3dbc8f8812797468effc4ac61788e12**
- Contract: [era10-handoff-2026-11-16.md](era10-handoff-2026-11-16.md)
- Builder evidence: [era10-return-f793e11.md](era10-return-f793e11.md)
- PR head re-read through GitHub; open and unmerged. Findings apply only to this exact head.

## Diff and disposition

Read **2/2 incremental changed files**, +100/−7: the pack and focused test. The pack changes only Scadrial `eras[10]`: the exact proposed status, “The Lost Metal · Elendel and the Outer Cities in tension”, plus its own `the-lost-metal` field gate. **1/1 nested field and 1/1 own gate accepted.** No new blocking finding in this delta.

Independently loaded both complete packs and restored the parent's era-10 object in the head in memory; the resulting parsed packs are deeply equal. Thus era 6 and its gates, world/era record-gate absence, other records, registry, presets, graphics, qualifiers and model note remain unchanged. The actual diff confirms no engine/helper change. This does not certify the unchanged material.

The test diff updates six old expectations that deliberately depend on era-10 copy/payload and adds 266 tests: payload (1), per-work matrix (256), legacy/All × realms (8), and fail-closed test (1, containing four invalid/unmet gate cases). The matrix covers 8 trilogy subsets × 8 bucket-6 subsets × MB10 absent/present × 2 realms. It is finite, not all combinations of the 33 works.

## Independent execution

Node **v24.22.1**, saved exact GitHub inputs. **5/5 Git blob hashes verified:**

| Input | Blob |
| --- | --- |
| Head public/atlas/packs/cosmere.js | a296bf9241c5f515387b24f069562ff7e286d13b |
| Head public/atlas/engine.js | 0bc5357a2043f3939512bc5b091eb4ffbbf1c5d0 |
| Head public/atlas/reading.js | 4d9bc177294e5e33accf6f19825ef467f0bb90d4 |
| Head tests/atlas-scadrial-reduced.test.ts | 3729cc9e305c35405fc14b135db7d12750bfef90 |
| Parent public/atlas/packs/cosmere.js | 9a60b3f2aa16fd46a48fbbb1594fa7532abe8fae |

Executed `node --test tests/atlas-scadrial-reduced.test.ts` against those saved files:

| Input pack, same head test/helper/engine | Passed | Failed | Exit |
| --- | --- | --- | --- |
| f793e11 | 430/430 | 0/430 | 0 |
| c1f1f2f | 403/430 | 27/430 | 1 |

The 27 negative failures match the intended changed payload: 16 eligible per-work status cases, 4 MB10 legacy10/All cases, 1 payload case and 6 updated earlier expectations. The fixture gate test also passes on the parent; it proves existing gate behavior, not patch discrimination. Forced Cognitive selector states do not prove that each combination can enter that realm through the UI.

Reproduction requires the four head files at their original relative paths; substitute only the parent pack in a separate scratch copy for the negative control. No repository source or PR branch was edited during this review.

## Rendered artifacts and CI: separate evidence classes

Read the [probe](era10-probe.mjs) and both saved logs. Recounted **174/174 head success lines** in [head output](era10-rendered-f793e11.txt); [parent output](era10-rendered-negative-c1f1f2f.txt) contains **20 failure lines** and reports **154/174 passed**. These are builder browser results, not independently executed browser tests.

Visually inspected **12/12 supplied dossier crops**, six states at 1440×900 and 390×844:

- Eligible with B6, Physical: readable new chip, MB05 body/Era fact, Distance qualifier and model note.
- Eligible Cognitive: readable new chip and existing Cognitive card/Physical body. Both crops end before the complete facts/qualifier/model block, so those are not visually certified here.
- Eligible without B6: new chip with base body and Ruler fact, as explicitly permitted by the contract.
- No-MB10 fallback: accepted MB05 chip/body/facts.
- Incomplete-trilogy denial: series-intro dossier, no visible Scadrial dossier.
- All: base → new-status chip, wrapping readably; MB05 body/facts remain.

The Reading panel whole-parent warning and legacy6/10 states are covered by supplied probe assertions, not these screenshots. The builder report's screenshot heading says “12, viewed”, while its body accurately limits the builder's own inspection to 4; this reviewer inspected all 12. Phone button-edge clipping and Cognitive bottom cropping are not evidence of complete viewport/scroll coverage.

The probe uses programmatic world selection and realm switching; phone expansion and Reading-panel opening use clicks, and closing uses Escape. It includes bucket 4 to unlock Cognitive mode, explaining the builder's initially failed realm attempt. It does not exercise pointer world selection. **0 independent browser cases this run; no browser launch attempted.**

[Actions run 43974883223](https://github.com/mckayec/universe-sandbox/actions/runs/43974883223), via GitHub jobs/check metadata, identifies this exact head. Build succeeded; format, build, unit-test, dist and standalone-page steps succeeded; deployment skipped. Detailed **591/591 units, 115 dist files and 24/24 page checks** remain builder-attributed, since raw CI output was not independently read.

**Unresolved broader validation:** builder reports `pnpm test:browser` timed out at `tests/browser-smoke.mjs:88` (Save/Load). The claim that it is pre-existing is not independently reproduced against the parent in this review. The successful Actions job does not contain that smoke test and cannot turn it into a pass. This remains a whole-PR validation gap, separate from accepting the finite data/gate return.

## Canon boundary and continuation

This implementation review compares against the already-saved MB10 source packet. No new primary-source retrieval or full-book reading is claimed here, and the separate Deep Research product was not invoked. The packet's chapter-2 political-tension claim and supported disclosure point do not establish a globally earliest series disclosure.

Keep the entire-chart/essay, base-star, Cognitive geography/threshold, Harmony codex, Luthadel residue, physical-model and omitted era-6 assertions held. MB10's complete chronology, plot and outside-threat mechanics remain unaudited. No site-wide removal of Harmony or outside-threat references is certified.

Ledgers remain separate: **1/1 nested era-10 field accepted; 3/3 nested era-6 fields previously accepted; 4/10 listed parent fields narrowed, 6/10 held; 0/2 whole parents promoted; 2/7 PR48 key-2 events mapped; 8/148 earlier narrow candidate fields, 140/148 held; 0/33 full-work approvals.** Do not add nested-field denominators to the older inventory.

Return to **content-review / chatgpt**. Next bounded unit: inspect the existing held Scadrial/Luthadel inventory, select one located primary-text claim, and either hand off one evidenced field with its disclosure boundary or save a precise source-gap checkpoint. Do not reopen accepted implementation closures or repeatedly hunt the unavailable complete chart. Reconcile current PR24/37/48 heads before another implementation request.

This run inspected **18/18 pack statuses and 8/8 review statuses** on main; no eligible stale parallel self-audit was found. Agreement and other owners remain unchanged. No application/PR-branch edit, merge, deployment, parent promotion or release approval.
