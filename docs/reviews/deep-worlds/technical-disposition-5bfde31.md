# Technical disposition packet — PR37 5bfde31

2026-11-08T21:50Z, Claude. PR37 `atlas/deep-worlds`, exact head **5bfde313d819ab89e273af4b9c6a5f788d6d6f3d**
(unchanged since ChatGPT's [DWT-03 review](implementation-review-5bfde31.md)). No application edit in this
packet. PR remains open and unmerged.

## 1. Review accepted

ChatGPT's DWT-03 review is accepted as written, including its count corrections: the reviewer probe is
**11/15 head vs 8/15 parent** (6/6 stale-entry checks improve, 4/4 pre-descent tree-ordering cases regress),
not 15/15. The builder's comment that "all newer navigation supersedes the timer" was too broad and is
withdrawn.

## 2. DWT-03-R1 (Low, latent) — deferred with an integration trigger

Disposition: **defer, not fix now.**

- Exposure: `goPlace` from galaxy view is reached only through the optional tree view; 7/7 registered packs
  on this head have no tree, so the tree view is never created. The fix would be untestable in a real UI on
  this branch (the review asks for a real tree case when one exists).
- Trigger: **before any tree-bearing pack is registered or merged onto this engine**, the builder must give
  successive tree requests their own ownership (bump `placeGen` when a pre-descent `goPlace` begins, or
  capture a per-request token), keeping the six stale-entry guards, and return the reviewer probe at
  15/15 plus one real tree UI case.
- Recorded where it will be seen: this packet, the status note, and the Known-gaps table below. Any future
  pack review that adds `tree` to a pack must cite DWT-03-R1.

## 3. Accepted current-head navigation evidence (consolidated)

All at 5bfde31 unless noted; builder-run evidence is labelled as such.

| Item | Scope closed | Evidence |
| --- | --- | --- |
| DWR-A, DWR-B, DWH-01 | source/VM | reviews 232fef1, d902c8a, fb79488 (carried) |
| DWT-01, 01a/b, 01c (+ overlap residual) | source/VM | reviews 469a83c → b47a60c; cancellation 26/26 retained on head |
| DWO-E1 | disclosure | review 469a83c |
| DWO-E2-F1 | source/VM | review 9aa06c1; F1 8/8 retained on head |
| DWO-E2-F2 | text/announcement/URL | review 117ecba |
| DWT-02 | source/VM | review 311e9fe; 7/7 + 12/12 retained on head |
| DWT-03 | source/VM | review 5bfde31, 6/6 sensitive checks |
| Rendered repeat/Stop (v2.1) | builder-rendered, SwiftShader | 19/19 × 4 (Cosmere b10, Dune b3; 1440×900, 390×844) |
| DWO-E2 matrix | builder-rendered | 90/90 (45 per width) |
| CI | build/units/dist/pages | run 42509377038: 125/125, 175 files, 12×2; 281/281 non-doc files match head |

No further navigation qualification is requested. Repeating DWT-02 or the matrix because a reviewer cannot
launch Chromium is out of scope (per the review).

## 4. Remaining gates — what still blocks vs. Known gaps

| Gate | Status | Who / when | Blocks ready-for-owner? |
| --- | --- | --- | --- |
| Canon: 8 source holds, 139 unselected records, remaining DW06 passages | open | ChatGPT: dispose each hold as Known gap or cut (R3 cap — no open-ended research) | **Yes** — needs "Canon: approved for <SHA>" with Known gaps |
| Society Atlas content (prologue / early-Europa details) | open, canon side | ChatGPT, same packet as above | **Yes**, canon side only |
| Society technical | DWR-A EMP timer closed; spoiler-gate suite 676/0 recorded at build time | Claude reruns the Society gate suite + one load per viewport at the final SHA | Yes, as part of AUDIT_CHECKLIST §4 final technical check |
| Visual | last screenshots are from d902c8a and earlier (no 3840×2160 set at head) | Claude: one fresh set at 3840×2160, 1440×900, 1280×800, 390×844 (atlas index, one place per pack, Society) at the final SHA | Yes, as part of §4 final technical check |
| Device | SwiftShader only; no physical iPhone/iPad or real-GPU timing | Known gap; Mckay may spot-check on phone after release | No |
| `test:browser` Save/Load flake | pre-existing simulator race (`browser-smoke.mjs:88`), reproduces off this branch; not engine.js | Tracked under `docs/reviews/mobile-entry-usability` (PR44, D06) | No |
| DWT-03-R1 | deferred (§2) | Builder, before a tree-bearing pack | No |
| Geometry / spatial precision of scenes | not certified | Known gap (educational fan model) | No |

## 5. Proposed path to release

1. ChatGPT (next): one bounded canon disposition of the 8 holds + Society content — Known gap or cut each —
   then either **"Canon: approved for 5bfde31 with Known gaps"** or a finite cut list.
2. Claude: apply any cuts (new SHA), then the AUDIT_CHECKLIST §4 final technical check at that SHA (Society
   suite, fresh 4-viewport screenshots, pnpm check, test:pages) → "Technical: approved" or blockers.
3. Mckay: release decision (DECISIONS entry opened at ready-for-owner).

## Known gaps (technical)

| Gap | Impact | Blocks build? |
| --- | --- | --- |
| DWT-03-R1 tree last-request ordering | Wrong tree destination if two tree picks overlap a descent; no current pack has a tree | No; blocks enabling a tree-bearing pack |
| No physical-device run | Phone performance/touch only emulated | No |
| Save/Load smoke flake | Intermittent `test:browser` first-run failure | No; owned by mobile-entry-usability |
| Rendered evidence builder-only | Reviewer Chromium blocked by sandbox socket permission | No |
