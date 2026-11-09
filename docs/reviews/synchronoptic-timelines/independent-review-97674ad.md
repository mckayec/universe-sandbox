# Independent checkpoint 27 review — 97674ad

2026-11-08 UTC. **Folded-row implementation accepted within the inspected source/model scope; rendered geometry remains unverified. Return to implementation / claude for the finite TL27-E1 evidence correction.** No final canon, full technical or release approval.

## Target and scope

PR45 `engine/timelines`, exact head **97674adb29a88745ddf56c9ea3b7f0cf46093887**, parent **4d022abe9fd2f525395736e041f9547c1479e9ec**. Read PR metadata, cumulative PR diff and the actual parent delta: **7/7 changed text files** (checkpoint, probe, output, CSS, model, view and tests). **0/2 JPGs visually inspected**. This bounded review does not re-certify the cumulative 193-path PR.

Current-main intake covered **25/25 pack/review statuses**. This was the sole owned handoff. The **15/15** research/source/research-review/audit/addendum blobs across Hierarchy, Licanius and Narnia match main 57002ba10a1cce07141d2e63818d2206376270b8, so no stale parallel self-audit was identified. Agreement remains active with both sign-offs, unchanged. Deep-worlds is Claude-owned; existing owner decisions remain with Mckay.

## Implementation assessment

- `connectorEnds` gets only `V.drawnEdges`, after record and edge gates and source eligibility. A dated collapsed endpoint uses its lane's summary Y; an expanded endpoint keeps its own row. Both ends folded in the same lane are counted as inside, not drawn. Undated endpoints remain off-chart. Self edges are excluded.
- The view builds `foldY` from `x.sumY`; `summary()` renders the summary bar centered at the same value (rect y = cy − 5, height 10). This is direct source evidence of correct wiring, not an independently observed render.
- Folded flags drive open rings and the explanatory title; relationship wording/type and undated gutter placement remain intact. Overview counts use the resolved links and inside count; statistics reset on render.
- No pack, sidecar or source file changed in this delta. **0/12 real pilot relationships promoted or newly substantively accepted.** No fresh source-based canon certification was attempted.

## Finding and bounded return

**TL27-E1 — Low, evidence false positive; no reproduced application defect.**

The browser probe's assertion named “folded ends on the summary row” does not read summary-row geometry. `read()` records only the number of summaries; the predicate compares ring.cy to path.ya/yb and checks expanded ends against their rows. A ring and folded connector shifted together by one row still pass.

[Reviewer characterization control](tl27/reviewer-predicate-control.cjs) executes the exact per-lane predicate extracted from the pinned probe, against explicitly synthetic snapshots:

| Control | Existing predicate result | Expected characterization |
|---|---|---|
| Correct folded end and ring at summary Y=100 | accepts | passes |
| Folded end and ring both at126, summary remains100 | **accepts incorrectly** | false positive confirmed |
| Ring alone shifted to126 | rejects | passes |
| Expanded end shifted by26 | rejects | passes |

**4/4 characterization controls reproduced**, including the false positive. This is not four browser passes.

Claude's next bounded unit: read each collapsed lane's actual `.tl-sum-bar` center keyed by its `data-lane-t`; require every folded path endpoint and ring to match that lane center in the same SVG coordinate space. Add a negative control moving the ring and connector together off that center and prove rejection. Retain single-lane cases, existing gates, undated exclusions and history regression. Rerun the corrected browser probe at1440/390 and return exact SHA plus logs. No application rewrite is requested unless that check reveals a real mismatch.

The “Overview note matches” predicate currently checks phrase presence, not numeric equality. Its current pass supports note presence only; either narrow that label/report or compare the displayed folded/inside counts. This is a qualification of the same evidence return, not a separate application defect.

## Independent execution and reproducibility

Node **v24.22.1**, isolated copies fetched from the exact PR head:

```text
node --test tests/atlas-timeline.test.ts
tests 14; pass 14; fail 0; skipped 0

node reviewer-predicate-control.cjs
PASS valid synthetic geometry; predicate=true
PASS connector and ring both 26px off summary: existing predicate ACCEPTS; predicate=true
PASS ring alone wrong: existing predicate rejects; predicate=false
PASS expanded end wrong: existing predicate rejects; predicate=false
4/4 characterization controls
```

The14 tests include all3 new folded-connector tests: real-pack expanded9-ID equivalence, each single lane collapsed with conservation and endpoint checks, and labelled synthetic book/chapter/layer downgrades. No real chapter-gated relationship is inferred from the fixture.

**9/9 local input blob hashes independently matched GitHub** after copying exact fetched bytes; tests were rerun after that verification. Initial scratch copies had an extra trailing newline from patch creation; this was corrected before the recorded exact-byte run.

| Input | Git blob SHA |
|---|---|
| `public/atlas/timeline.js` | `12c54465452020cc859b652caaca73e04f9241db` |
| `public/atlas/timeline-view.js` | `c7fff98625e790367775616deb5cf50cdc89defd` |
| `tests/atlas-timeline.test.ts` | `df75a20c71b59f01d645e5501516955f4deafade` |
| `public/atlas/packs/abrahamic-world-religions.js` | `84f0f6895e53b366d883daadabb800af0bc1501e` |
| `public/atlas/packs/abrahamic-world-religions/judaism.js` | `d2e3500d5cd98417596d102ab471c7abe9d71919` |
| `public/atlas/packs/abrahamic-world-religions/christianity.js` | `78071abd2b87b63a622a91ff7f09a99d358b2a3c` |
| `public/atlas/packs/abrahamic-world-religions/islam.js` | `aa23bdfa31feb127c23bb1129bc747fcc94120c9` |
| `public/atlas/packs/abrahamic-world-religions/encounters.js` | `dada62215ed20f8d148e46b36d0697f19353201e` |
| `public/atlas/packs/abrahamic-world-religions/relationship-sources.js` | `1c63d351baf831a86e2a74fca4ab407f80334ff5` |

Fresh Playwright launch with `/usr/bin/chromium`, headless and `--no-sandbox`, failed at **08:18:24 UTC**, before page creation:

```text
browserType.launch: Target page, context or browser has been closed
FATAL:chrome/browser/process_singleton_posix.cc:297
socket() failed: Operation not permitted (1)
```

**0/63 browser assertions independently executed.** No screenshot, rendered geometry, device or AT pass claimed. Full `pnpm check`, page smoke and history browser suites were not independently rerun in this bounded review.

## Builder evidence and remaining limits

The committed output independently reconciles to **63/63 recorded passes**, zero logged errors, at1440/390. These are builder observations, subject to TL27-E1. The real-pack Islam-off check leaves the same7 connectors and is correctly disclosed as weak; the meaningful gate removal control is synthetic. Builder reports165/165 full checks,12 pages ×2 viewports and38/38 history regression; those remain attributed reports.

Carried limits remain: O-1 same-document layer restoration; TL22-E2 real input/focus and1440 click timeout; real close→chapter change→reopen path; mobile1714-row performance; device/AT; chapter gates outside the timeline; PR33 integration; full technical qualification and Mckay release approval. The source/model portion is accepted without reopening those unrelated units. Save this review before the status handoff; next owner is Claude.
