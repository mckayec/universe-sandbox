# Bounded LDS research audit: builder anchor review

Date: 2026-10-27. Verdict: **usable research response with two ordinary pins withheld; not final build approval**.

Audited research: `52adadf1558b8bba1c89ca266de682ccdc988767`, handoff `689b4959b520b5da57a6579e47877dd43726892b`. Builder proposal/review on main `ef345f6a52b17320076558bb2b682d2cff5c58c6`; associated PR33 head `326a572dd6ef0870f7d685c7c80daef2fa21a666` (open draft, not audit-ready). This pass covers Q01–Q04 and the 26 newly built coordinate proposals. It does not re-certify the full corpus, audit the older ten anchors, test PR33's runtime, or review PR24/29/Wheel of Time. No research stage or ownership changed.

## Findings and exact dispositions

| ID | Severity | Finding | Disposition / remaining gate |
|---|---|---|---|
| A01a | Medium | RP10 research says Murray rather than Thayer. | Corrected copy supplied in [addendum](research-addendum.md); NPS/Church/DNR support Thayer. Numeric reference stays labelled secondary. Builder integration pending. |
| A01b | Medium | AP15 must distinguish Nea/Kato from Palae Paphos and an episode point. | Gazetted replacement and official site evidence supplied. No governor's residence pinpoint claimed. |
| A01c | High | AP19 is not an uncontested identification in the source inspected. | Withhold ordinary Lystra pin; textual narrative survives. Stronger identification evidence or a separately reviewed candidate treatment needed. |
| A01d | High | RP12 primary/secondary coordinate conflict. | Withhold South Pass crossing pin until a primary georeferenced record resolves the discrepancy. Do not replace with the BLM number automatically. |
| A01e | Medium | Harmony's point scope and Patmos's gazetteer point can be overread. | Exact site-complex / Kastelli-associated island-reference copy supplied; no house, cave or vision-site claim. |
| A02 | Medium | Five work groups could be mistaken for cumulative reading prerequisites. | No canon objection to single mode; preserve layer filtering, provenance and work attribution. Runtime checks remain builder/final-audit work. |
| A03 | Medium | Schematic can imply solved geography or measured distances. | Owner approved schematic concept; seven cited relation rows and safeguards supplied. No approval of specific Earth models or live implementation. |
| A03-ART01 | Medium | Three owner-created comparison artifacts not positively identified. | Authorized Claude task placed in established addendum handoff; original artifacts/context needed before substantive comparison review. Private Claude project not inspected. |
| A04 | Low | Dense contextual rows are not unique map objects. | V1 display deferral acceptable with explicit imported/deferred/unlocated accounting and continued access to research. No silent loss of core inventories. |
| A05 | Low | Early research wording lags current status. | Addendum identifies authoritative research-ready / claude status; historical checkpoints and builder-owned status preserved. |

## Record accounting

The [disposition CSV](anchor-dispositions.csv) contains exactly one row per built proposal, with original coordinates, explicit replacement/retention/hold, evidence URL, marker wording and limitations.

- 11 `replace-representative`: AP12, AP13, AP14, AP15, AP18, AP21, AP22, AP27, AP28, AP29, AP33.
- 13 `conditional-retain-L`: P12, P13, P14, P15, P16, RP01, RP03, RP07, RP09, RP10, RP11, RP13, AP32.
- 2 `hold-ordinary-pin`: AP19, RP12; recommended coordinate cells deliberately empty.

No unbuilt row (Liberty Jail, unknown grove, regions/river reach, Derbe and other withheld NT stops) is silently promoted. Those are outside this 26-row audit and retain existing dispositions. `C-reported-gazetteer-point-only` is deliberately narrow: the point is reported by an opened gazetteer, not primary excavation evidence or a biblical event location. Retained `(L)` coordinates require visible approximate/secondary qualification or removal. Unknown `(U)` crossing placement must not ship.

## Validation and boundaries

Local validation checks the exact set against `anchors-proposal.csv`, unique record/site IDs, 11/13/2 counts, original value preservation, numeric ranges, empty coordinates for both holds, and all relative Markdown links in these deliverables. `git diff --check` checks whitespace. These checks validate the handoff's structure, not archaeological truth. Source inspection is documented in [anchor-sources.md](anchor-sources.md); no source-reading or capture hashes are fabricated.

Repository-required `pnpm format` / `pnpm check` results and final draft PR head/check status are reported in the publication checkpoint. The formatter targets application files; any resulting unrelated edit must be excluded. No application interaction changed here; PR33 screenshots, layer behavior, label collisions and route behavior still require final review on its eventual exact head.

The artifact search checked all 36 advertised branch heads, candidate paths in their trees, relevant docs/assets text, recent added files and commit-message history. It found existing research and builder screenshots but **0/3 positively identified original comparison artifacts**. This does not establish absence from private projects, attachments or repositories not searched. Request A03-ART01 records the precise missing inputs and the bounded authorized recipient/action.

## Remaining work for the builder / next focused review

Integrate the supplied corrections and record A01–A05 dispositions. Resolve or exclude AP19/RP12; label the thirteen provisional references. Use the approved schematic's relation-only contract and keep its archaeology comparison distinct. Supply the three artifacts and their source context for review; no artifact-specific discovery claim has yet been accepted. Preserve omitted-payload accounting and unknown places. Then submit a final build head for the usual canon/technical checks and owner release decision. This document is not permission to merge or deploy.

## Publication preflight update

Main advanced during this review to `dfcce4f4ac474f40a00ed5a9bf88fa6443ad7850`; the review branch was fast-forwarded before committing. PR33 advanced to `5897523b9cf7f75277bcf46d77c604587494c722`. The inspected pack diff adds label-priority flags and a checkpoint comment; no proposed anchor coordinates changed. Main adds checkpoint-6 notes/screenshots, not the requested comparison artifacts. The 26-row scope and dispositions above still apply; this does not audit the new label renderer.

Local structural/link checks passed (26 records, 11/13/2 dispositions, preserved originals, valid ranges, empty held points). `pnpm format` and `pnpm check` were attempted but stopped before execution with `ENOENT: mkdir /home/agent/.local/share/pnpm` during pnpm dependency setup. An existing dependency-directory link did not supply usable binaries and was removed. No test pass is claimed; no unrelated tracked file changed. Exact-head remote CI must be checked after publication.
