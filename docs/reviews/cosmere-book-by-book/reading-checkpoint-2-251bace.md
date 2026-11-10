# COS-BB-001 — checkpoint 2: engine wiring (Claude, 2026-11-10T00:05Z)

Draft PR #48, branch `feature/cosmere-reading-state`, head **251bace3caa4ff92cf1838423dc97bb34a5b6cea** (parent bd16aee, base main ab34afe). Not merged, no release requested. Continues [implementation-handoff-2026-11-09.md](implementation-handoff-2026-11-09.md) (D08 option c).

## What changed

- `public/atlas/index.html` loads `reading.js` before `engine.js`.
- `public/atlas/engine.js`: a per-work reading block (`RREG`, `S.rd`, `setRd`, `PW()`, `gateOf`, `reach`, `pvis`, `RGEN`). It is **dormant** unless a cumulative pack declares a validated `spoilers.works` registry; no production pack has one, so the public site is unchanged. With a registry, `legacy` (`#book=N`) and All keep the numeric rules; `preset`/`set`/`safe` route these surfaces through `AtlasReading.visible()`:

| Surface | Per-work rule |
|---|---|
| world list, markers, "N more worlds" note (`seen`) | world gate or whole-bucket fallback of `firstOf(w)` |
| sites (`siteSeen`, `siteEraOk`) | world ∧ site gate (bucket = min `books`), `since`/`until` by bucket reached |
| events: dossier list, chronicle columns (`evFor`, `renderChron`) | world ∧ site ∧ event gate; a bucket column with no visible event and not fully read is locked |
| codex entries + `more` lines, hidden-count note | entry gate; `more` = entry ∧ bucket of `m[0]` |
| eras: `eraVal`, `eraBlurb`, `statusFor`, group names, planet `gfxFor` | era key k applies only when every work of bucket k is read |
| book badges (`bks`), realms (`realmOpen`, realm FX), legend items | bucket reached |
| scene labels/glows/territories (`gateOk`), links (`applyBookToScene`) | bucket reached (`books` → any listed bucket reached) |
| family-tree nodes | node `gate`, else first/min bucket reached |
| shield, codex note, announcement, empty text | `AtlasReading.describe()` label |

- State: with a registry, `initialState(hash, v2, v1)` runs **before the first `refreshAll()`** (no All flash). Hash writes use `hashParams`; the safe state keeps the rejected reading parameters in the URL and writes no storage; v2 storage `atlas-read:v2:<pack>` is written on refresh (a link alone is not stored until an interaction, same as legacy `#book`). Choosing a book in the existing bar leaves per-work mode explicitly (`legacy`/`all`).

## Evidence

[`reading-engine-probe.mjs`](reading-engine-probe.mjs) (Playwright, Chromium 1243, swiftshader, 1440×900), run against the dev server with the baseline engine (main = bd16aee engine, identical) served via route interception:

- **Family 1 legacy parity (rendered): passed.** For `#book=0..12` on the real Cosmere pack, identical rendered text between baseline and new engine for world list, chronicle, legend, realm bar, every codex tab (+note) and all **60** world dossiers: 13 keys × 6 surfaces = 78/78, 0 page errors.
- **Per-work smoke with an in-memory SYNTHETIC registry** (fx-* IDs injected by the probe; never written to the pack, not research): `{fx-1}` equals legacy book 1 on chronicle (lock wording normalised), realms, legend entry count and 60/60 dossiers (reading-state wording stripped); `{fx-2a}` alone shows 0 events (key 1 unread, key 2 incomplete → whole-bucket fallback); complete key 1+2 set equals legacy book 2 count; preset through fx-3 lies strictly between book 2 and All; conflict `book+read`, unknown ID, repeated `book`, unknown preset version → safe state, 0 gated events/worlds rendered, no storage written, rejected parameter kept; stored v2 valid → restored, unknown ID / unparseable → safe; choosing All in the bar → mode all, `read=` removed, v2 `{"mode":"all"}` stored. Total probe **128/128**.
- `pnpm format`, `pnpm check`: passed (129/129 unit, check:dist 114). `pnpm test:pages`: passed 12×2.
- `pnpm test:browser`: **failed at browser-smoke.mjs:88** (simulator Save/Load `#count` wait). The baseline without this change fails at the same line in this environment (pre-existing Save/Load race already listed in D03–D06 Known gaps); atlas not involved.

## Not done yet (next bounded unit, owner stays Claude)

1. Preset selector + per-work checklist UI in the bar, the safe-state picker opened by default, deliberate preset/custom/legacy transitions, keyboard/repeated taps, 390×844 rendering.
2. Field-level gates (`gates.name/desc/era/...`) on rendered fields and the intro text; unreviewed-bucket notice line.
3. Family 7: RGEN-based cancellation inside delayed place/tour/effect callbacks (counter exists, not yet checked in callbacks) and dossier/search rerender on narrowing.
4. Family 8: Back/Forward and deep links to now-hidden places restoring a visible parent under per-work modes.
5. Families 2/4/5 on real mappings wait for ChatGPT's key-2 mapping packet against this interface.

Known gaps: tree nodes and legend items without any book key stay visible in per-work modes (same as legacy; they carry no book gate); the per-book colour legend shows the all-books label in per-work modes; galaxy label DOM visibility is covered by the predicate change but not separately captured in the probe.
