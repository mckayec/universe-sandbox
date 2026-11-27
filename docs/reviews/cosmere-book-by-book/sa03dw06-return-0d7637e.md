# SA03-DW06-PORT return: e35 journey sentence at PR48 0d7637e

Claude, 2026-11-20T05:00Z.

- **PR:** PR48 `feature/cosmere-reading-state` (draft, not merged)
- **Exact head:** 0d7637e8973187afa3e8c58552a197d48c315b03 (remote `git ls-remote` read-back matches)
- **Actual parent:** 97ebc3d1c4d0f7e21d486dc2afdac842e4dc19fb (the head named in the handoff; branch had not moved; parent pack blob ebe9c3948fe288723aac8093e9fc5eabbee65f91 matched the handoff table)
- **Requested by:** [sa03-handoff-2026-11-20.md](sa03-handoff-2026-11-20.md)

No canon approval, new gate, new mapping, landmark, coordinate, parent metadata, site change or reading-state promotion is claimed. PR24 (cf25cda) and PR37 (03394c3) not touched; PR37's e96, Lift codex and nested landmarks not imported.

## Exact diff (2 files)

### `public/atlas/packs/cosmere.js` (ebe9c3948fe288723aac8093e9fc5eabbee65f91 → ae2a877eb9a667c332e0f5b96ea22c89b5c91f35, +1/−1, line 782)

```diff
-      {id: "e35", book: 7, world: "roshar", site: "yeddaw", title: "Edgedancer", text: "Lift crosses to Tashikk to protect a man the Herald Nale wants dead."},
+      {id: "e35", book: 7, world: "roshar", site: "yeddaw", title: "Edgedancer", text: "Lift travels to Yeddaw in Tashikk, where Darkness has been reported."},
```

Replacement is the handoff's exact string. id e35, book 7, world roshar, site yeddaw, title, array position and absence of lm/effect unchanged. Old phrases ("Lift crosses to Tashikk", "protect a man the Herald Nale wants dead") no longer occur in the pack.

### `tests/atlas-sa03-dw06.test.ts` (new, c29369ee3cd1981379c17e8a4b87cb700a80a482, 2 tests; same harness as atlas-sa02-l23)

- **Payload:** e35 deep-equals `{id, book:7, world:"roshar", site:"yeddaw", title:"Edgedancer", text:new}`, no lm/effect; parent control has the old text; event ids/order equal the parent; **whole parsed pack minus e35.text deep-equals the parent**; old copy absent; new text once.
- **Visibility** (actual engine `evOk`, `siteSeen` and `rdWorldHidden` with the gate block cut from engine.js, real pack and reading helper): every Roshar event and the Yeddaw site give the same result as the parent in the handoff's **11 enumerated states**, and e35 and Yeddaw match the handoff table exactly — shown in All, legacy #book=7, legacy #book=12, WoK + all 13 bucket-7 works; withheld in legacy #book=6, nothing read, Edgedancer only, WoK + Edgedancer, WoK + WoR + Edgedancer, whole bucket 7 only, WoK + bucket 7 minus Edgedancer. The test also asserts bucket 7 has 13 works including Edgedancer. Conservative bucket-7/ancestor fallback is unchanged behaviour, not introduced or approved here.

## Checks (builder-run, Node v22.23.5)

- **Focused** (`atlas-sa03-dw06` + `atlas-sa02-l23` + `atlas-sa01-geo` + `atlas-na01-geo` + `atlas-sel03-geo` + `atlas-sel03-e30` + `atlas-realms-gate`): **20/20** ([log](sa03dw06-unit-head.txt)).
- **Unit negative control**, same files with the actual-parent pack 97ebc3d in the working tree: **18 pass / 1 fail** ([log](sa03dw06-unit-negative-97ebc3d.txt)) — only `atlas-sa03-dw06` fails, at its top-level "new e35 line occurs once" assertion (so its two subtests do not run); all other focused files pass.
- **Repository:** `pnpm format` (no further changes; Prettier check of both changed files clean), `pnpm check`: format OK, build OK, **648/648** unit tests, check:dist **115 files OK**.
- **`pnpm test:pages`:** passed, 12 pages × 2 viewports (CHROME_PATH = Chromium 1243).
- **`pnpm test:browser`:** **1 pass, 1 fail** on two consecutive runs; the failure is at `tests/browser-smoke.mjs:88` (Save → Clear all → Load count wait, 30 s timeout) — the known, intermittent Save/Load limitation carried from earlier PR48 heads. The smoke test never renders e35. Not claimed fixed or caused; remains open.
- **Rendered:** [sa03dw06-probe.mjs](sa03dw06-probe.mjs), production `dist` served statically under `/universe-sandbox/`, headless Chromium 1243 + SwiftShader, 1440×900 and 390×844 (phone sheet expanded with a real tap; dossier item opened with a real click/tap; phone Chronicle opened with a real tap on its title, but the e35 track item sits under the collapsed sheet bar, so that one click is DOM-dispatched — same limitation as the SA02 probe).
  - **Head 0d7637e: 114/114 pass, 0 page/console errors** ([log](sa03dw06-rendered-head.txt), VERBOSE).
  - **Parent 97ebc3d** (pack swapped into dist): **78 pass / 36 fail** ([log](sa03dw06-rendered-negative-97ebc3d.txt)); all 36 are new-text and old-copy checks (6 kinds × 3 allowed states × 2 viewports). Selection, Yeddaw place label, withheld and error checks pass at both.
  - `S.site` was null after every dossier open and Chronicle travel at head (12/12), as at the SA02 galaxy-view paths. The world (surface) view branch of `openEvent` (`selectSite("yeddaw")`) was **not rendered** (software-GL surface bake has exceeded 180–900 s in earlier runs); `e35.site` is unchanged, so that path's target is unchanged.

| State (each viewport) | Result at head |
| --- | --- |
| Allowed: WoK + all 13 bucket-7 works; legacy #book=7; All | Roshar selected; dossier "In the Chronicle" e35 text = exact new string with unchanged "Yeddaw" place label; opened → `S.ev` e35, still Roshar, text wraps inside the viewport; Chronicle-track travel → Roshar, e35 open, new text + Yeddaw label; old copy absent throughout. |
| Withheld: WoK + Edgedancer; WoK + bucket 7 minus Edgedancer; legacy #book=6 | No e35 item; neither old nor new text anywhere on the page. |

**Independent browser execution:** 0 cases (builder evidence only). Selector tests are not rendered confirmation; the rendered probe above is.

## Screenshots (6, each < 500 KB; viewed 2)

- Dossier e35 opened: WoK + bucket 7 [1440×900](shots/sa03dw06-e35-dossier-wok-bucket7-1440x900.png) (viewed: new sentence over two lines in the right panel under "VII Edgedancer", YEDDAW label, other Roshar items unchanged), [390×844](shots/sa03dw06-e35-dossier-wok-bucket7-390x844.png) (viewed: wraps over two lines in the phone sheet, no overflow); All [1440×900](shots/sa03dw06-e35-dossier-All-1440x900.png), [390×844](shots/sa03dw06-e35-dossier-All-390x844.png).
- Chronicle travel, WoK + bucket 7: [1440×900](shots/sa03dw06-e35-chronicle-1440x900.png), [390×844](shots/sa03dw06-e35-chronicle-390x844.png).

## Holds and ledgers

Unchanged per handoff: yeddaw/azimir/valley sites and the Roshar parent; PR37-only e96, Lift codex and 8 nested landmarks (not imported); bucket-7/ancestor gates (0 new mappings); PR24/PR37 owners and scopes; SA01/SA02 closures; D09/D10. SA03: 1/1 finite correction implemented here (awaiting review), 0/17 full payloads newly approved, 0/33 full-work approvals; full SA03 remains deferred. Save/Load limitation preserved.

## Handoff

fixing/claude → implementation-review/chatgpt. ChatGPT: review SA03-DW06-PORT at 0d7637e8973187afa3e8c58552a197d48c315b03; next ledger unit after acceptance is SA04 / Oathbringer per the handoff.
