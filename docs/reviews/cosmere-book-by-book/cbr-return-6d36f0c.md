# COS-BB-001 — CBR-01..03 return (rendered coverage complete)

Claude, 2026-11-10T09:14Z. Draft PR #48, `feature/cosmere-reading-state`, head **6d36f0c4afc2c2c2c9f7cbf860226112338eb235**.

- Parent 3250d094233a37e6c6697e4487d9dcf27b76cd79 (the CBR fix commit, see [cbr-fix-checkpoint-3250d09.md](cbr-fix-checkpoint-3250d09.md)). The only change 3250d09 → 6d36f0c is `docs/atlas/PACK_FORMAT.md` (+27 lines). Application code (`public/`, `src/`, `tests/`) is byte-identical, so the rendered runs below (served from a 3250d09 build) apply to 6d36f0c.
- Changed files vs 1e588f0 (the reviewed head): `public/atlas/reading.js`, `public/atlas/reading-ui.js`, `public/atlas/engine.js`, `tests/atlas-reading.test.ts`, `tests/atlas-reading-ui.test.ts`, new `tests/atlas-reading-engine.test.ts`, `docs/atlas/PACK_FORMAT.md`.

## Dispositions

| ID | Disposition | Evidence |
|---|---|---|
| CBR-01 (last untick restores prior set) | **Fixed** — `{mode:'none'}` / `#read=_none`; popstate rewrites the reached entry's reading params | unit + vm (checkpoint); rendered **62/62**: last untick via the real panel from URL, stored set and preset → none; URL `#read=_none` without `fx-1`; storage `{"mode":"none"}`; Forward to the old surface entry and Back keep none; reload → none; shared link in a fresh context → none; 4 negative links (`#read=`, `#read=zz9`, `#read=_none,fx-1`, `#read=_none&book=1`) → safe, nothing stored; 0 page errors. Both viewports. |
| CBR-02 (era fields bypass field gates) | **Fixed** — `eraFieldOk` on every era selector (short, facts, blurb, status, gfx, group names) | vm (checkpoint); rendered **32/32**: 8 dossier cases × 2 viewports (absent / needs unmet / needs met / invalid gate with all fixtures read / public / needs-narrowed / world field hidden + public era field / era record hidden + public era field) + 0 page errors each. Negative checks use `textContent` of the dossier and the whole body (catches DOM text that is collapsed or not painted). |
| CBR-03 (queued descent builds a hidden world) | **Fixed** — descent tickets re-checked at fade commit and at the deferred Earth load | vm (checkpoint); rendered **16/16**: unchanged control builds (view world, PL set); narrowed while pending → galaxy, no planet, bake bar hidden; hidden by unticking to none while pending → same; another world selected while pending → galaxy, selection kept on the other world, no planet; 0 page errors. Both viewports. |

## Pending 5a/5c/5d (from checkpoint 3) — done on a lighter test-only surface

[pending-surface-probe.mjs](pending-surface-probe.mjs) sets `window.__HD=256` before load (an existing engine hook, `engine.js:499`), so the queued HD planet bake is 256×128 instead of 4096×2048 under SwiftShader. Production code is unchanged; the 512 preview bake still runs. **28/28** (14 per viewport):

- 5a pending **site** selection (openEvent → descend + 900 ms site timer): dropped after a state change (double toggle; state identical afterwards), and the **control selects the site** when nothing changed. Pending **world construction** is tested separately (CBR-03 above).
- 5b hidden world deep link stays on the galaxy with the note; 5c hidden site on a visible world: world opens, site not selected; 5d narrowing on a late world's surface leaves it, and Forward does not reopen it.
- Probe correction found on the way, not an engine defect: the checkpoint-3 5a control picked event e6 at Luthadel. That site has an era end (`until`), so with every fixture read it is correctly hidden and `selectSite` refuses it (instrumented: `rdSiteHidden('luthadel') === true`, RGEN unchanged). The probe now picks an event whose site has no `until`/`since` (e13, Court of Gods); the first run with the old picker failed the control 1/14 per viewport and is recorded here, not counted.

## Other exposure surfaces rechecked at this code

- [reading-fields-probe.mjs](reading-fields-probe.mjs) (field gates on index, dossier, crumbs, chronicle, labels, tooltip, announcement, intro/legend; negative controls 1440 + 390): **59/59**.
- [reading-engine-probe.mjs](reading-engine-probe.mjs) vs the ab34afe engine (legacy parity #book=0..12 across six surface groups, per-work smoke, safe-state links): **128/128**.
- [reading-ui-probe.mjs](reading-ui-probe.mjs) sections 1–4 (no panel without registry, desktop flow, keyboard/Escape, phone panel bounds and touch targets): **42/42**. Section 5 is superseded by the pending-surface probe above.
- `pnpm check` at 6d36f0c: exit 0, **143/143** tests, check:dist 115 files. `pnpm test:pages`: 12 pages × 2 viewports pass.
- Not counted: `pnpm test:browser` (known pre-existing Save/Load wait on the main sandbox page, browser-smoke.mjs:88, not an atlas path; not re-run this time). No physical device or screen reader.

Raw per-case output for every run above: [cbr-rendered-output-6d36f0c.txt](cbr-rendered-output-6d36f0c.txt). Environment: headless Chromium (`/usr/bin/google-chrome`) with `--use-gl=swiftshader --enable-webgl --ignore-gpu-blocklist`, `vite preview` of a 3250d09 build, viewports 1440×900 and 390×844 (mobile + touch).

## PACK_FORMAT (owed note)

`docs/atlas/PACK_FORMAT.md` §6 now has a "Per-work reading state" block: registry (`works`, `buckets`, versioned `presets`), gate syntax (DNF `req`, `needs`, descriptive `in`, `public`), bucket fallback/unreviewed, field gates and ancestor intersection, the era-override rule (world chain + era record gate + world field gate + era field gate; hidden override skipped; a world-level field gate restricts all that field's era overrides), and the reading states including `none` / `#read=_none` and the safe state.

## Still outstanding (not in this return)

Real researched registry and mappings for the Cosmere pack (D08 option c continuation) — PR48 still ships no `spoilers.works` for Cosmere, so the live site behaviour is unchanged (legacy numeric rules). No merge, deploy, canon or release approval.
