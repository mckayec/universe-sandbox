# Standard Works — CS-2 return (checkpoint 69)

2026-11-07T07:18Z · Claude (builder). PR33, branch `pack/lds-standard-works`, exact head **14c9d0f897c259c7e3011dcfedfa9081cc5f9925** (parent 9d53e7c48eae8469e240e6b61e933e7b5c115d5f). Implements CS-2 from [audit-final.md](audit-final.md). One commit.

## 1. Diff (9d53e7c → 14c9d0f)

| File | Change |
| --- | --- |
| `public/atlas/packs/lds-standard-works.js` | `meta.notice` replaced with the exact CS-2 text (below). Pack blob 3d279a757303e6ae7e80c358a6f6e041269eb82c. |
| `public/atlas/engine.js` (+2) | The world dossier now ends with `<p class="srcnote fan narrow-notice">` + `fanNotice(M)`. Generic engine change, all packs. |
| `public/atlas/engine.css` (+1/−1) | `.srcnote.narrow-notice{display:none}`; shown only inside the existing `@media (max-width:1180px)` rule that hides `.credits`. |
| `tests/lds-cs2.test.ts` (new) | Pins the exact notice and the narrow-width dossier notice + CSS. |

Exact notice now in the pack:

> Independent educational atlas with selected coverage, not a verse-complete concordance. Not an official publication of The Church of Jesus Christ of Latter-day Saints. Scripture narratives, religious beliefs, historical evidence and geographic proposals are labelled separately.

## 2. Why the engine change (scope note for the recheck)

The finding assumed the notice already reaches phones through credits/About. Checking at 390x844 showed it does not: the Chronicle `.credits` strip is `display:none` at ≤1180px, and the About/overview dossier (the only other `fanNotice` use) is only rendered when no world is selected. This pack starts on Earth (selected) and has a single world, so on phones neither surface ever appeared (probed at load, after "Return to the galaxy", and after the home breadcrumb: 0 notice elements visible). That also meant the existing independence/official-status statement was never visible on phones. The fix repeats the same `fanNotice(M)` text at the end of the selected-world dossier at ≤1180px only; desktop is unchanged (it is `display:none` there and the credits strip still shows it). No pack content beyond `meta.notice` changed.

## 3. Preservation

- Evaluated pack data at 9d53e7c vs 14c9d0f: **1 differing path, `.meta.notice`**; 0 other field changes (codex, sources, gates, dates, spatial data, routes unchanged).
- CS-1 33/33 sources, RES64/RES96, SEM/MAT regressions: unchanged files, all existing tests pass.

## 4. Notice display evidence (rendered, software GL)

| Viewport | Surface | Result |
| --- | --- | --- |
| 1440x900 | Chronicle credits (bottom right) | visible, 684x41 px, 3 lines, scrollWidth = clientWidth (no clipping); dossier copy `display:none`. [shot](shots/cs2-desktop-1440.jpg) |
| 390x844 | End of Earth dossier sheet | visible, 336x90 px, 6 lines, 10px, scrollWidth = clientWidth (no clipping); credits `display:none`. [shot](shots/cs2-phone-390-notice.jpg) |

0 page errors on both. The notice uses the existing faint `srcnote` style (same colour as srcnote/credits elsewhere); legibility judgment is the reviewer's.

## 5. Validation at 14c9d0f

- `pnpm format` clean; `pnpm check`: format, build, **176/176** unit tests (174 + 2 new CS-2), check:dist 114 files OK.
- `pnpm test:pages`: 13 pages x 2 viewports pass under /universe-sandbox/.
- `pnpm test:browser`: smoke test pass (desktop construction, persistence, controls, mobile layout).

## 6. Requested recheck

Notice delta + the small generic engine/CSS addition in §2 only. No source, sample, residual or RES64 work repeated. Technical/device sign-off (Claude) and Mckay's release approval remain separate.
