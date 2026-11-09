# Elantris return and COS-BB-001 design review — ffc8ba7

2026-11-07 · ChatGPT. PR37 `atlas/deep-worlds`, open/unmerged at **ffc8ba7c6734f38839f3eca974b96c04a1a1c098**.
Cosmere blob **91cab650fcbe999ed97bee5ea0cb644a8d3d2e97**; engine blob **5e26507a4b0e972ea065e0ebd2c6dd3838ac8799**.

## Verdict and scope

**Accept the bounded Elantris correction return. Changes requested to the COS-BB-001 design proposal before implementation. Full canon/per-work spoiler-safety/release approval remains withheld.**

Read the complete current pack and engine, the full comparison from fb79488 to ffc8ba7 (three commits; only cosmere.js changed), the original handoff, partial/full builder returns and design proposal. This is implementation verification against the previously sourced handoff, not a new primary-source pass. No new books or web sources opened; no separate Deep Research claim.

## Correction dispositions

| Population | Checked / total | Disposition |
|---|---:|---|
| EL01–05, EL10, EL11 | 7/7 | Accept: exact replacement prose and anchor removals match the handoff; e5 precedes e67. |
| EL06–07 | 2/2 | Existing limited retentions preserved; not re-certified against new sources. |
| EL08 A–E | 5/5 | Accept finite narrow/omit operations. A status narrowed and base order fact removed; B entire Sel cognitive override removed; C Pool renamed and realm sentence removed; D/E named codex entries removed. |
| Residual events e64–67 | 4/4 | e64–66 absent; e67 narrowed to “Hrathen confronts Dilaf.” with no site, lm or battle effect. |
| Original book-1 Sel landmarks | 12/12 dispositions | Eight held records removed; four retained as specified (gate, walls, palace, crack). This is not twelve newly verified descriptions. |
| EL09 qualification | 1/1 disposition | Existing shared credits sentence “Maps and positions are schematic reconstructions.” satisfies the narrow visible-qualification intent at source level. No additional mandatory duplicate sentence. Map-edition attribution remains a repository comment, not an independently verified edition or coordinate audit. |

EL08 closure is restricted to the named fields. Key-7 Sel eras/map-region claims, global intro cosmology, other Sel site geography and the Pool physical description remain unverified at their previously stated scope. Their existence does not undo the requested deletions, but prevents a claim of complete book-1 spoiler safety. In particular, removing the Adonalsium codex entry did not neutralize intro.text.

Independent Node VM execution of the actual engine's chronicle, tour and dossier functions yields **3/3 paths**:
`e1,e2,e3,e4,e5,e67`, restorationBeforeConfrontation=true.
The existing probe reports order rather than asserting the relation; the emitted lists were inspected here, not counted merely from its exit status.

A separate actual-pack structural check confirmed **8/8 landmark omissions**, **3/3 event omissions**, **2/2 codex omissions**, absent Sel-specific realm override, and **2/2 remaining Sel event landmark references resolve**. The four remaining book-1 landmarks are elantris/gate, elantris/walls, kae/palace, chasm/crack. These are data/function checks, not browser interaction, canonical geometry or full chronology tests.

Builder claims (125/125 unit tests, 24 page cases and two viewport browser runs) remain attributed. No new CI-log inspection or independent browser execution was performed in this review. Do not convert the builder's zero-error observations into independent rendering acceptance.

## COS-BB-001: accept direction; revise four design requirements

Reviewed proposal blob **9fabd40622e6477ed59032a44377e8393c00ec49**. Stable work IDs, centralized eligibility, field-level exposure inventory and incremental implementation are sound directions. The following are design requirements, not assertions that unimplemented code already contains these bugs.

| ID | Severity | Proposal location | Required revision / acceptance example |
|---|---|---|---|
| GATE-01 | High | §2 untagged fallback; §4 readSet | Specify fail-closed semantics for per-work mode. An untagged key-2 composite must not appear when only mb1 is selected. Preserve old numeric visibility only in an explicitly legacy mode; in per-work mode quarantine unclassified content or require the entire mapped bucket with an explicit unreviewed-bucket limitation. Do not certify that conservative bucket fallback establishes earliest disclosure. |
| GATE-02 | High | §2 firstWork/works; §3 needs | Define exact Boolean semantics and field-level gates. Separate “appears in these works” from “requires these works to reveal.” Publication rank must not imply membership in a free-form readSet. Make needs an additional AND condition, not an alternative to the base gate. Support alternatives where justified (e.g. anyOf groups containing allOf prerequisites); unknown work IDs/missing mappings fail closed. Specify parent/child dependencies so a safe landmark cannot expose a hidden parent name, era or search snippet. |
| GATE-03 | Medium | §5 legacy URL/storage migration | Do not treat old #book=N or BOOK_KEY=N as proof the reader finished every mapped work. Keep legacy behavior explicitly labelled until reader choice; version storage and give explicit URL state precedence. Define absent/zero (currently All), malformed IDs, contradictory parameters, cross-pack IDs, back/forward and saved deep links. New work additions must not silently expand an existing saved readSet or reinterpret a previously issued preset URL. |
| GATE-04 | Medium | §6–7 tests/phasing | Add non-prefix readSet, unknown/empty sets, AND/OR prerequisites, mixed legacy/tagged data, URL/storage round trips, downgrade while place/tour/effect callbacks are pending, search-result removal and history restoration tests. An assertion banning direct S.book comparisons is a lint aid, not proof every exposure surface is gated. Retain source/VM tests, then add rendered checks of actual visible text and navigation. Specify coverage denominators. |

Concrete negative controls: selecting mb1 alone must not expose the inherited Harmony/Sazed reveal in the grouped key-2 codex; selecting an unrelated later-published work must not unlock unread earlier works in checklist mode; a gated detail must disappear on downgrade from both its open dossier and search results without a stale callback restoring it.

Recommend **preset-first UI**, with checklist deferred until requested, but retain the set-based internal model and explicit legacy mode. This recommendation does not approve public behavior changes. Do not renumber existing keys. First return a revised design with these four requirements resolved; then isolate the exact proposed scope for Mckay's choice if still required. No need to ask Mckay to choose an underspecified migration now.

The canonical work/edition registry and reveal mapping remain research inputs, not builder guesses. The existing 33-work ledger is a starting inventory, not an accepted exhaustive published-work catalogue or proof of recommended reading order.

## Integration and next action

PR24 remains outside this patch and retains its approved head pending D07. Accept deferring propagation to PR37 integration, but do not blindly let the entire PR37 file “win”: reconcile both branches' accepted changes and verify the actual integrated diff before release.

Claude: revise only the COS-BB-001 design proposal to resolve GATE-01–04 and return the specific proposal revision. Preserve the accepted Elantris edits. No additional open-ended Elantris research is required to finish that design return.

Known gaps: full novel/anniversary coverage, independent corroboration, remaining geography/scene prose, global intro/cosmology, per-work classification, rendered/device evidence and integration. **0/33 full individual-work audits approved.**

**Final verdict: bounded Elantris edits accepted; COS-BB-001 design changes requested (4 requirements); canon/release approval withheld.**
