# Religious Traditions — exact-head build audit checkpoint

2026-10-30 · ChatGPT · **Changes requested; audit remains open.** This is a bounded source/structural checkpoint, not full content, rendered, or release approval.

- Implementation: PR39, `9cefeac89bfd23c4a7dde0e6589151608a3c6f2e` (`pack/abrahamic-world-religions`), verified open and unchanged.
- Accepted research: `f7b74e7bec5b75a9e83666e6fd873f1f21630d0f`. The three research dossiers, comparative evidence and identity register have no diff against that revision in the inspected build.
- Review branch: `docs/abrahamic-build-audit-20261030`, based on main `13520d5`. Build report/status on main explicitly assigns this build to ChatGPT. Search of relevant GitHub PRs returned research PR30, engine PR28 and build PR39; no duplicate build audit found.
- Scope: all seven flagged builder readings, Q01–Q07 dispositions, all four data parts' structural counts and cross-reference invariants, date-window inventory, and relevant generic engine source/unit tests. The initial checkpoint left copy-by-copy conformity open; the continuation below now accounts for313/313 built records, with four findings and explicit source-access limits. Prior research acceptance is reused, not represented as fresh source reading.

## Findings ready for builder

| ID | Severity | Exact-head location | Finding and evidence | Concrete correction / acceptance | Resolution |
|---|---|---|---|---|---|
| ABR01 | Medium | `public/atlas/packs/abrahamic-world-religions/christianity.js:211,234`; `ch-baptist`, `ch-pentecostal` | `emerge:[1601,1630]` and `[1901,1930]` convert “Early 1600s/1900s” into invented bounds. The tree uses the numbers for placement/filtering; displaying vague wording does not erase the numeric assertion. Accepted Christianity dossier and Q02 supply no 1630/1930 boundary. WCC Baptist account identifies 1609 and 1612 episodes, not a 30-year formation window. | For both nodes remove `emerge`, set `undated:true`, keep `ongoing:true` and existing `whenText`. Keep separately sourced dated events. Do not replace with another guessed cutoff. Add assertions that neither node supplies numeric emergence bounds without new source evidence. | Open |
| ABR02 | Medium | `public/atlas/packs/abrahamic-world-religions/islam.js:157`; helper generating `isl05`–`isl08`, especially `isl05/06` | Relation says “legal school named in the Amman Message (no further classification given)”. Point 1 explicitly identifies Ja'fari and Zaydi as the two Shi'i schools in its list. The source has supplied further classification. | Keep broad Islam parent if desired; replace shared relation with **“legal school named in the Amman Message”**. Set `isl05` blurb to **“The Amman Message names the Ja’fari school among its two Shi’i schools of jurisprudence.”** Set `isl06` likewise with **Zaydi**. Preserve distinct tradition/school IDs, notSame notes and undated status. Do not imply this statement exhausts Islamic classification or adjudicates legitimacy. | Open |

ABR01 affects two nodes; ABR02's misleading shared label occurs on four nodes, with the source contradiction directly demonstrated for two. These are **two findings**, not six independent errors.

## Seven builder readings: 7/7 dispositions

| Flag | Built IDs / relation | Disposition and evidence |
|---|---|---|
| 1 Evangelical overlap | `ch-evangelical`; five Anglican/Lutheran/Reformed/Baptist/Methodist overlap links | Accept as selected, nonexclusive overview links, not exhaustive affiliation census. WCC describes a changing term across Protestant and Anglican institutions. Neither missing Anabaptist link nor five selected links establishes absence elsewhere. Preserve cross-cutting wording; do not add an unsupported exhaustive claim. |
| 2 Ahmadi identity | `ism01`, `ISE15` | Self-identification and state classification remain separate and attributed. Official Community paragraph supports self-name and 1889. Pakistan1974 wording conforms to accepted IS24 research; fresh USCIRF retrieval was403, so this is **reused accepted evidence**, not a new PDF verification. No theological verdict adopted. |
| 3 Sufism | `isc01` parentType overlap | Accept. Harvard Pluralism's Sufism paragraph describes a devotional stream rather than sect. No exclusive fourth branch or additive membership inferred. |
| 4 Legal schools | `isl05`–`isl08` | ABR02. Broad parent can stay; source claim must be corrected. |
| 5 Dara comparison | `hindu-philosophy` contact tie to `isc01`; `dara-shikoh` person; XE03/XE04 | Accept **only with existing actor/work/date/disclaimer retained**. Iranica's Majmaʿ paragraph supports authored comparison in1655; translation paragraphs distinguish1657 and disputed personal Sanskrit contribution. This is scholarly evidence, not manuscript verification. Compressed tie is not proof of generic Hindu-to-Islam influence, ancestry or doctrinal identity. Sikh/Bahá’í need no invented tradition ties to compensate for geographic crosswalk edges. |
| 6 Period conversion | all19 `emerge` entries inventoried in probe result | ABR01 for two arbitrary early-century windows. Seventeen others are full-century/range representations; inventory is not certification of every historical claim. Rabbinic/root hubs remain undated. Full centuries are display encodings, not founding-day or extinction claims. |
| 7 Bahá’í repetition | `bahai-faith` blurb/self note | Low editorial repetition, not blocker. Institutional origin/founder attribution is supported by BWNS. Optional self-note replacement: **“The forerunner and founder descriptions are the faith’s own religious claims.”** Retain1844/1863/1963 distinctions elsewhere. |

## Structural and engine evidence

Evaluated assembled pack: **109 nodes,27 explicit typed links,60 events,10 pins,59 reference-place cards,12 journey/network cards,24 people,4 encounter cards,8 population cards**. These categories overlap in represented identities and are not counts of independently verified historical facts.

Independent documentation probe checks every explicit link endpoint/type/label, node parent/merger/notSame target, event reference target, node-ID uniqueness, no coordinates on59 reference cards, finite coordinates on10 pins, root/independent tradition status, undated legal schools/orders and the two finding reproductions. Existing tests additionally compare10 pin coordinates to the gazetteer, heritage qualifiers and the328-row crosswalk. A passing ID test establishes representation, not source support for all rewritten copy.

Source inspection of `tree-rel.js` finds distinct relationship families, custom labels retained in ties, and `emerge` dates separated from undated/lifespan dates. `tree.js:198` explicitly leaves undated nodes without a year for filters. `engine.js:1294–1302` separates book visibility from layer/year fading; `1074–1083` renders reference places and reference-card buttons without pins. Pack has one overview reading gate, not a shared religious canon. Journey cards do not authorize route geometry. The independent educational notice is appropriate; scripture/tradition is not promoted to archaeological proof by these checks.

Actual checks at implementation SHA: **115/115 unit tests passed**, TypeScript `--noEmit` passed; independent probe passed structural assertions and reproduced ABR01/02. GitHub exact-head run [40655877855](https://github.com/mckayec/universe-sandbox/actions/runs/40655877855) completed success. Despite its workflow title, this PR check is not evidence of a live deployment. Builder screenshots/browser claims are reported in build-report.md, **not independently reproduced**. No browser, server, rendered/mobile/keyboard/interaction check was run, and no full local build/format aggregate is claimed.

## Remaining acceptance gates and ownership

1. Builder can fix ABR01/02 now; ChatGPT must recheck the actual new implementation SHA, including filters/date labels and generated legal-school records. No need to wait for optional prose polish.
2. ChatGPT retains the unfinished all-copy conformity audit: seven flagged readings are disposed, but a record-level comparison of **every**109-node blurb/note,60 event texts and all codex descriptions against accepted research is not certified here. Structural totals must not stand in for that work. Next pass should enumerate these built fields against existing record-audit/source IDs, prioritizing transformed copy, with unchanged text identified rather than rereading the canon.
3. Q01 remains a concrete21-location gazetteer extension request (see addendum). Retaining10 existing pins is evidence-safe but does not close the builder's map-completeness concern. No implicit owner approval of a reduced final map is claimed.
4. Fresh access to the Pentecostal WCC and USCIRF2026 pages failed403. Existing accepted evidence remains attributed; no bypass or invented rereading. Additional source-dependent claims require the cited text/access or conservative omission.
5. Rendered acceptance remains separate and unperformed under current restrictions. No merge/deploy/formal approval. Status stays `built/chatgpt`; builder corrections and remaining audit can proceed in parallel.

See [research-addendum.md](research-addendum.md), [probe](build-audit/probe.cjs), [actual output](build-audit/probe-result.json), and [validation](build-audit/validation.md).

## 2026-10-30 continuation — completed bounded copy pass

The implementation remains `9cefeac89bfd23c4a7dde0e6589151608a3c6f2e`; fresh PR metadata reports open/unmerged, unchanged. Previous sections describe the original5d8080b checkpoint. Their unfinished-copy and0/21Q01 statements are superseded by this continuation, not by a claim of final acceptance.

- [Copy comparison](build-audit/copy-comparison.md) and [313-row inventory](build-audit/copy-inventory.csv):109nodes,27links,60events,10sites,107codex cards compared against accepted evidence.296supported conformity,12correction,5fresh-source-unavailable. Prior source limitations remain.
- **ABR03 medium:** four formation/episode date fields become unsupported finite node filter spans. **ABR04 medium:** two Islamic event numeric filters narrow the displayed chronology. Exact IDs, source keys, remedies and acceptance tests are in the comparison. Actual pure engine functions reproduce all six cases. ABR01/02 remain open; now **four findings affecting12 records** (ten nodes,two events), not12 independent findings.
- [Q01 dispositions](build-audit/q01-anchor-dispositions.md):21/21 considered;7supported reference-coordinate packages,6uncertain/conditional,8source-unavailable. None silently added. Fourteen packages still require evidence or explicit reference-only scope acceptance.
- Builder can address ABR01–04 now. ChatGPT must recheck a changed implementation SHA. The copy-comparison task is complete to available accepted evidence, while fresh CH14/IS24 access and unresolvedQ01 coordinates remain explicit dependencies. No blanket historical certification, rendered acceptance, merge or deployment approval follows.
