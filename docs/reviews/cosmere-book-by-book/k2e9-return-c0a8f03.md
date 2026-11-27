# K2-E9-01 return: e9 text-only precision narrowing at PR48 c0a8f03

Claude, 2026-11-17T05:53Z.

- **PR:** PR48 `feature/cosmere-reading-state`
- **Exact head:** c0a8f03668a273846750d0e66abc770e04dfb3cb (remote `git ls-remote` read-back matches)
- **Parent:** 9b49a52014adf65eaa3003cf4c4f257bbfffff86 (the head named in the handoff; branch had not moved)
- **Requested by:** [key2-e9-handoff-2026-11-17.md](key2-e9-handoff-2026-11-17.md)

Not merged. No canon approval, new gate, new mapping, site certification or parent promotion is claimed.

## Exact diff (2 files)

### `public/atlas/packs/cosmere.js` (blob bbcd036 → 54846eca0fc024ea32230f486d00fc1911f558e4, +1/−1, one field)

```diff
-      {id: "e9", book: 2, world: "scadrial", site: "luthadel", title: "Siege of Luthadel", text: "Elend Venture tries to rule a free city while three armies camp outside the walls."},
+      {id: "e9", book: 2, world: "scadrial", site: "luthadel", title: "Siege of Luthadel", text: "Elend Venture tries to govern Luthadel while three armies seek to conquer the city."},
```

Payload at the head: id e9, book 2, world scadrial, site luthadel, title "Siege of Luthadel", text exactly the handoff sentence; no `gate`/`gates`/`lm`/`fx`. Array position unchanged (e6–e12 consecutive). Accepted e7/e8 text, the Luthadel site record and every other record untouched. PR24 (cf25cda) and PR37 (03394c3, "Straff approaches Luthadel" variant with `lm: walls`) not touched.

### `tests/atlas-scadrial-reduced.test.ts` (a8f0026 → 1f20a40fb0277c0b9c069f32fc76dee63f9eac91, +9/−3)

- **Payload test** (renamed "K2-E8-01 + K2-E7-01 + K2-E9-01 payload"): e6–e12 consecutive and each deep-equal to its exact expected object; e9 expects only the new text; old e9 sentence and "camp outside the walls" absent from the pack source (old e7/e8 checks kept).
- **Visibility test** now runs for e7, e8 and e9 (actual engine `evChain`/`pvis`): visible with the full original trilogy; withheld for all incomplete-trilogy subsets and later-era-only (AoL + TLM). Parent chain unchanged.

## Checks (builder-run, Node v22.23.4)

- **Focused** (`atlas-scadrial-reduced` + `atlas-realms-gate`): **480/480** ([log](k2e9-unit-head.txt)).
- **Unit negative control**, same tests with the parent pack 9b49a52: **479/1** ([log](k2e9-unit-negative-9b49a52.txt)) — only the payload test fails; the e9 visibility test passes at both (chain unchanged, as intended).
- **Repository:** `pnpm format` (no further changes), `pnpm check`: format OK, build OK, **633/633** unit tests, check:dist **115 files OK**.
- **`pnpm test:pages`:** passed, 12 pages × 2 viewports.
- **`pnpm test:browser`** (CHROME_PATH = Chromium 1243): **passed on the first attempt this run**. The default bundled headless-shell path is not installed on this host (first invocation without CHROME_PATH failed at launch, not a test result). The previously recorded line-88 Save/Load timeout is intermittent and is **not** claimed fixed by one passing run.
- **Rendered:** [k2e9-probe.mjs](k2e9-probe.mjs) (adapted from k2e7-probe.mjs; e9 target, e7 in the unchanged-others list), production `dist` served statically under `/universe-sandbox/` (python `http.server`), headless Chromium 1243 + SwiftShader, 1440×900 and 390×844 (phone sheet expanded with a real tap on the grab).
  - **Head c0a8f03668a273846750d0e66abc770e04dfb3cb: 76/76 pass, 0 page/console errors** ([log](k2e9-rendered-head.txt), VERBOSE).
  - **Parent 9b49a52** (pack swapped in dist): **60 pass / 16 fail** ([log](k2e9-rendered-negative-9b49a52.txt)). All 16 failures are the new-wording and old-wording-absent checks in the 4 allowed states × 2 viewports; withheld, title, other-event and error checks pass at both.

| State (each viewport) | Result at head |
| --- | --- |
| Allowed: `#read=` full original trilogy; legacy `#book=2`, `#book=10`; All (`#book=0`) | Scadrial selected; opened e9 dossier item shows title "Siege of Luthadel" and text exactly the new sentence; old sentence absent from the page. |
| All: other key-2 events | e6, e7 (accepted), e8 (accepted), e10, e11, e12 dossier texts exactly unchanged. |
| Withheld: MB1+MB2, MB1+MB3, MB2+MB3; later-era only (bucket 6 + TLM) | Scadrial not selected; neither the e9 title nor old/new text appears anywhere in the page. |

Legacy/All behaviour differs from the parent only by the e9 wording.

**How exercised:** `__atlas.selectWorld` / `__atlas.openEvent('e9')` (no travel); real tap on the phone grab. **Independent browser execution:** 0 cases.

## Screenshots (6, each < 500 KB; viewed 3)

- Full trilogy, e9 open: [1440×900](shots/k2e9-ot-1440x900.png) (viewed: "In the Chronicle" shows "Siege of Luthadel" with the new sentence over two lines, site line "Luthadel"; Chronicle strip lists the seven key-2 titles), [390×844](shots/k2e9-ot-390x844.png) (viewed: sentence wraps cleanly in the expanded sheet).
- All: [1440×900](shots/k2e9-all-1440x900.png), [390×844](shots/k2e9-all-390x844.png).
- Withheld MB1+MB2: [1440×900](shots/k2e9-withheld-1440x900.jpg) (JPEG; PNG was 869 KB), [390×844](shots/k2e9-withheld-390x844.png) (viewed: about card "Custom selection: 2 read", no Scadrial).

## Holds and ledgers

Unchanged: e9 camp/reveal precision withheld per handoff (not labelled false); free-government clause omitted, not disproven; Luthadel site/geometry and parent chain held; e7/e8 accepted texts; e10/e11 prose held; e6/e12 accepted mappings; all prior CBR/SH and MB01/MB05/MB10 corrections and holds. Ledgers: 3/5 held prose units implemented (e7/e8 accepted, e9 awaiting review), 2/7 events mapped, 0 new mappings, 0/2 parent promotions, 0/33 full-work approvals. MB09 deferred.

## Handoff

fixing/claude → implementation-review/chatgpt. ChatGPT: review K2-E9-01 at c0a8f03668a273846750d0e66abc770e04dfb3cb, then the finite MB02 e10 Well/power-release source unit per the handoff.
