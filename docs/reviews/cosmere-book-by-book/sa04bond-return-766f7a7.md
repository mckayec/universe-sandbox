# SA04-BOND-01/02 return: e40 and Dalinar key-8 codex text at PR48 766f7a7

Claude, 2026-11-20T06:15Z.

- **PR:** PR48 `feature/cosmere-reading-state` (draft, not merged)
- **Exact head:** 766f7a75d6825b4de88bb3667fde49ab971cbca6 (remote `git ls-remote` read-back matches)
- **Actual parent:** 0d7637e8973187afa3e8c58552a197d48c315b03 (the head named in the handoff; branch had not moved; parent pack blob ae2a877eb9a667c332e0f5b96ea22c89b5c91f35 matched the handoff table)
- **Requested by:** [sa04-handoff-2026-11-20.md](sa04-handoff-2026-11-20.md)

No canon approval, new gate, new mapping, landmark, effect, coordinate, parent metadata, site change or reading-state promotion is claimed. PR24 (cf25cda) and PR37 (03394c3) not touched; PR37's e97–e108 and 28 nested landmarks not imported. Accepted e35/SA03 and e24/SA02 corrections preserved.

## Exact diff (2 files)

### `public/atlas/packs/cosmere.js` (ae2a877eb9a667c332e0f5b96ea22c89b5c91f35 → 583abc7a47935530b160c7c7be43f8257cff0cd2, +2/−2, lines 788 and 845)

```diff
-      {id: "e40", book: 8, world: "roshar", site: "thaylen", title: "The Battle of Thaylen Field", text: "Odium sends his champion. Dalinar refuses to give in, binds the realms together and becomes the Bondsmith."},
+      {id: "e40", book: 8, world: "roshar", site: "thaylen", title: "The Battle of Thaylen Field", text: "At the Battle of Thaylen Field, Dalinar brings the three Realms together."},
-        {name: "Dalinar Kholin", role: "The Blackthorn", books: [4, 5, 8, 9, 12], desc: "A warlord trying to become a better man.", more: [[8, "Becomes the Bondsmith."], [12, "Dies after renouncing Honor’s power."]]},
+        {name: "Dalinar Kholin", role: "The Blackthorn", books: [4, 5, 8, 9, 12], desc: "A warlord trying to become a better man.", more: [[8, "Brings the three Realms together at Thaylen City."], [12, "Dies after renouncing Honor’s power."]]},
```

Both replacements are the handoff's exact strings. e40 id, book 8, world, site thaylen, title, array position and absence of lm/effect unchanged; Dalinar's numeric key 8, entry position, key-12 line, desc, role, books and list position unchanged. "Odium sends his champion", "becomes the Bondsmith" and "Becomes the Bondsmith." no longer occur in the pack (the word "Bondsmith" now occurs 0 times in it).

### `tests/atlas-sa04-bond.test.ts` (new, a66e7641c725704b2721ec230c9f25d617f6e4c7, 2 tests; same harness as atlas-sa03-dw06)

- **Payload:** e40 deep-equals `{id, book:8, world:"roshar", site:"thaylen", title, text:new}`, no lm/effect; Dalinar `more` deep-equals `[[8, new], [12, unchanged]]`; parent controls have both old texts; event order equals the parent; **whole parsed pack with exactly those two fields masked deep-equals the parent**; old copy absent.
- **Visibility** (actual engine `evOk`, `EFF`, gate block, `cxMoreGate`/`cxFirst` cut from engine.js; codex entry and per-line predicates copied from renderCodex's list/more filters, legacy branch included): every Roshar event, the Dalinar entry and both his `more` lines equal the parent in the handoff's **11 enumerated states**, and e40 and the key-8 line match its table — shown in All, legacy #book=8, legacy #book=12, WoK + Oathbringer + Dawnshard; withheld in legacy #book=7, nothing read, Oathbringer only, Dawnshard only, WoK + Oathbringer, bucket 8 only, WoK + Dawnshard. Asserts bucket 8 = [oathbringer, dawnshard]. The restrictive shared-bucket behaviour is unchanged, not introduced or approved here.

## Checks (builder-run, Node v22.23.5)

- **Focused** (`atlas-sa04-bond` + `atlas-sa03-dw06` + `atlas-sa02-l23` + `atlas-sa01-geo` + `atlas-na01-geo` + `atlas-sel03-geo` + `atlas-sel03-e30` + `atlas-realms-gate`): **22/22** ([log](sa04bond-unit-head.txt)).
- **Unit negative control**, same files with the actual-parent pack 0d7637e in the working tree: **20 pass / 1 fail** ([log](sa04bond-unit-negative-0d7637e.txt)) — only `atlas-sa04-bond` fails, at its top-level "new e40 text occurs once" assertion (its two subtests do not run); all other focused files pass.
- **Repository:** `pnpm format` (no further changes), `pnpm check`: format OK, build OK, **650/650** unit tests, check:dist **115 files OK**.
- **`pnpm test:pages`:** passed, 12 pages × 2 viewports (CHROME_PATH = Chromium 1243).
- **`pnpm test:browser`:** **failed on three consecutive runs** at `tests/browser-smoke.mjs:88` (Save → Clear all → Load count wait, TimeoutError) — the known Save/Load limitation carried from earlier PR48 heads. The smoke test never renders e40 or the codex. Not claimed fixed or caused; remains open.
- **Rendered:** [sa04bond-probe.mjs](sa04bond-probe.mjs), production `dist` served statically under `/universe-sandbox/` (python http.server; `vite preview` does not serve `/atlas/index.html` at this path), headless Chromium 1243 + SwiftShader, 1440×900 and 390×844. Dossier item opened with a real click/tap; phone sheet expanded with a real tap; **codex opened with a real click (desktop) / real tap (phone) on #cxBtn and the People tab in all 12 state×viewport cases (0 dispatched)**; phone Chronicle opened with a real tap on its title, but the e40 track item sits under the collapsed sheet bar, so that one click is DOM-dispatched (same limitation as SA02/SA03 probes).
  - **Head 766f7a7: 156/156 pass, 0 page/console errors** ([log](sa04bond-rendered-head.txt), VERBOSE).
  - **Parent 0d7637e** (pack swapped into dist): **108 pass / 48 fail** ([log](sa04bond-rendered-negative-0d7637e.txt)); all 48 are new-text/old-copy checks (8 kinds × 3 allowed states × 2 viewports: event text, open text, travel text, three old-event-copy checks, new codex line, old codex line). Selection, place label, codex-open, withheld and error checks pass at both.
  - `S.site` was null after every dossier open and Chronicle travel (12/12), as in SA02/SA03. The world (surface) view branch of `openEvent` (`selectSite("thaylen")`) was **not rendered** (software-GL surface bake limitation carried); `e40.site` is unchanged.

| State (each viewport) | Result at head |
| --- | --- |
| Allowed: WoK + Oathbringer + Dawnshard; legacy #book=8; All | Roshar selected; dossier e40 text = exact new string with unchanged "Thaylen City" label; opened → `S.ev` e40, still Roshar, wraps inside the viewport; Chronicle travel → Roshar, e40 open; codex People → Dalinar entry contains the new key-8 line, inside the viewport; old event and codex copy absent throughout. |
| Withheld: WoK + Oathbringer; WoK + Dawnshard; legacy #book=7 | No e40 item; neither old nor new event text on the page; opened codex contains neither old nor new key-8 line. |

**Independent browser execution:** 0 cases (builder evidence only). The VM selector tests are not rendered confirmation; the rendered probe is.

## Screenshots (10, each < 500 KB; viewed 2)

- Dossier e40 opened: WoK+OB+DS [1440×900](shots/sa04bond-e40-dossier-wok-ob-ds-1440x900.png) (viewed: new sentence over two lines under "VIII The Battle of Thaylen Field", THAYLEN CITY label, other Roshar items unchanged), [390×844](shots/sa04bond-e40-dossier-wok-ob-ds-390x844.png); All [1440×900](shots/sa04bond-e40-dossier-All-1440x900.png), [390×844](shots/sa04bond-e40-dossier-All-390x844.png).
- Chronicle travel, WoK+OB+DS: [1440×900](shots/sa04bond-e40-chronicle-1440x900.png), [390×844](shots/sa04bond-e40-chronicle-390x844.png).
- Codex People: WoK+OB+DS [1440×900](shots/sa04bond-codex-wok-ob-ds-1440x900.png), [390×844](shots/sa04bond-codex-wok-ob-ds-390x844.png) (viewed: "A warlord trying to become a better man. Brings the three Realms together at Thaylen City." wraps cleanly in the phone codex, IV/VIII badges unchanged); All [1440×900](shots/sa04bond-codex-All-1440x900.png), [390×844](shots/sa04bond-codex-All-390x844.png).

## Holds and ledgers

Unchanged per handoff: all 31 logical-type holds (e37–e39, e41, e42/SA05, e97–e108, sites, Ashyn, parents, era 8), 28 nested PR37 landmark holds, shared bucket-8 gates (0 new mappings, no move to key 5), PR24/PR37 owners and scopes, SA01–SA03 closures, D09/D10. SA04: 2/2 finite corrections implemented here (awaiting review), 0/69 full payloads newly approved, 0/33 full-work approvals; full SA04 remains deferred. Save/Load and surface-render limitations preserved.

## Handoff

fixing/claude → implementation-review/chatgpt. ChatGPT: review SA04-BOND-01/02 at 766f7a75d6825b4de88bb3667fde49ab971cbca6; next ledger unit after acceptance is SA05 / Dawnshard per the handoff.
