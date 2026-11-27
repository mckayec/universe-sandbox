# COS-BB-001 — CBR-01..03 fix checkpoint (not yet handed back)

Claude, 2026-11-10T07:26Z. Draft PR #48, `feature/cosmere-reading-state`, head **3250d094233a37e6c6697e4487d9dcf27b76cd79** (parent 1e588f0). Changed files: `public/atlas/reading.js`, `public/atlas/reading-ui.js`, `public/atlas/engine.js`, `tests/atlas-reading.test.ts`, `tests/atlas-reading-ui.test.ts`, new `tests/atlas-reading-engine.test.ts`.

Owner stays **claude**: code fixes and unit/vm regressions are done; the rendered coverage below is unfinished, so this is a checkpoint, not a return.

## Dispositions

| ID | Disposition | What changed |
|---|---|---|
| CBR-01 | Fixed (unit + vm evidence; rendered pending) | New reading state `{mode:'none'}` = the reader's deliberate empty selection. Valid, persisted (`{"mode":"none"}` in v2 storage) and written as `#read=_none` — a reserved token that can never be a work ID (IDs must start with a letter or digit). `toggleWork` returns it on the last untick (from URL, stored set or preset). The fail-closed `safe` state is unchanged: `#read=`, `#read=_none,fx-a1`, `#read=_NONE`, repeated/conflicting params, `{mode:'none',ids:[…]}` in storage and work links without a registry all stay safe and write nothing. Back/Forward: `rdFixURL()` on popstate rewrites only the reading parameters of the entry reached to the current state (the in-memory state is never changed by history), so an older entry carrying an unticked work cannot be reloaded or shared. The safe state now re-emits only the parameters rejected at start-up (`RD_REJ`), not whatever entry Back/Forward lands on. |
| CBR-02 | Fixed (unit/vm evidence; rendered pending) | `eraFieldOk(o,k,field)`: an era override is shown only when world chain + era record gate + the WORLD's field gate (ancestor restriction) + the era's own field gate (`eras[k].gates[field]`) all pass; a hidden override is skipped so the earlier visible value stays. Applied to every era selector: `eraVal` (short, facts, …), `eraBlurb`, `statusFor` (base status now also honours `gates.status`), `gfxFor` (era gfx previously used only the bucket and ignored an era's own gate) and `GROUP_NAME` (group eras: bucket + field gates). Legacy/All keep the numeric rule (vm test). PACK_FORMAT documentation of this rule is still owed (see below). |
| CBR-03 | Fixed (vm evidence with fake transition/loader; rendered pending) | `descend()` takes a ticket `{id, w, RGEN, descent number}`. The fade commit and the deferred `loadEarth().then(go)` both call `descendLive`: a newer descent supersedes; a changed selection cancels; a changed RGEN forces a re-check of selection and visibility under the new state. A stale ticket never sets the world view or calls buildPlanet; it hides its own bake bar, neutralises its own pushed surface history entry, drops a now-hidden selection, and (if it had already entered an empty surface) ascends. |

## Evidence at 3250d094233a37e6c6697e4487d9dcf27b76cd79

- `pnpm check` (format, build, tests, check:dist): exit 0, **143/143** tests (includes the 7 new vm regressions and the new CBR-01 unit test).
- `node --test tests/atlas-reading*.test.ts`: reading 13/13, UI 6/6, engine 7/7. The engine tests cut the ACTUAL functions out of engine.js (same technique as reviewer-reading-1e588f0.mjs) with inverted expectations: CBR-01 last untick from `#read=a` and `#upto=` → `read=_none` + stored none, reload from URL and storage → none; safe re-emits only start-up rejects; popstate rewrite. CBR-02 reviewer case + absent/invalid/public/needs-unmet/needs-met + world-field-hidden + era-record-hidden + earlier-era-kept + status base gate, for blurb/short/status/gfx; legacy unchanged. CBR-03 unchanged control builds; narrowed+RGEN; hidden with stale selection; another world selected; RGEN changed but still visible (builds); newer descent supersedes; deferred Earth load narrowed (no build, ascends, bake hidden) and its control.
- `pnpm test:pages`: 12 pages × 2 viewports pass.
- `pnpm test:browser`: fails at the known pre-existing Save/Load wait on the main sandbox page (browser-smoke.mjs:88, not an atlas path); also failed twice on retry in this container. Not counted as a pass.
- The reviewer's `reviewer-reading-1e588f0.mjs` no longer runs as-is at this head: its era adapter lacks `fGate`/`bucketGate`, which the fixed selectors now call. Equivalent cases are in `tests/atlas-reading-engine.test.ts`.

## Where I stopped (next run starts here)

1. Rendered coverage: [cbr-fix-probe.mjs](cbr-fix-probe.mjs) (CBR-01 last untick from URL / stored set / preset via the real panel → Forward/Back, reload, shared link, plus 4 negative links; CBR-02 8 dossier cases incl. parent-hidden; CBR-03 4 pending-descent cases incl. control) at 1440x900 and 390x844. A manual single-case run confirmed the CBR-01 history path in Chromium (Forward entry rewritten to `#read=_none`, Back keeps none). The full probe exceeded the 10-minute command limit under SwiftShader; next run: split it per finding/viewport and record raw output. Not counted.
2. Pending 5a/5c/5d from the checkpoint-4 UI probe with a lighter test-only surface (pending world construction tested separately from pending site selection).
3. Recheck the other required exposure surfaces after these corrections.
4. PACK_FORMAT: document the 'none' state/`#read=_none` and the era-field gate rule for mapping authors.

No merge, deploy, canon or release approval. D08 scope only.
