# Validation — bounded checkpoint 1

- Implementation: `f778b6b6fbbeb173763f2a79cd2d8bc0ff0d6f49`; clean detached checkout at `/workspace/universe-deep-head`.
- Main inspected: `971ee9c68e8b54ee73c4e1ae4ee7d19c49e4cb3c`.
- Earlier status target `14f7a52`: diff to implementation head is documentation-only. No application difference across these two targets.
- Prior review baseline: PR36 `d2fd8d9d3656a74f0930a91a665ec0973a58f15b`; prior implementation/event comparison baseline `c91ea29da2328526aff379730042235240ad04bd`.

## Executed checks

Node v24.19.0. No dependency installation, new production build, browser, preview server or alternate rendered surface.

1. Evaluated six pack files in Node VM; all loaded. Existing `validatePacks()` reports zero issues for each of the six production packs. Nonfatal warnings: Cosmere e36/e62 realm-only worlds; Dune terra and Foundation earth missing placement fallback; Hyperion oldearth first=3 versus min(books)=1. These are recorded warnings, not newly resolved findings. Raw `_template.js` identifier warning/issue is handled specially by the existing template unit test; not silently claimed absent.
2. `node --test tests/atlas-packs.test.ts tests/atlas-layers.test.ts`: **17 pass, 0 fail**. This does not run the full application suite. Schema consistency cannot establish narrative chronology or accuracy.
3. `node --check public/atlas/society.js` and `node --check public/atlas/engine.js`: pass (syntax only).
4. `node docs/reviews/deep-worlds/source-checks.cjs /workspace/universe-deep-head`: six era-value checks plus two source-consumer checks confirm the Europa VI clause gate; expected-defect probes confirm delayed entry after downgrade, retained effect state and Bressia orphaned pronoun. Successful script exit **confirms those defects remain**, not an all-clear. Fixtures stop before scene construction; no visual interaction is simulated.
5. Sample CSV: 48 unique sample IDs; per pack five landmark rows and three event rows, with exact current strings, explicit gate metadata, and individual source-limit dispositions. Relative links and staged diff whitespace checked before commit.

Existing exact-head [CI40461916117](https://github.com/mckayec/universe-sandbox/actions/runs/40461916117) reports completed/success. Builder's 82 tests, page tests, 676 Society assertions and screenshots are attributed evidence, not independently rerun in this checkpoint. Final documentation head and its own CI are reported separately after publication.

## Unperformed acceptance

No desktop/mobile/keyboard/actual click/animation acceptance. No full canon or earliest-appearance certification. Most flagged late-book passages remain inaccessible in this checkpoint; no claims based on memory or secondary summaries are promoted. The initial suspected site-dossier era leak was not established and is not a finding. Full-book sampling and Society's expanded captions remain open as quantified in audit.md.

## Checkpoint 2 — 2026-10-29

- Exact implementation remains f778b6b6fbbeb173763f2a79cd2d8bc0ff0d6f49; review parent 5e4f3f3faa17a88b46672436b172f8424093c653; remote PR37/41 freshly fetched, open and unchanged before edits.
- `python docs/reviews/deep-worlds/check-ledger.py /tmp/deep-packs.json`: PASS, 210 unique identities and exact application texts, each pack 20 landmarks/15 events; 202 uncompared, 6 partial/corrective, 2 supported opening narratives. Pack JSON was evaluated from the detached exact-head checkout, not a primary novel source.
- Node comparison of all 90 sampled events to c91ea29: PASS, every record new or changed in world/site/lm/text/book.
- `node docs/reviews/deep-worlds/source-checks.cjs /workspace/universe-deep-head`: PASS as **defect characterization**. Existing Europa checks and three known defects retained; new actual `lmOk` isolation confirms DW07 at book I with other filters eligible. Passing this script means the documented defects reproduce, not that implementation is safe.
- `node --check docs/reviews/deep-worlds/source-checks.cjs`: PASS. `git diff --check`: PASS after normalizing CSV line endings.
- No application changes; prior 17 targeted unit-test results remain valid for unchanged implementation, not rerun merely to generate activity. No new build or full-suite success claimed.
- Formatting attempt `pnpm exec prettier --write` for changed Markdown/CJS failed before formatting: ENOENT creating `/home/agent/.local/share/pnpm` during pnpm's automatic dependency setup. `pnpm --version` alone succeeded (11.25.0). No dependency installation or alternate execution surface used to bypass a denial. Formatting remains unverified; whitespace and syntax checks above are actual results.
- Browser/server/rendered/mobile/keyboard acceptance remains prohibited and unperformed. No screenshots, live previews, formal approval, merge or deployment.
