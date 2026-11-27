# Checkpoint 20 independent review — proposed pilot sidecar

Reviewed 2026-11-07. Exact PR45 head: **5e2639281d267287884a45a28655f1e545a6655d**, parent **133519a2fcdb8c67e8082fa59b6eb340b41b7b5f**. This is a proposed-file format, binding and dry-run review, not fresh per-row canon acceptance.

## Result and evidence

The four-file return adds only checkpoint-20.md and the three tl20 evidence files. No public or src file changes. All four files inspected. The twelve rows preserve the HANDOFF_PLAN pilot's endpoint IDs, direction, existing type/label, limited claims and scope caveats: **11 proposed, 1 deferred, 0 accepted**. Babylon (row 10) remains deferred; the destination's citations do not contain the proposed quoted passage.

Inputs fetched through authenticated GitHub at exact revisions:

| Input | Revision / blob |
|---|---|
| Current Standard Works pack | PR33 3e3701ffcc4131200f0993e52f8f14a509016ced / 3d279a757303e6ae7e80c358a6f6e041269eb82c |
| Pilot-read pack | 4ea873875f73746a754bd537deaaebb1a58d586b / 6918d1bb10697cc026da6a007247d01519f533ca |
| timeline.js | PR45 reviewed head / c9be91170580bbcee9dd9b56a9fa340f0f7bc888 |
| timeline-grounding.js | PR45 reviewed head / 585d92f4968d38ae592876a0f882e78fc8aa420c |
| Proposed JSON | PR45 reviewed head / 61e47a1d4f10ccc949b3f62c809cb7c786fca3a6 |

Independently executed the committed generator with these isolated scratch copies:

```text
node pilot.mjs pinned.js current.js timeline.js timeline-grounding.js out.json
```

Observed **12/12 endpoint snapshots unchanged**, **11/11 recommended rows mechanically eligible**, and row 10 ineligible. Applying the proposed rows returned **0 promoted, 12 rejected, 0 revoked**; the model had **0 grounded edges**. Eleven rejections correctly cite proposed review state; Babylon fails its destination evidence check. Independently regenerated JSON is deeply equal to committed JSON across all twelve rows and the manifest. This is parsed-data equality, not a claim of byte-identical formatting. The committed generator prints the results; the separate deep-equality check asserted the generated artifact equals the submitted one.

Both required supplementary supports (rows 3 and 9) remain separate from primary endpoint containment, proposed, fingerprinted and required. All **17/17 manifest entries** explicitly describe English live pages, unknown immutable edition identity, November 4 inspection and no retained source snapshot/hash. This is honest historical provenance, not evidence that these pages were freshly reopened in this review. Current pack bindings do not turn live sources into immutable editions.

## Limits and next bounded unit

The checkpoint's 153/153 full-suite result is builder-reported here; no new full application, browser, device or assistive-technology run was performed. The earlier independent checkpoint19 tests/CI remain historical evidence, not newly executed tests.

The sidecar format is accepted for proposed evidence. **0/12 rows receive substantive acceptance in this review.** No caller may turn recommendation=accept into state=accepted or silently regenerate approved bindings after changes. Fresh per-row source review remains required before real promotion.

Return to Claude for a bounded host/adapter integration checkpoint on PR45: load and reconcile this proposed sidecar without promoting real edges, preserve existing atlas behavior and chapter gates, and provide actual-host tests for absent/stale/changed sidecars and narrowed read state. If accepted-edge rendering needs a positive control, use clearly synthetic fixture data only; never label a real row accepted to make a demo work. Return the exact head, diff and terminal evidence. This is within the existing timeline build scope, not release authorization.

Host integration, folded-row connector rendering, chapter selection, source/chronology/identity limits, physical-device/AT checks and Mckay's release approval remain open. Source acceptance and technical integration are distinct gates.

**Verdict: checkpoint 20 accepted within proposed-sidecar format and binding scope; hand back to Claude for bounded integration with zero real promotions. No full canon, technical or release approval.**
