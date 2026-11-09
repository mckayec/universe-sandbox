# Deep worlds — DWO-E2-F1 fix + corrected DWO-E2 matrix at PR37 9aa06c1

- Builder: Claude, 2026-11-08T06:45–07:45Z. Exact head: `9aa06c1d72bbd23c6861e9239659049494ea5ae9` (atlas/deep-worlds; parent `b47a60c`). Builder-executed (SwiftShader), not independent. Not merged.
- Changed file: `public/atlas/engine.js` only (+5/−1, `#books` click handler).

## Root cause (confirmed by trace)

Instrumented run (state setters + history hooks) at b47a60c: tour reaches e70 at Luthadel (book 2), Stop, then book 2 → 1. Scadrial's `first` is book 2, so the `#books` handler takes its *place-not-visible* branch: it sets `S.book=1`, calls `leavePlace()` → `goBack()` (popstate lands on the older `#book=2…view=surface` entry, which is the URL the matrix saw), and returns **without clearing `S.ev`/`S.lm` or re-rendering**. Under SwiftShader the leave fade then took ~4.6 s to commit (`S.view="world"` at +4582 ms); until then the dossier, chronicle and breadcrumb kept the book-2 place copy ("Elend is deposed"). The earlier hypothesis (pending leave completing with the event set) was close but the event was simply never cleared on that branch.

## Fix

In that branch only, before `leavePlace(...)`: `S.ev=null; S.lm=null; PLACES.stopFx()`, blank the dossier, reduce the breadcrumb to the galaxy crumb, and `renderChron()` (cumulative ≤ new book). The leave/ascend continuation is unchanged. The in-place branch (place still visible) is unchanged.

## Evidence

| Check | Result |
| --- | --- |
| [dwo-e2-downgrade-repro.cjs](dwo-e2-downgrade-repro.cjs) v2 (now counts a transient leak at +1.5 s, incl. Luthadel/Scadrial copy in dossier+crumbs) — [output](dwo-e2-downgrade-repro-output-9aa06c1.txt) | persistent 0/3, **transient 0/3** (b47a60c: transient 3/3) |
| Corrected matrix [dwo-e2-browser-check.cjs](dwo-e2-browser-check.cjs) (tour count vs current-book chronicle) — [output](dwo-e2-browser-output-9aa06c1.txt) | **90/90 PASS** (1440×900 + 390×844); the 4 harness FAILs at b47a60c are gone |
| `pnpm check` | 125/125 unit, build + check:dist OK |
| `pnpm test:pages` | 12 pages × 2 viewports pass |

## Residual found (proposed DWO-E2-F2, Low; not fixed here)

[dwo-e2-settle-probe.cjs](dwo-e2-settle-probe.cjs) ([output](dwo-e2-settle-probe-output-9aa06c1.txt)): after the leave commits, the world view of Scadrial (dossier + crumbs "…›Scadrial›Luthadel") shows under book 1 until the follow-up ascend finishes (+10 s still on Scadrial, galaxy by +12 s under SwiftShader). No event copy, only the world/site names. The same pattern pre-exists in the world-view branch (unseen world → `ascend`), so it is a general "ascending out of an unseen world" transient, not a regression. Proposed fix if ChatGPT wants it: render a neutral dossier/crumbs while an unseen-world ascend is in flight. Also: the URL briefly shows the popped `book=2` entry until `syncURL` corrects it after the leave.

## Not covered

No physical device/real GPU; no screenshots; `test:browser` not re-run (pre-existing Save/Load flake, tracked separately). DWT-02 (Low) carried. No canon change; prior dispositions carry. Society, Save/Load, full technical and release gates remain open.
