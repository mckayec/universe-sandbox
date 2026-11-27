# Elantris — implementation checkpoint (partial) at PR37 004c3c9

Claude, 2026-11-07T16:15Z. Responds to handoff-elantris-2026-11-07.md. **Checkpoint, not the full return**: the seven correction units and the finite conservative options below are applied; the remaining hold dispositions and the COS-BB-001 design proposal are next run's work (owner stays claude).

Branch PR37 `atlas/deep-worlds`: Elantris commits **5cb521df1b78d8e38efede6abda685b3297556df** (seven units + two landmark narrowings) and **004c3c9c13b514235cc3fc3dd4b971d31c4948ef** (EL08-A, EL08-C, e67), on top of fb79488 (DWH-01 engine fix, deep-worlds review). Only `public/atlas/packs/cosmere.js` changed (+11/−11 vs fb79488).

## Changed-field crosswalk (all in public/atlas/packs/cosmere.js)

| Unit | Field | Change |
|---|---|---|
| EL01 | sel.sites.elantris.desc | Deleted "Its streets trace Aon Ela." — result matches handoff text exactly |
| EL02 | sel.sites.widor.desc | "…sends gyorns like Hrathen east." → "…sends Hrathen west to Arelon." |
| EL03 | e4 | text → handoff text; `site:"chasm"` and `lm:"crack"` removed; id/title/world/book kept |
| EL04 | e5 | text → handoff text; `lm:"gate"` removed; `site:"elantris"` kept |
| EL05 | e2 | text → handoff text; `lm:"palace"` removed; `site:"kae"` kept |
| EL10 | events array | e5 moved to sit immediately before e67; no other order change |
| EL11 | sel.sites.kae.scene.landmarks[palace].desc | → "King Iadon’s palace in Kae. Sarene meets him here after arriving from Teod." |
| EL06 / EL07 | e1, e3 | Retained unchanged (e1 keeps lm:gate as confinement) |
| Landmark gate | sel.sites.elantris.scene.landmarks[gate].desc | Conservative replacement: "Those taken by the Shaod are confined within Elantris; Raoden enters through this gate." |
| Landmark crack | sel.sites.chasm.scene.landmarks[crack].desc | Conservative replacement: "The Chasm is the feature whose missing line Raoden adds to his Aons." |
| EL08-A | sel.status | → "World of Elantris" (applies at every book; book-1 `facts` row "Order: 2nd from Mashe" not yet touched — flagged for next run) |
| EL08-C | sel.sites.pool | name → "The Pool"; removed "It opens into Sel’s Cognitive Realm." Remaining physical description is unaudited |
| e67 | e67 | Conservative replacement "Hrathen confronts Dilaf."; `site`, `lm:"streets"`, `fx:"battle"` removed; placed after e5 |

EL09: the fan notice already shown in credits/About of every pack (engine.js `fanNotice`) ends "Maps and positions are schematic reconstructions."; no new copy added yet. Next run: decide whether ChatGPT's exact sentence should also appear in the Sel dossier, and record the map edition (not yet identified — no citation invented).

## Validation at 004c3c9

- `elantris-order-probe.cjs`: chronicle, tour and dossier all `e1,e2,e3,e64,e65,e4,e66,e5,e67` — **restorationBeforeConfrontation true in 3/3** (was false at d902c8a).
- `pnpm check` 125/125, build ok; `pnpm test:pages` 12×2 pass; Deep Worlds probes still pass (history 3/3, transition 11/11, dwr 22/22).
- Browser (Chromium swiftshader, vite preview at 5cb521d, `?pack=cosmere#book=1&world=sel`): at 1440×900 the visible text order is e2 < e4 < e5 < e67, "trace Aon Ela" absent, 0 page errors. At 390×844 the event list is collapsed by default, so order was not visible there (no errors).

## Not done yet (next run, owner claude)

1. EL08-B (Sel cognitive realm override), EL08-D/E (Shards codex entries) — need an engine look at how realm overrides and codex `first`/`books` are scoped before choosing omit vs gate.
2. e64, e65, e66: source-or-omit dispositions (current plan: omit for the bounded scope unless ChatGPT prefers holding the records hidden).
3. Eight unresolved landmarks (newelantris, barrows, kiin, roial, market, pool/pool, harbour, streets): source-or-omit dispositions.
4. book-1 `facts` "Order: 2nd from Mashe" (same cosmology class as EL08-A).
5. COS-BB-001 per-work gating design proposal (separate doc).
6. PR24 propagation: PR24 (`fix/lore-corrections`, a4a6ea0) still has EL01–04 and is awaiting Mckay's D07. Not changed here, to avoid invalidating the approved head. Proposal: if PR24 merges first, PR37's cosmere.js (which carries these fixes) wins on the next main merge into PR37; if Mckay prefers PR24 itself to carry EL01–04, that needs a new PR24 head and re-review.
