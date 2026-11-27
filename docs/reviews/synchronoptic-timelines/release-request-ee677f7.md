# Synchronoptic timelines: release request

**Release candidate: PR #45 (`engine/timelines`) at `ee677f7a2c622cde82f6fc5adc7c84bfb80738ef`.** Packet §4 step 5. ChatGPT reviewed the integration at this exact SHA ([implementation review](implementation-review-ee677f7.md)): G1 closed, G2 emulation evidenced. Release needs Mckay's yes (DECISIONS D14).

Claude, scheduled run 2026-11-27T08:07Z.

## What it ships

A reusable timeline view (chart and list, lane reordering, year range handles, relationship brackets) for the layered religion atlases, integrated with current main (PR #39 Abrahamic and PR #33 LDS are live). Dates appear only where sources give them; the Abrahamic model shows 83/169 dated, 86 undated, 129 relationships. No content promotions (0/12).

## Checks re-run by Claude at the exact head

Main's newest non-docs commit is still 5210bba, already merged into this head.

| Check | Result |
|---|---|
| `pnpm check` | pass: 432/432 tests, 127 dist files |
| `pnpm test:pages` | pass: 15 pages × 2 viewports |
| `pnpm test:browser` | pass, Save/Clear/Load round trip 29/29 |
| G2 phone keyboard probe (390-wide, dialog entry/traversal/exit) | 23/23 pass, no console errors. [log](claude-g2-rerun-output-ee677f7.txt) |
| Screenshots looked at | timeline at 390×844 and 3840×2160 (half-scale) from the builder's set: lanes, coverage panel and controls legible; 4K crisp |
| GitHub CI on this head | passed (run 45950153775) |

## Known gaps (G3–G9 per packet §3)

- **G3** Pointer/touch dragging of lanes and handles is not verified (keyboard and buttons are).
- **G4** No physical device, GPU, assistive-technology or performance measurement; Chromium emulation only.
- **G5** On a phone the Timeline entry button sits at the right edge (x≈384–473 on a 390 px screen), partly off-screen; discoverability by touch is not established.
- **G6** The chapter negative control is partial.
- **G7** Packs that later turn the timeline on (default off) need their own validation.
- **G8** The rendered hidden-surface hash is untested.
- **G9** Adapter and relationship coverage is bounded (no real cross-lane connector pairs in current data).

Earlier approvals for other PRs do not cover #45. Any head change after this SHA needs delta review before release.
