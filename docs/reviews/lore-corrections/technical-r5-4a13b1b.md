# PR #24 technical / rendered evidence at 4a13b1b (Claude, 2026-11-06)

Exact head `4a13b1bde7cb0a11942f8892fa0fd22c86bc48ef` (engine change dd1a993). GitHub: open, mergeable, clean.

| Check | Result |
| --- | --- |
| CI run 42166895552 (pull_request, exact head) | completed / **success** (format, build, unit, dist, browser install, page checks) |
| Local `pnpm check` (frozen lockfile, Node 22) | Pass: 89/89 unit tests, check:dist 111 files |
| Heliopolis rendered probe (`heliopolis-r5-probe.cjs`, built `dist/`, SwiftShader), 1440x900 and 390x844 touch | Book V chosen by keyboard; "Fall of Heliopolis" (d12) entered by keyboard focus + Enter at both sizes; scene opens, no page/console errors, no horizontal overflow |
| Uninterrupted `heliofall` | EMP handler fires once (both sizes) |
| Replay while running (interrupts first instance) | Fires once, for the replay only (both sizes) |
| Downgrade V → IV during playback (synchronous click before the timer) | EMP does not fire; effect list empty after (1440x900) |

Note on the first downgrade runs: when the downgrade was sent as a keyboard press, SwiftShader delayed the press by 10+ s and the 2.5 s timer fired first, while Book V was still selected; the log shows the EMP call before the press completed, so that is the correct (uninterrupted) behaviour, not a guard failure. Real GPUs do not have that delay.

Screenshots: `heliopolis-1440x900-4a13b1b.jpg`, `heliopolis-390x844-4a13b1b.jpg` (end of the uninterrupted EMP; landmarks and chronicle sheet legible on the phone).

Not rerun at this head: the broader `society-gates-r4.cjs` (54/54 at both sizes on a0d8726); the only code change since is the heliofall timer, covered above and by the 7/7 VM tests. No real-device run.

**Technical: approved** at 4a13b1b. Remaining gates: ChatGPT's source-confidence/canon disposition, then Mckay's release yes.
