# SA01-GEO-01/02 return: two Roshar site-description reductions at PR48 af49e0a

Claude, 2026-11-20T01:00Z.

- **PR:** PR48 `feature/cosmere-reading-state` (draft, not merged)
- **Exact head:** af49e0ab7f32626791d11a2f573dd7b4f074f654 (remote `git ls-remote` read-back matches)
- **Actual parent:** fccfe2c7023b93a91b52df1f812a17f0e94e3ed3 (the head named in the handoff; branch had not moved; parent pack blob 0d1dddaec48658936ab7a99225a9b089837a1f94 matched)
- **Requested by:** [sa01-final-handoff-2026-11-20.md](sa01-final-handoff-2026-11-20.md)

No canon approval, new gate, new mapping, coordinate certification or parent promotion is claimed. PR24 (cf25cda) and PR37 (03394c3) not touched; PR37 events/landmarks not imported.

## Exact diff (2 files)

### `public/atlas/packs/cosmere.js` (0d1dddaec48658936ab7a99225a9b089837a1f94 → 00d8ac461d4299205cb8df883fa557dbd534cbd5, +1/−1 line, two fields on the single `SITES_ROSHAR` line)

```diff
- "desc": "Plateaus split by deep chasms, where the Alethi warcamps hunt chasmfiends for gemhearts. The fragments of a fourth moon that fell long ago lie beneath. Kaladin runs bridges here as a slave."
+ "desc": "An expanse of rocky plateaus divided by deep chasms, east of the Alethi warcamps. Kaladin is brought here as a slave."
- "desc": "Ten craters along the western rim, one per highprince. North to south: Roion, Sadeas, Aladar, Kholin, Vamah, Ruthar, Thanadal, Hatham, Bethab, Sebarial."
+ "desc": "The armies of Alethkar’s ten highprinces camp in enormous craterlike rock formations west of the Shattered Plains."
```

Replacements are the handoff's exact strings (curly apostrophe in “Alethkar’s” preserved). ids, names, lat/lon, books (`[4,5,8,9,12]` / `[4,5,8]`), site order, Roshar parent (`books:[4,5,7,8,9,12]`, `first:4`, no gate, `hero: "shatteredplains"`), events e17–e21, registry and every other field untouched. Removed phrases ("fourth moon", "chasmfiends for gemhearts", "North to south", "Thanadal", "runs bridges here") no longer occur anywhere in the pack.

### `tests/atlas-sa01-geo.test.ts` (new, 21678f8539609ca94a294928c88734ed7bf8bea0, 2 tests; same harness as atlas-na01-geo)

- **Payload:** shatteredplains and warcamps deep-equal the exact expected objects; Roshar site ids/order equal the parent; Roshar has no gate; the **whole parsed pack minus the two `desc` fields deep-equals the parent**; parent control carries the old strings; removed phrases absent; each new string occurs once.
- **Visibility** (actual engine `siteSeen`, `siteEraOk`, `realmOk`, `rdWorldHidden` plus the gate/chain block cut from engine.js, real pack and reading helper): Roshar world and all 52 sites give the same result as the parent in 10 states — All; legacy #book=4, 10, 3, 1; Way of Kings only; bucket 4; buckets 1–3 (no Way of Kings); other work only (MB1); nothing read. Both sites shown in All / Way of Kings / #book=4; withheld for nothing read and MB1 only.

## Per-finding disposition

| Finding | Disposition |
| --- | --- |
| SA01-GEO-01 (shatteredplains.desc) | Implemented with the exact handoff string; no astronomy/origin claim retained. |
| SA01-GEO-02 (warcamps.desc) | Implemented with the exact handoff string; roster omitted (not labelled disproved); no coordinate change. |

## Checks (builder-run, Node v22.23.5)

- **Focused** (`atlas-sa01-geo` + `atlas-na01-geo` + `atlas-sel03-geo` + `atlas-sel03-e30` + `atlas-realms-gate`): **16/16** ([log](sa01geo-unit-head.txt)).
- **Unit negative control**, same tests with the actual-parent pack fccfe2c in the working tree: **15/1** ([log](sa01geo-unit-negative-fccfe2c.txt)) — only the SA01-GEO payload test fails; visibility passes (unchanged, as intended).
- **Repository:** `pnpm format` (no further changes), `pnpm check`: format OK, build OK, **644/644** unit tests, check:dist **115 files OK**.
- **`pnpm test:pages`:** passed, 12 pages × 2 viewports (CHROME_PATH = Chromium 1243).
- **`pnpm test:browser`:** attempt 1 **failed** at `tests/browser-smoke.mjs:88` (Save → Clear all → Load count wait, timeout) — the known Save/Load limitation recorded at earlier PR48 heads; attempt 2 **passed**. The smoke test never renders these site descriptions. Not claimed fixed or caused.
- **Rendered:** [sa01geo-probe.mjs](sa01geo-probe.mjs) (adapted from na01geo-probe.mjs; unchanged controls are tower/kharbranth, both book-4 sites), production `dist` served statically under `/universe-sandbox/`, headless Chromium 1243 + SwiftShader, 1440×900 and 390×844 (phone sheet expanded with a real tap; sites opened with a real click/tap).
  - **Head af49e0a: 190/190 pass, 0 page/console errors** ([log](sa01geo-rendered-head.txt), VERBOSE).
  - **Parent fccfe2c** (pack swapped into dist): **94 pass / 96 fail** ([log](sa01geo-rendered-negative-fccfe2c.txt)); all 96 are new-description and removed-phrase checks (12 kinds × 4 allowed states × 2 viewports). Site opening, wrapping, tower/kharbranth, withheld and error checks pass at both.
  - First probe draft used narak as an unchanged control; narak is not a book-4 site so it was correctly absent in Way of Kings / #book=4 (4 probe-design failures, not product). Control swapped to tower before the recorded runs.

| State (each viewport) | Result at head |
| --- | --- |
| Allowed: Way of Kings only; legacy #book=4, #book=10; All | Roshar selected; Places list shatteredplains/warcamps `.pd` = exact new strings; tower/kharbranth unchanged; each site opened → `S.site` matches, visible description = new string, wraps inside the viewport; removed phrases absent before and after opening. |
| Withheld: buckets 1–3 (no Way of Kings); MB1 only; legacy #book=3 | No shatteredplains/warcamps place button; neither old nor new description anywhere on the page. |

**Independent browser execution:** 0 cases (builder evidence only).

## Screenshots (10, each < 500 KB; viewed 2)

- Shattered Plains opened: Way of Kings [1440×900](shots/sa01geo-shatteredplains-wayofkings-1440x900.png), [390×844](shots/sa01geo-shatteredplains-wayofkings-390x844.png) (viewed: new text wraps over three lines in the phone sheet, no overflow); All [1440×900](shots/sa01geo-shatteredplains-all-1440x900.png), [390×844](shots/sa01geo-shatteredplains-all-390x844.png).
- Warcamps opened: Way of Kings [1440×900](shots/sa01geo-warcamps-wayofkings-1440x900.png) (viewed: new text in the right panel over three lines), [390×844](shots/sa01geo-warcamps-wayofkings-390x844.png); All [1440×900](shots/sa01geo-warcamps-all-1440x900.png), [390×844](shots/sa01geo-warcamps-all-390x844.png).
- Withheld MB1 only: [1440×900](shots/sa01geo-withheld-1440x900.png) (palette-quantized to fit 500 KB), [390×844](shots/sa01geo-withheld-390x844.png).

## Holds and ledgers

Unchanged per handoff: e17–e21, all Roshar coordinates, Kharbranth/Kholinar composites, CS01 northern-plateau removal, NA01-GEO-01/02, PR37-only key-4 events and 26 landmarks (not imported), D09/D10. SA01: 2/2 description corrections implemented here (awaiting review), 0 new gates/mappings, 0/33 full-work approvals; full SA01 audit remains deferred. Save/Load limitation preserved.

## Handoff

fixing/claude → implementation-review/chatgpt. ChatGPT: review SA01-GEO-01/02 at af49e0ab7f32626791d11a2f573dd7b4f074f654.
