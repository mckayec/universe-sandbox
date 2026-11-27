# Deep Worlds fix return — PR #37 at 232fef155c7a76cfb9e728321f064010cbb3878a

Branch `atlas/deep-worlds`, parent 60176e78f1272816a0869a5abe8018e884d704f7 (the reviewed head). Builder: Claude, 2026-11-07T13:55Z. Not merged; no release claim.

## DWR-A — Society EMP timer (public/atlas/society.js)
- `FX.heliofall`: the 2.5 s EMP timeout is now registered on the effect's own group (`g.userData.timers`) and its callback fires only if `navGen` is unchanged **and** that group is still in `fxList`.
- `stopFx`: clears every timer registered on each effect group before disposal. `clearForBook(earlier)` already bumps `navGen` and calls `stopFx`, so book downgrade cancels it; same-book stop and replay cancel it via the instance check.

## DWR-B — engine place-entry continuation (public/atlas/engine.js)
- New `placeGen` navigation generation, bumped by: the book handler (on an actual book change), `openEvent`, `selectWorld` (different world), `doLeavePlace`, and `enterPlace` itself.
- New `evEligible(e)`: filters, world seen, book gate (cumulative or exact, as `evFor`), and `canEnterEv` for site events.
- `enterPlace`'s 500 ms `then` commits only if the generation is unchanged and view/world/site still match the destination.
- `evInPlace` returns early unless the event is eligible and its world/site match the current place; its delayed effect re-checks generation, `S.ev`, eligibility and site before `PLACES.play`. Neutral navigation (no event) is unchanged.

## Cosmere supplement dispositions (public/atlas/packs/cosmere.js)
| ID | Object | Disposition applied |
|---|---|---|
| CS01 | kholinar/palace | Conservative option: "The Kholin palace. King Gavilar is murdered here on the night of the treaty feast." |
| CS02 | luthadel/clubs | **Omitted** (landmark removed; no event referenced it). |
| CS03, CS09, CS10, CS13, CS14, CS15 | — | Kept unchanged (supported-text). |
| CS04 | yeddaw/gate | Conservative option adopted verbatim. |
| CS05, CS20–CS22 | e6, e77, e15, e78 | Unchanged (accepted returns carried). |
| CS06 | e7 | **Omitted** (event removed; it had no other references in this pack). |
| CS07 | ttelir/markets | Conservative option adopted. |
| CS08 | ttelir/highlands | Conservative option adopted. |
| CS11 | courtofgods/palace | Safe shorter option adopted. |
| CS12 | courtofgods/palaces | Safe shorter option adopted. |
| CS16 | courtofgods/tunnels | Kept; commentary provenance stays labelled in the review. |
| CS17 | denir/statues | Conservative option adopted. |
| CS18 | e13 | Unchanged; remains partial (Known gap). |
| CS19 | e14 | Optional decision taken: `lm: "markets"` removed; site/text kept. |
| CS23 | e16 | Optional clarification adopted verbatim. |

Diff: 3 files, +24/−21 (engine.js, society.js, packs/cosmere.js). No other pack or engine file changed.

## Verification at 232fef1
- `pnpm format` (no further changes), `pnpm check`: build OK, **89/89** unit tests, check:dist 173 files OK.
- `pnpm test:pages` with Chromium 1243: **12 pages × 2 viewports** pass.
- [dwr-probe.cjs](dwr-probe.cjs) → [dwr-probe-output-232fef1.json](dwr-probe-output-232fef1.json): **22/22**. Executes the real source slices in inert vm fixtures (no renderer). Positive controls: uninterrupted heliofall EMP fires once (A1); uninterrupted Hyperion b2n at `hyperion/tree` (books [1,2]) plays (B1); fresh replay/entry after return plays (A3, B6). Cancellation controls: downgrade (A2, B2 during transition, B3 inside the 500 ms window, B4 after effect scheduling), downgrade/return (A3, B6), same-book stop (A4), replay (A5), generation-only change (A6), ineligible event without a bump (B5), site change (B7), world change (B8), plus source assertions for each bump site (A7, B8–B10).
- Negative control: the prior reviewer's remediation-checks.cjs (a115b69) reproduced both defects on 60176e7; this probe aborts on 60176e7 at its first guard assertion.
- **Not run:** `pnpm test:browser` (previously flaky on this branch at an unrelated save/load step), 4-viewport screenshots, real-device/keyboard/tour/deep-link acceptance. These stay Known gaps for technical acceptance.

## Known gaps carried
CS18 partial; remaining DW06 six-pack/Society passages; sample replacement for Sun Eater/Expanse/Foundation; geometry and earliest-appearance claims; full-app rendered acceptance; owner release approval. Open-ended research remains deferred (R3).
