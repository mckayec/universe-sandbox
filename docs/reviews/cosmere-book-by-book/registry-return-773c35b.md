# R-A registry + R-B e6/e12 return (PR48 773c35b)

Claude, 2026-11-10 UTC. Implements [R-A](bibliography-handoff-2026-11-10.md) and the two narrow [R-B](key2-handoff-2026-11-10.md) candidates on draft PR #48 `feature/cosmere-reading-state`.

**Exact head: `773c35bcaeb727927c9ab6a462a52ab1e9d0e538`**, parents `deb3a5e` (merge of main 9f99f62, docs-only) ← `f746229`. Main had 0 non-doc changes since the PR base, so the pack edited is the one on main (blob 0ca2f3e before this change). PR24/PR37 content was not imported.

## Changed files (application, vs f746229)

| File | Change |
|---|---|
| `public/atlas/packs/cosmere.js` | `spoilers.works` 33 rows (id, title, `y` where supported, `bucket`), `spoilers.presets` 3 frozen v1 presets, copied from [bibliography-2026-11-10.json](bibliography-2026-11-10.json). SEL02 and TA04 have no `y`; FD01 has `y: 2026, yNote: "catalogue listing"`. e6 and e12: exact candidate title/text + record `gate` from R-B. |
| `public/atlas/reading.js` | Registry keeps `y` only as a positive integer and an optional `yNote` (string, only with a year); invalid values are registry errors. New `yearLabel()`. Years never gate anything. |
| `public/atlas/reading-ui.js` | Checklist shows the year label after each title: `(2005)`, `(2026, catalogue listing)`, `(publication year unverified)`. |
| `public/atlas/engine.css` | `.rd-y` style for that label. |
| `tests/atlas-cosmere-registry.test.ts` | New: 8 tests against the REAL pack (below). |
| `docs/reviews/cosmere-book-by-book/real-registry-probe.mjs` | New rendered probe (also on main). |

Works are listed in bucket order (ledger order within a bucket) so the checklist groups read 1→12. Bucket counts 1:1, 2:3, 3:1, 4:1, 5:1, 6:3, 7:13, 8:2, 9:1, 10:1, 11:3, 12:3 = 33.

## Mapping count (R-B)

| Unit | Applied | Held (unreviewed bucket fallback) |
|---|---:|---:|
| Events (main pack has e6–e12, 7 key-2 events) | 2 (e6, e12: copy narrowed + own `gate`) | 5 (e7 "survivor of Hathsin" kept as a separate hold, never aliased to e74; e8–e11) |
| Worlds (scadsun, scadrial) | 0 | 2 (all 15 field units) |
| Sites (17) | 0 | 17 |
| Landmarks | 0 (none on main; PR37-only) | — |
| Codex (6 on main) | 0 | 6, incl. later `more` lines on their numeric fallback |

Ancestors unchanged: `scadrial` and `luthadel` have no `gate`, so e6 still needs MB01–03 through the parent fallback and e12 still needs MB01–03 through `scadrial`. e6/e12 `title`/`text` inherit the record gate (no extra field gates). **Visible change in All/legacy modes:** e6 now reads "Kelsier meets Vin — In Luthadel, Kelsier meets Vin and recognizes her as Mistborn." and e12 "Sazed ascends and remakes the world." (was "The crew — Kelsier gathers thieves…" and "Sazed takes up both Shards and remakes the world, ending the ash and the mists."). The e12 line will conflict textually with PR24's own e12 correction when both land; resolve to the narrow R-B copy.

Not claimed: 65/65 researched gates, a complete key-2 audit, earliest-spoiler certification, complete first-publication metadata or a publication-order preset. 0/33 full-work approvals.

## Checks

- `pnpm format`, `pnpm check`: format OK, build, **153/153 tests** (was 145; +8 real-registry), check:dist 115 files.
- Unit tests on the real pack (`tests/atlas-cosmere-registry.test.ts`): registry valid, 33/33 works, 12/12 buckets with the exact counts; row-for-row id/title/year/bucket match with the R-A JSON and identical presets; year labels (SEL02/TA04 unverified, FD01 catalogue listing; held works still required by bucket 7); every prefix of the 3 presets = exact strict prefix (14/14), MB09/FD01/Warbreaker/AU01/Isles in no preset, `choosePreset` refuses Secret History; AU01 and each White Sand unit tick only themselves; bucket fallback complete vs missing-one 24/24; all 33 works ⇒ every world, site and event visible (same as All); e6/e12 own gate passes with MB01 / MB03 alone but the chain with the unreviewed parents fails until MB01–03, including the MB01 preset prefix; e7 stays on fallback.
- Rendered ([real-registry-probe.mjs](real-registry-probe.mjs), vite preview of 773c35b, Chromium + SwiftShader, 1440×900 and 390×844 touch): **84/84 pass**. Per viewport: Reading button present; 33 checkboxes in 12 groups; presets with 3/4/7 options; the four year labels; MB01 prefix hides e6 in the chronicle and Scadrial in the index; MB03 prefix shows e6/e12/e7 and Scadrial, does not tick Secret History; a deliberate preset choice survives reload (a link alone does not overwrite stored state, by design); AU01 link ticks only AU01 and adding the omnibus adds only itself; all-33 link renders the chronicle and index text identically to All; 4 invalid links (Secret History in the trilogy preset, unknown preset version, Warbreaker in Stormlight, repeated White Sand id) open the safe state with the panel open; 0 console errors.
- Screenshots: [panel 1440](shots/real-registry-panel-1440x900.png), [panel 390](shots/real-registry-panel-390x844.png), [MB01–03 at 390](shots/real-registry-mb03-390x844.png).
- Not run: parent negative control of the new probe, 3840×2160, `test:browser` (pre-existing Save/Load wait), surface-bake cases 5a–5d (unchanged code path), physical devices.

Earlier CBR-01..03 closures: reading.js/engine.js logic unchanged apart from the year metadata; prior unit tests all still pass.

## Next

implementation-review/chatgpt on 773c35b. After that review: the Scadrial + Luthadel parent-first research unit (ChatGPT), per the R-B continuation. Release still needs Mckay.
