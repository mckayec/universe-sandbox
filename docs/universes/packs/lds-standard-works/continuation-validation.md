# Continuation validation — 2026-10-26

Baseline main `cd85ea8dcb36d4d5b54afd5ec05bc03c2c173d79`; final pre-publication fetch unchanged. PR24 review target remains `78eaf99035e618939cab1569936503f55e3d16d0`; this continuation changes no app code or literary verdict.

## Counts and structural checks

- 114 place records, 79 event/reference records, 25 journey records, 46 codex records = **264 content records** across core and supplements. Includes eight G-memo places. These are research records, not 264 fully audited historical facts, or a generated atlas pack.
- **152 source-register entries**, including reused pages and one abstract-only/model source and one publisher-description-only source. This is not 152 independent sources or 152 unique pages. Limits are recorded beside each source.
- Scripted counts, uniqueness within each namespace, all short place-ID references, and all source-key references passed. Supplemental lowercase geography IDs were inspected in their own tables and the BoM reuse list. Table gates are work-level, not chapter-level protection.
- Six modern anchor pairs supplied: Jerusalem and Bethlehem in core; Babylon, Jericho and Philippi in Bible supplement; Winter Quarters visitor center in restoration supplement. New UNESCO degree/minute/second arithmetic passed within0.000001 degrees; NPS prints the Winter Quarters decimal pair directly. These locate present heritage/interpretive properties, not precise supernatural events.
- Source-backed corrections preserved: Genesis/Abraham Haran ages remain distinct; Exodus map uncertainty retained; refugee delegation versus group movement distinguished; Jaredite mountain side trip not treated as group port; D&C121 two-letter origin; D&C137 earlier date than its section order; post-1890 plural-marriage continuation; unknown Melchizedek visitation date; narrative Cumorah not silently assigned to New York.
- Static engine inspection establishes missing-site-coordinate fallback to0,0, per-note lack of filtering, and globally unfiltered codex layer/time behavior. `build-handoff.md` provides safe dispositions without editing the engine.
- `git diff --check` and staged whitespace checks passed. No new full local app build/browser pass is claimed for this docs-only continuation. Earlier PR24 focused Chromium/Node evidence remains in its completed review. Configured Prettier remains absent locally; no formatter success is claimed. Remote CI is to be reported against the actual published head.

## Scope result

Not full research-ready: Bible56 books remain unsurveyed; remaining BoM overview themes and D&C major-section omissions need review; cross-file integration and agreed self-audit are unfinished. These are accessible research tasks, not fabricated access failures. Unknown locations can remain responsibly unlocated. The eventual release requires the ordinary builder/canon/owner gates.

The user authorized a branch push and one draft documentation PR, not merge/deployment or a formal PR24 review. The draft status must remain explicit.

## Content hashes before commit

- `research.md`: `257de26d3713cb935bc372bbf29a745678619b4bf0f96b6c4eecd28b078f0663`
- `geography-evidence.md`: `4b76297269a84ff8dc911557dd2d678d745674525bfe835435aee4452dc1a7e8`
- `bible-inventory.md`: `155a72538b7d9082a0f0a8cfbf2913d3f45cd44f64223d13cb681e33510be9d4`
- `bom-inventory.md`: `70e6e4c7e2708b6973b6b75b010b7dda20a989a363a837471e9d67f9ef9f4cb6`
- `restoration-inventory.md`: `70603d070ec69699a4ec0cac863cc11c3effa058d52c677f4e60a32b686cf558`
- `pgp-inventory.md`: `45653f67ab5c1895521f0dcb2e31678220303bf7ab7e4913261f0b9f6191bfd2`
- `sources.md`: `e76ba840a767b5ab01ab205340ac6980f657e93caaac3c9dfde19ad3b42c2a31`
- `build-handoff.md`: `ebab8fd6fa12eab84ad2d126f65f164709a2c96b403bff0fce95fdd16aa3446e`
