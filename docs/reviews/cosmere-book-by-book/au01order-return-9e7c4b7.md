# AU01-ORDER-01 return at PR48 9e7c4b7

Claude, 2026-11-21 UTC. Implements only [au01-checkpoint-1-2026-11-21.md](au01-checkpoint-1-2026-11-21.md) AU01-ORDER-01. Not merged; no PR24/PR37 edit; no canon approval; no gate, registry, engine or reading.js change.

|                                           | SHA                                                                                        |
| ----------------------------------------- | ------------------------------------------------------------------------------------------ |
| PR48 `feature/cosmere-reading-state` head | 9e7c4b7b7d418f675143b017f78f1bd02bc5728e                                                   |
| actual parent (handoff head, unchanged)   | 057721011d6b0ba676ab957540b044241681382d                                                   |
| cosmere.js blob at head                   | 777cee0693d5f9443766e720d8248dae6cf07a2c (parent 2b8b9ccbfdca6ce47e8fc627e3fce9c416fbec43) |
| new test blob                             | 07f36453c4e8323f145fd4506570f2d84ff64eab                                                   |

The remote PR48 head was re-read before editing and still equalled the handoff's 0577210 / pack blob 2b8b9cc; both target expressions occurred exactly once (lines 385 and 389). No reconciliation needed.

## Incremental diff (2 files)

- `public/atlas/packs/cosmere.js` +2/−2, both inside the Rosharan gas-giant generator:
  - line 385 `status: "Gas giant · " + (i + 5) + "th from the sun"` → `(i + 4)`
  - line 389 `facts: [["Order", (i + 5) + "th from the sun (" + (i + 1) + " of the ten gas giants)"] …` → `(i + 4)`; the `(i + 1)` 1-of-10 index and the `short` index are unchanged.
- `tests/atlas-au01-order.test.ts` (new, 2 tests).

No `(i + 5)` expression remains in the pack. All ten new ordinals end in "th" (4th–13th), so no suffix logic was needed.

## Resulting values (20 across 10 records)

| World | status / Order fact (head)                      | parent |
| ----- | ----------------------------------------------- | ------ |
| jes   | Gas giant · 4th / 4th … (1 of the ten gas giants)   | 5th    |
| nan   | 5th / 5th … (2 of the ten)                       | 6th    |
| chach | 6th / 6th … (3 of the ten)                       | 7th    |
| vev   | 7th / 7th … (4 of the ten)                       | 8th    |
| palah | 8th / 8th … (5 of the ten)                       | 9th    |
| shash | 9th / 9th … (6 of the ten)                       | 10th   |
| betab | 10th / 10th … (7 of the ten)                     | 11th   |
| kak   | 11th / 11th … (8 of the ten)                     | 12th   |
| tanat | 12th / 12th … (9 of the ten)                     | 13th   |
| ishi  | 13th / 13th … (10 of the ten)                    | 14th   |

## Evidence (builder execution, this run)

| Check | Result |
| --- | --- |
| Focused test, head | **passed** 2/2. Payload: 20/20 values equal the 4th–13th sequence, parent values 5th–14th, `short` 1-of-10 index kept; whole parsed pack with the 20 values reversed deep-equals the parsed parent. Visibility with the actual engine selectors (rdWorldHidden, eraVal, eraBlurb cut from engine.js) in 8 reading states: hidden flag and blurb equal to the parent for 10/10 giants in every state; status and facts equal except the ordinal. Visible: All, legacy7, bucket7, all works (10/10 each). Hidden: legacy6, AU01 only, bucket7 minus AU01, none (existing whole-bucket fallback; bucket 7 is not mapped per work, so AU01 alone does not expose `first: 7` records — unchanged, no gate added). |
| Focused test against actual parent pack | **fails** at "status expression occurs once" (expected) |
| `pnpm format`, `pnpm check` | **passed**, 671/671 tests, check:dist 115 files OK |
| `pnpm test:pages` | **passed**, 12 pages x 2 viewports |
| `pnpm test:browser` | **failed**, inherited: `page.waitForFunction` timeout at browser-smoke.mjs:88 (the known Save/Load wait, recorded on earlier PR48 heads; it passed by chance on the 0577210 run). Not caused or fixed by this change. |
| Rendered [au01order-probe.mjs](au01order-probe.mjs) (committed blob 980d2986…, Prettier-formatted; executed copy blob f23e1128…, logic identical) | head **454/454**, exit 0 ([log](au01order-rendered-output-9e7c4b7.txt), blob a0375866…); actual parent pack **214/454**, exit 1, exactly the 240 expected failures (status, Order fact, old-ordinal-absent × 10 giants × 4 visible states × 2 viewports) ([log](au01order-rendered-negative-0577210.txt), blob b22ad3cd…). |

Rendered probe scope: `pnpm build` at 9e7c4b7 (dist pack `cmp`-equal to source), `vite preview` 127.0.0.1:4199, route `/atlas/index.html?pack=cosmere` + hash. Playwright Chromium, `--use-gl=swiftshader`, `VERBOSE=1`. Viewports 1440x900 and 390x844 (touch; dossier sheet expanded with a real tap on `#grab` when collapsed). Seven states per viewport: visible All (`#book=0`), legacy7, bucket7, all works; hidden legacy6, AU01 only, bucket7 minus AU01. Each giant selected programmatically with `__atlas.selectWorld`; the status chip and the `dl.facts` Order row are read from the dossier's `textContent` (the chip is CSS-uppercased, so `innerText` is not used). Hidden states: the world is not selected and no gas-giant ordinal text is on the page. No page errors in 14/14 page loads. Parent run: same build with only `dist/atlas/packs/cosmere.js` swapped for the 0577210 file, restored and checked with `cmp`.

Screenshots (All; all four viewed): [Jes desktop](shots/au01order-head-jes-1440x900.jpg), [Jes phone](shots/au01order-head-jes-390x844.jpg), [Ishi desktop](shots/au01order-head-ishi-1440x900.jpg), [Ishi phone](shots/au01order-head-ishi-390x844.jpg). Chip and Order row read 4th / 13th and wrap cleanly. Observed, pre-existing and untouched: on the phone the "Descend" button label is clipped at the sheet's right edge.

## Limits retained

- Not certified by this unit: the gas-giant blurb (habitability, moons, rings, Shadesmar, Honor, painted colours), positions/geometry, the Moons fact, and every other Rosharan/AU01 claim. Leaving them unchanged is not endorsement.
- Accepted CA01 weather and destination changes are untouched (the diff does not reach them; the full suite including both CA01 tests passes).
- AU01-only and bucket7-minus-AU01 states hide the giants under the existing whole-bucket fallback; this return does not change gate policy.
- PR24/PR37 untouched (they already show 4th–13th).

fixing/claude → implementation-review/chatgpt.
