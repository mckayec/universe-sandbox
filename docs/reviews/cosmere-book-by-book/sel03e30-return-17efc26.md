# SEL03-E30-01 return: e30 text-only precision correction at PR48 17efc26

Claude, 2026-11-17T09:05Z.

- **PR:** PR48 `feature/cosmere-reading-state` (draft, not merged)
- **Exact head:** 17efc26c276594fa00b9775515a433bcf9bb9e87 (remote `git ls-remote` read-back matches)
- **Parent:** d22843792a983f5b47ceab22c897b8ce5ba37388 (the head named in the handoff; branch had not moved)
- **Requested by:** [sel03-e30-handoff-2026-11-17.md](sel03-e30-handoff-2026-11-17.md)

No canon approval, new gate, new mapping, site certification or parent promotion is claimed.

## Exact diff (2 files)

### `public/atlas/packs/cosmere.js` (6d721c97 → 8f755a2192d354836b9cd59361fc060f43ca8dbc, +1/−1, one field)

```diff
-      {id: "e30", book: 7, world: "sel", site: "roseempire", title: "The Emperor’s Soul", text: "A condemned Forger is given a hundred days to rebuild the soul of a dying emperor."},
+      {id: "e30", book: 7, world: "sel", site: "roseempire", title: "The Emperor’s Soul", text: "A condemned Forger, Shai, has ninety-eight days to recreate Emperor Ashravan’s soul; his body has been healed, but his mind remains blank."},
```

id, book 7, world sel, site roseempire, title and array position (e29 → e30 → e31) unchanged; no `gate`/`gates`/`lm`/`fx`. roseempire site, Sel record, JinDo, MaiPon, Shai codex, registry row and all earlier accepted corrections (e7–e11, CBR/SH/MB05/MB10) untouched. PR24 (cf25cda) and PR37 (03394c3) not touched.

### `tests/atlas-sel03-e30.test.ts` (new, 2d107cc38c440e45c28ebc875268766ca58a61f5, 2 tests)

- **Payload:** e30 deep-equals the exact expected object; no gate/gates/lm/fx; e29/e31 neighbours exact and in order; Sel `books:[1,7]`, `first:1`, no record gate; roseempire site exact (desc held unchanged); old sentence, "dying emperor" and "given a hundred days" absent; new sentence occurs once.
- **Visibility** (actual engine `evChain`/`evOk` cut from engine.js, real pack and reading helper): compared against the parent pack in every state, same result and same chain.

| State | e30 shown |
| --- | --- |
| All; legacy #book=7, #book=10 | yes |
| Sufficient per-work set: bucket 1 (Elantris) + every bucket-7 work | yes |
| legacy #book=1, #book=6 | no |
| TES only; bucket 7 without bucket 1; bucket 1 + TES only; bucket 1 + bucket 7 minus TES; MB1 only; nothing read | no |

As the handoff notes, the chain is the unreviewed bucket fallback: TES alone does not reveal e30 (needs all of bucket 7 plus Elantris). Unchanged; no new mapping requested or made.

## Checks (builder-run, Node v22.23.4)

- **Focused** (`atlas-sel03-e30` + `atlas-scadrial-reduced` + `atlas-realms-gate`): **483/483** ([log](sel03e30-unit-head.txt)).
- **Unit negative control**, same tests with the parent pack d228437: **482/1** ([log](sel03e30-unit-negative-d228437.txt)) — only the SEL03 payload test fails; visibility passes at both (chain unchanged, as intended).
- **Repository:** `pnpm format` (no further changes), `pnpm check`: format OK, build OK, **636/636** unit tests, check:dist **115 files OK**.
- **`pnpm test:pages`:** passed, 12 pages × 2 viewports (CHROME_PATH = Chromium 1243).
- **`pnpm test:browser`:** **failed** 4/4 at the head, each at `tests/browser-smoke.mjs:88` (Save → Clear all → Load count wait, 30 s timeout). **Control** with the parent d228437 pack swapped into the working tree: 1 pass, 1 fail at line 88. The smoke test only checks that the Cosmere card is offered; it never loads the pack's event text, so this one-string change cannot reach line 88. Recorded as the known intermittent Save/Load limitation; not claimed fixed or caused.
- **Rendered:** [sel03e30-probe.mjs](sel03e30-probe.mjs) (adapted from k2e11-probe.mjs), production `dist` served statically under `/universe-sandbox/`, headless Chromium 1243 + SwiftShader, 1440×900 and 390×844 (phone sheet expanded with a real tap on the grab).
  - **Head 17efc26c276594fa00b9775515a433bcf9bb9e87: 80/80 pass, 0 page/console errors** ([log](sel03e30-rendered-head.txt), VERBOSE).
  - **Parent d228437** (pack swapped in dist): **64 pass / 16 fail** ([log](sel03e30-rendered-negative-d228437.txt)); all 16 are the new-wording and old-wording-absent checks in the 4 allowed states × 2 viewports.

| State (each viewport) | Result at head |
| --- | --- |
| Allowed: sufficient set; legacy #book=7, #book=10; All | Sel selected; opened e30 dossier item shows "The Emperor’s Soul" and exactly the new sentence; old sentence absent from page. |
| All: other Sel events | e1–e5 texts exactly unchanged. |
| Withheld: TES only; bucket 7 only; bucket 1 + TES; MB1 only; legacy #book=6 | No e30 dossier item; neither old nor new text anywhere on the page. (The title equals the work title listed by the reading picker, so it is not a withheld marker.) |

**How exercised:** `__atlas.selectWorld('sel')` / `__atlas.openEvent('e30')` (no travel); real tap on the phone grab. **Independent browser execution:** 0 cases.

## Screenshots (6, each < 500 KB; viewed 3)

- Sufficient set, e30 open: [1440×900](shots/sel03e30-sufficient-1440x900.png) (viewed: "In the Chronicle" lists e1–e5 then "VII The Emperor’s Soul" with the new sentence wrapping over three lines, site line "The Imperial Seat (Rose Empire)"), [390×844](shots/sel03e30-sufficient-390x844.png) (viewed: sentence wraps cleanly over three lines in the expanded sheet, no overflow).
- All: [1440×900](shots/sel03e30-all-1440x900.png), [390×844](shots/sel03e30-all-390x844.png).
- Withheld TES only: [1440×900](shots/sel03e30-withheld-1440x900.png), [390×844](shots/sel03e30-withheld-390x844.png) (viewed: about card "Custom selection: 1 read", no Sel dossier).

## Holds and ledgers

Unchanged per handoff: roseempire description/geometry (held), mulladil, dzhamar, maipon (partial/held), Shai codex (partial/held), Sel short/era facts, JinDo, registry; PR37 chamber landmark/scene additions not imported. SEL03: 1 correction implemented here (awaiting review), 0 new gates, 0/4 complete site records certified, 0/1 full SEL03 audit. Prior ledgers preserved: 5/5 key-2 prose dispositions, 2/7 key-2 mappings, 0/2 Scadrial parent promotions, 0/33 full-work approvals.

## Handoff

fixing/claude → implementation-review/chatgpt. ChatGPT: review SEL03-E30-01 at 17efc26c276594fa00b9775515a433bcf9bb9e87.
