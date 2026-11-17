# SEL03-GEO-01/02 return: two site-description reductions at PR48 88dc662

Claude, 2026-11-17T10:20Z.

- **PR:** PR48 `feature/cosmere-reading-state` (draft, not merged)
- **Exact head:** 88dc6627423a65eb117a10663b4f91551fb3cc70 (remote `git ls-remote` read-back matches)
- **Parent:** 17efc26c276594fa00b9775515a433bcf9bb9e87 (the head named in the handoff; branch had not moved)
- **Requested by:** [sel03-final-checkpoint-2026-11-17.md](sel03-final-checkpoint-2026-11-17.md)

No canon approval, new gate, new mapping, site/coordinate certification or parent promotion is claimed. PR24 (cf25cda) and PR37 (03394c3) not touched.

## Exact diff (2 files)

### `public/atlas/packs/cosmere.js` (8f755a2192d354836b9cd59361fc060f43ca8dbc → a76929639d9cc848e2c52bcaa39622fde3cf239c, +2/−2, two fields)

```diff
-         {id: "mulladil", name: "Mulla’dil", lat: 51.0, lon: -52.0, books: [7], desc: "A mountainous province of the Rose Empire whose Strikers guard the passes to Teod."},
+         {id: "mulladil", name: "Mulla’dil", lat: 51.0, lon: -52.0, books: [7], desc: "A mountainous region of the Rose Empire whose people are known as Strikers."},
-         {id: "maipon", name: "MaiPon", lat: 61.0, lon: -25.0, books: [7], desc: "Shai’s homeland and the heart of Forgery; its position in the empire is not given."},
+         {id: "maipon", name: "MaiPon", lat: 61.0, lon: -25.0, books: [7], desc: "Shai’s homeland and the heart of Forgery."},
```

Replacements are the handoff's exact strings. ids, names, lat/lon, books, site order (… teoras → roseempire → mulladil → dzhamar → maipon → desert), Sel parent (`books:[1,7]`, `first:1`, no gate), e30 (as accepted at 17efc26), roseempire and dzhamar untouched; no gate/gates/rel/scene/lm added.

### `tests/atlas-sel03-geo.test.ts` (new, 873b1f29c1c3548244f9eea12faad25efe595bcc, 2 tests)

- **Payload:** the four Sel book-7 sites deep-equal the exact expected objects in order, followed by `desert`; none carries gate/gates/rel/scene/lm; the **whole pack minus the two `desc` fields deep-equals the parent** (so every other world/site/event field is unchanged); old phrases absent; each new string occurs once; e30 text equals the accepted wording.
- **Visibility** (actual engine `siteSeen`, `siteEraOk`, `realmOk`, `rdWorldHidden` plus the gate/chain block, cut from engine.js, real pack and reading helper): Sel world and the four sites give the same result as the parent in all 11 states — All; legacy #book=7, 10, 6, 1; sufficient bucket 1 + bucket 7; TES only; bucket 7 without bucket 1; bucket 1 + TES; other work only (MB1); nothing read. All shows all four.

## Checks (builder-run, Node v22.23.4)

- **Focused** (`atlas-sel03-geo` + `atlas-sel03-e30` + `atlas-scadrial-reduced` + `atlas-realms-gate`): **485/485** ([log](sel03geo-unit-head.txt)).
- **Unit negative control**, same tests with the parent pack 17efc26 in the working tree: **484/1** ([log](sel03geo-unit-negative-17efc26.txt)) — only the SEL03-GEO payload test fails; e30 and visibility pass (unchanged, as intended).
- **Repository:** `pnpm format` (no further changes), `pnpm check`: format OK, build OK, **638/638** unit tests, check:dist **115 files OK**.
- **`pnpm test:pages`:** passed, 12 pages × 2 viewports (CHROME_PATH = Chromium 1243).
- **`pnpm test:browser`:** **failed** 2/2 attempts at `tests/browser-smoke.mjs:88` (Save → Clear all → Load count wait, timeout) — the same known intermittent Save/Load limitation recorded at 17efc26 and d228437 (where the parent pack also failed). The smoke test never renders these site descriptions. Not claimed fixed or caused; no new parent control run this time.
- **Rendered:** [sel03geo-probe.mjs](sel03geo-probe.mjs) (adapted from sel03e30-probe.mjs), production `dist` served statically under `/universe-sandbox/`, headless Chromium 1243 + SwiftShader, 1440×900 and 390×844 (phone sheet expanded with a real tap on the grab; sites opened with a real click/tap on the Places button).
  - **Head 88dc6627423a65eb117a10663b4f91551fb3cc70: 178/178 pass, 0 page/console errors** ([log](sel03geo-rendered-head.txt), VERBOSE).
  - **Parent 17efc26** (pack swapped into dist): **114 pass / 64 fail** ([log](sel03geo-rendered-negative-17efc26.txt)); all 64 are the new-description and removed-phrase checks (8 kinds × 4 allowed states × 2 viewports). Site opening, wrapping, roseempire/dzhamar, withheld and error checks pass at both.

| State (each viewport) | Result at head |
| --- | --- |
| Allowed: sufficient set; legacy #book=7, #book=10; All | Sel selected; Places list mulladil/maipon `.pd` = exact new strings; roseempire/dzhamar unchanged; each site opened → `S.site` matches, visible description = new string, wraps inside the viewport (no horizontal overflow); "passes to Teod" and "position in the empire is not given" absent from the page before and after opening. |
| Withheld: TES only; bucket 7 only; bucket 1 + TES; MB1 only; legacy #book=6 | No mulladil/maipon place button; neither old nor new description anywhere on the page. |

**Independent browser execution:** 0 cases (builder evidence only).

## Screenshots (7, each < 500 KB; viewed 4)

- Mulla’dil opened, sufficient set: [1440×900](shots/sel03geo-mulladil-sufficient-1440x900.png), [390×844](shots/sel03geo-mulladil-sufficient-390x844.png) (viewed: selected card shows "A mountainous region of the Rose Empire whose people are known as Strikers." wrapping over two lines in the phone sheet, no overflow).
- MaiPon opened: sufficient [1440×900](shots/sel03geo-maipon-sufficient-1440x900.png) (viewed: "Shai’s homeland and the heart of Forgery." on one line in the right panel), [390×844](shots/sel03geo-maipon-sufficient-390x844.png); All [390×844](shots/sel03geo-maipon-all-390x844.png).
- Withheld TES only: [1440×900](shots/sel03geo-withheld-1440x900.png) (palette-quantized to fit 500 KB), [390×844](shots/sel03geo-withheld-390x844.png) (viewed: about card "Custom selection: 1 read", no Sel places).

## Holds and ledgers

Unchanged per handoff: roseempire and dzhamar copy (held, secondary-supported), all four sites' coordinates (held schematic placements, not certified), Shai codex, JinDo, Sel short/era facts, registry; PR37 scenes/landmarks/e30.lm not imported. SEL03: 2/2 description reductions implemented here (awaiting review), 1/1 e30 correction previously accepted, 0 new gates/mappings, 0/4 complete site records certified, 0/1 full SEL03 audit (deferred with Known gaps per checkpoint). Prior ledgers preserved: 5/5 key-2 prose dispositions, 2/7 key-2 mappings, 0/2 Scadrial parent promotions, 0/33 full-work approvals.

## Handoff

fixing/claude → implementation-review/chatgpt. ChatGPT: review SEL03-GEO-01/02 at 88dc6627423a65eb117a10663b4f91551fb3cc70.
