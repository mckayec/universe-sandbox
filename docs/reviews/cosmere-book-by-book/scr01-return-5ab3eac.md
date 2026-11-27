# SCR-01 return — Scadrial distText qualifier at PR48 5ab3eac

Claude, 2026-11-16T20:56Z. PR48 `feature/cosmere-reading-state`, exact head **5ab3eacc79476bc69a88879b1abb696d13be263f**, parent **54c8df8fd3105694ef2c793a1be6926d4e571a99**. Requested by [implementation-review-54c8df8.md](implementation-review-54c8df8.md). Not merged; no canon or release claim.

## Exact diff (2 files, +39/−1)

- `public/atlas/packs/cosmere.js` (one line, Scadrial record only): `distText: ORR` → `distText: "Illustrative system layout; distances and orbital order are not verified here."`. The shared `ORR` constant, geometry (`map: orb(C.scadrial, .2, 40)`), status, facts, gates, model, eras, realms, sites and every other record are unchanged. The string is nonempty, so `distText()` returns it before hooks or the generic light-year calculator.
- `tests/atlas-scadrial-reduced.test.ts`: +13 tests. The real `distText` function is now cut from engine.js alongside the existing selectors. For set (original trilogy read; nothing read), legacy #book=2/6/10 and All × Physical/Cognitive (12 cases): Scadrial's distText equals the exact qualifier, does not contain "planet order from the system chart" and has no light-year text. One scope test: the ORR constant is unchanged, no other record carries the Scadrial qualifier, and other records still carry the chart attribution (explicit holds; no site-wide absence claim).

Input blobs at 5ab3eac: pack 0f333af7203077291dbc211799c8c47ecff7cb2a; test 11d13c4447eeeb7e5739a69aa9cba02c9960e18b; engine 0bc5357a2043f3939512bc5b091eb4ffbbf1c5d0 (unchanged); reading helper 4d9bc177294e5e33accf6f19825ef467f0bb90d4 (unchanged).

## Checks (builder-run, Node v22.23.4)

- `node --experimental-strip-types --test tests/atlas-scadrial-reduced.test.ts`: **30/30** (17 existing + 13 new).
- `pnpm format` then `pnpm check`: format OK, build OK, **191/191** unit tests, check:dist 115 files OK.
- Rendered: [scr01-probe.mjs](scr01-probe.mjs) (the reduced-parent probe plus a Distance-row assertion in every selected state: OT set galaxy + surface, OT+bucket 6, Cognitive and Physical after realm switch, legacy 2/6/10, All; at 1440×900 and 390×844). Production build via `vite preview`, headless Chromium + SwiftShader.
  - Head 5ab3eac: **205/205** pass, 0 page/console errors — [log](scr01-rendered-5ab3eac.txt) (VERBOSE, every line).
  - Negative at parent 54c8df8 (same probe): **169 pass / 36 fail**; all 36 failures are the new Distance-row checks — [log](scr01-rendered-negative-54c8df8.txt). The 169 pre-existing checks still pass, so hidden parents/descendants (none + 7 incomplete subsets, bucket-6 only, child-site bypass) are unchanged.

## Qualifier evidence (viewed, 6/6)

Desktop and expanded-phone dossier crops showing the Distance row with the qualifier and the artist's-model note below it:
[galaxy 1440×900](shots/scr01-dossier-galaxy-1440x900.png), [galaxy 390×844](shots/scr01-dossier-galaxy-390x844.png), [surface 1440×900](shots/scr01-dossier-surface-1440x900.png), [surface 390×844](shots/scr01-dossier-surface-390x844.png), [Cognitive 1440×900](shots/scr01-dossier-cognitive-1440x900.png), [Cognitive 390×844](shots/scr01-dossier-cognitive-390x844.png). The text wraps to two lines on both widths and is fully legible; phone crops are taken with the sheet expanded.

## Not changed / still held

All residuals in the review's disposition table remain held as written (group label/map/positions, era-6/10 content, Harmony codex, scadsun and neighbours incl. their ORR attribution, star colours/gfx, Cognitive specifics, Luthadel, earliest naming). No new parent promotion or gate change.

## Handoff

ChatGPT: review SCR-01 at 5ab3eac, then resume individual-work source review from the recorded holds.
