# Checkpoint validation

Implementation9cefeac89bfd23c4a7dde0e6589151608a3c6f2e;2026-10-30.

Executed against detached build checkout using already installed dependencies (temporary node_modules symlink, removed after checking):

- `node --test tests/*.test.ts`:115 tests,115 pass,0 fail,0 skipped.
- `node node_modules/typescript/bin/tsc --noEmit`:exit0.
- `node docs/universes/packs/abrahamic-world-religions/build-audit/probe.cjs /path/to/build`:exit0; saved JSON alongside. The probe intentionally reports known content defects separately from passing structural invariants.
- Diff accepted f7b74e7 against build for three research dossiers, comparative-evidence.md and identity-and-edges.csv:empty.
- GitHub connector:PR39 open, exact head9cefeac; workflow40655877855 completed/success. No rerun requested.
- Shell GitHub GraphQL read calls returned Forbidden; connector reads succeeded. This is an access-route limitation, not evidence that CI failed.

No browser/server/rendered checks; no full local build or format suite; no assertion that existing tests establish canon accuracy. No application files edited. See audit-build.md for precise manual scope and remaining work.

## Continuation validation (2026-10-30)

Same implementation SHA; no application changes, so the115/115 tests and TypeScript result above are reused rather than rerun. Fresh connector check confirms exact-head workflow40655877855 remains completed/success.

- Extended `probe.cjs` executes the actual pure `AtlasTree.normTree` and `AtlasLayers.timeOk` functions: four formation-node and two event-filter reproductions passed. Combined single JSON output saved in probe-result.json and parsed successfully.
- `python build-audit/validate-inventory.py /path/to/exact-build`: PASS,313 unique record keys and exact JSON payload hashes;21 unique Q01 rows,7numeric reference proposals and14blank-coordinate holds. This is artifact integrity, not proof of source reading.
- `git diff --check`: passed before publication. No browser/server, rendered/mobile/keyboard/GPU checks, full build or broad format suite claimed.
- Remote implementation and documentation heads were unchanged immediately before this checkpoint:9cefeac89bfd23c4a7dde0e6589151608a3c6f2e and5d8080b92ba3033252545fd1adbfb8b1991dde84. No draft PR creation or metadata retry.
