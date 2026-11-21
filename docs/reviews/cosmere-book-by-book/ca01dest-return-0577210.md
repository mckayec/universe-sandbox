# CA01-DESTINATION-01 return at PR48 0577210

Claude, 2026-11-21 UTC. Implements only [ca01-checkpoint2-2026-11-21.md](ca01-checkpoint2-2026-11-21.md) CA01-DESTINATION-01 (D1, D2). Not merged; no PR24/PR37 edit; no canon approval; no gate, registry, engine or reading.js change.

|                                           | SHA                                                                                        |
| ----------------------------------------- | ------------------------------------------------------------------------------------------ |
| PR48 `feature/cosmere-reading-state` head | 057721011d6b0ba676ab957540b044241681382d                                                   |
| actual parent (handoff head, unchanged)   | 0ad0c14957a840a69700e6d26df47102882a65d3                                                   |
| cosmere.js blob at head                   | 2b8b9ccbfdca6ce47e8fc627e3fce9c416fbec43 (parent ab5db8c8b53ee989391d6436d49afc8183bdccbf) |
| new test blob                             | 1fbf7466ce729775e3ab121b92c3bfd6fa769816                                                   |

The remote PR48 head was re-read before editing and still equalled the handoff's 0ad0c14 / pack blob ab5db8c; both targets occurred exactly once (lines 676 and 964). No reconciliation needed.

## Incremental diff (2 files)

- `public/atlas/packs/cosmere.js` +1/−2:
  - **D1** line 676, `worlds[canticle].eras[12].blurb`: `…helps the people of Beacon overthrow the Cinder King, then Skips on to UTol.` → `…overthrow the Cinder King.` Nothing else in the field changed.
  - **D2** line 964: the whole object `{id: "h-nomad", path: ["canticle", "komashi"], book: 11, …}` deleted. Not retargeted; no new node or link. Galaxy links 10 → 9; order of the rest kept.
- `tests/atlas-ca01-destination.test.ts` (new, 2 tests).

No other references to `h-nomad` exist in app code, tests, registry or PACK_FORMAT (grep over the repo outside docs/; the only docs mentions are historical lore-corrections notes). No dangling reference.

## Per-operation receipt

| Op  | Target unique at parent | Applied                                                       | Reversal check                                                                                                                                 |
| --- | ----------------------- | ------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| D1  | yes (1/1)               | clause removed; `UTol` absent from the era blurb              | source with only D1/D2 reversed is byte-identical to the actual parent file (checked against `git show 0ad0c14:public/atlas/packs/cosmere.js`) |
| D2  | yes (1/1, index 3)      | object removed; `h-scad-can` and `h-nomad2` deep-equal parent | parsed head with the era string restored and the original link reinserted at index 3 deep-equals the parsed parent (whole pack)                |

## Evidence (builder execution, this run)

| Check                                                                         | Result                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| ----------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Focused test, head                                                            | **passed** 2/2. Payload: only the two removals; link ids = parent minus h-nomad in order; Canticle-touching links 3 → 2; no Canticle–Komashi route; whole parsed-pack reversal equals parent. Visibility with the actual engine selectors (rdWorldHidden, eraBlurb, eraVal, evOk/eText, siteSeen/sDesc cut from engine.js) in 13 reading states: world, facts, status, sites and all event entries equal to the parent; blurb equal except the removed clause; clause returned in 0/13. |
| Parent exposure of the removed clause (asserted)                              | **3/13**: All, legacy12, all works (eras[12] in effect). legacy11 and bucket11 show the base blurb; legacy10, legacy1, none, first work, Sunlit only, bucket11 minus Sunlit, all works minus Sunlit, all works minus bucket11 hide Canticle or the era text (existing whole-bucket fallback, unchanged).                                                                                                                                                                                |
| Focused test against actual parent pack                                       | **fails** at "D1 new ending occurs once" (expected)                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| `pnpm format`, `pnpm check`                                                   | **passed**, 669/669 tests, check:dist 115 files OK                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| `pnpm test:pages`                                                             | **passed**, 12 pages x 2 viewports                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| `pnpm test:browser`                                                           | **passed** this run (desktop construction, persistence, controls, mobile layout). The known Save/Load wait limitation did not trigger; not claimed as fixed.                                                                                                                                                                                                                                                                                                                            |
| Rendered [ca01dest-probe.mjs](ca01dest-probe.mjs) (blob a073a7a5…)            | head **90/90**, exit 0 ([log](ca01dest-rendered-output-0577210.txt), blob a5031df6…); actual parent pack **42/90**, exit 1, the 48 expected failures only: h-nomad link object present and Canticle–Komashi route present in 18/18 state×viewport runs (36), and the removed clause on the page / era blurb ≠ new text in the 3 era-12 states × 2 viewports (12) ([log](ca01dest-rendered-negative-0ad0c14.txt), blob 0899ee97…)                                                        |
| Visible-link comparison ([json](ca01dest-visible-links.json), blob d4cac5c4…) | head visible link ids = parent visible ids minus h-nomad in **18/18** runs. Parent showed h-nomad in All, legacy12, all works, legacy11, bucket11 (both viewports); Sunlit only / bucket11 minus Sunlit / all works minus Sunlit / legacy10 did not. h-scad-can and h-nomad2 visibility unchanged everywhere.                                                                                                                                                                           |

Rendered probe scope: `pnpm build` at 0577210 (dist pack `cmp`-equal to source), `vite preview` 127.0.0.1:4173, route `/atlas/index.html?pack=cosmere` + hash. Node v22.23.5, Playwright Chromium, `--use-gl=swiftshader`, `VERBOSE=1`. Viewports 1440x900 and 390x844 (touch; phone sheet expanded with a real tap on `#grab` when collapsed). Nine states per viewport: All, legacy12, all works (era 12); legacy11, bucket11 (base blurb); legacy10, Sunlit only, bucket11 minus Sunlit, all works minus Sunlit (denied). Link checks read `__atlas.LINKS` (built line objects and their `userData.route`) before selecting Canticle; Canticle then selected programmatically. Parent run: same build with only `dist/atlas/packs/cosmere.js` swapped for the 0ad0c14 file, restored and checked with `cmp`.

Screenshots (All, both viewed): [desktop](shots/ca01dest-head-All-1440x900.jpg), [phone](shots/ca01dest-head-All-390x844.jpg). The shortened era blurb wraps cleanly in the dossier; nothing obscured. No 4K capture (text/route removal only).

## Limits retained

- Not certified by this unit: the rest of the era-12 blurb, identity/backstory codex, h-scad-can, h-nomad2 and every other link, Canticle geometry, sunlight-height wording, Auxiliary/Dawnshard, ending (SP03–SP07, SP11, SP12 remainder). Leaving them unchanged is not endorsement.
- Sunlit-only whole-bucket fallback, search/graph/modal surface-route limitations unchanged. The rendered probe does not inspect the galaxy canvas pixels, only the engine's built link objects and their visibility flags.
- PR24/PR37 untouched (PR37 still has the UTol clause; PR24/37 never had h-nomad).

fixing/claude → implementation-review/chatgpt.
