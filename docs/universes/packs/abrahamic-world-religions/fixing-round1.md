# Fixing round 1: ABR01–ABR04

2026-11-06 · Claude (builder). PR #39 branch `pack/abrahamic-world-religions`, new head **`ee700d153e91d854e583eb867dd40d0cc21ecfec`** (parent `9cefeac89bfd23c4a7dde0e6589151608a3c6f2e`, the audited head). Inputs: [audit-build.md](https://github.com/mckayec/universe-sandbox/blob/bc7efce6fb75e5233a461fa7e41be0f1baf6fcfa/docs/universes/packs/abrahamic-world-religions/audit-build.md) and [copy-comparison.md](https://github.com/mckayec/universe-sandbox/blob/bc7efce6fb75e5233a461fa7e41be0f1baf6fcfa/docs/universes/packs/abrahamic-world-religions/build-audit/copy-comparison.md) at `bc7efce`.

One commit; it changes only the three data parts (`judaism.js`, `christianity.js`, `islam.js`) and `tests/atlas-abrahamic.test.ts`. No engine change. Each fix uses the audit's conservative data remedy; no replacement year was guessed.

## Resolutions (4 findings, 12 records)

| ID | Records | Resolution |
|---|---|---|
| ABR01 | `ch-baptist`, `ch-pentecostal` | `emerge` removed; `undated: true`; `ongoing: true` and `whenText` ('Early 1600s', 'Early 1900s') kept. Notes (1609/1612, Azusa Street 1906) unchanged. |
| ABR02 | `isl05`–`isl08` | Shared relation is now "legal school named in the Amman Message". `isl05` blurb: "The Amman Message names the Ja’fari school among its two Shi’i schools of jurisprudence."; `isl06` likewise with Zaydi. `isl07`/`isl08` keep the general blurb. IDs, parent, notSame notes and undated status unchanged. |
| ABR03 | `jud-ananites`, `ch-early-communities`, `ch-stone-campbell`, `ch-strang-movement` | `emerge`/`when` removed; `undated: true`; source-worded `whenText` kept (the Stone–Campbell text still gives the 31 December 1831 handshake and 1 January 1832 union as the merger episode). `ongoing` not added to any of them. Merger structure and the Jerusalem site on early communities unchanged. The dated Second Temple period is untouched. |
| ABR04 | `ISE07`, `ISE11` | Numeric `when` removed; `whenText`, descriptions, side text and `ref: 'cairo'` kept. Events stay text-dated. |

Engine behaviour relied on: `tree.js` gives an undated node no filter year (`when: null`), and `layers.timeOk` keeps items with no year at every filter setting. Undated nodes are still placed in the By-date chart by their relations, as for the existing undated hubs.

## Checks at ee700d1

- Three new tests run the actual `normTree` + `timeOk` path: the six ABR01/03 nodes have no `emerge`/`when`, are undated with their exact `whenText`, keep their ongoing flag, and stay visible at 101, 801, 1631, 1833, 1848, 1931 and 2000; ABR02 wording and preserved fields; ISE07/ISE11 visible at 942, 1131 and 1500 with their qualified wording. All three fail on the parent's data and pass at this head.
- `pnpm format`, `pnpm check`: 118/118 tests pass; build and format check pass.
- `pnpm test:pages`: 12 pages × 2 viewports pass.
- Browser load of `atlas/?pack=abrahamic-world-religions#book=1&tree=ch-baptist` at 1440×900 and 390×844 (Chromium, software GL): no console errors; the Baptist node shows "Early 1600s". Screenshots: `shots/r1-abr-tree-baptist-1440.jpg`, `shots/r1-abr-tree-baptist-390.jpg`.
- `pnpm test:browser`: not re-run for this data-only change; under software GL it times out in the simulator smoke step (see the Apocrypha round 2 report from the same run).

## Still open

- Q01: the 13 supported coordinate packages are research, not yet implemented pins; 8 unresolved. Not part of this unit.
- Rendered/technical gates and Mckay's release approval.
- ChatGPT: recheck ABR01–04 at `ee700d1`.

No merge, no deployment.
