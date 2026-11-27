# PR33 integration fix: reference-card jump (INT850-1)

- Branch `pack/lds-standard-works`, head `889be2af14141c6fa89e5db287c9ca8583fc3ee0` (one commit on top of `850bee707ba9a0facc8fa06ada0126276be9f974`). Since then, main has changed only `docs/`.
- Answers [integration-review-850bee7.md](integration-review-850bee7.md), Medium finding: "Abrahamic reference-card jumps lose the requested card". Author: Claude, 2026-11-27T02:25Z. Not merged.

## Finding resolution: fixed
- **Reproduced at 850bee7** (built dist, SwiftShader, 1440×900). Steps: open Chronicle event `che-1054`, then click the `chp-constantinople` reference-card link. The Codex opened on the right section ("Places without a map point"), but `#cx-chp-constantinople` was missing and no `.cx-item.hl` existed. `#cxBody.scrollTop` stayed 0, while the card is item 13 of 45.
- **Root cause.** In the merge, PR33's `cxItem(x)` replaced main's inline renderer, and `cxItem` emitted only `data-key`. Main's `openCodex(tab, entry)` was kept. It sets `cxHl` and looks up `cx-<id>` after rendering, so the lookup returned null and the body scrolled to 0.
- **Change** (`public/atlas/engine.js`, +5/−2):
  - `cxItem` now emits `class="cx-item hl"` when `x.id===cxHl`, plus `id="cx-<id>"` for every card with an `id`.
  - PR33's `data-key`, `<h3 tabindex="-1">`, layer metadata, sources, see-also and `codexSplit` filtering are unchanged.
  - `cxGo` (LDS see-also) clears `cxHl` before re-rendering, so a see-also jump never leaves a stale reference highlight beside its own `cx-hit` pulse.
  - Main's `openCodex` jump mechanism (body-only scroll to `cx-<id>`, `.cx-item.hl` CSS) is untouched.
  - Only the Religious Traditions (abrahamic) pack has codex `id`s (93, 0 duplicates). The other 8 packs have none, so their output is unchanged.

## Regression tests
- `tests/atlas-refcard.test.ts` (4 tests) runs the exact `cxItem` source from engine.js with stubs. It checks:
  - the requested card gets `hl` and `cx-<id>`;
  - other cards keep their id without `hl`;
  - an LDS card keeps `data-key` and the focusable heading, with no id;
  - the openCodex scroll, `cxGo` clear and `.cx-item.hl` CSS are still present.
  - **Negative control:** with the 850bee7 engine, 0/4 pass (4 fail).
- `tests/standalone-pages.mjs` adds a per-pack `check` hook. For the abrahamic atlas, at 1440×900 and 390×844, it clicks event `che-1054` → `chp-constantinople` and requires:
  - the Codex is open;
  - the card is present and not first;
  - exactly `[cx-chp-constantinople]` is highlighted;
  - the body is scrolled, with the card top 0–40 px from the body top;
  - the page did not scroll.
  - At 850bee7, the same probe read card missing, highlight empty and scrollTop 0 (see Reproduced above).

## Checks at 889be2a
- `pnpm format`, then `pnpm check`: format OK, build OK, 264/264 tests (260 + 4 new), check:dist 123 files OK.
- `pnpm test:pages`: 15 pages × 2 viewports pass, including the new abrahamic reference-card check at both sizes.
- `pnpm test:browser`: the first run failed in the Gravity Lab sandbox save toast ("save toast: Passage at warp" timing, unrelated to the atlas). Two reruns passed.

## Rendered verification (SwiftShader, built dist)
Results at the sizes run:

| View | Result |
|---|---|
| Abrahamic 1054 → Constantinople, 1440×900 | card index 12, `hl` = [cx-chp-constantinople], card top 12 px, body scroll 865, page scroll 0, 0 errors |
| Abrahamic 381 (`che-constantinople`) → same card, 1440×900 | same result |
| Abrahamic 1054, 390×844 (chooser shown) | same, body scroll 1734 |
| LDS see-also (Unmapped places → "Zion in Moses 7", other section), 1440×900 and 390×844 | section switched to pgp-more, `cx-hit` set, heading focused, card top 12, 0 `.hl`, page scroll 0 |
| LDS phone chooser, 390×844 | switching to "Narratives without a map pin" re-renders 34 cards, scrollTop 0 |
| Cosmere Codex, 1440×900 | opens with 14 cards, no ids or highlights (the pack has no reference cards) |
| LDS 3840×2160, 1280×800 | 0 console errors, 0 third-party requests, no horizontal overflow |

Screenshots in [shots-integration-889be2a/](shots-integration-889be2a/), all viewed:
- `abr-1054-1440`, `abr-381-1440`, `abr-1054-390`: Constantinople at the top of the scrolled body, gold top rule and gold heading.
- `lds-1440-seealso`, `lds-390-seealso`: target heading focused.
- `lds-390-chooser`, `cosmere-codex-1440`.
- `lds-3840`, `lds-1280`, `lds-1440`, `lds-390`: the standard atlas views, unchanged from 850bee7.

## For the recheck
Diff 850bee7..889be2a touches 3 files: `public/atlas/engine.js` (cxItem, cxGo), `tests/atlas-refcard.test.ts` (new) and `tests/standalone-pages.mjs` (check hook). There is no pack content or CSS change.
