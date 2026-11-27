# SA02-L23-PORT return: e24 Narak pin removed, qualified palace text at PR48 97ebc3d

Claude, 2026-11-20T03:10Z.

- **PR:** PR48 `feature/cosmere-reading-state` (draft, not merged)
- **Exact head:** 97ebc3d1c4d0f7e21d486dc2afdac842e4dc19fb (remote `git ls-remote` read-back matches)
- **Actual parent:** af49e0ab7f32626791d11a2f573dd7b4f074f654 (the head named in the handoff; branch had not moved; parent pack blob 00d8ac461d4299205cb8df883fa557dbd534cbd5 matched)
- **Requested by:** [sa02-final-handoff-2026-11-20.md](sa02-final-handoff-2026-11-20.md)

No canon approval, new gate, new mapping, landmark, coordinate, parent metadata or reading-state promotion is claimed. PR24 (cf25cda) and PR37 (03394c3) not touched; PR37's warcamps/pinnacle pin not imported.

## Exact diff (2 files)

### `public/atlas/packs/cosmere.js` (00d8ac461d4299205cb8df883fa557dbd534cbd5 → ebe9c3948fe288723aac8093e9fc5eabbee65f91, +1/−1, line 769)

```diff
-      {id: "e24", book: 5, world: "roshar", site: "narak", title: "Kaladin’s Third Ideal", text: "Kaladin swears to protect even those he hates, and flies."},
+      {id: "e24", book: 5, world: "roshar", title: "Kaladin’s Third Ideal", text: "At the king’s palace in the warcamps, Kaladin speaks his Third Ideal while protecting Elhokar. Location is provisional, based on Tor.com’s chapter rereads rather than a checked edition of the novel."},
```

Replacement is the handoff's exact string (curly apostrophes preserved). id, book 5, world roshar, title, event order and every other pack value untouched. Old phrases ("protect even those he hates", "and flies.") no longer occur in the pack. No palace site added.

### `tests/atlas-sa02-l23.test.ts` (new, 0708fb669ccf15b374b66205971bc24fde095169, 2 tests; same harness as atlas-sa01-geo)

- **Payload:** e24 deep-equals `{id, book:5, world:"roshar", title, text:new}` (no `site`); parent control has `site:"narak"` and the old text; event ids/order equal the parent; **whole parsed pack minus e24.site/e24.text deep-equals the parent**; old copy absent; new text once; no `palace` site on Roshar.
- **Visibility** (actual engine `evOk` with `evChain`/`siteChain`/`worldChain` and the gate block cut from engine.js, real pack and reading helper): every Roshar event gives the same result as the parent in 12 states — All; legacy #book=5, 10, 4, 1; Words of Radiance only; Way of Kings + Words of Radiance; bucket 5; buckets 1–4; Way of Kings only; MB1 only; nothing read. e24 shown exactly in All, #book=5, #book=10 and WoK+WoR; withheld in the rest. Words of Radiance alone / bucket 5 alone withhold e24 at both parent and head because Roshar itself requires The Way of Kings in per-work modes — unchanged behaviour, not introduced here.

## Checks (builder-run, Node v22.23.5)

- **Focused** (`atlas-sa02-l23` + `atlas-sa01-geo` + `atlas-na01-geo` + `atlas-sel03-geo` + `atlas-sel03-e30` + `atlas-realms-gate`): **18/18** ([log](sa02l23-unit-head.txt)).
- **Unit negative control**, same files with the actual-parent pack af49e0a in the working tree: **16 pass / 1 fail** ([log](sa02l23-unit-negative-af49e0a.txt)) — only `atlas-sa02-l23` fails (fails closed at its top-level "new e24 line occurs once" assertion, so its two subtests do not run); all other focused files pass.
- **Repository:** `pnpm format` (no further changes), `pnpm check`: format OK, build OK, **646/646** unit tests, check:dist **115 files OK**.
- **`pnpm test:pages`:** passed, 12 pages × 2 viewports (CHROME_PATH = Chromium 1243).
- **`pnpm test:browser`:** **failed** both attempts at `tests/browser-smoke.mjs:88` (Save → Clear all → Load count wait, 30 s timeout) — the known Save/Load limitation recorded at earlier PR48 heads (at af49e0a it failed once then passed). The smoke test never renders e24. Not claimed fixed or caused; remains open.
- **Rendered:** [sa02l23-probe.mjs](sa02l23-probe.mjs), production `dist` served statically under `/universe-sandbox/`, headless Chromium 1243 + SwiftShader, 1440×900 and 390×844 (phone sheet expanded with a real tap; dossier item opened with a real click/tap; on the phone the Chronicle opens with a real tap on its title, but the e24 track item sits under the collapsed sheet bar, so that one click is a DOM-dispatched click).
  - **Head 97ebc3d: 120/120 pass, 0 page/console errors** ([log](sa02l23-rendered-head.txt), VERBOSE).
  - **Parent af49e0a** (pack swapped into dist): **84 pass / 36 fail** ([log](sa02l23-rendered-negative-af49e0a.txt)); all 36 are new-text, no-place-label and old-copy checks (6 kinds × 3 allowed states × 2 viewports). Selection, S.site, withheld and error checks pass at both.
  - Limit: the "jump to Narak" path in the parent is the **world (surface) view** branch of `openEvent` (`selectSite(e.site)` / `laterSite`); both galaxy-view paths probed here leave `S.site` null at parent and head alike. The surface view was not rendered (software-GL surface bake has exceeded 180–900 s in earlier runs). Every site branch in `openEvent` and the place label in the dossier are guarded by `e.site`, which no longer exists on e24; the place label's absence is rendered-verified.

| State (each viewport) | Result at head |
| --- | --- |
| Allowed: WoK + WoR; legacy #book=5; All | Roshar selected; dossier "In the Chronicle" e24 text = exact new string, no place label (parent showed "Narak (Stormseat)"); opened → `S.ev` e24, `S.site` null, still Roshar, text wraps inside the viewport; Chronicle-track travel → Roshar, `S.site` null, e24 open; old copy absent throughout. |
| Withheld: WoK only; WoR only; legacy #book=4 | No e24 item; neither old nor new text anywhere on the page. |

**Independent browser execution:** 0 cases (builder evidence only).

## Screenshots (6, each < 500 KB; viewed 2)

- Dossier e24 opened: WoK+WoR [1440×900](shots/sa02l23-e24-dossier-wok-wor-1440x900.png) (viewed: new text over four lines in the right panel, no place label, Narak/Urithiru labels on e22/e23 unchanged), [390×844](shots/sa02l23-e24-dossier-wok-wor-390x844.png) (viewed: text wraps over five lines in the phone sheet, no overflow); All [1440×900](shots/sa02l23-e24-dossier-All-1440x900.png), [390×844](shots/sa02l23-e24-dossier-All-390x844.png).
- Chronicle travel, WoK+WoR: [1440×900](shots/sa02l23-e24-chronicle-1440x900.png), [390×844](shots/sa02l23-e24-chronicle-390x844.png).

## Holds and ledgers

Unchanged per handoff: e22, e23, e25 and their sites; narak/urithiru/roshar/braize records; PR37-only e87–e90 and landmarks (not imported); CS01 palace/northern-plateau removal; SA01-GEO-01/02; NA01-GEO-01/02; D09/D10. SA02: 1/1 finite correction implemented here (awaiting review), 0 new gates/mappings, 0/33 full-work approvals; full SA02 audit remains deferred. Save/Load limitation preserved.

## Handoff

fixing/claude → implementation-review/chatgpt. ChatGPT: review SA02-L23-PORT at 97ebc3d1c4d0f7e21d486dc2afdac842e4dc19fb.
