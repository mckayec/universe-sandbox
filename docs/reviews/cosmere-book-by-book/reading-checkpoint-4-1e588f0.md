# COS-BB-001 — checkpoint 4: field-level gates + negative controls (Claude, 2026-11-10T05:25Z)

Draft PR #48, branch `feature/cosmere-reading-state`, head **1e588f0c5bdab5f8775f20481e07b57cb3b5c318** (parents c29580b0410216dfde1ccdc31175a485bde96079 → 74ba805). Not merged, no release requested. Continues [checkpoint 3](reading-checkpoint-3-74ba805.md) and [implementation-handoff-2026-11-09.md](implementation-handoff-2026-11-09.md) (D08 option c).

Everything is still **dormant** without a validated `spoilers.works` registry; no production pack has one, so the public site is unchanged. All per-work evidence uses an in-memory **synthetic** registry and **synthetic** field gates (fixture IDs `fx-*`, injected by the probe, never written to a pack; not research).

## What changed (engine.js only)

**c29580b — field-level gates (design §1/§2a), per-work modes only; legacy/All return the plain value**

- A record may carry `gates:{field:gate}`, where `field` is the pack property. Absent → the field inherits the record and ancestor chain; present but invalid → only that field is hidden (never rescued by the record gate); a record with no valid gate/fallback hides every field (unchanged).
- Names (`name` on worlds/places, `title` on events, `name` on codex entries): a hidden name shows a neutral placeholder — "An unrevealed world / place / event / entry" — in the index, dossier heading and grab bar, crumbs, chronicle (title and world column), galaxy labels (relabelled on every refresh), site labels, tooltip and the screen-reader announcement. `siteName()` also uses the place placeholder for an event's hidden place.
- Other fields are omitted when hidden: place `desc`, event `text`, world `aka`, `blurb`, `facts`, `star`, `short`; codex `role`, `desc`.
- Child records: a world era (`eras[k]`) and a codex `more[i]` line use their own gate (`eras[k].gate`, `gates.more[i]`) when present, else their numeric bucket, ANDed with the parent chain. An own gate replaces the bucket fallback (the probe shows era 7 opening at fx-5 and not at fx-7).
- Intro copy has no record above it, so in per-work modes `intro.text` and `intro.legend` show only with an explicit `intro.gates.text` / `intro.gates.legend` (fail closed). The current Cosmere intro names Adonalsium and its legend names later worlds; whether to publish neutral wording or gate them is a content decision for the mapping packet.
- Search index: the atlas engine has no search surface, so nothing to gate (recorded for the surface inventory).

**1e588f0 — two leaks found by the negative controls**

- The pack's dossier "Go to Roshar" button (`ui.go`) named a later world at the first book. In per-work modes it now shows only when its world is revealed. Legacy keeps its exact behaviour (it still shows at `#book=1`; recorded as an observation, not changed, to preserve family-1 parity).
- Region labels ("Rosharan system", "Taldain system", "Threnody's subastral") were faded to opacity 0 but stayed in the page text and accessibility tree. Faded region labels are now also `visibility:hidden` (all modes; visually unchanged).

## Evidence (dev server, working tree equal to 1e588f0)

- [`reading-fields-probe.mjs`](reading-fields-probe.mjs) (Playwright, Chrome, swiftshader): **59/59 passed**, 0 page errors. Covers legacy and All parity with the same synthetic gates present (labels, intro text and legend, Go to Roshar, Sel blurb, codex desc); at `#read=fx-1`: invalid-name and unread-name placeholders on labels, index, dossier and crumbs, invalid blurb hidden, absent aka gate inherited, star field hidden, era facts hidden, codex name inherited / desc and more line hidden, intro and legend hidden without `intro.gates`; widening to fx-3 opens only the fx-3 fields while the invalid gates stay closed; era own gate at fx-1+fx-5 (shown), fx-1+fx-7 (hidden), fx-5 alone (world hidden); public intro marker shows the text while a gated legend stays hidden.
- **Negative controls at 1440×900 and 390×844** (no synthetic field gates), `#read=fx-1` and `#read=fx-1,fx-2a` (bucket 2 partly read, the first-Mistborn-only analogue): page text plus opened codex contain no "Harmony", no ungated intro and no later world names (Roshar, Scadrial, Nalthis, Taldain, Threnody; case-insensitive). Screenshots (looked at): [1440×900](shots/reading-negative-1440.jpg), [390×844](shots/reading-negative-390.jpg).
- [`reading-engine-probe.mjs`](reading-engine-probe.mjs) against baseline engine ab34afe: **128/128** (family 1 legacy parity + per-work smoke).
- `pnpm format`, `pnpm check`: passed (135/135 unit, check:dist 115 files). `pnpm test:pages`: passed 12×2.

## Not run

- **5a/5c/5d** (pending place selection dropped after a state change with a no-change control; hidden place on a visible world; Forward to a hidden surface). Re-attempted this run with a 900 s bake budget: the planet surface bake did not finish under software GL (`settle` timed out at 5a). These need a GPU browser or a probe-only lighter surface; the guards themselves are unchanged since 74ba805.
- `pnpm test:browser`: not run (pre-existing Save/Load failure at browser-smoke.mjs:88, see checkpoint 2).

## Known gaps

| Gap | Impact | Blocks review? |
|---|---|---|
| 5a/5c/5d rendered results missing (software GL bake) | families 7/8 surface cases evidenced by code path only | No — ChatGPT can review; a GPU run or probe stub is a finite follow-up |
| Free-text cross-references inside fields (e.g. Sel facts "2nd from Mashe") follow the field's own gate, not the named record's | a gated name can still appear inside another field's prose | No — content rule for the mapping packet (gate the field or reword) |
| PACK_FORMAT.md does not yet document `spoilers.works`, `gates`, field gates or `intro.gates` | pack authors rely on the design proposal | No — add with the first real mapping return |
| Legacy `#book=1` still shows the pack's "Go to Roshar" button | pre-existing legacy leak | No — parity rule; Mckay/ChatGPT may file it separately |
| 390×844: the "Drag … world" hint sits behind the realm bar | pre-existing layout | No |
