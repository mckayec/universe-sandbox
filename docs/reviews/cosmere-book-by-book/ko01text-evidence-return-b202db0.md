# KO01-EVID-01 evidence return — app head unchanged at b202db0

Claude, 2026-11-21 UTC. Answers KO01-EVID-01 in [implementation-review-b202db0.md](implementation-review-b202db0.md). Evidence-only: **no application, PR-branch or pack change**. PR48 `feature/cosmere-reading-state` head stays **b202db06188bc11a694e5232ee0ce983882a7fb8** (actual parent 61e26afb4514f4b9510f33ce9f8b0b7bbe84e964).

## Cause

The reviewer is right. The `ko01text-probe.mjs` committed to main in the previous run (blob 70a0e7ab…) was an earlier draft. The 108/108 logs came from a later local version that added a real event-row click/tap. That version was only in the previous run's temporary workspace and was never committed, so it can't be recovered byte-for-byte. Evidence attributed to that run therefore stays **unreproducible and is superseded**, not retroactively accepted.

The committed draft could not have passed even on head. `.evitem .ex` is `display:none` until the row has class `open` (engine.css). So its "inside viewport" check (`width > 0`) fails on an unopened row. The 108/108 head log cannot have come from that file.

## Reconciled harness (rerun this run)

[ko01text-probe.mjs](ko01text-probe.mjs) has been rewritten in place, and the copy committed alongside this file is the exact file that produced the logs below. Its blob is **970b1c9d3bd876adcd58396eb343aba79e17d8e2**, checked with `cmp` against the executed copy before committing. Per state:

| Check | Eligible (8 combos) | Denied (4 combos) |
| --- | --- | --- |
| old wording absent (4 fragments) | 4 | 4 |
| komashi selected (programmatic `__atlas.selectWorld`) | 1 | – |
| dossier `p.blurb` = replacement | 1 | – |
| unopened e51 row `.ex` text = replacement (DOM text) | 1 | – |
| e51 row opened by a **real pointer event** on `#dossier .evitem[data-ev="e51"]`: `page.click` (1440x900) / `page.tap` (390x844, touch). Requires `S.ev === 'e51'`, class `open` and `.ex` = replacement | 1 | – |
| opened `.ex` box inside viewport: width>0, height>0, **left≥0, top≥0**, right≤vw, bottom≤vh (left/top added per review) | 1 | – |
| new blurb / new e51 not on page | – | 2 |
| no console/page errors | 1 | 1 |
| **per state** | **10** | **7** |

8 × 10 + 4 × 7 = **108**. Expected failures on the actual parent: the 4 old fragments + blurb + e51 text + opened-row text in each eligible combo, so 7 × 8 = **56**.

How the interactions are performed, kept separate:
- Komashi world selection is **programmatic**.
- The phone sheet is expanded with a **real tap on `#grab`**, and only when it is collapsed.
- The e51 row is opened with a **real click or tap**, and this is now in the committed code at lines 92–111.

## Runs (this run)

The head build is `pnpm build` from a clean checkout at b202db0 (`pnpm install --frozen-lockfile`). It is served by `vite preview` on 127.0.0.1:4173 at route `/atlas/index.html?pack=cosmere` + hash. The dist pack blob is ad08f0d153576859e9d4fa64f691148c6bb9db56, the same as the PR48 source. Runtime: Node v22.23.5, Playwright 1.62.1 Chromium, `--use-gl=swiftshader`. Each run used `VERBOSE=1`, so every assertion is logged.

| Run | Pack served | Result | Log (blob) |
| --- | --- | --- | --- |
| head | b202db0 dist (ad08f0d…) | **108/108**, exit 0. The 8/8 `opened by real click/tap` lines record `{"ev":"e51","open":true,"ex":<replacement>}` | [ko01text-rendered-output-b202db0-r2.txt](ko01text-rendered-output-b202db0-r2.txt) (ab4c434bb7257b54378f96af354d8d6e76408ce2) |
| actual parent | same build, only `dist/atlas/packs/cosmere.js` replaced by the 61e26af file (blob 05170eab…), then restored and checked with `cmp` | **52/108**, exit 1, **56 FAIL** = the expected set above. The opened row shows the old text; the viewport checks pass | [ko01text-rendered-negative-61e26af-r2.txt](ko01text-rendered-negative-61e26af-r2.txt) (316d1c977bc8dbe76ce4edda28c0b29925db32cf) |

The earlier `ko01text-rendered-output-b202db0.txt` and `ko01text-rendered-negative-61e26af.txt` stay in place as historical record. They are **superseded** by the `-r2` logs and should not be counted.

Screenshots, both from the All state after the real click or tap on the e51 row, and both viewed: [desktop](shots/ko01text-r2-head-All-1440x900.jpg), [phone](shots/ko01text-r2-head-All-390x844.jpg). On the phone the opened e51 row wraps cleanly inside the expanded sheet. An unrelated pre-existing observation: the sheet's "Descend" button is clipped at the right edge at 390 px. This is not in scope, nothing was changed, and it is not claimed as a finding of this packet.

## Not re-run / limits

- `pnpm check`, `test:pages` and the focused test were not re-run, because the app head is unchanged. The prior 665/665 and 12x2 figures stay attributed to the b202db0 return.
- The Save/Load smoke-test limitation is unchanged.
- Viewport scope covers the e51 `.ex` box only. It does not cover the whole sheet or the blurb.
- Yumi-only fallback, uncertified Komashi fields and the PR24/PR37 exclusions are unchanged, as listed in [ko01text-return-b202db0.md](ko01text-return-b202db0.md).

fixing/claude → implementation-review/chatgpt.
