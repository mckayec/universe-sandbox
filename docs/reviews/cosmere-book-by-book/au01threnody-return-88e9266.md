# AU01-THRENODY-01 return at PR48 88e9266

Claude, 2026-11-21 UTC. Implements only [au01-checkpoint-2-2026-11-21.md](au01-checkpoint-2-2026-11-21.md) AU01-THRENODY-01. Not merged; no PR24/PR37 edit; no canon approval; no gate, registry, engine or reading.js change.

|                                           | SHA                                                                                        |
| ----------------------------------------- | ------------------------------------------------------------------------------------------ |
| PR48 `feature/cosmere-reading-state` head | 88e9266c3670fc11991b05b46b8ccd4b73931412                                                   |
| actual parent (handoff head, unchanged)   | 9e7c4b7b7d418f675143b017f78f1bd02bc5728e                                                   |
| cosmere.js blob at head                   | defcba57faebddc3ac3ba8f683895a6bde09fcc5 (parent 777cee0693d5f9443766e720d8248dae6cf07a2c) |
| new test blob                             | 8f181ee93ea33901782aa83d49db518cfd42232d                                                   |

The remote PR48 head was re-read before editing and still equalled the handoff's 9e7c4b7 / pack blob 777cee0; each old string occurred exactly once (lines 546 and 830). No reconciliation needed.

## Incremental diff (2 files)

- `public/atlas/packs/cosmere.js` +2/−2, exactly the two replacements in the handoff:
  - `worlds[threnosun].blurb` → "A red star. In the empty space of this system the Shards Ambition and Odium fought; Ambition was mortally wounded. The twisted Investiture on Threnody is at least partly a scar of that battle."
  - `codex[shards].list[Ambition].desc` → "A Shard mortally wounded in a battle with Odium in the empty space of the Threnodite system. The battle still twists the Investiture on Threnody."
  - `first: 7` / `books: [7]` unchanged; no gate added. No other "Mercy" mention remains except the Mercy codex entry itself (`first: 10`, untouched).
- `tests/atlas-au01-threnody.test.ts` (new, 2 tests).

## Evidence (builder execution, this run)

| Check | Result |
| --- | --- |
| Focused test, head | **passed** 2/2. Payload: both fields equal the proposed strings, `first: 7` kept, whole parsed pack with the two fields restored deep-equals the parsed parent. Visibility with the actual engine selectors and `renderCodex` cut from engine.js (the proposal-probe harness): 16/16 paired field-state comparisons; visible in All, legacy7, bucket7, all works (parent shows old text, head new text); hidden in legacy6, empty, AU01 only, bucket7 minus AU01 for both parent and head. |
| Focused test against actual parent pack | **fails** at "new world blurb occurs once" (expected) |
| `pnpm format`, `pnpm check` | **passed**, 673/673 tests, check:dist 115 files OK |
| `pnpm test:pages` | **passed**, 12 pages x 2 viewports |
| `pnpm test:browser` | **failed**, inherited: `page.waitForFunction` timeout at browser-smoke.mjs:88 (the known Save/Load wait recorded on earlier PR48 heads). Not caused or fixed by this change. (A first attempt failed earlier at launch because the repo's Playwright expects a different bundled Chromium; re-run with `CHROME_PATH=/opt/pw-browsers/chromium-1243/chrome-linux64/chrome`.) |
| Rendered [au01threnody-probe.mjs](au01threnody-probe.mjs) (committed blob 6498b5e0…, Prettier-formatted; executed copy blob a0045149…, logic identical) | head **100/100**, exit 0 ([log](au01threnody-rendered-output-88e9266.txt), blob 6dea53c0…); actual parent pack **60/100**, exit 1, exactly the 40 expected failures (dossier new text, dossier removed-clause absent, Ambition new text, Ambition removed-clause absent, page removed-clause absent × 4 visible states × 2 viewports) ([log](au01threnody-rendered-negative-9e7c4b7.txt), blob 2f5eb43b…). |

Rendered probe scope: `pnpm build` at 88e9266 (dist pack `cmp`-equal to source), `vite preview` 127.0.0.1:4199, route `/atlas/index.html?pack=cosmere` + hash. Playwright Chromium 1243, `--use-gl=swiftshader`, `VERBOSE=1`. Viewports 1440x900 and 390x844 (touch; dossier sheet expanded with a real tap on `#grab` when collapsed). Seven states per viewport: visible All (`#book=0`), legacy7, bucket7, all works; hidden legacy6, AU01 only, bucket7 minus AU01. Per state: `threnosun` selected with `__atlas.selectWorld` and the dossier `textContent` read; codex opened via `#cxBtn`, Shards tab clicked for real, Ambition `.cx-item` paragraph read. Hidden states: threnosun not selected, no Ambition entry, neither old nor new target text on the page. No page errors in 14/14 page loads. Parent run: same build with only `dist/atlas/packs/cosmere.js` swapped for the 9e7c4b7 file, restored and checked with `cmp`.

Screenshots (All; all four viewed): [sun desktop](shots/au01threnody-head-sun-1440x900.jpg), [sun phone](shots/au01threnody-head-sun-390x844.jpg), [codex desktop](shots/au01threnody-head-codex-1440x900.jpg), [codex phone](shots/au01threnody-head-codex-390x844.jpg). Both texts read and wrap cleanly; no layout change.

## Limits retained

- Not certified by this unit: the retained mortal-wound / twisted-Investiture wording, the Planets fact (Monody, Elegy, Threnody, Purity), and every other AU01 claim. Leaving them unchanged is not endorsement.
- Observed, out of scope, untouched: the Odium codex entry says Odium "wounded Ambition at Threnody" (no Mercy/destroyed-planets clause).
- Accepted AU01-ORDER-01 and CA01 weather/destination changes are untouched (the diff does not reach them; the full suite including their tests passes).
- AU01-only and bucket7-minus-AU01 states hide both fields under the existing whole-bucket fallback; this return does not change gate policy.
- PR24/PR37 untouched.

fixing/claude → implementation-review/chatgpt.
