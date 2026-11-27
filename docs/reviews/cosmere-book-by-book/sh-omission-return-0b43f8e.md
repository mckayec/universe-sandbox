# SH-D1–03 return: Secret History Cognitive omission at PR48 0b43f8e

Claude, 2026-11-17T01:00Z.

- **PR:** PR48 `feature/cosmere-reading-state`
- **Exact head:** 0b43f8ee562b232387e9342d00985c91df9663fb
- **Parent:** f793e1142ec1eb550507c29e2da1b2809e17312c (the head named in the handoff; the remote branch had not moved)
- **Requested by:** [secret-history-omission-handoff-2026-11-17.md](secret-history-omission-handoff-2026-11-17.md)

Not merged. No canon approval, release, new gate or restoration of any Cognitive content is claimed.

## Exact diff (3 files, +62/−4)

### `public/atlas/packs/cosmere.js` (blob a296bf9 → a5dec3452a855e4680fb4b604b0ff6274528f906, +3/−3)

| ID | Change |
| --- | --- |
| SH-D1 | Scadrial world `realms: {cognitive: {name, style, c1, c2, c3, blurb}}` → `realms: {}` (empty container kept, as the handoff allows). |
| SH-D2 | `realms.cognitive.subastrals` Scadrial row: only `name` deleted. Row is now `{world: "scadrial", color: "rgba(220,225,235,.5)", r: 1.4, first: 7}`. |
| SH-D3 | `realms.cognitive.unknown` → `"No world-specific description is provided in this view. The appearance is an illustration, not a verified map."` (character for character). |

Unchanged: world/site gates, first/books/until, global Cognitive `first:4`, the row's `first:7`, global text/look/title, MB01/MB05/MB10 copy and gates, every other world, `engine.js` (0bc5357) and `reading.js` (4d9bc17). No new gate was added and no invalid gate is used as an omission mechanism.

### Tests

- `tests/atlas-scadrial-reduced.test.ts` (→ ba63567b160d2efe04cb3e30329992bb806c5bcc, +46/−1): the payload test's old "Cognitive payload held unchanged" expectation is replaced by SH-D1 (`realms` is empty), SH-D2 (exact remaining row) and SH-D3 (exact text). New **38-state SH matrix** using the actual `realmCard`/`realmLook` cut from the engine: 8 original-trilogy subsets × Secret History absent/present × bucket 4 absent/present (32), later-era only (bucket 6 + TLM), legacy 2/4/7/10, All. Each asserts the card is exactly the global title + neutral fallback, the old name/blurb/fallback are absent, the look is the generic global look (style 4, global c1–c3), and the home card keeps the held global text.
- `tests/atlas-realms-gate.test.ts` (→ f5cbe6924ec864de80733ed791d947e68f02a614, +13/−0): the 7 CBR-04 gate regressions used Scadrial's real bundle as their subject. They now first assert the real pack has `realms` empty, then install a clearly labelled synthetic **fixture** bundle so the gate behaviour (unread/invalid/satisfied/absent/legacy/All/downgrade-restore) is still tested. Fixture values are not canon.

## Checks (builder-run, Node v22.23.4)

- **Focused** (`node --experimental-strip-types --test tests/atlas-scadrial-reduced.test.ts tests/atlas-realms-gate.test.ts`): **476/476** ([log](sh-unit-head.txt)).
- **Unit negative control**, same tests with the parent pack f793e11: **430 pass / 46 fail** ([log](sh-unit-negative-f793e11.txt)) — 38 SH matrix states, the payload test, and the 7 realms-gate tests (their new real-pack precondition fails at the parent; the fixture gate logic itself is unchanged).
- **Repository:** `pnpm format` then `pnpm check`: format OK, build OK, **629/629** unit tests, check:dist **115 files OK**.
- **`pnpm test:pages`:** passed, 12 pages × 2 viewports.
- **`pnpm test:browser`:** failed with TimeoutError at `tests/browser-smoke.mjs:88` (the Save/Load wait recorded since checkpoint 2; repair is in PR47). Not re-run at the parent this run, so no pre-existence is claimed from this run alone.
- **Rendered:** [sh-omission-probe.mjs](sh-omission-probe.mjs) against a production build via `vite preview`, headless Chromium + SwiftShader, 1440×900 and 390×844 (phone sheet expanded).
  - **Head 0b43f8e: 86/86 pass, 0 not run, 0 page/console errors** ([log](sh-rendered-0b43f8e.txt), VERBOSE).
  - **Parent f793e11** (pack swapped, rebuilt): **52 pass / 34 fail** ([log](sh-rendered-negative-f793e11.txt)). All 34 failures are omission checks: neutral card / old-copy absence in every Cognitive state, the two surface uniform checks, and the Scadrial label check in All. Withheld, narrowing, Physical, other-labels and error checks pass at both.
  - A first run compared the planet uniforms without converting from linear colour (the engine stores `CL()` = sRGB→linear) and failed 2 colour checks; the saved probe converts back, and the logs above are from that version.

| Requested evidence (handoff §Required return) | Rendered state, each viewport | Result |
| --- | --- | --- |
| 1 | OT + The Way of Kings (bucket 4 = WoK only): Cognitive, Scadrial dossier; `descend("scadrial")`; then Physical | Card = "The Cognitive Realm" + neutral text; old name/blurb/fallback absent. Surface uniforms: realm 1, style 4 ("unsea"), colours = global look #1e1a2c/#5a5088/#0e0c14. Physical: no card, accepted MB01 blurb. |
| 2 | OT + WoK + Secret History; legacy #book=4, #book=10; All | Same neutral card in all four; no restoration. |
| 3 | Two of three trilogy books + WoK; bucket 6 + TLM only; OT + WoK open in Cognitive then real untick of The Hero of Ages in the Reading panel | Scadrial withheld in both; narrowing clears the selection and all Cognitive/later copy. |
| 4 | Galaxy, Cognitive, All | No "Expanse of the Vapors" label element; the other 6 subastral label elements exist. |

**How exercised:** programmatic world selection, realm switches and descend (`__atlas`); real clicks on the phone sheet grab, the Reading button and the checklist box; real Escape. **Independent browser execution:** 0 cases.

## Screenshots (8, each < 500 KB)

Viewed 3: surface 1440, cognitive 390, galaxy-cognitive 1440.

- **OT + WoK Cognitive dossier:** [1440×900](shots/sh-cognitive-1440x900.png), [390×844](shots/sh-cognitive-390x844.png) — neutral card above "In the Physical Realm" and the MB01 blurb; on phone the card wraps to three lines and stays legible.
- **Descended surface:** [1440×900](shots/sh-surface-1440x900.png), [390×844](shots/sh-surface-390x844.png) — taken while the software-GL surface was still "Charting surface", so the planet is dark in the image; the generic look is evidenced by the uniform checks, not these pixels.
- **All dossier:** [1440×900](shots/sh-all-1440x900.png), [390×844](shots/sh-all-390x844.png).
- **Galaxy labels in Cognitive (All):** [1440×900](shots/sh-galaxy-cognitive-1440x900.png), [390×844](shots/sh-galaxy-cognitive-390x844.png) — Shadesmar, Threnody's, Broken Sky, Densities, Vibrance and Drominad's labels shown; no Scadrial subastral label; Scadrial's glow kept.

The change from the held mist look to the generic global look is intentional per SH-D1 at both viewports.

## Branch reconciliation and holds

PR24 (cf25cda) and PR37 (03394c3) were not edited. Still held, as the handoff lists: global Cognitive home-card text, global look/geometry, the realm-opening threshold, the other subastral names, perpendicularity content, and the retained row's geometry and `first:7` (not approved). Deferred MB09 gaps stay linked in the handoff. Ledgers: **3/3 SH dispositions implemented** at bounded scope; earlier ledgers unchanged; 0/2 parents promoted; 0/33 full-work approvals.

## Handoff

fixing/claude → implementation-review/chatgpt. ChatGPT: review SH-D1–03 at 0b43f8e.
