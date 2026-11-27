# CA01-WEATHER-01 return at PR48 0ad0c14

Claude, 2026-11-21 UTC. Implements only [ca01-handoff-2026-11-21.md](ca01-handoff-2026-11-21.md) CA01-WEATHER-01 (one sentence in one field). Not merged; no PR24/PR37 edit; no canon approval; no gate change; CA01 stays at research unit 1/2.

|                                           | SHA                                                                                        |
| ----------------------------------------- | ------------------------------------------------------------------------------------------ |
| PR48 `feature/cosmere-reading-state` head | 0ad0c14957a840a69700e6d26df47102882a65d3                                                   |
| actual parent (handoff head, unchanged)   | b202db06188bc11a694e5232ee0ce983882a7fb8                                                   |
| cosmere.js blob at head                   | ab5db8c8b53ee989391d6436d49afc8183bdccbf (parent ad08f0d153576859e9d4fa64f691148c6bb9db56) |
| new test blob                             | f02783580013dac3ec98edeb958c10ea9f0d06db                                                   |

The PR48 head was re-read before editing and still equalled the handoff's b202db0 / pack blob ad08f0d; the old sentence occurred exactly once (line 674). No reconciliation was needed.

## Incremental diff (2 files)

- `public/atlas/packs/cosmere.js` +1/−1, line 674 `worlds[canticle].blurb`, inside the blurb only:
  - old: "It spins backwards, rings light its night side, and a firestorm sweeps the sunset line."
  - new: "It spins backwards, and rings light its night side. A powerful storm follows sunset, bringing wind, rain, and lightning."
  - First and last sentences of the blurb (including the sunlight-danger sentence, a known gap) unchanged. No change to eras[12], short, status, facts, ring/gfx, sites, coordinates, events, codex, links, gates, IDs, registries, engine.js, reading.js or earlier KO01/TH01/Kenton corrections.
- `tests/atlas-ca01-weather.test.ts` (new, 2 tests).

## Evidence (builder execution, this run)

| Check | Result |
| --- | --- |
| Focused test, head | **passed** 2/2. Source: new sentence once, old sentence and "firestorm" absent; whole-source reversal equals the parent source; parsed pack with only this blurb reversed deep-equals the parent. Actual engine selectors (rdWorldHidden, eraBlurb, eraVal, evOk/eText, siteSeen/sDesc cut from engine.js) in 13 reading states: world visibility, facts, status, sites and 819/819 event (visibility + text) entries equal to the parent; blurb equal except the substitution; "firestorm" returned in 0/13. |
| Parent exposure of the base blurb (asserted) | **2/13**: legacy11, bucket11. All / legacy12 / all works show the unchanged `eras[12].blurb`; Sunlit-only, bucket11 minus Sunlit, all works minus Sunlit, legacy10, legacy1, none, first work only and all works minus bucket11 hide Canticle or the blurb. Sunlit alone does not unlock it (existing whole-bucket-11 fallback, unchanged). |
| Focused test against actual parent pack | **fails** at "new sentence occurs once" (expected) |
| `pnpm format`, `pnpm check` | **passed**, 667/667 tests, check:dist 115 files OK |
| `pnpm test:pages` | **passed**, 12 pages x 2 viewports |
| Rendered [ca01weather-probe.mjs](ca01weather-probe.mjs) (blob 13f6a66c…, `cmp`-equal to the executed copy) | head **48/48**, exit 0 ([log](ca01weather-rendered-output-0ad0c14.txt), blob accb3964…); actual parent pack **40/48**, exit 1, the 8 expected failures only (old wording present + blurb ≠ replacement, in the 2 eligible states × 2 viewports) ([log](ca01weather-rendered-negative-b202db0.txt), blob 0b67630f…) |
| `pnpm test:browser` | **failed** at `tests/browser-smoke.mjs:88` TimeoutError — the known Save/Load wait limitation, unrelated. Not claimed as passing. |

Rendered probe scope: `pnpm build` at 0ad0c14 (dist pack `cmp`-equal to source), `vite preview` 127.0.0.1:4173, route `/atlas/index.html?pack=cosmere` + hash. Node v22.23.5, Playwright 1.62.1 Chromium, `--use-gl=swiftshader`, `VERBOSE=1`. Viewports 1440x900 and 390x844 (touch; phone sheet expanded with a real tap on `#grab` when collapsed). Canticle selected **programmatically** (`__atlas.selectWorld`); no event-row interaction is needed for this field. Per viewport, 6 states:

- base-blurb states legacy11 and bucket11: Canticle selected; dossier `p.blurb` equals the full new blurb; old wording absent; blurb box visible and horizontally inside the viewport after scrolling; 0 errors;
- era-12 state All: `eras[12].blurb` shown; neither old nor new sentence on the page; 0 errors;
- denied states legacy10, Sunlit only, bucket11 minus Sunlit: neither sentence on the page; 0 errors.

Parent run: same build with only `dist/atlas/packs/cosmere.js` swapped for the b202db0 file, then restored and checked with `cmp`.

Screenshots (legacy11, both viewed): [desktop](shots/ca01weather-head-legacy11-1440x900.jpg), [phone](shots/ca01weather-head-legacy11-390x844.jpg). The new sentence wraps cleanly in the dossier on both; nothing obscured. No 4K capture (text-only change).

## Limits retained

- The sunlight-danger first sentence, rotation/ring clauses (retained, not newly certified), eras[12] blurb including the UTol destination wording, sites, landmarks, events, codex, h-scad-can/h-nomad/h-nomad2 links and geometry are unchanged. Leaving them unchanged is not endorsement.
- Hover card shows the blurb's first sentence, which is unchanged.
- Sunlit-only whole-bucket fallback, Save/Load and search/graph/modal surface-route limitations unchanged. PR24/PR37 not touched.

fixing/claude → implementation-review/chatgpt.
