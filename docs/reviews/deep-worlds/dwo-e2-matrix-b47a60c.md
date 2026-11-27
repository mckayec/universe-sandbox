# Deep worlds — DWO-E2 rendered matrix at PR37 b47a60c

- Builder: Claude, 2026-11-08T04:46–05:50Z. Exact head: `b47a60c663c571a2bb5deb932bb129fe941c73da` (atlas/deep-worlds, unchanged; no application edit this run).
- Environment: `pnpm build` of that head served by `vite preview`; Playwright Chromium (`/opt/pw-browsers/chromium-1243`), SwiftShader WebGL. Builder-executed; not independent.
- Harness: [dwo-e2-browser-check.cjs](dwo-e2-browser-check.cjs). Output: [dwo-e2-browser-output-b47a60c.txt](dwo-e2-browser-output-b47a60c.txt). Follow-up repro: [dwo-e2-downgrade-repro.cjs](dwo-e2-downgrade-repro.cjs), [output](dwo-e2-downgrade-repro-output-b47a60c.txt).

## Predicates (tightened per implementation-review-b47a60c.md)

Every scenario waits for the exact expected state or reports a timeout as FAIL. Place scenarios require the rendered place (`AtlasPlaces.place.site.id`) and rendered landmark focus (`place.sel`) to equal state; `null` is never accepted where a place is expected. Each page carries a per-document marker, so a Back that leaves the app fails instead of being skipped. Zero page errors/console errors required per scenario. Back is tested only after an in-app entry pushed a known history entry (surface link → chronicle click → place).

## Result: 85 PASS / 5 FAIL of 90 (both viewports)

| Scenario | 1440×900 | 390×844 |
| --- | --- | --- |
| D1 stale `lm=conservatory` link: Arrakeen place renders, lm dropped (state+render+URL), no conservatory/Margot copy, rendered landmarks exclude conservatory and include residency; residency positive control via dossier click; same document; 0 errors | 7/7 | 7/7 |
| D2 valid `lm=residency` direct link restores place + rendered landmark; 0 errors | 2/2 | 2/2 |
| D3 Dune book 1: chronicle excludes d15/d16; chronicle d4 enters Arrakeen at the Residency (rendered); Back → Arrakis surface, same document; tour 27 = chronicle 27, all 27 steps exclude removed titles; tour Stop settles with render = state; All books has no d15/d16; 0 errors | 10/10 | 10/10 |
| e70 (book 2, Luthadel): listed at gate; chronicle click renders Luthadel with no landmark; Back → Scadrial surface, same document; tour reaches it and renders Luthadel, no landmark; direct place link at gate; below-gate (book 1) direct link has no e70 copy; 0 errors | 9/11 | 10/11 |
| e102 (book 8, Kholinar): same set, below gate = book 7 | 10/11 | 10/11 |

### The five FAILs

1. **Four tour-count FAILs are a harness predicate error, not app defects** (e70 and e102, both widths). The predicate compared tour length with *all* chronicle buttons, but the engine's chronicle is cumulative (`renderChron`: every book ≤ current) while `tourList` is the current book only. Dune book 1 matched only because it is the first book. In all four the tour *did* reach the event and render the correct place (the following line passes). The script is now corrected to compare with the current-book chronicle (`evsCur`); **the corrected predicate has not been re-run**.
2. **DWO-E2-F1 (new, proposed Medium): transient below-gate exposure after tour Stop + downgrade.** 1440×900, e70: tour reaches e70 at Luthadel (rendered), Pause, Stop, then book 2 → 1. At +1.5 s state is `view=place, ev=e70, book=1` with the book-2 title "Elend is deposed" still in the dossier and chronicle, while the URL already reads `book=2 … view=surface` (a leave is in flight). By +8 s it settles clean on the Scadrial surface (`ev=null`, no e70 copy). Repro 3/3 transient, 0/3 persistent. Not seen at 390×844 (that run downgraded after the leave had completed) nor for e102 (stayed in place, clean). Likely cause, unconfirmed: the `#books` handler takes its `S.view==="place"` branch while a leave transition is pending, and the pending leave's completion then runs with the event still set; the URL/state mismatch fits. Root cause and fix are the next Claude unit.

## Not covered / limits

- Builder-executed SwiftShader only; no physical device/real GPU; screenshots not taken this run.
- Tour stepping uses the real Next/Pause/Stop buttons; book change uses `API.setBook` (a real `#books` button click).
- DWT-02 (repeated identical pending destination, Low) carried separately; not exercised here.
- No canon change; prior dispositions (three Dune omissions, 18 narrowed leaves, 3 scoped retains, 8 source holds) carry unchanged. Society, Save/Load, full technical and release gates remain open.
