# Lore corrections implementation review

Reviewed by ChatGPT, 2026-10-25 (America/Denver).

## Target and method

PR [#24](https://github.com/mckayec/universe-sandbox/pull/24), branch `fix/lore-corrections`, exact head **d08c4d2851ea780d3c990f3a207eb267409bbb4a**. Head rechecked before recording. Compared all **40/40** dispositions (L1–L36 and N1–N4) in [corrections.md](corrections.md) with the complete PR diff, the actual pack/Society sources and the engine's rendering/gating logic at this head. Read Claude's implementation.md from this exact branch revision, not a presumed main copy.

Paths formerly named society.html/solar.html in corrections.md now have their data in society.js/solar.js. Object IDs, not the old line numbers, identify the targets. Dune has no requested mandatory edit and is unchanged in the PR.

This is an implementation-conformance review. It does not upgrade the earlier report's secondary-source or unresolved claims into primary-book canon certification.

## Verdict and counts

**Not approved: three blocking findings leave four required disposition rows incomplete.**

Of **40 rows**, **23** mandatory correction/cut rows conform to the prescribed changes, **4** are partially compliant (L1, L8, L29, L31), and **13** no-mandatory-change rows are preserved. Claude's “27 applied” counts rows touched; it is not 27 fully resolved corrections. Seven optional clarifications being omitted is acceptable.

## Blocking findings

### IR1 — L1: unsupported Forum location is still asserted (High)

At sun-eater.js:496, b7c still has `world:"forum"`. Removing `site:"eternal"` removes only the surface pin. The engine normalizer requires a valid event world (engine.js:400); the Chronicle renders that world's name (1083), world event lists select by e.world (924), and event navigation flies to it (1271–1275). The user still sees “Auctor” associated with Forum.

Required: remove the unverified geographical association. Within the present schema, omit b7c from the mapped EVENTS and retain “William names Hadrian Auctor of the Imperium.” only as book-7-gated, non-geographical codex content. Alternatively provide reviewed support for the location or an explicit unmapped-event engine feature in a separately scoped change. Do not relocate it to an invented coordinate or leave Forum as an undocumented placeholder. The route and Forum-era cuts already made should stay.

Acceptance: at book VII, neither the Forum dossier nor the Chronicle nor navigation associates the Auctor event with Forum; the neutral fact remains available without an asserted location.

### IR2 — L8: cumulative filtering does not finish the spoiler correction (High)

The named Hoyt/Johnny/Moneta/Rachel changes and Old Earth marker gate are implemented, but unconditional text still reveals later events. Actual evaluated pack objects show:

| Surface | Current earliest gate | Residual later text |
| --- | --- | --- |
| People: Brawne Lamia | 1 | Her base description still says she brings Silenus back from the Tree. This is not safe book-I base text. |
| Ideas & machines: The Shared Moment | 1 (no first/books property) | Describes Aenea's death on Pacem and the fall of the Pax/Core. |
| Factions: Lions and Tigers and Bears | 3 | The newly gated entry still includes A. Bettik's observer identity; the A. Bettik character entry itself identifies this as a Rise reveal. |

engine.js:1101–1107 renders a codex entry according to first/min(books), then renders its entire base role/description regardless of later books listed. A successful first-book check of three named character entries is insufficient.

Required safe changes: use Lamia's base “A private detective from Lusus, lover of the Keats cybrid Johnny.” and move the rescue sentence to `more[[2,...]]` (or cut it pending source confirmation). Gate The Shared Moment to book 4. For Lions and Tigers and Bears retain the book-3 relocated-Earth description, but remove “and used A. Bettik as their observer” from its base and move that fact to book 4. Audit the other rendered base roles/descriptions and world/site text implicated by L8; for example Duré's base Pope title, Gladstone's death and the Shrike's later alliance still sit in first-book entries. Cut uncertain details rather than inventing earliest gates. This is a pre-existing leak left unresolved by L8, not a claim that the PR introduced all these strings.

Acceptance: explicitly select book I, then II, III and IV and inspect every codex tab and affected world/site/deep link. Book I must not expose later deaths, identities or alliances; III must not expose the observer reveal; IV may show those verified details. Record checked IDs and gates, not just “codex passed”. Old Earth's `first:3` and named identity gates already added should stay.

### IR3 — L29/L31: Society spoiler controls remain incomplete (High)

At society.js:392 and :2982 the defaults remain `ERA=6` and `bookFilter=0`. society.html still selects All and labels the header “All six books”. The requested explicit all-books opt-in was not implemented. A Chronicle hint cannot protect the opening screen; Claude also notes that this hint is hidden on phones.

L31 has a related remaining gate error: society.js:160 gives the New Sparta POI `from:4`, but its new description refers to pressure on Lysander before the book-VI summit. The new l3/l3b events use book 6, so the location prose must respect the same reveal boundary. Setting a book-I default alone will not fix a reader selecting book IV.

Required: initialize Book I consistently across ERA, bookFilter, selected buttons, header and initial Chronicle rendering. Require an explicit selection for All, labelled “All six books · spoilers”, with a visible desktop/phone notice. Keep restored URL state consistent with an explicitly chosen book and document any opt-in persistence. For New Sparta either set `from:6`, or retain an earlier marker only with earlier-safe prose and gate/cut the book-VI detail. Keep the separate Rome summit event.

Acceptance: fresh desktop and phone loads show only the Book-I selection/content; All requires action. Check books IV/V for New Sparta leaks and VI for the two distinct locations/events. I accept that startup changes were outside Claude's self-imposed “content only” implementation scope; that explains the omission, but does not resolve the requested spoiler protection. Claude must implement the missing behavior in an appropriately scoped revision/PR before this review can pass.

## Full disposition reconciliation

| IDs | Count | Result |
| --- | --- | --- |
| L2–L4, L6, L9–L12, L14, L19–L23, L25, L27, L33–L35, N1–N4 | 23 | Prescribed mandatory text/cut/object changes present. L2 attribution neutralized and moved to era 7; L11 has a clearly schematic Belt marker and separate surrender; L23 removes the Narak pin; bundled years retain numeric spoiler keys; N3 route deleted. |
| L1 | 1 | Partial: text/site/route/era changes present; unsupported world pin remains (IR1). |
| L8 | 1 | Partial: named changes and Old Earth hiding present; other rendered late prose remains ungated (IR2). |
| L29 | 1 | Partial: five base blurbs/control repaired and later era text moved; safe startup/explicit opt-in absent (IR3). |
| L31 | 1 | Partial: prose split and Rome event present; New Sparta remains visible at book IV with book-VI prose (IR3). |
| L5, L7, L13, L15–L18, L24, L26, L28, L30, L32, L36 | 13 | No mandatory correction required; preserved. Optional clarifications may remain omitted. |
| Total | 40 | 23 conforming mandatory rows + 4 partial + 13 retained rows. |

L14's sequence matches the requested simplified path and includes a label property. Confirm the simplification is visible in the UI: a data-only label must not be mistaken for proof that users see it. This is a follow-up presentation check, not an additional blocking row.

## Validation evidence and limits

- Independently inspected GitHub [run 40179401669](https://github.com/mckayec/universe-sandbox/actions/runs/40179401669), job 121127346118: frozen install, formatting, build, unit tests, check:dist and standalone subpath browser checks all succeeded. Deploy job was skipped. Green technical checks do not detect these content/gate failures.
- Locally evaluated the five fetched changed pack files (Cosmere, Expanse, Foundation, Hyperion, Sun Eater) using Node's vm and a minimal window object: **5/5** loaded successfully. Inspected the evaluated Auctor event, Old Earth first gate and the three codex examples above. This was a focused data probe, not an app/browser test or a full repository test run.
- Claude reports 59/59 tests, 24 page/viewport combinations and 40+ browser content checks. I inspected the report but did not independently rerun those browser checks or inspect their screenshot pixels.
- Full primary-book verification remains outstanding as documented in corrections.md. No new source authority or dedicated Deep Research use is claimed.

## Handoff

Return to Claude for IR1–IR3. Keep the PR unmerged. Update implementation.md with per-finding dispositions, exact revised SHA, actual counts and targeted desktop/phone spoiler checks; then return implementation-review ownership to ChatGPT. Re-audit the changed revision before Mckay considers release approval.
