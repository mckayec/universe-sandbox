# K2-E7-01 return: e7 text-only narrowing at PR48 9b49a52

Claude, 2026-11-17T05:10Z.

- **PR:** PR48 `feature/cosmere-reading-state`
- **Exact head:** 9b49a52014adf65eaa3003cf4c4f257bbfffff86 (remote `git ls-remote` read-back matches)
- **Parent:** 7989e8dc8c5583d6bf5e8138f595979f74630a99 (the head named in the handoff; branch had not moved)
- **Requested by:** [key2-e7-handoff-2026-11-17.md](key2-e7-handoff-2026-11-17.md)

Not merged. No canon approval, new gate, new mapping, site certification or parent promotion is claimed.

## Exact diff (2 files)

### `public/atlas/packs/cosmere.js` (blob 1958cee → bbcd03657fa3fc50b2f201dd91829c453119327d, +1/−1, one field)

```diff
-      {id: "e7", book: 2, world: "scadrial", site: "hathsin", title: "The survivor of Hathsin", text: "Kelsier’s past: he lived through the Pits when his wife did not, and came out with every Allomantic power."},
+      {id: "e7", book: 2, world: "scadrial", site: "hathsin", title: "The survivor of Hathsin", text: "Kelsier is known as the Survivor of Hathsin; scars cover his hands and arms."},
```

Payload read-back at the head: `id e7, book 2, world scadrial, site hathsin, title "The survivor of Hathsin", text "Kelsier is known as the Survivor of Hathsin; scars cover his hands and arms."`, no `gate`/`gates`/`lm`/`fx`. Array position unchanged (e6–e12 consecutive). The accepted e8 text, the Hathsin site record (line 162) and every other record are untouched. `engine.js` (0bc5357) and `reading.js` (4d9bc17) unchanged. PR24 and PR37 not touched (PR37 has no e7; its e74 untouched).

### `tests/atlas-scadrial-reduced.test.ts` (8f3976c → a8f0026ef7a760f3a19b60f7ebe9d2b9ec931de8, +22/−13)

- **Payload test** (renamed "K2-E8-01 + K2-E7-01 payload"): e6–e12 still consecutive and each deep-equal to its exact expected object; e7 now expects only the new text; old e7 sentence and "every Allomantic power" absent from the pack source (old e8 checks kept).
- **Visibility test** now runs for both e7 and e8 (actual engine `evChain`/`pvis`): visible with the full original trilogy; withheld for all incomplete-trilogy subsets and later-era-only (AoL + TLM). Parent chain unchanged.

## Checks (builder-run, Node v22.23.4)

- **Focused** (`atlas-scadrial-reduced` + `atlas-realms-gate`): **479/479** ([log](k2e7-unit-head.txt)).
- **Unit negative control**, same tests with the parent pack 7989e8d: **478/1** ([log](k2e7-unit-negative-7989e8d.txt)) — only the payload test fails; the e7 visibility test passes at both (chain unchanged, as intended).
- **Repository:** `pnpm format` (no further changes), `pnpm check`: format OK, build OK, **632/632** unit tests, check:dist **115 files OK**.
- **`pnpm test:pages`:** passed, 12 pages × 2 viewports.
- **`pnpm test:browser`:** **failed** — TimeoutError at `tests/browser-smoke.mjs:88` (the known Save/Load wait). Not fixed and not claimed fixed; PR47 does not repair this branch by implication.
- **Rendered:** [k2e7-probe.mjs](k2e7-probe.mjs) (adapted from k2e8-probe.mjs; e7 target, e8 now in the unchanged-others list), production `dist` served statically under `/universe-sandbox/` (python `http.server`; `vite preview` on this host returned the root app for the atlas path, so it was not used), headless Chromium 1243 + SwiftShader, 1440×900 and 390×844 (phone sheet expanded with a real tap on the grab).
  - **Head 9b49a52: 76/76 pass, 0 page/console errors** ([log](k2e7-rendered-head.txt), VERBOSE).
  - **Parent 7989e8d** (pack swapped in dist): **60 pass / 16 fail** ([log](k2e7-rendered-negative-7989e8d.txt)). All 16 failures are the new-wording and old-wording-absent checks in the 4 allowed states × 2 viewports; withheld, title, other-event and error checks pass at both.

| State (each viewport) | Result at head |
| --- | --- |
| Allowed: `#read=` full original trilogy; legacy `#book=2`, `#book=10`; All (`#book=0`) | Scadrial selected; opened e7 dossier item shows title "The survivor of Hathsin" and text exactly the new sentence; old sentence absent from the page. |
| All: other key-2 events | e6, e8 (accepted text), e9, e10, e11, e12 dossier texts exactly unchanged. |
| Withheld: MB1+MB2, MB1+MB3, MB2+MB3; later-era only (bucket 6 + TLM) | Scadrial not selected; neither the e7 title nor old/new text appears anywhere in the page. |

Legacy/All behaviour differs from the parent only by the e7 wording (16/16 negative-control failures are wording checks).

**How exercised:** `__atlas.selectWorld` / `__atlas.openEvent('e7')` (no travel); real tap on the phone grab. **Independent browser execution:** 0 cases.

## Screenshots (6, each < 500 KB; viewed 3)

- Full trilogy, e7 open: [1440×900](shots/k2e7-ot-1440x900.png) (viewed: dossier "In the Chronicle" shows "The survivor of Hathsin" with the new sentence, site line "Pits of Hathsin"; Chronicle strip lists the seven key-2 titles), [390×844](shots/k2e7-ot-390x844.png) (viewed: sentence wraps cleanly in the expanded sheet).
- All: [1440×900](shots/k2e7-all-1440x900.png), [390×844](shots/k2e7-all-390x844.png).
- Withheld MB1+MB2: [1440×900](shots/k2e7-withheld-1440x900.jpg) (JPEG; PNG was 916 KB), [390×844](shots/k2e7-withheld-390x844.png) (viewed: about card "Custom selection: 2 read", no Scadrial).

## Holds and ledgers

Unchanged: detailed e7 backstory (Mare, powers, "every") deferred per handoff; Hathsin site record, description and geometry held; e8 accepted text; e9/e10/e11 prose held; e6/e12 accepted mappings; all prior CBR/SH and MB01/MB05/MB10 corrections and holds. Ledgers: 2/5 held prose units implemented (e8 accepted, e7 awaiting review), 2/7 events mapped, 0 new mappings, 0/2 parent promotions, 0/33 full-work approvals. MB09 deferred.

## Handoff

fixing/claude → implementation-review/chatgpt. ChatGPT: review K2-E7-01 at 9b49a52, then the finite MB02 e9 source unit per the handoff.
