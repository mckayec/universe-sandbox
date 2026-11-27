# Secret History — finite Cognitive omission handoff

ChatGPT · 2026-11-17 UTC. **Second bounded source checkpoint; implementation requested, not implemented or canon-approved.** Continues [the opening-preview checkpoint](secret-history-source-checkpoint-2026-11-16.md), whose three observations remain research evidence. No new Secret History gate is approved.

## Exact baseline and reconciliation

| PR / branch | Head read in this run | Cosmere pack blob |
| --- | --- | --- |
| 48 / feature/cosmere-reading-state | f793e1142ec1eb550507c29e2da1b2809e17312c | a296bf9241c5f515387b24f069562ff7e286d13b |
| 24 / fix/lore-corrections | cf25cda66e91c573c421a0f3712623db72737a3b | 3ff0aab059fa54e00f6e2ccc7b849d4bd206d958 |
| 37 / atlas/deep-worlds | 03394c32816fcb5c95261bf6a9ea4520381a5838 | 5a74e300eaf88b2d3c81fa9bc957584cd4708e33 |

Read PR48 `public/atlas/engine.js` blob `0bc5357a2043f3939512bc5b091eb4ffbbf1c5d0` and `public/atlas/reading.js` blob `4d9bc177294e5e33accf6f19825ef467f0bb90d4`. **5/5 input blob hashes independently match.** For each older PR, compared the world Cognitive object, complete Scadrial subastral row and global Cognitive unknown text: **6/6 comparisons match PR48**. This is a three-target reconciliation, not whole-pack equivalence or authority to change those older branches.

## Source result and bounded stop

Used ordinary source-based web search/open, not the separate Deep Research product.

- **SH-P1, primary preview re-opened:** [Everand, Dragonsteel LLC, ISBN 9781938570124](https://www.everand.com/book/296874434/Mistborn-Secret-History/277146900), Part One / Empire / chapter 1, **Book preview** section below reader reviews. Rechecked the saved SH-O1–03 locus: mist-formed buildings/wagon and yielding ground; bright metal objects; luminous people in the living-world crowd. **3/3 saved observations retained**, limited to this scene. No full chapter or novella reading claimed.
- **SH-A1, additional edition route:** [Google Books, Dragonsteel 2016](https://books.google.com/books/about/Mistborn_Secret_History.html?id=I6VxCwAAQBAJ). Opened the listing and followed its [public preview](https://books.google.com/books?id=I6VxCwAAQBAJ&printsec=frontcover). The returned preview exposed front-cover navigation, not readable body text. Its word cloud is not passage evidence.
- **SH-A2, authorized retail listing:** [Kobo, Dragonsteel, book ID 9781938570124](https://www.kobo.com/us/en/ebook/mistborn-secret-history). Opened metadata and synopsis. The web reader exposes a Preview Now button but no retrievable chapter text/link in that response. No preview-body access, purchase or account action claimed through this route.
- The explicit Cognitive terminology found above the Everand preview is **reader-review material**, not the primary passage. It does not close the primary-text gap. Search-discovered full-text mirrors were not opened or used.

**0/2 targeted missing witnesses obtained** (explicit Cognitive identification of the scene; the water/land travel rule). **0/1 complete existing Cognitive blurb certified.** The proper name, universal mechanics, earliest disclosure and exact visual treatment remain unverified. These findings do not prove the claims false or the book silent.

The earlier Firecrawl credit limit remains route-specific; it was not retried before its reported reset. The additional ordinary web routes above were usable but did not supply the missing text. Under the two-checkpoint cap, defer broader MB09 research and implement a conservative omission now. Restore source-backed content only in a later explicitly scoped unit with new evidence; do not start another identical access search next run.

## Three finite editorial dispositions for Claude

These are one bounded omission package, **SH-D1–03**, addressing existing source holds. They are not new CBR engine findings and do not reopen CBR-01–04.

| ID | Exact PR48 target | Requested change | Reason / limit |
| --- | --- | --- | --- |
| SH-D1 | `public/atlas/packs/cosmere.js:401`, world `scadrial.realms.cognitive` | Delete the entire Cognitive child object: name, blurb, style and three colors. Preserve any other realm children; retaining an empty `realms` container is acceptable. | An evidence hold must apply in All/legacy too. Do not attach a guessed `mistborn-secret-history` gate to the unverified bundle, or invent a nested blurb gate the selectors do not read. The three partial observations stay in the research document, not a newly certified world description. |
| SH-D2 | Same file, line 883, `realms.cognitive.subastrals` row with `world:"scadrial"` | Delete only its `name` property. Keep the row and its world, first, color, radius and other properties unchanged. | The separate label can expose the same unverified proper name independently. Omitting the name suppresses its label construction while retaining the existing illustrative glow and cluster layout. This is not approval of that geometry or `first:7`. |
| SH-D3 | Same file, line 878, `realms.cognitive.unknown` | Replace with the exact neutral text below. | With SH-D1, the current fallback would falsely imply an exhaustive negative source finding. The replacement describes this atlas view, not what all books do or do not contain. It is deliberately generic for every world using this same fallback. |

Exact SH-D3 text:

> No world-specific description is provided in this view. The appearance is an illustration, not a verified map.

Do not change world/site record gates, first/books/until, global Cognitive `first:4`, the retained subastral row's `first:7`, accepted MB01/MB05/MB10 copy/gates, or other worlds' payloads. No parent promotion, public-name exception or new per-work mapping is authorized here. Do not use invalid gate metadata as an omission mechanism.

## Selector consequences, checked before handoff

The unchanged engine's `realmsOwn`, `realmLook` and `realmCard` (lines 1334–1363) handle the absent world Cognitive child by selecting global look/title/unknown text. There is no nested child-field check to rely on. SH-D1 therefore changes the selected look from the held world-specific mist/colors to the existing generic global look; **visual output will change**. SH-D3 labels that view as illustration, not a source-accurate representation.

The actual subastral construction loop (lines 1307–1312) always creates the glow, but creates the name label only if `sa.name` is truthy. Keeping the row preserves the cluster inputs; removing the whole row would change them and is not requested.

The actual global realm selector still requires bucket 4 in per-work mode. Secret History alone, or the original trilogy plus Secret History, does not open it. The proposal leaves that behavior unchanged; it does **not** certify that it is the desired eventual per-work mapping.

**Separate holds remain:** the global Cognitive home-card text, global look/geometry, realm-opening threshold, other subastral names and perpendicularity content. SH-D3 changes the selected-world missing-description fallback only; `realmCard(null)` still uses global `text`. This package neither verifies that global prose nor removes its overlapping general claims. Do not claim that all Cognitive content or every instance of a related mechanic has been cleared.

## Independent proposal checks

Saved [probe](secret-history-omission-probe-2026-11-17.mjs) and [output](secret-history-omission-output-2026-11-17.json). Node v24.22.1; actual fetched pack and reading helper evaluated in a VM; actual relevant engine selectors and subastral loop extracted by exact markers. Candidate mutations exist **only in memory**. No application file was changed.

**136/136 assertions pass**, including:

- 5/5 blob hashes, 6/6 older-branch target comparisons, and whole parsed-pack equality after restoring only the three proposed edits.
- **19/19 state cases**, each with six selector assertions: all eight original-trilogy subsets; Secret History only; trilogy + Secret History; trilogy + Way of Kings; trilogy + both; later-era-only; all works explicitly selected; All mode; legacy 2/4/7/10. Parent visibility, name, status, selected blurb/facts and Cognitive opening are identical to baseline. Neutral fallback, absence of removed world text/name, generic look and empty Physical card are checked.
- Actual subastral loop with renderer dependencies stubbed: **1/1 selected name omitted, 6/6 other label requests and 7/7 glow requests preserved**. This records requests, not pixel positions or actual rendering.
- Negative control: the proposed neutral fallback expectation fails on the unmodified baseline in **19/19 states**. This is a proposal-detection control, not 19 reproduced browser defects.

Some direct selector calls intentionally exercise states in which the UI would not let the user select the world/realm. They are not evidence of visible hidden-state cards. No independent browser, material-uniform application, screenshots, full suite or CI run is claimed. A first probe attempt lacked an extracted helper and the next recorded the wrong stub argument; these harness defects were corrected before the complete successful run. No failed application behavior was inferred from them.

To reproduce, fetch the five exact inputs in the table and engine/reading list into a JSON object with keys `head`, `pack`, `engine`, `reading` (each file: `content,sha`), and `older` (two entries: `pr,head,content,sha`). Run the probe with that JSON path; stdout is the saved output. Input hashes are checked by the probe. Do not run this proposal probe against a successor and label it an implementation acceptance test without adapting the expected baseline.

## Required return and next owner

Claude: implement **SH-D1–03 on PR48 only**, preserving the existing accepted work and holds. Return an exact head and three-target diff, read-back payload evidence and appropriate unit/build/page checks. Update existing tests that deliberately asserted the held Cognitive payload remained unchanged; that old expectation is superseded only for these three targets.

Provide rendered evidence at desktop 1440×900 and phone 390×844 for:
1. Original trilogy + Way of Kings, Cognitive selected then descend to Scadrial: neutral card and generic material, no old name/blurb. Return to Physical and confirm accepted parent/era content.
2. The same selection plus Secret History, and All/legacy modes: omission remains, no accidental restoration or new gate.
3. An incomplete-trilogy selection and later-era-only: parent remains inaccessible; narrowing a previously open selection still clears hidden content under existing behavior.
4. Galaxy labels: Scadrial's old subastral name absent, other labels preserved. Confirm the change to the generic fallback is intentional at both viewports.

Use the already accepted selector/gate regressions where applicable. Distinguish executed checks from unavailable ones; do not call an unavailable browser test a pass or infer pre-existence from a previous report. If new engine behavior is needed, stop at a concrete implementation checkpoint rather than relaxing visibility.

After outputs are saved, route `content-review/chatgpt → fixing/claude` for this package; Claude returns `implementation-review/chatgpt`. Review the returned implementation before continuing a different work-ledger unit. The deferred MB09 evidence gaps remain linked, not silently closed.

## Accounting and release boundary

This run checked **18/18 pack statuses and 8/8 review statuses**. No stale research-ready/claude self-audit was eligible; no new universe was activated. The agreement is active with both sign-offs and is unchanged.

**3/3 editorial dispositions supplied, 0/3 implemented by this run.** 3/3 selected scene observations retained; 0/1 full Cognitive blurb certified; 0 new per-work gates. Prior ledger unchanged: 1/1 nested era-10 field and 3/3 era-6 fields accepted at bounded implementation scope; 4/10 earlier parent fields narrowed and 6/10 held; 0/2 whole parents promoted; 2/7 PR48 key-2 events mapped; 8/148 earlier candidate fields and 140/148 held; **0/33 full-work approvals**.

No site-code or PR-branch edit, merge, deployment, final canon sign-off or Mckay release approval.
