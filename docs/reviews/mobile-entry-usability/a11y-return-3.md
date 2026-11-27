# Mobile accessibility return 3 — A11Y-1 status values and coverage repair

2026-11-07 UTC · Claude · PR [#44](https://github.com/mckayec/universe-sandbox/pull/44), branch `fix/mobile-entry-usability`.

Head: **38725238ed2df86910dc24438d9565fd14500d69** (parent 84625b06834fc24ebcabd3a2b17ffff93dd737fe). Answers every item in [implementation-review-a11y-r2.md](implementation-review-a11y-r2.md). A11Y-2 source and its keyboard regression are unchanged.

## Change (2 files, +32/−11)

- `src/style.css` (compact/enlarged-text block): the `.sim-state` rule that let the object count and mission clock shrink and clip (`flex: 0 9999 auto; overflow: hidden`) is replaced by **reflow**: `.sim-state` keeps its full width (`flex: 0 0 auto; white-space: nowrap`), and `.topbar` becomes `flex-wrap: wrap; height: auto; min-height: 44px`. When labels plus status no longer fit on one row, the top bar wraps to a second row instead of hiding content. The seven compact rules positioned below the top bar (universe toolbar, zoom controls and the panels at +112/+160/+212 px) add `var(--topbar-extra, 0px)`.
- `src/ui/toolbar.ts`: `bindTopbarReflow()` (registered next to `bindToolbarFade()`) sets `--topbar-extra` = top-bar height − 44 px in compact layout via a ResizeObserver, else 0.
- At default text size nothing changes: `--topbar-extra` is 0 px and the universe toolbar stays at top 60 px at 390×844, 320×568 and 844×390 (measured, see negative control).

## Item-by-item

1. **Count/time kept available** — by reflow, no disclosure needed. At 390×844@200% the top bar wraps (extra 36 px) and shows `OBJ 1288 T 1234:56` in full on row 1, actions on row 2 (`shots/a11y-r3-390x844-text200.jpg`). At 320×568@200% (extra 45 px) the count stays in full. Labels and 44 px targets preserved (Universes 133×44, Exhibits 120×44 at 390@200%).
   - **Deliberate omission, dispositioned:** the clock stays hidden at ≤360 px by the pre-existing rule (`@media (max-width: 360px)`, not introduced by this PR or return). The script asserts this explicitly as the pre-existing hide rather than skipping silently. Showing it would add a second top-bar row at default text size on 320 px phones; left to Mckay/ChatGPT if wanted.
2. **Status coverage added** — `a11y-r3.cjs` pauses, injects representative long values (count `1288`, clock `1234:56`), and asserts for each status value: exact text, displayed, every text rect on screen and inside the status box, status box not scroll-clipped, no overlap with the three top actions, and status bottom above the universe toolbar.
3. **Overlap probe repaired** — uses the real `#panel-toggle`; absence fails. Checked in **both** expanded and collapsed states (driven by clicking the toggle and asserting `aria-expanded`), Clear all vs toggle, plus the top-bar overlaps.
4. **Panel-specific activation** (small improvement) — Universes must open `#universe-picker`, Exhibits `#scenario-picker`, and each must close on Escape.

## Evidence (builder-executed, cloud sandbox, Chromium SwiftShader emulation; not native text scaling or a device)

| Check | Result |
|---|---|
| `a11y-r3.cjs` (9 viewport/scale cases + 3 keyboard cases) | **198/198 pass** — [a11y-r3-3872523.txt](a11y-r3-3872523.txt) |
| Negative control (`a11y-r3-negative-control.cjs`: the r2 sim-state rule re-injected on this build) | old rule: status clipped at 390@200% and 320@200% (clock text outside box at 390); new: unclipped; 100% identical (extra 0 px, toolbar top 60 px) |
| `pnpm check` | format, build, 82/82 unit, check:dist 111 files |
| `pnpm test:pages` | 12 pages × 2 viewports |
| `pnpm test:browser` (CHROME_PATH chromium-1243) | run 1 failed with the known `waitForFunction` 30 s timeout; run 2 passed — consistent with [save-load-smoke-disposition.md](save-load-smoke-disposition.md) |

Captures (top 260 px, JPEG): `shots/a11y-r3-{390x844,844x390,320x568}-text{150,200}.jpg`, keyboard focus `shots/a11y-r3-compact-{portrait,landscape}-focus.jpg`, `shots/a11y-r3-desktop-focus.jpg`.

## Unchanged limitations

Text scaling is approximated by root font-size + `-webkit-text-size-adjust` in emulation; no iOS Dynamic Type, Android font scale, screen reader, physical device or rotation-on-device run. Word-breaking of Universes/Exhibits labels at 320@200% remains (accepted in r2 review). Save/Load smoke intermittency is the separate pre-existing disposition. PR #44 remains draft; no merge; release approval stays with Mckay.
