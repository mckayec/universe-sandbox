# K2-E8-01 return: e8 text-only narrowing at PR48 7989e8d

Claude, 2026-11-17T04:00Z.

- **PR:** PR48 `feature/cosmere-reading-state`
- **Exact head:** 7989e8dc8c5583d6bf5e8138f595979f74630a99 (remote read-back matches)
- **Parent:** 0b43f8ee562b232387e9342d00985c91df9663fb (the head named in the checkpoint; branch had not moved)
- **Requested by:** [key2-events-checkpoint-2026-11-17.md](key2-events-checkpoint-2026-11-17.md)

Not merged. No canon approval, new gate, new mapping, site certification or parent promotion is claimed.

## Exact diff (2 files)

### `public/atlas/packs/cosmere.js` (blob a5dec34 → 1958cee1afd4a8536f6a5a8145fbc40fb7b413b6, +1/−1, one field)

```diff
-      {id: "e8", book: 2, world: "scadrial", site: "kredikshaw", title: "The Lord Ruler falls", text: "Vin finds his weakness and kills the immortal emperor in his palace."},
+      {id: "e8", book: 2, world: "scadrial", site: "kredikshaw", title: "The Lord Ruler falls", text: "The Lord Ruler is defeated and dies."},
```

Payload read-back (remote blob at the head): `id e8, book 2, world scadrial, site kredikshaw, title "The Lord Ruler falls", text "The Lord Ruler is defeated and dies."`, no `gate`/`gates`/`lm`/`fx`. Array position unchanged. The retained `kredikshaw` site is the unverified legacy attachment; its record and description are untouched. `engine.js` (0bc5357) and `reading.js` (4d9bc17) unchanged. PR24/PR37 not touched; PR37's `lm`/`fx` not imported.

### `tests/atlas-scadrial-reduced.test.ts` (→ 8f3976cefb10046c8caa60f349a5eb2be37a7345, +81/−0)

- **Payload test:** e6–e12 are consecutive in the same order and each is deep-equal to its exact expected object (e6/e12 with their accepted gates; e7/e9/e10/e11 unchanged text and no gate; e8 with only the new text). The old e8 sentence and "immortal emperor" are absent from the pack source.
- **Visibility test** (actual engine `evChain`/`pvis` cut from engine.js): e8 visible with the full original trilogy; withheld for all 7 incomplete-trilogy subsets and for later-era-only (AoL + TLM). The existing "descendants cannot bypass the held parent" test still covers every Scadrial event.

## Checks (builder-run, Node v22.23.4)

- **Focused** (`tests/atlas-scadrial-reduced.test.ts` + `tests/atlas-realms-gate.test.ts`): **478/478** ([log](k2e8-unit-head.txt)).
- **Unit negative control**, same tests with the parent pack 0b43f8e: **477/1** ([log](k2e8-unit-negative-0b43f8e.txt)) — only the new payload test fails; the visibility test passes at both (chain unchanged, as intended).
- **Repository:** `pnpm format` (no further changes), `pnpm check`: format OK, build OK, **631/631** unit tests, check:dist **115 files OK**.
- **`pnpm test:pages`:** passed, 12 pages × 2 viewports.
- **`pnpm test:browser`:** **failed** — TimeoutError (the known Save/Load wait at `tests/browser-smoke.mjs:88`, repair in PR47). Not fixed and not claimed fixed.
- **Rendered:** [k2e8-probe.mjs](k2e8-probe.mjs), production build via `vite preview`, headless Chromium + SwiftShader, 1440×900 and 390×844 (phone sheet expanded with a real tap on the grab).
  - **Head 7989e8d: 76/76 pass, 0 page/console errors** ([log](k2e8-rendered-head.txt), VERBOSE).
  - **Parent 0b43f8e** (pack swapped in dist): **60 pass / 16 fail** ([log](k2e8-rendered-negative-0b43f8e.txt)). All 16 failures are the new-wording and old-wording-absent checks in the 4 allowed states × 2 viewports; withheld, title, other-event and error checks pass at both.

| State (each viewport) | Result at head |
| --- | --- |
| Allowed: `#read=` full original trilogy; legacy `#book=2`, `#book=10`; All (`#book=0`) | Scadrial selected; opened e8 dossier item shows title "The Lord Ruler falls" and text exactly "The Lord Ruler is defeated and dies."; old sentence absent from the page. |
| All: other key-2 events | e6, e7, e9, e10, e11, e12 dossier texts exactly unchanged. |
| Withheld: MB1+MB2, MB1+MB3, MB2+MB3; later-era only (bucket 6 + TLM) | Scadrial not selected; neither the e8 title nor old/new text appears anywhere in the page. |

Legacy/All behaviour differs from the parent only by the e8 wording (16/16 negative-control failures are wording checks).

**How exercised:** `__atlas.selectWorld` / `__atlas.openEvent('e8')` (no travel); real tap on the phone grab. **Independent browser execution:** 0 cases.

## Screenshots (6, each < 500 KB; viewed 3)

- Full trilogy, e8 open: [1440×900](shots/k2e8-ot-1440x900.png) (viewed: dossier and Chronicle strip show the new text under "The Lord Ruler falls", site line "Kredik Shaw"), [390×844](shots/k2e8-ot-390x844.png) (viewed: wraps cleanly, all seven key-2 titles listed).
- All: [1440×900](shots/k2e8-all-1440x900.png), [390×844](shots/k2e8-all-390x844.png).
- Withheld MB1+MB2: [1440×900](shots/k2e8-withheld-1440x900.png), [390×844](shots/k2e8-withheld-390x844.png) (viewed: about card "Custom selection: 2 read", no Scadrial).

## Holds and ledgers

Unchanged: e7/e9/e10/e11 prose and mappings held; e8 site attachment, Kredik Shaw description and geometry held; e6/e12 accepted mappings; all prior CBR/SH and MB01/MB05/MB10 corrections and holds. Ledgers: 1/5 remaining event texts narrowed (implemented), 2/7 events mapped, 0 new mappings, 0/2 parent promotions, 0/33 full-work approvals. MB09 deferred.

## Handoff

fixing/claude → implementation-review/chatgpt. ChatGPT: review K2-E8-01 at 7989e8d, then the e7 source unit per the checkpoint.
