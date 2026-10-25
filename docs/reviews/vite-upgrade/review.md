# Vite security update review

Reviewed 2026-10-24, America/Denver. Proposal review only; no dependencies or site code changed.

## Evidence inspected

Read package.json (blob fe52307b97e9ff9b59b8c834b671ea827c7cb11f), pnpm-lock.yaml (0c8a6d0b027489e8a935cba607ee54f37a9e24d8), vite.config.ts (d6f081e68e864f750f07a66eab2b6a6e7c257149), all six upstream advisories, and the tagged Vite 7.3.7 changelog. The lockfile actually resolves Vite 7.3.6 and source-map-js 1.2.1 via PostCSS 8.5.26.

## Advisory verification

| Advisory | Finding | Patched version verified | Decision |
| --- | --- | --- | --- |
| [GHSA-587h-7wmj-h5pm](https://github.com/advisories/GHSA-587h-7wmj-h5pm) | Windows existence-check bypass in launch-editor | Vite 7.3.7; bundled launch-editor 2.14.2 | Update |
| [GHSA-698v-4r3x-3vcv](https://github.com/advisories/GHSA-698v-4r3x-3vcv) | Windows percent expansion/escaping | Vite 7.3.7; launch-editor 2.14.2 | Update |
| [GHSA-r825-w8mm-5pxw](https://github.com/advisories/GHSA-r825-w8mm-5pxw) | Editor argument interpreted as a command/flag | Vite 7.3.7; launch-editor 2.14.2 | Update |
| [GHSA-rq7h-c2jc-7f22](https://github.com/advisories/GHSA-rq7h-c2jc-7f22) | Non-Windows file-allow boundary bypass | Vite 7.3.7 | Update |
| [GHSA-9jrq-w75r-8gcw](https://github.com/advisories/GHSA-9jrq-w75r-8gcw) | Custom middleware cross-origin script execution | Vite 7.3.7 | Update |
| [GHSA-68fv-2mgg-jv7q](https://github.com/advisories/GHSA-68fv-2mgg-jv7q) | Indexed-source-map offsets can block the event loop | source-map-js 1.2.2 | Update transitive dependency too |

All six proposed minimum fixed versions are supported by the upstream advisories. This is not a fresh pnpm audit result and does not establish that no other advisories exist.

## Compatibility and risk

The [7.3.7 changelog](https://github.com/vitejs/vite/blob/v7.3.7/packages/vite/CHANGELOG.md) lists three fixes: launch-editor 2.14.2, removal of queries from the filename supplied to transformIndexHtml, and using resolved IDs for safeModulePaths. It announces no breaking migration. With only base: './' in this project's configuration, no configuration edit is indicated. That is a low-risk assessment, not a test result.

The source-map-js [1.2.2 release](https://github.com/7rulnik/source-map-js/releases/tag/v1.2.2) explicitly fixes the malicious indexed-map denial of service and a browser CSP issue.

The static GitHub Pages deployment does not run Vite's development server. The current dev script binds 127.0.0.1, and the simple configuration does not use the custom middleware setup in the low-severity advisory. These reduce applicability of particular exploit paths; they do not justify ignoring patches. In particular, source-map processing can occur in builds/CI as well as development. "Only pnpm dev is affected" is too narrow, and "the live site has none" overstates what a production-dependency audit proves.

## Stay on Vite 7 for this patch

Accept deferring Vite 8. The [official migration guide](https://vite.dev/guide/migration) documents a switch from Rollup/esbuild to Rolldown/Oxc, changed defaults and interop behavior, and a newer default browser baseline. Those expand regression scope without being necessary to fix these six advisories. A future Vite 8 change should separately review browser support, bundling/minification and module behavior, then test the Three.js application, static atlas assets, nested Pages paths, mobile rendering and production output. No current need for an 8.x migration was found in the inspected configuration.

## Required implementation changes and checks

1. Change the manifest's Vite range to ^7.3.7 and regenerate the lockfile using the project's intended pnpm version. Keep the update targeted; avoid an unrelated blanket dependency refresh.
2. Ensure every reachable source-map-js resolution is at least 1.2.2, preferably through a compatible transitive refresh. Inspect the actual dependency tree and lockfile; merely running an update command is not proof. Use a documented narrow override only if normal resolution fails, and retain a reason/removal condition. Do not add a runtime dependency just to force this fix.
3. Commit manifest and generated lockfile together. Verify a clean frozen-lockfile installation, then record pnpm audit (full and production), pnpm format, pnpm check, and pnpm test:browser results. An audit service/network failure is not a clean audit. The six listed advisories must be absent; evaluate any newly reported advisory rather than hiding it.
4. The current check script does NOT include test:browser; run it explicitly. Check the built preview and relative asset loading under a nested Pages path, plus laptop and phone views. Record Node/pnpm versions and the tested commit.
5. Follow the repository release process: implementation PR, checks, Mckay's approval, then merge/deploy and verify. This review is permission to implement the proposal, not Mckay's release approval.

## Other manifest / lockfile observations

- three and @types/three both resolve to 0.180.0; no mismatch is evident.
- No engines or packageManager pin is present in package.json. The locked Vite engine requirement is ^20.19.0 or >=22.12.0; tests directly run TypeScript with node --test tests/*.test.ts. Use the existing tested CI runtime consistently and consider documenting/pinning it separately. Do not assume every Node version satisfying Vite also runs these tests identically.
- Playwright is exactly pinned to 1.62.1. Ensure its matching browser binaries are installed in the validation environment; do not upgrade it incidentally.
- The lockfile's optional platform packages are not automatically shipped browser code. Presence alone is not a security finding.
- format and format:check cover src and tests, not these review Markdown files.
- I did not run install, audit, build or browser tests in this review session; node/pnpm are unavailable on the local PATH and no project checkout was used. Claude must supply those implementation results.

## Verdict

**Approved with changes: keep the Vite 7.3.7 and source-map-js 1.2.2 minimum targets, update dependencies narrowly, correct the dev-server-only risk statement, record clean-install/audit/build/browser evidence, and retain Mckay's approval before deployment.**
