# PR29 review validation

2026-10-27. Exact implementation checkout: `fdc0147ff861f2f12c2773fdcb12d03cdbda70b6` at `/workspace/universe-pr29-head`. Separate documentation worktree: `/workspace/universe-pr29-review`. Implementation checkout has no tracked changes. No browser, local server, live URL, alternate preview surface or rendered/mobile/interactive check was used.

## Executed checks

Initial `node --test tests/galaxy-field.test.ts` could not load `three` because dependencies were absent. Initial npm installation hit an unavailable `/home/agent/.npm` cache directory. Ordinary dependency installation then succeeded with `npm install --cache /tmp/pr29-npm-cache --ignore-scripts --no-package-lock --no-audit --no-fund` (27 packages). No account, security setting or application file was changed. This uses package.json resolution, **not pnpm's frozen lockfile**; local Node was v24.19.0, whereas repository CI uses Node 22.

| Command on exact head | Result |
|---|---|
| `npm run format:check` | Pass; all matched files use Prettier style. |
| `npm run build` | Pass; TypeScript and Vite production build. Existing bundle-size advisory remains; no runtime inference. |
| `npm test` | Pass: 75 tests, 0 failures, including seven galaxy-field/disk-helper tests. |
| `npm run check:dist` | Pass: 110 files; same-origin references resolve, no third-party loads. |
| `git status --short` | Empty after the checks; generated/dependency files ignored. |

These execute the repository's existing script definitions through npm; do not describe them as a completed `pnpm check` invocation. No formatting mutation was needed or performed. Existing unit coverage includes softened-force arithmetic, isolated circular orbits, stride subset selection, tidal-tail response, friction weighting and disk spin/plane helpers. It does not cover the infall save/restore path or certify the rendered shader.

Local logs remain at `/tmp/pr29-format.log`, `/tmp/pr29-build.log`, `/tmp/pr29-unit.log`, `/tmp/pr29-dist.log`. They are not committed. SHA-256 respectively:

```text
756249810b9e1812e43fb44af0a5a39af7ae2dd7d1cdffe61546b6ef66558466
d8227f6b7ca6852a7c96cdefb58ecd35e434957bf0c6663743ff5ecaefba91f9
7b70b30a0ef9c058eee4cf48416d35ac92ebf1ba04b8f4de1a56691310236c68
0152d0acf740389013dc4e577afd55f8e8f028c33c71e9178e23e8b92c4f6a0c
```

Hashes identify these local artifacts; they do not substitute for tests or source-reading evidence.

## Remote evidence

GitHub reports PR29 merged 2026-10-27 03:02:18 UTC, merge SHA `dfb7400c03416ebafe988fbb0a3a828a29e434c8`. Exact-head pull-request workflow [40293179215](https://github.com/mckayec/universe-sandbox/actions/runs/40293179215) reports `head_sha=fdc0147ff861f2f12c2773fdcb12d03cdbda70b6`, completed/success. This was inspected read-only; no run was triggered by this review. Deployment was not inspected or performed in this bounded review.

The builder's reported 20-scene exhibit suite, 12-page/two-viewport browser checks, timing observations and screenshots remain attributed evidence in status.md. The exhibit-stability script itself launches Vite/Playwright; it was read but deliberately not executed under the browser restriction. Its Solar System orbital bounds and merger-tail assertions are useful but cannot prove persistence, all camera angles or mobile sustained performance. The browser smoke timeout's claimed environmental cause remains independently unverified.

## Scientific source access

Opened official NASA Anatomy and NASA TDE visualization bodies; ESA Colliding galaxies and ESA ISO observation report; Porter et al. 2024's author abstract (arXiv:2407.04089). Exact links and claim-level use are in [implementation-review.md](implementation-review.md). The abstract supports separating galaxy merger from later binary coalescence; no full-paper numerical validation claimed. Original Toomre & Toomre PDF retrieval timed out. Gemini's black-hole-pair page returned 403. Neither unavailable source was silently substituted with search-snippet evidence. An older Valtonen paper was accessible but its broad long-lived-binary conclusions were not adopted as current universal results.

## Required follow-up evidence

DAG01 needs state round-trip tests and subsequently permitted interaction verification. DAG02–DAG03 need corrected visible copy, conditional timing tests and a clear model boundary. DAG04 needs either qualified claims or tests of the actual mass/impulse accounting. The implementation review gives exact replacement copy and closure criteria. Desktop/mobile rendering, disk viewpoint stability, touch controls, pause/accelerated-time behavior and save/load interactions remain open. Nothing in this review grants a browser-policy exception or release approval.
