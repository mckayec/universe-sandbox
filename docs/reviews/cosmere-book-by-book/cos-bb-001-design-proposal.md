# COS-BB-001 — per-work spoiler gating: design proposal, revision 2 (not implemented)

Claude, 2026-11-07T17:50Z. Revision 2 answers GATE-01–04 in [implementation-review-ffc8ba7.md](implementation-review-ffc8ba7.md) (review of revision 1, blob 9fabd40622e6477ed59032a44377e8393c00ec49). Design only: nothing is implemented, no numeric key is renumbered, and the accepted Elantris edits on PR37 at ffc8ba7c6734f38839f3eca974b96c04a1a1c098 are untouched. Public behaviour changes still need Mckay's scope choice after ChatGPT accepts this design.

The canonical work list, its order and every work→record mapping are research inputs (ChatGPT). The IDs below (`mb1`, `wok`, …) are placeholders for illustration only. The 33-row ledger in audit-2026-11-06.md is a starting inventory, not an accepted catalogue.

## Problem (repository observation, unchanged)

The Cosmere pack uses 12 numeric keys with `spoilers.mode: "cumulative"`; keys 2, 6, 7, 8, 11 and 12 each hold several works. The engine compares numbers everywhere (`S.book` in chronicle, tours, dossiers, landmarks, codex `cxFirst`, `more`, `eras`, `realmFirst`, region opacity), stores one number (`storeBook`/`storedBook`, `BOOK_KEY`; unknown or missing → 0 = All) and writes `#book=N` (`parseHash`, `syncURL` via `history.replaceState`). A reader who finished only *The Final Empire* cannot select it.

## 1. Data model

- `works`: one row per published work: `{id, title, y, pub, bucket}`. `id` is permanent once shipped; `pub` = publication rank (display/preset only, never used as proof of reading); `bucket` = today's numeric key.
- `presets`: named reading orders, each an ordered array of work IDs (`{id: "pub", label: "Publication order", seq: [...]}`), plus a `version` integer per preset. A preset position means "the reader has read exactly `seq[0..i]`" — nothing else.
- A record's gate is a `gate` object. Fields are distinct and never substitute for each other:
  - `in: [workIds]` — **appears in** (descriptive, for credits/"read more"; never grants visibility).
  - `req` — **required to reveal**: a Boolean expression in disjunctive normal form, `[[a,b],[c]]` = (a AND b) OR c. Each inner array is allOf; the outer is anyOf. A plain string `"mb1"` is shorthand for `[["mb1"]]`.
  - `needs` (optional) — extra prerequisite expression, same DNF form, **ANDed** with `req`. It can only narrow, never widen, visibility.
- Field-level gates: any displayed field may carry its own `gate` (`name`, `era`, `desc`, `more[i]`, `search`). Effective gate of a field = record gate AND field gate.
- Parent/child: a child's effective gate = its own gate AND every ancestor's gate (world → site → place → landmark; codex entry → `more` line; event → tour step). A child can never expose a parent's name, era or search snippet before the parent is visible; a renderer that needs a hidden parent's label shows a neutral placeholder ("an unrevealed place") or omits the row.

## 2. Evaluation semantics (GATE-01, GATE-02)

One function decides every exposure: `visible(gate, readSet, mode) → boolean`, where `readSet` is a set of work IDs.

- `req`/`needs` evaluation: an inner allOf is true iff every ID is in `readSet`; an expression is true iff any inner allOf is true. Empty outer array = false.
- **Fail closed** on: unknown work ID in an expression; malformed expression; a record or field with no gate and no bucket mapping; a cycle in parent links. Each failure is logged once in dev builds and counted in tests.
- Publication rank is never consulted by `visible`. Selecting a later-published work does not imply any earlier work is read.

Modes:

| Mode | How `readSet` is formed | Untagged (bucket-only) records |
|---|---|---|
| `legacy` | exactly today's behaviour: numeric `S.book`, `e.book<=S.book` etc. Not set-based at all; labelled "Book N (series grouping)" in the bar. | today's numeric rules |
| `preset` | `seq[0..i]` of the chosen preset | visible only if **every** work with that bucket is in `readSet` (whole mapped bucket), and the record is marked *unreviewed* — see below |
| `set` (checklist; deferred UI) | explicit IDs | same as preset |

*Unreviewed* (GATE-01): in per-work modes an untagged record falls back to "all works in its bucket read". This is conservative but is **not** a claim of earliest disclosure. Where such records are shown, the bar shows one compact line, "Some details in this series are only grouped, not yet sorted by book", and the record carries no per-work attribution. Fallback is not counted as tagged coverage. Example control: with `readSet={mb1}`, the untagged key-2 grouped codex text (Harmony/Sazed) stays hidden because mb2/mb3 are unread.

## 3. State, URL and storage (GATE-03)

- Storage key versioned: `atlas-read:v2:<packId>` → `{mode, preset, presetVersion, i}` or `{mode:"set", ids:[...]}`. Old `BOOK_KEY` is read only to keep the reader in `legacy` mode at the same N; it is never converted to a `readSet`. The reader leaves legacy only by choosing a work-level option.
- URL: explicit URL state wins over storage. `#book=N` → `legacy` N. `#upto=<presetId>:<presetVersion>:<workId>` → preset. `#read=<id>,<id>` → set. On a page load with both `book` and `upto`/`read`, the work-level parameter wins and `book` is dropped by the next `syncURL`.
- Absent or `book=0` → All (today's behaviour, unchanged). Malformed number, unknown work ID, unknown preset, or an ID from another pack (IDs are namespaced by pack in validation, not by prefix) → ignore that parameter, fall back to stored state or All, and show the existing "link could not be read" toast. A `#read=` list containing any unknown ID is rejected whole, not partially applied.
- Additions: a preset URL carries `presetVersion`. If the pack later inserts a work, an old `#upto` resolves against the stored version's `seq` (packs keep prior preset versions), so a saved link never silently gains a new work. A stored `set` never gains IDs; new works are unread until ticked.
- History: read-state changes keep using `replaceState` (no new history entries), so Back/Forward restore surfaces, not read levels. Every `popstate`/hash restore re-evaluates `visible` before rendering; a deep link to a place or tour step not visible at the restored read state opens the nearest visible parent with the existing "not yet revealed" note.

## 4. Single helper and exposure-surface inventory

Every surface calls `visible()` and no surface reads `S.book` or `readSet` directly: chronicle/event lists; tours (step list and step callbacks); place dossiers, landmarks, site lists and map pins; world list and "N more worlds appear later"; codex entries and `more` lines; world `eras` and facts; realm availability and realm map region opacity; search index (built from visible fields only, rebuilt on every read-state change); credits/intro copy (`intro.text` currently names Adonalsium at every key — needs a field gate or neutral wording, a content decision); hints/notes ("Reading through …").

Downgrade (read state narrowed): rebuild search, close or re-render open dossiers, cancel pending place/tour/effect callbacks via a generation counter (same pattern as the existing `atlasEntry===gen` place guard), and re-check visibility inside each delayed callback before it writes to the DOM.

## 5. Tests and coverage denominators (GATE-04)

Source/VM tests (Node `vm`, actual `engine.js` + pack, like `elantris-order-probe.cjs`), each reporting `checked/total`:

1. Legacy parity: for N = 0..12, the visible-ID set per surface equals the pre-change engine output (denominator: 13 keys × surfaces in §4).
2. Per tagged record: hidden in every preset position before its gate, visible at it (denominator: tagged records).
3. Boolean semantics: AND, OR, `needs` narrowing, empty expression, unknown ID, malformed expression, parent hidden/child tagged visible (fixture pack).
4. Non-prefix sets: `{later work}` alone unlocks nothing earlier; `{mb1}` hides the grouped key-2 Harmony/Sazed text.
5. Mixed data: untagged fallback requires whole bucket; unreviewed line shown iff such a record is visible.
6. URL/storage round trips: absent, `book=0`, `book=N`, malformed, unknown ID, cross-pack ID, contradictory `book`+`read`, old preset version after a work insertion, storage v1→legacy, URL precedence over storage.
7. Downgrade: open dossier, search results and a pending tour/place/effect callback after narrowing — none restores hidden text (fake timers).
8. History: Back/Forward and a saved deep link to a now-hidden place restore a visible parent.

A lint rule (no `S.book`/`readSet` outside the helper) is a guard, not proof. After VM tests pass, rendered Playwright checks read actual visible text for the negative controls in tests 4, 6 and 7 at 1440×900 and 390×844.

## Phasing (unchanged in intent)

- Phase 1, engine only, no content change: `works`/`presets`, `visible()`, modes with `legacy` as default, URL/storage v2, single-helper refactor, tests 1, 3, 6–8. Shipping Phase 1 changes nothing a reader sees.
- Phase 2: research-supplied work registry and mappings, one bucket per reviewable return (start with keys 2 and 12); tests 2, 4, 5 per bucket.
- Phase 3: preset selector in the bar (recommended first public change); checklist only if Mckay asks.

## For Mckay (after ChatGPT accepts this design)

Scope choice: (a) Phase 1 only (no visible change), (b) Phase 1+2+preset UI (recommended), (c) also the checklist. Not asked yet.
