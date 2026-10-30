# Lore corrections — revision 4 recheck

2026-10-30. **Not approved: R3-C1 and R3-C3 are corrected; R3-C2 remains narrowly partial because one deferred effect timer survives cancellation.** This is an exact-head source/state review, not a new canon audit or release decision.

Reviewed open PR [24](https://github.com/mckayec/universe-sandbox/pull/24) at **a0d8726d55e389e4568a8d00ab4d9937d2f51e86**, `fix/lore-corrections`, against [R3](implementation-review-r3.md) at documentation SHA d2fd8d9d3656a74f0930a91a665ec0973a58f15b and implementation c91ea29. Fresh main status at **13520d5** assigns this exact revision to ChatGPT. No existing r4 review was found on main. Previous reports/probes are preserved. Root guidance and prior signed review workflow retained; current parent instruction prohibits direct main writes and PR metadata operations.

## Dispositions and counts

| Finding        | Result                                                       | Evidence                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| -------------- | ------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| R3-C1 / High   | **Closed at source/data level**                              | `LEV_DESC` supplies neutral book-I copy and the full clause at VI. Both the appended landmark and globe banner consume that shared keyed description; banner calls `eraVal`. `gateLandmarks` is rerunnable and called after the final extension at the end of the file. Actual gate block, late append and repeated final passes evaluated with minimal scene fixtures; I–V remain neutral and VI receives the late clause. All-books selection maps to ERA 6. |
| R3-C2 / Medium | **Substantially corrected, one residual Medium issue below** | `navGen`, `navGuard`, commit-time scene predicate, preload guard and guarded event/POI callbacks now prevent the original stale entries. `setEra` calls actual `stopFx`, dismisses banner, hides tooltip and clears the selected later event. Repeated downgrade/return does not revive the tested old navigation callbacks. The separate EMP timer still survives.                                                                                            |
| R3-C3 / Low    | **Closed as inherited editorial correction**                 | Bressia now says “killed the Consul’s wife and son”; no orphan pronoun or restored provocation clause. This is the accepted R3 repair, **not newly obtained primary-book confirmation**.                                                                                                                                                                                                                                                                       |

**2/3 prior R3 groups closed; 1/3 partial.** Four of five R2 groups remain source-conformant; R2-C4 still carries the residual lifecycle issue. In the inherited 40-row reconciliation, 26 mandatory rows conform, L29 remains partial, and 13 retained/no-change rows remain unchanged. These counts do not mean 40 literary claims were newly verified or rendered acceptance completed.

The reproducible probe retains 116 prior positive containment/cut checks and adds 25 checks: **141 assertions total, 140 positive checks plus one expected residual-defect reproduction**. This is deliberately not an all-green implementation certificate. Existing 12-POI gates, ten neutral body blurbs/control values, Chronicle hidden CSS and seven unsupported cuts remain covered.

## R4-C1 — Medium, residual R3-C2: the Heliopolis EMP timer outlives its effect

At [society.js:3034](https://github.com/mckayec/universe-sandbox/blob/a0d8726d55e389e4568a8d00ab4d9937d2f51e86/public/atlas/society.js#L3034), `FX.heliofall` schedules:

```js
SITES.heliopolis._emp && setTimeout(() => SITES.heliopolis._emp(), 2500);
```

The timeout handle is not retained, the callback has no generation or current-scene guard, and this effect's returned object has no dispose hook clearing it. `stopFx` removes the effect group but cannot cancel this timer. The `_emp` handler at line 2378 sets the scene's `emp` state to zero; its update code changes the shield and eventually hides it. The callback reads the **current** `_emp` property when it fires, so a rebuilt Heliopolis scene can receive an old effect's callback.

The source-state probe executes the exact timer statement, invokes actual `setEra` for a downgrade and return (which increments the navigation generation and stops effects), then executes the queued callback: `_emp` is still called once. This proves surviving callback state, not an observed screen leak or a measured user-input race. The event belongs to V; returning to an eligible scene does not authorize an old canceled playback to restart. A visible book-I spoiler is **not** asserted, since that scene's ordinary entry is gated.

**Required fix:** own the timeout in the effect and cancel it on dispose; also generation-guard its callback and require the same active scene/instance before applying `_emp`. A token guard alone handles book changes but does not handle stopping/replacing playback within the same book. Avoid dereferencing a newly installed scene handler from a stale effect. Add source/unit cases for (1) downgrade before 2.5s, (2) downgrade and return/rebuild before firing, (3) stop/replay in the same book, and (4) uninterrupted eligible playback still firing once. Then recheck the exact resulting head. Do not disable the effect or tests merely to get a green result.

## Narrow callback/cleanup acceptance

Verified in isolation: queued scene fade canceled after downgrade; old callback remains canceled after return to VI; fresh eligible entry reaches `loadSite`; pending preload completion cannot enter after downgrade; queued globe FX, site FX and ordinary POI event callbacks are invalidated; fresh event remains permitted. Actual `stopFx` calls dispose/removes its group and empties the list. Banner hidden/opacity and tooltip cleanup plus selected future-event clearing are checked on fixtures. No standalone cinematic caption system was established in these PR24 changed paths; banner cleanup does not certify PR37's additional caption system.

Unchanged neutral globe navigation is not comprehensively canceled by these guards, nor required to disappear simply because it moves a camera. The residual finding concerns a delayed story-effect mutation. No rendering, keyboard timing, focus isolation, mobile geometry, or all possible queued callbacks are certified. The earlier Phobos mesh-level disclosure remains a future rendered/model acceptance item, not a newly proved lore leak.

## Comparison with PR37 — presence only, not a second audit

Fresh PR37 head **9a09dbce1e777d3255e058e11d2b81c53cae8d98** remains open. Its implementation differs from PR24:

- Europa's explicit Light Bringer clause is also keyed at VI and both surfaces call the same era-resolved source, but its early `LEV_BASE` retains detailed sea-creature claims rather than PR24's neutral illustration text. No new primary confirmation of those claims here; do not call the two fixes textually identical.
- Generation checks are placed in `fadeTo`, preload and `descendThen`; `clearForBook` additionally clears toggles/tour/cinematic caption classes on downgrade. These source paths are present, **not independently covered by the PR24 fixture suite**.
- Bressia uses the narrower accepted alternative, “Kassad fought in the Bressian campaign,” after the world introduction. The orphan pronoun is gone.
- The same unguarded Heliopolis `_emp` timeout remains at approximately line 4791. Forward the residual lifecycle requirement when that build is rechecked; this comparison does not resolve Deep Worlds' other content/evidence holds.

## Validation and release gates

[validation-r4.md](validation-r4.md) lists actual commands. **82/82 unit tests**, TypeScript noEmit and Society syntax checks pass; 141 source/state assertions pass with the one intentionally characterized defect. Exact-head [CI40839422713](https://github.com/mckayec/universe-sandbox/actions/runs/40839422713) completed/success. Neither those checks nor builder browser evidence substitutes for this reviewer's unperformed rendered/mobile/keyboard acceptance.

**Not approved: fix R4-C1 (remaining R3-C2), recheck the new exact head, retain earlier source-confidence qualifications and complete permitted rendered/interactive acceptance plus owner release approval.** No application edit, formal approval, main write, new PR operation, merge or deployment performed.
