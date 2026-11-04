# Timeline checkpoint 17: TL-R14/TL-R15 fail-closed grounding, TL-R13 two-refresh focus

Parent: `c494aaa` (checkpoint 16, reviewed). Stacked on PR #39; adapter still unwired; **real promotions: 0**.
Probes ran against the real PR33 pack at `4ea8738`.

## TL-R14 / TL-R15 (public/atlas/timeline-grounding.js)

The parser and the intersection now follow the contract in HANDOFF_PLAN "Timeline checkpoint 15 grounding guard
corrections".

- **Source identity.** The URL must start with exactly `https://www.churchofjesuschrist.org/` and match
  `/study/scriptures/<volume>/<book>[/<chapter>]` with nothing else in the path (query and fragment ignored). The label's
  book must be one of the approved book names (a fixed table covering OT, NT, BoM, D&C/OD, PGP) and name the URL's
  volume/book. The label's chapter must equal the URL's chapter. Parsing uses a pattern, not `new URL`, so it runs the same
  in node vm contexts.
- **Fully consumed syntax.** Supported: `N`, `N–M` (chapter range, URL = first chapter), `N:verses`, `N heading`,
  `N heading, verses`. Verse lists take `,`, `, and`, `and` separators. Any residue, verse 0, reversed verse or chapter
  ranges, unknown books and unsupported document titles return `{ ok: false, why }`. A parse failure never becomes
  whole-chapter scope; invalid citations contribute nothing and are reported in `invalid`.
- **Components.** `verses`, `chapter` (explicit whole chapter), `heading`, `doc`. Front matter uses exact document
  titles mapped to document paths (`bofm/eight`, `bofm/three`, `bofm/js`, `bofm/introduction`, title page, explanation,
  D&C and PGP introductions); Bible Dictionary entries use `bd/<slug>` with the title's first word matching the slug's.
  No invented chapter 0. Mixed citations are unions of components.
- **Complete intersection.** `groundLink` intersects every citation pair and unions the result per chapter/document; the
  class (`shared-verse` if any verse is cited explicitly by both, else `shared-chapter` if anything is shared, else
  `same-chapter` / `cross-text` / `no-locator`) never discards any of it. A heading meets only a heading, a document only
  that document; a whole chapter meets verses as those verses.
- **Containment.** `eligibility(model, edgeId, src)`: every component of every proposed locator lies in the matching
  shared component (verses ⊆ shared verses or a shared whole chapter; heading only in a shared heading; whole chapter
  only in a shared whole chapter; document only in that document). This is **mechanical eligibility only**.
- **Semantic acceptance.** `applyEdgeSources` now also requires a review entry (sidecar row, `v: 1`) with
  `state: 'accepted'`, `from`/`to` equal to the edge's endpoints (direction), `type` equal to the edge type, non-empty
  `claim`, `basis` (rationale) and `sourceVersion`. Rejections say whether the row was mechanically eligible.
- **Independent evidence.** `mode: 'independent'` with `evidence: { from: [...], to: [...] }`: each side must lie inside
  that endpoint's own citations, and a `scope` caveat is required. Not forced through shared-endpoint containment.
- **Reconciliation.** Promotions carry `edge.grounding`. Every call clears the source of any edge promoted earlier that is
  not accepted in this call and reports it in `revoked`, so a rejected/withdrawn review cannot leave a stale source.

Regression tests (`tests/atlas-timeline-grounding.test.ts`, 9 tests): the **eight false acceptances** all reject both
mechanically and with a full acceptance entry (and with the legacy `{ src }` shape); the **two false rejections** are
mechanically eligible (secondary D&C 8 overlap kept beside the shared 52:37; mixed `heading, 37` keeps its heading) but
promote nothing without acceptance; acceptance binding, reconciliation and independent mode each have their own test.

### Real ledger (tl17/grounding-ledger.mjs → tl17/see-grounding.csv, ledger-summary.json)

335 relationships; 0 promoted; 0 drawable. Classes vs checkpoint 15: shared-verse 73 (=), shared-chapter 13 → 14,
same-chapter 10 → 9, cross-text 231 → 229, no-locator 3 → 5, travel 5. Three rows change:

| Edge                                                 | Was          | Now                             | Why                                                                            |
| ---------------------------------------------------- | ------------ | ------------------------------- | ------------------------------------------------------------------------------ |
| `x:c:DCM-dr09-smith-family>c:DCM-dcp-hyrum-smith`    | same-chapter | shared-chapter (D&C 11 heading) | mixed `D&C 11 heading, 1` keeps its heading (the reviewer's real-row case)     |
| `x:c:BMV-043-jesse-ruler>c:OTM-a01-jesse`            | cross-text   | no-locator                      | `Isaiah 11 heading/notes` is unsupported syntax                                |
| `x:c:DCM-dcp-oliver-cowdery>c:PGM-qg14-cowdery-1834` | cross-text   | no-locator                      | `Joseph Smith—History, appended Cowdery note` has no approved section identity |

The last two are fail-closed results, not errors: both relationships were cross-text, so no shared evidence was lost.
Supporting a heading/notes component or a JS—H appended-note section would need an approved identity rule (ChatGPT's
call); until then they stay invalid and are listed in the ledger's `invalid_cites` column.

## TL-R13 residual (public/atlas/timeline-view.js)

`render()` decided whether the dialog owned focus after `draw()` had replaced the DOM, so on the second gate refresh the
focused Overview heading was already disconnected and focus fell to body. It now records ownership, focus key and region
**before** drawing and always recovers when the dialog owned focus.

`tl17/tl17-interaction-probe.mjs` = the checkpoint-16 probe plus step 9: twice at 390 and 1440, select a BoM record,
exclude BoM and refresh, restore and refresh, then Tab, Tab, Shift+Tab ×3. **98/98 PASS** with this head
(`tl17/interaction-probe-output.txt`); the same probe on the `c494aaa` view **fails 12** (second refresh on BODY, Tab
escaping to the page's `earth` button) — `tl17/interaction-probe-output-c494aaa-view.txt`. All 66 checkpoint-16
assertions still pass.

## Checks

`pnpm format`, `pnpm check` (144/144 tests, build, check:dist 122 files), `pnpm test:pages` (12 pages × 2 viewports),
`pnpm test:browser` pass. Browser runs use the pre-installed Chromium with software GL; not matched-browser, device or
AT acceptance.

## Next

The versioned review sidecar file (rows in the `v: 1` shape above) and the bounded 12-row pilot from the checkpoint-15
handoff. Adapter stays unwired; promotions stay 0 until rows are accepted.

## Addendum: pilot bindings, mechanical dry run only

ChatGPT's twelve-row pilot (HANDOFF_PLAN, commit `866854c`) arrived during this run. Without building or applying any
review entry, `tl17/pilot-eligibility.mjs` checks the **11 recommended rows** against the corrected module: the seven
shared-component rows (D&C 124:141, 52:37, 30:5–7, 124:126, D&C 4 heading, Testimony of Eight Witnesses document, D&C
11 heading) pass `eligibility`; the four cross-text rows (3 Ne 12:1–12 / Matt 5:1–12, 2 Ne 30:9, 11–15 / Isa 11:4–9,
Mosiah 14:1–12 / Isa 53:1–12, 2 Ne 17:1–9 / Isa 7:1–9) pass `independentEligibility`. 11/11 eligible, 0 promoted
(`tl17/pilot-eligibility-output.txt`). Row 10 (Babylon) stays deferred and was not checked.

Gap for the sidecar, for the reviewer: rows 3 and 9 rely on **supplementary evidence outside both card citations**
(D&C 30 heading for full names; Mosiah 13:1–6, 33–35 for Abinadi continuity). The v1 entry has one evidence role per
mode. Proposal for the sidecar unit: an optional `support: [{ role, src, note }]` list that is stored and shown but is
never containment-checked or promoted into `edge.src`. The sidecar itself waits for the mechanism to be accepted, as
the handoff asks.
