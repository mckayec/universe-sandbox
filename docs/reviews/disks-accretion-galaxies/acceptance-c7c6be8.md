# PR #43 technical / rendered / mobile acceptance (Claude, 2026-11-06)

Exact head: `c7c6be8ce393bfdd63db3357665500385000bdd8` (`fix/dag-remediation`). GitHub reports the PR open, `mergeable: true`, `mergeable_state: clean` against current main.
Environment: cloud sandbox, Node v22.23.4, pnpm 10.28.0, `pnpm install --frozen-lockfile`, Chromium 1243 with SwiftShader (no GPU).

## Checks

| Check | Result |
| --- | --- |
| `pnpm check` (format, tsc + vite build, unit tests, check:dist) | Pass: 95/95 unit tests, check:dist 111 files |
| `pnpm test:pages` | Pass: 12 pages x 2 viewports |
| `pnpm test:exhibits` | Pass: 20/20 scenes (includes `slow-feast` and `galaxy-collision` assertions) |
| `pnpm test:browser` | **0/3 this run** (120 s, 130 s, ~130 s). Every failure is `tests/browser-smoke.mjs:88`, the Save → Clear all → Load count wait. Counted per [the shared disposition](../mobile-entry-usability/save-load-smoke-disposition.md): a known pre-existing test race, also failing on main; not a clean pass. Earlier runs at the same code (0a43a4f, 2026-10-30) passed on rerun. |
| Save/Load of this PR's infall records | Covered by earlier exact-code evidence (r2-load-fallback.mjs, 48 cases; manual Load of malformed saves on c7c6be8, 2026-10-30). Not repeated. |
| Rendered capture, both new exhibits, 3840x2160 / 1440x900 / 1280x800 / 390x844 (mobile+touch) | Loaded via `loadExhibit`, run at 8x, then paused and resumed. No console errors or page errors at any size; no horizontal overflow (scrollWidth = viewport width at all four). |

## What the screenshots show

- 3840x2160 and desktop sizes: both galaxies render with arms, dust lanes, bulge and member stars; Slow Feast disk and jet render; guide card, timeline and inspector do not cover the galaxies. At 4K the UI is small at device-pixel-ratio 1 (normal for a 4K screen at 100% OS scaling).
- 390x844: the guide card, toolbar and selected-object sheet cover most of the playfield in both exhibits; the objects are only partly visible until the guide is closed. This is the existing mobile layout, not something PR #43 changes; it belongs to the mobile-entry-usability review (PR #44).
- SwiftShader runs the 4K page at a few fps, so the simulation barely advanced during the capture window; dynamics (capture, stripping, tidal tails, merger) are evidenced by `test:exhibits`, not by these stills.

Shots (JPEG, under 500 KB each) in `shots/acc-c7c6be8-*.jpg`.

## Known gaps (do not block release, listed for Mckay)

| Gap | Impact | Blocks? |
| --- | --- | --- |
| No real-GPU / physical iPhone or iPad run | Frame rate and bloom/colour on real hardware unverified; budgets (22k compact stars) only checked in software GL | No; Mckay can spot-check after merge |
| `test:browser` Save/Load step races (0/3 here) | Smoke test cannot certify Save/Load; covered by targeted probes instead | No; follow-up test fix proposed in the shared disposition |
| Mobile guide card covers the exhibit | Visitors on phones see little of the scene until they close the guide | No for #43; tracked under PR #44 |

## Verdict

**Technical: approved** for PR #43 at `c7c6be8ce393bfdd63db3357665500385000bdd8`, with the Known gaps above. ChatGPT's R3 verdict was "Approved with changes" pending this acceptance and the owner gate; only Mckay's release yes remains.
