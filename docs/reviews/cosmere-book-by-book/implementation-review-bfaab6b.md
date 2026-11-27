# Elantris portability return review — bfaab6b

2026-11-21 · ChatGPT · PR48 `feature/cosmere-reading-state`, head **bfaab6b873a493150f090c3cfbb25202c4cf626a**, actual sole parent **5bdcf0a2cb9222fe4994cd1fdf542300e811cff2**.

**Verdict: accept the four exact data corrections; EL-PORT-03 navigation acceptance remains partial. Return one Medium runtime finding, EL-PORT-R1, to Claude.** Full canon, whole-PR, rendered and release approval remain withheld.

## Evidence reviewed and revision boundary

Read the [prior handoff/review](implementation-review-5bdcf0a.md), blob `24550db4ebfdd01102cc30ee6ec31048f382e235`, and [Claude's return](elport-return-bfaab6b.md), blob `a70c92f63335e7528ad931d5c4ca721603036576`. Inspected both files in the actual incremental commit diff (2/2): pack +4/−4 and new 205-line test. This is not a review of every earlier PR48 change.

| Input at audited head | Blob |
| --- | --- |
| public/atlas/packs/cosmere.js | 0ec8d80d4b9e184dafbc6461867fb9be54c6c631 |
| Actual parent pack | 2a09ad8290e864a961e358960158b587b0b9f2fc |
| public/atlas/engine.js | 0bc5357a2043f3939512bc5b091eb4ffbbf1c5d0 |
| public/atlas/reading.js | 4d9bc177294e5e33accf6f19825ef467f0bb90d4 |
| tests/atlas-el-port-02-05.test.ts | b8670a9008c6f7cb4fd34d42f8d7bbed68ddfbfd |

The renderer/helper did not change in this commit. The navigation issue below is inherited engine behavior exposed by unpinning e4, not a claim that Claude changed the engine.

## Independent data and selector checks

- **5/5 expected leaf operations only:** widor.desc, e2.text, e4.text, e5.text, and deletion of e4.site. All four strings match the handoff. Reversing those operations on the full head source is byte-for-byte equal to the actual fetched parent source (**1/1**), not merely a synthesized-parent assertion.
- e2/e5 retain their broad sites; e4 has no site or lm. e67 and the palace landmark remain absent (**2/2 preserved absences**). No event now references site chasm; that site itself is unchanged.
- Executed actual fetched AtlasReading and renderer selectors (span beginning `var RREG=null;`, through eTitle/eText, plus actual evOk and firstOf) with head and actual-parent data. **30/30 event/state comparisons pass**: e2/e4/e5 × all, legacy1, legacy7, none, safe, Hope only, Elantris only, Elantris+Hope, all 13 bucket7 IDs without Elantris, all33 work IDs. Visibility/title remain equal; visible text matches the required replacement and hidden text remains empty. e4 is visible in6/10 states and denied in4/10.
- These are executed source/function checks, not browser/whole-engine integration tests. The new test's synthetic-parent comparison still cannot prove historical-parent equality by itself; our separate full-source comparison supplies that evidence for this head.

EL-PORT-02/04/05: accepted within their bounded data scope. EL-PORT-03: exact text/unpin accepted; navigation completion remains blocked by R1.

## EL-PORT-R1 — stale selected site survives world-only event travel

| ID | Severity | Location | Finding | Evidence | Required correction |
| --- | --- | --- | --- | --- | --- |
| EL-PORT-R1 | Medium | public/atlas/engine.js:1482, same-world branch of openEvent; renderCrumbs at1265; tests/atlas-el-port-02-05.test.ts travel case | Opening unpinned e4 while already on Sel's surface with a site selected leaves that site selected. The breadcrumb still asserts the old place as current. Testing only S.site=null misses this state. | Actual openEvent and renderCrumbs execution below; source inspection of refreshAll/afterRefresh confirms no unconditional site clear in that path. | For travel to a world-only event, clear stale place selection through the existing safe selection/state path; preserve intentional non-travel dossier behavior. Add selected-site negative controls and rendered surface evidence. |

Reproduction at the audited head:

1. Start on Sel's surface, select the Chasm (or Kae).
2. Open e4 through the chronicle travel path. The actual track click listener calls `openEvent(id,true)` at line1219.
3. e4 is now world-only, but `if(e.site)selectSite(e.site)` performs no action. S.ev becomes e4 while S.site remains the old site.
4. Actual renderCrumbs emits that old site as the current breadcrumb, rather than ending at Sel.

Independently executed the complete actual openEvent function and actual renderCrumbs with inert DOM/scene dependencies. refreshAll in this focused harness calls renderCrumbs; other rendering is stubbed. Source inspection separately covered the actual refreshAll, afterRefresh and rdRelabel paths. No actual browser run is claimed.

| Initial S.site on Sel surface | Result after openEvent("e4", true) | Actual breadcrumb output |
| --- | --- | --- |
| null | null | ends at Sel |
| chasm | chasm | ends at The Chasm |
| kae | kae | ends at Kae |

Thus **2/2 selected-site negative controls fail** the requested world-only selection outcome; the null-site baseline passes **1/1**. There are zero new selectSite calls in all3 cases, but zero calls is not proof of zero retained selection. Claude's earlier 0-selection-call observation remains true within its setup; its broad world-only completion inference is incomplete. The galaxy-level screenshots cannot establish this surface-state case.

Acceptance for the finite repair:
- Start e4 travel from null, chasm and kae on Sel's surface; all3 end with no selected site, a Sel-ending breadcrumb, and no stale site URL/highlight.
- Keep pinned e2/e5 travel functional. Preserve non-travel event expansion semantics; do not indiscriminately clear places on every dossier click.
- Check travel from another surface and from galaxy view, plus any pending site callback that could restore a stale selection. Preserve reading-generation/visibility guards; do not weaken gates to pass.
- Exercise actual chronicle/tour entry paths where applicable; supply desktop and phone **surface-view** evidence. Return exact parent/head, actual diff and required validation results.
- No new site pin, geography, e67, palace landmark, HO01 or parent-gate promotion.

## Out-of-batch Chasm site description — explicit disposition

Claude correctly left the Chasm site's description unchanged. Its narrative sentence relates the Chasm to Raoden's discovery; it does not expressly say he physically stood at the Chasm. **No new false-location finding is established from that sentence alone.** Keep it on the existing partial/source hold rather than presenting it as fully verified or turning it into a new spatial pin.

Opened [author Annotation Elantris49-1](https://www.brandonsanderson.com/blogs/blog/annotation-elantris-49-1), especially the map discussion and missing-line discovery paragraph (retrieval lines115–125). It supports the discovery relationship at author-commentary scope, while explicitly discussing map/text mismatch. It does not verify the site's complete geography, river adjacency, earthquake phrasing or precise coordinates. This is commentary, not chapter text or independent second-source corroboration. No fresh full-novel/edition audit.

Firecrawl retrieval was unavailable due to insufficient credits; the web-open fallback returned the author page successfully (cached crawl indicated yesterday). No live-fetch guarantee or separate Deep Research usage is claimed. This source-access issue did not block this bounded review.

## Validation and retained limits

Independently fetched exact-head [Actions run44911238260](https://github.com/mckayec/universe-sandbox/actions/runs/44911238260) checks and job steps. Format, build, test, check:dist and standalone-pages are successful **5/5**; deploy skipped. CI metadata does not establish assertion counts or targeted surface behavior.

Claude-reported focused4/4, tests681/681, dist115 files, pages12×2 remain attributed rather than claimed as locally rerun. Claude reports the inherited browser-smoke Save/Load timeout at line88, still unresolved. Screenshots are recorded on main: desktop blob `c232212776444c0e0c3a84d2a4d895c92553404a`, phone blob `882c813474e956eac7d60f853d877c15c1860a7a`. Their manifest presence was verified; **0/2 independently visually inspected**, 0 fresh browser cases. Claude identifies them as galaxy-level, not the needed surface negative control.

Return **fixing / claude** for R1 only; then **implementation-review / chatgpt** after evidence is saved. Preserve the four accepted data edits and earlier EL01 closure. Broader EL08/HO01/source/gate holds remain.33/33 ledger rows remain28 deferred/5 partial, **0/33 full-work approvals**; FD01 deferred2/2. No application or PR-branch edit, merge, deployment or Mckay approval in this run.
