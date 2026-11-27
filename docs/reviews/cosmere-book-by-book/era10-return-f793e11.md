# MB10 return: Scadrial era-10 one-field status at PR48 f793e11

Claude, 2026-11-16T23:05Z.

- **PR:** PR48 `feature/cosmere-reading-state`
- **Exact head:** f793e1142ec1eb550507c29e2da1b2809e17312c
- **Parent:** c1f1f2f6c3dbc8f8812797468effc4ac61788e12 (the target named in the handoff; the remote branch had not moved, and the parent pack blob 9a60b3f matched)
- **Requested by:** [era10-handoff-2026-11-16.md](era10-handoff-2026-11-16.md)

This PR is not merged. Nothing here claims canon approval, release, or site-wide removal of Harmony or outside-threat references.

## Exact diff (2 files, +100/−7)

### `public/atlas/packs/cosmere.js` (blob 9a60b3f → a296bf9241c5f515387b24f069562ff7e286d13b, +2/−1)

Only Scadrial `eras[10]` changes:

```js
10: {status: "The Lost Metal · Elendel and the Outer Cities in tension",
     gates: {status: {in: ["the-lost-metal"], req: "the-lost-metal"}}}
```

That is the handoff candidate character for character: one nested field and one own field gate.

Preserved:

- the era-6 candidate and its three gates, and the era-6 gfx;
- the world record: no `gate`, the MB01 blurb/short/facts gates, distText qualifier, model note, star, realms and sites;
- every other record, the registry, buckets, presets, `engine.js` and `reading.js`.

No world or era record gate was added.

### `tests/atlas-scadrial-reduced.test.ts` (blob cd31340 → 3729cc9e305c35405fc14b135db7d12750bfef90)

Six existing expectations that depend on the era-10 payload were updated to the new status: the payload test, legacy #book=10, All, MB05 payload, MB05 legacy #book=10 and MB05 All. The old status string survives only as the `OLD_ERA10` absence constant. All other existing assertions are unchanged.

New tests (+266):

- **MB10 payload (1):** `eras[10]` equals `{status, gates: {status: MB10 gate}}` exactly. There is no era-10 or world record gate. The era-6 fields and gates, distText and model are kept, and the old era-10 status is absent.
- **Per-work matrix (256):** 8 original-trilogy subsets × 8 bucket-6 subsets × The Lost Metal absent/present × 2 realms. Each case checks:
  - world visibility is unchanged;
  - the status follows the handoff table: trilogy incomplete gives empty; trilogy + TLM gives the era-10 status; trilogy without TLM and with full bucket 6 gives the MB05 status; otherwise the base status;
  - the Distance qualifier is kept;
  - the old era-10 status, old era-6 copy and removed claims are absent;
  - name, blurb, facts, star, model, Cognitive card and visibility equal the same state without The Lost Metal.
- **Legacy and All × 2 realms (8):** legacy 2 gives base, legacy 6 gives MB05, legacy 10 gives the new status, All gives `The Final Empire → The Lost Metal · Elendel and the Outer Cities in tension`.
- **Fail-closed (1):** an invalid (`{}`) or unmet (`{req: mistborn-secret-history}`) era-10 status gate, in both realms with everything read, falls back to the MB05 era-6 status, and the era-6 blurb/facts stay.

**Input blobs at f793e11**

| File | Blob | Changed? |
| --- | --- | --- |
| pack | a296bf9241c5f515387b24f069562ff7e286d13b | yes |
| test | 3729cc9e305c35405fc14b135db7d12750bfef90 | yes |
| engine.js | 0bc5357a2043f3939512bc5b091eb4ffbbf1c5d0 | no |
| reading.js | 4d9bc177294e5e33accf6f19825ef467f0bb90d4 | no |

## Checks (builder-run, Node v22.23.4)

- **Focused:** `node --experimental-strip-types --test tests/atlas-scadrial-reduced.test.ts` gives **430/430** ([log](era10-unit-f793e11.txt)). That is the previous 164 plus 266 new.
- **Unit negative control:** the same test file with the parent pack 9a60b3f gives **403 pass / 27 fail** ([log](era10-unit-negative-c1f1f2f.txt)). The 27 failures are:
  - 16 eligible matrix cases (trilogy complete + TLM, each of 8 bucket-6 subsets × 2 realms);
  - 4 MB10 legacy-10/All realm cases;
  - the MB10 payload test;
  - the 6 updated expectations.

  The fail-closed test passes at the parent too. It installs the fixture gate on the parent's era-10 object as well, so it tests gate behaviour, not the patch.
- **Repository:** `pnpm format` (no changes) then `pnpm check` passed: format OK, build OK, **591/591** unit tests, check:dist **115 files OK**.
- **`pnpm test:pages`:** passed, 12 pages × 2 viewports.
- **`pnpm test:browser`:** failed with a TimeoutError at `tests/browser-smoke.mjs:88`. This is the pre-existing Save/Load wait recorded since checkpoint 2, outside this diff; the repair is in PR47. It was not re-run at the parent this run.
- **Rendered:** [era10-probe.mjs](era10-probe.mjs) ran against a production build via `vite preview` in headless Chromium + SwiftShader, at 1440×900 and 390×844 (phone sheet expanded).
  - **Head f793e11: 174/174 pass, 0 page/console errors** ([log](era10-rendered-f793e11.txt), VERBOSE).
  - **Parent c1f1f2f** (same probe, rebuilt with the parent pack): **154 pass / 20 fail** ([log](era10-rendered-negative-c1f1f2f.txt)). All 20 failures are new-status chip checks or old-era-10-absence checks in the eligible, legacy-10 and All states. The fallback, denial, Distance, model and whole-parent-note checks still pass.

  A first probe run used trilogy + bucket 6 + TLM for the realm switch and failed 4 checks: the Cognitive realm stayed locked because bucket 4 was not read. This matches the MB05 probe, which includes bucket 4 for that reason. The saved probe adds bucket 4, and the logs above come from that version.

  Rendered states, at each viewport:

  | State | Expected and observed |
  | --- | --- |
  | Trilogy + B4 + B6 + TLM, Cognitive then Physical (selection kept) | One chip with the new status; MB05 blurb and Era fact; held Cognitive card unchanged |
  | Trilogy + TLM, no bucket 6 | New status; base blurb; Ruler fact |
  | Trilogy + B6, no TLM | MB05 status, blurb and Era fact; new status absent |
  | Two of three trilogy books + B6 + TLM | Scadrial is withheld: the dossier stays on the series intro, and no Scadrial name, status, blurb or old copy appears |
  | Legacy #book=6 / #book=10 / All | MB05 status / new status / `The Final Empire → new status`, each with the MB05 blurb/facts |

  Every visible state also checks:
  - the Distance qualifier is kept;
  - the model note is kept;
  - the old era-10 status is absent;
  - the old era-6 copy is absent;
  - 0 errors.

  In all four per-work states, including the denial, the Reading panel's whole-parent note "Some details in this series are only grouped, not yet sorted by book." is present.

**How each part was exercised**

- **Programmatic:** world selection (`__atlas.selectWorld`) and realm switches (`__atlas.setRealm`).
- **Real pointer clicks:** the phone sheet grab (`#grab`) and the Reading button (`#rdBtn`); the panel is closed with a real Escape key press.
- **Not exercised:** pointer-driven world selection.
- **Independent browser execution:** 0 cases.

## Screenshots (12, viewed, each ≈90–118 KB)

All crops are of the dossier; on phone the sheet is expanded. I viewed 4 crops this run: eligible-b6 1440, eligible-nob6 390, denied 390 and cognitive 390. The other 8 are covered by the rendered checks only.

- **Eligible + B6 Physical:** [1440×900](shots/era10-eligible-b6-1440x900.png), [390×844](shots/era10-eligible-b6-390x844.png). The status chip wraps to two lines and stays legible; the MB05 blurb, Era fact, Distance qualifier and model note are shown.
- **Eligible Cognitive:** [1440×900](shots/era10-cognitive-1440x900.png), [390×844](shots/era10-cognitive-390x844.png). The new status sits above the held Cognitive card and the "In the Physical realm" MB05 blurb. The phone crop is cut at the viewport bottom before the facts; the rendered checks cover them.
- **Eligible without B6:** [1440×900](shots/era10-eligible-nob6-1440x900.png), [390×844](shots/era10-eligible-nob6-390x844.png). New status with the base blurb and Ruler fact.
- **No-TLM fallback:** [1440×900](shots/era10-fallback-1440x900.png), [390×844](shots/era10-fallback-390x844.png).
- **Incomplete-trilogy denial:** [1440×900](shots/era10-denied-1440x900.png), [390×844](shots/era10-denied-390x844.png). The Cosmere intro dossier with "Custom selection: 6 read".
- **All:** [1440×900](shots/era10-all-1440x900.png), [390×844](shots/era10-all-390x844.png).

## Branch reconciliation

PR24 (cf25cda) and PR37 (03394c3) were not edited, as the handoff requests.

## Not changed / still held

Everything the handoff's Known gaps list stays held:

- the MB10 plot, chronology, and outside-threat identity/mechanics;
- the entire-chart gap;
- the base star;
- Cognitive geography/threshold;
- Harmony codex material;
- Luthadel residue;
- the physical model;
- the omitted era-6 assertions.

Events and other records elsewhere still mention Harmony as before. No parent was promoted and no full-work approval was given. Ledgers: **1/1 nested era-10 field implemented**, separate from the accepted 3/3 era-6 fields. The earlier ledgers are unchanged: 4/10 parent fields narrowed, 6/10 held, 0/2 parents promoted, 2/7 key-2 events mapped, 8/148 narrow candidate fields, and 0/33 full-work approvals.

## Handoff

fixing/claude → implementation-review/chatgpt. ChatGPT: review MB10 at f793e11.
