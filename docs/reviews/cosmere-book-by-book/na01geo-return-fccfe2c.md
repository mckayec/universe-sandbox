# NA01-GEO-01/02 return: two Nalthis site-description narrowings at PR48 fccfe2c

Claude, 2026-11-20T00:02Z.

- **PR:** PR48 `feature/cosmere-reading-state` (draft, not merged)
- **Exact head:** fccfe2c7023b93a91b52df1f812a17f0e94e3ed3 (remote `git ls-remote` read-back matches)
- **Parent:** 52534d0975af39e620e05a43c2f4f05dc6b4b1fc (the head named in the handoff; branch had not moved)
- **Requested by:** [na01-geo-handoff-2026-11-19.md](na01-geo-handoff-2026-11-19.md)

No canon approval, new gate, new mapping, coordinate certification or parent promotion is claimed. PR24 (cf25cda) and PR37 (03394c3) not touched; PR37 scene/landmark data not imported.

## Exact diff (2 files)

### `public/atlas/packs/cosmere.js` (0fd66c7cca0085872e8f8a3d2154e4010356b9e6 → 0d1dddaec48658936ab7a99225a9b089837a1f94, +2/−2, two fields)

```diff
-         {id: "ttelir", name: "T’Telir", lat: 11.2, lon: 5.6, books: [3], desc: "Hallandren’s capital, built in a crescent around a sheltered bay on the Bright Sea, with markets, merchant mansions, slums and docks, and Awakened statues everywhere."},
+         {id: "ttelir", name: "T’Telir", lat: 11.2, lon: 5.6, books: [3], desc: "Hallandren’s capital curves around a bay on the Bright Sea, with painted buildings and warrior statues at street corners."},
-         {id: "denir", name: "D’Denir garden", lat: 11.7, lon: 5.55, books: [3], desc: "A quiet field of hundreds of old warrior statues in the north of the city."},
+         {id: "denir", name: "D’Denir garden", lat: 11.7, lon: 5.55, books: [3], desc: "A quiet grassy field in T’Telir, filled with hundreds of weathered warrior statues."},
```

Replacements are the handoff's exact strings. ids, names, lat/lon, books, site order (ttelir → courtofgods → denir → brightsea → edglipool → bevalis → passes → pahnkahl → tedradel → kuth), Nalthis parent (`books:[3,5,7]`, `first:3`, no gate), hero, events (e13–e16), registry and every other field untouched.

### `tests/atlas-na01-geo.test.ts` (new, 5d2e433d170fc13b885bbe91fdc485fdc603323b, 2 tests)

- **Payload:** ttelir and denir deep-equal the exact expected objects; Nalthis site ids/order exact; Nalthis has no gate; the **whole parsed pack minus the two `desc` fields deep-equals the parent**; parent control carries the old strings; removed phrases absent; each new string occurs once.
- **Visibility** (actual engine `siteSeen`, `siteEraOk`, `realmOk`, `rdWorldHidden` plus the gate/chain block cut from engine.js, real pack and reading helper): Nalthis world and all ten sites give the same result as the parent in 10 states — All; legacy #book=3, 10, 2, 1; Warbreaker only; bucket 3; buckets 1+2 (no Warbreaker); other work only (MB1); nothing read. Both sites shown in All / Warbreaker / #book=3; withheld for nothing read and MB1 only.

## Per-finding disposition

| Finding | Disposition |
| --- | --- |
| NA01-GEO-01 (ttelir.desc) | Implemented with the exact handoff string. |
| NA01-GEO-02 (denir.desc) | Implemented with the exact handoff string; no coordinate relocation, no substitute direction. |

## Checks (builder-run, Node v22.23.5)

- **Focused** (`atlas-na01-geo` + `atlas-sel03-geo` + `atlas-sel03-e30` + `atlas-realms-gate`): **14/14** ([log](na01geo-unit-head.txt)).
- **Unit negative control**, same tests with the parent pack 52534d0 in the working tree: **13/1** ([log](na01geo-unit-negative-52534d0.txt)) — only the NA01-GEO payload test fails; visibility passes (unchanged, as intended).
- **Repository:** `pnpm format` (no further changes), `pnpm check`: format OK, build OK, **642/642** unit tests, check:dist **115 files OK**.
- **`pnpm test:pages`:** passed, 12 pages × 2 viewports (CHROME_PATH = Chromium 1243).
- **`pnpm test:browser`:** **failed** 2/2 attempts at `tests/browser-smoke.mjs:88` (Save → Clear all → Load count wait, timeout) — the known Save/Load limitation recorded at earlier PR48 heads. The smoke test never renders these site descriptions. Not claimed fixed or caused; no parent control run this time.
- **Rendered:** [na01geo-probe.mjs](na01geo-probe.mjs) (adapted from sel03geo-probe.mjs), production `dist` served statically under `/universe-sandbox/`, headless Chromium 1243 + SwiftShader, 1440×900 and 390×844 (phone sheet expanded with a real tap; sites opened with a real click/tap).
  - **Head fccfe2c: 158/158 pass, 0 page/console errors** ([log](na01geo-rendered-head.txt), VERBOSE).
  - **Parent 52534d0** (pack swapped into dist): **94 pass / 64 fail** ([log](na01geo-rendered-negative-52534d0.txt)); all 64 are the new-description and removed-phrase checks (8 kinds × 4 allowed states × 2 viewports). Site opening, wrapping, courtofgods/brightsea, withheld and error checks pass at both.

| State (each viewport) | Result at head |
| --- | --- |
| Allowed: Warbreaker only; legacy #book=3, #book=10; All | Nalthis selected; Places list ttelir/denir `.pd` = exact new strings; courtofgods/brightsea unchanged; each site opened → `S.site` matches, visible description = new string, wraps inside the viewport; "Awakened statues everywhere" and "in the north of the city" absent before and after opening. |
| Withheld: buckets 1+2 (no Warbreaker); MB1 only; legacy #book=2 | No ttelir/denir place button; neither old nor new description anywhere on the page. |

**Independent browser execution:** 0 cases (builder evidence only).

## Screenshots (10, each < 500 KB; viewed 2)

- T’Telir opened: Warbreaker [1440×900](shots/na01geo-ttelir-warbreaker-1440x900.png), [390×844](shots/na01geo-ttelir-warbreaker-390x844.png) (viewed: new text wraps over three lines in the phone sheet, no overflow); All [1440×900](shots/na01geo-ttelir-all-1440x900.png), [390×844](shots/na01geo-ttelir-all-390x844.png).
- D’Denir garden opened: Warbreaker [1440×900](shots/na01geo-denir-warbreaker-1440x900.png) (viewed: new text in the right panel over two lines), [390×844](shots/na01geo-denir-warbreaker-390x844.png); All [1440×900](shots/na01geo-denir-all-1440x900.png), [390×844](shots/na01geo-denir-all-390x844.png).
- Withheld MB1 only: [1440×900](shots/na01geo-withheld-1440x900.png) (palette-quantized to fit 500 KB), [390×844](shots/na01geo-withheld-390x844.png).

## Holds and ledgers

Unchanged per handoff: coordinates of all ten Nalthis sites (held), courtofgods (checkpoint-1 limited retention), brightsea/edglipool/bevalis/passes/pahnkahl/tedradel/kuth (residual holds), e13–e16 (preserved), e77/e78 (absent on PR48, not imported), PR37 scenes/landmarks, D09/D10. NA01: 2/2 description corrections implemented here (awaiting review), 0 new gates/mappings, 16/16 record dispositions unchanged, 0/33 full-work approvals. Save/Load limitation preserved.

## Handoff

fixing/claude → implementation-review/chatgpt. ChatGPT: review NA01-GEO-01/02 at fccfe2c7023b93a91b52df1f812a17f0e94e3ed3.
