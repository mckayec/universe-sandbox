# MB05 return: Scadrial era-6 bounded Elendel setting at PR48 c1f1f2f

Claude, 2026-11-16T22:20Z.

- **PR:** PR48 `feature/cosmere-reading-state`
- **Exact head:** c1f1f2f6c3dbc8f8812797468effc4ac61788e12
- **Parent:** 5ab3eacc79476bc69a88879b1abb696d13be263f (the audited head in the handoff; PR48 had not moved, and the parent pack blob 0f333af matched)
- **Requested by:** [era6-handoff-2026-11-16.md](era6-handoff-2026-11-16.md)

This PR is not merged. Nothing here claims canon approval or release.

## Exact diff (2 files, +113/−10)

### `public/atlas/packs/cosmere.js` (pack blob 0f333af → 9a60b3f2aa16fd46a48fbbb1594fa7532abe8fae)

The edit touches Scadrial `eras[6]` only.

- `status`, `blurb` and `facts` are replaced by the handoff candidate, character for character.
- `gates: {status, blurb, facts}` was added. Each field gate is exactly `{in: ["the-alloy-of-law"], req: "the-alloy-of-law"}`.
- Preserved:
  - the era-6 `gfx` object
  - `eras[10]`
  - the world record: no `gate`, the MB01 `gates.blurb`/`short`/`facts`, `distText` qualifier, `model`, star, realms, sites
  - every other record, the registry, presets, engine and reading helper
- No world or era record gate was added.

### `tests/atlas-scadrial-reduced.test.ts` (blob cd3134040baeda43f877930392db5ccbf349a5d7)

Five existing expectations now use the new era-6 copy: payload, OT+bucket 6, legacy 6, legacy 10, All. The remaining 25 existing tests are unchanged.

New tests (+134):

- **Payload (1 test):**
  - The three fields and the three own gates are exact.
  - There is no era or world record gate.
  - Era-6 keys are exactly blurb/facts/gates/gfx/status, and the gfx palette is kept.
  - `eras[10]` is exactly `{status}`.
  - The distText qualifier and model note are kept.
  - The old era-6 copy is absent and no removed claim was restored.
- **Per-work matrix (128 tests):** 8 original-trilogy subsets × 8 bucket-6 subsets × 2 realms. Bucket 6 is the 3 Wax and Wayne works in the registry. Each test checks:
  - world visibility is unchanged;
  - all three candidate fields appear only when the trilogy and bucket 6 are both complete;
  - with the trilogy complete and bucket 6 incomplete, the base status/blurb/ruler fact stays;
  - otherwise the copy is empty;
  - the Distance qualifier is kept in every state;
  - the old era-6 copy and removed claims are absent;
  - the model note is present whenever the parent is visible.
- **Legacy and All (4 tests):**
  - legacy #book=2: base copy;
  - legacy #book=6: candidate status/blurb/facts;
  - legacy #book=10: era-10 status override with the era-6 blurb/facts;
  - All: `The Final Empire → Harmony’s world · under threat from outside` with the era-6 blurb/facts.
- **Fail-closed (1 test):** an invalid (`{}`) or unmet (`{req: secret-history}`) era-6 blurb gate keeps the base blurb, while the status and facts sibling gates still show. Each field gate is independent.

**Input blobs at c1f1f2f**

| File | Blob | Changed? |
| --- | --- | --- |
| pack | 9a60b3f2aa16fd46a48fbbb1594fa7532abe8fae | yes |
| test | cd3134040baeda43f877930392db5ccbf349a5d7 | yes |
| engine.js | 0bc5357a2043f3939512bc5b091eb4ffbbf1c5d0 | no |
| reading.js | 4d9bc177294e5e33accf6f19825ef467f0bb90d4 | no |

## Checks (builder-run, Node v22.23.4)

- **Focused:** `node --experimental-strip-types --test tests/atlas-scadrial-reduced.test.ts` gives **164/164** ([log](era6-unit-c1f1f2f.txt)).
- **Unit negative control:** the same test file run with the parent pack 0f333af gives **152 pass / 12 fail** ([log](era6-unit-negative-5ab3eac.txt)). The 12 failures are:
  - the 5 updated expectations;
  - the MB05 payload test;
  - the 2 eligible matrix cases (OT complete + B6 complete × 2 realms);
  - legacy 6, legacy 10 and All;
  - fail-closed.

  All 126 non-eligible matrix cases also pass at the parent. This is expected: the parent shows its old era-6 copy only in the eligible states.
- **Repository:** `pnpm format` then `pnpm check` passed: format OK, build OK, **325/325** unit tests, check:dist **115 files OK** (same-origin only).
- **Rendered:** [era6-probe.mjs](era6-probe.mjs) ran against a production build via `vite preview` in headless Chromium + SwiftShader, at 1440×900 and 390×844 (phone sheet expanded).
  - **Head c1f1f2f: 134/134 pass, 0 page/console errors** ([log](era6-rendered-c1f1f2f.txt), VERBOSE).
  - **Parent 5ab3eac** (same probe, rebuilt with the parent pack): **90 pass / 44 fail** ([log](era6-rendered-negative-5ab3eac.txt)). All 44 failures are candidate-copy or old-copy-absence checks in the eligible, legacy 6/10 and All states. The partial-state, Distance, model-note and whole-parent-note checks still pass.

  Rendered states, at each viewport:

  | State | What is checked |
  | --- | --- |
  | OT + bucket 6, Physical | candidate status chip, blurb and Era fact (facts list `Star / Era / Distance`) |
  | OT + bucket 4 + bucket 6 | Cognitive then Physical with the selection kept; candidate copy in both realms; held Cognitive card unchanged |
  | Partial denied: OT + The Alloy of Law only (bucket 6 incomplete) | base status, base blurb, Ruler fact |
  | Legacy #book=6 | candidate copy |
  | Legacy #book=10 | era-10 status chip with the era-6 blurb/facts |
  | All (#book=0) | `The Final Empire → Harmony’s world · under threat from outside` with the era-6 blurb/facts |

  Every state also checks:
  - the Distance qualifier is kept;
  - the artist's-model note is kept;
  - none of the old era-6 copy appears in the dossier;
  - 0 errors.

  In the three per-work states, the Reading panel's whole-parent note "Some details in this series are only grouped, not yet sorted by book." is still present.

**How each part was exercised**

- **Programmatic:** world selection (`__atlas.selectWorld`) and realm switches (`__atlas.setRealm`).
- **Real pointer clicks:** the phone sheet grab (`#grab`) and the Reading button (`#rdBtn`); the panel is closed with a real Escape key press.
- **Not exercised:** pointer-driven world selection.
- **Independent browser execution:** 0 cases.

## Screenshots (8, viewed, each ≈105–118 KB)

Dossier crops; the phone crops were taken with the sheet expanded:

- **Eligible Physical:** [1440×900](shots/era6-dossier-physical-1440x900.png), [390×844](shots/era6-dossier-physical-390x844.png). Candidate chip, blurb, Era fact, Distance qualifier and model note are all legible.
- **Eligible Cognitive:** [1440×900](shots/era6-dossier-cognitive-1440x900.png), [390×844](shots/era6-dossier-cognitive-390x844.png). Held Cognitive card above the "In the Physical realm" candidate blurb. The phone crop is cut at the viewport bottom below the Era label; the rendered checks cover the facts and Distance in that state.
- **Partial denied:** [1440×900](shots/era6-dossier-partial-1440x900.png), [390×844](shots/era6-dossier-partial-390x844.png). Base status, base blurb, Ruler fact.
- **Legacy #book=10:** [1440×900](shots/era6-dossier-legacy10-1440x900.png), [390×844](shots/era6-dossier-legacy10-390x844.png). The era-10 status chip "Harmony’s world · under threat from outside" with the era-6 blurb/facts. The era-10 status is a separate held field and keeps its wording.

## Not changed / still held

The following remain held as listed in the handoff's Known gaps:

- chart-dependent claims;
- the omitted era-6 assertions: combined Shards/world-remaking, climate, Basin population/location/mountains, the Roughs, the southern continent;
- the base star field;
- Cognitive geography/threshold;
- the era-10 status;
- Harmony codex material;
- Luthadel residue;
- the physical model.

Elsewhere on the site, events e26–e29 and other records still mention Elendel/Harmony material as before. This return makes no site-wide absence claim. No parent was promoted and no full-work approval was given. The ledgers in the handoff are unchanged.

## Handoff

fixing/claude → implementation-review/chatgpt. ChatGPT: review MB05 at c1f1f2f. After bounded acceptance, the next source unit is one located primary passage for a remaining Scadrial field, per the handoff.
