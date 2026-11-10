# COS-BB-001 — checkpoint 3: Reading panel + families 7/8 guards (Claude, 2026-11-10T03:40Z)

Draft PR #48, branch `feature/cosmere-reading-state`, head **74ba805c8fd81c4021672c17d873c5270b07a972** (parents f669280 → 251bace). Not merged, no release requested. Continues [checkpoint 2](reading-checkpoint-2-251bace.md) and [implementation-handoff-2026-11-09.md](implementation-handoff-2026-11-09.md) (D08 option c).

Everything below is **dormant** unless a cumulative pack declares a validated `spoilers.works` registry. No production pack has one, so the public site is unchanged. All per-work evidence uses an in-memory **synthetic** registry (fixture IDs `fx-*`, injected by the probe, never written to a pack; not research).

## What changed

**f669280 — Reading panel (`public/atlas/reading-ui.js`, new; loaded before `engine.js`)**

- A **Reading** button next to the book bar opens a small dialog: one "Read through…" select per preset (latest version), and a **Books I've read** checklist grouped by numeric bucket (group title = the bucket's existing book title), in registry order.
- Transitions (handoff item 4): ticking a work never ticks any other work; a preset followed by a tick/untick becomes **Custom selection: N read** (never relabelled as a preset); unticking the last work is the safe state, not All; **Show all books** is a separate deliberate button; the existing book bar still chooses legacy `#book=N` and the panel then shows "(series grouping)" with no ticks; in per-work modes no book-bar button is pressed.
- The status line always lists the actual selected works ("Selected: …"); the unreviewed line ("Some details in this series are only grouped, not yet sorted by book.") shows only in per-work modes while a fallback (unreviewed) world or event is visible.
- Safe state: the panel opens at start, the button is marked; the first deliberate choice replaces the rejected parameter.
- Every choice goes through `applyRd()` (same path as the book bar): a now-hidden selected world is left (ascending from its surface), a now-hidden selected place is cleared, the open event closes, everything re-renders. Escape/× close and return focus; keyboard Space toggles with focus kept across re-render; 44 px controls; bottom sheet under 640 px.
- `tests/atlas-reading-ui.test.ts`: 6 view-model tests (preset prefix ticks, later-work tick → custom set, last untick → safe, All/legacy/safe tick nothing, bucket grouping, unreviewed only per-work).

**74ba805 — families 7/8 guards (engine.js; every guard is behind `RREG`, legacy-only packs keep their exact code paths)**

| Guard | Where |
|---|---|
| world not revealed at the current state is never opened; short note "That place is not revealed by the books you have marked as read." | `selectWorld`, `descend` |
| hidden place never selected | `selectSite` (`rdSiteHidden`) |
| delayed place selection dropped if the reading state changed while pending (RGEN) | `laterSite()` used by `goPlace`, `openEvent` (other-world surface), link restore |
| narrowing clears a now-hidden selected place | `applyRd` |
| deep link to a hidden world stays on the galaxy with the note | `restoreFromURL` |
| Back/Forward to a hidden surface stays on the galaxy and rewrites the URL | `descend(…, fromHistory)` |

## Evidence

[`reading-ui-probe.mjs`](reading-ui-probe.mjs) (Playwright, Chrome, swiftshader) against the dev server at the working tree equal to 74ba805:

- Sections 1–4 + 5b: **46/46 passed**, 0 page errors. Covers: no Reading button for the real pack without a registry; panel closed for a valid link, opens on click; `#read=fx-1` ticks only fx-1; ticking fx-3 ticks nothing else, URL `read=fx-1,fx-3`, custom label and selected list; unreviewed note shown; triple tap ends ticked; preset through fx-3 → `upto=pub:1:fx-3`, prefix ticked; selected bucket-1 world deselected and world list narrowed after unticking fx-1 from the preset; Space toggles with focus kept, Escape closes and returns focus; Show all → `{"mode":"all"}`, URL cleared, bar All pressed; book bar 3 → legacy shown in the panel; per-work → no bar button pressed; `#read=nope` → panel open, safe status, button warns, no v2 storage, a tick leaves safe and replaces the parameter; **390×844** (touch): panel inside the viewport, all controls ≥ 40 px, tap unticks into a custom set; hidden-world deep link (`#read=fx-1&world=ashyn&view=surface`) stays on the galaxy with the note.
- Screenshots (looked at): [1440×900](shots/reading-panel-1440.jpg), [390×844](shots/reading-panel-390.jpg).
- [`reading-engine-probe.mjs`](reading-engine-probe.mjs) (checkpoint 2 probe, now committed): family 1 legacy parity + per-work smoke **128/128** at f669280 (not re-run at 74ba805; that commit only adds guards behind `RREG`).
- `pnpm format`, `pnpm check`: passed at 74ba805 (135/135 unit, check:dist 115). `pnpm test:pages`: passed 12×2 at f669280.
- **Not run:** probe 5a (pending site selection dropped after a state change, with a no-change control), 5c (hidden place on a visible world) and 5d (Forward to a hidden surface). Each needs a planet surface; in this container's software GL the surface bake did not finish within 180 s, so these are written in the probe but have no result yet. `pnpm test:browser` not run this checkpoint (pre-existing Save/Load failure at browser-smoke.mjs:88, see checkpoint 2).

## Still open (owner stays Claude)

1. Field-level gates (`gates.name/desc/era/…`) applied to rendered fields and the intro text.
2. Rendered results for 5a/5c/5d (longer bake budget or a lighter world) and 1440/390 negative-control text for families 4/6/7.
3. Then return the exact head to ChatGPT for implementation-review. Families 2/4/5 on real mappings wait for ChatGPT's key-2 mapping packet against this interface.

Known gaps: `#rdPanel` uses `:has()` for the label layout (all current target browsers support it); the panel is a non-modal dialog (outside click closes it).
