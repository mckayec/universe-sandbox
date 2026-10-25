stage: review
owner: chatgpt
updated: 2026-10-24
note: ChatGPT vets Claude's proposed dependency update before Claude implements it.

# Vite security update: proposal for review

## What `pnpm audit` reports (2026-10-24)
| Severity | Package | Advisory | Vulnerable | Patched |
|---|---|---|---|---|
| high | source-map-js (via vite → postcss) | Event-loop denial of service through indexed source-map section offsets ([GHSA-68fv-2mgg-jv7q](https://github.com/advisories/GHSA-68fv-2mgg-jv7q)) | >=1.0.0 <1.2.2 | >=1.2.2 |
| high | vite (launch-editor) | `fs.existsSync()` existence check bypass on Windows ([GHSA-587h-7wmj-h5pm](https://github.com/advisories/GHSA-587h-7wmj-h5pm)) | >=7.0.0 <=7.3.6 | >=7.3.7 |
| moderate | vite (launch-editor) | `escapeCmdArgs()` omits % escaping on Windows ([GHSA-698v-4r3x-3vcv](https://github.com/advisories/GHSA-698v-4r3x-3vcv)) | >=7.0.0 <=7.3.6 | >=7.3.7 |
| moderate | vite (launch-editor) | Editor CLI flag misinterpretation → command execution for some editors ([GHSA-r825-w8mm-5pxw](https://github.com/advisories/GHSA-r825-w8mm-5pxw)) | >=7.0.0 <=7.3.6 | >=7.3.7 |
| moderate | vite | Files outside `server.fs.allow` could be served on non-Windows ([GHSA-rq7h-c2jc-7f22](https://github.com/advisories/GHSA-rq7h-c2jc-7f22)) | >=7.0.0 <=7.3.6 | >=7.3.7 |
| low | vite | Cross-origin script execution through custom middleware ([GHSA-9jrq-w75r-8gcw](https://github.com/advisories/GHSA-9jrq-w75r-8gcw)) | >=7.0.0 <=7.3.6 | >=7.3.7 |

Production dependencies (`pnpm audit --prod`): no known vulnerabilities. All six are in development tooling.

## Context
- The site is static, built with `vite build` and deployed to GitHub Pages. The live site never runs the Vite dev server, so these advisories affect only the machine where someone runs `pnpm dev` (the owner, Codex, or Claude).
- Current: `vite` `^7.1.3` in `package.json`, resolved to 7.3.6 in `pnpm-lock.yaml`. Latest 7.x is 7.3.7; latest overall is 8.3.5.

## Claude's proposal
1. Update `vite` to `^7.3.7` (patch release in the same major version; no config changes expected).
2. Make sure the lockfile resolves `source-map-js` to `>=1.2.2` (via `pnpm update` of postcss, or a `pnpm.overrides` entry if needed).
3. **Not** moving to Vite 8 now: a major upgrade is a separate change with its own testing, and isn't needed to clear these advisories.
4. Verify with `pnpm audit` (0 advisories), `pnpm check`, and the browser smoke test, then deploy.

## Your review (ChatGPT)
Check the advisories and the Vite 7.3.7 release notes/changelog yourself, then write `review.md` in this folder answering:
- Does 7.3.7 fix all five Vite advisories, and does `source-map-js` 1.2.2 fix the sixth?
- Any breaking changes or risks between 7.3.6 and 7.3.7 for this project (`vite.config.ts` uses only `base: './'`)?
- Is staying on 7.x the right call versus Vite 8 now? If you'd recommend moving to 8, say what would need to change.
- Anything else in `package.json` / `pnpm-lock.yaml` you'd flag.
End with **"Approved as proposed"**, **"Approved with changes: …"**, or **"Not approved: …"**. Commit (Codex, `main`, only this folder), set the header to `stage: ready`, `owner: claude`, today's date, and a one-line note. Append a History line.

## History
- 2026-10-24: Claude wrote the proposal from `pnpm audit`.
