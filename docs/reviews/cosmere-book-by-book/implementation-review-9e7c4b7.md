# Implementation review — AU01-ORDER-01

Reviewed 2026-11-21 UTC by ChatGPT.

**Accepted for the finite ordinal correction at PR48 `9e7c4b7b7d418f675143b017f78f1bd02bc5728e`.** This is source/data acceptance, not a full AU01 canon sign-off, independent browser certification, PR approval or release approval.

## Revision and evidence

- Branch: `feature/cosmere-reading-state`.
- Actual parent: `057721011d6b0ba676ab957540b044241681382d`.
- GitHub comparison contains **2/2 files inspected**: `public/atlas/packs/cosmere.js` (+2/-2) and `tests/atlas-au01-order.test.ts` (155 added lines).
- Head pack blob: `777cee0693d5f9443766e720d8248dae6cf07a2c`; parent: `2b8b9ccbfdca6ce47e8fc627e3fce9c416fbec43`.
- Test blob: `07f36453c4e8323f145fd4506570f2d84ff64eab`.
- Actual selector inputs: engine `0bc5357a2043f3939512bc5b091eb4ffbbf1c5d0`, reading.js `4d9bc177294e5e33accf6f19825ef467f0bb90d4`.
- Read [requested correction and source limits](au01-checkpoint-1-2026-11-21.md), [builder receipt](au01order-return-9e7c4b7.md), full new test, rendered probe and both supplied logs. Canon source evidence remains the preceding research checkpoint's attributed chart inspection; no fresh essay reading is claimed by this implementation review.

Intake: **18/18 pack statuses and 8/8 review statuses** inspected on current main. No eligible parallel research-ready/claude self-audit; agreement active with both signatures. Other owners and WIP holds unchanged.

## Independent verification

Node v24.22.3 executed the supplied focused tests against files fetched at the exact head: **2/2 passed**. Its baseline is synthesized by reversing the two expressions, so I additionally ran the same tests with `parentSrc` replaced by the separately fetched actual parent file. **2/2 passed against that actual parent**. These are two executions of the same two tests, not four distinct coverage cases.

Separate exact-source comparison confirmed that reversing precisely the two `(i + 4)` expressions reproduces the actual parent file byte-for-byte. The API diff confirms no other application file changed.

| Check | Result / scope |
|---|---|
|Requested expressions|2/2 changed, lines385 and389; i+1 index unchanged.|
|Ordinal fields|20/20 correct across10/10 records: jes4, nan5, chach6, vev7, palah8, shash9, betab10, kak11, tanat12, ishi13.|
|Whole-data preservation|1/1 equality after restoring those twenty values to their parent values. Thus CA01 weather/destination removals and all other parsed fields persist unchanged.|
|Actual selectors|80/80 world-state comparisons (10 giants ×8 states) preserve hidden flags and blurbs; visible status/facts change only by the ordinal.|
|Visible states observed|All, legacy7, bucket7 and all works:10/10 giants in each.|
|Hidden states observed|legacy6, AU01-only, bucket7-minus-AU01 and none:0/10 giants in each, unchanged from parent. This retains existing whole-bucket fallback; it does not certify fine-grained AU01 gates.|

Execution output from the actual-parent run:

```
AU01-ORDER visible states All 10/10, legacy7 10/10, bucket7 10/10, all works 10/10
tests 2
pass 2
fail 0
cancelled 0
skipped 0
todo 0
```

Reproduction: fetch the five pinned files above into matching relative paths, save the actual parent pack as `parent.js`, and run the committed test with Node's TypeScript stripping. For the second run replace only its `const parentSrc = packSrc.replace(...)` initializer with `const parentSrc = read('parent.js');`. No repository or PR code was edited for these checks.

## Builder/browser and CI evidence

The inspected probe tests dossier status and Order facts, absence of the old ordinal, visibility and console/page errors at two viewports. Recounted supplied log lines:
- [Head log](au01order-rendered-output-9e7c4b7.txt), blob `a03758664d3918ddf9fa6ed23248e7bc06f49634`:454 success lines,0 failures.
- [Parent log](au01order-rendered-negative-0577210.txt), blob `b22ad3cdf71127ca86714b7a6a329e0c7d08eaa3`:214 successes,240 failures. Expected failure denominator is3 ordinal assertions ×10 worlds ×4 visible states ×2 viewports =240.
- [Probe](au01order-probe.mjs), blob `980d2986e5214f50dd63eacd5502a3f67d123315`, inspected. These are reconciled **builder executions**, not my browser runs.

Independent Chromium launch failed before page creation: Playwright's expected `chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell` executable is absent. **0 independent rendered cases;0/4 supplied screenshots independently viewed**. No visual/layout approval is claimed. Builder's noted phone Descend-label clipping remains an attributed, untouched limitation.

[Exact-head CI run44878037328](https://github.com/mckayec/universe-sandbox/actions/runs/44878037328) reports success for format, build, tests, distribution checks and standalone-page checks; its deploy job was **skipped**. CI observation is not a local full-suite rerun. The builder reports671/671 tests and12 pages ×2 viewports. Its separate `test:browser` Save/Load timeout at line88 remains failed; this review neither fixes nor independently establishes the failure's historical cause.

## Disposition and next action

| Finding | Disposition |
|---|---|
|AU01-ORDER-01, Medium|Closed at this exact head for the two expression edits/20 resulting values. No unresolved defect found in that finite patch.|
|Broader AU01|Incomplete. Previously1/6 essays and2/6 system-chart images opened; no new research coverage earned here.|
|Gate/visual/full-suite limits|Preserved as above; not converted to a pass.|
|CA01|Prior finite closures preserved; full CA01 deferred at2/2.|

Return to **research/owner chatgpt for AU01 unit2/2**, following the previous checkpoint: remaining essays/maps, parent/codex provenance, earliest-work attribution and finite dispositions at the cap. Do not reopen the unchanged ordinal correction. No full-work approval (**0/33**), merge, deployment or decision on Mckay's behalf.
