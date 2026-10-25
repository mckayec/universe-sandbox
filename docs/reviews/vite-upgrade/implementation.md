# Vite security update: implementation evidence

- **Pull request:** #20, branch `fix/vite-security`, commit `9236552` (rebased 2026-10-25 onto `main` at `85b2182`, after the audit fixes #19 and #21–#23 merged; originally `3b2cd7b` on `ddf8bc9`).
- **Environment:** Node v22.23.4, pnpm 10.28.0, Linux; Chromium (Playwright build 1243) with SwiftShader software rendering.

## What changed (narrow, as reviewed)
| File | Change |
|---|---|
| `package.json` | `vite` `^7.1.3` → `^7.3.7` (only line changed) |
| `pnpm-lock.yaml` | vite 7.3.6 → 7.3.7; source-map-js 1.2.1 → 1.2.2 (resolved through postcss). 10 lines changed, nothing else |

`pnpm why source-map-js` shows a single resolution, 1.2.2. A normal transitive refresh (`pnpm update source-map-js`) was enough, so no `pnpm.overrides` entry was added. No runtime dependencies were added. Vite 8 is deferred, as agreed.

## Checks
| Check | Result |
|---|---|
| Clean frozen install (`rm -rf node_modules && pnpm install --frozen-lockfile`) | OK |
| `pnpm audit` (full) | **No known vulnerabilities found** (was 6: 2 high, 3 moderate, 1 low) |
| `pnpm audit --prod` | No known vulnerabilities found |
| `pnpm format` | No changes beyond the two files above |
| `pnpm check` (format check + type-check + build + 41 unit tests) | Pass, 41/41 |
| Built preview, scripted scenario (place Our Solar System + spiral galaxy, 10× speed, fit view) | 29 objects, **0 page/console errors**; identical to the pre-update build |
| Nested GitHub Pages path (`dist` served under `/universe-sandbox/`) | `/`, `assets/`, `atlas/`, `exoplanets/`, `powers/` all 200; assets referenced relatively (`./assets/…`) |
| Laptop 1280×800 and phone 390×844 (touch, DPR 3) | Load fine, 4 starting objects, 0 errors; layout unchanged from current live site (`shots/laptop-phone.jpg`) |
| `pnpm test:browser` | **Pass** on the rebased commit (idle machine). The earlier timeouts happened on unchanged `main` too, under heavy machine load. |
| `pnpm test:pages` (12 standalone pages × desktop and phone, under `/universe-sandbox/`, fails on errors, 404s or third-party requests) | Pass, 24/24 (rebased commit) |
| `pnpm check` on the rebased commit (now includes `check:dist`) | Pass: 59 tests; 109 files resolve, no third-party loads |
| `pnpm audit` on the rebased commit | No known vulnerabilities found |

## Risk statement (corrected per review)
The six advisories are in build and development tooling, not in code shipped to visitors (`pnpm audit --prod` is clean). That narrows the exposure but doesn't make it zero: the dev server (`pnpm dev`, bound to 127.0.0.1) was exposed to the five Vite issues, and source-map processing can run during builds and CI, which is where the source-map-js denial-of-service applies. Both are patched by this change.

## Next
All checks now pass. ChatGPT reviews this evidence and the PR diff → Mckay approves → Claude merges and confirms the deploy.
