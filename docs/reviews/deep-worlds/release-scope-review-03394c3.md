# Deep Worlds release-scope review — 03394c3

2026-11-09, ChatGPT. **Return for finite documentation corrections; R1 is not yet accepted for an owner scope decision.** No cuts, split, branch edits or release are authorized by this review.

## Inputs and independently checked coverage

Exact open PR37 head: **03394c32816fcb5c95261bf6a9ea4520381a5838**; comparison base **51fe68887ae2d6a4c4c7b291d2df534f7bf4d7b0**. Read the complete six pack files at both revisions, the manifest, inventory CSV and classifier, seven-place ledger/review, Cosmere crosswalk, accepted CS18 return and eight-hold omission disposition.

Reviewed main blobs: manifest `a64eee09354bbed9dd5733e21f4dfde62dcb2b36`; CSV `c162375d447c664486d23d5a64c31a53695c2fc8`; classifier `0ff509e0c6de748559b2d7abb8a777718e64febd`; crosswalk `9248b7ca93b3343b81a9033d2c1fce489641c8ca`.

Independent Node VM inventory (separate comparison implementation, not the supplied classifier) verified **12/12 downloaded Git blob hashes**, reconstructed the site/landmark/event/world/codex record delta and matched **1807/1807 CSV identities and added/changed/removed classifications**, with **1807/1807 unique identities**. CSV class totals reconcile to **28 A + 16 Q + 10 O + 1753 U = 1807**; these are classifier outputs, not 28 whole-record canon approvals.

The historical 139 reconcile as **97 U added + 30 U changed + 6 unchanged + 2 Q added + 2 O removed + 1 A added + 1 A changed = 139**. Independently confirmed all **6/6** non-delta identities exist and are identical at base/head: dune/c1; foundation/f2c, f6j, f7b, f7d; expanse/b4b. This confirms inventory completeness for these identities, not primary-source verification.

No fresh primary narrative sources, separate Deep Research product, browser tests or CI run were used for this existing-evidence scope review. Earlier source verdicts are carried only to their documented leaves. Full canon, geometry, technical and release gates remain open.

## Required finite corrections

### RS1 — hotel option (a) is not dependency-closed

At the exact head, the proposed A event `foundation/f1a2` is:

`{id:"f1a2", book:1, world:"trantor", site:"hotel", lm:"tower", ...}`

The hotel site does not exist at the comparison base. R1 item 4 includes f1a2, while hotel option (a) removes its site and landmark. Clearing only `lm` still leaves the missing `site:"hotel"`.

**Choose option (a) for the revised proposal, including omission of newly added f1a2 from that proposed slice.** Do not invent a replacement location or move it to commission. That leaves 14 A landmark candidates and 12 A event candidates before the cumulative-correction reconciliation below. Inventory all incoming site/landmark references for the proposed result, not just landmarks hosted by new sites. This is a scope instruction for the manifest, not permission to alter PR37.

### RS2 — accepted leaves must not become accepted whole records

The [seven-place review](seven-place-review-2026-11-07.md) explicitly limits approval to named wording and says scoped retains do not approve shape, size or position. The crosswalk likewise marks modeled Channerel course uncertified. Yet the classifier assigns A to an entire landmark/event from its identity and historical label; it neither checks the accepted replacement value nor identifies the approved leaves. For example, Kholinar palace is A although the retained prose approval does not cover `at:[0,.7]`, `h:1.6`, the modeled palace, or independent validation of every gate.

Keep the useful inventory classes, but describe A as **having an accepted bounded disposition**, with separate fields for accepted leaf/value, evidence class, exact acceptance record and unresolved/model fields. Build an explicit inclusion allowlist from that disposition ledger. Compare each carried value to the actual head; source support for prose cannot certify the other fields.

The 424 proposed scene objects also need an explicit **schematic/model treatment**, not the statement that enumerated `arch`, `weather`, `sky`, size and time-of-day values cannot communicate canon claims. Specify the existing or proposed user-visible qualification and what visual/gate checks establish it. Preserve the accepted geometry Known-gap boundary; no new open-ended book research is requested. If that bounded treatment cannot be specified, present R0 as the technical-only alternative rather than declaring all scenes accepted.

### RS3 — the older classification join loses a later accepted correction

The CSV labels `cosmere/e13` Q using CS18's older partial-primary crosswalk. But [implementation-review-ffc8ba7.md](implementation-review-ffc8ba7.md) explicitly accepted its later conservative text. At 03394c3 it remains:

> Siri of Idris arrives at the Court of Gods to marry the God King of Hallandren.

The actual base text instead says Idris sends its youngest princess and she finds him unlike the stories. R1's “main's text for every event, plus 13 A events” would restore that broader earlier text because e13 is absent from the A list.

Carry the accepted e13 **text leaf** into the candidate slice; treat its `lm:palace` separately and remove that optional link from the proposal if its target is excluded. Reconcile later acceptance records against the crosswalk, including the separately reviewed Elantris return; do not use the older A/Q join as the final accepted-correction ledger. PR24 precedence remains necessary but does not replace this check.

Q landmarks: **leave all 10 out of this proposed R1**. The two Q added events e70/e102 may also remain outside the partial slice, but state that omission explicitly: they have accepted conservative wording with weaker evidence, not rejected facts. Their accepted wording/anchor-removal instructions remain binding if those events are subsequently included. Excluding an entirely new event is different from reverting a previously narrowed existing event.

### RS4 — removed is not automatically approved for removal

The script assigns O to every removed record, including fallback rows without acceptance evidence. O accurately means absent at head; it does not establish R1 item 5's “10 O removals (already accepted).” The manifest itself flags sun-eater/b7c as not traced.

Attach a per-ID acceptance reference for all **10/10 O records**, with the named dependency closure. The [eight-hold disposition](canon-disposition-5bfde31.md) already supplies the b2k/b3b/Sphinx and Expanse closure; reuse it. Resolve b7c using existing review history. If no acceptance record exists, keep that omission undecided in the proposal rather than inventing one or reopening broad research. Include every previously approved correction whose reversion is otherwise caused by constructing the new slice from main.

## Scope choices and bookkeeping

- **R1:** return a revised, field-specific proposal with the four corrections above. Society remains outside it; its earlier accepted omissions/qualifications are not revoked. No full scene/pack approval is given here.
- **R0:** retain as an owner-selectable technical-only alternative with dormant places and explicit current-main baseline. It is not release-approved by this review and still needs final integration/technical checks.
- **Hotel:** option (a), with f1a2 dependency removed from the proposed slice as above.
- **Q landmarks:** out; no arbitrary relocation of associated events to surviving landmarks.
- Correct the hold-count sentence: SP02–SP04 and SP09–SP16 are **11 IDs**, not 8. The three Dune holds and later eight holds are distinct accepted batches.
- Correct the visual denominator. The listed Arrakeen, Trantor, Devil's Rest, Luthadel, Kholinar, Expanse and Hyperion are **7 places**; plus index at four viewports is **32 slots**. Keep both Cosmere places and report 32, or explicitly select six places for 28. Society screenshots do not count toward the new non-Society matrix.
- Replace “vs what is live” with “vs the recorded main/base file contents.” Byte equality to main alone does not establish the deployed production revision. Pin a main commit for the revised construction proposal.

## Handoff

**content-review/chatgpt → fixing/claude.** Next bounded unit: revised manifest and machine-readable field/disposition allowlist; all candidate event/site/landmark dependencies; 10/10 omission provenance; cumulative accepted-correction reconciliation; corrected matrix/counts. Reuse existing evidence. No application changes, new source hunt or scope question for Mckay yet.

After that finite packet, ChatGPT can decide whether it is concrete enough for one Mckay scope question. Existing DWO/DWT closures, DWT-03-R1 tree trigger, source backlog, exact-head CI/rendered/device/Save-Load limitations and Mckay's release authority remain unchanged. No agreement, PR approval, merge or deployment is claimed.
