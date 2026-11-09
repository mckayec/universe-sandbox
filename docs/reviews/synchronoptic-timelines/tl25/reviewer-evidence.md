# Independent checkpoint 25 evidence

Run `canon-20261108-051539`; 2026-11-08 UTC. Exact PR45 head `66c80f1f50e44d32bc68c404a4e4addac77e1d57`.

## Unit tests (independent terminal run)

Command: `node --test tests/atlas-timeline-sw.test.ts` with the fetched exact-head source and test file in an isolated local directory. Node24.22.0. Exit0.

Result: tests12; suites0; pass12; fail0; cancelled0; skipped0; todo0.

Passed cases: adapter selection; one record per event/site/route/card; sourced dated-route travel edges; typed see links; chapterOk no-selector fail-closed; books-derived and explicit first-book thresholds; gate through adapter; layerless overview lane; folded undated records/search; chapterCount declarations; chapterPos valid/rejected positions; chosen chapter earlier/current/later book gates.

This is one targeted file, not the full162-test suite.

## Checkpoint24 predicate controls (independent terminal run)

Command: `node docs/reviews/synchronoptic-timelines/tl23-review-predicate.cjs <exact-head-checkout>`.
The reviewer script was read from main (blob `200a7c37f9e8a8cb2f28f87449f0c6881a771058`); the subject probe came from the audited PR head (blob `a3290ef5e9d41f7ee3ddc935c01a64cfab998494`). Exit0.

```text
PASS valid: predicate=true, expected=true
PASS missing: predicate=false, expected=false
PASS extra: predicate=false, expected=false
PASS duplicate: predicate=false, expected=false
4/4 predicate controls passed
```

## Chapter/history transaction (independent terminal run)

Command: `node docs/reviews/synchronoptic-timelines/tl25/reviewer-chapter-history.cjs <exact-head-checkout>`. The probe asserts the engine/model Git blob hashes, extracts their actual host function bodies and calls the registered popstate callback. Rendering, storage, history transport and timeline view are isolated test doubles. Exit1 is the observed regression, not an unavailable test.

Captured output:
```jsonl
{"name":"control: unchanged chapter restores selection","pass":true,"incoming":"#book=1&ch=3&tl=1&tlsel=record-b","chapter":3,"open":true,"selection":"record-b","hash":"#book=1&ch=3&tl=1&tlsel=record-b","writes":[],"restores":["#book=1&ch=3&tl=1&tlsel=record-b"]}
{"name":"changed chapter restores selection","pass":false,"incoming":"#book=1&ch=3&tl=1&tlsel=record-b","chapter":3,"open":true,"selection":null,"hash":"#book=1&ch=3&tl=1","writes":["/atlas/#book=1&ch=3&tl=1"],"restores":[]}
{"name":"control: unchanged chapter opens timeline","pass":true,"incoming":"#book=1&ch=3&tl=1&tlsel=record-b","chapter":3,"open":true,"selection":"record-b","hash":"#book=1&ch=3&tl=1&tlsel=record-b","writes":[],"restores":["#book=1&ch=3&tl=1&tlsel=record-b"]}
{"name":"changed chapter opens timeline","pass":false,"incoming":"#book=1&ch=3&tl=1&tlsel=record-b","chapter":3,"open":false,"selection":null,"hash":"#book=1&ch=3","writes":["/atlas/#book=1&ch=3"],"restores":[]}
{"name":"changed chapter closes timeline","pass":false,"incoming":"#book=1&ch=3","chapter":3,"open":true,"selection":null,"hash":"#book=1&ch=3&tl=1","writes":["/atlas/#book=1&ch=3&tl=1"],"restores":[]}
```
`2/5 behavioural expectations pass (2 controls; 3 changed-chapter cases).`

The script intentionally pins the audited blobs. A corrected-head adaptation must explicitly update the expected hashes after inspecting the new source; retain these failing-head results rather than overwriting them.

## Browser limit

Fresh launch of /usr/bin/chromium via Playwright failed at2026-11-08T05:16:29Z before page creation:
`FATAL:chrome/browser/process_singleton_posix.cc:297 ... socket() failed: Operation not permitted (1)`.
No independent rendered assertions, screenshots or real-input cases resulted. Builder chapter evidence112/112 and pages24/24 remain attributed to Claude.

No external canon claims researched or approved in this implementation-only unit. Real sidecar promotions remain0/12.
